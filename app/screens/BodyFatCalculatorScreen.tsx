import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";
const TEXT_WHITE = "#f1f5f9";
const TEXT_MUTED = "#94a3b8";

const BodyFatCalculatorScreen = () => {
  const router = useRouter();
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");

  const handleCalculate = () => {
    // Basic calculation logic could be added here
    // For now, we'll just navigate back to LogWeightScreen
    // In a real app, you would pass the calculated result back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.iconButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={TEXT_WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Body Fat Calculator</Text>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="info-outline" size={24} color={TEXT_WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Gender Toggle */}
        <View style={styles.section}>
          <Text style={styles.labelHighlight}>SELECT GENDER</Text>
          <View style={styles.genderToggleContainer}>
            <TouchableOpacity 
              style={[styles.genderButton, gender === "Male" && styles.genderButtonActive]}
              onPress={() => setGender("Male")}
            >
              <Text style={[styles.genderText, gender === "Male" && styles.genderTextActive]}>MALE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderButton, gender === "Female" && styles.genderButtonActive]}
              onPress={() => setGender("Female")}
            >
              <Text style={[styles.genderText, gender === "Female" && styles.genderTextActive]}>FEMALE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Learning Center Card */}
        <TouchableOpacity 
          style={styles.learningCard}
          onPress={() => router.push('/screens/MeasurementGuideScreen')}
        >
          <View style={styles.learningContent}>
            <View style={styles.infoIconBox}>
              <MaterialIcons name="info" size={24} color={PRIMARY} />
            </View>
            <View>
              <Text style={styles.learningLabel}>LEARNING CENTER</Text>
              <Text style={styles.learningTitle}>About: How to Measure</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color={PRIMARY} />
        </TouchableOpacity>

        {/* Inputs */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>HEIGHT (CM)</Text>
            <TextInput 
              style={styles.input}
              placeholder="180"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>NECK (CM)</Text>
              <TextInput 
                style={styles.input}
                placeholder="40"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="numeric"
                value={neck}
                onChangeText={setNeck}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>WAIST (CM)</Text>
              <TextInput 
                style={styles.input}
                placeholder="85"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="numeric"
                value={waist}
                onChangeText={setWaist}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              HIP (CM) <Text style={styles.optionalLabel}>(Required for Women)</Text>
            </Text>
            <TextInput 
              style={styles.input}
              placeholder="95"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="numeric"
              value={hip}
              onChangeText={setHip}
            />
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity 
          style={styles.calculateButton} 
          activeOpacity={0.9}
          onPress={handleCalculate}
        >
          <MaterialIcons name="calculate" size={24} color="#1f230f" />
          <Text style={styles.calculateButtonText}>CALCULATE RESULTS</Text>
        </TouchableOpacity>

        {/* Results Card */}
        <View style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <View>
              <Text style={styles.resultsLabel}>ESTIMATED BODY FAT</Text>
              <View style={styles.resultsValueContainer}>
                <Text style={styles.resultsValue}>18.4</Text>
                <Text style={styles.resultsUnit}>%</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>FITNESS</Text>
              </View>
              <Text style={styles.categoryLabel}>Category</Text>
            </View>
          </View>

          {/* Gauge Bar */}
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeBackground} />
            <View style={[styles.gaugeFill, { width: '45%' }]} />
          </View>
          
          <View style={styles.gaugeLabels}>
            <Text style={styles.gaugeLabel}>ATHLETE</Text>
            <Text style={[styles.gaugeLabel, { color: PRIMARY }]}>FITNESS</Text>
            <Text style={styles.gaugeLabel}>AVERAGE</Text>
            <Text style={styles.gaugeLabel}>OBESE</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.9}>
          <MaterialIcons name="save" size={20} color={PRIMARY} />
          <Text style={styles.saveButtonText}>Save to Profile</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: 'rgba(31, 35, 15, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204, 255, 0, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_WHITE,
    letterSpacing: -0.5,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  section: {
    marginBottom: 0,
  },
  labelHighlight: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  genderToggleContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.05)',
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  genderButtonActive: {
    backgroundColor: PRIMARY,
  },
  genderText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: TEXT_MUTED,
  },
  genderTextActive: {
    color: '#000000',
  },
  learningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
  },
  learningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconBox: {
    padding: 8,
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    borderRadius: 8,
  },
  learningLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  inputSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  optionalLabel: {
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '500',
    opacity: 0.5,
    textTransform: 'none',
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f230f',
  },
  resultsCard: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    padding: 24,
    gap: 24,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  resultsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  resultsValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  resultsValue: {
    fontSize: 48,
    fontWeight: '900',
    color: PRIMARY,
    lineHeight: 48,
  },
  resultsUnit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  categoryBadge: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1f230f',
  },
  categoryLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  gaugeContainer: {
    height: 16,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#1e293b', // slate-800
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    // Note: React Native doesn't support linear gradient without expo-linear-gradient
    // For simplicity, using a flat color here, but could be enhanced
    backgroundColor: '#3b82f6', 
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gaugeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b', // slate-800
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_WHITE,
  },
});

export default BodyFatCalculatorScreen;