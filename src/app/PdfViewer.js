import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function PdfViewer({ route }) {
  const { pdfName } = route.params;
  const pdfUri = `/Users/abhi/OH/TA2I/src/app/pdfs/${pdfName}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: pdfUri }}
        style={styles.pdfViewer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdfViewer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
