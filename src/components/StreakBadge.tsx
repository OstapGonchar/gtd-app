import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StreakInfo } from '../types';

// Import streak images
const streakFire = require('../../assets/streak-fire.png');
const streak7 = require('../../assets/streak-7.png');
const streak30 = require('../../assets/streak-30.png');
const streak100 = require('../../assets/streak-100.png');

interface StreakBadgeProps {
  streak: StreakInfo;
  size?: 'small' | 'large';
}

export function StreakBadge({ streak, size = 'small' }: StreakBadgeProps) {
  if (streak.currentStreak === 0) {
    return null;
  }

  // Determine which badge to show based on milestone
  const getBadgeImage = () => {
    if (streak.currentStreak >= 100) return streak100;
    if (streak.currentStreak >= 30) return streak30;
    if (streak.currentStreak >= 7) return streak7;
    return streakFire;
  };

  // Get badge color based on milestone
  const getBadgeColor = () => {
    if (streak.currentStreak >= 100) return '#F43F5E'; // Rose - legendary
    if (streak.currentStreak >= 30) return '#A78BFA'; // Purple - epic
    if (streak.currentStreak >= 7) return '#10B981'; // Emerald - solid
    return '#F59E0B'; // Amber - building
  };

  const isLarge = size === 'large';
  const imageSize = isLarge ? 32 : 20;

  return (
    <View style={[
      styles.container,
      isLarge && styles.containerLarge,
      { borderColor: getBadgeColor() + '40' },
    ]}>
      <Image
        source={getBadgeImage()}
        style={[
          styles.fireImage,
          { width: imageSize, height: imageSize },
        ]}
        resizeMode="contain"
      />
      <Text style={[
        styles.streakCount,
        isLarge && styles.streakCountLarge,
        { color: getBadgeColor() },
      ]}>
        {streak.currentStreak}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  fireImage: {
    width: 20,
    height: 20,
  },
  streakCount: {
    fontSize: 15,
    fontWeight: '800',
  },
  streakCountLarge: {
    fontSize: 20,
  },
});
