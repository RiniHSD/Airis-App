import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import BASE_URL from '../config/url';

export default function AccountPage({ navigation, onLogout  }) {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    nama_irigasi: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log('USER ID:', userId);

        const res = await fetch(`${BASE_URL}/auth/user/${userId}`);

        if (!res.ok) {
          console.log('Status:', res.status);
          throw new Error('Gagal mengambil data pengguna');
        }

        const data = await res.json();
        console.log('DATA DARI SERVER:', data);

        setUserInfo({
          name: data.name,
          email: data.email,
          nama_irigasi: data.nama_irigasi,
        });
      } catch (error) {
        console.error('GAGAL FETCH USER:', error.message);
        Alert.alert('Error', 'Tidak bisa mengambil data pengguna');
      }
    };

    fetchUser();
  }, []);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Nama:</Text>
            <Text style={styles.value}>{userInfo.name}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Konfirmasi Logout',
                'Yakin ingin keluar dari aplikasi?',
                [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Keluar', style: 'destructive', onPress: onLogout },
                ],
                { cancelable: true }
              );
            }}
          >
            <Image source={require('../assets/icons/logout.png')} style={styles.logoutIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email:</Text>
        <Text
          style={[styles.value, styles.link]}
          onPress={() => Linking.openURL(`mailto:${userInfo.email}`)}
        >
          {userInfo.email}
        </Text>
        <Text style={styles.label}>Nama Daerah Irigasi:</Text>
        <Text style={styles.value}>{userInfo.nama_irigasi}</Text>

      </View>

      <View style={styles.box}>
        <Text style={styles.subheading}>Tentang Aplikasi</Text>
        <Text style={styles.description}>
          Aplikasi Mobile GIS yang dirancang untuk membantu proses pemetaan jaringan irigasi secara
          praktis, efisien, dan mudah digunakan berbagai pihak.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.subheading}>Kontak Pengembang</Text>
        <Text style={styles.description}>
          Rini Husadiyah (21/474373/SV/18906){"\n"}
          Program Studi Sarjana Terapan{"\n"}
          Sistem Informasi Geografis{"\n"}
          Departemen Teknologi Kebumian{"\n"}
          Sekolah Vokasi{"\n"}
          Universitas Gadjah Mada
        </Text>

        <Text style={styles.text1}>
          Lihat proyek lain dari pengembang di sini:
        </Text>

        <TouchableOpacity onPress={() => Linking.openURL('https://drive.google.com/file/d/12XAL3Lt--pM5rEpibtlvYU9IX3Oo5xhA/view')}>
          <Text style={[styles.link1, { marginTop: 5 }]}>🌐 https://Portofolio-RiniHusadiyah.com</Text>
        </TouchableOpacity>

        <View style={styles.socialIcons}>
          {[
            { url: 'https://www.linkedin.com/in/rinihusadiyah/', icon: require('../assets/icons/linkedin.png') },
          ].map((item, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)}>
              <Image source={item.icon} style={styles.icon} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.footer}>©2025 - All right reserved</Text>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0daaf0',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  text1: {
    fontWeight: 'bold',
    marginTop: 20
  },
  value: {
    marginBottom: 10,
    fontSize: 15,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  link1: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 20
  },
  subheading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  footer: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    color: '#555',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 10,
    marginRight: 25,
  },
});
