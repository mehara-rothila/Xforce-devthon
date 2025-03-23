'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(true);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Toggle between desktop and mobile view
  const toggleMobileView = () => {
    setIsMobileView(!isMobileView);
    // Add class to body to control viewport
    if (!isMobileView) {
      document.body.classList.add('mobile-view-active');
      // Set viewport meta tag for mobile view
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=375, initial-scale=1');
      }
    } else {
      document.body.classList.remove('mobile-view-active');
      // Reset viewport meta tag
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    }
  };
  
  // Set mobile view by default on page load
  useEffect(() => {
    if (isMobileView) {
      document.body.classList.add('mobile-view-active');
      // Set viewport meta tag for mobile view
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=375, initial-scale=1');
      }
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('mobile-view-active');
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    };
  }, []);

  // Navigation Items
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Subjects", href: "#subjects" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" }
  ];
  
  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className={`min-h-screen ${isMobileView ? 'mobile-view' : ''}`}>
      {/* Fixed Mobile View Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={toggleMobileView}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
          title={isMobileView ? "Switch to Desktop View" : "Switch to Mobile View"}
        >
          {isMobileView ? (
            // Desktop icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ) : (
            // Mobile icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Responsive Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">
                DEV<span className="text-purple-600">{"{"}</span>thon<span className="text-purple-600">{"}"}</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href} 
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Authentication Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                type="button" 
                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" 
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  // Close icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Menu icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden bg-white dark:bg-gray-900 pt-2 pb-4 px-4 shadow-lg ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col space-y-4">
              <Link 
                href="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-300 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Page Content - Replace with your actual page content */}
      <div className="pt-16"> {/* Add padding-top to account for fixed header */}
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              DEV<span>{"{thon}"}</span> <span className="text-sm align-top">2.0</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-light">
              {"<!--Design Your Dreams into Reality-->"}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Gamified Learning Experience <br className="hidden md:block" />
              for Sri Lankan A/L Students
            </h2>
            <p className="text-lg max-w-3xl mx-auto mb-12">
              Transform your exam preparation with interactive quizzes, personalized AI feedback, and a collaborative learning community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" className="bg-white text-purple-900 font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
              <Link href="/login" className="bg-transparent border-2 border-white text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Placeholder for other sections */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Features</h2>
            <p className="text-lg mb-12">
              Our platform combines gamification, social learning, and AI to create an interactive learning experience.
            </p>
            {/* Feature cards would go here */}
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">Feature {item}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Feature description would go here.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* More sections would go here */}
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">DEV{"{thon}"}</h3>
                <p className="text-gray-400">
                  A gamified learning platform for Sri Lankan A/L students.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
                  <li><Link href="#subjects" className="text-gray-400 hover:text-white">Subjects</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">
                  Email: info@devthon.com<br />
                  Phone: +94 123 456 789<br />
                  Sri Lanka
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">© 2025 Team Xforce. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}