"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api'; // Use the updated api utility
import { X, Loader2, AlertCircle, Check, Palette, Tag, FileText, Layout, Edit, List, MessageCircle, MessageSquare, Eye } from 'lucide-react';
import SubjectIcon from '@/components/icons/SubjectIcon'; // Reusing SubjectIcon for categories

// --- Interfaces ---
interface ForumCategory {
  _id?: string; // Optional for new categories
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  topicsCount?: number; // Added for preview
  postsCount?: number; // Added for preview
}

interface CategoryFormProps {
  initialCategoryData?: ForumCategory | null;
  onSuccess: () => void; // Callback on successful save
  onCancel: () => void; // Callback to close the form/modal
  isPreviewMode?: boolean; // Added preview mode prop
}

// --- Define Available Icons ---
const availableIcons = [
    { name: 'Book (Default)', value: 'book' },
    { name: 'Atom (Physics)', value: 'atom' },
    { name: 'Flask (Chemistry)', value: 'flask' },
    { name: 'Calculator (Math)', value: 'calculator' },
    { name: 'Globe (Geography/Other)', value: 'globe' },
    { name: 'Chat Bubble', value: 'chat' },
    { name: 'Light Bulb', value: 'lightbulb' },
    // Add more relevant icons here
];

// Predefined color palette
const colorPalette = [
  '#4299E1', // blue-500
  '#48BB78', // green-500
  '#ED8936', // orange-500
  '#9F7AEA', // purple-500
  '#F56565', // red-500
  '#ECC94B', // yellow-500
  '#38B2AC', // teal-500
  '#ED64A6', // pink-500
  '#667EEA', // indigo-500
  '#4A5568', // gray-600
];

// --- Component ---
const CategoryForm: React.FC<CategoryFormProps> = ({ initialCategoryData, onSuccess, onCancel, isPreviewMode = false }) => {
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
  const [success, setSuccess] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const isEditing = !!initialCategoryData?._id;

  // Validation states
  const [nameError, setNameError] = useState<string | null>(null);

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
    // Clear field-specific errors as user types
    if (name === 'name' && nameError) { setNameError(null); }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectColor = (color: string) => {
    if (isPreviewMode) return; // Prevent changes in preview mode
    setFormData(prev => ({ ...prev, color }));
  };

  const validateForm = (): boolean => {
    let valid = true;
    setNameError(null); // Reset errors on new validation
    if (!formData.name.trim()) { setNameError("Category name is required"); valid = false; }
    else if (formData.name.length > 50) { setNameError("Category name must be under 50 characters"); valid = false; }
    return valid;
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
    setSuccess(null);

    if (!validateForm()) { return; } // Stop if validation fails

    setIsLoading(true);

    const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        color: formData.color || '#4a5568',
        icon: formData.icon || 'book',
        // Add gradientFrom/To if needed, deriving from color if necessary
        gradientFrom: formData.color || '#4a5568', // Example: default gradient same as color
        gradientTo: formData.color ? (formData.color.length === 7 ? formData.color.substring(0, 5) + 'aa' : '#cccccc') : '#6a7588', // Example: slightly darker/transparent gradientTo
    };

    // --- !!! ENABLED BACKEND ACTION !!! ---
    try {
        console.log("Attempting to save category:", payload);
        let response;
        if (isEditing && formData._id) {
             console.log(`Calling updateCategory for ID: ${formData._id}`);
             // --- UNCOMMENTED API CALL ---
             response = await api.forum.updateCategory(formData._id, payload);
             // ---------------------------
        } else {
             console.log(`Calling createCategory`);
             // --- UNCOMMENTED API CALL ---
             response = await api.forum.createCategory(payload);
             // ---------------------------
        }

        // Check response status from your API structure (adjust if needed)
        // Assuming backend sends { status: 'success', ... } or throws error
        if (response.data?.status === 'success') {
            setSuccess(`Successfully ${isEditing ? 'updated' : 'created'} category "${formData.name}"`);
            // Call onSuccess callback after a short delay to show message
            setTimeout(() => {
                onSuccess(); // Close modal and refresh list in parent
            }, 1500); // 1.5 second delay
        } else {
             // Handle cases where API returns success=false or unexpected structure
             throw new Error(response.data?.message || "Failed to save category due to unexpected API response.");
        }

    } catch (err: any) {
      console.error("Error saving category:", err);
      // Extract more specific error message if available
      let errorMessage = `Failed to save category: ${err.message || 'Unknown error'}`;
      if (err.response?.data?.message) {
          errorMessage = `Failed to save category: ${err.response.data.message}`;
      } else if (err.response?.data?.errors) {
          // Handle Mongoose validation errors array if backend sends it
          const errorDetails = Object.values(err.response.data.errors).map((e: any) => e.message).join(', ');
          errorMessage = `Validation failed: ${errorDetails}`;
      }
      setError(errorMessage);
      setIsLoading(false); // Ensure loading stops on error
    }
    // Removed finally block for isLoading as success needs delay before calling onSuccess
    // --- !!! END OF ENABLED BACKEND ACTION !!! ---
  };

  const togglePreview = () => { setPreviewMode(!previewMode); };

  // --- Render ---
  return (
     <div className="w-full max-w-3xl mx-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 pt-2 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                {isEditing ? ( <><Edit className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />Edit Category</> )
                           : ( <><Layout className="h-5 w-5 mr-2 text-cyan-500 dark:text-cyan-400" />Create New Category</> )}
                {isPreviewMode && <span className="ml-2 text-sm font-normal text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md flex items-center"><Eye className="h-3.5 w-3.5 mr-1" />Preview Only</span>}
            </h2>
            <div className="flex items-center space-x-2">
                <button type="button" onClick={togglePreview} className={`px-3 py-1.5 text-sm rounded-md border ${ previewMode ? 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600' }`}>
                    {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button type="button" onClick={onCancel} className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" aria-label="Close form">
                    <X className="h-6 w-6" />
                </button>
            </div>
        </div>

        {/* Messages */}
        {error && (
           <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start" role="alert">
               <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
               <div className="flex-1"> <strong className="font-medium text-red-800 dark:text-red-300">Error:</strong> <p className="text-sm text-red-700 dark:text-red-200 mt-1">{error}</p> </div>
               <button type="button" onClick={() => setError(null)} className="ml-3 flex-shrink-0 p-1 rounded-md text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"> <X className="h-5 w-5" /> </button>
           </div>
        )}
        {success && (
           <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start" role="alert">
               <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
               <div className="flex-1"> <strong className="font-medium text-green-800 dark:text-green-300">Success!</strong> <p className="text-sm text-green-700 dark:text-green-200 mt-1">{success}</p> </div>
               {/* Success message auto-hides via timeout in handleSubmit */}
           </div>
        )}
        
        {/* Preview Mode Banner */}
        {isPreviewMode && !previewMode && !error && (
           <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start" role="alert">
               <Eye className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
               <div className="flex-1"> 
                 <strong className="font-medium text-amber-800 dark:text-amber-300">Preview Mode</strong> 
                 <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                   You are viewing in preview mode. Form inputs are disabled and no changes can be saved.
                 </p> 
               </div>
           </div>
        )}

        {/* Preview Mode */}
        {previewMode ? (
           <div className="animate-fadeIn space-y-6">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700" style={{ borderLeftWidth: '4px', borderLeftColor: formData.color || '#4a5568' }}>
               <div className="p-6">
                 <div className="flex items-center mb-4">
                   <div className="h-12 w-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${formData.color || '#4a5568'}20` }}>
                     <SubjectIcon iconName={formData.icon} color={formData.color || '#4a5568'} className="h-7 w-7" />
                   </div>
                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{formData.name || 'Category Name'}</h3>
                 </div>
                 <p className="text-gray-600 dark:text-gray-300 mb-6">{formData.description || 'No description provided.'}</p>
                 <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                   <div className="text-sm text-gray-500 dark:text-gray-400">Created just now</div>
                   <div className="flex space-x-2">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                       <List className="h-3.5 w-3.5 mr-1" /> {isEditing ? initialCategoryData?.topicsCount ?? 0 : 0} Topics
                     </span>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                       <MessageSquare className="h-3.5 w-3.5 mr-1" /> {isEditing ? initialCategoryData?.postsCount ?? 0 : 0} Posts
                     </span>
                   </div>
                 </div>
               </div>
             </div>
             <div className="flex justify-end">
               <button type="button" onClick={togglePreview} className="px-4 py-2 btn-secondary mr-3">Edit Details</button>
               <button 
                 type="button" 
                 onClick={handleSubmit} 
                 disabled={isLoading || isPreviewMode} 
                 className={`px-4 py-2 btn-primary flex items-center ${isPreviewMode ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isLoading ? ( <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" /> Saving...</> ) : 
                  isPreviewMode ? ( <><Eye className="h-4 w-4 mr-2" /> Preview Mode</> ) : 
                  isEditing ? 'Update Category' : 'Create Category'}
               </button>
             </div>
           </div>
        ) : (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5 flex items-center"> <Tag className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" /> Basic Information </h3>
               <div className="space-y-6">
                 {/* Name */}
                 <div>
                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Category Name <span className="text-red-500">*</span> </label>
                   <div className="relative">
                     <input 
                       type="text" 
                       id="name" 
                       name="name" 
                       value={formData.name} 
                       onChange={handleInputChange} 
                       className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 transition-colors ${ 
                         nameError ? 'border-red-300 text-red-900 placeholder-red-300 dark:border-red-700 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' 
                       } ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`} 
                       placeholder="e.g., Physics, General Discussion" 
                       disabled={isPreviewMode}
                     />
                     {nameError && ( <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"> <AlertCircle className="h-4 w-4 mr-1" /> {nameError} </p> )}
                   </div>
                 </div>
                 {/* Description */}
                 <div>
                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Description (Optional) </label>
                   <textarea 
                     id="description" 
                     name="description" 
                     rows={3} 
                     value={formData.description || ''} 
                     onChange={handleInputChange} 
                     className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`} 
                     placeholder="Briefly describe the purpose of this category" 
                     disabled={isPreviewMode}
                   />
                   <p className="mt-1 text-xs text-gray-500 dark:text-gray-400"> A good description helps users understand what discussions belong in this category. </p>
                 </div>
               </div>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5 flex items-center"> <Palette className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" /> Appearance </h3>
               <div className="space-y-6">
                 {/* Color */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"> Category Color </label>
                   <div className="flex flex-wrap gap-3 mb-3">
                     {colorPalette.map(color => ( 
                      <button 
                        key={color} 
                        type="button" 
                        onClick={() => selectColor(color)} 
                        className={`h-8 w-8 rounded-full border-2 transition-all ${ 
                          formData.color === color ? 'border-gray-900 dark:border-white transform scale-110' : 'border-transparent hover:scale-105' 
                        } ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`} 
                        style={{ backgroundColor: color }} 
                        aria-label={`Select color ${color}`}
                        disabled={isPreviewMode}
                      /> 
                     ))}
                     <div className="flex items-center"> 
                       <input 
                         type="color" 
                         value={formData.color} 
                         onChange={(e) => isPreviewMode ? null : setFormData(prev => ({ ...prev, color: e.target.value }))} 
                         className={`h-8 w-8 border-0 p-0 rounded-md cursor-pointer ${isPreviewMode ? 'opacity-75 cursor-not-allowed' : ''}`}
                         disabled={isPreviewMode}
                       /> 
                     </div>
                   </div>
                   <div className="flex items-center mt-2"> <div className="w-12 h-6 rounded mr-3" style={{ backgroundColor: formData.color }}></div> <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"> {formData.color} </code> </div>
                 </div>
                 {/* Icon */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"> Category Icon </label>
                   <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-4">
                     {availableIcons.map(icon => ( 
                      <button 
                        key={icon.value} 
                        type="button" 
                        onClick={() => isPreviewMode ? null : setFormData(prev => ({ ...prev, icon: icon.value }))} 
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${ 
                          formData.icon === icon.value ? 'bg-cyan-50 ring-2 ring-cyan-500 text-cyan-700 dark:bg-cyan-900/30 dark:ring-cyan-600 dark:text-cyan-300' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600' 
                        } ${isPreviewMode ? 'opacity-75 cursor-not-allowed hover:bg-white dark:hover:bg-gray-700' : ''}`}
                        disabled={isPreviewMode}
                      > 
                        <SubjectIcon iconName={icon.value} color={formData.icon === icon.value ? formData.color : undefined} className="h-6 w-6 mb-1" /> 
                        <span className="text-xs truncate max-w-full">{icon.name.split(' ')[0]}</span> 
                      </button> 
                     ))}
                   </div>
                   <div className="flex items-center mt-2"> <div className="p-2 rounded-md mr-3" style={{ backgroundColor: `${formData.color}20` }}> <SubjectIcon iconName={formData.icon} color={formData.color} className="h-6 w-6" /> </div> <span className="text-sm text-gray-600 dark:text-gray-400">Selected icon: {availableIcons.find(i => i.value === formData.icon)?.name || formData.icon}</span> </div>
                 </div>
               </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-800 dark:via-gray-800 pt-3 pb-2 -mx-6 px-6">
                <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 btn-secondary">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isLoading || isPreviewMode} 
                  className={`px-4 py-2 btn-primary flex items-center ${isPreviewMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? ( <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" /> Saving...</> ) : 
                     isPreviewMode ? ( <><Eye className="h-4 w-4 mr-2" /> Preview Mode</> ) : 
                     isEditing ? 'Update Category' : 'Create Category'}
                </button>
            </div>
        </form>
       )}

        {/* Reusable Styles */}
        <style jsx>{`
            .input-style { @apply px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-cyan-400 dark:focus:border-cyan-400; }
            .btn-primary { @apply bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:bg-cyan-700 dark:hover:bg-cyan-600; }
            .btn-secondary { @apply bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 shadow-sm; }
        `}</style>
     </div>
  );
};

export default CategoryForm;