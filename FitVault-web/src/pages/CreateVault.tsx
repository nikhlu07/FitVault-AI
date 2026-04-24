import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Header from "@/components/Header";
import { useScramble } from "@/hooks/useScramble";
import { useVault, type GoalType } from "@/hooks/useVault";
import { saveVault } from "@/lib/vaultStore";

const DURATION_OPTIONS = [
  { label: "7 DAYS", value: 7, risk: "LOW" },
  { label: "14 DAYS", value: 14, risk: "MEDIUM" },
  { label: "30 DAYS", value: 30, risk: "HIGH" },
  { label: "90 DAYS", value: 90, risk: "EXTREME" },
];

const STEP_LABELS: Record<string, string> = {
  idle: "STAKE & DEPLOY ->",
  approving: "APPROVING USD₮...",
  deploying: "DEPLOYING VAULT...",
  done: "VAULT DEPLOYED ✓",
  error: "RETRY DEPLOY ->",
};

const CreateVault = () => {
  const navigate = useNavigate();
  const { openConnectModal } = useConnectModal();
  const { deploy, step, errorMsg, reset, isConnected, address } = useVault();

  const [goalType, setGoalType] = useState<GoalType>("steps");
  const [goalValue, setGoalValue] = useState("10000");
  const [stakeAmount, setStakeAmount] = useState("2500");
  const [duration, setDuration] = useState(30);
  const [compounding, setCompounding] = useState(false);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);

  const stake = parseFloat(stakeAmount || "0");
  const estimatedYield = (stake * 0.042 * (duration / 365)).toFixed(2);
  const forfeitProtocol = (stake * 0.05).toFixed(2);
  const forfeitCommunity = (stake * 0.95).toFixed(2);

  const isDeploying = step === "approving" || step === "deploying";
  const isDone = step === "done";

  const buttonLabel = useScramble(
    STEP_LABELS[step] ?? "STAKE & DEPLOY ->",
    1200,
    scrambleTrigger
  );

  const selectedDuration = DURATION_OPTIONS.find((d) => d.value === duration);

  const handleDeploy = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    if (step === "error") reset();

    setScrambleTrigger((p) => p + 1);

    const success = await deploy({ stakeAmount, goalType, goalValue, duration, compounding });

    if (success && address) {
      // Persist vault locally so dashboard can read it
      saveVault({
        id: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
        owner: address,
        stakeAmount,
        goalType,
        goalValue,
        duration,
        compounding,
        startDate: new Date().toISOString().split("T")[0],
        status: "active",
        currentDay: 1,
        accruedYield: 0,
      });
      setTimeout(() => navigate("/dashboard"), 800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Title + Context */}
          <div className="col-span-12 md:col-span-4 md:sticky md:top-12 md:self-start">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
              // VAULT INITIALIZATION
            </p>
            <h1
              className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
            >
              CONFIGURE
              <br />
              YOUR
              <br />
              <span className="text-infrared">VAULT.</span>
            </h1>
            <p className="font-ui text-sm text-graphite leading-relaxed mb-8">
              Define your biometric commitment parameters and stake configuration.
              All terms are cryptographically enforced and immutable post-deployment.
            </p>

            {/* Wallet status */}
            <div className={`border p-4 mb-4 ${isConnected ? "border-success-gold/40" : "border-infrared/40"}`}>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-2">
                // WALLET STATUS
              </p>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-success-gold rounded-full inline-block" />
                  <span className="font-mono text-[10px] text-success-gold uppercase">CONNECTED</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-infrared rounded-full animate-pulse inline-block" />
                  <span className="font-mono text-[10px] text-infrared uppercase">NOT CONNECTED</span>
                </div>
              )}
            </div>

            {/* Protocol info */}
            <div className="border border-foreground p-4 space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">
                // PROTOCOL PARAMETERS
              </p>
              {[
                { k: "YIELD ENGINE", v: "AAVE V3" },
                { k: "SETTLEMENT", v: "TETHER WDK" },
                { k: "ORACLE", v: "OPENCLAW AGENT" },
                { k: "NETWORK", v: "POLYGON" },
                { k: "GAS ESTIMATE", v: "~0.004 MATIC" },
              ].map((p) => (
                <div key={p.k} className="flex justify-between">
                  <span className="font-mono text-[9px] text-graphite">{p.k}</span>
                  <span className="font-mono text-[9px]">{p.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            {/* Step 1: Metric */}
            <section className="mb-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-infrared mb-6">
                // STEP 01 — DEFINE SWEAT GOAL
              </p>
              <div className="mb-8">
                <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-graphite block mb-3">
                  METRIC TYPE
                </label>
                <div className="grid grid-cols-3 gap-0 border border-foreground">
                  {[
                    { value: "steps" as GoalType, label: "DAILY STEPS", icon: "//" },
                    { value: "active-minutes" as GoalType, label: "ACTIVE MIN", icon: "→" },
                    { value: "heart-rate" as GoalType, label: "HR ZONE", icon: "♥" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGoalType(opt.value)}
                      className={`p-4 text-left border-r border-foreground last:border-r-0 transition-colors ${
                        goalType === opt.value
                          ? "bg-infrared text-foreground"
                          : "bg-transparent hover:bg-optical-ash"
                      }`}
                    >
                      <span className="font-mono text-[9px] text-graphite block mb-1">{opt.icon}</span>
                      <span className="font-display text-xs uppercase font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-graphite block mb-2">
                  TARGET VALUE
                </label>
                <input
                  type="text"
                  value={goalValue}
                  onChange={(e) => setGoalValue(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground py-3 font-display text-4xl md:text-5xl font-bold focus:outline-none"
                  placeholder="10000"
                />
                <p className="font-mono text-[9px] text-graphite mt-2">
                  {goalType === "steps" && "MINIMUM DAILY STEPS TO MAINTAIN COMMITMENT"}
                  {goalType === "active-minutes" && "MINIMUM DAILY ACTIVE MINUTES (MODERATE+)"}
                  {goalType === "heart-rate" && "MINIMUM DAILY MINUTES IN TARGET HR ZONE"}
                </p>
              </div>
            </section>

            {/* Step 2: Duration */}
            <section className="mb-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-infrared mb-6">
                // STEP 02 — COMMITMENT WINDOW
              </p>
              <div className="grid grid-cols-4 gap-0 border border-foreground">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`p-4 text-center border-r border-foreground last:border-r-0 transition-colors ${
                      duration === opt.value
                        ? "bg-infrared text-foreground"
                        : "bg-transparent hover:bg-optical-ash"
                    }`}
                  >
                    <span className="font-display text-lg md:text-xl font-bold block">{opt.label}</span>
                    <span className="font-mono text-[9px] block mt-1 text-graphite">
                      RISK: {opt.risk}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Stake */}
            <section className="mb-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-infrared mb-6">
                // STEP 03 — STAKE CONFIGURATION
              </p>
              <div className="mb-8">
                <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-graphite block mb-2">
                  USD₮ AMOUNT
                </label>
                <div className="flex items-baseline gap-2 border-b border-foreground pb-3">
                  <span className="font-display text-4xl md:text-6xl font-bold text-infrared">$</span>
                  <input
                    type="text"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 bg-transparent font-display text-4xl md:text-6xl font-bold focus:outline-none"
                    placeholder="2500"
                  />
                  <span className="font-mono text-[11px] text-graphite">USD₮</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {["500", "1000", "2500", "5000", "10000"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setStakeAmount(amt)}
                      className={`px-3 py-1.5 font-mono text-[10px] border border-foreground transition-colors ${
                        stakeAmount === amt ? "bg-infrared text-foreground" : "hover:bg-optical-ash"
                      }`}
                    >
                      ${parseInt(amt).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Step 4: Compounding election */}
            <section className="mb-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-infrared mb-6">
                // STEP 04 — COMPOUNDING ELECTION (OPTIONAL)
              </p>
              <div
                onClick={() => setCompounding((c) => !c)}
                className={`border p-5 cursor-pointer transition-colors flex items-start gap-4 ${
                  compounding ? "border-aave-purple bg-aave-purple/5" : "border-foreground hover:bg-optical-ash"
                }`}
              >
                <div className={`w-4 h-4 border mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors ${
                  compounding ? "border-aave-purple bg-aave-purple" : "border-foreground"
                }`}>
                  {compounding && <span className="text-background text-[10px] font-bold">✓</span>}
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase font-semibold mb-1">
                    ELECT XAU₮ COMPOUNDING
                  </p>
                  <p className="font-ui text-xs text-graphite leading-relaxed">
                    On success, accrued USD₮ yield will be swapped to XAU₮ (Tether Gold) via Paraswap V6
                    and deposited into your Success Vault for long-term wealth preservation.
                  </p>
                </div>
              </div>
            </section>

            {/* Yield Projection */}
            <section className="mb-14">
              <div className="border border-foreground">
                <div className="grid grid-cols-2 border-b border-foreground">
                  <div className="p-5 border-r border-foreground">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-2">
                      EST. {duration}-DAY YIELD
                    </p>
                    <p className="font-mono text-2xl md:text-3xl font-semibold text-aave-purple">
                      +${estimatedYield}
                    </p>
                    <p className="font-mono text-[9px] text-graphite mt-1">AAVE V3 // 4.21% APY</p>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-2">
                      TOTAL ON SUCCESS
                    </p>
                    <p className="font-display text-2xl md:text-3xl font-bold text-success-gold">
                      ${(stake + parseFloat(estimatedYield)).toFixed(2)}
                    </p>
                    <p className="font-mono text-[9px] text-graphite mt-1">PRINCIPAL + YIELD → WALLET</p>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-5 border-r border-foreground">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-2">
                      ON FAILURE — PROTOCOL FEE
                    </p>
                    <p className="font-mono text-xl text-penalty-crimson font-semibold">
                      -${forfeitProtocol}
                    </p>
                    <p className="font-mono text-[9px] text-graphite mt-1">5% → PROTOCOL</p>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-2">
                      ON FAILURE — COMMUNITY
                    </p>
                    <p className="font-mono text-xl text-penalty-crimson font-semibold">
                      -${forfeitCommunity}
                    </p>
                    <p className="font-mono text-[9px] text-graphite mt-1">95% → SOCIAL REWARD POOL</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Vault Summary */}
            <section className="mb-10">
              <div className="bg-optical-ash p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-4">
                  // VAULT SUMMARY
                </p>
                <div className="space-y-2">
                  {[
                    { k: "METRIC", v: goalType === "steps" ? "DAILY STEPS" : goalType === "active-minutes" ? "ACTIVE MINUTES" : "HR ZONE" },
                    { k: "TARGET", v: parseInt(goalValue || "0").toLocaleString() },
                    { k: "DURATION", v: `${duration} DAYS` },
                    { k: "RISK LEVEL", v: selectedDuration?.risk || "—" },
                    { k: "STAKE", v: `${stake.toLocaleString()} USD₮` },
                    { k: "EST. YIELD", v: `+${estimatedYield} USD₮` },
                    { k: "COMPOUNDING", v: compounding ? "XAU₮ VIA PARASWAP" : "DISABLED" },
                    { k: "ENFORCEMENT", v: "AUTONOMOUS — OPENCLAW AGENT" },
                  ].map((row) => (
                    <div key={row.k} className="flex justify-between py-1.5 border-b border-foreground/10">
                      <span className="font-mono text-[10px] text-graphite">{row.k}</span>
                      <span className={`font-mono text-[10px] font-semibold ${row.k === "COMPOUNDING" && compounding ? "text-aave-purple" : ""}`}>
                        {row.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Error message */}
            {errorMsg && (
              <div className="border border-penalty-crimson p-4 mb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-penalty-crimson">
                  // ERROR: {errorMsg}
                </p>
              </div>
            )}

            {/* Transaction status */}
            {isDeploying && (
              <div className="border border-foreground/30 p-4 mb-6 bg-optical-ash">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-infrared rounded-full animate-ping inline-block" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em]">
                    {step === "approving" ? "AWAITING USD₮ APPROVAL IN WALLET..." : "DEPLOYING VAULT CONTRACT..."}
                  </p>
                </div>
                <p className="font-mono text-[9px] text-graphite mt-2">
                  {step === "approving"
                    ? "STEP 1/2 — APPROVE USDT SPEND IN YOUR WALLET"
                    : "STEP 2/2 — CONFIRM VAULT CREATION TRANSACTION"}
                </p>
              </div>
            )}

            {isDone && (
              <div className="border border-success-gold p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-success-gold rounded-full inline-block" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-success-gold">
                    VAULT DEPLOYED — REDIRECTING TO DASHBOARD...
                  </p>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="border-t border-foreground pt-6 mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-graphite leading-relaxed">
                WARNING: TERMS ARE IMMUTABLE POST-CREATION. FAILURE RESULTS IN 5%
                PROTOCOL FEE AND 95% COMMUNITY FORFEIT. BY PROCEEDING, YOU ACCEPT
                THE IRREVOCABLE COMMITMENT PROTOCOL. NO REFUNDS. NO APPEALS. NO EXCEPTIONS.
              </p>
            </div>

            {/* Deploy button */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying || isDone}
              className="bg-infrared px-8 py-5 font-display text-base uppercase tracking-[0.15em] font-bold text-foreground transition-all hover:shadow-[0_0_0_2px_hsl(var(--absolute-white)),0_0_0_4px_hsl(var(--vantablack))] disabled:opacity-70 w-full"
            >
              {!isConnected ? "CONNECT WALLET TO DEPLOY" : buttonLabel}
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-foreground py-4 px-6 mt-16">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">
          © 2026 FITVAULT-AI // VAULT CONFIGURATION IS FINAL // PROTOCOL V0.1.0
        </p>
      </footer>
    </div>
  );
};

export default CreateVault;
