// Remove "use client" to make it a Server Component
import Link from 'next/link';
import api from '../../../utils/api';

// Define interfaces (same as before)
interface Option {
  _id?: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  text: string;
  options: Option[];
  correctAnswer?: string | null;
  explanation?: string;
}

interface RawQuiz {
  _id: string;
  title: string;
  subject: { name: string };
  questions: Question[];
  timeLimit?: number;
}

interface Params {
  id: string;
}

// Fetch quiz data server-side
export default async function TakeQuiz({ params }: { params: Params }) {
  const quizId = params.id;

  try {
    const response = await api.quizzes.getById(quizId);
    const quiz: RawQuiz = response.data.data.quiz;

    const formattedQuiz = {
      title: quiz.title,
      subject: quiz.subject.name,
      totalQuestions: quiz.questions.length,
      timeLimit: quiz.timeLimit || 15,
      questions: quiz.questions.map((q, index) => ({
        id: q._id,
        text: q.text,
        options: q.options.map((opt, i) => ({
          id: opt._id || String.fromCharCode(97 + i),
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        correctAnswer:
          q.correctAnswer ||
          (q.options.find((o) => o.isCorrect)
            ? q.options.find((o) => o.isCorrect)!._id ||
              String.fromCharCode(97 + q.options.findIndex((o) => o.isCorrect))
            : null),
        explanation: q.explanation || "No explanation provided.",
      })),
    };

    // Render static content; interactive logic needs a Client Component
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center p-4">
        <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-10 pb-24 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">{formattedQuiz.title}</h1>
                <p className="mt-1 text-lg text-purple-100">
                  {formattedQuiz.subject} • {formattedQuiz.totalQuestions} questions
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link href="/quiz" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Quizzes
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl w-full -mt-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <p className="text-gray-600 mb-4">Quiz loaded successfully. Interactive features require JavaScript.</p>
            <p className="text-sm text-gray-500">This is a static preview. Use the client-side version for the full quiz experience.</p>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-6">Failed to load quiz. Please try again.</p>
          <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Return to Quizzes
          </Link>
        </div>
      </div>
    );
  }
}

// Optional: Pre-generate static pages for known quiz IDs
export async function generateStaticParams() {
  try {
    const response = await api.quizzes.getAll({ limit: 100 }); // Adjust based on your API
    const quizzes = response.data.data.quizzes;
    return quizzes.map((quiz: RawQuiz) => ({
      id: quiz._id,
    }));
  } catch (err) {
    console.error("Error fetching quiz IDs:", err);
    return []; // Fallback to no static pages if API fails
  }
}