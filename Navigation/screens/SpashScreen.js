import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen() {
  return (
    <LinearGradient colors={[ '#ffffff', '#0daaf0', '#43bbf0', '#6dcdf7']} style={styles.container}>
        <Image source={require('../assets/icons/IconAiris.png')} style={styles.image} />
        <Text style={styles.title}>AIRIS</Text>
        <Text style={styles.text}>Aplikasi Pemetaan Irigasi Sistematis</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
});
