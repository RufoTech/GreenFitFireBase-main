import React, { useState, useCallback } from 'react';
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
import auth from '@react-native-firebase/auth';

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

const CATEGORIES = ["All", "Custom", "Chest", "Back", "Legs", "Shoulders", "Arms"];

const EXERCISES: any[] = [];

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");
  const [customWorkouts, setCustomWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchCustomWorkouts = async () => {
        try {
          const user = auth().currentUser;
          if (user) {
            const snapshot = await firestore()
              .collection('customUserWorkouts')
              .where('userId', '==', user.uid)
              .get();

            const fetchedWorkouts = snapshot.docs.map(doc => {
              const data = doc.data();
              // Map level color based on level text
              let levelColor = PRIMARY; // Default Green
              const levelLower = (data.level || '').toLowerCase();
              if (levelLower.includes('beginner')) levelColor = '#3b82f6'; // Blue
              else if (levelLower.includes('advanced')) levelColor = '#ef4444'; // Red

              return {
                id: doc.id,
                ...data,
                muscle: data.target || 'Full Body', // Map target to muscle for filtering
                name: data.title, // Map title to name
                level: data.level || 'Custom',
                levelColor: levelColor,
                duration: data.duration ? (data.duration.toString().includes('min') ? data.duration : `${data.duration} mins`) : '0 mins',
                exercises: data.exerciseCount || 0,
                isCustom: true
              };
            });
            setCustomWorkouts(fetchedWorkouts);
          }
        } catch (error) {
          console.error("Error fetching custom workouts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCustomWorkouts();
    }, [])
  );

  const allItems = [...customWorkouts, ...EXERCISES];

  const filteredExercises = allItems.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || 
                          ex.muscle.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_DARK} />
      
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Library</Text>
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
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 20 }} />
        ) : (
          filteredExercises.map((workout) => {
            const isNoImage = workout.isCustom && (!workout.image || workout.image === 'https://via.placeholder.com/300');

            if (isNoImage) {
              return (
                <TouchableOpacity 
                  key={workout.id} 
                  activeOpacity={0.9}
                  style={styles.noImageCard}
                  onPress={() => {
                    if (workout.isCustom) {
                        router.push({
                            pathname: '/screens/WorkoutDetailsScreen',
                            params: { 
                              id: workout.id,
                              isCustom: 'true'
                            }
                        });
                    }
                  }}
                >
                  <View style={styles.noImageHeader}>
                    <View style={styles.noImageHeaderLeft}>
                      <Text style={[styles.noImageLevelText, { color: workout.levelColor || '#ccff00' }]}>
                        {workout.level}
                      </Text>
                      <Text style={styles.noImageTitle}>{workout.name}</Text>
                    </View>
                  </View>

                  {/* Details Section */}
                  <View style={styles.noImageDetailsRow}>
                    <View style={styles.noImageDetailItem}>
                      <MaterialIcons name="fitness-center" size={16} color="#ccff00" />
                      <Text style={styles.noImageDetailText}>{workout.muscle}</Text>
                    </View>
                    <View style={styles.noImageDetailItem}>
                      <MaterialIcons name="schedule" size={16} color="#ccff00" />
                      <Text style={styles.noImageDetailText}>{workout.duration}</Text>
                    </View>
                    <View style={styles.noImageDetailItem}>
                      <MaterialIcons name="list-alt" size={16} color="#ccff00" />
                      <Text style={styles.noImageDetailText}>{workout.exercises} Exercises</Text>
                    </View>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -35 }}>
                     <TouchableOpacity 
                      style={styles.addButton}
                      onPress={() => {
                        if (workout.isCustom) {
                            router.push({
                                pathname: '/screens/WorkoutDetailsScreen',
                                params: { 
                                  id: workout.id,
                                  isCustom: 'true'
                                }
                            });
                        }
                      }}
                    >
                      <MaterialIcons name="play-arrow" size={24} color="#1f230f" />
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
                onPress={() => {
                    if (workout.isCustom) {
                        router.push({
                            pathname: '/screens/WorkoutDetailsScreen',
                            params: { 
                              id: workout.id,
                              isCustom: 'true'
                            }
                        });
                    }
                }}
              >
                <ImageBackground
                  source={{ uri: workout.image || 'https://via.placeholder.com/300' }}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.cardOverlay}
                  />
                  <View style={[styles.levelBadge, { backgroundColor: workout.levelColor || '#ccff00' }]}>
                    <Text style={styles.levelText}>{workout.level || 'General'}</Text>
                  </View>
                </ImageBackground>
                
                <View style={styles.cardFooter}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{workout.name}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="schedule" size={14} color="#ccff00" />
                        <Text style={styles.metaText}>{workout.duration}</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="fitness-center" size={14} color="#ccff00" />
                        <Text style={styles.metaText}>{workout.exercises} exercises</Text>
                      </View>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.metaItem}>
                        <MaterialIcons name="accessibility" size={14} color="#ccff00" />
                        <Text style={styles.metaText}>{workout.muscle}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                         if (workout.isCustom) {
                            router.push({
                                pathname: '/screens/WorkoutDetailsScreen',
                                params: { 
                                  id: workout.id,
                                  isCustom: 'true'
                                }
                            });
                        }
                    }}
                  >
                    <MaterialIcons name="play-arrow" size={24} color="#1f230f" />
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
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  cardImage: {
    height: 160,
    justifyContent: 'flex-end',
    padding: 12,
    width: '100%',
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
});
