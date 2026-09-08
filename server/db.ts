import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  initialClients,
  initialPolicies,
  initialLeads,
  initialTimeline,
  initialAutomationRules,
  initialWhatsAppTemplates,
  initialAdvisorProfile,
  initialStaffMembers,
} from '../src/data/initialData';
import {
  Client,
  Policy,
  Lead,
  TimelineEntry,
  CallLog,
  AutomationRule,
  WhatsAppTemplate,
  AdvisorProfile,
  StaffMember,
  NotificationItem,
  UserRole,
  PolicyStatus,
  LeadStatus,
  CallOutcome,
} from '../src/types';

export interface DbUser {
  id: string;
  email: string;
  password: string; // Stored securely as bcrypt hash
  name: string;
  role: UserRole;
  phone: string;
}

export interface DatabaseSchema {
  users: DbUser[];
  clients: Client[];
  policies: Policy[];
  leads: Lead[];
  timeline: TimelineEntry[];
  callLogs: CallLog[];
  automationRules: AutomationRule[];
  templates: WhatsAppTemplate[];
  advisorProfile: AdvisorProfile;
  staffMembers: StaffMember[];
  notifications: NotificationItem[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'insurecare.db.json');

// Bcrypt hashes for default seed accounts ('advisor123' and 'staff123')
export const DEFAULT_ADVISOR_PASSWORD_HASH = '$2b$10$uW3Whr6KiWdW/1VpZX8.YeJVsooXi9JdSkw8YmW3rloshP0Q4yA3C';
export const DEFAULT_STAFF_PASSWORD_HASH = '$2b$10$U3V8nozSetVAGx21iXyiCOCWySYUKFv4P5VhNT/culAl9to9bs5yC';

const defaultUsers: DbUser[] = [
  {
    id: 'usr-adv-1',
    email: 'abushayedali100@gmail.com',
    password: DEFAULT_ADVISOR_PASSWORD_HASH,
    name: 'Abushayed Ali',
    role: 'Advisor',
    phone: '+91 96788 97752',
  },
  {
    id: 'usr-adv-2',
    email: 'advisor@lic.in',
    password: DEFAULT_ADVISOR_PASSWORD_HASH,
    name: 'Abushayed Ali',
    role: 'Advisor',
    phone: '+91 96788 97752',
  },
  {
    id: 'usr-adv-3',
    email: 'abushayed.ali@insuranceadvisor.in',
    password: DEFAULT_ADVISOR_PASSWORD_HASH,
    name: 'Abushayed Ali',
    role: 'Advisor',
    phone: '+91 96788 97752',
  },
  {
    id: 'usr-staff-1',
    email: 'staff@lic.in',
    password: DEFAULT_STAFF_PASSWORD_HASH,
    name: 'Pooja Verma',
    role: 'Staff',
    phone: '+91 98200 44321',
  },
  {
    id: 'usr-staff-2',
    email: 'pooja.verma@insuranceadvisor.in',
    password: DEFAULT_STAFF_PASSWORD_HASH,
    name: 'Pooja Verma',
    role: 'Staff',
    phone: '+91 98200 44321',
  },
];

const defaultCallLogs: CallLog[] = [
  {
    id: 'log-1',
    client_id: 'c-1',
    client_name: 'Rajesh Verma',
    policy_id: 'pol-1',
    outcome: 'Spoke - Will Pay',
    notes: 'Promised to make RTGS payment on Friday after salary credit.',
    follow_up_date: '2026-09-12',
    created_by: 'Abushayed Ali',
    created_at: 'Yesterday, 11:30 AM',
  },
  {
    id: 'log-2',
    client_id: 'c-3',
    client_name: 'Dr. Vikram Malhotra',
    policy_id: 'pol-3',
    outcome: 'Not Reachable',
    notes: 'Phone rang with no response. Left WhatsApp notice.',
    follow_up_date: '2026-09-08',
    created_by: 'Pooja Verma',
    created_at: 'Yesterday, 03:15 PM',
  },
  {
    id: 'log-3',
    client_id: 'c-7',
    client_name: 'Priya Iyer',
    policy_id: 'pol-7',
    outcome: 'Paid',
    notes: 'Payment of ₹2,50,000 received via Netbanking.',
    created_by: 'Abushayed Ali',
    created_at: 'Aug 22, 2026',
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Lead: Siddharth Rao',
    message: 'Term Insurance (1 Cr Cover) - Mumbai (Tel: +91 98198 76543)',
    type: 'lead',
    created_at: 'Today, 10:15 AM',
    read: false,
    link_tab: 'leads',
  },
  {
    id: 'notif-2',
    title: 'Policy Overdue Alert',
    message: 'Rajesh Verma (LIC-883492019) ₹48,500 is overdue by 4 days.',
    type: 'overdue',
    created_at: 'Today, 08:00 AM',
    read: false,
    link_tab: 'overdue',
  },
];

let cachedDb: DatabaseSchema | null = null;

function getInitialDb(): DatabaseSchema {
  return {
    users: defaultUsers,
    clients: initialClients,
    policies: initialPolicies,
    leads: initialLeads,
    timeline: initialTimeline,
    callLogs: defaultCallLogs,
    automationRules: initialAutomationRules,
    templates: initialWhatsAppTemplates,
    advisorProfile: initialAdvisorProfile,
    staffMembers: initialStaffMembers,
    notifications: initialNotifications,
  };
}

export function initDb(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(raw);
      // Ensure users exists
      if (!cachedDb?.users || cachedDb.users.length === 0) {
        cachedDb!.users = defaultUsers;
        saveDb();
      } else {
        // Automatically migrate any legacy plain text passwords to bcrypt hashes
        let migrated = false;
        cachedDb.users.forEach((u) => {
          if (!u.password.startsWith('$2a$') && !u.password.startsWith('$2b$') && !u.password.startsWith('$2y$')) {
            u.password = bcrypt.hashSync(u.password, 10);
            migrated = true;
          }
          if (u.name === 'Ramesh Sharma') {
            u.name = 'Abushayed Ali';
            migrated = true;
          }
        });

        // Ensure Abushayed Ali with Mirza Branch, updated email, phone and address in advisor profile
        if (cachedDb.advisorProfile) {
          cachedDb.advisorProfile.name = 'Abushayed Ali';
          cachedDb.advisorProfile.agency = 'Life Insurance Corporation of India (Mirza Branch)';
          cachedDb.advisorProfile.branch = 'Mirza Branch';
          cachedDb.advisorProfile.email = 'abushayedali100@gmail.com';
          cachedDb.advisorProfile.office_address = 'Kachumara, Barpeta District, Assam – 781127';
          cachedDb.advisorProfile.phone = '+91 96788 97752';
          cachedDb.advisorProfile.whatsapp = '+91 96788 97752';
          cachedDb.advisorProfile.bio = 'Helping over 1,400+ Indian families achieve guaranteed financial security, tax-efficient retirement, and seamless death claim settlements for over 16 years. Authorized representative for Life Insurance Corporation of India (Mirza Branch).';
          migrated = true;
        }
        if (cachedDb.staffMembers) {
          cachedDb.staffMembers.forEach((sm) => {
            if (sm.name === 'Ramesh Sharma' || sm.name === 'Abushayed Ali') {
              sm.name = 'Abushayed Ali';
              sm.email = 'abushayedali100@gmail.com';
              sm.phone = '+91 96788 97752';
              migrated = true;
            }
          });
        }
        // Ensure user accounts include abushayedali100@gmail.com and phone 9678897752
        cachedDb.users.forEach((u) => {
          if (u.name === 'Abushayed Ali' || u.name === 'Ramesh Sharma') {
            u.name = 'Abushayed Ali';
            u.phone = '+91 96788 97752';
            migrated = true;
          }
        });
        if (!cachedDb.users.some(u => u.email === 'abushayedali100@gmail.com')) {
          cachedDb.users.unshift({
            id: 'usr-adv-primary',
            email: 'abushayedali100@gmail.com',
            password: DEFAULT_ADVISOR_PASSWORD_HASH,
            name: 'Abushayed Ali',
            role: 'Advisor',
            phone: '+91 96788 97752',
          });
          migrated = true;
        }
        // Update any old timeline or calllogs entries
        if (cachedDb.timeline) {
          cachedDb.timeline.forEach((t) => {
            if (t.created_by === 'Ramesh Sharma') {
              t.created_by = 'Abushayed Ali';
              migrated = true;
            }
          });
        }
        if (cachedDb.callLogs) {
          cachedDb.callLogs.forEach((cl) => {
            if (cl.created_by === 'Ramesh Sharma') {
              cl.created_by = 'Abushayed Ali';
              migrated = true;
            }
          });
        }
        // Check if policies still have old plan names and migrate
        if (cachedDb.policies && cachedDb.policies.some((p) => p.plan_type.includes('Jeevan Labh') || p.plan_type.includes('Click 2 Protect') || p.plan_type.includes('Jeevan Tarun'))) {
          cachedDb.policies = initialPolicies;
          cachedDb.leads = initialLeads;
          cachedDb.timeline = initialTimeline;
          migrated = true;
        }

        if (migrated) {
          saveDb();
        }
      }
      return cachedDb!;
    }
  } catch (err) {
    console.error('Error reading DB file, using default seed:', err);
  }

  cachedDb = getInitialDb();
  saveDb();
  return cachedDb;
}

function saveDb(): void {
  if (!cachedDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(cachedDb, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to persist DB to disk:', err);
  }
}

export const db = {
  get: (): DatabaseSchema => {
    return initDb();
  },

  findUser: (email: string, pass: string): DbUser | undefined => {
    const data = initDb();
    const cleanEmail = email.trim().toLowerCase();
    const user = data.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) return undefined;

    // Secure bcrypt hash comparison
    try {
      if (bcrypt.compareSync(pass, user.password)) {
        return user;
      }
    } catch (err) {
      console.error('Password hash comparison error:', err);
    }

    // Resilience fallback: if password was still plain text, compare, upgrade to hash and save
    if (user.password === pass) {
      user.password = bcrypt.hashSync(pass, 10);
      saveDb();
      return user;
    }

    return undefined;
  },

  findUserById: (id: string): DbUser | undefined => {
    const data = initDb();
    return data.users.find((u) => u.id === id);
  },

  addLead: (leadInput: Omit<Lead, 'id' | 'submitted_at' | 'status'>): Lead => {
    const data = initDb();
    const newLead: Lead = {
      ...leadInput,
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'New',
      submitted_at: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' Today',
    };

    data.leads.unshift(newLead);

    // Create Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Lead: ${newLead.name}`,
      message: `${newLead.product_interest} (${newLead.city}) - Tel: ${newLead.phone}`,
      type: 'lead',
      created_at: 'Just now',
      read: false,
      link_tab: 'leads',
    };
    data.notifications.unshift(notif);

    saveDb();
    return newLead;
  },

  updateLeadStatus: (leadId: string, status: LeadStatus, notes?: string): Lead | null => {
    const data = initDb();
    const lead = data.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    saveDb();
    return lead;
  },

  convertLeadToClient: (
    leadId: string,
    clientData?: Partial<Client>,
    policyData?: Partial<Policy>,
    actorName: string = 'Advisor'
  ): { client: Client; policy?: Policy } | null => {
    const data = initDb();
    const lead = data.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    lead.status = 'Converted';

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

    data.clients.unshift(newClient);

    let newPolicy: Policy | undefined;
    if (policyData && policyData.insurer && policyData.policy_number) {
      newPolicy = {
        id: `pol-${Date.now()}`,
        client_id: newClientId,
        client_name: newClient.name,
        client_phone: newClient.phone,
        insurer: policyData.insurer,
        policy_number: policyData.policy_number,
        plan_type: policyData.plan_type || lead.product_interest,
        premium_amount: Number(policyData.premium_amount) || 25000,
        frequency: policyData.frequency || 'Annual',
        start_date: policyData.start_date || new Date().toISOString().split('T')[0],
        due_date: policyData.due_date || new Date().toISOString().split('T')[0],
        status: policyData.status || 'Active',
        sum_assured: policyData.sum_assured || 1000000,
        commission_rate: policyData.commission_rate || 10,
      };
      data.policies.unshift(newPolicy);
    }

    const timelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      client_id: newClientId,
      type: 'note',
      content: `Lead converted to client. Source: ${lead.source}. Initial enquiry: ${lead.product_interest}.`,
      created_by: actorName,
      created_at: 'Just now',
      channel: 'System',
    };
    data.timeline.unshift(timelineEntry);

    saveDb();
    return { client: newClient, policy: newPolicy };
  },

  addClient: (
    clientData: Omit<Client, 'id' | 'created_at'>,
    initialPolicy?: Omit<Policy, 'id' | 'client_id'>,
    actorName: string = 'Advisor'
  ): Client => {
    const data = initDb();
    const newClientId = `c-${Date.now()}`;
    const newClient: Client = {
      ...clientData,
      id: newClientId,
      created_at: new Date().toISOString().split('T')[0],
    };

    data.clients.unshift(newClient);

    if (initialPolicy && initialPolicy.policy_number) {
      const newPolicy: Policy = {
        ...initialPolicy,
        id: `pol-${Date.now()}`,
        client_id: newClientId,
        client_name: newClient.name,
        client_phone: newClient.phone,
      };
      data.policies.unshift(newPolicy);
    }

    const timelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      client_id: newClientId,
      type: 'note',
      content: `Client created manually. Source: ${newClient.source}.`,
      created_by: actorName,
      created_at: 'Just now',
      channel: 'System',
    };
    data.timeline.unshift(timelineEntry);

    saveDb();
    return newClient;
  },

  updateClient: (updated: Client): Client => {
    const data = initDb();
    data.clients = data.clients.map((c) => (c.id === updated.id ? updated : c));
    data.policies = data.policies.map((p) =>
      p.client_id === updated.id ? { ...p, client_name: updated.name, client_phone: updated.phone } : p
    );
    saveDb();
    return updated;
  },

  deleteClient: (clientId: string): boolean => {
    const data = initDb();
    data.clients = data.clients.filter((c) => c.id !== clientId);
    data.policies = data.policies.filter((p) => p.client_id !== clientId);
    data.timeline = data.timeline.filter((t) => t.client_id !== clientId);
    saveDb();
    return true;
  },

  addPolicy: (policyData: Omit<Policy, 'id'>, actorName: string = 'Advisor'): Policy => {
    const data = initDb();
    const newPolicy: Policy = {
      ...policyData,
      id: `pol-${Date.now()}`,
    };
    data.policies.unshift(newPolicy);

    const timelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      client_id: newPolicy.client_id,
      policy_id: newPolicy.id,
      type: 'note',
      content: `New policy added: ${newPolicy.insurer} - ${newPolicy.plan_type} (No. ${newPolicy.policy_number}), Premium: ₹${newPolicy.premium_amount.toLocaleString('en-IN')}`,
      created_by: actorName,
      created_at: 'Just now',
      channel: 'System',
    };
    data.timeline.unshift(timelineEntry);

    saveDb();
    return newPolicy;
  },

  updatePolicyStatus: (
    policyId: string,
    status: PolicyStatus,
    actorName: string = 'Advisor'
  ): Policy | null => {
    const data = initDb();
    const policy = data.policies.find((p) => p.id === policyId);
    if (!policy) return null;

    policy.status = status;

    const timelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      client_id: policy.client_id,
      policy_id: policy.id,
      type: 'status_change',
      content: `Policy ${policy.policy_number} status updated to "${status}".`,
      created_by: actorName,
      created_at: 'Just now',
      channel: 'System',
      outcome: status,
    };
    data.timeline.unshift(timelineEntry);

    saveDb();
    return policy;
  },

  deletePolicy: (policyId: string): boolean => {
    const data = initDb();
    data.policies = data.policies.filter((p) => p.id !== policyId);
    saveDb();
    return true;
  },

  logCall: (
    clientId: string,
    outcome: CallOutcome,
    notes?: string,
    policyId?: string,
    followUpDate?: string,
    markPaid?: boolean,
    actorName: string = 'Advisor'
  ): CallLog => {
    const data = initDb();
    const client = data.clients.find((c) => c.id === clientId);

    const newLog: CallLog = {
      id: `log-${Date.now()}`,
      client_id: clientId,
      client_name: client?.name || 'Client',
      policy_id: policyId,
      outcome,
      notes,
      follow_up_date: followUpDate,
      created_by: actorName,
      created_at: 'Just now',
    };
    data.callLogs.unshift(newLog);

    const content = notes
      ? `Call outcome: [${outcome}]. Note: "${notes}"`
      : `Call outcome logged: [${outcome}]`;

    const timelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      client_id: clientId,
      policy_id: policyId,
      type: 'call',
      content,
      created_by: actorName,
      created_at: 'Just now',
      channel: 'Phone',
      outcome,
    };
    data.timeline.unshift(timelineEntry);

    if (markPaid && policyId) {
      const pol = data.policies.find((p) => p.id === policyId);
      if (pol) pol.status = 'Paid';
    } else if (outcome === 'Paid' && policyId) {
      const pol = data.policies.find((p) => p.id === policyId);
      if (pol) pol.status = 'Paid';
    }

    saveDb();
    return newLog;
  },

  logTimeline: (entry: Omit<TimelineEntry, 'id' | 'created_at'>): TimelineEntry => {
    const data = initDb();
    const newEntry: TimelineEntry = {
      ...entry,
      id: `time-${Date.now()}`,
      created_at: 'Just now',
    };
    data.timeline.unshift(newEntry);
    saveDb();
    return newEntry;
  },

  toggleRule: (ruleId: string): AutomationRule | null => {
    const data = initDb();
    const rule = data.automationRules.find((r) => r.id === ruleId);
    if (!rule) return null;
    rule.active = !rule.active;
    saveDb();
    return rule;
  },

  executeAutomation: (): { sentCount: number; logs: string[] } => {
    const data = initDb();
    let sentCount = 0;
    const logs: string[] = [];
    const today = new Date();

    const activeRules = data.automationRules.filter((r) => r.active);

    data.policies.forEach((policy) => {
      if (policy.status === 'Lapsed' || policy.status === 'Matured') return;

      const dueDate = new Date(policy.due_date);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      activeRules.forEach((rule) => {
        let isMatch = false;
        const offset = rule.offset_days !== undefined ? rule.offset_days : rule.days_offset || 0;

        if (rule.trigger_type === 'before_due' && diffDays === Math.abs(offset)) {
          isMatch = true;
        } else if (rule.trigger_type === 'on_due' && diffDays === 0 && policy.status !== 'Paid') {
          isMatch = true;
        } else if (rule.trigger_type === 'after_due' && diffDays === -offset && policy.status !== 'Paid') {
          isMatch = true;
        }

        if (isMatch) {
          sentCount++;
          const clientName = policy.client_name || 'Valued Client';
          const logMsg = `Automated ${rule.channel} sent to ${clientName} for Policy ${policy.policy_number} (${rule.title || rule.name})`;
          logs.push(logMsg);

          const newEntry: TimelineEntry = {
            id: `time-auto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            client_id: policy.client_id,
            policy_id: policy.id,
            type: 'message',
            content: `${logMsg}. Template: ${rule.template_name}`,
            created_by: 'Nightly Automation Bot',
            created_at: 'Just now (Nightly Run)',
            channel: rule.channel === 'WhatsApp' ? 'WhatsApp' : 'System',
          };
          data.timeline.unshift(newEntry);
        }
      });
    });

    if (sentCount === 0) {
      logs.push('All policies evaluated. No matching triggers for current date offsets.');
    }

    saveDb();
    return { sentCount, logs };
  },

  updateAdvisorProfile: (profile: AdvisorProfile): AdvisorProfile => {
    const data = initDb();
    data.advisorProfile = profile;
    saveDb();
    return profile;
  },

  markNotificationsRead: (): boolean => {
    const data = initDb();
    data.notifications = data.notifications.map((n) => ({ ...n, read: true }));
    saveDb();
    return true;
  },

  resetData: (): DatabaseSchema => {
    cachedDb = getInitialDb();
    saveDb();
    return cachedDb;
  },
};
