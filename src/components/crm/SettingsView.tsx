import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdvisorProfile, StaffUser } from '../../types';
import {
  Settings,
  Shield,
  User,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Building,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    advisorProfile,
    updateAdvisorProfile,
    whatsappTemplates,
    currentRole,
    showToast,
  } = useApp();

  const [profile, setProfile] = useState<AdvisorProfile>(advisorProfile);

  // Staff list state
  const [staffList, setStaffList] = useState<StaffUser[]>([
    {
      id: 'staff-1',
      name: 'Pooja Verma',
      email: 'pooja.verma@insuranceadvisor.in',
      phone: '+91 98200 44321',
      role: 'Staff',
      created_at: '2025-10-15',
    },
    {
      id: 'staff-2',
      name: `${advisorProfile.name} (Self)`,
      email: advisorProfile.email,
      phone: advisorProfile.phone,
      role: 'Advisor',
      created_at: '2024-01-01',
    },
  ]);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdvisorProfile(profile);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPhone) return;

    const newMember: StaffUser = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      phone: newStaffPhone,
      email: newStaffEmail,
      role: 'Staff',
      created_at: new Date().toISOString().split('T')[0],
    };

    setStaffList([...staffList, newMember]);
    setNewStaffName('');
    setNewStaffPhone('');
    setNewStaffEmail('');
    showToast('Staff account created with calling & logging access', 'success');
  };

  const handleRemoveStaff = (id: string) => {
    setStaffList(staffList.filter((s) => s.id !== id));
    showToast('Staff member removed', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-700" />
          System Settings & Advisory Configuration
        </h2>
        <p className="text-xs text-slate-500">
          Manage IRDAI credentials, staff permissions, WhatsApp messaging templates, and automated scheduling
        </p>
      </div>

      {/* Section 1: Advisor Profile & IRDAI License */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-900">
            Advisor IRDAI Profile & Public Credentials
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Advisor Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                IRDAI Registration / License Number
              </label>
              <input
                type="text"
                value={profile.license_no}
                onChange={(e) => setProfile({ ...profile, license_no: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Mobile Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Branch Name</label>
              <input
                type="text"
                value={profile.branch || 'Mirza Branch'}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Agency & Authorized Insurer</label>
              <input
                type="text"
                value={profile.agency}
                onChange={(e) => setProfile({ ...profile, agency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Office Physical Address</label>
              <input
                type="text"
                value={profile.office_address}
                onChange={(e) => setProfile({ ...profile, office_address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Staff Accounts & RBAC */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Staff Access & Permissions</h3>
              <p className="text-xs text-slate-500">
                Manage team accounts. Staff role can log calls and add clients, but cannot delete records or export data.
              </p>
            </div>
          </div>
        </div>

        {/* Existing staff list */}
        <div className="space-y-2">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{member.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.role === 'Advisor'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {member.phone} • {member.email || 'No email'} • Joined: {member.created_at}
                </div>
              </div>

              {member.role !== 'Advisor' && (
                <button
                  onClick={() => handleRemoveStaff(member.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  title="Remove staff member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Staff Form */}
        <form onSubmit={handleAddStaff} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-800">Add New Staff Member:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Staff Name"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg outline-hidden"
            />
            <input
              type="tel"
              required
              placeholder="Phone (+91 98XXX XXXXX)"
              value={newStaffPhone}
              onChange={(e) => setNewStaffPhone(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg outline-hidden"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={newStaffEmail}
              onChange={(e) => setNewStaffEmail(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg outline-hidden"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: WhatsApp Templates Catalog */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Approved WhatsApp Business Message Templates
            </h3>
            <p className="text-xs text-slate-500">
              Pre-formatted transactional messages with automated variable replacements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatsappTemplates.map((tpl) => (
            <div key={tpl.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{tpl.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {tpl.timing}
                </span>
              </div>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-slate-200/60 font-sans">
                {tpl.body}
              </p>
              <div className="text-[10px] text-slate-400 font-mono">Template ID: {tpl.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
