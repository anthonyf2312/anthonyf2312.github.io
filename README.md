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
- `rushroyale/` — a plain-English Rush Royale reference (hub, basics, units, spells, resources,
  progression, modes, glossary). **Unlisted and in progress**: nothing on the site links to it,
  it is absent from `sitemap.xml`, and every page carries `noindex`. Reach it at
  `/rushroyale/`. Content lives in `units.json` / `spells.json` / `resources.json` /
  `glossary.json` and is rendered by `rushroyale.js`, so corrections are JSON edits.
  `pages.json` indexes every section heading for the section-wide search (⌘K / Ctrl+K); add to
  it when you add a section. Entries carrying a **Needs numbers** line still need real figures,
  and every unit card says whether it was checked in-game or imported from the wiki; none were
  invented.

  **This section has its own visual identity and does not share the root's.** It loads only
  `rushroyale.css` and `rushroyale.js` — not `style.css`, `docs.css` or `docs.js` — so it is
  light/dark aware, uses Manrope rather than Inter, and none of the root's tokens reach it.
  Restyling the rest of the site will not touch it, and vice versa
- `style.css` — design tokens at the top, one section per block
- `script.js` — kinetic hero type, scroll reveals
- `assets/` — McLaren speedmark PNGs ([icons8](https://icons8.com)), hand-made SVGs (ribbon, grain)
- `vendor/gsap/` — GSAP 3.13.0 + ScrollTrigger, self-hosted so animations don't depend on a third-party CDN being reachable

Deployed via GitHub Pages from `main`. Stylesheet/script links carry a `?v=N` cache-buster — bump it when editing them.
