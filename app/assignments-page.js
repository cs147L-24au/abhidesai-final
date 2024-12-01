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
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Assignment 1", score: 85 },
    { id: 2, title: "Assignment 2", score: 90 },
    { id: 3, title: "Assignment 3", score: 78 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const averageScore =
    assignments.reduce((acc, assignment) => acc + assignment.score, 0) /
    assignments.length;

  const router = useRouter();

  const handleNewAssignment = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push("/class-details")}>
          <Ionicons name="arrow-back" size={20} color="#6B46C1" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Assignments</Text>
      </View>

      {/* Average Score */}
      <Text style={styles.sectionTitle}>
        Average Score: <Text style={styles.boldText}>{averageScore.toFixed(2)}%</Text>
      </Text>

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

      {/* Assignments List */}
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.assignmentItem}>
            {item.title}: {item.score}%
          </Text>
        )}
        contentContainerStyle={styles.assignmentsList}
      />

      {/* New Assignment Button */}
      <Pressable style={styles.newAssignmentButton} onPress={handleNewAssignment}>
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text style={styles.newAssignmentButtonText}>New Assignment</Text>
      </Pressable>

      {/* Modal for New Assignment */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Assignment Coming Soon!</Text>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomMenu}>
        <Pressable style={styles.menuItem} onPress={() => router.push("/classes")}>
          <Ionicons name="home-outline" size={24} color="#6B46C1" />
          <Text style={styles.menuText}>Home</Text>
        </Pressable>
        <View style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#6B46C1" />
          <Text style={styles.menuText}>Profile</Text>
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#6B46C1" />
          <Text style={styles.menuText}>Settings</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    color: "#6B46C1",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A5568",
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
    fontSize: 16,
    color: "#4A5568",
    marginVertical: 8,
  },
  newAssignmentButton: {
    backgroundColor: "#6B46C1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: "#6B46C1",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#6B46C1",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: "#F7FAFC",
    position: "absolute",
    bottom: 0,
    width: width,
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
