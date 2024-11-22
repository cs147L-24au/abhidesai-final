import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";

const students = [
  { id: "1", name: "James L." },
  { id: "2", name: "John M." },
  { id: "3", name: "Jack N." },
  { id: "4", name: "Emily R." },
  { id: "5", name: "Sophia T." },
  { id: "6", name: "Oliver P." },
  { id: "7", name: "Liam C." },
  { id: "8", name: "Emma W." },
];

export default function Students() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.studentItem}
            onPress={() =>
              router.push({
                pathname: "/progress",
                params: { studentId: item.id, studentName: item.name },
              })
            }
          >
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.studentName}>{item.name}</Text>
          </Pressable>
        )}
      />
      <Pressable
        style={styles.backButton}
        onPress={() => router.push("/classes")}
      >
        <Text style={styles.backButtonText}>Back to Classes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B46C1",
    marginBottom: 20,
    marginTop: 40, // Add margin for spacing
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  studentItem: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 20,
    flex: 1,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  placeholderText: {
    color: "#6B46C1",
    fontSize: 24,
    fontWeight: "bold",
  },
  studentName: {
    fontSize: 16,
    color: "#4A5568",
  },
  backButton: {
    backgroundColor: "#6B46C1",
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 12,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
