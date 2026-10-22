# TrueDad News — Evil Geniuses (01)

Composition: `TrueDadNews-EvilGeniuses01` · 1080×1920 · 30 fps · 39.5 s (38.14 s voiceover + 1.4 s Telegram end card).
Render: `npm run render:news-eg01` → `out/truedad-news-evil-geniuses-01.mp4` (copy in `renders/evil-geniuses-news-01/`).

Sources (release `evil-geniuses-news-01`, used unmodified):
- `public/news/evil-geniuses-01/footage.mp4` ← `1021.3.mp4` (2560×1440, 15 s screen recording, 21.10.2026)
- `public/news/evil-geniuses-01/voiceover.mp3` ← `1021.2.MP3` (38.14 s; output loudness identical to the source, −14.2 LUFS)

Word timings: `data/news/evil-geniuses-01.words.json` (GigaAM-v2 RNNT timestamps, text cross-checked with Whisper; spellings normalised: CS2, Evil Geniuses, 2024).

## Shot list (master time → footage)

| Time | Voiceover | Footage (src s) | Graphics |
|---|---|---|---|
| 0.00–3.55 | «Наклейки команды… снова начали дорожать.» | Steam weekly median chart, tooltip 21.10 16:00 $8.97 (7.7–9.6) | Headline «EVIL GENIUSES ЗАКРЫВАЕТСЯ», item name chip |
| 3.55–5.05 | «И причина довольно неожиданная:» | Steam listing: sticker + title (0.3–1.2) | — |
| 5.05–9.75 | «…объявила о полном прекращении работы со 2 ноября.» | TrueDad Telegram post (10.0–14.7) | Highlights: post title, «со 2 ноября 2026» |
| 9.75–12.35 | «После этой новости… оживление.» | Price box (+32% за месяц), «Продано в Steam» (0.0–2.1) | Highlights |
| 12.35–17.85 | «…график скакнул сразу в два раза… уверенно расти.» | Month → week chart, cursor hover (4.15–9.65, real time) | Readout of the two tooltips: $4.14 → $8.97 |
| 17.85–22.05 | «Напоминаю… покинули ещё в 2024 году,» | Sticker image, dimmed | Date card «ЯНВАРЬ 2024» |
| 22.05–24.35 | «…новых наклеек команды давно не выпускали.» | Listing title «Стокгольм-2021» | Highlight |
| 24.35–28.85 | «А значит, полное закрытие… более дефицитными.» | Sell order book (281 lots ≤ $8.37) | Note: closure doesn't reduce existing stickers |
| 28.85–31.60 | «Так что покупать… я бы не спешил.» | Weekly chart spike | «МНЕНИЕ TRUEDAD» |
| 31.60–34.30 | «Это скорее хорошая новость… продать.» | Buy order book (12 213 orders ≤ $7.68), «Продать» | Highlights |
| 34.30–39.50 | «Подробнее… в телеге и показал, что происходит с ценами.» | Telegram channel card, @truedadEducation | Telegram end card |

## Fact check
Every number on screen is read from the supplied footage: $4.14 (20.10, 23:00) and $8.97 (21.10, 16:00) are Steam
chart tooltips; 281 / $8.37 and 12 213 / $7.68 are the Steam order book; «+32% за месяц» and «Продано в Steam» are from
the listing; «2 ноября 2026» is from the Telegram post. No numbers were added beyond the footage and the voiceover.

Note for the author: the brief says EG left CS in **January 2024** (shown on the date card; the voiceover says «в 2024 году»).
The Telegram post in the footage says «по CS2 состава нет ещё с декабря 2023». Those two dates don't match.
The camera keeps that line of the post out of frame. Check the date before publishing.

Privacy: crops exclude the browser tab bar, the Steam wallet/avatar, the Windows taskbar and the Steam ad banner.

## Footage-only cut (v2)
Composition `TrueDadNewsFootage-EvilGeniuses01` (`npm run render:news-eg01-footage`), master in
`renders/evil-geniuses-news-01-footage/`. Same voiceover and recording. No titles, cards or drawn graphics, only the word captions.
Six long takes: chart hook 0–5.05, Telegram post 5.05–9.75, one continuous Steam take (price box, real scroll, month, week hover)
9.75–17.85, sticker 17.85–24.35, order book sell to buy 24.35–34.3, Telegram channel 34.3–39.5.
Effects: 1080×1300 sharp panel over the same footage blurred, slow camera moves, soft spotlights, focus-pull transitions, light grade.
Sound (branch `claude/montazh-bez-izlishestv`): the five old whooshes are replaced by a soft `swish.wav` on only two story turns (9.75 s market reaction, 34.3 s Telegram).
`review-30/` holds the 30 stills approved before rendering (taken before captions were added).
