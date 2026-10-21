# Project: TikTok Dark Quiz Automation & Production System (@bussinessmasterbr)

## Architecture
The system is an end-to-end automated production, creative direction, programmatic video rendering (>60s, 65s–80s), and scheduled publication engine for the TikTok Dark Quiz channel `@bussinessmasterbr`. It features an independent 4-stage self-audit pipeline.

### Data Flow
1. **Script Engine (`src/scripts/`)**: Ingests niche intelligence and outputs 3 structured JSON scripts (12:30, 16:00, 18:30) and second-by-second Markdown retention guides adhering to 5 psychological retention blocks.
2. **Audio Engine (`src/audio/`)**: Synthesizes pt-BR neural narration (`edge-tts` / offline fallback), generates procedural sound effects (whoosh, 3s tic-tac, ding, alert siren), and mixes audio tracks with dynamic ducking (lowering tension music during speech).
3. **Video Engine (`src/video/`)**: Procedurally renders 1080x1920 9:16 vertical video at 30fps with animated HUD (level badge, progress counter 1/7..7/7, question card, 4 options A/B/C/D, 3s countdown bar, green reveal highlight) and dynamic anti-static background. Enforces hard duration guardrail `>= 62.0s`.
4. **Publisher & Scheduler (`src/publisher/`)**: Automates TikTok Studio Web via Playwright using persistent profile (`.tiktok_session/@bussinessmasterbr`), handles viral slots (12:30, 16:00, 18:30 America/Sao_Paulo UTC-3), and provides `--dry-run` simulation.
5. **Self-Audit Pipeline (`src/audit/` & `audit.py`)**: Runs modular stage audits (Stage 1: Script, Stage 2: Audio, Stage 3: Video specs & HUD, Stage 4: Scheduler & Dry-run) producing `output/audit/audit_report.json` and `output/audit/AUDIT_CERTIFICATE.md`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Pydantic Data Schema | Formal JSON schema and Python models for Dark Quiz with duration validation | M1 | Survey R1 |
| F02 | Dark Quiz Script Generator | Generates retention-engineered quizzes for Business, Trivia, Curiosities | M1 | Survey R1 |
| F03 | Markdown Retention Guide Builder | Second-by-second guide explaining psychological retention triggers | M1 | Survey R1 |
| F04 | 3 Daily Viral Scripts | Complete scripts for 12:30, 16:00, 18:30 with SEO titles, copy & hashtags | M1 | Survey R1 |
| F05 | Stage 1 Script Audit | Validates schema, 5 blocks, Q1-Q7 + Q8 bonus without reveal, duration 65s–80s | M1 | Survey R1/R4 |
| F06 | Neural TTS Narration | pt-BR voice synthesis (`edge-tts` Antonio/Francisca + offline SAPI5/gTTS fallback) | M2 | Survey R2 |
| F07 | Procedural Sound Synthesizer | Generates Whoosh, 3s Tic-Tac, Ding Chime, Warning Alert in pure Python | M2 | Survey R2 |
| F08 | Audio Ducking & Mixer | Compresses tension music during speech and releases smoothly during 3s timer | M2 | Survey R2 |
| F09 | Stage 2 Audio Audit | Validates audio presence, RMS loudness > -45 dBFS, sync ±1.5s, duration >= 62s | M2 | Survey R2/R4 |
| F10 | Visual HUD Renderer | Level badges, progress 1/7..7/7, rounded question card, 4 option boxes | M3 | Survey R2 |
| F11 | Animated 3s Countdown Bar | Depletes smoothly with green -> amber -> red color interpolation | M3 | Survey R2 |
| F12 | Green Answer Reveal Highlight | Vibrant emerald green (#00FF66) with checkmark on correct answer | M3 | Survey R2 |
| F13 | Anti-Static Dynamic Background | Animated floating particles and oscillating radial gradient | M3 | Survey R2 |
| F14 | Programmatic Video Engine | 1080x1920, 9:16, 30fps .mp4 rendering via Pillow & FFmpeg stream | M3 | Survey R2 |
| F15 | Hard Duration Guardrail | Audio-driven clock enforcing total video duration strictly >= 62.0s | M3 | Survey R2 |
| F16 | Production Video Render | Render real, verified .mp4 video for Script #1 | M3 | Survey R2 |
| F17 | Stage 3 Video Audit | Technical inspection (1080x1920, 30fps, duration >= 62s, HUD keyframe sampling) | M3 | Survey R2/R4 |
| F18 | Playwright TikTok Automation | Resilient semantic DOM automation for video upload, caption, hashtags | M4 | Survey R3 |
| F19 | Session Persistence | Persistent profile directory `.tiktok_session/@bussinessmasterbr` & anti-bot flags | M4 | Survey R3 |
| F20 | Viral Slot Scheduler | Schedules for 12:30, 16:00, 18:30 in America/Sao_Paulo (UTC-3) with rollover | M4 | Survey R3 |
| F21 | Safe Dry-Run Mode & CLI | Complete simulation mode without actual posting; CLI dashboard | M4 | Survey R3 |
| F22 | Stage 4 Scheduler Audit | Validates queue, profile, Playwright dry-run execution, and test pass | M4 | Survey R3/R4 |
| F23 | Central Self-Audit Runner | Unified `audit.py` CLI orchestrating Stages 1, 2, 3, and 4 | M5 | Survey R4 |
| F24 | Audit Reports & Certificate | Outputs `output/audit/audit_report.json` and `AUDIT_CERTIFICATE.md` | M5 | Survey R4 |
| F25 | Comprehensive Pytest Suite | Unit, integration, and E2E tests for the full production pipeline | M5 | Survey R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Niche Intelligence, Script Gen & Retention Guide | F01, F02, F03, F04, F05 | none | DONE (18/18 tests pass, 3 scripts, 3 guides, Stage 1 audit PASS) |
| M2 | Neural TTS & Sound Design Pipeline | F06, F07, F08, F09 | M1 (contracts defined) | IN_PROGRESS (c7a5bfdc) |
| M3 | Programmatic Video Editing & HUD Render Engine | F10, F11, F12, F13, F14, F15, F16, F17 | M1, M2 | PLANNED |
| M4 | TikTok Studio Web Scheduler & Playwright Automation | F18, F19, F20, F21, F22 | M1 | PLANNED |
| M5 | Unified 4-Stage Self-Audit Pipeline & E2E Acceptance | F23, F24, F25 | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `src.scripts` -> `src.audio`
- Input: `DarkQuizScript` (validated JSON dictionary or Pydantic instance)
- Function: `synthesize_script_audio(script: DarkQuizScript, output_dir: Path) -> ScriptAudioManifest`
- Output: `ScriptAudioManifest` containing audio paths, exact durations per section, and total narration duration.

### `src.audio` + `src.scripts` -> `src.video`
- Input: `DarkQuizScript`, `ScriptAudioManifest`
- Function: `render_quiz_video(script: DarkQuizScript, audio_manifest: ScriptAudioManifest, output_path: Path) -> VideoRenderResult`
- Output: `VideoRenderResult` with `video_path: Path`, `duration_seconds: float` (asserted `>= 62.0`), `resolution: Tuple[int, int]`, `frame_count: int`.

### `src.video` + `src.scripts` -> `src.publisher`
- Input: `video_path: Path`, `script: DarkQuizScript`, `slot: str`, `dry_run: bool`
- Function: `schedule_tiktok_video(video_path: Path, script: DarkQuizScript, dry_run: bool = True) -> ScheduleResult`
- Output: `ScheduleResult` with status, scheduled_time, caption, and dry_run confirmation.

### All Modules -> `src.audit`
- Function: `run_stage_audit(stage: int, context: dict) -> StageAuditResult`
- Output: `StageAuditResult` with `verdict: "PASS" | "FAIL"`, `score: float`, `metrics: dict`, `errors: List[str]`.

## Code Layout
```
c:/Users/user/Documents/antigravity/bold-brahmagupta/
├── src/
│   ├── __init__.py
│   ├── scripts/
│   │   ├── __init__.py
│   │   ├── schema.py
│   │   ├── generator.py
│   │   └── guide_builder.py
│   ├── audio/
│   │   ├── __init__.py
│   │   ├── tts_engine.py
│   │   ├── sound_synthesizer.py
│   │   └── audio_mixer.py
│   ├── video/
│   │   ├── __init__.py
│   │   ├── hud_renderer.py
│   │   ├── background_engine.py
│   │   ├── timeline.py
│   │   └── video_engine.py
│   ├── publisher/
│   │   ├── __init__.py
│   │   ├── playwright_tiktok.py
│   │   ├── scheduler.py
│   │   └── cli.py
│   └── audit/
│       ├── __init__.py
│       ├── stage1_script.py
│       ├── stage2_audio.py
│       ├── stage3_video.py
│       ├── stage4_scheduler.py
│       └── reporter.py
├── audit.py
├── data/
│   └── scripts/
│       ├── script_1230.json
│       ├── script_1600.json
│       ├── script_1830.json
│       ├── guide_1230.md
│       ├── guide_1600.md
│       └── guide_1830.md
├── output/
│   ├── audio/
│   ├── videos/
│   │   └── quiz_video_1.mp4
│   └── audit/
│       ├── audit_report.json
│       └── AUDIT_CERTIFICATE.md
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_stage1_script_audit.py
│   ├── test_stage2_audio_audit.py
│   ├── test_stage3_video_audit.py
│   ├── test_stage4_scheduler_audit.py
│   └── test_e2e_pipeline.py
├── PROJECT.md
├── TEST_INFRA.md
└── ORIGINAL_REQUEST.md
```
