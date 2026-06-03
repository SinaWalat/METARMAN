import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 1.8 }
    );
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

        {/* Links */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
          }}
          className="nav-links-container"
        >
          {['about', 'music', 'shows', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="interactive-element"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                padding: '0.5rem 0',
                position: 'relative',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Socials */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
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
            {/* SoundCloud custom SVG */}
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
        </div>
      </div>
      
      {/* Mobile nav CSS override */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links-container {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
