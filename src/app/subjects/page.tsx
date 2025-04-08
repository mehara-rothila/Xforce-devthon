// app/subjects/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../DarkModeContext'; // Adjust path if needed
import api from '../utils/api'; // <-- ADDED: Import the configured API client

// Define Subject type based on your model
interface Subject {
  _id: string;
  name: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  topics: { _id?: string; name: string }[]; // Basic topic structure
}

// Icon component map (similar to previous example) - Keep your original Icon logic here
const SubjectIcon = ({ iconName, color }: { iconName: string, color: string }) => {
    // Return the appropriate SVG based on iconName, applying the 'color' prop dynamically
    // Example for 'atom' icon (assuming color prop works directly or use inline style 'fill'/'stroke')
    if (iconName === 'atom') {
        return (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
            </svg>
        );
    }
     if (iconName === 'flask') {
       return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
       );
    }
    if (iconName === 'calculator') { // Example icon name
       return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
       );
    }
    if (iconName === 'book') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    if (iconName === 'globe') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    // Default Book Icon
     return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
};

// Helper to get Tailwind arbitrary compatible color with opacity - Keep your original helper
const colorToTailwind = (hexColor = '#808080', opacity = 'FF') => {
    const cleanHex = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
    const opacitySuffix = opacity === 'FF' ? '' : `/${parseInt(opacity, 16)}`;
    return `[#${cleanHex}]${opacitySuffix}`;
};

export default function Subjects() {
  const { isDarkMode } = useDarkMode();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleSubjects, setVisibleSubjects] = useState<Subject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 3; // Show 3 subjects per page

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // --- MODIFIED HERE ---
        const response = await api.subjects.getAll(); // Use the imported API client

        // Adjust data access based on your backend response structure.
        // Common patterns:
        // 1. If backend returns { data: [subjects...] }: use response.data
        // 2. If backend returns { data: { subjects: [...] } }: use response.data.data
        // 3. If backend returns { subjects: [...] }: use response.data.subjects
        // Choose the one that matches your controller's response.
        const fetchedSubjects = response.data.data || response.data || []; // Example: trying common patterns

        // Ensure fetchedSubjects is actually an array before setting state
        if (Array.isArray(fetchedSubjects)) {
            setSubjects(fetchedSubjects);
            setVisibleSubjects(fetchedSubjects.slice(0, subjectsPerPage));
        } else {
            console.error("Fetched data is not an array:", fetchedSubjects);
            setError("Received unexpected data format from server.");
            setSubjects([]);
            setVisibleSubjects([]);
        }
        // --- END MODIFICATION ---

      } catch (err: any) { // Added basic error typing
        console.error("Error fetching subjects:", err);
        // Provide a more user-friendly error message
        setError(err.response?.data?.message || err.message || "Failed to load subjects. Please try again.");
        setSubjects([]);
        setVisibleSubjects([]); // Clear subjects on error
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle pagination - Keep your original function
  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * subjectsPerPage;
    setVisibleSubjects(subjects.slice(startIndex, startIndex + subjectsPerPage));
    setCurrentPage(page);
  };

  // Define border hover color class based on subject color - Keep your original function
  const getHoverBorderClass = (color: string) => {
      const cleanHex = color.startsWith('#') ? color.substring(1) : color;
      return `hover:border-[#${cleanHex}] dark:hover:border-[#${cleanHex}]`;
  };

  // --- Keep all the JSX rendering logic below this line exactly as you had it ---
  // (Including the main div, header, loading/error/empty states, grid, pagination, CTA, style jsx global)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Keep all your floating icons divs here */}
        <div className="absolute top-10 left-[5%] text-purple-500 dark:text-purple-400 text-7xl opacity-70 floating-icon">∑</div>
        <div className="absolute top-[15%] right-[10%] text-blue-500 dark:text-blue-400 text-8xl opacity-60 floating-icon-reverse">π</div>
        {/* ... include ALL other icon divs ... */}
        <div className="absolute bottom-[10%] left-[50%] opacity-50 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
           {/* Keep header content */}
           <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 mb-3 transition-colors duration-300 shadow-sm backdrop-blur-sm animate-pulse-subtle">Accelerated Learning</span>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl lg:text-5xl tracking-tight transition-colors duration-300 text-shadow relative z-10">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400">Subjects</span>
            <span className="absolute -top-2 -right-2 text-5xl text-purple-200 dark:text-purple-800 opacity-50 transform rotate-12 z-0">*</span>
            <span className="absolute -bottom-1 -left-1 text-4xl text-blue-200 dark:text-blue-800 opacity-50 transform -rotate-6 z-0">∞</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            Prepare for your A/L exams with comprehensive materials tailored to the Sri Lankan curriculum.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading subjects...</p>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="text-center py-6 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg">
                 <div className="text-red-500 text-3xl mb-3">⚠️</div>
                <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
        )}

        {/* No Subjects Found State */}
        {!loading && !error && subjects.length === 0 && (
             <div className="text-center py-6 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-lg">
                 <div className="text-yellow-500 text-3xl mb-3">🤔</div>
                <p className="text-yellow-700 dark:text-yellow-300">No subjects found. Please check the backend or seed the database.</p>
            </div>
        )}

        {/* Dynamic Subject Cards */}
        {!loading && visibleSubjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {visibleSubjects.map((subject) => {
                // Keep all the card rendering logic exactly the same
                const safeColor = subject.color || '#cccccc'; // Fallback color
                const safeGradientFrom = subject.gradientFrom || safeColor;
                const safeGradientTo = subject.gradientTo || safeColor;
                const iconBgColorClass = `bg-[${safeColor}]/10 dark:bg-[${safeColor}]/30`;
                const keyTopicBgClass = `bg-[${safeColor}]/5 dark:bg-[${safeColor}]/10`;
                const keyTopicTextColorClass = `text-[${safeColor}] dark:text-[${safeColor}]`;
                const checkIconColorClass = `text-[${safeColor}] dark:text-[${safeColor}]`;
                const maxTopics = 3;
                const actualTopics = subject.topics?.length || 0;
                const emptyTopicsNeeded = Math.max(0, maxTopics - actualTopics);
                const topicsToShow = subject.topics?.slice(0, maxTopics) || [];

                return (
                  <div key={subject._id}
                       className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl dark:shadow-gray-900/10 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700
                       ${getHoverBorderClass(safeColor)} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative h-full animated-border flex flex-col`}
                  >
                    {/* Top gradient banner */}
                    <div
                        className="h-16 w-full relative overflow-hidden animated-gradient"
                        style={{ background: `linear-gradient(45deg, ${safeGradientFrom}, ${safeGradientTo}, ${safeGradientFrom})`}}
                    >
                       <div className="absolute top-2 right-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-1 shadow-md">
                            <SubjectIcon iconName={subject.icon} color="#ffffff" />
                        </div>
                    </div>
                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                       {/* Title with icon */}
                        <div className="flex items-center -mt-8 mb-4 relative z-10">
                            <div className={`h-14 w-14 ${iconBgColorClass} rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-700 transition-colors duration-300`}>
                               <SubjectIcon iconName={subject.icon} color={safeColor} />
                            </div>
                            <h2 className="ml-3 text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                                {subject.name}
                                <div className={`h-1 w-0 group-hover:w-full mt-0.5 transition-all duration-500 ease-out ${subject.color}`}
                                     style={{ backgroundColor: safeColor }}></div>
                            </h2>
                        </div>
                        {/* Short description */}
                         <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300 line-clamp-2 mb-4">
                            {subject.description}
                        </p>
                        {/* Key Topics */}
                         <div className={`${keyTopicBgClass} rounded-lg p-3 transition-colors duration-300 mb-4 flex-1`}>
                           <h3 className={`font-medium ${keyTopicTextColorClass} text-sm mb-2 transition-colors duration-300 flex items-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Key Topics
                            </h3>
                            <ul className="space-y-1.5">
                                {topicsToShow.map(topic => (
                                    <li key={topic._id || topic.name} className="flex items-start">
                                        <svg className={`h-4 w-4 ${checkIconColorClass} mr-1.5 mt-0.5 transition-colors duration-300 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="text-xs text-gray-700 dark:text-gray-300 transition-colors duration-300">{topic.name}</span>
                                    </li>
                                ))}
                                {Array.from({ length: emptyTopicsNeeded }).map((_, index) => ( <li key={`empty-${index}`} className="flex items-start opacity-0 h-6"><svg className={`h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span className="text-xs">Placeholder</span></li>))}
                                {(!subject.topics || subject.topics.length === 0) && emptyTopicsNeeded === 0 && (<li className="text-xs text-gray-500 italic">No topics available</li>)}
                            </ul>
                        </div>
                        {/* Explore Button */}
                        <div className="mt-auto pt-3">
                           <Link
                            href={`/subjects/${subject._id}`}
                            className={`w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${safeColor}] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md animated-gradient`}
                            style={{ background: `linear-gradient(45deg, ${safeGradientFrom}, ${safeGradientTo}, ${safeGradientFrom})`}}
                            >
                              Explore {subject.name}
                              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </Link>
                        </div>
                    </div>
                  </div>
                );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && subjects.length > subjectsPerPage && (
          <div className="flex justify-center space-x-2 mb-4">
             {/* Keep pagination logic */}
              {Array.from({ length: Math.ceil(subjects.length / subjectsPerPage) }, (_, i) => i + 1).map(page => ( <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-md transition-colors duration-300 ${ currentPage === page ? 'bg-purple-600 text-white dark:bg-purple-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' }`}>{page}</button>))}
          </div>
        )}

        {/* Call to action Section */}
        <div className="mb-6 bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-800 dark:to-indigo-800 rounded-xl shadow-xl dark:shadow-gray-900/20 overflow-hidden">
             {/* Keep CTA content */}
             <div className="px-6 py-8 md:p-8 relative">
                <div className="absolute inset-0 opacity-10"><div className="absolute top-1/4 left-1/4 text-white text-4xl">∑</div><div className="absolute bottom-1/4 right-1/4 text-white text-3xl">F=ma</div><div className="absolute top-3/4 left-1/3 text-white text-3xl">H₂O</div></div>
                <div className="relative z-10 md:flex items-center justify-between">
                    <div className="md:w-2/3 mb-6 md:mb-0"><h2 className="text-2xl font-bold text-white">Ready to accelerate your learning?</h2><p className="mt-2 text-purple-100 text-base">Join thousands of students already benefiting from our comprehensive learning resources.</p></div>
                    <div className="md:w-1/3 text-center"><Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-white text-sm font-medium rounded-lg text-purple-700 dark:text-purple-900 bg-white dark:bg-white hover:bg-purple-50 dark:hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-700 focus:ring-white transition-all duration-200 shadow-md hover:-translate-y-0.5 transform"><svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>Go to Dashboard</Link></div>
                </div>
             </div>
        </div>

      </div>

      {/* Add global style for animations */}
      <style jsx global>{`
        /* Keep all your original global styles */
        .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .animate-pulse-subtle { animation: pulse-subtle 3s infinite; }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .animated-gradient { background-size: 400% 400%; animation: gradient-shift 8s ease infinite; }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-border { position: relative; overflow: hidden; }
        .animated-border::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 3s infinite; }
        @keyframes shine { 0% { left: -100%; } 50% { left: 100%; } 100% { left: 100%; } }
        .floating-icon { animation: float 6s ease-in-out infinite; }
        .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .floating-icon-slow { animation: float 10s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0) rotate(0deg); } }
        @keyframes float-reverse { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-5deg); } 100% { transform: translateY(0) rotate(0deg); } }
      `}</style>
    </div>
  );
}