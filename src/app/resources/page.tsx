"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../DarkModeContext'; // Import the dark mode context
import api, { API_URL } from '../../utils/api'; // Import API_URL and default export

// --- Interfaces ---
interface MockCategory {
  id: string;
  name: string;
  // count property removed as it's fetched dynamically
}
interface BackendSubject {
  _id: string;
  name: string;
  color: string;
}
interface BackendResource {
  _id: string;
  title: string;
  category: string;
  subject: BackendSubject;
  type: string;
  size: string;
  downloads: number;
  premium: boolean;
  date: string;
  filePath?: string;
}
interface BackendQuiz {
    _id: string;
    title: string;
    subject: BackendSubject;
    difficulty: 'easy' | 'medium' | 'hard';
    questions: any[];
    timeLimit?: number;
    attempts?: number;
    rating?: number;
}
// Interface for the category counts object returned by the API
interface CategoryCounts {
    [categoryName: string]: number; // e.g., { "Past Papers": 2, "Notes": 1, "Practice Quizzes": 1 }
}


// --- Constants ---
const ITEMS_PER_PAGE = 10; // Number of items (resources or quizzes) to fetch per page

// --- Component ---
export default function ResourcesPage() {
  // --- State ---
  const { isDarkMode } = useDarkMode();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubjects, setActiveSubjects] = useState<string[]>([]); // Stores backend subject _ids
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('downloads'); // Default for resources
  const [fetchedSubjects, setFetchedSubjects] = useState<BackendSubject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(true);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);
  const [resources, setResources] = useState<BackendResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  const [errorResources, setErrorResources] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<BackendQuiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState<boolean>(false);
  const [errorQuizzes, setErrorQuizzes] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0); // Total for the CURRENTLY displayed list

  // State for all category counts fetched from the new endpoint
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState<boolean>(false);
  const [errorCounts, setErrorCounts] = useState<string | null>(null);


  // --- Category List (Structure Only - Counts are dynamic) ---
  // Removed "Other" category
  const categoriesList: MockCategory[] = [
    { id: 'all', name: 'All Resources' },
    { id: 'past-papers', name: 'Past Papers' },
    { id: 'model-papers', name: 'Model Papers' },
    { id: 'notes', name: 'Notes' },
    { id: 'practice', name: 'Practice Quizzes' },
    { id: 'videos', name: 'Video Lessons' },
  ];

  // Mapping from frontend ID to backend category name (used for looking up counts)
  // Ensure these names EXACTLY match the keys returned by your /category-counts endpoint
  const categoryNameMap: { [key: string]: string } = {
    'all': 'All Resources', // Special case, uses totalItems
    'past-papers': 'Past Papers',
    'model-papers': 'Model Papers', // Make sure this matches the key in your counts response
    'notes': 'Notes',
    'practice': 'Practice Quizzes', // Make sure this matches the key in your counts response
    'videos': 'Video Lessons', // Make sure this matches the key in your counts response
  };

  // Mapping from frontend category ID to backend RESOURCE enum value (used for filtering resources)
  const categoryFilterMap: { [key: string]: string } = {
    'all': '', // No filter
    'past-papers': 'Past Papers',
    'model-papers': 'Model Papers',
    'notes': 'Notes',
    'videos': 'Video Lessons',
    // 'practice' is handled separately (fetches quizzes)
  };

  // --- Effects ---

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
       setIsLoadingSubjects(true);
      setErrorSubjects(null);
      try {
        const response = await api.subjects.getAll();
        // Basic check for expected data structure
        if (response.data?.data?.subjects && Array.isArray(response.data.data.subjects)) {
           setFetchedSubjects(response.data.data.subjects);
        } else {
           console.error("Unexpected API response structure for subjects:", response.data);
           setFetchedSubjects([]); // Set empty if structure is wrong
           setErrorSubjects('Failed to load subjects due to unexpected data format.');
        }
      } catch (error: any) {
        console.error('Error fetching subjects:', error);
        setErrorSubjects(error.message || 'Failed to fetch subjects');
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []); // Runs only once on mount

  // Fetch Category Counts on mount and when subject filter changes
  useEffect(() => {
      const fetchCounts = async () => {
          setIsLoadingCounts(true);
          setErrorCounts(null);
          const params: { subject?: string } = {};
          // Send comma-separated list of subjects for counts
          if (activeSubjects.length > 0) {
              params.subject = activeSubjects.join(',');
          }
          try {
              console.log("Fetching category counts with params:", params);
              const response = await api.resources.getCategoryCounts(params);
              // Expecting response like { status: '...', data: { counts: { 'Category Name': count, ... } } }
              if (response.data?.data?.counts) {
                  setCategoryCounts(response.data.data.counts);
                  console.log("Fetched category counts:", response.data.data.counts);
              } else {
                  console.error("Unexpected API response structure for counts:", response.data);
                  setCategoryCounts({}); // Reset counts on error
                  setErrorCounts("Could not load category counts (unexpected format).");
              }
          } catch (error: any) {
              console.error("Error fetching category counts:", error);
              setErrorCounts(error.message || "Failed to fetch counts");
              setCategoryCounts({}); // Reset counts on error
          } finally {
              setIsLoadingCounts(false);
          }
      };
      fetchCounts();
  }, [activeSubjects]); // Re-fetch counts when subject filter changes

  // Fetch main list (Resources OR Quizzes) when filters, sort, or page change
  const fetchData = useCallback(async () => {
    // Reset errors for the main list
    setErrorResources(null);
    setErrorQuizzes(null);
    // Determine if fetching quizzes or resources
    const isFetchingQuizzes = activeCategory === 'practice';

    // Set loading state for the appropriate type
    if (isFetchingQuizzes) setIsLoadingQuizzes(true); else setIsLoadingResources(true);

    // --- Construct API Parameters ---
    const params: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    // 1. Sorting
    if (!isFetchingQuizzes) { // Apply resource sorting
        switch (sortOption) {
            case 'newest': params.sort = '-date'; break;
            case 'oldest': params.sort = 'date'; break;
            case 'az': params.sort = 'title'; break;
            default: params.sort = '-downloads'; break; // Default to downloads
         }
    } else { // Apply quiz sorting (default)
         params.sort = '-createdAt';
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // 3. Category Filter (Only apply if fetching resources and not 'all')
    if (!isFetchingQuizzes && activeCategory !== 'all') {
        const backendCategoryName = categoryFilterMap[activeCategory];
        if (backendCategoryName) {
             params.category = backendCategoryName;
        }
    }

    // 4. Subject Filter (Send comma-separated list if multiple selected)
    if (activeSubjects.length > 0) {
        params.subject = activeSubjects.join(','); // Join array into comma-separated string
    }
    // --- End Parameter Construction ---

    // --- API Call ---
    try {
        let response;
        if (isFetchingQuizzes) {
            console.log("Fetching Quizzes with params:", params);
            // Ensure quizController.getAllQuizzes handles comma-separated subjects
            response = await api.quizzes.getAll(params);
        } else {
            console.log("Fetching Resources with params:", params);
            // Ensure resourceController.getAllResources handles comma-separated subjects
            response = await api.resources.getAll(params);
        }

      // Process response - expecting items in response.data.data and total in response.data
      const responseDataForItems = response.data?.data;
      const items = isFetchingQuizzes ? responseDataForItems?.quizzes : responseDataForItems?.resources;
      let total = 0;

      // Get total count from response.data.results or response.data.totalResults
      if (response.data?.results !== undefined) { total = Number(response.data.results ?? 0); }
      else if (response.data?.totalResults !== undefined) { total = Number(response.data.totalResults ?? 0); }
      else { console.warn(`API response missing total count field ('results' or 'totalResults') in response.data`); total = 0; }

      setTotalItems(total); // Set total for the current view

      // Check if the items array is valid before updating state
      if (Array.isArray(items)) { // Check if items is an array (even if empty)
        if (isFetchingQuizzes) {
            setQuizzes(items);
            setResources([]); // Clear other data type
        } else {
            setResources(items);
            setQuizzes([]); // Clear other data type
        }
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1); // Ensure totalPages is at least 1
      } else {
        // Handle cases where 'data' object or items array might be missing/malformed
        console.error(`Unexpected API response structure inside 'data' object for ${isFetchingQuizzes ? 'quizzes' : 'resources'}:`, response.data);
        if (isFetchingQuizzes) setErrorQuizzes('Failed to load quizzes due to unexpected data format.');
        else setErrorResources('Failed to load resources due to unexpected data format.');
        setTotalItems(0); setTotalPages(1); setResources([]); setQuizzes([]);
       }
    } catch (error: any) {
       console.error(`Error fetching ${isFetchingQuizzes ? 'quizzes' : 'resources'}:`, error);
       if (isFetchingQuizzes) setErrorQuizzes(error.message || 'Failed to fetch quizzes');
       else setErrorResources(error.message || 'Failed to fetch resources');
       setTotalItems(0); setTotalPages(1); setResources([]); setQuizzes([]);
     } finally {
       // Clear loading state for the appropriate type
       if (isFetchingQuizzes) setIsLoadingQuizzes(false); else setIsLoadingResources(false);
    }
  }, [currentPage, sortOption, searchQuery, activeCategory, activeSubjects]); // Dependencies for re-fetching

  // Trigger fetchData when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    // Check if currentPage is already 1 to prevent unnecessary re-renders/fetches
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
    // No need to call fetchData here, the change in dependencies of the main fetchData effect will trigger it.
  }, [sortOption, searchQuery, activeCategory, activeSubjects]);


  // --- Event Handlers ---
   const toggleSubject = (subjectId: string) => {
       setActiveSubjects(prev => prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]);
       // Page reset handled by effect
   };
   const handleCategoryClick = (categoryId: string) => {
       setActiveCategory(categoryId);
       // Page reset handled by effect
   };
   const handlePageChange = (newPage: number) => {
       if (newPage >= 1 && newPage <= totalPages) {
           setCurrentPage(newPage); // Changing currentPage triggers fetchData effect
       }
   };
   const handleDownload = (resourceId: string, resourceTitle: string) => {
       console.log(`Attempting to download resource via navigation: ${resourceId} (${resourceTitle})`);
       const downloadUrl = `${API_URL}/resources/${resourceId}/download`;
       console.log("Navigating to:", downloadUrl);
       window.location.href = downloadUrl; // Trigger download via navigation
       // Optional: Re-fetch counts/data after a delay if download affects counts
       // setTimeout(() => { fetchData(); }, 1500);
  };

  // --- Helper Functions ---
  const getDifficultyColor = (difficulty: string | undefined): string => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };


  // --- Rendering ---
  const isLoading = isLoadingResources || isLoadingQuizzes; // Loading state for the main item list
  const currentError = errorResources || errorQuizzes; // Error state for the main item list
  const showQuizzes = activeCategory === 'practice';

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 font-['Inter',_sans-serif]`}>
      {/* Hero Header */}
       <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 pt-16 pb-32 overflow-hidden transition-colors duration-300">
          {/* ... hero content ... */}
           <div className="absolute inset-0 overflow-hidden opacity-20"> <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>📚</div> <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>📝</div> <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>📖</div> <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>🧪</div> <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>🔬</div> </div> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> <div className="sm:flex sm:items-center sm:justify-between"> <div> <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl"> Resource & Quiz Library </h1> <p className="mt-2 text-lg text-purple-100"> Access study materials, past papers, quizzes and learning resources </p> </div> <div className="mt-4 sm:mt-0"> <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 dark:text-purple-200 dark:bg-gray-800 dark:border dark:border-gray-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" /> </svg> Dashboard </Link> </div> </div> </div>
       </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Search Box */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
                 <div className="p-6"> <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> Search {showQuizzes ? 'Quizzes' : 'Resources'} </h2> <div className="relative"> <input type="text" placeholder={`Search by title...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 dark:text-gray-100 dark:placeholder-gray-400" /> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> </div> </div>
            </div>


            {/* Categories with Dynamic Counts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Categories
                </h2>
                 {isLoadingCounts && <p className="text-xs text-gray-400 dark:text-gray-500 italic">Loading counts...</p>}
                 {errorCounts && <p className="text-xs text-red-500 dark:text-red-400 italic">Error loading counts</p>}

                <ul className="space-y-3 mt-2">
                  {categoriesList.map((category) => {
                    // Determine the count to show using fetched categoryCounts
                    let countToShow: number | string = 0;
                    const categoryName = categoryNameMap[category.id]; // Get the name used as key in counts object
                    if (category.id === 'all') {
                        countToShow = totalItems; // 'All' shows total for current view
                    } else if (categoryName && categoryCounts[categoryName] !== undefined) {
                        // Use the count from the fetched state object
                        countToShow = categoryCounts[categoryName];
                    } // Otherwise defaults to 0

                    return (
                        <li key={category.id} className="flex justify-between items-center group cursor-pointer" onClick={() => handleCategoryClick(category.id)}>
                          <span className={`text-gray-700 dark:text-gray-300 ${activeCategory === category.id ? 'text-purple-700 dark:text-purple-400 font-medium' : 'group-hover:text-purple-600 dark:group-hover:text-purple-400'} transition-colors duration-200`}>{category.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${activeCategory === category.id ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-700 dark:group-hover:text-purple-400'} transition-colors duration-200 ${isLoadingCounts ? 'animate-pulse' : ''}`}>
                           {isLoadingCounts && category.id !== 'all' ? '...' : countToShow}
                         </span>
                        </li>
                    );
                  })}
                </ul>
              </div>
            </div>


            {/* Subjects */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
               {/* ... subject rendering ... */}
                <div className="p-6"> <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> </svg> Subjects </h2> {isLoadingSubjects && <p className="text-gray-500 dark:text-gray-400">Loading subjects...</p>} {errorSubjects && <p className="text-red-500 dark:text-red-400 text-sm">Error: {errorSubjects}</p>} {!isLoadingSubjects && !errorSubjects && ( <div className="space-y-3"> {fetchedSubjects.map((subject) => ( <div key={subject._id} className="flex items-center cursor-pointer group" onClick={() => toggleSubject(subject._id)}> <div className={`h-5 w-5 rounded border flex items-center justify-center mr-3 transition-colors duration-200 group-hover:border-gray-400 dark:group-hover:border-gray-500`} style={activeSubjects.includes(subject._id) ? { backgroundColor: subject.color, borderColor: subject.color } : { borderColor: isDarkMode ? '#4B5563' : '#D1D5DB' }}> {activeSubjects.includes(subject._id) && ( <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> )} </div> <label className={`block text-base ${activeSubjects.includes(subject._id) ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-700 dark:text-gray-300'} cursor-pointer group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200`}>{subject.name}</label> </div> ))} </div> )} </div>
            </div>

            {/* Premium Banner */}
             <div className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] dark:shadow-lg dark:shadow-gray-900/30">
                {/* ... premium banner content ... */}
                 <div className="p-6"> <div className="flex items-center mb-4"><div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mr-4">✨</div><h2 className="text-xl font-bold text-white">Premium Access</h2></div> <p className="text-purple-100 mb-4">Unlock all premium resources and exclusive content with a premium subscription.</p> <ul className="space-y-2 mb-6"> <li className="flex items-start text-white"><div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"><svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg></div><span className="text-sm">All past papers with solutions</span></li> <li className="flex items-start text-white"><div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"><svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg></div><span className="text-sm">Video lessons and tutorials</span></li> <li className="flex items-start text-white"><div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"><svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg></div><span className="text-sm">Advanced practice materials</span></li> </ul> <button className="w-full py-2 px-4 bg-white dark:bg-gray-100 rounded-lg text-center font-medium text-purple-700 hover:bg-purple-50 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"> Upgrade Now </button> </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting and Filters Bar */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6 transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">
                 <div className="p-6"> <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"> <h2 className="text-xl font-bold mb-4 sm:mb-0 text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300"> {showQuizzes ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> )} {categoriesList.find(c => c.id === activeCategory)?.name || 'Items'} <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">({totalItems} items)</span> </h2> {!showQuizzes && ( <div className="flex items-center space-x-2 mt-4 sm:mt-0"><label className="text-sm text-gray-600 dark:text-gray-400 mr-2 transition-colors duration-300">Sort by:</label><select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 pl-3 pr-10 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer"><option value="downloads">Most Downloaded</option><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="az">A-Z</option></select></div> )} </div> {(activeSubjects.length > 0 || searchQuery) && ( <div className="mt-4 flex flex-wrap items-center pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300"><span className="text-sm text-gray-500 dark:text-gray-400 mr-2 transition-colors duration-300">Filters:</span>{activeSubjects.map((subjectId) => { const subject = fetchedSubjects.find(s => s._id === subjectId); if (!subject) return null; return ( <span key={subjectId} className={`m-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-all duration-200`} style={{ backgroundColor: `${subject.color}20`, color: subject.color, borderColor: `${subject.color}80` }} onClick={() => toggleSubject(subjectId)}>{subject.name}<svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></span> );})}{searchQuery && ( <span className="m-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200" onClick={() => setSearchQuery('')}>Search: {searchQuery}<svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></span> )}<button className="ml-auto text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors duration-200" onClick={() => { setActiveCategory('all'); setActiveSubjects([]); setSearchQuery(''); }}>Clear all filters</button></div> )} </div>
            </div>


            {/* Conditional Content Area: Resources or Quizzes */}
            <div className="space-y-4">
              {/* ... Loading/Error/Items rendering ... */}
               {isLoading && ( <div className="text-center py-10"><p className="text-gray-500 dark:text-gray-400">Loading {showQuizzes ? 'quizzes' : 'resources'}...</p></div> )}
               {currentError && ( <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{currentError}</span></div> )}

               {/* Render Quizzes */}
               {!isLoading && !currentError && showQuizzes && quizzes.length > 0 && ( quizzes.map((quiz) => ( <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:shadow-lg dark:shadow-gray-900/30">{/* ... quiz card content ... */} <div className="p-6"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"><div className="mb-4 sm:mb-0 flex-grow mr-4"><div className="flex items-center flex-wrap mb-2 gap-2">{quiz.subject && ( <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border`} style={{ backgroundColor: `${quiz.subject.color}20`, color: quiz.subject.color, borderColor: `${quiz.subject.color}80` }}>{quiz.subject.name}</span> )}<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(quiz.difficulty)} bg-gray-100 dark:bg-gray-700`}>{quiz.difficulty}</span><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{quiz.questions?.length || 0} Questions</span></div><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{quiz.title}</h3></div><div className="flex-shrink-0"><Link href={`/quiz/take?id=${quiz._id}`} className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-800 dark:hover:to-blue-800 transform hover:scale-105 w-full sm:w-auto justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Take Quiz</Link></div></div></div></div> )) )}

               {/* Render Resources */}
               {!isLoading && !currentError && !showQuizzes && resources.length > 0 && ( resources.map((resource) => ( <div key={resource._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:shadow-lg dark:shadow-gray-900/30">{/* ... resource card content ... */} <div className="p-6"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"><div className="mb-4 sm:mb-0 flex-grow mr-4"><div className="flex items-center flex-wrap mb-2 gap-2">{resource.subject && ( <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border transition-colors duration-300`} style={{ backgroundColor: `${resource.subject.color}20`, color: resource.subject.color, borderColor: `${resource.subject.color}80` }}>{resource.subject.name}</span> )}<span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-700 transition-colors duration-300">{resource.category}</span>{resource.premium && ( <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 transition-colors duration-300">Premium</span> )}</div><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{resource.title}</h3><div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300 flex-wrap"><span className="flex items-center mr-4 mb-1 sm:mb-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>{resource.type} • {resource.size}</span><span className="flex items-center mr-4 mb-1 sm:mb-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>{resource.downloads.toLocaleString()} downloads</span><span className="flex items-center mb-1 sm:mb-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{new Date(resource.date).toLocaleDateString()}</span></div></div><div className="flex-shrink-0"><button className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center shadow-md w-full sm:w-auto justify-center ${ resource.premium ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-800 dark:hover:to-indigo-800 transform hover:scale-105' }`} disabled={resource.premium} onClick={() => !resource.premium && handleDownload(resource._id, resource.title)}>{resource.premium ? ( <>✨ Premium</> ) : ( <>⬇️ Download</> )}</button></div></div></div></div> )) )}

               {/* No results display */}
               {!isLoading && !currentError && resources.length === 0 && quizzes.length === 0 && ( <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-colors duration-300 dark:shadow-lg dark:shadow-gray-900/30">{/* ... no results content ... */} <div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">No {showQuizzes ? 'quizzes' : 'resources'} found</h3><p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">Try adjusting your filters or search query</p><button className="px-5 py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors duration-200" onClick={() => { setActiveCategory('all'); setActiveSubjects([]); setSearchQuery(''); setCurrentPage(1); }}> Clear all filters </button> </div> )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
               <div className="mt-8 flex justify-center">
                 {/* ... pagination ... */}
                  <nav className="inline-flex rounded-lg shadow-sm"><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 text-sm font-medium transition-colors duration-200 ${ currentPage === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' }`}> Previous </button><span className="px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"> Page {currentPage} of {totalPages} </span><button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className={`px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 text-sm font-medium transition-colors duration-200 ${ currentPage >= totalPages ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' }`}> Next </button></nav>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
