import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QUADRANT_INFO } from '../types';

interface EisenhowerMatrixProps {
  compact?: boolean;
}

export function EisenhowerMatrix({ compact = false }: EisenhowerMatrixProps) {
  if (compact) {
    return <CompactMatrix />;
  }

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.cornerCell} />
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>URGENT</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>NOT URGENT</Text>
        </View>
      </View>

      {/* Important Row */}
      <View style={styles.matrixRow}>
        <View style={styles.sideHeader}>
          <Text style={styles.sideHeaderText}>IMPORTANT</Text>
        </View>
        <View style={[styles.quadrantCell, { backgroundColor: QUADRANT_INFO[1].color + '20', borderColor: QUADRANT_INFO[1].color }]}>
          <Text style={[styles.quadrantLabel, { color: QUADRANT_INFO[1].color }]}>Q1</Text>
          <Text style={styles.quadrantName}>Do First</Text>
          <Text style={styles.quadrantDesc}>Crises, deadlines</Text>
        </View>
        <View style={[styles.quadrantCell, styles.q2Cell, { backgroundColor: QUADRANT_INFO[2].color + '20', borderColor: QUADRANT_INFO[2].color }]}>
          <Text style={[styles.quadrantLabel, { color: QUADRANT_INFO[2].color }]}>Q2</Text>
          <Text style={[styles.quadrantName, { color: QUADRANT_INFO[2].color }]}>Schedule</Text>
          <Text style={styles.quadrantDesc}>Growth, strategy</Text>
          <View style={styles.starBadge}>
            <Text style={styles.starText}>GOAL</Text>
          </View>
        </View>
      </View>

      {/* Not Important Row */}
      <View style={styles.matrixRow}>
        <View style={styles.sideHeader}>
          <Text style={styles.sideHeaderText}>NOT{'\n'}IMPORTANT</Text>
        </View>
        <View style={[styles.quadrantCell, { backgroundColor: QUADRANT_INFO[3].color + '20', borderColor: QUADRANT_INFO[3].color }]}>
          <Text style={[styles.quadrantLabel, { color: QUADRANT_INFO[3].color }]}>Q3</Text>
          <Text style={styles.quadrantName}>Delegate</Text>
          <Text style={styles.quadrantDesc}>Interruptions</Text>
        </View>
        <View style={[styles.quadrantCell, { backgroundColor: QUADRANT_INFO[4].color + '20', borderColor: QUADRANT_INFO[4].color }]}>
          <Text style={[styles.quadrantLabel, { color: QUADRANT_INFO[4].color }]}>Q4</Text>
          <Text style={styles.quadrantName}>Eliminate</Text>
          <Text style={styles.quadrantDesc}>Time wasters</Text>
        </View>
      </View>
    </View>
  );
}

function CompactMatrix() {
  return (
    <View style={compactStyles.container}>
      <View style={compactStyles.row}>
        <View style={[compactStyles.cell, { backgroundColor: QUADRANT_INFO[1].color + '30' }]}>
          <Text style={[compactStyles.label, { color: QUADRANT_INFO[1].color }]}>Q1</Text>
          <Text style={compactStyles.action}>Do</Text>
        </View>
        <View style={[compactStyles.cell, compactStyles.q2Cell, { backgroundColor: QUADRANT_INFO[2].color + '30' }]}>
          <Text style={[compactStyles.label, { color: QUADRANT_INFO[2].color }]}>Q2</Text>
          <Text style={[compactStyles.action, { color: QUADRANT_INFO[2].color }]}>Plan</Text>
        </View>
      </View>
      <View style={compactStyles.row}>
        <View style={[compactStyles.cell, { backgroundColor: QUADRANT_INFO[3].color + '30' }]}>
          <Text style={[compactStyles.label, { color: QUADRANT_INFO[3].color }]}>Q3</Text>
          <Text style={compactStyles.action}>Delegate</Text>
        </View>
        <View style={[compactStyles.cell, { backgroundColor: QUADRANT_INFO[4].color + '30' }]}>
          <Text style={[compactStyles.label, { color: QUADRANT_INFO[4].color }]}>Q4</Text>
          <Text style={compactStyles.action}>Skip</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12121A',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cornerCell: {
    width: 64,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  matrixRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sideHeader: {
    width: 64,
    justifyContent: 'center',
    paddingRight: 10,
  },
  sideHeaderText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  quadrantCell: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 5,
    minHeight: 85,
  },
  q2Cell: {
    borderWidth: 2,
  },
  quadrantLabel: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  quadrantName: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
  },
  quadrantDesc: {
    color: '#94A3B8',
    fontSize: 11,
  },
  starBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  starText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

const compactStyles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  q2Cell: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
  },
  action: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
});
