import Link from 'next/link';

export default function Forum() {
  // Mock data for forum categories
  const categories = [
    {
      id: 1,
      name: 'Physics',
      description: 'Discuss mechanics, waves, electricity, and other physics topics',
      topics: 156,
      posts: 1872,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'Chemistry',
      description: 'Discuss organic, inorganic, and physical chemistry concepts',
      topics: 124,
      posts: 1452,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'Combined Mathematics',
      description: 'Discuss calculus, algebra, statistics, and other math topics',
      topics: 183,
      posts: 2145,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: 'General Discussion',
      description: 'Discuss general topics related to A/L exams, preparation, and more',
      topics: 95,
      posts: 1287,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  // Mock data for recent discussions
  const recentDiscussions = [
    {
      id: 1,
      title: 'Need help understanding electromagnetic induction',
      category: 'Physics',
      author: 'Dinuka P.',
      replies: 12,
      views: 238,
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      title: 'Oxidation and reduction reactions - easy way to remember',
      category: 'Chemistry',
      author: 'Kavisha M.',
      replies: 8,
      views: 176,
      lastActive: '5 hours ago',
    },
    {
      id: 3,
      title: 'Integration by parts - when to use it?',
      category: 'Combined Mathematics',
      author: 'Ashan S.',
      replies: 15,
      views: 312,
      lastActive: '1 day ago',
    },
    {
      id: 4,
      title: 'Time management tips for A/L exams',
      category: 'General Discussion',
      author: 'Nethmi J.',
      replies: 24,
      views: 425,
      lastActive: '2 days ago',
    },
    {
      id: 5,
      title: 'Working with vectors in 3D space',
      category: 'Combined Mathematics',
      author: 'Ravindu K.',
      replies: 6,
      views: 142,
      lastActive: '3 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Discussion Forum</h1>
          <p className="mt-3 text-xl text-gray-700">Connect with peers, ask questions, and discuss topics</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Forum Categories</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <Link href={`/forum/category/${category.id}`} className="block">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {category.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-gray-600">{category.description}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="mr-4">{category.topics} topics</span>
                            <span>{category.posts} posts</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
                <Link href="/forum/new" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200">
                  New Topic
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentDiscussions.map((discussion) => (
                  <div key={discussion.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <Link href={`/forum/topic/${discussion.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600">
                            {discussion.title}
                          </h3>
                          <div className="mt-1 flex items-center text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              discussion.category === 'Physics' ? 'bg-blue-100 text-blue-800' :
                              discussion.category === 'Chemistry' ? 'bg-green-100 text-green-800' :
                              discussion.category === 'Combined Mathematics' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {discussion.category}
                            </span>
                            <span className="ml-2 text-gray-500">by {discussion.author}</span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                          <div className="mr-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {discussion.replies}
                          </div>
                          <div className="mr-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {discussion.views}
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {discussion.lastActive}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100 text-center">
                <Link href="/forum/all" className="text-purple-600 font-medium hover:text-purple-800">
                  View all discussions →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Search Forums</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search topics..."
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-2 top-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Community Stats</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Topics</span>
                    <span className="font-semibold text-gray-900">558</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-semibold text-gray-900">6,756</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Members</span>
                    <span className="font-semibold text-gray-900">2,845</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Online Now</span>
                    <span className="font-semibold text-gray-900">127</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Forum Guidelines</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Be respectful and helpful to fellow students</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Post in the relevant category for better responses</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Include relevant details in your questions</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Use proper formatting for equations and formulas</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Earn points by providing helpful answers</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href="/forum/guidelines" className="text-purple-600 font-medium hover:text-purple-800">
                    Read full guidelines →
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