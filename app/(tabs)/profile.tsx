import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';

// MenuItem Component
const MenuItem = ({ icon, title, onPress, isLogout = false }: { icon: any, title: string, onPress?: () => void, isLogout?: boolean }) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      styles.menuItem,
      isLogout && styles.logoutItem
    ]}
  >
    <View style={[
      styles.menuIconContainer,
      isLogout ? styles.logoutIconContainer : styles.normalIconContainer
    ]}>
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={isLogout ? '#ef4444' : '#ffffff'} 
      />
    </View>
    <Text style={[
      styles.menuText,
      isLogout && styles.logoutText
    ]}>{title}</Text>
    {!isLogout && (
      <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.5)" />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth().currentUser;

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      router.replace('/login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f230f" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="settings" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="share" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8mttEzcj68e2smSHj5-Poz8YBp9ORfWqUTtNtoWy9XwTnJ25F4N4zYevqy_BGLRYFbCRZiN92UOLn7gzGV8bgwRpkTf47Qxo3NfUAv_-RySfJS7qJSWMFn8H-QHov978AOxy1qOO_vB8rBJIAh4t6VpQj2E7uWlbZiNp0LYVOLxyvTCU0MfwzjX8xr0gccyI430Vagc3vqQeUEGUi0Lk92VB698zAw6V5T8_dPSRNBdOZetPy9v5NLYEQJ3x9ezNC4zL4nzM1WZM' }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color="#1f230f" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName || 'Alex Johnson'}</Text>
            <Text style={styles.userJoined}>Member since January 2023</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardNormal]}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Text style={styles.statValue}>2.4k</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={[styles.statCard, styles.statCardNormal]}>
            <Text style={styles.statValue}>856</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>ACCOUNT SETTINGS</Text>
          
          <MenuItem 
            icon="person" 
            title="Personal Information" 
            onPress={() => router.push('/screens/PersonalDataScreen')} 
          />
          <MenuItem icon="fitness-center" title="My Programs" />
          <MenuItem icon="emoji-events" title="Achievements" />
          <MenuItem icon="notifications" title="Notifications" />
          <MenuItem icon="settings" title="Settings" />
          <MenuItem icon="help" title="Help & Support" />
          
          <View style={styles.divider} />
          
          <MenuItem 
            icon="logout" 
            title="Logout" 
            isLogout 
            onPress={handleLogout} 
          />
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
    backgroundColor: '#1f230f',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#1f230f',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // paddingHorizontal: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#ccff00',
    padding: 4,
    backgroundColor: '#1f230f',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccff00',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1f230f',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userJoined: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statCardNormal: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statCardHighlight: {
    backgroundColor: 'rgba(204, 255, 0, 0.2)',
    borderColor: 'rgba(204, 255, 0, 0.3)',
  },
  statValue: {
    color: '#ccff00',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 16,
    gap: 4,
  },
  menuHeader: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  logoutItem: {
    marginTop: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoutIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutText: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
});
