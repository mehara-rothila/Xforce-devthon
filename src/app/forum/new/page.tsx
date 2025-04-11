"use client";

import React, { useState, useEffect, Suspense } from 'react'; // Import Suspense
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { MessageSquare, Clock, ArrowLeft, Loader2, AlertCircle, Layout, Edit } from 'lucide-react';
import PendingNotification from '../PendingNotification';
import SubjectIcon from '@/components/icons/SubjectIcon';

// Interfaces
interface ForumCategory {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  topicsCount?: number;
  postsCount?: number;
  lightBg?: string;
  iconName?: string;
}

// getCategoryStyles function
const getCategoryStyles = (categoryName: string = '') => {
  const lowerName = categoryName?.toLowerCase() || '';
  switch (lowerName) {
    case 'physics discussions': return { color: 'blue', lightBg: 'bg-blue-50 dark:bg-blue-900/20', iconName: 'atom' };
    case 'chemistry corner': return { color: 'green', lightBg: 'bg-green-50 dark:bg-green-900/20', iconName: 'flask' };
    case 'mathematics hub': return { color: 'yellow', lightBg: 'bg-yellow-50 dark:bg-yellow-900/20', iconName: 'calculator' };
    case 'study tips & tricks': return { color: 'red', lightBg: 'bg-red-50 dark:bg-red-900/20', iconName: 'lightbulb' };
    case 'exam preparation': return { color: 'orange', lightBg: 'bg-orange-50 dark:bg-orange-900/20', iconName: 'book' };
    default: return { color: 'purple', lightBg: 'bg-purple-50 dark:bg-purple-900/20', iconName: 'chat' };
  }
};

// --- Loading Component for Suspense Fallback ---
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-400" />
        </div>
    );
}

// --- Main Component Logic ---
function NewTopicFormContent() {
  // Hooks are now safe inside this component because it will be wrapped in Suspense
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isMounted, setIsMounted] = useState(false); // Keep for localStorage guard

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect for user info (Guarded by isMounted)
  useEffect(() => {
    if (isMounted) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          try {
            const parsedInfo = JSON.parse(userInfo);
            setCurrentUserId(parsedInfo?._id || 'mock-user-id');
            setUserRole(parsedInfo?.role || 'user');
          } catch (e) {
            console.error("Error parsing user info from localStorage", e);
            setCurrentUserId('mock-user-id');
            setUserRole('user');
          }
        } else {
          setCurrentUserId('mock-user-id');
          setUserRole('user');
        }
      }
    }
  }, [isMounted]);

  // useEffect for fetching categories and setting initial state
   useEffect(() => {
    let isCancelled = false; // Flag to prevent state update on unmount

    const fetchAndSetCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.forum.getCategories();
        if (isCancelled) return; // Don't update state if component unmounted

        if (response.data?.status === 'success') {
          const fetchedCategories = response.data.data?.categories || [];
          const enhancedCategories = fetchedCategories.map((cat: ForumCategory) => ({
            ...cat,
            ...getCategoryStyles(cat.name)
          }));
          setCategories(enhancedCategories);

          // Determine initial category *after* fetch
          const urlCategoryId = searchParams.get('category'); // Now safe to call inside useEffect
          let initialCategory = '';
          if (urlCategoryId && enhancedCategories.some((c: any) => c._id === urlCategoryId)) {
            initialCategory = urlCategoryId;
          } else if (enhancedCategories.length > 0) {
            initialCategory = enhancedCategories[0]._id;
          }
          setSelectedCategory(initialCategory);

        } else {
          throw new Error(response.data?.message || 'Failed to load categories');
        }
      } catch (err: any) {
        if (isCancelled) return;
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAndSetCategories();

    // Cleanup function to set the flag if the component unmounts
    return () => {
        isCancelled = true;
    };
  // searchParams is now a dependency because we read it inside the effect
  }, [searchParams]);


  // handleSubmit (No changes needed)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setError(null);

    if (!title.trim()) { setSubmitError('Title is required'); return; }
    if (!content.trim()) { setSubmitError('Content is required'); return; }
    if (!selectedCategory) { setSubmitError('Please select a category'); return; }
    if (!currentUserId) { setSubmitError('You must be logged in to create a topic.'); return; }

    setIsSubmitting(true);

    try {
      const response = await api.forum.createTopic({
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory
      });

      if (response.data?.status === 'success') {
        setSubmitSuccess(true);
        const responseMessage = response.data?.data?.message || '';
        const isPendingApproval = response.data?.data?.topic?.status === 'pending' ||
                                  responseMessage.includes('moderation') ||
                                  responseMessage.includes('approval') ||
                                  (userRole !== 'admin' && userRole !== 'moderator' && response.data?.data?.topic?.status !== 'approved');
        setIsPending(isPendingApproval);

        if (!isPendingApproval && response.data?.data?.topic?._id) {
          setTimeout(() => {
            router.push(`/forum/topic/${response.data.data.topic._id}`);
          }, 1500);
        }
      } else {
        throw new Error(response.data?.message || "Failed to create topic.");
      }
    } catch (err: any) {
      console.error('Error creating topic:', err);
      let errorMessage = `Failed to create topic: ${err.message || 'Unknown error'}`;
      if (err.response?.data?.message) {
        errorMessage = `Failed to create topic: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
        const errorDetails = Object.values(err.response.data.errors).map((e: any) => e.message).join(', ');
        errorMessage = `Validation failed: ${errorDetails}`;
      }
      setSubmitError(errorMessage);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render markdown preview function
  const renderPreview = () => {
    let formattedContent = content
      .replace(/</g, "<").replace(/>/g, ">")
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');
    return { __html: formattedContent };
  };


  // Background animation elements
  const backgroundElements = (
     <div id="new-topic-page-background" className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
       {/* ... all the floating icons ... */}
       <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
       <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
       <div className="absolute top-[61%] left-[27%] text-green-500 dark:text-green-400 text-8xl opacity-75 floating-icon-slow">∞</div>
       <div className="absolute top-[19%] right-[38%] text-red-500 dark:text-red-400 text-11xl opacity-65 floating-icon">⚛</div>
       <div className="absolute top-[77%] right-[23%] text-yellow-500 dark:text-yellow-400 text-9xl opacity-70 floating-icon-slow">𝜙</div>
       <div className="absolute bottom-[31%] left-[8%] text-indigo-500 dark:text-indigo-400 text-10xl opacity-70 floating-icon-reverse">∫</div>
       <div className="absolute bottom-[12%] right-[42%] text-teal-500 dark:text-teal-400 text-9xl opacity-75 floating-icon">≈</div>
       <div className="absolute bottom-[47%] right-[9%] text-pink-500 dark:text-pink-400 text-8xl opacity-65 floating-icon-slow">±</div>
       <div className="absolute top-[23%] left-[54%] text-fuchsia-500 dark:text-fuchsia-400 text-8xl opacity-70 floating-icon">Δ</div>
       <div className="absolute top-[44%] left-[38%] text-emerald-500 dark:text-emerald-400 text-7xl opacity-65 floating-icon-slow">λ</div>
       <div className="absolute top-[81%] left-[67%] text-cyan-500 dark:text-cyan-400 text-9xl opacity-70 floating-icon-reverse">θ</div>
       <div className="absolute top-[29%] left-[83%] text-rose-500 dark:text-rose-400 text-8xl opacity-65 floating-icon">α</div>
       <div className="absolute bottom-[63%] left-[6%] text-amber-500 dark:text-amber-400 text-9xl opacity-70 floating-icon-slow">β</div>
       <div className="absolute bottom-[19%] left-[71%] text-purple-500 dark:text-purple-400 text-8xl opacity-65 floating-icon-reverse">μ</div>
       <div className="absolute bottom-[28%] left-[32%] text-blue-500 dark:text-blue-400 text-7xl opacity-70 floating-icon">ω</div>
       <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
       <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
       <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
       <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>
       <div className="absolute bottom-[53%] left-[24%] text-emerald-500 dark:text-emerald-400 text-5xl opacity-65 floating-icon-slow">v=λf</div>
       <div className="absolute top-[86%] left-[11%] text-sky-500 dark:text-sky-400 text-5xl opacity-55 floating-icon-reverse">C₆H₁₂O₆</div>
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
     </div>
  );

  // --- Main component render ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {backgroundElements}

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium bg-white/90 dark:bg-gray-800/90 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-3 animate-fadeIn hover:shadow-lg transition-all duration-300">
          <ol className="flex items-center space-x-2">
            <li><Link href="/forum" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">Forum</Link></li>
            <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></li>
            <li><span className="text-purple-600 dark:text-purple-400 font-semibold">New Topic</span></li>
          </ol>
        </nav>

        {/* Loading state (for categories) */}
        {isLoading && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-filter backdrop-blur-sm rounded-xl shadow-xl p-12 mb-8 flex justify-center items-center animate-fadeIn">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading categories...</span>
          </div>
        )}

        {/* General Error state */}
        {error && !isLoading && (
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8 animate-fadeIn">
               <div className="flex items-center">
                 <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                 <p className="text-red-800 dark:text-red-200">{error}</p>
               </div>
               {/* Avoid window access if possible, maybe use router.refresh() or similar */}
               <button onClick={() => router.refresh()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300">
                 Try Again
               </button>
             </div>
        )}

        {/* Success Message & Pending Notification */}
        {submitSuccess && (
          <div className="mb-6 animate-fadeIn">
             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-4 shadow-md">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Topic submitted successfully!</h3>
                  {!isPending && <p className="text-green-700 dark:text-green-400 mt-1">Redirecting you to your new topic...</p>}
                </div>
              </div>
            </div>
            {isPending && <PendingNotification type="topic" />}
            {isPending && (
                 <div className="mt-4 text-center">
                    <Link
                        href="/forum"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Forum
                    </Link>
                 </div>
            )}
          </div>
        )}

        {/* === Main Form Card === */}
        {!isLoading && !error && !submitSuccess && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-filter backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 animate-fadeIn">
             <div className="p-0.5 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800"></div>
             <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center text-shadow">
                <Layout className="h-6 w-6 mr-3 text-purple-500 dark:text-purple-400" /> Create a New Topic
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Share your question or start a discussion with the community</p>
            </div>

            {/* Form Content Area */}
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
                      className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200 shadow-sm hover:shadow focus:shadow-md"
                      placeholder="Enter a clear, specific title for your topic"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isSubmitting}
                      maxLength={100}
                      required
                    />
                    <div className="absolute top-3 left-3 text-gray-400 dark:text-gray-500 pointer-events-none">
                      <Edit className="h-5 w-5" />
                    </div>
                  </div>
                   <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                      <span>Max 100 characters. Be specific!</span>
                      <span className={title.length >= 90 ? 'font-semibold text-orange-600 dark:text-orange-400' : ''}>{title.length}/100</span>
                    </div>
                </div>

                {/* Category selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {categories.map((cat, index) => {
                        const styles = (cat.color && cat.lightBg && cat.iconName)
                                        ? cat as ForumCategory & { color: string; lightBg: string; iconName: string }
                                        : { ...cat, ...getCategoryStyles(cat.name) };
                        return (
                          <div
                            key={cat._id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 flex items-center animate-fadeIn transform hover:scale-105 hover:shadow-md ${
                              selectedCategory === cat._id
                                ? `${styles.lightBg} border-${styles.color}-300 shadow-sm dark:border-${styles.color}-700 ring-2 ring-${styles.color}-500/50 dark:ring-${styles.color}-600/50`
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                            onClick={() => !isSubmitting && setSelectedCategory(cat._id)}
                          >
                            <div
                              className={`p-2 mr-3 rounded-md ${
                                selectedCategory === cat._id
                                  ? `bg-${styles.color}-100 text-${styles.color}-600 dark:bg-${styles.color}-900/30 dark:text-${styles.color}-400`
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              <SubjectIcon iconName={styles.iconName || 'book'} className="h-5 w-5" color={selectedCategory === cat._id ? styles.color : undefined} />
                            </div>
                            <div>
                              <span
                                className={`font-medium ${
                                  selectedCategory === cat._id ? `text-${styles.color}-700 dark:text-${styles.color}-300` : 'text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {cat.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    !isLoading && <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No categories available.
                    </div>
                  )}
                </div>

                {/* Editor Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-0">
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
                    } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => setActiveTab('preview')}
                    disabled={!content || isSubmitting}
                  >
                    Preview
                  </button>
                </div>

                {/* Editor Toolbar */}
                {activeTab === 'write' && (
                  <div className="flex items-center border-x border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-sm rounded-t-lg">
                      <div className="flex space-x-2">
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                        title="Bold (Ctrl+B)"
                        onClick={() => setContent(prev => prev + '**bold text**')}
                        disabled={isSubmitting}
                      > B </button>
                       <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                        title="Italic (Ctrl+I)"
                        onClick={() => setContent(prev => prev + '*italic text*')}
                        disabled={isSubmitting}
                      > I </button>
                       <button
                        type="button"
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                        title="Code"
                        onClick={() => setContent(prev => prev + '`code`')}
                        disabled={isSubmitting}
                      > {'<>'} </button>
                    </div>
                  </div>
                )}

                {/* Content input or preview */}
                <div className="mb-6">
                    {activeTab === 'write' ? (
                    <textarea
                      id="content"
                      name="content"
                      rows={10}
                      className={`w-full p-4 border border-gray-300 dark:border-gray-600 ${activeTab === 'write' ? 'border-t-0 rounded-b-lg' : 'rounded-lg'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-inner hover:shadow focus:shadow-lg`}
                      placeholder="Describe your question or topic..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={isSubmitting}
                      required
                    ></textarea>
                  ) : (
                    <div className="w-full p-4 min-h-[268px] border border-gray-300 dark:border-gray-600 rounded-b-lg bg-gray-50 dark:bg-gray-700/50 prose dark:prose-invert prose-sm max-w-none animate-fadeIn">
                      {content ? (
                        <div dangerouslySetInnerHTML={renderPreview()} />
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">Nothing to preview yet.</p>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800/40 transform hover:scale-105">Tip: Use **bold**</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800/40 transform hover:scale-105">Use *italic*</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800/40 transform hover:scale-105">Use `code`</span>
                  </div>
                </div>

                {/* Submit error */}
                {submitError && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm animate-fadeIn flex items-center">
                     <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/> {submitError}
                  </div>
                )}

                {/* Submit buttons area */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800 flex items-start hover:shadow-md transition-all duration-200 transform hover:scale-101 flex-1 min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span><span className="font-medium">Tip:</span> Be specific and provide context to get better answers faster.</span>
                  </div>
                  <div className="flex space-x-3 self-end sm:self-center flex-shrink-0">
                    <Link
                      href="/forum"
                      className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center hover:shadow transform hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !content.trim() || !selectedCategory}
                      className={`px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 dark:from-purple-600 dark:to-purple-800 dark:hover:from-purple-700 dark:hover:to-purple-900 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center transform hover:translate-y-[-2px] active:translate-y-[1px] ${
                        isSubmitting || !title.trim() || !content.trim() || !selectedCategory ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> Creating...
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

            {/* Posting Guidelines */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/60 dark:to-gray-800/80 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 text-shadow">Posting Guidelines:</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-7">
                <li className="flex items-start group hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Make sure your question hasn't been asked before by using the search function.</span>
                </li>
                <li className="flex items-start group hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Be clear and concise in your title and description.</span>
                </li>
                 <li className="flex items-start group hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>For math equations, use proper formatting (surround with $ for inline or $$ for block).</span>
                </li>
                <li className="flex items-start group hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Be respectful and considerate of other community members.</span>
                </li>
              </ul>
            </div>
          </div> /* End of Main Form Card */
        )}

        {/* Quick Help Section */}
        {!isLoading && !error && !submitSuccess && (
          <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-filter backdrop-blur-sm rounded-xl shadow-xl overflow-hidden animate-fadeIn hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50" style={{ animationDelay: '0.2s' }}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 text-shadow">Quick Help</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 hover:shadow-md transform hover:scale-102 transition-all duration-300">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">How to ask good questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn the art of asking questions that get fast, helpful answers.</p>
                  <Link href="/guides/asking-questions" className="mt-2 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 group">
                    <span className="group-hover:underline">Read guide</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 hover:shadow-md transform hover:scale-102 transition-all duration-300">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Formatting your content</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to format text, code, and equations in your posts.</p>
                  <Link href="/guides/formatting-help" className="mt-2 inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 group">
                    <span className="group-hover:underline">See examples</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div> {/* End of max-w-3xl container */}

      {/* Global styles */}
      <style jsx global>{`
        /* ... All the keyframes and global styles ... */
         .text-10xl { font-size: 9rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .text-11xl { font-size: 10rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .floating-icon { animation: float 6s ease-in-out infinite; filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1)); }
        .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1)); }
        .floating-icon-slow { animation: float 10s ease-in-out infinite; filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1)); }
        @keyframes float { 0% { transform: translateY(0) rotate(0deg) scale(1); } 50% { transform: translateY(-15px) rotate(5deg) scale(1.05); } 100% { transform: translateY(0) rotate(0deg) scale(1); } }
        @keyframes float-reverse { 0% { transform: translateY(0) rotate(0deg) scale(1); } 50% { transform: translateY(15px) rotate(-5deg) scale(1.05); } 100% { transform: translateY(0) rotate(0deg) scale(1); } }
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.98); } }
        .animate-fadeIn, .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .text-shadow { text-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); }
        .dark .text-shadow { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .animated-gradient { background-size: 400% 400%; animation: gradient-shift 8s ease infinite; }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-border { position: relative; overflow: hidden; }
        .animated-border::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 3s infinite; }
        @keyframes shine { 0% { left: -100%; } 50% { left: 100%; } 100% { left: 100%; } }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(229, 231, 235, 0.5); border-radius: 10px; }
        .dark ::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.6); border-radius: 10px; }
        .dark ::-webkit-scrollbar-thumb { background: rgba(107, 114, 128, 0.6); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(107, 114, 128, 0.8); }
        .dark ::-webkit-scrollbar-thumb:hover { background: rgba(75, 85, 99, 0.8); }
        *:focus-visible { outline: 2px solid #A78BFA; outline-offset: 2px; box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3); border-radius: 4px; }
        .backdrop-filter { backdrop-filter: blur(12px); }
        input:focus, textarea:focus, select:focus { transform: translateY(-1px) scale(1.01); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .transform.hover\:scale-105 { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .transform.hover\:translate-y-\[-2px\] { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover\:scale-102:hover { transform: scale(1.02); }
        .hover\:scale-101:hover { transform: scale(1.01); }
        textarea { transition: all 0.3s ease; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05); }
        @keyframes widthGrow { from { width: 0%; } to { width: var(--target-width, 100%); } }
        .animate-widthGrow { animation: widthGrow 1s ease-out forwards; }

        /* Prose styles for preview */
        .prose code::before, .prose code::after { content: none; }
        .prose strong { color: inherit; }
        .prose em { color: inherit; }

        /* JIT Hints for dynamic classes */
        .bg-red-100.text-red-800.dark\\:bg-red-900\\/30.dark\\:text-red-300.border-red-300.dark\\:border-red-700.ring-red-500\\/50.dark\\:ring-red-600\\/50.text-red-700.dark\\:text-red-300.bg-red-50.dark\\:bg-red-900\\/20 {}
        .bg-orange-100.text-orange-800.dark\\:bg-orange-900\\/30.dark\\:text-orange-300.border-orange-300.dark\\:border-orange-700.ring-orange-500\\/50.dark\\:ring-orange-600\\/50.text-orange-700.dark\\:text-orange-300.bg-orange-50.dark\\:bg-orange-900\\/20 {}
        .bg-yellow-100.text-yellow-800.dark\\:bg-yellow-900\\/30.dark\\:text-yellow-300.border-yellow-300.dark\\:border-yellow-700.ring-yellow-500\\/50.dark\\:ring-yellow-600\\/50.text-yellow-700.dark\\:text-yellow-300.bg-yellow-50.dark\\:bg-yellow-900\\/20 {}
        .bg-green-100.text-green-800.dark\\:bg-green-900\\/30.dark\\:text-green-300.border-green-300.dark\\:border-green-700.ring-green-500\\/50.dark\\:ring-green-600\\/50.text-green-700.dark\\:text-green-300.bg-green-50.dark\\:bg-green-900\\/20 {}
        .bg-blue-100.text-blue-800.dark\\:bg-blue-900\\/30.dark\\:text-blue-300.border-blue-300.dark\\:border-blue-700.ring-blue-500\\/50.dark\\:ring-blue-600\\/50.text-blue-700.dark\\:text-blue-300.bg-blue-50.dark\\:bg-blue-900\\/20 {}
        .bg-purple-100.text-purple-800.dark\\:bg-purple-900\\/30.dark\\:text-purple-300.border-purple-300.dark\\:border-purple-700.ring-purple-500\\/50.dark\\:ring-purple-600\\/50.text-purple-700.dark\\:text-purple-300.bg-purple-50.dark\\:bg-purple-900\\/20 {}
        .bg-pink-100.text-pink-800.dark\\:bg-pink-900\\/30.dark\\:text-pink-300.border-pink-300.dark\\:border-pink-700.ring-pink-500\\/50.dark\\:ring-pink-600\\/50.text-pink-700.dark\\:text-pink-300.bg-pink-50.dark\\:bg-pink-900\\/20 {}
        .bg-teal-100.text-teal-800.dark\\:bg-teal-900\\/30.dark\\:text-teal-300.border-teal-300.dark\\:border-teal-700.ring-teal-500\\/50.dark\\:ring-teal-600\\/50.text-teal-700.dark\\:text-teal-300.bg-teal-50.dark\\:bg-teal-900\\/20 {}
        .bg-gray-100.text-gray-800.dark\\:bg-gray-900\\/30.dark\\:text-gray-300.border-gray-300.dark\\:border-gray-700.ring-gray-500\\/50.dark\\:ring-gray-600\\/50.text-gray-700.dark\\:text-gray-300.bg-gray-50.dark\\:bg-gray-900\\/20 {}

      `}</style>
    </div>
  );
}


// --- Wrapper Component with Suspense ---
export default function NewTopicPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewTopicFormContent />
    </Suspense>
  );
}