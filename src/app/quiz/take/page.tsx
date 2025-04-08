'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
// Assuming 'api' is correctly configured in this path
import api from '../../../utils/api';

export default function TakeQuiz() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = searchParams.get('id');

  // State variables for quiz data, loading status, errors, etc.
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // Effect to fetch quiz data when the component mounts or quizId changes
  useEffect(() => {
    const fetchQuiz = async () => {
      // Check if quizId is available
      if (!quizId) {
        setError("No quiz ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch quiz data from the API
        const response = await api.quizzes.getById(quizId);
        const quiz = response.data.data.quiz;

        // Transform the raw quiz data into the format expected by the component
        const formattedQuiz = {
          title: quiz.title,
          subject: quiz.subject.name,
          totalQuestions: quiz.questions.length,
          timeLimit: quiz.timeLimit || 15, // Default time limit if not provided
          questions: quiz.questions.map((q, index) => ({
            id: q._id,
            text: q.text,
            options: q.options.map((opt, i) => ({
              id: opt._id || String.fromCharCode(97 + i), // Generate option IDs (a, b, c, d) if not present
              text: opt.text,
              isCorrect: opt.isCorrect
            })),
            // Determine the correct answer ID, falling back to generated ID if needed
            correctAnswer: q.correctAnswer ||
              (q.options.find(o => o.isCorrect) ?
                q.options.find(o => o.isCorrect)._id ||
                String.fromCharCode(97 + q.options.findIndex(o => o.isCorrect)) : null),
            explanation: q.explanation || "No explanation provided." // Default explanation
          }))
        };

        // Update state with fetched and formatted data
        setQuizData(formattedQuiz);
        setTimeRemaining(formattedQuiz.timeLimit * 60); // Set timer in seconds
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]); // Dependency array ensures this runs when quizId changes

  // Effect to handle the countdown timer
  useEffect(() => {
    // Don't run timer if quiz isn't loaded, already submitted, or time is up
    if (!quizData || isSubmitted || timeRemaining <= 0) return;

    // Set a timeout to decrement timeRemaining every second
    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    // Auto-submit if time runs out
    if (timeRemaining === 0) {
        // Consider calling handleSubmit directly here if auto-submit on time expiry is desired
        // handleSubmit(); // Uncomment if you want to auto-submit
        setIsSubmitted(true); // Mark as submitted to show results screen
    }

    // Cleanup function to clear the timeout when the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [timeRemaining, isSubmitted, quizData]); // Dependencies for the timer effect

  // Helper function to format seconds into MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate the quiz progress percentage
  const progress = quizData ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0;

  // Handler for selecting an answer option
  const handleSelectOption = (optionId) => {
    // Only allow selection if the quiz is not submitted
    if (!isSubmitted && quizData) {
      setSelectedOption(optionId);
      // Store the selected answer for the current question
      setAnswers({
        ...answers,
        [quizData.questions[currentQuestion].id]: optionId
      });
    }
  };

  // Handler for navigating to the next question
  const handleNext = () => {
    // Check if there are more questions
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setAnimateQuestion(true); // Trigger animation
      setTimeout(() => {
        const nextQuestionIndex = currentQuestion + 1;
        setCurrentQuestion(nextQuestionIndex);
        // Pre-fill selected option if user previously answered this question
        setSelectedOption(answers[quizData.questions[nextQuestionIndex]?.id] || "");
        setShowExplanation(false); // Hide explanation for the new question
        setAnimateQuestion(false); // End animation
      }, 300); // Animation duration
    }
  };

  // Handler for navigating to the previous question
  const handlePrevious = () => {
    // Check if not on the first question
    if (currentQuestion > 0) {
      setAnimateQuestion(true); // Trigger animation
      setTimeout(() => {
        const prevQuestionIndex = currentQuestion - 1;
        setCurrentQuestion(prevQuestionIndex);
        // Pre-fill selected option if user previously answered this question
        setSelectedOption(answers[quizData?.questions[prevQuestionIndex]?.id] || "");
        setShowExplanation(false); // Hide explanation
        setAnimateQuestion(false); // End animation
      }, 300); // Animation duration
    }
  };

  // Handler to show the explanation for the current question
  const handleCheckAnswer = () => {
    // Only show explanation if an option is selected
    if (selectedOption) {
      setShowExplanation(true);
    }
  };

  // Handler for submitting the quiz answers
  const handleSubmit = async () => {
    try {
      setLoading(true); // Show loading indicator during submission

      // Format the answers into the structure expected by the API
      const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answerId
      }));

      // Call the API to submit the quiz attempt
      const response = await api.quizzes.submitAttempt(quizId, formattedAnswers);
      setQuizResults(response.data.data); // Store the results from the API
      setIsSubmitted(true); // Mark the quiz as submitted
      setLoading(false); // Hide loading indicator
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
      setLoading(false); // Hide loading indicator even on error
    }
  };

  // Function to calculate the score locally (used before API results are available or as a fallback)
  const calculateScore = () => {
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
      total: total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  };

  // --- Render Logic ---

  // Display loading indicator while fetching initial data
  if (loading && !quizData && !error) { // Added !error check
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Display error message if fetching failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            {/* Error Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <Link
              href="/quiz" // Link back to the main quiz page
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Return to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Display message if quiz data couldn't be loaded (but no specific error occurred)
  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-6">The requested quiz could not be found or loaded.</p>
          <Link
            href="/quiz" // Link back to the main quiz page
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Browse Quizzes
          </Link>
        </div>
      </div>
    );
  }

  // --- Main Quiz UI ---
  const currentQ = quizData.questions[currentQuestion]; // Get the current question object
  // Check if the selected option for the current question is correct
  const isCorrect = selectedOption === currentQ.correctAnswer;
  // Determine the score to display (use API results if available, otherwise calculate locally)
  const score = quizResults ? {
    score: quizResults.score,
    total: quizResults.totalPoints, // Assuming API returns totalPoints
    percentage: quizResults.percentageScore // Assuming API returns percentageScore
  } : calculateScore(); // Fallback to local calculation


  return (
    // Main container with gradient background and relative positioning for animations
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-colors duration-300 relative overflow-hidden">

      {/* Animated Background Elements - Decorative */}
      {/* These elements are positioned absolutely and have animations applied via CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
         {/* Mathematical symbols */}
         <div className="absolute top-[7%] left-[13%] text-purple-500 dark:text-purple-400 text-9xl opacity-75 floating-icon">∑</div>
         <div className="absolute top-[33%] right-[17%] text-blue-500 dark:text-blue-400 text-10xl opacity-70 floating-icon-reverse">π</div>
         <div className="absolute top-[61%] left-[27%] text-green-500 dark:text-green-400 text-8xl opacity-75 floating-icon-slow">∞</div>
         <div className="absolute top-[19%] right-[38%] text-red-500 dark:text-red-400 text-11xl opacity-65 floating-icon">⚛</div>
         <div className="absolute top-[77%] right-[23%] text-yellow-500 dark:text-yellow-400 text-9xl opacity-70 floating-icon-slow">𝜙</div>
         <div className="absolute bottom-[31%] left-[8%] text-indigo-500 dark:text-indigo-400 text-10xl opacity-70 floating-icon-reverse">∫</div>
         <div className="absolute bottom-[12%] right-[42%] text-teal-500 dark:text-teal-400 text-9xl opacity-75 floating-icon">≈</div>
         <div className="absolute bottom-[47%] right-[9%] text-pink-500 dark:text-pink-400 text-8xl opacity-65 floating-icon-slow">±</div>
         {/* Additional math symbols */}
         <div className="absolute top-[23%] left-[54%] text-fuchsia-500 dark:text-fuchsia-400 text-8xl opacity-70 floating-icon">Δ</div>
         <div className="absolute top-[44%] left-[38%] text-emerald-500 dark:text-emerald-400 text-7xl opacity-65 floating-icon-slow">λ</div>
         <div className="absolute top-[81%] left-[67%] text-cyan-500 dark:text-cyan-400 text-9xl opacity-70 floating-icon-reverse">θ</div>
         <div className="absolute top-[29%] left-[83%] text-rose-500 dark:text-rose-400 text-8xl opacity-65 floating-icon">α</div>
         <div className="absolute bottom-[63%] left-[6%] text-amber-500 dark:text-amber-400 text-9xl opacity-70 floating-icon-slow">β</div>
         <div className="absolute bottom-[19%] left-[71%] text-purple-500 dark:text-purple-400 text-8xl opacity-65 floating-icon-reverse">μ</div>
         <div className="absolute bottom-[28%] left-[32%] text-blue-500 dark:text-blue-400 text-7xl opacity-70 floating-icon">ω</div>
         {/* More symbols */}
         <div className="absolute top-[52%] left-[18%] text-sky-500 dark:text-sky-400 text-8xl opacity-60 floating-icon-slow">γ</div>
         <div className="absolute top-[37%] right-[29%] text-lime-500 dark:text-lime-400 text-9xl opacity-55 floating-icon">σ</div>
         <div className="absolute bottom-[42%] right-[37%] text-orange-500 dark:text-orange-400 text-10xl opacity-50 floating-icon-reverse">δ</div>
         <div className="absolute top-[73%] right-[13%] text-violet-500 dark:text-violet-400 text-8xl opacity-60 floating-icon-slow">ρ</div>
         {/* Science formulas */}
         <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
         <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
         <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
         <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>
         <div className="absolute bottom-[53%] left-[24%] text-emerald-500 dark:text-emerald-400 text-5xl opacity-65 floating-icon-slow">v=λf</div>
         <div className="absolute top-[86%] left-[11%] text-sky-500 dark:text-sky-400 text-5xl opacity-55 floating-icon-reverse">C₆H₁₂O₆</div>
         <div className="absolute top-[68%] right-[31%] text-amber-500 dark:text-amber-400 text-6xl opacity-60 floating-icon">E=hf</div>
         {/* Science icons (SVGs) */}
         <div className="absolute top-[41%] left-[8%] opacity-60 floating-icon-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
         </div>
         <div className="absolute top-[17%] right-[7%] opacity-60 floating-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
         </div>
         <div className="absolute bottom-[7%] left-[36%] opacity-60 floating-icon-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </div>
         <div className="absolute top-[54%] right-[28%] opacity-60 floating-icon-slow">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
             </svg>
         </div>
         <div className="absolute top-[23%] left-[67%] opacity-60 floating-icon">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
             </svg>
         </div>
         <div className="absolute bottom-[37%] right-[6%] opacity-55 floating-icon-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
         </div>
         <div className="absolute top-[71%] left-[13%] opacity-55 floating-icon-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
         </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-10 pb-24 overflow-hidden">
        {/* Animated elements within the header */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>❓</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>F = ma</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>E = mc²</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>∫</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>⚛️</div>
        </div>

        {/* Header Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            {/* Quiz Title and Info */}
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                {quizData.title}
              </h1>
              <p className="mt-1 text-lg text-purple-100">
                {quizData.subject} • {quizData.totalQuestions} questions
              </p>
            </div>
            {/* Back Button */}
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

      {/* Main Content Area (Quiz or Results) */}
      {/* Added negative margin-top to pull content over the header slightly */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-10">
        {isSubmitted ? (
          // --- Results Screen ---
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform animate-fadeInUp">
            <div className="px-4 sm:px-8 py-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-4 text-white text-3xl shadow-lg">
                  🏆 {/* Trophy Emoji */}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Quiz Completed!</h2>
                <p className="text-gray-600">You've completed the {quizData.title} quiz.</p>
              </div>

              {/* Score Summary Card */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8 border border-purple-100 shadow-inner">
                <div className="text-center">
                  {/* Score Percentage Circle */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md mb-4 ring-2 ring-purple-200">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                      {score.percentage}%
                    </div>
                  </div>
                  {/* Score Text */}
                  <p className="text-gray-700 mb-4 text-lg">You got <span className="font-semibold text-purple-700">{score.score}</span> out of <span className="font-semibold text-purple-700">{score.total}</span> questions correct.</p>

                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
                      <span>Incorrect</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                      <div
                        style={{ width: `${score.percentage}%` }}
                        // Added animate-widthGrow class for animation
                        className="animate-widthGrow shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-1000 ease-out">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-6">
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-xl p-4 sm:p-6 bg-white hover:shadow-lg transition-shadow duration-300">
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-medium text-gray-800 text-lg">Question {index + 1}</span>
                      {/* Correct/Incorrect Badge */}
                      {answers[question.id] === question.correctAnswer ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                          Incorrect
                        </span>
                      )}
                    </div>
                    {/* Question Text */}
                    <p className="text-gray-700 mb-4">{question.text}</p>
                    {/* Options Review */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          // Dynamic classes based on correctness and user's answer
                          className={`border px-4 py-3 rounded-lg flex items-center text-sm ${
                            option.id === question.correctAnswer
                              ? 'bg-green-50 border-green-300 ring-1 ring-green-300' // Highlight correct answer
                              : option.id === answers[question.id] // Check if this was the user's incorrect answer
                              ? 'bg-red-50 border-red-300 ring-1 ring-red-300' // Highlight user's incorrect answer
                              : 'border-gray-200 bg-gray-50' // Default for other options
                          }`}
                        >
                          {/* Option Indicator (A, B, C, D) */}
                          <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs font-semibold ${
                            option.id === question.correctAnswer
                              ? 'bg-green-500 text-white'
                              : option.id === answers[question.id]
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-300 text-gray-700'
                          }`}>
                            {/* Display A, B, C, D or fallback */}
                            {typeof option.id === 'string' && option.id.length === 1 ? option.id.toUpperCase() : '?'}
                          </div>
                          {/* Option Text */}
                          <span className={`${
                            option.id === question.correctAnswer
                              ? 'text-green-800 font-medium'
                              : option.id === answers[question.id]
                              ? 'text-red-800 font-medium'
                              : 'text-gray-700'
                          }`}>
                            {option.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Explanation */}
                    <div className="mt-4 text-sm rounded-lg p-4 bg-blue-50 border border-blue-100">
                      <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                      <p className="text-blue-700">{question.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/quiz"
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to Quizzes
                </Link>
                <Link
                  href="/dashboard" // Link to the user's dashboard
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-md transform hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 01-1 1H8a1 1 0 01-1-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1h2" />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // --- Quiz Taking Interface ---
          <>
            {/* Top Info Card (Subject, Questions, Timer, Progress) */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 sticky top-4 z-20"> {/* Made sticky */}
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 flex-wrap gap-y-3">
                {/* Subject */}
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> {/* Book icon */}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium text-gray-800">{quizData.subject}</p>
                  </div>
                </div>
                {/* Question Count */}
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Question mark icon */}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-medium text-gray-800">{quizData.totalQuestions} total</p>
                  </div>
                </div>
                {/* Timer */}
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    timeRemaining < 60
                      ? 'bg-red-100'
                      : timeRemaining < 180
                      ? 'bg-yellow-100'
                      : 'bg-green-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                      timeRemaining < 60
                        ? 'text-red-600 animate-pulse' // Add pulse animation when time is low
                        : timeRemaining < 180
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Clock icon */}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Remaining</p>
                    <p className={`font-bold text-lg ${ // Made font larger
                      timeRemaining < 60
                        ? 'text-red-600'
                        : timeRemaining < 180
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>{formatTime(timeRemaining)}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4 sm:px-6 py-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">Question {currentQuestion + 1} of {quizData.questions.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transition-opacity duration-300 ${animateQuestion ? 'opacity-0' : 'opacity-100'}`}>
              <div className="px-4 sm:px-6 py-6">
                {/* Subject Tag */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4 shadow-sm">
                  {quizData.subject} Question
                </div>

                {/* Question Text */}
                <h2 className="text-xl font-medium text-gray-900 mb-6">{currentQ.text}</h2>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      // Dynamic classes for selected/hover states
                      className={`border px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center group ${
                        selectedOption === option.id
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 ring-2 ring-purple-300 shadow-md' // Enhanced selected style
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm' // Hover effect
                      }`}
                    >
                      {/* Option Indicator (A, B, C, D) */}
                      <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-medium shadow-sm transition-all duration-200 ${
                        selectedOption === option.id
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white scale-110' // Pop effect when selected
                          : 'bg-gray-200 text-gray-700 group-hover:bg-purple-200 group-hover:text-purple-800' // Change on hover
                      }`}>
                        {/* Display A, B, C, D or fallback */}
                        {typeof option.id === 'string' && option.id.length === 1 ? option.id.toUpperCase() : option.id.slice(0, 1).toUpperCase()}
                      </div>
                      {/* Option Text */}
                      <span className={`text-gray-800 ${selectedOption === option.id ? 'font-semibold text-purple-900' : 'group-hover:text-purple-900'}`}>{option.text}</span> {/* Change text color on hover */}
                    </div>
                  ))}
                </div>

                {/* Explanation Section (Conditional) */}
                {showExplanation && (
                  <div className={`mt-6 p-6 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-fadeIn`}>
                    <div className="flex items-start">
                      {/* Icon (Check or Cross) */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {isCorrect ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      {/* Explanation Text */}
                      <div className="ml-4">
                        <h3 className={`text-lg font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </h3>
                        <p className={`mt-1 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{currentQ.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0 || animateQuestion} // Disable during animation
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-sm ${
                    currentQuestion === 0 || animateQuestion
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Check Answer / Next / Submit Buttons */}
                <div className="flex w-full sm:w-auto space-x-3">
                  {/* Check Answer Button (Conditional) */}
                  {!showExplanation && selectedOption && (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={animateQuestion} // Disable during animation
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  )}

                  {/* Next Button (Conditional) */}
                  {currentQuestion < quizData.questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={!selectedOption || animateQuestion} // Disable if no option selected or during animation
                      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform ${
                        !selectedOption || animateQuestion
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:scale-105' // Added hover scale
                      }`}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    // Submit Button (Last Question)
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedOption || animateQuestion || loading} // Disable if no option, animating, or submitting
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                         <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                         </svg>
                       )}
                      {loading ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Navigation Panel */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                {/* Title */}
                <h3 className="font-medium text-gray-800 flex items-center text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /> {/* List icon */}
                  </svg>
                  Question Navigation
                </h3>
                {/* Legend */}
                <div className="flex items-center space-x-3 text-xs font-medium text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 mr-1 shadow-inner"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-200 mr-1 shadow-inner"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-200 mr-1 shadow-inner"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
              {/* Navigation Buttons Grid */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {quizData.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => {
                        // Don't navigate if animating
                        if (animateQuestion) return;
                        setAnimateQuestion(true);
                        setTimeout(() => {
                          setCurrentQuestion(index);
                          setSelectedOption(answers[question.id] || "");
                          setShowExplanation(false);
                          setAnimateQuestion(false);
                        }, 300); // Match animation duration
                      }}
                      // Dynamic classes for current, answered, unanswered states
                      className={`w-full h-10 rounded-lg font-medium text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        currentQuestion === index
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white transform scale-110 ring-purple-400 z-10 relative' // Highlight current question
                          : answers[question.id]
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 ring-purple-300' // Style for answered questions
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 ring-gray-300' // Style for unanswered questions
                      }`}
                      aria-label={`Go to question ${index + 1}`} // Accessibility
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Info */}
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
                  <div className="font-medium">
                    Answered: {Object.keys(answers).length} / {quizData.questions.length}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> {/* Info icon */}
                    </svg>
                    <span>Use 'Check Answer' to see explanations before submitting.</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Global styles using styled-jsx */}
      <style jsx global>{`
        /* Custom text sizes */
        .text-10xl { font-size: 9rem; line-height: 1; }
        .text-11xl { font-size: 10rem; line-height: 1; }

        /* Background floating icons animations */
        .floating-icon { animation: float 6s ease-in-out infinite; }
        .floating-icon-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .floating-icon-slow { animation: float 10s ease-in-out infinite; }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); } /* Increased float distance */
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); } /* Increased float distance */
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; } /* Adjusted opacity */
          50% { opacity: 0.4; }
        }

        /* Fade-in animations */
        .animate-fadeIn {
          animation: fadeInAnimation 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
           animation: fadeInUpAnimation 0.6s ease-out forwards; /* Slightly longer duration */
        }

        @keyframes fadeInAnimation {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUpAnimation {
          from {
            opacity: 0;
            transform: translateY(25px); /* Increased distance */
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Progress bar animation */
        .animate-widthGrow {
           /* The animation is now handled by transition-all on the element itself */
           /* animation: widthGrow 1s ease-out forwards; */
        }

        /* --- FIX WAS HERE --- */
        /* Keyframes need proper closing braces */
        @keyframes widthGrow {
            from { width: 0%; }
            to { width: 100%; } /* Added closing brace */
        } /* Added closing brace */
        /* --- END FIX --- */


        /* Ensure sticky positioning works */
        .sticky {
           position: -webkit-sticky; /* Safari */
           position: sticky;
        }

        /* Add a subtle shadow to the sticky header when scrolled */
        /* This requires knowing the scroll position, typically done with JS, */
        /* or you can apply it permanently if desired */
        /* .sticky.scrolled { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); } */

      `}</style>
    </div>
  );
}
