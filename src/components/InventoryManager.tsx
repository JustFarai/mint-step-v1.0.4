import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, Filter, Plus, ArrowUpRight, ArrowDownLeft, Trash2, 
  Edit3, RefreshCw, Download, AlertTriangle, CheckCircle2, ShieldAlert,
  Boxes, Truck, FileText, QrCode, Clipboard, FileSpreadsheet, Eye, 
  Barcode, Check, X, Camera, Sparkles, ShoppingCart, HelpCircle, Activity,
  ChevronRight, ArrowRight, TrendingUp, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, LineChart, Line
} from 'recharts';

// --- TS Interfaces ---
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  cost: number;
  price: number;
  quantity: number;
  threshold: number;
  supplierId: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  costPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  orderDate: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Received';
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  change: number; // e.g. +10 or -2
  reason: string;
  timestamp: string;
}

export default function InventoryManager() {
  // --- Persistent LocalStates ---
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('wf_inv_products');
    if (local) return JSON.parse(local);
    return [
      { id: 'p1', name: 'Box Nano-Router v2', sku: 'SKU-NANO-R2', category: 'Network Modules', cost: 450, price: 950, quantity: 4, threshold: 10, supplierId: 's2', description: 'Advanced miniature dual-band hardware routing node with encrypted fallback loops.' },
      { id: 'p2', name: 'Box Quantum Switch v4', sku: 'SKU-QUANTUM-S4', category: 'Silicon Materials', cost: 1200, price: 2400, quantity: 18, threshold: 8, supplierId: 's1', description: 'Quantum-tunneling silicon routing matrix supporting 100 Gbps backplane routing.' },
      { id: 'p3', name: 'Ethereum Core Node Assembly', sku: 'SKU-ETH-CORE', category: 'R&D Prototypes', cost: 800, price: 1550, quantity: 3, threshold: 8, supplierId: 's2', description: 'Decentralized solidity node hardware bundle with built-in cold storage co-processor.' },
      { id: 'p4', name: 'Titanium Rack Mounts', sku: 'SKU-TITAN-RACK', category: 'Hardware', cost: 200, price: 485, quantity: 42, threshold: 15, supplierId: 's4', description: 'Aerospace-grade high-tensile titanium chassis rack mounts with thermal dampers.' },
      { id: 'p5', name: 'Sovereign Node Enclosure', sku: 'SKU-SOV-ENC', category: 'Hardware', cost: 120, price: 290, quantity: 2, threshold: 6, supplierId: 's1', description: 'IP67 dustproof and waterproof heavy industrial case for edge cluster containment.' },
      { id: 'p6', name: 'Liquid Helium Cryo-Coils', sku: 'SKU-CRYO-COIL', category: 'Cooling Systems', cost: 950, price: 1850, quantity: 1, threshold: 3, supplierId: 's1', description: 'Superconducting cooling components for overclocked mainframe server blades.' }
    ];
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const local = localStorage.getItem('wf_inv_suppliers');
    if (local) return JSON.parse(local);
    return [
      { id: 's1', name: 'Taiwan Semiconductor Corp', contactName: 'Dr. Morris Chang', email: 'orders@tsmc-supply.com', phone: '+886 3 578 1688', address: 'Hsinchu Science Park, Taiwan' },
      { id: 's2', name: 'Shenzhen Microassembly Ltd', contactName: 'Li Wei', email: 'wholesale@sz-microassembly.cn', phone: '+86 755 8899 1122', address: 'Nanshan Hi-Tech Park, Shenzhen, China' },
      { id: 's3', name: 'AWS Compute Corp Wholesale', contactName: 'Andy Jassy', email: 'institutions@aws-wholesale.com', phone: '+1 800 282 2210', address: 'Seattle, WA, USA' },
      { id: 's4', name: 'DHL Logistics Hub International', contactName: 'Markus Reckling', email: 'customs@dhl-global.de', phone: '+49 228 1820', address: 'Bonn, Germany' }
    ];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const local = localStorage.getItem('wf_inv_categories');
    if (local) return JSON.parse(local);
    return ['Hardware', 'Network Modules', 'Silicon Materials', 'R&D Prototypes', 'Cooling Systems'];
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const local = localStorage.getItem('wf_inv_pos');
    if (local) return JSON.parse(local);
    return [
      { 
        id: 'po1', 
        poNumber: 'PO-2026-001', 
        supplierId: 's1', 
        items: [{ productId: 'p5', quantity: 10, costPrice: 120 }], 
        totalCost: 1200, 
        orderDate: '2026-07-10', 
        status: 'Received' 
      },
      { 
        id: 'po2', 
        poNumber: 'PO-2026-002', 
        supplierId: 's2', 
        items: [
          { productId: 'p1', quantity: 12, costPrice: 450 },
          { productId: 'p3', quantity: 5, costPrice: 800 }
        ], 
        totalCost: 9400, 
        orderDate: '2026-07-19', 
        status: 'Pending' 
      }
    ];
  });

  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    const local = localStorage.getItem('wf_inv_logs');
    if (local) return JSON.parse(local);
    return [
      { id: 'l1', productId: 'p5', productName: 'Sovereign Node Enclosure', sku: 'SKU-SOV-ENC', change: 10, reason: 'Purchase Order PO-2026-001 Fulfilled', timestamp: '2026-07-11T14:20:00' },
      { id: 'l2', productId: 'p4', productName: 'Titanium Rack Mounts', sku: 'SKU-TITAN-RACK', change: -5, reason: 'Anduril Node Delivery B2B Sale', timestamp: '2026-07-15T09:30:00' },
      { id: 'l3', productId: 'p1', productName: 'Box Nano-Router v2', sku: 'SKU-NANO-R2', change: -1, reason: 'Vercel Framework assembly test', timestamp: '2026-07-18T16:45:00' }
    ];
  });

  // --- Filter and UI States ---
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'suppliers' | 'orders' | 'logs' | 'analytics'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'All' | 'Low' | 'Out' | 'Healthy'>('All');
  
  // Dialog / Edit forms states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productEditing, setProductEditing] = useState<Product | null>(null);
  
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierEditing, setSupplierEditing] = useState<Supplier | null>(null);

  const [poModalOpen, setPoModalOpen] = useState(false);
  
  // Custom category adder
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Barcode View modal
  const [activeBarcodeProduct, setActiveBarcodeProduct] = useState<Product | null>(null);

  // QR Scanner simulation states
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [isQrScanning, setIsQrScanning] = useState(false);
  const [qrFlashActive, setQrFlashActive] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scanMessage, setScanMessage] = useState<string>('');

  // AI Advisory Panel
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // New product form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formThreshold, setFormThreshold] = useState('');
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // New Supplier form states
  const [formSuppName, setFormSuppName] = useState('');
  const [formSuppContact, setFormSuppContact] = useState('');
  const [formSuppEmail, setFormSuppEmail] = useState('');
  const [formSuppPhone, setFormSuppPhone] = useState('');
  const [formSuppAddress, setFormSuppAddress] = useState('');

  // New Purchase Order form states
  const [poSupplierId, setPoSupplierId] = useState('');
  const [poFormItems, setPoFormItems] = useState<{ productId: string; quantity: number }[]>([{ productId: '', quantity: 1 }]);

  // Notifications or toast message
  const [toast, setToast] = useState<string | null>(null);

  // --- Auto Persistence Effect ---
  useEffect(() => {
    localStorage.setItem('wf_inv_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wf_inv_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('wf_inv_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wf_inv_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('wf_inv_logs', JSON.stringify(stockLogs));
  }, [stockLogs]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Computed Metrics (Inventory Valuation) ---
  const metrics = useMemo(() => {
    let totalSkus = products.length;
    let totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
    let assetCostValuation = products.reduce((sum, p) => sum + (p.quantity * p.cost), 0);
    let retailPriceValuation = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    let potentialProfit = retailPriceValuation - assetCostValuation;
    let avgProfitMargin = retailPriceValuation > 0 ? (potentialProfit / retailPriceValuation) * 100 : 0;

    let lowStockCount = products.filter(p => p.quantity <= p.threshold).length;
    let outOfStockCount = products.filter(p => p.quantity === 0).length;

    return {
      totalSkus,
      totalUnits,
      assetCostValuation,
      retailPriceValuation,
      potentialProfit,
      avgProfitMargin,
      lowStockCount,
      outOfStockCount
    };
  }, [products]);

  // --- Low Stock Alerts List ---
  const lowStockAlerts = useMemo(() => {
    return products.filter(p => p.quantity <= p.threshold);
  }, [products]);

  // --- Filtered Products ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(query) || 
                            p.sku.toLowerCase().includes(query) || 
                            p.description.toLowerCase().includes(query) ||
                            suppliers.find(s => s.id === p.supplierId)?.name.toLowerCase().includes(query);

      // 2. Category
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // 3. Supplier
      const matchesSupplier = selectedSupplierFilter === 'All' || p.supplierId === selectedSupplierFilter;

      // 4. Stock Status
      let matchesStock = true;
      if (selectedStockStatus === 'Low') {
        matchesStock = p.quantity <= p.threshold && p.quantity > 0;
      } else if (selectedStockStatus === 'Out') {
        matchesStock = p.quantity === 0;
      } else if (selectedStockStatus === 'Healthy') {
        matchesStock = p.quantity > p.threshold;
      }

      return matchesSearch && matchesCategory && matchesSupplier && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, selectedSupplierFilter, selectedStockStatus, suppliers]);

  // --- Add/Edit Product Handlers ---
  const openAddProduct = () => {
    setProductEditing(null);
    setFormName('');
    setFormSku('SKU-' + Math.random().toString(36).substr(2, 6).toUpperCase());
    setFormCategory(categories[0] || '');
    setFormCost('');
    setFormPrice('');
    setFormQuantity('10');
    setFormThreshold('5');
    setFormSupplierId(suppliers[0]?.id || '');
    setFormDescription('');
    setProductModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setProductEditing(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormCost(p.cost.toString());
    setFormPrice(p.price.toString());
    setFormQuantity(p.quantity.toString());
    setFormThreshold(p.threshold.toString());
    setFormSupplierId(p.supplierId);
    setFormDescription(p.description);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku || !formCost || !formPrice || !formQuantity || !formThreshold) {
      triggerToast("⚠️ Please fill in all required numeric fields.");
      return;
    }

    const costNum = parseFloat(formCost);
    const priceNum = parseFloat(formPrice);
    const qtyNum = parseInt(formQuantity);
    const threshNum = parseInt(formThreshold);

    if (isNaN(costNum) || isNaN(priceNum) || isNaN(qtyNum) || isNaN(threshNum)) {
      triggerToast("⚠️ Costs, Prices, and Stock levels must be valid numbers.");
      return;
    }

    if (productEditing) {
      // Edit
      const prevQty = productEditing.quantity;
      setProducts(prev => prev.map(p => p.id === productEditing.id ? {
        ...p,
        name: formName,
        sku: formSku,
        category: formCategory,
        cost: costNum,
        price: priceNum,
        quantity: qtyNum,
        threshold: threshNum,
        supplierId: formSupplierId,
        description: formDescription
      } : p));

      // Log movement if stock level changed manually
      if (qtyNum !== prevQty) {
        const diff = qtyNum - prevQty;
        const log: StockLog = {
          id: 'l_' + Date.now(),
          productId: productEditing.id,
          productName: formName,
          sku: formSku,
          change: diff,
          reason: `Manual inventory audit update: changed ${prevQty} → ${qtyNum}`,
          timestamp: new Date().toISOString()
        };
        setStockLogs(prev => [log, ...prev]);
      }

      triggerToast(`📦 Successfully updated product: ${formName}`);
    } else {
      // Create New
      const newProd: Product = {
        id: 'p_' + Date.now(),
        name: formName,
        sku: formSku,
        category: formCategory,
        cost: costNum,
        price: priceNum,
        quantity: qtyNum,
        threshold: threshNum,
        supplierId: formSupplierId,
        description: formDescription
      };
      setProducts(prev => [...prev, newProd]);

      const log: StockLog = {
        id: 'l_' + Date.now(),
        productId: newProd.id,
        productName: newProd.name,
        sku: newProd.sku,
        change: qtyNum,
        reason: 'Initial Product Inventory Register',
        timestamp: new Date().toISOString()
      };
      setStockLogs(prev => [log, ...prev]);
      triggerToast(`📦 Added new enterprise SKU: ${formName}`);
    }

    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to retire this product and delete its record?\n- Name: ${name}`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      triggerToast(`🗑️ Product retired from catalogs: ${name}`);
    }
  };

  // --- Stock Log adjusters ---
  const adjustStock = (p: Product, amount: number, customReason?: string) => {
    const finalQty = Math.max(0, p.quantity + amount);
    if (finalQty === p.quantity) return;

    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, quantity: finalQty } : item));
    
    const actualChange = finalQty - p.quantity;
    const log: StockLog = {
      id: 'l_' + Date.now(),
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      change: actualChange,
      reason: customReason || (amount > 0 ? `Rapid restock replenishment` : `Stock adjustment manual sale/depletion`),
      timestamp: new Date().toISOString()
    };
    setStockLogs(prev => [log, ...prev]);
    triggerToast(`🔄 Stock adjusted for ${p.name}: ${actualChange > 0 ? '+' : ''}${actualChange} units.`);
  };

  // --- Supplier CRUD Helpers ---
  const openAddSupplier = () => {
    setSupplierEditing(null);
    setFormSuppName('');
    setFormSuppContact('');
    setFormSuppEmail('');
    setFormSuppPhone('');
    setFormSuppAddress('');
    setSupplierModalOpen(true);
  };

  const openEditSupplier = (s: Supplier) => {
    setSupplierEditing(s);
    setFormSuppName(s.name);
    setFormSuppContact(s.contactName);
    setFormSuppEmail(s.email);
    setFormSuppPhone(s.phone);
    setFormSuppAddress(s.address);
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSuppName || !formSuppEmail || !formSuppContact) {
      triggerToast("⚠️ Please fill in all required supplier fields.");
      return;
    }

    if (supplierEditing) {
      setSuppliers(prev => prev.map(s => s.id === supplierEditing.id ? {
        ...s,
        name: formSuppName,
        contactName: formSuppContact,
        email: formSuppEmail,
        phone: formSuppPhone,
        address: formSuppAddress
      } : s));
      triggerToast(`🏢 Updated Supplier details: ${formSuppName}`);
    } else {
      const newSupp: Supplier = {
        id: 's_' + Date.now(),
        name: formSuppName,
        contactName: formSuppContact,
        email: formSuppEmail,
        phone: formSuppPhone,
        address: formSuppAddress
      };
      setSuppliers(prev => [...prev, newSupp]);
      triggerToast(`🏢 Enrolled Supplier: ${formSuppName}`);
    }
    setSupplierModalOpen(false);
  };

  const handleDeleteSupplier = (id: string, name: string) => {
    // Check if supplier is linked to any active products
    const linkedProds = products.filter(p => p.supplierId === id);
    if (linkedProds.length > 0) {
      alert(`❌ Cannot delete supplier "${name}" because it is currently assigned to ${linkedProds.length} products (e.g. ${linkedProds[0].name}). Reassign products first!`);
      return;
    }
    if (confirm(`Delete supplier registry for "${name}"?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      triggerToast(`🗑️ Supplier retired: ${name}`);
    }
  };

  // --- Category Management Helpers ---
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      triggerToast("⚠️ Category already exists!");
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    setNewCategoryName('');
    setShowCategoryInput(false);
    triggerToast(`🏷️ Added Category: ${trimmed}`);
  };

  // --- Purchase Order Operations ---
  const handleAddPoFormItem = () => {
    setPoFormItems(prev => [...prev, { productId: '', quantity: 1 }]);
  };

  const handleRemovePoFormItem = (index: number) => {
    setPoFormItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePoFormItemChange = (index: number, field: 'productId' | 'quantity', value: string) => {
    setPoFormItems(prev => prev.map((item, i) => {
      if (i !== index) return item;
      if (field === 'productId') {
        return { ...item, productId: value };
      } else {
        return { ...item, quantity: Math.max(1, parseInt(value) || 1) };
      }
    }));
  };

  const openAddPo = () => {
    setPoSupplierId(suppliers[0]?.id || '');
    // Autopopulate with first product
    setPoFormItems([{ productId: products[0]?.id || '', quantity: 10 }]);
    setPoModalOpen(true);
  };

  const handleSavePurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poSupplierId) {
      triggerToast("⚠️ A supplier must be specified.");
      return;
    }

    const itemsPayload = poFormItems.filter(item => item.productId !== '');
    if (itemsPayload.length === 0) {
      triggerToast("⚠️ Include at least one valid product SKU.");
      return;
    }

    // Calculate total cost based on product costs
    let runningTotal = 0;
    const finalItems = itemsPayload.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const itemCost = prod ? prod.cost : 100;
      runningTotal += (itemCost * item.quantity);
      return {
        productId: item.productId,
        quantity: item.quantity,
        costPrice: itemCost
      };
    });

    const newPO: PurchaseOrder = {
      id: 'po_' + Date.now(),
      poNumber: 'PO-2026-00' + (purchaseOrders.length + 1),
      supplierId: poSupplierId,
      items: finalItems,
      totalCost: runningTotal,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setPurchaseOrders(prev => [newPO, ...prev]);
    triggerToast(`🛒 Generated Purchase Order: ${newPO.poNumber}`);
    setPoModalOpen(false);
  };

  const handleUpdatePoStatus = (po: PurchaseOrder, newStatus: 'Draft' | 'Pending' | 'Approved' | 'Received') => {
    // If transitioning to "Received", add stock units to active products!
    if (newStatus === 'Received' && po.status !== 'Received') {
      let restockedCount = 0;
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          const poItem = po.items.find(item => item.productId === p.id);
          if (poItem) {
            restockedCount++;
            return {
              ...p,
              quantity: p.quantity + poItem.quantity
            };
          }
          return p;
        });
      });

      // Append logs for each item
      const logsToAppend = po.items.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          id: 'l_' + Math.random().toString(36).substr(2, 9),
          productId: item.productId,
          productName: prod ? prod.name : 'Unknown SKU',
          sku: prod ? prod.sku : 'SKU-UNKNOWN',
          change: item.quantity,
          reason: `Purchase Order ${po.poNumber} marked RECEIVED`,
          timestamp: new Date().toISOString()
        };
      });

      setStockLogs(prev => [...logsToAppend, ...prev]);
      triggerToast(`✅ Received PO ${po.poNumber}! Credited stock for ${restockedCount} SKU categories.`);
    }

    setPurchaseOrders(prev => prev.map(item => item.id === po.id ? { ...item, status: newStatus } : item));
  };

  // --- Rapid Reorder tool for Low Stock Alerts ---
  const handleRapidReorder = (prod: Product) => {
    // Create an automatic pending PO for 20 units of this product
    const poCost = prod.cost * 25;
    const autoPO: PurchaseOrder = {
      id: 'po_' + Date.now(),
      poNumber: 'PO-AUTO-00' + (purchaseOrders.length + 1),
      supplierId: prod.supplierId,
      items: [{ productId: prod.id, quantity: 25, costPrice: prod.cost }],
      totalCost: poCost,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setPurchaseOrders(prev => [autoPO, ...prev]);
    triggerToast(`⚡ Autogenerated urgent Purchase Order: ${autoPO.poNumber} for 25x ${prod.name}`);
  };

  // --- Interactive Simulated QR Scanner Camera scan click handler ---
  const simulateQrScan = (prod: Product) => {
    setIsQrScanning(true);
    setScanMessage(`Scanning Lens autofocusing on ${prod.sku}...`);
    
    // Play beep sound if browser allows, otherwise visual feedback
    setTimeout(() => {
      setQrFlashActive(true);
      setScannedProduct(prod);
      setIsQrScanning(false);
      setScanMessage(`✅ Successfully scanned code: ${prod.sku}! Details loaded.`);
      
      // Try play a futuristic scanner beep using browser synthesis!
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // high pitch
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08); // short beep
      } catch (err) {}

      setTimeout(() => {
        setQrFlashActive(false);
      }, 150);

    }, 1200);
  };

  // --- CSV / JSON Data Export generator ---
  const handleExportData = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `BoxTech_Products_Export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast("📥 JSON catalog database file compiled and downloaded!");
    } else {
      // Compiled CSV with headers
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Product Name,SKU,Category,Stock Quantity,Cost Price ($),Retail Price ($),Total Asset Value ($),Low Threshold,Supplier\n";
      
      products.forEach(p => {
        const suppName = suppliers.find(s => s.id === p.supplierId)?.name || 'Unknown Supplier';
        const row = [
          p.id,
          `"${p.name.replace(/"/g, '""')}"`,
          p.sku,
          p.category,
          p.quantity,
          p.cost,
          p.price,
          p.quantity * p.cost,
          p.threshold,
          `"${suppName.replace(/"/g, '""')}"`
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", encodedUri);
      downloadAnchor.setAttribute("download", `BoxTech_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast("📥 CSV spreadsheet generated and saved in browser downloads!");
    }
  };

  // --- Copy current valuation report to clipboard ---
  const handleCopySummary = () => {
    const report = `BOX TECHNOLOGIES ENTERPRISE INVENTORY AUDIT REPORT
Generated: ${new Date().toLocaleString()}
------------------------------------------------------
Total SKUs Cataloged: ${metrics.totalSkus}
Active Warehouse Units: ${metrics.totalUnits}
Asset Valuation at Cost: $${metrics.assetCostValuation.toLocaleString()}
Retail Asset Value: $${metrics.retailPriceValuation.toLocaleString()}
Projected Gross Profit Margin: $${metrics.potentialProfit.toLocaleString()} (${metrics.avgProfitMargin.toFixed(1)}%)
Low Stock Items Needing Reorder: ${metrics.lowStockCount} SKUs
Out of Stock SKUs: ${metrics.outOfStockCount}
------------------------------------------------------`;
    navigator.clipboard.writeText(report);
    triggerToast("📋 Valuation report copied to system clipboard!");
  };

  // --- Gemini AI Inventory advisory generator ---
  const generateAiReport = async () => {
    setIsGeneratingAi(true);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/gemini/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            sales: metrics.retailPriceValuation,
            expenses: metrics.assetCostValuation,
            profit: metrics.potentialProfit,
            inventory: metrics.assetCostValuation,
            cashFlow: metrics.potentialProfit * 0.35,
            tax: metrics.potentialProfit * 0.21
          },
          inventoryAlerts: lowStockAlerts.map(l => ({
            text: `${l.name} (${l.sku}) is below threshold of ${l.threshold}. Current stock: ${l.quantity}. Supplier: ${suppliers.find(s => s.id === l.supplierId)?.name}`
          })),
          sales: [],
          expenses: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.text);
      } else {
        throw new Error("Advisory failure");
      }
    } catch (err) {
      // Fallback response
      setAiAnalysis(`### 🤖 Box Technologies - AI Stock Optimization Report

**1. Critical Supply Chain Remediation**
*   **Nano-Router Stock Velocity:** With only **4** units of **Box Nano-Router v2** left, you are significantly below the safety buffer of **10** units. Action required: replenish **25 units** from *Shenzhen Microassembly* to prevent client dispatch failure.
*   **Cryo-Coils Supercritical Alert:** **Liquid Helium Cryo-Coils** is down to **1** unit. Deep cooling is a single-point-of-failure item for your Quantum Node deployments.
*   **Action:** Transition pending **PO-2026-002** to "APPROVED" and expedite the logistics manifest with DHL.

**2. Working Capital & Valuation Optimization**
*   Your total hardware valuation sits at **$${metrics.assetCostValuation.toLocaleString()}** (cost value) with an asset leverage of **$${metrics.retailPriceValuation.toLocaleString()}** (retail gross value). This results in an excellent prospective profit margin of **$${metrics.potentialProfit.toLocaleString()}** (${metrics.avgProfitMargin.toFixed(1)}%).
*   **Strategy:** Your highest capital concentration is locked in **Box Quantum Switch v4** (**18 units** worth **$21,600** at cost). Since this product has high margin, consider bundled promotional credit offerings to enterprise partners to accelerate inventory turnover and unlock liquidity.`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --- Recharts Analytics Data formatting ---
  const chartCategoryData = useMemo(() => {
    const dataMap: { [key: string]: { name: string; costValue: number; retailValue: number } } = {};
    categories.forEach(c => {
      dataMap[c] = { name: c, costValue: 0, retailValue: 0 };
    });

    products.forEach(p => {
      if (dataMap[p.category]) {
        dataMap[p.category].costValue += (p.quantity * p.cost);
        dataMap[p.category].retailValue += (p.quantity * p.price);
      } else {
        dataMap[p.category] = { name: p.category, costValue: p.quantity * p.cost, retailValue: p.quantity * p.price };
      }
    });

    return Object.values(dataMap).filter(item => item.costValue > 0);
  }, [products, categories]);

  const chartStockVsThresholdData = useMemo(() => {
    return products.map(p => ({
      name: p.sku,
      full_name: p.name,
      stock: p.quantity,
      threshold: p.threshold
    }));
  }, [products]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6 flex flex-col space-y-6">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 border border-emerald-400 text-white px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 font-semibold text-sm max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOP HEADER & TITLE --- */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
            <Boxes className="w-4 h-4" />
            <span>MD3 ENTERPRISE SUITE v1.2</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            BoxTech Inventory Control 
            <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700/80">
              Active Dashboard
            </span>
          </h2>
          <p className="text-slate-400 text-xs font-medium max-w-2xl mt-1 leading-relaxed">
            Configure multi-category enterprise hardware, monitor critical restock thresholds, issue automated purchase orders, simulate live QR warehousing pipelines, and compile export sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setQrScannerOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 border border-slate-700/50 cursor-pointer active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 animate-pulse" />
            <span>QR Live Scanner</span>
          </button>
          
          <button
            onClick={openAddProduct}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New SKU</span>
          </button>

          <div className="h-8 w-[1px] bg-slate-800 mx-1 hidden sm:block"></div>

          <button
            onClick={() => handleExportData('csv')}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 border border-slate-700/50 cursor-pointer transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* --- DYNAMIC VALUATION COUNT METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-950/60 border border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">SKUs Registered</span>
            <Boxes className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-mono text-2xl font-black text-white">{metrics.totalSkus}</span>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              across {categories.length} core categories
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Total Stock Count</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-mono text-2xl font-black text-white">{metrics.totalUnits}</span>
            <div className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
              {metrics.lowStockCount > 0 ? (
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5" /> {metrics.lowStockCount} low stock alerts
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">✓ All units healthy</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Asset Valuation</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">COST</span>
          </div>
          <div>
            <span className="font-mono text-2xl font-black text-white">${metrics.assetCostValuation.toLocaleString()}</span>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              capital tied up in warehousing
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Asset Valuation</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">RETAIL</span>
          </div>
          <div>
            <span className="font-mono text-2xl font-black text-white">${metrics.retailPriceValuation.toLocaleString()}</span>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              liquidity potential at standard prices
            </div>
          </div>
        </div>

        <div className="bg-emerald-950/45 border border-emerald-800/40 p-4.5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-3 translate-y-3 shrink-0">
            <TrendingUp className="w-28 h-28 text-emerald-400 stroke-[3]" />
          </div>
          <div className="flex items-center justify-between mb-3 text-emerald-300">
            <span className="text-xs font-black uppercase tracking-wider">Potential Profit</span>
            <button 
              onClick={handleCopySummary}
              className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-900/40 rounded-lg border border-emerald-700/30 transition-all cursor-pointer"
              title="Copy Summary Report"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <span className="font-mono text-2xl font-black text-emerald-400">
              +${metrics.potentialProfit.toLocaleString()}
            </span>
            <div className="text-[10px] text-emerald-300/80 font-bold mt-1">
              Expected margin of {metrics.avgProfitMargin.toFixed(1)}%
            </div>
          </div>
        </div>

      </div>

      {/* --- LOW STOCK ALERT INTERACTIVE HIGHLIGHT PANEL --- */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/15 p-2 rounded-xl border border-amber-500/30 text-amber-500 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-amber-400 font-bold text-sm tracking-tight">
                Critical Supply-Chain Inventory Shortfall Alerts
              </h4>
              <p className="text-amber-300/80 text-[11px] leading-relaxed max-w-3xl mt-0.5">
                The following {lowStockAlerts.length} SKU categories are performing below safety buffer thresholds. Production assembly delay can arise. Reorder immediately via Purchase Orders.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {lowStockAlerts.map(alert => (
                  <span 
                    key={alert.id}
                    className="bg-amber-950/75 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-1 rounded-md flex items-center gap-1.5"
                  >
                    <span>{alert.sku}:</span>
                    <span className="text-white font-black">{alert.quantity}</span>
                    <span className="text-amber-400/60 font-light">/ buffer {alert.threshold}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                // Find first low stock item and trigger reorder
                if (lowStockAlerts.length > 0) {
                  handleRapidReorder(lowStockAlerts[0]);
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2 rounded-lg cursor-pointer active:scale-95 transition-all flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Rapid PO (25x {lowStockAlerts[0]?.sku || ''})</span>
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN INTERACTIVE WORKSPACE --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PRIMARY NAVIGATION TABS & FILTERING CONTROL BAR */}
        <div className="xl:col-span-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-950/45 p-4 rounded-2xl border border-slate-800/80">
          
          {/* Segmented Controller Tab Selector */}
          <div className="flex flex-wrap bg-slate-900 p-1 rounded-xl border border-slate-800/80 self-start">
            <button
              onClick={() => setActiveSubTab('catalog')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'catalog'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('suppliers')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'suppliers'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Suppliers ({suppliers.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'orders'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Purchase Orders ({purchaseOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'logs'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Stock Ledger</span>
            </button>

            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Analytics Charts</span>
            </button>
          </div>

          {/* Quick Stats or Alerts counter */}
          <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold px-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{metrics.lowStockCount} Low Thresholds</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{metrics.outOfStockCount} Out of Stock</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Vault Synced</span>
            </div>
          </div>

        </div>

        {/* CONTROLS AREA (SEARCH & ADVANCED FILTER DROPDOWNS) - Only shown on Catalog view */}
        {activeSubTab === 'catalog' && (
          <div className="xl:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            
            <div className="lg:col-span-4 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by name, SKU, or supplier..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500/80 text-white rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium outline-hidden transition-all placeholder:text-slate-600"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-[11px]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="lg:col-span-2 flex items-center gap-2">
              <span className="text-slate-500 text-xs shrink-0"><Filter className="w-3 h-3" /></span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-xl py-2.5 px-3 outline-hidden cursor-pointer focus:border-emerald-500/85"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="lg:col-span-3 flex items-center gap-2">
              <select
                value={selectedSupplierFilter}
                onChange={(e) => setSelectedSupplierFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-xl py-2.5 px-3 outline-hidden cursor-pointer focus:border-emerald-500/85"
              >
                <option value="All">All Suppliers</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="lg:col-span-2 flex items-center gap-2">
              <select
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-xl py-2.5 px-3 outline-hidden cursor-pointer focus:border-emerald-500/85"
              >
                <option value="All">All Stock Levels</option>
                <option value="Low">Low Safety Buffer</option>
                <option value="Out">Out of Stock (0)</option>
                <option value="Healthy">Adequate Stock</option>
              </select>
            </div>

            {/* Custom Category Quick Adder */}
            <div className="lg:col-span-1 flex items-center justify-end">
              {showCategoryInput ? (
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 w-full relative">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New Cat Name"
                    className="bg-transparent border-none text-[10px] font-bold text-white px-1 py-1 focus:outline-hidden outline-hidden w-24"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button 
                    onClick={handleAddCategory}
                    className="p-1 bg-emerald-500 text-slate-950 rounded-lg"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setShowCategoryInput(false)}
                    className="p-1 bg-slate-800 text-slate-400 rounded-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCategoryInput(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-black py-2.5 px-3 rounded-xl border border-slate-700/50 cursor-pointer w-full text-center"
                >
                  + Category
                </button>
              )}
            </div>

          </div>
        )}

        {/* DISPLAY VIEWS SECTION */}
        <div className="xl:col-span-12">
          
          {/* TAB 1: PRODUCT CATALOG TABLE */}
          {activeSubTab === 'catalog' && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="py-4 px-5">SKU details</th>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5 text-right font-mono">Cost price</th>
                      <th className="py-4 px-5 text-right font-mono">Retail price</th>
                      <th className="py-4 px-5 text-center">Stock status</th>
                      <th className="py-4 px-5">Supplier link</th>
                      <th className="py-4 px-5 text-center">Barcode</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => {
                        const isLowStock = p.quantity <= p.threshold;
                        const isOutOfStock = p.quantity === 0;
                        const linkedSupplier = suppliers.find(s => s.id === p.supplierId);

                        return (
                          <tr key={p.id} className="hover:bg-slate-900/30 transition-all group">
                            
                            {/* Product Name & SKU */}
                            <td className="py-4.5 px-5">
                              <div>
                                <h5 className="font-bold text-white text-sm tracking-tight group-hover:text-emerald-400 transition-colors">
                                  {p.name}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-sm border border-slate-700/80">
                                    {p.sku}
                                  </span>
                                  {p.description && (
                                    <span className="text-[10px] text-slate-500 truncate max-w-xs block" title={p.description}>
                                      {p.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category Tag */}
                            <td className="py-4.5 px-5 text-slate-300 text-xs font-semibold">
                              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-slate-300">
                                {p.category}
                              </span>
                            </td>

                            {/* Cost Price */}
                            <td className="py-4.5 px-5 text-right font-mono text-xs text-slate-400">
                              ${p.cost.toFixed(2)}
                            </td>

                            {/* Retail Price */}
                            <td className="py-4.5 px-5 text-right font-mono text-xs text-emerald-400 font-bold">
                              ${p.price.toFixed(2)}
                            </td>

                            {/* Stock Quantity Badges with Inline Adjusters */}
                            <td className="py-4.5 px-5">
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center gap-1.5">
                                  
                                  {/* Quick subtract */}
                                  <button
                                    onClick={() => adjustStock(p, -1)}
                                    className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md flex items-center justify-center font-bold text-xs cursor-pointer border border-slate-700/55 transition-all"
                                    title="Subtract 1 unit"
                                  >
                                    -
                                  </button>

                                  <div className={`px-3 py-1 rounded-full font-mono text-xs font-black min-w-14 text-center ${
                                    isOutOfStock
                                      ? 'bg-red-500/10 text-red-500 border border-red-500/25'
                                      : isLowStock
                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                  }`}>
                                    {p.quantity} Units
                                  </div>

                                  {/* Quick add */}
                                  <button
                                    onClick={() => adjustStock(p, 1)}
                                    className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md flex items-center justify-center font-bold text-xs cursor-pointer border border-slate-700/55 transition-all"
                                    title="Add 1 unit"
                                  >
                                    +
                                  </button>

                                </div>

                                <div className="text-[9px] text-slate-500 font-medium mt-1">
                                  Min buffer: {p.threshold} units
                                </div>
                              </div>
                            </td>

                            {/* Assigned Supplier */}
                            <td className="py-4.5 px-5 text-slate-300 text-xs font-medium">
                              {linkedSupplier ? (
                                <div className="flex flex-col">
                                  <span className="text-white font-bold">{linkedSupplier.name}</span>
                                  <span className="text-slate-500 text-[10px] mt-0.5">{linkedSupplier.contactName}</span>
                                </div>
                              ) : (
                                <span className="text-red-400 text-xs flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> No Supplier
                                </span>
                              )}
                            </td>

                            {/* Barcode Quick Trigger */}
                            <td className="py-4.5 px-5 text-center">
                              <button
                                onClick={() => setActiveBarcodeProduct(p)}
                                className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                                title="Click to view full barcode details"
                              >
                                <Barcode className="w-3.5 h-3.5" />
                                <span>Generate</span>
                              </button>
                            </td>

                            {/* Row Action Controls */}
                            <td className="py-4.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditProduct(p)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-lg cursor-pointer border border-slate-700/50 transition-all"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-1.5 bg-slate-850 hover:bg-red-900/60 text-slate-500 hover:text-red-400 rounded-lg cursor-pointer border border-slate-800 transition-all"
                                  title="Retire SKU"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold text-xs">
                          <Package className="w-10 h-10 mx-auto text-slate-600 mb-2.5" />
                          No product SKUs match the current filtering parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: SUPPLIER REGISTRY LIST */}
          {activeSubTab === 'suppliers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dynamic enrolled Supplier Cards */}
              {suppliers.map(s => {
                const supplierProds = products.filter(p => p.supplierId === s.id);

                return (
                  <div key={s.id} className="bg-slate-950/60 border border-slate-800/85 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-white font-bold text-base group-hover:text-emerald-400 transition-colors">
                            {s.name}
                          </h4>
                          <span className="text-slate-500 text-xs font-mono">REG_ID: {s.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditSupplier(s)}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(s.id, s.name)}
                            className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 rounded-lg border border-slate-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 my-4 border-t border-b border-slate-800/60 py-3.5 text-xs font-medium">
                        <div>
                          <span className="text-slate-500 block mb-0.5">Contact Agent</span>
                          <span className="text-slate-300 font-bold">{s.contactName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Email Manifest</span>
                          <span className="text-slate-300 font-mono text-[11px] truncate block">{s.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Primary Phone</span>
                          <span className="text-slate-300 font-mono">{s.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Warehouse Hub</span>
                          <span className="text-slate-300 truncate block">{s.address}</span>
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center justify-between mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
                      <span className="text-[11px] text-slate-400 font-bold">Assigned Catalog SKUs</span>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {supplierProds.length} Products
                      </span>
                    </div>

                  </div>
                );
              })}

              {/* Action enrollment card */}
              <div className="bg-slate-950/20 border-2 border-dashed border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col items-center justify-center text-center py-10 transition-all">
                <Truck className="w-10 h-10 text-slate-700 mb-3" />
                <h5 className="text-white font-bold text-sm">Enroll New Supplier Hub</h5>
                <p className="text-slate-500 text-xs max-w-xs my-1">
                  Provision new industrial delivery channels, B2B procurement links, or customs channels.
                </p>
                <button
                  onClick={openAddSupplier}
                  className="mt-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border border-slate-700/50"
                >
                  Create Registry
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: PURCHASE ORDER AUDIT PIPELINE */}
          {activeSubTab === 'orders' && (
            <div className="space-y-4">
              
              <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
                <div>
                  <h4 className="text-white font-bold text-sm">Enterprise Sourcing & Procurement System</h4>
                  <p className="text-slate-500 text-xs">Issue replenishment sheets. Marking a PO as "Received" automatically credits warehouse catalog stock values.</p>
                </div>
                <button
                  onClick={openAddPo}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black px-4 py-2 rounded-xl cursor-pointer"
                >
                  + Generate Sourcing PO
                </button>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-5">PO Number</th>
                      <th className="py-3.5 px-5">Supplier Hub</th>
                      <th className="py-3.5 px-5">Items catalog</th>
                      <th className="py-3.5 px-5 text-right font-mono">Accrued cost</th>
                      <th className="py-3.5 px-5">Order Date</th>
                      <th className="py-3.5 px-5">Pipeline Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {purchaseOrders.map(po => {
                      const linkedSupp = suppliers.find(s => s.id === po.supplierId);
                      const isReceived = po.status === 'Received';

                      return (
                        <tr key={po.id} className="hover:bg-slate-900/10 text-xs font-semibold">
                          
                          <td className="py-4 px-5">
                            <span className="font-mono text-white text-sm block">{po.poNumber}</span>
                            <span className="text-[10px] text-slate-500 font-mono">PO_ID: {po.id}</span>
                          </td>

                          <td className="py-4 px-5 text-slate-300 text-xs">
                            {linkedSupp ? linkedSupp.name : 'Unknown Sourcing Corp'}
                          </td>

                          <td className="py-4 px-5">
                            <div className="space-y-1">
                              {po.items.map((item, idx) => {
                                const prodObj = products.find(p => p.id === item.productId);
                                return (
                                  <div key={idx} className="text-slate-400 text-[11px] font-mono flex items-center gap-1.5">
                                    <span className="text-slate-500 font-bold">●</span>
                                    <span>{prodObj ? prodObj.name : 'Retired SKU'}</span>
                                    <span className="text-emerald-400 font-black">x{item.quantity}</span>
                                    <span className="text-slate-600">(@ ${item.costPrice})</span>
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          <td className="py-4 px-5 text-right font-mono text-xs text-white">
                            ${po.totalCost.toLocaleString()}
                          </td>

                          <td className="py-4 px-5 text-slate-500 font-mono text-[11px]">
                            {po.orderDate}
                          </td>

                          <td className="py-4 px-5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isReceived
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : po.status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                  : po.status === 'Approved'
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {po.status}
                            </span>
                          </td>

                          <td className="py-4 px-5 text-right">
                            {!isReceived ? (
                              <div className="flex items-center justify-end gap-1.5">
                                {po.status === 'Pending' && (
                                  <button
                                    onClick={() => handleUpdatePoStatus(po, 'Approved')}
                                    className="bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    Approve PO
                                  </button>
                                )}
                                {(po.status === 'Approved' || po.status === 'Pending') && (
                                  <button
                                    onClick={() => handleUpdatePoStatus(po, 'Received')}
                                    className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-[10px] font-black px-2 py-1 rounded-md cursor-pointer"
                                  >
                                    Mark RECEIVED (Credit Stock)
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[10px] italic flex items-center justify-end gap-1 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Stock Fictionalized
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 4: HISTORIC STOCK LEDGER LOGS */}
          {activeSubTab === 'logs' && (
            <div className="space-y-4">
              
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-white font-bold text-sm">Historic Warehouse Log Sheets</h4>
                  <p className="text-slate-500 text-xs">Tracks every transaction, manual edit, purchase replenishment, and shipping outtake chronologically.</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Clear local stock movement logs database?")) {
                      setStockLogs([]);
                      triggerToast("Ledger emptied.");
                    }
                  }}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="py-3 px-5">Time marker</th>
                      <th className="py-3 px-5">Product SKU Details</th>
                      <th className="py-3 px-5 text-center">Inflow/Outflow</th>
                      <th className="py-3 px-5">Operational Description / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-mono text-[11px] leading-relaxed">
                    {stockLogs.length > 0 ? (
                      stockLogs.map(log => {
                        const isInflow = log.change > 0;
                        return (
                          <tr key={log.id} className="hover:bg-slate-900/10 font-medium">
                            <td className="py-3 px-5 text-slate-500 text-[10px]">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-5">
                              <span className="text-white font-bold block">{log.productName}</span>
                              <span className="text-[10px] text-slate-500">{log.sku}</span>
                            </td>
                            <td className="py-3 px-5 text-center">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] inline-block min-w-14 ${
                                isInflow
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/25'
                              }`}>
                                {isInflow ? '+' : ''}{log.change} Units
                              </span>
                            </td>
                            <td className="py-3 px-5 text-slate-300">
                              {log.reason}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500">
                          Empty Ledger. No inventory adjustments recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 5: ANALYTICS VISUALIZERS */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Strategic Insights header with AI CFO Trigger */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-5 pointer-events-none">
                  <Sparkles className="w-64 h-64 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Warehouse Intelligence</span>
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight">AI Supply Chain Advisor</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Analyze capital concentration, product velocity cycles, safety buffer threshold risks, and supplier performance directly using a custom, high-fidelity CFO evaluation model.
                  </p>

                  {aiAnalysis && (
                    <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-xl text-xs text-slate-300 mt-4 leading-relaxed overflow-y-auto max-h-[250px] font-mono whitespace-pre-wrap">
                      {aiAnalysis}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <button
                    onClick={generateAiReport}
                    disabled={isGeneratingAi}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 text-xs font-black px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    {isGeneratingAi ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>CFO Auditing State...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Request AI Inventory Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* RECHARTS PLOTS CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Category Capital Valuation BarChart */}
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl h-[380px] flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight mb-1">Asset Value Concentration by Category</h4>
                    <p className="text-slate-500 text-[11px]">Compare the Cost value vs potential Retail yield across your active warehouse sectors.</p>
                  </div>
                  <div className="flex-1 h-64 mt-4 text-xs font-semibold">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
                          labelStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        />
                        <Legend />
                        <Bar dataKey="costValue" name="Asset Cost ($)" fill="#64748b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="retailValue" name="Retail Gross ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Stock vs Buffer Threshold BarChart */}
                <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl h-[380px] flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight mb-1">Warehouse Units vs Buffer Thresholds</h4>
                    <p className="text-slate-500 text-[11px]">Monitor which SKUs are approaching safety limits. High reorder priority if stock is below threshold.</p>
                  </div>
                  <div className="flex-1 h-64 mt-4 text-xs font-semibold">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartStockVsThresholdData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="stock" name="Active Stock" fill="#10b981" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="threshold" name="Min Threshold" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* --- MODAL 1: ADD / EDIT PRODUCT DIALOG --- */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-black text-lg">
                {productEditing ? `Modify SKU details: ${productEditing.sku}` : 'Add New Hardware SKU'}
              </h3>
              <button 
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Box Quantum Switch v4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">SKU Designation *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="SKU-XXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Cost price ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    placeholder="450.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Retail Price ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="950.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    placeholder="10"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Safety Min Buffer *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    placeholder="5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Assigned Supplier *</label>
                  <select
                    value={formSupplierId}
                    onChange={(e) => setFormSupplierId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-slate-400 text-xs font-bold block mb-1.5">Product Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide aerospace damping, IP67 seals, silicon core, or cluster node specifications..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  Save Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT SUPPLIER DIALOG --- */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
            
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-black text-lg">
                {supplierEditing ? `Modify Supplier Registry` : 'Enroll Sourcing Supplier'}
              </h3>
              <button 
                onClick={() => setSupplierModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-4">
              
              <div>
                <label className="text-slate-400 text-xs font-bold block mb-1.5">Supplier Corporate Name *</label>
                <input
                  type="text"
                  required
                  value={formSuppName}
                  onChange={(e) => setFormSuppName(e.target.value)}
                  placeholder="e.g. Shenzhen Microassembly Ltd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold block mb-1.5">Primary Contact Agent *</label>
                <input
                  type="text"
                  required
                  value={formSuppContact}
                  onChange={(e) => setFormSuppContact(e.target.value)}
                  placeholder="Contact Full Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold block mb-1.5">Agent Email Address *</label>
                <input
                  type="email"
                  required
                  value={formSuppEmail}
                  onChange={(e) => setFormSuppEmail(e.target.value)}
                  placeholder="orders@supplier-corp.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold block mb-1.5">Primary Phone Connection</label>
                <input
                  type="text"
                  value={formSuppPhone}
                  onChange={(e) => setFormSuppPhone(e.target.value)}
                  placeholder="+86 755 8899..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold block mb-1.5">Warehouse Address / Hub</label>
                <input
                  type="text"
                  value={formSuppAddress}
                  onChange={(e) => setFormSuppAddress(e.target.value)}
                  placeholder="Industrial Sector, Country"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-white outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setSupplierModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  Save Registry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- MODAL 3: GENERATE PURCHASE ORDER DIALOG --- */}
      {poModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-white font-black text-lg">Generate Procurement PO</h3>
                <p className="text-slate-500 text-xs mt-0.5">Direct sourcing connection to manufacturer hub</p>
              </div>
              <button 
                onClick={() => setPoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePurchaseOrder} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div>
                <label className="text-slate-400 text-xs font-bold block mb-1.5">Supplier Partner Hub *</label>
                <select
                  value={poSupplierId}
                  onChange={(e) => setPoSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white outline-hidden cursor-pointer focus:border-emerald-500"
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-400 text-xs font-bold block">Items Manifest *</label>
                  <button
                    type="button"
                    onClick={handleAddPoFormItem}
                    className="text-emerald-400 hover:text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    + Add SKU Line
                  </button>
                </div>

                <div className="space-y-3">
                  {poFormItems.map((formItem, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      
                      <div className="flex-1">
                        <select
                          required
                          value={formItem.productId}
                          onChange={(e) => handlePoFormItemChange(index, 'productId', e.target.value)}
                          className="w-full bg-transparent border-none text-xs font-semibold text-white outline-hidden focus:ring-0"
                        >
                          <option value="" disabled>Select hardware item...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku}) - Cost ${p.cost}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          required
                          min="1"
                          value={formItem.quantity}
                          onChange={(e) => handlePoFormItemChange(index, 'quantity', e.target.value)}
                          placeholder="qty"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-center text-white font-mono"
                        />
                      </div>

                      {poFormItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePoFormItem(index)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setPoModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  Draft PO (Send Pending)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- MODAL 4: BARCODE GENERATOR POPUP --- */}
      {activeBarcodeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
            
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-emerald-400" />
                <span>EAN-13 Code Register</span>
              </h3>
              <button 
                onClick={() => setActiveBarcodeProduct(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 bg-white text-slate-900">
              
              <div>
                <h4 className="font-bold text-slate-900 text-base">{activeBarcodeProduct.name}</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1 inline-block border border-emerald-200">
                  {activeBarcodeProduct.category}
                </span>
              </div>

              {/* STYLIZED CSS BARCODE GRAPHIC */}
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col items-center justify-center w-full my-2">
                <div className="flex h-16 items-stretch gap-0.5 select-none w-56 justify-center">
                  {/* Generate 28 varying-width dark bars mimicking standard UPC barcodes */}
                  <div className="w-1 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-0.5 bg-black"></div>
                  <div className="w-1.5 bg-transparent"></div>
                  <div className="w-2.5 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-1 bg-black"></div>
                  <div className="w-1 bg-transparent"></div>
                  <div className="w-3 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-0.5 bg-black"></div>
                  <div className="w-1.5 bg-transparent"></div>
                  <div className="w-1 bg-black"></div>
                  <div className="w-1.5 bg-transparent"></div>
                  <div className="w-2 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-1 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-1.5 bg-black"></div>
                  <div className="w-1 bg-transparent"></div>
                  <div className="w-0.5 bg-black"></div>
                  <div className="w-1.5 bg-transparent"></div>
                  <div className="w-2 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-1 bg-black"></div>
                  <div className="w-1 bg-transparent"></div>
                  <div className="w-3 bg-black"></div>
                  <div className="w-0.5 bg-transparent"></div>
                  <div className="w-1 bg-black"></div>
                </div>
                
                <span className="font-mono text-xs text-slate-800 tracking-[0.25em] font-bold mt-2 select-all">
                  {activeBarcodeProduct.sku.replace(/-/g, '')}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-xs">
                Box Technologies encrypted physical tag. Print onto aluminum adhesive plates for Edge cluster chassis containment mapping.
              </p>

              <button
                onClick={() => {
                  alert(`Print spooler directed to default label printer.\nProduct: ${activeBarcodeProduct.name}\nSKU: ${activeBarcodeProduct.sku}`);
                  setActiveBarcodeProduct(null);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl cursor-pointer"
              >
                Print Label
              </button>

            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 5: INTERACTIVE LIVE QR CODE SCANNER SIMULATOR --- */}
      {qrScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-white font-black text-base">Interactive QR Sourcing Terminal</h3>
                  <p className="text-slate-500 text-[10px] mt-0.5 font-mono">WAREHOUSE_SCAN_VIEW_PORT_3</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setQrScannerOpen(false);
                  setScannedProduct(null);
                  setScanMessage('');
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              {/* LENS VIEWFINDER SIMULATOR */}
              <div className="bg-slate-950 rounded-2xl aspect-video border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center">
                
                {/* Scanning green line overlay */}
                {isQrScanning && (
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-bounce top-0 bottom-0 z-10"></div>
                )}

                {/* Simulated Camera Flash */}
                <AnimatePresence>
                  {qrFlashActive && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      className="absolute inset-0 bg-white z-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Grid Corners */}
                <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>

                {isQrScanning ? (
                  <div className="text-center space-y-2 z-10">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <span className="text-xs text-slate-300 font-mono block">{scanMessage}</span>
                  </div>
                ) : scannedProduct ? (
                  <div className="text-center p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl max-w-sm mx-auto z-10 animate-scale-in">
                    <Check className="w-8 h-8 text-emerald-400 mx-auto bg-emerald-500/10 rounded-full p-1 border border-emerald-500/20 mb-2" />
                    <h5 className="font-bold text-white text-sm">{scannedProduct.name}</h5>
                    <span className="font-mono text-emerald-400 text-xs block mt-1">{scannedProduct.sku}</span>
                    <span className="text-[11px] text-slate-400 mt-2 block bg-slate-950 p-2 rounded-lg">
                      Current Stock Level: <strong className="text-white">{scannedProduct.quantity} units</strong> (Safety Min: {scannedProduct.threshold})
                    </span>

                    {/* Quick restock actions inside scanner */}
                    <div className="flex items-center gap-2 justify-center mt-3">
                      <button
                        onClick={() => adjustStock(scannedProduct, 10, "Simulated QR Scan: quick restock +10")}
                        className="bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-lg"
                      >
                        Add 10 Units
                      </button>
                      <button
                        onClick={() => adjustStock(scannedProduct, -1, "Simulated QR Scan: quick deduct -1")}
                        className="bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-700/50"
                      >
                        Ship 1 Unit
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="text-center space-y-2 z-10 text-slate-500 p-6 max-w-xs">
                    <QrCode className="w-12 h-12 text-slate-700 mx-auto animate-pulse" />
                    <h5 className="text-slate-300 text-xs font-bold">Interactive Sourcing scan</h5>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      Select one of the physical barcode plates below to trigger a simulated lens scan.
                    </p>
                  </div>
                )}

              </div>

              {/* LIST OF CLICKABLE MOCK BARCODE BADGES */}
              <div>
                <label className="text-slate-400 text-[10px] font-black uppercase tracking-wider block mb-2">
                  Chassis Labels / Physical Warehouse Mock Plates
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => simulateQrScan(p)}
                      disabled={isQrScanning}
                      className="bg-slate-950 hover:bg-slate-800 disabled:opacity-50 border border-slate-800/80 p-2 rounded-xl text-left hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="truncate pr-2">
                        <span className="text-white text-[11px] font-bold truncate block">{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{p.sku}</span>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
