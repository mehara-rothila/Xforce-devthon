"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { Plus, Trash2, X, AlertCircle, Check, HelpCircle, Clock, Award, Save, BookOpen, FileQuestion, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Interfaces (Ensure consistency with other files) ---
interface Subject {
  _id: string;
  name: string;
  color?: string;
}

interface Option {
  _id?: string; // Optional for new options
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id?: string; // Optional for new questions
  text: string;
  options: Option[];
  correctAnswer?: string | null; // Store the ID of the correct option
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number;
}

interface Quiz {
  _id?: string; // Optional for new quizzes
  title: string;
  description?: string;
  subject: string; // Store subject ID
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  questions: Question[];
  isPublished?: boolean;
}

interface QuizFormProps {
  initialQuizData?: Quiz | null; // Quiz data for editing, null/undefined for creating
  onSuccess: () => void; // Callback on successful save
  onCancel: () => void; // Callback to close the form/modal
}

// --- Component ---
const QuizForm: React.FC<QuizFormProps> = ({ initialQuizData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Quiz>(() => {
    // Initialize form state
    return initialQuizData || {
      title: '',
      description: '',
      subject: '', // Default to empty, user must select
      difficulty: 'medium',
      timeLimit: 30,
      questions: [],
      isPublished: false,
    };
  });

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showHints, setShowHints] = useState<boolean>(true);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);

  const isEditing = !!initialQuizData?._id;

  // --- Effects ---
  // Fetch available subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsFetchingSubjects(true);
      try {
        const response = await api.subjects.getAll();
        const fetchedSubjects = response.data?.data?.subjects || [];
        if (Array.isArray(fetchedSubjects)) {
          setAvailableSubjects(fetchedSubjects);
          // If creating, set default subject if available and none is set
          if (!isEditing && fetchedSubjects.length > 0 && !formData.subject) {
             // Check if formData.subject is still empty before setting default
             setFormData(prev => ({
                ...prev,
                subject: prev.subject || fetchedSubjects[0]._id // Only set if not already set
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Could not load subjects for selection.");
      } finally {
        setIsFetchingSubjects(false);
      }
    };
    fetchSubjects();
  // Only run on mount, formData.subject dependency removed to avoid resetting selection
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Auto-expand newly added question
  useEffect(() => {
    if (formData.questions.length > 0) {
      const lastIndex = formData.questions.length - 1;
      if (formData.questions[lastIndex]._id?.startsWith('temp-question-')) {
        setExpandedQuestionIndex(lastIndex);
      }
    }
  }, [formData.questions.length]);

  // --- Handlers ---

  // Handle basic input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
// Handle changes for number inputs
const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  // Allow empty string for clearing the input, otherwise parse as number
  const numValue = value === '' ? '' : parseInt(value, 10);
  // Prevent negative numbers for timeLimit and points
  if ((name === 'timeLimit' || name === 'points') && typeof numValue === 'number' && numValue < 0) {
    return;
  }
  setFormData(prev => ({
    ...prev,
    [name]: numValue
  }));
};

  // --- Question Handlers ---
  const handleAddQuestion = () => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        // Add a new blank question structure
        {
          // Use a temporary client-side ID for keys during rendering before saving
          _id: `temp-question-${Date.now()}`,
          text: '',
          options: [
            { _id: `temp-option-${Date.now()}-1`, text: '', isCorrect: false },
            { _id: `temp-option-${Date.now()}-2`, text: '', isCorrect: false },
          ],
          correctAnswer: null, // Explicitly null
          explanation: '',
          difficulty: 'medium',
          points: 10,
        }
      ]
    }));
  };

  const handleRemoveQuestion = (questionIndex: number) => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
    
    // Update expanded question index if needed
    if (expandedQuestionIndex === questionIndex) {
      setExpandedQuestionIndex(null);
    } else if (expandedQuestionIndex !== null && expandedQuestionIndex > questionIndex) {
      setExpandedQuestionIndex(expandedQuestionIndex - 1);
    }
  };

  const handleQuestionChange = (questionIndex: number, field: keyof Question, value: any) => {
    setError(null);
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      if (updatedQuestions[questionIndex]) {
        // Handle points specifically to ensure it's a number >= 0
         if (field === 'points') {
            const numValue = value === '' ? 0 : parseInt(value, 10);
            (updatedQuestions[questionIndex] as any)[field] = Math.max(0, numValue); // Ensure points >= 0
        } else {
            (updatedQuestions[questionIndex] as any)[field] = value;
        }
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  // --- Option Handlers ---
  const handleAddOption = (questionIndex: number) => {
    setError(null);
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      if (updatedQuestions[questionIndex]) {
        updatedQuestions[questionIndex].options.push({
          _id: `temp-option-${Date.now()}`, // Temporary client-side ID
          text: '',
          isCorrect: false
        });
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    setError(null);
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      if (question?.options) {
        const removedOption = question.options[optionIndex];
        question.options = question.options.filter((_, index) => index !== optionIndex);

        // If the removed option was the correct one, clear correctAnswer for the question
        // and ensure no other option is marked correct accidentally
        if (removedOption?._id && removedOption._id === question.correctAnswer) {
           question.correctAnswer = null;
           // Ensure isCorrect is false for remaining options if the correct one was removed
           question.options.forEach(opt => opt.isCorrect = false);
        }
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setError(null);
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      if (updatedQuestions[questionIndex]?.options[optionIndex]) {
        updatedQuestions[questionIndex].options[optionIndex].text = value;
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleCorrectOptionChange = (questionIndex: number, correctOptionIndex: number) => {
    setError(null);
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      if (question?.options) { // Check if options exist
        let correctOptionId: string | null = null;
        // Map options, setting isCorrect flag and finding the ID of the new correct option
        question.options = question.options.map((option, index) => {
          const isNowCorrect = index === correctOptionIndex;
          // Assign ID if it's the correct one AND the option has an ID
          // (newly added options might have temp IDs, real IDs are assigned on save)
          if (isNowCorrect && option._id) {
             correctOptionId = option._id;
          }
          return { ...option, isCorrect: isNowCorrect };
        });
        // Update the question's correctAnswer field with the ID
        question.correctAnswer = correctOptionId;
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const toggleExpandQuestion = (index: number) => {
    setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
  };

  // Get subject name by ID
  const getSubjectName = (subjectId: string): string => {
    const subject = availableSubjects.find(s => s._id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  // Get color class based on difficulty
  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'hard': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  // Get subject color
  const getSubjectColor = (subjectId: string): string => {
    const subject = availableSubjects.find(s => s._id === subjectId);
    return subject?.color || '#6366f1'; // Default to indigo
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null);

    // --- VALIDATION ---
    if (!formData.title || !formData.subject) {
      setError("Quiz Title and Subject are required.");
      return;
    }
    if (formData.questions.length === 0) {
       setError("Quiz must have at least one question.");
       return;
    }

    // --- ADDED: Check if every question has a correct answer selected ---
    for (let i = 0; i < formData.questions.length; i++) {
        const question = formData.questions[i];
        // Check if at least one option is marked as correct
        const hasCorrectOption = question.options.some(opt => opt.isCorrect === true);
        if (!hasCorrectOption) {
            setError(`Question ${i + 1} must have one correct answer selected.`);
            setExpandedQuestionIndex(i); // Expand the problematic question
            return; // Stop submission
        }
         // Optional: Check if options have text
        if (question.options.some(opt => !opt.text?.trim())) {
             setError(`All options in Question ${i + 1} must have text.`);
             setExpandedQuestionIndex(i);
            return;
        }
         // Optional: Check if question text exists
         if(!question.text?.trim()){
            setError(`Question ${i + 1} must have text.`);
            setExpandedQuestionIndex(i);
            return;
         }
    }
    // --- End Validation ---

    setIsLoading(true); // Start loading indicator AFTER validation passes

    // Prepare payload: remove temporary IDs if necessary, ensure structure matches backend
    const payload = {
      ...formData,
      // Ensure timeLimit and points are numbers (or handle default if empty string)
      timeLimit: Number(formData.timeLimit) || 30,
      questions: formData.questions.map(q => {
          const correctOption = q.options.find(opt => opt.isCorrect === true);
          return {
            ...q,
            points: Number(q.points) || 10, // Ensure points is a number
            // Remove temporary IDs if they start with 'temp-'
            _id: q._id?.startsWith('temp-') ? undefined : q._id,
            options: q.options.map(opt => ({
              text: opt.text, // Only send necessary fields
              isCorrect: opt.isCorrect,
              _id: opt._id?.startsWith('temp-') ? undefined : opt._id,
            })),
            // Ensure correctAnswer is set based on isCorrect flag
            correctAnswer: correctOption?._id || null // Use the ID of the option marked isCorrect
          };
      })
    };

    try {
      if (isEditing && formData._id) {
        // Update existing quiz
        await api.quizzes.update(formData._id, payload);
        setSuccessMessage("Quiz updated successfully!");
      } else {
        // Create new quiz
        await api.quizzes.create(payload);
        setSuccessMessage("Quiz created successfully!");
      }
      
      // Short delay to show success message
      setTimeout(() => {
        onSuccess(); // Call success callback
      }, 1000);
    } catch (err: any) {
      console.error("Error saving quiz:", err);
      setError(`Failed to save quiz: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto px-6">
        {/* Form Header */}
        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4 mb-6 sticky top-0 bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm z-20 pt-2 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            {isEditing ? (
              <>
                <span className="flex items-center justify-center p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded mr-2">
                  <FileQuestion className="h-5 w-5" />
                </span>
                Edit Quiz
              </>
            ) : (
              <>
                <span className="flex items-center justify-center p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded mr-2">
                  <Plus className="h-5 w-5" />
                </span>
                Create New Quiz
              </>
            )}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
{/* Error Display */}
{error && (
  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in shadow-sm" role="alert">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
      <div className="ml-3 flex-grow">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
      <button 
        type="button" 
        onClick={() => setError(null)} 
        aria-label="Close error message"
        className="ml-auto flex-shrink-0 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>
)}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in shadow-sm" role="alert">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <div className="ml-3 flex-grow">
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Summary Banner (only shown when editing) */}
        {isEditing && (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 text-white p-4 mb-6 shadow-md">
            <div className="relative z-10">
              <h3 className="font-medium text-lg">{formData.title}</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-1 opacity-80" />
                  {formData.subject ? getSubjectName(formData.subject) : 'No Subject'}
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-1 opacity-80" />
                  {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 opacity-80" />
                  {formData.timeLimit} minutes
                </div>
                <div className="flex items-center text-sm">
                  <FileQuestion className="h-4 w-4 mr-1 opacity-80" />
                  {formData.questions.length} {formData.questions.length === 1 ? 'question' : 'questions'}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 opacity-20">
              <FileQuestion className="h-32 w-32 transform translate-x-6 -translate-y-6" />
            </div>
          </div>
        )}

        {/* Hints toggle button */}
        <button 
          type="button"
          className="text-xs flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-4 focus:outline-none"
          onClick={() => setShowHints(!showHints)}
        >
          <HelpCircle className="h-3.5 w-3.5 mr-1" />
          {showHints ? 'Hide tips' : 'Show tips'}
        </button>

        {/* Basic Quiz Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Physics Final Exam"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
            />
            {showHints && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Choose a clear, descriptive title for your quiz.</p>
            )}
          </div>

          {/* Subject */}
          <div className="group">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              Subject <span className="text-red-500">*</span>
            </label>
            {isFetchingSubjects ? (
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading subjects...
              </div>
            ) : (
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all appearance-none pr-10"
                >
                  <option value="" disabled>Select a subject</option>
                  {availableSubjects.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            {showHints && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select the subject this quiz belongs to.</p>
            )}
          </div>

          {/* Difficulty */}
          <div className="group">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              Difficulty
            </label>
            <div className="relative">
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 transition-all appearance-none pr-10 ${
                  getDifficultyColor(formData.difficulty)
                }`}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {showHints && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Set how challenging this quiz will be for students.</p>
            )}
          </div>

          {/* Time Limit */}
          <div className="group">
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              Time Limit (minutes) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleNumberInputChange}
                min="1"
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
              />
            </div>
            {showHints && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Set how many minutes students have to complete the quiz.</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2 group">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Enter a brief description of what this quiz covers..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
            />
            {showHints && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Add details about the quiz content, goals, or any special instructions.</p>
            )}
          </div>

          {/* Published Status */}
          <div className="md:col-span-2">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isPublished"
                  name="isPublished"
                  type="checkbox"
                  checked={formData.isPublished || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 dark:text-indigo-500 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPublished" className="font-medium text-gray-700 dark:text-gray-300">
                  Published (Visible to users)
                </label>
                {showHints && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">When published, students can access this quiz. Unpublished quizzes are only visible to administrators.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6 border-t dark:border-gray-700 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <span className="flex items-center justify-center p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded mr-2">
                <FileQuestion className="h-5 w-5" />
              </span>
              Questions <span className="text-red-500">*</span>
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({formData.questions.length} {formData.questions.length === 1 ? 'question' : 'questions'})
              </span>
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 px-4 py-2 rounded-lg inline-flex items-center transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add Question
            </button>
          </div>

          {formData.questions.length === 0 && (
            <div className="text-center py-8 border border-dashed dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center space-y-3">
              <FileQuestion className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400">No questions added yet</p>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center font-medium"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add your first question
              </button>
            </div>
          )}

          <div className="space-y-4">
            {formData.questions.map((question, qIndex) => {
              const isExpanded = expandedQuestionIndex === qIndex;
              const hasCorrectOption = question.options.some(opt => opt.isCorrect);
              const areAllOptionsFilledOut = question.options.every(opt => opt.text.trim() !== '');
              const isQuestionTextFilled = question.text.trim() !== '';
              
              return (
                <div 
                  key={question._id || qIndex} 
                  className={`border dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 shadow-sm ${
                    isExpanded ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {/* Question Header (always visible) */}
                  <div 
                    className={`p-4 cursor-pointer flex justify-between items-start ${
                      isExpanded ? 'border-b dark:border-gray-700' : ''
                    }`}
                    onClick={() => toggleExpandQuestion(qIndex)}
                  >
                    <div className="flex items-start flex-grow min-w-0 pr-2">
                      <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mr-3 mt-0.5">
                        {qIndex + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                          {question.text || <span className="text-gray-400 dark:text-gray-500 italic">Untitled Question</span>}
                        </h4>
                        <div className="flex flex-wrap items-center mt-1 gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(question.difficulty || 'medium')}`}>
                          {question.difficulty 
  ? question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1) 
  : 'Medium'}                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Award className="h-3.5 w-3.5 mr-1" />
                            {question.points || 10} points
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                            {question.options.length} options
                          </span>
                          
                          {/* Status indicators */}
                          {!isQuestionTextFilled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Missing text
                            </span>
                          )}
                          {!hasCorrectOption && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              No correct answer
                            </span>
                          )}
                          {!areAllOptionsFilledOut && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Empty options
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveQuestion(qIndex);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Remove question"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                      <div className="ml-2 text-gray-400 dark:text-gray-500 transition-transform duration-200 transform rotate-0">
                        <svg className={`h-5 w-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Question Body (expandable) */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 animate-fade-in">
                      {/* Question Text */}
                      <div className="group">
                        <label htmlFor={`q-text-${qIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                          Question Text <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id={`q-text-${qIndex}`}
                          rows={2}
                          value={question.text}
                          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                          required
                          placeholder="Enter your question here..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3 pt-2 border-t dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Options <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIndex)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center font-medium"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Option
                          </button>
                        </div>
                        <div className="space-y-2.5 pl-2 border-l-2 border-indigo-200 dark:border-indigo-800">
                          {question.options.map((option, oIndex) => (
                            <div key={option._id || oIndex} className="flex items-start space-x-2 group">
                              {/* Correct Answer Radio Button */}
                              <div className="mt-2.5">
                                <input
                                  type="radio"
                                  id={`q-${qIndex}-opt-correct-${oIndex}`}
                                  name={`q-${qIndex}-correct`}
                                  checked={option.isCorrect}
                                  value={option._id || `index-${oIndex}`}
                                  onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                  className="h-4 w-4 text-indigo-600 dark:text-indigo-500 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                                />
                              </div>
                              
                              {/* Option Text Input */}
                              <div className="group flex-grow relative">
                                <input
                                  type="text"
                                  placeholder={`Option ${oIndex + 1}`}
                                  value={option.text}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                  required
                                  className={`w-full pl-3 pr-10 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all text-sm ${
                                    option.isCorrect 
                                      ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                                      : 'border-gray-300 dark:border-gray-600'
                                  }`}
                                />
                                {option.isCorrect && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-500 dark:text-green-400">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Remove Option Button (show only if more than 2 options) */}
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(qIndex, oIndex)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  aria-label="Remove option"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Question Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Explanation */}
                        <div className="md:col-span-2 group">
                          <label htmlFor={`q-explanation-${qIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                            Explanation (Optional)
                          </label>
                          <textarea
                            id={`q-explanation-${qIndex}`}
                            rows={2}
                            value={question.explanation || ''}
                            onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                            placeholder="Explain why the correct answer is right (shown after submission)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all text-sm"
                          />
                        </div>

                        {/* Question Difficulty */}
                        <div className="group">
                          <label htmlFor={`q-difficulty-${qIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                            Difficulty
                          </label>
                          <div className="relative">
                            <select
                              id={`q-difficulty-${qIndex}`}
                              value={question.difficulty || 'medium'}
                              onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 transition-all appearance-none pr-10 text-sm ${
                                getDifficultyColor(question.difficulty || 'medium')
                              }`}
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="group">
                          <label htmlFor={`q-points-${qIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                            Points
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                              type="number"
                              id={`q-points-${qIndex}`}
                              value={question.points === undefined ? 10 : question.points}
                              onChange={(e) => handleQuestionChange(qIndex, 'points', e.target.value)}
                              min="0"
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 border-t dark:border-gray-700 pt-6 mt-8 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 dark:to-transparent pb-4 z-10 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 shadow-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || isFetchingSubjects}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-1.5" />
                {isEditing ? 'Update Quiz' : 'Create Quiz'}
              </>
            )}
          </button>
        </div>
        
        {/* CSS for animations */}
        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </form>
    </div>
  );
};

export default QuizForm;