import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sword, User, Send, Loader2, X, MessageSquare 
} from 'lucide-react';

export function ChatWidget({ 
  isChatOpen, setIsChatOpen, chatMessages, chatInput, setChatInput, 
  handleSendMessage, isChatLoading, messagesEndRef 
}) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-80 md:w-[400px] h-[550px] flex flex-col overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
              
              {/* Header */}
              <div className="bg-zinc-900/50 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500/10 p-2 rounded-lg border border-violet-500/20">
                    <Bot size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-tight">OKRA Core Intelligence</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                      <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">System Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar relative z-10">
                {chatMessages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-zinc-800 border-zinc-700' 
                        : 'bg-violet-900/30 border-violet-500/30'
                    }`}>
                      {msg.role === 'user' ? <User size={14} className="text-zinc-300" /> : <Sword size={14} className="text-violet-400" />}
                    </div>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-violet-600 text-white rounded-tr-sm shadow-lg' 
                        : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 rounded-tl-sm backdrop-blur-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-violet-900/30 border border-violet-500/30 flex items-center justify-center">
                      <Sword size={14} className="text-violet-400" />
                    </div>
                    <div className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-3">
                      <Loader2 size={16} className="text-violet-400 animate-spin" />
                      <span className="text-[11px] text-zinc-500 font-mono tracking-tighter">Analyzing live telemetry...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-4 bg-zinc-900/50 backdrop-blur-md border-t border-white/5 flex gap-3 relative z-10"
              >
                <input
                  type="text"
                  placeholder="Ask about active leases or security logs..."
                  className="flex-1 bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:scale-100 text-white p-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  <Send size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`p-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex items-center justify-center border ${
          isChatOpen 
            ? 'bg-zinc-800 border-zinc-700 text-zinc-400' 
            : 'bg-violet-600 border-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)]'
        }`}
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
