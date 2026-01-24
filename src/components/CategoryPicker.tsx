import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Category } from '../types';

interface CategoryPickerProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
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
              { borderColor: category.color },
              isSelected && { backgroundColor: category.color },
            ]}
            onPress={() => onSelect(category.id)}
          >
            {category.icon && <Text style={styles.icon}>{category.icon}</Text>}
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
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
    gap: 8,
    paddingRight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
