# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, built and deployed by GitHub Actions to GitHub Pages (user choice). Node LTS installed locally for build and preview.

## Users

Primary: Discord community owners deciding whether to trust Anthony with their server, now through Insko Bot (access by request) or later through Patchr, the public bot he is building. They usually arrive from a link shared inside Discord, often from Discord's dark UI.

Secondary, confirmed through the content rather than as targets: F1 fans, and people newly diagnosed with MS who find the page and need to see someone with MS who keeps building.

## Product Purpose

The personal home page of Anthony (GitHub: anthonyf2312), served at https://anthonyf2312.github.io. It introduces who he is, points to the Discord bot he has built, and says plainly what he cares about off the clock (Formula 1) and what he lives with (relapsing-remitting MS). Success: a community owner leaves knowing what Anthony builds, trusting how he builds it, and knowing where to go next.

## Positioning

He builds Discord bots for communities that take themselves seriously: moderation that keeps receipts, leveling people actually care about, dashboards that don't fight you. He also says openly that he has RRMS, which you'll hear from him before you hear it about him. A generic bot developer's portfolio can't honestly say either of those things.

## Operating Context

- Links to the site get shared in Discord, which unfurls them as embeds (og tags, theme-color).
- Insko Bot: a private, self-hosted Discord bot built for Insko's community, where servers can request access. Site: https://inskobot.me. Repo (README, changelog, terms, privacy): https://github.com/anthonyf2312/InskoBot. The user asked that the home page not list its features.
- Patchr is the public bot: it posts patch notes to Discord, from GitHub releases or written by hand. It isn't live yet, so the home page shows it as coming soon, with no invite link. Its Discord server opens, and its code (github.com/anthonyf2312/patchr, MIT) goes public, at launch. Brand kit: brand/ in this repo (copied from the Patchr project).
- Patchr has its own site at /patchr/ (plus /patchr/privacy/ and /patchr/terms/, copied word for word from the Patchr repo's PRIVACY.md and TERMS.md). It acts as its own website: its own brand, nav, favicon and link preview, and no links back to the personal pages. The home page's hero leads with "Meet Patchr" (to /patchr/) and "View code" (to the Patchr repo). Until launch its Add to Discord button is shown disabled with a "Soon" tag; at launch it becomes the invite link.

## Capabilities and Constraints

- Sections: intro/about, Insko Bot, F1 ("Off the clock": McLaren, Lando Norris, since Sochi 2021), MS, Patchr (coming soon, linking to /patchr/).
- External links (GitHub, inskobot.me, anything off-site) open in a new tab. The user's standing preference (2026-09-23).
- Contact: GitHub and Discord, both shown as "coming soon" (not live links).
- Imagery from Pixabay via the user's API key (kept in local `.env`, never committed or shipped). Images are downloaded and committed, never hotlinked.
- Everything from the previous site is removed: Tessel docs and catalogue, the Rush Royale guide, all old history. The home page does not mention Tessel.
- F1 race facts must be verified before publishing.

## Brand Commitments

- Keep the McLaren speedmark. It is now the vector from Wikimedia Commons (a McLaren trademark). The user also asked for McLaren and Lando branding in place of a car photo (2026-09-23): the McLaren wordmark plus Lando's LN4 logo, which the user supplied as SVG and PNG (2026-09-23), shown in its own volt #d2ff00. An earlier striped number 4 from Commons was wrong and has been removed.
- Papaya (McLaren) and the MS awareness ribbon are nearly the same orange. The user's own line: "coincidence. keeping it."
- Voice: dry, direct, a little wry. Short sentences. The user's own lines to keep in spirit: "Backing someone on their worst day beats joining on their best." "It changes my pace, not my direction." "Keep building."
- Must not feel: sentimental about MS, busy or over-animated, like a generic dev portfolio, or like a cheesy fan site.
- Visual bar (user's standing preference, 2026-09-23): Apple product pages first, with Stripe's polish. Mixed light and dark sections. The user rejected a Discord-channel ("doc style") concept in favour of this.
- Patchr site (2026-09-23): the Discord-bot landing page of MEE6, YAGPDB and Carl.gg (the user's named references), finished like the personal site. It uses Patchr's own brand kit (deep ink, mist, pink, Inter), not the personal site's papaya and Mona Sans. Discord screens are product shots; their Discord greys stay inside the screen.

## Evidence on Hand

- User-written copy for the intro, F1 and MS sections (rough, allowed to be tightened).
- Insko Bot: inskobot.me (live), public repo README, banner at `public/banner.png` in that repo.
- McLaren speedmark and 2026 wordmark as vectors (Wikimedia Commons), and Lando Norris's LN4 logo (supplied by the user), in src/components/.
- No testimonials, server counts or user numbers. Don't invent any.

## Product Principles

1. Say it straight. Plain statements, no hype, no pity.
2. Show, don't list: one real project and one real story beat a skills wall.
3. Restraint is the point: empty space and one bold element, not many.
4. The visitor from Discord comes first: fast, readable on a phone, and good-looking when unfurled.

## Accessibility & Inclusion

Anthony has MS, and some visitors may too (fatigue, visual symptoms, tremor). Honour reduced motion fully, keep text contrast at WCAG AA or better, keep tap targets generous, and never hide content behind animation timing.
