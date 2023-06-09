// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CurveX lockable erc20 contract
 * @author @nandhabn
 * @dev A standard erc20 implementation with the required
 * functionalities for token locking feature.
 */
contract CurveX_ERC20 is ERC20 {
    /// @notice Thrown when token name is too short or too long
    error TokenNameLengthOutOfRange(uint8 min, uint8 max);

    /// @notice Thrown when token symbol is too short or too long
    error TokenSymbolLengthOutOfRange(uint8 min, uint8 max);

    /// @notice Supply cap amount is out of range
    error SupplyCapOutOfRange(uint256 min, uint256 max);

    /// @notice While minting total supply exceeds supply cap
    error MintExceedsSupplyCap(uint256 amount, uint256 maximumMintable);

    /// @notice When transfer amount exceeds available transferable amount
    error InsufficientUnlockedTokens(
        uint256 unlockedBalance,
        uint256 minRequired
    );

    /// @notice Lock amount exceeds the transferable amount
    error LockAmountExceedsBalance(uint256 required, uint256 balance);

    /// @notice unlock called when unlockable balance is zero
    error UnlockableBalanceZero();

    /// @notice locking period is zero
    error LockingPeriodZero();

    /// @notice locking period is zero
    error TokenManagerZero();

    /**
     * @dev stores the amount and unlock timestamp required to unlock the token
     *
     * Params:
     *
     * - `amount` - amount of tokens to lock
     * - `unlockTimestamp` - lock period ending time(unix timestamp)
     */
    struct Lock {
        uint256 amount;
        uint256 unlockTimestamp;
    }

    /**
     * @dev emits when tokens are locked for a account
     *
     * @param account account address
     * @param amount amount of token to lock
     */
    event TokenLocked(address account, uint256 amount);

    /**
     * @dev emits when tokens are unlocked for a account
     *
     * @param account account address
     * @param amount amount of token to lock
     */
    event TokenUnlocked(address account, uint256 amount);

    /**
     * @dev list of locked balances of each accounts
     */
    mapping(address => uint256) _lockedBalances;

    /**
     * @dev Stores the list locks created for each accounts
     */
    mapping(address => Lock[]) _lockData;

    /**
     * @notice Total supply cap
     * @dev check constructor for value
     */
    uint256 public immutable SUPPLY_CAP;

    /**
     * @notice Default lock period for each lock
     * @dev check constructor for value
     */
    uint256 public immutable LOCK_PERIOD;

    /**
     * @dev initializes the token by setting the token details and role access
     *
     * Requirement:
     *
     * - `name` should not be empty
     * - `symbol` should not be empty
     * - `supplyCap` should not be zero
     *
     * @param name name of the token
     * @param symbol symbol of the token
     * @param supplyCap maximum mintable supply
     * @param lockPeriod default token locking period
     * @param tokenManager address of token manager
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 supplyCap,
        uint256 lockPeriod,
        address tokenManager
    ) ERC20(name, symbol) {
        if (bytes(name).length < 1 || bytes(name).length > 64)
            revert TokenNameLengthOutOfRange(1, 64);

        if (bytes(symbol).length < 1 || bytes(symbol).length > 64)
            revert TokenSymbolLengthOutOfRange(1, 64);

        if (supplyCap == 0) revert SupplyCapOutOfRange(1, type(uint256).max);

        if (lockPeriod == 0) revert LockingPeriodZero();

        if (tokenManager == address(0)) revert TokenManagerZero();

        SUPPLY_CAP = supplyCap;
        LOCK_PERIOD = lockPeriod;
    }

    /**
     * @dev Returns the amount of tokens locked in the given account address
     */
    function lockedBalanceOf(
        address account
    ) public view returns (uint256 balance) {
        balance = _lockedBalances[account];
    }

    /**
     * @dev locks token inside the contract
     *
     * Requirements:
     *
     * - `amount` should be less than or equal to the lockable balance
     *
     * Emits a {TokenLocked} event on successful token lock
     *
     * @param account account address
     * @param amount amount to lock inside
     */
    function _lock(address account, uint256 amount) internal {
        uint256 lockableBalance = balanceOf(account) - lockedBalanceOf(account);
        if (amount > lockableBalance)
            revert LockAmountExceedsBalance(amount, lockableBalance);

        Lock memory newLock = Lock(amount, block.timestamp + LOCK_PERIOD);
        _lockData[account].push(newLock);
        _lockedBalances[account] += amount;

        emit TokenLocked(account, amount);
    }

    /**
     * @dev returns the amount of tokens that can be unlocked by the account
     */
    function unlockableBalanceOf(
        address account
    ) external view returns (uint256 unlockableBalance) {
        Lock[] memory accountLockData = _lockData[account];
        unlockableBalance = 0;

        for (uint i = 0; i < accountLockData.length; i++) {
            if (accountLockData[i].unlockTimestamp <= block.timestamp) {
                unlockableBalance += accountLockData[i].amount;
            }
        }
    }

    /**
     * @dev unlocks all the token available for unlocking
     *
     * Requirement:
     *
     * - used must have tokens that are ready to unlock
     *
     * Emits a {TokenUnlocked} event on successful token lock
     */
    function unlock() external {
        address account = _msgSender();
        Lock[] storage accountLockData = _lockData[account];
        uint256 deletedCount = 0;
        uint256 balanceUnlockable = 0;
        uint256 lockDataLength = accountLockData.length;

        {
            uint i = 0;
            // calculates the amount to unlock
            while (i + deletedCount < lockDataLength) {
                if (accountLockData[i].unlockTimestamp < block.timestamp) {
                    balanceUnlockable += accountLockData[i].amount;
                    accountLockData[i] = accountLockData[
                        lockDataLength - 1 - deletedCount
                    ];
                    deletedCount++;
                } else {
                    i++;
                }
            }
        }

        if (deletedCount == 0) revert UnlockableBalanceZero();

        // Deletes the unlocked lock by resizing the array(bulk delete)
        assembly {
            sstore(
                accountLockData.slot,
                sub(sload(accountLockData.slot), deletedCount)
            )
        }
        _lockedBalances[account] -= balanceUnlockable;

        emit TokenUnlocked(account, balanceUnlockable);
    }

    /**
     * @dev Checks if from address has enough unlocked token
     *
     * This prevents the locked amount from being transferred
     *
     * Requirements:
     *
     * - `from` address should have enough unlocked balance
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if (from == address(0)) return;

        uint256 fromBalance = balanceOf(from);
        uint256 transferableBalance = fromBalance - _lockedBalances[from];

        if (transferableBalance < amount)
            revert InsufficientUnlockedTokens(transferableBalance, amount);
    }

    /**
     * @dev See {IERC20-balanceOf}.
     * @notice prevents total supply exceeding the supply cap
     *
     * Requirements:
     *
     * - `amount` should be less than or equal to mintable token amount
     */
    function _mint(address account, uint256 amount) internal virtual override {
        if (totalSupply() + amount > SUPPLY_CAP)
            revert MintExceedsSupplyCap(amount, SUPPLY_CAP - totalSupply());

        super._mint(account, amount);
    }

    /**
     * @dev This function lets the minter mint the tokens
     * and locks the minted token
     *
     * @param amount amount tokens to mint and lock
     */
    function mintAndLock(uint256 amount) public {
        _mint(_msgSender(), amount);

        _lock(_msgSender(), amount);
    }
}
