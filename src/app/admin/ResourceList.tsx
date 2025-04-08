import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Paperclip, Eye, EyeOff, Download, Info, FileText, Search } from 'lucide-react';
import { API_URL } from '@/utils/api';

// --- Interfaces ---
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
  subject: ResourceSubjectInfo | string;
  type: string;
  size: string;
  filePath: string;
  downloads: number;
  premium: boolean;
  date: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: any;
}

interface ResourceListProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onEdit, onDelete }) => {
  // Helper to get subject name
  const getSubjectName = (subject: ResourceSubjectInfo | string): string => {
    if (typeof subject === 'object' && subject !== null && subject.name) {
      return subject.name;
    }
    return typeof subject === 'string' ? `ID: ${subject.substring(0, 8)}...` : 'N/A';
  };

  // Helper to get subject color
  const getSubjectColor = (subject: ResourceSubjectInfo | string): string => {
    if (typeof subject === 'object' && subject !== null && subject.color) {
      return subject.color;
    }
    return '#6366f1'; // Default indigo color
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

  // Function to format file size
  const formatFileSize = (size: string): string => {
    if (!size) return 'N/A';
    // If size is already formatted (e.g., "2.5 MB"), return as is
    if (size.includes(' ')) return size;
    
    // Try to parse as number of bytes
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let formattedSize = bytes;
    
    while (formattedSize >= 1024 && i < units.length - 1) {
      formattedSize /= 1024;
      i++;
    }
    
    return `${formattedSize.toFixed(1)} ${units[i]}`;
  };

  // Function to create a direct link to the resource file
  const getResourceLink = (filePath: string) => {
    const baseUrl = API_URL.replace('/api', '');
    const cleanFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    return `${baseUrl}${cleanFilePath}`;
  };

  // Function to get file extension icon class
  const getFileIconByType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'zip':
      case 'rar':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  if (resources.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No resources found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          There are no resources available right now. Create a new resource to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th scope="col" className="group px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Title</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Category</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Subject</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Type</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Downloads</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Premium</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Status</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">File</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Created</div>
                </div>
              </th>
              <th scope="col" className="group px-6 py-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Actions</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map((res) => {
              const subjectColor = getSubjectColor(res.subject);
              
              return (
                <tr key={res._id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-200">
                  {/* Title */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      <div className="mr-3 flex-shrink-0">
                        {getFileIconByType(res.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs" title={res.title}>
                          {res.title}
                        </div>
                        {res.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs mt-0.5" title={res.description}>
                            {res.description.length > 40 ? res.description.substring(0, 40) + '...' : res.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      {res.category}
                    </span>
                  </td>
                  
                  {/* Subject */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: subjectColor }}></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{getSubjectName(res.subject)}</span>
                    </div>
                  </td>
                  
                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {res.type.toUpperCase()}
                    </span>
                  </td>
                  
                  {/* Downloads */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <Download className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{res.downloads}</span>
                    </div>
                  </td>
                  
                  {/* Premium */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {res.premium ? (
                      <div className="flex items-center justify-center">
                        <span className="relative inline-flex">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                          // With these lines:
<CheckCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" aria-label="Premium" />

                          </span>
                          <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-yellow-500 ring-2 ring-white dark:ring-gray-800"></span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
<XCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-label="Standard" />    
                    </span>
                      </div>
                    )}
                  </td>
                  
                  {/* Status (isActive) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {res.isActive === false ? (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Inactive
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Active
                      </div>
                    )}
                  </td>
                  
                  {/* File Link */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <a 
                        href={getResourceLink(res.filePath)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={`View ${res.filePath}`} 
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center hover:underline"
                      >
                        <Paperclip className="h-4 w-4 mr-1.5" />
                        View
                      </a>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatFileSize(res.size)}</span>
                    </div>
                  </td>
                  
                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{formatDate(res.createdAt || res.date)}</div>
                    {res.updatedAt && res.updatedAt !== res.createdAt && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Updated: {formatDate(res.updatedAt)}
                      </div>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => onEdit(res)} 
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30" 
                        aria-label={`Edit ${res.title}`}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => onDelete(res._id)} 
                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30" 
                        aria-label={`Delete ${res.title}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ResourceList;