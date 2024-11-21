import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const studentData = {
  "1": {
    progress: [20, 40, 60, 80, 100],
    categories: [
      { title: "Reading Comp.", details: "Detailed Reading analysis..." },
      { title: "Grammar", details: "Grammar progress insights..." },
      {
        title: "Writing Mechanics",
        details: "Mechanics and formatting improvements...",
      },
      { title: "Vocabulary", details: "Vocabulary breakdown..." },
      {
        title: "Critical Thinking",
        details: "Critical thinking tasks performance...",
      },
      {
        title: "Writing Composition",
        details: "Essay writing improvement details...",
      },
    ],
  },
  // Repeat structure for other students...
};

export default function Progress() {
  const router = useRouter();
  const { studentId, studentName } = useLocalSearchParams();
  const student = studentData[studentId] || {};
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>{"< Back"}</Text>
        </Pressable>
        <Text style={styles.title}>{studentName || "Unknown Student"}</Text>
      </View>

      {/* Progress Chart */}
      <Text style={styles.sectionTitle}>Overall Progress</Text>
      <BarChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [{ data: student.progress || [0, 0, 0, 0, 0] }],
        }}
        width={width - 40} // Adjust width dynamically
        height={220}
        chartConfig={{
          backgroundColor: "#6B46C1",
          backgroundGradientFrom: "#6B46C1",
          backgroundGradientTo: "#805AD5",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
        }}
        style={styles.chart}
      />

      {/* Categories with Expandable Details */}
      <FlatList
        data={student.categories}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item, index }) => (
          <View>
            <Pressable
              style={styles.categoryItem}
              onPress={() => toggleDetails(index)}
            >
              <Text style={styles.categoryText}>{item.title}</Text>
            </Pressable>
            {expandedIndex === index && (
              <View style={styles.details}>
                <Text style={styles.detailsText}>{item.details}</Text>
              </View>
            )}
          </View>
        )}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={() => alert("Give Feedback!")}>
          <Text style={styles.buttonText}>Give Feedback</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => alert("Add Notes!")}>
          <Text style={styles.buttonText}>Add Notes</Text>
        </Pressable>
      </View>

      {/* Back to Classes */}
      <Pressable
        style={styles.homeButton}
        onPress={() => router.push("/classes")}
      >
        <Text style={styles.homeButtonText}>Back to Classes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40, // Increased padding for better spacing
    paddingBottom: 30, // Added padding to ensure the button isn't at the edge
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    color: "#6B46C1",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A5568",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B46C1",
    marginVertical: 15,
  },
  chart: {
    marginVertical: 20,
  },
  categoryList: {
    paddingBottom: 20,
  },
  categoryItem: {
    backgroundColor: "#E2E8F0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B46C1",
  },
  details: {
    backgroundColor: "#F7FAFC",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  detailsText: {
    fontSize: 16,
    color: "#4A5568",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#6B46C1",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#805AD5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20, // Added margin to ensure button stays well above the edge
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
