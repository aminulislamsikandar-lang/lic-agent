import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';
import {
  Inbox,
  UserCheck,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const LeadsManagement: React.FC = () => {
  const { leads, updateLeadStatus, convertLeadToClient, openCallLogger, openWhatsAppSender } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | LeadStatus>('ALL');
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<Lead | null>(null);

  // Conversion form state
  const [convertInsurer, setConvertInsurer] = useState('LIC of India');
  const [convertPolicyNo, setConvertPolicyNo] = useState('');
  const [convertPlan, setConvertPlan] = useState('');
  const [convertPremium, setConvertPremium] = useState<number>(25000);

  const filteredLeads = leads.filter((l) => (statusFilter === 'ALL' ? true : l.status === statusFilter));

  const handleOpenConvertModal = (lead: Lead) => {
    setSelectedLeadForConvert(lead);
    setConvertPlan(lead.product_interest);
    setConvertPolicyNo('LIC-' + Math.floor(100000000 + Math.random() * 900000000));
  };

  const handleConfirmConvert = () => {
    if (!selectedLeadForConvert) return;

    convertLeadToClient(
      selectedLeadForConvert.id,
      {
        name: selectedLeadForConvert.name,
        phone: selectedLeadForConvert.phone,
        email: selectedLeadForConvert.email || '',
        city: selectedLeadForConvert.city,
      },
      convertPolicyNo
        ? {
            insurer: convertInsurer,
            policy_number: convertPolicyNo,
            plan_type: convertPlan,
            premium_amount: convertPremium,
            frequency: 'Annual',
            due_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Active',
          }
        : undefined
    );

    setSelectedLeadForConvert(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-emerald-600" />
            Website & Calculator Leads ({leads.length})
          </h2>
          <p className="text-xs text-slate-500">
            Real-time incoming enquiries from public website forms & interactive calculator
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(['ALL', 'New', 'Contacted', 'Converted', 'Not Interested'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st} {st === 'New' && `(${leads.filter((l) => l.status === 'New').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid / Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200">
            No enquiries found for the selected status.
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const isNew = lead.status === 'New';
            const isConverted = lead.status === 'Converted';

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isNew ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                {/* Lead Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{lead.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isNew
                          ? 'bg-emerald-100 text-emerald-800'
                          : isConverted
                          ? 'bg-blue-100 text-blue-800'
                          : lead.status === 'Contacted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {lead.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      Source: {lead.source}
                    </span>
                    <span className="text-[10px] text-slate-400">Recv: {lead.submitted_at}</span>
                  </div>

                  <div className="text-xs text-slate-700 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-blue-800 flex items-center gap-1">
                      Product: {lead.product_interest}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {lead.city}
                    </span>
                    {lead.preferred_time && (
                      <>
                        <span>•</span>
                        <span className="text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Pref: {lead.preferred_time}
                        </span>
                      </>
                    )}
                  </div>

                  {lead.message && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{lead.message}"
                    </p>
                  )}

                  {lead.notes && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      Advisor note: <span className="text-slate-700">{lead.notes}</span>
                    </div>
                  )}
                </div>

                {/* Lead Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Click to Call */}
                  <a
                    href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call ({lead.phone})</span>
                  </a>

                  {/* Click to WhatsApp */}
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Namaste ${lead.name} ji, this is Ramesh Sharma (LIC Advisor). I received your callback request regarding ${lead.product_interest}. When would be a convenient time to discuss?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Status update menu */}
                  {!isConverted && (
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-hidden"
                    >
                      <option value="New">Mark: New</option>
                      <option value="Contacted">Mark: Contacted</option>
                      <option value="Not Interested">Mark: Not Interested</option>
                    </select>
                  )}

                  {/* One-Click Convert to Client */}
                  {!isConverted && (
                    <button
                      onClick={() => handleOpenConvertModal(lead)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Convert this lead to a policyholder client"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Convert to Client</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Convert to Client Modal */}
      {selectedLeadForConvert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Convert Lead to Client
              </h3>
              <button
                onClick={() => setSelectedLeadForConvert(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Converting <span className="font-bold text-slate-900">{selectedLeadForConvert.name}</span> will create a permanent client record in your CRM database and auto-archive the lead enquiry.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Insurer</label>
                <select
                  value={convertInsurer}
                  onChange={(e) => setConvertInsurer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="LIC of India">LIC of India</option>
                  <option value="Star Health">Star Health</option>
                  <option value="HDFC Life">HDFC Life</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy Number</label>
                <input
                  type="text"
                  value={convertPolicyNo}
                  onChange={(e) => setConvertPolicyNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. LIC-88192019"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan / Table</label>
                <input
                  type="text"
                  value={convertPlan}
                  onChange={(e) => setConvertPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Premium Amount (₹)</label>
                <input
                  type="number"
                  value={convertPremium}
                  onChange={(e) => setConvertPremium(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedLeadForConvert(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConvert}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Confirm Conversion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
