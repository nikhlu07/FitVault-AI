import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useUsdtBalance } from "@/hooks/useVault";
import { formatUnits } from "viem";

const WalletButton = () => {
  const { isConnected } = useAccount();
  const { data: balance } = useUsdtBalance();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="font-mono text-[10px] uppercase tracking-[0.15em] border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                CONNECT WALLET
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                className="font-mono text-[10px] uppercase tracking-[0.15em] border border-penalty-crimson text-penalty-crimson px-4 py-2 hover:bg-penalty-crimson hover:text-background transition-colors"
              >
                WRONG NETWORK
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {isConnected && balance !== undefined && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite hidden md:block">
                    {parseFloat(formatUnits(balance as bigint, 6)).toFixed(2)} USD₮
                  </span>
                )}
                <button
                  onClick={openAccountModal}
                  className="font-mono text-[10px] uppercase tracking-[0.15em] border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-infrared rounded-full inline-block" />
                  {account.displayName}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletButton;
