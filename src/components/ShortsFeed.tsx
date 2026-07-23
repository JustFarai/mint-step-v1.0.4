import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, MessageCircle, Share2, Bookmark, Flame, UserPlus, UserCheck, 
  AlertOctagon, Volume2, VolumeX, Play, Pause, ChevronDown, ChevronUp, 
  Sparkles, Check, Send, Copy, FileText, Download, Sliders, Radio,
  Wifi, HelpCircle, ArrowRight, Settings, Maximize2, FileCode, CheckCircle2,
  Lock, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
export interface VideoTranscriptSegment {
  timeStart: number;
  timeEnd: number;
  text: string;
}

export interface VideoItem {
  id: string;
  title: string;
  topic: string;
  description: string;
  authorName: string;
  authorTitle: string;
  avatarColor: string;
  videoUrl: string;
  durationString: string; // <= 8m 30s as requested
  durationSeconds: number;
  likes: number;
  commentsCount: number;
  shares: number;
  saves: number;
  isInitialLiked?: boolean;
  isInitialSaved?: boolean;
  isInitialFollowing?: boolean;
  transcript: VideoTranscriptSegment[];
  aiSummary: string;
  aiKPIs: { label: string; value: string; color: string }[];
  commentsList: { id: string; user: string; text: string; time: string; avatar: string }[];
}

export default function ShortsFeed() {
  // --- Video Database ---
  const initialVideos: VideoItem[] = [
    {
      id: 'v1',
      title: 'Global Semiconductor Sourcing Strategy',
      topic: 'Silicon Supply Chains & Capital Efficiency',
      description: 'Auditing hardware capital allocation. Our Quantum Switch v4 reserve locking $21,600 at cost is reviewed to reduce shipping lead times through strategic Shenzhen logistics channels.',
      authorName: 'Elena Rostova',
      authorTitle: 'CFO AI Advisor / Quantitative Analyst',
      avatarColor: 'from-amber-400 to-orange-500',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blockchain-technology-31830-large.mp4',
      durationString: '01:15',
      durationSeconds: 75,
      likes: 1240,
      commentsCount: 89,
      shares: 342,
      saves: 520,
      isInitialLiked: true,
      isInitialSaved: false,
      isInitialFollowing: false,
      transcript: [
        { timeStart: 0, timeEnd: 8, text: "Welcome back, enterprise leaders. Today we are auditing the global silicon wafer supply crunch." },
        { timeStart: 8, timeEnd: 19, text: "Our capital lockup in Quantum Switch v4 modules stands at $21,600, representing 18 warehouse units." },
        { timeStart: 19, timeEnd: 32, text: "By shifting our procurement to Shenzhen Microassembly, we can reduce logistics lead times by 35%." },
        { timeStart: 32, timeEnd: 48, text: "Keep a critical eye on low stock indicators. We recommend executing the rapid purchase order protocol immediately." },
        { timeStart: 48, timeEnd: 62, text: "This will stabilize downstream hardware integration and preserve our 52.3% project-level margins." },
        { timeStart: 62, timeEnd: 75, text: "Ensure your corporate inventory ledger is updated in real-time. Join me on the next episode." }
      ],
      aiSummary: `### 🤖 CFO AI Advisory: Silicon Supply Chain Optimization

Elena highlights a major capital bottleneck: **$21,600 is currently tied up** in active inventory of **Quantum Switch v4** modules. 

#### 📈 Key Strategic Recommendations:
*   **Logistics Realignment:** Move procurement routes from high-friction channels to **Shenzhen Microassembly** to secure a **35% lead-time reduction**.
*   **Safety Buffer Trigger:** Configure low stock automated triggers to preserve project delivery cadences.
*   **Margin Safeguard:** These logistics adjustments will buffer the high-priority **52.3% project gross margin** against semiconductor volatility.`,
      aiKPIs: [
        { label: "Capital Exposed", value: "$21,600", color: "text-amber-400" },
        { label: "Lead-Time Cut", value: "-35%", color: "text-emerald-400" },
        { label: "Target Margin", value: "52.3%", color: "text-sky-400" }
      ],
      commentsList: [
        { id: 'c1_1', user: 'TechOps_Director', text: 'This supply chain shift matches what we saw with TSMC wafers last quarter.', time: '2 hours ago', avatar: '💻' },
        { id: 'c1_2', user: 'FinFlow_Guru', text: 'Shaving 35% off delivery times directly unlocks locked working capital. Brilliant!', time: '4 hours ago', avatar: '📈' },
        { id: 'c1_3', user: 'Hardware_Hustler', text: 'Are the Shenzhen custom clearance certificates pre-integrated into our DHL tab?', time: '5 hours ago', avatar: '🛠️' }
      ]
    },
    {
      id: 'v2',
      title: 'Unlocking Section 41 R&D Tax Credits',
      topic: 'Tax Strategy & Compliance Automation',
      description: 'Discover how fabricating custom server hardware and Sovereign Node enclosures can yield a 12% direct federal tax write-off utilizing automated ledger tagging in FinFlow.',
      authorName: 'Marcus Vance',
      authorTitle: 'Senior Tax AI / Corporate Counsel',
      avatarColor: 'from-emerald-400 to-teal-500',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-server-room-34444-large.mp4',
      durationString: '01:10',
      durationSeconds: 70,
      likes: 954,
      commentsCount: 62,
      shares: 180,
      saves: 430,
      isInitialLiked: false,
      isInitialSaved: true,
      isInitialFollowing: true,
      transcript: [
        { timeStart: 0, timeEnd: 10, text: "Attention hardware developers. Building bespoke cloud enclosures isn't just about operations." },
        { timeStart: 10, timeEnd: 22, text: "Under Section 41, every dollar of custom fabrication expenses represents an eligible R&D tax credit." },
        { timeStart: 22, timeEnd: 35, text: "For our Sovereign Node Enclosures, that equates to a 12% write-off on all material testing and logistics overhead." },
        { timeStart: 35, timeEnd: 48, text: "To secure this benefit, you must link and tag all manufacturing receipts directly inside the business journal." },
        { timeStart: 48, timeEnd: 60, text: "FinFlow handles the compliance trail automatically, compiling an audit-ready PDF." },
        { timeStart: 60, timeEnd: 70, text: "Stop leaving capital on the table. Claim your Section 41 credits today." }
      ],
      aiSummary: `### 🏛️ Tax Advisory: Section 41 Credit Harvesting

Marcus demonstrates how to convert physical hardware assembly expenses into immediate federal tax offsets under the **Section 41 R&D Credit**.

#### ⚡ Actionable Insights:
*   **Asset Inclusions:** Fabricating custom servers (like the *Sovereign Node Enclosure*) counts directly towards qualified research expenses (QREs).
*   **12% Tax Offset:** Recovers a substantial portion of design, tooling, and stress-testing overhead.
*   **Compliance Trail:** Use FinFlow's automated metadata tagger to bundle receipts into an audit-proof report, minimizing IRS examination risk.`,
      aiKPIs: [
        { label: "Tax Offset Rate", value: "12% QRE", color: "text-emerald-400" },
        { label: "Eligible SKU", value: "Sovereign Case", color: "text-amber-400" },
        { label: "Audit Readiness", value: "100% Automated", color: "text-teal-400" }
      ],
      commentsList: [
        { id: 'c2_1', user: 'CFO_SaaS_Enterprise', text: 'Does this apply to external assembly consultants or only in-house engineers?', time: '1 day ago', avatar: '👔' },
        { id: 'c2_2', user: 'Venture_Capital_LP', text: 'Essential video. Most startups ignore physical asset tax harvesting entirely.', time: '2 days ago', avatar: '💸' }
      ]
    },
    {
      id: 'v3',
      title: 'Ethereum Core Nodes vs AWS Validator Costs',
      topic: 'Infrastructure Optimization & Web3',
      description: 'Is cloud hosting eating your validator yield? We contrast physical hardware amortization ($129/mo) against standard AWS compute ($350/mo + heavy egress costs).',
      authorName: 'Akihiro Sato',
      authorTitle: 'Crypto Infrastructure AI Advisor',
      avatarColor: 'from-purple-400 to-indigo-600',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-financial-graphics-on-a-laptop-screen-34424-large.mp4',
      durationString: '01:20',
      durationSeconds: 80,
      likes: 2105,
      commentsCount: 231,
      shares: 940,
      saves: 812,
      isInitialLiked: false,
      isInitialSaved: false,
      isInitialFollowing: false,
      transcript: [
        { timeStart: 0, timeEnd: 8, text: "Let's run the hard numbers on decentralized infrastructure hosting." },
        { timeStart: 8, timeEnd: 21, text: "A physical Ethereum Core Node Assembly costs $1,550 retail. Amortized over 12 months, that's just $129 per month." },
        { timeStart: 21, timeEnd: 34, text: "In contrast, hosting equivalent virtual validators on AWS averages $350 monthly, excluding variable bandwidth egress charges." },
        { timeStart: 34, timeEnd: 48, text: "That means self-hosting saves over 62% in hardware overhead while achieving absolute network sovereignty." },
        { timeStart: 48, timeEnd: 63, text: "With built-in cryptographic co-processors on our node layouts, uptime stays on par with central hosting giants." },
        { timeStart: 63, timeEnd: 80, text: "Don't let third-party cloud inflation erode your staking yield. Go physical, secure your keys, and keep your gains." }
      ],
      aiSummary: `### 🌐 Web3 Advisory: Sovereign Hardware vs. Central Cloud

Akihiro details the economic benefits of self-hosted validation nodes over standard cloud computing providers.

#### 📊 Cost Breakdown:
*   **Physical Node (Amortized):** **$129/month** (representing a one-time $1,550 asset acquisition).
*   **AWS Virtual Instance:** **$350+/month** (subject to compute inflation and network egress taxes).
*   **Efficiency Gains:** **62% overhead reduction**, leaving more validators capital free to compile direct staking yield.
*   **Security Verdict:** In-house co-processors match cloud SLA rates without exposing private validator keys to foreign servers.`,
      aiKPIs: [
        { label: "Hardware Cost", value: "$129/mo", color: "text-emerald-400" },
        { label: "AWS Cost", value: "$350/mo+", color: "text-rose-400" },
        { label: "Sovereign Savings", value: "62% Yield", color: "text-purple-400" }
      ],
      commentsList: [
        { id: 'c3_1', user: 'Validator_Stacker', text: 'Self-hosting is easy but home ISPs are the bottleneck. Need backup power!', time: '3 hours ago', avatar: '⚡' },
        { id: 'c3_2', user: 'Aki_Fanboy', text: 'This math is rock solid. Just ordered 2 custom core node frames.', time: '12 hours ago', avatar: '🔥' }
      ]
    },
    {
      id: 'v4',
      title: 'DHL Logistics Alert: Liquid Helium Reprocurement',
      topic: 'Just-In-Time Warehousing Operations',
      description: 'Uptime warning: our mainframe supercomputing blades are at risk. With only 1 unit of Liquid Helium Cryo-Coils remaining, we outline the urgent logistics pipeline to restock.',
      authorName: 'DHL Logistics Agent',
      authorTitle: 'Automated Supply Chain Advisor',
      avatarColor: 'from-rose-500 to-red-600',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-financial-charts-34426-large.mp4',
      durationString: '01:05',
      durationSeconds: 65,
      likes: 620,
      commentsCount: 45,
      shares: 92,
      saves: 110,
      isInitialLiked: false,
      isInitialSaved: false,
      isInitialFollowing: false,
      transcript: [
        { timeStart: 0, timeEnd: 10, text: "Critical warehouse notification. We have detected a low-stock alert on Liquid Helium Cryo-Coils." },
        { timeStart: 10, timeEnd: 21, text: "Current inventory is down to 1 single unit. The system restock safety threshold is 3." },
        { timeStart: 21, timeEnd: 35, text: "Our server blades depend on active cryo-cooling to prevent extreme thermal throttling during computing spikes." },
        { timeStart: 35, timeEnd: 48, text: "We have compiled high-priority Purchase Order PO-2026-002 with DHL air logistics hubs." },
        { timeStart: 48, timeEnd: 58, text: "As soon as you approve the PO, our courier network triggers immediate customs priority." },
        { timeStart: 58, timeEnd: 65, text: "Resolve this alert now inside your inventory control center." }
      ],
      aiSummary: `### 🚨 Urgent Supply Alert: Mainframe Cryo-Cooling Shortage

Our logistics advisor signals an immediate risk to high-performance edge server uptime due to critical coolant depletion.

#### 📍 Operational Overview:
*   **Depletion Warning:** Liquid Helium Cryo-Coils are sitting at **1 unit** (Threshold: **3**).
*   **System Impact:** Thermal failure or intense CPU throttling under high workload spikes.
*   **Pre-negotiated Order:** **PO-2026-002** is staged and ready for air freight dispatch with immediate priority customs clearance. Action: approve the draft.`,
      aiKPIs: [
        { label: "Active Stock", value: "1 Unit", color: "text-red-400" },
        { label: "Buffer Threshold", value: "3 Units", color: "text-amber-400" },
        { label: "Freight Status", value: "Awaiting App", color: "text-rose-400" }
      ],
      commentsList: [
        { id: 'v4_1', user: 'Operations_Lead', text: 'Approved! We can\'t afford server throttling during the market close.', time: '30 mins ago', avatar: '🚨' },
        { id: 'v4_2', user: 'Inventory_Specialist', text: 'Logistics integration makes this incredibly quick to authorize.', time: '1 hour ago', avatar: '📦' }
      ]
    }
  ];

  // --- Persistent & UI States ---
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('wf_shorts_data');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [qualityMode, setQualityMode] = useState<'Auto' | '1080p' | '720p' | '480p'>('Auto');
  const [simulatedBandwidth, setSimulatedBandwidth] = useState('14.2 Mbps');
  const [simulatedNetworkQuality, setSimulatedNetworkQuality] = useState('1085p Ultra HD');
  const [activeSideTab, setActiveSideTab] = useState<'summary' | 'transcript' | 'comments' | 'settings'>('summary');
  
  // Custom interactive comments state
  const [newCommentText, setNewCommentText] = useState('');
  
  // Social Action overlays
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video and Scrolling elements references
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const currentVideo = useMemo(() => videos[activeIndex] || videos[0], [videos, activeIndex]);

  // --- Save states to localStorage ---
  useEffect(() => {
    localStorage.setItem('wf_shorts_data', JSON.stringify(videos));
  }, [videos]);

  // --- Toast Trigger helper ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Adaptive Streaming Quality Simulation ---
  useEffect(() => {
    if (qualityMode === 'Auto') {
      // Periodic variance in connection metrics
      const interval = setInterval(() => {
        const bandwidths = ['18.4 Mbps', '12.1 Mbps', '22.8 Mbps', '9.5 Mbps'];
        const qualities = ['1080p HD (60fps)', '720p Optimized', '1080p Pro', '480p Adaptive-Fast'];
        const randomIdx = Math.floor(Math.random() * bandwidths.length);
        setSimulatedBandwidth(bandwidths[randomIdx]);
        setSimulatedNetworkQuality(qualities[randomIdx]);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setSimulatedBandwidth('Custom Cap');
      setSimulatedNetworkQuality(`${qualityMode} Standard`);
    }
  }, [qualityMode]);

  // --- Lazy Loading and Autoplay scroll handler ---
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollTop;
    const itemHeight = container.clientHeight || 580; // height of each panel
    const newIdx = Math.round(scrollPosition / itemHeight);

    if (newIdx !== activeIndex && newIdx >= 0 && newIdx < videos.length) {
      setActiveIndex(newIdx);
      setCurrentTime(0);
      setIsPlaying(true);
      // Play transition feedback beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch (e) {}
    }
  };

  // --- Handle Autoplay Playback control ---
  useEffect(() => {
    // Pause all videos except the active index
    Object.keys(videoRefs.current).forEach((vidKey) => {
      const videoEl = videoRefs.current[vidKey];
      if (videoEl) {
        if (vidKey === currentVideo.id && isPlaying) {
          // Play current
          videoEl.play().catch(() => {
            // Browser autoplay restrictions triggered - fallback is state-level pause
          });
        } else {
          // Pause others
          videoEl.pause();
        }
      }
    });
  }, [currentVideo.id, isPlaying]);

  // --- Volume mute controller ---
  const toggleMute = () => {
    setIsMuted(!isMuted);
    Object.keys(videoRefs.current).forEach((vidKey) => {
      const videoEl = videoRefs.current[vidKey];
      if (videoEl) {
        videoEl.muted = !isMuted;
      }
    });
    triggerToast(isMuted ? "🔊 Audio Unmuted" : "🔇 Audio Muted");
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // --- Scroll navigation controllers ---
  const handleNextVideo = () => {
    if (activeIndex < videos.length - 1 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: (activeIndex + 1) * container.clientHeight,
        behavior: 'smooth'
      });
    } else {
      triggerToast("✨ You have caught up with all current Advisor insights!");
    }
  };

  const handlePrevVideo = () => {
    if (activeIndex > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: (activeIndex - 1) * container.clientHeight,
        behavior: 'smooth'
      });
    }
  };

  // --- Social Actions state changers ---
  const handleLike = () => {
    setVideos(prev => prev.map(v => {
      if (v.id === currentVideo.id) {
        const liked = !v.isInitialLiked;
        return {
          ...v,
          isInitialLiked: liked,
          likes: liked ? v.likes + 1 : v.likes - 1
        };
      }
      return v;
    }));
    triggerToast(currentVideo.isInitialLiked ? "💔 Removed like from insight" : "❤️ Saved to Liked Insights");
  };

  const handleSave = () => {
    setVideos(prev => prev.map(v => {
      if (v.id === currentVideo.id) {
        const saved = !v.isInitialSaved;
        return {
          ...v,
          isInitialSaved: saved,
          saves: saved ? v.saves + 1 : v.saves - 1
        };
      }
      return v;
    }));
    triggerToast(currentVideo.isInitialSaved ? "📥 Removed from bookmark library" : "📥 Staged in Enterprise Strategy Collection");
  };

  const handleFollow = () => {
    setVideos(prev => prev.map(v => {
      if (v.id === currentVideo.id) {
        return { ...v, isInitialFollowing: !v.isInitialFollowing };
      }
      return v;
    }));
    triggerToast(currentVideo.isInitialFollowing ? `Unfollowed advisor ${currentVideo.authorName}` : `🎯 Subscribed to ${currentVideo.authorName}'s daily briefs!`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setVideos(prev => prev.map(v => {
      if (v.id === currentVideo.id) {
        const newComment = {
          id: 'c_user_' + Date.now(),
          user: 'CFO_Advisor_Pro',
          text: newCommentText,
          time: 'Just now',
          avatar: '🤵'
        };
        return {
          ...v,
          commentsCount: v.commentsCount + 1,
          commentsList: [newComment, ...v.commentsList]
        };
      }
      return v;
    }));
    setNewCommentText('');
    triggerToast("💬 Comment published to advisor forum!");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) {
      alert("Please select a valid report reason category.");
      return;
    }
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportReason('');
      triggerToast("⚖️ Audit Flag submitted. Security and compliance logs successfully routed.");
    }, 1500);
  };

  // --- Copy Share link helper ---
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://boxtech.enterprise/insights/shorts?id=${currentVideo.id}`);
    triggerToast("📋 Actionable URL copied to clipboard!");
  };

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md p-6 max-w-7xl mx-auto flex flex-col space-y-6">
      
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 bg-emerald-600 border border-emerald-400 px-5 py-3 text-white rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-xs tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SECTION TITLE HEADER --- */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-slate-850 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest mb-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            <span>AI Advisor Live Shorts Feed</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            CFO Video Insights 
            <span className="text-[10px] font-black bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md border border-rose-500/30">
              Interactive Beta
            </span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-3xl">
            TikTok and YouTube Shorts-style high-density business learning channel. Auto-play vertical snaps of operational updates with real-time text highlight transcript tracking and direct section seeking.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-850 self-start lg:self-auto">
          <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-500">ADAPTIVE QUALITY STATUS</div>
            <div className="text-xs font-mono font-black text-white flex items-center gap-1.5 justify-end">
              <span>{simulatedNetworkQuality}</span>
              <span className="text-[10px] text-slate-400">({simulatedBandwidth})</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID SPLIT VIEW: SHORTS PLAYER VS AI ANALYTICAL CO-PILOT SIDEPANEL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPONENT (COL 5): MOCK PHONE VERTICAL TICKER / PLAYER VIEWPORT */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Main Simulated device shell wrapper */}
          <div className="w-full max-w-[340px] md:max-w-[370px] bg-slate-900 rounded-[3rem] p-4.5 border-[6px] border-slate-800 shadow-3xl relative overflow-hidden flex flex-col aspect-[9/16] h-[640px] select-none">
            
            {/* Phone Speaker & Camera Notch top ornament */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-950 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-3 border border-slate-900"></div>
            </div>

            {/* Vertical Snap-Scrolling Core container */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth rounded-[2rem] relative bg-black no-scrollbar"
              style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}
            >
              {videos.map((vid, idx) => {
                const isActive = idx === activeIndex;
                
                return (
                  <div 
                    key={vid.id}
                    className="w-full h-full shrink-0 snap-start snap-always relative overflow-hidden flex flex-col justify-between"
                  >
                    {/* Lazy-loaded video or gorgeous placeholder gradient if not near viewport */}
                    {Math.abs(idx - activeIndex) <= 1 ? (
                      <video
                        ref={(el) => { videoRefs.current[vid.id] = el; }}
                        src={vid.videoUrl}
                        loop
                        muted={isMuted}
                        playsInline
                        onTimeUpdate={(e) => {
                          if (isActive) {
                            setCurrentTime(e.currentTarget.currentTime);
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-slate-800 flex flex-col items-center justify-center p-4">
                        <UserCheck className="w-12 h-12 text-slate-700 animate-pulse" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-2">Loading Stream...</span>
                      </div>
                    )}

                    {/* Dark Vignette overlays for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 z-10 pointer-events-none" />

                    {/* Quality badge indicator / audio indicator */}
                    <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white font-mono text-[9px] font-black">
                        <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                        <span>INSIGHT #{idx + 1}</span>
                      </div>

                      <button
                        onClick={toggleMute}
                        className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full border border-white/10 transition-all cursor-pointer z-30"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    </div>

                    {/* RIGHT SIDE FLOATING INTERACTION METRICS TIER */}
                    <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center space-y-4">
                      
                      {/* Advisor avatar with Follow/Sub indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-11 h-11 bg-gradient-to-tr ${vid.avatarColor} rounded-full border-2 border-white flex items-center justify-center text-white text-base shadow-lg relative`}>
                          {vid.authorName.split(' ')[0][0]}
                          
                          <button
                            onClick={handleFollow}
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-md cursor-pointer transition-all active:scale-90 ${
                              vid.isInitialFollowing 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {vid.isInitialFollowing ? <UserCheck className="w-2.5 h-2.5" /> : <UserPlus className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Like Action */}
                      <button
                        onClick={handleLike}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 border border-white/10 transition-all active:scale-90 ${
                          vid.isInitialLiked ? 'text-rose-500 border-rose-500/30' : 'text-slate-300'
                        }`}>
                          <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-white mt-1 shadow-md">
                          {vid.likes}
                        </span>
                      </button>

                      {/* Comment Tab Switcher */}
                      <button
                        onClick={() => {
                          setActiveSideTab('comments');
                          triggerToast("💬 Shifted viewport focus to advisor comments panel.");
                        }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 border border-white/10 text-slate-300 transition-all active:scale-90">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-white mt-1 shadow-md">
                          {vid.commentsCount}
                        </span>
                      </button>

                      {/* Bookmark Save Action */}
                      <button
                        onClick={handleSave}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 border border-white/10 transition-all active:scale-90 ${
                          vid.isInitialSaved ? 'text-amber-400 border-amber-400/30' : 'text-slate-300'
                        }`}>
                          <Bookmark className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-white mt-1 shadow-md">
                          {vid.saves}
                        </span>
                      </button>

                      {/* Share Action Button */}
                      <button
                        onClick={() => setShareModalOpen(true)}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 border border-white/10 text-slate-300 transition-all active:scale-90">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-white mt-1 shadow-md">
                          Share
                        </span>
                      </button>

                      {/* Report Action Button */}
                      <button
                        onClick={() => setReportModalOpen(true)}
                        className="flex flex-col items-center group cursor-pointer"
                        title="Compliance Report"
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 border border-white/10 text-rose-400/85 transition-all active:scale-90">
                          <AlertOctagon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-semibold text-slate-300 mt-1">Audit</span>
                      </button>

                    </div>

                    {/* BOTTOM TEXT CAPTIONS & INFO OVERLAYS */}
                    <div className="absolute left-4 bottom-6 right-16 z-20 flex flex-col text-left">
                      
                      {/* Topic Category */}
                      <div className="flex items-center gap-1.5 mb-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start px-2 py-0.5 rounded-md text-[9px] font-black uppercase">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{vid.topic}</span>
                      </div>

                      {/* Author Title credentials */}
                      <h3 className="font-extrabold text-white text-sm tracking-tight truncate drop-shadow-lg">
                        @{vid.authorName}
                      </h3>
                      <p className="text-[10px] text-slate-300 font-medium truncate opacity-90 drop-shadow-md">
                        {vid.authorTitle}
                      </p>

                      {/* Description blurb */}
                      <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 leading-normal opacity-85 pr-2 drop-shadow-xs">
                        {vid.description}
                      </p>

                      {/* Live Playback seek bar */}
                      <div className="flex items-center gap-2 mt-3.5">
                        <button 
                          onClick={handlePlayPause}
                          className="text-white hover:text-emerald-400 transition-all cursor-pointer shrink-0"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>
                        
                        {/* Dynamic timeline display */}
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer group">
                          <div 
                            className="h-full bg-emerald-500 rounded-full relative"
                            style={{ width: `${(currentTime / vid.durationSeconds) * 100}%` }}
                          >
                            <span className="absolute -right-1 -top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-500 shadow-xs scale-0 group-hover:scale-100 transition-transform"></span>
                          </div>
                        </div>

                        {/* Format total duration cap: 8m 30s ceiling representation */}
                        <span className="text-[9px] font-mono text-white/90 font-bold shrink-0">
                          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {vid.durationString}
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Arrow Nav Controls centered on phone rim bottom */}
            <div className="absolute bottom-1 right-4 flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-1 rounded-full shadow-lg z-30">
              <button 
                onClick={handlePrevVideo}
                disabled={activeIndex === 0}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all disabled:opacity-20 cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextVideo}
                disabled={activeIndex === videos.length - 1}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all disabled:opacity-20 cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COMPONENT (COL 7): ANALYTICS CO-PILOT SIDEPANEL & INTEGRATED TOOLS */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-850 rounded-[2.5rem] p-6.5 flex flex-col justify-between h-[640px] relative overflow-hidden">
          
          {/* TAB HEADERS FOR SIDE PANEL */}
          <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-850 shrink-0 gap-1.5">
            <button
              onClick={() => setActiveSideTab('summary')}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSideTab === 'summary'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CFO AI Summary</span>
            </button>

            <button
              onClick={() => setActiveSideTab('transcript')}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSideTab === 'transcript'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Interactive Transcript</span>
            </button>

            <button
              onClick={() => setActiveSideTab('comments')}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSideTab === 'comments'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Forum ({currentVideo.commentsList.length})</span>
            </button>

            <button
              onClick={() => setActiveSideTab('settings')}
              className={`py-3 px-3.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                activeSideTab === 'settings'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
              }`}
              title="Streaming Quality"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* DYNAMIC SCROLLABLE BODY CONTENT */}
          <div className="flex-1 overflow-y-auto my-5 pr-1 text-left">
            
            {/* T1: AI SUMMARY TAB */}
            {activeSideTab === 'summary' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                
                {/* Advisor credential introduction card */}
                <div className="bg-slate-900/50 p-4.5 rounded-2xl border border-slate-850 flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentVideo.avatarColor} flex items-center justify-center text-white text-lg font-bold shrink-0`}>
                    {currentVideo.authorName.split(' ')[0][0]}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{currentVideo.authorName}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold">{currentVideo.authorTitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-750 px-2 py-0.5 rounded font-mono font-bold">
                        {currentVideo.durationString} Length Limit
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold">•</span>
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> SEC compliant advisory
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main dynamic generated summary markdown container */}
                <div className="bg-slate-900/35 p-5 rounded-2xl border border-slate-850/60 leading-relaxed text-xs text-slate-300 prose prose-invert max-w-none">
                  
                  {/* Styled Summary output */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>SECURE COMPILER REPORT OUTPUT</span>
                    </div>
                    
                    <div className="whitespace-pre-line text-slate-200">
                      {currentVideo.aiSummary}
                    </div>
                  </div>

                </div>

                {/* KPIs grid generated for quick executive read */}
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2.5">
                    METRIC KEY HIGHLIGHTS
                  </h5>
                  <div className="grid grid-cols-3 gap-3">
                    {currentVideo.aiKPIs.map((kpi, idx) => (
                      <div key={idx} className="bg-slate-900/40 border border-slate-850 p-3.5 rounded-xl text-center">
                        <div className={`font-mono text-base font-black ${kpi.color}`}>
                          {kpi.value}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1.5">
                          {kpi.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* T2: INTERACTIVE TRANSCRIPT TAB */}
            {activeSideTab === 'transcript' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-850/60 text-slate-400 text-xs flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Click any segment</strong> to jump playback directly to that timestamp. Sentence highlighting automatically aligns with the active narrator speech track time.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {currentVideo.transcript.map((seg, sIdx) => {
                    const isPassed = currentTime >= seg.timeStart;
                    const isCurrentlyPlaying = currentTime >= seg.timeStart && currentTime < seg.timeEnd;
                    
                    return (
                      <div
                        key={sIdx}
                        onClick={() => {
                          const activeVideoEl = videoRefs.current[currentVideo.id];
                          if (activeVideoEl) {
                            activeVideoEl.currentTime = seg.timeStart;
                            setCurrentTime(seg.timeStart);
                            setIsPlaying(true);
                            triggerToast(`⏩ Jumped to ${Math.floor(seg.timeStart / 60)}:${(seg.timeStart % 60).toString().padStart(2, '0')}`);
                          }
                        }}
                        className={`p-4 rounded-xl border cursor-pointer text-left transition-all relative overflow-hidden ${
                          isCurrentlyPlaying
                            ? 'bg-emerald-950/45 border-emerald-500/50 text-white shadow-md'
                            : isPassed 
                              ? 'bg-slate-900/40 border-slate-850 text-slate-200/90'
                              : 'bg-slate-900/10 border-transparent text-slate-500'
                        }`}
                      >
                        {isCurrentlyPlaying && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 animate-pulse" />
                        )}

                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                            {isCurrentlyPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
                            {Math.floor(seg.timeStart / 60)}:{(seg.timeStart % 60).toString().padStart(2, '0')} - {Math.floor(seg.timeEnd / 60)}:{(seg.timeEnd % 60).toString().padStart(2, '0')}
                          </span>
                          {isCurrentlyPlaying && (
                            <span className="text-[8px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                              Active Track
                            </span>
                          )}
                        </div>

                        <p className={`text-xs font-medium leading-relaxed ${isCurrentlyPlaying ? 'text-emerald-500 font-extrabold' : ''}`}>
                          {seg.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* T3: FORUM FOR COMMENTS */}
            {activeSideTab === 'comments' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Comments Submission form */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={`Post a strategic feedback inquiry on ${currentVideo.sku || 'this insight'}...`}
                    className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black px-4.5 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* List of comments */}
                <div className="space-y-3 mt-4">
                  {currentVideo.commentsList.map((comm) => (
                    <div 
                      key={comm.id} 
                      className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg shrink-0">
                        {comm.avatar}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-black text-[11px]">@{comm.user}</span>
                          <span className="text-slate-500 text-[10px] font-semibold">{comm.time}</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                          {comm.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* T4: CONFIGURATION & QUALITY CONTROLS */}
            {activeSideTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                    Adaptive Video Bitrate Options
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                    Modify streaming profile presets. Selecting 'Auto' will dynamically match virtual downstream network signals to guarantee low packet buffer rates.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {(['Auto', '1080p', '720p', '480p'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setQualityMode(mode);
                          triggerToast(`📡 Quality set to ${mode}`);
                        }}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          qualityMode === mode
                            ? 'bg-emerald-950/40 border-emerald-500/80 text-white'
                            : 'bg-slate-900/50 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-white font-extrabold text-sm font-mono">{mode}</span>
                        <span className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-wider">
                          {mode === 'Auto' ? 'Dynamic Stream' : `${mode} Fixed`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/40 p-4.5 rounded-xl border border-slate-850 space-y-2">
                  <h5 className="text-slate-300 font-bold text-xs">Diagnostic Telemetry</h5>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono mt-2 text-slate-400">
                    <div>Simulated Rate: <span className="text-white font-bold">{simulatedBandwidth}</span></div>
                    <div>Quality Decoded: <span className="text-white font-bold">{simulatedNetworkQuality}</span></div>
                    <div>Codec Stream: <span className="text-white font-bold">H.265 / HEVC</span></div>
                    <div>Max Buffer Rule: <span className="text-white font-bold">8m 30s Cap</span></div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* EXECUTABLE RECOMMENDATION FOOTER ON SIDE PANEL */}
          <div className="bg-slate-900/40 border-t border-slate-850/80 pt-4 shrink-0 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">
                  ADVISED DIRECT ACTION
                </span>
                <span className="text-white font-black text-xs">
                  Review & Action Elena's inventory briefs
                </span>
              </div>

              <button
                onClick={() => {
                  alert("To implement the advice from the AI CFO, simply click on the 'Inventory Suite' or 'Box Technologies (Business)' tab on the left margin!");
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Navigate Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* --- SOCIAL SHARE SHEET OVERLAY --- */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShareModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-1">
                Share CFO Insight brief
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                Circulate this SEC-compliant tactical update across your operations channels.
              </p>

              <div className="flex gap-2.5 mb-5 bg-slate-950 p-2 rounded-xl border border-slate-850">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://boxtech.enterprise/insights/shorts?id=${currentVideo.id}`}
                  className="flex-1 bg-transparent text-slate-300 text-xs font-mono select-all outline-hidden pl-1 text-left truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg cursor-pointer"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    alert("Simulated share to Enterprise Slack channel complete!");
                    setShareModalOpen(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Slack Channel
                </button>
                <button
                  onClick={() => {
                    alert("Simulated share to Corporate Email team complete!");
                    setShareModalOpen(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Internal Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REASON DIALOG COMPLIANCE FLAGメニュー --- */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full relative text-left"
            >
              <button 
                onClick={() => setReportModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Submit Compliance Flag</span>
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                Flag this video for compliance verification or AI hallucination audit.
              </p>

              {reportSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <p className="text-emerald-400 font-extrabold text-xs">Flag Logged in compliance server.</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    {[
                      "Outdated market metrics",
                      "Potential AI advisor hallucination",
                      "Incorrect section tax guidelines",
                      "Duplicate/Spam asset SKU advice"
                    ].map((reason) => (
                      <label 
                        key={reason}
                        className="flex items-center gap-2.5 p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-xl cursor-pointer transition-all text-xs text-slate-300"
                      >
                        <input
                          type="radio"
                          name="report-reason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={() => setReportReason(reason)}
                          className="text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-black py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Submit Audit Request
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
