import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock data for rubrics - replace with actual data source later
const rubrics = [
  "test1-rubric.pdf",
  "midterm-rubric.pdf",
  "final-project-rubric.pdf",
  "presentation-rubric.pdf",
  "essay-rubric.pdf"
];

export default function Rubrics() {
  const router = useRouter();

  const handleRubricPress = (rubricName) => {
    // TODO: Implement rubric viewing functionality
    console.log(`Opening rubric: ${rubricName}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#6B46C1" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rubrics</Text>
      </View>

      <ScrollView style={styles.rubricList}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  backText: {
    color: '#6B46C1',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B46C1",
    flex: 1,
    textAlign: "center",
  },
  rubricList: {
    flex: 1,
    paddingHorizontal: 20,
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
