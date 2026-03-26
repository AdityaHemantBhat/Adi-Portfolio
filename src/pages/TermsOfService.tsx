import { motion } from 'framer-motion';

export default function TermsOfService() {
  const sections = [
    {
      title: 'Agreement',
      content: 'By accessing this website, you agree to be bound by these terms of service and all applicable laws and regulations.'
    },
    {
      title: 'Usage License',
      content: 'Permission is granted to view the materials on this website for personal, non-commercial transitory viewing only.'
    },
    {
      title: 'Disclaimer',
      content: 'The materials on this website are provided on an "as is" basis. I make no warranties, expressed or implied, and hereby disclaim all others.'
    },
    {
      title: 'Governing Law',
      content: 'Any claim relating to this website shall be governed by the laws of Goa, India without regard to its conflict of law provisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-48 px-6 md:px-12 lg:px-24 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-display text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-24"
        >
          Terms of<br/>Service
        </motion.h1>
        
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border-b border-black/10 pb-12 last:border-0"
            >
              <h2 className="font-display text-3xl uppercase tracking-tight mb-4">{section.title}</h2>
              <p className="font-sans text-lg text-neutral-600 leading-relaxed max-w-2xl">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
