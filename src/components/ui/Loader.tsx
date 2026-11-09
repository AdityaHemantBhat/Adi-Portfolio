import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Premium smooth cubic bezier for high-end opening
const ease = [0.85, 0, 0.15, 1] as const;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading');
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const completionTimer = useRef<number | undefined>(undefined);
  const exiting = phase === 'exit' && !reduceMotion;

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      setPhase('exit');
      completionTimer.current = window.setTimeout(onComplete, 30);
      return;
    }

    // Animate progress smoothly from 0% all the way to 100%
    const duration = 1800; // 1.8s deliberate, smooth loading pace
    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Nice progressive ease for natural loader acceleration
      const eased = Math.pow(rawProgress, 1.2);
      setProgress(eased * 100);

      if (rawProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        // Full 100% reached! Brief pause at 100% so user sees completion before diagonal split
        window.setTimeout(() => {
          setPhase('exit');
          completionTimer.current = window.setTimeout(onComplete, 1250);
        }, 180);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animFrame);
      if (completionTimer.current !== undefined) window.clearTimeout(completionTimer.current);
    };
  }, [onComplete, reduceMotion]);

  return (
    <div
      id="global-preloader"
      className="fixed inset-0 z-[10000] overflow-hidden select-none pointer-events-none"
      role="status"
      aria-label="Loading portfolio"
    >
      {/*
        Top-Left Diagonal Shutter:
        Slides diagonally up-left after progress reaches 100%.
      */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#f5f5f5] will-change-transform"
        style={{
          clipPath: 'polygon(0% 0%, 102% 0%, 0% 102%)',
          WebkitClipPath: 'polygon(0% 0%, 102% 0%, 0% 102%)',
        }}
        initial={{ x: '0%', y: '0%' }}
        animate={exiting ? { x: '-102%', y: '-102%' } : { x: '0%', y: '0%' }}
        transition={{ duration: reduceMotion ? 0.01 : 1.25, ease }}
      />

      {/*
        Bottom-Right Diagonal Shutter:
        Slides diagonally down-right in symmetry.
      */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#f5f5f5] will-change-transform"
        style={{
          clipPath: 'polygon(100% 0%, 102% 0%, 102% 102%, 0% 102%)',
          WebkitClipPath: 'polygon(100% 0%, 102% 0%, 102% 102%, 0% 102%)',
        }}
        initial={{ x: '0%', y: '0%' }}
        animate={exiting ? { x: '102%', y: '102%' } : { x: '0%', y: '0%' }}
        transition={{ duration: reduceMotion ? 0.01 : 1.25, ease }}
      />

      {/* Text & Center Branding Layer */}
      <motion.div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-[#111]"
        initial={{ opacity: 1 }}
        animate={exiting ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: 'easeOut' }}
      >
        <div className="overflow-hidden">
          <motion.span
            className="block font-hero text-5xl uppercase leading-none tracking-[-0.03em] sm:text-7xl md:text-8xl text-neutral-900"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Aditya Bhat
          </motion.span>
        </div>

        <motion.div
          className="mt-6 flex w-52 sm:w-60 items-center justify-between text-[9px] uppercase tracking-[0.28em] text-black/50"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: 0.25 }}
        >
          <span>Design &amp; Code</span>
          <span className="font-mono tabular-nums text-black/70 font-medium">
            {Math.round(progress)}%
          </span>
        </motion.div>

        {/* Real 0% to 100% Progress Bar Track & Indicator */}
        <div className="mt-4 h-[2px] w-52 sm:w-60 bg-neutral-200 overflow-hidden rounded-full">
          <div
            className="h-full bg-neutral-900 transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      <span className="sr-only">Loading… {Math.round(progress)}%</span>
    </div>
  );
}
