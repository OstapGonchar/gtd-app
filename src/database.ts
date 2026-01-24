import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, TaskEntry, DaySummary, QuadrantBreakdown } from './types';

const TASKS_KEY = 'q2_tasks';
const CATEGORIES_KEY = 'q2_categories';

// Default categories seeded on first launch
const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Deep Work', color: '#8b5cf6', icon: '🎯' },
  { name: 'Meetings', color: '#f59e0b', icon: '👥' },
  { name: '1:1s', color: '#10b981', icon: '🤝' },
  { name: 'Admin', color: '#6b7280', icon: '📋' },
  { name: 'Firefighting', color: '#ef4444', icon: '🔥' },
  { name: 'Learning', color: '#3b82f6', icon: '📚' },
  { name: 'Planning', color: '#8b5cf6', icon: '🗺️' },
  { name: 'Email/Slack', color: '#f59e0b', icon: '💬' },
];

// ============ Helpers ============

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// ============ Categories ============

async function getAllCategories(): Promise<Category[]> {
  const data = await AsyncStorage.getItem(CATEGORIES_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveCategories(categories: Category[]): Promise<void> {
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export async function getCategories(): Promise<Category[]> {
  return getAllCategories();
}

export async function addCategory(name: string, color: string, icon?: string): Promise<Category> {
  const categories = await getAllCategories();
  const newCategory: Category = {
    id: generateId(),
    name,
    color,
    icon,
    createdAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  await saveCategories(categories);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
  const categories = await getAllCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    await saveCategories(categories);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getAllCategories();
  const filtered = categories.filter(c => c.id !== id);
  await saveCategories(filtered);
}

// ============ Tasks ============

async function getAllTasks(): Promise<TaskEntry[]> {
  const data = await AsyncStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveTasks(tasks: TaskEntry[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function addTask(
  title: string,
  quadrant: 1 | 2 | 3 | 4,
  categoryId: string,
  duration: number,
  date?: string
): Promise<TaskEntry> {
  const tasks = await getAllTasks();
  const newTask: TaskEntry = {
    id: generateId(),
    title,
    quadrant,
    categoryId,
    duration,
    date: date || getTodayDate(),
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
}

export async function updateTask(id: string, updates: Partial<Omit<TaskEntry, 'id' | 'createdAt'>>): Promise<void> {
  const tasks = await getAllTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    await saveTasks(tasks);
  }
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = await getAllTasks();
  const filtered = tasks.filter(t => t.id !== id);
  await saveTasks(filtered);
}

export async function getTasksForDate(date: string): Promise<TaskEntry[]> {
  const tasks = await getAllTasks();
  return tasks
    .filter(t => t.date === date)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ============ Summaries ============

function calculateQuadrantBreakdown(tasks: TaskEntry[]): QuadrantBreakdown {
  return tasks.reduce(
    (acc, task) => {
      acc[`q${task.quadrant}` as keyof QuadrantBreakdown] += task.duration;
      return acc;
    },
    { q1: 0, q2: 0, q3: 0, q4: 0 }
  );
}

export async function getDaySummary(date: string): Promise<DaySummary> {
  const tasks = await getTasksForDate(date);
  const quadrantMinutes = calculateQuadrantBreakdown(tasks);
  const totalMinutes = tasks.reduce((sum, t) => sum + t.duration, 0);

  return {
    date,
    tasks,
    totalMinutes,
    quadrantMinutes,
    q2Percentage: totalMinutes > 0 ? Math.round((quadrantMinutes.q2 / totalMinutes) * 100) : 0,
  };
}

export async function getRecentDays(count: number = 7): Promise<DaySummary[]> {
  const tasks = await getAllTasks();
  const dates = [...new Set(tasks.map(t => t.date))].sort().reverse().slice(0, count);

  return Promise.all(dates.map(date => getDaySummary(date)));
}

export async function getAllDatesWithTasks(): Promise<string[]> {
  const tasks = await getAllTasks();
  return [...new Set(tasks.map(t => t.date))].sort().reverse();
}

// ============ Initialization ============

export async function initDB(): Promise<void> {
  // Seed default categories if none exist
  const categories = await getAllCategories();
  if (categories.length === 0) {
    const seeded = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
    await saveCategories(seeded);
  }
}

// ============ Demo Data ============

const SAMPLE_TASKS = [
  { title: 'Team standup', quadrant: 3 as const, category: 'Meetings', duration: 30 },
  { title: 'Fixed production bug', quadrant: 1 as const, category: 'Firefighting', duration: 120 },
  { title: '1:1 with Sarah', quadrant: 2 as const, category: '1:1s', duration: 45 },
  { title: 'Slack/email triage', quadrant: 3 as const, category: 'Email/Slack', duration: 60 },
  { title: 'Strategic roadmap planning', quadrant: 2 as const, category: 'Planning', duration: 90 },
  { title: 'Code review', quadrant: 2 as const, category: 'Deep Work', duration: 45 },
  { title: 'Interview candidate', quadrant: 2 as const, category: 'Meetings', duration: 60 },
  { title: 'Sprint planning', quadrant: 3 as const, category: 'Meetings', duration: 90 },
  { title: 'Debugged flaky test', quadrant: 1 as const, category: 'Firefighting', duration: 60 },
  { title: 'Read engineering blog', quadrant: 2 as const, category: 'Learning', duration: 30 },
  { title: 'Expense reports', quadrant: 4 as const, category: 'Admin', duration: 30 },
  { title: 'Wrote technical spec', quadrant: 2 as const, category: 'Deep Work', duration: 120 },
  { title: 'Customer escalation call', quadrant: 1 as const, category: 'Firefighting', duration: 45 },
  { title: 'Architecture review', quadrant: 2 as const, category: 'Deep Work', duration: 90 },
  { title: 'Updated team wiki', quadrant: 4 as const, category: 'Admin', duration: 30 },
  { title: '1:1 with manager', quadrant: 2 as const, category: '1:1s', duration: 30 },
  { title: 'Browsed LinkedIn', quadrant: 4 as const, category: 'Admin', duration: 20 },
  { title: 'Prepared board deck', quadrant: 2 as const, category: 'Planning', duration: 180 },
];

function getDateDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export async function seedDemoData(force: boolean = false): Promise<void> {
  if (!force) {
    const tasks = await getAllTasks();
    if (tasks.length > 0) return;
  }

  const categories = await getAllCategories();
  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  const tasks: TaskEntry[] = [];

  // Create 14 days of demo data
  for (let daysAgo = 14; daysAgo >= 1; daysAgo--) {
    // Skip weekends randomly
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    if (date.getDay() === 0 || date.getDay() === 6) {
      if (Math.random() > 0.3) continue; // 70% chance to skip weekends
    }

    const dateStr = getDateDaysAgo(daysAgo);
    const taskCount = Math.floor(Math.random() * 4) + 4; // 4-7 tasks per day
    const usedIndices = new Set<number>();

    for (let i = 0; i < taskCount; i++) {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * SAMPLE_TASKS.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);

      const sample = SAMPLE_TASKS[idx];
      const categoryId = categoryMap.get(sample.category) || categories[0].id;

      tasks.push({
        id: generateId(),
        title: sample.title,
        quadrant: sample.quadrant,
        categoryId,
        duration: sample.duration + (Math.floor(Math.random() * 3) - 1) * 15, // +/- 15min variance
        date: dateStr,
        createdAt: new Date(dateStr + 'T' + String(9 + i).padStart(2, '0') + ':00:00').toISOString(),
      });
    }
  }

  await saveTasks(tasks);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([TASKS_KEY, CATEGORIES_KEY]);
}
