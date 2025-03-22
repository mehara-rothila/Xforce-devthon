"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '../DarkModeContext'; // Import the dark mode context

export default function ProfilePage() {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in a real application, this would come from your authentication/database system
  const user = {
    name: "Kaveesha Piumal",
    email: "kaveesha@example.com",
    joined: "January 2025",
    avatar: "/images/avatar-placeholder.png",
    level: 12,
    xp: 3240,
    xpToNextLevel: 5000,
    points: 2750,
    subjects: [
      { id: "physics", name: "Physics", progress: 68, color: "blue" },
      { id: "chemistry", name: "Chemistry", progress: 42, color: "green" },
      { id: "math", name: "Combined Mathematics", progress: 75, color: "yellow" }
    ],
    badges: [
      { id: 1, name: "Quiz Master", description: "Completed 50 quizzes", icon: "🏆", earned: true },
      { id: 2, name: "Perfect Score", description: "Got 100% on a quiz", icon: "⭐", earned: true },
      { id: 3, name: "Helper", description: "Answered 25 forum questions", icon: "🤝", earned: true },
      { id: 4, name: "Consistent", description: "Studied for 7 days in a row", icon: "📅", earned: true },
      { id: 5, name: "Chemistry Whiz", description: "Mastered all Chemistry topics", icon: "🧪", earned: false },
      { id: 6, name: "Math Genius", description: "Solved 100 math problems", icon: "🔢", earned: false }
    ],
    stats: {
      quizzesCompleted: 78,
      forumPosts: 34,
      resourcesAccessed: 127,
      studyHours: 156,
      daysStreak: 12,
      rankInClass: 8
    }
  };
  
  // Calculate XP progress percentage
  const xpProgressPercentage = (user.xp / user.xpToNextLevel) * 100;return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Header with Animated Background */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 pt-16 pb-32 overflow-hidden transition-colors duration-300">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>a² + b² = c²</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>F = ma</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>Δx·Δp ≥ ℏ/2</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>∫</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>∑</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Student Profile
              </h1>
              <p className="mt-1 text-lg text-purple-100">
                Track your progress and manage your account
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 dark:text-purple-200 dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>{/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
          {/* Profile Header with Avatar */}
          <div className="relative">
            {/* Profile Background Pattern */}
            <div className="absolute inset-0 h-48 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 opacity-70 transition-colors duration-300"></div>
            
            <div className="relative px-6 pt-8 pb-4 sm:px-8 flex flex-col sm:flex-row items-center sm:items-end">
              {/* Avatar with Level Badge */}
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 p-1 shadow-lg transition-colors duration-300">
                  <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden transition-colors duration-300">
                    <span className="text-6xl">👨‍🎓</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 shadow-lg flex items-center justify-center text-sm font-bold text-white border-2 border-white dark:border-gray-800 transition-colors duration-300">
                  {user.level}
                </div>
              </div>
              
              {/* User Info */}
              <div className="text-center sm:text-left sm:flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{user.name}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                  <span>{user.email}</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span>Member since {user.joined}</span>
                </div>
                
                {/* XP Bar */}
                <div className="mt-4 max-w-md mx-auto sm:mx-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">Level {user.level}</span>
                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{user.xp}/{user.xpToNextLevel} XP</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${xpProgressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {Math.floor(user.xpToNextLevel - user.xp)} XP to Level {user.level + 1}
                    </p>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 transition-colors duration-300">Active Now</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Badge */}
              <div className="mt-4 sm:mt-0">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-lg px-4 py-2 text-white shadow-md dark:shadow-gray-900/20 flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                    <path d="M3 8v3c0 1.657 3.134 3 7 3s7-1.343 7-3V8c0 1.657-3.134 3-7 3S3 9.657 3 8z" />
                    <path d="M3 5v3c0 1.657 3.134 3 7 3s7-1.343 7-3V5c0 1.657-3.134 3-7 3S3 6.657 3 5z" />
                  </svg>
                  <span className="font-semibold">{user.points} Points</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 transition-colors duration-300">
              <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } transition-colors duration-200`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'subjects'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } transition-colors duration-200`}
                >
                  Subjects
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'achievements'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } transition-colors duration-200`}
                >
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } transition-colors duration-200`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>
          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Cards */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Your Performance</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{user.stats.quizzesCompleted}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Quizzes</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{user.stats.studyHours}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Study Hours</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{user.stats.forumPosts}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Forum Posts</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{user.stats.resourcesAccessed}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Resources</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{user.stats.daysStreak}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Day Streak</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">#{user.stats.rankInClass}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Class Rank</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Subject Summary */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Subject Progress</h3>
                    <div className="space-y-5">
                      {user.subjects.map((subject) => (
                        <div key={subject.id}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className={`h-4 w-4 rounded-full bg-${subject.color}-500 mr-2`}></div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{subject.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">{subject.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                            <div 
                              className={`h-full bg-${subject.color}-500 dark:bg-${subject.color}-600 rounded-full transition-all duration-500 ease-out`}
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rewards Section */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-purple-700 dark:to-indigo-800 rounded-xl shadow-lg overflow-hidden dark:shadow-lg dark:shadow-gray-900/30 transition-colors duration-300">
                    <div className="px-6 py-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Your Rewards</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-xs text-purple-200 mb-1">Available Points</div>
                          <div className="text-3xl font-bold text-white">{user.points}</div>
                        </div>
                        <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>

                      <Link
                        href="/rewards"
                        className="block w-full py-3 px-4 bg-white dark:bg-gray-100 rounded-lg text-center font-medium text-purple-700 hover:bg-purple-50 dark:hover:bg-gray-200 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
                      >
                        Visit Rewards Store
                      </Link>

                      <div className="mt-6 pt-6 border-t border-purple-500/30">
                        <h4 className="text-sm font-medium text-purple-200 mb-3">Recent Rewards</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-white">
                            <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center mr-3">
                              <span className="text-sm">📚</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Premium Study Guide</div>
                              <div className="text-xs text-purple-200">Physics - 3 days ago</div>
                            </div>
                            <div className="text-xs font-medium text-purple-200">-500 pts</div>
                          </div>
                          <div className="flex items-center text-white">
                            <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center mr-3">
                              <span className="text-sm">🏆</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">Quiz Champion Badge</div>
                              <div className="text-xs text-purple-200">Achievement - 1 week ago</div>
                            </div>
                            <div className="text-xs font-medium text-purple-200">Earned</div>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <button className="text-xs text-purple-200 hover:text-white">View All Rewards</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Upgrade */}
                  <div className="mt-6 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-xl shadow-lg overflow-hidden dark:shadow-lg dark:shadow-gray-900/30 transition-colors duration-300">
                    <div className="px-6 py-6">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <div>
                          <h4 className="text-lg font-bold text-white">Upgrade to Premium</h4>
                          <p className="text-sm text-white/80 mt-1">Unlock advanced features and exclusive content</p>
                        </div>
                      </div>
                      <button className="mt-4 w-full py-2 px-4 bg-white rounded-lg text-center font-medium text-yellow-600 hover:bg-yellow-50 transition-colors shadow-sm transform hover:scale-105 transition-transform duration-300">
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">My Subjects</h3>
                  <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium flex items-center transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Subject
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Physics Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-sm overflow-hidden border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow duration-300 dark:shadow-lg dark:shadow-gray-900/10">
                    <div className="px-6 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white mr-3 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Physics</h4>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 transition-colors duration-300">
                          68% Complete
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="h-2 w-full bg-blue-200 dark:bg-blue-700 rounded-full overflow-hidden transition-colors duration-300">
                          <div className="h-2 bg-blue-500 dark:bg-blue-400 rounded-full transition-colors duration-300" style={{ width: '68%' }}></div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Mechanics</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Waves</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Electromagnetism</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Thermodynamics</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pt-4 pb-6">
                      <Link
                        href="/subjects/physics"
                        className="mt-4 w-full py-2 px-4 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors shadow-sm flex items-center justify-center"
                      >
                        Continue Learning
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Chemistry Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl shadow-sm overflow-hidden border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow duration-300 dark:shadow-lg dark:shadow-gray-900/10">
                    <div className="px-6 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-green-500 dark:bg-green-600 flex items-center justify-center text-white mr-3 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Chemistry</h4>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 transition-colors duration-300">
                          42% Complete
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="h-2 w-full bg-green-200 dark:bg-green-700 rounded-full overflow-hidden transition-colors duration-300">
                          <div className="h-2 bg-green-500 dark:bg-green-400 rounded-full transition-colors duration-300" style={{ width: '42%' }}></div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Organic Chemistry</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Inorganic Chemistry</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Physical Chemistry</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500 dark:text-green-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Analytical Chemistry</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pt-4 pb-6">
                      <Link
                        href="/subjects/chemistry"
                        className="mt-4 w-full py-2 px-4 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg text-center font-medium transition-colors shadow-sm flex items-center justify-center"
                      >
                        Continue Learning
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Math Card */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl shadow-sm overflow-hidden border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow duration-300 dark:shadow-lg dark:shadow-gray-900/10">
                    <div className="px-6 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-yellow-500 dark:bg-yellow-600 flex items-center justify-center text-white mr-3 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Combined Mathematics</h4>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 transition-colors duration-300">
                          75% Complete
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="h-2 w-full bg-yellow-200 dark:bg-yellow-700 rounded-full overflow-hidden transition-colors duration-300">
                          <div className="h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full transition-colors duration-300" style={{ width: '75%' }}></div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500 dark:text-yellow-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Differential Calculus</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500 dark:text-yellow-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Algebra & Functions</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500 dark:text-yellow-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Statistics & Probability</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500 dark:text-yellow-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Mechanics</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pt-4 pb-6">
                      <Link
                        href="/subjects/math"
                        className="mt-4 w-full py-2 px-4 bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg text-center font-medium transition-colors shadow-sm flex items-center justify-center"
                        >
                          Continue Learning
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
  
                  {/* Recent Activity */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Recent Activity</h3>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="px-6 py-4 flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Completed quiz on Electromagnetism</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Physics • Score: 85%</p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">2 days ago</div>
                        </li>
                        <li className="px-6 py-4 flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Viewed study material on Organic Chemistry</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Chemistry • Chapter 4</p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">3 days ago</div>
                        </li>
                        <li className="px-6 py-4 flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-4 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Replied to discussion on Calculus Problem</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Combined Mathematics • Forum</p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">1 week ago</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Badges & Achievements</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    <span className="font-medium text-purple-600 dark:text-purple-400">{user.badges.filter(b => b.earned).length}</span>
                    <span className="mx-1">/</span>
                    <span>{user.badges.length} Earned</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`p-6 rounded-xl border ${
                        badge.earned 
                          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-700 shadow-sm' 
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                      } transition-colors duration-300`}
                    >
                      <div className="flex items-center mb-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${
                          badge.earned 
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        } transition-colors duration-300`}>
                          {badge.icon}
                        </div>
                        <div className="ml-4">
                          <h4 className={`font-semibold ${badge.earned ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-300`}>{badge.name}</h4>
                          <p className={`text-sm ${badge.earned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} transition-colors duration-300`}>{badge.description}</p>
                        </div>
                      </div>
                      {badge.earned ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm transition-colors duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Earned</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400 dark:text-gray-500 italic transition-colors duration-300">Not yet earned</div>
                          <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300">How to earn</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Trophy Case */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Trophy Case</h3>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl shadow-sm overflow-hidden border border-yellow-200 dark:border-yellow-800 p-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">Your Achievements</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Keep learning to unlock more trophies</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-700/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg></div>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-yellow-100 dark:border-yellow-800/30 transition-colors duration-300">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Quiz Champion</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-yellow-100 dark:border-yellow-800/30 transition-colors duration-300">
                        <div className="text-2xl mb-2">⭐</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Perfect Score</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-yellow-100 dark:border-yellow-800/30 transition-colors duration-300">
                        <div className="text-2xl mb-2">🤝</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Helper</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-yellow-100 dark:border-yellow-800/30 transition-colors duration-300">
                        <div className="text-2xl mb-2">📅</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Consistent</div>
                      </div>
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center border border-dashed border-yellow-200 dark:border-yellow-800/30 transition-colors duration-300">
                        <div className="text-2xl mb-2 text-gray-300 dark:text-gray-600 transition-colors duration-300">❓</div>
                        <div className="text-xs font-medium text-gray-400 dark:text-gray-500 transition-colors duration-300">Coming Soon</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Leaderboard Preview */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Class Leaderboard</h3>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Top Students</h4>
                        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-300">View Full Leaderboard</button>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                      <li className="px-4 py-3 flex items-center bg-yellow-50 dark:bg-yellow-800/10 transition-colors duration-300">
                        <div className="w-8 text-center font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">#1</div>
                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mx-3 transition-colors duration-300">
                          <span className="text-sm">👩‍🎓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Amaya Fernando</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">3240 points</p>
                        </div>
                        <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs font-medium text-yellow-800 dark:text-yellow-400 transition-colors duration-300">1st</div>
                      </li>
                      <li className="px-4 py-3 flex items-center bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
                        <div className="w-8 text-center font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">#2</div>
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-3 transition-colors duration-300">
                          <span className="text-sm">👨‍🎓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Dilshan Perera</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">3180 points</p>
                        </div>
                        <div className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs font-medium text-gray-800 dark:text-gray-300 transition-colors duration-300">2nd</div>
                      </li>
                      <li className="px-4 py-3 flex items-center transition-colors duration-300">
                        <div className="w-8 text-center font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">#8</div>
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-3 transition-colors duration-300">
                          <span className="text-sm">👨‍🎓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Kaveesha Piumal</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">2750 points</p>
                        </div>
                        <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs font-medium text-purple-800 dark:text-purple-400 transition-colors duration-300">You</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">Account Settings</h3>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                  {/* Personal Information */}
                  <div className="p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Personal Information</h4>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={user.name}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 transition-colors duration-300"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={user.email}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 transition-colors duration-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          id="bio"
                          rows={3}
                          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 transition-colors duration-300"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Password */}
                  <div className="p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Password</h4>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 transition-colors duration-300"
                            placeholder="••••••••"
                          />
                        </div>
                        <div></div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 transition-colors duration-300"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 transition-colors duration-300"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Notifications */}
                  <div className="p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notification-quiz"
                            name="notification-quiz"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 transition-colors duration-300"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notification-quiz" className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">New Quizzes Available</label>
                          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Receive email when new quizzes are added for your subjects</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                      <div className="flex items-center h-5">
                          <input
                            id="notification-forum"
                            name="notification-forum"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 transition-colors duration-300"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notification-forum" className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Forum Activity</label>
                          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Receive email when someone replies to your posts or mentions you</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notification-resources"
                            name="notification-resources"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 transition-colors duration-300"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notification-resources" className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">New Resources</label>
                          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Receive email when new study materials are uploaded</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notification-achievements"
                            name="notification-achievements"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 transition-colors duration-300"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notification-achievements" className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Achievement Updates</label>
                          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Receive email when you earn new badges or achievements</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme */}
                  <div className="p-6">
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Theme Options</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="h-12 w-12 bg-purple-500 rounded-full border-2 border-purple-200 dark:border-purple-700 shadow-sm flex items-center justify-center transition-colors duration-300" title="Purple (Default)">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="h-12 w-12 bg-blue-500 rounded-full border-2 border-white dark:border-gray-700 shadow-sm transition-colors duration-300" title="Blue"></button>
                      <button className="h-12 w-12 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 shadow-sm transition-colors duration-300" title="Green"></button>
                      <button className="h-12 w-12 bg-red-500 rounded-full border-2 border-white dark:border-gray-700 shadow-sm transition-colors duration-300" title="Red"></button>
                      <button className="h-12 w-12 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-700 shadow-sm transition-colors duration-300" title="Yellow"></button>
                      <button className="h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-white dark:border-gray-700 shadow-sm transition-colors duration-300" title="Gradient"></button>
                      <div className="flex items-center ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Theme customization coming soon!</div>
                    </div>
                  </div>
                  
                  {/* Subscription */}
                  <div className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 text-white transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-medium">Current Plan: Free</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                        Limited Access
                      </span>
                    </div>
                    <p className="text-purple-100 text-sm mb-4">Upgrade to Premium for AI-personalized learning paths, exclusive resources, and advanced analytics.</p>
                    <div className="mt-1 pt-1 border-t border-purple-400">
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-purple-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm text-white">AI-powered study recommendations</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-purple-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm text-white">Unlimited access to premium resources</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-purple-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm text-white">Advanced analytics and insights</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-300"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}