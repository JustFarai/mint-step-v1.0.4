import React, { useState } from 'react';
import { 
  Smartphone, Apple, Play, ShieldCheck, Flame, 
  Sparkles, Download, CheckCircle2, AlertTriangle, RefreshCw, 
  Layers, Key, FileCode, Activity, Terminal, Cpu, Image as ImageIcon, 
  Zap, Copy, Check, UploadCloud, Radio, BarChart2, Shield, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type DeploymentTab = 
  | 'android_google_play' 
  | 'ios_app_store' 
  | 'app_icons_splash' 
  | 'signing_keystore' 
  | 'firebase_prod' 
  | 'crashlytics_analytics';

export const ProductionDeploymentCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DeploymentTab>('android_google_play');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. Android Release Config
  const [androidVersionCode, setAndroidVersionCode] = useState<number>(104);
  const [androidVersionName, setAndroidVersionName] = useState<string>('2.4.0');
  const [isBuildingAAB, setIsBuildingAAB] = useState<boolean>(false);
  const [aabBuildStatus, setAabBuildStatus] = useState<'IDLE' | 'BUILDING' | 'SUCCESS'>('SUCCESS');

  // 2. iOS Release Config
  const [iosBuildNumber, setIosBuildNumber] = useState<number>(142);
  const [iosVersionName, setIosVersionName] = useState<string>('2.4.0');
  const [isExportingIPA, setIsExportingIPA] = useState<boolean>(false);
  const [ipaBuildStatus, setIpaBuildStatus] = useState<'IDLE' | 'BUILDING' | 'SUCCESS'>('SUCCESS');

  // 3. Signing Keystore State
  const [keystoreAlias, setKeystoreAlias] = useState<string>('wealthflow_prod_key');
  const [keystoreFingerprintSHA256, setKeystoreFingerprintSHA256] = useState<string>('FA:C2:90:11:88:FF:70:99:A1:B2:C3:D4:E5:F6:70:81:92:03:A4:B5:C6:D7:E8:F9:00:11:22:33:44:55');
  const [isSigningVerified, setIsSigningVerified] = useState<boolean>(true);

  // 4. Firebase Production Credentials Setup
  const [firebaseProjectID, setFirebaseProjectID] = useState<string>('wealthflow-enterprise-prod');
  const [isDeployingFirestoreRules, setIsDeployingFirestoreRules] = useState<boolean>(false);

  // 5. Crashlytics & Analytics Events Log
  const [crashLogs, setCrashLogs] = useState<Array<{ id: string; time: string; issue: string; severity: string; device: string; status: string }>>([
    { id: 'CRASH-901', time: '12 mins ago', issue: 'Non-fatal: WebAuthn TouchID Timeout (User Canceled)', severity: 'LOW', device: 'iPhone 16 Pro (iOS 18.1)', status: 'LOGGED' },
    { id: 'CRASH-900', time: '1 hour ago', issue: 'Handled: Section 179 Input Value Overflow Guard', severity: 'INFO', device: 'Google Pixel 9 Pro (Android 15)', status: 'LOGGED' },
  ]);

  const [analyticsEvents, setAnalyticsEvents] = useState<Array<{ name: string; count: number; category: string }>>([
    { name: 'app_launch_120fps_rendered', count: 14280, category: 'Performance' },
    { name: 'section_179_tax_calculated', count: 8920, category: 'Business' },
    { name: 'biometric_passkey_authenticated', count: 6410, category: 'Security' },
    { name: 'wire_transfer_quarantined_by_ai', count: 14, category: 'Fraud Guard' },
  ]);

  // Handlers
  const handleBuildAndroidAAB = () => {
    setIsBuildingAAB(true);
    setAabBuildStatus('BUILDING');
    triggerToast("🤖 Building Android App Bundle (AAB) with ProGuard R8 Shrinking...");

    setTimeout(() => {
      setIsBuildingAAB(false);
      setAabBuildStatus('SUCCESS');
      triggerToast("✅ Android release.aab signed & ready for Google Play Console upload!");
    }, 1500);
  };

  const handleExportIosIPA = () => {
    setIsExportingIPA(true);
    setIpaBuildStatus('BUILDING');
    triggerToast("🍏 Compiling Xcode Archive & App Store Connect Distribution IPA...");

    setTimeout(() => {
      setIsExportingIPA(false);
      setIpaBuildStatus('SUCCESS');
      triggerToast("✅ WealthFlow.ipa signed with Apple Distribution Certificate!");
    }, 1500);
  };

  const handleDeployFirestoreRulesProd = () => {
    setIsDeployingFirestoreRules(true);
    triggerToast("🔥 Deploying firestore.rules to Production Firebase Project...");

    setTimeout(() => {
      setIsDeployingFirestoreRules(false);
      triggerToast("✅ Firebase Security Rules live on wealthflow-enterprise-prod!");
    }, 1200);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <UploadCloud className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Production Release & Deployment Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                Store Ready v2.4.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Google Play Console, Apple App Store, Adaptive Icons, Keystore Signing, Firebase & Crashlytics Analytics</p>
          </div>
        </div>

        {/* Store Compliance Shield */}
        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-left">
            <div className="text-[10px] font-black uppercase text-slate-400">Release Health</div>
            <div className="text-xs font-black text-emerald-400 font-mono">Verified for Play Store & App Store</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('android_google_play')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'android_google_play' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android & Google Play</span>
        </button>

        <button
          onClick={() => setActiveTab('ios_app_store')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'ios_app_store' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>iOS & App Store</span>
        </button>

        <button
          onClick={() => setActiveTab('app_icons_splash')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'app_icons_splash' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Icons & Splash Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('signing_keystore')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'signing_keystore' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Release Signing Keys</span>
        </button>

        <button
          onClick={() => setActiveTab('firebase_prod')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'firebase_prod' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Firebase Production</span>
        </button>

        <button
          onClick={() => setActiveTab('crashlytics_analytics')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
            activeTab === 'crashlytics_analytics' ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Crashlytics & Analytics</span>
        </button>
      </div>

      {/* 1. TAB: Android & Google Play Console */}
      {activeTab === 'android_google_play' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AAB Bundle Compiler */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">Android App Bundle (AAB) Compiler</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Target SDK 34 (Android 15)</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Package Name</label>
                  <input 
                    type="text"
                    disabled
                    value="com.wealthflow.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Version Code</label>
                  <input 
                    type="number"
                    value={androidVersionCode}
                    onChange={(e) => setAndroidVersionCode(+e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Version Name</label>
                <input 
                  type="text"
                  value={androidVersionName}
                  onChange={(e) => setAndroidVersionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>ProGuard / R8 Code Shrinking:</span>
                  <span className="text-emerald-400 font-bold">Enabled (Minified)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Split APKs / Dynamic Features:</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
              </div>

              <button
                onClick={handleBuildAndroidAAB}
                disabled={isBuildingAAB}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${isBuildingAAB ? 'animate-spin' : ''}`} />
                <span>{isBuildingAAB ? 'Compiling Release AAB...' : 'Build Signed Release AAB'}</span>
              </button>
            </div>
          </div>

          {/* Play Store Checklist */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Google Play Store Release Checklist</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">Target SDK 34 Compliance</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">Adaptive Vector Icon (512x512 PNG)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">Data Safety Form & Privacy Policy URL</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">Signed with Production V2/V3 Keystore</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: iOS & App Store Connect */}
      {activeTab === 'ios_app_store' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* iOS Archive Compiler */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Apple className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">iOS Xcode Archive & IPA Exporter</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">iOS 18.1 Target SDK</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Bundle Identifier</label>
                  <input 
                    type="text"
                    disabled
                    value="io.wealthflow.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Build Number</label>
                  <input 
                    type="number"
                    value={iosBuildNumber}
                    onChange={(e) => setIosBuildNumber(+e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Version String</label>
                <input 
                  type="text"
                  value={iosVersionName}
                  onChange={(e) => setIosVersionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleExportIosIPA}
                disabled={isExportingIPA}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${isExportingIPA ? 'animate-spin' : ''}`} />
                <span>{isExportingIPA ? 'Archiving Xcode IPA...' : 'Export Signed App Store IPA'}</span>
              </button>
            </div>
          </div>

          {/* App Store Connect Checklist */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">App Store Connect Review Guidelines</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">Apple Distribution Certificate & Provisioning Profile</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">AppIcon.appiconset (1024x1024 No Alpha)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200">App Privacy Nutrition Label</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: App Icons & Splash Assets */}
      {activeTab === 'app_icons_splash' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <span>App Icon & Launch Splash Asset Generator</span>
              </h3>
              <p className="text-xs text-slate-400">Generates vector adaptive icons for Android and AppIcon.appiconset for iOS</p>
            </div>

            <button
              onClick={() => triggerToast("🖼️ Exported 1024x1024 PNG & Android Adaptive Icon XML assets!")}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Icon Assets</span>
            </button>
          </div>

          {/* Icon Mockup Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* iOS App Icon Preview */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-24 h-24 rounded-[22%] bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 flex items-center justify-center shadow-2xl border border-emerald-400/30">
                <Zap className="w-12 h-12 text-slate-950 fill-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black text-slate-200">iOS App Icon (Squircle)</span>
            </div>

            {/* Android Adaptive Icon Preview */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 flex items-center justify-center shadow-2xl border border-emerald-400/30">
                <Zap className="w-12 h-12 text-slate-950 fill-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xs font-black text-slate-200">Android Adaptive Icon (Circle)</span>
            </div>

            {/* Splash Screen Preview */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-20 h-32 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-2">
                <Zap className="w-6 h-6 text-emerald-400" />
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">WealthFlow</span>
              </div>
              <span className="text-xs font-black text-slate-200">Launch Splash Screen</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: Release Signing Keys */}
      {activeTab === 'signing_keystore' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <span>Production Key Signing & Fingerprint Management</span>
            </h3>
            <p className="text-xs text-slate-400">Cryptographic RSA-4096 / ECDSA certificates for APK & IPA signing</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Keystore Alias</span>
              <div className="text-slate-200 font-bold">{keystoreAlias}</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">SHA-256 Certificate Fingerprint</span>
              <div className="text-emerald-400 font-bold text-[11px] break-all">{keystoreFingerprintSHA256}</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: Firebase Production */}
      {activeTab === 'firebase_prod' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Production Firebase & Firestore Database Instance</span>
              </h3>
              <p className="text-xs text-slate-400">Live production project setup, config files and security rules</p>
            </div>

            <button
              onClick={handleDeployFirestoreRulesProd}
              disabled={isDeployingFirestoreRules}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Flame className={`w-3.5 h-3.5 ${isDeployingFirestoreRules ? 'animate-spin' : ''}`} />
              <span>{isDeployingFirestoreRules ? 'Deploying Rules...' : 'Deploy firestore.rules'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Firebase Project ID</span>
              <div className="text-amber-400 font-bold">{firebaseProjectID}</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Firestore Security Rules</span>
              <div className="text-emerald-400 font-bold">Synced & Active (/firestore.rules)</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB: Crashlytics & Analytics */}
      {activeTab === 'crashlytics_analytics' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <span>Firebase Crashlytics & Telemetry Analytics</span>
            </h3>
            <p className="text-xs text-slate-400">Realtime non-fatal issue tracking and custom user event telemetry stream</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crashlytics logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Crashlytics Issues Stream</h4>
              <div className="space-y-2 text-xs font-mono">
                {crashLogs.map(log => (
                  <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{log.id}</span>
                      <span className="text-slate-400 text-[10px]">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{log.issue}</p>
                    <p className="text-[10px] text-slate-500">{log.device}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Telemetry */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Analytics Telemetry Events</h4>
              <div className="space-y-2 text-xs font-mono">
                {analyticsEvents.map((evt, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">{evt.name}</div>
                      <div className="text-[10px] text-slate-500">{evt.category}</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono text-sm">{evt.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductionDeploymentCenter;
