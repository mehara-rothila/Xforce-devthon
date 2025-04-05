// app/subjects/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../DarkModeContext'; // Adjust path if needed
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

// Icon component map (similar to previous example)
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
    // Default Book Icon
     return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
};

// Helper to get Tailwind arbitrary compatible color with opacity
// e.g., colorToTailwind(subject.color, '10') -> '[#3498db]/10'
// Important: Tailwind needs the exact hex code for arbitrary values.
const colorToTailwind = (hexColor = '#808080', opacity = 'FF') => {
    // Basic hex validation (remove # if present)
    const cleanHex = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
    // Construct the arbitrary value string
    // Opacity FF (100%) is usually implied, but be explicit if needed or use Tailwind's opacity shorthand `/10`, `/20` etc.
    const opacitySuffix = opacity === 'FF' ? '' : `/${parseInt(opacity, 16)}`; // Convert hex opacity to Tailwind integer opacity
    return `[#${cleanHex}]${opacitySuffix}`;
};


export default function Subjects() {
  const { isDarkMode } = useDarkMode();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/subjects`);
        setSubjects(response.data.data?.subjects || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects. Please ensure the backend is running.");
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Define border hover color class based on subject color
  // Tailwind JIT needs full class names, sometimes dynamic bracket notation can be tricky with hover states.
  // A helper function might be needed if simple bracket notation doesn't work reliably for hover borders.
  // Let's try with arbitrary values first.
  const getHoverBorderClass = (color: string) => {
      // Assuming color is a hex like #3498db
      const cleanHex = color.startsWith('#') ? color.substring(1) : color;
      return `hover:border-[#${cleanHex}]/30 dark:hover:border-[#${cleanHex}]/70`;
      // If this doesn't work reliably, you might need a map or switch statement
      // returning specific Tailwind classes like 'hover:border-blue-200 dark:hover:border-blue-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 mb-4 transition-colors duration-300">Advanced Level</span>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl tracking-tight transition-colors duration-300">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Subjects</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Prepare for your A/L exams with comprehensive materials tailored to the Sri Lankan curriculum.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading subjects...</p>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                 <div className="text-red-500 text-3xl mb-3">⚠️</div>
                <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
        )}

        {/* No Subjects Found State */}
        {!loading && !error && subjects.length === 0 && (
             <div className="text-center py-10 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                 <div className="text-yellow-500 text-3xl mb-3">🤔</div>
                <p className="text-yellow-700 dark:text-yellow-300">No subjects found. Please check the backend or seed the database.</p>
            </div>
        )}

        {/* Dynamic Subject Cards */}
        {!loading && subjects.length > 0 && subjects.map((subject) => {
            const safeColor = subject.color || '#cccccc'; // Fallback color
            const safeGradientFrom = subject.gradientFrom || safeColor;
            const safeGradientTo = subject.gradientTo || safeColor;
            // Generate dynamic Tailwind classes using arbitrary values
            const iconBgColorClass = `bg-[${safeColor}]/10 dark:bg-[${safeColor}]/40`; // e.g., bg-[#3498db]/10 dark:bg-[#3498db]/40
            const keyTopicBgClass = `bg-[${safeColor}]/10 dark:bg-[${safeColor}]/20`; // e.g., bg-[#3498db]/10 dark:bg-[#3498db]/20
            const keyTopicTextColorClass = `text-[${safeColor}]/80 dark:text-[${safeColor}]/70`; // e.g. text-[#3498db]/80 dark:text-[#3498db]/70 - Adjust opacity as needed
            const checkIconColorClass = `text-[${safeColor}] dark:text-[${safeColor}]/80`; // Example for checkmark icon

            return (
              <div key={subject._id}
                   className={`bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/10 rounded-2xl overflow-hidden mb-16 transform transition duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/20 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 ${getHoverBorderClass(safeColor)}`}
              >
                <div className="md:flex">
                    {/* Left side gradient + decorative */}
                    <div
                        className="md:flex-shrink-0 w-full md:w-64 h-48 md:h-auto relative overflow-hidden"
                        // Apply gradient using inline style
                        style={{ background: `linear-gradient(to bottom right, ${safeGradientFrom}, ${safeGradientTo})`}}
                    >
                       {/* You can add subject-specific decorative elements here if needed */}
                       <div className="absolute inset-0 opacity-20">
                            {/* Placeholder decorations */}
                            <div className="absolute top-1/4 left-1/4 text-white text-4xl opacity-50">{subject.name.substring(0,3)}</div>
                            <div className="absolute bottom-1/4 right-1/4 text-white text-3xl opacity-50">{subject.icon}</div>
                       </div>
                    </div>
                    {/* Right side content */}
                    <div className="p-8 md:p-10 flex-1">
                        <div className="flex items-center">
                            {/* Icon container with dynamic BG */}
                            <div className={`h-14 w-14 ${iconBgColorClass} rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                               <SubjectIcon iconName={subject.icon} color={safeColor} />
                            </div>
                            <h2 className="ml-5 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{subject.name}</h2>
                        </div>
                        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                            {subject.description}
                        </p>

                        {/* Dynamic Key Topics / Resources Sections */}
                         <div className="mt-8 grid md:grid-cols-2 gap-6">
                           {/* Key Topics Column */}
                           {subject.topics && subject.topics.length > 0 && (
                               <div className={`${keyTopicBgClass} rounded-xl p-5 transition-colors duration-300`}>
                                    <h3 className={`font-semibold ${keyTopicTextColorClass} mb-3 text-lg transition-colors duration-300`}>Key Topics</h3>
                                    <ul className="space-y-3">
                                        {subject.topics.slice(0, 4).map(topic => (
                                            <li key={topic._id || topic.name} className="flex items-start">
                                                <svg className={`h-5 w-5 ${checkIconColorClass} mr-3 mt-0.5 transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{topic.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                               </div>
                           )}
                            {/* Placeholder Resources Column (adjust as needed) */}
                             <div className={`${keyTopicBgClass} rounded-xl p-5 transition-colors duration-300`}>
                                <h3 className={`font-semibold ${keyTopicTextColorClass} mb-3 text-lg transition-colors duration-300`}>Resources</h3>
                                <ul className="space-y-3">
                                    {/* Example static list - replace with dynamic data if available */}
                                    <li className="flex items-start">
                                         <svg className={`h-5 w-5 ${checkIconColorClass} mr-3 mt-0.5 transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                         <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Interactive Lessons</span>
                                    </li>
                                     <li className="flex items-start">
                                         <svg className={`h-5 w-5 ${checkIconColorClass} mr-3 mt-0.5 transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                         <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Practice Quizzes</span>
                                    </li>
                                     <li className="flex items-start">
                                         <svg className={`h-5 w-5 ${checkIconColorClass} mr-3 mt-0.5 transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                         <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Past Papers</span>
                                    </li>
                                     {/* Add more static or dynamic resource examples */}
                                </ul>
                             </div>
                        </div>

                        {/* Explore Button with dynamic gradient/focus */}
                        <div className="mt-10">
                            <Link
                                href={`/subjects/${subject._id}`} // Dynamic link
                                className={`inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${safeColor}] transition-all duration-200 transform hover:-translate-y-1`}
                                // Apply gradient using inline style
                                style={{ background: `linear-gradient(to right, ${safeGradientFrom}, ${safeGradientTo})`}}
                            >
                                Explore {subject.name}
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
              </div>
            )
        })}

        {/* Call to action Section */}
         <div className="mt-8 mb-8 bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-800 dark:to-indigo-800 rounded-2xl shadow-xl dark:shadow-gray-900/20 overflow-hidden">
           {/* ... Contents of CTA ... */}
           <div className="px-8 py-12 md:p-12 relative">
            <div className="absolute inset-0 opacity-10"> {/* Decorative elements */}
               <div className="absolute top-1/4 left-1/4 text-white text-4xl">∑</div>
               <div className="absolute bottom-1/4 right-1/4 text-white text-3xl">F=ma</div>
               <div className="absolute top-3/4 left-1/3 text-white text-3xl">H₂O</div>
            </div>
            <div className="relative z-10 md:flex items-center justify-between">
               <div className="md:w-2/3 mb-8 md:mb-0">
                 <h2 className="text-3xl font-bold text-white">Ready to accelerate your learning?</h2>
                 <p className="mt-4 text-purple-100 text-lg">Join thousands of students already benefiting from our comprehensive learning resources.</p>
               </div>
               <div className="md:w-1/3 text-center">
                 <Link
                   href="/dashboard"
                   className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-lg text-purple-700 dark:text-purple-900 bg-white dark:bg-white hover:bg-purple-50 dark:hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-700 focus:ring-white transition-all duration-200 shadow-md"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                   Go to Dashboard
                 </Link>
               </div>
            </div>
           </div>
         </div>

      </div>
    </div>
  );
}