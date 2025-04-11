// src/app/quiz/take/page.tsx
'use client';
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api'; // Ensure this path is correct
import { useAuth } from '@/app/context/AuthContext'; // Import useAuth
import { useDarkMode } from '@/app/DarkModeContext'; // Import useDarkMode

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
  const { isDarkMode } = useDarkMode(); // Get dark mode state

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
                ? 'text-yellow-400' // Active star color
                : (isDarkMode ? 'text-gray-600' : 'text-gray-300') // Inactive star color based on mode
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
   const { isDarkMode } = useDarkMode();
   return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} flex items-center justify-center p-4`}>
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading quiz...</p>
      </div>
    </div>
  );
}

// --- Main Quiz Content Component ---
function TakeQuizContent({ quizId }: { quizId: string | null }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode(); // Use dark mode context

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
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} flex items-center justify-center p-4`}>
         <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg max-w-md w-full`}>
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4 text-center`}>Error Loading Quiz</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 text-center`}>{error}</p>
          <div className="flex justify-center"><Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Return to Quizzes</Link></div>
        </div>
      </div>
    );
  }

  if (!quizData && !loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} flex items-center justify-center p-4`}>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-lg max-w-md w-full text-center`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Quiz Not Found</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>The requested quiz could not be found or loaded.</p>
          <Link href="/quiz" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Browse Quizzes</Link>
        </div>
      </div>
    );
  }

  const isCurrentSelectionCorrect = quizData?.questions[currentQuestion]?.correctAnswer === selectedOption;
  const isPassing = quizResults ? quizResults.percentageScore >= PASSING_SCORE : false;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} transition-colors duration-300 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Mathematical symbols */}
        <div className={`absolute top-[7%] left-[13%] text-purple-500 ${isDarkMode ? 'dark:text-purple-400' : ''} text-9xl opacity-75 floating-icon`}>∑</div>
        <div className={`absolute top-[33%] right-[17%] text-blue-500 ${isDarkMode ? 'dark:text-blue-400' : ''} text-10xl opacity-70 floating-icon-reverse`}>π</div>
        <div className={`absolute top-[61%] left-[27%] text-green-500 ${isDarkMode ? 'dark:text-green-400' : ''} text-8xl opacity-75 floating-icon-slow`}>∞</div>
        <div className={`absolute top-[19%] right-[38%] text-red-500 ${isDarkMode ? 'dark:text-red-400' : ''} text-11xl opacity-65 floating-icon`}>⚛</div>
        <div className={`absolute top-[77%] right-[23%] text-yellow-500 ${isDarkMode ? 'dark:text-yellow-400' : ''} text-9xl opacity-70 floating-icon-slow`}>𝜙</div>
        <div className={`absolute bottom-[31%] left-[8%] text-indigo-500 ${isDarkMode ? 'dark:text-indigo-400' : ''} text-10xl opacity-70 floating-icon-reverse`}>∫</div>
        <div className={`absolute bottom-[12%] right-[42%] text-teal-500 ${isDarkMode ? 'dark:text-teal-400' : ''} text-9xl opacity-75 floating-icon`}>≈</div>
        <div className={`absolute bottom-[47%] right-[9%] text-pink-500 ${isDarkMode ? 'dark:text-pink-400' : ''} text-8xl opacity-65 floating-icon-slow`}>±</div>
        {/* Additional math symbols */}
        <div className={`absolute top-[23%] left-[54%] text-fuchsia-500 ${isDarkMode ? 'dark:text-fuchsia-400' : ''} text-8xl opacity-70 floating-icon`}>Δ</div>
        <div className={`absolute top-[44%] left-[38%] text-emerald-500 ${isDarkMode ? 'dark:text-emerald-400' : ''} text-7xl opacity-65 floating-icon-slow`}>λ</div>
        <div className={`absolute top-[81%] left-[67%] text-cyan-500 ${isDarkMode ? 'dark:text-cyan-400' : ''} text-9xl opacity-70 floating-icon-reverse`}>θ</div>
        <div className={`absolute top-[29%] left-[83%] text-rose-500 ${isDarkMode ? 'dark:text-rose-400' : ''} text-8xl opacity-65 floating-icon`}>α</div>
        <div className={`absolute bottom-[63%] left-[6%] text-amber-500 ${isDarkMode ? 'dark:text-amber-400' : ''} text-9xl opacity-70 floating-icon-slow`}>β</div>
        <div className={`absolute bottom-[19%] left-[71%] text-purple-500 ${isDarkMode ? 'dark:text-purple-400' : ''} text-8xl opacity-65 floating-icon-reverse`}>μ</div>
        <div className={`absolute bottom-[28%] left-[32%] text-blue-500 ${isDarkMode ? 'dark:text-blue-400' : ''} text-7xl opacity-70 floating-icon`}>ω</div>
        {/* Additional symbols */}
        <div className={`absolute top-[52%] left-[18%] text-sky-500 ${isDarkMode ? 'dark:text-sky-400' : ''} text-8xl opacity-60 floating-icon-slow`}>γ</div>
        <div className={`absolute top-[37%] right-[29%] text-lime-500 ${isDarkMode ? 'dark:text-lime-400' : ''} text-9xl opacity-55 floating-icon`}>σ</div>
        <div className={`absolute bottom-[42%] right-[37%] text-orange-500 ${isDarkMode ? 'dark:text-orange-400' : ''} text-10xl opacity-50 floating-icon-reverse`}>δ</div>
        <div className={`absolute top-[73%] right-[13%] text-violet-500 ${isDarkMode ? 'dark:text-violet-400' : ''} text-8xl opacity-60 floating-icon-slow`}>ρ</div>
        {/* Science formulas */}
        <div className={`absolute top-[14%] left-[31%] text-indigo-500 ${isDarkMode ? 'dark:text-indigo-400' : ''} text-6xl opacity-65 floating-icon-slow`}>E=mc²</div>
        <div className={`absolute top-[58%] left-[48%] text-teal-500 ${isDarkMode ? 'dark:text-teal-400' : ''} text-5xl opacity-60 floating-icon`}>F=ma</div>
        <div className={`absolute top-[39%] left-[76%] text-violet-500 ${isDarkMode ? 'dark:text-violet-400' : ''} text-6xl opacity-65 floating-icon-reverse`}>H₂O</div>
        <div className={`absolute bottom-[17%] left-[52%] text-rose-500 ${isDarkMode ? 'dark:text-rose-400' : ''} text-6xl opacity-60 floating-icon`}>PV=nRT</div>
        <div className={`absolute bottom-[53%] left-[24%] text-emerald-500 ${isDarkMode ? 'dark:text-emerald-400' : ''} text-5xl opacity-65 floating-icon-slow`}>v=λf</div>
        <div className={`absolute top-[86%] left-[11%] text-sky-500 ${isDarkMode ? 'dark:text-sky-400' : ''} text-5xl opacity-55 floating-icon-reverse`}>C₆H₁₂O₆</div>
        <div className={`absolute top-[68%] right-[31%] text-amber-500 ${isDarkMode ? 'dark:text-amber-400' : ''} text-6xl opacity-60 floating-icon`}>E=hf</div>
        {/* Science icons */}
         <div className="absolute top-[41%] left-[8%] opacity-60 floating-icon-slow">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-36 w-36 text-cyan-500 ${isDarkMode ? 'dark:text-cyan-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
       </div>
       <div className="absolute top-[17%] right-[7%] opacity-60 floating-icon">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-40 w-40 text-amber-500 ${isDarkMode ? 'dark:text-amber-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
       </div>
       <div className="absolute bottom-[7%] left-[36%] opacity-60 floating-icon-reverse">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-44 w-44 text-emerald-500 ${isDarkMode ? 'dark:text-emerald-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
       </div>
       <div className="absolute top-[54%] right-[28%] opacity-60 floating-icon-slow">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-36 w-36 text-violet-500 ${isDarkMode ? 'dark:text-violet-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
       </div>
       <div className="absolute top-[23%] left-[67%] opacity-60 floating-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-32 w-32 text-rose-500 ${isDarkMode ? 'dark:text-rose-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>
       </div>
       <div className="absolute bottom-[37%] right-[6%] opacity-55 floating-icon-reverse">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-28 w-28 text-blue-500 ${isDarkMode ? 'dark:text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
       </div>
       <div className="absolute top-[71%] left-[13%] opacity-55 floating-icon-slow">
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-32 w-32 text-orange-500 ${isDarkMode ? 'dark:text-orange-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
       </div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-10 pb-24 overflow-hidden">
         <div className="absolute inset-0 overflow-hidden opacity-20">{/* ... Icons ... */}</div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="sm:flex sm:items-center sm:justify-between">
             {quizData && (
               <div>
                 <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">{quizData.title}</h1>
                 <p className="mt-1 text-lg text-purple-100">{quizData.subject} • {quizData.totalQuestions} questions</p>
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
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform animate-fadeInUp border`}>
            <div className="px-4 sm:px-8 py-10">
              {/* Header Section */}
              <div className="text-center mb-8">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-4 text-white text-3xl shadow-lg">{isPassing ? '🎉' : '🤔'}</div>
                 <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>Quiz Completed!</h2>
                 <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You've completed the {quizData?.title || 'quiz'}.</p>
                 {isPassing ? ( <p className={`mt-2 text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Congratulations, you passed!</p> ) : ( <p className={`mt-2 text-lg font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Keep practicing!</p> )}
              </div>

              {/* Quiz Results Summary */}
              <div className={`${isDarkMode ? 'bg-gray-850 border-gray-700' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100'} rounded-2xl p-6 sm:p-8 mb-8 border shadow-inner`}>
                 <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${isDarkMode ? 'bg-gray-700 ring-gray-600' : 'bg-white ring-purple-200'} shadow-md mb-4 ring-2`}>
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">{quizResults.percentageScore}%</div>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 text-lg`}>You got <span className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>{quizResults.correctAnswers}</span> out of <span className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>{quizResults.totalQuestions}</span> questions correct.</p>
                  {/* Points and XP Rewards Section */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className={`${isDarkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} rounded-xl p-4 border shadow-sm flex items-center`}>
                       <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center justify-center mr-3 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                       <div><p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} font-medium`}>Points Earned</p><p className={`text-xl font-bold ${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>+{quizResults.pointsAwarded || 0}</p></div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-xl p-4 border shadow-sm flex items-center`}>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white flex items-center justify-center mr-3 shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                      <div><p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} font-medium`}>XP Gained</p><p className={`text-xl font-bold ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>+{quizResults.xpAwarded || 0}</p></div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className={`flex items-center justify-center space-x-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div><span>Correct</span></div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div><span>Incorrect</span></div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-6"><div className="relative pt-1"><div className={`overflow-hidden h-4 text-xs flex rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}><div style={{ width: `${Math.max(0, Math.min(100, quizResults.percentageScore))}%` }} className="animate-widthGrow shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000 ease-out"></div></div></div></div>
              </div>

              {/* --- Rating Section --- */}
              <div className={`${isDarkMode ? 'bg-gray-850 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg border p-6 sm:p-8 mb-8`}>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4 text-center`}>Rate this Quiz</h3>
                  {isFetchingRating ? ( <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading rating status...</p> )
                   : initialRatingGiven !== null ? (
                      <div className="text-center">
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>You rated this attempt:</p>
                          <div className="flex justify-center"><StarRating rating={initialRatingGiven} onRatingChange={() => {}} disabled={true} size="h-7 w-7" /></div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center">
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 text-center`}>How would you rate your experience with this quiz?</p>
                          <StarRating rating={userRating} onRatingChange={setUserRating} disabled={isRatingSubmitting} size="h-8 w-8" />
                          {ratingError && <p className="text-red-500 text-xs mt-2">{ratingError}</p>}
                          <button onClick={handleRatingSubmit} disabled={userRating === 0 || isRatingSubmitting || initialRatingGiven !== null} className={`mt-4 px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200 shadow-md ${ userRating === 0 || isRatingSubmitting || initialRatingGiven !== null ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' }`}>
                              {isRatingSubmitting ? 'Submitting...' : 'Submit Rating'}
                          </button>
                      </div>
                  )}
              </div>

              {/* Achievements Unlocked Section */}
              {quizResults?.achievements && quizResults.achievements.length > 0 && ( <div className={`${isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'} rounded-2xl p-6 sm:p-8 mb-8 border shadow-md`}> {/* ... */} </div> )}

              {/* Detailed Answer Review */}
              <div className="space-y-6">
                 {quizData?.questions.map((question, index) => {
                    const userAnswerId = answers[question.id];
                    const isCorrect = userAnswerId === question.correctAnswer;
                    return (
                        <div key={question.id} className={`border rounded-xl p-4 sm:p-6 ${isDarkMode ? 'bg-gray-850 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'} hover:shadow-md transition-shadow duration-300`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} text-lg`}>Question {index + 1}</span>
                            {isCorrect ? ( <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200'} border`}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>Correct</span> )
                             : ( <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-red-900/50 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-200'} border`}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>Incorrect</span> )}
                          </div>
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{question.text}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {question.options.map((option) => (
                              <div key={option.id} className={`border px-4 py-3 rounded-lg flex items-center text-sm transition-all duration-200 ${ option.id === question.correctAnswer ? (isDarkMode ? 'bg-green-900/40 border-green-700 ring-1 ring-green-600' : 'bg-green-50 border-green-300 ring-1 ring-green-300') : option.id === userAnswerId ? (isDarkMode ? 'bg-red-900/40 border-red-700 ring-1 ring-red-600' : 'bg-red-50 border-red-300 ring-1 ring-red-300') : (isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50') }`}>
                                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs font-semibold ${ option.id === question.correctAnswer ? 'bg-green-500 text-white' : option.id === userAnswerId ? 'bg-red-500 text-white' : (isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700') }`}>
                                  {option.id === question.correctAnswer ? '✔' : (option.id === userAnswerId ? '✖' : '•')}
                                </div>
                                <span className={`${ option.id === question.correctAnswer ? (isDarkMode ? 'text-green-300 font-medium' : 'text-green-800 font-medium') : option.id === userAnswerId ? (isDarkMode ? 'text-red-300 font-medium line-through' : 'text-red-800 font-medium line-through') : (isDarkMode ? 'text-gray-300' : 'text-gray-700') }`}>
                                  {option.text}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className={`mt-4 text-sm rounded-lg p-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-100'} border`}>
                            <p className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-1`}>Explanation:</p>
                            <p className={`${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>{question.explanation}</p>
                          </div>
                        </div>
                    );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                 <Link href="/quiz" className={`w-full sm:w-auto px-6 py-3 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'} rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm`}>
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
               <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden mb-6 sticky top-4 z-20 border`}>
                    <div className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex-wrap gap-y-3`}>
                        <div className="flex items-center">
                          <div className={`${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} p-2 rounded-lg mr-3`}><svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{/* Subject Icon */}</svg></div>
                          <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Subject</p><p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{quizData.subject}</p></div>
                        </div>
                        <div className="flex items-center">
                          <div className={`${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'} p-2 rounded-lg mr-3`}><svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{/* Question Icon */}</svg></div>
                          <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Questions</p><p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{quizData.totalQuestions} total</p></div>
                        </div>
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${ timeRemaining < 60 ? (isDarkMode ? 'bg-red-900/50' : 'bg-red-100') : timeRemaining < 180 ? (isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100') : (isDarkMode ? 'bg-green-900/50' : 'bg-green-100') }`}><svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${ timeRemaining < 60 ? (isDarkMode ? 'text-red-400 animate-pulse' : 'text-red-600 animate-pulse') : timeRemaining < 180 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') : (isDarkMode ? 'text-green-400' : 'text-green-600') }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{/* Timer Icon */}</svg></div>
                          <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Remaining</p><p className={`font-bold text-lg ${ timeRemaining < 60 ? (isDarkMode ? 'text-red-400' : 'text-red-600') : timeRemaining < 180 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') : (isDarkMode ? 'text-green-400' : 'text-green-600') }`}>{formatTime(timeRemaining)}</p></div>
                        </div>
                    </div>
                   {/* Progress Bar */}
                   <div className="px-4 sm:px-6 py-4">
                     <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}><span className="font-medium">Question {currentQuestion + 1} of {quizData.questions.length}</span><span>{Math.round(progress)}% complete</span></div>
                     <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 overflow-hidden`}><div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div></div>
                   </div>
               </div>

               {/* Current Question Card */}
               <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden mb-6 transition-opacity duration-300 border ${animateQuestion ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="px-4 sm:px-6 py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'} mb-4 shadow-sm`}>{quizData.subject} Question</div>
                    <h2 className={`text-xl font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-6`}>{quizData.questions[currentQuestion]?.text || 'Loading question...'}</h2>
                   {/* Options */}
                   <div className="space-y-3 mb-6">
                     {quizData.questions[currentQuestion]?.options.map((option, index) => (
                       <div key={option.id} onClick={() => handleSelectOption(option.id)} className={`border px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center group ${ selectedOption === option.id ? (isDarkMode ? 'border-purple-600 bg-purple-900/30 ring-purple-700' : 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 ring-purple-300') + ' ring-2 shadow-md' : (isDarkMode ? 'border-gray-700 hover:border-purple-700 hover:bg-gray-750' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50') + ' hover:shadow-sm' }`}>
                         <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-medium shadow-sm transition-all duration-200 ${ selectedOption === option.id ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white scale-110' : (isDarkMode ? 'bg-gray-600 text-gray-300 group-hover:bg-purple-700 group-hover:text-purple-100' : 'bg-gray-200 text-gray-700 group-hover:bg-purple-200 group-hover:text-purple-800') }`}>
                           {index + 1}
                         </div>
                         <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} ${selectedOption === option.id ? (isDarkMode ? 'font-semibold text-purple-300' : 'font-semibold text-purple-900') : (isDarkMode ? 'group-hover:text-purple-300' : 'group-hover:text-purple-900')}`}>{option.text}</span>
                       </div>
                     ))}
                   </div>
                   {/* Explanation Area */}
                   {showExplanation && (
                     <div className={`mt-6 p-6 rounded-xl border ${isCurrentSelectionCorrect ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200') : (isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')} animate-fadeIn`}>
                       <div className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${ isCurrentSelectionCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white' }`}>{/* Icon */}</div>
                            <div className="ml-4">
                                <h3 className={`text-lg font-semibold ${isCurrentSelectionCorrect ? (isDarkMode ? 'text-green-300' : 'text-green-800') : (isDarkMode ? 'text-red-300' : 'text-red-800')}`}>{isCurrentSelectionCorrect ? 'Correct!' : 'Incorrect'}</h3>
                                <p className={`mt-1 text-sm ${isCurrentSelectionCorrect ? (isDarkMode ? 'text-green-200' : 'text-green-700') : (isDarkMode ? 'text-red-200' : 'text-red-700')}`}>{quizData.questions[currentQuestion]?.explanation}</p>
                            </div>
                       </div>
                     </div>
                   )}
                 </div>
                 {/* Footer with Navigation/Submit Buttons */}
                 <div className={`px-4 sm:px-6 py-4 ${isDarkMode ? 'bg-gray-850 border-gray-700' : 'bg-gray-50 border-gray-100'} border-t flex flex-col sm:flex-row justify-between items-center gap-3`}>
                    <button onClick={handlePrevious} disabled={currentQuestion === 0 || animateQuestion || loading} className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-sm ${ currentQuestion === 0 || animateQuestion || loading ? (isDarkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') : (isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow') }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>Previous
                    </button>
                   <div className="flex w-full sm:w-auto space-x-3">
                     {!showExplanation && selectedOption && ( <button onClick={handleCheckAnswer} disabled={animateQuestion || loading} className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Check Answer</button> )}
                     {currentQuestion < quizData.questions.length - 1 ? (
                       <button onClick={handleNext} disabled={!selectedOption || animateQuestion || loading} className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform ${ !selectedOption || animateQuestion || loading ? (isDarkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:scale-105' }`}>
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
               <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl overflow-hidden border`}>
                  <div className={`px-4 sm:px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex flex-col sm:flex-row justify-between items-center gap-2`}>
                        <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} flex items-center text-base`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">{/* Nav Icon */}</svg>Question Navigation</h3>
                        <div className={`flex items-center space-x-3 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mr-1 shadow-inner"></div><span>Current</span></div>
                          <div className="flex items-center"><div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-purple-800/60' : 'bg-purple-200'} mr-1 shadow-inner`}></div><span>Answered</span></div>
                          <div className="flex items-center"><div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} mr-1 shadow-inner`}></div><span>Unanswered</span></div>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                        {quizData.questions.map((question, index) => ( <button key={question.id} onClick={() => { if (animateQuestion) return; setAnimateQuestion(true); setTimeout(() => { setCurrentQuestion(index); setSelectedOption(answers[question.id] || ""); setShowExplanation(false); setAnimateQuestion(false); }, 300); }} className={`w-full h-10 rounded-lg font-medium text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${ currentQuestion === index ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white transform scale-110 ring-purple-400 z-10 relative' : answers[question.id] ? (isDarkMode ? 'bg-purple-800/50 text-purple-300 hover:bg-purple-700/50 ring-purple-700' : 'bg-purple-100 text-purple-800 hover:bg-purple-200 ring-purple-300') : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 ring-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 ring-gray-300') }`} aria-label={`Go to question ${index + 1}`}>{index + 1}</button> ))}
                        </div>
                    </div>
                    <div className={`px-4 sm:px-6 py-4 ${isDarkMode ? 'bg-gray-850 border-gray-700' : 'bg-gray-50 border-gray-100'} border-t`}>
                        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} gap-2`}>
                          <div className="font-medium">Answered: {Object.keys(answers).length} / {quizData.questions.length}</div>
                          <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">{/* Info Icon */}</svg><span>Use 'Check Answer' to see explanations before submitting.</span></div>
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