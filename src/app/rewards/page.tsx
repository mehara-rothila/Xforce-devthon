import React from 'react';
import Link from 'next/link';

export default function RewardsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Rewards Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 pt-12 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Rewards Store
            </h1>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="mt-2 text-xl text-purple-100">
            Redeem your hard-earned points for rewards and premium content
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Your current balance</div>
              <div className="text-3xl font-bold text-purple-600">{user.points} points</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Level</div>
                <div className="text-xl font-semibold">{user.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category.id === 'all' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search rewards..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                  <div className="absolute left-3 top-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 rounded-lg bg-purple-100 flex items-center justify-center text-3xl">
                    {reward.image}
                  </div>
                  <div className="flex items-center space-x-2">
                    {reward.isNew && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                    {reward.isPopular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <h2 className="mt-4 text-lg font-bold text-gray-900">{reward.name}</h2>
                <p className="mt-2 text-sm text-gray-600">{reward.description}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="font-bold text-purple-600">{reward.pointsCost} points</div>
                  <button
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                      user.points >= reward.pointsCost 
                        ? 'text-white bg-purple-600 hover:bg-purple-700' 
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    }`}
                    disabled={user.points < reward.pointsCost}
                  >
                    {user.points >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">How to Earn Points</h2>
              <p className="text-blue-100 mb-4">Complete these activities to earn more points:</p>
              <ul className="space-y-2">
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Complete quizzes (10-50 points each)</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Participate in discussions (5-20 points)</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Daily login streak (5 points × days)</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Level up (100 points bonus)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Premium Membership</h2>
              <p className="text-purple-100 mb-4">Get more with a premium membership:</p>
              <ul className="space-y-2">
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-purple-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>2x points for all activities</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-purple-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Exclusive premium rewards</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-purple-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>AI-powered study recommendations</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="h-5 w-5 text-purple-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Monthly bonus points package</span>
                </li>
              </ul>
              
              <button className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}