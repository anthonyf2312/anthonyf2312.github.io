# anthonyf2312.github.io

Anthony's personal site: Discord bots (Insko Bot and Patchr), Formula 1, and MS. Live at [anthonyf2312.github.io](https://anthonyf2312.github.io).

It also hosts [Patchr's own site](https://anthonyf2312.github.io/patchr/) at `/patchr/`, with its privacy policy and terms. Patchr's pages have their own layout (`src/layouts/PatchrBase.astro`), styles (`src/styles/patchr.css`) and components (`src/components/patchr/`), built from the brand kit in `brand/`.

Built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Working on it

```sh
npm install
npm run dev       # local dev server
npm run build     # static build into dist/
npm run preview   # serve the build
```

## Photos

Photos come from [Pixabay](https://pixabay.com) and are downloaded into `src/assets/pixabay/` and committed. Pixabay doesn't allow permanent hotlinking, and this way the API key never leaves your machine.

1. Put your key in `.env` as `pixabay=<key>`. `.env` is git-ignored.
2. Find candidates: `node scripts/fetch-pixabay.mjs --search "wet track" --preview ./previews`
3. List the ones you want in `scripts/pixabay.json` (`{ "slot": "name", "id": 123 }`).
4. Run `npm run images`. This rewrites the images and `credits.json`, and the page reads its credits from there.

## Data

The Sochi 2021 trace (`src/data/sochi.ts`) is Lando Norris's running position at the end of each lap, from the [Jolpica F1 API](https://api.jolpi.ca/ergast/f1/2021/15/drivers/norris/laps.json).

## Credits

- Rain photo: Arcaion on Pixabay
- LN4 logo: Lando Norris's mark, supplied by the site owner (src/components/LandoLogo.astro)
- McLaren wordmark and speedmark: Wikimedia Commons (public domain as simple logos, McLaren trademarks; shown on a fan page with no affiliation)
- Type: [Mona Sans](https://github.com/github/mona-sans) (SIL OFL); Patchr's pages use [Inter](https://rsms.me/inter/) (SIL OFL)
- Icons: [Lucide](https://lucide.dev) (ISC); Discord and GitHub glyphs from [Simple Icons](https://simpleicons.org) (CC0)
- Patchr's logo, 3D renders and badges: the Patchr brand kit in `brand/` (rendered from `brand/Patchr_Brand.blend`)

## Patchr's policies

`src/data/patchr/privacy.md` and `terms.md` are copies of `PRIVACY.md` and `TERMS.md` from the Patchr repo. Change them there first, then copy them here. The only difference is that the terms' two repo-relative links point at `/patchr/privacy/` and the LICENSE on GitHub.
