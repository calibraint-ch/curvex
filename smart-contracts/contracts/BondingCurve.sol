// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Interface/ICurvXErc20.sol";
import "hardhat/console.sol";

/**
 * @title CurvX Bonding curve formulas contract for the token vesting
 * @author Gowtham Kumarappan, @nandhabn
 * @notice This contracts helps the CurvX token contract to perform
 * the buy and sell functionality using the bonding curve mechanism.
 */
contract BondingCurve is Context {
    using SafeMath for uint256;

    uint256 public constant DECIMALS = 18;
    uint256 public immutable CURVE_PRECISION;

    address immutable tokenA;
    address immutable tokenB;
    uint256 public reserveBalance;
    uint256 public scalingFactor;
    uint256 public curveType;

    event Purchase(address indexed buyer, uint256 amount, uint256 cost);
    event Sale(address indexed seller, uint256 amount, uint256 refund);

    uint256 public totalSupply;

    constructor(
        uint256 precision,
        uint256 _curveType,
        address _tokenA,
        address _tokenB
    ) {
        curveType = _curveType;
        tokenA = _tokenA;
        tokenB = _tokenB;
        totalSupply = 0;
        CURVE_PRECISION = precision;
        scalingFactor = calculateScalingFactor();
    }

    function calculateScalingFactor() internal pure returns (uint256) {
        return (10 ** DECIMALS);
    }

    function calculatePurchaseReturn(
        uint256 _investment
    ) internal view returns (uint256) {
        if (curveType == 1) {
            // Linear Curve - (mx1^2 / 2) - (mx2^2 / 2); x1 > x2
            // here m is 1/CURVE_PRECISION
            uint256 newTotal = totalSupply + _investment;

            return
                newTotal
                    .mul(newTotal)
                    .mul(scalingFactor)
                    .div(2)
                    .div(scalingFactor)
                    .div(scalingFactor)
                    .div(CURVE_PRECISION)
                    .sub(reserveBalance);
        } else if (curveType == 2) {
            // Sublinear Curve
            return
                scalingFactor
                    .mul(
                        (CURVE_PRECISION.mul(_investment)).div(
                            CURVE_PRECISION.add(reserveBalance)
                        )
                    )
                    .div(CURVE_PRECISION);
        } else if (curveType == 3) {
            // S Curve
            uint256 temp1 = CURVE_PRECISION
                .mul(reserveBalance.add(_investment))
                .div(reserveBalance);
            uint256 temp2 = CURVE_PRECISION.mul(totalSupply).div(
                reserveBalance.add(_investment)
            );
            return scalingFactor.mul(temp1.sub(temp2)).div(CURVE_PRECISION);
        } else if (curveType == 4) {
            // Polynomial Curve
            return
                scalingFactor.mul(_investment.mul(_investment)).div(
                    CURVE_PRECISION.mul(CURVE_PRECISION)
                );
        } else {
            revert("Invalid curve type");
        }
    }

    function calculateSaleReturn(
        uint256 _amount
    ) internal view returns (uint256) {
        if (curveType == 1) {
            // Linear Curve - (mx1^2 / 2) - (mx2^2 / 2); x1 > x2
            // here m is CURVE_PRECISION
            uint256 newTotal = totalSupply.sub(_amount);
            return
                reserveBalance.sub(
                    newTotal.mul(newTotal).div(2).div(scalingFactor).mul(
                        CURVE_PRECISION
                    )
                );
        } else if (curveType == 2) {
            // Sublinear Curve
            return
                reserveBalance
                    .mul(CURVE_PRECISION)
                    .sub(
                        scalingFactor
                            .mul(reserveBalance.sub(_amount))
                            .mul(CURVE_PRECISION)
                            .div(
                                CURVE_PRECISION.add(reserveBalance.sub(_amount))
                            )
                    )
                    .div(CURVE_PRECISION);
        } else if (curveType == 3) {
            // S Curve
            uint256 temp1 = CURVE_PRECISION
                .mul(reserveBalance.sub(_amount))
                .div(reserveBalance);
            uint256 temp2 = CURVE_PRECISION.mul(totalSupply.sub(_amount)).div(
                reserveBalance.sub(_amount)
            );
            return scalingFactor.mul(temp1.sub(temp2)).div(CURVE_PRECISION);
        } else if (curveType == 4) {
            // Polynomial Curve
            uint256 temp1 = scalingFactor.mul(_amount).mul(
                CURVE_PRECISION.mul(CURVE_PRECISION)
            );
            uint256 temp2 = scalingFactor.mul(CURVE_PRECISION);
            return temp1.div(temp2);
        } else {
            revert("Invalid curve type");
        }
    }

    function _buy(uint256 amount) internal returns (uint256 priceForToken) {
        priceForToken = calculatePurchaseReturn(amount);
        ICurvXErc20(tokenA).mintAndLock(_msgSender(), amount);

        emit Purchase(msg.sender, amount, priceForToken);
    }

    function buy(uint256 amount) external {
        require(amount > 0, "Invalid investment amount");

        uint256 priceOfPurchase = _buy(amount);

        IERC20(tokenB).transferFrom(
            _msgSender(),
            address(this),
            priceOfPurchase
        );

        totalSupply += amount;
        reserveBalance = reserveBalance.add(priceOfPurchase);
    }

    function _sell(uint256 _amount) internal returns (uint256 refund) {
        refund = calculateSaleReturn(_amount);

        ICurvXErc20(tokenA).burn(_msgSender(), _amount);

        emit Sale(msg.sender, _amount, refund);
    }

    function sell(uint256 _amount) external {
        require(_amount > 0, "Invalid amount to sell");

        uint256 refund = _sell(_amount);

        IERC20(tokenB).transfer(_msgSender(), refund);

        reserveBalance = reserveBalance.sub(refund);
    }
}
