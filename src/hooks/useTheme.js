import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme - custom hook to manage dark mode across the app
 * - Initializes from localStorage if available, otherwise falls back to system preference
 * - Applies/removes 'dark' class on <html> and <body> immediately
 * - Persists explicit user choices to localStorage
 * - Listens to system preference changes when user hasn't chosen a preference
 *
 * Returns: { darkMode, toggleTheme, setDarkMode }
 */
export default function useTheme() {
  // Helper to safely read localStorage / matchMedia
  const safeGetSavedTheme = () => {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  };

  const safePrefersDark = () => {
    try {
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  };

  // Initialize darkMode: saved -> system -> default false
  const [darkModeState, setDarkModeState] = useState(() => {
    const saved = safeGetSavedTheme();
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return safePrefersDark();
  });

  // Track whether the user explicitly chose a theme (saved in localStorage)
  const [isUserPreference, setIsUserPreference] = useState(() => {
    return !!safeGetSavedTheme();
  });

  // Apply/remove 'dark' class and persist if it's a user preference
  useEffect(() => {
    try {
      if (darkModeState) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }

      // Persist only when user explicitly selected a theme
      if (isUserPreference) {
        localStorage.setItem('theme', darkModeState ? 'dark' : 'light');
      }
    } catch (e) {
      // ignore errors (e.g., SSR or blocked storage)
    }
  }, [darkModeState, isUserPreference]);

  // Listen to system theme changes only when user hasn't explicitly chosen a theme
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      try {
        // don't override explicit user preference
        if (safeGetSavedTheme()) return;
        setDarkModeState(e.matches);
      } catch (err) {
        // ignore
      }
    };

    if (mql.addEventListener) mql.addEventListener('change', handleChange);
    else if (mql.addListener) mql.addListener(handleChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handleChange);
      else if (mql.removeListener) mql.removeListener(handleChange);
    };
  }, []);

  // Setter that marks choice as explicit and persists
  const setDarkMode = (value) => {
    setIsUserPreference(true);

    if (typeof value === 'function') {
      setDarkModeState(prev => {
        const next = value(prev);
        try {
          localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch (e) {}
        return next;
      });
    } else {
      const next = Boolean(value);
      setDarkModeState(next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch (e) {}
    }
  };

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  return {
    darkMode: darkModeState,
    toggleTheme,
    setDarkMode,
  };
}
