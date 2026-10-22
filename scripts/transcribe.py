"""Word timings for a voiceover (never modifies the audio).
python3 -I scripts/transcribe.py public/days/dayNN/voiceover.mp3 data/dayNN.words.json

- Timestamps: sherpa-onnx GigaAM-v2 RNNT (Russian). Spelling check: Whisper medium (sherpa-onnx).
- Models are downloaded from the k2-fsa/sherpa-onnx GitHub releases into ~/.cache/sherpa (pip install sherpa-onnx).
- Output: a draft words.json [{text,start,end}] in lowercase ASR spelling + the Whisper text on stdout.
  Fix the spelling by hand (CS2, Fracture Case, numbers as digits, punctuation); merge words that become one token
  (e.g. «сто семьдесят два» -> «172») keeping the first start and the last end. Never change what is said.
"""
import json, os, subprocess, sys, tarfile, urllib.request, wave
import numpy as np
import sherpa_onnx as so

AUDIO, OUT = sys.argv[1], sys.argv[2]
CACHE = os.path.expanduser('~/.cache/sherpa')
BASE = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/'
GIGA = 'sherpa-onnx-nemo-transducer-giga-am-v2-russian-2025-04-19'
WHISPER = 'sherpa-onnx-whisper-medium'


def model(name):
    d = os.path.join(CACHE, name)
    if not os.path.isdir(d):
        os.makedirs(CACHE, exist_ok=True)
        tar = d + '.tar.bz2'
        urllib.request.urlretrieve(BASE + name + '.tar.bz2', tar)
        tarfile.open(tar).extractall(CACHE)
        os.remove(tar)
    return d + '/'


wav = os.path.join(CACHE, 'voice16.wav')
os.makedirs(CACHE, exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', AUDIO, '-ac', '1', '-ar', '16000', wav], check=True)
w = wave.open(wav)
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
SR = 16000

# split into <= ~20 s chunks at the quietest 0.3 s inside each window (GigaAM works best on short audio)
cuts = [0]
while len(a) - cuts[-1] > 22 * SR:
    lo, hi = cuts[-1] + 14 * SR, cuts[-1] + 21 * SR
    best = min(range(lo, hi, 1600), key=lambda s: float(np.mean(a[s:s + 4800] ** 2)))
    cuts.append(best + 2400)
cuts.append(len(a))

G = model(GIGA)
rec = so.OfflineRecognizer.from_transducer(encoder=G + 'encoder.int8.onnx', decoder=G + 'decoder.onnx', joiner=G + 'joiner.onnx', tokens=G + 'tokens.txt', model_type='nemo_transducer')
words = []
for s0, s1 in zip(cuts, cuts[1:]):
    st = rec.create_stream()
    st.accept_waveform(SR, a[s0:s1])
    rec.decode_stream(st)
    cur = None
    for tok, ts in zip(st.result.tokens, st.result.timestamps):
        t = round(ts + s0 / SR, 2)
        if tok == ' ':
            cur = None
            continue
        if cur is None:
            cur = {'text': '', 'start': t, 'end': t}
            words.append(cur)
        cur['text'] += tok
        cur['end'] = round(t + 0.08, 2)
for x, y in zip(words, words[1:]):
    x['end'] = min(x['end'], y['start'])
json.dump(words, open(OUT, 'w'), ensure_ascii=False, indent=0)
print('GigaAM:', ' '.join(f"{x['text']}@{x['start']}" for x in words))

W = model(WHISPER)
wr = so.OfflineRecognizer.from_whisper(encoder=W + 'medium-encoder.int8.onnx', decoder=W + 'medium-decoder.int8.onnx', tokens=W + 'medium-tokens.txt', language='ru', task='transcribe')
for s0, s1 in zip(cuts, cuts[1:]):
    st = wr.create_stream()
    st.accept_waveform(SR, a[s0:s1])
    wr.decode_stream(st)
    print('Whisper:', st.result.text)
