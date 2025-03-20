import React from 'react';
import Link from 'next/link';

export default function PhysicsPage() {
  // Mock user progress data
  const userProgress = {
    overallProgress: 68,
    topics: [
      { id: 'mechanics', name: 'Mechanics', progress: 85, mastery: 'High' },
      { id: 'waves', name: 'Waves & Oscillations', progress: 72, mastery: 'Medium' },
      { id: 'thermodynamics', name: 'Thermodynamics', progress: 64, mastery: 'Medium' },
      { id: 'electricity', name: 'Electricity & Magnetism', progress: 78, mastery: 'Medium' },
      { id: 'optics', name: 'Optics', progress: 55, mastery: 'Low' },
      { id: 'modern', name: 'Modern Physics', progress: 42, mastery: 'Low' },
    ]
  };

  // Mock recommended resources
  const recommendedResources = [
    {
      id: 1,
      title: "Understanding Waves & Oscillations",
      type: "Practice Quiz",
      difficulty: "Medium",
      estimatedTime: "25 min",
      description: "Test your knowledge of wave phenomena, including interference and diffraction."
    },
    {
      id: 2,
      title: "Mastering Optics Principles",
      type: "Study Notes",
      difficulty: "Advanced",
      estimatedTime: "45 min",
      description: "Comprehensive notes on geometric and wave optics with practice problems."
    },
    {
      id: 3,
      title: "Modern Physics Fundamentals",
      type: "Video Lesson",
      difficulty: "Beginner",
      estimatedTime: "30 min",
      description: "Introduction to quantum mechanics and relativity concepts."
    }
  ];

  // Mock study materials
  const studyMaterials = [
    {
      id: 1,
      title: "Mechanics - Forces and Motion",
      type: "Notes",
      downloadCount: 1245,
      fileSize: "2.4 MB",
      lastUpdated: "2 weeks ago",
      isPremium: false
    },
    {
      id: 2,
      title: "Waves & Oscillations - Complete Guide",
      type: "PDF",
      downloadCount: 987,
      fileSize: "3.7 MB",
      lastUpdated: "1 month ago",
      isPremium: false
    },
    {
      id: 3,
      title: "Thermodynamics Formula Sheet",
      type: "PDF",
      downloadCount: 2156,
      fileSize: "1.2 MB",
      lastUpdated: "3 weeks ago",
      isPremium: false
    },
    {
      id: 4,
      title: "Electricity & Magnetism - Master Class",
      type: "Video",
      downloadCount: 756,
      fileSize: "145 MB",
      lastUpdated: "2 months ago",
      isPremium: true
    },
    {
      id: 5,
      title: "Optics Diagrams and Problems",
      type: "Interactive",
      downloadCount: 645,
      fileSize: "5.1 MB",
      lastUpdated: "1 week ago",
      isPremium: false
    },
    {
      id: 6,
      title: "Modern Physics - Quantum Mechanics",
      type: "Notes",
      downloadCount: 892,
      fileSize: "4.3 MB",
      lastUpdated: "3 weeks ago",
      isPremium: true
    }
  ];

  // Mock practice quizzes
  const practiceQuizzes = [
    {
      id: 1,
      title: "Newton's Laws of Motion",
      questions: 15,
      difficulty: "Medium",
      timeEstimate: "20 min",
      averageScore: 78,
      attempts: 1567
    },
    {
      id: 2,
      title: "Wave Properties and Phenomena",
      questions: 12,
      difficulty: "Medium",
      timeEstimate: "15 min",
      averageScore: 72,
      attempts: 1245
    },
    {
      id: 3,
      title: "Thermodynamics Laws",
      questions: 18,
      difficulty: "Hard",
      timeEstimate: "25 min",
      averageScore: 65,
      attempts: 976
    },
    {
      id: 4,
      title: "Electric Circuits",
      questions: 20,
      difficulty: "Medium",
      timeEstimate: "30 min",
      averageScore: 70,
      attempts: 1089
    },
    {
      id: 5,
      title: "Lens and Mirrors",
      questions: 15,
      difficulty: "Easy",
      timeEstimate: "15 min",
      averageScore: 82,
      attempts: 1342
    },
    {
      id: 6,
      title: "Quantum Physics Introduction",
      questions: 10,
      difficulty: "Hard",
      timeEstimate: "20 min",
      averageScore: 61,
      attempts: 856
    }
  ];

  // Difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'beginner':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Mastery level badge color
  const getMasteryColor = (mastery: string) => {
    switch (mastery.toLowerCase()) {
      case 'high':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'low':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  // Resource type icon
  const getResourceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'notes':
        return '📝';
      case 'pdf':
        return '📄';
      case 'video':
        return '🎬';
      case 'interactive':
        return '🔄';
      case 'practice quiz':
        return '❓';
      case 'study notes':
        return '📚';
      case 'video lesson':
        return '📹';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16">
      {/* Subject Header with decorative elements */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-14 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/5 text-white text-5xl transform -rotate-12">E = mc²</div>
          <div className="absolute bottom-1/3 right-1/4 text-white text-4xl transform rotate-6">F = ma</div>
          <div className="absolute top-2/3 left-1/3 text-white text-4xl transform rotate-12">∇ × B = μ₀J</div>
          <div className="absolute top-1/2 right-1/6 text-white text-3xl transform -rotate-6">∫ E · dA = q/ε₀</div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex rounded-full bg-blue-700 px-3 py-1 text-xs font-medium text-blue-100 mb-3">
                Advanced Level
              </div>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight drop-shadow-sm">
                Physics
              </h1>
              <p className="mt-3 text-xl text-blue-100 max-w-2xl">
                Master mechanics, waves, thermodynamics, and more through interactive learning
              </p>
            </div>
            <Link
              href="/subjects"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              All Subjects
            </Link>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="mt-10 bg-blue-600 bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 shadow-lg">
            <div className="flex justify-between text-sm text-white mb-2 px-2">
              <span className="font-semibold">Your Overall Progress</span>
              <span className="font-bold">{userProgress.overallProgress}%</span>
            </div>
            <div className="h-3 bg-blue-900 bg-opacity-30 rounded-full">
              <div 
                className="h-3 bg-gradient-to-r from-blue-200 to-white rounded-full relative overflow-hidden"
                style={{ width: `${userProgress.overallProgress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 space-y-8">
        {/* Topic Progress */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Topic Progress
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userProgress.topics.map(topic => (
                <div key={topic.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">{topic.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getMasteryColor(topic.mastery)}`}>
                      {topic.mastery} Mastery
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full mb-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full relative ${
                        topic.mastery === 'High' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        topic.mastery === 'Medium' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ width: `${topic.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{topic.progress}% Complete</span>
                    <Link
                      href={`/quiz?topic=${topic.id}&subject=physics`}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
                    >
                      Practice
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Recommended for You
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {recommendedResources.map(resource => (
                <div key={resource.id} className="relative bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden group">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full opacity-30 -mr-10 -mt-10 group-hover:bg-blue-200 transition-colors duration-300"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                      {getResourceTypeIcon(resource.type)}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-gray-900">{resource.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 flex-grow">{resource.description}</p>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">{resource.type} • {resource.estimatedTime}</span>
                    <a href="#" className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-150 shadow-sm">
                      Start
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Study Materials
              </h2>
              <Link
                href="/resources?subject=physics"
                className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
              >
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studyMaterials.map(material => (
                    <tr key={material.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{getResourceTypeIcon(material.type)}</div>
                          <div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{material.title}</div>
                              {material.isPremium && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{material.downloadCount.toLocaleString()} downloads</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {material.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.fileSize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {material.isPremium ? (
                          <span className="px-4 py-1.5 rounded-md text-xs font-medium text-purple-800 bg-purple-100 cursor-pointer hover:bg-purple-200 transition-colors duration-150">
                            Get Premium
                          </span>
                        ) : (
                          <a href="#" className="px-4 py-1.5 rounded-md text-xs font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 transition-colors duration-150">
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        {/* Practice Quizzes */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Practice Quizzes
              </h2>
              <Link
                href="/quiz?subject=physics"
                className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
              >
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {practiceQuizzes.map(quiz => (
                <div key={quiz.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <h3 className="font-bold text-lg text-gray-900">{quiz.title}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.questions}
                      </div>
                      <div className="flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.timeEstimate}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Average Score</span>
                      <span className={`font-bold ${
                        quiz.averageScore > 75 ? 'text-green-600' : 
                        quiz.averageScore > 60 ? 'text-yellow-600' : 
                        'text-red-600'}`}
                      >
                        {quiz.averageScore}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${
                          quiz.averageScore > 75 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                          quiz.averageScore > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                          'bg-gradient-to-r from-red-400 to-red-500'
                        }`} 
                        style={{ width: `${quiz.averageScore}%` }}
                      >
                        <div className="absolute inset-0 bg-white opacity-20"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end text-sm text-gray-500">
                    <span>{quiz.attempts.toLocaleString()} attempts</span>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/quiz/take?id=${quiz.id}&subject=physics`}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Start Quiz
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Forum Discussions */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Recent Discussions
              </h2>
              <Link
                href="/forum?category=physics"
                className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
              >
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <h3 className="font-bold text-lg text-gray-900">Understanding Angular Momentum Conservation</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  I'm having trouble understanding how to apply conservation of angular momentum in problems with variable moments of inertia...
                </p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    12 replies
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    2 days ago
                  </div>
                  <Link href="/forum/topic/123" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View Discussion
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <h3 className="font-bold text-lg text-gray-900">Doppler Effect Calculation Help</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  Can someone explain the difference between the formulas used when the source is moving vs when the observer is moving?
                </p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    8 replies
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    3 days ago
                  </div>
                  <Link href="/forum/topic/124" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View Discussion
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <h3 className="font-bold text-lg text-gray-900">Electric Field vs Electric Potential</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  I'm confused about the relationship between electric field and electric potential. How do you derive one from the other?
                </p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    15 replies
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    1 week ago
                  </div>
                  <Link href="/forum/topic/125" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View Discussion
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/forum/new?category=physics"
                className="inline-flex items-center px-6 py-3 border border-blue-300 rounded-lg shadow-sm text-base font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}