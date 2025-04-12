// src/app/dashboard/page.tsx
'use client'; // Essential for hooks and client-side logic
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
format,
formatDistanceToNow,
startOfMonth,
endOfMonth,
eachDayOfInterval,
getDay, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
getDate,
isToday,
} from 'date-fns'; // Import necessary date-fns functions
// --- Import Child Components ---
import RecommendationsSection from './RecommendationsSection';
import ProgressTab from './ProgressTab';
import AchievementsTab from './AchievementsTab';
// --- Import API and Auth Context ---
import api from '../../utils/api'; // Adjust path if needed
import { useAuth } from '@/app/context/AuthContext'; // Adjust path to your AuthContext
// --- Interface Definitions ---
interface SubjectProgress {
subjectId: string;
name: string;
color: string;
progress: number;
}
interface DashboardSummary {
userName: string;
level: number;
xp: number;
pointsToNextLevel: number;
levelProgress: number;
streak: number;
points: number;
quizPointsEarned: number;
achievementPoints: number; // New field for achievement points
leaderboardRank: string;
subjectProgress: SubjectProgress[];
// Add registration date if backend sends it
// registrationDate?: string;
}
interface ActivityItem {
id: string;
type: 'quiz' | 'forum' | 'resource' | 'achievement' | 'level_up' | 'other';
title: string;
subject?: string;
details?: string;
timestamp: string;
}
// --- Helper Components ---
const ActivityIcon: React.FC<{ type: ActivityItem['type'] }> = ({ type }) => {
let icon;
let bgColor = 'bg-gray-100 dark:bg-gray-700';
let textColor = 'text-gray-500 dark:text-gray-400';
switch (type) {
    case 'quiz':
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
        bgColor = 'bg-green-100 dark:bg-green-900/50';
        textColor = 'text-green-600 dark:text-green-400';
        break;
    case 'forum':
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>;
        bgColor = 'bg-blue-100 dark:bg-blue-900/50';
        textColor = 'text-blue-600 dark:text-blue-400';
        break;
    case 'resource':
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>;
        bgColor = 'bg-purple-100 dark:bg-purple-900/50';
        textColor = 'text-purple-600 dark:text-purple-400';
        break;
    // Add cases for other types like 'achievement', 'level_up' if needed
    default: // 'other' or unrecognized
        icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        bgColor = 'bg-gray-100 dark:bg-gray-700';
        textColor = 'text-gray-500 dark:text-gray-400';
}

return (
    <span className={`absolute left-0 top-1 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center ${textColor} shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
        {icon}
    </span>
);

};
// Calculate XP required for a specific level
// Must match the server-side formula exactly
// FIX: Add type annotation to the 'level' parameter
const calculateXpForLevel = (level: number) => {
return 100 * Math.pow(level - 1, 2);
};
export default function Dashboard() {
// --- Component State ---
const [isPageLoaded, setIsPageLoaded] = useState(false);
const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements'>('overview');
const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
const [isLoadingSummary, setIsLoadingSummary] = useState(true);
const [errorSummary, setErrorSummary] = useState<string | null>(null);
const [activityData, setActivityData] = useState<ActivityItem[] | null>(null);
const [isLoadingActivity, setIsLoadingActivity] = useState(true);
const [errorActivity, setErrorActivity] = useState<string | null>(null);
const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
const auth = useAuth();
const router = useRouter();

// --- Calendar Logic ---
const today = useMemo(() => new Date(2025, 3, 7), []); // April 7, 2025 (Fixed date)
// const today = new Date(); // Use this for actual current date

const firstDayCurrentMonth = useMemo(() => startOfMonth(today), [today]);
const lastDayCurrentMonth = useMemo(() => endOfMonth(today), [today]);

const calendarDays = useMemo(() => {
    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: lastDayCurrentMonth,
    });
    const startingDayIndex = (getDay(firstDayCurrentMonth) + 6) % 7; // Monday as 0
    const placeholders = Array(startingDayIndex).fill(null);
    return [...placeholders, ...days];
}, [firstDayCurrentMonth, lastDayCurrentMonth]);
// --- End Calendar Logic ---

// --- Data Fetching Effect ---
useEffect(() => {
    setIsPageLoaded(true); // Trigger entry animation

    const timerId = setTimeout(() => {
        const fetchAllDashboardData = async () => {
            if (!auth.isLoading && auth.user) {
                const userId = auth.user._id;
                if (!userId) {
                    console.error("[DASHBOARD_FETCH_ALL] Auth loaded, user object exists, but user._id is STILL missing after timeout!", auth.user);
                    setErrorSummary("User ID is missing, cannot fetch data. Please check AuthContext.");
                    setErrorActivity("User ID is missing, cannot fetch data.");
                    setIsLoadingSummary(false);
                    setIsLoadingActivity(false);
                    return;
                }

                console.log(`[DASHBOARD_FETCH_ALL] Auth loaded, user ${userId} found after timeout. Fetching data...`);

                // Reset states
                setIsLoadingSummary(true);
                setErrorSummary(null);
                setDashboardSummary(null);
                setIsLoadingActivity(true);
                setErrorActivity(null);
                setActivityData(null);
                setActiveDates(new Set());

                // Fetch Summary
                try {
                    const summaryResponse = await api.users.getDashboardSummary(userId);
                    const summaryApiData = summaryResponse.data;
                    if (summaryApiData?.status === 'success' && summaryApiData.data?.summary) {
                        setDashboardSummary(summaryApiData.data.summary);
                    } else {
                        throw new Error(summaryApiData?.message || 'Invalid summary data structure received.');
                    }
                } catch (err: any) {
                    console.error("[DASHBOARD_FETCH_ALL] Error fetching summary:", err);
                    setErrorSummary(err.response?.data?.message || err.message || 'Failed to load dashboard summary.');
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        auth.logout();
                        router.push('/login');
                    }
                } finally {
                    setIsLoadingSummary(false);
                }

                // Fetch Activity
                try {
                    const activityResponse = await api.users.getRecentActivity(userId);
                    const activityApiData = activityResponse.data;
                    if (activityApiData?.status === 'success' && activityApiData.data?.activities) {
                        if (Array.isArray(activityApiData.data.activities)) {
                            setActivityData(activityApiData.data.activities);
                        } else {
                            throw new Error('Activities data is not an array.');
                        }
                    } else {
                        throw new Error(activityApiData?.message || 'Invalid activity data structure received.');
                    }
                } catch (err: any) {
                    console.error("[DASHBOARD_FETCH_ALL] Error fetching activity:", err);
                    setErrorActivity(err.response?.data?.message || err.message || 'Failed to load recent activity.');
                } finally {
                    setIsLoadingActivity(false);
                }

                // Fetch Active Dates (Placeholder)
                try {
                    console.warn("[DASHBOARD_FETCH_ALL] Active dates fetching requires backend implementation.");
                    const mockActiveDates = ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-05', '2025-04-06', '2025-04-07'];
                    setActiveDates(new Set(mockActiveDates));
                } catch (err) {
                    console.error("[DASHBOARD_FETCH_ALL] Error fetching active dates:", err);
                }

            } else if (!auth.isLoading && !auth.user) {
                console.log("[DASHBOARD_FETCH_ALL] Auth loaded, but no user found (checked after timeout). Redirecting to login.");
                setIsLoadingSummary(false);
                setIsLoadingActivity(false);
                router.push('/login');
            } else {
                console.log("[DASHBOARD_FETCH_ALL] Auth still loading (checked after timeout)...");
                setIsLoadingSummary(true);
                setIsLoadingActivity(true);
            }
        };

        fetchAllDashboardData();
    }, 0); // 0ms timeout

    return () => clearTimeout(timerId);
}, [auth.isLoading, auth.user, router, auth.logout]); // Removed firstDayCurrentMonth as it's derived from today which is stable

// --- Function to Render Content Based on Active Tab ---
const renderTabContent = () => {
    switch(activeTab) {
        case 'progress':
            return <ProgressTab />;
        case 'achievements':
            return <AchievementsTab />;
        case 'overview':
        default:
            return (
                <div className={`transition-all duration-700 ease-out transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>

                    {/* --- Welcome Banner --- */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-900 rounded-2xl shadow-xl overflow-hidden relative transform transition-transform duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
                        <div className="absolute bottom-0 left-0 mb-5 ml-5 w-20 h-20 bg-white rounded-full opacity-10"></div>
                        <div className="px-8 py-8 sm:py-10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">Ready to improve your A/L scores?</h2>
                                <p className="text-indigo-100 text-lg">
                                    {auth.user ? `Let's continue, ${auth.user.name}!` : 'Your personalized learning journey is waiting!'}
                                </p>
                            </div>
                            <Link href="/subjects" className="flex-shrink-0 px-8 py-3.5 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold shadow-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 dark:focus:ring-offset-indigo-700">
                                View Subjects
                            </Link>
                        </div>
                    </div>

                    {/* --- Subject Cards Section --- */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/10 p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Subjects</h3>
                        {isLoadingSummary && ( <p className="text-gray-600 dark:text-gray-400 text-sm">Loading subject progress...</p> )}
                        {errorSummary && !isLoadingSummary && ( <p className="text-red-600 dark:text-red-400 text-sm">Error loading subjects: {errorSummary}</p> )}
                        {!isLoadingSummary && !errorSummary && (!dashboardSummary || dashboardSummary.subjectProgress.length === 0) && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">No subjects added yet. <Link href="/subjects" className="text-purple-600 hover:underline">Explore subjects</Link>.</p>
                        )}
                        {!isLoadingSummary && !errorSummary && dashboardSummary && dashboardSummary.subjectProgress.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {dashboardSummary.subjectProgress.map(subj => (
                                    <Link href={`/subjects/${subj.subjectId}`} key={subj.subjectId} className="block p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-750 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-200 group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2 group-hover:text-purple-700 dark:group-hover:text-purple-300">{subj.name}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0`} style={{ backgroundColor: subj.color || '#6b7280' }}>
                                                {subj.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${subj.progress}%`, backgroundColor: subj.color || '#4f46e5', transition: 'width 0.5s ease-in-out' }}
                                            ></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- AI Recommendations Section --- */}
                    <RecommendationsSection />

                    {/* --- Recent Activity Section --- */}
                    {/* Ensure the outer container has the correct background */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/10 border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Activity</h2>
                            </div>
                        </div>
                        {/* Ensure the list container also has the correct background */}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto bg-white dark:bg-gray-800">
                            {isLoadingActivity && ( <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading activity...</div> )}
                            {errorActivity && !isLoadingActivity && ( <div className="px-6 py-5 text-center text-sm text-red-500 dark:text-red-400">Could not load activity: {errorActivity}</div> )}
                            {!isLoadingActivity && !errorActivity && (!activityData || activityData.length === 0) && ( <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No recent activity found.</div> )}
                            {!isLoadingActivity && !errorActivity && activityData && activityData.length > 0 && (
                                activityData.map((activity) => (
                                    // Apply bg-white dark:bg-gray-800 to each item
                                    <div key={activity.id} className="px-6 py-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                                        <div className="relative pl-11">
                                            <ActivityIcon type={activity.type} />
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                                <div className="flex-1 pr-4">
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug">{activity.title}</h3>
                                                    {(activity.subject || activity.details) && (
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            {activity.subject} {activity.details && `(${activity.details})`}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="mt-1 sm:mt-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* --- Study Streak Calendar Section --- */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/10 border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Streak</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                            You're on a <span className="font-semibold text-purple-700 dark:text-purple-300">{isLoadingSummary ? '...' : (dashboardSummary?.streak ?? 0)}-day</span> streak! Keep it up.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                                    {format(today, 'MMMM yyyy')}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((day, index) => {
                                    if (!day || !(day instanceof Date)) {
                                        return <div key={`empty-${index}`} className="h-8 w-8"></div>;
                                    }
                                    try {
                                        const dayNumber = getDate(day);
                                        const dayString = format(day, 'yyyy-MM-dd');
                                        const isTodayDay = isToday(day);
                                        const isActiveDay = activeDates.has(dayString);

                                        let cellClasses = "h-8 w-8 rounded-lg flex items-center justify-center text-xs transition-colors duration-150 ";
                                        if (isTodayDay) {
                                            cellClasses += isActiveDay
                                                ? "bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 dark:ring-indigo-500"
                                                : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-300 dark:ring-indigo-600";
                                        } else if (isActiveDay) {
                                            cellClasses += "bg-purple-200 dark:bg-purple-800/60 text-purple-800 dark:text-purple-200 font-medium";
                                        } else {
                                            cellClasses += "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
                                        }

                                        return (
                                            <div key={dayString} className={cellClasses}>
                                                {dayNumber}
                                            </div>
                                        );
                                    } catch (error) {
                                        console.error("Error processing calendar day:", error);
                                        return <div key={`error-${index}`} className="h-8 w-8"></div>;
                                    }
                                })}
                            </div>
                            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center mr-3"><div className="h-3 w-3 rounded-full bg-indigo-600 mr-1.5"></div> Today</span>
                                <span className="inline-flex items-center"><div className="h-3 w-3 rounded-full bg-purple-200 dark:bg-purple-800/60 mr-1.5"></div> Active Day</span>
                                <p className="mt-1">(Active day highlighting requires backend data)</p>
                            </div>
                        </div>
                    </div>
                </div>
            ); // End of Overview Tab Content
    }
}; // End of renderTabContent

// --- Main Component Return ---
return (
    // Updated main container with Quiz page background style and relative positioning
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">

        {/* --- Animated Background Elements (Copied from Quiz Page) --- */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /> {/* Beaker */}
            </svg>
            </div>
            <div className="absolute top-[17%] right-[7%] opacity-60 floating-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> {/* Book */}
                </svg>
            </div>
            <div className="absolute bottom-[7%] left-[36%] opacity-60 floating-icon-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Globe */}
                </svg>
            </div>
            <div className="absolute top-[54%] right-[28%] opacity-60 floating-icon-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> {/* Calculator */}
                </svg>
            </div>
            <div className="absolute top-[23%] left-[67%] opacity-60 floating-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /> {/* Atom/Nucleus */}
                </svg>
            </div>
            <div className="absolute bottom-[37%] right-[6%] opacity-55 floating-icon-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /> {/* Magnet */}
                </svg>
            </div>
            <div className="absolute top-[71%] left-[13%] opacity-55 floating-icon-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> {/* Lightbulb */}
                </svg>
            </div>
        </div>
        {/* --- End Animated Background Elements --- */}


        {/* --- Dashboard Header (Sticky) --- */}
        {/* Added relative and z-30 to ensure it's above the background (z-0) */}
        <div className="sticky top-0 z-30 shadow-sm relative">
            <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 text-white overflow-hidden transition-colors duration-300 border-b border-purple-800/20 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> {/* Inner content z-10 relative to header */}
                    <div className="py-6 md:py-8">
                        {/* Top part: Title and Action Buttons */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-md">Student Dashboard</h1>
                                <p className="mt-1 text-purple-200 dark:text-gray-300">
                                    Welcome back, <span className="font-medium text-white">{auth.user?.name ?? 'Student'}</span>
                                </p>
                            </div>
                            <div className="flex space-x-3 flex-shrink-0">
                                <Link href="/resources" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white text-sm font-medium transition-all duration-200 flex items-center shadow-lg shadow-purple-900/20 hover:transform hover:scale-105">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                                    Resources
                                </Link>
                                <Link href="/quiz" className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-purple-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-medium transition-all duration-200 flex items-center shadow-lg shadow-purple-900/20 hover:transform hover:scale-105">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                                    Start Quiz
                                </Link>
                            </div>
                        </div>
                        {/* Bottom part: Tab Navigation */}
                        <div className="mt-6 border-b border-white/20 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('overview')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                        activeTab === 'overview'
                                            ? 'border-indigo-300 text-white'
                                            : 'border-transparent text-purple-100 hover:text-white hover:border-white/50'
                                    }`}
                                    aria-current={activeTab === 'overview' ? 'page' : undefined}
                                >
                                    Overview
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('progress')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                        activeTab === 'progress'
                                            ? 'border-indigo-300 text-white'
                                            : 'border-transparent text-purple-100 hover:text-white hover:border-white/50'
                                    }`}
                                    aria-current={activeTab === 'progress' ? 'page' : undefined}
                                >
                                    Progress
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('achievements')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                        activeTab === 'achievements'
                                            ? 'border-indigo-300 text-white'
                                            : 'border-transparent text-purple-100 hover:text-white hover:border-white/50'
                                    }`}
                                    aria-current={activeTab === 'achievements' ? 'page' : undefined}
                                >
                                    Achievements
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        {/* --- Main Content Area Grid --- */}
        {/* Added relative and z-10 to ensure it's above the background (z-0) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* --- SIDEBAR --- */}
                <div className="lg:col-span-3 lg:sticky lg:top-28">
                  <div className={`transition-all duration-700 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700/50">
                      {/* Sidebar Loading State */}
                      {isLoadingSummary && !dashboardSummary && (
                        <div className="px-6 py-6 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
                        </div>
                      )}
                      {/* Sidebar Error State */}
                      {errorSummary && !isLoadingSummary && (
                        <div className="px-6 py-6 text-center text-red-600 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
                          <p className="text-sm font-medium">Error loading profile:</p>
                          <p className="text-xs mt-1">{errorSummary}</p>
                        </div>
                      )}
                      {/* Sidebar Content */}
                      {auth.user && (
                        <>
                          {/* Profile Section */}
                          <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700 text-center relative bg-gradient-to-b from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-850/80">
                            <div className="absolute top-2 right-2">
                              <Link href="/profile/edit" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                              </Link>
                            </div>
                            <div className="inline-block relative mb-4">
                              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 mx-auto flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-850">
                                <span className="relative z-10">{auth.user.name?.charAt(0).toUpperCase() || '?'}</span>
                              </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{auth.user.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate px-4 mt-1">
                              {dashboardSummary?.subjectProgress && dashboardSummary.subjectProgress.length > 0
                                ? dashboardSummary.subjectProgress.map(s => s.name).join(', ')
                                : (isLoadingSummary ? 'Loading subjects...' : 'No subjects selected')}
                            </p>
                            <div className="mt-4 grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
                              {dashboardSummary?.subjectProgress?.slice(0, 3).map((subject) => (
                                <div key={subject.subjectId} className="px-2 text-center group" title={`${subject.name}: ${subject.progress}%`}>
                                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 transition-all duration-300">{subject.progress}%</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{subject.name}</div>
                                </div>
                              ))}
                              {Array(Math.max(0, 3 - (dashboardSummary?.subjectProgress?.length || 0))).fill(0).map((_, i) => (
                                <div key={`placeholder-${i}`} className="px-2 text-center group">
                                  <div className="text-lg font-bold text-gray-400">{isLoadingSummary ? '...' : '--%'}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Subject</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Points & Level Section - UPDATED */}
                          <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Points & Level</h3>
                              <Link href="/rewards" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium transition-colors duration-150">View Rewards</Link>
                            </div>
                            {!isLoadingSummary && dashboardSummary ? (
                              <>
                                <div className="flex items-center mb-2">
                                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <div className="flex justify-between mb-1 text-xs">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Level {dashboardSummary.level}</span>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        {/* Use the helper function here */}
                                        {dashboardSummary.xp.toLocaleString()} / {calculateXpForLevel(dashboardSummary.level + 1).toLocaleString()} XP
                                      </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                                          style={{ width: `${dashboardSummary.levelProgress}%`, transition: 'width 0.5s ease-in-out' }}>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">{dashboardSummary.pointsToNextLevel?.toLocaleString() ?? 0} XP</span> until next level
                                </div>

                                {/* Updated Points Display with Breakdown */}
                                <div className="mt-3 text-center">
                                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                                    {dashboardSummary.points?.toLocaleString() ?? 0} Total Points
                                  </div>

                                  {/* Points Breakdown */}
                                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-around">
                                    <div>
                                      <span className="font-medium text-purple-600 dark:text-purple-400">{dashboardSummary.quizPointsEarned?.toLocaleString() ?? 0}</span> Quiz
                                    </div>
                                    <div>
                                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{dashboardSummary.achievementPoints?.toLocaleString() ?? 0}</span> Achievements
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Loading stats...</div>
                            )}
                          </div>

                          {/* Quick Links Section */}
                          <div className="px-6 py-6">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">Quick Links</h3>
                            <ul className="space-y-2">
                              <li><Link href="/profile" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>My Profile</Link></li>
                              <li><Link href="/rewards" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Rewards Store</Link></li>
                              <li><Link href="/forum" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>Discussion Forum</Link></li>
                              <li><Link href="/settings" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Settings</Link></li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>


                {/* --- Main Content Area (Renders Tab Content) --- */}
                {/* Added backdrop-blur-sm and adjusted background opacity for better visibility over animated background */}
                <div className="lg:col-span-9 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-0 sm:p-2 md:p-4 border border-gray-100/50 dark:border-gray-700/30 shadow-inner">
                     {/* Render the content inside this slightly transparent container */}
                    {renderTabContent()}
                </div>

            </div> {/* Closes grid div */}
        </div> {/* Closes max-w-7xl div */}

        {/* Global styles for background animations (Copied from Quiz Page) */}
        <style jsx global>{`
            .text-10xl { font-size: 9rem; line-height: 1; }
            .text-11xl { font-size: 10rem; line-height: 1; }
            .floating-icon { animation: float 6s ease-in-out infinite; }
            .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
            .floating-icon-slow { animation: float 10s ease-in-out infinite; }
            @keyframes float { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0) rotate(0deg); } }
            @keyframes float-reverse { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-5deg); } 100% { transform: translateY(0) rotate(0deg); } }
            .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.5; } }
            .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

            /* Ensure content cards have slightly transparent backgrounds to see animation */
            /* Updated: Use more specific selectors if needed, but the direct class application should work */
            /* .bg-white.dark\\:bg-gray-800 {
                background-color: rgba(255, 255, 255, 0.9) !important; /* Light mode with slight transparency */
            /* } */
            /* .dark .bg-white.dark\\:bg-gray-800 {
                background-color: rgba(31, 41, 55, 0.9) !important; /* Dark mode with slight transparency (adjust gray-800 RGB if needed) */
            /* } */

            /* Adjust sidebar background for transparency */
             .bg-white\\/90 { background-color: rgba(255, 255, 255, 0.9); }
             .dark\\:bg-gray-800\\/90 { background-color: rgba(31, 41, 55, 0.9); } /* Adjust dark mode color if needed */

             /* Adjust main content area background for transparency */
             .bg-white\\/50 { background-color: rgba(255, 255, 255, 0.5); }
             .dark\\:bg-gray-800\\/50 { background-color: rgba(31, 41, 55, 0.5); } /* Adjust dark mode color if needed */

             /* Ensure the specific activity items and their container have solid backgrounds */
             /* The Tailwind classes added directly should handle this, but this is a fallback if needed */
             /* .recent-activity-container > div {
                background-color: white;
             }
             .dark .recent-activity-container > div {
                background-color: #1f2937; /* bg-gray-800 */
             /* } */

        `}</style>

    </div> // Closes min-h-screen div
); // Closes return

} // Closes function Dashboard