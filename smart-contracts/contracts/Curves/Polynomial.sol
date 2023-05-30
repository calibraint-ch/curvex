// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Polynomial {
    using SafeMath for uint256;

    uint256 public constant PRECISION = 10 ** 7;
    uint256 public constant exponent = 6;

    function curveIntegral(uint256 _x) internal pure returns (uint256) {
        uint256 nexp = exponent.add(1);

        return PRECISION.div(nexp).mul(_x ** nexp).div(PRECISION);
    }

    function priceToMint(
        uint256 _amount,
        uint256 _totalSupply,
        uint256 _poolBalance
    ) public pure returns (uint256) {
        return curveIntegral(_totalSupply.add(_amount)).sub(_poolBalance);
    }
}
