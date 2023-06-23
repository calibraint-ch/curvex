import { ethers } from "ethers";
import useMetamaskProvider from "./useMetamaskProvider";
import { factoryContract } from "../../contracts/factoryContract";
import { factoryContractAddress } from "../../utils/constants";
import { DeployParams } from "./constants";

function useFactory() {
  const { metaState } = useMetamaskProvider();

  const getContractInstance = async (contractAddress: string) => {
    return new ethers.Contract(
      contractAddress,
      factoryContract.abi,
      metaState.web3.getSigner()
    );
  };

  const getTokenPairList = async () => {
    if (factoryContractAddress) {
      const contract = await getContractInstance(factoryContractAddress);
      const tokenPairs = await contract.getTokenPairList();
      return tokenPairs;
    }
  };

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
    getTokenPairList,
    deployBondingToken,
  };
}

export default useFactory;
