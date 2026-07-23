import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Sparkles, RefreshCw, AlertTriangle, 
  Database, LineChart, FileText, CheckCircle2, ChevronRight,
  TrendingUp, PiggyBank, ArrowDownLeft, Shield, DollarSign
} from 'lucide-react';

interface WealthAssistantProps {
  transactions: any[];
  budgets: any[];
  savingsGoals: any[];
  businessSales: any[];
  businessExpenses: any[];
  businessInventory: any[];
  businessStats: {
    sales: number;
    expenses: number;
    profit: number;
    inventory: number;
    cashFlow: number;
    tax: number;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function WealthAssistant({
  transactions,
  budgets,
  savingsGoals,
  businessSales,
  businessExpenses,
  businessInventory,
  businessStats
}: WealthAssistantProps) {
  const [model, setModel] = useState<'gemini' | 'chatgpt'>('gemini');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initial welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `### 🧠 AI Financial & CFO Assistant Connected
Welcome, Felix Zinyenge! I have successfully synchronized with your **FinFlow Ledger** and **Box Technologies Corporate Systems**.

I am fully aware of your:
*   **Personal checking reserves** and active savings targets.
*   **Personal budgets** (Food, Rent, Transport, Entertainment, Utilities).
*   **B2B Sales Ledger** (including contracts with SpaceX, Anduril, Ethereum Foundation, Vercel).
*   **Operating expenses**, hardware assembly inventory, and accrued corporate tax provisions.

Ask me any natural language questions, such as:
1.  *“How is our business profit margin and growth doing?”*
2.  *“Are there any hardware SKU inventory shortages I need to purchase?”*
3.  *“What is my Estimated Tax Provision and what write-offs are available?”*
4.  *“Compare our SpaceX B2B sales contract vs Taiwan Semiconductor outlays.”*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestionChips = [
    { label: "Analyze Business Profit Margin", q: "How is our business profit margin and overall growth doing? Give me a direct breakdown of SpaceX vs Anduril contracts, operating costs, and margins." },
    { label: "Check Inventory Shortages", q: "Are there any critical hardware SKU inventory shortages or SKU alerts I should buy or reorder immediately? Review the quantity thresholds." },
    { label: "Tax Liability & Section 179", q: "What is my Estimated Tax Provision? Can you suggest corporate write-offs, hardware depreciation, or Section 179 rules for Box Technologies?" },
    { label: "Check Personal Budget Pacing", q: "Am I exceeding any of my personal Food or Entertainment budgets based on my recent Whole Foods and Equinox transaction history?" }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Calculate personal stats dynamically to pass to server
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });
    const totalSavings = savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0);
    const checkingBalance = Math.max(0, 15000 + totalIncome - totalExpense);
    const netWorth = checkingBalance + totalSavings;

    const personalStats = {
      totalIncome,
      totalExpense,
      totalSavings,
      checkingBalance,
      netWorth
    };

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          model: model,
          contextData: {
            stats: personalStats,
            transactions,
            budgets,
            savingsGoals,
            businessSales,
            businessExpenses,
            businessInventory,
            businessStats
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || "Failed to contact chat server");
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **System Integration Error:** ${err.message}. Please verify your API keys are configured correctly or retry in a moment.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ultra-sophisticated markdown content parser to render beautiful CFO lists, bold tags, and tables
  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, lIdx) => {
      const trimmed = line.trim();
      
      // Empty lines
      if (!trimmed) return <div key={lIdx} className="h-2"></div>;

      // Headings
      if (trimmed.startsWith('###')) {
        return <h4 key={lIdx} className="text-sm font-black text-slate-100 mt-4 mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={lIdx} className="text-base font-black text-emerald-400 mt-5 mb-2.5 flex items-center gap-1.5">{trimmed.replace('##', '').trim()}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={lIdx} className="text-lg font-black text-white mt-6 mb-3">{trimmed.replace('#', '').trim()}</h2>;
      }

      // Check for markdown tables (starts or ends with |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator lines (e.g. |---|---|)
        if (trimmed.includes('---') || trimmed.includes('-|-')) return null;

        const cells = trimmed.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const isHeader = lIdx === 0 || (lIdx > 0 && content.split('\n')[lIdx + 1]?.includes('---'));

        return (
          <div key={lIdx} className="overflow-x-auto my-1">
            <table className="w-full text-[11px] font-mono border-collapse border border-slate-800 bg-slate-950/40">
              <tbody>
                <tr className={isHeader ? "bg-slate-900 border-b border-slate-800 font-bold text-slate-200" : "border-b border-slate-800/50 hover:bg-slate-900/10"}>
                  {cells.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5 text-slate-300 first:text-slate-100">{cell}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      // Format bold markup **text** -> JSX
      let parsedLine = trimmed;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
      
      while ((match = boldRegex.exec(trimmed)) !== null) {
        const plainText = trimmed.substring(lastIndex, match.index);
        const boldText = match[1];
        elements.push(plainText);
        elements.push(<strong key={match.index} className="font-extrabold text-white">{boldText}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      elements.push(trimmed.substring(lastIndex));

      const finalContent = elements.length > 0 ? elements : trimmed;

      // Bullet items
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const cleaned = trimmed.replace(/^[\*\-]\s*/, '');
        // Check if there was bold formatting
        const itemElements: React.ReactNode[] = [];
        let itemLastIndex = 0;
        while ((match = boldRegex.exec(cleaned)) !== null) {
          const plainText = cleaned.substring(itemLastIndex, match.index);
          const boldText = match[1];
          itemElements.push(plainText);
          itemElements.push(<strong key={match.index} className="font-extrabold text-white">{boldText}</strong>);
          itemLastIndex = boldRegex.lastIndex;
        }
        itemElements.push(cleaned.substring(itemLastIndex));

        return (
          <div key={lIdx} className="flex items-start space-x-2 text-xs leading-relaxed text-slate-300 ml-4 my-1">
            <span className="text-emerald-500 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{itemElements.length > 0 ? itemElements : cleaned}</span>
          </div>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s+/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s+/)?.[1];
        const cleaned = trimmed.replace(/^\d+\.\s+/, '');

        const itemElements: React.ReactNode[] = [];
        let itemLastIndex = 0;
        while ((match = boldRegex.exec(cleaned)) !== null) {
          const plainText = cleaned.substring(itemLastIndex, match.index);
          const boldText = match[1];
          itemElements.push(plainText);
          itemElements.push(<strong key={match.index} className="font-extrabold text-white">{boldText}</strong>);
          itemLastIndex = boldRegex.lastIndex;
        }
        itemElements.push(cleaned.substring(itemLastIndex));

        return (
          <div key={lIdx} className="flex items-start space-x-2 text-xs leading-relaxed text-slate-300 ml-4 my-1.5">
            <span className="text-emerald-400 font-mono font-black text-[10px] bg-slate-900 border border-slate-800 rounded px-1 shrink-0 mt-0.5">{num}</span>
            <span>{itemElements.length > 0 ? itemElements : cleaned}</span>
          </div>
        );
      }

      return <p key={lIdx} className="text-xs leading-relaxed text-slate-300 my-1">{finalContent}</p>;
    });
  };

  // Compute stats for connected context summary
  const lowStockCount = businessInventory.filter(i => i.quantity <= 3).length;
  const activeSavingsTargets = savingsGoals.length;
  const activeBudgetsCount = budgets.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[calc(100vh-220px)]">
      
      {/* LEFT CHAT AREA (8 COLS) */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-800/80 rounded-3xl flex flex-col shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Assistant View Header */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 z-10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">WealthFlow AI Adviser</h3>
              <p className="text-[10px] text-slate-500 font-semibold">Ledger-connected corporate & portfolio intelligence</p>
            </div>
          </div>

          {/* Model Switcher Segmented Controller */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 self-start sm:self-center">
            <button
              onClick={() => setModel('gemini')}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all flex items-center space-x-1 ${
                model === 'gemini'
                  ? 'bg-emerald-500 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Gemini 3.6</span>
            </button>
            <button
              onClick={() => setModel('chatgpt')}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all flex items-center space-x-1 ${
                model === 'chatgpt'
                  ? 'bg-emerald-500 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3 h-3 text-emerald-300" />
              <span>ChatGPT 4o</span>
            </button>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex space-x-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                
                {/* Avatar Icon */}
                <div className={`p-2 rounded-2xl shrink-0 w-9 h-9 border flex items-center justify-center ${
                  m.role === 'user' 
                    ? 'bg-slate-900 border-slate-800 text-slate-300' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content Container */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-3xl text-xs font-medium leading-relaxed border ${
                    m.role === 'user'
                      ? 'bg-emerald-500 text-white rounded-tr-none border-emerald-600 shadow-md'
                      : 'bg-slate-900/60 border-slate-850 rounded-tl-none text-slate-300 shadow-lg'
                  }`}>
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-line leading-relaxed">{m.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderMarkdown(m.content)}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp & Model Tag */}
                  <div className={`flex items-center space-x-2 px-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{m.timestamp}</span>
                    {m.role === 'assistant' && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-500">{model === 'gemini' ? 'Gemini 3.6' : 'ChatGPT 4o'}</span>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex space-x-3 max-w-[85%] items-start">
                <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-9 h-9 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                </div>
                <div className="space-y-2 bg-slate-900/50 border border-slate-850 p-4 rounded-3xl rounded-tl-none">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                    <span>Synthesizing balance accounts...</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full w-48"></div>
                  <div className="h-2.5 bg-slate-800 rounded-full w-36"></div>
                  <div className="h-2.5 bg-slate-800 rounded-full w-40"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Action Chips */}
        <div className="px-6 py-2.5 bg-slate-900/40 border-t border-slate-900/80 shrink-0 overflow-x-auto scrollbar-none flex space-x-2.5">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.q)}
              disabled={isLoading}
              className="text-[9.5px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Text Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center space-x-3 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Generating strategic finance models..." : "Ask questions about SpaceX delivery contracts, margins, inventory shortages, write-offs..."}
            className="flex-1 bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-emerald-500/50 focus:outline-hidden px-4.5 py-3 rounded-2xl text-xs font-semibold text-slate-100 placeholder:text-slate-600 disabled:opacity-50 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl flex items-center justify-center shadow-md transition-all transform active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* RIGHT SIDEBAR PANEL: CONNECTED DATA CONTEXT (4 COLS) */}
      <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
        
        {/* Dynamic Connected Ledger Health Card */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Connected System Context</h4>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500 font-semibold mb-5">
            The AI engine is actively wired to your active session storage and files. Any change posted in other tabs synchronizes in real time.
          </p>

          {/* Metric Status Grid */}
          <div className="space-y-3.5">
            
            {/* Net Worth */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850">
              <div className="flex items-center space-x-2.5">
                <PiggyBank className="w-4 h-4 text-emerald-400" />
                <span className="text-[10.5px] font-bold text-slate-300">Personal Net Worth</span>
              </div>
              <span className="text-xs font-black text-slate-100 font-mono">
                ${(15000 + transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0) + savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0)).toLocaleString()}
              </span>
            </div>

            {/* Corporate Net Profit */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850">
              <div className="flex items-center space-x-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-[10.5px] font-bold text-slate-300">Corporate Profit (Box)</span>
              </div>
              <span className="text-xs font-black text-emerald-400 font-mono">
                ${businessStats.profit.toLocaleString()}
              </span>
            </div>

            {/* Hardware Inventory Shortages */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850">
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-[10.5px] font-bold text-slate-300">Inventory Shortages</span>
              </div>
              <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-full ${lowStockCount > 0 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {lowStockCount > 0 ? `${lowStockCount} SKUs Low` : 'None'}
              </span>
            </div>

            {/* Budgets Count */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-[10.5px] font-bold text-slate-300">Tracked Budgets</span>
              </div>
              <span className="text-xs font-black text-slate-100 font-mono">{activeBudgetsCount} Categories</span>
            </div>

            {/* Savings Goals Count */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-850">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span className="text-[10.5px] font-bold text-slate-300">Active Savings targets</span>
              </div>
              <span className="text-xs font-black text-slate-100 font-mono">{activeSavingsTargets} Goals</span>
            </div>

          </div>
        </div>

        {/* CFO Guidelines Reminder Banner */}
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-3xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center space-x-2 text-slate-400 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h5 className="text-[9.5px] font-black uppercase tracking-wider">Strategic CFO Advisory</h5>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
              The advisor utilizes a corporate-standard **21% corporate income tax rate** and provides guidance regarding hardware assembly depreciation and supply chain optimizations.
            </p>
          </div>
          <div className="text-[9.5px] text-slate-500 font-bold border-t border-slate-800/80 pt-3 mt-3 flex items-center justify-between">
            <span>Security: SSL Encryption</span>
            <span>API: Server-to-Server Proxy</span>
          </div>
        </div>

      </div>

    </div>
  );
}
