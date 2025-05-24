import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { CoordinateConverter, extractGGAInfo } from '../Helpers/geo_helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


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


const CustomCheckbox = ({ label, checked, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
  >
    <View style={{
      width: 20,
      height: 20,
      borderWidth: 1.5,
      borderColor: '#ccc', // warna border abu
      backgroundColor: checked ? '#00AEEF' : '#fff', // full biru saat dicentang
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      borderRadius: 4,
    }}>
      {checked && (
        <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>
      )}
    </View>
    <Text>{label}</Text>
  </TouchableOpacity>
);

export default function SurveyPage() {
  const internalCoords = useSelector(state => state.streamData?.streams?.['INTERNAL']);
  const streamDataGNGGA = useSelector(state => state.streamData?.streams?.['GNGGA']);
  const [internalBackup, setInternalBackup] = useState(null);
  const internalData = internalCoords ?? internalBackup;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const saluranList = [
    'Saluran Primer Van Der Wijck',
    'Sekunder Cerbonan Kulon',
    'Sekunder Cerbonan Wetan',
    'Sekunder Gancahan', 
    'Sekunder Jamur Kulon', 
    'Sekunder Jamur Wetan', 
    'Sekunder Kergan', 
    'Sekunder Rewulu I', 
    'Sekunder Rewulu II', 
    'Sekunder Sedayu', 
    'Sekunder Sedayu Barat', 
    'Sekunder Sedayu Rewulu', 
    'Sekunder Sedayu Selatan', 
    'Sekunder Sendang Pitu',
  ];

  const [selectedLokasi, setSelectedLokasi] = useState('');
  const [isTersier, setIsTersier] = useState(false);

  const finalLokasi = isTersier
  ? `Saluran Tersier di ${selectedLokasi}`
  : selectedLokasi;

  const kondisiOptions = ['Baik', 'Rusak ringan', 'Rusak sedang', 'Rusak berat'];

  const [isSawah, setIsSawah] = useState(false);
  const [isKolam, setIsKolam] = useState(false);

  const kebutuhan = [
    isSawah ? 'Persawahan' : null,
    isKolam ? 'Kolam' : null,
  ].filter(Boolean).join(', ');

  useEffect(() => {
    const fetchStoredInternal = async () => {
      const saved = await AsyncStorage.getItem('internal_coords');
      if (saved) {
        setInternalBackup(JSON.parse(saved));
      }
    };
    fetchStoredInternal();
  }, []);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    tanggal: '',
    fungsi: '',
    bahan: '',
    kondisi: '',
    luasoncoran: '',
    luaskolam: '',
    keterangantambahan: '',
    foto: '',
  });
  
  let gnssCoords = null;
  let altitude = null;
  let hdop = null;

  try {
    if (streamDataGNGGA) {
      gnssCoords = CoordinateConverter(streamDataGNGGA);
      const info = extractGGAInfo(streamDataGNGGA);
      altitude = info.altitude;
      hdop = info.hdop;
    }
  } catch (error) {
    console.error('Error parsing streamDataGNGGA:', error);
  }

  const handleImagePick = (name) => {
    Alert.alert(
      'Pilih Sumber Gambar',
      'Mengambil gambar dari:',
      [
        {
          text: 'Kamera',
          onPress: () => {
            const options = {
              mediaType: 'photo',
              includeBase64: false,
            };
            launchCamera(options, (response) => {
              if (response.didCancel) {
                console.log('Anda membatalkan pengambilan foto');
              } else if (response.errorCode) {
                console.log('Gagal mengambil foto:', response.errorMessage);
              } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setForm((prevState) => ({ ...prevState, [name]: uri }));
              }
            });
          },
        },
        {
          text: 'Galeri',
          onPress: () => {
            const options = {
              mediaType: 'photo',
              includeBase64: false,
            };
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log('Anda membatalkan pemilihan gambar');
              } else if (response.errorCode) {
                console.log('Gagal memilih gambar:', response.errorMessage);
              } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setForm((prevState) => ({ ...prevState, [name]: uri }));
              }
            });
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const renderImage = (imageUri) => {
    if (imageUri) {
      return <Image source={{ uri: imageUri }} style={styles.imagePreview} />;
    }
  
    return <Image source={require('../assets/icons/camera.png')} style={styles.imageIcon} />;
  };
  

  const handleSubmit = async () => {
    const data = {
      ...form,
      koordinat: `${latitude}, ${longitude}`,
      lokasi: finalLokasi,
      jeniskebutuhan: kebutuhan,
    };

    console.log('Data yang dikirim:', data);
  
    try {
      const res = await fetch('http://192.168.1.9:3000/auth/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menyimpan data');
      Alert.alert('Sukses', 'Data berhasil disimpan');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  

  const renderCardEksternal = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Posisi GPS Geodetik (Presisi)</Text>
        <TouchableOpacity
          style={styles.recordButtonSmall}
          onPress={() => {
            if (gnssCoords?.latitude && gnssCoords?.longitude) {
              setLatitude(gnssCoords.latitude.toString());
              setLongitude(gnssCoords.longitude.toString());
            } else {
              setLatitude('Tidak ada koordinat eksternal');
              setLongitude('Tidak ada koordinat eksternal');
            }
          }}
        >
          <Text style={styles.recordTextSmall}>Rekam</Text>
        </TouchableOpacity>
      </View>
      <Text>Latitude  : {gnssCoords?.latitude ?? '-'}</Text>
      <Text>Longitude : {gnssCoords?.longitude ?? '-'}</Text>
      <Text>Altitude  : {altitude != null ? `${altitude} m` : '-'}</Text>
      <Text>Akurasi  : {hdop != null ? `${hdop} m` : '-'}</Text>
    </View>
  );

  const renderCardInternal = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Posisi Internal (Non Presisi)</Text>
        <TouchableOpacity
          style={styles.recordButtonSmall}
          onPress={() => {
            if (internalData?.latitude && internalData?.longitude) {
              // setSelectedCoords(`${internalData.latitude}, ${internalData.longitude}`);
              setLatitude(internalData.latitude.toString());
              setLongitude(internalData.longitude.toString());
            } else {
              setLatitude('Tidak ada koordinat internal');
              setLongitude('Tidak ada koordinat internal');
            }
          }}
        >
          <Text style={styles.recordTextSmall}>Rekam</Text>
        </TouchableOpacity>
      </View>
      <Text>Latitude  : {internalData?.latitude != null ? internalData.latitude.toFixed(10) : 'Belum tersedia dari GPSHP'}</Text>
      <Text>Longitude : {internalData?.longitude != null ? internalData.longitude.toFixed(10) : 'Belum tersedia dari GPSHP'}</Text>
      <Text>Altitude  : {internalData?.altitude != null ? internalData.altitude.toFixed(2) + ' m' : 'Belum tersedia dari GPSHP'}</Text>
      <Text>Akurasi : {internalData?.accuracy != null ? internalData.accuracy.toFixed(2) + ' m' : 'Belum tersedia dari GPSHP'}</Text>

    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderCardEksternal()}
      {renderCardInternal()}

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Bangunan</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: BSP.7"
            placeholderTextColor="#999"
            value={form.nama}
            backgroundColor="white"
            onChangeText={v => setForm({ ...form, nama: v })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Jenis Bangunan</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Bangunan Sadap"
            placeholderTextColor="#999"
            value={form.jenis}
            backgroundColor="white"
            onChangeText={v => setForm({ ...form, jenis: v })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Koordinat</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ width: 80 }}>Latitude:</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={latitude}
              keyboardType="numeric"
              onChangeText={setLatitude}
              editable={false}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 80 }}>Longitude:</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={longitude}
              keyboardType="numeric"
              onChangeText={setLongitude}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tanggal Update</Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                value={form.tanggal}
                editable={false}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                pointerEvents="none"
              />
              <Image source={require('../assets/icons/calender.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          mode="date"
          open={open}
          date={selectedDate}
          onConfirm={(date) => {
            setOpen(false);
            setSelectedDate(date);
            setForm({ ...form, tanggal: date.toISOString().split('T')[0] });
          }}
          onCancel={() => setOpen(false)}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fungsi Bangunan</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: mengalirkan air ke kolam"
            placeholderTextColor="#999"
            value={form.fungsi}
            backgroundColor="white"
            onChangeText={v => setForm({ ...form, fungsi: v })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bahan Bangunan</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: beton, kayu, dll"
              placeholderTextColor="#999"
              value={form.bahan}
              backgroundColor="white"
              onChangeText={v => setForm({ ...form, bahan: v })}
            />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Lokasi Bangunan</Text>
          {saluranList.map(s => (
            <CustomRadioButton
              key={s}
              label={s}
              selected={selectedLokasi === s}
              onSelect={() => setSelectedLokasi(s)}
            />
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomCheckbox
            label="Saluran Tersier"
            checked={isTersier}
            onToggle={() => setIsTersier(!isTersier)}
          />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kondisi Fisik</Text>
          {kondisiOptions.map(kondisi => (
            <CustomRadioButton
              key={kondisi}
              label={kondisi}
              selected={form.kondisi === kondisi}
              onSelect={() => setForm({ ...form, kondisi })}
            />
          ))}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Luas Oncoran</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 2978.45 Ha"
            placeholderTextColor="#999"
            value={form.luasoncoran}
            backgroundColor="white"
            onChangeText={v => setForm({ ...form, luasoncoran: v })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Jenis Kebutuhan</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomCheckbox label="Persawahan" checked={isSawah} onToggle={() => setIsSawah(!isSawah)} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomCheckbox label="Kolam" checked={isKolam} onToggle={() => setIsKolam(!isKolam)} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Luas Kolam</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 2978.45 Ha"
            placeholderTextColor="#999"
            value={form.luaskolam}
            backgroundColor="white"
            onChangeText={v => setForm({ ...form, luaskolam: v })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Keterangan Tambahan</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: bangunan tertutup semak"
            placeholderTextColor="#999"
            value={form.keterangantambahan}
            backgroundColor="white"
            onChangeText={v => setForm({ ...form, keterangantambahan: v })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Foto Dokumentasi</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => handleImagePick('foto')} style={styles.imageUpload}>
              {renderImage(form.foto)}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={{ marginTop: 20, backgroundColor: '#00AEEF', padding: 10 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>SIMPAN</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordButtonSmall: {
    backgroundColor: '#00AEEF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  recordTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    gap: 10,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 80,
  },
  label: {
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
  },
  formGroup: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 15,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    with: 200,
  },
  imageUpload: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 6,
  },
  inputWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    paddingRight: 35, // beri ruang untuk icon
    backgroundColor: '#fff',
    color: 'black',
  },
  icon: {
    position: 'absolute',
    right: 10,
    width: 20,
    height: 20,
    tintColor: 'gray',
  },
});
