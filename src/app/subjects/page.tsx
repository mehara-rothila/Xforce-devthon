'use client';

import Link from 'next/link';
import { useDarkMode } from '../DarkModeContext'; // Import the dark mode context

export default function Subjects() {
  // Get dark mode context
  const { isDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 mb-4 transition-colors duration-300">Advanced Level</span>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl tracking-tight transition-colors duration-300">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Subjects</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Prepare for your A/L exams with comprehensive materials tailored to the Sri Lankan curriculum.
          </p>
        </div>

        {/* Physics Subject */}
        <div className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/10 rounded-2xl overflow-hidden mb-16 transform transition duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/20 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 text-white text-4xl">E = mc²</div>
                <div className="absolute bottom-1/4 right-1/4 text-white text-3xl">F = ma</div>
                <div className="absolute top-3/4 left-1/3 text-white text-3xl">V = IR</div>
              </div>
            </div>
            <div className="p-8 md:p-10 flex-1">
              <div className="flex items-center">
                <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h2 className="ml-5 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Physics</h2>
              </div>
              <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Explore mechanics, electromagnetism, waves, thermodynamics, and modern physics through interactive lessons, practice quizzes, and comprehensive study materials.
              </p>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 transition-colors duration-300">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg transition-colors duration-300">Key Topics</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Mechanics & Dynamics</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Electromagnetism</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Waves & Oscillations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Thermodynamics</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 transition-colors duration-300">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg transition-colors duration-300">Resources</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Interactive Lessons</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Practice Quizzes</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Past Papers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Formula Sheets</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10">
                <Link 
                  href="/subjects/physics" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 dark:from-blue-600 dark:to-blue-800 dark:hover:from-blue-500 dark:hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Explore Physics
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Chemistry Subject */}
        <div className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/10 rounded-2xl overflow-hidden mb-16 transform transition duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/20 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 text-white text-4xl">H₂O</div>
                <div className="absolute bottom-1/4 right-1/4 text-white text-3xl">C₆H₁₂O₆</div>
                <div className="absolute top-3/4 left-1/3 text-white text-3xl">NaCl</div>
              </div>
            </div>
            <div className="p-8 md:p-10 flex-1">
              <div className="flex items-center">
                <div className="h-14 w-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h2 className="ml-5 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Chemistry</h2>
              </div>
              <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Master organic, inorganic, and physical chemistry with comprehensive lessons, diagrams, and practice problems designed to help you excel in your A/L exams.
              </p>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 transition-colors duration-300">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 text-lg transition-colors duration-300">Key Topics</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Organic Chemistry</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Inorganic Chemistry</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Physical Chemistry</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Analytical Techniques</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 transition-colors duration-300">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 text-lg transition-colors duration-300">Resources</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Chemical Reactions Database</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Virtual Lab Experiments</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Periodic Table Explorer</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Molecular Structure Visualizer</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10">
                <Link 
                  href="/subjects/chemistry" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 dark:from-green-600 dark:to-green-800 dark:hover:from-green-500 dark:hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Explore Chemistry
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Mathematics Subject */}
        <div className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/10 rounded-2xl overflow-hidden mb-16 transform transition duration-300 hover:shadow-2xl dark:hover:shadow-gray-900/20 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-800">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-gradient-to-br from-yellow-500 to-yellow-700 dark:from-yellow-600 dark:to-yellow-800 w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 text-white text-4xl">∫</div>
                <div className="absolute bottom-1/4 right-1/4 text-white text-3xl">Σ</div>
                <div className="absolute top-3/4 left-1/3 text-white text-3xl">√</div>
              </div>
            </div>
            <div className="p-8 md:p-10 flex-1">
              <div className="flex items-center">
                <div className="h-14 w-14 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-sm transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="ml-5 text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Combined Mathematics</h2>
              </div>
              <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Develop a strong foundation in calculus, algebra, statistics, and mechanics through step-by-step tutorials and comprehensive problem-solving techniques.
              </p>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 transition-colors duration-300">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-lg transition-colors duration-300">Key Topics</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 0012l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Statistics & Probability</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Mechanics</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 transition-colors duration-300">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-lg transition-colors duration-300">Resources</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Differential Calculus</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Integral Calculus</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Algebra & Functions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M912l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Step-by-Step Problem Solvers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Interactive Graphing Tools</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Formula Sheets & Cheat Sheets</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Video Solutions to Past Papers</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10">
                <Link 
                  href="/subjects/math" 
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 dark:from-yellow-600 dark:to-yellow-800 dark:hover:from-yellow-500 dark:hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 transform hover:-translate-y-1"
                >
                  Explore Combined Mathematics
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 mb-8 bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-800 dark:to-indigo-800 rounded-2xl shadow-xl dark:shadow-gray-900/20 overflow-hidden">
          <div className="px-8 py-12 md:p-12 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 text-white text-4xl">∑</div>
              <div className="absolute bottom-1/4 right-1/4 text-white text-3xl">F = ma</div>
              <div className="absolute top-3/4 left-1/3 text-white text-3xl">H₂O</div>
            </div>
            <div className="relative z-10 md:flex items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-white">Ready to accelerate your learning?</h2>
                <p className="mt-4 text-purple-100 text-lg">Join thousands of students already benefiting from our comprehensive learning resources.</p>
              </div>
              <div className="md:w-1/3 text-center">
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-lg text-purple-700 dark:text-purple-900 bg-white dark:bg-white hover:bg-purple-50 dark:hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-700 focus:ring-white transition-all duration-200 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}