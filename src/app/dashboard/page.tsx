'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RecommendationsSection from './RecommendationsSection';
import ProgressTab from './ProgressTab';
import AchievementsTab from './AchievementsTab';

export default function Dashboard() {
  // State for animated elements
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Render the active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'progress':
        return <ProgressTab />;
      case 'achievements':
        return <AchievementsTab />;
      case 'overview':
      default:
        return (
          <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>
            {/* Welcome Banner with enhanced styling */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden relative transform transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
              <div className="absolute bottom-0 left-0 mb-5 ml-5 w-20 h-20 bg-white rounded-full opacity-10"></div>
              
              <div className="px-8 py-8 sm:py-10 relative z-10 flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-6 sm:mb-0 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Ready to improve your A/L scores?</h2>
                  <p className="text-indigo-100 text-lg">Your personalized learning journey is waiting for you!</p>
                </div>
                <button className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-medium shadow-lg hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                  Start Learning
                </button>
              </div>
            </div>
            
            {/* Subject Cards with enhanced styling and animations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Physics Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-blue-200 group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 mr-4 shadow-sm group-hover:shadow-md transition-all duration-200 relative">
                        <div className="absolute inset-0 rounded-xl bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Physics</h3>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm">
                      75%
                    </span>
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-500 font-medium">Progress</span>
                      <span className="text-gray-700 font-semibold">24/32 topics</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full relative" style={{ width: '75%', transition: 'width 1s ease-in-out' }}>
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center text-sm font-medium text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Strong
                    </span>
                    <Link href="/subjects/physics" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center group-hover:translate-x-1 transform transition-transform duration-200">
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Chemistry Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-green-200 group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 mr-4 shadow-sm group-hover:shadow-md transition-all duration-200 relative">
                        <div className="absolute inset-0 rounded-xl bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-200">Chemistry</h3>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm">
                      62%
                    </span>
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-500 font-medium">Progress</span>
                      <span className="text-gray-700 font-semibold">18/29 topics</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full relative" style={{ width: '62%', transition: 'width 1s ease-in-out' }}>
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center text-sm font-medium text-gray-600 bg-green-50 px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Moderate
                    </span>
                    <Link href="/subjects/chemistry" className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center group-hover:translate-x-1 transform transition-transform duration-200">
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Math Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-yellow-200 group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 mr-4 shadow-sm group-hover:shadow-md transition-all duration-200 relative">
                        <div className="absolute inset-0 rounded-xl bg-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors duration-200">Combined Math</h3>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-sm">
                      88%
                    </span>
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-500 font-medium">Progress</span>
                      <span className="text-gray-700 font-semibold">28/32 topics</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full relative" style={{ width: '88%', transition: 'width 1s ease-in-out' }}>
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center text-sm font-medium text-gray-600 bg-yellow-50 px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Excellent
                    </span>
                    <Link href="/subjects/math" className="text-sm text-yellow-600 hover:text-yellow-800 font-medium flex items-center group-hover:translate-x-1 transform transition-transform duration-200">
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <RecommendationsSection />

            {/* Recent Activity with enhanced timeline design */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                <Link href="#" className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors duration-150">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="divide-y divide-gray-100">
                {/* Activity Item 1 */}
                <div className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                  <div className="relative pl-10">
                    <span className="absolute left-0 top-1 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {/* Activity timeline line */}
                    <div className="absolute left-4 top-9 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Completed Mechanics Quiz</h3>
                        <p className="mt-1 text-sm text-gray-600">Score: 85% - Great job! 🎉</p>
                      </div>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">2 hours ago</span>
                    </div>
                    
                    <div className="mt-3 flex">
                      <div className="flex-1 bg-green-50 rounded-lg p-3 text-sm border border-green-100">
                        <span className="font-medium text-gray-800">Feedback:</span> You did well on force and motion problems, but may need more practice with circular motion concepts.
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center hover:underline focus:outline-none">
                        Review Quiz
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Activity Item 2 */}
                <div className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                  <div className="relative pl-10">
                    <span className="absolute left-0 top-1 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </span>
                    {/* Activity timeline line */}
                    <div className="absolute left-4 top-9 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Posted a question in Chemistry Forum</h3>
                        <p className="mt-1 text-sm text-gray-600">Topic: "Naming isomers in organic chemistry"</p>
                      </div>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Yesterday</span>
                    </div>
                    
                    <div className="mt-3 flex">
                      <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <span className="mr-1 font-bold">3</span> responses
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center hover:underline focus:outline-none">
                        View Discussion
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Activity Item 3 */}
                <div className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                  <div className="relative pl-10">
                    <span className="absolute left-0 top-1 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </span>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Downloaded 2023 Model Papers</h3>
                        <p className="mt-1 text-sm text-gray-600">Combined Mathematics model paper set</p>
                      </div>
                      <span className="mt-1 sm:mt-0 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">2 days ago</span>
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center hover:underline focus:outline-none">
                        View Resource
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Study Streak Calendar with enhanced styling */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Study Streak</h2>
                    <p className="text-sm text-gray-600 mt-0.5">You're on a 5-day streak! Keep it up to earn bonus points.</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                  <div className="text-xs font-medium text-gray-500">Mon</div>
                  <div className="text-xs font-medium text-gray-500">Tue</div>
                  <div className="text-xs font-medium text-gray-500">Wed</div>
                  <div className="text-xs font-medium text-gray-500">Thu</div>
                  <div className="text-xs font-medium text-gray-500">Fri</div>
                  <div className="text-xs font-medium text-gray-500">Sat</div>
                  <div className="text-xs font-medium text-gray-500">Sun</div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Previous Month */}
                  <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">28</div>
                  <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">29</div>
                  <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">30</div>
                  
                  {/* Current Month */}
                  <div className="h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xs shadow-sm">1</div>
                  <div className="h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xs shadow-sm">2</div>
                  <div className="h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xs shadow-sm">3</div>
                  <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-700">4</div>
                  <div className="h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xs shadow-sm">5</div>
                  <div className="h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold border-2 border-purple-400 shadow-lg relative">
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    <span className="relative z-10">6</span>
                  </div>
                  <div className="h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">7</div>
                  <div className="h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">8</div>
                  <div className="h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">9</div>
                  <div className="h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">10</div>
                  <div className="h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">11</div>
                  {/* Remaining empty days */}
                  {Array(7).fill(0).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">{12 + i}</div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Keep your streak going to earn 100 bonus points tomorrow!
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Dashboard Header with enhanced gradient background and particle effect */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-purple-600 text-white overflow-hidden">
        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-4 w-4 rounded-full bg-white opacity-20 top-[20%] left-[10%] animate-float" style={{ animationDuration: '7s' }}></div>
          <div className="absolute h-6 w-6 rounded-full bg-white opacity-10 top-[30%] right-[15%] animate-float" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
          <div className="absolute h-3 w-3 rounded-full bg-white opacity-20 bottom-[20%] left-[20%] animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
          <div className="absolute h-8 w-8 rounded-full bg-white opacity-10 top-[70%] right-[25%] animate-float" style={{ animationDuration: '8s', animationDelay: '1.5s' }}></div>
          <div className="absolute h-16 w-16 rounded-full bg-purple-500 opacity-20 bottom-[10%] right-[10%] blur-xl animate-pulse-slow"></div>
          <div className="absolute h-24 w-24 rounded-full bg-purple-400 opacity-10 top-[5%] left-[5%] blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Student Dashboard</h1>
                <p className="mt-1 text-purple-200">Welcome back, <span className="font-medium text-white">Student</span></p>
              </div>
              <div className="flex space-x-3">
                <Link href="/resources" className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-medium transition-all duration-200 flex items-center shadow-lg shadow-purple-900/20 hover:transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Resources
                </Link>
                <Link href="/quiz" className="px-4 py-2.5 rounded-lg bg-white text-purple-700 hover:bg-gray-100 font-medium transition-all duration-200 flex items-center shadow-lg shadow-purple-900/20 hover:transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Start Quiz
                </Link>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="mt-8 border-b border-white/20">
              <nav className="flex space-x-8">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'overview' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-purple-200 hover:text-white hover:border-white/50'
                  } transition-all duration-200`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('progress')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'progress' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-purple-200 hover:text-white hover:border-white/50'
                  } transition-all duration-200`}
                >
                  Progress
                </button>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'achievements' 
                      ? 'border-white text-white' 
                      : 'border-transparent text-purple-200 hover:text-white hover:border-white/50'
                  } transition-all duration-200`}
                >
                  Achievements
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with enhanced styling and animations */}
          <div className="lg:col-span-3">
            <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8 border border-gray-100">
                {/* Profile Section */}
                <div className="px-6 py-6 border-b border-gray-100 text-center relative bg-gradient-to-b from-white to-gray-50">
                  <div className="absolute top-0 right-0 p-2">
                    <Link href="/profile" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="inline-block relative mb-4">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse-slow" style={{ animationDuration: '3s' }}></div>
                      <span className="relative z-10">S</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-white animate-pulse" style={{ animationDuration: '2s' }}></div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900">Student Name</h2>
                  <p className="text-sm text-gray-500">Physics, Chemistry, Combined Math</p>
                  
                  <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100">
                    <div className="px-2 text-center group">
                      <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300">75%</div>
                      <div className="text-xs text-gray-500">Physics</div>
                    </div>
                    <div className="px-2 text-center group">
                      <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 group-hover:from-green-500 group-hover:to-green-300 transition-all duration-300">62%</div>
                      <div className="text-xs text-gray-500">Chemistry</div>
                    </div>
                    <div className="px-2 text-center group">
                      <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400 group-hover:from-yellow-500 group-hover:to-yellow-300 transition-all duration-300">88%</div>
                      <div className="text-xs text-gray-500">Math</div>
                    </div>
                  </div>
                </div>
                
                {/* Points & Rewards with enhanced styling */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Points & Level</h3>
                    <Link href="/rewards" className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors duration-150">View Rewards</Link>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">Level 15</span>
                        <span className="text-sm text-gray-500">2,450 / 3,000</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full relative" style={{ width: '82%' }}>
                          <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">550 points</span> until next level
                    </div>
                  </div>
                </div>
                
                {/* Leaderboard Position with enhanced styling */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Leaderboard</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 shadow-sm border border-purple-100/50 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md relative overflow-hidden group-hover:shadow-lg transition-all duration-200">
                        <div className="absolute inset-0 bg-white opacity-20 animate-pulse-slow"></div>
                        <span className="relative z-10">15</span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">National Rank</div>
                        <div className="text-sm text-gray-500">Top 5% of all students</div>
                      </div>
                      <div className="ml-auto">
                        <Link href="/leaderboard" className="text-purple-600 hover:text-purple-800 transition-colors duration-150 group-hover:scale-110 inline-block transform transition-transform duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Links with enhanced styling */}
                <div className="px-6 py-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/profile" className="flex items-center text-gray-700 hover:text-purple-700 transition-colors duration-150 p-2 rounded-lg hover:bg-purple-50 group">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="ml-3">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/rewards" className="flex items-center text-gray-700 hover:text-purple-700 transition-colors duration-150 p-2 rounded-lg hover:bg-purple-50 group">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="ml-3">Rewards Store</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/forum" className="flex items-center text-gray-700 hover:text-purple-700 transition-colors duration-150 p-2 rounded-lg hover:bg-purple-50 group">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className="ml-3">Discussion Forum</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="flex items-center text-gray-700 hover:text-purple-700 transition-colors duration-150 p-2 rounded-lg hover:bg-purple-50 group">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="ml-3">Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/help" className="flex items-center text-gray-700 hover:text-purple-700 transition-colors duration-150 p-2 rounded-lg hover:bg-purple-50 group">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="ml-3">Help Center</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}