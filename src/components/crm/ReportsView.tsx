import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { clients, policies, leads, showToast } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Calculate stats for the selected month
  const monthlyStats = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-indexed

    const monthPolicies = policies.filter((p) => {
      const d = new Date(p.due_date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const totalExpectedPremium = monthPolicies.reduce((acc, curr) => acc + curr.premium_amount, 0);

    const paidPolicies = monthPolicies.filter((p) => p.status === 'Paid');
    const collectedPremium = paidPolicies.reduce((acc, curr) => acc + curr.premium_amount, 0);

    const overduePolicies = monthPolicies.filter((p) => p.status === 'Overdue');
    const overduePremium = overduePolicies.reduce((acc, curr) => acc + curr.premium_amount, 0);

    // Projected commission: sum of (premium_amount * (commission_rate || 7.5) / 100)
    const projectedCommission = monthPolicies.reduce((acc, curr) => {
      const rate = curr.commission_rate || 7.5;
      return acc + (curr.premium_amount * rate) / 100;
    }, 0);

    const earnedCommission = paidPolicies.reduce((acc, curr) => {
      const rate = curr.commission_rate || 7.5;
      return acc + (curr.premium_amount * rate) / 100;
    }, 0);

    return {
      monthPolicies,
      totalExpectedPremium,
      collectedPremium,
      overduePremium,
      projectedCommission,
      earnedCommission,
      count: monthPolicies.length,
      paidCount: paidPolicies.length,
      overdueCount: overduePolicies.length,
    };
  }, [policies, selectedMonth]);

  // CSV Exporters
  const exportAllClientsCSV = () => {
    const headers = ['Client ID', 'Name', 'Phone', 'Email', 'City', 'Source', 'Notes'];
    const rows = clients.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.city}"`,
      `"${c.source}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    downloadCSV(headers, rows, `All_Clients_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportOverdueCSV = () => {
    const overdue = policies.filter((p) => p.status === 'Overdue');
    const headers = ['Policy Number', 'Client Name', 'Phone', 'Insurer', 'Plan', 'Premium', 'Due Date', 'Status'];
    const rows = overdue.map((p) => [
      p.policy_number,
      `"${p.client_name || ''}"`,
      `"${p.client_phone || ''}"`,
      `"${p.insurer}"`,
      `"${p.plan_type}"`,
      p.premium_amount,
      p.due_date,
      p.status,
    ]);

    downloadCSV(headers, rows, `Overdue_Policies_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportLeadsCSV = () => {
    const headers = ['Lead ID', 'Name', 'Phone', 'Product Interest', 'City', 'Source', 'Submitted Date', 'Status'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.product_interest}"`,
      `"${l.city}"`,
      `"${l.source}"`,
      l.submitted_at,
      l.status,
    ]);

    downloadCSV(headers, rows, `Website_Leads_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCSV = (headers: string[], rows: any[][], filename: string) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-700" />
            Advisory Reports & Commission Projections
          </h2>
          <p className="text-xs text-slate-500">
            Monthly renewal collection forecasts, commission earnings, and raw data spreadsheet exports
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Select Month:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg shadow-2xs font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* 4 Financial Metric Cards for Selected Month */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Total Expected Renewal Premium
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{monthlyStats.totalExpectedPremium.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across {monthlyStats.count} policyholders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Collected Premium (Paid)
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ₹{monthlyStats.collectedPremium.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-semibold">
            {monthlyStats.paidCount} of {monthlyStats.count} renewals settled
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Projected Advisor Commission
          </div>
          <div className="text-2xl font-black text-blue-700">
            ₹{Math.round(monthlyStats.projectedCommission).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Estimated at ~7.5% - 10% slab</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Earned Commission (So Far)
          </div>
          <div className="text-2xl font-black text-amber-600">
            ₹{Math.round(monthlyStats.earnedCommission).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-amber-700 mt-1 font-semibold">Credited to advisor agency</div>
        </div>
      </div>

      {/* CSV Export Actions Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          One-Click Spreadsheet Data Exports (CSV / Excel Compatible)
        </h3>
        <p className="text-xs text-slate-500">
          Export full CRM data sets anytime for offline backups, branch reconciliation, or accountant review.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={exportAllClientsCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export All Clients ({clients.length})</span>
          </button>

          <button
            onClick={exportOverdueCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-rose-600" />
            <span>Export Overdue List ({policies.filter((p) => p.status === 'Overdue').length})</span>
          </button>

          <button
            onClick={exportLeadsCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Website Leads ({leads.length})</span>
          </button>
        </div>
      </div>

      {/* Policies in Selected Month Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">
            Policies Up for Renewal in {selectedMonth} ({monthlyStats.count})
          </h3>
          <p className="text-xs text-slate-500">Itemized renewal list and advisor commission share</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Policyholder</th>
                <th className="p-4">Policy Number & Plan</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Premium Amount</th>
                <th className="p-4">Commission (%)</th>
                <th className="p-4">Expected Commission</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyStats.monthPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No policies scheduled for renewal in this calendar month.
                  </td>
                </tr>
              ) : (
                monthlyStats.monthPolicies.map((p) => {
                  const rate = p.commission_rate || 7.5;
                  const comm = (p.premium_amount * rate) / 100;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-bold text-slate-900">{p.client_name || 'Client'}</td>
                      <td className="p-4">
                        <div className="font-mono text-slate-800">{p.policy_number}</div>
                        <div className="text-[11px] text-slate-500">{p.plan_type}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{p.due_date}</td>
                      <td className="p-4 font-bold text-slate-900">₹{p.premium_amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-slate-600">{rate}%</td>
                      <td className="p-4 font-bold text-emerald-700">₹{Math.round(comm).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'Overdue'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
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
