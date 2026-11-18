# TrueDad · «История заработка в Steam» — монтаж кадров 14–78

Документальный монтаж в Remotion: настоящие страницы Valve и прессы, архивы курса, плавная камера.
**Весь рендер запускается на вашем Windows-компьютере, сразу в 2K (2560×1440).**
Готово: кадры 14–18 (черновик) и кадры 19–78 по главам. Голос ещё не записан — тайминги условные.

## Что нужно на компьютере
- Git для Windows
- Node.js LTS (18 или новее), с npm
- FFmpeg и ffprobe в PATH (`winget install Gyan.FFmpeg`, затем перезапустить терминал)
- Chromium Remotion скачает сам при первом рендере (~15 с)

## Запуск (PowerShell)
```powershell
cd D:\Claud\truedad-fracture-series\history-film
git pull
npm ci
npm run doctor
npm run render:draft
npm run render:scenes
```
Результат: `output\draft_14-18_1440p.mp4` и по файлу на главу `output\<глава>_1440p.mp4` (2560×1440, 30 fps).

Если PowerShell пишет «выполнение сценариев отключено» — используйте `npm.cmd` вместо `npm`
(или один раз: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`).

| Команда | Что делает |
|---|---|
| `npm run doctor` | проверяет Node, FFmpeg, пакеты и все материалы, пишет, что исправить |
| `npm run preview` | открывает Remotion Studio в браузере — можно листать кадры |
| `npm run render:draft` | кадры 14–18 → `output/draft_14-18_1440p.mp4` |
| `npm run render:scenes` | все главы 19–78 → `output/<глава>_1440p.mp4` (≈ 6 мин видео) |
| `npm run render:scenes -- Ch06-Pubg` | одна глава (`Ch03-Regional`, `Ch04-Markets`, `Ch05-SteamGuard`, `Ch06-Pubg`, `Ch07-WorstSpring`, `Ch08-InvestBoom`, `Ch09-Stickers`, `Ch10-CS2`, `Ch11-NewEconomy`, `Final`) |
| `npm run render:final -- --approved` | 2560×1440 @ 60 fps, после утверждения монтажа и озвучки |
| `npm run audit:links` | проверяет все ссылки из `SOURCES.json` → `link_audit.csv` (медиа не скачивает) |

## Структура
```
SCENES.json, SOURCES.json     кадры 14–78 и источники (из пакета)
shot_timeline.json            планы черновика 14–18 с таймингом
link_audit.csv                проверка ссылок (OK / blocked / rate_limited)
src/Draft14to18.tsx           кадры 14–18
src/scenes.ts                 кадры 19–78 по главам — все планы и тайминги здесь
src/kit.tsx                   типы планов: страница, карточка, архив курса, цитата, схема
src/components.tsx            «камера» по скриншоту страницы, карточки, плашки дат
public/sources/               скриншоты настоящих страниц (Playwright, 2× разрешение)
public/local/                 архивы и готовая графика курса (оригинальные имена)
docs/                         исходные документы пакета, раскадровка, заметки по ссылкам
scripts/                      doctor, render, audit-links
output/                       сюда пишутся видео (в git не попадает)
```

## Принципы монтажа
- Спокойный документальный темп: 5–7 с на план, кроссфейды, без быстрой нарезки.
- Только настоящие страницы и архивы; графика — лишь для условных примеров (с пометкой).
- Приближение не больше ×1,45 от 2×-скриншота — текст остаётся чётким; кадр всегда заполнен страницей.
- Выделение текста — максимум одно на несколько планов.
- Тайминги условные, пока нет озвучки этого участка.
