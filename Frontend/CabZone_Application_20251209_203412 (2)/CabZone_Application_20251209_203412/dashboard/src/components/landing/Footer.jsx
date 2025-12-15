import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-primary)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/images/logo.png" 
                alt="CABZONE Logo" 
                className="h-10 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-2xl font-bold">CABZONE</span>
            </div>
            <p className="text-gray-400 mb-4">
              Revolutionizing fleet management with cutting-edge technology and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="Facebook">
                <span className="inline-block w-6 text-center">f</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="Twitter">
                <span className="inline-block w-6 text-center">𝕏</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="LinkedIn">
                <span className="inline-block w-6 text-center">in</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl" aria-label="Instagram">
                <span className="inline-block w-6 text-center">📸</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✉️</span>
                <span className="text-gray-400">info@cabzone.com</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">📞</span>
                <span className="text-gray-400">+1 234 567 8900</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">📍</span>
                <span className="text-gray-400">123 Fleet Street, City, Country</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get updates on new features and offers.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r transition-colors"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CABZONE. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
