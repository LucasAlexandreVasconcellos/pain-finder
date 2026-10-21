import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Activity, Gauge } from 'lucide-react';
import { PainAnatomyVector } from '../types';

interface ProblemAnatomyViewerProps {
  tags: string[];
  vectors?: PainAnatomyVector[];
}

export const ProblemAnatomyViewer: React.FC<ProblemAnatomyViewerProps> = ({ tags, vectors }) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(0);

  // Default fallback descriptions if vectors aren't provided
  const fallbackVectorTypes = [
    'Vetor Primário',
    'Mecanismo de Propagação',
    'Ponto Cego',
    'Gatilho de Cronificação',
  ];

  const fallbackDescriptions = [
    'Vetor primário de tensão: Onde a fricção física ou cognitiva se inicia.',
    'Mecanismo de propagação: Como o estresse se espalha para o restante da rotina.',
    'Ponto cego do usuário: Detalhe que costuma ser ignorado em tentativas comuns.',
    'Gatilho de cronificação: Fator que impede a resolução espontânea ao longo do tempo.',
  ];

  // Harmonize items: prioritize structured vectors, fallback to tags
  const items = vectors && vectors.length > 0
    ? vectors
    : tags.map((tag, idx) => ({
        tag,
        vectorType: fallbackVectorTypes[idx] || 'Vetor Estrutural',
        clinicalExplanation: fallbackDescriptions[idx] || 'Análise de fricção profunda mapeada pelo motor.',
        severity: idx === 0 ? 9 : idx === 1 ? 8 : idx === 2 ? 7 : 8,
      }));

  const getSeverityColor = (severity: number, isSelected: boolean) => {
    if (severity >= 9) return isSelected ? 'text-red-400 bg-red-950/60 border-red-500/30' : 'text-red-600 bg-red-50 border-red-200';
    if (severity >= 7) return isSelected ? 'text-amber-400 bg-amber-950/60 border-amber-500/30' : 'text-amber-700 bg-amber-50 border-amber-200';
    return isSelected ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  const getSeverityDot = (severity: number) => {
    if (severity >= 9) return 'bg-red-500';
    if (severity >= 7) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_6px_30px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-black/[0.04] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              VISTA EXPLODIDA DO PROBLEMA
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-neutral-950 mt-1">
            Anatomia Decomposta da Dor
          </h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-mono text-neutral-600 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-neutral-700" />
          <span>{items.length} Vetores Estruturais Identificados</span>
        </div>
      </div>

      {/* 4 Interactive Perspective Cards (Exploded Engineering Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-[1000px]">
        {items.map((item, idx) => {
          const isSelected = activeTagIndex === idx;
          const severity = item.severity || 8;

          return (
            <motion.div
              key={item.tag + idx}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveTagIndex(idx)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-950 text-white border-neutral-900 shadow-xl'
                  : 'bg-[#F9F9FB] text-neutral-900 border-black/[0.05] hover:bg-white hover:border-black/10'
              }`}
            >
              <div>
                {/* Card Header: Layer and Vector Type */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm ${
                      isSelected
                        ? 'bg-white/10 text-neutral-300'
                        : 'bg-black/[0.04] text-neutral-500'
                    }`}
                  >
                    {item.vectorType || `CAMADA 0${idx + 1}`}
                  </span>
                  
                  {/* Severity Badge */}
                  <div className={`flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${getSeverityColor(severity, isSelected)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getSeverityDot(severity)}`} />
                    <span>{severity}/10</span>
                  </div>
                </div>

                {/* Tag Name */}
                <h4
                  className={`text-sm font-semibold tracking-tight mb-2 leading-snug ${
                    isSelected ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {item.tag}
                </h4>

                {/* Clinical Contextualized Explanation */}
                <p
                  className={`text-xs leading-relaxed ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  {item.clinicalExplanation}
                </p>
              </div>

              {/* Technical Indicator Footer */}
              <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[10px] font-mono">
                <span className={isSelected ? 'text-emerald-400 font-medium' : 'text-neutral-400'}>
                  {isSelected ? '● Vetor em Inspeção' : 'Inspecionar'}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? 'translate-x-1 text-white' : 'text-neutral-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
