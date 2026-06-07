import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ALL_SHOWS = [
  {
    event: 'TREE OF LIFE',
    location: 'Datça, Turkey',
    dateDisplay: '25 - 30 JUNE',
    endDate: '2026-06-30',
    type: 'UPCOMING',
  },
  {
    event: 'KARMA FESTIVAL',
    location: 'Izmir, Turkey',
    dateDisplay: '27 - 31 AUGUST',
    endDate: '2026-08-31',
    type: 'UPCOMING',
  },
  {
    event: 'AHOORA FESTIVAL',
    location: 'Antalya, Turkey',
    dateDisplay: '2 - 6 SEPTEMBER',
    endDate: '2026-09-06',
    type: 'UPCOMING',
  },
  {
    event: 'TREE OF LIFE FESTIVAL',
    location: 'Turkey',
    year: 'FEATURED',
    endDate: '2025-06-30',
  },
  {
    event: 'CLUB INFERNO',
    location: 'Erbil, Iraq',
    year: 'RESIDENCY',
    endDate: '2025-12-31',
  },
  {
    event: 'BACK TO NATURE',
    location: 'Regional',
    year: 'FESTIVAL',
    endDate: '2025-09-30',
  },
  {
    event: 'SEPTEMBER RITUAL',
    location: 'Regional',
    year: 'FESTIVAL',
    endDate: '2025-09-15',
  },
  {
    event: 'OCEANIC AVALANCHE',
    location: 'Regional',
    year: 'FESTIVAL',
    endDate: '2025-08-20',
  },
  {
    event: 'SOULESCAPE',
    location: 'Regional',
    year: 'FESTIVAL',
    endDate: '2025-07-15',
  },
];

const Events = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingGigs = ALL_SHOWS.filter(gig => gig.endDate >= todayStr);
  const pastGigs = ALL_SHOWS.filter(gig => gig.endDate < todayStr);

  const formattedPastGigs = pastGigs.map(gig => {
    if (gig.type === 'UPCOMING') {
      return {
        ...gig,
        year: 'FESTIVAL',
        dateDisplay: gig.endDate.split('-')[0],
      };
    }
    return gig;
  });

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
      containerRef.current.querySelectorAll('.gig-item'),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
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
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>SHOWS & TIMELINE</h2>
        </div>

        {/* Timeline Table/Grid */}
        <div
          ref={timelineRef}
          className="shows-container-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Subsection: Upcoming Events */}
          {upcomingGigs.length > 0 && (
            <div style={{ marginBottom: '5rem' }}>
              <h3 style={{ fontSize: '1.2rem', letterSpacing: '0.15em', marginBottom: '2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }} className="live-dot" />
                UPCOMING EVENTS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-color)' }}>
                {upcomingGigs.map((gig, idx) => (
                  <div
                    key={idx}
                    className="gig-item interactive-element"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '160px 2fr 1.5fr 1fr',
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
                    {/* Date Tag */}
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        letterSpacing: '0.15em',
                        border: '1px solid var(--border-color)',
                        padding: '0.25rem 0.5rem',
                        width: 'fit-content',
                        borderRadius: '2px',
                        textAlign: 'center',
                      }}
                    >
                      {gig.dateDisplay}
                    </div>

                    {/* Event Name */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', letterSpacing: '0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gig-icon" style={{ color: 'var(--text-muted)', transition: 'transform 0.6s ease, color 0.4s ease' }}>
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {gig.event}
                      </h4>
                    </div>

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{gig.location}</span>
                    </div>

                    {/* Visual Status Indicator (Pulsing Green for Live) */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <div className="gig-pulsing-dot" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subsection: Past Notable Shows */}
          <div>
            <h3 style={{ fontSize: '1.2rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--text-muted)' }}>
              NOTABLE SHOWS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-color)' }}>
              {formattedPastGigs.map((gig, idx) => (
                <div
                  key={idx}
                  className="gig-item interactive-element"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 2fr 1.5fr 1fr',
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
                    {gig.year || gig.dateDisplay}
                  </div>

                  {/* Event Name */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.25rem', letterSpacing: '0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gig-icon" style={{ color: 'var(--text-muted)', transition: 'transform 0.6s ease, color 0.4s ease' }}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {gig.event}
                    </h4>
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
        </div>

      </div>

      {/* Responsive adjustments & Animations */}
      <style>{`
        .gig-pulsing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #22c55e;
          box-shadow: 0 0 10px #22c55e;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        @media (max-width: 900px) {
          .gig-item {
            grid-template-columns: 1fr !important;
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
