import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

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

  const renderModal = (
    visible,
    setVisible,
    data,
    selectedValue,
    setSelectedValue,
    title
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={24} color="#4A5568" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedValue?.id === item.id && styles.modalItemSelected,
                ]}
                onPress={() => {
                  setSelectedValue(item);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedValue?.id === item.id && styles.modalItemTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
                {selectedValue?.id === item.id && (
                  <Ionicons name="checkmark" size={24} color="#6B46C1" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

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
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Ionicons name="information-circle-outline" size={28} color="#6B46C1" />
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>How to Use Feedback</Text>
            <Text style={styles.infoModalText}>
              Select an assignment and a student to provide feedback.
              You can also upload documents for review.
            </Text>
            <TouchableOpacity
              style={styles.infoCloseButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.infoCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Assignment Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Assignment</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowAssignmentModal(true)}
          >
            <Text style={styles.selectionText}>
              {selectedAssignment ? selectedAssignment.name : "Select Assignment"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#6B46C1" />
          </TouchableOpacity>
        </View>

        {/* Student Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Student</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowStudentModal(true)}
          >
            <Text style={styles.selectionText}>
              {selectedStudent ? selectedStudent.name : "Select Student"}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#6B46C1" />
          </TouchableOpacity>
        </View>

        {/* File Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Student Work</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
            <Ionicons name="cloud-upload-outline" size={24} color="#6B46C1" />
            <Text style={styles.uploadText}>
              {selectedFile ? selectedFile.name : "Upload File"}
            </Text>
          </TouchableOpacity>
        </View>

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

      {/* Modals */}
      {renderModal(
        showAssignmentModal,
        setShowAssignmentModal,
        assignments,
        selectedAssignment,
        setSelectedAssignment,
        "Select Assignment"
      )}
      {renderModal(
        showStudentModal,
        setShowStudentModal,
        students,
        selectedStudent,
        setSelectedStudent,
        "Select Student"
      )}

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
    justifyContent: "space-between",
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
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 12,
  },
  selectionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  selectionText: {
    fontSize: 16,
    color: "#4A5568",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  uploadText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4A5568",
  },
  generateButton: {
    backgroundColor: "#6B46C1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  generateButtonDisabled: {
    backgroundColor: "#A0AEC0",
  },
  generateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalItemSelected: {
    backgroundColor: "#F7FAFC",
  },
  modalItemText: {
    fontSize: 16,
    color: "#4A5568",
  },
  modalItemTextSelected: {
    color: "#6B46C1",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  infoModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D3748",
  },
  infoModalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4A5568",
    marginBottom: 20,
  },
  infoCloseButton: {
    backgroundColor: "#6B46C1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  infoCloseButtonText: {
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
