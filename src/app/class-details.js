import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomMenu from './BottomMenu';
import Header from './components/Header';

const menuItems = [
  { id: "feedback", title: "Feedback", icon: "chatbubble-outline" },
  { id: "students", title: "Students", icon: "people-outline" },
  { id: "rubrics", title: "Rubrics", icon: "list-outline" },
  { id: "diagnostics", title: "Assignments", icon: "analytics-outline" },
];

export default function ClassDetails() {
  const router = useRouter();
  const { className } = useLocalSearchParams();

  const handleMenuPress = (menuId) => {
    if (menuId === "students") {
      router.push("/students");
    } else if (menuId === "rubrics") {
      router.push("/rubrics");
    } else if (menuId === "feedback") {
      router.push("/feedback");
    } else if (menuId === "diagnostics") {
      router.push("/assignments-page");
    } else {
      console.log(`Clicked ${menuId}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Class Details" />
      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.id)}
          >
            <Ionicons name={item.icon} size={32} color="#6B46C1" />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuItem: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  menuText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
  },
});
