import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { setStreamData } from '../config/streamSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GPSHP() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    altitude: null,
    accuracy: null,
  });
  
  const webViewRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const startUp = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
      getLocation();
    };

    startUp();
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude,
          accuracy: pos.coords.accuracy,
        };
        setLocation(coords);
        dispatch(setStreamData({ type: 'INTERNAL', data: coords }));
        await AsyncStorage.setItem('internal_coords', JSON.stringify(coords));
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>📍 Lokasi dari HP</Text>
        <Text>Latitude: {location.latitude !== null ? location.latitude.toFixed(10) : 'Memuat...'}</Text>
        <Text>Longitude: {location.longitude !== null ? location.longitude.toFixed(10) : 'Memuat...'}</Text>
        <Text>Altitude : {location.altitude != null ? location.altitude.toFixed(2) + ' m' : '-'}</Text>
        <Text>Akurasi : {location.accuracy != null ? location.accuracy.toFixed(2) + ' m' : '-'}</Text>

        <TouchableOpacity
          style={[styles.scanButton, { marginTop: 20 }]}
          onPress={getLocation}
        >
          <Text style={styles.scanButtonText}>Ambil Ulang Lokasi</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 550, marginVertical: 10 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://rinihsd.github.io/WebView-PRESISI/peta.html' }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  box: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  scanButton: {
    backgroundColor: '#0daaf0',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  scanButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});