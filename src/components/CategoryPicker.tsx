import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Category } from '../types';
import { useTheme } from '../ThemeContext';

interface CategoryPickerProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selected === category.id;

        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.button,
              { backgroundColor: theme.colors.surface, borderColor: category.color },
              isSelected && { backgroundColor: category.color },
            ]}
            onPress={() => onSelect(category.id)}
          >
            {category.icon && <Text style={styles.icon}>{category.icon}</Text>}
            <Text style={[styles.label, { color: theme.colors.text }, isSelected && styles.labelSelected]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
