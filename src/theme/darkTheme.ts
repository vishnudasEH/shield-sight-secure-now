
export const darkTheme = {
  colors: {
    // Primary dark background
    primary: '#121212',
    secondary: '#1e1e1e',
    surface: '#252525',
    background: '#0f0f0f',
    
    // Light Blue template accent colors
    blue: '#4e73df',
    blueGradient: 'linear-gradient(135deg, #4e73df 0%, #6f42c1 100%)',
    purple: '#6f42c1',
    purpleGradient: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
    success: '#1cc88a',
    successGradient: 'linear-gradient(135deg, #1cc88a 0%, #36b9cc 100%)',
    warning: '#f6c23e',
    warningGradient: 'linear-gradient(135deg, #f6c23e 0%, #fd7e14 100%)',
    danger: '#e74a3b',
    dangerGradient: 'linear-gradient(135deg, #e74a3b 0%, #dc3545 100%)',
    info: '#36b9cc',
    infoGradient: 'linear-gradient(135deg, #36b9cc 0%, #1cc88a 100%)',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
    textMuted: '#6c757d',
    textDisabled: '#495057',
    
    // Border and divider colors
    border: '#333333',
    divider: '#404040',
    
    // Sidebar colors
    sidebarBg: '#1a1a1a',
    sidebarText: '#ffffff',
    sidebarTextMuted: '#adb5bd',
    sidebarActive: '#4e73df',
    
    // Chart colors palette
    chart: {
      primary: '#4e73df',
      secondary: '#6f42c1',
      success: '#1cc88a',
      warning: '#f6c23e',
      danger: '#e74a3b',
      info: '#36b9cc',
      light: '#f8f9fc',
      dark: '#5a5c69',
      gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      gradient5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
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
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
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
    },
  },
};

export type DarkTheme = typeof darkTheme;
