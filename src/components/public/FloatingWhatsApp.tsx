import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, X, Send, ShieldCheck } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { advisorProfile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const quickPrompts = [
    `Hi ${advisorProfile.name} ji, I'm interested in a 1 Cr Term Plan quote.`,
    `Hello, I need information on LIC Jeevan Utsav / Jeevan Umang savings plans.`,
    `Hi, I want assistance regarding my existing LIC policy renewal.`,
  ];

  const handleSendToWhatsApp = (textToSend?: string) => {
    const text = textToSend || userMsg || `Hi ${advisorProfile.name} ji, I'm interested in insurance plans. Please guide me.`;
    const cleanNumber = advisorProfile.whatsapp.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-800 font-bold flex items-center justify-center text-sm shadow-xs">
                  AA
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-300 border-2 border-emerald-700 absolute bottom-0 right-0" />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">{advisorProfile.name}</div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  LIC Advisor • Mirza Branch • Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-emerald-50/40 space-y-3 text-xs">
            <div className="bg-white p-3 rounded-xl rounded-tl-xs shadow-xs border border-emerald-100/60 text-slate-800">
              Namaste! 🙏 I am {advisorProfile.name}, senior LIC advisor. How can I assist you and your family with life, health, or retirement planning today?
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Quick Enquiry Options:
              </div>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendToWhatsApp(prompt)}
                  className="w-full text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 transition-colors text-[11px] leading-snug cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendToWhatsApp();
                  }}
                  className="w-full pl-3 pr-10 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleSendToWhatsApp()}
                  className="absolute right-1.5 p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
        title="Chat with Advisor on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="hidden sm:inline font-bold text-xs">WhatsApp Advisor</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};
