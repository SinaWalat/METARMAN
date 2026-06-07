import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Music from './components/Music';
import Events from './components/Events';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import './App.css';

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const preloaderRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const hasPreloaded = useRef(false);
  const mainRef = useRef(null);

  // Smooth fade transition between views
  const navigateTo = useCallback((targetView) => {
    if (targetView === view) return;
    if (!mainRef.current) {
      setView(targetView);
      return;
    }
    gsap.to(mainRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setView(targetView);
        window.scrollTo(0, 0);
        gsap.to(mainRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      },
    });
  }, [view]);

  // Preloader transition timing
  useEffect(() => {
    if (!loading) return;
    
    const timer = setTimeout(() => {
      // Outro timeline animation of preloader split curtain
      const tlOutro = gsap.timeline({
        onComplete: () => {
          setLoading(false);
          hasPreloaded.current = true;
        },
      });

      // 1. Fade out the text and soundwave content
      tlOutro.to('.preloader-content', {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      });

      // 2. Split curtain slide
      tlOutro.to('.preloader-panel-top', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '-=0.15');

      tlOutro.to('.preloader-panel-bottom', {
        yPercent: 100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '<');
    }, 1000); // 1s intro duration before opening

    return () => clearTimeout(timer);
  }, [loading]);

  // Custom Cursor mouse follow
  useEffect(() => {
    // Only run cursor logic on devices with fine pointer (mouse)
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;

    if (!dot || !ring) return;

    // QuickTo is the most performant way to update positions in GSAP
    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });

    let hasMoved = false;

    const handleMouseMove = (e) => {
      if (!hasMoved) {
        hasMoved = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    // Hide cursor when mouse leaves the window
    const handleWindowLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Show cursor when mouse enters the window
    const handleWindowEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleWindowLeave);
    document.addEventListener('mouseenter', handleWindowEnter);

    // Hover effect on interactive elements
    const handleMouseEnter = () => {
      ring.classList.add('hovered');
      gsap.to(dot, { scale: 1.5, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      ring.classList.remove('hovered');
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    const updateInteractiveElements = () => {
      const interactives = document.querySelectorAll('.interactive-element, a, button, input, textarea');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Run initially and set a small timeout to account for dynamic mounting
    updateInteractiveElements();
    const timeout = setTimeout(updateInteractiveElements, 1000);

    // Hide custom cursor over iframes (they capture mouse events)
    const handleIframeEnter = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const handleIframeLeave = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const bindIframes = () => {
      document.querySelectorAll('iframe').forEach((iframe) => {
        iframe.addEventListener('mouseenter', handleIframeEnter);
        iframe.addEventListener('mouseleave', handleIframeLeave);
      });
    };
    bindIframes();
    const iframeTimeout = setTimeout(bindIframes, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleWindowLeave);
      document.removeEventListener('mouseenter', handleWindowEnter);
      clearTimeout(timeout);
      clearTimeout(iframeTimeout);
      const interactives = document.querySelectorAll('.interactive-element, a, button, input, textarea');
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      document.querySelectorAll('iframe').forEach((iframe) => {
        iframe.removeEventListener('mouseenter', handleIframeEnter);
        iframe.removeEventListener('mouseleave', handleIframeLeave);
      });
    };
  }, [loading]);

  return (
    <>
      {/* Custom Cursor Elements */}
      <div ref={cursorDotRef} className="custom-cursor" style={{ top: 0, left: 0 }} />
      <div ref={cursorRingRef} className="custom-cursor-ring" style={{ top: 0, left: 0 }} />

      {/* Preloader Overlay */}
      {loading && (
        <div ref={preloaderRef} className="preloader">
          <div className="preloader-panel preloader-panel-top" />
          <div className="preloader-panel preloader-panel-bottom" />
          
          <div className="preloader-content">
            {/* Equalizer Soundwave */}
            <div className="preloader-soundwave">
              {Array.from({ length: 24 }).map((_, i) => {
                const total = 24;
                const center = (total - 1) / 2;
                const dist = Math.abs(i - center);
                const maxScale = (0.2 + Math.sin((i / (total - 1)) * Math.PI) * 0.8).toFixed(2);
                const delay = (dist * 0.04).toFixed(2);
                return (
                  <div 
                    key={i} 
                    className="soundwave-bar" 
                    style={{ 
                      '--max-scale': maxScale,
                      animationDelay: `${delay}s`
                    }} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Background Canvas */}
      <BackgroundCanvas />

      {/* Main Layout Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'transparent',
        }}
      >
        <Navbar view={view} setView={navigateTo} />
        <main ref={mainRef}>
          {view === 'gallery' ? (
            <Gallery onBack={() => navigateTo('home')} />
          ) : (
            <>
              <Hero isFirstLoad={!hasPreloaded.current} />
              <About />
              <Music />
              <Events />
              <Contact />
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
