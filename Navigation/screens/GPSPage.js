import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function GPSPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilih Mode Pengukuran</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f2f2f2' }]}
        onPress={() => navigation.navigate('GPSGNSS')}
      >
        <Image source={require('../assets/icons/satellite.png')} style={{ width: 70, height: 70 }} />
        <Text style={styles.buttonText}>Pengukuran dengan GNSS presisi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f2f2f2' }]}
        onPress={() => navigation.navigate('GPSHP')}
      >
        <Image source={require('../assets/icons/phone.png')} style={{ width: 70, height: 70 }} />
        <Text style={styles.buttonText}>Pengukuran dengan GNSS non presisi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});
