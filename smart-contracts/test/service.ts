import { ethers } from "hardhat";
import { BigNumberish } from "@ethersproject/bignumber";

export function sqrt(value: BigNumberish) {
  const x = ethers.BigNumber.from(value);
  let z = x.add(1).div(2);
  let y = x;
  while (z.sub(y).isNegative()) {
    y = z;
    z = x.div(z).add(z).div(2);
  }
  return y;
}
