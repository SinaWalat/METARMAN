import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  const gigs = [
    {
      event: 'TREE OF LIFE FESTIVAL',
      location: 'Turkey',
      year: 'FEATURED',
      role: 'Main Stage / Darkpsy & Dark Progressive Set',
    },
    {
      event: 'CLUB INFERNO',
      location: 'Erbil, Iraq',
      year: 'RESIDENCY',
      role: 'Resident DJ / Techno & Minimal Techno Nights',
    },
    {
      event: 'BACK TO NATURE',
      location: 'Regional',
      year: 'FESTIVAL',
      role: 'Co-Headliner / Dark Progressive Journey',
    },
    {
      event: 'SEPTEMBER RITUAL',
      location: 'Regional',
      year: 'FESTIVAL',
      role: 'Special Darkpsy Sunset Session',
    },
    {
      event: 'OCEANIC AVALANCHE',
      location: 'Regional',
      year: 'FESTIVAL',
      role: 'Outdoor Rave / High-Energy Techno Set',
    },
    {
      event: 'SOULESCAPE',
      location: 'Regional',
      year: 'FESTIVAL',
      role: 'Closing Set / Minimal Techno & Psychedelic',
    },
  ];

  useEffect(() => {
    // Header trigger
    gsap.fromTo(
      containerRef.current.querySelector('.events-header'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.events-header'),
          start: 'top 80%',
        },
      }
    );

    // Timeline rows stagger
    gsap.fromTo(
      timelineRef.current.querySelectorAll('.gig-item'),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section id="shows" ref={containerRef} className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="events-header" style={{ marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.25em', display: 'block', marginBottom: '0.5rem' }}>03 / TIMELINE</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>NOTABLE SHOWS</h2>
        </div>

        {/* Timeline Table/Grid */}
        <div
          ref={timelineRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {gigs.map((gig, idx) => (
            <div
              key={idx}
              className="gig-item interactive-element"
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 2fr 1.5fr 1fr',
                padding: '2rem 0',
                borderBottom: '1px solid var(--border-color)',
                alignItems: 'center',
                gap: '2rem',
                transition: 'border-color 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.querySelector('.gig-icon').style.transform = 'rotate(180deg)';
                e.currentTarget.querySelector('.gig-icon').style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.querySelector('.gig-icon').style.transform = 'rotate(0deg)';
                e.currentTarget.querySelector('.gig-icon').style.color = 'var(--text-muted)';
              }}
            >
              {/* Year/Category tag */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.15em',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.5rem',
                  width: 'fit-content',
                  borderRadius: '2px',
                  textAlign: 'center',
                }}
              >
                {gig.year}
              </div>

              {/* Event Name & Role */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h4 style={{ fontSize: '1.25rem', letterSpacing: '0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gig-icon" style={{ color: 'var(--text-muted)', transition: 'transform 0.6s ease, color 0.4s ease' }}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {gig.event}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{gig.role}</p>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{gig.location}</span>
              </div>

              {/* Visual Status Indicator */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 8px #ffffff',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 900px) {
          .gig-item {
            grid-template-columns: 1fr;
            gap: 0.75rem !important;
            padding: 1.5rem 0 !important;
          }
          .gig-item > div:nth-child(4) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Events;
