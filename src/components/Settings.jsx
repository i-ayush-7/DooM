import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Settings as SettingsIcon, ShieldIcon, Link, Globe, Save } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export function Settings({ settings, setSettings }) {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <motion.header 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight">Platform Settings</h1>
        <p className="text-zinc-500 mt-2 text-lg">Configure global constraints and API integrations.</p>
      </motion.header>

      <div className="space-y-6">
        <GlassCard delay={0.1}>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <Lock className="w-5 h-5 text-violet-400"/> Global Security Rules
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-black/20 cursor-pointer hover:bg-black/40 hover:border-white/10 transition-all group">
              <div className="flex-1 pr-4">
                <div className="text-white font-semibold group-hover:text-violet-300 transition-colors">Auto-Revoke on Budget Breach</div>
                <div className="text-sm text-zinc-500 mt-1">Permanently sever token access if an agent attempts to spend over its limit.</div>
              </div>
              <div 
                onClick={() => setSettings({...settings, autoRevoke: !settings.autoRevoke})}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.autoRevoke ? 'bg-violet-600' : 'bg-zinc-800'}`}
              >
                <motion.div 
                  animate={{ x: settings.autoRevoke ? 24 : 4 }}
                  className="absolute top-1 bg-white w-4 h-4 rounded-full shadow-lg"
                />
              </div>
            </label>

            <label className="flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-black/20 cursor-pointer hover:bg-black/40 hover:border-white/10 transition-all group">
              <div className="flex-1 pr-4">
                <div className="text-white font-semibold group-hover:text-violet-300 transition-colors">Zero-Trust Scope Validation</div>
                <div className="text-sm text-zinc-500 mt-1">Stricter reinforcement of network boundaries for all active leases.</div>
              </div>
              <div className="w-12 h-6 bg-violet-600 rounded-full relative">
                 <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-lg"></div>
              </div>
            </label>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <Globe className="w-5 h-5 text-violet-400"/> External Integrations
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">OpenAI Master Key Proxy</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-violet-500 transition-colors" size={16} />
                <input 
                  type="password" 
                  value="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx" 
                  readOnly 
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl p-4 pl-12 text-zinc-600 font-mono text-sm outline-none focus:border-violet-500 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Webhook Alert URL</label>
              <div className="relative group">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-violet-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="https://api. okra-vault.com/v1/alerts" 
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl p-4 pl-12 text-white font-mono text-sm outline-none focus:border-violet-500 transition-all" 
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zinc-100 text-black font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2"
            >
              <Save size={14} /> Update Integrations
            </motion.button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
