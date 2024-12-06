import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomMenu from './BottomMenu';
import Header from './components/Header';

// Mock data for rubrics - replace with actual data source later
const rubrics = [
  "Sat-Practice-Test.pdf",
  "Handwritten-Essay.pdf",
  "Typed-Essay.pdf"
];

export default function Rubrics() {
  const router = useRouter();

  const handleRubricPress = (rubricName) => {
    // TODO: Implement rubric viewing functionality
    console.log(`Opening rubric: ${rubricName}`);
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header title="Rubrics" />

      {/* List of Rubrics */}
      <ScrollView contentContainerStyle={styles.rubricList}>
        {rubrics.map((rubric, index) => (
          <TouchableOpacity
            key={index}
            style={styles.rubricItem}
            onPress={() => handleRubricPress(rubric)}
          >
            <Ionicons name="document-text-outline" size={24} color="#6B46C1" />
            <Text style={styles.rubricText}>{rubric}</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#6B46C1" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Rubric Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <Text style={styles.addButtonText}>Add Rubric</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomMenu router={router} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  addButton: {
    backgroundColor: '#6B46C1', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 100,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rubricList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rubricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    marginBottom: 10,
  },
  rubricText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#2D3748',
  },
});
