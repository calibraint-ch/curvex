import { BigNumber, BigNumberish, ethers } from "ethers";
import { UsdtLogoUrl } from "../../../utils/constants";
import { formatEtherBalance } from "../../../utils/methods";
import { DeployedTokensList } from "../../containers/UserDashboard/types";
import { TokenPairStruct } from "../../slice/factory/factory.slice";
import { DropdownOptions } from "../Dropdown";
import { CurveTypes } from "../Graphs/constants";
import { curveOptions } from "../Launchpad/constants";

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: BigNumberish;
  balance: BigNumberish;
  address: string;
  totalSupply: BigNumberish;
  curveType?: number;
  cap?: BigNumberish;
  precision?: BigNumber;
  manager?: string;
};

export type TokenPairDropdown = {
  tokenListA: (DropdownOptions & TokenPairStruct)[];
  tokenListB: (DropdownOptions & TokenPairStruct)[];
};

export type AllTokenDetails = Map<string, TokenDetails>;

export const getCurvXDetails = (
  contract: ethers.Contract,
  walletAddress?: string
) => {
  return async (
    tokenAddress: string,
    tokenPair: TokenPairStruct
  ): Promise<TokenDetails> => {
    const tokenContract = contract.attach(tokenAddress);
    const [name, symbol, decimals, balance, totalSupply]: [
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber
    ] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      walletAddress ? tokenContract.balanceOf(walletAddress) : 0,
      tokenContract.totalSupply(),
    ]);
    return {
      name,
      address: tokenAddress,
      balance: formatEtherBalance(balance, decimals),
      decimals,
      symbol,
      totalSupply,
      cap: tokenPair.cap,
      precision: tokenPair.precision,
      curveType: tokenPair.curveType,
      manager: tokenPair.tokenManager,
    };
  };
};

export const getErc20Details = (
  contract: ethers.Contract,
  walletAddress?: string
) => {
  return async (
    tokenAddress: string
  ): Promise<Omit<TokenDetails, "cap" | "curveType" | "precision">> => {
    const tokenContract = contract.attach(tokenAddress);
    const [name, symbol, decimals, balance, totalSupply]: [
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber
    ] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      walletAddress ? tokenContract.balanceOf(walletAddress) : 0,
      tokenContract.totalSupply(),
    ]);
    return {
      name,
      address: tokenAddress,
      balance: formatEtherBalance(balance, decimals),
      decimals,
      symbol,
      totalSupply,
    };
  };
};

export const splitTokenPair = async (
  deployedTokenList: TokenPairStruct[],
  contract: ethers.Contract,
  walletAddress?: string
) => {
  const curvXDetailsOf = getCurvXDetails(contract, walletAddress);
  const tokenDetailsOf = getErc20Details(contract, walletAddress);
  const allTokenDetails = new Map<string, TokenDetails>();

  await Promise.all(
    deployedTokenList.map(async (pair) => {
      allTokenDetails.set(pair.tokenA, await curvXDetailsOf(pair.tokenA, pair));
      allTokenDetails.set(pair.tokenB, await tokenDetailsOf(pair.tokenB));
    })
  );
  return {
    tokens: deployedTokenList.reduce<TokenPairDropdown>(
      (prev: TokenPairDropdown, curr: TokenPairStruct) => {
        const tokenA = allTokenDetails.get(curr.tokenA);
        const result = {
          tokenListA: [
            ...prev.tokenListA,
            {
              value: curr.tokenA,
              label: tokenA?.symbol ?? curr.tokenA,
              icon: curr.logoUri,
              ...curr,
            },
          ],
          tokenListB: [] as TokenPairDropdown["tokenListB"],
        };

        const hasTokenB =
          prev.tokenListB.findIndex(({ value }) => value === curr.tokenB) !==
          -1;
        if (hasTokenB) {
          result.tokenListB = prev.tokenListB;
          return result;
        }
        const tokenB = allTokenDetails.get(curr.tokenB);
        return {
          ...result,
          tokenListB: [
            ...prev.tokenListB,
            {
              value: curr.tokenB,
              label: tokenB?.symbol ?? curr.tokenB,
              icon: UsdtLogoUrl,
              ...curr,
            },
          ],
        };
      },
      {
        tokenListA: [],
        tokenListB: [],
      }
    ),
    allTokenDetails,
  };
};

const getCurveType = (type: number): CurveTypes | string => {
  switch (type) {
    case 1:
      return CurveTypes.linear;
    case 2:
      return CurveTypes.polynomial;
    default:
      return "--";
  }
};

export type ParseDeployedTokenListResult = Omit<DeployedTokensList, "token"> & {
  tokenAddress: string;
};

export const parseDeployedTokenList = (
  e: TokenPairStruct,
  index: number
): ParseDeployedTokenListResult => ({
  key: index + 1,
  tokenAddress: e.tokenA,
  totalSupply: ethers.utils.formatEther(e.cap),
  curveType: getCurveType(e.curveType),
  vestingPeriod: e.lockPeriod.div(3600 * 24) + " days",
});

export const getTokenName = (contract: ethers.Contract) => {
  return (
    deployedTokenList: ParseDeployedTokenListResult[]
  ): Promise<DeployedTokensList[]> => {
    return Promise.all(
      deployedTokenList.map(async ({ tokenAddress, ...rest }) => {
        const tokenContract = contract.attach(tokenAddress);
        const token: string = await tokenContract.name();
        return { token, ...rest };
      })
    );
  };
};

export const getLaunchpadPriceEstimate = (
  precision: number,
  curveType: string
) => {
  if (Number(precision)) {
    if (curveType === curveOptions[0].value) {
      return ethers.utils.formatEther(
        BigNumber.from(10).pow(18).div(2).div(precision)
      );
    } else if (curveType === curveOptions[1].value) {
      return ethers.utils.formatEther(
        BigNumber.from(10).pow(18).div(3).div(precision)
      );
    }
  }
  return 0;
};

export const getEstimationByCurveType = (
  tokenDetails: TokenDetails,
  amount: BigNumber,
  isBuy: boolean
) => {
  if (!tokenDetails.curveType) return 0;
  const curveType = getCurveType(tokenDetails.curveType);
  const totalSupply = BigNumber.from(tokenDetails.totalSupply);
  const precision = BigNumber.from(tokenDetails.precision);

  if (
    !totalSupply ||
    !precision ||
    precision.isZero() ||
    (!isBuy && totalSupply.isZero())
  ) {
    return 0;
  }

  if (isBuy) {
    console.log(isBuy);
    if (curveType === CurveTypes.linear) {
      return totalSupply
        .add(amount)
        .pow(2)
        .div(2)
        .div(BigNumber.from(10).pow(18))
        .div(precision)
        .sub(
          totalSupply
            .pow(2)
            .div(2)
            .div(BigNumber.from(10).pow(18))
            .div(precision)
        );
    } else if (curveType === CurveTypes.polynomial) {
      return totalSupply
        .add(amount)
        .pow(3)
        .div(3)
        .div(precision)
        .div(BigNumber.from(10).pow(18))
        .div(BigNumber.from(10).pow(18))
        .sub(
          totalSupply
            .pow(2)
            .div(precision)
            .div(BigNumber.from(10).pow(18))
            .div(BigNumber.from(10).pow(18))
            .div(2)
        );
    }
  } else {
    if (curveType === CurveTypes.linear) {
      return totalSupply
        .pow(2)
        .div(2)
        .div(BigNumber.from(10).pow(18))
        .div(precision)
        .sub(
          BigNumber.from(totalSupply.sub(amount))
            .pow(2)
            .div(2)
            .div(BigNumber.from(10).pow(18))
            .div(precision)
        );
    } else if (curveType === CurveTypes.polynomial) {
      return totalSupply
        .pow(3)
        .div(3)
        .div(BigNumber.from(10).pow(18))
        .div(BigNumber.from(10).pow(18))
        .div(precision)
        .sub(
          totalSupply
            .sub(amount)
            .pow(2)
            .div(precision)
            .div(BigNumber.from(10).pow(18))
            .div(BigNumber.from(10).pow(18))
            .div(2)
        );
    }
  }
};
