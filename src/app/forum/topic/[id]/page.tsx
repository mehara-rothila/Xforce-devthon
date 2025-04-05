"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '../../../DarkModeContext';
import axios from 'axios';

// Define API base URL
const API_URL = 'http://localhost:5000/api';

// Type definitions
interface ForumCategory {
  _id: string;
  name: string;
  color?: string;
}

interface ForumTopic {
  _id: string;
  title: string;
  content: string;
  category: ForumCategory;
  author: {
    _id: string;
    name: string;
  };
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  _id: string;
  content: string;
  topic: string;
  author: {
    _id: string;
    name: string;
  };
  isBestAnswer: boolean;
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TopicPage({ params }: { params: { id: string } }) {
  // Get topic ID from params
  const topicId = params.id;
  
  // Get dark mode context
  const { isDarkMode } = useDarkMode();
  
  // State for hover effects
  const [hoveredReply, setHoveredReply] = useState<string | null>(null);
  
  // State for reply form
  const [replyContent, setReplyContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State for API data
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
  // Mock user ID for development (would come from auth context in production)
  const currentUserId = '64f070a6018c0c66ee419799';
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to get time elapsed since post
  const getTimeElapsed = (dateString: string) => {
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

  // Get category styles based on category name
  const getCategoryStyles = (categoryName: string = '') => {
    switch(categoryName) {
      case 'Physics Discussions':
        return {
          color: 'blue',
          badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10'
        };
      case 'Chemistry Corner':
        return {
          color: 'green',
          badgeBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/10'
        };
      case 'Mathematics Hub':
        return {
          color: 'yellow',
          badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
        };
      case 'Study Tips & Tricks':
        return {
          color: 'red',
          badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          hoverBg: 'hover:bg-red-50 dark:hover:bg-red-900/10'
        };
      case 'Exam Preparation':
        return {
          color: 'orange',
          badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
          hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10'
        };
      default:
        return {
          color: 'purple',
          badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
          hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/10'
        };
    }
  };

  // Fetch topic and replies data
  useEffect(() => {
    const fetchTopicData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch topic details
        const topicResponse = await axios.get(`${API_URL}/forum/topics/${topicId}`);
        
        if (topicResponse.data.success) {
          setTopic(topicResponse.data.data.topic);
          setReplies(topicResponse.data.data.replies || []);
        } else {
          setError('Failed to fetch topic data');
        }
      } catch (err) {
        console.error('Error fetching topic data:', err);
        setError('Error connecting to the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopicData();
  }, [topicId]);

  // Handle reply submission
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (replyContent.trim() === '') {
      setSubmitError('Reply content cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const response = await axios.post(`${API_URL}/forum/topics/${topicId}/replies`, {
        content: replyContent
      }, {
        headers: {
          'Authorization': `Bearer mock-token-for-user-${currentUserId}`
        }
      });
      
      if (response.data.success) {
        // Add new reply to the list
        const newReply = response.data.data;
        newReply.author = { _id: currentUserId, name: 'You' }; // Temporary for UI display
        
        setReplies([...replies, newReply]);
        setReplyContent('');
        setSubmitSuccess(true);
        
        // Update topic's reply count
        if (topic) {
          setTopic({
            ...topic,
            repliesCount: (topic.repliesCount || 0) + 1
          });
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setSubmitError('Failed to submit reply');
      }
    } catch (err: any) {
      console.error('Error submitting reply:', err);
      setSubmitError(err.response?.data?.message || 'Error submitting reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle voting on a reply
  const handleVote = async (replyId: string, voteType: 'up' | 'down') => {
    try {
      const response = await axios.post(`${API_URL}/forum/replies/${replyId}/vote`, {
        vote: voteType
      }, {
        headers: {
          'Authorization': `Bearer mock-token-for-user-${currentUserId}`
        }
      });
      
      if (response.data.success) {
        // Update the reply in the list
        const updatedReplies = replies.map(reply => {
          if (reply._id === replyId) {
            // Update upvotes and downvotes lists
            if (voteType === 'up') {
              const alreadyUpvoted = reply.upvotes.includes(currentUserId);
              const upvotes = alreadyUpvoted
                ? reply.upvotes.filter(id => id !== currentUserId)
                : [...reply.upvotes, currentUserId];
              
              const downvotes = reply.downvotes.filter(id => id !== currentUserId);
              
              return { ...reply, upvotes, downvotes };
            } else {
              const alreadyDownvoted = reply.downvotes.includes(currentUserId);
              const downvotes = alreadyDownvoted
                ? reply.downvotes.filter(id => id !== currentUserId)
                : [...reply.downvotes, currentUserId];
              
              const upvotes = reply.upvotes.filter(id => id !== currentUserId);
              
              return { ...reply, upvotes, downvotes };
            }
          }
          return reply;
        });
        
        setReplies(updatedReplies);
      }
    } catch (err) {
      console.error('Error voting on reply:', err);
    }
  };

  // Handle marking a reply as best answer
  const handleMarkBestAnswer = async (replyId: string) => {
    try {
      const response = await axios.patch(`${API_URL}/forum/replies/${replyId}/best`, {}, {
        headers: {
          'Authorization': `Bearer mock-token-for-user-${currentUserId}`
        }
      });
      
      if (response.data.success) {
        // Update all replies (reset previous best answer and set new one)
        const updatedReplies = replies.map(reply => ({
          ...reply,
          isBestAnswer: reply._id === replyId
        }));
        
        setReplies(updatedReplies);
      }
    } catch (err) {
      console.error('Error marking best answer:', err);
    }
  };
  
  // Get category style
  const categoryStyle = topic ? getCategoryStyles(topic.category?.name) : getCategoryStyles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Show loading state */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading topic...</span>
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

        {!isLoading && !error && topic && (
          <>
            {/* Navigation and Topic Info */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Link href="/forum" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200">
                  Forums
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link 
                  href={`/forum/category/${topic.category?._id}`} 
                  className={`text-${categoryStyle.color}-600 dark:text-${categoryStyle.color}-400 hover:text-${categoryStyle.color}-700 dark:hover:text-${categoryStyle.color}-300 transition-colors duration-200`}
                >
                  {topic.category?.name || 'Unknown Category'}
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-gray-200 font-medium truncate">
                  {topic.title}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {topic.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.badgeBg}`}>
                  {topic.category?.name || 'Unknown Category'}
                </span>
                {topic.isPinned && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Pinned
                  </span>
                )}
                {topic.isLocked && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Locked
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-lg font-medium mr-2">
                    {topic.author?.name?.charAt(0) || '?'}
                  </div>
                  <span className="font-medium">{topic.author?.name || 'Unknown'}</span>
                </div>
                <span className="mx-2">•</span>
                <span>{formatDate(topic.createdAt)}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{topic.views || 0} views</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{replies.length} replies</span>
                </div>
              </div>
            </div>
            
            {/* Topic Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-pre:p-4 prose-pre:rounded-lg">
                  {/* This is where topic content would be rendered, potentially as HTML/Markdown */}
                  <div dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
            
            {/* Replies */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Replies ({replies.length})
              </h2>
              
              {replies.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No replies yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to reply to this topic!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {replies.map((reply) => (
                    <div 
                      key={reply._id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                        reply.isBestAnswer 
                          ? 'ring-2 ring-green-500 dark:ring-green-600' 
                          : ''
                      } ${
                        hoveredReply === reply._id 
                          ? `${categoryStyle.hoverBg}` 
                          : ''
                      }`}
                      onMouseEnter={() => setHoveredReply(reply._id)}
                      onMouseLeave={() => setHoveredReply(null)}
                    >
                      {reply.isBestAnswer && (
                        <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-green-700 dark:text-green-300 font-medium">Best Answer</span>
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-lg font-medium mr-3">
                              {reply.author?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {reply.author?.name || 'Unknown'}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {getTimeElapsed(reply.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* Only show if user is topic author and reply is not already best answer */}
                            {topic.author?._id === currentUserId && !reply.isBestAnswer && (
                              <button
                                onClick={() => handleMarkBestAnswer(reply._id)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-800/40 transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mark as Best
                              </button>
                            )}
                            
                            {/* Vote buttons */}
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                              <button
                                onClick={() => handleVote(reply._id, 'up')}
                                className={`p-2 rounded-l-lg ${
                                  reply.upvotes.includes(currentUserId)
                                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                } transition-colors duration-200`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <span className="px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {reply.upvotes.length - reply.downvotes.length}
                              </span>
                              <button
                                onClick={() => handleVote(reply._id, 'down')}
                                className={`p-2 rounded-r-lg ${
                                  reply.downvotes.includes(currentUserId)
                                    ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                } transition-colors duration-200`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="prose dark:prose-invert max-w-none">
                          {/* This is where reply content would be rendered, potentially as HTML/Markdown */}
                          <div dangerouslySetInnerHTML={{ __html: reply.content.replace(/\n/g, '<br />') }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Reply Form */}
            {!topic.isLocked && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Leave a Reply
                  </h2>
                  
                  <form onSubmit={handleSubmitReply}>
                    <div className="mb-4">
                      <textarea
                        rows={6}
                        placeholder="Write your reply here..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                    
                    {submitError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                        {submitError}
                      </div>
                    )}
                    
                    {submitSuccess && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
                        Your reply has been posted successfully!
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Post Reply
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
            
            {/* Locked Topic Message */}
            {topic.isLocked && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-1">This topic is locked</h3>
                  <p className="text-yellow-700 dark:text-yellow-400">New replies are no longer allowed for this conversation.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}