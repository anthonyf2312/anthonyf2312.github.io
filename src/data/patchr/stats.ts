// How many servers Patchr is in, read from Discord when the site builds.
// The deploy workflow passes the bot token as PATCHR_BOT_TOKEN. It is only used here, at build time,
// and never reaches the browser.

const api = 'https://discord.com/api/v10';

/** 7 → "7", 137 → "130+", 1,240 → "1,200+", 23,456 → "23,000+". */
export function formatServerCount(count: number): string {
  if (count < 100) return String(count);
  const step = 10 ** (Math.floor(Math.log10(count)) - 1);
  return `${(Math.floor(count / step) * step).toLocaleString('en-US')}+`;
}

async function fetchServerCount(): Promise<number | null> {
  const token = process.env.PATCHR_BOT_TOKEN;
  if (!token) {
    console.warn('[patchr] PATCHR_BOT_TOKEN is not set, so the server count is left out.');
    return null;
  }

  const headers = { Authorization: `Bot ${token.trim().replace(/^Bot\s+/i, '')}` };
  const get = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${api}${path}`, { headers });
    if (!res.ok) throw new Error(`Discord answered ${res.status} for ${path}`);
    return (await res.json()) as T;
  };

  try {
    // Discord's own count is cached and can read 0 for a while after launch.
    const { approximate_guild_count: approx } = await get<{ approximate_guild_count?: number }>('/applications/@me');
    if (approx) {
      console.log(`[patchr] Discord says Patchr is in about ${approx} servers.`);
      return approx;
    }

    // So count the servers the bot is in directly, 200 per page.
    let count = 0;
    let after = '0';
    for (;;) {
      const page = await get<{ id: string }[]>(`/users/@me/guilds?limit=200&after=${after}`);
      count += page.length;
      if (page.length < 200) break;
      after = page[page.length - 1].id;
    }
    console.log(`[patchr] Discord's cached count was ${approx ?? 'missing'}; counted ${count} servers directly.`);
    return count;
  } catch (err) {
    console.warn("[patchr] Couldn't read the server count, so it's left out:", err);
    return null;
  }
}

const count = await fetchServerCount();

/** "1,200+ servers", or null when Discord couldn't be reached, so the page drops the phrase. */
export const servers = count ? `${formatServerCount(count)} ${count === 1 ? 'server' : 'servers'}` : null;
