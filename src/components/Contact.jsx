import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    // Header reveal
    gsap.fromTo(
      containerRef.current.querySelector('.contact-header'),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.contact-header'),
          start: 'top 80%',
        },
      }
    );

    // Form and Info side reveal
    gsap.fromTo(
      containerRef.current.querySelectorAll('.contact-col'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.contact-grid'),
          start: 'top 80%',
        },
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
        // Auto clear success message after 7 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 7000);
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMsg('Server connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={containerRef} className="section" style={{ borderBottom: 'none', paddingBottom: '1rem' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="contact-header" style={{ marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.25em', display: 'block', marginBottom: '0.5rem' }}>04 / CONNECT</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>GET IN TOUCH</h2>
        </div>

        {/* Contact Grid */}
        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Col 1: Booking Info & Socials */}
          <div className="contact-col contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>BOOKINGS & INQUIRIES</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                For festival bookings, venue performances, remix commissions, or general inquiries, please fill out the contact form or send a direct email.
              </p>
              <a
                href="mailto:booking@metarman.com"
                className="interactive-element"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#fff',
                  borderBottom: '1px dashed rgba(255,255,255,0.4)',
                  paddingBottom: '0.25rem',
                  width: 'fit-content',
                  display: 'inline-block',
                  wordBreak: 'break-all',
                }}
              >
                booking@metarman.com
              </a>
            </div>

            {/* Social Links Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SOCIAL CHANNELS</span>
              
              <div className="contact-socials-row" style={{ display: 'flex', gap: '1rem' }}>
                {/* Instagram card */}
                <a
                  href="https://www.instagram.com/metarman_?igsh=NTN1cXdiOGhxdmpi&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-element"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color-hover)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>INSTAGRAM</div>
                </a>

                {/* SoundCloud card */}
                <a
                  href="https://on.soundcloud.com/oqngfxz2pi0UPLVciJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-element"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color-hover)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    {/* SoundCloud icon */}
                    <svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                      <g>
                        <path fillRule="evenodd" clipRule="evenodd" d="m214.805 362.56-2.943-54.72 2.943-135.36c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 135.36-2.942 54.72c0 4.769-3.955 8.64-8.828 8.64-4.874 0-8.828-3.871-8.828-8.64zm-35.31 0-2.942-54.72 2.942-100.8c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.943 100.8-2.943 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31 0-2.943-54.72 2.943-112.32c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 112.32-2.942 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31 0-2.942-54.72 2.942-89.28c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.943 89.28-2.943 54.72c0 4.769-3.955 8.64-8.828 8.64-4.874 0-8.828-3.871-8.828-8.64zm-35.311 0-2.943-54.72 2.943-43.2c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 43.2-2.942 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31 0-2.942-54.72 2.942-54.72c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.943 54.72-2.943 54.72c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm-35.31-23.04L0 307.84l2.943-31.68c0-4.769 3.955-8.64 8.828-8.64s8.828 3.871 8.828 8.64l2.942 31.68-2.942 31.68c0 4.769-3.955 8.64-8.828 8.64s-8.828-3.871-8.828-8.64zm413.371-102.063a71.776 71.776 0 0 1 25.065-4.497c39.002 0 70.621 30.947 70.621 69.12s-31.618 69.12-70.621 69.12H264.836c-9.755 0-17.663-7.762-17.663-17.297V169.6c0-28.8 52.965-28.8 52.965-28.8 58.554 0 107.113 41.851 116.176 96.657z" />
                      </g>
                    </svg>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>SOUNDCLOUD</div>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Interactive Form */}
          <div className="contact-col contact-form">
            {submitted ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>TRANSMISSION RECEIVED</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Thank you for reaching out. We will process your message and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Name Input */}
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="interactive-element contact-input"
                    placeholder="YOUR NAME"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      padding: '0.75rem 0',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      opacity: loading ? 0.5 : 1,
                    }}
                  />
                </div>

                {/* Email Input */}
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="interactive-element contact-input"
                    placeholder="EMAIL ADDRESS"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      padding: '0.75rem 0',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      opacity: loading ? 0.5 : 1,
                    }}
                  />
                </div>

                {/* Message Input */}
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <textarea
                    rows={4}
                    required
                    disabled={loading}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="interactive-element contact-input"
                    placeholder="MESSAGE / BOOKING DETAILS"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      padding: '0.75rem 0',
                      outline: 'none',
                      resize: 'none',
                      transition: 'border-color 0.3s ease',
                      opacity: loading ? 0.5 : 1,
                    }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ color: '#ef4444', fontSize: '0.9rem', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-minimal interactive-element"
                    style={{
                      padding: '1rem 2.5rem',
                      fontSize: '0.85rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'} <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            paddingBottom: '0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            © {new Date().getFullYear()} METARMAN. ALL RIGHTS RESERVED.
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            DESIGNED FOR UNDERGROUND SOUNDS
          </div>
        </div>

      </div>

      {/* Inputs hover custom styles */}
      <style>{`
        .contact-input:focus {
          border-color: var(--text-primary) !important;
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .contact-info {
            order: 2;
          }
          .contact-form {
            order: 1;
          }
        }
        @media (max-width: 600px) {
          .contact-socials-row {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
