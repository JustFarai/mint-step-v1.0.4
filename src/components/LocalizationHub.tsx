import React, { useState, useEffect } from 'react';
import { 
  Globe, DollarSign, Calendar, Sliders, ArrowRightLeft, RefreshCw, 
  CheckCircle2, Sparkles, Languages, Flag, Layers, Layout, ArrowRight, 
  ShieldCheck, Check, Clock, Table, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  defaultLang: string;
  defaultCurrency: string;
  defaultDateFormat: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  usdFxRate: number; // relative to USD base
}

export const supportedCountries: CountryOption[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', defaultLang: 'en', defaultCurrency: 'USD', defaultDateFormat: 'MM/DD/YYYY' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', defaultLang: 'ar', defaultCurrency: 'AED', defaultDateFormat: 'DD/MM/YYYY' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', defaultLang: 'en', defaultCurrency: 'GBP', defaultDateFormat: 'DD/MM/YYYY' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', defaultLang: 'de', defaultCurrency: 'EUR', defaultDateFormat: 'DD.MM.YYYY' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', defaultLang: 'es', defaultCurrency: 'EUR', defaultDateFormat: 'DD/MM/YYYY' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', defaultLang: 'ja', defaultCurrency: 'JPY', defaultDateFormat: 'YYYY/MM/DD' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', defaultLang: 'pt', defaultCurrency: 'BRL', defaultDateFormat: 'DD/MM/YYYY' },
];

export const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
];

export const supportedCurrencies: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', usdFxRate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', usdFxRate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', usdFxRate: 0.77 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', usdFxRate: 3.67 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', usdFxRate: 156.40 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', usdFxRate: 5.45 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', usdFxRate: 83.50 },
];

export const translationDictionary: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'WealthFlow Executive Dashboard',
    goals: 'Goal Tracking & Gamification',
    verification: 'Official Verification System',
    monetization: 'Monetization & Billing Engine',
    sync: 'Offline Sync & Local Database',
    welcome: 'Welcome back, Felix Zinyenge',
    netRevenue: 'Net Revenue (YTD)',
    taxDeductions: 'Section 179 Deductions',
    activeStreak: '14 Days Daily Streak',
    latestInvoice: 'Invoice #INV-2026-088 - Edge Hardware Deployment'
  },
  ar: {
    dashboard: 'لوحة التحكم التنفيذية لتدفق الثروة',
    goals: 'تتبع الأهداف والتأثير التفاعلي',
    verification: 'نظام التحقق الرسمي للشركات',
    monetization: 'محرك الاشتراكات والفوترة',
    sync: 'المزامنة بدون إنترنت وقاعدة البيانات المحلية',
    welcome: 'مرحباً بعودتك، فيليكس زينينجي',
    netRevenue: 'صافي الإيرادات حتى تاريخه',
    taxDeductions: 'خصومات المادة 179 الضريبية',
    activeStreak: 'سلسلة يومية 14 يوم',
    latestInvoice: 'فاتورة رقم #INV-2026-088 - نشر أجهزة الحوسبة الطرفية'
  },
  es: {
    dashboard: 'Panel Ejecutivo de Flujo de Riqueza',
    goals: 'Seguimiento de Objetivos y Gamificación',
    verification: 'Sistema Oficial de Verificación',
    monetization: 'Motor de Monetización y Facturación',
    sync: 'Sincronización Offline y Base de Datos Local',
    welcome: 'Bienvenido de nuevo, Felix Zinyenge',
    netRevenue: 'Ingresos Netos (AÑO)',
    taxDeductions: 'Deducciones Sección 179',
    activeStreak: 'Racha Diaria de 14 Días',
    latestInvoice: 'Factura #INV-2026-088 - Despliegue de Hardware'
  },
  de: {
    dashboard: 'Executive WealthFlow Dashboard',
    goals: 'Zielverfolgung & Gamifizierung',
    verification: 'Offizielles Verifizierungssystem',
    monetization: 'Monetarisierung & Abrechnung',
    sync: 'Offline-Synchronisierung & Lokale Datenbank',
    welcome: 'Willkommen zurück, Felix Zinyenge',
    netRevenue: 'Nettoumsatz (YTD)',
    taxDeductions: 'Abschreibungen nach Section 179',
    activeStreak: '14 Tage Serie',
    latestInvoice: 'Rechnung #INV-2026-088 - Hardware-Einsatz'
  },
  ja: {
    dashboard: 'ウェルスフロー・エグゼクティブ・ダッシュボード',
    goals: '目標トラッキング＆ゲーミフィケーション',
    verification: '公式認証システム',
    monetization: '収益化＆請求エンジン',
    sync: 'オフライン同期＆ローカルデータベース',
    welcome: 'お帰りなさい、フェリックス・ジニエンゲ',
    netRevenue: '純収益（年初来）',
    taxDeductions: 'セクション179税控除',
    activeStreak: '14日連続アクティブストリーク',
    latestInvoice: '請求書 #INV-2026-088 - エッジハードウェア展開'
  }
};

export const LocalizationHub: React.FC = () => {
  // Preferences State
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [selectedDateFormat, setSelectedDateFormat] = useState<string>('MM/DD/YYYY');
  const [numberFormatStyle, setNumberFormatStyle] = useState<'COMMA_DECIMAL' | 'DOT_DECIMAL' | 'SPACE_DECIMAL'>('COMMA_DECIMAL');

  // FX Rates State
  const [fxRates, setFxRates] = useState<CurrencyOption[]>(supportedCurrencies);
  const [lastFxUpdate, setLastFxUpdate] = useState<string>('2026-07-22 03:25:00 UTC');

  // Interactive FX Converter state
  const [calcBaseAmountUsd, setCalcBaseAmountUsd] = useState<number>(50000); // e.g. $50,000 Section 179 Equipment

  // Active Tab
  const [activeTab, setActiveTab] = useState<'PREFERENCES' | 'FX_RATES' | 'PREVIEW_CARD'>('PREFERENCES');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // Sync country change to default defaults
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const matched = supportedCountries.find(c => c.code === countryCode);
    if (matched) {
      setSelectedLang(matched.defaultLang);
      setSelectedCurrency(matched.defaultCurrency);
      setSelectedDateFormat(matched.defaultDateFormat);
      triggerToast(`🌍 Localized defaults applied for ${matched.name}!`);
    }
  };

  // Automatically fetch / update FX exchange rates
  const handleRefreshFxRates = () => {
    triggerToast("⚡ Fetching real-time central bank exchange rates...");
    setTimeout(() => {
      setFxRates(prev => prev.map(c => {
        if (c.code === 'USD') return c;
        // Apply slight random market fluctuation
        const delta = (Math.random() - 0.5) * 0.02;
        return {
          ...c,
          usdFxRate: parseFloat((c.usdFxRate * (1 + delta)).toFixed(2))
        };
      }));
      setLastFxUpdate(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
      triggerToast("✅ Foreign exchange rates updated!");
    }, 1200);
  };

  // Helper: Format Number according to selected currency & locale
  const formatLocalizedCurrency = (amountInUsd: number) => {
    const currObj = fxRates.find(c => c.code === selectedCurrency) || fxRates[0];
    const convertedVal = amountInUsd * currObj.usdFxRate;

    try {
      return new Intl.NumberFormat(selectedLang, {
        style: 'currency',
        currency: currObj.code
      }).format(convertedVal);
    } catch (e) {
      return `${currObj.symbol}${convertedVal.toLocaleString()}`;
    }
  };

  const activeLangObj = supportedLanguages.find(l => l.code === selectedLang) || supportedLanguages[0];
  const isRtl = activeLangObj.dir === 'rtl';

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full bg-slate-950 text-slate-100 p-4 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative transition-all"
    >
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-400 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-black text-xs flex items-center space-x-2 border border-emerald-300"
          >
            <Globe className="w-4 h-4 fill-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Globe className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">MintStep International Localization Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                RTL & Multi-Currency Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Global country standards, language dictionary, RTL layout engine, date formats & real-time FX rates</p>
          </div>
        </div>

        {/* Selected Locale Pill */}
        <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center space-x-3 rtl:space-x-reverse">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">Country / Region</span>
            <span className="text-emerald-400 font-bold">{supportedCountries.find(c => c.code === selectedCountry)?.flag} {selectedCountry}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">Language & Dir</span>
            <span className="text-indigo-400 font-bold">{activeLangObj.name} ({activeLangObj.dir.toUpperCase()})</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block">Currency</span>
            <span className="text-amber-400 font-bold">{selectedCurrency}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'PREFERENCES', label: 'Regional Preferences & i18n', icon: Sliders },
          { id: 'FX_RATES', label: 'Live FX Exchange Rates Engine', icon: ArrowRightLeft },
          { id: 'PREVIEW_CARD', label: 'Live Localized UI Preview', icon: Eye },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 rtl:space-x-reverse ${
              activeTab === tab.id 
                ? 'bg-emerald-400 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------- TAB 1: REGIONAL PREFERENCES ------------------- */}
      {activeTab === 'PREFERENCES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Country Selection */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400">
              <Flag className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase text-slate-100">1. Select Primary Country / Territory</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {supportedCountries.map(c => (
                <button
                  key={c.code}
                  onClick={() => handleCountryChange(c.code)}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedCountry === c.code 
                      ? 'bg-slate-950 border-emerald-500 text-emerald-400 font-bold shadow-md' 
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-lg">{c.flag}</span>
                    <span className="font-sans font-bold">{c.name} ({c.code})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{c.defaultCurrency} • {c.defaultDateFormat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language & Layout Direction */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            
            {/* Language Switch */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-indigo-400">
                <Languages className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase text-slate-100">2. Interface Language & Direction</h3>
              </div>

              <select
                value={selectedLang}
                onChange={(e) => {
                  setSelectedLang(e.target.value);
                  triggerToast(`🌐 Switched language to ${supportedLanguages.find(l => l.code === e.target.value)?.name}`);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-indigo-400"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.name} - {l.nativeName} ({l.dir.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-400">
                <DollarSign className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase text-slate-100">3. Accounting Currency</h3>
              </div>

              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
              >
                {fxRates.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name} (FX: {c.usdFxRate})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Format */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-400">
                <Calendar className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase text-slate-100">4. Date Formatting Standard</h3>
              </div>

              <select
                value={selectedDateFormat}
                onChange={(e) => setSelectedDateFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/22/2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 22/07/2026)</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY (e.g. 22.07.2026)</option>
                <option value="YYYY/MM/DD">YYYY/MM/DD (e.g. 2026/07/22)</option>
              </select>
            </div>

          </div>

        </div>
      )}

      {/* ------------------- TAB 2: LIVE FX EXCHANGE RATES ------------------- */}
      {activeTab === 'FX_RATES' && (
        <div className="space-y-6">
          
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-100 tracking-wider">Automated Foreign Exchange (FX) Rate Engine</h3>
                <p className="text-xs text-slate-400">Base Currency: USD ($1.00) • Last FX Sync: {lastFxUpdate}</p>
              </div>

              <button
                onClick={handleRefreshFxRates}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 rtl:space-x-reverse cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Fetch Latest Central Bank Rates</span>
              </button>
            </div>

            {/* Rates Table */}
            <div className="overflow-x-auto font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="p-3">Currency Code</th>
                    <th className="p-3">Currency Name</th>
                    <th className="p-3">Symbol</th>
                    <th className="p-3">1.00 USD Equivalent</th>
                    <th className="p-3">10,000 USD Equipment Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {fxRates.map(c => (
                    <tr key={c.code} className="hover:bg-slate-950/50">
                      <td className="p-3 font-bold text-emerald-400">{c.code}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3 text-amber-400 font-bold">{c.symbol}</td>
                      <td className="p-3 font-mono">{c.usdFxRate.toFixed(2)} {c.code}</td>
                      <td className="p-3 font-mono text-indigo-400 font-bold">
                        {c.symbol} {(10000 * c.usdFxRate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Currency Converter */}
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 font-mono text-xs">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">Live Section 179 Localized Equipment Calculator</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Enter Amount in USD ($):</label>
                <input 
                  type="number"
                  value={calcBaseAmountUsd}
                  onChange={(e) => setCalcBaseAmountUsd(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Localized Output ({selectedCurrency}):</span>
                  <span className="text-emerald-400 text-xl font-bold font-sans">
                    {formatLocalizedCurrency(calcBaseAmountUsd)}
                  </span>
                </div>
                <Globe className="w-8 h-8 text-emerald-400 opacity-80" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------- TAB 3: LOCALIZED UI PREVIEW ------------------- */}
      {activeTab === 'PREVIEW_CARD' && (
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase text-slate-100 tracking-wider">Live Translated & Formatted Interface Preview</h3>
            <p className="text-xs text-slate-400">Rendering UI strings in <strong className="text-indigo-400">{activeLangObj.name} ({activeLangObj.nativeName})</strong> with <strong className="text-amber-400">{selectedCurrency}</strong> currency and <strong className="text-emerald-400">{activeLangObj.dir.toUpperCase()}</strong> text flow direction.</p>
          </div>

          {/* Mock Dashboard Preview Box */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-base font-black text-slate-100">
                {translationDictionary[selectedLang]?.dashboard || translationDictionary['en'].dashboard}
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                {selectedDateFormat}
              </span>
            </div>

            <p className="text-xs text-slate-400 italic">
              "{translationDictionary[selectedLang]?.welcome || translationDictionary['en'].welcome}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
              
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">{translationDictionary[selectedLang]?.netRevenue || translationDictionary['en'].netRevenue}</span>
                <span className="text-emerald-400 font-bold text-lg font-sans">{formatLocalizedCurrency(148920)}</span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">{translationDictionary[selectedLang]?.taxDeductions || translationDictionary['en'].taxDeductions}</span>
                <span className="text-indigo-400 font-bold text-lg font-sans">{formatLocalizedCurrency(38500)}</span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block">{translationDictionary[selectedLang]?.activeStreak || translationDictionary['en'].activeStreak}</span>
                <span className="text-amber-400 font-bold text-lg">🔥 14 Days</span>
              </div>

            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Latest Document Transaction:</span>
              <p className="font-sans font-bold">{translationDictionary[selectedLang]?.latestInvoice || translationDictionary['en'].latestInvoice}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LocalizationHub;
