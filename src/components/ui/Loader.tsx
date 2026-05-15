import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'balls' | 'exit'>('balls');

  useEffect(() => {
    // Let the balls animate for 3 cycles (~3s), then trigger exit
    const timer = setTimeout(() => {
      setPhase('exit');
      setTimeout(onComplete, 1000); // curtain duration
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="global-preloader"
      className="fixed inset-0 z-[10000] overflow-hidden"
      style={{ pointerEvents: phase === 'exit' ? 'none' : 'auto' }}
    >
      {/* ── Exit: Two halves split apart like the balls detaching ── */}
      {phase === 'exit' ? (
        <>
          {/* Left half slides left */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-white z-10"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Right half slides right */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-white z-10"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

        </>
      ) : (
        <>
          {/* ── Solid background ── */}
          <div className="absolute inset-0 bg-white z-0" />

          {/* ── Center: Ball loader ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-12">
            {/* The two-ball loader */}
            <div className="loader" aria-hidden="true" />

            {/* Subtle name below */}
            <div className="flex flex-col items-center gap-3">
              <span className="font-hero text-xl md:text-2xl tracking-[0.3em] text-black/70 uppercase">
                Aditya Bhat
              </span>
              <span className="font-sans text-[9px] md:text-[10px] tracking-[0.5em] text-black/25 uppercase">
                Portfolio
              </span>
            </div>
          </div>


        </>
      )}

      {/* ── Inline styles for the ball animation ── */}
      <style>{`
        .loader {
          width: 130px;
          display: grid;
          --mask:
            radial-gradient(24px at left 30px top 50%, #0000 95%, #000),
            radial-gradient(24px at right 30px top 50%, #0000 95%, #000);
          -webkit-mask: var(--mask);
          mask: var(--mask);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
          animation: l1 1s infinite alternate ease-in-out;
        }
        .loader::before,
        .loader::after {
          content: "";
          grid-area: 1/1;
          height: 60px;
          aspect-ratio: 1;
          background: #111;
          border-radius: 50%;
        }
        .loader::after {
          margin-left: auto;
        }
        @keyframes l1 {
          to {
            width: 75px;
          }
        }
      `}</style>
    </div>
  );
}
