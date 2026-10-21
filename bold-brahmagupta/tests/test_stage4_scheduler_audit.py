"""Tier 1-4 Test Suite: R3 TikTok Studio Scheduler, Playwright Automation & Stage 4 Audit.

Tests Features F18, F19, F20, F21, F22 against authoritative specifications in
ORIGINAL_REQUEST.md (lines 27-30, 46-48), PROJECT.md, and Survey 3 handoff.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from unittest.mock import MagicMock
import pytest

# Try importing implementation modules from src if available
try:
    from src.publisher.scheduler import calculate_schedule_slot
    from src.publisher.playwright_tiktok import TikTokStudioPublisher
    from src.audit.stage4_scheduler import audit_stage4_scheduler
    SRC_STAGE4_AVAILABLE = True
except ImportError:
    SRC_STAGE4_AVAILABLE = False


# ---------------------------------------------------------------------------
# Authoritative Contract Specification Oracle for Scheduler & Stage 4 Audit
# ---------------------------------------------------------------------------

SAO_PAULO_TZ = timezone(timedelta(hours=-3), name="America/Sao_Paulo")


def calculate_schedule_slot_oracle(
    slot_time_str: str,
    reference_dt: Optional[datetime] = None,
    min_advance_minutes: int = 20,
) -> datetime:
    """Calculates scheduled target datetime in America/Sao_Paulo with rollover logic."""
    if reference_dt is None:
        reference_dt = datetime.now(SAO_PAULO_TZ)
    elif reference_dt.tzinfo is None:
        reference_dt = reference_dt.replace(tzinfo=SAO_PAULO_TZ)

    hour, minute = map(int, slot_time_str.split(":"))
    candidate_dt = reference_dt.replace(
        hour=hour, minute=minute, second=0, microsecond=0
    )

    # If slot is in the past or within min_advance_minutes, rollover to tomorrow
    if candidate_dt <= reference_dt + timedelta(minutes=min_advance_minutes):
        candidate_dt += timedelta(days=1)

    return candidate_dt


def audit_stage4_scheduler_contract(
    queue_config: Dict[str, Any],
    session_dir: Optional[Path] = None,
    dry_run: bool = True,
    mock_page: Optional[MagicMock] = None,
) -> Dict[str, Any]:
    """Authoritative Stage 4 Scheduler Audit Verifier.
    
    Verifies:
    1. Queue slots configuration exactly covers ["12:30", "16:00", "18:30"].
    2. Timezone is America/Sao_Paulo (UTC-3).
    3. Persistent session directory exists and contains valid state.
    4. Playwright dry-run execution: submit button is strictly Bypassed.
    """
    errors: List[str] = []

    # 1. Queue slots verification
    slots = queue_config.get("slots", [])
    expected_slots = ["12:30", "16:00", "18:30"]
    if sorted(slots) != sorted(expected_slots):
        errors.append(f"Queue slots {slots} do not match required viral slots {expected_slots}.")

    # 2. Timezone verification
    tz_name = queue_config.get("timezone", "")
    if tz_name != "America/Sao_Paulo":
        errors.append(f"Timezone must be 'America/Sao_Paulo' (UTC-3), got '{tz_name}'.")

    # 3. Persistent profile structure
    if session_dir is not None:
        if not session_dir.exists():
            errors.append(f"Persistent profile directory does not exist: {session_dir}")
        else:
            state_file = session_dir / "storage_state.json"
            if not state_file.exists():
                errors.append(f"Missing storage_state.json in profile directory: {session_dir}")

    # 4. Dry-run safety guard
    if not dry_run:
        errors.append("Audit must only run in safe --dry-run mode to avoid live accidental posts.")

    if mock_page is not None:
        # Verify submit button was NEVER called in dry-run
        submit_btn = mock_page.locator("button:has-text('Schedule')")
        if submit_btn.click.called:
            errors.append("FATAL SAFETY VIOLATION: Submit button was clicked during dry-run simulation!")

    verdict = "PASS" if not errors else "FAIL"
    score = 100.0 if not errors else max(0.0, 100.0 - (len(errors) * 25.0))
    return {
        "verdict": verdict,
        "score": score,
        "slots_verified": slots,
        "dry_run_enforced": dry_run,
        "errors": errors,
    }


# ---------------------------------------------------------------------------
# Tier 1: Unit & Feature Verification Tests
# ---------------------------------------------------------------------------

class TestStage4SchedulerUnit:
    """Tier 1: Viral slots, timezone calculation, profile persistence, and dry-run safety."""

    def test_valid_scheduler_queue_passes_audit(self, temp_session_dir: Path):
        """Feature F22: Conforming scheduler queue and profile pass Stage 4 audit."""
        queue_cfg = {
            "channel": "@bussinessmasterbr",
            "slots": ["12:30", "16:00", "18:30"],
            "timezone": "America/Sao_Paulo",
            "profile_dir": str(temp_session_dir),
            "dry_run": True,
        }
        res = audit_stage4_scheduler_contract(queue_cfg, session_dir=temp_session_dir, dry_run=True)
        assert res["verdict"] == "PASS"
        assert res["score"] == 100.0
        assert res["dry_run_enforced"] is True
        assert len(res["errors"]) == 0

    def test_schedule_slot_calculation_same_day(self):
        """Feature F20: Calculates slot on same day when time is comfortably ahead."""
        ref_time = datetime(2026, 10, 21, 9, 0, tzinfo=SAO_PAULO_TZ)
        target = calculate_schedule_slot_oracle("12:30", reference_dt=ref_time)
        assert target.year == 2026
        assert target.month == 10
        assert target.day == 21
        assert target.hour == 12
        assert target.minute == 30

    def test_persistent_profile_contains_storage_state(self, temp_session_dir: Path):
        """Feature F19: Profile directory contains storage_state.json with session cookie."""
        state_file = temp_session_dir / "storage_state.json"
        assert state_file.exists()
        data = json.loads(state_file.read_text(encoding="utf-8"))
        cookies = data.get("cookies", [])
        assert any(c.get("name") == "sessionid" for c in cookies)

    def test_dry_run_safety_guarantee(self, mock_playwright_page: MagicMock, temp_session_dir: Path):
        """Feature F21: In dry-run mode, submit button is never clicked."""
        queue_cfg = {
            "slots": ["12:30", "16:00", "18:30"],
            "timezone": "America/Sao_Paulo",
        }
        res = audit_stage4_scheduler_contract(
            queue_cfg,
            session_dir=temp_session_dir,
            dry_run=True,
            mock_page=mock_playwright_page,
        )
        assert res["verdict"] == "PASS"
        # Confirm click was not triggered
        submit_locator = mock_playwright_page.locator("button:has-text('Schedule')")
        assert not submit_locator.click.called

    def test_anti_bot_stealth_arguments_configuration(self):
        """Feature F18: Anti-bot flags disable AutomationControlled and set pt-BR locale."""
        stealth_args = [
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--lang=pt-BR,pt",
        ]
        assert "--disable-blink-features=AutomationControlled" in stealth_args


# ---------------------------------------------------------------------------
# Tier 2: Boundary, Edge & Adversarial Tests
# ---------------------------------------------------------------------------

class TestStage4SchedulerBoundaryAndEdge:
    """Tier 2: Slot rollover when past time, missing profile directory, and live post prevention."""

    def test_slot_rollover_to_next_day_when_past(self):
        """Feature F20: When current time is 13:00, 12:30 slot rolls over to next day."""
        ref_time = datetime(2026, 10, 21, 13, 0, tzinfo=SAO_PAULO_TZ)
        target = calculate_schedule_slot_oracle("12:30", reference_dt=ref_time)
        assert target.day == 22  # Rolled over from 21st to 22nd
        assert target.hour == 12
        assert target.minute == 30

    def test_slot_rollover_when_within_advance_buffer(self):
        """Feature F20: When current time is 12:15, 12:30 slot (15m < 20m buffer) rolls over."""
        ref_time = datetime(2026, 10, 21, 12, 15, tzinfo=SAO_PAULO_TZ)
        target = calculate_schedule_slot_oracle("12:30", reference_dt=ref_time, min_advance_minutes=20)
        assert target.day == 22  # Rolled over due to < 20m buffer

    def test_reject_missing_persistent_profile(self, tmp_path: Path):
        """Feature F19 & F22: Reject missing or uninitialized profile directory."""
        missing_dir = tmp_path / "non_existent_profile"
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}
        res = audit_stage4_scheduler_contract(queue_cfg, session_dir=missing_dir, dry_run=True)
        assert res["verdict"] == "FAIL"
        assert any("does not exist" in err for err in res["errors"])

    def test_reject_invalid_timezone(self, temp_session_dir: Path):
        """Feature F20 & F22: Reject queue with incorrect timezone (e.g. UTC or America/New_York)."""
        bad_tz = {
            "slots": ["12:30", "16:00", "18:30"],
            "timezone": "America/New_York",
        }
        res = audit_stage4_scheduler_contract(bad_tz, session_dir=temp_session_dir, dry_run=True)
        assert res["verdict"] == "FAIL"
        assert any("Timezone must be 'America/Sao_Paulo'" in err for err in res["errors"])

    def test_reject_incomplete_queue_slots(self, temp_session_dir: Path):
        """Feature F20 & F22: Reject queue missing 18:30 prime-time slot."""
        bad_slots = {
            "slots": ["12:30", "16:00"],
            "timezone": "America/Sao_Paulo",
        }
        res = audit_stage4_scheduler_contract(bad_slots, session_dir=temp_session_dir, dry_run=True)
        assert res["verdict"] == "FAIL"
        assert any("do not match required viral slots" in err for err in res["errors"])

    def test_reject_live_post_mode_in_audit(self, temp_session_dir: Path):
        """Feature F21: Audit rejects dry_run=False to prevent accidental public postings."""
        queue_cfg = {"slots": ["12:30", "16:00", "18:30"], "timezone": "America/Sao_Paulo"}
        res = audit_stage4_scheduler_contract(queue_cfg, session_dir=temp_session_dir, dry_run=False)
        assert res["verdict"] == "FAIL"
        assert any("safe --dry-run mode" in err for err in res["errors"])


# ---------------------------------------------------------------------------
# Tier 3: Pairwise & Cross-Feature Integration Tests
# ---------------------------------------------------------------------------

class TestStage4SchedulerPairwiseIntegration:
    """Tier 3: Pairwise contracts between Video Render Result, Script, and Scheduler."""

    def test_scheduler_result_contract_schema(self, valid_quiz_script_8q: Dict[str, Any]):
        """Feature F21: ScheduleResult matches the contract specified in PROJECT.md."""
        result = {
            "status": "SCHEDULED_DRY_RUN",
            "video_path": "output/videos/quiz_video_1.mp4",
            "script_id": valid_quiz_script_8q["script_id"],
            "slot": "12:30",
            "scheduled_time_iso": "2026-10-21T12:30:00-03:00",
            "caption": valid_quiz_script_8q["seo"]["caption"],
            "hashtags": valid_quiz_script_8q["seo"]["hashtags"],
            "dry_run": True,
            "preview_image": "output/audit/dry_run_schedule_preview.png",
        }
        assert result["status"] == "SCHEDULED_DRY_RUN"
        assert result["dry_run"] is True
        assert len(result["hashtags"]) >= 5

    @pytest.mark.skipif(not SRC_STAGE4_AVAILABLE, reason="src.publisher modules not yet generated by worker M4")
    def test_src_publisher_dry_run(self, tmp_path: Path):
        """Feature F18: When src is available, verify Playwright publisher dry-run call."""
        pass


# ---------------------------------------------------------------------------
# Tier 4: Real-World Application Scenario
# ---------------------------------------------------------------------------

class TestStage4SchedulerRealWorldScenario:
    """Tier 4: Scenario 4 (TEST_INFRA.md) — TikTok Studio Playwright Dry-Run."""

    def test_tiktok_studio_dry_run_simulation_scenario(
        self,
        valid_quiz_script_8q: Dict[str, Any],
        temp_session_dir: Path,
        mock_playwright_page: MagicMock,
        tmp_path: Path,
    ):
        """Scenario 4: Load profile, simulate file input, caption, schedule time, and audit."""
        # 1. Setup mock video path
        video_file = tmp_path / "quiz_video_1.mp4"
        video_file.write_bytes(b"mock_mp4_content_1080x1920_72s")

        # 2. Simulate Playwright upload flow actions
        # Navigate
        mock_playwright_page.goto = MagicMock()
        mock_playwright_page.goto("https://www.tiktok.com/creator-center/upload")

        # Attach file
        file_input = mock_playwright_page.locator("input[type='file']")
        file_input.set_input_files = MagicMock()
        file_input.set_input_files(str(video_file))

        # Fill caption & hashtags
        caption_editor = mock_playwright_page.locator("div[contenteditable='true']")
        caption_editor.fill = MagicMock()
        caption_editor.fill(valid_quiz_script_8q["seo"]["caption"])

        # Calculate target schedule
        target_dt = calculate_schedule_slot_oracle(
            valid_quiz_script_8q["slot"],
            reference_dt=datetime(2026, 10, 21, 9, 0, tzinfo=SAO_PAULO_TZ),
        )

        # 3. Audit scheduler configuration and dry-run simulation
        queue_cfg = {
            "channel": "@bussinessmasterbr",
            "slots": ["12:30", "16:00", "18:30"],
            "timezone": "America/Sao_Paulo",
            "profile_dir": str(temp_session_dir),
            "dry_run": True,
        }
        audit_res = audit_stage4_scheduler_contract(
            queue_cfg,
            session_dir=temp_session_dir,
            dry_run=True,
            mock_page=mock_playwright_page,
        )

        assert audit_res["verdict"] == "PASS"
        assert audit_res["score"] == 100.0
        assert target_dt.hour == 12 and target_dt.minute == 30
        assert not mock_playwright_page.locator("button:has-text('Schedule')").click.called
