import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Star, Bookmark, Share2, Sparkles, CheckCircle2, 
  Clock, Flame, Plus, Heart, User, Award, ListFilter, Search, 
  ChevronRight, X, Send, Eye, BookMarked, Library, TrendingUp, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface BusinessBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  summary: string;
  keyLessons: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
  readingTimeHours: number;
  pages: number;
  rating: number; // e.g. 4.9
  ratingCount: number;
  category: string;
  targetBusinessType: string[];
  goals: string[];
  isBookOfTheDay?: boolean;
  isSaved?: boolean;
  userReadingStatus?: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'COMPLETED' | 'NONE';
  userRating?: number;
}

export const initialBooks: BusinessBook[] = [
  {
    id: 'book-1',
    title: 'The Lean Startup: How Constant Innovation Creates Radically Successful Businesses',
    author: 'Eric Ries',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    summary: 'Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.',
    keyLessons: [
      'Build-Measure-Learn feedback loops minimize wasted engineering effort.',
      'Validate hypotheses with Minimum Viable Products (MVPs) before scaling operations.',
      'Pivot or persevere based on empirical customer metrics rather than vanity numbers.'
    ],
    difficulty: 'Intermediate',
    readingTimeHours: 6,
    pages: 336,
    rating: 4.92,
    ratingCount: 1420,
    category: 'Entrepreneurship & Strategy',
    targetBusinessType: ['Technology & Hardware', 'Retail Apparel', 'Commercial Printing & Packaging', 'Services'],
    goals: ['Scale ARR to $1M+', 'Validate Product-Market Fit', 'Product Innovation'],
    isBookOfTheDay: true,
    isSaved: true,
    userReadingStatus: 'CURRENTLY_READING',
    userRating: 5
  },
  {
    id: 'book-2',
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel & Blake Masters',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    summary: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. Thiel shows how we can find singular ways to create those new things.',
    keyLessons: [
      'Monopoly profits drive long-term value creation; avoid bloody competition.',
      'Vertical progress (0 to 1) creates new technology, horizontal progress (1 to N) copies things.',
      'Secrets exist: finding hidden truths about the world is required for category leaders.'
    ],
    difficulty: 'Executive',
    readingTimeHours: 4.5,
    pages: 224,
    rating: 4.88,
    ratingCount: 980,
    category: 'Venture & Strategy',
    targetBusinessType: ['Technology & Hardware', 'Fintech & Banking'],
    goals: ['Scale ARR to $1M+', 'Category Leadership', 'Capital Raising'],
    isBookOfTheDay: false,
    isSaved: true,
    userReadingStatus: 'COMPLETED',
    userRating: 5
  },
  {
    id: 'book-3',
    title: 'Profit First: Transform Your Business from a Cash-Eating Monster to a Money-Making Machine',
    author: 'Mike Michalowicz',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    summary: 'Conventional accounting uses logical (but flawed) formula: Sales - Expenses = Profit. The Profit First system flips this formula: Sales - Profit = Expenses, securing permanent profitability.',
    keyLessons: [
      'Allocate profit, owner’s pay, and tax reserves into dedicated bank accounts FIRST.',
      'Operate on remaining operational expense bounds to eliminate corporate waste.',
      'Small, regular profit distributions build financial stamina and debt immunity.'
    ],
    difficulty: 'Beginner',
    readingTimeHours: 5,
    pages: 272,
    rating: 4.95,
    ratingCount: 1850,
    category: 'Accounting & Finance',
    targetBusinessType: ['Commercial Printing & Packaging', 'Retail Apparel', 'Services'],
    goals: ['Optimize Tax & Ledger', 'Increase Net Profit Margin', 'Eliminate Business Debt'],
    isBookOfTheDay: false,
    isSaved: false,
    userReadingStatus: 'WANT_TO_READ'
  },
  {
    id: 'book-4',
    title: 'The Hard Thing About Hard Things: Building a Business When There Are No Easy Answers',
    author: 'Ben Horowitz',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
    summary: 'While many people talk about how great it is to start a business, very few are honest about how difficult it is to run one. Ben Horowitz analyzes the problems that confront leaders every day.',
    keyLessons: [
      'Peacetime CEO vs War-time CEO requires radically different operational styles.',
      'Lead through brutal honesty, building psychological safety and clear accountability.',
      'Hire for strengths rather than lack of weaknesses when scaling executive teams.'
    ],
    difficulty: 'Executive',
    readingTimeHours: 7,
    pages: 304,
    rating: 4.91,
    ratingCount: 1120,
    category: 'Leadership & Crisis Management',
    targetBusinessType: ['Technology & Hardware', 'Commercial Printing & Packaging'],
    goals: ['Scale ARR to $1M+', 'Executive Hiring', 'Crisis Management'],
    isBookOfTheDay: false,
    isSaved: false,
    userReadingStatus: 'NONE'
  }
];

export const BookRecommendations: React.FC = () => {
  const [books, setBooks] = useState<BusinessBook[]>(() => {
    const saved = localStorage.getItem('mintstep_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialBooks;
  });

  const [activeTab, setActiveTab] = useState<'FEATURED' | 'AI_RECOMMENDED' | 'MY_LISTS' | 'CATEGORIES'>('FEATURED');
  
  // AI Matching Preferences State
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('Technology & Hardware');
  const [selectedGoal, setSelectedGoal] = useState<string>('Scale ARR to $1M+');
  const [selectedInterest, setSelectedInterest] = useState<string>('Entrepreneurship & Strategy');

  // Custom User Reading Lists
  const [readingLists, setReadingLists] = useState<Array<{ name: string; bookIds: string[] }>>([
    { name: 'Must Read Q3 2026', bookIds: ['book-1', 'book-3'] },
    { name: 'Executive Financial Mastery', bookIds: ['book-2', 'book-3'] }
  ]);

  // Modal States
  const [showNewListModal, setShowNewListModal] = useState<boolean>(false);
  const [newListNameInput, setNewListNameInput] = useState<string>('');

  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [selectedBookForShare, setSelectedBookForShare] = useState<BusinessBook | null>(null);

  const [showRateModal, setShowRateModal] = useState<boolean>(false);
  const [selectedBookForRate, setSelectedBookForRate] = useState<BusinessBook | null>(null);
  const [ratingScoreInput, setRatingScoreInput] = useState<number>(5);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Persist books
  useEffect(() => {
    localStorage.setItem('mintstep_books', JSON.stringify(books));
  }, [books]);

  const bookOfTheDay = books.find(b => b.isBookOfTheDay) || books[0];

  // Book Action Handlers
  const handleToggleSave = (bookId: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const nextSaved = !b.isSaved;
        triggerToast(nextSaved ? `🔖 Added "${b.title}" to saved books!` : `Removed "${b.title}" from saved books.`);
        return {
          ...b,
          isSaved: nextSaved,
          userReadingStatus: nextSaved && b.userReadingStatus === 'NONE' ? 'WANT_TO_READ' : b.userReadingStatus
        };
      }
      return b;
    }));
  };

  const handleUpdateStatus = (bookId: string, status: 'WANT_TO_READ' | 'CURRENTLY_READING' | 'COMPLETED' | 'NONE') => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        triggerToast(`📚 Updated reading status to ${status.replace(/_/g, ' ')}!`);
        return { ...b, userReadingStatus: status, isSaved: status !== 'NONE' };
      }
      return b;
    }));
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListNameInput.trim()) return;
    setReadingLists(prev => [...prev, { name: newListNameInput, bookIds: [bookOfTheDay.id] }]);
    triggerToast(`📁 Created new reading list "${newListNameInput}"!`);
    setNewListNameInput('');
    setShowNewListModal(false);
  };

  const handleConfirmRating = () => {
    if (!selectedBookForRate) return;
    setBooks(prev => prev.map(b => {
      if (b.id === selectedBookForRate.id) {
        return { ...b, userRating: ratingScoreInput };
      }
      return b;
    }));
    triggerToast(`⭐ Rated "${selectedBookForRate.title}" ${ratingScoreInput} stars!`);
    setShowRateModal(false);
  };

  // Filtered AI Books
  const aiRecommendedBooks = books.filter(b => {
    const matchesType = b.targetBusinessType.includes(selectedBusinessType);
    const matchesGoal = b.goals.includes(selectedGoal);
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return (matchesType || matchesGoal) && matchesSearch;
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">AI Book Recommendations</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                Daily Knowledge Curation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Tailored executive reading recommendations based on your business type, goals & interests</p>
          </div>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNewListModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Reading List</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold">
        {[
          { id: 'FEATURED', label: '🔥 Book of the Day', icon: Flame },
          { id: 'AI_RECOMMENDED', label: '✨ AI For You Recommendations', icon: Sparkles },
          { id: 'MY_LISTS', label: `Library & Lists (${readingLists.length})`, icon: Library },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
              activeTab === tab.id 
                ? 'bg-amber-400 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------- TAB 1: BOOK OF THE DAY FEATURED BANNER ------------------- */}
      {activeTab === 'FEATURED' && (
        <div className="space-y-6">
          
          {/* Main Book of the Day Spotlight Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <BookOpen className="w-72 h-72 text-amber-400 stroke-1" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Cover Image */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative group">
                  <img 
                    src={bookOfTheDay.coverImage} 
                    alt={bookOfTheDay.title} 
                    className="w-56 h-80 object-cover rounded-2xl shadow-2xl border border-slate-700/80 group-hover:scale-105 transition-transform" 
                  />
                  <span className="absolute -top-3 -left-3 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-slate-950" />
                    <span>Book of the Day</span>
                  </span>
                </div>
              </div>

              {/* Book Details & Summary */}
              <div className="lg:col-span-8 space-y-4">
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                      {bookOfTheDay.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                      Difficulty: {bookOfTheDay.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{bookOfTheDay.readingTimeHours}h Read • {bookOfTheDay.pages} Pages</span>
                    </span>
                  </div>

                  <h2 className="text-xl lg:text-2xl font-black text-slate-100 tracking-tight leading-snug">
                    {bookOfTheDay.title}
                  </h2>
                  <p className="text-sm font-bold text-amber-400 font-mono">by {bookOfTheDay.author}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {bookOfTheDay.summary}
                </p>

                {/* Key Lessons Executive Checklist */}
                <div className="p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-mono font-black uppercase text-amber-400 tracking-wider">Key Executive Takeaways</span>
                  <div className="space-y-1.5">
                    {bookOfTheDay.keyLessons.map((lesson, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating & Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-100">{bookOfTheDay.rating}</span>
                      <span className="text-[10px] text-slate-500">({bookOfTheDay.ratingCount} reviews)</span>
                    </div>

                    <button
                      onClick={() => handleToggleSave(bookOfTheDay.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        bookOfTheDay.isSaved 
                          ? 'bg-amber-400 text-slate-950 border-amber-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100'
                      }`}
                      title="Save / Bookmark Book"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBookForShare(bookOfTheDay);
                        setShowShareModal(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
                      title="Share Executive Summary"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <select
                      value={bookOfTheDay.userReadingStatus || 'NONE'}
                      onChange={(e) => handleUpdateStatus(bookOfTheDay.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold font-mono focus:outline-none focus:border-amber-400"
                    >
                      <option value="NONE">Set Reading Status</option>
                      <option value="WANT_TO_READ">🔖 Want to Read</option>
                      <option value="CURRENTLY_READING">📖 Currently Reading</option>
                      <option value="COMPLETED">✅ Completed</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedBookForRate(bookOfTheDay);
                        setShowRateModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all cursor-pointer shadow-md"
                    >
                      Rate Book
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* ------------------- TAB 2: AI FOR YOU RECOMMENDATIONS ------------------- */}
      {activeTab === 'AI_RECOMMENDED' && (
        <div className="space-y-6">
          
          {/* AI Matcher Preferences Bar */}
          <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">AI Curation Preferences Engine</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">Business Sector</label>
                <select
                  value={selectedBusinessType}
                  onChange={(e) => setSelectedBusinessType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="Technology & Hardware">Technology & Hardware</option>
                  <option value="Retail Apparel">Retail Apparel</option>
                  <option value="Commercial Printing & Packaging">Commercial Printing & Packaging</option>
                  <option value="Services">Services & Consulting</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">Strategic Goal</label>
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="Scale ARR to $1M+">Scale ARR to $1M+</option>
                  <option value="Optimize Tax & Ledger">Optimize Tax & Corporate Ledger</option>
                  <option value="Category Leadership">Category Monopoly & Product Secrets</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">Search Catalog</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    placeholder="Search book title, author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiRecommendedBooks.map(book => (
              <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex space-x-4">
                    <img src={book.coverImage} alt={book.title} className="w-24 h-36 object-cover rounded-xl border border-slate-700 shadow-md shrink-0" />
                    
                    <div className="space-y-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-400 text-[10px] font-mono font-bold">
                        {book.category}
                      </span>
                      <h3 className="text-sm font-black text-slate-100 leading-snug line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-slate-400 font-mono font-bold">by {book.author}</p>

                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <strong className="text-slate-200">{book.rating}</strong>
                        </span>
                        <span>•</span>
                        <span>{book.difficulty}</span>
                        <span>•</span>
                        <span>{book.readingTimeHours}h</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 font-sans">{book.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
                  <button
                    onClick={() => handleToggleSave(book.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer ${
                      book.isSaved ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{book.isSaved ? 'Saved' : 'Save Book'}</span>
                  </button>

                  <select
                    value={book.userReadingStatus || 'NONE'}
                    onChange={(e) => handleUpdateStatus(book.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-slate-200 font-bold font-mono text-[10px] focus:outline-none focus:border-amber-400"
                  >
                    <option value="NONE">Status</option>
                    <option value="WANT_TO_READ">🔖 Want to Read</option>
                    <option value="CURRENTLY_READING">📖 Reading</option>
                    <option value="COMPLETED">✅ Completed</option>
                  </select>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ------------------- TAB 3: LIBRARY & READING LISTS ------------------- */}
      {activeTab === 'MY_LISTS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider">My Saved Books & Reading Stacks</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readingLists.map((list, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-100 text-sm font-sans">{list.name}</h4>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">{list.bookIds.length} Books</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Custom Curation List</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE NEW READING LIST MODAL --- */}
      <AnimatePresence>
        {showNewListModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Create Custom Reading List</h3>

              <form onSubmit={handleCreateList} className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">List Name:</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Founder Mindset 2026"
                    value={newListNameInput}
                    onChange={(e) => setNewListNameInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewListModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer shadow-md"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SHARE BOOK MODAL --- */}
      <AnimatePresence>
        {showShareModal && selectedBookForShare && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative text-center"
            >
              <h3 className="text-sm font-black uppercase text-slate-100">Share Book Summary</h3>
              <p className="text-xs text-slate-400">"{selectedBookForShare.title}" by {selectedBookForShare.author}</p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs select-all">
                https://mintstep.io/books/{selectedBookForShare.id}
              </div>

              <button
                onClick={() => {
                  triggerToast("🔗 Share link copied to clipboard!");
                  setShowShareModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md"
              >
                Copy Digital Link
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RATE BOOK MODAL --- */}
      <AnimatePresence>
        {showRateModal && selectedBookForRate && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <h3 className="text-sm font-black uppercase text-slate-100">Rate "{selectedBookForRate.title}"</h3>

              <div className="flex items-center justify-center space-x-2 py-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingScoreInput(star)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 ${star <= ratingScoreInput ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRating}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                >
                  Submit Rating
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BookRecommendations;
