import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Sparkles, Brain, Cpu, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

interface TriageLoadingTransitionProps {
  userPain: string;
}

const CALIBRATION_STEPS = [
  {
    step: '01/03',
    title: 'Decodificação da Fricção Primária',
    detail: 'Analisando linguagem natural, carga alostática e gatilhos de sobrecarga...',
    duration: 1800,
  },
  {
    step: '02/03',
    title: 'Isolamento de Causa-Raiz e Categoria',
    detail: 'Cruzando padrões de biomecânica, ambiente doméstico e rotina cognitiva...',
    duration: 2200,
  },
  {
    step: '03/03',
    title: 'Formula de Perguntas de Alta Calibragem',
    detail: 'Sintetizando 3 perguntas cirúrgicas para mapear orçamento e nível de atrito...',
    duration: 2500,
  },
];

export const TriageLoadingTransition: React.FC<TriageLoadingTransitionProps> = ({ userPain }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Step progression timers
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgress(55);
    }, 1800);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgress(90);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[32px] bg-white border border-black/[0.06] p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.06)] relative overflow-hidden"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-200 via-neutral-900 to-neutral-200 opacity-60" />

        {/* Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/[0.04] gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
              MÓDULO DE TRIAGEM CLÍNICA • IA EM EXECUÇÃO
            </span>
          </div>

          <div className="px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-mono text-neutral-600 flex items-center gap-1.5 self-start sm:self-auto">
            <Cpu className="w-3.5 h-3.5 text-neutral-800 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Processando Modelo Neural</span>
          </div>
        </div>

        {/* User Symptom Inspection Badge */}
        <div className="my-6 p-4 rounded-2xl bg-[#F9F9FB] border border-black/[0.04]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
            SINTOMA DIGITADO EM ANÁLISE
          </span>
          <p className="text-xs sm:text-sm text-neutral-800 line-clamp-2 italic font-normal">
            "{userPain}"
          </p>
        </div>

        {/* Central High-Tech Animated Radar Scanner */}
        <div className="relative py-8 flex flex-col items-center justify-center">
          {/* Concentric Ambient Waves */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.15, 0.45, 0.15],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-neutral-300"
            />
            <motion.div
              animate={{
                scale: [1.15, 1.6, 1.15],
                opacity: [0.08, 0.25, 0.08],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border border-dashed border-neutral-400"
            />

            {/* Glowing Core Orb */}
            <motion.div
              animate={{
                scale: [0.95, 1.05, 0.95],
                boxShadow: [
                  '0 0 20px rgba(0,0,0,0.15)',
                  '0 0 40px rgba(0,0,0,0.3)',
                  '0 0 20px rgba(0,0,0,0.15)',
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full bg-neutral-950 flex flex-col items-center justify-center text-white relative z-10 border border-white/20"
            >
              <Brain className="w-8 h-8 text-white mb-0.5 animate-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                TRIAGEM
              </span>
            </motion.div>
          </div>

          <div className="text-center mt-6 space-y-1">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-950">
              Calibrando Espectro Clínico do Problema
            </h3>
            <p className="text-xs text-neutral-500 font-normal max-w-md mx-auto leading-relaxed">
              Estruturando perguntas sob medida para decompor os pontos cegos e acelerar a prescrição.
            </p>
          </div>
        </div>

        {/* Real-time Dynamic Ticker & Steps */}
        <div className="mt-4 pt-6 border-t border-black/[0.04] space-y-3">
          {CALIBRATION_STEPS.map((s, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-neutral-50 border border-black/[0.05]'
                    : isDone
                    ? 'opacity-85'
                    : 'opacity-35'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 tracking-tight">
                      [{s.step}] {s.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-950 text-white shrink-0 animate-pulse">
                        Em análise
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5 truncate">
                    {s.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar & Telemetry Footer */}
        <div className="mt-6 pt-4 border-t border-black/[0.04]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-neutral-500">Prontidão da Micro-Triagem:</span>
            <span className="font-semibold text-neutral-950">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neutral-950 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-neutral-400 font-mono mt-2 text-center">
            Aguarde um instante. Nossa IA está lapidando as opções de triagem para o seu cenário.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
