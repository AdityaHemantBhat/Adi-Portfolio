import { useRef, useEffect } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from 'framer-motion';

/**
 * CountUp — animated number counter that counts from 0 to `value` when scrolled
 * into view. Numbers render with thousand-separators and optional prefix/suffix
 * ("5+", "14", "100%").
 *
 * Correctness (the "right" way):
 *  - Driven by a `useMotionValue` + `animate` (compositor-friendly), rendered
 *    through `useTransform` → MotionValue text (no per-frame React re-render).
 *  - Triggers once via `useInView` with a reveal margin.
 *  - Reduced motion → jumps straight to the final value (no counting).
 */
interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.8,
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();

  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    `${prefix}${v.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`,
  );

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    if (inView) {
      const controls = animate(mv, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [inView, value, duration, reduce, mv]);

  return (
    <span ref={ref} aria-label={`${prefix}${value}${suffix}`}>
      <motion.span className={className}>{text}</motion.span>
    </span>
  );
}