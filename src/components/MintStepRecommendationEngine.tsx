import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Cpu, Video, BookOpen, Users, GraduationCap, Briefcase, 
  Lightbulb, Heart, Bookmark, Play, Star, ChevronRight, Filter, Search, 
  RefreshCw, TrendingUp, DollarSign, Clock, CheckCircle2, ShieldCheck, 
  Sliders, ArrowUpRight, MessageSquare, ThumbsUp, Eye, Flame, Share2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UserSignals {
  businessType: string;
  monthlySpend: number;
  goals: string[];
  joinedCommunities: string[];
  searchHistory: string[];
  aiInteractionsCount: number;
  videosWatched: string[];
  videosLiked: string[];
  savedItems: string[];
}

export interface RecommendationItem {
  id: string;
  type: 'VIDEO' | 'BOOK' | 'COMMUNITY' | 'ADVISOR' | 'OPPORTUNITY' | 'FINANCIAL_TIP';
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badgeTag: string;
  mlMatchScore: number; // calculated percentage 0-100
  mlReasoning: string[];
  videoDurationSeconds?: number; // max 8 minutes 30 seconds = 510s
  videoUrl?: string;
  bookPages?: number;
  communityMembers?: number;
  advisorRating?: number;
  opportunityValuation?: string;
  financialSavingsEstimate?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const initialSignals: UserSignals = {
  businessType: 'Technology & Hardware',
  monthlySpend: 26200,
  goals: ['Scale ARR to $1M+', 'Section 179 Tax Deductions', 'Hardware Supply Chain'],
  joinedCommunities: ['Edge Computing & AI Hardware', 'B2B Enterprise Sales'],
  searchHistory: ['Section 179 hardware tax write-off', 'China Shenzhen supply chain logistics', 'SaaS ARR benchmarks'],
  aiInteractionsCount: 42,
  videosWatched: ['v-101', 'v-102'],
  videosLiked: ['v-101'],
  savedItems: ['rec-1', 'rec-3']
};

export const masterRecommendationCatalog: RecommendationItem[] = [
  {
    id: 'rec-1',
    type: 'VIDEO',
    title: 'How to Write Off 100% of Commercial Hardware Under Section 179',
    subtitle: 'Box Technologies Accounting Masterclass',
    description: 'Learn step-by-step how to leverage Section 179 tax codes to write off solar inverters, servers, and computers in the current tax year.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'Tax Strategy Video',
    mlMatchScore: 98,
    mlReasoning: ['Matches search: Section 179 hardware tax', 'Aligns with Tech & Hardware business type', 'High AI conversation overlap'],
    videoDurationSeconds: 440, // 7 min 20 sec (< 8m 30s)
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isLiked: true,
    isSaved: true
  },
  {
    id: 'rec-2',
    type: 'ADVISOR',
    title: 'Felix Zinyenge — Hardware & Tax Architect',
    subtitle: 'Founder @ Box Technologies',
    description: 'Specializes in scaling hardware manufacturing ARR from $100k to $5M while optimizing corporate tax liabilities.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'Verified Mentor',
    mlMatchScore: 96,
    mlReasoning: ['Direct goal match: Scale ARR to $1M+', 'Industry alignment: Technology & Hardware'],
    advisorRating: 4.95,
    isLiked: false,
    isSaved: false
  },
  {
    id: 'rec-3',
    type: 'BOOK',
    title: 'The Lean Startup: Constant Innovation Strategy',
    subtitle: 'by Eric Ries',
    description: 'Essential executive reading on Build-Measure-Learn feedback loops for hardware and SaaS startups.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'Executive Book',
    mlMatchScore: 94,
    mlReasoning: ['Based on previous books saved', 'Matches goals: Product Innovation'],
    bookPages: 336,
    isLiked: true,
    isSaved: true
  },
  {
    id: 'rec-4',
    type: 'FINANCIAL_TIP',
    title: 'Reinvest Q3 Solar Revenue into R&D for 22% Tax Credit',
    subtitle: 'AI Automated Ledger Insight',
    description: 'Our ML tax models detected $18,400 in surplus net margins. Reinvesting this prior to Dec 31 unlocks immediate state & federal research tax credits.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'Smart Financial Tip',
    mlMatchScore: 93,
    mlReasoning: ['Analyzed spending behavior ($26,200/mo)', 'Triggered by Section 179 interest'],
    financialSavingsEstimate: '$18,400 Tax Credit',
    isLiked: false,
    isSaved: false
  },
  {
    id: 'rec-5',
    type: 'OPPORTUNITY',
    title: 'Shenzhen Hardware Procurement Consortium Batch #4',
    subtitle: 'Group Buying Power for Tech Founders',
    description: 'Join 14 other Box Tech hardware companies to pool component orders and reduce unit costs by up to 28% on fiber optics and lithium cells.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'B2B Trade Opportunity',
    mlMatchScore: 91,
    mlReasoning: ['Matches search history: Shenzhen supply chain', 'Custom tailored for $26k+ monthly spenders'],
    opportunityValuation: '28% Component Cost Reduction',
    isLiked: false,
    isSaved: false
  },
  {
    id: 'rec-6',
    type: 'COMMUNITY',
    title: 'B2B Hardware & CleanTech Founders Club',
    subtitle: '1,840 Active Enterprise Members',
    description: 'Private community for founders sharing raw manufacturing suppliers, tax accountants, and wholesale distribution channels.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'Peer Community',
    mlMatchScore: 89,
    mlReasoning: ['High affinity with joined communities', 'Frequent topic in AI assistant prompts'],
    communityMembers: 1840,
    isLiked: false,
    isSaved: false
  },
  {
    id: 'rec-7',
    type: 'VIDEO',
    title: 'Building Zero-Latency Edge AI Hardware Firmware',
    subtitle: '8 Min Tech Breakdown',
    description: 'Walkthrough of Rust firmware design patterns for edge compute nodes with thermal regulation.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'Tech Video',
    mlMatchScore: 88,
    mlReasoning: ['Watched similar video v-101', 'Length: 8m 10s (< 8m 30s limit)'],
    videoDurationSeconds: 490, // 8 min 10 sec (< 8m 30s)
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isLiked: false,
    isSaved: false
  },
  {
    id: 'rec-8',
    type: 'VIDEO',
    title: 'POS Payment Processing Fee Optimization Masterclass',
    subtitle: 'MintStep Financial Series',
    description: 'How to negotiate interchange-plus merchant rates down to 1.2% for high-volume retail terminals.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=500&q=80',
    badgeTag: 'POS Video',
    mlMatchScore: 87,
    mlReasoning: ['Analyzed POS transaction volume', 'Matches goal: Reduce Merchant Fees'],
    videoDurationSeconds: 380, // 6 min 20 sec
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isLiked: false,
    isSaved: false
  }
];

export const MintStepRecommendationEngine: React.FC = () => {
  const [signals, setSignals] = useState<UserSignals>(() => {
    const saved = localStorage.getItem('mintstep_signals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialSignals;
  });

  const [items, setItems] = useState<RecommendationItem[]>(masterRecommendationCatalog);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'VIDEO' | 'BOOK' | 'COMMUNITY' | 'ADVISOR' | 'OPPORTUNITY' | 'FINANCIAL_TIP'>('ALL');
  
  // ML Weight Boost Controls
  const [taxBoostWeight, setTaxBoostWeight] = useState<number>(1.2);
  const [videoBoostWeight, setVideoBoostWeight] = useState<number>(1.1);

  // Infinite Scroll Feed Count
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Video Player Modal
  const [activeVideoModal, setActiveVideoModal] = useState<RecommendationItem | null>(null);

  // ML Breakdown Detail Modal
  const [activeMlDetail, setActiveMlDetail] = useState<RecommendationItem | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Persist signals
  useEffect(() => {
    localStorage.setItem('mintstep_signals', JSON.stringify(signals));
  }, [signals]);

  // Recalculate ML Scores dynamically whenever signals or weight controls change
  useEffect(() => {
    setItems(prevItems => {
      return prevItems.map(item => {
        let score = item.mlMatchScore;
        if (item.type === 'VIDEO') score = Math.min(99, Math.round(score * videoBoostWeight));
        if (item.title.toLowerCase().includes('tax') || item.badgeTag.toLowerCase().includes('tax')) {
          score = Math.min(99, Math.round(score * taxBoostWeight));
        }
        return { ...item, mlMatchScore: score };
      }).sort((a, b) => b.mlMatchScore - a.mlMatchScore);
    });
  }, [taxBoostWeight, videoBoostWeight, signals]);

  // Toggle Like & Update Signals
  const handleToggleLike = (itemId: string) => {
    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const nextLiked = !i.isLiked;
        triggerToast(nextLiked ? `❤️ Liked! Engine re-weighted vector` : `Unliked recommendation`);
        
        // Update user signals
        setSignals(s => ({
          ...s,
          videosLiked: nextLiked ? [...s.videosLiked, itemId] : s.videosLiked.filter(x => x !== itemId)
        }));

        return { ...i, isLiked: nextLiked };
      }
      return i;
    }));
  };

  // Toggle Save & Update Signals
  const handleToggleSave = (itemId: string) => {
    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const nextSaved = !i.isSaved;
        triggerToast(nextSaved ? `🔖 Saved to reading stack!` : `Removed from saved items`);
        
        setSignals(s => ({
          ...s,
          savedItems: nextSaved ? [...s.savedItems, itemId] : s.savedItems.filter(x => x !== itemId)
        }));

        return { ...i, isSaved: nextSaved };
      }
      return i;
    }));
  };

  // Trigger Infinite Scroll Load
  const handleLoadMoreInfinite = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(items.length, prev + 2));
      setIsLoadingMore(false);
      triggerToast("⚡ Streamed +2 fresh ML ranked items into feed!");
    }, 600);
  };

  // Helper duration formatter
  const formatSeconds = (sec?: number) => {
    if (!sec) return '00:00';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredItems = items.filter(i => selectedFilter === 'ALL' || i.type === selectedFilter);
  const visibleItems = filteredItems.slice(0, visibleCount);

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-500 text-slate-950 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Cpu className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep ML Recommendation Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                Neural Vector Ranker v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time personalized feed across Videos (≤8m 30s), Books, Advisors, Communities & Financial Tips</p>
          </div>
        </div>

        {/* Live Vector Signals Summary Pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center space-x-3">
          <div>
            <span className="text-[10px] text-slate-500 block">Watched: {signals.videosWatched.length}</span>
            <span className="text-emerald-400 font-bold">{signals.businessType}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">AI Interactions:</span>
            <span className="text-indigo-400 font-bold">{signals.aiInteractionsCount} Prompts</span>
          </div>
        </div>
      </div>

      {/* Real-time ML Parameter Tuning Toolbar */}
      <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Live Neural Model Weight Controls</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Dynamic Real-Time Re-ranking</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Tax Optimization Weight Boost:</span>
              <span className="text-emerald-400 font-bold">{taxBoostWeight}x</span>
            </div>
            <input 
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={taxBoostWeight}
              onChange={(e) => setTaxBoostWeight(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Video Shorts Boost (&le;8m 30s):</span>
              <span className="text-indigo-400 font-bold">{videoBoostWeight}x</span>
            </div>
            <input 
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={videoBoostWeight}
              onChange={(e) => setVideoBoostWeight(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Domain Category Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'ALL', label: 'All ML Matches', icon: Sparkles },
          { id: 'VIDEO', label: 'Videos (≤8m 30s)', icon: Video },
          { id: 'BOOK', label: 'Books', icon: BookOpen },
          { id: 'ADVISOR', label: 'Advisors', icon: GraduationCap },
          { id: 'COMMUNITY', label: 'Communities', icon: Users },
          { id: 'OPPORTUNITY', label: 'Opportunities', icon: Briefcase },
          { id: 'FINANCIAL_TIP', label: 'Financial Tips', icon: Lightbulb },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === tab.id 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ML Recommendation Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleItems.map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div className="space-y-3">
              
              {/* Card Header & ML Match Pill */}
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] font-mono font-black uppercase">
                  {item.badgeTag}
                </span>

                <button
                  onClick={() => setActiveMlDetail(item)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-black border border-emerald-500/30 flex items-center space-x-1 cursor-pointer"
                  title="View Neural Network Match Score Explanation"
                >
                  <Cpu className="w-3 h-3" />
                  <span>{item.mlMatchScore}% ML Match</span>
                </button>
              </div>

              {/* Media Thumbnail or Banner */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                
                {/* Video Play Button Overlay if type === VIDEO */}
                {item.type === 'VIDEO' && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
                    <button 
                      onClick={() => setActiveVideoModal(item)}
                      className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                    </button>

                    {/* Enforced Video Length Badge (≤ 8m 30s) */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-100 font-mono text-[10px] font-bold flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{formatSeconds(item.videoDurationSeconds)} (Max 8:30)</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-base font-black text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 font-mono mt-0.5">{item.subtitle}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.description}</p>

              {/* Domain Specific Metrics */}
              {item.financialSavingsEstimate && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-mono text-xs text-emerald-400 font-bold flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Estimated Savings: {item.financialSavingsEstimate}</span>
                </div>
              )}

              {item.opportunityValuation && (
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl font-mono text-xs text-indigo-400 font-bold flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Impact: {item.opportunityValuation}</span>
                </div>
              )}
            </div>

            {/* Card Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => handleToggleLike(item.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    item.isLiked ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100'
                  }`}
                  title="Like Item"
                >
                  <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-rose-400' : ''}`} />
                </button>

                <button
                  onClick={() => handleToggleSave(item.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    item.isSaved ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100'
                  }`}
                  title="Bookmark Item"
                >
                  <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              {item.type === 'VIDEO' ? (
                <button
                  onClick={() => setActiveVideoModal(item)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Watch ({formatSeconds(item.videoDurationSeconds)})</span>
                </button>
              ) : (
                <button
                  onClick={() => triggerToast(`⚡ Engaged with ${item.title}`)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Explore Recommendation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </motion.div>
        ))}
      </div>

      {/* Infinite Scroll Load Trigger */}
      {visibleCount < filteredItems.length && (
        <div className="pt-4 text-center">
          <button
            onClick={handleLoadMoreInfinite}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-200 hover:text-emerald-400 font-bold text-xs transition-all flex items-center justify-center space-x-2 mx-auto cursor-pointer shadow-xl"
          >
            {isLoadingMore ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Computing Neural Embeddings...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Load More Feed Items (Infinite Stream)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* --- VIDEO PLAYER MODAL (Enforces Max 8m 30s) --- */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 relative"
            >
              <button 
                onClick={() => setActiveVideoModal(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  Duration: {formatSeconds(activeVideoModal.videoDurationSeconds)} (Max 8m 30s)
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-1">{activeVideoModal.title}</h3>
                <p className="text-xs text-slate-400">{activeVideoModal.subtitle}</p>
              </div>

              <div className="w-full rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video">
                <video 
                  src={activeVideoModal.videoUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ML REASONING EXPLANATION MODAL --- */}
      <AnimatePresence>
        {activeMlDetail && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <button 
                onClick={() => setActiveMlDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-emerald-400">
                <Cpu className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">ML Match Score Breakdown</h3>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Calculated Score:</span>
                  <span className="text-emerald-400 font-black text-base">{activeMlDetail.mlMatchScore}% Match</span>
                </div>

                <span className="text-[10px] text-slate-500 uppercase font-bold block pt-1">Model Reasoning Vectors:</span>
                <div className="space-y-1.5">
                  {activeMlDetail.mlReasoning.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveMlDetail(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Close Explanation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MintStepRecommendationEngine;
