import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import mock from "./mock/CurvXFactory.mock";

describe("Token Factory", function () {
  after(async () => {
    await network.provider.request({
      method: "hardhat_reset",
    });
  });

  async function deployTokenFixture() {
    const Factory = await ethers.getContractFactory("CurveXFactory");
    const erc20 = await ethers.getContractFactory("ERC20");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const factory = await Factory.deploy();
    await factory.deployed();

    const usdt = await erc20.deploy(mock.usdt, mock.usdt);

    return { owner, addr1, addr2, Factory, factory, usdt };
  }

  it("should deploy token factory", async () => {
    const { factory, usdt } = await loadFixture(deployTokenFixture);

    await expect(
      factory.deployCurveX(
        mock.tokenName,
        mock.tokenSymbol,
        mock.cap,
        mock.lockPeriod,
        mock.reserveRatio,
        mock.curveType,
        usdt.address,
        mock.salt
      )
    ).not.to.be.reverted;

    const tokenList = await factory.getTokenPairList();

    const expected = mock.expectedDeployedAddress;

    console.log(tokenList[0]);

    expect(tokenList[0].tokenA).to.be.equal(expected.tokenA);
    expect(tokenList[0].tokenB).to.be.equal(expected.tokenB);
    expect(tokenList[0].tokenManager).to.be.equal(expected.tokenManager);
  });
});
