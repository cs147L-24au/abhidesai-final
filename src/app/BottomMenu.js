import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: "#F7FAFC",
    position: "absolute",
    bottom: 0,
    width: "100%", // Ensure the width is 100%
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuItem: {
    alignItems: "center",
  },
  menuText: {
    color: "#6B46C1",
    fontSize: 14,
  },
});

const BottomMenu = () => {
  const router = useRouter();

  return (
    <View style={styles.bottomMenu}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/settings')}
      >
        <Ionicons name="settings-outline" size={24} color="#6B46C1" />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/classes')}
      >
        <Ionicons name="home-outline" size={24} color="#6B46C1" />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/profile')}
      >
        <Ionicons name="person-outline" size={24} color="#6B46C1" />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenu;