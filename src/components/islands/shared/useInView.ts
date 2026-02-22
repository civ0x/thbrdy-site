import { useRef, useState, useEffect } from "react";

/**
 * Intersection observer hook for scroll-triggered animations.
 * Returns [ref, inView] — attach ref to the element, read inView for animation state.
 *
 * - Fires once (no un-trigger on scroll away)
 * - Respects prefers-reduced-motion: immediately sets inView=true
 */
export function useInView(threshold = 0.2): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}
