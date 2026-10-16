"""Character portraits (256x256 low-res -> 1024) and full-body art (256x384 -> 1024x1536)."""
from creatures import *


class Sym:
    """Draw on a Cv and its mirror image about x = cx."""

    def __init__(self, cv, cx=128):
        self.cv, self.cx = cv, cx

    def ell(self, x, y, rx, ry, c):
        self.cv.ell(x, y, rx, ry, c)
        self.cv.ell(2 * self.cx - x, y, rx, ry, c)

    def poly(self, pts, c):
        self.cv.poly(pts, c)
        self.cv.poly([(2 * self.cx - px, py) for px, py in pts], c)

    def cap(self, p0, p1, r0, r1, c):
        capsule(self.cv, p0, p1, r0, r1, c)
        capsule(self.cv, (2 * self.cx - p0[0], p0[1]), (2 * self.cx - p1[0], p1[1]), r0, r1, c)

    def px(self, x, y, c):
        self.cv.px(x, y, c)
        self.cv.px(2 * self.cx - x, y, c)

    def line(self, pts, c, w=1):
        self.cv.line(pts, c, w)
        self.cv.line([(2 * self.cx - x, y) for x, y in pts], c, w)


def capsule(cv, p0, p1, r0, r1, c):
    n = int(max(abs(p1[0] - p0[0]), abs(p1[1] - p0[1]))) + 1
    for i in range(n + 1):
        t = i / n
        r = r0 + (r1 - r0) * t
        cv.ell(p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, r, r, c)


def eye(cv, x, y, r, iris, slit=False, lash=True):
    cv.ell(x, y, r * .88, r, H('1c1030'))
    cv.ell(x, y + r * .05, r * .74, r * .88, dk(iris, .35))
    cv.ell(x, y + r * .3, r * .62, r * .55, iris)
    cv.ell(x, y + r * .5, r * .45, r * .3, lt(iris, .45))
    if slit:
        cv.ell(x, y, max(1, r * .14), r * .8, H('1c1030'))
    else:
        cv.ell(x, y - r * .05, r * .32, r * .5, H('1c1030'))
    cv.ell(x - r * .32, y - r * .42, max(1.5, r * .24), max(1.5, r * .24), WHITE)
    cv.ell(x + r * .3, y + r * .38, max(1, r * .12), max(1, r * .12), WHITE)


def pbg(c1, c2, glowc, seed, moon_=False, bokeh=PINK):
    cv = Cv(256, 256, seed=seed)
    cv.img.paste(gradient(256, 256, [(0, c1), (1, c2)], 14), (0, 0))
    cv.glow(128, 120, 150, glowc, .7)
    r = cv.rng
    for _ in range(16):
        cv.glow(r.randint(0, 256), r.randint(0, 256), r.randint(8, 22), r.choice([bokeh, lt(bokeh, .4), glowc]), .38)
    stars(cv, 60)
    sparkles(cv, 8, (10, 10, 246, 246), (1, 3))
    return cv


def finish(bg, sp, ox=0, oy=0):
    bg.paste(outline_layer(sp.img), ox, oy)
    return bg


# ---------------------------------------------------------------- portraits
def p_fox():
    bg = pbg(INDIGO, H('3b1c78'), VIOLET, 101)
    moon(bg, 128, 70, 62, H('ffe0f0'))
    # re-darken moon so character reads: keep it as a halo
    sp = Cv(256, 256, transparent=True)
    S = Sym(sp)
    ORG, ORGD, ORGL = H('f2833a'), H('b94a2e'), H('ffb15c')
    S.ell(76, 236, 58, 40, VIOLET)
    S.ell(80, 232, 50, 32, lt(VIOLET, .15))
    sp.poly([(78, 214), (178, 214), (178, 238), (78, 238)], MAGENTA)
    for i in range(7):  # chest fluff
        x = 88 + i * 13
        sp.poly([(x - 8, 196), (x + 8, 196), (x, 226 + (i % 2) * 6)], CREAM)
    sp.ell(128, 206, 28, 16, CREAM)
    S.poly([(70, 98), (56, 18), (116, 66)], ORG)
    S.poly([(74, 92), (66, 38), (106, 70)], dk(MAGENTA, .15))
    S.poly([(76, 88), (72, 52), (98, 72)], SOFT)
    S.poly([(54, 22), (58, 40), (68, 30)], H('3a1d4a'))
    sp.ell(128, 128, 76, 62, ORGD)
    sp.ell(128, 124, 74, 59, ORG)
    sp.ell(128, 104, 54, 30, ORGL)
    S.poly([(58, 128), (24, 146), (40, 156), (22, 176), (54, 168), (46, 184), (80, 164), (74, 128)], CREAM)
    S.poly([(60, 134), (36, 148), (50, 156), (36, 170), (62, 164)], WHITE)
    sp.ell(128, 156, 44, 32, CREAM)
    sp.poly([(116, 90), (140, 90), (136, 138), (120, 138)], ORG)
    sp.ell(128, 134, 20, 16, CREAM)
    sp.ell(128, 142, 9, 7, H('2a1530'))
    sp.ell(125, 140, 3, 2, lt(VIOLET, .5))
    sp.line([(128, 148), (128, 156)], H('2a1530'))
    sp.line([(114, 160), (122, 164), (128, 157), (134, 164), (142, 160)], H('2a1530'))
    sp.ell(128, 168, 7, 4, PINK)
    S.ell(86, 144, 9, 5, PINK)
    S.ell(100, 120, 12.5, 14, H('1c1030'))
    eye(sp, 102, 121, 13, CYAN)
    eye(sp, 154, 121, 13, CYAN)
    S.ell(100, 96, 8, 3, CREAM)
    # crescent mark
    sp.ell(128, 88, 11, 11, GOLD)
    sp.ell(133, 85, 10, 10, ORGL)
    sp.px(126, 84, WHITE)
    # clasp
    sp.ell(128, 214, 6, 6, GOLD)
    sp.ell(128, 214, 3, 3, PINK)
    bg.glow(128, 88, 18, GOLD, .7)
    bg.glow(102, 121, 14, CYAN, .4)
    bg.glow(154, 121, 14, CYAN, .4)
    return finish(bg, sp)


def p_fairy():
    bg = pbg(H('1d4a58'), H('0e2a3a'), TEAL, 102, bokeh=CYAN)
    sp = Cv(256, 256, transparent=True)
    S = Sym(sp)
    # wings
    S.cap((98, 150), (28, 66), 14, 18, lt(CYAN, .55))
    S.cap((98, 160), (36, 196), 10, 14, lt(CYAN, .35))
    S.cap((100, 150), (46, 72), 8, 11, WHITE)
    S.line([(98, 150), (30, 68)], PINK)
    S.line([(98, 160), (38, 196)], PINK)
    # hair back
    S.ell(84, 130, 36, 66, MAGENTA)
    sp.ell(128, 110, 58, 54, MAGENTA)
    # dress / shoulders
    S.ell(84, 236, 38, 34, H('2f8f6a'))
    sp.rect(90, 200, 166, 256, H('3fb083'))
    for i in range(6):
        x = 92 + i * 13
        sp.poly([(x, 200), (x + 13, 200), (x + 6, 224)], lt(H('3fb083'), .3))
    sp.rect(120, 190, 136, 204, H('f7c9b0'))
    # face
    sp.ell(128, 134, 48, 50, H('ffd9c2'))
    sp.ell(126, 126, 44, 40, H('ffe8d6'))
    S.poly([(86, 130), (58, 114), (84, 144)], H('ffd9c2'))  # ears
    S.px(60, 115, WHITE)
    # bangs
    sp.poly([(76, 100), (84, 70), (128, 54), (172, 70), (180, 100), (160, 90), (140, 104), (128, 84), (116, 104), (96, 90)], MAGENTA)
    sp.poly([(90, 80), (128, 62), (160, 76), (128, 74)], lt(MAGENTA, .3))
    S.line([(80, 60), (96, 66)], lt(PINK, .4), 2)
    # flower crown
    for i, (x, y, c) in enumerate([(76, 78, PINK), (94, 62, SOFT), (112, 54, GOLD), (128, 50, PINK), (144, 54, SOFT), (162, 62, GOLD), (180, 78, PINK)]):
        for a in range(5):
            ang = a / 5 * 6.283
            sp.ell(x + math.cos(ang) * 5, y + math.sin(ang) * 5, 4, 4, c)
        sp.ell(x, y, 3, 3, GOLD if c != GOLD else CREAM)
        bg.glow(x, y, 12, c, .35)
    S.ell(104, 134, 12, 14, H('1c1030'))
    eye(sp, 106, 136, 14, VIOLET)
    eye(sp, 150, 136, 14, VIOLET)
    S.ell(92, 158, 9, 5, PINK)
    sp.line([(118, 164), (124, 169), (128, 169), (134, 164)], H('b24a5a'))
    sp.px(128, 154, H('e8a590'))
    S.line([(100, 120), (112, 117)], H('7a3a68'))
    bg.glow(128, 130, 70, SOFT, .25)
    return finish(bg, sp)


def p_rabbit():
    bg = pbg(H('0d1236'), H('2c2a7a'), CYAN, 103, bokeh=lt(CYAN, .3))
    moon(bg, 128, 108, 78, H('cfe3ff'))
    sp = Cv(256, 256, transparent=True)
    S = Sym(sp)
    F, FD, FL = H('efe6ff'), H('b9a5e8'), WHITE
    S.cap((98, 80), (82, 14), 18, 16, FD)
    S.cap((100, 80), (84, 16), 15, 13, F)
    S.cap((100, 76), (86, 24), 8, 7, PINK)
    S.cap((101, 72), (88, 30), 4, 3, SOFT)
    S.ell(60, 244, 50, 34, H('3b3a9a'))
    sp.rect(80, 222, 176, 256, H('4c4bb8'))
    sp.ell(128, 220, 40, 16, F)
    sp.ell(128, 140, 72, 62, FD)
    sp.ell(128, 136, 70, 58, F)
    sp.ell(128, 112, 50, 24, FL)
    sp.ell(128, 156, 36, 26, FL)
    S.ell(88, 150, 10, 6, SOFT)
    S.ell(100, 128, 13, 15, H('1c1030'))
    eye(sp, 100, 130, 14, GOLD)
    eye(sp, 156, 130, 14, GOLD)
    sp.ell(128, 148, 7, 5, PINK)
    sp.ell(126, 147, 2, 1, WHITE)
    sp.line([(128, 152), (128, 158)], H('7a4a8a'))
    sp.line([(116, 162), (122, 166), (128, 158), (134, 166), (140, 162)], H('7a4a8a'))
    sp.rect(124, 164, 127, 172, WHITE)
    sp.rect(129, 164, 132, 172, WHITE)
    sp.line([(124, 164), (124, 172)], FD)
    S.line([(60, 146), (36, 140)], H('c9b8f0'))
    S.line([(60, 152), (34, 156)], H('c9b8f0'))
    # moon pendant
    sp.line([(112, 208), (128, 226), (144, 208)], GOLD)
    sp.ell(128, 230, 8, 8, GOLD)
    sp.ell(131, 228, 7, 7, H('4c4bb8'))
    bg.glow(128, 230, 14, GOLD, .7)
    S.px(86, 60, GOLD)
    return finish(bg, sp)


def p_dragon():
    bg = pbg(H('3a0f4a'), H('7a1f6a'), PINK, 104, bokeh=GOLD)
    sp = Cv(256, 256, transparent=True)
    S = Sym(sp)
    G, GD, GL = H('2ec4b6'), H('15788a'), H('9ff0e0')
    # horns / crystals
    S.poly([(86, 76), (58, 16), (106, 62)], PINK)
    S.poly([(86, 76), (58, 16), (72, 56)], lt(PINK, .45))
    S.poly([(60, 110), (16, 104), (50, 130)], MAGENTA)  # ear fins
    S.poly([(58, 112), (30, 108), (52, 126)], SOFT)
    # neck / shoulders
    sp.ell(128, 244, 70, 44, GD)
    sp.ell(128, 240, 64, 38, G)
    for i in range(5):
        sp.poly([(70 + i * 29 - 12, 218), (70 + i * 29 + 12, 218), (70 + i * 29, 252)], lt(G, .2))
    sp.ell(128, 130, 74, 66, GD)
    sp.ell(128, 126, 72, 62, G)
    sp.ell(128, 104, 50, 28, lt(G, .25))
    # scales dots
    for (x, y) in [(70, 120), (82, 150), (60, 142), (186, 120), (174, 150), (196, 142), (100, 88), (156, 88), (128, 78)]:
        sp.ell(x, y, 5, 4, GD)
        sp.px(x - 2, y - 1, GL)
    # snout
    sp.ell(128, 160, 44, 32, GL)
    sp.ell(128, 154, 40, 26, lt(GL, .3))
    S.ell(112, 150, 4, 3, GD)
    S.ell(112, 150, 2, 1, NAVY)
    sp.line([(100, 172), (116, 180), (128, 178), (140, 180), (156, 172)], H('1c1030'), 2)
    S.poly([(108, 175), (112, 175), (110, 184)], WHITE)
    # forehead crystal
    crystal(sp, 128, 92, 40, 12, CYAN, 0, glow=False)
    S.ell(100, 118, 14, 16, H('1c1030'))
    eye(sp, 100, 120, 15, GOLD, slit=True)
    eye(sp, 156, 120, 15, GOLD, slit=True)
    S.ell(84, 150, 8, 4, PINK)
    S.px(84, 100, GL)
    bg.glow(128, 70, 30, CYAN, .7)
    bg.glow(70, 40, 20, PINK, .6)
    bg.glow(186, 40, 20, PINK, .6)
    return finish(bg, sp)


def p_cat():
    bg = pbg(H('20103f'), H('0e5a6b'), MAGENTA, 105, bokeh=CYAN)
    sp = Cv(256, 256, transparent=True)
    S = Sym(sp)
    C, CD, CL = H('232a6e'), H('141a4a'), H('3b3f9a')
    S.poly([(66, 110), (52, 20), (112, 70)], CD)
    S.poly([(70, 104), (64, 38), (104, 72)], PINK)
    S.poly([(76, 100), (72, 56), (96, 74)], SOFT)
    sp.ell(128, 244, 66, 44, CD)
    sp.ell(128, 240, 60, 38, C)
    sp.ell(128, 228, 40, 20, lt(C, .2))
    sp.ell(128, 130, 76, 64, CD)
    sp.ell(128, 126, 74, 60, C)
    sp.ell(128, 104, 50, 26, CL)
    sp.ell(128, 154, 32, 24, lt(C, .35))
    r = bg.rng
    for _ in range(60):
        x, y = r.randint(60, 196), r.randint(70, 250)
        if (x - 128) ** 2 / 76 ** 2 + (y - 126) ** 2 / 62 ** 2 < 1 or y > 200:
            sp.px(x, y, r.choice([CREAM, SOFT, CYAN, GOLD]))
    for (x, y) in [(90, 90), (170, 100), (128, 78), (60, 170), (200, 170), (100, 230), (160, 240)]:
        sparkle(sp, x, y, 2, CREAM)
    S.line([(100, 120), (112, 117)], CREAM)
    S.ell(100, 128, 14, 16, H('1c1030'))
    eye(sp, 100, 130, 15, GOLD, slit=True)
    eye(sp, 156, 130, 15, GOLD, slit=True)
    sp.poly([(122, 148), (134, 148), (128, 156)], PINK)
    sp.line([(128, 156), (128, 160)], H('1c1030'))
    sp.line([(116, 166), (122, 168), (128, 160), (134, 168), (140, 166)], H('1c1030'))
    S.line([(88, 154), (50, 146)], CREAM)
    S.line([(88, 160), (48, 164)], CREAM)
    S.line([(90, 166), (54, 182)], CREAM)
    S.ell(86, 144, 8, 4, MAGENTA)
    # collar + bell moon
    sp.rect(84, 196, 172, 206, MAGENTA)
    sp.rect(84, 196, 172, 198, lt(MAGENTA, .4))
    sp.ell(128, 214, 9, 9, GOLD)
    sp.ell(131, 212, 8, 8, C)
    bg.glow(128, 214, 16, GOLD, .7)
    bg.glow(100, 130, 14, GOLD, .4)
    bg.glow(156, 130, 14, GOLD, .4)
    return finish(bg, sp)


def p_owl():
    bg = pbg(H('0e3a45'), H('1d6a62'), CYAN, 106, bokeh=GOLD)
    sp = Cv(256, 256, transparent=True)
    S = Sym(sp)
    B, BD, BL = H('8a5a8f'), H('4a2a5f'), H('c08fc0')
    sp.rect(0, 232, 256, 248, H('5a3a2a'))
    sp.rect(0, 232, 256, 235, H('8a5a3a'))
    S.poly([(68, 90), (48, 20), (110, 60)], BD)
    S.poly([(70, 88), (54, 30), (100, 62)], B)
    S.cap((46, 140), (30, 224), 22, 12, BD)
    S.cap((48, 140), (34, 220), 17, 9, B)
    sp.ell(128, 150, 74, 82, BD)
    sp.ell(128, 146, 70, 78, B)
    for i in range(4):  # chest feathers
        for j in range(5):
            x, y = 84 + j * 22 + (i % 2) * 11, 180 + i * 16
            sp.ell(x, y, 11, 8, BL)
            sp.ell(x, y - 2, 10, 6, lt(BL, .25))
    sp.ell(128, 190, 4, 4, BD)
    sp.ell(128, 104, 62, 46, B)
    S.ell(98, 116, 38, 38, CREAM)
    S.ell(98, 114, 34, 34, lt(CREAM, .5))
    S.ell(98, 118, 30, 30, H('f6dcc0'))
    sp.rect(60, 70, 196, 76, B)
    S.poly([(64, 78), (74, 62), (84, 80)], lt(B, .35))
    S.poly([(88, 76), (100, 58), (112, 78)], lt(B, .35))
    S.ell(98, 118, 24, 24, H('1c1030'))
    eye(sp, 98, 118, 24, GOLD)
    eye(sp, 158, 118, 24, GOLD)
    sp.poly([(120, 134), (136, 134), (128, 156)], H('ffb33c'))
    sp.poly([(124, 136), (132, 136), (128, 150)], GOLD)
    # pendant
    sp.line([(100, 176), (128, 196), (156, 176)], GOLD)
    crystal(sp, 128, 224, 22, 9, CYAN, 0, glow=False)
    bg.glow(128, 208, 26, CYAN, .7)
    bg.glow(98, 118, 30, GOLD, .35)
    bg.glow(158, 118, 30, GOLD, .35)
    for x in (30, 226):
        flower(sp, x, 236, 22, PINK)
    return finish(bg, sp)


# --------------------------------------------------------------- full body
def full_bg():
    return Cv(256, 384, transparent=True, seed=7)


def f_fox():
    cv = full_bg()
    sp = Cv(256, 384, transparent=True)
    scene_fox(sp, 118, 340, 4.2)
    # scene_fox pastes outlined sprite + glows; transfer
    cv.glows += sp.glows
    cv.img.alpha_composite(sp.img)
    # crescent halo above the fox
    cv.glow(150, 120, 80, VIOLET, .35)
    for x, y, s in ((40, 70, 3), (210, 90, 2), (60, 200, 2), (215, 220, 3), (180, 40, 2), (30, 150, 2)):
        sparkle(cv, x, y, s, GOLD)
    # flower base
    r = cv.rng
    for x in range(30, 230, 13):
        flower(cv, x, r.randint(344, 366), r.randint(10, 22), r.choice([PINK, SOFT, MAGENTA, CYAN, GOLD]))
    mushroom(cv, 40, 366, 14, PINK, PINK)
    mushroom(cv, 214, 366, 12, CYAN, CYAN)
    return cv


def f_fairy():
    cv = full_bg()
    sp = Cv(256, 384, transparent=True)
    S = Sym(sp)
    SK, SKD = H('ffe8d6'), H('f2bfa8')
    # wings
    S.cap((112, 150), (30, 70), 14, 22, lt(CYAN, .5))
    S.cap((112, 170), (34, 228), 10, 18, lt(CYAN, .3))
    S.cap((112, 150), (46, 80), 6, 12, WHITE)
    S.line([(112, 150), (32, 72)], PINK)
    S.line([(112, 172), (36, 226)], PINK)
    # hair back
    S.cap((96, 96), (84, 230), 18, 8, MAGENTA)
    # legs
    S.cap((118, 268), (116, 336), 6, 5, SKD)
    S.ell(112, 342, 9, 5, H('2f8f6a'))
    # dress
    sp.poly([(100, 190), (156, 190), (186, 290), (70, 290)], H('3fb083'))
    sp.poly([(100, 190), (128, 190), (128, 290), (70, 290)], H('4fd0a0'))
    for i in range(7):
        x = 70 + i * 19
        sp.poly([(x, 286), (x + 19, 286), (x + 9, 304)], H('3fb083') if i % 2 else H('4fd0a0'))
    sp.rect(100, 196, 156, 204, GOLD)
    sp.ell(128, 200, 5, 5, PINK)
    # arms
    S.cap((104, 200), (84, 238), 6, 5, SK)
    cv_arm = (172, 160)
    capsule(sp, (152, 200), (186, 160), 6, 5, SK)
    # wand
    sp.line([(186, 160), (200, 100)], H('8a5a3a'), 2)
    sp.poly([(200, 84), (204, 96), (216, 96), (206, 104), (210, 116), (200, 108), (190, 116), (194, 104), (184, 96), (196, 96)], GOLD)
    cv.glow(200, 100, 34, GOLD, .8)
    # neck head
    sp.rect(122, 178, 134, 194, SK)
    sp.ell(128, 142, 34, 38, SK)
    sp.ell(126, 136, 30, 30, H('fff3e8'))
    sp.poly([(96, 140), (76, 126), (98, 152)], SK)
    sp.poly([(160, 140), (180, 126), (158, 152)], SK)
    sp.ell(128, 110, 40, 36, MAGENTA)
    sp.poly([(94, 118), (100, 90), (128, 80), (156, 90), (162, 118), (148, 106), (136, 120), (128, 102), (120, 120), (108, 106)], MAGENTA)
    sp.poly([(104, 96), (128, 86), (150, 94), (128, 94)], lt(MAGENTA, .3))
    for x, y, c in ((100, 92, PINK), (116, 82, SOFT), (128, 78, GOLD), (140, 82, SOFT), (156, 92, PINK)):
        for a in range(5):
            ang = a / 5 * 6.283
            sp.ell(x + math.cos(ang) * 4, y + math.sin(ang) * 4, 3, 3, c)
        sp.ell(x, y, 2, 2, CREAM)
        cv.glow(x, y, 9, c, .35)
    eye(sp, 116, 142, 8, VIOLET)
    eye(sp, 140, 142, 8, VIOLET)
    S.ell(106, 156, 5, 3, PINK)
    sp.line([(124, 158), (128, 161), (132, 158)], H('b24a5a'))
    cv.paste(outline_layer(sp.img), 0, 0)
    cv.glow(128, 250, 110, CYAN, .22)
    for x, y, s in ((36, 40, 3), (220, 50, 2), (34, 260, 2), (222, 280, 3), (60, 340, 2)):
        sparkle(cv, x, y, s, SOFT)
    return cv


def f_companion():
    cv = full_bg()
    sp = Cv(256, 384, transparent=True)
    S = Sym(sp)
    cx, cy, R = 128, 200, 78
    # comet tail
    for i in range(22):
        t = i / 22
        sp.ell(128 + 20 * math.sin(t * 5), 290 + t * 70, R * .22 * (1 - t) + 2, R * .2 * (1 - t) + 2, mix(CYAN, MAGENTA, t))
    # wings
    S.cap((70, 190), (22, 140), 12, 8, lt(CYAN, .6))
    S.cap((72, 206), (24, 214), 9, 6, lt(PINK, .5))
    # ears
    S.poly([(80, 148), (66, 82), (112, 128)], H('6a55d8'))
    S.poly([(82, 140), (74, 98), (104, 128)], PINK)
    # orb body, swirl galaxy
    ys, xs = np.mgrid[0:384, 0:256]
    dx, dy = xs - cx, ys - cy
    d = np.sqrt(dx ** 2 + dy ** 2)
    ang = np.arctan2(dy, dx)
    nz = noise2d(256, 384, 40, 9, 3)
    sw = np.sin(ang * 2 + d * .09 + nz * 5)
    sw = (sw + 1) / 2
    pal = [H('2a1a7a'), H('4a35c8'), H('7a5ae8'), TEAL, CYAN, H('b9a5ff')]
    idx = np.clip(((sw * .75 + nz * .25) * (len(pal) - 1)).astype(int), 0, len(pal) - 1)
    mask = d < R
    arr = np.asarray(sp.img).copy()
    for k, c in enumerate(pal):
        m = mask & (idx == k)
        arr[m] = c + (255,)
    rim = mask & (d > R - 4)
    arr[rim] = H('9a85ff') + (255,)
    sp.img = Image.fromarray(arr, 'RGBA')
    sp.d = ImageDraw.Draw(sp.img)
    for _ in range(90):
        a, rr = sp.rng.uniform(0, 6.283), sp.rng.uniform(0, R - 3)
        sp.px(cx + math.cos(a) * rr, cy + math.sin(a) * rr, sp.rng.choice([CREAM, CYAN, SOFT]))
    # face
    S.ell(cx - 30, cy + 6, 17, 20, H('1c1030'))
    S.ell(cx - 30, cy + 6, 13, 16, WHITE)
    S.ell(cx - 30, cy + 10, 10, 10, lt(CYAN, .5))
    S.ell(cx - 30, cy + 2, 6, 8, H('3a2a9a'))
    S.ell(cx - 34, cy - 2, 3, 3, WHITE)
    sp.line([(cx - 10, cy + 34), (cx - 5, cy + 38), (cx, cy + 40), (cx + 5, cy + 38), (cx + 10, cy + 34)], H('1c1030'), 2)
    S.ell(cx - 44, cy + 28, 8, 4, PINK)
    # paws
    S.ell(cx - 30, cy + R + 2, 14, 9, H('4a35c8'))
    S.ell(cx - 30, cy + R, 11, 6, H('7a5ae8'))
    # star on forehead
    sp.poly([(cx, cy - 56), (cx + 4, cy - 46), (cx + 14, cy - 46), (cx + 6, cy - 40), (cx + 9, cy - 30), (cx, cy - 36), (cx - 9, cy - 30), (cx - 6, cy - 40), (cx - 14, cy - 46), (cx - 4, cy - 46)], GOLD)
    cv.paste(outline_layer(sp.img), 0, 0)
    cv.glow(cx, cy, 130, VIOLET, .55)
    cv.glow(cx, cy - 44, 30, GOLD, .8)
    cv.glow(cx - 30, cy + 6, 22, CYAN, .5)
    cv.glow(cx + 30, cy + 6, 22, CYAN, .5)
    sparkles(cv, 14, (14, 20, 242, 360), (1, 3))
    return cv
