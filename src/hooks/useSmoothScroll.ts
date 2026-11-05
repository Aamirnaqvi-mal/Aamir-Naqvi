import { useEffect } from 'react';

/**
 * Smooth-scroll interceptor.
 *
 * The native CSS `scroll-behavior: smooth` only applies to programmatic scrolls
 * (scrollTo, anchor clicks) — it does NOT smooth out mouse-wheel / trackpad input,
 * which jumps in discrete steps. This hook intercepts wheel events and animates
 * the scroll position with an easing lerp, so every wheel flick glides smoothly
 * instead of jumping. It also makes the portfolio section feel like it moves
 * slowly and gently, because the lerp decelerates the scroll gradually.
 *
 * Touch devices and reduced-motion users are left on the native scroller.
 */

const LERP = 0.12; // how fast the scroll catches up (0.08 = slow glide, 0.2 = snappy)
const WHEEL_MULTIPLIER = 1.0;

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // touch / coarse-pointer devices: native momentum scrolling is already smooth
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let last = 0;

    const step = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt / (LERP * 0.5));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        frame = 0;
        return;
      }
      window.scrollTo(0, current);
      frame = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      // let the browser handle ctrl+zoom etc.
      if (e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      target = Math.max(0, Math.min(
        document.documentElement.scrollHeight - window.innerHeight,
        target + delta * WHEEL_MULTIPLIER,
      ));
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    };

    // keep target in sync when the user scrolls via keyboard / scrollbar / touch
    const onScroll = () => {
      if (!frame) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
