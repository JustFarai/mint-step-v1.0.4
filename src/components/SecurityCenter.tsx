import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Fingerprint, Key, FileCode, Users, 
  ShieldAlert, Activity, Cpu, CheckCircle2, AlertTriangle, 
  XCircle, Sparkles, RefreshCw, Eye, EyeOff, Copy, Check, 
  Terminal, Shield, Server, Database, UserCheck, Search, 
  Clock, Download, Zap, Radio, Globe, Unlock, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type SecurityTab = 
  | 'encryption' 
  | 'biometrics' 
  | 'oauth' 
  | 'firebase_rules' 
  | 'rbac' 
  | 'audit_logs' 
  | 'fraud_detection';

export type UserRole = 'super_admin' | 'cfo' | 'compliance_auditor' | 'analyst';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  status: 'SUCCESS' | 'FLAGGED' | 'DENIED' | 'ENCRYPTED';
  ipAddress: string;
  hash: string;
}

interface SuspiciousAlert {
  id: string;
  time: string;
  type: string;
  riskScore: number;
  amount: string;
  location: string;
  status: 'QUARANTINED' | 'UNDER_REVIEW' | 'CLEARED';
  details: string;
}

export const SecurityCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SecurityTab>('encryption');
  
  // 1. Encryption & Secure Storage State
  const [rawText, setRawText] = useState<string>('CONFIDENTIAL_BANK_SWIFT_ROUTING: 021000021_ACC_994821');
  const [encryptedPayload, setEncryptedPayload] = useState<string>('U2FsdGVkX1+v8A9zX3Q8jJ42L1x09pBwKzL7mW9qR3Y+9mXv10aQ==');
  const [encryptionKey, setEncryptionKey] = useState<string>('a8f9-4b2c-901d-7e3f');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [decryptedOutput, setDecryptedOutput] = useState<string | null>(null);
  const [vaultItems, setVaultItems] = useState<Array<{ key: string; val: string; encrypted: boolean }>>([
    { key: 'IRS_EIN_NUMBER', val: 'XX-XXX9281', encrypted: true },
    { key: 'HELIOM_API_SECRET', val: 'sk_live_994827103948', encrypted: true },
    { key: 'TREASURY_PASSKEY_HASH', val: '0x8f2a...901e', encrypted: true },
  ]);
  const [newVaultKey, setNewVaultKey] = useState<string>('');
  const [newVaultVal, setNewVaultVal] = useState<string>('');

  // 2. Biometric State
  const [biometricStatus, setBiometricStatus] = useState<'IDLE' | 'SCANNING' | 'AUTHENTICATED' | 'FAILED'>('IDLE');
  const [activePasskeys, setActivePasskeys] = useState<Array<{ name: string; type: string; added: string; status: string }>>([
    { name: "MacBook Pro Touch ID", type: "Built-in Secure Enclave", added: "Jul 10, 2026", status: "Active" },
    { name: "iPhone 16 Pro Face ID", type: "Biometric WebAuthn", added: "Jul 15, 2026", status: "Active" },
    { name: "YubiKey 5C NFC", type: "Hardware Security Key", added: "Jun 02, 2026", status: "Backup" },
  ]);

  // 3. OAuth Providers State
  const [oauthProviders, setOauthProviders] = useState([
    { id: 'google', name: 'Google Workspace', email: 'f.zinyenge@wealthflow.io', status: 'CONNECTED', scopes: ['profile', 'email', 'calendar.readonly'] },
    { id: 'github', name: 'GitHub Enterprise', email: 'fzinyenge-dev', status: 'CONNECTED', scopes: ['user:email', 'repo:status'] },
    { id: 'apple', name: 'Apple ID Business', email: 'f.zinyenge@icloud.com', status: 'DISCONNECTED', scopes: [] },
    { id: 'microsoft', name: 'Microsoft Entra ID', email: 'f.zinyenge@corporate.com', status: 'CONNECTED', scopes: ['openid', 'directory.read'] },
  ]);

  // 4. Firebase Rules & Sandbox
  const [ruleTestRole, setRuleTestRole] = useState<UserRole>('cfo');
  const [rulePath, setRulePath] = useState<string>('/transactions/tx-9941');
  const [ruleAction, setRuleAction] = useState<'read' | 'write' | 'delete'>('write');
  const [ruleTestResult, setRuleTestResult] = useState<{ allowed: boolean; reason: string } | null>({
    allowed: true,
    reason: "MATCH: isAuditor() or isOwner() condition passed. Operation permitted."
  });

  // 5. RBAC State
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [rolePermissions, setRolePermissions] = useState({
    viewLedger: true,
    addTransaction: true,
    triggerWireTransfer: true,
    exportAuditReports: true,
    modifySecurityRules: true,
  });

  // 6. Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: 'LOG-9921', timestamp: '2026-07-21 23:04:12', actor: 'f.zinyenge@wealthflow.io', role: 'super_admin', action: 'AES-256 Payload Re-encrypted', status: 'ENCRYPTED', ipAddress: '192.168.1.104', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'LOG-9920', timestamp: '2026-07-21 22:58:04', actor: 'f.zinyenge@wealthflow.io', role: 'super_admin', action: 'Biometric WebAuthn Passkey Verified', status: 'SUCCESS', ipAddress: '192.168.1.104', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { id: 'LOG-9919', timestamp: '2026-07-21 22:42:19', actor: 'unauthorized_attempt@guest.io', role: 'guest', action: 'Attempted Wire Transfer $120,000', status: 'DENIED', ipAddress: '185.220.101.5', hash: 'ca978112ca1bbdcafac231b39a23dac405367d3014a0914104d4d62325010da8' },
    { id: 'LOG-9918', timestamp: '2026-07-21 22:15:30', actor: 'system_ai_fraud_guard', role: 'system', action: 'Flagged Velocity Anomaly (Risk 88/100)', status: 'FLAGGED', ipAddress: '0.0.0.0', hash: '13a890a88b1f59ef267e7edc4f1c9c41496a77d5402a7f516a5a228303f269a9' },
  ]);

  // 7. Fraud Detection State
  const [fraudAlerts, setFraudAlerts] = useState<SuspiciousAlert[]>([
    { id: 'ALT-1042', time: '2 mins ago', type: 'High Velocity Wire Attempt', riskScore: 88, amount: '$120,000.00', location: 'Frankfurt, DE (Tor Exit)', status: 'QUARANTINED', details: 'Transaction amount exceeds $100k threshold and originated from unrecognized IP block.' },
    { id: 'ALT-1041', time: '42 mins ago', type: 'Concurrent Biometric Failure', riskScore: 65, amount: '$0.00', location: 'Singapore, SG', status: 'UNDER_REVIEW', details: '3 failed WebAuthn biometric attempts within 15 seconds.' },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Encryption helper
  const handleSimulateEncrypt = () => {
    if (!rawText.trim()) return;
    const fakeCipher = `U2FsdGVkX1+${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}==`;
    setEncryptedPayload(fakeCipher);
    setDecryptedOutput(null);
    triggerToast("🔐 Payload encrypted with AES-256-GCM hardware cipher!");
    
    // Add to Audit Log
    const newLog: AuditLogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'f.zinyenge@wealthflow.io',
      role: currentRole,
      action: 'AES-256 Payload Encryption Executed',
      status: 'ENCRYPTED',
      ipAddress: '192.168.1.104',
      hash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSimulateDecrypt = () => {
    setIsDecrypting(true);
    setTimeout(() => {
      setIsDecrypting(false);
      setDecryptedOutput(rawText);
      triggerToast("🔓 AES-256 Payload decrypted using zero-knowledge key!");
    }, 600);
  };

  // Add to Secure Storage Vault
  const handleAddVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultKey || !newVaultVal) return;
    setVaultItems(prev => [...prev, { key: newVaultKey.toUpperCase().replace(/\s+/g, '_'), val: newVaultVal, encrypted: true }]);
    setNewVaultKey('');
    setNewVaultVal('');
    triggerToast("🛡️ Key saved to AES encrypted hardware storage vault!");
  };

  // Biometric Auth trigger
  const handleTriggerBiometric = () => {
    setBiometricStatus('SCANNING');
    setTimeout(() => {
      setBiometricStatus('AUTHENTICATED');
      triggerToast("⚡ Biometric FaceID / TouchID WebAuthn Passkey verified!");
      setTimeout(() => setBiometricStatus('IDLE'), 3500);
    }, 1200);
  };

  // Firebase Rules Sandbox Evaluator
  const handleTestFirebaseRule = () => {
    let allowed = false;
    let reason = "";

    if (rulePath.includes('/audit_logs') && ruleAction === 'write') {
      allowed = false;
      reason = "DENIED: Audit logs are immutable (allow update, delete: if false;).";
    } else if (rulePath.includes('/transactions') && ruleAction === 'write') {
      if (ruleTestRole === 'analyst') {
        allowed = false;
        reason = "DENIED: Analyst role lacks write permissions on transactions collection.";
      } else {
        allowed = true;
        reason = "PERMITTED: User role satisfies rule condition (isAuthenticated() && isAuditor()).";
      }
    } else {
      allowed = true;
      reason = "PERMITTED: Match condition passed on specified path.";
    }

    setRuleTestResult({ allowed, reason });
    triggerToast(allowed ? "✅ Firebase Rule PASSED" : "🚫 Firebase Rule DENIED");
  };

  // Fraud Alert Action
  const handleResolveAlert = (id: string, action: 'CLEARED' | 'QUARANTINED') => {
    setFraudAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, status: action } : alert));
    triggerToast(action === 'CLEARED' ? "✅ Alert marked as Cleared by CFO" : "⛔ Transaction Permanently Blocked & Quarantined");
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-4 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-emerald-400"
          >
            <ShieldCheck className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Security & Governance Suite</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Zero-Trust Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">AES-256 Encryption, Biometric WebAuthn, OAuth SSO, Firebase Rules, RBAC, Audit Logs & AI Fraud Detection</p>
          </div>
        </div>

        {/* Global Security Shield Badge */}
        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <div className="text-left">
            <div className="text-[10px] font-black uppercase text-slate-400">Security Score</div>
            <div className="text-sm font-black text-emerald-400 font-mono">100 / 100 • Grade A+</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('encryption')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'encryption' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>AES-256 & Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('biometrics')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'biometrics' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Biometrics & Passkeys</span>
        </button>

        <button
          onClick={() => setActiveTab('oauth')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'oauth' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>OAuth SSO</span>
        </button>

        <button
          onClick={() => setActiveTab('firebase_rules')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'firebase_rules' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Firebase Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'rbac' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>RBAC Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'audit_logs' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('fraud_detection')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer relative ${
            activeTab === 'fraud_detection' ? 'bg-rose-500 text-slate-950 font-black shadow-md' : 'text-rose-400 hover:text-rose-300'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>AI Fraud Guard</span>
          {fraudAlerts.filter(a => a.status === 'QUARANTINED').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute top-1 right-1"></span>
          )}
        </button>
      </div>

      {/* TAB 1: AES-256 Encryption & Secure Storage Vault */}
      {activeTab === 'encryption' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Encryption Playground */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">AES-256-GCM Hardware Encrypter</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Zero-Knowledge Enclave</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Plaintext Sensitive Payload</label>
                <textarea
                  rows={2}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSimulateEncrypt}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Encrypt Payload</span>
                </button>

                <button
                  onClick={handleSimulateDecrypt}
                  disabled={isDecrypting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Unlock className={`w-3.5 h-3.5 ${isDecrypting ? 'animate-spin' : ''}`} />
                  <span>{isDecrypting ? 'Decrypting...' : 'Decrypt with Key'}</span>
                </button>
              </div>

              {/* Cipher Output */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 block">AES-256 Ciphertext Result</span>
                <div className="text-xs font-mono text-emerald-400 break-all bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  {encryptedPayload}
                </div>
              </div>

              {decryptedOutput && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1"
                >
                  <span className="text-[10px] font-black uppercase text-emerald-400 block">Decrypted Payload</span>
                  <div className="text-xs font-mono text-emerald-200">{decryptedOutput}</div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Secure Storage Vault */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Encrypted Local Vault Storage</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Encrypted Key-Value Store</span>
            </div>

            <form onSubmit={handleAddVaultItem} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input 
                type="text"
                placeholder="KEY_NAME"
                value={newVaultKey}
                onChange={(e) => setNewVaultKey(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <input 
                type="text"
                placeholder="Secret Value"
                value={newVaultVal}
                onChange={(e) => setNewVaultVal(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="sm:col-span-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Encrypted Key</span>
              </button>
            </form>

            <div className="space-y-2">
              {vaultItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span>{item.key}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{item.val}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase border border-emerald-500/20">
                    AES Locked
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Biometrics & Passkeys */}
      {activeTab === 'biometrics' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <Fingerprint className="w-5 h-5 text-emerald-400" />
                <span>WebAuthn Biometric & Passkey Hardware Authentication</span>
              </h3>
              <p className="text-xs text-slate-400">Passwordless zero-trust authentication via Face ID, Touch ID, or FIDO2 hardware keys</p>
            </div>

            <button
              onClick={handleTriggerBiometric}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Simulate Biometric Scan</span>
            </button>
          </div>

          {/* Scanner Simulation Modal Box */}
          {biometricStatus !== 'IDLE' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center space-y-3 text-center ${
                biometricStatus === 'SCANNING'
                  ? 'bg-slate-950 border-cyan-500/50'
                  : 'bg-emerald-950/40 border-emerald-500/50'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center">
                <Fingerprint className={`w-8 h-8 text-emerald-400 ${biometricStatus === 'SCANNING' ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-100">
                  {biometricStatus === 'SCANNING' ? 'Verifying Hardware Enclave Signature...' : 'Biometric Auth Confirmed!'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">FIDO2 ECDSA P-256 Cryptographic challenge signed by Secure Enclave</p>
              </div>
            </motion.div>
          )}

          {/* Registered Passkeys List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Registered Passkey Devices</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activePasskeys.map((pk, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-100">{pk.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black border border-emerald-500/20">
                      {pk.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{pk.type}</p>
                  <p className="text-[10px] font-mono text-slate-500">Added: {pk.added}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OAuth SSO */}
      {activeTab === 'oauth' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>OAuth 2.0 & OIDC Single Sign-On Providers</span>
            </h3>
            <p className="text-xs text-slate-400">Enterprise SSO connections and active token scope management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {oauthProviders.map((provider) => (
              <div key={provider.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-100">{provider.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400">{provider.email}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                    provider.status === 'CONNECTED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {provider.status}
                  </span>
                </div>

                {provider.status === 'CONNECTED' && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-500 block">Granted OAuth Scopes</span>
                    <div className="flex flex-wrap gap-1">
                      {provider.scopes.map((scope, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[9px] font-mono border border-slate-800">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Firebase Security Rules Evaluator */}
      {activeTab === 'firebase_rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rules Code Viewer */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">firestore.rules Definition</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">rules_version = '2'</span>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed h-72">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { return request.auth.token.role == 'super_admin'; }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if request.auth.uid == userId || isAdmin();
    }

    match /transactions/{transactionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.amount < 100000;
      allow update, delete: if isAdmin();
    }

    match /audit_logs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if false; // Immutable audit logs
    }
  }
}`}
            </pre>
          </div>

          {/* Rules Sandbox Tester */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Firebase Security Rules Sandbox</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Simulated User Role</label>
                <select 
                  value={ruleTestRole}
                  onChange={(e) => setRuleTestRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="cfo">Executive CFO</option>
                  <option value="compliance_auditor">Compliance Auditor</option>
                  <option value="analyst">Read-Only Analyst</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Firestore Document Path</label>
                <input 
                  type="text"
                  value={rulePath}
                  onChange={(e) => setRulePath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Requested Action</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setRuleAction('read')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      ruleAction === 'read' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    READ
                  </button>
                  <button
                    type="button"
                    onClick={() => setRuleAction('write')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      ruleAction === 'write' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    WRITE
                  </button>
                  <button
                    type="button"
                    onClick={() => setRuleAction('delete')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      ruleAction === 'delete' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <button
                onClick={handleTestFirebaseRule}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-4 h-4" />
                <span>Evaluate Rule Simulation</span>
              </button>

              {ruleTestResult && (
                <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  ruleTestResult.allowed 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="font-black uppercase flex items-center space-x-1.5">
                    {ruleTestResult.allowed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                    <span>{ruleTestResult.allowed ? 'OPERATION PERMITTED' : 'ACCESS DENIED BY SECURITY RULE'}</span>
                  </div>
                  <p className="text-[11px] font-mono">{ruleTestResult.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Role Based Access Control (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Role Based Access Control (RBAC) Permission Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">Configure strict permissions for organizational user roles</p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <span className="text-slate-400 text-[10px] uppercase font-black px-2">Active Role:</span>
              {(['super_admin', 'cfo', 'compliance_auditor', 'analyst'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    triggerToast(`Switched active role to ${r.toUpperCase()}`);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                    currentRole === r ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Permissions for {currentRole.toUpperCase().replace('_', ' ')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={rolePermissions.viewLedger}
                    onChange={(e) => setRolePermissions({ ...rolePermissions, viewLedger: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span>View Financial Ledgers & Statements</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={rolePermissions.addTransaction}
                    onChange={(e) => setRolePermissions({ ...rolePermissions, addTransaction: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span>Record & Modify Ledger Entries</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={rolePermissions.triggerWireTransfer}
                    onChange={(e) => setRolePermissions({ ...rolePermissions, triggerWireTransfer: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span>Authorize External Wire Transfers (&gt;$100k)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded bg-slate-900 border border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={rolePermissions.modifySecurityRules}
                    onChange={(e) => setRolePermissions({ ...rolePermissions, modifySecurityRules: e.target.checked })}
                    className="accent-emerald-500"
                  />
                  <span>Modify Firebase Security Rules</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Immutable Cryptographic Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Immutable Cryptographic Audit Logs</span>
              </h3>
              <p className="text-xs text-slate-400">Write-once append-only SHA-256 hashed compliance log stream</p>
            </div>

            <button
              onClick={() => triggerToast("📄 Audit log report exported for IRS/SEC compliance")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Audit Trail</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-400 bg-slate-950/50">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Action Executed</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">SHA-256 Hash</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 font-bold text-slate-200">{log.id}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="p-3 text-slate-300">{log.actor} <span className="text-slate-500">({log.role})</span></td>
                    <td className="p-3 font-bold text-slate-100">{log.action}</td>
                    <td className="p-3 text-slate-400">{log.ipAddress}</td>
                    <td className="p-3 text-[10px] text-slate-500 truncate max-w-[120px]">{log.hash}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        log.status === 'DENIED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: AI Fraud Guard & Anomaly Engine */}
      {activeTab === 'fraud_detection' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                <span>AI-Powered Realtime Fraud Guard & Risk Engine</span>
              </h3>
              <p className="text-xs text-slate-400">Automated AI velocity scan for suspicious wire transfers, geo-anomalies, and policy breaches</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider">
              {fraudAlerts.filter(a => a.status === 'QUARANTINED').length} Quarantined
            </span>
          </div>

          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black">
                      {alert.riskScore}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-100 flex items-center space-x-2">
                        <span>{alert.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({alert.id})</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">{alert.time} • Origin: {alert.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-rose-400 font-mono">{alert.amount}</span>
                    {alert.status === 'QUARANTINED' ? (
                      <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-black text-[10px] border border-rose-500/40">
                        QUARANTINED
                      </span>
                    ) : (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleResolveAlert(alert.id, 'CLEARED')}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleResolveAlert(alert.id, 'QUARANTINED')}
                          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold cursor-pointer"
                        >
                          Block
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  {alert.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SecurityCenter;
