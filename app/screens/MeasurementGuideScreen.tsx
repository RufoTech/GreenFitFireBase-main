import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar, ImageBackground } from 'react-native';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";
const TEXT_WHITE = "#f1f5f9";
const TEXT_MUTED = "#94a3b8";

const MeasurementGuideScreen = () => {
  const router = useRouter();

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
            <MaterialIcons name="close" size={28} color={TEXT_WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Measurement Guide</Text>
          <TouchableOpacity style={styles.helpButton}>
             <MaterialIcons name="help-outline" size={24} color={PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Master Your Technique</Text>
            <Text style={styles.heroDescription}>
                Precision is key for accurate body fat estimation. Use a flexible, non-elastic tension tape measure for consistent results.
            </Text>
        </View>

        {/* Pro Tip Card */}
        <View style={styles.proTipCard}>
            <View style={styles.proTipIconBox}>
                <MaterialIcons name="lightbulb" size={24} color="#1f230f" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.proTipLabel}>PROFESSIONAL ADVICE</Text>
                <Text style={styles.proTipText}>
                    Take measurements twice and average the results. Keep the tape level and snug, but do not compress the skin.
                </Text>
            </View>
        </View>

        {/* Step 1: Neck */}
        <View style={styles.stepSection}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>STEP 01</Text>
                <Text style={styles.stepTitle}>Neck Circumference</Text>
            </View>
            
            <View style={styles.imageContainer}>
                 <ImageBackground
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS91QVxCByuPTLk6l_AMnr1aDO-V7Jm8FAxAXKAFs1VwHy4CTovW3K4i5z23z14RbnMlYaxPWXHSX8jamjrwwHswZTpoIbJU2zgNodK9bRNBWtm4vvEa7D-Q-3jnYir1Z2PwpC9n_kug-ekgbKYFlhDjtWMEydgNDmt3G76y8cEry4Ca1-bsCLjPA7xUz86dhrsKPvGzBo5f2BCvn6ghJp6QQPa6gEhstMZoX0u67mYQonlxWySacZP0jnSnXlZlvz814Nznl9y04' }}
                    style={styles.imageBackground}
                    imageStyle={{ opacity: 0.8 }}
                >
                    <LinearGradient
                        colors={['rgba(31, 35, 15, 0.8)', 'transparent']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientOverlay}
                    />
                </ImageBackground>
            </View>

            <View style={styles.instructionsContainer}>
                <View style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>1</Text>
                    </View>
                    <Text style={styles.instructionText}>Measure below the Adam's apple (larynx) for men, or the narrowest part for women.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>Keep your head straight and look forward. Avoid shrugging your shoulders.</Text>
                </View>
            </View>
        </View>

        {/* Step 2: Waist */}
        <View style={styles.stepSection}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>STEP 02</Text>
                <Text style={styles.stepTitle}>Waist Circumference</Text>
            </View>
            
            <View style={styles.imageContainer}>
                 <ImageBackground
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKmlHL4XHaINbPKWuVwAaxdC1nl1Z1qqKeoK3ivz38m5cf9w4MLXcdwKnBjzpEpEnoAH0DHZguU-U-5kKLSb8Apk2zIOA3x6bUiEg7Z0ivtdqASmXtT-5AmBoIQS7-AJ80KSJgwKnpgFsSjmuukmSxUnaXTxzGGxABQj9V9RTTTrqhsCcwamgcTHm3TJTwAzAxEPzmZrqhOo-1_Vqk0Vwzb4qBJMiLEC6k2uIYPBXzrSnAxDXIRVOd4U0K4QnF0iQQQtuqDk2Qkk' }}
                    style={styles.imageBackground}
                    imageStyle={{ opacity: 0.8 }}
                >
                    <LinearGradient
                        colors={['rgba(31, 35, 15, 0.8)', 'transparent']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientOverlay}
                    />
                </ImageBackground>
            </View>

            <View style={styles.instructionsContainer}>
                <View style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>1</Text>
                    </View>
                    <Text style={styles.instructionText}>Measure at the narrowest point for women, or at the naval (belly button) level for men.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>Exhale naturally before taking the measurement. Do not "suck in" your stomach.</Text>
                </View>
            </View>
        </View>

        {/* Step 3: Hips (Women) */}
        <View style={styles.stepSection}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>STEP 03</Text>
                <Text style={styles.stepTitle}>Hip Circumference</Text>
            </View>
            
            <View style={styles.imageContainer}>
                 <ImageBackground
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM0mzi0phve4t1rVThZ-gaJptO0iM7vQ4zgWtTb-86deg0TkLpXw-p1rVR_17GTxoeAzVM6nw79jJxdjb3ecsBOnZyYwqE-8-UhkHsMhoBNMtA4eHsekbabWTBWVCQnKL9OSDOBMUq-V36O8_L5MXSHpmgFA19zE8o1lGd9HukIXG213SAwbWfJ4tEdJIh502ThUWK_xRhaxSMC6Iauy9QY_8KXhgRzfwUcVxhkqRZB_AS3ssd9bnwbUkQhgwopIRq1oiVSIQWCbE' }}
                    style={styles.imageBackground}
                    imageStyle={{ opacity: 0.8 }}
                >
                    <LinearGradient
                        colors={['rgba(31, 35, 15, 0.8)', 'transparent']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientOverlay}
                    />
                </ImageBackground>
            </View>

            <View style={styles.instructionsContainer}>
                <View style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>1</Text>
                    </View>
                    <Text style={styles.instructionText}>Measure at the widest horizontal point of the buttocks.</Text>
                </View>
                <View style={styles.instructionRow}>
                    <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>Keep the tape level with the floor. This measurement is required for the female body fat formula.</Text>
                </View>
            </View>
        </View>

        {/* Final Call to Action */}
        <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.ctaButton} 
                activeOpacity={0.9}
                onPress={() => router.back()}
            >
                <Text style={styles.ctaButtonText}>Got it, let's calculate</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#1f230f" />
            </TouchableOpacity>
        </View>

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
    textAlign: 'center',
    flex: 1,
  },
  helpButton: {
    padding: 8,
    borderRadius: 20,
    width: 44,
    alignItems: 'flex-end',
  },
  content: {
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    padding: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: TEXT_WHITE,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  heroDescription: {
    fontSize: 16,
    color: TEXT_MUTED,
    marginTop: 8,
    lineHeight: 24,
  },
  proTipCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  proTipIconBox: {
    padding: 8,
    backgroundColor: PRIMARY,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proTipLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  proTipText: {
    fontSize: 14,
    color: TEXT_WHITE,
    marginTop: 4,
    lineHeight: 20,
  },
  stepSection: {
    marginBottom: 40,
  },
  stepHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_WHITE,
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1e293b', // slate-800
    position: 'relative',
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  instructionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepCircleText: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f230f',
  },
});

export default MeasurementGuideScreen;