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
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Colors matching the HTML template
const PRIMARY = "#ccff00";
const BG_LIGHT = "#f8f8f5";
const BG_DARK = "#12140a";
const SURFACE_DARK = "#1c1f0f";
const BORDER_DARK = "#2a2e18";
const TEXT_LIGHT = "#0f172a"; // slate-900
const TEXT_DARK = "#f1f5f9"; // slate-100
const TEXT_MUTED_LIGHT = "#64748b"; // slate-500
const TEXT_MUTED_DARK = "#94a3b8"; // slate-400

// API URL - Android Emulator üçün 10.0.2.2, digərləri üçün localhost
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export default function WeeklyProgramScreen() {
  const router = useRouter();
  const { programId } = useLocalSearchParams();
  const [activeWeek, setActiveWeek] = useState("");
  const [loading, setLoading] = useState(true);
  const [programData, setProgramData] = useState<any>(null);
  const [weekSchedule, setWeekSchedule] = useState<any[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  // Placeholder for dark mode toggle if needed later, currently defaulting to dark mode styles
  const isDarkMode = true;

  useEffect(() => {
    fetchProgramWeeks();
  }, [programId]);

  useEffect(() => {
    if (programData && programData.weeks) {
        const keys = Object.keys(programData.weeks).sort((a, b) => parseInt(a) - parseInt(b));
        const weeks = keys.map(k => `WEEK ${k}`);
        setAvailableWeeks(weeks);
        
        if (weeks.length > 0 && !activeWeek) {
            setActiveWeek(weeks[0]);
        }
        
        updateWeekSchedule();
    }
  }, [activeWeek, programData]);

  const fetchProgramWeeks = async () => {
    if (!programId) {
        setLoading(false);
        return;
    }

    try {
        const user = auth().currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        
        console.log(`Fetching from Go API: ${API_URL}/api/program-weeks?programId=${programId}`);

        const response = await fetch(`${API_URL}/api/program-weeks?programId=${programId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Program Data Received from Go API:", JSON.stringify(data, null, 2));
        setProgramData(data);
    } catch (error) {
        console.error("Error fetching program weeks via Go API:", error);
        Alert.alert("Error", "Failed to load program schedule. Please check your backend.");
    } finally {
        setLoading(false);
    }
  };

  const updateWeekSchedule = () => {
      if (!activeWeek || !programData?.weeks) return;
      
      // activeWeek formatı "WEEK 1", bizə sadəcə rəqəm lazımdır: "1"
      const weekNum = activeWeek.split(' ')[1];
      const weeksData = programData.weeks || {};
      const currentWeekData = weeksData[weekNum] || [];

      // Datanı UI formatına çeviririk
      const formattedSchedule = currentWeekData.map((item: any, index: number) => {
          let duration = 0;
          let exercises = 0;

          if (item.subtitle) {
              const parts = String(item.subtitle).split('•');
              if (parts.length > 0) {
                  const exPart = parts[0].trim().split(' ')[0];
                  exercises = parseInt(exPart) || 0;
              }
              if (parts.length > 1) {
                  const durPart = parts[1].trim().split(' ')[0];
                  duration = parseInt(durPart) || 0;
              }
          }

          let imageUrl = null;
          if (item.images && item.images.length > 0) {
              const rawUrl = item.images[0];
              if (typeof rawUrl === 'string') {
                  imageUrl = rawUrl.replace(/[`"'\s]/g, '');
              }
          }

          return {
              id: item.id, // Add ID field
              day: item.day,
              title: item.title,
              type: item.type || 'workout',
              duration: duration || (item.type === 'workout' ? 45 : 0),
              exercises: exercises || (item.type === 'workout' ? 8 : 0),
              image: imageUrl,
              focus: item.title,
              isCurrent: index === 0,
              note: item.subtitle || (item.type === 'rest' ? "Rest & Recover" : "")
          };
      });

      formattedSchedule.sort((a: any, b: any) => a.day - b.day);
      setWeekSchedule(formattedSchedule);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? BG_DARK : BG_LIGHT} />
      
      {/* Header Navigation */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <MaterialIcons name="arrow-back" size={24} color={isDarkMode ? TEXT_DARK : TEXT_LIGHT} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{programData?.name || "Strength Evolution"}</Text>
        </View>
        <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setIsMenuVisible(true)}
        >
            <MaterialIcons name="more-vert" size={24} color={isDarkMode ? TEXT_DARK : TEXT_LIGHT} />
        </TouchableOpacity>
      </View>

      {/* Weekly Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
            {availableWeeks.map((week) => (
                <TouchableOpacity
                    key={week}
                    style={[styles.tab, activeWeek === week && styles.activeTab]}
                    onPress={() => setActiveWeek(week)}
                >
                    <Text style={[styles.tabText, activeWeek === week && styles.activeTabText]}>{week}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>{activeWeek} Schedule</Text>
            <Text style={styles.scheduleSubtitle}>Follow the plan to maximize results</Text>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
        ) : weekSchedule.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: isDarkMode ? TEXT_MUTED_DARK : TEXT_MUTED_LIGHT }}>No workouts found for this week.</Text>
            </View>
        ) : (
            /* Day List */
            <View style={styles.daysList}>
                {weekSchedule.map((item) => {
                    
                    if (item.type !== 'rest') {
                        return (
                            <View key={item.day} style={item.isCurrent ? styles.currentDayCard : styles.dayCard}>
                                <View style={styles.currentDayHeader}>
                                    <View style={styles.dayInfo}>
                                        {item.isCurrent && (
                                            <Text style={styles.currentDayLabel}>CURRENT DAY</Text>
                                        )}
                                        <Text style={styles.dayTitle}>Day {item.day}: {item.title}</Text>
                                        <View style={styles.dayMeta}>
                                            <MaterialIcons name="schedule" size={12} color={isDarkMode ? TEXT_MUTED_DARK : TEXT_MUTED_LIGHT} />
                                            <Text style={styles.metaText}>{item.duration} min</Text>
                                            <Text style={styles.metaDot}>•</Text>
                                            <MaterialIcons name="fitness-center" size={12} color={isDarkMode ? TEXT_MUTED_DARK : TEXT_MUTED_LIGHT} />
                                            <Text style={styles.metaText}>{item.exercises} exercises</Text>
                                        </View>
                                    </View>
                                    <View style={item.isCurrent ? styles.boltIconContainer : {}}>
                                        {item.isCurrent ? (
                                            <MaterialIcons name="bolt" size={24} color={PRIMARY} />
                                        ) : (
                                            <MaterialIcons name="fitness-center" size={24} color={isDarkMode ? TEXT_MUTED_DARK : TEXT_MUTED_LIGHT} />
                                        )}
                                    </View>
                                </View>

                                {item.image && (
                                    <View style={styles.heroImageContainer}>
                                        <Image 
                                            source={{ uri: item.image }} 
                                            style={styles.heroImage} 
                                            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
                                        />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                                            style={styles.imageOverlay}
                                        />
                                        <Text style={styles.focusText}>Focus: {item.focus}</Text>
                                    </View>
                                )}

                                <TouchableOpacity 
                                    style={styles.startWorkoutButton}
                                    onPress={() => router.push({
                                        pathname: '/screens/WorkoutStartScreen',
                                        params: { 
                                            workout: JSON.stringify(item),
                                            programId: programId,
                                            week: activeWeek
                                        }
                                    })}
                                >
                                    <MaterialIcons name="play-circle-filled" size={24} color={BG_DARK} />
                                    <Text style={styles.startWorkoutText}>START WORKOUT</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    if (item.type === 'rest') {
                        return (
                            <View key={item.day} style={styles.restDayCard}>
                                <View style={styles.restDayContent}>
                                    <View style={styles.dayInfo}>
                                        <Text style={styles.dayTitle}>Day {item.day}: {item.title}</Text>
                                        <Text style={styles.restNote}>{item.note || "Rest & Recover"}</Text>
                                    </View>
                                    <MaterialIcons 
                                        name="self-improvement"
                                        size={24} 
                                        color="rgba(204, 255, 0, 0.6)" 
                                    />
                                </View>
                            </View>
                        );
                    }

                    return null;
                })}
            </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Week Selection Modal Menu */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsMenuVisible(false)}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Switch Week</Text>
                {availableWeeks.map((week) => (
                    <TouchableOpacity
                        key={week}
                        style={[styles.modalItem, activeWeek === week && styles.activeModalItem]}
                        onPress={() => {
                            setActiveWeek(week);
                            setIsMenuVisible(false);
                        }}
                    >
                        <Text style={[styles.modalItemText, activeWeek === week && styles.activeModalItemText]}>
                            {week}
                        </Text>
                        {activeWeek === week && (
                            <MaterialIcons name="check" size={20} color={PRIMARY} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK, // dark:bg-background-dark
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_DARK,
    backgroundColor: 'rgba(18, 20, 10, 0.8)', // dark:bg-background-dark/80 backdrop-blur-md
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_DARK,
    letterSpacing: -0.5, // tracking-tight
  },
  menuButton: {
    padding: 8,
    borderRadius: 9999, // rounded-full
    marginRight: -8,
  },
  tabsContainer: {
    borderBottomWidth: 0, // HTML'de tabların altı çizgili değil, border header'da
  },
  tabsContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    minWidth: 80,
  },
  activeTab: {
    borderBottomColor: PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: TEXT_MUTED_DARK,
    letterSpacing: 0.5, // tracking-wide
  },
  activeTabText: {
    color: PRIMARY,
  },
  content: {
    padding: 16,
    paddingBottom: 96, // pb-24
  },
  scheduleHeader: {
    marginBottom: 8, // mb-2
  },
  scheduleTitle: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 0,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED_DARK,
  },
  daysList: {
    gap: 16, // space-y-4
    marginTop: 16,
  },
  currentDayCard: {
    backgroundColor: SURFACE_DARK,
    borderRadius: 12, // rounded-xl (React Native'de genelde 12-16 arası iyidir)
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.3)', // border-primary/30
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5, // shadow-lg
  },
  currentDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dayInfo: {
    flex: 1,
    gap: 4, // gap-1
  },
  currentDayLabel: {
    color: PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2, // tracking-[0.2em]
    textTransform: 'uppercase',
  },
  dayTitle: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  dayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  metaText: {
    fontSize: 14, // text-sm
    color: TEXT_MUTED_DARK,
  },
  metaDot: {
    fontSize: 14,
    color: TEXT_MUTED_DARK,
    display: 'none', // HTML'de aralarında boşluk var, nokta yok (schedule ve fitness_center iconları ayırıyor)
  },
  boltIconContainer: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)', // bg-primary/10
    padding: 8,
    borderRadius: 8, // rounded-lg
  },
  heroImageContainer: {
    width: '100%',
    aspectRatio: 16/9, // aspect-video
    borderRadius: 8, // rounded-lg
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  focusText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#fff',
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },
  startWorkoutButton: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    gap: 8,
  },
  startWorkoutText: {
    color: BG_DARK,
    fontSize: 16, // Varsayılan text boyutu, HTML'de özel verilmemiş ama bold
    fontWeight: 'bold',
  },
  dayCard: {
    backgroundColor: SURFACE_DARK,
    borderRadius: 12, // rounded-xl
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_DARK, // dark:border-border-dark
  },
  dayCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restDayCard: {
    backgroundColor: 'rgba(28, 31, 15, 0.4)', // dark:bg-surface-dark/40
    borderRadius: 12, // rounded-xl
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_DARK, // dark:border-border-dark
    borderStyle: 'dashed',
  },
  restDayContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.7, // opacity-70
  },
  restNote: {
    fontSize: 12, // text-xs
    color: TEXT_MUTED_DARK,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: SURFACE_DARK,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER_DARK,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_DARK,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_DARK,
  },
  activeModalItem: {
    borderBottomColor: PRIMARY,
  },
  modalItemText: {
    fontSize: 16,
    color: TEXT_MUTED_DARK,
    fontWeight: '500',
  },
  activeModalItemText: {
    color: PRIMARY,
    fontWeight: 'bold',
  },
});
