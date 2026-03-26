import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-accent text-white py-12 px-6 md:px-12 lg:px-24" role="contentinfo">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex flex-col gap-4">
                    <Link to="/" className="font-display text-4xl md:text-6xl tracking-tight uppercase hover-target">
                        Aditya Bhat
                    </Link>
                    <p className="font-sans text-sm text-neutral-400 max-w-xs">
                        Full Stack Developer based in Goa, India.
                    </p>
                </div>

                <div className="flex gap-12 font-sans text-sm uppercase tracking-widest font-semibold">
                    <div className="flex flex-col gap-4">
                        <span className="text-neutral-500">Socials</span>
                        <a href="https://www.instagram.com/aditya.bhat.dev/" target='_blank' rel='noopener noreferrer' className="hover-target hover:text-neutral-300 transition-colors">
                            Instagram<span className="sr-only"> (opens in new tab)</span>
                        </a>
                        <a href="https://github.com/AdityaHemantBhat" target='_blank' rel='noopener noreferrer' className="hover-target hover:text-neutral-300 transition-colors">
                            Github<span className="sr-only"> (opens in new tab)</span>
                        </a>
                        <a href="https://www.linkedin.com/in/aditya-bhat-3661a8200/" target='_blank' rel='noopener noreferrer' className="hover-target hover:text-neutral-300 transition-colors">
                            LinkedIn<span className="sr-only"> (opens in new tab)</span>
                        </a>
                    </div>
                    <nav className="flex flex-col gap-4" aria-label="Footer navigation">
                        <span className="text-neutral-500">Menu</span>
                        <Link to="/" className="hover-target hover:text-neutral-300 transition-colors">Home</Link>
                        <Link to="/lookbook" className="hover-target hover:text-neutral-300 transition-colors">Lookbook</Link>
                        <Link to="/contact" className="hover-target hover:text-neutral-300 transition-colors">Contact</Link>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-xs text-neutral-500 uppercase tracking-wider">
                <p>&copy; {new Date().getFullYear()} Aditya Bhat. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link to="/privacy" className="hover-target hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover-target hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
