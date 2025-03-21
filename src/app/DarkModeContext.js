'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for dark mode
export const DarkModeContext = createContext({
  isDarkMode: true,
  toggleDarkMode: () => {},
});

// Custom hook to use the dark mode context
export const useDarkMode = () => useContext(DarkModeContext);

// Provider component
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Initialize dark mode from localStorage or default to true (dark)
  useEffect(() => {
    // Check if there's a saved preference
    const savedTheme = localStorage.getItem('theme');
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : true;
    
    // Set state
    setIsDarkMode(initialDarkMode);
    
    // Apply theme to document
    applyTheme(initialDarkMode);
  }, []);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Save to localStorage
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Apply theme to document
      applyTheme(newMode);
      
      return newMode;
    });
  };

  // Helper function to apply theme to document
  const applyTheme = (isDark) => {
    // Apply theme attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Add/remove dark class for Tailwind
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Dark mode toggle component that can be used anywhere
export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={`dark-mode-toggle-track ${isDarkMode ? 'active' : ''}`}></span>
      <span className={`dark-mode-toggle-thumb ${isDarkMode ? 'active' : ''}`}>
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </span>
    </button>
  );
};