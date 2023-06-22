// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Context.sol";

import "./BondingCurve.sol";
import "./CurveXERC20.sol";

/**
 * @title CurveX factory
 * @author @nandhabn
 * @dev A factory contract for deploying the tokens
 */
contract CurveXFactory is Context {
    /// emits then a token is created
    /// @param token token address
    /// @param manager address of the token manager
    event TokenCreated(address token, address manager);

    /**
     * @dev contains te details of a token pair and token manager details
     */
    struct TokenPair {
        address tokenA;
        address tokenB;
        address tokenManager;
        string logoUri;
        uint8 curveType;
        uint256 lockPeriod;
        uint256 cap;
        uint256 precision;
    }

    TokenPair[] tokenPairs;

    /**
     * @dev returns the list of TokenPairs
     */
    function getTokenPairList() external view returns (TokenPair[] memory) {
        return tokenPairs;
    }

    /**
     * @dev creates a new token with a management contract
     *
     * @param name token name
     * @param symbol token symbol
     * @param logoUri token logo uri
     * @param cap token maximum supply
     * @param lockPeriod token period in seconds
     * @param precision token precision to calculate the price
     * @param _curveType type of bonding curve
     * @param pairToken token address to use for buy and sell
     * @param salt random salt for token deployment
     */
    function deployCurveX(
        string memory name,
        string memory symbol,
        string memory logoUri,
        uint256 cap,
        uint256 lockPeriod,
        uint256 precision,
        uint8 _curveType,
        address pairToken,
        uint256 salt
    ) public {
        // Deploy token contract
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

        // Deploy bonding curve contract
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

        // grant minter role for token manager contract
        CurveX_ERC20(token).grantRole(
            CurveX_ERC20(token).TOKEN_MANAGER_ROLE(),
            tokenManager
        );

        tokenPairs.push(
            TokenPair(
                token,
                pairToken,
                tokenManager,
                logoUri,
                _curveType,
                lockPeriod,
                cap,
                precision
            )
        );

        emit TokenCreated(address(token), address(tokenManager));
    }
}
