import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

export default function ViewTimelineScreen({ route }) {
  const navigation = useNavigation();

  const { timelineId } = route.params || {};
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>View Timeline</Text>
      <Text>Timeline ID: {timelineId}</Text>
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
});
