import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ShieldCheck, Phone, Clock, ArrowRight, MessageSquare } from 'lucide-react';

export const LeadModal: React.FC = () => {
  const { isLeadModalOpen, closeLeadModal, leadModalProduct, addLead, advisorProfile } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [productInterest, setProductInterest] = useState(leadModalProduct || 'Term Insurance (1 Cr Cover)');
  const [preferredTime, setPreferredTime] = useState('Evening (4 PM - 8 PM)');
  const [message, setMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Sync incoming prefilled product
  React.useEffect(() => {
    if (leadModalProduct) {
      setProductInterest(leadModalProduct);
    }
  }, [leadModalProduct]);

  if (!isLeadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone (10 digits)
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');

    if (!consentGiven) {
      alert('Please check the TRAI consent box to allow our advisor to call or WhatsApp you.');
      return;
    }

    const formattedPhone = cleanedPhone.length === 10 ? `+91 ${cleanedPhone.slice(0, 5)} ${cleanedPhone.slice(5)}` : phone;

    const newLead = addLead({
      name: name.trim(),
      phone: formattedPhone,
      city: city.trim() || 'Not specified',
      product_interest: productInterest,
      preferred_time: preferredTime,
      message: message.trim() || undefined,
      source: leadModalProduct.includes('Calculator') ? 'Calculator' : 'Website',
    });

    setSubmittedLeadId(newLead.id);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setCity('');
    setMessage('');
    closeLeadModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-blue-700/60 text-amber-300 text-xs px-2.5 py-1 rounded-full mb-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            IRDAI Registered & Verified Advice
          </div>
          <h3 className="text-xl font-bold tracking-tight">Request a Free Callback</h3>
          <p className="text-xs text-blue-100 mt-1">
            Get personalized policy recommendations, premium calculations, and unbiased guidance with zero spam.
          </p>
        </div>

        {/* Form or Confirmation */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Enquiry Received Successfully!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-slate-900">{name}</span>. Senior Advisor{' '}
                <span className="font-semibold text-blue-800">{advisorProfile.name}</span> has been notified and will call you within 24 hours ({preferredTime}).
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference Lead ID:</span>
                  <span className="font-mono font-bold text-slate-900">{submittedLeadId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Interested Product:</span>
                  <span className="font-semibold text-slate-800">{productInterest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-semibold text-slate-800">{phone}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${advisorProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${advisorProfile.name} ji, I just submitted an enquiry on your website for ${productInterest}. My name is ${name}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg text-sm shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Connect Instantly on WhatsApp
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError('');
                      }}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all"
                    />
                  </div>
                  {phoneError && <p className="text-[11px] text-rose-600 mt-1">{phoneError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Interested Product <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={productInterest}
                    onChange={(e) => setProductInterest(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all bg-white"
                  >
                    <optgroup label="Term Insurance Plans">
                      <option value="LIC's Digi Term (Plan 876)">LIC's Digi Term (Plan 876)</option>
                      <option value="LIC's New Tech-Term (Plan 954)">LIC's New Tech-Term (Plan 954)</option>
                      <option value="LIC's New Jeevan Amar (Plan 955)">LIC's New Jeevan Amar (Plan 955)</option>
                      <option value="LIC's Saral Jeevan Bima (Plan 859)">LIC's Saral Jeevan Bima (Plan 859)</option>
                    </optgroup>
                    <optgroup label="Endowment & Savings Plans">
                      <option value="LIC's Jeevan Utsav (Plan 771)">LIC's Jeevan Utsav (Plan 771)</option>
                      <option value="LIC's Jeevan Umang (Plan 745)">LIC's Jeevan Umang (Plan 745)</option>
                      <option value="LIC's New Jeevan Anand">LIC's New Jeevan Anand</option>
                    </optgroup>
                    <optgroup label="ULIP (Unit Linked) Plans">
                      <option value="LIC's Index Plus (Plan 873)">LIC's Index Plus (Plan 873)</option>
                      <option value="LIC's Nivesh Plus (Plan 749)">LIC's Nivesh Plus (Plan 749)</option>
                      <option value="LIC's SIIP (Plan 752)">LIC's SIIP (Plan 752)</option>
                    </optgroup>
                    <optgroup label="Pension & Annuity Plans">
                      <option value="LIC's New Jeevan Shanti (Plan 858)">LIC's New Jeevan Shanti (Plan 858)</option>
                      <option value="LIC's Jeevan Akshay-VII">LIC's Jeevan Akshay-VII</option>
                    </optgroup>
                    <optgroup label="General Advisory">
                      <option value="Comprehensive Family Portfolio Review">Comprehensive Family Portfolio Review</option>
                      <option value="Policy Servicing & Renewal Query">Policy Servicing & Renewal Query</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Callback Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all bg-white"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    <option value="Anytime during business hours">Anytime during business hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Requirements or Query (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Looking for guaranteed return plan for 15 years term..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all"
                />
              </div>

              {/* TRAI Mandated Consent Checkbox */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="trai_consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="trai_consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                  <span className="font-semibold text-slate-800">TRAI & IRDAI Consent:</span> I agree to be contacted via
                  phone call, SMS, or WhatsApp regarding this enquiry by {advisorProfile.name} (LIC Advisor). Your details remain strictly confidential and will never be shared with 3rd parties.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Submit & Request Callback</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
