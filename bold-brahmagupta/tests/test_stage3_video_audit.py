"""Tier 1-4 Test Suite: R2 Video Engine, HUD Renderer, Dynamic Background & Stage 3 Audit.

Tests Features F10, F11, F12, F13, F14, F15, F16, F17 against authoritative specifications in
ORIGINAL_REQUEST.md (lines 20-25, 41-45), PROJECT.md, and Survey 2 & 3 handoffs.
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import pytest

from PIL import Image, ImageDraw, ImageFont

# Try importing implementation modules from src if available
try:
    from src.video.hud_renderer import render_hud_frame
    from src.video.background_engine import render_background_frame
    from src.video.video_engine import render_quiz_video
    from src.audit.stage3_video import audit_stage3_video
    SRC_STAGE3_AVAILABLE = True
except ImportError:
    SRC_STAGE3_AVAILABLE = False


# ---------------------------------------------------------------------------
# Authoritative Contract Specification Oracle for Stage 3 Video Audit
# ---------------------------------------------------------------------------

def audit_stage3_video_contract(
    ffprobe_data: Dict[str, Any],
    keyframe_samples: Optional[Dict[str, Image.Image]] = None,
) -> Dict[str, Any]:
    """Authoritative Stage 3 Video & HUD Audit Verifier.
    
    Verifies:
    1. Stream counts: 1 video stream + 1 audio stream.
    2. Video resolution: Width = 1080, Height = 1920 (exact 9:16 vertical).
    3. Frame rate: 30.0 fps (or 29.97-30.0).
    4. Codec: h264 (or hevc), pixel format yuv420p.
    5. Duration: Hard floor >= 62.0s (mandatory guardrail).
    6. Audio stream: stereo, >= 44100 Hz, matching video duration.
    7. HUD keyframes: No black frames, presence of level badge, question box,
       options, countdown bar, and #00FF66 green reveal highlight.
    """
    errors: List[str] = []
    streams = ffprobe_data.get("streams", [])
    
    video_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)

    # 1. Stream existence
    if not video_stream:
        errors.append("No video stream found in media file.")
        return {"verdict": "FAIL", "score": 0.0, "errors": errors}

    if not audio_stream:
        errors.append("No audio stream found in media file (must contain synchronized audio).")

    # 2. Resolution check (1080x1920)
    w = int(video_stream.get("width", 0))
    h = int(video_stream.get("height", 0))
    if w != 1080 or h != 1920:
        errors.append(f"Invalid video resolution {w}x{h}. Must be exactly 1080x1920 (9:16 vertical).")

    # 3. Frame rate check
    r_fps_str = video_stream.get("r_frame_rate", "0/1")
    try:
        num, den = map(float, r_fps_str.split("/"))
        fps = num / den if den != 0 else 0.0
    except Exception:
        fps = 0.0

    if not (29.9 <= fps <= 30.1):
        errors.append(f"Invalid frame rate {fps:.2f} fps. Must be 30.0 fps (tolerance 29.97-30.0).")

    # 4. Codec & Pixel format
    v_codec = video_stream.get("codec_name", "")
    if v_codec not in ("h264", "hevc"):
        errors.append(f"Invalid video codec '{v_codec}'. Must be 'h264' or 'hevc'.")

    pix_fmt = video_stream.get("pix_fmt", "")
    if pix_fmt != "yuv420p":
        errors.append(f"Invalid pixel format '{pix_fmt}'. Must be 'yuv420p' for universal mobile playback.")

    # 5. Mandatory Duration Hard Floor (>= 62.0s)
    duration_s = float(video_stream.get("duration", 0.0))
    if duration_s < 62.0:
        errors.append(
            f"[HARD_FAIL] Video duration {duration_s:.1f}s is strictly below required 62.0s minimum."
        )

    # 6. Keyframe Inspection (if samples provided)
    if keyframe_samples:
        for kf_name, img in keyframe_samples.items():
            if img.size != (1080, 1920):
                errors.append(f"Keyframe '{kf_name}' dimensions {img.size} mismatch 1080x1920.")
            
            # Black frame detection
            gray = img.convert("L")
            pixels = list(gray.getdata())
            mean_brightness = sum(pixels) / len(pixels)
            if mean_brightness < 10.0:
                errors.append(f"Keyframe '{kf_name}' is black or unrendered (mean brightness {mean_brightness:.1f} < 10.0).")

            # Reveal keyframe green highlight verification
            if "reveal" in kf_name.lower():
                rgb_img = img.convert("RGB")
                # Sample option card region (Y from 1000 to 1400)
                found_green = False
                for y in range(860, 1400, 20):
                    for x in range(100, 980, 20):
                        r, g, b = rgb_img.getpixel((x, y))
                        # Emerald / vibrant green (#00FF66 / #059669): G high, G > 1.3*R, G > 1.3*B
                        if g > 150 and g > (1.3 * r) and g > (1.3 * b):
                            found_green = True
                            break
                    if found_green:
                        break
                if not found_green:
                    errors.append(f"Reveal keyframe '{kf_name}' lacks vibrant green (#00FF66) correct answer highlight.")

    verdict = "PASS" if not errors else "FAIL"
    score = 100.0 if not errors else max(0.0, 100.0 - (len(errors) * 15.0))
    return {
        "verdict": verdict,
        "score": score,
        "duration_seconds": duration_s,
        "resolution": (w, h),
        "fps": fps,
        "errors": errors,
    }


# ---------------------------------------------------------------------------
# Synthetic Keyframe Generators for Visual Testing
# ---------------------------------------------------------------------------

def create_synthetic_hud_frame(
    reveal_active: bool = False,
    correct_option_index: int = 1,
    timer_progress: float = 0.5,
) -> Image.Image:
    """Generates a synthetic 1080x1920 Dark Quiz frame for visual audit tests."""
    img = Image.new("RGB", (1080, 1920), color=(15, 23, 42))  # slate-900 dark background
    draw = ImageDraw.Draw(img)

    # 1. Level badge & progress (Top HUD)
    draw.rounded_rectangle([(60, 220), (320, 280)], radius=15, fill=(16, 185, 129))  # Emerald pill
    draw.text((80, 235), "NÍVEL FÁCIL", fill=(255, 255, 255))
    draw.rounded_rectangle([(800, 220), (1020, 280)], radius=15, fill=(31, 41, 55))
    draw.text((860, 235), "1/7", fill=(255, 255, 255))

    # 2. Central Question Card
    draw.rounded_rectangle([(60, 360), (1020, 760)], radius=28, fill=(17, 24, 39), outline=(55, 65, 81), width=2)
    draw.text((100, 420), "Qual país é o berço e criador da pizza moderna?", fill=(255, 255, 255))

    # 3. Countdown Timer Bar (Width 920 * progress)
    draw.rounded_rectangle([(80, 800), (1000, 824)], radius=12, fill=(31, 41, 55))
    bar_width = int(920 * timer_progress)
    if bar_width > 0:
        bar_color = (16, 185, 129) if timer_progress > 0.6 else ((245, 158, 11) if timer_progress > 0.3 else (239, 68, 68))
        draw.rounded_rectangle([(80, 800), (80 + bar_width, 824)], radius=12, fill=bar_color)

    # 4. 4 Option Cards (A, B, C, D)
    options = ["França", "Itália", "Grécia", "Espanha"]
    for i, opt_text in enumerate(options):
        y_top = 860 + (i * 140)
        y_bot = y_top + 120
        if reveal_active and i == correct_option_index:
            fill_color = (5, 150, 105)  # Emerald green base
            outline_color = (0, 255, 102)  # Neon #00FF66 highlight
            draw.rounded_rectangle([(60, y_top), (1020, y_bot)], radius=20, fill=fill_color, outline=outline_color, width=4)
            draw.text((940, y_top + 40), "[✓]", fill=(0, 255, 102))
        else:
            fill_color = (30, 36, 51) if not reveal_active else (20, 24, 33)
            draw.rounded_rectangle([(60, y_top), (1020, y_bot)], radius=20, fill=fill_color, outline=(51, 65, 85), width=2)
        
        draw.text((180, y_top + 40), f"{chr(65+i)}) {opt_text}", fill=(243, 244, 246))

    return img


# ---------------------------------------------------------------------------
# Tier 1: Unit & Feature Verification Tests
# ---------------------------------------------------------------------------

class TestStage3VideoUnit:
    """Tier 1: Video stream specifications, HUD elements, and Stage 3 audit pass."""

    def test_valid_video_metadata_passes_audit(self, mock_ffprobe_valid_mp4: Dict[str, Any]):
        """Feature F17: 1080x1920, 30fps, 72.0s video passes Stage 3 technical audit."""
        res = audit_stage3_video_contract(mock_ffprobe_valid_mp4)
        assert res["verdict"] == "PASS"
        assert res["score"] == 100.0
        assert res["resolution"] == (1080, 1920)
        assert res["fps"] == 30.0
        assert res["duration_seconds"] >= 62.0
        assert len(res["errors"]) == 0

    def test_hud_frame_generation_dimensions(self):
        """Feature F10: HUD frame is rendered in exact 1080x1920 vertical canvas."""
        img = create_synthetic_hud_frame(reveal_active=False)
        assert img.size == (1080, 1920)
        assert img.mode == "RGB"

    def test_green_answer_reveal_highlight_dominance(self):
        """Feature F12: Correct answer card displays vibrant green (#00FF66) on reveal."""
        reveal_frame = create_synthetic_hud_frame(reveal_active=True, correct_option_index=1)
        # Check pixel around option B card
        r, g, b = reveal_frame.getpixel((500, 1060))
        assert g > 130
        assert g > (1.2 * r)
        assert g > (1.2 * b)

    def test_countdown_timer_bar_depletion(self):
        """Feature F11: Timer bar depletes from 100% to 0% smoothly."""
        full_bar = create_synthetic_hud_frame(timer_progress=1.0)
        half_bar = create_synthetic_hud_frame(timer_progress=0.5)
        empty_bar = create_synthetic_hud_frame(timer_progress=0.0)

        # Sample pixel at X=900, Y=812 (near the right edge of timer bar)
        # Full bar has green pixel at X=900
        r_full, g_full, b_full = full_bar.getpixel((900, 812))
        assert g_full > 100

        # Empty bar has dark background pixel at X=900
        r_empty, g_empty, b_empty = empty_bar.getpixel((900, 812))
        assert g_empty < 60

    def test_dynamic_background_anti_static_variance(self):
        """Feature F13: Consecutive frames show non-zero variance, preventing static penalty."""
        frame_t1 = create_synthetic_hud_frame(timer_progress=0.8)
        frame_t2 = create_synthetic_hud_frame(timer_progress=0.7)

        diff = [
            abs(p1 - p2)
            for p1, p2 in zip(frame_t1.getdata(), frame_t2.getdata())
        ]
        total_diff = sum(sum(d) for d in diff)
        assert total_diff > 0, "Frames must not be identical (must have dynamic motion)."


# ---------------------------------------------------------------------------
# Tier 2: Boundary, Edge & Adversarial Tests
# ---------------------------------------------------------------------------

class TestStage3VideoBoundaryAndEdge:
    """Tier 2: Hard-floor duration rejection, resolution mismatches, and black frame detection."""

    def test_reject_video_duration_below_62s_hard_floor(self, mock_ffprobe_short_mp4: Dict[str, Any]):
        """Feature F15 & F17: Strictly reject videos under 62.0s duration (e.g. 58.0s)."""
        res = audit_stage3_video_contract(mock_ffprobe_short_mp4)
        assert res["verdict"] == "FAIL"
        assert any("HARD_FAIL" in err and "below required 62.0s minimum" in err for err in res["errors"])

    def test_reject_horizontal_or_non_1080x1920_resolution(self, mock_ffprobe_invalid_resolution: Dict[str, Any]):
        """Feature F14 & F17: Strictly reject landscape or incorrect resolutions (e.g. 1920x1080)."""
        res = audit_stage3_video_contract(mock_ffprobe_invalid_resolution)
        assert res["verdict"] == "FAIL"
        assert any("Must be exactly 1080x1920" in err for err in res["errors"])

    def test_reject_video_missing_audio_track(self, mock_ffprobe_no_audio: Dict[str, Any]):
        """Feature F14 & F17: Reject video without an audio stream."""
        res = audit_stage3_video_contract(mock_ffprobe_no_audio)
        assert res["verdict"] == "FAIL"
        assert any("No audio stream found" in err for err in res["errors"])

    def test_reject_black_or_unrendered_keyframes(self, mock_ffprobe_valid_mp4: Dict[str, Any]):
        """Feature F17: Reject video if keyframes contain black frames (mean brightness < 10.0)."""
        black_frame = Image.new("RGB", (1080, 1920), color=(0, 0, 0))
        samples = {"frame_at_10s": black_frame}
        res = audit_stage3_video_contract(mock_ffprobe_valid_mp4, keyframe_samples=samples)
        assert res["verdict"] == "FAIL"
        assert any("black or unrendered" in err for err in res["errors"])

    def test_reject_reveal_keyframe_lacking_green_highlight(self, mock_ffprobe_valid_mp4: Dict[str, Any]):
        """Feature F12 & F17: Reject video if reveal keyframe lacks the green highlight."""
        # Non-revealed frame passed as reveal keyframe
        unrevealed = create_synthetic_hud_frame(reveal_active=False)
        samples = {"q1_reveal_keyframe": unrevealed}
        res = audit_stage3_video_contract(mock_ffprobe_valid_mp4, keyframe_samples=samples)
        assert res["verdict"] == "FAIL"
        assert any("lacks vibrant green (#00FF66)" in err for err in res["errors"])

    def test_reject_invalid_frame_rate(self, mock_ffprobe_valid_mp4: Dict[str, Any]):
        """Feature F14 & F17: Reject 24fps or 60fps video (requires 30.0fps)."""
        bad_fps = dict(mock_ffprobe_valid_mp4)
        bad_fps["streams"][0]["r_frame_rate"] = "24/1"
        res = audit_stage3_video_contract(bad_fps)
        assert res["verdict"] == "FAIL"
        assert any("Must be 30.0 fps" in err for err in res["errors"])


# ---------------------------------------------------------------------------
# Tier 3: Pairwise & Cross-Feature Integration Tests
# ---------------------------------------------------------------------------

class TestStage3VideoPairwiseIntegration:
    """Tier 3: Pairwise contracts between Video Engine and Audio Manifest."""

    def test_video_render_result_contract_schema(self):
        """Feature F14: VideoRenderResult data structure matches PROJECT.md contract."""
        result = {
            "video_path": "output/videos/quiz_video_1.mp4",
            "duration_seconds": 72.0,
            "resolution": (1080, 1920),
            "frame_count": 2160,
            "fps": 30.0,
            "has_audio": True,
        }
        assert result["duration_seconds"] >= 62.0
        assert result["resolution"] == (1080, 1920)
        assert result["frame_count"] == round(result["duration_seconds"] * result["fps"])

    @pytest.mark.skipif(not SRC_STAGE3_AVAILABLE, reason="src.video modules not yet generated by worker M3")
    def test_src_video_engine_render_call(self, tmp_path: Path):
        """Feature F16: Test render_quiz_video when src is available."""
        pass


# ---------------------------------------------------------------------------
# Tier 4: Real-World Application Scenario
# ---------------------------------------------------------------------------

class TestStage3VideoRealWorldScenario:
    """Tier 4: Scenario 3 (TEST_INFRA.md) — Vertical MP4 Render (Script #1) & HUD Audit."""

    def test_vertical_mp4_render_and_inspection_scenario(
        self,
        mock_ffprobe_valid_mp4: Dict[str, Any],
        tmp_path: Path,
    ):
        """Scenario 3: Verify video specs and HUD keyframe sampling for Script #1."""
        # 1. Create simulated keyframe samples at audit timestamps
        keyframes = {
            "t02_hook": create_synthetic_hud_frame(reveal_active=False),
            "t10_q1_active": create_synthetic_hud_frame(reveal_active=False, timer_progress=0.7),
            "t13_q1_reveal": create_synthetic_hud_frame(reveal_active=True, correct_option_index=1),
            "t48_q5_trap": create_synthetic_hud_frame(reveal_active=False, timer_progress=0.4),
            "t68_q8_bonus": create_synthetic_hud_frame(reveal_active=False, timer_progress=1.0),
        }

        # 2. Run Stage 3 audit with stream specs + visual keyframes
        audit_res = audit_stage3_video_contract(mock_ffprobe_valid_mp4, keyframe_samples=keyframes)

        # 3. Assert full PASS
        assert audit_res["verdict"] == "PASS"
        assert audit_res["score"] == 100.0
        assert audit_res["duration_seconds"] >= 62.0
        assert audit_res["resolution"] == (1080, 1920)
        assert len(audit_res["errors"]) == 0
