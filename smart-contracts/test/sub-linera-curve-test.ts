import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import mock from "./mock/sublinear.mock";

const AddZero = ethers.constants.AddressZero;

describe("Sub-linear Curve - BondingCurve.sol", function () {
  after(async () => {
    await network.provider.request({
      method: "hardhat_reset",
    });
  });

  async function deployTokenFixture() {
    //Getting instance of all contracts
    const Factory = await ethers.getContractFactory("CurveXFactory");
    const CurvX = await ethers.getContractFactory("CurveX_ERC20");
    const BondingCurve = await ethers.getContractFactory("BondingCurve");
    const erc20 = await ethers.getContractFactory("ERC20PresetMinterPauser");

    //Getting Signers
    const [owner, addr1, addr2] = await ethers.getSigners();

    //Deploy contracts
    const factory = await Factory.deploy();
    await factory.deployed();
    const usdt = await erc20.deploy(mock.usdt, mock.usdt);

    const DECIMALS = ethers.utils.parseEther("1");

    //Mint USD to addresses
    await usdt.mint(owner.address, mock.cap);
    await usdt.mint(addr1.address, mock.cap);
    await usdt.mint(addr2.address, mock.cap);

    //Call Function to deploy CurvX tokens
    await factory.deployCurveX(
      mock.tokenName,
      mock.tokenSymbol,
      mock.logoUri,
      mock.cap,
      mock.lockPeriod,
      mock.precision,
      mock.curveType,
      usdt.address,
      mock.salt
    );

    //Get tokenPairList
    const contractAddress = (await factory.getTokenPairList())[0];

    const tokenManager = BondingCurve.attach(contractAddress.tokenManager);
    const tokenA = CurvX.attach(contractAddress.tokenA);
    const tokenB = erc20.attach(contractAddress.tokenB);

    const PRECISION = await tokenManager.CURVE_PRECISION();

    return {
      owner,
      addr1,
      addr2,
      tokenA,
      tokenB,
      tokenManager,
      contractAddress,
      DECIMALS,
      PRECISION,
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

  //TODO:  Test all cases for sub-linear
  it("should be able to mint token from token manager for sub-linear curve", async () => {
    const { tokenA, tokenB, tokenManager, addr1, DECIMALS, PRECISION } =
      await loadFixture(deployTokenFixture);

    const buyAmount = ethers.BigNumber.from(DECIMALS);
    const price = DECIMALS;
    const scalingFactor = ethers.BigNumber.from(10).pow(DECIMALS);
    const reserveBalance = 0;

    const reserveBalanceNew = scalingFactor
      .mul(buyAmount)
      .div(PRECISION)
      .mul(Math.log2(buyAmount))
      .div(scalingFactor);
    const spendAmount = reserveBalanceNew.sub(reserveBalance);

    await expect(
      tokenB.connect(addr1).approve(tokenManager.address, spendAmount)
    ).not.to.be.reverted;

    await expect(tokenManager.connect(addr1).buy(buyAmount, 0, price))
      .to.emit(tokenA, "Transfer")
      .withArgs(AddZero, addr1.address, buyAmount)
      .to.emit(tokenB, "Transfer")
      .withArgs(addr1.address, tokenManager.address, spendAmount);
  });
});
