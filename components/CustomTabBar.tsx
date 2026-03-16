import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CustomTabBarProps = BottomTabBarProps & {
  onAddPress?: () => void;
  isQuickActionsOpen?: boolean;
};

const CustomTabBar = ({ state, descriptors, navigation, onAddPress, isQuickActionsOpen }: CustomTabBarProps) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isQuickActionsOpen ? 1 : 0,
      duration: 300, // Matched with overlay duration
      useNativeDriver: true,
      easing: Easing.out(Easing.ease), // Add easing for smoothness
    }).start();
  }, [isQuickActionsOpen]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName: any;
        if (route.name === 'index') iconName = 'home';
        else if (route.name === 'programs') iconName = 'format-list-bulleted';
        else if (route.name === 'create') iconName = 'add';
        else if (route.name === 'calendar') iconName = 'calendar-today';
        else if (route.name === 'profile') iconName = 'person';
        else iconName = 'circle'; // Fallback

        // Special styling for Create button
        if (route.name === 'create') {
            const handleCreatePress = () => {
                if (onAddPress) {
                    onAddPress();
                } else {
                    onPress();
                }
            };

            return (
                <TouchableOpacity
                    key={index}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarTestID}
                    onPress={handleCreatePress}
                    onLongPress={onLongPress}
                    style={styles.navItem}
                    activeOpacity={0.8}
                >
                    <Animated.View style={[styles.createButton, { transform: [{ rotate: rotateInterpolation }] }]}> 
                        <MaterialIcons name="add" size={32} color="#1f230f" style={{ marginLeft: 2 }} />
                    </Animated.View>
                    <Text style={[styles.navText, isFocused && styles.activeText]}>
                        ACTIONS
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={iconName}
              size={24}
              color={isFocused ? '#ccff00' : '#94a3b8'}
            />
            <Text style={[styles.navText, isFocused && styles.activeText]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 35, 15, 0.95)', // Slightly more opaque for visibility
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    zIndex: 50,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#94a3b8', // slate-400
    marginTop: 4,
  },
  activeText: {
    color: '#ccff00', // primary color
  },
  createButton: {
    backgroundColor: '#ccff00', // primary color
    width: 64, // w-16
    height: 64, // h-16
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginTop: -40, // -top-8 approx -32px, but need to account for layout. -40 pushes it up more.
    shadowColor: '#ccff00',
    shadowOffset: {
      width: 0,
      height: 8, // 0_8px
    },
    shadowOpacity: 0.3, // 0.3
    shadowRadius: 20, // 20px
    elevation: 10,
    borderWidth: 0, // No border in the new design for the button itself, just shadow
  },
});

export default CustomTabBar;
