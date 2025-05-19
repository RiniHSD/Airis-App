import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service'
import { useSelector } from 'react-redux';
import { CoordinateConverter, extractGGAInfo } from '../Helpers/geo_helpers';

export default function SurveyPage() {
  console.log("Component SurveyPage dirender");

  const [internalCoords, setInternalCoords] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState('');
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    tanggal: '',
    fungsi: '',
    bahan: '',
  });

  // const streamDataGNGGA = useSelector(state => state.streamData.streams['GNGGA']);
  // const gnssCoords = streamDataGNGGA ? CoordinateConverter(streamDataGNGGA) : null;
  // const { altitude, hdop } = streamDataGNGGA ? extractGGAInfo(streamDataGNGGA) : {};

  const streamDataGNGGA = useSelector(state => {
    const data = state?.streamData?.streams?.['GNGGA'];
    console.log("streamDataGNGGA:", data);
    return data;
  });

  console.log("streamDataGNGGA:", streamDataGNGGA);
  
  let gnssCoords = null;
  let altitude, hdop;
  
  try {
    if (streamDataGNGGA) {
      gnssCoords = CoordinateConverter(streamDataGNGGA);
      console.log("GNSS Koordinat:", gnssCoords);
  
      const info = extractGGAInfo(streamDataGNGGA);
      altitude = info.altitude;
      hdop = info.hdop;
      console.log("GNSS Altitude dan HDOP:", altitude, hdop);
    }
  } catch (e) {
    console.error("Error parsing streamDataGNGGA:", e);
  }
  

  // useEffect(() => {
  //   const getPermission = async () => {
  //     try {
  //       if (Platform.OS === 'android') {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //         );
  //         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           console.warn("Izin lokasi ditolak");
  //           return;
  //         }
  //       }
  
  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log("Posisi internal berhasil didapat:", position);
  //           setInternalCoords(position.coords);
  //         },
  //         (error) => {
  //           console.warn("Error mengambil posisi internal:", error.message);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //       );
  //     } catch (err) {
  //       console.error("Error di getPermission:", err);
  //     }
  //   };
  //   getPermission();
  // }, []);
  

  // const handleRecord = () => {
  //   if (gnssCoords?.latitude && gnssCoords?.longitude) {
  //     setSelectedCoords(`${gnssCoords.latitude}, ${gnssCoords.longitude}`);
  //   } else if (internalCoords) {
  //     setSelectedCoords(`${internalCoords.latitude}, ${internalCoords.longitude}`);
  //   } else {
  //     setSelectedCoords('Tidak ada koordinat tersedia');
  //   }
  // };

  const handleRecord = () => {
    console.log("Handle Record dipanggil");
    if (gnssCoords?.latitude && gnssCoords?.longitude) {
      console.log("Menggunakan GNSS eksternal");
      setSelectedCoords(`${gnssCoords.latitude}, ${gnssCoords.longitude}`);
    } else if (internalCoords) {
      console.log("Menggunakan GPS internal");
      setSelectedCoords(`${internalCoords.latitude}, ${internalCoords.longitude}`);
    } else {
      console.warn("Tidak ada koordinat tersedia");
      setSelectedCoords('Tidak ada koordinat tersedia');
    }
  };
  

  const renderCard = (title, coords, alt, acc) => (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text>Latitude  : {coords?.latitude ?? '-'}</Text>
      <Text>Longitude : {coords?.longitude ?? '-'}</Text>
      <Text>Altitude  : {alt != null ? `${alt} m` : '-'}</Text>
      <Text>Accuracy  : {acc != null ? `${acc} m` : '-'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* {renderCard('GNSS Eksternal', gnssCoords, altitude, hdop)}
      {renderCard('GPS Internal', internalCoords, internalCoords?.altitude, internalCoords?.accuracy)} */}

      <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
        <Text style={styles.recordText}>Record Coordinates</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.label}>Nama Bangunan *</Text>
        <TextInput style={styles.input} placeholder="Contoh: BSP.7" value={form.nama} onChangeText={v => setForm({...form, nama: v})} />

        <Text style={styles.label}>Jenis Bangunan *</Text>
        <TextInput style={styles.input} placeholder="Contoh: Bangunan Sadap" value={form.jenis} onChangeText={v => setForm({...form, jenis: v})} />

        <Text style={styles.label}>Koordinat</Text>
        <TextInput style={styles.input} value={selectedCoords} editable={false} />

        <Text style={styles.label}>Tanggal Update *</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={form.tanggal} onChangeText={v => setForm({...form, tanggal: v})} />

        <Text style={styles.label}>Fungsi Bangunan</Text>
        <TextInput style={styles.input} placeholder="Contoh: mengalirkan air ke kolam" value={form.fungsi} onChangeText={v => setForm({...form, fungsi: v})} />

        <Text style={styles.label}>Bahan Bangunan</Text>
        <TextInput style={styles.input} placeholder="Contoh: beton, kayu, dll" value={form.bahan} onChangeText={v => setForm({...form, bahan: v})} />
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
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recordButton: {
    backgroundColor: '#00AEEF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  recordText: {
    color: 'white',
    fontWeight: 'bold',
  },
  form: {
    gap: 10,
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
