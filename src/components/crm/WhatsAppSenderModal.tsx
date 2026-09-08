import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles, Copy } from 'lucide-react';

export const WhatsAppSenderModal: React.FC = () => {
  const {
    activeWhatsAppClient,
    activeWhatsAppPolicy,
    closeWhatsAppSender,
    whatsappTemplates,
    advisorProfile,
    logInteraction,
    showToast,
  } = useApp();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    whatsappTemplates[0] ? whatsappTemplates[0].id : ''
  );
  const [compiledMessage, setCompiledMessage] = useState('');

  // Re-compile message whenever template, client, or policy changes
  useEffect(() => {
    if (!activeWhatsAppClient) return;

    const template = whatsappTemplates.find((t) => t.id === selectedTemplateId) || whatsappTemplates[0];
    if (!template) return;

    let text = template.body;
    text = text.replace(/{client_name}/g, activeWhatsAppClient.name);
    text = text.replace(/{advisor_name}/g, advisorProfile.name);
    text = text.replace(/{advisor_phone}/g, advisorProfile.phone);

    if (activeWhatsAppPolicy) {
      text = text.replace(/{policy_number}/g, activeWhatsAppPolicy.policy_number);
      text = text.replace(/{plan_type}/g, activeWhatsAppPolicy.plan_type);
      text = text.replace(/{premium_amount}/g, '₹' + activeWhatsAppPolicy.premium_amount.toLocaleString('en-IN'));
      text = text.replace(/{due_date}/g, activeWhatsAppPolicy.due_date);
    } else {
      text = text.replace(/{policy_number}/g, 'Your Policy');
      text = text.replace(/{plan_type}/g, 'Life Insurance Policy');
      text = text.replace(/{premium_amount}/g, 'applicable premium');
      text = text.replace(/{due_date}/g, 'scheduled renewal date');
    }

    setCompiledMessage(text);
  }, [activeWhatsAppClient, activeWhatsAppPolicy, selectedTemplateId, whatsappTemplates, advisorProfile]);

  if (!activeWhatsAppClient) return null;

  const handleSendViaWhatsAppWeb = () => {
    const cleanPhone = activeWhatsAppClient.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(compiledMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // Log to client timeline
    logInteraction({
      client_id: activeWhatsAppClient.id,
      policy_id: activeWhatsAppPolicy?.id,
      type: 'message',
      channel: 'WhatsApp',
      content: `Sent WhatsApp template [${selectedTemplateId}] to ${activeWhatsAppClient.phone}:\n"${compiledMessage}"`,
      created_by: advisorProfile.name,
    });

    showToast('Opened WhatsApp and logged to client timeline', 'success');
    closeWhatsAppSender();
  };

  const handleSimulateApiDelivery = () => {
    logInteraction({
      client_id: activeWhatsAppClient.id,
      policy_id: activeWhatsAppPolicy?.id,
      type: 'message',
      channel: 'WhatsApp',
      content: `Delivered automated WhatsApp template [${selectedTemplateId}] via WhatsApp Business API:\n"${compiledMessage}"`,
      created_by: 'Automation Engine',
    });

    showToast('Simulated WhatsApp Business API notification delivered!', 'success');
    closeWhatsAppSender();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(compiledMessage);
    showToast('Copied message text to clipboard', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Send WhatsApp Notice</h3>
              <p className="text-xs text-slate-500">
                To: <span className="font-bold text-slate-800">{activeWhatsAppClient.name}</span> ({activeWhatsAppClient.phone})
              </p>
            </div>
          </div>
          <button onClick={closeWhatsAppSender} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="space-y-1 text-xs">
          <label className="block font-bold text-slate-800">Choose Approved Message Template:</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            {whatsappTemplates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name} ({tpl.timing})
              </option>
            ))}
          </select>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">Preview & Customization:</label>
            <button
              type="button"
              onClick={handleCopyText}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={7}
              value={compiledMessage}
              onChange={(e) => setCompiledMessage(e.target.value)}
              className="w-full p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-xl text-slate-800 text-xs font-sans leading-relaxed outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            * Variables have been auto-populated with client and policy records. You can make manual adjustments before dispatching.
          </p>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSimulateApiDelivery}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            title="Simulate WhatsApp Business API cloud delivery"
          >
            Simulate API Delivery
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={closeWhatsAppSender}
              className="px-3 py-2 text-slate-600 hover:text-slate-900 font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendViaWhatsAppWeb}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
