import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { useMetamask } from "use-metamask";
import { ethers } from "ethers";
import { errorMessages, supportedChains } from "../../utils/constants";

function useMetamaskProvider() {
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [chainId, setChainId] = useState("");
  const [balance, setBalance] = useState("");

  const { connect, metaState, getChain } = useMetamask();

  //For Future Reference
  const getBalance = useCallback(
    async (address: string) => {
      if (address && metaState.isConnected && metaState.web3) {
        const response = await metaState.web3.getBalance(address);
        const balanceEth = ethers.utils.formatEther(response);
        setBalance(balanceEth);
      }
    },
    [metaState.isConnected, metaState.web3]
  );

  const detectNetworkChange = () => {
    window.ethereum.on('chainChanged', async () => {
      if (getChain) {
        let chain = await getChain();
        if (!supportedChains.includes(chain.id)) {
          message.error(errorMessages.unSupportedNetwork);
        }
      }
    })
    return () => window.ethereum.removeListener('chainChanged', () => {
      window.location.reload()
    })
  }

  const connectWallet = async () => {
    if (metaState.isAvailable) {
      try {
        if (!metaState.isConnected) {
          await connect?.(ethers.providers.Web3Provider, "any");
          setConnected(true);
        }
      } catch (error) {
        message.error(errorMessages.connectWalletFailed);
      }
    } else {
      window.open("https://metamask.io/download/", "blank");
    }
  };

  useEffect(() => {
    if (metaState.isConnected) {
      const { name, id } = metaState.chain;
      setNetwork(name);
      setChainId(id);
      getBalance(metaState.account[0]);
    }
  }, [
    getBalance,
    metaState.account,
    metaState.chain,
    metaState.chain.id,
    metaState.isConnected,
  ]);

  return { connected, metaState, network, chainId, balance, connectWallet, detectNetworkChange };
}

export default useMetamaskProvider;
