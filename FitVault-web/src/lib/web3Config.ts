import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "FitVault-AI",
  projectId: "fitvault-ai-demo", // replace with real WalletConnect projectId for production
  chains: [polygon, mainnet, polygonMumbai],
  ssr: false,
});

// Mock vault contract address (replace with real deployed contract)
export const VAULT_CONTRACT_ADDRESS =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;

// USDT on Polygon
export const USDT_ADDRESS =
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" as `0x${string}`;
