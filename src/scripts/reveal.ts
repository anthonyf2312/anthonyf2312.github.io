// Scroll reveals shared by both sites. Nothing is hidden unless this code is about to animate it,
// so the page reads fine without JS and with reduced motion.
//
//   data-reveal="lines"   headings: each line rises out of a mask (the landonorris.com move)
//   data-reveal="fade"    supporting text and cards: a short fade up, batched so neighbours stagger
//   data-scrub-words      a statement whose words light up as you scroll through it (Apple)
import { gsap, MOTION_OK, ScrollTrigger, SplitText } from './motion';

export function initReveals(): void {
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
      let played = false;
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'reveal-line',
        // The lines only wrap the real text, so screen readers read it as is. ("auto" would put an
        // aria-label on the element, which isn't allowed on a paragraph.)
        aria: 'none',
        autoSplit: true,
        onSplit(self) {
          // A re-split after fonts load or a resize shouldn't replay a reveal that already ran.
          if (played) return;
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: () => (played = true) },
          });
        },
      });
    });

    const fades = gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]');
    if (fades.length > 0) {
      // Opacity only, never visibility: hidden, so links inside stay in the tab order. Tabbing to one
      // scrolls it into view, which runs its reveal.
      gsap.set(fades, { opacity: 0, y: 16 });
      ScrollTrigger.batch(fades, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, overwrite: true }),
      });
    }

    document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
      SplitText.create(el, {
        type: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true },
            },
          );
        },
      });
    });
  });
}
