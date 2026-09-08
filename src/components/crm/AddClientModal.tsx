import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientSource, PremiumFrequency } from '../../types';
import { X, UserPlus, Shield, PlusCircle, Check } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient } = useApp();

  // Client Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [source, setSource] = useState<ClientSource>('Manual');
  const [notes, setNotes] = useState('');

  // Optional Initial Policy Details
  const [addPolicyNow, setAddPolicyNow] = useState(true);
  const [insurer, setInsurer] = useState('LIC of India');
  const [policyNumber, setPolicyNumber] = useState('');
  const [planType, setPlanType] = useState('Endowment (Jeevan Labh - T936)');
  const [premiumAmount, setPremiumAmount] = useState<number>(35000);
  const [frequency, setFrequency] = useState<PremiumFrequency>('Annual');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });
  const [sumAssured, setSumAssured] = useState<number>(1000000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addClient(
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim() || 'Mumbai',
        address: address.trim(),
        source,
        notes: notes.trim(),
      },
      addPolicyNow && policyNumber
        ? {
            insurer,
            policy_number: policyNumber.trim(),
            plan_type: planType,
            premium_amount: Number(premiumAmount) || 20000,
            frequency,
            start_date: new Date().toISOString().split('T')[0],
            due_date: dueDate,
            status: 'Active',
            sum_assured: Number(sumAssured) || 500000,
            commission_rate: 10,
          }
        : undefined
    );

    // Reset & close
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setAddress('');
    setNotes('');
    setPolicyNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add New Client Record</h3>
              <p className="text-xs text-slate-400">Register policyholder details and link their primary insurance policy</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Section 1: Client Personal Details */}
          <div>
            <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              1. Policyholder Contact Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Joshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number (WhatsApp) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Pune, Thane"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Flat No, Building, Area, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as ClientSource)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden bg-white"
                >
                  <option value="Manual">Manual Entry / Walk-in</option>
                  <option value="Referral">Client Referral</option>
                  <option value="Website">Website Form</option>
                  <option value="Calculator">Online Calculator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Prefers calls post 6 PM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Policy toggle */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <label className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                2. Link First Policy (Optional)
              </label>
              <button
                type="button"
                onClick={() => setAddPolicyNow(!addPolicyNow)}
                className="text-blue-700 hover:text-blue-800 font-semibold text-xs"
              >
                {addPolicyNow ? 'Skip Policy for Now' : '+ Add Policy Now'}
              </button>
            </div>

            {addPolicyNow && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Insurer Name</label>
                    <select
                      value={insurer}
                      onChange={(e) => setInsurer(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="LIC of India">LIC of India</option>
                      <option value="Star Health">Star Health</option>
                      <option value="HDFC Life">HDFC Life</option>
                      <option value="Tata AIG">Tata AIG</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Policy Number</label>
                    <input
                      type="text"
                      placeholder="e.g. LIC-928172601"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Plan / Table Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Jeevan Labh (936)"
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Premium Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="35000"
                      value={premiumAmount}
                      onChange={(e) => setPremiumAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Premium Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as PremiumFrequency)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Annual">Annual (Yearly)</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Monthly">Monthly ECS / NACH</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Next Renewal Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Client Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
