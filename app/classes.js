import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const classes = [
  { id: "1", name: "English (5th)", color: "#6B46C1" },
  { id: "2", name: "English (6th)", color: "#805AD5" },
  { id: "3", name: "English (7th)", color: "#9F7AEA" },
  { id: "4", name: "English (8th)", color: "#D6BCFA" },
];

export default function Classes() {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Classes</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => setInfoVisible(true)}>
            <Ionicons name="information-circle-outline" size={28} color="#6B46C1" />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="robot-outline"
            size={32}
            color="#6B46C1"
            style={styles.robotIcon}
          />
        </View>
      </View>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Add a Class</Text>
            <Text style={styles.modalText}>
              To add a class, click on the "Add Class" button (coming soon!). For now, enjoy
              the preset classes.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Class List */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.classList}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.classItem, { backgroundColor: item.color }]}>
            <Text style={styles.classText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cog-outline" size={24} color="#6B46C1" />
          <Text>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#6B46C1" />
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="log-out-outline" size={24} color="#6B46C1" />
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  // Header styling
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3748",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  robotIcon: {
    marginLeft: 10,
  },

  // Modal styling
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2D3748",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#4A5568",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#6B46C1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Class list styling
  classList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  classItem: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 10,
    paddingVertical: 20,
  },
  classText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },

  // Bottom menu styling
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
});
