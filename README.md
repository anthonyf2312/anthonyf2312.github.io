# anthonyf2312.github.io

Personal site — hand-written HTML/CSS/JS, no framework. Live at [anthonyf2312.github.io](https://anthonyf2312.github.io).

Dark type-poster design: Inter variable font with a cursor-reactive kinetic ANTHONY headline, film-grain + papaya glow background, McLaren speedmark ghosted through the F1 section, and a full-bleed orange MS section with a hand-drawn awareness ribbon.

## Structure

- `index.html` — the whole page
- `docs.html` / `docs.css` / `docs.js` — Tessel module documentation, and the funding bar
- `funding.json` — running-cost bar data. Updated by hand; nothing here is live
- `modules.html` / `modules.css` / `modules.js` — the Tessel module catalogue
- `modules.json` — catalogue data. `entries` are reviewed and signed (the bot verifies them against
  `modules.json.sig`); `listings` are submitted but unreviewed and the bot ignores them
- `rushroyale/` — a plain-English Rush Royale reference (hub, basics, units, items, resources,
  progression, modes, glossary). **Unlisted and in progress**: nothing on the site links to it,
  it is absent from `sitemap.xml`, and every page carries `noindex`. Reach it at
  `/rushroyale/`. Content lives in `units.json` / `items.json` / `resources.json` /
  `glossary.json` and is rendered by `rushroyale.js`, so corrections are JSON edits. The pages
  reuse `style.css`, `docs.css` and `docs.js` from the root — their links are root-absolute
  because the pages sit one level down. Entries marked with a hatched edge still need real
  numbers; none were invented
- `style.css` — design tokens at the top, one section per block
- `script.js` — kinetic hero type, scroll reveals
- `assets/` — McLaren speedmark PNGs ([icons8](https://icons8.com)), hand-made SVGs (ribbon, grain)
- `vendor/gsap/` — GSAP 3.13.0 + ScrollTrigger, self-hosted so animations don't depend on a third-party CDN being reachable

Deployed via GitHub Pages from `main`. Stylesheet/script links carry a `?v=N` cache-buster — bump it when editing them.
