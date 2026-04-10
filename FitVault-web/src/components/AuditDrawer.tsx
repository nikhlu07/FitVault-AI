import { useState, useEffect, useRef } from "react";

const MOCK_LOGS = [
  "> OPENCLAW AGENT EXECUTING // NORMALIZER_SYNC // HASH: 0x8F9B...4A21",
  "> TETHER WDK BRIDGE INITIATED // TX_PENDING // GAS: 0.0042 ETH",
  "> BIOMETRIC ORACLE FEED // STEPS: 10,482 // CONFIDENCE: 99.7%",
  "> AAVE V3 YIELD ACCRUAL // APY: 4.21% // COMPOUND_BLOCK: 19284756",
  "> VAULT STATE TRANSITION // ACTIVE -> MONITORING // EPOCH: 2847",
  "> PARASWAP ROUTING QUERY // USDT->XAUT // SLIPPAGE: 0.3%",
  "> RLS POLICY CHECK // USER_ROLE: PARTICIPANT // ACCESS: GRANTED",
  "> PENALTY ESCROW VERIFICATION // POOL_BALANCE: 142,500.00 USDT",
  "> HEARTBEAT SYNC // AGENT_STATUS: AUTONOMOUS // LATENCY: 12ms",
  "> COMMITMENT WINDOW CHECK // DAY: 21/30 // STATUS: ON_TRACK",
];

const AuditDrawer = () => {
  const [logs, setLogs] = useState<string[]>(MOCK_LOGS.slice(0, 3));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
      setLogs((prev) => [...prev.slice(-8), nextLog]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-foreground z-50 border-t border-foreground">
      <div className="container mx-auto px-6 py-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-graphite mb-1">
          // SYSTEM AUDIT LOG
        </p>
      </div>
      <div ref={scrollRef} className="h-24 overflow-y-auto px-6 pb-3">
        {logs.map((log, i) => (
          <p
            key={i}
            className="font-mono text-[11px] leading-relaxed text-background/80 truncate"
          >
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AuditDrawer;
