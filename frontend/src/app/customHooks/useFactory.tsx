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
    const contract = await getContractInstance(factoryContractAddress);
    const tokenPairs = await contract.getTokenPairList();
    return tokenPairs;
  };

  const deployToken = async ({
    name,
    symbol,
    cap,
    lockPeriod,
    precision,
    curveType,
    pairToken,
    salt,
  }: DeployParams) => {
    const contract = await getContractInstance(factoryContractAddress);

    if (contract) {
      const deployTxnResponse = await contract.deploy(
        name,
        symbol,
        cap,
        lockPeriod,
        precision,
        curveType,
        pairToken,
        salt
      );

      return { hash: deployTxnResponse.hash };
    }

    return "";
  };

  return {
    metaState,
    getTokenPairList,
    deployToken,
  };
}

export default useFactory;
