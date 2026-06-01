const { useState, useEffect, useMemo, useRef } = React;

// --- SAMPLE/SEED DATA ---
const SEED_INVESTMENTS = [];

// --- REUSABLE INLINE SVG ICONS ---
const Icons = {
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  TrendingDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-down"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>,
  Dollar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Percentage: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M12 3v16M19 12H5M12 3l4 4M12 19l-4-4M19 12l-4-4M5 12l4 4"/></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Info: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  InfoCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12" y1="17" y2="17"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
};

// --- FINANCIAL ENGINE HELPERS ---
const getMaturityDate = (dateStr, tenureMonths) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + Number(tenureMonths));
  return d.toISOString().split('T')[0];
};

const calculateYieldBreakdown = (investment) => {
  const { amount, rate, tenure, repaymentType } = investment;
  const rateFraction = rate / 100;
  
  if (repaymentType === 'bullet') {
    // Bullet payment: Entire interest is paid at the very end
    // Simple Interest: P * r * (t / 12)
    const totalInterest = amount * rateFraction * (tenure / 12);
    return {
      totalInterest,
      monthlyReturn: totalInterest / tenure,
      payoutStructure: "At Maturity"
    };
  } else {
    // Monthly Amortized: P2P notes generally return monthly principal + interest.
    // For standard micro-financing calculations, simple interest is distributed monthly.
    const totalInterest = amount * rateFraction * (tenure / 12);
    const monthlyReturn = (amount + totalInterest) / tenure;
    return {
      totalInterest,
      monthlyReturn,
      payoutStructure: "Monthly"
    };
  }
};

// --- ONBOARDING GUIDE DATA ---
const ONBOARDING_STEPS = [
  {
    title: "Welcome to MicroLEAP Tracker",
    subtitle: "Secure Client-side Peer-to-Peer Finance Manager",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M12 2v9"/>
        <path d="M8 5h8"/>
      </svg>
    ),
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center">
          A premium, client-side dashboard customized for the MicroLEAP Peer-to-Peer financing platform note tracking and interest compounding projections.
        </p>
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2.5">
            <span className="text-teal-500 font-bold">🛡️</span>
            <p><strong className="text-slate-950 dark:text-slate-200">100% Client-Side Privacy:</strong> Your portfolio data is saved directly to your local device and is never uploaded to any external server.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-teal-500 font-bold">📊</span>
            <p><strong className="text-slate-950 dark:text-slate-200">Unified Portfolio Overview:</strong> Check lifetime allocations, expected monthly returns, fees, and weighted yields at a glance.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-teal-500 font-bold">📅</span>
            <p><strong className="text-slate-950 dark:text-slate-200">Maturity Calendar:</strong> View structured payment timelines grouped by month and year to track cash flow timelines.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Automated PDF Note Parsing",
    subtitle: "Fast, Error-Free P2P Asset Tracking",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M12 18v-6"/>
        <path d="M9 15l3-3 3 3"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Tired of entering note references, profit rates, dates, and repayment schedules manually?
        </p>
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-3 text-xs text-left text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">1</span>
            <p>Click <strong className="text-slate-950 dark:text-slate-200">Track Investment</strong> in the top header panel.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">2</span>
            <p>Drag and drop your official MicroLEAP PDF note sheet directly into the upload area.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">3</span>
            <p>The parser auto-fills the form including the repayment type (Amortized vs Bullet) and full Note Ref in milliseconds!</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Interactive Growth Projection",
    subtitle: "Compounding Simulator",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
        <line x1="18" x2="18" y1="20" y2="10"/>
        <line x1="12" x2="12" y1="20" y2="4"/>
        <line x1="6" x2="6" y1="20" y2="14"/>
        <path d="M2 20h20"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Project and simulate portfolio compounding under customizable variables.
        </p>
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-3 text-xs text-left text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">1</span>
            <p>Select simulation duration from <strong className="text-slate-950 dark:text-slate-200">1, 3, 5, or 10 Years</strong>.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">2</span>
            <p>Use range sliders to adjust monthly cash contributions and target p.a. yield percentages.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">3</span>
            <p>Toggle <strong className="text-slate-950 dark:text-slate-200">Reinvest returns</strong> to compare simple interest growth vs exponential compounding.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Install as a Mobile/Desktop PWA",
    subtitle: "Offline Capabilities & Native Feel",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" x2="12" y1="18" y2="18"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Install this tracker directly to your home screen or desktop to run it as a native, offline-capable app.
        </p>
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-3 text-xs text-left text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2.5">
            <span className="text-teal-500 font-bold">📱</span>
            <p><strong className="text-slate-950 dark:text-slate-200">iOS Safari:</strong> Tap the <strong className="text-slate-950 dark:text-slate-200">Share</strong> button in browser controls, then select <strong className="text-slate-950 dark:text-slate-200">Add to Home Screen</strong>.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-teal-500 font-bold">🤖</span>
            <p><strong className="text-slate-950 dark:text-slate-200">Android Chrome:</strong> Tap the triple dot menu next to the URL bar, then select <strong className="text-slate-950 dark:text-slate-200">Install App</strong>.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-teal-500 font-bold">💻</span>
            <p><strong className="text-slate-950 dark:text-slate-200">Desktop:</strong> Look for the <strong className="text-slate-950 dark:text-slate-200">Install app</strong> icon in your browser's address bar to add to your dock/taskbar.</p>
          </div>
        </div>
      </div>
    )
  }
];

function App() {
  // --- STATE ---
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('microleap_investments');
    if (saved) {
      const parsed = JSON.parse(saved);
      const filtered = parsed.filter(inv => !["inv-1", "inv-2", "inv-3", "inv-4"].includes(inv.id));
      if (filtered.length !== parsed.length) {
        localStorage.setItem('microleap_investments', JSON.stringify(filtered));
        return filtered;
      }
      return parsed;
    }
    return SEED_INVESTMENTS;
  });
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('microleap_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Simulation Store State
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [simTargetYield, setSimTargetYield] = useState(12.5); // %
  const [simDurationYears, setSimDurationYears] = useState(5); // 1, 3, 5, or 10
  const [reinvestMode, setReinvestMode] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInv, setNewInv] = useState({
    title: '',
    amount: '',
    rate: '',
    tenure: '12',
    date: new Date().toISOString().split('T')[0],
    repaymentType: 'monthly'
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingInvId, setEditingInvId] = useState(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Active Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, matured

  // Notification/Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Onboarding Guide State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !localStorage.getItem('microleap_onboarded'));
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Save to localStorage & Update DOM class on Theme Change
  useEffect(() => {
    const rootElem = document.documentElement;
    if (theme === 'dark') {
      rootElem.classList.add('dark');
    } else {
      rootElem.classList.remove('dark');
    }
    localStorage.setItem('microleap_theme', theme);
  }, [theme]);

  // Save Investments
  useEffect(() => {
    localStorage.setItem('microleap_investments', JSON.stringify(investments));
  }, [investments]);

  // Simple triggers for custom visual Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- CALCULATED PORTFOLIO METRICS ---
  const portfolioMetrics = useMemo(() => {
    let totalInvested = 0;
    let activePrincipal = 0;
    let totalExpectedProfit = 0;
    let earnedProfit = 0;
    let activeCount = 0;
    let sumRateAmount = 0;
    let totalFees = 0;

    investments.forEach(inv => {
      const amt = Number(inv.amount);
      const breakdown = calculateYieldBreakdown(inv);
      const fee = amt * 0.01;
      
      totalInvested += amt;
      totalFees += fee;
      
      if (inv.status === 'active') {
        activePrincipal += amt;
        totalExpectedProfit += breakdown.totalInterest;
        activeCount++;
        sumRateAmount += (Number(inv.rate) * amt);
      } else {
        earnedProfit += breakdown.totalInterest;
      }
    });

    const weightedYield = activePrincipal > 0 ? (sumRateAmount / activePrincipal).toFixed(2) : "0.00";

    return {
      totalInvested,
      activePrincipal,
      totalExpectedProfit,
      earnedProfit,
      totalFees,
      totalPortfolioValue: activePrincipal + totalExpectedProfit + earnedProfit - totalFees,
      activeCount,
      weightedYield
    };
  }, [investments]);

  // --- MATURITY CALENDAR ENGINE ---
  const timelineEvents = useMemo(() => {
    const events = [];
    investments.forEach(inv => {
      if (inv.status !== 'active') return;
      
      const matDateStr = getMaturityDate(inv.date, inv.tenure);
      const matDate = new Date(matDateStr);
      const mName = matDate.toLocaleString('default', { month: 'long' });
      const yName = matDate.getFullYear();
      const sortKey = matDate.getFullYear() * 100 + matDate.getMonth();
      
      const breakdown = calculateYieldBreakdown(inv);
      
      events.push({
        id: inv.id,
        title: inv.title,
        amount: Number(inv.amount),
        payout: Number(inv.amount) + breakdown.totalInterest,
        interest: breakdown.totalInterest,
        matDateStr,
        monthName: mName,
        year: yName,
        sortKey
      });
    });

    // Group by month/year
    events.sort((a, b) => a.sortKey - b.sortKey);
    
    const grouped = {};
    events.forEach(evt => {
      const key = `${evt.monthName} ${evt.year}`;
      if (!grouped[key]) {
        grouped[key] = {
          title: key,
          sortKey: evt.sortKey,
          totalAmount: 0,
          items: []
        };
      }
      grouped[key].totalAmount += evt.payout;
      grouped[key].items.push(evt);
    });

    return Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey);
  }, [investments]);

  // --- SIMULATED PROJECTION ENGINE ---
  // Runs a month-by-month projection starting from "Now" over N years
  const projectionData = useMemo(() => {
    const totalMonths = simDurationYears * 12;
    const monthlyYieldFraction = (simTargetYield / 100) / 12;
    
    let currentCapital = portfolioMetrics.activePrincipal; 
    let currentProjectedValue = portfolioMetrics.activePrincipal;
    let cumulativeProfit = 0;

    const dataPoints = [];
    
    // Push initial state (Month 0)
    dataPoints.push({
      monthIndex: 0,
      label: "Start",
      capital: Math.round(currentCapital),
      value: Math.round(currentProjectedValue),
      profit: 0
    });

    for (let m = 1; m <= totalMonths; m++) {
      // 1. Add monthly contribution to both pools
      currentCapital += monthlyContribution;
      
      if (reinvestMode) {
        // Compound interest on the entire current portfolio value
        const monthlyInterest = currentProjectedValue * monthlyYieldFraction;
        currentProjectedValue += monthlyContribution + monthlyInterest;
        cumulativeProfit += monthlyInterest;
      } else {
        // Simple interest calculated on the cumulative cash contribution pool
        const monthlyInterest = currentCapital * monthlyYieldFraction;
        currentProjectedValue += monthlyContribution + monthlyInterest;
        cumulativeProfit += monthlyInterest;
      }

      // Add dynamic year markers
      let label = `M${m}`;
      if (m % 12 === 0) {
        label = `Yr ${m / 12}`;
      }

      dataPoints.push({
        monthIndex: m,
        label,
        capital: Math.round(currentCapital),
        value: Math.round(currentProjectedValue),
        profit: Math.round(cumulativeProfit)
      });
    }

    return dataPoints;
  }, [portfolioMetrics.activePrincipal, monthlyContribution, simTargetYield, simDurationYears, reinvestMode]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!newInv.title.trim()) errors.title = "Investment title is required";
    if (!newInv.amount || Number(newInv.amount) <= 0) errors.amount = "Enter a valid positive amount";
    if (!newInv.rate || Number(newInv.rate) <= 0) errors.rate = "Enter an annual return percentage";
    if (!newInv.tenure || Number(newInv.tenure) <= 0) errors.tenure = "Tenure must be at least 1 month";
    if (!newInv.date) errors.date = "Select an investment start date";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset Modal Form
  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingInvId(null);
    setNewInv({
      title: '',
      amount: '',
      rate: '',
      tenure: '12',
      date: new Date().toISOString().split('T')[0],
      repaymentType: 'monthly'
    });
    setFormErrors({});
    setPdfError(null);
    setIsDragging(false);
    setIsParsingPdf(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('microleap_onboarded', 'true');
    setIsOnboardingOpen(false);
  };

  // Drag and Drop PDF Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handlePdfUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePdfUpload(file);
    }
  };

  const handlePdfUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setPdfError("Please upload a valid PDF file.");
      return;
    }

    setIsParsingPdf(true);
    setPdfError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items.map(item => item.str);
        extractedText += pageStrings.join(" ") + "\n";
      }

      // Parse Note Reference (Title) - extract full reference name (stopping before Note Type)
      const titleMatch = extractedText.match(/Investment\s+Note\s+Reference\s*:\s*(.+?)(?:\s+Note\s+Type|\n|\r|$)/i);
      const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : "";

      // Parse Investment Amount
      const amountMatch = extractedText.match(/Investment\s+Amount\s*:\s*RM\s*([\d,.]+)/i);
      const amount = amountMatch ? amountMatch[1].replace(/,/g, '').trim() : "";

      // Parse Profit Rate
      const rateMatch = extractedText.match(/equivalent\s+to\s+([\d,.]+)%\s*p\.a/i);
      const rate = rateMatch ? rateMatch[1].trim() : "";

      // Parse Tenor (Tenure)
      const tenorMatch = extractedText.match(/Tenor\s*:\s*(\d+)\s*Months?/i);
      const tenure = tenorMatch ? tenorMatch[1].trim() : "12";

      // Parse Start Date (Disbursed On or Pledged On)
      const dateMatch = extractedText.match(/Disbursed\s+On\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i) || 
                        extractedText.match(/Pledged\s+On\s*:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
      let formattedDate = new Date().toISOString().split('T')[0];
      if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        formattedDate = `${year}-${month}-${day}`;
      }

      // Parse Repayment / Payout Method (Monthly Amortized vs Bullet)
      let repaymentType = 'monthly';
      const month1Index = extractedText.indexOf("Month 1");
      if (month1Index !== -1) {
        const substring = extractedText.substring(month1Index, month1Index + 150);
        const amounts = substring.match(/RM\s*[\d,.-]+/g) || [];
        if (amounts.length >= 3) {
          const principalDueStr = amounts[2].replace(/RM\s*/i, '').replace(/,/g, '').trim();
          const principalDueVal = parseFloat(principalDueStr);
          if (principalDueVal === 0) {
            repaymentType = 'bullet';
          }
        }
      }

      setNewInv({
        title: title || file.name.replace(/\.[^/.]+$/, ""),
        amount: amount,
        rate: rate,
        tenure: tenure,
        date: formattedDate,
        repaymentType: repaymentType
      });

      triggerToast("📄 MicroLEAP PDF parsed successfully! Form auto-filled.");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      setPdfError("Failed to parse the PDF. Please check the file or fill in manually.");
    } finally {
      setIsParsingPdf(false);
    }
  };

  // Edit Click Trigger
  const handleEditClick = (inv) => {
    setEditingInvId(inv.id);
    setNewInv({
      title: inv.title,
      amount: inv.amount.toString(),
      rate: inv.rate.toString(),
      tenure: inv.tenure.toString(),
      date: inv.date,
      repaymentType: inv.repaymentType
    });
    setIsAddModalOpen(true);
  };

  // Add or Edit Investment Action
  const handleAddInvestment = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingInvId) {
      // Edit existing investment
      setInvestments(investments.map(item => {
        if (item.id === editingInvId) {
          return {
            ...item,
            title: newInv.title,
            amount: parseFloat(newInv.amount),
            rate: parseFloat(newInv.rate),
            tenure: parseInt(newInv.tenure, 10),
            date: newInv.date,
            repaymentType: newInv.repaymentType
          };
        }
        return item;
      }));
      triggerToast("✨ MicroLEAP P2P Investment updated successfully!");
    } else {
      // Add new investment
      const record = {
        id: `inv-${Date.now()}`,
        title: newInv.title,
        amount: parseFloat(newInv.amount),
        rate: parseFloat(newInv.rate),
        tenure: parseInt(newInv.tenure, 10),
        date: newInv.date,
        repaymentType: newInv.repaymentType,
        status: 'active'
      };

      setInvestments([record, ...investments]);
      triggerToast("🚀 New MicroLEAP P2P Investment Tracked successfully!");
    }

    closeModal();
  };

  // Delete Investment Action
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to untrack this investment?")) {
      setInvestments(investments.filter(item => item.id !== id));
      triggerToast("🗑️ Investment removed from portfolio tracking.");
    }
  };

  // Toggle status (Active <=> Matured)
  const toggleStatus = (id) => {
    setInvestments(investments.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'active' ? 'matured' : 'active';
        triggerToast(`📈 Status updated to ${nextStatus.toUpperCase()}`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // Filtered Investments
  const filteredInvestments = useMemo(() => {
    return investments.filter(inv => {
      const matchesSearch = inv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inv.amount.toString().includes(searchQuery) ||
                            inv.rate.toString().includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [investments, searchQuery, statusFilter]);

  // SVG Chart Interactive state
  const [hoveredData, setHoveredData] = useState(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 600, height: 280 });
  const chartContainerRef = useRef(null);

  // Handle custom resize for SVG responsive view using ResizeObserver to prevent layout lag
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setSvgDimensions({
          width: Math.max(width, 300),
          height: 280
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate path coordinates for custom SVG interactive graph
  const svgPaths = useMemo(() => {
    const { width, height } = svgDimensions;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Max values for plotting
    const maxVal = Math.max(...projectionData.map(d => d.value)) * 1.05; // 5% breathing space
    const pointsCount = projectionData.length;

    const convertX = (index) => padding.left + (index / (pointsCount - 1)) * chartWidth;
    const convertY = (val) => padding.top + chartHeight - (val / maxVal) * chartHeight;

    // Build path coordinates
    let capitalPath = "";
    let valuePath = "";
    let capitalArea = "";
    let valueArea = "";

    projectionData.forEach((d, i) => {
      const cx = convertX(i);
      const cyCap = convertY(d.capital);
      const cyVal = convertY(d.value);

      if (i === 0) {
        capitalPath = `M ${cx} ${cyCap}`;
        valuePath = `M ${cx} ${cyVal}`;
        capitalArea = `M ${cx} ${convertY(0)} L ${cx} ${cyCap}`;
        valueArea = `M ${cx} ${convertY(0)} L ${cx} ${cyVal}`;
      } else {
        capitalPath += ` L ${cx} ${cyCap}`;
        valuePath += ` L ${cx} ${cyVal}`;
        capitalArea += ` L ${cx} ${cyCap}`;
        valueArea += ` L ${cx} ${cyVal}`;
      }
    });

    // Close areas
    const startX = convertX(0);
    const endX = convertX(pointsCount - 1);
    const zeroY = convertY(0);

    capitalArea += ` L ${endX} ${zeroY} Z`;
    valueArea += ` L ${endX} ${zeroY} Z`;

    // Generates dynamic horizontal gridlines
    const gridLines = [];
    const linesCount = 4;
    for (let j = 0; j <= linesCount; j++) {
      const val = (maxVal / linesCount) * j;
      const y = convertY(val);
      gridLines.push({
        y,
        label: `RM ${(val / 1000).toFixed(1)}k`
      });
    }

    return {
      capitalPath,
      valuePath,
      capitalArea,
      valueArea,
      gridLines,
      convertX,
      convertY,
      chartWidth,
      chartHeight,
      padding
    };
  }, [projectionData, svgDimensions]);

  // Handle SVG Mouse Interactivity
  const handleSvgMouseMove = (e) => {
    if (!chartContainerRef.current) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - svgPaths.padding.left;
    
    const ratio = mouseX / svgPaths.chartWidth;
    const pointsCount = projectionData.length;
    let index = Math.round(ratio * (pointsCount - 1));
    
    if (index < 0) index = 0;
    if (index >= pointsCount) index = pointsCount - 1;

    const dataItem = projectionData[index];
    const screenX = svgPaths.convertX(index);
    const screenYVal = svgPaths.convertY(dataItem.value);
    const screenYCap = svgPaths.convertY(dataItem.capital);

    setHoveredData({
      ...dataItem,
      screenX,
      screenYVal,
      screenYCap
    });
  };

  const handleSvgMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-3.5 px-5 rounded-2xl shadow-2xl border border-slate-700/50 dark:border-slate-200 animate-bounce">
          <span className="text-emerald-500"><Icons.Check /></span>
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* MAIN HEADER PANEL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.839 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">MicroLEAP</h1>
                <span className="text-[10px] tracking-widest font-extrabold px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-500 border border-teal-500/20">PRO</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium Investment Tracker & Cashflow Projection</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Dark Mode"
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:scale-105 transition-all shadow-sm"
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          {/* Guide / Onboarding Trigger */}
          <button 
            onClick={() => {
              setOnboardingStep(0);
              setIsOnboardingOpen(true);
            }}
            aria-label="Open User Guide"
            title="Open User Guide"
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:scale-105 transition-all shadow-sm flex items-center gap-1.5 animate-pulse-soft"
          >
            <Icons.InfoCircle />
            <span className="hidden sm:inline text-xs font-semibold">User Guide</span>
          </button>

          {/* Add Investment Trigger */}
          <button
            onClick={() => {
              setEditingInvId(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold text-sm py-3 px-5 rounded-2xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all duration-200"
          >
            <Icons.Plus />
            <span>Track Investment</span>
          </button>
        </div>
      </header>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Invested */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl">
              <Icons.Dollar />
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center gap-1">
              <Icons.TrendingUp /> Active
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Capital Active</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">RM {portfolioMetrics.activePrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Lifetime tracked: RM {portfolioMetrics.totalInvested.toLocaleString()}</p>
        </div>

        {/* Expected Profit */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Icons.Sparkles />
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
              Yielding
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Projected Unlocked Profit</p>
          <h3 className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">RM {portfolioMetrics.totalExpectedProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Paid-out profit: RM {portfolioMetrics.earnedProfit.toLocaleString()}</p>
        </div>

        {/* Portfolio Value */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full">
              Maturity Asset
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Valuation (Net)</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">RM {portfolioMetrics.totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Principal + profit - 1% fee (RM {portfolioMetrics.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</p>
        </div>

        {/* Weighted Average Yield */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Icons.Percentage />
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 rounded-full">
              {portfolioMetrics.activeCount} Active Notes
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Weighted Yield Rate</p>
          <h3 className="text-3xl font-extrabold text-indigo-500 mt-1">{portfolioMetrics.weightedYield}% <span className="text-xs text-slate-400 dark:text-slate-500">p.a.</span></h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Diversified note yield average</p>
        </div>

      </div>

      {/* MAIN DASHBOARD MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10">
        
        {/* INTERACTIVE FORECAST SIMULATOR & GRAPH */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Growth Projection</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Adjust dynamic parameters to visualize long-term returns</p>
            </div>
            
            {/* Duration select chip buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl self-start sm:self-center">
              {[1, 3, 5, 10].map(yr => (
                <button
                  key={yr}
                  onClick={() => setSimDurationYears(yr)}
                  className={`text-xs font-semibold py-2 px-3.5 rounded-xl transition-all ${
                    simDurationYears === yr 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {yr} Year{yr > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* SIMULATION AREA GRAPH */}
          <div className="relative mb-6 h-[280px] w-full" ref={chartContainerRef}>
            {/* SVG Visual graph */}
            <svg
              viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
              className="absolute inset-0 w-full h-full select-none"
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleSvgMouseLeave}
            >
              <defs>
                <linearGradient id="gradientValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity="0.25"/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="gradientCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity="0.15"/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity="0"/>
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {svgPaths.gridLines.map((line, idx) => (
                <g key={idx} className="opacity-40 dark:opacity-20">
                  <line
                    x1={svgPaths.padding.left}
                    y1={line.y}
                    x2={svgDimensions.width - svgPaths.padding.right}
                    y2={line.y}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgPaths.padding.left - 8}
                    y={line.y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    className="fill-slate-500 dark:fill-slate-400"
                  >
                    {line.label}
                  </text>
                </g>
              ))}

              {/* Shaded Areas */}
              <path d={svgPaths.valueArea} fill="url(#gradientValue)" />
              <path d={svgPaths.capitalArea} fill="url(#gradientCapital)" />

              {/* Drawn Curves */}
              <path d={svgPaths.valuePath} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
              <path d={svgPaths.capitalPath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" />

              {/* X Axis labels */}
              {projectionData.filter((_, i) => {
                const totalMonths = projectionData.length - 1;
                if (totalMonths <= 12) {
                  // 1 Year: show every 2 months
                  return i % 2 === 0;
                } else if (totalMonths <= 36) {
                  // 3 Years: show every 6 months
                  return i % 6 === 0;
                } else if (totalMonths <= 60) {
                  // 5 Years: show every 12 months (each year)
                  return i % 12 === 0;
                } else {
                  // 10 Years: show every 24 months (every 2 years)
                  return i % 24 === 0;
                }
              }).map((d, i) => {
                const cx = svgPaths.convertX(d.monthIndex);
                return (
                  <text
                    key={i}
                    x={cx}
                    y={svgDimensions.height - svgPaths.padding.bottom + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    className="fill-slate-400 dark:fill-slate-500"
                  >
                    {d.label}
                  </text>
                );
              })}

              {/* Interactivity Overlay pointer */}
              {hoveredData && (
                <g>
                  {/* Vertical line indicator */}
                  <line
                    x1={hoveredData.screenX}
                    y1={svgPaths.padding.top}
                    x2={hoveredData.screenX}
                    y2={svgDimensions.height - svgPaths.padding.bottom}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="opacity-70"
                  />
                  {/* Value Dot */}
                  <circle
                    cx={hoveredData.screenX}
                    cy={hoveredData.screenYVal}
                    r="6"
                    fill="#14b8a6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="shadow-md"
                  />
                  {/* Capital Dot */}
                  <circle
                    cx={hoveredData.screenX}
                    cy={hoveredData.screenYCap}
                    r="5"
                    fill="#6366f1"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {/* Custom Tooltip Widget */}
            {hoveredData && (
              <div 
                className="absolute z-10 bg-slate-950 text-white dark:bg-white dark:text-slate-950 p-4 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-100 flex flex-col gap-1.5 transition-all pointer-events-none"
                style={{
                  left: `${Math.min(hoveredData.screenX - 70, svgDimensions.width - 190)}px`,
                  top: `${Math.max(10, hoveredData.screenYVal - 110)}px`
                }}
              >
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                  {hoveredData.label !== `M${hoveredData.monthIndex}` ? `Milestone: ${hoveredData.label}` : `Month ${hoveredData.monthIndex}`}
                </p>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                  <span>Value: <strong className="font-semibold text-teal-400 dark:text-teal-600">RM {hoveredData.value.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                  <span>Capital: <strong className="font-semibold">RM {hoveredData.capital.toLocaleString()}</strong></span>
                </div>
                <div className="text-[11px] font-medium text-emerald-400 dark:text-emerald-600">
                  Total Earnings: +RM {(hoveredData.value - hoveredData.capital).toLocaleString()} ({hoveredData.capital > 0 ? (hoveredData.value >= hoveredData.capital ? "+" : "") + (((hoveredData.value - hoveredData.capital) / hoveredData.capital) * 100).toFixed(2) : "0.00"}%)
                </div>
              </div>
            )}
          </div>

          {/* SLIDERS & CONFIG PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
            
            {/* Slider 1 */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Monthly Savings
                </span>
                <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-xl px-2.5 py-0.5 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30 transition-all">
                  <span className="text-[10px] font-bold text-slate-400">RM</span>
                  <input
                    type="number"
                    min="0"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-16 font-bold text-xs text-slate-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(10000, monthlyContribution)}
                step="100"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>RM 0</span>
                <span>RM {Math.max(10000, monthlyContribution).toLocaleString()}</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Target Annual Return
                </span>
                <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-xl px-2.5 py-0.5 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30 transition-all">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={simTargetYield}
                    onChange={(e) => setSimTargetYield(Number(e.target.value))}
                    className="w-10 text-right font-bold text-xs text-slate-900 dark:text-white bg-transparent border-none p-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] font-bold text-slate-400">%</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max={Math.max(22, simTargetYield)}
                step="0.1"
                value={simTargetYield}
                onChange={(e) => setSimTargetYield(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>5%</span>
                <span>{Math.max(22, simTargetYield)}%</span>
              </div>
            </div>

            {/* Switch: Compound/Reinvest */}
            <div className="flex flex-col justify-center bg-slate-50 dark:bg-slate-900/50 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Reinvestment Mode</label>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Auto-compound payouts</p>
                </div>
                
                {/* Toggle */}
                <button
                  onClick={() => setReinvestMode(!reinvestMode)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    reinvestMode ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                    reinvestMode ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* MATURITY TIMELINE CALENDAR */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm max-h-[480px] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-700/50">
            <div>
              <h2 className="text-md font-extrabold text-slate-900 dark:text-white">Maturity Timeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cash-out and reinvestment schedule</p>
            </div>
            <span className="p-2.5 bg-indigo-50 dark:bg-slate-900 text-indigo-500 rounded-xl">
              <Icons.Calendar />
            </span>
          </div>

          {timelineEvents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400 dark:text-slate-500">No active investments scheduled to mature yet.</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
              {timelineEvents.map((group, gIdx) => (
                <div key={group.title} className="relative pl-10">
                  
                  {/* Circle Dot Marker */}
                  <span className="absolute left-1.5 top-1.5 w-4.5 h-4.5 rounded-full bg-white dark:bg-slate-800 border-2 border-teal-500 z-10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  </span>

                  {/* Header month block */}
                  <div className="mb-2">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{group.title}</h4>
                    <p className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400">Receiving: +RM {group.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>

                  {/* Individual Items maturing inside this month */}
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <div 
                        key={item.id} 
                        className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-xs hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{item.title}</span>
                          <span className="font-extrabold text-slate-950 dark:text-white flex-shrink-0">RM {item.payout.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>Matures: {item.matDateStr}</span>
                          <span className="text-emerald-500">Interest: RM {item.interest.toFixed(0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ACTIVE PORTFOLIO DECK SECTION */}
      <div className="space-y-6">
        
        {/* Filter Toolbar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tracked P2P Investments</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">MicroLEAP active notes, invoice financing, and business micro-loans</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search investments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-full sm:w-60 transition-all"
              />
            </div>

            {/* Tab Filter */}
            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl">
              {['all', 'active', 'matured'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-xs font-semibold py-1.5 px-3 rounded-xl capitalize transition-all ${
                    statusFilter === status 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Investments List Cards */}
        {filteredInvestments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/80 p-12 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm text-center max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v4.5A2.25 2.25 0 002.25 13.5zm0 0V16.5A2.25 2.25 0 004.5 18.75h15A2.25 2.25 0 0021.75 16.5v-3m-18 0V9" />
            </svg>
            <h4 className="text-md font-bold text-slate-900 dark:text-white mb-1">No tracked notes found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Add a new P2P investment or update your filters to view portfolio notes.</p>
            <button
              onClick={() => {
                setEditingInvId(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-lg shadow-teal-500/10"
            >
              <Icons.Plus /> Track Investment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map(inv => {
              const breakdown = calculateYieldBreakdown(inv);
              const matDate = getMaturityDate(inv.date, inv.tenure);
              
              // Calculate tenure progress bar percentage
              const start = new Date(inv.date).getTime();
              const end = new Date(matDate).getTime();
              const now = Date.now();
              const totalDuration = end - start;
              const elapsed = now - start;
              
              let progressPercent = 0;
              if (inv.status === 'matured') {
                progressPercent = 100;
              } else if (elapsed > 0) {
                progressPercent = Math.min(100, Math.round((elapsed / totalDuration) * 100));
              }

              const monthsLeft = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24 * 30.4)));

              // Calculate elapsed months for repayment status (e.g. 1/6)
              let elapsedMonths = 0;
              if (inv.status === 'matured') {
                elapsedMonths = Number(inv.tenure);
              } else if (now > start) {
                const startDate = new Date(inv.date);
                const currentDate = new Date();
                const diffYears = currentDate.getFullYear() - startDate.getFullYear();
                const diffMonths = currentDate.getMonth() - startDate.getMonth();
                let months = diffYears * 12 + diffMonths;
                
                if (currentDate.getDate() < startDate.getDate()) {
                  months = Math.max(0, months - 1);
                }
                elapsedMonths = Math.min(Number(inv.tenure), Math.max(0, months));
              }

              return (
                <div 
                  key={inv.id}
                  className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  
                  {/* Card Top Details */}
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        inv.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                      }`}>
                        {inv.status}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {/* Toggle Status Tool */}
                        <button
                          onClick={() => toggleStatus(inv.id)}
                          title={inv.status === 'active' ? 'Mark as Matured' : 'Mark as Active'}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
                        >
                          <Icons.Check />
                        </button>
                        
                        {/* Edit Tool */}
                        <button
                          onClick={() => handleEditClick(inv)}
                          title="Edit tracked entry"
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
                        >
                          <Icons.Edit />
                        </button>

                        {/* Delete Tool */}
                        <button
                          onClick={() => handleDelete(inv.id)}
                          title="Delete tracked entry"
                          className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-teal-500 transition-colors">
                      {inv.title}
                    </h3>

                    {/* Financial Figures Rows */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-700/50 my-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Principal</span>
                        <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">RM {inv.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Investor Fee (1%)</span>
                        <p className="font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">RM {(inv.amount * 0.01).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Yield Rate</span>
                        <p className="font-extrabold text-indigo-500 mt-0.5">{inv.rate}% p.a.</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Payout Scheme</span>
                        <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 capitalize">{inv.repaymentType}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Est. Profit (Gross)</span>
                        <p className="font-extrabold text-emerald-500 mt-0.5">+RM {breakdown.totalInterest.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Est. Profit (Net)</span>
                        <p className="font-extrabold text-teal-500 mt-0.5">+RM {(breakdown.totalInterest - inv.amount * 0.01).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Progress */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Tenure: {inv.tenure} Months • {elapsedMonths}/{inv.tenure} Settled</span>
                      <span>{progressPercent}% Complete</span>
                    </div>
                    
                    {/* Progress slider line */}
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span>Start: {inv.date}</span>
                      <span>Maturity: {matDate}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD/EDIT INVESTMENT ENTRY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur backdrop overlay */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={closeModal}
          />

          {/* Modal Box */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/60 shadow-2xl relative w-full max-w-lg z-10 overflow-hidden transform transition-all">
            
            {/* Header inside modal */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {editingInvId ? "Edit Tracked Investment" : "Track New MicroLEAP Investment"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingInvId ? "Modify note allocation, tenure limits, and rate schemes" : "Log note allocation, tenure limits, and rate schemes"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <Icons.X />
              </button>
            </div>

            <form onSubmit={handleAddInvestment} className="space-y-5">
              
              {/* PDF Auto-Fill Drag-and-Drop Area (Only for adding new notes) */}
              {!editingInvId && (
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                    isDragging 
                      ? 'border-teal-500 bg-teal-500/5 dark:bg-teal-500/10 scale-[0.99]' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    id="pdf-upload" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  
                  {isParsingPdf ? (
                    <div className="flex flex-col items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-full border-3 border-teal-500/20 border-t-teal-500 animate-spin" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Analyzing Term Sheet...</p>
                        <p className="text-[10px] text-slate-400">Extracting note details, rates, and schedule</p>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2.5 py-2">
                      <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                          <path d="M10 9H8"/>
                          <path d="M16 13H8"/>
                          <path d="M16 17H8"/>
                        </svg>
                      </span>
                      
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          ⚡ Auto-Fill from MicroLEAP PDF
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          Drag & drop your term sheet PDF here, or <span className="text-teal-500 hover:text-teal-400 font-semibold underline">browse</span>
                        </p>
                      </div>
                    </label>
                  )}

                  {pdfError && (
                    <div className="mt-2">
                      <p className="text-[10px] font-medium text-red-500">{pdfError}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Investment Title / Note Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kuala Lumpur Food Truck Franchise Note"
                  value={newInv.title}
                  onChange={(e) => setNewInv({ ...newInv, title: e.target.value })}
                  className={`w-full p-3.5 text-xs rounded-2xl border bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                    formErrors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                  }`}
                />
                {formErrors.title && <p className="text-[10px] font-medium text-red-500">{formErrors.title}</p>}
              </div>

              {/* Dual columns for Amount & Rate */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Amount (RM)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newInv.amount}
                    onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
                    className={`w-full p-3.5 text-xs rounded-2xl border bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                      formErrors.amount ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                    }`}
                  />
                  {newInv.amount && Number(newInv.amount) > 0 && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                      Investor Fee (1%): RM {(Number(newInv.amount) * 0.01).toFixed(2)}
                    </p>
                  )}
                  {formErrors.amount && <p className="text-[10px] font-medium text-red-500">{formErrors.amount}</p>}
                </div>

                {/* Rate */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Annual Return Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 13.5"
                    value={newInv.rate}
                    onChange={(e) => setNewInv({ ...newInv, rate: e.target.value })}
                    className={`w-full p-3.5 text-xs rounded-2xl border bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                      formErrors.rate ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                    }`}
                  />
                  {formErrors.rate && <p className="text-[10px] font-medium text-red-500">{formErrors.rate}</p>}
                </div>

              </div>

              {/* Dual columns for Tenure & Date */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Tenure */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tenure (Months)</label>
                  <select
                    value={newInv.tenure}
                    onChange={(e) => setNewInv({ ...newInv, tenure: e.target.value })}
                    className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  >
                    {[3, 6, 9, 12, 15, 18, 24, 36].map(m => (
                      <option key={m} value={m}>{m} Months</option>
                    ))}
                  </select>
                </div>

                {/* Investment Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Investment Start Date</label>
                  <input
                    type="date"
                    value={newInv.date}
                    onChange={(e) => setNewInv({ ...newInv, date: e.target.value })}
                    className={`w-full p-3.5 text-xs rounded-2xl border bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                      formErrors.date ? 'border-red-500' : 'border-slate-200 dark:border-slate-700/80'
                    }`}
                  />
                  {formErrors.date && <p className="text-[10px] font-medium text-red-500">{formErrors.date}</p>}
                </div>

              </div>

              {/* Repayment Type selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Repayment / Payout Method</label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Repayment Option A */}
                  <button
                    type="button"
                    onClick={() => setNewInv({ ...newInv, repaymentType: 'monthly' })}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      newInv.repaymentType === 'monthly'
                        ? 'border-teal-500 bg-teal-500/5'
                        : 'border-slate-200 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Monthly Amortized</span>
                    <span className="text-[10px] text-slate-400">Regular cash outflows returning principal + yield</span>
                  </button>

                  {/* Repayment Option B */}
                  <button
                    type="button"
                    onClick={() => setNewInv({ ...newInv, repaymentType: 'bullet' })}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      newInv.repaymentType === 'bullet'
                        ? 'border-teal-500 bg-teal-500/5'
                        : 'border-slate-200 dark:border-slate-700/70 hover:bg-slate-100 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Bullet Repayment</span>
                    <span className="text-[10px] text-slate-400">Entire principal + yield returned at maturity</span>
                  </button>

                </div>
              </div>

              {/* Submission triggers */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs rounded-2xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all"
                >
                  {editingInvId ? "Save Changes" : "Track Asset Allocation"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ONBOARDING USER GUIDE MODAL */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur backdrop overlay */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            onClick={() => completeOnboarding()}
          />

          {/* Modal Container */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/60 shadow-2xl relative w-full max-w-xl z-10 overflow-hidden transform transition-all flex flex-col">
            
            {/* Top Close Button & Step Tracker */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full">
                Step {onboardingStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <button
                onClick={() => completeOnboarding()}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                aria-label="Skip Guide"
              >
                <Icons.X />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700/70 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-teal-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${((onboardingStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Step Icon and Title */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 mb-4 transform hover:scale-110 transition-transform duration-300">
                {ONBOARDING_STEPS[onboardingStep].icon}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {ONBOARDING_STEPS[onboardingStep].title}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                {ONBOARDING_STEPS[onboardingStep].subtitle}
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[220px] flex flex-col justify-center mb-6">
              {ONBOARDING_STEPS[onboardingStep].content}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/50">
              {/* Skip / Exit Button */}
              <button
                onClick={() => completeOnboarding()}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors py-2"
              >
                Skip Guide
              </button>

              {/* Navigation Indicators & Buttons */}
              <div className="flex items-center gap-3">
                {/* Previous Button */}
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(prev => prev - 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Back
                  </button>
                )}

                {/* Next / Get Started Button */}
                {onboardingStep < ONBOARDING_STEPS.length - 1 ? (
                  <button
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => completeOnboarding()}
                    className="px-6 py-2.5 bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all"
                  >
                    Get Started 🚀
                  </button>
                )}
              </div>
            </div>

            {/* Bullet Dot Indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
              {ONBOARDING_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setOnboardingStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    onboardingStep === idx 
                      ? 'bg-teal-500 w-4' 
                      : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      )}

      {/* MASTER FINTECH FOOTER */}
      <footer className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center space-y-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Secure Client-side Execution Platform</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Disclaimer: MicroLEAP is a registered Peer-to-Peer financing platform. This application operates entirely on your device with offline storage. Return calculations are projections only. Diversification rules suggest holding multiple notes to offset micro-loan risk.
        </p>
      </footer>

    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
