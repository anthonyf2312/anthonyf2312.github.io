// How many servers Patchr is in, read from Discord when the site builds.
// The deploy workflow passes the bot token as PATCHR_BOT_TOKEN. It is only used here, at build time,
// and never reaches the browser.

const applicationApi = 'https://discord.com/api/v10/applications/@me';

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

  try {
    const res = await fetch(applicationApi, { headers: { Authorization: `Bot ${token}` } });
    if (!res.ok) throw new Error(`Discord answered ${res.status}`);
    const { approximate_guild_count } = (await res.json()) as { approximate_guild_count?: number };
    if (typeof approximate_guild_count !== 'number') throw new Error('no approximate_guild_count in the response');
    return approximate_guild_count;
  } catch (err) {
    console.warn("[patchr] Couldn't read the server count, so it's left out:", err);
    return null;
  }
}

const count = await fetchServerCount();

/** "1,200+ servers", or null when Discord couldn't be reached, so the page drops the phrase. */
export const servers = count ? `${formatServerCount(count)} ${count === 1 ? 'server' : 'servers'}` : null;
