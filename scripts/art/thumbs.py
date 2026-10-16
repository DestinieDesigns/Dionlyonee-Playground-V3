"""Game thumbnails: 400x225 low-res -> 800x450. One distinct composition per game."""
from creatures import *

W, HH = 400, 225


def base(seed, top, mid, bot, moon_xy=None, ridge_col=None, ground=True, gcol=None):
    cv = Cv(W, HH, seed=seed)
    sky(cv, [(0, top), (.55, mid), (1, bot)], 16)
    stars(cv, 90, 110)
    if moon_xy:
        moon(cv, moon_xy[0], moon_xy[1], moon_xy[2])
    rc = ridge_col or dk(PURPLE, .55)
    ridge(cv, 160, 28, rc, dk(rc, .4), seed, 50, rim=lt(rc, .2))
    if ground:
        g = gcol or dk(TEAL, .5)
        ridge(cv, 198, 10, g, NAVY, seed + 1, 30, rim=lt(g, .3))
        grass(cv, 204, dk(g, .1), lt(g, .2), .5, (3, 6))
        for _ in range(14):
            flower(cv, cv.rng.randint(5, W - 5), cv.rng.randint(204, 220), cv.rng.randint(5, 10), cv.rng.choice([PINK, SOFT, CYAN, GOLD, MAGENTA]))
    return cv


def star_poly(cv, x, y, R, r, c, rot=-math.pi / 2):
    pts = []
    for i in range(10):
        rr = R if i % 2 == 0 else r
        a = rot + i * math.pi / 5
        pts.append((x + math.cos(a) * rr, y + math.sin(a) * rr))
    cv.poly(pts, c)


def bottle(cv, x, base_y, s, liquid, glass=CREAM):
    cv.rect(x - s * .18, base_y - s * 1.45, x + s * .18, base_y - s * 1.1, glass)
    cv.rect(x - s * .24, base_y - s * 1.6, x + s * .24, base_y - s * 1.45, H('8a5a3a'))
    cv.ell(x, base_y - s * .5, s * .65, s * .6, dk(liquid, .4))
    cv.ell(x, base_y - s * .5, s * .58, s * .53, liquid)
    cv.ell(x - s * .22, base_y - s * .62, s * .2, s * .28, lt(liquid, .6))
    cv.rect(x - s * .18, base_y - s * 1.1, x - s * .1, base_y - s * .9, lt(glass, .3))
    cv.glow(x, base_y - s * .6, s * 1.9, liquid, .6)


def orb_face(cv, x, y, r, col, kind):
    cv.glow(x, y, r * 2.2, col, .5)
    cv.ell(x, y, r, r, dk(col, .35))
    cv.ell(x, y, r - 1, r - 1, col)
    cv.ell(x - r * .25, y - r * .35, r * .5, r * .3, lt(col, .5))
    e = r * .32
    ink = H('2a1530')
    if kind == 0:   # happy
        cv.ell(x - e, y - e * .3, 1.5, 2, ink); cv.ell(x + e, y - e * .3, 1.5, 2, ink)
        cv.d.arc([x - r * .5, y - r * .1, x + r * .5, y + r * .6], 20, 160, fill=ink + (255,), width=2)
    elif kind == 1:  # surprised
        cv.ell(x - e, y - e * .3, 2, 2.5, ink); cv.ell(x + e, y - e * .3, 2, 2.5, ink)
        cv.ell(x, y + r * .4, r * .18, r * .24, ink)
    elif kind == 2:  # wink
        cv.ell(x - e, y - e * .3, 1.5, 2, ink)
        cv.line([(x + e - 2, y - e * .3), (x + e + 2, y - e * .3)], ink)
        cv.d.arc([x - r * .4, y, x + r * .5, y + r * .6], 10, 150, fill=ink + (255,), width=2)
    elif kind == 3:  # heart eyes
        for sx in (-1, 1):
            cv.ell(x + sx * e - 1, y - e * .5, 1.5, 1.5, PINK); cv.ell(x + sx * e + 1, y - e * .5, 1.5, 1.5, PINK)
            cv.poly([(x + sx * e - 3, y - e * .4), (x + sx * e + 3, y - e * .4), (x + sx * e, y + e * .3)], PINK)
        cv.d.arc([x - r * .45, y, x + r * .45, y + r * .55], 20, 160, fill=ink + (255,), width=2)
    else:            # thinking
        cv.ell(x - e, y - e * .3, 1.5, 2, ink); cv.ell(x + e, y - e * .3, 1.5, 2, ink)
        cv.line([(x - r * .3, y + r * .45), (x + r * .3, y + r * .35)], ink, 2)


def note(cv, x, y, s, c):
    cv.ell(x, y, s * .55, s * .4, c)
    cv.rect(x + s * .45, y - s * 1.6, x + s * .6, y, c)
    cv.poly([(x + s * .6, y - s * 1.6), (x + s * 1.2, y - s * 1.1), (x + s * .6, y - s * .9)], c)
    cv.glow(x, y - s * .5, s * 2.5, c, .45)


def t_wheel():
    cv = base(201, NAVY, INDIGO, PURPLE, (330, 50, 18))
    cx, cy, R = 200, 108, 72
    cv.glow(cx, cy, 130, GOLD, .45)
    cv.ell(cx, cy, R + 6, R + 6, dk(GOLD, .4))
    cv.ell(cx, cy, R + 4, R + 4, GOLD)
    cols = [PINK, CYAN, GOLD, VIOLET, MAGENTA, TEAL]
    n = 12
    for i in range(n):
        a0, a1 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
        pts = [(cx, cy)] + [(cx + math.cos(a0 + (a1 - a0) * k / 6) * R, cy + math.sin(a0 + (a1 - a0) * k / 6) * R) for k in range(7)]
        cv.poly(pts, cols[i % 6])
        am = (a0 + a1) / 2
        cv.ell(cx + math.cos(am) * R * .72, cy + math.sin(am) * R * .72, 3, 3, lt(cols[i % 6], .5))
        cv.line([(cx, cy), (cx + math.cos(a0) * R, cy + math.sin(a0) * R)], lt(GOLD, .3))
    for i in range(24):
        a = i / 24 * 2 * math.pi
        cv.ell(cx + math.cos(a) * (R + 2), cy + math.sin(a) * (R + 2), 1.5, 1.5, CREAM)
    cv.ell(cx, cy, 13, 13, dk(GOLD, .3))
    cv.ell(cx, cy, 11, 11, GOLD)
    star_poly(cv, cx, cy, 8, 3.5, CREAM)
    cv.poly([(cx - 8, cy - R - 12), (cx + 8, cy - R - 12), (cx, cy - R + 8)], PINK)
    cv.poly([(cx - 8, cy - R - 12), (cx, cy - R - 12), (cx, cy - R + 8)], lt(PINK, .4))
    cv.poly([(cx - 50, 205), (cx + 50, 205), (cx + 8, cy + 20), (cx - 8, cy + 20)], dk(INDIGO, .1))
    sparkles(cv, 16, (10, 10, 390, 190), (1, 3))
    fireflies(cv, 14, (10, 100, 390, 200))
    return cv


def t_trivia():
    cv = base(202, NAVY, H('2a1566'), VIOLET, None, dk(PURPLE, .5))
    cv.glow(200, 100, 160, VIOLET, .6)
    bolt = [(215, 14), (150, 110), (190, 110), (170, 188), (252, 78), (208, 78), (236, 14)]
    cv.poly([(x + 3, y + 3) for x, y in bolt], dk(MAGENTA, .4))
    cv.poly(bolt, GOLD)
    cv.poly([(215, 14), (190, 60), (205, 78), (236, 14)], lt(GOLD, .55))
    cv.glow(200, 100, 90, GOLD, .7)
    for x, c in ((80, PINK), (320, CYAN)):
        cv.ell(x, 192, 30, 9, dk(c, .55))
        cv.ell(x, 186, 28, 18, dk(c, .3))
        cv.ell(x, 180, 24, 14, c)
        cv.ell(x - 7, 176, 10, 5, lt(c, .6))
        cv.glow(x, 180, 50, c, .5)
    for x, y in ((120, 40), (290, 50), (110, 140), (300, 150)):
        sparkle(cv, x, y, 4, GOLD)
    sparkles(cv, 14, (10, 10, 390, 150), (1, 3))
    return cv


def t_jeopardy():
    cv = base(203, NAVY, H('0f2a6a'), H('2a4fb0'), (60, 40, 16), dk(INDIGO, .1), gcol=dk(INDIGO, .2))
    castle(cv, 330, 168, 44, dk(INDIGO, .25), H('2457c9'), flag=CYAN)
    TL = H('2457c9')
    for i in range(5):
        for j in range(3):
            x, y = 62 + i * 54, 50 + j * 40
            cv.rect(x, y, x + 46, y + 32, dk(TL, .55))
            cv.rect(x + 1, y + 1, x + 45, y + 31, TL)
            cv.rect(x + 1, y + 1, x + 45, y + 3, lt(TL, .4))
            star_poly(cv, x + 23, y + 17, 9, 4, GOLD if (i + j) % 3 else CREAM)
            cv.glow(x + 23, y + 17, 14, GOLD, .35)
    cv.glow(200, 100, 170, CYAN, .3)
    sparkles(cv, 14, (10, 10, 390, 190), (1, 3))
    return cv


def t_word():
    cv = base(204, NAVY, INDIGO, H('1d5a6a'), (60, 45, 15), gcol=dk(TEAL, .4))
    for i in range(6):
        x = 38 + i * 56
        flipped = i in (0, 2, 3)
        mid = i == 4
        w = 10 if mid else 40
        cx = x + 20
        col = CREAM if flipped else VIOLET
        cv.rect(cx - w / 2 - 1, 79, cx + w / 2 + 1, 143, dk(col, .5))
        cv.rect(cx - w / 2, 80, cx + w / 2, 142, col)
        if not mid:
            if flipped:
                gem = [PINK, CYAN, GOLD][i % 3]
                cv.poly([(cx, 96), (cx + 11, 111), (cx, 126), (cx - 11, 111)], gem)
                cv.poly([(cx, 96), (cx, 126), (cx - 11, 111)], lt(gem, .4))
                cv.glow(cx, 111, 26, gem, .6)
            else:
                star_poly(cv, cx, 111, 12, 5, GOLD)
                cv.line([(x + 4, 88), (x + 36, 88)], lt(VIOLET, .4))
        cv.glow(cx, 111, 40, col, .2)
    cv.rect(30, 148, 370, 152, dk(TEAL, .2))
    cv.glow(200, 112, 160, CYAN, .3)
    sparkles(cv, 18, (10, 10, 390, 190), (1, 3))
    return cv


def t_speak():
    cv = base(205, NAVY, H('3a1566'), H('9a2a8a'))
    cx = 200
    cv.glow(cx, 100, 150, MAGENTA, .55)
    for rr, c in ((84, PINK), (66, MAGENTA), (48, VIOLET)):
        cv.d.arc([cx - rr, 100 - rr, cx + rr, 100 + rr], 200, 340, fill=c + (255,), width=3)
        cv.d.arc([cx - rr, 100 - rr, cx + rr, 100 + rr], 20, 160, fill=c + (255,), width=3)
    cv.rect(cx - 2, 120, cx + 2, 190, H('8a8aa0'))
    cv.ell(cx, 192, 22, 6, H('6a6a88'))
    cv.ell(cx, 82, 22, 30, dk(SOFT, .5))
    cv.ell(cx, 80, 20, 28, H('c8c8dc'))
    for gy in range(56, 108, 5):
        cv.line([(cx - 19, gy), (cx + 19, gy)], H('8a8aa8'))
    for gx in range(-16, 18, 6):
        cv.line([(cx + gx, 54), (cx + gx, 106)], H('8a8aa8'))
    cv.ell(cx - 8, 66, 6, 10, WHITE)
    cv.rect(cx - 14, 112, cx + 14, 122, GOLD)
    cv.glow(cx, 80, 40, SOFT, .4)
    for x, y, c in ((90, 60, CYAN), (310, 70, CYAN), (110, 150, PINK), (290, 150, GOLD)):
        firefly(cv, x, y, c, 9)
    sparkles(cv, 16, (10, 10, 390, 190), (1, 3))
    return cv


def t_charades():
    cv = Cv(W, HH, seed=206)
    sky(cv, [(0, dk(MAGENTA, .75)), (1, dk(PURPLE, .4))], 14)
    cv.rect(0, 170, W, HH, H('4a2a2a'))
    for y in range(172, HH, 6):
        cv.line([(0, y), (W, y)], H('5a3434'))
    cv.poly([(150, 0), (250, 0), (330, 175), (70, 175)], dk(GOLD, .55))
    cv.glow(200, 130, 140, GOLD, .35)
    for side in (0, 1):
        for k in range(9):
            x = k * 15 if side == 0 else W - 15 - k * 15
            c = MAGENTA if k % 2 == 0 else dk(MAGENTA, .3)
            cv.poly([(x, 0), (x + 15, 0), (x + 15 + (6 if side == 0 else -6), 170), (x + (6 if side == 0 else -6), 170)], c)
    cv.rect(0, 0, W, 16, dk(MAGENTA, .6))
    for x in range(0, W, 12):
        cv.ell(x + 6, 16, 7, 5, dk(MAGENTA, .5))
        cv.px(x + 6, 20, GOLD)
    scene_fox(cv, 190, 182, 1.9)
    cv.ell(290, 70, 38, 26, CREAM)
    cv.poly([(262, 84), (252, 106), (278, 92)], CREAM)
    star_poly(cv, 290, 70, 14, 6, PINK)
    for x, y, r in ((248, 112, 3), (240, 120, 2)):
        cv.ell(x, y, r, r, CREAM)
    sparkles(cv, 14, (90, 20, 310, 170), (1, 3))
    return cv


def t_emoji():
    cv = base(207, NAVY, H('2a1566'), H('1d6a8a'), (340, 45, 14))
    cv.glow(200, 100, 150, GOLD, .35)
    orb_face(cv, 200, 100, 40, GOLD, 0)
    for (x, y, c, k, r) in ((100, 70, PINK, 3, 24), (300, 70, CYAN, 1, 24), (95, 150, VIOLET, 2, 22), (305, 150, MAGENTA, 4, 22), (200, 175, lt(CYAN, .3), 0, 16), (200, 28, SOFT, 2, 15)):
        orb_face(cv, x, y, r, c, k)
    sparkles(cv, 20, (10, 10, 390, 190), (1, 3))
    return cv


def t_finish():
    cv = base(208, NAVY, H('2a1a5a'), H('7a3a9a'))
    cv.glow(200, 100, 140, GOLD, .35)
    cv.rect(100, 40, 300, 160, dk(CREAM, .25))
    cv.rect(100, 40, 300, 160, H('f3e2c0'))
    cv.rect(100, 40, 300, 46, H('e8d0a0'))
    for y in (70, 90, 110):
        cv.line([(122, y), (278, y)], H('b08a5a'))
    cv.line([(122, 130), (210, 130)], H('b08a5a'))
    cv.line([(220, 130), (278, 130)], lt(PINK, .1), 2)
    for x in (100, 300):
        cv.ell(x, 100, 10, 62, H('d9b878'))
        cv.ell(x - 2, 100, 7, 60, H('f0d8a0'))
        cv.ell(x, 40, 10, 5, H('b08a5a'))
        cv.ell(x, 160, 10, 5, H('b08a5a'))
    # quill
    cv.poly([(330, 30), (240, 150), (252, 152)], lt(CYAN, .5))
    cv.poly([(330, 30), (250, 140), (240, 150)], CYAN)
    cv.poly([(330, 30), (300, 40), (270, 100)], lt(PINK, .4))
    cv.line([(330, 30), (238, 152)], CREAM, 1)
    cv.poly([(236, 150), (246, 150), (232, 166)], H('2a1530'))
    cv.ell(80, 178, 14, 10, dk(INDIGO, .1))
    cv.ell(80, 170, 14, 5, H('2a1a5a'))
    cv.glow(232, 164, 24, GOLD, .6)
    sparkles(cv, 20, (10, 10, 390, 190), (1, 3))
    return cv


def t_lyrics():
    cv = base(209, NAVY, H('3a1566'), H('d94c9a'), (320, 50, 18))
    cv.glow(200, 100, 150, PINK, .5)
    cx, cy = 200, 118
    cv.ell(cx, cy, 52, 52, H('14102a'))
    for rr in range(10, 50, 6):
        cv.d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=H('2a2050') + (255,))
    cv.ell(cx, cy, 16, 16, MAGENTA)
    cv.ell(cx, cy, 3, 3, NAVY)
    cv.d.arc([cx - 44, cy - 44, cx + 44, cy + 44], 200, 260, fill=WHITE + (255,), width=2)
    cv.glow(cx, cy, 70, MAGENTA, .4)
    for x, y, s, c in ((110, 70, 10, GOLD), (290, 60, 9, CYAN), (130, 150, 8, PINK), (280, 150, 11, GOLD), (200, 40, 7, SOFT), (60, 110, 8, CYAN), (345, 110, 8, PINK)):
        note(cv, x, y, s, c)
    for x in range(10, 390):
        cv.px(x, 198 + math.sin(x / 9) * 3, lt(PINK, .3))
    sparkles(cv, 16, (10, 10, 390, 190), (1, 3))
    return cv


def t_hangman():
    cv = base(210, NAVY, H('0e2a3a'), H('2a1a5a'), (330, 45, 20), dk(INDIGO, .1), gcol=dk(TEAL, .6))
    # big gnarled tree with a hanging lantern
    cv.rect(70, 70, 88, 200, H('3a2a4a'))
    cv.rect(70, 70, 76, 200, H('5a4a6a'))
    cv.line([(88, 80), (180, 52), (260, 58)], H('3a2a4a'), 7)
    cv.line([(88, 90), (30, 60)], H('3a2a4a'), 6)
    for x, y in ((40, 52), (60, 40), (130, 60), (190, 42), (230, 50)):
        cv.ell(x, y, 16, 10, dk(TEAL, .4)); cv.ell(x - 2, y - 2, 12, 7, TEAL)
    cv.line([(210, 56), (210, 88)], H('8a6a3a'))
    lantern(cv, 210, 100, 11)
    # letter slots
    for i in range(7):
        x = 62 + i * 40
        cv.rect(x, 188, x + 28, 191, CREAM)
        cv.glow(x + 14, 190, 14, CREAM, .25)
        if i in (1, 4, 5):
            gem = [PINK, CYAN, GOLD][i % 3]
            cv.poly([(x + 14, 164), (x + 22, 175), (x + 14, 186), (x + 6, 175)], gem)
            cv.glow(x + 14, 175, 20, gem, .6)
    fireflies(cv, 20, (10, 60, 390, 190))
    sparkles(cv, 14, (10, 10, 390, 150), (1, 3))
    return cv


def t_hot():
    cv = base(211, NAVY, H('3a0f3a'), H('b0204a'), None, dk(MAGENTA, .7), gcol=dk(PURPLE, .6))
    cx = 200
    cv.glow(cx, 110, 160, PINK, .6)
    def flame(sx, sy, s, c):
        pts = [(cx + sx, sy - 120 * s), (cx + sx + 30 * s, sy - 60 * s), (cx + sx + 60 * s, sy - 20 * s), (cx + sx + 48 * s, sy + 10 * s), (cx + sx, sy + 20 * s), (cx + sx - 48 * s, sy + 10 * s), (cx + sx - 62 * s, sy - 26 * s), (cx + sx - 30 * s, sy - 50 * s), (cx + sx - 22 * s, sy - 90 * s)]
        cv.poly(pts, c)
    flame(0, 190, 1.0, MAGENTA)
    flame(0, 190, .82, PINK)
    flame(0, 190, .6, H('ff9a3c'))
    flame(0, 190, .4, GOLD)
    flame(0, 190, .2, CREAM)
    for x, y, s, c in ((100, 130, .4, PINK), (300, 120, .45, MAGENTA), (70, 170, .3, GOLD)):
        flame(x - cx, y + 40, s, c)
    r = cv.rng
    for _ in range(40):
        x, y = cx + r.randint(-110, 110), r.randint(10, 190)
        cv.px(x, y, r.choice([GOLD, PINK, CREAM]))
    cv.ell(310, 60, 36, 22, CREAM)
    cv.poly([(322, 78), (332, 96), (306, 80)], CREAM)
    star_poly(cv, 310, 60, 12, 5, MAGENTA)
    return cv


def t_most_likely():
    cv = base(212, NAVY, H('1a1a5a'), H('6a35c9'), (70, 45, 15), gcol=dk(INDIGO, .2))
    cv.poly([(130, 30), (270, 30), (330, 190), (70, 190)], dk(GOLD, .5))
    cv.glow(200, 110, 130, GOLD, .35)
    cv.rect(150, 120, 250, 196, VIOLET); cv.rect(150, 120, 250, 124, lt(VIOLET, .4))
    cv.rect(80, 150, 150, 196, dk(VIOLET, .25)); cv.rect(80, 150, 150, 153, lt(VIOLET, .2))
    cv.rect(250, 160, 320, 196, dk(VIOLET, .4)); cv.rect(250, 160, 320, 163, lt(VIOLET, .1))
    for x, y, c, k, r_ in ((115, 128, CYAN, 0, 18), (285, 138, PINK, 2, 17), (200, 94, GOLD, 3, 24)):
        orb_face(cv, x, y, r_, c, k)
    cv.poly([(180, 62), (186, 76), (194, 66), (200, 78), (206, 66), (214, 76), (220, 62), (220, 82), (180, 82)], GOLD)
    cv.glow(200, 72, 24, GOLD, .7)
    star_poly(cv, 200, 160, 12, 5, GOLD)
    sparkles(cv, 20, (10, 10, 390, 190), (1, 3))
    return cv


def t_unscramble():
    cv = base(213, NAVY, H('2a1566'), H('1d6a8a'))
    cx, cy = 200, 105
    cv.glow(cx, cy, 150, VIOLET, .6)
    for i in range(3):
        cv.d.ellipse([cx - 20 - i * 14, cy - 20 - i * 14, cx + 20 + i * 14, cy + 20 + i * 14], outline=[CYAN, VIOLET, PINK][i] + (255,))
    cols = [PINK, CYAN, GOLD, MAGENTA, TEAL, VIOLET, SOFT, lt(CYAN, .4)]
    for i in range(8):
        a = i / 8 * 2 * math.pi + .3
        r = 66
        x, y = cx + math.cos(a) * r * 1.35, cy + math.sin(a) * r * .85
        t = a + math.pi / 2
        c, s = math.cos(t * .5), math.sin(t * .5)
        pts = [(-15, -17), (15, -17), (15, 17), (-15, 17)]
        rot = [(x + px * c - py * s, y + px * s + py * c) for px, py in pts]
        cv.poly([(px + 2, py + 2) for px, py in rot], dk(cols[i], .6))
        cv.poly(rot, CREAM)
        inner = [(x + px * .65 * c - py * .65 * s, y + px * .65 * s + py * .65 * c) for px, py in pts]
        cv.poly(inner, cols[i])
        cv.glow(x, y, 26, cols[i], .5)
    star_poly(cv, cx, cy, 22, 9, GOLD)
    cv.glow(cx, cy, 40, GOLD, .8)
    sparkles(cv, 20, (10, 10, 390, 190), (1, 3))
    return cv


def t_wwyd():
    cv = base(214, NAVY, H('1a1a5a'), H('7a3a9a'), (200, 40, 16), gcol=dk(TEAL, .5))
    cv.poly([(185, 150), (215, 150), (330, 205), (255, 205), (200, 170), (140, 205), (70, 205)], H('f0d8a0'))
    cv.poly([(185, 150), (215, 150), (200, 170)], H('d8b878'))
    cv.poly([(190, 150), (210, 150), (200, 225), (190, 225)], dk(GOLD, .3))
    cv.poly([(196, 150), (204, 150), (206, 225), (194, 225)], H('f0d8a0'))
    castle(cv, 80, 160, 30, dk(INDIGO, .15), MAGENTA)
    crystal_cluster(cv, 330, 168, 34, CYAN)
    cv.rect(198, 80, 202, 160, H('6a4a3a'))
    cv.rect(198, 80, 200, 160, H('8a6a4a'))
    cv.poly([(204, 86), (244, 86), (254, 94), (244, 102), (204, 102)], H('c09a6a'))
    cv.poly([(196, 112), (158, 112), (148, 120), (158, 128), (196, 128)], H('c09a6a'))
    cv.line([(210, 94), (236, 94)], H('6a4a3a')); cv.line([(164, 120), (190, 120)], H('6a4a3a'))
    lantern(cv, 200, 70, 7)
    fireflies(cv, 24, (10, 40, 390, 200))
    sparkles(cv, 12, (10, 10, 390, 120), (1, 3))
    return cv


def t_whodis():
    cv = base(215, NAVY, H('1a1050'), H('4a1a7a'), None, dk(PURPLE, .6), gcol=dk(INDIGO, .2))
    cx = 200
    cv.glow(cx, 100, 150, VIOLET, .6)
    # arch frame
    cv.ell(cx, 80, 62, 62, GOLD)
    cv.rect(cx - 62, 80, cx + 62, 196, GOLD)
    cv.ell(cx, 80, 54, 54, dk(MAGENTA, .6))
    cv.rect(cx - 54, 80, cx + 54, 196, dk(MAGENTA, .6))
    cv.glow(cx, 110, 60, MAGENTA, .6)
    # silhouette
    cv.ell(cx, 100, 22, 24, NAVY)
    cv.poly([(cx - 20, 84), (cx - 16, 66), (cx - 6, 80)], NAVY)
    cv.poly([(cx + 20, 84), (cx + 16, 66), (cx + 6, 80)], NAVY)
    cv.ell(cx, 170, 38, 40, NAVY)
    cv.rect(cx - 38, 170, cx + 38, 196, NAVY)
    for sx in (-1, 1):
        cv.ell(cx + sx * 9, 100, 4, 5, CYAN)
        cv.px(cx + sx * 9 - 1, 98, WHITE)
        cv.glow(cx + sx * 9, 100, 11, CYAN, .8)
    for x, y, c in ((90, 60, PINK), (310, 80, CYAN), (100, 150, GOLD), (300, 160, MAGENTA)):
        firefly(cv, x, y, c, 11)
    fog(cv, 190, 25, VIOLET, .5)
    sparkles(cv, 14, (10, 10, 390, 190), (1, 3))
    return cv


def t_pick():
    cv = base(216, NAVY, H('1a1a5a'), H('a030a0'), None, dk(PURPLE, .55))
    cv.poly([(160, 0), (240, 0), (280, 190), (120, 190)], dk(GOLD, .55))
    cv.glow(200, 100, 140, PINK, .4)
    for x, c, h_ in ((90, CYAN, 110), (200, PINK, 130), (310, GOLD, 110)):
        cv.rect(x - 28, 190 - h_ * .35, x + 28, 196, dk(INDIGO, .1))
        cv.rect(x - 28, 190 - h_ * .35, x + 28, 190 - h_ * .35 + 3, lt(INDIGO, .4))
        crystal(cv, x, 190 - h_ * .35, 56 if x == 200 else 44, 20, c)
    cv.poly([(200, 150), (200, 152)], PINK)
    cv.poly([(184, 22), (216, 22), (216, 40), (228, 40), (200, 66), (172, 40), (184, 40)], GOLD)
    cv.glow(200, 44, 30, GOLD, .8)
    sparkles(cv, 20, (10, 10, 390, 190), (1, 3))
    return cv


def t_wyr():
    cv = Cv(W, HH, seed=217)
    cv.img.paste(gradient(W // 2, HH, [(0, dk(MAGENTA, .75)), (.6, dk(PINK, .5)), (1, dk(PURPLE, .4))], 14), (0, 0))
    cv.img.paste(gradient(W - W // 2, HH, [(0, dk(TEAL, .75)), (.6, dk(CYAN, .5)), (1, dk(INDIGO, .3))], 14), (W // 2, 0))
    r = cv.rng
    for _ in range(80):
        cv.px(r.randint(0, W - 1), r.randint(0, 120), r.choice([CREAM, SOFT]) if r.random() < .5 else lt(CYAN, .5))
    cv.rect(0, 190, W // 2, HH, dk(PURPLE, .55)); cv.rect(W // 2, 190, W, HH, dk(TEAL, .6))
    cv.glow(100, 110, 100, PINK, .55); cv.glow(300, 110, 100, CYAN, .55)
    bottle(cv, 100, 190, 52, PINK)
    bottle(cv, 300, 190, 52, CYAN)
    cv.poly([(204, 0), (190, 70), (206, 70), (192, 140), (214, 80), (198, 80), (210, 0)], GOLD)
    cv.glow(200, 70, 90, GOLD, .5)
    for x, c in ((40, PINK), (160, SOFT), (240, CYAN), (360, lt(CYAN, .4))):
        flower(cv, x, 205, 14, c)
    sparkles(cv, 20, (10, 10, 390, 180), (1, 3))
    return cv


THUMBS = {
    'wheel': t_wheel, 'trivia': t_trivia, 'jeopardy': t_jeopardy, 'word-reveal': t_word,
    'speak-out': t_speak, 'charades': t_charades, 'emoji-guess': t_emoji,
    'finish-the-sentence': t_finish, 'guess-lyrics': t_lyrics, 'hangman': t_hangman,
    'hot-take': t_hot, 'most-likely': t_most_likely, 'unscramble-it': t_unscramble,
    'what-would-you-do': t_wwyd, 'who-dis': t_whodis, 'who-would-you-pick': t_pick,
    'would-you-rather': t_wyr,
}
