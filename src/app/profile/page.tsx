"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '../DarkModeContext';
import api from '../../utils/api'; // Import the API utility

// Define TypeScript interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  points: number;
  createdAt: string;
}

interface Subject {
  _id: string;
  name: string;
  color?: string;
  topics?: any[];
}

interface SubjectWithProgress {
  id: string;
  name: string;
  color: string;
  progress: number;
  topics: any[];
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  earnedAt?: string;
  // Other achievement properties
}

interface Activity {
  id: string | number;
  type: 'quiz' | 'forum' | 'resource' | 'achievement' | 'level_up' | 'other';
  title: string;
  subject?: string;
  details?: string;
  timestamp: Date | string;
}

interface LeaderboardEntry {
  id: string | number;
  name: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface Stats {
  quizzesCompleted: number;
  forumPosts: number;
  resourcesAccessed: number;
  studyHours: number;
  daysStreak: number;
  rankInClass: string | number;
}

export default function ProfilePage() {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // States for data with proper types
  const [user, setUser] = useState<User | null>(null);
  const [userSubjects, setUserSubjects] = useState<SubjectWithProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get current user profile
        const userResponse = await api.auth.getMe();
        const userData = userResponse.data.data.user;
        setUser(userData);

        // Get dashboard summary for additional user info
        const dashboardResponse = await api.users.getDashboardSummary(userData._id);
        const dashboardData = dashboardResponse.data.data.summary;
        
        // Get user's subjects with progress
        const subjectsResponse = await api.subjects.getAll();
        const subjectsData: Subject[] = subjectsResponse.data.data.subjects;
        
        // For each subject, get progress
        const subjectsWithProgress = await Promise.all(
          subjectsData.map(async (subject: Subject) => {
            try {
              const progressResponse = await api.subjects.getProgress(subject._id);
              const progressData = progressResponse.data.data.progress;
              return {
                id: subject._id,
                name: subject.name,
                color: subject.color || 'gray',
                progress: progressData.overallProgress || 0,
                topics: progressData.topics || []
              };
            } catch (error) {
              console.error(`Error fetching progress for subject ${subject._id}:`, error);
              return {
                id: subject._id,
                name: subject.name,
                color: subject.color || 'gray',
                progress: 0,
                topics: []
              };
            }
          })
        );
        setUserSubjects(subjectsWithProgress);
        
        // Get achievements
        const achievementsResponse = await api.users.getAchievements(userData._id);
        const achievementsData = achievementsResponse.data.data.achievements;
        setAchievements(achievementsData);
        
        // Set stats from dashboard data
        setStats({
          quizzesCompleted: dashboardData.quizStats?.completed || 0,
          forumPosts: dashboardData.forumStats?.posts || 0,
          resourcesAccessed: dashboardData.resourceStats?.accessed || 0,
          studyHours: dashboardData.studyStats?.hours || 0,
          daysStreak: dashboardData.streak || 0,
          rankInClass: dashboardData.rank || '-'
        });
        
        // Fetch recent activity
        try {
          const activityResponse = await api.users.getRecentActivity(userData._id);
          setRecentActivity(activityResponse.data.data.activities);
        } catch (activityError) {
          console.error("Error fetching recent activity:", activityError);
          setRecentActivity([]);
        }
        
        // Fetch leaderboard data
        try {
          const leaderboardResponse = await api.users.getLeaderboard();
          setLeaderboardData(leaderboardResponse.data.data.leaderboard);
        } catch (leaderboardError) {
          console.error("Error fetching leaderboard:", leaderboardError);
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };
  
  // Calculate XP progress percentage
  const xpProgressPercentage = user ? (user.xp / (user.level * 1000 + 1000)) * 100 : 0;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{error}</h2>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">User not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
          <Link
            href="/login"
            className="mt-6 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Header with Animated Background */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 pt-16 pb-32 overflow-hidden transition-colors duration-300">
        {/* Animated Background Elements - keep as is */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {/* Current animated elements can stay */}
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
      </div>
      
      {/* Profile Content */}
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
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                
                {/* XP Bar */}
                <div className="mt-4 max-w-md mx-auto sm:mx-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">Level {user.level}</span>
                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{user.xp}/{user.level * 1000 + 1000} XP</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${xpProgressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {Math.floor((user.level * 1000 + 1000) - user.xp)} XP to Level {user.level + 1}
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
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } transition-colors duration-200`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('progress')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'progress'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } transition-colors duration-200`}
                >
                  Progress
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'achievements'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } transition-colors duration-200`}
                >
                  Achievements
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } transition-colors duration-200`}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quizzes Completed</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.quizzesCompleted}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Forum Posts</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.forumPosts}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resources Accessed</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.resourcesAccessed}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Hours</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.studyHours}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.daysStreak} days</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg p-4 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank in Class</p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.rankInClass}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-80 overflow-y-auto">
                    {recentActivity.length === 0 ? (
                      <div className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
                        No recent activity found.
                      </div>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <div className="sm:flex sm:justify-between sm:items-baseline">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</h4>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:mt-0">
                              {typeof activity.timestamp === 'string' 
                                ? new Date(activity.timestamp).toLocaleDateString()
                                : activity.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          {activity.subject && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {activity.subject} {activity.details && `- ${activity.details}`}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Leaderboard */}
                <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Leaderboard</h3>
                  </div>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-750">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-750 divide-y divide-gray-200 dark:divide-gray-700">
                        {leaderboardData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No leaderboard data available.
                            </td>
                          </tr>
                        ) : (
                          leaderboardData.map((entry) => (
                            <tr key={entry.id} className={entry.isCurrentUser ? "bg-purple-50 dark:bg-purple-900/20" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                                  entry.rank === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : 
                                  entry.rank === 2 ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" : 
                                  entry.rank === 3 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" : 
                                  "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                }`}>
                                  {entry.rank}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {entry.name}
                                {entry.isCurrentUser && (
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    You
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                                {entry.points.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other tab contents can be implemented similarly */}
            {activeTab === 'progress' && (
              <div>
                {/* Progress tab content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Your Learning Progress</h3>
                
                {userSubjects.length === 0 ? (
                  <div className="text-center py-8 bg-white dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No subjects found. Start learning to see your progress!</p>
                    <Link href="/subjects" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Browse Subjects
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userSubjects.map((subject) => (
                      <div key={subject.id} className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                        <div className="px-4 py-4 sm:px-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{subject.name}</h4>
                            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: subject.color, color: 'white' }}>
                              {subject.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                            <div className="h-2.5 rounded-full" style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}></div>
                          </div>
                          
                          {/* Topics */}
                          <div className="mt-4 space-y-3">
                            {subject.topics.length === 0 ? (
                              <p className="text-sm text-gray-500 dark:text-gray-400">No topics available for this subject.</p>
                            ) : (
                              subject.topics.map((topic, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{topic.name}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                      <div
                                        className="h-1.5 rounded-full bg-opacity-80"
                                        style={{ width: `${topic.progress || 0}%`, backgroundColor: subject.color }}
                                      ></div>
                                    </div>
                                  </div>
                                  <span className="ml-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {topic.progress || 0}%
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Your Achievements</h3>
                
                {achievements.length === 0 ? (
                  <div className="text-center py-8 bg-white dark:bg-gray-750 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No achievements earned yet. Keep studying to unlock achievements!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement._id} className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg border border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            {achievement.icon || (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{achievement.title}</h4>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                            {achievement.earnedAt && (
                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Account Settings</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Manage your account preferences and settings.</p>
                
                {/* Account settings would go here */}
                <div className="bg-white dark:bg-gray-750 shadow-sm dark:shadow-gray-900/10 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-700">
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">Profile Information</h4>
                  </div>
                  
                  <div className="px-4 py-5 sm:px-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Settings functionality coming soon...</p>
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