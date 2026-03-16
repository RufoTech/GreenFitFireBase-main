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
  ImageBackground,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useCallback } from 'react';
import { SelectionStore } from '../utils/SelectionStore';

// Define Workout interface
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

const categories = [
  { id: 'all', label: 'All' },
];

export default function AddWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState(categories);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      // Fetch system workouts
      const unsubscribeSystem = firestore()
        .collection('workout_programs')
        .onSnapshot(querySnapshot => {
          const workoutsData: Workout[] = [];
          const fetchedCategories = new Set<string>();
          
          querySnapshot.forEach(documentSnapshot => {
            const data = documentSnapshot.data();
            
            // Map level color based on level text
            let levelColor = '#ccff00'; // Default Green
            const levelLower = (data.level || '').toLowerCase();
            if (levelLower.includes('beginner')) levelColor = '#3b82f6'; // Blue
            else if (levelLower.includes('advanced')) levelColor = '#ef4444'; // Red
            
            if (data.workout_type_name) {
              fetchedCategories.add(data.workout_type_name);
            }

            workoutsData.push({
              id: documentSnapshot.id,
              title: data.name || 'Untitled Workout',
              duration: data.duration || '0',
              exercises: data.exercises ? data.exercises.length : 0, 
              level: data.level || 'General',
              levelColor: levelColor,
              image: data.coverImage || 'https://via.placeholder.com/300', 
              category: data.workout_type_name || 'General', 
              targetMuscle: data.targetMuscles ? data.targetMuscles.join(', ') : 'Full Body'
            });
          });

          // Also fetch custom user workouts
          const user = auth().currentUser;
          if (user) {
            firestore()
              .collection('customUserWorkouts')
              .where('userId', '==', user.uid)
              .get()
              .then(customSnapshot => {
                customSnapshot.forEach(doc => {
                  const data = doc.data();
                  workoutsData.push({
                    id: doc.id,
                    title: data.title || 'Custom Workout',
                    duration: data.duration || '0',
                    exercises: data.exerciseCount || 0,
                    level: data.level || 'Custom',
                    levelColor: '#a855f7', // Purple for custom
                    image: data.image || 'https://via.placeholder.com/300',
                    category: 'Custom',
                    targetMuscle: data.target || 'Full Body'
                  });
                  fetchedCategories.add('Custom');
                });
    
                // Update state
                updateWorkoutsState(fetchedCategories, workoutsData);
              })
              .catch(error => {
                console.error("Error fetching custom workouts: ", error);
                updateWorkoutsState(fetchedCategories, workoutsData);
              });
          } else {
              // Update state even if no user, just with system workouts
              updateWorkoutsState(fetchedCategories, workoutsData);
          }

        }, error => {
          console.error("Error fetching workouts: ", error);
          setLoading(false);
        });

      return () => unsubscribeSystem();
    }, [])
  );

  const updateWorkoutsState = (fetchedCategories: Set<string>, workoutsData: Workout[]) => {
    const newCategories = [
      { id: 'all', label: 'All' },
      ...Array.from(fetchedCategories).map(cat => ({
        id: cat,
        label: cat
      }))
    ];
    
    setCategoryList(newCategories);
    setWorkouts(workoutsData);
    setLoading(false);
  };

  const handleAddWorkout = (workout: Workout) => {
    if (params.selectionMode === 'true') {
      SelectionStore.setData(
        {
          id: workout.id,
          title: workout.title,
          subtitle: `${workout.exercises} exercises • ${workout.duration} Min`,
          images: [workout.image],
          extraCount: 0,
        },
        'add',
        'program_workout'
      );
      router.back();
    } else {
        // Default behavior (if any)
        router.back();
    }
  };

  const handleDeleteCustomWorkout = async (workoutId: string, event: any) => {
    event.stopPropagation(); // Prevent navigation to details
    
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this custom workout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('customUserWorkouts').doc(workoutId).delete();
              // State update will happen automatically via onSnapshot listener if we had one,
              // but here we fetched once. So we need to manually update state or re-fetch.
              // Since we are using a mix of snapshot (system) and get (custom), let's manually filter.
              setWorkouts(prev => prev.filter(w => w.id !== workoutId));
            } catch (error) {
              console.error("Error deleting workout:", error);
              Alert.alert("Error", "Failed to delete workout.");
            }
          }
        }
      ]
    );
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                            (workout.category && workout.category.toLowerCase().includes(selectedCategory.toLowerCase())); // Simple category matching
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1f230f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Workout</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={24} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {categoryList.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id ? styles.categoryChipSelected : styles.categoryChipUnselected
              ]}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat.id ? styles.categoryTextSelected : styles.categoryTextUnselected
              ]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Workout List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
         {/* Create Custom Workout Button - Moved inside ScrollView so it scrolls along with the workout cards. */}
         
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <TouchableOpacity 
          style={styles.createCustomButton}
          activeOpacity={0.8}
          onPress={() => router.push('/screens/CreateCustomWorkoutScreen')} 
        >
          <LinearGradient
            colors={['#ccff00', '#99cc00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createCustomGradient}
          >
            <View style={styles.createCustomContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="add" size={24} color="#1f230f" />
              </View>
              <View>
                <Text style={styles.createCustomTitle}>Create Custom Workout</Text>
                <Text style={styles.createCustomSubtitle}>Design your own routine from scratch</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#1f230f" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ccff00" style={{ marginTop: 20 }} />
        ) : (
          filteredWorkouts.map((workout) => {
            const isNoImage = workout.category === 'Custom' && (!workout.image || workout.image === 'https://via.placeholder.com/300');

            if (isNoImage) {
              return (
                <TouchableOpacity 
                  key={workout.id} 
                  activeOpacity={0.9}
                  style={styles.noImageCard}
                  onPress={() => router.push({
                    pathname: '/screens/WorkoutDetailsScreen',
                    params: { 
                      id: workout.id,
                      isCustom: workout.category === 'Custom' ? 'true' : 'false'
                    }
                  })}
                >
                  {/* Header Section */}
                  <View style={styles.noImageHeader}>
                    <View style={styles.noImageHeaderLeft}>
                      <Text style={[styles.noImageLevelText, { color: workout.levelColor || '#ccff00' }]}>
                        {workout.level}
                      </Text>
                      <Text style={styles.noImageTitle}>{workout.title}</Text>
                    </View>
                    {workout.category === 'Custom' && (
                      <TouchableOpacity 
                        style={styles.noImageDeleteButton}
                        onPress={(e) => handleDeleteCustomWorkout(workout.id, e)}
                      >
                        <MaterialIcons name="delete" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Details Section */}
                  <View style={styles.noImageDetailsRow}>
                    <View style={styles.noImageDetailItem}>
                      <MaterialIcons name="fitness-center" size={16} color="#ccff00" />
                      <Text style={styles.noImageDetailText}>{workout.targetMuscle || 'Full Body'}</Text>
                    </View>
                    <View style={styles.noImageDetailItem}>
                      <MaterialIcons name="schedule" size={16} color="#ccff00" />
                      <Text style={styles.noImageDetailText}>{workout.duration} mins</Text>
                    </View>
                    <View style={styles.noImageDetailItem}>
                      <MaterialIcons name="list-alt" size={16} color="#ccff00" />
                      <Text style={styles.noImageDetailText}>{workout.exercises} Exercises</Text>
                    </View>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -35 }}>
                     <TouchableOpacity 
                      style={styles.addButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddWorkout(workout);
                      }}
                    >
                      <MaterialIcons name="add" size={24} color="#1f230f" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity 
                key={workout.id} 
                activeOpacity={0.9}
                style={styles.card}
                onPress={() => router.push({
                  pathname: '/screens/WorkoutDetailsScreen',
                  params: { 
                    id: workout.id,
                    isCustom: workout.category === 'Custom' ? 'true' : 'false'
                  }
                })}
              >
                <ImageBackground
                  source={{ uri: workout.image }}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.cardOverlay}
                  />
                  <View style={[styles.levelBadge, { backgroundColor: workout.levelColor }]}>
                    <Text style={styles.levelText}>{workout.level}</Text>
                  </View>

                  {/* Delete Button for Custom Workouts */}
                  {workout.category === 'Custom' && (
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={(e) => handleDeleteCustomWorkout(workout.id, e)}
                    >
                      <MaterialIcons name="delete" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </ImageBackground>
                
                <View style={styles.cardFooter}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{workout.title}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="schedule" size={14} color="#ccff00" />
                        <Text style={styles.metaText}>{workout.duration} Min</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="fitness-center" size={14} color="#ccff00" />
                        <Text style={styles.metaText}>{workout.exercises} exercises</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="accessibility" size={14} color="#ccff00" />
                        <Text style={styles.metaText}>{workout.targetMuscle || 'Full Body'}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddWorkout(workout);
                    }}
                  >
                    <MaterialIcons name="add" size={24} color="#1f230f" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(31, 35, 15, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneButton: {
    color: '#ccff00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#f1f5f9',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  createCustomButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createCustomGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  createCustomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 35, 15, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCustomTitle: {
    color: '#1f230f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createCustomSubtitle: {
    color: 'rgba(31, 35, 15, 0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryChipSelected: {
    backgroundColor: '#ccff00',
    borderColor: '#ccff00',
  },
  categoryChipUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#1f230f',
  },
  categoryTextUnselected: {
    color: '#f1f5f9',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  cardImage: {
    height: 160,
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#1f230f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  metaDot: {
    color: '#64748b',
    fontSize: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccff00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#2a2f16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noImageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  noImageHeaderLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  noImageLevelText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  noImageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    lineHeight: 24,
  },
  noImageDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 24,
    columnGap: 16,
    rowGap: 12,
  },
  noImageDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noImageDetailText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  noImageActionButton: {
    width: '100%',
    backgroundColor: '#ccff00',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 4,
  },
  noImageActionText: {
    color: '#12140a',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
