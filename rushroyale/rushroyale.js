/* Rush Royale reference — the browsable pages.
 *
 * Four pages (units, items, resources, glossary) are the same page with different data, so
 * this is one renderer driven by attributes on <body> rather than four near-copies:
 *
 *   data-rr-source  the JSON file to fetch, relative to this directory
 *   data-rr-shape   how to lay an entry out: "cards" | "facts" | "terms"
 *   data-rr-facet   optional comma-separated field names to build filter chip groups from
 *                   (e.g. "rarity,faction"); groups combine, so picking one of each narrows
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
  const facetKeys = (document.body.dataset.rrFacet || '')
    .split(',').map((k) => k.trim()).filter(Boolean);

  const search = document.getElementById('rr-q');
  const chipBox = document.getElementById('rr-chips');
  const count = document.getElementById('rr-count');

  // Rendered as tags, in this order, whenever an entry carries them. Keeping the list here
  // rather than in the JSON means a new field shows up by editing one line.
  const TAG_KEYS = ['rarity', 'faction', 'role', 'damage', 'slot', 'kind'];

  let entries = [];

  // field name -> currently selected value, '' meaning "all". Groups AND together.
  const chosen = new Map(facetKeys.map((k) => [k, '']));

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

    // Ability and note text is the substance of a unit entry, so it has to be searchable —
    // looking up "tornado" or "orb of fear" should find the unit that does it.
    for (const key of ['abilities', 'notes']) {
      if (Array.isArray(entry[key])) parts.push(...entry[key]);
    }

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

  /* A unit's ability text runs to several paragraphs, which a narrow grid tile cannot hold.
     These render full width, one per row, with the abilities as a list — closer to a rules
     card than to a catalogue tile. */
  function unit(entry) {
    const li = el('li', 'rr-unit');
    if (entry.id) li.id = entry.id;

    li.append(el('h3', 'rr-unit-name', entry.name));

    const tags = tagsFor(entry);
    if (tags) li.append(tags);
    if (entry.summary) li.append(el('p', 'rr-unit-summary', entry.summary));

    if (Array.isArray(entry.abilities) && entry.abilities.length > 0) {
      const ul = el('ul', 'rr-abilities');
      for (const line of entry.abilities) ul.append(el('li', null, line));
      li.append(ul);
    }

    if (Array.isArray(entry.notes) && entry.notes.length > 0) {
      const box = el('div', 'rr-unit-notes');
      for (const line of entry.notes) box.append(el('p', null, line));
      li.append(box);
    }

    const stub = stubNote(entry);
    if (stub) li.append(stub);
    return li;
  }

  const LAYOUTS = { cards: card, facts, terms: term, units: unit };

  // --- filtering --------------------------------------------------------------------------

  function draw() {
    const query = (search?.value || '').trim().toLowerCase();
    const layout = LAYOUTS[shape] || card;

    const matches = entries.filter((entry) => {
      const byFacets = facetKeys.every((key) => {
        const want = chosen.get(key);
        return !want || String(entry[key] || '') === want;
      });
      return byFacets && (!query || entry._haystack.includes(query));
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
    if (!chipBox || facetKeys.length === 0) return;

    for (const key of facetKeys) {
      const values = [];
      for (const entry of entries) {
        const value = entry[key];
        if (value && !values.includes(value)) values.push(value);
      }

      // Rarity keeps the order it was authored in, because Common -> Legendary is meaningful.
      // Every other facet is an unordered set, so alphabetical beats "whichever unit came
      // first in the file" — which is what the reader is scanning for anyway.
      if (key !== 'rarity') values.sort((a, b) => a.localeCompare(b));

      // One value is not a filter — it would sit there looking clickable and do nothing.
      if (values.length < 2) continue;

      const group = el('div', 'rr-chip-group');
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', `Filter by ${key}`);
      group.append(el('span', 'rr-chip-label', key));

      const buttons = [];
      for (const [value, label] of [['', 'All'], ...values.map((v) => [v, v])]) {
        const button = el('button', 'rr-chip', label);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(value === ''));
        button.addEventListener('click', () => {
          chosen.set(key, value);
          for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
          draw();
        });
        buttons.push(button);
        group.append(button);
      }

      chipBox.append(group);
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
