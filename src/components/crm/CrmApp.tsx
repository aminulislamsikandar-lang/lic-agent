import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CrmSidebar } from './CrmSidebar';
import { CrmHeader } from './CrmHeader';
import { CrmDashboard } from './CrmDashboard';
import { ClientsList } from './ClientsList';
import { AddClientModal } from './AddClientModal';
import { LeadsManagement } from './LeadsManagement';
import { ClientDetailModal } from './ClientDetailModal';
import { PoliciesView } from './PoliciesView';
import { AddPolicyModal } from './AddPolicyModal';
import { TodaysCallList } from './TodaysCallList';
import { CallHistoryView } from './CallHistoryView';
import { AutomationRulesView } from './AutomationRulesView';
import { ReportsView } from './ReportsView';
import { SettingsView } from './SettingsView';
import { CallLoggerModal } from './CallLoggerModal';
import { WhatsAppSenderModal } from './WhatsAppSenderModal';

export const CrmApp: React.FC = () => {
  const { crmTab, setCrmTab, currentRole } = useApp();

  // Modal states
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [policyClientId, setPolicyClientId] = useState<string | undefined>(undefined);

  // If user navigated to 'add-client' or 'add-policy' from sidebar
  React.useEffect(() => {
    if (crmTab === 'add-client') {
      setIsAddClientOpen(true);
      setCrmTab('clients');
    } else if (crmTab === 'add-policy') {
      setIsAddPolicyOpen(true);
      setCrmTab('policies');
    }
  }, [crmTab, setCrmTab]);

  const handleOpenAddPolicy = (clientId?: string) => {
    setPolicyClientId(clientId);
    setIsAddPolicyOpen(true);
  };

  const isStaffRestricted = currentRole === 'Staff' && (crmTab === 'settings' || crmTab === 'automation-rules');

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <CrmSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CrmHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {isStaffRestricted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm my-12">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  🛡️
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Access Restricted to Senior Advisor</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Staff accounts do not have permission to view or edit system automation rules, agency profiles, or staff settings.
                </p>
                <button
                  onClick={() => setCrmTab('dashboard')}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Return to Advisor Dashboard
                </button>
              </div>
            ) : (
              <>
                {crmTab === 'dashboard' && <CrmDashboard />}
                {crmTab === 'clients' && (
                  <ClientsList onOpenAddClient={() => setIsAddClientOpen(true)} />
                )}
                {crmTab === 'leads' && <LeadsManagement />}
                {crmTab === 'policies' && (
                  <PoliciesView
                    filterMode="all"
                    onOpenAddPolicy={() => handleOpenAddPolicy()}
                  />
                )}
                {crmTab === 'due-this-week' && (
                  <PoliciesView
                    filterMode="due-this-week"
                    onOpenAddPolicy={() => handleOpenAddPolicy()}
                  />
                )}
                {crmTab === 'overdue' && (
                  <PoliciesView
                    filterMode="overdue"
                    onOpenAddPolicy={() => handleOpenAddPolicy()}
                  />
                )}
                {crmTab === 'todays-calls' && <TodaysCallList />}
                {crmTab === 'call-history' && <CallHistoryView />}
                {crmTab === 'automation-rules' && <AutomationRulesView />}
                {crmTab === 'reports' && <ReportsView />}
                {crmTab === 'settings' && <SettingsView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global CRM Modals */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />

      <AddPolicyModal
        isOpen={isAddPolicyOpen}
        onClose={() => setIsAddPolicyOpen(false)}
        preselectedClientId={policyClientId}
      />

      <ClientDetailModal onOpenAddPolicy={handleOpenAddPolicy} />
      <CallLoggerModal />
      <WhatsAppSenderModal />
    </div>
  );
};
