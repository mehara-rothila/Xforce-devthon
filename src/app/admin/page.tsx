"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api'; // Use the updated api utility
import QuizList from './QuizList';
import QuizForm from './QuizForm';
import SubjectList from './SubjectList';
import SubjectForm from './SubjectForm';
import ResourceList from './ResourceList';
import ResourceForm from './ResourceForm';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm'; // Import later when backend ready
import TopicList from './TopicList'; // Import component (will create next)
import { PlusCircle, BookOpen, HelpCircle, FileText, MessageSquare, X, Loader2 } from 'lucide-react'; // Added icons

// --- Interfaces ---
// Quiz Interfaces
interface QuizSubjectInfo { _id: string; name: string; color?: string; icon?: string; }
interface Quiz { _id: string; title: string; subject: QuizSubjectInfo | string; difficulty: 'easy' | 'medium' | 'hard'; questions: any[]; totalQuestions?: number; timeLimit: number; isPublished?: boolean; attempts?: number; rating?: number; createdAt?: string; updatedAt?: string; }
// Subject Interfaces
interface Topic { _id?: string; name: string; description?: string; order?: number; resources?: string[]; } // This is Subject Topic
interface Subject { _id: string; name: string; description: string; color?: string; gradientFrom?: string; gradientTo?: string; icon?: string; topics: Topic[]; isActive?: boolean; createdAt?: string; updatedAt?: string; topicCount?: number; }
// Resource Interfaces
interface ResourceSubjectInfo { _id: string; name: string; color?: string; }
interface Resource { _id: string; title: string; description?: string; category: string; subject: ResourceSubjectInfo | string; type: string; size: string; filePath: string; downloads: number; premium: boolean; date: string; isActive?: boolean; createdAt?: string; updatedAt?: string; author?: any; }
// Forum Interfaces
interface ForumCategory { _id: string; name: string; description?: string; color?: string; icon?: string; topicsCount?: number; postsCount?: number; createdAt?: string; updatedAt?: string; }
interface ForumTopic { _id: string; title: string; author: { _id: string; name: string; }; views: number; repliesCount: number; createdAt: string; }


// --- Component ---
export default function AdminDashboard() {
  // Quiz State
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState<boolean>(true);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [showQuizFormModal, setShowQuizFormModal] = useState<boolean>(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Subject State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(true);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [showSubjectFormModal, setShowSubjectFormModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Resource State
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(true);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [showResourceFormModal, setShowResourceFormModal] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Forum Category State
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [showCategoryFormModal, setShowCategoryFormModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);

  // Forum Topic Modal State
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [selectedCategoryForTopics, setSelectedCategoryForTopics] = useState<ForumCategory | null>(null);
  const [topicsForSelectedCategory, setTopicsForSelectedCategory] = useState<ForumTopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [topicError, setTopicError] = useState<string | null>(null);


  // --- Data Fetching ---
  const fetchQuizzes = useCallback(async () => {
    setIsLoadingQuizzes(true);
    setQuizError(null);
    try {
      const response = await api.quizzes.getAll({ limit: 100, isPublished: 'all' });
      const fetchedQuizzes = response.data?.data?.quizzes || [];
      if (Array.isArray(fetchedQuizzes)) {
        setQuizzes(fetchedQuizzes);
      } else {
        console.error("Fetched quizzes data is not an array:", fetchedQuizzes);
        setQuizError("Received invalid data format for quizzes.");
        setQuizzes([]);
      }
    } catch (err: any) {
      console.error("Error fetching quizzes:", err);
      setQuizError(`Failed to load quizzes: ${err.message || 'Unknown error'}`);
      setQuizzes([]);
    } finally {
      setIsLoadingQuizzes(false);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    setIsLoadingSubjects(true);
    setSubjectError(null);
    try {
      const response = await api.subjects.getAll();
      const fetchedSubjects = response.data?.data?.subjects || [];
       if (Array.isArray(fetchedSubjects)) {
        setSubjects(fetchedSubjects);
      } else {
        console.error("Fetched subjects data is not an array:", fetchedSubjects);
        setSubjectError("Received invalid data format for subjects.");
        setSubjects([]);
      }
    } catch (err: any) {
        console.error("Error fetching subjects:", err);
        setSubjectError(`Failed to load subjects: ${err.message || 'Unknown error'}`);
        setSubjects([]);
    } finally {
        setIsLoadingSubjects(false);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    setIsLoadingResources(true);
    setResourceError(null);
    try {
      const response = await api.resources.getAll({ limit: 100 /*, isActive: 'all' */ });
      const fetchedResources = response.data?.data?.resources || [];
      if (Array.isArray(fetchedResources)) {
        setResources(fetchedResources);
      } else {
        console.error("Fetched resources data is not an array:", fetchedResources);
        setResourceError("Received invalid data format for resources.");
        setResources([]);
      }
    } catch (err: any) {
      console.error("Error fetching resources:", err);
      setResourceError(`Failed to load resources: ${err.message || 'Unknown error'}`);
      setResources([]);
    } finally {
      setIsLoadingResources(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setCategoryError(null);
    try {
      const response = await api.forum.getCategories();
      const fetchedCategories = response.data?.data || []; // Adjust based on actual API response
      if (Array.isArray(fetchedCategories)) {
        setCategories(fetchedCategories);
      } else {
        console.error("Fetched categories data is not an array:", fetchedCategories);
        setCategoryError("Received invalid data format for categories.");
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setCategoryError(`Failed to load categories: ${err.message || 'Unknown error'}`);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Fetch Topics for a specific category
  const fetchTopicsForCategory = useCallback(async (categoryId: string) => {
    if (!categoryId) return;
    setIsLoadingTopics(true);
    setTopicError(null);
    setTopicsForSelectedCategory([]); // Clear previous topics
    try {
        const response = await api.forum.getTopicsByCategory(categoryId, { limit: 500 }); // Fetch many topics for admin view
        const fetchedTopics = response.data?.data || []; // Adjust based on actual API response structure
        if (Array.isArray(fetchedTopics)) {
            setTopicsForSelectedCategory(fetchedTopics);
        } else {
            console.error("Fetched topics data is not an array:", fetchedTopics);
            setTopicError("Received invalid data format for topics.");
        }
    } catch(err: any) {
        console.error(`Error fetching topics for category ${categoryId}:`, err);
        setTopicError(`Failed to load topics: ${err.message || 'Unknown error'}`);
    } finally {
        setIsLoadingTopics(false);
    }
  }, []);


  // Initial data fetch
  useEffect(() => {
    fetchQuizzes();
    fetchSubjects();
    fetchResources();
    fetchCategories();
  }, [fetchQuizzes, fetchSubjects, fetchResources, fetchCategories]);

  // --- Quiz Handlers ---
  const handleCreateNewQuiz = () => { setEditingQuiz(null); setShowQuizFormModal(true); };
  const handleEditQuiz = (quiz: Quiz) => { setEditingQuiz(quiz); setShowQuizFormModal(true); };
  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This is permanent.')) {
      try {
        await api.quizzes.delete(quizId);
        fetchQuizzes();
      } catch (err: any) { console.error('Error deleting quiz:', err); setQuizError(`Failed to delete quiz: ${err.message || 'Unknown error'}`); }
    }
  };
  const handleCloseQuizModal = () => { setShowQuizFormModal(false); setEditingQuiz(null); };
  const handleQuizFormSuccess = () => { handleCloseQuizModal(); fetchQuizzes(); };

  // --- Subject Handlers ---
  const handleCreateNewSubject = () => { setEditingSubject(null); setShowSubjectFormModal(true); };
  const handleEditSubject = (subject: Subject) => { setEditingSubject(subject); setShowSubjectFormModal(true); };
  const handleDeleteSubject = async (subjectId: string) => {
    if (window.confirm('Are you sure you want to deactivate this subject? It will be hidden but not permanently deleted.')) {
      try {
        await api.subjects.delete(subjectId); // Soft delete
        fetchSubjects();
      } catch (err: any) { console.error('Error deactivating subject:', err); setSubjectError(`Failed to deactivate subject: ${err.message || 'Unknown error'}`); }
    }
  };
   const handleCloseSubjectModal = () => { setShowSubjectFormModal(false); setEditingSubject(null); };
  const handleSubjectFormSuccess = () => { handleCloseSubjectModal(); fetchSubjects(); };

  // --- Resource Handlers ---
   const handleCreateNewResource = () => { setEditingResource(null); setShowResourceFormModal(true); };
  const handleEditResource = (resource: Resource) => { setEditingResource(resource); setShowResourceFormModal(true); };
   const handleDeleteResource = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource and its associated file? This is permanent.')) {
      try {
        await api.resources.delete(resourceId); // Backend handles file deletion too
        fetchResources();
      } catch (err: any) { console.error('Error deleting resource:', err); setResourceError(`Failed to delete resource: ${err.message || 'Unknown error'}`); }
    }
  };
   const handleCloseResourceModal = () => { setShowResourceFormModal(false); setEditingResource(null); };
  const handleResourceFormSuccess = () => { handleCloseResourceModal(); fetchResources(); };

  // --- Forum Category Handlers ---
   const handleCreateNewCategory = () => {
    alert("Backend endpoint for creating categories is not yet implemented.");
    // setEditingCategory(null);
    // setShowCategoryFormModal(true);
  };
  const handleEditCategory = (category: ForumCategory) => {
     alert("Backend endpoint for updating categories is not yet implemented.");
    // setEditingCategory(category);
    // setShowCategoryFormModal(true);
  };
   const handleDeleteCategory = async (categoryId: string) => {
     alert("Backend endpoint for deleting categories is not yet implemented.");
    // if (window.confirm('Are you sure you want to delete this category? This might affect existing topics.')) {
    //   try {
    //     // await api.forum.deleteCategory(categoryId); // Needs backend implementation
    //     // fetchCategories();
    //   } catch (err: any) {
    //     console.error('Error deleting category:', err);
    //     setCategoryError(`Failed to delete category: ${err.message || 'Unknown error'}`);
    //   }
    // }
  };
   const handleCloseCategoryModal = () => {
    setShowCategoryFormModal(false);
    setEditingCategory(null);
  };
  const handleCategoryFormSuccess = () => {
    handleCloseCategoryModal();
    fetchCategories(); // Refresh list
  };

  // --- Forum Topic Handlers ---
  const handleViewTopics = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
        setSelectedCategoryForTopics(category);
        setShowTopicModal(true);
        fetchTopicsForCategory(categoryId);
    } else {
        console.error("Category not found for ID:", categoryId);
        setCategoryError("Could not find the selected category.");
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
     if (!selectedCategoryForTopics) return;

     if (window.confirm(`Are you sure you want to delete this topic? This will also delete all its replies.`)) {
        try {
            setIsLoadingTopics(true);
            await api.forum.deleteTopic(topicId);
            fetchTopicsForCategory(selectedCategoryForTopics._id); // Refresh modal list
            fetchCategories(); // Refresh category list (for counts)
        } catch (err: any) {
             console.error('Error deleting topic:', err);
             setTopicError(`Failed to delete topic: ${err.message || 'Unknown error'}`);
             setIsLoadingTopics(false);
        }
     }
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
    setSelectedCategoryForTopics(null);
    setTopicsForSelectedCategory([]);
    setTopicError(null);
  };


  // --- Rendering ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">Admin Dashboard</h1>

        {/* Quiz Management Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 flex items-center">
                    <HelpCircle className="h-6 w-6 mr-2 text-purple-600"/> Quiz Management
                </h2>
                <button onClick={handleCreateNewQuiz} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                    <PlusCircle className="h-5 w-5 mr-2" /> Create New Quiz
                </button>
             </div>
             {isLoadingQuizzes && ( <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div><p className="text-gray-600">Loading quizzes...</p></div> )}
             {!isLoadingQuizzes && quizError && ( <div className="text-center py-10 max-w-md mx-auto bg-red-50 p-6 rounded-lg border border-red-200 shadow-lg"><div className="text-red-500 text-3xl mb-3">⚠️</div><p className="text-red-700">{quizError}</p><button onClick={fetchQuizzes} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"> Retry </button></div> )}
             {!isLoadingQuizzes && !quizError && ( <QuizList quizzes={quizzes} onEdit={handleEditQuiz} onDelete={handleDeleteQuiz} /> )}
        </section>

        {/* Subject Management Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-indigo-600"/> Subject Management
                </h2>
                <button onClick={handleCreateNewSubject} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <PlusCircle className="h-5 w-5 mr-2" /> Create New Subject
                </button>
             </div>
             {isLoadingSubjects && ( <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-3"></div><p className="text-gray-600">Loading subjects...</p></div> )}
             {!isLoadingSubjects && subjectError && ( <div className="text-center py-10 max-w-md mx-auto bg-red-50 p-6 rounded-lg border border-red-200 shadow-lg"><div className="text-red-500 text-3xl mb-3">⚠️</div><p className="text-red-700">{subjectError}</p><button onClick={fetchSubjects} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"> Retry </button></div> )}
             {!isLoadingSubjects && !subjectError && ( <SubjectList subjects={subjects} onEdit={handleEditSubject} onDelete={handleDeleteSubject} /> )}
        </section>

        {/* Resource Management Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-teal-600"/> Resource Management
                </h2>
                <button onClick={handleCreateNewResource} className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    <PlusCircle className="h-5 w-5 mr-2" /> Create New Resource
                </button>
           </div>
           {isLoadingResources && ( <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-3"></div><p className="text-gray-600">Loading resources...</p></div> )}
           {!isLoadingResources && resourceError && ( <div className="text-center py-10 max-w-md mx-auto bg-red-50 p-6 rounded-lg border border-red-200 shadow-lg"><div className="text-red-500 text-3xl mb-3">⚠️</div><p className="text-red-700">{resourceError}</p><button onClick={fetchResources} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"> Retry </button></div> )}
           {!isLoadingResources && !resourceError && ( <ResourceList resources={resources} onEdit={handleEditResource} onDelete={handleDeleteResource} /> )}
        </section>

        {/* Forum Category Management Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-cyan-600"/> Forum Category Management
                </h2>
                <button onClick={handleCreateNewCategory} disabled title="Backend endpoint needed" className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <PlusCircle className="h-5 w-5 mr-2" /> Create New Category
                </button>
           </div>
           {isLoadingCategories && ( <div className="text-center py-10"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-3"></div><p className="text-gray-600">Loading categories...</p></div> )}
           {!isLoadingCategories && categoryError && ( <div className="text-center py-10 max-w-md mx-auto bg-red-50 p-6 rounded-lg border border-red-200 shadow-lg"><div className="text-red-500 text-3xl mb-3">⚠️</div><p className="text-red-700">{categoryError}</p><button onClick={fetchCategories} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"> Retry </button></div> )}
           {!isLoadingCategories && !categoryError && (
                <CategoryList
                    categories={categories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onViewTopics={handleViewTopics}
                />
           )}
        </section>

      </div> {/* End max-w-7xl */}

      {/* --- Modals --- */}

      {/* Quiz Form Modal */}
      {showQuizFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-50 my-auto max-h-[90vh] flex flex-col">
            <div className="flex-grow overflow-y-auto p-6">
              <QuizForm initialQuizData={editingQuiz} onSuccess={handleQuizFormSuccess} onCancel={handleCloseQuizModal} />
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseQuizModal}></div>
        </div>
      )}

       {/* Subject Form Modal */}
       {showSubjectFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl z-50 my-auto max-h-[90vh] flex flex-col">
            <div className="flex-grow overflow-y-auto p-6">
              <SubjectForm initialSubjectData={editingSubject} onSuccess={handleSubjectFormSuccess} onCancel={handleCloseSubjectModal} />
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseSubjectModal}></div>
        </div>
      )}

       {/* Resource Form Modal */}
       {showResourceFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl z-50 my-auto max-h-[90vh] flex flex-col">
            <div className="flex-grow overflow-y-auto p-6">
              <ResourceForm
                initialResourceData={editingResource}
                availableSubjects={subjects}
                onSuccess={handleResourceFormSuccess}
                onCancel={handleCloseResourceModal}
              />
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseResourceModal}></div>
        </div>
      )}

       {/* Category Form Modal (Placeholder) */}
       {/* {showCategoryFormModal && ( ... )} */}

       {/* Topic View/Delete Modal */}
       {showTopicModal && selectedCategoryForTopics && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-50 max-h-[85vh] flex flex-col"> {/* Increased max-width */}
             {/* Modal Header */}
             <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-800">
                    Topics in "{selectedCategoryForTopics.name}"
                </h2>
                <button onClick={handleCloseTopicModal} className="p-1 text-gray-500 hover:text-gray-800" aria-label="Close modal">
                    <X className="h-5 w-5" />
                </button>
             </div>
             {/* Modal Body */}
             <div className="flex-grow overflow-y-auto p-6">
                 {isLoadingTopics && (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600" />
                        <p className="mt-2 text-gray-600">Loading topics...</p>
                    </div>
                 )}
                 {topicError && (
                    <div className="text-center py-10 text-red-600">
                        <p>Error loading topics: {topicError}</p>
                        <button onClick={() => fetchTopicsForCategory(selectedCategoryForTopics._id)} className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">Retry</button>
                    </div>
                 )}
                 {!isLoadingTopics && !topicError && (
                    <TopicList // We will create this component next
                        topics={topicsForSelectedCategory}
                        onDeleteTopic={handleDeleteTopic}
                    />
                 )}
             </div>
          </div>
           {/* Click outside to close */}
           <div className="fixed inset-0 z-40" onClick={handleCloseTopicModal}></div>
        </div>
      )}

    </div> // End main container
  );
}
