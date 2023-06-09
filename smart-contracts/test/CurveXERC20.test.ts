import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const AddressZero = ethers.constants.AddressZero;

describe("Token contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("CurveX_ERC20");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const oneEther = ethers.utils.parseEther("1");

    const CAP = oneEther.mul(1_000_000);
    const oneMonth = 60 * 60 * 24 * 30;
    const curveX = await Token.deploy(
      "CurveX",
      "CVX",
      CAP,
      oneMonth,
      owner.address
    );

    await curveX.deployed();

    return { Token, curveX, owner, addr1, addr2, oneEther, CAP, oneMonth };
  }

  describe("Deployment", function () {
    const tokenName = "CurveX";
    const tokenSymbol = "CVX";

    it("Should not deploy if name is empty or more than 64 characters", async function () {
      const { Token, CAP, oneMonth, owner } = await loadFixture(
        deployTokenFixture
      );

      await expect(Token.deploy("", tokenSymbol, CAP, oneMonth, owner.address))
        .to.be.revertedWithCustomError(Token, "TokenNameLengthOutOfRange")
        .withArgs(1, 64);

      await expect(
        Token.deploy("a".repeat(65), tokenSymbol, CAP, oneMonth, owner.address)
      )
        .to.be.revertedWithCustomError(Token, "TokenNameLengthOutOfRange")
        .withArgs(1, 64);
    });

    it("Should not deploy if symbol is empty or more than 64 characters", async function () {
      const { Token, CAP, oneMonth, owner } = await loadFixture(
        deployTokenFixture
      );

      await expect(Token.deploy(tokenName, "", CAP, oneMonth, owner.address))
        .to.be.revertedWithCustomError(Token, "TokenSymbolLengthOutOfRange")
        .withArgs(1, 64);

      await expect(
        Token.deploy("CurveX", "a".repeat(65), CAP, oneMonth, owner.address)
      )
        .to.be.revertedWithCustomError(Token, "TokenSymbolLengthOutOfRange")
        .withArgs(1, 64);
    });

    it("Should not deploy if supplyCap is zero", async function () {
      const { Token, oneMonth, owner } = await loadFixture(deployTokenFixture);

      await expect(
        Token.deploy(tokenName, tokenSymbol, 0, oneMonth, owner.address)
      )
        .to.be.revertedWithCustomError(Token, "SupplyCapOutOfRange")
        .withArgs(
          1,
          BigInt(
            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
          )
        );
    });

    it("Should not deploy if locking period is empty or 0", async function () {
      const { Token, CAP, owner } = await loadFixture(deployTokenFixture);

      await expect(
        Token.deploy(tokenName, tokenSymbol, CAP, 0, owner.address)
      ).to.be.revertedWithCustomError(Token, "LockingPeriodZero");
    });

    it("Should not deploy if token manger address is zero", async function () {
      const { Token, CAP, oneMonth } = await loadFixture(deployTokenFixture);

      await expect(
        Token.deploy(tokenName, tokenSymbol, CAP, oneMonth, AddressZero)
      ).to.be.revertedWithCustomError(Token, "TokenManagerZero");
    });
  });

  describe("Single mint and lock", function () {
    it("Should be total supply zero", async function () {
      const { curveX } = await loadFixture(deployTokenFixture);

      expect(await curveX.totalSupply()).to.equal(0);
    });

    it("Should revert if there is not any token locked in a account", async function () {
      const { curveX } = await loadFixture(deployTokenFixture);

      await expect(curveX.unlock()).to.be.revertedWithCustomError(
        curveX,
        "UnlockableBalanceZero"
      );
    });

    it("Should revert if total supply exceeds supply cap", async function () {
      const { curveX, CAP } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(CAP)).not.to.be.reverted;

      await expect(curveX.mintAndLock(1))
        .to.be.revertedWithCustomError(curveX, "MintExceedsSupplyCap")
        .withArgs(1, 0);
    });

    it("Should mint and lock tokens", async function () {
      const { curveX, owner } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );
    });

    it("Should prevent locked balance being transferred", async function () {
      const { curveX, owner, addr1 } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await expect(curveX.transfer(addr1.address, 50))
        .to.be.revertedWithCustomError(curveX, "InsufficientUnlockedTokens")
        .withArgs(0, 50);
    });

    it("Should unlock if unlock period is reached", async function () {
      const { curveX, owner, oneMonth } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await time.increase(oneMonth);

      expect(await curveX.unlockableBalanceOf(owner.address)).to.be.equal(50);

      await expect(curveX.unlock()).not.to.be.reverted;

      expect(await curveX.lockedBalanceOf(owner.address)).to.be.equal(0);
    });

    it("Token amount should be transferable after it is unlocked", async function () {
      const { curveX, owner, addr1, oneMonth } = await loadFixture(
        deployTokenFixture
      );

      await expect(curveX.mintAndLock(50))
        .to.changeTokenBalances(curveX, [owner], [50])
        .to.emit(curveX, "TokenLocked")
        .withArgs(owner.address, 50);

      await time.increase(oneMonth);

      await expect(curveX.unlock())
        .to.emit(curveX, "TokenUnlocked")
        .withArgs(owner.address, 50).not.to.be.reverted;

      await expect(curveX.transfer(addr1.address, 50)).to.changeTokenBalances(
        curveX,
        [owner, addr1],
        [-50, 50]
      );
    });
  });

  describe("Multiple mint and lock", function () {
    it("Should be total supply zero", async function () {
      const { curveX } = await loadFixture(deployTokenFixture);

      expect(await curveX.totalSupply()).to.equal(0);
    });

    it("Should mint and lock tokens", async function () {
      const { curveX, owner } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );
    });

    it("Should prevent locked balance being transferred", async function () {
      const { curveX, owner, addr1 } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await expect(curveX.transfer(addr1.address, 50))
        .to.be.revertedWithCustomError(curveX, "InsufficientUnlockedTokens")
        .withArgs(0, 50);
    });

    it("Should unlock if unlock period is reached", async function () {
      const { curveX, owner, oneMonth } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await time.increase(oneMonth);

      expect(await curveX.unlockableBalanceOf(owner.address)).to.be.equal(100);

      await expect(curveX.unlock()).not.to.be.reverted;

      expect(await curveX.lockedBalanceOf(owner.address)).to.be.equal(0);
    });

    it("Token amount should be transferable after it is unlocked", async function () {
      const { curveX, owner, addr1, oneMonth } = await loadFixture(
        deployTokenFixture
      );

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await time.increase(oneMonth);

      await expect(curveX.unlock()).not.to.be.reverted;

      await expect(curveX.transfer(addr1.address, 50)).to.changeTokenBalances(
        curveX,
        [owner, addr1],
        [-50, 50]
      );
    });

    it("Only matured amount should be unlocked", async function () {
      const { curveX, owner, oneMonth } = await loadFixture(deployTokenFixture);

      await expect(curveX.mintAndLock(50)).to.changeTokenBalances(
        curveX,
        [owner],
        [50]
      );

      await time.increase(oneMonth);

      await expect(curveX.mintAndLock(7)).to.changeTokenBalances(
        curveX,
        [owner],
        [7]
      );

      expect(await curveX.lockedBalanceOf(owner.address)).to.be.equal(57);
      expect(await curveX.unlockableBalanceOf(owner.address)).to.be.equal(50);

      await expect(curveX.unlock()).not.to.be.reverted;

      expect(await curveX.lockedBalanceOf(owner.address)).to.be.equal(7);
    });
  });
});