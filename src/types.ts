export interface Task {
  id: number;
  title: string;
  week: string;
  done: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
}

export interface WeekStats {
  total: number;
  completed: number;
}

export interface WeekWithStats {
  week: string;
  stats: WeekStats;
  dates: { start: string; end: string };
}
