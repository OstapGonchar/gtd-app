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
  const getBadgeImage = () => {
    if (streak.currentStreak >= 100) return streak100;
    if (streak.currentStreak >= 30) return streak30;
    if (streak.currentStreak >= 7) return streak7;
    return streakFire;
  };

  const getBadgeColor = () => {
    if (streak.currentStreak >= 100) return '#F43F5E';
    if (streak.currentStreak >= 30) return '#A78BFA';
    if (streak.currentStreak >= 7) return '#10B981';
    return '#F59E0B';
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
        color: '#94A3B8',
      };
    }

    if (q2 >= 40) {
      return {
        title: 'Excellent focus!',
        message: 'You\'re spending most of your time on important, non-urgent work. This is the ideal pattern for long-term success.',
        color: '#10B981',
      };
    }

    if (q2 >= 30) {
      return {
        title: 'Good progress',
        message: 'You have a solid foundation. Try to reduce Q3 activities by delegating or declining non-essential requests.',
        color: '#10B981',
      };
    }

    const q1Percent = total > 0 ? (q1 / total) * 100 : 0;
    const q3Percent = total > 0 ? (q3 / total) * 100 : 0;
    const q4Percent = total > 0 ? (q4 / total) * 100 : 0;

    if (q1Percent > 30) {
      return {
        title: 'Too much firefighting',
        message: 'High Q1 time indicates reactive work. Invest more in Q2 planning to prevent crises before they happen.',
        color: '#ef4444',
      };
    }

    if (q3Percent > 30) {
      return {
        title: 'Consider delegating more',
        message: 'You\'re spending a lot of time on urgent but less important tasks. Practice saying no or delegating these activities.',
        color: '#f59e0b',
      };
    }

    if (q4Percent > 20) {
      return {
        title: 'Watch time-wasters',
        message: 'Reduce Q4 activities and redirect that time to Q2 strategic work.',
        color: '#6b7280',
      };
    }

    return {
      title: 'Room to improve',
      message: 'Focus on scheduling more time for important, non-urgent work (Q2) to achieve better long-term results.',
      color: '#f59e0b',
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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Your Stats</Text>
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
              <Text style={styles.streakLabel}>day streak</Text>
              <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
            </View>

            {/* Streak Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{streak.longestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{allTimeStats.totalDays}</Text>
                <Text style={styles.statLabel}>Active Days</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{allTimeStats.totalTasks}</Text>
                <Text style={styles.statLabel}>Activities</Text>
              </View>
            </View>

            {/* All-Time Distribution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All-Time Distribution</Text>

              {allTimeStats.totalMinutes > 0 ? (
                <>
                  {/* Progress Bar */}
                  <View style={styles.barContainer}>
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
                        <View key={q} style={styles.quadrantItem}>
                          <View style={[styles.quadrantDot, { backgroundColor: QUADRANT_INFO[q].color }]} />
                          <View style={styles.quadrantInfo}>
                            <Text style={styles.quadrantLabel}>{QUADRANT_INFO[q].label}</Text>
                            <Text style={styles.quadrantName}>{QUADRANT_INFO[q].name}</Text>
                          </View>
                          <View style={styles.quadrantStats}>
                            <Text style={[styles.quadrantPercent, q === 2 && styles.q2Highlight]}>
                              {percent}%
                            </Text>
                            <Text style={styles.quadrantTime}>{formatDuration(minutes)}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Average Stats */}
                  <View style={styles.avgRow}>
                    <View style={styles.avgItem}>
                      <Text style={styles.avgValue}>{formatDuration(allTimeStats.avgDailyMinutes)}</Text>
                      <Text style={styles.avgLabel}>Avg daily time</Text>
                    </View>
                    <View style={styles.avgItem}>
                      <Text style={[styles.avgValue, styles.q2Highlight]}>{allTimeStats.avgDailyQ2Percentage}%</Text>
                      <Text style={styles.avgLabel}>Avg daily Q2</Text>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>No data yet. Start logging activities to see your distribution.</Text>
              )}
            </View>

            {/* Guidance Section */}
            <View style={[styles.guidanceSection, { borderColor: guidance.color + '40' }]}>
              <Text style={[styles.guidanceTitle, { color: guidance.color }]}>{guidance.title}</Text>
              <Text style={styles.guidanceMessage}>{guidance.message}</Text>
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
    backgroundColor: '#0A0A0F',
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
  headerTitle: {
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
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
    marginTop: -4,
  },
  streakMessage: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#12121A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#1A1A2E',
  },
  statValue: {
    color: '#F1F5F9',
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#F1F5F9',
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
    backgroundColor: '#1A1A2E',
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
    backgroundColor: '#12121A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1A1A2E',
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
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
  },
  quadrantName: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  quadrantStats: {
    alignItems: 'flex-end',
  },
  quadrantPercent: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },
  q2Highlight: {
    color: '#10B981',
  },
  quadrantTime: {
    color: '#64748B',
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
    backgroundColor: '#12121A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  avgValue: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
  },
  avgLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  guidanceSection: {
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: '#12121A',
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
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
});
