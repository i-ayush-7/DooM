import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, LayoutDashboard, Key, Activity, Settings, ChevronRight
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'agents', icon: Key, label: 'Identity Vault' },
    { id: 'audit', icon: Activity, label: 'Audit & Sim' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-zinc-800/60 flex flex-col shrink-0 relative z-20">
      <div className="p-8 flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="bg-white p-2 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <Shield className="text-black w-6 h-6" strokeWidth={2.5} />
        </motion.div>
        <span className="text-2xl font-bold text-white tracking-widest">OKRA</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full relative group"
            >
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium relative z-10
                ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
              `}>
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-violet-400' : 'group-hover:text-zinc-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-zinc-800/50 rounded-xl border border-zinc-700/50 -z-10 shadow-inner"
                  />
                )}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto"
                  >
                    <ChevronRight className="w-4 h-4 text-violet-400/50" />
                  </motion.div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-zinc-800/60 bg-gradient-to-t from-black/20 to-transparent">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-zinc-800/50 hover:bg-zinc-900/30 transition-all cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border border-white/10 shadow-lg"></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Admin Workspace</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Enterprise Mode</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
