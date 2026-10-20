"""Digitize the Steam "Median Sale Prices / Year" line from a real screenshot.

The output is only as accurate as the screenshot pixels (approx. +/-1 RUB);
it is used to redraw the real curve, never to invent data.
Usage: python3 scripts/digitize-chart.py public/assets/proof/steam_chart.jpg data/day01.chart.json
"""
import json, sys
from datetime import date, timedelta
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert("RGB")).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
# Steam draws the price line in yellow-green; volume bars are blue.
mask = (g > 140) & (r > 110) & (b < 120) & (g > b + 60)
# Plot area measured on the screenshot: x 163..1143, y(0 RUB)=1040, y(100 RUB)=759
X0, X1, Y0, Y100 = 163, 1143, 1040, 759
# Date ticks: 11/28/2025 at x=279, 10/20/2026 at x=1127
T0x, T1x = 279, 1127
d0, d1 = date(2025, 11, 28), date(2026, 10, 20)
px_per_day = (T1x - T0x) / (d1 - d0).days
pts = []
for x in range(X0, X1):
    ys = np.where(mask[740:1045, x])[0]
    if len(ys) == 0:
        continue
    y = 740 + float(np.median(ys))
    price = (Y0 - y) / (Y0 - Y100) * 100
    day = d0 + timedelta(days=round((x - T0x) / px_per_day))
    pts.append({"date": day.isoformat(), "rub": round(price, 1)})
# one point per day
seen, series = set(), []
for p in pts:
    if p["date"] not in seen:
        seen.add(p["date"]); series.append(p)
peak = max(series, key=lambda p: p["rub"])
json.dump({
    "source": "Steam Community Market, Fracture Case, Median Sale Prices (Year), screenshot 2026-10-20",
    "method": "pixel-digitized from public/assets/proof/steam_chart.jpg, approx. +/-1 RUB",
    "peak": peak, "last": series[-1], "series": series,
}, open(out, "w"), ensure_ascii=False, indent=1)
print(len(series), "points; first", series[0], "peak", peak, "last", series[-1])
