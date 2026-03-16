import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PRIMARY = "#ccff00";
const BG_DARK = "#12140a";
const CARD_DARK = "#1f230f";
const TEXT_COLOR = "#f1f5f9";
const SUBTEXT_COLOR = "#94a3b8";

export default function WorkoutStartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    if (params.workout) {
      try {
        const workoutData = typeof params.workout === 'string' ? JSON.parse(params.workout) : params.workout;
        setWorkout(workoutData);
      } catch (e) {
        console.error("Error parsing workout data:", e);
      }
    }
  }, [params.workout]);

  if (!workout) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  // Determine image source
  const imageSource = workout.image 
    ? { uri: workout.image } 
    : { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ7ifvUXOXHpKhnEQMPjkhTW91sq7CKFxuHpigTmAyvkxa7zcE4rrMiYQOfKv9Zn9huqDbol36rXkcNxnnVLLbcmzsMDcbxbnhQjYbql6tt7ZKImx-ii1faE81PdF2WT8-PLm7ESJ7pvfmcembKP3-ufZqVquRaokxzamguJ9bYT3W9JD9HfLID8GZOqZAqUMSMSBbJUalR8g9XIt1Rfp6YjqFM3GYwgCsWnzJVQ-_3xLtAuMd9rTXwHbgyGV495EdrwaCBqwBVkM' };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Background Image */}
        <View style={styles.heroSection}>
            <ImageBackground
                source={imageSource}
                style={styles.heroImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(18, 20, 10, 0.3)', 'rgba(18, 20, 10, 0.8)', BG_DARK]}
                    style={styles.heroGradient}
                />
                
                {/* Header Navigation (Back Button) */}
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={TEXT_COLOR} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <View style={styles.heroContent}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>TODAY'S GOAL</Text>
                    </View>
                    <Text style={styles.heroTitle}>Ready to start your workout?</Text>
                </View>
            </ImageBackground>
        </View>

        {/* Workout Detail Card */}
        <View style={styles.cardContainer}>
            <View style={styles.workoutCard}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="fitness-center" size={32} color={PRIMARY} />
                </View>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
                
                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <MaterialIcons name="calendar-today" size={14} color={SUBTEXT_COLOR} />
                        <Text style={styles.metaText}>Day {workout.day}</Text>
                    </View>
                    <View style={styles.dot} />
                    <View style={styles.metaItem}>
                        <MaterialIcons name="schedule" size={14} color={SUBTEXT_COLOR} />
                        <Text style={styles.metaText}>{workout.duration} mins</Text>
                    </View>
                    <View style={styles.dot} />
                    <View style={styles.metaItem}>
                        <MaterialIcons name="list" size={14} color={SUBTEXT_COLOR} />
                        <Text style={styles.metaText}>{workout.exercises} exercises</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* Tip Box */}
        <View style={styles.tipContainer}>
            <View style={styles.tipBox}>
                <MaterialIcons name="lightbulb" size={24} color={PRIMARY} />
                <Text style={styles.tipText}>
                    {workout.note || "Focus on the eccentric phase (lowering the weight) for maximum muscle growth and strength gains."}
                </Text>
            </View>
        </View>

        {/* First Exercise Preview */}
        <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>FIRST EXERCISE PREVIEW</Text>
            <View style={styles.previewCard}>
                <View style={styles.previewImageContainer}>
                    <Image 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXhELLtK5L5L4ma0Jq7wSDGkLh1lYOrjVt8-5lqL4m0TSe4Ty93hhLQWNu4z1Wg_DRX926tGf5N2JzLM8kma_RGTvPcW9xRpDOqjY1x9yz-5ly4Y0GiRhx3IFQOy8ydBqciztUgKkD0QXjEfNMU7Ia6SRlZAoCxYQuryKk-yTmp_nfqUZxXIYCAL_PsoMcv8lV8WhFmDoyrY6QsUG3DRGju-5GjkFgTBB0dZDUX3YDanc0yircpb-Pu3-320IX8ScHam-e_FVjeX8' }}
                        style={styles.previewImage}
                    />
                    <View style={styles.playOverlay}>
                        <MaterialIcons name="play-circle-filled" size={32} color="rgba(204, 255, 0, 0.4)" />
                    </View>
                </View>
                <View style={styles.previewInfo}>
                    <Text style={styles.exerciseName}>Barbell Bench Press</Text>
                    <View style={styles.setsRepsContainer}>
                        <View style={styles.setTag}>
                            <Text style={styles.setTagText}>4 SETS</Text>
                        </View>
                        <Text style={styles.xText}>x</Text>
                        <View style={styles.repTag}>
                            <Text style={styles.repTagText}>10 REPS</Text>
                        </View>
                    </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={SUBTEXT_COLOR} />
            </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.startNowButton}
            onPress={() => router.push({
                pathname: '/screens/LiveWorkoutScreen',
                params: { workoutId: workout.id }
            })}
        >
            <Text style={styles.startNowText}>START NOW</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
            <TouchableOpacity style={styles.secondaryButtonFilled}>
                <Text style={styles.secondaryButtonTextFilled}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButtonOutline}>
                <Text style={styles.secondaryButtonTextOutline}>Not Now</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  safeArea: {
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    height: 400,
    width: '100%',
    marginBottom: -40, // Pull up the card
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  badge: {
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: TEXT_COLOR,
    textAlign: 'center',
    lineHeight: 38,
    maxWidth: 250,
  },
  cardContainer: {
    paddingHorizontal: 16,
    zIndex: 10,
  },
  workoutCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 12,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
  },
  tipContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tipBox: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  tipText: {
    flex: 1,
    color: SUBTEXT_COLOR,
    fontSize: 14,
    lineHeight: 20,
  },
  previewContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  previewTitle: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
  },
  previewCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 16,
  },
  previewImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#333',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    flex: 1,
    gap: 6,
  },
  exerciseName: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  setsRepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setTag: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  setTagText: {
    color: PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
  },
  xText: {
    color: SUBTEXT_COLOR,
    fontSize: 12,
  },
  repTag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  repTagText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: BG_DARK,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  startNowButton: {
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startNowText: {
    color: BG_DARK,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButtonFilled: {
    flex: 1,
    height: 48,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonTextFilled: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButtonOutline: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryButtonTextOutline: {
    color: SUBTEXT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
