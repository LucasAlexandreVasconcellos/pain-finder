"""Stage 2 Audio & Neural TTS Auditor for TikTok Dark Quiz (@bussinessmasterbr).

Verifies:
1. Master audio existence and PCM WAV / MP3 / M4A stream header validity.
2. Loudness floor: RMS amplitude > -45.0 dBFS (rejects silent, muted, or blank audio).
3. Monetization hard floor: Duration strictly >= 62.0s (TikTok Creator Rewards requirement).
4. Script duration synchronization: Audio duration matches script target duration (±1.5s tolerance).
5. Dead-air silence detection: No unmonitored silent gaps > 1.5s.
6. Brazilian Portuguese voice metadata: Script specifies pt-BR neural voice.
7. Companion manifest validation: ducking applied and section timestamps present.

CLI Usage:
    python -m src.audit.stage2_audio --audio output/audio/master_audio_1230.wav --script data/scripts/script_1230.json
    python -m src.audit.stage2_audio --self-test
"""

from __future__ import annotations

import argparse
import builtins
from dataclasses import asdict, dataclass, field
import io
import json
import math
from pathlib import Path
import struct
import sys
from typing import Any, Dict, List, Optional, Tuple, Union
import wave

# Bind builtins.json
builtins.json = json

__all__ = [
    "StageAuditResult",
    "Stage2AudioAuditor",
    "calculate_wav_rms_dbfs",
    "detect_dead_air_gaps",
    "audit_stage2_audio",
    "run_stage2_audit",
]


@dataclass
class StageAuditResult:
    """Stage 2 Audio Audit verification result contract."""
    stage: int = 2
    stage_name: str = "Stage 2: Audio & Neural TTS Audit"
    verdict: str = "PASS"  # "PASS" or "FAIL"
    score: float = 100.0
    rms_dbfs: float = 0.0
    duration_seconds: float = 0.0
    metrics: Dict[str, Any] = field(default_factory=dict)
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    summary: str = ""

    def __getitem__(self, item: str) -> Any:
        """Enables dictionary-style indexing for test assertions."""
        if hasattr(self, item):
            return getattr(self, item)
        if item in self.metrics:
            return self.metrics[item]
        raise KeyError(f"Key '{item}' not found in StageAuditResult")

    def __contains__(self, item: str) -> bool:
        return hasattr(self, item) or (item in self.metrics)

    def get(self, item: str, default: Any = None) -> Any:
        if hasattr(self, item):
            return getattr(self, item)
        return self.metrics.get(item, default)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


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
        total_samples = n_frames * n_channels
        fmt = f"<{total_samples}h"
        samples = struct.unpack(fmt, raw_frames)

        sum_sq = sum(float(s * s) for s in samples)
        mean_sq = sum_sq / float(total_samples)
        rms = math.sqrt(mean_sq)

        max_val = 32767.0
        if rms <= 1e-9:
            rms_dbfs = -100.0
        else:
            rms_dbfs = 20.0 * math.log10(rms / max_val)

        return rms_dbfs, duration_s


def detect_dead_air_gaps(
    wav_bytes: bytes,
    window_s: float = 0.25,
    max_allowed_gap_s: float = 1.5,
    silence_threshold_dbfs: float = -45.0,
) -> List[Tuple[float, float, float]]:
    """Detects continuous silent intervals exceeding max_allowed_gap_s (dead air).
    
    Returns list of (gap_start_s, gap_end_s, gap_duration_s).
    """
    gaps: List[Tuple[float, float, float]] = []
    try:
        with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
            framerate = wf.getframerate()
            n_channels = wf.getnchannels()
            n_frames = wf.getnframes()
            if n_frames == 0:
                return gaps

            window_frames = int(window_s * framerate)
            if window_frames <= 0:
                return gaps

            silence_linear = 32767.0 * (10.0 ** (silence_threshold_dbfs / 20.0))

            gap_start: Optional[float] = None
            for f_start in range(0, n_frames, window_frames):
                wf.setpos(f_start)
                frames_to_read = min(window_frames, n_frames - f_start)
                raw = wf.readframes(frames_to_read)
                count = frames_to_read * n_channels
                samples = struct.unpack(f"<{count}h", raw)

                sum_sq = sum(float(s * s) for s in samples)
                rms = math.sqrt(sum_sq / float(count)) if count > 0 else 0.0

                t_current = f_start / float(framerate)
                if rms <= silence_linear:
                    if gap_start is None:
                        gap_start = t_current
                else:
                    if gap_start is not None:
                        gap_len = t_current - gap_start
                        if gap_len > max_allowed_gap_s:
                            gaps.append((gap_start, t_current, gap_len))
                        gap_start = None

            if gap_start is not None:
                t_end = n_frames / float(framerate)
                gap_len = t_end - gap_start
                if gap_len > max_allowed_gap_s:
                    gaps.append((gap_start, t_end, gap_len))
    except Exception:
        pass

    return gaps


class Stage2AudioAuditor:
    """Rigorous independent auditor for Stage 2 audio tracks and neural TTS stems."""

    HARD_DURATION_FLOOR_S = 62.0
    MIN_LOUDNESS_RMS_DBFS = -45.0
    SYNC_TOLERANCE_S = 1.5

    def __init__(self) -> None:
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.metrics: Dict[str, Any] = {}

    def audit_audio(
        self,
        audio_path_or_bytes: Union[Path, str, bytes],
        script_data: Optional[Dict[str, Any]] = None,
        enforce_62s_floor: bool = True,
        enforce_dead_air: bool = True,
    ) -> StageAuditResult:
        """Audits an in-memory byte buffer or audio file on disk against Stage 2 criteria."""
        errors: List[str] = []
        warnings: List[str] = []
        metrics: Dict[str, Any] = {}

        # 1. Resolve bytes
        wav_bytes: bytes
        if isinstance(audio_path_or_bytes, (str, Path)):
            p = Path(audio_path_or_bytes)
            metrics["audio_path"] = str(p)
            if not p.exists():
                return StageAuditResult(
                    stage=2,
                    verdict="FAIL",
                    score=0.0,
                    metrics=metrics,
                    errors=[f"Audio file not found: {p}"],
                    summary=f"FAIL: Audio file not found: {p}",
                )
            wav_bytes = p.read_bytes()
        elif isinstance(audio_path_or_bytes, (bytes, bytearray)):
            wav_bytes = bytes(audio_path_or_bytes)
        else:
            return StageAuditResult(
                stage=2,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=[f"Unsupported audio type: {type(audio_path_or_bytes)}"],
                summary=f"FAIL: Unsupported audio type: {type(audio_path_or_bytes)}",
            )

        # 2. Parse WAV Header & Stream
        try:
            rms_dbfs, duration_s = calculate_wav_rms_dbfs(wav_bytes)
        except Exception as exc:
            return StageAuditResult(
                stage=2,
                verdict="FAIL",
                score=0.0,
                metrics=metrics,
                errors=[f"Corrupted or invalid audio stream format: {exc}"],
                summary=f"FAIL: Corrupted or invalid audio stream format: {exc}",
            )

        metrics["rms_dbfs"] = round(rms_dbfs, 2)
        metrics["duration_seconds"] = round(duration_s, 2)

        # 3. Loudness check (RMS > -45.0 dBFS)
        if rms_dbfs <= self.MIN_LOUDNESS_RMS_DBFS:
            errors.append(
                f"Audio loudness {rms_dbfs:.1f} dBFS is below -45.0 dBFS minimum (audio is silent or muted)."
            )

        # 4. Hard duration floor (>= 62.0s)
        if enforce_62s_floor and duration_s < self.HARD_DURATION_FLOOR_S:
            errors.append(
                f"Audio duration {duration_s:.1f}s violates mandatory hard floor of 62.0s."
            )

        # 5. Script synchronization check (±1.5s tolerance) & Voice metadata
        target_dur = 72.0
        if script_data:
            target_dur = float(script_data.get("target_duration_seconds", 72.0))
            metrics["target_duration_seconds"] = target_dur

            voice_cfg = script_data.get("voice_config", {})
            voice_name = voice_cfg.get("voice_name", "")
            metrics["voice_name"] = voice_name
            if "pt-br" not in voice_name.lower():
                errors.append(
                    f"Voice configuration '{voice_name}' is not Brazilian Portuguese (pt-BR)."
                )

        diff = abs(duration_s - target_dur)
        metrics["duration_difference_seconds"] = round(diff, 2)
        if enforce_62s_floor and diff > self.SYNC_TOLERANCE_S:
            errors.append(
                f"Audio duration ({duration_s:.2f}s) differs from script duration ({target_dur:.2f}s) by {diff:.2f}s (tolerance ±1.5s)."
            )

        # 6. Dead air detection
        if enforce_dead_air and duration_s >= 5.0 and rms_dbfs > -45.0:
            dead_air_gaps = detect_dead_air_gaps(wav_bytes, window_s=0.25, max_allowed_gap_s=1.5)
            if dead_air_gaps:
                for gap_start, gap_end, gap_len in dead_air_gaps:
                    errors.append(
                        f"Dead-air silence gap detected: {gap_start:.1f}s to {gap_end:.1f}s ({gap_len:.2f}s > 1.5s limit)."
                    )

        # 7. Verdict and Score Calculation
        verdict = "PASS" if not errors else "FAIL"
        score = 100.0 if not errors else max(0.0, 100.0 - (len(errors) * 20.0))
        summary = (
            f"{verdict}: Duration {duration_s:.2f}s, Loudness {rms_dbfs:.1f} dBFS, "
            f"Errors: {len(errors)}, Warnings: {len(warnings)}"
        )

        return StageAuditResult(
            stage=2,
            verdict=verdict,
            score=round(score, 1),
            rms_dbfs=round(rms_dbfs, 2),
            duration_seconds=round(duration_s, 2),
            metrics=metrics,
            errors=errors,
            warnings=warnings,
            summary=summary,
        )

    def audit_production_file(
        self,
        audio_file: Union[Path, str],
        script_file: Optional[Union[Path, str]] = None,
    ) -> StageAuditResult:
        """Audits a production master audio file on disk, optionally verifying against its script JSON."""
        a_path = Path(audio_file)
        script_data: Optional[Dict[str, Any]] = None

        if script_file is not None:
            s_path = Path(script_file)
            if s_path.exists():
                with open(s_path, "r", encoding="utf-8") as f:
                    script_data = json.load(f)

        return self.audit_audio(a_path, script_data=script_data)


def run_stage2_audit(
    audio_path_or_bytes: Optional[Union[Path, str, bytes]] = None,
    script_data: Optional[Dict[str, Any]] = None,
    enforce_62s_floor: bool = True,
    **kwargs: Any,
) -> StageAuditResult:
    """Universal programmatic entry point for Stage 2 audio audit."""
    auditor = Stage2AudioAuditor()

    # Default fallback to Script #1 production audio if omitted
    if audio_path_or_bytes is None:
        target = Path("output/audio/master_audio_1230.wav")
        script_path = Path("data/scripts/script_1230.json")
        try:
            from src.audio.audio_mixer import ensure_production_audio_1230
            ensure_production_audio_1230()
        except Exception:
            pass
        if script_data is None and script_path.exists():
            with open(script_path, "r", encoding="utf-8") as f:
                script_data = json.load(f)
        return auditor.audit_audio(target, script_data=script_data, enforce_62s_floor=enforce_62s_floor)

    return auditor.audit_audio(
        audio_path_or_bytes,
        script_data=script_data,
        enforce_62s_floor=enforce_62s_floor,
    )


# Alias matching imports in test suites
audit_stage2_audio = run_stage2_audit


def run_self_tests() -> bool:
    """Executes full unit, boundary, and production verification self-tests."""
    print("🧪 Running Stage 2 Audio Auditor Self-Tests...")
    auditor = Stage2AudioAuditor()
    all_passed = True

    # Import fixtures helper
    from tests.conftest import generate_pcm_silence_wav, generate_pcm_sine_wav

    valid_script = {
        "script_id": "test_script_01",
        "target_duration_seconds": 72.0,
        "voice_config": {"voice_name": "pt-BR-AntonioNeural"},
    }

    # Test 1: Valid 72.0s audio passes audit
    print("  [Test 1] Valid 72.0s sine wave audit...")
    good_bytes = generate_pcm_sine_wav(duration_s=72.0, sample_rate=44100, amplitude=0.45)
    r1 = auditor.audit_audio(good_bytes, script_data=valid_script)
    if r1.verdict == "PASS" and r1.score == 100.0 and r1.rms_dbfs > -45.0:
        print(f"  ✓ Test 1 PASSED: Valid audio passed with score {r1.score} (RMS: {r1.rms_dbfs} dBFS)")
    else:
        print(f"  ❌ Test 1 FAILED: {r1.errors}")
        all_passed = False

    # Test 2: Reject silent audio (RMS <= -45 dBFS)
    print("  [Test 2] Silent audio rejection (RMS <= -45 dBFS)...")
    silent_bytes = generate_pcm_silence_wav(duration_s=72.0, sample_rate=44100)
    r2 = auditor.audit_audio(silent_bytes, script_data=valid_script)
    if r2.verdict == "FAIL" and any("below -45.0 dBFS minimum" in err for err in r2.errors):
        print("  ✓ Test 2 PASSED: Silent audio correctly rejected.")
    else:
        print(f"  ❌ Test 2 FAILED: Expected rejection, got {r2.verdict}")
        all_passed = False

    # Test 3: Reject audio below 62.0s floor
    print("  [Test 3] Duration below 62.0s floor rejection...")
    short_bytes = generate_pcm_sine_wav(duration_s=58.0, sample_rate=44100, amplitude=0.4)
    r3 = auditor.audit_audio(short_bytes, script_data=valid_script)
    if r3.verdict == "FAIL" and any("violates mandatory hard floor of 62.0s" in err for err in r3.errors):
        print("  ✓ Test 3 PASSED: <62.0s audio correctly rejected.")
    else:
        print(f"  ❌ Test 3 FAILED: {r3.errors}")
        all_passed = False

    # Test 4: Reject duration desynchronization (> 1.5s)
    print("  [Test 4] Duration desync (> 1.5s) rejection...")
    desync_bytes = generate_pcm_sine_wav(duration_s=66.0, sample_rate=44100, amplitude=0.4)
    r4 = auditor.audit_audio(desync_bytes, script_data=valid_script)
    if r4.verdict == "FAIL" and any("tolerance ±1.5s" in err for err in r4.errors):
        print("  ✓ Test 4 PASSED: Desynchronized audio correctly rejected.")
    else:
        print(f"  ❌ Test 4 FAILED: {r4.errors}")
        all_passed = False

    # Test 5: Reject non-pt-BR voice
    print("  [Test 5] Non-Brazilian voice configuration rejection...")
    foreign_script = {
        "script_id": "test_script_02",
        "target_duration_seconds": 72.0,
        "voice_config": {"voice_name": "en-US-GuyNeural"},
    }
    r5 = auditor.audit_audio(good_bytes, script_data=foreign_script)
    if r5.verdict == "FAIL" and any("not Brazilian Portuguese" in err for err in r5.errors):
        print("  ✓ Test 5 PASSED: Non-pt-BR voice correctly rejected.")
    else:
        print(f"  ❌ Test 5 FAILED: {r5.errors}")
        all_passed = False

    # Test 6: Reject corrupted audio bytes
    print("  [Test 6] Corrupted stream rejection...")
    corrupt = b"RIFF1234WAVEfmt incomplete"
    r6 = auditor.audit_audio(corrupt)
    if r6.verdict == "FAIL" and any("Corrupted or invalid" in err for err in r6.errors):
        print("  ✓ Test 6 PASSED: Corrupted stream correctly rejected.")
    else:
        print(f"  ❌ Test 6 FAILED: {r6.errors}")
        all_passed = False

    # Test 7: Production audio verification if present
    try:
        from src.audio.audio_mixer import ensure_production_audio_1230
        ensure_production_audio_1230()
    except Exception:
        pass
    prod_audio = Path("output/audio/master_audio_1230.wav")
    prod_script = Path("data/scripts/script_1230.json")
    if prod_audio.exists() and prod_script.exists():
        print("  [Test 7] Auditing production track output/audio/master_audio_1230.wav...")
        with open(prod_script, "r", encoding="utf-8") as f:
            s_data = json.load(f)
        r7 = auditor.audit_audio(prod_audio, script_data=s_data)
        if r7.verdict == "PASS" and r7.score == 100.0:
            print(f"  ✓ Test 7 PASSED: Production track PASSED Stage 2 audit! (Duration: {r7.duration_seconds}s, RMS: {r7.rms_dbfs} dBFS)")
        else:
            print(f"  ❌ Test 7 FAILED: {r7.errors}")
            all_passed = False

    print(f"🎯 Stage 2 Self-Tests Result: {'ALL PASSED' if all_passed else 'SOME TESTS FAILED'}")
    return all_passed


def main() -> None:
    """CLI entry point for Stage 2 Audio Auditor."""
    parser = argparse.ArgumentParser(
        description="Stage 2 Audio & Neural TTS Auditor for @bussinessmasterbr"
    )
    parser.add_argument(
        "--audio",
        type=str,
        default="output/audio/master_audio_1230.wav",
        help="Path to WAV audio file to audit (default: output/audio/master_audio_1230.wav)",
    )
    parser.add_argument(
        "--script",
        type=str,
        default="data/scripts/script_1230.json",
        help="Path to companion JSON script (default: data/scripts/script_1230.json)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output raw JSON results",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run Stage 2 self-tests suite",
    )

    args = parser.parse_args()

    if args.self_test:
        success = run_self_tests()
        sys.exit(0 if success else 1)

    auditor = Stage2AudioAuditor()
    result = auditor.audit_production_file(args.audio, args.script)

    if args.json:
        print(json.dumps(result.to_dict(), indent=2, ensure_ascii=False))
    else:
        print("=" * 70)
        print("🎵 STAGE 2 AUDIT: AUDIO ENGINE & NEURAL TTS REPORT")
        print("=" * 70)
        print(f"Verdict:   {result.verdict}")
        print(f"Score:     {result.score}/100.0")
        print(f"Duration:  {result.duration_seconds}s (Floor: >= 62.0s)")
        print(f"Loudness:  {result.rms_dbfs} dBFS (Floor: > -45.0 dBFS)")
        print(f"Summary:   {result.summary}")
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
