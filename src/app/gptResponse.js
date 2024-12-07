import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Animated, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from './components/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Share } from 'react-native';

export default function Feedback() {
  const { response, imageUri } = useLocalSearchParams();
  const [editableResponse, setEditableResponse] = useState(response);
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef(null);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: editableResponse,
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

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Enter editing mode
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    } else {
      // Exit editing mode
      setEditableResponse(editableResponse.trim());
    }
  };

  const handleCheckmarkPress = () => {
    setIsEditing(false);
    Alert.dismiss();
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
            {isEditing ? (
              <TextInput
                ref={textInputRef}
                style={styles.responseTextInput}
                value={editableResponse}
                onChangeText={setEditableResponse}
                multiline
              />
            ) : (
              <Text style={styles.responseText}>{editableResponse}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={toggleEditing}
        style={[
          styles.floatingEditButton,
          { backgroundColor: isEditing ? "green" : "#6B46C1" },
        ]}
      >
        <MaterialCommunityIcons
          name={isEditing ? "check" : "pencil"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  imageContainer: {
    width: 360,
    height: 300,
    borderWidth: 2,
    borderColor: '#6B46C1',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  image: {
    width: '92%',
    height: '92%',
    borderRadius: 10,
  },
  feedbackContainer: {
    position: 'relative',
    width: 360,
    borderWidth: 2,
    borderColor: '#6B46C1',
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 15,
    alignSelf: 'center',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5568",
    textAlign: 'left',
  },
  responseTextInput: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5568",
    textAlign: 'left',
    minHeight: 60,
  },
  floatingEditButton: {
    position: 'absolute',
    bottom: 365,
    right: 30,
    backgroundColor: '#6B46C1',
    width: 40,
    height: 40,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
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
