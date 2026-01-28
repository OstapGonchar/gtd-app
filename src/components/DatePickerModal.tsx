import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../ThemeContext';

interface DatePickerModalProps {
  visible: boolean;
  onSelect: (dateStr: string) => void;
  onClose: () => void;
}

export function DatePickerModal({ visible, onSelect, onClose }: DatePickerModalProps) {
  const { theme } = useTheme();
  const today = new Date();
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleMove = () => {
    if (selectedDate) {
      onSelect(selectedDate);
    }
  };

  const goToPrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonth(pickerMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonth(pickerMonth + 1);
    }
  };

  const renderDayGrid = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const firstDay = new Date(pickerYear, pickerMonth, 1).getDay();
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const rows: React.ReactNode[] = [];
    let cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(pickerYear, pickerMonth, day);
      cellDate.setHours(0, 0, 0, 0);
      const dateStr = `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = cellDate < todayStart;
      const isSelected = selectedDate === dateStr;

      cells.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarCell,
            isSelected && { backgroundColor: theme.colors.primary, borderRadius: 20 },
          ]}
          onPress={() => !isPast && setSelectedDate(dateStr)}
          disabled={isPast}
        >
          <Text style={[
            styles.calendarDayText,
            { color: theme.colors.text },
            isPast && { color: theme.colors.textMuted, opacity: 0.4 },
            isSelected && { color: '#ffffff', fontWeight: '700' },
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );

      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        rows.push(
          <View key={`row-${day}`} style={styles.calendarWeekRow}>{cells}</View>
        );
        cells = [];
      }
    }
    return rows;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          {/* Month navigation */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goToPrevMonth} style={styles.calendarNavBtn}>
              <Text style={[styles.calendarNavText, { color: theme.colors.text }]}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={[styles.calendarMonthLabel, { color: theme.colors.text }]}>
              {new Date(pickerYear, pickerMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavBtn}>
              <Text style={[styles.calendarNavText, { color: theme.colors.text }]}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          {/* Day-of-week headers */}
          <View style={styles.calendarWeekRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <Text key={d} style={[styles.calendarWeekDay, { color: theme.colors.textMuted }]}>{d}</Text>
            ))}
          </View>

          {/* Day grid */}
          {renderDayGrid()}

          {/* Actions */}
          <View style={styles.calendarActions}>
            <TouchableOpacity
              style={[styles.calendarCancelBtn, { borderColor: theme.colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.calendarCancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.calendarConfirmBtn,
                { backgroundColor: theme.colors.primary },
                !selectedDate && { opacity: 0.4 },
              ]}
              onPress={handleMove}
              disabled={!selectedDate}
            >
              <Text style={styles.calendarConfirmText}>Move</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarNavBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarNavText: {
    fontSize: 20,
    fontWeight: '600',
  },
  calendarMonthLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  calendarWeekRow: {
    flexDirection: 'row',
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 6,
  },
  calendarCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 40,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  calendarActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  calendarCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  calendarCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarConfirmText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
