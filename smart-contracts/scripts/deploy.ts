import { ethers } from "hardhat";

async function main() {
  const CBTFactory = await ethers.getContractFactory("CurveBondedToken");

  const CBTDeployed = await CBTFactory.deploy(
    "Fantom Curve Bonded Token",
    "FCBT",
    100
  );

  console.log(CBTDeployed.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
