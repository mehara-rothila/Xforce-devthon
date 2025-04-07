// src/app/(auth)/reset-password/page.tsx

'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api'; // Adjust path if needed

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    passwordConfirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error on input change
    if (successMessage) setSuccessMessage(null); // Clear success message
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // --- Client-side Validation ---
    if (!formData.email || !formData.otp || !formData.password || !formData.passwordConfirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }
     if (formData.password !== formData.passwordConfirm) {
      setError('New passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
        setError('New password must be at least 8 characters long.');
        return;
    }
     // Basic OTP format check (e.g., 6 digits)
    if (!/^\d{6}$/.test(formData.otp)) {
        setError('Please enter a valid 6-digit OTP.');
        return;
    }
    // -----------------------------

    setIsLoading(true);

    try {
      // Call the backend endpoint (we'll implement the backend logic next)
      const response = await api.auth.resetPassword({
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm, // Send confirmation for backend validation too
      });

      console.log('Password reset successful:', response.data);
      setSuccessMessage(response.data.message || 'Password has been reset successfully! You can now log in.');
      // Clear form after success
      setFormData({ email: '', otp: '', password: '', passwordConfirm: '' });
      // Optional: Redirect to login after a short delay
      // setTimeout(() => router.push('/login'), 3000);

    } catch (err: any) {
      console.error('Password reset failed:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please check your details or request a new OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 font-['Inter',_sans-serif]">
       {/* Decorative elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[5%] right-[5%] w-60 h-60 bg-green-100 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '21s' }}></div>
         <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-teal-100 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '24s', animationDelay: '3s' }}></div>
       </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-base text-gray-600 dark:text-gray-300">
            Enter your email, the OTP sent to your inbox, and your new password.
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 dark:border-dark-border transition-all duration-300">
          {/* Show success message or the form */}
          {successMessage ? (
             <div className="p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md text-center">
                <p className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Success!</p>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">{successMessage}</p>
                <Link href="/login" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-150">
                    Proceed to Login
                </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
               {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  One-Time Password (OTP)
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text" // Use text to allow leading zeros if any, backend handles validation
                    inputMode="numeric" // Hint for mobile keyboards
                    autoComplete="one-time-code"
                    required
                    maxLength={6} // Assuming 6-digit OTP
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 tracking-widest text-center" // Added tracking and center align
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                 <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters long.</p>
              </div>

              {/* Confirm New Password Input */}
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-500 sm:text-sm transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* --- Error Display --- */}
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* --- Submit Button --- */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
           )}
        </div>
      </div>
       {/* Add the animation styles */}
       <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
