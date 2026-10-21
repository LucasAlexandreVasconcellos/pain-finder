import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Layers, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

interface ExplodedViewTransitionProps {
  onComplete?: () => void;
}

const STEPS = [
  {
    step: '01/03',
    label: 'Decompondo a causa-raiz da dor e vetores de atrito...',
    detail: 'Análise biomecânica, cognitiva e de rotina em execução.',
  },
  {
    step: '02/03',
    label: 'Consultando catálogo global de hardware e infoprodutos...',
    detail: 'Varredura de bases com nota de corte superior a 4.5/5.0.',
  },
  {
    step: '03/03',
    label: 'Filtrando soluções com Pain Score superior a 9.0...',
    detail: 'Cruzando parceiros locais e protocolos imediatos gratuitos.',
  },
];

export const ExplodedViewTransition: React.FC<ExplodedViewTransitionProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 1600);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full min-h-[520px] flex flex-col items-center justify-center py-16 px-4">
      {/* Visual Exploded Engineering Simulation */}
      <div className="relative w-full max-w-2xl h-52 flex items-center justify-center perspective-[1000px] mb-12">
        
        {/* Layer 1: Habit & Cognitive Base */}
        <motion.div
          animate={{
            x: currentStepIndex >= 0 ? [-80, -90, -85] : 0,
            opacity: [0.6, 1, 0.9],
            scale: [0.95, 1, 0.98],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-44 h-44 rounded-3xl bg-white/90 border border-neutral-300 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center p-4 backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 mb-2">
            <span className="font-mono text-xs font-bold">01</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-900 text-center">
            Camada Hábito
          </span>
          <span className="text-[9px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
            Alívio Zero Custo
          </span>
        </motion.div>

        {/* Center Linking Line */}
        <div className="absolute w-3/4 h-[1px] bg-dashed border-t border-dashed border-neutral-300 pointer-events-none" />

        {/* Layer 2: Physical Hardware (Middle Core) */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotateY: [0, 6, -6, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20 w-52 h-52 rounded-3xl bg-neutral-950 text-white shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center p-5 border border-white/20"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-2">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-white text-center">
            Camada Hardware
          </span>
          <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
            Automação Física
          </span>
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[9px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Score &gt; 9.0</span>
          </div>
        </motion.div>

        {/* Layer 3: Digital Systems (Right) */}
        <motion.div
          animate={{
            x: currentStepIndex >= 0 ? [80, 90, 85] : 0,
            opacity: [0.6, 1, 0.9],
            scale: [0.95, 1, 0.98],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-44 h-44 rounded-3xl bg-white/90 border border-neutral-300 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center p-4 backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 mb-2">
            <span className="font-mono text-xs font-bold">03</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-900 text-center">
            Camada Mental
          </span>
          <span className="text-[9px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
            Sistemas & Cursos
          </span>
        </motion.div>

      </div>

      {/* Real-time Technical Step Ticker */}
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4 pb-2 border-b border-black/[0.04]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900 animate-ping" />
            VISTA EXPLODIDA EM SÍNTESE
          </span>
          <span>{STEPS[currentStepIndex].step}</span>
        </div>

        <div className="space-y-3">
          {STEPS.map((s, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={s.step}
                className={`flex items-start gap-3 transition-opacity duration-300 ${
                  isCurrent ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-30'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-neutral-900">
                    [{s.step}] {s.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                      {s.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-6 w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neutral-950 rounded-full"
            initial={{ width: '15%' }}
            animate={{ width: `${(currentStepIndex + 1) * 33.3}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

    </div>
  );
};
