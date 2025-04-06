import React from 'react';
import { Edit, Trash2, List } from 'lucide-react'; // Added List icon
import SubjectIcon from '@/components/icons/SubjectIcon'; // Reusing SubjectIcon for categories

// Interface matching the one in page.tsx
interface ForumCategory {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  topicsCount?: number;
  postsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryListProps {
  categories: ForumCategory[];
  onEdit: (category: ForumCategory) => void; // Will show alert currently
  onDelete: (categoryId: string) => void; // Will show alert currently
  onViewTopics: (categoryId: string) => void; // <-- NEW PROP: Handler to view topics
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete, onViewTopics }) => {

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (categories.length === 0) {
    return <p className="text-center text-gray-500 py-10">No forum categories found.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Topics</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50 transition-colors">
              {/* Icon */}
              <td className="px-4 py-4 whitespace-nowrap">
                 <span className="p-1.5 rounded-full inline-flex items-center justify-center" style={{ backgroundColor: (category.color || '#cccccc') + '20' }}>
                    <SubjectIcon iconName={category.icon} color={category.color} className="h-5 w-5" />
                 </span>
              </td>
              {/* Name */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </td>
              {/* Description */}
               <td className="px-4 py-4">
                <div className="text-sm text-gray-700 max-w-xs truncate" title={category.description}>
                    {category.description || '-'}
                </div>
              </td>
              {/* Topics Count */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{category.topicsCount ?? 0}</td>
              {/* Posts Count */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{category.postsCount ?? 0}</td>
              {/* Created Date */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(category.createdAt)}</td>
              {/* Actions */}
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                 {/* View Topics Button <-- NEW */}
                 <button
                  onClick={() => onViewTopics(category._id)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  title={`View Topics in ${category.name}`}
                >
                  <List className="h-5 w-5" />
                </button>
                {/* Edit Button (triggers alert) */}
                <button
                  onClick={() => onEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Backend endpoint needed for editing"
                  // disabled // Enable when backend is ready
                >
                  <Edit className="h-5 w-5" />
                </button>
                {/* Delete Button (triggers alert) */}
                <button
                  onClick={() => onDelete(category._id)}
                  className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Backend endpoint needed for deleting"
                  // disabled // Enable when backend is ready
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;