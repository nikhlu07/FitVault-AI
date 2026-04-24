/**
 * Oracle Simulation Script
 * ─────────────────────────
 * Simulates the OpenClaw health agent by auto-attesting biometric data
 * for active vaults. Use this for demo/testnet to show the full lifecycle.
 *
 * Usage:
 *   npx hardhat run scripts/oracle-sim.js --network localhost
 *   npx hardhat run scripts/oracle-sim.js --network polygonAmoy
 *
 * Environment variables:
 *   FITVAULT_ADDRESS    — deployed FitVault contract address
 *   COMMUNITY_POOL      — deployed CommunityPool address
 *   ORACLE_PRIVATE_KEY   — oracle signer key (must match contract oracle)
 *   SIM_SUCCESS_RATE     — probability of daily goal met (default: 0.85)
 *   SIM_INTERVAL_MS      — ms between attestations (default: 5000)
 */

const { ethers, network: hreNetwork } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ─── Load deployment artifact if available ──────────────────────────────────
function loadDeployment() {
  const deployPath = path.join(__dirname, "../deployments", `${hreNetwork.name}.json`);
  if (fs.existsSync(deployPath)) {
    return JSON.parse(fs.readFileSync(deployPath, "utf8"));
  }
  return null;
}

// ─── ABI fragments ──────────────────────────────────────────────────────────
const VAULT_ABI = [
  "function getVaultCount() view returns (uint256)",
  "function getVault(uint256) view returns (tuple(address owner, uint256 stakeAmount, uint8 goalType, uint256 goalTarget, uint256 durationDays, uint256 startTime, uint256 endTime, bool compounding, uint8 status, uint256 daysCompleted, uint256 yieldAccrued))",
  "function attestDay(uint256 vaultId, uint256 day, uint256 value, bool passed)",
  "function settle(uint256 vaultId, bool success)",
  "function oracle() view returns (address)",
];

const COMMUNITY_POOL_ABI = [
  "function receiveForfeit(uint256 amount)",
];

// ─── Status constants ───────────────────────────────────────────────────────
const STATUS = { ACTIVE: 0, SUCCESS: 1, FORFEIT: 2, CANCELLED: 3 };
const GOAL_NAMES = ["STEPS", "ACTIVE_MINUTES", "HEART_RATE"];

async function main() {
  const deployment = loadDeployment();
  const [defaultSigner] = await ethers.getSigners();

  // Resolve addresses
  const fitVaultAddr = process.env.FITVAULT_ADDRESS || deployment?.contracts?.FitVault;
  if (!fitVaultAddr) {
    console.error("❌ No FitVault address. Set FITVAULT_ADDRESS or deploy first.");
    process.exit(1);
  }

  const fitVault = new ethers.Contract(fitVaultAddr, VAULT_ABI, defaultSigner);

  // Verify oracle identity
  const oracleAddr = await fitVault.oracle();
  console.log(`\n🔮 Oracle Simulator`);
  console.log(`   Network:     ${hreNetwork.name}`);
  console.log(`   FitVault:    ${fitVaultAddr}`);
  console.log(`   Oracle:      ${oracleAddr}`);
  console.log(`   Signer:      ${defaultSigner.address}`);
  console.log(`   Match:       ${oracleAddr.toLowerCase() === defaultSigner.address.toLowerCase() ? "✅ YES" : "❌ NO — will fail"}`);

  const successRate = parseFloat(process.env.SIM_SUCCESS_RATE || "0.85");
  const intervalMs = parseInt(process.env.SIM_INTERVAL_MS || "5000");

  console.log(`   Success%:    ${(successRate * 100).toFixed(0)}%`);
  console.log(`   Interval:    ${intervalMs}ms`);
  console.log(`\n${"─".repeat(60)}\n`);

  // ─── Main loop ────────────────────────────────────────────────────────────

  async function tick() {
    try {
      const vaultCount = await fitVault.getVaultCount();
      console.log(`📊 Scanning ${vaultCount} vault(s)...\n`);

      for (let id = 0n; id < vaultCount; id++) {
        const v = await fitVault.getVault(id);

        // Skip non-active vaults
        if (Number(v.status) !== STATUS.ACTIVE) {
          console.log(`   [${id}] SKIP — status: ${Object.keys(STATUS).find(k => STATUS[k] === Number(v.status))}`);
          continue;
        }

        const now = BigInt(Math.floor(Date.now() / 1000));
        const daysCompleted = Number(v.daysCompleted);
        const nextDay = daysCompleted + 1;
        const durationDays = Number(v.durationDays);
        const goalTarget = Number(v.goalTarget);
        const goalName = GOAL_NAMES[Number(v.goalType)] || "UNKNOWN";

        // Check if commitment window has passed (time to settle)
        if (now >= v.endTime) {
          const success = daysCompleted >= Math.ceil(durationDays * 0.7); // 70% threshold
          console.log(`   [${id}] 🏁 SETTLEMENT — ${daysCompleted}/${durationDays} days passed (${success ? "SUCCESS" : "FORFEIT"})`);

          try {
            const tx = await fitVault.settle(id, success);
            await tx.wait();
            console.log(`   [${id}] ✅ Settled: ${success ? "SUCCESS" : "FORFEIT"} — tx: ${tx.hash.slice(0, 18)}...`);
          } catch (err) {
            console.log(`   [${id}] ❌ Settle failed: ${err.message?.slice(0, 80)}`);
          }
          continue;
        }

        // If all days already attested, wait for window to close
        if (nextDay > durationDays) {
          console.log(`   [${id}] ⏳ All ${durationDays} days attested — waiting for window close`);
          continue;
        }

        // Generate biometric data
        const passed = Math.random() < successRate;
        let value;
        if (passed) {
          // Hit the target + random bonus
          value = goalTarget + Math.floor(Math.random() * goalTarget * 0.3);
        } else {
          // Miss — 50-90% of target
          value = Math.floor(goalTarget * (0.5 + Math.random() * 0.4));
        }

        console.log(`   [${id}] 📡 Day ${nextDay}/${durationDays} | ${goalName}: ${value.toLocaleString()} / ${goalTarget.toLocaleString()} | ${passed ? "✅ PASS" : "❌ FAIL"}`);

        try {
          const tx = await fitVault.attestDay(id, BigInt(nextDay), BigInt(value), passed);
          await tx.wait();
          console.log(`   [${id}] ✓ Attested — tx: ${tx.hash.slice(0, 18)}...`);
        } catch (err) {
          console.log(`   [${id}] ❌ Attest failed: ${err.message?.slice(0, 80)}`);
        }
      }

      console.log(`\n${"─".repeat(60)}\n`);
    } catch (err) {
      console.error(`❌ Tick error: ${err.message}`);
    }
  }

  // Run once immediately, then loop
  await tick();

  if (process.env.SIM_ONCE === "true") {
    console.log("🏁 Single-tick mode — exiting.\n");
    return;
  }

  console.log(`🔄 Looping every ${intervalMs}ms (Ctrl+C to stop)\n`);
  setInterval(tick, intervalMs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
