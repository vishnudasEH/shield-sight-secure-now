
export const modernTheme = {
  colors: {
    // Clean modern backgrounds
    background: '#fafafa',
    foregroun: '#0f172a',
    card: '#ffffff',
    muted: '#f8fafc',
    
    // Primary color palette
    primary: '#6366f1',
    primaryForeground: '#ffffff',
    secondary: '#f1f5f9',
    secondaryForeground: '#334155',
    accent: '#f3f4f6',
    accentForeground: '#1f2937',
    
    // Status colors
    success: '#10b981',
    successGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: '#f59e0b',
    warningGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    danger: '#ef4444',
    dangerGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: '#3b82f6',
    infoGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    
    // Text colors
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    textDisabled: '#cbd5e1',
    
    // Border and divider colors
    border: '#e5e7eb',
    divider: '#f3f4f6',
    
    // Chart colors palette
    chart: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
      light: '#f8fafc',
      dark: '#1e293b',
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
    fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
