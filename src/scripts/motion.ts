// The motion core both sites share: GSAP with its scroll plugins, and Lenis for smooth scrolling.
// Lenis only runs when the visitor hasn't asked for reduced motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export function startSmoothScroll(): Lenis | null {
  if (!matchMedia(MOTION_OK).matches) return null;

  const lenis = new Lenis({ anchors: true, lerp: 0.1 });
  // Lenis moves the page; ScrollTrigger needs to hear about every frame of it.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Shows the nav's background once the page has scrolled away from the very top. */
export function watchNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const sentinel = document.querySelector('[data-nav-sentinel]');
  if (!nav || !sentinel) return;
  new IntersectionObserver(([entry]) => nav.classList.toggle('is-scrolled', !entry.isIntersecting)).observe(sentinel);
}
