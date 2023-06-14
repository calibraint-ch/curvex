import { ethers } from "hardhat";

export default {
  tokenName: "CurvX",
  tokenSymbol: "CRVX",
  cap: ethers.utils.parseEther("1"),
  lockPeriod: 30 * 24 * 60 * 60,
  reserveRatio: 10000,
  curveType: 1,
  usdt: "usdt",
  salt: "0x5350fb9979070d67e882b3bc489c8e9c5960195c59a9257c38113dd19ba7a119",

  // Note - This address changes whenever the contract code is changed
  expectedDeployedAddress: {
    tokenA: "0xde8dD38D598aD93A0631C0803E0CB691464E3F13",
    tokenB: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    tokenManager: "0x66250a28dc0FBcE3825D5324AD435C03258f7212",
  },
};
