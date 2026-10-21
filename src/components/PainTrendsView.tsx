import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BarChart3, Search, Lightbulb, Users, Globe2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { PainTrendItem } from '../types';

interface PainTrendsViewProps {
  trends: PainTrendItem[];
  onDiagnosePain: (pain: string) => void;
}

export const PainTrendsView: React.FC<PainTrendsViewProps> = ({ trends, onDiagnosePain }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'Ergonomia & Saúde', 'Ambiente Doméstico', 'Produtividade & Foco', 'Comportamento Animal'];

  const filteredTrends = trends.filter(
    (t) => filterCategory === 'all' || t.category.toLowerCase().includes(filterCategory.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              RADAR DE DEMANDA REPRIMIDA (B2B INTELLIGENCE)
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-950 mt-1">
            Pain Trends Global.
            <span className="block text-neutral-400 font-normal">
              Oportunidades de Novos Produtos & Infoprodutos.
            </span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
          Mapeamento contínuo de fricções humanas cotidianas. Descubra lacunas de mercado não atendidas pelas soluções comerciais existentes.
        </p>
      </div>

      {/* Executive Metrics Bar (Clean Industrial Tech) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-6 rounded-[24px] bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
            <span>DORES MAPEADAS</span>
            <Globe2 className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-3xl sm:text-4xl font-light text-neutral-950 font-mono tracking-tight">
            1.482.910
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 font-mono">
            +3.4% nesta semana (América Latina & Global)
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
            <span>ÍNDICE MÉDIO DE RESOLUÇÃO</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-light text-neutral-950 font-mono tracking-tight flex items-baseline gap-1">
            94.2<span className="text-xl text-neutral-400">%</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-mono">
            Eficácia da prescrição em 3 camadas
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
            <span>DEMANDA B2B REPRIMIDA</span>
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-light text-neutral-950 font-mono tracking-tight">
            R$ 24.8M
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 font-mono">
            Volume de busca sem solução líder dominante
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono text-neutral-400 mr-2">Filtrar por Nicho:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-100'
            }`}
          >
            {cat === 'all' ? 'Todas as Categorias' : cat}
          </button>
        ))}
      </div>

      {/* Interactive Trends List */}
      <div className="space-y-4">
        {filteredTrends.map((trend) => (
          <motion.div
            key={trend.id}
            whileHover={{ y: -2 }}
            className={`p-6 rounded-[24px] bg-white border transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
              trend.isUserQuery
                ? 'border-neutral-950 bg-gradient-to-r from-neutral-50 to-white'
                : 'border-black/[0.05] hover:border-black/10'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                    {trend.category}
                  </span>
                  {trend.isUserQuery && (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-950 text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Pesquisado por Você
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-neutral-400">
                    Atualizado: {trend.dateAdded}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-neutral-950 tracking-tight">
                  "{trend.painQuery}"
                </h3>

                {/* Market Gap Highlight */}
                <div className="mt-3 p-3.5 rounded-2xl bg-[#F8F8FA] border border-black/[0.03] flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-800 font-semibold block">
                      Gap de Mercado — O que falta ser criado:
                    </span>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {trend.missingSolutionGap}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs font-mono text-neutral-500">
                  <span>Público: <strong className="text-neutral-800 font-normal">{trend.targetAudience}</strong></span>
                </div>
              </div>

              {/* Demand Score & Quick Actions */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-black/[0.04] gap-3">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Score de Oportunidade
                  </span>
                  <div className="flex items-baseline gap-1 lg:justify-end">
                    <span className="text-2xl font-mono font-semibold text-neutral-950">
                      {trend.unmetDemandScore}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/100</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    ~{(trend.monthlySearches / 1000).toFixed(0)}k buscas/mês
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(trend.id, trend.painQuery)}
                    className="p-2 rounded-full border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                    title="Copiar termo da dor"
                  >
                    {copiedId === trend.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onDiagnosePain(trend.painQuery)}
                    className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-all active:scale-95 shadow-xs"
                  >
                    <span>Diagnosticar</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
