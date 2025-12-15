import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById('contact');
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-[#050b24] via-[#060c29] to-[#0b133a] relative overflow-hidden text-white">
      <div className="hero-background"></div>
      <div className="animated-bg-overlay">
        <div className="location-pin pin-1"></div>
        <div className="location-pin pin-2"></div>
        <div className="gps-signal gps-signal-1"></div>
        <div className="gps-signal gps-signal-2"></div>
        <div className="traffic-light traffic-light-1"></div>
        <div className="traffic-light traffic-light-2"></div>
        <div className="traffic-light traffic-light-3"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFBB00] to-[#FFA500] mb-6 drop-shadow-[0_0_20px_rgba(255,187,0,0.8)]"
            variants={itemVariants}
          >
            Get In Touch
          </motion.h2>
          <motion.div 
            className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-[#FFBB00] to-[#f97316] shadow-lg"
            variants={itemVariants}
          ></motion.div>
          <motion.p 
            className="text-lg text-slate-200 max-w-2xl mx-auto drop-shadow"
            variants={itemVariants}
          >
            Have questions or need assistance? Our team is here to help you 24/7.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="lg:col-span-6 relative group"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl h-full flex items-center transform transition-all duration-300 group-hover:shadow-2xl">
              <div className="relative w-full h-[28rem] overflow-hidden rounded-xl">
                <img 
                  src="/images/contactus.jpg" 
                  alt="Contact Us" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-[#ffcf6a]">We're Here to Help</h3>
                    <p className="text-[#b8c9ff]">Reach out to our support team for any inquiries</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-6 bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_100%)] p-8 rounded-2xl shadow-[0_24px_60px_rgba(3,7,18,0.8)] border border-[#0f162d] transform transition-all duration-300 hover:shadow-[0_25px_60px_rgba(6,8,26,0.9)] relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#4c6ffc]/30 rounded-full mix-blend-screen filter blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#7c8dff]/20 rounded-full mix-blend-screen filter blur-2xl opacity-50 group-hover:opacity-90 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-center mb-8 group-hover:translate-x-2 transition-transform duration-300">
                <motion.div 
                  className="p-3 rounded-full bg-gradient-to-br from-[#FFBB00] to-[#f97316] mr-4 shadow-lg group-hover:shadow-[#FFBB00]/50 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                >
                  <FaPaperPlane className="text-white text-xl" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-[#fef3c7]">
                    Send Us a Message
                  </h3>
                  <div className="h-1 w-12 bg-gradient-to-r from-[#FFBB00] to-[#f97316] mt-2 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {submitted ? (
              <motion.div 
                className="p-6 text-center bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                  <FaCheck className="text-green-600 dark:text-green-400 text-2xl" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h4>
                <p className="text-slate-300">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="relative"
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 pl-12 text-slate-100 bg-[#0c172d]/70 border border-[#1b2340] rounded-xl focus:ring-2 focus:ring-[#FFBB00] focus:border-transparent transition-all duration-200 peer"
                        placeholder="John Doe"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative"
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 peer"
                        placeholder="your@email.com"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="relative"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all duration-200 peer"
                      placeholder="How can we help you?"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 pl-12 pt-4 text-slate-100 bg-[#0c172d]/70 border border-[#1b2340] rounded-xl focus:ring-2 focus:ring-[#FFBB00] focus:border-transparent transition-all duration-200 peer"
                      placeholder="Tell us more about your needs..."
                    ></textarea>
                    <div className="absolute left-4 top-4 text-gray-400 peer-focus:text-blue-500 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="pt-2 relative group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#e2a13d] to-[#d18b33] rounded-xl opacity-0 group-hover:opacity-35 blur transition duration-200"></div>
                  <button
                    type="submit"
                    className={`relative w-full bg-gradient-to-r from-[#e2a13d] to-[#c37a23] text-white font-semibold py-4 px-6 rounded-xl shadow-[0_12px_30px_rgba(179,111,33,0.35)] transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden ${
                      isHovered ? 'transform -translate-y-1 scale-[1.01]' : ''
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"></span>
                    <span>Send Message</span>
                    <motion.span
                      animate={isHovered ? { x: [0, 6, -2, 0] } : { x: 0 }}
                      transition={{ repeat: isHovered ? Infinity : 0, duration: 1.3 }}
                      className="text-[1rem]"
                    >
                      <FaPaperPlane className="inline-block" />
                    </motion.span>
                  </button>
                </motion.div>
              </form>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-center text-slate-300 text-sm">
                We'll respond to your message within 24 hours. For immediate assistance, please call us at <span className="text-[#57a0ff] font-medium">+1 (123) 456-7890</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
