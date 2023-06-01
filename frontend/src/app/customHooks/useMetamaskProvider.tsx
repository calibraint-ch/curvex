import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useMetamask } from 'use-metamask';
import { ethers } from 'ethers';
import { errorMessages } from '../../utils/constants'

function useMetamaskProvider() {
    const [connected, setConnected] = useState(false);
    const [network, setNetwork] = useState('');
    const [chainId, setChainId] = useState('');
    const [balance, setBalance] = useState('');

    const { connect, metaState } = useMetamask();

    //For Future Reference
    const getBalance = async (address: string) => {
        if (address && metaState.isConnected && metaState.web3) {
            const response = await metaState.web3.getBalance(address);
            const balanceEth = ethers.utils.formatEther(response);
            setBalance(balanceEth);
        }
    };

    const connectWallet = async () => {
        if (metaState.isAvailable && !metaState.isConnected) {
            try {
                const provider = ethers.providers.Web3Provider;
                await connect?.(provider, "any");
                setConnected(true);
            } catch (error) {
                message.error(errorMessages.connectWalletFailed)
            }
        } else {
            window.open('https://metamask.io/download/', 'blank')
        }
    }

    useEffect(() => {
        if (metaState.isConnected) {
            const { name, id } = metaState.chain;
            setNetwork(name)
            setChainId(id)
            getBalance(metaState.account[0])
        }
    }, [metaState.account, metaState.chain.id])

    return { connected, metaState, network, chainId, balance, connectWallet }
}

export default useMetamaskProvider;
