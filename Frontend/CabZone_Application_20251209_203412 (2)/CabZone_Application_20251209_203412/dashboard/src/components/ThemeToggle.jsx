import React from 'react';
import { Moon, Sun, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, isAutoMode, enableAutoMode } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label="Toggle theme"
        title={isAutoMode ? "Auto mode (click to manual)" : "Manual mode"}
      >
        {isAutoMode ? (
          <Clock className="w-5 h-5" />
        ) : isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
      {!isAutoMode && (
        <button
          onClick={enableAutoMode}
          className="auto-mode-btn"
          aria-label="Enable auto mode"
          title="Switch to auto mode"
        >
          <Clock className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;
