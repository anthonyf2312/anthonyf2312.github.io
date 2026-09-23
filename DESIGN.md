---
name: Anthony
description: A personal page held to the standard of an Apple product page, with Stripe's polish.
colors:
  white: "#ffffff"
  grey: "#f5f5f7"
  black: "#000000"
  ink: "#1d1d1f"
  ink-2: "#6e6e73"
  on-dark: "#f5f5f7"
  on-dark-2: "#a1a1a6"
  hair: "#d2d2d7"
  hair-dark: "#2c2c2e"
  tile: "#161617"
  lando-volt: "#d2ff00"
  papaya: "#ff8000"
  papaya-text: "#a94f00"
  papaya-on-dark: "#ff9a3d"
  ribbon: "#f7862b"
typography:
  display:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 10vw, 6rem)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  statement:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.5rem)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.4vw, 1.75rem)"
    fontWeight: 650
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.9vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.012em"
  body:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.3vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.005em"
  label:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1
  fine:
    fontFamily: "'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  media: "28px"
  pill: "980px"
  focus: "6px"
spacing:
  s1: "0.5rem"
  s2: "1rem"
  s3: "1.5rem"
  s4: "2rem"
  s6: "3rem"
  s8: "4rem"
  s12: "6rem"
  s16: "8rem"
  gutter: "clamp(1.25rem, 5vw, 3rem)"
  section-y: "clamp(6rem, 13vw, 10rem)"
  container: "1080px"
components:
  button-pill:
    backgroundColor: "{colors.papaya}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.375rem"
    height: "2.75rem"
  text-link:
    textColor: "{colors.papaya-text}"
    height: "2.75rem"
  text-link-on-dark:
    textColor: "{colors.papaya-on-dark}"
    height: "2.75rem"
  nav:
    textColor: "{colors.ink}"
    height: "3rem"
  nav-dark:
    textColor: "{colors.on-dark}"
    height: "3rem"
  media-frame:
    rounded: "{rounded.media} on the inner corners only; the bled edge is square"
    width: "from its grid line to the viewport edge"
  hairline-list-item:
    textColor: "{colors.ink}"
    padding: "1.5rem 0"
---

# Design System: Anthony

## Overview

**Creative North Star: "The Product Page"**

A personal page built the way Apple builds a product page, with Stripe's finish: one idea per section, big confident type, real media, and scroll moments that carry the story. Every section is a full-width band on one of three grounds (white, Apple grey, true black), with content centred inside a 1080px column. Density is low on purpose. A section holds a headline, a lead, and at most one piece of media or one pair of actions.

Papaya is the only colour that isn't a neutral. It appears as the pill button, the text links, the drawn lines (the Sochi trace, the MS wave), the hero's drifting gradient band, and the full-bleed swatch band. Everything else is ink on paper or paper on black. Depth comes from the ground changing, not from shadows.

Motion has two layers. The first is one-time reveals as things enter view: text rises and sharpens, the team tile wipes in and the two halves of Lando's LN4 logo slide together, and the speedmark sweeps in. The second is scroll-driven CSS: it lights words, drifts the rain, draws lines, eases the hero away, and fills a reading-progress line under the nav. Reduced motion and browsers without `animation-timeline` get the finished state, never an empty one.

**Key Characteristics:**
- Three section grounds: white, Apple grey, black. The nav follows them.
- One accent, papaya, used for actions and drawn lines.
- Mona Sans only, weights 500 to 700, with tight tracking on display sizes.
- Images break the grid: they bleed off a viewport edge or cross a section edge, and the copy alternates sides. The quiet sections near the end are centred.
- Real media only: the rain photograph (Pixabay), McLaren marks as vectors (Wikimedia Commons), and Lando's LN4 logo (supplied by the owner). All credited.
- One-time reveals plus scroll-driven CSS, whose resting state is always the finished state.

## Colors

Apple's neutrals with one McLaren orange: the palette is almost entirely greyscale so papaya reads as the signal.

### Primary
- **Papaya** (#ff8000): pill button fill, the Sochi trace and MS wave strokes, the trace's finish dot, focus rings, text selection, the swatch band's left half, and `theme-color` for Discord embeds. Only as a fill or stroke; it fails as small text on white.
- **Burnt Papaya** (#a94f00): papaya as text on light grounds (text links). This is the AA-safe papaya for white and grey.
- **Lit Papaya** (#ff9a3d): papaya as text on black (text links, trace annotations for the rain and the finish).

### Secondary
- **Ribbon Orange** (#f7862b): the MS awareness ribbon orange. It appears only in the swatch band, beside papaya. It is a brand fact, not a second accent.

### Neutral
- **Paper White** (#ffffff): the default page ground.
- **Apple Grey** (#f5f5f7): the quiet ground for the Coming soon section and the footer. On black it is also the primary text colour (On-Dark).
- **True Black** (#000000): the cinematic ground for the Insko Bot and Formula 1 sections.
- **Ink** (#1d1d1f): primary text on light grounds, and text on papaya.
- **Ink Secondary** (#6e6e73): leads beneath headlines, secondary copy, fine print on light grounds.
- **On-Dark Secondary** (#a1a1a6): leads, axis labels and captions on black.
- **Hairline** (#d2d2d7): 1px dividers on light grounds (the hairline list, the footer rule, the wave baseline).
- **Hairline Dark** (#2c2c2e): 1px gridlines on black (the Sochi trace grid).
- **Tile** (#161617): a raised dark surface on black. Used for the McLaren / LN4 team tile, so it reads as an object rather than a hole.
- **Lando Volt** (#d2ff00): Lando Norris's brand colour. It appears only inside his LN4 mark, the same way the Insko icon keeps its own violet. It is never a page accent, text colour or fill.

### Named Rules
**The One Orange Rule.** Papaya is the only accent. It marks things you can act on, and lines that tell the story. Nothing decorative is papaya except the hero band and the swatch band, and each appears once.

**The Three Grounds Rule.** Every section sits on #ffffff, #f5f5f7 or #000000. Ground changes are the section breaks; no borders, cards or tinted panels stand in for them. The one exception is a photo band, where the photograph is the ground.

**The Papaya-As-Text Rule.** Text in papaya uses #a94f00 on light grounds and #ff9a3d on black. Raw #ff8000 is for fills and strokes only.

## Typography

**Display Font:** Mona Sans Variable (with -apple-system, BlinkMacSystemFont, Segoe UI, system-ui)
**Body Font:** Mona Sans Variable (same stack)

**Character:** One variable neo-grotesque doing everything, SF-like and neutral. Weight and tracking do the work a second family would do: 650 with tight negative tracking at display sizes, 500 for leads, 400 for body.

### Hierarchy
- **Display** (650, clamp(3.25rem, 10vw, 6rem), line-height 1, -0.04em): the hero name only. The 404 uses the same treatment one step down (clamp(3rem, 9vw, 5.5rem)).
- **Headline** (650, clamp(2.5rem, 6vw, 4.5rem), 1.05, -0.035em, balanced): one per section. Short declaratives ending in a full stop.
- **Statement** (650, clamp(2rem, 4.6vw, 3.5rem), 1.12, -0.035em): large standalone lines such as the scroll-lit statement, the quote, and the swatch line (these run between 3.5rem and 4rem at the top end). Max 18 to 24ch.
- **Title** (650, clamp(1.375rem, 2.4vw, 1.75rem), -0.025em): list item names and chart titles.
- **Lead** (500, clamp(1.1875rem, 1.9vw, 1.5rem), 1.4, -0.012em, pretty): the sentence under a headline, max 28 to 38ch, usually in the secondary colour. The hero lead runs slightly larger (up to 1.625rem).
- **Body** (400, clamp(1.0625rem, 1.3vw, 1.1875rem), 1.55): running text. The base body size is 1.0625rem.
- **Label** (400 to 600, 0.8125 to 0.875rem, line-height 1): nav links, chart axis and annotation labels, wave labels, swatch names. Sentence case, never uppercase.
- **Fine** (400, 0.8125rem, 1.45, secondary colour): photo credits and the footer.

### Named Rules
**The One Family Rule.** Mona Sans only. Hierarchy comes from size, weight (500, 560, 600, 650, 700) and tracking, never from a second typeface.

**The Tight Display Rule.** The bigger the type, the tighter the tracking: -0.04em at display, -0.035em at headline and statement, -0.025em at title, about -0.01em at body.

**The Sentence Case Rule.** No uppercase, no letter-spaced small labels, and no small line above a headline. A headline introduces itself.

## Layout

Content sits in `.container`: min(100% minus two gutters, 1080px), with a fluid gutter of clamp(1.25rem, 5vw, 3rem).

**Nothing Stays In Its Box.** Images never sit as centred boxes. Each one breaks a boundary tied to its story beat, and the copy alternates sides, so the page zigzags:
- The hero headline crosses the gradient band's slanted edge.
- The Insko icon sits right and crosses up from the black section into the white one above: a negative top margin of section-y plus 45% of the icon.
- The McLaren / LN4 team tile holds the right-hand grid line and bleeds off the right edge of the viewport, with the copy in a 24rem left column.
- Rain washes over the right end of the pinned Sochi chart.
- The rain panel bleeds off the left edge, with the copy in a 26rem right column.
- The speedmark sits large to the right of a left-aligned quote.
- The swatch band runs full-bleed.

Bleeding stages use named grid lines (`full-start` / `text` / `photo-start` / `full-end`) so the image column runs to the viewport edge while the text stays on the container. Sections after the swatch (MS, Coming soon) return to quiet centred stacks as the page's resolution. On phones every split stacks: headline, then the bleeding image, then the rest.

Centred sections are stacks (grid, justify-items centre, text centred) with a 1.5rem gap. Vertical padding comes from one fluid token, section-y (clamp(6rem, 13vw, 10rem)). Spacing uses a 0.5rem-based scale (0.5, 1, 1.5, 2, 3, 4, 6, 8rem). Rhythm inside a section is 1.5rem between headline, lead and actions, with 2 to 3rem before secondary notes and 6rem before lists or media.

Actions sit in a centred, wrapping row: pill first, text link second, 1rem by 2rem gap.

The sticky nav is 3rem tall; `scroll-padding-top` is 3.5rem so anchor jumps clear it. Breakpoints are content-driven: 36rem (hero band shortens, the hairline list stacks to one column) and 40rem (the chart thins its axis labels and drops optional annotations). Mobile keeps the same stack, just smaller type through the clamps.

## Elevation & Depth

Flat. There are no drop shadows anywhere. Depth comes from the ground changing (white to grey to black), from the translucent blurred nav, and from photographs. The only box-shadows are 1px or 4px spread rings with no offset and no blur, used as edges.

### Shadow Vocabulary
- **Icon edge** (`box-shadow: 0 0 0 1px rgb(255 255 255 / 0.14)`): a hairline around a dark app icon on black so its edge reads.
- **Knockout ring** (`box-shadow: 0 0 0 4px #000`): separates the trace's finish dot from the gridlines behind it.

### Named Rules
**The No-Shadow Rule.** Nothing floats. If something needs separating, change the ground, add a 1px hairline, or use a zero-offset ring.

## Shapes

Three curves. Media frames use a 28px radius on the corners that face the page. Corners that bleed off the viewport are square. Actions are full pills (980px). The app icon uses a squircle-like 27%. Focus rings are rounded to 6px. Everything else (sections, bands, lists) is square and edge to edge. Lists are separated by 1px hairlines, not boxed. Drawn lines use 3px round-capped, round-joined strokes.

## Components

### Buttons
Apple's pill, in papaya. Confident, and never more than one per action row.
- **Shape:** full pill (980px), at least 2.75rem tall.
- **Primary:** papaya fill, ink text, 600 weight, 1.0625rem, 0 1.375rem padding. The same on light and dark grounds.
- **Hover / Active:** fill lightens slightly to #ff9022 (200ms ease); press scales to 0.97 on the expo-out curve.
- **Focus:** 2px papaya outline, 3px offset.

### Text link with chevron
The secondary action, always beside or after a pill.
- **Style:** burnt papaya (#a94f00) on light grounds, lit papaya (#ff9a3d) on black. Weight 560, 1.0625rem, no underline at rest, 2.75rem tap height.
- **Glyph:** an inline Lucide chevron-right (18px, 2px stroke, currentColor) sits 0.2em after the label. External destinations use the Lucide external-link glyph (16px) instead.
- **Hover:** underline (1px, offset 0.2em).
- **Inline links** inside copy and credits inherit the text colour and keep the default underline.

### Navigation
A translucent Apple-style global bar that follows the ground beneath it.
- **Style:** sticky, 3rem tall, background rgb(251 251 253 / 0.72) with `backdrop-filter: saturate(180%) blur(20px)` and a 1px rgb(0 0 0 / 0.08) bottom rule. The name sits left (650, 1.0625rem, -0.02em). Section links sit right (0.875rem, ink at 80%, full ink on hover), each with a 2.75rem tap height.
- **Over black:** an IntersectionObserver on every `.dark` section sets `data-dark` when a dark section is under the bar. The bar then turns rgb(22 22 23 / 0.8), its rule becomes rgb(255 255 255 / 0.08), and the links go on-dark at 80%. The switch cross-fades over 300ms.
- **Mobile:** the same bar with the link gap tightened (clamp(1rem, 3vw, 2.25rem)). There is no hamburger menu.

### Hairline list
Replaces a card grid for short lists (Coming soon).
- **Style:** max 48rem, centred. A 1px hairline sits above the first row and below each row. Each row is a two-column grid (1fr / 1.4fr, baseline-aligned) holding a Title-size name and secondary body text, with 1.5rem vertical padding. Below 36rem each row stacks.

### Scroll-lit statement
One large sentence whose words light up in order as it crosses the viewport. It uses Statement type, max 24ch. Each word is a span animated from #8e8e93 to the text colour on a named view timeline, staggered by index. #8e8e93 keeps unlit words at 3:1 on white. At rest (reduced motion, or no support) every word is fully lit.

### Pinned Sochi trace (signature)
A data chart that pins while it draws. The section is 240vh tall; the chart sticks under the nav (top 3rem, min-height 100vh minus 3rem). On black, it has 1px hair-dark gridlines, P1 to P8 axis labels in on-dark secondary with tabular numbers, and a 3px papaya polyline revealed by an animated `clip-path` inset. Annotations fade in at the lap they describe: white 560-weight labels, lit papaya for the rain and the finish. A papaya dot with a 4px black knockout ring marks the finish. A visually hidden figcaption carries the full story in prose. The data is real (Jolpica lap positions).

### Photo frame and photo band
- **Team tile (F1, signature):** a 4:3 Tile-coloured (#161617) panel. It runs from `photo-start` to the right viewport edge, with a 28px radius on the left corners only. It holds the McLaren wordmark (top left, on-dark, papaya speedmark), Lando's LN4 logo in Lando Volt (66% of the height, anchored right), and "Lando Norris" (bottom left, 650). It wipes in from the right edge (clip-path). Then the logo's two interlocking pieces slide in along its slant and lock: the L up from the bottom left (translate -7% 26%), and the 4 down from the top right (7% -26%) 100ms later, over 1.1s. The wordmark and name follow at 1.15s. The parent section keeps `overflow-x: clip`, not `hidden`, so motion can't widen the page and the pinned trace stays sticky. The logo credits sit beneath as a left-aligned 0.8125rem caption.
- **Bleeding panel (rain):** runs from the left viewport edge to `panel-end`, min(42rem, 78vh) tall on a grey section, with a 28px radius on the right corners only. The image is 118% tall and drifts down 15% across the panel's view range, like falling rain. On phones it is 4:3.
- **Chart rain:** the same rain photo is inverted, grayscaled and crushed toward black, so its drops read as light specks. It sits behind the pinned chart at 0.55 opacity, masked to the right 40% of the chart. It fades in over contain 64% to 76%, just before lap 51.

### Swatch band
The page's one drenched moment: full-bleed, split 50/50 papaya and ribbon orange, with each half's name in small 600-weight ink at its outer bottom corner. A Statement-size line in ink is centred across both halves. It appears once.

### Hero gradient band
The Stripe move, used once: a band skewed -7deg, filling the top of the hero (clamp(17rem, 50vh, 30rem)). It has a #ffb86b base and three large radial blobs (#ff8000, #ff5a36, #ffd9ae) drifting on 22 to 30s alternate loops, animated by transform only. The display name overlaps its slanted lower edge. The hero content fades and rises 1.25rem on load (1100ms expo-out, staggered 120ms).

### Wave line
An illustrative SVG (not data): a 3px papaya path that rises for relapses and settles for remission, over a dashed 1px hairline baseline (3 6 dash). Sentence-case labels in ink secondary sit above or below. It draws left to right on a view() timeline.

### Motion grammar
- **Easing:** `--ease-out` cubic-bezier(0.16, 1, 0.3, 1) for entrances and presses; plain `ease` for colour transitions (200 to 300ms); `linear` for every scroll-driven animation.
- **Scroll-driven, and gated:** every scroll-linked animation sits inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`. Keyframes are written as `from` only (or with a finished `to`), so the unanimated state is always the finished state.
- **Longhands only:** write `animation-name`, `animation-timing-function`, `animation-fill-mode`, `animation-timeline`, `animation-range` as separate declarations. Never use the `animation` shorthand for a scroll-driven animation. The build's CSS minifier folds `animation-timeline` into the shorthand, and Chrome then drops the whole declaration, so the animation silently never runs.
- **Page navigation:** cross-document view transitions (`@view-transition { navigation: auto }`).
- **Reveals (`data-reveal`):** one-time, triggered by an IntersectionObserver in Base.astro (threshold 0.15, bottom margin -8%).
  - Content is hidden only under `html.js`, set by an inline head script, so a failed script never hides the page.
  - Variants: default (opacity, 1.5rem rise and 8px blur to sharp, over 700 to 900ms), `pop` (scale 0.88), `sweep` (35% slide and -14deg), `wipe-left` and `panel` (clip-path wipes).
  - Siblings inside `data-reveal-group` stagger 90ms each, capped at 5 steps.
  - Clip-based variants start fully clipped, and the observer treats fully clipped elements as invisible, so the script watches their parent instead.
  - Reduced motion keeps only a 400ms opacity fade.
- **Feedback:** text links draw a 1px underline in from the left (300ms) and nudge their chevron 3px. Nav links draw an underline on hover (250ms). The pill lightens and presses to 0.97.
- **Ambient scroll:** a 2px papaya reading-progress line along the nav's bottom edge (`scroll(root)`), and the hero content easing up and dimming as it exits.

## Do's and Don'ts

### Do:
- **Do** put every section on #ffffff, #f5f5f7 or #000000, and add the `.dark` class to black sections so the nav turns dark over them.
- **Do** pair one papaya pill with one chevron text link in a centred action row.
- **Do** use #a94f00 for papaya text on light grounds and #ff9a3d on black.
- **Do** write scroll-driven animations as longhands inside `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`, with the finished state as the default.
- **Do** source photographs from Pixabay through `scripts/fetch-pixabay.mjs` (IDs in `scripts/pixabay.json`). Commit them to `src/assets/pixabay/`, serve them through Astro's `Picture` (avif and webp at 640, 960 and 1280 widths), and credit each one both under the image and in the footer from `credits.json`.
- **Do** inline team and driver marks as SVG Astro components that colour through `currentColor`, and record where each came from in the component. The McLaren marks come from Wikimedia Commons; the LN4 logo was supplied by the owner. Say on the page who each mark belongs to. Use the exact path data from the source file, never retyped by hand.
- **Do** keep images at or below the 1280px the standard Pixabay key returns. Size frames and `sizes` attributes so a 1280px source is not stretched past it.
- **Do** keep tap targets at 2.75rem or more, and give every drawn chart a prose equivalent for screen readers.

### Don't:
- **Don't** use drop shadows, cards or tinted panels. Separate with the ground, a 1px hairline or a zero-offset ring.
- **Don't** add a second accent colour. Ribbon orange lives only in the swatch band.
- **Don't** use raw #ff8000 for small text on white or grey.
- **Don't** use the `animation` shorthand for a scroll-driven animation.
- **Don't** hotlink Pixabay images or ship the API key. The key stays in `.env`.
- **Don't** set labels in uppercase or tracked small caps, and don't put a small label line above a headline.
- **Don't** repeat the hero gradient band or the swatch band. Each is used once.
- **Don't** introduce a second typeface or an icon font. Icons are inline Lucide SVGs.
