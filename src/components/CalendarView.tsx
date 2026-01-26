import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DaySummary, StreakInfo } from '../types';
import { formatDuration, getTodayDate } from '../database';
import { CalendarDayCell } from './CalendarDayCell';
import { useTheme } from '../ThemeContext';

interface CalendarViewProps {
  monthSummaries: Map<string, DaySummary>;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayPress: (date: string) => void;
  streak: StreakInfo;
  selectedDate: string | null;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView({
  monthSummaries,
  currentMonth,
  onMonthChange,
  onDayPress,
  streak,
  selectedDate,
}: CalendarViewProps) {
  const { theme } = useTheme();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = getTodayDate();

  // Calculate month stats
  const monthStats = calculateMonthStats(monthSummaries);

  // Generate calendar grid
  const calendarDays = generateCalendarDays(year, month);

  const goToPrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    onMonthChange(newDate);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]} onPress={goToPrevMonth}>
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={[styles.monthTitle, { color: theme.colors.text }]}>{monthName}</Text>
        <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]} onPress={goToNextMonth}>
          <Text style={[styles.navButtonText, { color: theme.colors.text }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Month Stats */}
      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.q2 }]}>
              {monthStats.q2Percentage}% <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Q2</Text>
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.q2 }]}>
              {formatDuration(monthStats.totalMinutes)} <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>total</Text>
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.q2 }]}>
              {monthStats.activeDays} <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>active days</Text>
            </Text>
          </View>
          {streak.currentStreak > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.q2 }]}>
                {streak.currentStreak} <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>day streak</Text>
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: theme.colors.textMuted }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((dayInfo, dayIndex) => {
              const dateStr = dayInfo.date;
              const summary = dateStr ? monthSummaries.get(dateStr) : null;

              return (
                <CalendarDayCell
                  key={dayIndex}
                  day={dayInfo.day}
                  date={dateStr}
                  q2Percentage={summary?.q2Percentage ?? null}
                  totalMinutes={summary?.totalMinutes ?? 0}
                  isToday={dateStr === today}
                  isSelected={dateStr === selectedDate}
                  completion={summary?.completion}
                  onPress={onDayPress}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

interface DayInfo {
  day: number | null;
  date: string | null;
}

function generateCalendarDays(year: number, month: number): DayInfo[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks: DayInfo[][] = [];
  let currentWeek: DayInfo[] = [];

  // Fill in empty cells before first day
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({ day: null, date: null });
  }

  // Fill in days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    currentWeek.push({ day, date: dateStr });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill in empty cells after last day
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({ day: null, date: null });
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function calculateMonthStats(summaries: Map<string, DaySummary>) {
  let totalMinutes = 0;
  let totalQ2Minutes = 0;
  let activeDays = 0;

  for (const summary of summaries.values()) {
    totalMinutes += summary.totalMinutes;
    totalQ2Minutes += summary.quadrantMinutes.q2;
    if (summary.totalMinutes > 0) {
      activeDays++;
    }
  }

  const q2Percentage = totalMinutes > 0
    ? Math.round((totalQ2Minutes / totalMinutes) * 100)
    : 0;

  return { totalMinutes, q2Percentage, activeDays };
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statsContainer: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  calendarGrid: {
    gap: 3,
  },
  weekRow: {
    flexDirection: 'row',
  },
});
