interface VaultCardProps {
  sweatGoal: string;
  oracleStatus: string;
  principal: string;
  apy: string;
  synced?: boolean;
}

const VaultCard = ({ sweatGoal, oracleStatus, principal, apy, synced = true }: VaultCardProps) => {
  return (
    <div className="relative border border-foreground crosshair-tl crosshair-br">
      <div className="grid grid-cols-2">
        {/* Top Left */}
        <div className="border-r border-b border-foreground p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-infrared mb-2">
            SWEAT GOAL
          </p>
          <p className="font-display text-lg uppercase tracking-tight font-bold">
            {sweatGoal}
          </p>
        </div>

        {/* Top Right */}
        <div className="border-b border-foreground p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite mb-2">
            ORACLE STATUS
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wide font-semibold">
              {oracleStatus}
            </span>
            {synced && (
              <span className="inline-block w-2.5 h-2.5 bg-infrared animate-oracle-flash" />
            )}
          </div>
        </div>

        {/* Bottom Left */}
        <div className="border-r border-foreground p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite mb-2">
            STAKED PRINCIPAL
          </p>
          <p className="font-display text-4xl font-bold uppercase">
            {principal}
          </p>
        </div>

        {/* Bottom Right */}
        <div className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite mb-2">
            CURRENT APY
          </p>
          <p className="font-mono text-2xl font-semibold text-aave-purple">
            {apy}
          </p>
        </div>
      </div>
      {/* Infrared bottom accent line */}
      <div className="h-[3px] bg-infrared w-full" />
    </div>
  );
};

export default VaultCard;
