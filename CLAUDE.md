# TrueDad Remotion project

- Brand tokens: `brand/STYLE_GUIDE.md`. News templates: `src/news/` (graphic news shell) and `src/news/cinema/` (footage-first shell).
- **Default editing style for TrueDad news: «Монтаж без излишеств».** Follow `.claude/skills/montazh-bez-izlishestv/SKILL.md`
  (opening graphic of the hero object, then footage only + word captions, long takes, soft spotlights on exactly what is
  said, focus-pull transitions, no swishes — only on-screen-event sounds).
- The author may ask for a direct render or a draft; otherwise send 30 stills for review before a full render. Never invent market data. Keep the voiceover untouched.
- Sandbox render: `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell npm run render:day02` (episode scripts in `package.json`).
