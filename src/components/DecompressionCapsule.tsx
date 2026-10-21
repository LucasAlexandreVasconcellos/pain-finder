import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Compass, Cpu } from 'lucide-react';

interface DecompressionCapsuleProps {
  inputLength: number;
  categoryHint?: string;
}

export const DecompressionCapsule: React.FC<DecompressionCapsuleProps> = ({
  inputLength,
  categoryHint = 'Análise Espectral de Fricção',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Reaction intensity based on user input length
  const tension = Math.min(100, Math.round(inputLength * 1.5));
  const normalizedScale = 1 + Math.min(inputLength / 400, 0.08);

  return (
    <div 
      className="relative w-full aspect-square max-w-[440px] mx-auto flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Soft radial background glow (Alabaster to silver, strictly monochrome) */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neutral-200/40 via-neutral-100/20 to-transparent blur-2xl -z-10 pointer-events-none" />

      {/* Outer Technical Precision Ring */}
      <motion.div
        animate={{
          rotate: isHovered ? 360 : [0, 360],
        }}
        transition={{
          duration: isHovered ? 25 : 70,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-[92%] h-[92%] rounded-full border border-dashed border-neutral-300/80 pointer-events-none"
      />

      {/* Intermediate Calibrated Orbital Ring */}
      <motion.div
        animate={{
          rotate: [-360, 0],
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute w-[80%] h-[80%] rounded-full border border-neutral-200/90 pointer-events-none flex items-center justify-between p-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
      </motion.div>

      {/* Main Satin Metallic Sphere/Capsule */}
      <motion.div
        animate={{
          scale: normalizedScale,
          y: [0, -6, 0],
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 300, damping: 25 },
        }}
        className="relative w-[68%] h-[68%] rounded-full flex items-center justify-center shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12),0_10px_30px_-5px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-8px_16px_rgba(0,0,0,0.05)] cursor-pointer overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F7 35%, #ECECEF 70%, #E2E2E6 100%)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Anisotropic / Brushed Aluminum Reflection Highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent rotate-45 transform pointer-events-none" />

        {/* Center Technical Core */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="w-10 h-10 rounded-full bg-white/90 border border-black/[0.05] shadow-inner flex items-center justify-center mb-3 text-neutral-800">
            <Cpu className="w-5 h-5 text-neutral-800 transition-transform duration-300" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
            CAMADA DE DESCOMPRESSÃO
          </span>
          <span className="text-xs font-semibold tracking-tight text-neutral-900 mt-0.5">
            {inputLength > 0 ? 'Calibrando Resonância' : 'Em Estado de Repouso'}
          </span>

          {/* Micro status ticker */}
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-black/[0.04] text-[10px] font-mono text-neutral-600 shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${inputLength > 10 ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
            <span>Fricção: {tension}%</span>
          </div>
        </div>

        {/* Subtle horizontal meridian grid line */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-neutral-300/40 to-transparent pointer-events-none" />
      </motion.div>

      {/* Floating Micro-Badges on Orbit */}
      <motion.div
        animate={{
          y: [-3, 3, -3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-1 -right-1 sm:top-2 sm:right-2 z-20 px-3 py-1.5 rounded-full bg-white/95 border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2 backdrop-blur-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[10px] font-medium tracking-wider uppercase text-neutral-800">
          3 Camadas Ativas
        </span>
      </motion.div>

      <motion.div
        animate={{
          y: [3, -3, 3],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-2 -left-1 sm:bottom-3 sm:left-3 z-20 px-3 py-1.5 rounded-full bg-white/95 border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2 backdrop-blur-sm"
      >
        <Activity className="w-3.5 h-3.5 text-neutral-700" />
        <span className="text-[10px] font-mono text-neutral-600">
          {categoryHint}
        </span>
      </motion.div>
    </div>
  );
};
