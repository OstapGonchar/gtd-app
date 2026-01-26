import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { QuadrantBreakdown, QUADRANT_INFO, CompletionStats } from '../types';
import { formatDuration } from '../database';
import { useTheme } from '../ThemeContext';

// Import Q2 illustration for empty state
const q2Illustration = require('../../assets/q2-illustration.png');

interface Q2ProgressProps {
  quadrantMinutes: QuadrantBreakdown;
  totalMinutes: number;
  q2Percentage: number;
  completion?: CompletionStats;
  showBreakdown?: boolean;
}

export function Q2Progress({ quadrantMinutes, totalMinutes, q2Percentage, completion, showBreakdown = true }: Q2ProgressProps) {
  const { theme } = useTheme();

  if (totalMinutes === 0 && (!completion || completion.total === 0)) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Image
          source={q2Illustration}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>Ready to focus?</Text>
        <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>Log your first activity to see your Q2 progress</Text>
      </View>
    );
  }

  const getEmoji = () => {
    if (q2Percentage >= 40) return '\u{1F525}'; // Fire
    if (q2Percentage >= 30) return '\u{1F4AA}'; // Muscle
    if (q2Percentage >= 20) return '\u{1F44D}'; // Thumbs up
    return '\u{1F914}'; // Thinking
  };

  const getGuidanceText = () => {
    if (q2Percentage >= 40) {
      return { text: 'Excellent focus!', color: theme.colors.q2 };
    }
    if (q2Percentage >= 30) {
      return { text: 'Good progress, keep it up!', color: theme.colors.q2 };
    }
    if (q2Percentage >= 20) {
      return { text: 'Room to improve Q2 time', color: theme.colors.q3 };
    }
    const q1Percent = totalMinutes > 0 ? (quadrantMinutes.q1 / totalMinutes) * 100 : 0;
    const q3Percent = totalMinutes > 0 ? (quadrantMinutes.q3 / totalMinutes) * 100 : 0;
    const q4Percent = totalMinutes > 0 ? (quadrantMinutes.q4 / totalMinutes) * 100 : 0;

    if (q1Percent > 30) {
      return { text: 'High firefighting - plan ahead', color: theme.colors.q1 };
    }
    if (q3Percent > 30) {
      return { text: 'Consider delegating more', color: theme.colors.q3 };
    }
    if (q4Percent > 20) {
      return { text: 'Reduce time-wasters', color: theme.colors.q4 };
    }
    return { text: 'Focus more on Q2 priorities', color: theme.colors.q3 };
  };

  const guidance = getGuidanceText();

  // Completion status helpers
  const hasCompletion = completion && completion.total > 0;
  const allCompleted = hasCompletion && completion.completed === completion.total;
  const q2AllCompleted = hasCompletion && completion.q2Total > 0 && completion.q2Completed === completion.q2Total;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Completion Progress - Prominent at top */}
      {hasCompletion && (
        <View style={[styles.completionSection, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.completionRow}>
            <View style={styles.completionItem}>
              <Text style={[styles.completionLabel, { color: theme.colors.textSecondary }]}>Tasks Done</Text>
              <View style={styles.completionValue}>
                <Text style={[styles.completionNumber, { color: allCompleted ? theme.colors.q2 : theme.colors.text }]}>
                  {completion.completed}/{completion.total}
                </Text>
                {allCompleted && <Text style={styles.completionCheck}> ✓</Text>}
              </View>
              <View style={[styles.miniProgressBar, { backgroundColor: theme.colors.surfaceAlt }]}>
                <View
                  style={[
                    styles.miniProgressFill,
                    {
                      width: `${completion.percentage}%`,
                      backgroundColor: allCompleted ? theme.colors.q2 : theme.colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            {completion.q2Total > 0 && (
              <View style={styles.completionItem}>
                <Text style={[styles.completionLabel, { color: theme.colors.q2 }]}>Q2 Tasks</Text>
                <View style={styles.completionValue}>
                  <Text style={[styles.completionNumber, { color: q2AllCompleted ? theme.colors.q2 : theme.colors.text }]}>
                    {completion.q2Completed}/{completion.q2Total}
                  </Text>
                  {q2AllCompleted && <Text style={styles.completionCheck}> ✓</Text>}
                </View>
                <View style={[styles.miniProgressBar, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.miniProgressFill,
                      {
                        width: `${completion.q2Percentage}%`,
                        backgroundColor: theme.colors.q2,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>

          {allCompleted ? (
            <Text style={[styles.completionMessage, { color: theme.colors.q2 }]}>
              🎉 All tasks completed!
            </Text>
          ) : completion.completed > 0 ? (
            <Text style={[styles.completionMessage, { color: theme.colors.textMuted }]}>
              {completion.total - completion.completed} task{completion.total - completion.completed !== 1 ? 's' : ''} remaining
            </Text>
          ) : (
            <Text style={[styles.completionMessage, { color: theme.colors.q3 }]}>
              Start checking off your tasks!
            </Text>
          )}
        </View>
      )}

      {/* Main Q2 Score */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>Q2 Focus</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: theme.colors.q2 }]}>{q2Percentage}%</Text>
          <Text style={styles.scoreEmoji}>{getEmoji()}</Text>
        </View>
        <Text style={[styles.scoreSubtext, { color: theme.colors.textMuted }]}>
          {formatDuration(quadrantMinutes.q2)} of {formatDuration(totalMinutes)}
        </Text>
        <Text style={[styles.guidanceText, { color: guidance.color }]}>
          {guidance.text}
        </Text>
      </View>

      {/* Quadrant Breakdown Bar */}
      {showBreakdown && (
        <View style={styles.breakdownContainer}>
          <View style={[styles.barContainer, { backgroundColor: theme.colors.surfaceAlt }]}>
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
                  <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
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
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  emptyContainer: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    opacity: 0.9,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
  completionSection: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  completionItem: {
    alignItems: 'center',
    flex: 1,
  },
  completionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  completionValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  completionCheck: {
    fontSize: 18,
    color: '#10B981',
  },
  miniProgressBar: {
    height: 6,
    width: 80,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  completionMessage: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
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
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
  },
  scoreEmoji: {
    fontSize: 36,
  },
  scoreSubtext: {
    fontSize: 14,
    marginTop: 6,
  },
  guidanceText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  breakdownContainer: {
    marginTop: 8,
  },
  barContainer: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
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
    fontSize: 13,
    fontWeight: '500',
  },
});
