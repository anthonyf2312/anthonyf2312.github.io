---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/404.astro"]
---

# Home page (src/pages/index.astro)

Scope: the single home page of anthonyf2312.github.io, plus its 404. Mode: Persuade.
Audience: Discord community owners, arriving from links shared in Discord, often on a phone. Job: learn who Anthony is and trust how he builds. Action: open Insko Bot (inskobot.me, request access), or view it on GitHub. Proof: Insko Bot exists and runs (inskobot.me, public README, its avatar). Constraints: no Insko feature list, no Tessel, GitHub and Discord shown as coming soon, keep the McLaren speedmark (credited to icons8), Pixabay photos downloaded and credited, F1 facts verified (Jolpica lap data).

## Direction contract

THESIS: A personal page built to the standard of an Apple product page, with Stripe's polish: one idea per section, big confident type, real media, scroll moments that tell the story. The user took the standing exit (the category canon) after seeing the Server Sidebar build. It refuses half-measures: no quirk smuggled in, and no dev-portfolio card grid.

OWN-WORLD: Mixed light and dark sections. White #ffffff and Apple grey #f5f5f7 for light sections, pure black #000000 for the dark cinematic ones. Ink #1d1d1f, secondary #6e6e73 (light) / #a1a1a6 (dark). Papaya #ff8000 is the one accent: pill buttons, the Sochi trace, the wave, the hero gradient, and the full-bleed hinge band. Mona Sans only (SF-like neo-grotesque), weights 500–700, tight tracking on display. 28px radii on media and tiles, pill buttons, translucent blurred global nav. A Stripe-style skewed papaya mesh gradient band, once, in the hero.

STORY: Hero says who he is and what he builds, with Meet Insko Bot / Request access. A scroll-lit statement delivers F1 and MS in one line. Insko Bot (black) shows the icon, one sentence, and two actions. F1 (black): the photo expands, then the pinned Sochi trace draws lap by lap, then the rain (light grey photo band), then the "worst day" line. The papaya band holds the coincidence line. MS (white): plain words, the wave, "keep building", What is RRMS. Coming soon tiles, then the footer.

FIRST VIEWPORT: The translucent nav at the top (Anthony, then Insko Bot, Formula 1, MS). A skewed papaya gradient band fills the top half, drifting slowly. Centred beneath and over its lower edge: "I'm Anthony." at up to 6rem, weight 650, then a 3-line lead, then a papaya pill "Meet Insko Bot" and a text link "Request access". On mobile the same stack, with headline ~3rem.

FORM: Canon (standing exit), executed straight to Apple + Stripe references; seed key 2f8519f3. Motion grammar: a load fade-rise on the hero, and scroll-driven CSS for the statement word-lighting, the photo expand, the pinned trace draw and the wave. Reduced motion and unsupported browsers get the finished state.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

The Sochi trace draws while the section is pinned: P1, the pit dip, back to P1, then the drop in the rain to P7.

## Unresolved

- Lando photo source is 1280px (Pixabay standard key cap); soft on 2x screens at the 1180px frame. Accepted by the user on 2026-09-23 ("Accept 1280px for now"); lift later via Pixabay full API access and `npm run images`.
