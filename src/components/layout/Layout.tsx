import { useEffect, useRef, ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import BackToTop from '../ui/BackToTop';

export default function Layout({ children }: { children: ReactNode }) {
    const lenisRef = useRef<any>(null);
    const location = useLocation();

    useEffect(() => {
        // Reset scroll on route change
        if (lenisRef.current?.lenis) {
            lenisRef.current.lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    return (
        <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <CustomCursor />
            <Navbar />
            <main id="main-content" className="min-h-screen bg-[#111] text-foreground selection:bg-accent selection:text-white">
                {children}
            </main>
            <Footer />
            <BackToTop />
        </ReactLenis>
    );
}
