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
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  initDB,
  getCurrentWeek,
  getWeekDates,
  addTask,
  getTasks,
  toggleTask,
  deleteTask,
  getAllWeeks,
  getWeekStats,
  getAllWeeksWithStats,
} from './src/database';
import { DevTools } from './src/components/DevTools';
import { Task, WeekStats, WeekWithStats } from './src/types';

const PRIORITY_COLORS = {
  1: '#ef4444', // red - high
  2: '#f59e0b', // amber - medium
  3: '#10b981', // emerald - low
};

const PRIORITY_LABELS = {
  1: 'High',
  2: 'Med',
  3: 'Low',
};

type TabType = 'week' | 'history';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('week');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<1 | 2 | 3>(2);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [allWeeks, setAllWeeks] = useState<string[]>([]);
  const [stats, setStats] = useState<WeekStats>({ total: 0, completed: 0 });
  const [historyData, setHistoryData] = useState<WeekWithStats[]>([]);

  const currentWeek = getCurrentWeek();
  const isCurrentWeek = selectedWeek === currentWeek;
  const weekDates = getWeekDates(selectedWeek);

  const loadData = useCallback(async () => {
    const [tasksData, weeksData, statsData, historyStats] = await Promise.all([
      getTasks(selectedWeek),
      getAllWeeks(),
      getWeekStats(selectedWeek),
      getAllWeeksWithStats(),
    ]);
    setTasks(tasksData);
    setStats(statsData);
    setHistoryData(historyStats);

    // Ensure current week is always in the list
    const weeks = weeksData.includes(currentWeek)
      ? weeksData
      : [currentWeek, ...weeksData];
    setAllWeeks(weeks);
  }, [selectedWeek, currentWeek]);

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
    if (!newTaskTitle.trim()) return;
    if (tasks.length >= 5) {
      Alert.alert('Stay Focused!', 'Max 5 tasks per week. Complete something first to add more.');
      return;
    }
    await addTask(newTaskTitle.trim(), selectedWeek, newTaskPriority);
    setNewTaskTitle('');
    setNewTaskPriority(2);
    loadData();
  };

  const handleToggleTask = async (taskId: number) => {
    await toggleTask(taskId);
    loadData();
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(taskId);
          loadData();
        },
      },
    ]);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentIndex = allWeeks.indexOf(selectedWeek);
    if (direction === 'prev' && currentIndex < allWeeks.length - 1) {
      setSelectedWeek(allWeeks[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedWeek(allWeeks[currentIndex - 1]);
    }
  };

  const getCompletionEmoji = (completed: number, total: number): string => {
    if (total === 0) return '';
    const ratio = completed / total;
    if (ratio === 1) return ' \u{1F525}'; // Fire emoji for 100%
    if (ratio >= 0.8) return ' \u{1F4AA}'; // Flexed bicep for 80%+
    if (ratio >= 0.6) return ' \u{1F44D}'; // Thumbs up for 60%+
    if (ratio >= 0.4) return ' \u{1F914}'; // Thinking face for 40%+
    return ' \u{1F6A7}'; // Construction for <40%
  };

  const getStreakCount = (): number => {
    let streak = 0;
    for (const weekData of historyData) {
      if (weekData.week === currentWeek) continue; // Don't count current week
      if (weekData.stats.total > 0 && weekData.stats.completed === weekData.stats.total) {
        streak++;
      } else if (weekData.stats.total > 0) {
        break; // Streak broken
      }
    }
    return streak;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your wins...</Text>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const streak = getStreakCount();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Weekly Five</Text>
            <Text style={styles.subtitle}>Ship 5 things. Every week.</Text>
          </View>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{streak} {'\u{1F525}'}</Text>
              <Text style={styles.streakLabel}>week streak</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'week' && styles.tabActive]}
          onPress={() => setActiveTab('week')}
        >
          <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'week' ? (
        <>
          {/* Week Selector */}
          <View style={styles.weekSelector}>
            <TouchableOpacity
              onPress={() => navigateWeek('prev')}
              style={[styles.navButton, allWeeks.indexOf(selectedWeek) === allWeeks.length - 1 && styles.navButtonDisabled]}
              disabled={allWeeks.indexOf(selectedWeek) === allWeeks.length - 1}
            >
              <Text style={styles.navButtonText}>{'\u2190'}</Text>
            </TouchableOpacity>

            <View style={styles.weekInfo}>
              <Text style={styles.weekText}>
                {isCurrentWeek ? 'This Week' : selectedWeek}
              </Text>
              <Text style={styles.weekDates}>
                {weekDates.start} - {weekDates.end}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigateWeek('next')}
              style={[styles.navButton, allWeeks.indexOf(selectedWeek) === 0 && styles.navButtonDisabled]}
              disabled={allWeeks.indexOf(selectedWeek) === 0}
            >
              <Text style={styles.navButtonText}>{'\u2192'}</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          {stats.total > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {stats.completed}/{stats.total} shipped{getCompletionEmoji(stats.completed, stats.total)}
              </Text>
            </View>
          )}

          {/* Add Task Form (only for current week) */}
          {isCurrentWeek && (
            <View style={styles.addTaskForm}>
              <TextInput
                style={styles.input}
                placeholder="What will you ship this week?"
                placeholderTextColor="#6b7280"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                onSubmitEditing={handleAddTask}
              />
              <View style={styles.formRow}>
                <View style={styles.prioritySelector}>
                  {([1, 2, 3] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityButton,
                        { backgroundColor: PRIORITY_COLORS[p] },
                        newTaskPriority === p && styles.priorityButtonSelected,
                      ]}
                      onPress={() => setNewTaskPriority(p)}
                    >
                      <Text style={styles.priorityButtonText}>{PRIORITY_LABELS[p]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.slotsText}>
                {5 - tasks.length} slot{5 - tasks.length !== 1 ? 's' : ''} remaining
              </Text>
            </View>
          )}

          {/* Task List */}
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>{'\u{1F3AF}'}</Text>
              <Text style={styles.emptyStateText}>
                {isCurrentWeek
                  ? 'No tasks yet.\nWhat\'s your #1 priority this week?'
                  : 'No tasks this week.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id.toString()}
              style={styles.taskList}
              contentContainerStyle={styles.taskListContent}
              renderItem={({ item, index }) => (
                <View style={[styles.taskItem, item.done && styles.taskItemDone]}>
                  <TouchableOpacity
                    style={[styles.checkbox, item.done && styles.checkboxDone]}
                    onPress={() => handleToggleTask(item.id)}
                  >
                    {item.done && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                  </TouchableOpacity>

                  <View
                    style={[styles.priorityIndicator, { backgroundColor: PRIORITY_COLORS[item.priority] }]}
                  />

                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>
                      {item.title}
                    </Text>
                    <Text style={styles.taskNumber}>#{index + 1} of 5</Text>
                  </View>

                  {isCurrentWeek && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTask(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>{'\u00D7'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          )}
        </>
      ) : (
        /* History Tab */
        <ScrollView style={styles.historyContainer} contentContainerStyle={styles.historyContent}>
          {historyData.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>{'\u{1F4C5}'}</Text>
              <Text style={styles.emptyStateText}>
                No history yet.{'\n'}Complete your first week to see it here!
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>Your Journey</Text>
                <Text style={styles.historySubtitle}>
                  {historyData.length} week{historyData.length !== 1 ? 's' : ''} tracked
                </Text>
              </View>

              {historyData.map((weekData) => {
                const isThisWeek = weekData.week === currentWeek;
                const completionRate = weekData.stats.total > 0
                  ? Math.round((weekData.stats.completed / weekData.stats.total) * 100)
                  : 0;

                return (
                  <TouchableOpacity
                    key={weekData.week}
                    style={[styles.historyCard, isThisWeek && styles.historyCardCurrent]}
                    onPress={() => {
                      setSelectedWeek(weekData.week);
                      setActiveTab('week');
                    }}
                  >
                    <View style={styles.historyCardLeft}>
                      <Text style={styles.historyWeek}>
                        {isThisWeek ? 'This Week' : weekData.week}
                      </Text>
                      <Text style={styles.historyDates}>
                        {weekData.dates.start} - {weekData.dates.end}
                      </Text>
                    </View>

                    <View style={styles.historyCardRight}>
                      <View style={styles.historyStats}>
                        <Text style={styles.historyCompletion}>
                          {weekData.stats.completed}/{weekData.stats.total}
                        </Text>
                        <Text style={styles.historyEmoji}>
                          {getCompletionEmoji(weekData.stats.completed, weekData.stats.total)}
                        </Text>
                      </View>
                      <View style={styles.historyProgressBar}>
                        <View
                          style={[
                            styles.historyProgressFill,
                            { width: `${completionRate}%` },
                            completionRate === 100 && styles.historyProgressFillComplete,
                          ]}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Summary Stats */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>All Time Stats</Text>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryNumber}>
                      {historyData.reduce((sum, w) => sum + w.stats.completed, 0)}
                    </Text>
                    <Text style={styles.summaryLabel}>Tasks Shipped</Text>
                  </View>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryNumber}>
                      {historyData.filter(w => w.stats.total > 0 && w.stats.completed === w.stats.total).length}
                    </Text>
                    <Text style={styles.summaryLabel}>Perfect Weeks</Text>
                  </View>
                  <View style={styles.summaryStat}>
                    <Text style={styles.summaryNumber}>
                      {historyData.reduce((sum, w) => sum + w.stats.total, 0) > 0
                        ? Math.round(
                            (historyData.reduce((sum, w) => sum + w.stats.completed, 0) /
                              historyData.reduce((sum, w) => sum + w.stats.total, 0)) *
                              100
                          )
                        : 0}%
                    </Text>
                    <Text style={styles.summaryLabel}>Ship Rate</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Less is more. Ship what matters.
        </Text>
      </View>

      {/* Dev Tools - only visible in development */}
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
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  streakBadge: {
    backgroundColor: '#7c3aed20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7c3aed40',
    alignItems: 'center',
  },
  streakText: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '700',
  },
  streakLabel: {
    color: '#7c3aed',
    fontSize: 10,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
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
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    borderRadius: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252542',
    borderRadius: 12,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  weekDates: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 5,
  },
  progressText: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  addTaskForm: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#252542',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    opacity: 0.4,
  },
  priorityButtonSelected: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  priorityButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  slotsText: {
    color: '#4b5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskListContent: {
    paddingBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#252542',
  },
  taskItemDone: {
    backgroundColor: '#151525',
    borderColor: '#1a1a2e',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxDone: {
    backgroundColor: '#8b5cf6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 14,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#4b5563',
  },
  taskNumber: {
    color: '#4b5563',
    fontSize: 11,
    marginTop: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#6b7280',
    fontSize: 28,
    lineHeight: 28,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
  // History Tab Styles
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyContent: {
    paddingBottom: 20,
  },
  historyHeader: {
    marginBottom: 16,
  },
  historyTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  historySubtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#252542',
  },
  historyCardCurrent: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1a1a3e',
  },
  historyCardLeft: {
    flex: 1,
  },
  historyWeek: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyDates: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  historyCardRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyCompletion: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  historyEmoji: {
    fontSize: 18,
    marginLeft: 4,
  },
  historyProgressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#252542',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  historyProgressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  historyProgressFillComplete: {
    backgroundColor: '#10b981',
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#8b5cf620',
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryNumber: {
    color: '#8b5cf6',
    fontSize: 28,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  footerText: {
    color: '#4b5563',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
