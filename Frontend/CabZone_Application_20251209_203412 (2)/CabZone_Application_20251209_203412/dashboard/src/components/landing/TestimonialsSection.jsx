import React, { useEffect, useState } from 'react';
import { Star, Quote, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
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

  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "CABZONE has transformed how we manage our fleet. The digital documentation system saves us hours every week and ensures we're always compliant.",
      author: 'John Smith',
      position: 'Fleet Manager',
      company: 'Express Cabs',
      avatar: 'JS',
      verified: true
    },
    {
      id: 2,
      rating: 5,
      text: "The automated alerts have saved us from compliance issues multiple times. Their customer service is exceptional and always ready to help.",
      author: 'Sarah Johnson',
      position: 'Operations Director',
      company: 'City Rides',
      avatar: 'SJ',
      verified: true
    },
    {
      id: 3,
      rating: 5,
      text: "As a small cab company, staying organized was a challenge until we found CABZONE. Now we can focus on growing our business instead of paperwork.",
      author: 'Michael Chen',
      position: 'Owner',
      company: 'Green Cab Co.',
      avatar: 'MC',
      verified: true
    },
    {
      id: 4,
      rating: 5,
      text: "The platform is incredibly user-friendly. Our drivers can easily upload documents and we can verify everything in real-time. Highly recommended!",
      author: 'David Martinez',
      position: 'CEO',
      company: 'Metro Taxi Services',
      avatar: 'DM',
      verified: true
    },
    {
      id: 5,
      rating: 5,
      text: "Best investment we've made for our business. The ROI was immediate with reduced administrative costs and improved compliance tracking.",
      author: 'Emily Brown',
      position: 'Business Owner',
      company: 'Swift Rides',
      avatar: 'EB',
      verified: true
    },
    {
      id: 6,
      rating: 5,
      text: "Outstanding support team and a platform that actually works as promised. Managing 50+ vehicles has never been easier.",
      author: 'Robert Taylor',
      position: 'Operations Manager',
      company: 'Premier Cabs',
      avatar: 'RT',
      verified: true
    }
  ];
  
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const element = document.querySelector('.testimonials-section');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };
  
  // Get visible testimonials (3 at a time)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="testimonials-section py-16 md:py-24 relative overflow-hidden">
      {/* Hero-style Background */}
      <div className="hero-background"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg" style={{ 
            background: isDarkMode ? 'linear-gradient(to right, #FFBB00, #FFA500)' : 'linear-gradient(to right, #f59e0b, #f97316)',
            color: '#ffffff'
          }}>
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ 
            color: isDarkMode ? '#FFF4E6' : '#0f172a',
            textShadow: isDarkMode ? '0 3px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 187, 0, 0.6), 0 0 60px rgba(255, 187, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px'
          }}>
            What Our <span style={{
              color: '#E0782F',
              textShadow: isDarkMode ? '0 0 18px rgba(224, 120, 47, 0.55), 0 0 32px rgba(224, 120, 47, 0.35)' : '0 2px 4px rgba(0, 0, 0, 0.3)',
              fontWeight: '800',
              background: 'none',
              padding: '0 5px',
              borderRadius: '4px'
            }}>Customers Say</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ 
            color: isDarkMode ? '#e2e8f0' : '#CDC4BD',
            textShadow: isDarkMode ? '0 1px 4px rgba(0, 0, 0, 0.8)' : '0 1px 2px rgba(0, 0, 0, 0.1)',
            fontWeight: '500'
          }}>
            Don't just take our word for it. Here's what our clients have to say about their experience with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          <button 
            onClick={prevTestimonial}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full shadow-md items-center justify-center transition-colors z-10"
            style={{ background: '#2E5266', color: '#FFBB00' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#5F7A8A'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2E5266'}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col ${
                  index === 0 ? 'ring-2' : ''
                }`}
                style={{
                  background: '#2E5266',
                  borderColor: index === 0 ? '#FFBB00' : 'transparent',
                  boxShadow: index === 0 ? '0 10px 25px rgba(255, 187, 0, 0.3)' : '0 10px 15px rgba(31, 58, 82, 0.3)'
                }}
                data-aos="flip-left"
                data-aos-delay={index * 100}
              >
                {/* Testimonial Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-4" style={{ color: '#FFBB00' }}>
                    <Quote className="w-10 h-10" />
                  </div>

                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5"
                        style={{ 
                          fill: i < testimonial.rating ? '#FFBB00' : 'transparent',
                          color: i < testimonial.rating ? '#FFBB00' : '#5F7A8A',
                          filter: i < testimonial.rating ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : 'none'
                        }} 
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg leading-relaxed mb-6 flex-1" style={{ color: '#C4B5A0' }}>
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="mt-auto pt-4 border-t" style={{ borderColor: '#5F7A8A' }}>
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shadow-md" style={{ background: 'linear-gradient(to right, #FFBB00, #FFA500)', color: '#1F3A52' }}>
                          {testimonial.avatar}
                        </div>
                      </div>

                      {/* Author Details */}
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-bold" style={{ color: '#FFFFFF' }}>{testimonial.author}</h4>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 ml-1" style={{ color: '#FFBB00' }} />
                          )}
                        </div>
                        <p className="text-sm" style={{ color: '#C4B5A0' }}>
                          <span className="font-medium">{testimonial.position}</span>
                          <span className="mx-2">•</span>
                          <span style={{ color: '#FFBB00' }}>{testimonial.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation Arrows - Desktop */}
          <button 
            onClick={nextTestimonial}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full shadow-md items-center justify-center transition-colors z-10"
            style={{ background: '#2E5266', color: '#FFBB00' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#5F7A8A'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#2E5266'}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: testimonials.length - 2 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="w-2.5 h-2.5 rounded-full transition-colors"
                style={{ background: index === currentIndex ? '#FFBB00' : '#5F7A8A' }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '95%', label: 'Customer Satisfaction' },
            { number: '10K+', label: 'Fleet Vehicles Managed' },
            { number: '24/7', label: 'Support Available' },
            { number: '4.9/5', label: 'Average Rating' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md shadow-cyan-100/40 dark:shadow-slate-900/40"
            >
              <div className="text-3xl font-bold text-blue-900 dark:text-cyan-100 mb-2">
                {stat.number}
              </div>
              <p className="text-slate-700 dark:text-slate-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
