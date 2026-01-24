import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuadrantBreakdown, QUADRANT_INFO } from '../types';
import { formatDuration } from '../database';

interface Q2ProgressProps {
  quadrantMinutes: QuadrantBreakdown;
  totalMinutes: number;
  q2Percentage: number;
  showBreakdown?: boolean;
}

export function Q2Progress({ quadrantMinutes, totalMinutes, q2Percentage, showBreakdown = true }: Q2ProgressProps) {
  if (totalMinutes === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks logged yet</Text>
      </View>
    );
  }

  const getEmoji = () => {
    if (q2Percentage >= 40) return '\u{1F525}'; // Fire
    if (q2Percentage >= 30) return '\u{1F4AA}'; // Muscle
    if (q2Percentage >= 20) return '\u{1F44D}'; // Thumbs up
    return '\u{1F914}'; // Thinking
  };

  return (
    <View style={styles.container}>
      {/* Main Q2 Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Q2 Focus</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreValue}>{q2Percentage}%</Text>
          <Text style={styles.scoreEmoji}>{getEmoji()}</Text>
        </View>
        <Text style={styles.scoreSubtext}>
          {formatDuration(quadrantMinutes.q2)} of {formatDuration(totalMinutes)}
        </Text>
      </View>

      {/* Quadrant Breakdown Bar */}
      {showBreakdown && (
        <View style={styles.breakdownContainer}>
          <View style={styles.barContainer}>
            {([1, 2, 3, 4] as const).map((q) => {
              const minutes = quadrantMinutes[`q${q}` as keyof QuadrantBreakdown];
              const percent = (minutes / totalMinutes) * 100;
              if (percent === 0) return null;

              return (
                <View
                  key={q}
                  style={[
                    styles.barSegment,
                    {
                      width: `${percent}%`,
                      backgroundColor: QUADRANT_INFO[q].color,
                    },
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.legendContainer}>
            {([1, 2, 3, 4] as const).map((q) => {
              const minutes = quadrantMinutes[`q${q}` as keyof QuadrantBreakdown];
              if (minutes === 0) return null;

              return (
                <View key={q} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: QUADRANT_INFO[q].color }]} />
                  <Text style={styles.legendText}>
                    {QUADRANT_INFO[q].label}: {formatDuration(minutes)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
  },
  emptyContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreValue: {
    color: '#10b981',
    fontSize: 48,
    fontWeight: '800',
  },
  scoreEmoji: {
    fontSize: 32,
  },
  scoreSubtext: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  breakdownContainer: {
    marginTop: 8,
  },
  barContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#252542',
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
