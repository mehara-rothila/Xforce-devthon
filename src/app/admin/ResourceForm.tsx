"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api'; // Use the updated api utility
import { X, UploadCloud, FileText, Loader2 } from 'lucide-react';

// --- Interfaces ---
interface Subject {
  _id: string;
  name: string;
}
// Interface for the data structure used within this form's state
interface ResourceFormData {
 _id?: string;
 title: string;
 description?: string;
 category: string;
 subject: string; // Subject ID
 type: string;
 size?: string; // Optional, can be set after upload
 filePath: string; // Will be set after upload or use existing
 premium: boolean;
 // Add other fields from your Resource model if needed in the form
}
// Interface for the component props
interface ResourceFormProps {
  initialResourceData?: Partial<ResourceFormData> | null; // Allow partial data for editing
  availableSubjects: Subject[]; // Pass subjects from parent
  onSuccess: () => void;
  onCancel: () => void;
}

// --- Constants ---
// Define categories and types based on your Resource model enums
const resourceCategories = ['Past Papers', 'Notes', 'Practice Questions', 'Tutorials', 'Reference', 'Other'];
const resourceTypes = ['PDF', 'Video', 'Notes', 'Interactive', 'Other']; // Ensure 'PDF' is included

// --- Component ---
const ResourceForm: React.FC<ResourceFormProps> = ({
    initialResourceData,
    availableSubjects, // Receive subjects as prop
    onSuccess,
    onCancel
}) => {
  const [formData, setFormData] = useState<Partial<ResourceFormData>>(() => {
    // Initialize form state
    return initialResourceData || {
      title: '',
      description: '',
      category: resourceCategories[0], // Default category
      subject: availableSubjects?.[0]?._id || '', // Default subject if available
      type: 'PDF', // Default type to PDF as per upload logic
      premium: false,
      filePath: '',
    };
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Show existing path or new file name
  const [filePreview, setFilePreview] = useState<string | null>(initialResourceData?.filePath || null);
  const [isUploading, setIsUploading] = useState<boolean>(false); // Specific loading state for file upload
  const [isLoading, setIsLoading] = useState<boolean>(false); // General loading state for submit
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialResourceData?._id;

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear previous file errors
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type (based on your upload route's filter)
      if (file.type !== 'application/pdf') {
          setError('Invalid file type. Please upload a PDF.');
          setSelectedFile(null);
          setFilePreview(isEditing ? initialResourceData?.filePath || null : null); // Reset preview
          e.target.value = ''; // Reset file input
          return;
      }
      // Optional: Add file size validation here if needed (e.g., < 20MB)
      const maxSizeMB = 20;
      if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
          setSelectedFile(null);
          setFilePreview(isEditing ? initialResourceData?.filePath || null : null); // Reset preview
          e.target.value = ''; // Reset file input
          return;
      }

      setSelectedFile(file);
      setFilePreview(file.name); // Show the name of the selected file
    } else {
      // No file selected or selection cancelled
      setSelectedFile(null);
      // If editing, revert preview to the original file path, otherwise null
      setFilePreview(isEditing ? initialResourceData?.filePath || null : null);
    }
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- Validation ---
    if (!formData.title || !formData.category || !formData.subject || !formData.type) {
      setError("Title, Category, Subject, and Type are required.");
      return;
    }
    // Require a file only when creating a new resource
    // If editing, a file is optional (user might only change metadata)
    if (!isEditing && !selectedFile) {
        setError("A resource file (PDF) must be uploaded for new resources.");
        return;
    }
    // --- End Validation ---

    setIsLoading(true); // Start overall loading

    let uploadedFilePath = formData.filePath || ''; // Use existing path if editing
    let fileSize = formData.size || '';

    // --- Step 1: Upload File (if a new file was selected) ---
    if (selectedFile) {
        setIsUploading(true);
        try {
            console.log("Uploading file:", selectedFile.name);
            // Use the upload function from api.js
            const uploadResponse = await api.uploads.uploadResource(selectedFile);

            if (uploadResponse.data?.status === 'success' && uploadResponse.data.data?.filePath) {
                uploadedFilePath = uploadResponse.data.data.filePath;
                // Calculate file size for display/storage
                fileSize = (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB';
                console.log("File uploaded successfully, path:", uploadedFilePath);
            } else {
                // Throw error if upload response is not as expected
                throw new Error(uploadResponse.data?.message || "File upload failed: Unexpected response from server.");
            }
        } catch (uploadError: any) {
            console.error("File upload error:", uploadError);
            setError(`File upload failed: ${uploadError.response?.data?.message || uploadError.message || 'Network error or server issue during upload.'}`);
            setIsUploading(false);
            setIsLoading(false);
            return; // Stop submission if upload fails
        } finally {
            setIsUploading(false); // End upload-specific loading
        }
    }

    // Ensure we have a file path before saving metadata (important for new resources)
    if (!uploadedFilePath) {
        setError("Resource file path is missing. Please select a file to upload.");
        setIsLoading(false);
        return;
    }

    // --- Step 2: Create/Update Resource Document ---
    const resourcePayload: Omit<Resource, '_id' | 'subject' | 'createdAt' | 'updatedAt' | 'isActive' | 'author'> & { subject: string } = {
        title: formData.title || '',
        description: formData.description || '',
        category: formData.category || '',
        subject: formData.subject || '', // Send subject ID
        type: formData.type || '',
        premium: formData.premium || false,
        filePath: uploadedFilePath,
        size: fileSize, // Include size
        downloads: isEditing ? initialResourceData?.downloads || 0 : 0, // Keep existing downloads if editing
        date: isEditing ? initialResourceData?.date || new Date().toISOString() : new Date().toISOString(), // Keep existing date or set new
    };

    try {
        console.log("Saving resource data:", resourcePayload);
        if (isEditing && initialResourceData?._id) {
            await api.resources.update(initialResourceData._id, resourcePayload);
        } else {
            await api.resources.create(resourcePayload);
        }
        onSuccess(); // Call success callback from parent
    } catch (saveError: any) {
        console.error("Error saving resource data:", saveError);
        let errorMessage = `Failed to save resource: ${saveError.message || 'Unknown error'}`;
         if (saveError.response?.data?.message) {
            errorMessage = `Failed to save resource: ${saveError.response.data.message}`;
        } else if (saveError.response?.data?.errors) {
            const errorDetails = Object.values(saveError.response.data.errors).map((e: any) => e.message).join(', ');
            errorMessage = `Validation failed: ${errorDetails}`;
        }
        setError(errorMessage);
    } finally {
        setIsLoading(false); // Turn off general loading
    }
  };


  // --- Render ---
  return (
     <form onSubmit={handleSubmit} className="space-y-6 max-h-[85vh] overflow-y-auto pr-2">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-white z-10 pt-2">
            <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Resource' : 'Create New Resource'}
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

        {/* Resource Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" id="title" name="title" value={formData.title || ''} onChange={handleInputChange} required className="w-full input-style"/>
            </div>

             {/* Subject */}
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                {/* Use the passed availableSubjects prop */}
                <select id="subject" name="subject" value={formData.subject || ''} onChange={handleInputChange} required className="w-full input-style appearance-none bg-white" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                    <option value="" disabled>Select a subject</option>
                    {availableSubjects.map(sub => ( <option key={sub._id} value={sub._id}>{sub.name}</option> ))}
                </select>
            </div>

             {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select id="category" name="category" value={formData.category || ''} onChange={handleInputChange} required className="w-full input-style appearance-none bg-white" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                    {resourceCategories.map(cat => ( <option key={cat} value={cat}>{cat}</option> ))}
                </select>
            </div>

             {/* Type */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                 <select id="type" name="type" value={formData.type || ''} onChange={handleInputChange} required className="w-full input-style appearance-none bg-white" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                    {resourceTypes.map(type => ( <option key={type} value={type}>{type}</option> ))}
                </select>
            </div>

             {/* Premium Status */}
            <div className="flex items-center pt-5">
                <input id="premium" name="premium" type="checkbox" checked={formData.premium || false} onChange={handleInputChange} className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"/>
                <label htmlFor="premium" className="ml-2 block text-sm text-gray-900">Premium Resource</label>
            </div>

             {/* Description */}
            <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea id="description" name="description" rows={3} value={formData.description || ''} onChange={handleInputChange} className="w-full input-style"/>
            </div>

             {/* File Upload */}
            <div className="md:col-span-2">
                 <label htmlFor="resourceFile" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource File (PDF only, max 20MB) {isEditing ? '(Optional: Upload to replace existing)' : <span className="text-red-500">*</span>}
                 </label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                        <label htmlFor="resourceFile-input" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="resourceFile-input" name="resourceFile" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 20MB</p>
                        {filePreview && (
                            <div className="mt-2 text-sm text-gray-700 flex items-center justify-center">
                                <FileText className="h-4 w-4 mr-1 text-gray-500"/>
                                <span className='truncate max-w-xs'>{filePreview}</span>
                            </div>
                        )}
                        {isUploading && (
                            <div className="mt-2 flex items-center justify-center text-sm text-blue-600">
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Uploading...
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 border-t pt-6 mt-8 sticky bottom-0 bg-white pb-4 z-10">
            <button type="button" onClick={onCancel} disabled={isLoading || isUploading} className="px-4 py-2 btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading || isUploading} className="px-4 py-2 btn-primary flex items-center">
                {(isLoading || isUploading) ? (
                     <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Saving...
                    </>
                ) : (isEditing ? 'Update Resource' : 'Create Resource')}
            </button>
        </div>

        {/* Styles */}
        <style jsx>{`
            .input-style { @apply px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500; }
            .btn-primary { @apply bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm; } /* Changed color */
            .btn-secondary { @apply bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm; }
        `}</style>
     </form>
  );
};

export default ResourceForm;