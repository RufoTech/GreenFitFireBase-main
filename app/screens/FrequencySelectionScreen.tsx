import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FrequencySelectionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('3days');

  const options = [
    {
      id: '2days',
      title: '2 days',
      desc: 'Ideal for maintenance and busy schedules',
    },
    {
      id: '3days',
      title: '3 days',
      desc: 'The sweet spot for visible muscle growth',
      badge: 'Popular',
    },
    {
      id: '4days',
      title: '4 days',
      desc: 'Serious commitment for faster results',
    },
    {
      id: '5days',
      title: '5+ days',
      desc: 'Elite athlete level performance training',
    },
  ];

  const handleNext = () => {
    router.push('/screens/LevelSelectionScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addis Fitness</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.stepText}>ADDIM 3 / STEP 3</Text>
            <Text style={styles.percentText}>75%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>How many days a week?</Text>
          <Text style={styles.subTitle}>Select your commitment level to help us build your perfect routine.</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSelected(opt.id)}
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionSelected : styles.optionUnselected
                ]}
              >
                {/* Radio Button */}
                <View style={[
                  styles.radioButton,
                  isSelected ? styles.radioSelected : styles.radioUnselected
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                {/* Content */}
                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionTitle}>{opt.title}</Text>
                    {opt.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{opt.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Footer */}
      <LinearGradient
        colors={['transparent', '#1f230f', '#1f230f']}
        locations={[0, 0.3, 1]}
        style={styles.footer}
      >
        <TouchableOpacity 
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Növbəti / Next</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#1f230f" />
        </TouchableOpacity>
      </LinearGradient>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f230f',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 16,
  },
  progressContainer: {
    marginVertical: 16,
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stepText: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '500',
  },
  percentText: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ccff00',
    borderRadius: 4,
  },
  titleContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  mainTitle: {
    color: '#f1f5f9',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  optionSelected: {
    borderColor: '#ccff00',
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
  },
  optionUnselected: {
    borderColor: 'rgba(51, 65, 85, 0.5)',
    backgroundColor: 'transparent',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#ccff00',
  },
  radioUnselected: {
    borderColor: '#94a3b8',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccff00',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  optionTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#ccff00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#1f230f',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionDesc: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 48,
  },
  nextButton: {
    backgroundColor: '#ccff00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#1f230f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
