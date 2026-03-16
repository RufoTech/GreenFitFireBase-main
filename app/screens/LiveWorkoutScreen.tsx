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
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PRIMARY = "#ccff00";
const BG_DARK = "#12140a";
const SURFACE_DARK = "#1c1f0f";
const BORDER_DARK = "#2a2e18";
const TEXT_COLOR = "#f1f5f9";
const SUBTEXT_COLOR = "#94a3b8";

export default function LiveWorkoutScreen() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Header & Progress Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
                <MaterialIcons name="fitness-center" size={24} color={PRIMARY} />
                <Text style={styles.headerTitle}>Upper Body Power</Text>
            </View>
            <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => router.back()}
            >
                <MaterialIcons name="close" size={24} color="#f1f5f9" />
            </TouchableOpacity>
        </View>
        
        <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>WORKOUT PROGRESS</Text>
                <Text style={styles.progressValue}>25%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '25%' }]} />
            </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Exercise Video/Animation Area */}
        <View style={styles.videoContainer}>
            <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-p6nE678yQsOfhwMGIaZysFuaazkHFoA7zzkBfi8Vro0rtIpVXy2cQxsu6o8UVTRqnbmLWW2p6s3i_ZLU3pOcQTQKzKUeO4c0fTlULFU027ck7R4ogO3lYwm0Pyz8SxzBZbT_D8ur0WM8xCn5d-G3AE_in0VGYqqvVFZF-F5bggVURceKj949aorYgL38uLhnmlX05niA2CEqarAP2iaDGIVPq7VGqsVdCUGObIFm6DZbI2EzlyGK3AKeAiC2DtICedMmkQmbfzM' }}
                style={styles.videoThumbnail}
                imageStyle={{ opacity: 0.8 }}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(18, 20, 10, 0.8)']}
                    style={styles.videoOverlay}
                />
                
                <View style={styles.playButtonContainer}>
                    <TouchableOpacity style={styles.playButton}>
                        <MaterialIcons name="play-arrow" size={48} color={BG_DARK} />
                    </TouchableOpacity>
                </View>

                <View style={styles.videoControls}>
                    <View style={styles.videoTimeline}>
                        <View style={styles.videoProgress}>
                            <View style={styles.videoProgressFill}>
                                <View style={styles.videoKnob} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.timeLabels}>
                        <Text style={styles.timeText}>0:37</Text>
                        <Text style={styles.timeText}>2:23</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>

        {/* Exercise Title & Tip */}
        <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseTitle}>BARBELL BENCH PRESS</Text>
            <Text style={styles.exerciseTip}>Keep your elbows tucked and chest proud</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>REPS</Text>
                <Text style={styles.statValue}>10</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>SETS</Text>
                <View style={styles.setsValueContainer}>
                    <Text style={[styles.statValue, { color: PRIMARY }]}>1</Text>
                    <Text style={[styles.statValue, { fontSize: 24, color: SUBTEXT_COLOR }]}>/4</Text>
                </View>
            </View>
        </View>

        {/* Muscle Map Section */}
        <View style={styles.muscleMapCard}>
            <View style={styles.muscleMapContainer}>
                <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf1vk4wEuzeSkZ_pWJ5Ra8KY31fgv36te-m9r6XXF4200GrbUEOOkbahYe0M9_y9nlGr0eAqXDUaa4B18nYVYdB0Xe2toiEHcr6z50yaX7VGdwT9H_7GlWQCk4pF2CBiTSe0pFGjsXUHu8UqdTmvgSixalPIJhb22NJcxNaW9PxYa6DGzFFw9ABByn7F5xbMw1RXMkJOS_yB2sdYpxGE3PhMyBDNlXbAY3yvrN5ozM748kZxx_RT9IZCkFmbYefCX7BF_vfJIVEIk' }}
                    style={styles.muscleMapImage}
                />
                {/* Simulated highlights */}
                <View style={[styles.highlight, { top: 32, left: '25%' }]} />
                <View style={[styles.highlight, { top: 32, right: '25%' }]} />
            </View>
            <View style={styles.muscleInfo}>
                <Text style={styles.muscleInfoTitle}>Target Muscles</Text>
                <View style={styles.muscleTags}>
                    <View style={[styles.muscleTag, { backgroundColor: PRIMARY }]}>
                        <Text style={[styles.muscleTagText, { color: BG_DARK }]}>CHEST</Text>
                    </View>
                    <View style={[styles.muscleTag, { backgroundColor: 'rgba(204, 255, 0, 0.2)' }]}>
                        <Text style={[styles.muscleTagText, { color: PRIMARY }]}>TRICEPS</Text>
                    </View>
                    <View style={[styles.muscleTag, { backgroundColor: '#1e293b' }]}>
                        <Text style={[styles.muscleTagText, { color: '#94a3b8' }]}>SHOULDERS</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* Workout List Section */}
        <View style={styles.workoutListSection}>
            <TouchableOpacity 
                style={styles.workoutListHeader}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <View style={styles.workoutListTitleContainer}>
                    <MaterialIcons name="list-alt" size={20} color={PRIMARY} />
                    <Text style={styles.workoutListTitle}>WORKOUT LIST</Text>
                </View>
                <MaterialIcons name={isExpanded ? "expand-less" : "expand-more"} size={24} color={PRIMARY} />
            </TouchableOpacity>

            <View style={styles.workoutList}>
                {/* Active Exercise */}
                <View style={styles.activeListItem}>
                    <View style={styles.listItemLeft}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeListItemText}>Barbell Bench Press</Text>
                    </View>
                    <Text style={styles.activeListItemMeta}>4 x 10</Text>
                </View>

                {/* Upcoming Exercises */}
                <View style={styles.listItem}>
                    <View style={styles.listItemLeft}>
                        <View style={styles.inactiveDot} />
                        <Text style={styles.listItemText}>Weighted Pull-ups</Text>
                    </View>
                    <Text style={styles.listItemMeta}>3 x 8</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listItemLeft}>
                        <View style={styles.inactiveDot} />
                        <Text style={styles.listItemText}>Military Press</Text>
                    </View>
                    <Text style={styles.listItemMeta}>3 x 12</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listItemLeft}>
                        <View style={styles.inactiveDot} />
                        <Text style={styles.listItemText}>Face Pulls</Text>
                    </View>
                    <Text style={styles.listItemMeta}>3 x 15</Text>
                </View>
            </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.prevButton}>
                <MaterialIcons name="arrow-back" size={20} color="#f1f5f9" />
                <Text style={styles.prevButtonText}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton}>
                <Text style={styles.nextButtonText}>Next</Text>
                <MaterialIcons name="arrow-forward" size={20} color={BG_DARK} />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  progressValue: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    marginBottom: 24,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(204, 255, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  videoTimeline: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoProgress: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  videoProgressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 2,
    position: 'relative',
  },
  videoKnob: {
    position: 'absolute',
    right: -6,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
    borderWidth: 2,
    borderColor: BG_DARK,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  exerciseTip: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
  },
  setsValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  muscleMapCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  muscleMapContainer: {
    width: 80,
    height: 100,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleMapImage: {
    width: 60,
    height: 100,
    opacity: 0.4,
    tintColor: '#fff',
  },
  highlight: {
    position: 'absolute',
    width: 16,
    height: 24,
    backgroundColor: 'rgba(204, 255, 0, 0.4)',
    borderRadius: 999,
    blurRadius: 4,
  },
  muscleInfo: {
    flex: 1,
  },
  muscleInfoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  muscleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  muscleTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  workoutListSection: {
    marginTop: 8,
    paddingBottom: 24,
  },
  workoutListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  workoutListTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutListTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  workoutList: {
    gap: 12,
  },
  activeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.3)',
    borderRadius: 12,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  activeListItemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeListItemMeta: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: '900',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 12,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  listItemText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listItemMeta: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '900',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: BG_DARK, // Or gradient if possible
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  prevButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 12,
    backgroundColor: PRIMARY,
  },
  nextButtonText: {
    color: BG_DARK,
    fontSize: 14,
    fontWeight: '900',
  },
});
