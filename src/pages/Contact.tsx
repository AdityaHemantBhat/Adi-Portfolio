import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import AnimatedText from '../components/ui/AnimatedText';
import MagneticButton from '../components/ui/MagneticButton';
import SvgMorph, { MORPH_BLOBS } from '../components/ui/SvgMorph';
import AuroraBackground from '../components/ui/AuroraBackground';
import Reveal from '../components/ui/Reveal';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);
    setStatus('idle');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(serviceId, templateId, form.current, publicKey)
      .then(() => {
        setStatus('success');
        form.current?.reset();
        setTimeout(() => setStatus('idle'), 5000); // Reset success message after 5 seconds
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        setStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="relative overflow-hidden min-h-svh bg-background pt-28 md:pt-32 px-6 md:px-12 lg:px-24 pb-[max(6rem,env(safe-area-inset-bottom))] flex items-center justify-center">
      {/* Soft grayscale aurora + morphing blob behind the contact panel */}
      <AuroraBackground className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <SvgMorph
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin]"
          paths={MORPH_BLOBS} fill fillColor="#111" fillOpacity={0.05}
          style={{ filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
        <div>
          <AnimatedText
            as="h1"
            text="Hello."
            mode="chars"
            blur={false}
            className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-8"
          />
          <Reveal as="p" direction="up" delay={0.15} className="font-sans text-lg text-neutral-600 mb-12" blur={false}>
            I am always open to discussing full stack development work or partnership opportunities.
          </Reveal>

          <Reveal as="address" direction="up" delay={0.25} className="space-y-6 font-sans text-sm tracking-widest font-semibold not-italic" blur={false}>
            <div>
              <span className="text-neutral-500 block mb-2 uppercase">Email</span>
              <a href="mailto:aditya.bhat.dev@gmail.com" className="hover-target hover:text-neutral-500 transition-colors">aditya.bhat.dev@gmail.com</a>
            </div>
            <div>
              <span className="text-neutral-500 block mb-2 uppercase">Phone</span>
              <a href="tel:+919529644737" className="hover-target hover:text-neutral-500 transition-colors">+91 9529644737</a>
            </div>
            <div>
              <span className="text-neutral-500 block mb-2 uppercase">Location</span>
              <p>Goa, India</p>
            </div>
          </Reveal>
        </div>

        <motion.form 
          ref={form}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
          onSubmit={sendEmail}
          aria-label="Contact form"
        >
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input 
              type="text" 
              id="name" 
              name="user_name"
              placeholder="YOUR NAME" 
              autoComplete="name"
              required
              className="w-full bg-transparent border-b border-neutral-300 py-4 font-sans text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-400 placeholder:uppercase placeholder:tracking-widest"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              type="email" 
              id="email" 
              name="user_email"
              placeholder="YOUR EMAIL" 
              autoComplete="email"
              required
              className="w-full bg-transparent border-b border-neutral-300 py-4 font-sans text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-400 placeholder:uppercase placeholder:tracking-widest"
            />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea 
              id="message" 
              name="message"
              rows={4}
              placeholder="YOUR MESSAGE" 
              required
              className="w-full bg-transparent border-b border-neutral-300 py-4 font-sans text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-400 placeholder:uppercase placeholder:tracking-widest resize-none"
            />
          </div>
          <MagneticButton className="w-full" strength={0.15}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white font-sans text-sm uppercase tracking-widest font-semibold py-4 hover-target hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </MagneticButton>
          
          {/* Status Messages */}
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-green-600 font-sans text-sm uppercase tracking-widest font-semibold text-center"
            >
              Message sent successfully!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-red-600 font-sans text-sm uppercase tracking-widest font-semibold text-center"
            >
              Failed to send. Please check configurations.
            </motion.p>
          )}
        </motion.form>
      </div>
    </div>
  );
}
