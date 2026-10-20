"""Cut the Fracture Case render out of the real inventory screenshot (alpha via convex hull of the yellow body).
Usage: python3 scripts/cutout-case.py public/assets/proof/inventory_20.jpg public/assets/derived/case_cutout.png
"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
box = (410, 195, 1065, 600)  # case region in the 1500x890 screenshot
im = Image.open(src).convert("RGB").crop(box)
a = np.array(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
yellow = (r > 120) & (g > 90) & (b < 110) & (r - b > 70)
ys, xs = np.nonzero(yellow)
pts = sorted(set(zip(xs.tolist(), ys.tolist())))

def cross(o, p, q):
    return (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0])

lower, upper = [], []
for p in pts:
    while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0: lower.pop()
    lower.append(p)
for p in reversed(pts):
    while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0: upper.pop()
    upper.append(p)
hull = lower[:-1] + upper[:-1]
mask = Image.new("L", im.size, 0)
ImageDraw.Draw(mask).polygon(hull, fill=255)
mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))
im.putalpha(mask)
os.makedirs(os.path.dirname(out), exist_ok=True)
im.save(out)
print("saved", out, im.size)
