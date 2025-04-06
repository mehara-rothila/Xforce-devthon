"use client";

import React, { useState } from 'react';
import api from '@/utils/api'; // Import api, although calls are commented out
import { X, Loader2 } from 'lucide-react';
import SubjectIcon from '@/components/icons/SubjectIcon'; // Reusing SubjectIcon for categories

// --- Interfaces ---
interface ForumCategory {
  _id?: string; // Optional for new categories
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  // Other fields from model if needed in form
}

interface CategoryFormProps {
  initialCategoryData?: ForumCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Define Available Icons (reuse or customize for categories)
const availableIcons = [
    { name: 'Book (Default)', value: 'book' },
    { name: 'Atom (Physics)', value: 'atom' },
    { name: 'Flask (Chemistry)', value: 'flask' },
    { name: 'Calculator (Math)', value: 'calculator' },
    { name: 'Globe (Geography/Other)', value: 'globe' },
    { name: 'Chat Bubble', value: 'chat' }, // Example specific to forum
    { name: 'Light Bulb', value: 'lightbulb' }, // Example specific to forum
    // Add more relevant icons here
];

// --- Component ---
const CategoryForm: React.FC<CategoryFormProps> = ({ initialCategoryData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<ForumCategory>(() => {
    // Initialize form state
    return initialCategoryData || {
      name: '',
      description: '',
      color: '#4a5568', // Default color from model
      icon: 'book', // Default icon
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialCategoryData?._id;

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.name) {
      setError("Category Name is required.");
      return;
    }

    setIsLoading(true);

    // Prepare payload (what WOULD be sent)
    const payload = {
        name: formData.name,
        description: formData.description || '',
        color: formData.color || '#4a5568',
        icon: formData.icon || 'book',
        // Include gradientFrom/To if you add them to the form/model
    };

    // --- !!! BACKEND ACTION (COMMENTED OUT) !!! ---
    // The following API calls will FAIL until you implement
    // createCategory and updateCategory in your forumController.js
    // and define corresponding routes and api.js functions.
    try {
        console.log("Simulating save for category:", payload);
        if (isEditing && formData._id) {
             // await api.forum.updateCategory(formData._id, payload); // Uncomment when backend ready
             console.warn("Backend endpoint for updating category not implemented.");
        } else {
             // await api.forum.createCategory(payload); // Uncomment when backend ready
             console.warn("Backend endpoint for creating category not implemented.");
        }
        // Simulate success for UI flow
        alert(`Simulated ${isEditing ? 'update' : 'creation'} of category "${formData.name}". Backend not called.`);
        onSuccess(); // Call success callback to close modal etc.

    } catch (err: any) {
      console.error("Error saving category (simulation):", err);
      setError(`Failed to save category (simulation): ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
    // --- !!! END OF COMMENTED OUT BACKEND ACTION !!! ---
  };

  // --- Render ---
  return (
     <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto pr-2">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-white z-10 pt-2">
            <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Category' : 'Create New Category'}
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

        {/* Category Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full input-style"/>
            </div>

            {/* Description */}
             <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea id="description" name="description" rows={3} value={formData.description || ''} onChange={handleInputChange} className="w-full input-style"/>
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
                        <SubjectIcon iconName={formData.icon} color={formData.color} className="h-5 w-5"/>
                    </span>
                </div>
            </div>

            {/* Color */}
             <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="color" id="color" name="color" value={formData.color} onChange={handleInputChange} className="w-full h-10 border border-gray-300 rounded-md cursor-pointer p-1"/>
            </div>
             {/* Add inputs for gradientFrom and gradientTo if your model/styling uses them */}

        </div>


        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t pt-6 mt-8 sticky bottom-0 bg-white pb-4 z-10">
            <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 btn-primary flex items-center">
                {isLoading ? (
                     <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Saving...
                    </>
                ) : (isEditing ? 'Update Category' : 'Create Category')}
            </button>
        </div>

        {/* Styles */}
        <style jsx>{`
            .input-style { @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500; } /* Adjusted focus color */
            .btn-primary { @apply bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm; } /* Adjusted color */
            .btn-secondary { @apply bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm; }
        `}</style>
     </form>
  );
};

export default CategoryForm;