import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with scientific/math background elements */}
      <section className="relative overflow-hidden py-24 px-6 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-950"></div>
        <div className="absolute inset-0 opacity-5 bg-dots-pattern mix-blend-overlay"></div>

        {/* Clean background with only equations/formulas - IMPROVED SPACING */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top row equations - spaced further apart */}
          <div className="absolute top-[10%] right-[15%] text-white text-2xl opacity-15 animate-float" style={{ animationDuration: '8s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>a² + b² = c²</div>
          <div className="absolute top-[12%] left-[20%] text-white text-2xl opacity-15 animate-float" style={{ animationDuration: '9s', animationDelay: '1s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>E = mc²</div>
          
          {/* Middle row equations - different animation speeds */}
          <div className="absolute top-[35%] left-[10%] text-white text-xl opacity-15 animate-pulse-slow" style={{ animationDuration: '7s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>F = ma</div>
          <div className="absolute top-[40%] right-[12%] text-white text-xl opacity-15 animate-pulse-slow" style={{ animationDuration: '10s', animationDelay: '2s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>PV = nRT</div>
          
          {/* Bottom row equations */}
          <div className="absolute top-[65%] right-[18%] text-white text-xl opacity-15 animate-float" style={{ animationDuration: '12s', animationDelay: '0.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>Δx·Δp ≥ ℏ/2</div>
          <div className="absolute top-[70%] left-[22%] text-white text-xl opacity-15 animate-float" style={{ animationDuration: '11s', animationDelay: '2.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∇ × E = -∂B/∂t</div>

          {/* Math symbols - reduced and better spaced */}
          <div className="absolute top-[25%] left-[30%] text-white text-3xl opacity-15 animate-pulse-slow" style={{ animationDuration: '15s', animationDelay: '1.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∫</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-3xl opacity-15 animate-pulse-slow" style={{ animationDuration: '14s', animationDelay: '0.7s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∑</div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative inline-block">
                <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  DEV<span className="text-white">{"{thon}"}</span>
                </div>
                <span className="absolute" style={{ top: '-8px', right: '-30px', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>2.0</span>
              </div>
            </div>

            <p className="text-xl md:text-2xl mb-10 text-purple-100 font-light">
              {"<!--Design Your Dreams into Reality-->"}
            </p>

            <div className="mt-10 mb-10 relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                Gamified Learning Experience <br className="hidden md:block" />
                <span className="text-purple-300">for Sri Lankan A/L Students</span>
              </h2>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Transform your exam preparation with interactive quizzes, personalized AI feedback, and a collaborative learning community.
              </p>
            </div>

            {/* Hero section buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register" className="group relative inline-flex items-center justify-center px-8 py-3 font-medium bg-white text-purple-900 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative group-hover:text-white transition-colors duration-300 ease-out">Get Started</span>
              </Link>
              <Link href="/login" className="relative inline-flex items-center justify-center px-8 py-3 font-medium bg-transparent border-2 border-white text-white rounded-full overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Login
              </Link>
              <Link href="/dashboard" className="relative inline-flex items-center justify-center px-8 py-3 font-medium bg-purple-600 border-2 border-purple-600 text-white rounded-full overflow-hidden hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with cards and hover effects */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900 scroll-mt-16" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-purple-900 dark:text-purple-400">Engaging Features</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">Our platform combines gamification, social learning, and AI to create an interactive learning experience that makes studying enjoyable and effective.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-300"></div>
              <div className="w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:bg-purple-700 dark:group-hover:bg-purple-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Gamified Quizzes</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Earn points, unlock badges, and compete on leaderboards while mastering complex concepts.</p>
            </div>

            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-300"></div>
              <div className="w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:bg-purple-700 dark:group-hover:bg-purple-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Discussion Forums</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Collaborate with peers to solve problems and discuss concepts in subject-specific forums.</p>
            </div>

            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-300"></div>
              <div className="w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:bg-purple-700 dark:group-hover:bg-purple-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">AI Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Receive personalized study suggestions and focus on areas that need improvement.</p>
            </div>

            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-300"></div>
              <div className="w-16 h-16 bg-purple-600 dark:bg-purple-700 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:bg-purple-700 dark:group-hover:bg-purple-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Resource Library</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Access a comprehensive collection of past papers, notes, and study materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section with enhanced cards */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800 relative scroll-mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-purple-900 dark:text-purple-400">Explore Subjects</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">Prepare for your A/L exams with comprehensive materials tailored to the Sri Lankan curriculum.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-800 text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Physics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Explore mechanics, electromagnetism, waves, thermodynamics, and modern physics with interactive lessons and practice quizzes.</p>
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mechanics & Dynamics</span>
                </div>
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Electromagnetism</span>
                </div>
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Waves & Oscillations</span>
                </div>
              </div>
              <Link href="/subjects/physics" className="inline-block text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
                <span className="flex items-center">
                  Explore Physics
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-green-200 dark:hover:border-green-800 text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Chemistry</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Master organic, inorganic, and physical chemistry with comprehensive lessons, diagrams, and practice problems.</p>
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Organic Chemistry</span>
                </div>
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Inorganic Chemistry</span>
                </div>
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Physical Chemistry</span>
                </div>
              </div>
              <Link href="/subjects/chemistry" className="inline-block text-green-600 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 transition-colors duration-300">
                <span className="flex items-center">
                  Explore Chemistry
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-yellow-200 dark:hover:border-yellow-800 text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg></div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Combined Math</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Develop a strong foundation in calculus, algebra, statistics, and mechanics through step-by-step tutorials.</p>
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Differential Calculus</span>
                </div>
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Algebra & Functions</span>
                </div>
                <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Statistics & Probability</span>
                </div>
              </div>
              <Link href="/subjects/math" className="inline-block text-yellow-600 dark:text-yellow-400 font-medium hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors duration-300">
                <span className="flex items-center">
                  Explore Combined Math
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-purple-900 dark:text-purple-400">What Students Say</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">Hear from students who have improved their exam performance using our platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-lg">
                  DP
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Dinuka Perera</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Physics & Math Student</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">"The gamified quizzes made studying for physics so much more engaging. I actually look forward to practice sessions now, and my scores have improved significantly."</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-lg">
                  KM
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Kavisha Madhavi</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chemistry Student</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">"The AI recommendations helped me identify my weaknesses in organic chemistry. After focusing on those areas, I was able to improve my understanding tremendously."</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-lg">
                  AS
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ashan Silva</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Combined Math Student</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">"The forum discussions helped me understand complex calculus concepts. Being able to ask questions and get quick responses from peers made a huge difference."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 px-6 bg-gradient-to-r from-purple-900 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-3/5 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your A/L Exam Preparation?</h2>
              <p className="text-purple-100 text-lg">Join thousands of students who are already experiencing the benefits of gamified learning.</p>
            </div>
            <div className="md:w-2/5 text-center md:text-right space-y-3 md:space-y-3">
              <Link href="/register" className="inline-flex items-center justify-center px-8 py-3 font-medium bg-white text-purple-900 rounded-full shadow-md hover:bg-purple-100 transition-all duration-300 w-full md:w-auto transform hover:scale-105">
                Get Started For Free
              </Link>
              <div className="block">
                <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-3 font-medium bg-purple-600 text-white rounded-full shadow-md border border-purple-500 hover:bg-purple-700 transition-all duration-300 w-full md:w-auto transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-[20%] left-[5%] w-24 h-24 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-[50%] right-[20%] w-16 h-16 bg-white opacity-5 rounded-lg transform rotate-45"></div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">
                  DEV<span className="text-white">{"{thon}"}</span>
                  <span className="text-sm align-top text-white ml-1">2.0</span>
                </div>
              </div>
              <p className="text-gray-400">A gamified learning platform designed for Sri Lankan Advanced Level students.</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-300">Dashboard</Link></li>
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors duration-300">Features</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  rothilamehara22@gmail.com
                </li>
                <li className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0787102992, 0716597404
                </li>
                <li className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Sri Lanka
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Team Xforce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}