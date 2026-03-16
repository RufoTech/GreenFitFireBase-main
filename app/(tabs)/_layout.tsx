import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';
import QuickActionsOverlay from '@/components/QuickActionsOverlay';

export default function TabLayout() {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar 
            {...props} 
            onAddPress={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            isQuickActionsOpen={isQuickActionsOpen}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            title: 'Programs',
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'ACTIONS',
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />

      </Tabs>

      <QuickActionsOverlay 
        visible={isQuickActionsOpen} 
        onClose={() => setIsQuickActionsOpen(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
