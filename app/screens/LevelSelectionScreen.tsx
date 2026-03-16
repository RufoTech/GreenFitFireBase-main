import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LevelSelectionScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      subtitle: 'New to the gym',
      icon: 'activity', // Feather
      iconLib: Feather,
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      subtitle: '1-2 years experience',
      icon: 'dumbbell', // MaterialCommunityIcons
      iconLib: MaterialCommunityIcons,
    },
    {
      id: 'pro',
      title: 'Pro',
      subtitle: '3-5 years experience',
      icon: 'trending-up', // Feather
      iconLib: Feather,
    },
    {
      id: 'elite',
      title: 'Elite',
      subtitle: 'Professional athlete',
      icon: 'trophy', // AntDesign
      iconLib: AntDesign,
    },
  ];

  const handleFinish = () => {
    // Navigate to Personal Data Screen
    router.push({ pathname: '/screens/PersonalDataScreen', params: { hideBackButton: 'true' } });
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
        <Text style={styles.headerTitle}>Onboarding</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.stepText}>Almost there!</Text>
            <Text style={styles.percentText}>Step 4/4</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>What is your level?</Text>
          <Text style={styles.subTitle}>Select the option that best describes your gym experience.</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {levels.map((level) => {
            const isSelected = selectedLevel === level.id;
            const IconLib = level.iconLib;
            
            return (
              <TouchableOpacity
                key={level.id}
                onPress={() => setSelectedLevel(level.id)}
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionSelected : styles.optionUnselected
                ]}
              >
                {/* Icon */}
                <View style={[
                  styles.iconContainer,
                  isSelected ? styles.iconSelected : styles.iconUnselected
                ]}>
                  {/* @ts-ignore */}
                  <IconLib name={level.icon} size={24} color="#ccff00" />
                </View>

                {/* Text */}
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{level.title}</Text>
                  <Text style={styles.optionSubtitle}>{level.subtitle}</Text>
                </View>

                {/* Checkmark */}
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Feather name="check" size={16} color="#1f230f" />
                  </View>
                )}
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
          style={styles.finishButton}
          activeOpacity={0.8}
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Finish</Text>
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
    fontSize: 16,
    fontWeight: '500',
  },
  percentText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '400',
  },
  progressBarBg: {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    fontSize: 32,
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
    borderRadius: 12,
    borderWidth: 2,
    gap: 16,
  },
  optionSelected: {
    borderColor: '#ccff00',
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
  },
  optionUnselected: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSelected: {
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
  },
  iconUnselected: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccff00',
    justifyContent: 'center',
    alignItems: 'center',
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
  finishButton: {
    backgroundColor: '#ccff00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  finishButtonText: {
    color: '#1f230f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
