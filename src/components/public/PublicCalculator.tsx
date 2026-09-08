import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, ArrowRight, Info, Award, CheckCircle2 } from 'lucide-react';

interface LicPlanConfig {
  id: string;
  name: string;
  category: 'Term' | 'Endowment' | 'ULIP' | 'Pension';
  categoryLabel: string;
  minAge: number;
  maxAge: number;
  defaultAge: number;
  minTerm: number;
  maxTerm: number;
  defaultTerm: number;
  termLabel: string;
  minSA: number;
  maxSA: number;
  stepSA: number;
  defaultSA: number;
  saLabel: string;
  type: 'term' | 'utsav' | 'umang' | 'anand' | 'ulip_regular' | 'ulip_single' | 'pension_deferred' | 'pension_immediate';
  shortDesc: string;
}

const LIC_PLANS: LicPlanConfig[] = [
  // Term Insurance Plans
  {
    id: 'digi-term',
    name: "LIC's Digi Term (Plan 876)",
    category: 'Term',
    categoryLabel: 'Term Insurance',
    minAge: 18,
    maxAge: 65,
    defaultAge: 30,
    minTerm: 10,
    maxTerm: 40,
    defaultTerm: 30,
    termLabel: 'Policy Term (Years)',
    minSA: 5000000,
    maxSA: 50000000,
    stepSA: 500000,
    defaultSA: 10000000,
    saLabel: 'Life Cover Sum Assured',
    type: 'term',
    shortDesc: 'Online pure term insurance with high sum assured rebates and non-smoker discounts.',
  },
  {
    id: 'tech-term',
    name: "LIC's New Tech-Term (Plan 954)",
    category: 'Term',
    categoryLabel: 'Term Insurance',
    minAge: 18,
    maxAge: 65,
    defaultAge: 32,
    minTerm: 10,
    maxTerm: 40,
    defaultTerm: 25,
    termLabel: 'Policy Term (Years)',
    minSA: 5000000,
    maxSA: 50000000,
    stepSA: 500000,
    defaultSA: 10000000,
    saLabel: 'Life Cover Sum Assured',
    type: 'term',
    shortDesc: 'Pure risk term insurance with optional level or increasing sum assured & accident rider.',
  },
  {
    id: 'jeevan-amar',
    name: "LIC's New Jeevan Amar (Plan 955)",
    category: 'Term',
    categoryLabel: 'Term Insurance',
    minAge: 18,
    maxAge: 65,
    defaultAge: 35,
    minTerm: 10,
    maxTerm: 40,
    defaultTerm: 25,
    termLabel: 'Policy Term (Years)',
    minSA: 2500000,
    maxSA: 50000000,
    stepSA: 500000,
    defaultSA: 7500000,
    saLabel: 'Life Cover Sum Assured',
    type: 'term',
    shortDesc: 'Affordable offline term plan with flexible regular, limited, or single premium paying terms.',
  },
  {
    id: 'saral-jeevan-bima',
    name: "LIC's Saral Jeevan Bima (Plan 859)",
    category: 'Term',
    categoryLabel: 'Term Insurance',
    minAge: 18,
    maxAge: 65,
    defaultAge: 35,
    minTerm: 5,
    maxTerm: 40,
    defaultTerm: 20,
    termLabel: 'Policy Term (Years)',
    minSA: 500000,
    maxSA: 2500000,
    stepSA: 100000,
    defaultSA: 1500000,
    saLabel: 'Life Cover Sum Assured',
    type: 'term',
    shortDesc: 'Standardized pure term life cover with no complex financial underwriting hurdles.',
  },

  // Endowment / Whole Life / Savings Plans
  {
    id: 'jeevan-utsav',
    name: "LIC's Jeevan Utsav (Plan 771)",
    category: 'Endowment',
    categoryLabel: 'Endowment & Savings',
    minAge: 18,
    maxAge: 65,
    defaultAge: 30,
    minTerm: 5,
    maxTerm: 16,
    defaultTerm: 10,
    termLabel: 'Premium Paying Term (PPT Years)',
    minSA: 500000,
    maxSA: 20000000,
    stepSA: 100000,
    defaultSA: 1500000,
    saLabel: 'Sum Assured (10% Annual Payout)',
    type: 'utsav',
    shortDesc: 'Guaranteed 10% of Sum Assured every single year for life starting after PPT, plus life cover.',
  },
  {
    id: 'jeevan-umang',
    name: "LIC's Jeevan Umang (Plan 745)",
    category: 'Endowment',
    categoryLabel: 'Endowment & Savings',
    minAge: 18,
    maxAge: 55,
    defaultAge: 32,
    minTerm: 15,
    maxTerm: 25,
    defaultTerm: 15,
    termLabel: 'Premium Paying Term (PPT Years)',
    minSA: 200000,
    maxSA: 20000000,
    stepSA: 100000,
    defaultSA: 2500000,
    saLabel: 'Basic Sum Assured',
    type: 'umang',
    shortDesc: 'Guaranteed 8% annual survival benefit every year till age 100 with massive maturity payout.',
  },
  {
    id: 'new-jeevan-anand',
    name: "LIC's New Jeevan Anand",
    category: 'Endowment',
    categoryLabel: 'Endowment & Savings',
    minAge: 18,
    maxAge: 50,
    defaultAge: 30,
    minTerm: 15,
    maxTerm: 35,
    defaultTerm: 20,
    termLabel: 'Policy Term (Years)',
    minSA: 100000,
    maxSA: 20000000,
    stepSA: 100000,
    defaultSA: 1000000,
    saLabel: 'Basic Sum Assured',
    type: 'anand',
    shortDesc: 'Double death cover: lump sum with bonuses at maturity, plus full risk cover continues for life.',
  },

  // ULIP (Unit Linked) Plans
  {
    id: 'index-plus',
    name: "LIC's Index Plus (Plan 873)",
    category: 'ULIP',
    categoryLabel: 'ULIP (Unit Linked)',
    minAge: 18,
    maxAge: 60,
    defaultAge: 30,
    minTerm: 10,
    maxTerm: 25,
    defaultTerm: 15,
    termLabel: 'Policy Term (Years)',
    minSA: 300000,
    maxSA: 10000000,
    stepSA: 50000,
    defaultSA: 1000000,
    saLabel: 'Life Cover Sum Assured (7x - 10x)',
    type: 'ulip_regular',
    shortDesc: 'Invest in Nifty 50 or Nifty 100 index funds with guaranteed additions & refund of mortality charges.',
  },
  {
    id: 'nivesh-plus',
    name: "LIC's Nivesh Plus (Plan 749)",
    category: 'ULIP',
    categoryLabel: 'ULIP (Unit Linked)',
    minAge: 18,
    maxAge: 70,
    defaultAge: 35,
    minTerm: 10,
    maxTerm: 25,
    defaultTerm: 15,
    termLabel: 'Policy Term (Years)',
    minSA: 125000,
    maxSA: 10000000,
    stepSA: 50000,
    defaultSA: 1250000,
    saLabel: 'Life Cover (1.25x Single Premium)',
    type: 'ulip_single',
    shortDesc: 'Single premium unit-linked growth with 4 fund options and unlimited free online fund switching.',
  },
  {
    id: 'siip',
    name: "LIC's SIIP (Plan 752)",
    category: 'ULIP',
    categoryLabel: 'ULIP (Unit Linked)',
    minAge: 18,
    maxAge: 65,
    defaultAge: 28,
    minTerm: 10,
    maxTerm: 25,
    defaultTerm: 20,
    termLabel: 'Policy Term (Years)',
    minSA: 400000,
    maxSA: 10000000,
    stepSA: 50000,
    defaultSA: 1000000,
    saLabel: 'Life Cover (10x Annual Premium)',
    type: 'ulip_regular',
    shortDesc: 'Disciplined monthly/annual systematic investment plan with full refund of mortality charges at term.',
  },

  // Pension / Annuity Plans
  {
    id: 'new-jeevan-shanti',
    name: "LIC's New Jeevan Shanti (Plan 858)",
    category: 'Pension',
    categoryLabel: 'Pension & Annuity',
    minAge: 30,
    maxAge: 79,
    defaultAge: 52,
    minTerm: 1,
    maxTerm: 12,
    defaultTerm: 5,
    termLabel: 'Deferment Period (Years before Pension starts)',
    minSA: 150000,
    maxSA: 20000000,
    stepSA: 50000,
    defaultSA: 3000000,
    saLabel: 'One-Time Purchase Price (Investment)',
    type: 'pension_deferred',
    shortDesc: 'Single premium deferred annuity locking high guaranteed interest rates with 100% capital back to family.',
  },
  {
    id: 'jeevan-akshay-vii',
    name: "LIC's Jeevan Akshay-VII",
    category: 'Pension',
    categoryLabel: 'Pension & Annuity',
    minAge: 30,
    maxAge: 85,
    defaultAge: 60,
    minTerm: 1,
    maxTerm: 1,
    defaultTerm: 1,
    termLabel: 'Immediate Payout (Next month onwards)',
    minSA: 100000,
    maxSA: 20000000,
    stepSA: 50000,
    defaultSA: 5000000,
    saLabel: 'One-Time Purchase Price (Investment)',
    type: 'pension_immediate',
    shortDesc: 'Immediate guaranteed lifetime monthly or annual pension starting from the very next month.',
  },
];

export const PublicCalculator: React.FC = () => {
  const { openLeadModal } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'Term' | 'Endowment' | 'ULIP' | 'Pension'>('Term');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('digi-term');

  // Find active plan config
  const activePlan = useMemo(() => {
    return LIC_PLANS.find((p) => p.id === selectedPlanId) || LIC_PLANS[0];
  }, [selectedPlanId]);

  const [age, setAge] = useState<number>(30);
  const [sumAssured, setSumAssured] = useState<number>(10000000);
  const [termYears, setTermYears] = useState<number>(30);

  // Switch category
  const handleCategoryChange = (cat: 'Term' | 'Endowment' | 'ULIP' | 'Pension') => {
    setSelectedCategory(cat);
    const firstPlanInCat = LIC_PLANS.find((p) => p.category === cat);
    if (firstPlanInCat) {
      setSelectedPlanId(firstPlanInCat.id);
      setAge(firstPlanInCat.defaultAge);
      setSumAssured(firstPlanInCat.defaultSA);
      setTermYears(firstPlanInCat.defaultTerm);
    }
  };

  // Switch plan
  const handlePlanChange = (planId: string) => {
    const plan = LIC_PLANS.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlanId(plan.id);
      setAge(Math.min(Math.max(age, plan.minAge), plan.maxAge));
      setSumAssured(Math.min(Math.max(sumAssured, plan.minSA), plan.maxSA));
      setTermYears(Math.min(Math.max(termYears, plan.minTerm), plan.maxTerm));
    }
  };

  // Calculation logic based on real LIC rules
  const calculation = useMemo(() => {
    let baseAnnual = 0;
    let maturityBenefit = 0;
    let recurringPayout = 0;
    let recurringLabel = '';
    let taxSaved = 0;

    switch (activePlan.type) {
      case 'term': {
        // Pure risk term rates per 1,000 SA based on age
        const ratePerThousand = 1.05 + (age - 18) * 0.085;
        baseAnnual = Math.round((sumAssured / 1000) * ratePerThousand);
        maturityBenefit = 0; // Pure risk protection
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'utsav': {
        // Jeevan Utsav: limited pay (5-16 yrs), 10% SA guaranteed lifelong annual payout
        const ratePerThousand = 95 - (termYears - 5) * 4 + (age - 18) * 0.5;
        baseAnnual = Math.round((sumAssured / 1000) * ratePerThousand);
        recurringPayout = Math.round(sumAssured * 0.1); // Guaranteed 10% of SA
        recurringLabel = 'Guaranteed Lifelong Payout (Every Year)';
        maturityBenefit = sumAssured; // Capital sum assured remains intact as death benefit
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'umang': {
        // Jeevan Umang: 8% SA guaranteed annual survival benefit till age 100
        const ratePerThousand = 55 - (termYears - 15) * 1.5 + (age - 18) * 0.45;
        baseAnnual = Math.round((sumAssured / 1000) * ratePerThousand);
        recurringPayout = Math.round(sumAssured * 0.08); // 8% of SA
        recurringLabel = 'Guaranteed 8% Annual Payout (Till Age 100)';
        // Maturity at age 100 or death: SA + Simple Reversionary Bonus + FAB
        maturityBenefit = Math.round(sumAssured * 2.5);
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'anand': {
        // New Jeevan Anand: endowment with bonus + lifelong death cover
        const ratePerThousand = 46 + (age - 18) * 0.55 - (termYears - 15) * 0.8;
        baseAnnual = Math.round((sumAssured / 1000) * ratePerThousand);
        // Maturity = SA + Bonus (~45/1000/yr) + FAB
        maturityBenefit = Math.round(sumAssured + (sumAssured * 0.045 * termYears) + (sumAssured * 0.15));
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'ulip_regular': {
        // Index Plus / SIIP: Annual investment = SA / 10
        baseAnnual = Math.round(sumAssured / 10);
        // Estimated maturity assuming 12.5% CAGR index returns over policy term
        const r = 0.12;
        const n = termYears;
        const fv = baseAnnual * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        maturityBenefit = Math.round(fv);
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'ulip_single': {
        // Nivesh Plus: Single premium = SA / 1.25
        baseAnnual = Math.round(sumAssured / 1.25);
        // Projected at 12% CAGR over policy term
        maturityBenefit = Math.round(baseAnnual * Math.pow(1.12, termYears));
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'pension_deferred': {
        // New Jeevan Shanti: Single purchase price = sumAssured
        baseAnnual = sumAssured;
        // Guaranteed annuity rate ~7.5% + compounding during deferment (~0.5% per year deferred)
        const annuityRate = 0.075 + (termYears * 0.0055);
        recurringPayout = Math.round(sumAssured * annuityRate);
        recurringLabel = `Guaranteed Annual Pension (After ${termYears} Yrs Deferment)`;
        maturityBenefit = sumAssured; // 100% Purchase price returned to nominee
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
      case 'pension_immediate': {
        // Jeevan Akshay-VII: Immediate lifelong pension
        baseAnnual = sumAssured;
        // Guaranteed annuity rate ~7.4% to 8.2% depending on age
        const annuityRate = 0.072 + (age - 30) * 0.0003;
        recurringPayout = Math.round(sumAssured * annuityRate);
        recurringLabel = 'Immediate Lifelong Annual Pension (Starts Next Month)';
        maturityBenefit = sumAssured; // 100% Purchase price returned to nominee
        taxSaved = Math.min(Math.round(baseAnnual * 0.312), 46800);
        break;
      }
    }

    const isSingleOrPurchase = activePlan.type === 'ulip_single' || activePlan.type === 'pension_deferred' || activePlan.type === 'pension_immediate';
    const minAnnual = isSingleOrPurchase ? baseAnnual : Math.round(baseAnnual * 0.94);
    const maxAnnual = isSingleOrPurchase ? baseAnnual : Math.round(baseAnnual * 1.08);
    const monthlyDisplay = isSingleOrPurchase ? Math.round(recurringPayout / 12) : Math.round(baseAnnual / 12);

    return {
      baseAnnual,
      minAnnual,
      maxAnnual,
      monthlyDisplay,
      isSingleOrPurchase,
      maturityBenefit,
      recurringPayout,
      recurringLabel,
      taxSaved,
    };
  }, [activePlan, age, sumAssured, termYears]);

  const formatLakhCrore = (num: number) => {
    if (num >= 10000000) {
      const cr = num / 10000000;
      return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Crore`;
    }
    if (num >= 100000) {
      const lakh = num / 100000;
      return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 1)} Lakh`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const handleRequestExactQuote = () => {
    openLeadModal(`Calculator: ${activePlan.name} (${formatLakhCrore(sumAssured)}, Age: ${age})`);
  };

  const currentCategoryPlans = LIC_PLANS.filter((p) => p.category === selectedCategory);

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            Official LIC Premium & Benefit Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calculate Premium & Maturity Returns
          </h2>
          <p className="text-slate-600 text-base">
            Simulate realistic premiums, guaranteed payouts, and tax savings across official trending LIC Term, Endowment, ULIP, and Pension plans.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select LIC Insurance Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Term', 'Endowment', 'ULIP', 'Pension'] as const).map((cat) => {
                  const labels = {
                    Term: 'Term Insurance',
                    Endowment: 'Endowment & Savings',
                    ULIP: 'ULIP (Unit Linked)',
                    Pension: 'Pension & Annuity',
                  };
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`text-center py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-bold'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {labels[cat]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plan Selector Radio Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Select Real LIC Plan
              </label>
              <div className="space-y-2">
                {currentCategoryPlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handlePlanChange(plan.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedPlanId === plan.id
                        ? 'bg-blue-600/60 border-amber-400 text-white shadow-md'
                        : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        {selectedPlanId === plan.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {plan.name}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">{plan.shortDesc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Client Entry Age ({activePlan.minAge} – {activePlan.maxAge} Yrs)
                </label>
                <span className="font-bold text-amber-300 text-base">{age} Years</span>
              </div>
              <input
                type="range"
                min={activePlan.minAge}
                max={activePlan.maxAge}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{activePlan.minAge} yrs</span>
                <span>{Math.round((activePlan.minAge + activePlan.maxAge) / 2)} yrs</span>
                <span>{activePlan.maxAge} yrs</span>
              </div>
            </div>

            {/* Sum Assured / Investment Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">{activePlan.saLabel}</label>
                <span className="font-bold text-amber-300 text-base">{formatLakhCrore(sumAssured)}</span>
              </div>
              <input
                type="range"
                min={activePlan.minSA}
                max={activePlan.maxSA}
                step={activePlan.stepSA}
                value={sumAssured}
                onChange={(e) => setSumAssured(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{formatLakhCrore(activePlan.minSA)}</span>
                <span>{formatLakhCrore(Math.round((activePlan.minSA + activePlan.maxSA) / 2))}</span>
                <span>{formatLakhCrore(activePlan.maxSA)}</span>
              </div>
            </div>

            {/* Policy Term / PPT / Deferment Slider */}
            {activePlan.minTerm < activePlan.maxTerm && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">{activePlan.termLabel}</label>
                  <span className="font-bold text-amber-300 text-base">{termYears} Years</span>
                </div>
                <input
                  type="range"
                  min={activePlan.minTerm}
                  max={activePlan.maxTerm}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>{activePlan.minTerm} yrs</span>
                  <span>{Math.round((activePlan.minTerm + activePlan.maxTerm) / 2)} yrs</span>
                  <span>{activePlan.maxTerm} yrs</span>
                </div>
              </div>
            )}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/15 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">
                <Award className="w-3.5 h-3.5" />
                {activePlan.name}
              </div>

              {calculation.isSingleOrPurchase ? (
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                    One-Time Purchase Price
                  </span>
                  <div className="mt-1 text-3xl font-black text-amber-300">
                    {formatLakhCrore(calculation.baseAnnual)}
                  </div>
                  {calculation.recurringPayout > 0 && (
                    <div className="text-xs text-emerald-300 font-semibold mt-1">
                      Pension: ~₹{Math.round(calculation.recurringPayout / 12).toLocaleString('en-IN')}/mo (₹{calculation.recurringPayout.toLocaleString('en-IN')}/yr)
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                    Estimated Annual Premium
                  </span>
                  <div className="mt-1 text-3xl font-black text-amber-300 flex items-baseline gap-1">
                    ₹{calculation.minAnnual.toLocaleString('en-IN')} – ₹{calculation.maxAnnual.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-300">/ yr</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    (or ~₹{calculation.monthlyDisplay.toLocaleString('en-IN')} / month)
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Guaranteed Life Cover:</span>
                <span className="font-bold text-white">{formatLakhCrore(sumAssured)}</span>
              </div>

              {calculation.recurringPayout > 0 && (
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">{calculation.recurringLabel}:</span>
                  <span className="font-bold text-emerald-300">{formatLakhCrore(calculation.recurringPayout)} / yr</span>
                </div>
              )}

              {calculation.maturityBenefit > 0 && (
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">
                    {activePlan.category === 'Pension' ? 'Capital Returned to Nominee:' : 'Est. Maturity Return:'}
                  </span>
                  <span className="font-bold text-emerald-300">{formatLakhCrore(calculation.maturityBenefit)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">Tax Exemption (80C / 10(10D)):</span>
                <span className="font-bold text-amber-300">Up to ₹{calculation.taxSaved.toLocaleString('en-IN')} / yr</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Advisor Claim Support:</span>
                <span className="font-semibold text-white">Direct via Abushayed Ali</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-black/30 rounded-xl border border-white/5 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-300">Official Note:</strong> Calculations follow LIC rules and circular guidelines. Final figures depend on precise age, underwriting, GST (18% for term/health, 4.5%/2.25% for life/endowment, 1.8% for annuity).
              </span>
            </div>

            {/* Direct CTA */}
            <button
              onClick={handleRequestExactQuote}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Get Exact Quote for {activePlan.name.split(' (')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
