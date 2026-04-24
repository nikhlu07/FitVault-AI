import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import Header from "@/components/Header";
import { getActiveVault, settleVault, type VaultState } from "@/lib/vaultStore";

// ─── Phase types ────────────────────────────────────────────────────────────
type Phase =
  | "idle"
  | "evaluating"   // scramble effect — agent normalizing data
  | "flash"        // 1-frame infrared flash (forfeit) or white (success)
  | "result";      // final settled state

// ─── Scramble chars ──────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&";
function scramble(len: number) {
  return Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}

// ─── Ticker line component ───────────────────────────────────────────────────
function TickerLine({ text, delay = 0, color = "" }: { text: string; delay?: number; color?: string }) {
  return (
    <motion.p
      className={`font-mono text-[11px] leading-relaxed ${color || "text-background/80"} animate-ticker-in`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
    >
      {text}
    </motion.p>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
const Settlement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { address } = useAccount();

  // Allow ?outcome=success|forfeit for demo/testing
  const forcedOutcome = searchParams.get("outcome") as "success" | "forfeit" | null;

  const [vault, setVault] = useState<VaultState | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [outcome, setOutcome] = useState<"success" | "forfeit" | null>(null);
  const [scrambleText, setScrambleText] = useState("");
  const [tickerLines, setTickerLines] = useState<string[]>([]);
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load vault
  useEffect(() => {
    if (address) {
      const v = getActiveVault(address);
      setVault(v);
    }
  }, [address]);

  // Kick off evaluation sequence
  const startEvaluation = () => {
    const result = forcedOutcome ?? (Math.random() > 0.25 ? "success" : "forfeit");
    setOutcome(result as "success" | "forfeit");
    setPhase("evaluating");

    // Scramble for 2.4s
    let ticks = 0;
    scrambleRef.current = setInterval(() => {
      setScrambleText(scramble(12));
      ticks++;
      if (ticks > 24) {
        clearInterval(scrambleRef.current!);
        setPhase("flash");
        setTimeout(() => {
          setPhase("result");
          if (vault) settleVault(vault.id, result as "success" | "forfeit");
          buildTicker(result as "success" | "forfeit");
        }, 350);
      }
    }, 100);
  };

  const buildTicker = (res: "success" | "forfeit") => {
    const stake = vault ? parseFloat(vault.stakeAmount) : 2500;
    const dur = vault?.duration ?? 30;
    const yld = (stake * 0.042 * (dur / 365)).toFixed(2);

    if (res === "success") {
      setTickerLines([
        `> COMMITMENT WINDOW CLOSED // EVALUATION: COMPLETE`,
        `> GOAL MET // ${vault?.goalValue ?? "10000"} ${vault?.goalType?.toUpperCase() ?? "STEPS"} / DAY`,
        `> AAVE V3 WITHDRAWAL INITIATED // PRINCIPAL: ${stake.toLocaleString()} USD₮`,
        `> YIELD ACCRUED: +${yld} USD₮ // 85% → WALLET`,
        `> PROTOCOL FEE: ${(parseFloat(yld) * 0.15).toFixed(4)} USD₮ // 15% → TREASURY`,
        vault?.compounding
          ? `> PARASWAP ROUTING // USD₮ → XAU₮ // SLIPPAGE: 0.3%`
          : `> SETTLEMENT ASSET: USD₮ // NO SWAP ELECTED`,
        `> TETHER WDK TRANSFER // ${(stake + parseFloat(yld) * 0.85).toFixed(2)} USD₮ → WALLET`,
        `> VAULT STATE: CLOSED // COMMITMENT FULFILLED`,
      ]);
    } else {
      setTickerLines([
        `> COMMITMENT WINDOW CLOSED // EVALUATION: COMPLETE`,
        `> GOAL MISSED // FORFEIT PROTOCOL EXECUTING`,
        `> PRINCIPAL: ${stake.toLocaleString()} USD₮ // ROUTING INITIATED`,
        `> PROTOCOL FEE: ${(stake * 0.05).toFixed(2)} USD₮ // 5% → TREASURY`,
        `> COMMUNITY POOL: ${(stake * 0.95).toFixed(2)} USD₮ // 95% → REWARD POOL`,
        `> LEADERBOARD DISTRIBUTION // PENDING EPOCH CLOSE`,
        `> VAULT STATE: CLOSED // COMMITMENT FORFEITED`,
        `> AGENT: AUTONOMOUS EXECUTION COMPLETE // NO APPEALS`,
      ]);
    }
  };

  useEffect(() => {
    return () => { if (scrambleRef.current) clearInterval(scrambleRef.current); };
  }, []);

  const stake = vault ? parseFloat(vault.stakeAmount) : 2500;
  const dur = vault?.duration ?? 30;
  const yld = (stake * 0.042 * (dur / 365)).toFixed(2);
  const successTotal = (stake + parseFloat(yld) * 0.85).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />

      {/* ── Infrared flash overlay (forfeit) ── */}
      <AnimatePresence>
        {phase === "flash" && outcome === "forfeit" && (
          <motion.div
            className="fixed inset-0 bg-infrared z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* ── White flash overlay (success) ── */}
      <AnimatePresence>
        {phase === "flash" && outcome === "success" && (
          <motion.div
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      <main className="flex-1 container mx-auto px-6 py-12">

        {/* ── IDLE: pre-evaluation ── */}
        {phase === "idle" && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // COMMITMENT WINDOW CLOSING
              </p>
              <h1
                className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
              >
                SETTLEMENT
                <br />
                <span className="text-infrared">PROTOCOL.</span>
              </h1>
              <p className="font-ui text-sm text-graphite leading-relaxed mb-8 max-w-md">
                The OpenClaw agent will now evaluate your biometric data against vault
                terms. This process is autonomous and irreversible. The outcome is final.
              </p>

              {vault ? (
                <div className="border border-foreground p-5 mb-8 space-y-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-3">
                    // VAULT UNDER EVALUATION
                  </p>
                  {[
                    { k: "VAULT ID", v: vault.id },
                    { k: "STAKE", v: `${stake.toLocaleString()} USD₮` },
                    { k: "GOAL", v: `${parseInt(vault.goalValue).toLocaleString()} ${vault.goalType.toUpperCase()} / DAY` },
                    { k: "DURATION", v: `${vault.duration} DAYS` },
                    { k: "COMPOUNDING", v: vault.compounding ? "XAU₮ ELECTED" : "DISABLED" },
                    { k: "EST. YIELD", v: `+${yld} USD₮` },
                  ].map((r) => (
                    <div key={r.k} className="flex justify-between py-1 border-b border-foreground/10">
                      <span className="font-mono text-[9px] text-graphite">{r.k}</span>
                      <span className="font-mono text-[9px] font-semibold">{r.v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-foreground/30 p-5 mb-8">
                  <p className="font-mono text-[9px] text-graphite">
                    // DEMO MODE — NO ACTIVE VAULT DETECTED
                  </p>
                  <p className="font-mono text-[9px] text-graphite mt-1">
                    USING SAMPLE VAULT: $2,500 USD₮ / 30-DAY / 10K STEPS
                  </p>
                </div>
              )}

              <button
                onClick={startEvaluation}
                className="bg-infrared px-8 py-5 font-display text-base uppercase tracking-[0.15em] font-bold text-foreground w-full hover:shadow-[0_0_0_2px_hsl(var(--absolute-white)),0_0_0_4px_hsl(var(--vantablack))] transition-all"
              >
                EXECUTE SETTLEMENT PROTOCOL →
              </button>

              {forcedOutcome && (
                <p className="font-mono text-[9px] text-graphite mt-3 text-center">
                  DEMO: OUTCOME FORCED TO {forcedOutcome.toUpperCase()}
                </p>
              )}
            </div>

            {/* Right: what happens panel */}
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <div className="border border-foreground">
                <div className="p-5 border-b border-foreground">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-success-gold mb-3">
                    // IF GOAL MET
                  </p>
                  <p className="font-display text-3xl font-bold text-success-gold">${successTotal}</p>
                  <p className="font-mono text-[9px] text-graphite mt-1">
                    PRINCIPAL + 85% YIELD → WALLET
                  </p>
                </div>
                <div className="p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-penalty-crimson mb-3">
                    // IF GOAL MISSED
                  </p>
                  <p className="font-display text-3xl font-bold text-penalty-crimson">
                    -${stake.toLocaleString()}.00
                  </p>
                  <p className="font-mono text-[9px] text-graphite mt-1">
                    5% PROTOCOL // 95% COMMUNITY POOL
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EVALUATING: scramble effect ── */}
        {phase === "evaluating" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-infrared mb-8">
              // OPENCLAW AGENT — NORMALIZING BIOMETRIC DATA
            </p>
            <div
              className="font-mono font-bold text-infrared leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 10vw, 8rem)", letterSpacing: "0.1em" }}
            >
              {scrambleText}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-graphite">
              EVALUATING COMMITMENT AGAINST ORACLE FEED...
            </p>
            <div className="flex gap-1 mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-infrared"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULT: forfeit ── */}
        {phase === "result" && outcome === "forfeit" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-12 gap-6"
          >
            {/* Left: outcome */}
            <div className="col-span-12 md:col-span-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-penalty-crimson mb-4">
                // COMMITMENT FAILED — FORFEIT EXECUTED
              </p>
              <motion.h1
                className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                GOAL
                <br />
                <span className="text-penalty-crimson relative inline-block">
                  MISSED.
                  {/* Strikethrough wipe */}
                  <motion.span
                    className="absolute top-1/2 left-0 h-[4px] bg-penalty-crimson"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.4, duration: 0.4, ease: "easeIn" }}
                  />
                </span>
              </motion.h1>

              {/* Forfeit breakdown */}
              <motion.div
                className="border border-penalty-crimson/40 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-5 border-b border-penalty-crimson/20">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-3">
                    // FORFEIT ROUTING — REAL-TIME
                  </p>
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="font-display text-5xl font-bold text-penalty-crimson">95%</p>
                      <p className="font-mono text-[9px] text-graphite mt-1">→ COMMUNITY REWARD POOL</p>
                      <p className="font-display text-2xl font-bold text-penalty-crimson mt-1">
                        ${(stake * 0.95).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-graphite font-mono text-xl mb-2">//</div>
                    <div>
                      <p className="font-display text-3xl font-bold text-graphite">5%</p>
                      <p className="font-mono text-[9px] text-graphite mt-1">→ PROTOCOL FEE</p>
                      <p className="font-display text-xl font-bold text-graphite mt-1">
                        ${(stake * 0.05).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-mono text-[9px] text-graphite">
                    VAULT ID: {vault?.id ?? "DEMO"} // STATE: CLOSED // NO APPEALS
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => navigate("/create-vault")}
                  className="bg-infrared px-6 py-4 font-display text-sm uppercase tracking-[0.15em] font-bold text-foreground hover:shadow-[0_0_0_2px_hsl(var(--absolute-white)),0_0_0_4px_hsl(var(--vantablack))] transition-all"
                >
                  REDEPLOY VAULT →
                </button>
                <button
                  onClick={() => navigate("/audit")}
                  className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.15em] border border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  VIEW AUDIT LOG
                </button>
              </motion.div>
            </div>

            {/* Right: terminal ticker */}
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <div className="bg-foreground p-5 h-full min-h-[300px]">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-infrared mb-4">
                  // AGENT EXECUTION LOG
                </p>
                <div className="space-y-1">
                  {tickerLines.map((line, i) => (
                    <TickerLine
                      key={i}
                      text={line}
                      delay={i * 0.18}
                      color={i >= 2 && i <= 4 ? "text-penalty-crimson" : "text-background/80"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RESULT: success ── */}
        {phase === "result" && outcome === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-12 gap-6"
          >
            {/* Left: outcome */}
            <div className="col-span-12 md:col-span-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-success-gold mb-4">
                // COMMITMENT FULFILLED — SETTLEMENT COMPLETE
              </p>
              <motion.h1
                className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                GOAL
                <br />
                <span className="text-success-gold">MET.</span>
              </motion.h1>

              {/* Success payout */}
              <motion.div
                className="border border-success-gold/40 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-5 border-b border-success-gold/20">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-3">
                    // SETTLEMENT PAYOUT
                  </p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  >
                    <p className="font-display text-6xl font-bold text-success-gold">
                      ${successTotal}
                    </p>
                    <p className="font-mono text-[9px] text-graphite mt-2">
                      PRINCIPAL ${stake.toLocaleString()} + YIELD ${(parseFloat(yld) * 0.85).toFixed(2)} USD₮
                    </p>
                  </motion.div>
                </div>
                {vault?.compounding && (
                  <motion.div
                    className="p-5 border-b border-success-gold/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-aave-purple mb-2">
                      // XAU₮ COMPOUNDING — PARASWAP EXECUTING
                    </p>
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="font-display text-2xl font-bold text-aave-purple"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.2, repeat: 3 }}
                      >
                        USD₮
                      </motion.span>
                      <span className="font-mono text-infrared text-lg">→</span>
                      <motion.span
                        className="font-display text-2xl font-bold text-success-gold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        XAU₮
                      </motion.span>
                    </div>
                    <p className="font-mono text-[9px] text-graphite mt-2">
                      {(parseFloat(yld) * 0.85 / 3200).toFixed(6)} XAU₮ → SUCCESS VAULT
                    </p>
                  </motion.div>
                )}
                <div className="p-4">
                  <p className="font-mono text-[9px] text-graphite">
                    VAULT ID: {vault?.id ?? "DEMO"} // STATE: CLOSED // COMMITMENT FULFILLED
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <button
                  onClick={() => navigate("/create-vault")}
                  className="bg-infrared px-6 py-4 font-display text-sm uppercase tracking-[0.15em] font-bold text-foreground hover:shadow-[0_0_0_2px_hsl(var(--absolute-white)),0_0_0_4px_hsl(var(--vantablack))] transition-all"
                >
                  NEW VAULT →
                </button>
                <button
                  onClick={() => navigate("/audit")}
                  className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.15em] border border-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  VIEW AUDIT LOG
                </button>
              </motion.div>
            </div>

            {/* Right: terminal ticker */}
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <div className="bg-foreground p-5 h-full min-h-[300px]">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-success-gold mb-4">
                  // AGENT EXECUTION LOG
                </p>
                <div className="space-y-1">
                  {tickerLines.map((line, i) => (
                    <TickerLine
                      key={i}
                      text={line}
                      delay={i * 0.18}
                      color={i >= 2 && i <= 4 ? "text-success-gold" : "text-background/80"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Settlement;
