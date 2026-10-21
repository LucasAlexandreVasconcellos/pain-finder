import React, { useState } from 'react';
import { ArrowUpRight, Star, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface WavesBannerProps {
  onNewDiagnosis: () => void;
}

export const WavesBanner: React.FC<WavesBannerProps> = ({ onNewDiagnosis }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleRate = (score: number) => {
    setRating(score);
    setFeedbackSent(true);
  };

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden bg-neutral-900 text-white my-12 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
      {/* Subtle Silver/White Flowing Waves SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160"
        />
        <path
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          d="M0,64L48,85.3C96,107,192,149,288,176C384,203,480,213,576,197.3C672,181,768,139,864,133.3C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192"
        />
        <path
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          d="M0,256L48,234.7C96,213,192,171,288,160C384,149,480,171,576,186.7C672,203,768,213,864,197.3C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224"
        />
      </svg>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Column Text */}
        <div className="max-w-xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
            ENGENHARIA CONTÍNUA
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight mt-1 leading-[1.1]">
            <span className="text-white block font-medium">Soluções que Inspiram.</span>
            <span className="text-neutral-400 block">Alívio que Dura.</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 font-normal leading-relaxed">
            Cada prescrição é refinada matematicamente contra atrito cognitivo e físico. Avalie a precisão da síntese para calibrar nossa rede neural de alívio.
          </p>

          {/* Pain Score Feedback Selector */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-neutral-300">
              Precisão do Diagnóstico:
            </span>
            {feedbackSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Obrigado! Feedback registrado ({rating}/5)</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-amber-400 active:scale-95"
                    title={`Nota ${star}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onNewDiagnosis}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-950 text-xs font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-neutral-100 transition-all duration-200 active:scale-95"
          >
            <span>Iniciar Novo Diagnóstico</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/10 text-white text-xs font-medium border border-white/10 hover:bg-white/15 transition-all duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-300" />
            <span>Rever Prescrição</span>
          </button>
        </div>

      </div>
    </div>
  );
};
