"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../DarkModeContext';
import api from '@/utils/api';
import SubjectIcon from '@/components/icons/SubjectIcon'; // <-- IMPORT ADDED HERE

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
  hoverGradientFrom?: string; // Added by getCategoryStyles
  hoverGradientTo?: string;   // Added by getCategoryStyles
  shadowColor?: string;       // Added by getCategoryStyles
  icon?: string | React.ReactNode; // Allow string from DB or ReactNode after processing
  createdAt: string;
  updatedAt: string;
}

interface ForumTopic {
  _id: string;
  title: string;
  category: { // Assuming category is populated in recent topics fetch
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
  isHot?: boolean; // Calculated client-side for now
}

export default function Forum() {
  const { isDarkMode } = useDarkMode();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredDiscussion, setHoveredDiscussion] = useState<string | null>(null);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [recentDiscussions, setRecentDiscussions] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ topics: 0, posts: 0, members: 0, online: 0 });

  // --- Helper Functions ---
  const getRelativeTime = (dateString: string) => {
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

  // Fallback icon generator (if category.icon is not set)
  const getCategoryIconFallback = (categoryName: string) => {
    switch(categoryName?.toLowerCase()) {
      case 'physics discussions':
        return ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /> </svg> );
      case 'chemistry corner':
        return ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /> </svg> );
      case 'mathematics hub':
        return ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> </svg> );
      default:
        return ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> );
    }
  };

  const getCategoryStyles = (categoryName: string) => {
    switch(categoryName?.toLowerCase()) {
      case 'physics discussions': return { color: 'blue', gradientFrom: 'from-blue-400', gradientTo: 'to-blue-600', hoverGradientFrom: 'from-blue-500', hoverGradientTo: 'to-blue-700', shadowColor: 'rgba(59, 130, 246, 0.5)', badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'chemistry corner': return { color: 'green', gradientFrom: 'from-green-400', gradientTo: 'to-green-600', hoverGradientFrom: 'from-green-500', hoverGradientTo: 'to-green-700', shadowColor: 'rgba(16, 185, 129, 0.5)', badgeBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case 'mathematics hub': return { color: 'yellow', gradientFrom: 'from-yellow-400', gradientTo: 'to-yellow-600', hoverGradientFrom: 'from-yellow-500', hoverGradientTo: 'to-yellow-700', shadowColor: 'rgba(245, 158, 11, 0.5)', badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
      case 'study tips & tricks': return { color: 'red', gradientFrom: 'from-red-400', gradientTo: 'to-red-600', hoverGradientFrom: 'from-red-500', hoverGradientTo: 'to-red-700', shadowColor: 'rgba(220, 38, 38, 0.5)', badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      case 'exam preparation': return { color: 'orange', gradientFrom: 'from-orange-400', gradientTo: 'to-orange-600', hoverGradientFrom: 'from-orange-500', hoverGradientTo: 'to-orange-700', shadowColor: 'rgba(234, 88, 12, 0.5)', badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' };
      default: return { color: 'purple', gradientFrom: 'from-purple-400', gradientTo: 'to-purple-600', hoverGradientFrom: 'from-purple-500', hoverGradientTo: 'to-purple-700', shadowColor: 'rgba(124, 58, 237, 0.5)', badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' };
    }
  };

  // Fetch forum data using api.js utility
  useEffect(() => {
    const fetchForumData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const categoryResponse = await api.forum.getCategories();
        if (categoryResponse.data?.status === 'success' && Array.isArray(categoryResponse.data.data?.categories)) {
            const fetchedCategories = categoryResponse.data.data.categories;
            const enhancedCategories = fetchedCategories.map((category: ForumCategory) => {
                const styles = getCategoryStyles(category.name);
                // Use SubjectIcon component for the icon, passing the name from the DB
                const iconNode = <SubjectIcon iconName={typeof category.icon === 'string' ? category.icon : 'book'} color="#ffffff" className="h-8 w-8"/>;
                return { ...category, ...styles, icon: iconNode }; // Store the rendered node
            });
            setCategories(enhancedCategories);

            let totalTopics = 0;
            let totalPosts = 0;
            fetchedCategories.forEach((cat: ForumCategory) => {
                totalTopics += cat.topicsCount || 0;
                totalPosts += cat.postsCount || 0;
            });
            // Mock stats for now, replace with actual data if available
            setStats({ topics: totalTopics, posts: totalPosts, members: 2845, online: 127 });

            // Fetch recent topics
            const topicPromises = fetchedCategories.map((category: ForumCategory) =>
                api.forum.getTopicsByCategory(category._id, { limit: 5, sort: '-lastReplyAt -createdAt' })
            );
            const topicResponses = await Promise.allSettled(topicPromises);
            let allTopics: ForumTopic[] = [];
            topicResponses.forEach((response, index) => {
                if (response.status === 'fulfilled' && response.value.data?.status === 'success' && Array.isArray(response.value.data?.data?.topics)) {
                    const categoryData = fetchedCategories[index];
                    const topicsWithCategory = response.value.data.data.topics.map((topic: any) => ({
                        ...topic,
                        category: { _id: categoryData._id, name: categoryData.name, color: getCategoryStyles(categoryData.name).color },
                        isHot: (topic.views || 0) > 100 || (topic.repliesCount || 0) > 5
                    }));
                    allTopics = [...allTopics, ...topicsWithCategory];
                } else if (response.status === 'rejected') { console.error(`Failed to fetch topics for category ${fetchedCategories[index]._id}:`, response.reason); }
                else { console.warn(`Unexpected response structure when fetching topics for category ${fetchedCategories[index]._id}:`, response.value.data); }
            });
            allTopics.sort((a, b) => {
                const dateA = a.lastReplyAt ? new Date(a.lastReplyAt) : new Date(a.createdAt);
                const dateB = b.lastReplyAt ? new Date(b.lastReplyAt) : new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });
            setRecentDiscussions(allTopics.slice(0, 5));
        } else {
          console.error("Failed to fetch categories or invalid format:", categoryResponse.data);
          setError(categoryResponse.data?.message || 'Failed to fetch forum categories.');
        }
      } catch (err: any) {
        console.error('Error fetching forum data:', err);
        setError(err.response?.data?.message || err.message || 'Error connecting to the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchForumData();
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageBackground = document.getElementById('forum-page-background');
      if (pageBackground) { pageBackground.style.transform = `translateY(${scrollY * 0.05}px)`; }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} transition-colors duration-300 relative overflow-hidden`}>

      {/* Enhanced Animated Background Elements with Mathematical/Scientific Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" id="forum-page-background">
        {/* Mathematical symbols - Randomly placed */}
        <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
        <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
        <div className="absolute top-[61%] left-[27%] text-green-500 dark:text-green-400 text-8xl opacity-75 floating-icon-slow">∞</div>
        <div className="absolute top-[19%] right-[38%] text-red-500 dark:text-red-400 text-11xl opacity-65 floating-icon">⚛</div>
        <div className="absolute top-[77%] right-[23%] text-yellow-500 dark:text-yellow-400 text-9xl opacity-70 floating-icon-slow">𝜙</div>
        <div className="absolute bottom-[31%] left-[8%] text-indigo-500 dark:text-indigo-400 text-10xl opacity-70 floating-icon-reverse">∫</div>
        <div className="absolute bottom-[12%] right-[42%] text-teal-500 dark:text-teal-400 text-9xl opacity-75 floating-icon">≈</div>
        <div className="absolute bottom-[47%] right-[9%] text-pink-500 dark:text-pink-400 text-8xl opacity-65 floating-icon-slow">±</div>

        {/* Additional math symbols - More random placements */}
        <div className="absolute top-[23%] left-[54%] text-fuchsia-500 dark:text-fuchsia-400 text-8xl opacity-70 floating-icon">Δ</div>
        <div className="absolute top-[44%] left-[38%] text-emerald-500 dark:text-emerald-400 text-7xl opacity-65 floating-icon-slow">λ</div>
        <div className="absolute top-[81%] left-[67%] text-cyan-500 dark:text-cyan-400 text-9xl opacity-70 floating-icon-reverse">θ</div>
        <div className="absolute top-[29%] left-[83%] text-rose-500 dark:text-rose-400 text-8xl opacity-65 floating-icon">α</div>
        <div className="absolute bottom-[63%] left-[6%] text-amber-500 dark:text-amber-400 text-9xl opacity-70 floating-icon-slow">β</div>
        <div className="absolute bottom-[19%] left-[71%] text-purple-500 dark:text-purple-400 text-8xl opacity-65 floating-icon-reverse">μ</div>
        <div className="absolute bottom-[28%] left-[32%] text-blue-500 dark:text-blue-400 text-7xl opacity-70 floating-icon">ω</div>

        {/* Additional symbols for more richness */}
        <div className="absolute top-[52%] left-[18%] text-sky-500 dark:text-sky-400 text-8xl opacity-60 floating-icon-slow">γ</div>
        <div className="absolute top-[37%] right-[29%] text-lime-500 dark:text-lime-400 text-9xl opacity-55 floating-icon">σ</div>
        <div className="absolute bottom-[42%] right-[37%] text-orange-500 dark:text-orange-400 text-10xl opacity-50 floating-icon-reverse">δ</div>
        <div className="absolute top-[73%] right-[13%] text-violet-500 dark:text-violet-400 text-8xl opacity-60 floating-icon-slow">ρ</div>

        {/* Science formulas - Random positions */}
        <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
        <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
        <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
        <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>
        <div className="absolute bottom-[53%] left-[24%] text-emerald-500 dark:text-emerald-400 text-5xl opacity-65 floating-icon-slow">v=λf</div>
        <div className="absolute top-[86%] left-[11%] text-sky-500 dark:text-sky-400 text-5xl opacity-55 floating-icon-reverse">C₆H₁₂O₆</div>
        <div className="absolute top-[68%] right-[31%] text-amber-500 dark:text-amber-400 text-6xl opacity-60 floating-icon">E=hf</div>

        {/* Science icons - Randomly positioned */}
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

        <div className="absolute top-[54%] right-[28%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="absolute top-[23%] left-[67%] opacity-60 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
          </svg>
        </div>

        {/* Additional science icons */}
        <div className="absolute bottom-[37%] right-[6%] opacity-55 floating-icon-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>

        <div className="absolute top-[71%] left-[13%] opacity-55 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 pt-16 pb-32 overflow-hidden transition-colors duration-300 z-10">
         {/* Header-specific animations (kept from original) */}
         <div className="absolute inset-0 overflow-hidden opacity-20">
           <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>💬</div>
           <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🗣️</div>
           <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>🤝</div>
           <div className="absolute top-[25%] left-[30%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '15s' }}>💡</div>
           <div className="absolute bottom-[20%] right-[25%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '14s' }}>📚</div>
         </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="sm:flex sm:items-center sm:justify-between">
             <div className="animate-fade-in-up">
               <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl text-shadow"> Discussion Forum </h1>
               <p className="mt-2 text-lg text-purple-100"> Connect with peers, ask questions, and collaborate on topics </p>
             </div>
             <div className="mt-4 sm:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
               <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 dark:text-purple-200 dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" />
                 </svg>
                 Dashboard
               </Link>
             </div>
           </div>
         </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:-mt-16 pb-12 relative z-10">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12 animate-fade-in">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 dark:border-purple-400"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading forum data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8 shadow-lg animate-fade-in">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300">
              Try Again
            </button>
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && !error && (
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Main Content */}
            <div className="lg:w-3/4 space-y-8">
              {/* Forum Categories */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 transition-colors duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-shadow">Forum Categories</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {categories.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400"> No categories found </div>
                  ) : (
                    categories.map((category, index) => (
                      <div
                        key={category._id}
                        className={`p-6 transition-all duration-300 ${hoveredCategory === category._id ? 'bg-gray-50/80 dark:bg-gray-700/80' : 'dark:bg-transparent'} animate-fade-in`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onMouseEnter={() => setHoveredCategory(category._id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <Link href={`/forum/category/${category._id}`} className="block group">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-5">
                              <div className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 bg-gradient-to-br ${hoveredCategory === category._id ? category.hoverGradientFrom + ' ' + category.hoverGradientTo : category.gradientFrom + ' ' + category.gradientTo}`} style={{ boxShadow: hoveredCategory === category._id ? `0 10px 15px -3px ${category.shadowColor}` : 'none' }} >
                                {category.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-lg font-semibold transition-colors duration-200 group-hover:text-${category.color}-600 dark:group-hover:text-${category.color}-400 ${hoveredCategory === category._id ? `text-${category.color}-600 dark:text-${category.color}-400` : 'text-gray-900 dark:text-gray-100'}`}>
                                {category.name}
                              </h3>
                              <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{category.description}</p>
                              <div className="mt-3 flex items-center text-sm flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">{category.topicsCount || 0} topics</span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">{category.postsCount || 0} posts</span>
                              </div>
                            </div>
                            <div className={`ml-4 transition-transform duration-300 group-hover:translate-x-2`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 transition-colors duration-300 group-hover:bg-${category.color}-100 group-hover:text-${category.color}-600 dark:group-hover:bg-${category.color}-900/30 dark:group-hover:text-${category.color}-400 ${hoveredCategory === category._id ? `bg-${category.color}-100 text-${category.color}-600 dark:bg-${category.color}-900/30 dark:text-${category.color}-400` : 'text-gray-400 dark:text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> </svg>
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
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30">
                 <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 transition-colors duration-300">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-shadow">Recent Discussions</h2>
                   <Link href="/forum/new" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 flex items-center group transform hover:scale-105">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> </svg>
                     <span>New Topic</span>
                   </Link>
                 </div>
                 <div className="divide-y divide-gray-100 dark:divide-gray-700">
                   {recentDiscussions.length === 0 ? (
                     <div className="p-6 text-center text-gray-500 dark:text-gray-400"> No discussions found </div>
                   ) : (
                     recentDiscussions.map((discussion, index) => {
                       const categoryStyle = getCategoryStyles(discussion.category.name);
                       return (
                         <div
                           key={discussion._id}
                           className={`p-6 transition-all duration-300 ${hoveredDiscussion === discussion._id ? 'bg-gray-50/80 dark:bg-gray-700/80' : 'dark:bg-transparent'} animate-fade-in`}
                           style={{ animationDelay: `${(categories.length + index) * 0.05}s` }}
                           onMouseEnter={() => setHoveredDiscussion(discussion._id)}
                           onMouseLeave={() => setHoveredDiscussion(null)}
                         >
                           <Link href={`/forum/topic/${discussion._id}`} className="block group">
                             <div className="flex flex-col sm:flex-row sm:items-center">
                               <div className="flex-1 min-w-0">
                                 <div className="flex items-center flex-wrap gap-x-2">
                                   {discussion.isHot && (
                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /> </svg> Hot
                                     </span>
                                   )}
                                   <h3 className={`text-lg font-semibold transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 ${hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                     {discussion.title}
                                   </h3>
                                 </div>
                                 <div className="mt-2 flex items-center text-sm flex-wrap gap-x-3 gap-y-1">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.badgeBg}`}>
                                     {discussion.category.name}
                                   </span>
                                   <div className="flex items-center">
                                     <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 overflow-hidden ring-1 ring-white dark:ring-gray-800 group-hover:shadow transform group-hover:scale-110 transition-all duration-200">
                                       {discussion.author?.name?.charAt(0)?.toUpperCase() || '?'}
                                     </div>
                                     <span className="ml-1.5 text-gray-600 dark:text-gray-400">{discussion.author?.name || 'Unknown'}</span>
                                   </div>
                                 </div>
                               </div>
                               <div className="mt-3 sm:mt-0 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 flex-shrink-0 sm:ml-4">
                                 <div className="flex items-center" title="Replies">
                                   <div className={`p-1.5 rounded-full transition-colors duration-300 ${ hoveredDiscussion === discussion._id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700' }`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${ hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg>
                                   </div>
                                   <span className="ml-1.5">{discussion.repliesCount || 0}</span>
                                 </div>
                                 <div className="flex items-center" title="Views">
                                   <div className={`p-1.5 rounded-full transition-colors duration-300 ${ hoveredDiscussion === discussion._id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700' }`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${ hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg>
                                   </div>
                                   <span className="ml-1.5">{discussion.views || 0}</span>
                                 </div>
                                 <div className="flex items-center" title="Last Activity">
                                   <div className={`p-1.5 rounded-full transition-colors duration-300 ${ hoveredDiscussion === discussion._id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700' }`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${ hoveredDiscussion === discussion._id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>
                                   </div>
                                   <span className="ml-1.5 whitespace-nowrap"> {discussion.lastReplyAt ? getRelativeTime(discussion.lastReplyAt) : getRelativeTime(discussion.createdAt)} </span>
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
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /> </svg>
                   </Link>
                 </div>
               </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-8">
                {/* Search Forums */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-shadow">Search Forums</h2>
                    </div>
                    <div className="p-6">
                        <div className="relative">
                            <input type="text" placeholder="Search topics..." className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200" />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {categories.slice(0, 4).map(category => (
                                <button key={category._id} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 transform hover:scale-105" >
                                    #{category.name.split(' ')[0].toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Community Stats */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-shadow">Community Stats</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-5">
                            {/* Topics Stat */}
                            <div className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Topics</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.topics}</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full animate-widthGrow" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                             {/* Posts Stat */}
                            <div className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Posts</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.posts}</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full animate-widthGrow" style={{ width: '85%', animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                            {/* Members Stat */}
                            <div className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Members</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.members}</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 rounded-full animate-widthGrow" style={{ width: '65%', animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                            {/* Online Stat */}
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
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-shadow">Forum Guidelines</h2>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {["Be respectful and helpful to fellow students", "Post in the relevant category for better responses", "Include relevant details in your questions", "Use proper formatting for equations and formulas", "Earn points by providing helpful answers"].map((guideline, index) => (
                                <li key={index} className="flex items-start group">
                                    <div className="p-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-3 flex-shrink-0 mt-0.5 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200 transform group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">{guideline}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link href="/forum/guidelines" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200 group relative">
                                <span>Read full guidelines</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Top Contributors */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:hover:shadow-xl dark:shadow-gray-900/30 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-shadow">Top Contributors</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[{ name: "Ashan S.", points: 4250, badge: "Expert" }, { name: "Nethmi J.", points: 3780, badge: "Mentor" }, { name: "Kavisha M.", points: 3120, badge: "Guru" }].map((contributor, index) => (
                                <div key={index} className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 transform hover:scale-102">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md transform group-hover:scale-110 transition-all duration-200">
                                            {contributor.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{contributor.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{contributor.points} points</p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200 transform group-hover:scale-105">
                                        {contributor.badge}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                            <Link href="/forum/leaderboard" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200 group relative">
                                <span>View leaderboard</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    </div>
                </div>
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
         
         /* Enhanced transitions for dark mode */
         .transition-colors {
           transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
           transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
           transition-duration: 400ms;
         }
         
         /* Enhanced hover scale transform */
         .hover\:scale-102:hover {
           transform: scale(1.02);
         }
         
         .hover\:scale-105:hover {
           transform: scale(1.05);
         }
       `}</style>
    </div>
  );
}
