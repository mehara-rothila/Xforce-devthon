// src/app/(auth)/register/page.tsx

'use client'; // Add this directive for React hooks

import Link from 'next/link';
import { useState, FormEvent } from 'react'; // Import useState and FormEvent
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import api from '../../../utils/api'; // Import the API utility (adjust path if needed)

// Define an interface for the API response (optional but good practice)
interface RegisterResponse {
  status: string;
  token: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      // Add other relevant user fields if needed
    };
  };
}

export default function Register() {
  const router = useRouter(); // Initialize router for redirection

  // --- State Variables ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State for selected subjects (using an object for easier checking)
  const [selectedSubjects, setSelectedSubjects] = useState<Record<string, boolean>>({
    physics: false,
    chemistry: false,
    math: false,
  });


  // --- Input Change Handler ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  // --- Subject Checkbox Handler ---
   const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target; // Use id ('physics', 'chemistry', 'math')
    setSelectedSubjects(prev => ({
      ...prev,
      [id]: checked,
    }));
  };

  // --- Form Submit Handler ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors

    // 1. Client-side Validation
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
     if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    if (!formData.terms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }
    // Basic email format check (more robust validation is on backend)
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // Get selected subject names (we won't send these yet, but collect them)
    const subjectsToRegister = Object.keys(selectedSubjects).filter(key => selectedSubjects[key]);
    console.log('Selected subjects (not sent to backend yet):', subjectsToRegister);


    setIsLoading(true); // Set loading state

    try {
      // 2. Prepare Data Payload (only send necessary fields for now)
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        // subjects: subjectsToRegister // <-- DO NOT SEND SUBJECTS YET (backend needs IDs)
      };

      console.log('Sending registration data:', { name: payload.name, email: payload.email }); // Log payload (excluding password)

      // 3. Call API using the auth service from api.js
      const response = await api.auth.register(payload);

      console.log('Registration successful:', response.data);

      // 4. Handle Success
      // Store token in localStorage
      if (response.data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        // Optionally store user data (e.g., in context or Zustand)
        // localStorage.setItem('user', JSON.stringify(response.data.data.user));
         console.log('Token stored in localStorage');
      } else {
          console.warn('Token not found in registration response.');
          // Decide how to handle this - maybe proceed but log warning, or show error
      }

      // Redirect to dashboard (or login page)
      router.push('/dashboard'); // Redirect to dashboard after successful registration

    } catch (err: any) {
      // 5. Handle Error
      console.error('Registration failed:', err);
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        // Use the error message from the backend API if available
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Enhanced background with mathematical/scientific elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" id="register-page-background">
        {/* Mathematical symbols - Randomly placed */}
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

        {/* Science formulas */}
        <div className="absolute top-[14%] left-[31%] text-indigo-500 dark:text-indigo-400 text-6xl opacity-65 floating-icon-slow">E=mc²</div>
        <div className="absolute top-[58%] left-[48%] text-teal-500 dark:text-teal-400 text-5xl opacity-60 floating-icon">F=ma</div>
        <div className="absolute top-[39%] left-[76%] text-violet-500 dark:text-violet-400 text-6xl opacity-65 floating-icon-reverse">H₂O</div>
        <div className="absolute bottom-[17%] left-[52%] text-rose-500 dark:text-rose-400 text-6xl opacity-60 floating-icon">PV=nRT</div>
        <div className="absolute bottom-[53%] left-[24%] text-emerald-500 dark:text-emerald-400 text-5xl opacity-65 floating-icon-slow">v=λf</div>
        <div className="absolute top-[86%] left-[11%] text-sky-500 dark:text-sky-400 text-5xl opacity-55 floating-icon-reverse">C₆H₁₂O₆</div>
        <div className="absolute top-[68%] right-[31%] text-amber-500 dark:text-amber-400 text-6xl opacity-60 floating-icon">E=hf</div>

        {/* Science icons */}
        <div className="absolute top-[41%] left-[8%] opacity-60 floating-icon-slow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-36 w-36 text-cyan-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>

        <div className="absolute top-[17%] right-[7%] opacity-60 floating-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <div className="absolute bottom-[7%] left-[36%] opacity-60 floating-icon-reverse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-44 w-44 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Decorative elements - keep original blur circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[15%] right-[15%] w-64 h-64 bg-purple-100 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '17s' }}></div>
        <div className="absolute bottom-[15%] left-[10%] w-72 h-72 bg-indigo-100 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '20s', animationDelay: '3s' }}></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Join Our Learning Community
          </h2>
          <p className="mt-2 text-center text-base text-gray-600 dark:text-gray-300">
            Create your account and start your learning journey
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-150">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white dark:bg-dark-card py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 dark:border-dark-border transition-all duration-300 hover:shadow-2xl dark:hover:shadow-purple-900/20">
          {/* --- FORM --- */}
          <form className="space-y-6" onSubmit={handleSubmit}> {/* Use onSubmit */}
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                 </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="John Doe"
                  value={formData.name} // Bind value
                  onChange={handleInputChange} // Add onChange
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                   </svg>
                 </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email} // Bind value
                  onChange={handleInputChange} // Add onChange
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.password} // Bind value
                  onChange={handleInputChange} // Add onChange
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Password must be at least 8 characters long</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm" // Correct name attribute
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.passwordConfirm} // Bind value
                  onChange={handleInputChange} // Add onChange
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Your Subjects (Optional)</label>
              <div className="grid grid-cols-1 gap-3">
                {/* Physics option */}
                <div className="relative flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-200 dark:hover:border-purple-700 transition-colors duration-200 bg-white dark:bg-gray-800 shadow-sm">
                  <input
                    id="physics" // Use id for mapping
                    name="subjects" // Keep name for grouping if needed by styles/logic
                    type="checkbox"
                    checked={selectedSubjects.physics} // Bind checked state
                    onChange={handleSubjectChange} // Use specific handler
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
                  />
                  <div className="ml-3 flex items-center flex-1">
                    <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 flex-shrink-0">
                      {/* Physics Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <label htmlFor="physics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Physics
                    </label>
                  </div>
                </div>
                {/* Chemistry option */}
                 <div className="relative flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-200 dark:hover:border-purple-700 transition-colors duration-200 bg-white dark:bg-gray-800 shadow-sm">
                  <input
                    id="chemistry" // Use id for mapping
                    name="subjects"
                    type="checkbox"
                    checked={selectedSubjects.chemistry} // Bind checked state
                    onChange={handleSubjectChange} // Use specific handler
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
                  />
                  <div className="ml-3 flex items-center flex-1">
                    <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2 flex-shrink-0">
                       {/* Chemistry Icon */}
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <label htmlFor="chemistry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Chemistry
                    </label>
                  </div>
                </div>
                {/* Combined Math option */}
                 <div className="relative flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-200 dark:hover:border-purple-700 transition-colors duration-200 bg-white dark:bg-gray-800 shadow-sm">
                  <input
                    id="math" // Use id for mapping
                    name="subjects"
                    type="checkbox"
                    checked={selectedSubjects.math} // Bind checked state
                    onChange={handleSubjectChange} // Use specific handler
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
                  />
                  <div className="ml-3 flex items-center flex-1">
                    <div className="h-7 w-7 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2 flex-shrink-0">
                      {/* Math Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <label htmlFor="math" className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      Combined Math
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms} // Bind value
                onChange={handleInputChange} // Add onChange
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium transition-colors duration-150">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* --- Error Display --- */}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* --- Submit Button --- */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading} // Disable button when loading
                className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-xl text-base font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'animated-pulse-subtle'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <span className="absolute inset-0 rounded-xl overflow-hidden">
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/30 to-indigo-400/30 animate-pulse-slow"></span>
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Add the enhanced animation styles */}
      <style jsx global>{`
        /* Original float animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        /* Enhanced text sizes for larger symbols */
        .text-10xl { font-size: 9rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .text-11xl { font-size: 10rem; text-shadow: 0 8px 16px rgba(0,0,0,0.1); }

        /* Enhanced background floating icons animations */
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

        @keyframes float-reverse {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(15px) rotate(-5deg) scale(1.05); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }

        /* Enhanced animations */
        .animate-pulse-slow { 
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-slow { 
          0%, 100% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.7; transform: scale(0.98); } 
        }
        
        /* Subtle pulse animation for the create account button */
        .animated-pulse-subtle {
          position: relative;
          overflow: hidden;
        }
        
        .animated-pulse-subtle::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0));
          transform: translateX(-100%);
          animation: shine 3s infinite;
        }
        
        @keyframes shine {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in { 
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        
        .animate-fade-in-up { 
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
      `}</style>
    </div>
  );
}