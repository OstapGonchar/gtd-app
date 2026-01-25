import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { QuadrantBreakdown, QUADRANT_INFO } from '../types';
import { formatDuration } from '../database';

// Import Q2 illustration for empty state
const q2Illustration = require('../../assets/q2-illustration.png');

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
        <Image
          source={q2Illustration}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>Ready to focus?</Text>
        <Text style={styles.emptySubtext}>Log your first activity to see your Q2 progress</Text>
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
    backgroundColor: '#12121A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#252542',
  },
  emptyContainer: {
    backgroundColor: '#12121A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252542',
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    opacity: 0.9,
  },
  emptyText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreValue: {
    color: '#10B981',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scoreEmoji: {
    fontSize: 36,
  },
  scoreSubtext: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 6,
  },
  breakdownContainer: {
    marginTop: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#1A1A2E',
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
});
