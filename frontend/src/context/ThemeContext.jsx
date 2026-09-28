import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Website is permanently locked to dark theme
  const theme = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    try {
      localStorage.setItem('tsh-theme', 'dark');
    } catch (e) {
      // ignore storage access errors
    }
  }, []);

  const toggleTheme = () => {
    // Permanent dark mode - no-op to ensure backwards compatibility
  };

  const setTheme = () => {
    // Permanent dark mode - no-op
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: 'dark',
        isDark: true,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
