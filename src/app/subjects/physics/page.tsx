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
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mastery level badge color
  const getMasteryColor = (mastery: string) => {
    switch (mastery.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Subject Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 pt-12 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Physics
            </h1>
            <Link
              href="/subjects"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              All Subjects
            </Link>
          </div>
          <p className="mt-2 text-xl text-blue-100">
            Master mechanics, waves, thermodynamics, and more
          </p>
          
          {/* Overall Progress Bar */}
          <div className="mt-8 bg-blue-600 bg-opacity-50 rounded-full p-1.5">
            <div className="flex justify-between text-sm text-white mb-1 px-2">
              <span className="font-semibold">Your Progress</span>
              <span>{userProgress.overallProgress}%</span>
            </div>
            <div className="h-2.5 bg-blue-900 bg-opacity-40 rounded-full">
              <div 
                className="h-2.5 bg-white rounded-full" 
                style={{ width: `${userProgress.overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 space-y-6">
        {/* Topic Progress */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Topic Progress</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userProgress.topics.map(topic => (
                <div key={topic.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMasteryColor(topic.mastery)}`}>
                      {topic.mastery} Mastery
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${topic.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{topic.progress}% Complete</span>
                    <Link
                      href={`/quiz?topic=${topic.id}&subject=physics`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Recommendations */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {recommendedResources.map(resource => (
                <div key={resource.id} className="border rounded-lg p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                      {getResourceTypeIcon(resource.type)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{resource.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 flex-grow">{resource.description}</p>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-gray-500">{resource.type} • {resource.estimatedTime}</span>
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      Start
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Study Materials</h2>
              <Link
                href="/resources?subject=physics"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="overflow-hidden border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studyMaterials.map(material => (
                      <tr key={material.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-xl mr-3">{getResourceTypeIcon(material.type)}</div>
                            <div>
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{material.title}</div>
                                {material.isPremium && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Premium
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{material.downloadCount} downloads</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.fileSize}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {material.isPremium ? (
                            <span className="text-purple-600 hover:text-purple-900">Premium</span>
                          ) : (
                            <a href="#" className="text-blue-600 hover:text-blue-900">Download</a>
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Practice Quizzes</h2>
                <Link
                  href="/quiz?subject=physics"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {practiceQuizzes.map(quiz => (
                  <div key={quiz.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="mr-4">{quiz.questions} questions</span>
                      <span>{quiz.timeEstimate}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{quiz.attempts} attempts</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Average Score</span>
                        <span className="font-medium">{quiz.averageScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full">
                        <div 
                          className={`h-1.5 rounded-full ${quiz.averageScore > 75 ? 'bg-green-500' : quiz.averageScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${quiz.averageScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/quiz/take?id=${quiz.id}&subject=physics`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Start Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Forum Discussions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
                <Link
                  href="/forum?category=physics"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Understanding Angular Momentum Conservation</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    I'm having trouble understanding how to apply conservation of angular momentum in problems with variable moments of inertia...
                  </p>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <div className="text-gray-500">12 replies • 2 days ago</div>
                    <Link href="/forum/topic/123" className="text-blue-600 hover:text-blue-800 font-medium">
                      View Discussion
                    </Link>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Doppler Effect Calculation Help</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    Can someone explain the difference between the formulas used when the source is moving vs when the observer is moving?
                  </p>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <div className="text-gray-500">8 replies • 3 days ago</div>
                    <Link href="/forum/topic/124" className="text-blue-600 hover:text-blue-800 font-medium">
                      View Discussion
                    </Link>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">Electric Field vs Electric Potential</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    I'm confused about the relationship between electric field and electric potential. How do you derive one from the other?
                  </p>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <div className="text-gray-500">15 replies • 1 week ago</div>
                    <Link href="/forum/topic/125" className="text-blue-600 hover:text-blue-800 font-medium">
                      View Discussion
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/forum/new?category=physics"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }