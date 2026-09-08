import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Award, Phone, Mail, MapPin, Lock, FileText, CheckCircle } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { advisorProfile, setMode } = useApp();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Advisor Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>{advisorProfile.name}</span>
            </div>
            <div className="text-xs text-amber-300 font-semibold">
              LIC Advisor • Mirza Branch
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Senior Insurance Advisor & Financial Consultant. Guiding families with dependable life, health, and retirement solutions for over {advisorProfile.experience_years} years.
            </p>
            <div className="pt-2 text-[11px] text-amber-400/90 font-mono">
              IRDAI Registration: {advisorProfile.license_no}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Insurance Solutions
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Pure Term Insurance (1 Cr Cover)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Endowment & Savings (Jeevan Labh)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Comprehensive Health Floater
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Child Higher Education Funds
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  Guaranteed Lifetime Pensions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Compliance & Norms
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Advisory & TRAI Compliance
                </button>
              </li>
              <li>
                <span className="text-slate-400">IRDAI Consumer Protection Guidelines</span>
              </li>
              <li>
                <span className="text-slate-400">Section 41 Insurance Act 1938 Notice</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => setMode('crm')}
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium py-1 px-2 rounded bg-slate-900 border border-slate-800"
              >
                <Lock className="w-3 h-3" />
                <span>Advisor Admin Portal Login</span>
              </button>
            </div>
          </div>

          {/* Col 4: Direct Contacts */}
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Branch & Office
            </div>
            <div className="text-xs text-slate-400 space-y-1.5">
              <p className="text-amber-300 font-medium">Mirza Branch, LIC of India</p>
              <p className="flex items-start gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{advisorProfile.office_address}</span>
              </p>
              <p className="pt-0.5 text-slate-300 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href={`tel:${advisorProfile.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  Direct: {advisorProfile.phone}
                </a>
              </p>
              <p className="text-slate-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`mailto:${advisorProfile.email}`} className="hover:text-white">
                  {advisorProfile.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Insurance Act Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-900 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-400">Insurance is the subject matter of solicitation.</strong> Policy details and benefits mentioned on this website are indicative. Actual terms and conditions are governed by the respective insurance policy documents issued by Life Insurance Corporation of India (LIC) or respective insurers.
          </p>
          <p>
            <strong className="text-slate-400">Section 41 of Insurance Act 1938 (Prohibition of Rebates):</strong> No person shall allow or offer to allow, either directly or indirectly, as an inducement to any person to take out or renew or continue an insurance in respect of any kind of risk relating to lives or property in India, any rebate of the whole or part of the commission payable or any rebate of the premium shown on the policy.
          </p>
          <div className="flex flex-wrap justify-between items-center pt-4 text-slate-400 text-xs">
            <div>
              © {new Date().getFullYear()} {advisorProfile.name} (LIC Advisor, Mirza Branch). All rights reserved.
            </div>
            <div>
              Designed strictly in compliance with IRDAI & TRAI telecom advisory guidelines.
            </div>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                {activeModal === 'privacy' ? 'Privacy Policy & Data Protection' : 'Terms of Service & TRAI Consent'}
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed max-h-96 overflow-y-auto pr-2 text-slate-600">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    <strong>1. Information Collection:</strong> When you submit an enquiry or callback request, we collect your name, phone number, city, and insurance preferences solely to assist with official policy quotes and renewal reminders.
                  </p>
                  <p>
                    <strong>2. Confidentiality:</strong> Your financial and contact data is strictly confidential. We do not sell, rent, or trade client information to telemarketers or third-party loan brokers.
                  </p>
                  <p>
                    <strong>3. Security:</strong> All client data is encrypted and accessible only to authorized advisor and staff accounts with credential authentication.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Transactional Communication:</strong> By submitting your telephone number on our forms, you grant express transactional consent under TRAI regulations to receive policy reminder alerts, premium notifications, and advice via phone calls, SMS, and WhatsApp.
                  </p>
                  <p>
                    <strong>2. Advisory Role:</strong> As an authorized insurance agent, our role is to assist in policy selection, documentation, renewal tracking, and claim settlements in accordance with IRDAI directives.
                  </p>
                  <p>
                    <strong>3. Payments:</strong> Premium payments are made directly to the insurer (e.g. Life Insurance Corporation of India) via authorized portals, cheques drawn in favour of the insurer, or verified payment links.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-slate-900 text-white font-medium py-2 rounded-lg text-xs"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
