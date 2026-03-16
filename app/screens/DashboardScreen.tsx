import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Colors based on user's code
const theme = {
  light: {
    bg: '#f8f8f5',
    text: '#0f172a', // slate-900
    subtext: '#64748b', // slate-500
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0', // slate-200
    primary: '#ccff00',
    navBg: 'rgba(255, 255, 255, 0.95)',
    navBorder: '#e2e8f0',
  },
  dark: {
    bg: '#1f230f',
    text: '#f1f5f9', // slate-100
    subtext: '#94a3b8', // slate-400
    cardBg: 'transparent',
    cardBorder: 'rgba(204, 255, 0, 0.2)',
    primary: '#ccff00',
    navBg: 'rgba(31, 35, 15, 0.95)',
    navBorder: 'rgba(204, 255, 0, 0.2)',
  }
};

export default function DashboardScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const currentTheme = isDark ? theme.dark : theme.light;
  const user = auth().currentUser;

  // GoogleSignin'i yapılandır
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '802032521156-plrtru1qe837u5cr60nl2p5jtsik201b.apps.googleusercontent.com',
    });
  }, []);

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut(); // Google oturumunu kapat
      await auth().signOut(); // Firebase oturumunu kapat
      router.replace('/login'); // Login ekranına yönlendir
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={currentTheme.bg} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: currentTheme.bg }}
      >
        
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: isDark ? 'rgba(31, 35, 15, 0.8)' : 'rgba(248, 248, 245, 0.8)' }]}>
          <View style={styles.headerLeft}>
            <View style={styles.profileContainer}>
              <View style={[styles.profileImageWrapper, { borderColor: currentTheme.primary }]}>
                <Image 
                  source={{ uri: user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDST2ZsxuyNBNuOE4nUWskzn2dek6SkdNpRK-1V8eizyLFPuaDbSrFEYADilFjH73A8aPVJ-3pXHh0_ejVcQyewR8L_MitP5x5soBY-hiBfIxZkHAy3I6wyegKa1SZmU6_hm8nNv9DPGKDenheErnoO88ZCM3DaUSGwqxhlBw8uZ9mwA7B7grgfO2jRxb0VxJQXm94Jy7xfCx2EKk-Ux532x5Isar263C3QiJwA9xzKRHw1aDgKwh24iVDy8FxKJ3Z2kfE7gPybSTE' }} 
                  style={styles.profileImage}
                />
              </View>
              <View style={[styles.onlineStatus, { borderColor: currentTheme.bg }]} />
            </View>
            <View>
              <Text style={[styles.welcomeText, { color: currentTheme.subtext }]}>WELCOME BACK</Text>
              <Text style={[styles.userName, { color: currentTheme.text }]}>Hello, {user?.displayName ? user.displayName.split(' ')[0] : 'Alex'}!</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            
          </View>
        </View>

        {/* Weekly Summary Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: isDark ? currentTheme.cardBg : '#ffffff', borderColor: isDark ? currentTheme.cardBorder : '#e2e8f0' }]}>
            <View style={styles.summaryHeader}>
              <MaterialIcons name="water-drop" size={20} color="#3b82f6" />
              <Text style={[styles.summaryTitle, { color: currentTheme.subtext }]}>Water Intake</Text>
            </View>
            <Text style={[styles.summaryValue, { color: currentTheme.text }]}>1.2 L</Text>
            <View style={styles.trendContainer}>
              <MaterialIcons name="trending-up" size={16} color="#3b82f6" />
              <Text style={[styles.trendText, { color: '#3b82f6' }]}>+0.2 L</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: isDark ? currentTheme.cardBg : '#ffffff', borderColor: isDark ? currentTheme.cardBorder : '#e2e8f0' }]}>
            <View style={styles.summaryHeader}>
              <MaterialCommunityIcons name="shoe-print" size={20} color={isDark ? '#22c55e' : '#15803d'} />
              <Text style={[styles.summaryTitle, { color: currentTheme.subtext }]}>Daily Steps</Text>
            </View>
            <Text style={[styles.summaryValue, { color: currentTheme.text }]}>8,432</Text>
            <View style={styles.trendContainer}>
              <MaterialIcons name="trending-up" size={16} color="#22c55e" />
              <Text style={[styles.trendText, { color: '#22c55e' }]}>+15%</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: isDark ? currentTheme.cardBg : '#ffffff', borderColor: isDark ? currentTheme.cardBorder : '#e2e8f0' }]}>
            <View style={styles.summaryHeader}>
              <MaterialIcons name="fitness-center" size={20} color={currentTheme.subtext} />
              <Text style={[styles.summaryTitle, { color: currentTheme.subtext }]}>Calories Burned</Text>
            </View>
            <Text style={[styles.summaryValue, { color: currentTheme.text }]}>450 kcal</Text>
            <View style={styles.trendContainer}>
              <MaterialIcons name="trending-down" size={16} color="#f87171" />
              <Text style={[styles.trendText, { color: '#f87171' }]}>-5%</Text>
            </View>
          </View>
        </ScrollView>

        {/* Quick Actions Carousel */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.subtext }]}>QUICK ACTIONS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/screens/AddStepsScreen')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <MaterialCommunityIcons name="shoe-print" size={24} color={currentTheme.text} />
              </View>
              <Text style={[styles.actionText, { color: currentTheme.text }]}>Add Steps</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/screens/LogWaterScreen')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <MaterialIcons name="water-drop" size={24} color={currentTheme.text} />
              </View>
              <Text style={[styles.actionText, { color: currentTheme.text }]}>Log Water</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/screens/SleepAlarmScreen')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <Feather name="moon" size={24} color={currentTheme.text} />
              </View>
              <Text style={[styles.actionText, { color: currentTheme.text }]}>Sleep Alarm</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/screens/AddMealScreen')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <MaterialIcons name="restaurant" size={24} color={currentTheme.text} />
              </View>
              <Text style={[styles.actionText, { color: currentTheme.text }]}>Add Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/screens/LogWeightScreen')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <MaterialIcons name="monitor-weight" size={24} color={currentTheme.text} />
              </View>
              <Text style={[styles.actionText, { color: currentTheme.text }]}>Log Weight</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/screens/WorkoutLibraryScreen')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <MaterialIcons name="fitness-center" size={24} color={currentTheme.text} />
              </View>
              <Text style={[styles.actionText, { color: currentTheme.text }]}>Workout Library</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Featured Workout Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitleLarge, { color: currentTheme.text }]}>Today's Workout</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.workoutCard, { borderColor: isDark ? 'rgba(204, 255, 0, 0.1)' : '#e2e8f0' }]}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI3xrdrlqpd6zybsFzh1uoDJW_RAThN-65xFUKUjIeLQpnVnoiBdvHicM2Wbj3MXYdOpqO6j1E4pWY7v1pknlmw5HdeqLDK4incQqa9CJ1ohskwTOTK2lKi8S9Qut8s28hZ1Vj4kHJ0aLsON8HKXM8Z18gFXJvw3nD8r0vvUpsAklNhALnZgZNUuJmw900bxjwFNxIGpFWSFYAR35orgrs2JlRxN-pYuZbTYcTVDChxhRA_3JnNbcYqDUf7MyxIt5HdTKhCvsfG_o' }}
              style={styles.workoutImage}
            >
              <LinearGradient
                colors={['rgba(2, 6, 23, 0.9)', 'rgba(2, 6, 23, 0.4)', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.workoutGradient}
              />
              <View style={styles.workoutContent}>
                <View style={styles.startBadgeContainer}>
                  <View style={styles.startBadge}>
                    <Text style={styles.startBadgeText}>LET'S START</Text>
                  </View>
                  <View style={styles.clockContainer}>
                    <Feather name="clock" size={12} color="#cbd5e1" />
                    <Text style={styles.clockText}>Let's Start</Text>
                  </View>
                </View>
                
                <Text style={styles.workoutTitle}>Your First Program</Text>
                <Text style={styles.workoutDescription} numberOfLines={1}>
                  Design your personalized training plan to get started on your fitness journey.
                </Text>
                
                <TouchableOpacity 
                  style={styles.createProgramButton}
                  onPress={() => router.push('/screens/CreateProgramScreen')}
                >
                  <MaterialIcons name="play-arrow" size={20} color="#1f230f" />
                  <Text style={styles.createProgramText}>Create Training Program</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.subtext }]}>RECENT ACTIVITY</Text>
          <View style={styles.activityContainer}>
            
            <View style={[styles.activityCard, { backgroundColor: isDark ? currentTheme.cardBg : '#ffffff', borderColor: isDark ? currentTheme.cardBorder : '#e2e8f0' }]}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(204, 255, 0, 0.2)' }]}>
                <MaterialIcons name="directions-run" size={20} color={isDark ? '#ccff00' : '#65a30d'} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: currentTheme.text }]}>Morning Run</Text>
                <Text style={[styles.activitySubtitle, { color: currentTheme.subtext }]}>5.2 km • 28 mins</Text>
              </View>
              <Text style={[styles.activityTime, { color: currentTheme.subtext }]}>2h ago</Text>
            </View>

            <View style={[styles.activityCard, { backgroundColor: isDark ? currentTheme.cardBg : '#ffffff', borderColor: isDark ? currentTheme.cardBorder : '#e2e8f0' }]}>
              <View style={[styles.activityIcon, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }]}>
                <Feather name="moon" size={20} color="#3b82f6" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: currentTheme.text }]}>Sleep Score</Text>
                <Text style={[styles.activitySubtitle, { color: currentTheme.subtext }]}>82/100 • 7h 45m</Text>
              </View>
              <Text style={[styles.activityTime, { color: currentTheme.subtext }]}>8h ago</Text>
            </View>

          </View>
        </View>

        {/* Bottom Padding for TabBar */}
        <View style={{ height: 100 }} />

      </ScrollView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImageWrapper: {
    padding: 2,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
  },
  welcomeText: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  summaryCard: {
    width: 160,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
    paddingLeft: 4,
  },
  actionsContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    minWidth: 84,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleLarge: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  workoutGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  workoutContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  startBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  startBadge: {
    backgroundColor: '#ccff00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  startBadgeText: {
    color: '#1f230f',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  workoutTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  workoutDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  createProgramButton: {
    backgroundColor: '#ccff00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  createProgramText: {
    color: '#1f230f',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityContainer: {
    gap: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  fabContainer: {
    position: 'relative',
    top: -24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ccff00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#ccff00",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
  },
});
