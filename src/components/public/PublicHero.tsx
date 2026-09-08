import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Award,
  Users,
  CheckCircle,
  Phone,
  Calculator,
  ArrowRight,
  HeartHandshake,
  FileCheck,
  Clock,
} from 'lucide-react';

interface PublicHeroProps {
  onExploreCalculator: () => void;
  onExploreProducts: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({ onExploreCalculator, onExploreProducts }) => {
  const { advisorProfile, openLeadModal } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certified LIC MDRT Advisor • 16+ Years Trusted Guidance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Securing Your Family’s Tomorrow,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Guaranteed.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Personalized life insurance, high-cover term plans, tax-free retirement pensions, and comprehensive family health coverage — backed by dedicated doorstep claim assistance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => openLeadModal()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all text-sm sm:text-base cursor-pointer"
              >
                <Phone className="w-5 h-5" />
                <span>Get a Free Callback</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCalculator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-sm sm:text-base"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Calculate Premium</span>
              </button>
            </div>

            {/* Highlights checklist */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero spam, zero sales pressure</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Doorstep Claim Support</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sec. 80C & 10(10D) Tax Advice</span>
              </div>
            </div>
          </div>

          {/* Right Column: Advisor Profile Card & Trust Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-2xl text-white">
              {/* Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-amber-300 text-xl border-2 border-white/20">
                      AA
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white flex items-center gap-1.5">
                      {advisorProfile.name}
                      <Shield className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </h2>
                    <p className="text-xs text-slate-300">{advisorProfile.title}</p>
                    <p className="text-[11px] text-amber-300 font-medium">
                      Mirza Branch • LIC of India
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      IRDAI No: {advisorProfile.license_no}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-3 gap-2 py-5 text-center">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xl sm:text-2xl font-black text-amber-400">
                    {advisorProfile.experience_years}+
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Years Exp.</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">
                    {advisorProfile.clients_served}+
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Families</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <div className="text-xl sm:text-2xl font-black text-blue-400">
                    {advisorProfile.claims_settled_ratio}%
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Claim Ratio</div>
                </div>
              </div>

              {/* Insurers Represented */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Authorized Channel Partner
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-blue-900/80 text-blue-200 text-xs font-semibold border border-blue-700/50">
                    LIC of India (Mirza Branch)
                  </span>
                  <span className="px-3 py-1 rounded-md bg-rose-900/80 text-rose-200 text-xs font-semibold border border-rose-700/50">
                    Star Health
                  </span>
                  <span className="px-3 py-1 rounded-md bg-indigo-900/80 text-indigo-200 text-xs font-semibold border border-indigo-700/50">
                    HDFC Life
                  </span>
                  <span className="px-3 py-1 rounded-md bg-teal-900/80 text-teal-200 text-xs font-semibold border border-teal-700/50">
                    Tata AIG
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="mt-5 pt-3">
                <a
                  href={`https://wa.me/${advisorProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${advisorProfile.name} ji, I'm interested in an insurance plan for my family. Please guide me.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Chat Directly on WhatsApp: {advisorProfile.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
