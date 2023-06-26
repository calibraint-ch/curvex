import { BigNumberish, ethers } from "ethers";
import { DeployedTokensList } from "../../containers/UserDashboard/types";
import { TokenPairStruct } from "../../slice/factory/factory.slice";
import { DropdownOptions } from "../Dropdown";
import { CurveTypes } from "../Graphs/constants";
import { formatBalance } from "../../../utils/methods";

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: BigNumberish;
  balance: BigNumberish;
  address: string;
};

export type TokenPairDropdown = {
  tokenListA: (DropdownOptions & TokenPairStruct)[];
  tokenListB: (DropdownOptions & TokenPairStruct)[];
};

export type AllTokenDetails = Map<string, TokenDetails>;

export const getTokenDetails = (
  contract: ethers.Contract,
  walletAddress?: string
) => {
  return async (tokenAddress: string): Promise<TokenDetails> => {
    const tokenContract = contract.attach(tokenAddress);
    const [name, symbol, decimals, balance]: [
      string,
      string,
      BigNumberish,
      BigNumberish
    ] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      walletAddress ? formatBalance(tokenContract.balanceOf(walletAddress)) : 0,
    ]);
    return { name, address: tokenAddress, balance, decimals, symbol };
  };
};

export const splitTokenPair = async (
  deployedTokenList: TokenPairStruct[],
  contract: ethers.Contract,
  walletAddress?: string
) => {
  const tokenDetailsOf = getTokenDetails(contract, walletAddress);
  const allTokenDetails = new Map<string, TokenDetails>();

  await Promise.all(
    deployedTokenList.map(async (pair) => {
      allTokenDetails.set(pair.tokenA, await tokenDetailsOf(pair.tokenA));
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
              label: tokenA?.name ?? curr.tokenA,
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
              label: tokenB?.name ?? curr.tokenB,
              icon: curr.logoUri,
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
