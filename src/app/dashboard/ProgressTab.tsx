// src/app/dashboard/ProgressTab.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../utils/api'; // Import the API service
import { useAuth } from '@/app/context/AuthContext'; // Import AuthContext

// Define interfaces for the data structure expected from the backend
interface TopicProgress {
    id: string; // Topic ID
    name: string;
    progress: number;
    mastery: 'low' | 'medium' | 'high' | 'mastered' | string; // Allow string for flexibility
}

interface PerformanceComparison {
    overallStanding: string;
    quizCompletionRate: string;
    consistencyScore: string;
}

interface AnalyticsData {
    timeSpent: string;
    quizAccuracy: string;
    weakAreas: string[];
    performanceComparison: PerformanceComparison;
}

interface ProgressData {
    subjectId: string;
    subjectName: string;
    subjectColor: string;
    overallProgress: number;
    topics: TopicProgress[];
    analytics?: AnalyticsData; // Make analytics optional for now
}

// --- Updated Helper Functions with Dark Mode ---

// Helper function to get Tailwind classes based on mastery
const getMasteryColor = (mastery: string) => {
    // Added dark: variants
    switch(mastery?.toLowerCase()) {
      case 'high':
      case 'mastered':
         return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300 dark:border-green-700/60';
      case 'medium':
         return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300 dark:border-yellow-700/60';
      case 'low':
         return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 dark:from-red-900/40 dark:to-red-800/40 dark:text-red-300 dark:border-red-700/60';
      default:
         return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 dark:text-gray-300 dark:border-gray-600/60';
    }
};

// Helper function to get Tailwind classes based on subject color identifier
const getSubjectColorStyles = (color: string | undefined) => {
    // Added dark: variants for all properties
    const safeColor = color || 'gray';
    switch(safeColor) {
      case 'blue': return {
        light: 'from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50',
        medium: 'from-blue-100 to-blue-200 dark:from-blue-800/60 dark:to-blue-700/60',
        border: 'border-blue-200 dark:border-blue-700/60',
        text: 'text-blue-600 dark:text-blue-400',
        progressBar: 'from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
        selected: 'from-blue-600 to-blue-700 text-white dark:from-blue-500 dark:to-blue-600',
        hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/30', // Added hover background
      };
      case 'green': return {
        light: 'from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50',
        medium: 'from-green-100 to-green-200 dark:from-green-800/60 dark:to-green-700/60',
        border: 'border-green-200 dark:border-green-700/60',
        text: 'text-green-600 dark:text-green-400',
        progressBar: 'from-green-400 to-green-600 dark:from-green-500 dark:to-green-700',
        button: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
        selected: 'from-green-600 to-green-700 text-white dark:from-green-500 dark:to-green-600',
        hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/30',
      };
      case 'yellow': return {
        light: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50',
        medium: 'from-yellow-100 to-yellow-200 dark:from-yellow-800/60 dark:to-yellow-700/60',
        border: 'border-yellow-200 dark:border-yellow-700/60',
        text: 'text-yellow-600 dark:text-yellow-400',
        progressBar: 'from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700',
        button: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
        selected: 'from-yellow-600 to-yellow-700 text-white dark:from-yellow-500 dark:to-yellow-600',
        hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/30',
      };
      default: return { // Gray as default
        light: 'from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50',
        medium: 'from-gray-100 to-gray-200 dark:from-gray-700/60 dark:to-gray-600/60',
        border: 'border-gray-200 dark:border-gray-600/60',
        text: 'text-gray-600 dark:text-gray-400',
        progressBar: 'from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700',
        button: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800',
        selected: 'from-gray-600 to-gray-700 text-white dark:from-gray-500 dark:to-gray-600',
        hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
      };
    }
};


export default function ProgressTab() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get user from AuthContext

  // TODO: Fetch available subjects from API instead of hardcoding
  // This should ideally come from a context or be fetched once
  const availableSubjects = [
      { id: '67f07672dafe64ae5bfe7800', name: 'Physics', color: 'blue' },
      { id: 'SUBJECT_ID_CHEMISTRY', name: 'Chemistry', color: 'green' },
      { id: 'SUBJECT_ID_MATH', name: 'Combined Mathematics', color: 'yellow' },
  ];

  // Set initial active subject and load state
  useEffect(() => {
      if (availableSubjects.length > 0 && !activeSubjectId) {
          setActiveSubjectId(availableSubjects[0].id);
      }
      // Set loaded after a short delay to allow initial render
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
  }, [availableSubjects, activeSubjectId]); // Depend on availableSubjects and activeSubjectId

  // Fetch progress data when activeSubjectId or user changes
  useEffect(() => {
    // Ensure we have both a user ID and an active subject ID
    if (!activeSubjectId || !user?._id) {
        setIsLoading(false); // Not loading if prerequisites aren't met
        setProgressData(null); // Clear data if user logs out or subject changes to null
        if (!user?._id && isLoaded) { // Only set error if page is loaded and user is missing
            setError("Please log in to view progress.");
        } else if (!activeSubjectId && isLoaded) {
             setError("Please select a subject.");
        }
        return;
    };

    const fetchProgressData = async () => {
      setIsLoading(true);
      setError(null);
      setProgressData(null);

      try {
        console.log(`[ProgressTab] Fetching progress for user ${user._id}, subject ${activeSubjectId}`);
        const response = await api.users.getDetailedProgress(user._id, activeSubjectId);
        console.log("[ProgressTab] API Response:", response);

        if (response.data?.status === 'success' && response.data.data) {
            // Basic validation of received data structure
            if (typeof response.data.data.overallProgress === 'number' && Array.isArray(response.data.data.topics)) {
                 setProgressData(response.data.data);
            } else {
                console.error("Invalid progress data structure received:", response.data.data);
                throw new Error('Received invalid progress data format from server.');
            }
        } else {
            throw new Error(response.data?.message || 'Failed to fetch progress data');
        }
      } catch (err: any) {
        console.error("Error fetching progress data:", err);
         if (err.response?.status === 404) {
             setError(`No progress data found for this subject yet. Start learning to see your progress!`);
             setProgressData(null); // Ensure data is null on 404
         } else {
            setError(err.response?.data?.message || err.message || 'An error occurred while fetching progress.');
         }
      } finally {
        setIsLoading(false);
      }
    };

    // --- Development Placeholder Logic ---
    const usePlaceholder = true; // Set to false to enable actual API calls

    if (usePlaceholder) {
        const mockFetch = setTimeout(() => {
            setIsLoading(false);
            setError("Feature under development. Displaying placeholder."); // Set placeholder message
            setProgressData(null); // Ensure no real data is shown with placeholder error
        }, 500);
        return () => clearTimeout(mockFetch);
    } else {
        fetchProgressData(); // Call the actual fetch function
    }
    // --- End Development Placeholder Logic ---


  }, [activeSubjectId, user?._id, isLoaded]); // Re-run effect when activeSubjectId or user ID changes

  // Get color styles for the currently active subject
  const activeSubjectDetails = availableSubjects.find(s => s.id === activeSubjectId);
  const colors = getSubjectColorStyles(activeSubjectDetails?.color);

  return (
    <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>
      {/* Subject Navigation Tabs Card */}
      {/* Added dark: variants for background, border */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
          {/* Header */}
          <div className="flex items-center">
            {/* Icon background remains gradient */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
            </div>
            {/* Added dark: text color */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Detailed Progress</h2>
          </div>

          {/* Subject Selection Tabs */}
          {/* Added dark: variants for buttons */}
          <div className="flex space-x-2 flex-wrap gap-2"> {/* Added flex-wrap and gap */}
            {availableSubjects.map((subject) => {
              const subjectColors = getSubjectColorStyles(subject.color);
              const isActive = activeSubjectId === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubjectId(subject.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    isActive
                      ? `bg-gradient-to-r ${subjectColors.selected} focus:ring-${subject.color}-500 dark:focus:ring-${subject.color}-400` // Active state uses selected gradient
                      : `bg-white dark:bg-gray-700 ${subjectColors.text} ${subjectColors.hoverBg} focus:ring-${subject.color}-500 dark:focus:ring-${subject.color}-400` // Inactive state
                  }`}
                >
                  {subject.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Content Area */}
        <div className="p-6 min-h-[300px]"> {/* Added min-height */}
          {isLoading && (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              {/* Added dark: border color */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 dark:border-purple-400 mb-4"></div>
              {/* Added dark: text color */}
              <p className="text-gray-600 dark:text-gray-400">Loading progress for {activeSubjectDetails?.name || 'subject'}...</p>
            </div>
          )}

          {error && !isLoading && (
             // Added dark: variants for background, border, text
            <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 dark:text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Error Loading Progress</h3>
              <p className="text-red-600 dark:text-red-400 mt-1 px-4">{error}</p>
               {/* Optional: Add a retry button if applicable */}
               {/* <button onClick={fetchProgressData} className="...">Retry</button> */}
            </div>
          )}

          {/* --- Placeholder for Development (Updated with Dark Mode) --- */}
          {!isLoading && error?.includes("Feature under development") && ( // Show only if error contains the specific message
            <div className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg border border-indigo-200 dark:border-indigo-700/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400 dark:text-indigo-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.438 11.944c.083.56.122 1.125.122 1.706 0 5.225-4.275 9.5-9.5 9.5S.562 18.874.562 13.65c0-.58.04-1.146.122-1.706" />
                </svg>
                <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200">Feature Under Development</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mt-2 max-w-md mx-auto">
                    We're working hard on bringing you detailed progress tracking and analytics. Stay tuned for updates!
                </p>
                <Link href="/dashboard" className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition duration-150 ease-in-out">
                    Back to Overview
                </Link>
            </div>
          )}
          {/* --- End Placeholder --- */}


          {/* --- Actual Progress Data Display (Updated with Dark Mode) --- */}
          {!isLoading && !error && progressData && ( // Only show if no loading, no error, and data exists
                <div className="space-y-8">
                {/* Overall Progress Section */}
                {/* Added dark: variants */}
                <div className={`bg-gradient-to-r ${colors.light} rounded-xl p-6 border ${colors.border} shadow-sm`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        {/* Added dark: text */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{progressData.subjectName} Overall Progress</h3>
                        {/* Added dark: text */}
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mastered {progressData.topics.filter(t => t.mastery === 'high' || t.mastery === 'mastered').length} out of {progressData.topics.length} topics
                        </p>
                    </div>
                    <div className="flex items-center">
                        {/* Added dark: bg */}
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                        <span className={`text-2xl font-bold ${colors.text}`}>{progressData.overallProgress}%</span>
                        </div>
                        <Link
                        href={`/subjects/${progressData.subjectId}`}
                        // Added dark: variants for button
                        className={`px-4 py-2 rounded-lg text-sm text-white font-medium shadow-sm ${colors.button} transition-all duration-200 transform hover:scale-105`}
                        >
                        Continue Learning
                        </Link>
                    </div>
                    </div>
                    <div className="mt-6">
                    {/* Added dark: bg for progress bar track */}
                    <div className="w-full h-3 bg-white/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                        // Progress bar uses colors.progressBar which includes dark variants
                        className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full relative`}
                        style={{ width: `${progressData.overallProgress}%`, transition: 'width 1s ease-in-out' }}
                        >
                        {/* Optional pulse effect - consider dark mode visibility */}
                        {/* <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-30 dark:opacity-20 animate-pulse"></div> */}
                        </div>
                    </div>
                    </div>
                </div>

                {/* Topics Progress Section */}
                <div>
                    {/* Added dark: text */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Topic-by-Topic Breakdown</h3>
                    {progressData.topics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {progressData.topics.map((topic) => {
                            const masteryClasses = getMasteryColor(topic.mastery); // Get mastery styles
                            return (
                                <div
                                key={topic.id}
                                // Added dark: variants for background, border, hover
                                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-md dark:hover:border-gray-600 transform hover:-translate-y-1`}
                                >
                                <div className="flex justify-between items-start mb-3">
                                    {/* Added dark: text */}
                                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{topic.name}</h4>
                                    {/* Mastery badge uses getMasteryColor which includes dark variants */}
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${masteryClasses}`}>
                                    {topic.mastery === 'high' || topic.mastery === 'mastered' ? 'High Mastery' : topic.mastery === 'medium' ? 'Medium Mastery' : 'Needs Work'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                    {/* Added dark: text */}
                                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                    {/* Added dark: text */}
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{topic.progress}%</span>
                                    </div>
                                    {/* Added dark: bg for progress track */}
                                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        // Progress bar uses colors.progressBar which includes dark variants
                                        className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full relative`}
                                        style={{ width: `${topic.progress}%`, transition: 'width 1s ease-in-out' }}
                                    >
                                    </div>
                                    </div>
                                </div>

                                <div className="flex justify-end items-center"> {/* Changed justify-between to justify-end */}
                                    <Link
                                    href={`/subjects/${progressData.subjectId}/topics/${topic.id}`} // Link using topic ID
                                    // Link text uses colors.text which includes dark variants
                                    className={`text-sm ${colors.text} hover:underline font-medium flex items-center`}
                                    >
                                    Practice
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </Link>
                                </div>
                                </div>
                            );
                        })}
                        </div>
                    ) : (
                        // Added dark: text
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">No topic progress data available for this subject yet.</div>
                    )}
                </div>

                </div> // Closes space-y-8
            )}

            {/* Handle case where data is null even after loading (e.g., initial state before first fetch or explicit null) */}
            {!isLoading && !error && !progressData && !error?.includes("Feature under development") && (
                 <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                     {activeSubjectId ? `No progress data loaded for ${activeSubjectDetails?.name}.` : 'Select a subject to view progress.'}
                 </div>
            )}

        </div> {/* Closes p-6 */}
      </div> {/* Closes main card */}
    </div> // Closes outer transition div
  );
}