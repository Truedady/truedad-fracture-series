# CLAUDE MASTER PROMPT — TrueDad Fracture Series

You are a senior Remotion developer, motion designer, and short-form film editor. Deliver a **finished premium vertical video**, not a plan.

FIRST read README.md, brand/STYLE_GUIDE.md, data/day01.json and all files under docs/. Use supplied real voiceover and actual Steam footage; do not create a new project if this one already exists. All brand decisions belong in reusable React components.

## Inputs
`public/assets/voiceover-day01.mp3` — master 44 second narration, must remain intact.
`public/assets/footage-curated.mp4` — edited screen recording, factual footage.
`public/assets/proof/inventory_20.jpg` — 20 cases in inventory.
`public/assets/proof/steam_chart.jpg` — recorded market snapshot.
`public/assets/proof/portfolio_add.jpg` — portfolio interface.
Do not proceed with bogus asset placeholders if files are missing; explicitly surface the missing files.

## Deliverable
`out/fracture-day01.mp4`, vertical 1080x1920, 30fps, H.264, with voiceover, carefully timed animated graphics, tasteful SFX and captions. Also export 3-5 stills under `out/stills/`.

## Dramaturgy
This is an experiment conducted during a falling CS2 items market. The creator will buy 20 Fracture Cases on day one; each next day increase by 5, finishing with 165 on day thirty. Intended sum: 2775 cases. Never say ALL market items are falling unless supported. Never claim investment profit or loss without reliable data.

## Style
Premium graphite + muted-gold financial editorial style, not casino-like. Prioritize extremely readable typography. Hook within first 1 second, no intro/outro bumper. Motion must communicate changing quantity, falling market, real proof of purchase, real risk.

## Editing process
1. Probe actual audio length (expected approximately 44s), transcribe precisely and produce a word-level timing sheet. Keep the spoken wording.
2. Review actual source footage and identify *only* relevant shots — steam price chart, actual buy, portfolio confirmation, inventory of 20. Do not show unrelated ChatGPT or Cologne sticker positions.
3. Establish segment cut points from actual speech, not arbitrary time slots.
4. Design two complementary visual layers: evidence windows with real pixels, and accurate native Remotion graphics.
5. Build `src/FractureDay1.tsx`, with reusable brand primitives and a single data configuration per episode. Exact voiceover timing is mandatory.
6. Render video and inspect multiple checkpoints, including first 5 seconds and final CTA. Fix text clipping, timing failures, empty footage, incorrect crops, duplicated audio.
7. Deliver a complete file and a succinct QC report with unresolved factual issues if any.

## Non-negotiables
- No fabricated transactions, no invented price curves labeled as actual market data, no manufactured commissions or profit.
- Do not alter original speech.
- Correct daily sequence 20/25/30/.../165, month total 2775.
- Do not install an entirely new Remotion project on each iteration.
- Include day-to-day reuse: later episodes should change narration, footage and data with minimal recoding.
- No TikTok watermark, no stock-watermarked imagery, no misleading financial returns.

## Visual aspiration
An expensive business-news terminal meets a premium sports broadcast. Controlled camera movements, clean vectors, kinetic typography, subtle sound design, readable numbers. Less is more, but nothing should feel like slides.
