"""Procedurally synthesize the episode sound design (no third-party samples).

Writes 48 kHz stereo WAVs into public/assets/sfx/. Deterministic (fixed seed).
Usage: python3 scripts/generate-sfx.py [duration_seconds_for_bed]
"""
import json, os, sys, wave
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
    cutoff = 250 + 2600 * np.sin(np.pi * p) ** 2  # soft, airy — no hiss
    band = onepole_lp(noise, cutoff) - onepole_lp(noise, cutoff * 0.25)
    env = np.sin(np.pi * p) ** 2 * (1 - p) ** 0.4
    return band * env


def tick(sec=0.07, f=2300):
    n = t(sec)
    return np.sin(2 * np.pi * f * n) * np.exp(-n * 90) + 0.3 * np.sin(2 * np.pi * f * 2.01 * n) * np.exp(-n * 140)


def confirm(sec=0.9):
    n = t(sec); x = np.zeros(len(n))
    for f, d, a in ((784, 0.0, 0.7), (1175, 0.07, 0.55), (1568, 0.14, 0.35)):
        m = n >= d; k = n[m] - d
        x[m] += a * np.sin(2 * np.pi * f * k) * np.exp(-k * 6) * (1 - np.exp(-k * 400))
    return x


# ---- Chart sounds: one distinct, tonal (D minor) cue per chart -----------------------------

def note(f, sec, decay=7.0, partials=((1, 1.0), (4.0, 0.18), (10.0, 0.05))):
    """Soft mallet / marimba-like note."""
    n = t(sec)
    x = sum(a * np.sin(2 * np.pi * f * k * n) * np.exp(-n * decay * (1 + 0.6 * (k - 1))) for k, a in partials)
    return x * (1 - np.exp(-n * 600))


def place(total, events):
    """Mix (offset_seconds, signal) events into one buffer."""
    out = np.zeros(int(SR * total))
    for off, sig in events:
        a = int(off * SR); b = min(len(out), a + len(sig)); out[a:b] += sig[: b - a]
    return out


def pan_lr(x, start=-0.8, end=0.8):
    p = np.linspace(start, end, len(x))
    return np.stack([x * np.sqrt((1 - p) / 2), x * np.sqrt((1 + p) / 2)], 1)


def market_fall(sec=1.1):
    """Red Steam curve falling: exponential pitch glide down + soft low thump."""
    n = t(sec)
    f = 880 * (220 / 880) ** (n / sec)
    glide = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * 2.2) * (1 - np.exp(-n * 200))
    thump = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-n * 6) + 40) / SR) * np.exp(-n * 7) * 0.6
    return glide * 0.7 + thump


def ladder_rise():
    """Gold bars growing: ascending D minor pentatonic mallets."""
    freqs = (293.66, 349.23, 392.0, 440.0, 523.25, 587.33)
    return place(1.9, [(i * 0.2, note(f, 0.7) * (0.6 + 0.08 * i)) for i, f in enumerate(freqs)])


def chart_trace(sec=2.4, chart_path=None):
    """12-month chart drawing: a "data melody" — one soft pluck per month, pitch from the real
    monthly median price (data/day01.chart.json), quantized to D minor pentatonic, panned L→R."""
    path = chart_path or os.path.join(os.path.dirname(__file__), "..", "data", "day01.chart.json")
    series = json.load(open(path))["series"]
    months = {}
    for pt in series:
        months.setdefault(pt["date"][:7], []).append(pt["rub"])
    prices = [float(np.mean(v)) for _, v in sorted(months.items())][-12:]
    lo, hi = min(prices), max(prices)
    scale = [146.83, 174.61, 196.0, 220.0, 261.63, 293.66, 349.23, 392.0, 440.0, 523.25]
    ev = []
    for i, pr in enumerate(prices):
        f = scale[round((pr - lo) / (hi - lo) * (len(scale) - 1))]
        ev.append((0.15 + i * (sec - 0.5) / (len(prices) - 1), note(f, 0.5, decay=9, partials=((1, 1.0), (2.0, 0.25), (3.0, 0.08))) * 0.6))
    mono = place(sec + 0.5, ev)
    return pan_lr(mono, -0.6, 0.6)


def ladder_run(sec=2.3):
    """Cascade of bars to day 30: quick, quiet rising arpeggio."""
    scale = (293.66, 349.23, 392.0, 440.0, 523.25)
    ev = []
    for i in range(14):
        f = scale[i % 5] * (2 ** (i // 5))
        ev.append((i * 0.15, note(f, 0.35, decay=11) * (0.35 + 0.035 * i)))
    return place(sec + 0.4, ev)


def cumulative_swell(sec=2.86, tail=1.4):
    """Cumulative curve to 2 775: pad swell that opens up and lands on a soft bell."""
    n = t(sec)
    pad = sum(np.sin(2 * np.pi * f * n) for f in (146.83, 220.0, 293.66, 349.23)) / 4
    pad = onepole_lp(pad, 300 + 3000 * (n / sec) ** 2) * (n / sec) ** 1.6
    bell = note(587.33, tail, decay=3.0, partials=((1, 1.0), (2.76, 0.4), (5.4, 0.15))) + note(880.0, tail, decay=3.5) * 0.5
    return place(sec + tail, [(0, pad * 1.3), (sec, bell * 0.8)])


def mini_down():
    return place(0.6, [(0, note(659.25, 0.3, 14)), (0.13, note(493.88, 0.4, 12))])


def mini_up():
    return place(0.6, [(0, note(493.88, 0.3, 14)), (0.13, note(659.25, 0.4, 12))])


def bed(sec):
    """Quiet dark pad: D minor-ish sine stack with slow movement. No rhythmic pulse (nothing repetitive under the voice)."""
    n = t(sec); x = np.zeros(len(n))
    for f, a in ((73.42, 0.5), (110.0, 0.32), (146.83, 0.22), (174.61, 0.12), (220.0, 0.08)):
        lfo = 1 + 0.004 * np.sin(2 * np.pi * 0.11 * n + f)
        x += a * np.sin(2 * np.pi * f * lfo * n) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * n + f))
    fade = np.minimum(1, n / 0.6) * np.minimum(1, (sec - n) / 1.5)
    return x * fade


if __name__ == "__main__":
    dur = float(sys.argv[1]) if len(sys.argv) > 1 else 44.1
    write("whoosh.wav", whoosh(), 1)
    write("whoosh-short.wav", whoosh(0.28), 1)
    write("tick.wav", tick())
    write("confirm.wav", confirm(), 1)
    write("chart-market-fall.wav", market_fall())
    write("chart-ladder-rise.wav", ladder_rise(), 1)
    write("chart-trace.wav", chart_trace())
    for name, f in (("20", 440.0), ("25", 523.25), ("30", 587.33)):
        write(f"chart-bar-{name}.wav", note(f, 0.8), 1)
    write("chart-ladder-run.wav", ladder_run(), 1)
    write("chart-cumulative.wav", cumulative_swell(), 1)
    write("chart-mini-down.wav", mini_down())
    write("chart-mini-up.wav", mini_up())
    write("bed.wav", bed(dur), 1)
    print("sfx written to", os.path.abspath(OUT))
