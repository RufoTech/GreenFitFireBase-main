import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { WebView } from 'react-native-webview';

const PRIMARY = "#ccff00";
const BG_DARK = "#1f230f";
const { width } = Dimensions.get('window');

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
    if (!url) return null;
    // Clean URL: remove whitespace, quotes, backticks
    const cleanUrl = url.replace(/[\s"`']/g, "");
    
    // Regular expressions for different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // If the user just pasted the ID
    ];

    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
        // Check if the whole string matches the ID pattern (second regex)
        if (match && match[0] && pattern.toString().includes('^')) {
             return match[0];
        }
    }
    
    return null;
};

// Icons
const Icons = {
  Back: () => (
    <Svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
      <Path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z"/>
    </Svg>
  ),
  Reps: () => (
    <Svg height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
      <Path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Z"/>
    </Svg>
  ),
  Sets: () => (
    <Svg height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
      <Path d="M160-80v-160h-40v-320l80-240h480l80 240v320h-40v160h-80v-160H240v160h-80Z"/>
    </Svg>
  ),
  Fitness: () => (
    <Svg height="22" viewBox="0 -960 960 960" width="22" fill="currentColor">
      <Path d="M120-160v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-473v-113l320-320 320 320v113L440-793 120-473Z"/>
    </Svg>
  ),
  ChevronLeft: () => (
    <Svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
      <Path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
    </Svg>
  ),
  ChevronRight: () => (
    <Svg height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
      <Path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
    </Svg>
  )
};

export default function ExerciseDetailScreen() {
  const [playing, setPlaying] = useState(false);
  const router = useRouter();
  const { exercise: exerciseParam } = useLocalSearchParams();
  const exerciseStr = Array.isArray(exerciseParam) ? exerciseParam[0] : exerciseParam;
  
  let exercise = null;
  try {
    exercise = exerciseStr ? JSON.parse(exerciseStr) : null;
  } catch (error) {
    console.error('Error parsing exercise:', error);
  }
  
  // Robust Video ID Extraction
  let videoId = null;
  const rawVideoUrl = exercise?.videoUrl;

  if (rawVideoUrl) {
      // 1. Remove common noise characters: quotes, backticks, spaces
      const cleanUrl = rawVideoUrl.replace(/[\s"`']/g, "");
      
      // 2. Try to get ID from cleaned URL using helper
      videoId = getYoutubeId(cleanUrl);

      // 3. Fallback: If still null, try to find the ID pattern directly in the original string
      // This helps if the URL is embedded in other text
      if (!videoId) {
          const idPattern = /(?:v=|youtu\.be\/|\/)([a-zA-Z0-9_-]{11})/;
          const match = rawVideoUrl.match(idPattern);
          if (match && match[1]) {
              videoId = match[1];
          }
      }
  }
  
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
        >
          <View style={{ color: '#f1f5f9' }}>
             <Icons.Back />
          </View>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Train Info</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Exercise Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.exerciseTitle}>{exercise?.name || 'Unknown Exercise'}</Text>
          <Text style={styles.exerciseSubtitle}>{exercise?.category || 'General'}</Text>
        </View>

        {/* Video Area */}
        <View style={styles.videoContainer}>
          <View style={styles.videoWrapper}>
            {videoId ? (
                <WebView
                    style={styles.webView}
                    javaScriptEnabled={true}
                    allowsFullscreenVideo={true}
                    source={{ html: plyrHTML, baseUrl: "https://myapp.local" }}
                    mediaPlaybackRequiresUserAction={false}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ccff00" />
                            <Text style={styles.loadingText}>
                                Loading video player...
                            </Text>
                        </View>
                    )}
                />
            ) : (
                <View style={[styles.videoOverlay, { backgroundColor: '#1e293b' }]}>
                    <Text style={{ color: '#94a3b8' }}>No Video Available</Text>
                </View>
            )}
          </View>
        </View>

        {/* Stats Boxes */}
        <View style={styles.statsContainer}>
            <View style={styles.statBox}>
                <View style={styles.statHeader}>
                    <View style={{ color: '#94a3b8' }}><Icons.Reps /></View>
                    <Text style={styles.statLabel}>Təkrar (Reps)</Text>
                </View>
                <Text style={styles.statValue}>{exercise?.reps || '-'}</Text>
            </View>
            <View style={styles.statBox}>
                <View style={styles.statHeader}>
                    <View style={{ color: '#94a3b8' }}><Icons.Sets /></View>
                    <Text style={styles.statLabel}>Set Sayı</Text>
                </View>
                <Text style={styles.statValue}>{exercise?.sets || '-'}</Text>
            </View>
        </View>

        {/* Targeted Muscles */}
        <View style={styles.musclesSection}>
            <View style={styles.musclesHeader}>
                <View style={{ color: PRIMARY }}><Icons.Fitness /></View>
                <Text style={styles.musclesTitle}>Hədəf Əzələlər / Targeted Muscles</Text>
            </View>
            
            <View style={styles.musclesCard}>
                <View style={styles.muscleImageContainer}>
                    {exercise?.targetMuscleImage ? (
                        <Image 
                            source={{ uri: exercise.targetMuscleImage }}
                            style={styles.muscleImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={[styles.muscleImage, { justifyContent: 'center', alignItems: 'center' }]}>
                             <Text style={{ color: '#94a3b8' }}>No Image Available</Text>
                        </View>
                    )}
                    <View style={styles.muscleImageOverlay} />
                </View>
                
                <View style={styles.muscleGrid}>
                    {(exercise?.muscleNames || []).map((m: string, i: number) => (
                        <View key={i} style={[styles.muscleItem, { borderColor: "#334155" }]}>
                            <Text style={[styles.muscleItemLabel, { color: PRIMARY }]}>{m}</Text>
                        </View>
                    ))}
                    {(exercise?.muscleNames || []).length === 0 && (
                        <Text style={{ color: '#94a3b8', fontStyle: 'italic' }}>No target muscles specified</Text>
                    )}
                </View>
            </View>
        </View>

        {/* Navigation Buttons - Optional, maybe remove or implement logic */}
        {/* Keeping them but they won't do much without logic */}
        <View style={styles.footer}>
            <View style={styles.dotsContainer}>
                 {/* Dots logic removed for now */}
            </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(31, 35, 15, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b', // slate-800
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: PRIMARY,
    marginBottom: 4,
  },
  exerciseSubtitle: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
  },
  videoContainer: {
    padding: 16,
  },
  videoWrapper: {
    width: '100%',
    height: 220, // Fixed height for WebView
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: `${PRIMARY}33`,
    position: 'relative',
    // Removed justifyContent and alignItems to let WebView fill the space
  },
  webView: {
    flex: 1,
    backgroundColor: '#1e293b',
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
  videoImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 10,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  progressBarWrapper: {
    flexDirection: 'row',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 4,
    alignItems: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 3,
    position: 'relative',
  },
  progressBarKnob: {
    position: 'absolute',
    right: -6,
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PRIMARY,
    borderWidth: 2,
    borderColor: '#fff',
  },
  progressBarRemaining: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '900',
    color: PRIMARY,
  },
  musclesSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  musclesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  musclesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  musclesCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)', // slate-800/30
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
  },
  muscleImageContainer: {
    width: '100%',
    height: 256,
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 24,
    position: 'relative',
  },
  muscleImage: {
    width: '100%',
    height: '100%',
  },
  muscleImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(204, 255, 0, 0.1)', // primary/10
    opacity: 0.5,
  },
  muscleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  muscleItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: BG_DARK,
  },
  muscleItemLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  muscleItemSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#cbd5e1', // slate-300
  },
  footer: {
    padding: 16,
    gap: 16,
    marginTop: 'auto',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#1e293b', // slate-800
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BG_DARK,
  },
});
