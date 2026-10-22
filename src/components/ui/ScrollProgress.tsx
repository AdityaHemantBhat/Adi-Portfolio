import { motion, useScroll } from 'framer-motion';

/**
 * ScrollProgress — thin fixed top progress bar.
 *
 * Binds `scaleX` to overall page scroll progress using the transform-only
 * (GPU-composited) path. `mix-blend-difference` inverts automatically over
 * light vs dark sections, matching the Navbar idiom. Pure `scaleX` with
 * `transform-origin:left` — no layout writes, no reflow.
 */
export default function ScrollProgress({ thickness = 3 }: { thickness?: number }) {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[70] pointer-events-none bg-white mix-blend-difference origin-left"
      style={{ scaleX: scrollYProgress, height: thickness }}
    />
  );
}
