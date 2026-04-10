import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import VaultCard from "@/components/VaultCard";
import LinearPacer from "@/components/LinearPacer";
import SecondaryButton from "@/components/SecondaryButton";
import ScrambleText from "@/components/ScrambleText";

const generateMiniSparkline = () => {
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) {
    pts.push(`${(i / 30) * 200},${20 + (Math.random() - 0.5) * 30}`);
  }
  return pts.join(" ");
};

const DAILY_LOG = [
  { day: 15, steps: 11204, status: "PASS", hr: 128 },
  { day: 16, steps: 9876, status: "WARN", hr: 115 },
  { day: 17, steps: 12340, steps_display: "12,340", status: "PASS", hr: 132 },
  { day: 18, steps: 10501, status: "PASS", hr: 121 },
  { day: 19, steps: 8745, status: "WARN", hr: 108 },
  { day: 20, steps: 13022, status: "PASS", hr: 141 },
  { day: 21, steps: 10482, status: "PASS", hr: 126 },
];

const Dashboard = () => {
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const [stepCount, setStepCount] = useState("10,482");
  const [showModal, setShowModal] = useState(false);
  const [oracleFlash, setOracleFlash] = useState(false);
  const sparkline = useMemo(() => generateMiniSparkline(), []);

  // Simulate oracle sync every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newSteps = (10000 + Math.floor(Math.random() * 1000)).toLocaleString();
      setStepCount(newSteps);
      setScrambleTrigger((p) => p + 1);
      setOracleFlash(true);
      setTimeout(() => setOracleFlash(false), 2000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-36">
      <Header />

      <main className="flex-1 container mx-auto px-6">
        {/* ═══════════ HERO METRIC ═══════════ */}
        <section className="grid grid-cols-12 gap-6 pt-12 md:pt-20 pb-16">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-infrared mb-4">
              // NORMALIZED ACTIVITY SCORE
            </p>
            <div
              className="font-display font-bold leading-[0.85]"
              style={{ fontSize: "clamp(5rem, 14vw, 14rem)" }}
            >
              <ScrambleText
                text={stepCount}
                trigger={scrambleTrigger}
                duration={400}
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-infrared mt-4">
              STEPS // DAILY AGGREGATE // ORACLE VERIFIED
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-end">
            <div className="border border-foreground p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-2">
                // ORACLE STATUS
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-block w-2 h-2 ${oracleFlash ? "bg-infrared animate-oracle-flash" : "bg-foreground"}`} />
                <span className="font-mono text-[11px] uppercase font-semibold">
                  {oracleFlash ? "SYNCING..." : "IDLE — NEXT: 8s"}
                </span>
              </div>
              <div className="border-t border-foreground/20 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-graphite">LAST SYNC</span>
                  <span className="font-mono text-[9px]">12:04:32 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-graphite">CONFIDENCE</span>
                  <span className="font-mono text-[9px]">99.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-graphite">LATENCY</span>
                  <span className="font-mono text-[9px]">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-graphite">BLOCK</span>
                  <span className="font-mono text-[9px]">#19,284,756</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ LIVE METRICS BAR ═══════════ */}
        <section className="border-y border-foreground mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {[
              { label: "AVG HEART RATE", value: "126", unit: "BPM" },
              { label: "ACTIVE MINUTES", value: "47", unit: "TODAY" },
              { label: "CALORIES BURNED", value: "812", unit: "KCAL" },
              { label: "DISTANCE", value: "8.2", unit: "KM" },
              { label: "FLOORS CLIMBED", value: "14", unit: "FLOORS" },
            ].map((m, i) => (
              <div key={m.label} className={`py-5 px-4 ${i < 4 ? "border-r border-foreground" : ""}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-1">{m.label}</p>
                <p className="font-display text-2xl md:text-3xl font-bold">
                  <ScrambleText text={m.value} trigger={scrambleTrigger} duration={300} />
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-0.5">{m.unit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ CONTROL PANEL (12-col grid) ═══════════ */}
        <section className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 mb-2 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-infrared animate-oracle-flash" />
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground font-semibold">
              CONTROL PANEL
            </p>
          </div>
          {/* Vault Card: 6 cols */}
          <div className="col-span-12 lg:col-span-6">
            <VaultCard
              sweatGoal="30-DAY / 10K STEPS"
              oracleStatus="SYNCED"
              principal="$2,500.00"
              apy="AAVE V3 / 4.21%"
              synced
            />
          </div>
          {/* Pacer + Actions: 6 cols */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] font-semibold">
                  COMMITMENT WINDOW
                </span>
              </div>
              <LinearPacer currentDay={21} totalDays={30} />
            </div>

            {/* Yield Accrual Box */}
            <div className="border border-foreground p-5 mt-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-3">
                // YIELD ACCRUAL — REAL-TIME
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-mono text-[9px] text-graphite mb-1">PRINCIPAL</p>
                  <p className="font-display text-xl font-bold">$2,500</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-graphite mb-1">ACCRUED</p>
                  <p className="font-display text-xl font-bold text-aave-purple">+$6.04</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-graphite mb-1">PROJECTED</p>
                  <p className="font-display text-xl font-bold text-success-gold">+$8.64</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <SecondaryButton
                label="Compounding Election →"
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
        </section>

        {/* ═══════════ 7-DAY ACTIVITY LOG ═══════════ */}
        <section className="mb-16">
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-12 md:col-span-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-3">
                // 7-DAY ACTIVITY LOG
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase">
                DAILY
                <br />
                <span className="text-infrared">BREAKDOWN.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8">
              {/* Mini sparkline */}
              <div className="border border-foreground p-3 mb-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mb-2">
                  STEP TREND — 7 DAY
                </p>
                <svg viewBox="0 0 200 40" className="w-full h-10" preserveAspectRatio="none">
                  <polyline
                    points={sparkline}
                    fill="none"
                    stroke="hsl(var(--infrared))"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Day-by-day table */}
              <div className="border border-foreground">
                <div className="grid grid-cols-5 border-b border-foreground bg-optical-ash">
                  {["DAY", "STEPS", "STATUS", "AVG HR", "ORACLE"].map((h) => (
                    <div key={h} className="p-2.5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">{h}</span>
                    </div>
                  ))}
                </div>
                {DAILY_LOG.map((d) => (
                  <div key={d.day} className="grid grid-cols-5 border-b border-foreground/10">
                    <div className="p-2.5">
                      <span className="font-mono text-[11px]">DAY {d.day}</span>
                    </div>
                    <div className="p-2.5">
                      <span className="font-mono text-[11px] font-semibold">{d.steps.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5">
                      <span className={`font-mono text-[11px] uppercase font-semibold ${d.status === "PASS" ? "text-success-gold" : "text-infrared"}`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <span className="font-mono text-[11px] text-graphite">{d.hr} BPM</span>
                    </div>
                    <div className="p-2.5">
                      <span className="font-mono text-[9px] text-graphite">VERIFIED ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ POSITION SUMMARY ═══════════ */}
        <section className="mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-infrared mb-4">
            // POSITION SUMMARY
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-foreground">
            {/* Scenario: Success */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-foreground">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-3">
                IF COMMITMENT SUCCEEDS
              </p>
              <p className="font-display text-4xl font-bold text-success-gold mb-2">$2,508.64</p>
              <p className="font-mono text-[9px] text-graphite">
                PRINCIPAL $2,500.00 + YIELD $8.64
              </p>
              <p className="font-mono text-[9px] text-aave-purple mt-1">
                + OPT-IN XAU₮ COMPOUNDING
              </p>
            </div>
            {/* Scenario: Forfeit */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-foreground">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-3">
                IF COMMITMENT FAILS
              </p>
              <p className="font-display text-4xl font-bold text-penalty-crimson mb-2">-$2,500.00</p>
              <p className="font-mono text-[9px] text-graphite">
                5% → PROTOCOL ($125.00)
              </p>
              <p className="font-mono text-[9px] text-graphite mt-1">
                95% → COMMUNITY ($2,375.00)
              </p>
            </div>
            {/* Current status */}
            <div className="p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-3">
                CURRENT PROBABILITY
              </p>
              <p className="font-display text-4xl font-bold mb-2">92.4%</p>
              <p className="font-mono text-[9px] text-graphite">
                ESTIMATED SUCCESS RATE
              </p>
              <p className="font-mono text-[9px] text-graphite mt-1">
                BASED ON 21/30 DAYS TRACKED
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ ORACLE TELEMETRY ═══════════ */}
        <section className="mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-infrared mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-infrared rounded-full animate-ping inline-block"></span>
            ORACLE TELEMETRY
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "BIOMETRIC_INGEST", value: "HEALTH SYNC", detail: "APPLE_HEALTH_API", status: "VERIFIED", accent: false },
              { id: "NORMALIZER", value: "99.7%", detail: "CONFIDENCE SCORE", status: "LOCKED", accent: false },
              { id: "AAVE_V3_ROUTER", value: "4.21% APY", detail: "YIELD CONTRACT", status: "ACCRUING", accent: false },
              { id: "STATE_ATTESTATION", value: "0x8F...4A21", detail: "ON-CHAIN RECORD", status: "BROADCAST", accent: true }
            ].map((node) => (
              <div key={node.id} className="border border-foreground/10 p-5 bg-optical-ash relative overflow-hidden group hover:border-foreground/30 transition-colors">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-foreground opacity-5 blur-[40px] rounded-full transition-all duration-700 group-hover:scale-150 group-hover:bg-infrared/10 pointer-events-none" />
                 
                 <div className="flex justify-between items-start mb-8">
                    <p className="font-mono text-[9px] text-graphite uppercase tracking-[0.15em] leading-relaxed max-w-[120px]">{node.id}</p>
                    <span className={`w-1.5 h-1.5 rounded-full ${node.accent ? 'bg-infrared animate-pulse' : 'bg-success-gold'}`} />
                 </div>
                 
                 <p className="font-display text-2xl font-medium uppercase mb-1">{node.value}</p>
                 <p className="font-mono text-[9px] text-graphite uppercase tracking-widest">{node.detail}</p>
                 
                 <div className="mt-8 border-t border-foreground/5 pt-4 flex justify-between items-center">
                    <span className={`font-mono text-[10px] uppercase tracking-[0.1em] font-semibold ${node.accent ? 'text-infrared' : 'text-foreground'}`}>{node.status}</span>
                    <span className="font-mono text-[10px] text-graphite mix-blend-difference">●</span>
                 </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Compounding Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div
              className="absolute inset-0 bg-foreground/80"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative bg-background border border-foreground p-8 max-w-lg w-full mx-6 z-50"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 font-mono text-xs text-graphite hover:text-foreground"
              >
                [X]
              </button>

              <h2 className="font-display text-2xl font-bold uppercase mb-6">
                COMPOUNDING ELECTION
              </h2>

              <div className="space-y-4">
                <p className="font-ui text-sm text-graphite leading-relaxed">
                  Upon successful completion of your commitment window, accrued
                  USD₮ yield will be routed through the Paraswap DEX aggregator
                  for optimal conversion to XAU₮ (Tether Gold).
                </p>

                <div className="border border-foreground p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">ROUTING</span>
                    <span className="font-mono text-[10px] uppercase text-aave-purple">USD₮ → XAU₮</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">PROTOCOL</span>
                    <span className="font-mono text-[10px] uppercase">PARASWAP V6</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">MAX SLIPPAGE</span>
                    <span className="font-mono text-[10px] uppercase">0.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite">EST. OUTPUT</span>
                    <span className="font-mono text-[10px] uppercase text-success-gold">0.0037 XAU₮</span>
                  </div>
                </div>

                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">
                  COMPOUNDING IS OPTIONAL. UNELECTED YIELD REMAINS IN USD₮.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
