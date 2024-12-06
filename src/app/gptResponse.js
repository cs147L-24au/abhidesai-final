import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from './components/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Share } from 'react-native';

export default function Feedback() {
  const { response, imageUri } = useLocalSearchParams();

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: response,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="TA²I Feedback" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.feedbackContainer}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
        <MaterialCommunityIcons name="email-outline" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Share with Student</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center', // Center the overall content horizontally
  },
  imageContainer: {
    width: 360, // Wider frame
    height: 340, // Make the frame square
    borderWidth: 2, // Frame border thickness
    borderColor: '#6B46C1', // Frame border color
    borderRadius: 12, // Slight rounding for the frame
    overflow: 'hidden', // Ensures rounded corners
    marginBottom: 20,
    alignItems: 'center', // Center image inside the frame
    justifyContent: 'center', // Center image inside the frame
    marginTop: -20,
  },
  image: {
    width: '92%', // Slightly smaller than the container's width
    height: '92%', // Slightly smaller than the container's height
    borderRadius: 10, // Slight rounding for the image itself
  },
  feedbackContainer: {
    width: 360, // Match the frame's width for consistency
    borderWidth: 2, // Match the frame's border thickness
    borderColor: '#6B46C1', // Match the frame's border color
    borderRadius: 12, // Slight rounding for consistency
    backgroundColor: 'white',
    padding: 15,
    alignSelf: 'center',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5568",
    textAlign: 'left', // Align text to the left
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -90 }],
    backgroundColor: '#6B46C1',
    width: 180,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 5,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
});
