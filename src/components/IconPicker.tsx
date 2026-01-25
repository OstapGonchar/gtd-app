import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CATEGORY_ICONS = [
  // Work
  '\uD83C\uDFAF', '\uD83D\uDCBC', '\uD83D\uDCCA', '\uD83D\uDCC8', '\uD83D\uDD27', '\uD83D\uDCBB', '\uD83D\uDCDD', '\uD83D\uDCCB',
  // People
  '\uD83D\uDC65', '\uD83E\uDD1D', '\uD83D\uDC64', '\uD83D\uDCAC', '\uD83D\uDCDE', '\uD83D\uDCE7', '\uD83D\uDDE3\uFE0F', '\uD83D\uDC4B',
  // Time/Planning
  '\uD83D\uDCC5', '\uD83D\uDDFA\uFE0F', '\u23F0', '\uD83D\uDCCC', '\uD83C\uDFAA', '\uD83C\uDFC1', '\uD83D\uDD14', '\u26A1',
  // Learning
  '\uD83D\uDCDA', '\uD83C\uDF93', '\uD83D\uDCA1', '\uD83E\uDDE0', '\u270F\uFE0F', '\uD83D\uDD2C', '\uD83C\uDFA8', '\uD83C\uDFB5',
  // Status
  '\uD83D\uDD25', '\u2B50', '\u2705', '\uD83D\uDE80', '\uD83D\uDCAA', '\uD83C\uDFC6', '\uD83D\uDC8E', '\uD83C\uDF1F',
  // Health/Life
  '\uD83C\uDFC3', '\uD83E\uDDD8', '\uD83D\uDCA4', '\uD83C\uDF4E', '\u2615', '\uD83C\uDFE0', '\uD83C\uDF3F', '\u2764\uFE0F',
];

interface IconPickerProps {
  selected: string | null;
  onSelect: (icon: string) => void;
}

export function IconPicker({ selected, onSelect }: IconPickerProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORY_ICONS.map((icon, index) => {
          const isSelected = selected === icon;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.iconButton, isSelected && styles.iconButtonSelected]}
              onPress={() => onSelect(icon)}
            >
              <Text style={styles.icon}>{icon}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function IconPickerGrid({ selected, onSelect }: IconPickerProps) {
  return (
    <View style={styles.gridContainer}>
      {CATEGORY_ICONS.map((icon, index) => {
        const isSelected = selected === icon;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.gridIconButton, isSelected && styles.iconButtonSelected]}
            onPress={() => onSelect(icon)}
          >
            <Text style={styles.gridIcon}>{icon}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#12121A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252542',
  },
  iconButtonSelected: {
    backgroundColor: '#A78BFA',
    borderColor: '#A78BFA',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  gridIconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#12121A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252542',
  },
  gridIcon: {
    fontSize: 22,
  },
});
