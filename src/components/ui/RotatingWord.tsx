import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * RotatingWord — cycles through a list of words with a masked slide + blur swap.
 * Used for a live "role" in headings ("…and I'm a {Full Stack Developer}").
 *
 * Correctness (the "right" way):
 *  - `AnimatePresence mode="wait"` ensures one word at a time (no overlap).
 *  - `aria-live="polite"` so screen readers hear the changing word.
 *  - Reduced motion → renders the first word statically (no interval).
 */
interface RotatingWordProps {
  words: string[];
  interval?: number;
  className?: string;
}

export default function RotatingWord({
  words,
  interval = 2400,
  className,
}: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || words.length <= 1) return;
    const t = setInterval(() => setIndex((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval, reduce]);

  return (
    <span className={className} aria-live="polite" style={{ position: 'relative' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}