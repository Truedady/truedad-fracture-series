"""
Процедурный саунд-дизайн для заставок глав (без сторонних сэмплов — всё синтезируется,
поэтому нет вопросов с правами). Тайминги привязаны к кадрам (30 fps) из src/chapters/*.tsx.

    python3 scripts/sound/sfx.py            -> renders/audio/*.wav (48 кГц, 24 бит, стерео)
"""
import os
import subprocess
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
FPS = 30
rng = np.random.default_rng(7)


def fr(n):  # кадр -> секунды
    return n / FPS


def secs(n):
    return int(round(n * SR))


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def svf_bp(x, fc, q=1.2):
    """Полосовой фильтр с меняющейся во времени частотой (Chamberlin SVF)."""
    y = np.zeros_like(x)
    low = band = 0.0
    damp = 1.0 / q
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc[i], SR / 6) / SR)
        high = x[i] - low - damp * band
        band += f * high
        low += f * band
        y[i] = band
    return y


def env_ar(n, attack, release, curve=2.0):
    t = np.linspace(0, 1, n)
    a = max(1, int(n * attack))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** curve
    r = max(1, int(n * release))
    e[-r:] *= np.linspace(1, 0, r) ** curve
    return e


class Track:
    def __init__(self, dur):
        self.L = np.zeros(secs(dur) + SR)  # хвост на реверб
        self.R = np.zeros_like(self.L)
        self.dur = dur

    def add(self, t, sig, gain=1.0, pan=0.0):
        """pan: -1 лево … +1 право, может быть массивом той же длины."""
        i = secs(t)
        n = min(len(sig), len(self.L) - i)
        if n <= 0:
            return
        sig = sig[:n] * gain
        p = np.clip(pan if np.isscalar(pan) else pan[:n], -1, 1)
        gl = np.cos((p + 1) * np.pi / 4)
        gr = np.sin((p + 1) * np.pi / 4)
        self.L[i:i + n] += sig * gl
        self.R[i:i + n] += sig * gr

    def stereo(self):
        return np.stack([self.L, self.R], axis=1)


# ── Синтез отдельных звуков ──────────────────────────────────────────────

def whoosh(dur, f0=300, f1=3000, q=1.4, shape='swell'):
    n = secs(dur)
    t = np.linspace(0, 1, n)
    fc = f0 * (f1 / f0) ** (t ** 1.3)
    x = svf_bp(rng.standard_normal(n), fc, q)
    if shape == 'swell':
        e = np.sin(np.pi * t) ** 1.6
    elif shape == 'rise':
        e = t ** 2.2 * (1 - np.clip((t - 0.93) / 0.07, 0, 1))
    else:  # 'fall'
        e = (1 - t) ** 1.5 * np.clip(t / 0.05, 0, 1)
    return x * e / (np.max(np.abs(x)) + 1e-9)


def clink(f0=1400, dur=0.9, bright=1.0):
    n = secs(dur)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, dec in [(1, 1, 0.35), (2.76, 0.5 * bright, 0.18), (5.4, 0.25 * bright, 0.09), (8.93, 0.12 * bright, 0.05)]:
        s += amp * np.sin(2 * np.pi * f0 * ratio * t + rng.random() * 6) * np.exp(-t / dec)
    s[:48] *= np.linspace(0, 1, 48)
    return s / np.max(np.abs(s))


def tick(f=3200, dur=0.05, noise=0.6):
    n = secs(dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.008) + noise * hp(rng.standard_normal(n), 2500) * np.exp(-t / 0.003)
    return s / np.max(np.abs(s))


def boom(f_start=95, f_end=36, dur=2.2, punch=0.6, decay=0.55):
    n = secs(dur)
    t = np.arange(n) / SR
    f = f_end + (f_start - f_end) * np.exp(-t / 0.09)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / decay)
    click = lp(rng.standard_normal(n), 1800) * np.exp(-t / 0.012) * punch
    s = body + click
    s[:24] *= np.linspace(0, 1, 24)
    return s / np.max(np.abs(s))


def lock_clack():
    n = secs(0.18)
    t = np.arange(n) / SR
    a = bp(rng.standard_normal(n), 900, 4200) * np.exp(-t / 0.006)
    b = 0.55 * bp(rng.standard_normal(n), 1400, 6000) * np.exp(-np.clip(t - 0.035, 0, None) / 0.008) * (t > 0.035)
    thump = 0.5 * np.sin(2 * np.pi * 160 * t) * np.exp(-t / 0.03)
    s = a + b + thump
    return s / np.max(np.abs(s))


def blip(f=880, dur=0.09):
    n = secs(dur)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 2 * t)) * env_ar(n, 0.04, 0.7)
    return s / np.max(np.abs(s))


def pad(freqs, dur, attack=0.35, release=0.3, cutoff=1800, detune=0.004):
    n = secs(dur)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for d in (-detune, 0, detune):
            ph = rng.random()
            saw = 2 * ((f * (1 + d) * t + ph) % 1) - 1
            s += saw
    s = lp(s, cutoff, 4)
    s *= env_ar(n, attack, release, 1.6)
    return s / np.max(np.abs(s))


def shimmer(dur, base=1760):
    n = secs(dur)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for i, m in enumerate([1, 1.5, 2, 3]):
        s += np.sin(2 * np.pi * base * m * t + i) * (0.5 + 0.5 * np.sin(2 * np.pi * (3 + i) * t))
    s *= env_ar(n, 0.4, 0.55, 2)
    return s / np.max(np.abs(s))


def drone(dur, f=55.0, tape_stop_at=None, stop_len=0.14):
    n = secs(dur)
    t = np.arange(n) / SR
    rate = np.ones(n)
    if tape_stop_at is not None:
        a = secs(tape_stop_at - stop_len)
        b = secs(tape_stop_at)
        rate[a:b] = np.linspace(1, 0.05, b - a) ** 1.5
        rate[b:] = 0
    ph = 2 * np.pi * f * np.cumsum(rate) / SR
    s = np.sin(ph) + 0.5 * np.sin(2 * ph + 0.3) + 0.3 * np.sign(np.sin(3 * ph)) * 0.3
    s += 0.25 * lp(rng.standard_normal(n), 400) * (rate > 0)
    s = lp(s, 900, 2)
    s *= (rate > 0.02)
    return s / np.max(np.abs(s))


def reverb(st, seconds=2.2, mix=0.22, tone=5000):
    n = secs(seconds)
    t = np.arange(n) / SR
    out = st.copy()
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t / (seconds / 6.5))
        ir = lp(ir, tone)
        ir[: secs(0.012)] = 0  # предзадержка
        ir /= np.sqrt(np.sum(ir ** 2))
        wet = fftconvolve(st[:, ch], ir)[: len(st)]
        out[:, ch] = st[:, ch] * (1 - mix) + wet * mix * 1.6
    return out


def finish(st, dur, peak_db=-1.0, fade_out=0.25):
    st = st[: secs(dur)]
    st = hp(st.T, 25).T
    fo = secs(fade_out)
    st[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2
    st[:240] *= np.linspace(0, 1, 240)[:, None]
    # выравниваем громкость каналов (случайные импульсы реверба дают перекос)
    rms = np.sqrt(np.mean(st ** 2, axis=0)) + 1e-9
    st = st * (rms.mean() / rms)
    # мягкое ограничение
    st = np.tanh(st * 1.1) / np.tanh(1.1)
    st *= 10 ** (peak_db / 20) / (np.max(np.abs(st)) + 1e-9)
    return st


# ── ГЛАВА 01 · Первые обмены (135 кадров) ────────────────────────────────

def ch01():
    D = 135 / FPS
    tr = Track(D)
    # тёплая подложка (D-мажор с добавленной ноной), растёт к титру
    p = pad([73.42, 146.83, 220.0, 293.66, 369.99, 659.25], D - 0.1, attack=0.45, release=0.25, cutoff=1400)
    p *= np.clip(np.linspace(0.55, 1.15, len(p)), 0, 1)
    tr.add(0.05, p, 0.20)
    # обмены: два мягких встречных пролёта на каждую сделку
    for (t0, t1, pan) in [(10, 40, 1), (18, 47, -1)]:
        dur = fr(t1 - t0)
        w = whoosh(dur, 500, 2600, q=2.2)
        tr.add(fr(t0), w, 0.22, pan=np.linspace(-0.6 * pan, 0.6 * pan, len(w)))
        w2 = whoosh(dur, 420, 2200, q=2.2)
        tr.add(fr(t0), w2, 0.18, pan=np.linspace(0.6 * pan, -0.6 * pan, len(w2)))
        # предмет «встаёт» в слот
        tr.add(fr(t1) - 0.02, clink(1320 if pan > 0 else 1660, 1.0), 0.16, pan=0.35 * pan)
        tr.add(fr(t1), clink(990 if pan > 0 else 1245, 0.8, 0.6), 0.12, pan=-0.35 * pan)
    # пролёт сквозь интерфейс
    tr.add(fr(36), whoosh(fr(22), 250, 5200, q=1.1, shape='rise'), 0.55)
    # раскрытие главы: мягкий глубокий удар + мерцание
    tr.add(fr(55), boom(70, 34, 2.4, punch=0.25, decay=0.7), 0.6)
    tr.add(fr(54), shimmer(1.6, 1318.5), 0.07, pan=0.2)
    # годы и шкала — тихие «тики»
    tr.add(fr(70), tick(2600, 0.06, 0.3), 0.12, pan=-0.1)
    tr.add(fr(76), tick(3100, 0.05, 0.3), 0.08, pan=0.15)
    # световой блик по буквам
    tr.add(fr(80), whoosh(fr(24), 3000, 9000, q=3.0), 0.05, pan=np.linspace(-0.7, 0.7, secs(fr(24))))
    # выход: полёт вперёд
    tr.add(fr(106), whoosh(fr(26), 200, 4200, q=1.0, shape='rise'), 0.5)
    tr.add(fr(128), whoosh(0.6, 3000, 300, q=1.0, shape='fall'), 0.25)
    st = reverb(tr.stereo(), 2.6, 0.28, 6000)
    return finish(st, D, -1.0, 0.18)


# ── ГЛАВА 07 · Худшая весна для трейдеров (150 кадров) ───────────────────

FLIGHTS07 = [(2, 13), (4, 13), (7, 12), (10, 15), (13, 13), (16, 12), (19, 13), (22, 13), (25, 14), (29, 17), (32, 15), (34, 16), (36, 15), (38, 15)]


def ch07():
    D = 150 / FPS
    FREEZE = fr(42)
    tr = Track(D)
    # напряжённый дрон, который «зажёвывается» и останавливается в момент стопа
    tr.add(0, drone(FREEZE + 0.05, 49.0, tape_stop_at=FREEZE - 0.02), 0.22)
    # ускоряющийся пульс тиков
    t, i = 0.06, 0
    while t < FREEZE - 0.06:
        acc = 1 - t / FREEZE
        tr.add(t, tick(3400 if i % 4 else 2200, 0.04, 0.5), 0.10 if i % 4 else 0.16, pan=0.3 * np.sin(i))
        t += 0.085 + 0.07 * acc
        i += 1
    # низкий «кик»-пульс
    for b in np.arange(0.0, FREEZE - 0.1, 0.27):
        tr.add(b, boom(120, 50, 0.25, punch=0.2, decay=0.06), 0.15)
    # пролёты предметов
    for j, (s, d) in enumerate(FLIGHTS07):
        end = min(s + d, 42)
        if end - s < 2:
            continue
        w = whoosh(fr(end - s), 700, 4200, q=2.0)
        pan = (-1) ** j * 0.7
        tr.add(fr(s), w, 0.14, pan=np.linspace(pan, -pan, len(w)))
    # СТОП: удар + шипящий «вакуум»
    tr.add(FREEZE, boom(110, 32, 3.0, punch=0.9, decay=0.9), 1.0)
    tr.add(FREEZE, lp(rng.standard_normal(secs(0.5)), 2500) * np.exp(-np.arange(secs(0.5)) / SR / 0.12), 0.18)
    # после стопа — холодный низкий гул
    tail = drone(D - FREEZE - 0.1, 41.2)
    tail *= env_ar(len(tail), 0.25, 0.2)
    tr.add(FREEZE + 0.1, tail, 0.18)
    tr.add(FREEZE + 0.2, pad([82.41, 87.31, 123.47, 174.61], D - FREEZE - 0.5, attack=0.4, release=0.3, cutoff=700, detune=0.006), 0.10)
    # замки на предметах в воздухе
    for j in range(5):
        tr.add(fr(42 + 2 + j * 2), lock_clack(), 0.38, pan=[-0.5, 0.3, -0.1, 0.55, -0.3][j])
    # появление предупреждения + заполнение 7 дней
    tr.add(fr(46), whoosh(0.16, 2000, 600, q=1.5, shape='fall'), 0.15)
    for j in range(7):
        tr.add(fr(52 + j * 2.2), blip(392 if j < 6 else 311.13, 0.08), 0.11, pan=-0.45 + j * 0.15)
    # перевод фокуса / сжатие предупреждения
    tr.add(fr(76), whoosh(fr(16), 1500, 300, q=1.3), 0.14)
    # линия и шторка
    n = secs(0.6)
    tt = np.arange(n) / SR
    line_tone = np.sin(2 * np.pi * 2093 * tt) * env_ar(n, 0.05, 0.85, 2)
    tr.add(fr(80), line_tone, 0.06)
    tr.add(fr(84), whoosh(fr(11), 600, 3500, q=1.6, shape='rise'), 0.25)
    tr.add(fr(94), boom(80, 40, 1.6, punch=0.35, decay=0.45), 0.45)
    tr.add(fr(96), tick(2400, 0.05, 0.2), 0.08)
    # обрушение сцены и закрытие шторки
    tr.add(fr(124), whoosh(fr(22), 2600, 120, q=1.2, shape='fall'), 0.4)
    tr.add(fr(134), whoosh(fr(8), 3500, 800, q=1.6), 0.25)
    tr.add(fr(142), line_tone[: secs(0.15)] * np.linspace(1, 0, secs(0.15)), 0.05)
    tr.add(fr(146), boom(70, 30, 1.2, punch=0.6, decay=0.25), 0.55)
    st = reverb(tr.stereo(), 2.2, 0.22, 4500)
    return finish(st, D, -1.0, 0.08)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'renders/audio'
    os.makedirs(out, exist_ok=True)
    for name, fn in [('01_pervye-obmeny_2010-2013', ch01), ('07_hudshaya-vesna_2018', ch07)]:
        st = fn()
        pcm = (np.clip(st, -1, 1) * (2 ** 31 - 1)).astype(np.int32)
        path = os.path.join(out, f'{name}_sfx.wav')
        tmp = path + '.32.wav'
        wavfile.write(tmp, SR, pcm)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-c:a', 'pcm_s24le', path], check=True)
        os.remove(tmp)
        print(path, f'{len(st) / SR:.2f}s')
