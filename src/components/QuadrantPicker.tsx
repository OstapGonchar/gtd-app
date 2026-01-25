import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Quadrant, QUADRANT_INFO } from '../types';
import { useTheme } from '../ThemeContext';

// Import quadrant illustrations
const quadrantImages: Record<Quadrant, any> = {
  1: require('../../assets/q1-illustration.png'),
  2: require('../../assets/q2-illustration.png'),
  3: require('../../assets/q3-illustration.png'),
  4: require('../../assets/q4-illustration.png'),
};

interface QuadrantPickerProps {
  selected: Quadrant | null;
  onSelect: (quadrant: Quadrant) => void;
}

export function QuadrantPicker({ selected, onSelect }: QuadrantPickerProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Column Headers */}
      <View style={styles.headerRow}>
        <View style={styles.cornerCell} />
        <View style={styles.headerCell}>
          <Text style={[styles.headerText, { color: theme.colors.textMuted }]}>URGENT</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={[styles.headerText, { color: theme.colors.textMuted }]}>NOT URGENT</Text>
        </View>
      </View>

      {/* Important Row - Q1 & Q2 */}
      <View style={styles.matrixRow}>
        <View style={styles.sideHeader}>
          <Text style={[styles.sideHeaderText, { color: theme.colors.textMuted }]}>IMPORTANT</Text>
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
          <Text style={[styles.sideHeaderText, { color: theme.colors.textMuted }]}>NOT{'\n'}IMPORTANT</Text>
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
  const { theme } = useTheme();
  const info = QUADRANT_INFO[quadrant];

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { borderColor: info.color },
        isSelected && {
          backgroundColor: info.color,
          borderWidth: 3,
          shadowColor: info.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 8,
        },
        !isSelected && { backgroundColor: info.color + '15' },
        isGoal && !isSelected && styles.goalCell,
      ]}
      onPress={() => onSelect(quadrant)}
      activeOpacity={0.7}
    >
      <Image
        source={quadrantImages[quadrant]}
        style={[
          styles.cellImage,
          isSelected && styles.cellImageSelected,
        ]}
        resizeMode="contain"
      />
      <Text style={[styles.cellLabel, { color: theme.colors.textSecondary }, isSelected && styles.cellLabelSelected]}>
        {info.label}
      </Text>
      <Text style={[styles.cellName, isSelected && styles.cellNameSelected, { color: isSelected ? '#fff' : info.color }]}>
        {getCellAction(quadrant)}
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
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 70,
  },
  cell: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  goalCell: {
    borderWidth: 2,
    borderStyle: 'solid',
  },
  cellImage: {
    width: 36,
    height: 36,
    marginBottom: 6,
    opacity: 0.9,
  },
  cellImageSelected: {
    opacity: 1,
    tintColor: '#ffffff',
  },
  cellLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  cellLabelSelected: {
    color: '#ffffffdd',
  },
  cellName: {
    fontSize: 12,
    fontWeight: '700',
  },
  cellNameSelected: {
    color: '#ffffff',
  },
  cellDesc: {
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
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  goalText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
