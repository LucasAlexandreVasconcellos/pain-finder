"""Shared pytest fixtures and test doubles for TikTok Dark Quiz Pipeline (@bussinessmasterbr).

Derived strictly from ORIGINAL_REQUEST.md, PROJECT.md, and TEST_INFRA.md.
Provides authoritative test fixtures for Stages 1, 2, 3, and 4 audit verifications.
"""

from __future__ import annotations

import io
import json
import math
import struct
import wave
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List
from unittest.mock import MagicMock

import pytest


# ---------------------------------------------------------------------------
# Tier 1 & 2 Fixtures: R1 Script Payloads (Valid, Short, Missing Bonus/Trap)
# ---------------------------------------------------------------------------

@pytest.fixture
def valid_quiz_script_8q() -> Dict[str, Any]:
    """Authoritative valid Dark Quiz script (72.0s duration, 5 retention blocks, Q1-Q7 + Q8 bonus)."""
    return {
        "script_id": "script_1230_general_knowledge_01",
        "slot": "12:30",
        "theme": "Conhecimentos Gerais do Cotidiano & Marcas Mundiais",
        "target_duration_seconds": 72.0,
        "voice_config": {
            "voice_name": "pt-BR-AntonioNeural",
            "rate": "+5%",
            "pitch": "+0Hz",
        },
        "hook": {
            "hook_text": (
                "Seu cérebro é acima da média ou você erra coisas simples? "
                "Cuidado com a pegadinha da pergunta número 5, quase todo mundo cai!"
            ),
            "subtitles_highlight": "⚠️ 98% ERRAM A #5",
            "duration_seconds": 4.0,
            "sfx": "sfx_whoosh_impact",
        },
        "questions": [
            {
                "index": 1,
                "level": "facil",
                "level_badge": "NÍVEL FÁCIL",
                "question_text": "Qual país é o berço e criador da pizza moderna?",
                "options": [
                    {"id": "A", "text": "França"},
                    {"id": "B", "text": "Itália"},
                    {"id": "C", "text": "Grécia"},
                    {"id": "D", "text": "Espanha"},
                ],
                "correct_option": "B",
                "correct_index": 1,
                "explanation": "A pizza margherita moderna nasceu em Nápoles, na Itália!",
                "is_trap": False,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_pop",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
            {
                "index": 2,
                "level": "facil",
                "level_badge": "NÍVEL FÁCIL",
                "question_text": "Qual empresa multinacional criou o smartphone iPhone?",
                "options": [
                    {"id": "A", "text": "Microsoft"},
                    {"id": "B", "text": "Samsung"},
                    {"id": "C", "text": "Apple"},
                    {"id": "D", "text": "Google"},
                ],
                "correct_option": "C",
                "correct_index": 2,
                "explanation": "A Apple lançou o primeiro iPhone revolucionário em 2007.",
                "is_trap": False,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_pop",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
            {
                "index": 3,
                "level": "medio",
                "level_badge": "NÍVEL MÉDIO",
                "question_text": "Qual é a moeda oficial utilizada no Japão?",
                "options": [
                    {"id": "A", "text": "Yuan"},
                    {"id": "B", "text": "Won"},
                    {"id": "C", "text": "Iene"},
                    {"id": "D", "text": "Dólar"},
                ],
                "correct_option": "C",
                "correct_index": 2,
                "explanation": "O Iene é a unidade monetária oficial do Japão desde 1871.",
                "is_trap": False,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_pop",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
            {
                "index": 4,
                "level": "medio",
                "level_badge": "NÍVEL MÉDIO",
                "question_text": "Em que ano o ser humano pisou na Lua pela primeira vez?",
                "options": [
                    {"id": "A", "text": "1959"},
                    {"id": "B", "text": "1969"},
                    {"id": "C", "text": "1975"},
                    {"id": "D", "text": "1982"},
                ],
                "correct_option": "B",
                "correct_index": 1,
                "explanation": "Neil Armstrong e Buzz Aldrin pousaram na Lua em julho de 1969.",
                "is_trap": False,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_pop",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
            {
                "index": 5,
                "level": "dificil",
                "level_badge": "NÍVEL DIFÍCIL - PEGADINHA",
                "question_text": "Quantos meses do ano têm 28 dias?",
                "options": [
                    {"id": "A", "text": "Apenas 1"},
                    {"id": "B", "text": "2 meses"},
                    {"id": "C", "text": "6 meses"},
                    {"id": "D", "text": "Todos os 12"},
                ],
                "correct_option": "D",
                "correct_index": 3,
                "explanation": "Todos os 12 meses têm 28 dias! Fevereiro tem 28 e os outros também passam por ele!",
                "is_trap": True,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_warning_trap",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
            {
                "index": 6,
                "level": "dificil",
                "level_badge": "NÍVEL DIFÍCIL",
                "question_text": "Qual é a empresa mais antiga do mundo ainda em atividade contínua?",
                "options": [
                    {"id": "A", "text": "Nintendo"},
                    {"id": "B", "text": "Kongo Gumi"},
                    {"id": "C", "text": "Beretta"},
                    {"id": "D", "text": "Twinings"},
                ],
                "correct_option": "B",
                "correct_index": 1,
                "explanation": "A Kongo Gumi foi fundada no Japão em 578 d.C. e opera até hoje!",
                "is_trap": False,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_pop",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
            {
                "index": 7,
                "level": "impossivel",
                "level_badge": "NÍVEL IMPOSSÍVEL - CHEFÃO",
                "question_text": "Qual país do planeta possui o maior número de ilhas em seu território?",
                "options": [
                    {"id": "A", "text": "Indonésia"},
                    {"id": "B", "text": "Filipinas"},
                    {"id": "C", "text": "Suécia"},
                    {"id": "D", "text": "Canadá"},
                ],
                "correct_option": "C",
                "correct_index": 2,
                "explanation": "A Suécia lidera o mundo com mais de 267 mil ilhas registradas!",
                "is_trap": False,
                "countdown_seconds": 3.0,
                "audio_cues": {
                    "intro": "sfx_warning_trap",
                    "countdown": "sfx_tick_tack_3s",
                    "reveal": "sfx_correct_ding",
                },
            },
        ],
        "micro_curiosity": {
            "insert_after_question": 3,
            "title": "💡 CURIOSIDADE RELÂMPAGO",
            "text": "Você sabia? A Apple começou na garagem de Steve Jobs e hoje tem mais caixa do que muitos países ricos!",
            "duration_seconds": 4.0,
            "sfx": "sfx_curiosity_bell",
        },
        "score_cta": {
            "text": "Quantas você acertou de verdade? Comente seu placar!",
            "duration_seconds": 3.0,
        },
        "bonus_question": {
            "index": 8,
            "badge_label": "🔥 PERGUNTA BÔNUS",
            "question_text": "Pergunta Bônus: Quem foi o primeiro bilionário em dólares registrado na história?",
            "options": ["Rockefeller", "Henry Ford", "J.P. Morgan", "Carnegie"],
            "correct_answer_secret": "John D. Rockefeller",
            "reveal_in_video": False,
            "duration_seconds": 6.0,
            "pinned_comment": "🏆 PERGUNTA BÔNUS: A primeira pessoa a acertar ganha comentário fixado!",
        },
        "seo": {
            "title": "Desafio dos 7 Níveis: 98% Erram a Pergunta 5! Quantas Você Acerta?",
            "caption": (
                "Você consegue acertar todas as 7 perguntas de conhecimentos gerais? "
                "Preste muita atenção na pegadinha da número 5! 🧠👇 "
                "Deixe seu placar nos comentários e responda a pergunta bônus!"
            ),
            "hashtags": [
                "#quiz",
                "#curiosidades",
                "#conhecimento",
                "#quizdark",
                "#desafio",
                "#fatosdesconhecidos",
                "#bussinessmasterbr",
                "#quizbrasil",
                "#aprendanotiktok",
            ],
            "cover_headline": "98% ERRAM A #5",
        },
    }


@pytest.fixture
def short_quiz_script_55s(valid_quiz_script_8q: Dict[str, Any]) -> Dict[str, Any]:
    """Invalid script with estimated duration < 60s (52.0s), strictly violating monetization guardrail."""
    short = json.loads(json.dumps(valid_quiz_script_8q))
    short["target_duration_seconds"] = 52.0
    short["hook"]["duration_seconds"] = 2.0
    short["micro_curiosity"]["duration_seconds"] = 2.0
    short["score_cta"]["duration_seconds"] = 1.5
    short["bonus_question"]["duration_seconds"] = 3.0
    for q in short["questions"]:
        q["countdown_seconds"] = 1.5
    return short


@pytest.fixture
def missing_bonus_quiz_script(valid_quiz_script_8q: Dict[str, Any]) -> Dict[str, Any]:
    """Invalid script that violates Block 4 retention by revealing the bonus answer in video."""
    invalid = json.loads(json.dumps(valid_quiz_script_8q))
    invalid["bonus_question"]["reveal_in_video"] = True  # Hard violation: loop breaker
    return invalid


@pytest.fixture
def missing_trap_quiz_script(valid_quiz_script_8q: Dict[str, Any]) -> Dict[str, Any]:
    """Invalid script where Question 5 is not configured as the trap question."""
    invalid = json.loads(json.dumps(valid_quiz_script_8q))
    invalid["questions"][4]["is_trap"] = False
    return invalid


@pytest.fixture
def daily_slots_scripts(valid_quiz_script_8q: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Returns valid scripts for all 3 mandatory viral slots: 12:30, 16:00, 18:30."""
    s1230 = json.loads(json.dumps(valid_quiz_script_8q))
    s1230["slot"] = "12:30"
    s1230["script_id"] = "script_1230"

    s1600 = json.loads(json.dumps(valid_quiz_script_8q))
    s1600["slot"] = "16:00"
    s1600["script_id"] = "script_1600"
    s1600["theme"] = "Segredos dos Bilionários & Gigantes Corporativos"
    s1600["seo"]["title"] = "Quiz de Negócios: 95% Caem na Pegadinha da Pergunta 5!"

    s1830 = json.loads(json.dumps(valid_quiz_script_8q))
    s1830["slot"] = "18:30"
    s1830["script_id"] = "script_1830"
    s1830["theme"] = "Desafio Supremo de QI & Enigmas da Mente"
    s1830["seo"]["title"] = "Desafio de QI Nível Máximo: Só 1% Acerta as 7 Perguntas!"

    return {"12:30": s1230, "16:00": s1600, "18:30": s1830}


# ---------------------------------------------------------------------------
# Tier 1 & 2 Fixtures: R2 Audio (WAV Generation, RMS Loudness, Silence)
# ---------------------------------------------------------------------------

def generate_pcm_sine_wav(duration_s: float, sample_rate: int = 44100, amplitude: float = 0.5) -> bytes:
    """Generate in-memory 16-bit PCM stereo WAV bytes of a clean sine wave."""
    num_samples = int(duration_s * sample_rate)
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        frames = bytearray()
        for i in range(num_samples):
            t = float(i) / sample_rate
            # 440 Hz tone (A4)
            val = int(amplitude * 32767.0 * math.sin(2.0 * math.pi * 440.0 * t))
            sample_bytes = struct.pack("<hh", val, val)
            frames.extend(sample_bytes)
        wav_file.writeframes(frames)
    return buffer.getvalue()


def generate_pcm_silence_wav(duration_s: float, sample_rate: int = 44100) -> bytes:
    """Generate in-memory 16-bit PCM stereo WAV bytes of pure digital silence."""
    num_samples = int(duration_s * sample_rate)
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        frames = b"\x00\x00\x00\x00" * num_samples
        wav_file.writeframes(frames)
    return buffer.getvalue()


@pytest.fixture
def valid_audio_wav_path(tmp_path: Path) -> Path:
    """Creates a temporary valid master audio WAV file of 72.0s with active signal (RMS > -45 dBFS)."""
    file_path = tmp_path / "valid_master_audio.wav"
    # Generate 72.0s sine wave with realistic loudness (~-14 dBFS)
    # Using 1.0s loop or full buffer to avoid large RAM overhead
    wav_bytes = generate_pcm_sine_wav(duration_s=2.0, sample_rate=44100, amplitude=0.4)
    file_path.write_bytes(wav_bytes)
    return file_path


@pytest.fixture
def silent_audio_wav_path(tmp_path: Path) -> Path:
    """Creates a temporary silent WAV file to trigger Stage 2 silence rejection."""
    file_path = tmp_path / "silent_audio.wav"
    wav_bytes = generate_pcm_silence_wav(duration_s=2.0, sample_rate=44100)
    file_path.write_bytes(wav_bytes)
    return file_path


# ---------------------------------------------------------------------------
# Tier 1 & 2 Fixtures: R2 Video ffprobe Mocks & Guardrail Payloads
# ---------------------------------------------------------------------------

@pytest.fixture
def mock_ffprobe_valid_mp4() -> Dict[str, Any]:
    """Authoritative mock ffprobe inspection payload for compliant 1080x1920, 30fps, 72.0s MP4."""
    return {
        "streams": [
            {
                "index": 0,
                "codec_name": "h264",
                "codec_type": "video",
                "width": 1080,
                "height": 1920,
                "r_frame_rate": "30/1",
                "avg_frame_rate": "30/1",
                "pix_fmt": "yuv420p",
                "duration": "72.000000",
                "nb_frames": "2160",
            },
            {
                "index": 1,
                "codec_name": "aac",
                "codec_type": "audio",
                "channels": 2,
                "sample_rate": "44100",
                "duration": "72.000000",
            },
        ],
        "format": {
            "filename": "output/videos/quiz_video_1.mp4",
            "nb_streams": 2,
            "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
            "duration": "72.000000",
            "size": "24150000",
            "bit_rate": "2683333",
        },
    }


@pytest.fixture
def mock_ffprobe_short_mp4(mock_ffprobe_valid_mp4: Dict[str, Any]) -> Dict[str, Any]:
    """Mock ffprobe output for a 58.0s video that must trigger hard rejection (< 62.0s floor)."""
    short = json.loads(json.dumps(mock_ffprobe_valid_mp4))
    short["streams"][0]["duration"] = "58.000000"
    short["streams"][0]["nb_frames"] = "1740"
    short["streams"][1]["duration"] = "58.000000"
    short["format"]["duration"] = "58.000000"
    return short


@pytest.fixture
def mock_ffprobe_invalid_resolution(mock_ffprobe_valid_mp4: Dict[str, Any]) -> Dict[str, Any]:
    """Mock ffprobe output with landscape 1920x1080 (violating 9:16 vertical requirement)."""
    invalid = json.loads(json.dumps(mock_ffprobe_valid_mp4))
    invalid["streams"][0]["width"] = 1920
    invalid["streams"][0]["height"] = 1080
    return invalid


@pytest.fixture
def mock_ffprobe_no_audio(mock_ffprobe_valid_mp4: Dict[str, Any]) -> Dict[str, Any]:
    """Mock ffprobe output missing audio stream entirely."""
    invalid = json.loads(json.dumps(mock_ffprobe_valid_mp4))
    invalid["streams"] = [invalid["streams"][0]]
    invalid["format"]["nb_streams"] = 1
    return invalid


# ---------------------------------------------------------------------------
# Tier 1 & 2 Fixtures: R3 Playwright Browser & Profile Doubles
# ---------------------------------------------------------------------------

@pytest.fixture
def temp_session_dir(tmp_path: Path) -> Path:
    """Temporary persistent session directory simulating `.tiktok_session/@bussinessmasterbr`."""
    profile_dir = tmp_path / ".tiktok_session" / "@bussinessmasterbr"
    profile_dir.mkdir(parents=True, exist_ok=True)
    
    # Write mock storage_state.json
    storage_state = {
        "cookies": [
            {
                "name": "sessionid",
                "value": "mock_auth_token_bussinessmasterbr_xyz",
                "domain": ".tiktok.com",
                "path": "/",
                "expires": 1893456000,
                "httpOnly": True,
                "secure": True,
            }
        ],
        "origins": [
            {
                "origin": "https://www.tiktok.com",
                "localStorage": [{"name": "user_id", "value": "bussinessmasterbr"}],
            }
        ],
    }
    (profile_dir / "storage_state.json").write_text(json.dumps(storage_state), encoding="utf-8")
    return profile_dir


@pytest.fixture
def mock_playwright_page() -> MagicMock:
    """Mock Playwright Page object simulating resilient DOM interaction in TikTok Studio."""
    page = MagicMock()
    page.url = "https://www.tiktok.com/creator-center/upload"

    # Mock locators
    file_input = MagicMock()
    caption_editor = MagicMock()
    schedule_switch = MagicMock()
    date_picker = MagicMock()
    time_picker = MagicMock()
    submit_button = MagicMock()

    def locator_side_effect(selector: str, *args, **kwargs):
        loc = MagicMock()
        if "file" in selector:
            return file_input
        elif "contenteditable" in selector or "caption" in selector:
            return caption_editor
        elif "switch" in selector or "schedule" in selector.lower() or "checkbox" in selector:
            return schedule_switch
        elif "date" in selector:
            return date_picker
        elif "time" in selector:
            return time_picker
        elif "button" in selector:
            return submit_button
        return loc

    page.locator.side_effect = locator_side_effect
    return page
