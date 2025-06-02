import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GPSPage from './GPSPage';
import GPSHP from './GPSHP';
import GPSGNSS from './GPSGNSS';

const Stack = createNativeStackNavigator();

export default function GPSStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true,headerStyle: {
        backgroundColor: '#0daaf0'
      }, headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff',
      },
      headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="GPSPage" component={GPSPage} options={{ title: 'KONEKSI ALAT' }} />
      <Stack.Screen name="GPSHP" component={GPSHP} options={{ title: 'Pengukuran GNSS Non Presisi' }} />
      <Stack.Screen name="GPSGNSS" component={GPSGNSS} options={{ title: 'Pengukuran GNSS Presisi' }} />
    </Stack.Navigator>
  );
}
