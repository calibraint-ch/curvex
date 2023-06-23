import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";

import { environment } from "./environment";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      viaIR: false,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      ftmTestnet: environment.etherscanKey,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    fantom: {
      url: "https://rpc.ankr.com/fantom/",
      accounts: [environment.walletPrivateAddress],
      chainId: 250,
    },
    tfantom: {
      url: "https://rpc.ankr.com/fantom_testnet",
      accounts: [environment.walletPrivateAddress],
      chainId: 4002,
    },
  },
  gasReporter: {
    coinmarketcap: environment.coinmarketcapKey,
  },
};

export default config;
