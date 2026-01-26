import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CompletionStats } from '../types';
import { useTheme } from '../ThemeContext';

interface CalendarDayCellProps {
  day: number | null;
  date: string | null;
  q2Percentage: number | null;
  totalMinutes: number;
  isToday: boolean;
  isSelected: boolean;
  completion?: CompletionStats;
  onPress: (date: string) => void;
}

export function CalendarDayCell({
  day,
  date,
  q2Percentage,
  totalMinutes,
  isToday,
  isSelected,
  completion,
  onPress,
}: CalendarDayCellProps) {
  const { theme, isDark } = useTheme();

  if (day === null || date === null) {
    return <View style={styles.cell} />;
  }

  const hasData = totalMinutes > 0;
  const intensity = q2Percentage !== null ? getIntensity(q2Percentage) : 0;
  const allCompleted = completion && completion.total > 0 && completion.completed === completion.total;
  const hasIncomplete = completion && completion.total > 0 && completion.completed < completion.total;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        hasData && [styles.cellWithData, { borderColor: theme.colors.border }],
        hasData && { backgroundColor: getBackgroundColor(intensity, isDark) },
        isToday && [styles.cellToday, { borderColor: theme.colors.primary }],
        isSelected && { borderWidth: 2, borderColor: theme.colors.text },
        allCompleted && styles.cellCompleted,
      ]}
      onPress={() => onPress(date)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.dayNumber,
          { color: theme.colors.textMuted },
          hasData && { color: theme.colors.text, fontWeight: '600' },
          isToday && { color: theme.colors.primary, fontWeight: '700' },
        ]}
      >
        {day}
      </Text>
      {hasData && (
        <View style={styles.indicator}>
          {allCompleted ? (
            <Text style={styles.completedCheck}>✓</Text>
          ) : hasIncomplete ? (
            <View style={styles.partialIndicator}>
              <View
                style={[
                  styles.indicatorDot,
                  { backgroundColor: getDotColor(q2Percentage || 0) },
                ]}
              />
              <Text style={[styles.taskCount, { color: theme.colors.textMuted }]}>
                {completion.completed}/{completion.total}
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.indicatorDot,
                { backgroundColor: getDotColor(q2Percentage || 0) },
              ]}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function getIntensity(q2Percentage: number): number {
  if (q2Percentage >= 50) return 4;
  if (q2Percentage >= 35) return 3;
  if (q2Percentage >= 20) return 2;
  if (q2Percentage > 0) return 1;
  return 0;
}

function getBackgroundColor(intensity: number, isDark: boolean): string {
  // Dark theme colors (darker green gradations)
  const darkColors = [
    '#1a1a2e', // 0 - no data
    '#0d2818', // 1 - low Q2
    '#134e28', // 2 - medium Q2
    '#166534', // 3 - good Q2
    '#15803d', // 4 - excellent Q2
  ];

  // Light theme colors (lighter green gradations)
  const lightColors = [
    '#f1f5f9', // 0 - no data
    '#dcfce7', // 1 - low Q2
    '#bbf7d0', // 2 - medium Q2
    '#86efac', // 3 - good Q2
    '#4ade80', // 4 - excellent Q2
  ];

  const colors = isDark ? darkColors : lightColors;
  return colors[intensity] || colors[0];
}

function getDotColor(q2Percentage: number): string {
  if (q2Percentage >= 30) return '#10b981';
  if (q2Percentage >= 15) return '#f59e0b';
  return '#ef4444';
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 2,
    minHeight: 42,
  },
  cellWithData: {
    borderWidth: 1,
  },
  cellToday: {
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cellCompleted: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    bottom: 3,
  },
  indicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  completedCheck: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
  },
  partialIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  taskCount: {
    fontSize: 8,
    fontWeight: '600',
  },
});
