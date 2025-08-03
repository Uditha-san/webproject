import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore user from localStorage or sessionStorage on app load
  useEffect(() => {
    const storedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    const storedToken =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  //  login with support for rememberMe
  const login = (token, userData, rememberMe = true) => {
    setUser(userData);
    setIsAuthenticated(true);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(userData));
  };

  //  logout clears both localStorage and sessionStorage
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
