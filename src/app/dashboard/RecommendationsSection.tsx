'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type RecommendationType = 'quiz' | 'resource' | 'topic' | 'study_plan';

interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  subject: 'physics' | 'chemistry' | 'math';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  reason: string;
  link: string;
  iconClass: string;
}

export default function RecommendationsSection() {
  // This would normally come from an API, but for now we'll use mock data
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<RecommendationType>('quiz');
  
  // Simulate API fetch with mock data
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setRecommendations([
        {
          id: '1',
          type: 'quiz',
          title: 'Optics Principles Quiz',
          description: 'Test your understanding of reflection, refraction, and optical instruments',
          subject: 'physics',
          difficulty: 'medium',
          estimatedTime: '20 min',
          reason: 'Based on your weak areas in the last Physics assessment',
          link: '/quiz/optics',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: '2',
          type: 'quiz',
          title: 'Equilibrium Reactions Quiz',
          description: 'Practice problems on chemical equilibrium and Le Chatelier\'s principle',
          subject: 'chemistry',
          difficulty: 'hard',
          estimatedTime: '25 min',
          reason: 'Your Chemistry progress is lower than other subjects',
          link: '/quiz/chemical-equilibrium',
          iconClass: 'bg-green-100 text-green-600'
        },
        {
          id: '3',
          type: 'resource',
          title: 'Modern Physics Guide',
          description: 'Comprehensive notes on quantum physics and special relativity',
          subject: 'physics',
          difficulty: 'medium',
          estimatedTime: '45 min',
          reason: 'Complements your recent activity in wave mechanics',
          link: '/resources/modern-physics-guide',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: '4',
          type: 'resource',
          title: 'Organic Chemistry Visualization',
          description: 'Interactive 3D models of organic compounds and reactions',
          subject: 'chemistry',
          difficulty: 'medium',
          estimatedTime: '30 min',
          reason: 'Will help with your recent forum question on naming isomers',
          link: '/resources/organic-chem-viz',
          iconClass: 'bg-green-100 text-green-600'
        },
        {
          id: '5',
          type: 'topic',
          title: 'Circular Motion Deep Dive',
          description: 'In-depth study guide for mastering circular motion concepts',
          subject: 'physics',
          difficulty: 'hard',
          estimatedTime: '60 min',
          reason: 'This topic appeared in your recent quiz feedback',
          link: '/subjects/physics/circular-motion',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: '6',
          type: 'study_plan',
          title: 'Chemistry Catch-up Plan',
          description: 'Structured 2-week plan to improve your chemistry fundamentals',
          subject: 'chemistry',
          difficulty: 'medium',
          estimatedTime: '14 days',
          reason: 'Personalized to address your progress gap in Chemistry',
          link: '/study-plans/chemistry-fundamentals',
          iconClass: 'bg-green-100 text-green-600'
        },
      ]);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredRecommendations = recommendations.filter(rec => 
    activeTab === 'quiz' ? rec.type === 'quiz' : 
    activeTab === 'resource' ? rec.type === 'resource' : 
    activeTab === 'topic' ? rec.type === 'topic' : 
    activeTab === 'study_plan' ? rec.type === 'study_plan' : true
  );

  const getSubjectStyles = (subject: string) => {
    switch(subject) {
      case 'physics': 
        return {
          badge: 'bg-blue-600 text-white',
          button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
          iconBg: 'bg-blue-100 text-blue-600'
        };
      case 'chemistry': 
        return {
          badge: 'bg-green-600 text-white',
          button: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white',
          iconBg: 'bg-green-100 text-green-600'
        };
      case 'math': 
        return {
          badge: 'bg-yellow-600 text-white',
          button: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white',
          iconBg: 'bg-yellow-100 text-yellow-600'
        };
      default: 
        return {
          badge: 'bg-purple-600 text-white',
          button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white',
          iconBg: 'bg-purple-100 text-purple-600'
        };
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200';
      case 'hard': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
              <div className="ml-2 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full">
                BETA
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Personalized recommendations based on your learning patterns and progress
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs with enhanced styling */}
      <div className="px-6 pt-4 border-b border-gray-100">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'quiz'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Practice Quizzes
          </button>
          <button
            onClick={() => setActiveTab('resource')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'resource'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Study Resources
          </button>
          <button
            onClick={() => setActiveTab('topic')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'topic'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Focus Topics
          </button>
          <button
            onClick={() => setActiveTab('study_plan')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'study_plan'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Study Plans
          </button>
        </div>
      </div>

      {/* Recommendations Content with enhanced styling */}
      <div className="p-6">
        {isLoading ? (
          // Loading state with enhanced animation
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full border-t-2 border-r-2 border-purple-600 animate-spin mb-4"></div>
            <p className="mt-4 text-sm text-gray-600 animate-pulse">Analyzing your learning patterns...</p>
          </div>
        ) : filteredRecommendations.length === 0 ? (
          // Empty state with enhanced visual design
          <div className="flex flex-col items-center justify-center py-12 text-center bg-purple-50 rounded-xl border border-purple-100">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-purple-400 mb-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Complete more activities and quizzes so our AI can learn your strengths and areas for improvement.
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200 shadow-sm">
              Start a Practice Quiz
            </button>
          </div>
        ) : (
          // Recommendations grid with enhanced card designs
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRecommendations.map(recommendation => {
              const subjectStyles = getSubjectStyles(recommendation.subject);
              
              return (
                <div key={recommendation.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-200 transform hover:-translate-y-1">
                  <div className={`absolute top-0 right-0 ${subjectStyles.badge} text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm`}>
                    {recommendation.subject.charAt(0).toUpperCase() + recommendation.subject.slice(1)}
                  </div>
                  <div className="p-6 pt-8">
                    <div className="flex items-start mb-4">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${subjectStyles.iconBg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200`}>
                        {recommendation.type === 'quiz' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        )}
                        {recommendation.type === 'resource' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        )}
                        {recommendation.type === 'topic' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                        {recommendation.type === 'study_plan' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">{recommendation.title}</h3>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {recommendation.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {recommendation.description}
                    </p>
                    
                    <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 text-sm text-purple-800 border border-purple-100/60 shadow-sm">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span>{recommendation.reason}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-end">
                      <Link
                        href={recommendation.link}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 ${subjectStyles.button}`}
                      >
                        {recommendation.type === 'quiz' ? 'Start Quiz' : 
                         recommendation.type === 'resource' ? 'View Resource' :
                         recommendation.type === 'topic' ? 'Study Topic' : 'View Plan'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}