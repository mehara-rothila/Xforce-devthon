"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../DarkModeContext'; // Import the dark mode context

// Define TypeScript interfaces for proper type safety
interface Resource {
  id: number;
  title: string;
  category: string;
  subject: string;
  type: string;
  size: string;
  downloads: number;
  premium: boolean;
  date: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

export default function ResourcesPage() {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubjects, setActiveSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('downloads');

  const categories: Category[] = [
    { id: 'all', name: 'All Resources', count: 532 },
    { id: 'past-papers', name: 'Past Papers', count: 45 },
    { id: 'model-papers', name: 'Model Papers', count: 32 },
    { id: 'notes', name: 'Notes', count: 120 },
    { id: 'practice', name: 'Practice Questions', count: 250 },
    { id: 'videos', name: 'Video Lessons', count: 85 },
  ];

  const subjects: Subject[] = [
    { id: 'physics', name: 'Physics', color: 'blue' },
    { id: 'chemistry', name: 'Chemistry', color: 'green' },
    { id: 'math', name: 'Combined Math', color: 'yellow' },
  ];

  const resources: Resource[] = [
    {
      id: 1,
      title: '2023 Physics Past Paper with Marking Scheme',
      category: 'Past Papers',
      subject: 'Physics',
      type: 'PDF',
      size: '2.4 MB',
      downloads: 1250,
      premium: false,
      date: '2023-09-15'
    },
    {
      id: 2,
      title: 'Combined Mathematics Model Paper - June 2024',
      category: 'Model Papers',
      subject: 'Combined Math',
      type: 'PDF',
      size: '3.1 MB',
      downloads: 875,
      premium: true,
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Organic Chemistry Comprehensive Notes',
      category: 'Notes',
      subject: 'Chemistry',
      type: 'PDF',
      size: '5.7 MB',
      downloads: 2100,
      premium: false,
      date: '2023-11-27'
    },
    {
      id: 4,
      title: 'Physics: Electricity and Magnetism Practice Questions',
      category: 'Practice Questions',
      subject: 'Physics',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 950,
      premium: false,
      date: '2023-12-05'
    },
    {
      id: 5,
      title: 'Chemistry 2022 Past Paper with Worked Solutions',
      category: 'Past Papers',
      subject: 'Chemistry',
      type: 'PDF',
      size: '4.2 MB',
      downloads: 1800,
      premium: false,
      date: '2023-08-20'
    },
    {
      id: 6,
      title: 'Advanced Calculus Video Lessons',
      category: 'Video Lessons',
      subject: 'Combined Math',
      type: 'Video',
      size: '450 MB',
      downloads: 780,
      premium: true,
      date: '2024-02-18'
    },
  ];

  // Toggle subject filter with proper type annotation
  const toggleSubject = (subjectId: string) => {
    if (activeSubjects.includes(subjectId)) {
      setActiveSubjects(activeSubjects.filter(id => id !== subjectId));
    } else {
      setActiveSubjects([...activeSubjects, subjectId]);
    }
  };

  // Filter resources based on active category, subjects, and search query
  const filteredResources = resources.filter((resource: Resource) => {
    const matchesCategory = activeCategory === 'all' || 
      resource.category.toLowerCase().includes(activeCategory.replace('-', ' '));
    
    const matchesSubject = activeSubjects.length === 0 || 
      activeSubjects.includes(resource.subject.replace(' ', '-').toLowerCase());
    
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSubject && matchesSearch;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a: Resource, b: Resource) => {
    switch (sortOption) {
      case 'downloads':
        return b.downloads - a.downloads;
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'az':
        return a.title.localeCompare(b.title);
      default:
        return b.downloads - a.downloads;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 pt-16 pb-32 overflow-hidden transition-colors duration-300">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>📚</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>📝</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>📖</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>🧪</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>🔬</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Resource Library
              </h1>
              <p className="mt-2 text-lg text-purple-100">
                Access study materials, past papers, and learning resources
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Search Box */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Resources
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 dark:text-gray-100 dark:placeholder-gray-400"
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
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Categories
                </h2>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li 
                      key={category.id} 
                      className="flex justify-between items-center group cursor-pointer"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span className={`text-gray-700 dark:text-gray-300 ${activeCategory === category.id ? 'text-purple-700 dark:text-purple-400 font-medium' : 'group-hover:text-purple-600 dark:group-hover:text-purple-400'} transition-colors duration-200`}>
                        {category.name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activeCategory === category.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-700 dark:group-hover:text-purple-400'
                      } transition-colors duration-200`}>
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Subjects
                </h2>
                <div className="space-y-3">
                  {subjects.map((subject) => (
                    <div 
                      key={subject.id} 
                      className="flex items-center cursor-pointer group"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <div className={`h-5 w-5 rounded border flex items-center justify-center mr-3 transition-colors duration-200 ${
                        activeSubjects.includes(subject.id)
                          ? `bg-${subject.color}-500 dark:bg-${subject.color}-600 border-${subject.color}-500 dark:border-${subject.color}-600 text-white`
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500'
                      }`}>
                        {activeSubjects.includes(subject.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label className={`block text-base ${
                        activeSubjects.includes(subject.id) ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-700 dark:text-gray-300'
                      } cursor-pointer group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200`}>
                        {subject.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Banner */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] dark:shadow-lg dark:shadow-gray-900/30">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mr-4">
                    ✨
                  </div>
                  <h2 className="text-xl font-bold text-white">Premium Access</h2>
                </div>
                <p className="text-purple-100 mb-4">Unlock all premium resources and exclusive content with a premium subscription.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start text-white">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">All past papers with solutions</span>
                  </li>
                  <li className="flex items-start text-white">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">Video lessons and tutorials</span>
                  </li>
                  <li className="flex items-start text-white">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">Advanced practice materials</span>
                  </li>
                </ul>
                <button className="w-full py-2 px-4 bg-white dark:bg-gray-100 rounded-lg text-center font-medium text-purple-700 hover:bg-purple-50 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting and Filters Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold mb-4 sm:mb-0 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {activeCategory === 'all' ? 'All Resources' : categories.find(c => c.id === activeCategory)?.name}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">({sortedResources.length} items)</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400 mr-2 transition-colors duration-300">Sort by:</label>
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 pl-3 pr-10 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"
                    >
                      <option value="downloads">Most Downloaded</option>
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="az">A-Z</option>
                    </select>
                  </div>
                </div>
                {(activeSubjects.length > 0 || searchQuery) && (
                  <div className="mt-4 flex flex-wrap items-center pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 transition-colors duration-300">Filters:</span>
                    {activeSubjects.map((subjectId) => (
                      <span 
                        key={subjectId}
                        className={`m-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${
                          subjects.find(s => s.id === subjectId)?.color
                        }-100 dark:bg-${
                          subjects.find(s => s.id === subjectId)?.color
                        }-900/30 text-${
                          subjects.find(s => s.id === subjectId)?.color
                        }-800 dark:text-${
                          subjects.find(s => s.id === subjectId)?.color
                        }-400 cursor-pointer hover:bg-${
                          subjects.find(s => s.id === subjectId)?.color
                        }-200 dark:hover:bg-${
                          subjects.find(s => s.id === subjectId)?.color
                        }-800/30 transition-colors duration-200`}
                        onClick={() => toggleSubject(subjectId)}
                      >
                        {subjects.find(s => s.id === subjectId)?.name}
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    ))}
                    {searchQuery && (
                      <span 
                        className="m-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        onClick={() => setSearchQuery('')}
                      >
                        Search: {searchQuery}
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    )}
                    <button 
                      className="ml-auto text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors duration-200"
                      onClick={() => {
                        setActiveCategory('all');
                        setActiveSubjects([]);
                        setSearchQuery('');
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resource Listings */}
            <div className="space-y-4">
              {sortedResources.length > 0 ? (
                sortedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:shadow-lg dark:shadow-gray-900/30"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center flex-wrap mb-2 gap-2">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                                resource.subject === 'Physics'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                  : resource.subject === 'Chemistry'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                              } transition-colors duration-300`}
                            >
                              {resource.subject}
                            </span>
                            <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-700 transition-colors duration-300">
                              {resource.category}
                            </span>
                            {resource.premium && (
                              <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 transition-colors duration-300">
                                Premium
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{resource.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
                            <span className="flex items-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {resource.type} • {resource.size}
                            </span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {resource.downloads.toLocaleString()} downloads
                            </span>
                          </div>
                        </div>
                        <div>
                          <button
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center shadow-md ${
                              resource.premium
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-800 dark:hover:to-indigo-800 transform hover:scale-105'
                            }`}
                          >
                            {resource.premium ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Premium Access
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">No resources found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">Try adjusting your filters or search query</p>
                  <button 
                    className="px-5 py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors duration-200"
                    onClick={() => {
                      setActiveCategory('all');
                      setActiveSubjects([]);
                      setSearchQuery('');
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {sortedResources.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-lg shadow-sm">
                  <button className="px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    Previous
                  </button>
                  <button className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-sm font-medium text-white transition-colors duration-200">
                    2
                  </button>
                  <button className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    3
                  </button>
                  <button className="px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}