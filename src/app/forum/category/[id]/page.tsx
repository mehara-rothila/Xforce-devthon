"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../../DarkModeContext';
import axios from 'axios';

// --- MODIFICATION START ---
// Define API base URL from environment variable
// It MUST be prefixed with NEXT_PUBLIC_ to be available on the client side
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Optional: Add a check to ensure the variable is set during development/build
if (!API_URL) {
  console.error("FATAL ERROR: NEXT_PUBLIC_API_URL environment variable is not defined.");
  // You could throw an error here to prevent the app from starting without the URL
  // throw new Error("FATAL ERROR: NEXT_PUBLIC_API_URL environment variable is not defined.");
}
// --- MODIFICATION END ---

// Type definitions
interface ForumCategory {
  _id: string;
  name: string;
  description: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  icon?: string;
  topicsCount: number;
  postsCount: number;
}

interface ForumTopic {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: {
    _id: string;
    name: string;
  };
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastReplyAt?: string;
  createdAt: string;
  updatedAt: string;
  isHot?: boolean;
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Get category ID from params
  const categoryId = params.id;
  
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for hover effects
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  
  // State for API data
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for sorting/filtering
  const [sortBy, setSortBy] = useState<string>('latest');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Function to format relative time
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
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-100 dark:border-blue-800'
        };
      case 'Chemistry Corner':
        return {
          color: 'green',
          gradientFrom: 'from-green-400',
          gradientTo: 'to-green-600',
          hoverGradientFrom: 'from-green-500',
          hoverGradientTo: 'to-green-700',
          shadowColor: 'rgba(16, 185, 129, 0.5)',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-100 dark:border-green-800'
        };
      case 'Mathematics Hub':
        return {
          color: 'yellow',
          gradientFrom: 'from-yellow-400',
          gradientTo: 'to-yellow-600',
          hoverGradientFrom: 'from-yellow-500',
          hoverGradientTo: 'to-yellow-700',
          shadowColor: 'rgba(245, 158, 11, 0.5)',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-100 dark:border-yellow-800'
        };
      case 'Study Tips & Tricks':
        return {
          color: 'red',
          gradientFrom: 'from-red-400',
          gradientTo: 'to-red-600',
          hoverGradientFrom: 'from-red-500',
          hoverGradientTo: 'to-red-700',
          shadowColor: 'rgba(220, 38, 38, 0.5)',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-100 dark:border-red-800'
        };
      case 'Exam Preparation':
        return {
          color: 'orange',
          gradientFrom: 'from-orange-400',
          gradientTo: 'to-orange-600',
          hoverGradientFrom: 'from-orange-500',
          hoverGradientTo: 'to-orange-700',
          shadowColor: 'rgba(234, 88, 12, 0.5)',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-100 dark:border-orange-800'
        };
      default:
        return {
          color: 'purple',
          gradientFrom: 'from-purple-400',
          gradientTo: 'to-purple-600',
          hoverGradientFrom: 'from-purple-500',
          hoverGradientTo: 'to-purple-700',
          shadowColor: 'rgba(124, 58, 237, 0.5)',
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-100 dark:border-purple-800'
        };
    }
  };

  // Fetch category and topics data
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch category details
        const categoryResponse = await axios.get(`${API_URL}/forum/categories`);
        
        if (categoryResponse.data.success) {
          // Find the specific category by ID
          const categoryData = categoryResponse.data.data.find((cat: ForumCategory) => cat._id === categoryId);
          
          if (categoryData) {
            // Add styling properties
            const styles = getCategoryStyles(categoryData.name);
            setCategory({
              ...categoryData,
              ...styles
            });
            
            // Fetch topics for this category
            const topicsResponse = await axios.get(`${API_URL}/forum/categories/${categoryId}/topics`);
            
            if (topicsResponse.data.success) {
              // Add isHot property based on views or replies
              const enhancedTopics = topicsResponse.data.data.map((topic: ForumTopic) => ({
                ...topic,
                isHot: topic.views > 100 || topic.repliesCount > 5
              }));
              
              setTopics(enhancedTopics);
            } else {
              setError('Failed to fetch topics');
            }
          } else {
            setError('Category not found');
          }
        } else {
          setError('Failed to fetch category data');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Error connecting to the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [categoryId]);

  // Sort and filter topics
  const getFilteredAndSortedTopics = () => {
    // First apply filter
    let filteredTopics = [...topics];
    
    if (filterType === 'pinned') {
      filteredTopics = filteredTopics.filter(topic => topic.isPinned);
    } else if (filterType === 'hot') {
      filteredTopics = filteredTopics.filter(topic => topic.isHot);
    }
    
    // Then apply sorting
    if (sortBy === 'latest') {
      filteredTopics.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === 'most_viewed') {
      filteredTopics.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'most_replies') {
      filteredTopics.sort((a, b) => b.repliesCount - a.repliesCount);
    }
    
    return filteredTopics;
  };
  
  // Get filtered and sorted topics
  const filteredAndSortedTopics = getFilteredAndSortedTopics();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Category Header */}
      {category && (
        <div className={`relative bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} pt-16 pb-20 overflow-hidden transition-colors duration-300`}>
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>💬</div>
            <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🗣️</div>
            <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>🤝</div>
            <div className="absolute top-[25%] left-[30%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '15s' }}>💡</div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center">
                  <Link
                    href="/forum"
                    className="inline-flex items-center text-white/80 hover:text-white mr-4 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Back to Forums</span>
                  </Link>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    {category.name}
                  </h1>
                </div>
                <p className="mt-2 text-lg text-white/80">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-white/90">
                  <span className="inline-flex items-center mr-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    <span>{category.topicsCount || 0} topics</span>
                  </span>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span>{category.postsCount || 0} posts</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href={`/forum/new?category=${categoryId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Topic
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Show loading state */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading category data...</span>
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

        {!isLoading && !error && category && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
            {/* Topic List Controls */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 transition-colors duration-300 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterType === 'all' 
                      ? `bg-${category.color}-100 text-${category.color}-800 dark:bg-${category.color}-900/30 dark:text-${category.color}-300`
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Topics
                </button>
                <button
                  onClick={() => setFilterType('pinned')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterType === 'pinned' 
                      ? `bg-${category.color}-100 text-${category.color}-800 dark:bg-${category.color}-900/30 dark:text-${category.color}-300`
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Pinned
                </button>
                <button
                  onClick={() => setFilterType('hot')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filterType === 'hot' 
                      ? `bg-${category.color}-100 text-${category.color}-800 dark:bg-${category.color}-900/30 dark:text-${category.color}-300`
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Hot Topics
                </button>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="sort-by" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  Sort by:
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-200"
                >
                  <option value="latest">Latest</option>
                  <option value="most_viewed">Most Viewed</option>
                  <option value="most_replies">Most Replies</option>
                </select>
              </div>
            </div>

            {/* Topics List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredAndSortedTopics.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No topics found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to start a discussion in this category!</p>
                  <Link 
                    href={`/forum/new?category=${categoryId}`}
                    className={`inline-flex items-center px-4 py-2 rounded-lg bg-${category.color}-600 hover:bg-${category.color}-700 text-white transition-colors duration-200`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Topic
                  </Link>
                </div>
              ) : (
                filteredAndSortedTopics.map((topic) => (
                  <div
                    key={topic._id}
                    className={`p-6 transition-all duration-300 ${hoveredTopic === topic._id ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-800'}`}
                    onMouseEnter={() => setHoveredTopic(topic._id)}
                    onMouseLeave={() => setHoveredTopic(null)}
                  >
                    <Link href={`/forum/topic/${topic._id}`} className="block">
                      <div className="flex flex-col lg:flex-row lg:items-center">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            {topic.isPinned && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Pinned
                              </span>
                            )}
                            {topic.isHot && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>
                                Hot
                              </span>
                            )}
                            {topic.isLocked && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Locked
                              </span>
                            )}
                            <h3 className={`text-lg font-semibold transition-colors duration-200 ${hoveredTopic === topic._id ? `text-${category.color}-600 dark:text-${category.color}-400` : 'text-gray-900 dark:text-gray-100'}`}>
                              {topic.title}
                            </h3>
                          </div>
                          
                          <div className="mt-2 flex items-center text-sm">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 overflow-hidden">
                                {topic.author?.name?.charAt(0) || '?'}
                              </div>
                              <span className="ml-1.5 text-gray-600 dark:text-gray-400">{topic.author?.name || 'Unknown'}</span>
                            </div>
                            <span className="mx-2 text-gray-400 dark:text-gray-600">•</span>
                            <span className="text-gray-500 dark:text-gray-400">
                              Started {getRelativeTime(topic.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-6">
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                              hoveredTopic === topic._id ? `bg-${category.color}-100 dark:bg-${category.color}-900/30` : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                hoveredTopic === topic._id ? `text-${category.color}-600 dark:text-${category.color}-400` : 'text-gray-500 dark:text-gray-400'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <span className="ml-1.5">{topic.repliesCount || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                              hoveredTopic === topic._id ? `bg-${category.color}-100 dark:bg-${category.color}-900/30` : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                hoveredTopic === topic._id ? `text-${category.color}-600 dark:text-${category.color}-400` : 'text-gray-500 dark:text-gray-400'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <span className="ml-1.5">{topic.views || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                              hoveredTopic === topic._id ? `bg-${category.color}-100 dark:bg-${category.color}-900/30` : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                hoveredTopic === topic._id ? `text-${category.color}-600 dark:text-${category.color}-400` : 'text-gray-500 dark:text-gray-400'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="ml-1.5">
                              {topic.lastReplyAt 
                                ? getRelativeTime(topic.lastReplyAt) 
                                : getRelativeTime(topic.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}