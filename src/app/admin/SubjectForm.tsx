"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Plus, Trash2, X, Info, AlertCircle, CheckCircle2, ArrowRightCircle, Eye } from 'lucide-react';
import SubjectIcon from '@/components/icons/SubjectIcon';

// --- Interfaces ---
interface Topic {
    _id?: string;
    name: string;
    description?: string;
    order?: number;
}
interface Subject {
    _id?: string;
    name: string;
    description: string;
    color?: string;
    gradientFrom?: string;
    gradientTo?: string;
    icon?: string;
    topics: Topic[];
}

interface SubjectFormProps {
  initialSubjectData?: Subject | null;
  onSuccess: () => void;
  onCancel: () => void;
  isPreviewMode?: boolean; // Added preview mode prop
}

// --- Define Available Icons ---
const availableIcons = [
    { name: 'Book (Default)', value: 'book' },
    { name: 'Atom (Physics)', value: 'atom' },
    { name: 'Flask (Chemistry)', value: 'flask' },
    { name: 'Calculator (Math)', value: 'calculator' },
    { name: 'Globe (Geography/Other)', value: 'globe' },
];

const SubjectForm: React.FC<SubjectFormProps> = ({ initialSubjectData, onSuccess, onCancel, isPreviewMode = false }) => {
  const [formData, setFormData] = useState<Subject>(() => {
    // Initialize form state, ensuring topics array exists
    const initialTopics = initialSubjectData?.topics || [];
    return {
      name: initialSubjectData?.name || '',
      description: initialSubjectData?.description || '',
      color: initialSubjectData?.color || '#3498db',
      gradientFrom: initialSubjectData?.gradientFrom || '#3498db',
      gradientTo: initialSubjectData?.gradientTo || '#2980b9',
      icon: initialSubjectData?.icon || 'book',
      topics: initialTopics,
      _id: initialSubjectData?._id,
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditing = !!initialSubjectData?._id;

  // Check for preview mode on mount
  useEffect(() => {
    if (isPreviewMode) {
      setError("You are in preview mode. Changes cannot be saved.");
    }
  }, [isPreviewMode]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isPreviewMode) return; // Prevent changes in preview mode
    
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Topic Handlers ---
  const handleAddTopic = () => {
    if (isPreviewMode) return; // Prevent changes in preview mode
    
    setFormData(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        { _id: `temp-topic-${Date.now()}`, name: '', description: '' }
      ]
    }));
  };

  const handleRemoveTopic = (topicIndex: number) => {
    if (isPreviewMode) return; // Prevent changes in preview mode
    
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, index) => index !== topicIndex)
    }));
  };

  const handleTopicChange = (topicIndex: number, field: keyof Topic, value: string) => {
    if (isPreviewMode) return; // Prevent changes in preview mode
    
    setFormData(prev => {
      const updatedTopics = [...prev.topics];
      if (updatedTopics[topicIndex]) {
        (updatedTopics[topicIndex] as any)[field] = value;
      }
      return { ...prev, topics: updatedTopics };
    });
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission in preview mode
    if (isPreviewMode) {
      setError("You are in preview mode. Changes cannot be saved.");
      return;
    }
    
    setError(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!formData.name || !formData.description) {
      setError("Subject Name and Description are required.");
      return;
    }
    if (formData.topics.some(topic => !topic.name?.trim())) {
        setError("All added topics must have a name.");
        return;
    }

    setIsLoading(true);

    // Prepare payload
    const payload = {
        ...formData,
        gradientFrom: formData.gradientFrom || formData.color,
        gradientTo: formData.gradientTo || formData.color,
        topics: formData.topics.map((topic, index) => ({
            _id: topic._id?.startsWith('temp-') ? undefined : topic._id,
            name: topic.name,
            description: topic.description || '',
            order: index + 1
        }))
    };
    if (!isEditing) {
        delete payload._id;
    }

    try {
      if (isEditing && formData._id) {
        await api.subjects.update(formData._id, payload);
        setSuccessMessage("Subject updated successfully!");
      } else {
        await api.subjects.create(payload);
        setSuccessMessage("Subject created successfully!");
      }
      // Short delay to show success message before closing
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: any) {
      console.error("Error saving subject:", err);
      let errorMessage = `Failed to save subject: ${err.message || 'Unknown error'}`;
      if (err.response?.data?.message) {
          errorMessage = `Failed to save subject: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
          const errorDetails = Object.values(err.response.data.errors).map((e: any) => e.message).join(', ');
          errorMessage = `Validation failed: ${errorDetails}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4 mb-6 sticky top-0 bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-md z-10 pt-2 rounded-t-lg shadow-sm transition-all duration-200">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              {isEditing ? (
                <>
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 p-1 rounded-md mr-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  Edit Subject
                </>
              ) : (
                <>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 p-1 rounded-md mr-2">
                    <Plus className="h-5 w-5" />
                  </span>
                  Create New Subject
                </>
              )}
              {isPreviewMode && (
                <span className="ml-2 text-sm font-normal text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md flex items-center">
                  <Eye className="h-3.5 w-3.5 mr-1" />Preview Only
                </span>
              )}
            </h2>
            <button type="button" onClick={onCancel} className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close form">
                <X className="h-5 w-5" />
            </button>
        </div>

        {/* Error Display */}
        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in shadow-md" role="alert">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Error</h3>
                  <div className="mt-1 text-sm">{error}</div>
                </div>
              </div>
              <button type="button" onClick={() => setError(null)} className="absolute top-3 right-3 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
        )}

        {/* Success Message */}
        {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in shadow-md" role="alert">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <div className="text-sm">{successMessage}</div>
                </div>
              </div>
            </div>
        )}

        {/* Preview Mode Banner */}
        {isPreviewMode && !error && (
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in shadow-md" role="alert">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Preview Mode</h3>
                  <div className="mt-1 text-sm">Form inputs are disabled in preview mode. You can view the form but cannot make any changes.</div>
                </div>
              </div>
            </div>
        )}

        {/* Subject Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  className={`w-full input-style ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                  placeholder="e.g. Physics, Chemistry, Mathematics"
                  disabled={isPreviewMode}
                />
            </div>

            {/* Icon Select Dropdown */}
            <div className="group">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">Icon</label>
                <div className='flex items-center space-x-3'>
                    <div className="relative w-full">
                      <select
                          id="icon"
                          name="icon"
                          value={formData.icon}
                          onChange={handleInputChange}
                          className={`w-full input-style appearance-none bg-white dark:bg-gray-800 pr-10 ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                          disabled={isPreviewMode}
                      >
                          {availableIcons.map(iconOption => (
                              <option key={iconOption.value} value={iconOption.value}>
                                  {iconOption.name}
                              </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {/* Icon Preview */}
                    <div className='p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow-inner flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'>
                        <SubjectIcon iconName={formData.icon} color={formData.color} className="h-6 w-6 transition-all duration-200"/>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 group">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={3} 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                  className={`w-full input-style ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                  placeholder="Provide a description of this subject..."
                  disabled={isPreviewMode}
                />
            </div>
            
            <div className="group">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">Color Theme</label>
                <div className="relative">
                  <input 
                    type="color" 
                    id="color" 
                    name="color" 
                    value={formData.color} 
                    onChange={handleInputChange} 
                    className={`w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer p-1 bg-transparent ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={isPreviewMode}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{formData.color}</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This color will be used for the subject's theme</p>
            </div>

            <div className="flex space-x-3">
              <div className="flex-1 group">
                <label htmlFor="gradientFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">Gradient Start</label>
                <input 
                  type="color" 
                  id="gradientFrom" 
                  name="gradientFrom" 
                  value={formData.gradientFrom} 
                  onChange={handleInputChange} 
                  className={`w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer p-1 bg-transparent ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isPreviewMode}
                />
              </div>
              <div className="flex-1 group">
                <label htmlFor="gradientTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">Gradient End</label>
                <input 
                  type="color" 
                  id="gradientTo" 
                  name="gradientTo" 
                  value={formData.gradientTo} 
                  onChange={handleInputChange} 
                  className={`w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer p-1 bg-transparent ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isPreviewMode}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Preview</label>
              <div className="h-16 rounded-lg shadow-md overflow-hidden" style={{ 
                background: `linear-gradient(135deg, ${formData.gradientFrom || formData.color}, ${formData.gradientTo || formData.color})` 
              }}>
                <div className="h-full w-full p-4 flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <SubjectIcon iconName={formData.icon} color="#ffffff" className="h-6 w-6" />
                    </div>
                    <span className="ml-3 font-medium text-lg">{formData.name || "Subject Preview"}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Topics Section */}
        <div className="space-y-4 border-t dark:border-gray-700 pt-6 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 p-1 rounded-md mr-2">
                    <BookIcon className="h-5 w-5" />
                  </span>
                  Topics
                </h3>
                <button 
                  type="button" 
                  onClick={handleAddTopic} 
                  disabled={isPreviewMode}
                  className={`text-sm bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/60 px-3 py-1.5 rounded-md inline-flex items-center shadow-sm hover:shadow transition-all duration-200 border border-indigo-200 dark:border-indigo-800 ${isPreviewMode ? 'opacity-50 cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-indigo-900/40' : ''}`}
                >
                    {isPreviewMode ? (
                      <><Eye className="h-4 w-4 mr-1" /> Preview Mode</>
                    ) : (
                      <><Plus className="h-4 w-4 mr-1" /> Add Topic</>
                    )}
                </button>
            </div>
            
            {formData.topics.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border border-dashed dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center space-y-2">
                  <Info className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <p>No topics added yet. Topics help organize course materials within a subject.</p>
                  <button 
                    type="button" 
                    onClick={handleAddTopic} 
                    disabled={isPreviewMode}
                    className={`text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center mt-2 ${isPreviewMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isPreviewMode ? (
                      <><Eye className="h-4 w-4 mr-1" /> Preview Mode</>
                    ) : (
                      <><Plus className="h-4 w-4 mr-1" /> Add your first topic</>
                    )}
                  </button>
                </div>
            )}
            
            <div className="space-y-3">
              {formData.topics.map((topic, index) => (
                  <div 
                    key={topic._id || index} 
                    className="p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-3 relative shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                      <div className="absolute -top-2 -left-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold py-0.5 px-2 rounded-full shadow-sm">
                        Topic {index + 1}
                      </div>
                      {!isPreviewMode && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTopic(index)} 
                          className="absolute -top-2 -right-2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm border border-red-200 dark:border-red-800 opacity-0 group-hover:opacity-100 focus:opacity-100" 
                          aria-label="Remove topic"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div className="group">
                          <label htmlFor={`topic-name-${index}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">
                            Topic Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            id={`topic-name-${index}`} 
                            value={topic.name} 
                            onChange={(e) => handleTopicChange(index, 'name', e.target.value)} 
                            required 
                            className={`w-full input-style text-sm ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                            placeholder="e.g. Introduction, Advanced Concepts, etc."
                            disabled={isPreviewMode}
                          />
                      </div>
                      <div className="group">
                          <label htmlFor={`topic-desc-${index}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-200">
                            Description (Optional)
                          </label>
                          <textarea 
                            id={`topic-desc-${index}`} 
                            rows={2} 
                            value={topic.description || ''} 
                            onChange={(e) => handleTopicChange(index, 'description', e.target.value)} 
                            className={`w-full input-style text-sm ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                            placeholder="Briefly describe what this topic covers..."
                            disabled={isPreviewMode}
                          />
                      </div>
                  </div>
              ))}
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t dark:border-gray-700 pt-6 mt-8 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 dark:to-transparent pb-4 z-10 rounded-b-lg">
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={isLoading} 
              className="px-4 py-2 btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading || isPreviewMode} 
              className={`px-5 py-2 btn-primary flex items-center ${isPreviewMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                ) : isPreviewMode ? (
                    <>
                      <Eye className="h-4 w-4 mr-1.5" />
                      Preview Mode
                    </>
                ) : (
                    <>
                      {isEditing ? 'Update Subject' : 'Create Subject'}
                      <ArrowRightCircle className="ml-1.5 h-4 w-4" />
                    </>
                )}
            </button>
        </div>

        {/* Styles */}
        <style jsx>{`
            .input-style { 
              @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200;
            }
            .btn-primary { 
              @apply bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800; 
            }
            .btn-secondary { 
              @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 shadow-sm hover:shadow transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800; 
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
      </form>
    </div>
  );
};

// Book icon for topics section
function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

export default SubjectForm;