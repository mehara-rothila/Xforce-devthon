"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../../DarkModeContext';
import api from '@/utils/api'; // <-- Use the shared API utility
import SubjectIcon from '@/components/icons/SubjectIcon'; // <-- Import shared icon component

// Type definitions
interface ForumCategory {
  _id: string;
  name: string;
  description: string;
  color?: string;
  // These style props will be added dynamically by getCategoryStyles
  gradientFrom?: string;
  gradientTo?: string;
  hoverGradientFrom?: string;
  hoverGradientTo?: string;
  shadowColor?: string;
  bg?: string;
  border?: string;
  icon?: string; // Expecting string name from backend
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
  isHot?: boolean; // Calculated client-side
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id;
  const { isDarkMode } = useDarkMode();
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('latest');
  const [filterType, setFilterType] = useState<string>('all');

  // --- Helper Functions ---
  const getRelativeTime = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
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
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "Invalid date";
    }
  };

  // Assigns style classes based on category name
  const getCategoryStyles = (categoryName: string = '') => {
    switch(categoryName?.toLowerCase()) {
      case 'physics discussions': return { color: 'blue', gradientFrom: 'from-blue-400', gradientTo: 'to-blue-600', hoverGradientFrom: 'from-blue-500', hoverGradientTo: 'to-blue-700', shadowColor: 'rgba(59, 130, 246, 0.5)', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' };
      case 'chemistry corner': return { color: 'green', gradientFrom: 'from-green-400', gradientTo: 'to-green-600', hoverGradientFrom: 'from-green-500', hoverGradientTo: 'to-green-700', shadowColor: 'rgba(16, 185, 129, 0.5)', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800' };
      case 'mathematics hub': return { color: 'yellow', gradientFrom: 'from-yellow-400', gradientTo: 'to-yellow-600', hoverGradientFrom: 'from-yellow-500', hoverGradientTo: 'to-yellow-700', shadowColor: 'rgba(245, 158, 11, 0.5)', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-800' };
      case 'study tips & tricks': return { color: 'red', gradientFrom: 'from-red-400', gradientTo: 'to-red-600', hoverGradientFrom: 'from-red-500', hoverGradientTo: 'to-red-700', shadowColor: 'rgba(220, 38, 38, 0.5)', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800' };
      case 'exam preparation': return { color: 'orange', gradientFrom: 'from-orange-400', gradientTo: 'to-orange-600', hoverGradientFrom: 'from-orange-500', hoverGradientTo: 'to-orange-700', shadowColor: 'rgba(234, 88, 12, 0.5)', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800' };
      default: return { color: 'purple', gradientFrom: 'from-purple-400', gradientTo: 'to-purple-600', hoverGradientFrom: 'from-purple-500', hoverGradientTo: 'to-purple-700', shadowColor: 'rgba(124, 58, 237, 0.5)', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800' };
    }
  };

  // Fetch category and topics data using api.js
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      setError(null);
      setCategory(null);
      setTopics([]);

      try {
        // Fetch ALL categories first (still inefficient, consider backend change later)
        const categoryResponse = await api.forum.getCategories();

        // --- FIX: Access categories array correctly ---
        if (categoryResponse.data?.status === 'success' && Array.isArray(categoryResponse.data.data?.categories)) {
            const allCategories = categoryResponse.data.data.categories;
            const categoryData = allCategories.find((cat: ForumCategory) => cat._id === categoryId);
            // --------------------------------------------

            if (categoryData) {
                // Set category state (styles will be applied in JSX)
                setCategory(categoryData); // Store raw category data

                // Fetch topics for this category using api.js
                const topicsResponse = await api.forum.getTopicsByCategory(categoryId, { limit: 100 }); // Fetch more for category page

                // --- FIX: Access topics array correctly ---
                if (topicsResponse.data?.status === 'success' && Array.isArray(topicsResponse.data.data?.topics)) {
                    const fetchedTopics = topicsResponse.data.data.topics;
                    // -----------------------------------------
                    const enhancedTopics = fetchedTopics.map((topic: ForumTopic) => ({
                        ...topic,
                        isHot: (topic.views || 0) > 100 || (topic.repliesCount || 0) > 5 // Example 'hot' logic
                    }));
                    setTopics(enhancedTopics);
                } else {
                    console.error("Failed to fetch topics or invalid format:", topicsResponse.data);
                    setError('Failed to fetch topics for this category.');
                }
            } else {
                setError('Category not found.');
            }
        } else {
            console.error("Failed to fetch categories or invalid format:", categoryResponse.data);
            setError(categoryResponse.data?.message || 'Failed to fetch category data.');
        }
      } catch (err: any) {
        console.error('Error fetching category data:', err);
        setError(err.response?.data?.message || err.message || 'Error connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) { fetchCategoryData(); }
    else { setError("No category ID provided."); setIsLoading(false); }
  }, [categoryId]);

  // Sort and filter topics
  const getFilteredAndSortedTopics = () => {
    let filteredTopics = [...topics];
    if (filterType === 'pinned') { filteredTopics = filteredTopics.filter(topic => topic.isPinned); }
    else if (filterType === 'hot') { filteredTopics = filteredTopics.filter(topic => topic.isHot); }

    if (sortBy === 'latest') { filteredTopics.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()); }
    else if (sortBy === 'most_viewed') { filteredTopics.sort((a, b) => (b.views || 0) - (a.views || 0)); }
    else if (sortBy === 'most_replies') { filteredTopics.sort((a, b) => (b.repliesCount || 0) - (a.repliesCount || 0)); }
    return filteredTopics;
  };

  const filteredAndSortedTopics = getFilteredAndSortedTopics();

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Enhanced background with mathematical/scientific elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" id="category-page-background">
        {/* Mathematical symbols - Randomly placed */}
        <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
        <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
        <div className="absolute top-[61%] left-[27%] text-green-500 dark:text-green-400 text-8xl opacity-75 floating-icon-slow">∞</div>
        <div className="absolute top-[19%] right-[38%] text-red-500 dark:text-red-400 text-11xl opacity-65 floating-icon">⚛</div>
        <div className="absolute top-[77%] right-[23%] text-yellow-500 dark:text-yellow-400 text-9xl opacity-70 floating-icon-slow">𝜙</div>
        <div className="absolute bottom-[31%] left-[8%] text-indigo-500 dark:text-indigo-400 text-10xl opacity-70 floating-icon-reverse">∫</div>
        <div className="absolute bottom-[12%] right-[42%] text-teal-500 dark:text-teal-400 text-9xl opacity-75 floating-icon">≈</div>
        <div className="absolute bottom-[47%] right-[9%] text-pink-500 dark:text-pink-400 text-8xl opacity-65 floating-icon-slow">±</div>

        {/* Additional math symbols */}
        <div className="absolute top-[23%] left-[54%] text-fuchsia-500 dark:text-fuchsia-400 text-8xl opacity-70 floating-icon">Δ</div>
        <div className="absolute top-[44%] left-[38%] text-emerald-500 dark:text-emerald-400 text-7xl opacity-65 floating-icon-slow">λ</div>
        <div className="absolute top-[81%] left-[67%] text-cyan-500 dark:text-cyan-400 text-9xl opacity-70 floating-icon-reverse">θ</div>
        <div className="absolute top-[29%] left-[83%] text-rose-500 dark:text-rose-400 text-8xl opacity-65 floating-icon">α</div>
        <div className="absolute bottom-[63%] left-[6%] text-amber-500 dark:text-amber-400 text-9xl opacity-70 floating-icon-slow">β</div>
        <div className="absolute bottom-[19%] left-[71%] text-purple-500 dark:text-purple-400 text-8xl opacity-65 floating-icon-reverse">μ</div>
        <div className="absolute bottom-[28%] left-[32%] text-blue-500 dark:text-blue-400 text-7xl opacity-70 floating-icon">ω</div>

        {/* Science formulas */}
        <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
        <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
        <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
        <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>
        <div className="absolute bottom-[53%] left-[24%] text-emerald-500 dark:text-emerald-400 text-5xl opacity-65 floating-icon-slow">v=λf</div>
        <div className="absolute top-[86%] left-[11%] text-sky-500 dark:text-sky-400 text-5xl opacity-55 floating-icon-reverse">C₆H₁₂O₆</div>
        <div className="absolute top-[68%] right-[31%] text-amber-500 dark:text-amber-400 text-6xl opacity-60 floating-icon">E=hf</div>

        {/* Science icons */}
        <div className="absolute top-[41%] left-[8%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        <div className="absolute top-[17%] right-[7%] opacity-60 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <div className="absolute bottom-[7%] left-[36%] opacity-60 floating-icon-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Category Header */}
      {category && (
        // --- FIX: Calculate categoryStyle *inside* the block ---
        (() => {
            // Calculate styles based on the fetched category name
            const categoryStyle = getCategoryStyles(category.name);
            return (
                <div className={`relative bg-gradient-to-r ${categoryStyle.gradientFrom} ${categoryStyle.gradientTo} pt-16 pb-20 overflow-hidden transition-colors duration-300 z-10`}>
                    {/* Background elements */}
                    <div className="absolute inset-0 overflow-hidden opacity-20"> <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>💬</div> <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🗣️</div> <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>🤝</div> <div className="absolute top-[25%] left-[30%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '15s' }}>💡</div> </div>
                    {/* Header Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div className="animate-fade-in-up">
                                <div className="flex items-center">
                                    <Link href="/forum" className="inline-flex items-center text-white/80 hover:text-white mr-4 transition-colors duration-200"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /> </svg> <span>Back to Forums</span> </Link>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl text-shadow"> {category.name} </h1>
                                </div>
                                <p className="mt-2 text-lg text-white/80"> {category.description} </p>
                                <div className="mt-4 flex items-center text-white/90"> <span className="inline-flex items-center mr-6"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /> </svg> <span>{category.topicsCount || 0} topics</span> </span> <span className="inline-flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /> <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /> </svg> <span>{category.postsCount || 0} posts</span> </span> </div>
                            </div>
                            <div className="mt-4 sm:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}> 
                              <Link href={`/forum/new?category=${categoryId}`} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-105"> 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> 
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /> 
                                </svg> New Topic 
                              </Link> 
                            </div>
                        </div>
                    </div>
                </div>
            );
        })() // Immediately invoke the function to render the header
        // -------------------------------------------------------
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Loading State */}
        {isLoading && ( <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-8 flex justify-center items-center animate-fade-in"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div><span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading category data...</span></div> )}

        {/* Error State */}
        {error && ( <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8 animate-fade-in"><div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-red-800 dark:text-red-200">{error}</p></div><button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300"> Try Again </button></div> )}

        {!isLoading && !error && category && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30 animate-fade-in">
            {/* Topic List Controls */}
            {(() => {
                const categoryStyle = getCategoryStyles(category.name); // Recalculate or pass down
                return (
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 transition-colors duration-300 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 transform hover:scale-105 ${ filterType === 'all' ? `bg-${categoryStyle.color}-100 text-${categoryStyle.color}-800 dark:bg-${categoryStyle.color}-900/30 dark:text-${categoryStyle.color}-300` : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' }`}> All Topics </button>
                            <button onClick={() => setFilterType('pinned')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 transform hover:scale-105 ${ filterType === 'pinned' ? `bg-${categoryStyle.color}-100 text-${categoryStyle.color}-800 dark:bg-${categoryStyle.color}-900/30 dark:text-${categoryStyle.color}-300` : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' }`}> Pinned </button>
                            <button onClick={() => setFilterType('hot')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 transform hover:scale-105 ${ filterType === 'hot' ? `bg-${categoryStyle.color}-100 text-${categoryStyle.color}-800 dark:bg-${categoryStyle.color}-900/30 dark:text-${categoryStyle.color}-300` : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' }`}> Hot Topics </button>
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="sort-by" className="mr-2 text-sm text-gray-600 dark:text-gray-400"> Sort by: </label>
                            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-200 transition-all duration-200 hover:shadow">
                                <option value="latest">Latest</option> <option value="most_viewed">Most Viewed</option> <option value="most_replies">Most Replies</option>
                            </select>
                        </div>
                    </div>
                );
            })()}


            {/* Topics List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredAndSortedTopics.length === 0 ? (
                 <div className="p-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> </div>
                   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 text-shadow">No topics found</h3>
                   <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to start a discussion in this category!</p>
                   {/* Ensure categoryStyle is available here or recalculate */}
                   {(() => {
                        const categoryStyle = getCategoryStyles(category.name);
                        return (
                           <Link href={`/forum/new?category=${categoryId}`} className={`inline-flex items-center px-4 py-2 rounded-lg bg-${categoryStyle.color}-600 hover:bg-${categoryStyle.color}-700 text-white transition-colors duration-200 shadow hover:shadow-lg transform hover:translate-y-[-2px] active:translate-y-[1px]`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /> </svg> Create New Topic </Link>
                        );
                   })()}
                 </div>
              ) : (
                filteredAndSortedTopics.map((topic, index) => {
                    // Recalculate styles here if needed, or ensure categoryStyle is accessible
                    const topicCategoryStyle = category ? getCategoryStyles(category.name) : getCategoryStyles(''); // Use category state
                    return (
                        <div key={topic._id} 
                             className={`p-6 transition-all duration-300 ${hoveredTopic === topic._id ? 'bg-gray-50/80 dark:bg-gray-700/80' : 'dark:bg-gray-800/80'} animate-fade-in`} 
                             style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                             onMouseEnter={() => setHoveredTopic(topic._id)} 
                             onMouseLeave={() => setHoveredTopic(null)}>
                            <Link href={`/forum/topic/${topic._id}`} className="block group">
                                <div className="flex flex-col lg:flex-row lg:items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2">
                                            {topic.isPinned && ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mr-2 transform hover:scale-105 transition-transform duration-200"> <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /> </svg> Pinned </span> )}
                                            {topic.isHot && ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2 transform hover:scale-105 transition-transform duration-200"> <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /> </svg> Hot </span> )}
                                            {topic.isLocked && ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mr-2 transform hover:scale-105 transition-transform duration-200"> <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> </svg> Locked </span> )}
                                            <h3 className={`text-lg font-semibold transition-colors duration-200 ${hoveredTopic === topic._id ? `text-${topicCategoryStyle.color}-600 dark:text-${topicCategoryStyle.color}-400` : 'text-gray-900 dark:text-gray-100'}`}> {topic.title} </h3>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm">
                                            <div className="flex items-center"> <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 overflow-hidden group-hover:shadow transform group-hover:scale-110 transition-all duration-200"> {topic.author?.name?.charAt(0) || '?'} </div> <span className="ml-1.5 text-gray-600 dark:text-gray-400">{topic.author?.name || 'Unknown'}</span> </div>
                                            <span className="mx-2 text-gray-400 dark:text-gray-600">•</span>
                                            <span className="text-gray-500 dark:text-gray-400"> Started {getRelativeTime(topic.createdAt)} </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 lg:mt-0 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-6">
                                        <div className="flex items-center"> <div className={`p-1.5 rounded-full transition-colors duration-300 ${ hoveredTopic === topic._id ? `bg-${topicCategoryStyle.color}-100 dark:bg-${topicCategoryStyle.color}-900/30` : 'bg-gray-100 dark:bg-gray-700' }`}> <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${ hoveredTopic === topic._id ? `text-${topicCategoryStyle.color}-600 dark:text-${topicCategoryStyle.color}-400` : 'text-gray-500 dark:text-gray-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> </div> <span className="ml-1.5">{topic.repliesCount || 0}</span> </div>
                                        <div className="flex items-center"> <div className={`p-1.5 rounded-full transition-colors duration-300 ${ hoveredTopic === topic._id ? `bg-${topicCategoryStyle.color}-100 dark:bg-${topicCategoryStyle.color}-900/30` : 'bg-gray-100 dark:bg-gray-700' }`}> <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${ hoveredTopic === topic._id ? `text-${topicCategoryStyle.color}-600 dark:text-${topicCategoryStyle.color}-400` : 'text-gray-500 dark:text-gray-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg> </div> <span className="ml-1.5">{topic.views || 0}</span> </div>
                                        <div className="flex items-center"> <div className={`p-1.5 rounded-full transition-colors duration-300 ${ hoveredTopic === topic._id ? `bg-${topicCategoryStyle.color}-100 dark:bg-${topicCategoryStyle.color}-900/30` : 'bg-gray-100 dark:bg-gray-700' }`}> <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${ hoveredTopic === topic._id ? `text-${topicCategoryStyle.color}-600 dark:text-${topicCategoryStyle.color}-400` : 'text-gray-500 dark:text-gray-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> </div> <span className="ml-1.5"> {topic.lastReplyAt ? getRelativeTime(topic.lastReplyAt) : getRelativeTime(topic.createdAt)} </span> </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })
              )}
            </div>
          </div>
        )}
      </div>
       {/* Enhanced Global styles */}
       <style jsx global>{`
         /* Enhanced text sizes for larger symbols */
         .text-10xl { font-size: 9rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }
         .text-11xl { font-size: 10rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }

         /* Enhanced background floating icons animations */
         .floating-icon { 
           animation: float 6s ease-in-out infinite; 
           filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1)); 
         }
         .floating-icon-reverse { 
           animation: float-reverse 7s ease-in-out infinite; 
           filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1)); 
         }
         .floating-icon-slow { 
           animation: float 10s ease-in-out infinite; 
           filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1)); 
         }

         @keyframes float {
           0% { transform: translateY(0) rotate(0deg) scale(1); }
           50% { transform: translateY(-15px) rotate(5deg) scale(1.05); }
           100% { transform: translateY(0) rotate(0deg) scale(1); }
         }

         @keyframes float-reverse {
           0% { transform: translateY(0) rotate(0deg) scale(1); }
           50% { transform: translateY(15px) rotate(-5deg) scale(1.05); }
           100% { transform: translateY(0) rotate(0deg) scale(1); }
         }

         /* Enhanced animations */
         .animate-pulse-slow { 
           animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
         }
         
         @keyframes pulse-slow { 
           0%, 100% { opacity: 1; transform: scale(1); } 
           50% { opacity: 0.7; transform: scale(0.98); } 
         }

         .animate-fade-in { 
           animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
         }
         
         .animate-fade-in-up { 
           animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
           will-change: transform, opacity;
         }

         @keyframes fadeIn { 
           from { opacity: 0; } 
           to { opacity: 1; } 
         }
         
         @keyframes fadeInUp { 
           from { opacity: 0; transform: translateY(30px); } 
           to { opacity: 1; transform: translateY(0); } 
         }

         .animate-widthGrow { 
           animation: widthGrow 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
         }
         
         @keyframes widthGrow { 
           from { width: 0%; } 
           to { /* width is set inline */ } 
         }

         /* Enhanced text styling */
         .text-shadow { 
           text-shadow: 0 2px 4px rgba(0,0,0,0.1); 
         }
         
         .text-shadow-lg { 
           text-shadow: 0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08); 
         }
         
         h1, h2, h3, h4, h5, h6 {
           letter-spacing: -0.025em;
         }
         
         /* Enhanced card styling */
         .backdrop-blur-sm {
           backdrop-filter: blur(8px);
         }
         
         /* Card hover effects */
         .hover\:shadow-2xl:hover {
           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
           transform: translateY(-2px);
           transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
         }
         
         /* Enhanced line clamp */
         .line-clamp-2 { 
           display: -webkit-box; 
           -webkit-line-clamp: 2; 
           -webkit-box-orient: vertical; 
           overflow: hidden; 
         }
         
         /* Enhanced gradient animations */
         .animated-gradient { 
           background-size: 400% 400%; 
           animation: gradient-shift 8s ease infinite; 
         }
         
         @keyframes gradient-shift { 
           0% { background-position: 0% 50%; } 
           50% { background-position: 100% 50%; } 
           100% { background-position: 0% 50%; } 
         }
         
         /* Enhanced border animations */
         .animated-border { 
           position: relative; 
           overflow: hidden; 
         }
         
         .animated-border::after { 
           content: ''; 
           position: absolute; 
           top: 0; 
           left: -100%; 
           width: 100%; 
           height: 100%; 
           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); 
           animation: shine 3s infinite; 
         }
         
         @keyframes shine { 
           0% { left: -100%; } 
           50% { left: 100%; } 
           100% { left: 100%; } 
         }
         
         /* Enhanced button styles */
         button, a.inline-flex {
           transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
         }
         
         button:hover, a.inline-flex:hover {
           transform: translateY(-1px);
         }
         
         button:active, a.inline-flex:active {
           transform: translateY(1px);
         }
         
         /* Enhanced link animations */
         a.group:hover .group-hover\:translate-x-2 {
           transform: translateX(8px);
           transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
         }
         
         /* Enhanced scrollbar */
         ::-webkit-scrollbar {
           width: 10px;
           height: 10px;
         }
         
         ::-webkit-scrollbar-track {
           background: rgba(247, 250, 252, 0.8);
         }
         
         .dark ::-webkit-scrollbar-track {
           background: rgba(26, 32, 44, 0.8);
         }
         
         ::-webkit-scrollbar-thumb {
           background: rgba(113, 128, 150, 0.5);
           border-radius: 5px;
         }
         
         ::-webkit-scrollbar-thumb:hover {
           background: rgba(113, 128, 150, 0.7);
         }
         
         /* Enhanced focus styles */
         *:focus-visible {
           outline: 2px solid #805AD5;
           outline-offset: 2px;
         }
         
         /* Glass morphism effects for cards */
         .bg-white\/90, .dark\:bg-gray-800\/90 {
           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
           backdrop-filter: blur(10px);
           transition: all 0.3s ease;
         }
         
         .dark .bg-white\/90, .dark .dark\:bg-gray-800\/90 {
           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
         }
       `}</style>
    </div>
  );
}
