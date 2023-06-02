import { useState } from "react";
import { ethers } from "ethers";
import useMetamaskProvider from "./useMetamaskProvider";
import { ecr20Abi } from "../../contracts/erc20";
import { contractAddress, defaultTokenDetails } from "../../utils/constants";

function useErc20() {
    const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

    const { metaState } = useMetamaskProvider();

    const getContractInstance = async (contractAddress: string) => {
        return new ethers.Contract(contractAddress, ecr20Abi, metaState.web3.getSigner());
    }

    const getTokenDetails = async () => {
        const contract = await getContractInstance(contractAddress);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        setTokenDetails((prev) => ({ ...prev, name, symbol, decimals }));
        return tokenDetails;
    }

    const mintErc20 = async (to: string, amount: number) => {
        const contract = await getContractInstance(contractAddress);
        const response = await contract.mint(to, amount);
        return response.hash;
    }

    const transferErc20 = async (to: string, amount: number) => {
        const contract = await getContractInstance(contractAddress);
        const response = await contract.transfer(to, amount);
        return response.hash;
    }

    const getTokenBalance = async (address: string) => {
        const contract = await getContractInstance(contractAddress);
        const balance = await contract.balanceOf(address);
        return balance.toString();
    }

    return { metaState, getTokenDetails, mintErc20, transferErc20, getTokenBalance };
}

export default useErc20;
