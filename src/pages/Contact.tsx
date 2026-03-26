import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);
    setStatus('idle');

    const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID 
    const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID 
    const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY

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
    <div className="min-h-screen bg-background pt-32 px-6 md:px-12 lg:px-24 pb-24 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-8"
          >
            Hello.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg text-neutral-600 mb-12"
          >
            I am always open to discussing full stack development work or partnership opportunities.
          </motion.p>
          
          <address className="space-y-6 font-sans text-sm tracking-widest font-semibold not-italic">
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
          </address>
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
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent text-white font-sans text-sm uppercase tracking-widest font-semibold py-4 hover-target hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
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
