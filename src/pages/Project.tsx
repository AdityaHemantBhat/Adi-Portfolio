import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProjectContext } from '../context/ProjectContext';

gsap.registerPlugin(ScrollTrigger);

export default function Project() {
  const { id } = useParams();
  const { projects, getProjectById } = useProjectContext();
  const project = getProjectById(id || "");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // Find next project ID for navigation
  const currentIndex = projects.findIndex(p => p.id === id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Project Not Found</h1>
          <Link to="/lookbook" className="text-neutral-500 hover:text-black transition-colors underline">Back to Lookbook</Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-img').forEach((img: any) => {
        gsap.fromTo(img, 
          { clipPath: 'inset(100% 0 0 0)' },
          { 
            clipPath: 'inset(0% 0 0 0)', 
            ease: 'power3.out',
            duration: 1.5,
            scrollTrigger: {
              trigger: img,
              start: 'top 80%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Fullscreen Hero */}
      <section className="relative h-screen w-full overflow-hidden" aria-label={`${project.title} project hero`}>
        <motion.div style={{ y }} className="absolute inset-0 z-0 scale-105">
          <img 
            src={project.mainImage} 
            alt={project.title} 
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
        
        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 lg:p-24 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-6 leading-none"
          >
            {project.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap gap-x-12 gap-y-8 font-sans text-sm uppercase tracking-widest font-semibold"
          >
            <div>
              <span className="text-neutral-400 block mb-1 text-xs">Year</span>
              {project.year}
            </div>
            {project.liveLink && (
              <div>
                <span className="text-neutral-400 block mb-1 text-xs">Project</span>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors flex items-center gap-2 group">
                  Live View
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            )}
            {project.githubRepo && (
              <div>
                <span className="text-neutral-400 block mb-1 text-xs">Source</span>
                <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors flex items-center gap-2 group">
                  GitHub
                  <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <h2 className="lg:col-span-4 font-display text-4xl uppercase tracking-tight">
            The Challenge
          </h2>
          <div className="lg:col-span-8 font-sans text-xl text-neutral-800 leading-relaxed font-light">
            {project.description}
          </div>
        </div>

        <div className="space-y-32">
          {project.galleryImages.map((img, index) => (
            <div 
              key={index} 
              className={`w-full overflow-hidden rounded-2xl reveal-img shadow-2xl${index % 2 === 0 ? 'aspect-video' : 'aspect-[3/4] max-w-4xl mx-auto object-top'}`}
            >
              <img 
                src={img} 
                alt={`${project.title} detail ${index + 1}`} 
                width={1200}
                height={index % 2 === 0 ? 675 : 1600}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Next Project */}
      <section className="py-48 bg-[#111] text-white text-center flex flex-col items-center justify-center" aria-label="Next project">
        <span className="font-sans text-sm uppercase tracking-widest text-neutral-500 mb-8 block">Next Project</span>
        <Link to={`/project/${nextProject.id}`} className="font-display text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter hover-target hover:text-neutral-400 transition-colors px-12 block leading-none">
          {nextProject.title}
        </Link>
      </section>
    </div>
  );
}
