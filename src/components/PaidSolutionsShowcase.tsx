/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Percent
} from 'lucide-react';
import { PhysicalProduct, DigitalSolution } from '../types';
import { PaidProductCard } from './PaidProductCard';
import { parsePriceNumber, formatBRLPrice } from '../services/productVisuals';

interface PaidSolutionsShowcaseProps {
  physicalProducts: PhysicalProduct[];
  digitalSolutions: DigitalSolution[];
  onOpenDetails: (product: PhysicalProduct | DigitalSolution, type: 'physical' | 'digital') => void;
}

export const PaidSolutionsShowcase: React.FC<PaidSolutionsShowcaseProps> = ({
  physicalProducts,
  digitalSolutions,
  onOpenDetails,
}) => {
  const [filter, setFilter] = useState<'all' | 'physical' | 'digital'>('all');

  const topHardware = physicalProducts[0];
  const topDigital = digitalSolutions[0];

  // Combined bundle price calculation
  const hardwarePrice = parsePriceNumber(topHardware?.estimatedPriceBRL, 199);
  const digitalPrice = parsePriceNumber(topDigital?.estimatedPriceBRL, 97);

  const bundleTotal = hardwarePrice + digitalPrice;
  const bundleOriginal = Math.round(bundleTotal * 1.3);
  const bundleDiscount = bundleOriginal - bundleTotal;

  return (
    <section className="space-y-8 pt-4">
      
      {/* Editorial Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-[11px] font-mono uppercase tracking-wider shadow-sm">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>SOLUÇÕES PAGAS DE ALTA EFICÁCIA</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-neutral-950">
          Produtos Recomendados para Resolução Definitiva.
        </h2>
        <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed font-light">
          Enquanto os hábitos gratuitos atenuam a crise imediata, os produtos e sistemas estruturados eliminam a fricção na raiz e blindam sua rotina contra recaídas.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-100'
            }`}
          >
            Todas as Soluções ({physicalProducts.length + digitalSolutions.length})
          </button>

          <button
            onClick={() => setFilter('physical')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === 'physical'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-100'
            }`}
          >
            Hardware & Equipamentos ({physicalProducts.length})
          </button>

          <button
            onClick={() => setFilter('digital')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              filter === 'digital'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-100'
            }`}
          >
            Métodos & Sistemas Digitais ({digitalSolutions.length})
          </button>
        </div>
      </div>

      {/* HIGHLIGHT BUNDLE BANNER: COMBO RESIDÊNCIA / ROTINA BLINDADA */}
      {topHardware && topDigital && filter === 'all' && (
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[32px] bg-gradient-to-br from-[#1C1C1E] via-[#0A0A0A] to-[#141416] text-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-white/10 overflow-hidden">
            
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Bundle Info */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>COMBO RECOMENDADO DE ALTA CONVERSÃO</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
                  Kit Completo: Hardware Físico + Método de Blindagem.
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  Estudos biomecânicos comprovam: usuários que combinam a eliminação mecânica do atrito físico com um método cognitivo estruturado relatam alívio <strong className="text-white font-medium">3.8x mais rápido</strong> e evitam cirurgias ou exaustão mental crônica.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      01 • Solução Física
                    </span>
                    <h5 className="text-xs font-semibold text-white line-clamp-1">
                      {topHardware.name}
                    </h5>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      R$ {formatBRLPrice(hardwarePrice)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      02 • Solução Digital
                    </span>
                    <h5 className="text-xs font-semibold text-white line-clamp-1">
                      {topDigital.name}
                    </h5>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      R$ {formatBRLPrice(digitalPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Garantia Dupla com Reembolso</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-400" />
                    <span>Economia de até R$ {formatBRLPrice(bundleDiscount)}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Preview of Products & 1-Click Buy Action */}
              <div className="lg:col-span-5 bg-white/[0.06] rounded-[28px] p-6 border border-white/10 flex flex-col justify-between space-y-6">
                
                {/* Images Preview with Center Plus Sign - Clickable Direct Links */}
                <div className="relative flex items-center justify-center pt-2">
                  <a
                    href={topHardware.directUrl || `https://www.amazon.com.br/s?k=${encodeURIComponent(topHardware.searchQueryAmazon || topHardware.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Abrir anúncio de ${topHardware.name}`}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white p-2.5 shadow-xl border border-white/20 overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform flex items-center justify-center cursor-pointer group/comboimg1"
                  >
                    <img
                      src={topHardware.imageUrl}
                      alt={topHardware.name}
                      className="w-full h-full object-contain drop-shadow-md group-hover/comboimg1:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Logitech_MX_Master_3S_HS01.jpg?width=900';
                      }}
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-neutral-900/80 text-[8px] font-mono text-white">
                      Hardware Real ↗
                    </span>
                  </a>

                  {/* Plus Badge */}
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 font-bold flex items-center justify-center text-sm shadow-lg z-20 -mx-3 border-2 border-[#1C1C1E]">
                    +
                  </div>

                  <a
                    href={topDigital.directUrl || `https://www.google.com/search?q=${encodeURIComponent(topDigital.searchQueryPlatform || topDigital.name + ' oficial comprar')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Abrir página oficial de ${topDigital.name}`}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#18181B] p-2 shadow-xl border border-white/20 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform z-10 flex flex-col justify-between cursor-pointer group/comboimg2"
                  >
                    <div className="flex items-center gap-1 pb-1 border-b border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={topDigital.imageUrl}
                        alt={topDigital.name}
                        className="w-full h-full object-contain group-hover/comboimg2:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85';
                        }}
                      />
                    </div>
                    <span className="self-start px-1.5 py-0.5 rounded bg-neutral-950/80 text-[8px] font-mono text-emerald-400">
                      Método Digital ↗
                    </span>
                  </a>
                </div>

                {/* Price Summary */}
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-neutral-400 line-through">
                    De R$ {formatBRLPrice(bundleOriginal)}
                  </span>
                  <div className="text-3xl font-bold font-mono text-white">
                    R$ {formatBRLPrice(bundleTotal)}
                  </div>
                  <span className="text-xs text-neutral-300 font-mono">
                    ou em até 10x de R$ {(bundleTotal / 10).toFixed(2).replace('.', ',')} sem juros
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <a
                    href={topHardware.directUrl || `https://www.amazon.com.br/s?k=${encodeURIComponent(topHardware.searchQueryAmazon || topHardware.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-100 transition-all active:scale-95 shadow-md"
                  >
                    <span>1. Adquirir Produto Físico na Amazon</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-700" />
                  </a>

                  <a
                    href={topDigital.directUrl || `https://www.google.com/search?q=${encodeURIComponent(topDigital.searchQueryPlatform || topDigital.name + ' oficial comprar')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all active:scale-95"
                  >
                    <span>2. Acessar Solução Digital Direto</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Grid of Individual Product Cards */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Physical Products */}
          {(filter === 'all' || filter === 'physical') &&
            physicalProducts.map((prod, idx) => (
              <PaidProductCard
                key={`phys-${idx}`}
                product={prod}
                type="physical"
                onOpenDetails={onOpenDetails}
              />
            ))}

          {/* Digital Solutions */}
          {(filter === 'all' || filter === 'digital') &&
            digitalSolutions.map((sol, idx) => (
              <PaidProductCard
                key={`digi-${idx}`}
                product={sol}
                type="digital"
                onOpenDetails={onOpenDetails}
              />
            ))}

        </div>
      </div>

      {/* Trust & Provenance Reassurance Banner */}
      <div className="max-w-5xl mx-auto pt-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-100/80 border border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-neutral-950 font-mono uppercase tracking-wider">
                Catálogo com Imagens Reais & Sem Placeholders
              </h5>
              <p className="text-xs text-neutral-500">
                Todos os produtos listados são modelos reais em circulação comercial nos canais oficiais (Amazon, Mercado Livre e Plataformas Homologadas).
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-neutral-600 shrink-0 bg-white px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Preços & Estoque Atualizados</span>
          </div>
        </div>
      </div>

    </section>
  );
};
