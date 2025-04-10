// src/app/quiz/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDarkMode } from '@/app/DarkModeContext'; // <-- Adjust path if needed
import api from '@/utils/api'; // Import API utility
import { useAuth } from '@/app/context/AuthContext'; // <-- Adjust path if needed

// --- Interfaces ---
interface QuizSubject {
  _id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface Quiz {
  _id: string;
  title: string;
  subject: QuizSubject;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number; // Assuming this comes from backend virtual or is calculated
  timeLimit: number;
  attempts: number;
  rating: number;
  createdAt?: string;
  // Include questions array if needed by Quiz Card, otherwise keep lean
   questions?: { _id: string }[]; // Minimal questions if needed for length calculation fallback
}

interface SubjectFilter {
  _id: string;
  name: string;
  color?: string;
}

interface DynamicUserStats {
    completed: number;
    accuracy: number; // This is avgScore from backend
    points: number;   // This is total points from backend
}

// --- Mock Data (Replace or remove as needed) ---
const recentAchievements = [
  { id: 1, title: "Quiz Master", description: "Completed 20+ quizzes", icon: "🏆" },
  { id: 2, title: "Quick Thinker", description: "Complete quiz 50% faster than average", icon: "⚡️" },
  { id: 3, title: "Sharpshooter", description: "90%+ accuracy on 5 consecutive quizzes", icon: "🎯" },
];

const subjectMastery = [
  { id: 'physics', name: 'Physics', progress: 72, color: 'blue' },
  { id: 'chemistry', name: 'Chemistry', progress: 68, color: 'green' },
  { id: 'math', name: 'Combined Math', progress: 85, color: 'yellow' },
];


export default function Quizzes() {
  // --- State ---
  const [activeSubjectId, setActiveSubjectId] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectFilter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading for quizzes list
  const [error, setError] = useState<string | null>(null); // Error for quizzes list
  const [animateIn, setAnimateIn] = useState<boolean>(false);

  // State for Dynamic User Stats
  const [dynamicStats, setDynamicStats] = useState<DynamicUserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true); // Start loading
  const [statsError, setStatsError] = useState<string | null>(null);

  const { isDarkMode } = useDarkMode();
  // Get isLoading state from useAuth, rename to avoid conflict with quiz loading state
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Animation on mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // --- Effects ---
  // Fetch available subjects for filter buttons
  useEffect(() => {
    const fetchSubjects = async () => {
       try {
         const response = await api.subjects.getAll(); // Fetch only active subjects by default
         const fetchedSubjects = response.data?.data?.subjects || [];
         if (Array.isArray(fetchedSubjects)) {
           setAvailableSubjects(fetchedSubjects.map(s => ({ _id: s._id, name: s.name, color: s.color })));
         }
       } catch (err) {
         console.error("Failed to fetch subjects for filtering:", err);
       }
    };
    fetchSubjects();
  }, []);

  // Fetch quizzes whenever filters or sort order change
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = { isPublished: 'true' }; // Default to published for user view
        if (activeSubjectId !== 'all') params.subject = activeSubjectId;
        if (activeDifficulty !== 'all') params.difficulty = activeDifficulty;

        switch (sortBy) {
            case 'popular': params.sort = '-attempts'; break;
            case 'newest': params.sort = '-createdAt'; break;
            case 'rating': params.sort = '-rating'; break;
            case 'easy-to-hard': params.sort = 'difficulty'; break; // Mongoose sorts 'easy', 'hard', 'medium' correctly? Check if custom sort needed
            case 'hard-to-easy': params.sort = '-difficulty'; break;
            default: params.sort = '-attempts';
        }
        // Add pagination parameters if needed later
        // params.page = currentPage.toString();
        // params.limit = '12'; // Example limit

        const response = await api.quizzes.getAll(params);
        const fetchedQuizzes = response.data?.data?.quizzes || [];
        if (Array.isArray(fetchedQuizzes)) {
          // Map backend quiz data to frontend Quiz interface
          setQuizzes(fetchedQuizzes.map(q => ({
              ...q,
              subject: q.subject || { _id: 'unknown', name: 'Unknown' }, // Handle potential missing subject population
              totalQuestions: q.totalQuestions || q.questions?.length || 0 // Ensure totalQuestions exists
          })));
        } else {
          console.error("Fetched quizzes data is not an array:", fetchedQuizzes);
          setError("Received invalid data format for quizzes.");
          setQuizzes([]);
        }
      } catch (err: any) {
        console.error("Error fetching quizzes:", err);
        setError(`Failed to load quizzes: ${err.message || 'Unknown error'}`);
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [activeSubjectId, activeDifficulty, sortBy]); // Add pagination state (currentPage) here if implemented

  // *** UPDATED Effect to fetch dynamic user stats ***
  useEffect(() => {
    const fetchUserStats = async () => {
      // --- Check if auth is still loading ---
      if (isAuthLoading) {
         console.log("[QuizPage Stats] Waiting for auth to load...");
         setStatsLoading(true); // Keep loading state true while auth loads
         return; // Don't fetch yet
      }

      // --- Now check authentication status ---
      if (isAuthenticated && user?._id) {
        console.log(`[QuizPage Stats] Auth loaded. Fetching stats for user: ${user._id}`);
        setStatsLoading(true); // Set loading true for the API call
        setStatsError(null);
        try {
          const response = await api.users.getDashboardSummary(user._id);
          const summaryData = response.data?.data?.summary;
          console.log("[QuizPage Stats] API response:", summaryData);

          if (summaryData) {
            const completed = summaryData.quizStats?.completed ?? 0;
            const avgScore = summaryData.quizStats?.avgScore ?? 0; // Backend sends avgScore
            const points = summaryData.points ?? 0; // Total points from user doc

            console.log(`[QuizPage Stats] Setting state: completed=${completed}, accuracy=${avgScore}, points=${points}`);
            setDynamicStats({
              completed: completed,
              accuracy: avgScore, // Map backend's avgScore to frontend's accuracy
              points: points,
            });
          } else {
            console.error("[QuizPage Stats] Summary data missing in API response");
            throw new Error("Summary data not found in API response");
          }
        } catch (err: any) {
          console.error("[QuizPage Stats] Error fetching user stats:", err);
          setStatsError(`Failed to load stats: ${err.response?.data?.message || err.message || 'Unknown error'}`);
          setDynamicStats(null);
        } finally {
          setStatsLoading(false); // API call finished
        }
      } else {
          // --- Auth loaded, but user is not authenticated ---
          console.log("[QuizPage Stats] Auth loaded. User not authenticated.");
          setStatsLoading(false); // Not loading stats
          setDynamicStats(null);  // No stats to show
          setStatsError(null);    // No error, just not logged in
      }
    };

    fetchUserStats();
  // --- Add isAuthLoading to dependency array ---
  }, [user, isAuthenticated, isAuthLoading]); // Re-run when auth state changes

  // --- Event Handlers ---
  const handleSubjectFilter = (subjectId: string) => setActiveSubjectId(subjectId);
  const handleDifficultyFilter = (difficulty: string) => setActiveDifficulty(difficulty);
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value);

  // --- Helper Functions for Styling ---
  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-green-100 text-green-800 border border-green-200';
      case 'medium': return isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'hard': return isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-red-100 text-red-800 border border-red-200';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSubjectClass = (subject: QuizSubject | undefined | null): string => {
    if (!subject) return isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-200'; // Default

    switch (subject.name?.toLowerCase()) {
      case 'physics': return isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'chemistry': return isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-800 border border-green-200';
      case 'combined math': return isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default: return isDarkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-800' : 'bg-purple-100 text-purple-800 border border-purple-200';
    }
  };

    const getActiveSubjectClass = (subjectName: string | undefined | null): string => {
    switch (subjectName?.toLowerCase()) {
      case 'physics': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md';
      case 'chemistry': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md';
      case 'combined math': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md';
      default: return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'; // Default active style for 'All'
    }
  };

    const getInactiveSubjectClass = (subjectName: string | undefined | null): string => {
      const baseStyle = isDarkMode ? 'text-gray-300 hover:bg-gray-600 border border-gray-600/50 bg-gray-700/50' : 'text-gray-700 hover:bg-gray-200 border border-gray-200 bg-gray-100/50';
      switch (subjectName?.toLowerCase()) {
        case 'physics': return isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 border border-blue-800/50' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100';
        case 'chemistry': return isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-800/50 border border-green-800/50' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100';
        case 'combined math': return isDarkMode ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-800/50 border border-yellow-800/50' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100';
        default: return baseStyle;
      }
  };

    const getMasteryColor = (subjectName: string | undefined | null): string => {
    switch (subjectName?.toLowerCase()) {
      case 'physics': return 'bg-blue-600';
      case 'chemistry': return 'bg-green-600';
      case 'combined math': return 'bg-yellow-600';
      default: return 'bg-purple-600';
    }
  };


  // --- JSX ---
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} transition-colors duration-300 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* ... many floating icons/symbols ... */}
         <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
         <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
         {/* ... etc ... */}
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-16 pb-32 overflow-hidden">
         <div className="absolute inset-0 overflow-hidden opacity-20">
             {/* ... header icons ... */}
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="sm:flex sm:items-center sm:justify-between">
                 <div className="animate-fade-in-up">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Practice Quizzes</h1>
                    <p className="mt-2 text-lg text-purple-100">Test your knowledge, track your progress, and earn rewards</p>
                 </div>
                 <div className="mt-4 sm:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" /></svg>
                       Dashboard
                    </Link>
                 </div>
             </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12 relative z-10">

        {/* Filters Card */}
        <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-100'} rounded-2xl shadow-xl overflow-hidden mb-8 transition-colors duration-300 border backdrop-blur-sm transform -translate-y-16 animate-fade-in`}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Subject Filters */}
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Filter by Subject</h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleSubjectFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeSubjectId === 'all' ? getActiveSubjectClass(null) : getInactiveSubjectClass(null)}`}>
                    All Subjects
                  </button>
                  {availableSubjects.map((subject) => (
                    <button key={subject._id} onClick={() => handleSubjectFilter(subject._id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeSubjectId === subject._id ? getActiveSubjectClass(subject.name) : getInactiveSubjectClass(subject.name)}`}>
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filters */}
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Filter by Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                   {['all', 'easy', 'medium', 'hard'].map((diff) => {
                     const isActive = activeDifficulty === diff;
                     // ... logic to determine active/inactive class based on diff ... (refer previous code)
                      let activeClass = '';
                      let inactiveClass = isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                      let label = diff.charAt(0).toUpperCase() + diff.slice(1);

                      if (diff === 'all') {
                          activeClass = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'; label = 'All Levels';
                      } else if (diff === 'easy') {
                          activeClass = 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'; inactiveClass = isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-800/50 border border-green-800/50' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100';
                      } else if (diff === 'medium') {
                          activeClass = 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'; inactiveClass = isDarkMode ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-800/50 border border-yellow-800/50' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100';
                      } else if (diff === 'hard') {
                           activeClass = 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'; inactiveClass = isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-800/50 border border-red-800/50' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100';
                      }

                     return (
                       <button key={diff} onClick={() => handleDifficultyFilter(diff)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${ isActive ? activeClass : inactiveClass }`}>
                         {label}
                       </button>
                     );
                   })}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex-shrink-0">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Sort By</h3>
                <select value={sortBy} onChange={handleSortChange} className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} appearance-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${isDarkMode ? '9ca3af' : '6b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}>
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="easy-to-hard">Difficulty (Easy→Hard)</option>
                  <option value="hard-to-easy">Difficulty (Hard→Easy)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State for Quizzes */}
        {isLoading && (
          <div className="text-center py-10 animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading quizzes...</p>
          </div>
        )}

        {/* Error State for Quizzes */}
        {!isLoading && error && (
          <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg animate-fade-in">
            <div className="text-red-500 text-3xl mb-3">⚠️</div>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* No Quizzes Found State */}
        {!isLoading && !error && quizzes.length === 0 && (
          <div className="text-center py-10 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-lg animate-fade-in">
            <div className="text-yellow-500 text-3xl mb-3">🤔</div>
            <p className="text-yellow-700 dark:text-yellow-300">No quizzes found matching your criteria. Try adjusting the filters!</p>
          </div>
        )}

        {/* Quiz Cards Grid */}
        {!isLoading && !error && quizzes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {quizzes.map((quiz, index) => (
              <div
                key={quiz._id}
                className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700 hover:border-purple-800' : 'bg-white/90 border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getSubjectClass(quiz.subject)} transition-colors duration-300`}>
                      {quiz.subject?.name || 'Unknown'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getDifficultyClass(quiz.difficulty)} transition-colors duration-300`}>
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </span>
                  </div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3 transition-colors duration-300 line-clamp-2 h-14`}>{quiz.title}</h3>
                  <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 transition-colors duration-300`}>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {quiz.totalQuestions} questions
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {quiz.timeLimit} min
                    </span>
                  </div>
                   <div className={`flex flex-col sm:flex-row sm:items-center justify-between text-sm ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-100'} mb-6 pt-3 border-t transition-colors duration-300`}>
                    <div className="flex items-center mb-2 sm:mb-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                     {quiz.attempts} attempts
                    </div>
                    <div className="flex items-center">
                       <div className="flex">
                           {[...Array(5)].map((_, i) => (
                               <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.round(quiz.rating || 0) ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                               </svg>
                           ))}
                       </div>
                       <span className="ml-1">{quiz.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                   </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/quiz/take?id=${quiz._id}`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md transform hover:scale-105 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Start Quiz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Quiz Section (Optional, keep if needed) */}
        {/* ... */}

        {/* Stats and Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>

          {/* === Your Stats Card (with updated logic) === */}
          <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700 hover:border-purple-800' : 'bg-white/90 border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Your Stats
            </h3>
            <div className="space-y-4">
              {/* Loading State */}
              {statsLoading ? (
                 <div className="flex justify-center items-center h-24">
                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                 </div>
              /* Error State */
              ) : statsError ? (
                  <div className="text-center text-red-600 dark:text-red-400 text-sm p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                     {statsError}
                  </div>
              /* Data Loaded State */
              ) : dynamicStats ? (
                <>
                  {/* Quizzes Completed */}
                  <div>
                    <div className={`flex justify-between items-center mb-1`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Quizzes Completed</span>
                      <span className="text-sm font-semibold text-purple-700">{dynamicStats.completed}</span>
                    </div>
                    <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300 overflow-hidden`}>
                      <div className="h-2 bg-purple-600 rounded-full" style={{ width: `${Math.min(100, (dynamicStats.completed / 50) * 100)}%` }}></div> {/* Example Goal: 50 */}
                    </div>
                  </div>
                  {/* Accuracy Rate */}
                  <div>
                    <div className={`flex justify-between items-center mb-1`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Accuracy Rate</span>
                      <span className="text-sm font-semibold text-purple-700">{dynamicStats.accuracy}%</span>
                    </div>
                    <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300 overflow-hidden`}>
                      <div className="h-2 bg-purple-600 rounded-full" style={{ width: `${dynamicStats.accuracy}%` }}></div>
                    </div>
                  </div>
                  {/* Points Earned (Total Points) */}
                  <div>
                    <div className={`flex justify-between items-center mb-1`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Points Earned</span>
                      <span className="text-sm font-semibold text-purple-700">{dynamicStats.points}</span>
                    </div>
                    <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300 overflow-hidden`}>
                      <div className="h-2 bg-purple-600 rounded-full" style={{ width: `${Math.min(100, (dynamicStats.points / 2000) * 100)}%` }}></div> {/* Example Goal: 2000 */}
                    </div>
                  </div>
                </>
              /* Not Logged In State */
              ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm p-4 bg-gray-50 dark:bg-gray-700/30 rounded border border-gray-200 dark:border-gray-600">
                     <Link href="/login" className="text-purple-600 hover:underline font-medium">Log in</Link> to view your stats.
                  </div>
              )}
            </div>
          </div>
          {/* === END Your Stats Card === */}

          {/* Recent Achievements Card (Replace mock data with API call if needed) */}
           <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700 hover:border-purple-800' : 'bg-white/90 border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                 Recent Achievements
              </h3>
              <div className="space-y-4">
                 {recentAchievements.map((ach) => ( /* Using Mock Data */
                   <div key={ach.id} className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl">{ach.icon}</div>
                      <div className="ml-3">
                         <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{ach.title}</h4>
                         <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{ach.description}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

          {/* Subject Mastery Card (Replace mock data with API call if needed) */}
           <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700 hover:border-purple-800' : 'bg-white/90 border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
               <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Subject Mastery
               </h3>
               <div className="space-y-4">
                  {subjectMastery.map((sub) => ( /* Using Mock Data */
                     <div key={sub.id}>
                         <div className={`flex justify-between items-center mb-1`}>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>{sub.name}</span>
                            <span className={`text-sm font-semibold ${getMasteryColor(sub.name).replace('bg-', 'text-').replace('-600', isDarkMode? '-400': '-700')}`}>{sub.progress}%</span>
                         </div>
                         <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                            <div className={`h-2 ${getMasteryColor(sub.name)} rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                         </div>
                     </div>
                  ))}
               </div>
           </div>
        </div> {/* End Stats Grid */}
      </div> {/* End Main Content Area */}

      {/* Global styles */}
       <style jsx global>{`
         .text-10xl { font-size: 9rem; line-height: 1; }
         .text-11xl { font-size: 10rem; line-height: 1; }
         .floating-icon { animation: float 6s ease-in-out infinite; }
         .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
         .floating-icon-slow { animation: float 10s ease-in-out infinite; }
         @keyframes float { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0) rotate(0deg); } }
         @keyframes float-reverse { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-5deg); } 100% { transform: translateY(0) rotate(0deg); } }
         .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
         @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.5; } }
         .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
         .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
         .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
       `}</style>
    </div> // End Page Container
  );
}