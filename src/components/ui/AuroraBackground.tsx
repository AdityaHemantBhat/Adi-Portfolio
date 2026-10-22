import { useRef, useMemo } from 'react';
import { useReducedMotion, useInView } from 'framer-motion';

/**
 * AuroraBackground — animated grayscale gradient blobs.
 *
 * Renders three large, heavily-blurred radial gradients that slowly drift and
 * breathe. It is fully monochrome (grays only) to preserve the site identity.
 *
 * Correctness (the "right" way):
 *  - Animation is pure CSS keyframes touching ONLY transform + opacity, so the
 *    work is GPU-composited (blur is baked once by the rasterizer, never
 *    animated per-frame).
 *  - The layer is `pointer-events-none` so it never swallows the hero's mouse
 *    parallax or the custom-cursor hover logic.
 *  - `useInView` pauses the CSS animation until the section is on screen.
 *  - Reduced motion: the CSS media block already freezes the keyframes; we also
 *    render a soft static wash so the hero/CTA aren't empty.
 */

const BLOBS = [
  {
    className: 'animate-aurora w-[60vw] h-[60vw] -top-[15%] -left-[10%]',
    bg: 'radial-gradient(ellipse at center, rgba(0,0,0,0.10), rgba(0,0,0,0) 70%)',
  },
  {
    className: 'animate-aurora-b w-[45vw] h-[45vw] -bottom-[20%] -right-[8%]',
    bg: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08), rgba(0,0,0,0) 70%)',
  },
  {
    className: 'animate-aurora-c w-[40vw] h-[40vw] top-[20%] right-[5%]',
    bg: 'radial-gradient(ellipse at center, rgba(0,0,0,0.06), rgba(0,0,0,0) 70%)',
  },
];

interface AuroraBackgroundProps {
  className?: string;
  /** Tint blobs white for dark sections (default keeps grayscale on light). */
  mode?: 'dark' | 'light';
}

export default function AuroraBackground({
  className = '',
  mode,
}: AuroraBackgroundProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });

  // Static single wash under reduced motion (blobs still present, not animated).
  const animated = !reduce && inView;

  const blobs = useMemo(() => {
    const tint = mode === 'dark'
      ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%)'
      : null;
    return BLOBS.map((b) => ({ ...b, bg: tint ?? b.bg }));
  }, [mode]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[90px] ${b.className}`}
          style={{
            background: b.bg,
            animationPlayState: animated ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}