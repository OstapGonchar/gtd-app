import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, WeekStats } from './types';

const TASKS_KEY = 'gtd_tasks';
let nextId = 1;

interface StoredTask {
  id: number;
  title: string;
  week: string;
  done: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
}

async function getAllTasks(): Promise<StoredTask[]> {
  const data = await AsyncStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveTasks(tasks: StoredTask[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function initDB(): Promise<void> {
  const tasks = await getAllTasks();
  if (tasks.length > 0) {
    nextId = Math.max(...tasks.map(t => t.id)) + 1;
  }
}

export function getCurrentWeek(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

export function getWeekDates(weekStr: string): { start: string; end: string } {
  const [year, week] = [parseInt(weekStr.slice(0, 4)), parseInt(weekStr.slice(6))];
  const jan1 = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7 - jan1.getDay() + 1;
  const startDate = new Date(year, 0, 1 + daysOffset);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { start: format(startDate), end: format(endDate) };
}

export async function addTask(title: string, week: string, priority: 1 | 2 | 3 = 2): Promise<number> {
  const tasks = await getAllTasks();
  const newTask: StoredTask = {
    id: nextId++,
    title,
    week,
    done: false,
    priority,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask.id;
}

export async function getTasks(week: string): Promise<Task[]> {
  const tasks = await getAllTasks();
  return tasks
    .filter(t => t.week === week)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export async function toggleTask(taskId: number): Promise<void> {
  const tasks = await getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.done = !task.done;
    await saveTasks(tasks);
  }
}

export async function deleteTask(taskId: number): Promise<void> {
  const tasks = await getAllTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  await saveTasks(filtered);
}

export async function getAllWeeks(): Promise<string[]> {
  const tasks = await getAllTasks();
  const weeks = [...new Set(tasks.map(t => t.week))];
  return weeks.sort().reverse();
}

export async function getWeekStats(week: string): Promise<WeekStats> {
  const tasks = await getAllTasks();
  const weekTasks = tasks.filter(t => t.week === week);
  return {
    total: weekTasks.length,
    completed: weekTasks.filter(t => t.done).length,
  };
}

export async function getWeekNumber(weekStr: string): Promise<number> {
  return parseInt(weekStr.slice(6));
}

export async function getAllWeeksWithStats(): Promise<Array<{ week: string; stats: WeekStats; dates: { start: string; end: string } }>> {
  const tasks = await getAllTasks();
  const weeks = [...new Set(tasks.map(t => t.week))].sort().reverse();

  return weeks.map(week => {
    const weekTasks = tasks.filter(t => t.week === week);
    return {
      week,
      stats: {
        total: weekTasks.length,
        completed: weekTasks.filter(t => t.done).length,
      },
      dates: getWeekDates(week),
    };
  });
}

// Demo data for testing - creates realistic historical data
const SAMPLE_TASKS = [
  // High priority work tasks
  'Finish Q4 planning deck',
  'Review team performance docs',
  'Prep board presentation',
  'Complete architecture review',
  'Ship critical bugfix',
  'Finalize hiring decision',
  'Submit budget proposal',
  // Medium priority
  'Update team wiki',
  'Schedule 1:1s for month',
  'Review PRs from team',
  'Write technical spec',
  'Organize backlog',
  'Respond to partner email',
  'Update roadmap doc',
  // Low priority / personal
  'Book dentist appointment',
  'Order new monitor',
  'Clean up email inbox',
  'Read leadership article',
  'Update LinkedIn profile',
  'Plan team offsite',
  'Review expense reports',
];

function getWeekString(weeksAgo: number): string {
  const now = new Date();
  const targetDate = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);
  const startOfYear = new Date(targetDate.getFullYear(), 0, 1);
  const days = Math.floor((targetDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${targetDate.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

export async function seedDemoData(): Promise<void> {
  const existingTasks = await getAllTasks();
  if (existingTasks.length > 0) {
    // Don't seed if data already exists
    return;
  }

  const tasks: StoredTask[] = [];
  let id = 1;
  const usedTasks = new Set<string>();

  // Create data for past 6 weeks (not current week)
  for (let weeksAgo = 6; weeksAgo >= 1; weeksAgo--) {
    const week = getWeekString(weeksAgo);
    const taskCount = Math.floor(Math.random() * 3) + 3; // 3-5 tasks

    for (let i = 0; i < taskCount; i++) {
      // Pick a random unused task title
      let title: string;
      do {
        title = SAMPLE_TASKS[Math.floor(Math.random() * SAMPLE_TASKS.length)];
      } while (usedTasks.has(`${week}-${title}`));
      usedTasks.add(`${week}-${title}`);

      const priority = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
      // Older weeks have higher completion rate (70-90%), recent weeks lower (40-70%)
      const completionChance = weeksAgo > 3 ? 0.7 + Math.random() * 0.2 : 0.4 + Math.random() * 0.3;
      const done = Math.random() < completionChance;

      tasks.push({
        id: id++,
        title,
        week,
        done,
        priority,
        createdAt: new Date(Date.now() - weeksAgo * 7 * 24 * 60 * 60 * 1000 + i * 1000).toISOString(),
      });
    }
  }

  await saveTasks(tasks);
  nextId = id;
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeItem(TASKS_KEY);
  nextId = 1;
}
