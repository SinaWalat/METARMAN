import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Music = ({ trackList = [] }) => {
  const containerRef = useRef(null);
  const playerIframeRef = useRef(null);
  const playerWidgetRef = useRef(null);
  const controllerWrapperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fallback tracks in case SoundCloud API takes time to load
  const fallbackTracks = [
    {
      id: 'fallback-1',
      title: 'Metarman - Darkpsy series #02 | This is hitech records. wav',
      duration: 3852000,
      genre: 'Darkpsy',
      artwork_url: 'https://i1.sndcdn.com/artworks-wR0Lh35L2q6H3L0L-5hN7ag-t500x500.jpg',
      permalink_url: 'https://soundcloud.com/metarman/metarman-darkpsy-series-02',
    },
    {
      id: 'fallback-2',
      title: 'Metarman - Darkpsy series #01 | This is hitech records. wav',
      duration: 4271000,
      genre: 'Darkpsy / Hitech',
      artwork_url: 'https://i1.sndcdn.com/artworks-y6lCea3JdZ4x3r9Z-q1m5eg-t500x500.jpg',
      permalink_url: 'https://soundcloud.com/metarman/metarman-darkpsy-series-01-this-is-hitech-records-wav',
    }
  ];

  useEffect(() => {
    // Scroll entrance animations
    gsap.fromTo(
      containerRef.current.querySelector('.music-header'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.music-header'),
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      containerRef.current.querySelector('.custom-playlist'),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.custom-playlist'),
          start: 'top 80%',
        },
      }
    );
  }, []);



  // Bind player events helper
  const bindPlayerEvents = (widget) => {
    if (!widget) return;
    try {
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
      });
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        setIsPlaying(false);
      });
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        setIsPlaying(false);
        setActiveIndex(null);
      });
    } catch (e) {
      console.error("Error binding player events:", e);
    }
  };

  // Initialize player widget
  useEffect(() => {
    let timer;
    const initPlayerWidget = () => {
      if (window.SC && playerIframeRef.current) {
        try {
          const widget = window.SC.Widget(playerIframeRef.current);
          playerWidgetRef.current = widget;
          bindPlayerEvents(widget);
          clearInterval(timer);
        } catch (err) {
          console.error("Error initializing player widget:", err);
        }
      }
    };

    initPlayerWidget();
    timer = setInterval(initPlayerWidget, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // GSAP animation for sliding the player controller up and down
  useEffect(() => {
    if (activeIndex !== null) {
      gsap.to(controllerWrapperRef.current, {
        height: 'auto',
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        display: 'block',
      });
    } else {
      gsap.to(controllerWrapperRef.current, {
        height: 0,
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          if (controllerWrapperRef.current) {
            controllerWrapperRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [activeIndex]);

  const handlePlayPause = (track, index) => {
    const playerWidget = playerWidgetRef.current;
    if (!playerWidget) return;

    if (activeIndex === index) {
      if (isPlaying) {
        playerWidget.pause();
        setIsPlaying(false);
      } else {
        playerWidget.play();
        setIsPlaying(true);
      }
    } else {
      setActiveIndex(index);
      setIsPlaying(true);
      
      // Load track URL directly in the widget and re-bind events
      playerWidget.load(track.permalink_url, {
        auto_play: true,
        color: 'ff5500',
        hide_related: true,
        show_comments: false,
        show_user: true,
        show_reposts: false,
        show_teaser: false,
        callback: () => {
          bindPlayerEvents(playerWidget);
        }
      });
    }
  };

  // Cleaner title formatting to match B&W design aesthetics
  const cleanTitle = (title) => {
    return title
      .replace(/Metarman\s*-\s*/gi, '')
      .replace(/\|\s*This is hitech records.*/gi, '')
      .replace(/\.wav$/gi, '')
      .trim()
      .toUpperCase();
  };

  const getSubTitle = (title) => {
    if (title.toLowerCase().includes('hitech records')) {
      return 'THIS IS HITECH RECORDS';
    }
    return 'METARMAN';
  };

  const getPlayCount = (track) => {
    if (track.playback_count) {
      return track.playback_count.toLocaleString();
    }
    // Hardcoded fallback counts matching the user screenshot
    if (track.id === 'fallback-1' || track.title.includes('series #02') || track.title.includes('series-02')) {
      return '82';
    }
    return '558';
  };

  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds;
    if (hours > 0) {
      const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${minutesStr}:${secondsStr}`;
    }
    return `${minutes}:${secondsStr}`;
  };

  const getArtwork = (url) => {
    if (!url) return 'https://i1.sndcdn.com/avatars-iqVckR2IlesHKiQY-BbJTfQ-t500x500.jpg';
    return url.replace('-large', '-t500x500');
  };

  const displayTracks = (trackList.length > 0 ? trackList : fallbackTracks).slice(0, 8);
  const activeTrack = displayTracks[activeIndex];

  return (
    <section id="music" ref={containerRef} className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="music-header" style={{ marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.25em', display: 'block', marginBottom: '0.5rem' }}>02 / SOUNDS</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>SETS & RELEASES</h2>
          <p style={{ marginTop: '1rem', maxWidth: '600px', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Listen to official releases, podcasts, and darkpsy series streamed directly from SoundCloud.
          </p>
        </div>



        {/* Custom Premium Track List Grid */}
        <div 
          className="custom-playlist"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid var(--border-color)',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {displayTracks.map((track, index) => {
            const isCurrentActive = activeIndex === index;
            const isTrackPlaying = isCurrentActive && isPlaying;
            
            return (
              <div
                key={track.id}
                className={`track-row interactive-element ${isCurrentActive ? 'active' : ''}`}
                onClick={() => handlePlayPause(track, index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.2rem 1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  gap: '1.5rem',
                  position: 'relative',
                  backgroundColor: isCurrentActive ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                  transition: 'background-color 0.4s ease, border-color 0.4s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  const img = e.currentTarget.querySelector('.track-artwork');
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isCurrentActive ? 'rgba(255, 255, 255, 0.02)' : 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  const img = e.currentTarget.querySelector('.track-artwork');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Small Track Real-Color Artwork */}
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    display: 'block',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <img
                    className="track-artwork"
                    src={getArtwork(track.artwork_url)}
                    alt={track.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  {/* Hover play icon indicator inside artwork */}
                  <div
                    className="artwork-hover-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {isTrackPlaying ? (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Track content wrapper with responsive layout */}
                <div className="track-content">
                  {/* Track details (Clean title, subtitle/genre) */}
                  <div className="track-details">
                    <h4 
                      style={{ 
                        fontSize: '1rem', 
                        letterSpacing: '0.01em', 
                        color: isCurrentActive ? '#fff' : 'var(--text-primary)',
                        transition: 'color 0.3s',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-title)',
                      }}
                    >
                      {cleanTitle(track.title)}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{getSubTitle(track.title)}</span>
                      <span>•</span>
                      <span>{track.genre || 'Darkpsy'}</span>
                    </div>
                  </div>

                  {/* Play Count, Status Icon, and Duration */}
                  <div className="track-meta">
                    {/* Play Count Indicator & Audio Wave Symbol */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem' }}>
                      {isCurrentActive ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '10px', width: '10px' }}>
                            <div style={{ width: '2px', height: '100%', backgroundColor: '#ff5500', transformOrigin: 'bottom', animation: isTrackPlaying ? 'mini-eq 0.5s ease infinite alternate' : 'none', animationDelay: '0.1s' }} />
                            <div style={{ width: '2px', height: '100%', backgroundColor: '#ff5500', transformOrigin: 'bottom', animation: isTrackPlaying ? 'mini-eq 0.7s ease infinite alternate' : 'none', animationDelay: '0.3s' }} />
                            <div style={{ width: '2px', height: '100%', backgroundColor: '#ff5500', transformOrigin: 'bottom', animation: isTrackPlaying ? 'mini-eq 0.4s ease infinite alternate' : 'none', animationDelay: '0.2s' }} />
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>VIEW TRACK</span>
                          <span style={{ color: '#ff5500', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '0.65rem' }}>►</span>{getPlayCount(track)}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>►</span>{getPlayCount(track)}
                        </span>
                      )}
                    </div>

                    {/* Track Duration */}
                    <div 
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        color: isCurrentActive ? '#fff' : 'var(--text-muted)',
                        width: '70px',
                        textAlign: 'right',
                      }}
                    >
                      {formatDuration(track.duration)}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Dynamic SoundCloud Player Controller (Shown below list when active) */}
        <div
          ref={controllerWrapperRef}
          style={{
            marginTop: '2.5rem',
            width: '100%',
            maxWidth: '1200px',
            margin: '2.5rem auto 0 auto',
            border: '1px solid var(--border-color)',
            background: 'rgba(10, 10, 10, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '1.25rem',
            borderRadius: '4px',
            display: 'none', // Controlled by GSAP
            opacity: 0,
            transform: 'translateY(30px)',
            overflow: 'hidden',
          }}
        >
          {/* Controller Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ff5500',
                  display: 'inline-block',
                  animation: 'pulse-orange 1.5s infinite alternate',
                }}
              />
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  fontFamily: 'var(--font-title)',
                }}
              >
                NOW PLAYING
              </span>
            </div>
            <button
              onClick={() => {
                if (playerWidgetRef.current) {
                  playerWidgetRef.current.pause();
                }
                setActiveIndex(null);
                setIsPlaying(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.1em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              CLOSE PLAYER
            </button>
          </div>

          {/* Iframe wrapper with relative positioning for artwork overlay */}
          <div style={{ position: 'relative', width: '100%', height: '166px', overflow: 'hidden' }}>
            {/* SoundCloud Player backend */}
            <iframe
              ref={playerIframeRef}
              id="sc-player"
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/metarman/metarman-darkpsy-series-02&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                filter: 'invert(1) hue-rotate(180deg)',
              }}
            ></iframe>

            {/* Real-color artwork overlay */}
            {activeTrack && activeTrack.artwork_url && (
              <div
                className="player-artwork-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '166px',
                  height: '166px',
                  pointerEvents: 'none',
                  backgroundColor: '#000',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src={getArtwork(activeTrack.artwork_url)}
                  alt="Track Artwork"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* SoundCloud Direct CTA Profile Link */}
        <div style={{ marginTop: '4.5rem', textAlign: 'center' }}>
          <a
            href="https://on.soundcloud.com/oqngfxz2pi0UPLVciJ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-minimal interactive-element"
            style={{
              padding: '0.9rem 2.25rem',
              fontSize: '0.85rem',
            }}
          >
            Visit SoundCloud Profile 
            <svg 
              viewBox="0 0 24 24" 
              width="12" 
              height="12" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ display: 'inline-block', marginLeft: '8px', verticalAlign: 'middle' }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

      </div>

      {/* Embedded keyframes and styles */}
      <style>{`
        @keyframes mini-eq {
          0% { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
        @keyframes pulse-orange {
          0% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.15); }
        }
        .track-row:hover .artwork-hover-overlay {
          opacity: 1 !important;
        }
        .track-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-grow: 1;
          gap: 1.5rem;
          min-width: 0;
        }
        .track-details {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .track-meta {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .track-row {
            padding: 1rem 0.75rem !important;
            gap: 1rem !important;
          }
          .track-content {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem !important;
          }
          .track-meta {
            justify-content: space-between;
            gap: 1rem !important;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 0.5rem;
          }
          .player-artwork-overlay {
            width: 120px !important;
            height: 120px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Music;
