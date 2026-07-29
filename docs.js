/* Tessel documentation.
 *
 * Three small jobs: filter the sidebar, highlight the section you are reading, and render the
 * funding bar from funding.json.
 *
 * The page is fully readable with JavaScript off — every section is in the HTML and every
 * sidebar entry is a plain anchor. This only adds convenience on top.
 */
(() => {
  'use strict';

  // --- sidebar filter ---------------------------------------------------------------------

  const search = document.getElementById('doc-search');
  const links = [...document.querySelectorAll('.doc-side a')];
  const groups = [...document.querySelectorAll('.doc-side h2')];
  const empty = document.getElementById('doc-side-empty');

  function filter() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;

    for (const link of links) {
      const match = !query || link.textContent.toLowerCase().includes(query);
      link.parentElement.classList.toggle('is-hidden', !match);
      if (match) visible += 1;
    }

    // Hide a heading when nothing under it survived the filter.
    for (const group of groups) {
      const list = group.nextElementSibling;
      const anyVisible = list && [...list.children].some((li) => !li.classList.contains('is-hidden'));
      group.style.display = anyVisible ? '' : 'none';
      if (list) list.style.display = anyVisible ? '' : 'none';
    }

    if (empty) empty.hidden = visible > 0;
  }

  search?.addEventListener('input', filter);

  // `/` focuses search, the way most docs sites behave.
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== search) {
      event.preventDefault();
      search?.focus();
    }
    if (event.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      filter();
      search.blur();
    }
  });

  // --- current section --------------------------------------------------------------------

  const sections = [...document.querySelectorAll('.doc-main section[id]')];
  const byId = new Map(links.map((link) => [link.getAttribute('href')?.slice(1), link]));

  if ('IntersectionObserver' in window && sections.length > 0) {
    const seen = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target.id);
          else seen.delete(entry.target.id);
        }

        // Mark the topmost visible section, so scrolling down does not leave the highlight
        // on whichever section happened to fire last.
        const current = sections.find((section) => seen.has(section.id));
        for (const link of links) link.classList.remove('is-current');
        if (current) byId.get(current.id)?.classList.add('is-current');
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );

    for (const section of sections) observer.observe(section);
  }

  // --- funding bar ------------------------------------------------------------------------

  const fund = document.getElementById('fund');
  if (!fund) return;

  const fill = document.getElementById('fund-fill');
  const amount = document.getElementById('fund-amount');
  const meta = document.getElementById('fund-meta');
  const button = document.getElementById('fund-btn');

  function money(value, currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${currency} ${value}`;
    }
  }

  fetch('funding.json', { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('unavailable'))))
    .then((data) => {
      const currency = typeof data.currency === 'string' ? data.currency : 'GBP';
      const goal = Number(data.goalMonthly) || 0;
      const raised = Math.max(Number(data.raised) || 0, 0);
      const percent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

      // Built as nodes, not innerHTML: `currency` comes from a file, and the Intl fallback
      // path would otherwise interpolate it raw.
      const raisedEl = document.createElement('b');
      raisedEl.textContent = money(raised, currency);
      amount.replaceChildren(raisedEl, document.createTextNode(` of ${money(goal, currency)} a month`));

      // Set after a frame so the width transition actually runs on load.
      requestAnimationFrame(() => {
        fill.style.width = `${percent}%`;
      });

      fill.parentElement.setAttribute('aria-valuenow', String(Math.round(percent)));
      fill.parentElement.setAttribute('aria-valuetext', `${Math.round(percent)}% of this month's costs`);

      const updated = data.updated ? new Date(data.updated) : null;
      const parts = [`${Math.round(percent)}% covered`];
      if (Number.isFinite(Number(data.supporters))) {
        parts.push(`${data.supporters} supporter${Number(data.supporters) === 1 ? '' : 's'}`);
      }
      if (updated && !Number.isNaN(updated.getTime())) {
        parts.push(`updated ${updated.toISOString().slice(0, 10)}`);
      }
      meta.textContent = parts.join(' · ');

      if (typeof data.donateUrl === 'string' && /^https:\/\//.test(data.donateUrl)) {
        button.href = data.donateUrl;
      } else {
        // No destination configured yet — better to hide the button than send people nowhere.
        button.hidden = true;
      }
    })
    .catch(() => {
      fund.hidden = true;
    });
})();
