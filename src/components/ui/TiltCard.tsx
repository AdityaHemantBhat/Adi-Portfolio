import { useRef, useMemo, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * TiltCard — subtle 3D perspective tilt toward the cursor, then spring back on
 * leave. A tasteful, premium hover treatment for project cards.
 *
 * Correctness (the "right" way):
 *  - Spring-smoothed rotateX/rotateY driven by pointer position (transform-only,
 *    GPU-composited). `transformPerspective` is baked into the transform.
 *  - The child keeps full interactivity — this is a cosmetic hover wrapper.
 *  - Reduced motion → plain wrapper with no handlers or tilt.
 */
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotate (degrees) in either axis. */
  maxTilt?: number;
  scale?: number;
}

export default function TiltCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.015,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 20 });

  const style = useMemo(
    () => ({
      rotateX: springX,
      rotateY: springY,
      transformPerspective: 900,
      transformStyle: 'preserve-3d' as const,
      scale: reduce ? 1 : scale,
    }),
    [springX, springY, scale, reduce],
  );

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * maxTilt);
    rotateX.set(-py * maxTilt);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}