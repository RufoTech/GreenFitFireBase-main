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
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

// Theme Colors
const PRIMARY = "#ccff00";
const BACKGROUND_LIGHT = "#f8f8f5";
const BACKGROUND_DARK = "#12140a";
const SURFACE_DARK = "#1d2012";
const ACCENT_DARK = "#2a2e1a";
const TEXT_LIGHT = "#0f172a"; // slate-900
const TEXT_DARK = "#f1f5f9"; // slate-100
const TEXT_MUTED_LIGHT = "#64748b"; // slate-500
const TEXT_MUTED_DARK = "#94a3b8"; // slate-400

interface MuscleGroup {
  name: string;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  muscleGroups: MuscleGroup[];
  mainImage: string;
  videoUrl?: string;
  reps?: string;
  sets?: string;
  isMulti?: boolean; // Optional, derived or from DB
}

import { SelectionStore } from '../utils/SelectionStore';

export default function WorkoutLibraryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  
  // Parse parameters
  const params = useLocalSearchParams();
  const selectionMode = params.selectionMode === 'true';
  const returnScreen = params.returnTo as string;
  const replaceId = params.replaceId as string;

  const handleSelect = (exercise: Workout) => {
    if (selectionMode && returnScreen) {
      SelectionStore.setData(exercise, replaceId ? 'replace' : 'add', replaceId);
      router.back();
    }
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('workouts')
      .onSnapshot(querySnapshot => {
        const fetchedWorkouts: Workout[] = [];
        const fetchedCategories = new Set<string>(["All"]);

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const workout: Workout = {
            id: doc.id,
            name: data.name || 'Untitled Workout',
            type: data.type || 'General',
            muscleGroups: data.muscleGroups || [],
            mainImage: data.mainImage || 'https://via.placeholder.com/150',
            videoUrl: data.videoUrl || '',
            reps: data.reps || '-',
            sets: data.sets || '-',
            isMulti: false // You might want to calculate this or fetch it if exists
          };
          fetchedWorkouts.push(workout);

          if (workout.type) {
            fetchedCategories.add(workout.type);
          }
        });

        setWorkouts(fetchedWorkouts);
        // Sort categories to have specific order if needed, or just alphabetical after 'All'
        const sortedCategories = Array.from(fetchedCategories).sort((a, b) => {
            if (a === 'All') return -1;
            if (b === 'All') return 1;
            return a.localeCompare(b);
        });
        setCategories(sortedCategories);
        setLoading(false);
      }, error => {
        console.error("Error fetching workouts:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const filteredWorkouts = workouts.filter(workout => {
    const matchesCategory = selectedCategory === "All" || workout.type === selectedCategory;
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_DARK} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Library</Text>
        <View style={{ width: 48 }} /> 
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <MaterialIcons name="search" size={24} color={PRIMARY} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                cat === selectedCategory 
                  ? styles.categoryChipActive 
                  : styles.categoryChipInactive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                cat === selectedCategory 
                  ? styles.categoryTextActive 
                  : styles.categoryTextInactive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        <Text style={styles.resultsText}>{filteredWorkouts.length} Results</Text>
      </View>

      {/* Exercise List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {loading ? (
           <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 20 }} />
        ) : (
            <View style={styles.exerciseList}>
            {filteredWorkouts.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                    <View style={styles.titleRow}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        {exercise.isMulti && (
                        <View style={styles.multiBadge}>
                            <Text style={styles.multiText}>MULTI</Text>
                        </View>
                        )}
                    </View>
                    <Text style={styles.targetLabel}>TARGET</Text>
                    <Text style={styles.targetText}>
                        {exercise.muscleGroups && exercise.muscleGroups.length > 0 
                            ? exercise.muscleGroups.map(m => m.name).join(', ') 
                            : 'General'}
                    </Text>
                    </View>
                    
                    {selectionMode ? (
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => handleSelect(exercise)}
                      >
                        <MaterialIcons name="add" size={24} color={BACKGROUND_DARK} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        style={styles.viewDetailsButton}
                        onPress={() => {
                          const exerciseData = {
                            name: exercise.name,
                            category: exercise.type,
                            videoUrl: exercise.videoUrl,
                            reps: exercise.reps,
                            sets: exercise.sets,
                            targetMuscleImage: exercise.mainImage,
                            muscleNames: exercise.muscleGroups.map(m => m.name)
                          };
                          router.push({
                            pathname: '/screens/ExerciseDetailScreen',
                            params: { exercise: JSON.stringify(exerciseData) }
                          });
                        }}
                      >
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <MaterialIcons name="chevron-right" size={18} color={PRIMARY} />
                      </TouchableOpacity>
                    )}
                </View>

                <View style={styles.imageContainer}>
                    <Image 
                    source={{ uri: exercise.mainImage }} 
                    style={styles.exerciseImage}
                    />
                </View>
                </View>
            ))}
            </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={32} color={BACKGROUND_DARK} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_DARK,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BACKGROUND_DARK,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textAlign: 'center',
    flex: 1,
    marginRight: 48, // Balance the back button
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_DARK,
    borderRadius: 12,
    height: 56,
    borderWidth: 1,
    borderColor: ACCENT_DARK,
  },
  searchIcon: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: TEXT_DARK,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  categoryChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipInactive: {
    backgroundColor: SURFACE_DARK,
    borderColor: ACCENT_DARK,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: BACKGROUND_DARK,
  },
  categoryTextInactive: {
    color: TEXT_DARK,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  exerciseList: {
    gap: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: SURFACE_DARK,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: ACCENT_DARK,
    gap: 16,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 16,
  },
  cardHeader: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  multiBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  multiText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: PRIMARY,
    textTransform: 'uppercase',
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_MUTED_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  targetText: {
    fontSize: 14,
    color: '#cbd5e1', // slate-300
  },
  addButton: {
    backgroundColor: PRIMARY,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_DARK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
    height: 36,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },
  imageContainer: {
    width: 120, // w-32 or w-40 equivalent
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
