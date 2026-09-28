// Sticky steps, the way Apple's product pages walk through a feature: a picture stays put beside a list of
// steps, and changes as each step reaches the middle of the screen. Used by Patchr's "Set it up once" and
// by the home page's Sochi story.
//
// Markup: a root with [data-steps], steps with [data-step], and optional pictures with [data-step-visual]
// (one per step, shown in turn). onStep runs for anything else that should follow the current step.
import { ScrollTrigger } from './motion';

export function initStickySteps(root: HTMLElement, onStep?: (index: number, step: HTMLElement) => void): void {
  const visuals = [...root.querySelectorAll<HTMLElement>('[data-step-visual]')];
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  if (steps.length === 0) return;

  let current = -1;
  const show = (index: number) => {
    if (index === current) return;
    current = index;
    visuals.forEach((visual, i) => visual.classList.toggle('is-active', i === index));
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    onStep?.(index, steps[index]);
  };

  root.classList.add('is-live');
  show(0);
  steps.forEach((step, i) =>
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => {
        if (self.isActive) show(i);
      },
    }),
  );
}
