import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  Clock,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Search,
  Sparkles,
  Package,
  BookOpen,
  Cpu,
  Layers,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Tag,
  Star,
  ShieldCheck,
  ShoppingBag,
  Zap,
} from 'lucide-react';

import { SavedConsultation, PhysicalProduct, DigitalSolution } from '../types';
import { getProductStudioImage } from '../services/productImages';

interface HistoryViewProps {
  consultations: SavedConsultation[];
  onReopenConsultation: (consultation: SavedConsultation) => void;
  onDeleteConsultation: (id: string) => void;
  onClearAllHistory: () => void;
  onStartNewDiagnosis: () => void;
  onOpenProductDetails: (
    product: PhysicalProduct | DigitalSolution,
    type: 'physical' | 'digital'
  ) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  consultations,
  onReopenConsultation,
  onDeleteConsultation,
  onClearAllHistory,
  onStartNewDiagnosis,
  onOpenProductDetails,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'consultations' | 'products'>('consultations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<'all' | 'physical' | 'digital'>('all');
  const [expandedTriageId, setExpandedTriageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Aggregated products with reference to their parent consultation
  const allRecommendedProducts = useMemo(() => {
    const list: Array<{
      item: PhysicalProduct | DigitalSolution;
      type: 'physical' | 'digital';
      consultationId: string;
      consultationDate: string;
      consultationPain: string;
      category: string;
    }> = [];

    const seenNames = new Set<string>();

    consultations.forEach(c => {
      // Physical Products
      (c.prescription?.layer02_PhysicalProducts || c.physicalProducts || []).forEach(p => {
        const key = `p_${p.name.toLowerCase().trim()}`;
        if (!seenNames.has(key)) {
          seenNames.add(key);
          list.push({
            item: p,
            type: 'physical',
            consultationId: c.id,
            consultationDate: c.formattedDate,
            consultationPain: c.userPain,
            category: p.category || c.detectedCategory,
          });
        }
      });

      // Digital Solutions
      (c.prescription?.layer03_DigitalSolutions || c.digitalSolutions || []).forEach(d => {
        const key = `d_${d.name.toLowerCase().trim()}`;
        if (!seenNames.has(key)) {
          seenNames.add(key);
          list.push({
            item: d,
            type: 'digital',
            consultationId: c.id,
            consultationDate: c.formattedDate,
            consultationPain: c.userPain,
            category: d.format || c.detectedCategory,
          });
        }
      });
    });

    return list;
  }, [consultations]);

  // Filter consultations
  const filteredConsultations = useMemo(() => {
    if (!searchQuery.trim()) return consultations;
    const q = searchQuery.toLowerCase();
    return consultations.filter(
      c =>
        c.userPain.toLowerCase().includes(q) ||
        c.detectedCategory.toLowerCase().includes(q) ||
        c.prescription?.rootCauseAnalysis?.toLowerCase().includes(q) ||
        (c.prescription?.layer02_PhysicalProducts || []).some(p => p.name.toLowerCase().includes(q)) ||
        (c.prescription?.layer03_DigitalSolutions || []).some(d => d.name.toLowerCase().includes(q))
    );
  }, [consultations, searchQuery]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = allRecommendedProducts;
    if (selectedProductType !== 'all') {
      result = result.filter(p => p.type === selectedProductType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.item.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.consultationPain.toLowerCase().includes(q) ||
          (p.item as any).brandName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allRecommendedProducts, selectedProductType, searchQuery]);

  // Copy full prescription report to clipboard
  const handleCopyReport = (c: SavedConsultation) => {
    const rx = c.prescription;
    const immediateStepsText = rx?.layer01_ImmediateRelief?.steps
      ?.map(s => `${s.stepNumber}. ${s.actionTitle} (${s.timeRequired})\n   ${s.description}`)
      .join('\n') || '';

    const physicalProductsText = rx?.layer02_PhysicalProducts
      ?.map(p => `• [FÍSICO] ${p.name} - R$ ${p.estimatedPriceBRL}\n   Por que resolve: ${p.whyItSolves}`)
      .join('\n') || '';

    const digitalSolutionsText = rx?.layer03_DigitalSolutions
      ?.map(d => `• [DIGITAL] ${d.name} (${d.format}) - R$ ${d.estimatedPriceBRL}\n   Promessa: ${d.transformationPromise}`)
      .join('\n') || '';

    const report = `📋 RELATÓRIO DE PRESCRIÇÃO CLÍNICA - PAIN FINDER
Data: ${c.formattedDate}
Categoria: ${c.detectedCategory}
Queixa do Usuário: "${c.userPain}"

🔬 ANÁLISE DE CAUSA-RAIZ:
${rx?.rootCauseAnalysis || 'N/A'}

⚡ CAMADA 01 - PROTOCOLO DE ALÍVIO IMEDIATO (CUSTO ZERO):
${immediateStepsText}

🛠️ CAMADA 02 - ENGENHARIA FÍSICA & HARDWARE RECOMENDADO:
${physicalProductsText}

📚 CAMADA 03 - SISTEMAS DIGITAIS & INFOPRODUTOS RECOMENDADOS:
${digitalSolutionsText}

Gerado via Pain Finder • Tecnologia Industrial Calm Tech`;

    navigator.clipboard.writeText(report);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalPhysicalCount = consultations.reduce(
    (acc, c) => acc + (c.prescription?.layer02_PhysicalProducts?.length || c.physicalProducts?.length || 0),
    0
  );
  const totalDigitalCount = consultations.reduce(
    (acc, c) => acc + (c.prescription?.layer03_DigitalSolutions?.length || c.digitalSolutions?.length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.06] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-black/[0.04]">
              <History className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-600 font-semibold">
                MÓDULO DE HISTÓRICO & ACERVO • V3.8
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900">
              Histórico de Consultas & Acervo de Soluções
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 max-w-2xl font-normal leading-relaxed">
              Consulte seus diagnósticos anteriores, reabra planos de ação em 3 camadas e explore o catálogo centralizado de todos os produtos e métodos já recomendados.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {consultations.length > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-50 hover:bg-red-50 text-neutral-600 hover:text-red-600 text-xs font-medium border border-black/[0.06] hover:border-red-200 transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </button>
            )}

            <button
              onClick={onStartNewDiagnosis}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium shadow-md hover:bg-neutral-800 transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Novo Diagnóstico</span>
            </button>
          </div>
        </div>

        {/* Metrics Counter Bar */}
        <div className="mt-8 pt-6 border-t border-black/[0.05] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#F9F9FB] rounded-2xl p-4 border border-black/[0.03]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
              Consultas Realizadas
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 font-mono">
              {consultations.length}
            </div>
          </div>

          <div className="bg-[#F9F9FB] rounded-2xl p-4 border border-black/[0.03]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
              Produtos Físicos Mapeados
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 font-mono">
              {totalPhysicalCount}
            </div>
          </div>

          <div className="bg-[#F9F9FB] rounded-2xl p-4 border border-black/[0.03]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
              Sistemas Digitais & Cursos
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 font-mono">
              {totalDigitalCount}
            </div>
          </div>

          <div className="bg-[#F9F9FB] rounded-2xl p-4 border border-black/[0.03]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
              Itens no Acervo Único
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-emerald-600 font-mono">
              {allRecommendedProducts.length}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Clear All History */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.08] space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                Limpar todo o histórico de consultas?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Essa ação apagará todas as {consultations.length} consultas salvas e os produtos previamente catalogados neste dispositivo. Essa ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onClearAllHistory();
                  setShowConfirmClear(false);
                }}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm transition-colors"
              >
                Confirmar e Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Sub-Nav & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="inline-flex p-1 bg-white rounded-full border border-black/[0.06] shadow-xs">
          <button
            onClick={() => setActiveSubTab('consultations')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
              activeSubTab === 'consultations'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Consultas Salvas ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
              activeSubTab === 'products'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Acervo de Produtos ({allRecommendedProducts.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'consultations'
                ? 'Buscar por dor, sintoma ou produto...'
                : 'Buscar produto por nome, marca ou categoria...'
            }
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-black/[0.08] text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-neutral-100"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: CONSULTAS SALVAS */}
      {activeSubTab === 'consultations' && (
        <div className="space-y-6">
          {filteredConsultations.length === 0 ? (
            <div className="rounded-3xl bg-white border border-black/[0.05] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <History className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-neutral-800">
                  {searchQuery ? 'Nenhuma consulta encontrada com esse filtro' : 'Nenhuma consulta armazenada'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {searchQuery
                    ? 'Tente utilizar outros termos de busca como "costas", "computador" ou "limpeza".'
                    : 'Suas prescrições e análises clínicas serão salvas automaticamente aqui assim que você concluir seu primeiro diagnóstico.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={onStartNewDiagnosis}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium shadow-xs hover:bg-neutral-800 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Realizar Diagnóstico Agora</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConsultations.map(c => {
                const rx = c.prescription;
                const isTriageExpanded = expandedTriageId === c.id;
                const triageAnswerKeys = Object.keys(c.triageAnswers || {});

                const physicalCount = rx?.layer02_PhysicalProducts?.length || c.physicalProducts?.length || 0;
                const digitalCount = rx?.layer03_DigitalSolutions?.length || c.digitalSolutions?.length || 0;
                const immediateCount = rx?.layer01_ImmediateRelief?.steps?.length || 3;

                return (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group rounded-3xl bg-white border border-black/[0.06] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:border-black/[0.12] transition-all duration-200"
                  >
                    {/* Header: Date + Category Badge + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.04]">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-mono font-medium">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{c.formattedDate}</span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-[10px] font-medium tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {c.detectedCategory}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyReport(c)}
                          title="Copiar relatório completo"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-xs font-medium border border-black/[0.04] transition-colors"
                        >
                          {copiedId === c.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 text-[11px]">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-[11px]">Copiar</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onDeleteConsultation(c.id)}
                          title="Excluir esta consulta"
                          className="p-1.5 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Problem Description Quote */}
                    <div className="pt-4 space-y-3">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                          Queixa Apresentada
                        </div>
                        <p className="text-base sm:text-lg font-medium text-neutral-900 leading-snug">
                          “{c.userPain}”
                        </p>
                      </div>

                      {/* Root Cause Snippet */}
                      {rx?.rootCauseAnalysis && (
                        <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-black/[0.03] space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                            <Cpu className="w-3.5 h-3.5 text-neutral-700" />
                            <span>Diagnóstico da Causa-Raiz</span>
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
                            {rx.rootCauseAnalysis}
                          </p>
                        </div>
                      )}

                      {/* 3-Layer Highlights Pill Summary */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-mono">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Camada 01: {immediateCount} micro-ações imediatas</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-mono">
                          <Package className="w-3 h-3 text-blue-500" />
                          <span>Camada 02: {physicalCount} hardware(s) prescrito(s)</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-mono">
                          <BookOpen className="w-3 h-3 text-purple-500" />
                          <span>Camada 03: {digitalCount} infoproduto(s)</span>
                        </div>
                      </div>

                      {/* Triage Answers Expandable Drawer */}
                      {triageAnswerKeys.length > 0 && (
                        <div className="pt-2">
                          <button
                            onClick={() => setExpandedTriageId(isTriageExpanded ? null : c.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1"
                          >
                            <span>{isTriageExpanded ? 'Ocultar' : 'Ver'} respostas fornecidas na triagem ({triageAnswerKeys.length})</span>
                            {isTriageExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isTriageExpanded && (
                            <div className="mt-2.5 p-4 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-2.5 animate-in fade-in duration-200">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                Calibragem da Triagem Cirúrgica:
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {Object.entries(c.triageAnswers).map(([qKey, aVal], idx) => (
                                  <div key={qKey} className="bg-white p-3 rounded-xl border border-black/[0.04]">
                                    <div className="text-[10px] font-mono text-neutral-400 mb-1">
                                      Pergunta #{idx + 1}
                                    </div>
                                    <div className="text-xs text-neutral-800 font-medium leading-snug">
                                      {aVal}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Footer: Reopen Action */}
                      <div className="pt-3 flex items-center justify-between">
                        <div className="text-[11px] text-neutral-400 font-mono">
                          ID: #{c.id.slice(-8)}
                        </div>

                        <button
                          onClick={() => onReopenConsultation(c)}
                          className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
                        >
                          <span>Reabrir Prescrição Completa</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ACERVO DE PRODUTOS RECOMENDADOS */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          
          {/* Sub-Filters: All, Physical, Digital */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedProductType('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedProductType === 'all'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-50'
              }`}
            >
              Todos ({allRecommendedProducts.length})
            </button>

            <button
              onClick={() => setSelectedProductType('physical')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedProductType === 'physical'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Hardware Físico ({allRecommendedProducts.filter(p => p.type === 'physical').length})</span>
            </button>

            <button
              onClick={() => setSelectedProductType('digital')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedProductType === 'digital'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-black/[0.06] hover:bg-neutral-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Infoprodutos & Métodos ({allRecommendedProducts.filter(p => p.type === 'digital').length})</span>
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white border border-black/[0.05] p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-neutral-800">
                  {searchQuery ? 'Nenhum produto corresponde à busca' : 'Nenhum produto catalogado ainda'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {searchQuery
                    ? 'Tente pesquisar por marcas consagradas como "Logitech", "Xiaomi", "FlyLady" ou "KONG".'
                    : 'Assim que você gerar diagnósticos clínicos, todas as soluções de engenharia física e infoprodutos recomendados serão acumulados nesta galeria.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={onStartNewDiagnosis}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium shadow-xs hover:bg-neutral-800 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Descobrir Produtos para Minha Dor</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(({ item, type, consultationDate, consultationPain }, idx) => {
                const isPhysical = type === 'physical';
                const phys = item as PhysicalProduct;
                const digi = item as DigitalSolution;

                const cat = isPhysical ? (phys.category || 'Ergonomia') : (digi.format || 'Digital');
                const studioImg = getProductStudioImage(item.name, cat, type, item.imageUrl);
                const storeLink = isPhysical
                  ? phys.directUrl || `https://www.amazon.com.br/s?k=${encodeURIComponent(phys.searchQueryAmazon || phys.name)}`
                  : digi.directUrl || `https://www.google.com/search?q=${encodeURIComponent(digi.searchQueryPlatform || digi.name)}`;

                const painReason = isPhysical ? phys.whyItSolves : digi.transformationPromise;

                return (
                  <motion.div
                    key={`${type}_${item.name}_${idx}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="group rounded-3xl bg-white border border-black/[0.06] overflow-hidden flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-black/[0.14] transition-all duration-300"
                  >
                    {/* Top Image Showcase */}
                    <div className="relative aspect-4/3 w-full bg-[#FAFAFC] overflow-hidden border-b border-black/[0.04] p-4 flex items-center justify-center">
                      <img
                        src={studioImg}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                        loading="lazy"
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase shadow-xs ${
                          isPhysical
                            ? 'bg-neutral-900 text-white'
                            : 'bg-purple-900 text-white'
                        }`}>
                          {isPhysical ? <Package className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
                          {isPhysical ? 'Hardware Físico' : digi.format || 'Infoproduto'}
                        </span>

                        {item.brandName && (
                          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 text-[10px] font-mono font-medium border border-black/[0.06]">
                            {item.brandName}
                          </span>
                        )}
                      </div>

                      {/* Pain Score Pill */}
                      {item.painScore && (
                        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{item.painScore.toFixed(1)}/10</span>
                        </div>
                      )}
                    </div>

                    {/* Body Information */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug group-hover:text-neutral-950 transition-colors">
                          {item.name}
                        </h3>

                        {/* Conversion Headline or Why it Solves */}
                        <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                          {painReason}
                        </p>
                      </div>

                      {/* Origin Reference Tag */}
                      <div className="pt-2 border-t border-black/[0.04] space-y-1">
                        <div className="text-[10px] font-mono text-neutral-400">
                          Recomendado em {consultationDate} para:
                        </div>
                        <div className="text-[11px] text-neutral-700 font-medium truncate">
                          “{consultationPain}”
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Valor Estimado
                          </div>
                          <div className="text-base sm:text-lg font-bold text-neutral-950 font-mono">
                            R$ {item.estimatedPriceBRL}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenProductDetails(item, type)}
                            className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium transition-colors"
                          >
                            Detalhes
                          </button>

                          <a
                            href={storeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-[11px] font-medium hover:bg-neutral-800 transition-all shadow-xs active:scale-95"
                          >
                            <span>Comprar</span>
                            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover/link:text-white transition-colors" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
