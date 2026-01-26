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

  // Completion status helpers
  const hasCompletion = completion && completion.total > 0;
  const hasQ2Tasks = completion && completion.q2Total > 0;
  const allCompleted = hasCompletion && completion.completed === completion.total;
  const q2AllCompleted = hasQ2Tasks && completion.q2Completed === completion.q2Total;

  // NEW: Q2 Focus is now based on Q2 task completion, not time distribution
  // This is the real measure of focus - actually completing important work
  const q2CompletionPercent = hasQ2Tasks ? completion.q2Percentage : 0;

  if (totalMinutes === 0 && (!completion || completion.total === 0)) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Image
          source={q2Illustration}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>Ready to focus?</Text>
        <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>Add your first task to start tracking Q2 completion</Text>
      </View>
    );
  }

  // Emoji based on Q2 completion, not time distribution
  const getEmoji = () => {
    if (!hasQ2Tasks) return '\u{1F914}'; // Thinking - no Q2 tasks
    if (q2CompletionPercent >= 80) return '\u{1F525}'; // Fire - excellent
    if (q2CompletionPercent >= 50) return '\u{1F4AA}'; // Muscle - good
    if (q2CompletionPercent > 0) return '\u{1F44D}'; // Thumbs up - started
    return '\u{23F3}'; // Hourglass - waiting to start
  };

  // Guidance based on Q2 completion AND having Q2 tasks
  const getGuidanceText = () => {
    if (!hasQ2Tasks) {
      return { text: 'Add some Q2 tasks to focus on', color: theme.colors.q3 };
    }
    if (q2AllCompleted) {
      return { text: 'All Q2 tasks completed!', color: theme.colors.q2 };
    }
    if (q2CompletionPercent >= 50) {
      return { text: 'Great progress on Q2 tasks!', color: theme.colors.q2 };
    }
    if (q2CompletionPercent > 0) {
      return { text: 'Keep completing Q2 tasks!', color: theme.colors.q2 };
    }
    return { text: 'Start checking off Q2 tasks!', color: theme.colors.q3 };
  };

  const guidance = getGuidanceText();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Completion Progress - Prominent at top */}
      {hasCompletion && (
        <View style={[styles.completionSection, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.completionRow}>
            <View style={styles.completionItem}>
              <Text style={[styles.completionLabel, { color: theme.colors.textSecondary }]}>Total Tasks</Text>
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

      {/* Main Q2 Completion Score - This is the PRIMARY metric */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>Q2 Completion</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: hasQ2Tasks && q2CompletionPercent > 0 ? theme.colors.q2 : theme.colors.textMuted }]}>
            {hasQ2Tasks ? `${q2CompletionPercent}%` : '--'}
          </Text>
          <Text style={styles.scoreEmoji}>{getEmoji()}</Text>
        </View>
        {hasQ2Tasks ? (
          <Text style={[styles.scoreSubtext, { color: theme.colors.textMuted }]}>
            {completion.q2Completed}/{completion.q2Total} Q2 tasks done
          </Text>
        ) : (
          <Text style={[styles.scoreSubtext, { color: theme.colors.textMuted }]}>
            No Q2 tasks yet
          </Text>
        )}
        <Text style={[styles.guidanceText, { color: guidance.color }]}>
          {guidance.text}
        </Text>
      </View>

      {/* Time Distribution - Secondary metric for planning insight */}
      {showBreakdown && totalMinutes > 0 && (
        <View style={styles.breakdownContainer}>
          <Text style={[styles.breakdownLabel, { color: theme.colors.textMuted }]}>Time Distribution</Text>
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
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
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
