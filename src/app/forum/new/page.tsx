"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDarkMode } from '../../DarkModeContext';
import axios from 'axios';

// Define API base URL
const API_URL = 'http://localhost:5000/api';

// Type definitions
interface ForumCategory {
  _id: string;
  name: string;
  description: string;
  color?: string;
}

// Enhanced category styling
const getCategoryStyles = (categoryId: string) => {
  const styles = {
    physics: { 
      color: 'blue',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-blue-600',
      lightBg: 'bg-blue-50',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    chemistry: { 
      color: 'green',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      lightBg: 'bg-green-50',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    mathematics: { 
      color: 'yellow',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-600',
      lightBg: 'bg-yellow-50',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    general: { 
      color: 'purple',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-purple-600',
      lightBg: 'bg-purple-50',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  };
  
  return styles[categoryId as keyof typeof styles] || styles.general;
};

export default function NewTopicPage() {
  // Get router and search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for form
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || '');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // State for API data
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Mock user ID for development (would come from auth context in production)
  const currentUserId = '64f070a6018c0c66ee419799';

  // Add parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageBackground = document.getElementById('new-topic-page-background');
      if (pageBackground) {
        pageBackground.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/forum/categories`);
        
        if (response.data.success) {
          setCategories(response.data.data);
          
          // If no category is pre-selected and categories exist, select the first one
          if (!selectedCategory && response.data.data.length > 0) {
            setSelectedCategory(response.data.data[0]._id);
          }
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error connecting to the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [selectedCategory]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setSubmitError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setSubmitError('Content is required');
      return;
    }
    
    if (!selectedCategory) {
      setSubmitError('Please select a category');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await axios.post(`${API_URL}/forum/topics`, {
        title,
        content,
        category: selectedCategory
      }, {
        headers: {
          'Authorization': `Bearer mock-token-for-user-${currentUserId}`
        }
      });
      
      if (response.data.success) {
        // Redirect to the new topic page
        router.push(`/forum/topic/${response.data.data._id}`);
      } else {
        setSubmitError('Failed to create topic');
      }
    } catch (err: any) {
      console.error('Error creating topic:', err);
      setSubmitError(err.response?.data?.message || 'Error creating topic. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to render markdown preview
  const renderPreview = () => {
    // Simple markdown-like rendering (replace with a proper markdown library in production)
    let formattedContent = content
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
      
    return { __html: formattedContent };
  };

  // Get category style for the selected category
  const categoryStyle = selectedCategory ? getCategoryStyles(selectedCategory) : getCategoryStyles('general');

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background elements */}
      <div id="new-topic-page-background" className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium bg-white dark:bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-3 animate-fadeIn">
          <ol className="flex items-center space-x-2">
            <li>
              <Link 
                href="/forum" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Forum
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">New Topic</span>
            </li>
          </ol>
        </nav>
        
        {/* Show loading state */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8 flex justify-center items-center animate-fadeIn">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 dark:border-purple-400"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading categories...</span>
          </div>
        )}
        
        {/* Show error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8 animate-fadeIn">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-1 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800"></div>
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create a New Topic
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Share your question or start a discussion with the community
              </p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Title input */}
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      placeholder="Enter a clear, specific title for your topic"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <div className="absolute top-3 left-3 text-gray-400 dark:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    A good title is specific and summarizes your question (max 100 characters)
                  </p>
                </div>
                
                {/* Category selection */}
                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {categories.map((cat) => {
                      // Get ID for styling mapping (fallback to name if needed)
                      const styleId = cat.name.toLowerCase().includes('physics') ? 'physics' :
                                    cat.name.toLowerCase().includes('chemistry') ? 'chemistry' :
                                    cat.name.toLowerCase().includes('math') ? 'mathematics' : 'general';
                      
                      const style = getCategoryStyles(styleId);
                      
                      return (
                        <div 
                          key={cat._id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                            selectedCategory === cat._id 
                              ? `${style.lightBg} border-${style.color}-300 shadow-sm dark:bg-${style.color}-900/20 dark:border-${style.color}-700` 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                          onClick={() => setSelectedCategory(cat._id)}
                        >
                          <div className={`p-2 mr-3 rounded-md ${selectedCategory === cat._id ? `bg-${style.color}-100 text-${style.color}-600 dark:bg-${style.color}-900/30 dark:text-${style.color}-400` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {style.icon}
                          </div>
                          <div>
                            <span className={`font-medium ${selectedCategory === cat._id ? `text-${style.color}-700 dark:text-${style.color}-400` : 'text-gray-700 dark:text-gray-300'}`}>
                              {cat.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Editor tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                  <button
                    type="button"
                    className={`py-2 px-4 font-medium text-sm ${
                      activeTab === 'write'
                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    } transition-colors duration-200`}
                    onClick={() => setActiveTab('write')}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 font-medium text-sm ${
                      activeTab === 'preview'
                        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    } transition-colors duration-200`}
                    onClick={() => setActiveTab('preview')}
                    disabled={!content}
                  >
                    Preview
                  </button>
                </div>
                
                {/* Editor toolbar */}
                {activeTab === 'write' && (
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-sm rounded-t-lg">
                    <button type="button" className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 mr-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Content input or preview */}
                <div className="mb-6">
                  {activeTab === 'write' ? (
                    <textarea
                      id="content"
                      name="content"
                      rows={10}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      placeholder="Describe your question or topic in detail. Include any relevant information that would help others understand your question."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={isSubmitting}
                      required
                    ></textarea>
                  ) : (
                    <div className="w-full p-4 min-h-[250px] border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 prose dark:prose-invert prose-sm max-w-none">
                      {content ? (
                        <div dangerouslySetInnerHTML={renderPreview()} />
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">Nothing to preview yet. Write some content first.</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">Tip: Use ** for bold</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">Use * for italic</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">Use $ for math formulas</span>
                  </div>
                </div>
                
                {/* Submit error */}
                {submitError && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                    {submitError}
                  </div>
                )}
                
                {/* Submit buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                      <span className="font-medium">Tip:</span> Be specific in your question to get better answers.
                    </span>
                  </div>
                  <div className="flex space-x-3 self-end">
                    <Link
                      href="/forum"
                      className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={`px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center ${
                        !title || !selectedCategory || !content || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      disabled={!title || !selectedCategory || !content || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Topic...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Create Topic
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Posting Guidelines:</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-7">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Make sure your question hasn't been asked before by using the search function.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Be clear and concise in your title and description.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>For math equations, use proper formatting (surround with $ for inline or $$ for block).</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Be respectful and considerate of other community members.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Quick help section */}
        {!isLoading && !error && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Quick Help</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">How to ask good questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn the art of asking questions that get fast, helpful answers.</p>
                  <a href="#" className="mt-2 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                    <span>Read guide</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Formatting your content</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to format text, equations, and add images to your posts.</p>
                  <a href="#" className="mt-2 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                    <span>See examples</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}