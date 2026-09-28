// The sun/moon switch. The inline script in each layout's <head> sets data-theme before the page paints;
// this file only handles clicks, and reveals the new theme in a circle growing from the button.

const root = document.documentElement;

function syncButtons(buttons: NodeListOf<HTMLButtonElement>): void {
  const dark = root.dataset.theme === 'dark';
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(dark)));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.body).backgroundColor);
}

export function initThemeToggle(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (buttons.length === 0) return;

  syncButtons(buttons);
  // The head script also follows the system setting until someone picks a theme.
  new MutationObserver(() => syncButtons(buttons)).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        root.dataset.theme = next;
        try {
          localStorage.setItem(button.dataset.storageKey ?? 'theme', next);
        } catch {
          // Storage can be blocked. The switch still works for this visit.
        }
      };

      if (!document.startViewTransition || reduceMotion.matches) {
        apply();
        return;
      }

      const box = button.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      root.classList.add('theme-vt');
      const transition = document.startViewTransition(apply);
      transition.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 560, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      });
      transition.finished.finally(() => root.classList.remove('theme-vt'));
    }),
  );
}
