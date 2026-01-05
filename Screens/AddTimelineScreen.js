import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system/legacy';
import { Video } from 'expo-av';


const copyMediaToAppDirectory = async (uri) => {
  const directoryPath = `${FileSystem.documentDirectory}TimeLineTracker/`;
  await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });
  try {
    const fileName = uri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });
    return newPath;
  } catch (error) {
    console.error('Error copying media:', error);
    return null;
  }
};

export default function AddTimelineScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [media, setMedia] = useState([
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const location = currentLocation.coords;
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);
      setAddress(address);
    })();
  }, []);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      let response = await Location.reverseGeocodeAsync({ latitude, longitude });
      return `${response[0].name}, ${response[0].city}, ${response[0].region}`;
    } catch (error) {
      console.error(error);
      return 'Unknown location';
    }
  };

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (!result.canceled) {
      const copiedMedia = await Promise.all(
        result.assets.map(async (asset) => {
          const newUri = await copyMediaToAppDirectory(asset.uri);
          return newUri;
        })
      );

      console.log(copiedMedia);

      setMedia((prevMedia) => [...prevMedia, ...copiedMedia]);
    }
  };

  const saveMoment = async () => {
    if (!title || !date || !desc) {
      alert('Please fill all fields');
      return;
    }

    const moment = {
      title,
      date: date.toISOString().split('T')[0],
      desc,
      address,
      media,
    };

    try {
      const existingMoments = await AsyncStorage.getItem('moments');
      const moments = existingMoments ? JSON.parse(existingMoments) : [];
      let momentId = 1;
      if (moments.length > 0) {
        momentId = moments[moments.length - 1].id + 1;
      }
      moment.id = momentId;
      
      moments.push(moment);
      await AsyncStorage.setItem('moments', JSON.stringify(moments));
      alert('Moment saved successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving moment:', error);
    }
  };

  const onDateChange = ({ selectedDate }) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Timeline Moment</Text>
      <Text>Record Moment at: {address ? address : 'loading location...'}</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => { setShowDatePicker(true); }} style={styles.input}>
        <Text>{date ? date.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>
      {
        showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )
      }

      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        multiline
        style={[styles.input, { height: 120 }]}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickMedia}>
        <Text style={styles.uploadText}>Attach Image / Video</Text>
      </TouchableOpacity>

      {media.length > 0 && (
        <View>
          <Text>Selectd iamges</Text>
          <ScrollView horizontal style={styles.mediaContainer}>
            {media.map((uri, index) => {
              console.log(uri);
              return (
                <View key={index} style={styles.mediaItem}>
                  {uri.endsWith('.mp4') || uri.endsWith('.mov') ? (
                    <Video
                      source={{ uri }}
                      style={styles.mediaPreview}
                      useNativeControls
                      resizeMode="contain"
                    />
                  ) : (
                    <Image source={{ uri: uri }} style={styles.mediaPreview} />
                  )}
                </View>
              )
            })}
          </ScrollView>
        </View>

      )}

      <TouchableOpacity style={styles.button} onPress={saveMoment}>
        <Text style={styles.buttonText}>Save Moment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  uploadButton: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: { fontSize: 16, color: '#555' },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  mediaItem: {
    marginRight: 10,
  },
  mediaPreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  mediaContainer: {
    marginBottom: 20,
  },
});