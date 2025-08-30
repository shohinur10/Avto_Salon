# Theme Switching Implementation

## Overview
This document describes the implementation of a light/dark mode theme switcher for the Avto Salon website.

## Components Created

### 1. ThemeContext (libs/contexts/ThemeContext.tsx)
- Manages theme state (light/dark mode)
- Provides theme values throughout the application
- Persists theme preference in localStorage
- Applies theme classes to document.body

### 2. ThemeToggle Component (libs/components/common/ThemeToggle.tsx)
- Displays moon (🌙) or sun (☀️) icon based on current theme
- Styled with golden (#ffb400) accent color
- Includes hover effects and tooltips
- Positioned in the top navbar

## Theme Specifications

### Light Mode
- Background: #f8f9fa (bright soft gray/white)
- Text: #1a1a1a (dark gray)
- Accent: #ffb400 (golden)

### Dark Mode
- Background: linear-gradient(180deg, #0f0f0f, #1a1a1a)
- Text: #e5e5e5 (light gray)
- Accent: #ffb400 (same golden for consistency)

## Implementation Details

### 1. Navbar Integration
- Theme toggle button added to Top.tsx component
- Positioned in user-box section next to login/user menu
- Styled with golden accent color and hover effects

### 2. CSS Styling
- Theme-specific styles added to app.scss
- Body classes (.light-mode, .dark-mode) control global theming
- Main content area (#pc-wrap #main) changes background and text colors
- Component-specific overrides for cards, buttons, and other UI elements

### 3. Theme Persistence
- Theme preference saved to localStorage
- Automatically restored on page reload
- Default theme: Light Mode

## Usage

### For Developers
1. Import and use the `useTheme` hook in components:
```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { isDarkMode, theme } = useTheme();
  // Use theme values
};
```

2. Wrap your app with ThemeProvider in _app.tsx:
```tsx
import { ThemeProvider } from '../libs/contexts/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### For Users
- Click the theme toggle button (🌙/☀️) in the top navbar
- Theme switches instantly between light and dark modes
- Preference is remembered across browser sessions

## Files Modified

1. **libs/contexts/ThemeContext.tsx** - New theme context
2. **libs/components/common/ThemeToggle.tsx** - New theme toggle component
3. **libs/components/Top.tsx** - Added theme toggle to navbar
4. **scss/app.scss** - Added theme-specific CSS classes
5. **scss/pc/main.scss** - Updated navbar styling for theme toggle

## Notes
- Header and footer backgrounds remain unchanged as per requirements
- Only middle content sections change colors when switching themes
- Theme toggle button is styled consistently with the golden accent color
- Responsive design maintained for mobile and desktop layouts
