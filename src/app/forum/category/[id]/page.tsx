'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '@/app/DarkModeContext'; // Corrected import path

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for hover effects
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);
  
  // Mock category data with enhanced styling information
  const categories = [
    {
      id: 1,
      name: 'Physics',
      description: 'Discuss mechanics, waves, electricity, and other physics topics',
      topics: 156,
      posts: 1872,
      color: 'blue',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-blue-600',
      darkGradientFrom: 'dark:from-blue-600',
      darkGradientTo: 'dark:to-blue-800',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      accentColor: 'text-blue-600',
      darkAccentColor: 'dark:text-blue-400',
      iconColor: 'text-blue-500',
      darkIconColor: 'dark:text-blue-400',
      badgeBg: 'bg-blue-100',
      darkBadgeBg: 'dark:bg-blue-900/30',
      badgeText: 'text-blue-800',
      darkBadgeText: 'dark:text-blue-400',
    },
    {
      id: 2,
      name: 'Chemistry',
      description: 'Discuss organic, inorganic, and physical chemistry concepts',
      topics: 124,
      posts: 1452,
      color: 'green',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      darkGradientFrom: 'dark:from-green-600',
      darkGradientTo: 'dark:to-green-800',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
      accentColor: 'text-green-600',
      darkAccentColor: 'dark:text-green-400',
      iconColor: 'text-green-500',
      darkIconColor: 'dark:text-green-400',
      badgeBg: 'bg-green-100',
      darkBadgeBg: 'dark:bg-green-900/30',
      badgeText: 'text-green-800',
      darkBadgeText: 'dark:text-green-400',
    },
    {
      id: 3,
      name: 'Combined Mathematics',
      description: 'Discuss calculus, algebra, statistics, and other math topics',
      topics: 183,
      posts: 2145,
      color: 'yellow',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-600',
      darkGradientFrom: 'dark:from-yellow-600',
      darkGradientTo: 'dark:to-yellow-800',
      lightBg: 'bg-yellow-50',
      darkBg: 'dark:bg-yellow-900/20',
      accentColor: 'text-yellow-600',
      darkAccentColor: 'dark:text-yellow-400',
      iconColor: 'text-yellow-500',
      darkIconColor: 'dark:text-yellow-400',
      badgeBg: 'bg-yellow-100',
      darkBadgeBg: 'dark:bg-yellow-900/30',
      badgeText: 'text-yellow-800',
      darkBadgeText: 'dark:text-yellow-400',
    },
    {
      id: 4,
      name: 'General Discussion',
      description: 'Discuss general topics related to A/L exams, preparation, and more',
      topics: 95,
      posts: 1287,
      color: 'purple',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-purple-600',
      darkGradientFrom: 'dark:from-purple-600',
      darkGradientTo: 'dark:to-purple-800',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      accentColor: 'text-purple-600',
      darkAccentColor: 'dark:text-purple-400',
      iconColor: 'text-purple-500',
      darkIconColor: 'dark:text-purple-400',
      badgeBg: 'bg-purple-100',
      darkBadgeBg: 'dark:bg-purple-900/30',
      badgeText: 'text-purple-800',
      darkBadgeText: 'dark:text-purple-400',
    },
  ];

  const categoryId = parseInt(params.id);
  const category = categories.find(c => c.id === categoryId) || categories[0];
  
  // Mock topics for this category
  const topics = [
    {
      id: 1,
      title: 'Need help understanding electromagnetic induction',
      author: 'Dinuka P.',
      authorAvatar: '/images/avatars/avatar-1.jpg',
      replies: 12,
      views: 238,
      lastActive: '2 hours ago',
      lastPoster: 'Samith R.',
      lastPosterAvatar: '/images/avatars/avatar-6.jpg',
      isPinned: true,
      isHot: true,
    },
    {
      id: 2,
      title: 'How to solve these mechanics problems?',
      author: 'Ravindu K.',
      authorAvatar: '/images/avatars/avatar-2.jpg',
      replies: 5,
      views: 142,
      lastActive: '5 hours ago',
      lastPoster: 'Kavisha M.',
      lastPosterAvatar: '/images/avatars/avatar-7.jpg',
      isPinned: false,
      isHot: false,
    },
    {
      id: 3,
      title: 'Wave-particle duality explained',
      author: 'Sajith T.',
      authorAvatar: '/images/avatars/avatar-3.jpg',
      replies: 8,
      views: 176,
      lastActive: '1 day ago',
      lastPoster: 'Nethmi J.',
      lastPosterAvatar: '/images/avatars/avatar-8.jpg',
      isPinned: false,
      isHot: true,
    },
    {
      id: 4,
      title: 'Difference between velocity and acceleration',
      author: 'Chamodi D.',
      authorAvatar: '/images/avatars/avatar-4.jpg',
      replies: 15,
      views: 312,
      lastActive: '2 days ago',
      lastPoster: 'Ashan S.',
      lastPosterAvatar: '/images/avatars/avatar-9.jpg',
      isPinned: false,
      isHot: false,
    },
    {
      id: 5,
      title: 'Help with derivation of relativistic momentum',
      author: 'Samith R.',
      authorAvatar: '/images/avatars/avatar-5.jpg',
      replies: 6,
      views: 198,
      lastActive: '3 days ago',
      lastPoster: 'Dinuka P.',
      lastPosterAvatar: '/images/avatars/avatar-1.jpg',
      isPinned: false,
      isHot: false,
    },
    {
      id: 6,
      title: 'Understanding electric field intensity',
      author: 'Malith G.',
      authorAvatar: '/images/avatars/avatar-6.jpg',
      replies: 3,
      views: 112,
      lastActive: '5 days ago',
      lastPoster: 'Ravindu K.',
      lastPosterAvatar: '/images/avatars/avatar-2.jpg',
      isPinned: false,
      isHot: false,
    },
    {
      id: 7,
      title: 'Tips for solving thermodynamics problems',
      author: 'Kavisha M.',
      authorAvatar: '/images/avatars/avatar-7.jpg',
      replies: 9,
      views: 201,
      lastActive: '1 week ago',
      lastPoster: 'Sajith T.',
      lastPosterAvatar: '/images/avatars/avatar-3.jpg',
      isPinned: false,
      isHot: false,
    },
  ];

  // Add a subtle parallax effect to the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageBackground = document.getElementById('category-page-background');
      if (pageBackground) {
        pageBackground.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-${category.color}-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300`}>
      {/* Decorative background elements */}
      <div id="category-page-background" className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className={`absolute top-20 left-1/4 w-64 h-64 bg-${category.color}-200 dark:bg-${category.color}-900/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow transition-colors duration-300`}></div>
        <div className={`absolute top-40 right-1/4 w-96 h-96 bg-${category.color}-300 dark:bg-${category.color}-800/30 rounded-full filter blur-3xl opacity-20 animate-float transition-colors duration-300`}></div>
        <div className={`absolute bottom-20 left-1/3 w-80 h-80 bg-${category.color}-100 dark:bg-${category.color}-900/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow transition-colors duration-300`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-md dark:shadow-lg dark:shadow-gray-900/30 p-3 animate-fadeIn transition-colors duration-300">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/forum" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Forum
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className={`${category.accentColor} ${category.darkAccentColor} font-semibold transition-colors duration-300`}>{category.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Category Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:shadow-gray-900/30 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className={`p-1 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} ${category.darkGradientFrom} ${category.darkGradientTo} transition-colors duration-300`}></div>
          <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${category.lightBg} ${category.darkBg} flex items-center justify-center mr-4 transition-colors duration-300`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.iconColor} ${category.darkIconColor} transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {category.id === 1 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                    {category.id === 2 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    )}
                    {category.id === 3 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    )}
                    {category.id === 4 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    )}
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl transition-colors duration-300">{category.name}</h1>
                  <p className="mt-1 text-gray-600 dark:text-gray-400 transition-colors duration-300">{category.description}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link 
                  href="/forum/new" 
                  className={`px-5 py-2.5 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} ${category.darkGradientFrom} ${category.darkGradientTo} text-white rounded-lg font-medium shadow-md hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 flex items-center group`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Topic</span>
                </Link>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className={`px-3 py-1.5 ${category.badgeBg} ${category.darkBadgeBg} ${category.badgeText} ${category.darkBadgeText} rounded-full text-sm font-medium flex items-center transition-colors duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{category.topics} topics</span>
              </div>
              <div className={`px-3 py-1.5 ${category.badgeBg} ${category.darkBadgeBg} ${category.badgeText} ${category.darkBadgeText} rounded-full text-sm font-medium flex items-center transition-colors duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span>{category.posts} posts</span>
              </div>
              <div className={`px-3 py-1.5 ${category.badgeBg} ${category.darkBadgeBg} ${category.badgeText} ${category.darkBadgeText} rounded-full text-sm font-medium flex items-center transition-colors duration-300`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last updated 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Topics List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl dark:shadow-lg dark:shadow-gray-900/30 animate-fadeIn transition-colors duration-300" style={{ animationDelay: '0.2s' }}>
          <div className="hidden sm:grid sm:grid-cols-12 p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
            <div className="sm:col-span-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Topic
            </div>
            <div className="sm:col-span-2 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Replies
            </div>
            <div className="sm:col-span-2 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Views
            </div>
            <div className="sm:col-span-2 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last Post
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-300">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className={`p-4 transition-all duration-300 ${hoveredTopic === topic.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''} ${topic.isPinned ? `${category.lightBg} ${category.darkBg}` : ''}`}
                onMouseEnter={() => setHoveredTopic(topic.id)}
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div className="sm:grid sm:grid-cols-12 sm:gap-4">
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      {topic.isPinned && (
                        <div className={`p-1.5 rounded-full ${category.badgeBg} ${category.darkBadgeBg} ${category.badgeText} ${category.darkBadgeText} mr-3 flex-shrink-0 mt-0.5 transition-colors duration-300`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          {topic.isHot && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 mr-2 transition-colors duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                              </svg>
                              Hot
                            </span>
                          )}
                          <Link 
                            href={`/forum/topic/${topic.id}`} 
                            className={`text-base font-medium transition-colors duration-200 ${hoveredTopic === topic.id ? `${category.accentColor} ${category.darkAccentColor}` : 'text-gray-900 dark:text-gray-100'}`}
                          >
                            {topic.title}
                          </Link>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 overflow-hidden mr-1.5 transition-colors duration-300">
                            {/* Avatar would go here in production - using a placeholder */}
                            {topic.author.charAt(0)}
                          </div>
                          <span>Started by {topic.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-center hidden sm:flex items-center justify-center">
                    <div className={`transition-all duration-200 px-2.5 py-1 rounded-full text-xs font-medium ${
                      topic.replies > 10 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 
                      topic.replies > 5 ? `${category.badgeBg} ${category.darkBadgeBg} ${category.badgeText} ${category.darkBadgeText}` :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    } transition-colors duration-300`}>
                      {topic.replies}
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-center hidden sm:flex items-center justify-center">
                    <span className={`text-sm ${
                      topic.views > 200 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                    } transition-colors duration-300`}>
                      {topic.views}
                    </span>
                  </div><div className="sm:col-span-2 text-right hidden sm:block">
                    <div className="flex items-center justify-end">
                      <div className="mr-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{topic.lastPoster}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">{topic.lastActive}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300 overflow-hidden transition-colors duration-300">
                        {/* Avatar would go here in production - using a placeholder */}
                        {topic.lastPoster.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:hidden grid grid-cols-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 transition-colors duration-300">
                    <div className="text-center">
                      <span className={`block text-gray-900 dark:text-gray-100 font-medium ${
                        topic.replies > 10 ? 'text-green-600 dark:text-green-400' : ''
                      } transition-colors duration-300`}>
                        {topic.replies}
                      </span>
                      <span>Replies</span>
                    </div>
                    <div className="text-center">
                      <span className={`block text-gray-900 dark:text-gray-100 font-medium ${
                        topic.views > 200 ? 'text-green-600 dark:text-green-400' : ''
                      } transition-colors duration-300`}>
                        {topic.views}
                      </span>
                      <span>Views</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-gray-900 dark:text-gray-100 font-medium transition-colors duration-300">{topic.lastActive}</span>
                      <span>Last Post</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <nav className="inline-flex rounded-lg shadow-lg dark:shadow-gray-900/30" aria-label="Pagination">
            <Link 
              href="#" 
              className="px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </Link>
            <Link 
              href="#" 
              className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              1
            </Link>
            <Link 
              href="#" 
              className={`px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} ${category.darkGradientFrom} ${category.darkGradientTo} text-sm font-medium text-white transition-colors duration-200`}
            >
              2
            </Link>
            <Link 
              href="#" 
              className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              3
            </Link>
            <Link 
              href="#" 
              className="px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </div>
        
        {/* Topic Actions */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden p-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn dark:shadow-lg dark:shadow-gray-900/30 transition-colors duration-300" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${category.lightBg} ${category.darkBg} flex items-center justify-center mr-3 transition-colors duration-300`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${category.iconColor} ${category.darkIconColor} transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">Can't find what you're looking for?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Start a new conversation or browse all topics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/forum/new" 
              className={`px-4 py-2 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} ${category.darkGradientFrom} ${category.darkGradientTo} text-white rounded-lg font-medium shadow-md hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Topic
            </Link>
            <Link 
              href="/forum" 
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              All Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}