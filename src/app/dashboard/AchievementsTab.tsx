'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'academic' | 'engagement' | 'milestone' | 'special';
  unlocked: boolean;
  progress?: number;
  totalNeeded?: number;
  xp: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  dateUnlocked?: string;
}

export default function AchievementsTab() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'engagement' | 'milestone' | 'special'>('all');
  
  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Achievement data (mock)
  const achievements: Achievement[] = [
    {
      id: 'perfectScore',
      title: 'Perfect Score',
      description: 'Score 100% on any quiz',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      category: 'academic',
      unlocked: true,
      xp: 100,
      rarity: 'uncommon',
      dateUnlocked: 'Mar 15, 2023',
    },
    {
      id: 'streakMaster',
      title: 'Streak Master',
      description: 'Maintain a 7-day study streak',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      category: 'engagement',
      unlocked: true,
      xp: 150,
      rarity: 'common',
      dateUnlocked: 'Feb 28, 2023',
    },
    {
      id: 'firstForum',
      title: 'Discussion Starter',
      description: 'Create your first forum post',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      category: 'engagement',
      unlocked: true,
      xp: 50,
      rarity: 'common',
      dateUnlocked: 'Jan 18, 2023',
    },
    {
      id: 'knowledgeSeeker',
      title: 'Knowledge Seeker',
      description: 'Complete all topics in one subject',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      category: 'academic',
      unlocked: false,
      progress: 85,
      totalNeeded: 100,
      xp: 300,
      rarity: 'rare',
    },
    {
      id: 'mathematicalGenius',
      title: 'Mathematical Genius',
      description: 'Score above 90% in 5 consecutive Math quizzes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      category: 'academic',
      unlocked: true,
      xp: 250,
      rarity: 'rare',
      dateUnlocked: 'Mar 5, 2023',
    },
    {
      id: 'helpfulAnswer',
      title: 'Helpful Mentor',
      description: 'Have your answer marked as "Best Answer" 10 times',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      category: 'engagement',
      unlocked: false,
      progress: 4,
      totalNeeded: 10,
      xp: 200,
      rarity: 'uncommon',
    },
    {
      id: 'collectionComplete',
      title: 'Resource Collector',
      description: 'Download at least one resource from each category',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      category: 'milestone',
      unlocked: false,
      progress: 3,
      totalNeeded: 5,
      xp: 150,
      rarity: 'uncommon',
    },
    {
      id: 'examAce',
      title: 'Exam Ace',
      description: 'Score in the top 5% nationally in any mock exam',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      category: 'academic',
      unlocked: false,
      xp: 500,
      rarity: 'epic',
    },
    {
      id: 'earlySpark',
      title: 'Early Learning Spark',
      description: 'Join the platform within the first month of launch',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      category: 'special',
      unlocked: true,
      xp: 200,
      rarity: 'legendary',
      dateUnlocked: 'Jan 2, 2023',
    },
    {
      id: 'dailystreak30',
      title: '30-Day Commitment',
      description: 'Maintain a 30-day study streak',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      category: 'milestone',
      unlocked: false,
      progress: 5,
      totalNeeded: 30,
      xp: 300,
      rarity: 'epic',
    },
    {
      id: 'subjectMaster',
      title: 'Subject Master',
      description: 'Score above 95% in 3 different subjects',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      category: 'academic',
      unlocked: false,
      progress: 1,
      totalNeeded: 3,
      xp: 400,
      rarity: 'epic',
    },
    {
      id: 'challenger',
      title: 'Challenge Seeker',
      description: 'Complete 20 hard difficulty quizzes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      category: 'milestone',
      unlocked: false,
      progress: 14,
      totalNeeded: 20,
      xp: 300,
      rarity: 'rare',
    },
  ];

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
const progressPercent = Math.round((unlockedAchievements / totalAchievements) * 100);

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
          <div className="text-xl font-bold text-gray-900 truncate">Early Learning Spark</div>
          <div className="flex items-center mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-yellow-300 to-yellow-500 text-white">
              Legendary
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200 shadow-sm">
          <h3 className="text-sm text-yellow-600 font-medium mb-1">Achievement Ranking</h3>
          <div className="text-2xl font-bold text-gray-900">Top 12%</div>
          <div className="mt-2 text-sm text-yellow-700">Of all students</div>
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
        {filteredAchievements.map(achievement => {
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
                  {achievement.icon}
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
              
              {!achievement.unlocked && achievement.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-700">{achievement.progress} / {achievement.totalNeeded}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" 
                      style={{ width: `${(achievement.progress / achievement.totalNeeded!) * 100}%` }}
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
                    <span className="mx-2 text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{achievement.dateUnlocked}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-500">+{achievement.xp} XP</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredAchievements.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-10 text-center border border-gray-200">
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
  
  {/* Achievement Collections */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
    <div className="px-6 py-6 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-900">Achievement Collections</h2>
      <p className="text-sm text-gray-600 mt-1">Complete sets of related achievements for bonus rewards</p>
    </div>
    
    <div className="p-6">
      <div className="space-y-6">
        {/* Academic Excellence Collection */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl overflow-hidden border border-blue-200">
          <div className="px-6 py-4 border-b border-blue-200 bg-blue-100/50 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Academic Excellence</h3>
            </div>
            <div className="text-sm text-blue-800 bg-blue-200 px-3 py-1 rounded-full">
              2/4 Complete
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600">Collection Progress</span>
                  <span className="text-gray-900 font-medium">50%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0 text-center">
                <div className="text-xs text-gray-600 mb-1">Reward</div>
                <div className="text-blue-700 font-bold">500 XP</div>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900">Perfect Score</span>
              </li>
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900">Mathematical Genius</span>
              </li>
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-500">Knowledge Seeker (85%)</span>
              </li>
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-500">Exam Ace</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Community Contributor Collection */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl overflow-hidden border border-purple-200">
          <div className="px-6 py-4 border-b border-purple-200 bg-purple-100/50 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Community Contributor</h3>
            </div>
            <div className="text-sm text-purple-800 bg-purple-200 px-3 py-1 rounded-full">
              2/3 Complete
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-600">Collection Progress</span>
                  <span className="text-gray-900 font-medium">67%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0 text-center">
                <div className="text-xs text-gray-600 mb-1">Reward</div>
                <div className="text-purple-700 font-bold">300 XP</div>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900">Streak Master</span>
              </li>
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900">Discussion Starter</span>
              </li>
              <li className="flex items-center text-sm">
                <div className="h-5 w-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-gray-500">Helpful Mentor (4/10)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
}