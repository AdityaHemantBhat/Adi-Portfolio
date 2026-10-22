import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * SvgMorph — flagship decorative SVG path-morph.
 *
 * Cycles a `path d` through an array of shapes. Framer-motion interpolates the
 * `d` string token-by-token, so EVERY path in the array MUST share identical
 * command structure (same count/order of `M`/`C`/`Z`, same pairs per segment).
 * Mismatched structures cause a hard jump instead of a smooth morph.
 *
 * Correctness notes (the "right" way):
 *  - We advance an index in `onAnimationComplete` (no `repeat`), so each leg
 *    resolves then the next `d` is animated to — reliable multi-shape cycling.
 *  - Under reduced motion we render a static first shape; the global CSS
 *    reduced-motion block does NOT stop a Framer JS animation, so we gate it.
 *  - Decorative only: `aria-hidden` + `role="presentation"`.
 */

// All blobs share the skeleton: M + 5 C + Z  (same command count everywhere)
export const MORPH_BLOBS: string[] = [
  'M 200 65 C 250 40 300 85 318 140 C 336 195 318 262 275 305 C 232 348 168 348 125 305 C 82 262 64 195 82 140 C 100 85 150 40 200 65 Z',
  'M 210 80 C 260 30 330 70 350 150 C 365 225 315 300 260 330 C 205 360 140 340 100 290 C 55 235 40 130 95 90 C 150 50 165 130 210 80 Z',
  'M 200 100 C 255 45 340 80 345 160 C 350 245 300 320 240 335 C 175 350 110 330 80 265 C 45 195 60 110 120 75 C 180 40 150 155 200 100 Z',
  'M 160 90 C 90 80 50 140 60 205 C 70 270 130 320 205 330 C 280 340 350 300 355 230 C 360 155 310 90 240 80 C 210 76 190 95 160 90 Z',
];

// Wide, flattened divider wave — both share the skeleton: M + 3 C
export const MORPH_DIVIDER: string[] = [
  'M 0 50 C 50 20 100 80 150 45 C 200 10 250 90 300 50 C 330 30 370 60 400 45',
  'M 0 50 C 50 85 100 15 150 55 C 200 95 250 5 300 55 C 330 75 370 35 400 45',
];

interface SvgMorphProps {
  /** Compatible `d` strings — must share identical command structure. */
  paths: string[];
  className?: string;
  style?: React.CSSProperties;
  /** Morph duration per leg in seconds. */
  duration?: number;
  viewBox?: string;
  preserveAspectRatio?: string;
  /** Filled blob (default) vs stroked outline. */
  fill?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export default function SvgMorph({
  paths,
  className,
  style,
  duration = 9,
  viewBox = '0 0 400 400',
  preserveAspectRatio = 'xMidYMid slice',
  fill = true,
  fillColor = '#111',
  fillOpacity = 1,
  strokeColor = 'currentColor',
  strokeWidth = 1,
  strokeOpacity = 1,
}: SvgMorphProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const commonProps = {
    fill: fill ? fillColor : 'none',
    fillOpacity: fill ? fillOpacity : undefined,
    stroke: fill ? 'none' : strokeColor,
    strokeWidth: fill ? undefined : strokeWidth,
    strokeOpacity: fill ? undefined : strokeOpacity,
    vectorEffect: fill ? undefined : ('non-scaling-stroke' as const),
  };

  return (
    <svg
      className={className}
      style={style}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      role="presentation"
    >
      {reduce ? (
        <path d={paths[0]} {...commonProps} />
      ) : (
        <motion.path
          d={paths[index]}
          {...commonProps}
          animate={{ d: paths[index] }}
          transition={{ duration, ease: 'easeInOut' }}
          onAnimationComplete={() => setIndex((i) => (i + 1) % paths.length)}
        />
      )}
    </svg>
  );
}
