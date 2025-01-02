// app/(tabs)/_layout.tsx
import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { 
          backgroundColor: '#1e1e2f', // A modern dark tone for the header
          shadowColor: 'transparent', // Remove shadow for a cleaner look
        },
        headerTintColor: '#ffffff', // White text/icons for good contrast
        headerTitleStyle: {
          fontWeight: 'bold', // Bold titles for emphasis
          fontSize: 18, // Slightly larger font for readability
        },
        headerBackTitleVisible: false, // Hide the back title for cleaner navigation
      }}
    >
      <Stack.Screen
        name="index" // Main entry point
        options={{ 
          title: 'Home',
          headerStyle: { backgroundColor: '#4a90e2' }, // Unique color for Home
          headerLeft: () => null, // Remove back button
        }}
      />
      <Stack.Screen
        name="explore"
        options={{ 
          title: 'Explore',
          headerStyle: { backgroundColor: '#34c759' }, // Green for exploration vibe
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false, // Full custom layout for Login
        }}
      />
      <Stack.Screen
        name="profile"
        options={{ 
          title: 'Profile',
          headerStyle: { backgroundColor: '#5856d6' }, // Calming blue-purple tone
          headerLeft: () => null, // Remove back button
        }}
      />
    </Stack>
  );
}
