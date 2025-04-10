"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useDarkMode } from '../../../DarkModeContext';
import api from '@/utils/api'; // <-- Use shared API utility
import SubjectIcon from '@/components/icons/SubjectIcon'; // <-- Import shared icon component
import { ThumbsUp, ThumbsDown, Check, Award, X, Loader2, AlertCircle, List, MessageSquare } from 'lucide-react'; // <-- Import icons
import { useParams } from 'next/navigation'; // <-- Import useParams

// Type definitions
interface ForumCategory {
  _id: string;
  name: string;
  color?: string;
  icon?: string; // Expecting string name from backend
}

interface ForumTopic {
  _id: string;
  title: string;
  content: string;
  category: ForumCategory; // Expecting populated category
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
  upvotes: string[]; // Array of user IDs who upvoted
  downvotes: string[]; // Array of user IDs who downvoted
  createdAt: string;
  updatedAt: string;
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const topicId = params.id;
  const { isDarkMode } = useDarkMode();
  const [hoveredReply, setHoveredReply] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // --- State for Current User ID ---
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to get user ID from localStorage on client-side mount
    // In a real app, this would come from an auth context
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsedInfo = JSON.parse(userInfo);
                setCurrentUserId(parsedInfo?._id || 'mock-user-id'); // Use mock as fallback if needed
            } catch (e) {
                console.error("Error parsing user info from localStorage", e);
                setCurrentUserId('mock-user-id'); // Fallback
            }
        } else {
             // Fallback if only token exists but not user info
             setCurrentUserId('mock-user-id'); // Or null if login strictly required
        }
    }
  }, []);
  // ---

  // --- Helper Functions ---
  const formatDate = (dateString: string): string => {
     if (!dateString) return 'N/A';
     try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
     catch(e) { return "Invalid Date"; }
  };
  const getTimeElapsed = (dateString: string): string => {
    if (!dateString) return 'N/A';
     try {
        const now = new Date(); const date = new Date(dateString); const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (isNaN(seconds) || seconds < 0) return '?'; if (seconds < 60) return 'just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24); if (days < 7) return `${days}d ago`; const weeks = Math.floor(days / 7); if (weeks < 4) return `${weeks}w ago`; const months = Math.floor(days / 30); if (months < 12) return `${months}mo ago`; const years = Math.floor(days / 365); return `${years}y ago`;
    } catch (e) { console.error("Error formatting time elapsed:", dateString, e); return "Invalid date"; }
  };
  const getCategoryStyles = (categoryName: string = '') => {
    switch(categoryName?.toLowerCase()) {
      case 'physics discussions': return { color: 'blue', badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10' };
      case 'chemistry corner': return { color: 'green', badgeBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/10' };
      case 'mathematics hub': return { color: 'yellow', badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/10' };
      case 'study tips & tricks': return { color: 'red', badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', hoverBg: 'hover:bg-red-50 dark:hover:bg-red-900/10' };
      case 'exam preparation': return { color: 'orange', badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10' };
      default: return { color: 'purple', badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/10' };
    }
  };
  // ---

  // Fetch topic and replies data using api.js
  useEffect(() => {
    const fetchTopicData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.forum.getTopicById(topicId);
        if (response.data?.status === 'success') {
          setTopic(response.data.data.topic);
          setReplies(response.data.data.replies || []);
        } else {
          setError(response.data?.message || 'Failed to fetch topic data');
        }
      } catch (err: any) {
        console.error('Error fetching topic data:', err);
        setError(err.response?.data?.message || err.message || 'Error connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    };

    if (topicId) { fetchTopicData(); }
    else { setError("Invalid Topic ID"); setIsLoading(false); }
  }, [topicId]);

  // Handle reply submission using api.js
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) { setSubmitError('Reply content cannot be empty'); return; }
    if (!currentUserId) { setSubmitError('You must be logged in to reply.'); return; }

    setIsSubmittingReply(true); setSubmitError(null); setSubmitSuccess(false);

    try {
      // Use api.js function (auth token handled by interceptor)
      const response = await api.forum.addReply(topicId, { content: replyContent });

      if (response.data?.status === 'success' && response.data.data?.reply) {
        const newReply = response.data.data.reply;
        // Backend should populate author, but add fallback if needed
        if (!newReply.author) { newReply.author = { _id: currentUserId, name: 'You' }; }
        setReplies(prevReplies => [...prevReplies, newReply]);
        setReplyContent('');
        setSubmitSuccess(true);
        if (topic) { setTopic({ ...topic, repliesCount: (topic.repliesCount || 0) + 1 }); }
        setTimeout(() => { setSubmitSuccess(false); }, 3000);
      } else { throw new Error(response.data?.message || 'Failed to submit reply.'); }
    } catch (err: any) { console.error('Error submitting reply:', err); setSubmitError(err.response?.data?.message || err.message || 'Error submitting reply.'); }
    finally { setIsSubmittingReply(false); }
  };

  // Handle voting on a reply using api.js
  const handleVote = async (replyId: string, voteType: 'up' | 'down') => {
     if (!currentUserId) { alert('Please log in to vote.'); return; }
    try {
      // Use api.js function (auth token handled by interceptor)
      const response = await api.forum.voteReply(replyId, voteType);
      if (response.data?.status === 'success') {
        // Optimistic UI update
        setReplies(prevReplies => prevReplies.map(reply => {
            if (reply._id === replyId) {
                const updatedReply = { ...reply, upvotes: [...reply.upvotes], downvotes: [...reply.downvotes] };
                const userObjectId = currentUserId;
                const upIndex = updatedReply.upvotes.indexOf(userObjectId);
                const downIndex = updatedReply.downvotes.indexOf(userObjectId);
                if (voteType === 'up') { if (upIndex !== -1) { updatedReply.upvotes.splice(upIndex, 1); } else { updatedReply.upvotes.push(userObjectId); if (downIndex !== -1) updatedReply.downvotes.splice(downIndex, 1); } }
                else { if (downIndex !== -1) { updatedReply.downvotes.splice(downIndex, 1); } else { updatedReply.downvotes.push(userObjectId); if (upIndex !== -1) updatedReply.upvotes.splice(upIndex, 1); } }
                return updatedReply;
            } return reply;
        }));
      } else { console.error("Vote failed:", response.data?.message); alert(`Vote failed: ${response.data?.message || 'Unknown error'}`); }
    } catch (err: any) { console.error('Error voting on reply:', err); alert(`Error voting: ${err.response?.data?.message || err.message}`); }
  };

  // Handle marking a reply as best answer using api.js
  const handleMarkBestAnswer = async (replyId: string) => {
     if (!currentUserId) { alert('Please log in.'); return; }
     if (!topic || topic.author?._id !== currentUserId) { alert('Only the topic author can mark the best answer.'); return; }
    try {
      // Use api.js function (auth token handled by interceptor)
      const response = await api.forum.markBestAnswer(replyId);
      if (response.data?.status === 'success') {
        const newlyMarkedReplyId = response.data.data?.reply?._id;
        const isNowBest = response.data.data?.reply?.isBestAnswer;
        setReplies(prevReplies => prevReplies.map(reply => ({ ...reply, isBestAnswer: newlyMarkedReplyId ? reply._id === newlyMarkedReplyId && isNowBest : (reply._id === replyId ? !reply.isBestAnswer : false) })));
      } else { console.error("Mark best answer failed:", response.data?.message); alert(`Error: ${response.data?.message || 'Could not mark best answer.'}`); }
    } catch (err: any) { console.error('Error marking best answer:', err); alert(`Error marking best answer: ${err.response?.data?.message || err.message}`); }
  };

  // --- Render Logic ---
  if (isLoading) { return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>; }
  if (error) { return <div className="min-h-screen flex flex-col justify-center items-center text-center p-4"><AlertCircle className="h-12 w-12 text-red-500 mb-4"/><p className="text-red-600 dark:text-red-400 mb-4">{error}</p><Link href="/forum" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Back to Forums</Link></div>; }
  if (!topic) { return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">Topic not found.</div>; }

  // Calculate styles only when topic is available
  const categoryStyle = getCategoryStyles(topic.category?.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Enhanced background with mathematical/scientific elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" id="topic-page-background">
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

        {/* Science formulas */}
        <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
        <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
        <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
        <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>

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
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 relative z-10">
          <>
              {/* Navigation and Topic Info */}
              <div className="mb-6 animate-fade-in">
                  <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Link href="/forum" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"> Forums </Link>
                      <span className="mx-2">/</span>
                      <Link href={`/forum/category/${topic.category?._id}`} className={`hover:underline`} style={{color: categoryStyle.color ? categoryStyle.color : 'inherit'}}> {topic.category?.name || 'Unknown Category'} </Link>
                      <span className="mx-2">/</span>
                      <span className="text-gray-900 dark:text-gray-200 font-medium truncate"> {topic.title} </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-shadow"> {topic.title} </h1>
                  <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${categoryStyle.badgeBg}`}> {topic.category?.name || 'Unknown Category'} </span>
                      <span className="inline-flex items-center"> <img src={`https://ui-avatars.com/api/?name=${topic.author?.name?.replace(/\s+/g, '+') || 'A'}&background=random&size=128`} alt={topic.author?.name || 'Author'} className="h-5 w-5 rounded-full mr-1.5"/> {topic.author?.name || 'Unknown'} </span>
                      <span>Started {getTimeElapsed(topic.createdAt)}</span>
                      <span>{topic.views || 0} views</span>
                      <span>{replies.length} replies</span>
                      {topic.isLocked && (<span className='text-red-600 dark:text-red-400 font-medium'>Locked</span>)}
                  </div>
              </div>

              {/* Topic Content */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                   <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-700 flex items-start space-x-4"> <img src={`https://ui-avatars.com/api/?name=${topic.author?.name?.replace(/\s+/g, '+') || 'A'}&background=random&size=128`} alt={topic.author?.name || 'Author'} className="h-10 w-10 rounded-full flex-shrink-0"/> <div className='flex-grow'> <p className="font-semibold text-gray-800 dark:text-gray-200">{topic.author?.name || 'Unknown'}</p> <p className="text-xs text-gray-500 dark:text-gray-400">Posted {formatDate(topic.createdAt)}</p> </div> </div> <div className="p-5 md:p-6"> <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base prose-img:rounded-lg prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-md"> <div dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, '<br />') }} /> </div> </div>
              </div>

              {/* Replies */}
              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-shadow"> Replies ({replies.length}) </h2>
                  {replies.length === 0 ? ( <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700"> <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4"> <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> </div> <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No replies yet</h3> <p className="text-gray-500 dark:text-gray-400 mb-4">Be the first to reply!</p> </div> )
                  : ( <div className="space-y-6"> {replies.map((reply, index) => ( <div key={reply._id} className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 border dark:border-gray-700 ${ reply.isBestAnswer ? 'border-green-400 dark:border-green-600 ring-2 ring-green-300 dark:ring-green-700' : 'border-gray-200' } ${ hoveredReply === reply._id ? `shadow-${categoryStyle.color}-200/50 dark:shadow-${categoryStyle.color}-900/30` : '' } animate-fade-in`} style={{ animationDelay: `${0.1 + index * 0.05}s` }} onMouseEnter={() => setHoveredReply(reply._id)} onMouseLeave={() => setHoveredReply(null)} > {reply.isBestAnswer && ( <div className="bg-green-100 dark:bg-green-900/40 px-4 py-1.5 border-b border-green-200 dark:border-green-700 flex items-center text-sm"> <Award className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" /> <span className="text-green-700 dark:text-green-300 font-medium">Best Answer</span> </div> )} <div className="p-5 md:p-6"> <div className="flex items-start space-x-4"> <img src={`https://ui-avatars.com/api/?name=${reply.author?.name?.replace(/\s+/g, '+') || 'R'}&background=random&size=128`} alt={reply.author?.name || 'Author'} className="h-10 w-10 rounded-full flex-shrink-0"/> <div className='flex-grow min-w-0'> <div className="flex justify-between items-center mb-2"> <div> <p className="font-semibold text-gray-800 dark:text-gray-200">{reply.author?.name || 'Unknown'}</p> <p className="text-xs text-gray-500 dark:text-gray-400">Replied {getTimeElapsed(reply.createdAt)}</p> </div> <div className="flex items-center space-x-2 flex-shrink-0"> {topic.author?._id === currentUserId && topicId === reply.topic && ( <button onClick={() => handleMarkBestAnswer(reply._id)} title={reply.isBestAnswer ? "Unmark as Best Answer" : "Mark as Best Answer"} className={`p-1.5 rounded-full transition-colors duration-200 ${reply.isBestAnswer ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-gray-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-gray-700 dark:hover:text-green-400'}`}> <Award className="h-5 w-5" /> </button> )} <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full"> <button onClick={() => handleVote(reply._id, 'up')} title="Upvote" className={`p-1.5 rounded-l-full ${ reply.upvotes.includes(currentUserId || '') ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600' } transition-colors duration-200`}> <ThumbsUp className="h-4 w-4" /> </button> <span className="px-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[24px] text-center"> {reply.upvotes.length - reply.downvotes.length} </span> <button onClick={() => handleVote(reply._id, 'down')} title="Downvote" className={`p-1.5 rounded-r-full ${ reply.downvotes.includes(currentUserId || '') ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600' } transition-colors duration-200`}> <ThumbsDown className="h-4 w-4" /> </button> </div> </div> </div> <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base mt-3"> <div dangerouslySetInnerHTML={{ __html: reply.content.replace(/\n/g, '<br />') }} /> </div> </div> </div> </div> </div> ))} </div> )}
              </div>

              {/* Reply Form */}
              {!topic.isLocked && ( <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in" style={{ animationDelay: '0.3s' }}> <div className="p-6 md:p-8"> <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-shadow"> Leave a Reply </h2> <form onSubmit={handleSubmitReply}> <div className="mb-4"> <textarea rows={6} placeholder="Write your reply here..." className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} disabled={isSubmittingReply} ></textarea> </div> {submitError && ( <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm animate-fade-in"> {submitError} </div> )} {submitSuccess && ( <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm animate-fade-in"> Your reply has been posted successfully! </div> )} <button type="submit" disabled={isSubmittingReply || !replyContent.trim()} className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 dark:from-purple-600 dark:to-purple-800 dark:hover:from-purple-700 dark:hover:to-purple-900 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center transform hover:translate-y-[-2px] active:translate-y-[1px] ${ isSubmittingReply || !replyContent.trim() ? 'opacity-70 cursor-not-allowed' : '' }`} > {isSubmittingReply ? ( <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /> Posting...</> ) : ( <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> Post Reply</> )} </button> </form> </div> </div> )}

              {/* Locked Topic Message */}
              {topic.isLocked && ( <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 flex items-start animate-fade-in" style={{ animationDelay: '0.3s' }}> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /> </svg> <div> <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-1">This topic is locked</h3> <p className="text-yellow-700 dark:text-yellow-400">New replies are no longer allowed for this conversation.</p> </div> </div> )}
          </>
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
        
        /* Avatar glow effect */
        img.rounded-full {
          transition: all 0.3s ease;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
        
        img.rounded-full:hover {
          box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.3);
          transform: scale(1.05);
        }
        
        /* Enhanced badge styles */
        .inline-flex.items-center.px-2.py-0\.5.rounded-full {
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .inline-flex.items-center.px-2.py-0\.5.rounded-full:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Best answer highlight animation */
        .border-green-400 {
          animation: pulse-green 2s infinite;
        }
        
        @keyframes pulse-green {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.2);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(72, 187, 120, 0.2);
          }
        }
        
        /* Enhanced vote button effects */
        button.rounded-l-full, button.rounded-r-full {
          transition: all 0.2s ease;
        }
        
        button.rounded-l-full:hover, button.rounded-r-full:hover {
          transform: scale(1.1);
        }
        
        /* Form inputs */
        textarea {
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        textarea:focus {
          box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
