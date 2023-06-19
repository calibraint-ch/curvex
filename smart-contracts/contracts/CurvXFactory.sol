// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Context.sol";

import "./BondingCurve.sol";
import "./CurveXERC20.sol";

contract CurveXFactory is Context {
    event TokenCreated(address token, address manager);

    struct TokenPair {
        address tokenA;
        address tokenB;
        address tokenManager;
    }

    TokenPair[] tokenPairs;

    function getTokenPairList() external view returns (TokenPair[] memory) {
        return tokenPairs;
    }

    function deployCurveX(
        string memory name,
        string memory symbol,
        uint256 cap,
        uint256 lockPeriod,
        uint256 precision,
        uint256 _curveType,
        address pairToken,
        uint256 salt
    ) public {
        bytes memory tokenCreationCode = type(CurveX_ERC20).creationCode;

        bytes memory tokenBytecode = abi.encodePacked(
            tokenCreationCode,
            abi.encode(name, symbol, cap, lockPeriod)
        );

        address token;
        assembly {
            token := create2(
                0,
                add(tokenBytecode, 0x20),
                mload(tokenBytecode),
                salt
            )

            if iszero(extcodesize(token)) {
                revert(0, 0)
            }
        }

        bytes memory managerCreationCode = type(BondingCurve).creationCode;

        bytes memory managerBytecode = abi.encodePacked(
            managerCreationCode,
            abi.encode(precision, _curveType, token, pairToken)
        );

        address tokenManager;
        assembly {
            tokenManager := create2(
                0,
                add(managerBytecode, 0x20),
                mload(managerBytecode),
                salt
            )

            if iszero(extcodesize(tokenManager)) {
                revert(0, 0)
            }
        }

        CurveX_ERC20(token).grantRole(
            CurveX_ERC20(token).TOKEN_MANAGER_ROLE(),
            tokenManager
        );
        tokenPairs.push(TokenPair(token, pairToken, tokenManager));

        emit TokenCreated(address(token), address(tokenManager));
    }
}
