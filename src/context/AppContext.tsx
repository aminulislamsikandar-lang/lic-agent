import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Client,
  Policy,
  TimelineEntry,
  Lead,
  AutomationRule,
  WhatsAppTemplate,
  AdvisorProfile,
  StaffMember,
  NotificationItem,
  UserRole,
  PolicyStatus,
  LeadStatus,
  CallLog,
  CallOutcome,
  AuthUser,
} from '../types';
import {
  initialClients,
  initialPolicies,
  initialLeads,
  initialTimeline,
  initialAutomationRules,
  initialWhatsAppTemplates,
  initialAdvisorProfile,
  initialStaffMembers,
} from '../data/initialData';

export type AppMode = 'public' | 'crm';

export type CrmTab =
  | 'dashboard'
  | 'clients'
  | 'add-client'
  | 'leads'
  | 'policies'
  | 'due-this-week'
  | 'overdue'
  | 'add-policy'
  | 'todays-calls'
  | 'call-history'
  | 'automation-rules'
  | 'reports'
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  crmTab: CrmTab;
  setCrmTab: (tab: CrmTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  // Auth
  currentUser: AuthUser | null;
  authToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  requestCrmAccess: () => void;

  // Data
  clients: Client[];
  policies: Policy[];
  leads: Lead[];
  timeline: TimelineEntry[];
  automationRules: AutomationRule[];
  templates: WhatsAppTemplate[];
  whatsappTemplates: WhatsAppTemplate[];
  advisorProfile: AdvisorProfile;
  staffMembers: StaffMember[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  callLogs: CallLog[];

  // Modals & UI States
  isLeadModalOpen: boolean;
  leadModalProduct: string;
  openLeadModal: (product?: string) => void;
  closeLeadModal: () => void;

  activeCallClient: any;
  activeCallPolicy: Policy | null;
  openCallLogger: (client: Client, policy?: Policy) => void;
  closeCallLogger: () => void;

  activeWhatsAppPayload: { client: Client; policy?: Policy; template?: WhatsAppTemplate } | null;
  activeWhatsAppClient: Client | null;
  activeWhatsAppPolicy: Policy | null;
  openWhatsAppSender: (client: Client, policy?: Policy, template?: WhatsAppTemplate) => void;
  closeWhatsAppSender: () => void;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'submitted_at' | 'status'>) => Promise<Lead>;
  updateLeadStatus: (leadId: string, status: LeadStatus, notes?: string) => Promise<void>;
  convertLeadToClient: (leadId: string, clientData?: Partial<Client>, policyData?: Partial<Policy>) => Promise<void>;

  addClient: (client: Omit<Client, 'id' | 'created_at'>, initialPolicy?: Omit<Policy, 'id' | 'client_id'>) => Promise<Client>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;

  addPolicy: (policy: Omit<Policy, 'id'>) => Promise<Policy>;
  updatePolicyStatus: (policyId: string, status: PolicyStatus) => Promise<void>;
  deletePolicy: (policyId: string) => Promise<void>;

  logInteraction: (entry: Omit<TimelineEntry, 'id' | 'created_at'>) => Promise<void>;
  quickLogCallOutcome: (policyId: string, outcome: string, noteText?: string) => Promise<void>;
  logCallOutcome: (
    clientId: string,
    outcome: CallOutcome,
    notes?: string,
    policyId?: string,
    followUpDate?: string,
    markPaid?: boolean
  ) => Promise<void>;

  toggleAutomationRule: (ruleId: string) => Promise<void>;
  updateAutomationRule: (rule: AutomationRule) => void;
  executeNightlyAutomation: () => Promise<{ sentCount: number; logs: string[] }>;

  updateAdvisorProfile: (profile: AdvisorProfile) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;

  toasts: Toast[];
  toast: Toast | null;
  hideToast: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Reset to demo state
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'insurecare_crm_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>('public');
  const [crmTab, setCrmTab] = useState<CrmTab>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'token') || null;
  });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const currentRole: UserRole = currentUser?.role || 'Advisor';
  const setCurrentRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'user', JSON.stringify(updated));
    }
  };

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Offline / Cache Loader
  const loadCache = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return fallback;
  };

  // State
  const [clients, setClients] = useState<Client[]>(() => loadCache('clients', initialClients));
  const [policies, setPolicies] = useState<Policy[]>(() => loadCache('policies', initialPolicies));
  const [leads, setLeads] = useState<Lead[]>(() => loadCache('leads', initialLeads));
  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => loadCache('timeline', initialTimeline));
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() =>
    loadCache('automation_rules', initialAutomationRules)
  );
  const [templates] = useState<WhatsAppTemplate[]>(initialWhatsAppTemplates);
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile>(() =>
    loadCache('advisor_profile', initialAdvisorProfile)
  );
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() =>
    loadCache('staff_members', initialStaffMembers)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadCache('notifications', [])
  );
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => loadCache('call_logs', []));

  // Sync to local storage for offline cache
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'timeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'call_logs', JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'automation_rules', JSON.stringify(automationRules));
  }, [automationRules]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'advisor_profile', JSON.stringify(advisorProfile));
  }, [advisorProfile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Header Helper
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      headers['x-auth-token'] = authToken;
    }
    return headers;
  }, [authToken]);

  // Central Server Data Fetcher
  const isFetchingRef = useRef(false);
  const fetchSharedData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch('/api/data', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.clients) setClients(data.clients);
        if (data.policies) setPolicies(data.policies);
        if (data.leads) setLeads(data.leads);
        if (data.timeline) setTimeline(data.timeline);
        if (data.callLogs) setCallLogs(data.callLogs);
        if (data.automationRules) setAutomationRules(data.automationRules);
        if (data.advisorProfile) setAdvisorProfile(data.advisorProfile);
        if (data.staffMembers) setStaffMembers(data.staffMembers);
        if (data.notifications) setNotifications(data.notifications);
      }
    } catch (err) {
      // Offline fallback: keep current cache
      console.warn('Backend sync in progress or offline fallback active:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [getAuthHeaders]);

  // Verify Session on initial load
  useEffect(() => {
    if (authToken) {
      fetch('/api/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          'x-auth-token': authToken,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Session expired');
          }
        })
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
            localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Token invalid
          setAuthToken(null);
          setCurrentUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'token');
          localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'user');
        });
    }

    // Initial fetch of data
    fetchSharedData();
  }, [authToken, fetchSharedData]);

  // Background Polling (Multi-device live synchronization)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSharedData();
    }, 4500);
    return () => clearInterval(interval);
  }, [fetchSharedData]);

  // Auth Operations
  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Authentication failed');
      }

      const data = await res.json();
      setAuthToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'token', data.token);
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'user', JSON.stringify(data.user));

      showToast(`Welcome, ${data.user.name} (${data.user.role})!`, 'success');
      fetchSharedData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const logout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch {
        // ignore
      }
    }
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'token');
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'user');
    setModeState('public');
    showToast('Signed out of CRM successfully.', 'info');
  };

  // Safe mode switcher with authentication gating
  const setMode = (targetMode: AppMode) => {
    if (targetMode === 'crm' && !currentUser) {
      // Must authenticate to enter CRM
      setIsLoginModalOpen(true);
      return;
    }
    setModeState(targetMode);
  };

  const requestCrmAccess = () => {
    if (currentUser) {
      setModeState('crm');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Modals
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalProduct, setLeadModalProduct] = useState('Comprehensive Insurance Consultation');

  const openLeadModal = (product?: string) => {
    if (product) setLeadModalProduct(product);
    setIsLeadModalOpen(true);
  };
  const closeLeadModal = () => setIsLeadModalOpen(false);

  const [activeCallClient, setActiveCallClient] = useState<any | null>(null);
  const openCallLogger = (client: Client, policy?: Policy) => {
    setActiveCallClient({ client, policy });
  };
  const closeCallLogger = () => setActiveCallClient(null);

  const [activeWhatsAppPayload, setActiveWhatsAppPayload] = useState<{
    client: Client;
    policy?: Policy;
    template?: WhatsAppTemplate;
  } | null>(null);

  const openWhatsAppSender = (client: Client, policy?: Policy, template?: WhatsAppTemplate) => {
    setActiveWhatsAppPayload({ client, policy, template });
  };
  const closeWhatsAppSender = () => setActiveWhatsAppPayload(null);

  // =====================================
  // ACTIONS (SYNCED WITH CENTRAL DATABASE)
  // =====================================

  // 1. Add Lead (Public endpoint - multi-device sync)
  const addLead = async (leadInput: Omit<Lead, 'id' | 'submitted_at' | 'status'>): Promise<Lead> => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadInput),
      });

      if (res.ok) {
        const data = await res.json();
        const created = data.lead;
        setLeads((prev) => [created, ...prev]);

        // Add to notifications
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: `New Lead: ${created.name}`,
          message: `${created.product_interest} (${created.city}) - Tel: ${created.phone}`,
          type: 'lead',
          created_at: 'Just now',
          read: false,
          link_tab: 'leads',
        };
        setNotifications((prev) => [notif, ...prev]);

        showToast('Enquiry received! Advisor notified.', 'success');
        return created;
      }
    } catch (err) {
      console.error('Lead post failed, falling back to local state:', err);
    }

    // Local fallback
    const fallbackLead: Lead = {
      ...leadInput,
      id: `lead-${Date.now()}`,
      status: 'New',
      submitted_at: 'Just now',
    };
    setLeads((prev) => [fallbackLead, ...prev]);
    showToast('Enquiry submitted successfully!', 'success');
    return fallbackLead;
  };

  // 2. Update Lead Status
  const updateLeadStatus = async (leadId: string, status: LeadStatus, notes?: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status, notes: notes ?? l.notes } : l))
    );

    try {
      await fetch(`/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      // cached in local state
    }
    showToast(`Lead status updated to ${status}`, 'success');
  };

  // 3. Convert Lead to Client
  const convertLeadToClient = async (
    leadId: string,
    clientData?: Partial<Client>,
    policyData?: Partial<Policy>
  ) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ clientData, policyData }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.client) setClients((prev) => [data.client, ...prev]);
        if (data.policy) setPolicies((prev) => [data.policy, ...prev]);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
        );
        fetchSharedData();
        showToast('Lead successfully converted to Active Client!', 'success');
        return;
      }
    } catch {
      // fallback
    }

    // Local fallback logic
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const newClientId = `c-${Date.now()}`;
    const newClient: Client = {
      id: newClientId,
      name: clientData?.name || lead.name,
      phone: clientData?.phone || lead.phone,
      email: clientData?.email || lead.email || '',
      city: clientData?.city || lead.city,
      address: clientData?.address || `${lead.city}, India`,
      source: lead.source,
      notes: clientData?.notes || `Converted from website lead. Enquiry: ${lead.product_interest}`,
      created_at: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
    );
    showToast('Lead converted to Client.', 'success');
  };

  // 4. Add Client
  const addClient = async (
    clientInput: Omit<Client, 'id' | 'created_at'>,
    initialPolicy?: Omit<Policy, 'id' | 'client_id'>
  ): Promise<Client> => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ client: clientInput, initialPolicy }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchSharedData();
        showToast(`Client "${data.client.name}" created centrally.`, 'success');
        return data.client;
      }
    } catch {
      // fallback
    }

    const newId = `c-${Date.now()}`;
    const newClient: Client = {
      ...clientInput,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client "${newClient.name}" created.`, 'success');
    return newClient;
  };

  // 5. Update Client
  const updateClient = async (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    try {
      await fetch(`/api/clients/${updated.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
    } catch {
      // ignore
    }
    showToast('Client details updated.', 'success');
  };

  // 6. Delete Client (Advisor only)
  const deleteClient = async (clientId: string) => {
    if (currentRole === 'Staff') {
      showToast('Action forbidden: Staff accounts cannot delete clients.', 'error');
      return;
    }

    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setPolicies((prev) => prev.filter((p) => p.client_id !== clientId));
    setTimeline((prev) => prev.filter((t) => t.client_id !== clientId));

    try {
      await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
    showToast('Client removed.', 'info');
  };

  // 7. Add Policy
  const addPolicy = async (policyInput: Omit<Policy, 'id'>): Promise<Policy> => {
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(policyInput),
      });
      if (res.ok) {
        const data = await res.json();
        fetchSharedData();
        showToast(`Policy ${data.policy.policy_number} saved centrally.`, 'success');
        return data.policy;
      }
    } catch {
      // fallback
    }

    const newPolicy: Policy = {
      ...policyInput,
      id: `pol-${Date.now()}`,
    };
    setPolicies((prev) => [newPolicy, ...prev]);
    showToast(`Policy ${newPolicy.policy_number} saved.`, 'success');
    return newPolicy;
  };

  // 8. Update Policy Status
  const updatePolicyStatus = async (policyId: string, status: PolicyStatus) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, status } : p))
    );

    try {
      await fetch(`/api/policies/${policyId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
    } catch {
      // ignore
    }
    showToast(`Policy marked as "${status}"`, 'success');
  };

  // 9. Delete Policy (Advisor only)
  const deletePolicy = async (policyId: string) => {
    if (currentRole === 'Staff') {
      showToast('Action forbidden: Staff accounts cannot delete policies.', 'error');
      return;
    }

    setPolicies((prev) => prev.filter((p) => p.id !== policyId));
    try {
      await fetch(`/api/policies/${policyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
    showToast('Policy deleted.', 'info');
  };

  // 10. Log Interaction
  const logInteraction = async (entry: Omit<TimelineEntry, 'id' | 'created_at'>) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: `time-${Date.now()}`,
      created_at: 'Just now',
    };
    setTimeline((prev) => [newEntry, ...prev]);

    try {
      await fetch('/api/timeline', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(entry),
      });
    } catch {
      // ignore
    }
  };

  // 11. Quick Log Call Outcome
  const quickLogCallOutcome = async (policyId: string, outcome: string, noteText?: string) => {
    const pol = policies.find((p) => p.id === policyId);
    if (!pol) return;

    await logCallOutcome(pol.client_id, outcome as CallOutcome, noteText, policyId, undefined, outcome === 'Paid');
  };

  // 12. Full Call Outcome Logger
  const logCallOutcome = async (
    clientId: string,
    outcome: CallOutcome,
    notes?: string,
    policyId?: string,
    followUpDate?: string,
    markPaid?: boolean
  ) => {
    const client = clients.find((c) => c.id === clientId);

    const newLog: CallLog = {
      id: `log-${Date.now()}`,
      client_id: clientId,
      client_name: client?.name || 'Client',
      policy_id: policyId,
      outcome,
      notes,
      follow_up_date: followUpDate,
      created_by: currentUser?.name || 'Advisor',
      created_at: 'Just now',
    };
    setCallLogs((prev) => [newLog, ...prev]);

    if (markPaid && policyId) {
      setPolicies((prev) => prev.map((p) => (p.id === policyId ? { ...p, status: 'Paid' } : p)));
    } else if (outcome === 'Paid' && policyId) {
      setPolicies((prev) => prev.map((p) => (p.id === policyId ? { ...p, status: 'Paid' } : p)));
    }

    try {
      await fetch('/api/calls', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          clientId,
          outcome,
          notes,
          policyId,
          followUpDate,
          markPaid,
        }),
      });
    } catch {
      // local fallback already populated
    }

    showToast(`Call logged: ${outcome}`, 'success');
  };

  // 13. Automation Rules (Advisor only)
  const toggleAutomationRule = async (ruleId: string) => {
    if (currentRole === 'Staff') {
      showToast('Restricted: Staff accounts cannot alter automation rules.', 'error');
      return;
    }

    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );

    try {
      await fetch(`/api/rules/${ruleId}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
  };

  const updateAutomationRule = (updated: AutomationRule) => {
    if (currentRole === 'Staff') {
      showToast('Restricted: Staff accounts cannot alter automation rules.', 'error');
      return;
    }
    setAutomationRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  // 14. Run Nightly Automation Batch
  const executeNightlyAutomation = async (): Promise<{ sentCount: number; logs: string[] }> => {
    try {
      const res = await fetch('/api/automation/run', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        fetchSharedData();
        showToast(`Nightly automation finished: ${data.sentCount} reminders triggered.`, 'success');
        return data;
      }
    } catch {
      // fallback
    }

    showToast('Automation job ran locally.', 'info');
    return { sentCount: 0, logs: ['Job executed locally.'] };
  };

  // 15. Update Advisor Profile (Advisor only)
  const updateAdvisorProfile = async (profile: AdvisorProfile) => {
    if (currentRole === 'Staff') {
      showToast('Restricted: Staff accounts cannot change advisor settings.', 'error');
      return;
    }

    setAdvisorProfile(profile);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profile),
      });
    } catch {
      // ignore
    }
    showToast('Advisor profile updated centrally.', 'success');
  };

  // 16. Mark Notifications Read
  const markNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // 17. Reset Demo Data
  const resetAllData = async () => {
    if (currentRole === 'Staff') {
      showToast('Restricted: Only Senior Advisor can reset demo data.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchSharedData();
        showToast('Central database reset to initial demo state.', 'info');
        return;
      }
    } catch {
      // fallback
    }

    setClients(initialClients);
    setPolicies(initialPolicies);
    setLeads(initialLeads);
    setTimeline(initialTimeline);
    setAutomationRules(initialAutomationRules);
    setAdvisorProfile(initialAdvisorProfile);
    setStaffMembers(initialStaffMembers);
    showToast('Demo data restored locally.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        crmTab,
        setCrmTab,
        currentRole,
        setCurrentRole,
        selectedClientId,
        setSelectedClientId,

        // Auth
        currentUser,
        authToken,
        isAuthenticated: !!currentUser,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        requestCrmAccess,

        // Data
        clients,
        policies,
        leads,
        timeline,
        automationRules,
        templates,
        whatsappTemplates: templates.map((t) => ({
          ...t,
          body: t.content,
          timing: t.category === 'UTILITY' ? 'Renewal Reminder' : 'Post-Payment',
        })),
        callLogs,
        advisorProfile,
        staffMembers,
        notifications,
        unreadNotificationCount,

        // Modals
        isLeadModalOpen,
        leadModalProduct,
        openLeadModal,
        closeLeadModal,

        activeCallClient: activeCallClient?.client || activeCallClient || null,
        activeCallPolicy: activeCallClient?.policy || null,
        openCallLogger,
        closeCallLogger,

        activeWhatsAppPayload,
        activeWhatsAppClient: activeWhatsAppPayload?.client || null,
        activeWhatsAppPolicy: activeWhatsAppPayload?.policy || null,
        openWhatsAppSender,
        closeWhatsAppSender,

        // Actions
        addLead,
        updateLeadStatus,
        convertLeadToClient,

        addClient,
        updateClient,
        deleteClient,

        addPolicy,
        updatePolicyStatus,
        deletePolicy,

        logInteraction,
        quickLogCallOutcome,
        logCallOutcome,

        toggleAutomationRule,
        updateAutomationRule,
        executeNightlyAutomation,

        updateAdvisorProfile,
        markNotificationsAsRead,

        toasts,
        toast: toasts.length > 0 ? toasts[toasts.length - 1] : null,
        hideToast: () => setToasts([]),
        showToast,
        dismissToast,

        searchQuery,
        setSearchQuery,

        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
