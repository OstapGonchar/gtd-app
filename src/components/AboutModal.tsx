import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../ThemeContext';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.surface }]}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>About Q2 Focus</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={true}
          >
            {/* Quote */}
            <View style={[styles.quoteCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.quoteText, { color: theme.colors.text }]}>
                "The key is not to prioritize what's on your schedule, but to schedule your priorities."
              </Text>
              <Text style={[styles.quoteAuthor, { color: theme.colors.textMuted }]}>— Stephen Covey</Text>
            </View>

            {/* What is Q2 Focus */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>What is Q2 Focus?</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Q2 Focus helps you track how you spend your time using the Eisenhower Matrix.
              The goal is to increase time spent on Quadrant 2 — important but not urgent tasks
              that drive long-term success.
            </Text>

            {/* The Matrix */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>The Four Quadrants</Text>

            <View style={[styles.quadrantCard, { backgroundColor: '#ef444415', borderColor: '#ef4444' }]}>
              <Text style={[styles.quadrantLabel, { color: '#ef4444' }]}>Q1 · Do First</Text>
              <Text style={[styles.quadrantDesc, { color: theme.colors.textSecondary }]}>
                Urgent & Important — Crises, deadlines, emergencies that need immediate attention.
              </Text>
            </View>

            <View style={[styles.quadrantCard, { backgroundColor: '#10b98115', borderColor: '#10b981' }]}>
              <View style={styles.quadrantHeader}>
                <Text style={[styles.quadrantLabel, { color: '#10b981' }]}>Q2 · Schedule</Text>
                <View style={[styles.goalBadge, { backgroundColor: '#10b981' }]}>
                  <Text style={styles.goalBadgeText}>YOUR GOAL</Text>
                </View>
              </View>
              <Text style={[styles.quadrantDesc, { color: theme.colors.textSecondary }]}>
                Important, Not Urgent — Planning, learning, relationships, prevention. This is where growth happens.
              </Text>
            </View>

            <View style={[styles.quadrantCard, { backgroundColor: '#f59e0b15', borderColor: '#f59e0b' }]}>
              <Text style={[styles.quadrantLabel, { color: '#f59e0b' }]}>Q3 · Delegate</Text>
              <Text style={[styles.quadrantDesc, { color: theme.colors.textSecondary }]}>
                Urgent, Not Important — Interruptions, some meetings, others' priorities disguised as urgent.
              </Text>
            </View>

            <View style={[styles.quadrantCard, { backgroundColor: '#6b728015', borderColor: '#6b7280' }]}>
              <Text style={[styles.quadrantLabel, { color: '#6b7280' }]}>Q4 · Eliminate</Text>
              <Text style={[styles.quadrantDesc, { color: theme.colors.textSecondary }]}>
                Neither Urgent nor Important — Time wasters, busy work, excessive social media.
              </Text>
            </View>

            {/* Why Q2 */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Why Focus on Q2?</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Most people are stuck reacting to Q1 emergencies and Q3 interruptions.
              By intentionally investing in Q2, you prevent future crises and build lasting value.
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Aim for 30-40% of your time in Q2. Use this app to plan tasks, track completion,
              and watch your focus improve over time.
            </Text>

            {/* Tips */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tips</Text>
            <View style={[styles.tipCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                ✓ Plan Q2 tasks at the start of each day{'\n'}
                ✓ Mark tasks complete as you finish them{'\n'}
                ✓ Review your calendar to spot patterns{'\n'}
                ✓ Celebrate completed Q2 tasks!
              </Text>
            </View>

            {/* Get Started Button */}
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
              onPress={onClose}
            >
              <Text style={styles.startButtonText}>Get Started</Text>
            </TouchableOpacity>

            <Text style={[styles.version, { color: theme.colors.textMuted }]}>
              Q2 Focus v1.0
            </Text>
          </ScrollView>
        </View>
      </View>
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
    minHeight: '70%',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
  },
  quoteCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  quadrantCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  quadrantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quadrantLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  quadrantDesc: {
    fontSize: 14,
    lineHeight: 21,
  },
  goalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  goalBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tipCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 26,
  },
  startButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 8,
  },
});
