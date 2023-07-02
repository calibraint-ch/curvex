import { ethers, run } from "hardhat";

async function main() {
  const CBTFactory = await ethers.getContractFactory("CurveXFactory");
  const fManager = await ethers.getContractFactory("BondingCurve");
  const fCurvx = await ethers.getContractFactory("CurveX_ERC20");

  const factory = CBTFactory.attach(
    // Factory contract address from testnet
    "0x674043FbF65AC958d439243f6403c1902F3A62eB"
  );

  const tx = await (
    await factory.deployCurveX(
      "cx",
      "cx",
      "cx.com",
      ethers.utils.parseEther("1000000"),
      1,
      100,
      1,
      "0x12f60A7880a458c101FdfA84117e49B1Ce3B4C1F",
      ethers.utils.solidityKeccak256(
        ["uint256"],
        [Math.round(Math.random() * 10000)]
      )
    )
  ).wait();

  console.log("Token deployed");
  console.log("tx hash: ", tx.transactionHash);

  const tokenList = await factory.getTokenPairList();
  const tokenManager = tokenList[tokenList.length - 1].tokenManager;
  const tokenAAddress = tokenList[tokenList.length - 1].tokenA;
  const tokenBAddress = tokenList[tokenList.length - 1].tokenB;

  const tokenA = fCurvx.attach(tokenAAddress);
  const manager = fManager.attach(tokenManager);

  await run("verify:verify", {
    address: tokenA.address,
    constructorArguments: ["cx", "cx", ethers.utils.parseEther("1000000"), 1],
    noCompile: true,
  });

  await run("verify:verify", {
    address: tokenManager,
    constructorArguments: [
      100,
      1,
      tokenA.address,
      "0x12f60A7880a458c101FdfA84117e49B1Ce3B4C1F",
    ],
    noCompile: true,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
