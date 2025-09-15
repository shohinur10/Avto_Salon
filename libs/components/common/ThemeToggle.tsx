import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeElement } from '../../enums/theme.enum';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme, getThemeColor } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: getThemeColor(ThemeElement.ACCENT),
          backgroundColor: 'rgba(255, 180, 0, 0.1)',
          border: `1px solid ${getThemeColor(ThemeElement.ACCENT)}`,
          borderRadius: '50%',
          width: 42,
          height: 42,
          marginRight: 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 180, 0, 0.2)',
            border: `1px solid ${getThemeColor(ThemeElement.ACCENT)}`,
            transform: 'scale(1.1) rotate(5deg)',
            boxShadow: `0 4px 12px ${getThemeColor(ThemeElement.ACCENT)}40`,
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <Box
													
          sx={{
            fontSize: '20px',
            transition: 'all 0.3s ease',
            transform: isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
