# Two sites, one repo: Anthony (`/`) and Patchr (`/patchr/`)

Approved 28 September 2026. Built with the taste (design-taste-frontend), Emil Kowalski (emil-design-eng) and frontend-design skills, with library docs checked through Context7.

## Brief

- **Personal site:** short and sweet. Dark grey or white (following light/dark mode), with McLaren papaya. Three things: loves using AI to mess around and build things like Discord bots; loves F1 (McLaren and Lando), a fan since Sochi 2021, when Lando lost the lead in the rain and finished seventh; has MS.
- **Patchr site:** the Discord bot from `brand/`, in its own brand kit.
- **Motion:** very smooth, in the spirit of Apple product pages and landonorris.com.
- **Settled:** the F1 centrepiece is a pinned Sochi replay; the personal page mentions Patchr plus one line for Insko Bot.

## Design read and dials

A personal page for Discord communities and F1 fans: Apple product-page language with Lando-site kinetic motion, on Astro + GSAP (ScrollTrigger, SplitText) + Lenis.

| | Variance | Motion | Density |
|---|---|---|---|
| Personal | 7 | 7 | 3 |
| Patchr | 6 | 6 | 4 |

Stack note: vanilla CSS and Astro instead of the taste skill's React/Tailwind default. A static two-page site needs neither.

## Tokens

**Personal:**
- **Surfaces:** graphite `#141416` / white, with alternate sections at `#1B1B1E` / `#F5F5F7` and the Sochi stage at `#0F0F11` / `#EEEEF1`.
- **Text:** `#F5F5F7` / `#1D1D1F`, and secondary `#A1A1A6` / `#5F5F64`.
- **Papaya:**
  - `#FF8000` fills, with `#141416` text on top (7:1).
  - Lines are `#E06F00` on white (3:1).
  - Text is `#B35500` on white (AA).
- **Fonts:** Archivo at width 125 for display and width 100 for body.

**Patchr:**
- **Surfaces:** deep ink `#0E0C1A` / mist `#F4F2FA`, with cards `#17142B` / white.
- **Text:** `#F4F2FA` / `#17142B`, and secondary `#BDB7D9` / `#615D7A` (Muted, deepened slightly for AA).
- **Pink:** `#FF5E8A` fills with ink text. Pink text is `#C81E57` on mist.
- **Fonts:** Inter at 800 for headlines, as the brand kit specifies.

**Shape:** buttons are pills, cards 24px, example "screens" 20px, chips 12px.

**Background variation:** papaya (or pink and lilac) radial glows, a fixed grain overlay, and alternating section tones.

## Motion (Emil)

- **Eases:** `cubic-bezier(0.23, 1, 0.32, 1)` out, and `cubic-bezier(0.77, 0, 0.175, 1)` in-out.
- **Durations:** UI feedback 120 to 250ms, reveals about 0.8 to 1.1s, staggers 40 to 90ms.
- **Presses and hovers:** buttons scale to 0.97 when pressed. Hovers only on fine pointers.
- **Personal site's signature moments:**
  1. The hero lines rise in pure CSS.
  2. The Sochi track draws itself, with a papaya car lapping it.
  3. A statement lights up word by word on scroll.
  4. One marquee follows scroll velocity.
  5. Lando's LN4 halves slide together.
  6. The Sochi replay pins and scrubs.
  7. The theme toggle reveals in a circle.
  8. The two sites cross-fade into each other.
- **Patchr's signature moments:**
  1. The example post builds itself line by line.
  2. How it works uses an Apple-style sticky swap.
  3. A dot travels from repo to channel.
  4. The copy button morphs.
  5. The FAQ opens.
- **Reduced motion:** no Lenis, no marquee, no pinning. The Sochi replay becomes a static chart with the whole story listed.
- **Without JS:** all content stays readable.

## Sochi replay

- **Data:** Jolpica F1 API (lap positions, pit stops on laps 28 and 51), cross-checked with the Wikipedia race report:
  - Sainz takes the lead at the start.
  - Lando passes him at turn 12 on lap 13.
  - The rain arrives.
  - Hamilton pits for intermediates on lap 50.
  - Lando aquaplanes off at turn 5 on lap 51 and finishes seventh.
- **Chart:** two drawings, wide (1000×440) for desktop and tall (600×760) for phones. The script drives whichever is showing.
- **HUD:** a lap counter, plus a position readout that flips like a timing tower.
- **Captions** swap at each beat. The rain photo and streaks fade in from lap 46.5.
- **Ending:** "That's the day I started supporting him."

## Patchr

- **Nav:** Features, Commands, FAQ, Support server, the theme toggle, and Add to Discord.
- **Hero:** "Patch notes, posted beautifully." with an example post: Patchr's real v1.0.0 release, laid out as Patchr's card renderer lays it out. Under it, a facts row: version (from GitHub at build time), Free, MIT, and the server count (from Discord at build time, hidden without a token).
- **Sections, in order:**
  1. How it works (publish, post, edit or pull).
  2. A four-cell features bento.
  3. The five commands.
  4. Run your own (Docker).
  5. FAQ.
  6. The CTA band.
- **Legal:** the privacy policy and terms are copied word for word from the Patchr repo. External links in them open in a new tab (`src/lib/legal.ts`).

## Pages

`/`, `/privacy/`, `/404.html`, `/patchr/`, `/patchr/privacy/`, `/patchr/terms/`.

## Checks

- Zero em or en dashes in visible text.
- No browser-side API calls, cookies or third-party requests.
- axe-core (WCAG 2.2 AA) runs on every page in both themes and both motion settings.
- Screenshots at 1440×900 and 390×844.
