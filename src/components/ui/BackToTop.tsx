import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 w-14 h-14 md:w-16 md:h-16 bg-white text-black mix-blend-difference flex items-center justify-center rounded-full hover-target group overflow-hidden cursor-none outline-none focus:outline-none"
          aria-label="Scroll back to top"
        >
          {/* Default arrow */}
          <svg 
            width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="transform group-hover:-translate-y-16 transition-transform duration-[0.6s] ease-[cubic-bezier(0.76,0,0.24,1)] absolute"
          >
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {/* Hover arrow (slides in dynamically from bottom) */}
          <svg 
            width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="transform translate-y-16 group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.76,0,0.24,1)] absolute"
          >
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
