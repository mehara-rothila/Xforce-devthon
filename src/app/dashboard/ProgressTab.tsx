'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProgressTab() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSubject, setActiveSubject] = useState<'physics' | 'chemistry' | 'math'>('physics');

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const subjects = [
    { 
      id: 'physics', 
      name: 'Physics', 
      color: 'blue',
      progress: 75,
      topics: [
        { name: 'Mechanics', progress: 92, mastery: 'high', testScore: 89 },
        { name: 'Waves & Oscillations', progress: 85, mastery: 'high', testScore: 82 },
        { name: 'Thermodynamics', progress: 78, mastery: 'medium', testScore: 76 },
        { name: 'Optics', progress: 65, mastery: 'medium', testScore: 68 },
        { name: 'Electromagnetism', progress: 72, mastery: 'medium', testScore: 74 },
        { name: 'Modern Physics', progress: 52, mastery: 'low', testScore: 61 },
      ]
    },
    { 
      id: 'chemistry', 
      name: 'Chemistry', 
      color: 'green',
      progress: 62,
      topics: [
        { name: 'Atomic Structure', progress: 88, mastery: 'high', testScore: 85 },
        { name: 'Periodic Table', progress: 81, mastery: 'high', testScore: 79 },
        { name: 'Chemical Bonding', progress: 72, mastery: 'medium', testScore: 75 },
        { name: 'Organic Chemistry', progress: 58, mastery: 'medium', testScore: 62 },
        { name: 'Equilibrium', progress: 45, mastery: 'low', testScore: 53 },
        { name: 'Electrochemistry', progress: 32, mastery: 'low', testScore: 44 },
      ]
    },
    { 
      id: 'math', 
      name: 'Combined Mathematics', 
      color: 'yellow',
      progress: 88,
      topics: [
        { name: 'Algebra', progress: 94, mastery: 'high', testScore: 92 },
        { name: 'Calculus', progress: 89, mastery: 'high', testScore: 87 },
        { name: 'Vectors', progress: 85, mastery: 'high', testScore: 86 },
        { name: 'Statistics', progress: 82, mastery: 'high', testScore: 84 },
        { name: 'Mechanics', progress: 75, mastery: 'medium', testScore: 78 },
        { name: 'Applied Mathematics', progress: 70, mastery: 'medium', testScore: 73 },
      ]
    },
  ];

  const currentSubject = subjects.find(s => s.id === activeSubject) || subjects[0];
  
  const getMasteryColor = (mastery: string) => {
    switch(mastery) {
      case 'high': return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSubjectColor = (color: string) => {
    switch(color) {
      case 'blue': return {
        light: 'from-blue-50 to-blue-100',
        medium: 'from-blue-100 to-blue-200',
        border: 'border-blue-200',
        text: 'text-blue-600',
        progressBar: 'from-blue-400 to-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        highlight: 'bg-blue-500/10 hover:bg-blue-500/20',
        selected: 'from-blue-600 to-blue-700 text-white',
      };
      case 'green': return {
        light: 'from-green-50 to-green-100',
        medium: 'from-green-100 to-green-200',
        border: 'border-green-200',
        text: 'text-green-600',
        progressBar: 'from-green-400 to-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        highlight: 'bg-green-500/10 hover:bg-green-500/20',
        selected: 'from-green-600 to-green-700 text-white',
      };
      case 'yellow': return {
        light: 'from-yellow-50 to-yellow-100',
        medium: 'from-yellow-100 to-yellow-200',
        border: 'border-yellow-200',
        text: 'text-yellow-600',
        progressBar: 'from-yellow-400 to-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700',
        highlight: 'bg-yellow-500/10 hover:bg-yellow-500/20',
        selected: 'from-yellow-600 to-yellow-700 text-white',
      };
      default: return {
        light: 'from-gray-50 to-gray-100',
        medium: 'from-gray-100 to-gray-200',
        border: 'border-gray-200',
        text: 'text-gray-600',
        progressBar: 'from-gray-400 to-gray-600',
        button: 'bg-gray-600 hover:bg-gray-700',
        highlight: 'bg-gray-500/10 hover:bg-gray-500/20',
        selected: 'from-gray-600 to-gray-700 text-white',
      };
    }
  };

  const colors = getSubjectColor(currentSubject.color);

  return (
    <div className={`transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} space-y-8`}>
      {/* Subject Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mr-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Detailed Progress</h2>
          </div>
          
          <div className="flex space-x-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setActiveSubject(subject.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 transform ${
                  activeSubject === subject.id 
                    ? `bg-gradient-to-r ${getSubjectColor(subject.color).selected}`
                    : `bg-white ${getSubjectColor(subject.color).text} hover:bg-${subject.color}-50`
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {/* Overall Progress */}
          <div className={`mb-6 bg-gradient-to-r ${colors.light} rounded-xl p-6 border ${colors.border}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-900">{currentSubject.name} Overall Progress</h3>
                <p className="text-gray-600 mt-1">You've mastered {currentSubject.topics.filter(t => t.mastery === 'high').length} out of {currentSubject.topics.length} topics</p>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-3 shadow-md">
                  <span className={`text-2xl font-bold ${colors.text}`}>{currentSubject.progress}%</span>
                </div>
                <Link
                  href={`/subjects/${currentSubject.id}`}
                  className={`px-4 py-2 rounded-lg text-sm text-white font-medium shadow-sm ${colors.button} transition-all duration-200 transform hover:scale-105`}
                >
                  Continue Learning
                </Link>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full relative`}
                  style={{ width: `${currentSubject.progress}%`, transition: 'width 1s ease-in-out' }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Topics Progress */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Topic-by-Topic Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSubject.topics.map((topic, index) => (
                <div 
                  key={topic.name} 
                  className={`bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-md hover:${colors.border} transform hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-gray-900">{topic.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getMasteryColor(topic.mastery)}`}>
                      {topic.mastery === 'high' ? 'High Mastery' : topic.mastery === 'medium' ? 'Medium Mastery' : 'Needs Work'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-700 font-medium">{topic.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors.progressBar} rounded-full relative`}
                        style={{ width: `${topic.progress}%`, transition: 'width 1s ease-in-out' }}
                      >
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${colors.text} mr-1`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">Test Score: <span className="font-medium">{topic.testScore}%</span></span>
                    </div>
                    <Link 
                      href={`/subjects/${currentSubject.id}/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`text-sm ${colors.text} hover:underline font-medium flex items-center`}
                    >
                      Practice
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Learning Analytics */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Time Spent Analytics */}
              <div className={`bg-gradient-to-r ${colors.medium} rounded-xl p-5 border ${colors.border}`}>
                <div className="flex justify-between mb-3">
                  <h4 className="text-base font-bold text-gray-900">Time Spent</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white ${colors.text}`}>
                    Last 30 Days
                  </span>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">42.5 hrs</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    15% more than last month
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-4">
                  {Array(7).fill(0).map((_, i) => {
                    const height = Math.floor(Math.random() * 70) + 30;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-full bg-white/40 rounded-sm" style={{ height: `${height}%`, minHeight: '30px' }}></div>
                        <div className="text-xs text-gray-600 mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Accuracy Analytics */}
              <div className={`bg-gradient-to-r ${colors.medium} rounded-xl p-5 border ${colors.border}`}>
                <div className="flex justify-between mb-3">
                  <h4 className="text-base font-bold text-gray-900">Quiz Accuracy</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white ${colors.text}`}>
                    Last 10 Quizzes
                  </span>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">78.2%</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    5.3% improvement
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {Array(5).fill(0).map((_, i) => {
                    const value = Math.floor(Math.random() * 20) + 70;
                    return (
                      <div key={i} className="flex items-center justify-center">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="3"
                              strokeDasharray="100, 100"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeDasharray={`${value}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">{value}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Weak Areas */}
              <div className={`bg-gradient-to-r ${colors.medium} rounded-xl p-5 border ${colors.border}`}>
                <div className="flex justify-between mb-3">
                  <h4 className="text-base font-bold text-gray-900">Areas to Improve</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white ${colors.text}`}>
                    Priority
                  </span>
                </div>
                <ul className="space-y-3 mt-2">
                  {currentSubject.topics.filter(t => t.mastery === 'low').map((topic) => (
                    <li key={topic.name} className="bg-white/60 rounded-lg p-3 flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-red-500 mr-2`}></div>
                      <div className="flex-1 text-sm font-medium text-gray-800">{topic.name}</div>
                      <Link 
                        href={`/subjects/${currentSubject.id}/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`text-sm ${colors.text} hover:underline font-medium flex items-center`}
                      >
                        Focus
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                  {currentSubject.topics.filter(t => t.mastery === 'medium').slice(0, 2).map((topic) => (
                    <li key={topic.name} className="bg-white/60 rounded-lg p-3 flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-yellow-500 mr-2`}></div>
                      <div className="flex-1 text-sm font-medium text-gray-800">{topic.name}</div>
                      <Link 
                        href={`/subjects/${currentSubject.id}/${topic.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`text-sm ${colors.text} hover:underline font-medium flex items-center`}
                      >
                        Practice
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-white/30">
                  <Link 
                    href="/study-plan"
                    className={`w-full ${colors.button} text-white rounded-lg py-2.5 text-sm font-medium inline-block text-center transition-colors duration-200`}
                  >
                    Get Personalized Study Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Comparison */}
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Your Performance Compared to Peers</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full lg:w-1/3 px-2 mb-4 lg:mb-0">
                  <div className={`h-full rounded-xl border ${colors.border} p-4`}>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Overall Standing</h4>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-800">
                            Top 15%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-green-600">
                            Excellent
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-gray-200">
                        <div style={{ width: "85%" }} className="shadow-none flex flex-col justify-center text-center whitespace-nowrap text-white bg-green-500"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      You're performing better than 85% of students in {currentSubject.name}.
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/3 px-2 mb-4 lg:mb-0">
                  <div className={`h-full rounded-xl border ${colors.border} p-4`}>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Quiz Completion Rate</h4>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-100 text-blue-800">
                            78%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            Above Average
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-gray-200">
                        <div style={{ width: "78%" }} className="shadow-none flex flex-col justify-center text-center whitespace-nowrap text-white bg-blue-500"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      You complete 78% of assigned quizzes, compared to the average of 65%.
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/3 px-2">
                  <div className={`h-full rounded-xl border ${colors.border} p-4`}>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Consistency Score</h4>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-100 text-purple-800">
                            92%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-purple-600">
                            Excellent
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-gray-200">
                        <div style={{ width: "92%" }} className="shadow-none flex flex-col justify-center text-center whitespace-nowrap text-white bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Your study consistency is higher than 92% of students. Keep it up!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        {/* Suggested Learning Path */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md overflow-hidden border border-purple-100">
            <div className="px-6 py-5 border-b border-purple-100">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">AI-Generated Learning Path</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-full max-w-3xl mx-auto">
                  <div className="relative">
                    <div className="overflow-hidden h-2 flex rounded-full bg-gray-200 mb-4">
                      <div style={{ width: "42%" }} className="shadow-none flex flex-col justify-center text-center whitespace-nowrap text-white bg-purple-500 relative">
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full px-2">
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mb-1 mx-auto">1</div>
                        <div className="text-xs text-gray-500">Basics</div>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mb-1 mx-auto">2</div>
                        <div className="text-xs text-gray-500">Intermediate</div>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-purple-300 text-white text-xs flex items-center justify-center mb-1 mx-auto">3</div>
                        <div className="text-xs text-gray-500">Advanced</div>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center mb-1 mx-auto">4</div>
                        <div className="text-xs text-gray-500">Expert</div>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center mb-1 mx-auto">5</div>
                        <div className="text-xs text-gray-500">Mastery</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h4 className="text-base font-bold text-gray-900 mb-3">Your Next Steps in {currentSubject.name}</h4>
                
                <ul className="space-y-3">
                  {/* Next immediate step */}
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mt-0.5 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Focus on Modern Physics</div>
                      <p className="text-sm text-gray-600 mt-1">Complete chapters 1-3 in the Modern Physics section to improve your mastery.</p>
                    </div>
                  </li>
                  
                  {/* Second step */}
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mt-0.5 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Improve Optics Performance</div>
                      <p className="text-sm text-gray-600 mt-1">Take the Optics quiz series to strengthen your understanding of refraction and lenses.</p>
                    </div>
                  </li>
                  
                  {/* Third step */}
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mt-0.5 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Review Past Exam Papers</div>
                      <p className="text-sm text-gray-600 mt-1">Practice with 2022-2023 past papers to build exam readiness and confidence.</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 text-center">
                  <Link
                    href={`/study-plan/${currentSubject.id}`}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate Complete Study Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}