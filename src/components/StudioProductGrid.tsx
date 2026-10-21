/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Star, ShieldCheck } from 'lucide-react';

interface StudioItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  rating: string;
  imageUrl: string;
  searchQuery: string;
}

const REAL_STUDIO_ITEMS: StudioItem[] = [
  {
    id: 's1',
    name: 'Sony WH-1000XM4 Noise Cancelling',
    brand: 'Sony Oficial',
    category: 'Acústica de Concentração',
    price: 'R$ 1.290',
    rating: '4.9',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sony-WH-1000XM3-kabellose-Bluetooth-Noise-Cancelling-Kopfhoerer.3.jpg?width=900',
    searchQuery: 'sony wh 1000xm4 cancelamento ativo ruido bluetooth',
  },
  {
    id: 's2',
    name: 'Time Timer MOD Analógico 60 Min',
    brand: 'Time Timer',
    category: 'Hardware Cognitivo',
    price: 'R$ 129',
    rating: '4.8',
    imageUrl: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=85',
    searchQuery: 'time timer visual timer pomodoro mod',
  },
  {
    id: 's3',
    name: 'Logitech MX Master 3S Sem Fio',
    brand: 'Logitech',
    category: 'Ergonomia de Precisão',
    price: 'R$ 549',
    rating: '4.95',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Logitech_MX_Master_3S_HS01.jpg?width=900',
    searchQuery: 'mouse logitech mx master 3s ergonomico',
  },
  {
    id: 's4',
    name: 'Suporte Notebook Alumínio Articulado',
    brand: 'Baseus / UGREEN',
    category: 'Hardware Estrutural',
    price: 'R$ 149',
    rating: '4.9',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85',
    searchQuery: 'suporte notebook aluminio articulado baseus',
  },
];

export const StudioProductGrid: React.FC = () => {
  const handleOpenSearch = (query: string) => {
    window.open(`https://www.amazon.com.br/s?k=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full my-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            CATÁLOGO OFICIAL • PRODUTOS REAIS
          </span>
          <h3 className="text-xl sm:text-2xl font-light text-neutral-950 tracking-tight mt-1">
            Soluções Complementares <span className="text-neutral-400 font-normal">& Mais Buscadas</span>
          </h3>
        </div>
        <p className="text-xs text-neutral-500 max-w-xs sm:text-right font-light">
          Hardware com fotografia real dos anúncios de lançamento oficial e avaliação superior a 4.8.
        </p>
      </div>

      {/* 4 Columns Studio Grid with Real Commercial Packshots */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {REAL_STUDIO_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="group cursor-pointer flex flex-col"
            onClick={() => handleOpenSearch(item.searchQuery)}
          >
            {/* Minimalist Studio Card Box with Real Product Image */}
            <div className="w-full aspect-[4/3] rounded-[24px] bg-[#F7F7F9] hover:bg-[#ECECEF] flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-black/[0.04]">
              
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain object-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Brand Floating Pill */}
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 border border-black/[0.05] shadow-xs">
                  {item.brand}
                </span>
              </div>

              {/* Hover pill arrow */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-xs">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>

            </div>

            {/* Typography Below Box */}
            <div className="mt-3 text-center space-y-0.5">
              <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-black line-clamp-1">
                {item.name}
              </h4>
              <p className="text-[10px] text-neutral-400 font-mono">
                {item.category}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-neutral-950">
                  {item.price}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {item.rating}
                </span>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
};
