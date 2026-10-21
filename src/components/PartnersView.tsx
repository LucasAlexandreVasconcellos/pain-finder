import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, ShieldCheck, ArrowUpRight, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import { PartnerProduct } from '../types';

interface PartnersViewProps {
  partnerProducts: PartnerProduct[];
  onAddProduct: (product: Omit<PartnerProduct, 'id'>) => void;
  onRemoveProduct: (id: string) => void;
}

export const PartnersView: React.FC<PartnersViewProps> = ({
  partnerProducts,
  onAddProduct,
  onRemoveProduct,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Ergonomia & Saúde');
  const [type, setType] = useState<'physical' | 'digital'>('physical');
  const [format, setFormat] = useState('Curso Online');
  const [painTarget, setPainTarget] = useState('');
  const [priceBRL, setPriceBRL] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !painTarget.trim()) return;

    onAddProduct({
      name: name.trim(),
      category,
      type,
      format: type === 'digital' ? format : undefined,
      painTarget: painTarget.trim(),
      priceBRL: parseFloat(priceBRL) || 120,
      rating: 4.9,
      affiliateUrl: affiliateUrl.trim() || 'https://www.google.com',
      description: description.trim() || 'Solução homologada de alta precisão para a dor indicada.',
      verifiedBadge: true,
    });

    // Reset Form
    setName('');
    setPainTarget('');
    setPriceBRL('');
    setAffiliateUrl('');
    setDescription('');
    setShowForm(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              PROGRAMA DE HOMOLOGAÇÃO DE SOLUÇÕES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-950 mt-1">
            Portal de Parceiros & Marcas.
            <span className="block text-neutral-400 font-normal">
              Cadastre sua Solução no Motor de Prescrição.
            </span>
          </h2>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>{showForm ? 'Fechar Cadastro' : 'Cadastrar Solução (+)'}</span>
        </button>
      </div>

      {/* Info Card explaining verification */}
      <div className="p-6 rounded-[24px] bg-[#ECECEF] border border-black/[0.04] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-950 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-neutral-950">
              Prioridade Algorítmica nos Diagnósticos
            </h4>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              Quando a IA detecta uma dor compatível com o produto cadastrado, ela insere seu link na Camada 02 ou 03 com o selo exclusivo <strong>"Parceiro Verificado ↗"</strong>.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">
          {partnerProducts.length} Soluções Ativas no Banco
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Solução cadastrada com sucesso! Ela já está indexada para diagnósticos compatíveis.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Form Drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-[28px] bg-white border border-black/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                <h3 className="text-sm font-semibold tracking-tight text-neutral-950 uppercase font-mono">
                  Novo Cadastro de Solução
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">
                  Persistência Local (Indexed/Storage)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Nome do Produto ou Método *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Teclado Ergonômico Split Anodizado"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Categoria da Dor *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:bg-white"
                  >
                    <option value="Ergonomia & Saúde">Ergonomia & Saúde</option>
                    <option value="Ambiente Doméstico">Ambiente Doméstico</option>
                    <option value="Produtividade & Foco">Produtividade & Foco</option>
                    <option value="Comportamento Animal">Comportamento Animal</option>
                    <option value="Finanças & Rotina">Finanças & Rotina</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Tipo de Solução
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setType('physical')}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                        type === 'physical'
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-white text-neutral-600 border-black/[0.06]'
                      }`}
                    >
                      Hardware / Físico
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('digital')}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                        type === 'digital'
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-white text-neutral-600 border-black/[0.06]'
                      }`}
                    >
                      Digital / Infoproduto
                    </button>
                  </div>
                </div>

                {type === 'digital' ? (
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 mb-1">
                      Formato Digital
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none"
                    >
                      <option value="Curso Online">Curso Online</option>
                      <option value="Ebook / Método">Ebook / Método</option>
                      <option value="Template / Sistema">Template / Sistema</option>
                      <option value="App / SaaS">App / SaaS</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono text-neutral-600 mb-1">
                      Formato Físico
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Dispositivo / Utilitário"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-black/[0.04] text-xs text-neutral-400 cursor-not-allowed"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Preço Estimado (R$)
                  </label>
                  <input
                    type="number"
                    value={priceBRL}
                    onChange={(e) => setPriceBRL(e.target.value)}
                    placeholder="Ex: 290"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">
                  Qual dor exata esse produto resolve? * (Palavras-chave de busca)
                </label>
                <input
                  type="text"
                  required
                  value={painTarget}
                  onChange={(e) => setPainTarget(e.target.value)}
                  placeholder="Ex: dor nos pulsos, túnel do carpo, fadiga de digitação crônica"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Link da Loja ou de Afiliado (Amazon, Mercado Livre, Hotmart, Site Próprio)
                  </label>
                  <input
                    type="url"
                    value={affiliateUrl}
                    onChange={(e) => setAffiliateUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-600 mb-1">
                    Descrição Curta / Especificação Técnica
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Ângulo de inclinação de 15 graus com switches mecânicos silenciosos."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F9FB] border border-black/[0.06] text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-full text-xs text-neutral-500 hover:text-black"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
                >
                  Confirmar Cadastro de Solução
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registered Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partnerProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-6 rounded-[24px] bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-black/10 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {prod.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verificado
                </span>
              </div>

              <h4 className="text-sm font-semibold text-neutral-950 tracking-tight">
                {prod.name}
              </h4>

              <div className="mt-2 text-xs text-neutral-500 leading-relaxed">
                {prod.description}
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-[#F9F9FB] text-[11px] font-mono text-neutral-600 border border-black/[0.02]">
                <span className="text-neutral-400 block text-[9px] uppercase">Gatilho de Ativação:</span>
                "{prod.painTarget}"
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.04] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-neutral-900">
                  R$ {prod.priceBRL}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono ml-2">
                  ★ {prod.rating}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={prod.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-black/[0.06] text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
                  title="Testar link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Allow removing user added products */}
                {prod.id.startsWith('user_') && (
                  <button
                    onClick={() => onRemoveProduct(prod.id)}
                    className="p-2 rounded-full border border-black/[0.06] text-red-500 hover:bg-red-50 transition-colors"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
