'use client';

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
  const [isOpen, setIsOpen] = useState(false);
  
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

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm relative z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600"
              >
                DEV<span className="text-purple-800">{"{thon}"}</span>
                <span className="text-sm align-top text-purple-800">2.0</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/subjects" className="text-gray-600 hover:text-purple-800 transition-colors duration-200">Subjects</Link>
              <Link href="/quiz" className="text-gray-600 hover:text-purple-800 transition-colors duration-200">Quizzes</Link>
              <Link href="/forum" className="text-gray-600 hover:text-purple-800 transition-colors duration-200">Forum</Link>
              <Link href="/resources" className="text-gray-600 hover:text-purple-800 transition-colors duration-200">Resources</Link>
              <Link 
                href="/login" 
                className="text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 px-5 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            </div>
            
            {/* Hamburger button */}
            <button 
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className={`md:hidden p-2 rounded-md flex items-center transition-all duration-200 ${
                isOpen ? 'bg-purple-50 text-purple-800' : 'bg-white text-purple-700 hover:bg-purple-50'
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
          
          {/* Mobile menu with transitions */}
          <div 
            className={`md:hidden bg-white shadow-lg absolute w-full transform transition-all duration-300 ease-in-out ${
              isOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            style={{ maxHeight: isOpen ? '1000px' : '0px', overflow: 'hidden', transitionProperty: 'transform, opacity, max-height' }}
          >
            <div className="p-5 space-y-3 border-t border-gray-100">
              <Link 
                href="/subjects" 
                className="block py-2.5 px-4 rounded-lg text-purple-800 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Subjects
                </div>
              </Link>
              <Link 
                href="/quiz" 
                className="block py-2.5 px-4 rounded-lg text-purple-800 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quizzes
                </div>
              </Link>
              <Link 
                href="/forum" 
                className="block py-2.5 px-4 rounded-lg text-purple-800 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Forum
                </div>
              </Link>
              <Link 
                href="/resources" 
                className="block py-2.5 px-4 rounded-lg text-purple-800 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Resources
                </div>
              </Link>
              <div className="pt-3">
                <Link 
                  href="/login" 
                  className="block w-full text-center text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
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