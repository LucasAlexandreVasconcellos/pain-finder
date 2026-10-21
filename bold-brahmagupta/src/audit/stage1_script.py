"""Stage 1 Script & Retention Auditor for TikTok Dark Quiz (@bussinessmasterbr).

Validates:
1. Pydantic schema conformance of all scripts.
2. 5-block psychological retention progression:
   - Hook (00-04s): Challenges ego and promises trap on Q5.
   - Block 1 (04-18s): Easy questions (Q1, Q2) activating "Winner Effect".
   - Block 2 (18-36s): Medium questions (Q3, Q4) + 4s micro-curiosity at ~30s.
   - Block 3 (36-54s): Q5 trap (is_trap=True) + Q6 difficult.
   - Block 4 (54-72s): Q7 impossible + Score CTA + Q8 Bonus (reveal_in_video=False).
3. Duration constraints strictly within [65.0s, 80.0s] (asserted >= 62.0s).
4. Question 8 bonus cliffhanger: secret answer present, never revealed in video.
5. High-performing SEO metadata (title, caption, cover headline, viral hashtags).
6. Companion Markdown production guides (second-by-second breakdown, SFX, visual directions).

CLI Usage:
    python -m src.audit.stage1_script --script-dir data/scripts/
    python -m src.audit.stage1_script --script data/scripts/script_1230.json
"""

import argparse
import json
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from src.scripts.schema import DarkQuizScript

__all__ = [
    "Stage1ScriptAuditor",
    "StageAuditResult",
    "run_stage1_audit",
    "audit_stage1_script",
]


@dataclass
class StageAuditResult:
    """Standard audit result data contract for the self-audit pipeline."""
    stage: int = 1
    stage_name: str = "Stage 1: Script & Retention Audit"
    verdict: str = "PASS"  # "PASS" or "FAIL"
    score: float = 100.0
    metrics: Dict[str, Any] = field(default_factory=dict)
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    summary: str = ""

    def to_dict(self) -> Dict[str, Any]:
        """Converts audit result to dictionary."""
        return asdict(self)


class Stage1ScriptAuditor:
    """Rigorous independent auditor for Stage 1 scripts and retention guides."""

    REQUIRED_SLOTS = ["12:30", "16:00", "18:30"]
    REQUIRED_NICHE_HASHTAGS = {"#quiz", "#quizdark", "#curiosidades", "#conhecimento", "#desafio", "#bussinessmasterbr"}

    def __init__(self) -> None:
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.metrics: Dict[str, Any] = {}

    def audit_script(self, script: Union[DarkQuizScript, Dict[str, Any]], name: str = "script") -> StageAuditResult:
        """Audits an in-memory script (DarkQuizScript instance or raw dictionary)."""
        if isinstance(script, dict):
            return self.audit_script_dict(script, name=name)
        elif isinstance(script, DarkQuizScript):
            raw_dict = script.to_dict()
            return self._audit_script_instance(script, raw_dict, name=name)
        else:
            return StageAuditResult(
                stage=1,
                verdict="FAIL",
                score=0.0,
                metrics={"name": name},
                errors=[f"Unsupported script type: {type(script)}"],
                summary=f"FAILED: Unsupported script type: {type(script)}",
            )

    def audit_script_dict(self, script_dict: Dict[str, Any], name: str = "script_dict") -> StageAuditResult:
        """Audits a raw script dictionary in-memory against all Stage 1 rules."""
        metrics: Dict[str, Any] = {"name": name}
        errors: List[str] = []

        try:
            script = DarkQuizScript.from_dict(script_dict)
        except Exception as exc:
            errors.append(f"Schema validation error in {name}: {exc}")
            return StageAuditResult(
                stage=1,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=errors,
                summary=f"FAILED: Schema validation failed for {name}.",
            )

        return self._audit_script_instance(script, script_dict, name=name)

    def _audit_script_instance(
        self,
        script: DarkQuizScript,
        raw_dict: Dict[str, Any],
        name: str = "script",
    ) -> StageAuditResult:
        errors: List[str] = []
        warnings: List[str] = []
        metrics: Dict[str, Any] = {
            "name": name,
            "script_id": script.script_id,
            "slot": script.slot,
            "theme": script.theme,
        }

        # 1. Total duration audit
        total_duration = script.estimate_total_duration()
        metrics["estimated_duration_seconds"] = total_duration
        if total_duration < 65.0:
            errors.append(
                f"Duration {total_duration:.1f}s is below 65.0s minimum threshold. "
                "TikTok Creator Rewards requires >60.0s."
            )
        elif total_duration > 80.0:
            errors.append(
                f"Duration {total_duration:.1f}s exceeds 80.0s maximum threshold."
            )

        if total_duration < 62.0:
            errors.append(
                f"CRITICAL: Duration {total_duration:.1f}s violates hard platform floor (62.0s)."
            )

        # 2. Hook audit
        hook_lower = script.hook.hook_text.lower()
        if not ("5" in hook_lower or "quinta" in hook_lower or "número 5" in hook_lower):
            errors.append("Hook does not anticipate question 5 pegadinha/trap.")
        if not (3.5 <= script.hook.duration_seconds <= 4.5):
            errors.append(f"Hook duration {script.hook.duration_seconds}s outside [3.5s, 4.5s].")

        # 3. Question progression and levels audit
        if len(script.questions) != 7:
            errors.append(f"Script must contain exactly 7 questions, found {len(script.questions)}.")
        else:
            q_levels = [q.level for q in script.questions]
            expected_levels = ["facil", "facil", "medio", "medio", "dificil", "dificil", "impossivel"]
            if q_levels != expected_levels:
                errors.append(
                    f"Invalid question level progression: {q_levels}. Expected: {expected_levels}"
                )

            # Check Q5 trap
            q5 = script.questions[4]
            if not q5.is_trap:
                errors.append("Question 5 (index 5) is NOT marked as is_trap=True.")

            # Check Q1-Q7 options and correct index
            for q in script.questions:
                if len(q.options) != 4:
                    errors.append(f"Question {q.index} has {len(q.options)} options instead of 4.")
                if q.correct_index not in (0, 1, 2, 3):
                    errors.append(f"Question {q.index} has invalid correct_index {q.correct_index}.")
                elif q.options[q.correct_index].id != q.correct_option:
                    errors.append(
                        f"Question {q.index} option mismatch: options[{q.correct_index}].id="
                        f"'{q.options[q.correct_index].id}' != correct_option '{q.correct_option}'."
                    )
                if not q.explanation.strip():
                    errors.append(f"Question {q.index} has empty explanation.")

        # 4. Micro-curiosity audit
        if script.micro_curiosity.insert_after_question not in (3, 4):
            errors.append(
                f"Micro-curiosity must be inserted after Q3 or Q4, got {script.micro_curiosity.insert_after_question}."
            )
        if not (3.5 <= script.micro_curiosity.duration_seconds <= 4.5):
            errors.append(
                f"Micro-curiosity duration {script.micro_curiosity.duration_seconds}s outside [3.5s, 4.5s]."
            )
        if not script.micro_curiosity.text.strip():
            errors.append("Micro-curiosity text is empty.")

        # 5. Score CTA audit
        if not script.score_cta.text.strip():
            errors.append("Score CTA text is empty.")

        # 6. Bonus question Q8 (Comment cliffhanger) audit
        bonus = script.bonus_question
        if bonus.index != 8:
            errors.append(f"Bonus question index must be 8, got {bonus.index}.")
        if bonus.reveal_in_video is not False:
            errors.append("CRITICAL RETENTION VIOLATION: Bonus question Q8 reveal_in_video MUST be False.")
        if not bonus.correct_answer_secret.strip():
            errors.append("Bonus question secret answer is missing.")
        if not bonus.pinned_comment.strip():
            errors.append("Bonus question pinned comment text is missing.")

        # 7. SEO Metadata audit
        seo = script.seo
        if not seo.title.strip():
            errors.append("SEO title is empty.")
        if not seo.caption.strip():
            errors.append("SEO caption is empty.")
        if not seo.cover_headline.strip():
            errors.append("Cover headline is empty.")
        if len(seo.hashtags) < 5:
            errors.append(f"Expected at least 5 hashtags, got {len(seo.hashtags)}.")
        matched_tags = [tag for tag in seo.hashtags if tag in self.REQUIRED_NICHE_HASHTAGS]
        if len(matched_tags) < 2:
            warnings.append(
                f"Few recommended niche hashtags found ({matched_tags}). "
                f"Consider adding more from {self.REQUIRED_NICHE_HASHTAGS}."
            )
        if not any("#bussinessmasterbr" in tag.lower() for tag in seo.hashtags):
            errors.append("SEO hashtags must include '#bussinessmasterbr' for channel attribution.")

        verdict = "PASS" if not errors else "FAIL"
        score = 100.0 if verdict == "PASS" else max(0.0, 100.0 - (len(errors) * 15.0))
        summary = (
            f"{verdict}: {name} ({script.slot}) — Duration: {total_duration:.1f}s, "
            f"Errors: {len(errors)}, Warnings: {len(warnings)}"
        )

        return StageAuditResult(
            stage=1,
            verdict=verdict,
            score=score,
            metrics=metrics,
            errors=errors,
            warnings=warnings,
            summary=summary,
        )

    def audit_script_file(self, script_path: Union[str, Path]) -> StageAuditResult:
        """Audits a single JSON script file against all Stage 1 rules."""
        path = Path(script_path)
        metrics: Dict[str, Any] = {"file": str(path)}

        if not path.exists():
            return StageAuditResult(
                stage=1,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=[f"Script file does not exist: {path}"],
                summary=f"FAILED: File {path} not found.",
            )

        try:
            with open(path, "r", encoding="utf-8") as f:
                raw_json = json.load(f)
        except Exception as exc:
            return StageAuditResult(
                stage=1,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=[f"JSON read error in {path.name}: {exc}"],
                summary=f"FAILED: JSON read error in {path.name}.",
            )

        res = self.audit_script_dict(raw_json, name=path.name)
        res.metrics["file"] = str(path)
        return res

    def audit_guide_text(self, content: str, name: str = "guide_text") -> StageAuditResult:
        """Audits the text content of a companion Markdown retention guide."""
        errors: List[str] = []
        warnings: List[str] = []
        metrics: Dict[str, Any] = {"name": name}

        metrics["file_size_bytes"] = len(content.encode("utf-8"))
        metrics["line_count"] = len(content.splitlines())

        if len(content) < 1000:
            errors.append(f"Guide file is too short ({len(content)} characters). Expected comprehensive guide.")

        # Key required sections
        required_keywords = [
            "Matriz de Retenção Psicológica",
            "Roteiro Detalhado Segundo a Segundo",
            "Gancho Anti-Scroll",
            "Pergunta 1",
            "Micro-Curiosidade",
            "Pergunta 5",
            "PEGADINHA",
            "Pergunta 7",
            "Pergunta Bônus",
            "COMENTÁRIO FIXADO",
            "Copywriting de Publicação & Estratégia de SEO",
            "Checklist de Auditoria",
        ]
        for kw in required_keywords:
            if kw.lower() not in content.lower():
                errors.append(f"Guide is missing required section or keyword: '{kw}'")

        # Sound cues check
        sfx_keywords = ["sfx_tick_tack", "sfx_correct_ding", "sfx_whoosh"]
        found_sfx = [sfx for sfx in sfx_keywords if sfx in content]
        if len(found_sfx) < 2:
            warnings.append(f"Few sound cues found in guide: {found_sfx}")

        verdict = "PASS" if not errors else "FAIL"
        score = 100.0 if verdict == "PASS" else max(0.0, 100.0 - (len(errors) * 15.0))
        summary = (
            f"{verdict}: Guide {name} — Lines: {metrics['line_count']}, "
            f"Errors: {len(errors)}, Warnings: {len(warnings)}"
        )

        return StageAuditResult(
            stage=1,
            verdict=verdict,
            score=score,
            metrics=metrics,
            errors=errors,
            warnings=warnings,
            summary=summary,
        )

    def audit_guide_file(self, guide_path: Union[str, Path]) -> StageAuditResult:
        """Audits a companion Markdown retention guide."""
        path = Path(guide_path)
        metrics: Dict[str, Any] = {"guide_file": str(path)}

        if not path.exists():
            return StageAuditResult(
                stage=1,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=[f"Guide file not found: {path}"],
                summary=f"FAILED: Guide {path} does not exist.",
            )

        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        res = self.audit_guide_text(content, name=path.name)
        res.metrics["guide_file"] = str(path)
        return res

    def audit_directory(self, script_dir: Union[str, Path]) -> StageAuditResult:
        """Audits the complete scripts directory containing JSON scripts and Markdown guides."""
        dir_path = Path(script_dir)
        errors: List[str] = []
        warnings: List[str] = []
        metrics: Dict[str, Any] = {"directory": str(dir_path), "slots_audited": {}}

        if not dir_path.exists() or not dir_path.is_dir():
            return StageAuditResult(
                stage=1,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=[f"Scripts directory not found: {dir_path}"],
                summary=f"FAILED: Directory {dir_path} does not exist.",
            )

        # Verify presence of all 3 required slots
        found_slots = set()
        script_results: List[StageAuditResult] = []
        guide_results: List[StageAuditResult] = []

        for slot in self.REQUIRED_SLOTS:
            clean_slot = slot.replace(":", "")
            json_name = f"script_{clean_slot}.json"
            guide_name = f"guide_{clean_slot}.md"

            json_path = dir_path / json_name
            guide_path = dir_path / guide_name

            # Audit script JSON
            res_script = self.audit_script_file(json_path)
            script_results.append(res_script)
            if res_script.verdict == "PASS":
                found_slots.add(slot)
            errors.extend(res_script.errors)
            warnings.extend(res_script.warnings)

            # Audit guide MD
            res_guide = self.audit_guide_file(guide_path)
            guide_results.append(res_guide)
            errors.extend(res_guide.errors)
            warnings.extend(res_guide.warnings)

            metrics["slots_audited"][slot] = {
                "script_verdict": res_script.verdict,
                "script_duration": res_script.metrics.get("estimated_duration_seconds"),
                "guide_verdict": res_guide.verdict,
            }

        missing_slots = set(self.REQUIRED_SLOTS) - found_slots
        if missing_slots:
            errors.append(f"Missing valid scripts for required slots: {list(missing_slots)}")

        verdict = "PASS" if not errors else "FAIL"
        total_checks = len(script_results) + len(guide_results)
        passed_checks = sum(1 for r in script_results if r.verdict == "PASS") + sum(1 for r in guide_results if r.verdict == "PASS")
        score = (passed_checks / total_checks) * 100.0 if total_checks > 0 else 0.0
        if errors and score == 100.0:
            score = 90.0

        summary = (
            f"Stage 1 Audit {verdict}: {len(found_slots)}/{len(self.REQUIRED_SLOTS)} viral slots passed. "
            f"Total errors: {len(errors)}, warnings: {len(warnings)}."
        )

        return StageAuditResult(
            stage=1,
            verdict=verdict,
            score=round(score, 1),
            metrics=metrics,
            errors=errors,
            warnings=warnings,
            summary=summary,
        )


def run_stage1_audit(
    script_or_context: Optional[Union[DarkQuizScript, Dict[str, Any], str, Path]] = None,
    guide_md: Optional[str] = None,
    **kwargs: Any,
) -> StageAuditResult:
    """Entry point compatible with both central pipeline and direct script auditing."""
    auditor = Stage1ScriptAuditor()

    if script_or_context is None:
        return auditor.audit_directory("data/scripts")

    if isinstance(script_or_context, DarkQuizScript):
        res = auditor.audit_script(script_or_context)
    elif isinstance(script_or_context, dict):
        if "questions" in script_or_context or "slot" in script_or_context:
            res = auditor.audit_script_dict(script_or_context)
        else:
            return auditor.audit_directory(script_or_context.get("script_dir", "data/scripts"))
    elif isinstance(script_or_context, (str, Path)):
        p = Path(script_or_context)
        if p.is_dir():
            return auditor.audit_directory(p)
        else:
            res = auditor.audit_script_file(p)
    else:
        res = auditor.audit_script(script_or_context)

    if guide_md is not None and res.verdict == "PASS":
        guide_res = auditor.audit_guide_text(guide_md)
        if guide_res.verdict != "PASS":
            res.verdict = "FAIL"
            res.errors.extend(guide_res.errors)
            res.score = min(res.score, guide_res.score)

    return res


audit_stage1_script = run_stage1_audit



def run_self_tests() -> bool:
    """Runs a comprehensive suite of unit and boundary self-tests."""
    print("🧪 Running Stage 1 Self-Tests...")
    auditor = Stage1ScriptAuditor()
    all_passed = True

    # Test 1: Production scripts in data/scripts/
    print("  [Test 1] Auditing production directory data/scripts/...")
    dir_res = auditor.audit_directory("data/scripts")
    if dir_res.verdict != "PASS" or dir_res.score < 100.0:
        print(f"  ❌ Test 1 FAILED: {dir_res.summary}")
        all_passed = False
    else:
        print(f"  ✓ Test 1 PASSED: 3/3 scripts & guides validated (Score: {dir_res.score})")

    # Test 2: Boundary test - Duration < 65s rejected
    print("  [Test 2] Boundary test - Duration < 65.0s rejection...")
    try:
        from src.scripts.generator import get_preset_script
        s = get_preset_script("12:30")
        s_dict = s.to_dict()
        s_dict["questions"][0]["countdown_seconds"] = 0.5
        s_dict["questions"][1]["countdown_seconds"] = 0.5
        s_dict["questions"][2]["countdown_seconds"] = 0.5
        s_dict["questions"][3]["countdown_seconds"] = 0.5
        s_dict["questions"][5]["countdown_seconds"] = 0.5
        s_dict["target_duration_seconds"] = 60.0
        # Should raise ValueError during validation
        try:
            DarkQuizScript.from_dict(s_dict)
            print("  ❌ Test 2 FAILED: Expected ValueError on duration < 65s")
            all_passed = False
        except ValueError:
            print("  ✓ Test 2 PASSED: Duration < 65.0s correctly rejected by schema.")
    except Exception as exc:
        print(f"  ❌ Test 2 Error: {exc}")
        all_passed = False

    # Test 3: Trap test - Q5 without is_trap rejected
    print("  [Test 3] Retention rule - Q5 without is_trap rejection...")
    try:
        s = get_preset_script("12:30")
        s_dict = s.to_dict()
        s_dict["questions"][4]["is_trap"] = False
        try:
            DarkQuizScript.from_dict(s_dict)
            print("  ❌ Test 3 FAILED: Expected ValueError on Q5 is_trap=False")
            all_passed = False
        except ValueError:
            print("  ✓ Test 3 PASSED: Q5 is_trap=False correctly rejected by schema.")
    except Exception as exc:
        print(f"  ❌ Test 3 Error: {exc}")
        all_passed = False

    # Test 4: Cliffhanger rule - Q8 reveal_in_video=True rejected
    print("  [Test 4] Retention rule - Q8 reveal_in_video=True rejection...")
    try:
        s = get_preset_script("12:30")
        s_dict = s.to_dict()
        s_dict["bonus_question"]["reveal_in_video"] = True
        try:
            DarkQuizScript.from_dict(s_dict)
            print("  ❌ Test 4 FAILED: Expected ValueError on Q8 reveal_in_video=True")
            all_passed = False
        except ValueError:
            print("  ✓ Test 4 PASSED: Q8 reveal_in_video=True correctly rejected by schema.")
    except Exception as exc:
        print(f"  ❌ Test 4 Error: {exc}")
        all_passed = False

    # Test 5: Guide audit rejection on incomplete guide
    print("  [Test 5] Guide auditor rejection on missing sections...")
    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as tf:
        tf.write("# Short Guide\nOnly a couple lines.")
        tf_path = Path(tf.name)
    try:
        bad_guide_res = auditor.audit_guide_file(tf_path)
        if bad_guide_res.verdict == "FAIL" and len(bad_guide_res.errors) > 0:
            print("  ✓ Test 5 PASSED: Incomplete guide correctly rejected.")
        else:
            print("  ❌ Test 5 FAILED: Expected FAIL on incomplete guide.")
            all_passed = False
    finally:
        if tf_path.exists():
            tf_path.unlink()

    print(f"🎯 Self-Tests Result: {'ALL PASSED (5/5)' if all_passed else 'SOME TESTS FAILED'}")
    return all_passed


def main() -> None:
    """CLI entry point for Stage 1 Script Auditor."""
    parser = argparse.ArgumentParser(
        description="Stage 1 Script & Retention Auditor for @bussinessmasterbr"
    )
    parser.add_argument(
        "--script-dir",
        type=str,
        default="data/scripts",
        help="Directory containing script JSONs and guide MDs (default: data/scripts)",
    )
    parser.add_argument(
        "--script",
        type=str,
        default=None,
        help="Optional single script JSON path to audit",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output raw JSON results",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run comprehensive unit and boundary self-tests",
    )

    args = parser.parse_args()

    if args.self_test:
        success = run_self_tests()
        sys.exit(0 if success else 1)

    auditor = Stage1ScriptAuditor()

    if args.script:
        result = auditor.audit_script_file(args.script)
    else:
        result = auditor.audit_directory(args.script_dir)

    if args.json:
        print(json.dumps(result.to_dict(), indent=2, ensure_ascii=False))
    else:
        print("=" * 70)
        print("📋 STAGE 1 AUDIT: SCRIPT & RETENTION INTELLIGENCE REPORT")
        print("=" * 70)
        print(f"Verdict: {result.verdict}")
        print(f"Score:   {result.score}/100.0")
        print(f"Summary: {result.summary}")
        print("-" * 70)
        if result.metrics:
            print("📊 Metrics:")
            for k, v in result.metrics.items():
                print(f"  • {k}: {v}")
        if result.warnings:
            print("⚠️ Warnings:")
            for w in result.warnings:
                print(f"  • {w}")
        if result.errors:
            print("❌ Errors:")
            for e in result.errors:
                print(f"  • {e}")
        print("=" * 70)

    sys.exit(0 if result.verdict == "PASS" else 1)


if __name__ == "__main__":
    main()
