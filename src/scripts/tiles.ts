// The bot tiles: they rise into place in a short stagger as the grid arrives, their pictures drift a little
// slower than the page (depth), and the "Built with AI" tile types its prompt while it's on screen.
import { gsap, MOTION_OK, ScrollTrigger } from './motion';

const PROMPTS = ['make a Discord bot that posts patch notes', 'now make it look nice'];

function typePrompts(el: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
  PROMPTS.forEach((prompt) => {
    const state = { n: 0 };
    tl.set(el, { textContent: '' })
      .to(state, {
        n: prompt.length,
        duration: prompt.length * 0.045,
        ease: 'none',
        onUpdate: () => {
          el.textContent = prompt.slice(0, Math.round(state.n));
        },
      })
      .to({}, { duration: 1.8 });
  });
  return tl;
}

export function initTiles(): void {
  const grid = document.querySelector<HTMLElement>('[data-tiles]');
  if (!grid) return;
  const tiles = gsap.utils.toArray<HTMLElement>(grid.children);
  const promptText = grid.querySelector<HTMLElement>('[data-prompt-text]');
  const aiTile = grid.querySelector<HTMLElement>('.tile--ai');

  gsap.matchMedia().add(MOTION_OK, () => {
    // Opacity and transform only, so links in the tiles stay in the tab order before they arrive.
    gsap.set(tiles, { opacity: 0, y: 70, scale: 0.96 });
    ScrollTrigger.batch(tiles, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', stagger: 0.12, overwrite: true }),
    });

    grid.querySelectorAll<HTMLElement>('[data-parallax]').forEach((media) => {
      gsap.fromTo(
        media,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: media.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });

    const typing = promptText ? typePrompts(promptText) : null;
    if (typing && aiTile) {
      ScrollTrigger.create({
        trigger: aiTile,
        start: 'top 85%',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? typing.play() : typing.pause()),
      });
    }

    return () => {
      typing?.kill();
      if (promptText) promptText.textContent = PROMPTS[0];
    };
  });
}
