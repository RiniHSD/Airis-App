import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountPage({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setUserInfo(user);
      }
    };
    getUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>PROFIL PENGGUNA</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Nama:</Text>
        <Text style={styles.value}>{userInfo.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text
          style={[styles.value, styles.link]}
          onPress={() => Linking.openURL(`mailto:${userInfo.email}`)}
        >
          {userInfo.email}
        </Text>

        <Image source={require('../assets/icons/logout.png')} style={styles.icon} />
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
            { url: 'https://wa.me/6282286461937', icon: require('../assets/icons/whatsapp.png') },
            { url: 'https://www.instagram.com/hsdyh.rn', icon: require('../assets/icons/instagram.png') },
            { url: 'mailto:rinihusadiyah@gmail.com', icon: require('../assets/icons/email.png') },
            { url: 'https://www.linkedin.com/in/rinihusadiyah/', icon: require('../assets/icons/linkedin.png') },
            { url: 'https://github.com/RiniHSD', icon: require('../assets/icons/github.png') },
          ].map((item, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)}>
              <Image source={item.icon} style={styles.icon} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.footer}>© SIG UGM 2025 - All right reserved</Text>
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
    backgroundColor: '#007AFF',
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
    marginTop: 15,
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
});
