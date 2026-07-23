import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Award, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';

interface ArchitectChatProps {
  selectedFile: string | null;
  selectedFileContent: string;
}

export default function ArchitectChat({ selectedFile, selectedFileContent }: ArchitectChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I am your **Senior Flutter Software Architect** guide. I designed **MintStep**'s enterprise Clean Architecture. Ask me anything about how this codebase is designed, how Riverpod registers providers, how the offline-first Hive-to-Firebase synchronizer works, or how to write unit tests for your use cases!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionPrompts = [
    "Explain the Offline-First Sync Architecture",
    "How does dependency injection work here?",
    "Why use Riverpod instead of Bloc for MintStep?",
    "Show me how to add a unit test"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          currentFile: selectedFile,
          currentFileContent: selectedFileContent
        })
      });

      const data = await response.json();
      if (response.ok) {
        const assistMsg: ChatMessage = {
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistMsg]);
      } else {
        throw new Error(data.error || "Failed to talk to Architect");
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `⚠️ Error connecting to architect workspace: ${err.message}. Please verify your API Key in the panel.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-800">Architect Consult Tool</h4>
            <p className="text-[10px] text-emerald-600 font-medium">Senior Flutter Software Architect</p>
          </div>
        </div>

        {selectedFile && (
          <div className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-mono truncate max-w-[150px]">
            File focus: {selectedFile.split('/').pop()}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`p-1.5 rounded-full flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                m.role === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              </div>
              
              <div className="space-y-1">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                }`}>
                  {/* Simplistic custom Markdown parsing for bold text and list elements to look clean */}
                  <div className="whitespace-pre-line space-y-1 font-sans">
                    {m.content.split('\n').map((line, lIdx) => {
                      // Check for code blocks
                      if (line.startsWith('```')) return null;
                      
                      // Bold parsing
                      let parsedLine = line;
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      let match;
                      const elements: React.ReactNode[] = [];
                      let lastIndex = 0;
                      
                      while ((match = boldRegex.exec(line)) !== null) {
                        const plainText = line.substring(lastIndex, match.index);
                        const boldText = match[1];
                        elements.push(plainText);
                        elements.push(<strong key={match.index} className="font-bold text-slate-950 dark:text-emerald-400">{boldText}</strong>);
                        lastIndex = boldRegex.lastIndex;
                      }
                      elements.push(line.substring(lastIndex));
                      
                      // Check for list items
                      if (line.trim().startsWith('- ')) {
                        return <li key={lIdx} className="ml-4 list-disc">{elements}</li>;
                      }
                      return <p key={lIdx}>{elements.length > 0 ? elements : line}</p>;
                    })}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-medium block px-1 text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 w-8 h-8 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl text-xs text-slate-400 italic">
                Thinking about architectural constraints...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
        {suggestionPrompts.map((p, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(p)}
            className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 text-slate-600 transition-colors font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="bg-white p-3 border-t border-slate-200 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Clean Architecture, Riverpod setup..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-emerald-500 text-slate-800 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
