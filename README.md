# anthonyf2312.github.io

Personal site — hand-written HTML/CSS/JS, no framework. Live at [anthonyf2312.github.io](https://anthonyf2312.github.io).

Dark type-poster design: Inter variable font with a cursor-reactive kinetic ANTHONY headline, film-grain + papaya glow background, McLaren speedmark ghosted through the F1 section, and a full-bleed orange MS section with a hand-drawn awareness ribbon.

## Structure

- `index.html` — the whole page
- `style.css` — design tokens at the top, one section per block
- `script.js` — kinetic hero type, scroll reveals
- `assets/` — McLaren speedmark PNGs ([icons8](https://icons8.com)), hand-made SVGs (ribbon, grain)
- `vendor/gsap/` — GSAP 3.13.0 + ScrollTrigger, self-hosted so animations don't depend on a third-party CDN being reachable

Deployed via GitHub Pages from `main`. Stylesheet/script links carry a `?v=N` cache-buster — bump it when editing them.
