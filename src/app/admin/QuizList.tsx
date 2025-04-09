import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Clock, Filter, ChevronDown, Search, SortAsc, SortDesc, BookOpen, Eye, Award } from 'lucide-react';

interface Subject {
  _id: string;
  name: string;
}

interface Quiz {
  _id: string;
  title: string;
  subject: Subject | string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: any[];
  totalQuestions?: number;
  timeLimit: number;
  isPublished?: boolean;
  attempts?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface QuizListProps {
  quizzes: Quiz[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getSubjectName = (subject: Subject | string): string => {
    if (typeof subject === 'object' && subject !== null && subject.name) {
      return subject.name;
    }
    return typeof subject === 'string' ? 'ID: '+ subject.substring(0, 8)+'...' : 'N/A';
  };

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
  const filteredQuizzes = quizzes.filter(quiz => {
    // Apply search filter
    if (searchTerm && !quiz.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply difficulty filter
    if (filterDifficulty && quiz.difficulty !== filterDifficulty) {
      return false;
    }
    
    // Apply published status filter
    if (filterPublished !== null && quiz.isPublished !== filterPublished) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Handle sorting
    let fieldA: any = sortField === 'subject' ? getSubjectName(a.subject) : (a as any)[sortField];
    let fieldB: any = sortField === 'subject' ? getSubjectName(b.subject) : (b as any)[sortField];
    
    // Convert to numbers for numeric fields
    if (sortField === 'timeLimit' || sortField === 'questions') {
      fieldA = sortField === 'questions' ? a.questions.length : fieldA;
      fieldB = sortField === 'questions' ? b.questions.length : fieldB;
    }
    
    // Handle dates
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      fieldA = fieldA ? new Date(fieldA).getTime() : 0;
      fieldB = fieldB ? new Date(fieldB).getTime() : 0;
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
            <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No quizzes found</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Start by creating your first quiz using the button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 pb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 admin-input"
          />
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-colors ${
              showFilterPanel || filterDifficulty || filterPublished !== null 
                ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' 
                : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filter</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showFilterPanel ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 mb-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterDifficulty(filterDifficulty === 'easy' ? null : 'easy')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterDifficulty === 'easy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setFilterDifficulty(filterDifficulty === 'medium' ? null : 'medium')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterDifficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 font-medium'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setFilterDifficulty(filterDifficulty === 'hard' ? null : 'hard')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterDifficulty === 'hard'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-medium'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterPublished(filterPublished === true ? null : true)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterPublished === true
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setFilterPublished(filterPublished === false ? null : false)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterPublished === false
                      ? 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 font-medium'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterDifficulty(null);
                  setFilterPublished(null);
                  setSearchTerm('');
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Grid/Cards View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => (
          <div 
            key={quiz._id} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={quiz.title}>
                  {quiz.title}
                </h3>
                <span className={`ml-2 flex-shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  quiz.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : quiz.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </span>
              </div>

              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="truncate">{getSubjectName(quiz.subject)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Questions</div>
                  <div className="font-semibold flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    {quiz.questions?.length ?? 0}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time Limit</div>
                  <div className="font-semibold flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    {quiz.timeLimit} min
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {quiz.isPublished ? (
                    <span className="inline-flex items-center text-xs font-medium text-green-700 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      <XCircle className="h-4 w-4 mr-1" />
                      Draft
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(quiz.createdAt)}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEdit(quiz)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Edit ${quiz.title}`}
                  >
                    <Edit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </button>
                  <button
                    onClick={() => onDelete(quiz._id)}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Delete ${quiz.title}`}
                  >
                    <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <div>
          Showing {filteredQuizzes.length} of {quizzes.length} quizzes
        </div>
        <div className="flex items-center space-x-2">
          <span>Sort by:</span>
          <select 
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setSortDirection('asc');
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-800"
          >
            <option value="title">Title</option>
            <option value="subject">Subject</option>
            <option value="difficulty">Difficulty</option>
            <option value="createdAt">Created Date</option>
            <option value="timeLimit">Time Limit</option>
          </select>
          <button 
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-5 w-5" />
            ) : (
              <SortDesc className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizList;