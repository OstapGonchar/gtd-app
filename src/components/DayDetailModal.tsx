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
import { EisenhowerMatrix } from './EisenhowerMatrix';

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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={styles.dateTitle}>{formatDate(daySummary.date)}</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Progress Section */}
            <View style={styles.section}>
              <Q2Progress
                quadrantMinutes={daySummary.quadrantMinutes}
                totalMinutes={daySummary.totalMinutes}
                q2Percentage={daySummary.q2Percentage}
              />
            </View>

            {/* Summary Stats */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {formatDuration(daySummary.totalMinutes)}
                </Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, styles.q2Value]}>
                  {daySummary.q2Percentage}%
                </Text>
                <Text style={styles.summaryLabel}>Q2 Time</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{daySummary.tasks.length}</Text>
                <Text style={styles.summaryLabel}>Activities</Text>
              </View>
            </View>

            {/* Matrix Reference */}
            <View style={styles.matrixSection}>
              <EisenhowerMatrix compact />
            </View>

            {/* Tasks List */}
            {daySummary.tasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activities</Text>
                {daySummary.tasks.map((task) => {
                  const category = getCategoryById(task.categoryId);
                  const quadrant = QUADRANT_INFO[task.quadrant];

                  return (
                    <View key={task.id} style={styles.taskItem}>
                      <View style={styles.taskHeader}>
                        <View
                          style={[
                            styles.quadrantBadge,
                            { backgroundColor: quadrant.color },
                          ]}
                        >
                          <Text style={styles.quadrantText}>{quadrant.label}</Text>
                        </View>
                        <Text style={styles.taskTitle} numberOfLines={1}>
                          {task.title}
                        </Text>
                        <Text style={styles.taskDuration}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0f0f1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 24,
  },
  dateTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 36,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  q2Value: {
    color: '#10b981',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  matrixSection: {
    marginTop: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  taskItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quadrantBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  quadrantText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  taskTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  taskDuration: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  taskCategory: {
    marginTop: 8,
    marginLeft: 42,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
