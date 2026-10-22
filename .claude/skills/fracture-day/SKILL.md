---
name: fracture-day
description: Make the next day of the TrueDad «30 дней Fracture Case» experiment (or any TrueDad news short) in the «Монтаж без излишеств» style — vertical 1080×1920 from the author's screen recording + voiceover. Use when the author sends sources for a new day, asks for «день N», «следующий выпуск», a draft («черновик») or a final render.
---

# Fracture Case — новый день («Монтаж без излишеств»)

Reference: `src/days/day02.tsx` (composition `Day02`). Shell: `src/core/TrueDadNewsCinema.tsx`. Opening: `src/core/DayOpening.tsx`.

## The style (approved by the author — do not drift)
1. **Opening, 4–6 s:** `DayOpening` — the case as a product shot (real pixels: `public/brand/fracture-case.png`, cut out of the
   CS2 recording), focus-in, light sweep, floor reflection, «ЭКСПЕРИМЕНТ TRUEDAD / FRACTURE CASE», and «ДЕНЬ N / 30» + 30-cell bar
   on the words about the month/plan. Frame 0 already shows the case. **Never** slowed-down footage as the opener.
2. **After that: the author's footage only.** No plates, frames, icons, drawn charts or numbers. The only text is the captions.
3. **Few long takes, 5–10 s.** Prefer one continuous piece of the recording (real scroll, real cursor) over cuts.
4. Panel 1080×1300 at y=190 over the same footage blurred (46 px, brightness 0.38). Feathered edges, light grade, vignette.
5. **Camera:** slow eased push-ins and lateral dollies in source pixels (h = 1.2·w). Pushes land as the voice names the thing.
6. **Spotlight only, one at a time, on exactly what is said** (lots -> the «N for sale» line, price -> that row, order -> the
   own-order row). Measure rects on frames where the page has stopped moving (scene changes from `scripts/footage-map.sh`).
7. **Transitions:** 0.6 s focus pull. No wipes, glitches or flashes.
8. **Captions:** Inter 800 56 px at y=1540, ≤22 chars, the spoken word gold #D9A93D.
9. **Sound:** voiceover untouched (output LUFS and peak = source). **No swishes/whooshes ever.** `boom` 0 s + `shimmer` 0.55 s
   (opening), `tick` at «ДЕНЬ N», `click`/`key` exactly on the real clicks/keystrokes in the recording, a quiet `shimmer`
   on a visually rich moment. The mix peak must not exceed the voice peak.
10. **Output:** 1080×1920, 30 fps, H.264 yuv420p, CRF 16 (draft CRF 20), AAC 320k. No 4K output.

## Facts
- Never invent prices, percentages, deals, charts or claims. Every number on screen is a pixel of the recording.
- Plan: day n buys `casesForDay(n)` = 20 + 5·(n−1) (20, 25 … 165), 2775 in total (`src/core/series.ts`).
- If the recording and the voiceover disagree on a number, tell the author; don't "fix" either.
- Keep browser tabs, ads, wallet/avatar, sidebars and the taskbar out of frame (`safeSource`, per-shot `minY`).

## Steps for day NN
1. `scripts/fetch-day.sh NN <video-url> <voice-url>` (sources are usually assets of a GitHub release).
2. `scripts/footage-map.sh NN` -> look at the sheets, note what is where (source seconds + pixel rects) in the day file header.
   For exact rects grab full-res frames (`ffmpeg -ss <t> -i public/days/dayNN/footage.mp4 -frames:v 1 -vf crop=...`).
3. `pip install sherpa-onnx numpy` then `python3 -I scripts/transcribe.py public/days/dayNN/voiceover.mp3 data/dayNN.words.json`;
   fix spelling against the Whisper text (CS2, Fracture Case, digits), merge multi-word numbers. Never change what is said.
4. Copy `src/days/_template.tsx.txt` -> `src/days/dayNN.tsx`, register it in `src/days/index.ts` (id `DayNN`).
   Plan takes from the speech: opening -> 4–6 footage takes. Find click/keystroke times with scene detection on the cropped UI.
5. `npm run typecheck`; review stills: `node scripts/stills.mjs DayNN out/stills-NN <frames,…>` (30 evenly spaced unless the
   author asked for a direct render/draft). Fix cut-off text, wrong spotlight, stray UI.
6. `npm run draft -- DayNN out/dayNN-draft.mp4` or `npm run render -- DayNN out/dayNN.mp4`
   (sandbox: `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`).
7. QC: first 3 s, `blackdetect`, caption sync, final take, `ebur128` LUFS/peak = voiceover. Send the MP4; say what changed and
   any data mismatch, in Russian, briefly.
