/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
  ThumbsUp,
  Cpu,
  Layers,
  ChevronLeft,
  Search,
  ShoppingCart,
  BookOpen,
  SlidersHorizontal,
  Clock,
  Sparkle,
  ShieldCheck,
  Truck,
  Star,
  CreditCard,
  ShoppingBag,
  Zap,
  Award,
  Check,
  Package,
  BadgeCheck,
} from 'lucide-react';

import { ActiveTab, TriageResponse, PrescriptionResponse, PartnerProduct, PainTrendItem, PhysicalProduct, DigitalSolution, B2BMarketIntel, SavedConsultation } from './types';
import { INITIAL_PARTNER_PRODUCTS, INITIAL_PAIN_TRENDS } from './services/fallbackData';
import { requestTriage, requestPrescription } from './services/api';
import { getProductStudioImage } from './services/productImages';

import { BrandLogo } from './components/BrandLogo';
import { Navbar } from './components/Navbar';
import { DecompressionCapsule } from './components/DecompressionCapsule';
import { ExplodedViewTransition } from './components/ExplodedViewTransition';
import { ProblemAnatomyViewer } from './components/ProblemAnatomyViewer';
import { TriageLoadingTransition } from './components/TriageLoadingTransition';
import { StudioProductGrid } from './components/StudioProductGrid';
import { WavesBanner } from './components/WavesBanner';
import { TechAnatomyView } from './components/TechAnatomyView';
import { PainTrendsView } from './components/PainTrendsView';
import { PartnersView } from './components/PartnersView';
import { HistoryView } from './components/HistoryView';
import { PaidSolutionsShowcase } from './components/PaidSolutionsShowcase';
import { PaidProductCard } from './components/PaidProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';

const QUICK_INSPIRATION_CHIPS = [
  'Estou com problemas para manter a faxina de casa em dia',
  'Dores nas costas e fadiga mental no fim do home office',
  'Não consigo manter constância nos estudos e procrastino',
  'Meu cachorro fica ansioso e destrói coisas quando saio',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnose');
  
  // Storage State
  const [partnerProducts, setPartnerProducts] = useState<PartnerProduct[]>(() => {
    try {
      const saved = localStorage.getItem('painfinder_partners');
      return saved ? JSON.parse(saved) : INITIAL_PARTNER_PRODUCTS;
    } catch {
      return INITIAL_PARTNER_PRODUCTS;
    }
  });

  const [painTrends, setPainTrends] = useState<PainTrendItem[]>(() => {
    try {
      const saved = localStorage.getItem('painfinder_trends');
      return saved ? JSON.parse(saved) : INITIAL_PAIN_TRENDS;
    } catch {
      return INITIAL_PAIN_TRENDS;
    }
  });

  const [savedConsultations, setSavedConsultations] = useState<SavedConsultation[]>(() => {
    try {
      const saved = localStorage.getItem('painfinder_consultations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('painfinder_partners', JSON.stringify(partnerProducts));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [partnerProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('painfinder_trends', JSON.stringify(painTrends));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [painTrends]);

  useEffect(() => {
    try {
      localStorage.setItem('painfinder_consultations', JSON.stringify(savedConsultations));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [savedConsultations]);

  // Diagnosis Flow State
  // Steps: 'hero' | 'calibrating' | 'triage' | 'synthesizing' | 'prescription' | 'emergency'
  const [stage, setStage] = useState<'hero' | 'calibrating' | 'triage' | 'synthesizing' | 'prescription' | 'emergency'>('hero');
  const [userInput, setUserInput] = useState('');
  const [isTriageLoading, setIsTriageLoading] = useState(false);
  const [triageData, setTriageData] = useState<TriageResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionResponse | null>(null);

  // Immediate Relief Checklist Progress (Camada 01)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Quick View Modal for Paid Products
  const [modalProduct, setModalProduct] = useState<{
    product: PhysicalProduct | DigitalSolution;
    type: 'physical' | 'digital';
  } | null>(null);

  // Floating Conversion Bar Visibility
  const [showFloatingBar, setShowFloatingBar] = useState(true);

  const handleOpenProductDetails = (
    product: PhysicalProduct | DigitalSolution,
    type: 'physical' | 'digital'
  ) => {
    setModalProduct({ product, type });
  };

  // Reset Diagnosis
  const handleResetDiagnosis = () => {
    setStage('hero');
    setUserInput('');
    setTriageData(null);
    setSelectedAnswers({});
    setPrescriptionData(null);
    setCompletedSteps({});
    setModalProduct(null);
  };

  // Add new query to B2B Pain Trends automatically
  const registerPainToTrends = (query: string, category: string, intel?: B2BMarketIntel) => {
    const existing = painTrends.some(t => t.painQuery.toLowerCase() === query.toLowerCase());
    if (existing) return;

    const newTrend: PainTrendItem = {
      id: `trend-user-${Date.now()}`,
      painQuery: query,
      category: category || 'Demanda do Usuário',
      monthlySearches: intel?.estimatedMonthlySearches || 240000,
      unmetDemandScore: intel?.unmetDemandScore || 88,
      missingSolutionGap: intel?.missingSolutionGap || 'Dispositivo ou sistema integrado que elimine o atrito sem fricção mental.',
      targetAudience: intel?.targetAudience || 'Profissionais e consumidores afetados',
      dateAdded: 'Agora mesmo',
      isUserQuery: true,
    };

    setPainTrends(prev => [newTrend, ...prev]);
  };

  // Action: Start Diagnosis (Call 1)
  const handleStartDiagnosis = async (painOverride?: string) => {
    const painToProcess = (painOverride || userInput).trim();
    if (!painToProcess) return;

    if (painOverride) {
      setUserInput(painOverride);
    }

    setIsTriageLoading(true);
    setStage('calibrating');
    window.scrollTo({ top: 120, behavior: 'smooth' });

    try {
      const [triage] = await Promise.all([
        requestTriage(painToProcess),
        new Promise(resolve => setTimeout(resolve, 1800)),
      ]);
      setTriageData(triage);

      if (triage.isSafetyEmergency) {
        setStage('emergency');
        return;
      }

      registerPainToTrends(painToProcess, triage.detectedCategory, triage.b2bMarketIntel);
      setStage('triage');
      window.scrollTo({ top: 220, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setStage('hero');
    } finally {
      setIsTriageLoading(false);
    }
  };

  // Action: Select Triage Option
  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Action: Synthesize Prescription (Call 2)
  const handleSynthesize = async () => {
    if (!triageData) return;

    setStage('synthesizing');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Simulate/Allow minimum presentation of exploded view animation
      const [prescription] = await Promise.all([
        requestPrescription(userInput, selectedAnswers, partnerProducts),
        new Promise(resolve => setTimeout(resolve, 3800)),
      ]);

      if (prescription.isSafetyEmergency) {
        setStage('emergency');
        return;
      }

      setPrescriptionData(prescription);
      setCompletedSteps({});

      // Auto-save generated diagnosis to persistent history
      const newConsultation: SavedConsultation = {
        id: `consultation_${Date.now()}`,
        timestamp: new Date().toISOString(),
        formattedDate: new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date()),
        userPain: userInput,
        detectedCategory: triageData.detectedCategory,
        triageAnswers: selectedAnswers,
        prescription,
        physicalProducts: prescription.layer02_PhysicalProducts || [],
        digitalSolutions: prescription.layer03_DigitalSolutions || [],
      };
      setSavedConsultations(prev => [newConsultation, ...prev]);

      setStage('prescription');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Prescription synthesis error:', err);
      setStage('hero');
    }
  };

  // Reopen consultation from history into full prescription view
  const handleReopenConsultation = (consultation: SavedConsultation) => {
    setUserInput(consultation.userPain);
    setSelectedAnswers(consultation.triageAnswers || {});
    setPrescriptionData(consultation.prescription);
    setCompletedSteps({});
    setStage('prescription');
    setActiveTab('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConsultation = (id: string) => {
    setSavedConsultations(prev => prev.filter(c => c.id !== id));
  };

  const handleClearAllHistory = () => {
    setSavedConsultations([]);
  };

  // Toggle step completion in Camada 01
  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const calculatedReliefProgress = prescriptionData?.layer01_ImmediateRelief?.steps
    ? Math.round(
        (Object.values(completedSteps).filter(Boolean).length /
          prescriptionData.layer01_ImmediateRelief.steps.length) *
          100
      )
    : 0;

  // Add partner product
  const handleAddPartnerProduct = (newProd: Omit<PartnerProduct, 'id'>) => {
    const product: PartnerProduct = {
      ...newProd,
      id: `user_${Date.now()}`,
    };
    setPartnerProducts(prev => [product, ...prev]);
  };

  const handleRemovePartnerProduct = (id: string) => {
    setPartnerProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#0A0A0A] font-sans flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasOngoingDiagnosis={stage !== 'hero'}
        onResetDiagnosis={handleResetDiagnosis}
        savedConsultationsCount={savedConsultations.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* TAB 1: DIAGNOSE (PRIMARY FLOW) */}
        {activeTab === 'diagnose' && (
          <div>
            <AnimatePresence mode="wait">
              {/* ETAPA 1: HERO & CAPTURA DA DOR */}
              {stage === 'hero' && (
                <motion.div
                  key="hero-stage"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-4 sm:pt-10 pb-16"
                >
                  
                  {/* Left Column: Dual-Tone Title & Engineered Command Input */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Status Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/[0.04] shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                        SISTEMA DE PRESCRIÇÃO INDUSTRIAL • V3.8 FLASH
                      </span>
                    </div>

                    {/* Dual-Tone Signature Title */}
                    <div className="space-y-1">
                      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] text-[#0A0A0A]">
                        Projetado para o Alívio.
                      </h1>
                      <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.03em] leading-[1.05] text-neutral-400">
                        Desenhado para a Vida.
                      </h2>
                    </div>

                    {/* Clinical Description */}
                    <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-xl">
                      Descreva qualquer atrito cotidiano, dor física, desgaste mental ou ineficiência de rotina. Nossa inteligência decompõe a causa-raiz e prescreve o protocolo cirúrgico em 3 camadas: hábitos imediatos, hardware consagrado e sistemas mentais.
                    </p>

                    {/* Engineered Command Box (Fluid Pure White Textarea) */}
                    <div className="relative rounded-[28px] bg-white p-5 sm:p-6 border border-black/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.1)] focus-within:border-black/10">
                      <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] text-[11px] font-mono text-neutral-400">
                        <span className="flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                          ENTRADA DE SINTOMA CLÍNICO
                        </span>
                        <span>{userInput.length} caracteres</span>
                      </div>

                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ex: Não consigo manter constância nos estudos e perco horas no celular, ou sinto fortes dores na lombar após 5 horas no home office..."
                        rows={3}
                        className="w-full mt-3 bg-transparent text-sm sm:text-base text-neutral-950 placeholder:text-neutral-400 focus:outline-none resize-none leading-relaxed"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleStartDiagnosis();
                          }
                        }}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 mt-2 border-t border-black/[0.04] gap-3">
                        <span className="text-[11px] font-mono text-neutral-400">
                          Atalho: <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">Ctrl + Enter</kbd>
                        </span>

                        {/* Pill CTA Button */}
                        <button
                          onClick={() => handleStartDiagnosis()}
                          disabled={!userInput.trim() || isTriageLoading}
                          className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
                            userInput.trim() && !isTriageLoading
                              ? 'bg-neutral-950 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-neutral-800'
                              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{isTriageLoading ? 'Calibrando Espectro...' : 'Iniciar Diagnóstico'}</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Inspiration Pills */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Ou explore fricções frequentes:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_INSPIRATION_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => {
                              setUserInput(chip);
                              handleStartDiagnosis(chip);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white text-neutral-700 text-xs font-medium border border-black/[0.05] hover:bg-neutral-100 hover:text-neutral-950 hover:border-black/10 transition-all duration-150 shadow-xs text-left"
                          >
                            {chip} ↗
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Interactive Sculptural Decompression Capsule */}
                  <div className="lg:col-span-5 flex items-center justify-center">
                    <DecompressionCapsule
                      inputLength={userInput.length}
                      categoryHint={userInput.length > 5 ? 'Atrito em Calibração' : 'Repouso Acústico'}
                    />
                  </div>

                </motion.div>
              )}

              {/* ETAPA 1.5: CALIBRAÇÃO CLÍNICA / TELA DE CARREGAMENTO INTELIGENTE */}
              {stage === 'calibrating' && (
                <motion.div
                  key="calibrating-stage"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <TriageLoadingTransition userPain={userInput} />
                </motion.div>
              )}

              {/* ETAPA 2: MICRO-TRIAGEM INTERATIVA (DRAWER / STEPPER ANIMADO) */}
              {stage === 'triage' && triageData && (
                <motion.div
                  key="triage-stage"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-4xl mx-auto py-8 space-y-8"
                >
                {/* Stepper Header */}
                <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                  <button
                    onClick={() => setStage('hero')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Voltar à dor inicial</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      CALIBRAÇÃO DE CONTEXTO
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                </div>

                {/* Diagnosis Category & Empathy Card */}
                <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                      Categoria Detectada: {triageData.detectedCategory}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      3 Perguntas Cirúrgicas
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-light text-neutral-900 leading-relaxed italic">
                    "{triageData.empathySummary}"
                  </p>
                </div>

                {/* The 3 AI Questions in Numbered Cards 01, 02, 03 */}
                <div className="space-y-6">
                  {triageData.questions.map((q, idx) => {
                    const selected = selectedAnswers[q.id];

                    return (
                      <div
                        key={q.id}
                        className="p-6 sm:p-8 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_6px_25px_rgba(0,0,0,0.02)] space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-2xl sm:text-3xl font-light font-mono text-neutral-400 shrink-0">
                            0{idx + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-950">
                              {q.question}
                            </h3>
                          </div>
                        </div>

                        {/* Tactile Pill Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {q.options.map((opt) => {
                            const isChosen = selected === opt;

                            return (
                              <button
                                key={opt}
                                onClick={() => handleSelectOption(q.id, opt)}
                                className={`text-left px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-200 active:scale-98 border ${
                                  isChosen
                                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-md'
                                    : 'bg-[#F9F9FB] text-neutral-700 border-black/[0.04] hover:bg-white hover:border-black/10'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span>{opt}</span>
                                  {isChosen ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Synthesis Trigger Button */}
                <div className="p-6 rounded-[28px] bg-[#ECECEF] border border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-xs font-semibold text-neutral-950 uppercase font-mono">
                      {Object.keys(selectedAnswers).length === triageData.questions.length
                        ? 'Calibragem Concluída'
                        : `Responda as ${triageData.questions.length - Object.keys(selectedAnswers).length} perguntas restantes`}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pronto para cruzar com catálogo físico, hábitos e infoprodutos.
                    </p>
                  </div>

                  <button
                    onClick={handleSynthesize}
                    disabled={Object.keys(selectedAnswers).length < triageData.questions.length}
                    className={`group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
                      Object.keys(selectedAnswers).length === triageData.questions.length
                        ? 'bg-neutral-950 text-white shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-neutral-800'
                        : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Sintetizar Prescrição Global</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* ETAPA 3: TRANSIÇÃO "VISTA EXPLODIDA" (PROCESSAMENTO) */}
            {stage === 'synthesizing' && (
              <motion.div
                key="synthesizing-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExplodedViewTransition />
              </motion.div>
            )}

            {/* ETAPA 4: A PRESCRIÇÃO EM 3 CAMADAS (LAYOUT EDITORIAL NUMERADO) */}
            {stage === 'prescription' && prescriptionData && (
              <motion.div
                key="prescription-stage"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="py-6 pb-32 space-y-16"
              >
                
                {/* 1. Header do Diagnóstico Dual-Tone + Root Cause */}
                <div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/[0.04] text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>PRESCRIÇÃO VALIDADA EM 3 NÍVEIS</span>
                  </div>

                  {/* Dual-Tone Diagnosis Title */}
                  <div className="space-y-1">
                    <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.08] text-neutral-950">
                      {prescriptionData.diagnosisTitle.part1Dark}
                    </h2>
                    <h3 className="text-3xl sm:text-5xl font-light tracking-[-0.03em] leading-[1.08] text-neutral-400">
                      {prescriptionData.diagnosisTitle.part2Gray}
                    </h3>
                  </div>

                  {/* Root Cause Analysis (2 Elegant Sentences) */}
                  <div className="p-6 rounded-[24px] bg-white border border-black/[0.05] shadow-[0_4px_25px_rgba(0,0,0,0.02)] mt-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                      ANÁLISE DE CAUSA-RAIZ
                    </span>
                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                      {prescriptionData.rootCauseAnalysis}
                    </p>
                  </div>
                </div>

                {/* Horizontal Interactive Problem Anatomy Viewer (Perspective Tags) */}
                <div className="max-w-5xl mx-auto">
                  <ProblemAnatomyViewer
                    tags={prescriptionData.painAnatomyTags || []}
                    vectors={prescriptionData.painAnatomyVectors}
                  />
                </div>

                {/* 00. DESTAQUE SUPREMO: VITRINE DE SOLUÇÕES PAGAS (ALTA CONVERSÃO & IMAGENS DE PRODUTOS) */}
                <div className="max-w-5xl mx-auto pt-4">
                  <PaidSolutionsShowcase
                    physicalProducts={prescriptionData.layer02_PhysicalProducts || []}
                    digitalSolutions={prescriptionData.layer03_DigitalSolutions || []}
                    onOpenDetails={handleOpenProductDetails}
                  />
                </div>

                {/* SEÇÃO 01 — Protocolo de Alívio Imediato (Custo Zero) */}
                <div className="max-w-5xl mx-auto pt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Asymmetric Left Header */}
                    <div className="lg:col-span-5 space-y-3">
                      <span className="text-5xl sm:text-7xl font-light font-mono text-neutral-900 block leading-none">
                        01
                      </span>
                      <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                        {prescriptionData.layer01_ImmediateRelief.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                        {prescriptionData.layer01_ImmediateRelief.subtitle}
                      </p>

                      {/* Interactive Progress Meter */}
                      <div className="p-4 rounded-2xl bg-white border border-black/[0.05] mt-6 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-500">Alívio Imediato Ativado:</span>
                          <span className="font-semibold text-neutral-950">{calculatedReliefProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            animate={{ width: `${calculatedReliefProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono mt-2">
                          Marque os passos conforme executá-los para aferir o alívio imediato.
                        </p>
                      </div>
                    </div>

                    {/* Asymmetric Right Checklist Cards */}
                    <div className="lg:col-span-7 space-y-3">
                      {prescriptionData.layer01_ImmediateRelief.steps.map((step) => {
                        const isDone = completedSteps[step.stepNumber];

                        return (
                          <div
                            key={step.stepNumber}
                            onClick={() => toggleStep(step.stepNumber)}
                            className={`cursor-pointer p-5 sm:p-6 rounded-[24px] border transition-all duration-200 ${
                              isDone
                                ? 'bg-white border-emerald-500/30 shadow-xs'
                                : 'bg-white border-black/[0.05] hover:border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <button
                                type="button"
                                className="mt-1 text-emerald-600 focus:outline-none"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-5 h-5 text-neutral-300" />
                                )}
                              </button>

                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  {step.vectorType ? (
                                    <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-600 border border-black/[0.04]">
                                      {step.vectorType}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                                      PASSO 0{step.stepNumber}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 shrink-0">
                                    {step.timeRequired}
                                  </span>
                                </div>
                                <h4 className={`text-sm font-semibold tracking-tight ${isDone ? 'line-through text-neutral-400' : 'text-neutral-950'}`}>
                                  {step.actionTitle}
                                </h4>
                                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* SEÇÃO 02 — Arquitetura Física (Hardware & Produtos com Imagem e Alta Conversão) */}
                <div className="max-w-5xl mx-auto pt-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Asymmetric Header */}
                    <div className="lg:col-span-5 space-y-3 lg:order-2">
                      <span className="text-5xl sm:text-7xl font-light font-mono text-neutral-900 block leading-none">
                        02
                      </span>
                      <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                        Tecnologia Física que Elimina o Atrito.
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                        Hardware consagrado que substitui a carga mecânica e restaura ergonomia. Cada item traz fotografia real de estúdio, especificações do pacote e compra transparente nas melhores plataformas.
                      </p>
                    </div>

                    {/* Left Product Cards with High-Res Images & Package Breakdown */}
                    <div className="lg:col-span-7 space-y-6 lg:order-1">
                      {prescriptionData.layer02_PhysicalProducts.map((prod, idx) => (
                        <PaidProductCard
                          key={`layer2-phys-${idx}`}
                          product={prod}
                          type="physical"
                          onOpenDetails={handleOpenProductDetails}
                        />
                      ))}
                    </div>

                  </div>
                </div>

                {/* SEÇÃO 03 — Conhecimento & Sistemas (Infoprodutos & Ferramentas Digitais) */}
                <div className="max-w-5xl mx-auto pt-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Asymmetric Header */}
                    <div className="lg:col-span-5 space-y-3">
                      <span className="text-5xl sm:text-7xl font-light font-mono text-neutral-900 block leading-none">
                        03
                      </span>
                      <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                        Design Mental. Impacto Definitivo.
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                        O hardware resolve a fricção externa; os sistemas mentais resolvem a raiz cognitiva. Métodos estruturados e templates para blindar sua rotina contra recaídas, com acesso imediato e garantia.
                      </p>
                    </div>

                    {/* Right Infoproduct Cards with Visuals & Access Contents */}
                    <div className="lg:col-span-7 space-y-6">
                      {prescriptionData.layer03_DigitalSolutions.map((sol, idx) => (
                        <PaidProductCard
                          key={`layer3-digi-${idx}`}
                          product={sol}
                          type="digital"
                          onOpenDetails={handleOpenProductDetails}
                        />
                      ))}
                    </div>

                  </div>
                </div>

                {/* 5. Vitrine Inferior de 4 Colunas (Estilo Studio Grid) */}
                <div className="max-w-5xl mx-auto pt-8">
                  <StudioProductGrid />
                </div>

                {/* 6. Banner Final com Ondas e Feedback Loop */}
                <div className="max-w-5xl mx-auto">
                  <WavesBanner onNewDiagnosis={handleResetDiagnosis} />
                </div>

                {/* Modal de Raio-X Detalhado do Produto */}
                <ProductQuickViewModal
                  isOpen={!!modalProduct}
                  product={modalProduct ? modalProduct.product : null}
                  type={modalProduct ? modalProduct.type : 'physical'}
                  onClose={() => setModalProduct(null)}
                />

                {/* Barra Flutuante de Conversão Rápida */}
                {showFloatingBar && prescriptionData.layer02_PhysicalProducts.length > 0 && (
                  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-neutral-950/90 backdrop-blur-md text-white rounded-full p-2.5 pl-5 pr-3 shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-white/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block leading-tight">
                          Top Recomendação Clínica
                        </span>
                        <span className="text-xs font-medium text-white truncate block">
                          {prescriptionData.layer02_PhysicalProducts[0].name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          handleOpenProductDetails(
                            prescriptionData.layer02_PhysicalProducts[0],
                            'physical'
                          )
                        }
                        className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                      >
                        Raio-X
                      </button>

                      <a
                        href={`https://www.amazon.com.br/s?k=${encodeURIComponent(
                          prescriptionData.layer02_PhysicalProducts[0].searchQueryAmazon
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-100 flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                      >
                        <span>Comprar</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600" />
                      </a>

                      <button
                        onClick={() => setShowFloatingBar(false)}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                        title="Fechar barra"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* SAFETY EMERGENCY GUARDRAIL VIEW */}
            {stage === 'emergency' && triageData && (
              <motion.div
                key="emergency-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto py-12"
              >
                <div className="p-8 sm:p-10 rounded-[32px] bg-white border border-red-500/20 shadow-xl space-y-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <ShieldAlert className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-semibold text-neutral-950">
                    Acolhimento Prioritário e Ajuda Profissional
                  </h3>

                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {triageData.emergencyMessage ||
                      'Identificamos relato de sofrimento agudo ou risco. Por favor, acione apoio médico ou psicológico imediatamente.'}
                  </p>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs font-mono space-y-2">
                    <p>• CVV (Centro de Valorização da Vida): <strong>Ligue 188</strong> (Gratuito 24h)</p>
                    <p>• SAMU (Emergência Médica): <strong>Ligue 192</strong></p>
                    <p>• Central de Atendimento à Mulher: <strong>Ligue 180</strong></p>
                  </div>

                  <button
                    onClick={handleResetDiagnosis}
                    className="px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-medium"
                  >
                    Voltar ao início
                  </button>
                </div>
              </motion.div>
            )}

            </AnimatePresence>
          </div>
        )}

        {/* TAB 2: HISTÓRICO & ACERVO */}
        {activeTab === 'history' && (
          <HistoryView
            consultations={savedConsultations}
            onReopenConsultation={handleReopenConsultation}
            onDeleteConsultation={handleDeleteConsultation}
            onClearAllHistory={handleClearAllHistory}
            onStartNewDiagnosis={() => {
              setActiveTab('diagnose');
              handleResetDiagnosis();
            }}
            onOpenProductDetails={handleOpenProductDetails}
          />
        )}

        {/* TAB 2: TECNOLOGIA & ANATOMIA */}
        {activeTab === 'tech_anatomy' && (
          <TechAnatomyView
            onStartDiagnosis={() => {
              setActiveTab('diagnose');
              handleResetDiagnosis();
            }}
          />
        )}

        {/* TAB 3: PAIN TRENDS (B2B) */}
        {activeTab === 'pain_trends' && (
          <PainTrendsView
            trends={painTrends}
            onDiagnosePain={(pain) => {
              setActiveTab('diagnose');
              handleStartDiagnosis(pain);
            }}
          />
        )}

        {/* TAB 4: PARCEIROS (+ SOLUÇÃO) */}
        {activeTab === 'partners' && (
          <PartnersView
            partnerProducts={partnerProducts}
            onAddProduct={handleAddPartnerProduct}
            onRemoveProduct={handleRemovePartnerProduct}
          />
        )}

      </main>

      {/* Industrial Calm Tech Footer */}
      <footer className="w-full border-t border-black/[0.04] bg-white py-8 px-4 text-center text-xs text-neutral-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="text-neutral-400">• Engenharia do Alívio Humano</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Privacidade & Ética</span>
            <span>Segurança Guardrails</span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
