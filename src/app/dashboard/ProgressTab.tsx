'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../utils/api'; // Import the API service

// Define interfaces for the data structure expected from the backend
interface TopicProgress {
    id: string; // Topic ID
    name: string;
    progress: number;
    mastery: 'low' | 'medium' | 'high' | 'mastered' | string; // Allow string for flexibility
    // testScore?: number | null; // Optional: Add later if needed
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

// Helper function to get Tailwind classes based on mastery
const getMasteryColor = (mastery: string) => {
    switch(mastery?.toLowerCase()) { // Add null check and lower case
      case 'high':
      case 'mastered':
         return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200';
    }
};

// Helper function to get Tailwind classes based on subject color identifier
const getSubjectColorStyles = (color: string | undefined) => {
    // Default to gray if color is undefined
    const safeColor = color || 'gray';
    switch(safeColor) {
      case 'blue': return {
        light: 'from-blue-50 to-blue-100', medium: 'from-blue-100 to-blue-200', border: 'border-blue-200', text: 'text-blue-600', progressBar: 'from-blue-400 to-blue-600', button: 'bg-blue-600 hover:bg-blue-700', selected: 'from-blue-600 to-blue-700 text-white',
      };
      case 'green': return {
        light: 'from-green-50 to-green-100', medium: 'from-green-100 to-green-200', border: 'border-green-200', text: 'text-green-600', progressBar: 'from-green-400 to-green-600', button: 'bg-green-600 hover:bg-green-700', selected: 'from-green-600 to-green-700 text-white',
      };
      case 'yellow': return {
        light: 'from-yellow-50 to-yellow-100', medium: 'from-yellow-100 to-yellow-200', border: 'border-yellow-200', text: 'text-yellow-600', progressBar: 'from-yellow-400 to-yellow-600', button: 'bg-yellow-600 hover:bg-yellow-700', selected: 'from-yellow-600 to-yellow-700 text-white',
      };
      default: return { // Gray as default
        light: 'from-gray-50 to-gray-100', medium: 'from-gray-100 to-gray-200', border: 'border-gray-200', text: 'text-gray-600', progressBar: 'from-gray-400 to-gray-600', button: 'bg-gray-600 hover:bg-gray-700', selected: 'from-gray-600 to-gray-700 text-white',
      };
    }
};


export default function ProgressTab() {
  const [isLoaded, setIsLoaded] = useState(false); // For initial animation
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null); // Store ID, e.g., physics ID
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock subjects list to get IDs and names for tabs - replace with fetched list later
  // TODO: Fetch this list from /api/subjects instead of hardcoding
  const availableSubjects = [
      { id: '67f07672dafe64ae5bfe7800', name: 'Physics', color: 'blue' }, // Example ID - REPLACE with actual IDs
      { id: 'SUBJECT_ID_CHEMISTRY', name: 'Chemistry', color: 'green' }, // Example ID - REPLACE
      { id: 'SUBJECT_ID_MATH', name: 'Combined Mathematics', color: 'yellow' }, // Example ID - REPLACE
  ];

  // Set initial active subject
  useEffect(() => {
      if (availableSubjects.length > 0) {
          setActiveSubjectId(availableSubjects[0].id);
      }
      setIsLoaded(true); // For animation
  }, []); // Run once on mount

  // Fetch progress data when activeSubjectId changes
  useEffect(() => {
    if (!activeSubjectId) {
        // Don't fetch if no subject is selected yet
        setIsLoading(false); // Ensure loading is false if no subject is selected
        return;
    };

    const fetchProgressData = async () => {
      setIsLoading(true);
      setError(null);
      setProgressData(null); // Clear previous data

      try {
        // TEMPORARY: Use hardcoded user ID
        const userId = '67f0acf710387ecd9ba7458a'; // !!! REPLACE LATER !!!

        console.log(`[ProgressTab] Fetching progress for user ${userId}, subject ${activeSubjectId}`);
        const response = await api.users.getDetailedProgress(userId, activeSubjectId);
        console.log("[ProgressTab] API Response:", response);

        if (response.data?.status === 'success') {
            setProgressData(response.data.data);
        } else {
            throw new Error(response.data?.message || 'Failed to fetch progress data');
        }
      } catch (err: any) {
        console.error("Error fetching progress data:", err);
         if (err.response?.status === 404) {
             setError(`No progress data found for this subject yet.`);
         } else {
            setError(err.message || 'An error occurred while fetching progress.');
         }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [activeSubjectId]); // Re-run effect when activeSubjectId changes

  // Get color styles for the currently active subject
  const activeSubjectDetails = availableSubjects.find(s => s.id === activeSubjectId);
  const colors = getSubjectColorStyles(activeSubjectDetails?.color);

  return (
    <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>
      {/* Subject Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center">
            {/* ... Header Icon & Title ... */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Detailed Progress</h2>
          </div>

          {/* Subject Selection Tabs */}
          <div className="flex space-x-2">
            {availableSubjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setActiveSubjectId(subject.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 transform ${
                  activeSubjectId === subject.id
                    ? `bg-gradient-to-r ${getSubjectColorStyles(subject.color).selected}`
                    : `bg-white ${getSubjectColorStyles(subject.color).text} hover:bg-${subject.color}-50` // Note: Tailwind needs full class names, dynamic generation like this might require config or adjustments
                }`}
                // Safer approach for hover background:
                // className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 transform ${
                //   activeSubjectId === subject.id
                //     ? `bg-gradient-to-r ${getSubjectColorStyles(subject.color).selected}`
                //     : `bg-white ${getSubjectColorStyles(subject.color).text} hover:bg-opacity-50 ${getSubjectColorStyles(subject.color).light.replace('from-','bg-')}` // Example using bg-color-50
                // }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Content Area */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading progress for {activeSubjectDetails?.name || 'subject'}...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-semibold text-red-700">Error Loading Progress</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {!isLoading && !error && progressData && (
            <div className="space-y-8">
              {/* Overall Progress Section */}
              <div className={`bg-gradient-to-r ${colors.light} rounded-xl p-6 border ${colors.border}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900">{progressData.subjectName} Overall Progress</h3>
                    <p className="text-gray-600 mt-1">
                      {/* Calculate high mastery count */}
                      Mastered {progressData.topics.filter(t => t.mastery === 'high' || t.mastery === 'mastered').length} out of {progressData.topics.length} topics
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-3 shadow-md">
                      <span className={`text-2xl font-bold ${colors.text}`}>{progressData.overallProgress}%</span>
                    </div>
                    <Link
                      href={`/subjects/${progressData.subjectId}`} // Link to the specific subject page
                      className={`px-4 py-2 rounded-lg text-sm text-white font-medium shadow-sm ${colors.button} transition-all duration-200 transform hover:scale-105`}
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
                 <div className="mt-6">
                  <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full relative`}
                      style={{ width: `${progressData.overallProgress}%`, transition: 'width 1s ease-in-out' }}
                    >
                      <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics Progress Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Topic-by-Topic Breakdown</h3>
                {progressData.topics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {progressData.topics.map((topic) => (
                        <div
                        key={topic.id} // Use topic ID as key
                        className={`bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-md hover:${colors.border} transform hover:-translate-y-1`}
                        >
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-base font-bold text-gray-900">{topic.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getMasteryColor(topic.mastery)}`}>
                            {/* Display more descriptive mastery */}
                            {topic.mastery === 'high' || topic.mastery === 'mastered' ? 'High Mastery' : topic.mastery === 'medium' ? 'Medium Mastery' : 'Needs Work'}
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-700 font-medium">{topic.progress}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full relative`}
                                style={{ width: `${topic.progress}%`, transition: 'width 1s ease-in-out' }}
                            >
                                {/* Optional pulse effect on progress bar */}
                                {/* <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div> */}
                            </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            {/* Optional: Display Test Score if available */}
                            {/* {topic.testScore && (
                                <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${colors.text} mr-1`} viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                <span className="text-sm text-gray-600">Test Score: <span className="font-medium">{topic.testScore}%</span></span>
                                </div>
                            )} */}
                            {/* Ensure spacer if test score isn't shown */}
                            {/* {!topic.testScore && <div></div>} */}
                             <div></div> {/* Spacer */}


                            <Link
                            href={`/subjects/${progressData.subjectId}/${topic.name.toLowerCase().replace(/\s+/g, '-')}`} // Link to specific topic page (adjust slug logic if needed)
                            className={`text-sm ${colors.text} hover:underline font-medium flex items-center`}
                            >
                            Practice
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </Link>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">No topic progress data available for this subject yet.</div>
                )}
              </div>

              {/* --- Analytics Sections Removed For Initial Integration --- */}
              {/* TODO: Add back Learning Analytics, Performance Comparison, Suggested Path later */}
              {/* You will need separate API calls or include this data in the getDetailedProgress response */}

              {/* Example placeholder for where analytics might go */}
               {/* <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Analytics</h3>
                 <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
                   Analytics data (Time Spent, Accuracy, Weak Areas) will be shown here soon.
                 </div>
               </div> */}

            </div> // Closes space-y-8
          )}
        </div> {/* Closes p-6 */}
      </div> {/* Closes main card */}
    </div> // Closes outer transition div
  );
}

