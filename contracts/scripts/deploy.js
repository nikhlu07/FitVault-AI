const { ethers, network: hreNetwork } = require("hardhat");
const fs   = require("fs");
const path = require("path");

// ─── Network addresses ────────────────────────────────────────────────────────
const USDT_ADDRESSES = {
  polygon:     "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  polygonAmoy: process.env.AMOY_USDT_ADDRESS || "",
  hardhat:     null,
  localhost:   null,
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = hreNetwork.name;

  console.log(`\n🚀 Deploying FitVault to: ${networkName}`);
  console.log(`   Deployer: ${deployer.address}`);
  const bal = await ethers.provider.getBalance(deployer.address);
  console.log(`   Balance:  ${ethers.formatEther(bal)} MATIC/ETH\n`);

  let usdtAddress = USDT_ADDRESSES[networkName];

  // ── Deploy MockUSDT on local networks ─────────────────────────────────────
  if (!usdtAddress) {
    console.log("📦 Deploying MockUSDT (local)...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mock = await MockUSDT.deploy();
    await mock.waitForDeployment();
    usdtAddress = await mock.getAddress();
    console.log(`   MockUSDT: ${usdtAddress}`);
  }

  const oracleAddress = process.env.ORACLE_ADDRESS || deployer.address;

  // ── Deploy CommunityPool ──────────────────────────────────────────────────
  console.log("\n📦 Deploying CommunityPool...");
  const CommunityPool = await ethers.getContractFactory("CommunityPool");
  const communityPool = await CommunityPool.deploy(usdtAddress);
  await communityPool.waitForDeployment();
  const communityPoolAddress = await communityPool.getAddress();
  console.log(`   CommunityPool: ${communityPoolAddress}`);

  // ── Deploy FitVault ───────────────────────────────────────────────────────
  console.log("\n📦 Deploying FitVault...");
  const FitVault = await ethers.getContractFactory("FitVault");
  const fitVault = await FitVault.deploy(
    usdtAddress,
    oracleAddress,
    communityPoolAddress,
    deployer.address   // treasury
  );
  await fitVault.waitForDeployment();
  const fitVaultAddress = await fitVault.getAddress();
  console.log(`   FitVault: ${fitVaultAddress}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n✅ Deployment complete:");
  console.log(`   USDT:          ${usdtAddress}`);
  console.log(`   CommunityPool: ${communityPoolAddress}`);
  console.log(`   FitVault:      ${fitVaultAddress}`);
  console.log(`   Oracle:        ${oracleAddress}`);
  console.log(`   Treasury:      ${deployer.address}`);

  // ── Patch frontend web3Config.ts ──────────────────────────────────────────
  const configPath = path.join(__dirname, "../../FitVault-web/src/lib/web3Config.ts");
  if (fs.existsSync(configPath)) {
    let cfg = fs.readFileSync(configPath, "utf8");
    cfg = cfg.replace(
      /VAULT_CONTRACT_ADDRESS\s*=\s*"[^"]*"/,
      `VAULT_CONTRACT_ADDRESS = "${fitVaultAddress}"`
    );
    cfg = cfg.replace(
      /USDT_ADDRESS\s*=\s*"[^"]*"/,
      `USDT_ADDRESS = "${usdtAddress}"`
    );
    fs.writeFileSync(configPath, cfg);
    console.log(`\n📝 Patched FitVault-web/src/lib/web3Config.ts`);
  }

  // ── Save deployment artifact ──────────────────────────────────────────────
  const artifact = {
    network: networkName,
    deployedAt: new Date().toISOString(),
    contracts: {
      FitVault:      fitVaultAddress,
      CommunityPool: communityPoolAddress,
      USDT:          usdtAddress,
    },
    config: {
      oracle:   oracleAddress,
      treasury: deployer.address,
    },
  };

  const outDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, `${networkName}.json`),
    JSON.stringify(artifact, null, 2)
  );
  console.log(`📄 Saved deployments/${networkName}.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
