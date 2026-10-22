import { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * MagneticButton — a wrapper that gently pulls its child (a real link/button)
 * toward the cursor on hover, then springs back on leave.
 *
 * Correctness (the "right" way):
 *  - Translates via transform only (GPU-composited); springs give a buttery ease.
 *  - The child keeps full `pointer-events` (it's a real Link/button), so the
 *    element stays clickable and focusable — magnetics are cosmetic.
 *  - Reduced motion → renders a plain wrapper with no handlers or transform.
 */

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element pulls toward the cursor (0–1). */
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.22,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const wrapperClass = className ?? '';

  if (reduce) {
    return <div className={wrapperClass}>{children}</div>;
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={wrapperClass}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}