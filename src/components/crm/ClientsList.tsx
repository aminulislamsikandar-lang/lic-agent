import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, Policy } from '../../types';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Phone,
  MessageSquare,
  Eye,
  Trash2,
  Calendar,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

interface ClientsListProps {
  onOpenAddClient: () => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({ onOpenAddClient }) => {
  const {
    clients,
    policies,
    setSelectedClientId,
    openCallLogger,
    openWhatsAppSender,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'OVERDUE' | 'PENDING'>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Compute stats per client
  const clientRows = useMemo(() => {
    return clients.map((client) => {
      const clientPolicies = policies.filter((p) => p.client_id === client.id);
      const hasOverdue = clientPolicies.some((p) => p.status === 'Overdue');
      const hasPending = clientPolicies.some((p) => p.status === 'Pending');

      // Determine next due date
      const activePolicies = clientPolicies.filter((p) => p.status !== 'Lapsed' && p.status !== 'Matured');
      activePolicies.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      const nextDuePolicy = activePolicies[0];

      let computedStatus = 'Active';
      if (hasOverdue) computedStatus = 'Overdue';
      else if (hasPending) computedStatus = 'Pending Due';

      return {
        ...client,
        policiesCount: clientPolicies.length,
        nextDueDate: nextDuePolicy ? nextDuePolicy.due_date : 'None',
        computedStatus,
        clientPolicies,
      };
    });
  }, [clients, policies]);

  // Filtered rows
  const filteredClients = useMemo(() => {
    return clientRows.filter((c) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        const matchesPolicy = c.clientPolicies.some((p) =>
          p.policy_number.toLowerCase().includes(q) || p.plan_type.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesPhone && !matchesCity && !matchesPolicy) return false;
      }

      // Status filter
      if (statusFilter === 'OVERDUE' && c.computedStatus !== 'Overdue') return false;
      if (statusFilter === 'ACTIVE' && c.computedStatus !== 'Active') return false;
      if (statusFilter === 'PENDING' && c.computedStatus !== 'Pending Due') return false;

      return true;
    });
  }, [clientRows, searchQuery, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredClients.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0
      ? filteredClients.filter((c) => selectedIds.includes(c.id))
      : filteredClients;

    const headers = ['Client ID', 'Name', 'Phone', 'Email', 'City', 'Source', 'Policies Count', 'Next Due Date', 'Status'];
    const rows = listToExport.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      `"${c.source}"`,
      c.policiesCount,
      c.nextDueDate,
      c.computedStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Clients_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${listToExport.length} clients to CSV`, 'success');
  };

  return (
    <div className="space-y-5">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            Client Directory ({clients.length})
          </h2>
          <p className="text-xs text-slate-500">Manage all insured policyholders, contact records, and renewal timelines</p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV {selectedIds.length > 0 && `(${selectedIds.length})`}</span>
          </button>

          <button
            onClick={onOpenAddClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1">Status Filter:</span>
          {(['ALL', 'ACTIVE', 'PENDING', 'OVERDUE'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Clients' : st === 'OVERDUE' ? '⚠️ Overdue' : st === 'PENDING' ? '⏳ Pending Due' : '✅ Active'}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredClients.length}</span> of {clients.length} clients
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredClients.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                </th>
                <th className="p-4">Client Name & Phone</th>
                <th className="p-4">City</th>
                <th className="p-4">Active Policies</th>
                <th className="p-4">Next Renewal Due</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No clients matched the filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isSelected = selectedIds.includes(client.id);

                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(client.id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300"
                        />
                      </td>

                      <td
                        onClick={() => setSelectedClientId(client.id)}
                        className="p-4 cursor-pointer group"
                      >
                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                          {client.name}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">{client.phone}</div>
                        {client.source && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            Source: {client.source}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-700 font-medium">{client.city}</td>

                      <td className="p-4">
                        <span className="font-bold text-slate-900">{client.policiesCount}</span>{' '}
                        <span className="text-slate-500 text-[11px]">policies</span>
                      </td>

                      <td className="p-4">
                        <div className="font-medium text-slate-800">{client.nextDueDate}</div>
                        {client.nextDueDate !== 'None' && (
                          <div className="text-[10px] text-slate-400">
                            {new Date(client.nextDueDate) < new Date() ? 'Overdue!' : 'Upcoming'}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            client.computedStatus === 'Overdue'
                              ? 'bg-rose-100 text-rose-700'
                              : client.computedStatus === 'Pending Due'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {client.computedStatus}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedClientId(client.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Client Details & Policies"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openCallLogger(client, client.clientPolicies[0])}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            title="Log Call"
                          >
                            <Phone className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openWhatsAppSender(client, client.clientPolicies[0])}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
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
