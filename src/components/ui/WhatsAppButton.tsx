import { MessageCircle } from 'lucide-react';
import { createWhatsAppUrl } from '../../lib/contact';

export default function WhatsAppButton() {
  return (
    <a
      href={createWhatsAppUrl('Hi Aditya, I would like to discuss a project.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Aditya on WhatsApp (opens in a new tab)"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] z-50 inline-flex items-center gap-2 rounded-full bg-accent p-3 font-sans text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 hover-target focus-visible:outline-white sm:px-4 sm:py-3 md:bottom-8 md:left-8"
    >
      <MessageCircle size={18} aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
