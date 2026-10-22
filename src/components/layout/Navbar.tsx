import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // ── One-time name reveal on load ──
  const nameRef = useRef<HTMLAnchorElement>(null);
  const name = "ADITYA BHAT";
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!nameRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const letters = nameRef.current.querySelectorAll('.name-letter');
    
    // Start hidden, then stagger-reveal each letter sliding up
    gsap.fromTo(letters,
      { y: 20, opacity: 0, rotationX: -90 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.04,
        delay: 3.2, // sync with loader exit
      }
    );
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 md:px-12 md:pt-[max(2rem,env(safe-area-inset-top))] md:pb-8 flex justify-between items-center mix-blend-difference text-white" aria-label="Main navigation">
        
        {/* Name with one-time reveal */}
        <Link 
          to="/" 
          ref={nameRef}
          className="font-display tracking-[0.1em] text-2xl md:text-3xl uppercase hover-target flex z-50 p-2 -m-2"
          style={{ perspective: '800px' }}
        >
          {name.split('').map((char, i) => (
            <span 
              key={i} 
              className="name-letter inline-block origin-center will-change-transform"
              style={{ minWidth: char === ' ' ? '0.4em' : 'auto', opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 font-sans text-sm uppercase tracking-widest font-semibold">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover-target relative overflow-hidden group ${
                location.pathname === link.path ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              } transition-opacity duration-300`}
              aria-current={location.pathname === link.path ? 'page' : undefined}
            >
              <span className="block group-hover:-translate-y-full transition-transform duration-300 ease-in-out">
                {link.name}
              </span>
              <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" aria-hidden="true">
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden hover-target z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -4 }}
            className="absolute w-6 h-0.5 bg-white transition-all"
          />
          <motion.div
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 4 }}
            className="absolute w-6 h-0.5 bg-white transition-all"
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-accent text-white flex flex-col justify-center items-center pt-safe pb-safe"
          >
            <nav className="flex flex-col gap-8 text-center" aria-label="Mobile navigation">
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-5xl sm:text-7xl uppercase tracking-tight hover:text-neutral-400 transition-colors"
                    aria-current={location.pathname === link.path ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
