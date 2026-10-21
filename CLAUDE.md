# TrueDad Fracture series — instructions for Claude

Before any work on a new episode, read `brand/SERIES_PLAYBOOK.md` — it is the style approved by the author after Day 01 (visuals, facts policy, sound design incl. what was rejected). Reproduce that style; change only voiceover, footage, facts and timings. Reference render: `renders/fracture-day01.mp4`.

Also read `README.md`, `prompts/CLAUDE_MASTER_PROMPT.md`, `brand/STYLE_GUIDE.md`. Do not scaffold a new Remotion project; per-episode code lives in `src/episodes/dayNN.ts` + `data/dayNN*.json`.

Key rules: author's full-quality footage only (no proxies); each chart gets its own quiet tonal sound (D minor); effects 13–25 dB under the voice; no repetitive ticks/whooshes; never invent prices, fills or P&L; keep browser tabs, balances and nicknames out of frame; reply to the author in Russian.

## Mandatory approval workflow (author's rule, from Day 02)
1. Storyboard: 6–8 PNG stills exported with `remotion still` from the real composition (hook 0–2 s, story start, Steam footage, market comparison, most complex graphic scene, final CTA) + a contact sheet. Show them and STOP.
2. Wait for the author to write «Утверждаю». Silence is not approval. Design changes → fix and show new stills.
3. Then a draft preview of the first 5–8 s at 540×960 with sound (`--scale 0.5`, fast settings). Show it and wait for confirmation again.
4. Only after the second confirmation: the final 1080×1920 / 30 fps / H.264 render. No full exports before the visual concept is approved; no needless re-renders.
Render from a 1080p/30 fps copy of the source (much faster than 4K); keep crops ≥ ~450 units wide in the 1600×900 reference space.
