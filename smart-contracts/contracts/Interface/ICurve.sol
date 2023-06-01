// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Curve Interface
 * @dev This interface contains method for calculating the purchase/sell price.
 */
interface ICurve {
    function calculatePurchaseReturn(
        uint256 _totalSupply,
        uint256 _poolBalance,
        uint256 _reserveRatio,
        uint256 _amount
    ) external pure returns (uint256);

    function calculateSaleReturn(
        uint256 _totalSupply,
        uint256 _poolBalance,
        uint256 _reserveRatio,
        uint256 _amount
    ) external pure returns (uint256);
}
