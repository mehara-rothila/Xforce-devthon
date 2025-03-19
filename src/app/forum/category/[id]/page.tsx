import Link from 'next/link';

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Mock category data
  const categories = [
    {
      id: 1,
      name: 'Physics',
      description: 'Discuss mechanics, waves, electricity, and other physics topics',
      topics: 156,
      posts: 1872,
    },
    {
      id: 2,
      name: 'Chemistry',
      description: 'Discuss organic, inorganic, and physical chemistry concepts',
      topics: 124,
      posts: 1452,
    },
    {
      id: 3,
      name: 'Combined Mathematics',
      description: 'Discuss calculus, algebra, statistics, and other math topics',
      topics: 183,
      posts: 2145,
    },
    {
      id: 4,
      name: 'General Discussion',
      description: 'Discuss general topics related to A/L exams, preparation, and more',
      topics: 95,
      posts: 1287,
    },
  ];

  const categoryId = parseInt(params.id);
  const category = categories.find(c => c.id === categoryId) || categories[0];
  
  // Mock topics for this category
  const topics = [
    {
      id: 1,
      title: 'Need help understanding electromagnetic induction',
      author: 'Dinuka P.',
      replies: 12,
      views: 238,
      lastActive: '2 hours ago',
      lastPoster: 'Samith R.',
      isPinned: true,
    },
    {
      id: 2,
      title: 'How to solve these mechanics problems?',
      author: 'Ravindu K.',
      replies: 5,
      views: 142,
      lastActive: '5 hours ago',
      lastPoster: 'Kavisha M.',
      isPinned: false,
    },
    {
      id: 3,
      title: 'Wave-particle duality explained',
      author: 'Sajith T.',
      replies: 8,
      views: 176,
      lastActive: '1 day ago',
      lastPoster: 'Nethmi J.',
      isPinned: false,
    },
    {
      id: 4,
      title: 'Difference between velocity and acceleration',
      author: 'Chamodi D.',
      replies: 15,
      views: 312,
      lastActive: '2 days ago',
      lastPoster: 'Ashan S.',
      isPinned: false,
    },
    {
      id: 5,
      title: 'Help with derivation of relativistic momentum',
      author: 'Samith R.',
      replies: 6,
      views: 198,
      lastActive: '3 days ago',
      lastPoster: 'Dinuka P.',
      isPinned: false,
    },
    {
      id: 6,
      title: 'Understanding electric field intensity',
      author: 'Malith G.',
      replies: 3,
      views: 112,
      lastActive: '5 days ago',
      lastPoster: 'Ravindu K.',
      isPinned: false,
    },
    {
      id: 7,
      title: 'Tips for solving thermodynamics problems',
      author: 'Kavisha M.',
      replies: 9,
      views: 201,
      lastActive: '1 week ago',
      lastPoster: 'Sajith T.',
      isPinned: false,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/forum" className="text-gray-500 hover:text-gray-700">
                Forum
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900">{category.name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                <p className="mt-1 text-gray-600">{category.description}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link 
                  href="/forum/new" 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  New Topic
                </Link>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="mr-4">{category.topics} topics</span>
              <span>{category.posts} posts</span>
            </div>
          </div>
        </div>
        
        {/* Topics List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="hidden sm:grid sm:grid-cols-12 p-4 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="sm:col-span-6">Topic</div>
            <div className="sm:col-span-2 text-center">Replies</div>
            <div className="sm:col-span-2 text-center">Views</div>
            <div className="sm:col-span-2 text-center">Last Post</div>
          </div>
          <div className="divide-y divide-gray-100">
            {topics.map((topic) => (
              <div key={topic.id} className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${topic.isPinned ? 'bg-yellow-50' : ''}`}>
                <div className="sm:grid sm:grid-cols-12 sm:gap-4">
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      {topic.isPinned && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      )}
                      <div>
                        <Link href={`/forum/topic/${topic.id}`} className="text-base font-medium text-gray-900 hover:text-purple-600">
                          {topic.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">Started by {topic.author}</p>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-center hidden sm:block">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {topic.replies}
                    </span>
                  </div>
                  <div className="sm:col-span-2 text-center hidden sm:block">
                    <span className="text-sm text-gray-600">{topic.views}</span>
                  </div>
                  <div className="sm:col-span-2 text-right hidden sm:block">
                    <p className="text-sm text-gray-600">{topic.lastPoster}</p>
                    <p className="text-xs text-gray-500">{topic.lastActive}</p>
                  </div>
                  <div className="mt-2 sm:hidden grid grid-cols-3 text-xs text-gray-500">
                    <div className="text-center">
                      <span className="block text-gray-900 font-medium">{topic.replies}</span>
                      <span>Replies</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-gray-900 font-medium">{topic.views}</span>
                      <span>Views</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-gray-900 font-medium">{topic.lastActive}</span>
                      <span>Last Post</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
            <Link 
              href="#" 
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </Link>
            <Link 
              href="#" 
              className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              1
            </Link>
            <Link 
              href="#" 
              className="px-3 py-2 border border-gray-300 bg-purple-600 text-sm font-medium text-white"
            >
              2
            </Link>
            <Link 
              href="#" 
              className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              3
            </Link>
            <Link 
              href="#" 
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}