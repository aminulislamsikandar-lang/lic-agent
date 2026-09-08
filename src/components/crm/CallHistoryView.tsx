import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CallOutcome } from '../../types';
import { History, Phone, Calendar, Search, Filter, MessageSquare, Shield, CheckCircle2 } from 'lucide-react';

export const CallHistoryView: React.FC = () => {
  const { callLogs, clients, setSelectedClientId } = useApp();

  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | CallOutcome>('ALL');
  const [filterSearch, setFilterSearch] = useState('');

  const filteredLogs = callLogs.filter((log) => {
    if (outcomeFilter !== 'ALL' && log.outcome !== outcomeFilter) return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const matchClient = log.client_name?.toLowerCase().includes(q);
      const matchNotes = log.notes?.toLowerCase().includes(q);
      if (!matchClient && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-700" />
            Call Log & Follow-Up History ({callLogs.length})
          </h2>
          <p className="text-xs text-slate-500">
            Audit trail of all telephone conversations, payment promises, and follow-up commitments
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by client or notes..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Outcome filter buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {(
          [
            'ALL',
            'Spoke - Will Pay',
            'Paid',
            'Callback Requested',
            'Not Reachable',
            'Wrong Number',
          ] as const
        ).map((oc) => (
          <button
            key={oc}
            onClick={() => setOutcomeFilter(oc)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              outcomeFilter === oc
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {oc}
          </button>
        ))}
      </div>

      {/* Table of logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Call Outcome</th>
                <th className="p-4">Conversation Notes</th>
                <th className="p-4">Next Follow-Up</th>
                <th className="p-4">Advisor / Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No call log records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {log.created_at}
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        <button
                          onClick={() => setSelectedClientId(log.client_id)}
                          className="hover:text-blue-700 text-left transition-colors"
                        >
                          {log.client_name || 'Client'}
                        </button>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.outcome === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.outcome === 'Spoke - Will Pay'
                              ? 'bg-blue-100 text-blue-800'
                              : log.outcome === 'Callback Requested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {log.outcome}
                        </span>
                      </td>

                      <td className="p-4 text-slate-700 max-w-sm">
                        <p className="line-clamp-2">{log.notes || 'No remarks recorded'}</p>
                      </td>

                      <td className="p-4 text-slate-600">
                        {log.follow_up_date ? (
                          <span className="font-semibold text-slate-900">{log.follow_up_date}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="p-4 text-slate-500 text-[11px]">{log.created_by}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
