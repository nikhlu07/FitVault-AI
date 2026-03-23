import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, ArrowRight, Activity, Globe } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent text-gray-100 font-sans overflow-hidden">
      
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain invert hue-rotate-180 contrast-125 saturate-150 mix-blend-screen drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-tether-500 to-yellow-400">
            FitVault-AI
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#features" className="text-sm font-medium hover:text-tether-500 transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium hover:text-tether-500 transition-colors">How it works</a>
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-full bg-tether-600 hover:bg-tether-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] text-white text-sm font-medium transition-all duration-300">
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-tether-500/30 text-tether-500 text-sm font-medium mb-8">
            <Globe className="w-4 h-4" /> DoraHacks Galactica: WDK Edition
          </motion.div>
          
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            The Autonomous <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tether-500 via-orange-400 to-yellow-400 drop-shadow-[0_0_30px_rgba(249,115,22,0.2)]">
              Health Treasurer
            </span>
          </motion.h1>
          
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Stake USD₮ against your own discipline. Powered by the <b>Tether WDK</b> & <b>OpenClaw Agentic Infrastructure</b>. Let your AI act as your fiduciary.
          </motion.p>
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center gap-6">
             <button onClick={() => navigate('/dashboard')} className="px-8 py-4 rounded-full bg-gradient-to-r from-tether-600 to-tether-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] text-white font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-tether-500">
               Enter FitVault <ArrowRight className="w-5 h-5"/>
             </button>
          </motion.div>
        </div>
      </main>

      {/* Features Outline */}
      <section className="border-t border-gray-800/50 relative z-10 bg-black/40 backdrop-blur-3xl py-24" id="features">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 text-tether-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                 <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Self-Custodial</h3>
              <p className="text-gray-400 leading-relaxed">Powered by Tether WDK. You own your keys. Your automated health fiduciary runs securely without intermediaries.</p>
           </div>
           
           <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 text-tether-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                 <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Agentic Autonomy</h3>
              <p className="text-gray-400 leading-relaxed">The OpenClaw reasoning framework enforces "Proof of Sweat" and executes financial decisions automatically.</p>
           </div>
           
           <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6 text-tether-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                 <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">DeFi Yield Sharing</h3>
              <p className="text-gray-400 leading-relaxed">Healthy? Your USD₮ is automatically supplied to Aave V3 to generate risk-free yield. Missed a day? Prepare to be slashed.</p>
           </div>
        </div>
      </section>
      
    </div>
  );
}
