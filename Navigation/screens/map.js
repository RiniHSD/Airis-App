import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { PermissionsAndroid, Platform } from 'react-native';

export default function MapPage() {
  return (
    <View style={styles.container}>
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
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  formGroup: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#fff',
    width: '95%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  containerMap: {
    height: 680,
    width: '95%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
});