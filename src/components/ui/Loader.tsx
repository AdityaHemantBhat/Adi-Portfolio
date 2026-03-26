import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEVELOPER_STEPS = [
    "Designing",
    "Coding",
    "Building",
    "Architecture",
    "Innovation",
];

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (stepIndex === DEVELOPER_STEPS.length - 1) {
            // End of steps, start the door exit after 1s
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(onComplete, 1200); // Door duration
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Iterate through developer keywords slowly
            const timer = setTimeout(() => {
                setStepIndex(prev => prev + 1);
            }, 800); // 0.8s per word for a premium slowly feel
            return () => clearTimeout(timer);
        }
    }, [stepIndex, onComplete]);

    return (
        <div id="global-preloader" className="fixed inset-0 z-[10000] overflow-hidden pointer-events-none">
            {/* 
              SOLID BACKGROUND 
              Initially covers everything. Does not use clip-path, so no diagonal lines can ever appear.
              Only fades out slightly or is hidden once the split doors take over during exit.
            */}
            {!isExiting && (
                <div className="absolute inset-0 bg-[#0a0a0a] z-0" />
            )}

            {/* Top Right Door */}
            {isExiting && (
                <motion.div
                    className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden z-10"
                    style={{ clipPath: 'polygon(-1% -1%, 101% -1%, 101% 101%)' }}
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: '100%', y: '-100%' }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                />
            )}

            {/* Bottom Left Door */}
            {isExiting && (
                <motion.div
                    className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden z-10"
                    style={{ clipPath: 'polygon(-1% -1%, 101% 101%, -1% 101%)' }}
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: '-100%', y: '100%' }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                />
            )}

            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <AnimatePresence mode="wait">
                    {!isExiting && (
                        <motion.div
                            key={DEVELOPER_STEPS[stepIndex]}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                            className="flex flex-col items-center"
                        >
                            <h1 className="font-display text-[12vw] md:text-[10vw] leading-none tracking-tighter uppercase text-white">
                                {DEVELOPER_STEPS[stepIndex]}
                            </h1>
                            {/* Visual indicator (replacing bar) */}
                            <div className="mt-8 flex gap-2">
                                {DEVELOPER_STEPS.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === stepIndex ? 'bg-white scale-125' : 'bg-white/20'}`} 
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
