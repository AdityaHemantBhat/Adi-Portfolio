import { useId, useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * AnimatedText — 2026 split-type reveal.
 *
 * Reveals `text` word / char / line at a time, each unit rising out of an
 * `overflow:hidden` mask with an optional blur → 0. Stagger composes via Framer
 * variants so the parent container drags its children with `staggerChildren`.
 *
 * Correctness (the "right" way):
 *  - Decorative mask spans are `aria-hidden`; the real text is provided once on
 *    the wrapper so screen readers read it cleanly.
 *  - Masks get a small bottom padding so descenders (g/y/p/Q) don't clip.
 *  - Reduced motion → static text, no JS animation (the global CSS block can't
 *    stop a Framer JS animation, so we gate it here).
 */

type Mode = 'words' | 'chars' | 'lines';

interface AnimatedTextProps {
  text: string;
  as?: React.ElementType;
  mode?: Mode;
  stagger?: number;
  delay?: number;
  once?: boolean;
  blur?: boolean;
  className?: string;
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const unitVariants = (blur: boolean): Variants => ({
  hidden: { y: '115%', ...(blur ? { filter: 'blur(6px)' } : {}) },
  show: {
    y: '0%',
    ...(blur ? { filter: 'blur(0px)' } : {}),
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
});

function splitUnits(text: string, mode: Mode): string[] {
  if (mode === 'lines') return text.split('\n');
  const words = text.split(/\s+/).filter(Boolean);
  if (mode === 'chars') return text.split('');
  return words;
}

export default function AnimatedText({
  text,
  as: Tag = 'p',
  mode = 'words',
  stagger = 0.06,
  delay = 0,
  once = true,
  blur = true,
  className,
}: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const id = useId();
  const units = splitUnits(text, mode);
  const isWord = mode === 'words';

  // Memoize the polymorphic motion component so a parent re-render doesn't
  // recreate the component identity and reset the in-play reveal.
  const MotionTag = useMemo(() => motion(Tag as React.ElementType), [Tag]);

  // Reduced motion → plain, fully-visible text without any mask/motion wrapping.
  if (reduce) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {text}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      aria-label={text}
    >
      {units.map((unit, i) => {
        const separator =
          isWord && i < units.length - 1 ? <span>&nbsp;</span> : null;
        return (
          <span
            key={`${id}-${i}`}
            className="inline-block overflow-hidden align-top"
            style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
            aria-hidden="true"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={unitVariants(blur)}
            >
              {unit}
              {separator}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
