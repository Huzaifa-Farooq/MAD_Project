import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';


export default function ViewTimelineScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { timelineId } = route.params || {};
  const [moment, setMoment] = useState(null);

  useEffect(() => {
    const fetchMoment = async () => {
      try {
        const existingMoments = await AsyncStorage.getItem('moments');
        if (existingMoments) {
          const moments = JSON.parse(existingMoments);
          const selectedMoment = moments.find((m) => m.id === timelineId); // Find the moment by id
          setMoment(selectedMoment);
        }
      } catch (error) {
        console.error('Error fetching moment:', error);
      }
    };

    fetchMoment();
  }, [timelineId]);

  if (!moment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Moment not found!</Text>
      </View>
    );
  }

  const renderMediaItem = ({ item }) => {
    if (item.endsWith('.mp4') || item.endsWith('.mov')) {
      return (
        <Video
          source={{ uri: item }}
          style={styles.media}
          useNativeControls
          resizeMode="contain"
        />
      );
    } else {
      return <Image source={{ uri: item }} style={styles.media} />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{moment.title}</Text>
      <Text style={styles.date}>{moment.date}</Text>

      {moment.media.length > 0 && moment.media[0] && (
        <Image source={{ uri: moment.media[0] }} style={styles.mainImage} />
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator style={styles.mediaList}>
        {moment.media.map((uri, index) => (
          <View key={index} style={styles.mediaWrapper}>
            {renderMediaItem({ item: uri })}
          </View>
        ))}
      </ScrollView>

      <Text style={styles.desc}>{moment.desc}</Text>
      <Text style={styles.address}>Location: {moment.address}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff3b30' }]}
          onPress={async () => {
            try {
              const existingMoments = await AsyncStorage.getItem('moments');
              if (existingMoments) {
                const moments = JSON.parse(existingMoments);
                const updatedMoments = moments.filter((m) => m.id !== timelineId); // Remove the moment
                await AsyncStorage.setItem('moments', JSON.stringify(updatedMoments));
                alert('Moment deleted successfully!');
                navigation.navigate('Home');
              }
            } catch (error) {
              console.error('Error deleting moment:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  date: { fontSize: 16, color: '#777', marginBottom: 16 },
  desc: { marginTop: 20, fontSize: 16, lineHeight: 22 },
  address: { marginTop: 10, fontSize: 14, color: '#555' },
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  mediaList: { 
    marginBottom: 16,
    padding: 10,
  },
  mediaWrapper: {
    marginRight: 10,
  },
  media: {
    width: 300,
    height: 200,
    borderRadius: 12,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  button: {
    padding: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
});