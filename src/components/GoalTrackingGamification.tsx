import React, { useState, useEffect } from 'react';
import { 
  Target, Flame, Award, Zap, Trophy, TrendingUp, DollarSign, BookOpen, 
  Video, CheckCircle2, Plus, Sparkles, Star, ChevronRight, Download, 
  Share2, ShieldCheck, Clock, RefreshCw, X, ArrowUpRight, Percent, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type GoalCategory = 
  | 'SAVE_MONEY' 
  | 'REDUCE_EXPENSES' 
  | 'INCREASE_REVENUE' 
  | 'READ_BOOKS' 
  | 'WATCH_VIDEOS' 
  | 'ACCOUNTING_TASKS';

export interface BusinessGoal {
  id: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string; // e.g. "$", "books", "videos", "tasks"
  deadlineDate: string;
  xpReward: number;
  isCompleted: boolean;
  aiMotivationMsg?: string;
}

export interface UserGamificationProfile {
  level: number;
  levelTitle: string;
  currentXp: number;
  xpForNextLevel: number;
  dailyStreak: number;
  totalGoalsCompleted: number;
  badges: Array<{ id: string; name: string; icon: string; description: string; unlockedDate?: string }>;
  certificates: Array<{ id: string; title: string; date: string; category: string; verificationCode: string }>;
}

export const initialProfile: UserGamificationProfile = {
  level: 7,
  levelTitle: 'Financial Titan & Tax Strategist',
  currentXp: 3450,
  xpForNextLevel: 5000,
  dailyStreak: 14,
  totalGoalsCompleted: 18,
  badges: [
    { id: 'b-1', name: 'Section 179 Ninja', icon: '⚡', description: 'Optimized over $50k in hardware tax write-offs', unlockedDate: '2026-07-10' },
    { id: 'b-2', name: 'Revenue Accelerator', icon: '🚀', description: 'Increased monthly hardware ARR by 25%', unlockedDate: '2026-07-15' },
    { id: 'b-3', name: 'Executive Bookworm', icon: '📚', description: 'Read 5 executive business summaries in 30 days', unlockedDate: '2026-07-18' },
    { id: 'b-4', name: 'Master Accountant', icon: '📊', description: 'Completed 10 consecutive daily ledger reconcile runs', unlockedDate: '2026-07-20' },
  ],
  certificates: [
    { 
      id: 'cert-101', 
      title: 'Master of Corporate Tax Optimization & Ledger Efficiency', 
      date: 'July 18, 2026', 
      category: 'Section 179 & VAT Masterclass',
      verificationCode: 'MINT-CERT-8842-X9'
    }
  ]
};

export const initialGoals: BusinessGoal[] = [
  {
    id: 'g-1',
    title: 'Reinvest $50,000 in Edge Hardware Equipment for Section 179 Write-Off',
    category: 'SAVE_MONEY',
    targetValue: 50000,
    currentValue: 38500,
    unit: '$',
    deadlineDate: '2026-08-15',
    xpReward: 500,
    isCompleted: false,
    aiMotivationMsg: 'You are only $11,500 away from unlocking maximum Section 179 tax deductions this fiscal quarter! Keep reinvesting into high-margin inventory.'
  },
  {
    id: 'g-2',
    title: 'Cut Merchant POS Processing Fees by 15%',
    category: 'REDUCE_EXPENSES',
    targetValue: 15,
    currentValue: 12,
    unit: '%',
    deadlineDate: '2026-08-01',
    xpReward: 350,
    isCompleted: false,
    aiMotivationMsg: 'Great progress! Renegotiating terminal interchange fees will save $3,400 monthly in net cashflow.'
  },
  {
    id: 'g-3',
    title: 'Scale Box Tech Hardware ARR to $150,000',
    category: 'INCREASE_REVENUE',
    targetValue: 150000,
    currentValue: 128400,
    unit: '$',
    deadlineDate: '2026-09-01',
    xpReward: 800,
    isCompleted: false,
    aiMotivationMsg: 'You’re 85% of the way to $150k ARR! Closing 2 more enterprise solar quotes will hit your goal.'
  },
  {
    id: 'g-4',
    title: 'Read 3 Recommended Business Books this Month',
    category: 'READ_BOOKS',
    targetValue: 3,
    currentValue: 2,
    unit: 'books',
    deadlineDate: '2026-07-31',
    xpReward: 250,
    isCompleted: false,
    aiMotivationMsg: '1 more book to complete your monthly executive reading badge! Check out "Profit First" next.'
  },
  {
    id: 'g-5',
    title: 'Watch 5 Tax Strategy & POS Shorts (≤8m 30s)',
    category: 'WATCH_VIDEOS',
    targetValue: 5,
    currentValue: 5,
    unit: 'videos',
    deadlineDate: '2026-07-22',
    xpReward: 200,
    isCompleted: true,
    aiMotivationMsg: 'Goal achieved! You unlocked 200 XP and increased your daily streak to 14 days!'
  },
  {
    id: 'g-6',
    title: 'Complete Weekly Reconcile & Categorize 50 Receipts',
    category: 'ACCOUNTING_TASKS',
    targetValue: 50,
    currentValue: 42,
    unit: 'tasks',
    deadlineDate: '2026-07-25',
    xpReward: 300,
    isCompleted: false,
    aiMotivationMsg: '8 receipts left to reconcile! OCR scanner is ready in your terminal.'
  }
];

export const GoalTrackingGamification: React.FC = () => {
  const [profile, setProfile] = useState<UserGamificationProfile>(() => {
    const saved = localStorage.getItem('mintstep_gamification_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialProfile;
  });

  const [goals, setGoals] = useState<BusinessGoal[]>(() => {
    const saved = localStorage.getItem('mintstep_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialGoals;
  });

  const [activeTab, setActiveTab] = useState<'GOALS' | 'BADGES' | 'CERTIFICATES'>('GOALS');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // New Goal Modal State
  const [showNewGoalModal, setShowNewGoalModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('INCREASE_REVENUE');
  const [newTargetValue, setNewTargetValue] = useState<number>(10000);
  const [newUnit, setNewUnit] = useState<string>('$');
  const [newDeadline, setNewDeadline] = useState<string>('2026-08-31');

  // Certificate Modal State
  const [activeCert, setActiveCert] = useState<UserGamificationProfile['certificates'][0] | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('mintstep_gamification_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('mintstep_goals', JSON.stringify(goals));
  }, [goals]);

  // Goal Progress Increment
  const handleIncrementProgress = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const nextVal = Math.min(g.targetValue, g.currentValue + amount);
        const newlyCompleted = !g.isCompleted && nextVal >= g.targetValue;

        if (newlyCompleted) {
          triggerToast(`🎉 GOAL COMPLETED! +${g.xpReward} XP Earned!`);
          
          // Award XP and check level up
          setProfile(prof => {
            const newXp = prof.currentXp + g.xpReward;
            let level = prof.level;
            let xpNext = prof.xpForNextLevel;

            if (newXp >= xpNext) {
              level += 1;
              xpNext += 2000;
              triggerToast(`🏆 LEVEL UP! Reached Level ${level}: Master Business Architect!`);
            }

            return {
              ...prof,
              currentXp: newXp,
              level,
              xpForNextLevel: xpNext,
              totalGoalsCompleted: prof.totalGoalsCompleted + 1,
              dailyStreak: prof.dailyStreak + 1
            };
          });
        } else {
          triggerToast(`📈 Progress updated for "${g.title}"!`);
        }

        return {
          ...g,
          currentValue: nextVal,
          isCompleted: g.isCompleted || nextVal >= g.targetValue
        };
      }
      return g;
    }));
  };

  // Create Goal Handler
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: BusinessGoal = {
      id: `g-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetValue: newTargetValue,
      currentValue: 0,
      unit: newUnit,
      deadlineDate: newDeadline,
      xpReward: Math.round(newTargetValue > 1000 ? 500 : 250),
      isCompleted: false,
      aiMotivationMsg: `AI analysis initialized for "${newTitle}". Keep pushing forward to maximize your XP output!`
    };

    setGoals(prev => [newGoal, ...prev]);
    setShowNewGoalModal(false);
    setNewTitle('');
    triggerToast(`🎯 Created new business goal: "${newGoal.title}"!`);
  };

  const filteredGoals = goals.filter(g => filterCategory === 'ALL' || g.category === filterCategory);

  const getCategoryIcon = (cat: GoalCategory) => {
    switch (cat) {
      case 'SAVE_MONEY': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'REDUCE_EXPENSES': return <Percent className="w-4 h-4 text-cyan-400" />;
      case 'INCREASE_REVENUE': return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case 'READ_BOOKS': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'WATCH_VIDEOS': return <Video className="w-4 h-4 text-rose-400" />;
      case 'ACCOUNTING_TASKS': return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
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
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-emerald-400"
          >
            <Trophy className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Target className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep Goal Tracking & Gamification</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                Level {profile.level} • {profile.levelTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Track financial & educational targets, earn XP, maintain streaks, unlock badges & certificates</p>
          </div>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewGoalModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Goal</span>
          </button>
        </div>
      </div>

      {/* Gamification Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak Metric */}
        <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Daily Streak</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-amber-400 font-mono">{profile.dailyStreak} Days</span>
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Streak active! Keep logging in</p>
          </div>
        </div>

        {/* Level & XP Progress */}
        <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold">
            <span className="text-slate-400">Level {profile.level} XP Progress</span>
            <span className="text-emerald-400">{profile.currentXp} / {profile.xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-indigo-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (profile.currentXp / profile.xpForNextLevel) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 font-mono text-right">{profile.xpForNextLevel - profile.currentXp} XP to Level {profile.level + 1}</p>
        </div>

        {/* Total Goals Completed */}
        <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Completed Goals</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">{profile.totalGoalsCompleted}</span>
            <p className="text-[10px] text-slate-500 font-mono">Financial & learning milestones</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        {/* Badges Count */}
        <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Unlocked Badges</span>
            <span className="text-2xl font-black text-purple-400 font-mono block">{profile.badges.length} Badges</span>
            <p className="text-[10px] text-slate-500 font-mono">Executive achievements</p>
          </div>
          <Award className="w-8 h-8 text-purple-400 opacity-80" />
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'GOALS', label: `Active Goals (${goals.length})`, icon: Target },
          { id: 'BADGES', label: `Badges & Trophies (${profile.badges.length})`, icon: Award },
          { id: 'CERTIFICATES', label: `Certificates of Completion (${profile.certificates.length})`, icon: Trophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === tab.id 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------- TAB 1: ACTIVE GOALS ------------------- */}
      {activeTab === 'GOALS' && (
        <div className="space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'SAVE_MONEY', label: 'Save Money' },
              { id: 'REDUCE_EXPENSES', label: 'Reduce Expenses' },
              { id: 'INCREASE_REVENUE', label: 'Increase Revenue' },
              { id: 'READ_BOOKS', label: 'Read Books' },
              { id: 'WATCH_VIDEOS', label: 'Watch Videos' },
              { id: 'ACCOUNTING_TASKS', label: 'Accounting Tasks' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  filterCategory === cat.id 
                    ? 'bg-slate-800 border-emerald-500 text-emerald-400 font-bold' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {filteredGoals.map(goal => {
              const progressPct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

              return (
                <div key={goal.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-black text-slate-100">{goal.title}</h3>
                          {goal.isCompleted && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Deadline: {goal.deadlineDate} • Reward: <strong className="text-amber-400">+{goal.xpReward} XP</strong>
                        </p>
                      </div>
                    </div>

                    {/* Progress Numeric Indicator */}
                    <div className="text-right font-mono text-xs">
                      <span className="text-slate-400 text-[10px] block">Current Progress</span>
                      <strong className="text-slate-100 text-sm">
                        {goal.unit === '$' ? `$${goal.currentValue.toLocaleString()}` : goal.currentValue} / {goal.unit === '$' ? `$${goal.targetValue.toLocaleString()}` : goal.targetValue} {goal.unit !== '$' && goal.unit}
                      </strong>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>0%</span>
                      <span className="font-bold text-slate-300">{progressPct}% Achieved</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* AI Motivational Agent Message */}
                  {goal.aiMotivationMsg && (
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs font-sans text-slate-300 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="italic">
                        <strong className="text-emerald-400 font-mono not-italic mr-1">AI Coach:</strong>
                        "{goal.aiMotivationMsg}"
                      </p>
                    </div>
                  )}

                  {/* Progress Control Actions */}
                  {!goal.isCompleted && (
                    <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800/60">
                      <button
                        onClick={() => handleIncrementProgress(goal.id, goal.unit === '$' ? 2500 : 1)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Log Progress (+{goal.unit === '$' ? '$2,500' : '1'})</span>
                      </button>

                      <button
                        onClick={() => handleIncrementProgress(goal.id, goal.targetValue - goal.currentValue)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ------------------- TAB 2: BADGES & TROPHIES ------------------- */}
      {activeTab === 'BADGES' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.badges.map(b => (
            <div key={b.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3 text-center hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl mx-auto shadow-inner">
                {b.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-100 text-sm">{b.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.description}</p>
              </div>
              {b.unlockedDate && (
                <span className="text-[10px] text-purple-400 font-mono font-bold block">
                  Unlocked {b.unlockedDate}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ------------------- TAB 3: ACHIEVEMENT CERTIFICATES ------------------- */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-4">
          {profile.certificates.map(cert => (
            <div key={cert.id} className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                  Verified Executive Credential
                </span>
                <h3 className="text-base font-black text-slate-100">{cert.title}</h3>
                <p className="text-xs text-slate-400 font-mono">Issued on {cert.date} • ID: {cert.verificationCode}</p>
              </div>

              <button
                onClick={() => setActiveCert(cert)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md shrink-0"
              >
                <Trophy className="w-4 h-4 fill-slate-950" />
                <span>View Digital Certificate</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- CREATE NEW GOAL MODAL --- */}
      <AnimatePresence>
        {showNewGoalModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase text-slate-100">Create New Business Goal</h3>

              <form onSubmit={handleCreateGoal} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Goal Title:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Save $20,000 on Corporate Tax"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SAVE_MONEY">Save Money</option>
                    <option value="REDUCE_EXPENSES">Reduce Expenses</option>
                    <option value="INCREASE_REVENUE">Increase Revenue</option>
                    <option value="READ_BOOKS">Read Books</option>
                    <option value="WATCH_VIDEOS">Watch Videos</option>
                    <option value="ACCOUNTING_TASKS">Complete Accounting Tasks</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Target Value:</label>
                    <input 
                      type="number"
                      required
                      value={newTargetValue}
                      onChange={(e) => setNewTargetValue(parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Unit:</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. $, books, tasks"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Deadline:</label>
                  <input 
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewGoalModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DIGITAL CERTIFICATE VIEW MODAL --- */}
      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6 relative text-center"
            >
              <button 
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <Trophy className="w-16 h-16 text-amber-400 fill-amber-400 mx-auto" />
                <span className="text-xs font-mono font-black text-amber-400 tracking-widest uppercase block">
                  MintStep Executive Achievement Credential
                </span>
                <h2 className="text-xl font-black text-slate-100">{activeCert.title}</h2>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-1">
                <p className="text-slate-400">Awarded to: <strong className="text-slate-100">Felix Zinyenge</strong></p>
                <p className="text-slate-400">Issued Date: {activeCert.date}</p>
                <p className="text-emerald-400 font-bold">Verification ID: {activeCert.verificationCode}</p>
              </div>

              <button
                onClick={() => {
                  triggerToast("📜 Certificate downloaded to device!");
                  setActiveCert(null);
                }}
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Printable Certificate PDF</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GoalTrackingGamification;
