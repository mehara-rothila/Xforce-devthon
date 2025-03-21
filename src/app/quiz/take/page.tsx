'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock quiz data
const quizData = {
  title: "Mechanics - Forces and Motion",
  subject: "Physics",
  totalQuestions: 10,
  timeLimit: 15, // minutes
  questions: [
    {
      id: 1,
      text: "A force of 20N acts on a mass of 4kg. What is the resulting acceleration?",
      options: [
        { id: "a", text: "2 m/s²" },
        { id: "b", text: "5 m/s²" },
        { id: "c", text: "8 m/s²" },
        { id: "d", text: "10 m/s²" },
      ],
      correctAnswer: "b",
      explanation: "Using Newton's Second Law: F = ma, we can rearrange to a = F/m = 20N/4kg = 5 m/s²."
    },
    {
      id: 2,
      text: "A car accelerates from rest to 20 m/s in 10 seconds. What is its acceleration?",
      options: [
        { id: "a", text: "0.5 m/s²" },
        { id: "b", text: "2 m/s²" },
        { id: "c", text: "5 m/s²" },
        { id: "d", text: "10 m/s²" },
      ],
      correctAnswer: "b",
      explanation: "Acceleration is the change in velocity over time: a = Δv/Δt = (20 m/s - 0 m/s)/10s = 2 m/s²."
    },
    {
      id: 3,
      text: "Which of the following is NOT a vector quantity?",
      options: [
        { id: "a", text: "Velocity" },
        { id: "b", text: "Force" },
        { id: "c", text: "Displacement" },
        { id: "d", text: "Energy" },
      ],
      correctAnswer: "d",
      explanation: "Energy is a scalar quantity, as it has magnitude but no direction. Velocity, force, and displacement are all vector quantities."
    },
  ]
};

export default function TakeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit * 60);
  const [animateQuestion, setAnimateQuestion] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isSubmitted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      setIsSubmitted(true);
    }
  }, [timeRemaining, isSubmitted]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOption(optionId);
      setAnswers({
        ...answers,
        [quizData.questions[currentQuestion].id]: optionId
      });
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setAnimateQuestion(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(answers[quizData.questions[currentQuestion + 1]?.id] || "");
        setShowExplanation(false);
        setAnimateQuestion(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setAnimateQuestion(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedOption(answers[quizData.questions[currentQuestion - 1]?.id] || "");
        setShowExplanation(false);
        setAnimateQuestion(false);
      }, 300);
    }
  };

  // Handle check answer
  const handleCheckAnswer = () => {
    if (selectedOption) {
      setShowExplanation(true);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      score: correct,
      total: quizData.questions.length,
      percentage: Math.round((correct / quizData.questions.length) * 100)
    };
  };

  const currentQ = quizData.questions[currentQuestion];
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 pt-10 pb-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[15%] text-white text-2xl animate-float" style={{ animationDuration: '8s' }}>❓</div>
          <div className="absolute top-[30%] left-[10%] text-white text-xl animate-pulse-slow" style={{ animationDuration: '7s' }}>F = ma</div>
          <div className="absolute top-[65%] right-[18%] text-white text-xl animate-float" style={{ animationDuration: '10s' }}>E = mc²</div>
          <div className="absolute top-[25%] left-[30%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '15s' }}>∫</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl animate-pulse-slow" style={{ animationDuration: '14s' }}>⚛️</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
                {quizData.title}
              </h1>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-8 pb-12">
                {isSubmitted ? (
          // Results screen
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform">
            <div className="px-6 sm:px-8 py-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-4 text-white text-3xl">
                  🏆
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Quiz Completed!</h2>
                <p className="text-gray-600">You've completed the {quizData.title} quiz</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-purple-100">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md mb-4">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                      {score.percentage}%
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">You got <span className="font-semibold">{score.score}</span> out of <span className="font-semibold">{score.total}</span> questions correct</p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                      <span>Incorrect</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                      <div 
                        style={{ width: `${score.percentage}%` }} 
                        className="animate-widthGrow shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-xl p-6 bg-white hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-medium text-gray-800 text-lg">Question {index + 1}</span>
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
                    <p className="text-gray-700 mb-4">{question.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {question.options.map((option) => (
                        <div 
                          key={option.id}
                          className={`border px-4 py-3 rounded-lg flex items-center ${
                            option.id === question.correctAnswer
                              ? 'bg-green-50 border-green-200'
                              : option.id === answers[question.id] && option.id !== question.correctAnswer
                              ? 'bg-red-50 border-red-200'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className={`w-7 h-7 flex items-center justify-center rounded-full mr-3 text-xs font-medium ${
                            option.id === question.correctAnswer
                              ? 'bg-green-500 text-white'
                              : option.id === answers[question.id] && option.id !== question.correctAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {option.id.toUpperCase()}
                          </div>
                          <span className={`text-sm ${
                            option.id === question.correctAnswer
                              ? 'text-green-800 font-medium'
                              : option.id === answers[question.id] && option.id !== question.correctAnswer
                              ? 'text-red-800 font-medium'
                              : 'text-gray-700'
                          }`}>
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
                ))}
              </div>
              
              <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/quiz" 
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to Quizzes
                </Link>
                <Link 
                  href="/dashboard" 
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-md transform hover:scale-105"
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
          // Quiz interface
          <>
            {/* Quiz information and timer card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
                <div className="mb-4 sm:mb-0 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium text-gray-800">{quizData.subject}</p>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-0 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-medium text-gray-800">{quizData.totalQuestions} total</p>
                  </div>
                </div>
                
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
                        ? 'text-red-600' 
                        : timeRemaining < 180 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Remaining</p>
                    <p className={`font-bold ${
                      timeRemaining < 60 
                        ? 'text-red-600' 
                        : timeRemaining < 180 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                    }`}>{formatTime(timeRemaining)}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
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
            
            {/* Question card */}
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-6 transition-opacity duration-300 ${animateQuestion ? 'opacity-0' : 'opacity-100'}`}>
              <div className="px-6 py-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                  {quizData.subject} Question
                </div>
                
                <h2 className="text-xl font-medium text-gray-900 mb-6">{currentQ.text}</h2>
                
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`border px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedOption === option.id 
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-medium shadow-sm transition-all duration-200 ${
                          selectedOption === option.id 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {option.id.toUpperCase()}
                        </div>
                        <span className={`text-gray-800 ${selectedOption === option.id ? 'font-medium' : ''}`}>{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {showExplanation && (
                  <div className={`mt-6 p-6 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'} animate-fadeIn`}>
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
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
                      <div className="ml-4">
                        <h3 className={`text-lg font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </h3>
                        <p className="mt-2 text-sm">{currentQ.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <div className="flex space-x-3">
                  {!showExplanation && selectedOption && (
                    <button
                      onClick={handleCheckAnswer}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 shadow-md"
                    >
                      Check Answer
                    </button>
                  )}
                  
                  {currentQuestion < quizData.questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={!selectedOption}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                        !selectedOption
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:translate-x-1'
                      }`}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-colors duration-200 shadow-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Question navigation */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Question Navigation
                </h3>
                <div className="flex items-center text-sm font-medium text-purple-600">
                  <div className="flex mr-4">
                    <div className="w-3 h-3 rounded-full bg-purple-600 mr-1"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex mr-4">
                    <div className="w-3 h-3 rounded-full bg-purple-200 mr-1"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex">
                    <div className="w-3 h-3 rounded-full bg-gray-200 mr-1"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {quizData.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => {
                        setAnimateQuestion(true);
                        setTimeout(() => {
                          setCurrentQuestion(index);
                          setSelectedOption(answers[question.id] || "");
                          setShowExplanation(false);
                          setAnimateQuestion(false);
                        }, 300);
                      }}
                      className={`w-full h-10 rounded-lg font-medium text-sm shadow-sm transition-all duration-200 ${
                        currentQuestion === index
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white transform scale-110'
                          : answers[question.id]
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quiz information */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                  <div className="mb-2 sm:mb-0">
                    Answered: {Object.keys(answers).length} / {quizData.questions.length}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>You can check your answers before submitting the quiz</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}