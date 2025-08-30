import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, ThemeElement } from '../enums/theme.enum';

interface ThemeColors {
  [ThemeElement.BACKGROUND]: string;
  [ThemeElement.TEXT]: string;
  [ThemeElement.ACCENT]: string;
  [ThemeElement.CARD]: string;
  [ThemeElement.BORDER]: string;
  [ThemeElement.SHADOW]: string;
}

interface ThemeContextType {
  currentTheme: ThemeMode;
  toggleTheme: () => void;
  getThemeColor: (element: ThemeElement) => string;
  isDarkMode: boolean;
}

const lightTheme: ThemeColors = {
  [ThemeElement.BACKGROUND]: '#f8f9fa',
  [ThemeElement.TEXT]: '#1a1a1a',
  [ThemeElement.ACCENT]: '#ffb400',
  [ThemeElement.CARD]: '#ffffff',
  [ThemeElement.BORDER]: '#e9ecef',
  [ThemeElement.SHADOW]: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme: ThemeColors = {
  [ThemeElement.BACKGROUND]: 'linear-gradient(180deg, #0f0f0f, #1a1a1a)',
  [ThemeElement.TEXT]: '#e5e5e5',
  [ThemeElement.ACCENT]: '#ffb400',
  [ThemeElement.CARD]: 'rgba(26, 26, 26, 0.9)',
  [ThemeElement.BORDER]: '#2d2d2d',
  [ThemeElement.SHADOW]: 'rgba(0, 0, 0, 0.3)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(ThemeMode.LIGHT);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === ThemeMode.DARK) {
      setCurrentTheme(ThemeMode.DARK);
    }
  }, []);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', currentTheme);
    
    // Apply theme to body and document
    const root = document.documentElement;
    const body = document.body;
    
    if (currentTheme === ThemeMode.DARK) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => 
      prev === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT
    );
  };

  const getThemeColor = (element: ThemeElement): string => {
    const theme = currentTheme === ThemeMode.DARK ? darkTheme : lightTheme;
    return theme[element];
  };

  const isDarkMode = currentTheme === ThemeMode.DARK;

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      toggleTheme, 
      getThemeColor, 
      isDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
