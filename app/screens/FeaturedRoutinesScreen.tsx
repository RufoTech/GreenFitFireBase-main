import React, { useState, useEffect, useCallback } from 'react';
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
  ImageBackground,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

// Theme Colors
const PRIMARY = "#ccff00";
const BACKGROUND_LIGHT = "#f8f8f5";
const BACKGROUND_DARK = "#12140a";
const SURFACE_DARK = "#1d2012";
const ACCENT_DARK = "#2a2e1a";
const TEXT_LIGHT = "#0f172a";
const TEXT_DARK = "#f1f5f9";
const TEXT_MUTED_DARK = "#94a3b8";

interface Workout {
  id: string;
  title: string;
  duration: string;
  exercises: number;
  level: string;
  levelColor: string;
  image: string;
  category: string;
  targetMuscle?: string;
}

const categories = ["All"]; // Default, will be populated dynamically

export default function FeaturedRoutinesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState(categories);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const unsubscribe = firestore()
        .collection('workout_programs')
        .onSnapshot(querySnapshot => {
          const workoutsData: Workout[] = [];
          const fetchedCategories = new Set<string>();
          
          querySnapshot.forEach(documentSnapshot => {
            const data = documentSnapshot.data();
            
            // Map level color based on level text
            let levelColor = PRIMARY; // Default Green
            const levelLower = (data.level || '').toLowerCase();
            if (levelLower.includes('beginner')) levelColor = '#3b82f6'; // Blue
            else if (levelLower.includes('advanced')) levelColor = '#ef4444'; // Red

            if (data.workout_type_name) {
                fetchedCategories.add(data.workout_type_name);
            }
            
            workoutsData.push({
              id: documentSnapshot.id,
              title: data.name || 'Untitled Workout',
              duration: data.duration ? (data.duration.includes('min') ? data.duration : `${data.duration} mins`) : '0 mins',
              exercises: data.exercises ? data.exercises.length : 0, 
              level: data.level || 'General',
              levelColor: levelColor,
              image: data.coverImage || 'https://via.placeholder.com/300', 
              category: data.workout_type_name || 'General', 
              targetMuscle: data.targetMuscles ? data.targetMuscles.join(', ') : 'Full Body'
            });
          });

          // Update Categories
          const newCategories = ["All", ...Array.from(fetchedCategories)];
          setCategoryList(newCategories);

          setWorkouts(workoutsData);
          setLoading(false);
        }, error => {
          console.error("Error fetching workouts: ", error);
          setLoading(false);
        });

      return () => unsubscribe();
    }, [])
  );

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                            (workout.category && workout.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                            (workout.targetMuscle && workout.targetMuscle.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_DARK} />
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Featured Routines</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color={TEXT_MUTED_DARK} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises or routines"
            placeholderTextColor={TEXT_MUTED_DARK}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categoryList.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                selectedCategory === cat ? styles.categoryChipActive : styles.categoryChipInactive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat ? styles.categoryTextActive : styles.categoryTextInactive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 20 }} />
        ) : (
          filteredWorkouts.map((workout) => (
            <View key={workout.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <ImageBackground source={{ uri: workout.image }} style={styles.cardImage}>
                  <LinearGradient
                    colors={['rgba(18, 20, 10, 0.8)', 'transparent', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.levelBadgeContainer}>
                     <View style={[styles.levelBadge, { backgroundColor: workout.levelColor }]}>
                       <Text style={styles.levelText}>{workout.level}</Text>
                     </View>
                  </View>
                </ImageBackground>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{workout.title}</Text>
                </View>
                
                <View style={styles.metaContainer}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="fitness-center" size={16} color={PRIMARY} />
                    <Text style={styles.metaText}>{workout.targetMuscle || 'Full Body'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="schedule" size={16} color={PRIMARY} />
                    <Text style={styles.metaText}>{workout.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="list-alt" size={16} color={PRIMARY} />
                    <Text style={styles.metaText}>{workout.exercises} Exercises</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => router.push({
                    pathname: '/screens/WorkoutDetailsScreen',
                    params: { 
                      id: workout.id,
                      isCustom: 'false'
                    }
                  })}
                >
                  <Text style={styles.startButtonText}>Start Workout</Text>
                  <MaterialIcons name="play-circle-filled" size={20} color={BACKGROUND_DARK} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingVertical: 16,
    backgroundColor: 'rgba(18, 20, 10, 0.8)',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_DARK,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: TEXT_DARK,
    fontSize: 14,
    height: '100%',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: PRIMARY,
  },
  categoryChipInactive: {
    backgroundColor: SURFACE_DARK,
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
  listContent: {
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: SURFACE_DARK,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: ACCENT_DARK,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  levelBadgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: BACKGROUND_DARK,
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 20,
    gap: 12,
  },
  cardHeader: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_DARK,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_MUTED_DARK,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BACKGROUND_DARK,
  },
});
