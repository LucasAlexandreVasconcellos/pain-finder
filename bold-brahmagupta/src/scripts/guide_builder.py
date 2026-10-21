"""Markdown Retention Guide Builder for TikTok Dark Quiz (@bussinessmasterbr).

Builds comprehensive, second-by-second production and creative direction guides
explaining the 5 psychological retention blocks, on-screen visual directions,
voice narration lines, sound effects (SFX), psychological triggers,
and audit validation checkpoints.

CLI usage:
    python -m src.scripts.guide_builder --script data/scripts/script_1230.json --output data/scripts/guide_1230.md
"""

import argparse
from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Union

from src.scripts.schema import DarkQuizScript, QuestionItem

__all__ = [
    "build_markdown_guide",
    "build_retention_guide",
    "_build_timeline",
]


def _format_time(seconds: float) -> str:
    """Formats seconds into MM:SS format."""
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{mins:02d}:{secs:02d}"


def _calculate_question_duration(q: QuestionItem) -> float:
    """Calculates question duration dynamically from cues, read time, countdown and reveal."""
    sfx_time = 1.0 if q.is_trap else 0.0
    read_time = 3.0 if q.index in (5, 7) else 2.5
    countdown = q.countdown_seconds
    reveal_time = 2.0 if q.index in (5, 7) else 1.5
    return sfx_time + read_time + countdown + reveal_time


def _build_timeline(script: DarkQuizScript) -> Dict[str, Tuple[float, float]]:
    """Calculates dynamic start and end timestamps for every section of the script.

    Dynamically places micro_curiosity after Q3 or Q4 based on insert_after_question.
    """
    timeline: Dict[str, Tuple[float, float]] = {}
    current_time = 0.0

    # Hook
    t_hook_start = current_time
    current_time += script.hook.duration_seconds
    timeline["hook"] = (t_hook_start, current_time)

    # Q1
    q1_dur = _calculate_question_duration(script.questions[0])
    timeline["q1"] = (current_time, current_time + q1_dur)
    current_time += q1_dur

    # Q2
    q2_dur = _calculate_question_duration(script.questions[1])
    timeline["q2"] = (current_time, current_time + q2_dur)
    current_time += q2_dur

    # Q3
    q3_dur = _calculate_question_duration(script.questions[2])
    timeline["q3"] = (current_time, current_time + q3_dur)
    current_time += q3_dur

    insert_after = getattr(script.micro_curiosity, "insert_after_question", 3)

    if insert_after == 3:
        # Micro Curiosity after Q3
        curiosity_dur = script.micro_curiosity.duration_seconds
        timeline["micro_curiosity"] = (current_time, current_time + curiosity_dur)
        current_time += curiosity_dur

        # Q4
        q4_dur = _calculate_question_duration(script.questions[3])
        timeline["q4"] = (current_time, current_time + q4_dur)
        current_time += q4_dur
    else:
        # Q4 before curiosity
        q4_dur = _calculate_question_duration(script.questions[3])
        timeline["q4"] = (current_time, current_time + q4_dur)
        current_time += q4_dur

        # Micro Curiosity after Q4
        curiosity_dur = script.micro_curiosity.duration_seconds
        timeline["micro_curiosity"] = (current_time, current_time + curiosity_dur)
        current_time += curiosity_dur

    # Q5 (Pegadinha)
    q5_dur = _calculate_question_duration(script.questions[4])
    timeline["q5"] = (current_time, current_time + q5_dur)
    current_time += q5_dur

    # Q6
    q6_dur = _calculate_question_duration(script.questions[5])
    timeline["q6"] = (current_time, current_time + q6_dur)
    current_time += q6_dur

    # Transition Buffer
    timeline["transition"] = (current_time, current_time + 2.0)
    current_time += 2.0

    # Q7 (Impossível)
    q7_dur = _calculate_question_duration(script.questions[6])
    timeline["q7"] = (current_time, current_time + q7_dur)
    current_time += q7_dur

    # Score CTA
    cta_dur = script.score_cta.duration_seconds
    timeline["score_cta"] = (current_time, current_time + cta_dur)
    current_time += cta_dur

    # Q8 Bonus Question
    bonus_dur = script.bonus_question.duration_seconds
    timeline["q8"] = (current_time, current_time + bonus_dur)
    current_time += bonus_dur

    # Outro
    timeline["outro"] = (current_time, script.estimate_total_duration())

    return timeline


def build_markdown_guide(
    script_data: Union[DarkQuizScript, Dict[str, Any]],
    output_path: Optional[Union[str, Path]] = None,
) -> str:
    """Builds a complete second-by-second Markdown retention guide from DarkQuizScript or raw dict."""
    if isinstance(script_data, DarkQuizScript):
        script = script_data
    elif isinstance(script_data, dict):
        script = DarkQuizScript.from_dict(script_data)
    else:
        raise TypeError(f"Expected DarkQuizScript or dict, got {type(script_data)}")

    total_duration = script.estimate_total_duration()
    timeline = _build_timeline(script)

    t_hook_start, t_hook_end = timeline["hook"]
    t_q1_start, t_q1_end = timeline["q1"]
    t_q2_start, t_q2_end = timeline["q2"]
    t_q3_start, t_q3_end = timeline["q3"]
    t_curiosity_start, t_curiosity_end = timeline["micro_curiosity"]
    t_q4_start, t_q4_end = timeline["q4"]
    t_q5_start, t_q5_end = timeline["q5"]
    t_q6_start, t_q6_end = timeline["q6"]
    t_trans_start, t_trans_end = timeline["transition"]
    t_q7_start, t_q7_end = timeline["q7"]
    t_cta_start, t_cta_end = timeline["score_cta"]
    t_q8_start, t_q8_end = timeline["q8"]
    t_outro_start, t_outro_end = timeline["outro"]

    q1 = script.questions[0]
    q2 = script.questions[1]
    q3 = script.questions[2]
    q4 = script.questions[3]
    q5 = script.questions[4]
    q6 = script.questions[5]
    q7 = script.questions[6]
    bonus = script.bonus_question

    hashtags_str = " ".join(script.seo.hashtags)

    q3_block = f"""### [{_format_time(t_q3_start)} - {_format_time(t_q3_end)}] Pergunta 3 — Nível Médio ({t_q3_end - t_q3_start:.0f}s)
- **HUD Superior:** `{q3.level_badge}` | Progresso: `3/7`
- **Narração:** "Pergunta três: {q3.question_text}"
- **Alternativas:**
  - A) {q3.options[0].text}
  - B) {q3.options[1].text}
  - C) {q3.options[2].text}
  - D) {q3.options[3].text}
- **Contagem Regressiva ({q3.countdown_seconds:.1f}s):** Transição de cor da barra do ciano para o amarelo âmbar. Áudio: `{q3.audio_cues.countdown}`.
- **Revelação (1.5s):** Alternativa `{q3.correct_option}` destacada. Efeito: `{q3.audio_cues.reveal}`.
- **Explicação:** "{q3.explanation}"
"""

    curiosity_block = f"""### [{_format_time(t_curiosity_start)} - {_format_time(t_curiosity_end)}] Quebra de Padrão — Micro-Curiosidade Relâmpago ({script.micro_curiosity.duration_seconds:.0f}s)
- **HUD Superior:** `{script.micro_curiosity.title}`
- **Narração:** "{script.micro_curiosity.text}"
- **Direção Visual:** Card dourado brilhante surge com animação de zoom rápido, rompendo momentaneamente o layout do quiz. Ícone 💡 pulsante.
- **Sound Design:** SFX `{script.micro_curiosity.sfx}` + aumento breve no volume da trilha instrumental.
- **Gatilho Psicológico:** Interrupção de padrão estritamente calibrada aos 25s–30s. Pesquisas de retenção do TikTok comprovam que 48% dos usuários abandonam quizzes por monotonia na marca dos 30 segundos. Esta pausa curta renova a dopamina.
"""

    q4_block = f"""### [{_format_time(t_q4_start)} - {_format_time(t_q4_end)}] Pergunta 4 — Nível Médio ({t_q4_end - t_q4_start:.0f}s)
- **HUD Superior:** `{q4.level_badge}` | Progresso: `4/7`
- **Narração:** "Pergunta quatro: {q4.question_text}"
- **Alternativas:**
  - A) {q4.options[0].text}
  - B) {q4.options[1].text}
  - C) {q4.options[2].text}
  - D) {q4.options[3].text}
- **Contagem Regressiva ({q4.countdown_seconds:.1f}s):** Áudio: `{q4.audio_cues.countdown}`.
- **Revelação (1.5s):** Alternativa `{q4.correct_option}` destacada em verde. Efeito: `{q4.audio_cues.reveal}`.
- **Explicação:** "{q4.explanation}"
- **Gatilho:** Preparação psicológica para a temida pegadinha prometida no gancho.
"""

    insert_after = getattr(script.micro_curiosity, "insert_after_question", 3)
    if insert_after == 3:
        middle_blocks = f"{q3_block}\n---\n\n{curiosity_block}\n---\n\n{q4_block}"
    else:
        middle_blocks = f"{q3_block}\n---\n\n{q4_block}\n---\n\n{curiosity_block}"

    md = f"""# Guia de Retenção Passo a Passo — Dark Quiz @bussinessmasterbr

**ID do Roteiro:** `{script.script_id}` | **Horário Alvo:** `{script.slot}` | **Duração Total Estimada:** `{total_duration:.1f}s`  
**Tema:** *{script.theme}*  
**Voz Neural TTS:** `{script.voice_config.voice_name}` (Velocidade: `{script.voice_config.rate}`, Pitch: `{script.voice_config.pitch}`)

---

## 📊 Matriz de Retenção Psicológica (5 Blocos)

| Intervalo | Bloco Psicológico | Ação em Tela | Áudio & Sound Design | Gatilho Psicológico Ativado | Métrica TikTok Impactada |
|---|---|---|---|---|---|
| **00s–04s** | **Gancho Anti-Scroll** | Desafio de QI + Alerta "98% erram a #5" | Whoosh grave + Narração firme sem respiro | Quebra de Padrão + Desafio ao Ego | Retenção nos primeiros 3 segundos |
| **04s–18s** | **Bloco 1: Dopamina Rápida** | Perguntas 1 e 2 (Nível Fácil) | Tic-tac 3s + Ding resposta certa | Micro-vitórias (*The Winner Effect*) | Redução de churn inicial |
| **18s–36s** | **Bloco 2: Quebra de Padrão** | Perguntas 3, 4 + Curiosidade 4s | Sino de ideia + Trilha dinâmica | Efeito Novidade contra tédio na marca 30s | Prevenção da queda na metade do vídeo |
| **36s–54s** | **Bloco 3: A Pegadinha** | Pergunta 5 (Trap) e Pergunta 6 | Sirene de alerta + Tensão crescente | Dissonância cognitiva e impulso de debate | Taxa de comentários e compartilhamentos |
| **54s–72s** | **Bloco 4: Chefão & Loop** | Pergunta 7 + CTA Placar + Q8 Bônus | Clímax musical + Silêncio súbito | Efeito Zeigarnik (Loop não resolvido) | Conclusão completa e rewatch (>60s) |

---

## ⏱️ Roteiro Detalhado Segundo a Segundo

### [{_format_time(t_hook_start)} - {_format_time(t_hook_end)}] Gancho Anti-Scroll (4s)
- **Narração:** "{script.hook.hook_text}"
- **Direção Visual:** Fundo escuro com partículas dinâmicas em movimento. Letras em caixa alta neon amarela pulsando. Banner superior piscante: `"{script.hook.subtitles_highlight}"`.
- **Sound Design:** Impacto grave (*sub-bass drop*) em 00:00, seguido de narração dinâmica e direta sem pausas. SFX: `{script.hook.sfx}`.
- **Gatilho Psicológico:** Desafio direto ao intelecto do espectador e antecipação imediata da pegadinha da pergunta 5 para prender a atenção além da barreira dos 30 segundos.
- **Auditoria de Retenção:** Se a pergunta 5 não for prometida neste instante, o espectador abandonará o vídeo antes de 40 segundos.

---

### [{_format_time(t_q1_start)} - {_format_time(t_q1_end)}] Pergunta 1 — Nível Fácil ({t_q1_end - t_q1_start:.0f}s)
- **HUD Superior:** `{q1.level_badge}` | Progresso: `1/7`
- **Narração:** "Pergunta um: {q1.question_text}"
- **Alternativas:**
  - A) {q1.options[0].text}
  - B) {q1.options[1].text}
  - C) {q1.options[2].text}
  - D) {q1.options[3].text}
- **Contagem Regressiva ({q1.countdown_seconds:.1f}s):** Barra de cronômetro esvaziando no centro inferior. Áudio: `{q1.audio_cues.countdown}`.
- **Revelação (1.5s):** Alternativa `{q1.correct_option}` pisca com borda verde neon (`#00FF66`). Efeito sonoro: `{q1.audio_cues.reveal}`.
- **Explicação:** "{q1.explanation}"
- **Gatilho:** Micro-vitória fácil para gerar sensação de inteligência imediata (*Winner Effect*).

---

### [{_format_time(t_q2_start)} - {_format_time(t_q2_end)}] Pergunta 2 — Nível Fácil ({t_q2_end - t_q2_start:.0f}s)
- **HUD Superior:** `{q2.level_badge}` | Progresso: `2/7`
- **Narração:** "Pergunta dois: {q2.question_text}"
- **Alternativas:**
  - A) {q2.options[0].text}
  - B) {q2.options[1].text}
  - C) {q2.options[2].text}
  - D) {q2.options[3].text}
- **Contagem Regressiva ({q2.countdown_seconds:.1f}s):** Barra regressiva acelerando suavemente. Áudio: `{q2.audio_cues.countdown}`.
- **Revelação (1.5s):** Alternativa `{q2.correct_option}` em destaque verde neon. Efeito: `{q2.audio_cues.reveal}`.
- **Explicação:** "{q2.explanation}"
- **Gatilho:** Consolidação do compromisso do espectador (2 acertos rápidos ativam o viés de custo afundado).

---

{middle_blocks}

---

### [{_format_time(t_q5_start)} - {_format_time(t_q5_end)}] Bloco da Pegadinha — Pergunta 5 ({t_q5_end - t_q5_start:.0f}s)
- **HUD Superior:** `{q5.level_badge}` | Progresso: `5/7`
- **Alerta Especial:** Banner vermelho neon no topo: "⚠️ ATENÇÃO: PEGADINHA!"
- **Sound Design Especial:** SFX `{q5.audio_cues.intro or 'sfx_warning_siren'}` (sirene de aviso de 1s) antes da leitura.
- **Narração:** "Pergunta cinco: {q5.question_text}"
- **Alternativas:**
  - A) {q5.options[0].text}
  - B) {q5.options[1].text}
  - C) {q5.options[2].text}
  - D) {q5.options[3].text}
- **Contagem Regressiva ({q5.countdown_seconds:.1f}s):** Barra vermelha pulsando com tic-tac acelerado. Áudio: `{q5.audio_cues.countdown}`.
- **Revelação & Explicação (2.0s):** Alternativa `{q5.correct_option}` pisca. Efeito: `{q5.audio_cues.reveal}`. Narração enfática: "{q5.explanation}"
- **Gatilho Psicológico:** Cumprimento da promessa do gancho. Provoca dissonância cognitiva ou satisfação de sagacidade ("Acertei a pegadinha!"), forçando o espectador a abrir a aba de comentários.

---

### [{_format_time(t_q6_start)} - {_format_time(t_q6_end)}] Pergunta 6 — Nível Difícil ({t_q6_end - t_q6_start:.0f}s)
- **HUD Superior:** `{q6.level_badge}` | Progresso: `6/7`
- **Narração:** "Pergunta seis: {q6.question_text}"
- **Alternativas:**
  - A) {q6.options[0].text}
  - B) {q6.options[1].text}
  - C) {q6.options[2].text}
  - D) {q6.options[3].text}
- **Contagem Regressiva ({q6.countdown_seconds:.1f}s):** Áudio: `{q6.audio_cues.countdown}`.
- **Revelação (1.5s):** Alternativa `{q6.correct_option}` destacada em verde neon. Efeito: `{q6.audio_cues.reveal}`.
- **Explicação:** "{q6.explanation}"

---

### [{_format_time(t_trans_start)} - {_format_time(t_trans_end)}] Transição de Tensão para o Chefão (2s)
- **Direção Visual:** Efeito de tremor leve na tela (*camera shake* suave), vinheta escura nas bordas e letreiro: "🚨 O CHEFÃO FINAL ESTÁ CHEGANDO...".
- **Sound Design:** Redobrar de tambores ou subida de tom na trilha de suspense.

---

### [{_format_time(t_q7_start)} - {_format_time(t_q7_end)}] Pergunta 7 — Chefão Final / Nível Impossível ({t_q7_end - t_q7_start:.0f}s)
- **HUD Superior:** `{q7.level_badge}` | Progresso: `7/7`
- **Narração:** "Pergunta sete, o Chefão Final: {q7.question_text}"
- **Alternativas:**
  - A) {q7.options[0].text}
  - B) {q7.options[1].text}
  - C) {q7.options[2].text}
  - D) {q7.options[3].text}
- **Contagem Regressiva ({q7.countdown_seconds:.1f}s):** Tensão máxima. Áudio: `{q7.audio_cues.countdown}`.
- **Revelação (2.0s):** Alternativa `{q7.correct_option}` destacada com efeito de faíscas. SFX: `{q7.audio_cues.reveal}`.
- **Explicação:** "{q7.explanation}"
- **Gatilho:** Desafio de alto prestígio; quem acerta sente necessidade de registrar o feito no placar.

---

### [{_format_time(t_cta_start)} - {_format_time(t_cta_end)}] CTA de Placar (3s)
- **HUD Superior:** 📝 SEU PLACAR
- **Narração:** "{script.score_cta.text}"
- **Direção Visual:** Card com estrelas de avaliação ou placar (0 a 7 acertos) e ícone de balão de comentários apontando para a direita da tela.

---

### [{_format_time(t_q8_start)} - {_format_time(t_q8_end)}] Bloco Final — Pergunta Bônus Sem Resposta no Vídeo (6s)
- **HUD Superior:** `{bonus.badge_label}` | COMENTÁRIO FIXADO
- **Narração:** "{bonus.question_text}"
- **Direção Visual:** Letreiro dourado reluzente. As opções são exibidas na tela, porém **NENHUMA** alternativa é marcada de verde. Um cadeado dourado trancado surge no centro com o texto: "RESPOSTA NO COMENTÁRIO FIXADO 🔒".
- **Sound Design:** Fade out dramático da trilha com eco suave terminando abruptamente.
- **Regra de Ouro da Retenção:** **JAMAIS revelar a resposta no vídeo.** Isso ativa o *Efeito Zeigarnik* (o cérebro não tolera histórias incompletas), forçando o usuário a pausar o vídeo (aumentando o Watch Time) e rolar até a caixa de comentários para conferir a resposta.
- **Resposta Secreta Oculta:** `{bonus.correct_answer_secret}`

---

### [{_format_time(t_outro_start)} - {_format_time(t_outro_end)}] Outro & Seamless Loop (1s)
- **Transição:** Corte limpo que conecta diretamente com a primeira frase do Gancho Anti-Scroll em repetição contínua (*infinite video loop*).

---

## 🚀 Copywriting de Publicação & Estratégia de SEO

- **Título do Vídeo:** `{script.seo.title}`
- **Headline da Capa:** `{script.seo.cover_headline}`
- **Legenda (Caption):**  
  > {script.seo.caption}
- **Hashtags Virais:** `{hashtags_str}`
- **Comentário Fixado Oficial:**  
  > {bonus.pinned_comment}

---

## ✅ Checklist de Auditoria Técnica e Criativa (Stage 1 Audit)

- [x] Duração estimada em `{total_duration:.1f}s` (dentro da janela mandatória `[65.0s, 80.0s]`).
- [x] O gancho inicial desafia o QI e antecipa a pergunta 5 nos primeiros 4 segundos.
- [x] As 7 perguntas principais progridem de Nível Fácil até Nível Impossível.
- [x] A Pergunta 5 está categorizada como pegadinha (`is_trap=True`) com alerta sonoro e visual.
- [x] Micro-curiosidade inserida na marca dos 25s–30s para quebra de monotonia.
- [x] Pergunta 8 (Bônus) **NÃO É REVELADA** no vídeo (`reveal_in_video=False`).
- [x] Copywriting de publicação possui título, legenda, hashtags de nicho e comentário fixado configurado.
"""

    if output_path is not None:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(md, encoding="utf-8")

    return md


build_retention_guide = build_markdown_guide



def main() -> None:
    """CLI entry point for Retention Guide generation."""
    parser = argparse.ArgumentParser(
        description="Markdown Retention Guide Builder from Dark Quiz JSON script"
    )
    parser.add_argument(
        "--script",
        type=str,
        required=True,
        help="Path to input script JSON (e.g. data/scripts/script_1230.json)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Path to save output Markdown guide (default: same folder with guide_<slot>.md)",
    )

    args = parser.parse_args()

    script_path = Path(args.script)
    if not script_path.exists():
        print(f"❌ Error: Script file '{script_path}' not found.", file=sys.stderr)
        sys.exit(1)

    script = DarkQuizScript.from_file(script_path)
    guide_content = build_retention_guide(script)

    if args.output:
        out_path = Path(args.output)
    else:
        clean_slot = script.slot.replace(":", "")
        out_path = script_path.parent / f"guide_{clean_slot}.md"

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(guide_content)

    print(f"✅ Retention Guide built successfully: {out_path}")


if __name__ == "__main__":
    import sys
    main()
