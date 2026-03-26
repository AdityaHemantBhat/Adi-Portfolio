import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import Loader from './components/ui/Loader';
import Home from './pages/Home';
import Lookbook from './pages/Lookbook';
import Contact from './pages/Contact';
import Project from './pages/Project';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { ProjectProvider } from './context/ProjectContext';

const circleTransition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const };

const circleStyle: React.CSSProperties = {
  position: 'fixed',
  width: '300vmax',
  height: '300vmax',
  left: '50%',
  bottom: 0,
  translate: '-50% 50%',
  borderRadius: '50%',
  pointerEvents: 'none',
  zIndex: 100,
  backgroundColor: 'var(--color-foreground, #222)',
  willChange: 'transform',
};

function AnimatedRoutes() {
  const location = useLocation();
  const isInitialLaunch = useRef(true);

  useEffect(() => {
    // After the very first render of this component, 
    // we mark it as no longer being the 'initial launch'
    isInitialLaunch.current = false;
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {/* Entry reveal: circle shrinks from covering screen → nothing */}
        <motion.div
          style={circleStyle}
          initial={isInitialLaunch.current ? { scale: 0 } : { scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ ...circleTransition, delay: 0.05 }}
        />
        {/* Exit cover: circle grows from nothing → covering screen */}
        <motion.div
          style={{ ...circleStyle, bottom: 'auto', top: 0, translate: '-50% -50%' }}
          initial={{ scale: 0 }}
          animate={{ scale: 0 }}
          exit={{ scale: 1 }}
          transition={circleTransition}
        />
        <div className="min-h-screen bg-background">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/project/:id" element={<Project />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ProjectProvider>
      <Router>
        {/* Mount Layout immediately so it's ready behind the loader */}
        <Layout>
          <AnimatedRoutes />
        </Layout>

        {/* Loader Overlay (On top of everything) */}
        <AnimatePresence>
          {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
        </AnimatePresence>
      </Router>
    </ProjectProvider>
  );
}

