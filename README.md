# TrueDad — Fracture Case | 30-day CS2 experiment

A Remotion-based vertical video series for TikTok / YouTube Shorts.

**Day 1:** buy 20 Fracture Cases; buy five more than the previous day each following day (25, 30, ... 165). Thirty-day total: **2,775 cases**, if the schedule is completed.

## Project status
**Day 01 is rendered:** `renders/fracture-day01.mp4` (1080×1920, 30 fps, H.264, 44 s). QC: `docs/QC_REPORT.md`. Word timing: `captions/day01.timing.md`.

## Quickstart
```bash
npm install
bash scripts/fetch-assets.sh   # unpack source media from the kit ZIP into public/assets/
# + put the author's 1080p recording at public/assets/master/footage-master.mp4 (kept out of git: private screen capture)
npm run dev                    # Remotion Studio
npm run render                 # master render + finalize (yuv420p BT.709, -1.5 dB, stills)
```
In containers without Chrome, point Remotion at a local Chromium: `REMOTION_BROWSER=/path/to/headless_shell npm run render`.

## Project layout
- `src/episodes/day01.ts` — the only per-episode code: beats/cues (from the word timing sheet), SFX cues.
- `data/day01.json` (facts), `data/day01.captions.json` (captions), `data/day01.chart.json` (digitized Steam curve).
- `src/components/` — `MarketDrop`, `CaseHero`, `PurchaseLadder`, `MetricTicker`, `SteamEvidenceFrame`, `DayCounter`, `CaptionLayer`, `SoundDesign`; `src/scenes/` — scene layouts incl. `OutroCTA`; `src/brand/` — tokens, fonts, primitives.
- `scripts/` — caption builder, chart digitizer, case cut-out, procedural SFX, finalize, fetch-assets.

## New episode checklist
1. Add `voiceover-dayNN.mp3`, footage and proofs. 2. Transcribe → `captions/dayNN.asr-raw.json`, run `scripts/build-captions.py`. 3. Copy `src/episodes/day01.ts`, update beats/cues, footage times and facts JSON. 4. Register a composition in `src/root.tsx`, render, QC.
Read `prompts/CLAUDE_MASTER_PROMPT.md` before editing. Use `brand/STYLE_GUIDE.md` as canonical visual direction.

## Source binary assets (inside `TrueDad_Fracture_Remotion_Kit.zip`)
- `public/assets/voiceover-day01.mp3`
- `public/assets/footage-curated.mp4`
- `public/assets/proof/inventory_20.jpg`
- `public/assets/proof/portfolio_add.jpg`
- `public/assets/proof/steam_chart.jpg`

Files can be found in the previously supplied project ZIP. Store voiceover & factual screenshots unchanged. Never invent transaction values, charts, receipts or investment returns.

## Story / editorial direction
Hook: market decline vs progressively larger daily purchases. Show real evidence of 20 purchases. No opening logo animation. No fake graphs presented as real data. 1080×1920 / 30fps, fast-paced 44s voiceover.

## Publishing
The GitHub repository is public: avoid secrets, private screen captures, authentication tokens, personally identifying information or sensitive account details.
