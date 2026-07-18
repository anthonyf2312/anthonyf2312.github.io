# GSAP Motion Pass — Design

**Date:** 2026-07-18
**Site:** anthonyf2312.github.io (dark type-poster personal page, hand-built HTML/CSS/JS)

## Goal

Add a cohesive layer of subtle animation across the site: a papaya "stinger" wipe
on load, richer scroll effects, ambient idle motion, and micro-interactions —
implemented with GSAP + ScrollTrigger.

## Approach

GSAP 3.13+ core + ScrollTrigger from CDN (jsdelivr), loaded with `defer`
(~70KB total). GSAP 3.13+ is fully free, ScrollTrigger included.

All motion is gated through `gsap.matchMedia()`:

- `prefers-reduced-motion: reduce` → no stinger, no animation; the site renders
  statically exactly as it does today.
- No JS (or CDN blocked) → existing fallback stands: content is visible because
  hidden states only apply under the `.js` class. The stinger overlay is
  `display: none` without `.js`. **If GSAP fails to load (CDN blocked but JS
  running), a guard skips all motion code and reveals content**, so the page
  never renders blank.

All animation is `transform`/`opacity` only. No layout properties are animated.

## 1. Stinger + entrance sequence (on load, every load)

1. A fixed full-viewport panel in papaya (`--papaya #ff8000`) sits above
   everything including the grain layer (`z-index` above 50). It covers the
   page from the first paint — no flash of unstyled content. To guarantee
   this, the `.js` class moves from `script.js` to a one-line inline script
   in `<head>` (deferred scripts run too late to beat first paint); without
   JS the class is never added and the overlay stays `display: none`.
2. Its leading edge is cut at ~15° via `clip-path`, so the sweep reads as a
   racing-slash wipe.
3. GSAP sweeps it off toward the top-right, ~0.7s, strong ease-out
   (`power3.out`-family). The panel is removed from the DOM when done.
4. As the trailing edge clears the hero: eyebrow items fade/slide in with a
   small stagger; the ANTHONY letters rise in one-by-one while their variable
   weight ramps 200→600; the scroll cue fades in last.
5. The existing kinetic cursor effect then takes over — it animates the same
   `--w` custom property per letter, so the handoff is seamless (kinetic rAF
   loop starts after the entrance weight ramp completes).

Total load sequence ≈ 1.2s. Runs every load (it is sub-second and is the brand
moment); no sessionStorage suppression.

## 2. Scroll effects (replaces IntersectionObserver reveals)

- The current IO-based `.reveal` logic in `script.js` is removed; ScrollTrigger
  drives equivalent fade-up reveals.
- Multi-element sections stagger ~0.1s between elements instead of arriving as
  one block: work rows; F1 body/tags/note; MS paragraphs + link.
- The two poster headlines ("PAPAYA, / SINCE SOCHI." and "AND YES — /
  I HAVE MS.") reveal line-by-line.
- Parallax, scrubbed to scroll position: the McLaren speedmark (`.f1-mark`)
  and MS ribbon (`.ms-ribbon`) drift a few rem vertically plus a degree or two
  of rotation as their sections cross the viewport. Because GSAP will own their
  transforms, the current CSS centering transforms move to layout (e.g.
  margin/positioning) or are set as GSAP defaults so scrub and float compose
  additively rather than overwrite.

## 3. Ambient / idle motion

- Very slow yoyo float loops on the speedmark and ribbon (they never sit
  perfectly still), composed additively with the parallax.
- The two background radial glows get an imperceptibly slow drift (the glows
  move to a dedicated fixed element behind the content so they can be animated
  with transforms instead of repainting `background`).

## 4. Micro-interactions

- Nav links: underline sweep on hover (pure CSS, no GSAP).
- Work-row arrow: "magnetic" — eases a few px toward the cursor within its row
  via `gsap.quickTo`; resets on leave. Mouse pointers only.
- MS pill link: press feedback (slight scale on `:active`, pure CSS).
- Existing hover weight-ramp on row titles stays as is.

## Files touched

| File | Change |
|---|---|
| `index.html` | stinger overlay div, glow element, GSAP + ScrollTrigger CDN script tags (`defer`), version bumps on css/js |
| `style.css` | stinger/overlay styles, glow element styles, nav underline sweep, press feedback, initial hidden states under `.js`, reduced-motion additions |
| `script.js` | remove IO reveal block; add stinger timeline, entrance sequence, ScrollTrigger reveals + parallax, ambient loops, magnetic arrows; keep kinetic-letter code and scroll-cue logic (cue fade can move to GSAP or stay as is) |

## Non-goals

- No changes to content, layout, typography, or color system.
- No build step, no npm — CDN script tags only, keeping "built by hand".
- Nothing animates layout properties; scrolling stays 60fps.

## Testing

- Manual pass with Playwright: load (stinger runs, content revealed after),
  scroll through all sections (reveals + parallax fire), reduced-motion
  emulation (static site, no stinger), JS disabled (content visible).
- Check no horizontal overflow introduced by parallax transforms.
