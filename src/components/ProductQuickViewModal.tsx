/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  CheckCircle2,
  Package,
  ShieldCheck,
  Truck,
  ArrowUpRight,
  Copy,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { PhysicalProduct, DigitalSolution } from '../types';
import { parsePriceNumber, formatBRLPrice } from '../services/productVisuals';

interface ProductQuickViewModalProps {
  product: PhysicalProduct | DigitalSolution | null;
  type: 'physical' | 'digital';
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  type,
  isOpen,
  onClose,
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!isOpen || !product) return null;

  const isPhysical = type === 'physical';
  const physProd = isPhysical ? (product as PhysicalProduct) : null;
  const digiProd = !isPhysical ? (product as DigitalSolution) : null;

  const illustrativeImage = product.imageUrl || (
    isPhysical
      ? 'https://commons.wikimedia.org/wiki/Special:FilePath/Logitech_MX_Master_3S_HS01.jpg?width=900'
      : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85'
  );

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

  const formattedCurrentPrice = formatBRLPrice(currentPriceNum);
  const formattedOriginalPrice = formatBRLPrice(originalPriceNum);

  const whatsIncluded = product.whatsIncluded && product.whatsIncluded.length > 0
    ? product.whatsIncluded
    : isPhysical
      ? [
          '1x Dispositivo de Precisão Ergonômica com Certificação',
          '1x Manual de anatomia biomecânica em português',
          'Kit de montagem e ajuste fino rápido',
          'Certificado de garantia de 30 dias para testes'
        ]
      : [
          'Acesso vitalício à plataforma e atualizações completas',
          'Módulos práticos em vídeo passo a passo em 4K',
          'Templates e materiais de apoio para download imediato',
          'Garantia incondicional de 7 dias com reembolso total'
        ];

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('PAINFINDER10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-[32px] bg-white border border-black/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-black/[0.05] flex items-center justify-between bg-[#FBFBFC]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-950 text-white font-medium">
                Raio-X do Produto
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {isPhysical ? 'Hardware de Engenharia' : 'Método & Sistema Digital'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body: Scrollable */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* Top Grid: Image on left, Summary on right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Product Imagery (Direct link on click) */}
              <div className="space-y-3">
                <a
                  href={directProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Ir para o anúncio oficial de ${product.name}`}
                  className="group/modalimg relative block w-full h-64 sm:h-72 rounded-[24px] bg-[#F5F5F7] p-4 border border-black/[0.04] overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={illustrativeImage}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover/modalimg:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = isPhysical
                        ? 'https://commons.wikimedia.org/wiki/Special:FilePath/Logitech_MX_Master_3S_HS01.jpg?width=900'
                        : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85';
                    }}
                  />
                  
                  {/* Floating tag */}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[10px] font-mono text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Foto Ilustrativa Real</span>
                  </span>

                  <span className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover/modalimg:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[1px]">
                    <span className="bg-white text-neutral-950 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <span>Ver Anúncio Oficial</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </span>
                </a>
              </div>

              {/* Product Info & Value */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="text-sm font-semibold font-mono text-neutral-950">{rating}</span>
                  <span className="text-xs text-neutral-400 font-mono">({reviewsCount} avaliações)</span>
                </div>

                <a
                  href={directProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors block"
                >
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 leading-tight flex items-start gap-1.5">
                    <span>{product.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 mt-1 shrink-0" />
                  </h3>
                </a>

                {product.conversionHeadline && (
                  <p className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-500/15 leading-relaxed">
                    ✓ {product.conversionHeadline}
                  </p>
                )}

                <p className="text-xs text-neutral-600 leading-relaxed">
                  <strong className="text-neutral-950 font-medium">Por que é a escolha ideal:</strong>{' '}
                  {isPhysical ? physProd?.whyItSolves : digiProd?.transformationPromise}
                </p>

                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-neutral-400 line-through">
                        R$ {formattedOriginalPrice}
                      </span>
                      <div className="text-2xl font-bold font-mono text-neutral-950">
                        R$ {formattedCurrentPrice}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {product.installments || 'ou até 10x sem juros'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold block mb-1">
                        Preço Oficial
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 block">
                        {isPhysical ? 'Frete Grátis Prime' : 'Liberação Imediata'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* One-Click Exclusive Coupon Button */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold block">
                      Cupom de Parceria Ativo
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-900">PAINFINDER10</span>
                  </div>

                  <button
                    onClick={handleCopyCoupon}
                    className="px-3 py-1.5 rounded-full bg-white text-neutral-900 border border-amber-300 text-[11px] font-mono font-semibold flex items-center gap-1.5 shadow-xs hover:bg-amber-100 transition-colors"
                  >
                    {copiedCoupon ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Copiar -10%</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* What is Included */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-neutral-700" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-700 font-semibold">
                  {isPhysical ? 'Conteúdo da Embalagem Lacrada:' : 'O que você recebe no Acesso Digital:'}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {whatsIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-black/[0.03]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Confidence & Trust Guarantee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.03] space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                <h5 className="text-xs font-semibold text-neutral-900">Garantia Blindada</h5>
                <p className="text-[10px] text-neutral-500 font-mono">
                  {isPhysical ? '30 dias de teste sem risco' : '7 dias de garantia incondicional'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.03] space-y-1">
                <Truck className="w-5 h-5 text-blue-600 mx-auto" />
                <h5 className="text-xs font-semibold text-neutral-900">
                  {isPhysical ? 'Logística Rápida' : 'Acesso Imediato'}
                </h5>
                <p className="text-[10px] text-neutral-500 font-mono">
                  {isPhysical ? 'Rastreio ponto a ponto' : 'No seu e-mail em 1 minuto'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.03] space-y-1">
                <Star className="w-5 h-5 text-amber-500 mx-auto" />
                <h5 className="text-xs font-semibold text-neutral-900">Qualidade Atestada</h5>
                <p className="text-[10px] text-neutral-500 font-mono">
                  Mais de 95% de aprovação clínica
                </p>
              </div>
            </div>

          </div>

          {/* Modal Footer: Sticky Action Buttons */}
          <div className="p-5 sm:p-6 border-t border-black/[0.05] bg-[#FBFBFC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="text-xs text-neutral-500 font-mono block">Valor Total:</span>
              <span className="text-xl font-bold font-mono text-neutral-950">R$ {formattedCurrentPrice}</span>
              <span className="text-[11px] text-neutral-400 font-mono ml-2">
                ({product.installments || '10x sem juros'})
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isPhysical && physProd ? (
                <>
                  <a
                    href={`https://www.amazon.com.br/s?k=${encodeURIComponent(physProd.searchQueryAmazon || product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-white border border-black/[0.12] text-neutral-950 text-xs font-semibold hover:bg-neutral-100 shadow-xs transition-all active:scale-95 text-center"
                  >
                    <span>Comprar na Amazon</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                  </a>

                  <a
                    href={`https://lista.mercadolivre.com.br/${encodeURIComponent(physProd.searchQueryMercadoLivre || product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all active:scale-95 text-center"
                  >
                    <span>Garantir no Mercado Livre</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </>
              ) : (
                <a
                  href={directProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wide hover:bg-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95 text-center"
                >
                  <span>Ir Direto para Página Oficial</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
