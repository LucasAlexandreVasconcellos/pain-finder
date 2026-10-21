# Pain Finder • Engenharia do Alívio Humano

Plataforma inteligente de diagnóstico de dores cotidianas e prescrição clínica estruturada em 3 camadas (micro-hábitos imediatos, engenharia física e sistemas digitais), desenvolvida com a estética Industrial Calm Tech e arquitetura moderna baseada no Google Gemini.

---

## ⚡ Principais Funcionalidades

1. **Triagem Cirúrgica & Hiper-Específica**:
   - Diagnóstico em tempo real com perguntas que interrogam diretamente ferramentas, postura, arranjo físico e hábitos cotidianos relatados pelo usuário.
   - Tela de calibração neural (`TriageLoadingTransition`) com telemetria e feedback visual passo a passo.

2. **Prescrição Estruturada em 3 Camadas**:
   - **Camada 01 • Alívio Imediato (Custo Zero)**: 3 micro-ações baseadas no Modelo Comportamental de BJ Fogg (*Atrito Ambiental*, *Reset Biomecânico* e *Micro-hábito de Ancoragem*).
   - **Camada 02 • Engenharia Física (Hardware Real)**: Dispositivos físicos e periféricos ergonômicos de alta precisão com fotos de estúdio, prós, contras e links diretos para compra.
   - **Camada 03 • Sistemas & Infoprodutos**: Cursos, métodos e templates consagrados para erradicar a causa-raiz da queixa.

3. **Módulo de Histórico & Acervo de Soluções**:
   - **Consultas Salvas**: Registro histórico persistente (`localStorage`) de diagnósticos anteriores com análise de causa-raiz, respostas da triagem, botão para copiar relatório e ação de reabertura completa da prescrição com 1 clique.
   - **Acervo de Produtos Recomendados**: Catálogo centralizado de todos os itens físicos e infoprodutos prescritos, com filtros por categoria, busca textual e modal de detalhes técnicos.

4. **Pain Trends (Inteligência B2B)**:
   - Mapeamento contínuo de demanda reprimida, volume de buscas mensais estimadas no Brasil e lacunas de mercado.

5. **Visualizador de Anatomia e Tecnologia**:
   - Mapeamento vetorial dos gatilhos primários, pontos cegos e mecanismos de cronificação da dor.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **npm**

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/LucasAlexandreVasconcellos/pain-finder.git
cd pain-finder
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):
```env
PORT=3000
GEMINI_API_KEY=sua_chave_do_google_gemini_aqui
GEMINI_MODEL=gemini-3.8-flash
```
*(Nota: O sistema possui um mecanismo completo de fallback clínico local caso a chave da API do Gemini não esteja configurada no momento).*

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:3000
```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion (Framer Motion), Lucide React
- **Backend**: Node.js, Express, @google/genai (Google Gemini 3.8 Flash / 3.5 Flash Lite)
- **Bundler**: Vite