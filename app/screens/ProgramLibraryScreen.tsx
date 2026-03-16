import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

const PRIMARY = "#ccff00";
const BG_DARK = "#12140a";
const CARD_BG = "rgba(255, 255, 255, 0.05)";
const TEXT_COLOR = "#f1f5f9";
const SUBTEXT_COLOR = "#94a3b8";

// Define Workout interface based on saved data structure
interface SavedWorkout {
  id: string;
  title: string;
  level: string;
  muscle: string; // Mapped from 'target'
  exerciseCount: number;
  duration: string;
  image: string;
}

export default function ProgramLibraryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);

  useEffect(() => {
    // Mock user ID
    const user = auth().currentUser;
    if (!user) {
        setLoading(false);
        return;
    }
    const userId = user.uid;

    const unsubscribe = firestore()
      .collection('saved_workouts')
      .where('userId', '==', userId)
      .orderBy('savedAt', 'desc')
      .onSnapshot(querySnapshot => {
        const workouts: SavedWorkout[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          workouts.push({
            id: doc.id,
            title: data.title || 'Untitled Workout',
            level: data.level || 'General',
            muscle: data.target || 'General',
            exerciseCount: data.exerciseCount || 0,
            duration: data.duration || '0',
            image: data.image || 'https://via.placeholder.com/150',
          });
        });
        setSavedWorkouts(workouts);
        setLoading(false);
      }, error => {
        console.error("Error fetching saved workouts:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = (workoutId: string) => {
      Alert.alert(
          "Delete Workout",
          "Are you sure you want to delete this workout?",
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Delete", 
                  style: "destructive",
                  onPress: async () => {
                      try {
                          await firestore().collection('saved_workouts').doc(workoutId).delete();
                          // No need to manually update state as onSnapshot handles it
                      } catch (error) {
                          console.error("Error deleting saved workout:", error);
                          Alert.alert("Error", "Failed to delete workout.");
                      }
                  }
              }
          ]
      );
  };

  const filteredWorkouts = savedWorkouts.filter(workout => 
    workout.title.toLowerCase().includes(search.toLowerCase()) || 
    workout.muscle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_DARK} />
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Library</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="more-vert" size={24} color={TEXT_COLOR} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="search" size={24} color="#94a3b8" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts, programs..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      
      {/* Workout List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
            <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
        ) : (
            <View style={styles.workoutsList}>
            {filteredWorkouts.length === 0 ? (
                <Text style={{ color: SUBTEXT_COLOR, textAlign: 'center', marginTop: 40 }}>
                    No workouts saved yet.
                </Text>
            ) : (
                filteredWorkouts.map((item) => (
                    <TouchableOpacity 
                    key={item.id} 
                    style={styles.workoutCard}
                    activeOpacity={0.9}
                    >
                    <View style={styles.workoutInfo}>
                        <View style={styles.workoutHeader}>
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>{item.level}</Text>
                            </View>
                        </View>
                        
                        <Text style={styles.workoutTitle}>{item.title}</Text>
                        
                        <View style={styles.workoutMetaContainer}>
                            <View style={styles.metaItem}>
                                <MaterialIcons name="fitness-center" size={14} color={SUBTEXT_COLOR} />
                                <Text style={styles.metaText}>{item.muscle}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <MaterialIcons name="list-alt" size={14} color={SUBTEXT_COLOR} />
                                <Text style={styles.metaText}>{item.exerciseCount} Exercises</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <MaterialIcons name="schedule" size={14} color={SUBTEXT_COLOR} />
                                <Text style={styles.metaText}>{item.duration} min</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.startButton}
                            onPress={() => {
                                // Navigation removed as requested
                            }}
                        >
                            <MaterialIcons name="play-arrow" size={20} color={BG_DARK} />
                            <Text style={styles.startButtonText}>Start Workout</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.workoutImageContainer}>
                        <Image source={{ uri: item.image }} style={styles.workoutImage} />
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item.id)}
                        >
                            <MaterialIcons name="delete" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                    </TouchableOpacity>
                ))
            )}
            </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>


      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={32} color={BG_DARK} />
      </TouchableOpacity>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(18, 20, 10, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    height: 48,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchIconContainer: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: TEXT_COLOR,
    fontSize: 16,
    paddingRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  workoutsList: {
    gap: 16,
  },
  workoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 16,
  },
  workoutInfo: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  levelText: {
    color: PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    lineHeight: 24,
  },
  workoutMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: SUBTEXT_COLOR,
  },
  startButton: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  startButtonText: {
    color: BG_DARK,
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutImageContainer: {
    width: 120, // w-32 or w-40 equivalent
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
