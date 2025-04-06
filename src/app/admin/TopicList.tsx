import React from 'react';
import { Trash2 } from 'lucide-react';

// Interface matching the one defined in page.tsx
interface ForumTopic {
    _id: string;
    title: string;
    author: { _id: string; name: string; }; // Assuming author is populated
    views: number;
    repliesCount: number;
    createdAt: string;
    // Add other fields if needed
}

interface TopicListProps {
  topics: ForumTopic[];
  onDeleteTopic: (topicId: string) => void; // Function to trigger deletion
}

const TopicList: React.FC<TopicListProps> = ({ topics, onDeleteTopic }) => {

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (topics.length === 0) {
    return <p className="text-center text-gray-500 py-6">No topics found in this category.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Replies</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topics.map((topic) => (
            <tr key={topic._id} className="hover:bg-gray-50 transition-colors">
              {/* Title */}
              <td className="px-4 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-900 truncate max-w-sm" title={topic.title}>{topic.title}</div>
              </td>
              {/* Author */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{topic.author?.name || 'Unknown'}</td>
              {/* Replies */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{topic.repliesCount ?? 0}</td>
              {/* Views */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{topic.views ?? 0}</td>
               {/* Created Date */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(topic.createdAt)}</td>
              {/* Actions */}
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                {/* Delete Button */}
                <button
                  onClick={() => onDeleteTopic(topic._id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  title={`Delete topic: ${topic.title}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                 {/* Add Edit/Pin/Lock buttons here later if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopicList;