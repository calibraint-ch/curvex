// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error InsufficientUnlockedTokens(uint256 unlockedBalance, uint256 minRequired);

error MintExceedsSupplyCap(uint256 amount, uint256 maximumMintable);

error SupplyCapNotInRange(uint256 min, uint256 max);

error TokenNameLengthNotInRange(uint8 min, uint8 max);

error TokenSymbolLengthNotInRange(uint8 min, uint8 max);

/**
 * @title CurveX lockable erc20 contract
 * @author @nandhabn
 * @dev A standard erc20 implementation with the required
 * functionalities for token locking feature.
 */
contract CurveX_ERC20 is ERC20, AccessControl {
    /**
     * @notice Role Id of the `UNLOCK_ROLE`
     */
    bytes32 public constant UNLOCK_ROLE = keccak256("UNLOCK_ROLE");

    /**
     * @dev list of locked balances of each accounts
     */
    mapping(address => uint256) _lockedBalances;

    /**
     * @notice Total supply cap
     * @dev check constructor for value
     */
    uint256 public immutable SUPPLY_CAP;

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
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 supplyCap
    ) ERC20(name, symbol) {
        if (bytes(name).length <= 0) revert TokenNameLengthNotInRange(0, 64);

        if (bytes(symbol).length <= 0)
            revert TokenSymbolLengthNotInRange(0, 64);

        if (supplyCap <= 0) revert SupplyCapNotInRange(1, type(uint256).max);

        grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        grantRole(UNLOCK_ROLE, _msgSender());
        SUPPLY_CAP = supplyCap;
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

        uint256 fromBalance = balanceOf(from);
        uint256 transferableBalance = fromBalance - _lockedBalances[from];

        if (transferableBalance >= amount)
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
        super._mint(account, amount);

        if (totalSupply() + amount <= SUPPLY_CAP)
            revert MintExceedsSupplyCap(amount, SUPPLY_CAP - totalSupply());
    }
}
