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
  ImageBackground,
  Dimensions
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const homeImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-AnDcSaUKW7ShR7Y9B2xXazHiCUYg7WLaQs-L-_CK4DGiSL1NoSOXjWKa5S2Q0ofwoQzFqQX2sztCWo1wh_K9x5EwO32388kPOUT4sXXRN1Cr4ARtpEQW3wubLhnTF5Fb_sJ-sSG_awSZYwdp8UPyKbXLrF7ZumBQzPgz_vDeOPQUt5NWU7FVxinN93xleNdruhtSsE1pfDJTyzeQm3OrLztBebwEwbR-_0I-_gZWI1FqqdJJzDoa6HX2YIvrOJHEt72dijCexZQ';
const gymImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Z4dOQ0nq2cEmH0MSKfN1_E-o0gDOaAkDy5yS6UtuokBh2Lmbj3F5g2C9tB_ly7HY6EBWPcdPp32no8Cz9PTsIXeOfPvZIucb7b9gnEzqntQbG9_10ZsrwC6qpneYqnr8j01RTTXBbznjbI2BqqcgkAjnJaP-KPO4dE1IKBpzRhPjAslPH8lxTLF-7g6M5pdyAaVEXVAekduyCrGQkLnDeSAEtF6V-wjAXXuDxLJI_dg1h1ZuUBbEmnK_wH50lc1WT_yJRQUmojY';

export default function LocationSelectionScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedLocation) {
      router.push('/screens/FrequencySelectionScreen');
    }
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
            <Text style={styles.stepText}>ADDIM 2 / STEP 2</Text>
            <Text style={styles.percentText}>50%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '50%' }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Where will you train?</Text>
          <Text style={styles.subTitle}>Choose the environment that fits your routine.</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          
          {/* Home Option */}
          <TouchableOpacity
            onPress={() => setSelectedLocation('home')}
            activeOpacity={0.9}
            style={[
              styles.optionCard,
              selectedLocation === 'home' ? styles.optionSelected : styles.optionUnselected
            ]}
          >
            <ImageBackground
              source={{ uri: homeImageUrl }}
              style={styles.cardBackground}
              imageStyle={{ borderRadius: 12 }}
            >
              <LinearGradient
                colors={['rgba(31, 35, 15, 0.2)', 'rgba(31, 35, 15, 0.9)']}
                style={styles.gradientOverlay}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <Feather name="home" size={24} color="#ccff00" />
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedLocation === 'home' ? styles.checkboxSelected : styles.checkboxUnselected
                  ]}>
                     {selectedLocation === 'home' && <Feather name="check" size={16} color="#1f230f" />}
                  </View>
                </View>
                
                <View>
                  <Text style={styles.cardTitle}>At Home</Text>
                  <Text style={styles.cardSubtitle}>Convenient and private space</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Gym Option */}
          <TouchableOpacity
            onPress={() => setSelectedLocation('gym')}
            activeOpacity={0.9}
            style={[
              styles.optionCard,
              selectedLocation === 'gym' ? styles.optionSelected : styles.optionUnselected
            ]}
          >
            <ImageBackground
              source={{ uri: gymImageUrl }}
              style={styles.cardBackground}
              imageStyle={{ borderRadius: 12 }}
            >
              <LinearGradient
                colors={['rgba(31, 35, 15, 0.2)', 'rgba(31, 35, 15, 0.9)']}
                style={styles.gradientOverlay}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <MaterialIcons name="fitness-center" size={24} color="#ccff00" />
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedLocation === 'gym' ? styles.checkboxSelected : styles.checkboxUnselected
                  ]}>
                    {selectedLocation === 'gym' && <Feather name="check" size={16} color="#1f230f" />}
                  </View>
                </View>
                
                <View>
                  <Text style={styles.cardTitle}>At Gym</Text>
                  <Text style={styles.cardSubtitle}>Full equipment and machines</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

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
          style={[
            styles.nextButton,
            !selectedLocation && styles.nextButtonDisabled
          ]}
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={!selectedLocation}
        >
          <Text style={[
            styles.nextButtonText,
            !selectedLocation && styles.nextButtonTextDisabled
          ]}>Next</Text>
          <MaterialIcons 
            name="arrow-forward" 
            size={24} 
            color={selectedLocation ? "#1f230f" : "#64748b"} 
          />
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
    height: 192,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  optionSelected: {
    borderColor: '#ccff00',
  },
  optionUnselected: {
    borderColor: 'transparent',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  cardContent: {
    padding: 20,
    justifyContent: 'space-between',
    height: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    padding: 8,
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#ccff00',
    borderColor: '#ccff00',
    transform: [{ scale: 1.1 }],
  },
  checkboxUnselected: {
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
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
  nextButtonDisabled: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#1f230f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButtonTextDisabled: {
    color: '#64748b',
  },
});
