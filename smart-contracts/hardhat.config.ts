import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { environment } from "./environment";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
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
};

export default config;
