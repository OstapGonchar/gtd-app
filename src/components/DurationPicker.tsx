import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DURATION_PRESETS } from '../types';
import { formatDuration } from '../database';

interface DurationPickerProps {
  selected: number;
  onSelect: (duration: number) => void;
}

export function DurationPicker({ selected, onSelect }: DurationPickerProps) {
  const isPreset = DURATION_PRESETS.includes(selected as any);

  return (
    <View style={styles.container}>
      {DURATION_PRESETS.map((duration) => {
        const isSelected = selected === duration;

        return (
          <TouchableOpacity
            key={duration}
            style={[styles.button, isSelected && styles.buttonSelected]}
            onPress={() => onSelect(duration)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {formatDuration(duration)}
            </Text>
          </TouchableOpacity>
        );
      })}
      {!isPreset && selected > 0 && (
        <View style={[styles.button, styles.buttonSelected]}>
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
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#252542',
  },
  buttonSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
