import React, { useState, useEffect } from 'react';
import { Gift, Car, FileText, Mail, Smartphone, CreditCard, ShieldCheck, Zap, Users, Award, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pricingPlans = [
    {
      type: 'trial',
      badge: 'Free Trial',
      icon: <Gift className="w-6 h-6" />,
      title: '7 Days Free',
      price: '₹0',
      period: '',
      features: [
        { text: 'Up to 4 cars', included: true },
        { text: 'Basic document management', included: true },
        { text: 'Email support', included: true },
        { text: 'Mobile access', included: true },
        { text: 'No credit card required', included: false }
      ],
      buttonText: 'Try Free',
      buttonClass: 'btn-outline-pricing'
    },
    {
      type: 'monthly',
      icon: <ShieldCheck className="w-6 h-6" />,
      title: '1 Month Plan',
      price: '2,000',
      period: '/month',
      features: [
        { text: 'Up to 10 cars', included: true },
        { text: 'AI-powered verification', included: true },
        { text: 'Real-time alerts', included: true },
        { text: 'Priority support', included: true },
        { text: 'Cloud storage', included: true }
      ],
      buttonText: 'Get Started',
      buttonClass: 'btn-primary'
    },
    {
      type: 'popular',
      badge: 'Most Popular',
      icon: <Car className="w-6 h-6" />,
      title: '6 Months Plan',
      price: '11,000',
      period: '/6 months',
      save: 'Save ₹1,000',
      features: [
        { text: 'Up to 50 cars', included: true },
        { text: 'AI-powered verification', included: true },
        { text: 'Real-time alerts', included: true },
        { text: '24/7 Premium support', included: true },
        { text: 'Advanced analytics', included: true }
      ],
      buttonText: 'Get Started',
      buttonClass: 'btn-primary'
    },
    {
      type: 'yearly',
      icon: <Zap className="w-6 h-6" />,
      title: '1 Year Plan',
      price: '22,000',
      period: '/year',
      save: 'Save ₹2,000',
      features: [
        { text: '50+ cars', included: true },
        { text: 'AI-powered verification', included: true },
        { text: 'Real-time alerts', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom integrations', included: true }
      ],
      buttonText: 'Get Started',
      buttonClass: 'btn-primary'
    }
  ];

  return (
    <section id="pricing" className="pricing-section relative overflow-hidden">
      {/* Hero-style Background */}
      <div className="hero-background"></div>
      
      {/* Animated Background - Cab Themed */}
      <div className="animated-bg-overlay">
        {/* Route Path */}
        <div className="route-path">
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M 0,500 Q 400,300 800,500 T 1200,500" />
          </svg>
        </div>
        
        {/* Location Pins */}
        <div className="location-pin pin-1"></div>
        <div className="location-pin pin-3"></div>
        
        {/* GPS Signals */}
        <div className="gps-signal gps-signal-2"></div>
        
        {/* Traffic Lights */}
        <div className="traffic-light traffic-light-2"></div>
        <div className="traffic-light traffic-light-3"></div>
        
        {/* Taxi Icon */}
        <div className="taxi-icon taxi-icon-3">🚕</div>
      </div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header" data-aos="fade-up">
          <div className="flex flex-col items-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg" style={{ 
              background: '#E0782F',
              color: '#ffffff',
              boxShadow: isDarkMode ? '0 0 22px rgba(224, 120, 47, 0.5)' : '0 10px 20px rgba(224, 120, 47, 0.35)'
            }}>
              <Award className="w-8 h-8" />
            </div>
            <h2 className="section-title" style={{
              color: isDarkMode ? '#FFF4E6' : '#0f172a',
              textShadow: isDarkMode ? '0 3px 10px rgba(0, 0, 0, 0.8)' : '0 2px 8px rgba(0, 0, 0, 0.25)',
              textAlign: 'center'
            }}>Choose Your Plan</h2>
          </div>
          <p>Flexible pricing options to match your fleet size and needs</p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.type}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {plan.badge && <div className="pricing-badge">{plan.badge}</div>}
              <div className="pricing-icon">
                {plan.icon}
              </div>
              <h3 className="pricing-title">{plan.title}</h3>
              <div className="pricing-price">
                {plan.price.includes('₹') ? (
                  <span className="price">{plan.price}</span>
                ) : (
                  <>
                    <span className="currency">₹</span>
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </>
                )}
              </div>
              {plan.save && <div className="pricing-save">{plan.save}</div>}
              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle className="w-5 h-5" style={{ color: feature.included ? '#FFBB00' : '#5F7A8A' }} /> {feature.text}
                  </li>
                ))}
              </ul>
              <a 
                href="#contact" 
                className={`btn ${plan.buttonClass}`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                {plan.buttonText}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
