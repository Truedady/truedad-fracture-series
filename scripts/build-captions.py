"""Build caption pages from a word-level ASR timing sheet and a display script.

Usage: python3 scripts/build-captions.py captions/dayNN.asr-raw.json captions/dayNN.script.txt data/dayNN.captions.json

The ASR sheet comes from sherpa-onnx (GigaAM-v2 RNNT, cross-checked with Zipformer-ru).
In the script each display token `text:N` consumes N spoken words, so captions stay
faithful to the audio while numbers are rendered as digits. '|' starts a new caption page,
'*' marks a key token (gold highlight), '_' renders as a space.
"""
import json, sys

raw = json.load(open(sys.argv[1]))
SCRIPT = open(sys.argv[2], encoding="utf-8").read()
TOKEN_END_PAD = 0.12  # token timestamps mark token starts; pad to the end of the final phoneme
pages, cur, i = [], [], 0
for part in SCRIPT.split():
    if part == "|":
        pages.append(cur); cur = []; continue
    text, n = part.rsplit(":", 1)
    n = int(n)
    span = raw[i:i + n]
    assert len(span) == n, (text, i)
    key = text.startswith("*")
    cur.append({"text": text.lstrip("*").replace("_", " "), "key": key,
                "start": round(span[0]["s"], 2), "end": round(span[-1]["e"] + TOKEN_END_PAD, 2),
                "asr": " ".join(w["w"] for w in span)})
    i += n
if cur: pages.append(cur)
assert i == len(raw), f"consumed {i} of {len(raw)} words"
json.dump({"source": sys.argv[1], "pages": pages}, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
print(len(pages), "pages")
