import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quadrant, QUADRANT_INFO } from '../types';

interface QuadrantPickerProps {
  selected: Quadrant | null;
  onSelect: (quadrant: Quadrant) => void;
  compact?: boolean;
}

export function QuadrantPicker({ selected, onSelect, compact = false }: QuadrantPickerProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {([1, 2, 3, 4] as Quadrant[]).map((q) => {
        const info = QUADRANT_INFO[q];
        const isSelected = selected === q;

        return (
          <TouchableOpacity
            key={q}
            style={[
              styles.button,
              compact && styles.buttonCompact,
              { borderColor: info.color },
              isSelected && { backgroundColor: info.color },
            ]}
            onPress={() => onSelect(q)}
          >
            <Text
              style={[
                styles.label,
                compact && styles.labelCompact,
                isSelected && styles.labelSelected,
              ]}
            >
              {info.label}
            </Text>
            {!compact && (
              <Text style={[styles.description, isSelected && styles.descriptionSelected]}>
                {info.description}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  containerCompact: {
    gap: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  buttonCompact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 0,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  labelCompact: {
    fontSize: 14,
  },
  labelSelected: {
    color: '#ffffff',
  },
  description: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  descriptionSelected: {
    color: '#ffffffcc',
  },
});
