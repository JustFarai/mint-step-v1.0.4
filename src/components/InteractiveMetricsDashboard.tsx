import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, BarChart2, 
  Package, Wallet, Receipt, Target, Users, Bot, Sparkles, 
  RefreshCw, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, 
  Sliders, Info, ChevronRight, CheckCircle2, HelpCircle, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, LineChart, Line, PieChart as RechartsPie, Pie, Cell, Legend 
} from 'recharts';

export type MetricType = 
  | 'revenue' 
  | 'expenses' 
  | 'profit' 
  | 'growth' 
  | 'inventory' 
  | 'cashflow' 
  | 'taxes' 
  | 'marketing_roi' 
  | 'customers';

const MONTHLY_HISTORICAL_DATA = [
  { month: 'Jan', revenue: 42000, expenses: 18500, profit: 23500, cashflow: 21000, customers: 850, mktSpend: 3200, mktRev: 14500, inventoryVal: 140000, taxShield: 4200 },
  { month: 'Feb', revenue: 58000, expenses: 24000, profit: 34000, cashflow: 31000, customers: 920, mktSpend: 4100, mktRev: 19800, inventoryVal: 152000, taxShield: 6100 },
  { month: 'Mar', revenue: 64000, expenses: 21000, profit: 43000, cashflow: 39500, customers: 980, mktSpend: 4500, mktRev: 22400, inventoryVal: 165000, taxShield: 7800 },
  { month: 'Apr', revenue: 51000, expenses: 19500, profit: 31500, cashflow: 28000, customers: 1040, mktSpend: 3800, mktRev: 18200, inventoryVal: 158000, taxShield: 5900 },
  { month: 'May', revenue: 72000, expenses: 28000, profit: 44000, cashflow: 41200, customers: 1110, mktSpend: 5200, mktRev: 26500, inventoryVal: 172000, taxShield: 9100 },
  { month: 'Jun', revenue: 89000, expenses: 31000, profit: 58000, cashflow: 53000, customers: 1180, mktSpend: 6100, mktRev: 32000, inventoryVal: 180000, taxShield: 12400 },
  { month: 'Jul', revenue: 95400, expenses: 32200, profit: 63200, cashflow: 58400, customers: 1240, mktSpend: 6800, mktRev: 36200, inventoryVal: 184500, taxShield: 14500 },
];

const AI_METRIC_EXPLANATIONS: Record<MetricType, { summary: string; keyFactors: string[]; actionItems: string[] }> = {
  revenue: {
    summary: "Gross revenue reached $95,400 in July (+7.1% MoM). Growth was propelled by Box Nano-Router v2 hardware dispatches and recurring node advisory contracts.",
    keyFactors: [
      "Enterprise hardware deployment surged +18% following SpaceX partnership.",
      "High-yield liquidity staking contributed $12.4k in passive corporate yield.",
      "Customer lifetime value (LTV) expanded from $3,200 to $4,150."
    ],
    actionItems: [
      "Increase production throughput for Box Router switches by 15 units.",
      "Lock in annual prepay discount for top 5 enterprise accounts."
    ]
  },
  expenses: {
    summary: "Operating expenditures totalled $32,200 in July. Main expense drivers include helium cooling canisters ($12.5k) and server colocation energy costs.",
    keyFactors: [
      "Taiwan Semiconductor wafer outlays accounted for 38.8% of total expenses.",
      "Cloud SaaS overhead dropped by $1,200 after migrating to self-hosted node infrastructure."
    ],
    actionItems: [
      "Apply Section 179 accelerated depreciation on the $12.5k wafer purchase.",
      "Negotiate bulk energy rate lock with Nevada data center provider."
    ]
  },
  profit: {
    summary: "Net EBITDA profit stood at $63,200 in July (66.2% net profit margin). YTD accumulated profit reached $304,200.",
    keyFactors: [
      "High gross margins on software licensing (89%) offset hardware assembly costs.",
      "Zero debt interest payments maintained max operating leverage."
    ],
    actionItems: [
      "Reinvest $25,000 of net profit into high-yield liquidity vault reserve.",
      "Distribute remaining yield into corporate expansion treasury."
    ]
  },
  growth: {
    summary: "Compound monthly revenue growth rate averages +28.4%. Customer acquisition acceleration peaked in Q2 2026.",
    keyFactors: [
      "Viral referral loops within Tech Founders Circle community added 120 organic nodes.",
      "Shorts video series generated 42 enterprise leads with zero ad friction."
    ],
    actionItems: [
      "Double down on Advisor Shorts content frequency to 3 videos per week.",
      "Launch referral incentive program offering +0.5% yield boost."
    ]
  },
  inventory: {
    summary: "Total active inventory asset valuation is $184,500. Inventory turnover velocity is 4.2x per quarter.",
    keyFactors: [
      "Box Nano-Router v2 stock is low (2 units remaining).",
      "Box Quantum Switch v4 stock is healthy at 18 units ($126,000 value)."
    ],
    actionItems: [
      "Reorder 10 units of Box Nano-Router v2 immediately to avoid stockout.",
      "Maintain safety buffer threshold of 5 units minimum."
    ]
  },
  cashflow: {
    summary: "Net operating cash inflow is $58,400 / month. Cash balance runway is essentially infinite due to cash positive operations.",
    keyFactors: [
      "Average payment terms settled in 8.2 days (vs 30-day industry standard).",
      "Liquid cash reserves held in 5.2% APY treasury vaults."
    ],
    actionItems: [
      "Sweep excess $40,000 liquid buffer into 30-day automated yield vault.",
      "Maintain $15,000 instant liquidity for hardware component spot buys."
    ]
  },
  taxes: {
    summary: "Section 179 tax deductions reduced taxable income by $70,900 YTD. Effective corporate tax rate lowered to 12.4%.",
    keyFactors: [
      "Hardware R&D tax credits applied to quantum server design.",
      "Quarterly estimated tax payment of $4,850 due in 14 days."
    ],
    actionItems: [
      "File Q3 estimated tax payment before August 15th deadline.",
      "Export IRS-compliant Section 179 receipt documentation."
    ]
  },
  marketing_roi: {
    summary: "Marketing return on ad spend (ROAS) reached 5.3x in July ($6,800 spend generated $36,200 in attributed revenue).",
    keyFactors: [
      "CFO Intelligence video breakdowns yielded the highest converting leads.",
      "Customer Acquisition Cost (CAC) lowered from $210 to $145."
    ],
    actionItems: [
      "Scale monthly marketing budget from $6,800 to $9,000.",
      "A/B test hardware demonstration video thumbnails."
    ]
  },
  customers: {
    summary: "Active enterprise customer base grew to 1,240 active accounts (+60 new accounts in July). Net retention rate is 108%.",
    keyFactors: [
      "Churn rate remains exceptionally low at 0.4% per month.",
      "Multi-node hardware expansion driven by enterprise upgrades."
    ],
    actionItems: [
      "Schedule quarterly executive review with top 10 enterprise accounts.",
      "Automate onboarding email cadence for new node operators."
    ]
  }
};

export const InteractiveMetricsDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue');
  const [timeframe, setTimeframe] = useState<'ytd' | 'q2' | '6m'>('ytd');
  
  // Interactive Simulation Controls
  const [simGrowthBoost, setSimGrowthBoost] = useState<number>(10);
  const [simMktSpend, setSimMktSpend] = useState<number>(7500);
  const [simTaxRate, setSimTaxRate] = useState<number>(15);

  // AI Interactive Explanation state
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiCustomQuestion, setAiCustomQuestion] = useState<string>('');
  const [customAiAnswer, setCustomAiAnswer] = useState<string | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCustomQuestion.trim()) return;

    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setCustomAiAnswer(
        `Gemini CFO Analysis for "${aiCustomQuestion}": Based on current ${selectedMetric} dynamics and cashflow velocity, boosting growth by ${simGrowthBoost}% alongside $${simMktSpend.toLocaleString()} monthly marketing spend will yield an extra $18,400 net profit by Q4 2026 while preserving full tax shield compliance.`
      );
      triggerToast("✨ Gemini AI Explanation generated!");
    }, 700);
  };

  const currentExplanation = AI_METRIC_EXPLANATIONS[selectedMetric];

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
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <BarChart2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Interactive Metrics Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Realtime Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Explore Revenue, Expenses, Profit, Growth, Inventory, Cash Flow, Taxes, Marketing ROI & Customers with AI Explanations</p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setTimeframe('ytd')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === 'ytd' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            YTD 2026
          </button>
          <button
            onClick={() => setTimeframe('q2')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === 'q2' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Q2 2026
          </button>
          <button
            onClick={() => setTimeframe('6m')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeframe === '6m' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trailing 6M
          </button>
        </div>
      </div>

      {/* 9 Interactive Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {/* 1. Revenue */}
        <button
          onClick={() => { setSelectedMetric('revenue'); triggerToast("Selected Revenue Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'revenue' 
              ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-emerald-400">+34.2%</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">$95.4K</div>
        </button>

        {/* 2. Expenses */}
        <button
          onClick={() => { setSelectedMetric('expenses'); triggerToast("Selected Expense Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'expenses' 
              ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-slate-400">35.4%</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">$32.2K</div>
        </button>

        {/* 3. Profit */}
        <button
          onClick={() => { setSelectedMetric('profit'); triggerToast("Selected Profit Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'profit' 
              ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <PieChart className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-emerald-400">66.2%</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Profit</div>
          <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">$63.2K</div>
        </button>

        {/* 4. Growth */}
        <button
          onClick={() => { setSelectedMetric('growth'); triggerToast("Selected Growth Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'growth' 
              ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-cyan-400">MoM</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Growth</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">+28.4%</div>
        </button>

        {/* 5. Inventory */}
        <button
          onClick={() => { setSelectedMetric('inventory'); triggerToast("Selected Inventory Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'inventory' 
              ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-amber-400">24 Units</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">$184.5K</div>
        </button>

        {/* 6. Cash Flow */}
        <button
          onClick={() => { setSelectedMetric('cashflow'); triggerToast("Selected Cash Flow Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'cashflow' 
              ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <Wallet className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-emerald-400">Inflow</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cash Flow</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">$58.4K</div>
        </button>

        {/* 7. Taxes */}
        <button
          onClick={() => { setSelectedMetric('taxes'); triggerToast("Selected Tax Shield Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'taxes' 
              ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <Receipt className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-purple-400">Sec 179</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tax Shield</div>
          <div className="text-sm font-black text-purple-400 font-mono mt-0.5">$70.9K</div>
        </button>

        {/* 8. Marketing ROI */}
        <button
          onClick={() => { setSelectedMetric('marketing_roi'); triggerToast("Selected Marketing ROI Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'marketing_roi' 
              ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-indigo-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-indigo-400">5.3x</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mktg ROI</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">$36.2K</div>
        </button>

        {/* 9. Customers */}
        <button
          onClick={() => { setSelectedMetric('customers'); triggerToast("Selected Customer Analytics"); }}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'customers' 
              ? 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/30 shadow-lg' 
              : 'bg-slate-950 hover:bg-slate-900 border-slate-800/80 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between text-sky-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase text-sky-400">+60 MoM</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customers</div>
          <div className="text-sm font-black text-slate-100 font-mono mt-0.5">1,240</div>
        </button>
      </div>

      {/* Main Interactive Chart & Dynamic Visualization */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {selectedMetric.toUpperCase().replace('_', ' ')} TREND & TRAJECTORY
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">2026 Monthly Breakdown</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'revenue' || selectedMetric === 'profit' ? (
              <AreaChart data={MONTHLY_HISTORICAL_DATA}>
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Value']}
                />
                <Area type="monotone" dataKey={selectedMetric === 'revenue' ? 'revenue' : 'profit'} stroke="#10b981" fillOpacity={1} fill="url(#metricGrad)" strokeWidth={3} />
              </AreaChart>
            ) : selectedMetric === 'expenses' ? (
              <BarChart data={MONTHLY_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Expenses']}
                />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : selectedMetric === 'customers' ? (
              <LineChart data={MONTHLY_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`${val} Accounts`, 'Customers']}
                />
                <Line type="monotone" dataKey="customers" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            ) : selectedMetric === 'marketing_roi' ? (
              <BarChart data={MONTHLY_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="mktSpend" name="Ad Spend ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mktRev" name="Attributed Rev ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : selectedMetric === 'taxes' ? (
              <AreaChart data={MONTHLY_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="taxShield" name="Section 179 Shield" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            ) : (
              <AreaChart data={MONTHLY_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey={selectedMetric === 'inventory' ? 'inventoryVal' : 'cashflow'} stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Explanation & Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Insights Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
                Gemini AI Explanation: {selectedMetric.toUpperCase().replace('_', ' ')}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Assistant Active
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            "{currentExplanation.summary}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Key Drivers */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Key Performance Drivers</span>
              <div className="space-y-1.5">
                {currentExplanation.keyFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Actions */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Recommended Actions</span>
              <div className="space-y-1.5">
                {currentExplanation.actionItems.map((action, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ask AI Interactive Question Form */}
          <form onSubmit={handleAskAI} className="pt-3 border-t border-slate-800 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center space-x-1">
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>Ask Gemini CFO specific question about {selectedMetric}</span>
            </label>
            <div className="flex space-x-2">
              <input 
                type="text"
                value={aiCustomQuestion}
                onChange={(e) => setAiCustomQuestion(e.target.value)}
                placeholder={`e.g. How can we optimize ${selectedMetric} for Q3?`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'Analyzing...' : 'Ask AI'}</span>
              </button>
            </div>

            {customAiAnswer && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed font-mono"
              >
                {customAiAnswer}
              </motion.div>
            )}
          </form>
        </div>

        {/* Right Col: Interactive Projection Simulator */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Interactive What-If Simulator
            </h3>
          </div>

          <p className="text-[11px] text-slate-400">
            Adjust variables to simulate real-time projected impact on Q4 Cash Flow & Net Profit.
          </p>

          <div className="space-y-4 text-xs">
            {/* Growth Boost Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Target Growth Boost</span>
                <span className="text-emerald-400 font-mono">+{simGrowthBoost}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                value={simGrowthBoost}
                onChange={(e) => setSimGrowthBoost(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Monthly Marketing Budget Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Monthly Ad Spend</span>
                <span className="text-indigo-400 font-mono">${simMktSpend.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={simMktSpend}
                onChange={(e) => setSimMktSpend(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Effective Tax Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Effective Tax Shield</span>
                <span className="text-purple-400 font-mono">{simTaxRate}% Tax Rate</span>
              </div>
              <input 
                type="range"
                min="5"
                max="30"
                value={simTaxRate}
                onChange={(e) => setSimTaxRate(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Simulated Outputs Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-[10px] font-black uppercase text-slate-400">Projected Q4 Outcomes</div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Projected Monthly Rev:</span>
              <span className="font-bold text-emerald-400">
                ${Math.round(95400 * (1 + simGrowthBoost / 100)).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Est. Tax Savings:</span>
              <span className="font-bold text-purple-400">
                ${Math.round(14500 * (1 + (25 - simTaxRate) / 100)).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-800">
              <span className="font-bold text-slate-100">Simulated Net Profit:</span>
              <span className="font-black text-emerald-400 text-sm">
                ${Math.round((95400 * (1 + simGrowthBoost / 100) - 32200 - simMktSpend + (14500 * (25 - simTaxRate) / 100))).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default InteractiveMetricsDashboard;
