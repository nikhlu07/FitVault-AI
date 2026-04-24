import { motion } from "framer-motion";
import Header from "@/components/Header";
import DeployButton from "@/components/DeployButton";
import { ArrowRight, ShieldAlert, Cpu, Activity, Coins, LineChart } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.2 }
};

const PitchDeck = () => {
  return (
    <div className="min-h-screen flex flex-col bg-vantablack text-background overflow-x-hidden selection:bg-infrared selection:text-background">
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-infrared/10 rounded-full blur-[100px] z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-infrared mb-6 font-semibold flex items-center gap-3">
              <span className="w-8 h-[2px] bg-infrared block" />
              INVESTOR PRESENTATION
            </p>
            <h1 className="font-display font-medium uppercase leading-[0.9] tracking-tight mb-8" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
              <span className="text-foreground font-bold">AUTONOMOUS </span><br/>
              <span className="text-graphite font-bold">HEALTH COMMITMENT </span><br/>
              <span className="text-foreground border-b-8 border-infrared pb-2 inline-block font-bold">INFRASTRUCTURE.</span>
            </h1>
            <p className="font-mono text-lg md:text-xl text-graphite leading-relaxed mb-10 border-l-2 border-infrared pl-4">
              Powered by <span className="text-foreground">Tether</span>. 
              Driven by <span className="text-foreground">Sweat</span>. 
              Secured by <span className="text-foreground">Smart Contracts</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE PROBLEM ═══════════ */}
      <section className="py-24 border-t border-foreground relative">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // 01. THE PROBLEM
              </p>
              <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-6 text-4xl md:text-5xl">
                LEGACY MOVE-TO-EARN IS <span className="text-penalty-crimson">BROKEN.</span>
              </h2>
              <p className="font-ui text-graphite leading-relaxed mb-8">
                The first generation of Move-to-Earn (M2E) protocols like StepN and Sweatcoin shared an elegant premise and a fatal design flaw: They rewarded activity with project-native tokens, creating an immediate supply-demand imbalance.
              </p>
            </div>
            
            <div className="lg:col-span-7 grid gap-6">
              <div className="p-8 border border-penalty-crimson/30 bg-penalty-crimson/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-penalty-crimson"></div>
                <h3 className="font-mono text-xl text-foreground font-bold mb-6 tracking-tight uppercase flex items-center gap-3">
                  <Activity className="text-penalty-crimson" size={24} />
                  The Death Spiral
                </h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <p className="font-mono text-[10px] text-infrared mb-1">STAGE 1</p>
                    <p className="font-ui text-graphite text-sm"><strong className="text-foreground">Tokens Minted</strong> continuously as rewards.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-infrared mb-1">STAGE 2</p>
                    <p className="font-ui text-graphite text-sm"><strong className="text-foreground">Value Relies</strong> entirely on new users buying in.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-infrared mb-1">STAGE 3</p>
                    <p className="font-ui text-graphite text-sm"><strong className="text-foreground">Growth Stalls</strong>, token value collapses.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-infrared mb-1">STAGE 4</p>
                    <p className="font-ui text-graphite text-sm"><strong className="text-foreground">Incentive Vanishes</strong> permanently.</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-penalty-crimson/20">
                  <p className="font-mono text-sm text-graphite italic">
                    "Any system that pays rewards by printing its own currency is structurally unsustainable."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE SOLUTION ═══════════ */}
      <section className="py-24 border-t border-foreground bg-background text-foreground">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="max-w-3xl mb-16">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
              // 02. THE SOLUTION
            </p>
            <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-6 text-4xl md:text-6xl">
              COMMITMENT-AS-A-SERVICE. <br/>
              <span className="text-infrared">WE INVERT THE MODEL.</span>
            </h2>
            <p className="font-mono text-graphite text-lg border-l-2 border-infrared pl-4">
              FitVault-AI does not print tokens.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Coins, title: "Real Assets", desc: "Users stake assets they already own (USD₮) against a personal fitness goal." },
              { icon: ShieldAlert, title: "Accountability Layer", desc: "The protocol acts as an impartial, autonomous referee enforcing the contract." },
              { icon: LineChart, title: "Real Yield", desc: "The protocol deploys the staked capital into established DeFi protocols (e.g. Aave V3) to generate real yield." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="p-8 border border-foreground bg-vantablack text-background hover:bg-foreground hover:text-background transition-colors group">
                <feature.icon className="text-infrared mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-display text-2xl font-bold uppercase mb-4">{feature.title}</h3>
                <p className="font-ui text-graphite text-sm group-hover:text-background/80 transition-colors">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div {...fadeIn} className="mt-12 p-6 border border-foreground/20 bg-vantablack text-background text-center">
            <p className="font-mono text-sm md:text-base">
              <strong className="text-infrared">Succeed</strong>, and you reclaim your principal plus 85% of everything it earned. <br className="hidden md:block"/>
              <strong className="text-penalty-crimson">Miss your goal</strong>, and the forfeit flows to a community reward pool.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-24 border-y border-foreground">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
              // 03. THE LOOP
            </p>
            <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight text-4xl md:text-5xl">
              HOW IT WORKS
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-foreground/20 -translate-x-1/2"></div>
            
            {[
              { step: "1", title: "STAKE", desc: "Lock USD₮ into a non-custodial vault and define a biometric goal (e.g., 10k steps/day)." },
              { step: "2", title: "DEPLOY", desc: "Capital is immediately deployed to Aave V3 for yield." },
              { step: "3", title: "MONITOR", desc: "OpenClaw AI agent tracks health oracle data autonomously." },
              { step: "4", title: "SETTLE", desc: "Goal Met: Reclaim Principal + 85% Yield.\nGoal Missed: Forfeit 5% to Protocol, 95% to Community Pool. No appeals." }
            ].map((item, i) => (
              <motion.div key={i} {...fadeIn} className={`relative flex items-center justify-between md:justify-normal mb-12 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                <div className="hidden md:block w-[45%]"></div>
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-vantablack border-2 border-infrared text-infrared flex items-center justify-center font-mono text-sm font-bold -translate-x-1/2 z-10">
                  {item.step}
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[45%] pl-8 md:pl-0">
                  <div className={`p-6 border border-foreground bg-background/5 backdrop-blur-sm ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="font-display text-xl font-bold uppercase mb-2 text-foreground">{item.title}</h3>
                    <p className="font-ui text-graphite text-sm whitespace-pre-line">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SYSTEM ARCHITECTURE ═══════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // 04. SYSTEM ARCHITECTURE
              </p>
              <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-8 text-4xl md:text-5xl">
                SEPARATING <span className="text-infrared">REASONING</span><br/>
                FROM EXECUTION.
              </h2>
              
              <div className="space-y-8">
                <div className="p-6 border border-foreground hover:border-infrared/50 transition-colors bg-foreground/5 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-infrared/20 text-infrared flex items-center justify-center rounded-sm group-hover:bg-infrared group-hover:text-background transition-colors">
                      <Cpu size={20} />
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase">The Brain <span className="text-graphite text-lg">(OpenClaw Agent)</span></h3>
                  </div>
                  <ul className="space-y-3 font-ui text-sm text-graphite ml-14">
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-infrared flex-shrink-0" /> <strong>Normalizes Data:</strong> Converts raw oracle feeds (heart rate, steps) into objective scores.</li>
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-infrared flex-shrink-0" /> <strong>Plans Finances:</strong> Rebalances DeFi positions based on rates.</li>
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-infrared flex-shrink-0" /> <strong>Executes Autonomously:</strong> Strictly follows vault logic without manual intervention.</li>
                  </ul>
                </div>
                
                <div className="p-6 border border-foreground hover:border-infrared/50 transition-colors bg-foreground/5 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-foreground/20 text-foreground flex items-center justify-center rounded-sm group-hover:bg-foreground group-hover:text-background transition-colors">
                      <Activity size={20} />
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase">The Hands <span className="text-graphite text-lg">(Tether WDK)</span></h3>
                  </div>
                  <ul className="space-y-3 font-ui text-sm text-graphite ml-14">
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-foreground flex-shrink-0" /> <strong>Non-Custodial:</strong> BIP-44 HD Wallets (never holds your keys).</li>
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-foreground flex-shrink-0" /> <strong>DeFi Execution:</strong> Aave V3 for lending, Paraswap for swapping.</li>
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 text-foreground flex-shrink-0" /> <strong>Multi-Chain:</strong> Ethereum, Polygon, Solana.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative h-full min-h-[400px] hidden lg:block">
              {/* Architecture visual representation */}
              <div className="absolute inset-0 border border-foreground/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-infrared/5 via-background to-background p-8 flex flex-col justify-between">
                <div className="w-full p-4 border border-infrared/30 bg-infrared/5 text-center font-mono text-xs text-infrared">
                  [ OPENCLAW AI AGENT ]
                </div>
                
                <div className="flex-1 flex justify-center py-8">
                  <div className="w-[1px] bg-gradient-to-b from-infrared/50 via-foreground/50 to-foreground/50 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rotate-45 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="w-full flex gap-4">
                  <div className="flex-1 p-4 border border-foreground/30 bg-foreground/5 text-center font-mono text-xs text-foreground">
                    [ TETHER WDK ]
                  </div>
                  <div className="flex-1 p-4 border border-foreground/30 bg-foreground/5 text-center font-mono text-xs text-foreground">
                    [ AAVE V3 ]
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ BUSINESS MODEL & ROADMAP ═══════════ */}
      <section className="py-24 border-t border-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div {...fadeIn}>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // 05. BUSINESS MODEL
              </p>
              <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-8 text-4xl">
                SUSTAINABLE REVENUE. <br/>
                <span className="text-graphite">WE PROFIT WHEN YOU WIN.</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: "YIELD SHARE (15%)", desc: "The protocol retains 15% of the DeFi yield generated on staked assets when a user succeeds." },
                  { title: "FORFEIT FEES (5%)", desc: "A modest management fee on failed vaults before the rest flows to the community pool." },
                  { title: "AaaS SUBSCRIPTIONS", desc: "Micro-fees for users requiring high-frequency monitoring (e.g., hourly compliance checks)." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 border-b border-foreground/20 pb-6">
                    <div className="font-mono text-lg text-infrared font-bold">0{i+1}</div>
                    <div>
                      <h4 className="font-display text-lg font-bold uppercase mb-1">{item.title}</h4>
                      <p className="font-ui text-sm text-graphite">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-foreground mt-8 p-4 bg-foreground/5 border-l-2 border-foreground">
                FitVault-AI generates revenue from genuine economic activity, not from venture subsidies or token issuance.
              </p>
            </motion.div>

            <motion.div {...fadeIn}>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
                // 06. ROADMAP
              </p>
              <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-8 text-4xl">
                EXECUTION PATH.
              </h2>
              
              <div className="space-y-6">
                {[
                  { phase: "PHASE 1: FOUNDATION", status: "CURRENT", desc: "Testnet Launch (Polygon), Aave Yield Integration, OpenClaw Health Audit Skill v1." },
                  { phase: "PHASE 2: MAINNET", status: "UPCOMING", desc: "Solo Vault Launch, Public Audit Dashboard, AaaS Subscriptions." },
                  { phase: "PHASE 3: COMMUNITY", status: "PLANNED", desc: "Group Challenges, Leaderboard Reward Pools." },
                  { phase: "PHASE 4: INSTITUTIONAL", status: "FUTURE", desc: "XAU₮ Success Vaults, HSM Key Management, White-Label Deployments." }
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-foreground/20 bg-background/5 relative">
                    {i === 0 && <div className="absolute top-0 right-0 p-1 px-3 bg-infrared text-background font-mono text-[9px] font-bold uppercase">{item.status}</div>}
                    <h4 className="font-display text-xl font-bold uppercase mb-2 text-foreground pr-20">{item.phase}</h4>
                    <p className="font-ui text-sm text-graphite">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-32 border-t border-foreground text-center bg-infrared text-background selection:bg-background selection:text-infrared">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn}>
            <h2 className="font-display font-bold uppercase leading-[0.9] tracking-tight mb-8" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
              READY TO COMMIT?
            </h2>
            <div className="flex justify-center gap-6 mt-10">
              <DeployButton label="INITIALIZE VAULT ->" to="/create-vault" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-foreground py-6 px-6 bg-vantablack text-background">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite text-center md:text-left">
            © 2026 FITVAULT-AI // PITCH DECK // CONFIDENTIAL & PROPRIETARY
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite text-center md:text-right">
            TETHER WDK // OPENCLAW // AAVE V3 // PARASWAP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PitchDeck;
