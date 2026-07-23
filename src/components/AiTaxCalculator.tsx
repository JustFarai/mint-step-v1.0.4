import React, { useState } from 'react';
import { 
  Calculator, Globe, Sparkles, DollarSign, Calendar, AlertTriangle, 
  TrendingUp, Download, Clock, ShieldCheck, HelpCircle, CheckCircle2, 
  ArrowRight, Percent, FileText, ChevronRight, MessageSquare, Bot, 
  Send, Zap, PieChart as PieChartIcon, RefreshCw, AlertCircle, Info, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

// --- Country Tax Strategy Interface ---
export interface CountryTaxProfile {
  id: string;
  countryName: string;
  flagEmoji: string;
  currencySymbol: string;
  currencyCode: string;
  vatRate: number; // e.g. 0.20 for 20%
  corporateTaxRate: number; // e.g. 0.21
  incomeTaxRate: number; // e.g. 0.24 average progressive rate
  payrollTaxRate: number; // e.g. 0.0765
  capitalGainsRate: number; // e.g. 0.15
  deductibleCategories: string[];
}

export const countryProfiles: CountryTaxProfile[] = [
  {
    id: 'US',
    countryName: 'United States',
    flagEmoji: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    vatRate: 0.0825, // State/Local Sales Tax Avg
    corporateTaxRate: 0.21,
    incomeTaxRate: 0.24,
    payrollTaxRate: 0.0765,
    capitalGainsRate: 0.15,
    deductibleCategories: ['IRS Section 179 Hardware', 'Home Office Space', 'R&D Engineering', 'Business Mileage & Travel', 'Health Insurance Premiums']
  },
  {
    id: 'UK',
    countryName: 'United Kingdom',
    flagEmoji: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
    vatRate: 0.20,
    corporateTaxRate: 0.25,
    incomeTaxRate: 0.20,
    payrollTaxRate: 0.138,
    capitalGainsRate: 0.20,
    deductibleCategories: ['Annual Investment Allowance (AIA)', 'Commercial Premises Expenses', 'Staff Pension Contributions', 'Professional Subscriptions']
  },
  {
    id: 'DE',
    countryName: 'Germany',
    flagEmoji: '🇩🇪',
    currencySymbol: '€',
    currencyCode: 'EUR',
    vatRate: 0.19,
    corporateTaxRate: 0.15,
    incomeTaxRate: 0.30,
    payrollTaxRate: 0.198,
    capitalGainsRate: 0.25,
    deductibleCategories: ['Low-Value Asset (GWG) Write-offs', 'Work Equipment (Arbeitsmittel)', 'Travel Allowance (Pendlerpauschale)']
  },
  {
    id: 'ZA',
    countryName: 'South Africa',
    flagEmoji: '🇿🇦',
    currencySymbol: 'R',
    currencyCode: 'ZAR',
    vatRate: 0.15,
    corporateTaxRate: 0.27,
    incomeTaxRate: 0.31,
    payrollTaxRate: 0.01,
    capitalGainsRate: 0.216,
    deductibleCategories: ['Section 12B Solar/Renewable Energy', 'Learnership Allowances', 'Research & Development Sec 11D']
  },
  {
    id: 'CA',
    countryName: 'Canada',
    flagEmoji: '🇨🇦',
    currencySymbol: 'C$',
    currencyCode: 'CAD',
    vatRate: 0.13, // HST average
    corporateTaxRate: 0.15,
    incomeTaxRate: 0.26,
    payrollTaxRate: 0.0595,
    capitalGainsRate: 0.25,
    deductibleCategories: ['SR&ED Tax Incentive', 'Capital Cost Allowance (CCA)', 'Business Start-Up Expenses']
  }
];

export const AiTaxCalculator: React.FC = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('US');
  const [businessType, setBusinessType] = useState<'LLC' | 'C-CORP' | 'SOLE_PROP' | 'PARTNERSHIP'>('C-CORP');

  // Input Financial Records
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(125000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(45000);
  const [payrollExpenses, setPayrollExpenses] = useState<number>(30000);
  const [capitalGains, setCapitalGains] = useState<number>(15000);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Selected Country Profile
  const profile = countryProfiles.find(c => c.id === selectedCountryId) || countryProfiles[0];

  // --- Dynamic Tax Math Computations ---
  const annualRevenue = monthlyRevenue * 12;
  const annualExpenses = monthlyExpenses * 12;
  const annualNetProfit = Math.max(0, annualRevenue - annualExpenses);

  const monthlyVat = monthlyRevenue * profile.vatRate;
  const annualVat = monthlyVat * 12;

  const monthlyCorporateTax = (annualNetProfit / 12) * profile.corporateTaxRate;
  const annualCorporateTax = annualNetProfit * profile.corporateTaxRate;

  const monthlyPayrollTax = payrollExpenses * profile.payrollTaxRate;
  const annualPayrollTax = monthlyPayrollTax * 12;

  const annualCapitalGainsTax = capitalGains * profile.capitalGainsRate;
  const monthlyCapitalGainsTax = annualCapitalGainsTax / 12;

  const totalMonthlyTaxEstimate = monthlyVat + monthlyCorporateTax + monthlyPayrollTax + monthlyCapitalGainsTax;
  const totalAnnualTaxEstimate = totalMonthlyTaxEstimate * 12;

  // Chart Breakdown
  const taxBreakdownData = [
    { name: 'VAT / Sales Tax', amount: Math.round(monthlyVat), color: '#10b981' },
    { name: 'Corporate Tax', amount: Math.round(monthlyCorporateTax), color: '#06b6d4' },
    { name: 'Payroll Tax', amount: Math.round(monthlyPayrollTax), color: '#6366f1' },
    { name: 'Capital Gains Tax', amount: Math.round(monthlyCapitalGainsTax), color: '#f59e0b' },
  ];

  // AI Assistant Chat State
  const [chatQuery, setChatQuery] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'USER' | 'AI'; text: string; timestamp: string }>>([
    {
      sender: 'AI',
      text: `Hello! I am your MintStep AI Tax Strategist for ${profile.countryName}. Based on your monthly net revenue of ${profile.currencySymbol}${annualNetProfit / 12}, your estimated monthly tax liability is ${profile.currencySymbol}${Math.round(totalMonthlyTaxEstimate).toLocaleString()}. Ask me anything about deductible expenses, VAT adjustments, or legal tax-saving strategies!`,
      timestamp: 'Just now'
    }
  ]);

  const handleSendChatQuery = (customPrompt?: string) => {
    const queryToUse = customPrompt || chatQuery;
    if (!queryToUse.trim()) return;

    const newMsg = { sender: 'USER' as const, text: queryToUse, timestamp: 'Just now' };
    setChatMessages(prev => [...prev, newMsg]);
    if (!customPrompt) setChatQuery('');

    // AI Response Logic Simulator
    setTimeout(() => {
      let aiText = '';
      const q = queryToUse.toLowerCase();

      if (q.includes('owe this month') || q.includes('how much tax')) {
        aiText = `Based on your monthly gross revenue of ${profile.currencySymbol}${monthlyRevenue.toLocaleString()} and expenses of ${profile.currencySymbol}${monthlyExpenses.toLocaleString()}, your estimated tax owed for this month is **${profile.currencySymbol}${Math.round(totalMonthlyTaxEstimate).toLocaleString()}** (comprising ${profile.currencySymbol}${Math.round(monthlyVat).toLocaleString()} VAT, ${profile.currencySymbol}${Math.round(monthlyCorporateTax).toLocaleString()} Corporate Tax, and ${profile.currencySymbol}${Math.round(monthlyPayrollTax).toLocaleString()} Payroll Tax).`;
      } else if (q.includes('vat increasing') || q.includes('vat')) {
        aiText = `Your estimated VAT liability is **${profile.currencySymbol}${Math.round(monthlyVat).toLocaleString()}/mo** (${(profile.vatRate * 100).toFixed(1)}%). VAT increases directly in proportion to your top-line client billings. To offset output VAT, ensure you scan all vendor purchase receipts to claim input VAT credits!`;
      } else if (q.includes('deductible') || q.includes('deduction') || q.includes('save tax')) {
        aiText = `In ${profile.countryName}, key tax-deductible expenses for your ${businessType} entity include:\n• **${profile.deductibleCategories.join('**\n• **')}**\n\nBy leveraging these, you can reduce your taxable profit margin and legally save up to 25% on annual tax liabilities.`;
      } else {
        aiText = `Great question! In ${profile.countryName}, under ${businessType} regulations, expenses incurred wholly and exclusively for trade are tax-deductible. Always retain digital copies of invoices in MintStep Vault for 7-year statutory compliance.`;
      }

      setChatMessages(prev => [...prev, { sender: 'AI', text: aiText, timestamp: 'Just now' }]);
    }, 800);
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
            <CheckCircle2 className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Landmark className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">AI Multi-Jurisdiction Tax Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Realtime Compliance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Automated Monthly & Annual Tax Liability Calculations, AI Deductions & Statutory Due Dates</p>
          </div>
        </div>

        {/* Export Tax Breakdown */}
        <button
          onClick={() => triggerToast(`📄 Exported ${profile.countryName} Tax Audit PDF & CSV Report!`)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export Tax Statement</span>
        </button>
      </div>

      {/* Country Profile & Entity Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5 flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Tax Country / Jurisdiction</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {countryProfiles.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCountryId(c.id);
                  triggerToast(`🌐 Switched tax profile to ${c.countryName} (${c.currencyCode})`);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  selectedCountryId === c.id 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-black' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{c.flagEmoji}</span>
                <span className="text-[10px] font-bold mt-0.5">{c.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Business Entity Structure</label>
          <div className="grid grid-cols-4 gap-2">
            {(['LLC', 'C-CORP', 'SOLE_PROP', 'PARTNERSHIP'] as const).map(type => (
              <button
                key={type}
                onClick={() => setBusinessType(type)}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs font-bold ${
                  businessType === type 
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Financial Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400">Monthly Gross Revenue</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">{profile.currencySymbol}</span>
            <input 
              type="number"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(+e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400">Monthly Operating Expenses</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">{profile.currencySymbol}</span>
            <input 
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(+e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-slate-200 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400">Monthly Payroll Budget</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">{profile.currencySymbol}</span>
            <input 
              type="number"
              value={payrollExpenses}
              onChange={(e) => setPayrollExpenses(+e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-slate-200 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400">Annual Capital Gains</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">{profile.currencySymbol}</span>
            <input 
              type="number"
              value={capitalGains}
              onChange={(e) => setCapitalGains(+e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-amber-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Tax Estimate Summary & Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Cards & Breakdown Table */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                {profile.flagEmoji} {profile.countryName} Tax Liability Summary
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculated using statutory rates for {businessType}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400">Monthly Liability</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {profile.currencySymbol}{Math.round(totalMonthlyTaxEstimate).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Tax Categories List */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">VAT / Sales Tax ({(profile.vatRate * 100).toFixed(1)}%)</span>
                <span className="text-[10px] text-slate-500">Collected on top-line billings</span>
              </div>
              <span className="text-emerald-400 font-bold">{profile.currencySymbol}{Math.round(monthlyVat).toLocaleString()}/mo</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Corporate Net Income Tax ({(profile.corporateTaxRate * 100).toFixed(1)}%)</span>
                <span className="text-[10px] text-slate-500">Applied to taxable net profit margin</span>
              </div>
              <span className="text-cyan-400 font-bold">{profile.currencySymbol}{Math.round(monthlyCorporateTax).toLocaleString()}/mo</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Employer Payroll Tax ({(profile.payrollTaxRate * 100).toFixed(1)}%)</span>
                <span className="text-[10px] text-slate-500">Contributions on staff salaries</span>
              </div>
              <span className="text-indigo-400 font-bold">{profile.currencySymbol}{Math.round(monthlyPayrollTax).toLocaleString()}/mo</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Capital Gains Tax ({(profile.capitalGainsRate * 100).toFixed(1)}%)</span>
                <span className="text-[10px] text-slate-500">Applied to asset liquidation gains</span>
              </div>
              <span className="text-amber-400 font-bold">{profile.currencySymbol}{Math.round(monthlyCapitalGainsTax).toLocaleString()}/mo</span>
            </div>
          </div>

          {/* Annual Total Box */}
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase text-emerald-400">Total Estimated Annual Tax</span>
              <p className="text-[11px] text-slate-400">Projected 12-month liability across all categories</p>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {profile.currencySymbol}{Math.round(totalAnnualTaxEstimate).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Visual Chart Breakdown */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Monthly Tax Distribution</h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {taxBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#34d399', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            {taxBreakdownData.map((d, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                <span className="text-slate-300 truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Tax Optimization Recommendations & Statutory Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Tax Saving Opportunities */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">AI Legal Tax-Saving Opportunities ({profile.countryName})</h3>
          </div>

          <div className="space-y-3 text-xs">
            {profile.deductibleCategories.map((ded, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-bold">{ded}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Deductible
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Tax Timeline & Reminders */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">Upcoming Statutory Tax Due Dates</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Q3 Estimated Corporate Tax Return</span>
                <span className="text-[10px] text-slate-500">Statutory Filing Deadline</span>
              </div>
              <span className="text-amber-400 font-bold">Aug 15, 2026</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Monthly VAT / Sales Tax Return</span>
                <span className="text-[10px] text-slate-500">Automatic Electronic Filing</span>
              </div>
              <span className="text-emerald-400 font-bold">Aug 20, 2026</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200 block">Employer Payroll Tax Wire</span>
                <span className="text-[10px] text-slate-500">Direct Treasury Transfer</span>
              </div>
              <span className="text-emerald-400 font-bold">Aug 31, 2026</span>
            </div>
          </div>
        </div>

      </div>

      {/* Integrated AI Assistant Q&A Panel */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">MintStep AI Tax Assistant Q&A</h3>
        </div>

        {/* Quick Suggested Prompts */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => handleSendChatQuery("How much tax will I owe this month?")}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
          >
            💬 How much tax will I owe this month?
          </button>

          <button
            onClick={() => handleSendChatQuery("Why is my VAT increasing?")}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
          >
            💬 Why is my VAT increasing?
          </button>

          <button
            onClick={() => handleSendChatQuery("Which expenses are tax deductible?")}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
          >
            💬 Which expenses are tax deductible?
          </button>
        </div>

        {/* Chat Messages Stream */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-60 overflow-y-auto space-y-3 text-xs">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-3 rounded-2xl space-y-1 ${
                msg.sender === 'USER' 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                <span className="text-[9px] opacity-60 block text-right font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="flex items-center space-x-2">
          <input 
            type="text"
            placeholder="Ask AI Tax Strategist a question..."
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChatQuery()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSendChatQuery()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AiTaxCalculator;
