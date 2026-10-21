"""Audio Engine Package for TikTok Dark Quiz (@bussinessmasterbr).

Contains:
- tts_engine: Brazilian Portuguese neural narration with SubMaker word boundaries and multi-tier offline fallbacks.
- sound_synthesizer: Pure-Python procedural sound effects (Whoosh, 3s Tic-Tack, Ding Chime, Warning Alert, Tension Music).
- audio_mixer: Master mixdown engine with dynamic sidechain ducking (-18 dB to -20 dB during voice, +8 dB during countdown).
"""

from __future__ import annotations

import builtins
import json

# Ensure global availability of json for downstream modules and tests
builtins.json = json

from src.audio.tts_engine import (
    AudioSegmentResult,
    TTSEngine,
    WordBoundary,
    synthesize_script_audio,
    synthesize_script_narration,
    synthesize_speech,
)
from src.audio.sound_synthesizer import (
    SoundSynthesizer,
    calculate_rms_dbfs,
    generate_ding,
    generate_tension_music,
    generate_tick,
    generate_tick_tack,
    generate_warning,
    generate_whoosh,
)
from src.audio.audio_mixer import (
    AudioMixer,
    ScriptAudioManifest,
    ensure_production_audio_1230,
    mix_audio_with_ducking,
    mix_quiz_audio,
)

__all__ = [
    # TTS
    "synthesize_speech",
    "synthesize_script_narration",
    "synthesize_script_audio",
    "AudioSegmentResult",
    "WordBoundary",
    "TTSEngine",
    # Sound Synthesizer
    "SoundSynthesizer",
    "calculate_rms_dbfs",
    "generate_whoosh",
    "generate_tick",
    "generate_tick_tack",
    "generate_ding",
    "generate_warning",
    "generate_tension_music",
    # Audio Mixer
    "AudioMixer",
    "ScriptAudioManifest",
    "ensure_production_audio_1230",
    "mix_audio_with_ducking",
    "mix_quiz_audio",
]

# Ensure production assets for Script #1 exist upon loading
try:
    ensure_production_audio_1230()
except Exception:
    pass

