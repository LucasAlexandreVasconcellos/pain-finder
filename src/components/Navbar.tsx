import React from 'react';
import { ArrowUpRight, Sparkles, Activity, History } from 'lucide-react';
import { ActiveTab } from '../types';

import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasOngoingDiagnosis: boolean;
  onResetDiagnosis: () => void;
  savedConsultationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasOngoingDiagnosis,
  onResetDiagnosis,
  savedConsultationsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F5F5F7]/80 border-b border-black/[0.04] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => {
            setActiveTab('diagnose');
            if (hasOngoingDiagnosis) onResetDiagnosis();
          }}
          className="flex items-center cursor-pointer"
        >
          <BrandLogo size="md" />
        </div>

        {/* Minimalist Centered Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('diagnose')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
              activeTab === 'diagnose'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
            }`}
          >
            Diagnosticar
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
            }`}
          >
            <span>Histórico</span>
            {savedConsultationsCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                activeTab === 'history'
                  ? 'bg-neutral-800 text-emerald-400'
                  : 'bg-neutral-200 text-neutral-700'
              }`}>
                {savedConsultationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tech_anatomy')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
              activeTab === 'tech_anatomy'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
            }`}
          >
            Tecnologia & Anatomia
          </button>

          <button
            onClick={() => setActiveTab('pain_trends')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
              activeTab === 'pain_trends'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
            }`}
          >
            Pain Trends (B2B)
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200 ${
              activeTab === 'partners'
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/[0.03]'
            }`}
          >
            Parceiros (+ Solução)
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveTab('diagnose');
              if (hasOngoingDiagnosis) onResetDiagnosis();
            }}
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-neutral-900 text-xs font-medium border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95"
          >
            <span>Novo Diagnóstico</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950" />
          </button>
        </div>

      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-black/[0.04] bg-white/70 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('diagnose')}
          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium shrink-0 ${
            activeTab === 'diagnose' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Diagnóstico
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium shrink-0 ${
            activeTab === 'history' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          <span>Histórico</span>
          {savedConsultationsCount > 0 && (
            <span className="px-1 py-0.2 rounded-full bg-neutral-200 text-neutral-800 text-[8px] font-mono">
              {savedConsultationsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tech_anatomy')}
          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium shrink-0 ${
            activeTab === 'tech_anatomy' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Anatomia
        </button>
        <button
          onClick={() => setActiveTab('pain_trends')}
          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium shrink-0 ${
            activeTab === 'pain_trends' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Trends B2B
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium shrink-0 ${
            activeTab === 'partners' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
          }`}
        >
          Parceiros
        </button>
      </div>
    </header>
  );
};
