"""Tier 1-4 Test Suite: R1 Niche Intelligence, Script Generation & Stage 1 Retention Audit.

Tests Features F01, F02, F03, F04, F05 against authoritative specifications in
ORIGINAL_REQUEST.md (lines 12-19, 37-40) and PROJECT.md.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
import pytest

# Try importing implementation modules from src if available
try:
    from src.scripts.schema import DarkQuizScript, QuestionItem, BonusQuestionBlock
    from src.scripts.generator import generate_daily_scripts, generate_script
    from src.scripts.guide_builder import build_markdown_guide
    from src.audit.stage1_script import audit_stage1_script
    SRC_STAGE1_AVAILABLE = True
except ImportError:
    SRC_STAGE1_AVAILABLE = False


# ---------------------------------------------------------------------------
# Authoritative Contract Specification Oracle for Stage 1 Audit
# ---------------------------------------------------------------------------

def calculate_script_duration_oracle(script: Dict[str, Any]) -> float:
    """Calculates mathematical duration based on Section 2.1 pacing formula."""
    dur = float(script.get("hook", {}).get("duration_seconds", 4.0))
    for q in script.get("questions", []):
        read_time = 3.0 if q.get("index") in (5, 7) else 2.5
        sfx_time = 1.0 if q.get("is_trap") else 0.0
        countdown = float(q.get("countdown_seconds", 3.0))
        reveal_time = 2.0 if q.get("index") in (5, 7) else 1.5
        dur += sfx_time + read_time + countdown + reveal_time

    dur += float(script.get("micro_curiosity", {}).get("duration_seconds", 4.0))
    dur += 2.0  # Transition buffer to Boss question
    dur += float(script.get("score_cta", {}).get("duration_seconds", 3.0))
    dur += float(script.get("bonus_question", {}).get("duration_seconds", 6.0))
    dur += 1.0  # Outro loop
    return dur


def audit_stage1_script_contract(script: Dict[str, Any], guide_md: Optional[str] = None) -> Dict[str, Any]:
    """Authoritative Stage 1 Audit Verifier derived strictly from ORIGINAL_REQUEST.md lines 12-19 & 37-40."""
    errors: List[str] = []

    # 1. Slot check
    slot = script.get("slot")
    if slot not in ("12:30", "16:00", "18:30"):
        errors.append(f"Invalid or missing target slot: {slot}. Expected '12:30', '16:00', or '18:30'.")

    # 2. Questions count check (7 graded + 1 bonus = 8 total)
    questions = script.get("questions", [])
    if len(questions) != 7:
        errors.append(f"Expected exactly 7 graded questions, got {len(questions)}.")

    for i, q in enumerate(questions, start=1):
        if q.get("index") != i:
            errors.append(f"Question at position {i} has mismatched index: {q.get('index')}.")
        opts = q.get("options", [])
        if len(opts) != 4:
            errors.append(f"Question {i} must have exactly 4 options, got {len(opts)}.")
        opt_ids = [opt.get("id") for opt in opts]
        if opt_ids != ["A", "B", "C", "D"]:
            errors.append(f"Question {i} option IDs must be ['A', 'B', 'C', 'D'], got {opt_ids}.")
        if q.get("correct_option") not in ("A", "B", "C", "D"):
            errors.append(f"Question {i} invalid correct_option: {q.get('correct_option')}.")
        if not (0 <= q.get("correct_index", -1) <= 3):
            errors.append(f"Question {i} invalid correct_index: {q.get('correct_index')}.")

    # 3. Block 0: Hook challenge and Q5 pegadinha teaser
    hook = script.get("hook", {})
    hook_text = hook.get("hook_text", "")
    if not hook_text:
        errors.append("Hook text is missing or empty.")
    elif "5" not in hook_text and "quinta" not in hook_text.lower():
        errors.append("Hook must promise the question 5 trap to secure viewer retention.")

    # 4. Block 2: Micro-curiosity check
    curiosity = script.get("micro_curiosity", {})
    if curiosity.get("insert_after_question") not in (3, 4):
        errors.append("Micro-curiosity must be inserted after Question 3 or 4.")
    if not (3.0 <= float(curiosity.get("duration_seconds", 0)) <= 5.0):
        errors.append("Micro-curiosity duration must be ~4s (between 3.0s and 5.0s).")

    # 5. Block 3: Pegadinha (Question 5) check
    if len(questions) >= 5:
        q5 = questions[4]
        if not q5.get("is_trap"):
            errors.append("Question 5 (index 5) MUST be flagged as the trap question (is_trap=True).")

    # 6. Block 4: Bonus Question (Q8) check & unresolved answer rule
    bonus = script.get("bonus_question", {})
    if bonus.get("index") != 8:
        errors.append(f"Bonus question must have index 8, got {bonus.get('index')}.")
    if bonus.get("reveal_in_video") is not False:
        errors.append("Bonus question MUST NEVER reveal the answer in video (reveal_in_video must be False).")
    if not bonus.get("correct_answer_secret"):
        errors.append("Bonus question must define correct_answer_secret for pinned comment verification.")
    if not bonus.get("pinned_comment"):
        errors.append("Bonus question must provide a pinned_comment template.")

    # 7. Total Duration Guardrail (65.0s to 80.0s, hard floor 62.0s)
    calc_dur = calculate_script_duration_oracle(script)
    if calc_dur < 65.0:
        errors.append(f"Calculated duration {calc_dur:.1f}s is strictly below required 65.0s floor.")
    elif calc_dur > 80.0:
        errors.append(f"Calculated duration {calc_dur:.1f}s exceeds required 80.0s ceiling.")

    # 8. SEO Metadata check
    seo = script.get("seo", {})
    if not seo.get("title") or not seo.get("caption"):
        errors.append("SEO title and caption are mandatory.")
    hashtags = seo.get("hashtags", [])
    if len(hashtags) < 5:
        errors.append(f"SEO must include at least 5 hashtags, got {len(hashtags)}.")
    if not any("#bussinessmasterbr" in h.lower() for h in hashtags):
        errors.append("SEO hashtags must include '#bussinessmasterbr' for channel attribution.")

    # 9. Guide Markdown validation if provided
    if guide_md is not None:
        if "# Guia de Retenção Passo a Passo" not in guide_md:
            errors.append("Markdown guide missing main title header.")
        if "Matriz de Retenção Psicológica" not in guide_md:
            errors.append("Markdown guide missing psychological retention matrix table.")
        if "Gancho Anti-Scroll" not in guide_md or "Pergunta Bônus" not in guide_md:
            errors.append("Markdown guide missing block breakdown sections.")

    verdict = "PASS" if not errors else "FAIL"
    score = 100.0 if not errors else max(0.0, 100.0 - (len(errors) * 15.0))
    return {
        "verdict": verdict,
        "score": score,
        "calculated_duration_seconds": calc_dur,
        "errors": errors,
        "slot": slot,
    }


# ---------------------------------------------------------------------------
# Tier 1: Unit & Primary Behavior Tests
# ---------------------------------------------------------------------------

class TestStage1Unit:
    """Tier 1: Happy-path isolation and feature verification for R1 & Stage 1."""

    def test_valid_script_passes_contract_audit(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F01 & F05: Valid 8-question script passes Stage 1 audit with 100% score."""
        res = audit_stage1_script_contract(valid_quiz_script_8q)
        assert res["verdict"] == "PASS"
        assert res["score"] == 100.0
        assert len(res["errors"]) == 0
        assert 65.0 <= res["calculated_duration_seconds"] <= 80.0

    def test_script_questions_count_and_options_structure(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F01: Validates that questions list has exactly 7 graded questions with 4 options each."""
        questions = valid_quiz_script_8q["questions"]
        assert len(questions) == 7
        for idx, q in enumerate(questions, 1):
            assert q["index"] == idx
            assert len(q["options"]) == 4
            assert [opt["id"] for opt in q["options"]] == ["A", "B", "C", "D"]
            assert q["correct_option"] in ["A", "B", "C", "D"]
            assert 0 <= q["correct_index"] <= 3

    def test_hook_contains_ego_challenge_and_trap_promise(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F02: Hook (Block 0) challenges ego/IQ and promises the question 5 trap."""
        hook = valid_quiz_script_8q["hook"]
        assert hook["duration_seconds"] == 4.0
        assert "5" in hook["hook_text"] or "quinta" in hook["hook_text"].lower()
        assert len(hook["subtitles_highlight"]) > 0

    def test_five_retention_blocks_presence(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F02: Verifies structural presence of all 5 psychological retention blocks."""
        # Block 0: Hook
        assert "hook" in valid_quiz_script_8q
        # Block 1: Dopamina rápida (Q1, Q2 fácil)
        assert valid_quiz_script_8q["questions"][0]["level"] == "facil"
        assert valid_quiz_script_8q["questions"][1]["level"] == "facil"
        # Block 2: Quebra de padrão (Q3, Q4 médio + micro-curiosidade)
        assert valid_quiz_script_8q["questions"][2]["level"] == "medio"
        assert valid_quiz_script_8q["questions"][3]["level"] == "medio"
        assert valid_quiz_script_8q["micro_curiosity"]["insert_after_question"] in (3, 4)
        # Block 3: Pegadinha (Q5 difícil is_trap=True, Q6 difícil)
        assert valid_quiz_script_8q["questions"][4]["level"] == "dificil"
        assert valid_quiz_script_8q["questions"][4]["is_trap"] is True
        assert valid_quiz_script_8q["questions"][5]["level"] == "dificil"
        # Block 4: Chefão (Q7 impossível + score CTA + Q8 bônus)
        assert valid_quiz_script_8q["questions"][6]["level"] == "impossivel"
        assert valid_quiz_script_8q["score_cta"]["duration_seconds"] >= 2.5
        assert valid_quiz_script_8q["bonus_question"]["index"] == 8
        assert valid_quiz_script_8q["bonus_question"]["reveal_in_video"] is False

    def test_voice_config_defaults_to_pt_br(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F01: Validates that voice configuration targets pt-BR neural synthesis."""
        voice = valid_quiz_script_8q["voice_config"]
        assert "pt-BR" in voice["voice_name"]
        assert voice["voice_name"] in ("pt-BR-AntonioNeural", "pt-BR-FranciscaNeural")

    def test_seo_metadata_has_mandatory_tags(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F04: SEO metadata contains title, caption, and channel attribution hashtag."""
        seo = valid_quiz_script_8q["seo"]
        assert len(seo["title"]) > 10
        assert len(seo["caption"]) > 20
        assert len(seo["hashtags"]) >= 5
        assert any("#bussinessmasterbr" in tag.lower() for tag in seo["hashtags"])


# ---------------------------------------------------------------------------
# Tier 2: Boundary, Edge & Adversarial Tests
# ---------------------------------------------------------------------------

class TestStage1BoundaryAndEdge:
    """Tier 2: Boundary value analysis, corner conditions, and adversarial inputs."""

    def test_reject_duration_below_65s(self, short_quiz_script_55s: Dict[str, Any]):
        """Feature F01 & F05: Reject script when calculated duration is < 65.0s (e.g. 52.0s)."""
        res = audit_stage1_script_contract(short_quiz_script_55s)
        assert res["verdict"] == "FAIL"
        assert any("below required 65.0s floor" in err for err in res["errors"])

    def test_reject_duration_above_80s(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F01 & F05: Reject script when calculated duration exceeds 80.0s (e.g. 85.0s)."""
        long_script = json.loads(json.dumps(valid_quiz_script_8q))
        for q in long_script["questions"]:
            q["countdown_seconds"] = 5.0  # Expands total duration beyond 80s
        res = audit_stage1_script_contract(long_script)
        assert res["verdict"] == "FAIL"
        assert any("exceeds required 80.0s ceiling" in err for err in res["errors"])

    def test_reject_bonus_question_with_revealed_answer(self, missing_bonus_quiz_script: Dict[str, Any]):
        """Feature F02 & F05: Reject script if Q8 bonus reveals answer in video (Zeigarnik loop violation)."""
        res = audit_stage1_script_contract(missing_bonus_quiz_script)
        assert res["verdict"] == "FAIL"
        assert any("NEVER reveal the answer in video" in err for err in res["errors"])

    def test_reject_missing_trap_in_question_5(self, missing_trap_quiz_script: Dict[str, Any]):
        """Feature F02 & F05: Reject script if Question 5 is not configured as trap."""
        res = audit_stage1_script_contract(missing_trap_quiz_script)
        assert res["verdict"] == "FAIL"
        assert any("MUST be flagged as the trap question" in err for err in res["errors"])

    def test_reject_invalid_slot_name(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F04 & F05: Reject script targeting an unauthorized slot (e.g. '14:00')."""
        invalid_slot = json.loads(json.dumps(valid_quiz_script_8q))
        invalid_slot["slot"] = "14:00"
        res = audit_stage1_script_contract(invalid_slot)
        assert res["verdict"] == "FAIL"
        assert any("Invalid or missing target slot" in err for err in res["errors"])

    def test_reject_incomplete_options_count(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F01: Reject question with only 3 options instead of exactly 4."""
        bad_opts = json.loads(json.dumps(valid_quiz_script_8q))
        bad_opts["questions"][0]["options"] = bad_opts["questions"][0]["options"][:3]
        res = audit_stage1_script_contract(bad_opts)
        assert res["verdict"] == "FAIL"
        assert any("must have exactly 4 options" in err for err in res["errors"])

    def test_reject_missing_hook_promise(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F02: Reject script when hook does not mention question 5 trap."""
        no_promise = json.loads(json.dumps(valid_quiz_script_8q))
        no_promise["hook"]["hook_text"] = "Olá pessoal, hoje teremos um quiz normal de conhecimentos gerais."
        res = audit_stage1_script_contract(no_promise)
        assert res["verdict"] == "FAIL"
        assert any("Hook must promise the question 5 trap" in err for err in res["errors"])

    def test_reject_missing_channel_hashtag(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F04: Reject script when SEO hashtags omit @bussinessmasterbr attribution."""
        no_channel = json.loads(json.dumps(valid_quiz_script_8q))
        no_channel["seo"]["hashtags"] = ["#quiz", "#trivia", "#conhecimento", "#fatos", "#brasil"]
        res = audit_stage1_script_contract(no_channel)
        assert res["verdict"] == "FAIL"
        assert any("#bussinessmasterbr" in err for err in res["errors"])


# ---------------------------------------------------------------------------
# Tier 3: Pairwise & Cross-Feature Interaction Tests
# ---------------------------------------------------------------------------

class TestStage1PairwiseIntegration:
    """Tier 3: Cross-feature contracts and interactions."""

    def test_daily_slots_scripts_coverage(self, daily_slots_scripts: Dict[str, Dict[str, Any]]):
        """Feature F04: All 3 daily viral slots (12:30, 16:00, 18:30) pass Stage 1 audit."""
        assert set(daily_slots_scripts.keys()) == {"12:30", "16:00", "18:30"}
        for slot, script in daily_slots_scripts.items():
            audit_res = audit_stage1_script_contract(script)
            assert audit_res["verdict"] == "PASS", f"Slot {slot} audit failed: {audit_res['errors']}"
            assert audit_res["slot"] == slot
            assert 65.0 <= audit_res["calculated_duration_seconds"] <= 80.0

    def test_markdown_guide_builder_contract_alignment(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F03: Markdown guide contains all structural sections and syncs with script."""
        # Synthesize a minimal reference guide matching the contract
        guide_text = f"""# Guia de Retenção Passo a Passo — Dark Quiz @bussinessmasterbr
**ID do Roteiro:** {valid_quiz_script_8q['script_id']} | **Horário Alvo:** {valid_quiz_script_8q['slot']}

## 📊 Matriz de Retenção Psicológica
| Intervalo | Bloco Psicológico | Ação em Tela | Áudio & SFX | Gatilho Psicológico | Métrica TikTok Impactada |
|---|---|---|---|---|---|
| 00s–04s | Gancho Anti-Scroll | Chamada para desafio | Whoosh de impacto | Quebra de padrão | Retenção em 3s |

## ⏱️ Roteiro Detalhado Segundo a Segundo
### [00:00 - 00:04] Gancho Anti-Scroll
Narração: {valid_quiz_script_8q['hook']['hook_text']}

### [01:05 - 01:71] Bloco Final — Pergunta Bônus Sem Resposta
Pergunta Bônus: {valid_quiz_script_8q['bonus_question']['question_text']}
"""
        audit_res = audit_stage1_script_contract(valid_quiz_script_8q, guide_md=guide_text)
        assert audit_res["verdict"] == "PASS"

    @pytest.mark.skipif(not SRC_STAGE1_AVAILABLE, reason="src.scripts modules not yet generated by worker M1")
    def test_src_script_generator_integration(self):
        """Feature F02 & F05: When src implementation is active, verify generate_daily_scripts."""
        scripts = generate_daily_scripts()
        assert len(scripts) == 3
        for slot in ("12:30", "16:00", "18:30"):
            assert slot in scripts
            audit_res = audit_stage1_script(scripts[slot])
            assert audit_res.verdict == "PASS"


# ---------------------------------------------------------------------------
# Tier 4: Real-World Application Scenario
# ---------------------------------------------------------------------------

class TestStage1RealWorldScenario:
    """Tier 4: End-to-end scenario for Stage 1 script and guide generation."""

    def test_full_script_pipeline_scenario_for_all_slots(
        self,
        daily_slots_scripts: Dict[str, Dict[str, Any]],
        tmp_path: Path,
    ):
        """Scenario 1 (from TEST_INFRA.md): Generate, persist, and audit 3 daily slots."""
        output_dir = tmp_path / "data" / "scripts"
        output_dir.mkdir(parents=True, exist_ok=True)

        for slot_key, script_data in daily_slots_scripts.items():
            filename_suffix = slot_key.replace(":", "")
            json_file = output_dir / f"script_{filename_suffix}.json"
            guide_file = output_dir / f"guide_{filename_suffix}.md"

            # 1. Persist JSON
            json_file.write_text(json.dumps(script_data, indent=2, ensure_ascii=False), encoding="utf-8")
            assert json_file.exists()
            assert json_file.stat().st_size > 1000

            # 2. Persist Mock Markdown Guide
            guide_content = (
                f"# Guia de Retenção Passo a Passo — Dark Quiz @bussinessmasterbr\n"
                f"**Slot:** {slot_key}\n\n"
                f"## 📊 Matriz de Retenção Psicológica\n"
                f"| 00s-04s | Gancho Anti-Scroll |\n\n"
                f"## ⏱️ Roteiro Detalhado\n"
                f"### [00:00 - 00:04] Gancho Anti-Scroll\n"
                f"### Pergunta Bônus Sem Resposta\n"
            )
            guide_file.write_text(guide_content, encoding="utf-8")
            assert guide_file.exists()

            # 3. Read back and audit
            loaded_script = json.loads(json_file.read_text(encoding="utf-8"))
            loaded_guide = guide_file.read_text(encoding="utf-8")
            audit_res = audit_stage1_script_contract(loaded_script, guide_md=loaded_guide)

            assert audit_res["verdict"] == "PASS"
            assert audit_res["score"] == 100.0
            assert 65.0 <= audit_res["calculated_duration_seconds"] <= 80.0
