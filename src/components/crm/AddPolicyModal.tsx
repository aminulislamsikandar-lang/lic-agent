import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PremiumFrequency, PolicyStatus } from '../../types';
import { X, FilePlus, Shield } from 'lucide-react';

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClientId?: string;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({
  isOpen,
  onClose,
  preselectedClientId,
}) => {
  const { clients, addPolicy } = useApp();

  const [clientId, setClientId] = useState(preselectedClientId || (clients[0] ? clients[0].id : ''));
  const [insurer, setInsurer] = useState('LIC of India');
  const [policyNumber, setPolicyNumber] = useState('');
  const [planType, setPlanType] = useState('Endowment (Jeevan Labh - T936)');
  const [premiumAmount, setPremiumAmount] = useState<number>(28000);
  const [frequency, setFrequency] = useState<PremiumFrequency>('Annual');
  const [sumAssured, setSumAssured] = useState<number>(1000000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<PolicyStatus>('Pending');
  const [commissionRate, setCommissionRate] = useState<number>(7.5);

  React.useEffect(() => {
    if (preselectedClientId) {
      setClientId(preselectedClientId);
    }
  }, [preselectedClientId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !policyNumber) return;

    const client = clients.find((c) => c.id === clientId);

    addPolicy({
      client_id: clientId,
      client_name: client ? client.name : undefined,
      client_phone: client ? client.phone : undefined,
      insurer,
      policy_number: policyNumber.trim(),
      plan_type: planType,
      premium_amount: Number(premiumAmount) || 10000,
      frequency,
      start_date: startDate,
      due_date: dueDate,
      status,
      sum_assured: Number(sumAssured) || 500000,
      commission_rate: Number(commissionRate) || 5,
    });

    setPolicyNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Add New Insurance Policy</h3>
              <p className="text-[11px] text-slate-500">Record an issued policy and schedule upcoming premium renewals</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Client <span className="text-rose-600">*</span>
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              required
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) - {c.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Insurer</label>
              <select
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="LIC of India">LIC of India</option>
                <option value="Star Health">Star Health</option>
                <option value="HDFC Life">HDFC Life</option>
                <option value="Tata AIG">Tata AIG</option>
                <option value="ICICI Prudential">ICICI Prudential</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Policy Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. LIC-88192019"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Plan / Table Type</label>
              <input
                type="text"
                required
                list="lic-plans-list"
                placeholder="e.g. LIC's Digi Term (Plan 876)"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <datalist id="lic-plans-list">
                <option value="LIC's Digi Term (Plan 876)" />
                <option value="LIC's New Tech-Term (Plan 954)" />
                <option value="LIC's New Jeevan Amar (Plan 955)" />
                <option value="LIC's Saral Jeevan Bima (Plan 859)" />
                <option value="LIC's Jeevan Utsav (Plan 771)" />
                <option value="LIC's Jeevan Umang (Plan 745)" />
                <option value="LIC's New Jeevan Anand" />
                <option value="LIC's Index Plus (Plan 873)" />
                <option value="LIC's Nivesh Plus (Plan 749)" />
                <option value="LIC's SIIP (Plan 752)" />
                <option value="LIC's New Jeevan Shanti (Plan 858)" />
                <option value="LIC's Jeevan Akshay-VII" />
              </datalist>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sum Assured (₹)</label>
              <input
                type="number"
                value={sumAssured}
                onChange={(e) => setSumAssured(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Premium Amount (₹)</label>
              <input
                type="number"
                required
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PremiumFrequency)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Annual">Annual</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Renewal Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PolicyStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending Renewal</option>
                <option value="Overdue">Overdue</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Advisor Commission Rate (%)</label>
              <input
                type="number"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Save Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
