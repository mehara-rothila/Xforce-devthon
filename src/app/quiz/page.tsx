"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDarkMode } from '@/app/DarkModeContext';
import api from '@/utils/api'; // Import API utility

// --- Interfaces ---
// Represents the populated subject data within a quiz object
interface QuizSubject {
  _id: string;
  name: string;
  color?: string; // Optional based on population
  icon?: string;  // Optional based on population
}

// Represents a Quiz object fetched from the backend
interface Quiz {
  _id: string; // MongoDB ObjectId as string
  title: string;
  subject: QuizSubject; // Populated subject data
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number; // Virtual property from backend model
  timeLimit: number; // Time limit in minutes
  attempts: number;
  rating: number;
  createdAt?: string; // Optional: If needed for sorting by newest
  // Add other fields if needed from backend, e.g., description
}

// Interface for Subject filter buttons
interface SubjectFilter {
  _id: string;
  name: string;
  color?: string;
}

// Mock data for hardcoded sections (can be replaced with API calls later)
const userStats = {
  quizzesCompleted: 24,
  accuracyRate: 76,
  pointsEarned: 1240,
};

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isDarkMode } = useDarkMode(); // Get dark mode state

  // --- Effects ---
  // Fetch available subjects for filter buttons
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.subjects.getAll();
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
        // Prepare API Query Params
        const params: Record<string, string> = {};

        if (activeSubjectId !== 'all') {
          params.subject = activeSubjectId;
        }

        if (activeDifficulty !== 'all') {
          params.difficulty = activeDifficulty;
        }

        // Map frontend sort option to backend API sort parameter
        switch (sortBy) {
          case 'popular':
            params.sort = '-attempts';
            break;
          case 'newest':
            params.sort = '-createdAt';
            break;
          case 'rating':
            params.sort = '-rating';
            break;
          case 'easy-to-hard':
            params.sort = 'difficulty';
            break;
          case 'hard-to-easy':
            params.sort = '-difficulty';
            break;
          default:
            params.sort = '-attempts';
        }

        // Make API Call
        const response = await api.quizzes.getAll(params);

        const fetchedQuizzes = response.data?.data?.quizzes || [];
        if (Array.isArray(fetchedQuizzes)) {
          setQuizzes(fetchedQuizzes);
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
  }, [activeSubjectId, activeDifficulty, sortBy]);

  // --- Event Handlers ---
  const handleSubjectFilter = (subjectId: string) => {
    setActiveSubjectId(subjectId);
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setActiveDifficulty(difficulty);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  // --- Helper Functions for Styling ---
  // Gets classes for difficulty badges
  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-green-100 text-green-800 border border-green-200';
      case 'medium': return isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'hard': return isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-red-100 text-red-800 border border-red-200';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Gets classes for subject tags
  const getSubjectClass = (subject: QuizSubject): string => {
    if (!subject) return '';
    
    switch (subject.name?.toLowerCase()) {
      case 'physics': return isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'chemistry': return isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-800 border border-green-200';
      case 'combined math': return isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default: return isDarkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-800' : 'bg-purple-100 text-purple-800 border border-purple-200';
    }
  };

  // Gets classes for active subject buttons
  const getActiveSubjectClass = (subjectName: string): string => {
    switch (subjectName?.toLowerCase()) {
      case 'physics': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md';
      case 'chemistry': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md';
      case 'combined math': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md';
      default: return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md';
    }
  };

  // Gets classes for inactive subject buttons
  const getInactiveSubjectClass = (subjectName: string): string => {
    switch (subjectName?.toLowerCase()) {
      case 'physics': return isDarkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 border border-blue-800/50' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100';
      case 'chemistry': return isDarkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-800/50 border border-green-800/50' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100';
      case 'combined math': return isDarkMode ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-800/50 border border-yellow-800/50' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  // Helper for mastery progress bar colors
  const getMasteryColor = (subjectName: string): string => {
    switch (subjectName?.toLowerCase()) {
      case 'physics': return 'bg-blue-600';
      case 'chemistry': return 'bg-green-600';
      case 'combined math': return 'bg-yellow-600';
      default: return 'bg-purple-600';
    }
  };

  // --- JSX ---
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} transition-colors duration-300`}>
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-16 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>❓</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🧠</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>📝</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>🏆</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>💯</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Practice Quizzes
              </h1>
              <p className="mt-2 text-lg text-purple-100">
                Test your knowledge, track your progress, and earn rewards
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12">        
        
        {/* Filters Card */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden mb-8 transition-colors duration-300 border`}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Subject Filters */}
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Filter by Subject</h3>
                <div className="flex flex-wrap gap-2">
                  {/* All Subjects Button */}
                  <button 
                    onClick={() => handleSubjectFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSubjectId === 'all'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Subjects
                  </button>
                  
                  {/* Dynamic Subject Buttons */}
                  {availableSubjects.map((subject) => (
                    <button 
                      key={subject._id}
                      onClick={() => handleSubjectFilter(subject._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSubjectId === subject._id
                          ? getActiveSubjectClass(subject.name)
                          : getInactiveSubjectClass(subject.name)
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filters */}
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Filter by Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleDifficultyFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeDifficulty === 'all'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Levels
                  </button>
                  <button 
                    onClick={() => handleDifficultyFilter('easy')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeDifficulty === 'easy'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-800/50 border border-green-800/50'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                    }`}
                  >
                    Easy
                  </button>
                  <button 
                    onClick={() => handleDifficultyFilter('medium')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeDifficulty === 'medium'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-800/50 border border-yellow-800/50'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100'
                    }`}
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => handleDifficultyFilter('hard')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeDifficulty === 'hard'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-800/50 border border-red-800/50'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex-shrink-0">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Sort By</h3>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${isDarkMode ? '9ca3af' : '6b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="easy-to-hard">Difficulty (Easy to Hard)</option>
                  <option value="hard-to-easy">Difficulty (Hard to Easy)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading quizzes...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg">
            <div className="text-red-500 text-3xl mb-3">⚠️</div>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* No Quizzes Found State */}
        {!isLoading && !error && quizzes.length === 0 && (
          <div className="text-center py-10 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-lg">
            <div className="text-yellow-500 text-3xl mb-3">🤔</div>
            <p className="text-yellow-700 dark:text-yellow-300">No quizzes found matching your criteria. Try adjusting the filters or add more quizzes to the database!</p>
          </div>
        )}

        {/* Quiz Cards */}
        {!isLoading && !error && quizzes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {quizzes.map((quiz) => (
              <div 
                key={quiz._id} 
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-800' : 'bg-white border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.totalQuestions} questions
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.timeLimit} min
                    </span>
                  </div>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between text-sm ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-100'} mb-6 pt-3 border-t transition-colors duration-300`}>
                    <div className="flex items-center mb-2 sm:mb-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {quiz.attempts} attempts
                    </div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${i < Math.floor(quiz.rating) ? 'text-yellow-400' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1">{quiz.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/quiz/${quiz._id}`} 
                      className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 flex items-center"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link 
                      href={`/quiz/take?id=${quiz._id}`}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md transform hover:scale-105 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Quiz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Quiz */}
        {!isLoading && !error && quizzes.length > 0 && (
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl overflow-hidden mb-12 transform transition-transform duration-300 hover:scale-[1.01]">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1 mb-6 md:mb-0 md:mr-8">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white mb-4">
                    Featured Quiz
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Challenge Yourself!</h3>
                  <p className="text-purple-100 mb-6">Take our most popular quizzes to test your knowledge and earn extra points. Complete quizzes on different subjects to increase your mastery level.</p>
                  <div className="flex space-x-4">
                    <button className="px-5 py-2.5 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-200 shadow-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Weekly Challenge
                    </button>
                    <button className="px-5 py-2.5 bg-purple-700/30 text-white rounded-lg font-medium hover:bg-purple-700/40 transition-colors duration-200 shadow-lg border border-white/20 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Quiz
                    </button>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-40 h-40 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center p-6">
                    <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center p-6">
                      <div className="w-full h-full bg-white/30 rounded-full flex items-center justify-center text-white text-5xl">
                        🧠
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats and Progress */}
        {!isLoading && !error && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-800' : 'bg-white border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Your Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className={`flex justify-between items-center mb-1`}>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Quizzes Completed</span>
                    <span className="text-sm font-semibold text-purple-700">{userStats.quizzesCompleted}</span>
                  </div>
                  <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                <div>
                  <div className={`flex justify-between items-center mb-1`}>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Accuracy Rate</span>
                    <span className="text-sm font-semibold text-purple-700">{userStats.accuracyRate}%</span>
                  </div>
                  <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className={`flex justify-between items-center mb-1`}>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Points Earned</span>
                    <span className="text-sm font-semibold text-purple-700">{userStats.pointsEarned}</span>
                  </div>
                  <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-800' : 'bg-white border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Recent Achievements
              </h3>
              <div className="space-y-4">
                {recentAchievements.map((ach) => (
                  <div key={ach.id} className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      {ach.icon}
                    </div>
                    <div className="ml-3">
                      <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>{ach.title}</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-800' : 'bg-white border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 flex items-center transition-colors duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Subject Mastery
              </h3>
              <div className="space-y-4">
                {subjectMastery.map((sub) => (
                  <div key={sub.id}>
                    <div className={`flex justify-between items-center mb-1`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>{sub.name}</span>
                      <span className="text-sm font-semibold text-blue-700">{sub.progress}%</span>
                    </div>
                    <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                      <div className={`h-2 ${getMasteryColor(sub.name)} rounded-full`} style={{ width: `${sub.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}