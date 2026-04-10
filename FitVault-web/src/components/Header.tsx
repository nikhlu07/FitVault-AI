import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full border-b border-foreground/10 bg-vantablack text-background sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between py-2 px-6 md:py-3">
        <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.1em] text-background font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="inline-block w-2 h-2 bg-infrared animate-pulse" />
          FITVAULT-AI // 0xPROTO
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/create-vault" className="font-mono text-[10px] uppercase tracking-[0.1em] text-graphite hover:text-white transition-colors">
            Deploy
          </Link>
          <Link to="/dashboard" className="font-mono text-[10px] uppercase tracking-[0.1em] text-graphite hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/audit" className="font-mono text-[10px] uppercase tracking-[0.1em] text-graphite hover:text-white transition-colors">
            Audit
          </Link>
        </nav>
        <div className="border border-white/20 px-3 py-1 backdrop-blur-sm bg-white/5" style={{ borderRadius: '999px' }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/90 font-medium">
            [AGENT: AUTONOMOUS]
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
