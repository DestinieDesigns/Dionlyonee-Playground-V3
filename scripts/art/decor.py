"""Transparent decorative overlays."""
from thumbs import star_poly
from chars import *


def T(w=128, h=128, seed=1):
    return Cv(w, h, transparent=True, seed=seed)


def d_sparkles():
    cv = T(seed=61)
    r = cv.rng
    pts = [(64, 64, 9, CREAM), (28, 30, 5, SOFT), (100, 36, 6, CYAN), (36, 98, 6, GOLD), (96, 100, 5, SOFT), (64, 22, 3, WHITE), (112, 70, 3, CYAN), (14, 66, 3, GOLD), (70, 108, 3, PINK), (50, 52, 2, CREAM), (82, 48, 2, SOFT)]
    for x, y, s, c in pts:
        sparkle(cv, x, y, s, c)
    for _ in range(26):
        x, y = r.randint(6, 121), r.randint(6, 121)
        cv.px(x, y, r.choice([CREAM, SOFT, CYAN, GOLD]))
        cv.glow(x, y, 3, WHITE, .3)
    return cv


def d_fireflies():
    cv = T(seed=62)
    r = cv.rng
    for _ in range(16):
        x, y = r.randint(10, 118), r.randint(10, 118)
        c = r.choice([GOLD, GOLD, lt(CYAN, .3), SOFT, lt(GOLD, .4)])
        cv.ell(x, y, 1, 1, lt(c, .6))
        cv.px(x - 1, y, c); cv.px(x + 1, y, c)
        cv.glow(x, y, r.randint(7, 13), c, .9)
    return cv


def d_crystals():
    cv = T(seed=63)
    cv.glow(64, 80, 44, CYAN, .45)
    crystal_cluster(cv, 64, 112, 78, CYAN, lt(CYAN, .3))
    crystal(cv, 22, 112, 26, 7, VIOLET, -2)
    crystal(cv, 106, 112, 24, 6, MAGENTA, 2)
    sparkles(cv, 6, (10, 10, 118, 70), (1, 3), (CREAM, CYAN, SOFT))
    return cv


def d_vines():
    cv = T(seed=64)
    G, GD = H('2f8f6a'), H('1d5f4a')
    pts = []
    for i in range(0, 121, 2):
        t = i / 120
        pts.append((8 + i, 100 - t * 70 + math.sin(t * 9) * 14))
    cv.line(pts, GD, 3)
    cv.line([(x, y - 1) for x, y in pts], G, 2)
    r = cv.rng
    for i in range(4, len(pts) - 2, 4):
        x, y = pts[i]
        sgn = 1 if (i // 4) % 2 else -1
        cv.poly([(x, y), (x + 8, y + sgn * 9), (x + 2, y + sgn * 12)], H('45b887'))
        cv.poly([(x, y), (x + 5, y + sgn * 7), (x + 2, y + sgn * 12)], lt(H('45b887'), .25))
    for k, (i, c) in enumerate(((10, PINK), (24, SOFT), (38, MAGENTA), (50, PINK))):
        x, y = pts[i]
        y -= 7
        for a in range(5):
            ang = a / 5 * 6.283
            cv.ell(x + math.cos(ang) * 4, y + math.sin(ang) * 4, 3.2, 3.2, c)
            cv.px(x + math.cos(ang) * 4 - 1, y + math.sin(ang) * 4 - 1, lt(c, .6))
        cv.ell(x, y, 2.2, 2.2, GOLD)
        cv.glow(x, y, 11, c, .5)
    return cv


def d_stars():
    cv = T(seed=65)
    for x, y, R, rot in ((64, 66, 40, -1.57), (24, 26, 15, -1.3), (104, 30, 12, -1.8), (100, 100, 16, -1.5), (28, 104, 10, -1.57)):
        star_poly(cv, x, y, R + 2, R * .46, dk(GOLD, .45), rot)
        star_poly(cv, x, y, R, R * .42, GOLD, rot)
        star_poly(cv, x - 1, y - 1, R * .6, R * .26, lt(GOLD, .55), rot)
        cv.glow(x, y, R * 1.8, GOLD, .6)
    sparkles(cv, 8, (8, 8, 120, 120), (1, 2), (CREAM, GOLD))
    return cv


def d_moon():
    cv = T(seed=66)
    cx, cy, R = 62, 66, 46
    m = Image.new('L', (128, 128), 0)
    md = ImageDraw.Draw(m)
    md.ellipse([cx - R, cy - R, cx + R, cy + R], fill=255)
    md.ellipse([cx - R + 22, cy - R - 8, cx + R + 22, cy + R - 8], fill=0)
    cv.fill_gradient_mask(m, (0, 0, 128, 128), lt(GOLD, .55), dk(GOLD, .1), 8)
    cv.glow(cx - 20, cy, 56, GOLD, .5)
    for x, y, s in ((100, 30, 3), (108, 74, 2), (92, 104, 2), (20, 20, 2)):
        sparkle(cv, x, y, s, CREAM)
    star_poly(cv, 98, 56, 9, 4, GOLD)
    cv.glow(98, 56, 16, GOLD, .7)
    return cv


def soft_noise_png(w, h, seed, tint_hi, tint_lo, thr, gain, scale):
    n = noise2d(w, h, scale, seed, 5)
    a = np.clip((n - thr) / (1 - thr), 0, 1) ** .9 * gain
    yy, xx = np.mgrid[0:h, 0:w]
    fx = np.minimum(xx, w - 1 - xx) / (w * .22)
    fy = np.minimum(yy, h - 1 - yy) / (h * .3)
    edge = np.clip(np.minimum(fx, fy), 0, 1)
    edge = edge * edge * (3 - 2 * edge)
    a = a * edge
    # light from top
    light = np.clip(1 - yy / h * .8 + (n - .5), 0, 1)[..., None]
    hi, lo = np.array(tint_hi, float), np.array(tint_lo, float)
    rgb = lo + (hi - lo) * light
    out = np.concatenate([rgb, (a * 255)[..., None]], -1)
    return Image.fromarray(np.clip(out, 0, 255).astype('uint8'), 'RGBA')


def d_cloud():
    return soft_noise_png(1024, 512, 71, (255, 230, 245), (150, 100, 210), .42, 1.0, 120)


def d_mist():
    return soft_noise_png(1024, 512, 72, (200, 250, 255), (140, 120, 235), .3, .55, 180)
