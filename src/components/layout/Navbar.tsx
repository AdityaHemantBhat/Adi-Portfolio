import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // ── "Crazy" Autonomous Scatter & Snap Looping Name Effect ──
  const nameRef = useRef<HTMLAnchorElement>(null);
  const name = "ADITYA BHAT";
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!nameRef.current) return;
    
    const letters = nameRef.current.querySelectorAll('.name-letter');
    let floatTweens: gsap.core.Tween[] = [];
    let cycleTimeout: NodeJS.Timeout;

    const startChaos = () => {
      // Randomly scatter letters infinitely
      letters.forEach((letter) => {
        const dur = gsap.utils.random(1.5, 3);
        const t = gsap.to(letter, {
          x: () => gsap.utils.random(-25, 25),
          y: () => gsap.utils.random(-20, 20),
          rotationZ: () => gsap.utils.random(-35, 35),
          rotationY: () => gsap.utils.random(-50, 50),
          duration: dur,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        floatTweens.push(t);
      });
      
      // Wait 4 seconds of chaos before snapping together
      cycleTimeout = setTimeout(pauseChaos, 4000);
    };

    const pauseChaos = () => {
      // 1. Kill the infinite wobbles
      floatTweens.forEach(t => t.kill());
      floatTweens = [];
      
      // 2. Violently snap back to a perfect legible row
      gsap.to(letters, {
        x: 0,
        y: 0,
        rotationZ: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.4)",
        stagger: 0.02
      });

      // 3. Wait 3 seconds holding the readable name before exploding again
      cycleTimeout = setTimeout(startChaos, 1000);
    };

    if (!isHovered) {
      // Begin the autonomous cycle
      startChaos();
    } else {
      // Force instant perfect sync as long as cursor is hovering over the name
      gsap.killTweensOf(letters);
      gsap.to(letters, {
        x: 0,
        y: 0,
        rotationZ: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "elastic.out(1.2, 0.4)",
        stagger: 0.02
      });
    }

    return () => {
      // Complete robust cleanup prevents memory leaks and visual ghosting
      floatTweens.forEach(t => t.kill());
      clearTimeout(cycleTimeout);
    };
  }, [isHovered]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-difference text-white" aria-label="Main navigation">
        
        {/* Wild Floating Name Re-assembled On Hover */}
        <Link 
          to="/" 
          ref={nameRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="font-display tracking-[0.1em] text-2xl md:text-3xl uppercase hover-target flex z-50 p-2 -m-2"
          style={{ perspective: '800px' }}
        >
          {name.split('').map((char, i) => (
            <span 
              key={i} 
              className="name-letter inline-block origin-center will-change-transform"
              style={{ minWidth: char === ' ' ? '0.4em' : 'auto' }}
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
            className="fixed inset-0 z-40 bg-accent text-white flex flex-col justify-center items-center"
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
