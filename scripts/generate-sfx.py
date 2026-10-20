"""Procedurally synthesize the episode sound design (no third-party samples).

Writes 48 kHz stereo WAVs into public/assets/sfx/. Deterministic (fixed seed).
Usage: python3 scripts/generate-sfx.py [duration_seconds_for_bed]
"""
import os, sys, wave
import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "sfx")
rng = np.random.default_rng(7)


def write(name, x, width=0.0):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        # subtle stereo width via a tiny delay on the right channel
        d = int(SR * 0.004 * width)
        l, r = x, np.concatenate([np.zeros(d), x[: len(x) - d]]) if d else x
        x = np.stack([l, r], 1)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.89
    pcm = (x * 32767).astype("<i2")
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


def t(sec):
    return np.arange(int(SR * sec)) / SR


def onepole_lp(x, cutoff):
    """Time-varying one-pole low-pass; cutoff may be an array (Hz)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def whoosh(sec=0.5):
    n = t(sec); p = n / sec
    noise = rng.standard_normal(len(n))
    cutoff = 300 + 5200 * np.sin(np.pi * p) ** 2
    band = onepole_lp(noise, cutoff) - onepole_lp(noise, cutoff * 0.25)
    env = np.sin(np.pi * p) ** 2 * (1 - p) ** 0.4
    return band * env


def impact(sec=1.3):
    n = t(sec)
    f = 38 + 70 * np.exp(-n * 18)  # pitch drop
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * 3.2)
    click = onepole_lp(rng.standard_normal(len(n)), 2400) * np.exp(-n * 60) * 0.6
    tail = onepole_lp(rng.standard_normal(len(n)), 600) * np.exp(-n * 5) * 0.25
    return np.tanh(1.6 * (body + click + tail))


def tick(sec=0.07, f=2300):
    n = t(sec)
    return np.sin(2 * np.pi * f * n) * np.exp(-n * 90) + 0.3 * np.sin(2 * np.pi * f * 2.01 * n) * np.exp(-n * 140)


def confirm(sec=0.9):
    n = t(sec); x = np.zeros(len(n))
    for f, d, a in ((784, 0.0, 0.7), (1175, 0.07, 0.55), (1568, 0.14, 0.35)):
        m = n >= d; k = n[m] - d
        x[m] += a * np.sin(2 * np.pi * f * k) * np.exp(-k * 6) * (1 - np.exp(-k * 400))
    return x


def riser(sec=1.2):
    n = t(sec); p = n / sec
    noise = rng.standard_normal(len(n))
    band = onepole_lp(noise, 200 + 6000 * p ** 2)
    tone = np.sin(2 * np.pi * np.cumsum(180 + 520 * p ** 2) / SR) * 0.25
    return (band * 0.6 + tone) * p ** 2.2


def counter_roll(sec=1.6, start_rate=9, end_rate=26):
    n = t(sec); x = np.zeros(len(n)); tk = tick(0.04, 2900)
    pos, i = 0.0, 0
    while pos < sec - 0.05:
        rate = start_rate + (end_rate - start_rate) * pos / sec
        s = int(pos * SR); x[s:s + len(tk)] += tk[: len(x) - s] * (0.35 + 0.4 * pos / sec)
        pos += 1 / rate; i += 1
    return x


def bed(sec):
    """Quiet dark pad: D minor-ish sine stack, slow movement, low-passed, plus a soft pulse."""
    n = t(sec); x = np.zeros(len(n))
    for f, a in ((73.42, 0.5), (110.0, 0.32), (146.83, 0.22), (174.61, 0.12), (220.0, 0.08)):
        lfo = 1 + 0.004 * np.sin(2 * np.pi * 0.11 * n + f)
        x += a * np.sin(2 * np.pi * f * lfo * n) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * n + f))
    beat = 60 / 96
    ph = (n % beat) / beat
    pulse = np.sin(2 * np.pi * 52 * n) * np.exp(-ph * beat * 9) * 0.35
    x = x + pulse
    fade = np.minimum(1, n / 0.6) * np.minimum(1, (sec - n) / 1.5)
    return x * fade


if __name__ == "__main__":
    dur = float(sys.argv[1]) if len(sys.argv) > 1 else 44.1
    write("whoosh.wav", whoosh(), 1)
    write("whoosh-short.wav", whoosh(0.28), 1)
    write("impact.wav", impact())
    write("tick.wav", tick())
    write("confirm.wav", confirm(), 1)
    write("riser.wav", riser(), 1)
    write("counter.wav", counter_roll())
    write("bed.wav", bed(dur), 1)
    print("sfx written to", os.path.abspath(OUT))
