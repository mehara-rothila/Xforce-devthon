
// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Keep if used elsewhere, otherwise remove if unused
import { useEffect, useRef, useState, FormEvent } from 'react'; // Added FormEvent
import { useRouter } from 'next/navigation'; // Added useRouter
import api from '../utils/api'; // Import the API utility
import { useAuth } from '@/app/context/AuthContext';

// --- Define Interfaces ---
interface Subject {
  _id: string;
  name: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  topics: { _id?: string; name: string }[];
}

interface Particle {
    x: number; y: number; size: number; speedX: number; speedY: number; color: string;
    update: () => void; draw: () => void;
}

// --- SubjectIcon Component ---
const SubjectIcon = ({ iconName, color }: { iconName: string, color: string }) => {
  const icons: { [key: string]: JSX.Element } = {
    atom: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
    flask: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    calculator: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    book: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
     </svg>
   ),
   globe: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: color }}>
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     </svg>
   ),
  };
  return icons[iconName] || icons['book']; // Default to book icon
};


export default function Home() {
  const router = useRouter();
  const { login } = useAuth();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectError, setSubjectError] = useState<string | null>(null);

  const [ctaFormData, setCtaFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [ctaIsLoading, setCtaIsLoading] = useState(false);
  const [ctaError, setCtaError] = useState<string | null>(null);

  // --- Input Handler for CTA Form ---
  const handleCtaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCtaFormData(prev => ({ ...prev, [name]: value }));
    if (ctaError) setCtaError(null);
  };

  // --- Submit Handler for CTA Form ---
  const handleCtaSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCtaError(null);
    if (ctaFormData.password !== ctaFormData.passwordConfirm) {
      setCtaError('Passwords do not match.'); return;
    }
    if (ctaFormData.password.length < 8) {
      setCtaError('Password must be at least 8 characters long.'); return;
    }
    if (!/\S+@\S+\.\S+/.test(ctaFormData.email)) {
        setCtaError('Please enter a valid email address.'); return;
    }
    if (!ctaFormData.name) {
        setCtaError('Please enter your name.'); return;
    }
    setCtaIsLoading(true);
    try {
      const payload = { name: ctaFormData.name, email: ctaFormData.email, password: ctaFormData.password, passwordConfirm: ctaFormData.passwordConfirm };
      console.log('Sending CTA registration data:', { name: payload.name, email: payload.email });
      const response = await api.auth.register(payload);
      console.log('CTA Registration successful:', response.data);
      if (response.data.token && response.data.data?.user && typeof window !== 'undefined') {
        login(response.data.token, response.data.data.user);
        console.log('Token stored and user state updated via AuthContext.');
        router.push('/dashboard');
      } else {
          console.warn('Token or user data not found in registration response.');
          setCtaError('Registration succeeded but failed to log in automatically. Please try logging in.');
      }
    } catch (err: any) {
      console.error('CTA Registration failed:', err);
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setCtaError(errorMessage);
    } finally {
      setCtaIsLoading(false);
    }
  };


  // --- Particle Animation useEffect ---
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100; // Adjusted for subtlety
    class ParticleClass implements Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; color: string;
      constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 3 + 0.5; this.speedX = Math.random() * 0.5 - 0.25; this.speedY = Math.random() * 0.5 - 0.25; this.color = `rgba(255, 255, 255, ${Math.random() * 0.15})`; }
      update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.1) this.size -= 0.005; if (this.x < 0 || this.x > canvas.width) this.speedX *= -1; if (this.y < 0 || this.y > canvas.height) this.speedY *= -1; }
      draw() { if (!ctx) return; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    function init() { particlesArray.length = 0; for (let i = 0; i < numberOfParticles; i++) { particlesArray.push(new ParticleClass()); } }
    let animationFrameId: number;
    function animate() { if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); particlesArray[i].draw(); } animationFrameId = requestAnimationFrame(animate); }
    function handleResize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); }
    window.addEventListener('resize', handleResize);
    init();
    animate();
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId); };
  }, []);

  // --- Intersection Observer useEffect ---
  useEffect(() => {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target instanceof HTMLElement) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => {
        if (el instanceof HTMLElement) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            scrollObserver.observe(el);
        }
    });

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target as HTMLElement;
                const targetText = counter.getAttribute('data-target');
                if (!targetText || counter.getAttribute('data-animated') === 'true') return; // Prevent re-animating
                counter.setAttribute('data-animated', 'true'); // Mark as animated
                const isPercentage = targetText.includes('%');
                const isPlus = targetText.includes('+');
                const target = parseInt(targetText.replace(/[,%+-]/g, ''));
                if (isNaN(target)) return;
                const duration = 2000;
                let startTimestamp: number | null = null;
                const updateCounter = (timestamp: number) => {
                  if (!startTimestamp) startTimestamp = timestamp;
                  const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                  const current = Math.ceil(progress * target);
                    counter.textContent = current.toLocaleString() + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                };
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => counterObserver.observe(counter));

    return () => {
        hiddenElements.forEach((el) => scrollObserver.unobserve(el));
        counters.forEach(counter => counterObserver.unobserve(counter));
    };
  }, [subjects]);


  // --- Fetch subjects data useEffect ---
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setSubjectError(null);
        const response = await api.subjects.getAll();
        const fetchedSubjects = response.data?.data?.subjects || [];
        if (Array.isArray(fetchedSubjects)) {
          setSubjects(fetchedSubjects);
        } else {
          console.error("Fetched data is not an array:", fetchedSubjects);
          setSubjectError("Received invalid data format for subjects.");
          setSubjects([]);
        }
      } catch (err: any) {
        console.error("Error fetching subjects:", err);
        setSubjectError(`Failed to load subjects: ${err.message || 'Unknown error'}`);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  // --- Helper function to validate hex color ---
  const cleanColor = (hex: string | undefined, fallback = '#cccccc') =>
    hex && /^#[0-9A-F]{6}$/i.test(hex) ? hex : fallback;


  return (
    <main className="flex min-h-screen flex-col dark:bg-gray-900 transition-colors duration-300">
      {/* ========================== Hero Section ========================== */}
      <section className="relative overflow-hidden py-20 md:py-32 px-6 min-h-[100vh] flex items-center justify-center">
        {/* Background, Canvas, Equations, Shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-950"></div>
        <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ opacity: 0.7 }}></canvas>
        {/* --- Hero Floating Background Icons (Subtle) --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Equations */}
            <div className="absolute top-[5%] right-[15%] text-white text-3xl opacity-10 animate-float" style={{ animationDuration: '8s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>a² + b² = c²</div>
            <div className="absolute top-[12%] left-[10%] text-white text-3xl opacity-10 animate-float" style={{ animationDuration: '9s', animationDelay: '1s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>E = mc²</div>
            <div className="absolute top-[20%] right-[30%] text-white text-2xl opacity-10 animate-float" style={{ animationDuration: '10s', animationDelay: '0.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>Δx·Δp ≥ ℏ/2</div>
            <div className="absolute top-[35%] left-[8%] text-white text-2xl opacity-10 animate-pulse-slow" style={{ animationDuration: '7s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>F = ma</div>
            <div className="absolute top-[40%] right-[10%] text-white text-2xl opacity-10 animate-pulse-slow" style={{ animationDuration: '10s', animationDelay: '2s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>PV = nRT</div>
            <div className="absolute top-[60%] left-[15%] text-white text-2xl opacity-10 animate-float" style={{ animationDuration: '11s', animationDelay: '1.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∇ × E = -∂B/∂t</div>
            <div className="absolute top-[70%] right-[20%] text-white text-2xl opacity-10 animate-float" style={{ animationDuration: '12s', animationDelay: '0.8s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>f(x) = ∫ g(t) dt</div>
            <div className="absolute top-[25%] left-[30%] text-white text-4xl opacity-10 animate-pulse-slow" style={{ animationDuration: '15s', animationDelay: '1.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∫</div>
            <div className="absolute bottom-[20%] right-[25%] text-white text-4xl opacity-10 animate-pulse-slow" style={{ animationDuration: '14s', animationDelay: '0.7s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∑</div>
            <div className="absolute bottom-[30%] left-[40%] text-white text-4xl opacity-10 animate-float" style={{ animationDuration: '16s', animationDelay: '1.2s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>∞</div>
            <div className="absolute top-[45%] left-[60%] text-white text-4xl opacity-10 animate-pulse-slow" style={{ animationDuration: '13s', animationDelay: '2s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>π</div>
            <div className="absolute bottom-[5%] right-[40%] text-white text-3xl opacity-10 animate-float" style={{ animationDuration: '10s', animationDelay: '0.5s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>ΔG = ΔH - TΔS</div>
            <div className="absolute top-[55%] right-[55%] text-white text-3xl opacity-10 animate-pulse-slow" style={{ animationDuration: '12s', animationDelay: '1s', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>V=IR</div>
            {/* Shapes */}
            <div className="absolute top-[15%] left-[15%] w-32 h-32 border-2 border-white/5 rounded-lg animate-rotate-slow" style={{ animationDuration: '20s' }}></div>
            <div className="absolute bottom-[20%] right-[15%] w-40 h-40 border-2 border-white/5 rounded-full animate-rotate-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
            <div className="absolute top-[60%] left-[25%] w-24 h-24 border-2 border-white/5 transform rotate-45 animate-float" style={{ animationDuration: '15s' }}></div>
            <div className="absolute top-[30%] right-[25%] w-20 h-20 border-2 border-white/3 rounded-full animate-pulse-slow" style={{ animationDuration: '10s' }}></div>
        </div>
        {/* --- End Hero Floating Icons --- */}

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Animated logo reveal */}
            <div className="flex justify-center mb-12 animate-fadeIn" style={{ animationDuration: '1.5s' }}>
              <div className="relative inline-block">
                <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 filter drop-shadow-xl" style={{ textShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  DEV<span className="text-white">{"{thon}"}</span>
                </div>
                <span className="absolute" style={{ top: '-12px', right: '-40px', fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>2.0</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur-lg opacity-20 animate-pulse-slow"></div>
              </div>
            </div>
            {/* Tagline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-10 text-white leading-tight animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '0.5s', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              Gamified Learning Experience <br className="hidden md:block" />
              <span className="text-purple-300 inline-block mt-2">for Sri Lankan A/L Students</span>
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-10 animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '0.8s' }}>
              Transform your exam preparation with interactive quizzes, personalized AI feedback, and a collaborative learning community.
            </p>
            {/* Animated counter section */}
            <div className="flex flex-wrap justify-center gap-8 my-12 animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '1.2s' }}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 counter" data-target="5000+">0+</div>
                <p className="text-purple-200">Active Students</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 counter" data-target="200+">0+</div>
                <p className="text-purple-200">Practice Quizzes</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 counter" data-target="95%">0%</div>
                <p className="text-purple-200">Satisfaction Rate</p>
              </div>
            </div>
            {/* Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn" style={{ animationDuration: '2s', animationDelay: '1.5s' }}>
              <Link href="/register" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-white text-purple-900 rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative group-hover:text-white transition-colors duration-300 ease-out flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  Get Started
                </span>
                <span className="absolute right-0 -mt-12 h-32 w-8 bg-white opacity-20 transform rotate-12 transition-all duration-1000 ease-out group-hover:translate-x-12"></span>
              </Link>
              <Link href="/login" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-transparent border-2 border-white text-white rounded-full overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Login
              </Link>
              <Link href="/dashboard" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/30 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                Dashboard
                <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold uppercase rounded-bl-lg bg-purple-800">Beta</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== Features Section ========================== */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 scroll-mt-16 relative" id="features">
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-purple-900/5 to-transparent dark:from-purple-900/10"></div>
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-purple-300/10 dark:bg-purple-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-indigo-300/10 dark:bg-indigo-900/10 rounded-full filter blur-3xl"></div>

        {/* --- Features Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Mathematical symbols */}
          <div className="absolute top-[7%] left-[13%] text-purple-500/20 dark:text-purple-400/10 text-9xl floating-icon">∑</div>
          <div className="absolute top-[33%] right-[17%] text-blue-500/20 dark:text-blue-400/10 text-10xl floating-icon-reverse">π</div>
          <div className="absolute top-[61%] left-[27%] text-green-500/20 dark:text-green-400/10 text-8xl floating-icon-slow">∞</div>
          <div className="absolute top-[19%] right-[38%] text-red-500/20 dark:text-red-400/10 text-11xl floating-icon">⚛</div>
          <div className="absolute top-[77%] right-[23%] text-yellow-500/20 dark:text-yellow-400/10 text-9xl floating-icon-slow">𝜙</div>
          <div className="absolute bottom-[31%] left-[8%] text-indigo-500/20 dark:text-indigo-400/10 text-10xl floating-icon-reverse">∫</div>
          <div className="absolute bottom-[12%] right-[42%] text-teal-500/20 dark:text-teal-400/10 text-9xl floating-icon">≈</div>
          <div className="absolute bottom-[47%] right-[9%] text-pink-500/20 dark:text-pink-400/10 text-8xl floating-icon-slow">±</div>

          {/* Additional math symbols */}
          <div className="absolute top-[23%] left-[54%] text-fuchsia-500/20 dark:text-fuchsia-400/10 text-8xl floating-icon">Δ</div>
          <div className="absolute top-[44%] left-[38%] text-emerald-500/20 dark:text-emerald-400/10 text-7xl floating-icon-slow">λ</div>
          <div className="absolute top-[81%] left-[67%] text-cyan-500/20 dark:text-cyan-400/10 text-9xl floating-icon-reverse">θ</div>
          <div className="absolute top-[29%] left-[83%] text-rose-500/20 dark:text-rose-400/10 text-8xl floating-icon">α</div>
          <div className="absolute bottom-[63%] left-[6%] text-amber-500/20 dark:text-amber-400/10 text-9xl floating-icon-slow">β</div>
          <div className="absolute bottom-[19%] left-[71%] text-purple-500/20 dark:text-purple-400/10 text-8xl floating-icon-reverse">μ</div>
          <div className="absolute bottom-[28%] left-[32%] text-blue-500/20 dark:text-blue-400/10 text-7xl floating-icon">ω</div>

          {/* Science formulas */}
          <div className="absolute top-[14%] left-[31%] text-indigo-500/20 dark:text-indigo-400/10 text-6xl floating-icon-slow">E=mc²</div>
          <div className="absolute top-[58%] left-[48%] text-teal-500/20 dark:text-teal-400/10 text-5xl floating-icon">F=ma</div>
          <div className="absolute top-[39%] left-[76%] text-violet-500/20 dark:text-violet-400/10 text-6xl floating-icon-reverse">H₂O</div>
          <div className="absolute bottom-[17%] left-[52%] text-rose-500/20 dark:text-rose-400/10 text-6xl floating-icon">PV=nRT</div>
          <div className="absolute bottom-[53%] left-[24%] text-emerald-500/20 dark:text-emerald-400/10 text-5xl floating-icon-slow">v=λf</div>
          <div className="absolute top-[86%] left-[11%] text-sky-500/20 dark:text-sky-400/10 text-5xl floating-icon-reverse">C₆H₁₂O₆</div>
          <div className="absolute top-[68%] right-[31%] text-amber-500/20 dark:text-amber-400/10 text-6xl floating-icon">E=hf</div>

          {/* Science icons */}
          <div className="absolute top-[41%] left-[8%] opacity-20 dark:opacity-10 floating-icon-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="absolute top-[17%] right-[7%] opacity-20 dark:opacity-10 floating-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="absolute bottom-[7%] left-[36%] opacity-20 dark:opacity-10 floating-icon-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
           <div className="absolute top-[54%] right-[28%] opacity-20 dark:opacity-10 floating-icon-slow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
           </div>
           <div className="absolute top-[23%] left-[67%] opacity-20 dark:opacity-10 floating-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
              </svg>
           </div>
            <div className="absolute bottom-[37%] right-[6%] opacity-15 dark:opacity-5 floating-icon-reverse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="absolute top-[71%] left-[13%] opacity-15 dark:opacity-5 floating-icon-slow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
        </div>
        {/* --- End Features Floating Icons --- */}

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">Engaging Features</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
              Our platform combines gamification, social learning, and AI to create an interactive learning experience that makes studying enjoyable and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card: Gamified Quizzes */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Gamified Quizzes</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Earn points, unlock badges, and compete on leaderboards while mastering complex concepts.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"><div className="flex items-center text-sm text-purple-700 dark:text-purple-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>400+ interactive questions</span></div></div>
            </div>
            {/* Feature Card: Discussion Forums */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Discussion Forums</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Collaborate with peers to solve problems and discuss concepts in subject-specific forums.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"><div className="flex items-center text-sm text-purple-700 dark:text-purple-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg><span>Expert teacher moderation</span></div></div>
            </div>
            {/* Feature Card: AI Recommendations */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">AI Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Receive personalized study suggestions and focus on areas that need improvement.</p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"><div className="flex items-center text-sm text-purple-700 dark:text-purple-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg><span>Personalized learning paths</span></div></div>
            </div>
             {/* Feature Card: Resource Library */}
             <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-game dark:shadow-md dark:hover:shadow-game-dark transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 relative overflow-hidden animate-on-scroll opacity-0">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full -mr-10 -mt-10 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-500"></div>
               <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-700 dark:to-purple-600 rounded-lg flex items-center justify-center text-white mb-6 relative z-10 group-hover:from-purple-700 group-hover:to-purple-600 dark:group-hover:from-purple-600 dark:group-hover:to-purple-500 transition-all duration-500 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               </div>
               <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-purple-800 dark:group-hover:text-purple-400 transition-colors duration-300">Resource Library</h3>
               <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-4">Access a comprehensive collection of past papers, notes, and study materials.</p>
               <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg"><div className="flex items-center text-sm text-purple-700 dark:text-purple-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg><span>Updated exam resources</span></div></div>
             </div>
          </div>

          {/* Premium Features Subsection */}
          <div className="mt-24 text-center">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Premium Features</h3>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-12">Enhance your learning experience with these advanced tools and resources.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {/* Premium Feature Card: Video Lessons */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-800/50 animate-on-scroll opacity-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Video Lessons</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Access high-quality video explanations for complex topics with step-by-step walkthroughs.</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">Premium Only</span>
              </div>
              {/* Premium Feature Card: Virtual Labs */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-800/50 animate-on-scroll opacity-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Virtual Labs</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Interactive simulations for physics and chemistry experiments to enhance practical understanding.</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">Premium Only</span>
              </div>
              {/* Premium Feature Card: Expert Q&A */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-800/50 animate-on-scroll opacity-0">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Expert Q&A</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Direct access to qualified teachers for personalized help with challenging concepts and problems.</p>
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">Premium Only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== Subjects Section ========================== */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-800 relative scroll-mt-16">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800"></div>
        <div className="absolute left-0 top-1/3 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-1/3 w-72 h-72 bg-green-200/20 dark:bg-green-900/10 rounded-full filter blur-3xl"></div>
         {/* --- Subjects Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
             <div className="absolute top-[10%] left-[60%] text-amber-500/15 dark:text-amber-400/5 text-7xl floating-icon">µ</div>
             <div className="absolute top-[65%] right-[20%] text-lime-500/15 dark:text-lime-400/5 text-9xl floating-icon-reverse">Δ</div>
             <div className="absolute top-[35%] left-[5%] text-teal-500/15 dark:text-teal-400/5 text-8xl floating-icon-slow">Σ</div>
             <div className="absolute bottom-[10%] left-[35%] text-fuchsia-500/15 dark:text-fuchsia-400/5 text-10xl floating-icon">Π</div>
             <div className="absolute top-[50%] left-[45%] text-orange-500/15 dark:text-orange-400/5 text-7xl floating-icon-reverse">λ</div>
             <div className="absolute bottom-[55%] right-[5%] text-red-500/15 dark:text-red-400/5 text-9xl floating-icon-slow">∇</div>

             <div className="absolute top-[25%] right-[10%] opacity-15 dark:opacity-5 floating-icon-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
             </div>
             <div className="absolute bottom-[30%] left-[15%] opacity-15 dark:opacity-5 floating-icon">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                 </svg>
             </div>
        </div>
        {/* --- End Subjects Floating Icons --- */}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">Explore Subjects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
              Prepare for your A/L exams with comprehensive materials tailored to the Sri Lankan curriculum.
            </p>
          </div>

          {/* Loading State */}
          {loadingSubjects && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading subjects...</p>
            </div>
          )}

          {/* Error State */}
          {subjectError && !loadingSubjects && (
            <div className="text-center py-10 max-w-md mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 shadow-lg">
              <div className="text-red-500 text-3xl mb-3">⚠️</div>
              <p className="text-red-700 dark:text-red-300">{subjectError}</p>
            </div>
          )}

          {/* --- Dynamic Subject Cards Grid --- */}
          {!loadingSubjects && !subjectError && Array.isArray(subjects) && subjects.length > 0 && (
            <div className="grid md:grid-cols-3 gap-10">
              {subjects.slice(0, 3).map((subject) => {
                const safeColor = cleanColor(subject.color);
                const safeGradientFrom = cleanColor(subject.gradientFrom, safeColor);
                const safeGradientTo = cleanColor(subject.gradientTo, safeColor);
                const hoverBorderClass = `hover:border-[${safeColor}]/50 dark:hover:border-[${safeColor}]/70`;

                return (
                  <div
                    key={subject._id}
                    className={`animate-on-scroll opacity-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${hoverBorderClass} text-center relative overflow-hidden group border border-gray-100 dark:border-gray-700`}
                  >
                    {/* Top color bar */}
                    <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(to right, ${safeGradientFrom}, ${safeGradientTo})` }}></div>
                    {/* Header with gradient and icon */}
                    <div className="h-40" style={{ background: `linear-gradient(to right, ${safeGradientFrom}, ${safeGradientTo})` }}>
                      <div className="absolute inset-x-0 top-16 flex justify-center">
                        <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-xl border-2 border-white dark:border-gray-700">
                          <SubjectIcon iconName={subject.icon || 'book'} color={safeColor} />
                        </div>
                      </div>
                    </div>
                    {/* Card Content */}
                    <div className="px-8 pt-16 pb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{subject.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3">{subject.description}</p>
                      {/* Key Topics List */}
                      {Array.isArray(subject.topics) && subject.topics.length > 0 && (
                        <div className="space-y-3 mb-8 min-h-[72px]">
                          {subject.topics.slice(0, 3).map(topic => (
                            <div key={topic._id || topic.name} className="flex items-center text-left text-sm">
                              <div className={`w-6 h-6 rounded-full bg-[${safeColor}]/10 dark:bg-[${safeColor}]/30 flex items-center justify-center mr-3 flex-shrink-0`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: safeColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                              <span className="truncate text-gray-600 dark:text-gray-400">{topic.name || 'Unnamed Topic'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                       {/* Show placeholder if no topics */}
                       {(!Array.isArray(subject.topics) || subject.topics.length === 0) && (
                           <div className="space-y-3 mb-8 min-h-[72px]">
                               <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">No key topics listed.</p>
                           </div>
                       )}
                      {/* Explore Link */}
                      <Link href={`/subjects/${subject._id}`} className={`inline-flex items-center font-medium hover:brightness-110 transition-colors duration-300 group`} style={{ color: safeColor }}>
                        <span className={`border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-[${safeColor}]`}>Explore {subject.name}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
           {/* No Subjects Found State */}
           {!loadingSubjects && !subjectError && (!Array.isArray(subjects) || subjects.length === 0) && (
             <div className="text-center py-10 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-lg">
               <div className="text-yellow-500 text-3xl mb-3">🤔</div>
               <p className="text-yellow-700 dark:text-yellow-300">No subjects found. Check back later!</p>
             </div>
           )}
           {/* --- End of Dynamic Subject Cards Grid --- */}


          {/* View All Subjects Button */}
          <div className="text-center mt-12">
            <Link href="/subjects" className="inline-flex items-center justify-center px-8 py-3 font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 text-lg">
              View All Subjects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================== Testimonials Section ========================== */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 scroll-mt-16 relative" id="testimonials">
        {/* Decorative elements */}
        <div className="absolute left-0 top-1/4 w-72 h-72 bg-yellow-200/10 dark:bg-yellow-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-pink-200/10 dark:bg-pink-900/10 rounded-full filter blur-3xl"></div>

        {/* --- Testimonials Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Mathematical symbols */}
          <div className="absolute top-[12%] left-[8%] text-amber-500/20 dark:text-amber-400/10 text-9xl floating-icon">α</div>
          <div className="absolute top-[70%] right-[12%] text-pink-500/20 dark:text-pink-400/10 text-11xl floating-icon-reverse">β</div>
          <div className="absolute top-[35%] left-[17%] text-lime-500/20 dark:text-lime-400/10 text-8xl floating-icon-slow">γ</div>
          <div className="absolute top-[25%] right-[28%] text-blue-500/20 dark:text-blue-400/10 text-9xl floating-icon">δ</div>
          <div className="absolute bottom-[20%] left-[23%] text-purple-500/20 dark:text-purple-400/10 text-10xl floating-icon-slow">ε</div>
          <div className="absolute bottom-[50%] right-[5%] text-green-500/20 dark:text-green-400/10 text-8xl floating-icon-reverse">ζ</div>

          {/* Science formulas */}
          <div className="absolute top-[61%] right-[15%] text-emerald-500/20 dark:text-emerald-400/10 text-6xl floating-icon">V=IR</div>
          <div className="absolute bottom-[25%] right-[35%] text-orange-500/20 dark:text-orange-400/10 text-5xl floating-icon-reverse">E=hf</div>
          <div className="absolute top-[80%] left-[30%] text-rose-500/20 dark:text-rose-400/10 text-5xl floating-icon-slow">C₆H₁₂O₆</div>

          {/* Science icons */}
          <div className="absolute top-[22%] right-[12%] opacity-20 dark:opacity-10 floating-icon-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>

          <div className="absolute bottom-[15%] left-[10%] opacity-20 dark:opacity-10 floating-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        {/* --- End Testimonials Floating Icons --- */}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">What Students Say</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
              Hear from students who have improved their exam performance using our platform.
            </p>
          </div>
          {/* Quote marks */}
          <div className="absolute left-0 top-40 text-9xl text-purple-200 dark:text-purple-900/30 opacity-50 font-serif">"</div>
          <div className="absolute right-0 bottom-20 text-9xl text-purple-200 dark:text-purple-900/30 opacity-50 font-serif transform rotate-180">"</div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
             <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 animate-on-scroll opacity-0 transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">DP</div>
                  <div className="ml-4"><h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Dinuka Perera</h4><p className="text-sm text-purple-600 dark:text-purple-400">Physics & Math Student</p></div>
                  <div className="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg></div>
                </div>
                <div className="mb-4 flex text-yellow-400">{[...Array(5)].map((_, i)=>(<svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                <p className="text-gray-600 dark:text-gray-400 italic mb-4">"The gamified quizzes made studying for physics so much more engaging. I actually look forward to practice sessions now, and my scores have improved significantly."</p>
                <div className="pt-2 text-sm text-gray-500 dark:text-gray-500">Jan 2025 • Physics Student</div>
              </div>
              {/* Testimonial Card 2 */}
              <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 animate-on-scroll opacity-0 transform hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                 <div className="flex items-center mb-6">
                   <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">KM</div>
                   <div className="ml-4"><h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Kavisha Madhavi</h4><p className="text-sm text-purple-600 dark:text-purple-400">Chemistry Student</p></div>
                   <div className="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg></div>
                 </div>
                 <div className="mb-4 flex text-yellow-400">{[...Array(5)].map((_, i)=>(<svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                 <p className="text-gray-600 dark:text-gray-400 italic mb-4">"The AI recommendations helped me identify my weaknesses in organic chemistry. After focusing on those areas, I was able to improve my understanding tremendously."</p>
                 <div className="pt-2 text-sm text-gray-500 dark:text-gray-500">Feb 2025 • Chemistry Student</div>
               </div>
               {/* Testimonial Card 3 */}
               <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800 animate-on-scroll opacity-0 transform hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                 <div className="flex items-center mb-6">
                   <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">AS</div>
                   <div className="ml-4"><h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ashan Silva</h4><p className="text-sm text-purple-600 dark:text-purple-400">Combined Math Student</p></div>
                   <div className="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg></div>
                 </div>
                 <div className="mb-4 flex text-yellow-400">{[...Array(5)].map((_, i)=>(<svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</div>
                 <p className="text-gray-600 dark:text-gray-400 italic mb-4">"The forum discussions helped me understand complex calculus concepts. Being able to ask questions and get quick responses from peers made a huge difference."</p>
                 <div className="pt-2 text-sm text-gray-500 dark:text-gray-500">Mar 2025 • Combined Math Student</div>
               </div>
          </div>
        </div>
      </section>

      {/* ========================== Stats Section ========================== */}
      <section className="py-20 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-950 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dots-pattern opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute left-0 top-1/4 w-80 h-80 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
        {/* --- Stats Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-[20%] left-[10%] text-white/10 text-7xl floating-icon-slow">+15%</div>
          <div className="absolute bottom-[30%] right-[15%] text-white/10 text-8xl floating-icon">9.8</div>
          <div className="absolute top-[50%] left-[30%] text-white/10 text-6xl floating-icon-reverse">📊</div>
          <div className="absolute bottom-[10%] right-[30%] text-white/10 text-9xl floating-icon-slow">💯</div>
           <div className="absolute top-[15%] right-[25%] text-white/10 text-7xl floating-icon">📈</div>
           <div className="absolute bottom-[50%] left-[5%] text-white/10 text-8xl floating-icon-reverse">✔️</div>
        </div>
        {/* --- End Stats Floating Icons --- */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Success in Numbers</h2>
            <div className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-2xl mx-auto text-purple-100 text-xl">
              Our platform has helped thousands of students improve their performance and reach their academic goals.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Stat Cards */}
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0">
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="5000+">0+</div><p className="text-purple-200 text-lg">Active Students</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="200+">0+</div><p className="text-purple-200 text-lg">Practice Quizzes</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="95%">0%</div><p className="text-purple-200 text-lg">Satisfaction Rate</p>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2 counter" data-target="50+">0+</div><p className="text-purple-200 text-lg">Certified Tutors</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== CTA Section ========================== */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-900 to-indigo-800 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dots-pattern opacity-10 mix-blend-overlay"></div>
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-purple-900/0 via-purple-900/20 to-transparent filter blur-3xl"></div>
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-900/20 to-transparent filter blur-3xl"></div>
         {/* --- CTA Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-[20%] left-[5%] w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-white/5 rounded-full animate-float" style={{ animationDuration: '18s', animationDelay: '2s' }}></div>
          <div className="absolute top-[50%] right-[20%] w-16 h-16 bg-white/5 rounded-lg transform rotate-45 animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
           <div className="absolute top-[30%] left-[45%] text-white/5 text-6xl floating-icon-reverse">🚀</div>
           <div className="absolute bottom-[10%] left-[55%] text-white/5 text-8xl floating-icon">🎓</div>
        </div>
        {/* --- End CTA Floating Icons --- */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:pr-6 animate-on-scroll opacity-0">
              {/* CTA Text & List */}
              <span className="bg-purple-700/50 text-purple-100 text-sm font-medium px-4 py-1.5 rounded-full mb-5 inline-block">Limited Time Offer</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to Transform Your A/L Exam Preparation?</h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">Join thousands of students who are already experiencing the benefits of gamified learning. Sign up today and get 30 days of premium features for free!</p>
              <div className="space-y-8">
                 <div className="flex items-start"><div className="bg-purple-700/50 rounded-full p-2 mr-4 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><h3 className="text-xl font-semibold mb-1">Personalized Learning Path</h3><p className="text-purple-100">Get a customized study plan tailored to your strengths and weaknesses.</p></div></div>
                 <div className="flex items-start"><div className="bg-purple-700/50 rounded-full p-2 mr-4 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><h3 className="text-xl font-semibold mb-1">Progress Tracking</h3><p className="text-purple-100">Monitor your improvement with detailed analytics and performance insights.</p></div></div>
                 <div className="flex items-start"><div className="bg-purple-700/50 rounded-full p-2 mr-4 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><h3 className="text-xl font-semibold mb-1">Community Support</h3><p className="text-purple-100">Connect with peers and experts to solve problems together.</p></div></div>
              </div>
            </div>
            {/* Registration Form Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/20 animate-on-scroll opacity-0">
              <h3 className="text-2xl font-bold mb-6 text-center">Get Started For Free</h3>
              <form className="space-y-4" onSubmit={handleCtaSubmit}>
                {/* Name Input */}
                <div>
                  <label htmlFor="name-cta" className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" id="name-cta" name="name" required value={ctaFormData.name} onChange={handleCtaInputChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your name"/>
                </div>
                {/* Email Input */}
                <div>
                  <label htmlFor="email-cta" className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" id="email-cta" name="email" required value={ctaFormData.email} onChange={handleCtaInputChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your email"/>
                </div>
                {/* Password Input */}
                <div>
                  <label htmlFor="password-cta" className="block text-sm font-medium mb-1">Password</label>
                  <input type="password" id="password-cta" name="password" required minLength={8} value={ctaFormData.password} onChange={handleCtaInputChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter password (min 8 chars)"/>
                </div>
                 {/* Confirm Password Input */}
                 <div>
                   <label htmlFor="passwordConfirm-cta" className="block text-sm font-medium mb-1">Confirm Password</label>
                   <input type="password" id="passwordConfirm-cta" name="passwordConfirm" required value={ctaFormData.passwordConfirm} onChange={handleCtaInputChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Confirm your password"/>
                 </div>
                {/* --- Error Display --- */}
                {ctaError && (
                  <div className="p-3 bg-red-900/50 border border-red-700 rounded-md"><p className="text-sm text-red-200">{ctaError}</p></div>
                )}
                {/* --- Submit Button --- */}
                <div className="pt-2">
                  <button type="submit" disabled={ctaIsLoading} className={`w-full bg-white text-purple-900 font-medium py-3 px-4 rounded-lg hover:bg-purple-50 transition-colors duration-300 shadow-lg hover:shadow-white/20 flex items-center justify-center ${ctaIsLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {ctaIsLoading ? (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>)}
                    {ctaIsLoading ? 'Registering...' : 'Register Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== FAQ Section ========================== */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 relative">
         {/* --- FAQ Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Mathematical symbols */}
          <div className="absolute top-[10%] left-[10%] text-red-500/20 dark:text-red-400/10 text-9xl floating-icon-slow">σ</div>
          <div className="absolute top-[65%] right-[12%] text-green-500/20 dark:text-green-400/10 text-10xl floating-icon">τ</div>
          <div className="absolute top-[40%] left-[25%] text-yellow-500/20 dark:text-yellow-400/10 text-8xl floating-icon-reverse">μ</div>
          <div className="absolute bottom-[15%] left-[15%] text-blue-500/20 dark:text-blue-400/10 text-9xl floating-icon-slow">Ω</div>
          <div className="absolute top-[5%] right-[20%] text-pink-500/20 dark:text-pink-400/10 text-7xl floating-icon">η</div>

          {/* Science formulas */}
          <div className="absolute top-[25%] right-[20%] text-indigo-500/20 dark:text-indigo-400/10 text-6xl floating-icon-slow">F=G(m₁m₂/r²)</div>
          <div className="absolute bottom-[35%] right-[8%] text-teal-500/20 dark:text-teal-400/10 text-5xl floating-icon">c=λf</div>
          <div className="absolute bottom-[70%] left-[12%] text-sky-500/20 dark:text-sky-400/10 text-5xl floating-icon-reverse">E=kQ/r²</div>

          {/* Science icons */}
          <div className="absolute top-[50%] right-[30%] opacity-20 dark:opacity-10 floating-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="absolute top-[15%] left-[30%] opacity-20 dark:opacity-10 floating-icon-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
           <div className="absolute bottom-[5%] left-[40%] opacity-20 dark:opacity-10 floating-icon-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-lime-500 dark:text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        {/* --- End FAQ Floating Icons --- */}

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600 dark:from-purple-400 dark:to-purple-300 inline-block">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-xl">
              Find answers to common questions about our platform.
            </p>
          </div>
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">What is the cost of using DEV{"{thon}"}?</h3><p className="text-gray-600 dark:text-gray-300">DEV{"{thon}"} offers a free tier with access to basic features including quizzes, forums, and study materials. Premium features like personalized AI recommendations, video lessons, and expert Q&A sessions are available with a subscription.</p></div>
            {/* FAQ Item 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How do the gamified quizzes work?</h3><p className="text-gray-600 dark:text-gray-300">Our gamified quizzes combine learning with game elements like points, badges, leaderboards, and levels. As you answer questions correctly, you earn points and unlock achievements. This approach makes learning more engaging and motivates consistent practice.</p></div>
            {/* FAQ Item 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0" style={{ animationDelay: '0.2s' }}><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How up-to-date are the study materials?</h3><p className="text-gray-600 dark:text-gray-300">All study materials are regularly updated to align with the latest Sri Lankan A/L curriculum. Our team of educators reviews and refreshes content to ensure it remains current and relevant to your exams.</p></div>
            {/* FAQ Item 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Can I access the platform on mobile devices?</h3><p className="text-gray-600 dark:text-gray-300">Yes, DEV{"{thon}"} is fully responsive and can be accessed on smartphones, tablets, and computers. We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience.</p></div>
            {/* FAQ Item 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 animate-on-scroll opacity-0" style={{ animationDelay: '0.4s' }}><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How does the AI recommendation system work?</h3><p className="text-gray-600 dark:text-gray-300">Our AI system analyzes your quiz performance, studying patterns, and learning history to identify strengths and weaknesses. Based on this analysis, it suggests specific topics to focus on, recommends relevant resources, and creates a personalized learning path to help you improve efficiently.</p></div>
          </div>
        </div>
      </section>

      {/* ========================== Footer ========================== */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-24 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dots-pattern opacity-5 mix-blend-overlay"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-purple-900/30 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-900/20 rounded-full filter blur-3xl opacity-50"></div>

        {/* --- Footer Floating Background Icons --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {/* Mathematical symbols */}
          <div className="absolute top-[10%] left-[7%] text-purple-500/10 dark:text-purple-400/5 text-9xl floating-icon">∞</div>
          <div className="absolute top-[60%] right-[10%] text-blue-500/10 dark:text-blue-400/5 text-8xl floating-icon-reverse">π</div>
          <div className="absolute bottom-[20%] left-[20%] text-green-500/10 dark:text-green-400/5 text-10xl floating-icon-slow">√</div>
           <div className="absolute top-[25%] left-[40%] text-red-500/10 dark:text-red-400/5 text-8xl floating-icon">χ²</div>

          {/* Science formulas */}
          <div className="absolute top-[30%] right-[15%] text-cyan-500/10 dark:text-cyan-400/5 text-6xl floating-icon-slow">E=mc²</div>
          <div className="absolute bottom-[30%] right-[25%] text-amber-500/10 dark:text-amber-400/5 text-5xl floating-icon">PV=nRT</div>
          <div className="absolute top-[75%] left-[30%] text-violet-500/10 dark:text-violet-400/5 text-4xl floating-icon-reverse">a = F/m</div>

           <div className="absolute bottom-[5%] left-[50%] opacity-5 floating-icon-slow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          </div>
        </div>
        {/* --- End Footer Floating Icons --- */}

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            {/* Footer Column 1: Logo & Desc */}
            <div className="md:col-span-1">
               <div className="flex items-center mb-6">
                 <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">DEV<span className="text-white">{"{thon}"}</span></div>
                 <span className="text-xs align-top text-white ml-1 bg-purple-700/50 px-1.5 py-0.5 rounded">2.0</span>
               </div>
               <p className="text-gray-400 mb-6">A gamified learning platform designed for Sri Lankan Advanced Level students.</p>
               <div className="mb-6 flex flex-wrap gap-2">
                   <span className="inline-block bg-purple-800/20 text-purple-400 rounded-full px-3 py-1 text-sm font-medium">#gamifiedlearning</span>
                   <span className="inline-block bg-purple-800/20 text-purple-400 rounded-full px-3 py-1 text-sm font-medium">#ALexams</span>
               </div>
               <div className="flex space-x-5">
                    {/* Social Icons - Add your links */}
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10s4.5 10 10 10 10-4.49 10-10-4.5-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-10.21c1.1 0 2-.89 2-2s-.9-2-2-2-2 .89-2 2 .9 2 2 2zm4 0c1.1 0 2-.89 2-2s-.9-2-2-2-2 .89-2 2 .9 2 2 2z"/></svg></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56c-.88.39-1.83.65-2.83.77 1.01-.6 1.79-1.56 2.16-2.71-.94.56-1.99.97-3.1 1.18-.89-.95-2.17-1.54-3.59-1.54-2.71 0-4.9 2.2-4.9 4.9 0 .38.04.76.13 1.12-4.08-.21-7.7-2.15-10.13-5.14-.42.72-.66 1.56-.66 2.45 0 1.7.87 3.2 2.19 4.08-.81-.03-1.57-.25-2.24-.62v.06c0 2.38 1.69 4.35 3.94 4.8-.41.11-.85.17-1.3.17-.32 0-.63-.03-.93-.09.63 1.95 2.44 3.37 4.59 3.41-1.68 1.32-3.8 2.1-6.1 2.1-.4 0-.79-.02-1.17-.07 2.18 1.39 4.78 2.2 7.57 2.2 9.08 0 14.05-7.51 14.05-14.05 0-.21 0-.42-.01-.63.97-.7 1.81-1.58 2.47-2.56z"/></svg></a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg></a>
               </div>
            </div>
            {/* Footer Column 2: Platform Links */}
            <div>
               <h3 className="text-lg font-medium mb-5 text-white uppercase tracking-wider">Platform</h3>
               <ul className="space-y-4">
                 <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Home</Link></li>
                 <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Dashboard</Link></li>
                 <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Features</Link></li>
                 <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>About Us</Link></li>
                 <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Pricing</Link></li>
               </ul>
            </div>
            {/* Footer Column 3: Resource Links */}
            <div>
               <h3 className="text-lg font-medium mb-5 text-white uppercase tracking-wider">Resources</h3>
               <ul className="space-y-4">
                 <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Blog</Link></li>
                 <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Help Center</Link></li>
                 <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Contact Us</Link></li>
                 <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Terms of Service</Link></li>
                 <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>Privacy Policy</Link></li>
               </ul>
            </div>
            {/* Footer Column 4: Contact & Newsletter */}
            <div>
               <h3 className="text-lg font-medium mb-5 text-white uppercase tracking-wider">Contact</h3>
               <ul className="space-y-4">
                 <li className="flex items-start text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg><span>rothilamehara22@gmail.com</span></li>
                 <li className="flex items-start text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span>0787102992, 0716597404</span></li>
                 <li className="flex items-start text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span>Colombo, Sri Lanka</span></li>
               </ul>
               {/* Newsletter Signup */}
               <div className="mt-8"><h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-3">Subscribe to our newsletter</h4><form className="flex"><input type="email" className="bg-gray-800 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm" placeholder="Your email address" /><button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg px-4 text-sm font-medium transition-colors duration-300">Subscribe</button></form></div>
            </div>
          </div>
          {/* Copyright & Bottom Row */}
          <div className="pt-12 border-t border-gray-800 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <p>© {new Date().getFullYear()} Team Xforce. All rights reserved.</p>
                <div className="mt-4 md:mt-0">
                    <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mx-3">Terms</Link>
                    <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mx-3">Privacy</Link>
                    <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 mx-3">Cookies</Link>
                </div>
            </div>
             <p className="mt-6 text-sm">
              Designed by
              <a href="https://mehara.io" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors duration-300"> Mehara Rothila </a>
              &amp;
              <a href="https://dinith-edirisinghe.onrender.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors duration-300"> Dinith Edirisinghe </a>
               for DEV{"{thon}"} 2.0
             </p>
          </div>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style jsx global>{`
        /* Custom Text sizes for larger symbols */
        .text-10xl { font-size: 9rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .text-11xl { font-size: 10rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }

        /* Floating icons animations */
        .floating-icon {
          animation: float 6s ease-in-out infinite;
          filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1));
        }
        .floating-icon-reverse {
          animation: float-reverse 7s ease-in-out infinite;
          filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1));
        }
        .floating-icon-slow {
          animation: float 10s ease-in-out infinite;
          filter: drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1));
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); } /* Added subtle rotation */
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes float-reverse {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(15px) rotate(-5deg) scale(1.03); } /* Added subtle rotation/scale */
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }

        /* Fade-in and Fade-in-up animations */
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Background rotating shapes animation */
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Background pulsing elements animation */
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; } /* Hero */
          50% { opacity: 0.3; } /* Hero */
          .dark .animate-pulse-slow { /* Overwrite for dark mode if needed */
             0%, 100% { opacity: 0.5; }
             50% { opacity: 0.2; }
          }
        }

         /* Enhanced Opacity pulse for specific areas */
        .hero .animate-pulse-slow { /* Target only hero equations/symbols */
            animation: pulse-slow-hero 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slow-hero {
          0%, 100% { opacity: 0.1; } /* Make them very faint */
          50% { opacity: 0.05; }
        }


        /* Scroll animation initialization (will be triggered by JS) */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          will-change: opacity, transform;
        }

        /* Shadow for feature cards */
        .shadow-game {
          box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.1), 0 4px 6px -4px rgba(147, 51, 234, 0.1);
        }
        .dark .shadow-game-dark {
           box-shadow: 0 10px 15px -3px rgba(107, 33, 168, 0.3), 0 4px 6px -4px rgba(107, 33, 168, 0.3);
        }

        /* Background dots pattern */
        .bg-dots-pattern {
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 15px 15px;
        }
        .dark .bg-dots-pattern {
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }

         /* Line clamp for descriptions */
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
      `}</style>
    </main>
  );
}
