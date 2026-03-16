import { Redirect } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f230f' }}>
        <ActivityIndicator size="large" color="#ccff00" />
      </View>
    );
  }

  // Kullanıcı giriş yapmışsa (tabs)'a, değilse Onboarding'e yönlendir
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/screens/OnboardingScreen" />;
}
