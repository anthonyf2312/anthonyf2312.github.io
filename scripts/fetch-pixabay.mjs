// Downloads the site's Pixabay photos into src/assets/pixabay/ and records their credits.
// The API key stays on this machine: it is read from .env (or PIXABAY_API_KEY) and never written
// anywhere. Pixabay does not allow permanent hotlinking, so the images are committed instead.
//
//   node scripts/fetch-pixabay.mjs                         fetch every image listed in scripts/pixabay.json
//   node scripts/fetch-pixabay.mjs --search "wet track"    list candidates for a query
//   node scripts/fetch-pixabay.mjs --search "..." --preview <dir>   also save 640px previews to look at

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'pixabay');
const API = 'https://pixabay.com/api/';

async function loadKey() {
  if (process.env.PIXABAY_API_KEY) return process.env.PIXABAY_API_KEY.trim();
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) throw new Error('No .env found and PIXABAY_API_KEY is not set.');
  const line = (await readFile(envPath, 'utf8'))
    .split(/\r?\n/)
    .find((l) => /^\s*(pixabay|PIXABAY_API_KEY)\s*=/i.test(l));
  if (!line) throw new Error('.env has no "pixabay=" line.');
  return line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
}

async function api(key, params) {
  const url = new URL(API);
  url.search = new URLSearchParams({ key, safesearch: 'true', ...params }).toString();
  const res = await fetch(url);
  // Never echo the request URL: it carries the key.
  if (!res.ok) throw new Error(`Pixabay API answered ${res.status} ${res.statusText}`);
  return res.json();
}

async function download(src, dest) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${dest}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function search(key, query, previewDir) {
  const data = await api(key, { q: query, image_type: 'photo', per_page: '20', order: 'popular' });
  if (previewDir) await mkdir(previewDir, { recursive: true });
  for (const hit of data.hits) {
    console.log(`${hit.id}\t${hit.imageWidth}x${hit.imageHeight}\t${hit.user}\t${hit.tags}\t${hit.pageURL}`);
    if (previewDir) await download(hit.webformatURL, join(previewDir, `${hit.id}.jpg`));
  }
  console.log(`${data.hits.length} of ${data.totalHits} shown`);
}

async function fetchAll(key) {
  const list = JSON.parse(await readFile(join(root, 'scripts', 'pixabay.json'), 'utf8'));
  await mkdir(outDir, { recursive: true });
  const credits = [];
  for (const { slot, id } of list) {
    const { hits } = await api(key, { id: String(id) });
    const hit = hits?.[0];
    if (!hit) throw new Error(`Pixabay image ${id} (${slot}) was not found.`);
    await download(hit.largeImageURL, join(outDir, `${slot}.jpg`));
    credits.push({
      slot,
      id: hit.id,
      user: hit.user,
      userURL: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
      pageURL: hit.pageURL,
    });
    console.log(`${slot}: ${hit.id} by ${hit.user}`);
  }
  await writeFile(join(outDir, 'credits.json'), `${JSON.stringify(credits, null, 2)}\n`);
}

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

try {
  const key = await loadKey();
  const query = flag('--search');
  if (query) await search(key, query, flag('--preview'));
  else await fetchAll(key);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
