import { useMemo, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveal — generic scroll-reveal wrapper with directional motion + optional blur.
 * A drop-in refinement of the site's `.fade-up` only for blocks not already
 * animated by GSAP (don't double-animate GSAP-controlled nodes).
 *
 * Correctness (the "right" way):
 *  - Transform + blur only; `whileInView` plays once below the fold.
 *  - Polymorphic `as` tag; the motion component identity is memoized per tag so
 *    a parent re-render never remounts / resets the in-flight reveal.
 *  - Reduced motion → renders children directly (no transform/blur).
 */
type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const VECTOR: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  as?: React.ElementType;
  delay?: number;
  distance?: number;
  direction?: Direction;
  blur?: boolean;
  once?: boolean;
  className?: string;
}

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  distance = 40,
  direction = 'up',
  blur = true,
  once = true,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = useMemo(() => motion(as as React.ElementType), [as]);

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  const v = VECTOR[direction];

  return (
    <MotionTag
      className={className}
      initial={{
        opacity: 0,
        x: v.x * distance,
        y: v.y * distance,
        ...(blur ? { filter: 'blur(6px)' } : {}),
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}