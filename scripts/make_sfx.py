"""Synthesise the TrueDad sound kit (no swishes): python3 scripts/make_sfx.py public/news/sfx
boom.wav    soft cinematic impact for an opening title (sub drop + air tail)
shimmer.wav glassy sparkle for a light sweep over an object
click.wav   UI mouse click, synced to real clicks in the recording
key.wav     soft keyboard tap, synced to real typing in the recording
"""
import sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(11)
out_dir = sys.argv[1]


def write(name, left, right=None):
    right = left if right is None else right
    st = np.stack([left, right], axis=1)
    st = st / (np.max(np.abs(st)) + 1e-9) * 0.8
    with wave.open(f'{out_dir}/{name}', 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def t_axis(d):
    return np.arange(int(SR * d)) / SR


# boom: pitch-dropping sub + short soft transient + long airy tail
t = t_axis(2.4)
freq = 58 * np.exp(-t * 0.9) + 34
phase = 2 * np.pi * np.cumsum(freq) / SR
sub = np.sin(phase) * np.exp(-t * 2.2)
trans = lowpass(rng.standard_normal(len(t)), 900) * np.exp(-t * 28) * 1.6
air = lowpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 1.7) * 0.18
attack = np.clip(t / 0.012, 0, 1)
boom = (sub * 1.0 + trans + air) * attack
write('boom.wav', boom)

# shimmer: random high sine grains, slowly panned
t = t_axis(1.6)
sh_l = np.zeros(len(t))
sh_r = np.zeros(len(t))
for _ in range(38):
    start = rng.uniform(0, 1.0)
    f = rng.choice([2093, 2637, 3136, 3520, 4186, 5274])
    d = rng.uniform(0.25, 0.6)
    g = np.where(t >= start, np.sin(2 * np.pi * f * (t - start)) * np.exp(-(t - start) / d * 4), 0)
    p = rng.uniform(0.2, 0.8)
    sh_l += g * (1 - p)
    sh_r += g * p
env = np.sin(np.pi * np.clip(t / 1.6, 0, 1)) ** 0.8
write('shimmer.wav', sh_l * env, sh_r * env)

# click: tight mid-high transient with a tiny body
t = t_axis(0.06)
n = rng.standard_normal(len(t))
click = (n - lowpass(n, 1800)) * np.exp(-t * 260) + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 120) * 0.5
write('click.wav', click)

# key: softer, duller tap
t = t_axis(0.07)
n = rng.standard_normal(len(t))
key = lowpass(n, 3200) * np.exp(-t * 180) + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 90) * 0.35
write('key.wav', key)
