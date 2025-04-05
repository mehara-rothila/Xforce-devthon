// app/subjects/[subjectId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../../DarkModeContext'; // Adjust path if needed
import axios from 'axios';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfaces (same as previous example)
interface Topic { /* ... */ id: string; _id: string; name: string; progress?: number; mastery?: 'Low' | 'Medium' | 'High'; }
interface Subject { /* ... */ _id: string; name: string; description: string; color: string; gradientFrom: string; gradientTo: string; icon: string; topics: Topic[]; forumCategoryId?: string; }
interface UserProgress { /* ... */ overallProgress: number; topics: Topic[]; }
interface Recommendation { /* ... */ id: number | string; title: string; type: string; difficulty: string; estimatedTime: string; description: string; }
interface StudyMaterial { /* ... */ id: string; title: string; type: string; downloadCount?: number; fileSize: string; lastUpdated: string; isPremium: boolean; }
interface PracticeQuiz { /* ... */ id: string; title: string; questions: number; difficulty: string; timeEstimate: string; averageScore: number; attempts: number; }
interface ForumDiscussion { /* ... */ id: string; title: string; content: string; replies: number; timestamp: string; }


export default function SubjectDetailPage() {
  const { isDarkMode } = useDarkMode();
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectData, setSubjectData] = useState<Subject | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recommendedResources, setRecommendedResources] = useState<Recommendation[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [practiceQuizzes, setPracticeQuizzes] = useState<PracticeQuiz[]>([]);
  const [recentDiscussions, setRecentDiscussions] = useState<ForumDiscussion[]>([]);
  const [forumCategoryId, setForumCategoryId] = useState<string | null>(null);

  // Placeholder mapping - NEEDS dynamic solution
  const subjectToForumCategoryMap: { [key: string]: string } = {
    '67f07672dafe64ae5bfe7800': '64f070a6018c0c66ee419795', // Physics
    '67f07672dafe64ae5bfe7803': 'YOUR_CHEMISTRY_FORUM_CATEGORY_ID', // Chemistry
  };

  useEffect(() => {
    // Fetch logic (same as previous dynamic example)
    if (!subjectId) { /* ... handle missing ID ... */ return; }
    const fetchSubjectData = async () => {
      try {
        setLoading(true); setError(null);
        const [ subjRes, progRes, recRes, matRes, quizRes ] = await Promise.all([ /* ... API calls ... */
          axios.get(`${API_URL}/subjects/${subjectId}`),
          axios.get(`${API_URL}/subjects/${subjectId}/progress`),
          axios.get(`${API_URL}/subjects/${subjectId}/recommendations`),
          axios.get(`${API_URL}/resources/subject/${subjectId}/materials`),
          axios.get(`${API_URL}/quizzes/subject/${subjectId}/practice`)
        ]);

        const fetchedSubject = subjRes.data.data?.subject || subjRes.data.data;
        if (!fetchedSubject) throw new Error(`Subject not found`);

        setSubjectData(fetchedSubject);
        setUserProgress(progRes.data.data?.progress || progRes.data.data);
        setRecommendedResources(recRes.data.data?.recommendations || recRes.data.data);
        setStudyMaterials(matRes.data.data?.materials || matRes.data.data);
        setPracticeQuizzes(quizRes.data.data?.practiceQuizzes || quizRes.data.data);

        const fetchedForumId = subjectToForumCategoryMap[subjectId] || fetchedSubject?.forumCategoryId;
        setForumCategoryId(fetchedForumId);

        if (fetchedForumId) {
          try {
             const forumRes = await axios.get(`${API_URL}/forum/categories/${fetchedForumId}/topics`);
             const topics = forumRes.data.data?.topics || forumRes.data.data || [];
             setRecentDiscussions(topics.slice(0, 3).map((topic: any) => ({ /* ... map topic data ... */
                id: topic._id, title: topic.title, content: (topic.content || '').substring(0, 100) + '...',
                replies: topic.repliesCount || 0, timestamp: getTimeAgo(topic.createdAt)
             })));
          } catch (forumErr) { console.error('Forum fetch failed:', forumErr); setRecentDiscussions([]); }
        } else { setRecentDiscussions([]); }

      } catch (err: any) { /* ... error handling ... */
        console.error(`Error fetching data for subject ${subjectId}:`, err);
        if (err.response && err.response.status === 404 || err.message.includes('Subject not found')) { setError(`Subject with ID ${subjectId} not found.`); }
        else { setError('Failed to load subject data.'); }
        setSubjectData(null); // Clear data on error
      } finally { setLoading(false); }
    };
    fetchSubjectData();
  }, [subjectId]);


  // --- Helper Functions (getTimeAgo, etc. - same as before) ---
  const getTimeAgo = (dateString: string | undefined): string => { /* ... */ if (!dateString) return ''; const now = new Date(); const date = new Date(dateString); const seconds = Math.floor((now.getTime() - date.getTime()) / 1000); if (isNaN(seconds) || seconds < 0) return '?'; if (seconds < 60) return 'just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24); if (days < 7) return `${days}d ago`; const weeks = Math.floor(days / 7); if (weeks < 4) return `${weeks}w ago`; const months = Math.floor(days / 30); if (months < 12) return `${months}mo ago`; const years = Math.floor(days / 365); return `${years}y ago`; };
  const getDifficultyColor = (difficulty: string | undefined = ''): string => { const lowerDifficulty = difficulty?.toLowerCase() || ''; switch (lowerDifficulty) { case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'; case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'; case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'; case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800'; case 'beginner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'; default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'; } };
  const getMasteryColor = (mastery: string | undefined = ''): string => { const lowerMastery = mastery?.toLowerCase() || ''; switch (lowerMastery) { case 'high': return 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white'; case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white'; case 'low': return 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white'; default: return 'bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white'; } };
  const getResourceTypeIcon = (type: string | undefined = ''): string => { const lowerType = type?.toLowerCase() || ''; switch (lowerType) { case 'notes': return '📝'; case 'pdf': return '📄'; case 'video': return '🎬'; case 'interactive': return '🔄'; case 'practice quiz': return '❓'; case 'study notes': return '📚'; case 'video lesson': return '📹'; default: return '📋'; } };
  const getAverageScoreColor = (score: number | undefined = 0): string => { if (score > 75) return 'text-green-600 dark:text-green-400'; if (score > 60) return 'text-yellow-600 dark:text-yellow-400'; return 'text-red-600 dark:text-red-400'; };
  const getAverageScoreBgGradient = (score: number | undefined = 0): string => { if (score > 75) return 'bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-600'; if (score > 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600'; return 'bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600'; };

  // --- Render Logic ---
  if (loading) { /* ... loading ... */ return <div className="min-h-screen flex items-center justify-center">Loading...</div>; }
  if (error) { /* ... error ... */ return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>; }
  if (!subjectData) { /* ... no data ... */ return <div className="min-h-screen flex items-center justify-center">Subject not loaded.</div>; }

  // Destructure for easier use, providing fallbacks
  const { name = 'Subject', description = '', color = '#808080', gradientFrom = color, gradientTo = color } = subjectData;
  const safeColor = color; // Already defaulted

  return (
     // Apply original layout and dynamic styles carefully
     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-16 transition-colors duration-300">
        {/* Header Section */}
        <div
            className="pt-14 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300"
            style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`}} // Dynamic Gradient
        >
           <div className="absolute inset-0 overflow-hidden opacity-20">
               {/* Static decorations from original - could be dynamic later */}
               <div className="absolute top-1/4 left-1/5 text-white text-5xl transform -rotate-12">E = mc²</div>
               <div className="absolute bottom-1/3 right-1/4 text-white text-4xl transform rotate-6">F = ma</div>
               <div className="absolute top-2/3 left-1/3 text-white text-4xl transform rotate-12">∇ × B = μ₀J</div>
               <div className="absolute top-1/2 right-1/6 text-white text-3xl transform -rotate-6">∫ E · dA = q/ε₀</div>
            </div>
            <div className="max-w-7xl mx-auto relative">
                <div className="flex items-center justify-between">
                   <div>
                       <div className="inline-flex rounded-full px-3 py-1 text-xs font-medium text-white mb-3" style={{ backgroundColor: `${safeColor}B3` }}> {/* Color with opacity */}
                          Advanced Level
                       </div>
                       <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight drop-shadow-sm">
                          {name} {/* Dynamic Name */}
                       </h1>
                       <p className="mt-3 text-xl text-white/80 max-w-2xl"> {/* Dynamic Description */}
                          {description}
                       </p>
                   </div>
                   {/* Back Button */}
                   <Link
                     href="/subjects"
                     className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:text-gray-200 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
                     style={{ color: safeColor }} // Dynamic text color matching subject
                   >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                       All Subjects
                   </Link>
                </div>
                 {/* Progress Bar (styles same as original) */}
                 <div className="mt-10 bg-black/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg transition-colors duration-300">
                   <div className="flex justify-between text-sm text-white mb-2 px-2">
                     <span className="font-semibold">Your Overall Progress</span>
                     <span className="font-bold">{userProgress?.overallProgress ?? 0}%</span>
                   </div>
                   <div className="h-3 bg-black/20 dark:bg-black/30 rounded-full transition-colors duration-300">
                     <div
                       className="h-3 bg-gradient-to-r from-white/80 to-white dark:from-gray-300 dark:to-white rounded-full relative overflow-hidden transition-width duration-500" // Reverted to original white gradient for contrast
                       style={{ width: `${userProgress?.overallProgress ?? 0}%` }}
                     >
                       <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                     </div>
                   </div>
                 </div>
            </div>
        </div>

         {/* Main Content Area (sections below header) */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 space-y-8">

            {/* Topic Progress Section - Preserving original styles */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" style={{ color: safeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Topic Progress
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                       {/* Map topics (using userProgress or subjectData as fallback) */}
                        {(userProgress?.topics ?? subjectData.topics).map(topic => (
                          <div key={topic._id || topic.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                            {/* ... Topic Name, Mastery Badge (using getMasteryColor) ... */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{topic.name}</h3>
                                {topic.mastery && <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getMasteryColor(topic.mastery)}`}>{topic.mastery} Mastery</span>}
                            </div>
                            {/* Progress Bar (using mastery color) */}
                             {topic.progress !== undefined && (
                                 <>
                                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
                                       <div
                                         className={`h-3 rounded-full relative ${getMasteryColor(topic.mastery).replace('text-white','')} transition-width duration-500`}
                                         style={{ width: `${topic.progress}%` }}
                                       >
                                         <div className="absolute inset-0 bg-white opacity-20"></div>
                                       </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{topic.progress}% Complete</span>
                                        {/* Practice Link (styled like original) */}
                                         <Link
                                             href={`/quiz?topic=${topic._id || topic.id}&subject=${subjectId}`}
                                             className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-150"
                                         >
                                            Practice
                                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                         </Link>
                                    </div>
                                </>
                             )}
                             {topic.progress === undefined && ( // Show practice link even if no progress data
                                <div className="mt-4 text-right">
                                    <Link href={`/quiz?topic=${topic._id || topic.id}&subject=${subjectId}`} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-150"> Practice <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></Link>
                                </div>
                             )}
                          </div>
                        ))}
                    </div>
                </div>
            </div>

             {/* Personal Recommendations Section - Preserving original styles */}
             {recommendedResources.length > 0 && (
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                     <div className="p-8">
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" style={{ color: safeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            Recommended for You
                         </h2>
                         <div className="grid gap-6 md:grid-cols-3">
                            {recommendedResources.map(resource => (
                               <div key={resource.id} className={`relative bg-gradient-to-br from-white to-[${safeColor}]/5 dark:from-gray-800 dark:to-[${safeColor}]/10 rounded-xl p-6 border border-[${safeColor}]/10 dark:border-[${safeColor}]/30 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden group`}>
                                   {/* Decorative elements */}
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-[${safeColor}]/10 dark:bg-[${safeColor}]/20 rounded-full opacity-30 -mr-10 -mt-10 group-hover:bg-[${safeColor}]/20 dark:group-hover:bg-[${safeColor}]/30 transition-colors duration-300`}></div>
                                   {/* Content (icon, difficulty, title, description, start button) */}
                                    <div className="flex justify-between items-start relative z-10">
                                       <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-2xl`} style={{ backgroundColor: isDarkMode ? `${safeColor}33` : `${safeColor}1A` }}>{getResourceTypeIcon(resource.type)}</div>
                                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>{resource.difficulty}</span>
                                   </div>
                                    <h3 className="mt-4 font-bold text-lg text-gray-900 dark:text-gray-100">{resource.title}</h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex-grow">{resource.description}</p>
                                    <div className="mt-6 flex justify-between items-center">
                                       <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{resource.type} • {resource.estimatedTime}</span>
                                       <a href="#" className={`inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-md hover:brightness-110 transition-all duration-150 shadow-sm`} style={{ background: safeColor }}> Start <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></a>
                                   </div>
                               </div>
                            ))}
                         </div>
                     </div>
                 </div>
             )}

            {/* Study Materials Section - Preserving original styles */}
            {studyMaterials.length > 0 && (
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                   <div className="p-8">
                     <div className="flex justify-between items-center mb-6">
                       {/* Header & View All Link */}
                       <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" style={{ color: safeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>Study Materials</h2>
                       <Link href={`/resources?subject=${subjectId}`} className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md hover:brightness-125 transition-colors duration-150`} style={{ color: isDarkMode ? `${safeColor}E6` : safeColor, backgroundColor: isDarkMode ? `${safeColor}26` : `${safeColor}1A`}}> View All <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></Link>
                     </div>
                     {/* Table */}
                     <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 transition-colors duration-300">
                            {/* Table Headers */}
                           <tr><th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th><th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th><th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th><th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th><th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th></tr>
                         </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                           {studyMaterials.map(material => (
                             <tr key={material.id} className={`hover:bg-[${safeColor}]/5 dark:hover:bg-[${safeColor}]/10 transition-colors duration-150`}>
                               {/* Resource Cell */}
                               <td className="px-6 py-4"><div className="flex items-center"><div className="text-2xl mr-3">{getResourceTypeIcon(material.type)}</div><div><div className="flex items-center"><div className="text-sm font-medium text-gray-900 dark:text-gray-100">{material.title}</div>{material.isPremium && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white">Premium</span>}</div><div className="text-sm text-gray-500 dark:text-gray-400">{material.downloadCount?.toLocaleString()} downloads</div></div></div></td>
                               {/* Type Cell */}
                               <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-1 rounded-md text-xs font-medium" style={{ color: isDarkMode ? `${safeColor}E6` : safeColor, backgroundColor: isDarkMode ? `${safeColor}26` : `${safeColor}1A`}}>{material.type}</span></td>
                               {/* Size Cell */}
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{material.fileSize}</td>
                               {/* Last Updated Cell */}
                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{material.lastUpdated}</td>
                               {/* Action Cell */}
                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{material.isPremium ? <span className="px-4 py-1.5 rounded-md text-xs font-medium text-purple-800 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-150">Get Premium</span> : <a href="#" className={`px-4 py-1.5 rounded-md text-xs font-medium hover:brightness-110 transition-colors duration-150`} style={{ color: isDarkMode ? `${safeColor}E6` : safeColor, backgroundColor: isDarkMode ? `${safeColor}26` : `${safeColor}1A`}}>Download</a>}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 </div>
             )}

            {/* Practice Quizzes Section - Preserving original styles */}
             {practiceQuizzes.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      {/* Header & View All Link */}
                       <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" style={{ color: safeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Practice Quizzes</h2>
                       <Link href={`/quiz?subject=${subjectId}`} className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md hover:brightness-125 transition-colors duration-150`} style={{ color: isDarkMode ? `${safeColor}E6` : safeColor, backgroundColor: isDarkMode ? `${safeColor}26` : `${safeColor}1A`}}> View All <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></Link>
                    </div>
                     {/* Quiz Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {practiceQuizzes.map(quiz => (
                        <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{quiz.title}</h3>
                          {/* Quiz Meta */}
                          <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                  <div className="flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{quiz.questions}</div>
                                  <div className="flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{quiz.timeEstimate}</div>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>{quiz.difficulty}</span>
                          </div>
                           {/* Average Score */}
                          <div className="mt-4">
                             <div className="flex justify-between text-xs mb-1"><span className="font-medium text-gray-700 dark:text-gray-300">Average Score</span><span className={`font-bold ${getAverageScoreColor(quiz.averageScore)}`}>{quiz.averageScore}%</span></div>
                             <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-2 rounded-full ${getAverageScoreBgGradient(quiz.averageScore)} transition-width duration-500`} style={{ width: `${quiz.averageScore}%` }}><div className="absolute inset-0 bg-white opacity-20"></div></div></div>
                          </div>
                          {/* Attempts */}
                          <div className="mt-2 flex justify-end text-sm text-gray-500 dark:text-gray-400">{quiz.attempts?.toLocaleString()} attempts</div>
                          {/* Start Button */}
                           <div className="mt-4">
                               <Link
                                 href={`/quiz/take?id=${quiz.id}&subject=${subjectId}`}
                                 className={`w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${safeColor}]`}
                                 style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`}} // Dynamic gradient
                               > Start Quiz <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></Link>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             )}


            {/* Forum Discussions Section - Preserving original styles */}
            { (forumCategoryId || recentDiscussions.length > 0) && (
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                   <div className="p-8">
                     <div className="flex justify-between items-center mb-6">
                       {/* Header & View All Link */}
                       <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center transition-colors duration-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" style={{ color: safeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>Recent Discussions</h2>
                       {forumCategoryId && <Link href={`/forum/category/${forumCategoryId}`} className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md hover:brightness-125 transition-colors duration-150`} style={{ color: isDarkMode ? `${safeColor}E6` : safeColor, backgroundColor: isDarkMode ? `${safeColor}26` : `${safeColor}1A`}}> View All <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></Link>}
                     </div>
                     {/* Discussion List */}
                      <div className="space-y-4">
                          {/* ... No category ID / No discussions found / Discussion items ... */}
                          {!forumCategoryId && <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700 text-center"><p className="text-sm text-yellow-700 dark:text-yellow-300">Forum category mapping not found.</p></div>}
                          {forumCategoryId && recentDiscussions.length === 0 && <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm text-center"><p className="text-gray-500 dark:text-gray-400">No discussions found for {name}.</p><Link href={`/forum/new?category=${forumCategoryId}`} className={`mt-4 inline-flex items-center px-4 py-2 text-white rounded-lg hover:brightness-110 transition-colors`} style={{ background: safeColor }}>Start a Discussion</Link></div>}
                          {forumCategoryId && recentDiscussions.map((discussion) => (
                             <div key={discussion.id} className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[${safeColor}]/30 dark:hover:border-[${safeColor}]/70`}>
                               <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{discussion.title}</h3>
                               <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{discussion.content}</p>
                               <div className="mt-4 flex justify-between items-center text-sm">
                                 <div className="flex items-center text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>{discussion.replies} replies</div>
                                 <div className="flex items-center text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{discussion.timestamp}</div>
                                 <Link href={`/forum/topic/${discussion.id}`} className={`font-medium flex items-center transition-colors duration-300`} style={{ color: isDarkMode ? `${safeColor}E6` : safeColor }}> View Discussion <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></Link>
                               </div>
                             </div>
                          ))}
                     </div>
                   </div>
                 </div>
             )}

         </div> {/* End Content Area */}
     </div>
   );
}