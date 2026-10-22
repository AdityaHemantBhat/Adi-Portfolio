import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

/**
 * ScrollText — scroll-driven word-by-word reveal.
 *
 * As the quote passes through the viewport, words progressively fill in
 * (opacity 0.12 → 1) left-to-right — a modern generative-type effect.
 *
 * Correctness (the "right" way):
 *  - Each word's `useTransform` lives in a child `Word` component so the
 *    parent's hook count stays fixed (no hooks-in-`.map` violations).
 *  - We animate `opacity` only (compositor-friendly), never per-word filters.
 *  - The `target` is the paragraph itself and the component must be mounted
 *    OUTSIDE GSAP-pinned regions (a pinned wrapper moves the element, which
 *    breaks offset measurement). The testimonial is a plain `fade-up` section.
 *  - The trailing space lives in a static (non-inline-block) wrapper for even
 *    word spacing; reduced motion renders fully-visible static text.
 */

interface ScrollTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  /** Fraction of progress reserved to stagger the tail of each word window. */
  staggerLR?: number;
  /** Scroll offsets: paragraph start/end vs viewport. */
  start?: string;
  end?: string;
}

function wordRange(i: number, total: number, staggerLR: number): [number, number] {
  const head = (i / total) * (1 - staggerLR);
  const tail = ((i + 1) / total) * (1 - staggerLR) + staggerLR;
  return [head, Math.min(1, tail)];
}

function Word({
  word,
  index,
  total,
  progress,
  staggerLR,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  staggerLR: number;
}) {
  const opacity = useTransform(
    progress,
    wordRange(index, total, staggerLR),
    [0.12, 1],
  );
  return (
    <>
      {' '}
      <motion.span className="inline-block" style={{ opacity }}>
        {word}
      </motion.span>
    </>
  );
}

export default function ScrollText({
  text,
  as: Tag = 'p',
  className,
  staggerLR = 0.15,
  start = 'start 0.9',
  end = 'end 0.45',
}: ScrollTextProps) {
  const reduce = useReducedMotion();
  // Ref for a polymorphic tag + a scroll target; a loose type keeps both clean.
  const ref = useRef<any>(null);

  // Hook is only evaluated when we actually drive the animation.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [start, end],
  });

  if (reduce) {
    const RTag = Tag as React.ElementType;
    return (
      <RTag ref={ref} className={className}>
        {text}
      </RTag>
    );
  }

  const MTag = Tag as React.ElementType;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <MTag ref={ref} className={className}>
      {words.map((w, i) => (
        <Word
          key={`${i}-${w}`}
          word={w}
          index={i}
          total={words.length}
          progress={scrollYProgress}
          staggerLR={staggerLR}
        />
      ))}
    </MTag>
  );
}
