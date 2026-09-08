import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Phone,
  MessageCircle,
  Menu,
  X,
  Lock,
  ChevronDown,
  Award,
  Sparkles,
} from 'lucide-react';

interface PublicNavbarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ activeSection, setActiveSection }) => {
  const { advisorProfile, openLeadModal, setMode, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Advisor' },
    { id: 'products', label: 'Products', hasDropdown: true },
    { id: 'calculator', label: 'Premium Calculator' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const productCategories = [
    { name: 'Term Insurance', desc: 'High cover at affordable rates' },
    { name: 'Endowment & Savings', desc: 'Guaranteed maturity + life cover' },
    { name: 'Health Insurance', desc: 'Cashless hospitalisation & floater' },
    { name: 'Child & Retirement Plans', desc: 'Education corpus & lifelong pension' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    setProductDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Advisory Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <Award className="w-3.5 h-3.5" />
              IRDAI Registered: {advisorProfile.license_no}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              {advisorProfile.agency}
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${advisorProfile.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{advisorProfile.phone}</span>
            </a>

            {/* Quick Admin Portal Switcher */}
            <button
              onClick={() => setMode('crm')}
              className="inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/30 transition-all font-medium cursor-pointer"
              title="Switch to Advisor / Staff CRM Admin Panel"
            >
              <Lock className="w-3 h-3" />
              <span>{currentUser ? `CRM Portal (${currentUser.name})` : 'Advisor CRM Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo / Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
                {advisorProfile.name}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  LIC Advisor
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  Mirza Branch
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                InsureCare Client Advisory • Mirza Branch
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      onMouseEnter={() => setProductDropdownOpen(true)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSection === item.id
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-1">
                        {productCategories.map((p) => (
                          <div
                            key={p.name}
                            onClick={() => {
                              handleNavClick('products');
                              openLeadModal(p.name);
                            }}
                            className="p-2.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Get a Callback CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openLeadModal()}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>Get a Callback</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => openLeadModal()}
              className="bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg"
            >
              Callback
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
                activeSection === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLeadModal();
              }}
              className="w-full py-2.5 bg-blue-700 text-white text-center font-semibold rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              Request a Free Callback
            </button>
            <button
              onClick={() => setMode('crm')}
              className="w-full py-2 bg-slate-900 text-amber-300 text-center font-medium rounded-lg text-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Advisor & Staff CRM Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
