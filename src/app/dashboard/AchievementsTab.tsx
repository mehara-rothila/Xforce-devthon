'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { useAuth } from '../context/AuthContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category: 'academic' | 'engagement' | 'milestone' | 'special';
  unlocked: boolean;
  progress?: number;
  totalNeeded?: number;
  xp: number;
  points?: number; // Add points field
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
  
  // Get the authenticated user from context
  const { user } = useAuth();
  
  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fetch achievements data from API
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await api.users.getAchievements(user._id);
        
        if (response.data?.status === 'success') {
          const achievementsData = response.data.data.achievements;
          
          // Map the API response to match our component's expected format
          const formattedAchievements = achievementsData.map((ach: any) => {
            return {
              id: ach.id,
              title: ach.title,
              description: ach.description,
              icon: renderIconByName(ach.icon || ''),
              category: ach.category || 'academic',
              unlocked: ach.unlocked,
              progress: ach.progress,
              totalNeeded: ach.totalNeeded,
              xp: ach.xp,
              points: ach.points || 0,
              rarity: ach.rarity || 'common',
              dateUnlocked: ach.dateUnlocked
            };
          });
          
          setAchievements(formattedAchievements);
        }
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Failed to load achievements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user]);

  // Render an icon based on the icon name from the backend
  const renderIconByName = (iconName: string) => {
    // Map of icon names to SVG components
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
      // Add more mappings as needed
      'default': (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    };
    
    // Return the mapped icon or a default icon
    return iconMap[iconName] || iconMap['default'];
  };

  const getRarityStyles = (rarity: string) => {
    switch(rarity) {
      case 'common':
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-200 text-gray-700',
          iconBg: 'bg-gray-200',
          iconColor: 'text-gray-700',
          shadow: 'shadow-sm',
          glow: ''
        };
      case 'uncommon':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-800',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          shadow: 'shadow-sm',
          glow: ''
        };
      case 'rare':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          shadow: 'shadow-md',
          glow: ''
        };
      case 'epic':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-800',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          shadow: 'shadow-md',
          glow: 'animate-pulse-slow'
        };
      case 'legendary':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-white',
          iconBg: 'bg-gradient-to-r from-yellow-300 to-yellow-500',
          iconColor: 'text-white',
          shadow: 'shadow-lg',
          glow: 'animate-pulse'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-200 text-gray-700',
          iconBg: 'bg-gray-200',
          iconColor: 'text-gray-700',
          shadow: 'shadow-sm',
          glow: ''
        };
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'engagement':
        return 'bg-purple-100 text-purple-800';
      case 'milestone':
        return 'bg-green-100 text-green-800';
      case 'special':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading && !isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{error}</h3>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter achievements based on selections
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

  // Calculate stats
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + (a.points || 0), 0);
  const progressPercent = Math.round((unlockedAchievements / totalAchievements) * 100);

  // Find rarest unlocked achievement
  const rarityRanking = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5 };
  const rarestAchievement = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => rarityRanking[b.rarity as keyof typeof rarityRanking] - rarityRanking[a.rarity as keyof typeof rarityRanking])[0];

  return (
    <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>
      {/* Achievements Overview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Your Achievements</h2>
          </div>
        </div>
        
        <div className="p-6">
          {/* Achievement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 shadow-sm">
              <h3 className="text-sm text-purple-600 font-medium mb-1">Achievements Unlocked</h3>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900">{unlockedAchievements} / {totalAchievements}</div>
                <div className="text-sm text-purple-700 font-medium">{progressPercent}%</div>
              </div>
              <div className="mt-2 h-2 bg-white/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm">
              <h3 className="text-sm text-blue-600 font-medium mb-1">Total XP Earned</h3>
              <div className="text-2xl font-bold text-gray-900">{totalXP} XP</div>
              <div className="mt-2 text-sm text-blue-700">From achievements</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 shadow-sm">
              <h3 className="text-sm text-green-600 font-medium mb-1">Rarest Achievement</h3>
              <div className="text-xl font-bold text-gray-900 truncate">
                {rarestAchievement ? rarestAchievement.title : 'None yet'}
              </div>
              {rarestAchievement && (
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRarityStyles(rarestAchievement.rarity).badge}`}>
                    {rarestAchievement.rarity.charAt(0).toUpperCase() + rarestAchievement.rarity.slice(1)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200 shadow-sm">
              <h3 className="text-sm text-yellow-600 font-medium mb-1">Total Points Earned</h3>
              <div className="text-2xl font-bold text-gray-900">{totalPoints}</div>
              <div className="mt-2 text-sm text-yellow-700">From achievements</div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('unlocked')}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                  activeFilter === 'unlocked'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                Unlocked
              </button>
              <button
                onClick={() => setActiveFilter('locked')}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                  activeFilter === 'locked'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Locked
              </button>
            </div>
            
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="form-select rounded-lg border-gray-200 text-sm text-gray-700 focus:border-purple-500 focus:ring-purple-500"
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
                return (
                  <div 
                    key={achievement.id} 
                    className={`rounded-xl ${rarityStyles.bg} border ${rarityStyles.border} p-5 ${rarityStyles.shadow} transition-all duration-300 hover:shadow-md relative overflow-hidden`}
                  >
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rarityStyles.badge}`}>
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${rarityStyles.iconBg} ${rarityStyles.iconColor} mr-4 ${rarityStyles.glow}`}>
                        {typeof achievement.icon === 'string' ? 
                          renderIconByName(achievement.icon) : 
                          achievement.icon
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-base font-bold ${achievement.unlocked ? rarityStyles.text : 'text-gray-500'} mb-1`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.totalNeeded !== undefined && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-700">{achievement.progress} / {achievement.totalNeeded}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" 
                            style={{ width: `${(achievement.progress / achievement.totalNeeded) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                        {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                      </span>
                      
                      {achievement.unlocked ? (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-yellow-600">+{achievement.xp} XP</span>
                          {achievement.points ? (
                            <>
                              <span className="mx-2 text-xs text-gray-500">•</span>
                              <span className="text-sm font-medium text-blue-600">+{achievement.points} Points</span>
                            </>
                          ) : null}
                          {achievement.dateUnlocked && (
                            <>
                              <span className="mx-2 text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{achievement.dateUnlocked}</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-500">+{achievement.xp} XP</span>
                          {achievement.points ? (
                            <>
                              <span className="mx-2 text-xs text-gray-500">•</span>
                              <span className="text-sm font-medium text-gray-500">+{achievement.points} Points</span>
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-gray-50 rounded-xl p-10 text-center border border-gray-200">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No achievements found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  No achievements match your current filter settings. Try changing your filters to see more achievements.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Achievement Collections Section from original component can be added here if needed */}
    </div>
  );
}