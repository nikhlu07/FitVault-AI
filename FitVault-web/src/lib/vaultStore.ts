// Simple in-memory vault store (persisted to localStorage)
// In production this would be read from on-chain state

export interface VaultState {
  id: string;
  owner: string;
  stakeAmount: string;
  goalType: "steps" | "active-minutes" | "heart-rate";
  goalValue: string;
  duration: number;
  compounding: boolean;
  startDate: string;
  txHash?: string;
  status: "active" | "success" | "forfeit";
  currentDay: number;
  accruedYield: number;
}

const STORAGE_KEY = "fitvault_vaults";

export function saveVault(vault: VaultState): void {
  const existing = loadVaults();
  const updated = [vault, ...existing.filter((v) => v.id !== vault.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadVaults(): VaultState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getActiveVault(owner: string): VaultState | null {
  const vaults = loadVaults();
  return vaults.find((v) => v.owner.toLowerCase() === owner.toLowerCase() && v.status === "active") ?? null;
}

export function settleVault(id: string, outcome: "success" | "forfeit"): void {
  const vaults = loadVaults();
  const updated = vaults.map((v) =>
    v.id === id ? { ...v, status: outcome as VaultState["status"] } : v
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearVaults(): void {
  localStorage.removeItem(STORAGE_KEY);
}
