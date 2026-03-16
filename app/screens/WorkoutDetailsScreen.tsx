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
  ImageBackground,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

// Define types for fetched data
interface Exercise {
  id: string;
  name: string;
  sets: string | number;
  reps: string | number;
  image?: string;
  muscles?: string[];
  category?: string;
  videoUrl?: string;
  targetMuscleImage?: string;
  muscleNames?: string[];
  instructions?: string;
}

interface WorkoutDetails {
  id: string;
  title: string;
  level: string;
  duration: string;
  equipment: string;
  target: string;
  image: string;
  exercises: Exercise[];
}

export default function WorkoutDetailsScreen() {
  const router = useRouter();
  const { id, isCustom } = useLocalSearchParams();
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Check if workout is already saved for current user (mocked ID for now)
    const user = auth().currentUser;
    if (!user) return;
    const userId = user.uid;

    const checkSavedStatus = async () => {
       try {
         const snapshot = await firestore()
           .collection('saved_workouts')
           .where('originalId', '==', String(id))
           .where('userId', '==', userId)
           .limit(1)
           .get();

         if (!snapshot.empty) {
            setIsSaved(true);
            setSavedDocId(snapshot.docs[0].id);
         } else {
            setIsSaved(false);
            setSavedDocId(null);
         }
       } catch (err) {
         console.error("Error checking saved status:", err);
       }
    };

    const fetchWorkoutDetails = async () => {
      try {
        let data: any;
        let docId = String(id);

        if (isCustom === 'true') {
             // Fetch from customUserWorkouts collection
             const customDoc = await firestore().collection('customUserWorkouts').doc(docId).get();
             if (customDoc.exists) {
                 data = customDoc.data();
                 
                 // Map custom exercises to component format using Promise.all for async videoUrl fetch
                 const exercisesData = await Promise.all((data.exercises || []).map(async (ex: any, index: number) => {
                     let videoUrl = ex.videoUrl || '';
                     if (!videoUrl) {
                        try {
                            const snapshot = await firestore().collection('workouts').where('name', '==', ex.name).limit(1).get();
                            if (!snapshot.empty) {
                                videoUrl = snapshot.docs[0].data().videoUrl || '';
                            }
                        } catch (e) { console.log('Error fetching videoUrl', e); }
                     }

                     return {
                        id: ex.id || `ex-${index}`,
                        name: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        image: ex.mainImage || ex.image || 'https://via.placeholder.com/150',
                        category: ex.type || ex.category || 'General',
                        videoUrl: videoUrl,
                        targetMuscleImage: ex.targetMuscleImage || ex.mainImage || '',
                        muscleNames: ex.muscleNames || ex.muscles || [],
                        instructions: ex.instructions || ''
                     };
                 }));

                 setWorkout({
                     id: customDoc.id,
                     title: data.title,
                     level: data.level,
                     duration: data.duration.includes('min') ? data.duration : `${data.duration} min`, 
                     equipment: data.equipment,
                     target: data.target,
                     image: data.image,
                     exercises: exercisesData
                 });
             }
         } else {
            const workoutDoc = await firestore().collection('workout_programs').doc(docId).get();
            if (workoutDoc.exists) {
              data = workoutDoc.data();
              // ... existing logic for system workouts ...
              // Process exercises array
              const exercisePromises = (data?.exercises || []).map(async (exercise: any, index: number) => {
                 let imageUrl = 'https://via.placeholder.com/150';
                 let videoUrl = '';
                 let targetMuscleImage = '';
                 let muscleNames: string[] = [];
                 let instructions = '';
                 
                 try {
                    const workoutQuery = await firestore()
                      .collection('workouts')
                      .where('name', '==', exercise.name)
                      .limit(1)
                      .get();
                    
                    if (!workoutQuery.empty) {
                       const workoutData = workoutQuery.docs[0].data();
                       imageUrl = workoutData.mainImage || workoutData.imageUrl || imageUrl;
                       videoUrl = workoutData.videoUrl || '';
                       instructions = workoutData.instructions || '';
                       
                       if (workoutData.muscleGroups && Array.isArray(workoutData.muscleGroups)) {
                          if (workoutData.muscleGroups.length > 0) {
                              targetMuscleImage = workoutData.muscleGroups[0].imageUrl || '';
                          }
                          muscleNames = workoutData.muscleGroups.map((mg: any) => mg.name).filter(Boolean);
                       }
                    }
                 } catch (err) {
                    console.log(`Error fetching image for exercise ${exercise.name}:`, err);
                 }
    
                 return {
                   id: `ex-${index}`,
                   name: exercise.name || 'Unknown Exercise',
                   sets: exercise.sets || '0',
                   reps: exercise.reps || '0',
                   category: exercise.category,
                   image: imageUrl,
                   muscles: muscleNames,
                   videoUrl,
                   targetMuscleImage,
                   muscleNames,
                   instructions
                 };
              });
    
              const exercisesData = await Promise.all(exercisePromises);
    
              // Parse equipment and target arrays
              const equipment = Array.isArray(data?.equipment) ? data.equipment.join(', ') : (data?.equipment || 'None');
              const target = Array.isArray(data?.targetMuscles) ? data.targetMuscles.join(', ') : (data?.targetMuscles || 'General');
    
              setWorkout({
                id: workoutDoc.id,
                title: data?.name || 'Untitled Workout',
                level: data?.level || 'General',
                duration: data?.duration || '0 min',
                equipment: equipment,
                target: target,
                image: data?.coverImage || 'https://via.placeholder.com/300',
                exercises: exercisesData
              });
            }
        }
      } catch (error) {
        console.error("Error fetching workout details:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSavedStatus();
    fetchWorkoutDetails();
  }, [id, isCustom]);

  const handleToggleLibrary = async () => {
    if (!workout) return;

    // Use current user ID (mocked for now)
    const user = auth().currentUser;
    if (!user) {
        alert("Please log in to save workouts.");
        return;
    }
    const userId = user.uid;

    try {
      if (isSaved && savedDocId) {
        // Remove from library
        await firestore().collection('saved_workouts').doc(savedDocId).delete();
        setIsSaved(false);
        setSavedDocId(null);
        alert('Workout removed from library!');
      } else {
        // Save to library with userId
        const savedWorkout = {
            userId: userId, // Associate with user
            originalId: id,
            title: workout.title,
            level: workout.level,
            target: workout.target,
            exerciseCount: workout.exercises.length,
            duration: workout.duration.replace(' min', ''),
            image: workout.image,
            savedAt: firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await firestore().collection('saved_workouts').add(savedWorkout);
        setIsSaved(true);
        setSavedDocId(docRef.id);
        alert('Workout saved to library!');
      }
    } catch (error) {
      console.error("Error toggling library status:", error);
      alert('Operation failed.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
        <ActivityIndicator size="large" color="#ccff00" />
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
        <Text style={{ color: '#f1f5f9', fontSize: 18 }}>Workout not found</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
             <Text style={{ color: '#ccff00', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Back Button Overlay - Fixed Position */}
      <TouchableOpacity 
        style={styles.backButtonOverlay}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: workout.image }}
            style={styles.heroImage}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(31, 35, 15, 0.8)']}
              style={styles.heroOverlay}
            />

            <View style={styles.heroContent}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{workout.level}</Text>
              </View>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.addToDayButton}>
            <Text style={styles.addToDayText}>Add to Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveToLibraryButton, isSaved && styles.savedButton]}
            onPress={handleToggleLibrary}
          >
            <Text style={[styles.saveToLibraryText, isSaved && styles.savedButtonText]}>
                {isSaved ? 'Remove from Library' : 'Save to Library'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Workout Summary Info */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <MaterialIcons name="schedule" size={24} color="#ccff00" style={styles.summaryIcon} />
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{workout.duration}</Text>
          </View>
          <View style={[styles.summaryItem, styles.summaryBorder]}>
            <MaterialIcons name="fitness-center" size={24} color="#ccff00" style={styles.summaryIcon} />
            <Text style={styles.summaryLabel}>Equipment</Text>
            <Text style={styles.summaryValue}>{workout.equipment}</Text>
          </View>
          <View style={styles.summaryItem}>
            <MaterialIcons name="adjust" size={24} color="#ccff00" style={styles.summaryIcon} />
            <Text style={styles.summaryLabel}>Target</Text>
            <Text style={styles.summaryValue}>{workout.target}</Text>
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.exercisesContainer}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.exercisesTitle}>Exercises ({workout.exercises.length})</Text>
            <TouchableOpacity>
              <Text style={styles.previewAllText}>Preview All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.exercisesList}>
            {workout.exercises.map((exercise, index) => (
              <TouchableOpacity 
                key={exercise.id} 
                style={styles.exerciseItem}
                onPress={() => router.push({
                  pathname: '/screens/ExerciseDetailScreen',
                  params: {
                    exercise: JSON.stringify(exercise)
                  }
                })}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseImageContainer}>
                  <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
                </View>
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseSets}>{exercise.sets} Sets • {exercise.reps} Reps</Text>
                  {/* Muscles container removed as data is not available from source */}
                </View>
                <MaterialIcons name="drag-indicator" size={24} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f230f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#1f230f',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroContainer: {
    padding: 16,
    paddingBottom: 12,
  },
  heroImage: {
    width: '100%',
    height: 320,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
  },
  heroContent: {
    padding: 24,
  },
  levelBadge: {
    backgroundColor: '#ccff00',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  levelText: {
    color: '#1f230f',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  workoutTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  addToDayButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#ccff00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ccff00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addToDayText: {
    color: '#1f230f',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveToLibraryButton: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveToLibraryText: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  savedButton: {
    backgroundColor: '#ccff00',
    borderWidth: 0,
  },
  savedButtonText: {
    color: '#1f230f',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryIcon: {
    marginBottom: 4,
    color: '#ccff00',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exercisesContainer: {
    paddingHorizontal: 16,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  previewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ccff00',
  },
  exercisesList: {
    gap: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d3319', // Lighter background color (lighter than #1f230f)
    borderRadius: 16, // Slightly rounder corners
    gap: 16,
    marginBottom: 8, // Add spacing between items
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)', // Subtle green border
  },
  exerciseImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  exerciseSets: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  musclesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  muscleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  muscleText: {
    fontSize: 10,
    color: '#f1f5f9',
  },
});
