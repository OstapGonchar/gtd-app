import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DEFAULT_DURATION_PRESETS } from '../types';
import { formatDuration } from '../database';

interface DurationPickerProps {
  selected: number;
  onSelect: (duration: number) => void;
  presets?: number[];
}

export function DurationPicker({ selected, onSelect, presets }: DurationPickerProps) {
  const durationPresets = presets ?? DEFAULT_DURATION_PRESETS;
  const isPreset = durationPresets.includes(selected);

  return (
    <View style={styles.container}>
      {durationPresets.map((duration) => {
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
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#12121A',
    borderWidth: 1,
    borderColor: '#252542',
  },
  buttonSelected: {
    backgroundColor: '#A78BFA',
    borderColor: '#A78BFA',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
