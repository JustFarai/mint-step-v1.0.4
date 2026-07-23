import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, RefreshCw, Database, CloudOff, CloudCheck, CheckCircle2, 
  AlertCircle, Clock, ShieldCheck, ArrowUpRight, RotateCcw, AlertTriangle, 
  Check, X, HardDrive, Layers, Server, Sparkles, Send, Play, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type NetworkState = 'ONLINE' | 'OFFLINE' | 'UNRELIABLE';
export type SyncStatus = 'SYNCED' | 'PENDING_CHANGES' | 'SYNCING' | 'CONFLICT_DETECTED' | 'FAILED_RETRYING';

export interface PendingMutation {
  id: string;
  entityType: 'TRANSACTION' | 'INVOICE' | 'RECEIPT' | 'GOAL' | 'VERIFICATION_DOC';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payloadSummary: string;
  timestamp: string;
  retryCount: number;
  status: 'QUEUED' | 'SYNCING' | 'FAILED' | 'CONFLICT';
  conflictServerData?: string;
  conflictClientData?: string;
}

export const initialQueue: PendingMutation[] = [
  {
    id: 'mut-101',
    entityType: 'TRANSACTION',
    action: 'CREATE',
    payloadSummary: 'Offline POS Order #POS-8842: $1,250.00 Inverter Hardware',
    timestamp: '2026-07-22 03:12:05',
    retryCount: 0,
    status: 'QUEUED'
  },
  {
    id: 'mut-102',
    entityType: 'INVOICE',
    action: 'UPDATE',
    payloadSummary: 'Update Invoice #INV-2026-049 status to "PAID"',
    timestamp: '2026-07-22 03:14:22',
    retryCount: 2,
    status: 'CONFLICT',
    conflictClientData: 'Invoice #INV-2026-049 -> Status: "PAID", Amount: $4,500.00',
    conflictServerData: 'Invoice #INV-2026-049 -> Status: "VOIDED", Amount: $4,500.00 (Modified by CPA on Cloud Server)'
  },
  {
    id: 'mut-103',
    entityType: 'RECEIPT',
    action: 'CREATE',
    payloadSummary: 'OCR Scan: $320.00 Office Depot Section 179 Supplies',
    timestamp: '2026-07-22 03:15:40',
    retryCount: 1,
    status: 'FAILED'
  }
];

export const OfflineSyncEngine: React.FC = () => {
  const [networkState, setNetworkState] = useState<NetworkState>('ONLINE');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('PENDING_CHANGES');
  const [queue, setQueue] = useState<PendingMutation[]>(() => {
    const saved = localStorage.getItem('mintstep_offline_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialQueue;
  });

  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2026-07-22 03:10:00 UTC');
  const [activeConflict, setActiveConflict] = useState<PendingMutation | null>(null);

  // New Mutation Generator Form
  const [newEntity, setNewEntity] = useState<PendingMutation['entityType']>('TRANSACTION');
  const [newSummary, setNewSummary] = useState<string>('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  useEffect(() => {
    localStorage.setItem('mintstep_offline_queue', JSON.stringify(queue));
  }, [queue]);

  // Automatic Background Sync effect when Network is ONLINE and Queue has items
  useEffect(() => {
    if (networkState === 'ONLINE' && autoSyncEnabled && queue.some(item => item.status === 'QUEUED' || item.status === 'FAILED')) {
      const timer = setTimeout(() => {
        triggerAutoSync();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [networkState, autoSyncEnabled, queue]);

  // Trigger Automatic or Manual Sync Loop
  const triggerAutoSync = () => {
    if (networkState === 'OFFLINE') {
      triggerToast("📡 Cannot sync while offline! Queue retained in browser local storage.");
      return;
    }

    setSyncStatus('SYNCING');
    triggerToast("⚡ Initiating background vector stream sync with Cloud SQL...");

    setTimeout(() => {
      if (networkState === 'UNRELIABLE') {
        // 50% chance of partial sync or failure on unreliable network
        setQueue(prev => prev.map(item => {
          if (item.status === 'QUEUED') {
            const fail = Math.random() > 0.5;
            return fail 
              ? { ...item, status: 'FAILED', retryCount: item.retryCount + 1 }
              : { ...item, status: 'QUEUED' };
          }
          return item;
        }));
        setSyncStatus('FAILED_RETRYING');
        triggerToast("⚠️ Unreliable network connection: 1 request failed & queued for retry.");
      } else {
        // Online: process queued & failed items
        setQueue(prev => prev.filter(item => item.status === 'CONFLICT'));
        setLastSyncTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
        
        const hasRemainingConflict = queue.some(item => item.status === 'CONFLICT');
        setSyncStatus(hasRemainingConflict ? 'CONFLICT_DETECTED' : 'SYNCED');
        triggerToast("✅ All queued offline changes synced successfully!");
      }
    }, 1800);
  };

  // Conflict Resolution Handlers
  const handleResolveConflict = (mutationId: string, resolution: 'CLIENT_WINS' | 'SERVER_WINS') => {
    setQueue(prev => prev.filter(m => m.id !== mutationId));
    setActiveConflict(null);
    triggerToast(resolution === 'CLIENT_WINS' ? "⚡ Client override applied to Cloud SQL!" : "☁️ Server data preserved. Client mutation discarded.");
  };

  // Add Offline Action to Local Queue
  const handleEnqueueOfflineAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;

    const newMutation: PendingMutation = {
      id: `mut-${Date.now()}`,
      entityType: newEntity,
      action: 'CREATE',
      payloadSummary: newSummary,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      retryCount: 0,
      status: 'QUEUED'
    };

    setQueue(prev => [...prev, newMutation]);
    setNewSummary('');
    setSyncStatus('PENDING_CHANGES');
    triggerToast(`💾 Saved locally in IndexedDB / LocalStorage queue (${networkState === 'OFFLINE' ? 'Offline Mode' : 'Queued'})`);
  };

  const getStatusBadge = () => {
    switch (syncStatus) {
      case 'SYNCED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-black">
            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />
            <span>Cloud Synced</span>
          </span>
        );
      case 'SYNCING':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-black">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing Queue...</span>
          </span>
        );
      case 'PENDING_CHANGES':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-black">
            <Clock className="w-3.5 h-3.5" />
            <span>{queue.length} Local Queue Items</span>
          </span>
        );
      case 'CONFLICT_DETECTED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-black">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conflict Needs Resolution</span>
          </span>
        );
      case 'FAILED_RETRYING':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-black">
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            <span>Retrying Network Stream...</span>
          </span>
        );
    }
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
            className="fixed top-6 right-6 z-50 bg-indigo-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-indigo-400"
          >
            <Database className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Database className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep Offline Persistence & Sync Engine</h1>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">IndexedDB local store, background sync queue, automatic conflict resolution & retry policies</p>
          </div>
        </div>

        {/* Sync Trigger CTA */}
        <div className="flex items-center space-x-2">
          <button
            onClick={triggerAutoSync}
            disabled={syncStatus === 'SYNCING'}
            className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
            <span>Force Sync Queue ({queue.length})</span>
          </button>
        </div>
      </div>

      {/* Simulated Network Environment Controls Banner */}
      <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Simulated Network Connection Simulator</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Last Sync: {lastSyncTime}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {[
            { id: 'ONLINE', name: 'Connected (High-Speed)', icon: Wifi, color: 'text-emerald-400 border-emerald-500/30' },
            { id: 'UNRELIABLE', name: 'Unreliable / Flaky Network', icon: AlertTriangle, color: 'text-amber-400 border-amber-500/30' },
            { id: 'OFFLINE', name: 'Offline (Airplane Mode)', icon: WifiOff, color: 'text-rose-400 border-rose-500/30' },
          ].map(net => (
            <button
              key={net.id}
              onClick={() => {
                setNetworkState(net.id as NetworkState);
                triggerToast(`📡 Network environment switched to: ${net.name}`);
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center space-x-3 cursor-pointer ${
                networkState === net.id 
                  ? `bg-slate-950 ${net.color} font-bold shadow-md` 
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <net.icon className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-sans font-bold">{net.name}</span>
                <span className="text-[9px] text-slate-500 uppercase">{net.id} Mode</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Test Form: Enqueue Local Offline Action */}
      <form onSubmit={handleEnqueueOfflineAction} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Test Offline Action Queueing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <label className="text-slate-400 block mb-1">Target Entity:</label>
            <select
              value={newEntity}
              onChange={(e) => setNewEntity(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
            >
              <option value="TRANSACTION">POS Transaction</option>
              <option value="INVOICE">Invoice Status Update</option>
              <option value="RECEIPT">OCR Receipt Scan</option>
              <option value="GOAL">Business Goal Log</option>
              <option value="VERIFICATION_DOC">Verification Submission</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-slate-400 block mb-1">Action Summary Payload:</label>
            <div className="flex space-x-2">
              <input 
                type="text"
                required
                placeholder="e.g. Offline POS Sale #8845: $350.00 cash payment"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold shrink-0 cursor-pointer"
              >
                Enqueue Mutation
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Pending Offline Mutation Queue List */}
      <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">IndexedDB Local Offline Change Queue</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{queue.length} Pending Actions</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {queue.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>Queue is empty! All local offline actions are synchronized with Cloud SQL.</p>
            </div>
          ) : (
            queue.map(mutation => (
              <div 
                key={mutation.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 font-bold text-[10px]">
                      {mutation.entityType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 font-bold text-[10px]">
                      {mutation.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">{mutation.timestamp}</span>
                  </div>
                  <p className="font-sans font-bold text-slate-100 text-xs">{mutation.payloadSummary}</p>
                  {mutation.retryCount > 0 && (
                    <span className="text-[10px] text-orange-400 block">Retry Attempts: {mutation.retryCount}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {mutation.status === 'CONFLICT' && (
                    <button
                      onClick={() => setActiveConflict(mutation)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 cursor-pointer"
                    >
                      Resolve Conflict
                    </button>
                  )}

                  <span className={`px-2.5 py-1 rounded-xl font-bold text-[10px] uppercase border ${
                    mutation.status === 'QUEUED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    mutation.status === 'SYNCING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                    mutation.status === 'FAILED' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {mutation.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- CONFLICT RESOLUTION MODAL --- */}
      <AnimatePresence>
        {activeConflict && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative"
            >
              <button 
                onClick={() => setActiveConflict(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Data Conflict Detected</h3>
                </div>
                <p className="text-xs text-slate-400">Client offline changes conflict with cloud server state. Select resolution rule:</p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                
                {/* Client Local Data Box */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-2">
                  <span className="text-indigo-400 font-bold block text-[10px] uppercase">Option A: Local Client State</span>
                  <p className="text-slate-200">{activeConflict.conflictClientData}</p>
                  <button
                    onClick={() => handleResolveConflict(activeConflict.id, 'CLIENT_WINS')}
                    className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Keep Client Data (Client Wins)
                  </button>
                </div>

                {/* Server Cloud Data Box */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-2">
                  <span className="text-emerald-400 font-bold block text-[10px] uppercase">Option B: Cloud Server State</span>
                  <p className="text-slate-200">{activeConflict.conflictServerData}</p>
                  <button
                    onClick={() => handleResolveConflict(activeConflict.id, 'SERVER_WINS')}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Keep Cloud Server Data (Server Wins)
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OfflineSyncEngine;
