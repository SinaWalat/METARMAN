import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Gallery = ({ onBack }) => {
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const IMAGES_PER_PAGE = 6;

  const openLightbox = (index) => {
    setActivePhotoIndex(index);
    setActivePhoto(images[index]);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
    setActivePhotoIndex(-1);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    if (images.length === 0) return;
    const newIndex = activePhotoIndex > 0 ? activePhotoIndex - 1 : images.length - 1;
    setActivePhotoIndex(newIndex);
    setActivePhoto(images[newIndex]);
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    if (images.length === 0) return;
    const newIndex = activePhotoIndex < images.length - 1 ? activePhotoIndex + 1 : 0;
    setActivePhotoIndex(newIndex);
    setActivePhoto(images[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === -1) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, images]);

  // Scroll to top when page changes (skip initial mount)
  const isInitialPageMount = useRef(true);
  useEffect(() => {
    if (isInitialPageMount.current) {
      isInitialPageMount.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    // Scroll to top when gallery is opened
    window.scrollTo(0, 0);

    // GSAP entrance animation
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current.querySelector('.press-header'),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
    );

    // Fetch Google Drive images from our local API route
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/press-images?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        
        const imageDetails = {
          '1P1h0JSsEubCr0g9NqlJ0PgA8KTtV3o1b': { name: 'Live Set - Psychedelic Stage', priority: 1 },
          '1yDTyJ5FPiTR1Out3zqN4MF2Gwm-u6tTZ': { name: 'Mainstage Close-up', priority: 2 },
          '1UZJrQ4V-BWUb_e2MpGrX4WJTw_9B7EEB': { name: 'Festival Performance (B&W)', priority: 3 },
          '1ekOC-PsLlXFBbxqJ8YpZpmdv0dS84X3V': { name: 'Met Arman Portrait (Sunset)', priority: 4 },
          '1-wldzvhoBN8jrKhXLDEU7kQK0YZ_CkbY': { name: 'DJ Set - Open Air', priority: 5 },
          '1Ctr-7uWWJi0NyZGsSU6sQOuKWN4t_RxA': { name: 'Live Vibe - Summer Stage', priority: 6 },
          '168BM-lRL8qYS8IXdCo4SL-1s1I_-1pU-': { name: 'Studio Portrait Shot', priority: 7 },
          '184Kl8thjNL7BmZUrreye5vjEyS5tGert': { name: 'Club Set - Warm Lights', priority: 8 },
          '1YSwy2GYbULN0ULl0fEaGddxLeNHgorML': { name: 'Club Set - Green Visuals', priority: 9 },
          '1YIlyoeB_48IHRZD0JTFPub6QaozPom1I': { name: 'Live Performance Portrait', priority: 10 },
          '1NJ7dLbd74y-51j2UQrxNHNxfu2f0lqYC': { name: 'Met Arman Promo (Neon)', priority: 11 },
          '17_iUNBDKyXbcxlO22cgJZpuHv-GQNwWK': { name: 'Forest Stage Vibe', priority: 12 }
        };

        const mappedData = data.map(img => {
          const detail = imageDetails[img.id] || { name: img.name, priority: 100 };
          return {
            ...img,
            name: detail.name,
            priority: detail.priority
          };
        }).sort((a, b) => a.priority - b.priority);

        setImages(mappedData);
      } catch (err) {
        console.warn('Google Drive API is not active or failed. Using fallback link.', err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        paddingTop: '120px',
        paddingBottom: '100px',
        minHeight: '100vh',
        backgroundColor: '#000000',
        position: 'relative',
        zIndex: activePhoto ? 10000 : 5,
      }}
    >
      <div className="container">
        {/* Gallery Header */}
        <div className="press-header" style={{ marginBottom: '5rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.25em',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            MEDIA & ASSETS
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--font-logo)' }}>
            GALLERY
          </h1>
          <p style={{ marginTop: '1.5rem', maxWidth: '600px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Official promotional photos, event posters, and live performance assets. View and download high-resolution files.
          </p>
        </div>

        {/* Dynamic Display based on Loading & Configuration state */}
        {loading ? (
          /* Premium Loading Animation */
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            gap: '2rem'
          }}>
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              {/* Outer pulsing ring */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.05)',
                boxSizing: 'border-box'
              }} />
              {/* Spinning glowing arc */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTopColor: '#fff',
                  boxSizing: 'border-box',
                  animation: 'spin 1s linear infinite'
                }} 
              />
              {/* Inner pulsing dot */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0 0 15px #fff',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            </div>

            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.3em', 
              fontFamily: 'var(--font-logo)',
              textTransform: 'uppercase',
              animation: 'textPulse 2s ease-in-out infinite'
            }}>
              LOADING GALLERY
            </span>

            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
              }
              @keyframes textPulse {
                0%, 100% { opacity: 0.5; letter-spacing: 0.3em; }
                50% { opacity: 1; letter-spacing: 0.35em; color: #fff; }
              }
            `}</style>
          </div>
        ) : hasError || images.length === 0 ? (
          /* Fallback: Direct Google Drive link card */
          <div 
            className="press-section" 
            style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-card)', 
              maxWidth: '650px', 
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem'
            }}
          >
            <h3 style={{ fontSize: '1.35rem', color: '#fff', letterSpacing: '0.05em' }}>GOOGLE DRIVE GALLERY ASSETS</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '500px' }}>
              All high-resolution promo photos, press shots, and poster design graphics are hosted directly in our official Google Drive folder. Promoter teams can view and download all files.
            </p>
            <a
              href="https://drive.google.com/drive/folders/1uJ-YNrC8Gdm4-ugiBHmP-vF5IisV8D26"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-minimal interactive-element"
              style={{ 
                padding: '1rem 2.5rem', 
                fontSize: '0.85rem', 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Open Google Drive Folder 
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        ) : (
          /* Dynamic Grid of Images fetched from Google Drive */
          <div className="press-section" style={{ marginBottom: '6rem' }}>
            {/* Title Row with Pagination */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <h2
                className="gallery-section-title"
                style={{
                  fontSize: '1.25rem',
                  letterSpacing: '0.15em',
                  color: '#fff',
                  margin: 0,
                }}
              >
                01 / GALLERY IMAGES
              </h2>

              {/* Pagination Controls */}
              {images.length > IMAGES_PER_PAGE && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {/* Previous Arrow */}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                    }}
                    disabled={currentPage === 1}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                      padding: '0.4rem 0.65rem',
                      cursor: currentPage === 1 ? 'default' : 'pointer',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1,
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#fff';
                    }}
                  >
                    ←
                  </button>



                  {/* Next Arrow */}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(Math.ceil(images.length / IMAGES_PER_PAGE), p + 1));
                    }}
                    disabled={currentPage === Math.ceil(images.length / IMAGES_PER_PAGE)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: currentPage === Math.ceil(images.length / IMAGES_PER_PAGE) ? 'rgba(255,255,255,0.2)' : '#fff',
                      padding: '0.4rem 0.65rem',
                      cursor: currentPage === Math.ceil(images.length / IMAGES_PER_PAGE) ? 'default' : 'pointer',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1,
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== Math.ceil(images.length / IMAGES_PER_PAGE)) {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#000';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = currentPage === Math.ceil(images.length / IMAGES_PER_PAGE) ? 'rgba(255,255,255,0.2)' : '#fff';
                    }}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2.5rem',
              }}
            >
              {(() => {
                const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
                const startIdx = (currentPage - 1) * IMAGES_PER_PAGE;
                const paginatedImages = images.slice(startIdx, startIdx + IMAGES_PER_PAGE);
                return paginatedImages.map((photo, localIndex) => {
                  const globalIndex = startIdx + localIndex;
                  return (
                <div
                  key={photo.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'border-color 0.3s ease, transform 0.3s ease'
                  }}
                  className="interactive-element gallery-card"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-color-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                >
                  {/* Image Preview Container */}
                  <div
                    onClick={() => openLightbox(globalIndex)}
                    style={{
                      position: 'relative',
                      aspectRatio: '3/2',
                      backgroundColor: '#111',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={`/api/image-proxy?id=${photo.id}&width=800`}
                      alt={photo.name}
                      className="gallery-card-img"
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%)',
                        willChange: 'transform, opacity'
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                  </div>
                  {/* Image Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {photo.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                      {photo.size}
                    </span>
                  </div>
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => openLightbox(globalIndex)}
                      className="btn-minimal interactive-element"
                      style={{
                        padding: '0.75rem',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        flex: 1,
                        cursor: 'pointer',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#fff';
                      }}
                    >
                      View
                    </button>
                    <a
                      href={`https://drive.google.com/uc?export=download&id=${photo.id}`}
                      className="btn-minimal interactive-element"
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        flex: 1,
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        border: '1px solid var(--border-color)',
                        textDecoration: 'none',
                        color: '#fff',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#fff';
                      }}
                    >
                      Download
                    </a>
                  </div>
                </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 10000,
              fontFamily: 'monospace',
            }}
            className="interactive-element"
          >
            ✕
          </button>

          {/* Image wrapper with integrated Prev/Next buttons centered vertically relative to the image */}
          <div
            className="lightbox-img-wrapper"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button (Centered vertically relative to the image wrapper) */}
            <button
              onClick={showPrev}
              style={{
                position: 'absolute',
                left: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                fontSize: '1.1rem',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              className="interactive-element lightbox-btn-prev"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              ←
            </button>

            {/* Next Button (Centered vertically relative to the image wrapper) */}
            <button
              onClick={showNext}
              style={{
                position: 'absolute',
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                fontSize: '1.1rem',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              className="interactive-element lightbox-btn-next"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              →
            </button>

            <img
              src={`/api/image-proxy?id=${activePhoto.id}&width=1600`}
              alt={activePhoto.name}
              className="lightbox-img"
              style={{
                maxWidth: '85%',
                objectFit: 'contain',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Details overlay below the image */}
          <div
            className="lightbox-details"
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              color: '#fff',
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1rem', letterSpacing: '0.05em', fontFamily: 'var(--font-logo)' }}>
              {activePhoto.name}
            </h3>
            <a
              href={`https://drive.google.com/uc?export=download&id=${activePhoto.id}`}
              className="btn-minimal interactive-element lightbox-download-btn"
              style={{
                padding: '0.75rem 2.5rem',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                textDecoration: 'none',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              DOWNLOAD HIGH-RES
            </a>
          </div>
        </div>
      )}
      <style>{`
        .gallery-card-img {
          opacity: 0;
          transition: opacity 0.6s ease, transform 0.5s ease;
        }
        .lightbox-img-wrapper {
          max-height: 65vh;
        }
        .lightbox-img {
          max-height: 65vh;
        }
        @media (max-height: 760px) {
          .lightbox-img-wrapper {
            max-height: 60vh !important;
          }
          .lightbox-img {
            max-height: 60vh !important;
          }
          .lightbox-details {
            margin-top: 1rem !important;
            gap: 0.5rem !important;
          }
          .lightbox-download-btn {
            padding: 0.55rem 1.5rem !important;
            font-size: 0.75rem !important;
          }
        }
        @media (max-height: 560px) {
          .lightbox-img-wrapper {
            max-height: 54vh !important;
          }
          .lightbox-img {
            max-height: 54vh !important;
          }
          .lightbox-details {
            margin-top: 0.75rem !important;
            gap: 0.35rem !important;
          }
          .lightbox-download-btn {
            padding: 0.45rem 1.25rem !important;
            font-size: 0.7rem !important;
          }
        }
        @media (max-width: 768px) {
          .lightbox-btn-prev {
            left: 1rem !important;
          }
          .lightbox-btn-next {
            right: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Gallery;
