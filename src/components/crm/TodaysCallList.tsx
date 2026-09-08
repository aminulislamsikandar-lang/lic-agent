import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Policy, Client, CallOutcome } from '../../types';
import {
  PhoneCall,
  Phone,
  MessageSquare,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  Check,
  ChevronRight,
} from 'lucide-react';

export const TodaysCallList: React.FC = () => {
  const {
    policies,
    clients,
    openCallLogger,
    openWhatsAppSender,
    setSelectedClientId,
    logCallOutcome,
  } = useApp();

  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'OVERDUE' | 'TODAY' | 'NEXT_7_DAYS'>('ALL');

  // Compute urgent call candidates
  const callQueue = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const candidates = policies
      .filter((p) => p.status !== 'Paid' && p.status !== 'Lapsed' && p.status !== 'Matured')
      .map((p) => {
        const client = clients.find((c) => c.id === p.client_id);
        const due = new Date(p.due_date);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let category: 'OVERDUE' | 'TODAY' | 'NEXT_3_DAYS' | 'NEXT_7_DAYS' | 'LATER' = 'LATER';
        if (diffDays < 0 || p.status === 'Overdue') {
          category = 'OVERDUE';
        } else if (diffDays === 0) {
          category = 'TODAY';
        } else if (diffDays <= 3) {
          category = 'NEXT_3_DAYS';
        } else if (diffDays <= 7) {
          category = 'NEXT_7_DAYS';
        }

        return {
          policy: p,
          client,
          diffDays,
          category,
        };
      })
      .filter((item) => item.category !== 'LATER');

    // Sort by urgency: OVERDUE first (most days overdue at top), then TODAY, then NEXT_3_DAYS, then NEXT_7_DAYS
    candidates.sort((a, b) => a.diffDays - b.diffDays);
    return candidates;
  }, [policies, clients]);

  const filteredQueue = useMemo(() => {
    return callQueue.filter((item) => {
      if (urgencyFilter === 'OVERDUE') return item.category === 'OVERDUE';
      if (urgencyFilter === 'TODAY') return item.category === 'TODAY';
      if (urgencyFilter === 'NEXT_7_DAYS')
        return item.category === 'NEXT_3_DAYS' || item.category === 'NEXT_7_DAYS';
      return true;
    });
  }, [callQueue, urgencyFilter]);

  const handleQuickOutcome = (
    client: Client,
    policy: Policy,
    outcome: CallOutcome,
    markPaid = false
  ) => {
    logCallOutcome(
      client.id,
      outcome,
      `Quick log from Today's Call List: ${outcome} for policy #${policy.policy_number}`,
      policy.id,
      undefined,
      markPaid
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-blue-700" />
            Today's Renewal Calling List ({callQueue.length})
          </h2>
          <p className="text-xs text-slate-500">
            High-priority policyholders requiring immediate telephone or WhatsApp contact to prevent lapse
          </p>
        </div>

        {/* Urgency Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setUrgencyFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              urgencyFilter === 'ALL'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Pending ({callQueue.length})
          </button>
          <button
            onClick={() => setUrgencyFilter('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              urgencyFilter === 'OVERDUE'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            🚨 Overdue ({callQueue.filter((q) => q.category === 'OVERDUE').length})
          </button>
          <button
            onClick={() => setUrgencyFilter('TODAY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              urgencyFilter === 'TODAY'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            ⏰ Due Today ({callQueue.filter((q) => q.category === 'TODAY').length})
          </button>
          <button
            onClick={() => setUrgencyFilter('NEXT_7_DAYS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              urgencyFilter === 'NEXT_7_DAYS'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
            }`}
          >
            📅 Due in 7 Days (
            {callQueue.filter((q) => q.category === 'NEXT_3_DAYS' || q.category === 'NEXT_7_DAYS').length}
            )
          </button>
        </div>
      </div>

      {/* Calling List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredQueue.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200">
            No calls queued under this category. Great job keeping your policyholders up to date!
          </div>
        ) : (
          filteredQueue.map(({ policy, client, diffDays, category }, idx) => {
            if (!client) return null;

            const isOverdue = category === 'OVERDUE';
            const isToday = category === 'TODAY';

            return (
              <div
                key={policy.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isOverdue
                    ? 'border-rose-300 bg-rose-50/20'
                    : isToday
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Policy & Client Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedClientId(client.id)}
                      className="font-bold text-sm text-slate-900 hover:text-blue-700 transition-colors text-left"
                    >
                      {client.name}
                    </button>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : isToday
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(diffDays)} DAYS OVERDUE`
                        : isToday
                        ? 'DUE TODAY'
                        : `DUE IN ${diffDays} DAYS`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Policy #{policy.policy_number}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-800">
                      {policy.insurer} • {policy.plan_type}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">
                      ₹{policy.premium_amount.toLocaleString('en-IN')} ({policy.frequency})
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">City: {client.city}</span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Renewal Date: <strong className="text-slate-800">{policy.due_date}</strong></span>
                    {policy.grace_period_end && (
                      <span className="text-[11px] text-rose-600 font-medium">
                        (Grace ends: {policy.grace_period_end})
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Action Controls & Quick Outcome Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Dial / WhatsApp Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${client.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                      title="Direct phone dial"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{client.phone}</span>
                    </a>

                    <button
                      onClick={() => openCallLogger(client, policy)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                      title="Open full call outcome recorder"
                    >
                      <span>Log Notes</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppSender(client, policy)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      title="Send WhatsApp renewal message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  {/* 1-Click Outcome Buttons for Rapid Calling Workflows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuickOutcome(client, policy, 'Spoke - Will Pay')}
                      className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 text-[11px] font-medium transition-colors"
                      title="Spoke - client promised payment"
                    >
                      Will Pay
                    </button>
                    <button
                      onClick={() => handleQuickOutcome(client, policy, 'Not Reachable')}
                      className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-[11px] font-medium transition-colors"
                      title="Not reachable / Switched off"
                    >
                      Unreachable
                    </button>
                    <button
                      onClick={() => handleQuickOutcome(client, policy, 'Paid', true)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                      title="Mark policy as collected and paid"
                    >
                      <Check className="w-3 h-3" />
                      <span>Paid</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
