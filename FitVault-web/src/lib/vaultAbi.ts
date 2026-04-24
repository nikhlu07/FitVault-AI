// Auto-generated from contracts/src/FitVault.sol
// Run `npm run deploy:local` in /contracts to update addresses in web3Config.ts

export const VAULT_ABI = [
  // ── Write ──────────────────────────────────────────────────────────────────
  {
    name: "createVault",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stakeAmount",  type: "uint256" },
      { name: "goalType",     type: "uint8"   },
      { name: "goalTarget",   type: "uint256" },
      { name: "durationDays", type: "uint256" },
      { name: "compounding",  type: "bool"    },
    ],
    outputs: [{ name: "vaultId", type: "uint256" }],
  },
  {
    name: "cancelVault",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [],
  },
  // ── Read ───────────────────────────────────────────────────────────────────
  {
    name: "getVault",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "owner",          type: "address" },
          { name: "stakeAmount",    type: "uint256" },
          { name: "goalType",       type: "uint8"   },
          { name: "goalTarget",     type: "uint256" },
          { name: "durationDays",   type: "uint256" },
          { name: "startTime",      type: "uint256" },
          { name: "endTime",        type: "uint256" },
          { name: "compounding",    type: "bool"    },
          { name: "status",         type: "uint8"   },
          { name: "daysCompleted",  type: "uint256" },
          { name: "yieldAccrued",   type: "uint256" },
        ],
      },
    ],
  },
  {
    name: "getUserVaults",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getVaultCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "currentYield",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "projectedYield",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "vaultId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    name: "VaultCreated",
    type: "event",
    inputs: [
      { name: "vaultId",     type: "uint256", indexed: true  },
      { name: "owner",       type: "address", indexed: true  },
      { name: "stakeAmount", type: "uint256", indexed: false },
      { name: "goalType",    type: "uint8",   indexed: false },
      { name: "goalTarget",  type: "uint256", indexed: false },
      { name: "durationDays",type: "uint256", indexed: false },
      { name: "compounding", type: "bool",    indexed: false },
    ],
  },
  {
    name: "VaultSettled",
    type: "event",
    inputs: [
      { name: "vaultId", type: "uint256", indexed: true  },
      { name: "owner",   type: "address", indexed: true  },
      { name: "outcome", type: "uint8",   indexed: false },
      { name: "payout",  type: "uint256", indexed: false },
      { name: "yieldAmount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "DayAttested",
    type: "event",
    inputs: [
      { name: "vaultId", type: "uint256", indexed: true  },
      { name: "day",     type: "uint256", indexed: false },
      { name: "value",   type: "uint256", indexed: false },
      { name: "passed",  type: "bool",    indexed: false },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount",  type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner",   type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// ── Vault status enum (mirrors Solidity) ──────────────────────────────────────
export const VaultStatus = {
  ACTIVE:    0,
  SUCCESS:   1,
  FORFEIT:   2,
  CANCELLED: 3,
} as const;

// ── Goal type enum ────────────────────────────────────────────────────────────
export const GoalTypeMap = {
  steps:           0,
  "active-minutes": 1,
  "heart-rate":    2,
} as const;
