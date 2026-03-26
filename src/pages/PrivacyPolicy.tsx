import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Data Collection',
      content: 'I collect minimal information required for functional communication, such as your name and email when you use the contact form.'
    },
    {
      title: 'Usage',
      content: 'Your data is used solely to respond to your inquiries. I do not sell or share your personal information with third parties.'
    },
    {
      title: 'Cookies',
      content: 'This site may use basic cookies for session management and performance analytics to ensure a smooth user experience.'
    },
    {
      title: 'Security',
      content: 'I implement standard security measures to protect your information, though no method of transmission over the internet is 100% secure.'
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
          Privacy<br/>Policy
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
