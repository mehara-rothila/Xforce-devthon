"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDarkMode } from '@/app/DarkModeContext'; // Added Dark Mode context import

// Define the Quiz interface to properly type our data
interface Quiz {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  questions: number;
  duration: string;
  attempts: number;
  rating: number;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'Mechanics - Forces and Motion',
    subject: 'Physics',
    difficulty: 'Medium',
    questions: 20,
    duration: '30 min',
    attempts: 256,
    rating: 4.7,
  },
  {
    id: 2,
    title: 'Organic Chemistry Basics',
    subject: 'Chemistry',
    difficulty: 'Hard',
    questions: 15,
    duration: '25 min',
    attempts: 189,
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Differential Calculus',
    subject: 'Combined Math',
    difficulty: 'Hard',
    questions: 18,
    duration: '35 min',
    attempts: 312,
    rating: 4.8,
  },
  {
    id: 4,
    title: 'Waves and Oscillations',
    subject: 'Physics',
    difficulty: 'Medium',
    questions: 15,
    duration: '25 min',
    attempts: 205,
    rating: 4.6,
  },
  {
    id: 5,
    title: 'Inorganic Chemistry',
    subject: 'Chemistry',
    difficulty: 'Medium',
    questions: 22,
    duration: '40 min',
    attempts: 178,
    rating: 4.4,
  },
  {
    id: 6,
    title: 'Statistics and Probability',
    subject: 'Combined Math',
    difficulty: 'Easy',
    questions: 20,
    duration: '30 min',
    attempts: 287,
    rating: 4.6,
  },
];

export default function Quizzes() {
  const [activeSubject, setActiveSubject] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  
  // Get dark mode context
  const { isDarkMode } = useDarkMode();

  // Filter quizzes based on selected subject and difficulty
  const filteredQuizzes = quizzes.filter((quiz: Quiz) => {
    const matchesSubject = activeSubject === 'all' || quiz.subject.toLowerCase().replace(' ', '-') === activeSubject;
    const matchesDifficulty = activeDifficulty === 'all' || quiz.difficulty.toLowerCase() === activeDifficulty;
    return matchesSubject && matchesDifficulty;
  });

  // Sort quizzes based on selected sort option
  const sortedQuizzes = [...filteredQuizzes].sort((a: Quiz, b: Quiz) => {
    switch (sortBy) {
      case 'popular':
        return b.attempts - a.attempts;
      case 'newest':
        return b.id - a.id; // Using ID as a proxy for newness in this demo
      case 'rating':
        return b.rating - a.rating;
      case 'easy-to-hard':
        const difficultyOrder: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'hard-to-easy':
        const difficultyOrderReverse: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrderReverse[b.difficulty] - difficultyOrderReverse[a.difficulty];
      default:
        return b.attempts - a.attempts;
    }
  });

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
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden mb-8 transition-colors duration-300`}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Subject Filters */}
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Filter by Subject</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveSubject('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSubject === 'all'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Subjects
                  </button>
                  <button 
                    onClick={() => setActiveSubject('physics')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSubject === 'physics'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/50 border border-blue-800/50'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
                    }`}
                  >
                    Physics
                  </button>
                  <button 
                    onClick={() => setActiveSubject('chemistry')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSubject === 'chemistry'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-green-900/30 text-green-400 hover:bg-green-800/50 border border-green-800/50'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                    }`}
                  >
                    Chemistry
                  </button>
                  <button 
                    onClick={() => setActiveSubject('combined-math')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSubject === 'combined-math'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-800/50 border border-yellow-800/50'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-100'
                    }`}
                  >
                    Combined Math
                  </button>
                </div>
              </div>

              {/* Difficulty Filters */}
              <div>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 transition-colors duration-300`}>Filter by Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveDifficulty('all')}
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
                    onClick={() => setActiveDifficulty('easy')}
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
                    onClick={() => setActiveDifficulty('medium')}
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
                    onClick={() => setActiveDifficulty('hard')}
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
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer`}
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

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedQuizzes.map((quiz: Quiz) => (
            <div 
              key={quiz.id} 
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-800' : 'bg-white border-gray-100 hover:border-purple-200'} rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    quiz.subject === 'Physics'
                      ? isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      : quiz.subject === 'Chemistry'
                      ? isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-800 border border-green-200'
                      : isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  } transition-colors duration-300`}>
                    {quiz.subject}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    quiz.difficulty === 'Easy'
                      ? isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-800 border border-green-200'
                      : quiz.difficulty === 'Medium'
                      ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-800 border border-red-200'
                  } transition-colors duration-300`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3 transition-colors duration-300`}>{quiz.title}</h3>
                <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 transition-colors duration-300`}>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.questions} questions
                  </span>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.duration}
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
                    <span className="ml-1">{quiz.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/quiz/${quiz.id}`} 
                    className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 flex items-center"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link 
                    href={`/quiz/take?id=${quiz.id.toString()}`}
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

        {/* Featured Quiz */}
        {sortedQuizzes.length > 0 && (
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
                  <span className="text-sm font-semibold text-purple-700">24</span>
                </div>
                <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
              <div>
                <div className={`flex justify-between items-center mb-1`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Accuracy Rate</span>
                  <span className="text-sm font-semibold text-purple-700">76%</span>
                </div>
                <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className={`flex justify-between items-center mb-1`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Points Earned</span>
                  <span className="text-sm font-semibold text-purple-700">1,240</span>
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
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  🏆
                </div>
                <div className="ml-3">
                <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>Quiz Master</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Completed 20+ quizzes</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  ⚡️
                </div>
                <div className="ml-3">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>Quick Thinker</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>Complete quiz 50% faster than average</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  🎯
                </div>
                <div className="ml-3">
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-300`}>Sharpshooter</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>90%+ accuracy on 5 consecutive quizzes</p>
                </div>
              </div>
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
              <div>
                <div className={`flex justify-between items-center mb-1`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Physics</span>
                  <span className="text-sm font-semibold text-blue-700">72%</span>
                </div>
                <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className={`flex justify-between items-center mb-1`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Chemistry</span>
                  <span className="text-sm font-semibold text-green-700">68%</span>
                </div>
                <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                  <div className="h-2 bg-green-600 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className={`flex justify-between items-center mb-1`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Combined Math</span>
                  <span className="text-sm font-semibold text-yellow-700">85%</span>
                </div>
                <div className={`h-2 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden transition-colors duration-300`}>
                  <div className="h-2 bg-yellow-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}