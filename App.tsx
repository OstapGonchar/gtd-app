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
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import { ThemeProvider, useTheme, ThemeMode } from './src/ThemeContext';
import { Theme } from './src/theme';

// Import illustrations
const emptyTodayImage = require('./assets/empty-today.png');
const emptyHistoryImage = require('./assets/empty-history.png');
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
  toggleTaskCompletion,
  getDaySummary,
  getMonthSummaries,
  calculateStreak,
  getSettings,
  updateSettings,
  getAllTimeStats,
  AllTimeStats,
} from './src/database';
import { Category, DaySummary, Quadrant, QUADRANT_INFO, StreakInfo, AppSettings, DEFAULT_DURATION_PRESETS, ThemeMode as ThemeModeType } from './src/types';
import { Q2Progress } from './src/components/Q2Progress';
import { DevTools } from './src/components/DevTools';
import { CalendarView } from './src/components/CalendarView';
import { DayDetailModal } from './src/components/DayDetailModal';
import { StreakBadge } from './src/components/StreakBadge';
import { IconPicker } from './src/components/IconPicker';
import { AddTaskModal } from './src/components/AddTaskModal';
import { DurationPicker } from './src/components/DurationPicker';
import { StatsModal } from './src/components/StatsModal';
import { AboutModal } from './src/components/AboutModal';

type TabType = 'today' | 'calendar' | 'categories' | 'settings';

// Get status bar height for proper padding
const STATUS_BAR_HEIGHT = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : StatusBar.currentHeight || 24;

function AppContent() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [todaySummary, setTodaySummary] = useState<DaySummary | null>(null);
  const [streak, setStreak] = useState<StreakInfo>({ currentStreak: 0, longestStreak: 0, lastActiveDate: null });
  const [settings, setSettings] = useState<AppSettings>({ durationPresets: DEFAULT_DURATION_PRESETS, themeMode: 'auto' });
  const [allTimeStats, setAllTimeStats] = useState<AllTimeStats>({
    totalDays: 0, totalMinutes: 0, totalTasks: 0,
    quadrantMinutes: { q1: 0, q2: 0, q3: 0, q4: 0 },
    q2Percentage: 0, avgDailyMinutes: 0, avgDailyQ2Percentage: 0, firstActiveDate: null,
  });
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

  // Calendar/History
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthSummaries, setMonthSummaries] = useState<Map<string, DaySummary>>(new Map());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDaySummary, setSelectedDaySummary] = useState<DaySummary | null>(null);
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);

  // Add task modal
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);

  // Category form
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string | null>(null);

  // Settings form
  const [newDurationValue, setNewDurationValue] = useState('');

  const loadData = useCallback(async () => {
    const [cats, today, streakInfo, appSettings, stats] = await Promise.all([
      getCategories(),
      getDaySummary(getTodayDate()),
      calculateStreak(),
      getSettings(),
      getAllTimeStats(),
    ]);
    setCategories(cats);
    setTodaySummary(today);
    setStreak(streakInfo);
    setSettings(appSettings);
    setAllTimeStats(stats);

    // Apply saved theme mode
    if (appSettings.themeMode && appSettings.themeMode !== themeMode) {
      setThemeMode(appSettings.themeMode);
    }
  }, [themeMode, setThemeMode]);

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

  // Refresh calendar data when switching to calendar tab
  useEffect(() => {
    if (!isLoading && activeTab === 'calendar') {
      loadMonthData();
    }
  }, [activeTab, isLoading, loadMonthData]);

  const handleAddTask = async (title: string, quadrant: Quadrant, categoryId: string, duration: number) => {
    await addTask(title, quadrant, categoryId, duration);
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

  const handleToggleTaskCompletion = async (taskId: string) => {
    await toggleTaskCompletion(taskId);
    loadData();
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
    setIsDayModalVisible(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleAddDurationPreset = async () => {
    const input = newDurationValue.trim().toLowerCase();
    let minutes: number;

    // Parse formats: "3h", "3hr", "3 hours", "90m", "90min", "90 minutes", or just "90"
    if (input.includes('h')) {
      const hours = parseFloat(input.replace(/[^0-9.]/g, ''));
      minutes = Math.round(hours * 60);
    } else {
      minutes = parseInt(input.replace(/[^0-9]/g, ''), 10);
    }

    if (isNaN(minutes) || minutes <= 0 || minutes > 480) return;
    if (settings.durationPresets.includes(minutes)) return;

    const newPresets = [...settings.durationPresets, minutes].sort((a, b) => a - b);
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

  const handleThemeModeChange = async (mode: ThemeModeType) => {
    setThemeMode(mode);
    await updateSettings({ themeMode: mode });
    setSettings({ ...settings, themeMode: mode });
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

  // Dynamic styles based on theme
  const dynamicStyles = createDynamicStyles(theme);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>Loading...</Text>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Safe area padding for status bar */}
      <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: theme.colors.background }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => setIsAboutModalVisible(true)}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Q2 Focus</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Track what matters</Text>
        </TouchableOpacity>
        <StreakBadge streak={streak} onPress={() => setIsStatsModalVisible(true)} />
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        {(['today', 'calendar', 'categories', 'settings'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [styles.tabActive, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { color: theme.colors.textMuted },
              activeTab === tab && styles.tabTextActive
            ]}>
              {tab === 'today' ? 'Today' : tab === 'calendar' ? 'Calendar' : tab === 'categories' ? 'Categories' : 'Settings'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today Tab */}
      {activeTab === 'today' && (
        <View style={styles.todayContainer}>
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Today's Progress */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{formatDate(getTodayDate())}</Text>
              {todaySummary && (
                <Q2Progress
                  quadrantMinutes={todaySummary.quadrantMinutes}
                  totalMinutes={todaySummary.totalMinutes}
                  q2Percentage={todaySummary.q2Percentage}
                />
              )}
            </View>

            {/* Today's Tasks */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {todaySummary && todaySummary.tasks.length > 0
                  ? `Today's Log (${todaySummary.tasks.length})`
                  : "Today's Log"}
              </Text>
              {todaySummary && todaySummary.tasks.length > 0 ? (
                todaySummary.tasks.map((task) => {
                  const category = getCategoryById(task.categoryId);
                  return (
                    <View key={task.id} style={[styles.taskItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      {/* Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          { borderColor: task.completed ? theme.colors.q2 : theme.colors.textMuted },
                          task.completed && { backgroundColor: theme.colors.q2 }
                        ]}
                        onPress={() => handleToggleTaskCompletion(task.id)}
                      >
                        {task.completed && <Text style={styles.checkmark}>✓</Text>}
                      </TouchableOpacity>
                      <View
                        style={[
                          styles.taskQuadrant,
                          { backgroundColor: QUADRANT_INFO[task.quadrant].color },
                        ]}
                      >
                        <Text style={styles.taskQuadrantText}>{QUADRANT_INFO[task.quadrant].label}</Text>
                      </View>
                      <View style={styles.taskContent}>
                        <Text style={[
                          styles.taskTitle,
                          { color: theme.colors.text },
                          task.completed && styles.taskTitleCompleted
                        ]}>
                          {task.title}
                        </Text>
                        <View style={styles.taskMeta}>
                          {category && (
                            <Text style={[styles.taskCategory, { color: category.color }]}>
                              {category.icon} {category.name}
                            </Text>
                          )}
                          <Text style={[styles.taskDuration, { color: theme.colors.textMuted }]}>{formatDuration(task.duration)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteTask(task.id)}
                      >
                        <Text style={[styles.deleteButtonText, { color: theme.colors.textMuted }]}>{'\u00D7'}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View style={[styles.emptyTodayState, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Image
                    source={emptyTodayImage}
                    style={styles.emptyTodayImage}
                    resizeMode="contain"
                  />
                  <Text style={[styles.emptyTodayText, { color: theme.colors.text }]}>Start your focus journey</Text>
                  <Text style={[styles.emptyTodaySubtext, { color: theme.colors.textMuted }]}>Tap + to log your first activity</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Floating Add Button */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            onPress={() => setIsAddTaskModalVisible(true)}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        visible={isAddTaskModalVisible}
        categories={categories}
        durationPresets={settings.durationPresets}
        onClose={() => setIsAddTaskModalVisible(false)}
        onAdd={handleAddTask}
      />

      {/* Calendar Tab (renamed from History) */}
      {activeTab === 'calendar' && (
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
        visible={isDayModalVisible}
        daySummary={selectedDaySummary}
        categories={categories}
        onClose={() => setIsDayModalVisible(false)}
      />

      {/* Stats Modal */}
      <StatsModal
        visible={isStatsModalVisible}
        streak={streak}
        allTimeStats={allTimeStats}
        onClose={() => setIsStatsModalVisible(false)}
      />

      {/* About Modal */}
      <AboutModal
        visible={isAboutModalVisible}
        onClose={() => setIsAboutModalVisible(false)}
      />

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Categories</Text>

            {categories.map((category) => (
              <View key={category.id} style={[styles.categoryItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
                <TouchableOpacity
                  style={styles.categoryDelete}
                  onPress={() => handleDeleteCategory(category.id)}
                >
                  <Text style={[styles.categoryDeleteText, { color: theme.colors.textMuted }]}>{'\u00D7'}</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={[styles.addCategoryForm, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.addCategoryInput, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="New category name..."
                placeholderTextColor={theme.colors.textMuted}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <Text style={[styles.fieldLabelSmall, { color: theme.colors.textSecondary }]}>Choose Icon</Text>
              <IconPicker selected={newCategoryIcon} onSelect={setNewCategoryIcon} />
              <TouchableOpacity
                style={[styles.addCategoryButton, { backgroundColor: theme.colors.primary }, !newCategoryName.trim() && styles.addButtonDisabled]}
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
          {/* Theme Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
            <Text style={[styles.settingsDescription, { color: theme.colors.textMuted }]}>
              Choose your preferred theme. Auto mode switches based on time of day (6am-6pm light, 6pm-6am dark).
            </Text>

            <View style={styles.themeOptions}>
              {(['auto', 'light', 'dark'] as ThemeModeType[]).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeOption,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    settings.themeMode === mode && { borderColor: theme.colors.primary, borderWidth: 2 }
                  ]}
                  onPress={() => handleThemeModeChange(mode)}
                >
                  <Text style={styles.themeIcon}>
                    {mode === 'auto' ? '🌗' : mode === 'light' ? '☀️' : '🌙'}
                  </Text>
                  <Text style={[
                    styles.themeLabel,
                    { color: theme.colors.text },
                    settings.themeMode === mode && { color: theme.colors.primary, fontWeight: '700' }
                  ]}>
                    {mode === 'auto' ? 'Auto' : mode === 'light' ? 'Light' : 'Dark'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Presets */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Duration Presets</Text>
            <Text style={[styles.settingsDescription, { color: theme.colors.textMuted }]}>
              Customize the duration options shown when logging activities.
            </Text>

            <View style={styles.presetsContainer}>
              {settings.durationPresets.map((duration) => (
                <View key={duration} style={[styles.presetItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Text style={[styles.presetText, { color: theme.colors.text }]}>{formatDuration(duration)}</Text>
                  <TouchableOpacity
                    style={[styles.presetDelete, { backgroundColor: theme.colors.surfaceAlt }]}
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
                style={[styles.addPresetInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="e.g. 45, 1.5h, 2h"
                placeholderTextColor={theme.colors.textMuted}
                value={newDurationValue}
                onChangeText={setNewDurationValue}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.addPresetButton, { backgroundColor: theme.colors.primary }, !newDurationValue.trim() && styles.addButtonDisabled]}
                onPress={handleAddDurationPreset}
                disabled={!newDurationValue.trim()}
              >
                <Text style={styles.addPresetButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      )}

      {/* Dev Tools */}
      <DevTools onDataReset={() => { loadData(); loadMonthData(); }} />
    </View>
  );
}

// Wrap the app with ThemeProvider
export default function App() {
  const [initialThemeMode, setInitialThemeMode] = useState<ThemeMode>('auto');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load saved theme mode before rendering
    (async () => {
      try {
        const settings = await getSettings();
        setInitialThemeMode(settings.themeMode || 'auto');
      } catch (e) {
        // Use default
      }
      setIsReady(true);
    })();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  return (
    <ThemeProvider initialMode={initialThemeMode}>
      <AppContent />
    </ThemeProvider>
  );
}

// Helper function to create dynamic styles (can be expanded)
function createDynamicStyles(theme: Theme) {
  return StyleSheet.create({
    // Add any dynamic styles here if needed
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 13,
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
    paddingBottom: 100,
  },
  todayContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '300',
    marginTop: -2,
  },
  emptyTodayState: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTodayImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.95,
  },
  emptyTodayText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyTodaySubtext: {
    fontSize: 14,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  addButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  taskQuadrant: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 14,
  },
  taskQuadrantText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  taskCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  deleteButtonText: {
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
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dayCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  dayCardToday: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  dayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayQ2: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayQ2Good: {
    color: '#10B981',
  },
  dayTotal: {
    fontSize: 13,
  },
  miniBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  miniBarSegment: {
    height: '100%',
  },
  dayTaskCount: {
    fontSize: 12,
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  categoryColor: {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginRight: 14,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryDelete: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  categoryDeleteText: {
    fontSize: 24,
  },
  addCategoryForm: {
    marginTop: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
  },
  addCategoryInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  fieldLabelSmall: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  addCategoryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addCategoryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  settingsDescription: {
    fontSize: 14,
    marginBottom: 18,
    lineHeight: 21,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  themeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  presetDelete: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetDeleteText: {
    color: '#F43F5E',
    fontSize: 18,
  },
  presetDeleteDisabled: {
    color: '#374151',
  },
  addPresetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addPresetInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  addPresetButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  addPresetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
