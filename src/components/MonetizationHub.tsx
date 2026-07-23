import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, Sparkles, Zap, CheckCircle2, DollarSign, 
  TrendingUp, Star, Award, Layers, Lock, Unlock, Gift, ArrowUpRight, 
  Smartphone, Apple, Play, BarChart3, RefreshCw, X, ChevronRight, 
  Sliders, Users, Check, AlertCircle, Percent, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type PlanId = 'FREE' | 'PREMIUM' | 'BUSINESS_PRO' | 'ENTERPRISE' | 'PREMIUM_AI';
export type PaymentGateway = 'STRIPE' | 'GOOGLE_PLAY' | 'APPLE_IAP';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  badge?: string;
  description: string;
  popular?: boolean;
  features: string[];
  gatedCapabilities: {
    maxBusinesses: number | 'Unlimited';
    aiPromptsPerMonth: number | 'Unlimited';
    posTerminals: number | 'Unlimited';
    ocrReceiptScans: number | 'Unlimited';
    section179Calculator: boolean;
    verificationBadgeEligible: boolean;
    creatorMonetizationAccess: boolean;
  };
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

export const availablePlans: SubscriptionPlan[] = [
  {
    id: 'FREE',
    name: 'Free Tier',
    priceMonthly: 0,
    priceAnnually: 0,
    description: 'Basic ledger & recommendation viewing for solo entrepreneurs.',
    features: [
      '1 Business entity management',
      '50 AI prompts / month',
      'Basic video shorts viewing (≤8m 30s)',
      'Standard community access',
      'Basic receipt OCR (10 scans/mo)'
    ],
    gatedCapabilities: {
      maxBusinesses: 1,
      aiPromptsPerMonth: 50,
      posTerminals: 1,
      ocrReceiptScans: 10,
      section179Calculator: false,
      verificationBadgeEligible: false,
      creatorMonetizationAccess: false
    }
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    priceMonthly: 29,
    priceAnnually: 290,
    badge: 'Popular for Founders',
    popular: true,
    description: 'Advanced tax optimization & unlimited book/video recommendations.',
    features: [
      '3 Business entities',
      '500 AI prompts / month',
      'Section 179 tax deduction calculator',
      'Infinite scroll ML video & book recommendations',
      '50 OCR receipt scans / mo',
      'Blue Verification Badge eligibility'
    ],
    gatedCapabilities: {
      maxBusinesses: 3,
      aiPromptsPerMonth: 500,
      posTerminals: 3,
      ocrReceiptScans: 50,
      section179Calculator: true,
      verificationBadgeEligible: true,
      creatorMonetizationAccess: false
    }
  },
  {
    id: 'BUSINESS_PRO',
    name: 'Business Pro',
    priceMonthly: 79,
    priceAnnually: 790,
    badge: 'Multi-Org Scale',
    description: 'Full multi-organization management, POS terminals & creator monetization.',
    features: [
      '10 Business entities',
      '2,500 AI prompts / month',
      'Unlimited POS terminals & quotes',
      'Full Creator Studio & revenue sharing (85/15)',
      'Gold & Green Verification Badge eligibility',
      'Dedicated CPA & Advisor Mentee network'
    ],
    gatedCapabilities: {
      maxBusinesses: 10,
      aiPromptsPerMonth: 2500,
      posTerminals: 'Unlimited',
      ocrReceiptScans: 'Unlimited',
      section179Calculator: true,
      verificationBadgeEligible: true,
      creatorMonetizationAccess: true
    }
  },
  {
    id: 'PREMIUM_AI',
    name: 'Premium AI',
    priceMonthly: 129,
    priceAnnually: 1290,
    badge: 'Neural Intelligence',
    description: 'Dedicated Antigravity AI agent, real-time ledger synthesis & predictive forecasting.',
    features: [
      'Unlimited AI Prompts & Deep Research',
      'Custom fine-tuned accounting models',
      'Real-time automated tax loss harvesting alerts',
      'Autonomous invoice & quote generation',
      'Priority neural ranker weights in ML feed'
    ],
    gatedCapabilities: {
      maxBusinesses: 'Unlimited',
      aiPromptsPerMonth: 'Unlimited',
      posTerminals: 'Unlimited',
      ocrReceiptScans: 'Unlimited',
      section179Calculator: true,
      verificationBadgeEligible: true,
      creatorMonetizationAccess: true
    }
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    priceMonthly: 299,
    priceAnnually: 2990,
    badge: 'Custom Corporate',
    description: 'Custom SLA, multi-region Cloud SQL database isolation & priority support.',
    features: [
      'Unlimited Everything across all entities',
      'Custom ERP & QuickBooks / Xero API sync',
      'Custom domain & white-label dashboard',
      'Dedicated Account Manager & Statutory CPA audit',
      'Custom Revenue Sharing terms for Creators'
    ],
    gatedCapabilities: {
      maxBusinesses: 'Unlimited',
      aiPromptsPerMonth: 'Unlimited',
      posTerminals: 'Unlimited',
      ocrReceiptScans: 'Unlimited',
      section179Calculator: true,
      verificationBadgeEligible: true,
      creatorMonetizationAccess: true
    }
  }
];

export const validCoupons: Coupon[] = [
  { code: 'MINTSTEP2026', discountPercent: 20, description: '20% Off any annual or monthly plan' },
  { code: 'TAXSAVER50', discountPercent: 50, description: '50% Off first month Premium AI' },
  { code: 'FOUNDERFREE', discountPercent: 100, description: '100% Off 30-day trial extension' }
];

export const MonetizationHub: React.FC = () => {
  // Subscription state
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>(() => {
    return (localStorage.getItem('mintstep_current_plan') as PlanId) || 'BUSINESS_PRO';
  });

  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUALLY'>('MONTHLY');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('STRIPE');
  
  // Free Trial state
  const [inTrialMode, setInTrialMode] = useState<boolean>(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(11);

  // Coupon state
  const [couponInput, setCouponInput] = useState<string>('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Creator Monetization State
  const [creatorEarnings, setCreatorEarnings] = useState({
    totalEarned: 12840.50,
    pendingPayout: 3420.00,
    subscribersCount: 420,
    platformFeeCut: 15 // %
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'PLANS' | 'REVENUE_DASHBOARD' | 'CREATOR_MONETIZATION' | 'GATING_MATRIX'>('PLANS');

  // Checkout Modal State
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<SubscriptionPlan | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  useEffect(() => {
    localStorage.setItem('mintstep_current_plan', currentPlanId);
  }, [currentPlanId]);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validCoupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (found) {
      setActiveCoupon(found);
      triggerToast(`🎉 Coupon "${found.code}" applied: ${found.discountPercent}% OFF!`);
    } else {
      triggerToast("❌ Invalid promo coupon code.");
    }
  };

  // Process Upgrade / Downgrade
  const handleConfirmSubscription = () => {
    if (!checkoutModalPlan) return;
    setCurrentPlanId(checkoutModalPlan.id);
    triggerToast(`⚡ Subscription updated to ${checkoutModalPlan.name} via ${selectedGateway}!`);
    setCheckoutModalPlan(null);
  };

  const calculateFinalPrice = (plan: SubscriptionPlan) => {
    let base = billingCycle === 'MONTHLY' ? plan.priceMonthly : plan.priceAnnually;
    if (activeCoupon) {
      base = Math.round(base * (1 - activeCoupon.discountPercent / 100));
    }
    return base;
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
            <CheckCircle2 className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep Monetization & Billing Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Multi-Gateway Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Stripe, Google Play & Apple IAP Billing, Creator Revenue Sharing, Feature Gating & Free Trials</p>
          </div>
        </div>

        {/* Current Active Plan Status Pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center space-x-3">
          <div>
            <span className="text-[10px] text-slate-500 block">Active Plan:</span>
            <span className="text-emerald-400 font-bold">{availablePlans.find(p => p.id === currentPlanId)?.name}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">Trial Status:</span>
            <span className="text-amber-400 font-bold">{inTrialMode ? `${trialDaysLeft} Days Remaining` : 'Full Active'}</span>
          </div>
        </div>
      </div>

      {/* Free Trial Banner */}
      {inTrialMode && (
        <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100">14-Day Free Trial Currently Active</h4>
              <p className="text-slate-400 text-[11px]">Enjoy full Business Pro & Premium AI capabilities risk-free. No commitment needed.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setInTrialMode(false);
              triggerToast("⚡ Trial converted to active recurring subscription.");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs transition-all cursor-pointer shrink-0 shadow-md"
          >
            Activate Full Billing Now
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'PLANS', label: 'Subscription Plans & Pricing', icon: Layers },
          { id: 'REVENUE_DASHBOARD', label: 'Revenue & Financial Analytics', icon: BarChart3 },
          { id: 'CREATOR_MONETIZATION', label: 'Creator Monetization & Payouts', icon: Users },
          { id: 'GATING_MATRIX', label: 'Feature Gating Matrix', icon: Lock },
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

      {/* ------------------- TAB 1: SUBSCRIPTION PLANS ------------------- */}
      {activeTab === 'PLANS' && (
        <div className="space-y-6">
          
          {/* Billing Cycle Toggle & Promo Code Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900 rounded-3xl border border-slate-800">
            
            {/* Billing Cycle Switch */}
            <div className="flex items-center space-x-3 text-xs font-bold font-mono">
              <span className={billingCycle === 'MONTHLY' ? 'text-emerald-400 font-black' : 'text-slate-400'}>Monthly</span>
              <button
                onClick={() => setBillingCycle(prev => prev === 'MONTHLY' ? 'ANNUALLY' : 'MONTHLY')}
                className="w-12 h-6 bg-slate-950 border border-slate-800 rounded-full p-1 cursor-pointer transition-colors relative"
              >
                <div className={`w-4 h-4 rounded-full bg-emerald-500 transition-transform ${billingCycle === 'ANNUALLY' ? 'translate-x-6' : ''}`} />
              </button>
              <div className="flex items-center space-x-1">
                <span className={billingCycle === 'ANNUALLY' ? 'text-emerald-400 font-black' : 'text-slate-400'}>Annual</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/30">
                  Save 17%
                </span>
              </div>
            </div>

            {/* Coupon Code Input Form */}
            <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2 text-xs font-mono">
              <input 
                type="text"
                placeholder="Enter Promo Code (e.g. MINTSTEP2026)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-100 uppercase focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
              >
                Apply
              </button>
            </form>

          </div>

          {/* Coupon Active Pill */}
          {activeCoupon && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-400 font-mono font-bold">
              <span>Applied Promo Code: {activeCoupon.code} ({activeCoupon.discountPercent}% Discount)</span>
              <button onClick={() => setActiveCoupon(null)} className="text-slate-400 hover:text-slate-100 cursor-pointer">Remove</button>
            </div>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map(plan => {
              const isCurrent = currentPlanId === plan.id;
              const displayPrice = calculateFinalPrice(plan);

              return (
                <div 
                  key={plan.id}
                  className={`bg-slate-900 rounded-3xl p-6 border space-y-5 flex flex-col justify-between transition-all relative ${
                    plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-slate-100">{plan.name}</h3>
                    <p className="text-xs text-slate-400 h-10 leading-relaxed">{plan.description}</p>

                    <div className="pt-2">
                      <span className="text-3xl font-black text-slate-100 font-mono">${displayPrice}</span>
                      <span className="text-xs text-slate-500 font-mono"> / {billingCycle === 'MONTHLY' ? 'month' : 'year'}</span>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-emerald-500/30 font-black text-xs cursor-default flex items-center justify-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Current Active Plan</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCheckoutModalPlan(plan)}
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center space-x-1 ${
                          plan.popular ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Upgrade to {plan.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ------------------- TAB 2: REVENUE DASHBOARD ------------------- */}
      {activeTab === 'REVENUE_DASHBOARD' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Monthly Recurring Revenue (MRR)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono block">$148,920.00</span>
              <span className="text-[10px] text-slate-500 font-mono">+18.4% from last month</span>
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Annual Run Rate (ARR)</span>
              <span className="text-2xl font-black text-indigo-400 font-mono block">$1,787,040.00</span>
              <span className="text-[10px] text-slate-500 font-mono">Paced to hit $2M targets</span>
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Active Subscribers</span>
              <span className="text-2xl font-black text-amber-400 font-mono block">3,420 Founders</span>
              <span className="text-[10px] text-slate-500 font-mono">98.2% retention rate</span>
            </div>

            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Platform Creator Fee Cut (15%)</span>
              <span className="text-2xl font-black text-cyan-400 font-mono block">$22,338.00</span>
              <span className="text-[10px] text-slate-500 font-mono">From premium creator shorts</span>
            </div>

          </div>

          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Payment Provider Gateway Processing Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-bold">Stripe Payments</span>
                </div>
                <p className="text-slate-400">Volume: $108,200 (72.6%)</p>
                <p className="text-[10px] text-slate-500">Cards, ACH & Apple Pay web</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Play className="w-5 h-5" />
                  <span className="font-bold">Google Play Billing</span>
                </div>
                <p className="text-slate-400">Volume: $24,100 (16.2%)</p>
                <p className="text-[10px] text-slate-500">Android app subscriptions</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-slate-200">
                  <Apple className="w-5 h-5" />
                  <span className="font-bold">Apple In-App Purchases</span>
                </div>
                <p className="text-slate-400">Volume: $16,620 (11.2%)</p>
                <p className="text-[10px] text-slate-500">iOS Store auto-renewable</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 3: CREATOR MONETIZATION ------------------- */}
      {activeTab === 'CREATOR_MONETIZATION' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Premium Creator Program & Revenue Share</h3>
                <p className="text-xs text-slate-400">Monetize your video shorts, executive book reviews & financial tips with 85/15 revenue split.</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                85% Creator Payout Rate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Total Revenue Earned:</span>
                <span className="text-emerald-400 font-bold text-xl">${creatorEarnings.totalEarned.toLocaleString()}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Pending Payout (Stripe Connect):</span>
                <span className="text-amber-400 font-bold text-xl">${creatorEarnings.pendingPayout.toLocaleString()}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Active Paid Subscribers:</span>
                <span className="text-indigo-400 font-bold text-xl">{creatorEarnings.subscribersCount} Members</span>
              </div>
            </div>

            <button
              onClick={() => triggerToast("💸 Requested Stripe Instant Payout of $3,420.00!")}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <DollarSign className="w-4 h-4" />
              <span>Withdraw Pending Payout to Bank Account</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------- TAB 4: FEATURE GATING MATRIX ------------------- */}
      {activeTab === 'GATING_MATRIX' && (
        <div className="overflow-x-auto bg-slate-900 rounded-3xl border border-slate-800 p-6 font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="p-3">Capability / Feature</th>
                <th className="p-3">Free</th>
                <th className="p-3">Premium</th>
                <th className="p-3">Business Pro</th>
                <th className="p-3 text-amber-400">Premium AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr>
                <td className="p-3 font-bold font-sans">Business Entities</td>
                <td className="p-3">1 Entity</td>
                <td className="p-3">3 Entities</td>
                <td className="p-3">10 Entities</td>
                <td className="p-3 text-emerald-400 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-sans">AI Prompts / Month</td>
                <td className="p-3">50</td>
                <td className="p-3">500</td>
                <td className="p-3">2,500</td>
                <td className="p-3 text-emerald-400 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-sans">Section 179 Calculator</td>
                <td className="p-3 text-rose-400">Locked</td>
                <td className="p-3 text-emerald-400">Unlocked</td>
                <td className="p-3 text-emerald-400">Unlocked</td>
                <td className="p-3 text-emerald-400 font-bold">Unlocked</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-sans">Verification Badge Eligibility</td>
                <td className="p-3 text-rose-400">None</td>
                <td className="p-3 text-blue-400">Blue Badge</td>
                <td className="p-3 text-amber-400">Gold & Green Badges</td>
                <td className="p-3 text-emerald-400 font-bold">All Badges</td>
              </tr>
              <tr>
                <td className="p-3 font-bold font-sans">Creator Monetization</td>
                <td className="p-3 text-rose-400">Disabled</td>
                <td className="p-3 text-rose-400">Disabled</td>
                <td className="p-3 text-emerald-400">85/15 Revenue Split</td>
                <td className="p-3 text-emerald-400 font-bold">90/10 Premium Split</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* --- CHECKOUT MODAL WITH PROVIDER SELECTION --- */}
      <AnimatePresence>
        {checkoutModalPlan && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative"
            >
              <button 
                onClick={() => setCheckoutModalPlan(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Checkout Subscription</span>
                <h3 className="text-lg font-black text-slate-100">{checkoutModalPlan.name} Plan</h3>
                <p className="text-xs text-slate-400 font-mono">${calculateFinalPrice(checkoutModalPlan)} / {billingCycle === 'MONTHLY' ? 'month' : 'year'}</p>
              </div>

              {/* Payment Gateway Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 block">Select Payment Provider:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'STRIPE', name: 'Stripe', icon: CreditCard },
                    { id: 'GOOGLE_PLAY', name: 'Google Play', icon: Play },
                    { id: 'APPLE_IAP', name: 'Apple Pay', icon: Apple },
                  ].map(gw => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGateway(gw.id as PaymentGateway)}
                      className={`p-3 rounded-2xl border transition-all text-center space-y-1 cursor-pointer ${
                        selectedGateway === gw.id 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <gw.icon className="w-5 h-5 mx-auto" />
                      <span className="text-[10px] block font-mono">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmSubscription}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 fill-slate-950" />
                <span>Confirm Payment via {selectedGateway}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MonetizationHub;
