import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StreakInfo } from '../types';

// Import streak images
const streakFire = require('../../assets/streak-fire.png');
const streak7 = require('../../assets/streak-7.png');
const streak30 = require('../../assets/streak-30.png');
const streak100 = require('../../assets/streak-100.png');

interface StreakBadgeProps {
  streak: StreakInfo;
  size?: 'small' | 'large';
  onPress?: () => void;
}

export function StreakBadge({ streak, size = 'small', onPress }: StreakBadgeProps) {
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
    if (streak.currentStreak > 0) return '#F59E0B'; // Amber - building
    return '#64748B'; // Gray - no streak
  };

  const isLarge = size === 'large';
  const imageSize = isLarge ? 32 : 20;

  const content = (
    <View style={[
      styles.container,
      isLarge && styles.containerLarge,
      { borderColor: getBadgeColor() + '40' },
      streak.currentStreak === 0 && styles.containerInactive,
    ]}>
      <Image
        source={getBadgeImage()}
        style={[
          styles.fireImage,
          { width: imageSize, height: imageSize },
          streak.currentStreak === 0 && styles.imageInactive,
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

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
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
  containerInactive: {
    backgroundColor: '#12121A',
  },
  fireImage: {
    width: 20,
    height: 20,
  },
  imageInactive: {
    opacity: 0.5,
  },
  streakCount: {
    fontSize: 15,
    fontWeight: '800',
  },
  streakCountLarge: {
    fontSize: 20,
  },
});
