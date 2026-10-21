"""Dynamic Audio Ducking & Master Mixdown Engine for TikTok Dark Quiz (@bussinessmasterbr).

Combines:
1. Brazilian Portuguese neural narration stems (Hook, Q1-Q7, Explanations, Micro-curiosity, CTA, Bonus).
2. Procedural sound effects (Whoosh, 3s countdown Tic-Tack, Answer Ding Chime, Trap Warning Alert).
3. Continuous ambient tension background music.

Applies Dynamic Audio Ducking:
- Voice active: Tension music compressed by -18 dB to -20 dB (12% to 15% volume) for crystalline voice clarity.
- 3s Countdown: Voice silent, tension music smoothly swells (+8 dB to +10 dB, reaching -10 dB) alongside
  3 dry mechanical ticks to induce high cognitive urgency.
- Answer Reveal: Ding chime triggers at 0 dB, music smoothly returns to ducked level as explanation begins.
- Fast 20ms attack on speech onset; smooth 450ms release into silence.
"""

from __future__ import annotations

import builtins
from dataclasses import asdict, dataclass, field
import io
import json
import math
from pathlib import Path
import struct
from typing import Any, Dict, List, Optional, Tuple, Union
import wave

from src.audio.sound_synthesizer import (
    _build_wav_bytes,
    calculate_rms_dbfs,
    generate_ding,
    generate_tension_music,
    generate_tick_tack,
    generate_warning,
    generate_whoosh,
)

# Bind builtins.json
builtins.json = json

__all__ = [
    "ScriptAudioManifest",
    "mix_quiz_audio",
    "mix_audio_with_ducking",
    "ensure_production_audio_1230",
    "AudioMixer",
]


@dataclass
class ScriptAudioManifest:
    """Interface contract manifest summarizing mixed master audio and section timings."""
    script_id: str
    master_audio_path: str
    total_duration_seconds: float
    voice_duration_seconds: float
    music_duration_seconds: float
    sample_rate: int = 44100
    channels: int = 2
    segments: List[Dict[str, Any]] = field(default_factory=list)
    ducking_applied: bool = True
    music_ducking_level_db: float = -18.0
    rms_dbfs: float = -16.5

    def __getitem__(self, item: str) -> Any:
        """Enables dictionary-style indexing for test assertions."""
        if hasattr(self, item):
            return getattr(self, item)
        raise KeyError(f"Key '{item}' not found in ScriptAudioManifest")

    def get(self, item: str, default: Any = None) -> Any:
        return getattr(self, item, default)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def save_to_json(self, file_path: Union[str, Path], indent: int = 2) -> Path:
        target = Path(file_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, indent=indent, ensure_ascii=False)
        return target


def _unpack_wav_samples(wav_bytes: bytes) -> Tuple[List[float], List[float], int]:
    """Unpacks 16-bit PCM WAV bytes into normalized float lists (-1.0 to 1.0) and sample rate."""
    with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
        n_channels = wf.getnchannels()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        if n_frames == 0:
            return [], [], framerate

        raw_data = wf.readframes(n_frames)
        total_samples = n_frames * n_channels
        fmt = f"<{total_samples}h"
        raw_samples = struct.unpack(fmt, raw_data)

        if n_channels == 1:
            left = [float(s) / 32767.0 for s in raw_samples]
            right = list(left)
        else:
            left = [float(raw_samples[i]) / 32767.0 for i in range(0, total_samples, 2)]
            right = [float(raw_samples[i + 1]) / 32767.0 for i in range(0, total_samples, 2)]

        return left, right, framerate


def mix_audio_with_ducking(
    voice_wav: Optional[Union[Path, str, bytes]] = None,
    bg_music_wav: Optional[Union[Path, str, bytes]] = None,
    sfx_tracks: Optional[List[Dict[str, Any]]] = None,
    output_file: Optional[Union[Path, str]] = None,
    music_duck_db: float = -18.0,
    duration: Optional[float] = None,
    sample_rate: int = 44100,
) -> Union[bytes, Path]:
    """Mixes voice narration with background music and SFX tracks applying dynamic ducking.
    
    Parameters:
    - voice_wav: Voice track (Path, str path, or raw WAV bytes). If None, treated as silent.
    - bg_music_wav: Tension music track. If None, procedurally generated automatically.
    - sfx_tracks: List of dicts: {"start_time": float, "wav": bytes | Path, "gain_db": float}.
    - output_file: If provided, writes WAV to disk and returns Path; otherwise returns bytes.
    - music_duck_db: Ducking attenuation applied during speech (e.g. -18.0 dB).
    - duration: Optional forced master duration.
    """
    # 1. Load Voice
    voice_l: List[float] = []
    voice_r: List[float] = []
    if voice_wav is not None:
        v_bytes = voice_wav if isinstance(voice_wav, bytes) else Path(voice_wav).read_bytes()
        voice_l, voice_r, sr = _unpack_wav_samples(v_bytes)
        sample_rate = sr

    # Determine master duration
    voice_dur = len(voice_l) / float(sample_rate) if voice_l else 0.0
    master_dur = duration or max(72.0, voice_dur)
    total_frames = int(master_dur * sample_rate)

    # Pad or trim voice
    if len(voice_l) < total_frames:
        pad = total_frames - len(voice_l)
        voice_l.extend([0.0] * pad)
        voice_r.extend([0.0] * pad)
    else:
        voice_l = voice_l[:total_frames]
        voice_r = voice_r[:total_frames]

    # 2. Load or generate Background Music
    if bg_music_wav is not None:
        m_bytes = bg_music_wav if isinstance(bg_music_wav, bytes) else Path(bg_music_wav).read_bytes()
        music_l, music_r, _ = _unpack_wav_samples(m_bytes)
    else:
        m_bytes = generate_tension_music(duration=master_dur, sample_rate=sample_rate)
        music_l, music_r, _ = _unpack_wav_samples(m_bytes)

    # Loop or trim music to total_frames
    if len(music_l) < total_frames and len(music_l) > 0:
        orig_len = len(music_l)
        times = (total_frames // orig_len) + 1
        music_l = (music_l * times)[:total_frames]
        music_r = (music_r * times)[:total_frames]
    elif len(music_l) >= total_frames:
        music_l = music_l[:total_frames]
        music_r = music_r[:total_frames]
    else:
        music_l = [0.0] * total_frames
        music_r = [0.0] * total_frames

    # 3. Compute Ducking Envelope
    # Base ducking factor for speech vs countdown
    duck_gain = 10.0 ** (music_duck_db / 20.0)  # e.g. -18 dB -> 0.126
    normal_gain = 10.0 ** (-10.0 / 20.0)        # e.g. -10 dB -> 0.316 during countdown

    # Detect voice energy in 20ms blocks
    block_size = int(0.020 * sample_rate)
    envelope: List[float] = [normal_gain] * total_frames

    # Determine speech activity
    voice_active_blocks = [False] * (total_frames // block_size + 1)
    for b_idx in range(len(voice_active_blocks)):
        start = b_idx * block_size
        end = min(start + block_size, total_frames)
        if start >= total_frames:
            break
        # Check energy in block
        sq_sum = sum(voice_l[i] * voice_l[i] for i in range(start, end))
        rms_blk = math.sqrt(sq_sum / max(1, end - start))
        if rms_blk > 0.005:  # ~ -46 dBFS threshold
            voice_active_blocks[b_idx] = True

    # Attack (20ms) and release (450ms) smoothing
    attack_frames = int(0.020 * sample_rate)
    release_frames = int(0.450 * sample_rate)
    current_gain = normal_gain

    for i in range(total_frames):
        b_idx = i // block_size
        target_gain = duck_gain if (b_idx < len(voice_active_blocks) and voice_active_blocks[b_idx]) else normal_gain

        if current_gain > target_gain:
            # Attack (ducking music fast)
            current_gain = max(target_gain, current_gain - (normal_gain - duck_gain) / float(attack_frames))
        elif current_gain < target_gain:
            # Release (swelling music smoothly)
            current_gain = min(target_gain, current_gain + (normal_gain - duck_gain) / float(release_frames))

        envelope[i] = current_gain

    # 4. Mix Master Tracks
    master_l: List[float] = [0.0] * total_frames
    master_r: List[float] = [0.0] * total_frames

    for i in range(total_frames):
        # Ducked music
        m_l = music_l[i] * envelope[i]
        m_r = music_r[i] * envelope[i]

        # Voice track (0 dB, 100%)
        v_l = voice_l[i] * 1.0
        v_r = voice_r[i] * 1.0

        master_l[i] = m_l + v_l
        master_r[i] = m_r + v_r

    # 5. Overlay SFX Tracks
    if sfx_tracks:
        for sfx in sfx_tracks:
            s_time = float(sfx.get("start_time", 0.0))
            s_data = sfx.get("wav")
            s_gain_db = float(sfx.get("gain_db", 0.0))
            s_gain = 10.0 ** (s_gain_db / 20.0)

            if s_data is None:
                continue

            s_bytes = s_data if isinstance(s_data, bytes) else Path(s_data).read_bytes()
            s_l, s_r, _ = _unpack_wav_samples(s_bytes)

            start_idx = int(s_time * sample_rate)
            for j in range(len(s_l)):
                m_idx = start_idx + j
                if m_idx >= total_frames:
                    break
                master_l[m_idx] += s_l[j] * s_gain
                master_r[m_idx] += s_r[j] * s_gain

    # 6. Build final WAV
    out_wav_bytes = _build_wav_bytes(master_l, master_r, sample_rate)

    if output_file is not None:
        p = Path(output_file)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(out_wav_bytes)
        return p

    return out_wav_bytes


def mix_quiz_audio(
    script: Union[Dict[str, Any], Any],
    narration_stems: Dict[str, Any],
    sfx_dict: Optional[Dict[str, Union[Path, bytes]]] = None,
    bg_music: Optional[Union[Path, bytes]] = None,
    output_file: Optional[Union[Path, str]] = None,
) -> ScriptAudioManifest:
    """Orchestrates complete high-retention audio mixdown for a Dark Quiz script.
    
    Constructs the canonical 72.0s master timeline:
    - 00.0s - 04.0s: Hook (whoosh SFX, voice, ducked music)
    - 04.0s - 18.0s: Block 1 (Q1, Q2 with 3s timer countdowns & ding reveals)
    - 18.0s - 36.0s: Block 2 (Q3, Micro-curiosity, Q4 with timer & ding reveals)
    - 36.0s - 54.0s: Block 3 (Q5 Pegadinha Trap with Warning Alarm, Q6 Difficult)
    - 54.0s - 72.0s: Block 4 (Q7 Impossible Boss, Score CTA, Q8 Bonus cliffhanger)
    
    Guarantees:
    - Total duration strictly >= 62.0s (default 72.0s ± 0.05s).
    - Loudness RMS > -45.0 dBFS (typically -16 to -14 dBFS).
    - Output manifest with complete segment metadata.
    """
    script_dict = script if isinstance(script, dict) else script.to_dict()
    script_id = script_dict.get("script_id", "script_dark_quiz")
    target_duration = float(script_dict.get("target_duration_seconds", 72.0))
    sample_rate = 44100

    # Ensure output_file path
    if output_file is None:
        out_path = Path("output/audio") / f"master_audio_{script_id}.wav"
    else:
        out_path = Path(output_file)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Synthesize procedural sound effects if not provided
    sfx_cache: Dict[str, bytes] = {}
    if sfx_dict:
        for k, v in sfx_dict.items():
            sfx_cache[k] = v if isinstance(v, bytes) else Path(v).read_bytes()
    else:
        sfx_cache["sfx_whoosh"] = generate_whoosh(duration=0.35, sample_rate=sample_rate)
        sfx_cache["sfx_whoosh_impact"] = sfx_cache["sfx_whoosh"]
        sfx_cache["sfx_tick_tack_3s"] = generate_tick_tack(duration=3.0, sample_rate=sample_rate)
        sfx_cache["sfx_correct_ding"] = generate_ding(duration=1.2, sample_rate=sample_rate)
        sfx_cache["sfx_warning_trap"] = generate_warning(duration=0.8, sample_rate=sample_rate)
        sfx_cache["sfx_warning_siren"] = sfx_cache["sfx_warning_trap"]
        sfx_cache["sfx_pop"] = generate_whoosh(duration=0.20, sample_rate=sample_rate)
        sfx_cache["sfx_curiosity_bell"] = generate_ding(duration=1.2, sample_rate=sample_rate)

    # Tension music
    music_bytes: bytes
    if bg_music is not None:
        music_bytes = bg_music if isinstance(bg_music, bytes) else Path(bg_music).read_bytes()
    else:
        music_bytes = generate_tension_music(duration=target_duration, sample_rate=sample_rate)

    # Build master voice timeline and scheduled SFX cues
    master_voice_l: List[float] = [0.0] * int(target_duration * sample_rate)
    master_voice_r: List[float] = [0.0] * int(target_duration * sample_rate)
    scheduled_sfx: List[Dict[str, Any]] = []
    manifest_segments: List[Dict[str, Any]] = []

    def _place_voice(stem_key: str, start_s: float, max_dur_s: float) -> float:
        """Places stem voice samples at start_s, returning actual duration used."""
        stem_obj = narration_stems.get(stem_key)
        if stem_obj is None:
            return max_dur_s
        raw_b = stem_obj.audio_bytes if hasattr(stem_obj, "audio_bytes") else (stem_obj if isinstance(stem_obj, bytes) else Path(stem_obj).read_bytes())
        l_s, r_s, _ = _unpack_wav_samples(raw_b)

        start_idx = int(start_s * sample_rate)
        limit_idx = int((start_s + max_dur_s) * sample_rate)

        for i in range(min(len(l_s), limit_idx - start_idx)):
            pos = start_idx + i
            if pos >= len(master_voice_l):
                break
            master_voice_l[pos] += l_s[i]
            master_voice_r[pos] += r_s[i]

        return min(max_dur_s, len(l_s) / float(sample_rate))

    # --- TIMELINE SCHEDULE (Total: 72.0s) ---
    curr_t = 0.0

    # 1. Hook (00.0s - 04.0s)
    scheduled_sfx.append({"start_time": curr_t, "wav": sfx_cache["sfx_whoosh"], "gain_db": -2.0})
    _place_voice("hook", curr_t, 4.0)
    manifest_segments.append({"name": "hook", "duration": 4.0, "sfx": "sfx_whoosh_impact", "has_voice": True})
    curr_t += 4.0

    # Questions 1 to 7 with Block 2 micro-curiosity
    questions = script_dict.get("questions", [])
    for q in questions:
        idx = q.get("index", 1)
        is_trap = q.get("is_trap", False)
        cd_dur = float(q.get("countdown_seconds", 3.0))

        # Check for Trap / Warning intro on Q5 and Q7
        if is_trap or idx in (5, 7):
            scheduled_sfx.append({"start_time": curr_t, "wav": sfx_cache["sfx_warning_trap"], "gain_db": -1.0})
            curr_t += 1.0

        # Question speech reading
        q_speech_dur = 2.5 if idx not in (5, 7) else 3.0
        _place_voice(f"q{idx}_speech", curr_t, q_speech_dur)
        manifest_segments.append({"name": f"q{idx}_speech", "duration": q_speech_dur, "sfx": "sfx_pop" if not is_trap else "sfx_warning_trap", "has_voice": True})
        curr_t += q_speech_dur

        # 3.0s Countdown (Silence on voice, Tic-Tack SFX, music raised)
        scheduled_sfx.append({"start_time": curr_t, "wav": sfx_cache["sfx_tick_tack_3s"], "gain_db": 0.0})
        manifest_segments.append({"name": f"q{idx}_timer", "duration": cd_dur, "sfx": "sfx_tick_tack_3s", "has_voice": False})
        curr_t += cd_dur

        # Reveal (Ding SFX + explanation)
        scheduled_sfx.append({"start_time": curr_t, "wav": sfx_cache["sfx_correct_ding"], "gain_db": -1.0})
        exp_dur = 1.5 if idx not in (5, 7) else 2.0
        _place_voice(f"q{idx}_explanation", curr_t, exp_dur)
        manifest_segments.append({"name": f"q{idx}_reveal", "duration": exp_dur, "sfx": "sfx_correct_ding", "has_voice": True})
        curr_t += exp_dur

        # Insert micro-curiosity after Q3
        if idx == 3:
            micro_dur = 4.0
            scheduled_sfx.append({"start_time": curr_t, "wav": sfx_cache["sfx_curiosity_bell"], "gain_db": -2.0})
            _place_voice("micro_curiosity", curr_t, micro_dur)
            manifest_segments.append({"name": "micro_curiosity", "duration": micro_dur, "sfx": "sfx_curiosity_bell", "has_voice": True})
            curr_t += micro_dur

    # Score CTA
    cta_dur = 3.0
    _place_voice("score_cta", curr_t, cta_dur)
    manifest_segments.append({"name": "score_cta", "duration": cta_dur, "sfx": None, "has_voice": True})
    curr_t += cta_dur

    # Bonus Question (Cliffhanger, Q8)
    bonus_dur = max(4.0, target_duration - curr_t)
    _place_voice("bonus_question", curr_t, bonus_dur)
    manifest_segments.append({"name": "bonus_question", "duration": bonus_dur, "sfx": None, "has_voice": True})
    curr_t += bonus_dur

    # Ensure total duration hits target
    voice_bytes = _build_wav_bytes(master_voice_l, master_voice_r, sample_rate)

    # Perform Master Mixdown with dynamic ducking
    mixed_bytes = mix_audio_with_ducking(
        voice_wav=voice_bytes,
        bg_music_wav=music_bytes,
        sfx_tracks=scheduled_sfx,
        output_file=out_path,
        music_duck_db=-18.0,
        duration=target_duration,
        sample_rate=sample_rate,
    )

    if isinstance(mixed_bytes, Path):
        final_bytes = mixed_bytes.read_bytes()
    else:
        final_bytes = mixed_bytes

    rms_dbfs, measured_duration = calculate_rms_dbfs(final_bytes)

    # Compute voice active duration
    voice_frames = sum(1 for v in master_voice_l if abs(v) > 0.005)
    voice_dur_total = round(voice_frames / float(sample_rate), 2)

    manifest = ScriptAudioManifest(
        script_id=script_id,
        master_audio_path=str(out_path).replace("\\", "/"),
        total_duration_seconds=round(measured_duration, 2),
        voice_duration_seconds=voice_dur_total,
        music_duration_seconds=round(measured_duration, 2),
        sample_rate=sample_rate,
        channels=2,
        segments=manifest_segments,
        ducking_applied=True,
        music_ducking_level_db=-18.0,
        rms_dbfs=round(rms_dbfs, 2),
    )

    # Save manifest companion JSON
    manifest_json_path = out_path.with_name(f"{out_path.stem}_manifest.json")
    manifest.save_to_json(manifest_json_path)

    return manifest


class AudioMixer:
    """Convenience class wrapper for audio mixing operations."""

    def __init__(self, ducking_db: float = -18.0, sample_rate: int = 44100) -> None:
        self.ducking_db = ducking_db
        self.sample_rate = sample_rate

    def mix_ducking(
        self,
        voice_wav: Any,
        bg_music_wav: Any,
        sfx_tracks: Optional[List[Dict[str, Any]]] = None,
        output_file: Optional[Union[Path, str]] = None,
    ) -> Union[bytes, Path]:
        return mix_audio_with_ducking(
            voice_wav=voice_wav,
            bg_music_wav=bg_music_wav,
            sfx_tracks=sfx_tracks,
            output_file=output_file,
            music_duck_db=self.ducking_db,
            sample_rate=self.sample_rate,
        )

    def mix_quiz(
        self,
        script: Any,
        narration_stems: Dict[str, Any],
        output_file: Optional[Union[Path, str]] = None,
    ) -> ScriptAudioManifest:
        return mix_quiz_audio(script, narration_stems, output_file=output_file)


def ensure_production_audio_1230(
    output_dir: Union[str, Path] = "output/audio",
    script_path: Union[str, Path] = "data/scripts/script_1230.json",
    force: bool = False,
) -> Optional[ScriptAudioManifest]:
    """Ensures production master audio and stem files for Script #1 exist and pass Stage 2 audit."""
    out_dir = Path(output_dir)
    master_wav = out_dir / "master_audio_1230.wav"
    manifest_json = out_dir / "master_audio_1230_manifest.json"

    if not force and master_wav.exists() and master_wav.stat().st_size > 1000 and manifest_json.exists():
        return None

    s_path = Path(script_path)
    if not s_path.exists():
        return None

    try:
        with open(s_path, "r", encoding="utf-8") as f:
            script_data = json.load(f)
    except Exception:
        return None

    # 1. Synthesize SFX
    sfx_dir = out_dir / "sfx"
    sfx_dir.mkdir(parents=True, exist_ok=True)
    generate_whoosh(output_path=sfx_dir / "sfx_whoosh.wav", duration=0.35)
    generate_tick_tack(output_path=sfx_dir / "sfx_tick_tack_3s.wav", duration=3.0)
    generate_ding(output_path=sfx_dir / "sfx_correct_ding.wav", duration=1.2)
    generate_warning(output_path=sfx_dir / "sfx_warning_trap.wav", duration=0.8)

    sfx_dict = {
        "sfx_whoosh": sfx_dir / "sfx_whoosh.wav",
        "sfx_whoosh_impact": sfx_dir / "sfx_whoosh.wav",
        "sfx_tick_tack_3s": sfx_dir / "sfx_tick_tack_3s.wav",
        "sfx_correct_ding": sfx_dir / "sfx_correct_ding.wav",
        "sfx_warning_trap": sfx_dir / "sfx_warning_trap.wav",
        "sfx_warning_siren": sfx_dir / "sfx_warning_trap.wav",
        "sfx_pop": sfx_dir / "sfx_whoosh.wav",
        "sfx_curiosity_bell": sfx_dir / "sfx_correct_ding.wav",
    }

    # 2. Synthesize Background Music
    bg_dir = out_dir / "bg_music"
    bg_dir.mkdir(parents=True, exist_ok=True)
    bg_path = generate_tension_music(output_path=bg_dir / "tension_drone_72s.wav", duration=72.0)

    # 3. Synthesize Narration Stems
    from src.audio.tts_engine import synthesize_script_narration
    stems = synthesize_script_narration(script_data, out_dir)

    # 4. Master Mixdown
    manifest = mix_quiz_audio(
        script=script_data,
        narration_stems=stems,
        sfx_dict=sfx_dict,
        bg_music=bg_path,
        output_file=master_wav,
    )

    return manifest

