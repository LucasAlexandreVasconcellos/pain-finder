# E2E Test Infra: TikTok Dark Quiz Automation System (@bussinessmasterbr)

## Test Philosophy
- **Requirement-Driven & Opaque-Box**: Tests are derived strictly from `ORIGINAL_REQUEST.md` and user-facing acceptance criteria, independent of internal implementation trivia.
- **Methodology**: Systematic 4-Tier Testing Model (Category-Partition, Boundary Value Analysis, Pairwise Interaction, and Real-World Workload Simulation).
- **Hard Guardrail Enforcement**: Any failure of the duration constraint (`>= 62.0s`), missing 5-block psychological structure, lack of pt-BR neural voice, or non-functional Playwright scheduler immediately halts the pipeline.

## Feature Inventory & Test Mapping
| # | Feature | Requirement Source | Tier 1 (Unit/Feature) | Tier 2 (Boundary/Edge) | Tier 3 (Pairwise/Integration) | Tier 4 (E2E Scenario) |
|---|---------|-------------------|:---------------------:|:----------------------:|:----------------------------:|:---------------------:|
| F01 | Data Schema & Pydantic | R1 (lines 12-19) | 5 tests | 5 tests | ✓ | ✓ |
| F02 | Script Generator | R1 (lines 12-19) | 5 tests | 5 tests | ✓ | ✓ |
| F03 | Markdown Retention Guide | R1 (lines 12-19) | 5 tests | 5 tests | ✓ | ✓ |
| F04 | 3 Daily Viral Scripts | R1 (lines 12-19, 37-40)| 5 tests | 5 tests | ✓ | ✓ |
| F05 | Stage 1 Script Audit | R4 (lines 32-34) | 5 tests | 5 tests | ✓ | ✓ |
| F06 | Neural TTS Narration | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F07 | Procedural Sound Synth | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F08 | Audio Ducking & Mixing | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F09 | Stage 2 Audio Audit | R4 (lines 32-34) | 5 tests | 5 tests | ✓ | ✓ |
| F10 | Visual HUD Renderer | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F11 | Animated 3s Countdown | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F12 | Green Answer Reveal | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F13 | Dynamic Anti-Static BG | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F14 | Video Render Engine | R2 (lines 20-25) | 5 tests | 5 tests | ✓ | ✓ |
| F15 | Hard Duration Guardrail | R2 (lines 20-25, 41-45)| 5 tests | 5 tests | ✓ | ✓ |
| F16 | Production MP4 Video #1 | R2 (lines 41-45) | 5 tests | 5 tests | ✓ | ✓ |
| F17 | Stage 3 Video Audit | R4 (lines 32-34, 41-45)| 5 tests | 5 tests | ✓ | ✓ |
| F18 | Playwright Automation | R3 (lines 27-30) | 5 tests | 5 tests | ✓ | ✓ |
| F19 | Session Persistence | R3 (lines 27-30) | 5 tests | 5 tests | ✓ | ✓ |
| F20 | Viral Slot Scheduler | R3 (lines 27-30) | 5 tests | 5 tests | ✓ | ✓ |
| F21 | Safe Dry-Run Mode & CLI | R3 (lines 27-30, 46-48)| 5 tests | 5 tests | ✓ | ✓ |
| F22 | Stage 4 Scheduler Audit | R4 (lines 32-34, 46-48)| 5 tests | 5 tests | ✓ | ✓ |
| F23 | Central Self-Audit Pipeline | R4 (lines 32-34) | 5 tests | 5 tests | ✓ | ✓ |
| F24 | Audit Reports & Cert | R4 (lines 32-34) | 5 tests | 5 tests | ✓ | ✓ |
| F25 | Full Pytest Suite | R4 & Acceptance | 5 tests | 5 tests | ✓ | ✓ |

## Test Architecture
- **Test Runner**: `pytest` invoked via `pytest tests/ -v`.
- **Audit Runner**: `python audit.py --stage all --dry-run` producing `output/audit/audit_report.json` and `output/audit/AUDIT_CERTIFICATE.md`.
- **Pass/Fail Semantics**: All test suites must pass with exit code 0. Audit must output `overall_verdict: "PASS"`.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity | Pass Criteria |
|---|----------|--------------------|------------|---------------|
| 1 | Full Script Pipeline (12:30, 16:00, 18:30) | F01–F05 | Medium | 3 scripts + 3 guides created and validated by Stage 1 audit |
| 2 | Neural Narration & Sound Mastering | F06–F09 | High | Audio files generated, RMS > -45dBFS, non-silent, ducking active |
| 3 | Vertical MP4 Render (Script #1) | F10–F17 | Very High | Real 1080x1920 MP4, duration >= 62.0s (target 72s), HUD verified |
| 4 | TikTok Studio Playwright Dry-Run | F18–F22 | High | Profile loaded, upload simulated, schedule slots verified |
| 5 | Full 4-Stage Self-Audit & Acceptance Verification | F23–F25 | Very High | `audit.py` passes all 4 stages, generates certificate, pytest passes |

## Coverage Thresholds
- Tier 1: $\ge 5$ tests per feature (happy-path isolation)
- Tier 2: $\ge 5$ boundary and corner tests per feature (invalid inputs, duration boundaries, missing fields, silent audio)
- Tier 3: Pairwise cross-feature interaction coverage across all pipelines
- Tier 4: 5 full end-to-end real-world scenarios
