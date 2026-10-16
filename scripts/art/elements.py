"""Reusable scenery + creature elements drawn on a low-res Cv."""
import math
from PIL import Image, ImageDraw
from lib import *


def sky(cv, stops=None, bands=18):
    stops = stops or [(0, NAVY), (.35, INDIGO), (.6, PURPLE), (.82, MAGENTA), (1, PINK)]
    cv.img.paste(gradient(cv.w, cv.h, stops, bands), (0, 0))


def stars(cv, n, ymax=None, seed=None):
    r = cv.rng
    ymax = ymax or cv.h
    for _ in range(n):
        x, y = r.randrange(cv.w), r.randrange(int(ymax))
        c = r.choice([CREAM, CREAM, lt(CYAN, .5), SOFT, GOLD])
        cv.px(x, y, c)
        if r.random() < .12:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                cv.px(x + dx, y + dy, mix(c, NAVY, .45))
            cv.glow(x, y, 5, c, .45)


def moon(cv, x, y, r, tint=H('ffeccb')):
    cv.glow(x, y, r * 3.2, lt(GOLD, .2), .55)
    cv.glow(x, y, r * 1.8, tint, .5)
    cv.ell(x, y, r, r, mix(tint, GOLD, .25))
    cv.ell(x - r * .12, y - r * .12, r * .88, r * .88, tint)
    cv.ell(x - r * .22, y - r * .22, r * .6, r * .6, lt(tint, .45))
    rr = cv.rng
    for cx, cy, cr in [(.35, .2, .22), (-.3, .35, .16), (.1, -.35, .12), (-.35, -.2, .1), (.45, -.25, .08)]:
        cv.ell(x + cx * r, y + cy * r, max(1, cr * r), max(1, cr * r), mix(tint, GOLD, .45))
        cv.ell(x + cx * r - 1, y + cy * r - 1, max(1, cr * r * .7), max(1, cr * r * .7), mix(tint, GOLD, .22))


def cloud(cv, x, y, w, h, light, dark):
    r = cv.rng
    n = max(3, int(w / (h * .9)))
    blobs = [(x + (i + .5) / n * w + r.randint(-2, 2), y + r.randint(-h // 4, h // 6), r.uniform(.55, .95) * h * .6 + 2) for i in range(n)]
    for bx, by, br in blobs:
        cv.ell(bx, by + h * .12, br * 1.4, br * .8, dark)
    cv.rect(int(x), int(y + h * .1), int(x + w), int(y + h * .35), dark)
    for bx, by, br in blobs:
        cv.ell(bx, by - 1, br * 1.3, br * .72, mix(dark, light, .55))
        cv.ell(bx - br * .2, by - br * .3, br * .95, br * .5, light)


def clouds(cv, ys, light, dark, count, wr=(50, 110), hr=(8, 16)):
    r = cv.rng
    for _ in range(count):
        cloud(cv, r.randint(-20, cv.w - 30), r.randint(*ys), r.randint(*wr), r.randint(*hr), light, dark)


def ridge(cv, base, amp, top, bot, seed, scale=60, mist=None, rim=None, x0=0, x1=None):
    x1 = x1 or cv.w
    n = x1 - x0
    hs = fbm1d(n, seed, scale, 4)
    pts = [(0, cv.h)] + [(i, base - amp * hs[i]) for i in range(n)] + [(n - 1, cv.h)]
    m = Image.new('L', (cv.w, cv.h), 0)
    ImageDraw.Draw(m).polygon([(x0 + a, b) for a, b in pts], fill=255)
    ytop = max(0, int(base - amp - 2))
    cv.fill_gradient_mask(m, (0, ytop, cv.w, cv.h), top, bot, 10)
    if rim:
        for i in range(n):
            cv.px(x0 + i, int(base - amp * hs[i]), rim)
    return [base - amp * hs[i] for i in range(n)]


def pine(cv, x, base, h, col, hl):
    tiers = max(3, int(h / 9))
    cv.rect(x - 1, base - 4, x + 1, base, dk(col, .4))
    for i in range(tiers):
        t = i / tiers
        yb = base - 3 - (h - 3) * t * .82
        wd = (h * .32) * (1 - t * .75)
        yt = yb - h / tiers * 1.7
        cv.poly([(x - wd, yb), (x + wd, yb), (x, yt)], col)
        cv.poly([(x - wd, yb), (x, yb), (x, yt)], mix(col, hl, .5))
        cv.px(x - int(wd), int(yb), dk(col, .3))


def roundtree(cv, x, base, h, trunk, leaf, hl, lights=None):
    r = cv.rng
    tw = max(2, int(h * .06))
    cv.rect(x - tw, base - h * .55, x + tw, base, trunk)
    cv.rect(x - tw, base - h * .55, x - tw // 2, base, lt(trunk, .25))
    cv.poly([(x, base - h * .3), (x - tw * 3, base - h * .42), (x - tw, base - h * .38)], trunk)
    cw = h * .38
    cy = base - h * .72
    blobs = [(x + r.uniform(-1, 1) * cw * .8, cy + r.uniform(-.7, .6) * cw * .7, r.uniform(.45, .8) * cw) for _ in range(7)]
    blobs.append((x, cy, cw * .9))
    for bx, by, br in blobs:
        cv.ell(bx, by, br, br * .85, dk(leaf, .25))
    for bx, by, br in blobs:
        cv.ell(bx - br * .1, by - br * .12, br * .85, br * .72, leaf)
    for bx, by, br in blobs:
        cv.ell(bx - br * .28, by - br * .32, br * .5, br * .38, hl)
    if lights:
        for _ in range(int(h * .35)):
            lx, ly = x + r.uniform(-1, 1) * cw * 1.1, cy + r.uniform(-1, 1) * cw * .8
            cv.px(lx, ly, lights)
        for _ in range(3):
            cv.glow(x + r.uniform(-1, 1) * cw, cy + r.uniform(-1, 1) * cw * .7, 6, lights, .35)


def crystal(cv, x, base, h, w, col, tilt=0, glow=True):
    cx = x + tilt * .25
    top_y = base - h
    sh = base - h * .72
    bl, br = (x - w / 2, base), (x + w / 2, base)
    tl, tr = (x - w / 2 + tilt * .5, sh), (x + w / 2 + tilt * .5, sh)
    tip = (x + tilt, top_y)
    cb, ct = (x + w * .1, base), (x + w * .1 + tilt * .5, sh)
    cv.poly([bl, br, tr, tip, tl], dk(col, .65))
    cv.poly([(bl[0] + 1, bl[1]), cb, ct, (tl[0] + 1, tl[1])], col)
    cv.poly([cb, (br[0] - 1, br[1]), (tr[0] - 1, tr[1]), ct], dk(col, .35))
    cv.poly([(tl[0] + 1, tl[1]), ct, (tip[0], tip[1] + 1)], lt(col, .45))
    cv.poly([ct, (tr[0] - 1, tr[1]), (tip[0], tip[1] + 1)], lt(col, .1))
    cv.line([(bl[0] + 2, bl[1] - 2), (tl[0] + 2, tl[1] + 1)], lt(col, .65))
    if glow:
        cv.glow(x + tilt * .4, base - h * .5, h * .9 + 6, col, .5)


def crystal_cluster(cv, x, base, s, col, alt=None):
    alt = alt or lt(col, .2)
    spec = [(-.9, .55, .22, -2, alt), (.9, .5, .2, 2, alt), (-.45, .8, .26, -1, col), (.5, .95, .28, 2, col), (0, 1.15, .3, 0, lt(col, .15)), (1.3, .3, .15, 3, col), (-1.3, .3, .15, -3, col)]
    for dx, hh, ww, tl, c in sorted(spec, key=lambda s_: s_[1]):
        crystal(cv, x + dx * s * .45, base, hh * s, max(3, ww * s), c, tl * s * .1)


def mushroom(cv, x, base, s, cap, glowcol=None):
    stem = CREAM
    cv.rect(x - s * .18, base - s * .6, x + s * .18, base, mix(stem, cap, .1))
    cv.rect(x - s * .18, base - s * .6, x - s * .06, base, lt(stem, .3))
    cv.ell(x, base - s * .62, s * .6, s * .45, dk(cap, .35))
    cv.ell(x - s * .03, base - s * .68, s * .56, s * .4, cap)
    cv.ell(x - s * .2, base - s * .8, s * .3, s * .17, lt(cap, .45))
    for dx, dy in ((-.25, -.55), (.18, -.78), (.3, -.5)):
        cv.ell(x + dx * s, base + dy * s, max(1, s * .08), max(1, s * .06), CREAM)
    if glowcol:
        cv.glow(x, base - s * .6, s * 1.6, glowcol, .55)


def flower(cv, x, base, h, col, center=GOLD, petals=5):
    stem = H('2f8f6a')
    cv.line([(x, base), (x + 1, base - h * .5), (x, base - h)], stem)
    cv.poly([(x, base - h * .4), (x + 4, base - h * .55), (x + 1, base - h * .32)], H('45b887'))
    r = max(2, h * .16)
    for i in range(petals):
        a = i / petals * 2 * math.pi - math.pi / 2
        cv.ell(x + math.cos(a) * r, base - h + math.sin(a) * r, r * .75, r * .75, col)
        cv.px(x + math.cos(a) * r - 1, base - h + math.sin(a) * r - 1, lt(col, .5))
    cv.ell(x, base - h, r * .55, r * .55, center)
    cv.glow(x, base - h, r * 3.5, col, .35)


def grass(cv, y, color, hl, density=.55, h=(3, 7), x0=0, x1=None):
    r = cv.rng
    x1 = x1 or cv.w
    for x in range(x0, x1):
        if r.random() < density:
            hh = r.randint(*h)
            c = r.choice([color, hl])
            cv.line([(x, y), (x + r.randint(-1, 1), y - hh)], c)


def lantern(cv, x, y, s, col=GOLD, chain=0):
    if chain:
        cv.line([(x, y - chain), (x, y - s * .9)], dk(GOLD, .5))
    cv.glow(x, y, s * 4, col, .8)
    cv.rect(x - s * .3, y - s * .95, x + s * .3, y - s * .75, dk(GOLD, .35))
    cv.poly([(x - s * .45, y - s * .75), (x + s * .45, y - s * .75), (x, y - s * 1.15)], dk(GOLD, .45))
    cv.rect(x - s * .4, y - s * .7, x + s * .4, y + s * .5, mix(col, H('ff9a3c'), .5))
    cv.rect(x - s * .25, y - s * .55, x + s * .25, y + s * .35, lt(col, .65))
    cv.rect(x - s * .45, y + s * .5, x + s * .45, y + s * .7, dk(GOLD, .45))
    cv.line([(x, y - s * .7), (x, y + s * .5)], dk(GOLD, .45))


def firefly(cv, x, y, col=GOLD, r=5):
    cv.px(x, y, lt(col, .6))
    cv.glow(x, y, r, col, .85)


def fireflies(cv, n, box, col=GOLD):
    r = cv.rng
    for _ in range(n):
        firefly(cv, r.randint(box[0], box[2]), r.randint(box[1], box[3]), r.choice([col, lt(CYAN, .3), SOFT]), r.randint(4, 7))


def sparkle(cv, x, y, s, col=CREAM):
    for i in range(1, s + 1):
        c = mix(col, NAVY, i / (s + 1) * .5)
        for dx, dy in ((i, 0), (-i, 0), (0, i), (0, -i)):
            cv.px(x + dx, y + dy, c)
    cv.px(x, y, WHITE)
    cv.glow(x, y, s * 2.5 + 2, col, .55)


def sparkles(cv, n, box, s=(1, 3), cols=(CREAM, SOFT, CYAN, GOLD)):
    r = cv.rng
    for _ in range(n):
        sparkle(cv, r.randint(box[0], box[2]), r.randint(box[1], box[3]), r.randint(*s), r.choice(cols))


def water(cv, y0, y1, top, bot, moon_x=None, x0=0, x1=None):
    x1 = x1 or cv.w
    g = gradient(x1 - x0, y1 - y0, [(0, top), (1, bot)], 8)
    cv.img.paste(g, (x0, y0))
    r = cv.rng
    for _ in range((x1 - x0) * (y1 - y0) // 60):
        x, y = r.randint(x0, x1 - 6), r.randint(y0 + 1, y1 - 1)
        cv.line([(x, y), (x + r.randint(2, 6), y)], lt(top, .25 + .1 * ((y - y0) < (y1 - y0) / 2)))
    if moon_x is not None:
        for y in range(y0 + 1, y1, 2):
            wd = 3 + (y - y0) * .35
            cv.line([(moon_x - wd + r.randint(-2, 2), y), (moon_x + wd + r.randint(-2, 2), y)], lt(GOLD, .45))
        cv.glow(moon_x, y0 + 4, 30, GOLD, .25)


def waterfall(cv, x, top, bottom, w, light=lt(CYAN, .6), mid=CYAN, dark=TEAL):
    r = cv.rng
    cv.rect(x - w // 2, top, x + w // 2, bottom, mid)
    for xx in range(x - w // 2, x + w // 2 + 1):
        c = r.choice([light, mid, mid, lt(mid, .3), dark])
        y = top
        while y < bottom:
            ln = r.randint(3, 12)
            cv.line([(xx, y), (xx, y + ln)], c)
            y += ln + r.randint(0, 6)
            c = r.choice([light, mid, lt(mid, .35), dark])
    cv.line([(x - w // 2, top), (x - w // 2, bottom)], dk(mid, .3))
    cv.glow(x, (top + bottom) / 2, w * 2.2 + (bottom - top) * .5, CYAN, .45)
    for i in range(18):
        mx = x + r.randint(-w, w)
        cv.ell(mx, bottom + r.randint(-1, 2), r.randint(2, 5), r.randint(1, 3), lt(CYAN, .75))
    cv.glow(x, bottom, w * 2.5, lt(CYAN, .5), .55)


def cliff(cv, x0, x1, top, base, col, hl, seed):
    r = cv.rng
    pts = [(x0, base)]
    n = 10
    for i in range(n + 1):
        pts.append((x0 + (x1 - x0) * i / n, top + r.randint(-3, 3)))
    pts.append((x1, base))
    cv.poly(pts, col)
    for _ in range((x1 - x0) * (base - top) // 30):
        x, y = r.randint(x0, x1 - 3), r.randint(top + 3, base - 2)
        cv.line([(x, y), (x + r.randint(1, 4), y)], r.choice([hl, dk(col, .4)]))
    cv.line([(x0, base), (x0, top)], hl)


def tower(cv, x, base, w, h, col, roof, win=GOLD, flag=None):
    cv.rect(x - w // 2, base - h, x + w // 2, base, col)
    cv.rect(x - w // 2, base - h, x - w // 2 + max(1, w // 4), base, lt(col, .12))
    cv.rect(x + w // 2 - max(1, w // 4), base - h, x + w // 2, base, dk(col, .25))
    ov = int(w * .2) + 1
    cv.poly([(x - w / 2 - ov, base - h + 1), (x + w / 2 + ov, base - h + 1), (x, base - h - w * 1.5)], roof)
    cv.poly([(x - w / 2 - ov, base - h + 1), (x, base - h + 1), (x, base - h - w * 1.5)], lt(roof, .2))
    if win:
        for i in range(max(1, int(h // 14))):
            wy = base - h + 5 + i * 12
            if wy < base - 4:
                cv.rect(x - 1, wy, x, wy + 3, win)
                cv.glow(x, wy + 1, 5, win, .8)
    if flag:
        ty = base - h - w * 1.5
        cv.line([(x, ty), (x, ty - 6)], dk(col, .3))
        cv.poly([(x, ty - 6), (x + 5, ty - 4), (x, ty - 2)], flag)


def castle(cv, x, base, s, col, roof, win=GOLD, flag=PINK):
    cv.rect(x - s * .7, base - s * .55, x + s * .7, base, col)
    cv.rect(x - s * .7, base - s * .55, x - s * .5, base, lt(col, .12))
    for i in range(7):
        wx = x - s * .6 + i * s * .2
        cv.rect(wx, base - s * .6, wx + s * .09, base - s * .55, col)
    tower(cv, x, base, s * .3, s * 1.2, col, roof, win, flag)
    tower(cv, x - s * .62, base, s * .24, s * .85, col, roof, win)
    tower(cv, x + s * .62, base, s * .24, s * .95, col, roof, win, flag)
    tower(cv, x - s * .3, base, s * .18, s * .7, col, dk(roof, .15), win)
    tower(cv, x + s * .32, base, s * .18, s * .75, col, dk(roof, .15), win)
    cv.poly([(x - s * .1, base), (x - s * .1, base - s * .22), (x, base - s * .3), (x + s * .1, base - s * .22), (x + s * .1, base)], win)
    for wx in (-.5, .5):
        cv.rect(x + s * wx, base - s * .36, x + s * wx + 1, base - s * .3, win)
        cv.glow(x + s * wx, base - s * .33, 5, win, .8)
    cv.glow(x, base - s * .1, s * .5, win, .5)


def forest_layer(cv, base, hs, kind, cols, step=(10, 18), seed=0, lights=None, skip=None):
    r = cv.rng
    x = r.randint(-5, 10)
    while x < cv.w + 10:
        h = r.randint(*hs)
        if skip and skip[0] <= x <= skip[1]:
            x += r.randint(*step)
            continue
        if kind == 'pine':
            pine(cv, x, base + r.randint(-2, 2), h, cols[0], cols[1])
        else:
            roundtree(cv, x, base + r.randint(-2, 2), h, cols[2] if len(cols) > 2 else dk(cols[0], .5), cols[0], cols[1], lights)
        x += r.randint(*step)


def fog(cv, y, h, col, k=.35, seed=0):
    cv.fogs.append((y, h, col, k))
