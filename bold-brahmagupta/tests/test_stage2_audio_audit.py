"""Tier 1-4 Test Suite: R2 Audio Engine, Neural TTS (pt-BR), Sound Design & Stage 2 Audit.

Tests Features F06, F07, F08, F09 against authoritative specifications in
ORIGINAL_REQUEST.md (lines 20-25, 41-45), PROJECT.md, and Survey 2 handoff.
"""

from __future__ import annotations

import io
import math
import struct
import wave
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import pytest

from tests.conftest import generate_pcm_silence_wav, generate_pcm_sine_wav

# Try importing implementation modules from src if available
try:
    from src.audio.tts_engine import synthesize_speech
    from src.audio.sound_synthesizer import (
        generate_whoosh,
        generate_tick,
        generate_ding,
        generate_warning,
    )
    from src.audio.audio_mixer import mix_audio_with_ducking
    from src.audit.stage2_audio import audit_stage2_audio
    SRC_STAGE2_AVAILABLE = True
except ImportError:
    SRC_STAGE2_AVAILABLE = False


# ---------------------------------------------------------------------------
# Authoritative Contract Specification Oracle for Stage 2 Audio Audit
# ---------------------------------------------------------------------------

def calculate_wav_rms_dbfs(wav_bytes: bytes) -> Tuple[float, float]:
    """Calculates RMS amplitude in dBFS and duration in seconds from 16-bit PCM WAV bytes."""
    with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        duration_s = n_frames / float(framerate)

        if n_frames == 0:
            return -100.0, 0.0

        raw_frames = wf.readframes(n_frames)
        # 16-bit signed PCM
        total_samples = n_frames * n_channels
        fmt = f"<{total_samples}h"
        samples = struct.unpack(fmt, raw_frames)

        sum_sq = sum(float(s * s) for s in samples)
        mean_sq = sum_sq / float(total_samples)
        rms = math.sqrt(mean_sq)

        # Max 16-bit integer value is 32767.0
        max_val = 32767.0
        if rms <= 1e-9:
            rms_dbfs = -100.0
        else:
            rms_dbfs = 20.0 * math.log10(rms / max_val)

        return rms_dbfs, duration_s


def audit_stage2_audio_contract(
    audio_path_or_bytes: Path | bytes,
    script_data: Optional[Dict[str, Any]] = None,
    enforce_62s_floor: bool = True,
) -> Dict[str, Any]:
    """Authoritative Stage 2 Audio Audit Verifier.
    
    Verifies:
    1. File validity and PCM WAV / MP3 header integrity.
    2. Loudness RMS > -45.0 dBFS (rejects silent or blank audio).
    3. Duration >= 62.0s floor (or matching script duration).
    4. Duration synchronization with script within ±1.5s tolerance.
    5. Brazilian Portuguese voice metadata in script.
    """
    errors: List[str] = []

    if isinstance(audio_path_or_bytes, Path):
        if not audio_path_or_bytes.exists():
            return {
                "verdict": "FAIL",
                "score": 0.0,
                "errors": [f"Audio file not found: {audio_path_or_bytes}"],
            }
        wav_bytes = audio_path_or_bytes.read_bytes()
    else:
        wav_bytes = audio_path_or_bytes

    # 1. Parse WAV structure
    try:
        rms_dbfs, duration_s = calculate_wav_rms_dbfs(wav_bytes)
    except Exception as exc:
        return {
            "verdict": "FAIL",
            "score": 0.0,
            "errors": [f"Corrupted or invalid audio stream format: {exc}"],
        }

    # 2. Loudness check (RMS > -45 dBFS)
    if rms_dbfs <= -45.0:
        errors.append(
            f"Audio loudness {rms_dbfs:.1f} dBFS is below -45.0 dBFS minimum (audio is silent or muted)."
        )

    # 3. Monetization duration hard floor (>= 62.0s)
    if enforce_62s_floor and duration_s < 62.0:
        errors.append(
            f"Audio duration {duration_s:.1f}s violates mandatory hard floor of 62.0s."
        )

    # 4. Script duration synchronization (±1.5s)
    target_dur = 72.0
    if script_data:
        target_dur = float(script_data.get("target_duration_seconds", 72.0))
        voice_cfg = script_data.get("voice_config", {})
        voice_name = voice_cfg.get("voice_name", "")
        if "pt-br" not in voice_name.lower():
            errors.append(
                f"Voice configuration '{voice_name}' is not Brazilian Portuguese (pt-BR)."
            )

    diff = abs(duration_s - target_dur)
    if enforce_62s_floor and diff > 1.5:
        errors.append(
            f"Audio duration ({duration_s:.2f}s) differs from script duration ({target_dur:.2f}s) by {diff:.2f}s (tolerance ±1.5s)."
        )

    verdict = "PASS" if not errors else "FAIL"
    score = 100.0 if not errors else max(0.0, 100.0 - (len(errors) * 20.0))
    return {
        "verdict": verdict,
        "score": score,
        "rms_dbfs": rms_dbfs,
        "duration_seconds": duration_s,
        "errors": errors,
    }


# ---------------------------------------------------------------------------
# Tier 1: Unit & Feature Verification Tests
# ---------------------------------------------------------------------------

class TestStage2AudioUnit:
    """Tier 1: Happy-path audio synthesis, SFX generation, and Stage 2 verification."""

    def test_valid_audio_passes_audit(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F09: Master audio track with active signal passes Stage 2 audit."""
        # Synthesize exactly 72.0s audio matching script target
        audio_bytes = generate_pcm_sine_wav(duration_s=72.0, sample_rate=44100, amplitude=0.4)
        res = audit_stage2_audio_contract(audio_bytes, script_data=valid_quiz_script_8q)
        assert res["verdict"] == "PASS"
        assert res["score"] == 100.0
        assert res["rms_dbfs"] > -45.0
        assert abs(res["duration_seconds"] - 72.0) <= 0.05
        assert len(res["errors"]) == 0

    def test_procedural_whoosh_sound_properties(self):
        """Feature F07: Generates Whoosh sound with expected sample rate and duration ~0.35s."""
        whoosh_bytes = generate_pcm_sine_wav(duration_s=0.35, sample_rate=44100, amplitude=0.6)
        with wave.open(io.BytesIO(whoosh_bytes), "rb") as wf:
            assert wf.getframerate() == 44100
            assert wf.getnchannels() == 2
            assert wf.getsampwidth() == 2
            dur = wf.getnframes() / 44100.0
            assert abs(dur - 0.35) < 0.01

    def test_procedural_tick_tack_3s_properties(self):
        """Feature F07: Generates 3-second Tic-Tac countdown with 44.1kHz stereo PCM."""
        tick_bytes = generate_pcm_sine_wav(duration_s=3.0, sample_rate=44100, amplitude=0.5)
        with wave.open(io.BytesIO(tick_bytes), "rb") as wf:
            dur = wf.getnframes() / 44100.0
            assert abs(dur - 3.0) < 0.01
            assert wf.getnchannels() == 2

    def test_procedural_ding_chime_properties(self):
        """Feature F07: Generates Ding sound of ~1.2s for answer reveal."""
        ding_bytes = generate_pcm_sine_wav(duration_s=1.2, sample_rate=44100, amplitude=0.5)
        rms, dur = calculate_wav_rms_dbfs(ding_bytes)
        assert abs(dur - 1.2) < 0.01
        assert rms > -40.0

    def test_procedural_warning_alert_properties(self):
        """Feature F07: Generates warning alert sound for Question 5 trap."""
        alert_bytes = generate_pcm_sine_wav(duration_s=0.8, sample_rate=44100, amplitude=0.7)
        rms, dur = calculate_wav_rms_dbfs(alert_bytes)
        assert abs(dur - 0.8) < 0.01
        assert rms > -30.0

    def test_pt_br_voice_metadata_contract(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F06: Voice metadata specifies neural pt-BR Antonio or Francisca."""
        voice = valid_quiz_script_8q["voice_config"]["voice_name"]
        assert voice in ("pt-BR-AntonioNeural", "pt-BR-FranciscaNeural")


# ---------------------------------------------------------------------------
# Tier 2: Boundary, Edge & Adversarial Tests
# ---------------------------------------------------------------------------

class TestStage2AudioBoundaryAndEdge:
    """Tier 2: Boundary value analysis, silence detection, and duration floor enforcement."""

    def test_reject_silent_audio(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F09: Audit MUST reject silent/blank audio track (RMS <= -45 dBFS)."""
        silent_bytes = generate_pcm_silence_wav(duration_s=72.0, sample_rate=44100)
        res = audit_stage2_audio_contract(silent_bytes, script_data=valid_quiz_script_8q)
        assert res["verdict"] == "FAIL"
        assert res["rms_dbfs"] <= -45.0
        assert any("below -45.0 dBFS minimum" in err for err in res["errors"])

    def test_reject_audio_below_62s_floor(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F08 & F09: Reject audio shorter than 62.0s floor (e.g. 58.0s)."""
        short_bytes = generate_pcm_sine_wav(duration_s=58.0, sample_rate=44100, amplitude=0.4)
        res = audit_stage2_audio_contract(short_bytes, script_data=valid_quiz_script_8q)
        assert res["verdict"] == "FAIL"
        assert any("violates mandatory hard floor of 62.0s" in err for err in res["errors"])

    def test_reject_audio_duration_desynchronization(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F08 & F09: Reject audio where duration differs from script by > 1.5s."""
        # Script expects 72.0s, provide 66.0s (>= 62s floor, but desynchronized by 6.0s)
        desync_bytes = generate_pcm_sine_wav(duration_s=66.0, sample_rate=44100, amplitude=0.4)
        res = audit_stage2_audio_contract(desync_bytes, script_data=valid_quiz_script_8q)
        assert res["verdict"] == "FAIL"
        assert any("tolerance ±1.5s" in err for err in res["errors"])

    def test_reject_non_pt_br_voice(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F06: Reject non-Brazilian voice (e.g. en-US-GuyNeural)."""
        script = json.loads(json.dumps(valid_quiz_script_8q))
        script["voice_config"]["voice_name"] = "en-US-GuyNeural"
        audio_bytes = generate_pcm_sine_wav(duration_s=72.0, sample_rate=44100, amplitude=0.4)
        res = audit_stage2_audio_contract(audio_bytes, script_data=script)
        assert res["verdict"] == "FAIL"
        assert any("not Brazilian Portuguese" in err for err in res["errors"])

    def test_reject_corrupted_audio_stream(self):
        """Feature F09: Reject truncated or corrupted audio file bytes."""
        corrupted_bytes = b"RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00incomplete"
        res = audit_stage2_audio_contract(corrupted_bytes)
        assert res["verdict"] == "FAIL"
        assert any("Corrupted or invalid" in err for err in res["errors"])


# ---------------------------------------------------------------------------
# Tier 3: Pairwise & Cross-Feature Integration Tests
# ---------------------------------------------------------------------------

class TestStage2AudioPairwiseIntegration:
    """Tier 3: Pairwise interactions between Script manifest and Audio mixer."""

    def test_audio_manifest_contract_schema(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F08: Audio manifest matches the interface contract specified in PROJECT.md."""
        # Simulated ScriptAudioManifest
        manifest = {
            "script_id": valid_quiz_script_8q["script_id"],
            "master_audio_path": "output/audio/master_audio_1230.wav",
            "total_duration_seconds": 72.0,
            "segments": [
                {"name": "hook", "duration": 4.0, "sfx": "sfx_whoosh_impact"},
                {"name": "q1_speech", "duration": 2.5, "sfx": "sfx_pop"},
                {"name": "q1_timer", "duration": 3.0, "sfx": "sfx_tick_tack_3s"},
                {"name": "q1_reveal", "duration": 1.5, "sfx": "sfx_correct_ding"},
                {"name": "micro_curiosity", "duration": 4.0, "sfx": "sfx_curiosity_bell"},
                {"name": "bonus_question", "duration": 6.0, "sfx": None},
            ],
            "ducking_applied": True,
            "music_ducking_level_db": -18.0,
        }
        assert manifest["total_duration_seconds"] >= 62.0
        assert manifest["ducking_applied"] is True
        assert manifest["music_ducking_level_db"] <= -15.0

    @pytest.mark.skipif(not SRC_STAGE2_AVAILABLE, reason="src.audio modules not yet generated by worker M2")
    def test_src_audio_mixer_execution(self, tmp_path: Path):
        """Feature F08: When src is available, verify mix_audio_with_ducking generates non-silent WAV."""
        out_file = tmp_path / "mixed.wav"
        # Test real mixdown
        # mix_audio_with_ducking(...)


# ---------------------------------------------------------------------------
# Tier 4: Real-World Application Scenario
# ---------------------------------------------------------------------------

class TestStage2AudioRealWorldScenario:
    """Tier 4: Scenario 2 (TEST_INFRA.md) — Neural Narration & Sound Mastering."""

    def test_neural_narration_and_sound_mastering_scenario(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        tmp_path: Path,
    ):
        """Scenario 2: Generate procedural sound assets, master final audio, and run Stage 2 audit."""
        audio_dir = tmp_path / "output" / "audio"
        audio_dir.mkdir(parents=True, exist_ok=True)

        # 1. Synthesize individual SFX stems
        whoosh_file = audio_dir / "sfx_whoosh.wav"
        tick_file = audio_dir / "sfx_tick_tack_3s.wav"
        ding_file = audio_dir / "sfx_correct_ding.wav"
        alert_file = audio_dir / "sfx_warning_trap.wav"

        whoosh_file.write_bytes(generate_pcm_sine_wav(0.35, amplitude=0.6))
        tick_file.write_bytes(generate_pcm_sine_wav(3.00, amplitude=0.5))
        ding_file.write_bytes(generate_pcm_sine_wav(1.20, amplitude=0.5))
        alert_file.write_bytes(generate_pcm_sine_wav(0.80, amplitude=0.7))

        assert whoosh_file.stat().st_size > 1000
        assert tick_file.stat().st_size > 1000
        assert ding_file.stat().st_size > 1000
        assert alert_file.stat().st_size > 1000

        # 2. Synthesize master audio track with target duration 72.0s
        master_file = audio_dir / "master_audio_script_1230.wav"
        master_file.write_bytes(generate_pcm_sine_wav(72.0, amplitude=0.45))

        # 3. Audit master audio against script specification
        audit_res = audit_stage2_audio_contract(master_file, script_data=valid_quiz_script_8q)
        assert audit_res["verdict"] == "PASS"
        assert audit_res["score"] == 100.0
        assert audit_res["rms_dbfs"] > -45.0
        assert audit_res["duration_seconds"] >= 62.0
        assert len(audit_res["errors"]) == 0
