import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { X, Check, AlertTriangle, Clock, FileText, Shield, Globe, Zap, CheckCircle, ChevronRight, Star } from 'lucide-react';

const ComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const themeObserver = new MutationObserver(checkTheme);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      themeObserver.disconnect();
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [controls]);

  const traditionalFeatures = [
    { 
      icon: <FileText className="w-5 h-5" />, 
      text: 'Paper-based storage',
      description: 'Physical documents that can be lost or damaged'
    },
    { 
      icon: <AlertTriangle className="w-5 h-5" />, 
      text: 'Manual verification',
      description: 'Time-consuming human verification process'
    },
    { 
      icon: <X className="w-5 h-5" />, 
      text: 'No compliance alerts',
      description: 'Missed deadlines and potential fines'
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      text: 'Office-only access',
      description: 'Limited to physical office location'
    },
    { 
      icon: <AlertTriangle className="w-5 h-5" />, 
      text: 'Slow processing',
      description: 'Delays in document verification'
    },
    { 
      icon: <X className="w-5 h-5" />, 
      text: 'High error rate',
      description: 'Prone to human mistakes'
    }
  ];

  const cabzoneFeatures = [
    { 
      icon: <Shield className="w-5 h-5" />, 
      text: 'Secure cloud storage',
      description: 'Bank-level encryption for all documents'
    },
    { 
      icon: <Check className="w-5 h-5" />, 
      text: 'AI-powered automation',
      description: 'Smart document processing and verification'
    },
    { 
      icon: <Check className="w-5 h-5" />, 
      text: 'Real-time smart alerts',
      description: 'Never miss important deadlines'
    },
    { 
      icon: <Globe className="w-5 h-5" />, 
      text: 'Access from anywhere',
      description: 'Cloud-based platform accessible 24/7'
    },
    { 
      icon: <Zap className="w-5 h-5" />, 
      text: 'Instant processing',
      description: 'Documents processed in seconds'
    },
    { 
      icon: <CheckCircle className="w-5 h-5" />, 
      text: '99.9% accuracy',
      description: 'Reduced human error'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const featureItemVariants = {
    initial: { x: -10, opacity: 0 },
    enter: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    }),
    hover: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      transition: { duration: 0.2 }
    }
  };

  const scrollToPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleFeatureHover = (index) => {
    setHoveredFeature(index);
  };

  const handleFeatureLeave = () => {
    setHoveredFeature(null);
  };

  const handleCardClick = (cardType) => {
    setActiveCard(activeCard === cardType ? null : cardType);
  };

  return (
    <section 
      ref={ref}
      id="comparison" 
      className="comparison-section py-12 md:py-16 relative overflow-hidden"
    >
      {/* Hero-style Background */}
      <div className="hero-background"></div>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden pointer-events-none">
        <div className="decorative-circle absolute top-10 left-10 w-32 h-32 rounded-full filter blur-xl opacity-30" style={{ background: '#C4B5A0' }}></div>
        <div className="decorative-circle absolute bottom-10 right-10 w-32 h-32 rounded-full filter blur-xl opacity-30" style={{ background: '#FFBB00' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
            color: isDarkMode ? '#FFF4E6' : '#0f172a',
            textShadow: isDarkMode ? '0 3px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 187, 0, 0.6), 0 0 60px rgba(255, 187, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px'
          }}>
            Why <span style={{
              color: '#E0782F',
              textShadow: isDarkMode ? '0 0 18px rgba(224, 120, 47, 0.55), 0 0 32px rgba(224, 120, 47, 0.35)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
              fontWeight: '800',
              background: 'none',
              padding: '0 5px',
              borderRadius: '4px'
            }}>Choose Us?</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: isDarkMode ? '#e2e8f0' : '#CDC4BD' }}>
            Experience the difference between traditional methods and our modern fleet management solution
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div 
          className="relative max-w-6xl mx-auto z-0"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-6 relative max-w-5xl mx-auto">
          {/* Traditional Method Card */}
          <motion.div 
            className={`comparison-card comparison-card--traditional rounded-xl shadow-lg overflow-hidden border transition-all duration-300 h-full flex flex-col cursor-pointer ${activeCard === 'traditional' ? 'ring-2 ring-offset-2 ring-[#ECAF40]' : ''}`}
            style={{ 
              background: '#2E5266', 
              borderColor: activeCard === 'traditional' ? '#ECAF40' : '#5F7A8A',
              transform: activeCard === 'traditional' ? 'translateY(-5px)' : 'none'
            }}
            variants={itemVariants}
            data-aos="fade-right"
            data-aos-delay="200"
            onClick={() => handleCardClick('traditional')}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="p-2 pb-1.5 relative border-b" style={{ background: '#1F3A52', borderColor: '#5F7A8A' }}>
              <div className="flex items-center">
                <div className="p-1 rounded border mr-2" style={{ background: 'rgba(95, 122, 138, 0.3)', color: '#5F7A8A', borderColor: '#5F7A8A' }}>
                  <X className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#C4B5A0' }}>Traditional Method</h3>
              </div>
            </div>
            <div className="p-2 pt-1">
              <ul className="space-y-2">
                {traditionalFeatures.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start p-1 rounded transition-colors duration-200 text-xs"
                    custom={index}
                    initial="initial"
                    animate="enter"
                    variants={featureItemVariants}
                    whileHover={hoveredFeature === index ? 'hover' : ''}
                    onMouseEnter={() => handleFeatureHover(index)}
                    onMouseLeave={handleFeatureLeave}
                    style={{
                      backgroundColor: hoveredFeature === index ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                    }}
                  >
                    <div 
                      className="p-0.5 rounded border mr-1.5 mt-0.5 transition-all duration-200 flex-shrink-0" 
                      style={{ 
                        background: hoveredFeature === index ? 'rgba(255, 255, 255, 0.1)' : 'rgba(95, 122, 138, 0.3)', 
                        color: hoveredFeature === index ? '#ECAF40' : '#5F7A8A', 
                        borderColor: hoveredFeature === index ? 'rgba(236, 175, 64, 0.5)' : '#5F7A8A',
                        transform: hoveredFeature === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        className: `w-5 h-5 transition-transform duration-200 ${hoveredFeature === index ? 'scale-110' : ''}`
                      })}
                    </div>
                    <div>
                      <p 
                        className="font-semibold text-sm transition-colors duration-200" 
                        style={{ color: hoveredFeature === index ? '#ECAF40' : '#C4B5A0' }}
                      >
                        {feature.text}
                      </p>
                      <p 
                        className="text-xs mt-1 transition-colors duration-200" 
                        style={{ color: hoveredFeature === index ? 'rgba(236, 175, 64, 0.9)' : 'rgba(196, 181, 160, 0.8)' }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* VS Badge - Centered between cards */}
          <motion.div 
            className="flex items-center justify-center py-4 lg:py-0"
            data-aos="zoom-in"
            data-aos-delay="400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: activeCard ? (activeCard === 'traditional' ? 20 : -20) : 0
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 15
            }}
          >
            <motion.div 
              className="rounded-full w-16 h-16 flex items-center justify-center shadow-2xl cursor-default" 
              style={{ 
                background: '#1F3A52', 
                border: '4px solid #ECAF40',
                boxShadow: '0 0 0 4px rgba(236, 175, 64, 0.3)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base font-bold" style={{ 
                background: 'linear-gradient(135deg, #ECAF40, #d6a239)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(236, 175, 64, 0.5)'
              }}>VS</span>
            </motion.div>
          </motion.div>

          {/* CABZONE Platform Card */}
          <motion.div 
            className={`comparison-card comparison-card--cabzone rounded-xl shadow-xl overflow-visible relative border transition-all duration-300 h-full flex flex-col cursor-pointer ${activeCard === 'cabzone' ? 'ring-2 ring-offset-2 ring-[#ECAF40]' : ''}`}
            style={{ 
              background: '#2E5266', 
              borderColor: activeCard === 'cabzone' ? '#ECAF40' : '#FFBB00',
              transform: activeCard === 'cabzone' ? 'translateY(-5px)' : 'none'
            }}
            variants={itemVariants}
            data-aos="fade-left"
            data-aos-delay="200"
            onClick={() => handleCardClick('cabzone')}
            whileHover="hover"
            whileTap="tap"
          >
            {/* Recommended Badge */}
            <div className="absolute -top-2.5 right-4 text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center z-20 transition-all duration-200" style={{ background: 'linear-gradient(to right, #FFBB00, #FFA500)', color: '#1F3A52' }}>
              <Star className="w-3 h-3 mr-1" />
              RECOMMENDED
            </div>
            
            <div className="p-3 pb-2 relative border-b" style={{ background: '#1F3A52', borderColor: '#FFBB00' }}>
              <div className="flex items-center">
                <div className="p-1 rounded border mr-2" style={{ background: 'rgba(255, 187, 0, 0.2)', color: '#FFBB00', borderColor: '#FFBB00' }}>
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#FFBB00' }}>CABZONE Platform</h3>
              </div>
            </div>
            <div className="p-3 pt-2">
              <ul className="space-y-3 py-3 px-4 flex-grow">
                {cabzoneFeatures.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start p-1 rounded transition-colors duration-200 text-xs"
                    custom={index}
                    initial="initial"
                    animate="enter"
                    variants={featureItemVariants}
                    whileHover={hoveredFeature === index ? 'hover' : ''}
                    onMouseEnter={() => handleFeatureHover(index)}
                    onMouseLeave={handleFeatureLeave}
                    style={{
                      backgroundColor: hoveredFeature === index ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                    }}
                  >
                    <div 
                      className="p-0.5 rounded border mr-1.5 mt-0.5 transition-all duration-200 flex-shrink-0" 
                      style={{ 
                        background: hoveredFeature === index ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 187, 0, 0.2)', 
                        color: hoveredFeature === index ? '#ECAF40' : '#FFBB00', 
                        borderColor: hoveredFeature === index ? 'rgba(236, 175, 64, 0.5)' : '#FFBB00',
                        transform: hoveredFeature === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        className: `w-5 h-5 transition-transform duration-200 ${hoveredFeature === index ? 'scale-110' : ''}`
                      })}
                    </div>
                    <div>
                      <p 
                        className="font-semibold text-sm transition-colors duration-200" 
                        style={{ color: hoveredFeature === index ? '#ECAF40' : '#C4B5A0' }}
                      >
                        {feature.text}
                      </p>
                      <p 
                        className="text-xs mt-1 transition-colors duration-200" 
                        style={{ color: hoveredFeature === index ? 'rgba(236, 175, 64, 0.9)' : 'rgba(196, 181, 160, 0.8)' }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              
              {/* CTA Button */}
              <motion.div 
                className="mt-1 text-center p-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button 
                  onClick={scrollToPricing}
                  className="group relative w-full py-1.5 px-3 rounded-md font-semibold text-xs flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #ECAF40, #d6a239)', 
                    color: '#1F3A52', 
                    boxShadow: '0 4px 15px rgba(236, 175, 64, 0.3)'
                  }}
                  whileHover={{ 
                    y: -2,
                    boxShadow: '0 8px 25px rgba(236, 175, 64, 0.5)'
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    boxShadow: '0 2px 10px rgba(236, 175, 64, 0.2)'
                  }}
                >
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    Get Started For Free
                  </motion.span>
                  <motion.span
                    className="ml-1.5"
                    initial={{ x: 0 }}
                    whileHover={{ 
                      x: 5,
                      scale: 1.2
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-sm text-slate-500 flex items-center justify-center">
            <Shield className="w-4 h-4 mr-2 text-cyan-500" />
            Trusted by 1000+ fleet managers worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
