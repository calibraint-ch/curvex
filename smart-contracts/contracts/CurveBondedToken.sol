// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Interface/IBondingCurve.sol";
import "./Interface/ICurve.sol";
import "./MaxGasPrice.sol";

contract CurveBondedToken is IBondingCurve, Ownable, MaxGasPrice, ERC20 {
    using SafeMath for uint256;

    // Use the same decimal places as ether.
    uint256 public scale = 10 ** 18;
    uint256 public poolBalance = 1 * scale;
    uint256 public reserveRatio;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _reserveRatio
    ) ERC20(name, symbol) {
        reserveRatio = _reserveRatio;
        _mint(msg.sender, 1 * scale);
    }

    function calculateCurvedMintReturn(
        uint256 _amount
    ) public view returns (uint256 mintAmount) {
        // TODO - modify address(0) with the management contract address
        return
            ICurve(address(0)).calculatePurchaseReturn(
                totalSupply(),
                poolBalance,
                uint32(reserveRatio),
                _amount
            );
    }

    function calculateCurvedBurnReturn(
        uint256 _amount
    ) public view returns (uint256 burnAmount) {
        // TODO - modify address(0) with the management contract address
        return
            ICurve(address(0)).calculateSaleReturn(
                totalSupply(),
                poolBalance,
                uint32(reserveRatio),
                _amount
            );
    }

    modifier validMint(uint256 _amount) {
        require(_amount > 0, "Amount must be non-zero!");
        _;
    }

    modifier validBurn(uint256 _amount) {
        require(_amount > 0, "Amount must be non-zero!");
        require(
            balanceOf(msg.sender) >= _amount,
            "Sender does not have enough tokens to burn."
        );
        _;
    }

    function _curvedMint(
        uint256 _deposit
    ) internal validGasPrice validMint(_deposit) returns (uint256) {
        uint256 amount = calculateCurvedMintReturn(_deposit);
        _mint(msg.sender, amount);
        poolBalance = poolBalance.add(_deposit);
        emit CurvedMint(msg.sender, amount, _deposit);
        return amount;
    }

    function _curvedBurn(
        uint256 _amount
    ) internal validGasPrice validBurn(_amount) returns (uint256) {
        uint256 reimbursement = calculateCurvedBurnReturn(_amount);
        poolBalance = poolBalance.sub(reimbursement);
        _burn(msg.sender, _amount);
        emit CurvedBurn(msg.sender, _amount, reimbursement);
        return reimbursement;
    }
}
