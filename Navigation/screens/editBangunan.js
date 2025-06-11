import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomPicker from '../assets/CustomPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/url';
import LOCAL_URL from '../config/localhost';

const CustomRadioButton = ({ label, selected, onSelect }) => (
  <TouchableOpacity
    onPress={onSelect}
    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
  >
    <View style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    }}>
      {selected && (
        <View style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#00AEEF',
        }} />
      )}
    </View>
    <Text>{label}</Text>
  </TouchableOpacity>
);

export default function EditBangunan() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bangunan } = route.params;

  const [form, setForm] = useState({});
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedLokasi, setSelectedLokasi] = useState('');
  const [finalLokasi, setFinalLokasi] = useState('');
  const [isTersier, setIsTersier] = useState(false);
  const [isSawah, setIsSawah] = useState(false);
  const [isKolam, setIsKolam] = useState(false);
  const [isKebun, setIsKebun] = useState(false);

  useEffect(() => {
    setForm({
      nama: bangunan.name || '',
      jenis: bangunan.jenis || '',
      fungsi: bangunan.fungsi || '',
      bahan: bangunan.bahan || '',
      kondisi: bangunan.kondisi || '',
      lokasi: bangunan.lokasi || '',
      luassawah: bangunan.luassawah || '',
      luaskebun: bangunan.luaskebun || '',
      luaskolam: bangunan.luaskolam || '',
      luasoncoran: bangunan.luasoncoran || '',
      keterangantambahan: bangunan.keterangantambahan || '',
      foto: bangunan.foto || '',
    });

    setSelectedLokasi(bangunan.lokasi || '');
    setIsTersier((bangunan.lokasi || '').includes('Tersier'));

    setIsSawah((bangunan.jeniskebutuhan || '').includes('Persawahan'));
    setIsKolam((bangunan.jeniskebutuhan || '').includes('Kolam'));
    setIsKebun((bangunan.jeniskebutuhan || '').includes('Perkebunan'));

    const [lat, lon] = (bangunan.koordinat || '').split(',').map((coord) => coord.trim());
    setLatitude(lat || '');
    setLongitude(lon || '');
  }, []);

  useEffect(() => {
    let lokasi = selectedLokasi;
    if (isTersier) lokasi += ' - Tersier';
    setFinalLokasi(lokasi);
  }, [selectedLokasi, isTersier]);

  const kebutuhan = [
    isSawah ? 'Persawahan' : null,
    isKolam ? 'Kolam' : null,
    isKebun ? 'Perkebunan' : null,
  ].filter(Boolean).join(', ');

  const handleSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/bangunan/${bangunan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.nama,
          jenis: form.jenis,
          fungsi: form.fungsi,
          bahan: form.bahan,
          kondisi: form.kondisi,
          lokasi: finalLokasi,
          jeniskebutuhan: kebutuhan,
          luassawah: form.luassawah,
          luaskebun: form.luaskebun,
          luaskolam: form.luaskolam,
          luasoncoran: form.luasoncoran,
          keterangantambahan: form.keterangantambahan,
          foto: form.foto,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal memperbarui data');

      Alert.alert('Sukses', 'Data berhasil diperbarui', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Kode Bangunan</Text>
      <TextInput value={form.nama} onChangeText={(text) => setForm({ ...form, nama: text })} style={styles.input} />

      <Text>Nama Bangunan</Text>
      <TextInput value={form.jenis} onChangeText={(text) => setForm({ ...form, jenis: text })} style={styles.input} />

      <Text>Fungsi</Text>
      <TextInput value={form.fungsi} onChangeText={(text) => setForm({ ...form, fungsi: text })} style={styles.input} />

      <Text>Bahan</Text>
      <TextInput value={form.bahan} onChangeText={(text) => setForm({ ...form, bahan: text })} style={styles.input} />

      <Text>Kondisi Fisik</Text>
      <CustomRadioButton selected={form.kondisi} onChange={(val) => setForm({ ...form, kondisi: val })} />

      <Text>Lokasi</Text>
      <CustomPicker selectedValue={selectedLokasi} onValueChange={setSelectedLokasi} />

      <Text>Saluran Tersier</Text>
      <TouchableOpacity onPress={() => setIsTersier(!isTersier)}>
        <Text>{isTersier ? '✅ Ya' : '❌ Tidak'}</Text>
      </TouchableOpacity>

      <Text>Jenis Kebutuhan</Text>
      <TouchableOpacity onPress={() => setIsSawah(!isSawah)}><Text>{isSawah ? '✅ Sawah' : '❌ Sawah'}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setIsKolam(!isKolam)}><Text>{isKolam ? '✅ Kolam' : '❌ Kolam'}</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setIsKebun(!isKebun)}><Text>{isKebun ? '✅ Kebun' : '❌ Kebun'}</Text></TouchableOpacity>

      <Text>Luas Sawah</Text>
      <TextInput value={form.luassawah} onChangeText={(text) => setForm({ ...form, luassawah: text })} style={styles.input} />

      <Text>Luas Kebun</Text>
      <TextInput value={form.luaskebun} onChangeText={(text) => setForm({ ...form, luaskebun: text })} style={styles.input} />

      <Text>Luas Kolam</Text>
      <TextInput value={form.luaskolam} onChangeText={(text) => setForm({ ...form, luaskolam: text })} style={styles.input} />

      <Text>Keterangan Tambahan</Text>
      <TextInput value={form.keterangantambahan} onChangeText={(text) => setForm({ ...form, keterangantambahan: text })} style={styles.input} />

      <Text>Koordinat</Text>
      <TextInput value={latitude} editable={false} style={styles.disabledInput} />
      <TextInput value={longitude} editable={false} style={styles.disabledInput} />

      <Button title="Simpan Perubahan" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#eee',
    color: '#888',
  },
});
