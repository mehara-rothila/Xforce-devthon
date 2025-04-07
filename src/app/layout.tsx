// src/app/layout.tsx
'use client';

import React from 'react'; // Still needed for JSX
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DarkModeProvider, DarkModeToggle } from '@/app/DarkModeContext'; // Import Provider and Toggle
import { AuthProvider, useAuth } from '@/app/context/AuthContext'; // <-- Import AuthProvider and useAuth
import { Home, BookOpen, HelpCircle, FileText, MessageSquare, LogIn, UserPlus, User, LogOut, ShieldCheck, Settings } from 'lucide-react'; // <-- Added more icons
import './globals.css'; // Import global styles

const inter = Inter({ subsets: ['latin'] });

// --- Auth Aware Header Component ---
// Extracted header logic into its own component to easily use the useAuth hook
const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuth(); // <-- Use the auth context

  // Effect to close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { setIsOpen(false); }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleToggle() { setIsOpen(!isOpen); }
  const handleNavigation = () => { if (isOpen) { setIsOpen(false); } };
  const handleLogout = () => {
      handleNavigation(); // Close menu if open
      logout(); // Call logout from context
      // Optionally redirect to home or login page after logout
      // Example: Redirect to login page
      // window.location.href = '/login'; // Force reload/redirect if needed
      // Or use Next.js router if available and appropriate in this component
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 relative z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-purple-600" onClick={handleNavigation}>
            DEV<span className="text-purple-800 dark:text-purple-400">{"{thon}"}</span>
            <span className="text-sm align-top text-purple-800 dark:text-purple-400">2.0</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Standard Navigation Links */}
          <Link href="/subjects" className="nav-link" onClick={handleNavigation}>Subjects</Link>
          <Link href="/quiz" className="nav-link" onClick={handleNavigation}>Quizzes</Link>
          <Link href="/forum" className="nav-link" onClick={handleNavigation}>Forum</Link>
          <Link href="/resources" className="nav-link" onClick={handleNavigation}>Resources</Link>

          {/* --- Conditionally render Admin Link --- */}
          {/* Show only if NOT loading, user exists, AND user role is admin */}
          {!isLoading && user && user.role === 'admin' && (
            <Link href="/admin" className="nav-link text-red-600 dark:text-red-400 font-semibold flex items-center" onClick={handleNavigation}>
                <ShieldCheck className="inline h-5 w-5 mr-1" /> Admin
            </Link>
          )}
          {/* -------------------------------------- */}

          {/* Dark Mode Toggle */}
          <div className="flex items-center"><DarkModeToggle /></div>

          {/* --- Conditional Login/User Menu --- */}
          {/* Show loading indicator */}
          {isLoading && (
              <div className="nav-link text-gray-500 dark:text-gray-400">Loading...</div>
          )}

          {/* Show User links if NOT loading and user exists */}
          {!isLoading && user && (
              <>
                <Link href="/dashboard" className="nav-link flex items-center" onClick={handleNavigation}>
                    <User className="inline h-5 w-5 mr-1" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="nav-link text-red-600 dark:text-red-400 flex items-center">
                    <LogOut className="inline h-5 w-5 mr-1" /> Logout
                </button>
              </>
          )}

          {/* Show Login link if NOT loading and user does NOT exist */}
          {!isLoading && !user && (
              <Link href="/login" className="text-white bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 px-5 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg dark:shadow-purple-900/20 flex items-center" onClick={handleNavigation}>
                  <LogIn className="inline h-5 w-5 mr-1" /> Login
              </Link>
          )}
          {/* ----------------------------------- */}
        </nav>

        {/* Mobile Hamburger button area */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Dark Mode Toggle for Mobile */}
          <div className="flex items-center justify-center"><DarkModeToggle /></div>

          {/* Hamburger Button */}
          <button type="button" aria-label={isOpen ? "Close menu" : "Open menu"} className="p-2 rounded-md flex items-center transition-all duration-200 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500" onClick={handleToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu flyout */}
      <div
        className={`md:hidden bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 absolute w-full transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0 max-h-[1000px]' : 'opacity-0 -translate-y-4 pointer-events-none max-h-0'}`}
        style={{ overflow: 'hidden', transitionProperty: 'transform, opacity, max-height' }}
        aria-hidden={!isOpen} // Accessibility: hide when closed
      >
        <div className="p-5 space-y-3 border-t border-gray-100 dark:border-gray-700">
          {/* --- Conditional User/Auth Links (Mobile) --- */}
          {isLoading && (
             <div className="mobile-nav-link text-gray-500 dark:text-gray-400">Loading...</div>
          )}
          {!isLoading && user && (
            <>
              {/* Display Welcome message */}
              <div className="mobile-nav-link text-gray-900 dark:text-gray-100 font-semibold border-b dark:border-gray-700 pb-3 mb-3">Welcome, {user.name}!</div>
              <Link href="/dashboard" className="mobile-nav-link flex items-center" onClick={handleNavigation}><User className="inline h-5 w-5 mr-2"/> Dashboard</Link>
            </>
          )}
          {!isLoading && !user && (
             <Link href="/register" className="mobile-nav-link flex items-center" onClick={handleNavigation}><UserPlus className="inline h-5 w-5 mr-2"/> Register</Link>
          )}
          {/* ------------------------------------------- */}

          {/* Standard Mobile Links */}
          <Link href="/subjects" className="mobile-nav-link flex items-center" onClick={handleNavigation}><BookOpen className="inline h-5 w-5 mr-2"/> Subjects</Link>
          <Link href="/quiz" className="mobile-nav-link flex items-center" onClick={handleNavigation}><HelpCircle className="inline h-5 w-5 mr-2"/> Quizzes</Link>
          <Link href="/forum" className="mobile-nav-link flex items-center" onClick={handleNavigation}><MessageSquare className="inline h-5 w-5 mr-2"/> Forum</Link>
          <Link href="/resources" className="mobile-nav-link flex items-center" onClick={handleNavigation}><FileText className="inline h-5 w-5 mr-2"/> Resources</Link>

           {/* --- Conditionally render Admin Link (Mobile) --- */}
           {!isLoading && user && user.role === 'admin' && (
             <Link href="/admin" className="mobile-nav-link text-red-600 dark:text-red-400 font-semibold flex items-center" onClick={handleNavigation}>
               <ShieldCheck className="inline h-5 w-5 mr-2"/> Admin Panel
             </Link>
           )}
           {/* --------------------------------------------- */}

          {/* Conditional Login/Logout Button (Mobile) */}
          <div className="pt-3">
            {isLoading ? null : user ? (
                <button onClick={handleLogout} className="mobile-login-button w-full text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/50 flex items-center justify-center">
                    <LogOut className="inline h-5 w-5 mr-2" /> Logout
                </button>
            ) : (
                <Link href="/login" className="mobile-login-button w-full flex items-center justify-center" onClick={handleNavigation}>
                    <LogIn className="inline h-5 w-5 mr-2" /> Login
                </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


// --- Root Layout Component ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Effect to set document title (can be done via metadata usually)
  useEffect(() => {
    document.title = "XForce Learning Platform | DEV{thon} 2.0";
  }, []);

  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning for dark mode */}
      {/* Wrap the entire application structure with Providers */}
      {/* AuthProvider should wrap DarkModeProvider if DarkModeToggle needs auth state, */}
      {/* or vice-versa if AuthProvider needs dark mode state. */}
      {/* If independent, the order might not strictly matter, but wrapping Auth first is common. */}
      <AuthProvider> {/* Handles fetching user */}
        <DarkModeProvider> {/* Handles dark mode toggle */}
          <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-300`}>
            <AppHeader /> {/* Use the Auth Aware Header */}
            <main>{children}</main>
            {/* Optional: Add a Footer component here */}
            {/* <footer> ... </footer> */}
          </body>
        </DarkModeProvider>
      </AuthProvider>
    </html>
  );
}
