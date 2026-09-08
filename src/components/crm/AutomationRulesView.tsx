import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AutomationRule } from '../../types';
import {
  Bot,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Edit2,
  Shield,
  Calendar,
} from 'lucide-react';

export const AutomationRulesView: React.FC = () => {
  const {
    automationRules,
    toggleAutomationRule,
    executeNightlyAutomation,
    whatsappTemplates,
    showToast,
  } = useApp();

  const [simulating, setSimulating] = useState(false);

  const handleRunBatch = () => {
    setSimulating(true);
    executeNightlyAutomation();
    setTimeout(() => {
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span>Automated Policy Renewal Cascade</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            WhatsApp & Notification Automation Engine
          </h2>
          <p className="text-xs text-blue-200/80 max-w-xl">
            Simulates a nightly 08:00 AM background cron job that evaluates policy due dates, identifies matching automation triggers, and prepares or dispatches scheduled messages.
          </p>
        </div>

        <button
          onClick={handleRunBatch}
          disabled={simulating}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer whitespace-nowrap"
        >
          <Play className="w-4 h-4" />
          <span>{simulating ? 'Executing Batch...' : 'Run Automation Job Now'}</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Automation Rules</h3>
            <p className="text-xs text-slate-500">
              Configured automated messaging triggers running on daily scheduler
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {automationRules.filter((r) => r.active).length} Rules Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Rule Name & Trigger</th>
                <th className="p-4">Schedule / Offset</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Linked Template</th>
                <th className="p-4">State</th>
                <th className="p-4 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {automationRules.map((rule) => {
                const linkedTemplate = whatsappTemplates.find((t) => t.id === rule.template_id);

                return (
                  <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-xs">{rule.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Trigger: {rule.trigger}
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-700">
                      {rule.days_offset < 0
                        ? `${Math.abs(rule.days_offset)} days before due`
                        : rule.days_offset === 0
                        ? 'On exact due date'
                        : `${rule.days_offset} days overdue`}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {rule.channel}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{linkedTemplate?.name || rule.template_id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rule.template_id}</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rule.active ? 'ENABLED' : 'PAUSED'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleAutomationRule(rule.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          rule.active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {rule.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Cloud Delivery Info Note */}
      <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-blue-900">
          <Shield className="w-4 h-4 text-blue-700" />
          <span>TRAI & WhatsApp Business Cloud Policy Compliance</span>
        </div>
        <p className="text-blue-800 leading-relaxed">
          Automated reminder notices use pre-approved Meta transactional utility templates. Under IRDAI and TRAI guidelines, policyholder premium reminders are classified as essential transactional service communications and are compliant with DND/NDNC regulations provided explicit consent is verified on policy commencement.
        </p>
      </div>
    </div>
  );
};
