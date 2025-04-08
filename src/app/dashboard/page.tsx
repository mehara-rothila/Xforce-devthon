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
    isSameMonth,
} from 'date-fns'; // Import necessary date-fns functions

// --- Import Child Components ---
// Ensure these components exist in the same directory or provide correct path
import RecommendationsSection from './RecommendationsSection';
import ProgressTab from './ProgressTab';
import AchievementsTab from './AchievementsTab';

// --- Import API and Auth Context ---
import api from '../../utils/api'; // Adjust path if needed
import { useAuth } from '@/app/context/AuthContext'; // Adjust path to your AuthContext

// --- Interface Definitions ---
interface SubjectProgress {
    subjectId: string; // Assuming backend sends subjectId
    name: string;
    color: string; // Assuming backend sends color
    progress: number;
}

interface DashboardSummary {
    userName: string; // Make sure backend sends this field or derive from user context
    level: number;
    xp: number;
    pointsToNextLevel: number; // Make sure backend calculates and sends this
    streak: number;
    points: number;
    leaderboardRank: string; // Or number, adjust based on backend
    subjectProgress: SubjectProgress[];
    // Add registration date if backend sends it
    // registrationDate?: string; // Example: ISO date string
}

interface ActivityItem {
    id: string; // Unique ID for each activity item
    type: 'quiz' | 'forum' | 'resource' | 'achievement' | 'level_up' | 'other'; // Added more types potentially
    title: string; // Main description, e.g., "Completed Quiz", "Posted in Forum"
    subject?: string; // Optional subject name
    details?: string; // Optional extra details, e.g., quiz name, forum topic title
    timestamp: string; // ISO date string
}

// --- Helper Components ---

// Renders an icon based on the activity type
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
        // Added ring for better visibility on different backgrounds
        <span className={`absolute left-0 top-1 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center ${textColor} shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
            {icon}
        </span>
    );
};


export default function Dashboard() {
    // --- Component State ---
    const [isPageLoaded, setIsPageLoaded] = useState(false); // For entry animation
    const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'achievements'>('overview');
    const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [errorSummary, setErrorSummary] = useState<string | null>(null);
    const [activityData, setActivityData] = useState<ActivityItem[] | null>(null);
    const [isLoadingActivity, setIsLoadingActivity] = useState(true);
    const [errorActivity, setErrorActivity] = useState<string | null>(null);
    // State for active dates (fetched from backend later)
    const [activeDates, setActiveDates] = useState<Set<string>>(new Set()); // Use a Set for efficient lookup ('YYYY-MM-DD')

    // Get auth state from context
    const auth = useAuth(); // Make sure AuthProvider wraps your layout
    const router = useRouter();

    // --- Calendar Logic ---
    // Using a fixed date for consistent display based on your context comment
    // Replace with `new Date()` for production
    const today = useMemo(() => new Date(2025, 3, 7), []); // April 7, 2025
    // const today = new Date(); // Use this line for actual current date

    const firstDayCurrentMonth = useMemo(() => startOfMonth(today), [today]);
    const lastDayCurrentMonth = useMemo(() => endOfMonth(today), [today]);

    // Generate days for the current month's calendar view
    const calendarDays = useMemo(() => {
        const days = eachDayOfInterval({
            start: firstDayCurrentMonth,
            end: lastDayCurrentMonth,
        });

        // Calculate starting weekday (0=Sun, 1=Mon, ..., 6=Sat)
        // Assuming week starts Monday for display (adjust if needed)
        // getDay returns 0 for Sunday, 1 for Monday...
        const startingDayIndex = (getDay(firstDayCurrentMonth) + 6) % 7; // Monday as 0 .. Sunday as 6

        // Create an array with explicit null placeholders for days before the month starts
        const placeholders = Array(startingDayIndex).fill(null);
        
        return [...placeholders, ...days];
    }, [firstDayCurrentMonth, lastDayCurrentMonth]);
    // --- End Calendar Logic ---

    // --- Data Fetching Effect ---
    useEffect(() => {
        setIsPageLoaded(true); // Trigger entry animation

        // Use a small timeout to allow context state to potentially settle after redirect
        const timerId = setTimeout(() => {
            const fetchAllDashboardData = async () => {
                // Only proceed if auth state is loaded and user object exists
                if (!auth.isLoading && auth.user) {
                    const userId = auth.user._id;
                    // Check if userId is actually present now after the timeout
                    if (!userId) {
                        // If still missing, the problem is definitely in how AuthContext sets the user state
                        console.error("[DASHBOARD_FETCH_ALL] Auth loaded, user object exists, but user._id is STILL missing after timeout!", auth.user);
                        setErrorSummary("User ID is missing, cannot fetch data. Please check AuthContext.");
                        setErrorActivity("User ID is missing, cannot fetch data.");
                        setIsLoadingSummary(false);
                        setIsLoadingActivity(false);
                        // Force logout might be appropriate here
                        // auth.logout();
                        // router.push('/login');
                        return; // Stop fetching
                    }

                    console.log(`[DASHBOARD_FETCH_ALL] Auth loaded, user ${userId} found after timeout. Fetching data...`);

                    // Reset states for fresh fetch
                    setIsLoadingSummary(true);
                    setErrorSummary(null);
                    setDashboardSummary(null);
                    setIsLoadingActivity(true);
                    setErrorActivity(null);
                    setActivityData(null);
                    setActiveDates(new Set());

                    // --- Fetch Summary ---
                    try {
                        console.log(`[DASHBOARD_FETCH_ALL] Fetching summary for user ${userId}...`);
                        const summaryResponse = await api.users.getDashboardSummary(userId);
                        const summaryApiData = summaryResponse.data;
                        if (summaryApiData?.status === 'success' && summaryApiData.data?.summary) {
                            setDashboardSummary(summaryApiData.data.summary);
                            console.log("[DASHBOARD_FETCH_ALL] Summary fetched successfully.");
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

                    // --- Fetch Activity ---
                    try {
                        console.log(`[DASHBOARD_FETCH_ALL] Fetching activity for user ${userId}...`);
                        const activityResponse = await api.users.getRecentActivity(userId);
                        const activityApiData = activityResponse.data;
                        if (activityApiData?.status === 'success' && activityApiData.data?.activities) {
                            if (Array.isArray(activityApiData.data.activities)) {
                                setActivityData(activityApiData.data.activities);
                                console.log(`[DASHBOARD_FETCH_ALL] Activity fetched successfully.`);
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

                    // --- Fetch Active Dates (Placeholder) ---
                    try {
                        console.warn("[DASHBOARD_FETCH_ALL] Active dates fetching requires backend implementation.");
                        const mockActiveDates = ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-05', '2025-04-06', '2025-04-07'];
                        setActiveDates(new Set(mockActiveDates));
                    } catch (err) {
                        console.error("[DASHBOARD_FETCH_ALL] Error fetching active dates:", err);
                    }

                } else if (!auth.isLoading && !auth.user) {
                    // Auth is loaded, but no user is logged in
                    console.log("[DASHBOARD_FETCH_ALL] Auth loaded, but no user found (checked after timeout). Redirecting to login.");
                    setIsLoadingSummary(false);
                    setIsLoadingActivity(false);
                    router.push('/login');
                } else {
                    // Auth context is still loading (shouldn't happen if timeout is used after initial load check)
                    console.log("[DASHBOARD_FETCH_ALL] Auth still loading (checked after timeout)...");
                    setIsLoadingSummary(true);
                    setIsLoadingActivity(true);
                }
            };

            fetchAllDashboardData();

        }, 0); // Use a 0ms timeout - this is enough to push execution to the next event loop tick

        // Cleanup timeout if component unmounts
        return () => clearTimeout(timerId);

    }, [auth.isLoading, auth.user, router, auth.logout, firstDayCurrentMonth]); // Dependencies remain the same

    // --- Function to Render Content Based on Active Tab ---
    const renderTabContent = () => {
        switch(activeTab) {
            case 'progress':
                // Pass necessary props to ProgressTab if needed
                // Example: <ProgressTab userId={auth.user?._id} />
                return <ProgressTab />;
            case 'achievements':
                // Pass necessary props to AchievementsTab if needed
                // Example: <AchievementsTab userId={auth.user?._id} />
                return <AchievementsTab />;
            case 'overview':
            default:
                // --- Overview Tab Content ---
                // This includes multiple sections: Welcome, Subjects, Recommendations, Activity, Streak Calendar
                return (
                    // Entry animation applied here
                    <div className={`transition-all duration-700 ease-out transform ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>

                        {/* --- Welcome Banner --- */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-900 rounded-2xl shadow-xl overflow-hidden relative transform transition-transform duration-300 hover:-translate-y-1">
                            {/* Decorative elements */}
                            <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
                            <div className="absolute bottom-0 left-0 mb-5 ml-5 w-20 h-20 bg-white rounded-full opacity-10"></div>
                            {/* Content */}
                            <div className="px-8 py-8 sm:py-10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">Ready to improve your A/L scores?</h2>
                                    <p className="text-indigo-100 text-lg">
                                        {auth.user ? `Let's continue, ${auth.user.name}!` : 'Your personalized learning journey is waiting!'}
                                    </p>
                                </div>
                                {/* Link this button to the main subjects page or the next recommended action */}
                                <Link href="/subjects" className="flex-shrink-0 px-8 py-3.5 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold shadow-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 dark:focus:ring-offset-indigo-700">
                                    View Subjects
                                </Link>
                            </div>
                        </div>

                        {/* --- Subject Cards Section --- */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/10 p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Subjects</h3>
                            {/* Loading State */}
                            {isLoadingSummary && ( <p className="text-gray-600 dark:text-gray-400 text-sm">Loading subject progress...</p> )}
                            {/* Error State */}
                            {errorSummary && !isLoadingSummary && ( <p className="text-red-600 dark:text-red-400 text-sm">Error loading subjects: {errorSummary}</p> )}
                            {/* Empty State */}
                            {!isLoadingSummary && !errorSummary && (!dashboardSummary || dashboardSummary.subjectProgress.length === 0) && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm">No subjects added yet. <Link href="/subjects" className="text-purple-600 hover:underline">Explore subjects</Link>.</p>
                            )}
                            {/* Success State */}
                            {!isLoadingSummary && !errorSummary && dashboardSummary && dashboardSummary.subjectProgress.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {dashboardSummary.subjectProgress.map(subj => (
                                        // Link each card to the specific subject page
                                        <Link href={`/subjects/${subj.subjectId}`} key={subj.subjectId} className="block p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-750 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-200 group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2 group-hover:text-purple-700 dark:group-hover:text-purple-300">{subj.name}</span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0`} style={{ backgroundColor: subj.color || '#6b7280' }}>
                                                    {subj.progress}%
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
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
                        {/* Assuming RecommendationsSection handles its own loading/data */}
                        <RecommendationsSection /* Pass userId or other props if needed */ />

                        {/* --- Recent Activity Section --- */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/10 border border-gray-100 dark:border-gray-700">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Activity</h2>
                                </div>
                                {/* Optional: Link to a full activity page */}
                                {/* <Link href="/activity" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium flex items-center transition-colors duration-150">
                                    View All <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </Link> */}
                            </div>
                            {/* Activity List */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                                {isLoadingActivity && ( <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading activity...</div> )}
                                {errorActivity && !isLoadingActivity && ( <div className="px-6 py-5 text-center text-sm text-red-500 dark:text-red-400">Could not load activity: {errorActivity}</div> )}
                                {!isLoadingActivity && !errorActivity && (!activityData || activityData.length === 0) && ( <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No recent activity found.</div> )}
                                {!isLoadingActivity && !errorActivity && activityData && activityData.length > 0 && (
                                    activityData.map((activity) => (
                                        <div key={activity.id} className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                                            <div className="relative pl-11"> {/* Increased padding for icon */}
                                                <ActivityIcon type={activity.type} />
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                                    <div className="flex-1 pr-4"> {/* Added padding right */}
                                                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug">{activity.title}</h3>
                                                        {(activity.subject || activity.details) && (
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                                {activity.subject} {activity.details && `(${activity.details})`}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="mt-1 sm:mt-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                                                        {/* Format timestamp nicely */}
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
                            {/* Header */}
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
                                    {/* Display current month/year */}
                                    <div className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                                        {format(today, 'MMMM yyyy')}
                                    </div>
                                </div>
                            </div>
                            {/* Calendar Body */}
                            <div className="p-4 md:p-6">
                                {/* Calendar Grid Headers (Mon-Sun) */}
                                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {/* Assuming week starts Monday */}
                                    <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
                                </div>
                                
                                {/* Calendar Grid Days - FIXED VERSION */}
                                <div className="grid grid-cols-7 gap-1">
                                    {calendarDays.map((day, index) => {
                                        // Enhanced check to filter out null, undefined, empty objects, and non-Date objects
                                        if (!day || !(day instanceof Date)) {
                                            // Render empty cell for placeholder days
                                            return <div key={`empty-${index}`} className="h-8 w-8"></div>;
                                        }

                                        try {
                                            const dayNumber = getDate(day);
                                            const dayString = format(day, 'yyyy-MM-dd');
                                            const isTodayDay = isToday(day);
                                            // Check if the day is marked as active from fetched data
                                            const isActiveDay = activeDates.has(dayString);

                                            // Determine cell styling
                                            let cellClasses = "h-8 w-8 rounded-lg flex items-center justify-center text-xs transition-colors duration-150 ";
                                            if (isTodayDay) {
                                                // Highlight today distinctly
                                                cellClasses += isActiveDay
                                                    ? "bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 dark:ring-indigo-500" // Today and active
                                                    : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-indigo-300 dark:ring-indigo-600"; // Today but not active
                                            } else if (isActiveDay) {
                                                // Highlight other active days
                                                cellClasses += "bg-purple-200 dark:bg-purple-800/60 text-purple-800 dark:text-purple-200 font-medium";
                                            } else {
                                                // Default style for other days in the month
                                                cellClasses += "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
                                            }

                                            return (
                                                <div key={dayString} className={cellClasses}>
                                                    {dayNumber}
                                                </div>
                                            );
                                        } catch (error) {
                                            // Fallback for any date processing errors
                                            console.error("Error processing calendar day:", error);
                                            return <div key={`error-${index}`} className="h-8 w-8"></div>;
                                        }
                                    })}
                                </div>
                                
                                {/* Legend/Info (Optional) */}
                                <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                                    {/* Example legend items */}
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
    // This structure includes the header with tabs and the main content area
    // which is split into a sidebar and the tab content.
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-850 transition-colors duration-300">
            {/* --- Dashboard Header --- */}
            <div className="sticky top-0 z-30 shadow-sm"> {/* Make header sticky */}
                <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 text-white overflow-hidden transition-colors duration-300 border-b border-purple-800/20 dark:border-gray-700/50">
                    {/* Background decorative elements (optional) */}
                    {/* <div className="absolute inset-0 overflow-hidden"> ... </div> */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"> {/* Use items-start */}

                    {/* --- SIDEBAR --- */}
                    <div className="lg:col-span-3 lg:sticky lg:top-28"> {/* Make sidebar sticky relative to header height + padding */}
                        <div className={`transition-all duration-700 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/10 overflow-hidden border border-gray-100 dark:border-gray-700/50">
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
                                {/* Sidebar Content (if user exists and summary loaded or loading) */}
                                {auth.user && (
                                    <>
                                        {/* Profile Section */}
                                        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700 text-center relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850">
                                            {/* Edit Profile Link */}
                                            <div className="absolute top-2 right-2">
                                                <Link href="/profile/edit" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                                </Link>
                                            </div>
                                            {/* Avatar */}
                                            <div className="inline-block relative mb-4">
                                                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 mx-auto flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg ring-4 ring-white dark:ring-gray-850">
                                                    <span className="relative z-10">{auth.user.name?.charAt(0).toUpperCase() || '?'}</span>
                                                </div>
                                                {/* Online indicator (optional) */}
                                                {/* <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" style={{ animationDuration: '2s' }}></div> */}
                                            </div>
                                            {/* User Name */}
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{auth.user.name}</h2>
                                            {/* Subjects List */}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate px-4 mt-1">
                                                {dashboardSummary?.subjectProgress && dashboardSummary.subjectProgress.length > 0
                                                    ? dashboardSummary.subjectProgress.map(s => s.name).join(', ')
                                                    : (isLoadingSummary ? 'Loading subjects...' : 'No subjects selected')}
                                            </p>
                                            {/* Mini Progress Bars */}
                                            <div className="mt-4 grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
                                                {dashboardSummary?.subjectProgress?.slice(0, 3).map((subject) => (
                                                    <div key={subject.subjectId} className="px-2 text-center group" title={`${subject.name}: ${subject.progress}%`}>
                                                        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 transition-all duration-300">{subject.progress}%</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{subject.name}</div>
                                                    </div>
                                                ))}
                                                {/* Placeholders if less than 3 subjects */}
                                                {Array(Math.max(0, 3 - (dashboardSummary?.subjectProgress?.length || 0))).fill(0).map((_, i) => (
                                                    <div key={`placeholder-${i}`} className="px-2 text-center group">
                                                        <div className="text-lg font-bold text-gray-400">{isLoadingSummary ? '...' : '--%'}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Subject</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Points & Level Section */}
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
                                                                {/* Calculate XP needed for next level (example: level * 150) - Adjust formula as needed */}
                                                                <span className="text-gray-500 dark:text-gray-400">{dashboardSummary.xp} / {(dashboardSummary.level + 1) * 150} XP</span>
                                                            </div>
                                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                                                                    // Calculate percentage for progress bar
                                                                    style={{ width: `${Math.min(100, (dashboardSummary.xp / ((dashboardSummary.level + 1) * 150)) * 100)}%`, transition: 'width 0.5s ease-in-out' }}>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                                        {/* Use pointsToNextLevel if provided, otherwise calculate */}
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">{dashboardSummary.pointsToNextLevel ?? (((dashboardSummary.level + 1) * 150) - dashboardSummary.xp)} XP</span> until next level
                                                    </div>
                                                    <div className="mt-3 text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                                                        {dashboardSummary.points?.toLocaleString() ?? 0} Points
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
                                                {/* Simplified Quick Links */}
                                                <li><Link href="/profile" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>My Profile</Link></li>
                                                <li><Link href="/rewards" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Rewards Store</Link></li>
                                                <li><Link href="/forum" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>Discussion Forum</Link></li>
                                                <li><Link href="/settings" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors duration-150 group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Settings</Link></li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div> {/* Closes sticky inner div */}
                        </div> {/* Closes transition div */}
                    </div> {/* Closes sidebar column div */}


                    {/* --- Main Content Area (Renders Tab Content) --- */}
                    <div className="lg:col-span-9">
                        {renderTabContent()}
                    </div>

                </div> {/* Closes grid div */}
            </div> {/* Closes max-w-7xl div */}
        </div> // Closes min-h-screen div
    ); // Closes return
} // Closes function Dashboard