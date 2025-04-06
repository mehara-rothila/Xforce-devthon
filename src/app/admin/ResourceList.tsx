import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Paperclip } from 'lucide-react'; // Icons
import { API_URL } from '@/utils/api'; // Import API_URL for download links

// --- Interfaces ---
// Ensure these match the interfaces used in page.tsx
interface ResourceSubjectInfo {
  _id: string;
  name: string;
  color?: string;
}
interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  subject: ResourceSubjectInfo | string; // Allow populated or ID
  type: string;
  size: string;
  filePath: string;
  downloads: number;
  premium: boolean;
  date: string; // This is likely the creation date from the model's timestamps
  isActive?: boolean;
  createdAt?: string; // Use this if available and preferred over 'date'
  updatedAt?: string;
  author?: any;
}

interface ResourceListProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onEdit, onDelete }) => {

  // Helper to get subject name, handling both populated object and ID string
  const getSubjectName = (subject: ResourceSubjectInfo | string): string => {
    if (typeof subject === 'object' && subject !== null && subject.name) {
      return subject.name;
    }
    // Basic fallback if it's just an ID string
    return typeof subject === 'string' ? `ID: ${subject.substring(0, 8)}...` : 'N/A';
  };

  // Helper to format date strings
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

  // Function to create a direct link to the resource file
  // Assumes files are served statically from the backend's 'public' directory
  const getResourceLink = (filePath: string) => {
      // Remove '/api' part from API_URL if it exists to get the base backend URL
      const baseUrl = API_URL.replace('/api', '');
      // Ensure filePath starts with a '/'
      const cleanFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
      // Combine base URL and file path
      return `${baseUrl}${cleanFilePath}`;
  }

  // Render message if no resources are found
  if (resources.length === 0) {
    return <p className="text-center text-gray-500 py-10">No resources found.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {resources.map((res) => (
            <tr key={res._id} className="hover:bg-gray-50 transition-colors">
              {/* Title */}
              <td className="px-4 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={res.title}>{res.title}</div>
              </td>
              {/* Category */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{res.category}</td>
              {/* Subject */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{getSubjectName(res.subject)}</td>
              {/* Type */}
              <td className="px-4 py-4 whitespace-nowrap">
                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{res.type}</span>
              </td>
              {/* Size */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{res.size}</td>
              {/* Downloads */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{res.downloads}</td>
              {/* Premium */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                 {res.premium ? <CheckCircle className="h-5 w-5 text-yellow-500 mx-auto" title="Premium" /> : <XCircle className="h-5 w-5 text-gray-400 mx-auto" title="Standard"/>}
              </td>
              {/* File Link */}
               <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                 <a
                    href={getResourceLink(res.filePath)}
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    title={`View ${res.filePath}`}
                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center hover:underline"
                 >
                    <Paperclip className="h-4 w-4 mr-1"/> View File
                 </a>
               </td>
               {/* Created Date */}
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(res.createdAt || res.date)}</td>
              {/* Actions */}
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onClick={() => onEdit(res)} className="text-indigo-600 hover:text-indigo-900 transition-colors" aria-label={`Edit ${res.title}`}><Edit className="h-5 w-5" /></button>
                <button onClick={() => onDelete(res._id)} className="text-red-600 hover:text-red-900 transition-colors" aria-label={`Delete ${res.title}`}><Trash2 className="h-5 w-5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceList;