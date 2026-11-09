/**
 * Authentication Context & Provider
 * ============================================================================
 * Manages global user authentication state across the application.
 * Persists JWT token in localStorage, provides login, registration, and logout
 * actions, and automatically restores session on initial mount.
 * ============================================================================
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider component wraps the app and provides auth state.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate authentication state on initial application load
  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem('devboard_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);
      try {
        const response = await getMe();
        setUser(response.data);
      } catch {
        localStorage.removeItem('devboard_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  /**
   * Register a new user and persist auth state.
   * 
   * @param {Object} formData - User registration details (name, email, password).
   * @returns {Promise<Object>} API response object.
   */
  const register = async (formData) => {
    const response = await registerUser(formData);
    const tokenValue = response.data.token;
    const userValue = response.data.user;
    localStorage.setItem('devboard_token', tokenValue);
    setToken(tokenValue);
    setUser(userValue);
    return response;
  };

  /**
   * Log an existing user in and persist auth state.
   * 
   * @param {Object} formData - Credentials (email, password).
   * @returns {Promise<Object>} API response object.
   */
  const login = async (formData) => {
    const response = await loginUser(formData);
    const tokenValue = response.data.token;
    const userValue = response.data.user;
    localStorage.setItem('devboard_token', tokenValue);
    setToken(tokenValue);
    setUser(userValue);
    return response;
  };

  /**
   * Log the user out and clear auth state.
   */
  const logout = () => {
    localStorage.removeItem('devboard_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication state and handlers.
 * 
 * @returns {{
 *   user: Object|null,
 *   token: string|null,
 *   loading: boolean,
 *   login: Function,
 *   register: Function,
 *   logout: Function,
 *   isAuthenticated: boolean
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
