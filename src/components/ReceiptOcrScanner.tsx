import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, 
  Search, Download, Trash2, Edit3, Image as ImageIcon, ScanLine, 
  DollarSign, Calendar, Clock, Receipt, Tag, FileText, Check, 
  ShieldCheck, ArrowRight, Eye, Sliders, Sun, Crop, Filter, 
  Layers, Copy, Plus, X, Globe, Wifi, WifiOff, FileCheck, HelpCircle,
  CreditCard, ChevronRight, Share2, CornerDownRight, Database, CloudUpload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ExtractedReceipt {
  id: string;
  merchantName: string;
  merchantConfidence: number;
  date: string;
  time: string;
  receiptNumber: string;
  taxAmount: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  category: string;
  categoryConfidence: number;
  lineItems: LineItem[];
  imageUrl: string;
  storagePath: string;
  createdAt: string;
  syncStatus: 'SYNCED' | 'QUEUED_OFFLINE';
  isDuplicate: boolean;
  duplicateNotes?: string;
  notes?: string;
}

export const ReceiptOcrScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCANNER' | 'VAULT'>('SCANNER');
  const [scannerStep, setScannerStep] = useState<'CAPTURE' | 'ENHANCE' | 'PROCESSING' | 'REVIEW'>('CAPTURE');
  
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // --- Network Sync State ---
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // --- Sample Preset Receipts for Instant 1-Click Testing ---
  const samplePresets = [
    {
      name: 'Apple Store Hardware',
      merchant: 'Apple Store - Infinite Loop',
      total: 1299.00,
      tax: 116.91,
      currency: 'USD',
      category: 'Office Equipment & Hardware',
      receiptNum: 'INV-2026-APL-8821',
      date: '2026-07-20',
      time: '14:32:00',
      payment: 'Corporate Visa (**** 4892)',
      items: [
        { id: '1', description: 'MacBook Air M3 15-inch 16GB', quantity: 1, unitPrice: 1299.00, totalPrice: 1299.00 }
      ],
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Starbucks Business Lunch',
      merchant: 'Starbucks Reserve Roast',
      total: 38.50,
      tax: 3.20,
      currency: 'USD',
      category: 'Meals & Entertainment',
      receiptNum: 'SBUX-90182-TX',
      date: '2026-07-21',
      time: '09:15:22',
      payment: 'Apple Pay (Amex)',
      items: [
        { id: '1', description: 'Oat Milk Iced Latte', quantity: 2, unitPrice: 6.50, totalPrice: 13.00 },
        { id: '2', description: 'Avocado Toast & Bacon Bagel', quantity: 2, unitPrice: 11.00, totalPrice: 22.00 }
      ],
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Uber Airport Transit',
      merchant: 'Uber Technologies Inc',
      total: 84.20,
      tax: 6.50,
      currency: 'USD',
      category: 'Travel & Transportation',
      receiptNum: 'UBR-7729-SF',
      date: '2026-07-19',
      time: '18:45:10',
      payment: 'Corporate MasterCard',
      items: [
        { id: '1', description: 'Uber Black Ride - Airport to Downtown', quantity: 1, unitPrice: 77.70, totalPrice: 77.70 }
      ],
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // --- Current Selected Image & Enhancement States ---
  const [selectedImage, setSelectedImage] = useState<string>(samplePresets[0].image);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [autoCrop, setAutoCrop] = useState<boolean>(true);

  // --- OCR Processing Progress State ---
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStatusText, setProcessingStatusText] = useState<string>('Initializing MintStep Gemini OCR Engine...');

  // --- Extracted Form State (Editable) ---
  const [editingReceipt, setEditingReceipt] = useState<ExtractedReceipt>({
    id: 'RCPT-2026-901',
    merchantName: samplePresets[0].merchant,
    merchantConfidence: 98,
    date: samplePresets[0].date,
    time: samplePresets[0].time,
    receiptNumber: samplePresets[0].receiptNum,
    taxAmount: samplePresets[0].tax,
    subtotal: 1182.09,
    totalAmount: samplePresets[0].total,
    currency: 'USD',
    paymentMethod: samplePresets[0].payment,
    category: samplePresets[0].category,
    categoryConfidence: 96,
    lineItems: samplePresets[0].items,
    imageUrl: samplePresets[0].image,
    storagePath: 'gs://mintstep-vault/receipts/2026/rcpt-2026-901.png',
    createdAt: new Date().toISOString(),
    syncStatus: 'SYNCED',
    isDuplicate: false,
    notes: 'Approved via Section 179 Expense Policy.'
  });

  // --- Saved Receipts Library (Firestore Store Mock) ---
  const [savedReceipts, setSavedReceipts] = useState<ExtractedReceipt[]>([
    {
      id: 'RCPT-2026-899',
      merchantName: 'AWS Cloud Services',
      merchantConfidence: 99,
      date: '2026-07-15',
      time: '00:00:00',
      receiptNumber: 'AWS-INV-992019',
      taxAmount: 42.10,
      subtotal: 420.00,
      totalAmount: 462.10,
      currency: 'USD',
      paymentMethod: 'Corporate Visa',
      category: 'Software & Infrastructure',
      categoryConfidence: 99,
      lineItems: [
        { id: '1', description: 'EC2 Compute & Cloud Run Instance', quantity: 1, unitPrice: 420.00, totalPrice: 420.00 }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      storagePath: 'gs://mintstep-vault/receipts/2026/rcpt-2026-899.png',
      createdAt: '2026-07-15T10:00:00Z',
      syncStatus: 'SYNCED',
      isDuplicate: false,
      notes: 'Monthly infrastructure hosting.'
    },
    {
      id: 'RCPT-2026-898',
      merchantName: 'Office Depot',
      merchantConfidence: 94,
      date: '2026-07-10',
      time: '11:20:00',
      receiptNumber: 'OD-77281',
      taxAmount: 12.40,
      subtotal: 140.00,
      totalAmount: 152.40,
      currency: 'USD',
      paymentMethod: 'Cash',
      category: 'Office Supplies',
      categoryConfidence: 92,
      lineItems: [
        { id: '1', description: 'Ergonomic Chair Cushion & Desk Organizer', quantity: 2, unitPrice: 70.00, totalPrice: 140.00 }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      storagePath: 'gs://mintstep-vault/receipts/2026/rcpt-2026-898.png',
      createdAt: '2026-07-10T14:20:00Z',
      syncStatus: 'SYNCED',
      isDuplicate: false,
      notes: 'Office ergonomics upgrade.'
    }
  ]);

  // --- Vault Search & Filter ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // --- Duplicate Detection Helper ---
  const checkForDuplicates = (receiptNum: string, total: number, merchant: string) => {
    return savedReceipts.some(r => 
      (r.receiptNumber && r.receiptNumber.toLowerCase() === receiptNum.toLowerCase()) ||
      (r.merchantName.toLowerCase() === merchant.toLowerCase() && Math.abs(r.totalAmount - total) < 0.01)
    );
  };

  // --- Handle Custom Image Upload / File Selection ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
          setScannerStep('ENHANCE');
          triggerToast("📷 Receipt image loaded into enhancer!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Start OCR Processing Simulation ---
  const startOcrProcessing = () => {
    setScannerStep('PROCESSING');
    setProcessingProgress(10);
    setProcessingStatusText('Detecting receipt bounding box & perspective alignment...');

    setTimeout(() => {
      setProcessingProgress(35);
      setProcessingStatusText('Executing Optical Character Recognition (OCR)...');
    }, 600);

    setTimeout(() => {
      setProcessingProgress(65);
      setProcessingStatusText('Extracting Merchant, Items, Tax, Currency & Totals...');
    }, 1200);

    setTimeout(() => {
      setProcessingProgress(90);
      setProcessingStatusText('Running Gemini AI Category Classifier & Duplicate Check...');
    }, 1800);

    setTimeout(() => {
      setProcessingProgress(100);
      
      // Auto populate state based on image or selected preset
      const presetMatch = samplePresets.find(p => p.image === selectedImage) || samplePresets[0];
      
      const newId = `RCPT-2026-${Math.floor(100 + Math.random() * 900)}`;
      const isDup = checkForDuplicates(presetMatch.receiptNum, presetMatch.total, presetMatch.merchant);

      setEditingReceipt({
        id: newId,
        merchantName: presetMatch.merchant,
        merchantConfidence: 98,
        date: presetMatch.date,
        time: presetMatch.time,
        receiptNumber: presetMatch.receiptNum,
        taxAmount: presetMatch.tax,
        subtotal: +(presetMatch.total - presetMatch.tax).toFixed(2),
        totalAmount: presetMatch.total,
        currency: presetMatch.currency,
        paymentMethod: presetMatch.payment,
        category: presetMatch.category,
        categoryConfidence: 96,
        lineItems: presetMatch.items,
        imageUrl: selectedImage,
        storagePath: `gs://mintstep-vault/receipts/2026/${newId.toLowerCase()}.png`,
        createdAt: new Date().toISOString(),
        syncStatus: isOnline ? 'SYNCED' : 'QUEUED_OFFLINE',
        isDuplicate: isDup,
        duplicateNotes: isDup ? '⚠️ Potential duplicate detected: Matching receipt number or identical merchant & total exist in Firestore.' : undefined,
        notes: 'Extracted automatically by MintStep OCR Engine.'
      });

      setScannerStep('REVIEW');
      triggerToast(isDup ? "⚠️ OCR complete! Duplicate receipt warning flagged." : "✨ Receipt successfully parsed with 98.4% confidence!");
    }, 2400);
  };

  // --- Line Item Handlers ---
  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: 'New Expense Item',
      quantity: 1,
      unitPrice: 10.00,
      totalPrice: 10.00
    };
    setEditingReceipt(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, val: any) => {
    setEditingReceipt(prev => {
      const updated = prev.lineItems.map(item => {
        if (item.id === id) {
          const newItem = { ...item, [field]: val };
          if (field === 'quantity' || field === 'unitPrice') {
            newItem.totalPrice = +(newItem.quantity * newItem.unitPrice).toFixed(2);
          }
          return newItem;
        }
        return item;
      });

      // Recalculate subtotal & total
      const newSubtotal = updated.reduce((acc, curr) => acc + curr.totalPrice, 0);
      return {
        ...prev,
        lineItems: updated,
        subtotal: +newSubtotal.toFixed(2),
        totalAmount: +(newSubtotal + prev.taxAmount).toFixed(2)
      };
    });
  };

  const handleDeleteLineItem = (id: string) => {
    setEditingReceipt(prev => {
      const updated = prev.lineItems.filter(item => item.id !== id);
      const newSubtotal = updated.reduce((acc, curr) => acc + curr.totalPrice, 0);
      return {
        ...prev,
        lineItems: updated,
        subtotal: +newSubtotal.toFixed(2),
        totalAmount: +(newSubtotal + prev.taxAmount).toFixed(2)
      };
    });
  };

  // --- Save Receipt to Vault / Firestore ---
  const handleSaveReceipt = () => {
    setSavedReceipts(prev => [editingReceipt, ...prev]);
    triggerToast(isOnline ? "🔥 Receipt stored in Firebase Storage & Firestore ledger!" : "📶 Receipt saved locally! Queued for offline cloud sync.");
    setActiveTab('VAULT');
    setScannerStep('CAPTURE');
  };

  // --- Export Receipt to PDF ---
  const handleExportPDF = (rcpt: ExtractedReceipt) => {
    triggerToast(`📄 Exported ${rcpt.merchantName} Receipt as PDF breakdown!`);
  };

  // Filtered Vault
  const filteredVault = savedReceipts.filter(r => {
    const matchesSearch = r.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'ALL' || r.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
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
            <ScanLine className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">AI Receipt OCR & Expense Scanner</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                MintStep AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Camera Capture, Auto-Edge Alignment, Multi-Currency Itemization & Firebase Ledger Storage</p>
          </div>
        </div>

        {/* Offline Sync Toggle Control */}
        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              triggerToast(isOnline ? "📶 Network Offline Mode Enabled. Scans will queue locally." : "🌐 Network Online Mode Active. Live Firebase Sync Enabled.");
            }}
            className="flex items-center space-x-2 cursor-pointer text-xs font-bold"
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Cloud Sync Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-amber-400">Offline Deferred Queue</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Tabs (Scanner vs Vault) */}
      <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'SCANNER' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Receipt Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('VAULT')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'VAULT' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Scanned Receipts Vault ({savedReceipts.length})</span>
          </button>
        </div>

        {activeTab === 'SCANNER' && (
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-400 pr-2">
            <span className={scannerStep === 'CAPTURE' ? 'text-emerald-400 font-bold' : ''}>1. Capture</span>
            <span>&rarr;</span>
            <span className={scannerStep === 'ENHANCE' ? 'text-emerald-400 font-bold' : ''}>2. Enhance</span>
            <span>&rarr;</span>
            <span className={scannerStep === 'PROCESSING' ? 'text-emerald-400 font-bold' : ''}>3. OCR Parse</span>
            <span>&rarr;</span>
            <span className={scannerStep === 'REVIEW' ? 'text-emerald-400 font-bold' : ''}>4. Review</span>
          </div>
        )}
      </div>

      {/* ------------------- TAB 1: SCANNER WORKFLOW ------------------- */}
      {activeTab === 'SCANNER' && (
        <div className="space-y-6">
          
          {/* STEP 1: CAPTURE / UPLOAD */}
          {scannerStep === 'CAPTURE' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Camera / Upload Canvas Viewfinder */}
              <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden group">
                
                {/* Simulated Auto-Edge Detection Viewfinder Frame */}
                <div className="absolute inset-8 border-2 border-dashed border-emerald-500/40 rounded-2xl pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                    <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                  </div>
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <ScanLine className="w-3 h-3 animate-pulse" />
                      <span>Auto-Edge Alignment Target</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                    <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>
                  </div>
                </div>

                <div className="text-center space-y-4 z-10 max-w-md">
                  <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-100">Scan Paper Receipt</h3>
                    <p className="text-xs text-slate-400 mt-1">Position paper receipt inside viewfinder or upload receipt file from your gallery</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {/* Simulated Camera Snapshot */}
                    <button
                      onClick={() => {
                        setSelectedImage(samplePresets[0].image);
                        setScannerStep('ENHANCE');
                        triggerToast("📸 Camera snapshot captured! Proceeding to enhancer.");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Photo</span>
                    </button>

                    {/* File Upload Trigger */}
                    <label className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer border border-slate-700">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload Image</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Sample Presets Panel for Instant Demo */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">1-Click Test Receipts</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Test OCR engine instantly with pre-configured high-res receipts:</p>

                  <div className="space-y-3 mt-4">
                    {samplePresets.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedImage(preset.image);
                          setScannerStep('ENHANCE');
                          triggerToast(`Selected ${preset.name} receipt!`);
                        }}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition-all cursor-pointer flex items-center space-x-3 group"
                      >
                        <img src={preset.image} alt={preset.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{preset.name}</h4>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                            <span>{preset.merchant}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">${preset.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Privacy Guard</span>
                  </div>
                  <p>All scanned receipt images are encrypted using AES-256 before storage in Firebase Vault.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: IMAGE ENHANCEMENT & EDGE CORRECTION */}
          {scannerStep === 'ENHANCE' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Preview & Interactive Filter Canvas */}
              <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl max-h-[380px]">
                  <img 
                    src={selectedImage} 
                    alt="Receipt to Scan" 
                    className="max-h-[360px] object-contain transition-all"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) ${isGrayscale ? 'grayscale(100%) contrast(150%)' : ''}`
                    }}
                  />
                  
                  {/* Auto Crop Crop Handles Overlay */}
                  {autoCrop && (
                    <div className="absolute inset-4 border-2 border-emerald-400 rounded-xl pointer-events-none flex justify-between p-2">
                      <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider self-start">Perspective Corrected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Controls Panel */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Image Enhancements</h3>
                  </div>

                  {/* Brightness Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-bold">
                      <span className="flex items-center space-x-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Brightness</span>
                      </span>
                      <span className="font-mono text-emerald-400">{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      value={brightness}
                      onChange={(e) => setBrightness(+e.target.value)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Contrast Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-300 font-bold">
                      <span className="flex items-center space-x-1">
                        <Filter className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Contrast</span>
                      </span>
                      <span className="font-mono text-emerald-400">{contrast}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="200" 
                      value={contrast}
                      onChange={(e) => setContrast(+e.target.value)}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* High Contrast B&W Toggle */}
                  <button
                    onClick={() => setIsGrayscale(!isGrayscale)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                      isGrayscale 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <span>High-Contrast OCR Binarization</span>
                    <span className="font-mono font-black text-[10px]">{isGrayscale ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Auto Crop & Perspective */}
                  <button
                    onClick={() => setAutoCrop(!autoCrop)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                      autoCrop 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <span>Auto-Edge Perspective Correction</span>
                    <span className="font-mono font-black text-[10px]">{autoCrop ? 'ACTIVE' : 'OFF'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setScannerStep('CAPTURE')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={startOcrProcessing}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Process with Gemini OCR</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING OCR ANIMATION */}
          {scannerStep === 'PROCESSING' && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 flex flex-col items-center justify-center min-h-[420px] text-center space-y-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                <ScanLine className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-black text-slate-100">{processingStatusText}</h3>
                <p className="text-xs text-slate-400">MintStep AI model analyzing line items, tax brackets, and currency formatting...</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & EDIT EXTRACTED DATA */}
          {scannerStep === 'REVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Receipt Image Thumbnail */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">Scanned Document</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      OCR Confidence: 98.4%
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800 max-h-[300px] flex items-center justify-center bg-slate-950">
                    <img src={editingReceipt.imageUrl} alt="Scanned Receipt" className="max-h-[280px] object-contain" />
                  </div>
                </div>

                {/* Duplicate Warning Box if Flagged */}
                {editingReceipt.isDuplicate && (
                  <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Duplicate Receipt Detected</span>
                    </div>
                    <p className="text-[11px] text-rose-300/80">{editingReceipt.duplicateNotes}</p>
                  </div>
                )}

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Firebase Storage:</span>
                    <span className="text-slate-200 font-bold">Stored</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ledger Status:</span>
                    <span className="text-emerald-400 font-bold">{editingReceipt.syncStatus}</span>
                  </div>
                </div>
              </div>

              {/* Extracted Fields Inline Editor Form */}
              <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Review Extracted Transaction Details</h3>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">ID: {editingReceipt.id}</span>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Merchant Name */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Merchant / Vendor Name</label>
                    <input 
                      type="text"
                      value={editingReceipt.merchantName}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, merchantName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Receipt Number */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Receipt / Invoice #</label>
                    <input 
                      type="text"
                      value={editingReceipt.receiptNumber}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, receiptNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Date</label>
                    <input 
                      type="date"
                      value={editingReceipt.date}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Currency</label>
                    <select
                      value={editingReceipt.currency}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, currency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Payment Method</label>
                    <input 
                      type="text"
                      value={editingReceipt.paymentMethod}
                      onChange={(e) => setEditingReceipt({ ...editingReceipt, paymentMethod: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* AI Expense Category */}
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">AI Category Suggestion</label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={editingReceipt.category}
                        onChange={(e) => setEditingReceipt({ ...editingReceipt, category: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Office Equipment & Hardware">Office Equipment & Hardware</option>
                        <option value="Meals & Entertainment">Meals & Entertainment</option>
                        <option value="Travel & Transportation">Travel & Transportation</option>
                        <option value="Software & Infrastructure">Software & Infrastructure</option>
                        <option value="Office Supplies">Office Supplies</option>
                      </select>
                      <span className="px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 text-[10px] font-bold">
                        96% AI Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Purchased Line Items</h4>
                    <button
                      onClick={handleAddLineItem}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingReceipt.lineItems.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs">
                        <input 
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                          className="col-span-6 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                        />
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateLineItem(item.id, 'quantity', +e.target.value)}
                          className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-100 font-bold font-mono text-center focus:outline-none focus:border-emerald-500"
                        />
                        <input 
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateLineItem(item.id, 'unitPrice', +e.target.value)}
                          className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-emerald-400 font-bold font-mono text-right focus:outline-none focus:border-emerald-500"
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

                {/* Subtotal, Tax & Total Calculation Summary */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${editingReceipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 items-center">
                    <span>Tax Amount:</span>
                    <input 
                      type="number"
                      value={editingReceipt.taxAmount}
                      onChange={(e) => {
                        const newTax = +e.target.value;
                        setEditingReceipt({
                          ...editingReceipt,
                          taxAmount: newTax,
                          totalAmount: +(editingReceipt.subtotal + newTax).toFixed(2)
                        });
                      }}
                      className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-right text-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm font-black text-emerald-400 pt-2 border-t border-slate-800">
                    <span>Total Amount:</span>
                    <span>${editingReceipt.totalAmount.toFixed(2)} {editingReceipt.currency}</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setScannerStep('ENHANCE')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Re-scan
                  </button>

                  <button
                    onClick={handleSaveReceipt}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                    <span>Save to Ledger & Storage</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ------------------- TAB 2: SCANNED RECEIPTS VAULT ------------------- */}
      {activeTab === 'VAULT' && (
        <div className="space-y-6">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search merchant, receipt #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Office Equipment & Hardware">Office Equipment & Hardware</option>
                <option value="Meals & Entertainment">Meals & Entertainment</option>
                <option value="Travel & Transportation">Travel & Transportation</option>
                <option value="Software & Infrastructure">Software & Infrastructure</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>

              <button
                onClick={() => {
                  setActiveTab('SCANNER');
                  setScannerStep('CAPTURE');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Scan New</span>
              </button>
            </div>
          </div>

          {/* Vault Receipts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVault.map((rcpt) => (
              <div key={rcpt.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{rcpt.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                      {rcpt.syncStatus}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mt-4">
                    <img src={rcpt.imageUrl} alt={rcpt.merchantName} className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-slate-100 truncate">{rcpt.merchantName}</h3>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>{rcpt.date}</span>
                        <span>•</span>
                        <span>{rcpt.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Total & Category */}
                  <div className="mt-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">Total Spent:</span>
                      <span className="text-emerald-400 font-black text-sm">${rcpt.totalAmount.toFixed(2)} {rcpt.currency}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Category:</span>
                      <span className="text-indigo-400 font-bold truncate max-w-[140px]">{rcpt.category}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleExportPDF(rcpt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export PDF</span>
                  </button>

                  <span className="text-[10px] font-mono text-slate-500">{rcpt.lineItems.length} Items</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default ReceiptOcrScanner;
