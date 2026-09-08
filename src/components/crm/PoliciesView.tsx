import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Policy, PolicyStatus } from '../../types';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';

interface PoliciesViewProps {
  filterMode?: 'all' | 'due-this-week' | 'overdue';
  onOpenAddPolicy: () => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({
  filterMode = 'all',
  onOpenAddPolicy,
}) => {
  const {
    policies,
    clients,
    updatePolicyStatus,
    openCallLogger,
    openWhatsAppSender,
    setSelectedClientId,
    searchQuery,
  } = useApp();

  const [localFilter, setLocalFilter] = useState<'ALL' | 'Active' | 'Pending' | 'Overdue' | 'Paid'>(
    filterMode === 'overdue' ? 'Overdue' : 'ALL'
  );
  const [insurerFilter, setInsurerFilter] = useState<string>('ALL');

  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      // Filter mode preset
      if (filterMode === 'overdue' && p.status !== 'Overdue') return false;
      if (filterMode === 'due-this-week') {
        if (p.status === 'Paid' || p.status === 'Lapsed' || p.status === 'Matured') return false;
        const due = new Date(p.due_date);
        const today = new Date();
        const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > 7) return false;
      }

      // Local status filter
      if (localFilter !== 'ALL' && p.status !== localFilter) return false;

      // Insurer filter
      if (insurerFilter !== 'ALL' && p.insurer !== insurerFilter) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNo = p.policy_number.toLowerCase().includes(q);
        const matchPlan = p.plan_type.toLowerCase().includes(q);
        const matchClient = p.client_name?.toLowerCase().includes(q);
        if (!matchNo && !matchPlan && !matchClient) return false;
      }

      return true;
    });
  }, [policies, filterMode, localFilter, insurerFilter, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-700" />
            {filterMode === 'overdue'
              ? 'Overdue Policy Dues'
              : filterMode === 'due-this-week'
              ? 'Policies Due This Week'
              : 'Policy Master Directory'}{' '}
            ({filteredPolicies.length})
          </h2>
          <p className="text-xs text-slate-500">
            Track premium schedules, policy tables, and renewal statuses across all partner insurers
          </p>
        </div>

        <button
          onClick={onOpenAddPolicy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Policy</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Status:</span>
          {(['ALL', 'Active', 'Pending', 'Overdue', 'Paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setLocalFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                localFilter === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Insurer:</span>
          <select
            value={insurerFilter}
            onChange={(e) => setInsurerFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-hidden"
          >
            <option value="ALL">All Insurers</option>
            <option value="LIC of India">LIC of India</option>
            <option value="Star Health">Star Health</option>
            <option value="HDFC Life">HDFC Life</option>
            <option value="Tata AIG">Tata AIG</option>
          </select>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Policyholder</th>
                <th className="p-4">Insurer & Plan</th>
                <th className="p-4">Policy Number</th>
                <th className="p-4">Premium (Frequency)</th>
                <th className="p-4">Renewal Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No policies found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => {
                  const client = clients.find((c) => c.id === policy.client_id);
                  const isOverdue = policy.status === 'Overdue';
                  const isPaid = policy.status === 'Paid';

                  return (
                    <tr
                      key={policy.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOverdue ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedClientId(policy.client_id)}
                          className="font-bold text-slate-900 text-sm hover:text-blue-700 transition-colors text-left"
                        >
                          {policy.client_name || client?.name || 'Policyholder'}
                        </button>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {policy.client_phone || client?.phone}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{policy.insurer}</div>
                        <div className="text-slate-500 text-[11px]">{policy.plan_type}</div>
                      </td>

                      <td className="p-4 font-mono font-medium text-slate-800">
                        {policy.policy_number}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm">
                          ₹{policy.premium_amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-slate-500 text-[11px]">{policy.frequency}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{policy.due_date}</div>
                        {policy.grace_period_end && (
                          <div className="text-[10px] text-rose-600 font-medium">
                            Grace: {policy.grace_period_end}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={policy.status}
                          onChange={(e) => updatePolicyStatus(policy.id, e.target.value as PolicyStatus)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border outline-hidden ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-700 border-rose-300'
                              : isPaid
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : policy.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Paid">Paid</option>
                          <option value="Lapsed">Lapsed</option>
                          <option value="Matured">Matured</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {client && (
                            <>
                              <button
                                onClick={() => openCallLogger(client, policy)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                title="Call & Log Outcome"
                              >
                                <Phone className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => openWhatsAppSender(client, policy)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Send WhatsApp Reminder"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
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
