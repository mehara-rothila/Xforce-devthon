"use client";

import React, { useState, useRef, useEffect } from 'react'; // Added useEffect
import api from '@/utils/api';
import { X, UploadCloud, FileText, Loader2, Tag, Book, AlertCircle, FileType, Check, DollarSign, Info, Edit } from 'lucide-react'; // Added Edit

// --- Interfaces ---
interface Subject {
  _id: string;
  name: string;
}

interface ResourceFormData {
  _id?: string;
  title: string;
  description?: string;
  category: string;
  subject: string;
  type: string; // Should likely be fixed to 'PDF' based on upload logic
  size?: string; // Size will come from file or backend
  filePath: string; // File path will come from upload or initial data
  premium: boolean;
  // Add isActive if you want to control it from the form
  // isActive?: boolean;
}

interface ResourceFormProps {
  initialResourceData?: Partial<ResourceFormData> | null;
  availableSubjects: Subject[];
  onSuccess: () => void;
  onCancel: () => void;
}

// --- Constants ---
const resourceCategories = [
  { value: 'Past Papers', icon: '📝', description: 'Previous exam papers for practice' },
  { value: 'Notes', icon: '📒', description: 'Study materials and lecture notes' },
  { value: 'Practice Questions', icon: '❓', description: 'Exercises to test your knowledge' },
  { value: 'Tutorials', icon: '📚', description: 'Step-by-step learning guides' },
  { value: 'Reference', icon: '📖', description: 'Additional resources and references' },
  { value: 'Other', icon: '🔍', description: 'Other educational materials' }
];

const resourceTypes = [
  { value: 'PDF', icon: '📄', description: 'Portable Document Format' },
  // Add other types if your upload supports them
  // { value: 'Video', icon: '🎬', description: 'Video tutorials or lectures' },
];

// --- Component ---
const ResourceForm: React.FC<ResourceFormProps> = ({
    initialResourceData,
    availableSubjects,
    onSuccess,
    onCancel
}) => {
  const [formData, setFormData] = useState<Partial<ResourceFormData>>(() => {
    // Initialize form state, ensuring defaults are set
    return {
      title: initialResourceData?.title || '',
      description: initialResourceData?.description || '',
      category: initialResourceData?.category || resourceCategories[0].value,
      subject: typeof initialResourceData?.subject === 'object' ? initialResourceData.subject._id : initialResourceData?.subject || (availableSubjects?.length > 0 ? availableSubjects[0]._id : ''),
      type: 'PDF', // Hardcode to PDF since only PDF upload is handled
      premium: initialResourceData?.premium || false,
      filePath: initialResourceData?.filePath || '',
      size: initialResourceData?.size || '',
      _id: initialResourceData?._id || undefined, // Include _id if editing
    };
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(initialResourceData?.filePath || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // General loading for save operation
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialResourceData?._id;

  // Effect to update form if initial data changes (e.g., opening modal again)
  useEffect(() => {
      if (initialResourceData) {
          setFormData({
              title: initialResourceData.title || '',
              description: initialResourceData.description || '',
              category: initialResourceData.category || resourceCategories[0].value,
              subject: typeof initialResourceData.subject === 'object' ? initialResourceData.subject._id : initialResourceData.subject || '',
              type: 'PDF', // Keep as PDF
              premium: initialResourceData.premium || false,
              filePath: initialResourceData.filePath || '',
              size: initialResourceData.size || '',
              _id: initialResourceData._id || undefined,
          });
          setFilePreview(initialResourceData.filePath || null);
          setSelectedFile(null); // Reset selected file when opening for edit
      } else {
           // Reset for creation
           setFormData({ title: '', description: '', category: resourceCategories[0].value, subject: availableSubjects?.[0]?._id || '', type: 'PDF', premium: false, filePath: '', size: '' });
           setFilePreview(null);
           setSelectedFile(null);
      }
      setActiveStep(1); // Always start at step 1
      setError(null);
      setSuccess(null);
      setFormErrors({});
  }, [initialResourceData, availableSubjects]); // Depend on initial data

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (formErrors[name]) { setFormErrors(prev => { const newErrors = {...prev}; delete newErrors[name]; return newErrors; }); }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value, }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (formErrors.file) { setFormErrors(prev => { const newErrors = {...prev}; delete newErrors.file; return newErrors; }); }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') { setFormErrors(prev => ({...prev, file: 'Only PDF files are accepted'})); setSelectedFile(null); setFilePreview(isEditing ? initialResourceData?.filePath || null : null); e.target.value = ''; return; }
      const maxSizeMB = 20;
      if (file.size > maxSizeMB * 1024 * 1024) { setFormErrors(prev => ({...prev, file: `File size exceeds the ${maxSizeMB}MB limit`})); setSelectedFile(null); setFilePreview(isEditing ? initialResourceData?.filePath || null : null); e.target.value = ''; return; }
      setSelectedFile(file); setFilePreview(file.name);
    } else { setSelectedFile(null); setFilePreview(isEditing ? initialResourceData?.filePath || null : null); }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { /* ... (keep existing drop logic) ... */ };

  // --- Validation ---
  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    if (step === 1) {
      if (!selectedFile && (!isEditing || !formData.filePath)) { // Check existing filePath too
        newErrors.file = 'Please upload a PDF file';
      }
    } else if (step === 2) {
      if (!formData.title?.trim()) { newErrors.title = 'Title is required'; }
      else if (formData.title.length > 100) { newErrors.title = 'Title must be less than 100 characters'; }
      if (!formData.subject) { newErrors.subject = 'Please select a subject'; }
      if (!formData.category) { newErrors.category = 'Please select a category'; }
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Navigation ---
  const goToNextStep = () => { if (validateStep(activeStep)) { setActiveStep(prev => prev + 1); } };
  const goToPreviousStep = () => { setActiveStep(prev => Math.max(1, prev - 1)); };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (!validateStep(activeStep)) { return; } // Final validation

    setIsLoading(true); // General loading state for the whole process

    let uploadedFilePath = formData.filePath || '';
    let uploadedFileSize = formData.size || '';

    try {
      // Step 1: Upload file ONLY if a new file was selected
      if (selectedFile) {
        setIsUploading(true); setError(null);
        console.log("Uploading file...");
        try {
          const uploadResponse = await api.uploads.uploadResource(selectedFile);
          if (uploadResponse.data?.status === 'success' && uploadResponse.data.data?.filePath) {
             uploadedFilePath = uploadResponse.data.data.filePath;
             uploadedFileSize = uploadResponse.data.data.size ? `${(uploadResponse.data.data.size / (1024 * 1024)).toFixed(2)} MB` : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
             console.log("File uploaded successfully:", uploadedFilePath, uploadedFileSize);
          } else { throw new Error(uploadResponse.data?.message || "File upload failed: Invalid response."); }
        } catch (uploadErr: any) { throw new Error(`File upload failed: ${uploadErr.response?.data?.message || uploadErr.message || 'Network error'}`); }
        finally { setIsUploading(false); }
      } else if (!isEditing) {
          throw new Error("No file selected for new resource."); // Should be caught by validation
      }

      // Step 2: Prepare payload
      const resourcePayload = {
        title: formData.title?.trim() || '',
        description: formData.description?.trim() || '',
        category: formData.category || '',
        subject: formData.subject || '',
        type: 'PDF', // Hardcoded for now
        premium: formData.premium || false,
        filePath: uploadedFilePath,
        size: uploadedFileSize,
        // Only include isActive if you intend to control it via the form
        // isActive: formData.isActive === undefined ? true : formData.isActive,
      };

      // Step 3: Create or Update Resource
      console.log(`Saving resource data (${isEditing ? 'Update' : 'Create'})... Payload:`, resourcePayload);
      let resourceResponse;
      if (isEditing && formData._id) {
        resourceResponse = await api.resources.update(formData._id, resourcePayload);
      } else {
        resourceResponse = await api.resources.create(resourcePayload);
      }

      // Step 4: Handle Response
      if (resourceResponse.data?.status === 'success') {
        setSuccess(`Resource "${resourcePayload.title}" ${isEditing ? 'updated' : 'created'} successfully!`);
        setTimeout(() => { onSuccess(); }, 1500);
      } else { throw new Error(resourceResponse.data?.message || `Failed to ${isEditing ? 'update' : 'create'} resource.`); }

    } catch (err: any) {
      console.error("Error saving resource:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      // Ensure loading state is reset unless success message is showing
       if (!success) setIsLoading(false);
       // Ensure uploading state is reset
       setIsUploading(false);
    }
  };

  // Find subject name by ID
  const getSubjectName = (subjectId: string): string => {
    const subject = availableSubjects.find(s => s._id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (activeStep) {
      case 1: // Upload Step
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"> <FileText className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-500" /> Upload Resource File </h3>
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${ formErrors.file ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-gray-700' }`} onDragOver={handleDragOver} onDrop={handleDrop} >
                {selectedFile || filePreview ? (
                  <div className="space-y-4"> <div className="mx-auto w-16 h-16 flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400"> <FileText className="h-8 w-8" /> </div> <div> <p className="font-medium text-gray-900 dark:text-white">{selectedFile?.name || filePreview}</p> <p className="text-sm text-gray-500 dark:text-gray-400 mt-1"> {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Existing file'} </p> </div> <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); if (fileInputRef.current) { fileInputRef.current.value = ''; } }} className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" > Replace File </button> </div>
                ) : (
                  <div className="space-y-4"> <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400"> <UploadCloud className="h-8 w-8" /> </div> <div> <p className="text-lg font-medium text-gray-900 dark:text-white">Drop your file here or click to upload</p> <p className="text-sm text-gray-500 dark:text-gray-400 mt-1"> PDF files only (Max size: 20MB) </p> </div> <div> <label className="px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 cursor-pointer inline-block shadow-sm"> Select PDF File <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf" onChange={handleFileChange}/> </label> </div> </div>
                )}
              </div>
              {formErrors.file && ( <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"> <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.file} </p> )}
              {isEditing && !selectedFile && filePreview && ( <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"> <div className="flex items-start"> <Info className="h-5 w-5 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" /> <div> <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Editing Existing Resource</p> <p className="text-sm text-blue-600 dark:text-blue-400 mt-1"> Keeping current file: <code className='text-xs bg-blue-100 dark:bg-blue-900/50 px-1 rounded'>{filePreview}</code>. Upload a new PDF to replace it. </p> </div> </div> </div> )}
            </div>
          </div>
        );
      case 2: // Details Step
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"> <Tag className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-500" /> Resource Details </h3>
              <div className="space-y-5">
                {/* Title */}
                <div> <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Title <span className="text-red-500">*</span> </label> <input type="text" id="title" name="title" value={formData.title || ''} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 dark:focus:border-teal-400 bg-white dark:bg-gray-700 transition-colors ${ formErrors.title ? 'border-red-300 text-red-900 placeholder-red-300 dark:border-red-700 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' }`} placeholder="e.g., Physics Unit 3 Notes" /> {formErrors.title && ( <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"> <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.title} </p> )} </div>
                {/* Description */}
                <div> <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Description </label> <textarea id="description" name="description" rows={3} value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 dark:focus:border-teal-400" placeholder="Short description..." /> </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Subject */}
                  <div> <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Subject <span className="text-red-500">*</span> </label> <div className="relative"> <select id="subject" name="subject" value={formData.subject || ''} onChange={handleInputChange} className={`w-full pl-10 pr-10 py-2 border rounded-lg appearance-none bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 dark:focus:border-teal-400 ${ formErrors.subject ? 'border-red-300 text-red-900 dark:border-red-700 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' }`} > <option value="">Select subject</option> {availableSubjects.map(subject => ( <option key={subject._id} value={subject._id}>{subject.name}</option> ))} </select> <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <Book className="h-5 w-5 text-gray-400 dark:text-gray-500" /> </div> <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"> <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> </svg> </div> </div> {formErrors.subject && ( <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"> <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.subject} </p> )} </div>
                  {/* Category */}
                  <div> <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Category <span className="text-red-500">*</span> </label> <div className="relative"> <select id="category" name="category" value={formData.category || ''} onChange={handleInputChange} className={`w-full pl-10 pr-10 py-2 border rounded-lg appearance-none bg-white dark:bg-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-400 dark:focus:border-teal-400 ${ formErrors.category ? 'border-red-300 text-red-900 dark:border-red-700 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100' }`} > <option value="">Select category</option> {resourceCategories.map(cat => ( <option key={cat.value} value={cat.value}>{cat.value}</option> ))} </select> <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500" /> </div> <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"> <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"> <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /> </svg> </div> </div> {formErrors.category && ( <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"> <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.category} </p> )} </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  {/* File Type (Readonly) */}
                  <div> <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> File Type </label> <div className="relative"> <input type="text" value={formData.type || 'PDF'} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed" readOnly /> <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <FileType className="h-5 w-5 text-gray-400 dark:text-gray-500" /> </div> </div> </div>
                  {/* Premium Status */}
                  <div className="flex items-center h-full pt-6"> <div className="flex items-start"> <div className="flex items-center h-5"> <input id="premium" name="premium" type="checkbox" checked={formData.premium || false} onChange={handleInputChange} className="h-5 w-5 text-teal-600 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400 dark:bg-gray-700" /> </div> <div className="ml-3"> <label htmlFor="premium" className="font-medium text-gray-700 dark:text-gray-300 flex items-center"> <DollarSign className="h-4 w-4 mr-1 text-yellow-500" /> Premium Resource </label> <p className="text-xs text-gray-500 dark:text-gray-400"> Only premium subscribers can access </p> </div> </div> </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Review Step
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center"> <Check className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-500" /> Review & Confirm </h3>
              <div className="space-y-8">
                 {/* File Preview */}
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center border border-gray-200 dark:border-gray-700"> <div className="h-12 w-12 flex-shrink-0 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center mr-4"> <FileText className="h-6 w-6" /> </div> <div className="min-w-0 flex-1"> <p className="font-medium text-gray-900 dark:text-white truncate"> {selectedFile?.name || filePreview || 'No file selected'} </p> <p className="text-sm text-gray-500 dark:text-gray-400"> {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : isEditing && filePreview ? 'Existing file' : ''} </p> </div> </div>
                 {/* Resource Info */}
                 <div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="space-y-1"> <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p> <p className="text-base text-gray-900 dark:text-white">{formData.title}</p> </div> <div className="space-y-1"> <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</p> <p className="text-base text-gray-900 dark:text-white"> {formData.subject ? getSubjectName(formData.subject) : 'N/A'} </p> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="space-y-1"> <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p> <p className="text-base text-gray-900 dark:text-white"> {formData.category || 'N/A'} </p> </div> <div className="space-y-1"> <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p> <p className="text-base text-gray-900 dark:text-white">{formData.type || 'PDF'}</p> </div> </div> <div className="space-y-1"> <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p> <p className="text-base text-gray-900 dark:text-white"> {formData.description || <span className='italic text-gray-400'>None</span>} </p> </div> <div className="pt-2"> <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ formData.premium ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }`}> {formData.premium ? ( <><DollarSign className="mr-1 h-3.5 w-3.5" />Premium</> ) : ( <><Check className="mr-1 h-3.5 w-3.5" />Free</> )} </span> </div> </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 pt-2 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white"> {isEditing ? 'Edit Resource' : 'Upload New Resource'} </h2>
        <button type="button" onClick={onCancel} className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" aria-label="Close form"> <X className="h-6 w-6" /> </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8"> <div className="flex items-center"> {[1, 2, 3].map((step) => ( <React.Fragment key={step}> {step > 1 && ( <div className={`h-0.5 flex-1 ${ step <= activeStep ? 'bg-teal-500 dark:bg-teal-400' : 'bg-gray-200 dark:bg-gray-700' }`} ></div> )} <div className="relative flex flex-col items-center"> <button type="button" onClick={() => step < activeStep && setActiveStep(step)} disabled={step >= activeStep} className={`h-8 w-8 rounded-full flex items-center justify-center ${ step < activeStep ? 'bg-teal-500 text-white dark:bg-teal-400 hover:bg-teal-600 dark:hover:bg-teal-500' : step === activeStep ? 'bg-teal-500 text-white dark:bg-teal-400 ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' }`} > {step < activeStep ? ( <Check className="h-5 w-5" /> ) : ( <span>{step}</span> )} </button> <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400"> {step === 1 ? 'Upload' : step === 2 ? 'Details' : 'Review'} </span> </div> </React.Fragment> ))} </div> </div>

      {/* Messages */}
      {error && ( <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start" role="alert"> <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" /> <div className="flex-1"> <p className="text-sm text-red-700 dark:text-red-200">{error}</p> </div> <button type="button" onClick={() => setError(null)} className="ml-3 flex-shrink-0"> <X className="h-5 w-5 text-red-500 dark:text-red-400" /> </button> </div> )}
      {success && ( <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start" role="alert"> <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" /> <div className="flex-1"> <p className="text-sm text-green-700 dark:text-green-200">{success}</p> </div> {/* Success message auto-hides */} </div> )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <button type="button" onClick={goToPreviousStep} className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 ${ activeStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700' }`} disabled={activeStep === 1} > Previous </button>
          {activeStep < 3 ? ( <button type="button" onClick={goToNextStep} className="px-4 py-2 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 shadow-sm" > Continue </button> )
                         : ( <button type="submit" disabled={isLoading || isUploading} className="px-4 py-2 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" > {isLoading || isUploading ? ( <><Loader2 className="inline animate-spin -ml-1 mr-2 h-4 w-4" /> {isUploading ? 'Uploading...' : 'Saving...'}</> ) : isEditing ? 'Update Resource' : 'Create Resource'} </button> )}
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;