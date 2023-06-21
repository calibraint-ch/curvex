import { ethers } from "ethers";
import useMetamaskProvider from "./useMetamaskProvider";
import { factoryContract } from "../../contracts/factoryContract";
import { factoryContractAddress } from "../../utils/constants";
import { DeployParams } from "./constants";

function useFactory() {
  const { metaState } = useMetamaskProvider();

  const getContractInstance = async (contractAddress: string) => {
    return new ethers.Contract(
      factoryContractAddress,
      factoryContract.abi,
      metaState.web3.getSigner()
    );
  };

  const getTokenPairList = async () => {
    const contract = await getContractInstance(factoryContractAddress);
    const tokenPairs = await contract.getTokenPairList();
  };

  const deployToken = async ({
    name,
    symbol,
    cap,
    lockPeriod,
    precision,
    _curveType,
    pairToken,
    salt,
  }: DeployParams) => {
    const contract = await getContractInstance(factoryContractAddress);
    const deployTxn = await contract.deploy(
      name,
      symbol,
      cap,
      lockPeriod,
      precision,
      _curveType,
      pairToken,
      salt
    );
  };

  return {
    metaState,
    getTokenPairList,
  };
}

export default useFactory;
