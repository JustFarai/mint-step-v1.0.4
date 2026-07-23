import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, ArrowUp, ArrowDown, Share2, Search, PlusCircle, 
  Trash2, Pin, Shield, Eye, EyeOff, Image, FileText, Video, CheckCircle2, 
  Bookmark, TrendingUp, Sparkles, Filter, ChevronRight, Check, X, AlertTriangle, 
  CornerDownRight, Upload, MoreHorizontal, User, Lock, Unlock, Compass, ExternalLink,
  ChevronDown, HelpCircle, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  isJoined: boolean;
  category: string;
  moderators: string[]; // usernames
  rules: string[];
  trendingScore: number; // monthly growth %
  activeToday: number;
}

export interface SharedFile {
  name: string;
  size: string;
  type: 'image' | 'document' | 'video';
  url: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null; // for nested replies
  content: string;
  author: string;
  authorRole: 'member' | 'moderator' | 'expert';
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  createdAt: string;
  isAcceptedAnswer?: boolean; // Quora style
}

export interface Post {
  id: string;
  communityId: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'member' | 'moderator' | 'expert';
  type: 'post' | 'question';
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  createdAt: string;
  isPinned: boolean;
  isFlagged: boolean;
  isApproved: boolean;
  isLocked: boolean;
  commentsCount: number;
  image?: string;
  document?: SharedFile;
  video?: string;
  duplicateOf?: string;
}

// --- Initial Mock Data representing highly specialized domains ---
const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'sovereign-hardware',
    name: 'SovereignHardware',
    description: 'Sovereign local staking server node setups, custom silicon cabinets, and specialized cooling manifolds.',
    icon: '⚡',
    memberCount: 1420,
    isJoined: true,
    category: 'Hardware',
    moderators: ['Felix Zinyenge', 'HardwareGuru'],
    rules: ['Only self-hosted setups allowed', 'No advertising public cloud servers', 'Keep schematics accurate'],
    trendingScore: 42,
    activeToday: 184
  },
  {
    id: 'b2b-sales-hacks',
    name: 'B2BSalesHacks',
    description: 'Enterprise pipeline engineering and structuring eight-figure hardware/software delivery contracts.',
    icon: '💼',
    memberCount: 890,
    isJoined: false,
    category: 'Enterprise',
    moderators: ['SalesExec', 'Felix Zinyenge'],
    rules: ['Redact specific company secrets', 'Focus on contract structure over sales pitch', 'Share real templates'],
    trendingScore: 18,
    activeToday: 67
  },
  {
    id: 'tax-optimization',
    name: 'TaxOptimization',
    description: 'Advanced corporate write-offs, Section 179 hardware depreciations, R&D credits, and treasury sweeps.',
    icon: '📊',
    memberCount: 2150,
    isJoined: true,
    category: 'Finance',
    moderators: ['TaxCPA', 'SovereignAccountant'],
    rules: ['No illegal tax evasion tactics', 'Always quote tax section IDs', 'Provide general education, not legal advice'],
    trendingScore: 35,
    activeToday: 295
  },
  {
    id: 'staking-treasuries',
    name: 'StakingTreasuries',
    description: 'Corporate treasury allocation inside Ethereum validation pools, liquid restaking protocols, and yields.',
    icon: '🪙',
    memberCount: 1680,
    isJoined: false,
    category: 'Crypto',
    moderators: ['EthStaker', 'Felix Zinyenge'],
    rules: ['Highlight gas optimization', 'Evaluate smart contract risks transparently', 'Only proof-of-stake topics'],
    trendingScore: 28,
    activeToday: 112
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    communityId: 'sovereign-hardware',
    title: 'How can I configure Liquid Helium loop manifolds to cool local 48U node racks efficiently?',
    content: 'We are setting up customized liquid-chilled server racks for high-throughput crypto validations. Current coolant flow rate is 15 L/min but temperature spikes to 64°C during peak block validation periods. Any tips on optimizing flow rate or manifold orientation?',
    author: 'SiliconSculptor',
    authorRole: 'member',
    type: 'question',
    upvotes: 24,
    downvotes: 1,
    userVote: 'up',
    createdAt: '2 hours ago',
    isPinned: true,
    isFlagged: false,
    isApproved: true,
    isLocked: false,
    commentsCount: 3,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 'post-dup-1',
    communityId: 'sovereign-hardware',
    title: 'What is the recommended liquid coolant flow rate and setup for validation rigs?',
    content: 'Our high-performance validation nodes are overheating. We are using standard coolant loops but looking for advice on optimal flow velocity and manifold setups to stay under 65°C.',
    author: 'HardwareNewbie',
    authorRole: 'member',
    type: 'question',
    upvotes: 4,
    downvotes: 0,
    userVote: null,
    createdAt: '1 hour ago',
    isPinned: false,
    isFlagged: false,
    isApproved: true,
    isLocked: false,
    commentsCount: 0,
    duplicateOf: 'post-1'
  },
  {
    id: 'post-2',
    communityId: 'tax-optimization',
    title: 'Guide: Utilizing Section 179 for immediate hardware cabinet depreciation',
    content: 'For any sovereign hardware builders out there, did you know that Section 179 allows you to deduct 100% of the cost of server server nodes, silicon processors, and testing benches in the year of acquisition? Here is our drafted internal operating template detailing how we saved $48,000 in immediate tax provision liabilities this quarter.',
    author: 'Felix Zinyenge',
    authorRole: 'moderator',
    type: 'post',
    upvotes: 48,
    downvotes: 0,
    userVote: null,
    createdAt: '4 hours ago',
    isPinned: false,
    isFlagged: false,
    isApproved: true,
    isLocked: false,
    commentsCount: 2,
    document: {
      name: 'Section_179_Hardware_Depreciation_Matrix.pdf',
      size: '2.4 MB',
      type: 'document',
      url: '#'
    }
  },
  {
    id: 'post-3',
    communityId: 'b2b-sales-hacks',
    title: 'Structuring a $5.4M SpaceX delivery hardware chassis contract',
    content: 'We recently navigated a complex delivery terms negotiation with SpaceX aerospace procurement teams. The key to closing the deal was bundling the initial custom silicon wafer packaging into an operating lease structure with a 21% discount, matching their fiscal quarters. Here is a review of how we structured the milestone approvals.',
    author: 'Felix Zinyenge',
    authorRole: 'moderator',
    type: 'post',
    upvotes: 31,
    downvotes: 2,
    userVote: 'up',
    createdAt: '1 day ago',
    isPinned: true,
    isFlagged: false,
    isApproved: true,
    isLocked: false,
    commentsCount: 1
  },
  {
    id: 'post-4',
    communityId: 'staking-treasuries',
    title: 'Is SSV Network better than traditional DVT for corporate validator pools?',
    content: 'We are restructuring our corporate Ethereum validation pools. Distributed Validator Technology (DVT) is crucial to avoid hardware single-points-of-failure. Has anyone benchmarked SSV Networks performance vs Obol under active heavy validator loads?',
    author: 'EthStaker',
    authorRole: 'moderator',
    type: 'question',
    upvotes: 15,
    downvotes: 0,
    userVote: null,
    createdAt: '2 days ago',
    isPinned: false,
    isFlagged: false,
    isApproved: true,
    isLocked: false,
    commentsCount: 0
  },
  {
    id: 'post-dup-4',
    communityId: 'staking-treasuries',
    title: 'How does SSV Network compare to Obol for corporate DVT validation?',
    content: 'We want to avoid hardware single-points-of-failure by implementing Distributed Validator Technology. Which performs better between SSV Network and Obol under real enterprise loads?',
    author: 'SovereignStaker',
    authorRole: 'member',
    type: 'question',
    upvotes: 3,
    downvotes: 0,
    userVote: null,
    createdAt: '1 day ago',
    isPinned: false,
    isFlagged: false,
    isApproved: true,
    isLocked: false,
    commentsCount: 0,
    duplicateOf: 'post-4'
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    postId: 'post-1',
    parentId: null,
    content: 'I highly suggest increasing your fluid pressure to achieve at least 22 L/min flow velocity. Also, ensure the manifolds are oriented vertically; any trapped gas pockets in horizontal manifolds will severely degrade thermal transfer coefficients on the node heat spreaders.',
    author: 'HardwareGuru',
    authorRole: 'moderator',
    upvotes: 8,
    downvotes: 0,
    userVote: 'up',
    createdAt: '1 hour ago',
    isAcceptedAnswer: true
  },
  {
    id: 'c-2',
    postId: 'post-1',
    parentId: 'c-1',
    content: 'This vertical orientation suggestion makes perfect thermodynamic sense. I will modify our rack framing configurations to implement this next Monday. Thank you!',
    author: 'SiliconSculptor',
    authorRole: 'member',
    upvotes: 3,
    downvotes: 0,
    userVote: null,
    createdAt: '45 mins ago'
  },
  {
    id: 'c-3',
    postId: 'post-1',
    parentId: null,
    content: 'Make sure your dielectric coolant choice is highly compatible with polyurethane gaskets, or you will experience micro-leaks within 90 days.',
    author: 'EthStaker',
    authorRole: 'expert',
    upvotes: 5,
    downvotes: 0,
    userVote: null,
    createdAt: '30 mins ago'
  },
  {
    id: 'c-4',
    postId: 'post-2',
    parentId: null,
    content: 'Outstanding write-up! This R&D and hardware write-off matrix is extremely valuable for corporate financial budgeting. Does this apply to foreign assembled nodes?',
    author: 'TaxCPA',
    authorRole: 'moderator',
    upvotes: 11,
    downvotes: 0,
    userVote: null,
    createdAt: '3 hours ago'
  },
  {
    id: 'c-5',
    postId: 'post-2',
    parentId: 'c-4',
    content: 'Yes! As long as the assets are physically deployed and operating within US territorial validation datacenters, the source of assembly does not affect immediate depreciation qualifications.',
    author: 'Felix Zinyenge',
    authorRole: 'moderator',
    upvotes: 7,
    downvotes: 0,
    userVote: 'up',
    createdAt: '2 hours ago'
  },
  {
    id: 'c-6',
    postId: 'post-3',
    parentId: null,
    content: 'Fascinating contract lease approach. Bundling aerospace hardware logistics into corporate operational leases keeps their CAPEX looking incredibly lean.',
    author: 'SalesExec',
    authorRole: 'member',
    upvotes: 4,
    downvotes: 0,
    userVote: null,
    createdAt: '18 hours ago'
  }
];

export default function WealthCommunities() {
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  
  // --- Navigation & Filter States ---
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'posts' | 'questions' | 'pinned'>('all');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // --- AI Intelligence Suite States ---
  const [isAIGroupDuplicatesEnabled, setIsAIGroupDuplicatesEnabled] = useState(true);
  const [isAIGroupAnswersEnabled, setIsAIGroupAnswersEnabled] = useState(true);
  const [expandedDuplicatePostIds, setExpandedDuplicatePostIds] = useState<Record<string, boolean>>({});
  const [threadSummaries, setThreadSummaries] = useState<Record<string, { summary: string; isGenerating: boolean }>>({});
  const [invitedExperts, setInvitedExperts] = useState<Record<string, string[]>>({});
  const [expandedVerificationIds, setExpandedVerificationIds] = useState<Record<string, boolean>>({});

  // --- Creator & Interaction Form States ---
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'post' | 'question'>('post');
  const [newPostCommunityId, setNewPostCommunityId] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostVideo, setNewPostVideo] = useState('');
  
  // Simulated file upload states
  const [attachedFile, setAttachedFile] = useState<SharedFile | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // --- Comments & Replies States ---
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [newReplyText, setNewReplyText] = useState('');

  // --- Custom Communities Creator ---
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommIcon, setNewCommIcon] = useState('🔥');
  const [newCommRules, setNewCommRules] = useState('');

  // --- Moderation Panel & Queue state ---
  const [modModeActive, setModModeActive] = useState(false);
  const [viewFlaggedQueue, setViewFlaggedQueue] = useState(false);

  // Toast notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Ensure posting form has default community if one is active
  useEffect(() => {
    if (selectedCommunityId !== 'all') {
      setNewPostCommunityId(selectedCommunityId);
    } else {
      setNewPostCommunityId(communities[0]?.id || '');
    }
  }, [selectedCommunityId, communities]);

  // Current user representation
  const currentUser = {
    username: 'Felix Zinyenge',
    role: 'moderator' as const
  };

  // Join/Leave Community
  const toggleJoinCommunity = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCommunities(prev => prev.map(comm => {
      if (comm.id === id) {
        const nextState = !comm.isJoined;
        triggerToast(nextState ? `Joined c/${comm.name} community!` : `Left c/${comm.name}.`);
        return {
          ...comm,
          isJoined: nextState,
          memberCount: comm.memberCount + (nextState ? 1 : -1)
        };
      }
      return comm;
    }));
  };

  // Upvote/Downvote logic for posts
  const handlePostVote = (id: string, vote: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        let uChg = 0;
        let dChg = 0;
        let nextVote: 'up' | 'down' | null = vote;

        if (post.userVote === vote) {
          // undo vote
          nextVote = null;
          if (vote === 'up') uChg = -1;
          else dChg = -1;
        } else {
          // undo other vote if present, apply new
          if (post.userVote === 'up') uChg = -1;
          if (post.userVote === 'down') dChg = -1;

          if (vote === 'up') uChg += 1;
          else dChg += 1;
        }

        return {
          ...post,
          upvotes: Math.max(0, post.upvotes + uChg),
          downvotes: Math.max(0, post.downvotes + dChg),
          userVote: nextVote
        };
      }
      return post;
    }));
  };

  // Upvote/Downvote logic for comments
  const handleCommentVote = (commentId: string, vote: 'up' | 'down') => {
    setComments(prev => prev.map(com => {
      if (com.id === commentId) {
        let uChg = 0;
        let dChg = 0;
        let nextVote: 'up' | 'down' | null = vote;

        if (com.userVote === vote) {
          nextVote = null;
          if (vote === 'up') uChg = -1;
          else dChg = -1;
        } else {
          if (com.userVote === 'up') uChg = -1;
          if (com.userVote === 'down') dChg = -1;

          if (vote === 'up') uChg += 1;
          else dChg += 1;
        }

        return {
          ...com,
          upvotes: Math.max(0, com.upvotes + uChg),
          downvotes: Math.max(0, com.downvotes + dChg),
          userVote: nextVote
        };
      }
      return com;
    }));
  };

  // Flag post
  const flagPost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        triggerToast("Post flagged for moderation review.");
        return { ...p, isFlagged: true };
      }
      return p;
    }));
  };

  // Pin/Unpin post (Moderators only)
  const togglePinPost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextState = !p.isPinned;
        triggerToast(nextState ? "Post pinned to top of community!" : "Post unpinned.");
        return { ...p, isPinned: nextState };
      }
      return p;
    }));
  };

  // Lock/Unlock comments (Moderators only)
  const toggleLockPost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextState = !p.isLocked;
        triggerToast(nextState ? "Discussion thread locked." : "Discussion thread unlocked.");
        return { ...p, isLocked: nextState };
      }
      return p;
    }));
  };

  // Delete post (Moderators or Author only)
  const deletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.filter(p => p.id !== postId));
    setComments(prev => prev.filter(c => c.postId !== postId));
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
    triggerToast("Post successfully removed from ledger.");
  };

  // Approve post in mod queue
  const approvePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        triggerToast("Post approved and cleared from queue.");
        return { ...p, isFlagged: false, isApproved: true };
      }
      return p;
    }));
  };

  // AI Multistage Thread Summary Generator
  const handleGenerateSummary = (postId: string) => {
    setThreadSummaries(prev => ({
      ...prev,
      [postId]: { summary: 'Initializing AI model parameters...', isGenerating: true }
    }));

    let stage = 0;
    const stages = [
      "Extracting key sentences and structural metadata...",
      "Consolidating certified expert answers...",
      "Formulating actionable resolution summary..."
    ];

    const interval = setInterval(() => {
      if (stage < stages.length) {
        setThreadSummaries(prev => ({
          ...prev,
          [postId]: { summary: stages[stage], isGenerating: true }
        }));
        stage++;
      } else {
        clearInterval(interval);
        
        // Generate tailored summary content
        const postObj = posts.find(p => p.id === postId);
        const postComments = comments.filter(c => c.postId === postId);
        const acceptedCom = postComments.find(c => c.isAcceptedAnswer) || [...postComments].sort((a,b) => (b.upvotes-b.downvotes)-(a.upvotes-a.downvotes))[0];
        
        let summaryText = "";
        if (postId === 'post-1' || postObj?.title.toLowerCase().includes('liquid') || postObj?.title.toLowerCase().includes('helium')) {
          summaryText = `### 📋 EXECUTIVE DISPATCH
**Core Issue:** Troubleshooting fluid velocity and insufficient liquid pressure in the primary manifold of a liquid helium loop, leading to temperature spikes during high validation operations.

**Verified Solution:** HardwareGuru recommends standardizing pressure velocity to 22 L/min and orienting the manifold vertically to purge internal air gas pockets.

**Consensus Risk:** EthStaker flags high erosion risk of polyurethane gaskets in contact with dielectric coolants; transitioning to synthetic fluoropolymer compounds is highly advised.`;
        } else if (postId === 'post-2' || postObj?.title.toLowerCase().includes('179') || postObj?.title.toLowerCase().includes('depreciation')) {
          summaryText = `### 📋 EXECUTIVE DISPATCH
**Core Issue:** Interpreting eligibility criteria for Section 179 immediate capital depreciation on physical server rack deployments.

**Verified Solution:** TaxCPA notes that servers must operate within officially validated enterprise zones and remain in service over 50% of the taxable year.

**Consensus Risk:** SovereignAccountant warns that shifting active validator node workloads out-of-jurisdiction mid-year triggers retroactive audit penalties.`;
        } else {
          // Dynamic fallback based on the actual post data
          const coreText = postObj ? postObj.content.slice(0, 120) + "..." : "Analyzing post content...";
          const solText = acceptedCom ? acceptedCom.content : "No consensus answers analyzed yet.";
          summaryText = `### 📋 EXECUTIVE DISPATCH
**Core Issue:** ${postObj?.title} - ${coreText}

**Consensus Solution:** ${solText}

**Safety Warning:** Review all local staking jurisdictional laws and operational redundancy limits prior to capital commitment.`;
        }

        setThreadSummaries(prev => ({
          ...prev,
          [postId]: { summary: summaryText, isGenerating: false }
        }));
        triggerToast("AI Thread Summary generated successfully.");
      }
    }, 600);
  };

  // AI Expert routing selections
  const getRecommendedExperts = (postId: string | null, communityId: string | null) => {
    let domain = 'general';
    const postObj = posts.find(p => p.id === postId);
    const activeComm = communities.find(c => c.id === (communityId || postObj?.communityId));
    
    const commName = activeComm?.name?.toLowerCase() || '';
    const postTitle = postObj?.title?.toLowerCase() || '';

    if (commName.includes('hardware') || postTitle.includes('liquid') || postTitle.includes('helium')) {
      domain = 'hardware';
    } else if (commName.includes('tax') || postTitle.includes('179') || postTitle.includes('depreciation') || commName.includes('optimization')) {
      domain = 'finance';
    } else if (commName.includes('sales') || postTitle.includes('sales') || postTitle.includes('b2b')) {
      domain = 'sales';
    }

    const experts = {
      hardware: [
        { name: "HardwareGuru", spec: "Staking Nodes & Loop Hydraulics", match: 98, text: "Specializes in chilled-water setups and liquid helium loop pressure optimization." },
        { name: "SiliconSculptor", spec: "Thermal Dispersal Engineer", match: 91, text: "Veteran developer of redundant enterprise staking rack frameworks." }
      ],
      finance: [
        { name: "TaxCPA", spec: "Capital Depreciation Codes", match: 100, text: "CPA with 15 years experience in Section 179 immediate write-off validations." },
        { name: "SovereignAccountant", spec: "International Treasury", match: 94, text: "Strategic advisor on decentralized enterprise jurisdictions and compliance." }
      ],
      sales: [
        { name: "SalesExec", spec: "High-Ticket Contract Architecture", match: 96, text: "Negotiated over $150M in enterprise validator leases and corporate SLAs." }
      ],
      general: [
        { name: "ConsensusValidator", spec: "Protocol Operations Expert", match: 95, text: "Specialist in SSV multi-signature key splits and secure backup structures." }
      ]
    };

    return experts[domain as keyof typeof experts] || experts.general;
  };

  // AI Expert paging handler
  const handleInviteExpertAnswer = (postId: string, expertName: string) => {
    setInvitedExperts(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), expertName]
    }));

    triggerToast(`Paging ${expertName} to evaluate thread...`);

    setTimeout(() => {
      let content = "";
      if (expertName === "HardwareGuru") {
        content = "Liquid helium systems require active flow velocities to remain above 22 L/min during Peak validation epochs. Make sure the manifold orientation is mounted strictly vertically — this lets gas bubbles purge through secondary venting channels instantly.";
      } else if (expertName === "SiliconSculptor") {
        content = "Agreeing with the layout suggestion: run dual-channel redundancy checks. Make sure the gaskets are synthetic fluoropolymer — polyurethane is high risk under dielectric chemical contact.";
      } else if (expertName === "TaxCPA") {
        content = "To qualify for the immediate Section 179 depreciation, the server hardware must reside in a validated enterprise zone and be operational for more than 50% of the tax year. Workloads cannot be routed out of country mid-year without clawback audits.";
      } else if (expertName === "SovereignAccountant") {
        content = "If leasing, look into operating lease classifications under ASC 842. This keeps the asset off your balance sheet while preserving local deduction credits.";
      } else if (expertName === "SalesExec") {
        content = "Tether contract milestones to monthly active validator volumes, not calendar dates. This aligns development incentives and provides natural downside protection for client capital.";
      } else {
        content = "Evaluating this topic: Prioritize secure SSV thresholds. Running a single local node is high risk; split the private validator key slices across at least 4 distributed node operator systems.";
      }

      const newAnswer: Comment = {
        id: `com-expert-${Date.now()}`,
        postId: postId,
        parentId: null,
        author: expertName,
        authorRole: 'expert',
        content: content,
        upvotes: 6,
        downvotes: 0,
        createdAt: "Just now • AI Dispatched",
        userVote: null,
        isAcceptedAnswer: false
      };

      setComments(prev => [...prev, newAnswer]);
      triggerToast(`${expertName} has dispatched a verified response.`);
    }, 1500);
  };

  // AI Recommended Communities selection
  const getRecommendedCommunities = () => {
    return communities.filter(c => !c.isJoined).slice(0, 3);
  };

  // Create new community
  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommDesc.trim()) return;

    const formattedName = newCommName.trim().replace(/\s+/g, '');
    const newId = formattedName.toLowerCase();

    if (communities.some(c => c.id === newId)) {
      triggerToast("A community with that name already exists!");
      return;
    }

    const newComm: Community = {
      id: newId,
      name: formattedName,
      description: newCommDesc.trim(),
      icon: newCommIcon,
      memberCount: 1,
      isJoined: true,
      category: 'General',
      moderators: [currentUser.username],
      rules: newCommRules ? newCommRules.split('\n').filter(r => r.trim() !== '') : ['Be respectful'],
      trendingScore: 10,
      activeToday: 1
    };

    setCommunities(prev => [...prev, newComm]);
    setSelectedCommunityId(newId);
    setIsCreatingCommunity(false);
    setNewCommName('');
    setNewCommDesc('');
    setNewCommRules('');
    triggerToast(`Created and joined c/${formattedName}!`);
  };

  // Simulate sharing documents / file upload
  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    triggerToast(`Scanning and validating ${file.name} for safe publication...`);

    setTimeout(() => {
      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');
      const fileType = isImg ? 'image' : isVid ? 'video' : 'document';
      
      const fileObj: SharedFile = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: fileType as any,
        url: isImg ? URL.createObjectURL(file) : '#'
      };

      setAttachedFile(fileObj);
      if (isImg) {
        setNewPostImage(URL.createObjectURL(file));
      }
      setIsUploadingFile(false);
      triggerToast(`Validated and attached ${file.name}.`);
    }, 1500);
  };

  // Submit new post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCommunityId) return;

    const commObj = communities.find(c => c.id === newPostCommunityId);
    if (!commObj) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      communityId: newPostCommunityId,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      author: currentUser.username,
      authorRole: 'moderator',
      type: newPostType,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      createdAt: 'Just now',
      isPinned: false,
      isFlagged: false,
      isApproved: true,
      isLocked: false,
      commentsCount: 0,
      image: newPostImage || undefined,
      video: newPostVideo || undefined,
      document: attachedFile || undefined
    };

    setPosts(prev => [newPost, ...prev]);
    setIsCreatingPost(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
    setNewPostVideo('');
    setAttachedFile(null);
    triggerToast(`Published successfully to c/${commObj.name}!`);
  };

  // Submit comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPostId) return;

    const postObj = posts.find(p => p.id === selectedPostId);
    if (postObj?.isLocked) {
      triggerToast("This thread has been locked by a moderator.");
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: selectedPostId,
      parentId: null,
      content: newCommentText.trim(),
      author: currentUser.username,
      authorRole: 'moderator',
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      createdAt: 'Just now'
    };

    setComments(prev => [...prev, newComment]);
    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return { ...p, commentsCount: p.commentsCount + 1 };
      }
      return p;
    }));
    setNewCommentText('');
    triggerToast("Comment added!");
  };

  // Submit nested reply
  const handleAddReply = (commentId: string) => {
    if (!newReplyText.trim() || !selectedPostId) return;

    const postObj = posts.find(p => p.id === selectedPostId);
    if (postObj?.isLocked) {
      triggerToast("This thread has been locked by a moderator.");
      return;
    }

    const newReply: Comment = {
      id: `comment-${Date.now()}`,
      postId: selectedPostId,
      parentId: commentId,
      content: newReplyText.trim(),
      author: currentUser.username,
      authorRole: 'moderator',
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      createdAt: 'Just now'
    };

    setComments(prev => [...prev, newReply]);
    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return { ...p, commentsCount: p.commentsCount + 1 };
      }
      return p;
    }));
    setNewReplyText('');
    setReplyingCommentId(null);
    triggerToast("Reply posted!");
  };

  // Accept Answer (Quora Q&A specific)
  const toggleAcceptAnswer = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.postId === selectedPostId) {
        // Toggle the target, reset others for this post
        if (c.id === commentId) {
          const nextState = !c.isAcceptedAnswer;
          triggerToast(nextState ? "Answer highlighted as Verified Solution!" : "Answer un-accepted.");
          return { ...c, isAcceptedAnswer: nextState };
        } else {
          return { ...c, isAcceptedAnswer: false };
        }
      }
      return c;
    }));
  };

  // --- Filter and Search computations ---
  const activeCommunity = communities.find(c => c.id === selectedCommunityId);

  const filteredPosts = posts.filter(post => {
    // Community filter
    if (selectedCommunityId !== 'all' && post.communityId !== selectedCommunityId) return false;
    
    // Flagged queue filter
    if (viewFlaggedQueue) {
      return post.isFlagged;
    }

    // AI Duplicates grouping filter - nested children hidden from top stream
    if (isAIGroupDuplicatesEnabled && post.duplicateOf && !searchQuery.trim()) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      const comm = communities.find(c => c.id === post.communityId);
      const matchComm = comm ? comm.name.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchContent && !matchAuthor && !matchComm) return false;
    }

    // Tab Type Filter
    if (activeFilter === 'questions' && post.type !== 'question') return false;
    if (activeFilter === 'posts' && post.type !== 'post') return false;
    if (activeFilter === 'pinned' && !post.isPinned) return false;

    return true;
  });

  // Render hierarchical comment tree with optional AI Semantic Clustering and Answer Verification Highlights
  const renderCommentsList = (postId: string) => {
    const postComments = comments.filter(c => c.postId === postId && c.parentId === null);
    const postObj = posts.find(p => p.id === postId);

    if (postComments.length === 0) {
      return (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl">
          <MessageSquare className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-semibold">No comments or answers posted yet.</p>
        </div>
      );
    }

    // AI Confidence Verification calculations
    const getAnswerVerificationStats = (com: Comment, post: Post) => {
      const totalVotes = com.upvotes - com.downvotes;
      const isExpert = com.authorRole === 'expert';
      const isMod = com.authorRole === 'moderator';
      
      let confidence = 75;
      const reasons: string[] = [];

      if (com.isAcceptedAnswer) {
        confidence += 20;
        reasons.push("Officially selected as Verified Solution by thread creator / moderator");
      }
      if (isExpert) {
        confidence += 12;
        reasons.push("Author holds authenticated community Expert credentials in this subject");
      } else if (isMod) {
        confidence += 8;
        reasons.push("Author is an official Moderator of the local community");
      }

      if (totalVotes > 5) {
        confidence += 4;
        reasons.push(`Strong community consensus with substantial positive upvotes (${totalVotes})`);
      } else if (totalVotes > 0) {
        confidence += 2;
        reasons.push(`Moderate positive community feedback (${totalVotes} net upvotes)`);
      }

      confidence = Math.min(99, confidence);

      return {
        confidence,
        reasons
      };
    };

    // AI Semantic Clustering of answers
    const getCommentsInClusters = (coms: Comment[]) => {
      const clusters: Record<string, { title: string; desc: string; icon: string; comments: Comment[] }> = {
        cooling: {
          title: "Thermal & Fluid Dynamics Setup",
          desc: "Covers manifold orientation, pressure, flow rate velocity configurations.",
          icon: "⚡",
          comments: []
        },
        materials: {
          title: "Materials Integrity & Chemical Safety",
          desc: "Covers gaskets compatibility, micro-leaks, and dielectric coolants.",
          icon: "🧪",
          comments: []
        },
        taxes: {
          title: "Regulatory Compliance & Tax Jurisdictions",
          desc: "Covers immediate write-off depreciation criteria, Section 179/41 credit codes.",
          icon: "📊",
          comments: []
        },
        strategy: {
          title: "Strategic Financial & Business Impact",
          desc: "Covers enterprise budgets, operating leases, and procurement agreements.",
          icon: "💼",
          comments: []
        },
        dvt: {
          title: "DVT Consensus Architecture",
          desc: "Covers hardware single-points-of-failure, SSV performance, and Obol.",
          icon: "🪙",
          comments: []
        },
        general: {
          title: "General Consensus & Peer Feedback",
          desc: "Covers supportive remarks, consensus reviews, and high-level discussion.",
          icon: "💬",
          comments: []
        }
      };

      coms.forEach(com => {
        const text = com.content.toLowerCase();
        if (text.includes("manifold") || text.includes("pressure") || text.includes("flow") || text.includes("velocity") || text.includes("chilled") || text.includes("helium") || text.includes("cooling")) {
          clusters.cooling.comments.push(com);
        } else if (text.includes("gasket") || text.includes("polyurethane") || text.includes("leak") || text.includes("coolant") || text.includes("chemical") || text.includes("dielectric")) {
          clusters.materials.comments.push(com);
        } else if (text.includes("tax") || text.includes("depreciation") || text.includes("liability") || text.includes("credit") || text.includes("section") || text.includes("cpa")) {
          clusters.taxes.comments.push(com);
        } else if (text.includes("contract") || text.includes("lease") || text.includes("budget") || text.includes("procurement") || text.includes("operating")) {
          clusters.strategy.comments.push(com);
        } else if (text.includes("dvt") || text.includes("obol") || text.includes("ssv") || text.includes("validator") || text.includes("node") || text.includes("hardware")) {
          clusters.dvt.comments.push(com);
        } else {
          clusters.general.comments.push(com);
        }
      });

      // Filter out clusters with no comments
      return Object.values(clusters).filter(c => c.comments.length > 0);
    };

    // Render accepted answers at top of Q&A Questions
    const sortedComments = [...postComments].sort((a, b) => {
      if (a.isAcceptedAnswer) return -1;
      if (b.isAcceptedAnswer) return 1;
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    });

    const renderSingleComment = (com: Comment) => {
      const commentReplies = comments.filter(r => r.parentId === com.id);
      const totalVotes = com.upvotes - com.downvotes;
      
      const verification = postObj ? getAnswerVerificationStats(com, postObj) : { confidence: 75, reasons: [] };
      const isVerified = com.isAcceptedAnswer || verification.confidence >= 85;
      const showVerificationAudit = !!expandedVerificationIds[com.id];

      return (
        <div key={com.id} className={`p-4 rounded-2xl border transition-all ${
          com.isAcceptedAnswer 
            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-950/10 shadow-md' 
            : isVerified && postObj?.type === 'question'
              ? 'bg-slate-900/40 border-emerald-500/20 shadow-sm'
              : 'bg-slate-900/30 border-slate-850'
        }`}>
          {/* Comment Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                {com.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-200">{com.author}</span>
                  {com.authorRole === 'moderator' && (
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black uppercase flex items-center gap-0.5">
                      <Shield className="w-2 h-2" /> MOD
                    </span>
                  )}
                  {com.authorRole === 'expert' && (
                    <span className="text-[8px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-black uppercase">
                      EXPERT
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 font-semibold">{com.createdAt}</span>
              </div>
            </div>

            {/* AI verification score and accept toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              {postObj?.type === 'question' && isVerified && (
                <button
                  onClick={() => setExpandedVerificationIds(prev => ({ ...prev, [com.id]: !prev[com.id] }))}
                  className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  title="Click to view AI verification audit"
                >
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span>AI Match Score: {verification.confidence}%</span>
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showVerificationAudit ? 'rotate-180' : ''}`} />
                </button>
              )}

              {com.isAcceptedAnswer && (
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified Solution
                </span>
              )}
            </div>
          </div>

          {/* AI Verification Breakdown Accordion */}
          {showVerificationAudit && postObj?.type === 'question' && (
            <div className="mb-3 p-3 bg-slate-950 border border-emerald-500/20 rounded-xl space-y-2 text-left">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <span>AI Validation Audit</span>
                <span className="text-emerald-500">Confidence Match: {verification.confidence}%</span>
              </div>
              <ul className="space-y-1">
                {verification.reasons.map((reason, rIdx) => (
                  <li key={rIdx} className="text-[10px] text-slate-400 font-semibold flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comment Content */}
          <p className="text-xs text-slate-300 leading-relaxed font-semibold pl-1">
            {com.content}
          </p>

          {/* Comment Footer & Actions */}
          <div className="flex items-center justify-between gap-4 mt-3 pt-2.5 border-t border-slate-800/40">
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-850">
              <button 
                onClick={() => handleCommentVote(com.id, 'up')}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${com.userVote === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <span className={`text-[11px] font-bold font-mono px-1 min-w-[12px] text-center ${totalVotes > 0 ? 'text-emerald-400' : totalVotes < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {totalVotes}
              </span>
              <button 
                onClick={() => handleCommentVote(com.id, 'down')}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${com.userVote === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Moderator Answer Acceptance Trigger for Questions */}
              {postObj?.type === 'question' && (currentUser.role === 'moderator' || postObj.author === currentUser.username) && (
                <button 
                  onClick={() => toggleAcceptAnswer(com.id)}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    com.isAcceptedAnswer 
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' 
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{com.isAcceptedAnswer ? 'Un-accept Answer' : 'Mark Verified'}</span>
                </button>
              )}

              <button 
                onClick={() => setReplyingCommentId(com.id)}
                className="text-[10px] font-extrabold text-slate-400 hover:text-slate-200 px-2 py-1 hover:bg-slate-800/50 rounded-lg cursor-pointer"
              >
                Reply
              </button>
            </div>
          </div>

          {/* Nested Reply Submission Box */}
          {replyingCommentId === com.id && (
            <div className="mt-3 pl-3 border-l-2 border-slate-800 flex flex-col gap-2">
              <textarea
                rows={2}
                value={newReplyText}
                onChange={(e) => setNewReplyText(e.target.value)}
                placeholder="Compose structured reply..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/40"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setReplyingCommentId(null);
                    setNewReplyText('');
                  }}
                  className="px-2.5 py-1 text-[10px] font-extrabold text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAddReply(com.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black px-3.5 py-1.5 rounded-lg cursor-pointer transition-all"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}

          {/* Recursive replies stream rendering */}
          {commentReplies.length > 0 && (
            <div className="mt-4 pl-4 border-l border-slate-800 space-y-3">
              {commentReplies.map(rep => (
                <div key={rep.id} className="p-3 bg-slate-950/30 rounded-xl border border-slate-900 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-slate-600" />
                    <div className="w-5 h-5 rounded-full bg-slate-850 flex items-center justify-center text-[8px] font-bold text-slate-400">
                      {rep.author.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{rep.author}</span>
                    {rep.authorRole === 'moderator' && (
                      <span className="text-[7px] bg-emerald-500/15 text-emerald-400 px-1 py-0.5 rounded font-bold uppercase">MOD</span>
                    )}
                    <span className="text-[9px] text-slate-500 font-semibold">{rep.createdAt}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 font-medium pl-5 leading-relaxed">{rep.content}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      );
    };

    if (isAIGroupAnswersEnabled && postObj?.type === 'question') {
      const clusters = getCommentsInClusters(sortedComments);
      return (
        <div className="space-y-6">
          <div className="bg-emerald-950/10 border border-emerald-500/10 p-3 rounded-xl flex items-center justify-between text-left">
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>AI successfully clustered {sortedComments.length} answers into {clusters.length} distinct semantic categories.</span>
            </span>
          </div>

          <div className="space-y-6">
            {clusters.map((cluster, cIdx) => (
              <div key={cIdx} className="bg-slate-900/10 border border-slate-850 rounded-2xl p-4.5 space-y-3.5">
                <div className="flex items-start gap-2.5 border-b border-slate-900 pb-3 text-left">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-emerald-400 shadow-inner">
                    {cluster.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-200 tracking-wider flex items-center gap-1.5 uppercase">
                      <span>{cluster.title}</span>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.2 rounded font-black">AI CLUSTER</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">{cluster.desc}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cluster.comments.map(com => renderSingleComment(com))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Chronological / upvote-based single list fallback
    return (
      <div className="space-y-4">
        {sortedComments.map(com => renderSingleComment(com))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-slate-100 min-h-screen">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 bg-emerald-600 border border-emerald-400 px-5 py-3 text-white rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-xs tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR: COMMUNITIES DIRECTORY (3 COLS) */}
      <div className="lg:col-span-3 space-y-5">
        
        {/* Creator Trigger Button */}
        <button
          onClick={() => setIsCreatingCommunity(true)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Community</span>
        </button>

        {/* Global Directory Search */}
        <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl shadow-lg">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or tags..."
              className="w-full bg-slate-900 border border-slate-850 hover:border-slate-800 focus:border-emerald-500/40 focus:outline-hidden pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-slate-100 placeholder:text-slate-600 transition-all"
            />
          </div>
        </div>

        {/* Community List Hub */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-900/60 px-4.5 py-3.5 border-b border-slate-850 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Sovereign Hubs</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-black font-mono">
              {communities.length}
            </span>
          </div>

          <div className="p-2 space-y-1 max-h-[350px] overflow-y-auto">
            {/* "All" Communities hub */}
            <button
              onClick={() => {
                setSelectedCommunityId('all');
                setSelectedPostId(null);
                setViewFlaggedQueue(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                selectedCommunityId === 'all' && !viewFlaggedQueue
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-white' 
                  : 'text-slate-400 hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🌐</span>
                <span className="text-xs font-bold">All Ledger Hubs</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {communities.map(comm => (
              <button
                key={comm.id}
                onClick={() => {
                  setSelectedCommunityId(comm.id);
                  setSelectedPostId(null);
                  setViewFlaggedQueue(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                  selectedCommunityId === comm.id && !viewFlaggedQueue
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-white' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-900/40 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-sm shrink-0">{comm.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-black text-slate-200 truncate">c/{comm.name}</div>
                    <span className="text-[9px] text-slate-500 font-bold font-mono">{comm.memberCount.toLocaleString()} members</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {comm.isJoined ? (
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black uppercase px-1.5 py-0.5 rounded">Joined</span>
                  ) : (
                    <span className="text-[8px] text-slate-600 font-black uppercase px-1.5 py-0.5">Guest</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MODERATOR QUEUE CONTROLS CARD */}
        {currentUser.role === 'moderator' && (
          <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl shadow-lg space-y-3">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Shield className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-wider">CFO Moderator Center</h4>
            </div>
            
            <p className="text-[10.5px] leading-relaxed text-slate-500 font-semibold">
              Authorized admin privileges for Felix Zinyenge are active across all regional communities.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-900">
              <button
                onClick={() => {
                  setViewFlaggedQueue(!viewFlaggedQueue);
                  setSelectedPostId(null);
                }}
                className={`w-full py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${
                  viewFlaggedQueue 
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                    : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged Queue</span>
                </span>
                <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {posts.filter(p => p.isFlagged).length}
                </span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* CENTER STREAM AREA (6 COLS) */}
      <div className="lg:col-span-6 space-y-5">
        
        {/* Active Selected View Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

          {selectedCommunityId === 'all' ? (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">🌐</span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">All Sovereign Communities</h2>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                An active decentralized workspace mirroring Reddit and Quora functionalities. Ask questions, construct technical documentation, and collaborate on hardware or taxation ledgers.
              </p>
            </div>
          ) : (
            activeCommunity && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{activeCommunity.icon}</span>
                    <h2 className="text-sm font-black text-white">c/{activeCommunity.name}</h2>
                    <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-400 px-2 py-0.5 rounded font-semibold">{activeCommunity.category}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
                    {activeCommunity.description}
                  </p>
                </div>

                <button
                  onClick={(e) => toggleJoinCommunity(activeCommunity.id, e)}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all shrink-0 cursor-pointer ${
                    activeCommunity.isJoined
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md'
                  }`}
                >
                  {activeCommunity.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            )
          )}

          {/* STREAM FILTERS SUB-BAR */}
          <div className="flex items-center justify-between border-t border-slate-900 pt-3.5 mt-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setViewFlaggedQueue(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === 'all' && !viewFlaggedQueue ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                All Feed
              </button>
              <button
                onClick={() => {
                  setActiveFilter('questions');
                  setViewFlaggedQueue(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === 'questions' && !viewFlaggedQueue ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Questions Only
              </button>
              <button
                onClick={() => {
                  setActiveFilter('posts');
                  setViewFlaggedQueue(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === 'posts' && !viewFlaggedQueue ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                General Posts
              </button>
              <button
                onClick={() => {
                  setActiveFilter('pinned');
                  setViewFlaggedQueue(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === 'pinned' && !viewFlaggedQueue ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Pinned
              </button>
            </div>

            {/* Quick Post Button */}
            <button
              onClick={() => setIsCreatingPost(true)}
              className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* ==================== SUB-VIEW: EXPANDED POST DETAILS ==================== */}
        {selectedPostId ? (
          (() => {
            const currentPost = posts.find(p => p.id === selectedPostId);
            if (!currentPost) return null;
            const postComm = communities.find(c => c.id === currentPost.communityId);
            const totalPostVotes = currentPost.upvotes - currentPost.downvotes;

            return (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                
                {/* Back to feed anchor */}
                <button
                  onClick={() => setSelectedPostId(null)}
                  className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  ← Return to Hub Stream
                </button>

                {/* Main Post Header */}
                <div className="space-y-4">
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{postComm?.icon}</span>
                      <span className="text-xs font-extrabold text-slate-300">c/{postComm?.name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-slate-400 font-semibold">Posted by {currentPost.author} ({currentPost.createdAt})</span>
                    </div>

                    {currentPost.isPinned && (
                      <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                  </div>

                  {/* Title & Type badge */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {currentPost.type === 'question' ? (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-black uppercase px-2 py-0.5 rounded flex items-center gap-0.5">
                          <HelpCircle className="w-3 h-3" /> Q&A Question
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-800 text-slate-300 font-black uppercase px-2 py-0.5 rounded">
                          General Post
                        </span>
                      )}
                    </div>
                    <h1 className="text-lg font-black text-white leading-tight tracking-tight">
                      {currentPost.title}
                    </h1>
                  </div>

                  {/* Document & Video file attachment renders */}
                  {currentPost.document && (
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-200">{currentPost.document.name}</div>
                          <span className="text-[10px] text-slate-500 font-bold font-mono">{currentPost.document.size}</span>
                        </div>
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); triggerToast(`Downloading ${currentPost.document?.name}...`); }}
                        className="bg-slate-850 hover:bg-slate-800 text-xs font-black text-white px-3 py-1.5 rounded-lg transition-colors border border-slate-800 flex items-center gap-1"
                      >
                        <span>Download file</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {currentPost.image && (
                    <div className="rounded-2xl border border-slate-850 overflow-hidden bg-slate-900/40">
                      <img 
                        src={currentPost.image} 
                        alt="Shared Workspace Asset" 
                        className="w-full max-h-[300px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {currentPost.video && (
                    <div className="rounded-2xl border border-slate-850 overflow-hidden bg-slate-900/40 p-2">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <Video className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shared Video Demonstration</span>
                      </div>
                      <video 
                        controls 
                        className="w-full rounded-lg bg-black outline-hidden max-h-[300px]"
                        src={currentPost.video}
                      />
                    </div>
                  )}

                  {/* Body Text */}
                  <p className="text-xs leading-relaxed text-slate-300 font-semibold whitespace-pre-line bg-slate-900/20 p-4 rounded-2xl border border-slate-850/60">
                    {currentPost.content}
                  </p>

                  {/* AI Executive Thread Summarizer Accordion Panel */}
                  {(() => {
                    const postSummaryObj = threadSummaries[currentPost.id];
                    const isGenerating = postSummaryObj?.isGenerating;
                    const summaryText = postSummaryObj?.summary;

                    return (
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4.5 space-y-3 relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">
                              ✨
                            </span>
                            <div>
                              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200">AI Thread Executive Summary</h4>
                              <p className="text-[9.5px] text-slate-500 font-bold">Consolidate multiple community answers & expert feedback in seconds.</p>
                            </div>
                          </div>

                          {!isGenerating && !summaryText && (
                            <button
                              onClick={() => handleGenerateSummary(currentPost.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-md"
                            >
                              Synthesize
                            </button>
                          )}

                          {summaryText && !isGenerating && (
                            <button
                              onClick={() => handleGenerateSummary(currentPost.id)}
                              className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                            >
                              Recalculate
                            </button>
                          )}
                        </div>

                        {/* Summary Content or Loader display */}
                        {isGenerating && (
                          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-[10.5px] text-emerald-400 font-black tracking-wide animate-pulse">{summaryText}</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                              <div className="bg-emerald-400 h-full w-2/3 animate-[pulse_1s_infinite] rounded-full"></div>
                            </div>
                          </div>
                        )}

                        {summaryText && !isGenerating && (
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-3 text-slate-300 text-xs font-semibold leading-relaxed">
                            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                                AI DISPATCH SYSTEM v1.0
                              </span>
                              <span className="text-[8px] text-slate-500 font-bold">SECURE CONSENSUS METADATA</span>
                            </div>
                            <div className="space-y-3.5 text-left text-slate-300">
                              {summaryText.split('\n\n').map((paragraph, pIdx) => {
                                if (paragraph.startsWith('###')) {
                                  return (
                                    <h5 key={pIdx} className="text-[10.5px] font-black text-emerald-400 uppercase tracking-widest mt-1">
                                      {paragraph.replace('###', '').trim()}
                                    </h5>
                                  );
                                }
                                if (paragraph.startsWith('**Core Issue:**')) {
                                  return (
                                    <p key={pIdx} className="pl-3 border-l-2 border-emerald-500/35">
                                      <strong className="text-slate-100">Core Issue:</strong> {paragraph.replace('**Core Issue:**', '').trim()}
                                    </p>
                                  );
                                }
                                if (paragraph.startsWith('**Verified Solution:**') || paragraph.startsWith('**Consensus Solution:**')) {
                                  const label = paragraph.startsWith('**Verified Solution:**') ? 'Verified Solution:' : 'Consensus Solution:';
                                  const content = paragraph.replace('**Verified Solution:**', '').replace('**Consensus Solution:**', '').trim();
                                  return (
                                    <p key={pIdx} className="pl-3 border-l-2 border-emerald-500/35">
                                      <strong className="text-slate-100">{label}</strong> {content}
                                    </p>
                                  );
                                }
                                if (paragraph.startsWith('**Consensus Risk:**') || paragraph.startsWith('**Safety Warning:**')) {
                                  const label = paragraph.startsWith('**Consensus Risk:**') ? 'Consensus Risk:' : 'Safety Warning:';
                                  const content = paragraph.replace('**Consensus Risk:**', '').replace('**Safety Warning:**', '').trim();
                                  return (
                                    <p key={pIdx} className="pl-3 border-l-2 border-rose-500/30 bg-rose-500/[0.02] py-1 rounded-r-lg">
                                      <strong className="text-rose-400">{label}</strong> {content}
                                    </p>
                                  );
                                }
                                return <p key={pIdx}>{paragraph}</p>;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Social and mod actions footer */}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-4">
                    <div className="flex items-center gap-2">
                      {/* Voting */}
                      <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-850">
                        <button 
                          onClick={(e) => handlePostVote(currentPost.id, 'up', e)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${currentPost.userVote === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className={`text-xs font-black font-mono px-1 min-w-[16px] text-center ${totalPostVotes > 0 ? 'text-emerald-400' : totalPostVotes < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {totalPostVotes}
                        </span>
                        <button 
                          onClick={(e) => handlePostVote(currentPost.id, 'down', e)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${currentPost.userVote === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-xs text-slate-500 font-bold uppercase flex items-center gap-1.5 ml-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{currentPost.commentsCount} Comments</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Flag post */}
                      {!currentPost.isFlagged && (
                        <button 
                          onClick={(e) => flagPost(currentPost.id, e)}
                          className="text-[10px] text-slate-500 hover:text-slate-300 px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-xl font-black uppercase cursor-pointer"
                        >
                          Flag
                        </button>
                      )}

                      {/* Admin moderation controls inline */}
                      {currentUser.role === 'moderator' && (
                        <div className="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-850">
                          <button 
                            onClick={(e) => togglePinPost(currentPost.id, e)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${currentPost.isPinned ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                            title="Pin Post"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => toggleLockPost(currentPost.id, e)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${currentPost.isLocked ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                            title={currentPost.isLocked ? "Unlock thread" : "Lock thread"}
                          >
                            {currentPost.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={(e) => deletePost(currentPost.id, e)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Submitting a Comment / Answer */}
                <div className="border-t border-slate-900 pt-6 space-y-4">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                    {currentPost.type === 'question' ? 'Submit an Expert Answer' : 'Add to the conversation'}
                  </h3>

                  {currentPost.isLocked ? (
                    <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>This discussion thread has been locked by a moderator. No further inputs are allowed.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleAddComment} className="space-y-3">
                      <textarea
                        rows={4}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={currentPost.type === 'question' ? "Quote references, compute statistics, explain vertical configurations clearly..." : "Contribute strategically..."}
                        className="w-full bg-slate-900 border border-slate-850 focus:border-emerald-500/40 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden transition-all"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Posting as Felix Zinyenge</span>
                        <button
                          type="submit"
                          disabled={!newCommentText.trim()}
                          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                        >
                          {currentPost.type === 'question' ? 'Submit Answer' : 'Post Comment'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Comments Stream Section */}
                <div className="border-t border-slate-900 pt-6 space-y-4">
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Active Community Submissions ({currentPost.commentsCount})</span>
                  </h3>
                  {renderCommentsList(currentPost.id)}
                </div>

              </div>
            );
          })()
        ) : (
          /* ==================== SUB-VIEW: STREAM FEED FEED ==================== */
          <div className="space-y-4">
            {/* AI Optimization & Intelligence Dashboard Header */}
            <div className="bg-slate-950 border border-slate-800 p-4.5 rounded-2xl shadow-md text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>AI Intelligence Hub</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed">
                    Sovereign-level automated classification, duplicate question clustering, expert matching, and thread synthesis.
                  </p>
                </div>
                
                {/* Switches */}
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setIsAIGroupDuplicatesEnabled(!isAIGroupDuplicatesEnabled);
                      triggerToast(isAIGroupDuplicatesEnabled ? "AI Duplicate Grouping Disabled." : "AI Duplicate Grouping Enabled.");
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAIGroupDuplicatesEnabled 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950/25' 
                        : 'bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Group Duplicates: {isAIGroupDuplicatesEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAIGroupAnswersEnabled(!isAIGroupAnswersEnabled);
                      triggerToast(isAIGroupAnswersEnabled ? "AI Answer Clustering Disabled." : "AI Answer Clustering Enabled.");
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAIGroupAnswersEnabled 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-950/25' 
                        : 'bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Cluster Answers: {isAIGroupAnswersEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 space-y-3">
                <Compass className="w-8 h-8 text-slate-700 mx-auto" />
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">No posts or questions matched your query</h4>
                <p className="text-[10.5px] font-semibold text-slate-500 max-w-sm mx-auto">
                  Try broadening your search criteria or write a brand new thread to engage community validation members.
                </p>
                <button 
                  onClick={() => setIsCreatingPost(true)}
                  className="bg-slate-900 hover:bg-slate-850 text-emerald-400 font-black text-[10px] px-4 py-2 rounded-xl border border-slate-800 transition-all cursor-pointer inline-block mt-2"
                >
                  Write New Post
                </button>
              </div>
            ) : (
              filteredPosts.map(post => {
                const comm = communities.find(c => c.id === post.communityId);
                const totalVotes = post.upvotes - post.downvotes;

                return (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all cursor-pointer hover:translate-y-[-1px] space-y-3.5 relative overflow-hidden"
                  >
                    {post.isPinned && (
                      <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-0.5 rounded-br-lg text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 z-10">
                        <Pin className="w-2 h-2" /> Pinned
                      </div>
                    )}

                    {/* Post Meta Row */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs shrink-0">{comm?.icon}</span>
                        <span className="text-xs font-black text-slate-200 truncate">c/{comm?.name}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] text-slate-500 font-semibold truncate">Posted by {post.author}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold font-mono shrink-0">{post.createdAt}</span>
                    </div>

                    {/* Post Core Title & Content Preview */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        {post.type === 'question' ? (
                          <span className="text-[8px] bg-emerald-500 text-slate-950 font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                            <HelpCircle className="w-2.5 h-2.5" /> Q&A
                          </span>
                        ) : (
                          <span className="text-[8px] bg-slate-800 text-slate-300 font-black uppercase px-1.5 py-0.5 rounded shrink-0">
                            Post
                          </span>
                        )}

                        {post.document && (
                          <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-0.5 shrink-0">
                            <FileText className="w-2.5 h-2.5" /> DOC
                          </span>
                        )}
                        {post.video && (
                          <span className="text-[8px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-0.5 shrink-0">
                            <Video className="w-2.5 h-2.5" /> VIDEO
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-black text-slate-100 hover:text-emerald-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-[11px] leading-relaxed text-slate-400 font-semibold line-clamp-2">
                        {post.content}
                      </p>
                    </div>

                    {/* Dynamic Shared assets thumbnail preview */}
                    {post.image && (
                      <div className="rounded-xl border border-slate-900 overflow-hidden bg-slate-900/10 max-h-[140px]">
                        <img 
                          src={post.image} 
                          alt="Asset Preview" 
                          className="w-full object-cover max-h-[140px]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Interaction Footer Bar */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-900 pt-3 mt-1.5">
                      
                      <div className="flex items-center gap-2">
                        {/* Upvote & Downvote buttons */}
                        <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-850">
                          <button 
                            onClick={(e) => handlePostVote(post.id, 'up', e)}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${post.userVote === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className={`text-[11px] font-bold font-mono px-1 min-w-[12px] text-center ${totalVotes > 0 ? 'text-emerald-400' : totalVotes < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                            {totalVotes}
                          </span>
                          <button 
                            onClick={(e) => handlePostVote(post.id, 'down', e)}
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${post.userVote === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Comments count anchor */}
                        <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                          <span>{post.commentsCount} Comments</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Action details trigger */}
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors flex items-center gap-0.5">
                          <span>View Thread</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>

                        {/* Inline admin approvals for Flagged posts in stream */}
                        {post.isFlagged && currentUser.role === 'moderator' && (
                          <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                            <button 
                              onClick={(e) => approvePost(post.id, e)}
                              className="text-[8px] font-black text-emerald-400 uppercase tracking-widest hover:text-white"
                            >
                              Approve
                            </button>
                            <span className="text-amber-500">|</span>
                            <button 
                              onClick={(e) => deletePost(post.id, e)}
                              className="text-[8px] font-black text-rose-500 uppercase tracking-widest hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Interactive Duplicate Grouping Collapsible Accordion */}
                    {(() => {
                      const duplicatePosts = posts.filter(p => p.duplicateOf === post.id);
                      const hasDuplicates = duplicatePosts.length > 0;
                      const isExpanded = !!expandedDuplicatePostIds[post.id];

                      if (!isAIGroupDuplicatesEnabled || !hasDuplicates) return null;

                      return (
                        <div className="mt-3.5 border-t border-slate-900/60 pt-3 text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedDuplicatePostIds(prev => ({ ...prev, [post.id]: !prev[post.id] }));
                            }}
                            className="w-full bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850/40 hover:border-slate-850 rounded-xl px-3 py-2 text-[10px] font-black text-slate-300 flex items-center justify-between transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="uppercase tracking-wider">AI Detected Duplicate Questions Grouped ({duplicatePosts.length})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 font-bold uppercase">{isExpanded ? 'Collapse' : 'Expand'}</span>
                              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden space-y-2 mt-2 pl-3 border-l-2 border-emerald-500/20"
                              >
                                {duplicatePosts.map(dup => (
                                  <div 
                                    key={dup.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPostId(dup.id);
                                    }}
                                    className="p-3 bg-slate-900/25 border border-slate-850/40 hover:border-slate-800 rounded-xl transition-all space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between text-[8px] text-slate-500 font-black uppercase tracking-wider">
                                      <span>Duplicate Question • asked by {dup.author}</span>
                                      <span>{dup.createdAt}</span>
                                    </div>
                                    <h4 className="text-xs font-black text-slate-200 hover:text-emerald-400 leading-snug transition-colors">
                                      {dup.title}
                                    </h4>
                                    <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed line-clamp-1">
                                      {dup.content}
                                    </p>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}

                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR: TRENDING & METRIC LEADERBOARDS (3 COLS) */}
      <div className="lg:col-span-3 space-y-5">
        
        {/* Dynamic Trending Communities Panel */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between border-b border-slate-900 pb-3.5 mb-3.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trending Communities</span>
            </h4>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-4">
            {communities.map((comm, idx) => {
              const activeRatio = Math.round((comm.activeToday / comm.memberCount) * 100);
              return (
                <div key={comm.id} className="flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-[10px] font-black font-mono text-slate-600">0{idx + 1}.</span>
                    <div className="truncate">
                      <div className="text-xs font-black text-slate-200 truncate">c/{comm.name}</div>
                      <span className="text-[9px] text-slate-500 font-bold block">+{comm.trendingScore}% this week</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] text-emerald-400 font-black font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {activeRatio}% Active
                    </span>
                    {!comm.isJoined && (
                      <button 
                        onClick={(e) => toggleJoinCommunity(comm.id, e)}
                        className="text-[8px] font-black bg-slate-900 hover:bg-slate-800 text-white uppercase px-2 py-1 rounded border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✨ AI Expert Matchmaker Widget */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>AI Expert Routing</span>
            </h4>
            <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.2 rounded font-black uppercase">LIVE MATCH</span>
          </div>

          <div className="space-y-4">
            {getRecommendedExperts(selectedPostId, selectedCommunityId === 'all' ? null : selectedCommunityId).map((expert, idx) => {
              const isInvited = selectedPostId ? !!invitedExperts[selectedPostId]?.includes(expert.name) : false;

              return (
                <div key={idx} className="bg-slate-900/20 border border-slate-850/60 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <span className="text-[11px] font-black text-slate-200 block">{expert.name}</span>
                      <span className="text-[9px] text-blue-400 font-bold block">{expert.spec}</span>
                    </div>
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 font-mono px-1.5 py-0.5 rounded font-black">
                      {expert.match}% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    {expert.text}
                  </p>
                  
                  {selectedPostId ? (
                    <button
                      onClick={() => handleInviteExpertAnswer(selectedPostId, expert.name)}
                      disabled={isInvited}
                      className={`w-full text-center text-[9px] font-black uppercase py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isInvited
                          ? 'bg-slate-900 border-slate-850 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400 hover:text-blue-300'
                      }`}
                    >
                      {isInvited ? 'Expert Response Pending' : 'Request Expert Analysis'}
                    </button>
                  ) : (
                    <span className="text-[8px] text-slate-600 font-bold block text-center uppercase tracking-wider">
                      Open a thread to ask expert
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ✨ AI Community Recommendation Widget */}
        {getRecommendedCommunities().length > 0 && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>AI Recommended Hubs</span>
              </h4>
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-black uppercase">MATCH</span>
            </div>

            <div className="space-y-3.5">
              {getRecommendedCommunities().map((comm, idx) => (
                <div key={comm.id} className="flex items-center justify-between gap-3 text-left">
                  <div className="truncate flex-1 min-w-0">
                    <span className="text-xs font-black text-slate-200 block truncate">c/{comm.name}</span>
                    <span className="text-[9px] text-slate-500 font-bold block truncate">{comm.description}</span>
                  </div>
                  <button
                    onClick={(e) => toggleJoinCommunity(comm.id, e)}
                    className="text-[9px] font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 animate-pulse"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CFO Guidelines and Help Box */}
        <div className="bg-slate-900/30 border border-slate-850 p-5 rounded-2xl space-y-3.5 text-left">
          <div className="flex items-center gap-1.5 text-slate-400">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <h4 className="text-[10px] font-black uppercase tracking-wider">Workspace Help</h4>
          </div>
          
          <div className="space-y-3">
            <div className="text-[10.5px] leading-relaxed text-slate-400 font-semibold">
              • **Q&A specific markup**: Q&A authors and moderators can highlight accurate answers. These are stickied at the top of the comment stream with a green **Verified Solution** badge.
            </div>
            <div className="text-[10.5px] leading-relaxed text-slate-400 font-semibold">
              • **Document sharing**: Download real PDF templates, Excel worksheets, or vector illustrations shared directly within the communities.
            </div>
          </div>
        </div>

      </div>

      {/* ==================== MODAL: NEW COMMUNITY CREATOR ==================== */}
      <AnimatePresence>
        {isCreatingCommunity && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setIsCreatingCommunity(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-white flex items-center gap-2 mb-1.5">
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Launch Decentralized Community</span>
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-500 font-semibold mb-5">
                Define the domain guidelines, icon styling, and target categories. Launching initializes automatic administrative privileges for the creator.
              </p>

              <form onSubmit={handleCreateCommunity} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase block">Hub Name (No Spaces)</label>
                  <input
                    type="text"
                    required
                    value={newCommName}
                    onChange={(e) => setNewCommName(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. ASICMiningCabinets"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase block">Mission / Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newCommDesc}
                    onChange={(e) => setNewCommDesc(e.target.value)}
                    placeholder="Provide a concise objective brief of this sovereign hub..."
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-black uppercase block">Icon representation</label>
                    <select
                      value={newCommIcon}
                      onChange={(e) => setNewCommIcon(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 focus:outline-hidden"
                    >
                      <option value="⚡">⚡ Lightning (Hardware)</option>
                      <option value="💼">💼 Briefcase (Corporate)</option>
                      <option value="📊">📊 Chart (Accounting)</option>
                      <option value="🪙">🪙 Coin (Crypto Staking)</option>
                      <option value="🔥">🔥 Flame (Trending)</option>
                      <option value="🌐">🌐 Global (General)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-black uppercase block">Category</label>
                    <div className="bg-slate-900 border border-slate-850 text-slate-400 rounded-xl px-3 py-2.5 text-xs font-bold">
                      Sovereign Ledger
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase block">Community Rules (One per line)</label>
                  <textarea
                    rows={3}
                    value={newCommRules}
                    onChange={(e) => setNewCommRules(e.target.value)}
                    placeholder="No commercial spam&#10;Keep formulas verifiable"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/40"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCommunity(false)}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-5 py-2 rounded-xl cursor-pointer"
                  >
                    Deploy Hub
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL: NEW POST CREATOR ==================== */}
      <AnimatePresence>
        {isCreatingPost && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative text-left"
            >
              <button 
                onClick={() => setIsCreatingPost(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-white flex items-center gap-2 mb-1.5">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <span>Create Hub Submission</span>
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-500 font-semibold mb-5">
                Post questions or documentation guidelines. You can optionally attach high-definition image assets, video clips, or spreadsheets.
              </p>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-black uppercase block">Select Target Hub</label>
                    <select
                      value={newPostCommunityId}
                      onChange={(e) => setNewPostCommunityId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 focus:outline-hidden"
                    >
                      {communities.map(c => (
                        <option key={c.id} value={c.id}>c/{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-black uppercase block">Format Type</label>
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-850">
                      <button
                        type="button"
                        onClick={() => setNewPostType('post')}
                        className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                          newPostType === 'post' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        General Post
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPostType('question')}
                        className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                          newPostType === 'question' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        Q&A Question
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase block">Title</label>
                  <input
                    type="text"
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder={newPostType === 'question' ? "e.g. How do we claim Section 41 credits back for crypto-server rigs?" : "e.g. Guide to liquid-cool server racks configurations"}
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase block">Body Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Explain mathematically, outline variables, or detail the steps explicitly..."
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/40"
                  />
                </div>

                {/* Simulated file attachments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 border-t border-slate-900">
                  
                  {/* File attach button */}
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] text-slate-400 font-black uppercase block">Attach Documents, Images, or Videos</span>
                    <div className="flex items-center gap-2.5">
                      <label className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-black text-[10px] px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingFile ? 'Uploading...' : 'Choose File'}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={simulateFileUpload}
                          accept="image/*,video/*,application/pdf"
                          disabled={isUploadingFile}
                        />
                      </label>
                      {attachedFile && (
                        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-black">
                          <Check className="w-3 h-3" /> Attached
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL custom fields */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-black uppercase block">Or paste visual asset URL (optional)</span>
                    <input
                      type="text"
                      value={newPostImage || newPostVideo}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes('.mp4') || val.includes('mov_bbb')) {
                          setNewPostVideo(val);
                          setNewPostImage('');
                        } else {
                          setNewPostImage(val);
                          setNewPostVideo('');
                        }
                      }}
                      placeholder="e.g. https://domain.com/video.mp4 or photo.jpg"
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3.5 py-1.5 text-[10.5px] font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-hidden"
                    />
                  </div>

                </div>

                {attachedFile && (
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-emerald-500/20 text-xs font-semibold flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>{attachedFile.name} ({attachedFile.size})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setAttachedFile(null)} 
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingPost(false);
                      setAttachedFile(null);
                    }}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-md"
                  >
                    Publish Post
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
