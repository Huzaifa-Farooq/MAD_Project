import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';


export default function AddTimelineScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const location = currentLocation["coords"];
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);
      setAddress(address);

    })
  })

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

      <TextInput
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        multiline
        style={[styles.input, { height: 120 }]}
      />

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>Attach Image / Video</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} >
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
});
