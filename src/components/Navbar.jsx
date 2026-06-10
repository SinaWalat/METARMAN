import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const cleanTitle = (title) => {
  return title
    .replace(/Metarman\s*-\s*/gi, '')
    .replace(/\|\s*This is hitech records.*/gi, '')
    .replace(/\.wav$/gi, '')
    .trim()
    .toUpperCase();
};

const Navbar = ({ view, setView, trackList = [] }) => {
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasLoadedTracks = trackList && trackList.length > 0;
  const latestTrackTitle = hasLoadedTracks 
    ? cleanTitle(trackList[0].title) 
    : 'Ahoora Set & Karma Set';
  const latestTrackUrl = hasLoadedTracks 
    ? trackList[0].permalink_url 
    : 'https://on.soundcloud.com/oqngfxz2pi0UPLVciJ';
  const latestTrackDesc = hasLoadedTracks 
    ? (trackList[0].genre || 'Latest Release') 
    : 'Listen to recent festival recordings.';

  useEffect(() => {
    // Entrance animation for header
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 1.8 }
    );
  }, []);

  useEffect(() => {
    if (menuOpen) {
      // Disable page scrolling
      document.body.style.overflow = 'hidden';

      // Clear any running tweens
      gsap.killTweensOf([overlayRef.current, contentRef.current]);

      // Make visible and responsive
      gsap.set(overlayRef.current, { display: 'flex', pointerEvents: 'auto' });

      // Animate overlay fade in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out' }
      );

      // Animate content scale & fade in
      gsap.fromTo(
        contentRef.current,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.05 }
      );
    } else {
      document.body.style.overflow = '';

      if (overlayRef.current) {
        gsap.killTweensOf([overlayRef.current, contentRef.current]);

        // Animate content scale & fade out
        gsap.to(contentRef.current, {
          scale: 0.96,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in'
        });

        // Animate overlay fade out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(overlayRef.current, { display: 'none', pointerEvents: 'none' });
          }
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (target) => {
    setMenuOpen(false);
    setTimeout(() => {
      if (target === 'gallery') {
        setView('gallery');
      } else if (target === 'home') {
        setView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (view === 'gallery') {
          setView('home');
          setTimeout(() => {
            scrollToSection(target);
          }, 150);
        } else {
          scrollToSection(target);
        }
      }
    }, 350); // Matches menu close duration
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => {
              if (view === 'gallery') {
                setView('home');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="interactive-element"
            style={{
              fontFamily: "var(--font-logo)",
              fontSize: '1.1rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            METARMAN
          </div>

          {/* Right Header Area: Socials & Menu Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Instagram */}
            <a
              href="https://www.instagram.com/metarman_?igsh=NTN1cXdiOGhxdmpi&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-element"
              aria-label="Instagram"
              style={{
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* SoundCloud */}
            <a
              href="https://on.soundcloud.com/oqngfxz2pi0UPLVciJ"
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-element"
              aria-label="Soundcloud"
              style={{
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <svg
                viewBox="0 0 512 512"
                width="20"
                height="20"
                fill="currentColor"
                style={{ display: 'block' }}
              >
                <g>
                  <path fillRule="evenodd" clipRule="evenodd" d="m214.805 362.56-2.943-54.72 2.943-135.36c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 135.36-2.942 54.72c0 4.769-3.955 8.64-8.828 8.64-4.874 0-8.828-3.871-8.828-8.64zm-35.311 0-2.942-54.72 2.942-100.8c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.943 100.8-2.943 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31 0-2.943-54.72 2.943-112.32c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 112.32-2.942 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31 0-2.942-54.72 2.942-89.28c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.943 89.28-2.943 54.72c0 4.769-3.955 8.64-8.828 8.64-4.874 0-8.828-3.871-8.828-8.64zm-35.311 0-2.943-54.72 2.943-43.2c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 43.2-2.942 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31 0-2.942-54.72 2.942-54.72c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.943 54.72-2.943 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31-23.04L0 307.84l2.943-31.68c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 31.68-2.942 31.68c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm413.371-102.063a71.776 71.776 0 0 1 25.065-4.497c39.002 0 70.621 30.947 70.621 69.12s-31.618 69.12-70.621 69.12H264.836c-9.755 0-17.663-7.762-17.663-17.297V169.6c0-28.8 52.965-28.8 52.965-28.8 58.554 0 107.113 41.851 116.176 96.657z" />
                </g>
              </svg>
            </a>

            {/* Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="interactive-element"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontFamily: 'var(--font-logo)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.55rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Menu
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay (Rendered statically, visibility controlled via GSAP) */}
      <div
        ref={overlayRef}
        className="menu-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          zIndex: 9999,
          display: 'none',
          pointerEvents: 'none',
          opacity: 0,
          overflowY: 'auto',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        onClick={() => setMenuOpen(false)}
      >
        {/* Top Header inside overlay */}
        <div className="container" style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '70px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 10,
          padding: '0 2rem'
        }}>
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-logo)',
              cursor: 'pointer',
              zIndex: 10000,
              transition: 'all 0.3s ease',
              borderBottom: '1px solid transparent',
              padding: '0.25rem 0'
            }}
            className="interactive-element"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderBottomColor = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            Close
          </button>
        </div>

        {/* 3-Column Asymmetrical Grid Layout */}
        <div
          ref={contentRef}
          className="container menu-content-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr 1fr',
            gap: '3rem',
            width: '100%',
            maxWidth: '1200px',
            margin: 'auto',
            padding: '110px 2rem 40px',
            minHeight: 'auto',
            alignItems: 'start',
            zIndex: 5,
            position: 'relative',
            opacity: 0
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* COLUMN 1: Brand Info & Monogram */}
          <div className="nav-col-left" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            paddingRight: '3rem',
            position: 'relative'
          }}>
            <div>
              <span style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                CREATIVE PLATFORM
              </span>
              <h2 style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-logo)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: '1.1',
              }}>
                MET<br />ARMAN
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                  BOOKING ENQUIRIES
                </span>
                <a 
                  href="mailto:booking@metarman.com" 
                  className="interactive-element"
                  style={{ 
                    fontSize: '0.9rem', 
                    color: '#fff', 
                    textDecoration: 'none', 
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.05em',
                    transition: 'opacity 0.2s ease',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  booking@metarman.com
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Premium Menu List */}
          <div className="nav-col-center" style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center'
          }}>
            {[
              { num: '01', label: 'Home', target: 'home' },
              { num: '02', label: 'About', target: 'about' },
              { num: '03', label: 'Music', target: 'music' },
              { num: '04', label: 'Shows', target: 'shows' },
              { num: '05', label: 'Contact', target: 'contact' },
              { num: '06', label: 'Gallery', target: 'gallery' },
            ].map((item, idx) => (
              <div 
                key={item.label} 
                className="nav-item-wrapper" 
                style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
                  position: 'relative',
                  width: '100%'
                }}
              >
                <button
                  onClick={() => handleNavigation(item.target)}
                  className="interactive-element menu-link"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: view === item.target || (view === 'home' && item.target === 'home') ? '#fff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-logo)',
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '1.25rem 1rem',
                    textAlign: 'left',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.paddingLeft = '2rem';
                    const hoverBg = e.currentTarget.querySelector('.hover-bg');
                    const arrow = e.currentTarget.querySelector('.arrow-indicator');
                    if (hoverBg) hoverBg.style.transform = 'translateX(0)';
                    if (arrow) {
                      arrow.style.opacity = '1';
                      arrow.style.transform = 'translateX(0)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = view === item.target || (view === 'home' && item.target === 'home') ? '#fff' : 'var(--text-secondary)';
                    e.currentTarget.style.paddingLeft = '1rem';
                    const hoverBg = e.currentTarget.querySelector('.hover-bg');
                    const arrow = e.currentTarget.querySelector('.arrow-indicator');
                    if (hoverBg) hoverBg.style.transform = 'translateX(-100%)';
                    if (arrow) {
                      arrow.style.opacity = '0';
                      arrow.style.transform = 'translateX(-10px)';
                    }
                  }}
                >
                  {/* Hover sliding overlay background */}
                  <div 
                    className="hover-bg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                      zIndex: -1,
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span className="link-num" style={{ 
                      fontSize: '0.8rem', 
                      fontFamily: 'var(--font-body)', 
                      color: 'var(--text-muted)',
                      fontWeight: 400
                    }}>
                      {item.num}
                    </span>
                    <span className="link-text">{item.label}</span>
                  </div>

                  <span 
                    className="arrow-indicator"
                    style={{ 
                      opacity: 0, 
                      transform: 'translateX(-10px)', 
                      transition: 'all 0.3s ease',
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      color: '#fff'
                    }}
                  >
                    →
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* COLUMN 3: Artist Showcase Card */}
          <div className="nav-col-right" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            paddingLeft: '3rem'
          }}>
            {/* Dynamic Release Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ 
                fontSize: '0.6rem', 
                color: 'var(--text-muted)', 
                letterSpacing: '0.15em', 
                textTransform: 'uppercase',
                fontFamily: 'var(--font-logo)'
              }}>
                Latest Releases
              </span>
              
              <div>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  color: '#fff', 
                  margin: 0, 
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} title={latestTrackTitle}>
                  {latestTrackTitle}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', textTransform: 'capitalize' }}>
                  {latestTrackDesc}
                </p>
              </div>

              <a 
                href={latestTrackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-element btn-minimal"
                style={{
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  display: 'block',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                Stream SoundCloud
              </a>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Follow MetArman
              </span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a 
                  href="https://www.instagram.com/metarman_?igsh=NTN1cXdiOGhxdmpi&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="interactive-element"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => e.target.style.color = '#fff'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Instagram
                </a>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>/</span>
                <a 
                  href="https://on.soundcloud.com/oqngfxz2pi0UPLVciJ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="interactive-element"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => e.target.style.color = '#fff'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  SoundCloud
                </a>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 992px) {
            .menu-overlay > .menu-content-grid {
              grid-template-columns: 1fr !important;
              gap: 2.5rem !important;
              padding-top: 100px !important;
              align-items: flex-start !important;
              min-height: auto !important;
            }
            .nav-col-left, .nav-col-right {
              display: none !important;
            }
            .nav-col-center {
              max-width: 600px;
              margin: 0 auto;
            }
          }
          @media (max-height: 760px) {
            .menu-content-grid {
              padding-top: 90px !important;
              gap: 1.5rem !important;
            }
            .menu-link {
              padding: 0.75rem 1rem !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Navbar;
