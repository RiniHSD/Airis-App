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
import CheckBox from '@react-native-community/checkbox';

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

  const finalLokasi = `${selectedLokasi}${isTersier ? ' + Saluran Tersier' : ''}`;

  useEffect(() => {
    const fetchStoredInternal = async () => {
      const saved = await AsyncStorage.getItem('internal_coords');
      if (saved) {
        setInternalBackup(JSON.parse(saved));
      }
    };
    fetchStoredInternal();
  }, []);

  const [selectedCoords, setSelectedCoords] = useState('');
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    tanggal: '',
    fungsi: '',
    bahan: '',
    lokasi: '',
    kondisi: '',
    luasoncoran: '',
    jeniskebutuhan: '',
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
                setFormData((prevState) => ({ ...prevState, [name]: uri }));
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
                setFormData((prevState) => ({ ...prevState, [name]: uri }));
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
    const cleanPath = (path) => {
      if (path.startsWith("src/")) {
        return path.replace("src/", "");
      }
      return path;
    };
  
    if (imageUri) {
      const cleanedUri = cleanPath(imageUri);
      return <Image source={{ uri: `${BASE_URL}${cleanedUri}` }} style={styles.imagePreview} />;
    }
  
    // Tampilkan ikon kamera jika tidak ada gambar
    return <Image source={require('../assets/icons/camera.png')} style={styles.imageIcon} />;
  };

  const renderCardEksternal = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Posisi GPS Geodetik (Presisi)</Text>
        <TouchableOpacity
          style={styles.recordButtonSmall}
          onPress={() => {
            if (gnssCoords?.latitude && gnssCoords?.longitude) {
              setSelectedCoords(`${gnssCoords.latitude}, ${gnssCoords.longitude}`);
            } else {
              setSelectedCoords('Tidak ada koordinat eksternal');
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
              setSelectedCoords(`${internalData.latitude}, ${internalData.longitude}`);
            } else {
              setSelectedCoords('Tidak ada koordinat internal');
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
        <Text style={styles.label}>Nama Bangunan *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: BSP.7"
          placeholderTextColor="#999"
          value={form.nama}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, nama: v })}
        />

        <Text style={styles.label}>Jenis Bangunan *</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Bangunan Sadap"
          placeholderTextColor="#999"
          value={form.jenis}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, jenis: v })}
        />

        <Text style={styles.label}>Koordinat</Text>
        <TextInput
          style={styles.input}
          value={selectedCoords}
          backgroundColor="white"
          onChangeText={v => setSelectedCoords(v)}
        />

        <Text style={styles.label}>Tanggal Update *</Text>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <TextInput
            style={styles.input}
            value={form.tanggal}
            editable={false}
            placeholder="YYYY-MM-DD"
            backgroundColor="white"
          />
          <Image source={require('../assets/icons/calender.png')} style={styles.icon} />
        </TouchableOpacity>

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

        <Text style={styles.label}>Fungsi Bangunan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: mengalirkan air ke kolam"
          placeholderTextColor="#999"
          value={form.fungsi}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, fungsi: v })}
        />

        <Text style={styles.label}>Bahan Bangunan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: beton, kayu, dll"
          placeholderTextColor="#999"
          value={form.bahan}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, bahan: v })}
        />

        <Text style={styles.label}>Lokasi Bangunan</Text>

        {saluranList.map(s => (
          <TouchableOpacity key={s} onPress={() => setSelectedLokasi(s)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox value={selectedLokasi === s} onValueChange={() => setSelectedLokasi(s)} />
            <Text>{s}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox value={isTersier} onValueChange={setIsTersier} />
          <Text>Saluran Tersier</Text>
        </View>

        <Text style={styles.label}>Kondisi Fisik</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: beton, kayu, dll"
          placeholderTextColor="#999"
          value={form.bahan}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, bahan: v })}
        />

        <Text style={styles.label}>Jenis Kebutuhan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: beton, kayu, dll"
          placeholderTextColor="#999"
          value={form.bahan}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, bahan: v })}
        />

        <Text style={styles.label}>Luas Kolam</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: beton, kayu, dll"
          placeholderTextColor="#999"
          value={form.bahan}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, bahan: v })}
        />

        <Text style={styles.label}>Keterangan Tambahan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: beton, kayu, dll"
          placeholderTextColor="#999"
          value={form.bahan}
          backgroundColor="white"
          onChangeText={v => setForm({ ...form, bahan: v })}
        />


        <Text style={styles.label}>Foto Dokumentasi</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleImagePick('foto')} style={styles.imageUpload} disabled={true}>
            {renderImage(form.foto)}
          </TouchableOpacity>
        </View>
        
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageUpload: {
    width: 100,
    height: 100,
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
});
