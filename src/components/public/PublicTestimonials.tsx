import React from 'react';
import { Star, Quote, ShieldCheck, Heart } from 'lucide-react';

export const PublicTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sunil & Meena Kulkarni',
      location: 'Dadar, Mumbai',
      policy: 'LIC Jeevan Labh (Maturity Settled)',
      quote:
        'When our 16-year LIC policy matured this January, Ramesh ji handled every single paper, branch signature, and bank NEFT mandate personally. The ₹24 Lakh maturity amount was credited to our account without a single branch visit!',
      rating: 5,
      date: 'Client since 2008',
    },
    {
      name: 'Dr. Vikram Malhotra',
      location: 'Defence Colony, New Delhi',
      policy: 'Family Health Floater & Term Cover',
      quote:
        'During my wife’s unexpected gallbladder surgery last winter, Ramesh was on the phone with the TPA desk at 11 PM ensuring cashless authorization went through smoothly. An advisor who actually stands by you when an emergency strikes.',
      rating: 5,
      date: 'Client since 2015',
    },
    {
      name: 'Anita Desai',
      location: 'Koregaon Park, Pune',
      policy: '1 Cr Pure Term Insurance',
      quote:
        'As an independent architect, I wanted honest term insurance without agents pushing high-commission products. Ramesh explained the difference between pure risk cover vs ULIP clearly. Transparent, polite, and prompt.',
      rating: 5,
      date: 'Client since 2020',
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            Client Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Over 1,480+ Indian Families
          </h2>
          <p className="text-slate-600 text-base">
            Real stories of claim settlements, timely maturity payouts, and trusted financial advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.location}</div>
                    <div className="text-[11px] text-blue-700 font-medium mt-0.5">{t.policy}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
