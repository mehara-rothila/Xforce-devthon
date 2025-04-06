'use client';

import React from 'react'; // Still needed for JSX
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Keep for mobile menu state
import { DarkModeProvider, DarkModeToggle } from '@/app/DarkModeContext'; // Import Provider and Toggle
import './globals.css'; // Import global styles

const inter = Inter({ subsets: ['latin'] });

// Metadata can be defined statically or exported if needed elsewhere
// export const metadata = {
//  title: "XForce Learning Platform | DEV{thon} 2.0",
//  description: "Your description here",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State only for the mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);

  // Effect to set document title (can be done via metadata usually)
  useEffect(() => {
    document.title = "XForce Learning Platform | DEV{thon} 2.0";
  }, []);

  // Effect to close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile menu toggle handler
  function handleToggle() {
    setIsOpen(!isOpen);
  }

  // Navigation click handler (closes mobile menu)
  const handleNavigation = (e: React.MouseEvent) => {
    // Close the mobile menu if it's open when a link is clicked
    if (isOpen) {
      setIsOpen(false);
    }
    // Allow default link behavior to proceed
  };

  return (
    // The DarkModeProvider now handles adding/removing the 'dark' class to <html>
    // No need to hardcode className="dark" here.
    <html lang="en">
      {/* Wrap the entire application structure with DarkModeProvider */}
      <DarkModeProvider>
        {/* Apply Inter font and base background/transition classes to body */}
        {/* The dark:bg-gray-900 will be applied when DarkModeProvider adds 'dark' to <html> */}
        <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-300`}>
          {/* Header component */}
          <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 relative z-30 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600"
                  onClick={handleNavigation} // Close mobile menu on logo click if open
                >
                  DEV<span className="text-purple-800 dark:text-purple-400">{"{thon}"}</span>
                  <span className="text-sm align-top text-purple-800 dark:text-purple-400">2.0</span>
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Navigation Links */}
                <Link href="/subjects" className="nav-link" onClick={handleNavigation}>Subjects</Link>
                <Link href="/quiz" className="nav-link" onClick={handleNavigation}>Quizzes</Link>
                <Link href="/forum" className="nav-link" onClick={handleNavigation}>Forum</Link>
                <Link href="/resources" className="nav-link" onClick={handleNavigation}>Resources</Link>

                {/* Wrap the toggle in a div with proper alignment */}
                <div className="flex items-center">
                  <DarkModeToggle />
                </div>

                {/* Login Link */}
                <Link
                  href="/login"
                  className="text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 px-5 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-purple-900/20"
                  onClick={handleNavigation}
                >
                  Login
                </Link>
              </div>

              {/* Mobile Hamburger button area */}
              <div className="md:hidden flex items-center space-x-3">
                {/* Aligned DarkModeToggle for Mobile */}
                <div className="flex items-center justify-center">
                  <DarkModeToggle />
                </div>

                {/* Hamburger Button */}
                <button
                  type="button"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  className="p-2 rounded-md flex items-center transition-all duration-200 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                  onClick={handleToggle}
                >
                  {/* Hamburger/Close Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> // Close icon
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile menu flyout */}
            <div
              // Apply transitions for smooth opening/closing
              className={`md:hidden bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 absolute w-full transform transition-all duration-300 ease-in-out ${
                isOpen
                  ? 'opacity-100 translate-y-0' // Open state
                  : 'opacity-0 -translate-y-4 pointer-events-none' // Closed state
              }`}
              // Control visibility and prevent interaction when closed
              style={{ maxHeight: isOpen ? '1000px' : '0px', overflow: 'hidden', transitionProperty: 'transform, opacity, max-height' }}
            >
              {/* Mobile menu links */}
              <div className="p-5 space-y-3 border-t border-gray-100 dark:border-gray-700">
                {/* Use consistent styling class .mobile-nav-link */}
                <Link href="/subjects" className="mobile-nav-link" onClick={handleNavigation}>
                  <div className="flex items-center"> {/* Add Icons if desired */} Subjects </div>
                </Link>
                <Link href="/quiz" className="mobile-nav-link" onClick={handleNavigation}>
                  <div className="flex items-center"> {/* Add Icons if desired */} Quizzes </div>
                </Link>
                <Link href="/forum" className="mobile-nav-link" onClick={handleNavigation}>
                  <div className="flex items-center"> {/* Add Icons if desired */} Forum </div>
                </Link>
                <Link href="/resources" className="mobile-nav-link" onClick={handleNavigation}>
                  <div className="flex items-center"> {/* Add Icons if desired */} Resources </div>
                </Link>
                <div className="pt-3">
                  {/* Use consistent styling class .mobile-login-button */}
                  <Link href="/login" className="mobile-login-button" onClick={handleNavigation}> Login </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area where page components are rendered */}
          <main>{children}</main>

          {/* Optional: Add a Footer component here */}
          {/* <footer> ... </footer> */}
        </body>
      </DarkModeProvider>
    </html>
  );
}