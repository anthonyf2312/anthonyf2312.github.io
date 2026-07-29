/* Tessel module catalogue.
 *
 * Renders modules.json — the same file the bot fetches to decide which modules are reviewed.
 * The page ignores modules.json.sig; verifying the signature is the bot's job, not the
 * browser's, and pretending otherwise would be security theatre.
 *
 * Everything a listing says about a module is treated as text, never as markup: entries are
 * submitted by strangers through GitHub issues.
 */
(() => {
  'use strict';

  const grid = document.getElementById('cat-grid');
  const search = document.getElementById('cat-q');
  const signedOnly = document.getElementById('cat-signed-only');
  const count = document.getElementById('cat-count');
  const yearEl = document.getElementById('cat-year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /** Permissions worth calling out — these move data off the server or act destructively. */
  const DANGEROUS = new Set([
    'messages.read',
    'messages.manage',
    'members.roles',
    'members.moderate',
    'members.ban',
    'channels.manage',
    'http',
    'discord.raw',
  ]);

  let modules = [];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /**
   * Listing values are submitted by strangers, so a URL is not trusted until it is parsed and
   * its scheme checked. Assigning an unvalidated value to `href` would let `javascript:` run
   * on click; `new URL` is what makes the scheme visible rather than assumed.
   *
   * Repositories are additionally required to be github.com, because that is the only thing
   * `/module install` accepts — showing an install command the bot would refuse is misleading.
   */
  function safeRepoUrl(value) {
    if (typeof value !== 'string' || value === '') return null;
    try {
      const url = new URL(String(value));
      if (url.protocol !== 'https:') return null;
      if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') return null;
      return url.href;
    } catch {
      return null;
    }
  }

  function safeImageUrl(value) {
    // A missing icon must not become the relative URL "undefined".
    if (typeof value !== 'string' || value === '') return null;
    try {
      const url = new URL(String(value), location.href);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function buildTile(entry) {
    const signed = entry.trust === 'signed';
    const rejected = entry.trust === 'rejected';
    const repoUrl = safeRepoUrl(entry.repository);
    const iconUrl = safeImageUrl(entry.icon);
    const tile = el(
      'article',
      'cat-tile' + (signed ? '' : ' cat-tile-unsigned') + (rejected ? ' cat-tile-rejected' : ''),
    );

    const head = el('div', 'cat-tile-head');
    if (iconUrl) {
      const icon = el('img', 'cat-tile-icon');
      icon.src = iconUrl;
      icon.alt = '';
      icon.loading = 'lazy';
      icon.width = 48;
      icon.height = 48;
      head.appendChild(icon);
    }

    const heading = el('div');
    heading.appendChild(el('h3', 'cat-tile-name', entry.name || entry.id));
    heading.appendChild(
      el('p', 'cat-tile-by', `${entry.author || 'unknown'} · v${entry.version || '0.0.0'}`),
    );
    head.appendChild(heading);
    tile.appendChild(head);

    const chipClass = rejected
      ? 'cat-chip cat-chip-rejected'
      : signed
        ? 'cat-chip cat-chip-signed'
        : 'cat-chip cat-chip-unsigned';
    const chipText = rejected ? 'Not recommended' : signed ? 'Reviewed' : 'Unreviewed';
    tile.appendChild(el('span', chipClass, chipText));

    tile.appendChild(el('p', 'cat-tile-desc', entry.description || ''));

    // The published reason, when a decision was recorded. Rendered as text, never markup —
    // it is generated from a review of a stranger's code and read by strangers.
    const review = entry.review && typeof entry.review === 'object' ? entry.review : null;
    if (review && typeof review.reason === 'string') {
      tile.appendChild(el('p', 'cat-tile-reason' + (rejected ? ' is-rejected' : ''), review.reason));

      const decided = review.decidedBy === 'maintainer' ? 'a maintainer' : 'an automated review';
      const when = typeof review.reviewedAt === 'string' ? review.reviewedAt.slice(0, 10) : '';
      tile.appendChild(
        el('p', 'cat-tile-reviewmeta', `Decided by ${decided}${when ? ` on ${when}` : ''}.`),
      );
    } else if (!signed) {
      tile.appendChild(
        el('p', 'cat-tile-warn',
          'Nobody has reviewed this code. Tessel will warn you before installing it.'),
      );
    }

    const permissions = Array.isArray(entry.permissions) ? entry.permissions : [];
    if (permissions.length === 0) {
      tile.appendChild(el('p', 'cat-perms-none', 'Asks for no permissions.'));
    } else {
      const perms = el('div', 'cat-perms');
      perms.setAttribute('aria-label', 'Permissions this module asks for');
      for (const permission of permissions) {
        perms.appendChild(
          el('span', 'cat-perm' + (DANGEROUS.has(permission) ? ' cat-perm-danger' : ''), permission),
        );
      }
      tile.appendChild(perms);
    }

    const links = el('div', 'cat-tile-links');
    if (repoUrl) {
      const repo = el('a', null, 'source ↗');
      repo.href = repoUrl;
      repo.rel = 'noopener noreferrer';
      repo.target = '_blank';
      links.appendChild(repo);
    }
    tile.appendChild(links);

    // A listing whose repository did not survive validation gets no install line at all —
    // better to show nothing than a command that would fail or point somewhere unexpected.
    if (!repoUrl) {
      tile.appendChild(el('p', 'cat-perms-none', 'This listing has no valid GitHub repository.'));
      return tile;
    }

    const command = `/module install ${repoUrl}`;
    const install = el('div', 'cat-install');
    install.appendChild(el('code', null, command));

    const copy = el('button', 'cat-copy', 'Copy');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(command);
        copy.textContent = 'Copied';
        copy.dataset.copied = 'true';
      } catch {
        // Clipboard can be blocked; selecting the text is the honest fallback.
        copy.textContent = 'Select it';
      }
      setTimeout(() => {
        copy.textContent = 'Copy';
        delete copy.dataset.copied;
      }, 1600);
    });
    install.appendChild(copy);
    tile.appendChild(install);

    return tile;
  }

  function showTemplate(id) {
    const template = document.getElementById(id);
    if (template) grid.appendChild(template.content.cloneNode(true));
  }

  function render() {
    const query = (search?.value || '').trim().toLowerCase();
    const reviewedOnly = Boolean(signedOnly?.checked);

    const visible = modules.filter((entry) => {
      if (reviewedOnly && entry.trust !== 'signed') return false;
      if (!query) return true;
      const haystack = [entry.name, entry.description, entry.author, ...(entry.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

    grid.replaceChildren();

    if (modules.length === 0) {
      showTemplate('cat-empty');
      count.textContent = '';
      return;
    }

    if (visible.length === 0) {
      showTemplate('cat-none-match');
      count.textContent = `0 of ${modules.length}`;
      return;
    }

    for (const entry of visible) {
      const tile = buildTile(entry);
      tile.classList.add('cat-in');
      grid.appendChild(tile);
    }

    count.textContent =
      visible.length === modules.length
        ? `${modules.length} module${modules.length === 1 ? '' : 's'}`
        : `${visible.length} of ${modules.length}`;
  }

  search?.addEventListener('input', render);
  signedOnly?.addEventListener('change', render);

  fetch('modules.json', { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('unavailable'))))
    .then((data) => {
      // `entries` are signature-covered and reviewed; `listings` are submitted but not. The
      // trust state is derived from which array an entry came from, never from a field an
      // entry could set for itself.
      const reviewed = (Array.isArray(data.entries) ? data.entries : []).map((entry) => ({
        ...entry,
        trust: 'signed',
      }));
      const unreviewed = (Array.isArray(data.listings) ? data.listings : []).map((entry) => ({
        ...entry,
        // A listing carrying an "unsafe" review was looked at and refused; one without is
        // simply not finished. Collapsing those two into one label would be unfair to the
        // second group, so they render differently.
        trust: entry.review && entry.review.verdict === 'unsafe' ? 'rejected' : 'unsigned',
      }));

      modules = [...reviewed, ...unreviewed];
      modules.sort((a, b) => {
        if ((a.trust === 'signed') !== (b.trust === 'signed')) return a.trust === 'signed' ? -1 : 1;
        return (a.name || '').localeCompare(b.name || '');
      });
      render();
    })
    .catch(() => {
      grid.replaceChildren();
      const failed = document.createElement('div');
      failed.className = 'cat-empty';
      failed.appendChild(el('p', 'cat-empty-title', "Couldn't load the catalogue."));
      failed.appendChild(
        el('p', null,
          'Refresh to try again. You can still install any module straight from its GitHub URL.'),
      );
      grid.appendChild(failed);
    });
})();
