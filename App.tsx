import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowRight, Shield, Wallet, Clock, Trophy, 
  AlertCircle, Eye, EyeOff, CheckCircle2, 
  Plus, Trash2, ArrowLeft, MoreHorizontal, Settings as SettingsIcon,
  BarChart3, Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Home, User, Bell, Search, Camera, X,
  ArrowUpRight, ArrowDownLeft, BadgeMinus, BadgePlus,
  RefreshCcw, AlertTriangle, Filter, Check, CheckSquare, Scan, FileBarChart, MoreVertical,
  PieChart, BookOpen, Banknote, Flag, Download, Target, StickyNote, Activity,
  Smile, Meh, Frown, Flame, Calendar, LogOut
} from 'lucide-react';
import { AppData, ViewState, Language, TrashItem, Notification as AppNotification, Priority, Task, MoodEntry } from './types';
import { TEXT, INITIAL_DATA, CURRENCIES } from './constants';

// --- Utility Functions ---

const getISODate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDay = (isoDate: string, localDateStr: string) => {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  const local = getISODate(d);
  return local === localDateStr;
};

// Generate an array of dates around a center date
const getDaysAround = (centerDateStr: string, daysBefore = 3, daysAfter = 14) => {
    const dates = [];
    const center = new Date(centerDateStr);
    for (let i = -daysBefore; i <= daysAfter; i++) {
        const d = new Date(center);
        d.setDate(center.getDate() + i);
        dates.push(d);
    }
    return dates;
};

// Detect User Currency
const detectUserCurrency = (): string => {
  try {
    const locale = navigator.language || 'en-US';
    
    // Check Locale Region
    if (locale.includes('MA')) return 'MAD'; // Morocco
    if (locale.includes('AE')) return 'AED'; // UAE
    if (locale.includes('US')) return 'USD'; // USA
    if (locale.includes('GB')) return 'GBP'; // UK
    if (locale.includes('SA')) return 'SAR'; // Saudi Arabia
    if (locale.includes('QA')) return 'QAR'; // Qatar
    if (locale.includes('DZ')) return 'DZD'; // Algeria
    if (locale.includes('TN')) return 'TND'; // Tunisia
    if (locale.includes('EG')) return 'EGP'; // Egypt
    if (locale.includes('CA')) return 'CAD'; // Canada
    if (locale.includes('FR') || locale.includes('DE') || locale.includes('ES') || locale.includes('IT') || locale.includes('NL')) return 'EUR'; // Eurozone

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Casablanca')) return 'MAD';
    if (tz.includes('Dubai')) return 'AED';
    if (tz.includes('Paris') || tz.includes('Berlin') || tz.includes('Madrid') || tz.includes('Rome') || tz.includes('Amsterdam')) return 'EUR';
    if (tz.includes('London')) return 'GBP';
    if (tz.includes('Riyadh')) return 'SAR';
    if (tz.includes('Qatar')) return 'QAR';
    if (tz.includes('Algiers')) return 'DZD';
    if (tz.includes('Tunis')) return 'TND';
    if (tz.includes('Cairo')) return 'EGP';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'CAD';
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) return 'USD';

  } catch (e) {
    console.warn("Currency detection failed", e);
  }
  return 'USD'; // Default fallback
};


// --- UI Components ---

const Button: React.FC<{ onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; children: React.ReactNode; className?: string; fullWidth?: boolean; disabled?: boolean }> = ({ 
  onClick, variant = 'primary', children, className = "", fullWidth = false, disabled = false 
}) => {
  const baseStyle = "py-4 px-6 rounded-[18px] font-display font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryDark shadow-glow",
    secondary: "bg-[#2A2A2A] text-white hover:bg-[#333333] border border-white/5",
    danger: "bg-mistake/10 text-mistake border border-mistake/20",
    ghost: "bg-transparent text-text-muted hover:text-white"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const IconButton: React.FC<{ icon: React.ReactNode; onClick?: () => void; className?: string }> = ({ icon, onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white hover:bg-[#252525] transition-colors active:scale-90 border border-white/5 ${className}`}
  >
    {icon}
  </button>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string; onBack?: () => void; rightElement?: React.ReactNode }> = ({ title, subtitle, onBack, rightElement }) => (
  <div className="flex items-center justify-between mb-6 pt-2">
    <div className="flex items-center gap-4">
      {onBack && (
        <IconButton icon={<ArrowLeft size={20} />} onClick={onBack} />
      )}
      <div>
        <h2 className="text-xl font-display font-bold text-white">{title}</h2>
        {subtitle && <p className="text-text-muted text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {rightElement}
  </div>
);

const GenericListView = ({ title, subtitle, onAdd, items, renderItem, placeholder }: any) => {
    const [newItem, setNewItem] = useState("");
    return (
        <div className="flex flex-col pt-4 pb-40">
            <SectionHeader title={title} subtitle={subtitle} />
            
            <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative group">
                        <input 
                            value={newItem} 
                            onChange={(e) => setNewItem(e.target.value)} 
                            placeholder={placeholder} 
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-[28px] py-5 pl-6 pr-6 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 focus:bg-[#202020] transition-all shadow-sm text-[15px]"
                            onKeyDown={(e) => e.key === 'Enter' && onAdd(newItem, setNewItem)}
                        />
                    </div>
                    <button 
                        onClick={() => onAdd(newItem, setNewItem)} 
                        className={`w-[60px] h-[60px] rounded-[24px] flex items-center justify-center text-white transition-all duration-300 shadow-glow
                            ${newItem.trim() ? 'bg-primary scale-100' : 'bg-[#2A2A2A] text-neutral-600 scale-95'}
                        `}
                    >
                        <Plus size={28} strokeWidth={3} />
                    </button>
                </div>
            </div>
            
            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-12 opacity-30 relative">
                        <p className="text-base font-medium text-neutral-400">{placeholder}</p>
                    </div>
                ) : (
                    items.map(renderItem)
                )}
            </div>
        </div>
    )
}

// --- App Component ---

const App: React.FC = () => {
  // State
  const [data, setData] = useState<AppData>(() => {
    try {
        const saved = localStorage.getItem('lifebooster_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.currency) parsed.currency = detectUserCurrency(); 
            if (!parsed.incomes) parsed.incomes = [];
            if (!parsed.gender) parsed.gender = 'male';
            if (!parsed.joinDate) parsed.joinDate = new Date().toISOString(); 
            if (!parsed.trash) parsed.trash = []; 
            if (!parsed.notifications) parsed.notifications = [];
            if (!parsed.userId) parsed.userId = "OP-" + Math.floor(Math.random() * 9000 + 1000);
            if (!parsed.moods) parsed.moods = [];
            return parsed;
        }
    } catch (e) {
        console.error("Failed to load data", e);
    }
    return { ...INITIAL_DATA, currency: detectUserCurrency() };
  });
  
  const [view, setView] = useState<ViewState>('onboarding');
  const [lang, setLang] = useState<Language>('en');
  const [privateMode, setPrivateMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getISODate(new Date()));
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'wallet' | 'profile'>('home');
  const [walletTab, setWalletTab] = useState<'money' | 'loans'>('money'); // Lifted state

  const todayString = getISODate(new Date());

  useEffect(() => {
    localStorage.setItem('lifebooster_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (data.hasOnboarded) {
      setView('dashboard');
    } else {
      setView('onboarding');
    }
  }, []); 

  const t = (key: string) => TEXT[key]?.[lang] || key;

  const formatCurrency = (amount: number) => {
    if (privateMode) return "***";
    const currency = data.currency || 'USD';
    try {
        let locale = 'en-US';
        if (lang === 'fr') locale = 'fr-FR';
        if (currency === 'MAD') locale = 'fr-MA';
        if (currency === 'AED') locale = 'en-AE';
        
        return new Intl.NumberFormat(locale, { 
            style: 'currency', 
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (e) {
        return `${amount} ${currency}`;
    }
  };

  const updateData = (updates: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Trash Logic
  const moveToTrash = (item: any, type: TrashItem['type']) => {
    const trashItem: TrashItem = { type, data: item, deletedAt: new Date().toISOString() };
    const updates: Partial<AppData> = { trash: [trashItem, ...data.trash] };
    
    if (type === 'task') updates.tasks = data.tasks.filter(t => t.id !== item.id);
    else if (type === 'expense') updates.expenses = data.expenses.filter(e => e.id !== item.id);
    else if (type === 'income') updates.incomes = data.incomes.filter(i => i.id !== item.id);
    else if (type === 'loan') updates.loans = data.loans.filter(l => l.id !== item.id);
    else if (type === 'challenge') updates.challenges = data.challenges.filter(c => c.id !== item.id);
    else if (type === 'mistake') updates.mistakes = data.mistakes.filter(m => m.id !== item.id);

    updateData(updates);
  };

  const restoreFromTrash = (item: TrashItem) => {
      const updates: Partial<AppData> = { trash: data.trash.filter(t => t.data.id !== item.data.id) };
      
      if (item.type === 'task') updates.tasks = [...data.tasks, item.data as any];
      else if (item.type === 'expense') updates.expenses = [...data.expenses, item.data as any];
      else if (item.type === 'income') updates.incomes = [...data.incomes, item.data as any];
      else if (item.type === 'loan') updates.loans = [...data.loans, item.data as any];
      else if (item.type === 'challenge') updates.challenges = [...data.challenges, item.data as any];
      else if (item.type === 'mistake') updates.mistakes = [...data.mistakes, item.data as any];

      updateData(updates);
  };

  const deletePermanently = (id: string) => {
      updateData({ trash: data.trash.filter(t => t.data.id !== id) });
  };

  const toggleLoanStatus = (id: string) => {
      updateData({
          loans: data.loans.map(l => l.id === id ? { ...l, isPaid: !l.isPaid } : l)
      });
  };

  // --- Views ---

  const OnboardingView = () => {
    const [step, setStep] = useState(0);
    const [userName, setUserName] = useState("");

    const steps = [
      { title: t('onboarding_1_title'), desc: t('onboarding_1_desc'), icon: Shield },
      { title: t('onboarding_2_title'), desc: t('onboarding_2_desc'), icon: Activity },
      { title: t('onboarding_3_title'), desc: t('onboarding_3_desc'), icon: Wallet },
    ];

    const handleInitialize = () => {
        if (!userName.trim()) return;
        const newData = { 
            ...data,
            hasOnboarded: true,
            joinDate: new Date().toISOString(),
            name: userName.trim(),
        };
        setData(newData);
        setView('dashboard');
    };

    const handleNext = () => {
      if (step < steps.length - 1) setStep(step + 1);
    };

    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto animate-in fade-in duration-700 bg-bg relative">
        {step < steps.length - 1 && (
            <button onClick={() => setStep(steps.length - 1)} className="absolute top-6 right-6 text-text-muted hover:text-white text-sm font-semibold">{t('btn_skip')}</button>
        )}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-10 border border-white/5 relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            {React.createElement(steps[step].icon, { size: 40, className: "text-primary relative z-10" })}
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">{steps[step].title}</h1>
          <p className="text-text-muted leading-relaxed text-sm max-w-[280px] mx-auto">{steps[step].desc}</p>
        </div>
        <div className="w-full pb-10 space-y-4">
          {step === steps.length - 1 ? (
              <div className="w-full flex flex-col items-center gap-4 animate-in slide-in-from-bottom-5">
                  <div className="w-full space-y-2 mb-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold text-center opacity-60">
                      {lang === 'fr' ? 'ENTREZ VOTRE NOM' : 'ENTER YOUR NAME'}
                    </p>
                    <input 
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={lang === 'fr' ? 'Votre nom...' : 'Your name...'}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl py-4 px-6 text-center text-white focus:outline-none focus:border-primary/50 transition-all font-display font-bold text-lg"
                      autoFocus
                    />
                  </div>
                  <Button 
                    fullWidth 
                    onClick={handleInitialize} 
                    disabled={!userName.trim()}
                    className="shadow-glow"
                  >
                    {t('btn_get_started')}
                  </Button>
              </div>
          ) : (
            <Button fullWidth onClick={handleNext} className="shadow-none" variant="primary">
                {t('btn_continue')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const DashboardView = () => {
    const scrollableDates = useMemo(() => getDaysAround(selectedDate, 3, 7), [selectedDate]);
    const currentTasks = data.tasks.filter(t => t.date === selectedDate);
    const tasksDone = currentTasks.filter(t => t.completed).length;
    const tasksTotal = currentTasks.length;
    const tasksProgress = tasksTotal > 0 ? (tasksDone / tasksTotal) * 100 : 0;
    const totalBalance = data.incomes.reduce((a,c) => a+c.amount,0) - data.expenses.reduce((a,c) => a+c.amount,0);

    return (
      <div className="pb-40 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6 pt-4">
          <div className="flex items-center gap-3">
             <div onClick={() => setView('settings')} className="w-10 h-10 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-transform">
                {data.profileImage ? (
                    <img src={data.profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                    <span className="font-display font-bold text-sm text-primary">
                        {data.name.charAt(0).toUpperCase()}
                    </span>
                )}
             </div>
             <div>
                <h1 className="text-xl font-display font-bold flex items-center gap-2">{t('hi')}, {data.name}</h1>
                <p className="text-text-muted text-xs">{t('dashboard_subtitle')}</p>
             </div>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <IconButton icon={<Bell size={20} />} onClick={() => setView('notifications')} />
                {data.notifications.some(n => !n.read) && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1A1A1A]"></div>}
             </div>
             <IconButton icon={privateMode ? <EyeOff size={20} /> : <Eye size={20} />} onClick={() => setPrivateMode(!privateMode)} />
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-[32px] p-6 mb-6 border border-white/5 relative overflow-hidden">
             <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shadow-glow text-primary">
                    <Trophy size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-white">{t('daily_goal')}</h3>
                    <p className="text-text-muted text-xs">{new Date(selectedDate).toLocaleDateString((lang === 'fr') ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long'})}</p>
                 </div>
             </div>

             <div className="mb-2 flex justify-between items-end">
                <span className="text-sm font-medium text-gray-200">{t('your_progress')}</span>
                <span className="text-xs text-text-muted">#{tasksDone} / {tasksTotal}</span>
             </div>
             <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden mb-6">
                <div className="h-full rounded-full transition-all duration-1000 bg-primary" style={{ width: `${tasksProgress}%` }}></div>
             </div>

             <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">{t('money_balance')}:</span>
                    <span className="font-bold text-white">{formatCurrency(totalBalance)}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => setView('time_manager')}>{t('btn_start_day')}</Button>
                <Button variant="secondary" onClick={() => setView('daily_summary')}>{t('quick_overview')}</Button>
             </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar px-1">
            {scrollableDates.map((d, idx) => {
                const dateStr = getISODate(d);
                const isSelected = dateStr === selectedDate;
                const isPast = dateStr < todayString;
                return (
                    <button key={idx} onClick={() => setSelectedDate(dateStr)} className={`min-w-[56px] h-[72px] rounded-[24px] flex flex-col items-center justify-center gap-1 transition-all duration-300 border ${isSelected ? 'bg-primary text-white border-primary shadow-glow scale-105' : 'bg-[#1A1A1A] text-text-muted border-white/5'} ${isPast && !isSelected ? 'opacity-50' : ''}`}>
                        <span className={`text-[10px] font-medium opacity-80`}>{d.toLocaleDateString((lang === 'fr') ? 'fr-FR' : 'en-US', { weekday: 'short' })}</span>
                        <span className="text-lg font-bold">{d.getDate()}</span>
                        {!isSelected && data.tasks.some(t => t.date === dateStr) && <span className="w-1 h-1 rounded-full bg-white/30 mt-1"></span>}
                    </button>
                )
            })}
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div onClick={() => setView('time_manager')} className="bg-[#1A1A1A] p-5 rounded-3xl border border-white/5 cursor-pointer active:scale-95 transition-all flex flex-col justify-between h-36">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3"><Clock size={20} /></div>
                <div><h4 className="font-bold text-sm text-white mb-1">{t('section_tasks')}</h4><p className="text-xs text-text-muted">{tasksTotal - tasksDone} {t('pending')}</p></div>
            </div>
            <div onClick={() => { setActiveTab('wallet'); setView('wallet'); }} className="bg-[#1A1A1A] p-5 rounded-3xl border border-white/5 cursor-pointer active:scale-95 transition-all flex flex-col justify-between h-36">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary"><Wallet size={20} /></div>
                <div><h4 className="font-bold text-sm text-white mb-1">{t('section_wallet')}</h4><p className="text-[10px] text-text-muted font-bold uppercase">{t('money_manage_tap')}</p></div>
            </div>
            <div onClick={() => setView('long_term_goals')} className="bg-[#1A1A1A] p-5 rounded-3xl border border-white/5 cursor-pointer active:scale-95 transition-all flex flex-col justify-between h-36">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-3"><Target size={20} /></div>
                <div><h4 className="font-bold text-sm text-white mb-1">{t('challenges_title')}</h4><p className="text-xs text-text-muted line-clamp-2">{t('section_challenges_sub')}</p></div>
            </div>
             <div onClick={() => setView('learned_lessons')} className="bg-[#1A1A1A] p-5 rounded-3xl border border-white/5 cursor-pointer active:scale-95 transition-all flex flex-col justify-between h-36">
                <div className="w-10 h-10 rounded-full bg-mistake/10 flex items-center justify-center text-mistake mb-3"><BookOpen size={20} /></div>
                <div><h4 className="font-bold text-sm text-white mb-1">{t('mistakes_title')}</h4><p className="text-xs text-text-muted line-clamp-2">{t('section_mistakes_sub')}</p></div>
            </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => {
      const fileInputRefProfile = useRef<HTMLInputElement>(null);

      const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  updateData({ profileImage: reader.result as string });
              };
              reader.readAsDataURL(file);
          }
      };
      
      const handleLogout = () => {
        if (confirm(t('reset_confirm_msg'))) {
            updateData({ hasOnboarded: false });
            setView('onboarding');
        }
      };

      return (
      <div className="pt-4 pb-40 animate-in fade-in duration-300">
          <SectionHeader title={t('edit_profile')} onBack={() => setView('dashboard')} />
          
          <div className="relative mb-24 px-1">
                {/* Fixed Background Header with Green Marble Image */}
                <div className="relative w-full h-48 rounded-[32px] overflow-hidden border border-white/5 flex items-center justify-center bg-[#0a0a0a]">
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                      className="w-full h-full object-cover opacity-80"
                      alt="Profile Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]/90"></div>
                </div>

                {/* Profile Image - Overlapping with correct negative margin and icon placement */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-[6px] border-[#050505] bg-[#202020] overflow-hidden shadow-2xl flex items-center justify-center">
                             {data.profileImage ? (
                                <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-display font-bold text-primary">
                                    {data.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        {/* Camera Icon positioned on the bottom right of the circle */}
                        <button 
                            onClick={() => fileInputRefProfile.current?.click()}
                            className="absolute bottom-1 right-1 w-9 h-9 bg-[#222] rounded-full flex items-center justify-center text-white border-4 border-[#050505] active:scale-95 transition-all z-10 shadow-lg"
                        >
                            <Camera size={14} />
                        </button>
                    </div>
                    <input ref={fileInputRefProfile} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                    {/* Improved ID Display */}
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-white/10 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-primary"></span>
                        <span className="text-[10px] font-mono text-text-muted tracking-[0.2em] font-medium">{data.userId}</span>
                    </div>
                </div>
          </div>

          <div className="space-y-6 pt-6">
              <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5">
                  <label className="block text-sm font-medium text-text-muted mb-2 ml-1">{t('settings_name')}</label>
                  <input 
                      defaultValue={data.name} 
                      onBlur={(e) => updateData({ name: e.target.value })}
                      className="w-full bg-[#252525] rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-white/10 transition-all font-medium"
                      placeholder="Codename"
                  />
              </div>

              <div className="pt-4 border-t border-white/5">
                  <h3 className="text-lg font-bold mb-4 px-2">{t('settings_title')}</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-white/5 flex justify-between items-center">
                        <span className="text-sm font-medium">{t('settings_language')}</span>
                        <div className="flex gap-2">
                            {(['en', 'fr'] as Language[]).map(l => (
                                <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === l ? 'bg-primary text-white' : 'bg-[#2A2A2A] text-text-muted hover:text-white'}`}>{l.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-white/5 flex justify-between items-center">
                        <span className="text-sm font-medium">{t('settings_currency')}</span>
                        <select value={data.currency} onChange={(e) => updateData({ currency: e.target.value })} className="bg-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs outline-none font-bold">
                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                        </select>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
                         <Button variant="secondary" fullWidth onClick={() => setView('trash')} className="flex items-center justify-center gap-2 border-0 bg-transparent hover:bg-[#252525] justify-start px-4">
                            <Trash2 size={16} />
                            {t('trash_title')}
                        </Button>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                         <Button variant="secondary" fullWidth onClick={handleLogout}>
                            <LogOut size={16} />
                            {lang === 'fr' ? 'Déconnexion' : 'Logout'}
                        </Button>
                         <Button variant="danger" fullWidth onClick={() => { if(confirm(t('reset_confirm_msg'))) { localStorage.removeItem('lifebooster_data'); window.location.reload(); } }}>
                            <AlertTriangle size={16} />
                            {t('settings_reset')}
                        </Button>
                    </div>
                  </div>
              </div>
          </div>
      </div>
  )};

  const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date(selectedDate || new Date()));
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getDayProductivity = (date: Date) => {
        const dStr = getISODate(date);
        const tasks = data.tasks.filter(t => t.date === dStr);
        if (tasks.length === 0) return 'none';
        const completed = tasks.filter(t => t.completed).length;
        const ratio = completed / tasks.length;
        if (ratio === 1) return 'high';
        if (ratio >= 0.5) return 'medium';
        return 'low';
    };

    // Calculate Streak
    const currentStreak = useMemo(() => {
        let streak = 0;
        const d = new Date();
        while (true) {
            const dateStr = getISODate(d);
            const tasks = data.tasks.filter(t => t.date === dateStr);
            if (tasks.length > 0 && tasks.every(t => t.completed)) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }, [data.tasks]);

    return (
        <div className="pt-4 pb-40 animate-in fade-in duration-300">
             <SectionHeader title={t('calendar_title')} onBack={() => setView('dashboard')} />

             {/* Streak Card */}
             <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 mb-6 flex items-center justify-between overflow-hidden relative">
                 <div className="relative z-10">
                     <p className="text-text-muted text-xs uppercase tracking-wider font-bold mb-1">{t('stats_streak')}</p>
                     <p className="text-4xl font-display font-bold text-white flex items-center gap-2">
                         {currentStreak} <Flame size={32} className="text-orange-500 animate-pulse" fill="#F97316" />
                     </p>
                 </div>
                 <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
             </div>
             
             <div className="bg-[#1A1A1A] rounded-[24px] p-6 mb-6 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronLeft size={20} /></button>
                    <h3 className="font-bold text-lg capitalize text-white">{currentDate.toLocaleDateString((lang === 'fr') ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronRight size={20} /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                        <div key={i} className="text-xs text-text-muted font-bold">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                    {days.map((d, i) => {
                        if (!d) return <div key={i}></div>;
                        const status = getDayProductivity(d);
                        let dotColor = 'bg-transparent';
                        if (status === 'high') dotColor = 'bg-emerald-500';
                        if (status === 'medium') dotColor = 'bg-orange-500';
                        if (status === 'low') dotColor = 'bg-red-500';
                        
                        const isSelected = getISODate(d) === selectedDate;
                        const isToday = getISODate(d) === todayString;
                        
                        return (
                            <button 
                                key={i} 
                                onClick={() => { setSelectedDate(getISODate(d)); setView('dashboard'); }}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all relative ${isSelected ? 'bg-white/10 text-white border border-white/20' : 'text-text-muted hover:bg-white/5'}`}
                            >
                                <span className={isToday ? 'text-white' : ''}>{d.getDate()}</span>
                                {status !== 'none' && (
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor} ${status === 'high' ? 'shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}`}></span>
                                )}
                            </button>
                        );
                    })}
                </div>
             </div>

             <div className="text-center opacity-60">
                 <p className="text-sm italic font-display">{t('calendar_footer')}</p>
             </div>
        </div>
    );
  };

  const TimeManagerView = () => {
      const [newTask, setNewTask] = useState("");
      const [priority, setPriority] = useState<Priority>('medium');
      const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];
      const currentTasks = data.tasks.filter(t => t.date === selectedDate);
      const sortedTasks = [...currentTasks].sort((a, b) => {
          if (a.completed === b.completed) {
              const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
              return pOrder[a.priority] - pOrder[b.priority];
          }
          return a.completed ? 1 : -1;
      });

      const addTask = () => {
          if (!newTask.trim()) return;
          const task: Task = {
              id: Date.now().toString(),
              text: newTask,
              completed: false,
              priority: priority,
              date: selectedDate,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          updateData({ tasks: [task, ...data.tasks] });
          setNewTask("");
      };

      const toggleTask = (id: string) => {
          updateData({
              tasks: data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
          });
      };

      const PriorityCard = ({ title, count, bgClass, textClass }: any) => (
          <div className={`p-4 rounded-[20px] flex flex-col justify-between h-28 border border-white/5 ${bgClass}`}>
              <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${textClass}`}>{title}</span>
                  <Activity size={16} className={textClass} />
              </div>
              <span className="text-3xl font-bold text-white">{count}</span>
          </div>
      );

      return (
          <div className="pt-4 pb-40 animate-in fade-in duration-300">
               <SectionHeader title={t('tasks_title')} onBack={() => setView('dashboard')} />
               
               {/* Priority Matrix */}
               <div className="bg-[#1A1A1A] p-5 rounded-[32px] border border-white/5 mb-8">
                   <div className="flex justify-between items-center mb-4 px-1">
                       <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('task_completed_label')}</span>
                       <span className="text-xs font-bold text-white">{currentTasks.filter(t=>t.completed).length}/{currentTasks.length}</span>
                   </div>
                   <div className="w-full h-2 bg-[#252525] rounded-full overflow-hidden mb-6">
                       <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${currentTasks.length > 0 ? (currentTasks.filter(t=>t.completed).length / currentTasks.length) * 100 : 0}%` }}></div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                       <PriorityCard title={t('prio_urgent')} count={currentTasks.filter(t => t.priority === 'urgent').length} bgClass="bg-red-500/10" textClass="text-red-500" />
                       <PriorityCard title={t('prio_high')} count={currentTasks.filter(t => t.priority === 'high').length} bgClass="bg-orange-500/10" textClass="text-orange-500" />
                       <PriorityCard title={t('prio_medium')} count={currentTasks.filter(t => t.priority === 'medium').length} bgClass="bg-blue-500/10" textClass="text-blue-500" />
                       <PriorityCard title={t('prio_low')} count={currentTasks.filter(t => t.priority === 'low').length} bgClass="bg-emerald-500/10" textClass="text-emerald-500" />
                   </div>
               </div>

               <div className="mb-6">
                  <div className="bg-[#1A1A1A] p-4 rounded-[24px] border border-white/5">
                      <div className="flex gap-2 mb-3">
                          <input 
                              value={newTask} 
                              onChange={(e) => setNewTask(e.target.value)} 
                              placeholder={t('tasks_placeholder')} 
                              className="flex-1 bg-[#252525] rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-white/20 text-sm transition-colors caret-primary"
                              onKeyDown={(e) => e.key === 'Enter' && addTask()}
                          />
                          <button 
                              onClick={addTask}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${newTask.trim() ? 'bg-primary text-white shadow-glow' : 'bg-[#252525] text-text-muted'}`}
                          >
                              <Plus size={24} />
                          </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar">
                          {priorities.map(p => (
                              <button 
                                  key={p} 
                                  onClick={() => setPriority(p)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap border ${
                                      priority === p 
                                      ? 'bg-white text-black border-white' 
                                      : 'bg-[#252525] text-text-muted border-transparent hover:bg-[#303030]'
                                  }`}
                              >
                                  {t(`prio_${p}`)}
                              </button>
                          ))}
                      </div>
                  </div>
               </div>

               <div className="space-y-3">
                   {sortedTasks.length === 0 && (
                       <div className="text-center py-10 opacity-50">
                           <CheckSquare size={48} className="mx-auto mb-3 text-text-muted" />
                           <p className="text-text-muted">{t('tasks_empty')}</p>
                       </div>
                   )}
                   {sortedTasks.map(task => (
                       <div key={task.id} className={`p-4 bg-[#1A1A1A] rounded-[20px] border border-white/5 flex gap-3 group ${task.completed ? 'opacity-50' : ''}`}>
                           <button onClick={() => toggleTask(task.id)} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-primary border-primary text-black' : 'border-white/20 hover:border-primary'}`}>
                               {task.completed && <Check size={14} strokeWidth={3} />}
                           </button>
                           <div className="flex-1 min-w-0">
                               <p className={`text-sm font-medium mb-1 break-words ${task.completed ? 'line-through text-text-muted' : 'text-white'}`}>{task.text}</p>
                               <div className="flex items-center gap-2">
                                   <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold capitalize ${
                                       task.priority === 'urgent' ? 'bg-red-500/20 text-red-500' :
                                       task.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                       task.priority === 'medium' ? 'bg-blue-500/20 text-blue-500' :
                                       'bg-gray-500/20 text-gray-500'
                                   }`}>
                                       {t(`prio_${task.priority}`)}
                                   </span>
                                   {task.time && <span className="text-[10px] text-text-muted">{task.time}</span>}
                               </div>
                           </div>
                           <button onClick={() => moveToTrash(task, 'task')} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-mistake p-1 self-start">
                               <Trash2 size={16} />
                           </button>
                       </div>
                   ))}
               </div>
          </div>
      )
  };

  const DailySummaryView = () => {
    const tasksDone = data.tasks.filter(t => t.date === selectedDate && t.completed).length;
    const tasksTotal = data.tasks.filter(t => t.date === selectedDate).length;
    const spentToday = data.expenses.filter(e => isSameDay(e.date, selectedDate)).reduce((a,c) => a+c.amount, 0);

    const currentMood = data.moods.find(m => m.date === selectedDate)?.mood;

    const setMood = (mood: MoodEntry['mood']) => {
        const existing = data.moods.findIndex(m => m.date === selectedDate);
        let newMoods = [...data.moods];
        if (existing >= 0) {
            newMoods[existing].mood = mood;
        } else {
            newMoods.push({ date: selectedDate, mood });
        }
        updateData({ moods: newMoods });
    };

    const MoodBtn = ({ mood, icon }: { mood: MoodEntry['mood'], icon: React.ReactNode }) => (
        <button 
            onClick={() => setMood(mood)}
            className={`flex-1 aspect-square rounded-2xl flex items-center justify-center transition-all border ${currentMood === mood ? 'bg-white text-black border-white scale-110 shadow-glow' : 'bg-[#252525] text-text-muted border-transparent hover:bg-[#333]'}`}
        >
            {icon}
        </button>
    );

    return (
        <div className="pt-4 pb-40 animate-in fade-in duration-300">
             <SectionHeader title={t('summary_title')} onBack={() => setView('dashboard')} />
             
             <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-[#1A1A1A] p-4 rounded-[24px] border border-white/5">
                     <p className="text-text-muted text-xs mb-1">{t('task_completed_label')}</p>
                     <p className="text-2xl font-bold">{tasksDone} <span className="text-sm text-text-muted font-normal">/ {tasksTotal}</span></p>
                 </div>
                 <div className="bg-[#1A1A1A] p-4 rounded-[24px] border border-white/5">
                     <p className="text-text-muted text-xs mb-1">{t('money_spent')}</p>
                     <p className="text-2xl font-bold text-mistake">{formatCurrency(spentToday)}</p>
                 </div>
             </div>

             <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 mb-6">
                 <h4 className="font-bold text-sm text-white mb-4">{t('summary_mood')}</h4>
                 <div className="flex gap-3">
                     <MoodBtn mood="great" icon={<Smile size={24} className="text-emerald-500" />} />
                     <MoodBtn mood="good" icon={<Smile size={24} className="text-blue-500" />} />
                     <MoodBtn mood="neutral" icon={<Meh size={24} className="text-yellow-500" />} />
                     <MoodBtn mood="bad" icon={<Frown size={24} className="text-orange-500" />} />
                     <MoodBtn mood="awful" icon={<AlertCircle size={24} className="text-red-500" />} />
                 </div>
             </div>
        </div>
    );
  };

  const NotificationsView = () => {
      const markAllRead = () => {
          updateData({ notifications: data.notifications.map(n => ({ ...n, read: true })) });
      };

      return (
          <div className="pt-4 pb-40 animate-in fade-in duration-300">
               <SectionHeader 
                  title={t('notifications_title')} 
                  onBack={() => setView('dashboard')} 
                  rightElement={
                      data.notifications.some(n => !n.read) && (
                        <button onClick={markAllRead} className="text-xs font-bold text-primary">{t('notifications_mark_read')}</button>
                      )
                  }
               />
               
               <div className="space-y-3">
                   {data.notifications.length === 0 && (
                       <div className="text-center py-10 opacity-50">
                           <Bell size={48} className="mx-auto mb-3 text-text-muted" />
                           <p className="text-text-muted">{t('notifications_empty')}</p>
                       </div>
                   )}
                   {[...data.notifications].reverse().map(n => (
                       <div key={n.id} className={`p-4 bg-[#1A1A1A] rounded-[20px] border border-white/5 flex gap-4 ${n.read ? 'opacity-60' : 'opacity-100'}`}>
                           <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                               n.type === 'success' ? 'bg-green-500' : 
                               n.type === 'error' ? 'bg-red-500' : 
                               n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                           }`} />
                           <div>
                               <h4 className="font-bold text-sm mb-1">{n.title}</h4>
                               <p className="text-xs text-text-muted leading-relaxed">{n.message}</p>
                               <p className="text-[10px] text-text-muted mt-2 opacity-60">{new Date(n.date).toLocaleString()}</p>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      );
  };

  const WalletView = () => {
      // Use lifted state from parent component scope instead of local state
      // const [tab, setTab] = useState<'money' | 'loans'>('money'); 
      const [amount, setAmount] = useState("");
      const [desc, setDesc] = useState("");
      const [dueDate, setDueDate] = useState("");
      const [type, setType] = useState<'expense' | 'income'>('expense');
      const [loanType, setLoanType] = useState<'lent' | 'borrowed'>('lent');
      const [showAddForm, setShowAddForm] = useState(false);
      
      const totalIncome = data.incomes.reduce((a,c) => a+c.amount, 0);
      const totalExpense = data.expenses.reduce((a,c) => a+c.amount, 0);
      const balance = totalIncome - totalExpense;
      const totalVolume = totalIncome + totalExpense;
      const incomePct = totalVolume > 0 ? (totalIncome / totalVolume) * 100 : 0;
      const expensePct = totalVolume > 0 ? (totalExpense / totalVolume) * 100 : 0;

      // Loans calculations
      const totalLent = data.loans.filter(l => l.type === 'lent' && !l.isPaid).reduce((a,c) => a + c.amount, 0);
      const totalBorrowed = data.loans.filter(l => l.type === 'borrowed' && !l.isPaid).reduce((a,c) => a + c.amount, 0);
      
      const addTransaction = () => {
          if (!amount || !desc) return;
          const val = parseFloat(amount);
          if (isNaN(val)) return;

          const id = Date.now().toString();
          const date = new Date().toISOString();

          if (walletTab === 'money') {
            if (type === 'expense') {
                updateData({ expenses: [{ id, amount: val, description: desc, date }, ...data.expenses] });
            } else {
                updateData({ incomes: [{ id, amount: val, description: desc, date }, ...data.incomes] });
            }
          } else {
             // Loan
             updateData({ loans: [{ id, amount: val, person: desc, type: loanType, isPaid: false, createdAt: date, dueDate: dueDate || undefined }, ...data.loans] });
          }
          setAmount("");
          setDesc("");
          setDueDate("");
          setShowAddForm(false);
      };

      const transactions = [
          ...data.expenses.map(e => ({ ...e, type: 'expense' })),
          ...data.incomes.map(i => ({ ...i, type: 'income' })),
      ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Component for Loan Progress Bar
      const LoanProgressBar = ({ startDate, dueDate }: { startDate: string, dueDate?: string }) => {
        if (!dueDate) return (
            <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-white/20 w-1/2"></div>
            </div>
        );

        const start = new Date(startDate).getTime();
        const end = new Date(dueDate).getTime();
        const now = new Date().getTime();
        const total = end - start;
        const current = now - start;
        
        let percentage = 0;
        if (total > 0) {
            percentage = Math.min(100, Math.max(0, (current / total) * 100));
        }

        const isOverdue = now > end;

        return (
             <div className="w-full h-1.5 bg-[#0a0a0a] rounded-full mt-2 overflow-hidden border border-white/5">
                <div 
                    className={`h-full rounded-full ${isOverdue ? 'bg-red-500' : 'bg-primary'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        )
      };

      return (
          <div className="pt-4 pb-40 animate-in fade-in duration-300">
              <SectionHeader title={t('section_wallet')} onBack={() => setView('dashboard')} />

              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#1A1A1A] p-1.5 rounded-[20px] border border-white/5 mb-8">
                    <button 
                        onClick={() => setWalletTab('money')} 
                        className={`py-3 rounded-[16px] text-sm font-bold transition-all ${walletTab === 'money' ? 'bg-[#2A2A2A] text-white shadow-sm border border-white/5' : 'text-text-muted hover:text-white'}`}
                    >
                        {t('section_money')}
                    </button>
                    <button 
                        onClick={() => setWalletTab('loans')} 
                        className={`py-3 rounded-[16px] text-sm font-bold transition-all ${walletTab === 'loans' ? 'bg-[#2A2A2A] text-white shadow-sm border border-white/5' : 'text-text-muted hover:text-white'}`}
                    >
                        {t('section_loans')}
                    </button>
               </div>

              {walletTab === 'money' ? (
                  <>
                    <div className="bg-[#1A1A1A] p-6 rounded-[32px] border border-white/5 mb-6">
                        {/* Donut Chart */}
                        <div className="flex justify-center mb-8 relative">
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        {totalVolume === 0 && (
                                            <path className="text-[#262626]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                        )}
                                        {totalVolume > 0 && (
                                            <circle className="text-[#10B981] transition-all duration-500" cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${incomePct}, 100`} />
                                        )}
                                        {totalVolume > 0 && (
                                            <circle className="text-[#EF4444] transition-all duration-500" cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${expensePct}, 100`} strokeDashoffset={-incomePct} />
                                        )}
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-2xl font-display font-bold ${balance < 0 ? 'text-[#EF4444]' : 'text-white'}`}>{formatCurrency(balance)}</span>
                                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">{t('money_balance')}</span>
                                    </div>
                                </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                                        <span className="text-sm font-medium text-[#9CA3AF]">{t('money_income')}</span>
                                    </div>
                                    <span className="text-base font-bold text-white">{formatCurrency(totalIncome)}</span>
                                </div>
                                <div className="w-full h-[1px] bg-white/5"></div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                                        <span className="text-sm font-medium text-[#9CA3AF]">{t('money_spent')}</span>
                                    </div>
                                    <span className="text-base font-bold text-white">{formatCurrency(totalExpense)}</span>
                                </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                             <Button fullWidth onClick={() => { setShowAddForm(true); setType('income'); }}>
                                <ArrowDownLeft size={20} />
                                {t('tx_type_income')}
                            </Button>
                             <Button fullWidth variant="secondary" onClick={() => { setShowAddForm(true); setType('expense'); }}>
                                <ArrowUpRight size={20} />
                                {t('tx_type_expense')}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Transaction History */}
                     <div className="space-y-3">
                         <h3 className="font-bold text-lg mb-2 pl-2">{t('tx_history')}</h3>
                         {transactions.length === 0 && <p className="text-text-muted text-center py-8">{t('tx_empty')}</p>}
                         {transactions.map(tx => (
                             <div key={tx.id} className="bg-[#1A1A1A] p-4 rounded-[20px] border border-white/5 flex justify-between items-center">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                         {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                     </div>
                                     <div>
                                         <p className="font-bold text-sm text-white">{tx.description}</p>
                                         <p className="text-[10px] text-text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                                 <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-white'}`}>
                                     {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                 </span>
                             </div>
                         ))}
                     </div>
                  </>
              ) : (
                  // Loans Tab - REVAMPED DESIGN
                  <div className="animate-in fade-in duration-300">
                      
                      {/* Summary Cards Row */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {/* Green Card - Assets */}
                        <div className="bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 p-5 rounded-[24px] border border-[#10B981]/20 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-20">
                                <ArrowUpRight size={48} className="text-[#10B981]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] mb-1">{t('loans_lent')}</p>
                                <p className="text-xs text-text-muted opacity-70">Assets</p>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white mt-auto">{formatCurrency(totalLent)}</h2>
                        </div>

                        {/* Red Card - Liabilities */}
                        <div className="bg-gradient-to-br from-[#EF4444]/20 to-[#EF4444]/5 p-5 rounded-[24px] border border-[#EF4444]/20 flex flex-col justify-between h-32 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-3 opacity-20">
                                <ArrowDownLeft size={48} className="text-[#EF4444]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444] mb-1">{t('loans_borrowed')}</p>
                                <p className="text-xs text-text-muted opacity-70">Liabilities</p>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white mt-auto">{formatCurrency(totalBorrowed)}</h2>
                        </div>
                      </div>

                      {/* Add Button */}
                       <Button fullWidth onClick={() => setShowAddForm(!showAddForm)} className={`mb-6 ${showAddForm ? 'bg-[#2A2A2A] text-white' : ''}`}>
                            {showAddForm ? <X size={20} /> : <Plus size={20} />}
                            {showAddForm ? t('back') : t('loans_add')}
                       </Button>

                      {showAddForm && (
                        <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5 mb-8 animate-in slide-in-from-top-4 fade-in">
                            <h3 className="font-bold mb-4 text-sm">{t('loans_add')}</h3>
                            <div className="flex gap-2 mb-4 bg-[#252525] p-1 rounded-xl">
                                <button onClick={() => setLoanType('lent')} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${loanType === 'lent' ? 'bg-[#10B981] text-white shadow-glow' : 'text-text-muted hover:text-white'}`}>{t('tx_type_lent')}</button>
                                <button onClick={() => setLoanType('borrowed')} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${loanType === 'borrowed' ? 'bg-[#EF4444] text-white shadow-glow' : 'text-text-muted hover:text-white'}`}>{t('tx_type_borrowed')}</button>
                            </div>
                            <div className="space-y-3">
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)} 
                                    placeholder={t('money_placeholder')}
                                    className="w-full bg-[#252525] rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-white/20 font-mono text-lg font-bold"
                                />
                                <input 
                                    value={desc} 
                                    onChange={e => setDesc(e.target.value)} 
                                    placeholder={t('person_name')}
                                    className="w-full bg-[#252525] rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-white/20"
                                />
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                        <Calendar size={18} className="text-text-muted" />
                                    </div>
                                    <input 
                                        type="date"
                                        value={dueDate} 
                                        onChange={e => setDueDate(e.target.value)} 
                                        className={`w-full bg-[#252525] rounded-xl pl-12 pr-4 py-3.5 outline-none border border-transparent focus:border-white/20 text-sm ${dueDate ? 'text-white' : 'text-text-muted'}`}
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <Button fullWidth onClick={addTransaction} variant="primary">{t('tx_add_btn')}</Button>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {data.loans.length === 0 && <div className="text-center text-text-muted text-sm py-10 opacity-50 flex flex-col items-center"><Wallet size={48} className="mb-4 text-text-muted/50" /> {t('tx_empty')}</div>}
                        
                        {data.loans.filter(l => !l.isPaid).map(item => (
                            <div key={item.id} className="bg-[#161616] p-0 rounded-[24px] border border-white/5 relative overflow-hidden transition-all hover:border-white/10 group">
                                {/* Header */}
                                <div className={`p-4 flex justify-between items-center border-b border-white/5 bg-gradient-to-r ${item.type === 'lent' ? 'from-[#10B981]/10 to-transparent' : 'from-[#EF4444]/10 to-transparent'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'lent' ? 'bg-[#10B981] text-black' : 'bg-[#EF4444] text-white'}`}>
                                            {item.type === 'lent' ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownLeft size={18} strokeWidth={2.5} />}
                                        </div>
                                        <span className="font-bold text-sm text-white uppercase tracking-wide">{item.person}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); moveToTrash(item, 'loan'); }} 
                                            className="text-text-muted/50 hover:text-mistake transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${item.type === 'lent' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                                            {item.type === 'lent' ? t('tx_type_lent').toUpperCase() : t('tx_type_borrowed').toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5">
                                     <div className="flex justify-between items-center mb-6">
                                         <div>
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1 opacity-60">{t('amount') || 'AMOUNT'}</p>
                                            <p className="text-4xl font-display font-bold text-white tracking-tight">{formatCurrency(item.amount)}</p>
                                         </div>
                                         {/* Check Button */}
                                         <button 
                                            onClick={() => toggleLoanStatus(item.id)}
                                            className="w-12 h-12 rounded-full bg-[#252525] hover:bg-white hover:text-black flex items-center justify-center transition-all active:scale-95 border border-white/5 shadow-2xl group-hover:border-white/20"
                                         >
                                            <Check size={20} strokeWidth={3} />
                                         </button>
                                    </div>
                                    
                                    {/* Timeline */}
                                    <div className="mt-2">
                                        <div className="flex justify-between text-[11px] text-text-muted font-mono font-medium mb-2">
                                            <span>{new Date(item.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                            <span className={item.dueDate && new Date(item.dueDate) < new Date() ? 'text-red-500 font-bold' : ''}>
                                                {item.dueDate ? new Date(item.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : ''}
                                            </span>
                                        </div>
                                        <LoanProgressBar startDate={item.createdAt} dueDate={item.dueDate} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                         {/* Settled Loans Section */}
                         {data.loans.filter(l => l.isPaid).length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 opacity-60 pl-2">{t('loan_paid')}</p>
                                {data.loans.filter(l => l.isPaid).map(item => (
                                    <div key={item.id} className="bg-[#1A1A1A] px-4 py-3 rounded-[16px] border border-white/5 flex justify-between items-center mb-2 opacity-50 hover:opacity-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium line-through text-text-muted">{item.person}</p>
                                                <p className="text-[10px] text-text-muted/50 font-mono">{formatCurrency(item.amount)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => moveToTrash(item, 'loan')} className="text-text-muted hover:text-white p-2">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                  </div>
              )}
          </div>
      );
  };

  const renderContent = () => {
      switch (view) {
          case 'onboarding': return <OnboardingView />;
          case 'dashboard': return <DashboardView />;
          case 'daily_summary': return <DailySummaryView />;
          case 'notifications': return <NotificationsView />;
          case 'wallet': return <WalletView />;
          case 'time_manager': return <TimeManagerView />;
          case 'long_term_goals': return <GenericListView title={t('challenges_title')} subtitle={t('section_challenges_sub')} placeholder={t('challenges_placeholder')} items={data.challenges.filter(c => c.date === selectedDate)} onAdd={(text: string, setText: any) => { updateData({ challenges: [{ id: Date.now().toString(), text, completed: false, date: selectedDate }, ...data.challenges] }); setText(""); }} renderItem={(item: any) => (<div key={item.id} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-white/5 rounded-2xl"><div className="flex items-center gap-3"><button onClick={() => updateData({ challenges: data.challenges.map(c => c.id === item.id ? { ...c, completed: !c.completed } : c) })}>{item.completed ? <Target className="text-yellow-500" size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-white/20" />}</button><span className={`${item.completed ? 'line-through text-text-muted' : 'text-white'}`}>{item.text}</span></div><button onClick={() => moveToTrash(item, 'challenge')} className="text-text-muted"><Trash2 size={18} /></button></div>)} />;
          case 'learned_lessons': return <GenericListView title={t('mistakes_title')} subtitle={t('section_mistakes_sub')} placeholder={t('mistakes_placeholder')} items={data.mistakes.filter(m => isSameDay(m.date, selectedDate))} onAdd={(text: string, setText: any) => { updateData({ mistakes: [{ id: Date.now().toString(), text, date: selectedDate }, ...data.mistakes] }); setText(""); }} renderItem={(item: any) => (<div key={item.id} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-mistake/20 rounded-2xl"><div className="flex items-center gap-3"><BookOpen className="text-mistake" size={24} /><span className="text-white">{item.text}</span></div><button onClick={() => moveToTrash(item, 'mistake')} className="text-text-muted"><Trash2 size={18} /></button></div>)} />;
          case 'loans': return <WalletView />;
          case 'calendar': return <CalendarView />;
          case 'settings': return <SettingsView />;
          case 'trash': return <div className="pt-4 pb-40"><SectionHeader title={t('trash_title')} onBack={() => setView('settings')} />{data.trash.map((item, idx) => (<div key={idx} className="p-4 bg-[#1A1A1A] rounded-2xl flex justify-between items-center mb-2"><div><p className="text-sm font-bold capitalize">{item.type}</p><p className="text-xs text-text-muted">{new Date(item.deletedAt).toLocaleDateString()}</p></div><div className="flex gap-2"><button onClick={() => restoreFromTrash(item)} className="p-2 bg-primary/20 text-primary rounded-lg"><RefreshCcw size={16} /></button><button onClick={() => deletePermanently(item.data.id)} className="p-2 bg-mistake/20 text-mistake rounded-lg"><Trash2 size={16} /></button></div></div>))}</div>;
          default: return <DashboardView />;
      }
  };

  const BottomNav = () => {
    if (view === 'onboarding') return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute bottom-[52px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
             <button onClick={() => setShowQuickMenu(true)} className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-glow active:scale-95 transition-transform border-[6px] border-[#050505]"><Plus size={32} strokeWidth={3} /></button>
        </div>
        <div className="bg-black/95 backdrop-blur-lg border-t border-white/5 pb-8 pt-4 px-8 flex justify-between items-center rounded-t-3xl shadow-nav h-[85px] relative z-40">
            <button onClick={() => { setActiveTab('home'); setView('dashboard'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-primary' : 'text-text-muted'}`}><Home size={26} strokeWidth={activeTab === 'home' ? 2.5 : 2} /></button>
            <button onClick={() => { setActiveTab('calendar'); setView('calendar'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-primary' : 'text-text-muted'}`}><CalendarIcon size={26} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} /></button>
            <div className="w-12"></div>
            <button onClick={() => { setActiveTab('wallet'); setView('wallet'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'wallet' ? 'text-primary' : 'text-text-muted'}`}><Wallet size={26} strokeWidth={activeTab === 'wallet' ? 2.5 : 2} /></button>
            <button onClick={() => { setActiveTab('profile'); setView('settings'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-primary' : 'text-text-muted'}`}><User size={26} strokeWidth={activeTab === 'profile' ? 2.5 : 2} /></button>
        </div>
      </div>
    );
  };

  const QuickMenu = () => (
      <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowQuickMenu(false)}></div>
          <div className="bg-[#1A1A1A] w-full max-w-sm rounded-[32px] p-6 relative z-10 animate-in slide-in-from-bottom-10 fade-in border border-white/10">
              <h3 className="text-center font-bold text-lg mb-6">{t('quick_menu_title')}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => { setShowQuickMenu(false); setView('time_manager'); }} className="bg-[#222] p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-[#2A2A2A] active:scale-95 transition-all"><CheckSquare size={20} className="text-blue-500" /><span className="text-sm font-medium">{t('quick_task')}</span></button>
                  <button onClick={() => { setShowQuickMenu(false); setView('wallet'); }} className="bg-[#222] p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-[#2A2A2A] active:scale-95 transition-all"><Wallet size={20} className="text-primary" /><span className="text-sm font-medium">{t('quick_wallet')}</span></button>
                  <button onClick={() => { setShowQuickMenu(false); setView('long_term_goals'); }} className="bg-[#222] p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-[#2A2A2A] active:scale-95 transition-all"><Target size={20} className="text-yellow-500" /><span className="text-sm font-medium">{t('quick_challenge')}</span></button>
                  <button onClick={() => { setShowQuickMenu(false); setView('learned_lessons'); }} className="bg-[#222] p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-[#2A2A2A] active:scale-95 transition-all"><BookOpen size={20} className="text-mistake" /><span className="text-sm font-medium">{t('quick_mistake')}</span></button>
              </div>
          </div>
      </div>
  );

  return (
      <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-primary/30 px-5 max-w-lg mx-auto relative shadow-2xl overflow-hidden pb-safe">
          {renderContent()}
          <BottomNav />
          {showQuickMenu && <QuickMenu />}
      </div>
  );
};

export default App;