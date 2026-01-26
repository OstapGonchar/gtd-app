import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, TaskEntry } from './types';

const TASKS_KEY = 'q2_tasks';
const CATEGORIES_KEY = 'q2_categories';

// Sample task templates for generating realistic demo data
const SAMPLE_TASK_TEMPLATES = [
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
  { title: 'Security review', quadrant: 2 as const, category: 'Deep Work', duration: 60 },
  { title: 'Client demo', quadrant: 3 as const, category: 'Meetings', duration: 45 },
  { title: 'Database optimization', quadrant: 2 as const, category: 'Deep Work', duration: 90 },
  { title: 'Team retrospective', quadrant: 3 as const, category: 'Meetings', duration: 60 },
  { title: 'Weekly report', quadrant: 4 as const, category: 'Admin', duration: 30 },
  { title: 'Mentoring junior dev', quadrant: 2 as const, category: '1:1s', duration: 45 },
];

/**
 * DemoDataGenerator - Handles generation of sample data for testing/demo purposes.
 * This class is completely separate from production code and should only be used
 * in development mode via DevTools.
 */
export class DemoDataGenerator {
  private categories: Category[] = [];

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  /**
   * Get date string for N days ago from current date
   */
  private getDateDaysAgo(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }

  /**
   * Load categories from storage
   */
  private async loadCategories(): Promise<void> {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    this.categories = data ? JSON.parse(data) : [];
  }

  /**
   * Get category ID by name
   */
  private getCategoryIdByName(name: string): string {
    const category = this.categories.find(c => c.name === name);
    return category?.id || this.categories[0]?.id || '';
  }

  /**
   * Generate a random duration variance (+/- 15 minutes)
   */
  private getRandomDurationVariance(): number {
    return (Math.floor(Math.random() * 3) - 1) * 15;
  }

  /**
   * Randomly decide if a task should be marked as completed
   * Higher completion rate for older tasks, lower for recent ones
   */
  private shouldMarkCompleted(daysAgo: number): boolean {
    // Older tasks have higher completion rate
    const completionProbability = Math.min(0.8, 0.3 + (daysAgo / 100));
    return Math.random() < completionProbability;
  }

  /**
   * Generate demo data for the past N days from current date
   * @param days - Number of days to generate (default: 60)
   * @param force - Force regeneration even if data exists
   */
  async generateDemoData(days: number = 60, force: boolean = false): Promise<void> {
    // Check if data already exists
    if (!force) {
      const existingData = await AsyncStorage.getItem(TASKS_KEY);
      const existingTasks = existingData ? JSON.parse(existingData) : [];
      if (existingTasks.length > 0) {
        return;
      }
    }

    // Load categories for mapping
    await this.loadCategories();

    if (this.categories.length === 0) {
      console.warn('DemoDataGenerator: No categories found. Please initialize DB first.');
      return;
    }

    const tasks: TaskEntry[] = [];

    // Generate data for past N days
    for (let daysAgo = days; daysAgo >= 1; daysAgo--) {
      // Get the date for this day
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Always include recent days (last 7 days) regardless of weekend
      // For older days, skip weekends randomly (70% chance to skip)
      if (daysAgo > 7 && isWeekend) {
        if (Math.random() > 0.3) continue;
      }

      const dateStr = this.getDateDaysAgo(daysAgo);

      // Random number of tasks per day (4-7)
      const taskCount = Math.floor(Math.random() * 4) + 4;
      const usedIndices = new Set<number>();

      for (let i = 0; i < taskCount; i++) {
        // Pick a random unique task template
        let idx: number;
        do {
          idx = Math.floor(Math.random() * SAMPLE_TASK_TEMPLATES.length);
        } while (usedIndices.has(idx));
        usedIndices.add(idx);

        const template = SAMPLE_TASK_TEMPLATES[idx];
        const categoryId = this.getCategoryIdByName(template.category);

        tasks.push({
          id: this.generateId(),
          title: template.title,
          quadrant: template.quadrant,
          categoryId,
          duration: Math.max(15, template.duration + this.getRandomDurationVariance()),
          date: dateStr,
          createdAt: new Date(dateStr + 'T' + String(9 + i).padStart(2, '0') + ':00:00').toISOString(),
          completed: this.shouldMarkCompleted(daysAgo),
        });
      }
    }

    // Save generated tasks
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  /**
   * Get statistics about the demo data that would be generated
   */
  getGenerationPreview(days: number = 60): { estimatedDays: number; estimatedTasks: number } {
    // Last 7 days are always included
    // Remaining days: ~70% included (skip weekends 70% of time)
    const recentDays = Math.min(7, days);
    const olderDays = Math.max(0, days - 7);
    const estimatedDays = recentDays + Math.round(olderDays * 0.7);
    // Estimate 4-7 tasks per day, average 5.5
    const estimatedTasks = Math.round(estimatedDays * 5.5);
    return { estimatedDays, estimatedTasks };
  }
}

// Export a singleton instance for convenience
export const demoDataGenerator = new DemoDataGenerator();
