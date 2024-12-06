import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from 'expo-av';

const { width } = Dimensions.get("window");

const onboardingPages = [
  {
    id: "1",
    icon: "robot",
    title: "Hi, I'm TA²I, your AI Teaching Assistant!",
    description:
      "",
  },
  {
    id: "2",
    icon: "archive-check-outline",
    title: "Give Feedback",
    description:
      "Give Feedback lets you create, customize, and submit feedback using AI. Submitted feedback is returned to students via your LMS, and appears as annotations!",
  },
  {
    id: "3",
    icon: "file-document-outline",
    title: "Rubrics",
    description:
      "Rubrics lets you view and edit the rubric or answer key for any active assignments.",
  },
  {
    id: "4",
    icon: "account-group-outline",
    title: "Students",
    description:
      "Easily view progress and provide feedback for enrolled students.",
  },
  {
    id: "5",
    icon: "cog-outline",
    title: "Settings",
    description:
      "Visit Settings to link your Canvas, GradeScope, Google Classroom, or other accounts!",
  },
  {
    id: "6",
    icon: "magnify",
    title: "Assignment Hub",
    description:
      "Create targeted assessments for your students with full control over amount, type, and subject of the questions.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const flatListRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState("");

  const playSound = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(require('../../assets/robot.wav'));
    await newSound.playAsync();
    setSound(newSound);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  useEffect(() => {
    playSound();

    return () => {
      stopSound();
    };
  }, []);

  useEffect(() => {
    if (currentIndex === 0) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }).start();

      const text = onboardingPages[0].title;
      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => prev + text[index]);
        index++;
        if (index === text.length) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingPages.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = () => {
    stopSound();
    router.push('/classes');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={onboardingPages}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={styles.iconContainer}>
              {item.id === "1" ? (
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <MaterialCommunityIcons name={item.icon} size={120} color="#6B46C1" />
                </Animated.View>
              ) : (
                <MaterialCommunityIcons name={item.icon} size={120} color="#6B46C1" />
              )}
            </View>
            <Text style={styles.title}>{item.id === "1" ? typedText : item.title}</Text>
            {item.id !== "1" && <Text style={styles.description}>{item.description}</Text>}
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        ref={flatListRef}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === onboardingPages.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  page: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#F7FAFC",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2D3748",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#6B46C1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
