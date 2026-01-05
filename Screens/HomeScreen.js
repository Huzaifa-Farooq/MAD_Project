import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function HomeScreen() {
  const navigation = useNavigation();
  const [moments, setMoments] = useState([]);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const existingMoments = await AsyncStorage.getItem('moments');
        if (existingMoments) {
          setMoments(JSON.parse(existingMoments));
        }
      } catch (error) {
        console.error('Error fetching moments:', error);
      }
    };

    fetchMoments();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ViewTimeline', { timelineId: item.id })}
    >
      <View style={styles.card}>
        {item.media.length > 0 && (
          <Image source={{ uri: item.media[0] }} style={styles.image} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Life Timeline</Text>

      {moments && moments.length > 0 ? (
        <FlatList
          data={moments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noMomentsText}>No moments added yet. Start by adding one!</Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTimeline')}
      >
        <Text style={styles.addButtonText}>+ Add Moment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 180 },
  textContainer: { padding: 10 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardDate: { fontSize: 14, color: '#777', marginTop: 4 },
  noMomentsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});