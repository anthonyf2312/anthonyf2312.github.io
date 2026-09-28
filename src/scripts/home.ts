// Wires up the personal site. The pinned hero is set up first, before the reveals, so every trigger
// below it measures the space the pin adds.
import { initHero } from './hero';
import { initMagnetic } from './magnetic';
import { FINE_POINTER, gsap, MOTION_OK, ScrollTrigger, startSmoothScroll, watchNav } from './motion';
import { initRace } from './race';
import { initReveals } from './reveal';
import { initTiles } from './tiles';
import { initThemeToggle } from './theme';

/** Lando's helmet settles in as you reach it, then leans towards the pointer with a moving highlight. */
function initHelmet(): void {
  const card = document.querySelector<HTMLElement>('[data-tilt]');
  const glare = card?.querySelector<HTMLElement>('.helmet__glare');
  if (!card || !glare) return;
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    gsap.fromTo(
      card,
      { rotateX: 14, scale: 0.9 },
      { rotateX: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'center center', scrub: 0.6 } },
    );
  });

  mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
    const spring = { duration: 0.9, ease: 'elastic.out(1, 0.6)' };
    const rotX = gsap.quickTo(card, 'rotateX', spring);
    const rotY = gsap.quickTo(card, 'rotateY', spring);
    const glareX = gsap.quickTo(glare, 'xPercent', { duration: 0.6, ease: 'power3.out' });
    const glareY = gsap.quickTo(glare, 'yPercent', { duration: 0.6, ease: 'power3.out' });
    const move = (event: PointerEvent) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      rotY(x * 16);
      rotX(-y * 16);
      glareX(x * 60);
      glareY(y * 60);
    };
    const leave = () => {
      rotX(0);
      rotY(0);
      glareX(0);
      glareY(0);
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    return () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
    };
  });
}

/** The side-on photo band: the car drives across the screen as the band scrolls past. */
function initBand(): void {
  const band = document.querySelector<HTMLElement>('[data-band]');
  const photo = band?.querySelector<HTMLElement>('img');
  if (!band || !photo) return;
  gsap.matchMedia().add(MOTION_OK, () => {
    gsap.fromTo(
      photo,
      { xPercent: 8, scale: 1.08 },
      { xPercent: -8, scale: 1, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

export function initHome(): void {
  startSmoothScroll();
  watchNav();
  initThemeToggle();
  initHero();
  initHelmet();
  initBand();
  initRace();
  initTiles();
  initReveals();
  initMagnetic();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
