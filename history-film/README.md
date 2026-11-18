# TrueDad · «История заработка в Steam» — монтаж кадров 14–78

Документальный монтаж в Remotion: настоящие страницы Valve и прессы, архивы курса, плавная камера.
**Весь рендер запускается на вашем Windows-компьютере.** Сейчас готов только **черновик кадров 14–18** (без голоса, метка `VOICE_PENDING`).

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
```
Результат: `output\draft_14-18.mp4` (1280×720, 30 fps, ~53 с).

Если PowerShell пишет «выполнение сценариев отключено» — используйте `npm.cmd` вместо `npm`
(или один раз: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`).

| Команда | Что делает |
|---|---|
| `npm run doctor` | проверяет Node, FFmpeg, пакеты и все файлы черновика, пишет, что исправить |
| `npm run preview` | открывает Remotion Studio в браузере — можно листать кадры |
| `npm run render:draft` | черновик кадров 14–18 → `output/draft_14-18.mp4`. Кусок: `npm run render:draft -- --frames=0-150` |
| `npm run render:final` | 2560×1440 @ 60 fps. Запускается только после одобрения: `npm run render:final -- --approved` |
| `npm run audit:links` | проверяет все ссылки из `SOURCES.json` → `link_audit.csv` (медиа не скачивает) |

## Структура
```
SCENES.json, SOURCES.json     кадры 14–78 и источники (из пакета)
shot_timeline.json            планы черновика 14–18 с таймингом
link_audit.csv                проверка ссылок (OK / blocked / rate_limited)
src/Draft14to18.tsx           монтаж черновика — все планы и тайминги здесь
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
