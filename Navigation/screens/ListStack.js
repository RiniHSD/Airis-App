import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListPage from './list';

const Stack = createNativeStackNavigator();

export default function ListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true,headerStyle: {
        backgroundColor: '#0daaf0'
      }, headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff'
      },
      headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="ListPage" component={ListPage} options={{ title: 'DAFTAR BANGUNAN IRIGASI' }} />
    </Stack.Navigator>
  );
}
