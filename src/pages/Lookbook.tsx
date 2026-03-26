import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { useProjectContext, ProjectData } from '../context/ProjectContext';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Lookbook() {
  const { projects } = useProjectContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 500]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-text-split', 
        { y: '110%', rotateZ: 5 }, 
        { y: '0%', rotateZ: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.1 }
      );

      gsap.fromTo('.hero-center-img',
        { scale: 1.2, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { scale: 1, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.out', delay: 0.4 }
      );

      gsap.utils.toArray('.project-item').forEach((item: any, i) => {
        const image = item.querySelector('.project-img-container');
        const text = item.querySelector('.project-text');
        
        gsap.fromTo(image,
          { y: 100, rotateZ: i % 2 === 0 ? -2 : 2, scale: 0.95 },
          {
            y: 0, rotateZ: 0, scale: 1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1,
            }
          }
        );

        gsap.fromTo(text,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1, x: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#f5f5f5] text-[#111] overflow-hidden relative cursor-none"
    >

      {/* ── Hero Section ── */}
      <div className="relative w-full min-h-[100svh] flex flex-col justify-center items-center px-4 md:px-12 pt-32 pb-20">
        <div ref={titleWrapperRef} className="relative z-20 w-full max-w-[90vw] flex flex-col items-center">
          
          <div className="overflow-hidden w-full flex justify-start pl-[5vw]">
            <h1 className="hero-text-split font-hero text-[20vw] leading-[0.75] uppercase text-[#111] tracking-tighter">
              Look
            </h1>
          </div>

          <div className="hero-center-img relative z-10 w-[60vw] md:w-[40vw] max-w-[500px] aspect-[4/5] my-[-7vw] md:my-[-5vw] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2400&auto=format&fit=crop" 
              alt="Art direction showcase"
              width={500}
              height={625}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 origin-left hidden md:block">
              <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#111] whitespace-nowrap">
                Design & Engineering — {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div className="overflow-hidden w-full flex justify-end pr-[5vw] relative z-20">
            <h1 className="hero-text-split font-hero text-[20vw] leading-[0.75] uppercase text-[#111] tracking-tighter" aria-hidden="true">
              Book
            </h1>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4" aria-hidden="true">
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-[#111] overflow-hidden">
            <motion.div 
              className="w-full h-full bg-[#111]" 
              animate={{ y: ['-100%', '100%'] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      {/* ── Projects List ── */}
      <div className="relative w-full py-40 px-6 md:px-12 lg:px-24 flex flex-col gap-40 md:gap-64">
        
        {projects.map((project, i) => {
          const isEven = i % 2 === 0;
          
          return (
            <article 
              key={project.id} 
              className={`project-item relative w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-24`}
            >
              {/* Giant background index number */}
              <motion.div 
                style={{ y: yBg }}
                className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} -z-10 pointer-events-none select-none opacity-[0.03]`}
                aria-hidden="true"
              >
                <span className="font-hero text-[40vw] leading-none">0{i + 1}</span>
              </motion.div>

              {/* Image Block */}
              <Link 
                to={`/project/${project.id}`}
                className="project-img-container relative w-full md:w-[55%] aspect-[4/5] md:aspect-[3/4] group block overflow-hidden bg-neutral-200 cursor-view hover-target"
              >
                <img 
                  src={project.mainImage} 
                  alt={project.title}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top grayscale transition-all duration-[1s] group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-4 border border-white/0 group-hover:border-white/30 transition-colors duration-500 z-10 pointer-events-none" />
              </Link>

              {/* Text Block */}
              <div className={`project-text w-full md:w-[45%] flex flex-col ${isEven ? 'md:items-start' : 'md:items-end md:text-right'} relative z-10`}>
                
                <div className="overflow-hidden mb-4 md:mb-8">
                  <span className="inline-block font-sans text-xs uppercase tracking-[0.4em] font-semibold text-[#111] border-b border-[#111] pb-2">
                    {project.category}
                  </span>
                </div>

                <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.9] mb-6">
                  {project.title.split(' ').map((word, wIdx) => (
                    <span key={wIdx} className="block overflow-hidden">
                      <span className="inline-block hover:italic transition-all duration-300 cursor-pointer">
                        {word}
                      </span>
                    </span>
                  ))}
                </h2>
                
                <div className="flex flex-col gap-2 mb-12">
                  <span className="font-sans text-sm font-medium uppercase tracking-widest text-neutral-500">Year — {project.year}</span>
                </div>

                <Link 
                  to={`/project/${project.id}`}
                  className="group flex items-center gap-4 overflow-hidden cursor-view hover-target"
                >
                  <div className="w-12 h-12 rounded-full border border-[#111] flex items-center justify-center group-hover:bg-[#111] transition-colors duration-500" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#111] group-hover:text-white transition-colors duration-500 -rotate-45 group-hover:rotate-0" aria-hidden="true">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-sans text-xs uppercase tracking-[0.3em] font-bold relative">
                    <span className="relative z-10">Case Study</span>
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#111] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  </span>
                </Link>

              </div>
            </article>
          );
        })}

      </div>

      {/* ── Footer / CTA ── */}
      <div className="w-full h-[50vh] flex flex-col items-center justify-center bg-[#111] text-[#f5f5f5] mt-20 relative overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap opacity-5 pointer-events-none select-none flex" aria-hidden="true">
          {[...Array(2)].map((_, i) => (
            <motion.h2 
              key={i}
              className="font-hero text-[30vw] uppercase leading-none px-8"
              animate={{ x: '-100%' }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              Get in touch — Let's build —
            </motion.h2>
          ))}
        </div>
        
        <p className="font-sans text-xs uppercase tracking-[0.4em] mb-6 relative z-10">Convinced yet?</p>
        <Link 
          to="/contact" 
          className="relative z-10 font-display text-5xl md:text-8xl uppercase tracking-tighter hover:italic transition-all duration-300 hover-target"
        >
          Start a project
        </Link>
      </div>

    </div>
  );
}
