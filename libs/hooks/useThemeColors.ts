import { useTheme } from '../contexts/ThemeContext';
import { ThemeElement } from '../enums/theme.enum';

export const useThemeColors = () => {
  const { getThemeColor, isDarkMode } = useTheme();
  
  return {
    background: getThemeColor(ThemeElement.BACKGROUND),
    text: getThemeColor(ThemeElement.TEXT),
    accent: getThemeColor(ThemeElement.ACCENT),
    card: getThemeColor(ThemeElement.CARD),
    border: getThemeColor(ThemeElement.BORDER),
    shadow: getThemeColor(ThemeElement.SHADOW),
    isDarkMode,
    
    // Convenience methods for common use cases
    getCardStyle: () => ({
      backgroundColor: getThemeColor(ThemeElement.CARD),
      color: getThemeColor(ThemeElement.TEXT),
      borderColor: getThemeColor(ThemeElement.BORDER),
      boxShadow: `0 2px 8px ${getThemeColor(ThemeElement.SHADOW)}`,
    }),
    
    getButtonStyle: () => ({
      backgroundColor: getThemeColor(ThemeElement.ACCENT),
      color: '#1a1a1a', // Always dark text on golden background
    }),
    
    getTextStyle: () => ({
      color: getThemeColor(ThemeElement.TEXT),
    }),
  };
};
