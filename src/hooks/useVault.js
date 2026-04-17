import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'okra_vault_data';

const DEFAULT_TOKENS = [
  {
    id: 'ok_alpha_trader',
    name: 'Alpha Trader Bot',
    budget: 5000,
    spent: 1250,
    scopes: ['read_email', 'transfer_funds'],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ok_social_mgr',
    name: 'Social Media Manager',
    budget: 150,
    spent: 150,
    scopes: ['read_email'],
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_LOGS = [
  { id: '1', timestamp: new Date().toLocaleTimeString(), type: 'system', action: 'System Init', message: 'OKRA Vault initialized securely.', status: 'info' }
];

const DEFAULT_SETTINGS = {
  autoRevoke: true,
  requireApproval: false,
  webhookUrl: ''
};

export function useVault() {
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tokens`);
    return saved ? JSON.parse(saved) : DEFAULT_TOKENS;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Persist state on changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tokens`, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  const addLog = useCallback((type, action, message, status = 'info') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type, action, message, status
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const createToken = useCallback((name, budget, scopes) => {
    const newToken = {
      id: 'ok_' + Math.random().toString(36).substr(2, 12),
      name: name || 'Unnamed Agent',
      budget: parseFloat(budget),
      spent: 0,
      scopes,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setTokens(prev => [newToken, ...prev]);
    addLog('system', 'Token Minted', `Created identity lease for ${newToken.name}`);
    return newToken;
  }, [addLog]);

  const revokeToken = useCallback((id) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, status: 'revoked' } : t));
    addLog('system', 'Token Revoked', `Permanently severed access for token ID ending in ...${id.slice(-4)}`);
  }, [addLog]);

  const updateTokenSpend = useCallback((id, amount) => {
    setTokens(prev => prev.map(t => {
      if (t.id === id) {
        const newSpent = t.spent + parseFloat(amount);
        return { ...t, spent: newSpent };
      }
      return t;
    }));
  }, []);

  const clearVault = useCallback(() => {
    setTokens(DEFAULT_TOKENS);
    setLogs(DEFAULT_LOGS);
    setSettings(DEFAULT_SETTINGS);
    addLog('system', 'Vault Purged', 'All telemetry and tokens cleared.');
  }, [addLog]);

  return {
    tokens,
    logs,
    settings,
    setSettings,
    createToken,
    revokeToken,
    updateTokenSpend,
    addLog,
    clearVault
  };
}
