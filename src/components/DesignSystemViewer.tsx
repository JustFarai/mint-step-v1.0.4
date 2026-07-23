import React, { useState } from 'react';
import { 
  Palette, Type, Grid, Square, MousePointer, Layers, 
  TrendingUp, Star, Sparkles, Copy, Check, Sun, Moon, Info 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function DesignSystemViewer() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (token: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  // 1. Color Tokens
  const colors = {
    light: [
      { name: 'Primary (Mint Green)', token: 'primaryLight', hex: '#00A86B', text: '#FFFFFF', desc: 'Core brand action' },
      { name: 'Primary Container', token: 'primaryContainerLight', hex: '#D1F7E4', text: '#003820', desc: 'Accent background fills' },
      { name: 'Secondary (Slate Green)', token: 'secondaryLight', hex: '#3B5E4F', text: '#FFFFFF', desc: 'Supporting text & hierarchy' },
      { name: 'Tertiary (Trust Blue)', token: 'tertiaryLight', hex: '#2C5E7A', text: '#FFFFFF', desc: 'Secondary statistics & focus' },
      { name: 'Success (Secure Teal)', token: 'successLight', hex: '#198754', text: '#FFFFFF', desc: 'Positive actions & steps' },
      { name: 'Error (Warning Red)', token: 'errorLight', hex: '#BA1A1A', text: '#FFFFFF', desc: 'Critical alerts & failures' },
      { name: 'Warning (Saffron Gold)', token: 'warningLight', hex: '#D67D00', text: '#FFFFFF', desc: 'Pending states & cache status' },
      { name: 'Background', token: 'backgroundLight', hex: '#F8F9FA', text: '#191C1A', desc: 'Window canvas color' },
      { name: 'Surface', token: 'surfaceLight', hex: '#FFFFFF', text: '#191C1A', desc: 'Elevated container backgrounds' },
    ],
    dark: [
      { name: 'Primary (Neon Mint)', token: 'primaryDark', hex: '#00E676', text: '#003820', desc: 'Core dark mode action' },
      { name: 'Primary Container', token: 'primaryContainerDark', hex: '#005231', text: '#9FFCBF', desc: 'Dark container accent' },
      { name: 'Secondary (Muted Mint)', token: 'secondaryDark', hex: '#B1CCBC', text: '#1C3528', desc: 'Supporting dark hierarchy' },
      { name: 'Tertiary (Calm Blue)', token: 'tertiaryDark', hex: '#97CBEC', text: '#00344B', desc: 'Dark stats & indicators' },
      { name: 'Success (Secure Teal)', token: 'successDark', hex: '#20C997', text: '#003828', desc: 'Dark mode positive actions' },
      { name: 'Error (M3 Rose Red)', token: 'errorDark', hex: '#FFB4AB', text: '#690005', desc: 'Dark warning alerts' },
      { name: 'Warning (Gold Saffron)', token: 'warningDark', hex: '#FFFFC107', text: '#422B00', desc: 'Dark warning states' },
      { name: 'Background', token: 'backgroundDark', hex: '#0F1110', text: '#E1E3E0', desc: 'Pure dark slate background' },
      { name: 'Surface', token: 'surfaceDark', hex: '#171A19', text: '#E1E3E0', desc: 'M3 elevated dark card' },
    ]
  };

  // 2. Spacing Tokens (4px Grid Base)
  const spacing = [
    { token: 'spaceXxxs', size: '2px', value: '0.125rem', desc: 'Subtle item alignments' },
    { token: 'spaceXxs', size: '4px', value: '0.25rem', desc: 'Icon spacing or mini labels' },
    { token: 'spaceXs', size: '8px', value: '0.5rem', desc: 'Inner paddings or small list gap' },
    { token: 'spaceSm', size: '12px', value: '0.75rem', desc: 'Element margin / card elements' },
    { token: 'spaceMd', size: '16px', value: '1.0rem', desc: 'Standard M3 screen and card padding' },
    { token: 'spaceLg', size: '24px', value: '1.5rem', desc: 'Section boundaries and inner-hero padding' },
    { token: 'spaceXl', size: '32px', value: '2.0rem', desc: 'Page headers spacing' },
    { token: 'spaceXxl', size: '48px', value: '3.0rem', desc: 'Massive hero-to-card divisions' },
  ];

  // 3. Typography Hierarchy
  const typography = [
    { name: 'Display Large', size: '57px', weight: '800 (ExtraBold)', style: 'tracking-[-1.0px]', desc: 'Major financial statistics or key counts' },
    { name: 'Headline Large', size: '32px', weight: '700 (Bold)', style: 'tracking-[-0.25px]', desc: 'Page headers & banner titles' },
    { name: 'Title Large', size: '22px', weight: '600 (SemiBold)', style: 'font-semibold', desc: 'Standard card titles & headers' },
    { name: 'Title Medium', size: '16px', weight: '600 (SemiBold)', style: 'font-semibold', desc: 'Subsections & secondary details' },
    { name: 'Body Large', size: '16px', weight: '400 (Regular)', style: 'font-normal', desc: 'Core descriptive paragraphs' },
    { name: 'Body Medium', size: '14px', weight: '400 (Regular)', style: 'font-normal', desc: 'Subtexts, descriptions, and metadata' },
    { name: 'Label Large', size: '14px', weight: '600 (SemiBold)', style: 'font-semibold', desc: 'Buttons, actions, and tabs texts' },
    { name: 'Label Small', size: '11px', weight: '600 (SemiBold)', style: 'font-semibold tracking-wider uppercase', desc: 'Overlines and badges' },
  ];

  // 4. Shapes & Border Radius
  const radius = [
    { token: 'radiusXs', size: '4px', desc: 'Subtle form widgets' },
    { token: 'radiusSm', size: '8px', desc: 'Chips, tags, or small action buttons' },
    { token: 'radiusMd', size: '12px', desc: 'Standard input textfields, buttons' },
    { token: 'radiusLg', size: '16px', desc: 'Primary elevated system cards' },
    { token: 'radiusXl', size: '24px', desc: 'Large dialogs, action sheets' },
    { token: 'radiusXxl', size: '28px', desc: 'Full-screen sheet sheets' },
    { token: 'radiusFull', size: '9999px', desc: 'Circular avatars or pill badges' },
  ];

  // Mock Financial Sparkline Data
  const chartData = [
    { value: 120 }, { value: 180 }, { value: 160 }, 
    { value: 240 }, { value: 220 }, { value: 320 }, 
    { value: 390 }, { value: 350 }, { value: 450 }
  ];

  const currentColors = theme === 'light' ? colors.light : colors.dark;

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-800'
    }`}>
      {/* Header with quick Light/Dark toggler */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-5 mb-6 flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Material Design 3 Spec
          </span>
          <h2 className="text-xl font-bold tracking-tight">MintStep Design Tokens</h2>
          <p className="text-xs text-slate-400 mt-0.5">Professional, Minimal, Friendly, and Financial Aesthetics</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              theme === 'light' 
                ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Theme</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              theme === 'dark' 
                ? 'bg-zinc-850 text-emerald-400 shadow-sm border border-zinc-700/50' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Theme</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* 1. Color Palette Block */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <Palette className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">1. Color Tokens</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentColors.map((color) => (
              <div 
                key={color.token}
                className="group relative rounded-xl p-3.5 border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 flex flex-col justify-between hover:border-emerald-500/40 transition-all cursor-pointer"
                onClick={() => copyToClipboard(color.token, `Color(${color.hex.replace('#', '0xFF')})`)}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg shadow-inner border border-slate-200/40" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <h4 className="font-bold text-xs truncate max-w-[150px]">{color.name}</h4>
                    <code className="text-[10px] text-slate-400">{color.hex}</code>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{color.desc}</p>
                <div className="absolute right-3.5 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedToken === color.token ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Typography Block */}
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <Type className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">2. Typography Hierarchy</h3>
          </div>
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl divide-y divide-slate-200/60 dark:divide-zinc-800/80 overflow-hidden">
            {typography.map((t) => (
              <div key={t.name} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/20 dark:bg-zinc-900/20 hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{t.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{t.size} • {t.weight}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{t.desc}</p>
                </div>
                <div 
                  className={`text-emerald-500 dark:text-emerald-400 font-bold truncate max-w-xs ${
                    t.name.includes('Display') ? 'text-2xl tracking-tight' : 
                    t.name.includes('Headline') ? 'text-lg' : 'text-sm'
                  }`}
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  MintStep Design
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Spacing & Shapes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spacing Tokens */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Grid className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">3. Spacing Grid (4px Base)</h3>
            </div>
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-slate-200/50 dark:divide-zinc-800/60">
              {spacing.map((s) => (
                <div key={s.token} className="p-3.5 flex items-center justify-between bg-slate-50/10 dark:bg-zinc-900/10 text-xs gap-3">
                  <div className="space-y-0.5">
                    <code className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">{s.token}</code>
                    <p className="text-[10px] text-slate-400">{s.desc}</p>
                  </div>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{s.size} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shapes & Radius */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Square className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">4. M3 Shapes & Border Radius</h3>
            </div>
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-slate-200/50 dark:divide-zinc-800/60">
              {radius.map((r) => (
                <div key={r.token} className="p-3.5 flex items-center justify-between bg-slate-50/10 dark:bg-zinc-900/10 text-xs gap-3">
                  <div className="space-y-0.5">
                    <code className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">{r.token}</code>
                    <p className="text-[10px] text-slate-400">{r.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{r.size}</span>
                    <div 
                      className="w-5 h-5 bg-emerald-500 border border-emerald-400/30"
                      style={{ 
                        borderRadius: r.size === 'full' ? '9999px' : r.size 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Live M3 Interactive Widgets Preview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MousePointer className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">5. Interactive Component Previews</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live M3 Buttons Container */}
            <div className="bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">M3 Button Types</h4>
              <div className="flex flex-wrap gap-3">
                <button className="bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                  Filled Button
                </button>
                <button className="bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-100 font-bold text-xs px-5 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Elevated Button
                </button>
                <button className="border border-slate-300 dark:border-zinc-650 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold text-xs px-5 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Outlined Button
                </button>
                <button className="text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-bold text-xs px-4 py-3 rounded-xl transition-all">
                  Text Button
                </button>
              </div>
              <p className="text-[10px] text-slate-400 italic mt-2">All buttons feature 12px border radius (radiusMd) and elegant micro-transitions as requested.</p>
            </div>

            {/* M3 Cards & Soft Shadow Levels */}
            <div className="bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">M3 Elevation Levels (Soft Shadows)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-xl p-3 text-center shadow-xs">
                  <span className="block font-bold text-[10px] text-slate-400">Level 1</span>
                  <span className="text-xs font-bold">Standard</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl p-3 text-center shadow-md">
                  <span className="block font-bold text-[10px] text-slate-400">Level 2</span>
                  <span className="text-xs font-bold">Medium</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl p-3 text-center shadow-lg ring-1 ring-black/5">
                  <span className="block font-bold text-[10px] text-slate-400">Level 3</span>
                  <span className="text-xs font-bold">High</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">Shadows employ very low-opacity values to promote a Modern, Minimal brand personality.</p>
            </div>
          </div>
        </div>

        {/* 5. Minimalist Financial Sparklines & Charts */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">6. Beautiful Financial Charts</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Investment Flow Rate</span>
            </div>
          </div>

          <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Wallet Balance</span>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">$142,520.00</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20">+14.2%</span>
                <p className="text-[10px] text-slate-400 font-medium italic mt-1">This month</p>
              </div>
            </div>

            <div className="h-28 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMintDS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A86B" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00A86B" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00A86B" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorMintDS)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-zinc-800 flex items-center gap-2.5 text-xs text-slate-400 bg-slate-50/30 dark:bg-zinc-900/10 p-3 rounded-xl border border-dashed border-slate-200/60 dark:border-zinc-800/60">
        <Info className="w-4 h-4 text-emerald-500 shrink-0" />
        <p className="leading-normal">
          All design elements are mapped strictly in <code>/mintstep/lib/core/theme/design_system.dart</code> as compile-safe Dart constants, conforming perfectly to Material Design 3 guidelines.
        </p>
      </div>
    </div>
  );
}
