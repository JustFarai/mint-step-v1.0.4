import React, { useState, useEffect } from 'react';
import { 
  Smartphone, RotateCw, Activity, Flame, Navigation, Wifi, RefreshCw, 
  Sun, Moon, Cloud, CheckCircle, Shield, Mail, Lock, Fingerprint, LogOut,
  User, Briefcase, Check, Home, Compass, Plus, Users, Sparkles, ArrowLeft, 
  Award, Heart, Share2, PlusCircle, Trophy, TrendingUp, TrendingDown,
  Wallet, DollarSign, Percent, AlertCircle, Calendar, PiggyBank,
  ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceState } from '../types';

export default function DeviceSimulator() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'account-selection' | 'dashboard'>('splash');
  const [state, setState] = useState<DeviceState>({
    stepsCount: 4200,
    goal: 10000,
    calories: 168.0,
    distance: 3.15,
    isSynced: false,
    themeMode: 'light',
    isSyncing: false,
    accountType: null,
    userEmail: ''
  });

  const [simulatedApp, setSimulatedApp] = useState<'mintstep' | 'finflow'>('mintstep');

  // Simulated Mobile Finance Data
  const [finTxList, setFinTxList] = useState([
    { id: 1, type: 'expense', category: 'Food & Dining', amount: 42.50, description: 'Saffron Cafe Dinner', date: '2026-07-21' },
    { id: 2, type: 'income', category: 'Salary', amount: 3500.00, description: 'MintStep Payroll Corp', date: '2026-07-20' },
    { id: 3, type: 'expense', category: 'Transport', amount: 18.00, description: 'Metro Premium Pass', date: '2026-07-19' },
    { id: 4, type: 'expense', category: 'Housing', amount: 1200.00, description: 'Loft Suite Rental', date: '2026-07-01' },
    { id: 5, type: 'income', category: 'Investment Yield', amount: 145.20, description: 'FinFlow Bond Yield', date: '2026-07-18' },
  ]);
  
  const [finBudgets, setFinBudgets] = useState<Record<string, { spent: number; limit: number }>>({
    'Food & Dining': { spent: 210, limit: 500 },
    'Transport': { spent: 68, limit: 200 },
    'Housing': { spent: 1200, limit: 1200 },
    'Entertainment': { spent: 140, limit: 300 },
  });

  const [finSavingsGoals, setFinSavingsGoals] = useState([
    { id: 1, name: 'Model 3 Downpayment', target: 8000, current: 4850, deadline: 'Dec 2026' },
    { id: 2, name: 'Emergency Liquid Fund', target: 15000, current: 12000, deadline: 'Sep 2026' },
  ]);

  const [finDebts, setFinDebts] = useState([
    { id: 1, name: 'Education Loan Tier-1', total: 24000, remaining: 14200, rate: '4.2%' },
    { id: 2, name: 'Premium Visa Card', total: 5000, remaining: 850, rate: '14.9%' },
  ]);

  const [finInvestments, setFinInvestments] = useState([
    { id: 1, symbol: 'DART', name: 'Dart Core ETF', shares: 45, avgPrice: 112, currentPrice: 128.40 },
    { id: 2, symbol: 'MINT', name: 'MintStep Labs', shares: 120, avgPrice: 12.5, currentPrice: 15.80 },
    { id: 3, symbol: 'FLTR', name: 'Flutter Tech Yield', shares: 25, avgPrice: 240, currentPrice: 232.10 },
  ]);

  // FinFlow Quick add transaction state
  const [quickTxType, setQuickTxType] = useState<'income' | 'expense'>('expense');
  const [quickTxAmount, setQuickTxAmount] = useState('');
  const [quickTxCategory, setQuickTxCategory] = useState('Food & Dining');
  const [quickTxDesc, setQuickTxDesc] = useState('');

  const [notification, setNotification] = useState<string | null>(null);
  
  // Login fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Account Type selection states
  const [selectedType, setSelectedType] = useState<'personal' | 'business' | null>(null);
  const [savingAccountType, setSavingAccountType] = useState(false);

  // Tab Navigation states
  const [activeTab, setActiveTab] = useState<'home' | 'for-you' | 'create' | 'community' | 'profile'>('home');
  const [navigationHistory, setNavigationHistory] = useState<('home' | 'for-you' | 'create' | 'community' | 'profile')[]>(['home']);

  // Gamification & Balance states
  const [walletBalance, setWalletBalance] = useState<number>(350); // initial balance
  const [personalChallenges, setPersonalChallenges] = useState([
    { id: '1', title: 'Morning Rise', desc: 'Walk 2,000 steps before 9 AM', reward: 50, target: 2000, completed: true, claimed: false },
    { id: '2', title: 'Cardio Burst', desc: 'Walk 5,000 steps in one go', reward: 150, target: 5000, completed: false, claimed: false },
    { id: '3', title: 'Sustained Stroll', desc: 'Reach 8,000 total daily steps', reward: 250, target: 8000, completed: false, claimed: false },
  ]);

  const [businessChallenges, setBusinessChallenges] = useState([
    { id: 'b1', title: 'Corporate Walk-a-Thon', desc: 'Earn team achievements with collective goals', multiplier: '1.2x Match', reward: 300, target: 10000, completed: false, claimed: false },
    { id: 'b2', title: 'CEO Step Duel', desc: 'Match the CEO\'s count of 11,500 steps', multiplier: '1.5x Boost', reward: 500, target: 11500, completed: false, claimed: false },
  ]);

  const [communityPosts, setCommunityPosts] = useState([
    { id: 'p1', author: 'Emily Watson', role: 'Product Manager', content: 'Morning stroll through the park was lovely! 🌳 Reached my goal before standup.', steps: 5200, likes: 12, liked: false, type: 'personal' },
    { id: 'p2', author: 'Julian Reed', role: 'Lead DevOps', content: 'Goal crushed! Now converting my steps to secure MintStep vouchers.', steps: 12400, likes: 24, liked: false, type: 'personal' },
    { id: 'p3', author: 'HR Wellness Team', role: 'Announcements', content: '💼 Corporate wellness campaign is now active! All steps matched at 1.2x today.', steps: 0, likes: 38, liked: false, type: 'business' },
    { id: 'p4', author: 'Sarah Jenkins', role: 'VP Design', content: 'Design department leading the weekly board! Let\'s keep moving!', steps: 9800, likes: 19, liked: false, type: 'business' },
  ]);

  const [communityTab, setCommunityTab] = useState<'feed' | 'leaderboard'>('feed');

  // Challenge creation form state
  const [createChallengeName, setCreateChallengeName] = useState('');
  const [createChallengeSteps, setCreateChallengeSteps] = useState('10000');
  const [createChallengeReward, setCreateChallengeReward] = useState('200');
  const [createChallengeMultiplier, setCreateChallengeMultiplier] = useState('1.2x');
  const [creatingChallenge, setCreatingChallenge] = useState(false);

  // 1. Splash Timer (Automatic 2 seconds fade into Login Screen)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Recalculate metrics when step count increases
  const handleWalk = () => {
    setState(prev => {
      const walkBonus = prev.accountType === 'business' ? 1200 : 1000; // Business has active multipliers
      const newSteps = prev.stepsCount + walkBonus;
      return {
        ...prev,
        stepsCount: newSteps,
        calories: Number((newSteps * 0.04).toFixed(1)),
        distance: Number((newSteps * 0.00075).toFixed(2)),
        isSynced: false
      };
    });
    showToast(state.accountType === 'business' 
      ? "+1,200 steps (1.2x Corporate matching active)!" 
      : "+1,000 steps taken! Saved to local secure ledger.");
  };

  const handleSync = () => {
    if (state.isSyncing) return;
    setState(prev => ({ ...prev, isSyncing: true }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        isSynced: true
      }));
      showToast("Cloud synchronized successfully! Storing in Firebase Firestore.");
    }, 1500);
  };

  // --- FINFLOW MOBILE SIMULATION ENGINE & RENDER VIEWS ---
  
  const getFinCalculatedData = () => {
    const totalIncome = finTxList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = finTxList
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Base cash is $5,000
    const currentCash = 5000.00 + totalIncome - totalExpense;

    // Total investments current value
    const totalInvestments = finInvestments.reduce((sum, s) => sum + (s.shares * s.currentPrice), 0);

    // Total debts remaining
    const totalDebts = finDebts.reduce((sum, d) => sum + d.remaining, 0);

    // Net worth = Cash + Investments - Debts
    const netWorth = currentCash + totalInvestments - totalDebts;

    return {
      totalIncome,
      totalExpense,
      currentCash,
      totalInvestments,
      totalDebts,
      netWorth
    };
  };

  const handlePostFinTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTxAmount || isNaN(Number(quickTxAmount)) || Number(quickTxAmount) <= 0) {
      showToast("Please specify a valid monetary amount.");
      return;
    }
    const amt = Number(quickTxAmount);
    const newTx = {
      id: finTxList.length + 1,
      type: quickTxType,
      category: quickTxCategory,
      amount: amt,
      description: quickTxDesc || `Simulated ${quickTxCategory}`,
      date: new Date().toISOString().split('T')[0]
    };

    setFinTxList([newTx, ...finTxList]);

    // Update category budget if expense
    if (quickTxType === 'expense') {
      setFinBudgets(prev => {
        const cat = quickTxCategory;
        const currentCat = prev[cat] || { spent: 0, limit: 300 };
        return {
          ...prev,
          [cat]: {
            ...currentCat,
            spent: currentCat.spent + amt
          }
        };
      });
    }

    setQuickTxAmount('');
    setQuickTxDesc('');
    showToast(`Logged $${amt.toLocaleString()} as ${quickTxType}!`);
    setActiveTab('home');
  };

  const handleContributeSavings = (goalId: number, amount: number) => {
    const { currentCash } = getFinCalculatedData();
    if (currentCash < amount) {
      showToast("Insufficient checking balance to transfer funds!");
      return;
    }

    const targetGoal = finSavingsGoals.find(g => g.id === goalId);
    if (!targetGoal) return;

    // Create ledger debit transaction
    const newTx = {
      id: finTxList.length + 1,
      type: 'expense' as const,
      category: 'Savings',
      amount: amount,
      description: `Savings goal: ${targetGoal.name}`,
      date: new Date().toISOString().split('T')[0]
    };

    setFinTxList([newTx, ...finTxList]);

    setFinSavingsGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, current: Math.min(g.target, g.current + amount) };
      }
      return g;
    }));

    showToast(`Deposited $${amount} into "${targetGoal.name}"!`);
  };

  const handlePayDebt = (debtId: number, amount: number) => {
    const { currentCash } = getFinCalculatedData();
    if (currentCash < amount) {
      showToast("Insufficient cash available for debt repayment!");
      return;
    }

    const targetDebt = finDebts.find(d => d.id === debtId);
    if (!targetDebt) return;

    const actualPayAmount = Math.min(targetDebt.remaining, amount);

    const newTx = {
      id: finTxList.length + 1,
      type: 'expense' as const,
      category: 'Debt Repayment',
      amount: actualPayAmount,
      description: `Paid toward ${targetDebt.name}`,
      date: new Date().toISOString().split('T')[0]
    };

    setFinTxList([newTx, ...finTxList]);

    setFinDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        return { ...d, remaining: Math.max(0, d.remaining - actualPayAmount) };
      }
      return d;
    }));

    showToast(`Paid $${actualPayAmount} to payoff "${targetDebt.name}"!`);
  };

  const handleSimulateInvestments = () => {
    setFinInvestments(prev => prev.map(stock => {
      // Fluctuate price: random delta from -4% to +7%
      const change = (Math.random() * 11 - 4) / 100;
      const newPrice = Number((stock.currentPrice * (1 + change)).toFixed(2));
      return {
        ...stock,
        currentPrice: newPrice
      };
    }));
    showToast("🔔 Portfolio synced! Real-time stocks values fluctuated.");
  };

  const handleBuyShare = (stockId: number) => {
    const stock = finInvestments.find(s => s.id === stockId);
    if (!stock) return;

    const price = stock.currentPrice;
    const { currentCash } = getFinCalculatedData();
    if (currentCash < price) {
      showToast("Insufficient checking balance to buy asset!");
      return;
    }

    const newTx = {
      id: finTxList.length + 1,
      type: 'expense' as const,
      category: 'Investments',
      amount: price,
      description: `Bought 1 share ${stock.symbol} @ $${price}`,
      date: new Date().toISOString().split('T')[0]
    };

    setFinTxList([newTx, ...finTxList]);

    setFinInvestments(prev => prev.map(s => {
      if (s.id === stockId) {
        const newShares = s.shares + 1;
        const totalCost = (s.shares * s.avgPrice) + price;
        const newAvg = Number((totalCost / newShares).toFixed(2));
        return {
          ...s,
          shares: newShares,
          avgPrice: newAvg
        };
      }
      return s;
    }));

    showToast(`Bought 1 share of ${stock.symbol}!`);
  };

  const handleSellShare = (stockId: number) => {
    const stock = finInvestments.find(s => s.id === stockId);
    if (!stock || stock.shares <= 0) {
      showToast("You do not hold any shares of this asset!");
      return;
    }

    const price = stock.currentPrice;

    const newTx = {
      id: finTxList.length + 1,
      type: 'income' as const,
      category: 'Investments',
      amount: price,
      description: `Sold 1 share ${stock.symbol} @ $${price}`,
      date: new Date().toISOString().split('T')[0]
    };

    setFinTxList([newTx, ...finTxList]);

    setFinInvestments(prev => prev.map(s => {
      if (s.id === stockId) {
        return {
          ...s,
          shares: Math.max(0, s.shares - 1)
        };
      }
      return s;
    }));

    showToast(`Liquidated 1 share of ${stock.symbol}!`);
  };

  const renderFinFlowHomeTab = () => {
    const { currentCash, totalInvestments, totalDebts, netWorth } = getFinCalculatedData();

    return (
      <div className="space-y-4">
        {/* Main Vault Card */}
        <div className="bg-slate-900 dark:bg-zinc-950 text-white p-4 rounded-3xl border border-slate-800 flex flex-col relative overflow-hidden shadow-md">
          {/* Decorative backdrop glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[7px] font-black uppercase tracking-wider text-slate-400">FinFlow Vault</span>
            <span className="text-[7px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase tracking-widest">Mobile Sync Active</span>
          </div>

          <div className="mt-2.5 relative z-10">
            <span className="text-[8.5px] text-slate-400 font-medium">Aggregate Net Worth</span>
            <h2 className="text-xl font-mono font-black tracking-tight text-white mt-0.5">
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 relative z-10">
            <div>
              <span className="text-[7.5px] text-slate-400 block">Checking Cash</span>
              <span className="text-[9.5px] font-mono font-black text-emerald-400">
                ${currentCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div>
              <span className="text-[7.5px] text-slate-400 block">Assets Holdings</span>
              <span className="text-[9.5px] font-mono font-black text-blue-400">
                ${totalInvestments.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div>
              <span className="text-[7.5px] text-slate-400 block">Debts Outstanding</span>
              <span className="text-[9.5px] font-mono font-black text-rose-400">
                ${totalDebts.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Insights Action Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className={`p-2.5 rounded-2xl border flex items-center gap-2 ${
            state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
          }`}>
            <div className="w-7 h-7 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[7.5px] text-slate-400 block">Daily Cashflow</span>
              <span className="text-[9px] font-extrabold text-emerald-500 font-mono">+14.2%</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-2xl border flex items-center gap-2 ${
            state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
          }`}>
            <div className="w-7 h-7 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[7.5px] text-slate-400 block">Budget Threshold</span>
              <span className="text-[9px] font-extrabold text-amber-500 font-mono">Safe</span>
            </div>
          </div>
        </div>

        {/* Budgets Tracker Section */}
        <div className={`p-3.5 rounded-3xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black uppercase tracking-wider">Dynamic Budgets</h3>
            <span className="text-[8px] font-bold text-slate-400 font-mono">Real-time Warning</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(finBudgets).map(([category, budgetData]) => {
              const { spent, limit } = budgetData as { spent: number; limit: number };
              const pct = Math.min(100, (spent / limit) * 100);
              const warning = pct >= 85;

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 dark:text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      {warning && <AlertCircle className="w-2.5 h-2.5 text-amber-500 animate-pulse" />}
                      {category}
                    </span>
                    <span>${spent.toLocaleString()} / ${limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        warning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Mobile Ledgers */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Recent Transactions
            </h3>
            <button 
              onClick={() => setActiveTab('create')}
              className="text-[8.5px] font-bold text-emerald-500 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add New
            </button>
          </div>

          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
            {finTxList.slice(0, 4).map(tx => (
              <div 
                key={tx.id} 
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100/50 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.type === 'income' 
                      ? 'bg-emerald-500/15 text-emerald-500' 
                      : 'bg-rose-500/15 text-rose-500'
                  }`}>
                    {tx.type === 'income' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-[9px] font-bold leading-none truncate max-w-[110px]">{tx.description}</h4>
                    <span className="text-[7.5px] text-slate-400 font-mono block mt-0.5">{tx.category} • {tx.date}</span>
                  </div>
                </div>
                <span className={`text-[9.5px] font-mono font-black ${
                  tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFinFlowForYouTab = () => {
    return (
      <div className="space-y-4">
        {/* Savings Goals Block */}
        <div className={`p-3.5 rounded-3xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className="flex items-center gap-1.5 mb-3">
            <PiggyBank className="w-4 h-4 text-emerald-500" />
            <h3 className="text-[10px] font-black uppercase tracking-wider">Savings Goals</h3>
          </div>

          <div className="space-y-3.5">
            {finSavingsGoals.map(g => {
              const pct = Math.min(100, (g.current / g.target) * 100);
              return (
                <div key={g.id} className="p-2.5 rounded-2xl border border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[10px] font-bold leading-tight">{g.name}</h4>
                      <span className="text-[7px] text-slate-400 block font-mono mt-0.5">Deadline: {g.deadline}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-500 font-mono">
                      {pct.toFixed(0)}%
                    </span>
                  </div>

                  <div className="space-y-1 mt-2">
                    <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[7px] font-bold text-slate-400 dark:text-zinc-500 font-mono">
                      <span>Saved: ${g.current.toLocaleString()}</span>
                      <span>Target: ${g.target.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-zinc-850 flex gap-1.5">
                    <button
                      onClick={() => handleContributeSavings(g.id, 50)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[8px] font-black py-1 px-1.5 rounded transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      Save +$50
                    </button>
                    <button
                      onClick={() => handleContributeSavings(g.id, 250)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[8px] font-black py-1 px-1.5 rounded transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      Save +$250
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Debt paydowns Block */}
        <div className={`p-3.5 rounded-3xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className="flex items-center gap-1.5 mb-3">
            <Percent className="w-4 h-4 text-rose-500" />
            <h3 className="text-[10px] font-black uppercase tracking-wider">Debt Payoff Tracker</h3>
          </div>

          <div className="space-y-3.5">
            {finDebts.map(d => {
              const paidAmount = d.total - d.remaining;
              const pct = Math.min(100, (paidAmount / d.total) * 100);
              return (
                <div key={d.id} className="p-2.5 rounded-2xl border border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[10px] font-bold leading-tight">{d.name}</h4>
                      <span className="text-[7.5px] text-rose-400 font-bold tracking-wider uppercase block mt-0.5 font-mono">
                        Interest Rate: {d.rate}
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold text-blue-500 font-mono">
                      {pct.toFixed(0)}% paid
                    </span>
                  </div>

                  <div className="space-y-1 mt-2">
                    <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[7px] font-bold text-slate-400 dark:text-zinc-500 font-mono">
                      <span>Outstanding: ${d.remaining.toLocaleString()}</span>
                      <span>Total Loan: ${d.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-zinc-850 flex gap-1.5">
                    <button
                      onClick={() => handlePayDebt(d.id, 100)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[8px] font-black py-1 px-1.5 rounded transition-all active:scale-95 cursor-pointer shadow-2xs border border-slate-800"
                    >
                      Pay $100
                    </button>
                    <button
                      onClick={() => handlePayDebt(d.id, 500)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[8px] font-black py-1 px-1.5 rounded transition-all active:scale-95 cursor-pointer shadow-2xs border border-slate-800"
                    >
                      Pay $500
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderFinFlowCreateTab = () => {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-3xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className="text-center py-1 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-500">
              <PlusCircle className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider">Fast Mobile Entry</h2>
            <p className="text-[9px] text-slate-400 max-w-[90%] mx-auto leading-normal mt-1">
              Add income or expenses immediately. Balances and budgets adjust instantly.
            </p>
          </div>

          <form onSubmit={handlePostFinTx} className="space-y-3">
            {/* Type Selector Toggle */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-slate-400">Flow Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuickTxType('expense');
                    setQuickTxCategory('Food & Dining');
                  }}
                  className={`py-1.5 rounded-lg text-[9px] font-black border transition-all cursor-pointer ${
                    quickTxType === 'expense'
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500 font-extrabold'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-400'
                  }`}
                >
                  Expense Out (-)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickTxType('income');
                    setQuickTxCategory('Salary');
                  }}
                  className={`py-1.5 rounded-lg text-[9px] font-black border transition-all cursor-pointer ${
                    quickTxType === 'income'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-extrabold'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-400'
                  }`}
                >
                  Income In (+)
                </button>
              </div>
            </div>

            {/* Amount & Description */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 space-y-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-slate-400">Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={quickTxAmount}
                  onChange={(e) => setQuickTxAmount(e.target.value)}
                  className="w-full text-[10px] font-mono font-black p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-emerald-500"
                />
              </div>

              <div className="col-span-8 space-y-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-slate-400">Reference Info</label>
                <input
                  type="text"
                  placeholder="Where/Why"
                  value={quickTxDesc}
                  onChange={(e) => setQuickTxDesc(e.target.value)}
                  className="w-full text-[10px] font-extrabold p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-slate-400">Bookkeeping Category</label>
              <select
                value={quickTxCategory}
                onChange={(e) => setQuickTxCategory(e.target.value)}
                className="w-full text-[10px] font-extrabold p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-emerald-500"
              >
                {quickTxType === 'expense' ? (
                  <>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Transport">Transport</option>
                    <option value="Housing">Housing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other Expenses">Other Expenses</option>
                  </>
                ) : (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Investment Yield">Investment Yield</option>
                    <option value="Cash Gift/Bonus">Cash Gift/Bonus</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold py-2 rounded-xl text-[10px] flex items-center justify-center space-x-1 transition-all mt-4 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Simulated Ledger</span>
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderFinFlowCommunityTab = () => {
    return (
      <div className="space-y-4">
        {/* Interactive Asset Trading Panel */}
        <div className={`p-3.5 rounded-3xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-wider">Trading Desk</h3>
            </div>
            <button
              onClick={handleSimulateInvestments}
              className="text-[8px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-blue-500/20 flex items-center gap-1"
            >
              <RotateCw className="w-2.5 h-2.5 animate-spin-slow" /> Fluctuate Rates
            </button>
          </div>

          <div className="space-y-2.5">
            {finInvestments.map(stock => {
              const currentVal = stock.shares * stock.currentPrice;
              const costBasis = stock.shares * stock.avgPrice;
              const gainLoss = costBasis > 0 ? ((currentVal - costBasis) / costBasis) * 100 : 0;
              const isProfit = gainLoss >= 0;

              return (
                <div key={stock.id} className="p-2.5 rounded-2xl border border-slate-100 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-900/40">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-[10px] font-extrabold leading-none">{stock.name}</h4>
                      <span className="text-[7.5px] text-slate-400 font-mono block mt-1">
                        {stock.shares} Shares • Cost Basis: ${stock.avgPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-black text-slate-800 dark:text-zinc-100 block">
                        ${stock.currentPrice.toFixed(2)}
                      </span>
                      <span className={`text-[7.5px] font-black font-mono inline-block px-1 rounded-sm mt-0.5 ${
                        isProfit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {isProfit ? '+' : ''}{gainLoss.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-zinc-850 flex justify-between items-center">
                    <span className="text-[7.5px] font-black text-slate-400">
                      Value: <span className="font-mono text-slate-600 dark:text-slate-300 font-black">${currentVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </span>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleBuyShare(stock.id)}
                        className="text-[7.5px] font-black px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
                      >
                        Buy +1
                      </button>
                      <button
                        onClick={() => handleSellShare(stock.id)}
                        className="text-[7.5px] font-black px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded cursor-pointer"
                      >
                        Sell -1
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderFinFlowProfileTab = () => {
    return (
      <div className="space-y-4">
        {/* Profile Card */}
        <div className={`p-4 rounded-3xl border text-center transition-all ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-base mx-auto mb-2">
            F
          </div>
          <h3 className="text-xs font-black">{state.userEmail || 'developer@mintstep.io'}</h3>
          <p className="text-[8px] text-slate-400 font-mono mt-0.5">FinFlow Vault ID: FF-2026-X89</p>

          <button
            onClick={() => {
              setSimulatedApp('mintstep');
              showToast("Switched back to MintStep Health Portal!");
            }}
            className="mt-3.5 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-[9.5px] font-black py-2 rounded-xl transition-all cursor-pointer"
          >
            🔌 Toggle Back to MintStep Mobile App
          </button>
        </div>

        {/* Sync Settings */}
        <div className={`p-3.5 rounded-3xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <h4 className="text-[10px] font-black uppercase tracking-wider mb-2.5">Mobile Sync Diagnostics</h4>

          <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono">
              <span>Database Size</span>
              <span>128 KB (Firestore Cached)</span>
            </div>
            <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono">
              <span>Offline Sync Queue</span>
              <span className="text-emerald-500">0 pending (Synced)</span>
            </div>
            <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono">
              <span>Network Protocol</span>
              <span>WebSocket / HTTP2 HTTPS</span>
            </div>

            <button
              onClick={() => {
                setFinTxList([
                  { id: 1, type: 'expense', category: 'Food & Dining', amount: 42.50, description: 'Saffron Cafe Dinner', date: '2026-07-21' },
                  { id: 2, type: 'income', category: 'Salary', amount: 3500.00, description: 'MintStep Payroll Corp', date: '2026-07-20' },
                  { id: 3, type: 'expense', category: 'Transport', amount: 18.00, description: 'Metro Premium Pass', date: '2026-07-19' },
                  { id: 4, type: 'expense', category: 'Housing', amount: 1200.00, description: 'Loft Suite Rental', date: '2026-07-01' },
                ]);
                showToast("Database restored to default seed values!");
              }}
              className="mt-2 w-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-500 text-[8.5px] font-bold py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Reset Mobile Micro-Database
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- MINTSTEP SOCIAL & CHALLENGES TAB METHODS ---

  // Automatically evaluate challenge completion when step count or account type changes
  useEffect(() => {
    if (currentScreen !== 'dashboard') return;
    
    if (state.accountType === 'personal') {
      setPersonalChallenges(prev =>
        prev.map(c => {
          if (!c.completed && state.stepsCount >= c.target) {
            // Trigger completion notice but don't re-trigger continuously
            return { ...c, completed: true };
          }
          return c;
        })
      );
    } else if (state.accountType === 'business') {
      setBusinessChallenges(prev =>
        prev.map(c => {
          if (!c.completed && state.stepsCount >= c.target) {
            return { ...c, completed: true };
          }
          return c;
        })
      );
    }
  }, [state.stepsCount, state.accountType, currentScreen]);

  // Tab Navigation Helpers maintaining history
  const navigateToTab = (tab: 'home' | 'for-you' | 'create' | 'community' | 'profile') => {
    setActiveTab(tab);
    setNavigationHistory(prev => {
      if (prev[prev.length - 1] === tab) return prev;
      return [...prev, tab];
    });
  };

  const navigateBackTab = () => {
    if (navigationHistory.length > 1) {
      const updatedHistory = [...navigationHistory];
      updatedHistory.pop(); // remove current active tab
      const prevTab = updatedHistory[updatedHistory.length - 1];
      setActiveTab(prevTab);
      setNavigationHistory(updatedHistory);
      showToast(`Navigated back to ${prevTab.toUpperCase()}`);
    } else {
      showToast("Root of navigation history");
    }
  };

  // Gamification: Claiming a completed reward
  const handleClaimReward = (id: string, isBusiness: boolean, rewardVal: number) => {
    if (isBusiness) {
      setBusinessChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, claimed: true } : c))
      );
    } else {
      setPersonalChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, claimed: true } : c))
      );
    }
    setWalletBalance(prev => prev + rewardVal);
    showToast(`💰 Claimed +${rewardVal} tokens! Balance updated.`);
  };

  // Community: Toggle liking a post
  const handleLikePost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newLiked = !post.liked;
          return {
            ...post,
            liked: newLiked,
            likes: newLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  // Create: Interactive corporate challenge submit
  const handleCreateChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createChallengeName.trim()) {
      showToast("Please enter a challenge title!");
      return;
    }

    setCreatingChallenge(true);
    setTimeout(() => {
      setCreatingChallenge(false);
      
      const newId = `b_custom_${Date.now()}`;
      const rewardNum = parseInt(createChallengeReward) || 100;
      const targetNum = parseInt(createChallengeSteps) || 10000;

      const newChallenge = {
        id: newId,
        title: createChallengeName,
        desc: `Sponsor multiplier ${createChallengeMultiplier} active. Target is ${targetNum.toLocaleString()} steps.`,
        multiplier: `${createChallengeMultiplier} Match`,
        reward: rewardNum,
        target: targetNum,
        completed: state.stepsCount >= targetNum,
        claimed: false
      };

      // Add to business challenges
      setBusinessChallenges(prev => [newChallenge, ...prev]);

      // Add corresponding announcement post to Community Feed
      const newPost = {
        id: `p_ann_${Date.now()}`,
        author: 'Corporate Admin (You)',
        role: 'Sponsor Coordinator',
        content: `📢 New Health Campaign: "${createChallengeName}" is now LIVE! Complete ${targetNum.toLocaleString()} steps to mint your share of ${rewardNum} credits! 🏃‍♂️💨`,
        steps: targetNum,
        likes: 0,
        liked: false,
        type: 'business'
      };
      setCommunityPosts(prev => [newPost, ...prev]);

      // Clear fields and switch tab to 'for-you' to see the active challenge!
      setCreateChallengeName('');
      navigateToTab('for-you');
      showToast("🚀 Corporate campaign launched live on blockchain!");
    }, 1200);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      themeMode: prev.themeMode === 'light' ? 'dark' : 'light'
    }));
  };

  // 2. Login verification handler (Queries Simulated Firebase Firestore)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email) {
      setLoginError('Email address is required');
      return;
    }
    if (!password) {
      setLoginError('Security code/password is required');
      return;
    }
    if (password.length < 6) {
      setLoginError('Password must exceed 5 characters');
      return;
    }

    setLoginLoading(true);
    try {
      const response = await fetch(`/api/firebase/user-profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      const lowerEmail = email.toLowerCase();
      setState(prev => ({
        ...prev,
        userEmail: lowerEmail
      }));

      setTimeout(() => {
        setLoginLoading(false);
        if (data.profile && data.profile.accountType) {
          // Future logins automatically remember account type
          setState(prev => ({
            ...prev,
            accountType: data.profile.accountType,
            goal: data.profile.accountType === 'business' ? 12000 : 10000
          }));
          setCurrentScreen('dashboard');
          showToast(`Welcome back! Logged in to your ${data.profile.accountType === 'business' ? 'Business' : 'Personal'} account.`);
        } else {
          // No configuration found, redirect to select screen
          setCurrentScreen('account-selection');
          showToast("Authentication success! Select account type.");
        }
      }, 1000);
    } catch (err) {
      console.error("Firestore retrieval error:", err);
      setLoginLoading(false);
      // fallback local memory transition
      setCurrentScreen('account-selection');
    }
  };

  const handleBiometricLogin = async () => {
    setLoginLoading(true);
    const demoEmail = 'biometric@mintstep.io';
    setEmail(demoEmail);
    
    try {
      const response = await fetch(`/api/firebase/user-profile?email=${encodeURIComponent(demoEmail)}`);
      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        userEmail: demoEmail
      }));

      setTimeout(() => {
        setLoginLoading(false);
        if (data.profile && data.profile.accountType) {
          // Future login automatically remembers account type
          setState(prev => ({
            ...prev,
            accountType: data.profile.accountType,
            goal: data.profile.accountType === 'business' ? 12000 : 10000
          }));
          setCurrentScreen('dashboard');
          showToast(`Biometric match! Retrieved ${data.profile.accountType === 'business' ? 'Business' : 'Personal'} profile.`);
        } else {
          setCurrentScreen('account-selection');
          showToast("Biometric access validated! Setup account type.");
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoginLoading(false);
      setCurrentScreen('account-selection');
    }
  };

  const handleConfirmAccountType = async () => {
    if (!selectedType) return;
    setSavingAccountType(true);

    const userEmail = state.userEmail || email || 'demo@mintstep.io';
    try {
      const response = await fetch('/api/firebase/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          accountType: selectedType
        })
      });
      const data = await response.json();

      setTimeout(() => {
        setSavingAccountType(false);
        setState(prev => ({
          ...prev,
          accountType: selectedType,
          goal: selectedType === 'business' ? 12000 : 10000
        }));
        setCurrentScreen('dashboard');
        showToast(`Saved to Firebase Firestore! Activated ${selectedType === 'business' ? 'Business' : 'Personal'} Ledger.`);
      }, 1200);
    } catch (err) {
      console.error("Firestore save error:", err);
      setSavingAccountType(false);
      // offline fallback
      setState(prev => ({
        ...prev,
        accountType: selectedType,
        goal: selectedType === 'business' ? 12000 : 10000
      }));
      setCurrentScreen('dashboard');
    }
  };

  // --- Tab UI Rendering Methods ---

  const renderHomeTab = () => {
    return (
      <div className="space-y-4">
        {/* Account specific micro-banner */}
        <div className={`p-2.5 rounded-xl text-[9px] flex items-center justify-between border ${
          state.accountType === 'business'
            ? 'bg-blue-500/5 text-blue-500 dark:text-blue-400 border-blue-500/10'
            : 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
        }`}>
          <span className="font-extrabold flex items-center gap-1">
            {state.accountType === 'business' 
              ? <>💼 Active Match: 1.2x matching enabled</> 
              : <>👤 Private Ledger: Direct token mint active</>}
          </span>
          <span className="opacity-70 font-mono text-[7px] bg-white dark:bg-zinc-800 px-1 rounded-sm border">LIVE</span>
        </div>

        {/* Steps Ring */}
        <div className={`rounded-3xl p-5 border flex flex-col items-center justify-center transition-all ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-xs'
        }`}>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className={state.themeMode === 'dark' ? 'stroke-zinc-800' : 'stroke-slate-100'}
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className={state.accountType === 'business' ? 'stroke-blue-500 transition-all duration-500 ease-out' : 'stroke-emerald-500 transition-all duration-500 ease-out'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * percentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Steps text */}
            <div className="absolute text-center">
              <Activity className={state.accountType === 'business' ? 'w-4 h-4 text-blue-500 mx-auto mb-1' : 'w-4 h-4 text-emerald-500 mx-auto mb-1'} />
              <span className="text-2xl font-extrabold tracking-tight block">
                {state.stepsCount.toLocaleString()}
              </span>
              <span className={`text-[8px] font-medium ${state.themeMode === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                of {state.goal.toLocaleString()} goal
              </span>
            </div>
          </div>
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-xs'
          }`}>
            <div className="flex items-center space-x-1.5 text-orange-500 mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Burned</span>
            </div>
            <div>
              <span className="text-base font-extrabold">{state.calories}</span>
              <span className="text-[8px] text-slate-400 font-medium ml-1">kcal</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex flex-col justify-between ${
            state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-xs'
          }`}>
            <div className="flex items-center space-x-1.5 text-blue-500 mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Distance</span>
            </div>
            <div>
              <span className="text-base font-extrabold">{state.distance}</span>
              <span className="text-[8px] text-slate-400 font-medium ml-1">km</span>
            </div>
          </div>
        </div>

        {/* Sync Alert Banner */}
        <div className={`p-2.5 rounded-xl border text-[10px] flex items-center space-x-2 transition-colors ${
          state.isSynced 
            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800 dark:text-emerald-400' 
            : 'bg-amber-500/5 border-amber-500/10 text-amber-800 dark:text-amber-400'
        }`}>
          {state.isSynced ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> : <Cloud className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight truncate">
              {state.isSynced ? 'Stored in Firestore' : 'Pending Sync Queue'}
            </p>
            <p className={`text-[8px] leading-tight mt-0.5 truncate ${state.themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {state.isSynced ? 'Data safely synchronized to Firebase.' : 'Saved to local Hive DB.'}
            </p>
          </div>
        </div>

        {/* Simulated walk button */}
        <button
          onClick={handleWalk}
          className={`w-full active:scale-95 text-white font-semibold py-2.5 rounded-xl shadow-xs transition-all text-[10px] tracking-wide uppercase mt-1 flex items-center justify-center space-x-1.5 ${
            state.accountType === 'business'
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{state.accountType === 'business' ? 'Walk +1,200 Steps' : 'Walk +1,000 Steps'}</span>
        </button>
      </div>
    );
  };

  const renderForYouTab = () => {
    const isBus = state.accountType === 'business';
    const challenges = isBus ? businessChallenges : personalChallenges;
    
    return (
      <div className="space-y-4">
        {/* Token Balance Card */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isBus 
            ? 'bg-blue-500/5 border-blue-500/15' 
            : 'bg-emerald-500/5 border-emerald-500/15'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
              {isBus ? '💼 Corporate Matching' : '👤 Active Ledger Balance'}
            </span>
            <Sparkles className={`w-3.5 h-3.5 ${isBus ? 'text-blue-500 animate-pulse' : 'text-emerald-500 animate-pulse'}`} />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold tracking-tight font-mono">
              {walletBalance.toLocaleString()}
            </span>
            <span className={`text-[10px] font-extrabold ${isBus ? 'text-blue-500' : 'text-emerald-500'}`}>
              {isBus ? 'EC' : 'MT'}
            </span>
          </div>
          <p className="text-[8px] text-slate-400 dark:text-zinc-500 mt-1 leading-normal font-medium">
            {isBus 
              ? 'Corporate achievements matched dynamically with our verified blockchain node.' 
              : 'Decentralized wellness assets generated directly from physical strides.'}
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Active Challenges
            </span>
            <span className="text-[8px] font-bold text-emerald-500">
              {challenges.filter(c => c.completed && !c.claimed).length} Claimable
            </span>
          </div>

          {challenges.map((c: any) => {
            const isCompleted = c.completed || state.stepsCount >= c.target;
            const isClaimed = c.claimed;
            const progressPct = Math.min((state.stepsCount / c.target) * 100, 100);

            return (
              <div 
                key={c.id}
                className={`p-3 rounded-2xl border transition-all ${
                  state.themeMode === 'dark' ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-slate-100 shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="max-w-[75%]">
                    <h4 className="text-[11px] font-bold leading-tight truncate">{c.title}</h4>
                    <p className="text-[9px] text-slate-400 dark:text-zinc-500 leading-normal mt-0.5">{c.desc}</p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isBus ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {isBus ? `${c.reward} EC` : `+${c.reward} MT`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[7.5px] font-bold text-slate-400 dark:text-zinc-500 font-mono">
                    <span>Steps Pacing</span>
                    <span>{state.stepsCount.toLocaleString()} / {c.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isBus ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60 flex justify-between items-center">
                  <span className={`text-[8.5px] font-bold ${
                    isCompleted ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    {isClaimed ? '✓ Claimed & Transferred' : isCompleted ? '✨ Challenge Succeeded!' : '🏃‍♂️ Keep walking to unlock'}
                  </span>

                  {isClaimed ? (
                    <span className="text-[8px] text-slate-400 dark:text-zinc-500 font-bold bg-slate-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded">
                      Transferred
                    </span>
                  ) : isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleClaimReward(c.id, isBus, c.reward)}
                      className={`text-[8.5px] font-extrabold px-2.5 py-1 rounded text-white shadow-xs animate-pulse cursor-pointer ${
                        isBus ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'
                      }`}
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleWalk}
                      className="text-[8px] font-bold text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800/60 hover:bg-slate-200 dark:hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" /> Walk Boost
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCreateTab = () => {
    return (
      <div className="space-y-4">
        <div className="text-center py-2">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <PlusCircle className="w-5.5 h-5.5 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-xs font-extrabold">Publish Sponsor Campaign</h2>
          <p className="text-[9px] text-slate-400 dark:text-zinc-500 max-w-[90%] mx-auto leading-normal">
            Establish new step incentives for employee health campaigns. Funding matches automatically.
          </p>
        </div>

        <form onSubmit={handleCreateChallengeSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Campaign Title</label>
            <input 
              type="text"
              value={createChallengeName}
              onChange={(e) => setCreateChallengeName(e.target.value)}
              placeholder="e.g., Marketing Team 12k Challenge"
              className="w-full text-[10px] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-blue-500/50 focus:outline-hidden p-2 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Target Steps</label>
              <select
                value={createChallengeSteps}
                onChange={(e) => setCreateChallengeSteps(e.target.value)}
                className="w-full text-[10px] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-2 rounded-xl focus:border-blue-500/50 focus:outline-hidden text-slate-800 dark:text-slate-100"
              >
                <option value="3000">3,000 steps</option>
                <option value="5000">5,000 steps</option>
                <option value="8000">8,000 steps</option>
                <option value="10000">10,000 steps</option>
                <option value="12000">12,000 steps</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Reward (EC)</label>
              <select
                value={createChallengeReward}
                onChange={(e) => setCreateChallengeReward(e.target.value)}
                className="w-full text-[10px] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-2 rounded-xl focus:border-blue-500/50 focus:outline-hidden text-slate-800 dark:text-slate-100"
              >
                <option value="100">100 Credits</option>
                <option value="200">200 Credits</option>
                <option value="350">350 Credits</option>
                <option value="500">500 Credits</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Sponsor Multiplier</label>
            <div className="grid grid-cols-3 gap-2">
              {['1.2x', '1.5x', '2.0x'].map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setCreateChallengeMultiplier(m)}
                  className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                    createChallengeMultiplier === m
                      ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-extrabold'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:border-slate-300'
                  }`}
                >
                  {m} Speed
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={creatingChallenge}
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold py-2 rounded-xl text-[10px] flex items-center justify-center space-x-1.5 transition-all mt-3 cursor-pointer shadow-sm"
          >
            {creatingChallenge ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Launch Challenge Campaign</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  };

  const renderCommunityTab = () => {
    const isBus = state.accountType === 'business';
    const activePosts = communityPosts.filter(p => isBus ? p.type === 'business' : p.type === 'personal');

    return (
      <div className="space-y-3.5">
        {/* Feed vs Leaderboard */}
        <div className="flex bg-slate-100 dark:bg-zinc-900/60 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => setCommunityTab('feed')}
            className={`flex-1 py-1.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer ${
              communityTab === 'feed'
                ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-white shadow-2xs font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Social Feed
          </button>
          <button
            type="button"
            onClick={() => setCommunityTab('leaderboard')}
            className={`flex-1 py-1.5 text-[9.5px] font-black rounded-lg transition-all cursor-pointer ${
              communityTab === 'leaderboard'
                ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-white shadow-2xs font-extrabold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {communityTab === 'feed' ? (
          <div className="space-y-2.5">
            {activePosts.map(post => (
              <div 
                key={post.id}
                className={`p-3 rounded-2xl border transition-all ${
                  state.themeMode === 'dark' ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-white border-slate-100 shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                      isBus ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-[10px] font-extrabold leading-tight">{post.author}</h5>
                      <span className="text-[7.5px] text-slate-400 dark:text-zinc-500 leading-none">{post.role}</span>
                    </div>
                  </div>

                  {post.steps > 0 && (
                    <span className="text-[7px] font-bold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/10 px-1.5 py-0.5 rounded">
                      ⚡ {post.steps.toLocaleString()} steps
                    </span>
                  )}
                </div>

                <p className="text-[9.5px] text-slate-600 dark:text-zinc-300 leading-normal mb-2 pl-1 font-medium">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800/50 pl-1 text-[8px]">
                  <button 
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1 font-bold cursor-pointer ${
                      post.liked 
                        ? 'text-rose-500' 
                        : 'text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => showToast(`Shared ${post.author}'s post!`)}
                    className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 hover:text-slate-600 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-center py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span className="text-[8.5px] font-black text-amber-500 uppercase tracking-wider">
                Current Rankings
              </span>
            </div>

            {isBus ? (
              <div className="space-y-1.5">
                {[
                  { name: 'Engineering & DevOps', steps: 42500, highlight: false },
                  { name: 'Product & Design', steps: 31200, highlight: false },
                  { name: 'Sales & Marketing', steps: 24800, highlight: false },
                  { name: 'Your Personal Work', steps: state.stepsCount, highlight: true },
                ]
                .sort((a, b) => b.steps - a.steps)
                .map((row, idx) => (
                  <div 
                    key={row.name}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      row.highlight
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-200'
                        : state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black w-4 text-center ${
                        idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-extrabold">{row.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-black">
                      {row.steps.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {[
                  { name: 'Julian Reed', steps: 14200, highlight: false },
                  { name: 'You', steps: state.stepsCount, highlight: true },
                  { name: 'Emily Watson', steps: 3900, highlight: false },
                  { name: 'Liam Foster', steps: 2800, highlight: false },
                ]
                .sort((a, b) => b.steps - a.steps)
                .map((row, idx) => (
                  <div 
                    key={row.name}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      row.highlight
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                        : state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black w-4 text-center ${
                        idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-extrabold">{row.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-black">
                      {row.steps.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderProfileTab = () => {
    const isBus = state.accountType === 'business';
    const emailToDisplay = state.userEmail || 'developer@mintstep.io';
    const valUSD = (walletBalance * 0.01).toFixed(2);

    return (
      <div className="space-y-4">
        {/* User Card */}
        <div className={`p-4 rounded-3xl border text-center transition-all ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base text-white mx-auto mb-2 ${
            isBus ? 'bg-blue-500' : 'bg-emerald-500'
          }`}>
            {emailToDisplay.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xs font-extrabold">{emailToDisplay}</h3>
          <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border mt-1 inline-block ${
            isBus ? 'bg-blue-500/10 text-blue-500 border-blue-500/15' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
          }`}>
            {isBus ? 'Sponsor Node - Active' : 'Personal Secure Ledger'}
          </span>
        </div>

        {/* Ledger */}
        <div className={`p-3.5 rounded-2xl border ${
          state.themeMode === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100 shadow-2xs'
        }`}>
          <span className="text-[8px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
            Valuation Ledger
          </span>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-300">Token Wallet:</span>
            <span className="font-mono text-xs font-black">
              {walletBalance} {isBus ? 'EC' : 'MT'}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-zinc-800/60">
            <span className="text-xs font-bold text-emerald-500">USD Equivalence:</span>
            <span className="font-mono text-xs font-black text-emerald-500">
              ${valUSD} USD
            </span>
          </div>
        </div>

        {/* Sandbox utilities */}
        <div className="space-y-2 pt-2">
          <span className="text-[8px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block px-1">
            Simulator Utilities
          </span>

          <button
            type="button"
            onClick={() => {
              const nextType = isBus ? 'personal' : 'business';
              setState(prev => ({
                ...prev,
                accountType: nextType,
                goal: nextType === 'business' ? 12000 : 10000
              }));
              setActiveTab('home');
              showToast(`Instantly swapped to ${nextType.toUpperCase()} mode!`);
            }}
            className="w-full bg-slate-100 hover:bg-slate-200/60 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 font-bold py-2 rounded-xl text-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {isBus ? <User className="w-3.5 h-3.5 text-emerald-500" /> : <Briefcase className="w-3.5 h-3.5 text-blue-500" />}
            <span>Swap to {isBus ? 'Personal Account' : 'Business Account'}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full bg-slate-100 hover:bg-slate-200/60 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 font-bold py-2 rounded-xl text-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {state.themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
            <span>Toggle theme (Currently {state.themeMode.toUpperCase()})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentScreen('login');
              showToast("Successfully logged out!");
            }}
            className="w-full bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border border-rose-500/10 font-bold py-2 rounded-xl text-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Securely</span>
          </button>
        </div>
      </div>
    );
  };

  const percentage = Math.min((state.stepsCount / state.goal) * 100, 100);

  // Gradient definitions matching light & dark theme states
  const splashGradient = state.themeMode === 'dark'
    ? 'from-zinc-950 via-zinc-900 to-zinc-950'
    : 'from-emerald-50 via-teal-50/20 to-emerald-50/50';

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
          Interactive Flutter Runtime Simulator
        </span>
        <h3 className="font-semibold text-gray-800 mt-2">MintStep M3 Simulator</h3>
      </div>

      {/* Mock smartphone wrap */}
      <div className="relative w-[320px] h-[610px] bg-slate-950 rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden ring-4 ring-slate-800/25 flex flex-col">
        {/* Dynamic Notch / Camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-between px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
          <div className="w-12 h-1 bg-slate-900 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className={`pt-8 px-6 pb-2 flex justify-between items-center text-[10px] font-semibold z-40 transition-colors duration-300 ${
          state.themeMode === 'dark' ? 'bg-zinc-950 text-slate-300' : 'bg-slate-50 text-slate-600'
        }`}>
          <span>10:42 AM</span>
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3 h-3" />
            <span className="font-mono">5G</span>
            <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div className="h-full w-4 bg-current rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Screen Canvas (With AnimatePresence for transitions) */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${
          state.themeMode === 'dark' ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'
        }`}>
          
          <AnimatePresence mode="wait">
            
            {/* SCREEN 1: SPLASH SCREEN (2 Seconds duration, 60fps fade transition) */}
            {currentScreen === 'splash' && (
              <motion.div
                key="splash-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                className={`flex-1 flex flex-col justify-between p-6 bg-gradient-to-br ${splashGradient} relative`}
              >
                {/* Decorative circle ornament */}
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />

                {/* Dummy layout flex placeholder */}
                <div />

                {/* Center Branding Block */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100, duration: 1.2 }}
                    className={`w-20 h-20 rounded-[24px] flex items-center justify-center relative ${
                      state.themeMode === 'dark' 
                        ? 'bg-emerald-950/40 border border-emerald-500/20 shadow-emerald-900/10 shadow-lg' 
                        : 'bg-emerald-100/80 border border-emerald-200 shadow-emerald-200/30 shadow-md'
                    }`}
                  >
                    <Activity className="w-10 h-10 text-emerald-500" />
                    {/* Golden miniature wealth coin representing dynamic financial step tracking */}
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-zinc-900" />
                  </motion.div>

                  <motion.h1 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-2xl font-extrabold tracking-tight mt-5 ${
                      state.themeMode === 'dark' ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    MintStep
                  </motion.h1>

                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs font-bold text-emerald-500 tracking-wider uppercase mt-1 text-center"
                  >
                    Every Step Builds Wealth
                  </motion.p>
                </div>

                {/* Bottom status/loader */}
                <div className="flex flex-col items-center pb-8">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-[8px] font-bold tracking-widest text-slate-400">
                    SECURE FINANCIAL ENGINE
                  </span>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: LOGIN SCREEN */}
            {currentScreen === 'login' && (
              <motion.div
                key="login-screen"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between p-6 overflow-y-auto"
              >
                {/* Header with theme toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider">MintStep Wallet</span>
                  <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors">
                    {state.themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="flex-1 flex flex-col justify-center space-y-4 my-4">
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-bold">Secure Access Portal</h2>
                    <p className="text-[10px] text-slate-400">Enter your credentials to unlock wallet metrics</p>
                  </div>

                  {loginError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] p-2.5 rounded-lg font-medium">
                      {loginError}
                    </div>
                  )}

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="wallet@mintstep.io"
                        className="w-full text-xs bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500/50 focus:outline-hidden p-2.5 pl-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Secure Pin / Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full text-xs bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-emerald-500/50 focus:outline-hidden p-2.5 pl-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-98"
                    >
                      {loginLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Sign In Securely</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBiometricLogin}
                      className="w-full border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      <Fingerprint className="w-4 h-4 text-emerald-500" />
                      <span>Access with Biometrics</span>
                    </button>
                  </div>
                </form>

                <div className="text-center text-[9px] text-slate-400">
                  By logging in, you authorize biometric credentials sync.
                </div>
              </motion.div>
            )}

            {/* SCREEN: ACCOUNT TYPE SELECTION */}
            {currentScreen === 'account-selection' && (
              <motion.div
                key="account-selection-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col justify-between p-5 overflow-y-auto"
              >
                <div>
                  <div className="text-center mt-2 mb-4">
                    <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Step 2: Configuration
                    </span>
                    <h2 className="text-sm font-extrabold mt-2">Select Account Structure</h2>
                    <p className="text-[10px] text-slate-400">Choose how your step achievements are minted</p>
                  </div>

                  <div className="space-y-3">
                    {/* Personal Account Card */}
                    <button
                      type="button"
                      onClick={() => setSelectedType('personal')}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all relative outline-hidden ${
                        selectedType === 'personal'
                          ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5'
                          : state.themeMode === 'dark'
                            ? 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedType === 'personal' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-emerald-500'
                        }`}>
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">Personal Account</h4>
                          <span className="text-[7.5px] text-emerald-500 font-bold tracking-wider uppercase leading-none">Every step is capital</span>
                        </div>
                      </div>
                      <ul className="text-[9px] text-slate-500 dark:text-zinc-400 space-y-1 pl-1 list-disc list-inside">
                        <li>Direct token generation for milestones</li>
                        <li>Private offline-first local secure storage</li>
                        <li>Zero-fee conversions inside your personal vault</li>
                      </ul>
                      {selectedType === 'personal' && (
                        <div className="absolute top-3 right-3 w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>

                    {/* Business Account Card */}
                    <button
                      type="button"
                      onClick={() => setSelectedType('business')}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all relative outline-hidden ${
                        selectedType === 'business'
                          ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5'
                          : state.themeMode === 'dark'
                            ? 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedType === 'business' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-emerald-500'
                        }`}>
                          <Briefcase className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold leading-tight">Business Account</h4>
                          <span className="text-[7.5px] text-blue-500 font-bold tracking-wider uppercase leading-none">Enterprise Health Yield</span>
                        </div>
                      </div>
                      <ul className="text-[9px] text-slate-500 dark:text-zinc-400 space-y-1 pl-1 list-disc list-inside">
                        <li>Corporate sponsor matching (1.2x multiplier)</li>
                        <li>Team sync and group rewards</li>
                        <li>Direct payroll API and dashboard sync</li>
                      </ul>
                      {selectedType === 'business' && (
                        <div className="absolute top-3 right-3 w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmAccountType}
                    disabled={!selectedType || savingAccountType}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-500/10"
                  >
                    {savingAccountType ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" />
                        <span>Confirm Secure Setup</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: DASHBOARD */}
            {currentScreen === 'dashboard' && (
              <motion.div
                key="dashboard-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col relative overflow-hidden h-full"
              >
                {/* App Bar / Header */}
                <div className="flex items-center justify-between p-4 pb-2 border-b border-slate-100 dark:border-zinc-900/60 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    {navigationHistory.length > 1 && (
                      <button
                        onClick={navigateBackTab}
                        title="Back"
                        className="p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    )}
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm tracking-tight text-emerald-500 leading-none">
                        {simulatedApp === 'mintstep' ? 'MintStep' : 'FinFlow'}
                      </span>
                      {state.accountType && (
                        <span className={`text-[6.5px] font-extrabold px-1 py-0.5 rounded-xs mt-0.5 uppercase tracking-wider ${
                          state.accountType === 'business'
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/10'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                        }`}>
                          {state.accountType === 'business' ? '💼 Business' : '👤 Personal'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* Simulated Mobile App Selector Switcher */}
                    <button
                      onClick={() => {
                        const nextApp = simulatedApp === 'mintstep' ? 'finflow' : 'mintstep';
                        setSimulatedApp(nextApp);
                        setActiveTab('home');
                        showToast(`Launched mobile app: ${nextApp === 'finflow' ? 'FinFlow Finance' : 'MintStep Steps'}`);
                      }}
                      className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-wider transition-colors cursor-pointer mr-0.5"
                    >
                      {simulatedApp === 'mintstep' ? '💰 FinFlow' : '⚡ MintStep'}
                    </button>

                    <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors">
                      {state.themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                    </button>
                    
                    <button 
                      onClick={handleSync} 
                      disabled={state.isSyncing}
                      className="p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors relative"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${state.isSyncing ? 'animate-spin text-emerald-500' : state.isSynced ? 'text-green-500' : 'text-amber-500'}`} />
                    </button>

                    <button 
                      onClick={() => {
                        setCurrentScreen('login');
                        showToast("Successfully logged out!");
                      }}
                      title="Log Out"
                      className="p-1.5 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
                  <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                      <motion.div
                        key={`${simulatedApp}-tab-home`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {simulatedApp === 'mintstep' ? renderHomeTab() : renderFinFlowHomeTab()}
                      </motion.div>
                    )}

                    {activeTab === 'for-you' && (
                      <motion.div
                        key={`${simulatedApp}-tab-for-you`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {simulatedApp === 'mintstep' ? renderForYouTab() : renderFinFlowForYouTab()}
                      </motion.div>
                    )}

                    {activeTab === 'create' && (
                      <motion.div
                        key={`${simulatedApp}-tab-create`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {simulatedApp === 'mintstep' ? (
                          state.accountType === 'business' ? renderCreateTab() : null
                        ) : (
                          renderFinFlowCreateTab()
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'community' && (
                      <motion.div
                        key={`${simulatedApp}-tab-community`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {simulatedApp === 'mintstep' ? renderCommunityTab() : renderFinFlowCommunityTab()}
                      </motion.div>
                    )}

                    {activeTab === 'profile' && (
                      <motion.div
                        key={`${simulatedApp}-tab-profile`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {simulatedApp === 'mintstep' ? renderProfileTab() : renderFinFlowProfileTab()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Persistent Bottom Navigation Bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-[62px] border-t flex items-center justify-around px-2 z-30 ${
                  state.themeMode === 'dark' 
                    ? 'bg-zinc-950/95 border-zinc-900/60' 
                    : 'bg-white/95 border-slate-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]'
                }`}>
                  {((simulatedApp === 'finflow' || state.accountType === 'business')
                    ? [
                        { id: 'home', label: 'Home', icon: Home },
                        { id: 'for-you', label: simulatedApp === 'finflow' ? 'Goals' : 'For You', icon: Compass },
                        { id: 'create', label: simulatedApp === 'finflow' ? 'Ledger' : 'Create', icon: PlusCircle },
                        { id: 'community', label: simulatedApp === 'finflow' ? 'Trading' : 'Community', icon: Users },
                        { id: 'profile', label: 'Profile', icon: User }
                      ]
                    : [
                        { id: 'home', label: 'Home', icon: Home },
                        { id: 'for-you', label: 'For You', icon: Compass },
                        { id: 'community', label: 'Community', icon: Users },
                        { id: 'profile', label: 'Profile', icon: User }
                      ]
                  ).map((tab) => {
                    const IconComponent = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => navigateToTab(tab.id as any)}
                        className="relative flex flex-col items-center justify-center py-1 flex-1 h-full select-none cursor-pointer outline-hidden"
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeTabPill"
                            className={`absolute inset-x-1 inset-y-1.5 rounded-xl ${
                              state.accountType === 'business' ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                            }`}
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          />
                        )}
                        <IconComponent className={`w-4 h-4 relative z-10 transition-colors duration-200 ${
                          isSelected 
                            ? state.accountType === 'business' ? 'text-blue-500' : 'text-emerald-500'
                            : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                        }`} />
                        <span className={`text-[7.5px] font-black mt-0.5 relative z-10 tracking-wide transition-colors duration-200 ${
                          isSelected 
                            ? state.accountType === 'business' ? 'text-blue-500' : 'text-emerald-500'
                            : 'text-slate-400 dark:text-zinc-500'
                        }`}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Dynamic home indicator */}
        <div className="h-4 w-full flex items-center justify-center bg-slate-950 pb-1.5">
          <div className="w-32 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* In-App Toast notification */}
        {notification && (
          <div className="absolute bottom-16 left-4 right-4 bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl text-[10px] font-medium text-center shadow-lg animate-bounce flex items-center justify-center space-x-1.5 z-50">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}
      </div>
    </div>
  );
}
