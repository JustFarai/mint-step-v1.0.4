import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, Bug, Zap, TrendingUp, BarChart2, PieChart, 
  Users, Clock, Sparkles, RefreshCw, ShieldCheck, CheckCircle2, XCircle, 
  Database, Cpu, FileText, Search, Filter, Play, Check, Flame, Gauge, 
  Terminal, Layers, ArrowUpRight, ArrowDownRight, Smartphone, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ScreenUsageMetric {
  id: string;
  screenName: string;
  viewsToday: number;
  avgTimeSeconds: number;
  bounceRate: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface FeatureUsageMetric {
  id: string;
  featureName: string;
  category: string;
  invocationsToday: number;
  activeUsers: number;
  successRate: number;
}

export interface CrashReport {
  id: string;
  title: string;
  severity: 'FATAL' | 'NON_FATAL' | 'WARNING';
  affectedUsers: number;
  occurrences: number;
  appVersion: string;
  lastSeen: string;
  stackTrace: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface SlowQueryLog {
  id: string;
  queryName: string;
  collectionOrTable: string;
  executionTimeMs: number;
  thresholdMs: number;
  timestamp: string;
  frequency: number;
  recommendation: string;
}

export const initialScreenMetrics: ScreenUsageMetric[] = [
  { id: 's1', screenName: 'Executive WealthFlow Dashboard', viewsToday: 14250, avgTimeSeconds: 240, bounceRate: 12.4, trend: 'UP' },
  { id: 's2', screenName: 'POS Terminal & Registers', viewsToday: 8900, avgTimeSeconds: 420, bounceRate: 5.1, trend: 'UP' },
  { id: 's3', screenName: 'Receipt OCR Scanner', viewsToday: 6120, avgTimeSeconds: 85, bounceRate: 18.2, trend: 'STABLE' },
  { id: 's4', screenName: 'Monetization & Subscriptions', viewsToday: 4300, avgTimeSeconds: 110, bounceRate: 24.0, trend: 'UP' },
  { id: 's5', screenName: 'Offline Persistence Engine', viewsToday: 3100, avgTimeSeconds: 190, bounceRate: 8.5, trend: 'DOWN' },
];

export const initialFeatureMetrics: FeatureUsageMetric[] = [
  { id: 'f1', featureName: 'AI Tax Calculator & Section 179', category: 'Finance', invocationsToday: 3820, activeUsers: 1420, successRate: 99.8 },
  { id: 'f2', featureName: 'Receipt OCR Scanning & Parsing', category: 'AI Tools', invocationsToday: 5120, activeUsers: 2100, successRate: 97.4 },
  { id: 'f3', featureName: 'Offline DB Queue Sync', category: 'Storage', invocationsToday: 18400, activeUsers: 4800, successRate: 100.0 },
  { id: 'f4', featureName: 'B2B Invoice PDF Generation', category: 'Billing', invocationsToday: 2410, activeUsers: 950, successRate: 99.1 },
  { id: 'f5', featureName: 'Gemini Executive CFO Chat', category: 'AI Assistant', invocationsToday: 4290, activeUsers: 1880, successRate: 98.9 },
];

export const initialCrashReports: CrashReport[] = [
  { 
    id: 'crash-101', 
    title: 'Uncaught TypeError: Cannot read properties of undefined (reading "receiptTotal")', 
    severity: 'NON_FATAL', 
    affectedUsers: 14, 
    occurrences: 32, 
    appVersion: 'v2.4.1', 
    lastSeen: '10 mins ago',
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'receiptTotal')\n  at ReceiptOCRScanner.tsx:142:38\n  at processImageAsync (ocrEngine.ts:88:12)\n  at async handleFileUpload (App.tsx:312:5)`,
    status: 'INVESTIGATING'
  },
  { 
    id: 'crash-102', 
    title: 'Out of Memory: Canvas Buffer allocation exceeded during high-res invoice rendering', 
    severity: 'FATAL', 
    affectedUsers: 3, 
    occurrences: 5, 
    appVersion: 'v2.4.0', 
    lastSeen: '2 hours ago',
    stackTrace: `RangeError: Array buffer allocation failed\n  at new ArrayBuffer (<anonymous>)\n  at PDFGenerator.renderCanvas (pdfKit.ts:204:19)\n  at exportInvoicePDF (InvoicesAndQuotes.tsx:410:8)`,
    status: 'OPEN'
  },
  { 
    id: 'crash-103', 
    title: 'Firebase Firestore Connection Timeout during batch sync', 
    severity: 'NON_FATAL', 
    affectedUsers: 42, 
    occurrences: 89, 
    appVersion: 'v2.4.1', 
    lastSeen: '1 hour ago',
    stackTrace: `FirebaseError: [code=unavailable]: The service is currently unavailable.\n  at FirestoreClient.commitBatch (firestore.ts:512:10)\n  at OfflineSyncEngine.flushQueue (OfflineSyncEngine.tsx:180:14)`,
    status: 'RESOLVED'
  }
];

export const initialSlowQueries: SlowQueryLog[] = [
  { 
    id: 'sq-001', 
    queryName: 'Fetch All Sales Ledger Items with Full Client Sub-Docs', 
    collectionOrTable: 'sales_ledger', 
    executionTimeMs: 480, 
    thresholdMs: 250, 
    timestamp: '2026-07-22 03:15:10', 
    frequency: 142, 
    recommendation: 'Add composite index on [client_id, issue_date] and paginate query results to limit 20 items.' 
  },
  { 
    id: 'sq-002', 
    queryName: 'Full-text Search Inventory SKUs by Description', 
    collectionOrTable: 'inventory_skus', 
    executionTimeMs: 340, 
    thresholdMs: 200, 
    timestamp: '2026-07-22 03:20:45', 
    frequency: 88, 
    recommendation: 'Utilize localized in-memory trie index or Algolia integration for fast prefix searching.' 
  },
  { 
    id: 'sq-003', 
    queryName: 'Aggregate Section 179 Annual Tax Deductions across All Entities', 
    collectionOrTable: 'expenses_tax_deductions', 
    executionTimeMs: 610, 
    thresholdMs: 300, 
    timestamp: '2026-07-22 03:22:00', 
    frequency: 31, 
    recommendation: 'Pre-compute annual totals using Firestore distributed counters or server-side scheduled rollups.' 
  }
];

export const AppMonitoringHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ANALYTICS' | 'CRASHLYTICS' | 'PERFORMANCE' | 'AI_SUMMARY'>('OVERVIEW');
  
  // Real-time metrics
  const [crashReports, setCrashReports] = useState<CrashReport[]>(initialCrashReports);
  const [slowQueries, setSlowQueries] = useState<SlowQueryLog[]>(initialSlowQueries);
  const [screenMetrics, setScreenMetrics] = useState<ScreenUsageMetric[]>(initialScreenMetrics);
  const [featureMetrics, setFeatureMetrics] = useState<FeatureUsageMetric[]>(initialFeatureMetrics);

  // Selected crash for modal stack trace preview
  const [selectedCrash, setSelectedCrash] = useState<CrashReport | null>(null);

  // AI Summary State
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState<boolean>(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Trigger simulated live monitoring events
  const handleSimulateEvent = (type: 'NON_FATAL_ERROR' | 'SIMULATE_CRASH' | 'SLOW_QUERY' | 'FEATURE_CLICK') => {
    if (type === 'NON_FATAL_ERROR') {
      const newErr: CrashReport = {
        id: `crash-${Date.now()}`,
        title: 'Simulated Firebase Auth token refresh network failure',
        severity: 'NON_FATAL',
        affectedUsers: 1,
        occurrences: 1,
        appVersion: 'v2.4.1',
        lastSeen: 'Just now',
        stackTrace: `FirebaseError: [code=auth/network-request-failed]: Network request failed.\n  at refreshAuthToken (auth.ts:98:12)\n  at AuthProvider.tsx:45:10`,
        status: 'OPEN'
      };
      setCrashReports(prev => [newErr, ...prev]);
      triggerToast("🚨 Firebase Crashlytics: Logged non-fatal network error event!");
    } else if (type === 'SIMULATE_CRASH') {
      const newCrash: CrashReport = {
        id: `crash-${Date.now()}`,
        title: 'Simulated Fatal UI Thread Uncaught Exception',
        severity: 'FATAL',
        affectedUsers: 1,
        occurrences: 1,
        appVersion: 'v2.4.1',
        lastSeen: 'Just now',
        stackTrace: `Fatal Error: Uncaught Error: Out of memory in WebGL context\n  at WebGLRenderer.render (three.module.js:1240)\n  at renderFrame (AppMonitoringHub.tsx:88)`,
        status: 'OPEN'
      };
      setCrashReports(prev => [newCrash, ...prev]);
      triggerToast("💥 Firebase Crashlytics: Recorded fatal crash report!");
    } else if (type === 'SLOW_QUERY') {
      const newQuery: SlowQueryLog = {
        id: `sq-${Date.now()}`,
        queryName: 'Simulated Query: Aggregate Unpaid Invoices Across 10k Organizations',
        collectionOrTable: 'invoices_aggregate',
        executionTimeMs: 780,
        thresholdMs: 250,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        frequency: 1,
        recommendation: 'Create a composite query index or use a cached materialized view.'
      };
      setSlowQueries(prev => [newQuery, ...prev]);
      triggerToast("⚡ Firebase Performance: Flagged slow database query (780ms)!");
    } else if (type === 'FEATURE_CLICK') {
      setFeatureMetrics(prev => prev.map(f => f.id === 'f1' ? { ...f, invocationsToday: f.invocationsToday + 1 } : f));
      triggerToast("📊 Firebase Analytics: Registered Feature Usage Event!");
    }
  };

  // Generate AI Performance Summary via Gemini
  const handleGenerateAiPerformanceSummary = async () => {
    setIsGeneratingAiSummary(true);
    triggerToast("🤖 Contacting Gemini AI Performance Engine...");

    const payload = {
      metrics: {
        crashFreeRate: '99.82%',
        totalUsers: 18450,
        dau: 4200,
        mau: 12800,
        retentionD1: '68%',
        retentionD7: '48%',
        retentionD30: '32%',
        slowQueryCount: slowQueries.length,
        openCrashCount: crashReports.filter(c => c.status === 'OPEN').length
      },
      topScreens: screenMetrics,
      crashes: crashReports,
      slowQueries: slowQueries
    };

    try {
      const response = await fetch('/api/gemini/performance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.text) {
        setAiSummaryText(data.text);
        triggerToast("✨ AI Performance Summary generated!");
      } else {
        throw new Error(data.error || "Failed to parse AI output");
      }
    } catch (err) {
      console.warn("Falling back to local AI summary model:", err);
      // Fallback mock output if API key is not configured
      const mockAiSummary = `### 🚀 Gemini AI Executive Performance Summary & Health Audit

**1. System Reliability & Crashlytics Health (99.82% Crash-Free)**
*   **Crash-Free Session Rate:** Outstanding at **99.82%** across 18,450 active device sessions today.
*   **Active Crash Issues:** 
    *   ⚠️ **1 Fatal Exception:** Memory allocation failure during high-res PDF generation in \`PDFGenerator.renderCanvas\`. 
    *   ℹ️ **2 Non-Fatal Errors:** Unhandled null receipt property in OCR engine and transient Firebase network timeout.
*   *Action Plan:* Refactor \`PDFGenerator.renderCanvas\` to chunk array buffers into 2MB streams to eradicate high-res memory spikes on mobile devices.

**2. Database & Firebase Performance Traces (Slow Query Alert)**
*   **Flagged Query Latencies:** Detected **${slowQueries.length} database queries** exceeding the 250ms SLA threshold.
*   **Critical Bottleneck:** Query \`Fetch All Sales Ledger Items\` is averaging **480ms** execution time due to missing composite index on \`[client_id, issue_date]\`.
*   *Action Plan:* Execute Firestore index creation CLI command \`firebase firestore:indexes\` to drop execution latency from **480ms down to ~35ms**.

**3. User Retention & Engagement Cohorts**
*   **Retention Profile:** D1 Retention (**68%**), D7 Retention (**48%**), D30 Retention (**32%**).
*   **Top High-Velocity Screens:** Executive WealthFlow Dashboard (14,250 views/day) and POS Terminal (8,900 views/day).
*   **DAU / MAU Ratio:** **32.8%** (indicates strong daily stickiness, benchmark for top-tier SaaS fintech apps).`;

      setAiSummaryText(mockAiSummary);
      triggerToast("✨ AI Performance Summary rendered!");
    } finally {
      setIsGeneratingAiSummary(false);
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
            className="fixed top-6 right-6 z-50 bg-rose-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-rose-300"
          >
            <Activity className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <Gauge className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep System Monitoring & Telemetry Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider">
                Firebase Analytics • Crashlytics • Perf
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time screen usage tracking, feature adoption, user retention, crash logs & slow query performance metrics</p>
          </div>
        </div>

        {/* Global Health Pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center space-x-4">
          <div>
            <span className="text-[10px] text-slate-500 block">Crash-Free Rate</span>
            <span className="text-emerald-400 font-bold">99.82%</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">Avg Query Latency</span>
            <span className="text-cyan-400 font-bold">142 ms</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">DAU / MAU</span>
            <span className="text-amber-400 font-bold">32.8%</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        <div className="flex items-center space-x-2">
          {[
            { id: 'OVERVIEW', label: 'Telemetry Overview', icon: Activity },
            { id: 'ANALYTICS', label: 'Screen & Feature Analytics', icon: BarChart2 },
            { id: 'CRASHLYTICS', label: `Crashlytics & Errors (${crashReports.length})`, icon: Bug },
            { id: 'PERFORMANCE', label: `Perf & Slow Queries (${slowQueries.length})`, icon: Zap },
            { id: 'AI_SUMMARY', label: 'AI Performance Report', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                activeTab === tab.id 
                  ? 'bg-rose-500 text-slate-950 font-black shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Live Simulator Triggers */}
        <div className="hidden lg:flex items-center space-x-2 font-mono text-[11px]">
          <button
            onClick={() => handleSimulateEvent('NON_FATAL_ERROR')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer font-bold"
          >
            + Non-Fatal Error
          </button>
          <button
            onClick={() => handleSimulateEvent('SIMULATE_CRASH')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer font-bold"
          >
            + Fatal Crash
          </button>
          <button
            onClick={() => handleSimulateEvent('SLOW_QUERY')}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer font-bold"
          >
            + Slow Query
          </button>
        </div>
      </div>

      {/* ------------------- TAB 1: OVERVIEW ------------------- */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Active Users (DAU)</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-slate-100">4,200 <span className="text-xs text-emerald-400 font-normal">(+14.2%)</span></div>
              <p className="text-[10px] text-slate-500">Monthly Active Users: 12,800</p>
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Crash-Free Sessions</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">99.82%</div>
              <p className="text-[10px] text-slate-500">Target Benchmark: &gt;99.50%</p>
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Slow Query SLA Alerts</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{slowQueries.length} <span className="text-xs text-slate-400 font-normal">queries &gt; 250ms</span></div>
              <p className="text-[10px] text-slate-500">p95 Latency: 185ms</p>
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>D1 / D7 / D30 Retention</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-lg font-black text-indigo-400">68% / 48% / 32%</div>
              <p className="text-[10px] text-slate-500">High-Retention Fintech Benchmark</p>
            </div>

          </div>

          {/* Real-time System Stream & Quick Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Screens List */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-xs font-black uppercase text-slate-200">Top Visited Screens Today</h3>
                <span className="text-[10px] text-slate-500 font-mono">Firebase Analytics</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {screenMetrics.slice(0, 4).map(s => (
                  <div key={s.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block">{s.screenName}</span>
                      <span className="text-[10px] text-slate-500">Avg Session: {s.avgTimeSeconds}s • Bounce: {s.bounceRate}%</span>
                    </div>
                    <span className="text-rose-400 font-bold">{s.viewsToday.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unresolved Crash Alert Preview */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-xs font-black uppercase text-slate-200">Unresolved Crashlytics Issues</h3>
                <span className="text-[10px] text-rose-400 font-mono font-bold">{crashReports.filter(c => c.status !== 'RESOLVED').length} Active</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {crashReports.slice(0, 3).map(c => (
                  <div key={c.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-200 line-clamp-1">{c.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        c.severity === 'FATAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.severity}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Affected: {c.affectedUsers} users • Occurrences: {c.occurrences}</span>
                      <span>Last: {c.lastSeen}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------- TAB 2: ANALYTICS & RETENTION ------------------- */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          
          {/* Screen Usage Table */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Screen Navigation & Time Spent Tracking</h3>
              <p className="text-xs text-slate-400">Firebase Screen View telemetry measuring frequency, average time on screen, and bounce rates.</p>
            </div>

            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="p-3">Screen Name</th>
                    <th className="p-3">Views Today</th>
                    <th className="p-3">Avg Time Spent</th>
                    <th className="p-3">Bounce Rate</th>
                    <th className="p-3">Traffic Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {screenMetrics.map(s => (
                    <tr key={s.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-bold text-slate-200">{s.screenName}</td>
                      <td className="p-3 font-bold text-rose-400">{s.viewsToday.toLocaleString()}</td>
                      <td className="p-3">{s.avgTimeSeconds} seconds</td>
                      <td className="p-3">{s.bounceRate}%</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.trend === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {s.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Feature Adoption & Invocations</h3>
              <p className="text-xs text-slate-400">Event telemetry for AI tools, receipt scanning, tax calculators, and invoice generators.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {featureMetrics.map(f => (
                <div key={f.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200">{f.featureName}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">{f.category}</span>
                  </div>
                  <div className="text-lg font-black text-rose-400">{f.invocationsToday.toLocaleString()} <span className="text-xs text-slate-400 font-normal">uses</span></div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Active Users: {f.activeUsers}</span>
                    <span className="text-emerald-400 font-bold">{f.successRate}% Success</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------- TAB 3: CRASHLYTICS & ERRORS ------------------- */}
      {activeTab === 'CRASHLYTICS' && (
        <div className="space-y-6">
          
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Firebase Crashlytics Exception Log</h3>
                <p className="text-xs text-slate-400">Real-time error stack traces, fatal vs non-fatal classifications, and affected user counts.</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleSimulateEvent('SIMULATE_CRASH')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                >
                  + Trigger Simulated Crash
                </button>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {crashReports.map(c => (
                <div key={c.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        c.severity === 'FATAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {c.severity}
                      </span>
                      <span className="font-bold text-slate-200">{c.title}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500">{c.appVersion}</span>
                      <button
                        onClick={() => setSelectedCrash(c)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        Inspect Stack Trace
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-900 pt-2">
                    <span>Affected Users: <strong className="text-slate-300">{c.affectedUsers}</strong> | Occurrences: <strong className="text-slate-300">{c.occurrences}</strong></span>
                    <span>Status: <strong className="text-emerald-400">{c.status}</strong> | Last Seen: {c.lastSeen}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------- TAB 4: PERFORMANCE & SLOW QUERIES ------------------- */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-6">
          
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Slow Query & Database SLA Monitor</h3>
                <p className="text-xs text-slate-400">Database and Firestore query traces exceeding 250ms SLA threshold with indexing recommendations.</p>
              </div>

              <button
                onClick={() => handleSimulateEvent('SLOW_QUERY')}
                className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
              >
                + Simulate Slow Query
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {slowQueries.map(q => (
                <div key={q.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-200 block">{q.queryName}</span>
                      <span className="text-[10px] text-slate-500">Collection/Table: {q.collectionOrTable} • Recorded: {q.timestamp}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-rose-400 font-bold text-sm block">{q.executionTimeMs} ms</span>
                      <span className="text-[10px] text-slate-500">SLA Threshold: {q.thresholdMs} ms</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-amber-300 space-y-0.5">
                    <span className="text-[10px] text-amber-500 uppercase font-bold block">Optimization Recommendation:</span>
                    <p>{q.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------- TAB 5: AI PERFORMANCE REPORT ------------------- */}
      {activeTab === 'AI_SUMMARY' && (
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Gemini AI Executive Performance Analysis</h3>
              <p className="text-xs text-slate-400">Autonomous AI audit analyzing Crashlytics logs, slow database queries, and user retention trends.</p>
            </div>

            <button
              onClick={handleGenerateAiPerformanceSummary}
              disabled={isGeneratingAiSummary}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:opacity-90 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{isGeneratingAiSummary ? 'Analyzing Telemetry Data...' : 'Generate AI Performance Summary'}</span>
            </button>
          </div>

          {aiSummaryText ? (
            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed space-y-4 whitespace-pre-line">
              {aiSummaryText}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
              <Sparkles className="w-8 h-8 text-rose-400 mx-auto animate-pulse" />
              <h4 className="text-xs font-bold text-slate-200">No AI Performance Summary Generated Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">Click the button above to launch Gemini's deep reasoning analysis over real-time telemetry, crash logs, and query traces.</p>
            </div>
          )}
        </div>
      )}

      {/* Stack Trace Modal */}
      <AnimatePresence>
        {selectedCrash && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl font-mono text-xs"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-rose-400 uppercase font-bold block">{selectedCrash.id} • {selectedCrash.severity}</span>
                  <h3 className="font-bold text-slate-100 text-sm">{selectedCrash.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedCrash(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase text-[10px]">Raw Exception Stack Trace:</label>
                <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-rose-300 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {selectedCrash.stackTrace}
                </pre>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>App Version: {selectedCrash.appVersion}</span>
                <button
                  onClick={() => {
                    setCrashReports(prev => prev.map(c => c.id === selectedCrash.id ? { ...c, status: 'RESOLVED' } : c));
                    setSelectedCrash(null);
                    triggerToast("✅ Marked crash issue as RESOLVED!");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-all cursor-pointer"
                >
                  Mark as Resolved
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AppMonitoringHub;
