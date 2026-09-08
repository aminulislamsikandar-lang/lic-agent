import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Clock,
  CalendarCheck,
  Inbox,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  Shield,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  Play,
  UserPlus,
  FileText,
} from 'lucide-react';

export const CrmDashboard: React.FC = () => {
  const {
    policies,
    clients,
    leads,
    timeline,
    setCrmTab,
    setSelectedClientId,
    executeNightlyAutomation,
    openCallLogger,
    openWhatsAppSender,
  } = useApp();

  // Metric 1: Overdue count & amount
  const overduePolicies = policies.filter((p) => p.status === 'Overdue');
  const overdueCount = overduePolicies.length;
  const overdueAmount = overduePolicies.reduce((acc, curr) => acc + curr.premium_amount, 0);

  // Metric 2: Due Today
  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayPolicies = policies.filter((p) => {
    const due = new Date(p.due_date).toISOString().split('T')[0];
    return due === todayStr && p.status !== 'Paid' && p.status !== 'Lapsed';
  });
  const dueTodayCount = dueTodayPolicies.length;
  const dueTodayAmount = dueTodayPolicies.reduce((acc, curr) => acc + curr.premium_amount, 0);

  // Metric 3: Due This Week
  const dueThisWeekPolicies = policies.filter((p) => {
    if (p.status === 'Paid' || p.status === 'Lapsed' || p.status === 'Matured') return false;
    const due = new Date(p.due_date);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });
  const dueThisWeekCount = dueThisWeekPolicies.length;

  // Metric 4: New Unactioned Leads
  const newLeads = leads.filter((l) => l.status === 'New');
  const newLeadsCount = newLeads.length;

  // Total active premium pool
  const totalActivePremium = policies
    .filter((p) => p.status !== 'Lapsed' && p.status !== 'Matured')
    .reduce((acc, curr) => acc + curr.premium_amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Greeting & Quick Action */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Renewal Advisory Action Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Good day! You have {overdueCount + dueTodayCount} priority policy renewals today.
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/90 max-w-xl">
            {overdueCount} overdue accounts and {dueTodayCount} due today need advisor follow-up to prevent grace-period lapses and protect your renewal commission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setCrmTab('todays-calls')}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Start Today's Calls</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => executeNightlyAutomation()}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3.5 rounded-xl border border-white/10 transition-all text-xs cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-blue-300" />
            <span>Simulate Nightly WhatsApp Bot</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overdue Count */}
        <div
          onClick={() => setCrmTab('overdue')}
          className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Policies</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 tracking-tight">{overdueCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>₹{overdueAmount.toLocaleString('en-IN')} pending</span>
            <span className="text-rose-600 font-bold text-[11px] group-hover:underline">View All →</span>
          </div>
        </div>

        {/* Card 2: Due Today */}
        <div
          onClick={() => setCrmTab('todays-calls')}
          className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Today</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-700 tracking-tight">{dueTodayCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>₹{dueTodayAmount.toLocaleString('en-IN')} due today</span>
            <span className="text-blue-700 font-bold text-[11px] group-hover:underline">Call List →</span>
          </div>
        </div>

        {/* Card 3: Due This Week */}
        <div
          onClick={() => setCrmTab('due-this-week')}
          className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due This Week</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 tracking-tight">{dueThisWeekCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Next 7 days renewals</span>
            <span className="text-amber-600 font-bold text-[11px] group-hover:underline">Review →</span>
          </div>
        </div>

        {/* Card 4: New Website Leads */}
        <div
          onClick={() => setCrmTab('leads')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Website Leads</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 tracking-tight">{newLeadsCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Online enquiries</span>
            <span className="text-emerald-600 font-bold text-[11px] group-hover:underline">Convert →</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Follow-Ups & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Immediate Call List Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-700" />
                Urgent Renewal Calls ({overdueCount + dueTodayCount})
              </h3>
              <p className="text-xs text-slate-500">Sorted by urgency: Overdue policies appear at top</p>
            </div>
            <button
              onClick={() => setCrmTab('todays-calls')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800"
            >
              Open Full Call List →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {[...overduePolicies, ...dueTodayPolicies].slice(0, 5).map((pol) => {
              const client = clients.find((c) => c.id === pol.client_id);
              const isOverdue = pol.status === 'Overdue';

              return (
                <div key={pol.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{pol.client_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {isOverdue ? 'OVERDUE' : 'DUE TODAY'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {pol.insurer} • {pol.plan_type} (No. {pol.policy_number})
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      Premium: ₹{pol.premium_amount.toLocaleString('en-IN')} ({pol.frequency})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (client) openCallLogger(client, pol);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Log Call</span>
                    </button>

                    <button
                      onClick={() => {
                        if (client) openWhatsAppSender(client, pol);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Recent Activity Timeline Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Recent Activity Feed
            </h3>
            <button
              onClick={() => setCrmTab('call-history')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              History
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {timeline.slice(0, 7).map((entry) => {
              const client = clients.find((c) => c.id === entry.client_id);

              return (
                <div key={entry.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {client ? client.name : 'Client Activity'}
                    </span>
                    <span className="text-[10px] text-slate-400">{entry.created_at}</span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{entry.content}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>By: {entry.created_by}</span>
                    {entry.channel && (
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium">
                        {entry.channel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
