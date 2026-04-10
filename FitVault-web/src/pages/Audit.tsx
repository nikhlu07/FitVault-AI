import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import DeployButton from "@/components/DeployButton";

const MOCK_AUDITS = [
  { id: "0x8F9B...4A21", state: "SUCCESS", principal: "2,500.00", yieldAmount: "+8.64", hash: "0xAB12...9F3C", fee: null, duration: 30, metric: "STEPS", wallet: "0x7a...3F2B", date: "2026-04-08" },
  { id: "0x3C7D...1B09", state: "FORFEIT", principal: "1,000.00", yieldAmount: "-1,000.00", hash: "0xDE45...7A2B", fee: { protocol: "50.00", community: "950.00" }, duration: 14, metric: "ACTIVE MIN", wallet: "0xB2...9A1C", date: "2026-04-07" },
  { id: "0x12EF...8D44", state: "SUCCESS", principal: "5,000.00", yieldAmount: "+17.26", hash: "0x7890...CD56", fee: null, duration: 30, metric: "STEPS", wallet: "0x4E...D7F0", date: "2026-04-06" },
  { id: "0xA1B2...C3D4", state: "SUCCESS", principal: "750.00", yieldAmount: "+2.59", hash: "0xEF01...2345", fee: null, duration: 7, metric: "HR ZONE", wallet: "0x1F...8B3E", date: "2026-04-05" },
  { id: "0x5678...9ABC", state: "FORFEIT", principal: "3,000.00", yieldAmount: "-3,000.00", hash: "0x1234...ABCD", fee: { protocol: "150.00", community: "2,850.00" }, duration: 30, metric: "STEPS", wallet: "0xC8...2D4A", date: "2026-04-04" },
  { id: "0xDEF0...1234", state: "SUCCESS", principal: "10,000.00", yieldAmount: "+34.52", hash: "0x5678...EF90", fee: null, duration: 90, metric: "STEPS", wallet: "0x9D...6E5F", date: "2026-04-03" },
  { id: "0x9A8B...7C6D", state: "FORFEIT", principal: "500.00", yieldAmount: "-500.00", hash: "0xABCD...1234", fee: { protocol: "25.00", community: "475.00" }, duration: 7, metric: "ACTIVE MIN", wallet: "0x3A...7C8D", date: "2026-04-02" },
  { id: "0x4E5F...6A7B", state: "SUCCESS", principal: "1,500.00", yieldAmount: "+5.18", hash: "0xEFAB...5678", fee: null, duration: 14, metric: "HR ZONE", wallet: "0xF1...4A9B", date: "2026-04-01" },
  { id: "0xBC23...DE45", state: "SUCCESS", principal: "4,200.00", yieldAmount: "+14.50", hash: "0x2345...6789", fee: null, duration: 30, metric: "STEPS", wallet: "0x6B...1E2F", date: "2026-03-31" },
  { id: "0x6789...ABCD", state: "FORFEIT", principal: "2,000.00", yieldAmount: "-2,000.00", hash: "0x8901...CDEF", fee: { protocol: "100.00", community: "1,900.00" }, duration: 30, metric: "STEPS", wallet: "0xD4...5F6G", date: "2026-03-30" },
  { id: "0xEF01...2345", state: "SUCCESS", principal: "8,000.00", yieldAmount: "+27.62", hash: "0xABCD...EF01", fee: null, duration: 30, metric: "ACTIVE MIN", wallet: "0x2C...8D9E", date: "2026-03-29" },
  { id: "0x3456...7890", state: "SUCCESS", principal: "600.00", yieldAmount: "+2.07", hash: "0xCDEF...0123", fee: null, duration: 14, metric: "STEPS", wallet: "0xA7...3B4C", date: "2026-03-28" },
];

const Audit = () => {
  const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "FORFEIT">("ALL");

  const filtered = filter === "ALL" ? MOCK_AUDITS : MOCK_AUDITS.filter((r) => r.state === filter);

  const totalPrincipal = MOCK_AUDITS.reduce((s, r) => s + parseFloat(r.principal.replace(",", "")), 0);
  const totalSuccess = MOCK_AUDITS.filter((r) => r.state === "SUCCESS").length;
  const totalForfeit = MOCK_AUDITS.filter((r) => r.state === "FORFEIT").length;
  const totalYield = MOCK_AUDITS.filter((r) => r.state === "SUCCESS").reduce((s, r) => s + parseFloat(r.yieldAmount), 0);
  const totalForfeited = MOCK_AUDITS.filter((r) => r.state === "FORFEIT").reduce((s, r) => s + Math.abs(parseFloat(r.yieldAmount.replace(",", ""))), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        {/* ═══════════ HERO ═══════════ */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-4">
              // TRANSPARENT LEDGER
            </p>
            <h1
              className="font-display font-bold uppercase leading-[0.9] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
            >
              PUBLIC
              <br />
              <span className="text-infrared">AUDIT.</span>
            </h1>
            <p className="font-ui text-sm text-graphite leading-relaxed mt-4 max-w-md">
              Every vault outcome is permanently recorded on-chain. Success and failure
              are equally transparent. The protocol hides nothing.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 flex items-end">
            <div className="w-full border border-foreground">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { label: "TOTAL VAULTS", value: MOCK_AUDITS.length.toString() },
                  { label: "SUCCESS", value: totalSuccess.toString(), color: "text-success-gold" },
                  { label: "FORFEIT", value: totalForfeit.toString(), color: "text-penalty-crimson" },
                  { label: "SUCCESS RATE", value: `${((totalSuccess / MOCK_AUDITS.length) * 100).toFixed(1)}%` },
                ].map((s, i) => (
                  <div key={s.label} className={`p-4 ${i < 3 ? "border-r border-foreground" : ""}`}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-1">{s.label}</p>
                    <p className={`font-display text-2xl md:text-3xl font-bold ${s.color || ""}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ AGGREGATE METRICS ═══════════ */}
        <div className="border-y border-foreground mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: "TOTAL PRINCIPAL STAKED", value: `$${totalPrincipal.toLocaleString()}`, unit: "USD₮" },
              { label: "YIELD DISTRIBUTED", value: `+$${totalYield.toFixed(2)}`, unit: "TO COMPLETERS", color: "text-aave-purple" },
              { label: "TOTAL FORFEITED", value: `$${totalForfeited.toLocaleString()}`, unit: "REDISTRIBUTED", color: "text-penalty-crimson" },
              { label: "COMMUNITY POOL", value: `$${(totalForfeited * 0.95).toFixed(0)}`, unit: "AVAILABLE", color: "text-success-gold" },
            ].map((m, i) => (
              <div key={m.label} className={`py-5 px-4 ${i < 3 ? "border-r border-foreground" : ""}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite mb-1">{m.label}</p>
                <p className={`font-display text-xl md:text-2xl font-bold ${m.color || ""}`}>{m.value}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite mt-0.5">{m.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ FILTER BAR ═══════════ */}
        <div className="flex items-center gap-0 mb-6 border border-foreground w-fit">
          {(["ALL", "SUCCESS", "FORFEIT"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] border-r border-foreground last:border-r-0 transition-colors ${
                filter === f ? "bg-infrared text-foreground font-semibold" : "hover:bg-optical-ash"
              }`}
            >
              {f} {f === "ALL" ? `(${MOCK_AUDITS.length})` : f === "SUCCESS" ? `(${totalSuccess})` : `(${totalForfeit})`}
            </button>
          ))}
        </div>

        {/* ═══════════ TABLE ═══════════ */}
        <div className="border border-foreground overflow-x-auto mb-16">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-foreground bg-optical-ash min-w-[900px]">
            {["VAULT ID", "DATE", "STATE", "METRIC", "PRINCIPAL", "YIELD / FORFEIT", "ROUTING", "ORACLE HASH"].map((col) => (
              <div key={col} className="p-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">{col}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((row, i) => {
            const isSuccess = row.state === "SUCCESS";
            return (
              <div
                key={i}
                className={`grid grid-cols-8 border-b border-foreground/10 min-w-[900px] ${
                  isSuccess ? "border-l-2 border-l-success-gold" : "border-l-2 border-l-penalty-crimson"
                } hover:bg-optical-ash/50 transition-colors`}
              >
                <div className="p-3">
                  <span className="font-mono text-[11px]">{row.id}</span>
                </div>
                <div className="p-3">
                  <span className="font-mono text-[11px] text-graphite">{row.date}</span>
                </div>
                <div className="p-3">
                  <span className={`font-mono text-[11px] uppercase font-semibold ${isSuccess ? "text-success-gold" : "text-penalty-crimson"}`}>
                    {row.state}
                  </span>
                </div>
                <div className="p-3">
                  <span className="font-mono text-[10px] text-graphite">{row.metric} / {row.duration}D</span>
                </div>
                <div className="p-3">
                  <span className="font-mono text-[11px]">{row.principal} USD₮</span>
                </div>
                <div className="p-3">
                  <span className={`font-mono text-[11px] ${isSuccess ? "text-aave-purple" : "text-penalty-crimson"}`}>
                    {row.yieldAmount} USD₮
                  </span>
                  {row.fee && (
                    <span className="block font-mono text-[8px] text-graphite mt-0.5">
                      5%→PROTOCOL ({row.fee.protocol}) // 95%→POOL ({row.fee.community})
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <span className="font-mono text-[9px] text-graphite">
                    {isSuccess ? "YIELD → WALLET" : "FORFEIT → POOL"}
                  </span>
                </div>
                <div className="p-3">
                  <span className="font-mono text-[11px] text-graphite">{row.hash}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════ FORFEIT DISTRIBUTION BREAKDOWN ═══════════ */}
        <section className="mb-16">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-3">
                // FORFEIT REDISTRIBUTION
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase leading-[0.9]">
                WHERE FORFEITED
                <br />
                <span className="text-penalty-crimson">CAPITAL</span>
                <br />
                GOES.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="border border-foreground">
                {/* Visual bar */}
                <div className="h-12 flex">
                  <div className="bg-infrared h-full flex items-center justify-center" style={{ width: "95%" }}>
                    <span className="font-mono text-[10px] uppercase font-semibold text-background">
                      95% — COMMUNITY REWARD POOL
                    </span>
                  </div>
                  <div className="bg-graphite h-full flex items-center justify-center" style={{ width: "5%" }}>
                    <span className="font-mono text-[8px] uppercase text-background">5%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-t border-foreground">
                  <div className="p-5 border-r border-foreground">
                    <p className="font-mono text-[9px] text-graphite uppercase mb-2">TOTAL FORFEITED</p>
                    <p className="font-display text-2xl font-bold text-penalty-crimson">
                      ${totalForfeited.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-5 border-r border-foreground">
                    <p className="font-mono text-[9px] text-graphite uppercase mb-2">→ COMMUNITY</p>
                    <p className="font-display text-2xl font-bold text-success-gold">
                      ${(totalForfeited * 0.95).toFixed(0)}
                    </p>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[9px] text-graphite uppercase mb-2">→ PROTOCOL</p>
                    <p className="font-display text-2xl font-bold text-graphite">
                      ${(totalForfeited * 0.05).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ RECENT ORACLE VERIFICATIONS ═══════════ */}
        <section className="bg-foreground text-background p-6 md:p-10 mb-16">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-infrared mb-6">
            // RECENT ORACLE ATTESTATIONS
          </p>
          <div className="space-y-0 border-t border-graphite/30">
            {MOCK_AUDITS.slice(0, 6).map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-2 py-3 border-b border-graphite/20">
                <div className="col-span-2">
                  <span className="font-mono text-[10px] text-graphite">{row.date}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-[10px] font-semibold">{row.id}</span>
                </div>
                <div className="col-span-2">
                  <span className={`font-mono text-[10px] uppercase font-semibold ${row.state === "SUCCESS" ? "text-success-gold" : "text-penalty-crimson"}`}>
                    {row.state}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="font-mono text-[10px] text-graphite">
                    ATTESTATION BROADCAST // {row.metric}
                  </span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="font-mono text-[10px] text-graphite">{row.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="text-center py-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase mb-4">
            JOIN THE PROTOCOL.
          </h2>
          <p className="font-ui text-sm text-graphite mb-8 max-w-md mx-auto">
            Deploy your own vault. Your success funds your future.
            Your failure funds the community.
          </p>
          <DeployButton label="INITIALIZE VAULT ->" to="/create-vault" />
        </section>
      </main>

      <footer className="border-t border-foreground py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-graphite">
            © 2026 FITVAULT-AI // ALL RECORDS ARE IMMUTABLE // ON-CHAIN VERIFIED
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite">
            <Link to="/" className="hover:text-foreground transition-colors">HOME</Link>
            {" // "}
            <Link to="/dashboard" className="hover:text-foreground transition-colors">DASHBOARD</Link>
            {" // "}
            <Link to="/create-vault" className="hover:text-foreground transition-colors">DEPLOY</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Audit;
