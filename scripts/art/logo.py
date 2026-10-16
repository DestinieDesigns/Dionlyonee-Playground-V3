"""Destinie wordmark: genuine vector SVG (glyph outlines) + PNG rendered from it."""
import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import os

FONT = os.path.join(os.path.dirname(__file__), 'fonts', 'CinzelDecorative-Bold.ttf')


def star4(cx, cy, r, fill, op=1):
    k = r * .22
    return (f'<path d="M{cx} {cy-r} L{cx+k} {cy-k} L{cx+r} {cy} L{cx+k} {cy+k} L{cx} {cy+r} L{cx-k} {cy+k} L{cx-r} {cy} L{cx-k} {cy-k} Z" fill="{fill}" opacity="{op}"/>')


def leaf(x, y, ang, s, fill):
    return f'<path d="M0 0 C{s*.5} {-s*.45} {s} {-s*.2} {s*1.1} 0 C{s} {s*.2} {s*.5} {s*.45} 0 0 Z" fill="{fill}" transform="translate({x} {y}) rotate({ang})"/>'


def diamond(cx, cy, w, h, fill, hi):
    return (f'<path d="M{cx} {cy-h} L{cx+w} {cy} L{cx} {cy+h} L{cx-w} {cy} Z" fill="{fill}" stroke="#151B3E" stroke-width="3" stroke-linejoin="round"/>'
            f'<path d="M{cx} {cy-h} L{cx-w} {cy} L{cx} {cy+h*.2} Z" fill="{hi}" opacity=".85"/>')


def build_svg(text='Destinie'):
    f = TTFont(FONT)
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    upm = f['head'].unitsPerEm
    x = 0
    items = []
    for ch in text:
        gn = cmap[ord(ch)]
        items.append((gn, x))
        x += gs[gn].width
    total = x
    bp = BoundsPen(gs)
    ys = []
    for gn, ox in items:
        b = BoundsPen(gs)
        gs[gn].draw(b)
        ys += [b.bounds[1], b.bounds[3]]
    s = 880 / total
    baseline = 238
    left = (1200 - total * s) / 2 + 11
    d = ''
    for gn, ox in items:
        pen = SVGPathPen(gs)
        gs[gn].draw(TransformPen(pen, (s, 0, 0, -s, left + ox * s, baseline)))
        d += pen.getCommands()
    cap_top = baseline - max(ys) * s
    defs = ('<defs>'
            '<linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#FFF3DF"/><stop offset=".38" stop-color="#FFB6D9"/>'
            '<stop offset=".72" stop-color="#D94CF2"/><stop offset="1" stop-color="#6A35C9"/></linearGradient>'
            '<linearGradient id="vine" x1="0" y1="0" x2="1" y2="0">'
            '<stop offset="0" stop-color="#238F9D"/><stop offset=".5" stop-color="#57DDF5"/><stop offset="1" stop-color="#238F9D"/></linearGradient>'
            '</defs>')
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-label="{text}">', '<title>' + text + '</title>', defs]
    # glow + outline layers
    parts.append(f'<path d="{d}" fill="none" stroke="#A64DFF" stroke-opacity=".18" stroke-width="34" stroke-linejoin="round"/>')
    parts.append(f'<path d="{d}" fill="none" stroke="#D94CF2" stroke-opacity=".30" stroke-width="20" stroke-linejoin="round"/>')
    parts.append(f'<path d="{d}" fill="#151B3E" stroke="#151B3E" stroke-width="12" stroke-linejoin="round"/>')
    parts.append(f'<path d="{d}" fill="url(#fill)" stroke="#FFD166" stroke-width="2.5" stroke-linejoin="round"/>')
    # vine flourish under the word
    vy = 318
    vine = f'M150 {vy} C300 {vy+34} 420 {vy-26} 600 {vy} C780 {vy+26} 900 {vy-34} 1050 {vy}'
    parts.append(f'<path d="{vine}" fill="none" stroke="#151B3E" stroke-width="9" stroke-linecap="round"/>')
    parts.append(f'<path d="{vine}" fill="none" stroke="url(#vine)" stroke-width="4.5" stroke-linecap="round"/>')
    for i, (lx, ly, a, sz) in enumerate([(230, 330, -50, 26), (310, 320, 40, 22), (400, 308, -55, 24), (505, 311, 35, 22), (695, 311, -35, 22), (800, 320, 55, 24), (890, 308, -40, 22), (970, 322, 50, 26)]):
        parts.append(leaf(lx, ly, a, sz, '#238F9D' if i % 2 else '#57DDF5'))
    for fx, c in ((350, '#FF66B8'), (850, '#FF66B8'), (600, '#FFD166')):
        fy = vy - 14 if fx != 600 else vy - 8
        for k in range(5):
            a = k / 5 * 2 * math.pi
            parts.append(f'<circle cx="{fx+math.cos(a)*9:.1f}" cy="{fy+math.sin(a)*9:.1f}" r="7" fill="{c}" stroke="#151B3E" stroke-width="2"/>')
        parts.append(f'<circle cx="{fx}" cy="{fy}" r="5" fill="#FFF3DF"/>')
    parts.append(diamond(110, vy, 16, 28, '#57DDF5', '#FFFFFF'))
    parts.append(diamond(1090, vy, 16, 28, '#D94CF2', '#FFB6D9'))
    # stars / sparkles around the word
    top = cap_top
    for sx, sy, r, c in ((left + 30, 80, 20, '#FFD166'), (1130, 96, 24, '#FFD166'), (230, 54, 12, '#FFF3DF'), (960, 58, 14, '#57DDF5'), (600, 52, 10, '#FFB6D9'), (1030, 40, 9, '#FFF3DF'), (96, 190, 9, '#57DDF5')):
        parts.append(star4(sx, sy, r + 5, '#151B3E', .45))
        parts.append(star4(sx, sy, r, c))
    parts.append('</svg>')
    return '\n'.join(parts)
