"""Synthesise the soft transition swish used by the footage-first cut: python3 scripts/make_swish.py out.wav"""
import sys, wave
import numpy as np

SR = 44100
D = 1.1
n = int(SR * D)
t = np.arange(n) / SR
rng = np.random.default_rng(7)
noise = rng.standard_normal(n)

# band-pass sweep (state-variable filter): 250 Hz -> 1.4 kHz -> 450 Hz; soft, no hiss
peak = 0.45
rise = np.clip(t / peak, 0, 1)
fall = np.clip((t - peak) / (D - peak), 0, 1)
fc = np.where(t < peak, 250 + (1400 - 250) * rise**1.5, 1400 - (1400 - 450) * fall**0.8)
q = 0.32
low = band = 0.0
out = np.empty(n)
for i in range(n):
    f = 2 * np.sin(np.pi * fc[i] / SR)
    high = noise[i] - low - q * band
    band += f * high
    low += f * band
    out[i] = band

# one-pole low-pass at ~3.5 kHz takes the hiss off the top
a = np.exp(-2 * np.pi * 3500 / SR)
lp = 0.0
for i in range(n):
    lp = (1 - a) * out[i] + a * lp
    out[i] = lp

# smooth swell envelope, quiet low-mid body
env = np.sin(np.pi * np.clip(t / D, 0, 1)) ** 2.2
out *= env
out /= np.max(np.abs(out)) + 1e-9
out *= 0.7

# gentle left -> right movement
pan = np.clip(t / D, 0, 1)
left = out * np.cos(pan * np.pi / 2 * 0.8 + 0.1)
right = out * np.sin(pan * np.pi / 2 * 0.8 + 0.1)
stereo = (np.stack([left, right], axis=1) * 32767).astype(np.int16)

with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
