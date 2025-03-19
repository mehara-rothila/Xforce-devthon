'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NewTopic() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = [
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'mathematics', name: 'Combined Mathematics' },
    { id: 'general', name: 'General Discussion' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`New topic submitted!\nTitle: ${title}\nCategory: ${category}\nContent: ${content}`);
    // In a real application, you would submit this to your backend
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
              <span className="text-gray-900">New Topic</span>
            </li>
          </ol>
        </nav>
        
        {/* New Topic Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Create a New Topic</h1>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter a clear, specific title for your topic"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Describe your question or topic in detail. Include any relevant information that would help others understand your question."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Tip:</span> Be specific in your question to get better answers.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href="/forum"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    Create Topic
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Posting Guidelines:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-inside list-disc">
              <li>Make sure your question hasn't been asked before by using the search function.</li>
              <li>Be clear and concise in your title and description.</li>
              <li>For math equations, use proper formatting (surround with $ for inline or $$ for block).</li>
              <li>Be respectful and considerate of other community members.</li>
              <li>Attach relevant images or diagrams if needed to explain your question better.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}