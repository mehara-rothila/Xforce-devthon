// src/app/context/AuthContext.tsx (Corrected Argument Order)
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import api from '@/utils/api'; // Adjust path if needed

// Define the structure of the User object (ensure it matches your backend response)
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator'; // Use specific roles
  // Add other relevant fields: level, xp, points etc. if needed by frontend
}

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // *** MODIFIED: Swapped argument order to match login page call ***
  login: (token: string, userData: User) => void; // token first, then userData
  logout: () => void;
  fetchUser: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Function to fetch user data based on stored token
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Keep loading true while fetching, even if user exists from previous state
    // This ensures we always try to get the latest user data on load/refresh
    setIsLoading(true);
    try {
      const response = await api.auth.getMe();
      if (response.data?.status === 'success' && response.data?.data?.user) {
        console.log('[AuthContext FETCH] User data fetched successfully:', response.data.data.user);
         if (!response.data.data.user._id) {
             console.error('[AuthContext FETCH] ERROR: Fetched user data is missing _id!');
             // Handle appropriately - maybe logout?
             localStorage.removeItem('token');
             setUser(null);
         } else {
            setUser(response.data.data.user);
         }
      } else {
        console.log('[AuthContext FETCH] Failed to fetch user data or invalid response format.');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error: any) {
      console.error('[AuthContext FETCH] Error fetching user data:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed fetchUser from dependency array to avoid potential loops if fetchUser itself changes

  // Run fetchUser on initial mount
  useEffect(() => {
    console.log("[AuthContext] Initial mount: Fetching user...");
    fetchUser();
  }, [fetchUser]); // fetchUser is stable due to useCallback with empty dependency array

  // Function to update state on login
  // *** MODIFIED: Swapped argument order in function definition ***
  const login = (token: string, userData: User) => {
    try {
        console.log('[AuthContext LOGIN] login called. Setting token and user state.');
        localStorage.setItem('token', token); // Store the token string

        // Log the received user data to confirm it has _id BEFORE setting state
        console.log('[AuthContext LOGIN] User data received:', JSON.stringify(userData, null, 2));
        if (!userData._id) {
             console.error('[AuthContext LOGIN] ERROR: userData received is missing _id!');
             // Maybe throw an error or handle this case where login response is incomplete
        }

        setUser(userData); // Set the user object state
        // Note: No need to set isAuthenticated state if you derive it from `user !== null`
        // Setting isLoading to false might be redundant if fetchUser already handled it,
        // but can be added if needed: setIsLoading(false);
        console.log('[AuthContext LOGIN] User state updated.');

    } catch (error) {
        console.error('[AuthContext LOGIN] Error during login state update:', error);
        // Optionally clear state on error
        localStorage.removeItem('token');
        setUser(null);
    }
  };

  // Function to update state on logout
  const logout = () => {
    console.log('[AuthContext LOGOUT] Logging out.');
    localStorage.removeItem('token');
    setUser(null);
    // Optionally redirect here or let components handle redirect based on null user
    // router.push('/login'); // Example if context handles redirect
  };

  // Provide state and functions through context
  // Use useMemo to optimize context value if necessary, especially if context re-renders often
  const value = { user, isLoading, login, logout, fetchUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
