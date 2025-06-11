import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, TextInput, Image, Alert  } from 'react-native';
import BASE_URL from '../config/url';
import LOCAL_URL from '../config/localhost';
import { useNavigation } from '@react-navigation/native';


export default function ListPage() {

  const [bangunan, setBangunan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const navigation = useNavigation();

  useEffect(() => {
    const fetchBangunan = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/bangunan`);
        const data = await res.json();
        setBangunan(data.features.map((f) => f.properties)); // karena getBangunanIrigasi return FeatureCollection
      } catch (err) {
        console.error('Gagal memuat data bangunan:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBangunan();
  }, []);

  const handleDeleteBangunan = async (id) => {
    try {
      console.log('🧠 Menampilkan Alert konfirmasi hapus...');
      Alert.alert(
        'Konfirmasi',
        'Yakin ingin menghapus data bangunan ini?',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: async () => {
              const res = await fetch(`${BASE_URL}/auth/bangunan/${id}`, {
                method: 'DELETE',
              });
  
              const result = await res.json();
              if (!res.ok) throw new Error(result.error || 'Gagal menghapus');
  
              // Refresh data
              setBangunan((prev) => prev.filter((b) => b.id !== id));
              Alert.alert('Sukses', 'Data bangunan berhasil dihapus');
            },
          },
        ],
        { cancelable: true }
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.jenis}</Text>
      <Text style={styles.cell}>{item.lokasi}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Titiklokasi', { bangunan: item })}>
          <Image source={require('../assets/icons/view.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditBangunan', { bangunan: item })}>
          <Image source={require('../assets/icons/edit.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          console.log('🗑️ Tombol hapus ditekan untuk id:', item.id);
          handleDeleteBangunan(item.id);
        }}>
          <Image source={require('../assets/icons/delete.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Memuat data bangunan...</Text>
      </View>
    );
  }

  
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Tabel */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell]}>Kode Bangunan</Text>
        <Text style={[styles.cell, styles.headerCell]}>Nama Bangunan</Text>
        <Text style={[styles.cell, styles.headerCell]}>Lokasi Bangunan</Text>
        <Text style={[styles.cell, styles.headerCell]}>Aksi</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Cari bangunan..."
        placeholderTextColor="#ccc"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={bangunan.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.jenis.toLowerCase().includes(searchText.toLowerCase()) ||
          item.lokasi.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
        ListFooterComponent={() =>
          (currentPage * pageSize < bangunan.length ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setCurrentPage((prev) => prev + 1)}
            >
              <Text style={styles.loadMoreText}>Muat Lebih</Text>
            </TouchableOpacity>
          ) : null)
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#E3F2FD',
    marginTop: 10,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 14,
    color: '#333',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  iconContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  icon: {
    marginHorizontal: 5,
    width: 18,
    height: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginBottom: 70,
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  loadMoreButton: {
    padding: 12,
    backgroundColor: '#0daaf0',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});