import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus, ArrowRight } from 'lucide-react';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fullBioRef = useRef(null);
  const sectionRef = useRef(null);
  const genreGridRef = useRef(null);

  useEffect(() => {
    // ScrollTrigger animation for section header and paragraphs
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector('.about-header'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section.querySelector('.about-header'),
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    gsap.fromTo(
      section.querySelectorAll('.about-intro-text p'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section.querySelector('.about-intro-text'),
          start: 'top 80%',
        },
      }
    );

    // Grid items reveal
    gsap.fromTo(
      genreGridRef.current.querySelectorAll('.genre-card'),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: genreGridRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);

  const toggleBio = () => {
    const content = fullBioRef.current;
    if (!content) return;

    if (!isExpanded) {
      // Animate expand
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.8, ease: 'power3.inOut' }
      );
    } else {
      // Animate collapse
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
      });
    }
    setIsExpanded(!isExpanded);
  };

  const genres = [
    {
      title: 'Darkpsy',
      bpm: '145 - 160 BPM',
      desc: 'Intense, fast-paced psychedelic soundscapes combined with organic, mind-bending sound design.',
    },
    {
      title: 'Dark Progressive',
      bpm: '135 - 142 BPM',
      desc: 'Driving, hypnotic grooves, deep progressive structures, and dark, atmospheric environments.',
    },
    {
      title: 'Techno',
      bpm: '130 - 135 BPM',
      desc: 'Raw, industrial energy mixed with driving basslines and repeating modular synth patterns.',
    },
    {
      title: 'Minimal Techno',
      bpm: '125 - 128 BPM',
      desc: 'Stripped-back, micro-sonic rhythms, precise mechanical loops, and space-focused design.',
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="section">
      <div className="container">
        
        {/* Row 1: Section Title */}
        <div className="about-header" style={{ marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.25em', display: 'block', marginBottom: '0.5rem' }}>01 / PROFILE</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>THE SONIC ARCHITECT</h2>
        </div>

        {/* Row 2: Short Biography & Expand Button */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', marginBottom: '6rem' }}>
          <div className="about-intro-text" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              METARMAN is an electronic DJ from Erbil, Iraq, known for his high-energy performances and powerful fusion of Darkpsy, Dark Progressive, Techno, and Minimal Techno. Active since 2016, he has established himself as one of Iraq’s leading electronic music artists, gaining recognition for his dynamic mixing style and uplifting yet intense sonic journeys.
            </p>
            <p>
              Over the years, METARMAN has performed at renowned festivals including Tree of Life Festival (Turkey), Back to Nature, September Ritual, Oceanic Avalanche, and Soulescape, as well as at Club Inferno (Erbil). With releases and recordings featured on This Is Hitech, he continues to push the boundaries of underground electronic music while representing Iraq’s growing international electronic scene.
            </p>

            {/* Read More button */}
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={toggleBio}
                className="interactive-element"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.opacity = 0.7}
                onMouseLeave={(e) => e.target.style.opacity = 1}
              >
                {isExpanded ? (
                  <>
                    Collapse Biography <Minus size={14} />
                  </>
                ) : (
                  <>
                    Read Full Biography <Plus size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Full Biography Drawer */}
          <div
            ref={fullBioRef}
            style={{
              height: 0,
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                paddingTop: '2.5rem',
                borderTop: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p>
                  METARMAN (Arman) is one of the most recognized names in Iraq's underground electronic music movement. Since beginning his journey behind the decks in 2016, he has built a reputation for delivering electrifying performances that blend technical precision, powerful energy, and deep musical storytelling.
                </p>
                <p>
                  Specializing in Darkpsy, Dark Progressive, Techno, and Minimal Techno, METARMAN crafts immersive sets that take audiences through intense, driving rhythms and uplifting atmospheres. His unique approach combines underground sounds with high-impact performance energy, creating unforgettable dancefloor experiences.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p>
                  Throughout his career, METARMAN has performed at respected festivals including Tree of Life Festival (Turkey), Back to Nature, September Ritual, Oceanic Avalanche, and Soulescape. As one of the few Iraqi DJs to gain international exposure within the underground scene, METARMAN plays a significant role in expanding the visibility of Iraqi electronic music culture.
                </p>
                <p>
                  Recognized for his exceptional technical skills, infectious stage presence, and relentless dedication to his craft, METARMAN continues to push boundaries and inspire a new generation. Today, he stands as one of Iraq's leading electronic artists, carrying the country's underground sound onto international stages while remaining committed to the growth of the regional scene.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Interactive Genre Showcase */}
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.25em', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>CORE SONIC GENRES</span>
          
          <div
            ref={genreGridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              backgroundColor: '#000000',
              border: '1px solid var(--border-color)',
            }}
          >
            {genres.map((g) => (
              <div
                key={g.title}
                className="genre-card interactive-element"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  padding: '2.5rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.4s ease, color 0.4s ease',
                  minHeight: '260px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.querySelector('.genre-title').style.color = '#000000';
                  e.currentTarget.querySelector('.genre-bpm').style.color = '#52525b';
                  e.currentTarget.querySelector('.genre-desc').style.color = '#18181b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-color)';
                  e.currentTarget.querySelector('.genre-title').style.color = '#ffffff';
                  e.currentTarget.querySelector('.genre-bpm').style.color = 'var(--text-muted)';
                  e.currentTarget.querySelector('.genre-desc').style.color = 'var(--text-secondary)';
                }}
              >
                <div>
                  <div
                    className="genre-bpm"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.1em',
                      marginBottom: '0.5rem',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    {g.bpm}
                  </div>
                  <h3
                    className="genre-title"
                    style={{
                      fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                      lineHeight: '1.2',
                      color: '#ffffff',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    {g.title}
                  </h3>
                </div>
                
                <p
                  className="genre-desc"
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
