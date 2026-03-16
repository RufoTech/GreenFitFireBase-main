import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { SelectionStore } from '../utils/SelectionStore';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';

export default function CreateProgramScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [programName, setProgramName] = useState('');
  const [focus, setFocus] = useState('Gain Muscle');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successProgramName, setSuccessProgramName] = useState('');

  const [loading, setLoading] = useState(false);
  const weeks = [1, 2, 3, 4];

  // Initial workout data structure - organized by weeks
  const [workoutsByWeek, setWorkoutsByWeek] = useState<any>({
    1: [],
    2: [],
    3: [],
    4: []
  });

  // Fetch plans from Firestore when focus changes
  useEffect(() => {
    if (focus === 'Custom') {
      // Reset to empty for Custom
      setWorkoutsByWeek({
        1: [],
        2: [],
        3: [],
        4: []
      });
      return;
    }

    const fetchPlan = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore().collection('monthly_plans').get();
        let foundPlan = null;

        // Find the document that contains the plan for the selected focus
        for (const doc of snapshot.docs) {
          const data = doc.data();
          if (data.plan && data.plan[focus]) {
            foundPlan = data.plan[focus];
            break;
          }
        }

        if (foundPlan) {
          const newWorkoutsByWeek: any = { 1: [], 2: [], 3: [], 4: [] };

          Object.keys(foundPlan).forEach(weekKey => {
            // weekKey e.g., "Week 1"
            const weekNum = parseInt(weekKey.replace('Week ', ''));
            if (!isNaN(weekNum) && newWorkoutsByWeek[weekNum] !== undefined) {
              const weekData = foundPlan[weekKey];
              const weekWorkouts: any[] = [];

              Object.keys(weekData).forEach(dayKey => {
                // dayKey e.g., "Day 1"
                const dayNum = parseInt(dayKey.replace('Day ', ''));
                if (!isNaN(dayNum)) {
                  const dayData = weekData[dayKey];
                  
                  if (dayData.isRest) {
                    weekWorkouts.push({
                      id: Date.now() + Math.random(),
                      type: 'rest',
                      title: 'Rest Day',
                      subtitle: '',
                      day: dayNum,
                      images: [],
                      extraCount: 0
                    });
                  } else if (dayData.programs && dayData.programs.length > 0) {
                    const program = dayData.programs[0]; // Take the first program
                    weekWorkouts.push({
                      id: program.id || (Date.now() + Math.random()),
                      type: 'workout',
                      title: program.name,
                      subtitle: `${program.exercises?.length || 0} exercises • ${program.duration || 0} Min`,
                      day: dayNum,
                      images: program.coverImage ? [program.coverImage] : [],
                      extraCount: 0
                    });
                  }
                }
              });

              // Sort by day
              weekWorkouts.sort((a, b) => a.day - b.day);
              newWorkoutsByWeek[weekNum] = weekWorkouts;
            }
          });

          setWorkoutsByWeek(newWorkoutsByWeek);
        } else {
           // Plan not found, maybe clear or keep empty
           setWorkoutsByWeek({ 1: [], 2: [], 3: [], 4: [] });
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
        Alert.alert("Error", "Failed to load plan for this focus.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [focus]);

  // Get current week's workouts
  const currentWorkouts = workoutsByWeek[selectedWeek] || [];

  useFocusEffect(
    React.useCallback(() => {
      const { data, action, targetId } = SelectionStore.getData();
      
      if (data && action === 'add' && targetId === 'program_workout') {
        SelectionStore.clear();

        setWorkoutsByWeek((prev: any) => {
          const currentWeekWorkouts = prev[selectedWeek] ? [...prev[selectedWeek]] : [];
          const nextDay = currentWeekWorkouts.length + 1;
          
          const newWorkout = { 
            id: Date.now() + Math.random(), 
            type: 'workout', 
            title: data.title, 
            subtitle: data.subtitle, 
            day: nextDay, 
            images: data.images || [], 
            extraCount: data.extraCount || 0 
          };

          currentWeekWorkouts.push(newWorkout);

          return {
            ...prev,
            [selectedWeek]: currentWeekWorkouts
          };
        });
      }
    }, [selectedWeek])
  );
  const focusOptions = [
    { id: 'Gain Muscle', icon: 'fitness-center', iconLib: MaterialIcons, label: 'Gain Muscle' }, // exercise -> fitness-center (closest)
    { id: 'Lose Weight', icon: 'scale', iconLib: MaterialCommunityIcons, label: 'Lose Weight' }, // scale -> scale (MCI)
    { id: 'Get Fitter', icon: 'run', iconLib: MaterialCommunityIcons, label: 'Get Fitter' }, // directions_run -> run (MCI)
    { id: 'Get Stronger', icon: 'dumbbell', iconLib: MaterialCommunityIcons, label: 'Get Stronger' }, // fitness_center -> dumbbell (MCI)
    { id: 'Custom', icon: 'tune', iconLib: MaterialIcons, label: 'Custom' },
  ];

  const theme = {
    bg: isDark ? '#1f230f' : '#f8f8f5',
    text: isDark ? '#f1f5f9' : '#0f172a', // text-slate-100 : text-slate-900
    subtext: isDark ? '#94a3b8' : '#64748b', // text-slate-500
    primary: '#ccff00',
    cardBg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(204, 255, 0, 0.05)',
    cardBorder: isDark ? 'rgba(204, 255, 0, 0.2)' : 'rgba(204, 255, 0, 0.2)',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(204, 255, 0, 0.05)',
  };

  const handleSave = async () => {
    if (!programName.trim()) {
      Alert.alert('Error', 'Please enter a program name');
      return;
    }

    // Basic validation - check if there are any workouts added
    let hasWorkouts = false;
    Object.values(workoutsByWeek).forEach((weekWorkouts: any) => {
      if (weekWorkouts.length > 0) hasWorkouts = true;
    });

    if (!hasWorkouts) {
      Alert.alert('Error', 'Please add at least one workout to your program');
      return;
    }

    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save a program');
        setLoading(false);
        return;
      }

      let coverImage: string | null = null;
      let workoutCount = 0;
      let totalDuration = 0;
      for (const week of [1, 2, 3, 4]) {
        const items = workoutsByWeek[week] || [];
        for (const item of items) {
          if (item?.type === 'workout') {
            workoutCount += 1;
            const img = item?.images?.[0];
            if (!coverImage && img && img !== 'https://via.placeholder.com/300') {
              coverImage = img;
            }
            if (item?.subtitle) {
              const parts = String(item.subtitle).split('•');
              if (parts.length > 1) {
                const dur = parseInt(parts[1], 10);
                if (!isNaN(dur)) totalDuration += dur;
              }
            }
          }
        }
      }

      // Prepare the data to be saved
      const programData = {
        userId: user.uid,
        name: programName,
        focus: focus,
        createdAt: firestore.FieldValue.serverTimestamp(),
        coverImage,
        workoutCount,
        totalDuration,
        difficulty: 'Custom', // Or derived from workouts
      };

      const programRef = firestore().collection('user_programs').doc();

      await programRef.set(programData);
      await firestore().collection('user_program_weeks').doc(programRef.id).set({
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        weeks: workoutsByWeek,
      });

      setSuccessProgramName(programName);
      setShowSuccessModal(true);
      
      // We no longer navigate immediately, wait for user action in modal
    } catch (error) {
      console.error('Error saving program:', error);
      Alert.alert('Error', 'Failed to save program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = () => {
    if (currentWorkouts.length >= 7) {
      setShowLimitAlert(true);
      return;
    }

    router.push({
      pathname: '/screens/AddWorkoutScreen',
      params: { 
        selectionMode: 'true',
        returnTo: '/screens/CreateProgramScreen'
      }
    });
  };

  const addRestDay = () => {
    if (currentWorkouts.length >= 7) {
      setShowLimitAlert(true);
      return;
    }

    const nextDay = currentWorkouts.length + 1;
    const newRestDay = { 
      id: Date.now(), 
      type: 'rest', 
      title: 'Rest Day', 
      subtitle: '', 
      day: nextDay, 
      images: [], 
      extraCount: 0 
    };

    setWorkoutsByWeek({
      ...workoutsByWeek,
      [selectedWeek]: [...currentWorkouts, newRestDay]
    });
  };

  const removeWorkout = (id: number) => {
    const updatedWeekWorkouts = currentWorkouts.filter((w: any) => w.id !== id).map((w: any, index: number) => ({
      ...w,
      day: index + 1
    }));

    setWorkoutsByWeek({
      ...workoutsByWeek,
      [selectedWeek]: updatedWeekWorkouts
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: 'rgba(204, 255, 0, 0.1)' }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[styles.iconButton]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Program</Text>
        </View>
        {/* Added theme toggle for testing, though not in HTML design specifically, it's good for dev */}
        <TouchableOpacity 
          style={[styles.iconButton]}
          onPress={() => setIsDark(!isDark)}
        >
          {isDark ? <Feather name="sun" size={20} color={theme.subtext} /> : <Feather name="moon" size={20} color={theme.subtext} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Program Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>PROGRAM NAME</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.inputBg, 
              color: theme.text,
              borderColor: 'rgba(204, 255, 0, 0.2)'
            }]}
            placeholder="e.g., My Summer Body"
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            value={programName}
            onChangeText={setProgramName}
          />
        </View>

        {/* Training Focus */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>TRAINING FOCUS</Text>
          <View style={styles.grid}>
            {focusOptions.map((option) => {
              const isSelected = focus === option.id;
              const IconLib = option.iconLib;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setFocus(option.id)}
                  style={[
                    styles.focusButton,
                    { 
                      backgroundColor: isSelected ? theme.primary : theme.cardBg,
                      borderColor: isSelected ? theme.primary : 'transparent'
                    }
                  ]}
                >
                  {/* @ts-ignore */}
                  <IconLib name={option.icon} size={20} color={isSelected ? '#1f230f' : theme.text} />
                  <Text style={[
                    styles.focusText, 
                    { color: isSelected ? '#1f230f' : theme.text }
                  ]} numberOfLines={1}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Select Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.label, { color: theme.text, marginBottom: 0 }]}>SELECT WORKOUTS</Text>
          </View>

          {/* Week Selector */}
          <View style={styles.weekSelector}>
            {weeks.map((week) => (
              <TouchableOpacity
                key={week}
                onPress={() => setSelectedWeek(week)}
                style={[
                  styles.weekButton,
                  selectedWeek === week ? styles.weekButtonSelected : styles.weekButtonUnselected,
                  { 
                    backgroundColor: selectedWeek === week ? theme.primary : theme.cardBg,
                    borderColor: selectedWeek === week ? theme.primary : 'transparent'
                  }
                ]}
              >
                <Text style={[
                  styles.weekText,
                  { color: selectedWeek === week ? '#1f230f' : theme.text }
                ]}>Week {week}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.workoutsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
            ) : (
              <>
                {currentWorkouts.map((item: any, index: number) => (
                  <View key={item.id}>
                    {item.type === 'workout' ? (
                      <View style={[styles.workoutCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.workoutHeader}>
                      <View>
                        <View style={styles.dayBadge}>
                          <Text style={styles.dayBadgeText}>DAY {item.day}</Text>
                        </View>
                        <Text style={[styles.workoutTitle, { color: theme.text }]}>{item.title}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                         <TouchableOpacity style={[styles.actionButton, { marginRight: 8 }]} onPress={() => removeWorkout(item.id)}>
                          <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/screens/AddWorkoutScreen')}>
                          <MaterialIcons name="edit" size={20} color={theme.subtext} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={[styles.workoutMeta, { color: theme.subtext }]}>{item.subtitle}</Text>
                    
                    {item.images.length > 0 && (
                      <View style={styles.avatarsContainer}>
                        {item.images.map((img: string, idx: number) => (
                          <Image 
                            key={idx}
                            source={{ uri: img }} 
                            style={[styles.avatar, { borderColor: theme.bg, marginLeft: idx > 0 ? -8 : 0 }]} 
                          />
                        ))}
                        {item.extraCount > 0 && (
                          <View style={[styles.avatarMore, { borderColor: theme.bg, backgroundColor: 'rgba(204, 255, 0, 0.2)', marginLeft: -8 }]}>
                            <Text style={[styles.avatarMoreText, { color: isDark ? theme.primary : '#1f230f' }]}>+{item.extraCount}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  // Rest Day Card
                  <View style={[
                    styles.restCard, 
                    { 
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1'
                    }
                  ]}>
                    <View style={styles.restContent}>
                      <View style={[styles.restIconContainer]}>
                        <MaterialCommunityIcons name="bed-empty" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                      </View>
                      <View>
                        <Text style={[styles.restDayText, { color: theme.subtext }]}>DAY {item.day}</Text>
                        <Text style={[styles.restTitle, { color: theme.text }]}>{item.title}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <TouchableOpacity style={[styles.actionButton, { marginRight: 8 }]} onPress={() => removeWorkout(item.id)}>
                          <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
                        </TouchableOpacity>
                         <TouchableOpacity>
                          <Text style={[styles.changeText, { color: theme.primary }]}>Change</Text>
                        </TouchableOpacity>
                    </View>
                   
                  </View>
                )}
              </View>
            ))}

            {/* Add Buttons Grid */}
            <View style={styles.addButtonsGrid}>
              <TouchableOpacity 
                style={[styles.addWorkoutButton, { backgroundColor: theme.primary }]}
                onPress={addWorkout}
              >
                <MaterialIcons name="add-circle-outline" size={24} color="#1f230f" />
                <Text style={styles.addWorkoutText}>Add Workout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.addRestButton, { borderColor: theme.primary, backgroundColor: isDark ? 'rgba(204, 255, 0, 0.05)' : 'rgba(204, 255, 0, 0.05)' }]}
                onPress={addRestDay}
              >
                <MaterialCommunityIcons name="bed-empty" size={24} color={theme.primary} />
                <Text style={[styles.addRestText, { color: theme.primary }]}>Add Rest Day</Text>
              </TouchableOpacity>
            </View>
              </>
            )}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
            <View style={[styles.successModal, { backgroundColor: isDark ? '#12140a' : '#ffffff', borderColor: 'rgba(204, 255, 0, 0.2)' }]}>
                {/* Visual Ornament */}
                <View style={styles.modalHandle} />
                
                <View style={styles.successContent}>
                    {/* Checkmark */}
                    <View style={styles.checkmarkContainer}>
                        <MaterialIcons name="check-circle" size={60} color={theme.primary} />
                    </View>

                    <Text style={[styles.successTitle, { color: theme.text }]}>Program Saved Successfully!</Text>
                    <Text style={[styles.successMessage, { color: theme.subtext }]}>
                        Your new high-performance routine "{successProgramName}" is now ready in your dashboard.
                    </Text>

                    <View style={styles.successActions}>
                        <TouchableOpacity 
                            style={[styles.successButtonPrimary, { backgroundColor: theme.primary }]}
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace('/screens/MonthlyWorkoutLibraryScreen');
                            }}
                        >
                            <MaterialIcons name="play-arrow" size={24} color="#1f230f" />
                            <Text style={styles.successButtonTextPrimary}>Start Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.successButtonSecondary, { borderColor: theme.primary }]}
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace('/screens/MonthlyWorkoutLibraryScreen');
                            }}
                        >
                            <MaterialIcons name="list-alt" size={24} color={theme.primary} />
                            <Text style={[styles.successButtonTextSecondary, { color: theme.primary }]}>Go to Library</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Optional Thumbnail Card */}
                <View style={[styles.thumbnailContainer, { backgroundColor: 'rgba(204, 255, 0, 0.05)', borderTopColor: 'rgba(204, 255, 0, 0.1)' }]}>
                    <View style={styles.thumbnailContent}>
                        <View style={[styles.thumbnailImage, { borderColor: 'rgba(204, 255, 0, 0.2)', backgroundColor: '#333' }]}>
                             {/* Placeholder image or first workout image */}
                             <MaterialIcons name="fitness-center" size={24} color={theme.primary} />
                        </View>
                        <View>
                            <Text style={styles.thumbnailLabel}>NEW ROUTINE</Text>
                            <Text style={[styles.thumbnailTitle, { color: theme.text }]}>{successProgramName}</Text>
                            <Text style={[styles.thumbnailSubtitle, { color: theme.subtext }]}>Ready to go</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
      </Modal>

      {/* Limit Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLimitAlert}
        onRequestClose={() => setShowLimitAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.alertBox, { backgroundColor: isDark ? '#1f230f' : '#ffffff', borderColor: theme.primary }]}>
            <View style={styles.alertIconContainer}>
              <MaterialIcons name="warning" size={40} color={theme.primary} />
            </View>
            <Text style={[styles.alertTitle, { color: theme.text }]}>Maximum Limit Reached</Text>
            <Text style={[styles.alertMessage, { color: theme.subtext }]}>
              You can only add up to 7 days of workouts/rest per week.
            </Text>
            <TouchableOpacity 
              style={[styles.alertButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowLimitAlert(false)}
            >
              <Text style={styles.alertButtonText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: 'rgba(204, 255, 0, 0.1)' }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE PROGRAM</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'System',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 4,
    textTransform: 'uppercase',
  },
  input: {
    height: 56,
    borderRadius: 999, // rounded-xl
    paddingHorizontal: 16,
    fontSize: 18,
    borderWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  focusButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  focusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  weekButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  weekButtonSelected: {
    // styles handled inline dynamically
  },
  weekButtonUnselected: {
    // styles handled inline dynamically
  },
  weekText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutsContainer: {
    gap: 12,
  },
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dayBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  dayBadgeText: {
    color: '#ccff00',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionButton: {
    padding: 4,
  },
  workoutMeta: {
    fontSize: 14,
    marginBottom: 12,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  avatarMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMoreText: {
    fontSize: 10,
    fontWeight: '700',
  },
  restCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.8,
  },
  restContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restDayText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  restTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addButtonsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  addWorkoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#ccff00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addWorkoutText: {
    color: '#1f230f',
    fontSize: 14,
    fontWeight: '700',
  },
  addRestButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
  },
  addRestText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    backgroundColor: '#ccff00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#1f230f',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIconContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  alertButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#1f230f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successModal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(204, 255, 0, 0.3)',
    alignSelf: 'center',
    marginTop: 12,
  },
  successContent: {
    padding: 24,
    alignItems: 'center',
  },
  checkmarkContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    maxWidth: 280,
  },
  successActions: {
    width: '100%',
    gap: 16,
  },
  successButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
  },
  successButtonTextPrimary: {
    color: '#1f230f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
  },
  successButtonTextSecondary: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  thumbnailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  thumbnailImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailLabel: {
    color: '#ccff00',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  thumbnailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  thumbnailSubtitle: {
    fontSize: 12,
  },
});
