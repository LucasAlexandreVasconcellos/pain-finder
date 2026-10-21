"""Pure-Python Procedural Sound Generator for TikTok Dark Quiz (@bussinessmasterbr).

Produces standard-compliant 16-bit 44.1 kHz stereo PCM WAV sound effects and
cinematic tension background music using only Python standard libraries
(wave, math, struct). Zero external C/binary dependencies.

Sound Design Specs:
- Whoosh (0.35s): Exponential frequency sweep with Hann window envelope.
- Tick (0.08s) / Tick-Tack (3.0s): 3 dry mechanical clock ticks at 1.0s, 2.0s (1200Hz)
  and higher-pitch urgency click at 3.0s (1600Hz).
- Ding Chime (1.2s): Bright C6-E6-G6-C7 harmonic chord with exponential decay.
- Warning Alert (0.8s): Dissonant minor semitone alarm (A4/Bb4 + 55Hz sub-bass) for trap Q5.
- Tension Music (65s-80s, default 72.0s): Ambient cinematic tension drone + heartbeat loop.
"""

from __future__ import annotations

import builtins
import io
import json
import math
from pathlib import Path
import struct
from typing import List, Optional, Tuple, Union
import wave

# Ensure json is accessible globally
builtins.json = json

__all__ = [
    "SoundSynthesizer",
    "generate_whoosh",
    "generate_tick",
    "generate_tick_tack",
    "generate_ding",
    "generate_warning",
    "generate_tension_music",
    "calculate_rms_dbfs",
]


def calculate_rms_dbfs(wav_bytes: bytes) -> Tuple[float, float]:
    """Calculates RMS amplitude in dBFS and duration in seconds from 16-bit PCM WAV bytes."""
    with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
        n_channels = wf.getnchannels()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        if n_frames == 0:
            return -100.0, 0.0

        duration_s = n_frames / float(framerate)
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


def _build_wav_bytes(
    samples_left: List[float],
    samples_right: List[float],
    sample_rate: int = 44100,
) -> bytes:
    """Encodes left and right float samples (-1.0 to 1.0) into 16-bit stereo PCM WAV bytes."""
    num_frames = min(len(samples_left), len(samples_right))
    buffer = io.BytesIO()

    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)

        # Chunked packing for high speed and minimal memory
        chunk_size = 4096
        for start_idx in range(0, num_frames, chunk_size):
            end_idx = min(start_idx + chunk_size, num_frames)
            count = end_idx - start_idx
            chunk_samples: List[int] = []

            for i in range(start_idx, end_idx):
                l_val = samples_left[i]
                r_val = samples_right[i]

                # Soft clipping protection
                if l_val > 0.95:
                    l_val = 0.95 + 0.05 * math.tanh((l_val - 0.95) / 0.05)
                elif l_val < -0.95:
                    l_val = -0.95 + 0.05 * math.tanh((l_val + 0.95) / 0.05)

                if r_val > 0.95:
                    r_val = 0.95 + 0.05 * math.tanh((r_val - 0.95) / 0.05)
                elif r_val < -0.95:
                    r_val = -0.95 + 0.05 * math.tanh((r_val + 0.95) / 0.05)

                int_l = int(max(-32767.0, min(32767.0, l_val * 32767.0)))
                int_r = int(max(-32767.0, min(32767.0, r_val * 32767.0)))
                chunk_samples.append(int_l)
                chunk_samples.append(int_r)

            fmt = f"<{count * 2}h"
            wf.writeframes(struct.pack(fmt, *chunk_samples))

    return buffer.getvalue()


def _handle_output(
    wav_bytes: bytes,
    output_path: Optional[Union[str, Path]],
) -> Union[bytes, Path]:
    """Writes to file if output_path is provided, returning Path; otherwise returns bytes."""
    if output_path is not None:
        p = Path(output_path)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(wav_bytes)
        return p
    return wav_bytes


def generate_whoosh(
    output_path: Optional[Union[str, Path]] = None,
    duration: float = 0.35,
    sample_rate: int = 44100,
    amplitude: float = 0.70,
) -> Union[bytes, Path]:
    """Generates an aerodynamic whoosh sound with exponential frequency sweep and Hann window."""
    total_frames = int(duration * sample_rate)
    left_samples: List[float] = [0.0] * total_frames
    right_samples: List[float] = [0.0] * total_frames

    f_start = 130.0
    f_end = 980.0
    log_ratio = math.log(f_end / f_start)

    # Deterministic pseudo-random seed state for white noise texture
    lfsr = 0xACE1

    phase = 0.0
    for i in range(total_frames):
        t = i / float(sample_rate)
        t_norm = t / duration

        # Hann window envelope
        hann = math.sin(math.pi * t_norm) ** 2

        # Exponential frequency sweep
        freq = f_start * math.exp(log_ratio * t_norm)
        phase += 2.0 * math.pi * freq * (1.0 / sample_rate)

        # Swept tone + subtle 2nd harmonic
        tone = 0.65 * math.sin(phase) + 0.25 * math.sin(2.0 * phase)

        # Filtered white noise texture
        lfsr = ((lfsr >> 1) ^ (-(lfsr & 1) & 0xB400)) & 0xFFFF
        noise = ((lfsr / 32768.0) - 1.0) * 0.30

        combined = (tone + noise) * hann * amplitude

        # Stereo pan from left to right (spatial motion)
        left_gain = math.cos(0.5 * math.pi * t_norm)
        right_gain = math.sin(0.5 * math.pi * t_norm)

        left_samples[i] = combined * left_gain
        right_samples[i] = combined * right_gain

    wav_bytes = _build_wav_bytes(left_samples, right_samples, sample_rate)
    return _handle_output(wav_bytes, output_path)


def generate_tick(
    output_path: Optional[Union[str, Path]] = None,
    freq: float = 1200.0,
    duration: float = 0.08,
    sample_rate: int = 44100,
    amplitude: float = 0.75,
) -> Union[bytes, Path]:
    """Generates a single dry mechanical clock tick with fast exponential decay."""
    total_frames = int(duration * sample_rate)
    left_samples: List[float] = [0.0] * total_frames
    right_samples: List[float] = [0.0] * total_frames

    lfsr = 0x55AA
    for i in range(total_frames):
        t = i / float(sample_rate)
        # Fast mechanical decay
        env = math.exp(-70.0 * t)

        # Core click frequency
        sine_val = math.sin(2.0 * math.pi * freq * t)

        # Initial transient impact noise (first 4 ms)
        noise = 0.0
        if t < 0.005:
            lfsr = ((lfsr >> 1) ^ (-(lfsr & 1) & 0xB400)) & 0xFFFF
            noise = ((lfsr / 32768.0) - 1.0) * (1.0 - t / 0.005) * 0.5

        val = (sine_val * 0.75 + noise) * env * amplitude
        left_samples[i] = val
        right_samples[i] = val

    wav_bytes = _build_wav_bytes(left_samples, right_samples, sample_rate)
    return _handle_output(wav_bytes, output_path)


def generate_tick_tack(
    output_path: Optional[Union[str, Path]] = None,
    duration: float = 3.0,
    sample_rate: int = 44100,
    amplitude: float = 0.65,
) -> Union[bytes, Path]:
    """Generates 3 dry mechanical clock ticks at 1.0s, 2.0s (1200Hz) and higher-pitch click at 3.0s (1600Hz)."""
    total_frames = int(duration * sample_rate)
    left_samples: List[float] = [0.0] * total_frames
    right_samples: List[float] = [0.0] * total_frames

    # Ticks placed at:
    # 1.0s (1200 Hz) - Tick 1
    # 2.0s (1200 Hz) - Tick 2
    # 2.92s (1600 Hz, duration 0.08s -> ends at 3.0s) - Urgent Tick 3
    tick_events = [
        (1.00, 1200.0, 0.08, 0.75),
        (2.00, 1200.0, 0.08, 0.75),
        (2.92, 1600.0, 0.08, 0.90),
    ]

    for start_time, freq, tick_dur, tick_amp in tick_events:
        start_idx = int(start_time * sample_rate)
        tick_frames = int(tick_dur * sample_rate)

        lfsr = 0x1234
        for i in range(tick_frames):
            idx = start_idx + i
            if idx >= total_frames:
                break
            t = i / float(sample_rate)
            env = math.exp(-65.0 * t)
            sine_val = math.sin(2.0 * math.pi * freq * t)
            # Transient
            noise = 0.0
            if t < 0.004:
                lfsr = ((lfsr >> 1) ^ (-(lfsr & 1) & 0xB400)) & 0xFFFF
                noise = ((lfsr / 32768.0) - 1.0) * (1.0 - t / 0.004) * 0.45

            sample_val = (sine_val * 0.75 + noise) * env * tick_amp * amplitude
            left_samples[idx] += sample_val
            right_samples[idx] += sample_val

    wav_bytes = _build_wav_bytes(left_samples, right_samples, sample_rate)
    return _handle_output(wav_bytes, output_path)


def generate_ding(
    output_path: Optional[Union[str, Path]] = None,
    duration: float = 1.2,
    sample_rate: int = 44100,
    amplitude: float = 0.80,
) -> Union[bytes, Path]:
    """Generates a bright C6-E6-G6 harmonic chord chime with exponential decay for answer reveal."""
    total_frames = int(duration * sample_rate)
    left_samples: List[float] = [0.0] * total_frames
    right_samples: List[float] = [0.0] * total_frames

    # Harmonic partials of C6 major chord
    # C6: 1046.50 Hz, E6: 1318.51 Hz, G6: 1567.98 Hz, C7: 2093.00 Hz
    partials = [
        (1046.50, 0.40, 3.2),
        (1318.51, 0.30, 3.5),
        (1567.98, 0.20, 3.8),
        (2093.00, 0.10, 4.2),
    ]

    for i in range(total_frames):
        t = i / float(sample_rate)

        # 5 ms linear attack to avoid initial click
        attack = min(1.0, t / 0.005)

        sample_val = 0.0
        for freq, weight, decay_rate in partials:
            decay = math.exp(-decay_rate * t)
            sample_val += weight * math.sin(2.0 * math.pi * freq * t) * decay

        sample_val *= attack * amplitude

        # Subtle stereo width
        left_samples[i] = sample_val * 0.98
        right_samples[i] = sample_val * 1.02

    wav_bytes = _build_wav_bytes(left_samples, right_samples, sample_rate)
    return _handle_output(wav_bytes, output_path)


def generate_warning(
    output_path: Optional[Union[str, Path]] = None,
    duration: float = 0.8,
    sample_rate: int = 44100,
    amplitude: float = 0.85,
) -> Union[bytes, Path]:
    """Generates a dissonant minor semitone alarm (A4/Bb4 + sub-bass) for trap question Q5."""
    total_frames = int(duration * sample_rate)
    left_samples: List[float] = [0.0] * total_frames
    right_samples: List[float] = [0.0] * total_frames

    f1 = 440.00  # A4
    f2 = 466.16  # Bb4 (dissonant minor semitone)
    f_sub = 65.0  # Deep sub-bass punch

    for i in range(total_frames):
        t = i / float(sample_rate)

        # Quick attack, sustain, gradual release
        attack = min(1.0, t / 0.02)
        release = math.exp(-2.2 * t)
        env = attack * release

        # 12 Hz pulsing tremolo for urgency
        tremolo = 0.70 + 0.30 * math.sin(2.0 * math.pi * 12.0 * t)

        # Dissonant acoustic interference (beating)
        siren = 0.40 * math.sin(2.0 * math.pi * f1 * t) + 0.40 * math.sin(2.0 * math.pi * f2 * t)
        siren *= tremolo

        # Sub-bass punch
        sub = 0.45 * math.sin(2.0 * math.pi * f_sub * t) * math.exp(-5.0 * t)

        sample_val = (siren + sub) * env * amplitude
        left_samples[i] = sample_val
        right_samples[i] = sample_val

    wav_bytes = _build_wav_bytes(left_samples, right_samples, sample_rate)
    return _handle_output(wav_bytes, output_path)


def generate_tension_music(
    output_path: Optional[Union[str, Path]] = None,
    duration: float = 72.0,
    sample_rate: int = 44100,
    amplitude: float = 0.45,
) -> Union[bytes, Path]:
    """Generates an ambient cinematic tension drone + heartbeat loop for the full video (65s-80s)."""
    total_frames = int(duration * sample_rate)
    left_samples: List[float] = [0.0] * total_frames
    right_samples: List[float] = [0.0] * total_frames

    # Tonal foundation: Dark A-minor cinematic drone
    # A1 (55.0Hz), E2 (82.4Hz), A2 (110.0Hz), C3 (130.8Hz), E3 (164.8Hz), A3 (220.0Hz)
    drone_layers = [
        (55.00, 0.30, 0.0),    # Sub-bass root
        (82.41, 0.20, 0.4),    # Fifth
        (110.00, 0.25, 0.8),   # Mid root
        (130.81, 0.15, 1.2),   # Minor third (dark mood)
        (220.00, 0.10, 1.6),   # Octave harmonic
        (880.00, 0.04, 2.0),   # Tension shimmer
    ]

    for i in range(total_frames):
        t = i / float(sample_rate)

        # Slow LFO filter sweep (0.12 Hz)
        lfo = 0.85 + 0.15 * math.sin(2.0 * math.pi * 0.12 * t)

        # Ambient drone accumulation
        drone_val = 0.0
        for freq, weight, phase_offset in drone_layers:
            drone_val += weight * math.sin(2.0 * math.pi * freq * t + phase_offset)
        drone_val *= lfo

        # Heartbeat pulse every 1.0s
        t_mod = t % 1.0
        heartbeat = 0.0
        # Double pulse (lub-dub at 0.0s and 0.18s)
        if t_mod < 0.12:
            hb_env = math.sin(math.pi * (t_mod / 0.12))
            heartbeat += 0.35 * math.sin(2.0 * math.pi * 60.0 * t_mod) * hb_env
        elif 0.18 <= t_mod < 0.30:
            hb_env2 = math.sin(math.pi * ((t_mod - 0.18) / 0.12))
            heartbeat += 0.22 * math.sin(2.0 * math.pi * 55.0 * (t_mod - 0.18)) * hb_env2

        # Tension crescendo in the last 10 seconds (anticipation of final boss)
        crescendo = 1.0
        if t > (duration - 12.0):
            crescendo += 0.35 * ((t - (duration - 12.0)) / 12.0)

        total_signal = (drone_val + heartbeat) * crescendo * amplitude

        # Subtle stereo chorus effect
        left_samples[i] = total_signal * (1.0 + 0.08 * math.sin(2.0 * math.pi * 0.25 * t))
        right_samples[i] = total_signal * (1.0 - 0.08 * math.sin(2.0 * math.pi * 0.25 * t))

    wav_bytes = _build_wav_bytes(left_samples, right_samples, sample_rate)
    return _handle_output(wav_bytes, output_path)


class SoundSynthesizer:
    """Convenience class providing all procedural sound generators."""

    def __init__(self, sample_rate: int = 44100) -> None:
        self.sample_rate = sample_rate

    def whoosh(self, output_path: Optional[Union[str, Path]] = None, duration: float = 0.35) -> Union[bytes, Path]:
        return generate_whoosh(output_path, duration=duration, sample_rate=self.sample_rate)

    def tick(self, output_path: Optional[Union[str, Path]] = None, freq: float = 1200.0, duration: float = 0.08) -> Union[bytes, Path]:
        return generate_tick(output_path, freq=freq, duration=duration, sample_rate=self.sample_rate)

    def tick_tack(self, output_path: Optional[Union[str, Path]] = None, duration: float = 3.0) -> Union[bytes, Path]:
        return generate_tick_tack(output_path, duration=duration, sample_rate=self.sample_rate)

    def ding(self, output_path: Optional[Union[str, Path]] = None, duration: float = 1.2) -> Union[bytes, Path]:
        return generate_ding(output_path, duration=duration, sample_rate=self.sample_rate)

    def warning(self, output_path: Optional[Union[str, Path]] = None, duration: float = 0.8) -> Union[bytes, Path]:
        return generate_warning(output_path, duration=duration, sample_rate=self.sample_rate)

    def tension_music(self, output_path: Optional[Union[str, Path]] = None, duration: float = 72.0) -> Union[bytes, Path]:
        return generate_tension_music(output_path, duration=duration, sample_rate=self.sample_rate)
