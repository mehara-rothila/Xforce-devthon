import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Eye, MessageCircle, User, Search, SortAsc, SortDesc, AlertCircle, Clock, Filter, X, Info, ChevronRight, PinIcon, Award } from 'lucide-react';

interface ForumTopic {
  _id: string;
  title: string;
  author: { _id: string; name: string; };
  views: number;
  repliesCount: number;
  createdAt: string;
}

interface TopicListProps {
  topics: ForumTopic[];
  onDeleteTopic: (topicId: string) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topics, onDeleteTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Animation on mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }) + ' today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get relative time label color based on date recency
  const getTimeColor = (dateString?: string): string => {
    if (!dateString) return 'text-gray-500';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) return 'text-green-600 dark:text-green-400';
      if (diffDays < 3) return 'text-blue-600 dark:text-blue-400';
      if (diffDays < 7) return 'text-indigo-600 dark:text-indigo-400';
      return 'text-gray-600 dark:text-gray-400';
    } catch (e) {
      return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Apply search and sorting
  const filteredTopics = topics
    .filter(topic => 
      searchTerm ? topic.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .sort((a, b) => {
      let fieldA: any = (a as any)[sortField];
      let fieldB: any = (b as any)[sortField];
      
      // Handle author name specifically
      if (sortField === 'author') {
        fieldA = a.author?.name || '';
        fieldB = b.author?.name || '';
      }
      
      // Handle dates
      if (sortField === 'createdAt') {
        fieldA = fieldA ? new Date(fieldA).getTime() : 0;
        fieldB = fieldB ? new Date(fieldB).getTime() : 0;
      }
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleDelete = (topicId: string) => {
    if (confirmDelete === topicId) {
      onDeleteTopic(topicId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(topicId);
      // Auto-cancel confirm after a delay
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Function to highlight the search term in the title
  const highlightSearchTerm = (title: string) => {
    if (!searchTerm) return title;
    
    const parts = title.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? 
            <span key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">{part}</span> : 
            part
        )}
      </>
    );
  };

  // Get random avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
      'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (topics.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-500 ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-30 dark:opacity-40 animate-pulse"></div>
            <div className="relative bg-gray-100 dark:bg-gray-700 p-6 rounded-full">
              <MessageCircle className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No topics found</h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">This category doesn't have any topics yet. Topics will appear here once they are created.</p>
        <div className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <Info className="h-4 w-4 mr-2" />
          <span>Try checking other categories</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${animateIn ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}>
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className={`relative flex-1 transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-indigo-300 dark:ring-indigo-700 rounded-lg' : ''}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
          </div>
          <input
            type="text"
            placeholder="Search topics by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10 pr-10 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm">
          <span className="text-sm text-gray-500 dark:text-gray-400 pl-2 flex items-center">
            <Filter className="h-4 w-4 mr-1.5" />
            Sort:
          </span>
          <select 
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setSortDirection('asc');
            }}
            className="text-sm border-0 rounded-md py-1.5 pl-2 pr-7 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-0 focus:outline-none"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              appearance: 'none'
            }}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="views">Views</option>
            <option value="repliesCount">Replies</option>
            <option value="createdAt">Date</option>
          </select>
          <button 
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.map((topic, index) => {
          const isRecent = new Date(topic.createdAt).getTime() > Date.now() - 86400000; // 24 hours
          const isPopular = topic.views > 50 || topic.repliesCount > 10;
          const timeColor = getTimeColor(topic.createdAt);
          const avatarColor = getAvatarColor(topic.author?.name || 'Unknown');
          const initials = (topic.author?.name || 'UN').split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase();
          
          return (
            <div 
              key={topic._id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-0.5 ${
                index === 0 && animateIn ? 'animate-slide-in-bottom' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5">
                <div className="flex items-start">
                  {/* Author Avatar */}
                  <div className={`flex-shrink-0 mr-4 w-10 h-10 rounded-full flex items-center justify-center ${avatarColor}`}>
                    {initials}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white break-words leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400" title={topic.title}>
                        {highlightSearchTerm(topic.title)}
                      </h3>
                      
                      {/* Badges */}
                      <div className="flex ml-2 space-x-1.5">
                        {isRecent && (
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                            <Clock className="h-3 w-3 mr-1" />
                            New
                          </span>
                        )}
                        {isPopular && (
                          <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                            <Award className="h-3 w-3 mr-1" />
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-1.5 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1">
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1.5" />
                        <span className="font-medium text-gray-900 dark:text-gray-200">{topic.author?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span className={timeColor}>{formatDate(topic.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center">
                        <div className="flex items-center text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                          <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-500 dark:text-blue-400" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{topic.views}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">views</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{topic.repliesCount}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">replies</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        confirmDelete === topic._id
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shadow-sm animate-pulse'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20'
                      }`}
                      title={confirmDelete === topic._id ? 'Click again to confirm delete' : `Delete topic: ${topic.title}`}
                    >
                      {confirmDelete === topic._id ? (
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 mr-1.5" />
                          <span className="text-xs font-medium">Confirm</span>
                        </div>
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Add subtle gradient border bottom */}
              <div className="h-0.5 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-indigo-900/40"></div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Info className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">
            Showing {filteredTopics.length} of {topics.length} topics
            {searchTerm && (
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                matching "<span className="font-medium text-indigo-600 dark:text-indigo-400">{searchTerm}</span>"
              </span>
            )}
          </span>
        </div>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm font-medium"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear search
          </button>
        )}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideInBottom {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-bottom {
          animation: slideInBottom 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default TopicList;