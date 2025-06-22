
export const modernTheme = {
  colors: {
    // Dark theme backgrounds
    background: '#09090b',
    foreground: '#fafafa',
    card: '#18181b',
    muted: '#27272a',
    
    // Primary color palette - Purple theme
    primary: '#8b5cf6',
    primaryForeground: '#ffffff',
    secondary: '#27272a',
    secondaryForeground: '#a1a1aa',
    accent: '#3f3f46',
    accentForeground: '#fafafa',
    
    // Status colors
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    
    // Text colors
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    textDisabled: '#52525b',
    
    // Border and divider colors
    border: '#3f3f46',
    divider: '#27272a',
    
    // Chart colors palette
    chart: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
      light: '#fafafa',
      dark: '#18181b',
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
};

// Export darkTheme as an alias to modernTheme for compatibility
export const darkTheme = modernTheme;

export type ModernTheme = typeof modernTheme;
