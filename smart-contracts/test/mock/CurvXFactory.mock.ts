import { ethers } from "hardhat";

export default {
  tokenName: "CurvX",
  tokenSymbol: "CRVX",
  logoUri: "https://www.curvx.io",
  cap: ethers.utils.parseEther("10000000000000"),
  lockPeriod: 30 * 24 * 60 * 60,
  precision: 1000,
  curveType: 1,
  usdt: "usdt",
  salt: "0x5350fb9979070d67e882b3bc489c8e9c5960195c59a9257c38113dd19ba7a119",

  // Note - This address changes whenever the contract code is changed
  expectedDeployedAddress: {
    tokenA: "0x52e5afb91868d048FEd70a6c2D189a562ED390c4",
    tokenB: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    tokenManager: "0xf1B492fd409eE627a84b5B539D0820d228cE2505",
  },
};
