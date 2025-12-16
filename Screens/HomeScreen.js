  import React from 'react';
  import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
  import { useNavigation } from '@react-navigation/native';


  const sampleData = [
    { id: '1', title: 'Trip to Tokyo', date: '2024-08-12', image: 'https://hips.hearstapps.com/hmg-prod/images/high-angle-view-of-tokyo-skyline-at-dusk-japan-royalty-free-image-1664309926.jpg' },
    { id: '2', title: 'Graduation Day', date: '2023-06-01', image: 'https://carolettings.com/wp-content/uploads/2021/06/shutterstock_658847998-1.jpg' },
  ];

  export default function HomeScreen() {
    const navigation = useNavigation();
    
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('ViewTimeline', { timelineId: item.id })}
      >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
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

        <FlatList
          data={sampleData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

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
    addButton: {
      backgroundColor: '#007AFF',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 16,
    },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  });
