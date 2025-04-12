// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import api from '@/utils/api'; // Adjust path if needed
import { useDarkMode } from '../DarkModeContext'; // Adjust path if needed
import QuizList from './QuizList'; // Adjust path if needed
import QuizForm from './QuizForm'; // Adjust path if needed
import SubjectList from './SubjectList'; // Adjust path if needed
import SubjectForm from './SubjectForm'; // Adjust path if needed
import ResourceList from './ResourceList'; // Adjust path if needed
import ResourceForm from './ResourceForm'; // Adjust path if needed
import CategoryList from './CategoryList'; // Adjust path if needed
import CategoryForm from './CategoryForm'; // Adjust path if needed
import TopicList from './TopicList'; // Adjust path if needed
import ForumModeration from './ForumModeration'; // Adjust path if needed
import {
  PlusCircle,
  BookOpen,
  HelpCircle,
  FileText,
  MessageSquare,
  X,
  Loader2, // Kept for potential use, but spinner div is used now
  Shield,
  Eye,
  AlertCircle // Kept for potential use, but emoji is used now
} from 'lucide-react';

// --- Interfaces (Ensure these match your actual data structures) ---
interface QuizSubjectInfo { _id: string; name: string; color?: string; icon?: string; }
interface Quiz { _id: string; title: string; subject: QuizSubjectInfo | string; difficulty: 'easy' | 'medium' | 'hard'; questions: any[]; totalQuestions?: number; timeLimit: number; isPublished?: boolean; attempts?: number; rating?: number; createdAt?: string; updatedAt?: string; }
interface Topic { _id?: string; name: string; description?: string; order?: number; resources?: string[]; }
interface Subject { _id: string; name: string; description: string; color?: string; gradientFrom?: string; gradientTo?: string; icon?: string; topics: Topic[]; isActive?: boolean; createdAt?: string; updatedAt?: string; topicCount?: number; }
interface ResourceSubjectInfo { _id: string; name: string; color?: string; }
interface Resource { _id: string; title: string; description?: string; category: string; subject: ResourceSubjectInfo | string; type: string; size: string; filePath: string; downloads: number; premium: boolean; date: string; isActive?: boolean; createdAt?: string; updatedAt?: string; author?: any; }
interface ForumCategory { _id: string; name: string; description?: string; color?: string; icon?: string; topicsCount?: number; postsCount?: number; createdAt?: string; updatedAt?: string; }
interface ForumTopic {
    _id: string;
    title: string;
    author: { _id: string; name: string; };
    views: number;
    repliesCount: number;
    createdAt: string;
}

// --- Component ---
export default function AdminDashboard() {
  // Authentication and Router
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Check authentication and role
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log('User not authenticated, redirecting to login');
        router.replace('/login'); // Adjust path if needed
        return;
      }
      if (user.role !== 'admin' && user.role !== 'preview') {
        console.log('User does not have admin or preview role, redirecting to dashboard');
        router.replace('/dashboard'); // Adjust path if needed
        return;
      }

      // Set preview mode if applicable
      setIsPreviewMode(user.role === 'preview');

      console.log(`${user.role === 'preview' ? 'Preview' : 'Admin'} access verified`);
    }
  }, [user, authLoading, router]);

  // Dark Mode Context
  const { isDarkMode } = useDarkMode();

  // Active Section State
  const [activeSection, setActiveSection] = useState<'quizzes' | 'subjects' | 'resources' | 'categories' | 'moderation'>('quizzes');

  // State for each section (Quizzes, Subjects, Resources, Categories, Topics)
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState<boolean>(true);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [showQuizFormModal, setShowQuizFormModal] = useState<boolean>(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(true);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [showSubjectFormModal, setShowSubjectFormModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(true);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [showResourceFormModal, setShowResourceFormModal] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [showCategoryFormModal, setShowCategoryFormModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);

  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [selectedCategoryForTopics, setSelectedCategoryForTopics] = useState<ForumCategory | null>(null);
  const [topicsForSelectedCategory, setTopicsForSelectedCategory] = useState<ForumTopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [topicError, setTopicError] = useState<string | null>(null);

  // --- Data Fetching Callbacks ---
  const fetchQuizzes = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  const fetchSubjects = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  const fetchResources = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    setIsLoadingCategories(true);
    setCategoryError(null);
    try {
      const response = await api.forum.getCategories();
      const fetchedCategories = response.data?.data?.categories || [];
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
  }, [user]);

  const fetchTopicsForCategory = useCallback(async (categoryId: string) => {
    if (!user || !categoryId) return;
    setIsLoadingTopics(true);
    setTopicError(null);
    setTopicsForSelectedCategory([]);
    try {
        const response = await api.forum.getTopicsByCategory(categoryId, { limit: 500 });
        const fetchedTopics = response.data?.data?.topics || [];
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
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'preview')) {
      fetchQuizzes();
      fetchSubjects();
      fetchResources();
      fetchCategories();
    }
  }, [user, fetchQuizzes, fetchSubjects, fetchResources, fetchCategories]);

  // --- Helper function to show preview mode alert ---
  const showPreviewModeAlert = (action: string = "This action") => {
    // Use original alert message
    window.alert(`You are in preview mode. ${action} is not available.`);
  };

  // --- CRUD Handlers ---

  // Quiz Handlers
  const handleCreateNewQuiz = () => {
    if (isPreviewMode) { showPreviewModeAlert("Creating quizzes"); return; }
    setEditingQuiz(null); setShowQuizFormModal(true);
  };
  const handleEditQuiz = (quiz: Quiz) => {
    // Allow opening form in preview mode (original behavior)
    setEditingQuiz(quiz); setShowQuizFormModal(true);
  };
  const handleDeleteQuiz = async (quizId: string) => {
    if (isPreviewMode) { showPreviewModeAlert("Deleting quizzes"); return; }
    if (window.confirm('Are you sure you want to delete this quiz? This is permanent.')) {
      try { await api.quizzes.delete(quizId); fetchQuizzes(); }
      catch (err: any) { console.error('Error deleting quiz:', err); setQuizError(`Failed to delete quiz: ${err.message || 'Unknown error'}`); }
    }
  };
  const handleCloseQuizModal = () => { setShowQuizFormModal(false); setEditingQuiz(null); };
  const handleQuizFormSuccess = () => { handleCloseQuizModal(); fetchQuizzes(); };

  // Subject Handlers
  const handleCreateNewSubject = () => {
    if (isPreviewMode) { showPreviewModeAlert("Creating subjects"); return; }
    setEditingSubject(null); setShowSubjectFormModal(true);
  };
  const handleEditSubject = (subject: Subject) => {
    // Allow opening form in preview mode (original behavior)
    setEditingSubject(subject); setShowSubjectFormModal(true);
  };
  const handleDeleteSubject = async (subjectId: string) => {
    if (isPreviewMode) { showPreviewModeAlert("Deactivating subjects"); return; }
    if (window.confirm('Are you sure you want to deactivate this subject? It will be hidden but not permanently deleted.')) {
      try { await api.subjects.delete(subjectId); fetchSubjects(); }
      catch (err: any) { console.error('Error deactivating subject:', err); setSubjectError(`Failed to deactivate subject: ${err.message || 'Unknown error'}`); }
    }
  };
  const handleCloseSubjectModal = () => { setShowSubjectFormModal(false); setEditingSubject(null); };
  const handleSubjectFormSuccess = () => { handleCloseSubjectModal(); fetchSubjects(); };

  // Resource Handlers
  const handleCreateNewResource = () => {
    if (isPreviewMode) { showPreviewModeAlert("Creating resources"); return; }
    setEditingResource(null); setShowResourceFormModal(true);
  };
  const handleEditResource = (resource: Resource) => {
    // Allow opening form in preview mode (original behavior)
    setEditingResource(resource); setShowResourceFormModal(true);
  };
  const handleDeleteResource = async (resourceId: string) => {
    if (isPreviewMode) { showPreviewModeAlert("Deleting resources"); return; }
    if (window.confirm('Are you sure you want to delete this resource and its associated file? This is permanent.')) {
      try { await api.resources.delete(resourceId); fetchResources(); }
      catch (err: any) { console.error('Error deleting resource:', err); setResourceError(`Failed to delete resource: ${err.message || 'Unknown error'}`); }
    }
  };
  const handleCloseResourceModal = () => { setShowResourceFormModal(false); setEditingResource(null); };
  const handleResourceFormSuccess = () => { handleCloseResourceModal(); fetchResources(); };

  // Forum Category Handlers
  const handleCreateNewCategory = () => {
    if (isPreviewMode) { showPreviewModeAlert("Creating categories"); return; }
    setEditingCategory(null); setShowCategoryFormModal(true);
  };
  const handleEditCategory = (category: ForumCategory) => {
    // Allow opening form in preview mode (original behavior)
    setEditingCategory(category); setShowCategoryFormModal(true);
  };
  const handleDeleteCategory = async (categoryId: string) => {
    if (isPreviewMode) { showPreviewModeAlert("Deleting categories"); return; }
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone and might fail if the category contains topics.')) {
      try {
        setCategoryError(null); setIsLoadingCategories(true);
        await api.forum.deleteCategory(categoryId); fetchCategories();
      } catch (err: any) {
        console.error('Error deleting category:', err);
        setCategoryError(`Failed to delete category: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      } finally { setIsLoadingCategories(false); }
    }
  };
  const handleCloseCategoryModal = () => { setShowCategoryFormModal(false); setEditingCategory(null); setCategoryError(null); };
  const handleCategoryFormSuccess = () => { handleCloseCategoryModal(); fetchCategories(); };

  // Forum Topic Handlers
  const handleViewTopics = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
        setSelectedCategoryForTopics(category); setShowTopicModal(true); fetchTopicsForCategory(categoryId);
    } else { console.error("Category not found for ID:", categoryId); setCategoryError("Could not find the selected category."); }
  };
  const handleDeleteTopic = async (topicId: string) => {
    if (isPreviewMode) { showPreviewModeAlert("Deleting topics"); return; }
    if (!selectedCategoryForTopics) return;
    if (window.confirm(`Are you sure you want to delete this topic? This will also delete all its replies.`)) {
      try {
        setIsLoadingTopics(true); await api.forum.deleteTopic(topicId);
        fetchTopicsForCategory(selectedCategoryForTopics._id); fetchCategories();
      } catch (err: any) {
        console.error('Error deleting topic:', err); setTopicError(`Failed to delete topic: ${err.message || 'Unknown error'}`);
      } finally { setIsLoadingTopics(false); }
    }
  };
  const handleCloseTopicModal = () => { setShowTopicModal(false); setSelectedCategoryForTopics(null); setTopicsForSelectedCategory([]); setTopicError(null); };

  // --- Loading and Auth Checks ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          {/* Use original spinner div */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'preview')) {
    // Redirect handled by useEffect
    return null;
  }

  // --- Render Admin Dashboard ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background floating icons - Restored opacities */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[5%] left-[2%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
        <div className="absolute top-[12%] right-[2%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
        <div className="absolute top-[25%] left-[1%] text-green-500 dark:text-green-400 text-8xl opacity-75 floating-icon-slow">∞</div>
        <div className="absolute top-[55%] right-[3%] text-red-500 dark:text-red-400 text-11xl opacity-65 floating-icon">⚛</div>
        <div className="absolute top-[35%] right-[1%] text-yellow-500 dark:text-yellow-400 text-9xl opacity-70 floating-icon-slow">𝜙</div>
        <div className="absolute bottom-[15%] left-[3%] text-indigo-500 dark:text-indigo-400 text-10xl opacity-70 floating-icon-reverse">∫</div>
        <div className="absolute bottom-[25%] right-[2%] text-teal-500 dark:text-teal-400 text-9xl opacity-75 floating-icon">≈</div>
        <div className="absolute bottom-[8%] right-[4%] text-pink-500 dark:text-pink-400 text-8xl opacity-65 floating-icon-slow">±</div>
        <div className="absolute top-[3%] left-[30%] text-fuchsia-500 dark:text-fuchsia-400 text-8xl opacity-70 floating-icon">Δ</div>
        <div className="absolute top-[18%] left-[75%] text-emerald-500 dark:text-emerald-400 text-7xl opacity-65 floating-icon-slow">λ</div>
        <div className="absolute top-[40%] left-[88%] text-cyan-500 dark:text-cyan-400 text-9xl opacity-70 floating-icon-reverse">θ</div>
        <div className="absolute top-[65%] left-[78%] text-rose-500 dark:text-rose-400 text-8xl opacity-65 floating-icon">α</div>
        <div className="absolute bottom-[30%] left-[60%] text-amber-500 dark:text-amber-400 text-9xl opacity-70 floating-icon-slow">β</div>
        <div className="absolute bottom-[45%] left-[85%] text-purple-500 dark:text-purple-400 text-8xl opacity-65 floating-icon-reverse">μ</div>
        <div className="absolute bottom-[5%] left-[40%] text-blue-500 dark:text-blue-400 text-7xl opacity-70 floating-icon">ω</div>
        {/* SVG Icons from original */}
        <div className="absolute top-[15%] left-[15%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="absolute top-[48%] right-[15%] opacity-60 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="absolute bottom-[22%] left-[12%] opacity-60 floating-icon-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute top-[75%] right-[8%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="absolute top-[30%] left-[42%] opacity-60 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
          </svg>
        </div>
        <div className="absolute bottom-[45%] right-[48%] opacity-60 floating-icon-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <div className="absolute top-[5%] right-[35%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="absolute bottom-[10%] left-[28%] opacity-60 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-8 transition-colors duration-300">Admin Dashboard</h1>

        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 animate-pulse-subtle shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Preview Mode</h3>
                <div className="mt-1 text-sm text-amber-700 dark:text-amber-200">
                  {/* Updated message to reflect original intent */}
                  You are viewing the admin panel in preview mode. You can browse all sections but cannot make any changes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-wrap gap-2 justify-center">
          {/* Quiz Tab */}
          <button
            onClick={() => setActiveSection('quizzes')}
            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
              activeSection === 'quizzes'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <HelpCircle className="h-4 w-4 mr-2" /> Quizzes
          </button>
          {/* Subject Tab */}
          <button
            onClick={() => setActiveSection('subjects')}
            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
              activeSection === 'subjects'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" /> Subjects
          </button>
          {/* Resource Tab */}
          <button
            onClick={() => setActiveSection('resources')}
            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
              activeSection === 'resources'
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" /> Resources
          </button>
          {/* Category Tab */}
          <button
            onClick={() => setActiveSection('categories')}
            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
              activeSection === 'categories'
                ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Forum Categories
          </button>
          {/* Moderation Tab */}
          <button
            onClick={() => !isPreviewMode && setActiveSection('moderation')}
            disabled={isPreviewMode}
            title={isPreviewMode ? "Moderation is disabled in preview mode" : "Manage Content Moderation"}
            className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors ${
              activeSection === 'moderation'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : isPreviewMode
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 opacity-50 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" /> Content Moderation
          </button>
        </div>

        {/* Conditional Rendering Based on Active Section - Restored structure */}

        {/* Quiz Management Section */}
        {activeSection === 'quizzes' && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4 transition-colors duration-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center transition-colors duration-300">
                <HelpCircle className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400"/> Quiz Management
              </h2>
              {/* Restored Button Style */}
              <button
                onClick={handleCreateNewQuiz}
                className={`inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isPreviewMode ? 'opacity-50 cursor-not-allowed hover:bg-purple-600' : 'hover:bg-purple-700'}`}
                disabled={isPreviewMode}
              >
                {isPreviewMode ? (
                  <><Eye className="h-5 w-5 mr-2" /> Preview Mode</>
                ) : (
                  <><PlusCircle className="h-5 w-5 mr-2" /> Create New Quiz</>
                )}
              </button>
            </div>
            {/* Restored Loading Placeholder */}
            {isLoadingQuizzes && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading quizzes...</p>
              </div>
            )}
            {/* Restored Error Placeholder */}
            {!isLoadingQuizzes && quizError && (
              <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg transition-colors duration-300">
                <div className="text-red-500 dark:text-red-400 text-3xl mb-3">⚠️</div>
                <p className="text-red-700 dark:text-red-300 transition-colors duration-300">{quizError}</p>
                <button onClick={fetchQuizzes} className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300">
                  Retry
                </button>
              </div>
            )}
            {!isLoadingQuizzes && !quizError && (
              <QuizList
                quizzes={quizzes}
                onEdit={handleEditQuiz}
                onDelete={handleDeleteQuiz}
                isPreviewMode={isPreviewMode}
              />
            )}
          </section>
        )}

        {/* Subject Management Section */}
        {activeSection === 'subjects' && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4 transition-colors duration-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center transition-colors duration-300">
                <BookOpen className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400"/> Subject Management
              </h2>
              {/* Restored Button Style */}
              <button
                onClick={handleCreateNewSubject}
                className={`inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isPreviewMode ? 'opacity-50 cursor-not-allowed hover:bg-indigo-600' : 'hover:bg-indigo-700'}`}
                disabled={isPreviewMode}
              >
                {isPreviewMode ? (
                  <><Eye className="h-5 w-5 mr-2" /> Preview Mode</>
                ) : (
                  <><PlusCircle className="h-5 w-5 mr-2" /> Create New Subject</>
                )}
              </button>
            </div>
            {/* Restored Loading Placeholder */}
            {isLoadingSubjects && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-3"></div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading subjects...</p>
              </div>
            )}
            {/* Restored Error Placeholder */}
            {!isLoadingSubjects && subjectError && (
              <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg transition-colors duration-300">
                <div className="text-red-500 dark:text-red-400 text-3xl mb-3">⚠️</div>
                <p className="text-red-700 dark:text-red-300 transition-colors duration-300">{subjectError}</p>
                <button onClick={fetchSubjects} className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300">
                  Retry
                </button>
              </div>
            )}
            {!isLoadingSubjects && !subjectError && (
              <SubjectList
                subjects={subjects}
                onEdit={handleEditSubject}
                onDelete={handleDeleteSubject}
                isPreviewMode={isPreviewMode}
              />
            )}
          </section>
        )}

        {/* Resource Management Section */}
        {activeSection === 'resources' && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4 transition-colors duration-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center transition-colors duration-300">
                <FileText className="h-6 w-6 mr-2 text-teal-600 dark:text-teal-400"/> Resource Management
              </h2>
              {/* Restored Button Style */}
              <button
                onClick={handleCreateNewResource}
                className={`inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isPreviewMode ? 'opacity-50 cursor-not-allowed hover:bg-teal-600' : 'hover:bg-teal-700'}`}
                disabled={isPreviewMode}
              >
                {isPreviewMode ? (
                  <><Eye className="h-5 w-5 mr-2" /> Preview Mode</>
                ) : (
                  <><PlusCircle className="h-5 w-5 mr-2" /> Create New Resource</>
                )}
              </button>
            </div>
            {/* Restored Loading Placeholder */}
            {isLoadingResources && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-3"></div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading resources...</p>
              </div>
            )}
            {/* Restored Error Placeholder */}
            {!isLoadingResources && resourceError && (
              <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg transition-colors duration-300">
                <div className="text-red-500 dark:text-red-400 text-3xl mb-3">⚠️</div>
                <p className="text-red-700 dark:text-red-300 transition-colors duration-300">{resourceError}</p>
                <button onClick={fetchResources} className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300">
                  Retry
                </button>
              </div>
            )}
            {!isLoadingResources && !resourceError && (
              <ResourceList
                resources={resources}
                onEdit={handleEditResource}
                onDelete={handleDeleteResource}
                isPreviewMode={isPreviewMode}
              />
            )}
          </section>
        )}

        {/* Forum Category Management Section */}
        {activeSection === 'categories' && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4 transition-colors duration-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center transition-colors duration-300">
                <MessageSquare className="h-6 w-6 mr-2 text-cyan-600 dark:text-cyan-400"/> Forum Category Management
              </h2>
              {/* Restored Button Style */}
              <button
                onClick={handleCreateNewCategory}
                className={`inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isPreviewMode ? 'opacity-50 cursor-not-allowed hover:bg-cyan-600' : 'hover:bg-cyan-700'}`}
                disabled={isPreviewMode}
              >
                {isPreviewMode ? (
                  <><Eye className="h-5 w-5 mr-2" /> Preview Mode</>
                ) : (
                  <><PlusCircle className="h-5 w-5 mr-2" /> Create New Category</>
                )}
              </button>
            </div>
            {/* Restored Error Message Style */}
            {categoryError && (
              <div className="mb-4 text-center py-2 px-4 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 shadow transition-colors duration-300">
                {categoryError}
                <button onClick={() => setCategoryError(null)} className="ml-2 text-red-500 dark:text-red-400 font-bold">X</button>
              </div>
            )}
            {/* Restored Loading Placeholder */}
            {isLoadingCategories && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-3"></div>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading categories...</p>
              </div>
            )}
            {!isLoadingCategories && !categoryError && (
              <CategoryList
                categories={categories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onViewTopics={handleViewTopics}
                isPreviewMode={isPreviewMode}
              />
            )}
          </section>
        )}

        {/* Forum Moderation Section */}
        {activeSection === 'moderation' && (
          <section className="transition-colors duration-300 animate-fadeIn">
            {/* This line passes the prop. Ensure ForumModeration accepts it. */}
            <ForumModeration isPreviewMode={isPreviewMode} />
          </section>
        )}
      </div>

      {/* Modals - Restored Padding Structure */}
      {showQuizFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl z-50 my-auto max-h-[90vh] flex flex-col transition-colors duration-300">
            <div className="flex-grow p-6 overflow-y-auto">
              <QuizForm
                initialQuizData={editingQuiz ? { ...editingQuiz, subject: typeof editingQuiz.subject === 'object' ? editingQuiz.subject._id : editingQuiz.subject } : null}
                onSuccess={handleQuizFormSuccess}
                onCancel={handleCloseQuizModal}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
          <div className="fixed inset-0 z-40" onClick={handleCloseQuizModal}></div>
        </div>
      )}

      {showSubjectFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl z-50 my-auto max-h-[90vh] flex flex-col transition-colors duration-300">
            <div className="flex-grow p-6 overflow-y-auto">
              <SubjectForm
                initialSubjectData={editingSubject}
                onSuccess={handleSubjectFormSuccess}
                onCancel={handleCloseSubjectModal}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseSubjectModal}></div>
        </div>
      )}

      {showResourceFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl z-50 my-auto max-h-[90vh] flex flex-col transition-colors duration-300">
            <div className="flex-grow p-6 overflow-y-auto">
              <ResourceForm
                initialResourceData={editingResource ? { ...editingResource, subject: typeof editingResource.subject === 'object' ? editingResource.subject._id : editingResource.subject } : null}
                availableSubjects={subjects}
                onSuccess={handleResourceFormSuccess}
                onCancel={handleCloseResourceModal}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseResourceModal}></div>
        </div>
      )}

      {showCategoryFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-start pt-10 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl z-50 my-auto max-h-[90vh] flex flex-col transition-colors duration-300">
            <div className="flex-grow p-6 overflow-y-auto">
              <CategoryForm
                initialCategoryData={editingCategory}
                onSuccess={handleCategoryFormSuccess}
                onCancel={handleCloseCategoryModal}
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseCategoryModal}></div>
        </div>
      )}

      {showTopicModal && selectedCategoryForTopics && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl z-50 max-h-[85vh] flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">
                Topics in "{selectedCategoryForTopics.name}"
              </h2>
              <button type="button" onClick={handleCloseTopicModal} aria-label="Close topics modal" className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              {/* Restored Loading Placeholder */}
              {isLoadingTopics && (
                <div className="text-center py-10">
                  {/* Use Loader2 here as it was in the original modal */}
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading topics...</p>
                </div>
              )}
              {/* Restored Error Placeholder */}
              {topicError && (
                <div className="text-center py-10 text-red-600 dark:text-red-400 transition-colors duration-300">
                  <p>Error loading topics: {topicError}</p>
                  <button
                    type="button"
                    onClick={() => fetchTopicsForCategory(selectedCategoryForTopics._id)}
                    className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 text-sm transition-colors duration-300"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!isLoadingTopics && !topicError && <TopicList topics={topicsForSelectedCategory} onDeleteTopic={handleDeleteTopic} isPreviewMode={isPreviewMode} />}
            </div>
          </div>
           <div className="fixed inset-0 z-40" onClick={handleCloseTopicModal}></div>
        </div>
      )}

      {/* Global styles - Merged */}
      <style jsx global>{`
        /* Original styles */
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; } /* Adjusted opacity slightly from 0.8 for closer match */
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animated-gradient {
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-border {
          position: relative;
          overflow: hidden;
        }
        .animated-border::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shine 3s infinite;
        }
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }

        /* Background floating icons animations */
        .floating-icon {
          animation: float 6s ease-in-out infinite;
        }
        .floating-icon-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        .floating-icon-slow {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes float-reverse {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(15px) rotate(-5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        /* Fade in animation for sections */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Styles kept from the second version (utility classes) */
        /* These are less critical now as direct Tailwind classes are used more */
        /* .btn-primary-sm {
          @apply inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
        }
        .btn-disabled {
          @apply opacity-50 cursor-not-allowed hover:bg-purple-600;
        }
        .btn-retry-sm {
           @apply px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800/50 text-xs font-medium;
        }
        .loading-placeholder {
          @apply text-center py-10 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center space-y-2;
        }
        .error-placeholder {
           @apply text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg text-red-700 dark:text-red-300 flex items-center justify-center;
        } */
      `}</style>
    </div>
  );
}