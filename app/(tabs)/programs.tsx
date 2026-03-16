import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProgramsScreen() {
  const router = useRouter();

  const recommendedPrograms = [
    {
      id: 1,
      title: "Power Lifting 101",
      level: "Advanced",
      duration: "8 Weeks",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      title: "Morning Mobility",
      level: "Beginner",
      duration: "4 Weeks",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      title: "HIIT Burn",
      level: "Intermediate",
      duration: "6 Weeks",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Programs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Active Program Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR PROGRAM</Text>
          
          <TouchableOpacity 
            style={styles.activeProgramCard}
            activeOpacity={0.9}
            onPress={() => router.push('/screens/CreateProgramScreen')}
          >
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800' }}
              style={styles.activeImageBackground}
              imageStyle={{ borderRadius: 24 }}
            >
              <LinearGradient
                colors={['rgba(31, 35, 15, 0.3)', 'rgba(31, 35, 15, 0.9)']}
                style={styles.activeGradient}
              >
                <View style={styles.activeContent}>
                  <View style={styles.activeHeader}>
                    <View style={styles.activeTitleContainer}>
                      <Text style={styles.activeTitle}>Create Your Plan</Text>
                      <Text style={styles.activeSubtitle}>Start your journey today</Text>
                    </View>
                    <TouchableOpacity style={styles.continueButton}>
                      <MaterialIcons name="add" size={20} color="#1f230f" />
                      <Text style={styles.continueButtonText}>Create</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>PROGRESS</Text>
                      <Text style={styles.progressValue}>0%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '0%' }]} />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Create Custom Program Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CREATE CUSTOM</Text>
          <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/screens/CreateCustomWorkoutScreen')}
          >
            <View style={styles.quickActionIcon}>
              <Feather name="edit" size={32} color="#ccff00" />
            </View>
            <Text style={styles.quickActionTitle}>Custom Workout</Text>
            <Text style={styles.quickActionSubtitle}>Design your own routine</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECOMMENDED</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
              <Feather name="chevron-right" size={16} color="#ccff00" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedContainer}>
            {recommendedPrograms.map((program) => (
              <TouchableOpacity key={program.id} style={styles.recommendedCard}>
                <View style={styles.recommendedImageContainer}>
                  <Image source={{ uri: program.image }} style={styles.recommendedImage} />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'transparent']}
                    style={styles.imageOverlay}
                  />
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{program.level}</Text>
                  </View>
                </View>
                
                <View style={styles.recommendedContent}>
                  <Text style={styles.recommendedTitle}>{program.title}</Text>
                  <View style={styles.durationContainer}>
                    <Feather name="clock" size={14} color="#ccff00" />
                    <Text style={styles.durationText}>{program.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Feather name="plus" size={32} color="#1f230f" />
      </TouchableOpacity>

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204, 255, 0, 0.1)',
    backgroundColor: 'rgba(31, 35, 15, 0.8)',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  userButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  activeProgramCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    height: 250,
  },
  activeImageBackground: {
    width: '100%',
    height: '100%',
  },
  activeGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  activeContent: {
    padding: 24,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  activeTitleContainer: {
    flex: 1,
  },
  activeTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  activeSubtitle: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#ccff00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  continueButtonText: {
    color: '#1f230f',
    fontSize: 14,
    fontWeight: '900',
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  progressValue: {
    color: '#ccff00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ccff00',
    borderRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendedContainer: {
    paddingRight: 16,
    gap: 20,
  },
  recommendedCard: {
    width: 260,
  },
  recommendedImageContainer: {
    width: '100%',
    aspectRatio: 4/5,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(31, 35, 15, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelText: {
    color: '#ccff00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recommendedContent: {
    paddingHorizontal: 4,
  },
  recommendedTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    bottom: 110, // Adjusted for TabBar
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ccff00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
});
