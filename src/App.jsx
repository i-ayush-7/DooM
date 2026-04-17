import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, XCircle, Check } from 'lucide-react';

// Hooks
import { useVault } from './hooks/useVault';

// Components
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TokenVault } from './components/TokenVault';
import { GatewaySimulator } from './components/GatewaySimulator';
import { Settings } from './components/Settings';
import { ChatWidget } from './components/ChatWidget';
import { Background3D } from './components/Background3D';

export default function App() {
  const { 
    tokens, logs, settings, setSettings, 
    createToken, revokeToken, updateTokenSpend, addLog 
  } = useVault();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [copiedId, setCopiedId] = useState(null);
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  
  // Form State
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenBudget, setNewTokenBudget] = useState(1000);
  const [newTokenScopes, setNewTokenScopes] = useState({
    read_email: false, send_email: false, book_travel: false, deploy_server: false, transfer_funds: false
  });

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: 'I am OKRA Core Intelligence. I have direct access to your vault telemetry. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [chatMessages, isChatOpen]);

  // --- LOGIC HANDLERS ---
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateToken = (e) => {
    e.preventDefault();
    const activeScopes = Object.keys(newTokenScopes).filter(key => newTokenScopes[key]);
    createToken(newTokenName, newTokenBudget, activeScopes);
    setIsCreatingModalOpen(false);
    setNewTokenName('');
    setNewTokenBudget(1000);
    setNewTokenScopes({ 
      read_email: false, send_email: false, book_travel: false, 
      deploy_server: false, transfer_funds: false 
    });
  };

  const simulateAgentAction = (tokenId, action, cost) => {
    const token = tokens.find(t => t.id === tokenId);
    
    // Simulate delay
    setTimeout(() => {
      if (!token) {
        addLog('agent', action, 'Authentication Failed: Unrecognized OKRA Token', 'error');
        return;
      }
      if (token.status !== 'active') {
        addLog('agent', action, `Blocked: Token is permanently revoked`, 'error');
        return;
      }
      if (!token.scopes.includes(action)) {
        addLog('agent', action, `Blocked: Immutable scope strictly prohibits '${action}'`, 'warning');
        return;
      }
      if (cost > 0) {
        if (token.spent + parseFloat(cost) > token.budget) {
          addLog('agent', action, `Blocked: Hard budget ceiling exceeded (Attempted: $${cost}, Remaining: $${token.budget - token.spent})`, 'error');
          if (settings.autoRevoke) {
            revokeToken(token.id);
            addLog('system', 'Auto-Defense', `Token revoked due to repeated budget breach attempt.`, 'error');
          }
          return;
        }
        updateTokenSpend(token.id, cost);
        addLog('agent', action, `Authorized: Action executed via secure relay. $${cost} deducted.`, 'success');
      } else {
        addLog('agent', action, `Authorized: Read/Write action executed via secure relay.`, 'success');
      }
    }, 800);
  };

  // --- AI LOGIC ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are OKRA AI, an elite cybersecurity assistant integrated into the OKRA Identity Vault.
    Persona: Professional, concise, elite cyber-analyst.
    Context:
    - Current View: ${activeTab}
    - Tokens: ${JSON.stringify(tokens.map(t => ({name: t.name, status: t.status, budget: `$${t.budget}`, spent: `$${t.spent}`, scopes: t.scopes})))}
    - Logs: ${JSON.stringify(logs.slice(0, 10).map(l => ({action: l.action, status: l.status, message: l.message})))}
    Answer queries based on this telemetry.`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: chatMessages.slice(-5).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          })).concat({ role: 'user', parts: [{ text: userMsg }] }),
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Unknown API Error");
      }

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "System Error: No intelligence payload returned.";
      setChatMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
       setChatMessages(prev => [...prev, { role: 'model', text: `System Alert: ${error.message}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-transparent text-zinc-300 font-sans flex overflow-hidden selection:bg-violet-500/30">
      
      <Background3D activeTab={activeTab} />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-10 h-full overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'dashboard' && <Dashboard tokens={tokens} logs={logs} />}
            {activeTab === 'agents' && (
              <TokenVault 
                tokens={tokens} 
                revokeToken={revokeToken} 
                setIsCreatingModalOpen={setIsCreatingModalOpen} 
                copyToClipboard={copyToClipboard}
                copiedId={copiedId}
              />
            )}
            {activeTab === 'audit' && (
              <GatewaySimulator 
                tokens={tokens} 
                logs={logs} 
                simulateAgentAction={simulateAgentAction} 
              />
            )}
            {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {isCreatingModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f0f11] border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800/80 flex justify-between items-center bg-[#0a0a0a]">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Key size={20} className="text-violet-400" /> Mint OKRA Identity
                </h3>
                <button onClick={() => setIsCreatingModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateToken} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Agent Designation</label>
                  <input required placeholder="e.g. CI/CD Pipeline Bot" className="w-full bg-black/40 border border-zinc-800 rounded-xl p-4 text-white focus:border-violet-500 outline-none transition-all shadow-inner" value={newTokenName} onChange={(e) => setNewTokenName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Liquidity Limit (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">$</span>
                    <input required type="number" min="0" className="w-full bg-black/40 border border-zinc-800 rounded-xl p-4 pl-8 text-white font-mono focus:border-violet-500 outline-none transition-all shadow-inner" value={newTokenBudget} onChange={(e) => setNewTokenBudget(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Immutable Scopes</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(newTokenScopes).map(scope => (
                      <label key={scope} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${newTokenScopes[scope] ? 'bg-violet-500/10 border-violet-500/50 text-white' : 'bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                        <input type="checkbox" className="sr-only" checked={newTokenScopes[scope]} onChange={() => setNewTokenScopes({...newTokenScopes, [scope]: !newTokenScopes[scope]})} />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newTokenScopes[scope] ? 'bg-violet-500 border-violet-500' : 'border-zinc-700 bg-zinc-900'}`}>
                          {newTokenScopes[scope] && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-tight">{scope.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsCreatingModalOpen(false)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-xl transition-all font-bold">Cancel</button>
                  <button type="submit" className="flex-1 bg-white hover:bg-zinc-200 text-black py-4 rounded-xl transition-all font-black uppercase tracking-widest text-xs shadow-lg">Generate Identity</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatWidget 
        isChatOpen={isChatOpen} 
        setIsChatOpen={setIsChatOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendMessage={handleSendMessage}
        isChatLoading={isChatLoading}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}