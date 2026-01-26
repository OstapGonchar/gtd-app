import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { DaySummary, Category, QUADRANT_INFO } from '../types';
import { formatDate, formatDuration } from '../database';
import { Q2Progress } from './Q2Progress';
import { useTheme } from '../ThemeContext';

interface DayDetailModalProps {
  visible: boolean;
  daySummary: DaySummary | null;
  categories: Category[];
  onClose: () => void;
}

export function DayDetailModal({
  visible,
  daySummary,
  categories,
  onClose,
}: DayDetailModalProps) {
  const { theme } = useTheme();

  if (!daySummary) return null;

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={[styles.dateTitle, { color: theme.colors.text }]}>{formatDate(daySummary.date)}</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Progress Section */}
            <View style={styles.section}>
              <Q2Progress
                quadrantMinutes={daySummary.quadrantMinutes}
                totalMinutes={daySummary.totalMinutes}
                q2Percentage={daySummary.q2Percentage}
                completion={daySummary.completion}
              />
            </View>

            {/* Summary Stats - Completion focused */}
            <View style={[styles.summaryRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: daySummary.completion.q2Total > 0 ? theme.colors.q2 : theme.colors.textMuted }]}>
                  {daySummary.completion.q2Total > 0 ? `${daySummary.completion.q2Percentage}%` : '--'}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Q2 Done</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {daySummary.completion.completed}/{daySummary.completion.total}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Tasks</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {formatDuration(daySummary.totalMinutes)}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Time</Text>
              </View>
            </View>

            {/* Tasks List */}
            {daySummary.tasks.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Activities</Text>
                {daySummary.tasks.map((task) => {
                  const category = getCategoryById(task.categoryId);
                  const quadrant = QUADRANT_INFO[task.quadrant];

                  return (
                    <View key={task.id} style={[styles.taskItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      <View style={styles.taskHeader}>
                        {/* Completion indicator */}
                        <View style={[
                          styles.completionIndicator,
                          { borderColor: task.completed ? theme.colors.q2 : theme.colors.textMuted },
                          task.completed && { backgroundColor: theme.colors.q2 }
                        ]}>
                          {task.completed && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <View
                          style={[
                            styles.quadrantBadge,
                            { backgroundColor: quadrant.color },
                          ]}
                        >
                          <Text style={styles.quadrantText}>{quadrant.label}</Text>
                        </View>
                        <Text style={[
                          styles.taskTitle,
                          { color: theme.colors.text },
                          task.completed && styles.taskTitleCompleted
                        ]} numberOfLines={1}>
                          {task.title}
                        </Text>
                        <Text style={[styles.taskDuration, { color: theme.colors.textSecondary }]}>
                          {formatDuration(task.duration)}
                        </Text>
                      </View>
                      {category && (
                        <View style={styles.taskCategory}>
                          <Text style={[styles.categoryText, { color: category.color }]}>
                            {category.icon} {category.name}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 24,
    lineHeight: 24,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 18,
    borderWidth: 1,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  taskItem: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  quadrantBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 12,
  },
  quadrantText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  taskDuration: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
  },
  taskCategory: {
    marginTop: 10,
    marginLeft: 48,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
