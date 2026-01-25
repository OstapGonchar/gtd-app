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
    backgroundColor: '#12121A',
    borderWidth: 2,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#ffffff',
  },
});
