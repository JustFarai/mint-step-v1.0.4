import React, { useState, useEffect } from 'react';
import { 
  Bell, Heart, MessageSquare, AtSign, Bot, Package, 
  Receipt, Wallet, Users, CheckCheck, Trash2, Filter, 
  Sparkles, RefreshCw, Radio, ExternalLink, Zap, ShieldAlert,
  ChevronRight, X, Search, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type NotificationCategory = 
  | 'all'
  | 'like' 
  | 'comment' 
  | 'mention' 
  | 'ai_alert' 
  | 'inventory_alert' 
  | 'tax_alert' 
  | 'budget_alert' 
  | 'community_activity';

export interface NotificationItem {
  id: string;
  category: Exclude<NotificationCategory, 'all'>;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'info';
  actor?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  actionLabel?: string;
  actionType?: 'navigate' | 'modal' | 'external';
  targetMode?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'ai_alert',
    title: 'CFO Intelligence: Cashflow Anomaly',
    message: 'Detected high hardware outlay of $12,500 for Taiwan Semiconductor Wafers. Profit margin adjusted to 68%.',
    timestamp: '2 mins ago',
    read: false,
    priority: 'high',
    actionLabel: 'Review CFO Insights',
    targetMode: 'assistant'
  },
  {
    id: 'n2',
    category: 'inventory_alert',
    title: 'Low Stock Alert: Box Nano-Router v2',
    message: 'Only 2 units remaining in stock (below threshold of 5 units). Reorder 10 units to maintain supply.',
    timestamp: '10 mins ago',
    read: false,
    priority: 'high',
    actionLabel: 'Open Inventory',
    targetMode: 'inventory'
  },
  {
    id: 'n3',
    category: 'tax_alert',
    title: 'Q3 Estimated Tax Payment Due',
    message: 'Estimated quarterly liability of $4,850 due in 14 days. Review deductions to lower tax bill.',
    timestamp: '1 hour ago',
    read: false,
    priority: 'high',
    actionLabel: 'Tax Calculations',
    targetMode: 'business'
  },
  {
    id: 'n4',
    category: 'like',
    title: 'New Like on Short Video',
    message: 'Elena Rostova and 14 others liked your Advisor Short "Tax Deductions for Hardware Founders in 2026".',
    timestamp: '2 hours ago',
    read: false,
    priority: 'info',
    actor: { name: 'Elena Rostova', role: 'Venture Partner' },
    actionLabel: 'Watch Short',
    targetMode: 'shorts'
  },
  {
    id: 'n5',
    category: 'comment',
    title: 'New Comment on Creator Post',
    message: 'Marcus Vance: "The quantum router latency numbers look incredible. What is the power draw on load?"',
    timestamp: '3 hours ago',
    read: true,
    priority: 'medium',
    actor: { name: 'Marcus Vance', role: 'Lead Architect' },
    actionLabel: 'Reply in Studio',
    targetMode: 'studio'
  },
  {
    id: 'n6',
    category: 'mention',
    title: 'Tagged in Tech Founders Circle',
    message: 'Sophia Perez tagged @Farai Zinyenge: "Can you provide the server setup guide for the Box Quantum Switch?"',
    timestamp: '5 hours ago',
    read: false,
    priority: 'medium',
    actor: { name: 'Sophia Perez', role: 'Founder & CEO' },
    actionLabel: 'View Mention',
    targetMode: 'communities'
  },
  {
    id: 'n7',
    category: 'budget_alert',
    title: 'Budget Threshold Reached (85%)',
    message: 'Housing & Rent budget reached $1,800 of $2,000 monthly limit. Safe margin remaining: $200.',
    timestamp: '6 hours ago',
    read: true,
    priority: 'medium',
    actionLabel: 'View Personal Budget',
    targetMode: 'personal'
  },
  {
    id: 'n8',
    category: 'community_activity',
    title: 'Community Milestone',
    message: 'Tech Founders Circle reached 1,250 active members! 3 new discussions started today.',
    timestamp: '12 hours ago',
    read: true,
    priority: 'info',
    actionLabel: 'Explore Circle',
    targetMode: 'communities'
  }
];

interface NotificationCenterProps {
  onNavigateMode?: (mode: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateMode,
  onClose,
  isModal = false
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('wf_notifications_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'unread' | 'high'>('all');
  
  // Realtime Simulation / Firebase State
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wf_notifications_data', JSON.stringify(notifications));
  }, [notifications]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(item => item.id === id ? { ...item, read: true } : item));
    triggerToast("Notification marked as read.");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
    triggerToast("All notifications marked as read.");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    triggerToast("Notification removed.");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    triggerToast("Cleared all notifications.");
  };

  // Simulate Realtime Event push (Firebase realtime broadcast)
  const simulateRealtimeEvent = (type: Exclude<NotificationCategory, 'all'>) => {
    setIsSyncingFirebase(true);
    setTimeout(() => {
      setIsSyncingFirebase(false);
      setLastSyncTime('Just now');

      const id = 'rt_' + Date.now();
      let newNotif: NotificationItem;

      switch (type) {
        case 'like':
          newNotif = {
            id,
            category: 'like',
            title: 'Realtime Like Received',
            message: 'David K. liked your Business Profile portfolio card.',
            timestamp: 'Just now',
            read: false,
            priority: 'info',
            actor: { name: 'David K.', role: 'Investor' },
            actionLabel: 'View Profile',
            targetMode: 'profile'
          };
          break;
        case 'comment':
          newNotif = {
            id,
            category: 'comment',
            title: 'Realtime Comment',
            message: 'Sarah Connor: "When is the next batch of Box Routers shipping?"',
            timestamp: 'Just now',
            read: false,
            priority: 'medium',
            actor: { name: 'Sarah Connor', role: 'Client' },
            actionLabel: 'Open Studio',
            targetMode: 'studio'
          };
          break;
        case 'mention':
          newNotif = {
            id,
            category: 'mention',
            title: 'Realtime Tag @Farai',
            message: 'Alex Mercer mentioned @Farai Zinyenge in #wealth-communities channel.',
            timestamp: 'Just now',
            read: false,
            priority: 'medium',
            actor: { name: 'Alex Mercer', role: 'Dev Lead' },
            actionLabel: 'Open Chat',
            targetMode: 'communities'
          };
          break;
        case 'ai_alert':
          newNotif = {
            id,
            category: 'ai_alert',
            title: 'Realtime AI Alert: Yield Shift',
            message: 'Gemini CFO detected a +3.4% APY increase in treasury yield funds.',
            timestamp: 'Just now',
            read: false,
            priority: 'high',
            actionLabel: 'Ask Gemini CFO',
            targetMode: 'assistant'
          };
          break;
        case 'inventory_alert':
          newNotif = {
            id,
            category: 'inventory_alert',
            title: 'Realtime Inventory Update',
            message: 'Box Quantum Switch v4 stock updated. 5 items dispatched to SpaceX.',
            timestamp: 'Just now',
            read: false,
            priority: 'high',
            actionLabel: 'Check Inventory',
            targetMode: 'inventory'
          };
          break;
        case 'tax_alert':
          newNotif = {
            id,
            category: 'tax_alert',
            title: 'Realtime Tax Deduction Found',
            message: 'Receipt scan auto-categorized $1,500 Transport as 100% Tax Deductible.',
            timestamp: 'Just now',
            read: false,
            priority: 'medium',
            actionLabel: 'View Ledger',
            targetMode: 'business'
          };
          break;
        case 'budget_alert':
          newNotif = {
            id,
            category: 'budget_alert',
            title: 'Realtime Budget Alert',
            message: 'Groceries spend increased by $45. Food budget status: 92% allocated.',
            timestamp: 'Just now',
            read: false,
            priority: 'high',
            actionLabel: 'View Budget',
            targetMode: 'personal'
          };
          break;
        case 'community_activity':
        default:
          newNotif = {
            id,
            category: 'community_activity',
            title: 'Realtime Community Broadcast',
            message: 'New live webinar scheduled: "Financing Hardware Startups with Zero Equity".',
            timestamp: 'Just now',
            read: false,
            priority: 'info',
            actionLabel: 'RSVP Event',
            targetMode: 'communities'
          };
          break;
      }

      setNotifications(prev => [newNotif, ...prev]);
      triggerToast(`⚡ Realtime Firebase event received: ${newNotif.title}`);
    }, 400);
  };

  // Filtered list
  const filteredNotifications = notifications.filter(item => {
    // Category match
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    
    // Priority / Unread match
    if (filterPriority === 'unread' && item.read) return false;
    if (filterPriority === 'high' && item.priority !== 'high') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchActor = item.actor?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchActor) return false;
    }

    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (cat: Exclude<NotificationCategory, 'all'>) => {
    switch (cat) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-indigo-400" />;
      case 'ai_alert':
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case 'inventory_alert':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'tax_alert':
        return <Receipt className="w-4 h-4 text-purple-400" />;
      case 'budget_alert':
        return <Wallet className="w-4 h-4 text-rose-400" />;
      case 'community_activity':
        return <Users className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: Exclude<NotificationCategory, 'all'>) => {
    switch (cat) {
      case 'like': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'comment': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'mention': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'ai_alert': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'inventory_alert': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'tax_alert': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'budget_alert': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'community_activity': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const categoriesList: { id: NotificationCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Alerts', count: notifications.length },
    { id: 'like', label: 'Likes', count: notifications.filter(n => n.category === 'like').length },
    { id: 'comment', label: 'Comments', count: notifications.filter(n => n.category === 'comment').length },
    { id: 'mention', label: 'Mentions', count: notifications.filter(n => n.category === 'mention').length },
    { id: 'ai_alert', label: 'AI Alerts', count: notifications.filter(n => n.category === 'ai_alert').length },
    { id: 'inventory_alert', label: 'Inventory Alerts', count: notifications.filter(n => n.category === 'inventory_alert').length },
    { id: 'tax_alert', label: 'Tax Alerts', count: notifications.filter(n => n.category === 'tax_alert').length },
    { id: 'budget_alert', label: 'Budget Alerts', count: notifications.filter(n => n.category === 'budget_alert').length },
    { id: 'community_activity', label: 'Community', count: notifications.filter(n => n.category === 'community_activity').length },
  ];

  return (
    <div className={`w-full ${isModal ? 'p-2' : 'p-4 md:p-6'} space-y-6 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs flex items-center space-x-2 border border-emerald-400"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Bell className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-100 tracking-tight">Notification Center</h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-black animate-pulse">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time alerts for Likes, Comments, Mentions, AI Insights, Inventory, Tax, Budget & Community</p>
          </div>
        </div>

        {/* Realtime Firebase Sync Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Firebase Realtime Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${isSyncingFirebase ? 'text-amber-400 animate-spin' : isFirebaseConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Firebase Realtime:</span>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>

          {/* Quick Actions */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          {isModal && onClose && (
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Realtime Event Simulator Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span className="text-xs font-bold text-slate-200">Firebase Realtime Broadcast Simulator</span>
            <span className="text-[10px] text-slate-500">(Click to trigger live Firestore notification stream)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Last Sync: {lastSyncTime}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          <button
            onClick={() => simulateRealtimeEvent('like')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-[11px] font-bold text-rose-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span>+ Like</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('comment')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/40 text-[11px] font-bold text-sky-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Comment</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('mention')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-[11px] font-bold text-indigo-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <AtSign className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ Mention</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('ai_alert')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold text-emerald-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ AI Alert</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('inventory_alert')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-[11px] font-bold text-amber-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Inventory</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('tax_alert')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-[11px] font-bold text-purple-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-purple-400" />
            <span>+ Tax Alert</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('budget_alert')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-[11px] font-bold text-rose-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Budget</span>
          </button>

          <button
            onClick={() => simulateRealtimeEvent('community_activity')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-bold text-cyan-300 transition-all flex flex-col items-center space-y-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ Community</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Category Scroll Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeCategory === cat.id ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Secondary Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search alerts or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400 font-medium">View:</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setFilterPriority('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterPriority === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterPriority('unread')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterPriority === 'unread' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilterPriority('high')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filterPriority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                High Priority
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 min-h-[300px]">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-300">No Notifications Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no alerts matching your current filter criteria. Use the Realtime Simulator above to trigger live Firebase alerts!
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl border transition-all ${
                !notif.read
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  {/* Category Icon Badge */}
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${getCategoryBadgeClass(notif.category)}`}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-100">{notif.title}</span>
                      
                      {/* Priority Tag */}
                      {notif.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[9px] font-black tracking-wide border border-rose-500/30 uppercase">
                          High Priority
                        </span>
                      )}

                      {/* Unread indicator dot */}
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Unread Alert" />
                      )}
                    </div>

                    {/* Actor info if present */}
                    {notif.actor && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                        <span className="text-emerald-400 font-bold">{notif.actor.name}</span>
                        {notif.actor.role && <span className="text-slate-500">• {notif.actor.role}</span>}
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>

                    {/* Timestamp & Action link */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>

                      {notif.actionLabel && notif.targetMode && (
                        <button
                          onClick={() => {
                            if (!notif.read) markAsRead(notif.id);
                            if (onNavigateMode && notif.targetMode) {
                              onNavigateMode(notif.targetMode);
                              triggerToast(`Navigated to ${notif.targetMode.replace('_', ' ')}`);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center space-x-1 transition-all cursor-pointer"
                        >
                          <span>{notif.actionLabel}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      title="Mark as read"
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-emerald-950/50 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    title="Delete notification"
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
