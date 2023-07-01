export const errorMessages = {
  connectWalletFailed: "Failed To Connect",
  unSupportedNetwork:
    "Unsupported Network, Kindly Connect To Supported Network",
  walletConnectionRequired: "Please connect wallet",
  insufficientBalance: "Insufficient balance to make transaction",
  vestingPeriodNotEnded: "Vesting Period Not Ended, Please Try Less Amount",
  transferTransfer: "Transaction failed with unknown error",

  precisionZero: "Precision should be greater than 0",
  precisionRequired: "Please input Precision!",

  exceedsBalance: "Withdrawal amount exceeds the balance",
};

export const NftStorageToken = process.env.REACT_APP_NFT_STORAGE_API_TOKEN;
export const factoryContractAddress = process.env.REACT_APP_FACTORY_CONTRACT;
export const defaultPublicRpc = process.env.REACT_APP_DEFAULT_PUBLIC_RPC;

export const pairTokenAddress = "0x12f60a7880a458c101fdfa84117e49b1ce3b4c1f";

export const defaultTokenDetails = { name: "", symbol: "", decimals: "" };

export const supportedChains = ["250", "4002"];

export const chainList = {
  mainnet: "250",
  testnet: "4002",
};

export const explorerList = {
  mainnetUrl: "https://ftmscan.com/tx/",
  testnetUrl: "https://testnet.ftmscan.com/tx/",
};

export const sections = {
  buy: "Buy",
  withdraw: "Withdraw",
};

export const responseMessages = {
  txnSuccess: "Transaction Success",
  txnFailed: "Transaction Failed",
  txnRejected: "Transaction Rejected",
  txnUnsuccessful: "Transaction Unsuccessful, Try Again",
};

export const messages = {
  buyGraph:
    "The Graph will be changed with respect to the selected token for purchase.",
  withdrawGraph:
    "The Graph will be changed with respect to the selected token for withdrawal.",
};

export const priceCardItems = {
  tokenA: "tokenA",
  tokenB: "tokenB",
  tokenAAmount: "tokenAAmount",
  tokenBAmount: "tokenBAmount",
  bondingCurveContract: "bondingCurveContract",
};

export const tokenInputPlaceholders = "Select Token";

export const UsdtLogoUrl =
  "https://cloudflare-ipfs.com/ipfs/bafkreia54sis5pb6ntttq6zwkd5xs4si2uzt32wtsf7jkbadivnyclhyom";

export const googleFormsLink = "https://forms.gle/x1epaYFko3PG7eiTA";
