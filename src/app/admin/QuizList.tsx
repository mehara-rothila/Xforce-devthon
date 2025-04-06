import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'; // Added Clock icon

// Re-use or define the Quiz interface (ensure consistency)
interface Subject {
  _id: string;
  name: string;
}

interface Quiz {
  _id: string;
  title: string;
  subject: Subject | string; // Can be populated object or just ID
  difficulty: 'easy' | 'medium' | 'hard';
  questions: any[];
  totalQuestions?: number;
  timeLimit: number; // Make sure this field exists and is fetched
  isPublished?: boolean;
  attempts?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface QuizListProps {
  quizzes: Quiz[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, onEdit, onDelete }) => {

  const getSubjectName = (subject: Subject | string): string => {
    if (typeof subject === 'object' && subject !== null && subject.name) {
      return subject.name;
    }
    // If it's just an ID or invalid, return placeholder or ID
    return typeof subject === 'string' ? 'ID: '+ subject.substring(0, 8)+'...' : 'N/A';
  };

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

  if (quizzes.length === 0) {
    return <p className="text-center text-gray-500 py-10">No quizzes found.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difficulty
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
            {/* --- ADDED: Time Limit Header --- */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Limit
            </th>
            {/* ------------------------------ */}
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Published
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
          {quizzes.map((quiz) => (
            <tr key={quiz._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{getSubjectName(quiz.subject)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                {quiz.questions?.length ?? 'N/A'}
              </td>
              {/* --- ADDED: Time Limit Data Cell --- */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                 <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {quiz.timeLimit} min
                 </div>
              </td>
              {/* --------------------------------- */}
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                 {quiz.isPublished ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                 ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                 )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(quiz.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(quiz)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  aria-label={`Edit ${quiz.title}`}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(quiz._id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  aria-label={`Delete ${quiz.title}`}
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

export default QuizList;