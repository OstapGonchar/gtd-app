import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { StreakInfo, QUADRANT_INFO } from '../types';
import { AllTimeStats, formatDuration } from '../database';
import { useTheme } from '../ThemeContext';

const streakFire = require('../../assets/streak-fire.png');
const streak7 = require('../../assets/streak-7.png');
const streak30 = require('../../assets/streak-30.png');
const streak100 = require('../../assets/streak-100.png');

interface StatsModalProps {
  visible: boolean;
  streak: StreakInfo;
  allTimeStats: AllTimeStats;
  onClose: () => void;
}

export function StatsModal({
  visible,
  streak,
  allTimeStats,
  onClose,
}: StatsModalProps) {
  const { theme } = useTheme();

  const getBadgeImage = () => {
    if (streak.currentStreak >= 100) return streak100;
    if (streak.currentStreak >= 30) return streak30;
    if (streak.currentStreak >= 7) return streak7;
    return streakFire;
  };

  const getBadgeColor = () => {
    if (streak.currentStreak >= 100) return theme.colors.q1;
    if (streak.currentStreak >= 30) return theme.colors.primary;
    if (streak.currentStreak >= 7) return theme.colors.q2;
    return theme.colors.q3;
  };

  const getStreakMessage = () => {
    if (streak.currentStreak === 0) return 'Start your streak today!';
    if (streak.currentStreak >= 100) return 'Legendary consistency!';
    if (streak.currentStreak >= 30) return 'Epic dedication!';
    if (streak.currentStreak >= 7) return 'Building strong habits!';
    if (streak.currentStreak >= 3) return 'Keep the momentum going!';
    return 'Great start!';
  };

  const getGuidanceText = () => {
    const q2 = allTimeStats.q2Percentage;
    const q1 = allTimeStats.quadrantMinutes.q1;
    const q3 = allTimeStats.quadrantMinutes.q3;
    const q4 = allTimeStats.quadrantMinutes.q4;
    const total = allTimeStats.totalMinutes;

    if (total === 0) {
      return {
        title: 'Ready to begin',
        message: 'Log your first activity to start tracking your focus patterns.',
        color: theme.colors.textSecondary,
      };
    }

    if (q2 >= 40) {
      return {
        title: 'Excellent focus!',
        message: 'You\'re spending most of your time on important, non-urgent work. This is the ideal pattern for long-term success.',
        color: theme.colors.q2,
      };
    }

    if (q2 >= 30) {
      return {
        title: 'Good progress',
        message: 'You have a solid foundation. Try to reduce Q3 activities by delegating or declining non-essential requests.',
        color: theme.colors.q2,
      };
    }

    const q1Percent = total > 0 ? (q1 / total) * 100 : 0;
    const q3Percent = total > 0 ? (q3 / total) * 100 : 0;
    const q4Percent = total > 0 ? (q4 / total) * 100 : 0;

    if (q1Percent > 30) {
      return {
        title: 'Too much firefighting',
        message: 'High Q1 time indicates reactive work. Invest more in Q2 planning to prevent crises before they happen.',
        color: theme.colors.q1,
      };
    }

    if (q3Percent > 30) {
      return {
        title: 'Consider delegating more',
        message: 'You\'re spending a lot of time on urgent but less important tasks. Practice saying no or delegating these activities.',
        color: theme.colors.q3,
      };
    }

    if (q4Percent > 20) {
      return {
        title: 'Watch time-wasters',
        message: 'Reduce Q4 activities and redirect that time to Q2 strategic work.',
        color: theme.colors.q4,
      };
    }

    return {
      title: 'Room to improve',
      message: 'Focus on scheduling more time for important, non-urgent work (Q2) to achieve better long-term results.',
      color: theme.colors.q3,
    };
  };

  const guidance = getGuidanceText();

  const getQuadrantPercent = (quadrant: keyof typeof allTimeStats.quadrantMinutes) => {
    if (allTimeStats.totalMinutes === 0) return 0;
    return Math.round((allTimeStats.quadrantMinutes[quadrant] / allTimeStats.totalMinutes) * 100);
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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Your Stats</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Streak Section */}
            <View style={styles.streakSection}>
              <Image
                source={getBadgeImage()}
                style={styles.streakImage}
                resizeMode="contain"
              />
              <Text style={[styles.streakCount, { color: getBadgeColor() }]}>
                {streak.currentStreak}
              </Text>
              <Text style={[styles.streakLabel, { color: theme.colors.textMuted }]}>day streak</Text>
              <Text style={[styles.streakMessage, { color: theme.colors.textSecondary }]}>{getStreakMessage()}</Text>
            </View>

            {/* Streak Stats Row */}
            <View style={[styles.statsRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{streak.longestStreak}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Best Streak</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{allTimeStats.totalDays}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Active Days</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{allTimeStats.totalTasks}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Activities</Text>
              </View>
            </View>

            {/* Completion Stats */}
            {allTimeStats.totalTasks > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Task Completion</Text>
                <View style={styles.completionRow}>
                  <View style={[styles.completionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.completionValue, { color: allTimeStats.completionPercentage >= 70 ? theme.colors.q2 : theme.colors.text }]}>
                      {allTimeStats.completionPercentage}%
                    </Text>
                    <Text style={[styles.completionLabel, { color: theme.colors.textMuted }]}>Overall</Text>
                    <Text style={[styles.completionDetail, { color: theme.colors.textSecondary }]}>
                      {allTimeStats.completedTasks}/{allTimeStats.totalTasks} done
                    </Text>
                    {/* Mini progress bar */}
                    <View style={[styles.completionBar, { backgroundColor: theme.colors.surfaceAlt }]}>
                      <View style={[styles.completionBarFill, { width: `${allTimeStats.completionPercentage}%`, backgroundColor: allTimeStats.completionPercentage >= 70 ? theme.colors.q2 : theme.colors.primary }]} />
                    </View>
                  </View>
                  {allTimeStats.q2Tasks > 0 && (
                    <View style={[styles.completionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      <Text style={[styles.completionValue, { color: theme.colors.q2 }]}>
                        {allTimeStats.q2CompletionPercentage}%
                      </Text>
                      <Text style={[styles.completionLabel, { color: theme.colors.q2 }]}>Q2 Tasks</Text>
                      <Text style={[styles.completionDetail, { color: theme.colors.textSecondary }]}>
                        {allTimeStats.q2CompletedTasks}/{allTimeStats.q2Tasks} done
                      </Text>
                      {/* Mini progress bar */}
                      <View style={[styles.completionBar, { backgroundColor: theme.colors.surfaceAlt }]}>
                        <View style={[styles.completionBarFill, { width: `${allTimeStats.q2CompletionPercentage}%`, backgroundColor: theme.colors.q2 }]} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* All-Time Distribution */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>All-Time Distribution</Text>

              {allTimeStats.totalMinutes > 0 ? (
                <>
                  {/* Progress Bar */}
                  <View style={[styles.barContainer, { backgroundColor: theme.colors.surfaceAlt }]}>
                    {([1, 2, 3, 4] as const).map((q) => {
                      const percent = getQuadrantPercent(`q${q}` as keyof typeof allTimeStats.quadrantMinutes);
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

                  {/* Quadrant Breakdown */}
                  <View style={styles.quadrantGrid}>
                    {([1, 2, 3, 4] as const).map((q) => {
                      const minutes = allTimeStats.quadrantMinutes[`q${q}` as keyof typeof allTimeStats.quadrantMinutes];
                      const percent = getQuadrantPercent(`q${q}` as keyof typeof allTimeStats.quadrantMinutes);
                      return (
                        <View key={q} style={[styles.quadrantItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                          <View style={[styles.quadrantDot, { backgroundColor: QUADRANT_INFO[q].color }]} />
                          <View style={styles.quadrantInfo}>
                            <Text style={[styles.quadrantLabel, { color: theme.colors.text }]}>{QUADRANT_INFO[q].label}</Text>
                            <Text style={[styles.quadrantName, { color: theme.colors.textMuted }]}>{QUADRANT_INFO[q].name}</Text>
                          </View>
                          <View style={styles.quadrantStats}>
                            <Text style={[styles.quadrantPercent, { color: theme.colors.text }, q === 2 && { color: theme.colors.q2 }]}>
                              {percent}%
                            </Text>
                            <Text style={[styles.quadrantTime, { color: theme.colors.textMuted }]}>{formatDuration(minutes)}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Average Stats */}
                  <View style={styles.avgRow}>
                    <View style={[styles.avgItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      <Text style={[styles.avgValue, { color: theme.colors.text }]}>{formatDuration(allTimeStats.avgDailyMinutes)}</Text>
                      <Text style={[styles.avgLabel, { color: theme.colors.textMuted }]}>Avg daily time</Text>
                    </View>
                    <View style={[styles.avgItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                      <Text style={[styles.avgValue, { color: theme.colors.q2 }]}>{allTimeStats.avgDailyQ2Percentage}%</Text>
                      <Text style={[styles.avgLabel, { color: theme.colors.textMuted }]}>Avg daily Q2</Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No data yet. Start logging activities to see your distribution.</Text>
              )}
            </View>

            {/* Guidance Section */}
            <View style={[styles.guidanceSection, { backgroundColor: theme.colors.surface, borderColor: guidance.color + '40' }]}>
              <Text style={[styles.guidanceTitle, { color: guidance.color }]}>{guidance.title}</Text>
              <Text style={[styles.guidanceMessage, { color: theme.colors.textSecondary }]}>{guidance.message}</Text>
            </View>
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
    maxHeight: '90%',
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
  headerTitle: {
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
  streakSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  streakImage: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  streakCount: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: -4,
  },
  streakMessage: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  barContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  barSegment: {
    height: '100%',
  },
  quadrantGrid: {
    gap: 10,
  },
  quadrantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  quadrantDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  quadrantInfo: {
    flex: 1,
  },
  quadrantLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  quadrantName: {
    fontSize: 12,
    marginTop: 2,
  },
  quadrantStats: {
    alignItems: 'flex-end',
  },
  quadrantPercent: {
    fontSize: 16,
    fontWeight: '700',
  },
  quadrantTime: {
    fontSize: 12,
    marginTop: 2,
  },
  avgRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  avgItem: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  avgValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  avgLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  guidanceSection: {
    marginTop: 24,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  guidanceMessage: {
    fontSize: 14,
    lineHeight: 21,
  },
  completionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  completionCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  completionValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  completionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  completionDetail: {
    fontSize: 12,
    marginTop: 4,
  },
  completionBar: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  completionBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
