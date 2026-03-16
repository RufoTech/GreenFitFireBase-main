import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Splash screen'in otomatik kapanmasını engelle (Fontlar yüklenene kadar)
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  
  // Fontları yükle
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !initializing) {
      SplashScreen.hideAsync();
      // Hide navigation bar
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, [loaded, initializing]);

  if (!loaded || initializing) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        {/* 'login' ve 'register' app/ dizininde olduğu için name="login" olmalı */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="screens/OnboardingScreen" />
        <Stack.Screen name="screens/GoalSelectionScreen" />
        <Stack.Screen name="screens/LocationSelectionScreen" />
        <Stack.Screen name="screens/FrequencySelectionScreen" />
        <Stack.Screen name="screens/LevelSelectionScreen" />
        <Stack.Screen name="screens/PersonalDataScreen" />
        <Stack.Screen name="screens/CreateProgramScreen" />
        <Stack.Screen name="screens/WorkoutDetailsScreen" />
        <Stack.Screen name="screens/ExerciseDetailScreen" />
        <Stack.Screen name="screens/AddStepsScreen" />
        <Stack.Screen name="screens/LogWaterScreen" />
        <Stack.Screen name="screens/SleepAlarmScreen" />
        <Stack.Screen name="screens/AddMealScreen" />
        <Stack.Screen name="screens/AddCustomMealScreen" />
        <Stack.Screen name="screens/LogWeightScreen" />
        <Stack.Screen name="screens/BodyFatCalculatorScreen" />
        <Stack.Screen name="screens/MeasurementGuideScreen" />
        <Stack.Screen name="screens/MealDetailsScreen" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
