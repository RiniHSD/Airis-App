// App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, PermissionsAndroid, Platform, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Akses Lokasi',
          message: 'Aplikasi membutuhkan akses lokasi untuk menampilkan koordinat.',
          buttonNeutral: 'Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Izinkan',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Izin lokasi ditolak');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      err => setError(err.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://rinihsd.github.io/WebView-PRESISI/peta.html' }}
        style={styles.map}
      />
      <View style={styles.coordContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.coordText}>Latitude: {coords.latitude}</Text>
            <Text style={styles.coordText}>Longitude: {coords.longitude}</Text>
          </>
        )}
        <Button title="Refresh Lokasi" onPress={getLocation} />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  coordContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  coordText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 8,
  },
});
