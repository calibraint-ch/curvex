import { ethers, run } from "hardhat";

async function main() {
  const CBTFactory = await ethers.getContractFactory("CurveXFactory");
  console.log("Deployer address: ", await CBTFactory.signer.getAddress());

  const CBTDeployed = await CBTFactory.deploy();

  await CBTDeployed.deployed();

  await run("verify:verify", {
    address: CBTDeployed.address,
    noCompile: true,
  });

  console.log("Deployed address: ", CBTDeployed.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
