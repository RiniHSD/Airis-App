import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FaQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: '1. Bagaimana cara mempersiapkan aplikasi sebelum digunakan?',
      answer: 'Sebelum menggunakan aplikasi AIRIS, pastikan:\n\n- Perangkat Anda mendukung GPS\n- Koneksi internet stabil untuk sinkronisasi data awal\n- Aplikasi telah mendapatkan izin lokasi\n- Akun Anda telah terdaftar dan diverifikasi\n- Perangkat GNSS telah terhubung dan dikalibrasi'
    },
    {
      question: '2. Bagaimana cara menghubungkan aplikasi dengan perangkat GNSS geodetik?',
      answer: 'Langkah menghubungkan perangkat GNSS geodetik:\n\n1. Aktifkan Bluetooth pada perangkat\n2. Buka menu "Pengaturan" di aplikasi AIRIS\n3. Pilih "Koneksi Perangkat"\n4. Cari perangkat GNSS Anda dalam daftar\n5. Ketuk nama perangkat untuk menghubungkan\n6. Tunggu hingga status berubah menjadi "Terhubung"\n7. Verifikasi koneksi dengan melihat akurasi pada peta'
    },
    {
      question: '3. Bagaimana cara menambahkan data bangunan baru?',
      answer: 'Untuk menambahkan bangunan baru:\n\n- Buka menu "Input Data"\n- Pilih jenis bangunan yang akan ditambahkan\n- Isi formulir data bangunan\n- Gunakan peta untuk menentukan lokasi bangunan\n- Tekan tombol "Simpan" setelah semua data terisi\n- Data akan langsung tersinkronisasi ke server'
    },
    {
      question: '4. Bagaimana cara mengedit atau menghapus data yang sudah ada?',
      answer: 'Langkah edit/hapus data:\n\n- Buka menu "Daftar Bangunan"\n- Cari bangunan yang ingin diedit/dihapus\n- Ketuk ikon pensil untuk edit atau ikon sampah untuk hapus\n- Untuk edit: perbaiki data lalu tekan "Simpan"\n- Untuk hapus: konfirmasi penghapusan data\n- Perubahan akan langsung tersinkronisasi ke server'
    },
    {
      question: '5. Bagaimana cara mengunduh data dalam format CSV?',
      answer: 'Untuk mengunduh data:\n\n- Buka menu "Daftar Bangunan"\n- Tekan tombol "Download CSV" di bagian atas\n- Pilih lokasi penyimpanan di perangkat Anda\n- Data akan diunduh dalam format CSV\n- File CSV dapat dibuka di Excel atau aplikasi spreadsheet lainnya'
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Pertanyaan yang Sering Diajukan</Text>
      
      {faqData.map((item, index) => (
        <View key={index} style={styles.accordionItem}>
          <TouchableOpacity 
            style={styles.questionContainer}
            onPress={() => toggleAccordion(index)}
          >
            <Text style={styles.questionText}>{item.question}</Text>
            <Image 
              source={
                activeIndex === index 
                  ? require('../assets/icons/up.png') 
                  : require('../assets/icons/down.png')
              }
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          
          {activeIndex === index && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>{item.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center',
  },
  accordionItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e3f2fd',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  answerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answerText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  arrowIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});