/**
 * Insko Bot — API Client
 * Handles all communication with the bot's REST API on Cybrancee.
 */

const API = (() => {
  // ── Configuration ──────────────────────────────────
  // HTTPS via Cloudflare Tunnel → api.inskomusic.com
  const BASE_URL = 'https://api.inskomusic.com';

  // ── Internal helpers ───────────────────────────────
  async function get(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null) url.searchParams.set(key, String(val));
    }

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Bot is offline or unreachable');
      }
      throw err;
    }
  }

  // ── Public methods ─────────────────────────────────
  return {
    /** Bot status — online, uptime, members, db */
    getStatus: () => get('/api/status'),

    /** XP leaderboard — paginated */
    getLeaderboard: (page = 1, limit = 15) => get('/api/leaderboard', { page, limit }),

    /** Search user by ID */
    getUser: (query) => get('/api/user', { q: query }),

    /** All badge definitions */
    getBadges: () => get('/api/badges'),

    /** Recent ratings */
    getRecentRatings: (type = 'all', limit = 20) => get('/api/ratings/recent', { type, limit }),

    /** Top rated items */
    getTopRated: (type = 'all', limit = 20) => get('/api/ratings/top', { type, limit }),

    /** Most popular (most rated) */
    getMostPopular: (type = 'all', limit = 20) => get('/api/ratings/popular', { type, limit }),

    /** Top artists */
    getTopArtists: () => get('/api/music/top-artists'),

    /** Top songs by rating */
    getTopSongs: () => get('/api/music/top-songs'),

    /** Overall music stats */
    getMusicStats: () => get('/api/music/stats'),

    /** Feature list */
    getFeatures: () => get('/api/features'),

    /** Command docs */
    getCommands: () => get('/api/commands'),
  };
})();
