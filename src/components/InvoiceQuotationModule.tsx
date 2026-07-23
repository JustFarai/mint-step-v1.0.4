import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, Download, Share2, Mail, MessageSquare, 
  Printer, Copy, RefreshCw, CheckCircle2, Clock, AlertCircle, DollarSign, 
  Trash2, Edit3, Eye, Sparkles, Send, Calendar, Building2, User, ChevronRight, 
  Repeat, ArrowRight, ShieldCheck, PieChart, Layers, Check, X, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export type DocType = 'INVOICE' | 'QUOTATION';
export type DocStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT' | 'CONVERTED';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceDoc {
  id: string;
  docType: DocType;
  number: string; // e.g. INV-2026-001 or QT-2026-001
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  clientPhone: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  taxPercent: number;
  totalAmount: number;
  notes: string;
  status: DocStatus;
  isRecurring: boolean;
  recurringFrequency?: 'MONTHLY' | 'QUARTERLY' | 'WEEKLY';
  templateStyle: 'STRIPE' | 'QUICKBOOKS' | 'ENTERPRISE';
  companyLogoUrl?: string;
  createdAt: string;
}

export const InvoiceQuotationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'LIST' | 'CREATE'>('LIST');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // --- Initial Mock Invoices & Quotes ---
  const [documents, setDocuments] = useState<InvoiceDoc[]>([
    {
      id: 'doc-1',
      docType: 'INVOICE',
      number: 'INV-2026-089',
      clientName: 'Sarah Jenkins',
      clientEmail: 'sarah@apexventures.com',
      clientCompany: 'Apex Ventures Corp',
      clientPhone: '+1 (555) 019-2831',
      issueDate: '2026-07-01',
      dueDate: '2026-07-16',
      paymentTerms: 'Net 15',
      currency: 'USD',
      items: [
        { id: 'i1', description: 'Enterprise Cloud Architecture Audit', quantity: 1, unitPrice: 8500, totalPrice: 8500 },
        { id: 'i2', description: 'Section 179 Tax Optimization Consultation', quantity: 2, unitPrice: 1500, totalPrice: 3000 }
      ],
      subtotal: 11500,
      discountPercent: 5,
      taxPercent: 8.25,
      totalAmount: 11825.06,
      notes: 'Thank you for your business. Please remit payment via ACH or Wire transfer.',
      status: 'PAID',
      isRecurring: true,
      recurringFrequency: 'MONTHLY',
      templateStyle: 'STRIPE',
      companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      createdAt: '2026-07-01T10:00:00Z'
    },
    {
      id: 'doc-2',
      docType: 'QUOTATION',
      number: 'QT-2026-042',
      clientName: 'Michael Chang',
      clientEmail: 'm.chang@quantumtech.io',
      clientCompany: 'Quantum Tech Solutions',
      clientPhone: '+1 (555) 438-9901',
      issueDate: '2026-07-15',
      dueDate: '2026-08-15',
      paymentTerms: 'Net 30',
      currency: 'USD',
      items: [
        { id: 'i3', description: 'AI Agent System Custom Integration', quantity: 1, unitPrice: 15000, totalPrice: 15000 },
        { id: 'i4', description: 'Multi-Region Firestore Backup setup', quantity: 1, unitPrice: 3500, totalPrice: 3500 }
      ],
      subtotal: 18500,
      discountPercent: 0,
      taxPercent: 8.25,
      totalAmount: 20026.25,
      notes: 'Quotation valid for 30 calendar days from issue date.',
      status: 'PENDING',
      isRecurring: false,
      templateStyle: 'QUICKBOOKS',
      createdAt: '2026-07-15T14:30:00Z'
    },
    {
      id: 'doc-3',
      docType: 'INVOICE',
      number: 'INV-2026-078',
      clientName: 'Elena Rostova',
      clientEmail: 'elena@berlinglobal.de',
      clientCompany: 'Berlin Global Logistics',
      clientPhone: '+49 30 123456',
      issueDate: '2026-06-10',
      dueDate: '2026-06-25',
      paymentTerms: 'Net 15',
      currency: 'EUR',
      items: [
        { id: 'i5', description: 'Cross-Border VAT Compliance Setup', quantity: 1, unitPrice: 4200, totalPrice: 4200 }
      ],
      subtotal: 4200,
      discountPercent: 0,
      taxPercent: 19,
      totalAmount: 4998,
      notes: 'Invoice overdue by 26 days. Overdue penalty applies after 30 days.',
      status: 'OVERDUE',
      isRecurring: false,
      templateStyle: 'ENTERPRISE',
      createdAt: '2026-06-10T09:12:00Z'
    }
  ]);

  // Selected Document Preview Modal
  const [previewDoc, setPreviewDoc] = useState<InvoiceDoc | null>(null);

  // New Document State Form
  const [formData, setFormData] = useState<InvoiceDoc>({
    id: `doc-${Date.now()}`,
    docType: 'INVOICE',
    number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientPhone: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    paymentTerms: 'Net 15',
    currency: 'USD',
    items: [
      { id: `item-1`, description: 'Professional Consulting Services', quantity: 1, unitPrice: 1500, totalPrice: 1500 }
    ],
    subtotal: 1500,
    discountPercent: 0,
    taxPercent: 8.25,
    totalAmount: 1623.75,
    notes: 'Payment due within terms. Thank you for working with MintStep.',
    status: 'DRAFT',
    isRecurring: false,
    recurringFrequency: 'MONTHLY',
    templateStyle: 'STRIPE',
    companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  });

  // --- Dynamic Calculations for Form ---
  const recalculateTotals = (items: InvoiceItem[], disc: number, tax: number) => {
    const sub = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const discounted = sub * (1 - disc / 100);
    const total = discounted * (1 + tax / 100);
    return {
      subtotal: +sub.toFixed(2),
      totalAmount: +total.toFixed(2)
    };
  };

  const handleLineItemChange = (id: string, field: keyof InvoiceItem, val: any) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          newItem.totalPrice = +(newItem.quantity * newItem.unitPrice).toFixed(2);
        }
        return newItem;
      }
      return item;
    });

    const { subtotal, totalAmount } = recalculateTotals(updatedItems, formData.discountPercent, formData.taxPercent);
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      totalAmount
    });
  };

  const handleAddLineItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'New Line Item',
      quantity: 1,
      unitPrice: 250,
      totalPrice: 250
    };
    const updatedItems = [...formData.items, newItem];
    const { subtotal, totalAmount } = recalculateTotals(updatedItems, formData.discountPercent, formData.taxPercent);
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      totalAmount
    });
  };

  const handleDeleteLineItem = (id: string) => {
    const updatedItems = formData.items.filter(item => item.id !== id);
    const { subtotal, totalAmount } = recalculateTotals(updatedItems, formData.discountPercent, formData.taxPercent);
    setFormData({
      ...formData,
      items: updatedItems,
      subtotal,
      totalAmount
    });
  };

  // --- Save / Create Action ---
  const handleSaveDocument = (statusToSave: DocStatus) => {
    const docToSave: InvoiceDoc = {
      ...formData,
      status: statusToSave
    };

    setDocuments(prev => [docToSave, ...prev]);
    triggerToast(statusToSave === 'DRAFT' ? '💾 Draft saved successfully!' : '🚀 Document issued & published!');
    setActiveTab('LIST');
  };

  // --- Duplicate Action ---
  const handleDuplicate = (doc: InvoiceDoc) => {
    const duplicated: InvoiceDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      number: doc.docType === 'INVOICE' ? `INV-2026-${Math.floor(100 + Math.random() * 900)}` : `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    };
    setDocuments(prev => [duplicated, ...prev]);
    triggerToast(`📋 Duplicated ${doc.number} as new draft!`);
  };

  // --- Convert Quote to Invoice ---
  const handleConvertQuoteToInvoice = (quoteDoc: InvoiceDoc) => {
    const convertedInvoice: InvoiceDoc = {
      ...quoteDoc,
      id: `doc-${Date.now()}`,
      docType: 'INVOICE',
      number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'PENDING',
      notes: `Converted from Quotation ${quoteDoc.number}. Payment due as agreed.`,
      createdAt: new Date().toISOString()
    };

    // Update original quote status
    setDocuments(prev => prev.map(d => d.id === quoteDoc.id ? { ...d, status: 'CONVERTED' } : d));
    setDocuments(prev => [convertedInvoice, ...prev]);
    triggerToast(`⚡ Quotation ${quoteDoc.number} converted into Invoice ${convertedInvoice.number}!`);
  };

  // --- Toggle Mark as Paid ---
  const handleMarkAsPaid = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'PAID' } : d));
    triggerToast("💰 Invoice marked as PAID!");
  };

  // --- Analytics Aggregations ---
  const totalPaidRevenue = documents.filter(d => d.status === 'PAID').reduce((a, b) => a + b.totalAmount, 0);
  const totalPendingBalance = documents.filter(d => d.status === 'PENDING').reduce((a, b) => a + b.totalAmount, 0);
  const totalOverdueBalance = documents.filter(d => d.status === 'OVERDUE').reduce((a, b) => a + b.totalAmount, 0);

  const chartBillingTrends = [
    { name: 'Paid Revenue', amount: Math.round(totalPaidRevenue), color: '#10b981' },
    { name: 'Pending', amount: Math.round(totalPendingBalance), color: '#06b6d4' },
    { name: 'Overdue', amount: Math.round(totalOverdueBalance), color: '#f43f5e' },
  ];

  // Filtered List
  const filteredDocs = documents.filter(d => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || d.docType === typeFilter;
    const matchesSearch = d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
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
            <FileText className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Invoice & Quotation Management Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Stripe & QuickBooks Templates
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Recurring Invoicing, 1-Click Quote Conversion, Email/WhatsApp Sharing & PDF Generation</p>
          </div>
        </div>

        {/* Global Create CTA */}
        <button
          onClick={() => setActiveTab('CREATE')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Invoice / Quote</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('LIST')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'LIST' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Documents ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'ANALYTICS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Billing Analytics
        </button>

        <button
          onClick={() => setActiveTab('CREATE')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'CREATE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          + Create New
        </button>
      </div>

      {/* ------------------- TAB 1: DOCUMENT LIST ------------------- */}
      {activeTab === 'LIST' && (
        <div className="space-y-6">
          
          {/* KPI Mini Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Paid Revenue</span>
              <div className="text-xl font-black text-emerald-400 font-mono">${totalPaidRevenue.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Pending Collection</span>
              <div className="text-xl font-black text-cyan-400 font-mono">${totalPendingBalance.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Overdue Outstanding</span>
              <div className="text-xl font-black text-rose-400 font-mono">${totalOverdueBalance.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Active Recurring</span>
              <div className="text-xl font-black text-indigo-400 font-mono">{documents.filter(d => d.isRecurring).length} Profiles</div>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search client, company or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Document Types</option>
                <option value="INVOICE">Invoices Only</option>
                <option value="QUOTATION">Quotations Only</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                        doc.docType === 'INVOICE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {doc.docType}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200">{doc.number}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      doc.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      doc.status === 'PENDING' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                      doc.status === 'OVERDUE' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h3 className="text-sm font-black text-slate-100 truncate">{doc.clientName}</h3>
                    <p className="text-xs text-slate-400 truncate">{doc.clientCompany}</p>
                  </div>

                  <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Due Date:</span>
                      <span className="text-slate-200">{doc.dueDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Template:</span>
                      <span className="text-slate-300 font-bold">{doc.templateStyle}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-emerald-400 pt-2 border-t border-slate-800">
                      <span>Total Amount:</span>
                      <span>${doc.totalAmount.toLocaleString()} {doc.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDuplicate(doc)}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Duplicate</span>
                    </button>
                  </div>

                  {/* Special Context Actions */}
                  {doc.docType === 'QUOTATION' && doc.status !== 'CONVERTED' && (
                    <button
                      onClick={() => handleConvertQuoteToInvoice(doc)}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Convert to Invoice</span>
                    </button>
                  )}

                  {doc.docType === 'INVOICE' && doc.status === 'PENDING' && (
                    <button
                      onClick={() => handleMarkAsPaid(doc.id)}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                      <span>Mark as Paid</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ------------------- TAB 2: CREATE / EDIT DOCUMENT ------------------- */}
      {activeTab === 'CREATE' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Create New Financial Document</h3>
              <p className="text-xs text-slate-400">Configure client details, line items, tax rate, and template branding</p>
            </div>

            {/* Document Type Switcher */}
            <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setFormData({ ...formData, docType: 'INVOICE', number: `INV-2026-${Math.floor(100 + Math.random() * 900)}` })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formData.docType === 'INVOICE' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Invoice
              </button>
              <button
                onClick={() => setFormData({ ...formData, docType: 'QUOTATION', number: `QT-2026-${Math.floor(100 + Math.random() * 900)}` })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formData.docType === 'QUOTATION' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                Quotation
              </button>
            </div>
          </div>

          {/* Form Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Document Number</label>
              <input 
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Template Style</label>
              <select
                value={formData.templateStyle}
                onChange={(e) => setFormData({ ...formData, templateStyle: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="STRIPE">Stripe Minimalist</option>
                <option value="QUICKBOOKS">QuickBooks Corporate</option>
                <option value="ENTERPRISE">Enterprise Midnight</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="ZAR">ZAR (R)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Client Billing Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <input 
                type="text"
                placeholder="Client Contact Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />

              <input 
                type="email"
                placeholder="Client Email Address"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />

              <input 
                type="text"
                placeholder="Company / Organization Name"
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />

              <input 
                type="text"
                placeholder="Phone Number"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Line Items Builder Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Services & Line Items</h4>
              <button
                onClick={handleAddLineItem}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item) => (
                <div key={item.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs">
                  <input 
                    type="text"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                    className="col-span-6 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(item.id, 'quantity', +e.target.value)}
                    className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 font-bold font-mono text-center focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(item.id, 'unitPrice', +e.target.value)}
                    className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-emerald-400 font-bold font-mono text-right focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleDeleteLineItem(item.id)}
                    className="col-span-1 text-slate-500 hover:text-rose-400 transition-colors flex justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & Discounts Math Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>${formData.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Discount (%):</span>
              <input 
                type="number"
                value={formData.discountPercent}
                onChange={(e) => {
                  const disc = +e.target.value;
                  const { subtotal, totalAmount } = recalculateTotals(formData.items, disc, formData.taxPercent);
                  setFormData({ ...formData, discountPercent: disc, subtotal, totalAmount });
                }}
                className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-right text-slate-200 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Tax Rate (%):</span>
              <input 
                type="number"
                value={formData.taxPercent}
                onChange={(e) => {
                  const tax = +e.target.value;
                  const { subtotal, totalAmount } = recalculateTotals(formData.items, formData.discountPercent, tax);
                  setFormData({ ...formData, taxPercent: tax, subtotal, totalAmount });
                }}
                className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-right text-slate-200 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-between text-sm font-black text-emerald-400 pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span>${formData.totalAmount.toFixed(2)} {formData.currency}</span>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => handleSaveDocument('DRAFT')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              onClick={() => handleSaveDocument('PENDING')}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>Publish & Send Document</span>
            </button>
          </div>

        </div>
      )}

      {/* ------------------- PREVIEW MODAL & PDF PREVIEW ------------------- */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setPreviewDoc(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* PDF Preview Printable Sheet */}
              <div className="bg-white text-slate-900 p-8 rounded-2xl space-y-6 shadow-xl border border-slate-200 font-sans">
                {/* PDF Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950 tracking-tight uppercase">{previewDoc.docType}</h2>
                    <p className="text-xs text-slate-500 font-mono font-bold mt-1">Ref: {previewDoc.number}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-lg font-black tracking-tight text-emerald-600 block">MintStep Inc.</span>
                    <p className="text-[11px] text-slate-500">100 Enterprise Way, Suite 400</p>
                    <p className="text-[11px] text-slate-500">San Francisco, CA 94107</p>
                  </div>
                </div>

                {/* Bill To Info */}
                <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Billed To:</span>
                    <p className="font-bold text-slate-900">{previewDoc.clientName}</p>
                    <p className="text-slate-600">{previewDoc.clientCompany}</p>
                    <p className="text-slate-500">{previewDoc.clientEmail}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Dates & Terms:</span>
                    <p className="text-slate-700">Issue Date: <strong className="text-slate-950">{previewDoc.issueDate}</strong></p>
                    <p className="text-slate-700">Due Date: <strong className="text-slate-950">{previewDoc.dueDate}</strong></p>
                    <p className="text-slate-700">Terms: <strong className="text-slate-950">{previewDoc.paymentTerms}</strong></p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-slate-950 font-black uppercase text-[10px]">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {previewDoc.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-medium">{it.description}</td>
                        <td className="py-3 text-center">{it.quantity}</td>
                        <td className="py-3 text-right">${it.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right font-bold">${it.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* PDF Totals Box */}
                <div className="border-t-2 border-slate-900 pt-4 space-y-1 text-xs text-right">
                  <p className="text-slate-600">Subtotal: <strong className="text-slate-900">${previewDoc.subtotal.toFixed(2)}</strong></p>
                  <p className="text-slate-600">Tax ({previewDoc.taxPercent}%): <strong className="text-slate-900">${(previewDoc.subtotal * (previewDoc.taxPercent / 100)).toFixed(2)}</strong></p>
                  <p className="text-lg font-black text-slate-950 pt-2 border-t border-slate-200">
                    Total Due: ${previewDoc.totalAmount.toFixed(2)} {previewDoc.currency}
                  </p>
                </div>
              </div>

              {/* Action Buttons inside Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => triggerToast("📄 Generating PDF download...")}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download PDF</span>
                  </button>

                  <button 
                    onClick={() => triggerToast("🖨️ Sent to desktop printer!")}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Print</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => triggerToast(`💬 Pre-filled WhatsApp invoice link copied for ${previewDoc.clientName}!`)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button 
                    onClick={() => triggerToast(`✉️ Email invoice sent to ${previewDoc.clientEmail}!`)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black transition-all flex items-center space-x-1 cursor-pointer shadow-md"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default InvoiceQuotationModule;
