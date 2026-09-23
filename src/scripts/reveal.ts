// Reveal marked elements once as they enter the viewport. Inside a [data-reveal-group],
// siblings are staggered in reading order (capped, so a long group never lags).
// Shared by the personal site (Base.astro) and Patchr (PatchrBase.astro).
document.querySelectorAll('[data-reveal-group]').forEach((group) => {
  group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
    el.style.setProperty('--reveal-i', String(Math.min(i, 5)));
  });
});

const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (!('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  // Wipe variants start fully clipped, and the observer counts a fully clipped element as
  // invisible, so it would never fire. For those, watch the unclipped parent instead.
  const clipped = new Set(['panel', 'wipe-left']);
  const revealFor = new Map<Element, HTMLElement>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealFor.get(entry.target)?.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => {
    const watched = clipped.has(el.dataset.reveal ?? '') && el.parentElement ? el.parentElement : el;
    revealFor.set(watched, el);
    observer.observe(watched);
  });
}
