import { BigNumberish } from "ethers";

export type DeployParams = {
  name: string;
  symbol: string;
  cap: BigNumberish;
  lockPeriod: BigNumberish;
  precision: BigNumberish;
  curveType: BigNumberish;
  pairToken: string;
  logoURL: string;
  salt: string;
};
