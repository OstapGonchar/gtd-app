import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quadrant, QUADRANT_INFO } from '../types';

interface QuadrantPickerProps {
  selected: Quadrant | null;
  onSelect: (quadrant: Quadrant) => void;
}

export function QuadrantPicker({ selected, onSelect }: QuadrantPickerProps) {
  return (
    <View style={styles.container}>
      {/* Column Headers */}
      <View style={styles.headerRow}>
        <View style={styles.cornerCell} />
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>URGENT</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>NOT URGENT</Text>
        </View>
      </View>

      {/* Important Row - Q1 & Q2 */}
      <View style={styles.matrixRow}>
        <View style={styles.sideHeader}>
          <Text style={styles.sideHeaderText}>IMPORTANT</Text>
        </View>
        <QuadrantCell
          quadrant={1}
          isSelected={selected === 1}
          onSelect={onSelect}
        />
        <QuadrantCell
          quadrant={2}
          isSelected={selected === 2}
          onSelect={onSelect}
          isGoal
        />
      </View>

      {/* Not Important Row - Q3 & Q4 */}
      <View style={styles.matrixRow}>
        <View style={styles.sideHeader}>
          <Text style={styles.sideHeaderText}>NOT{'\n'}IMPORTANT</Text>
        </View>
        <QuadrantCell
          quadrant={3}
          isSelected={selected === 3}
          onSelect={onSelect}
        />
        <QuadrantCell
          quadrant={4}
          isSelected={selected === 4}
          onSelect={onSelect}
        />
      </View>
    </View>
  );
}

interface QuadrantCellProps {
  quadrant: Quadrant;
  isSelected: boolean;
  onSelect: (quadrant: Quadrant) => void;
  isGoal?: boolean;
}

function QuadrantCell({ quadrant, isSelected, onSelect, isGoal }: QuadrantCellProps) {
  const info = QUADRANT_INFO[quadrant];

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { borderColor: info.color },
        isSelected && { backgroundColor: info.color, borderWidth: 3 },
        !isSelected && { backgroundColor: info.color + '15' },
        isGoal && !isSelected && styles.goalCell,
      ]}
      onPress={() => onSelect(quadrant)}
      activeOpacity={0.7}
    >
      <Text style={[styles.cellLabel, isSelected && styles.cellLabelSelected]}>
        {info.label}
      </Text>
      <Text style={[styles.cellName, isSelected && styles.cellNameSelected, { color: isSelected ? '#fff' : info.color }]}>
        {getCellAction(quadrant)}
      </Text>
      <Text style={[styles.cellDesc, isSelected && styles.cellDescSelected]}>
        {info.description}
      </Text>
      {isGoal && !isSelected && (
        <View style={[styles.goalBadge, { backgroundColor: info.color }]}>
          <Text style={styles.goalText}>GOAL</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function getCellAction(quadrant: Quadrant): string {
  switch (quadrant) {
    case 1: return 'Do First';
    case 2: return 'Schedule';
    case 3: return 'Delegate';
    case 4: return 'Eliminate';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  cornerCell: {
    width: 24,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  headerText: {
    color: '#6b7280',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matrixRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  sideHeader: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideHeaderText: {
    color: '#6b7280',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 70,
  },
  cell: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 85,
    justifyContent: 'center',
  },
  goalCell: {
    borderWidth: 2,
    borderStyle: 'solid',
  },
  cellLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  cellLabelSelected: {
    color: '#ffffffcc',
  },
  cellName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  cellNameSelected: {
    color: '#ffffff',
  },
  cellDesc: {
    color: '#6b7280',
    fontSize: 10,
    textAlign: 'center',
  },
  cellDescSelected: {
    color: '#ffffffaa',
  },
  goalBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  goalText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '800',
  },
});
