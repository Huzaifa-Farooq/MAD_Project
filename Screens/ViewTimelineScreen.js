import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ViewTimelineScreen({ route }) {
  const navigation = useNavigation();
  const { timelineId } = route.params || {};

  const mock = {
    title: 'Sample Timeline Event',
    date: '2024-01-01',
    media: [
      { id: '1', type: 'image', uri: 'https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-tokyo-skyline-at-dusk-japan-royalty-free-image-1664309926.jpg' },
      { id: '2', type: 'image', uri: 'https://carolettings.com/wp-content/uploads/2021/06/shutterstock_658847998-1.jpg' },
      { id: '3', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: '4', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: '5', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: '6', type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    description: 'This is a placeholder description for a timeline moment. You can replace with real data.',
  };

  const mainImage = mock.media.find((item) => item.type === 'image'); // Main image
  const otherMedia = mock.media.filter((item) => item.id !== mainImage?.id); // Other media

  const renderMediaItem = ({ item }) => {
    if (item.type === 'image') {
      return <Image source={{ uri: item.uri }} style={styles.media} />;
    } else if (item.type === 'video') {
      return (
        <View style={styles.videoContainer}>
          <Text style={styles.videoPlaceholder}>Video Placeholder</Text>
          {/* Replace the Text with a video player component like `react-native-video` */}
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{mock.title}</Text>
      <Text style={styles.date}>{mock.date}</Text>

      {/* Main Image */}
      {mainImage && <Image source={{ uri: mainImage.uri }} style={styles.mainImage} />}

      {/* Scrollable Media List with Scrollbar */}
      <ScrollView horizontal showsHorizontalScrollIndicator style={styles.mediaList}>
        {otherMedia.map((item) => (
          <View key={item.id} style={styles.mediaWrapper}>
            {renderMediaItem({ item })}
          </View>
        ))}
      </ScrollView>

      <Text style={styles.desc}>{mock.description}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#007AFF' }]}
          onPress={() => navigation.navigate('AddTimeline', { editing: true })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff3b30' }]}
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
  videoContainer: {
    width: 300,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: { color: '#fff', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  button: {
    padding: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});