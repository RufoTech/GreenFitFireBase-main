import { MaterialIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  mainImage: string;
  reps?: string;
  sets?: string;
  type?: string;
}

import { useFocusEffect } from 'expo-router';
import { SelectionStore } from '../utils/SelectionStore';

export default function CreateCustomWorkoutScreen() {
  const router = useRouter();
  
  const [programName, setProgramName] = useState('');
  const [duration, setDuration] = useState('');
  const [equipment, setEquipment] = useState('');
  const [targetMuscle, setTargetMuscle] = useState('');
  const [level, setLevel] = useState('');
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, right: number} | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Check for selected exercise when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const { data, action, targetId } = SelectionStore.getData();
      
      if (data && action) {
        // Standardize exercise object
        const newExercise: Exercise = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name,
          mainImage: data.mainImage || data.targetMuscleImage || 'https://via.placeholder.com/150',
          reps: '',
          sets: '',
          type: data.type || data.category || 'General'
        };

        if (action === 'add') {
          setExercises(prev => [...prev, newExercise]);
        } else if (action === 'replace' && targetId) {
          // Keep the ID of the exercise being replaced if you want, or generate new. 
          // If we want to replace the slot, better keep the old ID or just replace the object.
          // Let's replace the object but keep the array structure.
          setExercises(prev => prev.map(ex => ex.id === targetId ? { ...newExercise, id: targetId } : ex));
        }
        
        // Clear store
        SelectionStore.clear();
      }
    }, [])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const toggleDropdown = (id: string, event: any) => {
    if (visibleDropdown === id) {
      closeDropdown();
    } else {
      const { pageY } = event.nativeEvent;
      // Adjust slightly to place below finger
      setDropdownPosition({ top: pageY + 10, right: 16 });
      setVisibleDropdown(id);
    }
  };

  const closeDropdown = () => {
    setVisibleDropdown(null);
  };

  const handleReplace = (id: string) => {
    // Delay closing to allow touch to register
    requestAnimationFrame(() => {
      closeDropdown();
      router.push({
        pathname: '/screens/WorkoutLibraryScreen',
        params: { 
          selectionMode: 'true',
          returnTo: '/screens/CreateCustomWorkoutScreen',
          replaceId: id
        }
      });
    });
  };

  const handleDelete = (id: string) => {
    requestAnimationFrame(() => {
      closeDropdown();
      setExercises(prev => prev.filter(ex => ex.id !== id));
    });
  };

  const handleAddExercise = () => {
    router.push({
      pathname: '/screens/WorkoutLibraryScreen',
      params: { 
        selectionMode: 'true',
        returnTo: '/screens/CreateCustomWorkoutScreen'
      }
    });
  };

  const handleUpdateExercise = (id: string, field: 'sets' | 'reps', value: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handlePublish = async () => {
    if (!programName.trim()) {
      Alert.alert("Error", "Please enter a program name.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise.");
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to create a workout.");
        return;
      }
      const userId = user.uid;
      
      // Save to new customUserWorkouts collection as requested
      await firestore().collection('customUserWorkouts').add({
        userId,
        title: programName,
        level: level || 'Custom', 
        target: targetMuscle || 'Full Body',
        equipment: equipment || 'None',
        exerciseCount: exercises.length,
        duration: duration || `${exercises.length * 5}`, 
        image: coverImage || 'https://via.placeholder.com/300', 
        exercises: exercises,
        createdAt: firestore.FieldValue.serverTimestamp(),
        isCustom: true
      });

      // Keep saving to saved_workouts if needed for library, or remove if redundancy is not wanted.
      // For now, I will remove saving to 'saved_workouts' to strictly follow the new instruction about 'customUserWorkouts'.
      
      Alert.alert("Success", "Program created successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error saving program:", error);
      Alert.alert("Error", "Failed to save program.");
    }
  };

  const handleDurationChange = (text: string) => {
    // Only allow numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setDuration(numericValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#12140a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Create Custom Program</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Program Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Details</Text>
          
          <TouchableOpacity style={styles.addImageContainer} onPress={pickImage}>
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <View style={styles.addImagePlaceholder}>
                <MaterialIcons name="add-photo-alternate" size={32} color="#ccff00" />
                <Text style={styles.addImageText}>Add Cover Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>DURATION (MIN)</Text>
              <TextInput
                style={styles.input}
                placeholder="45"
                placeholderTextColor="#64748b"
                value={duration}
                onChangeText={handleDurationChange}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>TARGET MUSCLE</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Body"
                placeholderTextColor="#64748b"
                value={targetMuscle}
                onChangeText={setTargetMuscle}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EQUIPMENT NEEDED</Text>
            <TextInput
              style={styles.input}
              placeholder="Dumbbells, Bench"
              placeholderTextColor="#64748b"
              value={equipment}
              onChangeText={setEquipment}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>LEVEL</Text>
            <TextInput
              style={styles.input}
              placeholder="Beginner, Intermediate, Advanced"
              placeholderTextColor="#64748b"
              value={level}
              onChangeText={setLevel}
            />
          </View>
        </View>

        {/* Workout Builder Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workout Builder</Text>
          </View>

          {/* Day 1 Card */}
          <View style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayTitleContainer}>
                <MaterialIcons name="drag-indicator" size={24} color="#94a3b8" />
                <TextInput
                  style={styles.dayTitleInput}
                  placeholder="Program Name (e.g. Upper Body)"
                  placeholderTextColor="#64748b"
                  value={programName}
                  onChangeText={setProgramName}
                />
              </View>
            </View>

            <View style={styles.dayContent}>
              {exercises.length === 0 ? (
                <Text style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>
                  No exercises added yet. Tap "Add Exercise" to start.
                </Text>
              ) : (
                exercises.map((exercise, index) => (
                  <View 
                    key={exercise.id} 
                    style={styles.exerciseItem}
                  >
                    <MaterialIcons name="drag-handle" size={24} color="#64748b" />
                    <View style={styles.exerciseImageContainer}>
                      <Image 
                        source={{ uri: exercise.mainImage }} 
                        style={styles.exerciseImage} 
                      />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View style={styles.setsRepsContainer}>
                        <View style={styles.setRepInputContainer}>
                          <TextInput
                            style={styles.setRepInput}
                            value={exercise.sets}
                            onChangeText={(val) => handleUpdateExercise(exercise.id, 'sets', val)}
                            keyboardType="numeric"
                            placeholder="-"
                            placeholderTextColor="#64748b"
                          />
                          <Text style={styles.setRepLabel}>Sets</Text>
                        </View>
                        <Text style={styles.xDivider}>×</Text>
                        <View style={styles.setRepInputContainer}>
                          <TextInput
                            style={styles.setRepInput}
                            value={exercise.reps}
                            onChangeText={(val) => handleUpdateExercise(exercise.id, 'reps', val)}
                            keyboardType="numeric"
                            placeholder="-"
                            placeholderTextColor="#64748b"
                          />
                          <Text style={styles.setRepLabel}>Reps</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ position: 'relative' }}>
                      <TouchableOpacity onPress={(e) => toggleDropdown(exercise.id, e)}>
                        <MaterialIcons name="more-vert" size={24} color="#94a3b8" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}

              <TouchableOpacity 
                style={styles.addExerciseButton}
                onPress={handleAddExercise}
              >
                <MaterialIcons name="add-circle-outline" size={20} color="#64748b" />
                <Text style={styles.addExerciseText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Close Dropdown Overlay */}
      {visibleDropdown && (
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.dropdownOverlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Global Dropdown Menu */}
      {visibleDropdown && dropdownPosition && (
        <View style={[styles.dropdownMenu, { top: dropdownPosition.top, right: dropdownPosition.right }]}>
          <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => visibleDropdown && handleReplace(visibleDropdown)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="loop" size={20} color="#f1f5f9" />
            <Text style={styles.dropdownText}>Replace</Text>
          </TouchableOpacity>
          <View style={styles.dropdownDivider} />
          <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => visibleDropdown && handleDelete(visibleDropdown)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
            <Text style={[styles.dropdownText, { color: '#ef4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Actions */}
      <LinearGradient
        colors={['transparent', '#12140a']}
        style={styles.bottomActionsContainer}
        pointerEvents="box-none"
      >
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.draftButton}>
            <Text style={styles.draftButtonText}>Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishButtonText}>Publish Program</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12140a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204, 255, 0, 0.1)',
    backgroundColor: 'rgba(18, 20, 10, 0.8)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ccff00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  addImageContainer: {
    height: 180,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    borderStyle: 'dashed',
  },
  addImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  addImageText: {
    color: '#ccff00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f1f5f9',
    fontSize: 16,
  },
  dayCard: {
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
    overflow: 'visible', // Changed to visible for dropdown
    marginBottom: 16,
    zIndex: 1,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(204, 255, 0, 0.1)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayTitleInput: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    padding: 0,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  dayContent: {
    padding: 16,
    gap: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(18, 20, 10, 0.9)', // More opaque for dropdown readability
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
    position: 'relative',
  },
  exerciseImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  exerciseDetails: {
    color: '#94a3b8',
    fontSize: 12,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 4,
  },
  addExerciseText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomActionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 40,
    zIndex: 2000,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 20, 10, 0.8)',
  },
  draftButtonText: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  publishButton: {
    flex: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#ccff00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ccff00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  publishButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  setsRepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  setRepInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  setRepInput: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'center',
    padding: 0,
  },
  setRepLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 4,
  },
  xDivider: {
    color: '#64748b',
    fontSize: 14,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 36, // Slightly lower to not overlap with button
    backgroundColor: '#1d2012',
    borderRadius: 12, // More rounded
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: 150, // Slightly wider
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 }, // Deeper shadow
    shadowOpacity: 0.5, // Darker shadow
    shadowRadius: 12,
    elevation: 10,
    zIndex: 2000,
    paddingVertical: 4, // Add vertical padding
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // More gap
    paddingVertical: 14, // Taller touch area
    paddingHorizontal: 16,
  },
  dropdownText: {
    color: '#f1f5f9',
    fontSize: 15, // Larger text
    fontWeight: '500',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8, // Inset divider
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 900,
  }
});
