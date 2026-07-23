import React, { useState, useEffect } from 'react';
import { 
  User, Camera, Edit3, Target, Video, Users, Award, Bookmark, Settings, 
  Moon, Sun, Shield, Lock, Eye, EyeOff, Check, Plus, Trash2, ExternalLink, 
  Sparkles, CheckCircle2, Play, Heart, Share2, Bell, Smartphone, Palette,
  Globe, ShieldCheck, ArrowUpRight, Flame, Layers, TrendingUp, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'Wealth' | 'Tax Exemption' | 'Capital Hardware' | 'Real Estate' | 'Emergency';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface SavedVideoItem {
  id: string;
  title: string;
  author: string;
  avatar: string;
  duration: string;
  thumbnail: string;
  views: string;
  category: string;
  videoUrl?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'Investor' | 'Community' | 'Tax Efficiency' | 'Pioneer';
  icon: string;
  unlockedAt: string;
  isUnlocked: boolean;
  progress: number; // 0 to 100
}

export interface PersonalBookmark {
  id: string;
  title: string;
  source: string;
  category: string;
  dateSaved: string;
  snippet: string;
}

export interface PersonalProfileData {
  name: string;
  title: string;
  photo: string;
  bio: string;
  location: string;
  email: string;
  joinedDate: string;
}

const DEFAULT_PERSONAL_PROFILE: PersonalProfileData = {
  name: 'Farai Zinyenge',
  title: 'High Net Worth Private Investor & Enterprise Tech Architect',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Building liquid-cooled validator infrastructure, optimizing corporate tax write-offs through Section 179, and mentoring next-gen hardware founders.',
  location: 'San Francisco, CA • Silicon Valley Zone',
  email: 'f.zinyenge@wealthflow.io',
  joinedDate: 'Member since Jan 2024'
};

const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'fg-1',
    title: 'Section 179 Tax Deductible Server Rig Expansion',
    category: 'Capital Hardware',
    targetAmount: 150000,
    currentAmount: 112500,
    deadline: 'Dec 2026',
    icon: '⚡'
  },
  {
    id: 'fg-2',
    title: 'Liquid Yield Reserve Emergency Fund',
    category: 'Emergency',
    targetAmount: 50000,
    currentAmount: 50000,
    deadline: 'Achieved',
    icon: '🛡️'
  },
  {
    id: 'fg-3',
    title: 'Commercial Datacenter Real Estate Allocation',
    category: 'Real Estate',
    targetAmount: 500000,
    currentAmount: 280000,
    deadline: 'Q4 2027',
    icon: '🏢'
  }
];

const INITIAL_SAVED_VIDEOS: SavedVideoItem[] = [
  {
    id: 'sv-vid-1',
    title: '100% Tax Write-Offs: How to Lease Liquid Helium Node Rigs',
    author: 'Elena Vance, CPA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    duration: '1:45',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    views: '24.5K views',
    category: 'Tax Strategy'
  },
  {
    id: 'sv-vid-2',
    title: 'Why Liquid-Cooled Staking Hardware Yields 3x ROI in 2026',
    author: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    duration: '2:10',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    views: '18.2K views',
    category: 'Hardware Yield'
  },
  {
    id: 'sv-vid-3',
    title: 'Structuring Family Office Real Estate & High-Yield Vaults',
    author: 'Marcus Sterling',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    duration: '3:05',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    views: '42.1K views',
    category: 'Wealth Structuring'
  }
];

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Section 179 Master',
    description: 'Claimed over $100K in hardware capital depreciation write-offs.',
    category: 'Tax Efficiency',
    icon: '📜',
    unlockedAt: 'Unlocked Jul 12, 2026',
    isUnlocked: true,
    progress: 100
  },
  {
    id: 'ach-2',
    title: 'Liquid Helium Pioneer',
    description: 'Deployed 5+ liquid cooled server manifolds in production.',
    category: 'Pioneer',
    icon: '❄️',
    unlockedAt: 'Unlocked Jun 04, 2026',
    isUnlocked: true,
    progress: 100
  },
  {
    id: 'ach-3',
    title: 'Community Pillar',
    description: 'Published 25+ verified answers and mentored 3 startup founders.',
    category: 'Community',
    icon: '🏛️',
    unlockedAt: 'Unlocked May 19, 2026',
    isUnlocked: true,
    progress: 100
  },
  {
    id: 'ach-4',
    title: 'Seven-Figure Portfolio Node',
    description: 'Surpassed $1,000,000 in tracked liquid capital & hardware reserves.',
    category: 'Investor',
    icon: '💎',
    unlockedAt: 'In Progress (85%)',
    isUnlocked: false,
    progress: 85
  }
];

const INITIAL_BOOKMARKS: PersonalBookmark[] = [
  {
    id: 'pb-1',
    title: '2026 IRS Section 179 Immediate Depreciation Threshold Guidelines',
    source: 'Financial Compliance Guild',
    category: 'Tax Strategy',
    dateSaved: 'Jul 19, 2026',
    snippet: 'Full breakdown of capital expensing limits for high-density staking hardware and server cooling systems.'
  },
  {
    id: 'pb-2',
    title: 'Cryogenic Fluid Viscosity Optimization for 22 L/min Cooling Manifolds',
    source: 'Enterprise Hardware Syndicate',
    category: 'Engineering',
    dateSaved: 'Jul 14, 2026',
    snippet: 'Step-by-step fluid flush guide for maintaining zero cavitation in high-density rack deployments.'
  }
];

export default function PersonalProfile() {
  // --- Profile State ---
  const [profile, setProfile] = useState<PersonalProfileData>(() => {
    const saved = localStorage.getItem('wf_personal_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PERSONAL_PROFILE;
  });

  // --- Active Sub-Tab State ---
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'saved_videos' | 'communities' | 'achievements' | 'bookmarks' | 'settings'>('overview');

  // --- Dynamic Items States ---
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [savedVideos, setSavedVideos] = useState<SavedVideoItem[]>(INITIAL_SAVED_VIDEOS);
  const [achievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [bookmarks, setBookmarks] = useState<PersonalBookmark[]>(INITIAL_BOOKMARKS);

  // Joined Communities mockup
  const [joinedCommunities] = useState([
    { id: 'c1', name: 'Web3 Hardware & Staking Rigs', members: '14,250', activity: 'High', logo: '⚡' },
    { id: 'c2', name: 'Section 179 Tax Optimization', members: '8,920', activity: 'Very High', logo: '🏛️' },
    { id: 'c3', name: 'Silicon Valley Angel Capital', members: '5,110', activity: 'Moderate', logo: '💼' }
  ]);

  // --- Settings States ---
  const [themeMode, setThemeMode] = useState<'midnight' | 'emerald' | 'obsidian'>('midnight');
  const [accentColor, setAccentColor] = useState<'emerald' | 'cyan' | 'amber' | 'violet'>('emerald');
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showFinancialBadges: true,
    hideNetWorthFigures: false,
    anonymousPosting: false,
    biometricLock: true,
    emailDigest: 'Daily Brief'
  });

  // Edit Bio Modal
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState(profile.bio);
  const [editNameText, setEditNameText] = useState(profile.name);
  const [editTitleText, setEditTitleText] = useState(profile.title);
  const [editPhotoUrl, setEditPhotoUrl] = useState(profile.photo);

  // New Goal Modal State
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'Wealth' | 'Tax Exemption' | 'Capital Hardware' | 'Real Estate' | 'Emergency'>('Capital Hardware');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(50000);
  const [newGoalCurrent, setNewGoalCurrent] = useState<number>(10000);

  // Video Playing Modal State
  const [selectedVideo, setSelectedVideo] = useState<SavedVideoItem | null>(null);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('wf_personal_profile', JSON.stringify(profile));
  }, [profile]);

  // Handle Save Bio & Details
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: editNameText,
      title: editTitleText,
      bio: editBioText,
      photo: editPhotoUrl
    }));
    setIsEditingBio(false);
    showToast('✨ Personal profile updated successfully!');
  };

  // Add Financial Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) {
      showToast('⚠️ Please provide a title for your financial goal.');
      return;
    }

    const goal: FinancialGoal = {
      id: `fg-${Date.now()}`,
      title: newGoalTitle,
      category: newGoalCategory,
      targetAmount: Number(newGoalTarget),
      currentAmount: Number(newGoalCurrent),
      deadline: 'Dec 2027',
      icon: newGoalCategory === 'Tax Exemption' ? '📜' : newGoalCategory === 'Capital Hardware' ? '⚡' : '💰'
    };

    setGoals(prev => [goal, ...prev]);
    setIsAddingGoal(false);
    setNewGoalTitle('');
    showToast('🎯 New financial target locked in!');
  };

  // Remove Saved Video
  const handleRemoveVideo = (id: string) => {
    setSavedVideos(prev => prev.filter(v => v.id !== id));
    showToast('Video clip removed from saved library.');
  };

  // Remove Bookmark
  const handleRemoveBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    showToast('Bookmark removed.');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans p-4 lg:p-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 border border-slate-700 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold text-slate-100 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ========================================================= */}
        {/* PERSONAL PROFILE HEADER CARD                               */}
        {/* ========================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            {/* Avatar & Core Bio Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Photo Upload Container */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-slate-800 bg-slate-950 shadow-2xl overflow-hidden shrink-0 relative">
                  <img 
                    src={profile.photo} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    onClick={() => {
                      setEditBioText(profile.bio);
                      setEditNameText(profile.name);
                      setEditTitleText(profile.title);
                      setEditPhotoUrl(profile.photo);
                      setIsEditingBio(true);
                    }}
                    className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-slate-200 cursor-pointer backdrop-blur-xs"
                  >
                    <Camera className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Change</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl border-2 border-slate-900 shadow-md" title="Verified Investor">
                  <ShieldCheck className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">{profile.name}</h1>
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Accredited Investor
                  </span>
                </div>

                <p className="text-xs font-bold text-emerald-400 max-w-xl">{profile.title}</p>

                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" /> {profile.location}
                  </span>
                  <span>•</span>
                  <span>{profile.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <button
                onClick={() => {
                  setEditBioText(profile.bio);
                  setEditNameText(profile.name);
                  setEditTitleText(profile.title);
                  setEditPhotoUrl(profile.photo);
                  setIsEditingBio(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Stat Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Financial Goals</span>
              <span className="text-lg font-black text-slate-100">{goals.length} Active</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Saved Videos</span>
              <span className="text-lg font-black text-emerald-400">{savedVideos.length} Clips</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Communities</span>
              <span className="text-lg font-black text-slate-100">{joinedCommunities.length} Joined</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Badges Unlocked</span>
              <span className="text-lg font-black text-amber-400">{achievements.filter(a => a.isUnlocked).length} / {achievements.length}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SUB-TAB NAVIGATION                                         */}
        {/* ========================================================= */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto shadow-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Financial Goals ({goals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved_videos')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'saved_videos'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Saved Videos ({savedVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('communities')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'communities'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Communities ({joinedCommunities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Achievements</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarks</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD SUMMARY                          */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Financial Goals Quick Widget */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Top Financial Targets</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('goals')}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {goals.slice(0, 2).map(goal => {
                    const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    return (
                      <div key={goal.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{goal.icon}</span>
                            <span className="text-xs font-black text-slate-100">{goal.title}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">{pct}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-1">
                          <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                          <span>Target: {goal.deadline}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Saved Video Highlights */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Recent Saved Advisory Clips</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('saved_videos')}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Browse Library</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedVideos.slice(0, 2).map(vid => (
                    <div 
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden group cursor-pointer hover:border-slate-700 transition-all"
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-200">
                          {vid.duration}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-black text-slate-200 line-clamp-1">{vid.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{vid.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Badges Box */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Unlocked Badges</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('achievements')}
                    className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {achievements.filter(a => a.isUnlocked).map(badge => (
                    <div key={badge.id} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-100">{badge.title}</h4>
                        <span className="text-[10px] text-emerald-400 font-bold block">{badge.unlockedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Joined Communities Quick Box */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Joined Guilds</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('communities')}
                    className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-2">
                  {joinedCommunities.map(c => (
                    <div key={c.id} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.logo}</span>
                        <span className="text-xs font-bold text-slate-200">{c.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{c.members}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FINANCIAL GOALS                                     */}
        {/* ========================================================= */}
        {activeTab === 'goals' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Personal Wealth & Capital Objectives</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Track progress toward capital expenditure, tax reserve, and yield milestones.</p>
              </div>

              <button
                onClick={() => setIsAddingGoal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>New Goal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goals.map(goal => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div 
                    key={goal.id}
                    className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl bg-slate-950 p-2 rounded-xl border border-slate-800">{goal.icon}</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-100">{goal.title}</h4>
                            <span className="text-[10px] text-emerald-400 font-bold block">{goal.category}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setGoals(prev => prev.filter(g => g.id !== goal.id));
                            showToast('Financial goal removed.');
                          }}
                          className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-400">Target Progress</span>
                          <span className="text-emerald-400 font-mono font-black">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-500 block">Saved / Target</span>
                          <span className="font-mono font-bold text-slate-200">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase font-black text-slate-500 block">Deadline</span>
                          <span className="font-mono font-bold text-emerald-400">{goal.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + 5000) } : g));
                        showToast(`Added +$5,000 capital contribution to ${goal.title}`);
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 rounded-xl border border-slate-700 transition-all cursor-pointer"
                    >
                      + Add $5,000 Funds
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SAVED ADVISORY VIDEOS                              */}
        {/* ========================================================= */}
        {activeTab === 'saved_videos' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Bookmarked Advisory & Short Clips</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Quick tax advice, hardware walkthroughs, and liquidity guides saved for off-line reference.</p>
              </div>

              <span className="text-xs font-mono text-slate-400 font-bold">{savedVideos.length} Saved Videos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVideos.map(vid => (
                <div 
                  key={vid.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-slate-950 group cursor-pointer" onClick={() => setSelectedVideo(vid)}>
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-slate-200">
                      {vid.duration}
                    </span>
                    <span className="absolute top-3 left-3 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-black uppercase text-emerald-400 backdrop-blur-md">
                      {vid.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-black text-slate-100 line-clamp-2">{vid.title}</h4>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
                      <div className="flex items-center gap-2">
                        <img src={vid.avatar} alt={vid.author} className="w-5 h-5 rounded-full object-cover" />
                        <span>{vid.author}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{vid.views}</span>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedVideo(vid)}
                        className="text-xs font-black text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Watch Clip</span>
                      </button>

                      <button
                        onClick={() => handleRemoveVideo(vid.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COMMUNITIES                                         */}
        {/* ========================================================= */}
        {activeTab === 'communities' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Your Active Wealth Communities & Guilds</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Private networks where you participate, share verified answers, and structure deals.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {joinedCommunities.map(comm => (
                <div key={comm.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3 text-left hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl bg-slate-950 p-2.5 rounded-xl border border-slate-800">{comm.logo}</span>
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Member
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-100">{comm.name}</h4>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>{comm.members} Members</span>
                    <span className="text-emerald-400">{comm.activity} Activity</span>
                  </div>

                  <button
                    onClick={() => showToast(`Redirecting to ${comm.name} forum...`)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Enter Guild Forum</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ACHIEVEMENTS & BADGES                               */}
        {/* ========================================================= */}
        {activeTab === 'achievements' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Investor Achievements & Honors</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">On-chain cryptographic badges proving your capital contributions, tax expertise, and community rank.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(ach => (
                <div 
                  key={ach.id}
                  className={`border p-5 rounded-2xl shadow-xl space-y-3 transition-all text-left ${
                    ach.isUnlocked 
                      ? 'bg-slate-900 border-emerald-500/30' 
                      : 'bg-slate-950/60 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-slate-950 p-2.5 rounded-2xl border border-slate-800">{ach.icon}</span>
                      <div>
                        <h4 className="text-sm font-black text-slate-100">{ach.title}</h4>
                        <span className="text-[10px] font-bold text-amber-400 uppercase">{ach.category}</span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded border ${
                      ach.isUnlocked 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {ach.isUnlocked ? 'Verified' : 'Locked'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-slate-500 font-bold">Status</span>
                    <span className="font-bold text-emerald-400">{ach.unlockedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: BOOKMARKS                                           */}
        {/* ========================================================= */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Saved Articles, Tax Guides & Discussion Threads</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">{bookmarks.length} Bookmarks</span>
            </div>

            <div className="space-y-3">
              {bookmarks.map(bm => (
                <div key={bm.id} className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl shadow-md space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                        {bm.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">• {bm.source}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{bm.dateSaved}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-100">{bm.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{bm.snippet}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => showToast('Opened bookmarked document.')}
                      className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleRemoveBookmark(bm.id)}
                      className="text-[10px] font-bold text-slate-500 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      Delete Bookmark
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: SETTINGS & PRIVACY                                  */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 text-left">
            
            {/* Theme & Visual Preferences */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Theme & Visual Aesthetics</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Customize your interface theme, contrast palette, and dashboard highlights.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Theme Palette Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setThemeMode('midnight');
                        showToast('Applied Deep Midnight Theme.');
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        themeMode === 'midnight' 
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Deep Midnight</span>
                    </button>

                    <button
                      onClick={() => {
                        setThemeMode('emerald');
                        showToast('Applied Obsidian Emerald Theme.');
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        themeMode === 'emerald' 
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Obsidian Emerald</span>
                    </button>

                    <button
                      onClick={() => {
                        setThemeMode('obsidian');
                        showToast('Applied High Contrast Dark Theme.');
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        themeMode === 'obsidian' 
                          ? 'bg-slate-800 border-emerald-500 text-emerald-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>High Contrast</span>
                    </button>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Accent Highlight Color</label>
                  <div className="flex items-center gap-3">
                    {(['emerald', 'cyan', 'amber', 'violet'] as const).map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setAccentColor(color);
                          showToast(`Set accent color to ${color.toUpperCase()}.`);
                        }}
                        className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                          accentColor === color ? 'border-slate-100 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                        } ${
                          color === 'emerald' ? 'bg-emerald-500' :
                          color === 'cyan' ? 'bg-cyan-500' :
                          color === 'amber' ? 'bg-amber-500' : 'bg-violet-500'
                        }`}
                      >
                        {accentColor === color && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Vault Controls */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Privacy, Anonymity & Vault Security</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Control what financial metrics and verified badges are visible to other investors.</p>
              </div>

              <div className="space-y-4">
                {/* Switch 1: Public Profile */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-slate-100 block">Public Profile Discovery</span>
                    <span className="text-[11px] text-slate-400 font-medium block">Allow other accredited investors to view your bio and verified badges</span>
                  </div>
                  <button
                    onClick={() => {
                      setPrivacySettings(prev => ({ ...prev, publicProfile: !prev.publicProfile }));
                      showToast('Updated profile visibility preference.');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                      privacySettings.publicProfile ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
                  </button>
                </div>

                {/* Switch 2: Hide Exact Net Worth Figures */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-slate-100 block">Hide Dollar Values in Screenshots</span>
                    <span className="text-[11px] text-slate-400 font-medium block">Mask exact net worth and capital balances with asterisks (***) for privacy</span>
                  </div>
                  <button
                    onClick={() => {
                      setPrivacySettings(prev => ({ ...prev, hideNetWorthFigures: !prev.hideNetWorthFigures }));
                      showToast('Updated privacy masking preference.');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                      privacySettings.hideNetWorthFigures ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
                  </button>
                </div>

                {/* Switch 3: Anonymous Q&A Mode */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-slate-100 block">Anonymous Guild Questions</span>
                    <span className="text-[11px] text-slate-400 font-medium block">Post sensitive tax and yield questions as "Verified Investor #402"</span>
                  </div>
                  <button
                    onClick={() => {
                      setPrivacySettings(prev => ({ ...prev, anonymousPosting: !prev.anonymousPosting }));
                      showToast('Toggled anonymous Q&A mode.');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                      privacySettings.anonymousPosting ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
                  </button>
                </div>

                {/* Switch 4: Biometric Lock */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-slate-100 block">Biometric Hardware Security</span>
                    <span className="text-[11px] text-slate-400 font-medium block">Require WebAuthn / FaceID passkey before revealing private tax templates</span>
                  </div>
                  <button
                    onClick={() => {
                      setPrivacySettings(prev => ({ ...prev, biometricLock: !prev.biometricLock }));
                      showToast('Updated biometric vault lock setting.');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                      privacySettings.biometricLock ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* EDIT PERSONAL PROFILE MODAL                                */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditingBio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                  <span>Edit Personal Profile</span>
                </h3>
                <button 
                  onClick={() => setIsEditingBio(false)}
                  className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBio} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    value={editNameText} 
                    onChange={e => setEditNameText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Title / Role</label>
                  <input 
                    type="text" 
                    value={editTitleText} 
                    onChange={e => setEditTitleText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Avatar Photo URL</label>
                  <input 
                    type="url" 
                    value={editPhotoUrl} 
                    onChange={e => setEditPhotoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Personal Bio</label>
                  <textarea 
                    rows={4}
                    value={editBioText} 
                    onChange={e => setEditBioText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-medium focus:border-emerald-500 outline-none leading-relaxed"
                    required 
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-black text-slate-950 uppercase cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* ADD FINANCIAL GOAL MODAL                                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAddingGoal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span>Set New Financial Target</span>
                </h3>
                <button onClick={() => setIsAddingGoal(false)} className="text-slate-500 hover:text-slate-200 cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Goal Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., $100K Tax Free Liquidity Reserve"
                    value={newGoalTitle}
                    onChange={e => setNewGoalTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <select 
                    value={newGoalCategory}
                    onChange={e => setNewGoalCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:border-emerald-500 outline-none"
                  >
                    <option value="Capital Hardware">Capital Hardware</option>
                    <option value="Tax Exemption">Tax Exemption</option>
                    <option value="Wealth">Wealth Growth</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Emergency">Emergency Yield</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Target Amount ($)</label>
                    <input 
                      type="number" 
                      value={newGoalTarget}
                      onChange={e => setNewGoalTarget(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono font-bold focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Current Saved ($)</label>
                    <input 
                      type="number" 
                      value={newGoalCurrent}
                      onChange={e => setNewGoalCurrent(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono font-bold focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingGoal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-black text-slate-950 uppercase cursor-pointer"
                  >
                    Lock Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* VIDEO PLAYBACK MODAL                                       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl space-y-4 p-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                  {selectedVideo.category}
                </span>
                <button onClick={() => setSelectedVideo(null)} className="text-slate-400 hover:text-slate-100 font-bold cursor-pointer">
                  ✕ Close
                </button>
              </div>

              <div className="relative h-64 sm:h-80 w-full bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img src={selectedVideo.thumbnail} alt={selectedVideo.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                    Playing High Definition Advisory Brief
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-100">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Presented by {selectedVideo.author} • {selectedVideo.views}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
