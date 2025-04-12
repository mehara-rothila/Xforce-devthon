// admin/ForumModeration.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { Check, X, AlertCircle, Eye, Clock, Loader2, MessageSquare, FileText, Shield } from 'lucide-react'; // Added Shield for consistency

// --- Interfaces ---
interface Author {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  color?: string;
}

interface Topic {
  _id: string;
  title: string;
  content: string;
  author: Author;
  category: Category;
  createdAt: string;
}

interface Reply {
  _id: string;
  content: string;
  author: Author;
  topic: {
    _id: string;
    title: string;
    category: Category;
  };
  createdAt: string;
}

interface ContentModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

interface RejectModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isRejectingTopic: boolean;
}

// *** ADDED: Interface for the props ForumModeration will receive ***
interface ForumModerationProps {
  isPreviewMode: boolean;
}

// --- Sub-Components (ContentModal, RejectModal - unchanged) ---

// Content preview modal component
const ContentModal: React.FC<ContentModalProps> = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-auto flex-grow">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
          />
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// Rejection reason modal component
const RejectModal: React.FC<RejectModalProps> = ({ onConfirm, onCancel, isRejectingTopic }) => {
  const [reason, setReason] = useState<string>('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Reject {isRejectingTopic ? 'Topic' : 'Reply'}
          </h3>
        </div>
        <div className="p-4">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Please provide a reason why this {isRejectingTopic ? 'topic' : 'reply'} is being rejected.
            This content will be removed from the system.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className={`px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors ${!reason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Moderation Component ---
// *** UPDATED: Accept props and destructure isPreviewMode ***
const ForumModeration: React.FC<ForumModerationProps> = ({ isPreviewMode }) => {
  // State (unchanged)
  const [activeTab, setActiveTab] = useState<'topics' | 'replies'>('topics');
  const [pendingTopics, setPendingTopics] = useState<Topic[]>([]);
  const [pendingReplies, setPendingReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{ title: string, content: string } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string, isRejectingTopic: boolean } | null>(null);
  const [processingItems, setProcessingItems] = useState<Record<string, boolean>>({});

  // Helper function (unchanged)
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch functions (unchanged logic, but added preview mode check before API calls if needed - though usually not necessary for fetches)
  const fetchPendingTopics = useCallback(async () => {
    // if (isPreviewMode) { setIsLoading(false); setPendingTopics([]); return; } // Optional: prevent fetch in preview
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.forum.getPendingTopics();
      if (response.data?.status === 'success') {
        setPendingTopics(response.data.data.topics || []);
      } else {
        setPendingTopics([]);
        setError('Failed to fetch pending topics');
      }
    } catch (err: any) {
      console.error('Error fetching pending topics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch pending topics - please check if the moderation endpoint is correctly implemented on the backend');
      setPendingTopics([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed isPreviewMode dependency unless you prevent fetch

  const fetchPendingReplies = useCallback(async () => {
    // if (isPreviewMode) { setIsLoading(false); setPendingReplies([]); return; } // Optional: prevent fetch in preview
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.forum.getPendingReplies();
      if (response.data?.status === 'success') {
        setPendingReplies(response.data.data.replies || []);
      } else {
        setPendingReplies([]);
        setError('Failed to fetch pending replies');
      }
    } catch (err: any) {
      console.error('Error fetching pending replies:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch pending replies - please check if the moderation endpoint is correctly implemented on the backend');
      setPendingReplies([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed isPreviewMode dependency unless you prevent fetch

  // Initial fetch (unchanged)
  useEffect(() => {
    if (activeTab === 'topics') {
      fetchPendingTopics();
    } else {
      fetchPendingReplies();
    }
  }, [activeTab, fetchPendingTopics, fetchPendingReplies]);

  // --- Action Handlers (Added isPreviewMode check) ---

  const showPreviewAlert = () => {
    alert("Action disabled in preview mode.");
  };

  // Handle approve topic
  const handleApproveTopic = async (topicId: string) => {
    if (isPreviewMode) { showPreviewAlert(); return; } // *** ADDED PREVIEW CHECK ***
    try {
      setProcessingItems(prev => ({ ...prev, [topicId]: true }));
      const response = await api.forum.approveTopic(topicId);
      if (response.data?.status === 'success') {
        setPendingTopics(prev => prev.filter(topic => topic._id !== topicId));
      } else {
        setError('Failed to approve topic');
      }
    } catch (err: any) {
      console.error('Error approving topic:', err);
      setError(err.response?.data?.message || err.message || 'Failed to approve topic');
    } finally {
      setProcessingItems(prev => ({ ...prev, [topicId]: false }));
    }
  };

  // Handle reject topic
  const handleRejectTopic = async (topicId: string, reason: string) => {
    if (isPreviewMode) { showPreviewAlert(); return; } // *** ADDED PREVIEW CHECK ***
    try {
      setProcessingItems(prev => ({ ...prev, [topicId]: true }));
      const response = await api.forum.rejectTopic(topicId, reason);
      if (response.data?.status === 'success') {
        setPendingTopics(prev => prev.filter(topic => topic._id !== topicId));
        setRejectModal(null);
      } else {
        setError('Failed to reject topic');
      }
    } catch (err: any) {
      console.error('Error rejecting topic:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reject topic');
    } finally {
      setProcessingItems(prev => ({ ...prev, [topicId]: false }));
    }
  };

  // Handle approve reply
  const handleApproveReply = async (replyId: string) => {
    if (isPreviewMode) { showPreviewAlert(); return; } // *** ADDED PREVIEW CHECK ***
    try {
      setProcessingItems(prev => ({ ...prev, [replyId]: true }));
      const response = await api.forum.approveReply(replyId);
      if (response.data?.status === 'success') {
        setPendingReplies(prev => prev.filter(reply => reply._id !== replyId));
      } else {
        setError('Failed to approve reply');
      }
    } catch (err: any) {
      console.error('Error approving reply:', err);
      setError(err.response?.data?.message || err.message || 'Failed to approve reply');
    } finally {
      setProcessingItems(prev => ({ ...prev, [replyId]: false }));
    }
  };

  // Handle reject reply
  const handleRejectReply = async (replyId: string, reason: string) => {
    if (isPreviewMode) { showPreviewAlert(); return; } // *** ADDED PREVIEW CHECK ***
    try {
      setProcessingItems(prev => ({ ...prev, [replyId]: true }));
      const response = await api.forum.rejectReply(replyId, reason);
      if (response.data?.status === 'success') {
        setPendingReplies(prev => prev.filter(reply => reply._id !== replyId));
        setRejectModal(null);
      } else {
        setError('Failed to reject reply');
      }
    } catch (err: any) {
      console.error('Error rejecting reply:', err);
      setError(err.response?.data?.message || err.message || 'Failed to reject reply');
    } finally {
      setProcessingItems(prev => ({ ...prev, [replyId]: false }));
    }
  };

  // Helper function (unchanged)
  const getCategoryColorClass = (color?: string) => {
    if (!color) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    const colorName = color.includes('#') ?
      (
        color.includes('4299E1') ? 'blue' :
        color.includes('48BB78') ? 'green' :
        color.includes('ED8936') ? 'orange' :
        color.includes('9F7AEA') ? 'purple' :
        color.includes('F56565') ? 'red' :
        color.includes('ECC94B') ? 'yellow' :
        color.includes('38B2AC') ? 'teal' :
        color.includes('ED64A6') ? 'pink' :
        color.includes('667EEA') ? 'indigo' : 'gray'
      )
      : 'gray';
    return `bg-${colorName}-100 text-${colorName}-800 dark:bg-${colorName}-900/30 dark:text-${colorName}-300`;
  };

  // --- Render ---
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
          {/* Using Shield icon for consistency with AdminDashboard tab */}
          <Shield className="h-6 w-6 mr-2 text-red-600 dark:text-red-400"/>
          Forum Moderation Queue
        </h2>
        {/* Optional: Add preview mode indicator */}
        {isPreviewMode && (
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center">
                <Eye className="h-4 w-4 mr-1" /> Preview Mode
            </span>
        )}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex p-1">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'topics'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            } transition-colors`}
          >
            <FileText className="h-4 w-4 inline mr-1" /> Topics
          </button>
          <button
            onClick={() => setActiveTab('replies')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'replies'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            } transition-colors`}
          >
            <MessageSquare className="h-4 w-4 inline mr-1" /> Replies
          </button>
        </div>
      </div>

      {/* Error message (unchanged) */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Loading state (unchanged) */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 text-cyan-600 dark:text-cyan-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading pending {activeTab}...
          </p>
        </div>
      )}

      {/* Topic moderation */}
      {!isLoading && activeTab === 'topics' && (
        <>
          {pendingTopics.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/20 rounded-lg border border-gray-100 dark:border-gray-700">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No pending topics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All forum topics have been moderated
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Author</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pendingTopics.map(topic => (
                    <tr key={topic._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                          {topic.title}
                        </div>
                        <div className="mt-1 flex items-center">
                          <button
                            onClick={() => setModalContent({ title: topic.title, content: topic.content })}
                            className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center hover:underline"
                          >
                            <Eye className="h-3 w-3 mr-1" /> View content
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {topic.author.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColorClass(topic.category.color)}`}>
                          {topic.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(topic.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApproveTopic(topic._id)}
                            // *** UPDATED: Disable button if preview mode OR processing ***
                            disabled={isPreviewMode || processingItems[topic._id]}
                            className={`p-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors ${isPreviewMode || processingItems[topic._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isPreviewMode ? "Disabled in preview" : "Approve"}
                          >
                            {processingItems[topic._id] ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Check className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => !isPreviewMode && setRejectModal({ id: topic._id, isRejectingTopic: true })} // Prevent opening modal in preview
                            // *** UPDATED: Disable button if preview mode OR processing ***
                            disabled={isPreviewMode || processingItems[topic._id]}
                            className={`p-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors ${isPreviewMode || processingItems[topic._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isPreviewMode ? "Disabled in preview" : "Reject"}
                          >
                            {processingItems[topic._id] ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <X className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Reply moderation */}
      {!isLoading && activeTab === 'replies' && (
        <>
          {pendingReplies.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/20 rounded-lg border border-gray-100 dark:border-gray-700">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No pending replies
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All forum replies have been moderated
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Content</th>
                    <th className="px-4 py-3 text-left">Author</th>
                    <th className="px-4 py-3 text-left">Topic</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pendingReplies.map(reply => (
                    <tr key={reply._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                          {reply.content.substring(0, 100)}
                          {reply.content.length > 100 ? '...' : ''}
                        </div>
                        <div className="mt-1 flex items-center">
                          <button
                            onClick={() => setModalContent({ title: 'Reply Content', content: reply.content })}
                            className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center hover:underline"
                          >
                            <Eye className="h-3 w-3 mr-1" /> View full content
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {reply.author.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                          {reply.topic.title}
                        </div>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColorClass(reply.topic.category?.color)}`}>
                            {reply.topic.category?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(reply.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApproveReply(reply._id)}
                            // *** UPDATED: Disable button if preview mode OR processing ***
                            disabled={isPreviewMode || processingItems[reply._id]}
                            className={`p-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors ${isPreviewMode || processingItems[reply._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isPreviewMode ? "Disabled in preview" : "Approve"}
                          >
                            {processingItems[reply._id] ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Check className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => !isPreviewMode && setRejectModal({ id: reply._id, isRejectingTopic: false })} // Prevent opening modal in preview
                            // *** UPDATED: Disable button if preview mode OR processing ***
                            disabled={isPreviewMode || processingItems[reply._id]}
                            className={`p-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors ${isPreviewMode || processingItems[reply._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isPreviewMode ? "Disabled in preview" : "Reject"}
                          >
                            {processingItems[reply._id] ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <X className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Content preview modal (unchanged) */}
      {modalContent && (
        <ContentModal
          title={modalContent.title}
          content={modalContent.content}
          onClose={() => setModalContent(null)}
        />
      )}

      {/* Reject reason modal (unchanged) */}
      {rejectModal && (
        <RejectModal
          onConfirm={(reason) =>
            rejectModal.isRejectingTopic
              ? handleRejectTopic(rejectModal.id, reason)
              : handleRejectReply(rejectModal.id, reason)
          }
          onCancel={() => setRejectModal(null)}
          isRejectingTopic={rejectModal.isRejectingTopic}
        />
      )}
    </div>
  );
};

export default ForumModeration;