"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../DarkModeContext'; // Import the dark mode context
import axios from 'axios';

// Define API base URL
const API_URL = 'http://localhost:5000/api';

// Type definitions for API data
interface ForumCategory {
  _id: string;
  name: string;
  description: string;
  topicsCount: number;
  postsCount: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  hoverGradientFrom?: string;
  hoverGradientTo?: string;
  shadowColor?: string;
  icon?: React.ReactNode;
  createdAt: string;
  updatedAt: string;
}

interface ForumTopic {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
    color?: string;
  };
  author: {
    _id: string;
    name: string;
  };
  repliesCount: number;
  views: number;
  lastReplyAt?: string;
  createdAt: string;
  isHot?: boolean;
}

export default function Forum() {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for hover effects
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredDiscussion, setHoveredDiscussion] = useState<string | null>(null);
  
  // State for API data
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [recentDiscussions, setRecentDiscussions] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    topics: 0,
    posts: 0,
    members: 0,
    online: 0
  });

  // Function to format relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  };

  // Get category icon based on name
  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName) {
      case 'Physics Discussions':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Chemistry Corner':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Mathematics Hub':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };

  // Get category styles based on name
  const getCategoryStyles = (categoryName: string) => {
    switch(categoryName) {
      case 'Physics Discussions':
        return {
          color: 'blue',
          gradientFrom: 'from-blue-400',
          gradientTo: 'to-blue-600',
          hoverGradientFrom: 'from-blue-500',
          hoverGradientTo: 'to-blue-700',
          shadowColor: 'rgba(59, 130, 246, 0.5)',
          badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        };
      case 'Chemistry Corner':
        return {
          color: 'green',
          gradientFrom: 'from-green-400',
          gradientTo: 'to-green-600',
          hoverGradientFrom: 'from-green-500',
          hoverGradientTo: 'to-green-700',
          shadowColor: 'rgba(16, 185, 129, 0.5)',
          badgeBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
      case 'Mathematics Hub':
        return {
          color: 'yellow',
          gradientFrom: 'from-yellow-400',
          gradientTo: 'to-yellow-600',
          hoverGradientFrom: 'from-yellow-500',
          hoverGradientTo: 'to-yellow-700',
          shadowColor: 'rgba(245, 158, 11, 0.5)',
          badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        };
      case 'Study Tips & Tricks':
        return {
          color: 'red',
          gradientFrom: 'from-red-400',
          gradientTo: 'to-red-600',
          hoverGradientFrom: 'from-red-500',
          hoverGradientTo: 'to-red-700',
          shadowColor: 'rgba(220, 38, 38, 0.5)',
          badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
      case 'Exam Preparation':
        return {
          color: 'orange',
          gradientFrom: 'from-orange-400',
          gradientTo: 'to-orange-600',
          hoverGradientFrom: 'from-orange-500',
          hoverGradientTo: 'to-orange-700',
          shadowColor: 'rgba(234, 88, 12, 0.5)',
          badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
        };
      default:
        return {
          color: 'purple',
          gradientFrom: 'from-purple-400',
          gradientTo: 'to-purple-600',
          hoverGradientFrom: 'from-purple-500',
          hoverGradientTo: 'to-purple-700',
          shadowColor: 'rgba(124, 58, 237, 0.5)',
          badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        };
    }
  };

  // Fetch forum data from API
  useEffect(() => {
    const fetchForumData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch categories
        const categoryResponse = await axios.get(`${API_URL}/forum/categories`);
        
        if (categoryResponse.data.success) {
          // Enhance the categories with UI styling properties
          const enhancedCategories = categoryResponse.data.data.map((category: ForumCategory) => {
            const styles = getCategoryStyles(category.name);
            return {
              ...category,
              ...styles,
              icon: getCategoryIcon(category.name)
            };
          });
          
          setCategories(enhancedCategories);
          
          // Calculate total stats
          let totalTopics = 0;
          let totalPosts = 0;
          
          categoryResponse.data.data.forEach((cat: ForumCategory) => {
            totalTopics += cat.topicsCount || 0;
            totalPosts += cat.postsCount || 0;
          });
          
          setStats({
            topics: totalTopics,
            posts: totalPosts,
            members: 2845, // Mock data for now
            online: 127    // Mock data for now
          });
          
          // Fetch recent topics from all categories
          const promises = categoryResponse.data.data.map((category: ForumCategory) => 
            axios.get(`${API_URL}/forum/categories/${category._id}/topics`)
          );
          
          const topicResponses = await Promise.all(promises);
          
          // Combine and sort topics from all categories
          let allTopics: ForumTopic[] = [];
          
          topicResponses.forEach((response, index) => {
            if (response.data.success) {
              // Add category info to each topic
              const topicsWithCategory = response.data.data.map((topic: any) => ({
                ...topic,
                category: {
                  _id: categoryResponse.data.data[index]._id,
                  name: categoryResponse.data.data[index].name,
                  color: getCategoryStyles(categoryResponse.data.data[index].name).color
                },
                // Add isHot property based on views or replies
                isHot: topic.views > 200 || topic.repliesCount > 10
              }));
              
              allTopics = [...allTopics, ...topicsWithCategory];
            }
          });
          
          // Sort by most recent
          allTopics.sort((a, b) => {
            const dateA = a.lastReplyAt ? new Date(a.lastReplyAt) : new Date(a.createdAt);
            const dateB = b.lastReplyAt ? new Date(b.lastReplyAt) : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          
          // Take only the 5 most recent topics
          setRecentDiscussions(allTopics.slice(0, 5));
        } else {
          setError('Failed to fetch forum data');
        }
      } catch (err) {
        console.error('Error fetching forum data:', err);
        setError('Error connecting to the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchForumData();
  }, []);

  // Add a subtle parallax effect to the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageBackground = document.getElementById('forum-page-background');
      if (pageBackground) {
        pageBackground.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 pt-16 pb-32 overflow-hidden transition-colors duration-300">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>💬</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🗣️</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>🤝</div>
          <div className="absolute top-[25%] left-[30%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '15s' }}>💡</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '14s' }}>📚</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Discussion Forum
              </h1>
              <p className="mt-2 text-lg text-purple-100">
                Connect with peers, ask questions, and collaborate on topics
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
      {/* End Hero Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12">
        {/* Show loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading forum data...</span>
          </div>
        )}

        {/* Show error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Forum Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Forum Categories</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {categories.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No categories found
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category._id}
                        className={`p-6 transition-all duration-300 ${hoveredCategory === category._id ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-800'}`}
                        onMouseEnter={() => setHoveredCategory(category._id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <Link href={`/forum/category/${category._id}`} className="block">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-5">
                              <div
                                className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 transform ${hoveredCategory === category._id ? 'scale-110' : ''} bg-gradient-to-br ${hoveredCategory === category._id ? category.hoverGradientFrom + ' ' + category.hoverGradientTo : category.gradientFrom + ' ' + category.gradientTo}`}
                                style={{ boxShadow: hoveredCategory === category._id ? `0 10px 15px -3px ${category.shadowColor}` : 'none' }}
                              >
                                {category.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-lg font-semibold transition-colors duration-200 ${hoveredCategory === category._id ? `text-${category.color}-600 dark:text-${category.color}-400` : 'text-gray-900 dark:text-gray-100'}`}>
                                {category.name}
                              </h3>
                              <p className="mt-1 text-gray-600 dark:text-gray-400">{category.description}</p>
                              <div className="mt-3 flex items-center text-sm">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full mr-3 font-medium">{category.topicsCount || 0} topics</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">{category.postsCount || 0} posts</span>
                              </div>
                            </div>
                            <div className={`ml-4 transition-transform duration-300 ${hoveredCategory === category._id ? 'transform translate-x-2' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ${hoveredCategory === category._id ? `bg-${category.color}-100 text-${category.color}-600 dark:bg-${category.color}-900/30 dark:text-${category.color}-400` : 'text-gray-400 dark:text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Discussions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Discussions</h2>
                  <Link
                    href="/forum/new"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>New Topic</span>
                  </Link>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentDiscussions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No discussions found
                    </div>
                  ) : (
                    recentDiscussions.map((discussion) => {
                      const categoryStyle = getCategoryStyles(discussion.category.name);
                      return (
                        <div
                          key={discussion._id}
                          className={`p-6 transition-all duration-300 ${hoveredDiscussion === discussion._id ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-800'}`}
                          onMouseEnter={() => setHoveredDiscussion(discussion._id)}
                          onMouseLeave={() => setHoveredDiscussion(null)}
                        >
                          <Link href={`/forum/topic/${discussion._id}`} className="block">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  {discussion.isHot && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                      </svg>
                                      Hot
                                    </span>
                                  )}
                                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {discussion.title}
                                  </h3>
                                </div>
                                <div className="mt-2 flex items-center text-sm">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.badgeBg}`}>
                                    {discussion.category.name}
                                  </span>
                                  <div className="ml-3 flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 overflow-hidden">
                                      {discussion.author?.name?.charAt(0) || '?'}
                                    </div>
                                    <span className="ml-1.5 text-gray-600 dark:text-gray-400">{discussion.author?.name || 'Unknown'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 sm:mt-0 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                <div className="flex items-center">
                                  <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                                    hoveredDiscussion === discussion._id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                      hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                  </div>
                                  <span className="ml-1.5">{discussion.repliesCount || 0}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                                    hoveredDiscussion === discussion._id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                      hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </div>
                                  <span className="ml-1.5">{discussion.views || 0}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                                    hoveredDiscussion === discussion._id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                      hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <span className="ml-1.5">
                                    {discussion.lastReplyAt 
                                      ? getRelativeTime(discussion.lastReplyAt) 
                                      : getRelativeTime(discussion.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 text-center bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 transition-colors duration-300">
                  <Link href="/forum/all" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200 group">
                    <span>View all discussions</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-8">
              {/* Search Forums */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Search Forums</h2>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search topics..."
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.slice(0, 4).map(category => (
                      <button 
                        key={category._id}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        #{category.name.split(' ')[0].toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Community Stats</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Topics</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.topics}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-widthGrow" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Posts</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.posts}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full animate-widthGrow" style={{ width: '85%', animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Members</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.members}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full animate-widthGrow" style={{ width: '65%', animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Online Now</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.online}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full animate-widthGrow" style={{ width: '45%', animationDelay: '0.6s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forum Guidelines */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Forum Guidelines</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {[
                      "Be respectful and helpful to fellow students",
                      "Post in the relevant category for better responses",
                      "Include relevant details in your questions",
                      "Use proper formatting for equations and formulas",
                      "Earn points by providing helpful answers"
                    ].map((guideline, index) => (
                      <li key={index} className="flex items-start group">
                        <div className="p-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-3 flex-shrink-0 mt-0.5 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      href="/forum/guidelines"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200 group"
                    >
                      <span>Read full guidelines</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Contributors</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "Ashan S.", points: 4250, badge: "Expert" },
                      { name: "Nethmi J.", points: 3780, badge: "Mentor" },
                      { name: "Kavisha M.", points: 3120, badge: "Guru" },
                    ].map((contributor, index) => (
                      <div key={index} className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {contributor.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{contributor.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{contributor.points} points</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200">
                          {contributor.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                    <Link
                      href="/forum/leaderboard"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200 group"
                    >
                      <span>View leaderboard</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}