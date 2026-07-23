import React, { useState } from 'react';
import { 
  GraduationCap, Award, Star, Users, UserCheck, Calendar, MessageSquare, 
  Sparkles, CheckCircle2, Clock, Send, Plus, Filter, Search, Heart, 
  ArrowRight, ShieldCheck, ChevronRight, Video, X, ThumbsUp, Briefcase, 
  TrendingUp, Globe, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdvisorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  yearsExperience: number;
  industry: string;
  businessSizeFocus: string; // e.g. "1-10 Employees"
  goalsMatch: string[];
  interests: string[];
  achievements: string[];
  followerCount: number;
  menteeCount: number;
  hourlySessionRate: number; // 0 for free
  isFollowing: boolean;
  mentorshipStatus: 'NONE' | 'REQUESTED' | 'ACCEPTED';
  bio: string;
}

export interface LiveSession {
  id: string;
  advisorId: string;
  advisorName: string;
  menteeName: string;
  topic: string;
  dateTime: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  meetUrl: string;
}

export interface MentorshipRequest {
  id: string;
  fromName: string;
  fromCompany: string;
  toName: string;
  note: string;
  requestedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export const initialAdvisors: AdvisorProfile[] = [
  {
    id: 'adv-1',
    name: 'Felix Zinyenge',
    title: 'Founder & Chief Architect',
    company: 'Box Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    rating: 4.95,
    reviewCount: 88,
    yearsExperience: 12,
    industry: 'Technology & Hardware',
    businessSizeFocus: '10-50 Employees',
    goalsMatch: ['Scale ARR to $1M+', 'Cross-Border VAT Tax', 'Hardware Supply Chain'],
    interests: ['AI Edge Compute', 'Full-Stack Architecture', 'SaaS Monetization'],
    achievements: ['Scaled 3 Hardware Startups to Series B', 'Y Combinator W21 Alum', 'Patented Distributed Power Sensor'],
    followerCount: 2450,
    menteeCount: 14,
    hourlySessionRate: 0, // Free mentor
    isFollowing: true,
    mentorshipStatus: 'ACCEPTED',
    bio: 'Pioneering edge AI hardware & distributed financial ledgers. Passionate about helping technical founders scale operations.'
  },
  {
    id: 'adv-2',
    name: 'Elena Rostova',
    title: 'VP of International Finance',
    company: 'Berlin Global Logistics',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    rating: 4.88,
    reviewCount: 62,
    yearsExperience: 15,
    industry: 'Commercial Printing & Packaging',
    businessSizeFocus: '50-200 Employees',
    goalsMatch: ['European Union VAT Clearance', 'Trade Audits', 'Capital Working Credit'],
    interests: ['Cross-Border Logistics', 'Customs Regulatory Frameworks'],
    achievements: ['Structured €45M European Logistics Trade Deal', 'Certified International Tax Auditor'],
    followerCount: 1890,
    menteeCount: 9,
    hourlySessionRate: 150,
    isFollowing: false,
    mentorshipStatus: 'NONE',
    bio: 'Expert in European cross-border trade, customs duties, and statutory corporate tax compliance.'
  },
  {
    id: 'adv-3',
    name: 'Mia Thorne',
    title: 'Creative Brand Director',
    company: 'The Box Clothing',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    rating: 4.92,
    reviewCount: 110,
    yearsExperience: 8,
    industry: 'Retail Apparel',
    businessSizeFocus: '1-10 Employees',
    goalsMatch: ['Direct-to-Consumer Growth', 'Community Viral Drop Strategy'],
    interests: ['Ethical Textile Manufacturing', 'Social Media E-Commerce'],
    achievements: ['Generated $2.4M in DTC Streetwear Sales in Year 1', 'Featured in Vogue Fashion Tech'],
    followerCount: 3800,
    menteeCount: 22,
    hourlySessionRate: 75,
    isFollowing: true,
    mentorshipStatus: 'NONE',
    bio: 'Helping apparel and DTC founders build cult brand loyalty and high-margin product drops.'
  }
];

export const AdvisorMenteeNetwork: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'MY_MENTORS' | 'REQUESTS' | 'SESSIONS' | 'MESSAGES'>('MATCHES');
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>(initialAdvisors);
  
  // User Profile Matching Preferences
  const [userIndustry, setUserIndustry] = useState<string>('Technology & Hardware');
  const [userGoal, setUserGoal] = useState<string>('Scale ARR to $1M+');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Sessions State
  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: 'sess-101',
      advisorId: 'adv-1',
      advisorName: 'Felix Zinyenge',
      menteeName: 'Alex Vance',
      topic: 'Q3 Tax Savings & Hardware Inventory Expansion Strategy',
      dateTime: '2026-08-02 @ 14:00 UTC',
      status: 'UPCOMING',
      meetUrl: 'https://meet.mintstep.io/room-0892'
    }
  ]);

  // Mentorship Requests
  const [requests, setRequests] = useState<MentorshipRequest[]>([
    {
      id: 'req-1',
      fromName: 'Sarah Jenkins',
      fromCompany: 'Apex Ventures Corp',
      toName: 'Felix Zinyenge',
      note: 'Hi Felix! I loved your article on Section 179 tax deductions and would love your mentorship on scaling our financial operations.',
      requestedDate: '2026-07-21',
      status: 'PENDING'
    }
  ]);

  // Modals & Chat Drawers
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [selectedAdvisorForSession, setSelectedAdvisorForSession] = useState<AdvisorProfile | null>(null);
  const [sessionTopicInput, setSessionTopicInput] = useState<string>('');
  const [sessionDateInput, setSessionDateInput] = useState<string>('2026-08-10T15:00');

  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [ratingAdvisor, setRatingAdvisor] = useState<AdvisorProfile | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');

  // Active Chat State
  const [chatAdvisor, setChatAdvisor] = useState<AdvisorProfile | null>(initialAdvisors[0]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ME' | 'THEM'; text: string; time: string }>>([
    { sender: 'THEM', text: 'Hey Felix! Welcome to the MintStep Advisor Network. How can I assist with your tax or business scaling strategy today?', time: '10:00 AM' }
  ]);
  const [messageInput, setMessageInput] = useState<string>('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // --- Handlers ---
  const handleToggleFollow = (advId: string) => {
    setAdvisors(prev => prev.map(a => {
      if (a.id === advId) {
        const nextState = !a.isFollowing;
        triggerToast(nextState ? `❤️ Followed ${a.name}!` : `Unfollowed ${a.name}`);
        return {
          ...a,
          isFollowing: nextState,
          followerCount: nextState ? a.followerCount + 1 : a.followerCount - 1
        };
      }
      return a;
    }));
  };

  const handleRequestMentorship = (advId: string) => {
    setAdvisors(prev => prev.map(a => {
      if (a.id === advId) {
        triggerToast(`📩 Mentorship application sent to ${a.name}!`);
        return { ...a, mentorshipStatus: 'REQUESTED' };
      }
      return a;
    }));
  };

  const handleConfirmScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisorForSession || !sessionTopicInput) return;

    const newSess: LiveSession = {
      id: `sess-${Date.now()}`,
      advisorId: selectedAdvisorForSession.id,
      advisorName: selectedAdvisorForSession.name,
      menteeName: 'Felix Zinyenge',
      topic: sessionTopicInput,
      dateTime: sessionDateInput.replace('T', ' @ '),
      status: 'UPCOMING',
      meetUrl: `https://meet.mintstep.io/room-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setSessions(prev => [newSess, ...prev]);
    setShowScheduleModal(false);
    setSessionTopicInput('');
    triggerToast(`🗓️ Live Mentorship Session booked with ${selectedAdvisorForSession.name}!`);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const msgText = messageInput;
    setChatMessages(prev => [...prev, { sender: 'ME', text: msgText, time: 'Just now' }]);
    setMessageInput('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'THEM',
        text: `Thanks for your note regarding "${msgText}". I've reviewed your latest MintStep POS & Tax reports and have attached actionable feedback.`,
        time: 'Just now'
      }]);
    }, 1000);
  };

  const handleSubmitRating = () => {
    if (!ratingAdvisor) return;
    triggerToast(`⭐ Submitted ${ratingScore}-star review for ${ratingAdvisor.name}!`);
    setShowRatingModal(false);
    setRatingComment('');
  };

  const handleAcceptMentorshipRequest = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'ACCEPTED' } : r));
    triggerToast("✅ Mentorship request accepted!");
  };

  const filteredAdvisors = advisors.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
            <GraduationCap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Advisor & Mentee Network</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                AI Smart Matching Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Connect with verified founders, schedule 1-on-1 mentorship sessions & rate expert advisors</p>
          </div>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('SESSIONS')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Upcoming Sessions ({sessions.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'MATCHES', label: 'AI Recommended Advisors', icon: Sparkles },
          { id: 'MY_MENTORS', label: 'My Mentors & Mentees', icon: Users },
          { id: 'REQUESTS', label: `Mentorship Requests (${requests.filter(r => r.status === 'PENDING').length})`, icon: Clock },
          { id: 'SESSIONS', label: '1-on-1 Live Sessions', icon: Video },
          { id: 'MESSAGES', label: 'Direct Messages', icon: MessageSquare },
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

      {/* ------------------- TAB 1: AI RECOMMENDED ADVISORS ------------------- */}
      {activeTab === 'MATCHES' && (
        <div className="space-y-6">
          
          {/* AI Matchmaker Filter Bar */}
          <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">AI Mentorship Matchmaker Preferences</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Matching against 1,420 Verified Advisors</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">My Industry Sector</label>
                <select
                  value={userIndustry}
                  onChange={(e) => setUserIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Technology & Hardware">Technology & Hardware</option>
                  <option value="Commercial Printing & Packaging">Commercial Printing & Packaging</option>
                  <option value="Retail Apparel">Retail Apparel</option>
                  <option value="Fintech & Banking">Fintech & Banking</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">Primary Growth Goal</label>
                <select
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Scale ARR to $1M+">Scale ARR to $1M+</option>
                  <option value="Cross-Border VAT Tax">Cross-Border VAT Tax Optimization</option>
                  <option value="Direct-to-Consumer Growth">Direct-to-Consumer Viral Growth</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">Search Advisor Name</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    placeholder="Search name, title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advisors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvisors.map(adv => (
              <div key={adv.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      <img src={adv.avatarUrl} alt={adv.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md" />
                      <div>
                        <h3 className="text-sm font-black text-slate-100">{adv.name}</h3>
                        <p className="text-xs text-slate-400">{adv.title}</p>
                        <p className="text-[10px] font-bold text-emerald-400 font-mono mt-0.5">{adv.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-200">{adv.rating}</span>
                      <span className="text-[10px] text-slate-500">({adv.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{adv.bio}</p>

                  {/* Achievements Pill List */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 font-mono">Key Experience & Achievements</span>
                    <div className="space-y-1">
                      {adv.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px]">
                          <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 font-medium truncate">{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Footer Bar */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-[10px] font-mono">
                    <div className="text-slate-400">
                      <span>Followers:</span>
                      <span className="text-slate-200 font-bold block">{adv.followerCount.toLocaleString()}</span>
                    </div>
                    <div className="text-slate-400">
                      <span>Rate:</span>
                      <span className="text-emerald-400 font-bold block">
                        {adv.hourlySessionRate === 0 ? 'FREE / Pro Bono' : `$${adv.hourlySessionRate}/hr`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-slate-800 mt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleToggleFollow(adv.id)}
                      className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                        adv.isFollowing 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${adv.isFollowing ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{adv.isFollowing ? 'Following' : 'Follow'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAdvisorForSession(adv);
                        setShowScheduleModal(true);
                      }}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Schedule 1:1</span>
                    </button>
                  </div>

                  {/* Mentorship Status CTA */}
                  {adv.mentorshipStatus === 'NONE' ? (
                    <button
                      onClick={() => handleRequestMentorship(adv.id)}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Apply for Mentorship</span>
                    </button>
                  ) : adv.mentorshipStatus === 'REQUESTED' ? (
                    <div className="w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs text-center">
                      Mentorship Application Pending
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setChatAdvisor(adv);
                        setActiveTab('MESSAGES');
                      }}
                      className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Active Mentor — Open Chat</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ------------------- TAB 2: MY MENTORS & MENTEES ------------------- */}
      {activeTab === 'MY_MENTORS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Active Mentorship Connections</h3>
            
            <div className="space-y-3">
              {advisors.filter(a => a.mentorshipStatus === 'ACCEPTED').map(m => (
                <div key={m.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={m.avatarUrl} alt={m.name} className="w-12 h-12 rounded-2xl object-cover" />
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.title} @ {m.company}</p>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Active Advisor Connection</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setRatingAdvisor(m);
                        setShowRatingModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Rate Mentor</span>
                    </button>

                    <button
                      onClick={() => {
                        setChatAdvisor(m);
                        setActiveTab('MESSAGES');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 3: MENTORSHIP REQUESTS ------------------- */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Incoming Mentorship Applications</h3>

            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{req.fromName}</h4>
                      <p className="text-slate-400 text-xs">{req.fromCompany}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">{req.requestedDate}</span>
                  </div>

                  <p className="text-slate-300 text-xs font-sans italic bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                    "{req.note}"
                  </p>

                  <div className="flex justify-end space-x-2 pt-1">
                    {req.status === 'PENDING' ? (
                      <button
                        onClick={() => handleAcceptMentorshipRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                      >
                        Accept Mentorship
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold">Accepted Mentee</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 4: 1-ON-1 LIVE SESSIONS ------------------- */}
      {activeTab === 'SESSIONS' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase text-slate-200">Scheduled Mentorship Live Video Rooms</h3>
            </div>

            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{s.dateTime}</span>
                    <h4 className="font-bold text-slate-100 text-sm font-sans">{s.topic}</h4>
                    <p className="text-slate-400">Advisor: {s.advisorName} • Mentee: {s.menteeName}</p>
                  </div>

                  <button
                    onClick={() => triggerToast(`🎥 Opening Virtual Meeting Room: ${s.meetUrl}`)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md shrink-0"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Room</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 5: DIRECT MESSAGES ------------------- */}
      {activeTab === 'MESSAGES' && chatAdvisor && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <img src={chatAdvisor.avatarUrl} alt={chatAdvisor.name} className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h3 className="text-xs font-black text-slate-100">{chatAdvisor.name}</h3>
              <p className="text-[10px] text-emerald-400 font-mono">Active Mentor Chat Channel</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 h-64 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'ME' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-2xl ${
                  msg.sender === 'ME' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-200 border border-slate-800'
                }`}>
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="text"
              placeholder="Write a message to your mentor..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* --- SCHEDULE SESSION MODAL --- */}
      <AnimatePresence>
        {showScheduleModal && selectedAdvisorForSession && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase text-slate-100">
                Book 1-on-1 Session with {selectedAdvisorForSession.name}
              </h3>

              <form onSubmit={handleConfirmScheduleSession} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Session Agenda / Topic:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Section 179 Deductions & Hardware Supply Chain"
                    value={sessionTopicInput}
                    onChange={(e) => setSessionTopicInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Date & Time:</label>
                  <input 
                    type="datetime-local"
                    value={sessionDateInput}
                    onChange={(e) => setSessionDateInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RATING MODAL --- */}
      <AnimatePresence>
        {showRatingModal && ratingAdvisor && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase text-slate-100">Rate Advisor {ratingAdvisor.name}</h3>

              <div className="flex items-center justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingScore(star)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star className={`w-7 h-7 ${star <= ratingScore ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>

              <textarea 
                placeholder="Share feedback regarding your mentorship experience..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdvisorMenteeNetwork;
