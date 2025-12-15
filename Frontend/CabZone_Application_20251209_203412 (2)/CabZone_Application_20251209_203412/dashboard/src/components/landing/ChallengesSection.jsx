import React, { useState, useEffect } from 'react';
import { FileText, Clock, CalendarX, ShieldCheck } from 'lucide-react';

const ChallengesSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  const challenges = [
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: 'Document Loss & Damage',
      description: 'Say goodbye to lost paperwork. Our cloud-based system ensures your critical documents are always accessible and secure.'
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      title: 'Time-Consuming Verification',
      description: 'Reduce verification time by 90% with AI-powered automated document validation and instant compliance checks.'
    },
    {
      icon: <CalendarX className="w-8 h-8 text-white" />,
      title: 'Missed Renewal Deadlines',
      description: 'Never miss a deadline again. Smart alerts notify you 30, 15, and 7 days before any document expires.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: 'Compliance Management',
      description: 'Maintain 100% compliance effortlessly. Real-time monitoring keeps your entire fleet regulation-ready.'
    }
  ];

  return (
    <section id="challenges" className="py-16 md:py-24" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero-style Background */}
      <div className="hero-background"></div>
      
      {/* Animated Background - Cab Themed */}
      <div className="animated-bg-overlay">
        {/* Location Pins */}
        <div className="location-pin pin-1"></div>
        <div className="location-pin pin-2"></div>
        
        {/* GPS Signals */}
        <div className="gps-signal gps-signal-1"></div>
        <div className="gps-signal gps-signal-2"></div>
        
        {/* Traffic Lights */}
        <div className="traffic-light traffic-light-1"></div>
        <div className="traffic-light traffic-light-2"></div>
        <div className="traffic-light traffic-light-3"></div>
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="text-center max-w-3xl mx-auto mb-12" data-aos="fade-up">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4" style={{ 
            background: isDarkMode ? 'linear-gradient(to right, #FFBB00, #FFA500)' : 'linear-gradient(to right, #f59e0b, #f97316)', 
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            Pain Points
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ 
            color: isDarkMode ? '#FFBB00' : '#0f172a',
            textShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 187, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 10
          }}>
            Challenges <span className={isDarkMode ? "bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"} style={{
              textShadow: 'none',
              filter: isDarkMode ? 'drop-shadow(0 0 10px rgba(255, 187, 0, 0.5))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}>We Solve</span>
          </h2>
          <p className="text-lg" style={{ 
            color: isDarkMode ? '#e2e8f0' : '#CDC4BD',
            textShadow: isDarkMode ? '0 1px 4px rgba(0, 0, 0, 0.8)' : '0 1px 2px rgba(0, 0, 0, 0.1)',
            fontWeight: '500',
            opacity: isDarkMode ? 0.9 : 1
          }}>Transform your fleet operations by eliminating these critical pain points</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {challenges.map((challenge, index) => (
            <div 
              key={index} 
              className="rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2" 
              style={{ backgroundColor: '#2E5266', borderColor: '#5F7A8A' }}
              data-aos="fade-right" 
              data-aos-delay={index * 100}
            >
              <div className="w-14 h-14 p-3 rounded-xl mb-4 shadow-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFBB00, #FFA500)' }}>
                {React.cloneElement(challenge.icon, { className: 'w-8 h-8', style: { color: '#1F3A52' } })}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
              <p className="text-gray-300">{challenge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
