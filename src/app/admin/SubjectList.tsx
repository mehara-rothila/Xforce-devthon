
import React from 'react';
import { Edit, Trash2, BookOpen } from 'lucide-react'; // Icons

// Interfaces (Match the ones in page.tsx)
interface Topic {
    _id?: string;
    name: string;
    description?: string;
    order?: number;
    resources?: string[];
}
interface Subject {
    _id: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
    topics: Topic[];
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    topicCount?: number; // Virtual property
}

interface SubjectListProps {
  subjects: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void; // For soft delete
}

const SubjectList: React.FC<SubjectListProps> = ({ subjects, onEdit, onDelete }) => {

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

  if (subjects.length === 0) {
    return <p className="text-center text-gray-500 py-10">No subjects found.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Icon
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Topics
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Color
            </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subjects.map((subject) => (
            <tr key={subject._id} className="hover:bg-gray-50 transition-colors">
               <td className="px-6 py-4 whitespace-nowrap">
                 {/* Display icon - you might need a mapping or component for this */}
                 <span className="p-2 rounded-full" style={{ backgroundColor: subject.color + '20' }}> {/* Light background */}
                    {/* Example: using lucide based on name, replace with actual logic */}
                    {subject.icon === 'atom' ? '⚛️' : subject.icon === 'flask' ? '🧪' : '📚'}
                 </span>
               </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{subject.name}</div>
              </td>
               <td className="px-6 py-4"> {/* Allow description to wrap */}
                <div className="text-sm text-gray-700 max-w-xs truncate" title={subject.description}> {/* Truncate long descriptions */}
                    {subject.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                {subject.topicCount ?? subject.topics?.length ?? 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 <span className="w-6 h-6 inline-block rounded-full border border-gray-300" style={{ backgroundColor: subject.color }}></span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(subject.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(subject)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  aria-label={`Edit ${subject.name}`}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(subject._id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  aria-label={`Deactivate ${subject.name}`} // Changed label for soft delete
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

export default SubjectList;
