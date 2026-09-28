// The hero hand-off, the way Apple's product pages do it: the section pins, the full-bleed photo shrinks
// into a rounded card while my name and the buttons drift up and fade, then the page carries on.
import { gsap, MOTION_OK } from './motion';

export function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const frame = hero?.querySelector<HTMLElement>('[data-hero-frame]');
  const photo = hero?.querySelector<HTMLElement>('.hero__photo img, img.hero__photo');
  const copy = hero?.querySelector<HTMLElement>('[data-hero-copy]');
  const shade = hero?.querySelector<HTMLElement>('[data-hero-shade]');
  if (!hero || !frame || !photo || !copy || !shade) return;

  const mm = gsap.matchMedia();
  mm.add({ motion: MOTION_OK, small: '(max-width: 767px)' }, (context) => {
    const { motion, small } = context.conditions as { motion: boolean; small: boolean };
    if (!motion) return;

    const inset = small ? '12svh 4vw 16svh 4vw round 20px' : '11svh 6vw 11svh 6vw round 28px';
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: small ? '+=70%' : '+=110%',
          pin: true,
          scrub: 0.7,
        },
      })
      .fromTo(frame, { clipPath: 'inset(0vh 0vw 0vh 0vw round 0px)' }, { clipPath: `inset(${inset})` }, 0)
      .fromTo(photo, { scale: 1.12 }, { scale: 1 }, 0)
      .to(copy, { yPercent: -18, opacity: 0, duration: 0.55 }, 0)
      .to(shade, { opacity: 0.25 }, 0);
  });
}
