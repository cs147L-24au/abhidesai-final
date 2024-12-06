import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomMenu from './BottomMenu';
import { useRouter } from 'expo-router';
import Header from './components/Header';

const Settings = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.sectionItem}>Change Password</Text>
        <Text style={styles.sectionItem}>Privacy Settings</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text style={styles.sectionItem}>Email Notifications</Text>
        <Text style={styles.sectionItem}>Push Notifications</Text>
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

export default Settings;
