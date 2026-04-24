import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { VAULT_CONTRACT_ADDRESS, USDT_ADDRESS } from "@/lib/web3Config";
import { VAULT_ABI, ERC20_ABI } from "@/lib/vaultAbi";

export type GoalType = "steps" | "active-minutes" | "heart-rate";

const GOAL_TYPE_MAP: Record<GoalType, number> = {
  steps: 0,
  "active-minutes": 1,
  "heart-rate": 2,
};

export interface VaultParams {
  stakeAmount: string;
  goalType: GoalType;
  goalValue: string;
  duration: number;
  compounding: boolean;
}

export function useVault() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<"idle" | "approving" | "deploying" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { writeContractAsync: approveUsdt, data: approveTxHash } = useWriteContract();
  const { writeContractAsync: createVault, data: vaultTxHash } = useWriteContract();

  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveTxHash });
  const { isLoading: isDeploying } = useWaitForTransactionReceipt({ hash: vaultTxHash });

  const deploy = async (params: VaultParams) => {
    if (!isConnected || !address) {
      setErrorMsg("Wallet not connected");
      return false;
    }

    try {
      setErrorMsg(null);
      const amountWei = parseUnits(params.stakeAmount, 6); // USDT has 6 decimals

      // Step 1: Approve USDT spend
      setStep("approving");
      await approveUsdt({
        address: USDT_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VAULT_CONTRACT_ADDRESS, amountWei],
      });

      // Step 2: Create vault
      setStep("deploying");
      await createVault({
        address: VAULT_CONTRACT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "createVault",
        args: [
          amountWei,
          GOAL_TYPE_MAP[params.goalType],
          BigInt(params.goalValue),
          BigInt(params.duration),
          params.compounding,
        ],
      });

      setStep("done");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setErrorMsg(msg.includes("User rejected") ? "Transaction rejected by user." : msg);
      setStep("error");
      return false;
    }
  };

  const reset = () => {
    setStep("idle");
    setErrorMsg(null);
  };

  return {
    deploy,
    reset,
    step,
    errorMsg,
    isApproving,
    isDeploying,
    isConnected,
    address,
  };
}

// Hook to read USDT balance
export function useUsdtBalance() {
  const { address } = useAccount();
  return useReadContract({
    address: USDT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

// ─── On-chain reading hooks ───────────────────────────────────────────────

/** Read a vault's on-chain state by ID */
export function useOnChainVault(vaultId: bigint | undefined) {
  return useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getVault",
    args: vaultId !== undefined ? [vaultId] : undefined,
    query: {
      enabled: vaultId !== undefined && VAULT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10_000, // poll every 10s
    },
  });
}

/** Read all vault IDs owned by a user */
export function useUserVaultIds() {
  const { address } = useAccount();
  return useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getUserVaults",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && VAULT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10_000,
    },
  });
}

/** Read total vault count */
export function useVaultCount() {
  return useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getVaultCount",
    query: {
      enabled: VAULT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10_000,
    },
  });
}

/** Read projected yield for a vault */
export function useProjectedYield(vaultId: bigint | undefined) {
  return useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "projectedYield",
    args: vaultId !== undefined ? [vaultId] : undefined,
    query: {
      enabled: vaultId !== undefined && VAULT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 30_000,
    },
  });
}

/** Read current accrued yield for a vault */
export function useCurrentYield(vaultId: bigint | undefined) {
  return useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "currentYield",
    args: vaultId !== undefined ? [vaultId] : undefined,
    query: {
      enabled: vaultId !== undefined && VAULT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10_000,
    },
  });
}
