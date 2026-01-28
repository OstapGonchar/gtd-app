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
import { Category, Quadrant, TaskEntry } from '../types';
import { QuadrantPicker } from './QuadrantPicker';
import { CategoryPicker } from './CategoryPicker';
import { DurationPicker } from './DurationPicker';
import { DatePickerModal } from './DatePickerModal';
import { useTheme } from '../ThemeContext';

interface AddTaskModalProps {
  visible: boolean;
  categories: Category[];
  durationPresets: number[];
  onClose: () => void;
  onAdd: (title: string, quadrant: Quadrant, categoryId: string, duration: number) => void;
  editingTask?: TaskEntry | null;
  onUpdate?: (taskId: string, title: string, quadrant: Quadrant, categoryId: string, duration: number) => void;
  onMoveToDay?: (taskId: string, newDate: string) => void;
}

export function AddTaskModal({
  visible,
  categories,
  durationPresets,
  onClose,
  onAdd,
  editingTask,
  onUpdate,
  onMoveToDay,
}: AddTaskModalProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [quadrant, setQuadrant] = useState<Quadrant | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isEditing = !!editingTask;

  // Set form values when editing or set defaults when adding
  useEffect(() => {
    if (visible) {
      if (editingTask) {
        setTitle(editingTask.title);
        setQuadrant(editingTask.quadrant);
        setCategoryId(editingTask.categoryId);
        setDuration(editingTask.duration);
      } else {
        // Reset for new task
        setTitle('');
        setQuadrant(null);
        if (categories.length > 0 && !categoryId) {
          setCategoryId(categories[0].id);
        }
        setDuration(30);
      }
    }
  }, [visible, editingTask, categories]);

  const handleSubmit = () => {
    if (!title.trim() || !quadrant || !categoryId) return;

    if (isEditing && onUpdate && editingTask) {
      onUpdate(editingTask.id, title.trim(), quadrant, categoryId, duration);
    } else {
      onAdd(title.trim(), quadrant, categoryId, duration);
    }
    // Reset form
    setTitle('');
    setQuadrant(null);
    // Keep category and duration as defaults
    onClose();
  };

  const canSubmit = title.trim() && quadrant && categoryId;

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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>{isEditing ? 'Edit Activity' : 'Log Activity'}</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }, !canSubmit && styles.addButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={[styles.addButtonText, !canSubmit && styles.addButtonTextDisabled]}>
                {isEditing ? 'Save' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Task Title */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>What did you work on?</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="e.g., Strategic planning session"
              placeholderTextColor={theme.colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            {/* Quadrant Picker */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Which quadrant?</Text>
            <QuadrantPicker selected={quadrant} onSelect={setQuadrant} />

            {/* Category */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Category</Text>
            <CategoryPicker
              categories={categories}
              selected={categoryId}
              onSelect={setCategoryId}
            />

            {/* Duration */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>How long?</Text>
            <DurationPicker
              selected={duration}
              onSelect={setDuration}
              presets={durationPresets}
            />

            {/* Move to another day - only when editing */}
            {isEditing && editingTask && onMoveToDay && (
              <View>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Move to another day</Text>
                <TouchableOpacity
                  style={[styles.moveDateButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.moveDateButtonText, { color: theme.colors.primary }]}>Select Date</Text>
                </TouchableOpacity>
                <DatePickerModal
                  visible={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  onSelect={(dateStr) => {
                    onMoveToDay(editingTask.id, dateStr);
                    setShowDatePicker(false);
                    onClose();
                  }}
                />
              </View>
            )}

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
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 24,
    lineHeight: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  addButton: {
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
    fontSize: 13,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  moveDateButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  moveDateButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  spacer: {
    height: 44,
  },
});
