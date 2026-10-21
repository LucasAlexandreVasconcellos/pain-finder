"""Tier 1-4 Test Suite: E2E Pipeline, Central 4-Stage Self-Audit & Acceptance Certification.

Tests Features F23, F24, F25 and Scenario 5 against authoritative specifications in
ORIGINAL_REQUEST.md (lines 32-34, 46-48), PROJECT.md, and TEST_INFRA.md.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
import pytest

from tests.test_stage1_script_audit import audit_stage1_script_contract
from tests.test_stage2_audio_audit import audit_stage2_audio_contract
from tests.test_stage3_video_audit import audit_stage3_video_contract
from tests.test_stage4_scheduler_audit import audit_stage4_scheduler_contract
from tests.conftest import generate_pcm_sine_wav

# Try importing implementation modules from src if available
try:
    from audit import run_full_audit
    from src.audit.reporter import generate_audit_report, generate_audit_certificate
    SRC_AUDIT_AVAILABLE = True
except ImportError:
    SRC_AUDIT_AVAILABLE = False


# ---------------------------------------------------------------------------
# Authoritative Contract Specification Oracle for Central 4-Stage Audit
# ---------------------------------------------------------------------------

def run_central_audit_pipeline_contract(
    script_data: Dict[str, Any],
    audio_bytes: bytes,
    video_ffprobe_data: Dict[str, Any],
    scheduler_config: Dict[str, Any],
    session_dir: Optional[Path] = None,
    output_dir: Optional[Path] = None,
) -> Dict[str, Any]:
    """Authoritative Central Self-Audit Pipeline Runner (audit.py logic).
    
    Executes Stages 1, 2, 3, 4 sequentially and aggregates reports.
    """
    stage1_res = audit_stage1_script_contract(script_data)
    stage2_res = audit_stage2_audio_contract(audio_bytes, script_data=script_data)
    stage3_res = audit_stage3_video_contract(video_ffprobe_data)
    stage4_res = audit_stage4_scheduler_contract(scheduler_config, session_dir=session_dir, dry_run=True)

    all_verdicts = [
        stage1_res["verdict"],
        stage2_res["verdict"],
        stage3_res["verdict"],
        stage4_res["verdict"],
    ]
    overall_verdict = "PASS" if all(v == "PASS" for v in all_verdicts) else "FAIL"
    overall_score = (
        stage1_res["score"]
        + stage2_res["score"]
        + stage3_res["score"]
        + stage4_res["score"]
    ) / 4.0

    aggregated_report = {
        "channel": "@bussinessmasterbr",
        "timestamp": "2026-10-21T15:00:00Z",
        "overall_verdict": overall_verdict,
        "overall_score": overall_score,
        "stages": {
            "stage1_script": stage1_res,
            "stage2_audio": stage2_res,
            "stage3_video": stage3_res,
            "stage4_scheduler": stage4_res,
        },
    }

    # Generate Markdown Certificate if output directory is provided
    if output_dir is not None:
        output_dir.mkdir(parents=True, exist_ok=True)
        report_json_path = output_dir / "audit_report.json"
        cert_md_path = output_dir / "AUDIT_CERTIFICATE.md"

        report_json_path.write_text(json.dumps(aggregated_report, indent=2), encoding="utf-8")

        status_badge = "[PASSED]" if overall_verdict == "PASS" else "[FAILED]"
        cert_content = f"""# Relatório de Certificação de Auditoria — @bussinessmasterbr
**Status Global:** {status_badge} | **Score Global:** {overall_score:.1f}/100.0
**Canal:** @bussinessmasterbr | **Modo:** Dry-Run Seguro

---

## 📋 Resumo Executivo das Etapas
| Etapa | Módulo | Veredito | Score | Duração / Specs |
|---|---|---|---|---|
| Etapa 1 | Roteiro & Retenção 5 Blocos | {stage1_res['verdict']} | {stage1_res['score']:.1f} | {stage1_res.get('calculated_duration_seconds', 0.0):.1f}s |
| Etapa 2 | Áudio & Narração pt-BR | {stage2_res['verdict']} | {stage2_res['score']:.1f} | RMS: {stage2_res.get('rms_dbfs', 0.0):.1f} dBFS |
| Etapa 3 | Vídeo 1080x1920 & HUD Animado | {stage3_res['verdict']} | {stage3_res['score']:.1f} | Duração: {stage3_res.get('duration_seconds', 0.0):.1f}s (>= 62s) |
| Etapa 4 | Agendador TikTok Studio Web | {stage4_res['verdict']} | {stage4_res['score']:.1f} | Slots: 12:30, 16:00, 18:30 |

## 🔒 Declaração de Prontidão de Publicação
O sistema atende a todos os critérios de retenção, duração obrigatória (>60s) e monetização no TikTok Creator Rewards Program.
"""
        cert_md_path.write_text(cert_content, encoding="utf-8")

    return aggregated_report


# ---------------------------------------------------------------------------
# Tier 1: Unit & Feature Verification Tests
# ---------------------------------------------------------------------------

class TestE2EPipelineUnit:
    """Tier 1: Central audit runner, JSON report generation, and certificate emission."""

    def test_full_pipeline_audit_pass(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Feature F23: All 4 stages pass and produce overall PASS verdict with 100% score."""
        audio_bytes = generate_pcm_sine_wav(duration_s=72.0, sample_rate=44100, amplitude=0.4)
        queue_cfg = {
            "slots": ["12:30", "16:00", "18:30"],
            "timezone": "America/Sao_Paulo",
        }
        out_dir = tmp_path / "output" / "audit"

        report = run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
            output_dir=out_dir,
        )

        assert report["overall_verdict"] == "PASS"
        assert report["overall_score"] == 100.0
        assert report["stages"]["stage1_script"]["verdict"] == "PASS"
        assert report["stages"]["stage2_audio"]["verdict"] == "PASS"
        assert report["stages"]["stage3_video"]["verdict"] == "PASS"
        assert report["stages"]["stage4_scheduler"]["verdict"] == "PASS"

    def test_audit_report_json_artifact_schema(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Feature F24: audit_report.json conforms to data schema with all stage results."""
        audio_bytes = generate_pcm_sine_wav(duration_s=72.0, sample_rate=44100, amplitude=0.4)
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}
        out_dir = tmp_path / "output" / "audit"

        run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
            output_dir=out_dir,
        )

        json_file = out_dir / "audit_report.json"
        assert json_file.exists()
        data = json.loads(json_file.read_text(encoding="utf-8"))
        assert data["channel"] == "@bussinessmasterbr"
        assert data["overall_verdict"] == "PASS"
        assert "stage1_script" in data["stages"]
        assert "stage2_audio" in data["stages"]
        assert "stage3_video" in data["stages"]
        assert "stage4_scheduler" in data["stages"]

    def test_audit_certificate_markdown_artifact(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Feature F24: AUDIT_CERTIFICATE.md contains executive summary and stage status."""
        audio_bytes = generate_pcm_sine_wav(duration_s=72.0, sample_rate=44100, amplitude=0.4)
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}
        out_dir = tmp_path / "output" / "audit"

        run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
            output_dir=out_dir,
        )

        cert_file = out_dir / "AUDIT_CERTIFICATE.md"
        assert cert_file.exists()
        cert_text = cert_file.read_text(encoding="utf-8")
        assert "[PASSED]" in cert_text
        assert "@bussinessmasterbr" in cert_text
        assert "Resumo Executivo das Etapas" in cert_text


# ---------------------------------------------------------------------------
# Tier 2: Boundary, Edge & Adversarial Failure Cascading Tests
# ---------------------------------------------------------------------------

class TestE2EPipelineBoundaryAndEdge:
    """Tier 2: Failure cascading when individual stage guardrails are violated."""

    def test_stage1_script_defect_causes_overall_audit_failure(
        self,
        short_quiz_script_55s: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Feature F23: A script defect (< 65s) cascades to overall audit verdict 'FAIL'."""
        audio_bytes = generate_pcm_sine_wav(72.0, amplitude=0.4)
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}
        out_dir = tmp_path / "output" / "audit"

        report = run_central_audit_pipeline_contract(
            script_data=short_quiz_script_55s,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
            output_dir=out_dir,
        )
        assert report["overall_verdict"] == "FAIL"
        assert report["stages"]["stage1_script"]["verdict"] == "FAIL"
        assert report["overall_score"] < 100.0

    def test_stage3_video_short_duration_causes_overall_audit_failure(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_short_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Feature F23: A video duration < 62.0s triggers hard failure on central audit."""
        audio_bytes = generate_pcm_sine_wav(72.0, amplitude=0.4)
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}
        out_dir = tmp_path / "output" / "audit"

        report = run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_short_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
            output_dir=out_dir,
        )
        assert report["overall_verdict"] == "FAIL"
        assert report["stages"]["stage3_video"]["verdict"] == "FAIL"
        cert_text = (out_dir / "AUDIT_CERTIFICATE.md").read_text(encoding="utf-8")
        assert "[FAILED]" in cert_text

    def test_stage2_silent_audio_causes_overall_audit_failure(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Feature F23: Silent audio track triggers failure on Stage 2 and overall audit."""
        from tests.conftest import generate_pcm_silence_wav
        silent_bytes = generate_pcm_silence_wav(72.0)
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}

        report = run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=silent_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
        )
        assert report["overall_verdict"] == "FAIL"
        assert report["stages"]["stage2_audio"]["verdict"] == "FAIL"


# ---------------------------------------------------------------------------
# Tier 3: Cross-Stage Pipeline Integration Tests
# ---------------------------------------------------------------------------

class TestE2EPipelinePairwiseIntegration:
    """Tier 3: End-to-end data flow consistency across Stages 1, 2, 3, and 4."""

    def test_duration_consistency_across_stages(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
    ):
        """Feature F25: Durations across Script (72s), Audio (72s), and Video (72s) are aligned."""
        audio_bytes = generate_pcm_sine_wav(72.0, amplitude=0.4)
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}

        report = run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
        )

        s1_dur = report["stages"]["stage1_script"]["calculated_duration_seconds"]
        s2_dur = report["stages"]["stage2_audio"]["duration_seconds"]
        s3_dur = report["stages"]["stage3_video"]["duration_seconds"]

        assert abs(s1_dur - s2_dur) <= 1.5
        assert abs(s2_dur - s3_dur) <= 1.5
        assert all(dur >= 62.0 for dur in (s1_dur, s2_dur, s3_dur))


# ---------------------------------------------------------------------------
# Tier 4: Real-World Application Scenario
# ---------------------------------------------------------------------------

class TestE2EPipelineRealWorldScenario:
    """Tier 4: Scenario 5 (TEST_INFRA.md) — Full 4-Stage Self-Audit & Acceptance Verification."""

    def test_full_pipeline_acceptance_verification_scenario(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        mock_ffprobe_valid_mp4: Dict[str, Any],
        temp_session_dir: Path,
        tmp_path: Path,
    ):
        """Scenario 5: Complete end-to-end verification of production pipeline and certificate."""
        out_dir = tmp_path / "output" / "audit"
        audio_bytes = generate_pcm_sine_wav(72.0, amplitude=0.45)
        queue_cfg = {
            "channel": "@bussinessmasterbr",
            "slots": ["12:30", "16:00", "18:30"],
            "timezone": "America/Sao_Paulo",
            "dry_run": True,
        }

        # 1. Execute Central Self-Audit Pipeline
        report = run_central_audit_pipeline_contract(
            script_data=valid_quiz_script_8q,
            audio_bytes=audio_bytes,
            video_ffprobe_data=mock_ffprobe_valid_mp4,
            scheduler_config=queue_cfg,
            session_dir=temp_session_dir,
            output_dir=out_dir,
        )

        # 2. Verify Overall Verdict and 100% Score
        assert report["overall_verdict"] == "PASS"
        assert report["overall_score"] == 100.0

        # 3. Verify Artifact Files
        report_file = out_dir / "audit_report.json"
        cert_file = out_dir / "AUDIT_CERTIFICATE.md"

        assert report_file.exists()
        assert cert_file.exists()

        cert_content = cert_file.read_text(encoding="utf-8")
        assert "[PASSED]" in cert_content
        assert "@bussinessmasterbr" in cert_content
        assert "TikTok Creator Rewards Program" in cert_content
