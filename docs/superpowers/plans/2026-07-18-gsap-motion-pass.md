# GSAP Motion Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a papaya stinger wipe on load, GSAP/ScrollTrigger scroll reveals with stagger, parallax + ambient motion, and micro-interactions to the static personal site.

**Architecture:** Hand-built static site (index.html / style.css / script.js, no build step). GSAP 3.13 core + ScrollTrigger load from jsdelivr CDN with `defer`; script.js also becomes `defer` so it runs after them. All motion lives in one `gsap.matchMedia()` block gated on `(prefers-reduced-motion: no-preference)`. A no-GSAP guard removes the `.js` class so the site renders statically if the CDN is blocked.

**Tech Stack:** Vanilla HTML/CSS/JS, GSAP 3.13.0 + ScrollTrigger (CDN), Playwright MCP for verification.

## Global Constraints

- No build step, no npm — CDN `<script>` tags only.
- All animation is `transform`/`opacity` only; never animate layout properties.
- `prefers-reduced-motion: reduce` → fully static site, no stinger.
- No JS or GSAP CDN blocked → content fully visible (never a blank page).
- No content, layout, typography, or color changes.
- Site is verified by loading `file:///c:/Users/Pamela/Documents/githubPages/index.html` in the Playwright MCP browser (no dev server needed; CDN + Google Fonts load over the network).
- Cache-bust query strings on style.css/script.js bump to `?v=5` (done once in Task 1).

---

### Task 1: Script loading rework + no-GSAP guard

**Files:**
- Modify: `index.html` (head: lines 17-21 area; body end: line 127)
- Modify: `script.js` (top of IIFE, lines 1-8)

**Interfaces:**
- Produces: `html.js` class set by inline head script (before first paint); `window.gsap` + `window.ScrollTrigger` globals; `hasGsap` boolean and `reduceMotion` boolean inside the script.js IIFE that later tasks read; ScrollTrigger registered when present.

- [ ] **Step 1: Add inline `.js` class script + CDN tags to `<head>`, defer script.js**

In `index.html`, immediately after the `<meta name="theme-color" content="#111113">` line, add:

```html
  <script>document.documentElement.classList.add("js");</script>
```

Change the stylesheet link version:

```html
  <link rel="stylesheet" href="style.css?v=5">
```

At the end of `<body>`, replace:

```html
  <script src="script.js?v=4"></script>
```

with:

```html
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"
          integrity="sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc"
          crossorigin="anonymous"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"
          integrity="sha384-P8VzCVnT9NBUkMrpcIZrJbA7EBjJvh/fJS6PmP+4nLIM284DtsImIv8D0fFjIkeh"
          crossorigin="anonymous"></script>
  <script defer src="script.js?v=5"></script>
```

(SRI hashes computed from gsap@3.13.0 dist files and verified identical from two CDNs — a tampered CDN response now fails to execute, and the Task 1 no-GSAP guard reveals the static site.)

(All three are `defer`, so they execute in order after parsing; a plain script would run *before* the deferred GSAP files.)

- [ ] **Step 2: Add the guard to script.js**

In `script.js`, replace lines 1-8:

```js
// Type poster interactions: kinetic hero weight, scroll reveals, scroll cue.
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  document.getElementById("year").textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

with:

```js
// Type poster interactions: stinger, entrance, kinetic hero weight, scroll motion.
(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    // GSAP CDN blocked but JS running: drop all motion, reveal everything.
    document.documentElement.classList.remove("js");
  }
```

(The `classList.add("js")` moved to the inline head script in Step 1.)

- [ ] **Step 3: Verify normal load**

Navigate Playwright to `file:///c:/Users/Pamela/Documents/githubPages/index.html`, then evaluate:

```js
() => ({ js: document.documentElement.classList.contains("js"), gsap: !!window.gsap, st: !!window.ScrollTrigger })
```

Expected: `{ js: true, gsap: true, st: true }`. Take a screenshot — site must look identical to before (reveals still work via the old IO code for now).

- [ ] **Step 4: Verify CDN-blocked fallback**

Block the CDN (Playwright: use `browser_run_code_unsafe` to reload with routes aborted for `cdn.jsdelivr.net`, or temporarily rename the src to a garbage URL, reload, then restore). Evaluate:

```js
() => ({ js: document.documentElement.classList.contains("js"), introVisible: getComputedStyle(document.querySelector(".intro")).opacity })
```

Expected: `js: false`, `introVisible: "1"` (content visible, no blank page).

- [ ] **Step 5: Commit**

```bash
git add index.html script.js
git commit -m "Load GSAP+ScrollTrigger via CDN, inline .js class, no-GSAP guard"
```

---

### Task 2: Stinger overlay + sweep

**Files:**
- Modify: `index.html` (first element inside `<body>`)
- Modify: `style.css` (new section before "Reveals & motion")
- Modify: `script.js` (new `gsap.matchMedia()` block after the guard)

**Interfaces:**
- Consumes: `hasGsap` from Task 1.
- Produces: `.stinger` element + CSS; `var mm = gsap.matchMedia();` and the `mm.add("(prefers-reduced-motion: no-preference)", function () { ... });` block that Tasks 3-5 add code into; `var entrance = gsap.timeline(...)` inside that block that Task 3 extends.

- [ ] **Step 1: Add the overlay markup**

In `index.html`, immediately after `<body>`:

```html
  <div class="stinger" aria-hidden="true"></div>
```

- [ ] **Step 2: Add stinger CSS**

In `style.css`, add a new section just above `/* ======================= Reveals & motion ======================= */`:

```css
/* ======================= Stinger ======================= */

/* papaya load wipe — oversized skewed panel, swept off by GSAP */
.stinger {
  display: none;
  position: fixed;
  top: -10vh;
  left: -35vw;
  width: 170vw;
  height: 120vh;
  z-index: 100; /* above the grain layer (z 50) */
  background: var(--papaya);
  transform: skewX(-15deg);
  pointer-events: none;
}
.js .stinger { display: block; }

@media (prefers-reduced-motion: reduce) {
  .js .stinger { display: none; }
}
```

- [ ] **Step 3: Add the matchMedia block + sweep tween**

In `script.js`, directly after the `if (hasGsap) { ... } else { ... }` guard from Task 1, add:

```js
  /* ---------- GSAP motion (skipped entirely under reduced motion) ---------- */
  var entrance = null;
  if (hasGsap) {
    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", function () {

      /* stinger: sweep the papaya panel off toward the top-right */
      entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance.to(".stinger", {
        xPercent: 115,
        yPercent: -12,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: function () {
          var s = document.querySelector(".stinger");
          if (s) s.remove();
        }
      }, 0.15);

    });
  }
```

If GSAP loaded but the media query is `reduce`, the `.js .stinger` reduced-motion CSS keeps the panel hidden — no JS needed.

- [ ] **Step 4: Verify the sweep**

Reload the page in Playwright and immediately screenshot: expect a solid papaya screen (or partial diagonal edge if timing catches mid-sweep). After ~1.5s, evaluate `() => !!document.querySelector(".stinger")` — expected `false` (removed). Screenshot again: full site visible, no leftover orange, no horizontal scrollbar (`() => document.documentElement.scrollWidth <= window.innerWidth` → `true`).

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "Papaya diagonal stinger wipe on load"
```

---

### Task 3: Hero entrance + kinetic handoff

**Files:**
- Modify: `script.js` (kinetic block, currently lines 35-108; the `entrance` timeline from Task 2; scroll-cue block, currently lines 26-33)

**Interfaces:**
- Consumes: `entrance` timeline, `mm` block, `hasGsap`, `reduceMotion`.
- Produces: `wake()` remains the kinetic starter (now called by the timeline, not at load); letters initialized at weight 600.

- [ ] **Step 1: Restructure the kinetic block so splitting happens before the mm block**

The letter-split must run before the entrance timeline is built (the timeline animates the `.k` spans). Move the split code *above* the `mm` block from Task 2 and remove the trailing auto-`wake()`. The kinetic section becomes:

```js
  /* ---------- kinetic hero type: split letters ---------- */
  var letters = [];
  if (!reduceMotion) {
    document.querySelectorAll(".kinetic").forEach(function (line) {
      var text = line.textContent;
      line.textContent = "";
      line.setAttribute("aria-label", text);
      for (var i = 0; i < text.length; i++) {
        var s = document.createElement("span");
        s.className = "k";
        s.setAttribute("aria-hidden", "true");
        s.textContent = text[i];
        line.appendChild(s);
        letters.push({ el: s, w: 600, target: 600 });
      }
    });
  }

  var MIN = 200, MAX = 900;
  var RADIUS = Math.max(220, window.innerWidth * 0.22);
  var mouse = null;
  var t = 0;
  var running = false;

  function frame() {
    var active = false;
    t += 0.035;

    for (var i = 0; i < letters.length; i++) {
      var L = letters[i];

      if (mouse) {
        var r = L.el.getBoundingClientRect();
        var dx = mouse.x - (r.left + r.width / 2);
        var dy = mouse.y - (r.top + r.height / 2);
        var d = Math.sqrt(dx * dx + dy * dy);
        var p = Math.max(0, 1 - d / RADIUS);
        p = p * p * (3 - 2 * p);
        L.target = MIN + p * (MAX - MIN);
      } else {
        L.target = 500 + 300 * (0.5 + 0.5 * Math.sin(t + i * 0.45));
      }

      L.w += (L.target - L.w) * 0.16;
      if (Math.abs(L.target - L.w) > 0.5) active = true;
      L.el.style.setProperty("--w", L.w.toFixed(1));
    }

    if (active || !mouse) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function wake() {
    if (!running || !letters.length) {
      if (!letters.length) return;
      running = true;
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse") {
      mouse = { x: e.clientX, y: e.clientY };
      wake();
    }
  }, { passive: true });
```

Changes from the original: letters init at `w: 600` (matches the hero's 600 base weight and the entrance ramp target), `wake()` no-ops when there are no letters, and there is **no** `wake()` call at the bottom — the entrance timeline starts it. If GSAP is missing (`hasGsap === false`) but motion is allowed, `wake()` must still be called once at the end of the file (Step 3 handles this).

- [ ] **Step 2: Extend the entrance timeline**

Inside the `mm.add(...)` callback, after the stinger tween, add:

```js
      /* entrance: eyebrow → letters rise with weight ramp → cue, then kinetic */
      var eyebrowSpans = document.querySelectorAll(".hero-eyebrow span");
      var ks = document.querySelectorAll(".hero-title .k");

      gsap.set(eyebrowSpans, { opacity: 0, y: 12 });
      gsap.set(".scroll-cue", { opacity: 0 });
      gsap.set(ks, { "--w": 200 });

      entrance
        .to(eyebrowSpans, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.4)
        .from(ks, { yPercent: 40, opacity: 0, duration: 0.6, stagger: 0.045 }, 0.5)
        .to(ks, { "--w": 600, duration: 0.5, ease: "power1.inOut", stagger: 0.045 }, 0.55)
        .to(".scroll-cue", { opacity: 1, duration: 0.5 }, 1.15)
        .call(wake);
```

(These `gsap.set` hidden states are applied while the stinger still covers the viewport, so nothing flashes.)

- [ ] **Step 3: Fix the scroll-cue hide + no-GSAP kinetic start**

Replace the scroll-cue block:

```js
  /* ---------- scroll cue ---------- */
  var cue = document.querySelector(".scroll-cue");
  window.addEventListener("scroll", function onScroll() {
    if (window.scrollY > 40) {
      if (hasGsap && !reduceMotion) {
        gsap.to(cue, { opacity: 0, duration: 0.4 });
      } else {
        cue.classList.add("hidden");
      }
      window.removeEventListener("scroll", onScroll);
    }
  }, { passive: true });
```

(GSAP sets inline `opacity` on the cue during the entrance; the old `.hidden` class can't override an inline style, so the hide must also go through GSAP when GSAP is active.)

At the very end of the IIFE, add the fallback kinetic start:

```js
  // Without GSAP there is no entrance timeline to start the kinetic loop.
  if (!hasGsap) wake();
```

- [ ] **Step 4: Verify the entrance**

Reload in Playwright. After 2s, screenshot: ANTHONY fully visible, eyebrow visible, scroll cue visible. Evaluate:

```js
() => document.querySelector(".hero-title .k").style.getPropertyValue("--w")
```

Expected: a value that keeps changing between two evaluations ~1s apart (ambient kinetic wave running — confirms the handoff). Scroll down 100px and confirm the cue fades (`getComputedStyle(document.querySelector(".scroll-cue")).opacity` trends to `0`).

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "Hero entrance sequence with kinetic handoff behind the stinger"
```

---

### Task 4: ScrollTrigger reveals replace IntersectionObserver

**Files:**
- Modify: `index.html` (reveal class placement: lines 47, 86-89, 103-106)
- Modify: `style.css` (Reveals & motion section, lines 405-423)
- Modify: `script.js` (delete IO block, add ScrollTrigger reveals in the mm block)

**Interfaces:**
- Consumes: `mm` block from Task 2.
- Produces: `.reveal` elements animated by ScrollTrigger with 0.1s stagger per section.

- [ ] **Step 1: Move reveal classes for per-line/per-element staggering**

In `index.html`:

- Intro: `<section class="intro reveal" ...>` → `<section class="intro" ...>` and its `<p>` → `<p class="reveal">`.
- F1 heading: remove `reveal` from `<h2 class="poster poster-f1 reveal" ...>` → `<h2 class="poster poster-f1" ...>`; add it to both lines: `<span class="line reveal">PAPAYA,</span>` and `<span class="line reveal">SINCE SOCHI.</span>`.
- MS heading: same pattern — `<h2 class="poster poster-ms" ...>` with `<span class="line reveal">AND YES —</span>` and `<span class="line reveal">I HAVE MS.</span>`.
- MS body: the wrapping `<div class="ms-body reveal">` → `<div class="ms-body">`, and each of its three `<p>` → `<p class="reveal">`.
- Work rows, `.f1-body`, `.f1-tags`, `.f1-note`, `.ms-link` keep their existing `reveal` class as-is.

Note: `.poster .line` is `display: block`; `transform` on it works. `.ms-body p + p` margin rules are unaffected.

- [ ] **Step 2: Rework reveal CSS (no transitions — GSAP drives)**

In `style.css`, replace:

```css
/* hidden state only when JS is running (html.js set by script.js) */
.js .reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 700ms ease, transform 700ms ease;
}
.js .reveal.visible {
  opacity: 1;
  transform: none;
}
```

with:

```css
/* hidden state only when JS+GSAP are running (html.js set inline in head,
   removed by script.js if GSAP failed to load) — GSAP animates to visible */
.js .reveal {
  opacity: 0;
  transform: translateY(14px);
}
```

The `@media (prefers-reduced-motion: reduce)` block keeps `.js .reveal { opacity: 1; transform: none; }` (drop the now-meaningless `transition: none` from that rule).

- [ ] **Step 3: Swap IO for ScrollTrigger in script.js**

Delete the entire `/* ---------- scroll reveals ---------- */` IntersectionObserver block (the `revealed` / `io` code). Inside the `mm.add(...)` callback, after the entrance timeline code, add:

```js
      /* scroll reveals: per-section stagger */
      gsap.utils.toArray([".intro", ".work", ".f1", ".ms"]).forEach(function (section) {
        var items = section.querySelectorAll(".reveal");
        if (!items.length) return;
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 72%", once: true }
        });
      });
```

(`gsap.to` reads the CSS hidden state — `opacity: 0; translateY(14px)` — as the starting values.)

- [ ] **Step 4: Verify reveals**

Reload in Playwright. Scroll to each section (intro, work, f1, ms) and screenshot: content fades up, work rows arrive one after the other, poster headlines arrive line-by-line. After scrolling the full page, evaluate:

```js
() => [...document.querySelectorAll(".reveal")].every(el => getComputedStyle(el).opacity === "1")
```

Expected: `true`.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "ScrollTrigger staggered reveals replace IntersectionObserver"
```

---

### Task 5: Parallax, ambient float, glow drift

**Files:**
- Modify: `index.html` (glow element after the stinger div)
- Modify: `style.css` (body background, new glow styles)
- Modify: `script.js` (mm block additions)

**Interfaces:**
- Consumes: `mm` block.
- Produces: `.glow` element; scrubbed parallax on `.f1-mark` / `.ms-ribbon` (GSAP `y`), ambient rotation loops, glow drift loop.

- [ ] **Step 1: Move background glows to a dedicated element**

In `index.html`, after the stinger div:

```html
  <div class="glow" aria-hidden="true"></div>
```

In `style.css`, change the body background to drop the gradients:

```css
body {
  overflow-x: clip; /* kinetic weight changes can momentarily widen the hero line */
  background: var(--bg);
  ...rest unchanged...
}
```

Add below the `body::after` grain rule:

```css
/* background glows on their own fixed layer so they can drift via transform */
.glow {
  position: fixed;
  inset: -12%;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(70rem 45rem at 80% 5%, rgba(255, 107, 43, 0.075), transparent 62%),
    radial-gradient(55rem 55rem at 0% 55%, rgba(255, 128, 0, 0.05), transparent 60%);
}
```

(Positions nudged from `88% -5%` / `-12% 55%` to compensate for the `-12%` inset overscan; verify visually in Step 4 that the glow placement matches the current site.)

- [ ] **Step 2: Parallax + float on speedmark and ribbon**

Inside the `mm.add(...)` callback, add:

```js
      /* parallax (scrubbed y) + ambient float (slow rotation) on the marks */
      var mark = document.querySelector(".f1-mark");
      var ribbon = document.querySelector(".ms-ribbon");

      // normalize into GSAP's transform system (matches the CSS centering transforms)
      gsap.set(mark, { yPercent: -50, rotation: -8, y: 0 });
      gsap.set(ribbon, { yPercent: -50, rotation: 10, y: 0 });

      gsap.fromTo(mark, { y: 70 }, {
        y: -70, ease: "none",
        scrollTrigger: { trigger: ".f1", start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.fromTo(ribbon, { y: 50 }, {
        y: -50, ease: "none",
        scrollTrigger: { trigger: ".ms", start: "top bottom", end: "bottom top", scrub: true }
      });

      gsap.to(mark, { rotation: -11, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(ribbon, { rotation: 13, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
```

Design note: the spec's "degree or two of rotation" on scroll is assigned to the ambient loop instead, so scrub (y) and float (rotation) compose on separate channels and never fight. The CSS `transform: translateY(-50%) rotate(...)` rules on `.f1-mark`/`.ms-ribbon` **stay in style.css** — they are the no-JS/reduced-motion static position; the `gsap.set` above reproduces them inline for the animated case.

- [ ] **Step 3: Glow drift**

Also inside the mm callback:

```js
      /* imperceptible glow drift */
      gsap.to(".glow", { xPercent: 2.5, yPercent: 3, duration: 26, yoyo: true, repeat: -1, ease: "sine.inOut" });
```

- [ ] **Step 4: Verify**

Reload in Playwright, screenshot the hero: background glow should look like the pre-change site (top-right orange haze). Scroll to the F1 section, take two screenshots at different scroll offsets: the speedmark's vertical position relative to the section should differ (parallax). Same for the MS ribbon. Check `document.documentElement.scrollWidth <= window.innerWidth` → `true`, and both sections still clip their marks (`.f1`/`.ms` have `overflow: hidden`).

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "Parallax + ambient float on marks, drifting glow layer"
```

---

### Task 6: Micro-interactions

**Files:**
- Modify: `style.css` (nav links, row arrow, ms-link)
- Modify: `script.js` (magnetic arrows in the mm block)

**Interfaces:**
- Consumes: `mm` block.
- Produces: nav underline sweep (CSS), magnetic `.row-arrow` (GSAP quickTo), `.ms-link` press feedback (CSS).

- [ ] **Step 1: Nav underline sweep (CSS)**

In `style.css`, after the `.nav-links` rule add:

```css
.nav-links a { position: relative; }
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}
.nav-links a:hover::after,
.nav-links a:focus-visible::after { transform: scaleX(1); }
```

- [ ] **Step 2: Hand the row arrow to GSAP**

The current CSS hover translate would fight GSAP's inline transform. In `style.css` change:

```css
.row-arrow {
  flex: none;
  font-size: clamp(1.5rem, 4vw, 2.75rem);
  color: var(--fg-muted);
  transition: transform 250ms ease, color 250ms ease;
}
a.row:hover .row-arrow {
  transform: translate(0.3rem, -0.3rem);
  color: var(--accent);
}
```

to:

```css
.row-arrow {
  flex: none;
  font-size: clamp(1.5rem, 4vw, 2.75rem);
  color: var(--fg-muted);
  transition: color 250ms ease;
}
a.row:hover .row-arrow {
  color: var(--accent);
}
```

- [ ] **Step 3: Magnetic arrow (JS)**

Inside the `mm.add(...)` callback:

```js
      /* magnetic row arrows (mouse only) */
      document.querySelectorAll("a.row").forEach(function (row) {
        var arrow = row.querySelector(".row-arrow");
        if (!arrow) return;
        var qx = gsap.quickTo(arrow, "x", { duration: 0.3, ease: "power3" });
        var qy = gsap.quickTo(arrow, "y", { duration: 0.3, ease: "power3" });
        row.addEventListener("pointermove", function (e) {
          if (e.pointerType !== "mouse") return;
          var r = arrow.getBoundingClientRect();
          var relX = (e.clientX - (r.left + r.width / 2)) * 0.06;
          var relY = (e.clientY - (r.top + r.height / 2)) * 0.06;
          qx(Math.max(-12, Math.min(12, relX)));
          qy(Math.max(-12, Math.min(12, relY)));
        });
        row.addEventListener("pointerleave", function () { qx(0); qy(0); });
      });
```

- [ ] **Step 4: MS link press feedback (CSS)**

In `style.css`, the `.ms-link` rule becomes (only the `transition` line changes, plus the new `:active` rule after it):

```css
.ms-link {
  display: inline-block;
  margin-top: 3rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: #111113;
  border: 1.5px solid #111113;
  border-radius: 999px;
  padding: 0.8em 1.6em;
  transition: background-color 180ms ease, color 180ms ease, transform 120ms ease;
}
.ms-link:active { transform: scale(0.97); }
```

Also add `.nav-links a::after` to the reduced-motion `transition: none` list:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .js .reveal { opacity: 1; transform: none; }
  .scroll-cue { transition: none; }
  .row-title, .row-arrow, .ms-link, .nav-links a::after { transition: none; }
}
```

- [ ] **Step 5: Verify**

In Playwright: hover a nav link (`browser_hover`) and screenshot — orange underline visible. Hover over the INSKOBOT row near its arrow and screenshot — arrow nudged toward cursor and papaya-colored; move pointer off the row — arrow returns to rest (evaluate its `style.transform` trends back to ~`translate(0, 0)`).

- [ ] **Step 6: Commit**

```bash
git add style.css script.js
git commit -m "Micro-interactions: nav underline sweep, magnetic arrows, press feedback"
```

---

### Task 7: Full verification pass

**Files:**
- No new changes expected; fixes only if a check fails.

- [ ] **Step 1: Fresh-load sequence check**

Playwright, fresh navigation: stinger visible instantly → swept off → hero staggers in → kinetic wave running. Screenshot at ~0.2s, ~2s.

- [ ] **Step 2: Full-page scroll check**

Scroll through every section; all reveals fire with stagger, parallax moves both marks, no horizontal scrollbar at 1280px and at 390px viewport width (`browser_resize`).

- [ ] **Step 3: Reduced-motion check**

Emulate `prefers-reduced-motion: reduce` (via `browser_run_code_unsafe` with CDP emulation or relaunch context), reload: no stinger, all content visible immediately, no animation. Evaluate `() => getComputedStyle(document.querySelector(".stinger") || document.body).display` — stinger hidden or absent; every `.reveal` computed opacity `1`.

- [ ] **Step 4: No-JS check**

Disable JavaScript (Playwright context setting or evaluate-free static check: since `.js` is added by an inline script, fetch the raw HTML and confirm hidden states are all scoped under `.js` in style.css — `grep "\.reveal" style.css` shows only `.js .reveal`). Expected: no unscoped hidden states.

- [ ] **Step 5: Push**

```bash
git push
```

Then verify the live site at https://anthonyf2312.github.io/ once Pages deploys (allow a couple of minutes; hard-reload for `?v=5` assets).
