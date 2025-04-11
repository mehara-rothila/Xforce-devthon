// src/app/quiz/take/page.tsx
'use client';
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api'; // Ensure this path is correct
import { useAuth } from '@/app/context/AuthContext'; // Import useAuth

// --- Interfaces ---
interface ApiOption {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface ApiQuestion {
  _id: string;
  text: string;
  options: ApiOption[];
  correctAnswer?: string | null;
  explanation?: string;
}

interface RawQuiz {
  _id: string;
  title: string;
  subject: {
    name: string;
  };
  questions: ApiQuestion[];
  timeLimit?: number;
}

interface FormattedOption {
  id: string;
  text: string;
}

interface FormattedQuestion {
  id: string;
  text: string;
  options: FormattedOption[];
  correctAnswer: string | null;
  explanation: string;
}

interface FormattedQuiz {
  title: string;
  subject: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  questions: FormattedQuestion[];
}

interface QuizResults {
  attemptId: string | null; // Ensure attemptId is included
  score: number;
  totalPoints: number;
  percentageScore: number;
  correctAnswers: number;
  totalQuestions: number;
  pointsAwarded: number;
  xpAwarded: number;
  achievements?: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  points: number;
  rarity: string;
}

// --- Star Rating Component (Example) ---
interface StarRatingProps {
  rating: number; // Current rating value (0-5)
  onRatingChange: (rating: number) => void; // Callback when rating changes
  disabled?: boolean; // Optional: disable interaction
  size?: string; // Optional: Tailwind size class (e.g., 'h-6 w-6')
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  disabled = false,
  size = 'h-6 w-6' // Default size
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex items-center space-x-1 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`focus:outline-none transition-transform duration-150 ${disabled ? '' : 'hover:scale-110'}`}
          onClick={() => !disabled && onRatingChange(star)}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${size} transition-colors duration-150 ${
              (hoverRating || rating) >= star
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};


// --- Loading Component ---
function QuizLoading() {
   return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
      </div>
    </div>
  );
}

// --- Main Quiz Content Component ---
function TakeQuizContent({ quizId }: { quizId: string | null }) {
  const router = useRouter();
  const { user } = useAuth(); // Get user from context

  // --- State ---
  const [quizData, setQuizData] = useState<FormattedQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [animateQuestion, setAnimateQuestion] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  // --- Rating State ---
  const [userRating, setUserRating] = useState<number>(0); // 1-5 rating selected by user
  const [isRatingSubmitting, setIsRatingSubmitting] = useState<boolean>(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [initialRatingGiven, setInitialRatingGiven] = useState<number | null>(null); // Store the rating fetched from DB
  const [isFetchingRating, setIsFetchingRating] = useState<boolean>(true); // Loading state for fetching attempt

  const PASSING_SCORE = 60;

  // Fetch Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("No quiz ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await api.quizzes.getById(quizId);
        const quiz: RawQuiz = response.data.data.quiz;
        const formattedQuiz: FormattedQuiz = {
          title: quiz.title,
          subject: quiz.subject.name,
          totalQuestions: quiz.questions.length,
          timeLimit: quiz.timeLimit || 15,
          questions: quiz.questions.map((q) => ({
            id: q._id,
            text: q.text,
            options: q.options.map((opt) => ({
              id: opt._id ? opt._id.toString() : `fallback-${Math.random()}`,
              text: opt.text,
            })),
            correctAnswer: q.correctAnswer ? q.correctAnswer.toString() : null,
            explanation: q.explanation || "No explanation provided.",
          })),
        };
        setQuizData(formattedQuiz);
        setTimeRemaining((formattedQuiz.timeLimit || 15) * 60);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        setError(`Failed to load quiz: ${err.response?.data?.message || err.message || 'Please try again.'}`);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Handle Quiz Submission (wrapped in useCallback)
  const handleSubmit = useCallback(async (isTimeout = false) => {
      if (loading || isSubmitted) return;
      console.log("Submitting answers:", answers);
      try {
          setLoading(true);
          setIsSubmitted(true);
          const endTime = Date.now();
          const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
          const actualTimeTaken = isTimeout ? (quizData?.timeLimit || 0) * 60 : timeTakenSeconds;
          console.log(`Time Taken: ${actualTimeTaken} seconds (Timeout: ${isTimeout})`);
          const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({ questionId, answerId }));
          if (!quizId) throw new Error("Quiz ID is missing for submission.");

          const response = await api.quizzes.submitAttempt(quizId, formattedAnswers, actualTimeTaken);
          if (response.data?.status === 'success' && response.data?.data) {
              setQuizResults(response.data.data); // This should include the attemptId
              console.log("Quiz Results Received:", response.data.data);
          } else {
              throw new Error(response.data?.message || "Invalid response structure from API.");
          }
      } catch (err: any) {
          console.error("Error submitting quiz:", err);
          setError(`Failed to submit quiz: ${err.response?.data?.message || err.message || 'Please try again.'}`);
          setIsSubmitted(false); // Allow retry on error
      } finally {
          setLoading(false);
      }
  }, [loading, isSubmitted, answers, startTime, quizData, quizId]); // Dependencies for useCallback

  // Countdown Timer Logic
  useEffect(() => {
    if (!quizData || isSubmitted || timeRemaining <= 0 || loading) return;
    const timer = setTimeout(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    if (timeRemaining === 1) {
        console.log("Time's up! Submitting quiz...");
        handleSubmit(true); // Auto-submit
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, isSubmitted, quizData, loading, handleSubmit]); // Added handleSubmit dependency

  // Fetch Attempt Rating Status
  const fetchAttemptRating = useCallback(async () => {
      if (quizResults?.attemptId && user) {
          console.log(`[TakeQuiz] Fetching rating status for attempt: ${quizResults.attemptId}`);
          setIsFetchingRating(true);
          try {
              const response = await api.quizzes.getAttemptById(quizResults.attemptId);
              if (response.data?.status === 'success' && response.data.data?.attempt) {
                  setInitialRatingGiven(response.data.data.attempt.ratingGiven);
                  console.log(`[TakeQuiz] Rating status fetched: ${response.data.data.attempt.ratingGiven}`);
              } else {
                   console.warn("[TakeQuiz] Could not fetch attempt details or invalid format.");
                   setInitialRatingGiven(null);
              }
          } catch (err: any) {
              console.error("[TakeQuiz] Error fetching attempt rating:", err);
              setInitialRatingGiven(null);
              if (err.response?.status === 404) {
                  console.log("[TakeQuiz] Attempt not found, likely okay if just submitted.");
              } else if (err.response?.status === 403) {
                   console.warn("[TakeQuiz] User not authorized to view this attempt's rating status.");
              }
          } finally {
              setIsFetchingRating(false);
          }
      } else {
          setIsFetchingRating(false);
      }
  }, [quizResults, user]);

  useEffect(() => {
      if (isSubmitted && quizResults) {
          fetchAttemptRating();
      }
  }, [isSubmitted, quizResults, fetchAttemptRating]);


  // --- Helper Functions ---
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = quizData ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0;

  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted && quizData) {
      setSelectedOption(optionId);
      setAnswers((prev) => ({
        ...prev,
        [quizData.questions[currentQuestion].id]: optionId,
      }));
      setShowExplanation(false);
    }
  };

  const navigateQuestion = (direction: 'next' | 'prev') => {
    if (animateQuestion || !quizData) return;
    const targetQuestionIndex = direction === 'next' ? currentQuestion + 1 : currentQuestion - 1;
    if (targetQuestionIndex >= 0 && targetQuestionIndex < quizData.questions.length) {
      setAnimateQuestion(true);
      setTimeout(() => {
        setCurrentQuestion(targetQuestionIndex);
        setSelectedOption(answers[quizData.questions[targetQuestionIndex].id] || "");
        setShowExplanation(false);
        setAnimateQuestion(false);
      }, 300);
    }
  };

  const handleNext = () => navigateQuestion('next');
  const handlePrevious = () => navigateQuestion('prev');

  const handleCheckAnswer = () => {
    if (selectedOption && quizData) {
      setShowExplanation(true);
    }
  };

  // Handle Rating Submission
  const handleRatingSubmit = async () => {
      if (userRating < 1 || userRating > 5 || !quizId || !quizResults?.attemptId || isRatingSubmitting || initialRatingGiven !== null) {
          console.log("Rating submission prevented:", { userRating, quizId, attemptId: quizResults?.attemptId, isRatingSubmitting, initialRatingGiven });
          return;
      }
      setIsRatingSubmitting(true);
      setRatingError(null);
      console.log(`Submitting rating ${userRating} for quiz ${quizId}, attempt ${quizResults.attemptId}`);
      try {
          await api.quizzes.rate(quizId, { rating: userRating, attemptId: quizResults.attemptId });
          setInitialRatingGiven(userRating);
          console.log("Rating submitted successfully.");
          // Add success feedback (e.g., toast notification)
      } catch (err: any) {
          console.error("Error submitting rating:", err);
          setRatingError(err.response?.data?.message || err.message || "Failed to submit rating.");
          // Add error feedback (e.g., toast notification)
      } finally {
          setIsRatingSubmitting(false);
      }
  };

  // --- Render Logic ---
  if (loading && !quizData && !error) return <QuizLoading />;

  if (error && !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
         <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Return to Quizzes</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">The requested quiz could not be found or loaded.</p>
          <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Browse Quizzes</Link>
        </div>
      </div>
    );
  }

  const isCurrentSelectionCorrect = quizData?.questions[currentQuestion]?.correctAnswer === selectedOption;
  const isPassing = quizResults ? quizResults.percentageScore >= PASSING_SCORE : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* ... Symbols ... */}
        <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
        <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
        {/* ... more symbols ... */}
        <div className="absolute top-[41%] left-[8%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        {/* ... more icons ... */}
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-10 pb-24 overflow-hidden">
         <div className="absolute inset-0 overflow-hidden opacity-20">{/* ... Icons ... */}</div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="sm:flex sm:items-center sm:justify-between">
             {quizData && (
               <div>
                 <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">{quizData.title}</h1>
                 <p className="mt-1 text-lg text-purple-100">
                   {quizData.subject} • {quizData.totalQuestions} questions
                 </p>
               </div>
             )}
             <div className="mt-4 sm:mt-0">
               <Link href="/quiz" className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 Back to Quizzes
               </Link>
             </div>
           </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-10">
        {isSubmitted && quizResults ? (
          // --- RESULTS SCREEN ---
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform animate-fadeInUp">
            <div className="px-4 sm:px-8 py-10">
              {/* Header Section */}
              <div className="text-center mb-8">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-4 text-white text-3xl shadow-lg">
                  {isPassing ? '🎉' : '🤔'}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Quiz Completed!</h2>
                <p className="text-gray-600">You've completed the {quizData?.title || 'quiz'}.</p>
                 {isPassing ? (
                    <p className="mt-2 text-lg font-semibold text-green-600">Congratulations, you passed!</p>
                ) : (
                    <p className="mt-2 text-lg font-semibold text-red-600">Keep practicing!</p>
                )}
              </div>

              {/* Quiz Results Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8 border border-purple-100 shadow-inner">
                 <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md mb-4 ring-2 ring-purple-200">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">{quizResults.percentageScore}%</div>
                  </div>
                  <p className="text-gray-700 mb-2 text-lg">
                    You got <span className="font-semibold text-purple-700">{quizResults.correctAnswers}</span> out of{' '}
                    <span className="font-semibold text-purple-700">{quizResults.totalQuestions}</span> questions correct.
                  </p>
                  {/* Points and XP Rewards Section */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 shadow-sm flex items-center">
                       <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center justify-center mr-3 shadow-sm">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </div>
                       <div>
                         <p className="text-sm text-yellow-800 font-medium">Points Earned</p>
                         <p className="text-xl font-bold text-yellow-900">+{quizResults.pointsAwarded || 0}</p>
                       </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white flex items-center justify-center mr-3 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">XP Gained</p>
                        <p className="text-xl font-bold text-blue-900">+{quizResults.xpAwarded || 0}</p>
                      </div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-4">
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div><span>Correct</span></div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div><span>Incorrect</span></div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                      <div
                        style={{ width: `${Math.max(0, Math.min(100, quizResults.percentageScore))}%` }}
                        className="animate-widthGrow shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000 ease-out"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Rating Section --- */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Rate this Quiz</h3>
                  {isFetchingRating ? (
                      <p className="text-center text-sm text-gray-500">Loading rating status...</p>
                  ) : initialRatingGiven !== null ? (
                      <div className="text-center">
                          <p className="text-gray-700 mb-2">You rated this attempt:</p>
                          <div className="flex justify-center">
                              <StarRating rating={initialRatingGiven} onRatingChange={() => {}} disabled={true} size="h-7 w-7" />
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center">
                          <p className="text-gray-700 mb-3 text-center">How would you rate your experience with this quiz?</p>
                          <StarRating rating={userRating} onRatingChange={setUserRating} disabled={isRatingSubmitting} size="h-8 w-8" />
                          {ratingError && <p className="text-red-500 text-xs mt-2">{ratingError}</p>}
                          <button
                              onClick={handleRatingSubmit}
                              disabled={userRating === 0 || isRatingSubmitting || initialRatingGiven !== null}
                              className={`mt-4 px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200 shadow-md ${
                                  userRating === 0 || isRatingSubmitting || initialRatingGiven !== null
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                              }`}
                          >
                              {isRatingSubmitting ? 'Submitting...' : 'Submit Rating'}
                          </button>
                      </div>
                  )}
              </div>
              {/* --- END Rating Section --- */}

              {/* Achievements Unlocked Section */}
              {quizResults?.achievements && quizResults.achievements.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 sm:p-8 mb-8 border border-yellow-200 shadow-md">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 text-white text-3xl shadow-lg">🏆</div>
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Achievement{quizResults.achievements.length > 1 ? 's' : ''} Unlocked!</h3>
                    <p className="text-yellow-700">Congratulations on your progress!</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizResults.achievements.map(achievement => {
                      const rarityColors = {
                        common: 'bg-gray-50 border-gray-200 text-gray-800',
                        uncommon: 'bg-green-50 border-green-200 text-green-800',
                        rare: 'bg-blue-50 border-blue-200 text-blue-800',
                        epic: 'bg-purple-50 border-purple-200 text-purple-800',
                        legendary: 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      };
                      const rarityColor = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common;
                      return (
                        <div key={achievement.id} className={`rounded-xl ${rarityColor} p-4 border shadow-sm flex`}>
                          <div className="flex-shrink-0 mr-4">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow-sm text-2xl">🌟</div>
                          </div>
                          <div>
                            <h4 className={`font-bold ${rarityColor.split(' ')[2]}`}>{achievement.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                            <div className="flex space-x-3 text-sm">
                              <span className="text-blue-700 font-medium">+{achievement.xp} XP</span>
                              <span className="text-yellow-700 font-medium">+{achievement.points} Points</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detailed Answer Review */}
              <div className="space-y-6">
                 {quizData?.questions.map((question, index) => {
                    const userAnswerId = answers[question.id];
                    const isCorrect = userAnswerId === question.correctAnswer;
                    return (
                        <div key={question.id} className="border rounded-xl p-4 sm:p-6 bg-white hover:shadow-md transition-shadow duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <span className="font-medium text-gray-800 text-lg">Question {index + 1}</span>
                            {isCorrect ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                Incorrect
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-4">{question.text}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {question.options.map((option) => (
                              <div key={option.id} className={`border px-4 py-3 rounded-lg flex items-center text-sm transition-all duration-200 ${ option.id === question.correctAnswer ? 'bg-green-50 border-green-300 ring-1 ring-green-300' : option.id === userAnswerId ? 'bg-red-50 border-red-300 ring-1 ring-red-300' : 'border-gray-200 bg-gray-50' }`}>
                                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs font-semibold ${ option.id === question.correctAnswer ? 'bg-green-500 text-white' : option.id === userAnswerId ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700' }`}>
                                  {option.id === question.correctAnswer ? '✔' : (option.id === userAnswerId ? '✖' : '•')}
                                </div>
                                <span className={`${ option.id === question.correctAnswer ? 'text-green-800 font-medium' : option.id === userAnswerId ? 'text-red-800 font-medium line-through' : 'text-gray-700' }`}>
                                  {option.text}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-sm rounded-lg p-4 bg-blue-50 border border-blue-100">
                            <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                            <p className="text-blue-700">{question.explanation}</p>
                          </div>
                        </div>
                    );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                 <Link href="/quiz" className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                   Back to Quizzes
                 </Link>
                 <Link href="/dashboard" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-md transform hover:scale-105">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 01-1 1H8a1 1 0 01-1-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1h2" /></svg>
                   Go to Dashboard
                 </Link>
              </div>
            </div>
          </div>
        ) : quizData ? (
            // --- QUIZ INTERFACE ---
             <>
               {/* Sticky Header */}
               <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sticky top-4 z-20">
                    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 flex-wrap gap-y-3">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
                          <div><p className="text-sm text-gray-500">Subject</p><p className="font-medium text-gray-800">{quizData.subject}</p></div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                          <div><p className="text-sm text-gray-500">Questions</p><p className="font-medium text-gray-800">{quizData.totalQuestions} total</p></div>
                        </div>
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${ timeRemaining < 60 ? 'bg-red-100' : timeRemaining < 180 ? 'bg-yellow-100' : 'bg-green-100' }`}><svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${ timeRemaining < 60 ? 'text-red-600 animate-pulse' : timeRemaining < 180 ? 'text-yellow-600' : 'text-green-600' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                          <div><p className="text-sm text-gray-500">Time Remaining</p><p className={`font-bold text-lg ${ timeRemaining < 60 ? 'text-red-600' : timeRemaining < 180 ? 'text-yellow-600' : 'text-green-600' }`}>{formatTime(timeRemaining)}</p></div>
                        </div>
                    </div>
                   {/* Progress Bar */}
                   <div className="px-4 sm:px-6 py-4">
                     <div className="flex justify-between text-sm text-gray-600 mb-2"><span className="font-medium">Question {currentQuestion + 1} of {quizData.questions.length}</span><span>{Math.round(progress)}% complete</span></div>
                     <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"><div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div></div>
                   </div>
               </div>

               {/* Current Question Card */}
               <div className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transition-opacity duration-300 ${animateQuestion ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="px-4 sm:px-6 py-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4 shadow-sm">{quizData.subject} Question</div>
                    <h2 className="text-xl font-medium text-gray-900 mb-6">{quizData.questions[currentQuestion]?.text || 'Loading question...'}</h2>
                   {/* Options */}
                   <div className="space-y-3 mb-6">
                     {quizData.questions[currentQuestion]?.options.map((option, index) => (
                       <div key={option.id} onClick={() => handleSelectOption(option.id)} className={`border px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center group ${ selectedOption === option.id ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 ring-2 ring-purple-300 shadow-md' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm' }`}>
                         <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-medium shadow-sm transition-all duration-200 ${ selectedOption === option.id ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white scale-110' : 'bg-gray-200 text-gray-700 group-hover:bg-purple-200 group-hover:text-purple-800' }`}>
                           {index + 1}
                         </div>
                         <span className={`text-gray-800 ${selectedOption === option.id ? 'font-semibold text-purple-900' : 'group-hover:text-purple-900'}`}>{option.text}</span>
                       </div>
                     ))}
                   </div>
                   {/* Explanation Area */}
                   {showExplanation && (
                     <div className={`mt-6 p-6 rounded-xl border ${isCurrentSelectionCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-fadeIn`}>
                       <div className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${ isCurrentSelectionCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white' }`}>
                                {isCurrentSelectionCorrect ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>}
                            </div>
                            <div className="ml-4">
                                <h3 className={`text-lg font-semibold ${isCurrentSelectionCorrect ? 'text-green-800' : 'text-red-800'}`}>{isCurrentSelectionCorrect ? 'Correct!' : 'Incorrect'}</h3>
                                <p className={`mt-1 text-sm ${isCurrentSelectionCorrect ? 'text-green-700' : 'text-red-700'}`}>{quizData.questions[currentQuestion]?.explanation}</p>
                            </div>
                       </div>
                     </div>
                   )}
                 </div>
                 {/* Footer with Navigation/Submit Buttons */}
                 <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button onClick={handlePrevious} disabled={currentQuestion === 0 || animateQuestion || loading} className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-sm ${ currentQuestion === 0 || animateQuestion || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow' }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>Previous
                    </button>
                   <div className="flex w-full sm:w-auto space-x-3">
                     {!showExplanation && selectedOption && ( <button onClick={handleCheckAnswer} disabled={animateQuestion || loading} className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Check Answer</button> )}
                     {currentQuestion < quizData.questions.length - 1 ? (
                       <button onClick={handleNext} disabled={!selectedOption || animateQuestion || loading} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform ${ !selectedOption || animateQuestion || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:scale-105' }`}>
                         Next<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                       </button>
                     ) : (
                       <button onClick={() => handleSubmit()} disabled={!selectedOption || animateQuestion || loading} className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                         {loading ? <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                         {loading ? 'Submitting...' : 'Submit Quiz'}
                       </button>
                     )}
                   </div>
                 </div>
               </div>

               {/* Question Navigation Grid */}
               <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                        <h3 className="font-medium text-gray-800 flex items-center text-base"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>Question Navigation</h3>
                        <div className="flex items-center space-x-3 text-xs font-medium text-gray-600">
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mr-1 shadow-inner"></div><span>Current</span></div>
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-200 mr-1 shadow-inner"></div><span>Answered</span></div>
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-200 mr-1 shadow-inner"></div><span>Unanswered</span></div>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                        {quizData.questions.map((question, index) => ( <button key={question.id} onClick={() => { if (animateQuestion) return; setAnimateQuestion(true); setTimeout(() => { setCurrentQuestion(index); setSelectedOption(answers[question.id] || ""); setShowExplanation(false); setAnimateQuestion(false); }, 300); }} className={`w-full h-10 rounded-lg font-medium text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${ currentQuestion === index ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white transform scale-110 ring-purple-400 z-10 relative' : answers[question.id] ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 ring-purple-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 ring-gray-300' }`} aria-label={`Go to question ${index + 1}`}>{index + 1}</button> ))}
                        </div>
                    </div>
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
                          <div className="font-medium">Answered: {Object.keys(answers).length} / {quizData.questions.length}</div>
                          <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Use 'Check Answer' to see explanations before submitting.</span></div>
                        </div>
                    </div>
               </div>
             </>
          ) : null
        }
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .text-10xl { font-size: 9rem; line-height: 1; }
        .text-11xl { font-size: 10rem; line-height: 1; }
        .floating-icon { animation: float 6s ease-in-out infinite; }
        .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .floating-icon-slow { animation: float 10s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        @keyframes float-reverse { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(20px) rotate(-5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }
        .animate-fadeIn { animation: fadeInAnimation 0.5s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUpAnimation 0.6s ease-out forwards; }
        @keyframes fadeInAnimation { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUpAnimation { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        .animate-widthGrow { width: var(--target-width, 0%); animation: widthGrowAnimation 1s ease-out forwards; }
        @keyframes widthGrowAnimation { from { width: 0%; } }
        .sticky { position: -webkit-sticky; position: sticky; }
      `}</style>
    </div>
  );
}

// --- Wrapper Components ---
function QuizWithParams() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');
  if (!quizId) {
      return (
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Missing Quiz ID</h2>
                  <p className="text-gray-600 mb-6">No quiz ID was provided in the URL.</p>
                  <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Browse Quizzes</Link>
              </div>
          </div>
      );
  }
  return <TakeQuizContent quizId={quizId} />;
}

export default function TakeQuiz() {
  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizWithParams />
    </Suspense>
  );
}