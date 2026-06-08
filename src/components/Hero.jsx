import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';


const Hero = ({ isFirstLoad = true }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const dividerRef = useRef(null);


  useEffect(() => {
    const animDelay = isFirstLoad ? 1.8 : 0.2;
    const tl = gsap.timeline({ delay: animDelay });

    // 1. Genre tags fade in one by one
    const tags = subtitleRef.current.querySelectorAll('.genre-tag');
    tl.fromTo(
      tags,
      { opacity: 0, y: 15, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(1.7)' }
    );

    // 2. Title letters slide up individually
    const letters = titleRef.current.querySelectorAll('.hero-letter');
    tl.fromTo(
      letters,
      { y: '110%', opacity: 0, rotateX: 40 },
      {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 0.45,
        stagger: 0.03,
        ease: 'power4.out',
      }
    );

    // 3. Title glow pulse (non-blocking)
    gsap.fromTo(
      titleRef.current,
      { textShadow: '0 0 0px rgba(255, 255, 255, 0)' },
      {
        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        duration: 0.4,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
        delay: animDelay + tl.duration(),
      }
    );

    // 4. Divider line wipes in from left
    tl.fromTo(
      dividerRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.35, ease: 'power3.inOut' }
    );

    // 5. Stat items slide up with stagger
    const statItems = statsRef.current.querySelectorAll('.stat-item');
    tl.fromTo(
      statItems,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'power3.out' }
    );

    // 6. CTA button slides up from bottom
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    );



    // Subtle float on genre tags
    gsap.to(tags, {
      y: -3,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
      delay: 2.5,
    });

  }, []);

  const scrollToMusic = () => {
    const el = document.getElementById('music');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const titleLetters = 'METARMAN'.split('');

  return (
    <section
      id="home"
      ref={containerRef}
      style={{
        minHeight: 'max(100vh, 700px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 5,
        paddingTop: '80px',
        paddingBottom: '120px',
        overflow: 'hidden',
      }}
    >
      {/* Background Image – Black & White */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <img
          src="/METARMAN.jpeg"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'grayscale(100%) contrast(1.1)',
            display: 'block',
          }}
        />
      </div>
      {/* Bottom fade to black transition */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '35%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, #000000 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div className="container" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Genre Tags */}
        <div 
          ref={subtitleRef}
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {['DARKPSY', 'DARK PROGRESSIVE', 'TECHNO', 'MINIMAL TECHNO', 'TECH HOUSE', 'TECHNO DANCE'].map((genre) => (
            <span
              key={genre}
              className="genre-tag"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.75rem',
                borderRadius: '2px',
                opacity: 0,
              }}
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Huge Headline – letter by letter */}
        <h1
          ref={titleRef}
          className="glow-text hero-title"
          style={{
            lineHeight: 0.9,
            fontWeight: 700,
            fontFamily: 'var(--font-logo)',
            margin: '0 0 2rem 0',
            letterSpacing: '-0.02em',
            display: 'flex',
            width: '100%',
            perspective: '600px',
          }}
        >
          <div className="word-mask" style={{ overflow: 'hidden', height: '1.2em', display: 'flex', width: '100%' }}>
            {titleLetters.map((letter, i) => (
              <span
                key={i}
                className="hero-letter"
                style={{
                  display: 'inline-block',
                  transform: 'translateY(110%)',
                  opacity: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </h1>

        <style>{`
          .hero-title {
            font-size: 85px;
          }
          @media (max-width: 1024px) {
            .hero-title {
              font-size: 65px;
            }
          }
          @media (max-width: 768px) {
            .hero-title {
              font-size: 45px;
            }
          }
          @media (max-width: 565px) {
            .hero-title {
              font-size: 30px;
            }
          }
          @media (max-width: 480px) {
            .hero-title {
              font-size: 26px;
            }
          }
        `}</style>

        {/* Animated Divider */}
        <div
          ref={dividerRef}
          style={{
            width: '100%',
            height: '1px',
            background: 'var(--border-color)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />

        {/* Stat Items */}
        <div
          ref={statsRef}
          style={{
            display: 'flex',
            gap: '4rem',
            paddingTop: '2.5rem',
            marginTop: '0',
            flexWrap: 'wrap',
          }}
        >
          <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ROLE</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>DJ</span>
          </div>
          <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LOCATION</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>ERBIL, IRAQ</span>
          </div>
          <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ORIGIN</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>ACTIVE SINCE 2016</span>
          </div>
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} style={{ marginTop: '3.5rem', opacity: 0 }}>
          <button
            onClick={scrollToMusic}
            className="btn-minimal interactive-element"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '0.85rem',
            }}
          >
            Explore Sound <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </div>

      </div>


    </section>
  );
};

export default Hero;
