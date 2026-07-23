import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Globe, Twitter, Linkedin, Github, Youtube, Send,
  Edit3, Share2, Bookmark, Users, GraduationCap, Award, TrendingUp, Eye,
  ThumbsUp, MessageSquare, Plus, Check, ExternalLink, Sparkles, ShieldCheck,
  Calendar, Briefcase, FileText, BarChart3, PieChart as PieChartIcon, Settings,
  Camera, X, CheckCircle2, ArrowUpRight, Search, Heart, RefreshCw, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

export interface BusinessProfileData {
  name: string;
  logo: string;
  coverPhoto: string;
  bio: string;
  industry: string;
  location: string;
  website: string;
  socials: {
    twitter: string;
    linkedin: string;
    github: string;
    youtube: string;
    telegram: string;
  };
  verified: boolean;
  established: string;
  teamSize: string;
}

export interface BusinessPost {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  likes: number;
  commentsCount: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isPinned?: boolean;
  image?: string;
}

export interface AdvisorItem {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  status: 'Active Advisor' | 'Board Member' | 'On-Call';
  bio: string;
  hourlyRate: string;
  sessionsCompleted: number;
}

export interface MenteeItem {
  id: string;
  companyName: string;
  founderName: string;
  stage: 'Idea' | 'Seed' | 'Pre-A' | 'Series A';
  industry: string;
  logo: string;
  growth: string;
  mentorshipFocus: string;
  lastCheckIn: string;
}

export interface SavedItem {
  id: string;
  title: string;
  type: 'Article' | 'Tax Template' | 'Advisory Brief' | 'Deal Structure';
  source: string;
  dateSaved: string;
  snippet: string;
}

const DEFAULT_PROFILE: BusinessProfileData = {
  name: 'Box Technologies Inc.',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
  coverPhoto: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  bio: 'Pioneering enterprise quantum routing nodes, liquid-cooled staking rigs, and high-performance hardware infrastructure for decentralized networks.',
  industry: 'Enterprise Hardware & Web3 Infrastructure',
  location: 'San Francisco, CA • Silicon Valley Zone',
  website: 'https://boxtech.io',
  socials: {
    twitter: 'https://twitter.com/boxtech_io',
    linkedin: 'https://linkedin.com/company/box-technologies',
    github: 'https://github.com/boxtech-io',
    youtube: 'https://youtube.com/@boxtechnologies',
    telegram: 'https://t.me/boxtech_official'
  },
  verified: true,
  established: '2023',
  teamSize: '25-50 Engineers'
};

const INITIAL_POSTS: BusinessPost[] = [
  {
    id: 'bp-1',
    title: '🚀 Announcing Box Liquid Helium Node v3.0 Deployment',
    content: 'We are thrilled to reveal our next-generation liquid helium cooled server manifold. Capable of reducing thermal throttling by 42% on high-density validator clusters while maintaining a whisper-quiet 22 L/min fluid velocity profile.',
    category: 'Product Release',
    date: '2 hours ago',
    likes: 142,
    commentsCount: 28,
    views: 1850,
    isLiked: true,
    isSaved: true,
    isPinned: true,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bp-2',
    title: '📊 Q2 Enterprise Revenue Report & Section 179 Capital Tax Provisions',
    content: 'Our corporate ledgers hit $128,000 in gross hardware lease receipts for Q2. Check out our comprehensive guide on how enterprise clients can claim immediate 100% depreciation on Box server rack deployments.',
    category: 'Financial Insights',
    date: '3 days ago',
    likes: 98,
    commentsCount: 14,
    views: 1240,
    isLiked: false,
    isSaved: false,
    isPinned: false
  },
  {
    id: 'bp-3',
    title: '💡 R&D Spotlight: Zero-Knowledge Key Splitting on SSV Validator Nodes',
    content: 'Security meets performance. Our engineering team has implemented distributed key generation (DKG) across multi-signature hardware security modules (HSM) directly inside the Box Nano-Router v2.',
    category: 'Engineering Brief',
    date: '1 week ago',
    likes: 215,
    commentsCount: 39,
    views: 3100,
    isLiked: true,
    isSaved: false,
    isPinned: false,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_ADVISORS: AdvisorItem[] = [
  {
    id: 'adv-1',
    name: 'Dr. Aris Thorne',
    title: 'Chief Fluid Dynamics Advisor',
    specialty: 'Liquid Helium Loops & Cryogenic Hardware',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'Active Advisor',
    bio: 'Former NASA thermal engineer specializing in extreme-density cooling systems for orbital and terrestrial datacenters.',
    hourlyRate: '$350 / hr',
    sessionsCompleted: 18
  },
  {
    id: 'adv-2',
    name: 'Elena Vance, CPA',
    title: 'Senior Tax & Capital Counsel',
    specialty: 'Section 179 Depreciation & R&D Credits',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'Board Member',
    bio: 'Corporate CPA with 15+ years of experience structuring multi-jurisdiction hardware capital tax strategies.',
    hourlyRate: '$400 / hr',
    sessionsCompleted: 24
  },
  {
    id: 'adv-3',
    name: 'Marcus Sterling',
    title: 'Global Enterprise Sales Director',
    specialty: 'B2B Cloud Agreements & SLA Structuring',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'On-Call',
    bio: 'Ex-AWS Sales VP who negotiated over $250M in enterprise hardware leases across Fortune 500 accounts.',
    hourlyRate: '$500 / hr',
    sessionsCompleted: 12
  }
];

const INITIAL_MENTEES: MenteeItem[] = [
  {
    id: 'men-1',
    companyName: 'AetherCool Rigs',
    founderName: 'Alex Chen',
    stage: 'Seed',
    industry: 'Micro-Datacenter Cooling',
    logo: '⚡',
    growth: '+140% MoM Node Installations',
    mentorshipFocus: 'Hardware Manufacturing Scale & Quality Control',
    lastCheckIn: '2 days ago'
  },
  {
    id: 'men-2',
    companyName: 'NanoNode Systems',
    founderName: 'Sophia Patel',
    stage: 'Pre-A',
    industry: 'Lightweight Staking Rigs',
    logo: '🌐',
    growth: '$45K Monthly Recurring Revenue',
    mentorshipFocus: 'B2B Enterprise Distribution & Legal Compliance',
    lastCheckIn: '1 week ago'
  },
  {
    id: 'men-3',
    companyName: 'StarkYield Protocol',
    founderName: 'Dmitri Volkov',
    stage: 'Series A',
    industry: 'DeFi Hardware Security Modules',
    logo: '🛡️',
    growth: '$1.2M Total Value Locked',
    mentorshipFocus: 'Tokenomics Alignment & HSM Security Audits',
    lastCheckIn: '3 weeks ago'
  }
];

const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: 'sv-1',
    title: '2026 IRS Section 179 Capital Expenditure Immediate Write-Off Matrix',
    type: 'Tax Template',
    source: 'Financial Compliance Board',
    dateSaved: 'Jul 18, 2026',
    snippet: 'Full breakdown of eligibility thresholds for server hardware, rack mounts, and cooling manifolds under 100% bonus depreciation.'
  },
  {
    id: 'sv-2',
    title: 'Enterprise Liquid Cooling Manifold Maintenance Protocols (v4.2)',
    type: 'Advisory Brief',
    source: 'Thermal Engineering Guild',
    dateSaved: 'Jul 14, 2026',
    snippet: 'Standard Operating Procedures for purging air pockets and measuring fluid viscosity in 22 L/min dielectric loops.'
  },
  {
    id: 'sv-3',
    title: 'Master B2B Hardware Lease Agreement SLA Template',
    type: 'Deal Structure',
    source: 'Corporate Legal Suite',
    dateSaved: 'Jul 10, 2026',
    snippet: 'Customizable contract clauses for guaranteed 99.99% node uptime, liquid damage waivers, and monthly billing schedules.'
  }
];

const ANALYTICS_VIEWS_DATA = [
  { name: 'Mon', Views: 420, Interactions: 65 },
  { name: 'Tue', Views: 580, Interactions: 92 },
  { name: 'Wed', Views: 890, Interactions: 140 },
  { name: 'Thu', Views: 740, Interactions: 115 },
  { name: 'Fri', Views: 1120, Interactions: 185 },
  { name: 'Sat', Views: 950, Interactions: 150 },
  { name: 'Sun', Views: 1340, Interactions: 210 }
];

const ANALYTICS_REACH_DATA = [
  { name: 'Week 1', Reach: 4200, Engagement: 840 },
  { name: 'Week 2', Reach: 5800, Engagement: 1250 },
  { name: 'Week 3', Reach: 8900, Engagement: 1980 },
  { name: 'Week 4', Reach: 12400, Engagement: 2950 }
];

export default function BusinessProfile() {
  // --- Profile State ---
  const [profile, setProfile] = useState<BusinessProfileData>(() => {
    const saved = localStorage.getItem('wf_biz_profile_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROFILE;
  });

  // --- Tabs State ---
  const [activeTab, setActiveTab] = useState<'posts' | 'advisors' | 'mentees' | 'saved' | 'analytics'>('posts');

  // --- Dynamic Items States ---
  const [posts, setPosts] = useState<BusinessPost[]>(() => {
    const saved = localStorage.getItem('wf_biz_profile_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_POSTS;
  });

  const [advisors, setAdvisors] = useState<AdvisorItem[]>(INITIAL_ADVISORS);
  const [mentees, setMentees] = useState<MenteeItem[]>(INITIAL_MENTEES);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(INITIAL_SAVED_ITEMS);

  // --- Edit Profile Modal State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<BusinessProfileData>(profile);

  // --- Create Post Modal State ---
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Announcement');
  const [newPostImage, setNewPostImage] = useState('');

  // --- Toast Notification ---
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sync profile to LocalStorage
  useEffect(() => {
    localStorage.setItem('wf_biz_profile_data', JSON.stringify(profile));
  }, [profile]);

  // Sync posts to LocalStorage
  useEffect(() => {
    localStorage.setItem('wf_biz_profile_posts', JSON.stringify(posts));
  }, [posts]);

  // Handle Save Edit Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditModalOpen(false);
    showToast('✨ Business profile updated successfully!');
  };

  // Handle Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      showToast('⚠️ Please enter a title and content for your post.');
      return;
    }

    const newPost: BusinessPost = {
      id: `bp-${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      date: 'Just now',
      likes: 1,
      commentsCount: 0,
      views: 12,
      isLiked: true,
      isSaved: false,
      isPinned: false,
      image: newPostImage.trim() || undefined
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
    setIsCreatePostOpen(false);
    showToast('📢 New business update published!');
  };

  // Toggle Like Post
  const toggleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  // Toggle Save Post
  const toggleSavePost = (post: BusinessPost) => {
    const isSaved = post.isSaved;
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isSaved: !isSaved } : p));

    if (!isSaved) {
      // Add to saved tab items
      const newSaved: SavedItem = {
        id: `sv-${Date.now()}`,
        title: post.title,
        type: 'Article',
        source: profile.name,
        dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        snippet: post.content.slice(0, 100) + '...'
      };
      setSavedItems(prev => [newSaved, ...prev]);
      showToast('🔖 Article saved to your bookmarks!');
    } else {
      setSavedItems(prev => prev.filter(s => s.title !== post.title));
      showToast('Removed from saved bookmarks.');
    }
  };

  // Toggle Pin Post
  const togglePinPost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
    showToast('Updated pinned status.');
  };

  // Delete Post
  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Post removed.');
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
        {/* HERO COVER & LOGO HEADER CARD                              */}
        {/* ========================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Cover Photo Banner */}
          <div className="h-52 sm:h-64 w-full relative bg-slate-800 overflow-hidden group">
            <img 
              src={profile.coverPhoto} 
              alt="Cover" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

            {/* Quick Change Cover Action */}
            <button
              onClick={() => {
                setEditForm(profile);
                setIsEditModalOpen(true);
              }}
              className="absolute top-4 right-4 bg-slate-950/70 hover:bg-slate-900 text-slate-200 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Change Cover</span>
            </button>

            {/* Established Badge */}
            <div className="absolute top-4 left-4 bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-black uppercase text-emerald-400 backdrop-blur-md tracking-wider">
              Est. {profile.established} • Enterprise Verified
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              
              {/* Logo & Name Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* Logo Badge */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden shrink-0 relative">
                    <img 
                      src={profile.logo} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {profile.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-xl border-2 border-slate-900 shadow-lg" title="Verified Enterprise">
                      <ShieldCheck className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Title & Metas */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">{profile.name}</h1>
                    {profile.verified && (
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Business
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{profile.industry}</span>
                  </p>

                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.location}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  onClick={() => {
                    setEditForm(profile);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Create Update</span>
                </button>
              </div>
            </div>

            {/* Bio & Links Row */}
            <div className="space-y-4 border-t border-slate-800/80 pt-5">
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-4xl">
                {profile.bio}
              </p>

              {/* Metas & Social Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                {/* Website & Team */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 font-semibold">
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 text-emerald-400 hover:underline font-bold"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{profile.website.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <span className="text-slate-700">•</span>

                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.teamSize}</span>
                  </span>
                </div>

                {/* Social Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {profile.socials.twitter && (
                    <a 
                      href={profile.socials.twitter} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-all"
                      title="Twitter / X"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.socials.linkedin && (
                    <a 
                      href={profile.socials.linkedin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-all"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.socials.github && (
                    <a 
                      href={profile.socials.github} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-all"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.socials.youtube && (
                    <a 
                      href={profile.socials.youtube} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-all"
                      title="YouTube"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.socials.telegram && (
                    <a 
                      href={profile.socials.telegram} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-all"
                      title="Telegram"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Statistics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
              <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Updates & Posts</span>
                <span className="text-lg font-black text-slate-100">{posts.length}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Board Advisors</span>
                <span className="text-lg font-black text-emerald-400">{advisors.length}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Backed Mentees</span>
                <span className="text-lg font-black text-slate-100">{mentees.length}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-2xl text-left">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Saved Briefs</span>
                <span className="text-lg font-black text-slate-100">{savedItems.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROFILE TAB NAVIGATION SWITCHER                            */}
        {/* ========================================================= */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto shadow-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'posts'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Posts ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('advisors')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'advisors'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Advisors ({advisors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mentees')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'mentees'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mentees ({mentees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: BUSINESS POSTS / ANNOUNCEMENTS                      */}
        {/* ========================================================= */}
        {activeTab === 'posts' && (
          <div className="space-y-4 text-left">
            {/* Top Bar for Posts */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Company Dispatches & Articles</span>
              </h3>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </button>
            </div>

            {/* List of Posts */}
            <div className="space-y-4">
              {posts.map(post => (
                <div 
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4 hover:border-slate-700 transition-all relative overflow-hidden"
                >
                  {post.isPinned && (
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md w-max">
                      <Sparkles className="w-3 h-3" /> Pinned Post
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">• {post.date}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-100">{post.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePinPost(post.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          post.isPinned 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                        title="Pin / Unpin"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    {post.content}
                  </p>

                  {/* Optional Image */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden max-h-72 w-full border border-slate-800">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Footer Interaction Bar */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400 font-bold">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isLiked ? 'text-emerald-400' : 'hover:text-slate-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <span className="flex items-center gap-1.5 text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </span>

                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Eye className="w-4 h-4" />
                        <span>{post.views} Views</span>
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSavePost(post)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isSaved ? 'text-emerald-400' : 'hover:text-slate-200'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-emerald-400' : ''}`} />
                      <span>{post.isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BOARD & VERIFIED ADVISORS                            */}
        {/* ========================================================= */}
        {activeTab === 'advisors' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Corporate Board & Advisory Council</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Expert advisors guiding hardware design, capital tax structure, and enterprise scale.</p>
              </div>

              <button
                onClick={() => showToast('Advisory invitation dispatched.')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Invite Advisor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advisors.map(adv => (
                <div 
                  key={adv.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4 hover:border-slate-700 transition-all text-left relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={adv.avatar} alt={adv.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                        <div>
                          <h4 className="text-sm font-black text-slate-100">{adv.name}</h4>
                          <span className="text-[10px] text-emerald-400 font-bold block">{adv.title}</span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-block text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase">
                      {adv.status}
                    </span>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {adv.bio}
                    </p>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                      <span className="text-[10px] uppercase font-black text-slate-500">Specialty</span>
                      <span className="text-[11px] font-bold text-slate-200">{adv.specialty}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">{adv.sessionsCompleted} Advisory Briefs</span>
                    <button
                      onClick={() => showToast(`Consultation requested with ${adv.name}`)}
                      className="text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Schedule</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BACKED MENTEES & STARTUPS                            */}
        {/* ========================================================= */}
        {activeTab === 'mentees' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Incubated Startups & Mentees</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Emerging Web3 hardware startups mentored and supported by Box Technologies.</p>
              </div>

              <button
                onClick={() => showToast('Mentorship application form opened.')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Mentee</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mentees.map(men => (
                <div 
                  key={men.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg font-black">
                          {men.logo}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-100">{men.companyName}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block">Founder: {men.founderName}</span>
                        </div>
                      </div>

                      <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {men.stage}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1">
                        <span className="text-[9px] uppercase font-black text-slate-500 block">Growth Traction</span>
                        <span className="text-xs font-bold text-emerald-400 block">{men.growth}</span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1">
                        <span className="text-[9px] uppercase font-black text-slate-500 block">Mentorship Focus</span>
                        <span className="text-xs font-medium text-slate-300 block">{men.mentorshipFocus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10.5px] text-slate-500 font-bold">
                    <span>Last Sync: {men.lastCheckIn}</span>
                    <button
                      onClick={() => showToast(`Opening check-in log for ${men.companyName}`)}
                      className="text-xs font-black text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      Record Note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SAVED BOOKMARKS & TEMPLATES                         */}
        {/* ========================================================= */}
        {activeTab === 'saved' && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Saved Advisory Briefs & Tax Templates</span>
              </h3>

              <span className="text-xs font-bold text-slate-500">{savedItems.length} Saved</span>
            </div>

            <div className="space-y-3">
              {savedItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl shadow-md space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">• {item.source}</span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-bold">{item.dateSaved}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.snippet}</p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => showToast('Copied content summary to clipboard.')}
                      className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Full Brief</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        setSavedItems(prev => prev.filter(s => s.id !== item.id));
                        showToast('Removed from saved.');
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BUSINESS PROFILE ANALYTICS                          */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Profile Traffic & Deal Flow Analytics</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Real-time metrics on profile views, post engagement, and advisory requests.</p>
              </div>

              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded font-black uppercase">
                Live Telemetry
              </span>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Weekly Profile Views</span>
                <span className="text-2xl font-black text-slate-100">6,040</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +24.8% vs last week
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Post Reach & Impressions</span>
                <span className="text-2xl font-black text-emerald-400">31,350</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.2% vs last week
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Avg. Engagement Rate</span>
                <span className="text-2xl font-black text-slate-100">8.4%</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Top 5% in Web3 Hardware
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Advisor Inquiries</span>
                <span className="text-2xl font-black text-slate-100">14</span>
                <span className="text-[10px] font-bold text-slate-400 block">4 Sessions Pending</span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Daily Profile Views & Interactions */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Daily Profile Views vs Interactions</h4>
                  <span className="text-[10px] text-slate-500 font-bold">Past 7 Days</span>
                </div>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ANALYTICS_VIEWS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      />
                      <Bar dataKey="Views" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Interactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Cumulative Monthly Reach & Impressions */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Monthly Reach Growth Curve</h4>
                  <span className="text-[10px] text-slate-500 font-bold">Past 30 Days</span>
                </div>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ANALYTICS_REACH_DATA}>
                      <defs>
                        <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      />
                      <Area type="monotone" dataKey="Reach" stroke="#10b981" fillOpacity={1} fill="url(#reachGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT PROFILE MODAL                               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left my-8"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-black text-slate-100">Edit Business Profile</h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-500 hover:text-slate-200 p-1.5 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Business Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  {/* Industry */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Industry Sector</label>
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={e => setEditForm({ ...editForm, industry: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Company Bio / Mission</label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 outline-hidden focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Official Website URL</label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={e => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Logo Image URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Logo Image URL</label>
                    <input
                      type="url"
                      value={editForm.logo}
                      onChange={e => setEditForm({ ...editForm, logo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  {/* Cover Photo URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Cover Photo URL</label>
                    <input
                      type="url"
                      value={editForm.coverPhoto}
                      onChange={e => setEditForm({ ...editForm, coverPhoto: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Social Links Sub-section */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">Social Media Presence</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Twitter / X handle URL"
                      value={editForm.socials.twitter}
                      onChange={e => setEditForm({ ...editForm, socials: { ...editForm.socials, twitter: e.target.value } })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-hidden text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn Company URL"
                      value={editForm.socials.linkedin}
                      onChange={e => setEditForm({ ...editForm, socials: { ...editForm.socials, linkedin: e.target.value } })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-hidden text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="GitHub Organization URL"
                      value={editForm.socials.github}
                      onChange={e => setEditForm({ ...editForm, socials: { ...editForm.socials, github: e.target.value } })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-hidden text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Telegram Group / Channel URL"
                      value={editForm.socials.telegram}
                      onChange={e => setEditForm({ ...editForm, socials: { ...editForm.socials, telegram: e.target.value } })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-hidden text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: CREATE POST MODAL                                */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCreatePostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-black text-slate-100">Publish Business Dispatch</h3>
                </div>
                <button
                  onClick={() => setIsCreatePostOpen(false)}
                  className="text-slate-500 hover:text-slate-200 p-1.5 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Post Title / Headline</label>
                  <input
                    type="text"
                    placeholder="e.g., Box Helium Rig v3.0 Milestone Achieved"
                    value={newPostTitle}
                    onChange={e => setNewPostTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Category Tag</label>
                    <select
                      value={newPostCategory}
                      onChange={e => setNewPostCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    >
                      <option value="Product Release">Product Release</option>
                      <option value="Financial Insights">Financial Insights</option>
                      <option value="Engineering Brief">Engineering Brief</option>
                      <option value="Announcement">Announcement</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Image Banner URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newPostImage}
                      onChange={e => setNewPostImage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dispatch Content</label>
                  <textarea
                    rows={4}
                    placeholder="Write your company announcement, technical update, or financial milestone details..."
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 outline-hidden focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreatePostOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase px-5 py-2 rounded-xl transition-all cursor-pointer shadow-lg"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
