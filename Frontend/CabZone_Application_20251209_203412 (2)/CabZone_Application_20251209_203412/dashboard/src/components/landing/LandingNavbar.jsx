import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const sectionIds = ['home', 'challenges', 'comparison', 'testimonials', 'pricing', 'faq', 'contact'];

const LandingNavbar = ({ onLoginClick }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBuffer = 160;
      const scrollPosition = window.scrollY + scrollBuffer;
      let currentSection = 'home';

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      const cleanedId = sectionId.replace('#', '');
      if (sectionIds.includes(cleanedId)) {
        setActiveSection(cleanedId);
      }
    }
  };

  return (
    <>
      <ThemeToggle />
      <nav className="landing-navbar">
        <div className="navbar-content">
          <div className="nav-right">
            <div className="nav-links">
              <a 
                href="#home" 
                onClick={(e) => scrollToSection(e, '#home')}
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              >
                Home
              </a>
              <a 
                href="#challenges" 
                onClick={(e) => scrollToSection(e, '#challenges')}
                className={`nav-link ${activeSection === 'challenges' ? 'active' : ''}`}
              >
                Challenges
              </a>
              <a 
                href="#comparison" 
                onClick={(e) => scrollToSection(e, '#comparison')}
                className={`nav-link ${activeSection === 'comparison' ? 'active' : ''}`}
              >
                Why Choose Us
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => scrollToSection(e, '#testimonials')}
                className={`nav-link ${activeSection === 'testimonials' ? 'active' : ''}`}
              >
                Testimonials
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => scrollToSection(e, '#pricing')}
                className={`nav-link ${activeSection === 'pricing' ? 'active' : ''}`}
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection(e, '#faq')}
                className={`nav-link ${activeSection === 'faq' ? 'active' : ''}`}
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, '#contact')}
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              >
                Contact
              </a>
            </div>
            <div className="nav-buttons">
              <button onClick={onLoginClick} className="login-btn">
                <i className="fas fa-user"></i> Login <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LandingNavbar;
