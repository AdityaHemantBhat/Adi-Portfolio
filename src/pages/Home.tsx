import { useEffect, useRef, useState, lazy, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';

gsap.registerPlugin(ScrollTrigger);

// Memoized FAQ item to avoid hooks-in-map issue and prevent rerenders
const FAQItem = memo(({ faq, index }: { faq: { q: string; a: string }; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex cursor-pointer items-center justify-between py-6 font-display text-2xl uppercase tracking-tight text-left hover-target"
        aria-expanded={isOpen}
        id={`faq-button-${index}`}
        aria-controls={`faq-panel-${index}`}
      >
        {faq.q}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="text-3xl font-light"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-button-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-8 font-sans text-neutral-600 leading-relaxed text-lg max-w-2xl">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Tech stack data defined outside component to avoid recreation
const techStack = [
  { name: 'React.js', icon: 'react/react-original' },
  { name: 'Node.js', icon: 'nodejs/nodejs-original' },
  { name: 'Express.js', icon: 'express/express-original' },
  { name: 'MongoDB', icon: 'mongodb/mongodb-original' },
  { name: 'HTML5/CSS3', icon: 'html5/html5-original' },
  { name: 'JavaScript', icon: 'javascript/javascript-original' },
  { name: 'TypeScript', icon: 'typescript/typescript-original' },
  { name: 'PostgreSQL', icon: 'postgresql/postgresql-original' },
  { name: 'CodeIgniter', icon: 'codeigniter/codeigniter-plain' },
  { name: 'PHP', icon: 'php/php-original' },
  { name: 'WordPress', icon: 'wordpress/wordpress-plain' },
  { name: 'Drupal', icon: 'drupal/drupal-original' },
  { name: 'Git', icon: 'git/git-original' },
  { name: 'GitHub', icon: 'github/github-original' },
];

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const experiences = [
  {
    year: '2025 — Present',
    role: 'Software Developer',
    description: 'Building scalable web solutions and custom UI logic with a strict focus on accessibility (WCAG/GIGW) for complex WordPress and Drupal projects. Experienced in full-stack architecture, seamlessly bridging CodeIgniter PHP integrations with modern high-performance MERN stack environments. Specializing in deploying robust APIs, secure database management, and delivering highly responsive user experiences.'
  },
  {
    year: '2024 — 2025',
    role: 'Junior Web Developer',
    description: 'Handled website redesigns, JavaScript based features, and plugin customization for client projects.'
  },
  {
    year: '2021 — 2022',
    role: 'Freelance Web Designer & Developer',
    description: 'Delivered websites, landing pages, and UI components based on client requirements and research.'
  }
];

const services = [
  { title: 'Frontend Development', desc: 'Building responsive, interactive, and highly performant user interfaces.' },
  { title: 'Backend Architecture', desc: 'Designing scalable APIs, microservices, and robust server-side logic.' },
  { title: 'Database Design', desc: 'Structuring data efficiently with SQL and NoSQL databases.' },
];

const faqs = [
  { q: 'What tech stack do you specialize in?', a: 'I primarily work with React, Node.js, TypeScript, PostgreSQL, and AWS, but I adapt to project needs.' },
  { q: 'Do you handle both frontend and backend?', a: 'Yes, I build end-to-end solutions, from pixel-perfect UIs to robust server-side APIs and databases.' },
  { q: 'How do you ensure application security?', a: 'I implement best practices like input validation, secure authentication (OAuth/JWT), and regular vulnerability audits.' },
  { q: 'Can you scale an existing application?', a: 'Absolutely. I specialize in refactoring legacy codebases, optimizing database queries, and setting up scalable cloud infrastructure.' },
];

export default function Home() {
  const { projects } = useProjectContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [hoveredText, setHoveredText] = useState<'full' | 'software' | null>(null);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 400, mass: 0.5 };

  // Image & Mask movement (subtle)
  const targetImgX = useTransform(mouseX, v => v / -35);
  const targetImgY = useTransform(mouseY, v => v / -35);
  const springImgX = useSpring(targetImgX, springConfig);
  const springImgY = useSpring(targetImgY, springConfig);

  // Compensation transform so foreground text remains perfectly static on the screen
  // Since its parent container moves, we apply the exact opposite movement.
  const maskTextX = useTransform(springImgX, v => -v);
  const maskTextY = useTransform(springImgY, v => -v);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center of the image (multiplied to create parallax limit)
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleImageMouseLeave = () => {
    // Smoothly return to center when mouse leaves the image
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    // ── Preloader Sync Mechanism ──
    // Determine dynamic GSAP delay by checking if the Global Loader is currently natively visible.
    const loaderExists = document.getElementById('global-preloader');
    
    // If the Loader is active (during hard refresh), manually delay the Hero sequence exactly 4.8 seconds.
    // This perfectly snaps the "Webdesign" & "Fullstack" text wipe so it happens physically AFTER 
    // the black diagonal doors explicitly unlatch and pull completely apart.
    const initialDelay = loaderExists ? 4.8 : 0.2; 

    // GSAP animations for sections
    const ctx = gsap.context(() => {
      // Dynamic delay based on whether the site is freshly launching vs routing
      const tl = gsap.timeline({ delay: initialDelay, defaults: { ease: 'power3.out' } });

      // PREMIUM CINEMATIC OPENING
      tl.fromTo('.hero-img',
        { scale: 1.1, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { scale: 1, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.8, ease: 'expo.inOut', immediateRender: true }
      )
        // LINE 1: WEBDESIGNER (Background fully animated)
        .fromTo('.z-0 .hero-text-1',
          { x: '-15vw', y: 60, rotationY: -35, rotationZ: -4, scale: 1.15, opacity: 0, filter: 'blur(20px)', transformPerspective: 1200 },
          { x: 0, y: 0, rotationY: 0, rotationZ: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2.0, ease: 'expo.out', immediateRender: true },
          "-=1.0" // Triggers explosively as diagonal doors clear
        )
        // LINE 1: WEBDESIGNER (Foreground ONLY animates position, preserving React opacity state)
        .fromTo('.z-20 .hero-text-1',
          { x: '-15vw', y: 60, rotationY: -35, rotationZ: -4, scale: 1.15, filter: 'blur(20px)', transformPerspective: 1200 },
          { x: 0, y: 0, rotationY: 0, rotationZ: 0, scale: 1, filter: 'blur(0px)', duration: 2.0, ease: 'expo.out', immediateRender: true },
          "<"
        )
        // LINE 2: FULL STACK DEVELOPER (Background fully animated)
        .fromTo('.z-0 .hero-text-2',
          { x: '15vw', y: 60, rotationY: 35, rotationZ: 4, scale: 1.15, opacity: 0, filter: 'blur(20px)', transformPerspective: 1200 },
          { x: 0, y: 0, rotationY: 0, rotationZ: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2.0, ease: 'expo.out', immediateRender: true },
          "<0.15" // Extremely tight staggering for heavy impact sequence
        )
        // LINE 2: FULL STACK DEVELOPER (Foreground ONLY animates position, preserving React opacity state)
        .fromTo('.z-20 .hero-text-2',
          { x: '15vw', y: 60, rotationY: 35, rotationZ: 4, scale: 1.15, filter: 'blur(20px)', transformPerspective: 1200 },
          { x: 0, y: 0, rotationY: 0, rotationZ: 0, scale: 1, filter: 'blur(0px)', duration: 2.0, ease: 'expo.out', immediateRender: true },
          "<"
        )
        // SECONDARY UI ELEMENTS (TOP/BOTTOM NAV)
        .fromTo(['.hero-top-text', '.hero-bottom-text', '.hero-buttons'],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out', immediateRender: true },
          "-=0.8"
        );

      // Scroll animations for other sections
      gsap.utils.toArray('.fade-up').forEach((el: any) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            }
          }
        );
      });

      // Horizontal scroll section
      const horizontalSection = document.querySelector('.horizontal-scroll');
      const horizontalContainer = document.querySelector('.horizontal-container');

      if (horizontalSection && horizontalContainer) {
        const getScrollAmount = () => {
          let horizontalWidth = horizontalSection.scrollWidth;
          return -(horizontalWidth - window.innerWidth);
        };

        const tween = gsap.to(horizontalSection, {
          x: getScrollAmount,
          ease: 'none',
        });

        ScrollTrigger.create({
          trigger: horizontalContainer,
          start: 'top top',
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true,
        });
      }

      // ── Cinematic 3D Card Rise Reveal (Buttery Smooth Hardware Accelerated) ──
      const expRevealWrapper = document.querySelector('.experience-reveal-wrapper');
      if (expRevealWrapper) {
        // Start the card pushed down just a little bit, tilted back, and rounded
        gsap.set('.experience-inner', { 
          y: '25vh',
          rotationX: 25,
          scale: 0.9,
          transformOrigin: '50% 100%',
          borderTopLeftRadius: '60px',
          borderTopRightRadius: '60px',
        });
        gsap.set('.exp-content-reveal', { opacity: 0, y: 60 });
        gsap.set('.exp-item', { opacity: 0, y: 40 });

        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: expRevealWrapper,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 1.2, // Silky smooth scrubbing
          },
        });

        // Step 1: Card surges upwards, swinging flat into the screen
        revealTl.to('.experience-inner', {
          y: '0vh',
          rotationX: 0,
          scale: 1,
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          ease: 'power2.inOut',
          duration: 1
        })
        // Step 2: Content softly glides up
        .to('.exp-content-reveal', {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, "-=0.3")
        .to('.exp-item', {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out'
        }, "-=0.2");
      }

      // Parallax images
      gsap.utils.toArray('.parallax-img').forEach((img: any) => {
        gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            scrub: true,
          },
        });
      });

      // ── Cinematic 3D Deck Stack Reveal (Services) ──
      const stackWrapper = document.querySelector('.services-container');
      if (stackWrapper) {
        const cards = Array.from(document.querySelectorAll('.service-stack-card'));
        const overlays = Array.from(document.querySelectorAll('.service-stack-card .dark-overlay'));
        
        // Initial setup: cards hidden deep below the fold in 3D perspective
        gsap.set(cards, { y: '120vh', rotationX: 15, scale: 0.8 });

        const stackTl = gsap.timeline({
          scrollTrigger: {
            trigger: stackWrapper,
            start: 'top top',
            end: '+=400%', // 400% scrub distance creates a massive, luxurious scrolling sequence
            pin: true,
            scrub: 1, // Smooth butter
          }
        });

        // 1. First card surfaces and flattens
        stackTl.to(cards[0], { y: '0vh', rotationX: 0, scale: 1, duration: 1.5, ease: 'power3.out' })
               .to({}, { duration: 0.3 }) // Slight pause

        // 2. First card is pushed physically backward into Z-space; second card flies up over it
               .to(cards[0], { scale: 0.9, y: '-5vh', duration: 1.5, ease: 'power3.inOut' })
               .to(overlays[0], { opacity: 0.5, duration: 1.5, ease: 'power3.inOut' }, "<")
               .to(cards[1], { y: '0vh', rotationX: 0, scale: 1, duration: 1.5, ease: 'power3.out' }, "<")
               .to({}, { duration: 0.3 }) // Slight pause

        // 3. Both inner cards compress further backwards; third card flies up sealing the stack
               .to(cards[0], { scale: 0.8, y: '-10vh', duration: 1.5, ease: 'power3.inOut' })
               .to(overlays[0], { opacity: 0.7, duration: 1.5, ease: 'power3.inOut' }, "<")
               .to(cards[1], { scale: 0.9, y: '-5vh', duration: 1.5, ease: 'power3.inOut' }, "<")
               .to(overlays[1], { opacity: 0.5, duration: 1.5, ease: 'power3.inOut' }, "<")
               .to(cards[2], { y: '0vh', rotationX: 0, scale: 1, duration: 1.5, ease: 'power3.out' }, "<")
               
               .to({}, { duration: 0.5 }); // Final hold let the user admire the stack before unpinning
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#f8f8f8]" aria-label="Hero introduction">

        {/* Top Text */}
        <div className="hero-top-text absolute top-24 md:top-32 left-0 w-full flex justify-center z-20" style={{ opacity: 0 }}>
          <p className="font-sans text-lg md:text-2xl text-neutral-800 font-light">
            👋 , my name is Aditya and I am a Developer
          </p>
        </div>

        {/* Main Content Container */}
        <div className="relative w-full max-w-[100vw] mx-auto min-h-[85vh] flex flex-col items-center justify-center mt-12 md:mt-16 h-full overflow-visible">

          <div className="relative w-full h-full min-h-[800px] flex items-center justify-center">

            {/* LAYER 1: Background Layer (Centred) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none w-full">
              <div className="flex flex-col items-center justify-center w-full">

                {/* Webdesigner Background - Dual Layer */}
                <div className="hero-text-1 relative w-full flex justify-center group" style={{ opacity: 0 }}>
                  <h1 className="font-hero text-[16vw] leading-[0.85] w-full text-center whitespace-nowrap pointer-events-auto cursor-none hover-target transition-opacity duration-500 subpixel-antialiased"
                    style={{
                      WebkitTextFillColor: '#111',
                      opacity: hoveredText === 'software' ? 0 : 1,
                      paintOrder: 'stroke fill',
                      textRendering: 'optimizeLegibility'
                    }}
                    onMouseEnter={() => setHoveredText('full')}
                    onMouseLeave={() => setHoveredText(null)}
                  >
                    Webdesigner
                  </h1>
                  <h1 className="absolute inset-0 font-hero text-[16vw] leading-[0.85] w-full text-center whitespace-nowrap pointer-events-none transition-opacity duration-500 subpixel-antialiased"
                    style={{
                      WebkitTextFillColor: 'transparent',
                      WebkitTextStroke: '1.5px #111',
                      opacity: hoveredText === 'software' ? 1 : 0,
                      paintOrder: 'stroke fill',
                      textRendering: 'optimizeLegibility'
                    }}
                    aria-hidden="true"
                  >
                    Webdesigner
                  </h1>
                </div>

                {/* FullStack Background - Dual Layer */}
                <div className="hero-text-2 relative w-full flex justify-center mt-6 md:mt-8 group" style={{ opacity: 0 }}>
                  <h1 className="font-hero text-[10vw] leading-[0.85] text-center whitespace-nowrap pointer-events-auto cursor-none hover-target transition-opacity duration-500 subpixel-antialiased"
                    style={{
                      WebkitTextFillColor: '#111',
                      opacity: hoveredText === 'software' ? 1 : 0,
                      paintOrder: 'stroke fill',
                      textRendering: 'optimizeLegibility'
                    }}
                    onMouseEnter={() => setHoveredText('software')}
                    onMouseLeave={() => setHoveredText(null)}
                  >
                    & Full Stack Developer
                  </h1>
                  <h1 className="absolute inset-0 font-hero text-[10vw] leading-[0.85] text-center whitespace-nowrap pointer-events-none transition-opacity duration-500 subpixel-antialiased"
                    style={{
                      WebkitTextFillColor: 'transparent',
                      WebkitTextStroke: '1.5px #111',
                      opacity: hoveredText === 'software' ? 0 : 1,
                      paintOrder: 'stroke fill',
                      textRendering: 'optimizeLegibility'
                    }}
                    aria-hidden="true"
                  >
                    & Full Stack Developer
                  </h1>
                </div>
              </div>
            </div>

            {/* UNIFIED STACK (Layers 2 & 3 Locked Together - Static) */}
            <div className="hero-img absolute inset-0 z-10 pointer-events-none"
              style={{ opacity: 0 }}>

              <motion.div style={{ x: springImgX, y: springImgY }} className="absolute inset-0 w-full h-full">

                {/* LAYER 2: THE HERO IMAGE */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div 
                    className="w-[85vw] max-w-[650px] relative pointer-events-auto flex justify-center"
                    onMouseMove={handleImageMouseMove}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                    src="/images/profile.webp"
                    alt="Aditya Bhat - Full Stack Developer"
                    width={550}
                    height={688}
                      fetchPriority="high"
                      className="w-full h-auto object-contain grayscale transition-all duration-700 hover:grayscale-0 cursor-none hover-target relative z-10"
                      style={{
                      maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                  />
                </div>
              </div>

              {/* LAYER 3: Masked Foreground Outline */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none w-full"
                style={{
                  maskImage: 'url(/images/profile.webp)',
                  WebkitMaskImage: 'url(/images/profile.webp)',
                  maskSize: 'clamp(300px, 85vw, 550px) auto',
                  WebkitMaskSize: 'clamp(300px, 85vw, 550px) auto',
                  maskPosition: 'center center',
                  maskRepeat: 'no-repeat'
                }}
                aria-hidden="true"
              >
                <motion.div style={{ x: maskTextX, y: maskTextY }} className="flex flex-col items-center justify-center w-full">
                  <h1 className="hero-text-1 font-hero text-[16vw] leading-[0.85] w-full text-center whitespace-nowrap text-transparent antialiased"
                    style={{
                      WebkitTextStroke: '2px white',
                      opacity: hoveredText === 'software' ? 0 : 1,
                      transition: 'opacity 0.4s ease-out'
                    }}>
                    Webdesigner
                  </h1>
                  <h1 className="hero-text-2 font-hero text-[10vw] leading-[0.85] text-center mt-6 md:mt-8 whitespace-nowrap text-transparent antialiased"
                    style={{
                      WebkitTextStroke: '2px white',
                      opacity: hoveredText === 'software' ? 1 : 0,
                      transition: 'opacity 0.4s ease-out'
                    }}>
                    & Full Stack Developer
                  </h1>
                </motion.div>
              </div>

              </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom Elements */}
        <div className="hero-bottom-text absolute bottom-8 md:bottom-12 left-6 md:left-12 z-20" style={{ opacity: 0 }}>
          <p className="font-sans text-xl md:text-3xl text-neutral-800 font-light">
            based in Goa, India.
          </p>
        </div>

        <div className="hero-buttons absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0" style={{ opacity: 0 }}>
          <Link to="/contact" className="bg-[#111] text-white px-8 py-4 font-sans text-sm text-center hover:bg-neutral-800 transition-colors w-full sm:w-auto rounded-sm">
            Hire as Developer
          </Link>
          <Link to="/lookbook" className="bg-white text-[#111] border border-[#111] px-8 py-4 font-sans text-sm text-center hover:bg-neutral-100 transition-colors w-full sm:w-auto rounded-sm">
            View Projects
          </Link>
        </div>

      </section>

      {/* Tech Stack Marquee */}
      <section className="fade-up py-10 md:py-14 border-y border-neutral-100 bg-white overflow-hidden relative" aria-label="Technology stack">
        <div className="animate-marquee-slow flex whitespace-nowrap items-center">
          {[...techStack, ...techStack].map((tech, index) => (
            <div key={index} className="mx-16 flex items-center gap-4 group hover:scale-105 transition-transform duration-500">
              <img
                src={`${CDN_BASE}/${tech.icon}.svg`}
                alt=""
                width={24}
                height={24}
                loading="lazy"
                decoding="async"
                className="w-6 h-6 object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <span className="font-sans text-xs md:text-sm uppercase tracking-[0.4em] font-medium text-neutral-500 group-hover:text-black transition-colors duration-500">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Work Strip (Horizontal Scroll) */}
      <section className="horizontal-container h-screen bg-background relative flex items-center overflow-hidden" aria-label="Featured projects">
        <div className="absolute top-12 left-12 z-10">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight">Featured Work</h2>
        </div>
        <div className="horizontal-scroll flex gap-8 px-12 pt-32 h-[75vh]">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="relative w-[80vw] md:w-[45vw] h-full flex-shrink-0 group overflow-hidden rounded-2xl cursor-none hover-target cursor-view"
            >
              <img
                src={project.mainImage}
                alt={project.title}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute bottom-10 left-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-sans text-sm uppercase tracking-widest block mb-2 opacity-70">{project.category}</span>
                <h3 className="font-display text-3xl md:text-5xl uppercase leading-none">{project.title}</h3>
              </div>
              <div className="absolute top-10 right-10 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cinematic 3D Card Rise Experience Section */}
      <section className="experience-reveal-wrapper relative w-full h-screen bg-background overflow-hidden" aria-label="Professional experience" style={{ perspective: '1500px' }}>
        <div className="experience-inner absolute inset-0 bg-accent w-full h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="exp-content-reveal flex justify-between items-end mb-8 md:mb-12">
              <h2 className="font-display text-4xl md:text-7xl uppercase tracking-tighter text-white">Professional<br />Experience</h2>
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-neutral-500 mb-2">2021 — PRESENT</span>
            </div>

            <div className="exp-items-container space-y-4 md:space-y-4">
              {experiences.map((exp, index) => (
                <div key={index} className="exp-item relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start hover:bg-white/[0.04] transition-colors py-6 md:py-8 px-8 -mx-8 rounded-xl text-white">
                  <div className="md:col-span-3 font-display text-2xl md:text-3xl text-neutral-400 group-hover:text-white transition-colors">
                    {exp.year}
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tight mb-2">
                      {exp.role}
                    </h3>
                    <p className="font-sans text-base md:text-lg text-neutral-400 max-w-2xl leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Typography Scroll */}
      <section className="py-32 overflow-hidden bg-background flex items-center" aria-hidden="true">
        <motion.div
          className="whitespace-nowrap flex"
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, -1000]) }}
        >
          <h2 className="font-display text-[12vw] uppercase tracking-tighter text-accent leading-none px-8">
            Show me what you've got • Show me what you've got • Show me what you've got •
          </h2>
        </motion.div>
      </section>

      {/* 3D Cinematic Deck Stack Services Section */}
      <section className="services-container relative w-full h-screen bg-background overflow-hidden flex flex-col items-center justify-center" aria-label="Services offered">
        
        {/* Massive Background Intro Tile */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0" aria-hidden="true">
           <h2 className="font-display text-[22vw] uppercase tracking-tighter text-neutral-200 opacity-60 mix-blend-multiply whitespace-nowrap">
             ARSENAL
           </h2>
        </div>

        {/* 3D Stacking Wrapper */}
        <div className="relative w-[90vw] md:w-[75vw] h-[80vh] md:h-[85vh] mt-[5vh] mx-auto z-10" style={{ perspective: '2000px' }}>
          {services.map((service, index) => {
            const isDark = index % 2 === 0;
            return (
              <div 
                key={index} 
                className="service-stack-card absolute inset-0 w-full h-full rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 md:p-16 border border-black/10" 
                style={{ 
                  backgroundColor: isDark ? '#111' : '#fff', 
                  color: isDark ? '#fff' : '#111', 
                  zIndex: index + 1 
                }}
              >
                {/* Dynamic Parallax Depth Shadow Overlay */}
                <div className="dark-overlay absolute inset-0 bg-black z-20 pointer-events-none" style={{ opacity: 0 }} aria-hidden="true" />
                
                {/* Giant Faded Out Background Title inside Card */}
                <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none flex justify-center items-center overflow-hidden z-0" aria-hidden="true">
                  <h2 className="font-display text-[40vw] whitespace-nowrap">{service.title}</h2>
                </div>
                
                {/* Foreground Content */}
                <div className="relative z-30 flex flex-col items-center w-full max-w-4xl mx-auto">
                  <div className="w-20 h-20 md:w-32 md:h-32 mb-8 md:mb-12 rounded-full border-2 border-current flex items-center justify-center shrink-0">
                    <div className="scale-125 md:scale-150 transform">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12 4L12 20M20 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  <span className="font-sans text-xs md:text-sm uppercase tracking-[0.5em] mb-6 opacity-60">Phase 0{index + 1}</span>
                  <h3 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter mb-8 text-center leading-[0.9]">
                    {service.title}
                  </h3>
                  
                  <p className="font-sans text-lg md:text-2xl opacity-70 text-center leading-relaxed font-light max-w-2xl mx-auto">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonial */}
      <section className="fade-up py-32 px-6 md:px-12 bg-background flex justify-center items-center" aria-label="Quote">
        <figure className="max-w-4xl mx-auto text-center relative">
          <span className="absolute -top-16 -left-8 text-9xl text-neutral-200 font-display opacity-50" aria-hidden="true">"</span>
          <blockquote>
            <p className="font-display text-3xl md:text-5xl uppercase tracking-tight leading-tight relative z-10">
              Programs must be written for people to read, and only incidentally for machines to execute.
            </p>
          </blockquote>
          <figcaption className="font-sans text-sm uppercase tracking-widest mt-8 font-semibold">
            — Harold Abelson
          </figcaption>
        </figure>
      </section>

      {/* FAQ Section */}
      <section className="fade-up py-24 px-6 md:px-12 lg:px-24 bg-white" aria-label="Frequently asked questions">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tight mb-16 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" aria-label="Contact call to action">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/contactbg/1920/1080"
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h2 className="font-display text-6xl md:text-8xl lg:text-[10vw] uppercase tracking-tighter mb-8">
            Let's Talk
          </h2>
          <Link
            to="/contact"
            className="inline-block font-sans text-sm uppercase tracking-widest font-semibold border border-white rounded-full px-8 py-4 hover-target hover:bg-white hover:text-black transition-colors duration-300"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
