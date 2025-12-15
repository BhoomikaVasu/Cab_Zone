import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isAutoMode, setIsAutoMode] = useState(() => {
    // Check if user has set manual preference
    const savedMode = localStorage.getItem('themeMode');
    return savedMode !== 'manual';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to determine if it's night time (6 PM to 6 AM)
  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6; // 6 PM (18:00) to 6 AM (06:00)
  };

  useEffect(() => {
    if (isAutoMode) {
      // Auto mode: switch based on time
      const updateTheme = () => {
        const shouldBeDark = isNightTime();
        setIsDarkMode(shouldBeDark);
      };

      // Update theme immediately
      updateTheme();

      // Check every minute for time changes
      const interval = setInterval(updateTheme, 60000);

      return () => clearInterval(interval);
    }
  }, [isAutoMode]);

  useEffect(() => {
    // Apply theme to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    // Switch to manual mode and toggle theme
    setIsAutoMode(false);
    setIsDarkMode(prev => !prev);
    localStorage.setItem('themeMode', 'manual');
  };

  const enableAutoMode = () => {
    setIsAutoMode(true);
    localStorage.setItem('themeMode', 'auto');
    // Immediately update to current time-based theme
    setIsDarkMode(isNightTime());
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isAutoMode, enableAutoMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
