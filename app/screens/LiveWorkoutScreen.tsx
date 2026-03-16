import { MaterialIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const PRIMARY = "#ccff00";
const BG_DARK = "#12140a";
const SURFACE_DARK = "#1c1f0f";
const BORDER_DARK = "#2a2e18";
const TEXT_COLOR = "#f1f5f9";
const SUBTEXT_COLOR = "#94a3b8";

// API URL - Android Emulator üçün 10.0.2.2, digərləri üçün localhost
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

interface ExerciseDetail {
  name: string;
  reps: string | number;
  sets: string | number;
  videoUrl?: string;
  muscleGroups?: { name: string; imageUrl: string }[];
  mainImage?: string;
  imageUrl?: string;
  instructions?: string;
}

interface WorkoutPlanItem {
  name: string;
  reps: string | number;
  sets: string | number;
  // This might contain only basic info, details need to be fetched from 'workouts' collection
}

export default function LiveWorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseDetail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchWorkoutData();
  }, [workoutId]);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.replace(/[\s"`']/g, "");
    
    const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ 
    ];

    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
        if (match && match[0] && pattern.toString().includes('^')) {
             return match[0];
        }
    }
    return null;
  };

  const fetchWorkoutData = async () => {
    console.log("fetchWorkoutData STARTED");
    if (!workoutId) {
        console.log("fetchWorkoutData ABORTED: No workoutId provided");
        setLoading(false);
        return;
    }

    try {
      console.log("Getting current user...");
      const user = auth().currentUser;
      if (!user) {
          console.log("fetchWorkoutData ABORTED: No user logged in");
          return;
      }

      console.log("Getting ID token...");
      const token = await user.getIdToken();
      console.log("Token received (truncated):", token.substring(0, 20) + "...");
      
      const url = `${API_URL}/api/workout-plan?workoutId=${workoutId}`;
      console.log(`Fetching workout plan from Go API: ${url}`);

      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", JSON.stringify(response.headers, null, 2));

      if (!response.ok) {
          const errorText = await response.text();
          console.error("HTTP Error Body:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Workout Plan Received from Go API:", JSON.stringify(data, null, 2));
      
      setWorkoutName(data.name || "Workout");
      setExercises(data.exercises || []);

    } catch (error) {
      console.error("Error fetching live workout data via Go API:", error);
      Alert.alert("Error", "Failed to load workout data. Please check your backend.");
    } finally {
      console.log("fetchWorkoutData FINISHED - Setting loading to false");
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      Alert.alert("Workout Complete", "Great job! You've finished the workout.", [
        { text: "Finish", onPress: () => router.back() }
      ]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (exercises.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: TEXT_COLOR }}>No exercises found for this workout.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: PRIMARY }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progressPercent = Math.round((currentIndex / exercises.length) * 100);
  
  const videoId = currentExercise.videoUrl ? getYoutubeId(currentExercise.videoUrl) : null;
  
  // Create Plyr HTML
  const plyrHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
      <style>
        body { margin: 0; padding: 0; background-color: #1e293b; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
        .plyr { width: 100%; height: 100%; }
        .plyr__video-wrapper { height: 100%; }
      </style>
    </head>
    <body>
      <div class="plyr__video-embed" id="player">
        <iframe
          src="https://www.youtube.com/embed/${videoId}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
          allowfullscreen
          allowtransparency
          allow="autoplay"
        ></iframe>
      </div>
      <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
      <script>
        const player = new Plyr('#player', {
             controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
             youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 }
        });
      </script>
    </body>
    </html>
  `;
  
  // Get target muscle image (first one)
  const targetMuscleImage = currentExercise.muscleGroups && currentExercise.muscleGroups.length > 0 
      ? currentExercise.muscleGroups[0].imageUrl 
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Header & Progress Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
                <MaterialIcons name="fitness-center" size={24} color={PRIMARY} />
                <Text style={styles.headerTitle}>{workoutName}</Text>
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
                <Text style={styles.progressValue}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Exercise Video/Animation Area */}
        <View style={styles.videoContainer}>
            {videoId ? (
                <View style={styles.videoWrapper}>
                    <WebView
                        style={styles.webView}
                        javaScriptEnabled={true}
                        allowsFullscreenVideo={true}
                        source={{ html: plyrHTML, baseUrl: "https://myapp.local" }}
                        mediaPlaybackRequiresUserAction={false}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={PRIMARY} />
                                <Text style={styles.loadingText}>
                                    Loading video player...
                                </Text>
                            </View>
                        )}
                    />
                </View>
            ) : (
                <ImageBackground
                    source={{ uri: currentExercise.mainImage || 'https://via.placeholder.com/400x225?text=No+Image' }}
                    style={styles.videoThumbnail}
                    imageStyle={{ opacity: 0.8 }}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(18, 20, 10, 0.8)']}
                        style={styles.videoOverlay}
                    />
                    
                    {/* Simulated controls for UI fidelity if no video */}
                    <View style={styles.videoControls}>
                        <View style={styles.videoTimeline}>
                            <View style={styles.videoProgress}>
                                <View style={styles.videoProgressFill}>
                                    <View style={styles.videoKnob} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.timeLabels}>
                            <Text style={styles.timeText}>0:00</Text>
                            <Text style={styles.timeText}>--:--</Text>
                        </View>
                    </View>
                </ImageBackground>
            )}
        </View>

        {/* Exercise Title & Tip */}
        <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseTitle}>{currentExercise.name.toUpperCase()}</Text>
            <Text style={styles.exerciseTip}>{currentExercise.instructions?.slice(0, 100) || "Keep good form and control the movement"}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>REPS</Text>
                <Text style={styles.statValue}>{currentExercise.reps}</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>SETS</Text>
                <View style={styles.setsValueContainer}>
                    <Text style={[styles.statValue, { color: PRIMARY }]}>{currentExercise.sets}</Text>
                </View>
            </View>
        </View>

        {/* Muscle Map Section */}
        {currentExercise.muscleGroups && currentExercise.muscleGroups.length > 0 && (
            <View style={styles.muscleMapCard}>
                <View style={styles.muscleMapContainer}>
                    {targetMuscleImage ? (
                         <Image 
                            source={{ uri: targetMuscleImage }}
                            style={styles.muscleMapImage}
                        />
                    ) : (
                        <MaterialIcons name="accessibility" size={60} color="rgba(255,255,255,0.4)" />
                    )}
                </View>
                <View style={styles.muscleInfo}>
                    <Text style={styles.muscleInfoTitle}>Target Muscles</Text>
                    <View style={styles.muscleTags}>
                        {currentExercise.muscleGroups.map((muscle, idx) => (
                            <View key={idx} style={[styles.muscleTag, { backgroundColor: idx === 0 ? PRIMARY : '#1e293b' }]}>
                                <Text style={[styles.muscleTagText, { color: idx === 0 ? BG_DARK : '#94a3b8' }]}>
                                    {muscle.name.toUpperCase()}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        )}

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

            {isExpanded && (
                <View style={styles.workoutList}>
                    {exercises.map((ex, index) => {
                        const isActive = index === currentIndex;
                        const isPast = index < currentIndex;
                        
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={isActive ? styles.activeListItem : styles.listItem}
                                onPress={() => setCurrentIndex(index)}
                            >
                                <View style={styles.listItemLeft}>
                                    <View style={isActive ? styles.activeDot : styles.inactiveDot} />
                                    <Text style={isActive ? styles.activeListItemText : styles.listItemText}>
                                        {ex.name}
                                    </Text>
                                </View>
                                <Text style={isActive ? styles.activeListItemMeta : styles.listItemMeta}>
                                    {ex.sets} x {ex.reps}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
            {currentIndex > 0 ? (
                <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
                    <MaterialIcons name="arrow-back" size={20} color="#f1f5f9" />
                    <Text style={styles.prevButtonText}>Previous</Text>
                </TouchableOpacity>
            ) : (
                <View style={{ flex: 1 }} /> // Spacer to keep Next button on right
            )}
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                    {currentIndex === exercises.length - 1 ? "Finish" : "Next"}
                </Text>
                <MaterialIcons name={currentIndex === exercises.length - 1 ? "check" : "arrow-forward"} size={20} color={BG_DARK} />
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
  videoWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  loadingText: {
    marginTop: 10,
    color: '#94a3b8',
    fontSize: 12,
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
