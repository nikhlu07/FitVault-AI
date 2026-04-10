import { useMemo } from "react";
import { Link } from "react-router-dom";
import DeployButton from "@/components/DeployButton";
import SecondaryButton from "@/components/SecondaryButton";
import Header from "@/components/Header";
import VaultCard from "@/components/VaultCard";
import LinearPacer from "@/components/LinearPacer";
import ScrambleText from "@/components/ScrambleText";

const generateSparkline = () => {
  const points: string[] = [];
  const width = 800;
  const height = 80;
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = height / 2 + (Math.random() - 0.5) * height * 0.8;
    points.push(`${x},${y}`);
  }
  return points.join(" ");
};

const PROTOCOL_STATS = [
  { label: "TOTAL VALUE LOCKED", value: "$4.2M", unit: "USD₮", accent: false },
  { label: "ACTIVE VAULTS", value: "1,847", unit: "COMMITMENTS", accent: true },
  { label: "SUCCESS RATE", value: "87.3%", unit: "COMPLETION", accent: false },
  { label: "YIELD DISTRIBUTED", value: "$142K", unit: "TO DATE", accent: true },
];

const MECHANISM_STEPS = [
  {
    step: "01",
    title: "DEFINE COMMITMENT",
    description: "Set your biometric target — steps, active minutes, or heart rate zones. The oracle will enforce your terms with zero tolerance.",
  },
  {
    step: "02",
    title: "STAKE PRINCIPAL",
    description: "Lock USD₮ into a non-custodial vault. Your capital immediately begins accruing Aave V3 yield while the commitment window is active.",
  },
  {
    step: "03",
    title: "EXECUTE OR FORFEIT",
    description: "Meet your goal: reclaim principal + yield. Fail: 5% protocol fee, 95% redistributed to the community reward pool. No appeals.",
  },
];

const ARCHITECTURE_ITEMS = [
  { label: "SETTLEMENT", value: "TETHER WDK", description: "Wallet Development Kit for non-custodial USD₮ vault construction" },
  { label: "YIELD ENGINE", value: "AAVE V3", description: "Automated lending protocol for real-time yield accrual on staked assets" },
  { label: "ORACLE AGENT", value: "OPENCLAW", description: "Autonomous AI agent for biometric data normalization and on-chain attestation" },
  { label: "SWAP ROUTING", value: "PARASWAP V6", description: "DEX aggregator for optimal USD₮ → XAU₮ compounding conversion" },
];

const Index = () => {
  const sparklinePoints = useMemo(() => generateSparkline(), []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section className="container mx-auto px-6 h-[calc(100vh-56px)] flex flex-col justify-center pb-8 min-h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-8 items-center w-full">
          {/* Left: Copy */}
          <div className="w-full max-w-2xl z-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-infrared mb-6 font-semibold flex items-center gap-3">
              <span className="w-8 h-[2px] bg-infrared block" />
              AUTONOMOUS COMMITMENT PROTOCOL
            </p>
            <h1
              className="font-display font-medium uppercase leading-[0.9] tracking-tight mb-8"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}
            >
              <ScrambleText text="DISCIPLINE" duration={600} className="block text-foreground font-bold" />
              <span className="text-graphite font-bold">IS NOW </span>
              <span className="text-foreground border-b-8 border-infrared pb-2 inline-block font-bold">YIELD.</span>
            </h1>
            <p className="font-ui text-lg font-medium text-graphite leading-relaxed mb-10 max-w-[480px]">
              Lock capital into non-custodial smart contracts. Prove your biometric output via strictly enforced oracle data. Achieve your goals to earn Aave V3 yield, or forfeit 5% to the network on failure.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <DeployButton label="INITIALIZE VAULT ->" to="/create-vault" />
              <a href="#how-it-works" className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground hover:text-infrared transition-colors pb-1 border-b border-foreground/30 hover:border-infrared">
                VIEW ARCHITECTURE
              </a>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:flex w-full justify-center relative h-[500px] xl:h-[600px] items-center group perspective-1000">
            {/* Dramatic Backlight Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-infrared/15 rounded-full blur-[80px] z-0 transition-opacity duration-1000 group-hover:opacity-100 opacity-60"></div>
            
            {/* Architectural Grid Backdrop */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>
            
            <div className="relative z-10 flex justify-center items-center w-full transform-gpu transition-all duration-1000 ease-out group-hover:scale-[1.02]">
              <img 
                 src="/hero-visual.png" 
                 alt="Protocol Architecture" 
                 // Since the background is removed, drop-shadow perfectly outlines the 3D subject
                 className="w-[550px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] hover:-translate-y-3 transition-transform duration-1000 ease-in-out relative z-10" 
              />
              
              {/* Telemetry Accents */}
              <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-infrared animate-ping rounded-full z-0" />
              <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 bg-foreground opacity-30 rounded-full z-0" />
              <div className="absolute top-[10%] left-[20%] font-mono text-[8px] text-graphite opacity-50 z-0 tracking-[0.2em] uppercase origin-bottom-left -rotate-90">SYS.ON // 0xPROTO</div>
              
              {/* Refined Glassmorphic Status Badge */}
              <div className="absolute bottom-8 right-8 font-mono text-[10px] text-foreground bg-background/60 backdrop-blur-xl border border-foreground/10 px-5 py-3 flex items-center gap-4 z-20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-sm">
                <span className="text-infrared font-bold animate-pulse flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-infrared rounded-full inline-block"></span>
                  SYNCED
                </span>
                <span className="text-graphite font-medium border-l border-foreground/10 pl-4 uppercase tracking-widest">Oracle Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROTOCOL STATS BAR ═══════════ */}
      <section className="border-y border-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {PROTOCOL_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-6 px-4 ${i < PROTOCOL_STATS.length - 1 ? "border-r border-foreground" : ""}`}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-1">
                  {stat.label}
                </p>
                <p className={`font-display text-3xl md:text-4xl font-bold uppercase ${stat.accent ? "text-infrared" : ""}`}>
                  {stat.value}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-1">
                  {stat.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LIVE VAULT PREVIEW ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 mb-6 flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-infrared animate-oracle-flash" />
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground font-semibold">
              CONTROL PANEL — LIVE VAULT PREVIEW
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <VaultCard
              sweatGoal="30-DAY / 10K STEPS"
              oracleStatus="SYNCED"
              principal="$2,500.00"
              apy="AAVE V3 / 4.2%"
              synced
            />
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-end">
            <div className="mb-2">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground font-semibold">
                  COMMITMENT WINDOW
                </span>
              </div>
              <LinearPacer currentDay={21} totalDays={30} />
            </div>
            <div className="mt-6 flex justify-end">
              <Link to="/dashboard">
                <SecondaryButton label="Compounding Election →" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ BIOMETRIC DATA STREAM ═══════════ */}
      <section className="border-y border-foreground">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-2">
                // BIOMETRIC DATA STREAM
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite">
                RAW SENSOR INPUT — WEARABLE ORACLE FEED — 24H AGGREGATE
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <svg
                viewBox="0 0 800 80"
                className="w-full h-20"
                preserveAspectRatio="none"
              >
                <polyline
                  points={sparklinePoints}
                  fill="none"
                  stroke="hsl(var(--infrared))"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ MECHANISM / HOW IT WORKS ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 mb-8 md:mb-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
              // PROTOCOL MECHANISM
            </p>
            <h2
              className="font-display font-bold uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
            >
              HOW THE
              <br />
              <span className="text-infrared">MACHINE</span>
              <br />
              WORKS.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="border-t border-foreground">
              {MECHANISM_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="grid grid-cols-12 gap-4 border-b border-foreground py-8 group hover:bg-optical-ash transition-colors"
                >
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-infrared font-semibold">
                      {item.step}
                    </span>
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <span className="font-display text-lg md:text-xl uppercase font-bold">
                      {item.title}
                    </span>
                  </div>
                  <div className="col-span-6 md:col-span-8">
                    <p className="font-ui text-sm text-graphite leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PENALTY ARCHITECTURE ═══════════ */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // FORFEIT PROTOCOL
              </p>
              <h2
                className="font-display font-bold uppercase leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
              >
                CONSEQUENCES
                <br />
                <span className="text-infrared">ARE THE PRODUCT.</span>
              </h2>
              <p className="font-ui text-sm text-graphite mt-6 leading-relaxed max-w-md">
                FitVault doesn't motivate through rewards — it engineers
                accountability through irreversible financial consequence.
                The protocol is the enforcer.
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="border border-graphite/30">
                <div className="border-b border-graphite/30 p-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-2">
                    ON FAILURE — VALUE ROUTING
                  </p>
                  <div className="flex items-end gap-4 mt-4">
                    <div>
                      <p className="font-display text-5xl md:text-6xl font-bold text-penalty-crimson">95%</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-1">
                        → COMMUNITY REWARD POOL
                      </p>
                    </div>
                    <div className="text-infrared font-mono text-xl mb-2">//</div>
                    <div>
                      <p className="font-display text-3xl font-bold text-graphite">5%</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-1">
                        → PROTOCOL FEE
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-success-gold mb-2">
                    ON SUCCESS — VALUE ROUTING
                  </p>
                  <div className="flex items-end gap-4 mt-4">
                    <div>
                      <p className="font-display text-5xl md:text-6xl font-bold text-success-gold">100%</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-1">
                        PRINCIPAL + YIELD → WALLET
                      </p>
                    </div>
                    <div className="text-graphite font-mono text-lg mb-2">+</div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-aave-purple font-semibold">
                        OPT-IN XAU₮
                        <br />
                        COMPOUNDING
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROTOCOL ARCHITECTURE ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
              // INFRASTRUCTURE STACK
            </p>
            <h2
              className="font-display font-bold uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
            >
              PROTOCOL <span className="text-infrared">ARCHITECTURE</span>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-foreground">
          {ARCHITECTURE_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`p-6 group hover:bg-foreground hover:text-background transition-colors ${i < ARCHITECTURE_ITEMS.length - 1 ? "border-b md:border-b-0 md:border-r border-foreground" : ""}`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-3">
                {item.label}
              </p>
              <p className="font-display text-2xl font-bold uppercase mb-3">
                {item.value}
              </p>
              <p className="font-ui text-xs text-graphite leading-relaxed group-hover:text-graphite">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ COMMUNITY METRICS ═══════════ */}
      <section className="border-y border-foreground">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // COMMUNITY POOL
              </p>
              <h2
                className="font-display font-bold uppercase leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                FORFEIT
                <br />
                REWARDS
                <br />
                <span className="text-infrared">DISTRIBUTED.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-0 border border-foreground self-end">
              {[
                { label: "POOL BALANCE", value: "$142,500", sub: "USD₮ AVAILABLE", accent: true },
                { label: "FORFEITURES", value: "234", sub: "TOTAL EVENTS", accent: false },
                { label: "AVG REWARD", value: "$608", sub: "PER COMPLETER", accent: true },
              ].map((m, i) => (
                <div key={m.label} className={`p-6 ${i < 2 ? "border-r border-foreground" : ""}`}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-2">
                    {m.label}
                  </p>
                  <p className={`font-display text-3xl md:text-4xl font-bold ${m.accent ? "text-infrared" : ""}`}>{m.value}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-1">
                    {m.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 text-center">
            <div className="w-12 h-[2px] bg-infrared mx-auto mb-8" />
            <h2
              className="font-display font-bold uppercase leading-[0.88] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)" }}
            >
              INITIALIZE
              <br />
              YOUR <span className="text-infrared">VAULT.</span>
            </h2>
            <p className="font-ui text-sm text-graphite max-w-lg mx-auto mb-10 leading-relaxed">
              Deploy an autonomous commitment contract. Your discipline becomes
              yield. Your failure becomes someone else's reward.
            </p>
            <DeployButton label="INITIALIZE VAULT ->" to="/create-vault" />
            <div className="mt-6">
              <Link to="/audit">
                <SecondaryButton label="View Public Audit →" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-foreground py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">
            © 2026 FITVAULT-AI // ALL COMMITMENTS ARE FINAL // PROTOCOL V0.1.0
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite">
            TETHER WDK // OPENCLAW // AAVE V3 // PARASWAP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
