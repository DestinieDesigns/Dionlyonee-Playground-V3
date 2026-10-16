"""Environment scenes: hero, backgrounds, banners."""
from creatures import *


def hero(w=480, h=270):
    cv = Cv(w, h, seed=11)
    sky(cv, [(0, NAVY), (.3, INDIGO), (.55, PURPLE), (.75, MAGENTA), (.9, PINK), (1, SOFT)], 22)
    stars(cv, 330, h * .6)
    moon(cv, 330, 70, 32)
    clouds(cv, (30, 110), lt(MAGENTA, .15), dk(PURPLE, .2), 7, (70, 130), (10, 18))
    cloud(cv, 250, 85, 160, 12, mix(MAGENTA, SOFT, .4), PURPLE)
    ridge(cv, 150, 45, dk(PURPLE, .35), dk(INDIGO, .1), 3, 70, rim=lt(VIOLET, .2))
    castle(cv, 395, 125, 34, dk(INDIGO, .1), VIOLET)
    fog(cv, 135, 25, MAGENTA, .35)
    ridge(cv, 170, 35, dk(PURPLE, .5), dk(INDIGO, .3), 5, 55, rim=lt(PURPLE, .25))
    # waterfalls into lake
    forest_layer(cv, 178, (34, 52), 'pine', (dk(TEAL, .6), TEAL), (9, 15))
    fog(cv, 172, 18, CYAN, .3)
    water(cv, 176, 214, dk(TEAL, .2), dk(INDIGO, .1), 330)
    forest_layer(cv, 200, (46, 64), 'round', (dk(PURPLE, .5), PURPLE, dk(INDIGO, .2)), (30, 46), lights=lt(CYAN, .3), skip=(40, 150))
    cliff(cv, 55, 140, 96, 204, dk(PURPLE, .55), PURPLE, 2)
    waterfall(cv, 92, 98, 202, 10)
    waterfall(cv, 124, 112, 202, 5)
    crystal_cluster(cv, 46, 206, 22, CYAN)
    # mid ground bank + crystals
    ridge(cv, 222, 14, dk(TEAL, .45), dk(INDIGO, .1), 9, 40, rim=TEAL)
    crystal_cluster(cv, 400, 236, 40, CYAN)
    crystal_cluster(cv, 62, 238, 32, MAGENTA, PINK)
    crystal_cluster(cv, 452, 260, 24, VIOLET)
    # foreground
    ridge(cv, 246, 10, dk(INDIGO, .1), NAVY, 14, 30, rim=dk(TEAL, .1))
    grass(cv, 250, H('1e6f6c'), TEAL, .6, (4, 9))
    scene_fox(cv, 150, 252, 1.05)
    mushroom(cv, 222, 256, 14, PINK, PINK)
    mushroom(cv, 236, 258, 9, CYAN, CYAN)
    mushroom(cv, 24, 254, 12, VIOLET, VIOLET)
    for x, c in ((60, PINK), (84, SOFT), (180, MAGENTA), (118, GOLD), (262, PINK), (300, SOFT), (350, MAGENTA), (440, PINK)):
        flower(cv, x, cv.rng.randint(254, 266), cv.rng.randint(10, 18), c)
    lantern(cv, 20, 70, 7)
    lantern(cv, 462, 60, 8)
    lantern(cv, 285, 150, 5)
    fireflies(cv, 40, (10, 130, 470, 260))
    sparkles(cv, 28, (10, 5, 470, 200))
    fog(cv, 258, 14, lt(MAGENTA, .3), .3)
    return cv


def forest_bg(w=480, h=270):
    cv = Cv(w, h, seed=21)
    sky(cv, [(0, NAVY), (.4, INDIGO), (.7, dk(TEAL, .5)), (1, TEAL)], 18)
    stars(cv, 120, h * .4)
    moon(cv, 400, 36, 14, lt(CYAN, .6))
    ridge(cv, 120, 35, dk(INDIGO, .1), dk(TEAL, .6), 4, 60)
    forest_layer(cv, 150, (50, 80), 'pine', (dk(TEAL, .75), dk(TEAL, .45)), (8, 14))
    fog(cv, 140, 30, CYAN, .3)
    forest_layer(cv, 185, (70, 110), 'pine', (dk(TEAL, .55), TEAL), (14, 24))
    fog(cv, 190, 25, lt(TEAL, .3), .35)
    ridge(cv, 210, 18, dk(TEAL, .4), dk(INDIGO, .2), 8, 40, rim=TEAL)
    forest_layer(cv, 225, (90, 130), 'round', (dk(PURPLE, .45), PURPLE, dk(INDIGO, .1)), (60, 90), lights=lt(CYAN, .3))
    for x in (28, 440):
        roundtree(cv, x, 270, 200, dk(INDIGO, .3), dk(TEAL, .6), TEAL, lt(CYAN, .4))
    ridge(cv, 250, 12, dk(TEAL, .5), NAVY, 12, 30, rim=TEAL)
    grass(cv, 256, dk(TEAL, .3), TEAL, .6, (4, 10))
    for x, s, c in ((90, 16, PINK), (110, 10, CYAN), (330, 14, MAGENTA), (350, 8, GOLD), (210, 12, VIOLET)):
        mushroom(cv, x, 262, s, c, c)
    for x in range(40, 460, 31):
        flower(cv, x + cv.rng.randint(-8, 8), cv.rng.randint(258, 268), cv.rng.randint(8, 16), cv.rng.choice([PINK, SOFT, MAGENTA, CYAN, GOLD]))
    lantern(cv, 150, 120, 6)
    lantern(cv, 300, 95, 5)
    fireflies(cv, 70, (10, 60, 470, 260))
    sparkles(cv, 14, (10, 5, 470, 140))
    return cv


def garden_bg(w=480, h=270):
    cv = Cv(w, h, seed=31)
    sky(cv, [(0, NAVY), (.3, INDIGO), (.65, VIOLET), (1, PINK)], 20)
    stars(cv, 260, h * .5)
    moon(cv, 240, 80, 40)
    clouds(cv, (60, 150), lt(PINK, .1), dk(PURPLE, .1), 6)
    ridge(cv, 150, 25, dk(PURPLE, .5), dk(INDIGO, .2), 6, 70, rim=PURPLE)
    castle(cv, 90, 150, 26, dk(INDIGO, .2), MAGENTA)
    # garden hedge + arch
    ridge(cv, 190, 6, dk(TEAL, .5), dk(INDIGO, .2), 2, 20, rim=TEAL)
    for x in range(0, 480, 18):
        cv.ell(x + 9, 188, 12, 9, dk(TEAL, .45))
        cv.ell(x + 7, 185, 8, 5, dk(TEAL, .15))
    for x in (160, 320):
        cv.rect(x - 3, 130, x + 3, 192, lt(INDIGO, .25))
        cv.rect(x - 3, 130, x - 1, 192, lt(INDIGO, .45))
    for i in range(0, 161):
        t = i / 160
        y = 132 - 10 * math.sin(t * math.pi)
        cv.rect(160 + i - 1, y - 2, 160 + i + 1, y + 2, dk(TEAL, .2))
        if i % 6 == 0:
            cv.ell(160 + i, y - 2, 3, 3, cv.rng.choice([PINK, SOFT, MAGENTA]))
            cv.glow(160 + i, y - 2, 6, PINK, .4)
    water(cv, 196, 235, dk(PURPLE, .1), dk(INDIGO, .2), 240)
    ridge(cv, 235, 10, dk(TEAL, .4), dk(INDIGO, .3), 5, 40, rim=TEAL)
    # path of lanterns
    for i, x in enumerate(range(30, 460, 70)):
        cv.rect(x - 1, 200, x, 238, dk(INDIGO, .1))
        lantern(cv, x, 196, 5)
    # fountain-like crystal centre
    crystal_cluster(cv, 240, 232, 34, lt(CYAN, .1), VIOLET)
    ridge(cv, 258, 8, dk(TEAL, .55), NAVY, 17, 25, rim=TEAL)
    grass(cv, 262, dk(TEAL, .3), TEAL, .6, (4, 9))
    for x in range(10, 480, 14):
        flower(cv, x + cv.rng.randint(-4, 4), cv.rng.randint(258, 270), cv.rng.randint(8, 22), cv.rng.choice([PINK, SOFT, MAGENTA, VIOLET, GOLD, CYAN]))
    scene_fox(cv, 90, 258, .95)
    fireflies(cv, 50, (10, 100, 470, 260))
    sparkles(cv, 18, (10, 5, 470, 150))
    return cv


def cavern_bg(w=480, h=270):
    cv = Cv(w, h, seed=41)
    sky(cv, [(0, NAVY), (.5, dk(PURPLE, .6)), (1, dk(TEAL, .5))], 16)
    r = cv.rng
    # back wall glow
    cv.glow(240, 140, 220, VIOLET, .35)
    cv.glow(140, 170, 120, CYAN, .3)
    ridge(cv, 120, 40, dk(PURPLE, .6), dk(INDIGO, .3), 3, 50, rim=PURPLE)
    # ceiling stalactites
    cv.rect(0, 0, w, 14, dk(INDIGO, .4))
    for x in range(-5, w + 10, 9):
        hh = r.randint(14, 56)
        wd = r.randint(5, 9)
        cv.poly([(x - wd, 0), (x + wd, 0), (x + r.randint(-2, 2), hh)], dk(PURPLE, .45))
        cv.poly([(x - wd, 0), (x, 0), (x, hh)], dk(PURPLE, .2))
    # hanging crystals
    for x, hh, c in ((70, 46, CYAN), (170, 36, PINK), (300, 52, MAGENTA), (410, 42, CYAN), (240, 30, VIOLET)):
        sp = Cv(24, 80, transparent=True)
        crystal(sp, 12, 66, hh, 7, c, 0, glow=False)
        im = outline_layer(sp.img).transpose(Image.FLIP_TOP_BOTTOM)
        cv.paste(im, x - 12, 4)
        cv.glow(x, 4 + hh * .6, hh * .9 + 8, c, .55)
    # background crystal forest
    for x in range(10, 480, 38):
        crystal(cv, x + r.randint(-6, 6), 190 + r.randint(-6, 6), r.randint(28, 56), r.randint(7, 11), r.choice([dk(PURPLE, .1), dk(TEAL, .1), dk(MAGENTA, .3)]), r.randint(-5, 5))
    fog(cv, 190, 28, VIOLET, .35)
    # waterfall of light
    waterfall(cv, 360, 14, 205, 7, lt(PINK, .6), PINK, MAGENTA)
    # lake
    water(cv, 205, 240, dk(TEAL, .1), dk(INDIGO, .2), 360)
    for x in range(30, 450, 24):
        cv.ell(x + r.randint(-6, 6), 218 + r.randint(0, 16), r.randint(2, 4), 1, lt(CYAN, .6))
    ridge(cv, 244, 12, dk(PURPLE, .6), NAVY, 5, 40, rim=PURPLE)
    crystal_cluster(cv, 80, 262, 54, CYAN, lt(CYAN, .3))
    crystal_cluster(cv, 410, 264, 60, MAGENTA, PINK)
    crystal_cluster(cv, 250, 266, 26, VIOLET)
    for x, s, c in ((140, 14, CYAN), (175, 9, PINK), (320, 13, MAGENTA), (350, 9, GOLD)):
        mushroom(cv, x, 262, s, c, c)
    for x in range(20, 470, 33):
        flower(cv, x, r.randint(262, 270), r.randint(6, 12), r.choice([CYAN, PINK, SOFT]))
    scene_fox(cv, 205, 262, .7)
    fireflies(cv, 50, (10, 40, 470, 250), CYAN)
    sparkles(cv, 30, (10, 20, 470, 240), cols=(CREAM, CYAN, PINK))
    return cv


# ---------------- banners (480x150, rendered x4 = 1920x600) -------------
def banner_forest(w=480, h=150):
    cv = Cv(w, h, seed=51)
    sky(cv, [(0, NAVY), (.45, INDIGO), (.8, PURPLE), (1, MAGENTA)], 16)
    stars(cv, 130, 70)
    moon(cv, 90, 38, 16)
    ridge(cv, 85, 30, dk(PURPLE, .5), dk(INDIGO, .2), 8, 70, rim=PURPLE)
    forest_layer(cv, 105, (30, 46), 'pine', (dk(TEAL, .7), dk(TEAL, .4)), (7, 12))
    fog(cv, 98, 18, MAGENTA, .35)
    forest_layer(cv, 128, (46, 70), 'pine', (dk(TEAL, .5), TEAL), (13, 22))
    forest_layer(cv, 140, (60, 80), 'round', (dk(PURPLE, .4), PURPLE, dk(INDIGO, .2)), (40, 70), lights=lt(CYAN, .3))
    ridge(cv, 140, 8, dk(TEAL, .5), NAVY, 3, 30, rim=TEAL)
    grass(cv, 144, dk(TEAL, .3), TEAL, .6, (3, 7))
    for x in range(10, 480, 22):
        flower(cv, x + cv.rng.randint(-6, 6), cv.rng.randint(142, 149), cv.rng.randint(6, 12), cv.rng.choice([PINK, SOFT, MAGENTA, GOLD, CYAN]))
    mushroom(cv, 400, 148, 10, PINK, PINK)
    mushroom(cv, 415, 149, 7, CYAN, CYAN)
    scene_fox(cv, 330, 146, .8)
    lantern(cv, 450, 60, 6)
    fireflies(cv, 40, (10, 30, 470, 145))
    sparkles(cv, 10, (10, 5, 470, 60))
    return cv


def banner_castle(w=480, h=150):
    cv = Cv(w, h, seed=52)
    sky(cv, [(0, NAVY), (.4, INDIGO), (.75, VIOLET), (1, PINK)], 16)
    stars(cv, 150, 90)
    moon(cv, 380, 50, 28)
    clouds(cv, (40, 90), lt(PINK, .1), dk(PURPLE, .1), 5, (60, 110), (8, 14))
    ridge(cv, 96, 28, dk(PURPLE, .5), dk(INDIGO, .2), 7, 70, rim=PURPLE)
    castle(cv, 150, 106, 44, dk(INDIGO, .1), MAGENTA)
    castle(cv, 270, 106, 28, dk(INDIGO, .15), VIOLET, flag=CYAN)
    fog(cv, 108, 20, MAGENTA, .4)
    water(cv, 118, 142, dk(PURPLE, .2), dk(INDIGO, .2), 380)
    ridge(cv, 134, 10, dk(TEAL, .5), NAVY, 2, 30, rim=TEAL)
    forest_layer(cv, 142, (24, 38), 'pine', (dk(INDIGO, .1), dk(TEAL, .5)), (9, 15))
    grass(cv, 146, dk(TEAL, .3), TEAL, .6)
    for x in range(8, 480, 24):
        flower(cv, x + cv.rng.randint(-5, 5), cv.rng.randint(143, 149), cv.rng.randint(5, 10), cv.rng.choice([PINK, SOFT, MAGENTA, GOLD]))
    lantern(cv, 30, 70, 6)
    lantern(cv, 455, 80, 5)
    fireflies(cv, 30, (10, 40, 470, 145))
    sparkles(cv, 12, (10, 5, 470, 70))
    return cv


def banner_waterfall(w=480, h=150):
    cv = Cv(w, h, seed=53)
    sky(cv, [(0, NAVY), (.5, INDIGO), (1, dk(TEAL, .4))], 16)
    stars(cv, 100, 50)
    moon(cv, 400, 30, 14, lt(CYAN, .5))
    ridge(cv, 70, 25, dk(PURPLE, .6), dk(INDIGO, .2), 4, 60)
    cliff(cv, 120, 360, 35, 128, dk(PURPLE, .55), PURPLE, 3)
    cliff(cv, 20, 140, 60, 128, dk(PURPLE, .65), dk(PURPLE, .2), 5)
    cliff(cv, 340, 470, 55, 128, dk(PURPLE, .65), dk(PURPLE, .2), 6)
    for x, wd in ((170, 5), (240, 12), (310, 6)):
        waterfall(cv, x, 38, 126, wd)
    forest_layer(cv, 60, (14, 22), 'pine', (dk(TEAL, .6), dk(TEAL, .3)), (7, 12))
    fog(cv, 125, 20, CYAN, .4)
    water(cv, 126, 150, dk(TEAL, .2), dk(INDIGO, .2), 240)
    crystal_cluster(cv, 60, 146, 28, CYAN)
    crystal_cluster(cv, 430, 148, 30, MAGENTA, PINK)
    for x in range(100, 400, 17):
        cv.ell(x, cv.rng.randint(134, 146), cv.rng.randint(3, 7), 2, dk(PURPLE, .3))
        flower(cv, x + 3, cv.rng.randint(140, 148), cv.rng.randint(5, 9), cv.rng.choice([PINK, SOFT, CYAN]))
    lantern(cv, 120, 100, 5)
    lantern(cv, 360, 100, 5)
    fireflies(cv, 30, (10, 20, 470, 145), CYAN)
    sparkles(cv, 14, (10, 5, 470, 140), cols=(CREAM, CYAN, SOFT))
    return cv


def banner_crystal(w=480, h=150):
    cv = Cv(w, h, seed=54)
    sky(cv, [(0, NAVY), (.5, dk(PURPLE, .55)), (1, dk(TEAL, .45))], 16)
    cv.glow(240, 80, 150, VIOLET, .4)
    stars(cv, 90, 80)
    ridge(cv, 90, 30, dk(PURPLE, .65), dk(INDIGO, .3), 9, 60, rim=PURPLE)
    r = cv.rng
    for x in range(0, 480, 26):
        crystal(cv, x + r.randint(-5, 5), 118 + r.randint(-5, 5), r.randint(26, 60), r.randint(7, 11), r.choice([dk(PURPLE, .1), dk(TEAL, .1), dk(MAGENTA, .3), dk(VIOLET, .2)]), r.randint(-5, 5))
    # crystal palace in middle
    for dx, hh in ((-30, 52), (-15, 74), (0, 96), (15, 74), (30, 52)):
        crystal(cv, 240 + dx, 120, hh, 12, lt(CYAN, .1) if dx else lt(PINK, .1), dx // 10)
    fog(cv, 118, 22, VIOLET, .4)
    water(cv, 122, 150, dk(TEAL, .2), dk(INDIGO, .2), 240)
    crystal_cluster(cv, 60, 150, 50, CYAN, lt(CYAN, .3))
    crystal_cluster(cv, 430, 150, 54, MAGENTA, PINK)
    crystal_cluster(cv, 150, 150, 24, VIOLET)
    crystal_cluster(cv, 340, 150, 24, CYAN)
    scene_fox(cv, 285, 146, .6, facing=-1)
    for x in range(20, 470, 36):
        flower(cv, x, r.randint(144, 149), r.randint(5, 9), r.choice([CYAN, PINK, SOFT]))
    fireflies(cv, 35, (10, 20, 470, 145), CYAN)
    sparkles(cv, 20, (10, 5, 470, 140), cols=(CREAM, CYAN, PINK))
    return cv
