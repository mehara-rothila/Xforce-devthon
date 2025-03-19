import Link from 'next/link';

const quizzes = [
  {
    id: 1,
    title: 'Mechanics - Forces and Motion',
    subject: 'Physics',
    difficulty: 'Medium',
    questions: 20,
    duration: '30 min',
    attempts: 256,
    rating: 4.7,
  },
  {
    id: 2,
    title: 'Organic Chemistry Basics',
    subject: 'Chemistry',
    difficulty: 'Hard',
    questions: 15,
    duration: '25 min',
    attempts: 189,
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Differential Calculus',
    subject: 'Combined Math',
    difficulty: 'Hard',
    questions: 18,
    duration: '35 min',
    attempts: 312,
    rating: 4.8,
  },
  {
    id: 4,
    title: 'Waves and Oscillations',
    subject: 'Physics',
    difficulty: 'Medium',
    questions: 15,
    duration: '25 min',
    attempts: 205,
    rating: 4.6,
  },
  {
    id: 5,
    title: 'Inorganic Chemistry',
    subject: 'Chemistry',
    difficulty: 'Medium',
    questions: 22,
    duration: '40 min',
    attempts: 178,
    rating: 4.4,
  },
  {
    id: 6,
    title: 'Statistics and Probability',
    subject: 'Combined Math',
    difficulty: 'Easy',
    questions: 20,
    duration: '30 min',
    attempts: 287,
    rating: 4.6,
  },
];

export default function Quizzes() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Practice Quizzes</h1>
          <p className="mt-3 text-xl text-gray-500">Test your knowledge and earn points</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              All Subjects
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 border border-gray-300">
              Physics
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 border border-gray-300">
              Chemistry
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 border border-gray-300">
              Combined Math
            </button>
          </div>
          <div>
            <select
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Sort by: Popular</option>
              <option>Sort by: Newest</option>
              <option>Sort by: Difficulty (Easy to Hard)</option>
              <option>Sort by: Difficulty (Hard to Easy)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    quiz.subject === 'Physics' ? 'bg-blue-100 text-blue-800' :
                    quiz.subject === 'Chemistry' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quiz.subject}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{quiz.questions} questions</span>
                  <span>{quiz.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="mr-4">{quiz.attempts} attempts</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{quiz.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link href={`/quiz/${quiz.id}`} className="text-purple-600 font-medium hover:text-purple-800">
                    View Details
                  </Link>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm font-medium">
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}