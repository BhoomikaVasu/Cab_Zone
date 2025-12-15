import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroSection from '../components/landing/HeroSection';
import ChallengesSection from '../components/landing/ChallengesSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import ContactSection from '../components/landing/ContactSection';
import StatisticsSection from '../components/landing/StatisticsSection';
import Footer from '../components/landing/Footer';
import LandingNavbar from '../components/landing/LandingNavbar';
import '../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,      // Animation duration in ms
      once: true,          // Animation happens only once
      offset: 100,         // Offset from viewport
      easing: 'ease-in-out',
      delay: 0
    });

    // Smooth scroll for hash links
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <LandingNavbar onLoginClick={handleLoginClick} />
      <section id="home">
        <HeroSection />
      </section>
      <section id="challenges">
        <ChallengesSection />
      </section>
      <section id="comparison">
        <ComparisonSection />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <StatisticsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
