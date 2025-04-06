"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { Plus, Trash2, X } from 'lucide-react';

// --- Interfaces (Ensure consistency with other files) ---
interface Subject {
  _id: string;
  name: string;
  // Add other fields if needed by the form/display
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
  // Add other question fields if needed
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
  // Add other quiz fields if needed
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
    if ((name === 'timeLimit' || name === 'points') && numValue < 0) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };


  // --- Question Handlers ---
  const handleAddQuestion = () => {
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
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const handleQuestionChange = (questionIndex: number, field: keyof Question, value: any) => {
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
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      if (updatedQuestions[questionIndex]?.options[optionIndex]) {
        updatedQuestions[questionIndex].options[optionIndex].text = value;
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleCorrectOptionChange = (questionIndex: number, correctOptionIndex: number) => {
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


  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

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
            return; // Stop submission
        }
         // Optional: Check if options have text
        if (question.options.some(opt => !opt.text?.trim())) {
             setError(`All options in Question ${i + 1} must have text.`);
            return;
        }
         // Optional: Check if question text exists
         if(!question.text?.trim()){
            setError(`Question ${i + 1} must have text.`);
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
      } else {
        // Create new quiz
        await api.quizzes.create(payload);
      }
      onSuccess(); // Call success callback
    } catch (err: any) {
      console.error("Error saving quiz:", err);
      setError(`Failed to save quiz: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---
  return (
    // Added max-h-[85vh] to form container and overflow-y-auto for scrolling within modal
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto pr-2"> {/* Added padding-right for scrollbar */}
      {/* Form Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-white z-10 pt-2"> {/* Make header sticky */}
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
           <button type="button" onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
               <X className="h-5 w-5 text-red-700"/>
           </button>
        </div>
      )}

      {/* Basic Quiz Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
          {isFetchingSubjects ? (
             <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">Loading subjects...</div>
          ) : (
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white appearance-none"
               style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}

            >
              <option value="" disabled>Select a subject</option>
              {availableSubjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Time Limit */}
         <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes) <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleNumberInputChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

         {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

         {/* Published Status */}
        <div className="md:col-span-2 flex items-center">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            checked={formData.isPublished || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
            Published (Visible to users)
          </label>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6 border-t pt-6 mt-6">
        <div className="flex justify-between items-center">
             <h3 className="text-lg font-medium text-gray-900">Questions <span className="text-red-500">*</span></h3>
             <button
                type="button"
                onClick={handleAddQuestion}
                className="text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-md inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </button>
        </div>

        {formData.questions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-md">No questions added yet. Click "Add Question" to start.</p>
        )}

        {formData.questions.map((question, qIndex) => (
          <div key={question._id || qIndex} className="p-4 border rounded-md bg-gray-50/50 space-y-4 relative shadow-sm">
             {/* Remove Question Button */}
             <button
                type="button"
                onClick={() => handleRemoveQuestion(qIndex)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Remove question"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            {/* Question Text */}
            <div>
              <label htmlFor={`q-text-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Question {qIndex + 1} <span className="text-red-500">*</span></label>
              <textarea
                id={`q-text-${qIndex}`}
                rows={2}
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Options */}
            <div className="space-y-3 pl-2 border-l-2 border-purple-200">
              <label className="block text-sm font-medium text-gray-700">Options (Mark one as correct) <span className="text-red-500">*</span></label>
              {question.options.map((option, oIndex) => (
                <div key={option._id || oIndex} className="flex items-center space-x-2">
                   {/* Correct Answer Radio Button */}
                   <input
                      type="radio"
                      id={`q-${qIndex}-opt-correct-${oIndex}`}
                      name={`q-${qIndex}-correct`} // Group radio buttons per question
                      checked={option.isCorrect}
                      // Ensure an option ID exists before allowing selection,
                      // or rely on index if ID is temporary/missing
                      value={option._id || `index-${oIndex}`}
                      onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                      className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-offset-0" // removed offset
                    />
                  {/* Option Text Input */}
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm" // made text smaller
                  />
                  {/* Remove Option Button (show only if more than 2 options) */}
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(qIndex, oIndex)}
                      className="p-1 text-red-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Remove option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {/* Add Option Button */}
              <button
                type="button"
                onClick={() => handleAddOption(qIndex)}
                className="text-sm text-purple-600 hover:text-purple-800 inline-flex items-center mt-1"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Option
              </button>
            </div>

            {/* Explanation */}
             <div>
              <label htmlFor={`q-explanation-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
              <textarea
                id={`q-explanation-${qIndex}`}
                rows={2}
                value={question.explanation || ''}
                onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm" // made text smaller
              />
            </div>

             {/* Points */}
             <div>
                <label htmlFor={`q-points-${qIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input
                    type="number"
                    id={`q-points-${qIndex}`}
                    value={question.points === undefined ? 10 : question.points} // Default display value
                    onChange={(e) => handleQuestionChange(qIndex, 'points', e.target.value)}
                    min="0"
                    className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
             </div>

          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 border-t pt-6 mt-8 sticky bottom-0 bg-white pb-4 z-10"> {/* Make actions sticky */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isFetchingSubjects}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
        >
          {isLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            isEditing ? 'Update Quiz' : 'Create Quiz'
          )}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;