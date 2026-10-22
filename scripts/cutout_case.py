"""Cut the case out of a CS2 'new item' still by colour (real pixels, alpha only):
python3 scripts/cutout_case.py in.png out.png"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

im = Image.open(sys.argv[1]).convert('RGB')
a = np.asarray(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
# the case is warm (r > b) even in shadow; the background is cool grey. Enclosed parts (logo, padlock) are filled below
mask = ((r - b > 14) & (r > 40)).astype(np.uint8) * 255
m = Image.fromarray(mask).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
# keep only the biggest blob: flood the background from the border, everything else is the case
inv = Image.eval(m, lambda v: 255 - v)
ImageDraw.floodfill(inv, (0, 0), 128)
arr = np.asarray(inv)
case = (arr != 128).astype(np.uint8) * 255
# drop small specks outside the case (text fragments) by an opening
alpha = Image.fromarray(case).filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15))
alpha = alpha.filter(ImageFilter.GaussianBlur(2.2))
out = im.convert('RGBA')
out.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
out.crop(bbox).save(sys.argv[2])
print(bbox)
