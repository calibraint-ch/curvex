// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../Interface/ICurve.sol";

contract Linear is ICurve {
    using SafeMath for uint256;

    // Set decimals equal to ether for testing purposes.
    uint256 public constant decimals = 10 ** 18;

    function calculatePurchaseReturn(
        uint256 _totalSupply,
        uint256 _poolBalance,
        uint256,
        uint256 _amount
    ) public pure returns (uint256) {
        uint256 newTotal = _totalSupply.add(_amount);
        // x^2 / 2 + c
        uint256 price = (decimals * newTotal ** 2) /
            (2 * decimals * decimals) -
            _poolBalance;
        return price;
    }

    function calculateSaleReturn(
        uint256 _totalSupply,
        uint256 _poolBalance,
        uint256,
        uint256 _amount
    ) public pure returns (uint256) {
        uint256 newTotal = _totalSupply.sub(_amount);
        return _poolBalance - newTotal ** 2 / (2 * decimals);
    }
}

/**
  function estimateTokenAmountForPrice(uint256 price) public view returns(uint256 tokenAmount) {
    uint256 newTotal = sqrt((price + poolBalance) * 2 / multiple) * dec;
    return newTotal;
  }

  function sqrt(uint256 x) public pure returns (uint256 y) {
    uint256 z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
} */
