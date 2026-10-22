# ProofInsert — «месяц назад я вложил 100 000 ₽»

2560×1440 · 30 fps · 141 кадр (4.7 с = длина исходника). Анимация занимает 0–3.5 с, дальше исходная запись идёт без изменений. Аудио исходника не трогается.

## Исходники (кладутся вручную, в git не хранятся)
- `public/insert/trueskins.mp4` — запись портфеля TrueSkins (`1022(2).mp4`)
- `public/insert/youtube-prev.jpg` — скриншот прошлого видео (2000×619)
- `public/insert/sfx-*.wav` — тихие SFX (сгенерированный шум, отключаются `sfxVolume: 0`)

## Что где менять
- `timeline.ts` — тайминги всех фаз в кадрах.
- `geometry.ts` — координаты превью, карточки и «1 мес. назад» в пикселях скриншота, а также ракурсы камеры.
- Пропсы композиции: `motionBlur`, `motionBlurSamples`, `showLabel` (подпись «МЕСЯЦ НАЗАД»), `sfxVolume`.

## Команды
```bash
# если Remotion не может скачать свой Chromium:
export REMOTION_BROWSER=/path/to/chrome-headless-shell
npx remotion studio src/index.ts
npx remotion still src/index.ts ProofInsert out/still.png --frame=64
npx remotion render src/index.ts ProofInsert out/proof-insert.mp4 --codec h264 --crf 16
```
