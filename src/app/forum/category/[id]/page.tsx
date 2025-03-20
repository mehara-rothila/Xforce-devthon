'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CategoryPage({ params }: { params: { id: string } }) {
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
      lightBg: 'bg-blue-50',
      accentColor: 'text-blue-600',
      iconColor: 'text-blue-500',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
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
      lightBg: 'bg-green-50',
      accentColor: 'text-green-600',
      iconColor: 'text-green-500',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-800',
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
      lightBg: 'bg-yellow-50',
      accentColor: 'text-yellow-600',
      iconColor: 'text-yellow-500',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-800',
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
      lightBg: 'bg-purple-50',
      accentColor: 'text-purple-600',
      iconColor: 'text-purple-500',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
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
    <div className={`min-h-screen bg-gradient-to-b from-${category.color}-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div id="category-page-background" className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className={`absolute top-20 left-1/4 w-64 h-64 bg-${category.color}-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow`}></div>
        <div className={`absolute top-40 right-1/4 w-96 h-96 bg-${category.color}-300 rounded-full filter blur-3xl opacity-20 animate-float`}></div>
        <div className={`absolute bottom-20 left-1/3 w-80 h-80 bg-${category.color}-100 rounded-full filter blur-3xl opacity-30 animate-pulse-slow`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-3 animate-fadeIn">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/forum" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Forum
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className={`${category.accentColor} font-semibold`}>{category.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className={`p-1 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo}`}></div>
          <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${category.lightBg} flex items-center justify-center mr-4`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{category.name}</h1>
                  <p className="mt-1 text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link 
                  href="/forum/new" 
                  className={`px-5 py-2.5 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center group`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Topic</span>
                </Link>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className={`px-3 py-1.5 ${category.badgeBg} ${category.badgeText} rounded-full text-sm font-medium flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{category.topics} topics</span>
              </div>
              <div className={`px-3 py-1.5 ${category.badgeBg} ${category.badgeText} rounded-full text-sm font-medium flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span>{category.posts} posts</span>
              </div>
              <div className={`px-3 py-1.5 ${category.badgeBg} ${category.badgeText} rounded-full text-sm font-medium flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last updated 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Topics List */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="hidden sm:grid sm:grid-cols-12 p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="sm:col-span-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Topic
            </div>
            <div className="sm:col-span-2 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Replies
            </div>
            <div className="sm:col-span-2 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Views
            </div>
            <div className="sm:col-span-2 text-center flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last Post
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className={`p-4 transition-all duration-300 ${hoveredTopic === topic.id ? 'bg-gray-50' : ''} ${topic.isPinned ? `${category.lightBg}` : ''}`}
                onMouseEnter={() => setHoveredTopic(topic.id)}
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div className="sm:grid sm:grid-cols-12 sm:gap-4">
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      {topic.isPinned && (
                        <div className={`p-1.5 rounded-full ${category.badgeBg} ${category.badgeText} mr-3 flex-shrink-0 mt-0.5`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          {topic.isHot && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                              </svg>
                              Hot
                            </span>
                          )}
                          <Link 
                            href={`/forum/topic/${topic.id}`} 
                            className={`text-base font-medium transition-colors duration-200 ${hoveredTopic === topic.id ? category.accentColor : 'text-gray-900'}`}
                          >
                            {topic.title}
                          </Link>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 overflow-hidden mr-1.5">
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
                      topic.replies > 10 ? 'bg-green-100 text-green-800' : 
                      topic.replies > 5 ? `${category.badgeBg} ${category.badgeText}` :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {topic.replies}
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-center hidden sm:flex items-center justify-center">
                    <span className={`text-sm ${
                      topic.views > 200 ? 'text-green-600 font-medium' : 'text-gray-600'
                    }`}>
                      {topic.views}
                    </span>
                  </div>
                  <div className="sm:col-span-2 text-right hidden sm:block">
                    <div className="flex items-center justify-end">
                      <div className="mr-2">
                        <p className="text-sm text-gray-600">{topic.lastPoster}</p>
                        <p className="text-xs text-gray-500">{topic.lastActive}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 overflow-hidden">
                        {/* Avatar would go here in production - using a placeholder */}
                        {topic.lastPoster.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:hidden grid grid-cols-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <div className="text-center">
                      <span className={`block text-gray-900 font-medium ${
                        topic.replies > 10 ? 'text-green-600' : ''
                      }`}>
                        {topic.replies}
                      </span>
                      <span>Replies</span>
                    </div>
                    <div className="text-center">
                      <span className={`block text-gray-900 font-medium ${
                        topic.views > 200 ? 'text-green-600' : ''
                      }`}>
                        {topic.views}
                      </span>
                      <span>Views</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-gray-900 font-medium">{topic.lastActive}</span>
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
          <nav className="inline-flex rounded-lg shadow-lg" aria-label="Pagination">
            <Link 
              href="#" 
              className="px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </Link>
            <Link 
              href="#" 
              className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              1
            </Link>
            <Link 
              href="#" 
              className={`px-4 py-2 border border-gray-300 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} text-sm font-medium text-white`}
            >
              2
            </Link>
            <Link 
              href="#" 
              className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              3
            </Link>
            <Link 
              href="#" 
              className="px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </div>
        
        {/* Topic Actions */}
                  <div className="mt-6 bg-white rounded-xl shadow-xl overflow-hidden p-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${category.lightBg} flex items-center justify-center mr-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${category.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Can't find what you're looking for?</h3>
              <p className="text-sm text-gray-600">Start a new conversation or browse all topics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/forum/new" 
              className={`px-4 py-2 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Topic
            </Link>
            <Link 
              href="/forum" 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center"
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