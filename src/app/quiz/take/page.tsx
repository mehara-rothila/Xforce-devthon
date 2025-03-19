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
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {isSubmitted ? (
        // Results screen
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 transform animate-fadeIn">
          <div className="px-8 py-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Quiz Completed!</h2>
              <p className="text-gray-600 mt-2">You've completed the {quizData.title} quiz</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-700 mb-2">{score.percentage}%</div>
                <p className="text-gray-600">You got {score.score} out of {score.total} questions correct</p>
              </div>
              
              <div className="mt-6">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-purple-200">
                    <div 
                      style={{ width: `${score.percentage}%` }} 
                      className="animate-widthGrow shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {quizData.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">Question {index + 1}</span>
                    {answers[question.id] === question.correctAnswer ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Correct</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Incorrect</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{question.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {question.options.map((option) => (
                      <div 
                        key={option.id}
                        className={`border px-3 py-2 rounded-lg flex items-center ${
                          option.id === question.correctAnswer
                            ? 'bg-green-50 border-green-200'
                            : option.id === answers[question.id] && option.id !== question.correctAnswer
                            ? 'bg-red-50 border-red-200'
                            : 'border-gray-200'
                        }`}
                      >
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs font-medium ${
                          option.id === question.correctAnswer
                            ? 'bg-green-500 text-white'
                            : option.id === answers[question.id] && option.id !== question.correctAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {option.id.toUpperCase()}
                        </span>
                        <span className={`text-sm ${
                          option.id === question.correctAnswer
                            ? 'text-green-800'
                            : option.id === answers[question.id] && option.id !== question.correctAnswer
                            ? 'text-red-800'
                            : 'text-gray-700'
                        }`}>
                          {option.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Explanation:</p>
                    <p className="text-gray-600">{question.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/quiz" className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Back to Quizzes
              </Link>
              <Link href="/dashboard" className="px-6 py-3 bg-purple-600 rounded-lg font-medium text-white hover:bg-purple-700 transition-colors duration-200">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Quiz interface
        <div className="max-w-4xl mx-auto">
          {/* Quiz header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl font-bold text-gray-800">{quizData.title}</h1>
                <p className="text-sm text-gray-500">{quizData.subject} • {quizData.totalQuestions} questions</p>
              </div>
              <div className="flex items-center">
                <div className={`flex items-center px-3 py-2 rounded-lg ${
                  timeRemaining < 60 ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Question {currentQuestion + 1} of {quizData.questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Question card */}
          <div className={`bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-opacity duration-300 ${animateQuestion ? 'opacity-0' : 'opacity-100'}`}>
            <div className="px-6 py-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">{currentQ.text}</h2>
              
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`border px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedOption === option.id 
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs font-medium transition-all duration-200 ${
                        selectedOption === option.id 
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {option.id.toUpperCase()}
                      </div>
                      <span className="text-gray-700">{option.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {showExplanation && (
                <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'} animate-fadeIn`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isCorrect ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-lg font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{currentQ.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                Previous
              </button>
              
              <div className="flex space-x-3">
                {!showExplanation && selectedOption && (
                  <button
                    onClick={handleCheckAnswer}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors duration-200"
                  >
                    Check Answer
                  </button>
                )}
                
                {currentQuestion < quizData.questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!selectedOption}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !selectedOption
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    } transition-colors duration-200`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Question navigation */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Question Navigation</h3>
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
                    className={`w-full h-10 rounded-lg font-medium text-sm ${
                      currentQuestion === index
                        ? 'bg-purple-600 text-white'
                        : answers[question.id]
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors duration-200`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}