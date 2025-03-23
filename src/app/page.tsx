'use client';


import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Home() {
  // Reference for the animated background canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation for the particle background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Add this check

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particles array
    const particlesArray: Particle[] = []; // Explicitly type particlesArray as Particle[]
    const numberOfParticles = 100;

    // Create particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        // Boundary checks
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return; // Add this null check
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animate);
    }

    // Handle window resize
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);

    init();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Effect for intersection observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-appear');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with enhanced visuals */}
      <section className="relative overflow-hidden py-20 md:py-32 px-6 min-h-[100vh] flex items-center justify-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-950"></div>

        {/* Canvas for animated particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          style={{ opacity: 0.7 }}
        ></canvas>

        {/* Math equations with enhanced animations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* More equations with varied animation styles */}
          <div className="absolute top-[5%] right-[15%] text-white text-3xl opacity-10 animate-float" style={{ animationDuration: '8s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>a² + b² = c²</div>
          <div className="absolute top-[12%] left-[10%] text-white text-3xl opacity-10 animate-float" style={{ animationDuration: '9s', animationDelay: '1s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>E = mc²</div>
          <div className="absolute top-[20%] right-[30%] text-white text-2xl opacity-10 animate-float" style={{ animationDuration: '10s', animationDelay: '0.5s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>Δx·Δp ≥ ℏ/2</div>
          <div className="absolute top-[35%] left-[8%] text-white text-2xl opacity-10 animate-pulse-slow" style={{ animationDuration: '7s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>F = ma</div>
          <div className="absolute top-[40%] right-[10%] text-white text-2xl opacity-10 animate-pulse-slow" style={{ animationDuration: '10s', animationDelay: '2s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>PV = nRT</div>
          <div className="absolute top-[60%] left-[15%] text-white text-2xl opacity-10 animate-float" style={{ animationDuration: '11s', animationDelay: '1.5s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>∇ × E = -∂B/∂t</div>
          <div className="absolute top-[70%] right-[20%] text-white text-2xl opacity-10 animate-float" style={{ animationDuration: '12s', animationDelay: '0.8s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>f(x) = ∫ g(t) dt</div>
          <div className="absolute top-[25%] left-[30%] text-white text-4xl opacity-10 animate-pulse-slow" style={{ animationDuration: '15s', animationDelay: '1.5s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>∫</div>
          <div className="absolute bottom-[20%] right-[25%] text-white text-4xl opacity-10 animate-pulse-slow" style={{ animationDuration: '14s', animationDelay: '0.7s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>∑</div>
          <div className="absolute bottom-[30%] left-[40%] text-white text-4xl opacity-10 animate-float" style={{ animationDuration: '16s', animationDelay: '1.2s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>∞</div>
          <div className="absolute top-[45%] left-[60%] text-white text-4xl opacity-10 animate-pulse-slow" style={{ animationDuration: '13s', animationDelay: '2s', textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>π</div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[15%] w-32 h-32 border-2 border-white/10 rounded-lg animate-rotate-slow" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-[20%] right-[15%] w-40 h-40 border-2 border-white/10 rounded-full animate-rotate-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
          <div className="absolute top-[60%] left-[25%] w-24 h-24 border-2 border-white/10 transform rotate-45 animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute top-[30%] right-[25%] w-20 h-20 border-2 border-white/5 rounded-full animate-pulse-slow" style={{ animationDuration: '10s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Animated logo reveal */}
            <div className="flex justify-center mb-12 animate-fadeIn" style={{ animationDuration: '1.5s' }}>
              <div className="relative inline-block">
                <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 filter drop-shadow-xl" style={{ textShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  DEV<span className="text-white">{"{thon}"}</span>
                </div>
                <span className="absolute" style={{ top: '-12px', right: '-40px', fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>2.0</span>

                {/* Glowing effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur-lg opacity-20 animate-pulse-slow"></div>
              </div>
            </div>

            <p className="text-xl md:text-2xl mb-10 text-purple-100 font-light tracking-wide animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
              {"<!--Design Your Dreams into Reality-->"}
            </p>

            <div className="mt-10 mb-10 relative animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '0.8s' }}>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                Gamified Learning Experience <br className="hidden md:block" />
                <span className="text-purple-300 inline-block mt-2">for Sri Lankan A/L Students</span>
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Transform your exam preparation with interactive quizzes, personalized AI feedback, and a collaborative learning community.
              </p>
            </div>

            {/* Animated counter section */}
            <div className="flex flex-wrap justify-center gap-8 my-12 animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '1.2s' }}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 counter" data-target="5000">5,000+</div>
                <p className="text-purple-200">Active Students</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 counter" data-target="200">200+</div>
                <p className="text-purple-200">Practice Quizzes</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 counter" data-target="95">95%</div>
                <p className="text-purple-200">Satisfaction Rate</p>
              </div>
            </div>

            {/* Enhanced hero section buttons with animations */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '1.5s' }}>
              <Link href="/register" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-white text-purple-900 rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative group-hover:text-white transition-colors duration-300 ease-out flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Get Started
                </span>
                <span className="absolute right-0 -mt-12 h-32 w-8 bg-white opacity-20 transform rotate-12 transition-all duration-1000 ease-out group-hover:translate-x-12"></span>
              </Link>

              <Link href="/login" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-transparent border-2 border-white text-white rounded-full overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Login
              </Link>

              <Link href="/dashboard" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/30 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
                <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold uppercase rounded-bl-lg bg-purple-800">Beta</span>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with interactive cards */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 scroll-mt-16 relative" id="features">
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-900/5 to-transparent dark:from-purple-900/10"></div>
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-purple-300/10 dark:bg-purple-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-indigo-300/10 dark:bg-indigo-900/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">Engaging Features</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
              Our platform combines gamification, social learning, and AI to create an interactive learning experience that makes studying enjoyable and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Enhanced Feature Card 1 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Gamified Quizzes</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Earn points, unlock badges, and compete on leaderboards while mastering complex concepts.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center text-sm text-purple-700 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>400+ interactive questions</span>
                </div>
              </div>
            </div>

            {/* Enhanced Feature Card 2 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Discussion Forums</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Collaborate with peers to solve problems and discuss concepts in subject-specific forums.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center text-sm text-purple-700 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  <span>Expert teacher moderation</span>
                </div>
              </div>
            </div>

            {/* Enhanced Feature Card 3 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">AI Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Receive personalized study suggestions and focus on areas that need improvement.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center text-sm text-purple-700 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>Personalized learning paths</span>
                </div>
              </div>
            </div>

            {/* Enhanced Feature Card 4 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Resource Library</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Access a comprehensive collection of past papers, notes, and study materials.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex items-center text-sm text-purple-700 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span>Updated exam resources</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Feature Section - Premium Features */}
          <div className="mt-24 text-center">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Premium Features</h3>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-12">Enhance your learning experience with these advanced tools and resources.</p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {/* Premium Feature 1 */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-800/50 animate-on-scroll opacity-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Video Lessons</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Access high-quality video explanations for complex topics with step-by-step walkthroughs.</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">Premium Only</span>
              </div>

              {/* Premium Feature 2 */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-800/50 animate-on-scroll opacity-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Virtual Labs</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Interactive simulations for physics and chemistry experiments to enhance practical understanding.</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">Premium Only</span>
              </div>

              {/* Premium Feature 3 */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-800/50 animate-on-scroll opacity-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Expert Q&A</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Direct access to qualified teachers for personalized help with challenging concepts and problems.</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">Premium Only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Subjects Section with animated cards */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-800 relative scroll-mt-16">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800"></div>
        <div className="absolute left-0 top-1/3 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-1/3 w-72 h-72 bg-green-200/20 dark:bg-green-900/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">Explore Subjects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
              Prepare for your A/L exams with comprehensive materials tailored to the Sri Lankan curriculum.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Enhanced Subject Card - Physics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-800 text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700 animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900">
                <div className="absolute inset-x-0 top-16 flex justify-center">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="px-8 pt-16 pb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Physics</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Explore mechanics, electromagnetism, waves, thermodynamics, and modern physics with interactive lessons and practice quizzes.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Mechanics & Dynamics</span>
                  </div>
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Electromagnetism</span>
                  </div>
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Waves & Oscillations</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Course Completeness</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">73%</span>
                  </div>
                  <div className="w-full bg-blue-100 dark:bg-blue-900/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full w-[73%] transform origin-left transition-transform duration-1000 group-hover:scale-x-110"></div>
                  </div>
                </div>

                <Link href="/subjects/physics" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300 group">
                  <span className="border-b border-blue-300 dark:border-blue-700 group-hover:border-blue-600 dark:group-hover:border-blue-500 pb-0.5 transition-colors duration-300">Explore Physics</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Enhanced Subject Card - Chemistry */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:border-green-200 dark:hover:border-green-800 text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700 animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="h-40 bg-gradient-to-r from-green-500 to-green-700 dark:from-green-700 dark:to-green-900">
                <div className="absolute inset-x-0 top-16 flex justify-center">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="px-8 pt-16 pb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Chemistry</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Master organic, inorganic, and physical chemistry with comprehensive lessons, diagrams, and practice problems.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Organic Chemistry</span>
                  </div>
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Inorganic Chemistry</span>
                  </div>
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Physical Chemistry</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-600 dark:text-green-400 font-medium">Course Completeness</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">68%</span>
                  </div>
                  <div className="w-full bg-green-100 dark:bg-green-900/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-600 dark:bg-green-500 h-full rounded-full w-[68%] transform origin-left transition-transform duration-1000 group-hover:scale-x-110"></div>
                  </div>
                </div>

                <Link href="/subjects/chemistry" className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 transition-colors duration-300 group">
                  <span className="border-b border-green-300 dark:border-green-700 group-hover:border-green-600 dark:group-hover:border-green-500 pb-0.5 transition-colors duration-300">Explore Chemistry</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Enhanced Subject Card - Combined Math */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:border-yellow-200 dark:hover:border-yellow-800 text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700 animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              <div className="h-40 bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-700 dark:to-yellow-900">
                <div className="absolute inset-x-0 top-16 flex justify-center">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="px-8 pt-16 pb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Combined Math</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Develop a strong foundation in calculus, algebra, statistics, and mechanics through step-by-step tutorials.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Differential Calculus</span>
                  </div>
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Algebra & Functions</span>
                  </div>
                  <div className="flex items-center text-left text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Statistics & Probability</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Course Completeness</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">82%</span>
                  </div>
                  <div className="w-full bg-yellow-100 dark:bg-yellow-900/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-600 dark:bg-yellow-500 h-full rounded-full w-[82%] transform origin-left transition-transform duration-1000 group-hover:scale-x-110"></div>
                  </div>
                </div>

                <Link href="/subjects/math" className="inline-flex items-center text-yellow-600 dark:text-yellow-400 font-medium hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors duration-300 group">
                  <span className="border-b border-yellow-300 dark:border-yellow-700 group-hover:border-yellow-600 dark:group-hover:border-yellow-500 pb-0.5 transition-colors duration-300">Explore Combined Math</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* View All Subjects Button */}
          <div className="text-center mt-12">
            <Link href="/subjects" className="inline-flex items-center justify-center px-8 py-3 font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 text-lg">
              View All Subjects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials section with cards */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 scroll-mt-16 relative" id="testimonials">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-70"></div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-70"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">What Students Say</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
              Hear from students who have improved their exam performance using our platform.
            </p>
          </div>

          {/* Quote mark */}
          <div className="absolute left-0 top-40 text-9xl text-purple-200 dark:text-purple-900/30 opacity-50 font-serif">
            "
          </div>
          <div className="absolute right-0 bottom-20 text-9xl text-purple-200 dark:text-purple-900/30 opacity-50 font-serif transform rotate-180">
            "
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Enhanced Testimonial 1 */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 animate-on-scroll opacity-0 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  DP
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Dinuka Perera</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Physics & Math Student</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
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
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">"The gamified quizzes made studying for physics so much more engaging. I actually look forward to practice sessions now, and my scores have improved significantly."</p>
              <div className="pt-2 text-sm text-gray-500 dark:text-gray-500">
                Jan 2025 • Physics Student
              </div>
            </div>

            {/* Enhanced Testimonial 2 */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 animate-on-scroll opacity-0 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  KM
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Kavisha Madhavi</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Chemistry Student</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
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
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">"The AI recommendations helped me identify my weaknesses in organic chemistry. After focusing on those areas, I was able to improve my understanding tremendously."</p>
              <div className="pt-2 text-sm text-gray-500 dark:text-gray-500">
                Feb 2025 • Chemistry Student
              </div>
            </div>

            {/* Enhanced Testimonial 3 */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 animate-on-scroll opacity-0 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  AS
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ashan Silva</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Combined Math Student</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
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
              <p className="text-gray-600 dark:text-gray-400 italic mb-4">"The forum discussions helped me understand complex calculus concepts. Being able to ask questions and get quick responses from peers made a huge difference."</p>
              <div className="pt-2 text-sm text-gray-500 dark:text-gray-500">
                Mar 2025 • Combined Math Student
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-950 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dots-pattern opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/10 to-transparent"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Success in Numbers</h2>
            <div className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-2xl mx-auto text-purple-100 text-xl">
              Our platform has helped thousands of students improve their performance and reach their academic goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="5000">5,000+</div>
              <p className="text-purple-200 text-lg">Active Students</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="5000">200+</div>
              <p className="text-purple-200 text-lg">Practice Quizzes</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="5000">95%</div>
              <p className="text-purple-200 text-lg">Satisfaction Rate</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="5000">50+</div>
              <p className="text-purple-200 text-lg">Certified Tutors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to action with form */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-900 to-indigo-800 text-white relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 bg-dots-pattern opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-800 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-800 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:pr-6">
              <span className="bg-purple-700/50 text-purple-100 text-sm font-medium px-4 py-1.5 rounded-full mb-5 inline-block">Limited Time Offer</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to Transform Your A/L Exam Preparation?</h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">Join thousands of students who are already experiencing the benefits of gamified learning. Sign up today and get 30 days of premium features for free!</p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-purple-700/50 rounded-full p-2 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Personalized Learning Path</h3>
                    <p className="text-purple-100">Get a customized study plan tailored to your strengths and weaknesses.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-700/50 rounded-full p-2 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Progress Tracking</h3>
                    <p className="text-purple-100">Monitor your improvement with detailed analytics and performance insights.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-700/50 rounded-full p-2 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Community Support</h3>
                    <p className="text-purple-100">Connect with peers and experts to solve problems together.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Get Started For Free</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your email" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Preferred Subject</label>
                  <select id="subject" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="" className="bg-gray-800">Select a subject</option>
                    <option value="physics" className="bg-gray-800">Physics</option>
                    <option value="chemistry" className="bg-gray-800">Chemistry</option>
                    <option value="math" className="bg-gray-800">Combined Mathematics</option>
                    <option value="biology" className="bg-gray-800">Biology</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-white text-purple-900 font-medium py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors duration-300 shadow-lg hover:shadow-white/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Register Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-[20%] left-[5%] w-24 h-24 bg-white opacity-5 rounded-full animate-float" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-white opacity-5 rounded-full animate-float" style={{ animationDuration: '18s', animationDelay: '2s' }}></div>
        <div className="absolute top-[50%] right-[20%] w-16 h-16 bg-white opacity-5 rounded-lg transform rotate-45 animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-xl">
              Find answers to common questions about our platform.
            </p>
          </div>

          <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0">
  <p className="text-gray-600 dark:text-gray-300">DEV{"{thon}"} offers a free tier with access to basic features including quizzes, forums, and study materials. Premium features like personalized AI recommendations, video lessons, and expert Q&A sessions are available with a subscription.</p>

  <p className="text-gray-600 dark:text-gray-300">DEV{"{thon}"} offers a free tier with access to basic features including quizzes, forums, and study materials. Premium features like personalized AI recommendations, video lessons, and expert Q&A sessions are available with a subscription.</p>
</div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How do the gamified quizzes work?</h3>
              <p className="text-gray-600 dark:text-gray-300">Our gamified quizzes combine learning with game elements like points, badges, leaderboards, and levels. As you answer questions correctly, you earn points and unlock achievements. This approach makes learning more engaging and motivates consistent practice.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How up-to-date are the study materials?</h3>
              <p className="text-gray-600 dark:text-gray-300">All study materials are regularly updated to align with the latest Sri Lankan A/L curriculum. Our team of educators reviews and refreshes content to ensure it remains current and relevant to your exams.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Can I access the platform on mobile devices?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes, DEV{"{thon}"} is fully responsive and can be accessed on smartphones, tablets, and computers. We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How does the AI recommendation system work?</h3>
              <p className="text-gray-600 dark:text-gray-300">Our AI system analyzes your quiz performance, studying patterns, and learning history to identify strengths and weaknesses. Based on this analysis, it suggests specific topics to focus on, recommends relevant resources, and creates a personalized learning path to help you improve efficiently.</p>
            </div>
          </div>
        </div>
      </section>

            {/* Enhanced Footer */}
            <footer className="bg-gray-900 dark:bg-gray-950 text-white py-24 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-900 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-900 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">
                  DEV<span className="text-white">{"{thon}"}</span>
                  <span className="text-sm align-top text-white ml-1">2.0</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6">A gamified learning platform designed for Sri Lankan Advanced Level students.</p>
              <div className="mb-6">
                <a href="#" className="inline-block bg-purple-800/20 hover:bg-purple-800/30 text-purple-400 rounded-full px-4 py-1 text-sm font-medium transition-colors duration-300">
                  #gamifiedlearning
                </a>
                <a href="#" className="inline-block bg-purple-800/20 hover:bg-purple-800/30 text-purple-400 rounded-full px-4 py-1 text-sm font-medium ml-2 transition-colors duration-300">
                  #ALexams
                </a>
              </div>
              <div className="flex space-x-5">
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
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-.1363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-5 text-white">Platform</h3>
              <ul className="space-y-4">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Home
                </Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Dashboard
                </Link></li>
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Features
                </Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  About Us
                </Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Pricing
                </Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-5 text-white">Resources</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Blog
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Help Center
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact Us
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Terms of Service
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Privacy Policy
                </a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-5 text-white">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>rothilamehara22@gmail.com</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>0787102992, 0716597404</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Sri Lanka</span>
                </li>
              </ul>

              {/* Newsletter Signup */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-3">Subscribe to our newsletter</h4>
                <form className="flex">
                  <input type="email" className="bg-gray-800 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm" placeholder="Your email address" />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg px-4 text-sm font-medium transition-colors duration-300">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-800 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© 2025 Team Xforce. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mx-3">Terms</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mx-3">Privacy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mx-3">Cookies</a>
              </div>
            </div>
            <p className="mt-6 text-sm">Designed for DEV{"{thon}"} 2.0 | <a href="https://mehara.io" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">mehara.io</a></p>
          </div>
        </div>
      </footer>

      {/* JavaScript for animations - this would be best in a separate file, but included here for completeness */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Animation for scroll-triggered elements
          document.addEventListener('DOMContentLoaded', function() {
            // Add animation class to elements when they scroll into view
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('animate-appear');
                  entry.target.style.opacity = 1;
                  entry.target.style.transform = 'translateY(0)';
                }
              });
            }, { threshold: 0.1 });

            const hiddenElements = document.querySelectorAll('.animate-on-scroll');
            hiddenElements.forEach((el) => {
              el.style.opacity = 0;
              el.style.transform = 'translateY(20px)';
              el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
              observer.observe(el);
            });

            // Counter animation for statistics
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
              const target = parseInt(counter.getAttribute('data-target').replace(/,/g, ''));
              const duration = 2000; // Animation duration in milliseconds
              const step = target / (duration / 16); // 60fps

              let current = 0;
              const updateCounter = () => {
                current += step;
                if (current < target) {
                  counter.textContent = Math.ceil(current).toLocaleString();
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.textContent = target.toLocaleString();
                }
              };

              const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                  }
                });
              }, { threshold: 0.5 });

              counterObserver.observe(counter);
            });
          });
        `
      }} />
    </main>
  );
}