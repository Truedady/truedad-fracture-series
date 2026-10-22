# TrueDad — «30 дней Fracture Case»

Шаблон рубрики в стиле «Монтаж без излишеств»: вертикальные ролики 1080×1920 по записи экрана и озвучке автора.

- Начало — графика с кейсом и «ДЕНЬ N / 30», дальше только ваш футаж с субтитрами.
- Длинные планы, мягкий спотлайт на сказанном, переходы через расфокус.
- Звуки только на реальные события на экране, без свишей.

## Как сделать новый день
1. `npm install`
2. `scripts/fetch-day.sh NN <ссылка на видео> <ссылка на озвучку>`
3. `scripts/footage-map.sh NN` — раскадровка и смены сцен.
4. `python3 -I scripts/transcribe.py public/days/dayNN/voiceover.mp3 data/dayNN.words.json` — тайминги слов.
5. `src/days/_template.tsx.txt` → `src/days/dayNN.tsx`, регистрация в `src/days/index.ts`.
6. `npm run draft -- DayNN out/dayNN-draft.mp4` или `npm run render -- DayNN out/dayNN.mp4`.

Проще всего открыть репозиторий в Claude Code и написать «сделай день N» со ссылками на исходники: правила в `CLAUDE.md` и
`.claude/skills/fracture-day/SKILL.md` подхватятся сами.

## Claude.ai Project
`docs/claude-project/01_ИНСТРУКЦИИ_ПРОЕКТА.md` — вставить в «Инструкции проекта»;
`docs/claude-project/02_СТИЛЬ_И_ПРОЦЕСС.md` — загрузить в файлы проекта.

## Эталон
День 2 — `src/days/day02.tsx`. Футаж дня 2: релиз `day-02-assets` репозитория `Truedady/truedad-fracture-series`.
