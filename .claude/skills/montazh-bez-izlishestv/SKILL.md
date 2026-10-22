---
name: montazh-bez-izlishestv
description: TrueDad «Монтаж без излишеств» — footage-first vertical news edit (1080×1920) built from the author's own screen recording and voiceover. Use when asked to make a TrueDad news/Shorts/Reels/TikTok video «в стиле без излишеств», «как Evil Geniuses», «только футаж», or to cut a new episode from a supplied recording + voiceover.
---

# Монтаж без излишеств (TrueDad)

Reference episode: `src/news/cinema/evilGeniuses01Footage.ts` (composition `TrueDadNewsFootage-EvilGeniuses01`),
shell `src/news/cinema/TrueDadNewsCinema.tsx`. Approved master: `renders/evil-geniuses-news-01-footage/`.

## What the style is
- The author's footage is the whole picture. No titles, plates, cards, frames, icons, drawn charts or numbers.
  The only text on screen is the word captions. Every price or date the viewer sees is a pixel of the recording.
- Few long takes, 5–10 s each (EG: 6 takes over 39.5 s). Never cut every 2–3 s. Prefer one continuous piece of
  the recording (the real scroll, the real cursor hover) over several cuts.
- Picture: sharp panel 1080×1300 at y=190. The rest of the frame is the same footage blurred 46 px at 0.38 brightness.
  Panel edges are feathered (no border). Light grade: contrast 1.06, saturation 1.08, soft vignette.
- Camera: slow eased push-ins and lateral dollies in source pixels (`cam` keyframes, h = 1.2·w). The one-off push lands
  on the detail while the voiceover says it.
- Emphasis: soft spotlight only (`spots`). It dims the surroundings with a feathered edge and fades in over 0.6 s.
  One spotlight at a time. No boxes, arrows or labels.
- Transitions: 0.6 s focus pull (incoming shot de-blurs 14→0 px and settles from 1.04 scale). No wipes, no glitches.
- Captions: Inter 800, 56 px, centred at y=1540 under the panel. Phrases of ≤22 chars. The spoken word is gold
  (#D9A93D), spoken words are ivory and upcoming words are 45 % ivory. They stay above the TikTok/Shorts bottom UI.
- Sound: the voiceover is untouched (check that the output LUFS/peak equal the source). SFX are minimal: a soft hit
  on frame 0 (0.22), and the soft `swish.wav` (0.14, starts 0.45 s before the cut) **only on story turns**, at most 2–3 per
  video. No swish on every cut, no ticks, no pops. Regenerate the swish with `python3 scripts/make_swish.py`.

## Process
1. Download the sources unchanged into `public/news/<id>/`. Probe them, then make a frame sheet of the footage (1 fps)
   and map what is where (source seconds + pixel rects).
2. Get word timings from the voiceover (sherpa-onnx GigaAM-v2 RNNT for timestamps, Whisper for spelling).
   Fix the spellings (CS2, team names, years) and save them to `data/news/<id>.words.json`. Never change the spoken text.
3. Plan the takes from the speech, not from fixed slots. Keep private UI out of frame (browser tabs, wallet/avatar,
   taskbar, ads): use `safeSource` and per-shot `minY`. Keep anything that contradicts the voiceover out of frame too.
4. Write `src/news/cinema/<id>Footage.ts` and register it in `src/root.tsx`.
5. Before the full render, send 30 evenly spaced stills: `node scripts/stills.mjs <comp> <dir> <frames>`.
   Fix cut-off text, empty framing and stray UI, then wait for the author's OK.
6. Render at CRF 16, `--pixel-format yuv420p`, 320 k audio (`REMOTION_BROWSER=<headless_shell>` in the sandbox).
   QC: the first 3 s, black frames, caption sync, the final take and the audio levels.

## Never
Invent prices, percentages, deals or claims. Imitate charts. Change or re-time the voice. Cover the footage with
graphics. Add effects the author didn't ask for.
