"""Cut the Fracture Case out of a high-quality render on a white background.

Background = near-white pixels connected to the image border (so the white "CS:GO" plate
inside the case is kept). Edge pixels get a soft alpha and are un-mixed from white so no
white halo remains on a dark canvas.
Usage: python3 scripts/cutout-case.py public/assets/source/fracture_case_hq.webp public/assets/derived/case_cutout.png
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
rgb = np.array(Image.open(src).convert("RGB")).astype(np.float64)
h, w, _ = rgb.shape
near_white = (rgb.min(2) > 232)
flood = Image.fromarray(np.where(near_white, 255, 0).astype(np.uint8)).copy()  # own writable buffer for floodfill
for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
    if flood.getpixel(seed) == 255:
        ImageDraw.floodfill(flood, seed, 128)
bg = np.array(flood) == 128

# Soft edge: a 3 px band around the background gets alpha from how far the colour is from white.
grown = np.array(Image.fromarray((bg * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 0
band = grown & ~bg
alpha = np.ones((h, w))
alpha[bg] = 0
dist = (255 * 3 - rgb.sum(2)) / 160.0
alpha[band] = np.clip(dist[band], 0, 1)
alpha[bg] = np.clip(dist[bg], 0, 1) * 0  # pure background stays transparent
# Un-mix white from semi-transparent edge pixels: c = a*F + (1-a)*255  ->  F = (c - (1-a)*255) / a
a3 = alpha[..., None]
fg = np.where(a3 > 0.02, (rgb - (1 - a3) * 255) / np.maximum(a3, 1e-3), rgb)
fg = np.clip(fg, 0, 255)
rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
im = Image.fromarray(rgba, "RGBA")
# slight anti-alias of the alpha channel only
a = im.getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
im.putalpha(a)
bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
im = im.crop(bbox)
os.makedirs(os.path.dirname(out), exist_ok=True)
im.save(out, optimize=True)
print("saved", out, im.size)
