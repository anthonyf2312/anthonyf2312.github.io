// Patchr's current version, read from its latest GitHub release when the site builds.
// PatchrVersion.astro re-checks in the browser, so a new release shows before the next deploy.

/** Used only if GitHub can't be reached during the build. */
const fallbackTag = 'v1.1.0';

export const latestReleaseApi = 'https://api.github.com/repos/anthonyf2312/patchr/releases/latest';

/** "v1.1.0" → "1.1", "v1.2.3" → "1.2.3". */
export function formatVersion(tag: string): string {
  return tag.replace(/^v/i, '').replace(/^(\d+\.\d+)\.0$/, '$1');
}

async function fetchLatestTag(): Promise<string> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  // The deploy workflow passes its token so the build isn't subject to the anonymous rate limit.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(latestReleaseApi, { headers });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    const { tag_name } = (await res.json()) as { tag_name?: string };
    if (!tag_name) throw new Error('no tag_name in the response');
    return tag_name;
  } catch (err) {
    console.warn(`[patchr] Couldn't read the latest release, using ${fallbackTag}:`, err);
    return fallbackTag;
  }
}

export const version = formatVersion(await fetchLatestTag());
