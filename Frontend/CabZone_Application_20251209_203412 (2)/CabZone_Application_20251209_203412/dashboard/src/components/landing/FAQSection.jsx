import React, { useState, useEffect } from 'react';
import { Lock, Smartphone, Zap, Clock, CreditCard, Headset, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
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

  const faqs = [
    {
      icon: <Lock className="w-8 h-8" />,
      question: 'How secure is my fleet data?',
      answer: 'Bank-level 256-bit encryption, multi-factor authentication, and international data protection compliance.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      question: 'Mobile Management?',
      answer: 'Fully responsive platform. Manage your fleet from anywhere on any device - desktop, tablet, or smartphone.',
      color: 'from-sky-500 to-cyan-400'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      question: 'AI Verification Speed?',
      answer: 'Our AI scans documents, validates authenticity, and flags issues in seconds. 90% faster than manual verification.',
      color: 'from-blue-600 to-sky-500'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      question: 'Setup Time?',
      answer: 'Get started in under 5 minutes! Sign up, upload documents, and you\'re ready. No technical expertise needed.',
      color: 'from-cyan-400 to-teal-500'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      question: 'Payment Options?',
      answer: 'All major cards, net banking, UPI accepted. Flexible payment terms for enterprise customers.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Headset className="w-8 h-8" />,
      question: '24/7 Support?',
      answer: 'Round-the-clock support via email, phone, and live chat. Average response time under 15 minutes.',
      color: 'from-sky-500 to-blue-600'
    }
  ];

  return (
    <section id="faq" className="faq-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 faq-background -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-20 -z-10" style={{ background: '#5F7A8A' }}></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full filter blur-3xl opacity-15 -z-10" style={{ background: '#C4B5A0' }}></div>
      
      {/* Background decoration only */}
      
      <div className="container mx-auto px-4 py-20" style={{ position: 'relative', zIndex: 2 }}>
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block px-4 py-1 text-sm font-semibold rounded-full mb-4 shadow-sm" style={{ 
            color: '#ffffff',
            background: isDarkMode ? 'linear-gradient(to right, #FFBB00, #FFA500)' : 'linear-gradient(to right, #f59e0b, #f97316)'
          }}>
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ 
              color: isDarkMode ? '#FFBB00' : '#0f172a',
              textShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.8)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>Frequently Asked </span>
            <span style={{ 
              color: isDarkMode ? '#FFA500' : '#f97316',
              textShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.8)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>Questions</span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6" style={{ background: isDarkMode ? 'linear-gradient(to right, #FFBB00, #FFA500)' : 'linear-gradient(to right, #f59e0b, #f97316)' }}></div>
          <p className="text-lg max-w-2xl mx-auto" style={{ 
            color: isDarkMode ? '#e2e8f0' : '#CDC4BD',
            textShadow: isDarkMode ? '0 1px 4px rgba(0, 0, 0, 0.8)' : '0 1px 2px rgba(0, 0, 0, 0.1)',
            fontWeight: '500'
          }}>
            Find quick answers to common questions about our fleet management solution
          </p>
        </div>

        {/* FAQ Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative rounded-2xl p-8 transition-colors duration-300 cursor-pointer border shadow-lg"
              style={{ 
                background: hoveredIndex === index ? '#1F3A52' : '#2E5266',
                borderColor: hoveredIndex === index ? '#FFBB00' : '#5F7A8A',
                boxShadow: '0 10px 15px -3px rgba(31, 58, 82, 0.3)'
              }}
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex p-4 rounded-2xl mb-6 shadow-lg" style={{
                  background: 'linear-gradient(135deg, #FFBB00, #FFA500)',
                  color: '#1F3A52'
                }}>
                  {faq.icon}
                </div>
                
                {/* Question */}
                <h3 className="text-xl font-bold mb-4" style={{
                  color: hoveredIndex === index ? '#FFBB00' : '#C4B5A0'
                }}>
                  {faq.question}
                </h3>
                
                {/* Answer */}
                <p className="text-sm leading-relaxed" style={{
                  color: '#C4B5A0'
                }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
