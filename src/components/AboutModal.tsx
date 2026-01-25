import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

const onboard1 = require('../../assets/onboard-1.png');
const onboard2 = require('../../assets/onboard-2.png');
const onboard3 = require('../../assets/onboard-3.png');

const { width: screenWidth } = Dimensions.get('window');

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const slides = [
  {
    image: onboard1,
    title: 'Focus on What Matters',
    description: 'Q2 Focus helps you prioritize important but non-urgent tasks - the activities that drive long-term success and prevent crises.',
  },
  {
    image: onboard2,
    title: 'The Eisenhower Matrix',
    description: 'Categorize your time into 4 quadrants: Q1 (urgent & important), Q2 (important, not urgent), Q3 (urgent, not important), and Q4 (neither).',
  },
  {
    image: onboard3,
    title: 'Track Your Progress',
    description: 'See your Q2 percentage grow over time. Build streaks, analyze patterns, and make better decisions about where to spend your time.',
  },
];

export function AboutModal({ visible, onClose }: AboutModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{'\u00D7'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About Q2 Focus</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Inspirational Quote */}
            <View style={styles.quoteSection}>
              <Text style={styles.quoteText}>
                "The key is not to prioritize what's on your schedule, but to schedule your priorities."
              </Text>
              <Text style={styles.quoteAuthor}>- Stephen Covey</Text>
            </View>

            {/* Slide Content */}
            <View style={styles.slideContainer}>
              <Image
                source={slides[currentSlide].image}
                style={styles.slideImage}
                resizeMode="contain"
              />
              <Text style={styles.slideTitle}>{slides[currentSlide].title}</Text>
              <Text style={styles.slideDescription}>{slides[currentSlide].description}</Text>
            </View>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentSlide(index)}
                  style={[
                    styles.dot,
                    currentSlide === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navButtons}>
              {currentSlide > 0 ? (
                <TouchableOpacity style={styles.navButtonSecondary} onPress={handlePrev}>
                  <Text style={styles.navButtonSecondaryText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.navButtonPlaceholder} />
              )}
              <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNext}>
                <Text style={styles.navButtonPrimaryText}>
                  {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Key Principles */}
            <View style={styles.principlesSection}>
              <Text style={styles.principlesTitle}>Key Principles</Text>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#ef444420' }]}>
                  <Text style={styles.principleEmoji}>Q1</Text>
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleName}>Do First</Text>
                  <Text style={styles.principleDesc}>Urgent & important - crises, deadlines, emergencies</Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#10b98120' }]}>
                  <Text style={[styles.principleEmoji, { color: '#10B981' }]}>Q2</Text>
                </View>
                <View style={styles.principleContent}>
                  <Text style={[styles.principleName, { color: '#10B981' }]}>Schedule (Goal)</Text>
                  <Text style={styles.principleDesc}>Important, not urgent - planning, growth, relationships</Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#f59e0b20' }]}>
                  <Text style={styles.principleEmoji}>Q3</Text>
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleName}>Delegate</Text>
                  <Text style={styles.principleDesc}>Urgent, not important - interruptions, some meetings</Text>
                </View>
              </View>

              <View style={styles.principleItem}>
                <View style={[styles.principleIcon, { backgroundColor: '#6b728020' }]}>
                  <Text style={styles.principleEmoji}>Q4</Text>
                </View>
                <View style={styles.principleContent}>
                  <Text style={styles.principleName}>Eliminate</Text>
                  <Text style={styles.principleDesc}>Neither urgent nor important - time wasters, busywork</Text>
                </View>
              </View>
            </View>

            {/* Why Q2 Matters */}
            <View style={styles.whySection}>
              <Text style={styles.whyTitle}>Why Focus on Q2?</Text>
              <Text style={styles.whyText}>
                Most people spend their time reacting to Q1 emergencies and Q3 interruptions.
                By intentionally investing more time in Q2 activities, you prevent future crises,
                build capabilities, and create lasting value.
              </Text>
              <Text style={styles.whyText}>
                Aim for 30-40% of your time in Q2. Track it here, see patterns emerge,
                and gradually shift your focus to what truly matters.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#0A0A0F',
    borderRadius: 24,
    width: Math.min(screenWidth - 32, 500),
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#12121A',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#12121A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  closeButtonText: {
    color: '#F1F5F9',
    fontSize: 22,
    lineHeight: 22,
  },
  headerTitle: {
    color: '#F1F5F9',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  quoteSection: {
    backgroundColor: '#12121A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#252542',
  },
  quoteText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
  },
  quoteAuthor: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  slideContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  slideImage: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  slideTitle: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  slideDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A1A2E',
  },
  dotActive: {
    backgroundColor: '#A78BFA',
    width: 24,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  navButtonPlaceholder: {
    flex: 1,
  },
  navButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#12121A',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  navButtonSecondaryText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  navButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#A78BFA',
    alignItems: 'center',
  },
  navButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  principlesSection: {
    marginBottom: 24,
  },
  principlesTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  principleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  principleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  principleEmoji: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  principleContent: {
    flex: 1,
  },
  principleName: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  principleDesc: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },
  whySection: {
    backgroundColor: '#10b98115',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#10B98130',
  },
  whyTitle: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  whyText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});
