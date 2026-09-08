import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  PiggyBank,
  TrendingUp,
  Coins,
  ArrowRight,
  Check,
  Zap,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';

export const PublicProducts: React.FC = () => {
  const { openLeadModal } = useApp();

  const products = [
    {
      id: 'term',
      category: 'Term Insurance Plans',
      title: 'Pure Term Insurance',
      popularTag: 'Maximum Protection',
      icon: ShieldAlert,
      iconBg: 'bg-blue-100 text-blue-800',
      bannerColor: 'border-t-4 border-blue-600',
      tagline: 'High life cover for breadwinners at surprisingly nominal annual premiums.',
      whatItIs: 'Pure risk coverage ensuring your family’s financial security, debt clearance, and lifestyle protection.',
      specs: {
        entryAge: '18 – 65 Years',
        policyTerm: '10 – 40 Years (Cover up to age 80)',
        sumAssured: '₹5 Lakh – ₹5+ Crore',
      },
      plans: [
        {
          name: "LIC's Digi Term (Plan 876)",
          highlight: 'Online pure term with attractive high sum assured rebates and non-smoker discounts.',
          minSA: '₹50 Lakh',
        },
        {
          name: "LIC's New Tech-Term (Plan 954)",
          highlight: 'Flexible level or increasing sum assured options with optional accident rider.',
          minSA: '₹50 Lakh',
        },
        {
          name: "LIC's New Jeevan Amar (Plan 955)",
          highlight: 'Offline term plan with convenient regular, limited, or single premium paying terms.',
          minSA: '₹25 Lakh',
        },
        {
          name: "LIC's Saral Jeevan Bima (Plan 859)",
          highlight: 'Standardized term insurance for all income groups with simplified documentation.',
          minSA: '₹5 Lakh to ₹25 Lakh',
        },
      ],
      keyBenefits: [
        '₹1 Crore pure risk cover starting at ~₹650/month for young non-smokers',
        'Optional Critical Illness & Accidental Death / Disability Riders',
        'Complete income tax deduction on premiums under Section 80C',
        'Personal claim support and branch coordination by Abushayed Ali',
      ],
    },
    {
      id: 'endowment',
      category: 'Endowment / Whole Life / Savings Plans',
      title: 'Guaranteed Endowment & Whole Life',
      popularTag: 'Most Popular',
      icon: PiggyBank,
      iconBg: 'bg-amber-100 text-amber-800',
      bannerColor: 'border-t-4 border-amber-500',
      tagline: 'Safe, market-risk-free wealth accumulation with sovereign government guarantee.',
      whatItIs: 'Dual-benefit plans combining guaranteed savings bonuses with lifelong life insurance security.',
      specs: {
        entryAge: '90 Days – 65 Years',
        policyTerm: '15 – 35 Years / Whole Life to Age 100',
        sumAssured: '₹1 Lakh – No Upper Limit',
      },
      plans: [
        {
          name: "LIC's Jeevan Utsav (Plan 771)",
          highlight: 'Guaranteed 10% annual income benefit for life after premium paying term (5-16 yrs).',
          minSA: '₹5 Lakh',
        },
        {
          name: "LIC's Jeevan Umang (Plan 745)",
          highlight: 'Annual survival payout of 8% of Sum Assured every year from PPT end up to age 100.',
          minSA: '₹2 Lakh',
        },
        {
          name: "LIC's New Jeevan Anand",
          highlight: 'Double death cover with maturity payout plus ongoing lifelong life protection.',
          minSA: '₹1 Lakh',
        },
      ],
      keyBenefits: [
        '100% sovereign government-backed guarantee on invested capital & bonuses',
        'Maturity and survival benefit payouts 100% tax-free under Section 10(10D)',
        'Emergency policy loan facility available at low interest after 2 full years',
        'Ideal for long-term child education, marriage corpus, and family legacy',
      ],
    },
    {
      id: 'ulip',
      category: 'ULIP (Unit Linked) Plans',
      title: 'Unit Linked Investment Plans (ULIP)',
      popularTag: 'Market Growth + Cover',
      icon: TrendingUp,
      iconBg: 'bg-indigo-100 text-indigo-800',
      bannerColor: 'border-t-4 border-indigo-600',
      tagline: 'Participate in India’s leading index & equity growth with bundled life cover.',
      whatItIs: 'Transparent market-linked plans investing in equity index and debt funds with guaranteed additions.',
      specs: {
        entryAge: '90 Days – 70 Years',
        policyTerm: '10 – 25 Years',
        sumAssured: '7x to 10x Annual Premium / 1.25x Single',
      },
      plans: [
        {
          name: "LIC's Index Plus (Plan 873)",
          highlight: 'Invest in Nifty 50 or Nifty 100 index funds with guaranteed additions and mortality refund.',
          minSA: '7x - 10x annualized',
        },
        {
          name: "LIC's Nivesh Plus (Plan 749)",
          highlight: 'Single premium unit-linked plan with choice of 4 funds and free switches.',
          minSA: '1.25x single premium',
        },
        {
          name: "LIC's SIIP (Plan 752)",
          highlight: 'Regular systematic investment plan with refund of all mortality charges on maturity.',
          minSA: '10x annualized',
        },
      ],
      keyBenefits: [
        'Direct exposure to bluechip indices (Nifty 50 / Nifty Next 50) with professional LIC fund management',
        'Guaranteed additions credited to unit fund at milestone durations',
        'Refund of entire mortality charges upon completion of policy term',
        'Up to 4 free fund switches every financial year between Equity and Debt',
      ],
    },
    {
      id: 'pension',
      category: 'Pension / Annuity Plans',
      title: 'Guaranteed Pension & Annuity',
      popularTag: 'Lifelong Peace of Mind',
      icon: Coins,
      iconBg: 'bg-emerald-100 text-emerald-800',
      bannerColor: 'border-t-4 border-emerald-600',
      tagline: 'Lock in guaranteed lifelong monthly pensions from day one or post-retirement.',
      whatItIs: 'Annuity contracts delivering guaranteed income for you and your spouse, with 100% capital returned to heirs.',
      specs: {
        entryAge: '30 – 85 Years',
        policyTerm: 'Lifelong Guaranteed Annuity',
        sumAssured: 'Purchase Price: ₹1 Lakh – No Limit',
      },
      plans: [
        {
          name: "LIC's New Jeevan Shanti (Plan 858)",
          highlight: 'Single premium deferred annuity (defer 1-12 yrs) locking high guaranteed annuity rates.',
          minSA: 'Min ₹1.5 Lakh purchase',
        },
        {
          name: "LIC's Jeevan Akshay-VII",
          highlight: 'Immediate lifelong pension starting from the next month; 10 annuity options available.',
          minSA: 'Min ₹1 Lakh purchase',
        },
      ],
      keyBenefits: [
        'Guaranteed annuity rate locked for life right at policy purchase — immune to bank interest drops',
        'Joint Life option: pension continues seamlessly to spouse after primary annuitant',
        '100% return of initial purchase price / capital to children or nominee upon demise',
        'Monthly, quarterly, half-yearly, or annual annuity payout modes via direct NEFT',
      ],
    },
  ];

  return (
    <section id="products" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-blue-700" />
            Official LIC Product Suite
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trending LIC Insurance & Pension Plans
          </h2>
          <p className="text-slate-600 text-base">
            Carefully curated, sovereign government-backed life insurance, wealth-building, and guaranteed retirement solutions recommended by Senior Advisor Abushayed Ali.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all border border-slate-200 flex flex-col justify-between ${p.bannerColor}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${p.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">{p.category}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{p.title}</h3>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">
                      {p.popularTag}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {p.tagline}
                  </p>

                  {/* Plan Specifications Range */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase">Entry Age</div>
                      <div className="font-bold text-slate-900 mt-0.5">{p.specs.entryAge}</div>
                    </div>
                    <div className="border-x border-blue-100 px-1">
                      <div className="text-[10px] text-slate-500 font-medium uppercase">Policy Term</div>
                      <div className="font-bold text-slate-900 mt-0.5">{p.specs.policyTerm}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase">Sum Assured</div>
                      <div className="font-bold text-slate-900 mt-0.5">{p.specs.sumAssured}</div>
                    </div>
                  </div>

                  {/* Individual Real Plans List */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      Featured Official LIC Plans:
                    </div>
                    <div className="space-y-2">
                      {p.plans.map((plan, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-slate-900">{plan.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                              {plan.minSA}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">{plan.highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits List */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-900 mb-2">Key Advantages:</div>
                    <ul className="space-y-1.5">
                      {p.keyBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mini CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 hidden sm:block">
                    Official quotation & illustrative brochure
                  </div>
                  <button
                    onClick={() => openLeadModal(p.plans[0].name)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Request Callback for {p.category.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
