import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomMenu from './BottomMenu';
import Header from './components/Header';

const { width } = Dimensions.get("window");

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Assignment 1", score: 85 },
    { id: 2, title: "Assignment 2", score: 90 },
    { id: 3, title: "Assignment 3", score: 78 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDescription, setNewAssignmentDescription] = useState('');

  const averageScore =
    assignments.reduce((acc, assignment) => acc + assignment.score, 0) /
    assignments.length;

  const router = useRouter();

  const handleNewAssignment = () => {
    setModalVisible(true);
  };

  const handleSaveAssignment = () => {
    // Add new assignment logic here
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Assignments" />
      {/* Progress Chart */}
      <BarChart
        data={{
          labels: assignments.map((a) => a.title),
          datasets: [
            {
              data: assignments.map((a) => a.score),
              color: (opacity = 1) => `#6B46C1`,
            },
          ],
        }}
        width={width - 40}
        height={200}
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `#6B46C1`,
          labelColor: () => "#4A5568",
          barPercentage: 0.8,
          barRadius: 6,
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        style={styles.chart}
        fromZero
      />

      {/* Average Score */}
      <Text style={styles.sectionTitle}>
        Average Score: <Text style={styles.boldText}>{averageScore.toFixed(2)}%</Text>
      </Text>

      <FlatList
        data={assignments}
        renderItem={({ item }) => (
          <View style={styles.assignmentItem}>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
            <Text style={styles.assignmentScore}>{item.score}%</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No assignments available.</Text>
        )}
        contentContainerStyle={styles.assignmentsList}
      />

      {/* New Assignment Button at the Bottom */}
      <Pressable style={styles.newAssignmentButton} onPress={handleNewAssignment}>
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text style={styles.newAssignmentButtonText}>New Assignment</Text>
      </Pressable>

      {/* New Assignment Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Assignment</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Assignment Title</Text>
              <TextInput
                style={styles.input}
                value={newAssignmentTitle}
                onChangeText={setNewAssignmentTitle}
                placeholder="Enter assignment title"
                placeholderTextColor="#A0AEC0"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Describe Assignment</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}  // Adjusted for multiline
                value={newAssignmentDescription}
                onChangeText={setNewAssignmentDescription}
                placeholder="Enter description"
                placeholderTextColor="#A0AEC0"
                multiline
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveAssignment}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomMenu router={router} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 12,
  },
  boldText: {
    fontWeight: "bold",
    color: "#6B46C1",
  },
  chart: {
    marginVertical: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  assignmentsList: {
    paddingHorizontal: 10,
  },
  assignmentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A5568",
  },
  assignmentScore: {
    fontSize: 16,
    color: "#4A5568",
  },
  emptyListText: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    padding: 20,
  },
  newAssignmentButton: {
    backgroundColor: "#6B46C1",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 100, // Adjusted to be slightly higher above the bottom menu
  },
  newAssignmentButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#6B46C1",
  },
  saveButtonText: {
    color: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});
