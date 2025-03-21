"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Forum() {
  // State for hover effects
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoveredDiscussion, setHoveredDiscussion] = useState<number | null>(null);

  // Mock data for forum categories
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
      hoverGradientFrom: 'from-blue-500',
      hoverGradientTo: 'to-blue-700',
      shadowColor: 'rgba(59, 130, 246, 0.5)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
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
      hoverGradientFrom: 'from-green-500',
      hoverGradientTo: 'to-green-700',
      shadowColor: 'rgba(16, 185, 129, 0.5)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
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
      hoverGradientFrom: 'from-yellow-500',
      hoverGradientTo: 'to-yellow-700',
      shadowColor: 'rgba(245, 158, 11, 0.5)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
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
      hoverGradientFrom: 'from-purple-500',
      hoverGradientTo: 'to-purple-700',
      shadowColor: 'rgba(124, 58, 237, 0.5)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  // Mock data for recent discussions
  const recentDiscussions = [
    {
      id: 1,
      title: 'Need help understanding electromagnetic induction',
      category: 'Physics',
      author: 'Dinuka P.',
      authorAvatar: '/images/avatars/avatar-1.jpg',
      replies: 12,
      views: 238,
      lastActive: '2 hours ago',
      isHot: true,
    },
    {
      id: 2,
      title: 'Oxidation and reduction reactions - easy way to remember',
      category: 'Chemistry',
      author: 'Kavisha M.',
      authorAvatar: '/images/avatars/avatar-2.jpg',
      replies: 8,
      views: 176,
      lastActive: '5 hours ago',
      isHot: false,
    },
    {
      id: 3,
      title: 'Integration by parts - when to use it?',
      category: 'Combined Mathematics',
      author: 'Ashan S.',
      authorAvatar: '/images/avatars/avatar-3.jpg',
      replies: 15,
      views: 312,
      lastActive: '1 day ago',
      isHot: true,
    },
    {
      id: 4,
      title: 'Time management tips for A/L exams',
      category: 'General Discussion',
      author: 'Nethmi J.',
      authorAvatar: '/images/avatars/avatar-4.jpg',
      replies: 24,
      views: 425,
      lastActive: '2 days ago',
      isHot: true,
    },
    {
      id: 5,
      title: 'Working with vectors in 3D space',
      category: 'Combined Mathematics',
      author: 'Ravindu K.',
      authorAvatar: '/images/avatars/avatar-5.jpg',
      replies: 6,
      views: 142,
      lastActive: '3 days ago',
      isHot: false,
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header - MODIFIED SECTION */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-16 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>💬</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🗣️</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>🤝</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>💡</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>📚</div>
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
      {/* End Hero Header - MODIFIED SECTION */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl font-bold text-gray-900">Forum Categories</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-6 transition-all duration-300 ${hoveredCategory === category.id ? 'bg-gray-50' : ''}`}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link href={`/forum/category/${category.id}`} className="block">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-5">
                          <div
                            className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 transform ${hoveredCategory === category.id ? 'scale-110' : ''} bg-gradient-to-br ${hoveredCategory === category.id ? category.hoverGradientFrom + ' ' + category.hoverGradientTo : category.gradientFrom + ' ' + category.gradientTo}`}
                            style={{ boxShadow: hoveredCategory === category.id ? `0 10px 15px -3px ${category.shadowColor}` : 'none' }}
                          >
                            {category.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold transition-colors duration-200 ${hoveredCategory === category.id ? `text-${category.color}-600` : 'text-gray-900'}`}>
                            {category.name}
                          </h3>
                          <p className="mt-1 text-gray-600">{category.description}</p>
                          <div className="mt-3 flex items-center text-sm">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full mr-3 font-medium">{category.topics} topics</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">{category.posts} posts</span>
                          </div>
                        </div>
                        <div className={`ml-4 transition-transform duration-300 ${hoveredCategory === category.id ? 'transform translate-x-2' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-colors duration-300 ${hoveredCategory === category.id ? `bg-${category.color}-100 text-${category.color}-600` : 'text-gray-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
                <Link
                  href="/forum/new"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Topic</span>
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentDiscussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className={`p-6 transition-all duration-300 ${hoveredDiscussion === discussion.id ? 'bg-gray-50' : ''}`}
                    onMouseEnter={() => setHoveredDiscussion(discussion.id)}
                    onMouseLeave={() => setHoveredDiscussion(null)}
                  >
                    <Link href={`/forum/topic/${discussion.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            {discussion.isHot && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>
                                Hot
                              </span>
                            )}
                            <h3 className={`text-lg font-semibold transition-colors duration-200 ${hoveredDiscussion === discussion.id ? 'text-purple-600' : 'text-gray-900'}`}>
                              {discussion.title}
                            </h3>
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              discussion.category === 'Physics' ? 'bg-blue-100 text-blue-800' :
                              discussion.category === 'Chemistry' ? 'bg-green-100 text-green-800' :
                              discussion.category === 'Combined Mathematics' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {discussion.category}
                            </span>
                            <div className="ml-3 flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 overflow-hidden">
                                {/* Avatar would go here in production - using a placeholder */}
                                {discussion.author.charAt(0)}
                              </div>
                              <span className="ml-1.5 text-gray-600">{discussion.author}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                              hoveredDiscussion === discussion.id ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                hoveredDiscussion === discussion.id ? 'text-purple-600' : 'text-gray-500'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <span className="ml-1.5">{discussion.replies}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                              hoveredDiscussion === discussion.id ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                hoveredDiscussion === discussion.id ? 'text-purple-600' : 'text-gray-500'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <span className="ml-1.5">{discussion.views}</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full transition-colors duration-300 ${
                              hoveredDiscussion === discussion.id ? 'bg-purple-100' : 'bg-gray-100'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors duration-300 ${
                                hoveredDiscussion === discussion.id ? 'text-purple-600' : 'text-gray-500'
                              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="ml-1.5">{discussion.lastActive}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100 text-center bg-gradient-to-r from-white to-gray-50">
                <Link href="/forum/all" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 group">
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
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">Search Forums</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
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
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
                    #physics
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
                    #chemistry
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
                    #mathematics
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200">
                    #exam
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">Community Stats</h2>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Topics</span>
                      <span className="font-semibold text-gray-900">558</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-widthGrow" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Posts</span>
                      <span className="font-semibold text-gray-900">6,756</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full animate-widthGrow" style={{ width: '85%', animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Members</span>
                      <span className="font-semibold text-gray-900">2,845</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full animate-widthGrow" style={{ width: '65%', animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Online Now</span>
                      <span className="font-semibold text-gray-900">127</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full animate-widthGrow" style={{ width: '45%', animationDelay: '0.6s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">Forum Guidelines</h2>
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
                      <div className="p-1 rounded-full bg-purple-100 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:bg-purple-200 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{guideline}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href="/forum/guidelines"
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 group"
                  >
                    <span>Read full guidelines</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* New component: Top Contributors */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">Top Contributors</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "Ashan S.", points: 4250, badge: "Expert" },
                    { name: "Nethmi J.", points: 3780, badge: "Mentor" },
                    { name: "Kavisha M.", points: 3120, badge: "Guru" },
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {contributor.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{contributor.name}</p>
                          <p className="text-sm text-gray-500">{contributor.points} points</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-colors duration-200">
                        {contributor.badge}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <Link
                    href="/forum/leaderboard"
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 group"
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
      </div>
    </div>
  );
}