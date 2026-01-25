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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0A0A0F',
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
    borderBottomColor: '#12121A',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#12121A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  closeButtonText: {
    color: '#F1F5F9',
    fontSize: 24,
    lineHeight: 24,
  },
  dateTitle: {
    color: '#F1F5F9',
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
    backgroundColor: '#12121A',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: '#F1F5F9',
    fontSize: 22,
    fontWeight: '700',
  },
  q2Value: {
    color: '#10B981',
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  matrixSection: {
    marginTop: 18,
    backgroundColor: '#12121A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  sectionTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  taskItem: {
    backgroundColor: '#12121A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },
  taskDuration: {
    color: '#94A3B8',
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
