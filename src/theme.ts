// Theme configuration with auto day/night switching
// Based on DESIGN_ASSETS.md - Modern minimalist with glassmorphism accents

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    surfaceGlass: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderGlow: string;
    primary: string;
    primaryGlow: string;
    // Quadrant colors - consistent across themes
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  shadows: {
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    glow: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    surfaceGlass: 'rgba(255, 255, 255, 0.8)',
    text: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderGlow: 'rgba(139, 92, 246, 0.3)',
    primary: '#8B5CF6',
    primaryGlow: 'rgba(139, 92, 246, 0.25)',
    q1: '#F43F5E',
    q2: '#10B981',
    q3: '#F59E0B',
    q4: '#6B7280',
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    glow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0A0A0F',
    surface: '#12121A',
    surfaceAlt: '#1A1A2E',
    surfaceGlass: 'rgba(18, 18, 26, 0.85)',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#252542',
    borderGlow: 'rgba(139, 92, 246, 0.4)',
    primary: '#A78BFA',
    primaryGlow: 'rgba(167, 139, 250, 0.35)',
    q1: '#F43F5E',
    q2: '#10B981',
    q3: '#F59E0B',
    q4: '#6B7280',
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 4,
    },
    glow: {
      shadowColor: '#A78BFA',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export function getAutoTheme(): Theme {
  const hour = new Date().getHours();
  // Day: 6am - 6pm, Night: 6pm - 6am
  const isDaytime = hour >= 6 && hour < 18;
  return isDaytime ? lightTheme : darkTheme;
}

export function getThemeByName(name: 'light' | 'dark' | 'auto'): Theme {
  if (name === 'auto') return getAutoTheme();
  return name === 'light' ? lightTheme : darkTheme;
}

// Helper to create glass effect background with opacity
export function getGlassBackground(theme: Theme, opacity = 0.85): string {
  return theme.name === 'dark'
    ? `rgba(18, 18, 26, ${opacity})`
    : `rgba(255, 255, 255, ${opacity})`;
}

// Helper to get quadrant glow color
export function getQuadrantGlow(theme: Theme, quadrant: 1 | 2 | 3 | 4): string {
  const colors = {
    1: theme.colors.q1,
    2: theme.colors.q2,
    3: theme.colors.q3,
    4: theme.colors.q4,
  };
  return theme.name === 'dark'
    ? `${colors[quadrant]}40`
    : `${colors[quadrant]}25`;
}
