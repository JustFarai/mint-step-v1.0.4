import React, { useState, useEffect } from 'react';
import { 
  Rocket, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, 
  User, Building2, Globe, DollarSign, Bell, Camera, HardDrive, Lock, 
  Check, X, Eye, EyeOff, Play, Compass, BookOpen, Users, Bot, Zap, 
  Smartphone, Sliders, RefreshCw, Star, Heart, Target, ChevronRight,
  Sun, Moon, ShieldAlert, Award, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UserPreferences {
  accountType: 'PERSONAL' | 'BUSINESS';
  authMethod: 'GOOGLE' | 'APPLE' | 'EMAIL' | null;
  email?: string;
  fullName?: string;
  country: string;
  currency: string;
  language: string;
  financialGoals: string[];
  businessType?: string;
  areasOfInterest: string[];
  permissions: {
    notifications: boolean;
    camera: boolean;
    storage: boolean;
    biometrics: boolean;
  };
  themePreference: 'DARK' | 'LIGHT';
}

export interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip?: () => void;
  initialStep?: number;
}

export const defaultPreferences: UserPreferences = {
  accountType: 'PERSONAL',
  authMethod: null,
  email: 'user@mintstep.io',
  fullName: 'Alex Vance',
  country: 'United States',
  currency: 'USD ($)',
  language: 'English (US)',
  financialGoals: ['Achieve Financial Freedom', 'Optimize Tax Deductions', 'Track Cash Flow'],
  businessType: 'SaaS / Tech Startup',
  areasOfInterest: ['Wealth Growth', 'POS Sales', 'AI CFO Insights', 'Tax Planning'],
  permissions: {
    notifications: true,
    camera: true,
    storage: true,
    biometrics: false
  },
  themePreference: 'DARK'
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip, initialStep }) => {
  // Saved state resume check from localStorage
  const savedDraft = localStorage.getItem('mintstep_onboarding_draft');
  const initialData = savedDraft ? JSON.parse(savedDraft) : null;

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialStep !== undefined) return initialStep;
    return initialData?.step || 1;
  });

  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    return initialData?.prefs || defaultPreferences;
  });

  const [isThemeDark, setIsThemeDark] = useState<boolean>(prefs.themePreference === 'DARK');

  // Auth Form State for Email Sign-Up
  const [emailInput, setEmailInput] = useState<string>(prefs.email || '');
  const [fullNameInput, setFullNameInput] = useState<string>(prefs.fullName || '');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // AI Configuration Loading Animation
  const [aiConfigProgress, setAiConfigProgress] = useState<number>(0);

  // Active Tutorial Highlight Index
  const [tutorialIndex, setTutorialIndex] = useState<number>(0);

  // Save progress draft to localStorage & emit telemetry
  useEffect(() => {
    localStorage.setItem('mintstep_onboarding_draft', JSON.stringify({
      step: currentStep,
      prefs: { ...prefs, themePreference: isThemeDark ? 'DARK' : 'LIGHT' }
    }));

    // Log telemetry event
    logTelemetryEvent(`onboarding_step_${currentStep}`, {
      step: currentStep,
      accountType: prefs.accountType,
      country: prefs.country,
      currency: prefs.currency
    });
  }, [currentStep, prefs, isThemeDark]);

  // AI Config Simulation Effect
  useEffect(() => {
    if (currentStep === 6) {
      setAiConfigProgress(0);
      const interval = setInterval(() => {
        setAiConfigProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 180);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Helper: Telemetry Logging
  const logTelemetryEvent = (eventName: string, details: Record<string, any>) => {
    try {
      const logs = JSON.parse(localStorage.getItem('mintstep_telemetry_events') || '[]');
      logs.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        details
      });
      localStorage.setItem('mintstep_telemetry_events', JSON.stringify(logs.slice(-50)));
      
      // Ping telemetry endpoint
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, timestamp: new Date().toISOString(), details })
      }).catch(() => {});
    } catch (e) {
      console.warn("Telemetry log error:", e);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Step 8 complete -> finish onboarding
      localStorage.setItem('mintstep_onboarding_completed', 'true');
      localStorage.removeItem('mintstep_onboarding_draft');
      logTelemetryEvent('onboarding_completed', { finalPrefs: prefs });
      onComplete(prefs);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setPrefs(prev => {
      const exists = prev.financialGoals.includes(goal);
      const newGoals = exists 
        ? prev.financialGoals.filter(g => g !== goal) 
        : [...prev.financialGoals, goal];
      return { ...prev, financialGoals: newGoals };
    });
  };

  const toggleInterest = (interest: string) => {
    setPrefs(prev => {
      const exists = prev.areasOfInterest.includes(interest);
      const newInterests = exists 
        ? prev.areasOfInterest.filter(i => i !== interest) 
        : [...prev.areasOfInterest, interest];
      return { ...prev, areasOfInterest: newInterests };
    });
  };

  const togglePermission = (key: keyof UserPreferences['permissions']) => {
    setPrefs(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  const handleAuthSelection = (method: 'GOOGLE' | 'APPLE' | 'EMAIL') => {
    setPrefs(prev => ({ ...prev, authMethod: method }));
    setAuthSuccessMsg(`Signed in via ${method}! Your account credentials are secure.`);
    setTimeout(() => {
      setAuthSuccessMsg(null);
      handleNextStep();
    }, 1000);
  };

  const totalSteps = 8;

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 flex flex-col justify-between p-4 md:p-8 font-sans ${
      isThemeDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Header Bar: Progress Indicator & Theme / Skip Controls */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800/40">
        
        {/* Brand logo & tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Rocket className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight block">MintStep</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Every Step Builds Wealth</span>
          </div>
        </div>

        {/* Progress Bar & Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Progress pill */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Step</span>
            <span className="text-emerald-400 font-black">{currentStep}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{totalSteps}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsThemeDark(!isThemeDark)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all cursor-pointer"
            title="Toggle Light/Dark Theme Preview"
          >
            {isThemeDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Skip Button */}
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-xs font-bold text-slate-400 hover:text-slate-100 px-3 py-2 rounded-xl hover:bg-slate-900 transition-all cursor-pointer"
            >
              Skip Onboarding
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="max-w-4xl w-full mx-auto my-4 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/60">
        <motion.div 
          className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Slide Body */}
      <div className="max-w-3xl w-full mx-auto my-auto py-6">
        <AnimatePresence mode="wait">

          {/* ----------------- STEP 1: WELCOME & FEATURE OVERVIEW ----------------- */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 animate-pulse">
                  <Rocket className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome to MintStep</h1>
                <p className="text-emerald-400 text-lg font-extrabold tracking-wide">"Every Step Builds Wealth."</p>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">The world-class financial operating system uniting personal wealth, business operating tools, AI CFO intelligence, and advisory mentorship.</p>
              </div>

              {/* Grid of Key Capability Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left font-mono text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-emerald-500/40 transition-all">
                  <User className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-slate-100">Personal Wealth</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Cash flow, budget goals & net worth meters.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-indigo-500/40 transition-all">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-slate-100">Business POS & B2B</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Point of Sale, invoice exports & tax section 179.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-cyan-400/40 transition-all">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-slate-100">Gemini AI Assistant</h4>
                  <p className="text-[10px] text-slate-400 font-sans">CFO insights, OCR receipt scanner & tax advice.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-purple-400/40 transition-all">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h4 className="font-bold text-slate-100">Advisors & Mentees</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Verified mentorship circles & goal sharing.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-amber-400/40 transition-all">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-slate-100">For You Feed</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Curated financial books, lessons & market summaries.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-rose-400/40 transition-all">
                  <Zap className="w-5 h-5 text-rose-400" />
                  <h4 className="font-bold text-slate-100">Offline Sync Queue</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Zero loss local IndexedDB queue & auto sync.</p>
                </div>

              </div>
            </motion.div>
          )}

          {/* ----------------- STEP 2: ACCOUNT TYPE CHOICE ----------------- */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Choose Your Account Mode</h2>
                <p className="text-xs text-slate-400">Select how you primarily intend to use MintStep. You can switch or combine modes anytime!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                
                {/* Personal Account Card */}
                <div 
                  onClick={() => setPrefs(prev => ({ ...prev, accountType: 'PERSONAL' }))}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 ${
                    prefs.accountType === 'PERSONAL'
                      ? 'bg-emerald-950/30 border-emerald-400 shadow-xl shadow-emerald-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    {prefs.accountType === 'PERSONAL' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-100">Personal Account</h3>
                    <p className="text-xs text-slate-400 mt-1">Designed for individuals tracking personal net worth, daily budgeting, financial freedom goals, and curated financial literacy.</p>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Personal Wealth & Net Worth Tracker</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Goal Tracking & Gamification Badges</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Personalized 'For You' Book Recommendations</span></li>
                  </ul>
                </div>

                {/* Business Account Card */}
                <div 
                  onClick={() => setPrefs(prev => ({ ...prev, accountType: 'BUSINESS' }))}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer space-y-4 ${
                    prefs.accountType === 'BUSINESS'
                      ? 'bg-indigo-950/30 border-indigo-400 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    {prefs.accountType === 'BUSINESS' && <CheckCircle2 className="w-6 h-6 text-indigo-400" />}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-100">Business Account</h3>
                    <p className="text-xs text-slate-400 mt-1">Tailored for business founders, operators, and advisors managing company sales, POS checkout, invoice exports, and tax planning.</p>
                  </div>

                  <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Multi-Business Organization Switcher</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Point of Sale (POS) & Invoice Generator</span></li>
                    <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>AI Tax Calculator & Section 179 Deductions</span></li>
                  </ul>
                </div>

              </div>
            </motion.div>
          )}

          {/* ----------------- STEP 3: AUTH SIGN-UP ----------------- */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Create Your Secure Account</h2>
                <p className="text-xs text-slate-400">Sign up in seconds to enable cloud sync, encryption, and advisor networking.</p>
              </div>

              {authSuccessMsg && (
                <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl text-xs font-bold animate-pulse">
                  {authSuccessMsg}
                </div>
              )}

              <div className="space-y-3 max-w-md mx-auto">
                {/* Google Sign In */}
                <button
                  onClick={() => handleAuthSelection('GOOGLE')}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center space-x-3 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Apple Sign In */}
                <button
                  onClick={() => handleAuthSelection('APPLE')}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center space-x-3 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-slate-100" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.11-1 .04-2.22.67-2.93 1.5-.64.74-1.2 1.92-1.04 3.05 1.12.09 2.27-.58 2.98-1.44z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                <div className="flex items-center my-4 text-slate-600 font-mono text-[10px] uppercase">
                  <div className="flex-1 border-b border-slate-800" />
                  <span className="px-3">or email sign up</span>
                  <div className="flex-1 border-b border-slate-800" />
                </div>

                {/* Email Form */}
                <div className="space-y-3 text-left font-mono text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name:</label>
                    <input 
                      type="text" 
                      value={fullNameInput}
                      onChange={e => {
                        setFullNameInput(e.target.value);
                        setPrefs(p => ({ ...p, fullName: e.target.value }));
                      }}
                      placeholder="Alex Vance"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Email Address:</label>
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={e => {
                        setEmailInput(e.target.value);
                        setPrefs(p => ({ ...p, email: e.target.value }));
                      }}
                      placeholder="alex@mintstep.io"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Password:</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAuthSelection('EMAIL')}
                    className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all cursor-pointer mt-2"
                  >
                    Create Account with Email
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ----------------- STEP 4: PERMISSIONS ----------------- */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-black">App Permissions & Device Capabilities</h2>
                <p className="text-xs text-slate-400">MintStep leverages native device hardware for seamless receipt scanning, biometric passkey security, and offline caching.</p>
              </div>

              <div className="space-y-3 max-w-xl mx-auto text-left font-mono text-xs">
                
                {/* Notifications */}
                <div 
                  onClick={() => togglePermission('notifications')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    prefs.permissions.notifications ? 'bg-slate-900 border-emerald-400' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-slate-100">Push Notifications</h4>
                      <p className="text-[10px] text-slate-400 font-sans">Instant alerts for budget limits, POS transactions & mentorship requests.</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${prefs.permissions.notifications ? 'bg-emerald-400' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-all ${prefs.permissions.notifications ? 'left-5' : 'left-1'}`} />
                  </div>
                </div>

                {/* Camera */}
                <div 
                  onClick={() => togglePermission('camera')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    prefs.permissions.camera ? 'bg-slate-900 border-indigo-400' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="font-bold text-slate-100">Camera Access</h4>
                      <p className="text-[10px] text-slate-400 font-sans">Required for Gemini AI Receipt OCR scanning and expense attachments.</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${prefs.permissions.camera ? 'bg-indigo-400' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-all ${prefs.permissions.camera ? 'left-5' : 'left-1'}`} />
                  </div>
                </div>

                {/* Storage */}
                <div 
                  onClick={() => togglePermission('storage')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    prefs.permissions.storage ? 'bg-slate-900 border-cyan-400' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <HardDrive className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-slate-100">Local Storage & Caching</h4>
                      <p className="text-[10px] text-slate-400 font-sans">IndexedDB persistence for offline sync & PDF invoice caching.</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${prefs.permissions.storage ? 'bg-cyan-400' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-all ${prefs.permissions.storage ? 'left-5' : 'left-1'}`} />
                  </div>
                </div>

                {/* Biometrics */}
                <div 
                  onClick={() => togglePermission('biometrics')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    prefs.permissions.biometrics ? 'bg-slate-900 border-purple-400' : 'bg-slate-900/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-bold text-slate-100">Biometric Authentication (Optional)</h4>
                      <p className="text-[10px] text-slate-400 font-sans">FaceID / TouchID biometric passkey lock for sensitive wallet screens.</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${prefs.permissions.biometrics ? 'bg-purple-400' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-all ${prefs.permissions.biometrics ? 'left-5' : 'left-1'}`} />
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ----------------- STEP 5: PERSONALIZATION FORM ----------------- */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Personalize Your Operating Experience</h2>
                <p className="text-xs text-slate-400">Configure your local currency, region, primary financial goals, and areas of interest.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono text-xs max-w-2xl mx-auto">
                
                {/* Country */}
                <div>
                  <label className="text-slate-400 block mb-1">Country / Region:</label>
                  <select 
                    value={prefs.country}
                    onChange={e => setPrefs(p => ({ ...p, country: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Singapore">Singapore</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Brazil">Brazil</option>
                    <option value="India">India</option>
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="text-slate-400 block mb-1">Primary Currency:</label>
                  <select 
                    value={prefs.currency}
                    onChange={e => setPrefs(p => ({ ...p, currency: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="CAD ($)">CAD ($)</option>
                    <option value="JPY (¥)">JPY (¥)</option>
                    <option value="AUD ($)">AUD ($)</option>
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="ZAR (R)">ZAR (R)</option>
                    <option value="NGN (₦)">NGN (₦)</option>
                    <option value="SGD ($)">SGD ($)</option>
                  </select>
                </div>

                {/* Language */}
                <div className="md:col-span-2">
                  <label className="text-slate-400 block mb-1">Display Language:</label>
                  <select 
                    value={prefs.language}
                    onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Spanish (Español)">Spanish (Español)</option>
                    <option value="French (Français)">French (Français)</option>
                    <option value="German (Deutsch)">German (Deutsch)</option>
                    <option value="Japanese (日本語)">Japanese (日本語)</option>
                    <option value="Portuguese (Português)">Portuguese (Português)</option>
                    <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                  </select>
                </div>

                {/* Business Type if applicable */}
                {prefs.accountType === 'BUSINESS' && (
                  <div className="md:col-span-2">
                    <label className="text-slate-400 block mb-1">Primary Business Sector:</label>
                    <select 
                      value={prefs.businessType}
                      onChange={e => setPrefs(p => ({ ...p, businessType: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="SaaS / Tech Startup">SaaS / Tech Startup</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                      <option value="Consulting & Advisory">Consulting & Advisory</option>
                      <option value="Freelance / Agency">Freelance / Agency</option>
                      <option value="Real Estate & Property">Real Estate & Property</option>
                      <option value="Manufacturing & Hardware">Manufacturing & Hardware</option>
                    </select>
                  </div>
                )}

              </div>

              {/* Financial Goals Selection */}
              <div className="space-y-2 text-left max-w-2xl mx-auto">
                <label className="text-xs font-bold text-slate-300 block">Select Primary Financial Goals:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Achieve Financial Freedom',
                    'Scale Business Revenue',
                    'Optimize Tax Deductions',
                    'Save for Down Payment',
                    'Invest in Stocks/REITs',
                    'Build Emergency Fund',
                    'Track Cash Flow & P&L'
                  ].map(goal => {
                    const isSelected = prefs.financialGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-400 text-slate-950 font-bold shadow-md' 
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Areas of Interest */}
              <div className="space-y-2 text-left max-w-2xl mx-auto">
                <label className="text-xs font-bold text-slate-300 block">Select Areas of Interest:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Wealth Growth',
                    'POS Sales',
                    'AI CFO Insights',
                    'Tax Planning',
                    'Mentorship Circles',
                    'Creator Studio & Shorts'
                  ].map(interest => {
                    const isSelected = prefs.areasOfInterest.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-400 text-slate-950 font-bold shadow-md' 
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{interest}
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* ----------------- STEP 6: AI CONFIGURATION SIMULATION ----------------- */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center py-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/20">
                <Bot className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black">Configuring Gemini AI Recommendation Engine</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Tailoring your CFO intelligence algorithms, financial goal vectors, and offline data schema based on your preferences.</p>
              </div>

              {/* Progress Circle & Bar */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-400 font-bold">Tuning Model Vectors ({prefs.currency})</span>
                  <span className="text-slate-100 font-black">{aiConfigProgress}%</span>
                </div>

                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 h-full transition-all duration-200" style={{ width: `${aiConfigProgress}%` }} />
                </div>

                {/* AI Tuning Steps */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-left font-mono text-[11px] space-y-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-4 h-4 ${aiConfigProgress >= 30 ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span>Mapping goal vectors for: {prefs.financialGoals.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-4 h-4 ${aiConfigProgress >= 60 ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span>Configuring Section 179 tax rules for {prefs.country} ({prefs.currency})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className={`w-4 h-4 ${aiConfigProgress >= 90 ? 'text-emerald-400' : 'text-slate-700'}`} />
                    <span>Indexing For You educational book summaries</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ----------------- STEP 7: INTERACTIVE QUICK TUTORIAL ----------------- */}
          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-black">Interactive App Walkthrough</h2>
                <p className="text-xs text-slate-400">Explore the main navigation hubs of your personalized MintStep operating environment.</p>
              </div>

              {/* Tutorial Step Selector Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
                {[
                  { name: 'Dashboard', icon: Rocket, color: 'text-emerald-400' },
                  { name: 'For You', icon: BookOpen, color: 'text-amber-400' },
                  { name: 'Community', icon: Users, color: 'text-purple-400' },
                  { name: 'AI Assistant', icon: Bot, color: 'text-cyan-400' },
                  { name: 'Quick Actions', icon: Zap, color: 'text-rose-400' }
                ].map((tut, i) => (
                  <button
                    key={i}
                    onClick={() => setTutorialIndex(i)}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center space-y-1 cursor-pointer ${
                      tutorialIndex === i ? 'bg-slate-900 border-emerald-400 shadow-md' : 'bg-slate-950/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <tut.icon className={`w-4 h-4 ${tut.color}`} />
                    <span className="font-bold text-[10px] text-slate-200">{tut.name}</span>
                  </button>
                ))}
              </div>

              {/* Interactive Showcase Screen */}
              <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 text-left space-y-4">
                {tutorialIndex === 0 && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-emerald-400 font-bold border-b border-slate-800 pb-2">
                      <span>1. Home Dashboard Hub</span>
                      <span>{prefs.currency}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Your central mission control displaying net worth growth, cash flow income vs outlay graphs, recent POS transactions, and P&L financial freedom progress.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                      <span className="text-slate-400">Total Net Worth:</span>
                      <span className="text-emerald-400 font-black">$148,250.00</span>
                    </div>
                  </div>
                )}

                {tutorialIndex === 1 && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-amber-400 font-bold border-b border-slate-800 pb-2">
                      <span>2. For You Educational Feed</span>
                      <span>Curated Books</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Daily curated financial book summaries, tax strategy guides, and market intelligence tailored to your chosen goals ({prefs.financialGoals[0] || 'Wealth'}).
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px]">
                      📚 "The Intelligent Investor" & "Tax-Free Wealth" summarized into 5-min audio bites.
                    </div>
                  </div>
                )}

                {tutorialIndex === 2 && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-purple-400 font-bold border-b border-slate-800 pb-2">
                      <span>3. Community & Mentorship</span>
                      <span>Verified Networks</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Connect directly with verified financial advisors, join peer business circles, watch creator shorts, and share milestone achievements.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px]">
                      👥 Active advisor network connected across {prefs.country}.
                    </div>
                  </div>
                )}

                {tutorialIndex === 3 && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-cyan-400 font-bold border-b border-slate-800 pb-2">
                      <span>4. Gemini AI CFO Assistant</span>
                      <span>OCR & Tax Engine</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Ask complex financial questions, scan receipts via device camera for instant expense categorization, and calculate Section 179 tax write-offs.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-cyan-400 text-[11px]">
                      💬 "Gemini: You have $4,200 in potential Section 179 equipment deductions available this quarter."
                    </div>
                  </div>
                )}

                {tutorialIndex === 4 && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-rose-400 font-bold border-b border-slate-800 pb-2">
                      <span>5. Floating Quick Actions (FAB)</span>
                      <span>1-Tap Tools</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Tap the global floating action button anytime to record a POS terminal sale, export a PDF invoice, scan a receipt, or log a personal transaction.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-rose-400 text-[11px]">
                      ⚡ Instant launch shortcuts accessible from every screen in the app.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ----------------- STEP 8: FINAL WELCOME & READY ----------------- */}
          {currentStep === 8 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center py-4"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black">You're All Set, {prefs.fullName || 'Wealth Builder'}!</h2>
                <p className="text-emerald-400 text-sm font-extrabold">Your MintStep Operating System is Fully Personalized & Ready.</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Account Mode: <strong className="text-slate-100">{prefs.accountType}</strong> • Currency: <strong className="text-slate-100">{prefs.currency}</strong> • Region: <strong className="text-slate-100">{prefs.country}</strong></p>
              </div>

              {/* Summary Cards */}
              <div className="p-5 bg-slate-900/90 rounded-3xl border border-slate-800 text-left font-mono text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Primary Goal:</span>
                  <span className="text-emerald-400 font-bold">{prefs.financialGoals[0] || 'Financial Freedom'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Selected Interests:</span>
                  <span className="text-indigo-400 font-bold">{prefs.areasOfInterest.length} Categories</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Camera OCR Access:</span>
                  <span className="text-cyan-400 font-bold">{prefs.permissions.camera ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Model Status:</span>
                  <span className="text-emerald-400 font-bold">Vector Tuned (Gemini 3.6)</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Action Footer Controls */}
      <div className="max-w-4xl w-full mx-auto pt-6 border-t border-slate-800/40 flex items-center justify-between">
        
        {/* Back Button */}
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            currentStep === 1 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Next / Launch Button */}
        <button
          onClick={handleNextStep}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 hover:opacity-90 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-xl shadow-emerald-500/20"
        >
          <span>{currentStep === 8 ? 'Launch My Dashboard' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4 fill-slate-950 stroke-[3]" />
        </button>

      </div>

    </div>
  );
};

export default OnboardingFlow;
