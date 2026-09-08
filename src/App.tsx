import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicWebsite } from './components/public/PublicWebsite';
import { CrmApp } from './components/crm/CrmApp';
import { LoginModal } from './components/auth/LoginModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { mode, toast, hideToast, isLoginModalOpen, closeLoginModal, currentUser, setMode } = useApp();

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-slate-900">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold max-w-sm ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={hideToast}
              className="text-slate-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Login Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen || (mode === 'crm' && !currentUser)}
        onClose={() => {
          closeLoginModal();
          if (mode === 'crm' && !currentUser) {
            setMode('public');
          }
        }}
      />

      {/* Mode View Switcher: CRM requires authenticated user */}
      {mode === 'crm' && currentUser ? <CrmApp /> : <PublicWebsite />}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
