import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, Award, FileText, Upload, UserCheck, 
  Building2, GraduationCap, Calculator, Sparkles, AlertCircle, Clock, 
  MessageSquare, Video, Users, Eye, X, ChevronRight, FileCheck, RefreshCw, 
  Search, Filter, ExternalLink, ShieldAlert, BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type UserRoleType = 'Business' | 'Advisor' | 'Accountant' | 'Financial Creator';
export type BadgeTier = 'Blue' | 'Gold' | 'Green';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING_DOCS' | 'UNDER_MANUAL_REVIEW' | 'APPROVED' | 'DECLINED';

export interface VerificationRequest {
  id: string;
  applicantName: string;
  applicantRole: UserRoleType;
  businessName?: string;
  targetBadge: BadgeTier;
  submittedAt: string;
  status: VerificationStatus;
  identityDocName?: string;
  businessDocName?: string;
  licenseNumber?: string;
  reviewerNotes?: string;
}

export interface MockFeedItem {
  id: string;
  authorName: string;
  authorRole: UserRoleType;
  badge: BadgeTier;
  type: 'PROFILE' | 'COMMENT' | 'VIDEO' | 'COMMUNITY_POST';
  titleOrContent: string;
  timeAgo: string;
  videoDuration?: string;
}

export const initialRequests: VerificationRequest[] = [
  {
    id: 'ver-801',
    applicantName: 'Felix Zinyenge',
    applicantRole: 'Business',
    businessName: 'Box Technologies LLC',
    targetBadge: 'Gold',
    submittedAt: '2026-07-21 @ 14:30 UTC',
    status: 'APPROVED',
    identityDocName: 'passport_felix_zinyenge.pdf',
    businessDocName: 'cert_of_incorporation_box_tech.pdf',
    licenseNumber: 'TAX-REG-9948201',
    reviewerNotes: 'Corporate documents match state register. IRS Section 179 compliance confirmed.'
  },
  {
    id: 'ver-802',
    applicantName: 'Elena Rostova',
    applicantRole: 'Accountant',
    businessName: 'Rostova Global Audit',
    targetBadge: 'Green',
    submittedAt: '2026-07-22 @ 01:15 UTC',
    status: 'UNDER_MANUAL_REVIEW',
    identityDocName: 'drivers_license_elena.pdf',
    businessDocName: 'cpa_license_eu_statutory.pdf',
    licenseNumber: 'CPA-EU-772109',
    reviewerNotes: 'Manual review in progress. Verifying European Union statutory auditor registry.'
  },
  {
    id: 'ver-803',
    applicantName: 'Mia Thorne',
    applicantRole: 'Financial Creator',
    businessName: 'The Box Clothing',
    targetBadge: 'Blue',
    submittedAt: '2026-07-20 @ 18:45 UTC',
    status: 'APPROVED',
    identityDocName: 'national_id_mia.pdf',
    businessDocName: 'dtc_apparel_brand_registry.pdf',
    reviewerNotes: 'Identity check passed liveness 99.4%. Social presence verified.'
  }
];

export const mockFeedItems: MockFeedItem[] = [
  {
    id: 'feed-1',
    authorName: 'Felix Zinyenge',
    authorRole: 'Business',
    badge: 'Gold',
    type: 'PROFILE',
    titleOrContent: 'Box Technologies LLC • Enterprise Edge Hardware & Distributed Financial Ledgers',
    timeAgo: 'Verified Partner'
  },
  {
    id: 'feed-2',
    authorName: 'Elena Rostova',
    authorRole: 'Accountant',
    badge: 'Green',
    type: 'COMMENT',
    titleOrContent: '"Make sure to file Form 4562 for depreciation & Section 179 property write-offs prior to fiscal quarter close."',
    timeAgo: '12m ago'
  },
  {
    id: 'feed-3',
    authorName: 'Mia Thorne',
    authorRole: 'Financial Creator',
    badge: 'Blue',
    type: 'VIDEO',
    titleOrContent: 'Scaling DTC Apparel Margins from 30% to 68% with Wholesale Inventory Controls',
    timeAgo: '1h ago',
    videoDuration: '6m 15s'
  },
  {
    id: 'feed-4',
    authorName: 'Box Technologies',
    authorRole: 'Business',
    badge: 'Gold',
    type: 'COMMUNITY_POST',
    titleOrContent: 'Q3 Shenzhen Supply Chain Component Buying Consortium now open for registered hardware founders.',
    timeAgo: '3h ago'
  }
];

export const VerificationSystem: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>(() => {
    const saved = localStorage.getItem('mintstep_verification_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialRequests;
  });

  const [activeTab, setActiveTab] = useState<'WORKFLOW' | 'PREVIEW' | 'ADMIN_REVIEW'>('WORKFLOW');

  // Request Form Workflow State
  const [roleType, setRoleType] = useState<UserRoleType>('Business');
  const [applicantNameInput, setApplicantNameInput] = useState<string>('Felix Zinyenge');
  const [businessNameInput, setBusinessNameInput] = useState<string>('Box Technologies');
  const [licenseInput, setLicenseInput] = useState<string>('TAX-REG-9948201');
  
  // Uploaded mock files
  const [idFileUploaded, setIdFileUploaded] = useState<boolean>(false);
  const [bizFileUploaded, setBizFileUploaded] = useState<boolean>(false);

  // Modal Review
  const [selectedRequestForReview, setSelectedRequestForReview] = useState<VerificationRequest | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  useEffect(() => {
    localStorage.setItem('mintstep_verification_requests', JSON.stringify(requests));
  }, [requests]);

  // Determine Target Badge automatically based on role selection
  const getBadgeForRole = (role: UserRoleType): BadgeTier => {
    switch (role) {
      case 'Business': return 'Gold';
      case 'Accountant': return 'Green';
      case 'Advisor': return 'Blue';
      case 'Financial Creator': return 'Blue';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFileUploaded || !bizFileUploaded) {
      triggerToast("⚠️ Please upload both Identity and Business/License documents.");
      return;
    }

    const badge = getBadgeForRole(roleType);
    const newReq: VerificationRequest = {
      id: `ver-${Date.now()}`,
      applicantName: applicantNameInput,
      applicantRole: roleType,
      businessName: businessNameInput,
      targetBadge: badge,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'UNDER_MANUAL_REVIEW',
      identityDocName: 'identity_verification_gov_id.pdf',
      businessDocName: 'tax_incorporation_regulatory_license.pdf',
      licenseNumber: licenseInput,
      reviewerNotes: 'Queued for manual audit review.'
    };

    setRequests(prev => [newReq, ...prev]);
    triggerToast(`✅ Verification request submitted for ${badge} Badge! Status: Under Manual Review.`);
    setIdFileUploaded(false);
    setBizFileUploaded(false);
    setActiveTab('ADMIN_REVIEW');
  };

  const handleAdminApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? {
      ...r,
      status: 'APPROVED',
      reviewerNotes: 'Manual review passed. Identity verified & business registration authenticated.'
    } : r));
    triggerToast("🏆 Approved Verification Request & Issued Official Badge!");
    setSelectedRequestForReview(null);
  };

  const handleAdminDecline = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? {
      ...r,
      status: 'DECLINED',
      reviewerNotes: 'Declined due to unverified regulatory license number.'
    } : r));
    triggerToast("❌ Declined verification request.");
    setSelectedRequestForReview(null);
  };

  const renderBadgePill = (badge: BadgeTier) => {
    switch (badge) {
      case 'Blue':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-black uppercase">
            <BadgeCheck className="w-3.5 h-3.5 fill-blue-500 text-slate-950" />
            <span>Blue Verified</span>
          </span>
        );
      case 'Gold':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-black uppercase">
            <BadgeCheck className="w-3.5 h-3.5 fill-amber-400 text-slate-950" />
            <span>Gold Enterprise</span>
          </span>
        );
      case 'Green':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black uppercase">
            <BadgeCheck className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />
            <span>Green Certified CPA</span>
          </span>
        );
    }
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
            <ShieldCheck className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-emerald-400 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep Official Verification System</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                Multi-Tier Identity & Compliance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Verified Badges (Blue, Gold, Green) for Businesses, Advisors, Certified Accountants & Financial Creators</p>
          </div>
        </div>

        {/* Global Stats Pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center space-x-3">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">Blue Verified</span>
            <span className="text-blue-400 font-bold">Creators & Advisors</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">Gold Verified</span>
            <span className="text-amber-400 font-bold">Enterprise Corp</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">Green Certified</span>
            <span className="text-emerald-400 font-bold">Statutory CPAs</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'WORKFLOW', label: 'Submit Verification Request', icon: FileCheck },
          { id: 'PREVIEW', label: 'Live Badges Preview Across Platform', icon: Eye },
          { id: 'ADMIN_REVIEW', label: `Manual Review Audit Queue (${requests.filter(r => r.status === 'UNDER_MANUAL_REVIEW').length})`, icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === tab.id 
                ? 'bg-blue-500 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------- TAB 1: VERIFICATION REQUEST WORKFLOW ------------------- */}
      {activeTab === 'WORKFLOW' && (
        <div className="space-y-6">
          
          {/* Badge Tiers Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Blue Badge */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-blue-400 uppercase font-mono">Blue Badge</span>
                <BadgeCheck className="w-5 h-5 fill-blue-500 text-slate-950" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Advisors & Creators</h3>
              <p className="text-xs text-slate-400 leading-relaxed">For verified individual mentors, thought leaders, and financial content creators.</p>
            </div>

            {/* Gold Badge */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-amber-400 uppercase font-mono">Gold Badge</span>
                <BadgeCheck className="w-5 h-5 fill-amber-400 text-slate-950" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Registered Enterprise Business</h3>
              <p className="text-xs text-slate-400 leading-relaxed">For legally incorporated businesses, LLCs, and corporations with Section 179 clearance.</p>
            </div>

            {/* Green Badge */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-400 uppercase font-mono">Green Badge</span>
                <BadgeCheck className="w-5 h-5 fill-emerald-500 text-slate-950" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Certified Accountant / CPA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">For licensed CPAs, tax auditors, and certified corporate accountants.</p>
            </div>

          </div>

          {/* Verification Application Form */}
          <form onSubmit={handleFormSubmit} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 lg:p-8 space-y-6">
            
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Verification Request Form</h3>
                <p className="text-xs text-slate-400">Complete required identity & business document checks for manual audit</p>
              </div>

              {renderBadgePill(getBadgeForRole(roleType))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              
              {/* User Role Selection */}
              <div>
                <label className="text-slate-400 block mb-1 uppercase font-bold">I am applying as a:</label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value as UserRoleType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                >
                  <option value="Business">Business (Gold Badge)</option>
                  <option value="Advisor">Advisor (Blue Badge)</option>
                  <option value="Accountant">Certified Accountant (Green Badge)</option>
                  <option value="Financial Creator">Financial Creator (Blue Badge)</option>
                </select>
              </div>

              {/* Applicant Name */}
              <div>
                <label className="text-slate-400 block mb-1 uppercase font-bold">Applicant Full Legal Name:</label>
                <input 
                  type="text"
                  required
                  value={applicantNameInput}
                  onChange={(e) => setApplicantNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="text-slate-400 block mb-1 uppercase font-bold">Organization / Firm Name:</label>
                <input 
                  type="text"
                  required
                  value={businessNameInput}
                  onChange={(e) => setBusinessNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Registration or License Number */}
              <div>
                <label className="text-slate-400 block mb-1 uppercase font-bold">Tax Reg / CPA License ID:</label>
                <input 
                  type="text"
                  required
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Document Upload Zone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Identity Document */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                <UserCheck className="w-6 h-6 text-blue-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-200">1. Passport / Government ID</h4>
                <p className="text-[10px] text-slate-500 font-mono">Liveness facial scan & official ID upload</p>
                
                <button
                  type="button"
                  onClick={() => {
                    setIdFileUploaded(true);
                    triggerToast("📄 Passport & Liveness check uploaded successfully!");
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    idFileUploaded ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {idFileUploaded ? '✓ Identity ID Verified' : 'Upload Passport / Driver License'}
                </button>
              </div>

              {/* Business / CPA License Document */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                <FileText className="w-6 h-6 text-amber-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-200">2. Incorporation or License Doc</h4>
                <p className="text-[10px] text-slate-500 font-mono">Articles of incorporation or CPA audit license</p>

                <button
                  type="button"
                  onClick={() => {
                    setBizFileUploaded(true);
                    triggerToast("📄 Regulatory document uploaded successfully!");
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    bizFileUploaded ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {bizFileUploaded ? '✓ Regulatory Document Uploaded' : 'Upload Registration Document'}
                </button>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 fill-slate-950" />
              <span>Submit for Manual Audit Review</span>
            </button>

          </form>

        </div>
      )}

      {/* ------------------- TAB 2: LIVE BADGES DISPLAY PREVIEW ------------------- */}
      {activeTab === 'PREVIEW' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Multi-Surface Verification Display Preview</h3>
            <p className="text-xs text-slate-400">See how Blue, Gold & Green badges render across Profiles, Comments, Video Shorts & Community Posts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockFeedItems.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-100 text-sm">{item.authorName}</span>
                    {renderBadgePill(item.badge)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timeAgo}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-200 font-sans">
                  {item.titleOrContent}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                  <span>Surface: {item.type}</span>
                  {item.videoDuration && <span>Duration: {item.videoDuration}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB 3: MANUAL REVIEW AUDIT QUEUE ------------------- */}
      {activeTab === 'ADMIN_REVIEW' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase text-slate-200">Manual Compliance Audit Queue</h3>
              <span className="text-slate-400">{requests.length} Total Verification Submissions</span>
            </div>

            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-100 text-sm font-sans">{req.applicantName}</h4>
                      {renderBadgePill(req.targetBadge)}
                    </div>
                    <p className="text-slate-400">Role: {req.applicantRole} • Firm: {req.businessName}</p>
                    <p className="text-[10px] text-slate-500">License: {req.licenseNumber} • Submitted: {req.submittedAt}</p>
                    {req.reviewerNotes && <p className="text-[11px] text-blue-400 font-sans italic">"{req.reviewerNotes}"</p>}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {req.status === 'UNDER_MANUAL_REVIEW' ? (
                      <>
                        <button
                          onClick={() => handleAdminApprove(req.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md"
                        >
                          Approve Badge
                        </button>
                        <button
                          onClick={() => handleAdminDecline(req.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 font-bold cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-xl font-bold text-xs ${
                        req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        Status: {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VerificationSystem;
