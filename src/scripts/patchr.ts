// Wires up Patchr's site: smooth scroll, reveals, the how-it-works swap and the copy button.
import { initMagnetic } from './magnetic';
import { gsap, MOTION_OK, ScrollTrigger, startSmoothScroll, watchNav } from './motion';
import { initReveals } from './reveal';
import { initStickySteps } from './steps';
import { initThemeToggle } from './theme';

/** In the releases cell, a dot travels from the repo to the channel while the cell is on screen. */
function initFlow(): void {
  const dot = document.querySelector<HTMLElement>('.flow__dot');
  if (!dot) return;
  gsap.matchMedia().add(MOTION_OK, () => {
    const tween = gsap.fromTo(
      dot,
      { xPercent: 0, left: '0%', opacity: 0 },
      { left: '100%', xPercent: -100, opacity: 1, duration: 1.6, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.6 },
    );
    ScrollTrigger.create({
      trigger: dot,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => tween.paused(!self.isActive),
    });
  });
}

/** Copy button: the icon swaps to a tick for two seconds, then back. */
function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    let timer = 0;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
      } catch {
        return;
      }
      button.classList.add('is-copied');
      if (label) label.textContent = 'Copied';
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.classList.remove('is-copied');
        if (label) label.textContent = 'Copy';
      }, 2000);
    });
  });
}

/** The CTA mark's bars arrive one by one, like lines landing in a changelog. */
function initCtaMark(): void {
  const band = document.querySelector<HTMLElement>('[data-cta]');
  if (!band) return;
  gsap.matchMedia().add(MOTION_OK, () => {
    gsap.from(band.querySelectorAll('.mark__stem, .mark__bar'), {
      x: -28,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: band, start: 'top 80%', once: true },
    });
  });
}

export function initPatchr(): void {
  startSmoothScroll();
  watchNav();
  initThemeToggle();
  const how = document.querySelector<HTMLElement>('[data-steps]');
  if (how) initStickySteps(how);
  initFlow();
  initCtaMark();
  initReveals();
  initMagnetic();
  initCopy();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
