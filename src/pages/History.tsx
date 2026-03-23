import React from 'react';
import { Shield, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const transactionHistory = [
  { id: 1, type: 'yield', amount: '+0.15 USD₮', date: 'Today, 05:00 PM', desc: 'AAVE V3 Automated Yield (Goal Met)' },
  { id: 2, type: 'slash', amount: '-5.00 USD₮', date: 'Yesterday, 05:30 PM', desc: 'OpenClaw Forfeit Execution (6,400/10k steps)' },
  { id: 3, type: 'yield', amount: '+0.15 USD₮', date: 'Mar 21, 05:15 PM', desc: 'AAVE V3 Automated Yield (Goal Met)' },
  { id: 4, type: 'stake', amount: '+100.00 USD₮', date: 'Mar 20, 10:00 AM', desc: 'Initial FitVault Deposit via WDK' },
];

export default function History() {
  return (
    <div className="min-h-screen text-gray-100 p-8 font-sans">
      <header className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="FitVault-AI" className="w-14 h-14 object-contain invert hue-rotate-180 contrast-125 saturate-150 mix-blend-screen drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-tether-500 to-yellow-400">
            FitVault-AI
          </h1>
        </Link>
        <Link to="/dashboard" className="px-5 py-2.5 rounded-full border border-gray-600 hover:bg-gray-800 transition-all font-medium text-sm">
          Return to Vault
        </Link>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="mb-8 pl-2">
            <h2 className="text-3xl font-bold mb-2">Immutable Agent Logging</h2>
            <p className="text-gray-400">Every autonomous action executed by your WDK wallet is permanently recorded.</p>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass rounded-2xl p-6 md:p-10 border border-gray-800/50">
          <div className="space-y-6">
            {transactionHistory.map((tx) => (
              <div key={tx.id} className="flex items-start md:items-center justify-between p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors border border-transparent hover:border-gray-800/50">
                <div className="flex items-start md:items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                     tx.type === 'yield' ? 'bg-green-900/40 text-green-400' :
                     tx.type === 'slash' ? 'bg-red-900/40 text-red-400' :
                     'bg-blue-900/40 text-blue-400'
                  }`}>
                    {tx.type === 'slash' ? <ArrowDownRight /> : <ArrowUpRight />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{tx.desc}</h4>
                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" /> {tx.date}
                    </p>
                  </div>
                </div>
                <div className={`font-black text-xl whitespace-nowrap pl-4 ${
                    tx.type === 'slash' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
