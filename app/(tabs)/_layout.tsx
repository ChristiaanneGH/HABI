import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { MessageCircle, Grid3x3 as Grid3X3, Calendar, User } from 'lucide-react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export default function TabLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('transparent', true).catch((e) => {
        console.error('Navigation bar color change failed:', e);
      });
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0041C2',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#f0f0f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HABI',
          tabBarIcon: ({ size, color }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ size, color }) => <Grid3X3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ size, color }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
