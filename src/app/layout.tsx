'use client';

import React from 'react'; // Import React from 'react'
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Change initial state to true so the mobile menu is open by default
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Add this useEffect to set the document title directly
  useEffect(() => {
    document.title = "XForce Learning Platform | DEV{thon} 2.0";
  }, []);

  // Initialize dark mode
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');

    // Save preference to localStorage
    localStorage.setItem('theme', 'dark');
  }, []);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  function toggleDarkMode() {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Apply theme to html element
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');

    // Add/remove dark class for Tailwind
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  }

  // Navigation handler - improved to ensure clicks work properly
  const handleNavigation = (e: React.MouseEvent) => { // Explicitly type 'e' as React.MouseEvent
    // Make sure navigation works correctly
    e.stopPropagation();

    // Close the mobile menu if it's open
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark:bg-gray-900 transition-colors duration-300`}>
        <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 relative z-30 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600"
                onClick={handleNavigation}
              >
                DEV<span className="text-purple-800 dark:text-purple-400">{"{thon}"}</span>
                <span className="text-sm align-top text-purple-800 dark:text-purple-400">2.0</span>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/subjects"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-800 dark:hover:text-purple-400 transition-colors duration-200"
                onClick={handleNavigation}
              >
                Subjects
              </Link>
              <Link
                href="/quiz"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-800 dark:hover:text-purple-400 transition-colors duration-200"
                onClick={handleNavigation}
              >
                Quizzes
              </Link>
              <Link
                href="/forum"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-800 dark:hover:text-purple-400 transition-colors duration-200"
                onClick={handleNavigation}
              >
                Forum
              </Link>
              <Link
                href="/resources"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-800 dark:hover:text-purple-400 transition-colors duration-200"
                onClick={handleNavigation}
              >
                Resources
              </Link>

              {/* Dark Mode Toggle */}
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

              <Link
                href="/login"
                className="text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 px-5 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-purple-900/20"
                onClick={handleNavigation}
              >
                Login
              </Link>
            </div>

            {/* Hamburger button */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Dark Mode Toggle for Mobile */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="dark-mode-toggle mr-2"
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

              <button
                type="button"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className={`md:hidden p-2 rounded-md flex items-center transition-all duration-200 ${
                  isOpen
                    ? 'bg-purple-900/20 text-purple-400'
                    : 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700'
                }`}
                onClick={handleToggle}
                style={{ cursor: 'pointer', zIndex: 50 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
                <span className="text-sm font-medium">{isOpen ? "Close" : "Menu"}</span>
              </button>
            </div>
          </div>

          {/* Mobile menu with transitions */}
          <div
            className={`md:hidden bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 absolute w-full transform transition-all duration-300 ease-in-out ${
              isOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            style={{ maxHeight: isOpen ? '1000px' : '0px', overflow: 'hidden', transitionProperty: 'transform, opacity, max-height' }}
          >
            <div className="p-5 space-y-3 border-t border-gray-100 dark:border-gray-700">
              <Link
                href="/subjects"
                className="block py-2.5 px-4 rounded-lg text-purple-800 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={handleNavigation}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Subjects
                </div>
              </Link>
              <Link
                href="/quiz"
                className="block py-2.5 px-4 rounded-lg text-purple-800 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={handleNavigation}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quizzes
                </div>
              </Link>
              <Link
                href="/forum"
                className="block py-2.5 px-4 rounded-lg text-purple-800 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={handleNavigation}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Forum
                </div>
              </Link>
              <Link
                href="/resources"
                className="block py-2.5 px-4 rounded-lg text-purple-800 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={handleNavigation}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Resources
                </div>
              </Link>
              <div className="pt-3">
                <Link
                  href="/login"
                  className="block w-full text-center text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 px-4 py-3 rounded-lg shadow-md hover:shadow-lg dark:shadow-purple-900/20 transition-all duration-200"
                  onClick={handleNavigation}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}