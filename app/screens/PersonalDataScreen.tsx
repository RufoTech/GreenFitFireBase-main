import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Line, Polyline } from 'react-native-svg';

/**
 * Note: In this environment, we use inline SVG and Lucide-style icons 
 * to avoid dependency resolution errors with @expo/vector-icons.
 */

// --- Icons ---
const ArrowBackIcon = ({ color = "#f1f5f9" }) => (
  <View style={{ width: 24, height: 24 }}>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Polyline points="12 19 5 12 12 5" />
    </Svg>
  </View>
);

const ArrowForwardIcon = ({ color = "#1f230f" }) => (
  <View style={{ width: 24, height: 24 }}>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </Svg>
  </View>
);

const MaleIcon = ({ color }: { color: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="10" cy="14" r="5" />
      <Path d="M14 10l5-5" />
      <Path d="M19 5h-4" />
      <Path d="M19 5v4" />
    </Svg>
  </View>
);

const FemaleIcon = ({ color }: { color: string }) => (
  <View style={{ width: 20, height: 20 }}>
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="10" r="5" />
      <Path d="M12 15v7" />
      <Path d="M9 19h6" />
    </Svg>
  </View>
);

import Slider from '@react-native-community/slider';

export default function PersonalDataScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  // Check navigation state to determine if we should show the back button
  // If we came from LevelSelection (onboarding), we hide it.
  // If we came from Profile, we show it.
  const [showBack, setShowBack] = useState(true);

  useEffect(() => {
    // We need to wait for navigation state to be available
    const unsubscribe = navigation.addListener('focus', () => {
      const state = navigation.getState();
      const routes = state?.routes || [];
      if (routes.length > 1) {
        const prevRoute = routes[routes.length - 2];
        // If previous route contains 'LevelSelection', it's the onboarding flow -> hide back button
        if (prevRoute?.name?.includes('LevelSelection')) {
          setShowBack(false);
        } else {
          setShowBack(true);
        }
      } else {
        // No history, hide back button (e.g. deep link or replace)
        setShowBack(false);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(24);
  const [height, setHeight] = useState('180');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weight, setWeight] = useState('75');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const user = auth().currentUser;

  // Fetch existing user data
  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            if (data) {
              if (data.gender) setGender(data.gender);
              if (data.age) setAge(data.age);
              if (data.height) setHeight(data.height.toString());
              if (data.heightUnit) setHeightUnit(data.heightUnit);
              if (data.weight) setWeight(data.weight.toString());
              if (data.weightUnit) setWeightUnit(data.weightUnit);
            }
          }
          setFetching(false);
        }, (error) => {
           console.error("Error fetching user data: ", error);
           setFetching(false);
        });

      return () => unsubscribe();
    } else {
        setFetching(false);
    }
  }, [user]);

  const handleNext = async () => {
    if (!user) {
        // Alert.alert("Error", "No user logged in");
        // For now proceed for testing if needed or return
        return;
    }

    setLoading(true);
    try {
        await firestore().collection('users').doc(user.uid).set({
            gender,
            age,
            height: parseFloat(height) || 0,
            heightUnit,
            weight: parseFloat(weight) || 0,
            weightUnit,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        // Navigate to Dashboard or go back if editing
        // If we are in onboarding flow (showBack is false), we MUST go to dashboard (tabs)
        // If we are editing profile (showBack is true), we go back.
        if (showBack && router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    } catch (error) {
        console.error(error);
        // Alert.alert("Error", "Failed to save data. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ccff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, !showBack && { justifyContent: 'center' }]}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowBackIcon />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Tell us about yourself</Text>
        {showBack && <View style={{ width: 40 }} />}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.description}>
          This information helps us calculate your BMI and daily calorie needs.
        </Text>

        {/* Gender Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENDER</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              onPress={() => setGender('male')}
              style={[
                styles.genderButton,
                gender === 'male' ? styles.genderButtonSelected : styles.genderButtonUnselected
              ]}
            >
              <MaleIcon color={gender === 'male' ? '#1f230f' : '#cbd5e1'} />
              <Text style={[
                styles.genderText,
                gender === 'male' ? styles.textSelected : styles.textUnselected
              ]}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender('female')}
              style={[
                styles.genderButton,
                gender === 'female' ? styles.genderButtonSelected : styles.genderButtonUnselected
              ]}
            >
              <FemaleIcon color={gender === 'female' ? '#1f230f' : '#cbd5e1'} />
              <Text style={[
                styles.genderText,
                gender === 'female' ? styles.textSelected : styles.textUnselected
              ]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Age Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AGE</Text>
            <Text style={styles.valueText}>
              {age} <Text style={styles.unitText}>years</Text>
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={10}
              maximumValue={100}
              step={1}
              value={age}
              onValueChange={setAge}
              minimumTrackTintColor="#ccff00"
              maximumTrackTintColor="rgba(204, 255, 0, 0.1)"
              thumbTintColor="#ccff00"
            />
          </View>
        </View>

        {/* Height Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HEIGHT</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setHeightUnit('cm')}
                style={[styles.toggleButton, heightUnit === 'cm' && styles.toggleButtonSelected]}
              >
                <Text style={[styles.toggleText, heightUnit === 'cm' && styles.toggleTextSelected]}>cm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setHeightUnit('ft')}
                style={[styles.toggleButton, heightUnit === 'ft' && styles.toggleButtonSelected]}
              >
                <Text style={[styles.toggleText, heightUnit === 'ft' && styles.toggleTextSelected]}>ft</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder={heightUnit === 'cm' ? "180" : "5.9"}
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
          />
        </View>

        {/* Weight Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>WEIGHT</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                onPress={() => setWeightUnit('kg')}
                style={[styles.toggleButton, weightUnit === 'kg' && styles.toggleButtonSelected]}
              >
                <Text style={[styles.toggleText, weightUnit === 'kg' && styles.toggleTextSelected]}>kg</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWeightUnit('lb')}
                style={[styles.toggleButton, weightUnit === 'lb' && styles.toggleButtonSelected]}
              >
                <Text style={[styles.toggleText, weightUnit === 'lb' && styles.toggleTextSelected]}>lb</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder={weightUnit === 'kg' ? "75" : "165"}
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer - Fixed Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator size="small" color="#1f230f" />
          ) : (
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
               <Text style={styles.nextButtonText}>Save</Text>
               <ArrowForwardIcon />
             </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f230f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  description: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  genderButtonSelected: {
    backgroundColor: '#ccff00',
    borderColor: '#ccff00',
  },
  genderButtonUnselected: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textSelected: {
    color: '#1f230f',
  },
  textUnselected: {
    color: '#cbd5e1',
  },
  valueText: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: 'bold',
  },
  unitText: {
    color: '#64748b',
    fontSize: 14,
  },
  sliderContainer: {
    height: 50,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#ccff00',
    borderRadius: 3,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#ccff00',
    borderRadius: 12,
    position: 'absolute',
    top: -9,
    marginLeft: -12,
    borderWidth: 4,
    borderColor: '#1f230f',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleButtonSelected: {
    backgroundColor: '#ccff00',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  toggleTextSelected: {
    color: '#1f230f',
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  nextButton: {
    backgroundColor: '#ccff00',
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#ccff00",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextButtonText: {
    color: '#1f230f',
    fontSize: 18,
    fontWeight: '800',
  },
});