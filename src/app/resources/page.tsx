import Link from 'next/link';

export default function Resources() {
  const categories = [
    { name: 'Past Papers', count: 45 },
    { name: 'Model Papers', count: 32 },
    { name: 'Notes', count: 120 },
    { name: 'Practice Questions', count: 250 },
    { name: 'Video Lessons', count: 85 },
  ];

  const resources = [
    {
      id: 1,
      title: '2023 Physics Past Paper with Marking Scheme',
      category: 'Past Papers',
      subject: 'Physics',
      type: 'PDF',
      size: '2.4 MB',
      downloads: 1250,
      premium: false,
    },
    {
      id: 2,
      title: 'Combined Mathematics Model Paper - June 2024',
      category: 'Model Papers',
      subject: 'Combined Math',
      type: 'PDF',
      size: '3.1 MB',
      downloads: 875,
      premium: true,
    },
    {
      id: 3,
      title: 'Organic Chemistry Comprehensive Notes',
      category: 'Notes',
      subject: 'Chemistry',
      type: 'PDF',
      size: '5.7 MB',
      downloads: 2100,
      premium: false,
    },
    {
      id: 4,
      title: 'Physics: Electricity and Magnetism Practice Questions',
      category: 'Practice Questions',
      subject: 'Physics',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 950,
      premium: false,
    },
    {
      id: 5,
      title: 'Chemistry 2022 Past Paper with Worked Solutions',
      category: 'Past Papers',
      subject: 'Chemistry',
      type: 'PDF',
      size: '4.2 MB',
      downloads: 1800,
      premium: false,
    },
    {
      id: 6,
      title: 'Advanced Calculus Video Lessons',
      category: 'Video Lessons',
      subject: 'Combined Math',
      type: 'Video',
      size: '450 MB',
      downloads: 780,
      premium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Resource Library</h1>
          <p className="mt-3 text-xl text-gray-700">Access study materials and past papers</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Search</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
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

            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name} className="flex justify-between items-center">
                    <Link href="#" className="text-gray-700 hover:text-purple-600">
                      {category.name}
                    </Link>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Subjects</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="physics"
                    name="subject"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="physics" className="ml-2 block text-sm text-gray-900">
                    Physics
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="chemistry"
                    name="subject"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="chemistry" className="ml-2 block text-sm text-gray-900">
                    Chemistry
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="math"
                    name="subject"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="math" className="ml-2 block text-sm text-gray-900">
                    Combined Math
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold mb-4 sm:mb-0 text-gray-900">All Resources</h2>
                <div>
                  <select
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Sort by: Most Downloaded</option>
                    <option>Sort by: Newest</option>
                    <option>Sort by: Oldest</option>
                    <option>Sort by: A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center mb-2">
                        <span
                          className={`inline-block mr-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            resource.subject === 'Physics'
                              ? 'bg-blue-100 text-blue-800'
                              : resource.subject === 'Chemistry'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {resource.subject}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {resource.category}
                        </span>
                        {resource.premium && (
                          <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Premium
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                      <div className="flex items-center text-sm text-gray-700 mt-1">
                        <span className="mr-4">
                          {resource.type} • {resource.size}
                        </span>
                        <span>{resource.downloads} downloads</span>
                      </div>
                    </div>
                    <div>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          resource.premium
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {resource.premium ? 'Premium Access' : 'Download'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <Link 
                  href="#" 
                  className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
                <Link 
                  href="#" 
                  className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </Link>
                <Link 
                  href="#" 
                  className="px-4 py-2 border border-gray-300 bg-purple-600 text-sm font-medium text-white"
                >
                  2
                </Link>
                <Link 
                  href="#" 
                  className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  3
                </Link>
                <Link 
                  href="#" 
                  className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}