#!/usr/bin/env python3
"""
Draws the Tumble Tips app icons from the brand mark (a tumbling arc and a dot on a pink circle).
Run from the app folder:   python3 scripts/make-icons.py      (needs: pip install pillow)

Writes into assets/:
  icon.png                        1024  opaque (App Store forbids transparency)
  splash-icon.png                 1024  white mark on transparent, shown over pink
  android-icon-foreground.png     1024  white mark on transparent, kept inside Android's safe zone
  android-icon-background.png     1024  solid pink
  android-icon-monochrome.png     1024  white mark on transparent (Android tints it)
  favicon.png                     48    web tab icon
"""
from PIL import Image, ImageDraw
import os

PINK = (230, 36, 110)          # #E6246E, the app's main colour
WHITE = (255, 255, 255)
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets')

# The mark, in the design's own coordinates (a 40 x 40 logo): an arc and a dot.
P0, P1, P2, P3 = (9, 27), (12, 16), (28, 12), (32, 23)    # cubic curve of the arc
DOT, DOT_R, STROKE = (31, 15), 3.8, 3.6
CENTER = (21.0, 20.0)                                      # visual centre of the mark

def bezier(t):
    u = 1 - t
    return tuple(u**3*a + 3*u*u*t*b + 3*u*t*t*c + t**3*d for a, b, c, d in zip(P0, P1, P2, P3))

def mark_mask(size, view, ss=4):
    """White-on-black mask of the mark. `view` = how many logo units fit across the canvas."""
    n = size * ss
    k = n / view
    m = Image.new('L', (n, n), 0)
    d = ImageDraw.Draw(m)
    to_px = lambda x, y: ((x - CENTER[0]) * k + n / 2, (y - CENTER[1]) * k + n / 2)
    r = STROKE / 2 * k
    for i in range(0, 601):                                # thick round-capped line, drawn as many discs
        x, y = to_px(*bezier(i / 600))
        d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    x, y = to_px(*DOT)
    d.ellipse([x - DOT_R * k, y - DOT_R * k, x + DOT_R * k, y + DOT_R * k], fill=255)
    return m.resize((size, size), Image.LANCZOS)

def with_mark(size, view, bg, fg=WHITE):
    mask = mark_mask(size, view)
    base = Image.new('RGBA', (size, size), bg if bg else (0, 0, 0, 0))
    base.paste(Image.new('RGBA', (size, size), fg + (255,)), (0, 0), mask)
    return base

def save(img, name, opaque=False):
    if opaque:
        img = img.convert('RGB')                           # drops the alpha channel completely
    img.save(os.path.join(OUT, name), optimize=True)
    print(f'  {name:32} {img.size[0]}x{img.size[1]}  {img.mode}')

N = 1024
save(with_mark(N, 46, PINK + (255,)), 'icon.png', opaque=True)
save(with_mark(N, 90, None), 'splash-icon.png')
save(with_mark(N, 52, None), 'android-icon-foreground.png')
save(Image.new('RGB', (N, N), PINK), 'android-icon-background.png', opaque=True)
save(with_mark(N, 52, None), 'android-icon-monochrome.png')

# Favicon: the full round logo
fav = Image.new('RGBA', (48 * 8, 48 * 8), (0, 0, 0, 0))
ImageDraw.Draw(fav).ellipse([0, 0, 48 * 8 - 1, 48 * 8 - 1], fill=PINK + (255,))
fav.paste(Image.new('RGBA', fav.size, WHITE + (255,)), (0, 0), mark_mask(48 * 8, 30, ss=2))
save(fav.resize((48, 48), Image.LANCZOS), 'favicon.png')
