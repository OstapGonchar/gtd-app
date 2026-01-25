import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DEFAULT_DURATION_PRESETS } from '../types';
import { formatDuration } from '../database';
import { useTheme } from '../ThemeContext';

interface DurationPickerProps {
  selected: number;
  onSelect: (duration: number) => void;
  presets?: number[];
}

export function DurationPicker({ selected, onSelect, presets }: DurationPickerProps) {
  const { theme } = useTheme();
  const durationPresets = presets ?? DEFAULT_DURATION_PRESETS;
  const isPreset = durationPresets.includes(selected);

  return (
    <View style={styles.container}>
      {durationPresets.map((duration) => {
        const isSelected = selected === duration;

        return (
          <TouchableOpacity
            key={duration}
            style={[
              styles.button,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
            ]}
            onPress={() => onSelect(duration)}
          >
            <Text style={[styles.label, { color: theme.colors.textSecondary }, isSelected && styles.labelSelected]}>
              {formatDuration(duration)}
            </Text>
          </TouchableOpacity>
        );
      })}
      {!isPreset && selected > 0 && (
        <View style={[styles.button, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
          <Text style={[styles.label, styles.labelSelected]}>
            {formatDuration(selected)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
