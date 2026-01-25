import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Theme, lightTheme, darkTheme, getAutoTheme } from './theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
  onThemeModeChange?: (mode: ThemeMode) => void;
}

export function ThemeProvider({ children, initialMode = 'auto', onThemeModeChange }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialMode);
  const [theme, setTheme] = useState<Theme>(() => {
    if (initialMode === 'auto') return getAutoTheme();
    return initialMode === 'light' ? lightTheme : darkTheme;
  });

  const updateTheme = useCallback(() => {
    if (themeMode === 'auto') {
      setTheme(getAutoTheme());
    } else {
      setTheme(themeMode === 'light' ? lightTheme : darkTheme);
    }
  }, [themeMode]);

  useEffect(() => {
    updateTheme();
  }, [themeMode, updateTheme]);

  // Update auto theme every minute to handle day/night transition
  useEffect(() => {
    if (themeMode !== 'auto') return;

    const interval = setInterval(() => {
      updateTheme();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [themeMode, updateTheme]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    onThemeModeChange?.(mode);
  }, [onThemeModeChange]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        isDark: theme.name === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
