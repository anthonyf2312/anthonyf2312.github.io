// The Sochi stage follows the step you're on: the lap readout and lap bar move on, the position counter rolls
// like a timing screen (up when he gains places, down when he loses them), and the rain arrives.
import { gsap } from './motion';
import { initStickySteps } from './steps';

export function initRace(): void {
  const root = document.querySelector<HTMLElement>('[data-race]');
  const stage = root?.querySelector<HTMLElement>('[data-race-stage]');
  const lapText = root?.querySelector<HTMLElement>('[data-race-lap]');
  const posText = root?.querySelector<HTMLElement>('[data-race-pos]');
  const bar = root?.querySelector<HTMLElement>('[data-race-bar]');
  if (!root || !stage || !lapText || !posText || !bar) return;

  const total = Number(root.dataset.total ?? 53);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let shownPos = Number(posText.textContent);

  initStickySteps(root, (_index, step) => {
    const lap = Number(step.dataset.lap);
    const pos = Number(step.dataset.pos);
    lapText.textContent = lap === 0 ? 'Grid' : `Lap ${lap}`;
    bar.style.transform = `scaleX(${lap / total})`;
    stage.classList.toggle('is-wet', step.dataset.rain === 'true');

    if (pos !== shownPos) {
      const gained = pos < shownPos;
      shownPos = pos;
      posText.textContent = String(pos);
      if (!reduceMotion.matches) {
        gsap.fromTo(posText, { yPercent: gained ? 100 : -100 }, { yPercent: 0, duration: 0.6, ease: 'expo.out', overwrite: true });
      }
    }
  });
}
