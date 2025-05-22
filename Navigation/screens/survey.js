import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { CoordinateConverter, extractGGAInfo } from '../Helpers/geo_helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SurveyPage() {
  const internalCoords = useSelector(state => state.streamData?.streams?.['INTERNAL']);
  const streamDataGNGGA = useSelector(state => state.streamData?.streams?.['GNGGA']);
  const [internalBackup, setInternalBackup] = useState(null);
  const internalData = internalCoords ?? internalBackup;

  useEffect(() => {
    const fetchStoredInternal = async () => {
      const saved = await AsyncStorage.getItem('internal_coords');
      if (saved) {
        setInternalBackup(JSON.parse(saved));
      }
    };
    fetchStoredInternal();
  }, []);

  const [selectedCoords, setSelectedCoords] = useState('');
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    tanggal: '',
    fungsi: '',
    bahan: '',
  });
  
  let gnssCoords = null;
  let altitude = null;
  let hdop = null;

  try {
    if (streamDataGNGGA) {
      gnssCoords = CoordinateConverter(streamDataGNGGA);
      const info = extractGGAInfo(streamDataGNGGA);
      altitude = info.altitude;
      hdop = info.hdop;
    }
  } catch (error) {
    console.error('Error parsing streamDataGNGGA:', error);
  }

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Akses Lokasi',
  //           message: 'Aplikasi membutuhkan akses lokasi untuk membaca koordinat GPS.',
  //           buttonPositive: 'Izinkan',
  //           buttonNegative: 'Tolak',
  //         }
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     }
  //     return true;
  //   };

  //   const getLocation = async () => {
  //     const hasPermission = await requestLocationPermission();
  //     if (!hasPermission) {
  //       console.warn('❌ Izin lokasi ditolak oleh user');
  //       return;
  //     }

  //     Geolocation.getCurrentPosition(
  //       position => {
  //         setInternalCoords({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //         });
  //       },
  //       error => {
  //         console.warn('⚠️ Gagal mendapatkan posisi internal:', error.message);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 20000,
  //         maximumAge: 1000,
  //         forceRequestLocation: true,
  //         showLocationDialog: true,
  //       }
  //     );
  //   };

  //   getLocation();
  // }, []);

  const renderCardEksternal = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>GNSS Eksternal (Presisi)</Text>
        <TouchableOpacity
          style={styles.recordButtonSmall}
          onPress={() => {
            if (gnssCoords?.latitude && gnssCoords?.longitude) {
              setSelectedCoords(`${gnssCoords.latitude}, ${gnssCoords.longitude}`);
            } else {
              setSelectedCoords('Tidak ada koordinat eksternal');
            }
          }}
        >
          <Text style={styles.recordTextSmall}>Rekam</Text>
        </TouchableOpacity>
      </View>
      <Text>Latitude  : {gnssCoords?.latitude ?? '-'}</Text>
      <Text>Longitude : {gnssCoords?.longitude ?? '-'}</Text>
      <Text>Altitude  : {altitude != null ? `${altitude} m` : '-'}</Text>
      <Text>Akurasi  : {hdop != null ? `${hdop} m` : '-'}</Text>
    </View>
  );

  const renderCardInternal = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>GNSS Internal (Non Presisi)</Text>
        <TouchableOpacity
          style={styles.recordButtonSmall}
          onPress={() => {
            if (internalData?.latitude && internalData?.longitude) {
              setSelectedCoords(`${internalData.latitude}, ${internalData.longitude}`);
            } else {
              setSelectedCoords('Tidak ada koordinat internal');
            }
          }}
        >
          <Text style={styles.recordTextSmall}>Rekam</Text>
        </TouchableOpacity>
      </View>
      <Text>Latitude  : {internalData?.latitude != null ? internalData.latitude.toFixed(10) : 'Belum tersedia dari GPSHP'}</Text>
      <Text>Longitude : {internalData?.longitude != null ? internalData.longitude.toFixed(10) : 'Belum tersedia dari GPSHP'}</Text>
      <Text>Altitude  : {internalData?.altitude != null ? internalData.altitude.toFixed(2) : 'Belum tersedia dari GPSHP'}</Text>
      <Text>Akurasi : {internalData?.accuracy != null ? internalData.accuracy.toFixed(2) : 'Belum tersedia dari GPSHP'}</Text>

    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderCardEksternal()}
      {renderCardInternal()}

      <View style={styles.form}>
        <Text style={styles.label}>Nama Bangunan *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: BSP.7"
          placeholderTextColor="#999"
          value={form.nama}
          onChangeText={v => setForm({ ...form, nama: v })}
        />

        <Text style={styles.label}>Jenis Bangunan *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Bangunan Sadap"
          placeholderTextColor="#999"
          value={form.jenis}
          onChangeText={v => setForm({ ...form, jenis: v })}
        />

        <Text style={styles.label}>Koordinat</Text>
        <TextInput
          style={styles.input}
          value={selectedCoords}
          onChangeText={v => setSelectedCoords(v)}
        />

        <Text style={styles.label}>Tanggal Update *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={form.tanggal}
          onChangeText={v => setForm({ ...form, tanggal: v })}
        />

        <Text style={styles.label}>Fungsi Bangunan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: mengalirkan air ke kolam"
          placeholderTextColor="#999"
          value={form.fungsi}
          onChangeText={v => setForm({ ...form, fungsi: v })}
        />

        <Text style={styles.label}>Bahan Bangunan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: beton, kayu, dll"
          placeholderTextColor="#999"
          value={form.bahan}
          onChangeText={v => setForm({ ...form, bahan: v })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordButtonSmall: {
    backgroundColor: '#00AEEF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  recordTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    gap: 10,
    marginTop: 16,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
  },
});
