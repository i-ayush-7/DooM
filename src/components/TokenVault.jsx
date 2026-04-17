import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, Check, Key } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export function TokenVault({ tokens, revokeToken, setIsCreatingModalOpen, copyToClipboard, copiedId }) {
  const maskToken = (id) => `${id.substring(0, 5)}••••••••${id.substring(id.length - 4)}`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto min-h-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">Identity Vault</h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage cryptographic leases for your AI agents.</p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreatingModalOpen(true)} 
          className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
          Mint OKRA Token
        </motion.button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
        <AnimatePresence mode="popLayout">
          {tokens.map((token, index) => (
            <GlassCard 
              key={token.id} 
              delay={index * 0.05}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
              className={token.status !== 'active' ? 'opacity-50 grayscale scale-[0.98] border-rose-900/20' : ''}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-xl truncate pr-4">{token.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="text-[10px] text-violet-400 font-mono bg-violet-400/10 px-2 py-1 rounded-md border border-violet-400/20 uppercase tracking-tighter">
                      {maskToken(token.id)}
                    </code>
                    {token.status === 'active' && (
                      <button 
                        onClick={() => copyToClipboard(token.id)} 
                        className="text-zinc-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                      >
                        {copiedId === token.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
                
                {token.status === 'active' && (
                  <button 
                    onClick={() => revokeToken(token.id)} 
                    className="text-zinc-600 hover:text-rose-400 hover:bg-rose-400/10 p-2.5 rounded-xl transition-all border border-transparent hover:border-rose-400/20"
                    title="Sever Access"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                {token.status === 'revoked' && (
                  <span className="text-[10px] uppercase tracking-widest font-black bg-rose-900/20 text-rose-500 px-3 py-1.5 rounded-full border border-rose-500/30">
                    Severed
                  </span>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-widest">
                    <span className="text-zinc-500">Liquidity Pool</span>
                    <span className={token.spent >= token.budget ? 'text-rose-400' : 'text-zinc-300'}>
                      ${token.spent.toLocaleString()} / ${token.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-950/50 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((token.spent / token.budget) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full transition-colors ${
                        token.spent >= token.budget 
                          ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                          : 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                      }`} 
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black block mb-3">Immutable Scopes</span>
                  <div className="flex flex-wrap gap-2">
                    {token.scopes.length > 0 ? token.scopes.map(scope => (
                      <span 
                        key={scope} 
                        className="text-[10px] font-mono bg-white/5 text-zinc-400 px-2.5 py-1 rounded-md border border-white/5 hover:border-violet-500/30 hover:text-violet-300 transition-colors"
                      >
                        {scope}
                      </span>
                    )) : (
                      <span className="text-xs text-zinc-700 italic">No network scopes assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                 <div className="flex items-center gap-2 text-[10px] font-mono">
                    <Key size={10} className="text-zinc-500" />
                    <span>MINTED {new Date(token.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
            </GlassCard>
          ))}
        </AnimatePresence>
        
        {tokens.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-32 text-center"
          >
            <div className="inline-flex flex-col items-center">
              <div className="p-6 rounded-full bg-zinc-900/50 border border-zinc-800 mb-6">
                <Key className="w-12 h-12 text-zinc-700" />
              </div>
              <h3 className="text-xl font-bold text-zinc-500">Vault is empty</h3>
              <p className="text-zinc-600 mt-2 max-w-sm">No agent identities found. Mint your first cryptographic lease to begin.</p>
              <button 
                onClick={() => setIsCreatingModalOpen(true)}
                className="mt-8 text-white hover:text-violet-400 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus size={18} /> Mint First Identity
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
