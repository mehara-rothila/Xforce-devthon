"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RewardsPage() {
  // State for active category
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data - in a real application, this would come from your authentication/database system
  const user = {
    name: "Kaveesha Piumal",
    points: 2750,
    level: 12
  };

  // Mock rewards data
  const rewards = [
    {
      id: 1,
      name: "Premium Study Notes Bundle",
      description: "Get access to comprehensive study notes for all subjects, prepared by top teachers.",
      pointsCost: 500,
      category: "study",
      image: "📚",
      isPopular: true,
      isNew: false
    },
    {
      id: 2,
      name: "Past Paper Collection",
      description: "Unlock access to 10 years of past papers with detailed answers and explanations.",
      pointsCost: 800,
      category: "study",
      image: "📝",
      isPopular: true,
      isNew: false
    },
    {
      id: 3,
      name: "AI Study Planner (1 month)",
      description: "Get personalized AI-powered study plans based on your performance and goals.",
      pointsCost: 1200,
      category: "premium",
      image: "🤖",
      isPopular: false,
      isNew: true
    },
    {
      id: 4,
      name: "Virtual Study Group Session",
      description: "Join a 2-hour guided study session with top students and teachers.",
      pointsCost: 400,
      category: "event",
      image: "👨‍👩‍👧‍👦",
      isPopular: false,
      isNew: false
    },
    {
      id: 5,
      name: "Profile Badge: Star Student",
      description: "Show off your dedication with this exclusive profile badge.",
      pointsCost: 300,
      category: "cosmetic",
      image: "⭐",
      isPopular: false,
      isNew: false
    },
    {
      id: 6,
      name: "Formula Sheet Poster",
      description: "Physical poster with key formulas for Physics, Chemistry, and Mathematics.",
      pointsCost: 1000,
      category: "physical",
      image: "🖼️",
      isPopular: false,
      isNew: false
    },
    {
      id: 7,
      name: "Mock Exam with Feedback",
      description: "Take a timed mock exam and receive detailed feedback from experienced teachers.",
      pointsCost: 750,
      category: "study",
      image: "📊",
      isPopular: true,
      isNew: false
    },
    {
      id: 8,
      name: "1-on-1 Tutoring Session",
      description: "30-minute one-on-one tutoring session with a subject expert.",
      pointsCost: 1500,
      category: "premium",
      image: "👨‍🏫",
      isPopular: true,
      isNew: false
    },
    {
      id: 9,
      name: "Custom Theme Pack",
      description: "Personalize your learning experience with exclusive theme options.",
      pointsCost: 250,
      category: "cosmetic",
      image: "🎨",
      isPopular: false,
      isNew: true
    },
    {
      id: 10,
      name: "DEV{thon} T-Shirt",
      description: "Show your pride with an official DEV{thon} Learning Platform t-shirt.",
      pointsCost: 2000,
      category: "physical",
      image: "👕",
      isPopular: false,
      isNew: false
    },
    {
      id: 11,
      name: "Exam Preparation Kit",
      description: "Physical kit with stationary, formula cards, and study planner.",
      pointsCost: 1800,
      category: "physical",
      image: "🎒",
      isPopular: false,
      isNew: true
    },
    {
      id: 12,
      name: "Advanced Problem Set",
      description: "Challenge yourself with advanced problems in your chosen subject.",
      pointsCost: 600,
      category: "study",
      image: "🧩",
      isPopular: false,
      isNew: false
    }
  ];

  // Filter categories
  const categories = [
    { id: "all", name: "All Rewards" },
    { id: "study", name: "Study Materials" },
    { id: "premium", name: "Premium Features" },
    { id: "event", name: "Events & Sessions" },
    { id: "cosmetic", name: "Profile & Cosmetics" },
    { id: "physical", name: "Physical Rewards" }
  ];

  // Filter rewards based on active category and search query
  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = activeCategory === 'all' || reward.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header with Animated Background */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-16 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>🏆</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>🎁</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>📚</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>⭐</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>🏅</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Rewards Store
              </h1>
              <p className="mt-2 text-lg text-purple-100">
                Redeem your hard-earned points for rewards and premium content
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" clipRule="evenodd" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        {/* Points Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-6 sm:mb-0">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 p-0.5 shadow-lg">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <span className="text-3xl">💰</span>
                  </div>
                </div>
                <div className="ml-6">
                  <div className="text-sm font-medium text-gray-500">Your current balance</div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    {user.points} points
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Level</div>
                    <div className="text-xl font-semibold text-gray-900">{user.level}</div>
                  </div>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Earn More Points
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    category.id === activeCategory 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search rewards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  />
                  <div className="absolute left-3 top-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg shadow-sm py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200">
                    <option>Popular</option>
                    <option>Points: Low to High</option>
                    <option>Points: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRewards.map((reward) => (
            <div 
              key={reward.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-3xl shadow-inner">
                    {reward.image}
                  </div>
                  <div className="flex items-center space-x-2">
                    {reward.isNew && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        New
                      </span>
                    )}
                    {reward.isPopular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">{reward.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{reward.description}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 8v3c0 1.657 3.134 3 7 3s7-1.343 7-3V8c0 1.657-3.134 3-7 3S3 9.657 3 8z" />
                      <path d="M3 5v3c0 1.657 3.134 3 7 3s7-1.343 7-3V5c0 1.657-3.134 3-7 3S3 6.657 3 5z" />
                    </svg>
                    <span className="font-bold text-purple-700">{reward.pointsCost}</span>
                  </div>
                  <button
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-200 ${
                      user.points >= reward.pointsCost 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={user.points < reward.pointsCost}
                  >
                    {user.points >= reward.pointsCost ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        Redeem
                      </>
                    ) : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mr-4">
                  💪
                </div>
                <h2 className="text-2xl font-bold text-white">How to Earn Points</h2>
              </div>
              <p className="text-blue-100 mb-6">Complete these activities to earn more points:</p>
              <ul className="space-y-4">
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Complete quizzes</span>
                    <p className="text-blue-100 text-sm">10-50 points each depending on difficulty</p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Participate in discussions</span>
                    <p className="text-blue-100 text-sm">5-20 points for quality contributions</p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Daily login streak</span>
                    <p className="text-blue-100 text-sm">5 points × consecutive days (bonus at milestones)</p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Level up</span>
                    <p className="text-blue-100 text-sm">100 points bonus for each new level</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl mr-4">
                  ✨
                </div>
                <h2 className="text-2xl font-bold text-white">Premium Membership</h2>
              </div>
              <p className="text-purple-100 mb-6">Upgrade to get exclusive benefits:</p>
              <ul className="space-y-4">
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">2x points multiplier</span>
                    <p className="text-purple-100 text-sm">Earn points twice as fast for all activities</p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Exclusive premium rewards</span>
                    <p className="text-purple-100 text-sm">Access premium-only content and rewards</p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">AI-powered study recommendations</span>
                    <p className="text-purple-100 text-sm">Get personalized learning paths</p>
                  </div>
                </li>
                <li className="flex items-start text-white">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Monthly bonus points package</span>
                    <p className="text-purple-100 text-sm">500 points added to your account each month</p>
                  </div>
                </li>
              </ul>
              
              <button className="mt-8 w-full py-3 px-4 bg-white rounded-xl text-center font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}