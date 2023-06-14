// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./Interface/ICurvXErc20.sol";
import "hardhat/console.sol";

/**
 * @title CurvX Bonding curve formulas contract for the token vesting
 * @author Gowtham Kumarappan, @nandhabn
 * @notice This contracts helps the CurvX token contract to perform
 * the buy and sell functionality using the bonding curve mechanism.
 */
contract BondingCurve is Context {
    error InsufficientLiquidity(uint256 required, uint256 available);

    address immutable tokenA;
    address immutable tokenB;
    uint256 public reserveBalance;
    uint256 public totalSupply;
    uint256 public reserveRatio; // in parts per million (ppm)

    /**
     * @notice Curve type used to determine the type of bonding curve
     *
     * Types:
     *  1 - Linear Curve
     *  2 - Polynomial Curve
     *  3 - Sub-linear Curve
     *  4 - S-Curve
     */
    uint256 public curveType;

    constructor(
        uint256 _reserveRatio,
        uint256 _curveType,
        address _tokenA,
        address _tokenB
    ) {
        require(
            _reserveRatio > 0 && _reserveRatio <= 1000000,
            "Invalid reserve ratio"
        );
        require(_curveType >= 1 && _curveType <= 4, "Invalid curve type");
        reserveRatio = _reserveRatio;
        curveType = _curveType;
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function buy(uint256 _amount) external payable {
        require(_amount > 0, "Invalid amount");
        uint256 tokensToMint = calculatePurchaseReturn(
            totalSupply + _amount,
            reserveBalance,
            reserveRatio,
            _amount,
            curveType
        );
        if (tokensToMint == 0) revert InsufficientLiquidity(tokensToMint, 0);
        totalSupply += tokensToMint;
        reserveBalance += _amount;
        IERC20(tokenB).transferFrom(_msgSender(), address(this), _amount);
        ICurvXErc20(tokenA).mintAndLock(_amount);
    }

    function sell(uint256 _amount) external {
        require(_amount > 0, "Invalid amount");
        require(_amount <= totalSupply, "Insufficient balance");
        uint256 reserveAmount = calculateSaleReturn(
            totalSupply,
            reserveBalance,
            reserveRatio,
            _amount,
            curveType
        );
        require(reserveAmount > 0, "Insufficient liquidity");
        totalSupply -= _amount;
        reserveBalance -= reserveAmount;

        ICurvXErc20(tokenA).burn(_msgSender(), _amount);
        IERC20(tokenB).transferFrom(_msgSender(), address(this), _amount);
    }

    function estimateBuy(
        uint256 _amount
    ) external view returns (uint256 tokensToMint) {
        require(_amount > 0, "Invalid amount");
        tokensToMint = calculatePurchaseReturn(
            totalSupply,
            reserveBalance,
            reserveRatio,
            _amount,
            curveType
        );
    }

    function estimateSell(
        uint256 _amount
    ) external view returns (uint256 tokensToMint) {
        require(_amount > 0, "Invalid amount");
        tokensToMint = calculateSaleReturn(
            totalSupply,
            reserveBalance,
            reserveRatio,
            _amount,
            curveType
        );
    }

    function calculatePurchaseReturn(
        uint256 _supply,
        uint256 _balance,
        uint256 _ratio,
        uint256 _amount,
        uint256 _curveType
    ) public pure returns (uint256) {
        if (_curveType == 1) {
            // Linear curve
            uint256 newBalance = _balance + _amount;
            uint256 price = (_supply * _amount) + _balance;
            return (price * _supply) / newBalance - _supply;
        } else if (_curveType == 2) {
            // Polynomial curve
            uint256 baseN = _balance + _amount;
            uint256 temp1 = (_balance ** 2 + (_amount << 1)) * _balance;
            uint256 temp2 = baseN ** (3);
            return (_supply * temp1) / (_ratio * temp2);
        } else if (_curveType == 3) {
            // Sub-linear curve
            uint256 baseN = _balance + _amount;
            uint256 temp1 = baseN ** (2);
            uint256 temp2 = _balance ** (2);
            return (_supply * temp1) / (_ratio * temp2) - _supply;
        } else if (_curveType == 4) {
            // S-curve
            uint256 exponent = (_amount * _supply * _ratio) /
                (_balance * 1000000);
            return
                (_balance *
                    (10 ** 18) *
                    (1 - (2 ** (uint256(-int256(exponent)))))) / (10 ** 18);
        } else {
            revert("Invalid curve type");
        }
    }

    function calculateSaleReturn(
        uint256 _supply,
        uint256 _balance,
        uint256 _ratio,
        uint256 _amount,
        uint256 _curveType
    ) public pure returns (uint256) {
        if (_curveType == 1) {
            // Linear curve
            uint256 newBalance = _balance - _amount;
            uint256 price = (_supply * _amount) + _balance;
            return (_supply * _balance) - (price * _supply) / newBalance;
        } else if (_curveType == 2) {
            // Polynomial curve
            uint256 temp1 = (_supply * (_balance ** 2)) / (_ratio * 1000000);
            uint256 temp2 = (_balance ** (2 + 1)) -
                ((_balance - _amount) ** (2 + 1));
            return temp1 * temp2;
        } else if (_curveType == 3) {
            // Sub-linear curve
            uint256 temp1 = (_supply * (_balance ** (2 - 1))) /
                (_ratio * 1000000);
            uint256 temp2 = (_balance ** (2 - 1)) -
                ((_balance - _amount) ** (2 - 1));
            return temp1 * temp2;
        } else if (_curveType == 4) {
            // S-curve
            uint256 exponent = (_amount * _supply * _ratio) /
                (_balance * 1000000);
            return
                (_balance *
                    (10 ** 18) *
                    (1 - (2 ** (uint256(-int256(exponent)))))) / (10 ** 18);
        } else {
            revert("Invalid curve type");
        }
    }
}
