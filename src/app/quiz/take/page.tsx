'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';

// Define interfaces for type safety
interface Option {
  _id?: string; // Optional because IDs might be generated
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  text: string;
  options: Option[];
  correctAnswer?: string | null; // Optional, might be derived
  explanation?: string; // Optional with a default
}

interface RawQuiz {
  _id: string;
  title: string;
  subject: {
    name: string;
  };
  questions: Question[];
  timeLimit?: number; // Optional with a default
}

interface FormattedQuiz {
  title: string;
  subject: string;
  totalQuestions: number;
  timeLimit: number;
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    correctAnswer: string | null;
    explanation: string;
  }[];
}

interface QuizResults {
  score: number;
  totalPoints: number;
  percentageScore: number;
}

// Component that handles all the quiz functionality after receiving quizId
function TakeQuizContent({ quizId }: { quizId: string | null }) {
  const router = useRouter();

  // State variables with explicit types
  const [quizData, setQuizData] = useState<FormattedQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [animateQuestion, setAnimateQuestion] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  // Fetch quiz data on mount or when quizId changes
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("No quiz ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.quizzes.getById(quizId);
        const quiz: RawQuiz = response.data.data.quiz;

        const formattedQuiz: FormattedQuiz = {
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

        setQuizData(formattedQuiz);
        setTimeRemaining(formattedQuiz.timeLimit * 60);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Handle countdown timer
  useEffect(() => {
    if (!quizData || isSubmitted || timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    if (timeRemaining === 0) {
      setIsSubmitted(true); // Mark as submitted when time runs out
    }

    return () => clearTimeout(timer);
  }, [timeRemaining, isSubmitted, quizData]);

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = quizData ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0;

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted && quizData) {
      setSelectedOption(optionId);
      setAnswers({
        ...answers,
        [quizData.questions[currentQuestion].id]: optionId,
      });
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setAnimateQuestion(true);
      setTimeout(() => {
        const nextQuestionIndex = currentQuestion + 1;
        setCurrentQuestion(nextQuestionIndex);
        setSelectedOption(answers[quizData.questions[nextQuestionIndex]?.id] || "");
        setShowExplanation(false);
        setAnimateQuestion(false);
      }, 300);
    }
  };

  // Navigate to previous question (Fixed)
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setAnimateQuestion(true);
      setTimeout(() => {
        const prevQuestionIndex = currentQuestion - 1;
        setCurrentQuestion(prevQuestionIndex);
        // Ensure quizData is not null before accessing questions
        if (quizData) {
          setSelectedOption(answers[quizData.questions[prevQuestionIndex].id] || "");
        } else {
          setSelectedOption("");
        }
        setShowExplanation(false);
        setAnimateQuestion(false);
      }, 300);
    }
  };

  // Show explanation for current question
  const handleCheckAnswer = () => {
    if (selectedOption) {
      setShowExplanation(true);
    }
  };

  // Submit quiz answers
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));

      const response = await api.quizzes.submitAttempt(quizId!, formattedAnswers);
      setQuizResults(response.data.data);
      setIsSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
      setLoading(false);
    }
  };

  // Calculate score locally
  const calculateScore = (): { score: number; total: number; percentage: number } => {
    if (!quizData) return { score: 0, total: 0, percentage: 0 };

    let correct = 0;
    quizData.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const total = quizData.questions.length;
    return {
      score: correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  };

  // Render logic
  if (loading && !quizData && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Return to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">The requested quiz could not be found or loaded.</p>
          <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Browse Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quizData.questions[currentQuestion];
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const score = quizResults
    ? { score: quizResults.score, total: quizResults.totalPoints, percentage: quizResults.percentageScore }
    : calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Background elements code remains the same */}
        <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
        {/* Other animated elements... */}
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-10 pb-24 overflow-hidden">
        {/* Header content remains the same */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {/* Header background elements */}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">{quizData.title}</h1>
              <p className="mt-1 text-lg text-purple-100">
                {quizData.subject} • {quizData.totalQuestions} questions
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/quiz"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Quizzes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-10">
        {isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform animate-fadeInUp">
            {/* Submitted quiz content remains the same */}
            <div className="px-4 sm:px-8 py-10">
              {/* Quiz completion content... */}
            </div>
          </div>
        ) : (
          <>
            {/* Active quiz content remains the same */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sticky top-4 z-20">
              {/* Quiz progress indicators... */}
            </div>
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transition-opacity duration-300 ${animateQuestion ? 'opacity-0' : 'opacity-100'}`}>
              {/* Question content... */}
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Question navigation... */}
            </div>
          </>
        )}
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .text-10xl { font-size: 9rem; line-height: 1; }
        .text-11xl { font-size: 10rem; line-height: 1; }
        .floating-icon { animation: float 6s ease-in-out infinite; }
        .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .floating-icon-slow { animation: float 10s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .animate-fadeIn {
          animation: fadeInAnimation 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUpAnimation 0.6s ease-out forwards;
        }
        @keyframes fadeInAnimation {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUpAnimation {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-widthGrow {
          animation: widthGrow 1s ease-out forwards;
        }
        @keyframes widthGrow {
          from { width: 0%; }
          to { width: 100%; }
        }
        .sticky {
          position: -webkit-sticky;
          position: sticky;
        }
      `}</style>
    </div>
  );
}

// Component that gets searchParams and passes to main component
function QuizWithParams() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');
  
  return <TakeQuizContent quizId={quizId} />;
}

// Main component wrapped in Suspense
export default function TakeQuiz() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    }>
      <QuizWithParams />
    </Suspense>
  );
}