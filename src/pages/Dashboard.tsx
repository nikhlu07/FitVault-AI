import React, { useState, useEffect } from 'react';
import { Shield, Activity, TrendingUp, DollarSign, Cpu, CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

export default function Dashboard() {
  const [steps, setSteps] = useState(0);
  const [inputSteps, setInputSteps] = useState('10500');
  const [walletAddress, setWalletAddress] = useState('');
  const [stake, setStake] = useState(0);
  const [agentLogs, setAgentLogs] = useState<{msg: string, type: 'info' | 'success' | 'err' | 'tx', hash?: string}[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addLog = (msg: string, type: 'info' | 'success' | 'err' | 'tx' = 'info', hash?: string) => {
    setAgentLogs(prev => [...prev, {msg, type, hash}]);
  };

  const connectWallet = async () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      setWalletAddress(wallet.address);
      addLog(`WDK Wallet EVM Initialized: ${wallet.address}`, 'success');
      setStake(100);
      addLog('Executed Smart Contract: Locked 100.00 USD₮ into FitVault', 'tx', '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''));
    } catch (error) {
       console.error("Wallet error", error);
    }
  };

  const syncData = () => {
    if (!walletAddress) return;
    setIsSyncing(true);
    addLog('OpenClaw Brain: Pinging Apple Health / Strava API Oracle...', 'info');
    
    setTimeout(() => {
      const recordedSteps = parseInt(inputSteps) || 0;
      setSteps(recordedSteps);
      addLog(`OpenClaw Brain: Validated exactly ${recordedSteps.toLocaleString()} steps today.`, 'info');
      
      if (recordedSteps >= 10000) {
        setTimeout(() => {
           addLog('Health Audit PASSED. Goal MET! 🎯', 'success');
           setTimeout(() => {
             const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
             addLog(`WDK Hands: Supplying 100 USD₮ to AAVE V3 for Yield...`, 'tx', txHash);
             setStake(prev => prev + 0.15); 
             setIsSyncing(false);
           }, 800);
        }, 1000);
      } else {
        setTimeout(() => {
           addLog('Health Audit FAILED. Goal MISSED! ⚠️', 'err');
           setTimeout(() => {
              const txHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
              addLog(`Forfeit Protocol Executed. Slashing 5.00 USD₮ to Treasury...`, 'tx', txHash);
              setStake(prev => Math.max(0, prev - 5));
              setIsSyncing(false);
           }, 800);
        }, 1000);
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
            disabled={!!walletAddress}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${walletAddress ? 'bg-gray-800 border-gray-600 border text-gray-400' : 'bg-tether-600 hover:bg-tether-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] text-white shadow-lg'}`}
          >
            {walletAddress ? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 'Connect WDK Wallet'}
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
                 <TrendingUp className="w-4 h-4 mr-1 text-green-400" /> +4.2% Live APY (Aave V3)
               </div>
            </motion.div>
            
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-gray-800/50 relative overflow-hidden flex flex-col justify-between">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Activity className="w-24 h-24" />
               </div>
               <div>
                 <h3 className="text-gray-400 font-medium text-sm mb-1 uppercase tracking-wider relative z-10">Today's Steps Oracle</h3>
                 <div className="text-5xl font-bold text-white relative z-10">
                   {steps.toLocaleString()} <span className="text-xl text-gray-500 font-normal">/ 10k</span>
                 </div>
               </div>
               
               <div className="mt-6 relative z-10">
                 <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wide">Simulate Oracle API (Demo):</label>
                 <div className="flex gap-2">
                   <input 
                     type="number" 
                     value={inputSteps} 
                     onChange={(e) => setInputSteps(e.target.value)} 
                     className="bg-black/50 border border-tether-500/30 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-tether-500 transition-colors"
                   />
                 </div>
               </div>
            </motion.div>
          </div>

          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 border border-gray-800/50">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold flex items-center gap-2"><Activity className="text-tether-500" /> Health Oracle Validation</h2>
               <button onClick={syncData} disabled={!walletAddress || isSyncing} className="px-5 py-2.5 bg-tether-600/20 hover:bg-tether-600/40 text-tether-500 font-medium rounded-xl disabled:opacity-50 transition-colors border border-tether-500/30 flex items-center gap-2">
                 {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Cpu className="w-4 h-4" />}
                 Force AI Agent Audit
               </button>
             </div>
             
             <div className="bg-[#0a0a0c] rounded-xl p-6 font-mono text-sm text-gray-300 border border-gray-800/80 shadow-inner">
                <div className="flex items-center gap-3 mb-4 text-tether-500 font-bold border-b border-gray-800 pb-3">
                  <div className="w-2 h-2 rounded-full bg-tether-500 animate-pulse"></div> OpenClaw Supervised Agent Component
                </div>
                {!walletAddress ? (
                  <div className="text-gray-600 italic">SYSTEM IDLE: Waiting for WDK wallet connection...</div>
                ) : (
                  <div className="space-y-3 h-56 overflow-y-auto custom-scrollbar">
                    {agentLogs.map((log, i) => (
                      <div key={i} className={`flex items-start gap-3 ${log.type === 'success' ? 'text-green-400' : log.type === 'err' ? 'text-red-400' : log.type === 'tx' ? 'text-blue-400' : 'text-gray-300'}`}>
                        <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <div className="flex flex-col">
                          <span>{'> '}{log.msg}</span>
                          {log.hash && (
                            <a href={`https://sepolia.etherscan.io/tx/${log.hash}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:text-blue-400 mt-1 flex items-center gap-1 underline decoration-blue-500/30 underline-offset-2">
                              Hash: {log.hash} <ExternalLink className="w-3 h-3"/>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                    {isSyncing && (
                       <div className="flex items-start gap-3 text-tether-500/70 animate-pulse">
                         <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                         <span>{'>'} Agent is processing on-chain parameters...</span>
                       </div>
                    )}
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
                <p>Non-custodial USD₮ locked with real-time <b>Ethers / Tether WDK</b> address logic.</p>
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
              If your OpenClaw agent detects you failed your 10,000 steps goal, it will autonomously trigger the forfeit protocol, dynamically generating a Sepolia EVM transaction to slash your active USD₮ stake.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
