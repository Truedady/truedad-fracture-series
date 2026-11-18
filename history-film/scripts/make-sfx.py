"""Синтез коротких звуков для анимаций и переходов (без сторонних сэмплов).
python scripts/make-sfx.py  ->  public/sfx/*.wav (48 кГц, 16 бит, стерео)"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(3)
n = lambda s: int(s * SR)
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f: sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)


def svf(x, fc, q=1.4):
    y = np.zeros_like(x); low = band = 0.0
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc[i], SR / 6) / SR)
        high = x[i] - low - band / q; band += f * high; low += f * band; y[i] = band
    return y


def whoosh(d, f0, f1, q=1.5):
    t = np.linspace(0, 1, n(d)); x = svf(rng.standard_normal(n(d)), f0 * (f1 / f0) ** t, q)
    return x * np.sin(np.pi * t) ** 1.4


def tone(f, d, dec):
    t = np.arange(n(d)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / dec) * np.minimum(1, t * 400)


def boom(f0, f1, d, dec):
    t = np.arange(n(d)) / SR; f = f1 + (f0 - f1) * np.exp(-t / 0.08)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / dec) + 0.4 * lp(rng.standard_normal(n(d)), 1500) * np.exp(-t / 0.01)


def clickn(d=0.03, f=3000):
    t = np.arange(n(d)) / SR
    return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.006) + 0.5 * hp(rng.standard_normal(n(d)), 2500) * np.exp(-t / 0.003)


def norm(x, peak=0.7):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    fade = min(len(x), 400); x[-fade:] *= np.linspace(1, 0, fade)
    return x


S = {
    'whoosh_short': norm(whoosh(0.45, 600, 4500, 1.8), 0.55),
    'whoosh_long': norm(whoosh(0.9, 250, 3800, 1.2), 0.55),
    'whoosh_down': norm(whoosh(0.7, 3500, 300, 1.2), 0.5),
    'tick': norm(clickn(0.04, 3200), 0.45),
    'pop': norm(tone(880, 0.25, 0.06) + 0.5 * tone(1320, 0.25, 0.04), 0.5),
    'blip': norm(tone(1318.5, 0.3, 0.08), 0.45),
    'thud': norm(boom(110, 45, 0.9, 0.25), 0.8),
    'lock': norm(np.concatenate([hp(rng.standard_normal(n(0.02)), 900), np.zeros(n(0.03)), hp(rng.standard_normal(n(0.03)), 1400)]) * 1.0 + np.pad(tone(160, 0.08, 0.03), (0, 0)), 0.6),
    'cash': norm(np.concatenate([tone(1568, 0.12, 0.05), tone(2093, 0.5, 0.15)]), 0.5),
    'riser': norm(whoosh(1.4, 200, 6000, 2.2) * np.linspace(0.2, 1, n(1.4)), 0.45),
    'rise_tone': norm(np.sin(2 * np.pi * np.cumsum(np.linspace(300, 900, n(1.2))) / SR) * np.sin(np.linspace(0, np.pi, n(1.2))) ** 0.6, 0.35),
    'drop': norm(np.sin(2 * np.pi * np.cumsum(np.linspace(700, 180, n(0.8))) / SR) * np.exp(-np.linspace(0, 3, n(0.8))), 0.45),
}
# «счётчик»: учащающиеся тики, 1.5 с
c = np.zeros(n(1.5)); t = 0.0
while t < 1.45:
    k = clickn(0.03, 2800 + 600 * t); i = n(t); c[i:i + len(k)] += k[:len(c) - i]; t += 0.11 - 0.06 * t / 1.5
S['counter'] = norm(c, 0.4)

os.makedirs('public/sfx', exist_ok=True)
for name, x in S.items():
    st = np.stack([x, x], 1)
    wavfile.write(f'public/sfx/{name}.wav', SR, (np.clip(st, -1, 1) * 32767).astype(np.int16))
    print(name, f'{len(x) / SR:.2f}s')
