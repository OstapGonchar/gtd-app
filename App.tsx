import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
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
  getMonthSummaries,
  calculateStreak,
  getSettings,
  updateSettings,
} from './src/database';
import { Category, DaySummary, Quadrant, QUADRANT_INFO, StreakInfo, AppSettings, DEFAULT_DURATION_PRESETS } from './src/types';
import { QuadrantPicker } from './src/components/QuadrantPicker';
import { CategoryPicker } from './src/components/CategoryPicker';
import { DurationPicker } from './src/components/DurationPicker';
import { Q2Progress } from './src/components/Q2Progress';
import { DevTools } from './src/components/DevTools';
import { CalendarView } from './src/components/CalendarView';
import { DayDetailModal } from './src/components/DayDetailModal';
import { StreakBadge } from './src/components/StreakBadge';
import { IconPicker } from './src/components/IconPicker';

type TabType = 'today' | 'history' | 'categories' | 'settings';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [todaySummary, setTodaySummary] = useState<DaySummary | null>(null);
  const [streak, setStreak] = useState<StreakInfo>({ currentStreak: 0, longestStreak: 0, lastActiveDate: null });
  const [settings, setSettings] = useState<AppSettings>({ durationPresets: DEFAULT_DURATION_PRESETS });

  // Calendar/History
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthSummaries, setMonthSummaries] = useState<Map<string, DaySummary>>(new Map());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDaySummary, setSelectedDaySummary] = useState<DaySummary | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Task entry form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskQuadrant, setTaskQuadrant] = useState<Quadrant | null>(null);
  const [taskCategory, setTaskCategory] = useState<string | null>(null);
  const [taskDuration, setTaskDuration] = useState(30);

  // Category form
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string | null>(null);

  // Settings form
  const [newDurationValue, setNewDurationValue] = useState('');

  const loadData = useCallback(async () => {
    const [cats, today, streakInfo, appSettings] = await Promise.all([
      getCategories(),
      getDaySummary(getTodayDate()),
      calculateStreak(),
      getSettings(),
    ]);
    setCategories(cats);
    setTodaySummary(today);
    setStreak(streakInfo);
    setSettings(appSettings);

    // Set default category if none selected
    if (!taskCategory && cats.length > 0) {
      setTaskCategory(cats[0].id);
    }
  }, [taskCategory]);

  const loadMonthData = useCallback(async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const summaries = await getMonthSummaries(year, month);
    setMonthSummaries(summaries);
  }, [currentMonth]);

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

  useEffect(() => {
    if (!isLoading) {
      loadMonthData();
    }
  }, [isLoading, loadMonthData]);

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
    await addCategory(newCategoryName.trim(), color, newCategoryIcon || undefined);
    setNewCategoryName('');
    setNewCategoryIcon(null);
    loadData();
  };

  const handleDayPress = async (date: string) => {
    setSelectedDate(date);
    const summary = monthSummaries.get(date);
    if (summary) {
      setSelectedDaySummary(summary);
    } else {
      setSelectedDaySummary({ date, tasks: [], totalMinutes: 0, quadrantMinutes: { q1: 0, q2: 0, q3: 0, q4: 0 }, q2Percentage: 0 });
    }
    setIsModalVisible(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleAddDurationPreset = async () => {
    const value = parseInt(newDurationValue, 10);
    if (isNaN(value) || value <= 0 || value > 480) return;
    if (settings.durationPresets.includes(value)) return;

    const newPresets = [...settings.durationPresets, value].sort((a, b) => a - b);
    await updateSettings({ durationPresets: newPresets });
    setSettings({ ...settings, durationPresets: newPresets });
    setNewDurationValue('');
  };

  const handleRemoveDurationPreset = async (duration: number) => {
    if (settings.durationPresets.length <= 1) return;
    const newPresets = settings.durationPresets.filter(d => d !== duration);
    await updateSettings({ durationPresets: newPresets });
    setSettings({ ...settings, durationPresets: newPresets });
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
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Q2 Focus</Text>
          <Text style={styles.subtitle}>Track what matters</Text>
        </View>
        <StreakBadge streak={streak} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['today', 'history', 'categories', 'settings'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'today' ? 'Today' : tab === 'history' ? 'History' : tab === 'categories' ? 'Categories' : 'Settings'}
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
            <DurationPicker selected={taskDuration} onSelect={setTaskDuration} presets={settings.durationPresets} />

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
          <CalendarView
            monthSummaries={monthSummaries}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            onDayPress={handleDayPress}
            streak={streak}
            selectedDate={selectedDate}
          />
        </ScrollView>
      )}

      {/* Day Detail Modal */}
      <DayDetailModal
        visible={isModalVisible}
        daySummary={selectedDaySummary}
        categories={categories}
        onClose={() => setIsModalVisible(false)}
      />

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

            <View style={styles.addCategoryForm}>
              <TextInput
                style={styles.addCategoryInput}
                placeholder="New category name..."
                placeholderTextColor="#6b7280"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <Text style={styles.fieldLabelSmall}>Choose Icon</Text>
              <IconPicker selected={newCategoryIcon} onSelect={setNewCategoryIcon} />
              <TouchableOpacity
                style={[styles.addCategoryButton, !newCategoryName.trim() && styles.addButtonDisabled]}
                onPress={handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                <Text style={styles.addCategoryButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration Presets</Text>
            <Text style={styles.settingsDescription}>
              Customize the duration options shown when logging activities.
            </Text>

            <View style={styles.presetsContainer}>
              {settings.durationPresets.map((duration) => (
                <View key={duration} style={styles.presetItem}>
                  <Text style={styles.presetText}>{formatDuration(duration)}</Text>
                  <TouchableOpacity
                    style={styles.presetDelete}
                    onPress={() => handleRemoveDurationPreset(duration)}
                    disabled={settings.durationPresets.length <= 1}
                  >
                    <Text style={[styles.presetDeleteText, settings.durationPresets.length <= 1 && styles.presetDeleteDisabled]}>
                      {'\u00D7'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.addPresetRow}>
              <TextInput
                style={styles.addPresetInput}
                placeholder="Minutes (e.g., 45)"
                placeholderTextColor="#6b7280"
                value={newDurationValue}
                onChangeText={setNewDurationValue}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.addPresetButton, !newDurationValue.trim() && styles.addButtonDisabled]}
                onPress={handleAddDurationPreset}
                disabled={!newDurationValue.trim()}
              >
                <Text style={styles.addPresetButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Streak Info</Text>
            <View style={styles.streakInfoCard}>
              <View style={styles.streakInfoRow}>
                <Text style={styles.streakInfoLabel}>Current Streak</Text>
                <Text style={styles.streakInfoValue}>{streak.currentStreak} days</Text>
              </View>
              <View style={styles.streakInfoRow}>
                <Text style={styles.streakInfoLabel}>Longest Streak</Text>
                <Text style={styles.streakInfoValue}>{streak.longestStreak} days</Text>
              </View>
              {streak.lastActiveDate && (
                <View style={styles.streakInfoRow}>
                  <Text style={styles.streakInfoLabel}>Last Active</Text>
                  <Text style={styles.streakInfoValue}>{formatDate(streak.lastActiveDate)}</Text>
                </View>
              )}
            </View>
          </View>

        </ScrollView>
      )}

      {/* Dev Tools */}
      <DevTools onDataReset={() => { loadData(); loadMonthData(); }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
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
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    color: '#6b7280',
    fontSize: 12,
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
  addCategoryForm: {
    marginTop: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
  },
  addCategoryInput: {
    backgroundColor: '#252542',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#252542',
  },
  fieldLabelSmall: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  addCategoryButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  addCategoryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsDescription: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 8,
    gap: 8,
  },
  presetText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  presetDelete: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252542',
  },
  presetDeleteText: {
    color: '#ef4444',
    fontSize: 18,
  },
  presetDeleteDisabled: {
    color: '#4b5563',
  },
  addPresetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addPresetInput: {
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
  addPresetButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addPresetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  streakInfoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  streakInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  streakInfoLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  streakInfoValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
