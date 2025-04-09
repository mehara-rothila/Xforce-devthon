'use client';

// Import necessary React hooks and functions
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for dark mode with a default value
// No TypeScript types here
export const DarkModeContext = createContext({
  isDarkMode: true, // Default value
  toggleDarkMode: () => { console.warn("DarkModeContext: toggleDarkMode called without a Provider"); }, // Default no-op
});

// Custom hook to use the dark mode context
// No return type annotation
export const useDarkMode = () => useContext(DarkModeContext);

// Provider component
// No TypeScript props interface
export const DarkModeProvider = ({ children }) => {
  // State to hold the current mode
  // No type annotation for useState
  const [isDarkMode, setIsDarkMode] = useState(true); // Default state before hydration

  // Effect to run only once on the client after initial render to set the theme
  useEffect(() => {
    let initialDarkMode = true; // Default assumption
    try {
      // Check if there's a saved preference in localStorage
      const savedTheme = localStorage.getItem('theme');
      // Determine initial mode: use saved theme if valid, otherwise default to dark
      initialDarkMode = savedTheme ? savedTheme === 'dark' : true;
    } catch (error) {
        console.error("Could not access localStorage for theme", error);
        // Keep default if localStorage is unavailable
    }
    setIsDarkMode(initialDarkMode);
    applyTheme(initialDarkMode);
  // Empty dependency array means this runs only once on mount (client-side)
  }, []);

  // Helper function to apply theme class to the document's root element
  // No type annotation for the 'isDark' parameter
  const applyTheme = (isDark) => {
    // Ensure this code only runs on the client
    if (typeof window !== 'undefined') {
        try {
            const root = document.documentElement;
            // Set data-theme attribute (optional, useful for non-Tailwind CSS)
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');

            // Add/remove 'dark' class for Tailwind's darkMode: 'class' strategy
            if (isDark) {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
        } catch (error) {
            console.error("Could not apply theme to documentElement", error);
        }
    }
  };


  // Function to toggle dark mode state
  const toggleDarkMode = () => {
    // Update state using the functional form to ensure we have the latest state
    setIsDarkMode(prevMode => {
      const newMode = !prevMode; // Calculate the new mode
      try {
        // Save the new preference to localStorage (only on client)
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
        }
      } catch (error) {
          console.error("Could not save theme to localStorage", error);
      }
      // Apply the new theme to the document
      applyTheme(newMode);
      // Return the new mode to update the state
      return newMode;
    });
  };


  // Provide the current state and the toggle function to children
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Dark mode toggle component that can be used anywhere within the Provider
export const DarkModeToggle = () => {
  // Use the context hook to get current state and the toggle function
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Render the button, using the context state for display and the context function for onClick
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      // Added flex items-center for better alignment
      className="dark-mode-toggle flex items-center justify-center"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Track */}
      <span className={`dark-mode-toggle-track ${isDarkMode ? 'active' : ''}`}></span>

      {/* Thumb - Added explicit sizing and better positioning */}
      <span className={`dark-mode-toggle-thumb ${isDarkMode ? 'active' : ''} flex items-center justify-center`}>
        {/* Conditional rendering of Moon or Sun icon with explicit sizing */}
        {isDarkMode ? (
          // Moon Icon - Restored size classes
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          // Sun Icon - Restored size classes
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </span>
    </button>
  );
};