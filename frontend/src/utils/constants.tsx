export const errorMessages = {
  connectWalletFailed: "Failed To Connect",
  unSupportedNetwork:
    "Unsupported Network, Kindly Connect To Supported Network",
  walletConnectionRequired: "Please connect wallet",
};

export const NftStorageToken = process.env.REACT_APP_NFT_STORAGE_PRIVATE_KEY;
export const factoryContractAddress = process.env.REACT_APP_FACTORY_CONTRACT;
export const defaultPublicRpc = process.env.REACT_APP_DEFAULT_PUBLIC_RPC;

export const pairTokenAddress = "0x12f60a7880a458c101fdfa84117e49b1ce3b4c1f";

export const defaultTokenDetails = { name: "", symbol: "", decimals: "" };

export const supportedChains = ["250", "4002"];

export const chainList = {
  mainnet: "250",
  testnet: "4002",
};

export const sections = {
  buy: "Buy",
  withdraw: "Withdraw",
};

export const responseMessages = {
  txnSuccess: "Transaction Success",
  txnFailed: "Transaction Failed",
};

export const priceCardItems = {
  tokenA: "tokenA",
  tokenB: "tokenB",
  tokenAAmount: "tokenAAmount",
  tokenBAmount: "tokenBAmount",
};

export const tokenInputPlaceholders = "Select Token";
