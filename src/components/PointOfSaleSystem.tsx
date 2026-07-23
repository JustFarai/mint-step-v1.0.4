import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, QrCode, Scan, Search, Plus, Minus, Trash2, DollarSign, 
  CreditCard, Smartphone, Split, RefreshCw, Printer, Send, Wifi, WifiOff, 
  UserCheck, Lock, Unlock, TrendingUp, BarChart2, Package, CheckCircle2, 
  AlertCircle, ChevronRight, X, ArrowDown, ArrowUp, Sparkles, LogOut, Download, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PosProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export interface CartItem {
  product: PosProduct;
  quantity: number;
  discount: number; // percentage
}

export interface PosTransaction {
  id: string;
  timestamp: string;
  cashierName: string;
  items: { productName: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  taxAmount: number;
  discountTotal: number;
  grandTotal: number;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'SPLIT';
  paymentDetails: string;
  status: 'COMPLETED' | 'REFUNDED';
}

export const initialProducts: PosProduct[] = [
  {
    id: 'p1',
    name: 'Box Tech Solar Inverter 5kW',
    category: 'Hardware',
    sku: 'SOL-5KW-001',
    barcode: '890123456781',
    price: 1250,
    stockQuantity: 24,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'p2',
    name: 'Smart Lithium Battery 48V',
    category: 'Hardware',
    sku: 'BAT-48V-002',
    barcode: '890123456782',
    price: 890,
    stockQuantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'p3',
    name: 'Fiber Optic Patch Cable 10m',
    category: 'Accessories',
    sku: 'CAB-OPT-010',
    barcode: '890123456783',
    price: 45,
    stockQuantity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'p4',
    name: 'Box Tech Enterprise Router X1',
    category: 'Networking',
    sku: 'RTR-ENT-001',
    barcode: '890123456784',
    price: 350,
    stockQuantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'p5',
    name: 'IoT Power Meter Sensor',
    category: 'Sensors',
    sku: 'SEN-PWR-005',
    barcode: '890123456785',
    price: 120,
    stockQuantity: 85,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'
  }
];

export const PointOfSaleSystem: React.FC = () => {
  // Cashier Auth State
  const [cashier, setCashier] = useState<{ id: string; name: string; role: string; loggedIn: boolean }>({
    id: 'c-101',
    name: 'Alex Vance',
    role: 'Senior Store Register Operator',
    loggedIn: true
  });

  // Offline Mode Toggle
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Cash Drawer State
  const [cashDrawer, setCashDrawer] = useState<{ isOpen: boolean; openingFloat: number; cashIn: number; cashOut: number; currentBalance: number }>({
    isOpen: true,
    openingFloat: 300,
    cashIn: 0,
    cashOut: 0,
    currentBalance: 300
  });

  // Inventory & Search
  const [products, setProducts] = useState<PosProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Scanner Simulator Modal
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [scannerType, setScannerType] = useState<'BARCODE' | 'QR'>('BARCODE');

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0); // Percentage

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'MOBILE_MONEY' | 'SPLIT'>('CARD');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [mobileNumber, setMobileNumber] = useState<string>('+1 (555) 019-2831');

  // Split Payment Inputs
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);

  // Recent Transactions & Refunds
  const [transactions, setTransactions] = useState<PosTransaction[]>([
    {
      id: 'POS-8901',
      timestamp: '2026-07-22 14:15',
      cashierName: 'Alex Vance',
      items: [
        { productName: 'Box Tech Solar Inverter 5kW', quantity: 1, unitPrice: 1250, total: 1250 },
        { productName: 'IoT Power Meter Sensor', quantity: 2, unitPrice: 120, total: 240 }
      ],
      subtotal: 1490,
      taxAmount: 122.92,
      discountTotal: 0,
      grandTotal: 1612.92,
      paymentMethod: 'CARD',
      paymentDetails: 'Visa ending in 4242',
      status: 'COMPLETED'
    }
  ]);

  const [lastReceipt, setLastReceipt] = useState<PosTransaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // --- Cart Calculations ---
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity * (1 - item.discount / 100)), 0);
  const discountAmount = subtotal * (globalDiscount / 100);
  const taxableSubtotal = subtotal - discountAmount;
  const taxAmount = taxableSubtotal * 0.0825; // 8.25% Sales Tax
  const grandTotal = taxableSubtotal + taxAmount;

  // --- Cart Handlers ---
  const handleAddToCart = (prod: PosProduct) => {
    if (prod.stockQuantity <= 0) {
      triggerToast(`⚠️ Out of Stock: ${prod.name}`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.product.id === prod.id);
      if (existing) {
        if (existing.quantity >= prod.stockQuantity) {
          triggerToast(`⚠️ Maximum stock limit reached for ${prod.name}`);
          return prev;
        }
        return prev.map(i => i.product.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product: prod, quantity: 1, discount: 0 }];
    });
    triggerToast(`🛒 Added ${prod.name} to cart.`);
  };

  const handleUpdateQuantity = (prodId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === prodId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stockQuantity) {
            triggerToast(`⚠️ Limited stock available.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleSimulateScan = (scannedBarcode: string) => {
    const found = products.find(p => p.barcode === scannedBarcode || p.sku.toLowerCase() === scannedBarcode.toLowerCase());
    if (found) {
      handleAddToCart(found);
      setShowScannerModal(false);
      triggerToast(`⚡ Scanned & added ${found.name}!`);
    } else {
      triggerToast(`❌ Barcode ${scannedBarcode} not found in store database.`);
    }
  };

  // --- Complete Sale Handler ---
  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;

    // Deduct stock automatically
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartMatch = cart.find(c => c.product.id === p.id);
        if (cartMatch) {
          return { ...p, stockQuantity: Math.max(0, p.stockQuantity - cartMatch.quantity) };
        }
        return p;
      });
    });

    // Create Transaction Record
    const newTx: PosTransaction = {
      id: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString(),
      cashierName: cashier.name,
      items: cart.map(c => ({
        productName: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
        total: +(c.product.price * c.quantity).toFixed(2)
      })),
      subtotal: +subtotal.toFixed(2),
      taxAmount: +taxAmount.toFixed(2),
      discountTotal: +discountAmount.toFixed(2),
      grandTotal: +grandTotal.toFixed(2),
      paymentMethod,
      paymentDetails: paymentMethod === 'CASH' ? `Cash Paid: $${cashTendered} (Change: $${(cashTendered - grandTotal).toFixed(2)})` :
                      paymentMethod === 'MOBILE_MONEY' ? `M-Pesa / MoMo: ${mobileNumber}` :
                      paymentMethod === 'SPLIT' ? `Split: $${splitCash} Cash / $${splitCard} Card` : 'Contactless Chip Card',
      status: 'COMPLETED'
    };

    setTransactions(prev => [newTx, ...prev]);
    setLastReceipt(newTx);

    // Update Cash Drawer
    if (paymentMethod === 'CASH') {
      setCashDrawer(prev => ({
        ...prev,
        cashIn: prev.cashIn + grandTotal,
        currentBalance: prev.currentBalance + grandTotal
      }));
    } else if (paymentMethod === 'SPLIT') {
      setCashDrawer(prev => ({
        ...prev,
        cashIn: prev.cashIn + splitCash,
        currentBalance: prev.currentBalance + splitCash
      }));
    }

    setCart([]);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
    triggerToast(`✅ Sale ${newTx.id} Completed Successfully! Stock updated.`);
  };

  // Refund Handler
  const handleRefund = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'REFUNDED' } : t));
    triggerToast(`🔄 Transaction ${txId} has been fully refunded.`);
  };

  // Filtered Products
  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-950 text-slate-100 p-3 lg:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4 relative">
      
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

      {/* POS Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-100 tracking-tight">MintStep POS Register</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center space-x-1 ${
                isOffline ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                <span>{isOffline ? 'Offline Sync Mode' : 'Online Terminal'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Operator: <strong className="text-slate-200">{cashier.name}</strong> ({cashier.role})</p>
          </div>
        </div>

        {/* Register Control Controls */}
        <div className="flex items-center space-x-2">
          {/* Offline Mode Toggle */}
          <button
            onClick={() => {
              setIsOffline(!isOffline);
              triggerToast(isOffline ? "🌐 Reconnected to Cloud POS Server." : "⚡ Switched to Local Offline POS Cache.");
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isOffline ? 'Go Online' : 'Go Offline'}</span>
          </button>

          {/* Cash Drawer Indicator */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono flex items-center space-x-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Float: <strong>${cashDrawer.currentBalance.toFixed(2)}</strong></span>
          </div>

          {/* Scanner Trigger CTA */}
          <button
            onClick={() => {
              setScannerType('BARCODE');
              setShowScannerModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-md"
          >
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Scan Barcode</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Split Grid (Catalog vs Cart Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: PRODUCT CATALOG & SEARCH (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search Bar & Category Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text"
                placeholder="Search product name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.map(p => (
              <div 
                key={p.id}
                onClick={() => handleAddToCart(p)}
                className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="space-y-2">
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-950 relative">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[9px] font-mono text-slate-300 font-bold">
                      Stock: {p.stockQuantity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">SKU: {p.sku}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                  <span className="text-sm font-black text-emerald-400 font-mono">${p.price.toLocaleString()}</span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: SHOPPING CART TERMINAL (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">Current Order Cart</h2>
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">{cart.reduce((a, b) => a + b.quantity, 0)} Items</span>
            </div>

            {/* Cart Items Stream */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono space-y-2">
                  <ShoppingCart className="w-8 h-8 mx-auto stroke-1 opacity-40" />
                  <p>Cart is empty. Tap items or scan barcodes to begin sale.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-0.5 max-w-[150px]">
                      <h4 className="font-bold text-slate-200 truncate">{item.product.name}</h4>
                      <span className="text-[10px] text-emerald-400">${item.product.price} each</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-slate-100">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <span className="w-16 text-right font-black text-slate-100">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cart Totals & Checkout Button */}
          <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
            
            {/* Global Discount Input */}
            <div className="flex items-center justify-between text-slate-400">
              <span>Order Discount (%):</span>
              <input 
                type="number"
                value={globalDiscount}
                onChange={(e) => setGlobalDiscount(Math.max(0, Math.min(100, +e.target.value)))}
                className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-right text-slate-200 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="text-slate-200">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Tax (8.25%):</span>
              <span className="text-slate-200">${taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-black text-emerald-400 pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            {/* Pay CTA */}
            <button
              disabled={cart.length === 0}
              onClick={() => {
                setCashTendered(Math.ceil(grandTotal));
                setSplitCash(+(grandTotal / 2).toFixed(2));
                setSplitCard(+(grandTotal / 2).toFixed(2));
                setShowPaymentModal(true);
              }}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <CreditCard className="w-4 h-4 fill-slate-950" />
              <span>Charge ${grandTotal.toFixed(2)}</span>
            </button>
          </div>

        </div>

      </div>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative"
            >
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Process Register Payment</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total Amount Due: <strong className="text-emerald-400 font-mono text-sm">${grandTotal.toFixed(2)}</strong></p>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'CARD', label: 'Card', icon: CreditCard },
                  { id: 'CASH', label: 'Cash', icon: DollarSign },
                  { id: 'MOBILE_MONEY', label: 'MoMo', icon: Smartphone },
                  { id: 'SPLIT', label: 'Split', icon: Split },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      paymentMethod === m.id 
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <m.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Method Specific Inputs */}
              {paymentMethod === 'CASH' && (
                <div className="space-y-2 text-xs font-mono p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <label className="text-slate-400 block">Cash Tendered ($):</label>
                  <input 
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(+e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Change Return:</span>
                    <span className="text-emerald-400 font-bold">${Math.max(0, cashTendered - grandTotal).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'MOBILE_MONEY' && (
                <div className="space-y-2 text-xs font-mono p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <label className="text-slate-400 block">M-Pesa / Mobile Money Number:</label>
                  <input 
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">STK Push prompt will be sent immediately.</p>
                </div>
              )}

              {paymentMethod === 'SPLIT' && (
                <div className="space-y-2 text-xs font-mono p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cash Amount:</span>
                    <input 
                      type="number"
                      value={splitCash}
                      onChange={(e) => {
                        const val = +e.target.value;
                        setSplitCash(val);
                        setSplitCard(+(grandTotal - val).toFixed(2));
                      }}
                      className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-right text-slate-200 font-bold"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Card Amount:</span>
                    <input 
                      type="number"
                      value={splitCard}
                      onChange={(e) => {
                        const val = +e.target.value;
                        setSplitCard(val);
                        setSplitCash(+(grandTotal - val).toFixed(2));
                      }}
                      className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-right text-slate-200 font-bold"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckoutSubmit}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg"
              >
                Complete Transaction
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SCANNER SIMULATOR MODAL --- */}
      <AnimatePresence>
        {showScannerModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative"
            >
              <button 
                onClick={() => setShowScannerModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Scan className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-sm font-black uppercase text-slate-100">Barcode Camera Scanner</h3>
                <p className="text-xs text-slate-400 mt-1">Tap a mock barcode to test instant inventory auto-carting:</p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {products.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateScan(p.barcode)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left flex justify-between items-center cursor-pointer"
                  >
                    <span className="truncate text-slate-200">{p.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{p.barcode}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RECEIPT MODAL --- */}
      <AnimatePresence>
        {showReceiptModal && lastReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Thermal Receipt Printable Box */}
              <div className="bg-white text-slate-900 p-6 rounded-2xl font-mono text-xs space-y-4 shadow-xl border border-slate-200">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black tracking-tight uppercase">MINTSTEP POS STORE</h2>
                  <p className="text-[10px] text-slate-500">Receipt Ref: {lastReceipt.id}</p>
                  <p className="text-[10px] text-slate-500">{lastReceipt.timestamp}</p>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                  {lastReceipt.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.productName}</span>
                      <span className="font-bold">${it.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-right">
                  <p>Subtotal: ${lastReceipt.subtotal.toFixed(2)}</p>
                  <p>Tax: ${lastReceipt.taxAmount.toFixed(2)}</p>
                  <p className="text-sm font-black text-slate-950 pt-1 border-t border-slate-300">
                    Grand Total: ${lastReceipt.grandTotal.toFixed(2)}
                  </p>
                </div>

                <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-dashed border-slate-300">
                  <p>Payment: {lastReceipt.paymentDetails}</p>
                  <p className="mt-1">Thank you for shopping with MintStep!</p>
                </div>
              </div>

              {/* Share & Print Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => triggerToast("🖨️ Receipt sent to thermal bluetooth printer!")}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Print Thermal</span>
                </button>

                <button
                  onClick={() => triggerToast("📱 Digital receipt sent via SMS & WhatsApp!")}
                  className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Digital SMS</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PointOfSaleSystem;
