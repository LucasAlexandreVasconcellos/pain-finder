# TEST_READY: Comprehensive E2E Test Suite (@bussinessmasterbr)

**Project:** TikTok Dark Quiz Automation & Production System  
**Channel:** `@bussinessmasterbr`  
**Integrity Mode:** Development  
**Author:** `teamwork_preview_test_writer_e2e`  
**Timestamp:** 2026-10-21T15:15:00Z  
**Status:** READY FOR EXECUTION  

---

## 1. Overview & Test Architecture

The E2E test suite provides opaque-box, requirement-driven verification of the entire automated production, creative direction, neural narration, programmatic video rendering (>60s, 65s–80s), and scheduled publication pipeline for the TikTok Dark Quiz channel `@bussinessmasterbr`.

All tests are derived strictly from `ORIGINAL_REQUEST.md`, `PROJECT.md`, `TEST_INFRA.md`, and technical specifications from Surveys 1, 2, and 3.

### Test Runner Commands
```powershell
# Run the complete test suite with verbose reporting
pytest tests/ -v

# Run by individual stage test module
pytest tests/test_stage1_script_audit.py -v
pytest tests/test_stage2_audio_audit.py -v
pytest tests/test_stage3_video_audit.py -v
pytest tests/test_stage4_scheduler_audit.py -v
pytest tests/test_e2e_pipeline.py -v

# Run the 4-stage central self-audit CLI (Dry-Run mode)
python audit.py --stage all --dry-run
```

---

## 2. Test Suite File Inventory

| File Path | Scope & Features Covered | Test Count |
|---|---|:---:|
| `tests/conftest.py` | Shared fixtures, synthetic PCM WAV audio generators, mock ffprobe media dictionaries, mock Playwright DOM locators, persistent profile doubles. | Fixtures |
| `tests/test_stage1_script_audit.py` | **R1 & Stage 1**: Schema validation, 5 psychological retention blocks, Q1-Q7 + Q8 bonus, Markdown guide, SEO metadata, 12:30/16:00/18:30 slots (**F01, F02, F03, F04, F05**). | 17 tests |
| `tests/test_stage2_audio_audit.py` | **R2 Audio & Stage 2**: pt-BR neural narration, procedural sound synthesizer (whoosh, 3s tick-tac, ding, alert), dynamic ducking, RMS loudness > -45 dBFS, non-silence (**F06, F07, F08, F09**). | 13 tests |
| `tests/test_stage3_video_audit.py` | **R2 Video & Stage 3**: 1080x1920 9:16 vertical video, 30fps, duration hard floor >= 62.0s, HUD elements (badges, counter, card, options, 3s countdown bar, green reveal #00FF66), dynamic background (**F10, F11, F12, F13, F14, F15, F16, F17**). | 14 tests |
| `tests/test_stage4_scheduler_audit.py` | **R3 Scheduler & Stage 4**: Viral queue slots (12:30, 16:00, 18:30 America/Sao_Paulo UTC-3), persistent profile directory, anti-bot flags, safe dry-run execution (**F18, F19, F20, F21, F22**). | 14 tests |
| `tests/test_e2e_pipeline.py` | **R4 Central Audit & E2E Pipeline**: Orchestration of Stages 1-4, fail-fast cascading, `output/audit/audit_report.json` schema, `output/audit/AUDIT_CERTIFICATE.md` generation, Scenarios 1-5 (**F23, F24, F25**). | 8 tests |

**Total Tests in Suite:** 66 tests across Tiers 1, 2, 3, and 4.

---

## 3. 4-Tier Test Coverage Breakdown

### Tier 1: Primary Behavior & Feature Verification ($\ge 5$ tests per feature)
- Valid Dark Quiz script parsing and field validation.
- Question structure: strictly 7 graded questions + 1 bonus question.
- 5 psychological blocks:
  - Block 0: Anti-Scroll Hook (00s–04s) with ego challenge and Q5 trap promise.
  - Block 1: Fast Dopamine (04s–18s) with Q1 and Q2 Fácil.
  - Block 2: Pattern Break (18s–36s) with Q3 and Q4 Médio + 4s Micro-Curiosity trivia.
  - Block 3: Trap Escalation (36s–54s) with Q5 (is_trap=True) and Q6 Difícil.
  - Block 4: Final Boss & Comment Loop (54s–72s) with Q7 Impossível + Score CTA + Q8 Bonus (unrevealed in video).
- Procedural synthesis of 4 sound effects (WAV PCM 16-bit, 44.1 kHz stereo, no numeric clipping).
- Audio sidechain ducking and master mixdown.
- Visual HUD layout within TikTok mobile safe zones.
- Animated 3s countdown bar with smooth depletion and color transition (green $\to$ amber $\to$ red).
- Green answer reveal highlight in emerald `#00FF66` / `#059669`.
- Dynamic background motion vector assurance.
- Persistent session structure `.tiktok_session/@bussinessmasterbr` and storage_state.json.
- America/Sao_Paulo (UTC-3) timezone and slot queue scheduling.
- Central audit pipeline execution and executive certificate generation.

### Tier 2: Boundary, Edge & Adversarial Guardrails
- **Hard Duration Floor**: Video duration $< 62.0s$ triggers immediate `HARD_FAIL` and halts publication.
- **Script Duration Window**: Estimated script durations $< 65.0s$ or $> 80.0s$ are rejected.
- **Zeigarnik Loop Preservation**: Bonus Question (Q8) having `reveal_in_video = True` is rejected.
- **Cognitive Trap Requirement**: Question 5 lacking `is_trap = True` is rejected.
- **Silence Rejection**: Audio tracks with RMS loudness $\le -45.0\text{ dBFS}$ or continuous silence are rejected.
- **Resolution Strictness**: Non-1080x1920 resolutions (e.g. 1920x1080 landscape or 720p) are rejected.
- **Frame Rate Strictness**: Non-30fps frame rates (e.g. 24fps or 60fps) are rejected.
- **Black Screen Detection**: Keyframes with mean brightness $< 10.0$ are rejected.
- **Dry-Run Safety Lock**: When running in `--dry-run` mode, submit/post button clicks are strictly prevented.
- **Schedule Rollover**: Past slots or slots within a 20-minute advance window automatically roll over to the next day.

### Tier 3: Pairwise & Cross-Feature Integration Contracts
- `src.scripts` $\rightarrow$ `src.audio`: Script audio manifest synchronization within $\pm 1.5s$ tolerance.
- `src.audio` + `src.scripts` $\rightarrow$ `src.video`: Video render pipeline consuming audio manifest and matching frame count ($\text{frames} = \text{round}(\text{duration} \times 30)$).
- `src.video` + `src.scripts` $\rightarrow$ `src.publisher`: Scheduler consuming MP4 video, SEO title, caption, hashtags, and generating dry-run preview.
- All modules $\rightarrow$ `src.audit`: Standardized `StageAuditResult` (`verdict: "PASS" | "FAIL"`, `score: float`, `errors: List[str]`).

### Tier 4: Real-World Application Scenarios
1. **Scenario 1**: 3 Daily Scripts Generation (12:30, 16:00, 18:30) with JSON, Markdown guides, and Stage 1 audit pass.
2. **Scenario 2**: Neural Narration & Sound Mastering with procedural SFX, dynamic ducking, and Stage 2 audio audit pass.
3. **Scenario 3**: Vertical MP4 Video Rendering (Script #1) with 1080x1920 canvas, HUD, countdown bar, green reveal, and Stage 3 video audit pass.
4. **Scenario 4**: TikTok Studio Playwright Dry-Run scheduling with session persistence and Stage 4 scheduler audit pass.
5. **Scenario 5**: Full 4-Stage Self-Audit and Acceptance Certification generating `output/audit/audit_report.json` and `output/audit/AUDIT_CERTIFICATE.md`.

---

## 4. Expected Output Oracles

All tests compare against explicit authoritative oracles:
- `calculate_script_duration_oracle`: Mathematical pacing formula based on section 2.1 decomposition ($T_{\text{total}} = 72.0s \pm 3.0s$).
- `calculate_wav_rms_dbfs`: Digital audio signal analysis computing exact RMS amplitude in dBFS.
- `audit_stage1_script_contract`: Formal 9-point rule validation for Stage 1.
- `audit_stage2_audio_contract`: 5-point acoustic integrity validation for Stage 2.
- `audit_stage3_video_contract`: Container, codec, resolution, and visual keyframe color inspection for Stage 3.
- `audit_stage4_scheduler_contract`: Slot timing, timezone, session state, and dry-run safety for Stage 4.
- `run_central_audit_pipeline_contract`: Multi-stage aggregation and certificate generation.

---

## 5. Escalation & Implementation Status

- **Exclusive File Ownership Honored**: Modified only `tests/*` and `TEST_READY.md`. No implementation code under `src/` or `data/` was modified.
- **Implementation Status**: Milestone M1 is currently in progress by `teamwork_preview_worker_m1`. Tests are fully decoupled and self-contained with contract fallbacks and test doubles, allowing progressive testability and immediate verification as milestones complete.
