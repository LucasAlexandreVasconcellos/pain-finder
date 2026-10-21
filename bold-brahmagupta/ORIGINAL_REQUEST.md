# Original User Request

## Initial Request — 2026-10-21T14:42:16Z

Construir um sistema completo e automatizado de produção, direção criativa, edição programática de vídeo e publicação agendada para o canal Dark de Quiz no TikTok `@bussinessmasterbr` (`https://www.tiktok.com/@bussinessmasterbr`), executando auditoria rigorosa e independente a cada etapa concluída. O sistema deve gerar vídeos verticais (`1080x1920`, 9:16) **obrigatoriamente acima de 1 minuto (65s a 80s)** otimizados para retenção máxima e monetização no TikTok Creator Rewards Program, utilizando narração neural por IA (pt-BR), engenharia de retenção em 5 blocos (*Fácil → Médio → Difícil → Impossível + Bônus nos Comentários*), guia passo a passo com feedback contínuo ao usuário e postagem automática via TikTok Studio Web (Playwright) nos horários virais **12:30**, **16:00** e **18:30**.

Working directory: c:/Users/user/Documents/antigravity/bold-brahmagupta
Integrity mode: development

## Requirements

### R1. Inteligência de Nicho e Gerador de Roteiros Dark Quiz (>60s) com Guia Passo a Passo
Desenvolver o módulo estrategista e gerador de roteiros para o perfil `@bussinessmasterbr` focado em Quizzes de Conhecimentos Gerais, Curiosidades, Negócios e Cultura com engenharia de retenção para vídeos >1 minuto (`65s–80s`). Cada roteiro gerado deve produzir um arquivo JSON estruturado e um Guia Completo Passo a Passo em Markdown (segundo a segundo, explicando o porquê de cada bloco, o que fazer e como validar) estruturado em 5 blocos psicológicos:
1. **Gancho Anti-Scroll (00s–04s):** Desafio direto ao ego/QI + antecipação da "pegadinha da pergunta 5".
2. **Bloco 1 — Dopamina Rápida (04s–18s):** Perguntas 1 e 2 (Nível Fácil) para gerar comprometimento imediato.
3. **Bloco 2 — Quebra de Padrão + Micro-Curiosidade (18s–36s):** Perguntas 3 e 4 (Nível Médio) seguidas de uma micro-curiosidade rápida de 4s para quebrar a monotonia na marca de 30s.
4. **Bloco 3 — A Pegadinha + Escalada de Tensão (36s–54s):** Perguntas 5 e 6 (Nível Difícil) com alerta de pegadinha para estimular debate nos comentários.
5. **Bloco 4 — Chefão Final + Loop de Comentários (54s–72s):** Pergunta 7 (Nível Impossível) + CTA de placar + **Pergunta Bônus (8ª pergunta)** exibida nos últimos 5 segundos sem revelar a resposta no vídeo, forçando comentários e aumentando o Watch Time.

### R2. Pipeline 100% Automatizado de Narração Neural (pt-BR) e Edição de Vídeo Dark Quiz (>60s)
Desenvolver o motor de renderização de vídeo (`1080x1920`, 9:16, 30fps, `.mp4`) que transforma automaticamente um roteiro JSON aprovado em um vídeo pronto para postar:
- **Narração Neural Automática (TTS pt-BR):** Geração automática de voz neural brasileira natural, dinâmica e ritmada (via `edge-tts` com fallback offline se necessário), calculando os timestamps exatos de cada fala.
- **Interface Gráfica Animada de Quiz (HUD):** Renderização programática do cabeçalho de nível (*Fácil*, *Médio*, *Difícil*, *Impossível*), placar de progresso (`1/7` a `7/7`), card da pergunta, 4 alternativas (A, B, C, D), barra de cronômetro regressivo de 3 segundos e destaque em verde na alternativa correta no momento da revelação.
- **Sound Design e Fundo Dinâmico:** Fundo visual em movimento/gradiente dinâmico de alta retenção, efeitos sonoros sincronizados (*whoosh* na transição, *tic-tac* durante os 3 segundos de cada pergunta, *ding* de resposta certa, alerta na pergunta difícil) e música/trilha de tensão crescente com *audio ducking*.
- **Trava Programática e Auditoria de Duração (>60s):** Verificação automática garantindo que todo vídeo renderizado tenha duração final `>= 62.0 segundos`.

### R3. Agendador e Publicador Automático no TikTok (`12:30`, `16:00`, `18:30`)
Construir o módulo de automação de postagem e agendamento via **Playwright (TikTok Studio Web)** com persistência de sessão da conta `@bussinessmasterbr` e agendador para os horários **12:30**, **16:00** e **18:30**:
- Suporte para login único (salvando sessão local) e upload automático com preenchimento de legenda otimizada para SEO, hashtags virais do nicho e seleção de capa.
- Painel CLI / Orquestrador com relatórios de auditoria a cada etapa concluída (validação do roteiro, auditoria técnica do vídeo `.mp4` gerado, e verificação da fila de agendamento das `12:30`, `16:00` e `18:30`).

### R4. Auditoria Própria Automatizada em Cada Etapa (Self-Audit Pipeline)
Implementar um módulo de auditoria (`audit.py` / verificador de etapas) que roda obrigatoriamente após cada fase do workflow (Etapa 1: Auditoria de Roteiro e Retenção; Etapa 2: Auditoria de Áudio/TTS; Etapa 3: Auditoria de Vídeo `.mp4` — resolução `1080x1920`, duração `>= 62s`, presença de áudio não-silencioso, frames válidos sem tela preta; Etapa 4: Auditoria de Agendamento `12:30`, `16:00`, `18:30`) gerando um relatório de auditoria detalhado.

## Acceptance Criteria

### Etapa 1 — Auditoria de Roteiro e Guia Passo a Passo
- [ ] O gerador cria ao menos 3 roteiros completos para os horários `12:30`, `16:00` e `18:30` (JSON + Guia Markdown passo a passo) contendo os 5 blocos de retenção (7 perguntas escalonadas + micro-curiosidade + 8ª pergunta bônus sem resposta) + copy SEO e hashtags.
- [ ] O script de auditoria da Etapa 1 valida programaticamente todos os campos obrigatórios e aprova os roteiros.

### Etapa 2 & 3 — Auditoria de Renderização de Vídeo e Áudio (>60s)
- [ ] O pipeline de edição gera um vídeo `.mp4` real e completo a partir do roteiro #1, com resolução `1080x1920` (9:16), narração neural pt-BR + efeitos sonoros (*tic-tac*, *ding*, *whoosh*, trilha de fundo) e duração total comprovada `>= 62.0` segundos.
- [ ] Os elementos visuais (nível, placar, pergunta, opções A/B/C/D, timer regressivo e destaque verde na resposta correta) estão presentes e visíveis nos frames inspecionados pela auditoria.
- [ ] O script de auditoria da Etapa 3 inspeciona o arquivo `.mp4` (resolução, codec, FPS, duração `>= 62.0s`, trilha de áudio ativa e amostragem de frames) e emite certificado `PASS`.

### Etapa 4 — Auditoria do Agendador e Publicador (12:30, 16:00, 18:30)
- [ ] O agendador e o módulo Playwright estão implementados com horários fixos `12:30`, `16:00` e `18:30`, suporte a perfil persistente da conta `@bussinessmasterbr`, e passam na auditoria de `--dry-run` e testes automatizados (`pytest`).
