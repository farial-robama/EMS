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
// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

const useTheme = () => {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    
    // Default to light mode
    return false;
  });

  // Apply theme to document on mount and when darkMode changes
  useEffect(() => {
    const applyTheme = (isDark) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    applyTheme(darkMode);
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if no user preference is saved
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const setTheme = (theme) => {
    if (theme === 'dark') {
      setDarkMode(true);
    } else if (theme === 'light') {
      setDarkMode(false);
    }
  };

  return {
    darkMode,
    toggleTheme,
    setDarkMode,
    setTheme,
  };
};

export default useTheme;
