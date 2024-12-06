import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from './components/Header';

export default function Feedback() {
  const { response, imageUri } = useLocalSearchParams();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: 'white' }]}>  
      <Header title="TA²I Feedback" />
      <View style={[styles.content, { backgroundColor: 'white' }]}>
        <View style={styles.imageContainer}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
        <Animated.View 
          style={[
            styles.feedbackContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.responseText}>{response}</Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B46C1",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: -25,
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  feedbackContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  image: {
    width: width - 40,
    height: width - 40,
    borderRadius: 12,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5568",
    letterSpacing: 0.3,
  },
  header: {
    backgroundColor: "#6B46C1",
    padding: 16,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
