import React, { useEffect, useRef } from 'react';

const HeroSection = () => {
  const carRef = useRef(null);

  useEffect(() => {
    // Add 'arrived' class after taxi driving animation completes (2.5s)
    const timer = setTimeout(() => {
      if (carRef.current) {
        carRef.current.classList.add('arrived');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <section id="home" className="hero-section">
      {/* Header with Logo */}
      <header className="hero-header">
        <div className="hero-logo" data-aos="fade-down" data-aos-duration="800">
          <span>CZ</span>
        </div>
      </header>
      
      {/* Background Elements */}
      <div className="hero-background">
        {/* Animated Road */}
        <div className="hero-road">
          <svg
            className="hero-road-svg"
            viewBox="0 0 1600 320"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="hero-road-curve"
              d="M0 220 C 220 60, 520 280, 820 150 S 1330 280, 1600 110"
            />
          </svg>
          <div className="road-cabs">
            <span className="road-cab cab-1">🚕</span>
            <span className="road-cab cab-2">🚖</span>
            <span className="road-cab cab-3">🚕</span>
          </div>
          <div className="road-pins" aria-hidden="true">
            <span className="road-pin pin-start">📍</span>
            <span className="road-pin pin-end">📍</span>
          </div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>

      {/* Main Content */}
      <div className="container hero-container">
        <div className="hero-content-wrapper" style={{ paddingTop: '140px' }}>
          {/* Left Column - Text Content */}
          <div className="hero-text-content" data-aos="fade-right" data-aos-delay="200">
            <h1 className="hero-title">
              Empower Your Fleet <span className="highlight">Management</span>
            </h1>
            <p className="hero-description">
              Streamline your cab company operations with automated compliance and digital fleet management.
            </p>
          </div>

          {/* Right Column - Stats */}
          <div className="hero-stats-container" data-aos="fade-left" data-aos-delay="300">
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Clients</span>
              <div className="stat-icon">👥</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">5000+</span>
              <span className="stat-label">DOC-Verify Completed</span>
              <div className="stat-icon">✅</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Customer Support</span>
              <div className="stat-icon">🛟</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
