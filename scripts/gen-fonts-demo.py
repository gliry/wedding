#!/usr/bin/env python3
"""Scan public/fonts for Cyrillic-capable fonts and (re)generate
public/fonts-test.html — a standalone page that shows "Ильдар & Екатерина"
in every Cyrillic font at once, over the hero photo.

Usage: python3 scripts/gen-fonts-demo.py
Add a font to public/fonts/ and re-run.
"""
import os, glob, html
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(ROOT, "public/fonts")
OUT = os.path.join(ROOT, "public/fonts-test.html")
SAMPLE = sorted(set("ИльдарЕкатерина"))


def cyrillic_fonts():
    files = sorted(
        glob.glob(f"{FONTS_DIR}/**/*.otf", recursive=True)
        + glob.glob(f"{FONTS_DIR}/**/*.ttf", recursive=True)
        + glob.glob(f"{FONTS_DIR}/**/*.woff", recursive=True)
        + glob.glob(f"{FONTS_DIR}/**/*.woff2", recursive=True)
    )
    out = []
    for path in files:
        try:
            f = TTFont(path, fontNumber=0)
            allmap = {}
            for t in f["cmap"].tables:
                if t.cmap:
                    allmap.update(t.cmap)
        except Exception:
            continue
        total = sum(1 for cp in allmap if 0x0400 <= cp <= 0x04FF)
        if total > 0 and all(ord(c) in allmap for c in SAMPLE):
            rel = "/" + os.path.relpath(path, os.path.join(ROOT, "public")).replace(os.sep, "/")
            out.append({"url": rel, "label": os.path.basename(path), "cyr": total})
    return out


FACE = "  @font-face {{ font-family: 'demo{i}'; src: url('{url}'); font-display: swap; }}"
CARD = """    <div class="card">
      <div class="names" style="font-family:'demo{i}',cursive">Ильдар<span class="amp">&amp;</span>Екатерина</div>
      <div class="latin" style="font-family:'demo{i}',cursive">Ildar &amp; Ekaterina</div>
      <div class="label">{n} · {label} · {cyr} кир. глифов</div>
    </div>"""


def build(fonts):
    faces = "\n".join(FACE.format(i=i, url=f["url"]) for i, f in enumerate(fonts))
    cards = "\n\n".join(
        CARD.format(i=i, n=i + 1, label=html.escape(f["label"]), cyr=f["cyr"])
        for i, f in enumerate(fonts)
    )
    return f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Шрифты — Ильдар &amp; Екатерина</title>
<style>
{faces}
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ background:#2b2719; color:#f4eddf; font-family:ui-sans-serif,system-ui,sans-serif;
    -webkit-font-smoothing:antialiased; padding:4vh 5vw 12vh; }}
  h1 {{ font-weight:400; font-size:clamp(1rem,3vw,1.4rem); letter-spacing:.25em;
    text-transform:uppercase; opacity:.7; text-align:center; margin-bottom:5vh; }}
  .grid {{ display:grid; gap:4vh; max-width:1100px; margin:0 auto; }}
  .card {{ border:1px solid rgba(244,237,223,.14); border-radius:18px;
    padding:clamp(1.5rem,4vw,3rem) 1.5rem; text-align:center;
    background:linear-gradient(rgba(20,18,10,.35),rgba(20,18,10,.55)),
      url('/photos/sections/img_2309-lg.jpg') center 30% / cover; }}
  .names {{ line-height:1.15; font-size:clamp(3rem,13vw,6.5rem);
    text-shadow:0 2px 10px rgba(0,0,0,.78),0 4px 28px rgba(0,0,0,.6),0 0 4px rgba(0,0,0,.85); }}
  .names .amp {{ display:block; font-size:.7em; opacity:.9; margin:-.1em 0; }}
  .latin {{ font-size:clamp(1.4rem,6vw,3rem); margin-top:.4em; opacity:.85; }}
  .label {{ margin-top:1.4rem; font-family:ui-sans-serif,system-ui,sans-serif;
    font-size:.8rem; letter-spacing:.18em; text-transform:uppercase; opacity:.6; }}
</style>
</head>
<body>
  <h1>Шрифты для hero · «Ильдар &amp; Екатерина»</h1>
  <div class="grid">
{cards}
  </div>
</body>
</html>
"""


if __name__ == "__main__":
    fonts = cyrillic_fonts()
    open(OUT, "w").write(build(fonts))
    print(f"{len(fonts)} Cyrillic fonts → {OUT}")
    for i, f in enumerate(fonts):
        print(f"  {i+1}. {f['label']} ({f['cyr']})")
