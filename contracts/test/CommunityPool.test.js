const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommunityPool", function () {
  let communityPool, usdt;
  let owner, winner1, winner2, winner3, nonOwner;

  const FORFEIT = ethers.parseUnits("1000", 6); // 1000 USDT

  beforeEach(async () => {
    [owner, winner1, winner2, winner3, nonOwner] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();

    // Deploy CommunityPool
    const CommunityPool = await ethers.getContractFactory("CommunityPool");
    communityPool = await CommunityPool.deploy(await usdt.getAddress());

    // Fund the pool (simulating FitVault forfeit transfers)
    await usdt.mint(await communityPool.getAddress(), FORFEIT);
  });

  // ─── Forfeit receiving ─────────────────────────────────────────────────────

  describe("receiveForfeit", () => {
    it("tracks incoming forfeit in epoch balance", async () => {
      await communityPool.receiveForfeit(FORFEIT);
      expect(await communityPool.epochBalance(0)).to.equal(FORFEIT);
      expect(await communityPool.totalReceived()).to.equal(FORFEIT);
    });

    it("emits ForfeitReceived event", async () => {
      await expect(communityPool.receiveForfeit(FORFEIT))
        .to.emit(communityPool, "ForfeitReceived")
        .withArgs(0n, FORFEIT);
    });

    it("accumulates multiple forfeits in same epoch", async () => {
      const second = ethers.parseUnits("500", 6);
      await communityPool.receiveForfeit(FORFEIT);
      await communityPool.receiveForfeit(second);

      expect(await communityPool.epochBalance(0)).to.equal(FORFEIT + second);
      expect(await communityPool.totalReceived()).to.equal(FORFEIT + second);
    });
  });

  // ─── Epoch distribution ────────────────────────────────────────────────────

  describe("distributeEpoch", () => {
    beforeEach(async () => {
      await communityPool.receiveForfeit(FORFEIT);
    });

    it("distributes to winners proportionally", async () => {
      // 60/40 split
      await communityPool.distributeEpoch(
        [winner1.address, winner2.address],
        [60, 40]
      );

      const expected1 = (FORFEIT * 60n) / 100n;
      const expected2 = (FORFEIT * 40n) / 100n;

      expect(await communityPool.claimable(0, winner1.address)).to.equal(expected1);
      expect(await communityPool.claimable(0, winner2.address)).to.equal(expected2);
    });

    it("advances epoch after distribution", async () => {
      await communityPool.distributeEpoch(
        [winner1.address],
        [100]
      );
      expect(await communityPool.currentEpoch()).to.equal(1);
    });

    it("emits EpochDistributed event", async () => {
      await expect(
        communityPool.distributeEpoch([winner1.address], [100])
      ).to.emit(communityPool, "EpochDistributed");
    });

    it("reverts on array length mismatch", async () => {
      await expect(
        communityPool.distributeEpoch([winner1.address], [50, 50])
      ).to.be.revertedWithCustomError(communityPool, "ArrayLengthMismatch");
    });

    it("only owner can distribute", async () => {
      await expect(
        communityPool.connect(nonOwner).distributeEpoch([winner1.address], [100])
      ).to.be.revertedWithCustomError(communityPool, "OwnableUnauthorizedAccount");
    });

    it("distributes to multiple winners across weights", async () => {
      // 50/30/20 three-way
      await communityPool.distributeEpoch(
        [winner1.address, winner2.address, winner3.address],
        [50, 30, 20]
      );

      expect(await communityPool.claimable(0, winner1.address)).to.equal((FORFEIT * 50n) / 100n);
      expect(await communityPool.claimable(0, winner2.address)).to.equal((FORFEIT * 30n) / 100n);
      expect(await communityPool.claimable(0, winner3.address)).to.equal((FORFEIT * 20n) / 100n);
    });
  });

  // ─── Claiming ──────────────────────────────────────────────────────────────

  describe("claim", () => {
    beforeEach(async () => {
      await communityPool.receiveForfeit(FORFEIT);
      await communityPool.distributeEpoch([winner1.address], [100]);
    });

    it("allows winner to claim full amount", async () => {
      const before = await usdt.balanceOf(winner1.address);
      await communityPool.connect(winner1).claim();
      const after = await usdt.balanceOf(winner1.address);

      expect(after - before).to.equal(FORFEIT);
    });

    it("updates totalClaimed", async () => {
      await communityPool.connect(winner1).claim();
      expect(await communityPool.totalClaimed(winner1.address)).to.equal(FORFEIT);
    });

    it("emits Claimed event", async () => {
      await expect(communityPool.connect(winner1).claim())
        .to.emit(communityPool, "Claimed")
        .withArgs(winner1.address, 0n, FORFEIT);
    });

    it("zeroes out claimable after claim", async () => {
      await communityPool.connect(winner1).claim();
      expect(await communityPool.claimable(0, winner1.address)).to.equal(0);
    });

    it("reverts if nothing to claim", async () => {
      await expect(
        communityPool.connect(winner2).claim()
      ).to.be.revertedWithCustomError(communityPool, "NoClaimable");
    });

    it("reverts on double claim", async () => {
      await communityPool.connect(winner1).claim();
      await expect(
        communityPool.connect(winner1).claim()
      ).to.be.revertedWithCustomError(communityPool, "NoClaimable");
    });
  });

  // ─── Epoch-specific claiming ───────────────────────────────────────────────

  describe("claimEpoch", () => {
    beforeEach(async () => {
      // Epoch 0
      await communityPool.receiveForfeit(FORFEIT);
      await communityPool.distributeEpoch([winner1.address], [100]);

      // Epoch 1
      const secondForfeit = ethers.parseUnits("500", 6);
      await usdt.mint(await communityPool.getAddress(), secondForfeit);
      await communityPool.receiveForfeit(secondForfeit);
      await communityPool.distributeEpoch([winner1.address, winner2.address], [50, 50]);
    });

    it("claims only from specified epoch", async () => {
      const before = await usdt.balanceOf(winner1.address);
      await communityPool.connect(winner1).claimEpoch(0);
      const after = await usdt.balanceOf(winner1.address);

      // Epoch 0 had 1000 USDT, all to winner1
      expect(after - before).to.equal(FORFEIT);

      // Epoch 1 should still be claimable
      const epoch1Claimable = await communityPool.claimable(1, winner1.address);
      expect(epoch1Claimable).to.be.gt(0);
    });

    it("reverts if epoch has no claimable", async () => {
      await expect(
        communityPool.connect(winner2).claimEpoch(0) // winner2 wasn't in epoch 0
      ).to.be.revertedWithCustomError(communityPool, "NoClaimable");
    });
  });

  // ─── View functions ────────────────────────────────────────────────────────

  describe("views", () => {
    beforeEach(async () => {
      await communityPool.receiveForfeit(FORFEIT);
      await communityPool.distributeEpoch([winner1.address, winner2.address], [70, 30]);
    });

    it("pendingRewards returns correct total", async () => {
      const pending = await communityPool.pendingRewards(winner1.address);
      expect(pending).to.equal((FORFEIT * 70n) / 100n);
    });

    it("poolBalance returns USDT balance", async () => {
      const bal = await communityPool.poolBalance();
      expect(bal).to.equal(FORFEIT);
    });

    it("pendingRewards returns 0 after claim", async () => {
      await communityPool.connect(winner1).claim();
      expect(await communityPool.pendingRewards(winner1.address)).to.equal(0);
    });
  });
});
