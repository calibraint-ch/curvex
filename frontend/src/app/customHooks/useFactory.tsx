import { message } from "antd";
import { ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { factoryContract } from "../../contracts/factoryContract";
import {
  defaultPublicRpc,
  errorMessages,
  factoryContractAddress,
} from "../../utils/constants";
import {
  selectFactoryLoaded,
  selectFactoryLoading,
  selectFactoryTokenList,
} from "../slice/factory/factory.selector";
import {
  TokenPairStruct,
  setLoadingList,
  setTokenList,
} from "../slice/factory/factory.slice";
import { DeployParams } from "./constants";
import useMetamaskProvider from "./useMetamaskProvider";

function useFactory() {
  const { metaState } = useMetamaskProvider();
  const factoryLoaded = useSelector(selectFactoryLoaded);
  const factoryLoading = useSelector(selectFactoryLoading);
  const deployedTokenList = useSelector(selectFactoryTokenList);
  const dispatch = useDispatch();

  const getContractInstance = useCallback(
    async (contractAddress: string, readOnly?: boolean) => {
      if (readOnly && metaState.web3) {
        const provider = new ethers.providers.JsonRpcProvider(defaultPublicRpc);
        return new ethers.Contract(
          contractAddress,
          factoryContract.abi,
          provider
        );
      }

      try {
        return new ethers.Contract(
          contractAddress,
          factoryContract.abi,
          metaState.web3.getSigner()
        );
      } catch (e: any) {
        message.error(errorMessages.walletConnectionRequired);
        throw new Error(errorMessages.walletConnectionRequired);
      }
    },
    [metaState.web3]
  );

  const deployBondingToken = async ({
    name,
    symbol,
    cap,
    lockPeriod,
    precision,
    curveType,
    pairToken,
    logoURL,
    salt,
  }: DeployParams) => {
    if (factoryContractAddress) {
      const contract = await getContractInstance(factoryContractAddress);

      if (contract) {
        const deployTxnResponse = await contract.deployCurveX(
          name,
          symbol,
          logoURL,
          cap,
          lockPeriod,
          precision,
          curveType,
          pairToken,
          salt
        );

        return deployTxnResponse;
      }

      return "";
    }
  };

  const getTokenPairList = useCallback(async () => {
    if (factoryContractAddress) {
      const contract = await getContractInstance(factoryContractAddress, true);
      const tokenPairs: TokenPairStruct[] = await contract.getTokenPairList();
      return tokenPairs ?? [];
    }
    return [];
  }, [getContractInstance]);

  const updateFactorySlice = useCallback(async () => {
    const tokenPair = await getTokenPairList();

    dispatch(setTokenList(tokenPair));
  }, [dispatch, getTokenPairList]);

  useEffect(() => {
    if (!factoryLoaded && !factoryLoading) {
      dispatch(setLoadingList());
      updateFactorySlice();
    }
  }, [dispatch, factoryLoaded, factoryLoading, updateFactorySlice]);

  return {
    deployedTokenList,
    metaState,
    getTokenPairList,
    deployBondingToken,
  };
}

export default useFactory;
