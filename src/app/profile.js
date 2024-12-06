import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from './components/Header';
import BottomMenu from './BottomMenu';

const Profile = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <Text style={styles.sectionItem}>Name: John Doe</Text>
        <Text style={styles.sectionItem}>Email: john.doe@example.com</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Text style={styles.sectionItem}>Language: English</Text>
        <Text style={styles.sectionItem}>Timezone: GMT-5</Text>
      </View>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
  },
  section: {
    width: '90%',
    marginBottom: 20,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: 10,
  },
  sectionItem: {
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 5,
  },
});

export default Profile;
