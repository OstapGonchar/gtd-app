import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {
  initDB,
  getTodayDate,
  formatDate,
  formatDuration,
  getCategories,
  addCategory,
  deleteCategory,
  addTask,
  deleteTask,
  getDaySummary,
  getRecentDays,
} from './src/database';
import { Category, TaskEntry, DaySummary, Quadrant, QUADRANT_INFO } from './src/types';
import { QuadrantPicker } from './src/components/QuadrantPicker';
import { CategoryPicker } from './src/components/CategoryPicker';
import { DurationPicker } from './src/components/DurationPicker';
import { Q2Progress } from './src/components/Q2Progress';
import { DevTools } from './src/components/DevTools';

type TabType = 'today' | 'history' | 'categories';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [todaySummary, setTodaySummary] = useState<DaySummary | null>(null);
  const [recentDays, setRecentDays] = useState<DaySummary[]>([]);

  // Task entry form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskQuadrant, setTaskQuadrant] = useState<Quadrant | null>(null);
  const [taskCategory, setTaskCategory] = useState<string | null>(null);
  const [taskDuration, setTaskDuration] = useState(30);

  // Category form
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadData = useCallback(async () => {
    const [cats, today, recent] = await Promise.all([
      getCategories(),
      getDaySummary(getTodayDate()),
      getRecentDays(14),
    ]);
    setCategories(cats);
    setTodaySummary(today);
    setRecentDays(recent);

    // Set default category if none selected
    if (!taskCategory && cats.length > 0) {
      setTaskCategory(cats[0].id);
    }
  }, [taskCategory]);

  useEffect(() => {
    (async () => {
      await initDB();
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleAddTask = async () => {
    if (!taskTitle.trim() || !taskQuadrant || !taskCategory) return;

    await addTask(taskTitle.trim(), taskQuadrant, taskCategory, taskDuration);
    setTaskTitle('');
    setTaskQuadrant(null);
    // Keep category and duration as defaults for next entry
    loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm('Delete this task?')
      : true;
    if (confirmed) {
      await deleteTask(taskId);
      loadData();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];
    const color = colors[categories.length % colors.length];
    await addCategory(newCategoryName.trim(), color);
    setNewCategoryName('');
    loadData();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm('Delete this category?')
      : true;
    if (confirmed) {
      await deleteCategory(categoryId);
      loadData();
    }
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const canAddTask = taskTitle.trim() && taskQuadrant && taskCategory;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Q2 Focus</Text>
        <Text style={styles.subtitle}>Track what matters</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['today', 'history', 'categories'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'today' ? 'Today' : tab === 'history' ? 'History' : 'Categories'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today Tab */}
      {activeTab === 'today' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Today's Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{formatDate(getTodayDate())}</Text>
            {todaySummary && (
              <Q2Progress
                quadrantMinutes={todaySummary.quadrantMinutes}
                totalMinutes={todaySummary.totalMinutes}
                q2Percentage={todaySummary.q2Percentage}
              />
            )}
          </View>

          {/* Add Task Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Log Activity</Text>

            <TextInput
              style={styles.input}
              placeholder="What did you work on?"
              placeholderTextColor="#6b7280"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <Text style={styles.fieldLabel}>Quadrant</Text>
            <QuadrantPicker selected={taskQuadrant} onSelect={setTaskQuadrant} />

            <Text style={styles.fieldLabel}>Category</Text>
            <CategoryPicker
              categories={categories}
              selected={taskCategory}
              onSelect={setTaskCategory}
            />

            <Text style={styles.fieldLabel}>Duration</Text>
            <DurationPicker selected={taskDuration} onSelect={setTaskDuration} />

            <TouchableOpacity
              style={[styles.addButton, !canAddTask && styles.addButtonDisabled]}
              onPress={handleAddTask}
              disabled={!canAddTask}
            >
              <Text style={styles.addButtonText}>+ Log Activity</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Tasks */}
          {todaySummary && todaySummary.tasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Log</Text>
              {todaySummary.tasks.map((task) => {
                const category = getCategoryById(task.categoryId);
                return (
                  <View key={task.id} style={styles.taskItem}>
                    <View
                      style={[
                        styles.taskQuadrant,
                        { backgroundColor: QUADRANT_INFO[task.quadrant].color },
                      ]}
                    >
                      <Text style={styles.taskQuadrantText}>{QUADRANT_INFO[task.quadrant].label}</Text>
                    </View>
                    <View style={styles.taskContent}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <View style={styles.taskMeta}>
                        {category && (
                          <Text style={[styles.taskCategory, { color: category.color }]}>
                            {category.icon} {category.name}
                          </Text>
                        )}
                        <Text style={styles.taskDuration}>{formatDuration(task.duration)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTask(task.id)}
                    >
                      <Text style={styles.deleteButtonText}>{'\u00D7'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {recentDays.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>{'\u{1F4C5}'}</Text>
              <Text style={styles.emptyStateText}>
                No history yet.{'\n'}Start logging activities to see your patterns.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Days</Text>
                {recentDays.map((day) => {
                  const isToday = day.date === getTodayDate();
                  return (
                    <View key={day.date} style={[styles.dayCard, isToday && styles.dayCardToday]}>
                      <View style={styles.dayHeader}>
                        <Text style={styles.dayDate}>
                          {isToday ? 'Today' : formatDate(day.date)}
                        </Text>
                        <View style={styles.dayStats}>
                          <Text
                            style={[
                              styles.dayQ2,
                              day.q2Percentage >= 30 && styles.dayQ2Good,
                            ]}
                          >
                            {day.q2Percentage}% Q2
                          </Text>
                          <Text style={styles.dayTotal}>{formatDuration(day.totalMinutes)}</Text>
                        </View>
                      </View>

                      {/* Mini breakdown bar */}
                      {day.totalMinutes > 0 && (
                        <View style={styles.miniBar}>
                          {([1, 2, 3, 4] as const).map((q) => {
                            const minutes = day.quadrantMinutes[`q${q}` as keyof typeof day.quadrantMinutes];
                            const percent = (minutes / day.totalMinutes) * 100;
                            if (percent === 0) return null;
                            return (
                              <View
                                key={q}
                                style={[
                                  styles.miniBarSegment,
                                  { width: `${percent}%`, backgroundColor: QUADRANT_INFO[q].color },
                                ]}
                              />
                            );
                          })}
                        </View>
                      )}

                      <Text style={styles.dayTaskCount}>
                        {day.tasks.length} activit{day.tasks.length === 1 ? 'y' : 'ies'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Categories</Text>

            {categories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <TouchableOpacity
                  style={styles.categoryDelete}
                  onPress={() => handleDeleteCategory(category.id)}
                >
                  <Text style={styles.categoryDeleteText}>{'\u00D7'}</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addCategoryRow}>
              <TextInput
                style={styles.addCategoryInput}
                placeholder="New category name..."
                placeholderTextColor="#6b7280"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity
                style={[styles.addCategoryButton, !newCategoryName.trim() && styles.addButtonDisabled]}
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                <Text style={styles.addCategoryButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Dev Tools */}
      <DevTools onDataReset={loadData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
    gap: 16,
  },
  loadingText: {
    color: '#8b5cf6',
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#252542',
  },
  addButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonDisabled: {
    backgroundColor: '#3730a3',
    opacity: 0.5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  taskQuadrant: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  taskQuadrantText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  taskCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskDuration: {
    color: '#6b7280',
    fontSize: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#6b7280',
    fontSize: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dayCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  dayCardToday: {
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayDate: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  dayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayQ2: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  dayQ2Good: {
    color: '#10b981',
  },
  dayTotal: {
    color: '#6b7280',
    fontSize: 13,
  },
  miniBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#252542',
    marginTop: 10,
  },
  miniBarSegment: {
    height: '100%',
  },
  dayTaskCount: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  categoryDelete: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryDeleteText: {
    color: '#6b7280',
    fontSize: 24,
  },
  addCategoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  addCategoryInput: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#252542',
  },
  addCategoryButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addCategoryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
