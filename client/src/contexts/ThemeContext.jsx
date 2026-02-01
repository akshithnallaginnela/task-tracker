import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Theme mode: 'light', 'dark', or 'system'
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark'; // Default to dark
  });

  // Actual applied theme (light or dark)
  const [actualTheme, setActualTheme] = useState('dark');

  // Detect and apply system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      if (themeMode === 'system') {
        const systemIsDark = mediaQuery.matches;
        setActualTheme(systemIsDark ? 'dark' : 'light');
      } else {
        setActualTheme(themeMode);
      }
    };

    // Initial theme application
    updateTheme();

    // Listen for system theme changes
    const handleChange = (e) => {
      if (themeMode === 'system') {
        setActualTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [actualTheme]);

  // Save theme mode preference
  const changeTheme = (newMode) => {
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const value = {
    themeMode,
    actualTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    changeTheme,
    // Legacy compatibility
    theme: actualTheme,
    setTheme: changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
