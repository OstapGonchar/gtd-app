// Theme configuration with auto day/night switching

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    primary: string;
    // Quadrant colors stay consistent
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    primary: '#8B5CF6',
    q1: '#F43F5E',
    q2: '#10B981',
    q3: '#F59E0B',
    q4: '#6B7280',
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0A0A0F',
    surface: '#12121A',
    surfaceAlt: '#1A1A2E',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#252542',
    primary: '#8B5CF6',
    q1: '#F43F5E',
    q2: '#10B981',
    q3: '#F59E0B',
    q4: '#6B7280',
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
