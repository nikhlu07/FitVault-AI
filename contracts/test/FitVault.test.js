const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("FitVault", function () {
  let fitVault, communityPool, usdt;
  let owner, oracle, treasury, user1, user2;

  const STAKE = ethers.parseUnits("2500", 6);   // 2500 USDT
  const GOAL  = 10000n;                          // 10k steps/day
  const DAYS  = 30n;

  beforeEach(async () => {
    [owner, oracle, treasury, user1, user2] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();

    // Mint USDT to users
    await usdt.mint(user1.address, ethers.parseUnits("100000", 6));
    await usdt.mint(user2.address, ethers.parseUnits("100000", 6));

    // Deploy CommunityPool
    const CommunityPool = await ethers.getContractFactory("CommunityPool");
    communityPool = await CommunityPool.deploy(await usdt.getAddress());

    // Deploy FitVault
    const FitVault = await ethers.getContractFactory("FitVault");
    fitVault = await FitVault.deploy(
      await usdt.getAddress(),
      oracle.address,
      await communityPool.getAddress(),
      treasury.address
    );
  });

  // ─── Vault creation ────────────────────────────────────────────────────────

  describe("createVault", () => {
    it("creates a vault and pulls USDT", async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await expect(
        fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false)
      ).to.emit(fitVault, "VaultCreated").withArgs(
        0n, user1.address, STAKE, 0n, GOAL, DAYS, false
      );

      const vault = await fitVault.getVault(0);
      expect(vault.owner).to.equal(user1.address);
      expect(vault.stakeAmount).to.equal(STAKE);
      expect(vault.status).to.equal(0); // ACTIVE
    });

    it("reverts with zero amount", async () => {
      await expect(
        fitVault.connect(user1).createVault(0, 0, GOAL, DAYS, false)
      ).to.be.revertedWithCustomError(fitVault, "ZeroAmount");
    });

    it("reverts with invalid duration", async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await expect(
        fitVault.connect(user1).createVault(STAKE, 0, GOAL, 0n, false)
      ).to.be.revertedWithCustomError(fitVault, "InvalidDuration");
    });

    it("tracks user vaults", async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE * 2n);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);

      const ids = await fitVault.getUserVaults(user1.address);
      expect(ids.length).to.equal(2);
    });
  });

  // ─── Oracle attestation ────────────────────────────────────────────────────

  describe("attestDay", () => {
    let vaultId;

    beforeEach(async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);
      vaultId = 0n;
    });

    it("oracle can attest a passing day", async () => {
      await expect(
        fitVault.connect(oracle).attestDay(vaultId, 1n, 11000n, true)
      ).to.emit(fitVault, "DayAttested").withArgs(vaultId, 1n, 11000n, true);

      const vault = await fitVault.getVault(vaultId);
      expect(vault.daysCompleted).to.equal(1n);
    });

    it("oracle can attest a failing day (no daysCompleted increment)", async () => {
      await fitVault.connect(oracle).attestDay(vaultId, 1n, 8000n, false);
      const vault = await fitVault.getVault(vaultId);
      expect(vault.daysCompleted).to.equal(0n);
    });

    it("non-oracle cannot attest", async () => {
      await expect(
        fitVault.connect(user1).attestDay(vaultId, 1n, 11000n, true)
      ).to.be.revertedWithCustomError(fitVault, "OnlyOracle");
    });

    it("accrues yield on each attestation", async () => {
      await fitVault.connect(oracle).attestDay(vaultId, 1n, 11000n, true);
      const vault = await fitVault.getVault(vaultId);
      expect(vault.yieldAccrued).to.be.gt(0n);
    });
  });

  // ─── Settlement: success ───────────────────────────────────────────────────

  describe("settle — success", () => {
    let vaultId;

    beforeEach(async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);
      vaultId = 0n;

      // Attest 30 days
      for (let d = 1; d <= 30; d++) {
        await fitVault.connect(oracle).attestDay(vaultId, BigInt(d), 11000n, true);
      }

      // Fund contract with simulated yield (mimics Aave aToken balance growth)
      const yieldFund = ethers.parseUnits("10", 6);
      await usdt.connect(owner).mint(await fitVault.getAddress(), yieldFund);

      // Fast-forward past end time
      await time.increase(31 * 24 * 60 * 60);
    });

    it("settles successfully and pays user", async () => {
      const balanceBefore = await usdt.balanceOf(user1.address);

      await expect(
        fitVault.connect(oracle).settle(vaultId, true)
      ).to.emit(fitVault, "VaultSettled");

      const balanceAfter = await usdt.balanceOf(user1.address);
      expect(balanceAfter).to.be.gt(balanceBefore); // user got principal + yield

      const vault = await fitVault.getVault(vaultId);
      expect(vault.status).to.equal(1); // SUCCESS
    });

    it("sends 15% yield to treasury", async () => {
      const treasuryBefore = await usdt.balanceOf(treasury.address);
      await fitVault.connect(oracle).settle(vaultId, true);
      const treasuryAfter = await usdt.balanceOf(treasury.address);
      expect(treasuryAfter).to.be.gt(treasuryBefore);
    });

    it("cannot settle twice", async () => {
      await fitVault.connect(oracle).settle(vaultId, true);
      await expect(
        fitVault.connect(oracle).settle(vaultId, true)
      ).to.be.revertedWithCustomError(fitVault, "VaultNotActive");
    });
  });

  // ─── Settlement: forfeit ───────────────────────────────────────────────────

  describe("settle — forfeit", () => {
    let vaultId;

    beforeEach(async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);
      vaultId = 0n;
      await time.increase(31 * 24 * 60 * 60);
    });

    it("routes 95% to community pool", async () => {
      const poolBefore = await usdt.balanceOf(await communityPool.getAddress());
      await fitVault.connect(oracle).settle(vaultId, false);
      const poolAfter = await usdt.balanceOf(await communityPool.getAddress());

      const expected = (STAKE * 9500n) / 10000n;
      expect(poolAfter - poolBefore).to.equal(expected);
    });

    it("routes 5% to treasury", async () => {
      const treasuryBefore = await usdt.balanceOf(treasury.address);
      await fitVault.connect(oracle).settle(vaultId, false);
      const treasuryAfter = await usdt.balanceOf(treasury.address);

      const expected = (STAKE * 500n) / 10000n;
      expect(treasuryAfter - treasuryBefore).to.equal(expected);
    });

    it("marks vault as FORFEIT", async () => {
      await fitVault.connect(oracle).settle(vaultId, false);
      const vault = await fitVault.getVault(vaultId);
      expect(vault.status).to.equal(2); // FORFEIT
    });

    it("cannot settle before window closes", async () => {
      // Create a fresh vault (window not yet closed)
      await usdt.connect(user2).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user2).createVault(STAKE, 0, GOAL, DAYS, false);
      const newId = 1n;

      await expect(
        fitVault.connect(oracle).settle(newId, false)
      ).to.be.revertedWithCustomError(fitVault, "VaultWindowNotClosed");
    });
  });

  // ─── Cancel ───────────────────────────────────────────────────────────────

  describe("cancelVault", () => {
    it("returns principal to owner", async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);

      const before = await usdt.balanceOf(user1.address);
      await fitVault.connect(user1).cancelVault(0n);
      const after = await usdt.balanceOf(user1.address);

      expect(after - before).to.equal(STAKE);
    });

    it("non-owner cannot cancel", async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);

      await expect(
        fitVault.connect(user2).cancelVault(0n)
      ).to.be.revertedWithCustomError(fitVault, "NotVaultOwner");
    });
  });

  // ─── Yield projections ─────────────────────────────────────────────────────

  describe("yield calculations", () => {
    it("projected yield matches expected APY", async () => {
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false);

      const projected = await fitVault.projectedYield(0n);
      // 2500 USDT * 4.20% * 30/365 ≈ 8.63 USDT (6 decimals)
      expect(projected).to.be.closeTo(
        ethers.parseUnits("8.63", 6),
        ethers.parseUnits("0.5", 6) // ±0.5 USDT tolerance
      );
    });
  });

  // ─── Admin ────────────────────────────────────────────────────────────────

  describe("admin", () => {
    it("owner can update oracle", async () => {
      await expect(fitVault.connect(owner).setOracle(user2.address))
        .to.emit(fitVault, "OracleUpdated");
      expect(await fitVault.oracle()).to.equal(user2.address);
    });

    it("non-owner cannot update oracle", async () => {
      await expect(
        fitVault.connect(user1).setOracle(user2.address)
      ).to.be.revertedWithCustomError(fitVault, "OwnableUnauthorizedAccount");
    });

    it("owner can pause and unpause", async () => {
      await fitVault.connect(owner).pause();
      await usdt.connect(user1).approve(await fitVault.getAddress(), STAKE);
      await expect(
        fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false)
      ).to.be.revertedWithCustomError(fitVault, "EnforcedPause");

      await fitVault.connect(owner).unpause();
      await expect(
        fitVault.connect(user1).createVault(STAKE, 0, GOAL, DAYS, false)
      ).to.emit(fitVault, "VaultCreated");
    });
  });
});
