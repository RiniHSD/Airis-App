import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountPage from './account';

const Stack = createNativeStackNavigator();

export default function UserStack() {
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
      <Stack.Screen name="AccountPage" component={AccountPage} options={{ title: 'PROFIL PENGGUNA' }} />
    </Stack.Navigator>
  );
}
