import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CallOutcome } from '../../types';
import { X, Phone, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

export const CallLoggerModal: React.FC = () => {
  const {
    activeCallClient,
    activeCallPolicy,
    closeCallLogger,
    logCallOutcome,
    currentRole,
  } = useApp();

  const [outcome, setOutcome] = useState<CallOutcome>('Spoke - Will Pay');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [markPaid, setMarkPaid] = useState(false);

  if (!activeCallClient) return null;

  const quickOutcomes: { label: CallOutcome; desc: string }[] = [
    { label: 'Spoke - Will Pay', desc: 'Agreed to pay premium' },
    { label: 'Paid', desc: 'Premium collected or confirmed' },
    { label: 'Callback Requested', desc: 'Client asked to call later' },
    { label: 'Not Reachable', desc: 'Ringing / Switched off / Busy' },
    { label: 'Wrong Number', desc: 'Number not in service' },
    { label: 'Other', desc: 'Custom conversation note' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    logCallOutcome(
      activeCallClient.id,
      outcome,
      notes || `Advisor called client regarding ${activeCallPolicy ? activeCallPolicy.plan_type : 'policy renewal'}. Outcome: ${outcome}`,
      activeCallPolicy?.id,
      followUpDate,
      markPaid || outcome === 'Paid'
    );

    closeCallLogger();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Log Call Outcome</h3>
              <p className="text-xs text-slate-500">
                Record call notes for <span className="font-bold text-slate-800">{activeCallClient.name}</span> ({activeCallClient.phone})
              </p>
            </div>
          </div>
          <button onClick={closeCallLogger} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Context Banner */}
        {activeCallPolicy && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">{activeCallPolicy.plan_type}</div>
              <div className="text-slate-500 font-mono">No: {activeCallPolicy.policy_number}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">₹{activeCallPolicy.premium_amount.toLocaleString('en-IN')}</div>
              <div className="text-[11px] font-semibold text-rose-600">Due: {activeCallPolicy.due_date}</div>
            </div>
          </div>
        )}

        {/* Quick Outcome Selectors */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-2">Select Call Outcome:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickOutcomes.map((q) => (
                <button
                  type="button"
                  key={q.label}
                  onClick={() => {
                    setOutcome(q.label);
                    if (q.label === 'Paid') setMarkPaid(true);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    outcome === q.label
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold leading-tight">{q.label}</div>
                  <div className={`text-[10px] mt-0.5 ${outcome === q.label ? 'text-blue-100' : 'text-slate-400'}`}>
                    {q.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Notes Field */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Conversation Notes:
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Spoke with policyholder. Will transfer online via Netbanking by Friday 4 PM..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Follow-up date or Mark as Paid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Next Follow-Up Date:
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>

            {activeCallPolicy && (
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={markPaid}
                    onChange={(e) => setMarkPaid(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                  />
                  <span>Mark policy as Paid today</span>
                </label>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <a
              href={`tel:${activeCallClient.phone.replace(/\s+/g, '')}`}
              className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Dial Phone Number</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeCallLogger}
                className="px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs"
              >
                Save & Update Timeline
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
