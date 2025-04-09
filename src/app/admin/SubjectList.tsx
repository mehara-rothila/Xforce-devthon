import React, { useState, useEffect } from 'react';
import { Edit, Trash2, BookOpen, Search, Filter, ChevronDown, SortAsc, SortDesc, 
         Bookmark, Archive, Copy, GridIcon, ListIcon, Clock, PlusCircle,
         CheckCircle, AlertCircle, Eye, BarChart2, Paperclip, Layers, PenTool } from 'lucide-react';

// Interfaces (Match the ones in page.tsx)
interface Topic {
    _id?: string;
    name: string;
    description?: string;
    order?: number;
    resources?: string[];
}

interface Subject {
    _id: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
    topics: Topic[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    topicCount?: number; // Virtual property
}

interface SubjectListProps {
  subjects: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void; // For soft delete
}

// Icon mapping for better visualization
const SubjectIcon = ({ iconName, color }: { iconName?: string, color?: string }) => {
  const iconColor = color || '#4a5568';
  const iconSize = 'h-6 w-6';
  
  switch(iconName) {
    case 'atom':
      return <div className="relative">
        <div className="absolute animate-spin-slow opacity-30" style={{color: iconColor}}><Layers className={iconSize} /></div>
        <div style={{color: iconColor}}><Bookmark className={iconSize} /></div>
      </div>;
    case 'flask':
      return <div style={{color: iconColor}}><BookOpen className={iconSize} /></div>;
    case 'calculator':
      return <div style={{color: iconColor}}><BarChart2 className={iconSize} /></div>;
    case 'globe':
      return <div className="animate-pulse-slow" style={{color: iconColor}}><Eye className={iconSize} /></div>;
    case 'book':
      return <div style={{color: iconColor}}><BookOpen className={iconSize} /></div>;
    default:
      return <div style={{color: iconColor}}><PenTool className={iconSize} /></div>;
  }
};

const SubjectList: React.FC<SubjectListProps> = ({ subjects, onEdit, onDelete }) => {
  // State for advanced UI features
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [filterByTopicsRange, setFilterByTopicsRange] = useState<[number, number]>([0, 100]);
  const [highlightedSubject, setHighlightedSubject] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)} weeks ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
      }
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get total topics count
  const getTotalTopics = (): number => {
    return subjects.reduce((acc, subject) => {
      return acc + (subject.topicCount ?? subject.topics?.length ?? 0);
    }, 0);
  };

  // Generate a gradient based on subject color
  const generateGradient = (color: string = '#6b7280') => {
    // Add a slightly darker shade for gradient
    const darkerColor = color.replace(/^#/, '');
    const r = parseInt(darkerColor.substr(0, 2), 16);
    const g = parseInt(darkerColor.substr(2, 2), 16);
    const b = parseInt(darkerColor.substr(4, 2), 16);
    
    // Darken by 20%
    const darkenAmount = 0.2;
    const dr = Math.floor(r * (1 - darkenAmount));
    const dg = Math.floor(g * (1 - darkenAmount));
    const db = Math.floor(b * (1 - darkenAmount));
    
    const darkColor = `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
    
    return `linear-gradient(135deg, ${color}, ${darkColor})`;
  };

  // Toggle confirmation for delete
  const handleDeleteClick = (subjectId: string) => {
    if (confirmDelete === subjectId) {
      onDelete(subjectId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(subjectId);
      // Auto reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Filter and sort subjects
  const filteredSubjects = subjects
    .filter(subject => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Active/inactive filter
      const matchesActiveFilter = filterActive === null || subject.isActive === filterActive;
      
      // Topic count filter
      const topicCount = subject.topicCount ?? subject.topics?.length ?? 0;
      const matchesTopicFilter = topicCount >= filterByTopicsRange[0] && 
                                (filterByTopicsRange[1] === 100 || topicCount <= filterByTopicsRange[1]);
      
      return matchesSearch && matchesActiveFilter && matchesTopicFilter;
    })
    .sort((a, b) => {
      // Handle different sort fields
      let compareValueA: any;
      let compareValueB: any;
      
      switch (sortField) {
        case 'name':
          compareValueA = a.name;
          compareValueB = b.name;
          break;
        case 'topics':
          compareValueA = a.topicCount ?? a.topics?.length ?? 0;
          compareValueB = b.topicCount ?? b.topics?.length ?? 0;
          break;
        case 'createdAt':
          compareValueA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          compareValueB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        default:
          compareValueA = a[sortField as keyof Subject];
          compareValueB = b[sortField as keyof Subject];
      }
      
      // Compare values based on sort direction
      if (compareValueA < compareValueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (compareValueA > compareValueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Get max topics count for calculating percentage
  const maxTopics = Math.max(...subjects.map(s => s.topicCount ?? s.topics?.length ?? 0), 1);

  // Empty state
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transition-all duration-500">
        <div className="mb-6 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-300 opacity-50 rounded-full blur-lg"></div>
          <div className="relative bg-gray-100 dark:bg-gray-700 p-5 rounded-full">
            <BookOpen className="w-14 h-14 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Subjects Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Get started by creating your first subject. Subjects help organize your content into meaningful categories.
        </p>
        <button 
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center transform hover:scale-105"
          onClick={() => {}} // This would typically open your create subject form
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create First Subject
        </button>
      </div>
    );
  }

  // No results after filtering
  if (filteredSubjects.length === 0) {
    return (
      <div>
        {/* Search and Filters Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search subjects..."
              className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* View and Filter Controls */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${
                showFilters ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
                aria-label="Grid view"
              >
                <GridIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
                aria-label="List view"
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Expanded Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterActive(true)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${filterActive === true ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterActive(false)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${filterActive === false ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    Inactive
                  </button>
                  <button
                    onClick={() => setFilterActive(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${filterActive === null ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                  >
                    All
                  </button>
                </div>
              </div>
              
              {/* Topics Range Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Topics Range: {filterByTopicsRange[0]} - {filterByTopicsRange[1] === 100 ? 'Max' : filterByTopicsRange[1]}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max={maxTopics}
                      value={filterByTopicsRange[0]}
                      onChange={e => setFilterByTopicsRange([parseInt(e.target.value), filterByTopicsRange[1]])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Min Topics</span>
                  </div>
                  <div>
                    <input
                      type="range"
                      min={filterByTopicsRange[0]}
                      max={100}
                      value={filterByTopicsRange[1]}
                      onChange={e => setFilterByTopicsRange([filterByTopicsRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Max Topics</span>
                  </div>
                </div>
              </div>
              
              {/* Sort Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                <div className="flex space-x-2">
                  <select
                    value={sortField}
                    onChange={e => setSortField(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    <option value="name">Name</option>
                    <option value="topics">Topics Count</option>
                    <option value="createdAt">Created Date</option>
                  </select>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {sortDirection === 'asc' ? <SortAsc className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <SortDesc className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reset Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterActive(null);
                  setFilterByTopicsRange([0, 100]);
                  setSortField('name');
                  setSortDirection('asc');
                }}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
              >
                Reset all filters
              </button>
            </div>
          </div>
        )}
        
        {/* No Results Message */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching subjects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterActive(null);
              setFilterByTopicsRange([0, 100]);
            }}
            className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      </div>
    );
  }
  
  // Main render with results
  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Subjects</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{subjects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Topics</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{getTotalTopics()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Subjects</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {subjects.filter(s => s.isActive !== false).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recently Added</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {subjects.filter(s => {
                  if (!s.createdAt) return false;
                  const daysAgo = Math.floor((new Date().getTime() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                  return daysAgo <= 30; // Last 30 days
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search subjects..."
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        {/* View and Filter Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${
              showFilters || filterActive !== null || filterByTopicsRange[0] > 0 || filterByTopicsRange[1] < 100
                ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
          </button>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
              aria-label="Grid view"
            >
              <GridIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}
              aria-label="List view"
            >
              <ListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterActive(true)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${filterActive === true ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterActive(false)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${filterActive === false ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  Inactive
                </button>
                <button
                  onClick={() => setFilterActive(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${filterActive === null ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  All
                </button>
              </div>
            </div>
            
            {/* Topics Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Topics Range: {filterByTopicsRange[0]} - {filterByTopicsRange[1] === 100 ? 'Max' : filterByTopicsRange[1]}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="range"
                    min="0"
                    max={maxTopics}
                    value={filterByTopicsRange[0]}
                    onChange={e => setFilterByTopicsRange([parseInt(e.target.value), filterByTopicsRange[1]])}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Min Topics</span>
                </div>
                <div>
                  <input
                    type="range"
                    min={filterByTopicsRange[0]}
                    max={100}
                    value={filterByTopicsRange[1]}
                    onChange={e => setFilterByTopicsRange([filterByTopicsRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Max Topics</span>
                </div>
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
              <div className="flex space-x-2">
                <select
                  value={sortField}
                  onChange={e => setSortField(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  <option value="name">Name</option>
                  <option value="topics">Topics Count</option>
                  <option value="createdAt">Created Date</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  {sortDirection === 'asc' ? <SortAsc className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : <SortDesc className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Reset Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterActive(null);
                setFilterByTopicsRange([0, 100]);
                setSortField('name');
                setSortDirection('asc');
              }}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              Reset all filters
            </button>
          </div>
        </div>
      )}
      
      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredSubjects.length} of {subjects.length} subjects
      </div>
      
      {/* Subjects Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <div 
              key={subject._id}
              onMouseEnter={() => setHighlightedSubject(subject._id)}
              onMouseLeave={() => setHighlightedSubject(null)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                highlightedSubject === subject._id ? 'transform scale-[1.02]' : ''
              } ${!subject.isActive ? 'opacity-70' : ''} animate-fadeIn`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {/* Card Header with accent color */}
              <div 
                className="h-3"
                style={{ 
                  background: generateGradient(subject.color || '#6b7280'),
                  boxShadow: `0 2px 6px ${subject.color}40` 
                }}
              ></div>
              
              <div className="p-5">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{ background: `${subject.color || '#6b7280'}20` }}
                    >
                      <SubjectIcon iconName={subject.icon} color={subject.color} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={subject.name}>
                      {subject.name}
                    </h3>
                  </div>
                  {subject.isActive === false ? (
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                      <Archive className="h-3 w-3 mr-1" />
                      Inactive
                    </span>
                  ) : (
                    <span className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium text-green-800 dark:text-green-300 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4 line-clamp-2" title={subject.description}>
                  {subject.description || 'No description provided'}
                </p>
                
                {/* Topics Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Topics</span>
                    <span className="font-medium">{subject.topicCount ?? subject.topics?.length ?? 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${Math.min(100, ((subject.topicCount ?? subject.topics?.length ?? 0) / maxTopics) * 100)}%`,
                        background: generateGradient(subject.color || '#6b7280')
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Topic List Preview */}
                {expandedSubject === subject._id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topics</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
                      {(subject.topics && subject.topics.length > 0) ? (
                        subject.topics.map((topic, i) => (
                          <li key={topic._id || i} className="flex items-center py-1">
                            <div 
                              className="w-1 h-1 rounded-full mr-2"
                              style={{ background: subject.color || '#6b7280' }}
                            ></div>
                            {topic.name}
                          </li>
                        ))
                      ) : (
                        <li className="italic">No topics available</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Card Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setExpandedSubject(expandedSubject === subject._id ? null : subject._id)}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                  >
                    {expandedSubject === subject._id ? 'Hide Topics' : 'Show Topics'}
                  </button>
                  
                  <div className="flex text-xs text-gray-500 dark:text-gray-400 items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDate(subject.createdAt)}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end mt-3 space-x-1">
                  <button
                    onClick={() => onEdit(subject)}
                    className="p-1.5 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 transition-colors"
                    aria-label={`Edit ${subject.name}`}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(subject._id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      confirmDelete === subject._id
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20'
                    }`}
                    aria-label={confirmDelete === subject._id ? 'Confirm delete' : `Delete ${subject.name}`}
                  >
                    {confirmDelete === subject._id ? (
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      // Copy function - e.g., duplicate subject
                      console.log(`Duplicate subject: ${subject.name}`);
                    }}
                    className="p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                    aria-label={`Duplicate ${subject.name}`}
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Topics
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubjects.map((subject, index) => (
                  <tr 
                    key={subject._id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !subject.isActive ? 'opacity-70' : ''
                    } animate-fadeIn`}
                    style={{ animationDelay: `${index * 70}ms` }}
                    onMouseEnter={() => setHighlightedSubject(subject._id)}
                    onMouseLeave={() => setHighlightedSubject(null)}
                  >
                    {/* Subject Name & Icon */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `${subject.color || '#6b7280'}20` }}
                        >
                          <SubjectIcon iconName={subject.icon} color={subject.color} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</div>
                          <div 
                            className="w-16 h-1 mt-1 rounded-full"
                            style={{ background: generateGradient(subject.color || '#6b7280') }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Description */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs" title={subject.description}>
                        {subject.description || 'No description provided'}
                      </div>
                    </td>
                    
                    {/* Topics Count */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${Math.min(100, ((subject.topicCount ?? subject.topics?.length ?? 0) / maxTopics) * 100)}%`,
                              background: generateGradient(subject.color || '#6b7280')
                            }}
                          ></div>
                        </div>
                        <span className="tabular-nums">{subject.topicCount ?? subject.topics?.length ?? 0}</span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {subject.isActive === false ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          <Archive className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      )}
                    </td>
                    
                    {/* Created Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(subject.createdAt)}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => onEdit(subject)}
                          className="p-1.5 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 transition-colors"
                          aria-label={`Edit ${subject.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subject._id)}
                          className={`p-1.5 rounded-md transition-colors ${
                            confirmDelete === subject._id
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20'
                          }`}
                          aria-label={confirmDelete === subject._id ? 'Confirm delete' : `Delete ${subject.name}`}
                        >
                          {confirmDelete === subject._id ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            // Copy function - e.g., duplicate subject
                            console.log(`Duplicate subject: ${subject.name}`);
                          }}
                          className="p-1.5 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                          aria-label={`Duplicate ${subject.name}`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Add animations, keyframes, etc. with CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default SubjectList;