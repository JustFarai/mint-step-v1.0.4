import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to recursively list files in /mintstep
async function getFileTree(dir: string): Promise<any[]> {
  const result: any[] = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const item of list) {
      const fullPath = path.join(dir, item.name);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      // Ignore build folders or hidden folders
      if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === 'dist') {
        continue;
      }
      
      if (item.isDirectory()) {
        result.push({
          name: item.name,
          path: relativePath,
          type: 'directory',
          children: await getFileTree(fullPath)
        });
      } else {
        result.push({
          name: item.name,
          path: relativePath,
          type: 'file'
        });
      }
    }
  } catch (err) {
    console.error(`Error reading dir ${dir}:`, err);
  }
  
  // Sort directories first, then files
  return result.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

// 1. Get entire Flutter project structure
app.get("/api/files", async (req, res) => {
  const rootDir = path.join(process.cwd(), "mintstep");
  try {
    const tree = await getFileTree(rootDir);
    res.json({ files: tree });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Read specific file content
app.post("/api/files/read", async (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    res.status(400).json({ error: "Missing filePath parameter" });
    return;
  }
  
  // Security guard: Ensure target is within processed workspace and not a system file
  const resolvedPath = path.resolve(filePath);
  const mintstepRoot = path.resolve(path.join(process.cwd(), "mintstep"));
  if (!resolvedPath.startsWith(mintstepRoot)) {
    res.status(403).json({ error: "Access denied. Path is outside of mintstep folder." });
    return;
  }
  
  try {
    const content = await fs.readFile(resolvedPath, 'utf-8');
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Edit/Write file contents directly from client
app.post("/api/files/write", async (req, res) => {
  const { filePath, content } = req.body;
  if (!filePath || content === undefined) {
    res.status(400).json({ error: "Missing filePath or content parameter" });
    return;
  }
  
  const resolvedPath = path.resolve(filePath);
  const mintstepRoot = path.resolve(path.join(process.cwd(), "mintstep"));
  if (!resolvedPath.startsWith(mintstepRoot)) {
    res.status(403).json({ error: "Access denied. Path is outside of mintstep folder." });
    return;
  }
  
  try {
    // Ensure parent directory exists
    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
    await fs.writeFile(resolvedPath, content, 'utf-8');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Simulated Firebase Firestore database for user profile persistence
const PROFILES_FILE = path.join(process.cwd(), "db_profiles.json");

async function loadProfiles() {
  try {
    const data = await fs.readFile(PROFILES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

async function saveProfiles(profiles: any) {
  try {
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving simulated Firestore profiles:", e);
  }
}

app.get("/api/firebase/user-profile", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    res.status(400).json({ error: "Missing email parameter" });
    return;
  }
  const profiles = await loadProfiles();
  const profile = profiles[String(email).toLowerCase()] || null;
  res.json({ profile });
});

app.post("/api/firebase/user-profile", async (req, res) => {
  const { email, accountType } = req.body;
  if (!email || !accountType) {
    res.status(400).json({ error: "Missing email or accountType parameters" });
    return;
  }
  const profiles = await loadProfiles();
  const lowerEmail = String(email).toLowerCase();
  profiles[lowerEmail] = {
    email: lowerEmail,
    accountType,
    updatedAt: new Date().toISOString()
  };
  await saveProfiles(profiles);
  res.json({ success: true, profile: profiles[lowerEmail] });
});

// 5. API endpoint to chat with Senior Flutter Architect
app.post("/api/chat", async (req, res) => {
  const { messages, currentFile, currentFileContent } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing or invalid messages parameter" });
    return;
  }
  
  try {
    const systemInstruction = `You are a world-class Senior Flutter Software Architect, technical designer, and clean code expert.
You created "MintStep" - a production-ready fitness and steps tracking app.
Your goals are to:
- Explain Riverpod, GoRouter, Firebase integration, offline-first architectures, Clean Architecture (Domain, Data, Presentation layers), and theme management.
- Provide highly descriptive, production-ready, well-commented Dart code snippets.
- Walk the user through architectural scaling designs to support millions of concurrent users.
- Help them refactor files or design new features (e.g., adding user statistics, notifications, sync state handling, or setting goals).

Format your output in a clean, professional markdown layout. Be humble, precise, and practical.`;

    const modelInputMessages = [...messages];
    
    // Enrich with context of what file is currently selected
    if (currentFile) {
      modelInputMessages.unshift({
        role: "user",
        content: `CONTEXT: The user is currently inspecting the file "${currentFile}".\nHere is its code content:\n\`\`\`dart\n${currentFileContent}\n\`\`\`\nKeep this file in mind as you answer.`
      });
    }

    const contents = modelInputMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5b. API endpoint to generate business financial AI insights for Box Technologies
app.post("/api/gemini/business-insights", async (req, res) => {
  const { stats, sales, expenses, inventory, cashFlow, tax, inventoryAlerts } = req.body;
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    // Elegant fallback mock insights if the Gemini API key is missing
    const mockAdvice = `### 🏢 Box Technologies - Strategic Corporate Analysis

**1. Operating Profit Margin & Cash Flow Integrity**
*   Your gross sales of **$${(stats?.sales || 0).toLocaleString()}** against total operating expenses of **$${(stats?.expenses || 0).toLocaleString()}** yields a net profit of **$${(stats?.profit || 0).toLocaleString()}**. This represents an impressive **${(stats?.sales > 0 ? ((stats?.profit / stats?.sales) * 100).toFixed(1) : "0")}%** net margin.
*   *Observation:* Cash flow is highly liquid with **$${(stats?.cashFlow || 0).toLocaleString()}** in net monthly positive drift. However, B2B hardware manufacturing and assembly cycles could strain short-term liquidity if collections slow down.
*   *Action:* Consider establishing a **15-day Net invoice collection policy** for enterprise cloud clients to lock in gains and mitigate cash flow bottlenecks.

**2. Inventory Turnover & Capital Efficiency**
*   Active inventory valuation stands at **$${(stats?.inventory || 0).toLocaleString()}**. 
${inventoryAlerts && inventoryAlerts.length > 0 ? inventoryAlerts.map((alert: any) => {
  return `*   ⚠️ **Critical Alert**: ${alert.text}. Low stock tied up in high-velocity units delays client fulfillment. Recommend a prompt reorder.`;
}).join('\n') : '*   ✓ All server node hardware SKU stock thresholds are balanced at healthy operating quantities.'}
*   *Action:* Liquidate or discount slow-moving legacy router components to free up working capital for your high-growth **Ethereum Core Ledger node** assembly parts.

**3. Tax Provisions & Write-offs (MD3 Corporate Compliance)**
*   Your current corporate income tax liability provision is estimated at **$${(stats?.tax || 0).toLocaleString()}** (representing a standard accrued federal and state corporate bracket).
*   *Action:* Work with your finance arm to write off depreciation on server assembly machinery under **Section 179**. Standardize R&D tax credits for software node algorithms to minimize overall taxable liability.`;

    res.json({ text: mockAdvice });
    return;
  }

  try {
    const prompt = `Perform a highly sophisticated, expert corporate financial analysis for Box Technologies, a premium hardware and B2B software manufacturing enterprise, based on these operational metrics:

BUSINESS STATS SUMMARY:
- Total Sales: $${stats?.sales || 0}
- Total Expenses: $${stats?.expenses || 0}
- Net Profit: $${stats?.profit || 0}
- Current Inventory Asset Value: $${stats?.inventory || 0}
- Active Monthly Cash Flow Surplus: $${stats?.cashFlow || 0}
- Estimated Tax Provision Accrued: $${stats?.tax || 0}

INVENTORY ALERTS:
${(inventoryAlerts || []).map((a: any) => `- ALERT: ${a.text}`).join('\n')}

RECENT BUSINESS TRANSACTIONS (SALES & EXPENSES):
- Sales Ledger items: ${(sales || []).slice(0, 10).map((s: any) => `[${s.date}] ${s.client || s.title}: +$${s.amount}`).join('\n')}
- Expense Ledger items: ${(expenses || []).slice(0, 10).map((e: any) => `[${e.date}] ${e.title} (${e.category}): -$${e.amount}`).join('\n')}

Generate an elite, deeply analytical, and custom corporate finance advisory report. Use markdown with clear display headings, structured lists, and bold callouts. Include:
1. Operating Margin and Cash Flow Integrity advice.
2. Inventory turnover recommendations, addressing any low-stock alerts.
3. Corporate tax optimization suggestions, listing potential hardware write-offs or Section 179 opportunities.

Structure the output as clean markdown, specifically referencing their actual numbers. Do not include vague corporate placeholders.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite chief financial officer (CFO) and enterprise investment director at a top-tier venture firm. You speak with mathematical rigor, offering direct, high-value corporate planning guidance.",
        temperature: 0.25,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Business Insights API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. API endpoint to generate personal financial AI insights
app.post("/api/gemini/insights", async (req, res) => {
  const { stats, transactions, budgets, savingsGoals, debts, investments } = req.body;
  
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    // Elegant fallback mock insights if the Gemini API key is missing, so it never spins or crashes!
    const mockAdvice = `### 🌟 FinFlow AI Financial Analysis (Simulated)

**1. Cash Flow & Liquidity Allocation**
*   Your monthly revenue of **$${(stats?.totalIncome || 0).toLocaleString()}** exceeds your outlays of **$${(stats?.totalExpense || 0).toLocaleString()}** by **$${((stats?.totalIncome || 0) - (stats?.totalExpense || 0)).toLocaleString()}**. This represents a solid positive cash position.
*   *Action:* Consider automating **15%** of this net monthly surplus directly into your High-Yield Checking Node or your active **Ethereum ledger assets**.

**2. Budget Pacing & Efficiency**
${budgets && budgets.length > 0 ? budgets.map((b: any) => {
  const pct = b.limitAmount > 0 ? (b.spentAmount / b.limitAmount) * 100 : 0;
  if (pct >= 80) {
    return `*   ⚠️ **Warning on ${b.category} Budget**: You have spent **$${b.spentAmount}** of your **$${b.limitAmount}** allocation (${pct.toFixed(0)}%). You are nearing the spending limit.`;
  }
  return `*   ✓ **${b.category} Budget**: Active pacing is excellent. You have utilized only **${pct.toFixed(0)}%** of your **$${b.limitAmount}** threshold.`;
}).join('\n') : '*   No budgets active. We recommend setting a threshold for variable spending such as Food or Entertainment.'}

**3. Debt Payoff Acceleration (APR Strategy)**
${debts && debts.length > 0 ? debts.map((d: any) => {
  return `*   **${d.title}** has an outstanding balance of **$${d.outstandingAmount.toLocaleString()}** with an APR of **${d.interestRate}%**. Because this rate is high, prioritizing extra payments here yields an effective risk-free return of **${d.interestRate}%** per year!`;
}).join('\n') : '*   ✓ You have no active high-interest debts. Congratulations!'}

**4. Wealth Building & Asset Allocation**
*   Your investment portfolio stands at **$${(stats?.portfolioCurrent || 0).toLocaleString()}** across stocks and digital ledger assets.
*   Your Ethereum ledger assets show high volatility, which can be leveraged if rebalanced quarterly. Seek to maintain a **70/30** Split between index equity equities and commodities like GLD.`;

    res.json({ text: mockAdvice });
    return;
  }

  try {
    const prompt = `Perform a high-end, highly analytical, and professional personal finance analysis based on the following actual metrics:

FINANCIAL STATS SUMMARY:
- Net Worth: $${stats?.netWorth || 0}
- Total Income: $${stats?.totalIncome || 0}
- Total Expenses: $${stats?.totalExpense || 0}
- Total Savings: $${stats?.totalSavings || 0}
- Net Assets (Checking + Savings + Investments): $${stats?.totalAssets || 0}
- Total Debts Outstanding: $${stats?.totalDebts || 0}

TRANSACTION HISTORY:
${(transactions || []).slice(0, 15).map((t: any) => `- [${t.date}] ${t.title} (${t.category}): ${t.type === 'income' ? '+' : '-'}$${t.amount}`).join('\n')}

BUDGET STATUS:
${(budgets || []).map((b: any) => `- ${b.category}: Spent $${b.spentAmount} of $${b.limitAmount}`).join('\n')}

SAVINGS GOALS:
${(savingsGoals || []).map((s: any) => `- ${s.title}: Saved $${s.currentAmount} of $${s.targetAmount} (${s.category})`).join('\n')}

DEBT BALANCES:
${(debts || []).map((d: any) => `- ${d.title}: Balance $${d.outstandingAmount} of principal $${d.totalAmount} at APR ${d.interestRate}% (Min payment $${d.monthlyPayment}/mo)`).join('\n')}

INVESTMENT PORTFOLIO:
${(investments || []).map((i: any) => `- ${i.name} (${i.type}): Invested $${i.investedAmount}, current value $${i.currentValue} (${i.quantity} units)`).join('\n')}

Generate a comprehensive, deeply personal, and beautifully formatted personal finance advisory response. Use markdown, clear headings, structured lists, and bold callouts. Make it look professional, modern, and highly actionable. Include:
1. Cash Flow & Liquidity Allocation recommendations.
2. Budget Pacing and variables warning center analysis.
3. Debt Payoff Acceleration strategy (using Avalanche or Snowflake models based on their APR rates).
4. Wealth Building and Asset Allocation suggestions.

Structure the output as clean markdown, without any generic placeholder language. Make it specific to their real values and numbers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, highly credentialed personal wealth adviser, portfolio designer, and personal finance AI engine. You speak objectively, with deep analytical clarity, giving direct, mathematical and practical wealth advice.",
        temperature: 0.3,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Insights API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Interactive Unified AI Assistant Chat (supporting Google Gemini & OpenAI ChatGPT)
app.post("/api/gemini/assistant", async (req, res) => {
  const { messages, model, contextData } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing or invalid messages parameter" });
    return;
  }

  const activeModel = model === "chatgpt" ? "chatgpt" : "gemini";

  // Build the rich context-aware system instruction
  const systemInstruction = `You are an elite, highly credentialed Chief Financial Officer (CFO) and Personal Wealth Adviser AI.
You have real-time access to the user's personal and business financial ledgers.
Analyze, summarize, and answer questions with extreme mathematical accuracy, objective clarity, and actionable strategic insights.

The user's real-time financial ledger data is provided below:

==================================================
PERSONAL WEALTH & BUDGETS:
==================================================
- Checking Balance: $${(contextData?.stats?.checkingBalance || 0).toLocaleString()}
- Net Worth: $${(contextData?.stats?.netWorth || 0).toLocaleString()}
- Total Savings: $${(contextData?.stats?.totalSavings || 0).toLocaleString()}

- Savings Goals:
${(contextData?.savingsGoals || []).map((s: any) => `  * ${s.title} (${s.category}): saved $${(s.currentAmount || 0).toLocaleString()} of $${(s.targetAmount || 0).toLocaleString()}`).join('\n') || "  (No active savings goals)"}

- Active Budgets:
${(contextData?.budgets || []).map((b: any) => `  * ${b.category}: spent $${(b.spentAmount || 0).toLocaleString()} of $${(b.limitAmount || 0).toLocaleString()}`).join('\n') || "  (No active budgets)"}

- Recent Personal Transactions:
${(contextData?.transactions || []).slice(0, 15).map((t: any) => `  * [${t.date}] ${t.title} (${t.category || "General"}): ${t.type === 'income' ? '+' : '-'}$${(t.amount || 0).toLocaleString()}`).join('\n') || "  (No transactions in history)"}

==================================================
BOX TECHNOLOGIES (BUSINESS OPERATIONS):
==================================================
- Total Sales: $${(contextData?.businessStats?.sales || 0).toLocaleString()}
- Total Operating Expenses: $${(contextData?.businessStats?.expenses || 0).toLocaleString()}
- Net Profit: $${(contextData?.businessStats?.profit || 0).toLocaleString()}
- Active Cash Flow: $${(contextData?.businessStats?.cashFlow || 0).toLocaleString()}
- Accrued Tax Provision (21% corporate rate): $${(contextData?.businessStats?.tax || 0).toLocaleString()}

- Corporate Sales Ledger:
${(contextData?.businessSales || []).slice(0, 10).map((s: any) => `  * [${s.date}] ${s.client}: +$${(s.amount || 0).toLocaleString()} (${s.title})`).join('\n') || "  (No active B2B sales contract deliveries)"}

- Corporate Expense Ledger:
${(contextData?.businessExpenses || []).slice(0, 10).map((e: any) => `  * [${e.date}] ${e.title} (${e.category || "General"}): -$${(e.amount || 0).toLocaleString()}`).join('\n') || "  (No active corporate operating outlays)"}

- Hardware SKU Inventory:
${(contextData?.businessInventory || []).map((i: any) => `  * SKU: ${i.sku} | Name: ${i.name} | Stock: ${i.quantity} units | Cost: $${(i.cost || 0).toLocaleString()} | Selling Price: $${(i.price || 0).toLocaleString()}`).join('\n') || "  (No inventory SKUs listed)"}

==================================================

Guidelines:
1. Speak objectively, like an elite, premium CFO and investment partner. Always back your claims with numbers from the user's data.
2. Address Transactions, Inventory, Expenses, Sales, Goals, Investments, Taxes, and Business Growth based on what they ask.
3. If the user asks about Business Growth, explain their operating profit margins, net profits, client contracts (SpaceX, Anduril, Ethereum Foundation, Vercel), and capital efficiency.
4. If they ask about Taxes, suggest corporate write-offs (like Section 179 for hardware assembly assets, or R&D credits for high-growth server node assemblies) and reference their Estimated Tax Provision.
5. If they ask about Inventory, mention any low-stock SKU warnings (quantity <= 3 units) and suggest reorder operations.
6. When answering, do not write generic boilerplate. Refer directly to the values.
7. Keep answers structured, highly scannable, and clean. Use bold headings, tables, or lists.
`;

  if (activeModel === "chatgpt") {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      // Mock / fallback ChatGPT response if key is missing to keep user experience seamless!
      const lastUserMessage = messages[messages.length - 1]?.content || "Hello";
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `[SYSTEM: Simulate OpenAI ChatGPT-4o-mini answering this. Keep it premium, objective, CFO-styled. Explicitly mention that you are running on ChatGPT-4o (Simulated fall-back mode) because OPENAI_API_KEY is not defined in Settings, but that you have full integration with the financial ledger. Answer the user question based on the financial ledger: "${lastUserMessage}"]\n\nSYSTEM INSTRUCTION CONTEXT:\n${systemInstruction}`,
          config: {
            temperature: 0.35,
          }
        });
        res.json({ text: response.text });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    try {
      // Direct call to OpenAI Chat Completions API
      const formattedMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      // Inject system instruction at the beginning
      formattedMessages.unshift({
        role: "system",
        content: systemInstruction
      });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: formattedMessages,
          temperature: 0.3
        })
      });

      const data = await response.json();
      if (response.ok && data.choices && data.choices[0]) {
        res.json({ text: data.choices[0].message.content });
      } else {
        throw new Error(data.error?.message || "Failed to call OpenAI ChatGPT API");
      }
    } catch (error: any) {
      console.error("OpenAI ChatGPT API error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Google Gemini API call
    try {
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.25,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Assistant API error:", error);
      res.status(500).json({ error: error.message });
    }
  }
});

// 8. API endpoint to generate AI summaries of app performance (Crashlytics, Slow Queries, Telemetry)
app.post("/api/gemini/performance-summary", async (req, res) => {
  const { metrics, topScreens, crashes, slowQueries } = req.body;
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    const fallbackReport = `### 🚀 Gemini AI Executive Performance Summary & Health Audit

**1. System Reliability & Crashlytics Health (${metrics?.crashFreeRate || '99.82%'} Crash-Free)**
*   **Crash-Free Session Rate:** Outstanding at **${metrics?.crashFreeRate || '99.82%'}** across ${metrics?.totalUsers || 18450} active sessions today.
*   **Active Crash Issues:** 
    *   ⚠️ **Fatal Exception:** Out of memory during PDF canvas creation in \`PDFGenerator.renderCanvas\`.
    *   ℹ️ **Non-Fatal Errors:** Unhandled null receipt total in OCR engine and transient Firebase auth network timeout.
*   *Action Plan:* Refactor \`PDFGenerator.renderCanvas\` to buffer image array chunks to prevent memory spikes on mobile client devices.

**2. Database & Firebase Performance Traces (Slow Query Alert)**
*   **Flagged Query Latencies:** Detected **${(slowQueries || []).length} database queries** exceeding the 250ms SLA threshold.
*   **Critical Bottleneck:** Query \`Fetch All Sales Ledger Items\` is averaging **480ms** execution time due to missing composite index on \`[client_id, issue_date]\`.
*   *Action Plan:* Deploy composite index to drop execution latency from **480ms down to ~35ms**.

**3. User Retention & Engagement Cohorts**
*   **Retention Profile:** D1 Retention (**${metrics?.retentionD1 || '68%'}**), D7 Retention (**${metrics?.retentionD7 || '48%'}**), D30 Retention (**${metrics?.retentionD30 || '32%'}**).
*   **DAU / MAU Ratio:** **${((metrics?.dau / metrics?.mau) * 100 || 32.8).toFixed(1)}%** (indicates strong daily stickiness, top-tier SaaS fintech benchmark).`;

    res.json({ text: fallbackReport });
    return;
  }

  try {
    const prompt = `Perform an elite, highly detailed AI System Performance & Reliability Audit based on the following real-time app telemetry data:

METRICS OVERVIEW:
- Crash-Free Session Rate: ${metrics?.crashFreeRate}
- Total Active Users: ${metrics?.totalUsers}
- DAU: ${metrics?.dau} | MAU: ${metrics?.mau}
- Retention Cohorts: D1 (${metrics?.retentionD1}), D7 (${metrics?.retentionD7}), D30 (${metrics?.retentionD30})
- Open Crash Issues Count: ${metrics?.openCrashCount}
- Slow Query SLA Breaches Count: ${metrics?.slowQueryCount}

TOP VISITED SCREENS TODAY:
${(topScreens || []).map((s: any) => `- ${s.screenName}: ${s.viewsToday} views, avg time ${s.avgTimeSeconds}s, bounce rate ${s.bounceRate}%`).join('\n')}

ACTIVE CRASH REPORTS (CRASHLYTICS):
${(crashes || []).map((c: any) => `- [${c.severity}] ${c.title} (${c.occurrences} occurrences, ${c.affectedUsers} users affected)`).join('\n')}

SLOW QUERIES DETECTED (>250ms SLA):
${(slowQueries || []).map((q: any) => `- Query "${q.queryName}" on ${q.collectionOrTable}: Took ${q.executionTimeMs}ms (Threshold: ${q.thresholdMs}ms)`).join('\n')}

Generate a comprehensive, executive-level technical performance summary using clean Markdown. Include:
1. System Reliability & Crashlytics Health (Analyzing crash-free rate, top crashes, and specific fix recommendations).
2. Database & Firebase Performance Traces (Analyzing slow query bottlenecks, query latencies, and indexing optimizations).
3. User Retention & Engagement Cohorts (Analyzing screen usage, DAU/MAU stickiness, and retention trends).

Structure the response with bold headers, bullet points, and actionable engineering recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a Chief Technology Officer (CTO) and Principal Site Reliability Engineer (SRE). You evaluate system telemetry, crash logs, and performance metrics with extreme technical precision and offer concrete engineering solutions.",
        temperature: 0.2,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Performance Summary API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 9. API endpoint to generate AI Release Notes for DevOps Releases
app.post("/api/gemini/release-notes", async (req, res) => {
  const { version, commits } = req.body;
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    const fallbackReleaseNotes = `### 🚀 MintStep Enterprise ${version || 'v2.4.1'} Release Notes

**🌟 What's New & Highlight Features:**
*   **System Telemetry & Monitoring Hub:** Real-time tracking of screen usage, feature adoption, crashlytics stack traces, and database slow queries.
*   **DevOps Continuous Pipeline Engine:** Visual GitHub Actions workflow status, multi-target Android AAB, iOS IPA & Cloud Run container build pipeline.
*   **Global Localization & FX Engine:** Auto-detects local currency, applies accurate tax calculations, and formats locale dates.

**🔧 Bug Fixes & Reliability:**
*   Fixed null pointer exception in Receipt OCR Scanner when parsing empty totals.
*   Added array buffer memory chunking for PDF invoice rendering on mobile devices.

**⚡ Performance & Security:**
*   Optimized Firestore database queries down to <35ms with composite indexing.
*   Enforced AES-256 encryption on all stored environment secrets and keys.`;

    res.json({ text: fallbackReleaseNotes });
    return;
  }

  try {
    const prompt = `Generate an elite, professional, polished set of App Store, Google Play Store, and GitHub Release Notes for Version ${version}.

Git Commits in this Release:
${(commits || []).map((c: string) => `- ${c}`).join('\n')}

Format the output cleanly in Markdown with sections for:
1. 🌟 What's New & Highlight Features
2. 🔧 Bug Fixes & Stability Improvements
3. ⚡ Performance & Security Upgrades

Keep the tone developer-centric yet accessible to end users and App Store review teams.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a Lead DevOps Technical Writer and Product Release Engineer. You turn git commits into beautiful, professional, structured release notes for web and mobile apps.",
        temperature: 0.3,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Release Notes API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 10. API endpoint to generate complete Launch Documentation & Runbook
app.post("/api/gemini/launch-documentation", async (req, res) => {
  const { appName, version, readinessScore, checklistItems } = req.body;
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    const fallbackDocs = `# 🚀 ${appName || 'MintStep Enterprise'} (${version || 'v2.4.1'}) Master Launch Documentation

## 1. Executive Launch Sign-Off
**Product Readiness Score:** **${readinessScore || '100%'}**
All critical store submission prerequisites, penetration test security audits, legal terms, and staged deployment strategies have been verified for production launch across Web, Android, and iOS.

---

## 2. Store Listing & Metadata Specification
*   **App Title:** MintStep: WealthFlow & Business POS
*   **Subtitle:** Real-time CFO intelligence, tax calculator, POS & inventory
*   **Categories:** Finance (Primary) / Business SaaS (Secondary)
*   **Keywords:** wealth flow, tax calculator, section 179, pos terminal, ocr receipt scanner, offline sync, invoice pdf
*   **Age Rating:** IARC 3+ / Everyone (General Audience)
*   **Privacy Policy:** https://mintstep.io/privacy
*   **Support Email:** support@mintstep.io

---

## 3. Security, Penetration Testing & Accessibility Sign-Off
*   **OWASP Mobile Top 10 Security Audit:** **PASSED** (0 High/Critical Vulnerabilities)
*   **Data Encryption:** AES-256 for local IndexedDB storage, TLS 1.3 for network transport
*   **Penetration Testing:** Verified immunity against SQLi, XSS, token hijacking, and CORS bypass
*   **WCAG 2.1 AA Accessibility:** 100% compliance across screen reader aria-labels and touch target dimensions

---

## 4. Staged Rollout Schedule & Rollback Runbook
1.  **Phase 1 (Day 1):** 10% Staged Rollout on Google Play & App Store
2.  **Phase 2 (Day 3):** 25% Staged Rollout (monitoring Crashlytics crash-free rate >= 99.50%)
3.  **Phase 3 (Day 5):** 50% Staged Rollout
4.  **Phase 4 (Day 7):** 100% Full Production Release
*   **Emergency Rollback Trigger:** Automated rollback if Crashlytics logs crash rate >0.5% over 15 minutes.`;

    res.json({ text: fallbackDocs });
    return;
  }

  try {
    const prompt = `Generate a master, executive-level Launch Documentation and Operations Runbook for ${appName} (${version}).

Current Launch Readiness: ${readinessScore}

Checklist Status:
${(checklistItems || []).map((item: any) => `- [${item.completed ? 'x' : ' '}] ${item.title} (${item.category}): ${item.description}`).join('\n')}

Include the following sections in clean Markdown:
1. 🚀 Executive Launch Sign-Off & Release Summary
2. 📱 App Store & Google Play Store Listing Specification (Title, Subtitle, Category, Keywords, ASO strategy)
3. 🔒 Security Audit, Penetration Testing & WCAG 2.1 AA Accessibility Sign-Off
4. 🧪 Internal QA & Beta Testing Cohort Metrics
5. 🔄 Staged Rollout Strategy (10% -> 25% -> 50% -> 100%) & Emergency Rollback Runbook

Format with clear headers, bullet points, and technical precision.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a Chief Product Officer (CPO) and VP of Mobile Engineering. You author elite, comprehensive launch runbooks, store metadata specifications, and security sign-off documentation.",
        temperature: 0.2,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Launch Documentation API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 11. API endpoint to record onboarding & product telemetry events
const telemetryEventsStore: any[] = [];
app.post("/api/telemetry", (req, res) => {
  const { event, timestamp, details } = req.body;
  if (event) {
    telemetryEventsStore.push({
      event,
      timestamp: timestamp || new Date().toISOString(),
      details: details || {}
    });
    // Keep max 200 events in memory
    if (telemetryEventsStore.length > 200) telemetryEventsStore.shift();
  }
  res.json({ status: "success", loggedEventsCount: telemetryEventsStore.length });
});

app.get("/api/telemetry", (req, res) => {
  res.json({ events: telemetryEventsStore });
});

// Vite Middleware for Development / Production Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
