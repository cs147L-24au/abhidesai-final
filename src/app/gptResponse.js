import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

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
          <Text style={styles.title}>AI Feedback</Text>
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
    backgroundColor: "white",
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: width - 40,
    height: width - 40,
  },
  feedbackContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5568",
    letterSpacing: 0.3,
  },
});
