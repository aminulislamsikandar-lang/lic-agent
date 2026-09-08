import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Globe,
  User,
  Shield,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  LogOut,
} from 'lucide-react';

export const CrmHeader: React.FC = () => {
  const {
    setMode,
    advisorProfile,
    currentRole,
    setCurrentRole,
    currentUser,
    logout,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    executeNightlyAutomation,
    setCrmTab,
    searchQuery,
    setSearchQuery,
    resetAllData,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, phone, or policy #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Test Nightly Job Runner Button */}
        <button
          onClick={() => executeNightlyAutomation()}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
          title="Run background scheduler now to check due dates and trigger automated reminders"
        >
          <Play className="w-3.5 h-3.5 text-blue-600" />
          <span>Run Nightly Automation</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              if (!notifDropdownOpen) markNotificationsAsRead();
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-700" />
                  Notifications & Dues ({notifications.length})
                </div>
                <button
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link_tab) setCrmTab(n.link_tab as any);
                        setNotifDropdownOpen(false);
                      }}
                      className="p-2.5 hover:bg-blue-50/60 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Public Website Switcher */}
        <button
          onClick={() => setMode('public')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          title="Open Public Website view"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">View Public Website</span>
          <span className="sm:hidden">Website</span>
        </button>

        {/* Profile & Role Selector */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
              {currentRole === 'Advisor' ? 'AA' : 'ST'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentRole === 'Advisor' ? advisorProfile.name : 'Staff Member'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentRole} Access
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
              <div className="p-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{currentUser?.name || advisorProfile.name}</div>
                <div className="text-slate-500 text-[11px] font-mono">{currentUser?.email || advisorProfile.email}</div>
                <div className="mt-1">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    currentRole === 'Advisor' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentRole} Role
                  </span>
                </div>
              </div>

              <div className="py-2">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  Switch Active Role (RBAC):
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('Advisor');
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between ${
                    currentRole === 'Advisor' ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Advisor (Admin - Full Control)</span>
                  {currentRole === 'Advisor' && <CheckCircle className="w-3.5 h-3.5 text-blue-700" />}
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('Staff');
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between ${
                    currentRole === 'Staff' ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Staff (Calls & Entry Only)</span>
                  {currentRole === 'Staff' && <CheckCircle className="w-3.5 h-3.5 text-blue-700" />}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                {currentRole === 'Advisor' && (
                  <button
                    onClick={() => {
                      resetAllData();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-slate-600 hover:text-rose-600 flex items-center gap-1.5 rounded-md hover:bg-rose-50 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-2 py-1.5 text-rose-700 hover:text-rose-800 flex items-center gap-1.5 rounded-md hover:bg-rose-50 font-semibold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of CRM</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
