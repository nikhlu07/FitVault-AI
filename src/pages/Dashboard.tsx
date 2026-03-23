import React, { useState } from 'react';
import { Shield, Activity, TrendingUp, DollarSign, Cpu, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [steps, setSteps] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [stake, setStake] = useState(0);
  const [agentLogs, setAgentLogs] = useState<{msg: string, type: 'info' | 'success' | 'err'}[]>([]);

  const addLog = (msg: string, type: 'info' | 'success' | 'err' = 'info') => {
    setAgentLogs(prev => [...prev, {msg, type}]);
  };

  const connectWallet = () => {
    addLog('WDK Wallet Connected: 0x9858...eda94', 'success');
    setIsConnected(true);
    setStake(100);
    addLog('Locked 100 USDT into FitVault Smart Contract', 'info');
  };

  const syncData = () => {
    addLog('OpenClaw Brain: Scraping Apple Health / Strava Oracle', 'info');
    setTimeout(() => {
      const recordedSteps = Math.floor(Math.random() * 5000 + 6000);
      setSteps(recordedSteps);
      addLog(`OpenClaw Brain: Validated ${recordedSteps} steps.`, 'success');
      
      if (recordedSteps >= 10000) {
        setTimeout(() => {
           addLog('Goal MET! WDK Hands: Supplying AAVE V3 100 USDT for yield generation 🚀', 'success');
           setStake(prev => prev + 0.15); 
        }, 1500);
      } else {
        setTimeout(() => {
           addLog('Goal MISSED! Forfeit Protocol Initiated. Slashing 5% to Treasury...', 'err');
           setStake(prev => prev - 5);
        }, 1500);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen text-gray-100 p-8 font-sans">
      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="FitVault-AI" className="w-14 h-14 object-contain invert hue-rotate-180 contrast-125 saturate-150 mix-blend-screen drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-tether-500 to-yellow-400">
            FitVault-AI
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/history" className="text-gray-400 hover:text-white transition-colors text-sm font-medium hidden sm:block">History Log</Link>
          <button 
            onClick={connectWallet}
            disabled={isConnected}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${isConnected ? 'bg-gray-800 border-gray-600 border text-gray-400' : 'bg-tether-600 hover:bg-tether-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] text-white'}`}
          >
            {isConnected ? 'WDK Wallet Connected' : 'Connect WDK Wallet'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass rounded-2xl p-6 border border-gray-800/50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <DollarSign className="w-24 h-24" />
               </div>
               <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider relative z-10">Vault Stake (USD₮)</h3>
               <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-tether-500 relative z-10">
                 ${stake.toFixed(2)}
               </div>
               <div className="mt-4 flex items-center text-sm text-gray-400">
                 <TrendingUp className="w-4 h-4 mr-1 text-green-400" /> +4.2% APY (Aave)
               </div>
            </motion.div>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-gray-800/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Activity className="w-24 h-24" />
               </div>
               <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider relative z-10">Today's Steps</h3>
               <div className="text-5xl font-bold text-white relative z-10">
                 {steps.toLocaleString()} <span className="text-xl text-gray-500 font-normal">/ 10k</span>
               </div>
               <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                 <div className="bg-tether-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((steps/10000)*100, 100)}%` }}></div>
               </div>
            </motion.div>
          </div>

          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 border border-gray-800/50">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold flex items-center gap-2"><Activity className="text-tether-500" /> Health Oracle Validation</h2>
               <button onClick={syncData} disabled={!isConnected} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors border border-gray-700">
                 Force Oracle Sync
               </button>
             </div>
             
             <div className="bg-black/40 rounded-xl p-6 font-mono text-sm text-gray-300">
                <div className="flex items-center gap-3 mb-4 text-tether-500 font-bold border-b border-gray-800 pb-3">
                  <Cpu className="w-5 h-5"/> OpenClaw Autonomous Logic
                </div>
                {agentLogs.length === 0 ? (
                  <div className="text-gray-600 italic">Waiting for connection or oracle sync...</div>
                ) : (
                  <div className="space-y-3 h-48 overflow-y-auto">
                    {agentLogs.map((log, i) => (
                      <div key={i} className={`flex items-start gap-2 ${log.type === 'success' ? 'text-green-400' : log.type === 'err' ? 'text-red-400' : 'text-gray-300'}`}>
                        <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                        <span>{'> '}{log.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </motion.div>
        </div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-gray-800/50">
            <h3 className="font-bold text-lg mb-4 text-white flex gap-2 items-center">
              <Shield className="w-5 h-5 text-tether-500"/> Agent Protocol
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-green-500"/></div>
                <p>Non-custodial USD₮ locked with <b>Tether WDK</b>.</p>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-green-500"/></div>
                <p>Logic layer powered by <b>OpenClaw</b> (Autonomous Health Auditor).</p>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-green-500"/></div>
                <p>Yield generation via autonomous <b>Aave V3</b> deployments.</p>
              </li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 border border-gray-800/50 bg-gradient-to-b from-transparent to-red-900/10">
            <h3 className="font-bold text-lg mb-2 text-red-400 flex gap-2 items-center">
              <XCircle className="w-5 h-5"/> Forfeit Risk
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed text-balance">
              If your OpenClaw agent detects you failed your 10,000 steps goal, it will autonomously trigger the forfeit protocol and slash your active USD₮ stake.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
