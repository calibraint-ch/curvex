import { message } from "antd";
import { ethers } from "ethers";
import { useCallback } from "react";
import { curvxErc20 } from "../../contracts/curvxErc20";
import {
  defaultPublicRpc,
  errorMessages,
  factoryContractAddress,
} from "../../utils/constants";
import { DeployParams } from "./constants";
import useMetamaskProvider from "./useMetamaskProvider";

function useErc20() {
  const { metaState } = useMetamaskProvider();

  const getContractInstance = useCallback(
    async (contractAddress: string, readOnly?: boolean) => {
      if (readOnly && !metaState.web3) {
        const provider = new ethers.providers.JsonRpcProvider(defaultPublicRpc);
        return new ethers.Contract(contractAddress, curvxErc20.abi, provider);
      }
      try {
        return new ethers.Contract(
          contractAddress,
          curvxErc20.abi,
          await metaState.web3.getSigner()
        );
      } catch (e: any) {
        message.error(errorMessages.walletConnectionRequired);
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

  return {
    metaState,
    deployBondingToken,
    getContractInstance,
  };
}

export default useErc20;
