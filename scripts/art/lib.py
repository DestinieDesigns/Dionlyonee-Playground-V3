"""Pixel-art primitives for the Destinie art pack (procedural, deterministic)."""
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def H(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


NAVY, INDIGO, PURPLE, VIOLET = H('080A18'), H('151B3E'), H('6A35C9'), H('A64DFF')
MAGENTA, PINK, SOFT, CYAN = H('D94CF2'), H('FF66B8'), H('FFB6D9'), H('57DDF5')
TEAL, GOLD, CREAM = H('238F9D'), H('FFD166'), H('FFF3DF')
WHITE = (255, 255, 255)
OUT = H('1a0f2e')  # outline colour


def mix(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def lt(c, t):
    return mix(c, WHITE, t)


def dk(c, t):
    return mix(c, NAVY, t)


BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0


def gradient(w, h, stops, bands=16, horizontal=False):
    """Ordered-dither banded gradient (pixel-art look). stops: [(pos, rgb)]."""
    ys, xs = np.mgrid[0:h, 0:w]
    t = (xs / max(w - 1, 1)) if horizontal else (ys / max(h - 1, 1))
    t = np.clip(np.floor(t * bands + BAYER[ys % 4, xs % 4]) / bands, 0, 1)
    pos = [s[0] for s in stops]
    out = np.stack([np.interp(t, pos, [s[1][i] for s in stops]) for i in range(3)], -1)
    a = np.full((h, w, 1), 255)
    return Image.fromarray(np.concatenate([out, a], -1).astype('uint8'), 'RGBA')


def noise2d(w, h, scale, seed, octaves=4):
    rng = np.random.default_rng(seed)
    acc = np.zeros((h, w))
    amp, tot = 1.0, 0
    for o in range(octaves):
        gw, gh = max(2, int(w / scale * 2 ** o) + 2), max(2, int(h / scale * 2 ** o) + 2)
        g = Image.fromarray((rng.random((gh, gw)) * 255).astype('uint8'))
        acc += np.asarray(g.resize((w, h), Image.BICUBIC)) / 255.0 * amp
        tot += amp
        amp *= 0.5
    acc /= tot
    return (acc - acc.min()) / (acc.max() - acc.min() + 1e-9)


def fbm1d(n, seed, scale=40, octaves=4):
    return noise2d(n, 4, scale, seed, octaves)[1]


class Cv:
    """Low-res canvas + deferred smooth glows that are rendered at full resolution."""

    def __init__(self, w, h, transparent=False, seed=1):
        self.w, self.h = w, h
        self.img = Image.new('RGBA', (w, h), (0, 0, 0, 0) if transparent else NAVY + (255,))
        self.d = ImageDraw.Draw(self.img)
        self.glows = []
        self.fogs = []
        self.rng = random.Random(seed)
        self.seed = seed
        self.transparent = transparent

    # -- drawing ---------------------------------------------------------
    def px(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.img.putpixel((int(x), int(y)), tuple(c[:3]) + (255,))

    def rect(self, x0, y0, x1, y1, c):
        self.d.rectangle([x0, y0, x1, y1], fill=tuple(c[:3]) + (255,))

    def ell(self, cx, cy, rx, ry, c):
        self.d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=tuple(c[:3]) + (255,))

    def poly(self, pts, c):
        self.d.polygon([(int(x), int(y)) for x, y in pts], fill=tuple(c[:3]) + (255,))

    def line(self, pts, c, w=1):
        self.d.line([(int(x), int(y)) for x, y in pts], fill=tuple(c[:3]) + (255,), width=w)

    def glow(self, x, y, r, c, k=1.0):
        self.glows.append((x, y, r, c, k))

    def paste(self, im, x, y):
        self.img.alpha_composite(im, (int(x), int(y)))

    def fill_gradient_mask(self, mask, box, top, bot, bands=8):
        x0, y0, x1, y1 = box
        g = gradient(x1 - x0, y1 - y0, [(0, top), (1, bot)], bands)
        self.img.paste(g, (x0, y0), mask.crop(box))

    # -- finishing -------------------------------------------------------
    def render(self, scale, bloom=0.2, vignette=0.0, size=None, pad=0):
        im = self.img.resize((self.w * scale, self.h * scale), Image.NEAREST)
        if pad:
            big = Image.new('RGBA', ((self.w + 2 * pad) * scale, (self.h + 2 * pad) * scale), (0, 0, 0, 0))
            big.paste(im, (pad * scale, pad * scale))
            im = big
        arr = np.asarray(im).astype(np.float32) / 255.0
        rgb, a = arr[..., :3], arr[..., 3:4]
        P = rgb * a
        H_, W_ = arr.shape[:2]
        for i, (fy, fh, fc, fk) in enumerate(self.fogs):
            n = noise2d(W_, H_, 140 * scale / 4, self.seed * 31 + i, 3)
            yy = np.arange(H_)[:, None]
            band = np.clip(1 - np.abs(yy - fy * scale) / (fh * scale), 0, 1) ** 1.5
            g = (band * (0.35 + 0.9 * n) * fk)[..., None]
            P = P * (1 - g) + np.array(fc, np.float32) / 255.0 * g
        for (x, y, r, c, k) in self.glows:
            X, Y, R = (x + pad + 0.5) * scale, (y + pad + 0.5) * scale, r * scale
            x0, x1 = int(max(0, X - R)), int(min(W_, X + R + 1))
            y0, y1 = int(max(0, Y - R)), int(min(H_, Y + R + 1))
            if x1 <= x0 or y1 <= y0:
                continue
            yy, xx = np.mgrid[y0:y1, x0:x1]
            dist = np.sqrt((xx - X) ** 2 + (yy - Y) ** 2) / R
            g = np.clip(1 - dist, 0, 1) ** 2.2 * k
            P[y0:y1, x0:x1] += g[..., None] * (np.array(c, np.float32) / 255.0)
            a[y0:y1, x0:x1] = np.clip(a[y0:y1, x0:x1] + g[..., None] - a[y0:y1, x0:x1] * g[..., None], 0, 1)
        P = np.clip(P, 0, 1)
        if not self.transparent and bloom > 0:
            lum = P.max(-1, keepdims=True)
            bright = np.clip((lum - 0.72) / 0.28, 0, 1) * P
            bi = Image.fromarray((bright * 255).astype('uint8'))
            b1 = np.asarray(bi.filter(ImageFilter.GaussianBlur(3 * scale / 4 + 2))).astype(np.float32) / 255
            b2 = np.asarray(bi.filter(ImageFilter.GaussianBlur(10 * scale / 4 + 4))).astype(np.float32) / 255
            P = 1 - (1 - P) * (1 - np.clip(b1 * bloom + b2 * bloom, 0, 1))
        if vignette > 0:
            yy, xx = np.mgrid[0:H_, 0:W_]
            d = np.sqrt(((xx - W_ / 2) / (W_ / 2)) ** 2 + ((yy - H_ / 2) / (H_ / 2)) ** 2)
            P = P * (1 - vignette * np.clip(d - 0.55, 0, 1.2)[..., None])
        if self.transparent:
            rgb = np.where(a > 1e-4, P / np.maximum(a, 1e-4), 0)
            out = np.concatenate([np.clip(rgb, 0, 1), a], -1)
            res = Image.fromarray((out * 255 + 0.5).astype('uint8'), 'RGBA')
        else:
            res = Image.fromarray((P * 255 + 0.5).astype('uint8'), 'RGB')
        if size and res.size != size:
            res = res.resize(size, Image.LANCZOS)
        return res


def outline_layer(im, color=OUT, thick=1):
    """Return RGBA image with a dark outline added behind the opaque pixels."""
    a = im.split()[3].point(lambda v: 255 if v > 0 else 0)
    big = a.filter(ImageFilter.MaxFilter(2 * thick + 1))
    out = Image.new('RGBA', im.size, color + (0,))
    out.putalpha(big)
    out.alpha_composite(im)
    return out
