import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Policy, TimelineEntry } from '../../types';
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Clock,
  FileCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Shield,
  FileText,
  AlertOctagon,
} from 'lucide-react';

interface ClientDetailModalProps {
  onOpenAddPolicy: (clientId: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ onOpenAddPolicy }) => {
  const {
    selectedClientId,
    setSelectedClientId,
    clients,
    policies,
    timeline,
    updatePolicyStatus,
    logInteraction,
    openCallLogger,
    openWhatsAppSender,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'policies' | 'timeline' | 'notes'>('policies');
  const [newNoteText, setNewNoteText] = useState('');

  if (!selectedClientId) return null;

  const client = clients.find((c) => c.id === selectedClientId);
  if (!client) return null;

  const clientPolicies = policies.filter((p) => p.client_id === client.id);
  const clientTimeline = timeline.filter((t) => t.client_id === client.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    logInteraction({
      client_id: client.id,
      type: 'note',
      content: newNoteText.trim(),
      created_by: currentRole === 'Advisor' ? 'Ramesh Sharma' : 'Staff Member',
      channel: 'System',
    });

    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => setSelectedClientId(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{client.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  ID: {client.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Source: {client.source}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {client.phone}
                </span>
                {client.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {client.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {client.city}
                </span>
              </div>
            </div>

            {/* Direct Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openCallLogger(client, clientPolicies[0])}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call & Log</span>
              </button>

              <button
                onClick={() => openWhatsAppSender(client, clientPolicies[0])}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mt-6 border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('policies')}
              className={`pb-2.5 font-bold transition-all border-b-2 ${
                activeTab === 'policies'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Policies ({clientPolicies.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2.5 font-bold transition-all border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Interaction Timeline ({clientTimeline.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2.5 font-bold transition-all border-b-2 ${
                activeTab === 'notes'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Notes & Background
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: POLICIES */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Linked Insurance Policies
                </span>
                <button
                  onClick={() => onOpenAddPolicy(client.id)}
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Policy to Client</span>
                </button>
              </div>

              {clientPolicies.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                  No active policies on file for this client yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {clientPolicies.map((p) => {
                    const isOverdue = p.status === 'Overdue';
                    const isPaid = p.status === 'Paid';

                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isOverdue
                            ? 'border-rose-200 bg-rose-50/30'
                            : isPaid
                            ? 'border-emerald-200 bg-emerald-50/20'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{p.insurer}</span>
                            <span className="text-slate-500 font-medium">| {p.plan_type}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOverdue
                                  ? 'bg-rose-100 text-rose-700'
                                  : isPaid
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>

                          <div className="text-slate-500 text-xs flex flex-wrap items-center gap-3">
                            <span className="font-mono text-slate-800 font-semibold">Policy No: {p.policy_number}</span>
                            <span>•</span>
                            <span>Frequency: {p.frequency}</span>
                            <span>•</span>
                            <span className="text-slate-700 font-bold">
                              Renewal Due: {p.due_date}
                            </span>
                          </div>

                          <div className="text-slate-800 font-bold text-sm pt-0.5">
                            Premium: ₹{p.premium_amount.toLocaleString('en-IN')}
                            {p.sum_assured && (
                              <span className="text-xs font-normal text-slate-500 ml-2">
                                (Sum Assured: ₹{p.sum_assured.toLocaleString('en-IN')})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Update Quick Dropdown */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-500 font-medium">Status:</span>
                          <select
                            value={p.status}
                            onChange={(e) => updatePolicyStatus(p.id, e.target.value as any)}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-hidden"
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending Renewal</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Paid">Mark as Paid</option>
                            <option value="Lapsed">Lapsed</option>
                            <option value="Matured">Matured</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Chronological Communication & System Log
              </span>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
                {clientTimeline.length === 0 ? (
                  <div className="text-slate-400 py-4">No interactions logged yet.</div>
                ) : (
                  clientTimeline.map((item) => (
                    <div key={item.id} className="relative bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="absolute -left-8 top-3 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                        <span className="font-bold text-slate-800">
                          {item.type === 'call'
                            ? '📞 Phone Call Log'
                            : item.type === 'message'
                            ? '💬 WhatsApp Notification'
                            : '📝 Status Update / Note'}
                        </span>
                        <span>{item.created_at}</span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{item.content}</p>
                      <div className="text-[10px] text-slate-400 mt-1">Logged by: {item.created_by}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-800">Client Profile Notes:</div>
                <p className="text-slate-600 leading-relaxed">
                  {client.notes || 'No initial profile notes recorded for this client.'}
                </p>
                <div className="text-slate-400 text-[11px]">
                  Registered address: {client.address || client.city}
                </div>
              </div>

              {/* Add New Note */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block font-bold text-slate-700">Add Timestamped Note to Client File:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Discussed medical checkup for Term plan rider on Thursday..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Save Note to Timeline
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
