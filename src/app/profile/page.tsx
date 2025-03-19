import React from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock user data - in a real application, this would come from your authentication/database system
  const user = {
    name: "Kaveesha Piumal",
    email: "kaveesha@example.com",
    joined: "January 2025",
    avatar: "/images/avatar-placeholder.png",
    level: 12,
    xp: 3240,
    xpToNextLevel: 5000,
    points: 2750,
    subjects: [
      { id: "physics", name: "Physics", progress: 68, color: "blue" },
      { id: "chemistry", name: "Chemistry", progress: 42, color: "green" },
      { id: "math", name: "Combined Mathematics", progress: 75, color: "yellow" }
    ],
    badges: [
      { id: 1, name: "Quiz Master", description: "Completed 50 quizzes", icon: "🏆", earned: true },
      { id: 2, name: "Perfect Score", description: "Got 100% on a quiz", icon: "⭐", earned: true },
      { id: 3, name: "Helper", description: "Answered 25 forum questions", icon: "🤝", earned: true },
      { id: 4, name: "Consistent", description: "Studied for 7 days in a row", icon: "📅", earned: true },
      { id: 5, name: "Chemistry Whiz", description: "Mastered all Chemistry topics", icon: "🧪", earned: false },
      { id: 6, name: "Math Genius", description: "Solved 100 math problems", icon: "🔢", earned: false }
    ],
    stats: {
      quizzesCompleted: 78,
      forumPosts: 34,
      resourcesAccessed: 127,
      studyHours: 156,
      daysStreak: 12,
      rankInClass: 8
    }
  };
  
  // Calculate XP progress percentage
  const xpProgressPercentage = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 pt-12 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Profile
          </h1>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-1">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-purple-100 flex items-center justify-center mb-4 relative">
                  <span className="text-6xl">👨‍🎓</span>
                  <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-xs font-semibold text-white">
                    {user.level}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">{user.name}</h2>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="text-sm text-gray-500">Member since {user.joined}</div>
                
                <div className="mt-6 w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800">Level {user.level}</span>
                    <span className="text-gray-600">{user.xp}/{user.xpToNextLevel} XP</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-purple-600 rounded-full" 
                      style={{ width: `${xpProgressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.floor(user.xpToNextLevel - user.xp)} XP needed for next level
                  </p>
                </div>
                
                <div className="mt-6 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Points</h3>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {user.points} pts
                    </span>
                  </div>
                  <Link
                    href="/rewards"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Visit Rewards Store
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>

                {/* User Stats */}
                <div className="mt-8 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold text-gray-800">{user.stats.quizzesCompleted}</div>
                      <div className="text-xs text-gray-500">Quizzes Completed</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold text-gray-800">{user.stats.daysStreak}</div>
                      <div className="text-xs text-gray-500">Day Streak</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold text-gray-800">{user.stats.forumPosts}</div>
                      <div className="text-xs text-gray-500">Forum Posts</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold text-gray-800">{user.stats.studyHours}</div>
                      <div className="text-xs text-gray-500">Study Hours</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-xs font-medium text-yellow-800">
                        Class Rank: <span className="font-bold">{user.stats.rankInClass}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Subject Progress Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Subject Progress</h2>
                <div className="space-y-6">
                  {user.subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">{subject.name}</span>
                        <span className="text-gray-600">{subject.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full bg-${subject.color}-500`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end">
                        <Link
                          href={`/subjects/${subject.id}`}
                          className={`text-sm text-${subject.color}-600 hover:text-${subject.color}-800 font-medium flex items-center`}
                        >
                          View study materials
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={user.name}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={user.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                    <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                    <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                    <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                    <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
                    <div className="text-sm text-gray-500">Theme Options (Coming Soon)</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="notification-quiz"
                          name="notification-quiz"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notification-quiz" className="ml-3 block text-sm text-gray-700">
                          New quizzes available
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notification-forum"
                          name="notification-forum"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="notification-forum" className="ml-3 block text-sm text-gray-700">
                          Replies to your forum posts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="notification-resources"
                          name="notification-resources"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notification-resources" className="ml-3 block text-sm text-gray-700">
                          New resource uploads
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Badges and Achievements */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Badges & Achievements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {user.badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`p-4 rounded-lg border ${badge.earned ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      {!badge.earned && (
                        <div className="mt-2 text-xs text-gray-500 italic">Not yet earned</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Free Plan</h2>
                    <p className="text-purple-100">Upgrade to Premium for AI-personalized learning and exclusive resources.</p>
                  </div>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Upgrade
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-400">
                  <div className="text-sm text-purple-100">Premium features include:</div>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-white">AI-powered study recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-white">Exclusive premium resources</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-purple-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-white">Advanced analytics and insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}