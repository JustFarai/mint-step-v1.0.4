import React, { useState, useEffect } from 'react';
import { 
  Building2, ArrowRightLeft, Users, Shield, Plus, Check, ChevronDown, 
  Sparkles, DollarSign, Package, BarChart2, FileText, Share2, UserPlus, 
  Trash2, Edit3, Lock, Unlock, Mail, CheckCircle2, RefreshCw, AlertCircle, 
  Briefcase, Shirt, Printer, Cpu, ExternalLink, ShieldCheck, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  category: string;
  currency: string;
  logoIcon: 'technology' | 'clothing' | 'printing' | 'generic';
  revenue: number;
  expenses: number;
  inventoryCount: number;
  communityMembers: number;
  taxRatePercent: number;
  taxYtd: number;
  team: Employee[];
  inventory: { id: string; name: string; quantity: number; unitPrice: number; category: string }[];
  salesLedger: { id: string; title: string; client: string; amount: number; date: string }[];
  reports: { id: string; title: string; type: string; date: string }[];
  communityPosts: { id: string; title: string; author: string; likes: number; comments: number }[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Cashier' | 'Accountant' | 'Inventory Lead';
  permissions: string[];
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  joinedDate: string;
}

export const defaultBusinesses: BusinessProfile[] = [
  {
    id: 'biz_tech',
    name: 'Box Technologies',
    tagline: 'Enterprise Cloud Hardware & AI Edge Compute',
    category: 'Technology & Hardware',
    currency: 'USD ($)',
    logoIcon: 'technology',
    revenue: 97800,
    expenses: 26200,
    inventoryCount: 158,
    communityMembers: 4200,
    taxRatePercent: 8.25,
    taxYtd: 8068.5,
    team: [
      { id: 'emp-1', name: 'Felix Zinyenge', email: 'fzinyenge@gmail.com', role: 'Owner', permissions: ['Full Admin Access', 'Process POS', 'Financial Ledger', 'File Taxes', 'Manage Staff'], status: 'ACTIVE', joinedDate: '2025-01-10' },
      { id: 'emp-2', name: 'Alex Vance', email: 'alex.vance@boxtech.io', role: 'Manager', permissions: ['Process POS', 'Financial Ledger', 'Manage Staff'], status: 'ACTIVE', joinedDate: '2025-03-15' },
      { id: 'emp-3', name: 'Sarah Jenkins', email: 's.jenkins@boxtech.io', role: 'Accountant', permissions: ['Financial Ledger', 'File Taxes'], status: 'ACTIVE', joinedDate: '2025-06-01' }
    ],
    inventory: [
      { id: 'bt-1', name: 'Box Tech Solar Inverter 5kW', quantity: 24, unitPrice: 1250, category: 'Hardware' },
      { id: 'bt-2', name: 'Smart Lithium Battery 48V', quantity: 18, unitPrice: 890, category: 'Hardware' },
      { id: 'bt-3', name: 'Fiber Optic Patch Cable 10m', quantity: 120, unitPrice: 45, category: 'Accessories' },
      { id: 'bt-4', name: 'Enterprise Router X1', quantity: 35, unitPrice: 350, category: 'Networking' }
    ],
    salesLedger: [
      { id: 'bt-s1', title: 'Titanium Rack Delivery', client: 'SpaceX B2B Cloud', amount: 48500, date: '2026-07-15' },
      { id: 'bt-s2', title: '10x Quantum Router Nodes', client: 'Anduril Node Defense', amount: 24000, date: '2026-07-12' },
      { id: 'bt-s3', title: 'Solidity Compiler Assembly', client: 'Ethereum Foundation', amount: 15500, date: '2026-07-08' }
    ],
    reports: [
      { id: 'bt-r1', title: 'Q2 2026 Cloud Hardware Revenue Audit', type: 'Financial', date: '2026-07-01' },
      { id: 'bt-r2', title: 'Shenzhen Supply Chain Valuation', type: 'Inventory', date: '2026-06-28' }
    ],
    communityPosts: [
      { id: 'bt-c1', title: 'Announcing 10Gbps Quantum Switches for Developers', author: 'Felix Zinyenge', likes: 342, comments: 45 },
      { id: 'bt-c2', title: 'How we built zero-latency firmware for edge AI', author: 'Alex Vance', likes: 219, comments: 28 }
    ]
  },
  {
    id: 'biz_apparel',
    name: 'The Box Clothing',
    tagline: 'Minimalist Premium Streetwear & Tech-Wear',
    category: 'Retail Apparel',
    currency: 'USD ($)',
    logoIcon: 'clothing',
    revenue: 64200,
    expenses: 18900,
    inventoryCount: 420,
    communityMembers: 12800,
    taxRatePercent: 7.5,
    taxYtd: 4815.0,
    team: [
      { id: 'emp-10', name: 'Felix Zinyenge', email: 'fzinyenge@gmail.com', role: 'Owner', permissions: ['Full Admin Access', 'Process POS', 'Financial Ledger', 'File Taxes', 'Manage Staff'], status: 'ACTIVE', joinedDate: '2025-02-01' },
      { id: 'emp-11', name: 'Mia Thorne', email: 'mia@theboxclothing.com', role: 'Inventory Lead', permissions: ['Process POS', 'Edit Inventory'], status: 'ACTIVE', joinedDate: '2025-04-12' },
      { id: 'emp-12', name: 'Devon Carter', email: 'devon@theboxclothing.com', role: 'Cashier', permissions: ['Process POS'], status: 'ACTIVE', joinedDate: '2025-08-20' }
    ],
    inventory: [
      { id: 'bc-1', name: 'Heavyweight Matte Hoodie (Black)', quantity: 150, unitPrice: 120, category: 'Apparel' },
      { id: 'bc-2', name: 'Waterproof Techwear Parka', quantity: 85, unitPrice: 280, category: 'Outerwear' },
      { id: 'bc-3', name: 'Raw Denim Oversized Cargo Pants', quantity: 95, unitPrice: 140, category: 'Apparel' },
      { id: 'bc-4', name: 'Box Minimalist Canvas Tote', quantity: 90, unitPrice: 45, category: 'Accessories' }
    ],
    salesLedger: [
      { id: 'bc-s1', title: 'SoHo Storefront Weekend Retail Drop', client: 'Walk-in Customers', amount: 32400, date: '2026-07-20' },
      { id: 'bc-s2', title: 'Tokyo Pop-Up Wholesale Consignment', client: 'Harajuku Select Co.', amount: 18600, date: '2026-07-14' }
    ],
    reports: [
      { id: 'bc-r1', title: 'Summer Collection Retail Sell-Through', type: 'Sales & Inventory', date: '2026-07-18' }
    ],
    communityPosts: [
      { id: 'bc-c1', title: 'Drop 04: Matte Organic Cotton Fabrics Unveiled', author: 'Mia Thorne', likes: 1420, comments: 184 },
      { id: 'bc-c2', title: 'Behind the Scenes: Cut & Sew in Portugal', author: 'Felix Zinyenge', likes: 890, comments: 92 }
    ]
  },
  {
    id: 'biz_print',
    name: 'Box Printing',
    tagline: 'High-Speed Commercial Digital Print & Custom Packaging',
    category: 'Commercial Printing & Packaging',
    currency: 'USD ($)',
    logoIcon: 'printing',
    revenue: 41500,
    expenses: 12800,
    inventoryCount: 890,
    communityMembers: 1950,
    taxRatePercent: 8.0,
    taxYtd: 3320.0,
    team: [
      { id: 'emp-20', name: 'Felix Zinyenge', email: 'fzinyenge@gmail.com', role: 'Owner', permissions: ['Full Admin Access', 'Process POS', 'Financial Ledger', 'File Taxes', 'Manage Staff'], status: 'ACTIVE', joinedDate: '2025-01-20' },
      { id: 'emp-21', name: 'Marcus Hayes', email: 'marcus@boxprinting.com', role: 'Manager', permissions: ['Process POS', 'Financial Ledger', 'Manage Staff'], status: 'ACTIVE', joinedDate: '2025-05-10' }
    ],
    inventory: [
      { id: 'bp-1', name: 'Matte Finish Heavy Cardstock (1000 Sheets)', quantity: 300, unitPrice: 65, category: 'Raw Materials' },
      { id: 'bp-2', name: 'UV Coating Ink Concentrate (5L)', quantity: 45, unitPrice: 220, category: 'Inks & Pigments' },
      { id: 'bp-3', name: 'Custom Embossed Product Mailer Boxes', quantity: 500, unitPrice: 4.5, category: 'Packaging' }
    ],
    salesLedger: [
      { id: 'bp-s1', title: 'Unicorn Tech Event Vinyl Banners', client: 'TechCrunch Disrupt', amount: 14500, date: '2026-07-19' },
      { id: 'bp-s2', title: 'Custom Foil Business Cards (50,000 units)', client: 'Y Combinator Alumni', amount: 9800, date: '2026-07-11' }
    ],
    reports: [
      { id: 'bp-r1', title: 'Offset vs Digital Press Ink Margin Breakdown', type: 'Cost Analysis', date: '2026-07-10' }
    ],
    communityPosts: [
      { id: 'bp-c1', title: 'Eco-Friendly Recycled Biodegradable Inks guide', author: 'Marcus Hayes', likes: 410, comments: 38 }
    ]
  }
];

export interface MultiBusinessManagerProps {
  onBusinessChanged?: (business: BusinessProfile) => void;
}

export const MultiBusinessManager: React.FC<MultiBusinessManagerProps> = ({ onBusinessChanged }) => {
  // Persistence state
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem('mintstep_businesses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultBusinesses;
  });

  const [activeBusinessId, setActiveBusinessId] = useState<string>(() => {
    return localStorage.getItem('mintstep_active_biz_id') || 'biz_tech';
  });

  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TEAM' | 'ACCOUNTING' | 'INVENTORY' | 'TAXES' | 'COMMUNITY' | 'REPORTS'>('OVERVIEW');

  // Employee Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [newEmpEmail, setNewEmpEmail] = useState<string>('');
  const [newEmpName, setNewEmpName] = useState<string>('');
  const [newEmpRole, setNewEmpRole] = useState<'Manager' | 'Cashier' | 'Accountant' | 'Inventory Lead'>('Cashier');

  // New Business Modal State
  const [showNewBizModal, setShowNewBizModal] = useState<boolean>(false);
  const [newBizName, setNewBizName] = useState<string>('');
  const [newBizTagline, setNewBizTagline] = useState<string>('');
  const [newBizCategory, setNewBizCategory] = useState<string>('E-Commerce & Retail');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Save to localStorage whenever business list or active ID updates
  useEffect(() => {
    localStorage.setItem('mintstep_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('mintstep_active_biz_id', activeBusinessId);
  }, [activeBusinessId]);

  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0];

  // Handler to switch active business with smooth transition animation
  const handleSwitchBusiness = (id: string) => {
    if (id === activeBusinessId) return;
    setIsSwitching(true);
    setTimeout(() => {
      setActiveBusinessId(id);
      setIsSwitching(false);
      const target = businesses.find(b => b.id === id);
      if (target) {
        triggerToast(`✨ Switched active organization to ${target.name}`);
        if (onBusinessChanged) onBusinessChanged(target);
      }
    }, 400);
  };

  // Handler to invite employee
  const handleInviteEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpEmail || !newEmpName) return;

    const defaultPerms: Record<string, string[]> = {
      'Manager': ['Process POS', 'Financial Ledger', 'Manage Staff'],
      'Cashier': ['Process POS'],
      'Accountant': ['Financial Ledger', 'File Taxes'],
      'Inventory Lead': ['Process POS', 'Edit Inventory']
    };

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      permissions: defaultPerms[newEmpRole] || ['Process POS'],
      status: 'INVITED',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setBusinesses(prev => prev.map(b => {
      if (b.id === activeBusinessId) {
        return { ...b, team: [...b.team, newEmp] };
      }
      return b;
    }));

    setNewEmpEmail('');
    setNewEmpName('');
    setShowInviteModal(false);
    triggerToast(`📩 Sent invitation to ${newEmpName} (${newEmpRole}) for ${activeBusiness.name}!`);
  };

  // Handler to create brand new business entity
  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName) return;

    const created: BusinessProfile = {
      id: `biz_${Date.now()}`,
      name: newBizName,
      tagline: newBizTagline || 'Modern Enterprise Operation',
      category: newBizCategory,
      currency: 'USD ($)',
      logoIcon: 'generic',
      revenue: 0,
      expenses: 0,
      inventoryCount: 0,
      communityMembers: 1,
      taxRatePercent: 8.0,
      taxYtd: 0,
      team: [
        { id: 'emp-owner', name: 'Felix Zinyenge', email: 'fzinyenge@gmail.com', role: 'Owner', permissions: ['Full Admin Access', 'Process POS', 'Financial Ledger', 'File Taxes', 'Manage Staff'], status: 'ACTIVE', joinedDate: new Date().toISOString().split('T')[0] }
      ],
      inventory: [],
      salesLedger: [],
      reports: [],
      communityPosts: []
    };

    setBusinesses(prev => [...prev, created]);
    setActiveBusinessId(created.id);
    setShowNewBizModal(false);
    setNewBizName('');
    setNewBizTagline('');
    triggerToast(`🎉 Business "${created.name}" created and loaded as active!`);
  };

  const getBusinessIcon = (iconType: string) => {
    switch (iconType) {
      case 'technology': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'clothing': return <Shirt className="w-5 h-5 text-purple-400" />;
      case 'printing': return <Printer className="w-5 h-5 text-cyan-400" />;
      default: return <Building2 className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-4 lg:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
      
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

      {/* Top Header & Fast Switcher Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg shrink-0">
            {getBusinessIcon(activeBusiness.logoIcon)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-slate-100">{activeBusiness.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE ORG
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{activeBusiness.tagline}</p>
          </div>
        </div>

        {/* Multi-Business Quick Switcher Ribbon */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold shrink-0 mr-1 hidden sm:inline">
            Switch Business:
          </span>

          {businesses.map(b => (
            <button
              key={b.id}
              onClick={() => handleSwitchBusiness(b.id)}
              className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeBusinessId === b.id 
                  ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
              }`}
            >
              {getBusinessIcon(b.logoIcon)}
              <span>{b.name}</span>
            </button>
          ))}

          {/* Add New Business Button */}
          <button
            onClick={() => setShowNewBizModal(true)}
            className="p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer shrink-0"
            title="Create New Business Entity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Switcher Workspace with Animated Transition */}
      <AnimatePresence mode="wait">
        {isSwitching ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="py-24 text-center space-y-3 font-mono text-xs text-emerald-400"
          >
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400" />
            <p className="font-bold">Switching Organization Context & Isolating Databases...</p>
          </motion.div>
        ) : (
          <motion.div 
            key={activeBusinessId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Business Section Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 text-xs font-bold">
              {[
                { id: 'OVERVIEW', label: 'Organization Overview', icon: Building2 },
                { id: 'TEAM', label: `Staff & Roles (${activeBusiness.team.length})`, icon: Users },
                { id: 'ACCOUNTING', label: 'Isolated Ledger', icon: DollarSign },
                { id: 'INVENTORY', label: `Stock (${activeBusiness.inventoryCount})`, icon: Package },
                { id: 'TAXES', label: 'Tax Filings', icon: ShieldCheck },
                { id: 'COMMUNITY', label: `Community (${activeBusiness.communityMembers})`, icon: Share2 },
                { id: 'REPORTS', label: 'Reports', icon: FileText },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 border border-slate-700 text-emerald-400 font-black shadow-inner' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW METRICS */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-6">
                
                {/* Key Business Summary Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Gross Revenue</span>
                    <p className="text-xl font-black text-emerald-400 font-mono">${activeBusiness.revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Isolated ledger accounting</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Operational Outlay</span>
                    <p className="text-xl font-black text-rose-400 font-mono">${activeBusiness.expenses.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Net Profit: ${(activeBusiness.revenue - activeBusiness.expenses).toLocaleString()}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Inventory SKU Items</span>
                    <p className="text-xl font-black text-slate-100 font-mono">{activeBusiness.inventoryCount} units</p>
                    <p className="text-[10px] text-slate-400">Dedicated warehouse catalog</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Active Staff Team</span>
                    <p className="text-xl font-black text-indigo-400 font-mono">{activeBusiness.team.length} Members</p>
                    <p className="text-[10px] text-slate-400">Role-based access controls</p>
                  </div>
                </div>

                {/* Organization Details Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Business Identity & Compliance Profile</h3>
                    <span className="text-xs font-mono text-slate-400">Tax Bracket: {activeBusiness.taxRatePercent}%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">Category:</span>
                      <span className="text-slate-200 font-bold">{activeBusiness.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Base Currency:</span>
                      <span className="text-slate-200 font-bold">{activeBusiness.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Est. Tax Obligations YTD:</span>
                      <span className="text-emerald-400 font-bold">${activeBusiness.taxYtd.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: TEAM & ROLE PERMISSIONS */}
            {activeTab === 'TEAM' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">
                      Staff & Employee Role-Based Access Controls
                    </h3>
                    <p className="text-xs text-slate-400">Employees added here are strictly bound to <strong>{activeBusiness.name}</strong> only.</p>
                  </div>

                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite Employee</span>
                  </button>
                </div>

                {/* Employees Roster Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Staff Member</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Assigned Role</th>
                        <th className="p-3">Active Permissions</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {activeBusiness.team.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-bold text-slate-200">{emp.name}</td>
                          <td className="p-3 text-slate-400">{emp.email}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-bold text-[10px]">
                              {emp.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {emp.permissions.map((p, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: ACCOUNTING & SALES LEDGER */}
            {activeTab === 'ACCOUNTING' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                    Isolated Accounting Ledger — {activeBusiness.name}
                  </h3>
                  <span className="text-emerald-400 font-bold">Total Sales: ${activeBusiness.salesLedger.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  {activeBusiness.salesLedger.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                      No sales records for this business entity yet.
                    </div>
                  ) : (
                    activeBusiness.salesLedger.map(s => (
                      <div key={s.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-200">{s.title}</h4>
                          <p className="text-[10px] text-slate-400">Client: {s.client} • Date: {s.date}</p>
                        </div>
                        <span className="text-sm font-black text-emerald-400">${s.amount.toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: ISOLATED INVENTORY */}
            {activeTab === 'INVENTORY' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                    Isolated Inventory Warehouse — {activeBusiness.name}
                  </h3>
                  <span className="text-slate-400">{activeBusiness.inventory.length} Catalog SKUs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeBusiness.inventory.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                      Inventory is empty for {activeBusiness.name}.
                    </div>
                  ) : (
                    activeBusiness.inventory.map(item => (
                      <div key={item.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-200">{item.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 text-emerald-400 font-bold text-[10px]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>Unit Price:</span>
                          <span className="text-slate-200 font-bold">${item.unitPrice}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: TAXES */}
            {activeTab === 'TAXES' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-black uppercase text-slate-200">Tax Schedule & AI Estimator</h3>
                  <span className="text-emerald-400 font-bold">Standard Rate: {activeBusiness.taxRatePercent}%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Estimated Corporate Tax Liability</span>
                    <p className="text-2xl font-black text-emerald-400">${activeBusiness.taxYtd.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Calculated on gross sales of ${activeBusiness.revenue.toLocaleString()}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Tax Deductible Expenses</span>
                    <p className="text-2xl font-black text-indigo-400">${activeBusiness.expenses.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Hardware outlays and operational clearance</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: COMMUNITY */}
            {activeTab === 'COMMUNITY' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-200">
                    Dedicated Customer Community ({activeBusiness.communityMembers} Followers)
                  </h3>
                </div>

                <div className="space-y-2">
                  {activeBusiness.communityPosts.map(post => (
                    <div key={post.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-200">{post.title}</h4>
                        <p className="text-[10px] text-slate-400">Author: {post.author}</p>
                      </div>
                      <div className="text-right space-x-2 text-[10px] text-emerald-400 font-bold">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: REPORTS */}
            {activeTab === 'REPORTS' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-200">
                    Generated Business Audit Reports
                  </h3>
                </div>

                <div className="space-y-2">
                  {activeBusiness.reports.map(rep => (
                    <div key={rep.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <div>
                          <h4 className="font-bold text-slate-200">{rep.title}</h4>
                          <p className="text-[10px] text-slate-400">{rep.type} • Created {rep.date}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => triggerToast(`📥 Downloaded ${rep.title}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-[10px] border border-slate-800 cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INVITE EMPLOYEE MODAL --- */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">
                Invite Staff Member to {activeBusiness.name}
              </h3>

              <form onSubmit={handleInviteEmployee} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Employee Full Name:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Email Address:</label>
                  <input 
                    type="email"
                    required
                    placeholder="employee@org.com"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Select Role Permission:</label>
                  <select
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="Manager">Store Manager (POS + Financials + Staff)</option>
                    <option value="Cashier">POS Cashier (Register Terminal Only)</option>
                    <option value="Accountant">Financial Accountant (Ledger + Tax Returns)</option>
                    <option value="Inventory Lead">Inventory Specialist (Stock Management)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Send Role Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- NEW BUSINESS ENTITY MODAL --- */}
      <AnimatePresence>
        {showNewBizModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">
                Create New Business Entity
              </h3>

              <form onSubmit={handleCreateBusiness} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Business / Brand Name:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Box Coffee Roasters"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tagline or Mission Statement:</label>
                  <input 
                    type="text"
                    placeholder="e.g. Specialty Artisanal Espresso & Cold Brews"
                    value={newBizTagline}
                    onChange={(e) => setNewBizTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Industry Sector:</label>
                  <input 
                    type="text"
                    value={newBizCategory}
                    onChange={(e) => setNewBizCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewBizModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Create Organization
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MultiBusinessManager;
