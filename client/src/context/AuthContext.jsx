import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../services/authService';

const TOKEN_KEY = 'token';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => { //callback is used to prevent unnecessary re-renders of components consuming this context when logout function is passed as a dependency its function reference will change on every render causing those components to re-render even if they don't need to
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      const normalizedUser = response?.data ?? response?.user ?? null;
      setUser(normalizedUser);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {//useEffect is used to call refreshUser when the AuthProvider component mounts. This ensures that when the application loads, it checks if there's a valid token in localStorage and fetches the current user's information accordingly. If the token is invalid or expired, it will log the user out by clearing the token and user state.
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((token, userPayload = null) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userPayload);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}