export type ClientSource = 'Website' | 'Referral' | 'Manual' | 'Calculator';

export type PolicyStatus = 'Active' | 'Paid' | 'Pending' | 'Overdue' | 'Lapsed' | 'Matured';

export type PremiumFrequency = 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annual';

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Not Interested';

export type UserRole = 'Advisor' | 'Staff';

export type CallOutcome =
  | 'Spoke - Will Pay'
  | 'Paid'
  | 'Callback Requested'
  | 'Not Reachable'
  | 'Wrong Number'
  | 'Other';

export interface CallLog {
  id: string;
  client_id: string;
  client_name?: string;
  policy_id?: string;
  outcome: CallOutcome;
  notes?: string;
  follow_up_date?: string;
  created_by: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  source: ClientSource;
  notes?: string;
  created_at: string;
}

export interface Policy {
  id: string;
  client_id: string;
  client_name?: string;
  client_phone?: string;
  insurer: string;
  policy_number: string;
  plan_type: string;
  premium_amount: number;
  frequency: PremiumFrequency;
  start_date: string;
  due_date: string;
  status: PolicyStatus;
  sum_assured?: number;
  commission_rate?: number; // percentage e.g. 5% renewal, 25% first year
  grace_period_end?: string;
}

export interface TimelineEntry {
  id: string;
  client_id: string;
  policy_id?: string;
  type: 'call' | 'message' | 'note' | 'status_change';
  content: string;
  created_by: string;
  created_at: string;
  channel?: 'Phone' | 'WhatsApp' | 'System';
  outcome?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  product_interest: string;
  preferred_time?: string;
  message?: string;
  source: 'Website' | 'Calculator';
  status: LeadStatus;
  submitted_at: string;
  notes?: string;
  sum_assured_estimate?: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  name?: string;
  trigger_type: 'before_due' | 'on_due' | 'after_due' | 'after_paid';
  trigger?: string;
  offset_days: number; // e.g., -7, -1, 0, 1, 3, 7
  days_offset?: number;
  channel: 'WhatsApp' | 'SMS';
  template_id: string;
  template_name: string;
  active: boolean;
  description: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'UTILITY' | 'TRANSACTIONAL';
  language: string;
  content: string;
  body?: string;
  timing?: string;
  status: 'Approved' | 'Pending Review';
}

export interface AdvisorProfile {
  name: string;
  title: string;
  agency: string;
  branch?: string;
  license_no: string;
  phone: string;
  whatsapp: string;
  email: string;
  experience_years: number;
  clients_served: number;
  claims_settled_ratio: number;
  office_address: string;
  business_hours: string;
  bio: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active?: boolean;
  created_at?: string;
}

export type StaffUser = StaffMember;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'due' | 'overdue' | 'system';
  created_at: string;
  read: boolean;
  link_tab?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
}
