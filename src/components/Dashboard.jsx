import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, ShieldAlert, TrendingUp, Wallet } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export function Dashboard({ tokens, logs }) {
  const activeTokens = tokens.filter(t => t.status === 'active');
  const totalExposure = activeTokens.reduce((acc, curr) => acc + curr.budget - curr.spent, 0);
  const threatsIntercepted = logs.filter(l => l.status === 'error' || l.status === 'warning').length;

  const stats = [
    {
      label: 'Active Agent Leases',
      value: activeTokens.length,
      icon: Users,
      color: 'text-violet-400',
      description: '+1 this week',
      trend: 'up'
    },
    {
      label: 'Total Capital Exposure',
      value: `$${totalExposure.toLocaleString()}`,
      icon: Wallet,
      color: 'text-emerald-400',
      description: 'Across active tokens',
      trend: null
    },
    {
      label: 'Threats Intercepted',
      value: threatsIntercepted,
      icon: ShieldAlert,
      color: 'text-rose-400',
      description: 'Zero-trust enforced',
      trend: 'shield'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          System Overview
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">Real-time telemetry for your autonomous workforce.</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <GlassCard key={stat.label} delay={index * 0.1}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-zinc-500 text-sm font-medium tracking-tight uppercase">{stat.label}</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tighter">
                {stat.value}
              </span>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              {stat.trend === 'up' && (
                <div className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp size={10} /> {stat.description}
                </div>
              )}
              {stat.trend === 'shield' && (
                <div className="flex items-center gap-1 text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full border border-rose-500/20 uppercase tracking-widest">
                  Secure
                </div>
              )}
              {!stat.trend && <span className="text-xs text-zinc-600">{stat.description}</span>}
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.07]">
              <stat.icon size={120} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard delay={0.3} className="h-64 flex flex-col justify-center items-center">
            <Activity className="text-zinc-800 w-16 h-16 mb-4 animate-pulse" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Neural Network Telemetry Placeholder</p>
        </GlassCard>
        <GlassCard delay={0.4} className="h-64 flex flex-col justify-center items-center">
            <ShieldAlert className="text-zinc-800 w-16 h-16 mb-4" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Global Threat Map Placeholder</p>
        </GlassCard>
      </div>
    </div>
  );
}
