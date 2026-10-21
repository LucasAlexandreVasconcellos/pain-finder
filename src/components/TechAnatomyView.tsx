import React from 'react';
import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Zap, Activity, ArrowUpRight, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface TechAnatomyViewProps {
  onStartDiagnosis: () => void;
}

export const TechAnatomyView: React.FC<TechAnatomyViewProps> = ({ onStartDiagnosis }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Editorial Title */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
          ARQUITETURA DO SISTEMA
        </span>
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-950 mt-2 leading-[1.08]">
          Engenharia da Prescrição.
          <span className="block text-neutral-400 font-normal">
            A Tríplice Camada do Alívio.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-500 mt-4 leading-relaxed font-normal">
          Dores cotidianas crônicas não são resolvidas apenas com força de vontade ou gadgets isolados. Desenvolvemos uma metodologia de intervenção em camadas que decompõe o problema desde a inércia imediata até o sistema mental definitivo.
        </p>
      </div>

      {/* Exploded Architecture 3-Step Grid */}
      <div className="space-y-16">
        
        {/* Layer 01 Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-5xl sm:text-6xl font-light text-neutral-900 block font-mono">
              01
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950 tracking-tight mt-2">
              Engenharia de Hábito
            </h3>
            <p className="text-sm font-medium text-neutral-400 mb-4">
              Intervenção Imediata • Custo Zero
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Baseada na redução radical da fricção de ativação. Pequenos ajustes de postura, regras de micro-tempo (2 a 5 minutos) e reorganização de gatilhos espaciais capazes de aliviar de 30% a 50% da sobrecarga no mesmo instante.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-mono text-neutral-700">
              <span className="px-3 py-1 rounded-full bg-white border border-black/[0.06]">
                Descompressão Cervical
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-black/[0.06]">
                Zonas de Quarentena
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-black/[0.06]">
                Regra dos 5 Minutos
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="rounded-[28px] bg-white border border-black/[0.05] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Módulo Biomecânico & Comportamental
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-2xl bg-neutral-50 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono">
                    A
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-900">Quebra da Inércia Fisiológica</h5>
                    <p className="text-[11px] text-neutral-500">Estimula o tônus postural e reseta os reflexos miofasciais.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-mono">
                    B
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-900">Alívio da Memória Operacional</h5>
                    <p className="text-[11px] text-neutral-500">Elimina a micro-tensão de tarefas pendentes em suspensão.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 02 Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-[28px] bg-[#ECECEF] border border-black/[0.04] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  Hardware & Instrumentação
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-mono">
                  Score &gt; 9.5
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white shadow-xs">
                  <Cpu className="w-6 h-6 text-neutral-900 mb-2" />
                  <h5 className="text-xs font-semibold text-neutral-900">Automação Passiva</h5>
                  <p className="text-[11px] text-neutral-500 mt-1">Robôs LiDAR e isolamento acústico ANC eliminam o desgaste manual contínuo.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white shadow-xs">
                  <Compass className="w-6 h-6 text-neutral-900 mb-2" />
                  <h5 className="text-xs font-semibold text-neutral-900">Ergonomia Estrutural</h5>
                  <p className="text-[11px] text-neutral-500 mt-1">Suportes de alumínio e espumas aeroespaciais sustentam a geometria humana.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <span className="text-5xl sm:text-6xl font-light text-neutral-900 block font-mono">
              02
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950 tracking-tight mt-2">
              Arquitetura Física
            </h3>
            <p className="text-sm font-medium text-neutral-400 mb-4">
              Hardware Consagrado • Eficiência Mensurável
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Quando a dor exige automação ou substituição de carga biomecânica, prescrevemos dispositivos físicos com avaliação rigorosa superior a 4.5 estrelas em âmbito global, gerando links diretos de busca transparente para Amazon e Mercado Livre.
            </p>
          </div>
        </div>

        {/* Layer 03 Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-5xl sm:text-6xl font-light text-neutral-900 block font-mono">
              03
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950 tracking-tight mt-2">
              Conhecimento & Sistemas
            </h3>
            <p className="text-sm font-medium text-neutral-400 mb-4">
              Infoprodutos • Resolução Definitiva
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Cursos estruturados, métodos consagrados e templates digitais que reprogramam a causa-raiz cognitiva. Ensinam o indivíduo a operar em um novo patamar de autonomia para que a dor nunca mais retorne.
            </p>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="rounded-[28px] bg-white border border-black/[0.05] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Matriz de Modelos Mentais
                </span>
                <span className="text-xs font-mono text-emerald-600">
                  Imersão 100% Digital
                </span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-2xl bg-neutral-50 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-900">Deep Work & Sistemas Notion</h5>
                    <p className="text-[11px] text-neutral-500">Elimina a fragmentação crônica de foco.</p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white border border-neutral-200">
                    Template
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-900">Protocolos Posturais e Fisioterapia</h5>
                    <p className="text-[11px] text-neutral-500">Exercícios guiados em vídeo para reeducação cinemática.</p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white border border-neutral-200">
                    Curso Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={onStartDiagnosis}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase shadow-xl hover:bg-neutral-800 transition-all duration-200 active:scale-95"
        >
          <span>Experimentar Diagnóstico em Tempo Real</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>

    </div>
  );
};
