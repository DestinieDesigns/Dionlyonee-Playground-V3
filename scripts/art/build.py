"""Build the Destinie art pack.   Usage: python3 scripts/art/build.py   (needs pillow numpy fonttools cairosvg)"""
import json, os, sys, zipfile, re
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image
import scenes, chars, thumbs, decor, logo

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'images')
manifest = []


def save(sub, name, im, fmt, purpose, page):
    d = os.path.join(OUT, sub)
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name)
    if fmt == 'webp':
        if im.mode == 'RGBA':
            im.save(p, 'WEBP', quality=90, alpha_quality=100, method=6)
        else:
            im.save(p, 'WEBP', quality=90, method=6)
    elif fmt == 'png':
        im.save(p, 'PNG', optimize=True)
    manifest.append({'file': f'assets/images/{sub}/{name}', 'width': im.size[0], 'height': im.size[1], 'format': fmt, 'transparent': im.mode == 'RGBA', 'purpose': purpose, 'page': page})
    print('wrote', name, im.size)


def main():
    S4 = lambda cv, size, **k: cv.render(4, size=size, **k)
    save('backgrounds', 'destinie-hero.webp', S4(scenes.hero(), (1920, 1080), vignette=.35), 'webp', 'Main homepage hero (calm centre for heading/buttons)', 'index.html (.destinie-hero)')
    save('backgrounds', 'destinie-forest-background.webp', S4(scenes.forest_bg(), (1920, 1080), vignette=.3), 'webp', 'Alternative section background: enchanted forest', 'index.html / lobby & waiting screens')
    save('backgrounds', 'destinie-moonlit-garden.webp', S4(scenes.garden_bg(), (1920, 1080), vignette=.3), 'webp', 'Alternative section background: moonlit garden', 'index.html / lobby & waiting screens')
    save('backgrounds', 'destinie-crystal-cavern.webp', S4(scenes.cavern_bg(), (1920, 1080), vignette=.3), 'webp', 'Alternative section background: crystal cavern', 'index.html / lobby & waiting screens')
    for n, fn, pg in (('enchanted-forest', scenes.banner_forest, 'Section banner: enchanted forest'), ('moonlit-castle', scenes.banner_castle, 'Section banner: moonlit castle'), ('magical-waterfall', scenes.banner_waterfall, 'Section banner: magical waterfall'), ('crystal-kingdom', scenes.banner_crystal, 'Section banner: crystal kingdom')):
        save('banners', f'banner-{n}.webp', S4(fn(), (1920, 600), vignette=.25), 'webp', pg, 'index.html section headers / game hub banners')
    for n in ('fox', 'fairy', 'rabbit', 'dragon', 'cat', 'owl'):
        nm = {'fox': 'mystical-fox', 'fairy': 'forest-fairy', 'rabbit': 'moon-rabbit', 'dragon': 'crystal-dragon', 'cat': 'starlight-cat', 'owl': 'enchanted-owl'}[n]
        save('characters', f'character-{nm}.webp', getattr(chars, 'p_' + n)().render(4, bloom=.15), 'webp', f'Character portrait card: {nm}', 'character / avatar cards (contestant pickers)')
    for n, nm in (('fox', 'destinie-fox-fullbody'), ('fairy', 'destinie-fairy-fullbody'), ('companion', 'destinie-magical-companion')):
        save('characters', f'{nm}.webp', getattr(chars, 'f_' + n)().render(4), 'webp', f'Full-body character (transparent): {nm}', 'welcome / waiting screens, mascots')
    for gid, fn in thumbs.THUMBS.items():
        save('games', f'game-{gid}.webp', fn().render(2, bloom=.2), 'webp', f'Game thumbnail: {gid}', f'{gid}/index.html and index.html game card')
    for nm, fn, sz in (('magic-sparkles', decor.d_sparkles, 4), ('floating-fireflies', decor.d_fireflies, 4), ('fantasy-crystal-cluster', decor.d_crystals, 4), ('fantasy-flower-vines', decor.d_vines, 4), ('fantasy-golden-stars', decor.d_stars, 4), ('fantasy-moon-decoration', decor.d_moon, 4)):
        save('decorations', f'{nm}.png', fn().render(sz, pad=16), 'png', f'Transparent decorative overlay: {nm}', 'any page (overlay)')
    save('decorations', 'fantasy-cloud-overlay.png', decor.d_cloud(), 'png', 'Transparent cloud overlay', 'any page (overlay)')
    save('decorations', 'fantasy-magical-mist.png', decor.d_mist(), 'png', 'Transparent magical mist overlay', 'any page (overlay)')
    # logo
    svg = logo.build_svg('Destinie')
    os.makedirs(os.path.join(OUT, 'branding'), exist_ok=True)
    with open(os.path.join(OUT, 'branding', 'destinie-logo.svg'), 'w', encoding='utf-8') as f:
        f.write(svg)
    import cairosvg
    cairosvg.svg2png(bytestring=svg.encode(), write_to=os.path.join(OUT, 'branding', 'destinie-logo.png'), output_width=1200, output_height=400)
    manifest.append({'file': 'assets/images/branding/destinie-logo.png', 'width': 1200, 'height': 400, 'format': 'png', 'transparent': True, 'purpose': 'Destinie wordmark (transparent PNG)', 'page': 'header / hero / waiting screens'})
    manifest.append({'file': 'assets/images/branding/destinie-logo.svg', 'width': 1200, 'height': 400, 'format': 'svg', 'transparent': True, 'purpose': 'Destinie wordmark (true vector: glyph outlines + paths)', 'page': 'header / hero / waiting screens'})
    with open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    return manifest


if __name__ == '__main__':
    main()
