import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";

// Mock data - replace with actual data later
const assignments = [
  { id: "1", name: "Assignment 1" },
  { id: "2", name: "Midterm Essay" },
  { id: "3", name: "Final Project" },
];

const students = [
  { id: "1", name: "James L." },
  { id: "2", name: "John M." },
  { id: "3", name: "Jack N." },
  { id: "4", name: "Emily R." },
];

export default function Feedback() {
  const router = useRouter();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setSelectedFile(result);
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };

  const handleGenerateFeedback = () => {
    if (!selectedAssignment || !selectedStudent || !selectedFile) {
      alert("Please select all required fields");
      return;
    }
    // TODO: Implement feedback generation
    console.log("Generating feedback...");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#6B46C1" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Feedback</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Assignment Dropdown */}
        <Text style={styles.label}>Select Assignment</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAssignment}
            onValueChange={(itemValue) => setSelectedAssignment(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Choose an assignment..." value="" />
            {assignments.map((assignment) => (
              <Picker.Item
                key={assignment.id}
                label={assignment.name}
                value={assignment.id}
              />
            ))}
          </Picker>
        </View>

        {/* Student Dropdown */}
        <Text style={styles.label}>Select Student</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStudent}
            onValueChange={(itemValue) => setSelectedStudent(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Choose a student..." value="" />
            {students.map((student) => (
              <Picker.Item
                key={student.id}
                label={student.name}
                value={student.id}
              />
            ))}
          </Picker>
        </View>

        {/* File Upload */}
        <Text style={styles.label}>Upload Student Work</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
          <Ionicons name="cloud-upload-outline" size={24} color="#6B46C1" />
          <Text style={styles.uploadText}>
            {selectedFile ? selectedFile.name : "Select File"}
          </Text>
        </TouchableOpacity>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            (!selectedAssignment || !selectedStudent || !selectedFile) &&
              styles.generateButtonDisabled,
          ]}
          onPress={handleGenerateFeedback}
          disabled={!selectedAssignment || !selectedStudent || !selectedFile}
        >
          <Text style={styles.generateButtonText}>Generate Feedback</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="settings-outline" size={24} color="#6B46C1" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.replace("/classes")}
        >
          <Ionicons name="home-outline" size={24} color="#6B46C1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person-outline" size={24} color="#6B46C1" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#6B46C1",
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
    marginTop: 20,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  uploadText: {
    marginLeft: 10,
    color: "#4A5568",
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: "#6B46C1",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  generateButtonDisabled: {
    backgroundColor: "#A0AEC0",
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "white",
  },
  navButton: {
    padding: 10,
  },
});
