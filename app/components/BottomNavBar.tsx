import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const navigateTo = (route: string) => {
    if (pathname === route) return; // Do nothing if the user is already on the target route
    router.push(route); // Navigate to the target route if it's different
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('/')}>
        <MaterialCommunityIcons
          name="home"
          size={28}
          color={pathname === '/' ? '#4a90e2' : '#999'} // Highlight current page
        />
        <Text style={pathname === '/' ? styles.activeText : styles.navText}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('/recommended')}
      >
        <MaterialCommunityIcons
          name="heart"
          size={28}
          color={pathname === '/recommended' ? '#34c759' : '#999'} // Highlight current page
        />
        <Text
          style={
            pathname === '/recommended' ? styles.activeText : styles.navText
          }
        >
          Recommended
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('/profile')}
      >
        <MaterialCommunityIcons
          name="account"
          size={28}
          color={pathname === '/profile' ? '#5856d6' : '#999'} // Highlight current page
        />
        <Text
          style={pathname === '/profile' ? styles.activeText : styles.navText}
        >
          Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo('/login')}
      >
        <MaterialCommunityIcons
          name="logout"
          size={28}
          color={pathname === '/login' ? '#ff3b30' : '#999'} // Highlight current page
        />
        <Text style={pathname === '/login' ? styles.activeText : styles.navText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1e1e2f', // Modern dark theme for the nav bar
    borderTopWidth: 1,
    borderTopColor: '#333', // Subtle border for separation
  },
  navItem: {
    alignItems: 'center',
    flex: 1, // Equal spacing for each item
  },
  navText: {
    color: '#999', // Neutral color for inactive items
    fontSize: 12,
    marginTop: 4, // Space between icon and text
  },
  activeText: {
    color: '#ffffff', // Highlighted text color for the active route
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default BottomNavBar;
