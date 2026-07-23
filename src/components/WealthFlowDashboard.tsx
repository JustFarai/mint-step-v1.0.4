import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Search, Wifi, WifiOff, Database, FileSpreadsheet, Globe,
  PlusCircle, ArrowUpRight, ArrowDownLeft, Percent, CreditCard, PiggyBank, 
  Target, LineChart, FileText, Activity, CheckCircle, RefreshCw, Trash2, 
  Sparkles, Layers, Info, ShieldAlert, Bell, Play, Pause, Volume2, X, ChevronRight, Video, GraduationCap, BookOpen,
  Bot, Users, Building2, User, BarChart2, ShieldCheck, Gauge, Award, UploadCloud, ScanLine, Landmark, ShoppingCart, GitBranch, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell
} from 'recharts';
import InventoryManager from './InventoryManager';
import ShortsFeed from './ShortsFeed';
import CreatorStudio from './CreatorStudio';
import WealthAssistant from './WealthAssistant';
import CFOIntelligence from './CFOIntelligence';
import WealthCommunities from './WealthCommunities';
import BusinessProfile from './BusinessProfile';
import PersonalProfile from './PersonalProfile';
import NotificationCenter from './NotificationCenter';
import ReportGenerator from './ReportGenerator';
import InteractiveMetricsDashboard from './InteractiveMetricsDashboard';
import SecurityCenter from './SecurityCenter';
import OptimizationSuite from './OptimizationSuite';
import TestingSuite from './TestingSuite';
import ProductionDeploymentCenter from './ProductionDeploymentCenter';
import ReceiptOcrScanner from './ReceiptOcrScanner';
import AiTaxCalculator from './AiTaxCalculator';
import InvoiceQuotationModule from './InvoiceQuotationModule';
import PointOfSaleSystem from './PointOfSaleSystem';
import MultiBusinessManager from './MultiBusinessManager';
import AdvisorMenteeNetwork from './AdvisorMenteeNetwork';
import BookRecommendations from './BookRecommendations';
import MintStepRecommendationEngine from './MintStepRecommendationEngine';
import GoalTrackingGamification from './GoalTrackingGamification';
import VerificationSystem from './VerificationSystem';
import MonetizationHub from './MonetizationHub';
import OfflineSyncEngine from './OfflineSyncEngine';
import DataImportExport from './DataImportExport';
import LocalizationHub from './LocalizationHub';
import AppMonitoringHub from './AppMonitoringHub';
import DevOpsPipelineHub from './DevOpsPipelineHub';
import ReleaseLaunchHub from './ReleaseLaunchHub';
import OnboardingFlow from './OnboardingFlow';

// --- Types ---
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: string;
  isPendingSync?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  author: string;
  views: string;
  thumbnail: string;
}

export default function WealthFlowDashboard() {
  // --- Core States ---
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncQueue, setSyncQueue] = useState<Transaction[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showFABModal, setShowFABModal] = useState<boolean>(false);
  
  // --- Dashboard Mode Switcher ---
  const [dashboardMode, setDashboardMode] = useState<'onboarding' | 'release_launch' | 'devops' | 'monitoring' | 'localization' | 'import_export' | 'offline_sync' | 'monetization' | 'verification' | 'goal_tracking' | 'rec_engine' | 'book_recommendations' | 'advisor_mentee' | 'multi_biz' | 'pos' | 'invoices' | 'tax_calc' | 'receipt_ocr' | 'deploy_prod' | 'testing' | 'opt_suite' | 'security' | 'metrics' | 'reports' | 'notifications' | 'personal_profile' | 'profile' | 'personal' | 'business' | 'inventory' | 'shorts' | 'studio' | 'assistant' | 'insights' | 'communities'>('onboarding');

  // --- Box Technologies Business States ---
  const [businessSales, setBusinessSales] = useState<any[]>(() => {
    const local = localStorage.getItem('wf_biz_sales');
    if (local) return JSON.parse(local);
    return [
      { id: 's1', client: 'SpaceX B2B Cloud', amount: 48500, title: 'Titanium Rack Delivery', date: '2026-07-15' },
      { id: 's2', client: 'Anduril Node Defense', amount: 24000, title: '10x Quantum Router Nodes', date: '2026-07-12' },
      { id: 's3', client: 'Ethereum Foundation', amount: 15500, title: 'Solidity Compiler Assembly', date: '2026-07-08' },
      { id: 's4', client: 'Vercel Inc.', amount: 9800, title: 'Box Server Frameworks', date: '2026-07-02' }
    ];
  });

  const [businessExpenses, setBusinessExpenses] = useState<any[]>(() => {
    const local = localStorage.getItem('wf_biz_expenses');
    if (local) return JSON.parse(local);
    return [
      { id: 'e1', title: 'Taiwan Semiconductor Wafers', amount: 12500, category: 'Hardware Cost', date: '2026-07-14' },
      { id: 'e2', title: 'AWS Cloud Clusters', amount: 4200, category: 'Hosting', date: '2026-07-11' },
      { id: 'e3', title: 'Shenzhen Assembly Outlay', amount: 8000, category: 'Manufacturing', date: '2026-07-05' },
      { id: 'e4', title: 'Logistics Customs Clearance', amount: 1500, category: 'Transport', date: '2026-07-04' }
    ];
  });

  const [businessInventory, setBusinessInventory] = useState<any[]>(() => {
    const local = localStorage.getItem('wf_biz_inventory');
    if (local) return JSON.parse(local);
    return [
      { id: 'i1', name: 'Box Nano-Router v2', quantity: 2, cost: 450, price: 950, sku: 'SKU-NANO-R2' },
      { id: 'i2', name: 'Box Quantum Switch v4', quantity: 15, cost: 1200, price: 2400, sku: 'SKU-QUANTUM-S4' },
      { id: 'i3', name: 'Ethereum Core Node Assembly', quantity: 8, cost: 800, price: 1550, sku: 'SKU-ETH-CORE' },
      { id: 'i4', name: 'Titanium Rack Mounts', quantity: 40, cost: 200, price: 485, sku: 'SKU-TITAN-RACK' }
    ];
  });

  // Business Action Modals
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [receiptScanModalOpen, setReceiptScanModalOpen] = useState<boolean>(false);
  const [newBizTxModalOpen, setNewBizTxModalOpen] = useState<boolean>(false);
  const [newBizTxType, setNewBizTxType] = useState<'sale' | 'expense'>('sale');

  // New Invoice Form States
  const [invoiceClient, setInvoiceClient] = useState<string>('');
  const [invoiceTitle, setInvoiceTitle] = useState<string>('');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('');

  // Receipt Scanner Form States
  const [isScanningReceipt, setIsScanningReceipt] = useState<boolean>(false);
  const [scannedReceiptResult, setScannedReceiptResult] = useState<any | null>(null);

  // New Business Sale/Expense States
  const [bizTxTitle, setBizTxTitle] = useState<string>('');
  const [bizTxClientOrCategory, setBizTxClientOrCategory] = useState<string>('');
  const [bizTxAmount, setBizTxAmount] = useState<string>('');
  const [bizTxDate, setBizTxDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Business Gemini insights
  const [businessInsights, setBusinessInsights] = useState<string | null>(null);
  const [isGeneratingBizInsights, setIsGeneratingBizInsights] = useState<boolean>(false);

  // Video Player states
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoVolume, setVideoVolume] = useState<number>(80);

  // AI Insights states
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);

  // Load state or default seed data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const local = localStorage.getItem('wf_transactions');
    if (local) return JSON.parse(local);
    return [
      { id: 't1', type: 'income', title: 'Enterprise Software Pay', amount: 5500, category: 'Salary', date: '2026-07-01' },
      { id: 't2', type: 'income', title: 'Advisory Consultation', amount: 1200, category: 'Freelance', date: '2026-07-10' },
      { id: 't3', type: 'income', title: 'Dividend Yield Payments', amount: 150, category: 'Investments', date: '2026-07-15' },
      { id: 't4', type: 'expense', title: 'Luxury Appartment Lease', amount: 1800, category: 'Rent', date: '2026-07-02' },
      { id: 't5', type: 'expense', title: 'Groceries (Whole Foods)', amount: 450, category: 'Food', date: '2026-07-05' },
      { id: 't6', type: 'expense', title: 'Equinox Gym Outflow', amount: 220, category: 'Utilities', date: '2026-07-11' },
      { id: 't7', type: 'expense', title: 'EV Battery Supercharging', amount: 180, category: 'Transport', date: '2026-07-12' },
      { id: 't8', type: 'expense', title: 'Acoustic Sound Theater', amount: 150, category: 'Entertainment', date: '2026-07-14' },
      { id: 't9', type: 'expense', title: 'Vercel Server Node Deployment', amount: 90, category: 'Utilities', date: '2026-07-18' },
    ];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const local = localStorage.getItem('wf_budgets');
    if (local) return JSON.parse(local);
    return [
      { id: 'b1', category: 'Food', limitAmount: 800, spentAmount: 450 },
      { id: 'b2', category: 'Rent', limitAmount: 1800, spentAmount: 1800 },
      { id: 'b3', category: 'Transport', limitAmount: 300, spentAmount: 180 },
      { id: 'b4', category: 'Entertainment', limitAmount: 400, spentAmount: 150 },
      { id: 'b5', category: 'Utilities', limitAmount: 400, spentAmount: 310 },
    ];
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const local = localStorage.getItem('wf_savings');
    if (local) return JSON.parse(local);
    return [
      { id: 's1', title: 'Liquid Cash Buffer', targetAmount: 20000, currentAmount: 8500, category: 'Emergency' },
      { id: 's2', title: 'Ethereum Ledger Assets', targetAmount: 10000, currentAmount: 8000, category: 'Investments' },
      { id: 's3', title: 'Tokyo Winter Holiday', targetAmount: 6000, currentAmount: 2500, category: 'Travel' },
    ];
  });

  // Simple static recommended videos list
  const recommendedVideos: VideoItem[] = [
    {
      id: 'v1',
      title: 'Strategic Asset Allocation & Portfolio Balancing',
      description: 'Master the principles of asset rebalancing to optimize risk-adjusted yields during volatility.',
      duration: '12:40',
      author: 'FinFlow Capital Team',
      views: '4.8K views',
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'v2',
      title: 'Proactive Budgeting & Expense Outflow Mitigation',
      description: 'Discover how modern analytical ledgers and micro-caps can prevent cash flow decay.',
      duration: '8:15',
      author: 'Felix Zinyenge',
      views: '12.4K views',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'v3',
      title: 'Tax-Advantaged Automated Savings Pipelines',
      description: 'Learn to configure locked goals that convert checking account interest into capital compounding systems.',
      duration: '15:20',
      author: 'WealthFlow Academy',
      views: '9.2K views',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // --- Form Input States (FAB modal / Inline form) ---
  const [newTxType, setNewTxType] = useState<'income' | 'expense'>('expense');
  const [newTxTitle, setNewTxTitle] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxCategory, setNewTxCategory] = useState('Food');
  const [newTxDate, setNewTxDate] = useState(new Date().toISOString().split('T')[0]);

  // --- LocalStorage persistence trigger ---
  useEffect(() => {
    localStorage.setItem('wf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wf_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('wf_savings', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('wf_biz_sales', JSON.stringify(businessSales));
  }, [businessSales]);

  useEffect(() => {
    localStorage.setItem('wf_biz_expenses', JSON.stringify(businessExpenses));
  }, [businessExpenses]);

  useEffect(() => {
    localStorage.setItem('wf_biz_inventory', JSON.stringify(businessInventory));
  }, [businessInventory]);

  // Recalculate spentAmount in budgets whenever transactions change
  useEffect(() => {
    setBudgets(prev => {
      return prev.map(b => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...b, spentAmount: spent };
      });
    });
  }, [transactions]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Calculations ---
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const totalSavings = savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0);
    const checkingBalance = Math.max(0, 15000 + totalIncome - totalExpense);
    const netWorth = checkingBalance + totalSavings;

    return {
      totalIncome,
      totalExpense,
      totalSavings,
      checkingBalance,
      netWorth
    };
  }, [transactions, savingsGoals]);

  // --- Box Technologies Business Calculations ---
  const businessStats = useMemo(() => {
    const totalSales = businessSales.reduce((sum, s) => sum + s.amount, 0);
    const totalExpenses = businessExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalSales - totalExpenses;
    
    // Inventory total value (cost base)
    const totalInventoryValue = businessInventory.reduce((sum, i) => sum + (i.quantity * i.cost), 0);
    
    // Cash Flow (base liquid reserves + sales - expenses)
    const baseReserves = 145000;
    const currentCashFlow = baseReserves + totalSales - totalExpenses;
    
    // Estimated accrued taxes (approx 21% flat corporate tax rate on net profit)
    const estimatedTax = Math.max(0, Math.round(netProfit * 0.21));

    return {
      sales: totalSales,
      expenses: totalExpenses,
      profit: netProfit,
      inventory: totalInventoryValue,
      cashFlow: currentCashFlow,
      tax: estimatedTax
    };
  }, [businessSales, businessExpenses, businessInventory]);

  // --- Inventory Alerts (Critical Low Stock Check) ---
  const businessInventoryAlerts = useMemo(() => {
    const alerts: any[] = [];
    businessInventory.forEach(item => {
      if (item.quantity <= 3) {
        alerts.push({
          id: `alert-inv-${item.id}`,
          type: 'warning',
          text: `Low stock warning on "${item.name}" (SKU: ${item.sku}) - only ${item.quantity} units remaining!`
        });
      }
    });
    return alerts;
  }, [businessInventory]);

  // Sync notifications list based on financials and mode
  const systemNotifications = useMemo(() => {
    const alerts = [];
    
    if (dashboardMode === 'business') {
      // Add business specific notifications
      businessInventoryAlerts.forEach(alert => {
        alerts.push(alert);
      });
      // Tax deadline warning
      alerts.push({
        id: 'alert-biz-tax',
        type: 'info',
        text: "Quarterly estimated corporate income tax (Section 179 provision) must be submitted within 15 business days."
      });
      // Corporate success note
      alerts.push({
        id: 'alert-biz-welcome',
        type: 'success',
        text: "Box Technologies operating ledgers fully synced with core B2B supply chain APIs."
      });
    } else {
      // Budget warnings
      budgets.forEach(b => {
        const pct = b.limitAmount > 0 ? (b.spentAmount / b.limitAmount) * 100 : 0;
        if (pct >= 85) {
          alerts.push({
            id: `alert-b-${b.id}`,
            type: 'warning',
            text: `Budget Alert: ${b.category} allocation is at ${pct.toFixed(0)}% capacity ($${b.spentAmount}/$${b.limitAmount}).`
          });
        }
      });
      // General welcoming note
      alerts.push({
        id: 'alert-welcome',
        type: 'success',
        text: "Welcome back, Felix Zinyenge! Your secure blockchain wallet and ledger are synchronized."
      });
    }

    // Offline queue notifications (applies to both)
    if (syncQueue.length > 0) {
      alerts.push({
        id: 'alert-queue',
        type: 'info',
        text: `${syncQueue.length} transactions waiting in Offline Queue. Connect online to sync with database.`
      });
    }

    return alerts;
  }, [dashboardMode, budgets, syncQueue, businessInventoryAlerts]);

  // --- Search & Filters computation ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = searchQuery === '' || 
                          t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [transactions, searchQuery]);

  const filteredBusinessSales = useMemo(() => {
    return businessSales.filter(s => {
      if (!searchQuery) return true;
      return s.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
             s.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [businessSales, searchQuery]);

  const filteredBusinessExpenses = useMemo(() => {
    return businessExpenses.filter(e => {
      if (!searchQuery) return true;
      return e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             e.category.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [businessExpenses, searchQuery]);

  // --- Network Sync Simulation ---
  const toggleNetworkMode = () => {
    setIsOnline(!isOnline);
    triggerToast(isOnline ? "🔴 Switched to Offline mode. Offline Ledger active." : "🟢 Back online! Sync system initialized.");
  };

  const handleForceSync = () => {
    if (syncQueue.length === 0) {
      triggerToast("All transactions fully verified and synced in Cloud!");
      return;
    }
    setIsSyncing(true);
    triggerToast(`🔄 Synchronizing ${syncQueue.length} queued records to Firebase Firestore...`);
    
    setTimeout(() => {
      // Clear queue and mark all transactions as synced
      setTransactions(prev => prev.map(t => ({ ...t, isPendingSync: false })));
      setSyncQueue([]);
      setIsSyncing(false);
      triggerToast("✨ Blockchain database synchronization completed! Safe storage verified.");
    }, 1500);
  };

  // --- Actions ---
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxTitle.trim() || !newTxAmount || parseFloat(newTxAmount) <= 0) {
      triggerToast("⚠️ Please enter a valid description and positive numerical amount.");
      return;
    }

    const amountNum = parseFloat(newTxAmount);
    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      type: newTxType,
      title: newTxTitle,
      amount: amountNum,
      category: newTxCategory,
      date: newTxDate,
      isPendingSync: !isOnline
    };

    setTransactions(prev => [newTx, ...prev]);

    if (!isOnline) {
      setSyncQueue(prev => [...prev, newTx]);
      triggerToast("💾 Saved locally to Offline Sync Queue.");
    } else {
      triggerToast("🚀 Transaction securely synced with Firestore ledger.");
    }

    // Reset fields & close modal
    setNewTxTitle('');
    setNewTxAmount('');
    setShowFABModal(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setSyncQueue(prev => prev.filter(t => t.id !== id));
    triggerToast("🗑️ Transaction removed successfully.");
  };

  const handleAddSavingsDeposit = (goalId: string, amt: number) => {
    setSavingsGoals(prev => prev.map(s => {
      if (s.id === goalId) {
        const nextAmt = Math.min(s.currentAmount + amt, s.targetAmount);
        triggerToast(`💰 Contributed $${amt} to "${s.title}"! Goal progress updated.`);
        return { ...s, currentAmount: nextAmt };
      }
      return s;
    }));
  };

  const handleSimulateMarketVolatility = () => {
    // Generate a random market fluctuation impact on savings / digital assets
    const randomChange = (Math.random() * 800 - 400); // between -$400 and +$400
    setSavingsGoals(prev => prev.map(s => {
      if (s.category === 'Investments') {
        const nextAmt = Math.max(100, Math.round(s.currentAmount + randomChange));
        return { ...s, currentAmount: nextAmt };
      }
      return s;
    }));
    triggerToast(randomChange >= 0 
      ? `📈 Market volatility surge! High-growth assets increased by +$${Math.round(randomChange)}.` 
      : `📉 Market consolidation. Assets adjusted by -$${Math.abs(Math.round(randomChange))}.`
    );
  };

  // --- Fetch Gemini AI Insights ---
  const handleGetAIInsights = async () => {
    setIsGeneratingInsights(true);
    setAiInsights(null);
    triggerToast("🧠 Consulting Gemini Wealth Engine...");

    try {
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats,
          transactions: transactions.slice(0, 10),
          budgets,
          savingsGoals
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setAiInsights(data.text);
        triggerToast("✨ AI Financial Insights generated!");
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("⚠️ Could not contact Gemini. Using simulated analytical feedback.");
      // Fallback
      setAiInsights(`### 🌟 FinFlow AI Financial Analysis (Simulated Fallback)

**1. Cash Flow & Liquidity Allocation**
*   Your monthly revenue of **$${stats.totalIncome.toLocaleString()}** exceeds your outlays of **$${stats.totalExpense.toLocaleString()}** by **$${(stats.totalIncome - stats.totalExpense).toLocaleString()}**. This represents a solid positive cash position.
*   *Action:* Consider automating **15%** of this net monthly surplus directly into your High-Yield Checking Node or your active **Ethereum ledger assets**.

**2. Budget Pacing & Efficiency**
${budgets.map(b => {
  const pct = b.limitAmount > 0 ? (b.spentAmount / b.limitAmount) * 100 : 0;
  if (pct >= 80) {
    return `*   ⚠️ **Warning on ${b.category} Budget**: You have spent **$${b.spentAmount}** of your **$${b.limitAmount}** allocation (${pct.toFixed(0)}%). You are nearing the spending limit.`;
  }
  return `*   ✓ **${b.category} Budget**: Active pacing is excellent. You have utilized only **${pct.toFixed(0)}%** of your **$${b.limitAmount}** threshold.`;
}).join('\n')}

**3. Wealth Building & Asset Allocation**
*   Your investment portfolio stands at **$${stats.totalSavings.toLocaleString()}** across stocks and digital ledger assets.
*   Your Ethereum ledger assets show high volatility, which can be leveraged if rebalanced quarterly. Seek to maintain a **70/30** Split between index equities and liquid reserves.`);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // --- Fetch Gemini Corporate AI Insights for Box Technologies ---
  const handleGetBusinessAIInsights = async () => {
    setIsGeneratingBizInsights(true);
    setBusinessInsights(null);
    triggerToast("🧠 Consulting Gemini Enterprise CFO Advisor...");

    try {
      const response = await fetch('/api/gemini/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: businessStats,
          sales: businessSales,
          expenses: businessExpenses,
          inventory: businessInventory,
          inventoryAlerts: businessInventoryAlerts
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setBusinessInsights(data.text);
        triggerToast("✨ AI Corporate Insights generated!");
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("⚠️ Could not contact Gemini. Using corporate fallback adviser.");
      // Fallback
      setBusinessInsights(`### 🏢 Box Technologies - Strategic Corporate Analysis (Simulated)

**1. Operating Profit Margin & Cash Flow Integrity**
*   Your gross sales of **$${businessStats.sales.toLocaleString()}** against total operating expenses of **$${businessStats.expenses.toLocaleString()}** yields a net profit of **$${businessStats.profit.toLocaleString()}**. This represents an impressive **${(businessStats.sales > 0 ? ((businessStats.profit / businessStats.sales) * 100).toFixed(1) : "0")}%** net margin.
*   *Observation:* Cash flow is highly liquid with **$${businessStats.cashFlow.toLocaleString()}** in net monthly positive drift. However, B2B hardware manufacturing and assembly cycles could strain short-term liquidity if collections slow down.
*   *Action:* Consider establishing a **15-day Net invoice collection policy** for enterprise cloud clients to lock in gains and mitigate cash flow bottlenecks.

**2. Inventory Turnover & Capital Efficiency**
*   Active inventory valuation stands at **$${businessStats.inventory.toLocaleString()}**. 
${businessInventoryAlerts.length > 0 ? businessInventoryAlerts.map(alert => {
  return `*   ⚠️ **Critical Alert**: ${alert.text}. Low stock tied up in high-velocity units delays client fulfillment. Recommend a prompt reorder.`;
}).join('\n') : '*   ✓ All server node hardware SKU stock thresholds are balanced at healthy operating quantities.'}
*   *Action:* Liquidate or discount slow-moving legacy router components to free up working capital for your high-growth **Ethereum Core Ledger node** assembly parts.

**3. Tax Provisions & Write-offs (MD3 Corporate Compliance)**
*   Your current corporate income tax liability provision is estimated at **$${businessStats.tax.toLocaleString()}** (representing a standard accrued federal and state corporate bracket).
*   *Action:* Work with your finance arm to write off depreciation on server assembly machinery under **Section 179**. Standardize R&D tax credits for software node algorithms to minimize overall taxable liability.`);
    } finally {
      setIsGeneratingBizInsights(false);
    }
  };

  // --- Create corporate B2B Invoice ---
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceClient.trim() || !invoiceTitle.trim() || !invoiceAmount || parseFloat(invoiceAmount) <= 0) {
      triggerToast("⚠️ Please specify a client name, item description, and valid positive amount.");
      return;
    }
    const amt = parseFloat(invoiceAmount);
    const newSale = {
      id: `s_${Date.now()}`,
      client: invoiceClient,
      title: `Invoice: ${invoiceTitle}`,
      amount: amt,
      date: new Date().toISOString().split('T')[0]
    };
    setBusinessSales(prev => [newSale, ...prev]);
    triggerToast(`🧾 B2B Invoice generated! $${amt} sale recorded for ${invoiceClient}.`);
    
    // Clear and close
    setInvoiceClient('');
    setInvoiceTitle('');
    setInvoiceAmount('');
    setInvoiceModalOpen(false);
  };

  // --- Scan corporate receipt with Mock OCR extraction ---
  const handleSimulateScanReceipt = (receiptPreset: 'chips' | 'server' | 'cable') => {
    setIsScanningReceipt(true);
    setScannedReceiptResult(null);
    triggerToast("📷 Running optical OCR alignment and AI data structure compilation...");

    setTimeout(() => {
      let result: any = null;
      if (receiptPreset === 'chips') {
        result = {
          vendor: 'Taiwan Semiconductor Co.',
          amount: 8500,
          category: 'Hardware Cost',
          items: 'Silicon Wafer Substrate cores (x100)',
          tax: 1785
        };
      } else if (receiptPreset === 'server') {
        result = {
          vendor: 'Digital Ocean Clusters',
          amount: 1450,
          category: 'Hosting',
          items: 'Droplet Node Core compute (1 month)',
          tax: 304
        };
      } else {
        result = {
          vendor: 'Copper & Wire Logistics',
          amount: 450,
          category: 'Transport',
          items: 'Heavy Duty Optical fiber cables',
          tax: 94
        };
      }

      setScannedReceiptResult(result);
      setIsScanningReceipt(false);
      triggerToast("✅ AI OCR Scan complete! Receipt structured.");
    }, 1500);
  };

  const handleApproveScannedReceipt = () => {
    if (!scannedReceiptResult) return;
    const newExpense = {
      id: `e_${Date.now()}`,
      title: `${scannedReceiptResult.vendor} (Scanned)`,
      category: scannedReceiptResult.category,
      amount: scannedReceiptResult.amount,
      date: new Date().toISOString().split('T')[0]
    };
    setBusinessExpenses(prev => [newExpense, ...prev]);
    triggerToast(`📉 Scanned receipt approved! $${scannedReceiptResult.amount} expense added.`);
    setScannedReceiptResult(null);
    setReceiptScanModalOpen(false);
  };

  // --- Add Manual Business Transaction ---
  const handleAddBizTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizTxTitle.trim() || !bizTxClientOrCategory.trim() || !bizTxAmount || parseFloat(bizTxAmount) <= 0) {
      triggerToast("⚠️ Please enter a valid description, category/client, and positive numerical amount.");
      return;
    }
    const amt = parseFloat(bizTxAmount);
    if (newBizTxType === 'sale') {
      const newSale = {
        id: `s_${Date.now()}`,
        client: bizTxClientOrCategory,
        title: bizTxTitle,
        amount: amt,
        date: bizTxDate
      };
      setBusinessSales(prev => [newSale, ...prev]);
      triggerToast(`💰 Added manual sale of $${amt} from ${bizTxClientOrCategory}.`);
    } else {
      const newExpense = {
        id: `e_${Date.now()}`,
        title: bizTxTitle,
        category: bizTxClientOrCategory,
        amount: amt,
        date: bizTxDate
      };
      setBusinessExpenses(prev => [newExpense, ...prev]);
      triggerToast(`📉 Added manual operating expense of $${amt} for ${bizTxTitle}.`);
    }

    // Reset and close
    setBizTxTitle('');
    setBizTxClientOrCategory('');
    setBizTxAmount('');
    setNewBizTxModalOpen(false);
  };

  // --- Play/Pause Video Simulation ---
  const handleLaunchVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setVideoPlaying(true);
    setVideoProgress(15); // Start at 15% progress
    triggerToast(`🎥 Playing Tutorial: ${video.title}`);
  };

  useEffect(() => {
    let interval: any = null;
    if (videoPlaying && activeVideo) {
      interval = setInterval(() => {
        setVideoProgress(p => {
          if (p >= 100) {
            setVideoPlaying(false);
            triggerToast("🎓 Video tutorial completed!");
            return 100;
          }
          return p + 2;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [videoPlaying, activeVideo]);

  // Helper markdown parser to turn raw strings into beautiful customized JSX cards
  const parseMarkdownToJSX = (md: string) => {
    if (!md) return null;
    const lines = md.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('###')) {
        return (
          <h4 key={idx} className="text-xs font-black uppercase tracking-wider text-emerald-400 mt-4 mb-2 flex items-center space-x-1.5 border-b border-slate-800 pb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{line.replace('###', '').trim()}</span>
          </h4>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={idx} className="text-[11px] font-black text-slate-200 mt-3 uppercase tracking-wide">
            {line.replace(/\*\*/g, '').trim()}
          </p>
        );
      }
      if (line.startsWith('*') || line.startsWith('-')) {
        const clean = line.replace(/^[\*\-\s]+/, '');
        const boldMatch = clean.match(/^\*\*(.*?)\*\*(.*)/);
        if (boldMatch) {
          return (
            <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300 my-1.5 font-medium leading-relaxed">
              <span className="text-emerald-500 mt-1 select-none font-black text-xs">•</span>
              <span>
                <strong className="text-emerald-400 font-bold">{boldMatch[1]}</strong>
                {boldMatch[2]}
              </span>
            </div>
          );
        }
        return (
          <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300 my-1.5 font-medium leading-relaxed">
            <span className="text-emerald-500 mt-1 select-none font-black text-xs">•</span>
            <span>{clean}</span>
          </div>
        );
      }
      if (line.trim().length > 0) {
        return <p key={idx} className="text-[11px] text-slate-400 leading-relaxed my-1.5 font-medium">{line}</p>;
      }
      return <div key={idx} className="h-1" />;
    });
  };

  // --- Charts Data Formatting ---
  const chartData = useMemo(() => {
    // Basic bar charts trajectory
    return [
      { name: 'Jan', Inflow: 4800, Outflow: 3800 },
      { name: 'Feb', Inflow: 5400, Outflow: 4100 },
      { name: 'Mar', Inflow: 5200, Outflow: 3600 },
      { name: 'Apr', Inflow: 6100, Outflow: 4400 },
      { name: 'May', Inflow: 5800, Outflow: 3900 },
      { name: 'Jun', Inflow: 6500, Outflow: 4600 },
      { name: 'Jul', Inflow: stats.totalIncome, Outflow: stats.totalExpense },
    ];
  }, [stats]);

  const businessChartData = useMemo(() => {
    return [
      { name: 'Jan', Sales: 38000, Expenses: 14000, Profit: 24000 },
      { name: 'Feb', Sales: 42000, Expenses: 18000, Profit: 24000 },
      { name: 'Mar', Sales: 40000, Expenses: 16000, Profit: 24000 },
      { name: 'Apr', Sales: 55000, Expenses: 22000, Profit: 33000 },
      { name: 'May', Sales: 62000, Expenses: 25000, Profit: 37000 },
      { name: 'Jun', Sales: 78000, Expenses: 28000, Profit: 50000 },
      { name: 'Jul', Sales: businessStats.sales, Expenses: businessStats.expenses, Profit: businessStats.profit },
    ];
  }, [businessStats]);

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 font-sans overflow-y-auto pb-24 relative select-none">
      {/* Toast Notifier */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 border border-slate-700/80 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-semibold text-slate-100 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MATERIAL DESIGN TOP APP BAR --- */}
      <header className="bg-slate-950/80 border-b border-slate-800/60 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-md">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            {dashboardMode === 'business' ? (
              <Layers className="w-6 h-6 text-white" />
            ) : (
              <DollarSign className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider leading-none">
              {dashboardMode === 'business' ? 'Box Technologies' : 'FinFlow Pro'}
            </h2>
            <p className="text-[10px] text-emerald-400 font-extrabold tracking-widest mt-1">
              {dashboardMode === 'business' ? 'CORPORATE B2B SUITE' : 'MD3 WEALTH COGNITION'}
            </p>
          </div>
        </div>

        {/* Dynamic Global Search in App Bar */}
        <div className="hidden md:flex relative max-w-xs w-full mx-4">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              dashboardMode === 'business' 
                ? "Search sales or expense ledgers..." 
                : "Search transaction description..."
            }
            className="w-full bg-slate-900/60 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-200 outline-hidden focus:ring-1 focus:ring-emerald-500/35 focus:border-emerald-500/40 transition-all placeholder:text-slate-600 font-semibold"
          />
        </div>

        {/* Utilities & Personalized Greeting */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-200">
              {dashboardMode === 'business' ? 'Box Technologies HQ' : 'Good afternoon, Felix!'}
            </p>
            <p className="text-[9px] text-slate-400 font-medium">fzinyenge@gmail.com</p>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:bg-slate-800 text-slate-300 relative transition-all"
            >
              <Bell className="w-4 h-4" />
              {systemNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center animate-pulse">
                  {systemNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-3 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-2 z-50 max-h-96 overflow-y-auto"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/80 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quick Alerts ({systemNotifications.length})</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-200 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setDashboardMode('notifications');
                      setShowNotifications(false);
                      triggerToast("🔔 Opened Notification Center Workspace.");
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer mb-2"
                  >
                    <Bell className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Open Full Notification Center</span>
                  </button>

                  {systemNotifications.map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10.5px] leading-relaxed">
                      {item.text}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => {
              setDashboardMode('personal_profile');
              triggerToast("👤 Opened Personal Profile Workspace.");
            }}
            className="w-8 h-8 rounded-full border border-emerald-500/50 bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-inner select-none cursor-pointer transition-all"
            title="View Personal Profile"
          >
            FZ
          </button>
        </div>
      </header>

      {/* --- WORKSPACE SUB-BAR WITH MODE TOGGLE & STATUS --- */}
      <div className="bg-slate-950/60 border-b border-slate-800/50 px-6 py-3.5 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Beautiful Segmented Mode Controller */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setDashboardMode('onboarding');
              triggerToast("✨ Launched Interactive Onboarding Experience.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'onboarding'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 text-slate-950 font-black shadow-md'
                : 'text-emerald-400 hover:text-emerald-300 font-extrabold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Interactive Onboarding</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('release_launch');
              triggerToast("🚀 Opened Store Release & Launch Hub.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'release_launch'
                ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 fill-slate-950" />
            <span>Store Release & Launch</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('devops');
              triggerToast("🚀 Opened DevOps CI/CD Pipeline Hub.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'devops'
                ? 'bg-indigo-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>DevOps Pipeline</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('monitoring');
              triggerToast("📊 Opened System Monitoring & Telemetry Hub.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'monitoring'
                ? 'bg-rose-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>System Monitoring</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('localization');
              triggerToast("🌍 Opened International Localization & FX Hub.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'localization'
                ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Localization & FX</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('import_export');
              triggerToast("📥 Opened Data Import & Export Engine.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'import_export'
                ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import & Export</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('offline_sync');
              triggerToast("📡 Opened Offline Persistence & Sync Engine.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'offline_sync'
                ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Offline Sync</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('monetization');
              triggerToast("💳 Opened Monetization & Billing Engine.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'monetization'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & Billing</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('verification');
              triggerToast("🛡️ Opened Official Verification System.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'verification'
                ? 'bg-blue-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verification System</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('goal_tracking');
              triggerToast("🎯 Opened Goal Tracking & Gamification Hub.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'goal_tracking'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Goal Tracking & Gamification</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('rec_engine');
              triggerToast("⚡ Opened MintStep ML Recommendation Engine.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'rec_engine'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ML Recommendation Engine</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('book_recommendations');
              triggerToast("📚 Opened AI Book Recommendations.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'book_recommendations'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Book Recommendations</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('advisor_mentee');
              triggerToast("🎓 Opened Advisor & Mentee Network.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'advisor_mentee'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Advisors & Mentees</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('multi_biz');
              triggerToast("🏢 Opened Multi-Business Organization Manager.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'multi_biz'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Organizations</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('pos');
              triggerToast("🛒 Loaded MintStep POS Register Terminal.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'pos'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>POS Register</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('invoices');
              triggerToast("🧾 Loaded Invoices & Quotations Hub Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'invoices'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Invoices & Quotes</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('tax_calc');
              triggerToast("🏛️ Loaded AI Multi-Jurisdiction Tax Calculator.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'tax_calc'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>AI Tax Calculator</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('receipt_ocr');
              triggerToast("📷 Loaded AI Receipt OCR & Expense Scanner Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'receipt_ocr'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Receipt OCR Scanner</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('deploy_prod');
              triggerToast("🚀 Loaded Production Deployment Hub Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'deploy_prod'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Store Release Hub</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('testing');
              triggerToast("🧪 Loaded QA & Automated Test Suite Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'testing'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Automated Tests</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('opt_suite');
              triggerToast("⚡ Loaded Performance Optimization Suite Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'opt_suite'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Optimization Suite</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('security');
              triggerToast("🛡️ Loaded Security & Governance Suite Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'security'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Suite</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('metrics');
              triggerToast("📊 Loaded Interactive Metrics Dashboard Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'metrics'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Interactive Dashboard</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('reports');
              triggerToast("📄 Loaded Executive Report Generator Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'reports'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Reports</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('notifications');
              triggerToast("🔔 Loaded Realtime Notification Center Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'notifications'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5 fill-current" />
            <span>Notification Center</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('personal_profile');
              triggerToast("👤 Loaded Personal Profile Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'personal_profile'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal Profile</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('profile');
              triggerToast("🏢 Loaded Business Profile Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'profile'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Business Profile</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('personal');
              triggerToast("💼 Loaded Personal Wealth Portfolio Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'personal'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Personal Portfolio</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('business');
              triggerToast("🏢 Loaded Box Technologies Corporate Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              dashboardMode === 'business'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Box Technologies (Business)</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('inventory');
              triggerToast("📦 Loaded Enterprise Inventory Management Workspace.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
              dashboardMode === 'inventory'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Inventory Suite (Enterprise)</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('shorts');
              triggerToast("🎥 Loaded Live AI Advisor Video Briefs Feed.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
              dashboardMode === 'shorts'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Advisor Shorts (New)</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('studio');
              triggerToast("🎨 Loaded Enterprise Advisor Creator Studio.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
              dashboardMode === 'studio'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Creator Studio (Business)</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('assistant');
              triggerToast("🧠 Loaded AI Wealth and CFO Assistant Chat.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
              dashboardMode === 'assistant'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('insights');
              triggerToast("📈 Loaded CFO Intelligent Reports Suite.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
              dashboardMode === 'insights'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-emerald-400" />
            <span>CFO Intelligence</span>
          </button>
          <button
            onClick={() => {
              setDashboardMode('communities');
              triggerToast("🌐 Loaded Sovereign Communities Stream.");
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
              dashboardMode === 'communities'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Communities</span>
          </button>
        </div>

        {/* Sync node statuses */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-semibold bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-850">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {dashboardMode === 'business' 
                ? "Enterprise Core API Node active" 
                : "MD3 Compliant Financial Ledger and Wealth Compiler Node ready"}
            </span>
          </div>

          {/* Online status indicator */}
          <button
            onClick={toggleNetworkMode}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-extrabold transition-all ${
              isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Sync Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span>Offline Safe Mode</span>
              </>
            )}
          </button>

          {/* Force Sync queue items */}
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-[10px] font-extrabold text-slate-300 disabled:opacity-50 transition-all"
          >
            <Database className="w-3 h-3 text-blue-400" />
            <span>Sync ({syncQueue.length})</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {dashboardMode === 'onboarding' ? (
          <OnboardingFlow 
            onComplete={(prefs) => {
              triggerToast(`🎉 Welcome to MintStep, ${prefs.fullName || 'User'}! Launching your ${prefs.accountType} dashboard.`);
              setDashboardMode(prefs.accountType === 'BUSINESS' ? 'business' : 'personal');
            }}
            onSkip={() => {
              triggerToast("Skipped onboarding. Navigating to Release & Launch Hub.");
              setDashboardMode('release_launch');
            }}
          />
        ) : dashboardMode === 'release_launch' ? (
          <ReleaseLaunchHub />
        ) : dashboardMode === 'devops' ? (
          <DevOpsPipelineHub />
        ) : dashboardMode === 'monitoring' ? (
          <AppMonitoringHub />
        ) : dashboardMode === 'localization' ? (
          <LocalizationHub />
        ) : dashboardMode === 'import_export' ? (
          <DataImportExport />
        ) : dashboardMode === 'offline_sync' ? (
          <OfflineSyncEngine />
        ) : dashboardMode === 'monetization' ? (
          <MonetizationHub />
        ) : dashboardMode === 'verification' ? (
          <VerificationSystem />
        ) : dashboardMode === 'goal_tracking' ? (
          <GoalTrackingGamification />
        ) : dashboardMode === 'rec_engine' ? (
          <MintStepRecommendationEngine />
        ) : dashboardMode === 'book_recommendations' ? (
          <BookRecommendations />
        ) : dashboardMode === 'advisor_mentee' ? (
          <AdvisorMenteeNetwork />
        ) : dashboardMode === 'multi_biz' ? (
          <MultiBusinessManager />
        ) : dashboardMode === 'pos' ? (
          <PointOfSaleSystem />
        ) : dashboardMode === 'invoices' ? (
          <InvoiceQuotationModule />
        ) : dashboardMode === 'tax_calc' ? (
          <AiTaxCalculator />
        ) : dashboardMode === 'receipt_ocr' ? (
          <ReceiptOcrScanner />
        ) : dashboardMode === 'deploy_prod' ? (
          <ProductionDeploymentCenter />
        ) : dashboardMode === 'testing' ? (
          <TestingSuite />
        ) : dashboardMode === 'opt_suite' ? (
          <OptimizationSuite />
        ) : dashboardMode === 'security' ? (
          <SecurityCenter />
        ) : dashboardMode === 'metrics' ? (
          <InteractiveMetricsDashboard />
        ) : dashboardMode === 'reports' ? (
          <ReportGenerator />
        ) : dashboardMode === 'notifications' ? (
          <NotificationCenter onNavigateMode={(mode) => setDashboardMode(mode as any)} />
        ) : dashboardMode === 'personal_profile' ? (
          <PersonalProfile />
        ) : dashboardMode === 'profile' ? (
          <BusinessProfile />
        ) : dashboardMode === 'communities' ? (
          <WealthCommunities />
        ) : dashboardMode === 'studio' ? (
          <CreatorStudio />
        ) : dashboardMode === 'shorts' ? (
          <ShortsFeed />
        ) : dashboardMode === 'inventory' ? (
          <InventoryManager />
        ) : dashboardMode === 'assistant' ? (
          <WealthAssistant
            transactions={transactions}
            budgets={budgets}
            savingsGoals={savingsGoals}
            businessSales={businessSales}
            businessExpenses={businessExpenses}
            businessInventory={businessInventory}
            businessStats={businessStats}
          />
        ) : dashboardMode === 'insights' ? (
          <CFOIntelligence
            transactions={transactions}
            budgets={budgets}
            savingsGoals={savingsGoals}
            businessSales={businessSales}
            businessExpenses={businessExpenses}
            businessInventory={businessInventory}
            businessStats={businessStats}
          />
        ) : dashboardMode === 'business' ? (
          /* =========================================================================
             ==================== BOX TECHNOLOGIES BUSINESS DASHBOARD ================
             ========================================================================= */
          <>
            {/* --- SNAPSHOT GRID (6 CARDS: Profit, Sales, Expenses, Inventory, Cash Flow, Tax) --- */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Gross Sales */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Gross Sales</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-lg sm:text-xl font-black text-slate-100">${businessStats.sales.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[9px] text-emerald-400 mt-3 flex items-center space-x-1 font-extrabold">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{businessSales.length} contracts</span>
                </div>
              </div>

              {/* Operating Expenses */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-rose-500/20 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Operating Expenses</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-lg sm:text-xl font-black text-rose-400">${businessStats.expenses.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 mt-3 flex items-center space-x-1 font-medium">
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                  <span>Hardware & Cloud costs</span>
                </div>
              </div>

              {/* Net Profit */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Net Profit</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-lg sm:text-xl font-black text-emerald-400">${businessStats.profit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[9px] text-emerald-400 mt-3 flex items-center space-x-1 font-extrabold">
                  <Percent className="w-3 h-3" />
                  <span>
                    {(businessStats.sales > 0 ? ((businessStats.profit / businessStats.sales) * 100).toFixed(0) : 0)}% Operating Margin
                  </span>
                </div>
              </div>

              {/* Hardware Inventory */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-blue-500/20 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Hardware Inventory</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-lg sm:text-xl font-black text-blue-400">${businessStats.inventory.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[9px] text-blue-400 mt-3 flex items-center space-x-1 font-extrabold">
                  <Layers className="w-3 h-3" />
                  <span>{businessInventory.reduce((sum, i) => sum + i.quantity, 0)} units total</span>
                </div>
              </div>

              {/* Cash Flow */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-violet-500/20 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Liquid Cash Flow</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-lg sm:text-xl font-black text-violet-400">${businessStats.cashFlow.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[9px] text-violet-400 mt-3 flex items-center space-x-1 font-extrabold">
                  <Database className="w-3 h-3" />
                  <span>High liquidity reserve</span>
                </div>
              </div>

              {/* Tax Liability */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-amber-500/20 transition-all">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Estimated Tax Prov.</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-lg sm:text-xl font-black text-amber-400">${businessStats.tax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[9px] text-amber-500 mt-3 flex items-center space-x-1 font-extrabold">
                  <Activity className="w-3 h-3" />
                  <span>21% Corporate Accrued</span>
                </div>
              </div>

            </div>

            {/* --- BUSINESS QUICK ACTIONS --- */}
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-3xl space-y-2.5 shadow-sm">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block px-1">Corporate Quick Commands</span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setNewBizTxType('sale');
                    setBizTxTitle('');
                    setBizTxClientOrCategory('');
                    setBizTxAmount('');
                    setNewBizTxModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Add Sale</span>
                </button>

                <button
                  onClick={() => {
                    setNewBizTxType('expense');
                    setBizTxTitle('');
                    setBizTxClientOrCategory('');
                    setBizTxAmount('');
                    setNewBizTxModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Add Expense</span>
                </button>

                <button
                  onClick={() => setInvoiceModalOpen(true)}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice Client</span>
                </button>

                <button
                  onClick={() => {
                    setScannedReceiptResult(null);
                    setReceiptScanModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 text-violet-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Scan Receipt</span>
                </button>

                <button
                  onClick={handleGetBusinessAIInsights}
                  disabled={isGeneratingBizInsights}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-blue-500/15 hover:from-emerald-500/25 hover:to-blue-500/25 border border-emerald-500/35 text-emerald-400 text-xs font-extrabold transition-all transform active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span>{isGeneratingBizInsights ? 'Consulting Chief AI Advisor...' : 'CFO AI Insights'}</span>
                </button>
              </div>
            </div>

            {/* --- BENTO GRID FOR BUSINESS (SPLIT 2 COLUMNS) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Bento Column (7 spans) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* GEMINI CORPORATE AI INSIGHTS PANEL */}
                <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl shadow-lg relative overflow-hidden group">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        <span>Box Technologies Strategic CFO Advisor</span>
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold">Gemini 3.5 High-Performance Business Advisory</p>
                    </div>
                    <button
                      onClick={handleGetBusinessAIInsights}
                      disabled={isGeneratingBizInsights}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md hover:bg-emerald-600 transition-all active:scale-98 disabled:opacity-50 flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGeneratingBizInsights ? 'animate-spin' : ''}`} />
                      <span>Optimize</span>
                    </button>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl min-h-[140px] font-sans">
                    {isGeneratingBizInsights ? (
                      <div className="space-y-3 py-4">
                        <div className="flex items-center space-x-2 text-xs text-slate-400 animate-pulse font-semibold">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Gemini is compiling supply chains, inventory valuations, and calculating R&D write-offs...</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full w-[95%] animate-pulse"></div>
                        <div className="h-3 bg-slate-800 rounded-full w-[80%] animate-pulse"></div>
                        <div className="h-3 bg-slate-800 rounded-full w-[85%] animate-pulse"></div>
                      </div>
                    ) : businessInsights ? (
                      <div className="prose prose-invert max-w-none text-slate-300">
                        {parseMarkdownToJSX(businessInsights)}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 space-y-2">
                        <Sparkles className="w-6 h-6 text-slate-700 mx-auto animate-pulse" />
                        <p className="text-xs font-semibold">No operational chief advisor report is active.</p>
                        <p className="text-[10px] text-slate-600">Click "CFO AI Insights" or the "Optimize" button to query the Gemini platform regarding tax-shelters, margin thresholds, and hardware provisions.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RECENT BUSINESS LEDGER TRANSACTIONS */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Corporate Ledgers</h3>
                      <p className="text-[10px] text-slate-500 font-semibold">Consolidated Sales & Expense audits</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                      {filteredBusinessSales.length} Sales | {filteredBusinessExpenses.length} Expenses
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {/* Sales Section */}
                    {filteredBusinessSales.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-wider text-emerald-400 px-1 border-l-2 border-emerald-500 pl-2">Contract Inflows</p>
                        {filteredBusinessSales.map(sale => (
                          <div key={sale.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 hover:bg-slate-900/60 transition-all group">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-100">{sale.title}</p>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className="text-[8.5px] text-slate-400 font-bold font-mono bg-slate-850 px-1.5 py-0.5 rounded">
                                    Client: {sale.client}
                                  </span>
                                  <span className="text-[8.5px] text-slate-500 font-semibold font-mono">{sale.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black font-mono text-emerald-400">+${sale.amount.toLocaleString()}</p>
                              <span className="text-[7.5px] font-black uppercase text-slate-500 block">Inflow</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Expenses Section */}
                    {filteredBusinessExpenses.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-[9px] font-black uppercase tracking-wider text-rose-400 px-1 border-l-2 border-rose-500 pl-2">Operating Outflows</p>
                        {filteredBusinessExpenses.map(exp => (
                          <div key={exp.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 hover:bg-slate-900/60 transition-all group">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                                <ArrowDownLeft className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-100">{exp.title}</p>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className="text-[8.5px] text-slate-400 font-bold font-mono bg-slate-850 px-1.5 py-0.5 rounded">
                                    {exp.category}
                                  </span>
                                  <span className="text-[8.5px] text-slate-500 font-semibold font-mono">{exp.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black font-mono text-rose-400">-${exp.amount.toLocaleString()}</p>
                              <span className="text-[7.5px] font-black uppercase text-slate-500 block">Outflow</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {filteredBusinessSales.length === 0 && filteredBusinessExpenses.length === 0 && (
                      <div className="text-center py-10 text-slate-500">
                        <ShieldAlert className="w-6 h-6 text-slate-700 mx-auto mb-1" />
                        <p className="text-xs font-semibold">No operational B2B logs found matching search criteria.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* BUSINESS GROWTH CHARTS */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Enterprise Trajectory (Sales vs Operating Cost vs Profit Margin)</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={businessChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                        <Bar dataKey="Sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Right Bento Column (5 spans) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* INVENTORY ALERTS CENTER */}
                {businessInventoryAlerts.length > 0 && (
                  <div className="bg-rose-950/20 border border-rose-900/60 p-4 rounded-3xl space-y-3 shadow-md animate-pulse">
                    <div className="flex items-center space-x-2 text-rose-400">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Inventory Restock Urgent Alerts ({businessInventoryAlerts.length})</span>
                    </div>
                    <div className="space-y-2">
                      {businessInventoryAlerts.map((alert, idx) => (
                        <p key={idx} className="text-[10.5px] text-slate-200 leading-relaxed font-semibold">
                          • {alert.text}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* INVENTORY CONTROL SKU MANAGER */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Inventory SKU Control</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Hardware nodes, silicon routers and microassembly units</p>
                  </div>

                  <div className="space-y-3">
                    {businessInventory.map(item => {
                      const isLow = item.quantity <= 3;
                      return (
                        <div key={item.id} className={`p-3 rounded-2xl border ${isLow ? 'bg-rose-950/10 border-rose-900/40' : 'bg-slate-900/40 border-slate-850'} flex justify-between items-center`}>
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="text-xs font-extrabold text-slate-100 truncate">{item.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[8px] font-black text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {item.sku}
                              </span>
                              <span className="text-[8.5px] text-slate-400 font-semibold">
                                Cost: ${item.cost} | MSRP: ${item.price}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right">
                              <p className={`text-xs font-black font-mono ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {item.quantity} units
                              </p>
                              <span className="text-[7.5px] font-extrabold uppercase text-slate-500 block">Stock Level</span>
                            </div>

                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => {
                                  setBusinessInventory(prev => prev.map(inv => inv.id === item.id ? { ...inv, quantity: inv.quantity + 10 } : inv));
                                  triggerToast(`📦 Restocked 10 units for "${item.name}"`);
                                }}
                                className="text-[8.5px] font-black text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                              >
                                +10
                              </button>
                              <button
                                onClick={() => {
                                  if (item.quantity === 0) return;
                                  setBusinessInventory(prev => prev.map(inv => inv.id === item.id ? { ...inv, quantity: Math.max(0, inv.quantity - 1) } : inv));
                                  triggerToast(`📦 Decremented 1 unit of "${item.name}" due to shipment.`);
                                }}
                                className="text-[8.5px] font-black text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                              >
                                -1
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CURATED ENTERPRISE GUIDES */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Corporate Scale Education</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Chief executive planning, B2B SaaS write-offs and hardware scale</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'vbiz1',
                        title: 'B2B Enterprise SaaS Agreements & Licensing Models',
                        description: 'How Box Technologies can design custom subscription agreements with net-30 lock-ins.',
                        duration: '14:20',
                        author: 'Box Capital Advisor',
                        views: '2.1K views',
                        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80'
                      },
                      {
                        id: 'vbiz2',
                        title: 'Capital Machinery & Depreciation Write-offs (Section 179)',
                        description: 'Strategic guide to deducting 100% of silicon wafer routers and assembly mount expenses during year 1.',
                        duration: '9:15',
                        author: 'IRS Corporate CPA Team',
                        views: '8.4K views',
                        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
                      }
                    ].map(video => (
                      <div 
                        key={video.id}
                        onClick={() => handleLaunchVideo(video)}
                        className="group border border-slate-850 hover:border-emerald-500/30 rounded-2xl p-2.5 bg-slate-900/30 hover:bg-slate-900/60 cursor-pointer flex gap-3 transition-all transform hover:-translate-y-0.5"
                      >
                        <div className="w-24 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-950 relative shadow-inner">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-all">
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] font-black font-mono px-1 py-0.5 rounded text-slate-200">
                            {video.duration}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="text-[11px] font-black text-slate-200 leading-tight truncate group-hover:text-emerald-400 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-[9.5px] text-slate-400 font-medium leading-tight line-clamp-2 mt-1">
                              {video.description}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-500">
                            <span>{video.author}</span>
                            <span>{video.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </>
        ) : (
          /* =========================================================================
             ==================== FINFLOW PERSONAL FINANCE DASHBOARD ==================
             ========================================================================= */
          <>
            {/* --- FINANCIAL SNAPSHOT GRID (4 SMALL CARDS) --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Balance/Net Worth */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Total Net Worth</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">${stats.netWorth.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500">USD</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 mt-3 flex items-center space-x-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Checking + Savings locked</span>
                </div>
              </div>

              {/* Inflows / Income */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-slate-700 transition-all">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Monthly Revenue</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-xl sm:text-2xl font-black text-slate-100">${stats.totalIncome.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500">USD</span>
                  </div>
                </div>
                <div className="text-[9px] text-emerald-400 mt-3 flex items-center space-x-1 font-extrabold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{stats.totalIncome > 0 ? Math.round((stats.totalIncome / (stats.totalExpense || 1)) * 100) : 0}% outflow margin</span>
                </div>
              </div>

              {/* Outflows / Expenses */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-rose-500/20 transition-all">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Total Outflows</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-xl sm:text-2xl font-black text-rose-400">${stats.totalExpense.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500">USD</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 mt-3 flex items-center space-x-1 font-medium">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  <span>Rent represents the majority</span>
                </div>
              </div>

              {/* Savings / Compounding */}
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-blue-500/20 transition-all">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Compounded Savings</span>
                  <div className="mt-2 flex items-baseline space-x-1 font-mono">
                    <span className="text-xl sm:text-2xl font-black text-blue-400">${stats.totalSavings.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-500">VAL</span>
                  </div>
                </div>
                <div className="text-[9px] text-blue-400 mt-3 flex items-center space-x-1 font-extrabold">
                  <Percent className="w-3 h-3" />
                  <span>Competing dynamic assets active</span>
                </div>
              </div>

            </div>

            {/* --- QUICK ACTION BUTTONS (TONAL INTERACTIVE CHIPS) --- */}
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-3xl space-y-2.5 shadow-sm">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block px-1">Ledger Quick Commands</span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setNewTxType('expense');
                    setShowFABModal(true);
                  }}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Post Outflow</span>
                </button>

                <button
                  onClick={() => {
                    setNewTxType('income');
                    setShowFABModal(true);
                  }}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Post Inflow</span>
                </button>

                <button
                  onClick={handleSimulateMarketVolatility}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-400 text-xs font-extrabold transition-all transform active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rebalance Holdings</span>
                </button>

                <button
                  onClick={handleGetAIInsights}
                  disabled={isGeneratingInsights}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold transition-all transform active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span>{isGeneratingInsights ? 'Consulting Gemini...' : 'Query Gemini Insights'}</span>
                </button>
              </div>
            </div>

            {/* --- MAIN PAGE BENTO GRID (SPLIT 2 COLUMNS) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT BENTO BLOCK (AI INSIGHTS & RECENT TRANSACTIONS) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* GEMINI AI INSIGHTS ADVISOR PANEL */}
                <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl shadow-lg relative overflow-hidden group">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        <span>Gemini Portfolio Insights Advisor</span>
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold">Server-side algorithmic wealth planning analysis</p>
                    </div>
                    <button
                      onClick={handleGetAIInsights}
                      disabled={isGeneratingInsights}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md hover:bg-emerald-600 transition-all active:scale-98 disabled:opacity-50 flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                      <span>Update</span>
                    </button>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl min-h-[140px] font-sans">
                    {isGeneratingInsights ? (
                      <div className="space-y-3 py-4">
                        <div className="flex items-center space-x-2 text-xs text-slate-400 animate-pulse font-semibold">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Gemini is compiling your cash flows and analyzing savings indexes...</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full w-[90%] animate-pulse"></div>
                        <div className="h-3 bg-slate-800 rounded-full w-[75%] animate-pulse"></div>
                        <div className="h-3 bg-slate-800 rounded-full w-[80%] animate-pulse"></div>
                      </div>
                    ) : aiInsights ? (
                      <div className="prose prose-invert max-w-none text-slate-300">
                        {parseMarkdownToJSX(aiInsights)}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 space-y-2">
                        <Sparkles className="w-6 h-6 text-slate-700 mx-auto animate-pulse" />
                        <p className="text-xs font-semibold">No active analysis loaded.</p>
                        <p className="text-[10px] text-slate-600">Click the action button above to prompt Gemini AI to examine your checking, savings, and investments.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RECENT TRANSACTIONS LEDGER LIST */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Recent Transactions</h3>
                      <p className="text-[10px] text-slate-500 font-semibold">Real-time ledger audit trails</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                        Showing {filteredTransactions.length} of {transactions.length}
                      </span>
                    </div>
                  </div>

                  {/* Mobile-friendly responsive list */}
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(t => (
                        <div 
                          key={t.id} 
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 hover:bg-slate-900/60 transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-100">{t.title}</p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[8.5px] text-slate-400 font-semibold font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                                  {t.category}
                                </span>
                                <span className="text-[8.5px] text-slate-500 font-medium font-mono">{t.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 text-right">
                            <div>
                              <p className={`text-xs font-black font-mono ${
                                t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                              </p>
                              <span className="text-[7.5px] font-black uppercase text-slate-500 block">
                                {t.isPendingSync ? 'Offline Queue' : 'Synced'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteTransaction(t.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all transform active:scale-90"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-500">
                        <ShieldAlert className="w-6 h-6 text-slate-700 mx-auto mb-1" />
                        <p className="text-xs font-semibold">No transaction records matching filter parameters.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CASH FLOW GRAPH TRAJECTORY */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">6-Month Inflow vs Outflow</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                        <Bar dataKey="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* RIGHT BENTO BLOCK (PROACTIVE BUDGETS & CURATED VIDEOS) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* PROACTIVE BUDGET LIMIT WARNINGS */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Budget Limit Warning Center</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Interactive alerts automatically generated by active outflow ledgers</p>
                  </div>

                  <div className="space-y-3">
                    {budgets.map(b => {
                      const pct = Math.min((b.spentAmount / b.limitAmount) * 100, 100);
                      const isExceeded = b.spentAmount > b.limitAmount;
                      const isWarning = pct >= 80 && !isExceeded;

                      return (
                        <div key={b.id} className="space-y-1.5 p-3 rounded-2xl bg-slate-900/30 border border-slate-850">
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="font-extrabold flex items-center gap-1.5 text-slate-200">
                              {b.category} Budget
                              {isExceeded && (
                                <span className="text-[7.5px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full animate-pulse uppercase">
                                  Exceeded
                                </span>
                              )}
                              {!isExceeded && isWarning && (
                                <span className="text-[7.5px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase">
                                  Nearing Cap
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-slate-400 font-extrabold text-[10px]">
                              ${b.spentAmount.toLocaleString()} / ${b.limitAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[8.5px] font-black text-slate-500">
                            <span>{pct.toFixed(0)}% Utilized</span>
                            <span>{isExceeded ? 'Limit Overflow' : `$${(b.limitAmount - b.spentAmount).toLocaleString()} Available`}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CURATED WEALTH VIDEOS & EDUCATION */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Recommended Wealth Education</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Proportional video guides for master budgeting</p>
                  </div>

                  <div className="space-y-3">
                    {recommendedVideos.map(video => (
                      <div 
                        key={video.id}
                        onClick={() => handleLaunchVideo(video)}
                        className="group border border-slate-850 hover:border-emerald-500/30 rounded-2xl p-2.5 bg-slate-900/30 hover:bg-slate-900/60 cursor-pointer flex gap-3 transition-all transform hover:-translate-y-0.5"
                      >
                        {/* Video Thumbnail Wrapper */}
                        <div className="w-24 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-950 relative shadow-inner">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          {/* Play overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-all">
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </div>
                          {/* Duration Tag */}
                          <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] font-black font-mono px-1 py-0.5 rounded text-slate-200">
                            {video.duration}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="text-[11px] font-black text-slate-200 leading-tight truncate group-hover:text-emerald-400 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-[9.5px] text-slate-400 font-medium leading-tight line-clamp-2 mt-1">
                              {video.description}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-500">
                            <span>{video.author}</span>
                            <span>{video.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECURED SAVINGS GOALS PROGRESS DETAILS */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Locked Savings Goals</h3>
                      <p className="text-[10px] text-slate-500 font-semibold">Automatic compounded asset preservation</p>
                    </div>
                    <span className="text-[9.5px] font-black text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                      ${stats.totalSavings.toLocaleString()} Saved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {savingsGoals.map(goal => {
                      const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                      return (
                        <div key={goal.id} className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-2xl flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-xs font-black text-slate-100 truncate">{goal.title}</h4>
                              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                                {goal.category}
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <p className="text-xs font-black text-slate-200">${goal.currentAmount.toLocaleString()}</p>
                              <p className="text-[8.5px] font-semibold text-slate-500">of ${goal.targetAmount.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="space-y-1.5 mt-2">
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8.5px] text-slate-400 font-bold">{pct.toFixed(0)}% Completed</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleAddSavingsDeposit(goal.id, 250)}
                                  className="text-[8.5px] font-black text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded cursor-pointer transition-all"
                                >
                                  + $250
                                </button>
                                <button
                                  onClick={() => handleAddSavingsDeposit(goal.id, 1000)}
                                  className="text-[8.5px] font-black text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded cursor-pointer transition-all"
                                >
                                  + $1k
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

      </div>

      {/* --- FLOATING ACTION BUTTON (FAB) --- */}
      <button
        onClick={() => {
          setNewTxType('expense');
          setShowFABModal(true);
        }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 text-white rounded-full flex items-center justify-center shadow-2xl transition-all transform duration-200 cursor-pointer"
        title="Add Cashflow Outflow"
      >
        <PlusCircle className="w-7 h-7" />
      </button>

      {/* --- BOTTOM SHEET / DIALOG FORM MODAL --- */}
      <AnimatePresence>
        {showFABModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">Record Dynamic Transaction</h3>
                <button 
                  onClick={() => setShowFABModal(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Type toggle */}
                <div className="flex bg-slate-900 rounded-xl p-0.5 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setNewTxType('expense')}
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                      newTxType === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Outflow (Expense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTxType('income')}
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                      newTxType === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Inflow (Income)
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider block">Description</label>
                  <input
                    type="text"
                    required
                    value={newTxTitle}
                    onChange={(e) => setNewTxTitle(e.target.value)}
                    placeholder="e.g. AWS Cloud Services"
                    className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-emerald-500/50 focus:outline-hidden p-2.5 rounded-xl text-slate-100 placeholder:text-slate-600 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider block">Amount ($)</label>
                    <input
                      type="number"
                      required
                      value={newTxAmount}
                      onChange={(e) => setNewTxAmount(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-emerald-500/50 focus:outline-hidden p-2.5 rounded-xl text-slate-100 placeholder:text-slate-600 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider block">Category</label>
                    <select
                      value={newTxCategory}
                      onChange={(e) => setNewTxCategory(e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-800 focus:border-emerald-500/50 p-2.5 rounded-xl focus:outline-hidden text-slate-200 font-semibold"
                    >
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance consultancy</option>
                      <option value="Rent">Rent lease</option>
                      <option value="Food">Food / Groceries</option>
                      <option value="Transport">Transport charging</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities & server cost</option>
                      <option value="Investments">Investments</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer mt-4"
                >
                  Confirm Ledger Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- IMMERSIVE VIDEO PLAYER MODAL SIMULATOR --- */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-4 space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Wealth Tutorial Player</span>
                </div>
                <button 
                  onClick={() => {
                    setActiveVideo(null);
                    setVideoPlaying(false);
                  }} 
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated Screen */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-850 relative flex flex-col justify-between p-4 shadow-inner">
                {/* Animated visual ripples on play */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-0"></div>
                
                {/* Dynamic Content Overlay */}
                <div className="z-10 flex justify-between items-start">
                  <div className="bg-slate-950/80 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-emerald-400">
                    {activeVideo.author}
                  </div>
                  <span className="bg-rose-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full animate-pulse">
                    Live Training Simulation
                  </span>
                </div>

                {/* Simulated sound waves visualization */}
                <div className="z-10 flex items-center justify-center py-6 h-28">
                  {videoPlaying ? (
                    <div className="flex items-end space-x-1.5 h-14">
                      {[...Array(14)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 bg-emerald-500 rounded-full animate-bounce"
                          style={{ 
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.6 + Math.random() * 0.4}s`
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <button 
                      onClick={() => setVideoPlaying(true)}
                      className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </button>
                  )}
                </div>

                {/* Controls and Title */}
                <div className="z-10 space-y-2">
                  <div className="text-slate-200">
                    <h4 className="text-xs font-black tracking-wide leading-tight truncate">{activeVideo.title}</h4>
                    <p className="text-[9.5px] text-slate-400 line-clamp-1 mt-0.5">{activeVideo.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-slate-950/80 rounded-full overflow-hidden cursor-pointer relative">
                      <div className="h-full bg-emerald-500" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-400 font-extrabold">
                      <span>{Math.floor((videoProgress / 100) * 12)}:{String(Math.floor(((videoProgress / 100) * 12 * 60) % 60)).padStart(2, '0')}</span>
                      <span>{activeVideo.duration}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setVideoPlaying(!videoPlaying)}
                        className="p-1 rounded text-slate-300 hover:text-white"
                      >
                        {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <div className="flex items-center space-x-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={videoVolume} 
                          onChange={(e) => setVideoVolume(Number(e.target.value))}
                          className="w-12 h-1 accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer" 
                        />
                      </div>
                    </div>

                    <span className="text-[8.5px] font-black uppercase text-slate-400">
                      ✓ Compounding Lecture Complete
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
