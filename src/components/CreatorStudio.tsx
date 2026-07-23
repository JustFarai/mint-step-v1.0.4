import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Camera, Image, FileText, Calendar, Clock, BarChart2, DollarSign,
  Sparkles, AlertOctagon, Tag, FileCode, Sliders, Lock, HelpCircle,
  Play, Pause, Mic, Video, Volume2, ShieldCheck, CheckCircle2, ChevronRight,
  Eye, RefreshCw, Layers, Award, Plus, Trash2, Send, Copy, Check, Info,
  BookOpen, ExternalLink, Activity, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- Types & Interfaces ---
interface StudioContent {
  id: string;
  type: 'video' | 'article' | 'image';
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'live';
  createdAt: string;
  publishAt?: string;
  durationString?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  captions?: string[];
  hashtags: string[];
  wordCount?: number;
  readTime?: string;
}

export default function CreatorStudio() {
  // --- STATE SYSTEM ---
  const [activeTab, setActiveTab] = useState<'create' | 'drafts' | 'schedule' | 'analytics' | 'monetization'>('create');
  const [creatorRole, setCreatorRole] = useState<'elena' | 'marcus' | 'system'>('elena');
  const [toast, setToast] = useState<string | null>(null);

  // --- CONTENT DATABASE ---
  const [contents, setContents] = useState<StudioContent[]>(() => {
    const cached = localStorage.getItem('wf_studio_contents');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'draft-1',
        type: 'video',
        title: 'Capital Lockup: High-Capacity Microprocessors Sourcing',
        description: 'Detailing how we can optimize Shenzhen shipping networks to avoid locking $21,600 worth of active node cases in the holding terminal.',
        status: 'draft',
        createdAt: '2026-07-21 08:00',
        durationString: '03:45',
        durationSeconds: 225,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
        hashtags: ['#Sourcing', '#SiliconValue', '#CFOTactics'],
        captions: ['00:01 - Introduction to wafer supply schedules', '01:10 - Shenzhen customs cost routing alternatives', '02:40 - Safety buffer recommendations']
      },
      {
        id: 'draft-2',
        type: 'article',
        title: 'Section 41 IRS Guidelines for Custom Hardware R&D Credits',
        description: 'Complete analysis on converting manufacturing expenses for node cases into qualified tax research offsets.',
        status: 'draft',
        createdAt: '2026-07-20 14:30',
        wordCount: 840,
        readTime: '4 min read',
        hashtags: ['#Section41', '#TaxCredits', '#EnterpriseFab']
      },
      {
        id: 'scheduled-1',
        type: 'video',
        title: 'Ethereum Sovereign Validator Node Assemblies vs AWS hosting',
        description: 'Our physical hardware layout costs $129 per month vs AWS compute baseline of $350 monthly.',
        status: 'scheduled',
        createdAt: '2026-07-21 09:00',
        publishAt: '2026-07-22 10:00',
        durationString: '01:20',
        durationSeconds: 80,
        thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
        hashtags: ['#StakingYield', '#Web3Hosting', '#SovereignCore'],
        captions: ['00:05 - Physical server cost outline', '00:35 - AWS egress taxes review', '01:05 - Staking yield comparison']
      },
      {
        id: 'scheduled-2',
        type: 'image',
        title: 'Q3 Enterprise Inventory Supply Chain Visual Chart',
        description: 'Infographic highlighting low inventory buffer thresholds for liquid helium cryo-coils and server cabinets.',
        status: 'scheduled',
        createdAt: '2026-07-21 05:20',
        publishAt: '2026-07-24 13:00',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
        hashtags: ['#SupplyChain', '#LogisticsData', '#WarehouseAlert']
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('wf_studio_contents', JSON.stringify(contents));
  }, [contents]);

  // Toast dispatch helper
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // --- SUB-TOOL ACTIVATION ---
  const [selectedTool, setSelectedTool] = useState<'upload_video' | 'record_video' | 'write_article' | 'upload_images'>('upload_video');

  // --- CREATOR IDENTITY ROLES METADATA ---
  const creatorProfile = {
    elena: {
      name: 'Elena Rostova',
      title: 'CFO AI Advisor / Quantitative Lead',
      avatarColor: 'from-amber-400 to-orange-500',
      initials: 'ER'
    },
    marcus: {
      name: 'Marcus Vance',
      title: 'Senior Tax AI / Corporate Counsel',
      avatarColor: 'from-emerald-400 to-teal-500',
      initials: 'MV'
    },
    system: {
      name: 'DHL Logistics Automation',
      title: 'Automated Supply Chain Broker',
      avatarColor: 'from-rose-500 to-red-600',
      initials: 'DL'
    }
  }[creatorRole];

  // ==========================================
  // --- SUB-TOOL A: UPLOAD VIDEO FORM STATE ---
  // ==========================================
  const [videoFileDropped, setVideoFileDropped] = useState(false);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoMin, setVideoMin] = useState('02');
  const [videoSec, setVideoSec] = useState('30');
  const [videoThumbnailType, setVideoThumbnailType] = useState<'auto1' | 'auto2' | 'custom'>('auto1');
  const [videoCustomThumbnailUrl, setVideoCustomThumbnailUrl] = useState('');
  const [videoHashtagInput, setVideoHashtagInput] = useState('');
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [captionsInput, setCaptionsInput] = useState<string[]>(['00:00 - Introduction to strategic operations']);
  const [newCaptionText, setNewCaptionText] = useState('');
  const [scheduleDate, setScheduleDate] = useState('2026-07-22');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [isScheduledUpload, setIsScheduledUpload] = useState(false);

  // Computed total duration in seconds
  const currentVideoDurationSeconds = parseInt(videoMin || '0') * 60 + parseInt(videoSec || '0');
  const isVideoOverLimit = currentVideoDurationSeconds > 510; // 8 minutes 30 seconds is 510 seconds

  // --- Helper to auto generate subtitles based on Title ---
  const handleAutoGenerateCaptions = () => {
    const title = videoTitle || "Enterprise Asset Audit";
    const generated = [
      `00:00 - Executing analytical assessment on: ${title}`,
      "01:15 - Breakdown of core hardware capital lockup vectors",
      "03:30 - Auditing margin buffers & logistics redirection costs",
      "05:50 - Transitioning safety buffers into operational ledger tagging",
      "08:10 - Final compliance review summary"
    ];
    setCaptionsInput(generated);
    triggerToast("🪄 AI Auto-Generated standard advisor subtitles!");
  };

  // --- Helper to suggest hashtags based on current title ---
  const handleSuggestHashtags = () => {
    const options = ['#FinTech', '#CFOInsights', '#CapitalEfficiency', '#LogisticsAudit', '#TaxCreditHarvesting', '#SovereignHardware', '#WaferSupply'];
    // pick 3 random
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    setSuggestedHashtags(shuffled.slice(0, 4));
    triggerToast("🔍 Viral financial tags generated matching corporate compliance!");
  };

  // --- Submit Upload Video ---
  const handlePublishVideo = (asDraft: boolean) => {
    if (!videoTitle.trim()) {
      triggerToast("⚠️ Corporate validation error: Video Title is required.");
      return;
    }

    const durationString = `${videoMin.padStart(2, '0')}:${videoSec.padStart(2, '0')}`;
    const newVid: StudioContent = {
      id: `content-${Date.now()}`,
      type: 'video',
      title: videoTitle,
      description: videoDesc || 'No summary text provided.',
      status: asDraft ? 'draft' : (isScheduledUpload ? 'scheduled' : 'live'),
      createdAt: '2026-07-21 08:30',
      publishAt: !asDraft && isScheduledUpload ? `${scheduleDate} ${scheduleTime}` : undefined,
      durationString,
      durationSeconds: currentVideoDurationSeconds,
      thumbnailUrl: videoThumbnailType === 'custom' && videoCustomThumbnailUrl ? videoCustomThumbnailUrl : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      captions: captionsInput,
      hashtags: videoHashtagInput ? videoHashtagInput.split(',').map(t => t.trim()) : suggestedHashtags.length > 0 ? suggestedHashtags : ['#CFOAdvisor']
    };

    setContents(prev => [newVid, ...prev]);
    triggerToast(asDraft ? "💾 Draft content saved securely to enterprise ledger." : (isScheduledUpload ? `🗓️ Broadcast scheduled for ${scheduleDate} at ${scheduleTime}` : "🚀 Video Published Live to Advisor Network!"));
    
    // Reset fields
    setVideoFileDropped(false);
    setVideoFileName('');
    setVideoTitle('');
    setVideoDesc('');
    setVideoMin('02');
    setVideoSec('30');
    setSuggestedHashtags([]);
  };

  // ==========================================
  // --- SUB-TOOL B: RECORD LIVE VIDEO STATE ---
  // ==========================================
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const [microphoneLevel, setMicrophoneLevel] = useState(15);
  const [recordResolution, setRecordResolution] = useState<'1080p' | '4k' | '720p'>('1080p');
  const [selectedMicInput, setSelectedMicInput] = useState('Integrated HD Array');
  
  // Interactive Teleprompter
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(1.5);
  const [teleprompterScroll, setTeleprompterScroll] = useState(0);
  const [teleprompterScript, setTeleprompterScript] = useState(
    "Welcome executive team. Today we are addressing the supply chains for our custom silicon substrates. Under recent ledger audits, we have identified that shipping delays in the Shenzhen microelectronics zone are locking up to $21,600 in hardware capital. By diverting active procurement orders directly to the DHL priority lanes, we can accelerate lead times by 35%. This simple shift maintains node uptime without exceeding our maximum safety stock limits."
  );

  // Recording counter & simulated microphone level fluctuations
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration(prev => prev + 1);
        setMicrophoneLevel(Math.floor(Math.random() * 65) + 15);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Teleprompter scroll simulation
  useEffect(() => {
    let interval: any;
    if (isRecording && teleprompterSpeed > 0) {
      interval = setInterval(() => {
        setTeleprompterScroll(prev => (prev + teleprompterSpeed) % 250);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, teleprompterSpeed]);

  const toggleRecording = () => {
    if (!cameraStreamActive) {
      triggerToast("🔌 Connecting local encrypted webcam & microphone streams...");
      setCameraStreamActive(true);
      return;
    }

    if (!isRecording) {
      setIsRecording(true);
      triggerToast("⏺️ Broadcasting Live Record Stream to Encrypted Buffer!");
    } else {
      setIsRecording(false);
      triggerToast("🏁 Recording finished. Simulating high-speed compression...");
      // Auto transfer to standard upload title with record statistics
      setVideoTitle(`Live Broadcast - ${new Date().toLocaleDateString()} (${recordResolution})`);
      setVideoDesc(`Recorded using Live Advisor Studio with mic ${selectedMicInput}. Length: ${Math.floor(recordDuration / 60)}m ${recordDuration % 60}s. Script used: ${teleprompterScript.substring(0, 100)}...`);
      setVideoMin(Math.floor(recordDuration / 60).toString().padStart(2, '0'));
      setVideoSec((recordDuration % 60).toString().padStart(2, '0'));
      setVideoFileDropped(true);
      setVideoFileName(`REC_BUFFER_${Date.now()}.mp4`);
      setSelectedTool('upload_video');
    }
  };

  // ==========================================
  // --- SUB-TOOL C: WRITE ARTICLES STATE ---
  // ==========================================
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSub, setArticleSub] = useState('');
  const [articleBody, setArticleBody] = useState('');
  const [articleCover, setArticleCover] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80');
  const [articleTags, setArticleTags] = useState('');

  const handlePublishArticle = (asDraft: boolean) => {
    if (!articleTitle.trim()) {
      triggerToast("⚠️ Article title is required.");
      return;
    }

    const words = articleBody.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const newArticle: StudioContent = {
      id: `content-${Date.now()}`,
      type: 'article',
      title: articleTitle,
      description: articleSub || articleBody.substring(0, 120) + '...',
      status: asDraft ? 'draft' : 'live',
      createdAt: '2026-07-21 08:35',
      wordCount: words,
      readTime: `${readTimeMinutes} min read`,
      thumbnailUrl: articleCover,
      hashtags: articleTags ? articleTags.split(',').map(t => t.trim()) : ['#FinTechInsight']
    };

    setContents(prev => [newArticle, ...prev]);
    triggerToast(asDraft ? "💾 Draft article saved." : "🚀 Article published to corporate wire!");
    
    // reset
    setArticleTitle('');
    setArticleSub('');
    setArticleBody('');
    setArticleTags('');
  };

  // ==========================================
  // --- SUB-TOOL D: UPLOAD IMAGES STATE ---
  // ==========================================
  const [imgTitle, setImgTitle] = useState('');
  const [imgDesc, setImgDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80');
  const [imgTags, setImgTags] = useState('');

  const handlePublishImage = (asDraft: boolean) => {
    if (!imgTitle.trim()) {
      triggerToast("⚠️ Image title is required.");
      return;
    }

    const newImg: StudioContent = {
      id: `content-${Date.now()}`,
      type: 'image',
      title: imgTitle,
      description: imgDesc || 'No summary text provided.',
      status: asDraft ? 'draft' : 'live',
      createdAt: '2026-07-21 08:40',
      thumbnailUrl: imgUrl,
      hashtags: imgTags ? imgTags.split(',').map(t => t.trim()) : ['#CorporateSlide']
    };

    setContents(prev => [newImg, ...prev]);
    triggerToast(asDraft ? "💾 Image draft stored." : "🚀 Image published to operational board!");

    setImgTitle('');
    setImgDesc('');
    setImgTags('');
  };

  // Delete content helper
  const handleDeleteContent = (id: string) => {
    setContents(prev => prev.filter(c => c.id !== id));
    triggerToast("🗑️ Item deleted successfully.");
  };

  // Quick Action to move scheduled to draft or draft to live
  const handlePublishFromDraft = (id: string) => {
    setContents(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'live' };
      }
      return c;
    }));
    triggerToast("🚀 Content published live to corporate networks!");
  };

  // --- ANALYTICS MOCK DATA ---
  const viewerEngagementData = [
    { name: '00:00', Retention: 100, Benchmark: 100 },
    { name: '00:15', Retention: 85, Benchmark: 80 },
    { name: '00:30', Retention: 78, Benchmark: 72 },
    { name: '01:00', Retention: 65, Benchmark: 58 },
    { name: '02:00', Retention: 59, Benchmark: 50 },
    { name: '03:30', Retention: 55, Benchmark: 44 },
    { name: '05:00', Retention: 49, Benchmark: 40 },
    { name: '08:30', Retention: 45, Benchmark: 32 }
  ];

  const historicalReachData = [
    { date: 'Jul 15', Views: 1200, RevenueShare: 140 },
    { date: 'Jul 16', Views: 1450, RevenueShare: 165 },
    { date: 'Jul 17', Views: 1900, RevenueShare: 210 },
    { date: 'Jul 18', Views: 2200, RevenueShare: 245 },
    { date: 'Jul 19', Views: 2100, RevenueShare: 230 },
    { date: 'Jul 20', Views: 3400, RevenueShare: 380 },
    { date: 'Jul 21', Views: 4200, RevenueShare: 460 }
  ];

  // --- MONETIZATION THRESHOLDS ---
  const followerTarget = 1500;
  const currentFollowers = 1240;
  const watchHoursTarget = 4000;
  const currentWatchHours = 3850;

  const followerProgress = Math.min(100, Math.round((currentFollowers / followerTarget) * 100));
  const watchHoursProgress = Math.min(100, Math.round((currentWatchHours / watchHoursTarget) * 100));
  const isMonetizationReady = currentFollowers >= followerTarget && currentWatchHours >= watchHoursTarget;

  const [hasAppliedForMonetization, setHasAppliedForMonetization] = useState(false);
  const [monetizationEnrollmentStatus, setMonetizationEnrollmentStatus] = useState<'none' | 'pending' | 'enrolled'>('none');
  const [achRouting, setAchRouting] = useState('******124');
  const [corporateTaxId, setCorporateTaxId] = useState('XX-XXX4529');
  const [isAdMonetizationEnabled, setIsAdMonetizationEnabled] = useState(true);

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md p-6 max-w-7xl mx-auto flex flex-col space-y-6 text-slate-100">
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 bg-emerald-600 border border-emerald-400 px-5 py-3 text-white rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-xs tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MASTER CREATOR HEADER --- */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-850 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Business Accounts Only • Secure Advisor Node</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Enterprise Creator Studio 
            <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
              CFO Workspace
            </span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-3xl">
            Authorize new advisory briefings, record direct physical mainframe clips with scrollable teleprompters, draft compliance articles, structure scheduled publishes, and map metrics and monetization share.
          </p>
        </div>

        {/* IDENTITY ROLES TOGGLER */}
        <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-850 flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase px-2 font-mono">ADVISOR IDENTITY:</span>
          <button 
            onClick={() => {
              setCreatorRole('elena');
              triggerToast("💼 Authorized as Elena Rostova (CFO Lead)");
            }}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              creatorRole === 'elena' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Elena (CFO)
          </button>
          <button 
            onClick={() => {
              setCreatorRole('marcus');
              triggerToast("⚖️ Authorized as Marcus Vance (Senior Tax Advisor)");
            }}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              creatorRole === 'marcus' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Marcus (Tax)
          </button>
          <button 
            onClick={() => {
              setCreatorRole('system');
              triggerToast("🤖 Authorized as DHL Automated Broker Node");
            }}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              creatorRole === 'system' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DHL Broker
          </button>
        </div>
      </div>

      {/* --- STUDIO SUB NAV PANELS --- */}
      <div className="flex flex-wrap bg-slate-900/40 p-1 rounded-2xl border border-slate-850 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 min-w-[120px] py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'create' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/35'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Capture & Create</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('drafts');
            triggerToast("📂 Opened content drafts drawer.");
          }}
          className={`flex-1 min-w-[120px] py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'drafts' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/35'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Drafts Board ({contents.filter(c => c.status === 'draft').length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('schedule');
            triggerToast("🗓️ Opened scheduling timeline board.");
          }}
          className={`flex-1 min-w-[120px] py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'schedule' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/35'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Publish Queue ({contents.filter(c => c.status === 'scheduled').length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('analytics');
            triggerToast("📊 Loaded advisor performance metrics.");
          }}
          className={`flex-1 min-w-[120px] py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/35'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics & Retention</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('monetization');
            triggerToast("💰 Loaded Monetization program setup.");
          }}
          className={`flex-1 min-w-[120px] py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'monetization' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/35'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Monetization Hub</span>
        </button>
      </div>

      {/* --- GRID SYSTEM BASED ON SELECTED TAB --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* ========================================================
            ================== TAB 1: CAPTURE & CREATE =============
            ======================================================== */}
        {activeTab === 'create' && (
          <>
            {/* LEFT TOOL NAVIGATION (COL 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest pl-2 mb-2">WORKSPACE TOOLS</h4>
              
              <button
                onClick={() => setSelectedTool('upload_video')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedTool === 'upload_video'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedTool === 'upload_video' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Upload Video</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">8m 30s Guard</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedTool('record_video')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedTool === 'record_video'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedTool === 'record_video' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Record Video Live</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Webcam Simulation</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedTool('write_article')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedTool === 'write_article'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedTool === 'write_article' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Write Articles</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Corporate Wire</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedTool('upload_images')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedTool === 'upload_images'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedTool === 'upload_images' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Upload Images</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Promos & Slides</div>
                </div>
              </button>

              {/* ACTIVE ROLE CARD */}
              <div className="bg-slate-900/25 border border-slate-850/80 p-4 rounded-2xl mt-4">
                <div className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">AUTH AUTHOR</div>
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${creatorProfile.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {creatorProfile.initials}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-extrabold text-white truncate">@{creatorProfile.name}</div>
                    <div className="text-[9px] text-slate-400 font-semibold truncate">{creatorProfile.title}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN DYNAMIC CONTENT BOX (COL 9) */}
            <div className="lg:col-span-9 bg-slate-900/20 border border-slate-850 p-6.5 rounded-3xl space-y-6">
              
              {/* === TOOL A: UPLOAD VIDEO COMPONENT === */}
              {selectedTool === 'upload_video' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Draft New CFO Video Brief</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
                      SEC Compliant Airing
                    </span>
                  </div>

                  {/* Drag-and-Drop Area Simulation */}
                  <div 
                    onClick={() => {
                      setVideoFileDropped(true);
                      setVideoFileName(`ADVISOR_UPDATE_CFO_${Date.now().toString().substring(7)}.mp4`);
                      triggerToast("📁 Local video file pre-buffered. Duration tags initialized.");
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      videoFileDropped 
                        ? 'border-emerald-500/60 bg-emerald-950/10 text-slate-100' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/10 text-slate-400'
                    }`}
                  >
                    <Upload className={`w-10 h-10 mx-auto mb-3 ${videoFileDropped ? 'text-emerald-400 animate-bounce' : 'text-slate-600'}`} />
                    {videoFileDropped ? (
                      <div>
                        <p className="text-emerald-400 font-black text-xs">File Successfully Loaded & Staged</p>
                        <p className="font-mono text-[10px] text-slate-400 mt-1">{videoFileName} (14.8 MB)</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-black text-slate-300">Drag & Drop advisor video file here, or click to load simulation</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Acceptable formats: MP4, MOV, WEBM (Max length: 8m 30s)</p>
                      </div>
                    )}
                  </div>

                  {/* Video Metadata Forms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Briefing Title *</label>
                      <input 
                        type="text" 
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Silicion Sourcing optimization leadtimes"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>

                    {/* Duration input with Max Length (8m 30s) Guard Check */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Video Duration *</label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="number" 
                          value={videoMin}
                          onChange={(e) => setVideoMin(e.target.value)}
                          placeholder="Min"
                          min="0"
                          max="20"
                          className="w-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-center focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                        />
                        <span className="text-slate-500 text-xs font-bold">:</span>
                        <input 
                          type="number" 
                          value={videoSec}
                          onChange={(e) => setVideoSec(e.target.value)}
                          placeholder="Sec"
                          min="0"
                          max="59"
                          className="w-20 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-center focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                        />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Minutes : Seconds</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning overlay if video exceeds 8 minutes 30 seconds */}
                  {isVideoOverLimit && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3"
                    >
                      <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h5 className="text-amber-400 font-extrabold text-xs">CRITICAL COMPLIANCE NOTICE: Video Exceeds Length Guard</h5>
                        <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                          Your selected video duration of <strong className="text-white">{videoMin}m {videoSec}s</strong> exceeds the requested <strong className="text-amber-400">8 minutes 30 seconds</strong> network ceiling. The streaming system will enforce a strict auto-trim compression sequence during publication.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Description Form */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Executive Summary Description</label>
                    <textarea 
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      rows={3}
                      placeholder="Detailing our strategic recommendation, capital exposure values, and actionable operational changes."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                    />
                  </div>

                  {/* Thumbnail Selector Grid */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Interactive Thumbnail Preview</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        onClick={() => setVideoThumbnailType('auto1')}
                        className={`border rounded-xl p-2.5 cursor-pointer text-center space-y-1.5 transition-all ${
                          videoThumbnailType === 'auto1' ? 'border-emerald-500 bg-emerald-950/10' : 'border-slate-800 bg-slate-900/30'
                        }`}
                      >
                        <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80" alt="Frame 1" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded font-mono text-white">00:15</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold block">Smart Frame A</span>
                      </div>

                      <div 
                        onClick={() => setVideoThumbnailType('auto2')}
                        className={`border rounded-xl p-2.5 cursor-pointer text-center space-y-1.5 transition-all ${
                          videoThumbnailType === 'auto2' ? 'border-emerald-500 bg-emerald-950/10' : 'border-slate-800 bg-slate-900/30'
                        }`}
                      >
                        <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                          <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&q=80" alt="Frame 2" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 rounded font-mono text-white">01:30</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold block">Smart Frame B</span>
                      </div>

                      <div 
                        onClick={() => {
                          setVideoThumbnailType('custom');
                          setVideoCustomThumbnailUrl('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80');
                        }}
                        className={`border rounded-xl p-2.5 cursor-pointer text-center space-y-1.5 transition-all ${
                          videoThumbnailType === 'custom' ? 'border-emerald-500 bg-emerald-950/10' : 'border-slate-800 bg-slate-900/30'
                        }`}
                      >
                        <div className="aspect-video bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center relative">
                          {videoCustomThumbnailUrl ? (
                            <img src={videoCustomThumbnailUrl} alt="Custom upload" className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-slate-600 mb-1" />
                              <span className="text-[8px] text-slate-500">Click to upload custom URL</span>
                            </>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold block">Bespoke Upload</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom Subtitles Captions Panel */}
                  <div className="space-y-3.5 text-left border-t border-slate-850 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Compliance Transcript Subtitles (Captions)</label>
                        <p className="text-[9px] text-slate-500 mt-0.5">Define timestamps and text cues or auto-generate with smart templates.</p>
                      </div>
                      <button 
                        onClick={handleAutoGenerateCaptions}
                        type="button"
                        className="bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 hover:border-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                        <span>AI Generate Subtitles</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                      {captionsInput.map((cap, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-850 text-[11px] text-slate-300 font-mono">
                          <span>{cap}</span>
                          <button 
                            onClick={() => setCaptionsInput(prev => prev.filter((_, i) => i !== cIdx))}
                            className="text-rose-500 hover:text-rose-400 p-0.5"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Caption */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newCaptionText}
                        onChange={(e) => setNewCaptionText(e.target.value)}
                        placeholder="e.g. 02:15 - Initiating liquid helium PO"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white font-mono"
                      />
                      <button 
                        onClick={() => {
                          if (newCaptionText.trim()) {
                            setCaptionsInput(prev => [...prev, newCaptionText]);
                            setNewCaptionText('');
                            triggerToast("💬 New subtitle track element logged!");
                          }
                        }}
                        type="button"
                        className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 rounded-xl cursor-pointer"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Hashtags Input & Suggestions */}
                  <div className="space-y-2.5 text-left border-t border-slate-850 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Operational Hashtags</label>
                      <button 
                        onClick={handleSuggestHashtags}
                        type="button"
                        className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Suggest tags</span>
                      </button>
                    </div>

                    <input 
                      type="text" 
                      value={videoHashtagInput}
                      onChange={(e) => setVideoHashtagInput(e.target.value)}
                      placeholder="#CFOInsights, #SiliconSourcing, #HardwareMargin (comma-separated)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                    />

                    {suggestedHashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {suggestedHashtags.map((tag) => (
                          <span 
                            key={tag}
                            onClick={() => setVideoHashtagInput(prev => prev ? `${prev}, ${tag}` : tag)}
                            className="text-[9px] bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/20 px-2 py-1 rounded-md font-mono font-bold cursor-pointer transition-all"
                          >
                            + {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Publish & Scheduling Controls */}
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 space-y-3.5 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-300">Schedule Broadcast Release Time</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isScheduledUpload} 
                          onChange={(e) => setIsScheduledUpload(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-slate-950"></div>
                      </label>
                    </div>

                    {isScheduledUpload && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-2 gap-3 pt-2"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500">Date</label>
                          <input 
                            type="date" 
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500">Time</label>
                          <input 
                            type="time" 
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Submission triggers */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button 
                      onClick={() => handlePublishVideo(true)}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs cursor-pointer border border-slate-800 transition-all text-center"
                    >
                      Save Draft Asset
                    </button>
                    <button 
                      onClick={() => handlePublishVideo(false)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs cursor-pointer transition-all text-center shadow-lg"
                    >
                      {isScheduledUpload ? "Confirm Scheduled Release" : "Publish Broadcast Immediately"}
                    </button>
                  </div>

                </div>
              )}

              {/* === TOOL B: RECORD LIVE VIDEO SIMULATOR === */}
              {selectedTool === 'record_video' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>Live Video Recording Studio</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                      <span>SECURE RECORD DEPLOYMENT</span>
                    </div>
                  </div>

                  {/* Camera Viewport Simulation */}
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden relative border border-slate-850 flex flex-col items-center justify-center">
                    
                    {/* Simulated Lens Scan / Noise Effect */}
                    <div className="absolute inset-0 bg-radial-vignette opacity-40 z-10 pointer-events-none" />
                    
                    {cameraStreamActive ? (
                      <>
                        {/* Stream graphic with active camera and prompt text scrolling */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-transparent to-slate-950/40 z-0 flex items-center justify-center overflow-hidden">
                          {/* Beautiful canvas camera grid lines */}
                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15 border border-white pointer-events-none">
                            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                          </div>

                          {/* Interactive Teleprompter Script scrolling upwards */}
                          <div className="absolute bottom-16 left-6 right-6 z-20 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 max-h-48 overflow-hidden">
                            <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10 text-[9px] font-bold text-slate-400">
                              <span>ADVISOR TELEPROMPTER READOUT</span>
                              <span>Scroll Rate: {teleprompterSpeed}x</span>
                            </div>
                            
                            <div className="h-32 overflow-hidden relative">
                              <div 
                                className="absolute left-0 right-0 space-y-2 transition-all duration-300"
                                style={{ transform: `translateY(-${teleprompterScroll}px)` }}
                              >
                                <p className="text-xs text-emerald-400 font-bold leading-relaxed text-center">
                                  {teleprompterScript}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Recording telemetry metrics */}
                          {isRecording && (
                            <div className="absolute top-4 left-4 z-20 bg-rose-600/90 border border-rose-400 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 animate-pulse">
                              <span>REC</span>
                              <span>•</span>
                              <span>{Math.floor(recordDuration / 60).toString().padStart(2, '0')}:{(recordDuration % 60).toString().padStart(2, '0')}</span>
                            </div>
                          )}

                          <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] text-white font-mono flex items-center gap-1.5">
                            <span>Format: {recordResolution}</span>
                            <span>•</span>
                            <span>FPS: 60</span>
                          </div>
                        </div>

                        {/* Animated Voice/Mic Bar Graphic */}
                        {isRecording && (
                          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-black/50 p-2 rounded-xl border border-white/10">
                            <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <div className="flex items-end gap-0.5 h-3 w-16">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
                                const heightVal = Math.floor(Math.random() * 10) + 2;
                                return (
                                  <div 
                                    key={bar} 
                                    className="bg-emerald-400 w-1 rounded-full transition-all duration-100" 
                                    style={{ height: `${isRecording ? heightVal * 1.5 : 2}px` }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-4 z-20">
                        <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                        <div>
                          <p className="text-sm font-black text-slate-300">Local Camera Integration Sandbox</p>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Activate the connection to test microcomputing lens and secure your direct hardware updates broadcast.</p>
                        </div>
                        <button 
                          onClick={() => setCameraStreamActive(true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg"
                        >
                          Initialize Stream Connection
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recording Setup Controls */}
                  {cameraStreamActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Teleprompter Text Editing area */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center pl-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teleprompter Custom Script Editor</label>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-slate-500 font-bold">Speed:</span>
                            <input 
                              type="range" 
                              min="0.5" 
                              max="4" 
                              step="0.5"
                              value={teleprompterSpeed} 
                              onChange={(e) => setTeleprompterSpeed(parseFloat(e.target.value))}
                              className="w-16 accent-emerald-500"
                            />
                            <span className="text-[9px] font-mono text-emerald-400">{teleprompterSpeed}x</span>
                          </div>
                        </div>
                        <textarea 
                          value={teleprompterScript}
                          onChange={(e) => setTeleprompterScript(e.target.value)}
                          rows={3}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Selected Resolution</label>
                          <select 
                            value={recordResolution}
                            onChange={(e: any) => setRecordResolution(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-hidden"
                          >
                            <option value="1080p">1080p (Pro-HD)</option>
                            <option value="4k">4K (Ultra-Definition)</option>
                            <option value="720p">720p (Adaptive Fast)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Microphone Input</label>
                          <select 
                            value={selectedMicInput}
                            onChange={(e) => setSelectedMicInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-hidden"
                          >
                            <option value="Integrated HD Array">Integrated HD Array (Default)</option>
                            <option value="External USB Condenser">External USB Condenser Mic</option>
                            <option value="Sovereign Sound Card Link">Sovereign Sound Card Link</option>
                          </select>
                        </div>

                        {/* Record Toggle Action Button */}
                        <div className="flex items-end">
                          <button 
                            onClick={toggleRecording}
                            className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                              isRecording 
                                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                            }`}
                          >
                            {isRecording ? (
                              <>
                                <span>Stop Recording</span>
                              </>
                            ) : (
                              <>
                                <Camera className="w-4 h-4" />
                                <span>Start Advisory Record</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              )}

              {/* === TOOL C: WRITE ARTICLES === */}
              {selectedTool === 'write_article' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Write Article Wire Briefing</span>
                    </h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded font-mono font-bold">
                      CFO Editorial Wire
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Article Title *</label>
                      <input 
                        type="text" 
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="e.g. Navigating Section 41 Hardware Tax Rebates"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Subheading / Summary</label>
                      <input 
                        type="text" 
                        value={articleSub}
                        onChange={(e) => setArticleSub(e.target.value)}
                        placeholder="Brief summary sentence highlighting primary business takeaway."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>
                  </div>

                  {/* Article content input with toolbar */}
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 pl-1 uppercase">
                      <span>Article Editorial Body</span>
                      <span className="font-mono text-emerald-400">
                        {articleBody.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>

                    {/* Toolbar simulator */}
                    <div className="bg-slate-950 p-2 rounded-t-xl border border-slate-850 border-b-0 flex gap-2">
                      {['Bold', 'Italic', 'H1', 'H2', 'Blockquote', 'Code'].map((format) => (
                        <button 
                          key={format} 
                          onClick={() => triggerToast(`Applied formatting style: ${format}`)}
                          type="button"
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-[10px] font-mono cursor-pointer transition-all"
                        >
                          {format}
                        </button>
                      ))}
                    </div>

                    <textarea 
                      value={articleBody}
                      onChange={(e) => setArticleBody(e.target.value)}
                      rows={6}
                      placeholder="Write your comprehensive strategic or compliance breakdown here. You may use standard markdown tags."
                      className="w-full bg-slate-900 border border-slate-800 rounded-b-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Cover Image URL</label>
                      <input 
                        type="text" 
                        value={articleCover}
                        onChange={(e) => setArticleCover(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Hashtags (comma-separated)</label>
                      <input 
                        type="text" 
                        value={articleTags}
                        onChange={(e) => setArticleTags(e.target.value)}
                        placeholder="e.g. #TaxCredit, #Section41, #AuditTrail"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button 
                      onClick={() => handlePublishArticle(true)}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs cursor-pointer border border-slate-800 transition-all text-center"
                    >
                      Save Draft Article
                    </button>
                    <button 
                      onClick={() => handlePublishArticle(false)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs cursor-pointer transition-all text-center shadow-lg"
                    >
                      Publish Article Broadcast
                    </button>
                  </div>
                </div>
              )}

              {/* === TOOL D: UPLOAD IMAGES === */}
              {selectedTool === 'upload_images' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-emerald-400" />
                      <span>Upload Slide or Infographic</span>
                    </h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded font-mono font-bold">
                      Corporate Slide Deck
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Graphic Post Title *</label>
                      <input 
                        type="text" 
                        value={imgTitle}
                        onChange={(e) => setImgTitle(e.target.value)}
                        placeholder="e.g. Q3 Sourcing Pipeline Matrix"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Image Asset Link / URL</label>
                      <input 
                        type="text" 
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Summary Description</label>
                    <textarea 
                      value={imgDesc}
                      onChange={(e) => setImgDesc(e.target.value)}
                      rows={3}
                      placeholder="Detailing physical assets matrix breakdown..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Asset Hashtags</label>
                      <input 
                        type="text" 
                        value={imgTags}
                        onChange={(e) => setImgTags(e.target.value)}
                        placeholder="#SupplyChain, #LogisticsMap"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden text-white"
                      />
                    </div>

                    {/* Simple live preview rendering block */}
                    <div className="border border-slate-850 p-2.5 rounded-xl bg-slate-950/40 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-850 overflow-hidden shrink-0">
                        <img src={imgUrl} alt="slide preview" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block font-bold">PREVIEW MATRIX</span>
                        <span className="text-xs text-white truncate max-w-[150px] block font-extrabold">{imgTitle || 'Staged graphic'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button 
                      onClick={() => handlePublishImage(true)}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs cursor-pointer border border-slate-800 transition-all text-center"
                    >
                      Save Draft Image
                    </button>
                    <button 
                      onClick={() => handlePublishImage(false)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs cursor-pointer transition-all text-center shadow-lg"
                    >
                      Publish Image Broadcast
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* ========================================================
            ================== TAB 2: DRAFTS BOARD =================
            ======================================================== */}
        {activeTab === 'drafts' && (
          <div className="lg:col-span-12 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Staged Ledger Drafts</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Edit, delete, or promote unfinished advisor broadcasts prior to global airing.</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                {contents.filter(c => c.status === 'draft').length} Drafts Pending Compliance
              </span>
            </div>

            {contents.filter(c => c.status === 'draft').length === 0 ? (
              <div className="bg-slate-900/15 border border-slate-850 p-12 rounded-3xl text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto" />
                <div>
                  <h4 className="text-white font-bold text-sm">No Draft Content Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Every advisory briefing drafted from the creation studio has been successfully published or scheduled.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contents.filter(c => c.status === 'draft').map((item) => (
                  <div key={item.id} className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                          item.type === 'video' 
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                            : item.type === 'article'
                              ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{item.createdAt}</span>
                      </div>

                      <h4 className="text-white font-black text-sm tracking-tight leading-snug">{item.title}</h4>
                      <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed">{item.description}</p>
                      
                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.hashtags.map((h, i) => (
                            <span key={i} className="text-[9px] font-mono text-slate-500 font-bold">{h}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-850/60 justify-between">
                      <button
                        onClick={() => handleDeleteContent(item.id)}
                        className="text-[11px] font-bold text-rose-500 hover:text-rose-400 flex items-center gap-1 bg-slate-950 p-2 rounded-lg cursor-pointer"
                        title="Delete Staged Draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Discard</span>
                      </button>

                      <button
                        onClick={() => handlePublishFromDraft(item.id)}
                        className="text-[11px] font-extrabold text-slate-950 hover:bg-emerald-400 bg-emerald-500 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Publish Live</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ================== TAB 3: SCHEDULE TIMELINE ============
            ======================================================== */}
        {activeTab === 'schedule' && (
          <div className="lg:col-span-12 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Scheduled Publication Queue</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated release timeline of compliance strategies for regional business units.</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                {contents.filter(c => c.status === 'scheduled').length} Items in Queue
              </span>
            </div>

            {contents.filter(c => c.status === 'scheduled').length === 0 ? (
              <div className="bg-slate-900/15 border border-slate-850 p-12 rounded-3xl text-center space-y-3">
                <Calendar className="w-12 h-12 text-slate-700 mx-auto" />
                <div>
                  <h4 className="text-white font-bold text-sm">Queue is Currently Empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Enable "Schedule Broadcast Release Time" during video upload or image posting to queue automated publishing.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {contents.filter(c => c.status === 'scheduled').map((item, idx) => (
                  <div key={item.id} className="bg-slate-900/40 border border-slate-850 p-4.5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all text-left">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail or Icon placeholder */}
                      <div className="w-16 h-10 rounded-lg bg-slate-850 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center relative">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover" />
                        ) : (
                          <Calendar className="w-5 h-5 text-slate-600" />
                        )}
                        <span className="absolute top-1 left-1 text-[8px] bg-emerald-500 text-slate-950 font-black px-1 rounded uppercase">
                          {item.type}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-white font-bold text-xs sm:text-sm tracking-tight">{item.title}</h4>
                        <div className="flex items-center gap-2.5 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Queue #{idx + 1}</span>
                          </span>
                          <span>•</span>
                          <span>Staged: {item.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end border-t border-slate-850/60 md:border-0 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[9px] font-black text-slate-500 uppercase block">RELEASE DATE</span>
                        <span className="font-mono text-xs font-black text-emerald-400">{item.publishAt}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setContents(prev => prev.map(c => {
                              if (c.id === item.id) return { ...c, status: 'draft' };
                              return c;
                            }));
                            triggerToast("📥 Recalled item from queue. Returned to Drafts drawer.");
                          }}
                          className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-black px-3 py-2 rounded-lg cursor-pointer"
                          title="Recall to Drafts"
                        >
                          Recall
                        </button>
                        <button
                          onClick={() => handlePublishFromDraft(item.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black px-3 py-2 rounded-lg cursor-pointer"
                        >
                          Publish Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ================== TAB 4: ANALYTICS & RETENTION ========
            ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="lg:col-span-12 space-y-6">
            
            {/* Header diagnostics */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-850 pb-3 gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  <span>Advisor Retention & Reach Auditing</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Statistical oversight of audience attention spans, retention drop-off milestones, and monetization payout yield.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-mono">Last 7 Days Ledger</span>
              </div>
            </div>

            {/* THREE COLUMN STAT CARD HIGHLIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl text-left relative overflow-hidden">
                <div className="absolute top-3 right-3 p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Views Reach</span>
                <div className="text-2xl font-black text-white font-mono mt-1.5">14,350</div>
                <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5">
                  <span>↑ 18.2%</span> <span className="text-slate-500">vs historical baseline</span>
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl text-left relative overflow-hidden">
                <div className="absolute top-3 right-3 p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg. Advisory Watchtime</span>
                <div className="text-2xl font-black text-white font-mono mt-1.5">02m 14s</div>
                <p className="text-[10px] text-sky-400 font-bold mt-1.5 flex items-center gap-0.5">
                  <span>↑ 5.1s</span> <span className="text-slate-500">above industry benchmark</span>
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl text-left relative overflow-hidden">
                <div className="absolute top-3 right-3 p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ad-Share Royalty Staged</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1.5">$1,830</div>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-0.5">
                  <span className="text-emerald-400 font-bold">100% compliant</span> <span>split structure</span>
                </p>
              </div>
            </div>

            {/* GRAPHS SPLIT PANEL (RETENTION CURVE VS REACH) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Graph A: Dynamic Viewer Retention Curve (YouTube Shorts Standard metric) */}
              <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl text-left space-y-4">
                <div>
                  <h4 className="text-white font-extrabold text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Audience Audience Retention Profile</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Tracks percentage of advisor workspace viewers remaining active across the video timeline. Aim to sustain above 50% past the 1-minute benchmark.
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={viewerEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="Retention" name="Our Videos %" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRetention)" />
                      <Line type="monotone" dataKey="Benchmark" name="Benchmark %" stroke="#475569" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Graph B: Daily Reach & Profit Staging */}
              <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl text-left space-y-4">
                <div>
                  <h4 className="text-white font-extrabold text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Daily Airing Exposure & Royalty Share</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Tracks absolute unique IP view impressions and cumulative partner payout ledger pools.
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalReachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="Views" name="Views" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="RevenueShare" name="Royalty share ($)" stroke="#38bdf8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            ================== TAB 5: MONETIZATION HUB =============
            ======================================================== */}
        {activeTab === 'monetization' && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-850 pb-3 gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Advisory Royalty & Monetization Hub</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Configure corporate payout routing, verify tax compliance status, and track milestone goals to unlock monetization program options.</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                Monetization Setup: Complete
              </span>
            </div>

            {/* MILESTONE THRESHOLD PROGRESS PANEL */}
            <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl text-left space-y-5">
              <div>
                <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Partner Program Qualification Meter</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  To monetize premium advisor shorts on regional business ledger networks, you must achieve the baseline criteria of 1,500 following accounts and 4,000 watch hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Milestone 1 */}
                <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Active Follower Accounts</span>
                    <span className="text-emerald-400 font-mono">{currentFollowers} / {followerTarget}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-slate-850 rounded-full overflow-hidden relative">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${followerProgress}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                    <span>Progress to unlock</span>
                    <span>{followerProgress}%</span>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Cumulative Watch Hours (Yearly)</span>
                    <span className="text-emerald-400 font-mono">{currentWatchHours} / {watchHoursTarget}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-slate-850 rounded-full overflow-hidden relative">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${watchHoursProgress}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                    <span>Progress to unlock</span>
                    <span>{watchHoursProgress}%</span>
                  </div>
                </div>

              </div>

              {/* Status Alert & Application triggers */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-4.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h5 className="text-emerald-400 font-extrabold text-xs">MONETIZATION READY STATUS MET</h5>
                    <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                      Congratulations! Your business account is in excellent health and has cleared the compliance checkpoints. You can now enable active royalty generation and set up direct ACH revenue routing.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  {hasAppliedForMonetization ? (
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Enrollment
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        setHasAppliedForMonetization(true);
                        triggerToast("🎉 Congratulations! Enrolled successfully in the premium ad revenue distribution pool.");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-md"
                    >
                      Apply For Partner Program
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PAYOUT CONFIGURATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ACH Routing settings */}
              <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl text-left space-y-4">
                <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>ACH Revenue Payout Routing</span>
                </h4>
                
                <div className="grid grid-cols-1 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Direct Payout Account (ACH)</label>
                    <input 
                      type="text" 
                      value={achRouting}
                      onChange={(e) => setAchRouting(e.target.value)}
                      placeholder="Enter Routing Account Number"
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Corporate Tax EIN / ID</label>
                    <input 
                      type="text" 
                      value={corporateTaxId}
                      onChange={(e) => setCorporateTaxId(e.target.value)}
                      placeholder="EIN Number xx-xxxxxxx"
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => triggerToast("🏦 Corporate financial details updated. Changes logged with audit node.")}
                  className="bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-all"
                >
                  Save Banking Parameters
                </button>
              </div>

              {/* Active Monetization toggles */}
              <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl text-left space-y-4">
                <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Royalty Compliance Controls</span>
                </h4>

                <div className="space-y-4.5 text-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-850/60">
                    <div>
                      <span className="font-bold text-slate-200 block">Ad-sense Revenue Share</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Enable mid-roll corporate interstitial spots.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isAdMonetizationEnabled} 
                        onChange={(e) => {
                          setIsAdMonetizationEnabled(e.target.checked);
                          triggerToast(e.target.checked ? "💵 Ad revenue program enabled." : "⏸️ Ad revenue generation paused.");
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-slate-950"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-850/60">
                    <div>
                      <span className="font-bold text-slate-200 block">SEC Registered Investor Gate</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Require credential validation prior to viewing details.</span>
                    </div>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 text-emerald-400 font-mono font-bold px-2 py-1 rounded">
                      AUTO-ENFORCED
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block">Encrypted Staging Buffer</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Keep all stream clips encrypted on cloud host nodes.</span>
                    </div>
                    <span className="text-[9px] bg-slate-850 border border-slate-800 text-emerald-400 font-mono font-bold px-2 py-1 rounded">
                      ACTIVE (AES-256)
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
