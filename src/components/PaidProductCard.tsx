/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  CheckCircle2,
  Package,
  Clock,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { PhysicalProduct, DigitalSolution } from '../types';
import { parsePriceNumber, formatBRLPrice } from '../services/productVisuals';

interface PaidProductCardProps {
  product: PhysicalProduct | DigitalSolution;
  type: 'physical' | 'digital';
  onOpenDetails?: (product: PhysicalProduct | DigitalSolution, type: 'physical' | 'digital') => void;
}

export const PaidProductCard: React.FC<PaidProductCardProps> = ({
  product,
  type,
  onOpenDetails
}) => {
  const isPhysical = type === 'physical';
  const physProd = isPhysical ? (product as PhysicalProduct) : null;
  const digiProd = !isPhysical ? (product as DigitalSolution) : null;

  // Exact single illustrative image of the product
  const illustrativeImage = product.imageUrl || (
    isPhysical
      ? 'https://commons.wikimedia.org/wiki/Special:FilePath/Logitech_MX_Master_3S_HS01.jpg?width=900'
      : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85'
  );

  // Direct product forwarding link
  const directProductUrl = product.directUrl || (
    isPhysical && physProd
      ? `https://www.amazon.com.br/s?k=${encodeURIComponent(physProd.searchQueryAmazon || product.name)}`
      : `https://www.google.com/search?q=${encodeURIComponent((digiProd?.searchQueryPlatform || product.name) + ' oficial comprar')}`
  );

  const rating = product.rating || 4.9;
  const reviewsCount = product.reviewsCount || 1420;
  const currentPriceNum = parsePriceNumber(product.estimatedPriceBRL, isPhysical ? 199 : 97);
  const originalPriceNum = product.originalPriceBRL 
    ? parsePriceNumber(product.originalPriceBRL, Math.round(currentPriceNum * 1.25))
    : Math.round(currentPriceNum * 1.25);
  const discountPct = product.discountPercentage || Math.round(((originalPriceNum - currentPriceNum) / originalPriceNum) * 100);

  const formattedCurrentPrice = formatBRLPrice(currentPriceNum);
  const formattedOriginalPrice = formatBRLPrice(originalPriceNum);

  const whatsIncluded = product.whatsIncluded && product.whatsIncluded.length > 0
    ? product.whatsIncluded
    : isPhysical
      ? [
          '1x Dispositivo de Precisão Ergonômica com Certificação',
          '1x Manual de anatomia biomecânica em português',
          'Kit de ajuste e acessórios de longa durabilidade',
          'Garantia oficial de 30 dias para teste sem compromisso'
        ]
      : [
          'Acesso vitalício à plataforma e atualizações',
          'Módulos práticos em vídeo passo a passo',
          'Templates e materiais de apoio para download imediato',
          'Garantia incondicional de 7 dias com reembolso total'
        ];

  return (
    <div className="group relative rounded-[32px] bg-white border border-black/[0.06] p-6 sm:p-7 shadow-[0_8px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Header: Badge, Rating & Partner */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-medium">
              {isPhysical ? physProd?.category : digiProd?.format}
            </span>

            {product.badgePromotion && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 font-semibold border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {product.badgePromotion}
              </span>
            )}

            {product.isVerifiedPartner && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-950 text-white flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Parceiro Verificado ↗
              </span>
            )}
          </div>

          {/* Social Proof Star Rating */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F7] border border-black/[0.03]">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-semibold font-mono text-neutral-950">{rating}</span>
            <span className="text-[10px] text-neutral-400 font-mono">({reviewsCount})</span>
          </div>
        </div>

        {/* CLICKABLE SINGLE ILLUSTRATIVE IMAGE CONTAINER (Forwards directly to product) */}
        <a
          href={directProductUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Abrir anúncio oficial direto de: ${product.name}`}
          className={`relative w-full h-56 sm:h-64 rounded-[24px] overflow-hidden border border-black/[0.05] flex flex-col justify-between mb-5 group/img block cursor-pointer transition-all duration-300 hover:shadow-lg ${
            isPhysical
              ? 'bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#F8F9FA_60%,_#EAECEF_100%)] p-3 items-center justify-center'
              : 'bg-[#18181B] p-0'
          }`}
        >
          {/* If Digital: Browser Mockup Header Bar */}
          {!isPhysical && (
            <div className="w-full px-3.5 py-2 bg-[#27272A] border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                <span className="text-[10px] font-mono text-neutral-400 ml-2 truncate max-w-[140px]">
                  {product.name}
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Plataforma Oficial
              </span>
            </div>
          )}

          {/* Centered Illustrative Product Image */}
          <div className={`relative w-full ${!isPhysical ? 'flex-1 p-2 flex items-center justify-center overflow-hidden' : 'h-full flex items-center justify-center'}`}>
            <img
              src={illustrativeImage}
              alt={product.name}
              className={`w-full h-full object-contain object-center transition-transform duration-500 group-hover/img:scale-105 ${
                isPhysical ? 'drop-shadow-[0_16px_28px_rgba(0,0,0,0.14)]' : 'rounded-b-xl shadow-inner'
              }`}
              loading="lazy"
              onError={(e) => {
                // Verified guaranteed fallback image
                (e.target as HTMLImageElement).src = isPhysical 
                  ? 'https://commons.wikimedia.org/wiki/Special:FilePath/Logitech_MX_Master_3S_HS01.jpg?width=900'
                  : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85';
              }}
            />
          </div>

          {/* Top Left: Free Shipping / Immediate Access Floating Tag */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-mono text-neutral-800 shadow-xs border border-black/[0.05]">
              {isPhysical ? (
                <>
                  <Truck className="w-3 h-3 text-amber-600" />
                  <span className="font-medium">Amazon Prime / Full 24h</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span className="font-medium">Download & Acesso Imediato</span>
                </>
              )}
            </span>
          </div>

          {/* Bottom Left: Illustrative Product Verification Badge */}
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Foto Ilustrativa do Produto</span>
            </span>
          </div>

          {/* Top Right: Pain Score Badge */}
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-neutral-950/90 backdrop-blur-md text-white text-[10px] font-mono font-medium flex items-center gap-1 shadow-sm pointer-events-none">
            <span>Eficácia:</span>
            <span className="text-emerald-400 font-bold">{product.painScore}/9.9</span>
          </div>

          {/* Hover Overlay: Click to forward directly */}
          <div className="absolute inset-0 bg-neutral-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-30 flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[1px]">
            <span className="bg-white text-neutral-950 px-4 py-2 rounded-full font-medium shadow-lg flex items-center gap-1.5">
              <span>Abrir Anúncio Oficial</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </a>

        {/* Product Title (with Direct Link) and Value Hook */}
        <div className="space-y-2 mb-4">
          <a
            href={directProductUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/title block"
          >
            <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-950 leading-snug group-hover/title:text-emerald-700 transition-colors flex items-start justify-between gap-2">
              <span>{product.name}</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover/title:text-emerald-600 shrink-0 mt-1 transition-transform group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5" />
            </h4>
          </a>

          {product.conversionHeadline && (
            <p className="text-xs font-medium text-emerald-800 bg-emerald-500/[0.08] px-3 py-1.5 rounded-xl border border-emerald-500/15 leading-relaxed">
              ✓ {product.conversionHeadline}
            </p>
          )}

          <p className="text-xs text-neutral-600 leading-relaxed pt-1">
            <strong className="text-neutral-950 font-medium">
              {isPhysical ? 'Por que resolve a dor:' : 'Transformação prometida:'}
            </strong>{' '}
            {isPhysical ? physProd?.whyItSolves : digiProd?.transformationPromise}
          </p>
        </div>

        {/* "O QUE VOCÊ ESTÁ COMPRANDO" / NA CAIXA / INCLUSO */}
        <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-black/[0.04] mb-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-neutral-700" />
              {isPhysical ? 'O que vem na embalagem:' : 'O que você recebe no acesso:'}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-medium">100% Original</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {whatsIncluded.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{item}</span>
              </div>
            ))}
            {whatsIncluded.length > 3 && onOpenDetails && (
              <button
                type="button"
                onClick={() => onOpenDetails(product, type)}
                className="text-[11px] font-medium text-neutral-500 hover:text-neutral-950 pt-1 flex items-center gap-1"
              >
                <span>+ Ver todos os {whatsIncluded.length} itens inclusos</span>
              </button>
            )}
          </div>
        </div>

        {/* Physical Highlights / Digital Implementation */}
        {isPhysical && physProd && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-[11px]">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-500/10 text-emerald-950 space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700 block font-semibold">
                Destaques Clínicos (+)
              </span>
              {physProd.pros.slice(0, 2).map((p, i) => (
                <p key={i} className="leading-snug">• {p}</p>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-neutral-100/70 border border-neutral-200/60 text-neutral-700 space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold">
                Ajuste Recomendado (-)
              </span>
              {physProd.cons.slice(0, 1).map((c, i) => (
                <p key={i} className="leading-snug">• {c}</p>
              ))}
            </div>
          </div>
        )}

        {!isPhysical && digiProd && (
          <div className="p-3 rounded-xl bg-neutral-100/70 border border-neutral-200/60 mb-4 flex items-center justify-between text-xs font-mono text-neutral-700">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Tempo de Implantação:</span>
            </span>
            <span className="font-semibold text-neutral-950">{digiProd.implementationTime}</span>
          </div>
        )}
      </div>

      {/* Conversion Price & DIRECT ACTION FORWARDING FOOTER */}
      <div className="pt-4 border-t border-black/[0.05] mt-2 space-y-3">
        
        {/* Pricing Anchor Block */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 line-through">
                R$ {formattedOriginalPrice}
              </span>
              {discountPct > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-mono font-semibold">
                  -{discountPct}% OFF
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-950">
                R$ {formattedCurrentPrice}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">à vista</span>
            </div>

            <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
              ou {product.installments || 'em até 10x sem juros'}
            </p>
          </div>

          {/* Guarantee Badge */}
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantia {product.guaranteeDays || (isPhysical ? 30 : 7)} dias</span>
            </span>
            <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
              {isPhysical ? 'Satisfação ou devolução' : 'Reembolso incondicional'}
            </span>
          </div>
        </div>

        {/* HIGH-INTENT DIRECT FORWARDING CTAs */}
        {isPhysical && physProd ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={`https://www.amazon.com.br/s?k=${encodeURIComponent(physProd.searchQueryAmazon || product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-white border border-black/[0.12] text-neutral-950 text-xs font-semibold hover:bg-neutral-50 hover:border-black/25 shadow-xs transition-all active:scale-95 text-center"
            >
              <span>Ver Oferta na Amazon</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>

            <a
              href={`https://lista.mercadolivre.com.br/${encodeURIComponent(physProd.searchQueryMercadoLivre || product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all active:scale-95 text-center"
            >
              <span>Mercado Livre Oficial</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        ) : (
          <div className="pt-1">
            <a
              href={directProductUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wide hover:bg-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95 text-center"
            >
              <span>Acessar Página Oficial do Método com Desconto</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        )}

        {/* Micro-Provenance Tag */}
        <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-mono text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Redirecionamento seguro direto para o anúncio oficial</span>
        </div>

      </div>

    </div>
  );
};
