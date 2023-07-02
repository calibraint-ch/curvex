import { message } from "antd";
import { ethers } from "ethers";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { curvxErc20 } from "../../contracts/curvxErc20";
import {
  chainList,
  defaultChainId,
  defaultPublicRpc,
  defaultPublicRpcTestnet,
  errorMessages,
  factoryContractAddress,
  factoryContractAddressTestnet,
} from "../../utils/constants";
import { selectNetwork } from "../slice/wallet.selector";
import { DeployParams } from "./constants";
import useMetamaskProvider from "./useMetamaskProvider";

function useErc20() {
  const { metaState } = useMetamaskProvider();
  const chainId = useSelector(selectNetwork);

  const getContractInstance = useCallback(
    async (contractAddress: string, readOnly?: boolean) => {
      if (readOnly && !metaState.web3) {
        const network = chainId || defaultChainId;
        const rpc =
          network === chainList.mainnet
            ? defaultPublicRpc
            : defaultPublicRpcTestnet;
        const provider = new ethers.providers.JsonRpcProvider(rpc);
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
    [chainId, metaState.web3]
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
    const network = chainId || defaultChainId;
    const factoryAdd =
      network === chainList.mainnet
        ? factoryContractAddress
        : factoryContractAddressTestnet;
    if (factoryAdd) {
      const contract = await getContractInstance(factoryAdd);

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
