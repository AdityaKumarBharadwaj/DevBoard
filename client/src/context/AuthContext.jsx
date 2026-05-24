import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider component wraps the app and provides auth state.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
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
   * @param {Object} formData
   * @returns {Promise<Object>}
   */
  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      const tokenValue = response.data.token;
      const userValue = response.data.user;
      localStorage.setItem('devboard_token', tokenValue);
      setToken(tokenValue);
      setUser(userValue);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Login an existing user and persist auth state.
   * @param {Object} formData
   * @returns {Promise<Object>}
   */
  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      const tokenValue = response.data.token;
      const userValue = response.data.user;
      localStorage.setItem('devboard_token', tokenValue);
      setToken(tokenValue);
      setUser(userValue);
      return response;
    } catch (error) {
      throw error;
    }
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
      <div className="min-h-screen flex items-center justify-center bg-[#0b0d18] text-white">
        <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-white animate-spin" />
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
 * Custom hook to access auth state.
 * @returns {Object}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
