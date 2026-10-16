"""Small scene creatures (sprites that get outlined and pasted into scenes)."""
from elements import *

FOX = H('f2833a')
FOX_D = H('b94a2e')
FOX_L = H('ffb15c')


def scene_fox(cv, x, base, s=1.0, facing=1, mark=GOLD):
    W, Hh = int(56 * s) + 8, int(52 * s) + 8
    sp = Cv(W, Hh, transparent=True)
    ox, oy = int(24 * s) + 4, Hh - 4  # sprite origin (feet)
    f = lambda v: v * s
    X = lambda dx: ox + dx * s
    Y = lambda dy: oy + dy * s
    # tail
    for dx, dy, r in [(-9, -6, 7), (-15, -9, 7.5), (-19, -15, 7), (-20, -22, 5.5)]:
        sp.ell(X(dx), Y(dy), f(r), f(r * .85), FOX)
    for dx, dy, r in [(-10, -8, 4), (-16, -12, 4), (-20, -17, 3)]:
        sp.ell(X(dx - 1), Y(dy - 1), f(r), f(r * .8), FOX_L)
    sp.ell(X(-20), Y(-27), f(4.5), f(4), CREAM)
    sp.ell(X(-21), Y(-27), f(3), f(2.5), WHITE)
    # body
    sp.ell(X(-1), Y(-11), f(9), f(11), FOX)
    sp.ell(X(2), Y(-10), f(5.5), f(8.5), CREAM)
    sp.ell(X(-5), Y(-6), f(7), f(6), FOX_D)
    sp.ell(X(-5), Y(-7), f(6), f(5), FOX)
    sp.ell(X(-6), Y(-9), f(3), f(3), FOX_L)
    # legs
    sp.rect(X(3), Y(-12), X(6), Y(0), FOX)
    sp.rect(X(3), Y(-4), X(6), Y(0), H('4a2540'))
    sp.rect(X(-3), Y(-3), X(2), Y(0), H('4a2540'))
    # head
    sp.poly([(X(2), Y(-30)), (X(3), Y(-41)), (X(9), Y(-31))], FOX)
    sp.poly([(X(8), Y(-31)), (X(14), Y(-40)), (X(16), Y(-29))], FOX)
    sp.poly([(X(4), Y(-31)), (X(4), Y(-38)), (X(8), Y(-32))], SOFT)
    sp.poly([(X(10), Y(-31)), (X(13), Y(-37)), (X(14), Y(-30))], SOFT)
    sp.ell(X(8), Y(-25), f(9), f(7.5), FOX)
    sp.ell(X(7), Y(-27), f(6), f(4), FOX_L)
    sp.poly([(X(12), Y(-27)), (X(22), Y(-23)), (X(12), Y(-18))], CREAM)
    sp.poly([(X(3), Y(-20)), (X(10), Y(-17)), (X(6), Y(-13)), (X(0), Y(-17))], CREAM)
    sp.poly([(X(14), Y(-28)), (X(22), Y(-24)), (X(21), Y(-23)), (X(14), Y(-25))], FOX_L)
    sp.ell(X(22), Y(-23.5), f(1.6), f(1.4), H('2a1530'))
    # eye
    sp.ell(X(13), Y(-26), f(2.2), f(2.6), H('2a1530'))
    sp.ell(X(13), Y(-26), f(1.4), f(1.8), CYAN)
    sp.px(X(12), Y(-27), WHITE)
    # blush + crescent mark
    sp.ell(X(11), Y(-21), f(1.8), f(1.1), PINK)
    sp.poly([(X(7), Y(-32)), (X(9), Y(-33)), (X(10), Y(-31)), (X(8.5), Y(-31.5))], mark)
    # magical scarf
    sp.poly([(X(0), Y(-19)), (X(9), Y(-17)), (X(9), Y(-14)), (X(1), Y(-14))], MAGENTA)
    sp.poly([(X(3), Y(-15)), (X(6), Y(-15)), (X(5), Y(-8)), (X(3), Y(-9))], VIOLET)
    sp.px(X(8), Y(-17), GOLD)
    im = outline_layer(sp.img)
    if facing < 0:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
        ox2 = W - ox
    else:
        ox2 = ox
    cv.paste(im, x - ox2, base - (Hh - 4))
    cv.glow(x + facing * 10 * s, base - 25 * s, 16 * s, VIOLET, .35)
    cv.glow(x + facing * 8 * s, base - 31 * s, 5 * s, mark, .6)
    cv.glow(x + facing * 13 * s, base - 26 * s, 3, CYAN, .5)
