import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomMenu from './BottomMenu';
import Header from './components/Header';

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
  const width = Dimensions.get('window').width;

  const renderItem = ({ item }) => (
    <TouchableOpacity
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Students" />
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />

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
  listContainer: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'center',
    gap: 20,
  },
  studentItem: {
    alignItems: "center",
    width: Dimensions.get('window').width * 0.4,
    marginBottom: 30,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6B46C1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  placeholderText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  studentName: {
    fontSize: 16,
    color: "#4A5568",
    marginTop: 4,
  },
});
