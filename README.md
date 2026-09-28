# anthonyf2312.github.io

Two sites from one repo, built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions.

| Path | Site |
|---|---|
| `/` | Anthony's personal site: AI and Discord bots, Formula 1 (McLaren and Lando, since Sochi 2021), and MS |
| `/patchr/` | [Patchr](https://github.com/anthonyf2312/patchr), the Discord bot, with its own privacy policy and terms |

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve dist/
```

## How it's put together

- `src/pages/`: the routes. `src/layouts/Home.astro` and `src/layouts/Patchr.astro` give each site its own head, nav, footer, favicon and link preview.
- `src/styles/`: `base.css` is shared; `home.css` (graphite and white, papaya, Archivo) and `patchr.css` (Patchr's brand kit: ink, mist, pink, Inter) hold each site's tokens.
- `src/scripts/`: motion. GSAP (ScrollTrigger, SplitText) and Lenis smooth scrolling, set up in `motion.ts`. Everything honours `prefers-reduced-motion`, and every page reads fine without JavaScript.
- Light and dark mode follow the system until someone uses the sun/moon switch; the choice is kept in the visitor's own browser.

## Data

- `src/data/sochi.ts`: Lando Norris's position on every lap of the 2021 Russian Grand Prix, from the Jolpica F1 API. The Sochi counter on the home page runs on it.
- `src/assets/photos/`: the F1 photos, from Wikimedia Commons, with their credits in `credits.json` (shown in the footer).
- `src/data/patchr/`: Patchr's links, its latest version (read from GitHub releases at build time) and its server count (read from Discord at build time).
- `src/content/patchr/`: Patchr's privacy policy and terms, copied word for word from the Patchr repo. Re-copy them when they change there.

## Deploying

Pushing to `main` builds and deploys the site (`.github/workflows/deploy.yml`). It also rebuilds daily so Patchr's version and server count stay current.

In the repository's **Settings → Pages**, the source must be **GitHub Actions**. The server count needs a repository secret named `PATCHR_BOT_TOKEN`; without it, the count is simply left out.

## Credits

- F1 photos by Liauzh and Lukas Raich on Wikimedia Commons (CC BY-SA 4.0), credited per photo in the footer.
- McLaren's and Lando Norris's names and marks belong to them. This is a fan page, not affiliated with either.
- Fonts: Archivo and Inter (SIL Open Font License). Icons: Phosphor (MIT).
