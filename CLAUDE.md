# TrueDad — «30 дней Fracture Case»

Remotion project for the author's daily vertical videos (1080×1920). Answer the author in Russian, briefly.

- **Every video follows `.claude/skills/fracture-day/SKILL.md` («Монтаж без излишеств»)**: opening graphic of the case with
  «ДЕНЬ N / 30», then only the author's footage + word captions; long takes; soft spotlight on exactly what is said;
  focus-pull transitions; no swishes — sounds only on on-screen events; voiceover untouched; 1080p output.
- Never invent market data. Plan: day n = 20 + 5·(n−1) cases, 2775 total.
- The author may ask for a direct render or a draft; otherwise send 30 stills before the full render.
- Layout: `src/core/` shell + opening, `src/days/dayNN.tsx` one file per day, `data/dayNN.words.json`, `public/days/dayNN/`.
- Day footage is not committed (large); rebuild with `scripts/fetch-day.sh`.
- Claude.ai Project setup text: `docs/claude-project/`.
