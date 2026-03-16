import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

interface QuickActionsOverlayProps {
  visible: boolean;
  onClose: () => void;
}

interface QuickActionButtonProps {
  title: string;
  subtitle: string;
  IconComponent: any;
  iconName: string;
  onPress?: () => void;
}

const QuickActionButton = ({ title, subtitle, IconComponent, iconName, onPress }: QuickActionButtonProps) => (
  <TouchableOpacity 
    style={styles.actionButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconContainer}>
      <IconComponent name={iconName} size={28} color="#ccff00" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function QuickActionsOverlay({ visible, onClose }: QuickActionsOverlayProps) {
  // Animation state
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleActionPress = (route: string) => {
      router.push(route as any);
      // Close the menu after navigation has started to ensure instant transition
      setTimeout(() => {
          onClose();
      }, 500);
  };

  return (
    <View
      style={[styles.overlayContainer, StyleSheet.absoluteFill, { zIndex: 1000, elevation: 1000 }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Backdrop - clicking it closes the modal */}
      <Animated.View 
        style={[
          styles.backdrop, 
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={onClose} 
        />
      </Animated.View>

      {/* Content Container */}
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Quick Actions</Text>
        </View>

        <View style={styles.grid}>
          <QuickActionButton 
              title="Add Steps" 
              subtitle="" 
              IconComponent={MaterialCommunityIcons} 
              iconName="shoe-print" 
              onPress={() => handleActionPress('/screens/AddStepsScreen')}
          />
          <QuickActionButton 
              title="Log Water" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="water-drop" 
              onPress={() => handleActionPress('/screens/LogWaterScreen')}
          />
          <QuickActionButton 
              title="Sleep Alarm" 
              subtitle="" 
              IconComponent={Feather} 
              iconName="moon" 
              onPress={() => handleActionPress('/screens/SleepAlarmScreen')}
          />
          <QuickActionButton 
              title="Add Meal" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="restaurant" 
              onPress={() => handleActionPress('/screens/AddMealScreen')}
          />
          <QuickActionButton 
              title="Log Weight" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="monitor-weight" 
              onPress={() => handleActionPress('/screens/LogWeightScreen')}
          />
          <QuickActionButton 
              title="My Program " 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="playlist-add-check" 
              onPress={() => handleActionPress('/screens/ProgramLibraryScreen')}
          />
          <QuickActionButton 
              title="Workout library" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="fitness-center" 
              onPress={() => handleActionPress('/screens/WorkoutLibraryScreen')}
          />
          <QuickActionButton 
              title="Prebuilt exercises" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="dashboard" 
              onPress={() => handleActionPress('/screens/FeaturedRoutinesScreen')}
          />
          <QuickActionButton 
              title="Custom exercises" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="library-add" 
              onPress={() => handleActionPress('/screens/ExerciseLibraryScreen')}
          />
          <QuickActionButton 
              title="Monthly Workout" 
              subtitle="" 
              IconComponent={MaterialIcons} 
              iconName="calendar-today" 
              onPress={() => handleActionPress('/screens/MonthlyWorkoutLibraryScreen')}
          />
        </View>

        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
            <Feather name="x" size={32} color="#1f230f" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 35, 15, 0.6)', // Semi-transparent backdrop
  },
  container: {
    backgroundColor: 'rgba(31, 35, 15, 0.95)', // Nearly opaque background matching the theme
    borderTopLeftRadius: 40, // 2.5rem
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48, // slightly more padding at bottom
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 20,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9', // slate-100
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ccff00',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    width: '100%',
  },
  actionButton: {
    width: '30%', // 3 columns
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64, // w-16
    height: 64, // h-16
    borderRadius: 32, // rounded-full
    backgroundColor: 'rgba(204, 255, 0, 0.15)', // Increased opacity for better visibility
    borderWidth: 1, // border
    borderColor: 'rgba(204, 255, 0, 0.3)', // Increased border opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#ccff00', // shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15, // Increased shadow opacity
    shadowRadius: 15, // 15px
    // elevation removed to prevent black artifact on Android with transparent background
  },
  textContainer: {
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 12, // text-xs
    fontWeight: 'bold',
    color: '#f1f5f9', // slate-100
    textAlign: 'center',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 10, // text-[10px]
    color: '#94a3b8', // slate-400
    textAlign: 'center',
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  closeButton: {
    width: 56, // w-14 (14 * 4 = 56px)
    height: 56, // h-14
    borderRadius: 28,
    backgroundColor: '#ccff00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ccff00',
    shadowOffset: { width: 0, height: 4 }, // 0_4px
    shadowOpacity: 0.3, // rgba(204,255,0,0.3)
    shadowRadius: 15, // 15px
    elevation: 8,
  },
});
