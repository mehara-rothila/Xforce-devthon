"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../../DarkModeContext'; // Adjust path if needed
import api from '@/utils/api';
import { useParams } from 'next/navigation';
import SubjectIcon from '@/components/icons/SubjectIcon'; // Ensure this path is correct
import { useAuth } from '@/app/context/AuthContext'; // Import useAuth hook
import { downloadResource } from '@/utils/downloadUtils'; // Import the download utility
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
interface Recommendation { id: number | string; title: string; type: string; difficulty: string; estimatedTime: string; description: string; link?: string; // Added link for easier interaction
 }
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
    switch (lowerType) {
        case 'notes': case 'pdf': case 'study notes': return <FileText className={iconClass} />;
        case 'video': case 'video lesson': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
        case 'interactive': return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>;
        case 'practice quiz': return <HelpCircle className={iconClass} />;
        default: return <LinkIcon className={iconClass} />;
    }
};
const getAverageScoreColor = (score: number | undefined = 0): string => { score = score || 0; if (score > 75) return 'text-green-600 dark:text-green-400'; if (score > 60) return 'text-yellow-600 dark:text-yellow-400'; return 'text-red-600 dark:text-red-400'; };
const getAverageScoreBgGradient = (score: number | undefined = 0): string => { score = score || 0; if (score > 75) return 'bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-600'; if (score > 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600'; return 'bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600'; };
const getCategoryStyles = (name: string = '') => {
    const lowerName = name?.toLowerCase();
    if (lowerName === 'physics') return { color: '#3B82F6', gradientFrom: '#60A5FA', gradientTo: '#3B82F6' }; // Blue
    if (lowerName === 'chemistry') return { color: '#10B981', gradientFrom: '#34D399', gradientTo: '#10B981' }; // Green
    if (lowerName === 'combined mathematics' || lowerName === 'combined math') return { color: '#F59E0B', gradientFrom: '#FBBF24', gradientTo: '#F59E0B' }; // Yellow
    return { color: '#8B5CF6', gradientFrom: '#A78BFA', gradientTo: '#8B5CF6' }; // Purple default
};

// --- Component ---

export default function SubjectDetailPage() {
    const { isDarkMode } = useDarkMode();
    const params = useParams();
    const subjectId = params.subjectId as string;
    const { user, isLoading: isAuthLoading } = useAuth();

    // State variables
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
    const [downloadingId, setDownloadingId] = useState<string | null>(null); // Track which file is downloading


    // Fetch all data using api.js with authenticated user data
    useEffect(() => {
        if (!subjectId) {
            setError("Subject ID is missing.");
            setIsLoadingSubject(false); setIsLoadingMaterials(false); setIsLoadingQuizzes(false); setIsLoadingRewards(false);
            return;
        }

        if (isAuthLoading) return; // Wait for auth

        const fetchAllData = async () => {
            setIsLoadingSubject(true); setIsLoadingMaterials(true); setIsLoadingQuizzes(true); setIsLoadingRewards(true); setError(null);
            setSubjectData(null); setStudyMaterials([]); setPracticeQuizzes([]); setSubjectRewards([]); setRecentDiscussions([]); setUserProgress(null); setRecommendedResources([]);
            setIsLoadingProgress(true);
            setIsLoadingRecs(true);
            setIsLoadingDiscussions(true);

            let fetchedForumId: string | null = null;

            try {
                // Subject data
                const subjectRes = await api.subjects.getById(subjectId);
                if (subjectRes.data?.status === 'success') {
                    const fetchedSubject = subjectRes.data.data.subject;
                    if (!fetchedSubject) throw new Error(`Subject not found`);
                    setSubjectData(fetchedSubject);
                    fetchedForumId = fetchedSubject.forumCategoryId || null;
                } else {
                    throw new Error(subjectRes.data?.message || 'Failed to load subject details.');
                }

                // Get subject materials
                const materialsRes = await api.resources.getStudyMaterials(subjectId);
                if (materialsRes.data?.status === 'success') {
                    setStudyMaterials(materialsRes.data.data?.materials?.map((m: any) => ({
                        ...m,
                        id: m._id,
                        lastUpdated: getTimeAgo(m.updatedAt || m.date),
                        filePath: m.filePath || '',
                        fileSize: m.fileSize ? `${(m.fileSize / (1024*1024)).toFixed(1)} MB` : 'N/A' // Format size
                    })) || []);
                } else { console.warn("Failed to load study materials:", materialsRes.data?.message); }
                setIsLoadingMaterials(false);

                // Get practice quizzes
                const quizzesRes = await api.quizzes.getPracticeQuizzes(subjectId, undefined);
                if (quizzesRes.data?.status === 'success') {
                    const quizzes = quizzesRes.data.data?.practiceQuizzes || [];
                    let quizzesWithUserData = [...quizzes];

                    if (user && user._id) {
                        try {
                            const userAttemptsRes = await api.quizzes.getUserAttempts(user._id);
                            if (userAttemptsRes.data?.status === 'success') {
                                const userAttempts = userAttemptsRes.data.data?.attempts || [];
                                quizzesWithUserData = quizzes.map((quiz: any) => {
                                    const quizAttempts = userAttempts.filter((a: any) => a.quiz?._id === quiz._id);
                                    const avgScore = quizAttempts.length > 0
                                        ? Math.round(quizAttempts.reduce((sum: number, a: any) => sum + a.score, 0) / quizAttempts.length)
                                        : null;
                                    return {
                                        ...quiz, id: quiz._id, questions: quiz.totalQuestions || quiz.questions?.length || 0, timeEstimate: quiz.timeLimit ? `${quiz.timeLimit} min` : 'N/A',
                                        averageScore: avgScore ?? 0, // Use avgScore or default 0
                                        attempts: quizAttempts.length || 0
                                    };
                                });
                            }
                        } catch (err) { console.warn("Failed to load user quiz attempts:", err); }
                    } else {
                        quizzesWithUserData = quizzes.map((q: any) => ({
                            ...q, id: q._id, questions: q.totalQuestions || q.questions?.length || 0, timeEstimate: q.timeLimit ? `${q.timeLimit} min` : 'N/A', averageScore: 0, attempts: 0
                        }));
                    }
                    setPracticeQuizzes(quizzesWithUserData);
                } else { console.warn("Failed to load practice quizzes:", quizzesRes.data?.message); }
                setIsLoadingQuizzes(false);

                // Get subject rewards
                const rewardsRes = await api.rewards.getAll({ subject: subjectId, limit: 6 });
                if (rewardsRes.data?.status === 'success') { setSubjectRewards(rewardsRes.data.data?.rewards || []); }
                else { console.warn("Failed to load subject rewards:", rewardsRes.data?.message); }
                setIsLoadingRewards(false);

                // --- User-Specific Data ---
                if (user && user._id) {
                    // Get user progress
                    setIsLoadingProgress(true);
                    try {
                        const progressRes = await api.users.getDetailedProgress(user._id, subjectId);
                        if (progressRes.data?.status === 'success') { setUserProgress(progressRes.data.data); }
                        else { console.warn("Failed to load user progress:", progressRes.data?.message); }
                    } catch (err) { console.error("Error fetching user progress:", err); }
                    finally { setIsLoadingProgress(false); }

                    // Get user-specific recommendations
                    setIsLoadingRecs(true);
                    try {
                        const recsRes = await api.subjects.getRecommendations(subjectId);
                        if (recsRes.data?.status === 'success') { setRecommendedResources(recsRes.data.data?.recommendations || []); }
                         else { console.warn("Failed to load recommendations:", recsRes.data?.message); }
                    } catch (err) { console.error("Error fetching recommendations:", err); }
                     finally { setIsLoadingRecs(false); }
                } else {
                    setIsLoadingProgress(false); setIsLoadingRecs(false);
                }

                // Fetch Forum Topics if category ID exists
                if (fetchedForumId) {
                    setIsLoadingDiscussions(true);
                    try {
                        const forumRes = await api.forum.getTopicsByCategory(fetchedForumId, { limit: 3, sort: '-createdAt' });
                        if (forumRes.data?.status === 'success' && Array.isArray(forumRes.data.data?.topics)) {
                            setRecentDiscussions(forumRes.data.data.topics.map((topic: any) => ({
                                id: topic._id, title: topic.title, content: (topic.content || '').substring(0, 100) + '...', replies: topic.repliesCount || 0, timestamp: getTimeAgo(topic.createdAt)
                            })));
                        } else {
                            console.warn("Failed to load forum topics:", forumRes.data?.message); setRecentDiscussions([]);
                        }
                    } catch (forumErr) { console.error('Forum topic fetch failed:', forumErr); setRecentDiscussions([]); }
                     finally { setIsLoadingDiscussions(false); }
                } else {
                    setIsLoadingDiscussions(false);
                }

            } catch (err: any) {
                console.error("Error setting up subject page data fetch:", err);
                setError(`Subject Details Error: ${err.message || "Failed to load subject page data."}`);
                // Ensure loaders are off even if the primary fetch failed
                setIsLoadingMaterials(false); setIsLoadingQuizzes(false); setIsLoadingRewards(false);
                setIsLoadingProgress(false); setIsLoadingRecs(false); setIsLoadingDiscussions(false);
            } finally {
                setIsLoadingSubject(false);
            }
        };

        fetchAllData();
    }, [subjectId, user, isAuthLoading]);

    // --- Handle Download Function ---
    const handleDownload = async (materialId: string, materialTitle: string) => {
        try {
            setDownloadingId(materialId);
            console.log(`Attempting to download resource: ${materialId} (${materialTitle})`);
            
            // Use the downloadResource utility
            const success = await downloadResource(materialId, materialTitle);
            
            if (success) {
                console.log('Download successful');
                // Optionally refresh materials to show updated download count
                if (subjectId) {
                    try {
                        const materialsRes = await api.resources.getStudyMaterials(subjectId);
                        if (materialsRes.data?.status === 'success') {
                            setStudyMaterials(materialsRes.data.data?.materials?.map((m: any) => ({
                                ...m,
                                id: m._id,
                                lastUpdated: getTimeAgo(m.updatedAt || m.date),
                                filePath: m.filePath || '',
                                fileSize: m.fileSize ? `${(m.fileSize / (1024*1024)).toFixed(1)} MB` : 'N/A'
                            })) || []);
                        }
                    } catch (err) {
                        console.warn("Failed to refresh study materials after download");
                    }
                }
            } else {
                console.error('Download failed');
                alert("Download failed. Please try again later.");
            }
        } catch (error) {
            console.error('Download error:', error);
            alert("An error occurred during download.");
        } finally {
            setDownloadingId(null);
        }
    };

    // --- Render Logic ---
    if ((isLoadingSubject || isAuthLoading) && !subjectData && !error) { // Enhanced Initial Loader
      return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
    }

    if (error && !subjectData) { // Major Error Screen
        return <div className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gray-100 dark:bg-gray-900"><AlertCircle className="h-12 w-12 text-red-500 mb-4"/><p className="text-red-600 dark:text-red-400 mb-4">{error}</p><Link href="/subjects" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Back to Subjects</Link></div>;
    }

    if (!isLoadingSubject && !subjectData) { // Definitive Not Found Screen
        return <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900">Subject data not available or subject not found.</div>;
    }

    const subjectStyle = getCategoryStyles(subjectData?.name);
    const safeColor = subjectData?.color || '#8B5CF6'; // Default to purple if color missing
    const safeGradientFrom = subjectData?.gradientFrom || subjectStyle.gradientFrom || safeColor;
    const safeGradientTo = subjectData?.gradientTo || subjectStyle.gradientTo || safeColor;

    // Helper function to determine if content should be locked
    const isLocked = (isMaterialPremium: boolean) => {
        // If the material isn't premium, it's never locked
        if (!isMaterialPremium) return false;
        // If auth is loading, assume locked to be safe
        if (isAuthLoading) return true;
        // If no user is logged in, premium material is locked
        if (!user) return true;
        // If user is logged in, check their role. Locked if NOT premium AND NOT admin.
        // Assumes roles 'premium' and 'admin' grant access. Adjust if your roles differ.
        return user.role !== 'premium' && user.role !== 'admin';
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pb-16 transition-colors duration-300 relative overflow-hidden`}>

            {/* --- START: Floating Background Elements (Copied from quiz/page.tsx) --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
                {/* Mathematical symbols - Randomly placed */}
                <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
                <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
                <div className="absolute top-[61%] left-[27%] text-green-500 dark:text-green-400 text-8xl opacity-75 floating-icon-slow">∞</div>
                <div className="absolute top-[19%] right-[38%] text-red-500 dark:text-red-400 text-11xl opacity-65 floating-icon">⚛</div>
                <div className="absolute top-[77%] right-[23%] text-yellow-500 dark:text-yellow-400 text-9xl opacity-70 floating-icon-slow">𝜙</div>
                <div className="absolute bottom-[31%] left-[8%] text-indigo-500 dark:text-indigo-400 text-10xl opacity-70 floating-icon-reverse">∫</div>
                <div className="absolute bottom-[12%] right-[42%] text-teal-500 dark:text-teal-400 text-9xl opacity-75 floating-icon">≈</div>
                <div className="absolute bottom-[47%] right-[9%] text-pink-500 dark:text-pink-400 text-8xl opacity-65 floating-icon-slow">±</div>

                {/* Additional math symbols - More random placements */}
                <div className="absolute top-[23%] left-[54%] text-fuchsia-500 dark:text-fuchsia-400 text-8xl opacity-70 floating-icon">Δ</div>
                <div className="absolute top-[44%] left-[38%] text-emerald-500 dark:text-emerald-400 text-7xl opacity-65 floating-icon-slow">λ</div>
                <div className="absolute top-[81%] left-[67%] text-cyan-500 dark:text-cyan-400 text-9xl opacity-70 floating-icon-reverse">θ</div>
                <div className="absolute top-[29%] left-[83%] text-rose-500 dark:text-rose-400 text-8xl opacity-65 floating-icon">α</div>
                <div className="absolute bottom-[63%] left-[6%] text-amber-500 dark:text-amber-400 text-9xl opacity-70 floating-icon-slow">β</div>
                <div className="absolute bottom-[19%] left-[71%] text-purple-500 dark:text-purple-400 text-8xl opacity-65 floating-icon-reverse">μ</div>
                <div className="absolute bottom-[28%] left-[32%] text-blue-500 dark:text-blue-400 text-7xl opacity-70 floating-icon">ω</div>

                {/* Additional symbols for more richness */}
                <div className="absolute top-[52%] left-[18%] text-sky-500 dark:text-sky-400 text-8xl opacity-60 floating-icon-slow">γ</div>
                <div className="absolute top-[37%] right-[29%] text-lime-500 dark:text-lime-400 text-9xl opacity-55 floating-icon">σ</div>
                <div className="absolute bottom-[42%] right-[37%] text-orange-500 dark:text-orange-400 text-10xl opacity-50 floating-icon-reverse">δ</div>
                <div className="absolute top-[73%] right-[13%] text-violet-500 dark:text-violet-400 text-8xl opacity-60 floating-icon-slow">ρ</div>

                {/* Science formulas - Random positions */}
                <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
                <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
                <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
                <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>
                <div className="absolute bottom-[53%] left-[24%] text-emerald-500 dark:text-emerald-400 text-5xl opacity-65 floating-icon-slow">v=λf</div>
                <div className="absolute top-[86%] left-[11%] text-sky-500 dark:text-sky-400 text-5xl opacity-55 floating-icon-reverse">C₆H₁₂O₆</div>
                <div className="absolute top-[68%] right-[31%] text-amber-500 dark:text-amber-400 text-6xl opacity-60 floating-icon">E=hf</div>

                {/* Science icons - Randomly positioned */}
                <div className="absolute top-[41%] left-[8%] opacity-60 floating-icon-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="absolute top-[17%] right-[7%] opacity-60 floating-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute bottom-[7%] left-[36%] opacity-60 floating-icon-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute top-[54%] right-[28%] opacity-60 floating-icon-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-[23%] left-[67%] opacity-60 floating-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                  </svg>
                </div>
                <div className="absolute bottom-[37%] right-[6%] opacity-55 floating-icon-reverse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="absolute top-[71%] left-[13%] opacity-55 floating-icon-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
            </div>
            {/* --- END: Floating Background Elements --- */}

            {/* Dynamic Header */}
            {subjectData && (
                <div className={`relative pt-16 pb-24 text-white overflow-hidden`} style={{ background: `linear-gradient(to right, ${safeGradientFrom}, ${safeGradientTo})`}}>
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
                            {/* Header Actions can go here */}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {subjectData && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-10">
                    {/* Minor Error Notice (if applicable) */}
                    {error && !isLoadingSubject && subjectData && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/30 dark:border-red-700 dark:text-red-300" role="alert">
                            <strong className="font-bold">Warning:</strong>
                            <span className="block sm:inline"> Some parts of the page may not have loaded correctly ({error.replace('Subject Details Error: ', '')}).</span>
                        </div>
                    )}

                     {/* Not Logged In Notice */}
                     {!isAuthLoading && !user && (
                         <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300" role="alert">
                             <strong className="font-bold">Note:</strong>
                             <span className="block sm:inline"> <Link href="/login" className="underline font-medium">Log in</Link> to see personalized content and track your progress.</span>
                         </div>
                     )}


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* --- START: Card Sections --- */}

                            {/* Progress Section - only show if user is logged in */}
                            {!isAuthLoading && user && (
                                <section className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700/50"> <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <Target className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Your Progress </h2> </div>
                                    <div className="p-6">
                                        {isLoadingProgress ? (
                                            <div className="flex justify-center items-center py-4"> <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading progress...</span> </div>
                                        ) : userProgress ? (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Overall progress: <span className="font-semibold">{userProgress.overallProgress}%</span></p>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden"> {/* Added overflow-hidden */}
                                                    <div className="h-2.5 rounded-full animate-widthGrow" style={{ width: `${userProgress.overallProgress}%`, background: safeColor, '--target-width': `${userProgress.overallProgress}%` } as React.CSSProperties}></div>
                                                </div>
                                                {userProgress.topics?.length > 0 && (
                                                    <div className="mt-6 space-y-4">
                                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic Progress</h3>
                                                        <div className="space-y-3">
                                                            {userProgress.topics.map((topic, index) => (
                                                                <div key={topic._id || index} className="space-y-1">
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-600 dark:text-gray-400">{topic.name}</span>
                                                                        <span className="font-medium">{topic.progress || 0}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden"> {/* Added overflow-hidden */}
                                                                        <div className="h-1.5 rounded-full animate-widthGrow" style={{ width: `${topic.progress || 0}%`, background: safeColor, '--target-width': `${topic.progress || 0}%` } as React.CSSProperties}></div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No progress data available yet. Start a quiz or interact with resources!</p>}
                                    </div>
                                </section>
                            )}

                            {/* Recommended Resources - only show if user is logged in */}
                            {!isAuthLoading && user && (
                                <section className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center"> <Star className="h-5 w-5 mr-2 text-yellow-500" /> Recommended For You </h2>
                                    {isLoadingRecs ? (
                                        <div className="flex justify-center items-center py-4"> <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Finding recommendations...</span> </div>
                                    ) : recommendedResources.length > 0 ? (
                                        <div className="space-y-3">
                                            {recommendedResources.map(rec => (
                                                <div key={rec.id} className="p-4 border border-gray-100 dark:border-gray-700/30 rounded-lg bg-white/50 dark:bg-gray-700/20 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150 flex justify-between items-start gap-3">
                                                   <div className="flex items-start flex-1 min-w-0">
                                                     <div className="mr-3 mt-1 flex-shrink-0">
                                                        {getResourceTypeIcon(rec.type)}
                                                     </div>
                                                     <div className="min-w-0">
                                                        <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate" title={rec.title}>{rec.title}</h3>
                                                        <div className="flex flex-wrap gap-x-2 gap-y-1 items-center text-xs mt-1 mb-2">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{rec.type}</span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{rec.estimatedTime}</span>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded ${getDifficultyColorClasses(rec.difficulty)}`}>{rec.difficulty}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{rec.description}</p>
                                                     </div>
                                                    </div>
                                                    {rec.link && (
                                                        <Link href={rec.link} className={`self-center flex-shrink-0 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white hover:brightness-110 transition-all`} style={{background: safeColor}}>
                                                             Go <ChevronRight className="h-3 w-3 ml-1"/>
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>Complete more activities to receive personalized recommendations.</p> }
                                </section>
                            )}

                           {/* Study Materials Section - UPDATED with fixed download functionality */}
                            <section className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <BookOpen className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Study Materials </h2>
                                    {studyMaterials.length > 5 && <Link href="/resources" className='text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline'>View All</Link>}
                                </div>
                                <div className="p-6">
                                    {isLoadingMaterials ? (
                                        <div className="flex justify-center items-center py-4"> <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading materials...</span> </div>
                                    ) : studyMaterials.length > 0 ? (
                                        <ul className="space-y-3">
                                            {studyMaterials.slice(0, 5).map(material => {
                                                const locked = isLocked(material.isPremium);
                                                const isDownloading = downloadingId === material.id;
                                                return (
                                                    <li key={material.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-700/30 bg-white/50 dark:bg-gray-700/10 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                                                        <div className="flex items-center min-w-0 flex-1">
                                                            <span className="text-purple-500 mr-3 text-xl flex-shrink-0">{getResourceTypeIcon(material.type)}</span>
                                                            <div className='min-w-0'>
                                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 block truncate" title={material.title}>{material.title}</span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">{material.fileSize} • Updated {material.lastUpdated}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
                                                            {material.isPremium && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"><Star className='h-3 w-3 mr-1'/>Premium</span>}
                                                            <button
                                                                onClick={() => !locked && !isDownloading && handleDownload(material.id, material.title)}
                                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-150 ${
                                                                    locked 
                                                                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                                                                    : isDownloading
                                                                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 cursor-wait' 
                                                                    : 'text-white hover:brightness-110'
                                                                }`}
                                                                style={{ background: locked || isDownloading ? undefined : safeColor }}
                                                                title={locked ? "Requires Premium Subscription" : "Download"}
                                                                disabled={locked || isDownloading}
                                                            >
                                                                {locked ? (
                                                                    <><Download className="h-3.5 w-3.5 mr-1"/> Locked</>
                                                                ) : isDownloading ? (
                                                                    <>
                                                                        <svg className="animate-spin h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Downloading...
                                                                    </>
                                                                ) : (
                                                                    <><Download className="h-3.5 w-3.5 mr-1"/> Download</>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No study materials available for this subject yet.</p>}
                                </div>
                            </section>

                             {/* Practice Quizzes Section */}
                             <section className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                                 <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <HelpCircle className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Practice Quizzes </h2>
                                     {practiceQuizzes.length > 4 && <Link href="/quiz" className='text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline'>View All</Link>}
                                 </div>
                                 <div className="p-6">
                                     {isLoadingQuizzes ? (
                                         <div className="flex justify-center items-center py-4"> <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading quizzes...</span> </div>
                                     ) : practiceQuizzes.length > 0 ? (
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {practiceQuizzes.slice(0, 4).map(quiz => (
                                                 <div key={quiz.id} className="border dark:border-gray-700/30 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-between bg-white/50 dark:bg-gray-700/10">
                                                     <div>
                                                         <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 h-12">{quiz.title}</h3> {/* Fixed height */}
                                                         <div className="flex flex-wrap gap-2 items-center text-xs mb-3">
                                                             <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{quiz.questions} Qs</span>
                                                             <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{quiz.timeEstimate}</span>
                                                             <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColorClasses(quiz.difficulty)}`}>{quiz.difficulty}</span>
                                                         </div>
                                                         {user && quiz.attempts > 0 && (
                                                             <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/20'>
                                                                 <span>Attempts: {quiz.attempts}</span>
                                                                 {quiz.averageScore > 0 ? (
                                                                     <span>Avg Score: <span className={getAverageScoreColor(quiz.averageScore)}>{quiz.averageScore}%</span></span>
                                                                 ): ( <span>No scores yet</span> )}
                                                             </div>
                                                         )}
                                                          {/* Add default message if not attempted by logged-in user */}
                                                          {user && quiz.attempts === 0 && (
                                                               <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/20">Not attempted yet.</p>
                                                           )}
                                                          {!user && (
                                                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/20"><Link href="/login" className='underline'>Log in</Link> to track attempts.</p>
                                                           )}
                                                     </div>
                                                      <Link href={`/quiz/take?id=${quiz.id}&subject=${subjectId}`} className={`mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${safeColor}] transition-colors duration-150 hover:brightness-110`} style={{ background: safeColor }}>Start Quiz <ChevronRight className='h-4 w-4 ml-1'/></Link>
                                                 </div>
                                             ))}
                                         </div>
                                     ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No practice quizzes available for this subject yet.</p>}
                                 </div>
                             </section>


                            {/* Subject-Specific Rewards Section */}
                            <section className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                                 <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <Award className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Related Rewards </h2>
                                    <Link href="/rewards" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">View All Rewards →</Link>
                                </div>
                                <div className="p-6">
                                    {isLoadingRewards ? (
                                        <div className="flex justify-center items-center py-4"> <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading rewards...</span> </div>
                                    ) : subjectRewards.length > 0 ? (
                                        <div className="space-y-3">
                                            {subjectRewards.map(reward => ( <div key={reward._id} className="border dark:border-gray-700/30 rounded-lg p-3 flex items-center justify-between bg-white/50 dark:bg-gray-700/10 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"> <div className='flex items-center min-w-0'> <span className="text-2xl mr-3 flex-shrink-0">{reward.image || '🎁'}</span> <div className='min-w-0'> <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate" title={reward.name}>{reward.name}</h4> <p className="text-xs text-gray-500 dark:text-gray-400">{reward.pointsCost} points</p> </div> </div> <Link href="/rewards" className="text-xs px-3 py-1 rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40 flex-shrink-0">View</Link> </div> ))}
                                        </div>
                                    ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No specific rewards found for this subject.</p>}
                                </div>
                            </section>

                            {/* --- END: Card Sections --- */}
                        </div>

                        {/* Sidebar Area */}
                        <aside className="lg:col-span-1 space-y-8">
                             <section className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden sticky top-24"> {/* Made Sticky */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center"> <MessageSquare className="h-5 w-5 mr-2" style={{ color: safeColor }}/> Discussions </h2>
                                     {subjectData.forumCategoryId && <Link href={`/forum/category/${subjectData.forumCategoryId}`} className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">View Category</Link>}
                                </div>
                                <div className="p-6">
                                    {isLoadingDiscussions ? (
                                        <div className="flex justify-center items-center py-4"> <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading discussions...</span> </div>
                                    ) : recentDiscussions.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentDiscussions.map(discussion => (
                                                 <div key={discussion.id} className="pb-4 border-b border-gray-100 dark:border-gray-700/30 last:border-b-0">
                                                     <Link href={`/forum/topic/${discussion.id}`} className="group block p-2 -m-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                                                        <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-150 line-clamp-2">{discussion.title}</h4>
                                                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                           <span>{discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}</span>
                                                           <span>{discussion.timestamp}</span>
                                                         </div>
                                                     </Link>
                                                </div>
                                            ))}
                                         </div>
                                    ) : <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No recent discussions for this subject yet.</p>}
                                </div>
                             </section>
                        </aside>
                    </div>
                </div>
            )}
            {/* Global styles */}
            <style jsx global>{`
              .prose img { margin-top: 1em; margin-bottom: 1em; } /* Example for markdown */
              .text-10xl { font-size: 9rem; line-height: 1; } /* Copied */
              .text-11xl { font-size: 10rem; line-height: 1; } /* Copied */

              @keyframes widthGrow { from { width: 0%; } to { width: var(--target-width, 100%); } }
              .animate-widthGrow { animation: widthGrow 1s ease-out forwards; }

              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

              .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
              .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
              @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

              .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; } /* Copied */
              @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.5; } } /* Copied */

              /* Enhanced Floating Icon Animations (Copied from quiz/page.tsx) */
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
                0% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(5deg); }
                100% { transform: translateY(0) rotate(0deg); }
              }
              @keyframes float-reverse {
                0% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(15px) rotate(-5deg); }
                100% { transform: translateY(0) rotate(0deg); }
              }
              /* End Copied Animations */

              .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
              .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
           `}</style>
        </div>
    );
}