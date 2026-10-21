import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

async function generateWithModelFallback(params: {
  contents: string;
  config: any;
  timeoutMs?: number;
}) {
  if (!ai) throw new Error('AI Engine offline');
  const primaryModel = GEMINI_MODEL;
  const fallbackModel = primaryModel === 'gemini-3.8-flash' ? 'gemini-3.5-flash-lite' : 'gemini-3.8-flash';
  const timeoutLimit = params.timeoutMs || 4500;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`AI generation timed out after ${timeoutLimit}ms`)), timeoutLimit)
  );

  const executeCall = async (model: string) => {
    return await ai.models.generateContent({
      model,
      contents: params.contents,
      config: params.config,
    });
  };

  try {
    return (await Promise.race([executeCall(primaryModel), timeoutPromise])) as any;
  } catch (err: any) {
    const errMsg = String(err?.message || '');
    if (
      errMsg.includes('NOT_FOUND') ||
      errMsg.includes('404') ||
      errMsg.includes('503') ||
      errMsg.includes('UNAVAILABLE') ||
      errMsg.includes('timed out') ||
      errMsg.includes('no longer available') ||
      errMsg.includes('is not found')
    ) {
      console.warn(`[AI Engine] ${primaryModel} failed (${errMsg.slice(0, 80)}). Trying fallback model ${fallbackModel}...`);
      try {
        const fallbackTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Fallback AI model timed out')), 2500)
        );
        return (await Promise.race([executeCall(fallbackModel), fallbackTimeout])) as any;
      } catch (fallbackErr: any) {
        console.warn(`[AI Engine] Fallback model ${fallbackModel} also failed:`, fallbackErr.message);
        throw fallbackErr;
      }
    }
    throw err;
  }
}

const SYSTEM_INSTRUCTION = `Você é o motor central de inteligência do Pain Finder, uma plataforma de alta precisão para diagnóstico de dores cotidianas e prescrição curada em 3 camadas (hábitos imediatos, produtos físicos de alta engenharia e infoprodutos/sistemas digitais).
1. POSTURA: Empático, clínico, cirúrgico e de alta conversão ética. Você esclarece a causa-raiz e destaca com extrema clareza e autoridade os produtos recomendados para que o cliente entenda exatamente o que está comprando, o valor do investimento e a garantia de alívio.
2. TRAVA ÉTICA E DE SEGURANÇA (GUARDRAIL): Se o usuário relatar emergências médicas agudas, ideação suicida, risco de vida imediato ou violência, defina isSafetyEmergency: true, não recomende produtos comerciais e forneça acolhimento imediato indicando ajuda profissional (ex: CVV 188 ou SAMU 192).
3. FUNDAMENTAÇÃO TEÓRICA E COMPORTAMENTAL (CAMADA 01):
   - Baseie a Camada 01 (Alívio Imediato) estritamente no Modelo Comportamental de BJ Fogg (B = MAP: Comportamento = Motivação x Habilidade x Prompt/Gatilho) e na redução drástica de carga alostática nas primeiras 24 horas.
   - Divida os 3 passos obrigatoriamente nos seguintes vetores estruturais:
     * Passo 1: 'Atrito Ambiental' (Modificação física do espaço em <= 3 min para baixar a fricção).
     * Passo 2: 'Reset Biomecânico/Fisiológico' (Intervenção corporal, sensorial ou postural imediata).
     * Passo 3: 'Micro-hábito de Ancoragem' (Regra cognitiva ou de ancoragem para travar e blindar recaídas).
4. CALIBRAGEM DE ORÇAMENTO DO USUÁRIO:
   - Respeite rigorosamente o orçamento/abertura de investimento respondido pelo usuário na triagem:
     * Se o usuário escolheu baixo investimento ou orçamento enxuto, priorize soluções Budget/Custo-Benefício reais e acessíveis.
     * Se escolheu alto investimento, priorize marcas de referência e hardware Flagship/Topo de Linha.
5. VETORES E ANATOMIA DA DOR (painAnatomyVectors):
   - Decomponha a queixa do usuário em 4 vetores clínicos estruturados: 'Vetor Primário', 'Mecanismo de Propagação', 'Ponto Cego' e 'Gatilho de Cronificação'.
   - Para cada vetor, forneça uma explicação clínica concisa (1 frase técnica contextualizada à dor real do usuário) e um nível de severidade de 1 a 10.
6. ARQUITETURA DE PRESCRIÇÃO EM 3 CAMADAS (COM ALTA ÊNFASE NOS PRODUTOS PAGOS E REAIS):
   - Camada 01 (Protocolo Imediato Gratuito): 3 ações práticas de custo zero baseadas em BJ Fogg.
   - Camada 02 (Engenharia Física / Hardware Real): Produtos físicos REAIS de marcas consagradas do mercado (ex: Logitech, Sony, iRobot, Xiaomi, Baseus, TP-Link, KONG, Fibrasca, Time Timer, Orbitkey). NUNCA invente marcas ou nomes conceituais/genéricos fictícios. Sempre cite o modelo comercial exato.
   - Camada 03 (Conhecimento & Sistemas / Infoprodutos Reais): Métodos, templates e cursos consagrados e reais (ex: Notion Life OS / Second Brain de Tiago Forte, Método FlyLady Brasil, Curso Cão Cidadão de Alexandre Rossi, Método Deep Work, planilhas estruturadas).
7. PROIBIÇÃO DE PLACEHOLDERS: Não crie produtos genéricos ou imaginários. Cada produto deve ser um item de catálogo comercial real, com termos de busca prontos para Amazon, Mercado Livre e Google.
8. PRIORIDADE DE PARCEIROS: Se houver produtos pertinentes na lista de 'Soluções Cadastradas no Banco Local', integre-os prioritariamente com isVerifiedPartner: true.
Responda SEMPRE em Português do Brasil (pt-BR) seguindo estritamente o JSON Schema solicitado.`;

const TRIAGE_SYSTEM_INSTRUCTION = `Você é o módulo cirúrgico de triagem clínica e biomecânica do Pain Finder.
SUA MISSÃO ABSOLUTA: Formular exatamente 3 perguntas de triagem HIPER-ESPECÍFICAS, cirúrgicas e personalizadas diretamente ao problema exato, objetos, ferramentas, ambiente e detalhes citados pelo usuário (cada pergunta com exatamente 4 opções mutuamente exclusivas, técnicas e concretas).

DIRETRIZES DE HIPER-ESPECIFICIDADE (ANTI-GENÉRICO RIGOROSO):
1. PROIBIÇÃO DE PERGUNTAS GENÉRICAS/ABSTRATAS: É ESTRITAMENTE PROIBIDO fazer perguntas genéricas como "Qual é o principal momento da dor?", "Há quanto tempo você sente isso?" ou "Quanto você pretende investir?". As perguntas devem citar textualmente os elementos do relato.
2. PERGUNTA 1 - VETOR MECÂNICO, POSTURAL, AMBIENTAL OU OPERACIONAL EXATO:
   - Interrogue diretamente o arranjo físico, ferramentas em uso, postura ou ambiente descritos pelo usuário.
   - Exemplos:
     * Se dor no punho/ombro/computador: interrogue o arranjo exato do mouse (convencional vs vertical vs trackpad), altura da mesa em relação aos cotovelos e se o antebraço fica apoiado ou suspenso.
     * Se dor nas costas/lombar: interrogue o tipo de cadeira (jantar vs gamer sem apoio vs ergonômica), inclinação do tronco e suporte para os pés.
     * Se limpeza/faxina: interrogue o tipo de piso (porcelanato, taco, carpete), presença de pets que soltam pelos, e se o maior atrito é poeira suspensa ou gordura/rejunte pesado.
     * Se foco/procrastinação: interrogue o gatilho exato de dispersão (celular ao alcance da mão, excesso de abas no navegador, barulho ambiente ou fadiga após refeições).
     * Se pet/cão ansioso: interrogue os minutos iniciais após a saída, reação ao barulho das chaves, tipo de brinquedo deixado e ambiente em que o pet fica.
3. PERGUNTA 2 - PADRÃO DE INTENSIFICAÇÃO E PONTO CEGO ESPECÍFICO:
   - Investigue a dinâmica em que a fricção atinge o ponto crítico e quais compensações inadequadas o usuário tem adotado sem perceber.
   - Forneça 4 opções que descrevam cenários reais, tangíveis e detalhados daquele problema.
4. PERGUNTA 3 - INTERVENÇÃO PRÉVIA E FAIXA DE INVESTIMENTO CONTEXTUALIZADA AO NICHO:
   - Pergunte o que o usuário já tentou e qual faixa de investimento faz sentido especificamente para as ferramentas e métodos do nicho em questão.
   - As 4 opções devem citar tipos reais de soluções daquele nicho com faixas de valores coerentes (ex: adaptação sem custo / acessórios de entrada R$ 50-120 / hardware intermediário R$ 150-450 / solução definitiva R$ 500+).
5. INTELIGÊNCIA B2B: Estime volume de buscas mensal no Brasil (10k a 800k), unmetDemandScore (0 a 100), lacuna de mercado e público-alvo qualificado.
6. TRAVA DE SEGURANÇA: Se o relato indicar risco iminente de vida, ideação suicida ou emergência médica aguda, defina isSafetyEmergency: true e forneça acolhimento (CVV 188 / SAMU 192).
Responda SEMPRE em Português do Brasil (pt-BR) estritamente no JSON Schema.`;

// Endpoint 1: Triage
app.post('/api/gemini/triage', async (req, res) => {
  const { userPain } = req.body;
  if (!userPain || typeof userPain !== 'string') {
    return res.status(400).json({ error: 'userPain is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'AI Engine offline (GEMINI_API_KEY not configured)',
      useFallback: true,
    });
  }

  try {
    const prompt = `Analise minuciosamente a dor informada pelo usuário: "${userPain}".
Formule 3 perguntas de triagem CIRÚRGICAS e HIPER-ESPECÍFICAS adaptadas aos detalhes exatos mencionados (ferramentas, anatomia, ambiente físico, hábitos, móveis ou rotina).
NÃO use perguntas genéricas. Cada uma das 3 perguntas deve conter 4 opções técnicas, concretas e realistas descrevendo o cotidiano exato dessa dor.
Forneça também a inteligência de mercado B2B sobre esse nicho de dor (volume de buscas 10k-800k, unmetDemandScore 0-100, lacuna de mercado e público-alvo).`;

    const response = await generateWithModelFallback({
      contents: prompt,
      timeoutMs: 3800,
      config: {
        systemInstruction: TRIAGE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafetyEmergency: { type: Type.BOOLEAN },
            emergencyMessage: { type: Type.STRING },
            detectedCategory: { type: Type.STRING },
            empathySummary: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'question', 'options'],
              },
            },
            b2bMarketIntel: {
              type: Type.OBJECT,
              properties: {
                estimatedMonthlySearches: { type: Type.NUMBER },
                unmetDemandScore: { type: Type.NUMBER },
                missingSolutionGap: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
              },
              required: [
                'estimatedMonthlySearches',
                'unmetDemandScore',
                'missingSolutionGap',
                'targetAudience',
              ],
            },
          },
          required: ['isSafetyEmergency', 'detectedCategory', 'empathySummary', 'questions', 'b2bMarketIntel'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI unavailable for triage (high demand or error), routing to fallback synthesis:', error.message);
    return res.json({
      useFallback: true,
      error: error.message || 'Erro ao processar triagem',
    });
  }
});

// Endpoint 2: Prescription
app.post('/api/gemini/prescribe', async (req, res) => {
  const { userPain, triageAnswers, partnerProducts } = req.body;
  if (!userPain) {
    return res.status(400).json({ error: 'userPain is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'AI Engine offline (GEMINI_API_KEY not configured)',
      useFallback: true,
    });
  }

  try {
    const prompt = `Gere a prescrição completa de alívio e resolução em 3 camadas para a dor e calibragem abaixo.
Dor inicial do usuário: "${userPain}"
Respostas de Calibragem / Triagem:
${JSON.stringify(triageAnswers || {}, null, 2)}

Soluções Cadastradas no Banco Local (Priorize se pertinentes):
${JSON.stringify(partnerProducts || [], null, 2)}
`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafetyEmergency: { type: Type.BOOLEAN },
            emergencyMessage: { type: Type.STRING },
            diagnosisTitle: {
              type: Type.OBJECT,
              properties: {
                part1Dark: { type: Type.STRING },
                part2Gray: { type: Type.STRING },
              },
              required: ['part1Dark', 'part2Gray'],
            },
            rootCauseAnalysis: { type: Type.STRING },
            painAnatomyTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            painAnatomyVectors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  vectorType: { type: Type.STRING },
                  clinicalExplanation: { type: Type.STRING },
                  severity: { type: Type.NUMBER },
                },
                required: ['tag', 'vectorType', 'clinicalExplanation', 'severity'],
              },
            },
            layer01_ImmediateRelief: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      actionTitle: { type: Type.STRING },
                      description: { type: Type.STRING },
                      timeRequired: { type: Type.STRING },
                      vectorType: { type: Type.STRING },
                    },
                    required: ['stepNumber', 'actionTitle', 'description', 'timeRequired'],
                  },
                },
              },
              required: ['title', 'subtitle', 'steps'],
            },
            layer02_PhysicalProducts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  whyItSolves: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  estimatedPriceBRL: { type: Type.STRING },
                  installments: { type: Type.STRING },
                  painScore: { type: Type.NUMBER },
                  searchQueryAmazon: { type: Type.STRING },
                  searchQueryMercadoLivre: { type: Type.STRING },
                  visualIconType: { type: Type.STRING },
                  badgePromotion: { type: Type.STRING },
                  reviewsCount: { type: Type.STRING },
                  conversionHeadline: { type: Type.STRING },
                  isVerifiedPartner: { type: Type.BOOLEAN },
                },
                required: [
                  'name',
                  'category',
                  'whyItSolves',
                  'pros',
                  'cons',
                  'estimatedPriceBRL',
                  'painScore',
                  'searchQueryAmazon',
                  'searchQueryMercadoLivre',
                  'visualIconType',
                ],
              },
            },
            layer03_DigitalSolutions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  format: { type: Type.STRING },
                  transformationPromise: { type: Type.STRING },
                  implementationTime: { type: Type.STRING },
                  estimatedPriceBRL: { type: Type.STRING },
                  installments: { type: Type.STRING },
                  painScore: { type: Type.NUMBER },
                  searchQueryPlatform: { type: Type.STRING },
                  badgePromotion: { type: Type.STRING },
                  reviewsCount: { type: Type.STRING },
                  conversionHeadline: { type: Type.STRING },
                  isVerifiedPartner: { type: Type.BOOLEAN },
                },
                required: [
                  'name',
                  'format',
                  'transformationPromise',
                  'implementationTime',
                  'estimatedPriceBRL',
                  'painScore',
                  'searchQueryPlatform',
                ],
              },
            },
          },
          required: [
            'isSafetyEmergency',
            'diagnosisTitle',
            'rootCauseAnalysis',
            'painAnatomyTags',
            'painAnatomyVectors',
            'layer01_ImmediateRelief',
            'layer02_PhysicalProducts',
            'layer03_DigitalSolutions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('AI unavailable for prescription (high demand or error), routing to fallback synthesis:', error.message);
    return res.json({
      useFallback: true,
      error: error.message || 'Erro ao sintetizar prescrição',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasAiKey: Boolean(ai) });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pain Finder server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
