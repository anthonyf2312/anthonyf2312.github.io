// Primary buttons lean a few pixels towards the pointer, then settle back. Mouse and trackpad only.
import { FINE_POINTER, gsap, MOTION_OK } from './motion';

const MAX_PULL = 6;
const clamp = (value: number) => Math.max(-MAX_PULL, Math.min(MAX_PULL, value));

export function initMagnetic(): void {
  const mm = gsap.matchMedia();

  mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      const move = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        xTo(clamp((event.clientX - (box.left + box.width / 2)) * 0.2));
        yTo(clamp((event.clientY - (box.top + box.height / 2)) * 0.3));
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}
