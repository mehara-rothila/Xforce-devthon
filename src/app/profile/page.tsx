"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '../DarkModeContext';
import api from '../../utils/api'; // Import the API utility

export default function ProfilePage() {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // States for data
  const [user, setUser] = useState(null);
  const [userSubjects, setUserSubjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [stats, setStats] = useState(null);

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
        const subjectsData = subjectsResponse.data.data.subjects;
        
        // For each subject, get progress
        const subjectsWithProgress = await Promise.all(
          subjectsData.map(async (subject) => {
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
        
        // Fetch recent activity (assuming we'll implement this endpoint)
        try {
          const activityResponse = await api.users.getRecentActivity(userData._id);
          setRecentActivity(activityResponse.data.data.activities);
        } catch (error) {
          console.error("Error fetching recent activity:", error);
          // Fallback to mock data for now
          setRecentActivity([
            {
              id: 1,
              type: 'quiz',
              title: 'Completed quiz on Electromagnetism',
              subject: 'Physics',
              details: 'Score: 85%',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            // Add more mock activities if needed
          ]);
        }
        
        // Fetch leaderboard data (assuming we'll implement this endpoint)
        try {
          const leaderboardResponse = await api.users.getLeaderboard();
          setLeaderboardData(leaderboardResponse.data.data.leaderboard);
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
          // Fallback to mock data for now
          setLeaderboardData([
            { id: 1, name: 'Amaya Fernando', points: 3240, rank: 1 },
            { id: 2, name: 'Dilshan Perera', points: 3180, rank: 2 },
            // Add the current user in mock data
            { id: userData._id, name: userData.name, points: userData.points || 2750, rank: 8, isCurrentUser: true }
          ]);
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
  const formatDate = (dateString) => {
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

            {/* Navigation Tabs - Keep as is */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 sm:px-8 transition-colors duration-300">
              <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
                {/* Keep the tab buttons as they are */}
              </nav>
            </div>
          </div>
          
          {/* Tab Content - Update with real data */}
          <div className="p-6 sm:p-8">
            {/* Each tab section will need to be updated with real data */}
            {/* Similar structure, but data will come from state */}
          </div>
        </div>
      </div>
    </div>
  );
}