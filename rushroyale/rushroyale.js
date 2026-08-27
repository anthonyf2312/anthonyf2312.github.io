/* Rush Royale reference — the browsable pages.
 *
 * Four pages (units, items, resources, glossary) are the same page with different data, so
 * this is one renderer driven by attributes on <body> rather than four near-copies:
 *
 *   data-rr-source  the JSON file to fetch, relative to this directory
 *   data-rr-shape   how to lay an entry out: "cards" | "facts" | "terms"
 *   data-rr-facet   optional field name to build filter chips from (e.g. "rarity")
 *
 * The prose pages load this file too — one cached copy for the whole section — so it
 * early-returns when there is nothing to render into.
 *
 * The sidebar filter and the scroll-spy are NOT here: docs.js already does both and is
 * loaded alongside. Its funding-bar half early-returns when #fund is absent, which it is
 * on every page in this directory, so nothing from that page leaks in.
 */
(() => {
  'use strict';

  const grid = document.getElementById('rr-grid');
  if (!grid) return;

  const source = document.body.dataset.rrSource;
  const shape = document.body.dataset.rrShape || 'cards';
  const facetKey = document.body.dataset.rrFacet || '';

  const search = document.getElementById('rr-q');
  const chipBox = document.getElementById('rr-chips');
  const count = document.getElementById('rr-count');

  // Rendered as tags, in this order, whenever an entry carries them. Keeping the list here
  // rather than in the JSON means a new field shows up by editing one line.
  const TAG_KEYS = ['rarity', 'role', 'damage', 'slot', 'kind'];

  let entries = [];
  let facet = '';

  // --- helpers ----------------------------------------------------------------------------

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  /* Everything a query should match, flattened once at load rather than on every keystroke. */
  function haystack(entry) {
    const parts = [entry.name, entry.summary, entry.def];

    for (const key of TAG_KEYS) if (entry[key]) parts.push(entry[key]);
    if (Array.isArray(entry.tags)) parts.push(...entry.tags);
    if (Array.isArray(entry.facts)) {
      for (const pair of entry.facts) if (Array.isArray(pair)) parts.push(pair[0], pair[1]);
    }

    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  function tagsFor(entry) {
    const wrap = el('div', 'rr-tags');
    let any = false;

    for (const key of TAG_KEYS) {
      const value = entry[key];

      // "None" is how the data says a support unit deals no damage. The Support tag beside
      // it already carries that, so rendering both just adds a word nobody needs to read.
      if (!value || value === 'None') continue;

      // Rarity is the one tag that changes weight, so it carries a second class.
      const extra = key === 'rarity' ? ` rr-tag-${String(value).toLowerCase()}` : '';
      wrap.append(el('span', `rr-tag${extra}`, value));
      any = true;
    }

    return any ? wrap : null;
  }

  /* An entry marked "stub" still needs real numbers. Say so on the card — a reference that
     looks finished but isn't is worse than one that admits the gap. */
  function stubNote(entry) {
    return entry.detail === 'stub'
      ? el('p', 'rr-stub-note', 'Needs numbers')
      : null;
  }

  // --- the three layouts ------------------------------------------------------------------

  function card(entry) {
    const li = el('li', entry.detail === 'stub' ? 'rr-card rr-card-stub' : 'rr-card');
    li.append(el('h3', 'rr-card-name', entry.name));

    const tags = tagsFor(entry);
    if (tags) li.append(tags);
    if (entry.summary) li.append(el('p', 'rr-card-summary', entry.summary));

    const stub = stubNote(entry);
    if (stub) li.append(stub);
    return li;
  }

  function facts(entry) {
    const li = el('li', entry.detail === 'stub' ? 'rr-card rr-card-stub' : 'rr-card');

    // Anchored so other pages can link straight at "magic dust" or "orbs".
    if (entry.id) li.id = entry.id;
    li.append(el('h3', 'rr-card-name', entry.name));

    const tags = tagsFor(entry);
    if (tags) li.append(tags);
    if (entry.summary) li.append(el('p', 'rr-card-summary', entry.summary));

    if (Array.isArray(entry.facts) && entry.facts.length > 0) {
      const dl = el('dl', 'rr-facts');
      for (const pair of entry.facts) {
        if (!Array.isArray(pair) || pair.length < 2) continue;
        dl.append(el('dt', null, pair[0]), el('dd', null, pair[1]));
      }
      li.append(dl);
    }

    const stub = stubNote(entry);
    if (stub) li.append(stub);
    return li;
  }

  function term(entry) {
    const li = el('li', 'rr-term');
    li.append(el('h3', 'rr-term-name', entry.name));

    const def = el('p', 'rr-term-def', entry.def || '');

    // Links are appended as nodes rather than written into the definition text, so a
    // definition can never smuggle markup into the page.
    if (entry.see && entry.see.href && entry.see.text) {
      const link = el('a', null, entry.see.text);
      link.href = entry.see.href;
      def.append(document.createTextNode(' '), link);
    }

    li.append(def);
    return li;
  }

  const LAYOUTS = { cards: card, facts, terms: term };

  // --- filtering --------------------------------------------------------------------------

  function draw() {
    const query = (search?.value || '').trim().toLowerCase();
    const layout = LAYOUTS[shape] || card;

    const matches = entries.filter((entry) => {
      const byFacet = !facet || String(entry[facetKey] || '') === facet;
      return byFacet && (!query || entry._haystack.includes(query));
    });

    grid.replaceChildren(...matches.map(layout));

    if (count) {
      const total = entries.length;
      count.textContent = matches.length === total
        ? `${total} ${total === 1 ? 'entry' : 'entries'}`
        : `${matches.length} of ${total}`;
    }

    if (matches.length === 0) {
      grid.append(el('li', 'rr-empty', 'Nothing matches that. Try a shorter word, or clear the filters.'));
    }
  }

  function buildChips() {
    if (!chipBox || !facetKey) return;

    // Chip order follows first appearance in the JSON, which is authored Common → Legendary,
    // so the filters read in the same order as the list itself.
    const values = [];
    for (const entry of entries) {
      const value = entry[facetKey];
      if (value && !values.includes(value)) values.push(value);
    }
    if (values.length < 2) return;

    const buttons = [];

    function select(value, button) {
      facet = value;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      draw();
    }

    for (const [value, label] of [['', 'All'], ...values.map((v) => [v, v])]) {
      const button = el('button', 'rr-chip', label);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(value === ''));
      button.addEventListener('click', () => select(value, button));
      buttons.push(button);
      chipBox.append(button);
    }
  }

  // --- load -------------------------------------------------------------------------------

  search?.addEventListener('input', draw);

  fetch(source, { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('unavailable'))))
    .then((data) => {
      entries = Array.isArray(data.entries) ? data.entries : [];
      for (const entry of entries) entry._haystack = haystack(entry);

      buildChips();
      draw();
    })
    .catch(() => {
      // The data is the whole page here, so say what broke rather than hiding the section
      // the way the funding bar does when its file is missing.
      const note = el('li', 'rr-error');
      note.append(
        el('b', null, 'Could not load the data for this page.'),
        document.createTextNode(' Reload, or read '),
      );

      const raw = el('a', null, source);
      raw.href = source;
      note.append(raw, document.createTextNode(' directly.'));

      grid.replaceChildren(note);
      if (count) count.textContent = '';
    });
})();
