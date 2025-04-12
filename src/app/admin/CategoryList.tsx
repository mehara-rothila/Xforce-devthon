import React, { useState } from 'react';
import { Edit, Trash2, List, MessageCircle, Calendar, Search, SortAsc, SortDesc, Filter, ChevronDown, Eye } from 'lucide-react';
import SubjectIcon from '@/components/icons/SubjectIcon';

interface ForumCategory {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  topicsCount?: number;
  postsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryListProps {
  categories: ForumCategory[];
  onEdit: (category: ForumCategory) => void;
  onDelete: (categoryId: string) => void;
  onViewTopics: (categoryId: string) => void;
  isPreviewMode?: boolean; // Added preview mode prop
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete, onViewTopics, isPreviewMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Apply filters and sorting
  const filteredCategories = categories
    .filter(category => 
      searchTerm ? category.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .sort((a, b) => {
      let fieldA: any = (a as any)[sortField];
      let fieldB: any = (b as any)[sortField];
      
      // Handle dates
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        fieldA = fieldA ? new Date(fieldA).getTime() : 0;
        fieldB = fieldB ? new Date(fieldB).getTime() : 0;
      }
      
      // Handle numeric values
      if (sortField === 'topicsCount' || sortField === 'postsCount') {
        fieldA = fieldA || 0;
        fieldB = fieldB || 0;
      }
      
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
            <MessageCircle className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No forum categories found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Create categories to organize forum discussions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 pb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-cyan-500 dark:focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
          <select 
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setSortDirection('asc');
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="name">Name</option>
            <option value="topicsCount">Topics Count</option>
            <option value="postsCount">Posts Count</option>
            <option value="createdAt">Created Date</option>
          </select>
          <button 
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-5 w-5" />
            ) : (
              <SortDesc className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div 
            key={category._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 animate-fadeIn"
            style={{ 
              borderLeftWidth: '4px',
              borderLeftColor: category.color || '#4a5568',
            }}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center mb-3">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${category.color || '#4a5568'}20` }}
                >
                  <SubjectIcon 
                    iconName={category.icon} 
                    color={category.color || '#4a5568'} 
                    className="h-6 w-6" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={category.name}>
                    {category.name}
                  </h3>
                </div>
              </div>
              
              {/* Description */}
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2" title={category.description}>
                {category.description || 'No description provided.'}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Topics</span>
                  <div className="flex items-center justify-center font-semibold">
                    <List className="h-4 w-4 mr-1 text-cyan-600 dark:text-cyan-400" />
                    {category.topicsCount || 0}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Posts</span>
                  <div className="flex items-center justify-center font-semibold">
                    <MessageCircle className="h-4 w-4 mr-1 text-cyan-600 dark:text-cyan-400" />
                    {category.postsCount || 0}
                  </div>
                </div>
              </div>
              
              {/* Footer with date and actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(category.createdAt)}
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => onViewTopics(category._id)}
                    className="p-1.5 rounded-md text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20 transition-colors"
                    title={`View Topics in ${category.name}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                  {isPreviewMode ? (
                    <button
                      disabled
                      className="p-1.5 rounded-md text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                      title="Preview mode - Editing disabled"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onEdit(category)}
                      className="p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                      title={`Edit ${category.name}`}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                  {!isPreviewMode && (
                    <button
                      onClick={() => onDelete(category._id)}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      title={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
        Showing {filteredCategories.length} of {categories.length} categories
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="ml-2 text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryList;