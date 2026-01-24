// Categories - managed separately, reused across tasks
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
}

// Individual task/activity entry
export interface TaskEntry {
  id: string;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  categoryId: string;
  duration: number; // minutes
  date: string; // "2026-01-23"
  createdAt: string;
}

// Calculated summaries
export interface QuadrantBreakdown {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface DaySummary {
  date: string;
  tasks: TaskEntry[];
  totalMinutes: number;
  quadrantMinutes: QuadrantBreakdown;
  q2Percentage: number;
}

export interface WeekSummary {
  weekStart: string;
  days: DaySummary[];
  totalMinutes: number;
  quadrantMinutes: QuadrantBreakdown;
  q2Percentage: number;
  categoryBreakdown: Record<string, number>;
}

// Quadrant metadata
export const QUADRANT_INFO = {
  1: { label: 'Q1', name: 'Urgent & Important', color: '#ef4444', description: 'Crises, deadlines' },
  2: { label: 'Q2', name: 'Important, Not Urgent', color: '#10b981', description: 'Growth, strategy' },
  3: { label: 'Q3', name: 'Urgent, Not Important', color: '#f59e0b', description: 'Interruptions' },
  4: { label: 'Q4', name: 'Not Urgent or Important', color: '#6b7280', description: 'Time wasters' },
} as const;

// Duration presets in minutes
export const DURATION_PRESETS = [15, 30, 60, 120] as const;

export type Quadrant = 1 | 2 | 3 | 4;
