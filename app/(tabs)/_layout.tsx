import { Tabs } from 'expo-router';
import React from 'react';
import { BlurView } from 'expo-blur';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

import { MenuProvider } from '../../context/MenuContext';
import { SidebarOverlay } from '../../components/SidebarOverlay';

// We wrap the tabs inside the MenuProvider to allow Context usage
function TabLayoutInner() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'dark'].tint;
  const inactiveColor = '#888';

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'dark'].background }}>
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: activeColor,
            tabBarInactiveTintColor: inactiveColor,
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#0A0E1A', // Dark navy/black bar for light theme
              borderTopWidth: 0,
              height: 70,
              paddingBottom: 12,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
            }
        }}>
        <Tabs.Screen
            name="index"
            options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="enquiries"
            options={{
            title: 'Enquiries',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "mail" : "mail-outline"} size={22} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="schedule"
            options={{
            title: 'Booking',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="people"
            options={{
            title: 'People',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="explore"
            options={{
            title: 'explore',
            tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
            ),
            }}
        />
        </Tabs>
        
        {/* Render the Sidebar overlay */}
        <SidebarOverlay />
    </View>
  );
}

export default function TabLayout() {
  return (
    <MenuProvider>
       <TabLayoutInner />
    </MenuProvider>
  );
}
