"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDarkMode } from '../DarkModeContext';
import api from '@/utils/api'; // Use the shared API utility
import { Loader2, AlertCircle, Check } from 'lucide-react'; // Import icons

// --- Interfaces ---
interface Reward {
  _id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  image?: string; // Optional: URL, path, or emoji
  isPopular?: boolean;
  isNew?: boolean;
  stock?: number | null; // Add stock
  isActive?: boolean;
  createdAt?: string; // Add timestamps if needed for sorting
  updatedAt?: string;
}

interface Category {
  id: string;
  name: string;
}

// --- Component ---
export default function RewardsPage() {
  const { isDarkMode } = useDarkMode();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('-isPopular -pointsCost'); // Default sort

  // State for fetched data
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for user points (using mock for now)
  // TODO: Replace with actual user data fetching/context
  const [userPoints, setUserPoints] = useState<number | null>(2750);
  const [isLoadingUserPoints, setIsLoadingUserPoints] = useState<boolean>(false); // Add loading state if fetching points
  const userLevel = 12; // Mock level

  // State for redeeming
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null); // Store ID of reward being redeemed
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null); // Store success message


  // --- Category List (Keep as is for filtering UI) ---
  const categories: Category[] = [
    { id: "all", name: "All Rewards" },
    { id: "Study Materials", name: "Study Materials" }, // Use backend enum values for id
    { id: "Premium Features", name: "Premium Features" },
    { id: "Events & Sessions", name: "Events & Sessions" },
    { id: "Profile & Cosmetics", name: "Profile & Cosmetics" },
    { id: "Physical Rewards", name: "Physical Rewards" },
    { id: "Other", name: "Other" }
  ];

  // --- Data Fetching ---
  const fetchRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRedeemError(null); // Clear redeem errors on refresh
    setRedeemSuccess(null); // Clear success messages on refresh

    const params: any = {
      // page: currentPage, // Add pagination later if needed
      limit: 100, // Fetch more for now, implement pagination later
    };

    // Map frontend sort option to backend API sort parameter
    switch (sortOption) {
        case 'points-asc': params.sort = 'pointsCost'; break;
        case 'points-desc': params.sort = '-pointsCost'; break;
        case 'newest': params.sort = '-createdAt'; break; // Use createdAt from timestamps
        default: params.sort = '-isPopular -pointsCost'; break; // Default: Popular then cheapest
    }

    if (activeCategory !== 'all') {
      params.category = activeCategory;
    }
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    // Ensure isActive=true is default on backend or add here: params.isActive = true;

    try {
      console.log("Fetching rewards with params:", params); // Log params
      const response = await api.rewards.getAll(params);
      if (response.data?.status === 'success' && Array.isArray(response.data.data?.rewards)) {
        setRewards(response.data.data.rewards);
        console.log("Fetched rewards:", response.data.data.rewards.length); // Log count
        // Set pagination data if backend provides it
        // setTotalPages(response.data.totalPages || 1);
        // setTotalItems(response.data.totalResults || 0);
      } else {
        throw new Error(response.data?.message || "Failed to fetch rewards: Invalid data format.");
      }
    } catch (err: any) {
      console.error("Error fetching rewards:", err);
      setError(err.response?.data?.message || err.message || "Could not load rewards.");
      setRewards([]); // Clear rewards on error
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchQuery, sortOption]); // Add dependencies

  // Fetch rewards initially and when filters/sort change
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  // TODO: Fetch actual user points when component mounts or user logs in
  // useEffect(() => { ... fetch user points logic ... }, []);


  // --- Event Handlers ---
  const handleRedeem = async (reward: Reward) => {
    if (isRedeeming) return;
    if (userPoints === null || userPoints < reward.pointsCost) {
        alert("Not enough points!");
        return;
    }

    if (!window.confirm(`Redeem "${reward.name}" for ${reward.pointsCost} points?`)) {
        return;
    }

    setIsRedeeming(reward._id);
    setRedeemError(null);
    setRedeemSuccess(null);

    try {
        const response = await api.rewards.redeem(reward._id);
        if (response.data?.status === 'success') {
            setRedeemSuccess(response.data.message || `Successfully redeemed ${reward.name}!`);
            setUserPoints(prevPoints => (prevPoints !== null ? prevPoints - reward.pointsCost : null));
            // Update stock locally
            setRewards(prev => prev.map(r =>
                r._id === reward._id && r.stock !== null ? { ...r, stock: Math.max(0, (r.stock || 1) - 1) } : r // Ensure stock doesn't go below 0
            ));
            setTimeout(() => setRedeemSuccess(null), 4000);
        } else {
            throw new Error(response.data?.message || "Redemption failed.");
        }
    } catch (err: any) {
        console.error("Error redeeming reward:", err);
        setRedeemError(err.response?.data?.message || err.message || "Could not redeem reward.");
        setTimeout(() => setRedeemError(null), 5000);
    } finally {
        setIsRedeeming(null);
    }
  };


  // Filter rewards based on active category and search query (client-side)
  // Note: Backend also filters, this is mainly for responsiveness if needed
  // Or remove if backend filtering is sufficient
  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = activeCategory === 'all' || reward.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative font-sans">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 dark:from-purple-800 dark:via-purple-700 dark:to-indigo-800 pt-16 pb-32 overflow-hidden transition-colors duration-300">
         <div className="absolute inset-0 overflow-hidden opacity-20"> <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>🏆</div> <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🎁</div> <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>📚</div> <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>⭐</div> <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>🏅</div> </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="sm:flex sm:items-center sm:justify-between">
             <div> <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl"> Rewards Store </h1> <p className="mt-2 text-lg text-purple-100"> Redeem your hard-earned points for rewards and premium content </p> </div>
             <div className="mt-4 sm:mt-0"> <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 dark:text-purple-200 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" /> </svg> Dashboard </Link> </div>
           </div>
         </div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12 relative z-20">
        {/* Points Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden mb-8 transition-colors duration-300">
           <div className="p-6 sm:p-8">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center mb-6 sm:mb-0">
                 <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-0.5 shadow-lg"> <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden transition-colors duration-300"> <span className="text-3xl">💰</span> </div> </div>
                 <div className="ml-6">
                   <div className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Your current balance</div>
                   <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 transition-colors duration-300">
                     {isLoadingUserPoints ? '...' : userPoints !== null ? `${userPoints} points` : 'N/A'}
                   </div>
                 </div>
               </div>
               <div className="flex items-center space-x-6">
                 <div className="flex items-center space-x-3"> <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center transition-colors duration-300"> <span className="text-xl">🏆</span> </div> <div> <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Level</div> <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{userLevel}</div> </div> </div>
                 {/* <button className="..."> Earn More Points </button> */}
               </div>
             </div>
           </div>
         </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/10 overflow-hidden mb-8 transition-colors duration-300 relative z-10">
           <div className="p-6">
             <div className="flex flex-wrap gap-2">
               {categories.map((category) => ( <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${ category.id === activeCategory ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white shadow-md transform scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' }`} > {category.name} </button> ))}
             </div>
             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <div className="relative flex-1">
                   <input type="text" placeholder="Search rewards..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" />
                   <div className="absolute left-3 top-2.5"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> </div>
                 </div>
                 <div className="flex items-center">
                   <label className="text-sm text-gray-500 dark:text-gray-400 mr-2 transition-colors duration-300 whitespace-nowrap">Sort by:</label>
                   <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 pl-3 pr-10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${isDarkMode ? '9ca3af' : '6b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                     <option value="-isPopular -pointsCost">Popular</option>
                     <option value="pointsCost">Points: Low to High</option>
                     <option value="-pointsCost">Points: High to Low</option>
                     <option value="-createdAt">Newest</option>
                   </select>
                 </div>
               </div>
             </div>
           </div>
         </div>

        {/* Loading State */}
        {isLoading && ( <div className="text-center py-10"><Loader2 className="h-10 w-10 mx-auto animate-spin text-purple-600" /><p className="mt-2 text-gray-500 dark:text-gray-400">Loading rewards...</p></div> )}
        {/* Error State */}
        {error && ( <div className="text-center py-10 max-w-md mx-auto bg-red-100 dark:bg-red-900/30 p-6 rounded-lg border border-red-300 dark:border-red-700 shadow-lg"><AlertCircle className="h-8 w-8 mx-auto text-red-500 dark:text-red-400 mb-2"/><p className="text-red-700 dark:text-red-300">{error}</p><button onClick={fetchRewards} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Retry</button></div> )}
        {/* No Results State */}
        {!isLoading && !error && filteredRewards.length === 0 && ( <div className="text-center py-10 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700 shadow-lg"><span className='text-4xl'>🤔</span><p className="mt-2 text-yellow-700 dark:text-yellow-300">No rewards found matching your criteria.</p></div> )}

        {/* Rewards Grid */}
        {!isLoading && !error && filteredRewards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 relative z-10">
            {filteredRewards.map((reward) => (
              <div key={reward._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/10 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-900/20" >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center text-3xl shadow-inner transition-colors duration-300">
                      {reward.image || '🎁'}
                    </div>
                    <div className="flex items-center space-x-2">
                      {reward.isNew && ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-colors duration-300"> New </span> )}
                      {reward.isPopular && ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 transition-colors duration-300"> Popular </span> )}
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300 h-14 line-clamp-2">{reward.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 h-10 line-clamp-2">{reward.description}</p>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center transition-colors duration-300 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-1 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor"> <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" /> <path d="M3 8v3c0 1.657 3.134 3 7 3s7-1.343 7-3V8c0 1.657-3.134 3-7 3S3 9.657 3 8z" /> <path d="M3 5v3c0 1.657 3.134 3 7 3s7-1.343 7-3V5c0 1.657-3.134 3-7 3S3 6.657 3 5z" /> </svg>
                    <span className="font-bold text-purple-700 dark:text-purple-400 transition-colors duration-300">{reward.pointsCost}</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={isLoadingUserPoints || userPoints === null || userPoints < reward.pointsCost || !!isRedeeming || (reward.stock !== null && reward.stock <= 0)} // Disable if out of stock
                    className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-200 w-28 ${
                      (userPoints !== null && userPoints >= reward.pointsCost && (reward.stock === null || reward.stock > 0))
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming === reward._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (reward.stock !== null && reward.stock <= 0) ? (
                        'Out of Stock'
                    ) : userPoints !== null && userPoints >= reward.pointsCost ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"> <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /> </svg>
                        Redeem
                      </>
                    ) : 'Need Points'}
                  </button>
                </div>
                {/* Display redeem status messages */}
                {redeemError && isRedeeming === null && <p className="px-6 pb-2 text-xs text-red-600 dark:text-red-400">{redeemError}</p>}
                {redeemSuccess && isRedeeming === null && <p className="px-6 pb-2 text-xs text-green-600 dark:text-green-400">{redeemSuccess}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10">
           {/* How to Earn Points Card */}
           <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] transition-colors duration-300">
             <div className="p-8">
               <div className="flex items-center mb-4"> <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mr-4"> 💪 </div> <h2 className="text-2xl font-bold text-white">How to Earn Points</h2> </div>
               <p className="text-blue-100 mb-6">Complete these activities to earn more points:</p>
               <ul className="space-y-4">
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">Complete quizzes</span> <p className="text-blue-100 text-sm">10-50 points each depending on difficulty</p> </div> </li>
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">Participate in discussions</span> <p className="text-blue-100 text-sm">5-20 points for quality contributions</p> </div> </li>
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">Daily login streak</span> <p className="text-blue-100 text-sm">5 points × consecutive days (bonus at milestones)</p> </div> </li>
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">Level up</span> <p className="text-blue-100 text-sm">100 points bonus for each new level</p> </div> </li>
               </ul>
             </div>
           </div>
           {/* Premium Membership Card */}
           <div className="bg-gradient-to-br from-purple-500 to-indigo-700 dark:from-purple-600 dark:to-indigo-800 rounded-2xl shadow-xl dark:shadow-gray-900/10 overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] transition-colors duration-300">
             <div className="p-8">
               <div className="flex items-center mb-4"> <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mr-4"> ✨ </div> <h2 className="text-2xl font-bold text-white">Premium Membership</h2> </div>
               <p className="text-purple-100 mb-6">Upgrade to get exclusive benefits:</p>
               <ul className="space-y-4">
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">2x points multiplier</span> <p className="text-purple-100 text-sm">Earn points twice as fast for all activities</p> </div> </li>
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">Exclusive premium rewards</span> <p className="text-purple-100 text-sm">Access premium-only content and rewards</p> </div> </li>
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">AI-powered study recommendations</span> <p className="text-purple-100 text-sm">Get personalized learning paths</p> </div> </li>
                 <li className="flex items-start text-white"> <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5"> <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div> <span className="font-medium">Monthly bonus points package</span> <p className="text-purple-100 text-sm">500 points added to your account each month</p> </div> </li>
               </ul>
               <button className="mt-8 w-full py-3 px-4 bg-white dark:bg-gray-200 rounded-xl text-center font-medium text-indigo-700 dark:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105 shadow-lg"> Upgrade to Premium </button>
             </div>
           </div>
        </div>
      </div>
       {/* Global styles */}
       <style jsx global>{`
         .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
         .animate-pulse-subtle { animation: pulse-subtle 3s infinite; }
         @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
         .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
         .animated-gradient { background-size: 400% 400%; animation: gradient-shift 8s ease infinite; }
         @keyframes gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
         .animated-border { position: relative; overflow: hidden; }
         .animated-border::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 3s infinite; }
         @keyframes shine { 0% { left: -100%; } 50% { left: 100%; } 100% { left: 100%; } }
         .floating-icon { animation: float 6s ease-in-out infinite; }
         .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
         .floating-icon-slow { animation: float 10s ease-in-out infinite; }
         @keyframes float { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0) rotate(0deg); } }
         @keyframes float-reverse { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(15px) rotate(-5deg); } 100% { transform: translateY(0) rotate(0deg); } }
         @keyframes widthGrow { from { width: 0%; } to { width: var(--target-width, 100%); } }
         .animate-widthGrow { animation: widthGrow 1s ease-out forwards; }
       `}</style>
    </div>
  )}