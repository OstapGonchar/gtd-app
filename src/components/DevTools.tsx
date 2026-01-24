import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { clearAllData, seedDemoData, initDB } from '../database';

interface DevToolsProps {
  onDataReset: () => void;
}

export function DevTools({ onDataReset }: DevToolsProps) {
  // Only render in development mode
  if (!__DEV__) {
    return null;
  }

  const handleLoadDemo = async () => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm('This will replace all data with 2 months of demo history. Continue?')
      : true;

    if (confirmed) {
      await clearAllData();
      await initDB(); // Re-seed categories
      await seedDemoData(true);
      onDataReset();
    }
  };

  const handleClearAll = async () => {
    const confirmed = Platform.OS === 'web'
      ? window.confirm('This will delete ALL data permanently. Continue?')
      : true;

    if (confirmed) {
      await clearAllData();
      await initDB(); // Re-seed categories
      onDataReset();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>DEV</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLoadDemo}>
        <Text style={styles.buttonText}>Load Demo Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearAll}>
        <Text style={[styles.buttonText, styles.dangerText]}>Clear All Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    backgroundColor: '#0a0a12',
  },
  badge: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#252542',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  buttonText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  dangerButton: {
    borderColor: '#7f1d1d',
  },
  dangerText: {
    color: '#ef4444',
  },
});
