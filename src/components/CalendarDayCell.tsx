import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarDayCellProps {
  day: number | null;
  date: string | null;
  q2Percentage: number | null;
  totalMinutes: number;
  isToday: boolean;
  isSelected: boolean;
  onPress: (date: string) => void;
}

export function CalendarDayCell({
  day,
  date,
  q2Percentage,
  totalMinutes,
  isToday,
  isSelected,
  onPress,
}: CalendarDayCellProps) {
  if (day === null || date === null) {
    return <View style={styles.cell} />;
  }

  const hasData = totalMinutes > 0;
  const intensity = q2Percentage !== null ? getIntensity(q2Percentage) : 0;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        hasData && styles.cellWithData,
        hasData && { backgroundColor: getBackgroundColor(intensity) },
        isToday && styles.cellToday,
        isSelected && styles.cellSelected,
      ]}
      onPress={() => onPress(date)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.dayNumber,
          hasData && styles.dayNumberWithData,
          isToday && styles.dayNumberToday,
        ]}
      >
        {day}
      </Text>
      {hasData && (
        <View style={styles.indicator}>
          <View
            style={[
              styles.indicatorDot,
              { backgroundColor: getDotColor(q2Percentage || 0) },
            ]}
          />
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

function getBackgroundColor(intensity: number): string {
  const colors = [
    '#1a1a2e', // 0 - no data
    '#0d2818', // 1 - low Q2
    '#134e28', // 2 - medium Q2
    '#166534', // 3 - good Q2
    '#15803d', // 4 - excellent Q2
  ];
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
    borderRadius: 8,
    margin: 2,
    minHeight: 40,
  },
  cellWithData: {
    borderWidth: 1,
    borderColor: '#252542',
  },
  cellToday: {
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  cellSelected: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  dayNumber: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  dayNumberWithData: {
    color: '#ffffff',
    fontWeight: '600',
  },
  dayNumberToday: {
    color: '#8b5cf6',
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
