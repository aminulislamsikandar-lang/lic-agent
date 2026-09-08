import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, FileText, CheckCircle2, PhoneCall, Award, Landmark } from 'lucide-react';

export const PublicAbout: React.FC = () => {
  const { advisorProfile, openLeadModal } = useApp();

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              Trusted Advisor Profile
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Personal Advisor Who Stays With You Through Claims, Not Just Sales.
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              In an era of automated aggregator apps and spam call centres, navigating policy fine-print and claim settlements can be daunting. As an independent, IRDAI-registered insurance advisor representing Life Insurance Corporation of India and premier private insurers, my mandate is simple: <span className="font-semibold text-slate-900">transparent, zero-jargon protection tailored to your real family obligations.</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Pre-Underwriting Due Diligence</h4>
                <p className="text-xs text-slate-600">
                  Accurate medical disclosure ensures your family never encounters claim rejection during unforeseen times.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                  <Landmark className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Sovereign Guarantee Backing</h4>
                <p className="text-xs text-slate-600">
                  LIC policies carry Section 37 sovereign financial security by the Government of India for absolute peace of mind.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => openLeadModal('Advisor Consultation')}
                className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Schedule 1-on-1 Consultation
              </button>
              <div className="text-xs text-slate-500">
                Direct mobile: <span className="font-semibold text-slate-800">{advisorProfile.phone}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Credentials Box */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                Verified Credentials & Compliance
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-xs">Primary Insurer:</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Life Insurance Corporation (LIC)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-xs">Branch & Division:</span>
                  <span className="font-medium text-slate-800 text-xs sm:text-sm">Mirza Branch, LIC of India</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-xs">IRDAI Agency Code:</span>
                  <span className="font-mono font-bold text-blue-700 text-xs sm:text-sm">{advisorProfile.license_no}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-xs">Office Location:</span>
                  <span className="font-medium text-slate-800 text-xs text-right max-w-[220px]">{advisorProfile.office_address}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-xs">Total Active Clients:</span>
                  <span className="font-bold text-emerald-700 text-xs sm:text-sm">{advisorProfile.clients_served}+ Policyholders</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-xs">Settled Death & Maturity:</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">₹18.4+ Crores disbursed</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 text-xs">Office Hours:</span>
                  <span className="font-medium text-slate-700 text-xs">{advisorProfile.business_hours}</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  All policy issuance and records are processed directly under IRDAI regulations. Client premium dues are credited directly to insurer accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
