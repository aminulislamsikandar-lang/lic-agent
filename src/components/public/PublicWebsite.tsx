import React, { useState } from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicHero } from './PublicHero';
import { PublicAbout } from './PublicAbout';
import { PublicProducts } from './PublicProducts';
import { PublicCalculator } from './PublicCalculator';
import { PublicTestimonials } from './PublicTestimonials';
import { PublicContact } from './PublicContact';
import { PublicFooter } from './PublicFooter';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { LeadModal } from './LeadModal';

export const PublicWebsite: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-100 selection:text-slate-900">
      <PublicNavbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-1">
        <div id="home">
          <PublicHero
            onExploreCalculator={() => scrollToSection('calculator')}
            onExploreProducts={() => scrollToSection('products')}
          />
        </div>

        <PublicAbout />
        <PublicProducts />
        <PublicCalculator />
        <PublicTestimonials />
        <PublicContact />
      </main>

      <PublicFooter />
      <FloatingWhatsApp />
      <LeadModal />
    </div>
  );
};
