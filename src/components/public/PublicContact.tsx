import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  Send,
  Building,
} from 'lucide-react';

export const PublicContact: React.FC = () => {
  const { advisorProfile, addLead, openLeadModal } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    addLead({
      name: name || 'Website Visitor',
      phone,
      city: 'Contact Form Submission',
      product_interest: 'General Contact Enquiry',
      message: query,
      source: 'Website',
    });

    setSent(true);
    setName('');
    setPhone('');
    setQuery('');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Office details & Interactive Map representation */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800">
                Direct Communication
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Visit Our Office or Schedule a Doorstep Consultation
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Whether you prefer in-person branch servicing or digital documentation, our advisory office is fully equipped to assist policyholders across India.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Office Location</div>
                  <div className="text-xs text-slate-600 mt-0.5">{advisorProfile.office_address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Phone & WhatsApp Direct Line</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    <a href={`tel:${advisorProfile.phone.replace(/\s+/g, '')}`} className="hover:text-blue-700 font-semibold">
                      {advisorProfile.phone}
                    </a>{' '}
                    (Direct to {advisorProfile.name})
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Email Address</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    <a href={`mailto:${advisorProfile.email}`} className="hover:text-blue-700 font-semibold">
                      {advisorProfile.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Advisory Timings</div>
                  <div className="text-xs text-slate-600 mt-0.5">{advisorProfile.business_hours}</div>
                </div>
              </div>
            </div>

            {/* Visual Map Representation with Google Maps Embed */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 p-4 relative space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Building className="w-4 h-4 text-blue-700" />
                  Mirza Branch • Kachumara Advisory Office
                </span>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Open for Visitors
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-200">
                <iframe
                  title="Advisor Office Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(advisorProfile.office_address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="180"
                  className="w-full border-0 block"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-600 font-medium truncate max-w-[260px] sm:max-w-xs">
                  {advisorProfile.office_address}
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(advisorProfile.office_address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-700 hover:text-blue-800 hover:underline shrink-0 ml-2 inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Message Form */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900">Send a Quick Message</h3>
              <p className="text-xs text-slate-600 mt-1 mb-6">
                Have questions regarding existing policy revival, address change, or need a fresh quote? Leave a message below.
              </p>

              {sent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-slate-900">Message Received!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you. We have received your query and will connect with you via call or WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-xs font-bold text-blue-700 underline pt-2"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh K"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Call / WhatsApp) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">How can we help you?</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need to understand maturity bonus of my Jeevan Anand policy..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Send Message to Advisor</span>
                  </button>
                </form>
              )}

              {/* Direct WhatsApp click banner */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <a
                  href={`https://wa.me/${advisorProfile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${advisorProfile.name} ji, I'm reaching out from your website for insurance assistance.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
