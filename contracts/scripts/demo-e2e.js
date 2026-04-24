/**
 * End-to-End Demo Script
 * ──────────────────────
 * Deploys all contracts, creates a vault, runs oracle attestations for
 * the full commitment window, settles the vault, and demonstrates the
 * community pool distribution. Perfect for hackathon demo recording.
 *
 * Usage:
 *   npx hardhat run scripts/demo-e2e.js --network localhost
 *   npx hardhat run scripts/demo-e2e.js --network hardhat
 */

const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// ─── Config ─────────────────────────────────────────────────────────────────
const STAKE        = ethers.parseUnits("2500", 6);  // 2500 USDT
const GOAL_TARGET  = 10000n;                         // 10K steps/day
const DURATION     = 7n;                              // 7 days (shorter for demo)
const SUCCESS_RATE = 0.85;                            // 85% daily pass rate

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function header(text) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ${text}`);
  console.log(`${"═".repeat(60)}\n`);
}

async function main() {
  const [deployer, oracle, treasury, user1, winner1, winner2] = await ethers.getSigners();

  header("🏗  PHASE 1 — DEPLOY CONTRACTS");

  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log(`  ✅ MockUSDT:      ${await usdt.getAddress()}`);

  // Mint USDT to user
  await usdt.mint(user1.address, ethers.parseUnits("100000", 6));
  console.log(`  💰 Minted 100,000 USDT to user1`);

  // Deploy CommunityPool
  const CommunityPool = await ethers.getContractFactory("CommunityPool");
  const pool = await CommunityPool.deploy(await usdt.getAddress());
  await pool.waitForDeployment();
  console.log(`  ✅ CommunityPool: ${await pool.getAddress()}`);

  // Deploy FitVault
  const FitVault = await ethers.getContractFactory("FitVault");
  const vault = await FitVault.deploy(
    await usdt.getAddress(),
    oracle.address,
    await pool.getAddress(),
    treasury.address
  );
  await vault.waitForDeployment();
  console.log(`  ✅ FitVault:      ${await vault.getAddress()}`);
  console.log(`  🔮 Oracle:        ${oracle.address}`);
  console.log(`  🏦 Treasury:      ${treasury.address}`);

  // ────────────────────────────────────────────────────────────────────────

  header("📝 PHASE 2 — CREATE VAULT");

  await usdt.connect(user1).approve(await vault.getAddress(), STAKE);
  const tx = await vault.connect(user1).createVault(STAKE, 0, GOAL_TARGET, DURATION, false);
  const receipt = await tx.wait();
  const vaultId = 0n;

  console.log(`  📋 Vault ID:      ${vaultId}`);
  console.log(`  👤 Owner:         ${user1.address}`);
  console.log(`  💎 Stake:         2,500 USDT`);
  console.log(`  🎯 Goal:          10,000 STEPS / day`);
  console.log(`  📅 Duration:      ${DURATION} days`);
  console.log(`  🔄 Compounding:   No`);
  console.log(`  🧾 Tx:            ${tx.hash.slice(0, 22)}...`);

  const userBalance = await usdt.balanceOf(user1.address);
  console.log(`  💳 User balance:  ${ethers.formatUnits(userBalance, 6)} USDT (after stake)`);

  // ────────────────────────────────────────────────────────────────────────

  header("📡 PHASE 3 — ORACLE ATTESTATIONS (7 DAYS)");

  let passedDays = 0;
  let failedDays = 0;

  for (let day = 1; day <= Number(DURATION); day++) {
    const passed = Math.random() < SUCCESS_RATE;
    const value = passed
      ? GOAL_TARGET + BigInt(Math.floor(Math.random() * 3000))
      : BigInt(Math.floor(Number(GOAL_TARGET) * (0.5 + Math.random() * 0.4)));

    if (passed) passedDays++;
    else failedDays++;

    const atx = await vault.connect(oracle).attestDay(vaultId, BigInt(day), value, passed);
    await atx.wait();

    const v = await vault.getVault(vaultId);
    console.log(`  Day ${day.toString().padStart(2)}/${DURATION} │ ${passed ? "✅ PASS" : "❌ FAIL"} │ Steps: ${value.toString().padStart(6)} │ Yield: +${ethers.formatUnits(v.yieldAccrued, 6)} USDT`);
  }

  console.log(`\n  📊 Summary: ${passedDays} passed / ${failedDays} failed`);

  // Fund contract with simulated yield (mimics Aave aToken growth)
  const yieldFund = ethers.parseUnits("5", 6);
  await usdt.connect(deployer).mint(await vault.getAddress(), yieldFund);
  console.log(`  💰 Simulated Aave yield funded: 5 USDT`);

  // ────────────────────────────────────────────────────────────────────────

  header("⏩ PHASE 4 — TIME WARP & SETTLEMENT");

  // Fast-forward past commitment window
  await time.increase(8 * 24 * 60 * 60);
  console.log(`  ⏳ Time warped +8 days (past commitment window)`);

  const success = passedDays >= Math.ceil(Number(DURATION) * 0.7);
  console.log(`  🎯 Outcome: ${success ? "SUCCESS ✅" : "FORFEIT ❌"} (${passedDays}/${DURATION} days — 70% threshold)`);

  const userBefore = await usdt.balanceOf(user1.address);
  const treasuryBefore = await usdt.balanceOf(treasury.address);
  const poolBefore = await usdt.balanceOf(await pool.getAddress());

  const stx = await vault.connect(oracle).settle(vaultId, success);
  await stx.wait();
  console.log(`  🧾 Settlement tx: ${stx.hash.slice(0, 22)}...`);

  const userAfter = await usdt.balanceOf(user1.address);
  const treasuryAfter = await usdt.balanceOf(treasury.address);
  const poolAfter = await usdt.balanceOf(await pool.getAddress());
  const vaultData = await vault.getVault(vaultId);

  console.log(`\n  ── POST-SETTLEMENT ────────────────────────────`);
  console.log(`  Vault Status:      ${["ACTIVE", "SUCCESS", "FORFEIT", "CANCELLED"][Number(vaultData.status)]}`);

  if (success) {
    const userGain = userAfter - userBefore;
    const treasuryGain = treasuryAfter - treasuryBefore;
    console.log(`  User received:     +${ethers.formatUnits(userGain, 6)} USDT (principal + 85% yield)`);
    console.log(`  Treasury received: +${ethers.formatUnits(treasuryGain, 6)} USDT (15% yield share)`);
  } else {
    const poolGain = poolAfter - poolBefore;
    const treasuryGain = treasuryAfter - treasuryBefore;
    console.log(`  Community Pool:    +${ethers.formatUnits(poolGain, 6)} USDT (95% of stake)`);
    console.log(`  Treasury:          +${ethers.formatUnits(treasuryGain, 6)} USDT (5% protocol fee)`);
    console.log(`  User received:     0 USDT (full forfeit)`);
  }

  // ────────────────────────────────────────────────────────────────────────

  if (!success) {
    header("🏆 PHASE 5 — COMMUNITY POOL DISTRIBUTION");

    // Register the forfeit in the pool
    const poolBalance = poolAfter - poolBefore;
    await pool.receiveForfeit(poolBalance);
    console.log(`  📥 Forfeit registered: ${ethers.formatUnits(poolBalance, 6)} USDT`);

    // Distribute to winners (60/40 split)
    await pool.distributeEpoch(
      [winner1.address, winner2.address],
      [60, 40]
    );
    console.log(`  📤 Epoch distributed: 60% → winner1, 40% → winner2`);

    // Winners claim
    const w1Before = await usdt.balanceOf(winner1.address);
    await pool.connect(winner1).claim();
    const w1After = await usdt.balanceOf(winner1.address);

    const w2Before = await usdt.balanceOf(winner2.address);
    await pool.connect(winner2).claim();
    const w2After = await usdt.balanceOf(winner2.address);

    console.log(`  🏆 Winner1 claimed: +${ethers.formatUnits(w1After - w1Before, 6)} USDT`);
    console.log(`  🏆 Winner2 claimed: +${ethers.formatUnits(w2After - w2Before, 6)} USDT`);
  }

  // ────────────────────────────────────────────────────────────────────────

  header("📊 FINAL STATE");

  const finalVault = await vault.getVault(vaultId);
  console.log(`  Vault Count:       ${await vault.getVaultCount()}`);
  console.log(`  Vault #0 Status:   ${["ACTIVE", "SUCCESS", "FORFEIT", "CANCELLED"][Number(finalVault.status)]}`);
  console.log(`  Yield Accrued:     ${ethers.formatUnits(finalVault.yieldAccrued, 6)} USDT`);
  console.log(`  Days Completed:    ${finalVault.daysCompleted}/${finalVault.durationDays}`);
  console.log(`  User Balance:      ${ethers.formatUnits(await usdt.balanceOf(user1.address), 6)} USDT`);
  console.log(`  Treasury Balance:  ${ethers.formatUnits(await usdt.balanceOf(treasury.address), 6)} USDT`);
  console.log(`  Pool Balance:      ${ethers.formatUnits(await pool.poolBalance(), 6)} USDT`);
  console.log(`  Pool Epoch:        ${await pool.currentEpoch()}`);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ✅ END-TO-END DEMO COMPLETE`);
  console.log(`${"═".repeat(60)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
