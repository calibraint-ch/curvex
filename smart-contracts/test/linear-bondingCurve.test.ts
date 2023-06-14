import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import mock from "./mock/BondingCurve.mock";
import factoryMock from "./mock/CurvXFactory.mock";

describe("Token Manager - BondingCurve.sol", function () {
  after(async () => {
    await network.provider.request({
      method: "hardhat_reset",
    });
  });

  async function deployTokenFixture() {
    const Factory = await ethers.getContractFactory("CurveXFactory");
    const CurvX = await ethers.getContractFactory("CurveX_ERC20");
    const BondingCurve = await ethers.getContractFactory("BondingCurve");
    const erc20 = await ethers.getContractFactory("ERC20");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const factory = await Factory.deploy();
    await factory.deployed();

    const usdt = await erc20.deploy(factoryMock.usdt, factoryMock.usdt);
    await factory.deployCurveX(
      factoryMock.tokenName,
      factoryMock.tokenSymbol,
      factoryMock.cap,
      factoryMock.lockPeriod,
      factoryMock.reserveRatio,
      factoryMock.curveType,
      usdt.address,
      factoryMock.salt
    );
    const contractAddress = factoryMock.expectedDeployedAddress;

    const tokenManager = BondingCurve.attach(contractAddress.tokenManager);
    const tokenA = CurvX.attach(contractAddress.tokenA);
    const tokenB = erc20.attach(contractAddress.tokenB);

    return {
      owner,
      addr1,
      addr2,
      tokenA,
      tokenB,
      tokenManager,
      contractAddress,
    };
  }

  it("should have token A, token B and token Manager", async () => {
    const { tokenA, tokenB, contractAddress, tokenManager } = await loadFixture(
      deployTokenFixture
    );

    expect(tokenA.address).to.be.equal(contractAddress.tokenA);
    expect(tokenB.address).to.be.equal(contractAddress.tokenB);
    expect(tokenManager.address).to.be.equal(contractAddress.tokenManager);
  });

  it("should be able to mint token from token manager", async () => {
    const { tokenA, tokenB, contractAddress, tokenManager, addr1 } =
      await loadFixture(deployTokenFixture);

    await tokenManager.buy(100000000000);
  });
});
