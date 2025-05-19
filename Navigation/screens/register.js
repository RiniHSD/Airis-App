import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telp, setTelp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !telp || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Kata sandi tidak cocok.');
      return;
    }

    console.log('Data yang dikirim:', { name, email, telp, password })
    
    try {
      const res = await fetch('http://192.168.1.6:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, telp, password })
      });

      const data = await res.json();
      console.log('Respon backend:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Registrasi gagal');
      }

      Alert.alert('Success', 'Registrasi berhasil.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saat register:', err);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icons/Icon.png')} style={styles.logo} />
      <Text style={styles.title}>HYDROGIS</Text>

      <View style={styles.formContainer}>
        <Text>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Nama Lengkap"
          placeholderTextColor="#EAEAEA"
          value={name}
          onChangeText={setName}
        />

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Email"
          placeholderTextColor="#EAEAEA"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text>No Telp</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan No Telp"
          keyboardType="phone-pad"
          placeholderTextColor="#EAEAEA"
          value={telp}
          onChangeText={setTelp}
        />

        <Text>Kata Sandi</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Kata Sandi"
          secureTextEntry
          placeholderTextColor="#EAEAEA"
          value={password}
          onChangeText={setPassword}
        />

        <Text>Ulangi Kata Sandi</Text>
        <TextInput
          style={styles.input}
          placeholder="Ulangi Kata Sandi"
          secureTextEntry
          placeholderTextColor="#EAEAEA"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>DAFTAR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Sudah punya akun? Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 20 },
  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: 'black',
  },
  button: { backgroundColor: '#0daaf0', padding: 15, borderRadius: 10, marginTop: 20, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 10, color: '#0daaf0' },
});