import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Fingerprint, Activity, CheckCircle2, XCircle, AlertTriangle 
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export function GatewaySimulator({ tokens, logs, simulateAgentAction }) {
  const [simTokenId, setSimTokenId] = useState('');
  const [simAction, setSimAction] = useState('read_email');
  const [simCost, setSimCost] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleDispatch = () => {
    setIsSimulating(true);
    simulateAgentAction(simTokenId, simAction, simCost);
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col min-h-0">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white tracking-tight">Audit & Simulation</h1>
        <p className="text-zinc-500 mt-2 text-lg">Test your agent constraints against the live OKRA Gateway.</p>
      </motion.header>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 overflow-hidden pb-4">
        {/* PAYLOAD INJECTOR */}
        <GlassCard delay={0.1} className="lg:w-1/3 flex flex-col relative" hover={false}>
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] pointer-events-none">
            <Cpu size={256} className="text-violet-500" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2 relative z-10">
            <Terminal size={20} className="text-violet-400" /> Payload Injector
          </h2>
          <p className="text-sm text-zinc-500 mb-8 relative z-10">Simulate autonomous agent requests to verify zero-trust boundaries.</p>
          
          <div className="space-y-6 relative z-10 flex-1 overflow-y-auto pr-1">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Inject Token Bearer</label>
              <select 
                className="w-full bg-black/40 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
                value={simTokenId} 
                onChange={(e) => setSimTokenId(e.target.value)}
              >
                <option value="">-- Select Identity --</option>
                {tokens.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                <option value="ok_fake123">Malicious / Forged Token</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Target Network Action</label>
              <select 
                className="w-full bg-black/40 border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:border-violet-500 outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
                value={simAction} 
                onChange={(e) => setSimAction(e.target.value)}
              >
                <option value="read_email">Read Communication Graph</option>
                <option value="send_email">Execute Outbound Email</option>
                <option value="book_travel">Interface w/ Travel API</option>
                <option value="deploy_server">Provision Cloud Compute</option>
                <option value="transfer_funds">Execute Wire Transfer</option>
              </select>
            </div>

            <AnimatePresence>
              {['book_travel', 'deploy_server', 'transfer_funds'].includes(simAction) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Financial Payload ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">$</span>
                    <input 
                      type="number" 
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl p-3.5 pl-8 text-sm text-white focus:border-violet-500 outline-none transition-all font-mono"
                      value={simCost} 
                      onChange={(e) => setSimCost(e.target.value)} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSimulating}
            onClick={handleDispatch} 
            className={`w-full mt-8 bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.2)] flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSimulating ? (
              <Activity className="w-5 h-5 animate-spin" />
            ) : (
              <Fingerprint className="w-5 h-5" />
            )}
            {isSimulating ? 'Processing...' : 'Dispatch Payload'}
          </motion.button>
        </GlassCard>

        {/* LIVE GATEWAY STREAM */}
        <div className="flex-1 bg-black/80 rounded-2xl border border-zinc-800/80 flex flex-col font-mono text-sm shadow-2xl overflow-hidden relative group">
          <div className="bg-zinc-900/50 border-b border-zinc-800/80 p-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Live Gateway Stream</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] text-zinc-500 border border-zinc-800 px-2.5 py-1 rounded bg-black/40">v2.4.0-RELAY</span>
              <span className="text-[10px] text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded bg-violet-500/5">wss://okra.io/firewall</span>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-4 flex flex-col-reverse custom-scrollbar">
            <AnimatePresence initial={false}>
              {logs.length === 0 ? (
                <div className="text-zinc-800 text-center py-20 uppercase tracking-tighter italic">Awaiting network traffic...</div>
              ) : [...logs].map((log, idx) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-l border-zinc-800/50 pl-6 py-2 relative"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-800 transform -translate-x-1/2" />
                  <div className="flex justify-between items-center text-[10px] mb-2 font-black tracking-widest">
                    <span className="text-zinc-600">[{log.timestamp}]</span>
                    <div className="flex items-center gap-2">
                      {log.status === 'success' && (
                        <span className="text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                          <CheckCircle2 size={10} /> AUTHORIZED
                        </span>
                      )}
                      {log.status === 'error' && (
                        <span className="text-rose-500 bg-rose-500/5 border border-rose-500/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                          <XCircle size={10} /> REJECTED
                        </span>
                      )}
                      {log.status === 'warning' && (
                        <span className="text-amber-500 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                          <AlertTriangle size={10} /> DENIED
                        </span>
                      )}
                      {log.status === 'info' && (
                        <span className="text-violet-400 bg-violet-400/5 border border-violet-400/20 px-2 py-0.5 rounded">
                          SYSTEM
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-zinc-400 text-sm leading-relaxed">
                    <span className="text-white font-bold">{log.action}</span>
                    <span className="mx-3 opacity-20 text-zinc-500">{'>>'}</span>
                    <span className={log.status === 'error' ? 'text-rose-400/80' : ''}>{log.message}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="scanline" />
        </div>
      </div>
    </div>
  );
}
