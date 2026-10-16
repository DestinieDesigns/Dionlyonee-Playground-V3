# Destinie art generator
Procedural pixel-art generator for `assets/images/*`.

    pip install pillow numpy fonttools cairosvg
    python3 scripts/art/build.py

Low-res scenes are drawn with Pillow (crisp pixels), then upscaled with nearest-neighbour, with smooth glow/bloom added at full resolution. `fonts/CinzelDecorative-Bold.ttf` is SIL OFL 1.1 (© 2012 Natanael Gama).
