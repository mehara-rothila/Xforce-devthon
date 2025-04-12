// src/app/dashboard/AchievementsTab.tsx

'use client';
import React, { useState, useEffect } from 'react';
// Removed Link import as it wasn't used in this specific file
import api from '@/utils/api';
import { useAuth } from '../context/AuthContext'; // Assuming correct path

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode; // Allow ReactNode for rendered icons
  category: 'academic' | 'engagement' | 'milestone' | 'special';
  unlocked: boolean;
  progress?: number;
  totalNeeded?: number;
  xp: number;
  points?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  dateUnlocked?: string;
}

export default function AchievementsTab() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'engagement' | 'milestone' | 'special'>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Render an icon based on the icon name from the backend
  // (No dark mode changes needed here, icons are SVG)
  const renderIconByName = (iconName: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'perfect_score': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'streak_master': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'first_steps': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      'default': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    };
    return iconMap[iconName] || iconMap['default'];
  };


  // Fetch achievements data from API
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user?._id) {
        // Handle case where user is not yet available (optional: show loading or message)
        // setLoading(false); // Or keep loading until user is available
        return;
      }

      try {
        setLoading(true);
        setError(null); // Reset error on new fetch
        const response = await api.users.getAchievements(user._id);

        if (response.data?.status === 'success' && Array.isArray(response.data.data?.achievements)) {
          const achievementsData = response.data.data.achievements;

          const formattedAchievements = achievementsData.map((ach: any): Achievement => {
            // Ensure default values are set if API data is missing fields
            return {
              id: ach._id || ach.id || `fallback-${Math.random()}`, // Use _id if available, fallback
              title: ach.title || 'Untitled Achievement',
              description: ach.description || 'No description available.',
              icon: renderIconByName(ach.icon || 'default'), // Render icon here
              category: ach.category || 'special',
              unlocked: !!ach.unlocked, // Ensure boolean
              progress: typeof ach.progress === 'number' ? ach.progress : undefined,
              totalNeeded: typeof ach.totalNeeded === 'number' ? ach.totalNeeded : undefined,
              xp: typeof ach.xp === 'number' ? ach.xp : 0,
              points: typeof ach.points === 'number' ? ach.points : 0,
              rarity: ach.rarity || 'common',
              dateUnlocked: ach.dateUnlocked ? new Date(ach.dateUnlocked).toLocaleDateString() : undefined // Format date
            };
          });

          setAchievements(formattedAchievements);
        } else {
           throw new Error(response.data?.message || 'Invalid data structure received for achievements.');
        }
      } catch (err: any) {
        console.error("Error fetching achievements:", err);
        setError(err.response?.data?.message || err.message || "Failed to load achievements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user ID exists
    if (user?._id) {
        fetchAchievements();
    } else {
        // Optional: Set loading to false if you want to show "no user" state immediately
        // setLoading(false);
        // setError("Please log in to view achievements."); // Or similar message
    }

  }, [user?._id]); // Depend only on user._id

  // --- Updated Helper Functions with Dark Mode Classes ---

  const getRarityStyles = (rarity: Achievement['rarity']) => {
    // Added dark: variants for colors
    switch(rarity) {
      case 'common':
        return {
          bg: 'bg-gray-100 dark:bg-gray-700/60', // Slightly transparent dark bg
          border: 'border-gray-200 dark:border-gray-600/80',
          text: 'text-gray-700 dark:text-gray-300',
          badge: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
          iconBg: 'bg-gray-200 dark:bg-gray-600',
          iconColor: 'text-gray-700 dark:text-gray-300',
          shadow: 'shadow-sm',
          glow: ''
        };
      case 'uncommon':
        return {
          bg: 'bg-green-50 dark:bg-green-900/40',
          border: 'border-green-200 dark:border-green-700/60',
          text: 'text-green-700 dark:text-green-300',
          badge: 'bg-green-100 text-green-800 dark:bg-green-800/70 dark:text-green-200',
          iconBg: 'bg-green-100 dark:bg-green-800/70',
          iconColor: 'text-green-600 dark:text-green-400',
          shadow: 'shadow-sm',
          glow: ''
        };
      case 'rare':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/40',
          border: 'border-blue-200 dark:border-blue-700/60',
          text: 'text-blue-700 dark:text-blue-300',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-800/70 dark:text-blue-200',
          iconBg: 'bg-blue-100 dark:bg-blue-800/70',
          iconColor: 'text-blue-600 dark:text-blue-400',
          shadow: 'shadow-md',
          glow: ''
        };
      case 'epic':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/40',
          border: 'border-purple-200 dark:border-purple-700/60',
          text: 'text-purple-700 dark:text-purple-300',
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-800/70 dark:text-purple-200',
          iconBg: 'bg-purple-100 dark:bg-purple-800/70',
          iconColor: 'text-purple-600 dark:text-purple-400',
          shadow: 'shadow-md',
          glow: 'animate-pulse-slow' // Pulse might be distracting, consider removing in dark mode if needed
        };
      case 'legendary':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/40',
          border: 'border-yellow-300 dark:border-yellow-600/60', // Adjusted border
          text: 'text-yellow-700 dark:text-yellow-300',
          badge: 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900 dark:from-yellow-500 dark:to-yellow-700 dark:text-white', // Dark gradient
          iconBg: 'bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-yellow-500 dark:to-yellow-700', // Dark gradient
          iconColor: 'text-gray-900 dark:text-white', // Adjusted text color for contrast
          shadow: 'shadow-lg',
          glow: 'animate-pulse' // Pulse might be distracting
        };
      default: // Fallback, same as common
        return {
          bg: 'bg-gray-100 dark:bg-gray-700/60',
          border: 'border-gray-200 dark:border-gray-600/80',
          text: 'text-gray-700 dark:text-gray-300',
          badge: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
          iconBg: 'bg-gray-200 dark:bg-gray-600',
          iconColor: 'text-gray-700 dark:text-gray-300',
          shadow: 'shadow-sm',
          glow: ''
        };
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    // Added dark: variants
    switch(category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300';
      case 'engagement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300';
      case 'milestone':
        return 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300';
      case 'special':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/80 dark:text-gray-300';
    }
  };

  // --- Loading and Error States ---
  // Added dark mode text colors

  if (loading) { // Simplified loading check
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 dark:border-purple-400"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">Loading achievements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
        <div className="text-red-500 dark:text-red-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{error}</h3>
        {/* Removed reload button, prefer handling refetch via state/props if possible */}
        {/* <button
          onClick={() => window.location.reload()} // Consider a refetch function instead
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
        >
          Try Again
        </button> */}
      </div>
    );
  }

  // --- Filtered Data Calculation ---
  const filteredAchievements = achievements
    .filter(achievement => {
      if (activeFilter === 'unlocked') return achievement.unlocked;
      if (activeFilter === 'locked') return !achievement.unlocked;
      return true;
    })
    .filter(achievement => {
      if (categoryFilter === 'all') return true;
      return achievement.category === categoryFilter;
    });

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + (a.points || 0), 0);
  // Handle division by zero if totalAchievements is 0
  const progressPercent = totalAchievements > 0 ? Math.round((unlockedAchievements / totalAchievements) * 100) : 0;

  const rarityRanking = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5 };
  const rarestAchievement = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => rarityRanking[b.rarity] - rarityRanking[a.rarity])[0]; // Added type assertion


  // --- Main Render ---
  return (
    // Added dark mode background to the main container for consistency if needed
    // <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg`}>
    <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>

      {/* Achievements Overview Card */}
      {/* Added dark: variants for background, border */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
        {/* Header */}
        {/* Added dark: variants for border, text */}
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center">
            {/* Icon background remains gradient, text is white (ok for dark) */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Achievements</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Achievement Stats Grid */}
          {/* Added dark: variants to gradients, borders, text */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Unlocked Stat */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl p-5 border border-purple-200 dark:border-purple-700/60 shadow-sm">
              <h3 className="text-sm text-purple-600 dark:text-purple-300 font-medium mb-1">Achievements Unlocked</h3>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{unlockedAchievements} / {totalAchievements}</div>
                <div className="text-sm text-purple-700 dark:text-purple-400 font-medium">{progressPercent}%</div>
              </div>
              <div className="mt-2 h-2 bg-white/70 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Optional: Pulse effect might be less visible/needed in dark mode */}
                  {/* <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-30 dark:opacity-20 animate-pulse"></div> */}
                </div>
              </div>
            </div>

            {/* XP Stat */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl p-5 border border-blue-200 dark:border-blue-700/60 shadow-sm">
              <h3 className="text-sm text-blue-600 dark:text-blue-300 font-medium mb-1">Total XP Earned</h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalXP} XP</div>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">From achievements</div>
            </div>

            {/* Rarest Stat */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-xl p-5 border border-green-200 dark:border-green-700/60 shadow-sm">
              <h3 className="text-sm text-green-600 dark:text-green-300 font-medium mb-1">Rarest Achievement</h3>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {rarestAchievement ? rarestAchievement.title : 'None yet'}
              </div>
              {rarestAchievement && (
                <div className="flex items-center mt-2">
                  {/* Rarity badge styles now come from the updated getRarityStyles function */}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRarityStyles(rarestAchievement.rarity).badge}`}>
                    {rarestAchievement.rarity.charAt(0).toUpperCase() + rarestAchievement.rarity.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Points Stat */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 rounded-xl p-5 border border-yellow-200 dark:border-yellow-700/60 shadow-sm">
              <h3 className="text-sm text-yellow-600 dark:text-yellow-300 font-medium mb-1">Total Points Earned</h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalPoints}</div>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">From achievements</div>
            </div>
          </div>

          {/* Filters */}
          {/* Added dark: variants for buttons and select */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <div className="flex gap-3">
              {/* All Button */}
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-gray-900 dark:bg-indigo-600 text-white' // Active dark state
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' // Inactive dark state
                }`}
              >
                All
              </button>
              {/* Unlocked Button */}
              <button
                onClick={() => setActiveFilter('unlocked')}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                  activeFilter === 'unlocked'
                    ? 'bg-green-600 text-white dark:bg-green-600' // Active dark state (same as light)
                    : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60' // Inactive dark state
                }`}
              >
                Unlocked
              </button>
              {/* Locked Button */}
              <button
                onClick={() => setActiveFilter('locked')}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                  activeFilter === 'locked'
                    ? 'bg-gray-600 text-white dark:bg-gray-500' // Active dark state
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' // Inactive dark state
                }`}
              >
                Locked
              </button>
            </div>

            {/* Category Select */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="form-select rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="engagement">Engagement</option>
                <option value="milestone">Milestone</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map(achievement => {
                const rarityStyles = getRarityStyles(achievement.rarity);
                const categoryStyles = getCategoryColor(achievement.category); // Get category styles
                return (
                  // Apply styles directly from the helper functions
                  <div
                    key={achievement.id}
                    className={`rounded-xl ${rarityStyles.bg} border ${rarityStyles.border} p-5 ${rarityStyles.shadow} transition-all duration-300 hover:shadow-md dark:hover:shadow-lg dark:hover:border-gray-500/80 relative overflow-hidden ${achievement.unlocked ? '' : 'opacity-70 dark:opacity-60'}`} // Dim locked achievements slightly
                  >
                    {/* Rarity Badge */}
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rarityStyles.badge}`}>
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </span>
                      </div>
                    )}

                    {/* Icon and Text */}
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${rarityStyles.iconBg} ${rarityStyles.iconColor} mr-4 ${rarityStyles.glow}`}>
                        {achievement.icon} {/* Use the already rendered icon */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-bold ${achievement.unlocked ? rarityStyles.text : 'text-gray-500 dark:text-gray-400'} mb-1`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${achievement.unlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar (Locked) */}
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.totalNeeded !== undefined && achievement.totalNeeded > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.totalNeeded}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.totalNeeded) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Footer: Category & Points/XP */}
                    <div className="mt-4 flex justify-between items-center text-xs sm:text-sm">
                      {/* Category Badge */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryStyles}`}>
                        {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                      </span>

                      {/* XP and Points */}
                      <div className={`flex items-center space-x-2 ${achievement.unlocked ? '' : 'opacity-80'}`}>
                        <span className={`font-medium ${achievement.unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          +{achievement.xp} XP
                        </span>
                        {achievement.points && achievement.points > 0 ? (
                          <>
                            <span className="text-gray-400 dark:text-gray-500">•</span>
                            <span className={`font-medium ${achievement.unlocked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              +{achievement.points} Pts
                            </span>
                          </>
                        ) : null}
                        {/* Optional: Date Unlocked */}
                        {/* {achievement.unlocked && achievement.dateUnlocked && (
                          <>
                            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{achievement.dateUnlocked}</span>
                          </>
                        )} */}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // "No achievements found" state
              // Added dark: variants
              <div className="col-span-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-10 text-center border border-gray-200 dark:border-gray-700/50">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No achievements found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No achievements match your current filter settings. Try changing your filters or exploring more features to unlock them!
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setCategoryFilter('all');
                  }}
                  // Added light mode styles, kept dark mode styles
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}