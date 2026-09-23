# anthonyf2312.github.io

Anthony's personal site: Discord bots (Insko Bot), Formula 1, and MS. Live at [anthonyf2312.github.io](https://anthonyf2312.github.io).

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
- Lando Norris's number design: [Ved havet](https://commons.wikimedia.org/wiki/File:Lando_Norris_McLaren_driver_number.svg), CC BY-SA 4.0, recoloured (the adapted SVG in src/components/LandoFour.astro is shared under the same licence)
- McLaren wordmark and speedmark: Wikimedia Commons (public domain as simple logos, McLaren trademarks; shown on a fan page with no affiliation)
- Type: [Mona Sans](https://github.com/github/mona-sans) (SIL OFL)
- Icons: [Lucide](https://lucide.dev) (ISC)
