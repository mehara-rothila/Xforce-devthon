"use client";

import React, { useState } from 'react';
import api from '@/utils/api';
import { Plus, Trash2, X } from 'lucide-react';
import SubjectIcon from '@/components/icons/SubjectIcon'; // Import to potentially show preview

// --- Interfaces ---
interface Topic {
    _id?: string; // Can be temp ID or DB ID
    name: string;
    description?: string;
    order?: number; // Added order here for clarity, though managed by index mostly
}
interface Subject {
    _id?: string;
    name: string;
    description: string;
    color?: string;
    gradientFrom?: string; // Keep if used, otherwise remove
    gradientTo?: string; // Keep if used, otherwise remove
    icon?: string;
    topics: Topic[];
    // isActive is handled by delete, not directly in form
}

interface SubjectFormProps {
  initialSubjectData?: Subject | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// --- Define Available Icons ---
const availableIcons = [
    { name: 'Book (Default)', value: 'book' },
    { name: 'Atom (Physics)', value: 'atom' },
    { name: 'Flask (Chemistry)', value: 'flask' },
    { name: 'Calculator (Math)', value: 'calculator' },
    { name: 'Globe (Geography/Other)', value: 'globe' },
    // Add more icons here as you support them in SubjectIcon.tsx
];

const SubjectForm: React.FC<SubjectFormProps> = ({ initialSubjectData, onSuccess, onCancel }) => {
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
      topics: initialTopics, // Use initial topics
      _id: initialSubjectData?._id, // Include ID if editing
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialSubjectData?._id;

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`); // <-- Log input changes
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Topic Handlers ---
  const handleAddTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        { _id: `temp-topic-${Date.now()}`, name: '', description: '' }
      ]
    }));
  };

  const handleRemoveTopic = (topicIndex: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, index) => index !== topicIndex)
    }));
  };

  const handleTopicChange = (topicIndex: number, field: keyof Topic, value: string) => {
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
    setError(null);

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
      } else {
        await api.subjects.create(payload);
      }
      onSuccess();
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

  // --- Render ---
  // Log the color value right before rendering the preview icon
  console.log("Rendering SubjectForm, formData.color:", formData.color);

  return (
     <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto pr-2">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-white z-10 pt-2">
            <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Subject' : 'Create New Subject'}
            </h2>
            <button type="button" onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close form">
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

        {/* Subject Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full input-style"/>
            </div>

            {/* Icon Select Dropdown */}
            <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className='flex items-center space-x-2'>
                    <select
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        className="w-full input-style appearance-none bg-white"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                        {availableIcons.map(iconOption => (
                            <option key={iconOption.value} value={iconOption.value}>
                                {iconOption.name}
                            </option>
                        ))}
                    </select>
                    {/* Icon Preview */}
                    <span className='p-1 border rounded-md bg-gray-100'>
                        {/* Log the props being passed to SubjectIcon */}
                        {console.log("Passing to SubjectIcon -> iconName:", formData.icon, "color:", formData.color)}
                        <SubjectIcon iconName={formData.icon} color={formData.color} className="h-5 w-5"/>
                    </span>
                </div>
            </div>

             <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} required className="w-full input-style"/>
            </div>
             <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="color" id="color" name="color" value={formData.color} onChange={handleInputChange} className="w-full h-10 border border-gray-300 rounded-md cursor-pointer p-1"/>
            </div>
             {/* Optional: Inputs for gradientFrom and gradientTo */}
             {/* ... */}

        </div>

         {/* Topics Section */}
         <div className="space-y-4 border-t pt-6 mt-6">
             {/* ... topic mapping ... */}
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Topics</h3>
                <button type="button" onClick={handleAddTopic} className="text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-md inline-flex items-center">
                    <Plus className="h-4 w-4 mr-1" /> Add Topic
                </button>
            </div>
             {formData.topics.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-md">No topics added yet.</p>
            )}
            {formData.topics.map((topic, index) => (
                <div key={topic._id || index} className="p-3 border rounded-md bg-gray-50/50 space-y-2 relative shadow-sm">
                    <button type="button" onClick={() => handleRemoveTopic(index)} className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors" aria-label="Remove topic">
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <div>
                        <label htmlFor={`topic-name-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Topic {index + 1} Name <span className="text-red-500">*</span></label>
                        <input type="text" id={`topic-name-${index}`} value={topic.name} onChange={(e) => handleTopicChange(index, 'name', e.target.value)} required className="w-full input-style text-sm"/>
                    </div>
                     <div>
                        <label htmlFor={`topic-desc-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Description (Optional)</label>
                        <textarea id={`topic-desc-${index}`} rows={2} value={topic.description || ''} onChange={(e) => handleTopicChange(index, 'description', e.target.value)} className="w-full input-style text-sm"/>
                    </div>
                </div>
            ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t pt-6 mt-8 sticky bottom-0 bg-white pb-4 z-10">
            <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 btn-primary flex items-center">
                {isLoading ? (
                     <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                ) : (isEditing ? 'Update Subject' : 'Create Subject')}
            </button>
        </div>

        {/* Styles */}
        <style jsx>{`
            .input-style { @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500; }
            .btn-primary { @apply bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm; }
            .btn-secondary { @apply bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm; }
        `}</style>
     </form>
  );
};

export default SubjectForm;



