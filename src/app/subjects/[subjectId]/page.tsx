"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../../DarkModeContext';
import api from '@/utils/api';
import { useParams } from 'next/navigation';
import SubjectIcon from '@/components/icons/SubjectIcon';
import {
    Loader2, AlertCircle, List, MessageSquare, BookOpen, Target, FileText,
    HelpCircle, Star, Download, ChevronRight, Link as LinkIcon, Award
} from 'lucide-react';

// Define the base URL using environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// --- Interfaces ---
interface Topic { _id?: string; id?: string; name: string; description?: string; order?: number; resources?: string[]; progress?: number; mastery?: 'Low' | 'Medium' | 'High'; }
interface SubjectData { _id: string; name: string; description: string; color?: string; gradientFrom?: string; gradientTo?: string; icon?: string; topics: Topic[]; forumCategoryId?: string; }
interface UserProgress { overallProgress: number; topics: Topic[]; }
interface Recommendation { id: number | string; title: string; type: string; difficulty: string; estimatedTime: string; description: string; }
interface StudyMaterial { id: string; title: string; type: string; downloadCount?: number; fileSize: string; lastUpdated: string; isPremium: boolean; filePath: string; }
interface PracticeQuiz { id: string; title: string; questions: number; difficulty: string; timeEstimate: string; averageScore: number; attempts: number; }
interface ForumDiscussion { id: string; title: string; content: string; replies: number; timestamp: string; }
interface Reward { _id: string; name: string; description: string; pointsCost: number; category: string; image?: string; stock?: number | null; }

// --- Helper Functions ---
const getTimeAgo = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const now = new Date(); const date = new Date(dateString); const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (isNaN(seconds) || seconds < 0) return 'Invalid date'; if (seconds < 60) return 'just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24); if (days < 7) return `${days}d ago`; const weeks = Math.floor(days / 7); if (weeks < 4) return `${weeks}w ago`; const months = Math.floor(days / 30); if (months < 12) return `${months}mo ago`; const years = Math.floor(days / 365); return `${years}y ago`;
    } catch (e) { console.error("Error formatting time:", e); return "Invalid date"; }
};
const getDifficultyColorClasses = (difficulty: string | undefined = ''): string => {
    const lowerDifficulty = difficulty?.toLowerCase() || '';
    switch (lowerDifficulty) { case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'; case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'; case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'; case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800'; case 'beginner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'; default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'; }
};
const getMasteryColor = (mastery: string | undefined = ''): string => {
    const lowerMastery = mastery?.toLowerCase() || '';
    switch (lowerMastery) { case 'high': return 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white'; case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white'; case 'low': return 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white'; default: return 'bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white'; }
};
const getResourceTypeIcon = (type: string | undefined = ''): React.ReactNode => {
    const lowerType = type?.toLowerCase() || '';
    const iconClass = "h-5 w-5 text-purple-600 dark:text-purple-400";
    switch (lowerType) { case 'notes': return <FileText className={iconClass} />; case 'pdf': return <FileText className={iconClass} />; case 'video': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>; case 'interactive': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>; case 'practice quiz': return <HelpCircle className={iconClass} />; case 'study notes': return <BookOpen className={iconClass} />; case 'video lesson': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>; default: return <LinkIcon className={iconClass} />; }
};
const getAverageScoreColor = (score: number | undefined = 0): string => { score = score || 0; if (score > 75) return 'text-green-600 dark:text-green-400'; if (score > 60) return 'text-yellow-600 dark:text-yellow-400'; return 'text-red-600 dark:text-red-400'; };
const getAverageScoreBgGradient = (score: number | undefined = 0): string => { score = score || 0; if (score > 75) return 'bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-600'; if (score > 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600'; return 'bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600'; };
const getCategoryStyles = (name: string = '') => {
    switch(name?.toLowerCase()) {
      case 'physics': return { color: 'blue', gradientFrom: 'from-blue-400', gradientTo: 'to-blue-600', hoverGradientFrom: 'from-blue-500', hoverGradientTo: 'to-blue-700', shadowColor: 'rgba(59, 130, 246, 0.5)', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800', badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10' };
      case 'chemistry': return { color: 'green', gradientFrom: 'from-green-400', gradientTo: 'to-green-600', hoverGradientFrom: 'from-green-500', hoverGradientTo: 'to-green-700', shadowColor: 'rgba(16, 185, 129, 0.5)', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800', badgeBg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/10' };
      case 'combined mathematics': return { color: 'yellow', gradientFrom: 'from-yellow-400', gradientTo: 'to-yellow-600', hoverGradientFrom: 'from-yellow-500', hoverGradientTo: 'to-yellow-700', shadowColor: 'rgba(245, 158, 11, 0.5)', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-800', badgeBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/10' };
      default: return { color: 'purple', gradientFrom: 'from-purple-400', gradientTo: 'to-purple-600', hoverGradientFrom: 'from-purple-500', hoverGradientTo: 'to-purple-700', shadowColor: 'rgba(124, 58, 237, 0.5)', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800', badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/10' };
    }
};

// ---

export default function SubjectDetailPage() {
    const { isDarkMode } = useDarkMode();
    const params = useParams();
    const subjectId = params.subjectId as string;

    // State variables...
    const [isLoadingSubject, setIsLoadingSubject] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [subjectData, setSubjectData] = useState<SubjectData | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [recommendedResources, setRecommendedResources] = useState<Recommendation[]>([]);
    const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
    const [practiceQuizzes, setPracticeQuizzes] = useState<PracticeQuiz[]>([]);
    const [recentDiscussions, setRecentDiscussions] = useState<ForumDiscussion[]>([]);
    const [subjectRewards, setSubjectRewards] = useState<Reward[]>([]);
    const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(false);
    const [isLoadingRecs, setIsLoadingRecs] = useState<boolean>(false);
    const [isLoadingMaterials, setIsLoadingMaterials] = useState<boolean>(true);
    const [isLoadingQuizzes, setIsLoadingQuizzes] = useState<boolean>(true);
    const [isLoadingDiscussions, setIsLoadingDiscussions] = useState<boolean>(false);
    const [isLoadingRewards, setIsLoadingRewards] = useState<boolean>(true);

    // Fetch all data using api.js
    useEffect(() => {
        if (!subjectId) {
            setError("Subject ID is missing.");
            setIsLoadingSubject(false); setIsLoadingMaterials(false); setIsLoadingQuizzes(false); setIsLoadingRewards(false);
            return;
        }
        const fetchAllData = async () => {
            setIsLoadingSubject(true); setIsLoadingMaterials(true); setIsLoadingQuizzes(true); setIsLoadingRewards(true); setError(null);
            setSubjectData(null); setStudyMaterials([]); setPracticeQuizzes([]); setSubjectRewards([]); setRecentDiscussions([]);
            let fetchedForumId: string | null = null;

            try {
                const [subjectRes, materialsRes, quizzesRes, rewardsRes] = await Promise.allSettled([
                    api.subjects.getById(subjectId),
                    api.resources.getStudyMaterials(subjectId),
                    api.quizzes.getPracticeQuizzes(subjectId, undefined),
                    api.rewards.getAll({ subject: subjectId, limit: 6 }),
                ]);

                // Process Subject Details
                if (subjectRes.status === 'fulfilled' && subjectRes.value.data?.status === 'success') {
                    const fetchedSubject = subjectRes.value.data.data.subject;
                    if (!fetchedSubject) throw new Error(`Subject not found`);
                    setSubjectData(fetchedSubject);
                    fetchedForumId = fetchedSubject.forumCategoryId || null;
                } else {
                    const errorMessage = subjectRes.status === 'rejected' ? (subjectRes.reason as any)?.response?.data?.message || (subjectRes.reason as any)?.message : (subjectRes.value.data as any)?.message || 'Failed to load subject details.';
                    throw new Error(`Subject Details Error: ${errorMessage}`);
                }

                // Process Study Materials
                if (materialsRes.status === 'fulfilled' && materialsRes.value.data?.status === 'success') {
                    setStudyMaterials(materialsRes.value.data.data?.materials?.map((m: any) => ({ ...m, id: m._id, lastUpdated: getTimeAgo(m.updatedAt || m.date), filePath: m.filePath || '' })) || []);
                } else { console.warn("Failed to load study materials:", materialsRes.status === 'rejected' ? materialsRes.reason : materialsRes.value.data); }
                setIsLoadingMaterials(false);

                // Process Practice Quizzes
                if (quizzesRes.status === 'fulfilled' && quizzesRes.value.data?.status === 'success') {
                    setPracticeQuizzes(quizzesRes.value.data.data?.practiceQuizzes?.map((q: any) => ({ ...q, id: q._id, questions: q.questions?.length || q.totalQuestions || 0, timeEstimate: q.timeLimit ? `${q.timeLimit} min` : 'N/A', averageScore: Math.round(Math.random() * 40 + 50), attempts: q.attempts || 0 })) || []);
                } else { console.warn("Failed to load practice quizzes:", quizzesRes.status === 'rejected' ? quizzesRes.reason : quizzesRes.value.data); }
                setIsLoadingQuizzes(false);

                 // Process Subject Rewards
                if (rewardsRes.status === 'fulfilled' && rewardsRes.value.data?.status === 'success') { setSubjectRewards(rewardsRes.value.data.data?.rewards || []); }
                else { console.warn("Failed to load subject rewards:", rewardsRes.status === 'rejected' ? rewardsRes.reason : rewardsRes.value.data); }
                setIsLoadingRewards(false);

                // Fetch Forum Topics if category ID exists
                if (fetchedForumId) {
                    setIsLoadingDiscussions(true);
                    try {
                        const forumRes = await api.forum.getTopicsByCategory(fetchedForumId, { limit: 3, sort: '-createdAt' });
                        if (forumRes.data?.status === 'success' && Array.isArray(forumRes.data.data?.topics)) {
                            setRecentDiscussions(forumRes.data.data.topics.map((topic: any) => ({ id: topic._id, title: topic.title, content: (topic.content || '').substring(0, 100) + '...', replies: topic.repliesCount || 0, timestamp: getTimeAgo(topic.createdAt) })));
                        } else { console.warn("Failed to load forum topics:", forumRes.data); setRecentDiscussions([]); }
                    } catch (forumErr) { console.error('Forum topic fetch failed:', forumErr); setRecentDiscussions([]); }
                    finally { setIsLoadingDiscussions(false); }
                } else { setIsLoadingDiscussions(false); }

                // TODO: Fetch Progress, Recommendations
                setIsLoadingProgress(false); setIsLoadingRecs(false);

            } catch (err: any) { console.error("Error fetching subject page data:", err); setError(err.message || "Failed to load subject data."); }
            finally { setIsLoadingSubject(false); }
        };
        fetchAllData();
    }, [subjectId]);

    // --- Render Logic ---
    if (isLoadingSubject) { return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>; }
    if (error) { return <div className="min-h-screen flex flex-col justify-center items-center text-center p-4"><AlertCircle className="h-12 w-12 text-red-500 mb-4"/><p className="text-red-600 dark:text-red-400 mb-4">{error}</p><Link href="/subjects" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Back to Subjects</Link></div>; }
    if (!subjectData) { return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">Subject data not available or subject not found.</div>; }

    const subjectStyle = getCategoryStyles(subjectData.name);
    const safeColor = subjectData.color || '#808080';

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 pb-16 transition-colors duration-300`}>
            {/* Dynamic Header */}
            <div className={`relative pt-16 pb-24 text-white overflow-hidden`} style={{ background: `linear-gradient(to right, ${subjectData.gradientFrom || safeColor}, ${subjectData.gradientTo || safeColor})`}}>
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                     <Link href="/subjects" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors duration-200 text-sm"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /> </svg> Back to Subjects </Link>
                     <div className="md:flex md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center drop-shadow-md">
                                {subjectData.icon && <span className="mr-3 p-2 bg-white/20 rounded-lg shadow-sm"><SubjectIcon iconName={subjectData.icon} className="h-8 w-8" color="white"/></span>}
                                {subjectData.name}
                            </h1>
                            <p className="text-lg text-white/90 max-w-3xl drop-shadow-sm">{subjectData.description}</p>
                        </div>
                     </div>
                 </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Progress Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700"> <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <Target className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Your Progress </h2> </div>
                            <div className="p-6"> {isLoadingProgress ? <p className="text-sm text-gray-500">Loading progress...</p> : userProgress ? ( <div> {/* ... progress bars ... */} </div> ) : <p className="text-sm text-gray-500">Could not load progress data.</p>} </div>
                        </section>

                        {/* Recommended Resources */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"> <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recommended For You</h2> <p className='text-sm text-gray-500'>Recommendations loading...</p> </section>

                        {/* Study Materials Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700"> <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <BookOpen className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Study Materials </h2> </div>
                            <div className="p-6">
                                {isLoadingMaterials ? <p className='text-sm text-gray-500'>Loading materials...</p> : studyMaterials.length > 0 ? (
                                    <ul className="space-y-3">
                                        {studyMaterials.map(material => ( 
                                            <li key={material.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"> 
                                                <div className="flex items-center min-w-0 flex-1"> 
                                                    <span className="text-purple-500 mr-3 text-xl flex-shrink-0">{getResourceTypeIcon(material.type)}</span> 
                                                    <div className='min-w-0'> 
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 block truncate" title={material.title}>{material.title}</span> 
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{material.fileSize} • Updated {material.lastUpdated}</span> 
                                                    </div> 
                                                </div> 
                                                <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center"> 
                                                    {material.isPremium && <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">(Premium)</span>} 
                                                    <a 
                                                        href={`${BASE_URL.replace('/api', '')}${material.filePath}`} 
                                                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-150 ${material.isPremium ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : `text-white hover:brightness-110 bg-[${safeColor}]`}`} 
                                                        title={material.isPremium ? "Premium Resource" : "Download"} 
                                                        aria-disabled={material.isPremium} 
                                                        onClick={(e) => material.isPremium && e.preventDefault()} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                    > 
                                                        <Download className="h-3.5 w-3.5 mr-1"/> 
                                                        {material.isPremium ? 'Locked' : 'Download'} 
                                                    </a> 
                                                </div> 
                                            </li> 
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No study materials available.</p>}
                            </div>
                        </section>

                        {/* Practice Quizzes Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                             <div className="p-6 border-b border-gray-200 dark:border-gray-700"> <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <HelpCircle className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Practice Quizzes </h2> </div>
                             <div className="p-6">
                                 {isLoadingQuizzes ? <p className='text-sm text-gray-500'>Loading quizzes...</p> : practiceQuizzes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {practiceQuizzes.map(quiz => (
                                            <div key={quiz.id} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-between bg-gray-50/50 dark:bg-gray-700/30">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{quiz.title}</h3>
                                                    <div className="flex flex-wrap gap-2 items-center text-xs mb-3">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{quiz.questions} Qs</span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{quiz.timeEstimate}</span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColorClasses(quiz.difficulty)}`}>{quiz.difficulty}</span>
                                                    </div>
                                                </div>
                                                <Link href={`/quiz/take?id=${quiz.id}&subject=${subjectId}`} className={`mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${safeColor}] transition-colors duration-150 hover:brightness-110`} style={{ background: safeColor }}>Start Quiz →</Link>
                                            </div>
                                        ))}
                                    </div>
                                 ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No practice quizzes available.</p>}
                             </div>
                        </section>

                        {/* Subject-Specific Rewards Section */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700"> <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <Award className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Related Rewards </h2> </div>
                            <div className="p-6">
                                {isLoadingRewards ? <p className='text-sm text-gray-500'>Loading rewards...</p> : subjectRewards.length > 0 ? (
                                    <div className="space-y-3">
                                        {subjectRewards.map(reward => ( <div key={reward._id} className="border dark:border-gray-700 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"> <div className='flex items-center'> <span className="text-2xl mr-3">{reward.image || '🎁'}</span> <div> <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">{reward.name}</h4> <p className="text-xs text-gray-500 dark:text-gray-400">{reward.pointsCost} points</p> </div> </div> <Link href="/rewards" className="text-xs px-3 py-1 rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40">View</Link> </div> ))}
                                    </div>
                                ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No specific rewards found for this subject.</p>}
                                <Link href="/rewards" className="mt-4 inline-block text-sm text-purple-600 dark:text-purple-400 hover:underline">View All Rewards →</Link>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-1 space-y-8">
                        {/* Forum Discussions */}
                         <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700"> <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <MessageSquare className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Recent Discussions </h2> </div>
                             <div className="p-6">
                                 {isLoadingDiscussions ? <p className='text-sm text-gray-500'>Loading discussions...</p> : recentDiscussions.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentDiscussions.map(discussion => ( <div key={discussion.id} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"> <Link href={`/forum/topic/${discussion.id}`} className="group block p-2 -m-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"> <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-150 line-clamp-2">{discussion.title}</h4> <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1"> <span>{discussion.replies} replies</span> <span>{discussion.timestamp}</span> </div> </Link> </div> ))}
                                        {subjectData.forumCategoryId && <Link href={`/forum/category/${subjectData.forumCategoryId}`} className="mt-4 block text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium">View All in Category →</Link>}
                                    </div>
                                 ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No recent discussions for this subject.</p>}
                             </div>
                         </section>
                    </aside>
                </div>
            </div>
            {/* Global styles */}
            <style jsx global>{`
              .prose img { margin-top: 1em; margin-bottom: 1em; }
              @keyframes widthGrow { from { width: 0%; } to { width: var(--target-width, 100%); } }
              .animate-widthGrow { animation: widthGrow 1s ease-out forwards; }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
           `}</style>
        </div>
    );
}