import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { ethers } from "ethers";
import { useMetamask } from "use-metamask";
import { errorMessages, supportedChains } from "../../utils/constants";
import { setNetwork, setWallet, resetWallet } from "../slice/wallet.slice";

function useMetamaskProvider() {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState("");

  const { connect, metaState, getChain } = useMetamask();
  const dispatch = useDispatch();

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

  const getCurrentNetwork = async (): Promise<string> => {
    if (getChain) {
      const chain = await getChain();
      return chain.id;
    }
    return "";
  };

  const detectNetworkChange = async () => {
    window.ethereum.on("chainChanged", async () => {
      const chainId = await getCurrentNetwork();
      if (!supportedChains.includes(chainId)) {
        message.error(errorMessages.unSupportedNetwork);
        dispatch(resetWallet());
      } else {
        dispatch(setNetwork(chainId));
      }
    });
    return () =>
      window.ethereum.removeListener("chainChanged", () => {
        window.location.reload();
      });
  };

  const connectWallet = async () => {
    if (metaState.isAvailable) {
      try {
        const chainId = await getCurrentNetwork();
        if (!supportedChains.includes(chainId)) {
          message.error(errorMessages.unSupportedNetwork);
          dispatch(resetWallet());
          return;
        } else {
          dispatch(setNetwork(chainId));
          dispatch(setWallet(metaState.account[0]));
        }

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
      dispatch(setWallet(metaState.account[0]));
      getBalance(metaState.account[0]);
    }
  }, [dispatch, getBalance, metaState.account, metaState.isConnected]);

  return { connected, metaState, balance, connectWallet, detectNetworkChange };
}

export default useMetamaskProvider;
