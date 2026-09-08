import React from 'react';
import { useApp, CrmTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Inbox,
  FileCheck,
  Clock,
  AlertOctagon,
  FilePlus,
  PhoneOutgoing,
  History,
  Bot,
  BarChart3,
  Settings,
  Shield,
  ExternalLink,
} from 'lucide-react';

export const CrmSidebar: React.FC = () => {
  const { crmTab, setCrmTab, currentRole, policies, leads, setMode } = useApp();

  // Counts for badges
  const overdueCount = policies.filter((p) => p.status === 'Overdue').length;

  const dueThisWeekCount = policies.filter((p) => {
    if (p.status === 'Paid' || p.status === 'Lapsed' || p.status === 'Matured') return false;
    const due = new Date(p.due_date);
    const today = new Date();
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const todaysCallsCount = overdueCount + policies.filter((p) => {
    const due = new Date(p.due_date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return due === today && p.status !== 'Paid';
  }).length;

  const navSections = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard' as CrmTab, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Clients & Leads',
      items: [
        { id: 'clients' as CrmTab, label: 'All Clients', icon: Users },
        { id: 'add-client' as CrmTab, label: 'Add New Client', icon: UserPlus },
        {
          id: 'leads' as CrmTab,
          label: 'Website Leads',
          icon: Inbox,
          badge: newLeadsCount > 0 ? newLeadsCount : undefined,
          badgeColor: 'bg-emerald-500 text-white',
        },
      ],
    },
    {
      title: 'Policy Management',
      items: [
        { id: 'policies' as CrmTab, label: 'All Policies', icon: FileCheck },
        {
          id: 'due-this-week' as CrmTab,
          label: 'Due This Week',
          icon: Clock,
          badge: dueThisWeekCount > 0 ? dueThisWeekCount : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        {
          id: 'overdue' as CrmTab,
          label: 'Overdue Dues',
          icon: AlertOctagon,
          badge: overdueCount > 0 ? overdueCount : undefined,
          badgeColor: 'bg-rose-600 text-white',
        },
        { id: 'add-policy' as CrmTab, label: 'Add Policy', icon: FilePlus },
      ],
    },
    {
      title: 'Calls & Automation',
      items: [
        {
          id: 'todays-calls' as CrmTab,
          label: "Today's Call List",
          icon: PhoneOutgoing,
          badge: todaysCallsCount > 0 ? todaysCallsCount : undefined,
          badgeColor: 'bg-blue-600 text-white',
        },
        { id: 'call-history' as CrmTab, label: 'Call Log History', icon: History },
        {
          id: 'automation-rules' as CrmTab,
          label: 'Message Automation',
          icon: Bot,
          disabled: currentRole === 'Staff',
          tooltip: currentRole === 'Staff' ? 'Restricted for Staff role' : undefined,
        },
      ],
    },
    {
      title: 'Analytics & Config',
      items: [
        { id: 'reports' as CrmTab, label: 'Reports & Commission', icon: BarChart3 },
        {
          id: 'settings' as CrmTab,
          label: 'Settings & Profile',
          icon: Settings,
          disabled: currentRole === 'Staff',
          tooltip: currentRole === 'Staff' ? 'Restricted for Staff role' : undefined,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-950/40">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-amber-300 font-bold shadow-md">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            InsureCare CRM
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Mirza Branch • LIC Suite</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = crmTab === item.id;
              const isDisabled = item.disabled;

              return (
                <button
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => setCrmTab(item.id)}
                  title={item.tooltip}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Switch to public site */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={() => setMode('public')}
          className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Live</span>
        </button>
      </div>
    </aside>
  );
};
