import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StreakInfo } from '../types';

interface StreakBadgeProps {
  streak: StreakInfo;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak.currentStreak === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.fireEmoji}>{'\uD83D\uDD25'}</Text>
      <Text style={styles.streakCount}>{streak.currentStreak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  fireEmoji: {
    fontSize: 14,
  },
  streakCount: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '700',
  },
});
