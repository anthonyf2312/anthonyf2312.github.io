/* Rush Royale reference — the whole section's behaviour.
 *
 * This file is self-contained: the section no longer loads /docs.js, so the two jobs it used
 * from there (sidebar filter, scroll-spy) live here now, unchanged in behaviour.
 *
 * Jobs, in order:
 *   1. theme        light/dark toggle, persisted; the pre-paint <head> script sets the initial value
 *   2. chrome       nav tools, back-to-top and the command palette are INJECTED here rather than
 *                   written into eight HTML files — they do nothing without JS, so they should
 *                   not exist without it either
 *   3. sidebar      filter + scroll-spy (moved from docs.js)
 *   4. reveals      one scroll-triggered entrance, from an already-visible default
 *   5. palette      section-wide search over all four datasets and every section heading
 *   6. renderer     the browsable pages, driven by attributes on <body>:
 *                     data-rr-source  the JSON file to fetch, relative to this directory
 *                     data-rr-shape   how to lay an entry out: "cards" | "facts" | "terms" | "units"
 *                     data-rr-facet   comma-separated field names to build filter chip groups from
 *                                     (e.g. "rarity,faction"); groups combine, so picking one of
 *                                     each narrows
 *
 * The prose pages load this file too — one cached copy for the whole section — so every job
 * early-returns when the thing it drives is absent.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  /* Icons are drawn, not typed. One stroke weight across the whole set. */
  function icon(path, extraClass) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.75');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    if (extraClass) svg.setAttribute('class', extraClass);
    for (const d of [].concat(path)) {
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      node.setAttribute('d', d);
      svg.append(node);
    }
    return svg;
  }

  const ICON_SEARCH = ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'm16.5 16.5 3.5 3.5'];
  const ICON_SUN = ['M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'];
  const ICON_MOON = ['M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z'];
  const ICON_UP = ['M12 19V5', 'm5 12 7-7 7 7'];

  // =========================================================================================
  // 1. Theme
  // =========================================================================================

  const STORE = 'rr-theme';

  function storedTheme() {
    try { return localStorage.getItem(STORE); } catch { return null; }
  }

  function effectiveTheme() {
    const stored = storedTheme();
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORE, theme); } catch { /* private mode; the toggle still works */ }

    // Keep the browser's own chrome in step with the page it is framing.
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute('content', theme === 'dark' ? '#0B0E13' : '#FBFBFD');
      meta.removeAttribute('media');
    }
  }

  // =========================================================================================
  // 2. Injected chrome
  // =========================================================================================

  const nav = document.querySelector('.doc-nav');
  let openPalette = null; // assigned in section 5

  if (nav) {
    const tools = el('div', 'doc-nav-tools');

    const searchBtn = el('button', 'rr-icon-btn rr-cmd-btn');
    searchBtn.type = 'button';
    searchBtn.setAttribute('aria-label', 'Search the reference');
    searchBtn.append(icon(ICON_SEARCH), el('span', 'rr-cmd-label', 'Search'));

    // Show the shortcut that actually works on this platform.
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    searchBtn.append(el('span', 'rr-cmd-hint', mac ? '⌘K' : 'Ctrl K'));
    searchBtn.addEventListener('click', () => openPalette?.());

    const themeBtn = el('button', 'rr-icon-btn is-square rr-theme-btn');
    themeBtn.type = 'button';
    themeBtn.append(icon(ICON_SUN, 'rr-icon-sun'), icon(ICON_MOON, 'rr-icon-moon'));

    function labelTheme() {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      themeBtn.setAttribute('aria-label', `Switch to ${next} theme`);
    }
    labelTheme();

    themeBtn.addEventListener('click', () => {
      applyTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
      labelTheme();
    });

    tools.append(searchBtn, themeBtn);
    nav.append(tools);

    // The nav earns its hairline only once there is something scrolled underneath it.
    const sentinel = el('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => nav.classList.toggle('is-stuck', !entry.isIntersecting),
        { threshold: 0 },
      ).observe(sentinel);
    }
  }

  // Back to top. Appears once you are far enough down that returning is a real errand.
  const toTop = el('button', 'rr-top');
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.append(icon(ICON_UP));
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
    document.querySelector('.doc-nav-name')?.focus();
  });
  document.body.append(toTop);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight);
      ticking = false;
    });
  }, { passive: true });

  // =========================================================================================
  // 3. Sidebar: filter and scroll-spy (moved from docs.js, behaviour unchanged)
  // =========================================================================================

  const sideSearch = document.getElementById('doc-search');
  const sideLinks = [...document.querySelectorAll('.doc-side a')];
  const sideGroups = [...document.querySelectorAll('.doc-side h2')];
  const sideEmpty = document.getElementById('doc-side-empty');

  function filterSidebar() {
    const query = (sideSearch?.value || '').trim().toLowerCase();
    let visible = 0;

    for (const link of sideLinks) {
      const match = !query || link.textContent.toLowerCase().includes(query);
      link.parentElement.classList.toggle('is-hidden', !match);
      if (match) visible += 1;
    }

    // Hide a heading when nothing under it survived the filter.
    for (const group of sideGroups) {
      const list = group.nextElementSibling;
      const anyVisible = list && [...list.children].some((li) => !li.classList.contains('is-hidden'));
      group.style.display = anyVisible ? '' : 'none';
      if (list) list.style.display = anyVisible ? '' : 'none';
    }

    if (sideEmpty) sideEmpty.hidden = visible > 0;
  }

  sideSearch?.addEventListener('input', filterSidebar);

  const spySections = [...document.querySelectorAll('.doc-main section[id]')];
  const linkById = new Map(sideLinks.map((link) => [link.getAttribute('href')?.slice(1), link]));

  if ('IntersectionObserver' in window && spySections.length > 0) {
    const seen = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target.id);
          else seen.delete(entry.target.id);
        }

        // Mark the topmost visible section, so scrolling down does not leave the highlight
        // on whichever section happened to fire last.
        const current = spySections.find((section) => seen.has(section.id));
        for (const link of sideLinks) link.classList.remove('is-current');
        if (current) linkById.get(current.id)?.classList.add('is-current');
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );

    for (const section of spySections) observer.observe(section);
  }

  // =========================================================================================
  // 4. Reveals
  // =========================================================================================

  /* One entrance, staggered within a viewport, from a default that is already visible.
     The .rr-anim class is what arms the hidden state, and only this line ever adds it —
     so if this file fails to load, every section renders as plain visible content. */
  if ('IntersectionObserver' in window && !reduced.matches) {
    const targets = [
      ...document.querySelectorAll('.rr-hub-card, .doc-main > section, .rr-start, .doc-hero'),
    ];

    if (targets.length > 0) {
      root.classList.add('rr-anim');
      for (const node of targets) node.classList.add('rr-reveal');

      const observer = new IntersectionObserver(
        (entries) => {
          let step = 0;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.style.setProperty('--rr-delay', `${Math.min(step, 5) * 60}ms`);
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
            step += 1;
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      );

      for (const node of targets) observer.observe(node);
    }
  }

  // =========================================================================================
  // 5. Command palette
  // =========================================================================================

  /* Search only ever worked inside the page you were already on. This searches the whole
     section — all four datasets plus every section heading — and is the reason the nav
     carries a search button on prose pages that have nothing of their own to search. */

  const DATASETS = [
    { file: 'units.json', page: 'units.html', group: 'Units' },
    { file: 'spells.json', page: 'spells.html', group: 'Spells & perks' },
    { file: 'resources.json', page: 'resources.html', group: 'Resources' },
    { file: 'glossary.json', page: 'glossary.html', group: 'Glossary' },
  ];

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  let index = null;
  let indexPromise = null;

  function loadIndex() {
    if (indexPromise) return indexPromise;

    const jobs = DATASETS.map(({ file, page, group }) =>
      fetch(file, { cache: 'no-cache' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => (Array.isArray(data?.entries) ? data.entries.map((entry) => ({
          name: entry.name,
          desc: entry.summary || entry.def || '',
          href: `${page}#${entry.id || slug(entry.name)}`,
          group,
          where: group,
        })) : []))
        .catch(() => []));

    // Section headings, so "reincarnation" finds the passage that explains it.
    jobs.push(
      fetch('pages.json', { cache: 'no-cache' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => (Array.isArray(data?.pages) ? data.pages.flatMap((page) =>
          (page.sections || []).map((section) => ({
            name: section.title,
            desc: '',
            href: `${page.path}#${section.id}`,
            group: 'Sections',
            // The page it sits on, not the word "Sections" — the group heading above
            // already says that, and "Co-op" is both a glossary term and a section.
            where: page.title,
          }))) : []))
        .catch(() => []),
    );

    indexPromise = Promise.all(jobs).then((lists) => {
      index = lists.flat();
      for (const hit of index) hit._hay = `${hit.name} ${hit.desc} ${hit.where || ''}`.toLowerCase();
      return index;
    });

    return indexPromise;
  }

  const palette = el('div', 'rr-palette');
  palette.hidden = true;
  palette.setAttribute('role', 'dialog');
  palette.setAttribute('aria-modal', 'true');
  palette.setAttribute('aria-label', 'Search the reference');

  const panel = el('div', 'rr-palette-panel');
  const head = el('div', 'rr-palette-head');
  const input = el('input', 'rr-palette-input');
  input.type = 'text';
  input.setAttribute('placeholder', 'Search units, terms, resources…');
  input.setAttribute('aria-label', 'Search the reference');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('spellcheck', 'false');
  head.append(icon(ICON_SEARCH), input);

  const results = el('ul', 'rr-palette-results');
  results.setAttribute('role', 'listbox');

  const foot = el('div', 'rr-palette-foot');
  foot.append(el('span', null, '↑↓ to move'), el('span', null, '↵ to open'), el('span', null, 'Esc to close'));

  panel.append(head, results, foot);
  palette.append(panel);
  document.body.append(palette);

  let hits = [];
  let active = 0;
  let lastFocus = null;

  function drawPalette() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();

    if (!index) {
      results.append(el('li', 'rr-palette-loading', 'Loading…'));
      return;
    }

    hits = query
      ? index.filter((hit) => hit._hay.includes(query)).slice(0, 40)
      : index.filter((hit) => hit.group === 'Sections').slice(0, 12);

    if (hits.length === 0) {
      results.append(el('li', 'rr-palette-empty', 'Nothing matches that. Try a shorter word.'));
      return;
    }

    active = 0;
    let group = null;

    hits.forEach((hit, i) => {
      if (hit.group !== group) {
        group = hit.group;
        const heading = el('li', 'rr-palette-group', group);
        heading.setAttribute('role', 'presentation');
        results.append(heading);
      }

      const li = el('li', i === 0 ? 'rr-palette-hit is-active' : 'rr-palette-hit');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === 0));

      const link = el('a');
      link.href = hit.href;
      link.append(el('span', 'rr-palette-name', hit.name));
      if (hit.desc) link.append(el('span', 'rr-palette-desc', hit.desc));
      link.append(el('span', 'rr-palette-where', hit.where || hit.group));

      li.append(link);
      li.dataset.i = String(i);
      results.append(li);
    });
  }

  function move(delta) {
    const nodes = [...results.querySelectorAll('.rr-palette-hit')];
    if (nodes.length === 0) return;

    active = (active + delta + nodes.length) % nodes.length;
    nodes.forEach((node, i) => {
      node.classList.toggle('is-active', i === active);
      node.setAttribute('aria-selected', String(i === active));
    });
    nodes[active].scrollIntoView({ block: 'nearest' });
  }

  function closePalette() {
    palette.hidden = true;
    document.body.style.removeProperty('overflow');
    lastFocus?.focus();
  }

  openPalette = function open() {
    lastFocus = document.activeElement;
    palette.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    drawPalette();
    input.focus();
    loadIndex().then(drawPalette);
  };

  input.addEventListener('input', drawPalette);

  palette.addEventListener('click', (event) => {
    if (event.target === palette) closePalette();
  });

  palette.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); closePalette(); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); move(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
    else if (event.key === 'Enter') {
      const node = results.querySelectorAll('.rr-palette-hit')[active];
      const href = node?.querySelector('a')?.getAttribute('href');
      if (href) { event.preventDefault(); window.location.href = href; }
    } else if (event.key === 'Tab') {
      // Two focusable things in here; keep Tab inside the dialog.
      event.preventDefault();
      input.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.hidden ? openPalette() : closePalette();
      return;
    }

    // `/` keeps focusing the sidebar filter where there is one — that is what the
    // placeholder on those pages promises. Elsewhere it opens the palette.
    if (event.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) {
      event.preventDefault();
      if (sideSearch) sideSearch.focus();
      else openPalette();
      return;
    }

    if (event.key === 'Escape' && document.activeElement === sideSearch) {
      sideSearch.value = '';
      filterSidebar();
      sideSearch.blur();
    }
  });

  // =========================================================================================
  // 6. The browsable pages
  // =========================================================================================

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

  /* The three tiers an entry can come from, weakest evidence first. An entry with no 'source'
     was transcribed from the game itself and needs no caveat — that is the absence of a
     label, not a label of its own. */
  const SOURCE_LABELS = {
    'fandom-wiki': { className: 'rr-source', label: 'Wiki import' },
    'patch-notes': { className: 'rr-source rr-source-notes', label: 'Official notes' },
  };

  let entries = [];

  // field name -> currently selected value, '' meaning "all". Groups AND together.
  const chosen = new Map(facetKeys.map((k) => [k, '']));

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

      // Rarity is the one tag that carries hue, so it takes a second class.
      const extra = key === 'rarity' ? ` rr-tag-${String(value).toLowerCase()}` : '';
      wrap.append(el('span', `rr-tag${extra}`, value));
      any = true;
    }

    /* Where the entry came from. Three quarters of the roster was imported from a wiki that
       is years out of date, and a reader deserves to see which entry they are reading before
       they act on it. Every branch reports fields the file already carries. */
    const known = SOURCE_LABELS[entry.source];
    if (known) {
      const revision = entry.sourceRevision ? ` · ${entry.sourceRevision}` : '';
      wrap.append(el('span', known.className, known.label + revision));
      any = true;
    } else if (entry.detail !== 'stub' && (entry.abilities || entry.summary)) {
      wrap.append(el('span', 'rr-source rr-source-verified', 'Checked in-game'));
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

  // --- the four layouts ---------------------------------------------------------------------

  function card(entry) {
    const li = el('li', 'rr-card');
    if (entry.id) li.id = entry.id;
    li.append(el('h3', 'rr-card-name', entry.name));

    const tags = tagsFor(entry);
    if (tags) li.append(tags);
    if (entry.summary) li.append(el('p', 'rr-card-summary', entry.summary));

    const stub = stubNote(entry);
    if (stub) li.append(stub);
    return li;
  }

  function facts(entry) {
    const li = el('li', 'rr-card');

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

    // Slugged so the palette can link straight at a definition.
    li.id = entry.id || slug(entry.name);
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

  // --- filtering ----------------------------------------------------------------------------

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

  // --- load ---------------------------------------------------------------------------------

  search?.addEventListener('input', draw);

  fetch(source, { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('unavailable'))))
    .then((data) => {
      entries = Array.isArray(data.entries) ? data.entries : [];
      for (const entry of entries) entry._haystack = haystack(entry);

      buildChips();
      draw();

      /* Anchors on these pages do not exist until the fetch above resolves, so a cold
         deep link — progression.html linking at resources.html#orbs — lands at the top of
         the page and looks broken. Re-run the jump now that the target exists.

         Twice, because the webfont loads with display:swap: the first jump is measured in
         the fallback face, then Manrope arrives, every card changes height, and the target
         slides out from under the reader. The second jump lands on the settled layout. */
      const jump = () => {
        if (!location.hash) return;
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
      };

      jump();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(jump));
      }
    })
    .catch(() => {
      // The data is the whole page here, so say what broke rather than hiding the section.
      const note = el('li', 'rr-error');
      note.append(
        el('b', null, 'Could not load the data for this page.'),
        document.createTextNode('Reload, or read '),
      );

      const raw = el('a', null, source);
      raw.href = source;
      note.append(raw, document.createTextNode(' directly.'));

      grid.replaceChildren(note);
      if (count) count.textContent = '';
    });
})();
