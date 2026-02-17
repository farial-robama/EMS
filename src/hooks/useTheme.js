// src/hooks/useTheme.js
import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme - custom hook to manage dark mode
 * - Reads from localStorage or system preference
 * - Applies 'dark' class to <html> and <body>
 * - Persists user preference
 */
const useTheme = () => {
  // Initialize darkMode: saved -> system -> default false
  const [darkMode, setDarkModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;

      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return true;
      return false;
    } catch {
      return false;
    }
  });

  // Track if user explicitly chose a theme
  const [isUserPreference, setIsUserPreference] = useState(() => {
    try {
      return !!localStorage.getItem('theme');
    } catch {
      return false;
    }
  });

  // Apply/remove dark class
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }

      if (isUserPreference) {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      }
    } catch {}
  }, [darkMode, isUserPreference]);

  // Listen to system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!isUserPreference) setDarkModeState(e.matches);
    };

    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handler);
    else mediaQuery.addListener(handler);

    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', handler);
      else mediaQuery.removeListener(handler);
    };
  }, [isUserPreference]);

  const setDarkMode = useCallback((value) => {
    setIsUserPreference(true);
    setDarkModeState((prev) => (typeof value === 'function' ? value(prev) : value));
  }, []);

  const toggleTheme = useCallback(() => setDarkMode((prev) => !prev), [setDarkMode]);

  return { darkMode, toggleTheme, setDarkMode };
};

export default useTheme;
