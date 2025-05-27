import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapPage() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Peta Jaringan Irigasi</Text>
          <Text style={styles.label}>Daerah Irigasi</Text>
        </View>

        <View style={styles.containerMap}>
          <WebView
            source={{ uri: 'https://rinihsd.github.io/WebView-AIRIS/peta.html' }}
            style={styles.webView}
          />
        </View>
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  formGroup: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#fff',
    width: '90%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerMap: {
    flex: 1,
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
});