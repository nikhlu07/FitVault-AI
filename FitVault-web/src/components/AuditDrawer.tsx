import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditDrawerProps {
  vaultId?: string;
  stakeAmount?: string;
  goalType?: string;
  goalValue?: string;
  currentDay?: number;
  totalDays?: number;
}

const buildLogs = (vaultId: string, stake: string, goalType: string, goalValue: string, day: number, total: number) => [
  `> OPENCLAW AGENT EXECUTING // NORMALIZER_SYNC // HASH: ${vaultId}`,
  `> TETHER WDK BRIDGE ACTIVE // VAULT_STATE: MONITORING // GAS: 0.0042 MATIC`,
  `> BIOMETRIC ORACLE FEED // ${goalType.toUpperCase()}: ${parseInt(goalValue).toLocaleString()} // CONFIDENCE: 99.7%`,
  `> AAVE V3 YIELD ACCRUAL // APY: 4.21% // COMPOUND_BLOCK: 19284756`,
  `> VAULT STATE // ACTIVE -> MONITORING // DAY: ${day}/${total}`,
  `> PARASWAP ROUTING QUERY // USDT->XAUT // SLIPPAGE: 0.3%`,
  `> PENALTY ESCROW VERIFICATION // POOL_BALANCE: 142,500.00 USDT`,
  `> HEARTBEAT SYNC // AGENT_STATUS: AUTONOMOUS // LATENCY: 12ms`,
  `> COMMITMENT WINDOW CHECK // DAY: ${day}/${total} // STATUS: ON_TRACK`,
  `> PRINCIPAL DEPLOYED // ${parseFloat(stake).toLocaleString()} USDT // AAVE_V3_POOL`,
  `> ORACLE ATTESTATION // BLOCK: #19,284,756 // VERIFIED`,
  `> AGENT: AUTONOMOUS // NO_USER_CONFIRMATION_REQUIRED`,
];

const GENERIC_LOGS = [
  `> OPENCLAW AGENT EXECUTING // NORMALIZER_SYNC // HASH: 0x8F9B...4A21`,
  `> TETHER WDK BRIDGE INITIATED // TX_PENDING // GAS: 0.0042 MATIC`,
  `> BIOMETRIC ORACLE FEED // STEPS: 10,482 // CONFIDENCE: 99.7%`,
  `> AAVE V3 YIELD ACCRUAL // APY: 4.21% // COMPOUND_BLOCK: 19284756`,
  `> VAULT STATE TRANSITION // ACTIVE -> MONITORING // EPOCH: 2847`,
  `> PARASWAP ROUTING QUERY // USDT->XAUT // SLIPPAGE: 0.3%`,
  `> PENALTY ESCROW VERIFICATION // POOL_BALANCE: 142,500.00 USDT`,
  `> HEARTBEAT SYNC // AGENT_STATUS: AUTONOMOUS // LATENCY: 12ms`,
  `> COMMITMENT WINDOW CHECK // DAY: 21/30 // STATUS: ON_TRACK`,
];

const AuditDrawer = ({
  vaultId,
  stakeAmount = "2500",
  goalType = "steps",
  goalValue = "10000",
  currentDay = 21,
  totalDays = 30,
}: AuditDrawerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allLogs = vaultId
    ? buildLogs(vaultId, stakeAmount, goalType, goalValue, currentDay, totalDays)
    : GENERIC_LOGS;

  useEffect(() => {
    setLogs(allLogs.slice(0, 3));
  }, [vaultId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextLog = allLogs[Math.floor(Math.random() * allLogs.length)];
      setLogs((prev) => [...prev.slice(-12), nextLog]);
    }, 2800);
    return () => clearInterval(interval);
  }, [vaultId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-foreground z-50 border-t-2 border-infrared">
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-6 py-2 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-infrared rounded-full animate-pulse inline-block" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-graphite">
            // SYSTEM AUDIT LOG — AGENT: AUTONOMOUS
          </span>
          {vaultId && (
            <span className="font-mono text-[9px] text-infrared hidden md:inline">
              VAULT: {vaultId}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] text-graphite">
            {logs.length} EVENTS
          </span>
          <span className="font-mono text-[10px] text-graphite">
            {expanded ? "▼ COLLAPSE" : "▲ EXPAND"}
          </span>
        </div>
      </button>

      {/* Collapsed: single scrolling line */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-2">
              <p className="font-mono text-[11px] text-background/60 truncate">
                {logs[logs.length - 1] ?? ""}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded: full terminal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div ref={scrollRef} className="h-[200px] overflow-y-auto px-6 pb-4 pt-2 space-y-0.5">
              {logs.map((log, i) => (
                <motion.p
                  key={`${i}-${log.slice(0, 20)}`}
                  className="font-mono text-[11px] leading-relaxed text-background/75"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {log}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditDrawer;
