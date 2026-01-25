import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Category, Quadrant } from '../types';
import { QuadrantPicker } from './QuadrantPicker';
import { CategoryPicker } from './CategoryPicker';
import { DurationPicker } from './DurationPicker';

interface AddTaskModalProps {
  visible: boolean;
  categories: Category[];
  durationPresets: number[];
  onClose: () => void;
  onAdd: (title: string, quadrant: Quadrant, categoryId: string, duration: number) => void;
}

export function AddTaskModal({
  visible,
  categories,
  durationPresets,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [quadrant, setQuadrant] = useState<Quadrant | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);

  // Set default category when modal opens
  useEffect(() => {
    if (visible && !categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [visible, categoryId, categories]);

  const handleAdd = () => {
    if (!title.trim() || !quadrant || !categoryId) return;
    onAdd(title.trim(), quadrant, categoryId, duration);
    // Reset form
    setTitle('');
    setQuadrant(null);
    // Keep category and duration as defaults
    onClose();
  };

  const canAdd = title.trim() && quadrant && categoryId;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Log Activity</Text>
            <TouchableOpacity
              style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={!canAdd}
            >
              <Text style={[styles.addButtonText, !canAdd && styles.addButtonTextDisabled]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Task Title */}
            <Text style={styles.label}>What did you work on?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Strategic planning session"
              placeholderTextColor="#6b7280"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            {/* Quadrant Picker */}
            <Text style={styles.label}>Which quadrant?</Text>
            <QuadrantPicker selected={quadrant} onSelect={setQuadrant} />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <CategoryPicker
              categories={categories}
              selected={categoryId}
              onSelect={setCategoryId}
            />

            {/* Duration */}
            <Text style={styles.label}>How long?</Text>
            <DurationPicker
              selected={duration}
              onSelect={setDuration}
              presets={durationPresets}
            />

            <View style={styles.spacer} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0A0A0F',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingBottom: 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#12121A',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#12121A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  closeButtonText: {
    color: '#F1F5F9',
    fontSize: 24,
    lineHeight: 24,
  },
  title: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  addButton: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#4C1D95',
    opacity: 0.5,
    shadowOpacity: 0,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  addButtonTextDisabled: {
    opacity: 0.7,
  },
  content: {
    paddingHorizontal: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#12121A',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#F1F5F9',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#252542',
  },
  spacer: {
    height: 44,
  },
});
