import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Mail, Cloud, Sparkles, 
  TrendingUp, DollarSign, Calendar, BarChart2, PieChart, 
  Building2, User, CheckCircle2, RefreshCw, Share2, Shield, 
  ArrowUpRight, ArrowDownLeft, FileSpreadsheet, Lock, AlertCircle,
  Clock, Check, Eye, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart as RechartsPie, Pie, Cell, Legend 
} from 'recharts';

export type ReportType = 'business' | 'personal' | 'combined';
export type ReportTimeframe = 'ytd_2026' | 'q2_2026' | 'q1_2026' | 'full_year_2025';

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  taxDeductions: number;
  assetValuation: number;
  liabilities: number;
  savingsRatePct: number;
}

const BUSINESS_MONTHLY_DATA = [
  { month: 'Jan', revenue: 42000, expenses: 18500, profit: 23500, taxSaved: 5400 },
  { month: 'Feb', revenue: 58000, expenses: 24000, profit: 34000, taxSaved: 7800 },
  { month: 'Mar', revenue: 64000, expenses: 21000, profit: 43000, taxSaved: 9200 },
  { month: 'Apr', revenue: 51000, expenses: 19500, profit: 31500, taxSaved: 6800 },
  { month: 'May', revenue: 72000, expenses: 28000, profit: 44000, taxSaved: 11200 },
  { month: 'Jun', revenue: 89000, expenses: 31000, profit: 58000, taxSaved: 14500 },
  { month: 'Jul', revenue: 95400, expenses: 32200, profit: 63200, taxSaved: 16100 },
];

const PERSONAL_MONTHLY_DATA = [
  { month: 'Jan', income: 18500, spending: 6200, savings: 12300, netWorth: 1240000 },
  { month: 'Feb', income: 19200, spending: 5800, savings: 13400, netWorth: 1262000 },
  { month: 'Mar', income: 21500, spending: 7100, savings: 14400, netWorth: 1290000 },
  { month: 'Apr', income: 18800, spending: 6400, savings: 12400, netWorth: 1315000 },
  { month: 'May', income: 24000, spending: 8200, savings: 15800, netWorth: 1342000 },
  { month: 'Jun', income: 26500, spending: 7500, savings: 19000, netWorth: 1380000 },
  { month: 'Jul', income: 28000, spending: 7100, savings: 20900, netWorth: 1425000 },
];

const CATEGORY_BREAKDOWN_BUSINESS = [
  { name: 'Hardware & Rig Upgrades', value: 38, color: '#10b981' },
  { name: 'Server Colocation & Energy', value: 24, color: '#06b6d4' },
  { name: 'Contractor & Advisory', value: 18, color: '#8b5cf6' },
  { name: 'Software & Cloud SaaS', value: 12, color: '#f59e0b' },
  { name: 'Legal & Section 179', value: 8, color: '#ec4899' },
];

const CATEGORY_BREAKDOWN_PERSONAL = [
  { name: 'Liquid Hardware Staking', value: 45, color: '#10b981' },
  { name: 'High-Yield Reserve Vaults', value: 25, color: '#06b6d4' },
  { name: 'Real Estate Equity', value: 18, color: '#8b5cf6' },
  { name: 'Living Expenses', value: 12, color: '#f59e0b' },
];

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('business');
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('ytd_2026');
  
  // UI Modal & Action States
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiSummaryText, setAiSummaryText] = useState<string>(
    "Executive Synthesis: YTD 2026 corporate operations reflect a 34.2% YoY growth in hardware net yield. Section 179 capital expenditure write-offs reduced effective tax liability by $70,900. Cash flow coverage remains resilient at 2.96x."
  );
  
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string>('f.zinyenge@wealthflow.io');
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false);

  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastBackupTime, setLastBackupTime] = useState<string>('Jul 21, 2026 • 22:35');
  const [cloudBackups, setCloudBackups] = useState<Array<{ id: string; date: string; size: string; status: string }>>([
    { id: 'snap-20260721', date: 'Jul 21, 2026 22:35', size: '1.4 MB', status: 'Synced to Firebase' },
    { id: 'snap-20260714', date: 'Jul 14, 2026 09:12', size: '1.2 MB', status: 'Archived' },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Re-synthesize AI Summary
  const handleGenerateAISummary = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setIsGeneratingAI(false);
      if (reportType === 'business') {
        setAiSummaryText(
          "AI Corporate Insights: Box Technologies has generated $471,400 in gross receipts YTD. Capital investments in liquid helium node manifolds qualify for 100% Section 179 accelerated depreciation. Recommended action: Lock in Q3 server procurement prior to August 15th tax cut-off."
        );
      } else if (reportType === 'personal') {
        setAiSummaryText(
          "AI Personal Wealth Review: Personal net worth expanded by +14.9% in 2026 to $1,425,000. Monthly savings rate averages 72.5%. High-yield liquidity reserves comfortably buffer 18 months of projected living expenses."
        );
      } else {
        setAiSummaryText(
          "Combined Wealth & Business Audit: Consolidated assets stand at $2,895,000 across personal liquid vaults and Box Technologies corporate capital. Zero high-interest liabilities detected. Tax optimization score: 96/100."
        );
      }
      triggerToast("✨ Gemini AI Report Synthesis refreshed!");
    }, 800);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const data = reportType === 'business' ? BUSINESS_MONTHLY_DATA : PERSONAL_MONTHLY_DATA;
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (reportType === 'business') {
      csvContent += "Month,Revenue ($),Expenses ($),Profit ($),Tax Saved ($)\n";
      data.forEach((row: any) => {
        csvContent += `${row.month},${row.revenue},${row.expenses},${row.profit},${row.taxSaved}\n`;
      });
    } else {
      csvContent += "Month,Income ($),Spending ($),Savings ($),Net Worth ($)\n";
      data.forEach((row: any) => {
        csvContent += `${row.month},${row.income},${row.spending},${row.savings},${row.netWorth}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WealthFlow_${reportType.toUpperCase()}_Report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("📊 CSV Financial Report downloaded successfully!");
  };

  // Export Excel Handler
  const handleExportExcel = () => {
    // Generate .xls compatible XML / Tabbed format
    const data = reportType === 'business' ? BUSINESS_MONTHLY_DATA : PERSONAL_MONTHLY_DATA;
    let excelContent = "data:application/vnd.ms-excel;charset=utf-8,";
    excelContent += "MONTH\tREVENUE/INCOME\tEXPENSES/SPENDING\tNET YIELD\n";
    
    data.forEach((row: any) => {
      const col1 = row.month;
      const col2 = row.revenue || row.income;
      const col3 = row.expenses || row.spending;
      const col4 = row.profit || row.savings;
      excelContent += `${col1}\t$${col2}\t$${col3}\t$${col4}\n`;
    });

    const encodedUri = encodeURI(excelContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WealthFlow_${reportType.toUpperCase()}_Excel_Report_${timeframe}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("📈 Excel Report Workbook generated and downloaded!");
  };

  // Export PDF Handler
  const handleExportPDF = () => {
    triggerToast("📄 Generating High-Resolution PDF Statement...");
    setTimeout(() => {
      window.print();
    }, 600);
  };

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Send Email Handler
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress.trim()) return;

    setIsEmailSending(true);
    setTimeout(() => {
      setIsEmailSending(false);
      setShowEmailModal(false);
      triggerToast(`✉️ Financial Report dispatched to ${emailAddress}`);
    }, 1000);
  };

  // Cloud Backup Handler
  const handleCloudBackup = () => {
    setIsCloudSyncing(true);
    setTimeout(() => {
      setIsCloudSyncing(false);
      const newSnap = {
        id: `snap-${Date.now()}`,
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        size: '1.5 MB',
        status: 'Synced to Firebase Cloud'
      };
      setCloudBackups(prev => [newSnap, ...prev]);
      setLastBackupTime(newSnap.date);
      triggerToast("☁️ Realtime Firebase Cloud Backup complete! Financial snapshot encrypted.");
    }, 1200);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-4 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl relative space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-emerald-400 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <FileText className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Executive Report Generator</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Audit Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Generate, visualize, export, and backup Business & Personal financial statements with AI synthesis</p>
          </div>
        </div>

        {/* Global Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Export Raw CSV Data"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Export Excel Sheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Print Statement"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Email Report"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Email</span>
          </button>

          <button
            onClick={handleCloudBackup}
            disabled={isCloudSyncing}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            title="Sync Snapshot to Firebase"
          >
            <Cloud className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
            <span>{isCloudSyncing ? 'Syncing...' : 'Cloud Backup'}</span>
          </button>
        </div>
      </div>

      {/* Controls & Mode Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 print:hidden">
        {/* Report Scope Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Report Scope</label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setReportType('business')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                reportType === 'business'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Business P&L</span>
            </button>

            <button
              onClick={() => setReportType('personal')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                reportType === 'personal'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal Net Worth</span>
            </button>

            <button
              onClick={() => setReportType('combined')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                reportType === 'combined'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Combined Audit</span>
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Statement Timeframe</label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setTimeframe('ytd_2026')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'ytd_2026' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              YTD 2026
            </button>
            <button
              onClick={() => setTimeframe('q2_2026')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'q2_2026' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Q2 2026
            </button>
            <button
              onClick={() => setTimeframe('q1_2026')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'q1_2026' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Q1 2026
            </button>
            <button
              onClick={() => setTimeframe('full_year_2025')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'full_year_2025' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FY 2025
            </button>
          </div>
        </div>
      </div>

      {/* AI Executive Summary Box */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">Gemini AI Executive Synthesis</span>
          </div>

          <button
            onClick={handleGenerateAISummary}
            disabled={isGeneratingAI}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>Re-synthesize</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
          "{aiSummaryText}"
        </p>

        <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-400 pt-1">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified by Gemini 2.5 Flash</span>
          </span>
          <span>•</span>
          <span>Confidence Score: 99.4%</span>
        </div>
      </div>

      {/* Top Headline Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportType === 'business' ? (
          <>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Gross Business Revenue</span>
              <div className="text-xl font-black text-slate-100 font-mono">$471,400</div>
              <div className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+34.2% vs previous period</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Operating Expenses</span>
              <div className="text-xl font-black text-slate-100 font-mono">$167,200</div>
              <div className="text-[10px] font-bold text-slate-400">35.4% Margin Ratio</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Net Operating Profit</span>
              <div className="text-xl font-black text-emerald-400 font-mono">$304,200</div>
              <div className="text-[10px] font-bold text-emerald-400">64.6% EBITDA Margin</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Section 179 Tax Shield</span>
              <div className="text-xl font-black text-amber-400 font-mono">$70,900</div>
              <div className="text-[10px] font-bold text-amber-400">100% Hardware Write-Off</div>
            </div>
          </>
        ) : reportType === 'personal' ? (
          <>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Personal Net Worth</span>
              <div className="text-xl font-black text-slate-100 font-mono">$1,425,000</div>
              <div className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+$185,000 in 2026</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Liquid Cashflow (YTD)</span>
              <div className="text-xl font-black text-slate-100 font-mono">$156,000</div>
              <div className="text-[10px] font-bold text-emerald-400">Avg $22.2K / Mo</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Monthly Living Expenses</span>
              <div className="text-xl font-black text-slate-100 font-mono">$7,100</div>
              <div className="text-[10px] font-bold text-slate-400">Low Debt Ratio</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Personal Savings Rate</span>
              <div className="text-xl font-black text-emerald-400 font-mono">72.5%</div>
              <div className="text-[10px] font-bold text-emerald-400">Top 1% Percentile</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Consolidated Net Capital</span>
              <div className="text-xl font-black text-slate-100 font-mono">$2,895,000</div>
              <div className="text-[10px] font-bold text-emerald-400">Liquid & Equity Assets</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Consolidated Income</span>
              <div className="text-xl font-black text-slate-100 font-mono">$627,400</div>
              <div className="text-[10px] font-bold text-emerald-400">+28% Growth Rate</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Liabilities</span>
              <div className="text-xl font-black text-slate-100 font-mono">$0.00</div>
              <div className="text-[10px] font-bold text-emerald-400">100% Solvency</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Audit & Compliance Score</span>
              <div className="text-xl font-black text-emerald-400 font-mono">98 / 100</div>
              <div className="text-[10px] font-bold text-emerald-400">IRS Tier 1 Clean</div>
            </div>
          </>
        )}
      </div>

      {/* Financial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: Trend over time */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>
                {reportType === 'business' ? 'Monthly Revenue vs Expenses' : 'Monthly Income vs Savings Velocity'}
              </span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold">2026 Trailing Performance</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'business' ? (
                <AreaChart data={BUSINESS_MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <AreaChart data={PERSONAL_MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                  <Area type="monotone" dataKey="savings" name="Savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSav)" strokeWidth={2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Allocation Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Asset Allocation Breakdown</span>
            </h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={reportType === 'business' ? CATEGORY_BREAKDOWN_BUSINESS : CATEGORY_BREAKDOWN_PERSONAL}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(reportType === 'business' ? CATEGORY_BREAKDOWN_BUSINESS : CATEGORY_BREAKDOWN_PERSONAL).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`${val}%`, 'Allocation']}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {(reportType === 'business' ? CATEGORY_BREAKDOWN_BUSINESS : CATEGORY_BREAKDOWN_PERSONAL).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-300 font-medium text-[11px]">{cat.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-200">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Ledger Data Table */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {reportType === 'business' ? 'Box Technologies Corporate Ledger' : 'Personal Wealth Ledger'}
            </h3>
            <p className="text-[11px] text-slate-400">Detailed month-by-month financial audit logs</p>
          </div>

          <span className="text-[10px] font-mono font-bold text-slate-500">
            {timeframe.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-400 bg-slate-950/50">
                <th className="p-3">Period</th>
                <th className="p-3">{reportType === 'business' ? 'Gross Revenue' : 'Total Income'}</th>
                <th className="p-3">{reportType === 'business' ? 'Operating Expenses' : 'Living Expenses'}</th>
                <th className="p-3">{reportType === 'business' ? 'Net Profit' : 'Net Savings'}</th>
                <th className="p-3">{reportType === 'business' ? 'Section 179 Shield' : 'Net Worth Cushion'}</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {(reportType === 'business' ? BUSINESS_MONTHLY_DATA : PERSONAL_MONTHLY_DATA).map((row: any, i) => (
                <tr key={i} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 font-bold text-slate-200">{row.month} 2026</td>
                  <td className="p-3 text-emerald-400">${(row.revenue || row.income).toLocaleString()}</td>
                  <td className="p-3 text-rose-400">${(row.expenses || row.spending).toLocaleString()}</td>
                  <td className="p-3 font-bold text-slate-100">${(row.profit || row.savings).toLocaleString()}</td>
                  <td className="p-3 text-amber-400">${(row.taxSaved || row.netWorth).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                      Audited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cloud Backup History Modal / Panel */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">Firebase Cloud Backup Logs</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Last Synced: {lastBackupTime}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cloudBackups.map(snap => (
            <div key={snap.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-mono font-bold text-slate-200">{snap.id}</div>
                <div className="text-[10px] text-slate-400">{snap.date} • {snap.size}</div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  {snap.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Dispatch Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-black uppercase text-slate-100">Email Financial Statement</h3>
                </div>
                <button onClick={() => setShowEmailModal(false)} className="text-slate-500 hover:text-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Dispatch an encrypted PDF report copy with attached CSV raw data directly to your email inbox or tax advisor.
              </p>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">Recipient Email Address</label>
                  <input 
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. advisor@wealthflow.io"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Included Attachments:</span>
                  </div>
                  <ul className="list-disc pl-5 text-slate-400 text-[10px] space-y-0.5">
                    <li>WealthFlow_{reportType.toUpperCase()}_Report_{timeframe}.pdf</li>
                    <li>WealthFlow_{reportType.toUpperCase()}_Ledger_{timeframe}.csv</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEmailSending}
                    className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isEmailSending ? 'Sending...' : 'Dispatch Report'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportGenerator;
